import { detectAll, detectCMSFromUrl } from "../detectCMS";

describe("detectCMS", () => {
  describe("detectAll", () => {
    it("should detect WordPress from wp-content path", () => {
      const html = '<html><body><script src="/wp-content/themes/test.js"></script></body></html>';
      const headers = {};
      
      const result = detectAll(html, headers);
      
      expect(result.cms).toBe("WordPress");
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.reasons).toContain("WordPress-path found");
    });

    it("should detect WordPress version from generator tag", () => {
      const html = '<meta name="generator" content="WordPress 6.4.2">';
      const headers = {};
      
      const result = detectAll(html, headers);
      
      expect(result.cms).toBe("WordPress");
      expect(result.version).toBe("6.4.2");
    });

    it("should detect Drupal from generator tag", () => {
      const html = '<meta name="generator" content="Drupal 10 (https://www.drupal.org)">';
      const headers = {};
      
      const result = detectAll(html, headers);
      
      expect(result.cms).toBe("Drupal");
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("should detect Drupal version", () => {
      const html = '<meta name="generator" content="Drupal 10.1.5 (https://www.drupal.org)">';
      const headers = {};
      
      const result = detectAll(html, headers);
      
      expect(result.cms).toBe("Drupal");
      expect(result.version).toBe("10.1.5");
    });

    it("should detect Shopify from CDN", () => {
      const html = '<script src="https://cdn.shopify.com/s/files/1/test.js"></script>';
      const headers = {};
      
      const result = detectAll(html, headers);
      
      expect(result.cms).toBe("Shopify");
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("should detect Joomla from components", () => {
      const html = '<link href="/components/com_content/style.css">';
      const headers = {};
      
      const result = detectAll(html, headers);
      
      expect(result.cms).toBe("Joomla");
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("should detect TYPO3 from directory structure", () => {
      const html = '<script src="/typo3conf/ext/test/test.js"></script>';
      const headers = {};
      
      const result = detectAll(html, headers);
      
      expect(result.cms).toBe("TYPO3");
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("should return unknown when no CMS detected", () => {
      const html = "<html><body>Simple HTML page</body></html>";
      const headers = {};
      
      const result = detectAll(html, headers);
      
      expect(result.cms).toBe("Unbekannt");
      expect(result.confidence).toBe(0);
    });

    it("should cap confidence at 100", () => {
      const html = `
        <meta name="generator" content="WordPress 6.0">
        <script src="/wp-content/themes/test.js"></script>
        <script src="/wp-includes/js/test.js"></script>
      `;
      const headers = { "x-powered-by": "WordPress" };
      
      const result = detectAll(html, headers);
      
      expect(result.confidence).toBeLessThanOrEqual(100);
    });

    it("should detect from x-powered-by header", () => {
      const html = "<html><body></body></html>";
      const headers = { "x-powered-by": "Shopify" };
      
      const result = detectAll(html, headers);
      
      expect(result.cms).toBe("Shopify");
    });

    it("should handle generator tag with different attribute order", () => {
      const html = '<meta content="Ghost 5.0" name="generator">';
      const headers = {};
      
      const result = detectAll(html, headers);
      
      expect(result.cms).toBe("Ghost");
      if (result.version) {
        expect(result.version).toBe("5.0");
      }
    });
  });

  describe("detectCMSFromUrl", () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should handle blocked access", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        text: async () => "Access denied to this page",
        headers: new Map()
      });

      const result = await detectCMSFromUrl("https://example.com");

      expect(result.cms).toContain("blockiert");
      expect(result.confidence).toBe(0);
    });

    it("should handle fetch errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      const result = await detectCMSFromUrl("https://example.com");

      expect(result.cms).toBe("Unbekannt");
      expect(result.confidence).toBe(0);
    });

    it("should successfully detect CMS from URL", async () => {
      const mockHtml = '<meta name="generator" content="WordPress 6.0">';
      (global.fetch as jest.Mock).mockResolvedValue({
        text: async () => mockHtml,
        headers: new Map()
      });

      const result = await detectCMSFromUrl("https://example.com");

      expect(result.cms).toBe("WordPress");
      if ("version" in result && result.version) {
        expect(result.version).toBe("6.0");
      }
    });
  });
});
