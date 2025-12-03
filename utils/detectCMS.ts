// utils/detectCMS.ts
export async function detectCMSFromUrl(url: string) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "CMS-Checker/1.0"
      }
    });

    const html = await res.text();
    const headers = Object.fromEntries(res.headers.entries());

    return detectAll(html, headers);
  } catch (e) {
    return {
      cms: "Unbekannt",
      confidence: 0,
      reason: "URL konnte nicht geladen werden."
    };
  }
}

export function detectAll(html: string, headers: Record<string, string>) {
  const results: { cms: string; confidence: number; reasons: string[] }[] = [];

  function addResult(cms: string, confidence: number, reason: string) {
    const existing = results.find((r) => r.cms === cms);
    if (existing) {
      existing.confidence += confidence;
      existing.reasons.push(reason);
    } else {
      results.push({ cms, confidence, reasons: [reason] });
    }
  }

  // --------------------------------------
  // 1. GENERATOR-TAGS
  // --------------------------------------
  const generatorMatch = html.match(/<meta name=["']generator["'] content=["']([^"']+)/i);
  if (generatorMatch) {
    const gen = generatorMatch[1].toLowerCase();
    if (gen.includes("wordpress")) addResult("WordPress", 60, "Generator-Tag");
    if (gen.includes("joomla")) addResult("Joomla", 60, "Generator-Tag");
    if (gen.includes("drupal")) addResult("Drupal", 60, "Generator-Tag");
  }

  // --------------------------------------
  // 2. HEADER-ANALYSEN
  // --------------------------------------
  const power = headers["x-powered-by"] || "";
  if (/wp/i.test(power)) addResult("WordPress", 50, "x-powered-by Header");
  if (/shopify/i.test(power)) addResult("Shopify", 50, "x-powered-by Header");
  if (/wix/i.test(power)) addResult("Wix", 50, "x-powered-by Header");

  // Server Header
  const server = headers["server"] || "";
  if (/cloudflare|shopify/i.test(server)) addResult("Shopify", 20, "Server Header Hinweis");

  // --------------------------------------
  // 3. HTML-KEYWORDS & FILEPATHS
  // --------------------------------------
  const checks: Record<string, { regex: RegExp; cms: string; score: number; reason: string }> = {
    wp_content: {
      regex: /wp-content|wp-includes/i,
      cms: "WordPress",
      score: 80,
      reason: "WordPress-path found"
    },
    shopify_cdn: {
      regex: /cdn\.shopify\.com|Shopify.theme|storefront/i,
      cms: "Shopify",
      score: 80,
      reason: "Shopify CDN found"
    },
    wix: {
      regex: /wixsite|static\.wixstatic\.com/i,
      cms: "Wix",
      score: 80,
      reason: "Wix-specific assets found"
    },
    drupal: {
      regex: /drupal-settings-json/i,
      cms: "Drupal",
      score: 70,
      reason: "Drupal Settings found"
    },
    typo3: {
      regex: /typo3/i,
      cms: "Typo3",
      score: 60,
      reason: "Typo3 found"
    },
    squarespace: {
      regex: /squarespace\.com|static1\.squarespace/i,
      cms: "Squarespace",
      score: 70,
      reason: "Squarespace Assets found"
    },
    webflow: {
      regex: /webflow\.js|w\-nav/i,
      cms: "Webflow",
      score: 70,
      reason: "Webflow Patterns found"
    }
  };

  for (const key in checks) {
    const c = checks[key];
    if (c.regex.test(html)) {
      addResult(c.cms, c.score, c.reason);
    }
  }

  // --------------------------------------
  // 4. FALLBACK: JAVASCRIPT FRAMEWORK SIGNATURES
  // --------------------------------------
  if (/__NEXT_DATA__/.test(html)) addResult("Next.js (not a traditional CMS)", 30, "Next.js JSON Payload");
  if (/<div id=["']__nuxt/.test(html)) addResult("Nuxt.js", 30, "Nuxt Root Element");

  // --------------------------------------
  // 5. Ergebnis bestimmen
  // --------------------------------------
  if (results.length === 0) {
    return {
      cms: "Unbekannt",
      confidence: 0,
      reasons: ["No CMS indicators found"]
    };
  }

  results.sort((a, b) => b.confidence - a.confidence);
  return results[0];
}
