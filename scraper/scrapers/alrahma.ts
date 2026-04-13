import * as cheerio from "cheerio";
import type { MasjidScraper, ScrapedPrayerTimes } from "./types.js";

/**
 * Scraper for Masjid Al-Rahma (https://alrahmamasjid.org/)
 *
 * Website analysis: Prayer times are displayed in an HTML table.
 * Scrapable with cheerio.
 *
 * TODO: Inspect the live site HTML and fill in CSS selectors.
 * Run `curl https://alrahmamasjid.org/ | head -500` to examine structure.
 */
export default class AlRahmaScraper implements MasjidScraper {
  private readonly url = "https://alrahmamasjid.org/";

  async scrape(): Promise<ScrapedPrayerTimes> {
    const res = await fetch(this.url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${this.url}: ${res.status}`);
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    // TODO: Fill in selectors based on site HTML structure
    // Example pattern for table:
    //   const rows = $("table.prayer-times tr");
    //   const fajr = rows.eq(1).find("td").eq(2).text().trim();
    throw new Error(
      "Al-Rahma scraper selectors not yet implemented. " +
        "Inspect the site HTML and update this file."
    );
  }
}
