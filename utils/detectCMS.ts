// utils/detectCMS.ts
export async function detectCMSFromUrl(url: string) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache"
      }
    });

    const html = await res.text();
    const headers = Object.fromEntries(res.headers.entries());

    // Prüfe, ob die Seite den Zugriff blockiert hat
    if (html.length < 5000 && /access.*denied|blocked|captcha|challenge|protection/i.test(html)) {
      return {
        cms: "⚠️ Zugriff blockiert",
        confidence: 0,
        reasons: [
          "Die Website blockiert automatisierte Zugriffe (Bot-Protection).",
          "Bitte öffne die URL im Browser, um das CMS manuell zu identifizieren."
        ]
      };
    }

    return detectAll(html, headers);
  } catch (e) {
    return {
      cms: "Unbekannt",
      confidence: 0,
      reason: "URL konnte nicht geladen werden."
    };
  }
}

function detectVersion(html: string, cms: string): string | null {
  // WordPress version detection
  if (cms === "WordPress") {
    // From generator tag
    const wpGenMatch = html.match(/<meta[^>]*name=["']generator["'][^>]*content=["']WordPress\s+([\d.]+)/i);
    if (wpGenMatch) return wpGenMatch[1];
    
    // From readme file reference
    const wpReadmeMatch = html.match(/wp-includes\/js\/wp-embed\.min\.js\?ver=([\d.]+)/i);
    if (wpReadmeMatch) return wpReadmeMatch[1];
  }
  
  // Drupal version detection
  if (cms === "Drupal") {
    const drupalGenMatch = html.match(/<meta[^>]*name=["']generator["'][^>]*content=["']Drupal\s+([\d.]+)/i);
    if (drupalGenMatch) return drupalGenMatch[1];
    
    const drupalCoreMatch = html.match(/Drupal\.settings[^}]*"version":"([\d.]+)"/i);
    if (drupalCoreMatch) return drupalCoreMatch[1];
  }
  
  // Joomla version detection
  if (cms === "Joomla") {
    const joomlaGenMatch = html.match(/<meta[^>]*name=["']generator["'][^>]*content=["']Joomla!?\s+([\d.]+)/i);
    if (joomlaGenMatch) return joomlaGenMatch[1];
  }
  
  // TYPO3 version detection
  if (cms === "TYPO3") {
    const typo3GenMatch = html.match(/<meta[^>]*name=["']generator["'][^>]*content=["']TYPO3\s+([\d.]+)/i);
    if (typo3GenMatch) return typo3GenMatch[1];
    
    const typo3CommentMatch = html.match(/This website is powered by TYPO3[^v]*v?([\d.]+)/i);
    if (typo3CommentMatch) return typo3CommentMatch[1];
  }
  
  // Magento version detection
  if (cms === "Magento") {
    const magentoMatch = html.match(/Magento[\/\s]+([\d.]+)/i);
    if (magentoMatch) return magentoMatch[1];
  }
  
  // PrestaShop version detection
  if (cms === "PrestaShop") {
    const psMatch = html.match(/PrestaShop[\/\s]+([\d.]+)/i);
    if (psMatch) return psMatch[1];
  }
  
  // Shopify version detection (from powered by header or HTML)
  if (cms === "Shopify") {
    const shopifyMatch = html.match(/Shopify\.theme\s*=\s*{[^}]*"version":"([^"]+)"/i);
    if (shopifyMatch) return shopifyMatch[1];
  }
  
  // Ghost version detection
  if (cms === "Ghost") {
    const ghostGenMatch = html.match(/<meta[^>]*name=["']generator["'][^>]*content=["']Ghost\s+([\d.]+)/i);
    if (ghostGenMatch) return ghostGenMatch[1];
  }
  
  // Craft CMS version detection
  if (cms === "Craft CMS") {
    const craftMatch = html.match(/Craft\s+CMS\s+([\d.]+)/i);
    if (craftMatch) return craftMatch[1];
  }
  
  return null;
}

export function detectAll(html: string, headers: Record<string, string>) {
  const results: { cms: string; confidence: number; reasons: string[]; version?: string }[] = [];

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
  // Suche nach Generator Meta-Tag (unterstützt verschiedene Attribut-Reihenfolgen, Leerzeichen und zusätzliche Attribute)
  const generatorMatch = html.match(/<meta[^>]*name=["']generator["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']generator["'][^>]*>/i);
  if (generatorMatch) {
    const gen = generatorMatch[1].toLowerCase();
    if (gen.includes("wordpress")) addResult("WordPress", 80, "Generator-Tag");
    if (gen.includes("joomla")) addResult("Joomla", 80, "Generator-Tag");
    if (gen.includes("drupal")) addResult("Drupal", 80, "Generator-Tag");
    if (gen.includes("typo3")) addResult("TYPO3", 80, "Generator-Tag");
    if (gen.includes("contao")) addResult("Contao", 80, "Generator-Tag");
    if (gen.includes("ghost")) addResult("Ghost", 80, "Generator-Tag");
    if (gen.includes("craft cms")) addResult("Craft CMS", 80, "Generator-Tag");
    if (gen.includes("modx")) addResult("MODX", 80, "Generator-Tag");
    if (gen.includes("prestashop")) addResult("PrestaShop", 80, "Generator-Tag");
    if (gen.includes("magento")) addResult("Magento", 80, "Generator-Tag");
  }

  // --------------------------------------
  // 2. HEADER-ANALYSEN
  // --------------------------------------
  const power = headers["x-powered-by"] || "";
  if (/wp/i.test(power)) addResult("WordPress", 50, "x-powered-by Header");
  if (/shopify/i.test(power)) addResult("Shopify", 50, "x-powered-by Header");
  if (/wix/i.test(power)) addResult("Wix", 50, "x-powered-by Header");
  if (/craft cms/i.test(power)) addResult("Craft CMS", 50, "x-powered-by Header");
  if (/prestashop/i.test(power)) addResult("PrestaShop", 50, "x-powered-by Header");

  // Server Header
  const server = headers["server"] || "";
  if (/cloudflare|shopify/i.test(server)) addResult("Shopify", 20, "Server Header Hinweis");
  
  // Weitere spezifische Headers
  const xGenerator = headers["x-generator"] || "";
  if (xGenerator) {
    if (/drupal/i.test(xGenerator)) addResult("Drupal", 70, "X-Generator Header");
    if (/craft cms/i.test(xGenerator)) addResult("Craft CMS", 70, "X-Generator Header");
  }

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
      regex: /cdn\.shopify\.com|Shopify\.theme|storefront/i,
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
      regex: /drupal-settings-json|\/sites\/default\/files|Drupal\.settings|data-drupal-|drupal\.js|\/core\/misc\/drupal/i,
      cms: "Drupal",
      score: 75,
      reason: "Drupal patterns found"
    },
    typo3: {
      regex: /typo3conf\/|typo3temp\/|\/typo3\//i,
      cms: "TYPO3",
      score: 80,
      reason: "TYPO3 directory structure found"
    },
    contao: {
      regex: /\/system\/modules\/|contao\-core|\/contao\//i,
      cms: "Contao",
      score: 75,
      reason: "Contao file structure found"
    },
    joomla: {
      regex: /\/components\/com_|\/media\/jui\/|Joomla!/i,
      cms: "Joomla",
      score: 75,
      reason: "Joomla components found"
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
    },
    ghost: {
      regex: /ghost\.css|\/ghost\/api\/|\/assets\/ghost\//i,
      cms: "Ghost",
      score: 75,
      reason: "Ghost CMS patterns found"
    },
    craft_cms: {
      regex: /\/cpresources\/|CraftSessionId|craftcms/i,
      cms: "Craft CMS",
      score: 75,
      reason: "Craft CMS detected"
    },
    magento: {
      regex: /\/static\/version|Mage\.Cookies|\/mage\/|magento/i,
      cms: "Magento",
      score: 75,
      reason: "Magento patterns found"
    },
    prestashop: {
      regex: /\/modules\/|prestashop|ps_shoppingcart/i,
      cms: "PrestaShop",
      score: 70,
      reason: "PrestaShop detected"
    },
    opencart: {
      regex: /route=product\/product|catalog\/view\/theme|opencart/i,
      cms: "OpenCart",
      score: 70,
      reason: "OpenCart patterns found"
    },
    modx: {
      regex: /\/assets\/components\/|modx|manager\/assets/i,
      cms: "MODX",
      score: 70,
      reason: "MODX detected"
    },
    kirby: {
      regex: /\/content\/|kirby-toolkit|site\/snippets/i,
      cms: "Kirby",
      score: 65,
      reason: "Kirby CMS patterns found"
    },
    statamic: {
      regex: /statamic|cp\/assets/i,
      cms: "Statamic",
      score: 70,
      reason: "Statamic detected"
    },
    umbraco: {
      regex: /\/umbraco\/|Umbraco\.Sys/i,
      cms: "Umbraco",
      score: 75,
      reason: "Umbraco detected"
    },
    sitecore: {
      regex: /\/sitecore\/|Sitecore\.Context/i,
      cms: "Sitecore",
      score: 75,
      reason: "Sitecore detected"
    },
    silverstripe: {
      regex: /\/silverstripe-cache\/|SilverStripe/i,
      cms: "SilverStripe",
      score: 70,
      reason: "SilverStripe detected"
    },
    concrete5: {
      regex: /\/concrete\/|CCM_APPLICATION_NAME|concrete5/i,
      cms: "Concrete CMS",
      score: 70,
      reason: "Concrete CMS (concrete5) detected"
    },
    october_cms: {
      regex: /\/modules\/system\/assets\/|october_session|octobercms/i,
      cms: "October CMS",
      score: 70,
      reason: "October CMS detected"
    },
    grav: {
      regex: /\/user\/themes\/|grav-loading|Grav\./i,
      cms: "Grav",
      score: 70,
      reason: "Grav CMS detected"
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

  // Confidence auf maximal 100 begrenzen
  results.forEach(result => {
    if (result.confidence > 100) {
      result.confidence = 100;
    }
  });

  results.sort((a, b) => b.confidence - a.confidence);
  
  const topResult = results[0];
  
  // Versuche Version zu erkennen
  if (topResult && topResult.cms !== "Unbekannt") {
    const version = detectVersion(html, topResult.cms);
    if (version) {
      topResult.version = version;
    }
  }
  
  return topResult;
}
