import * as cheerio from "cheerio";
import type { MasjidScraper, ScrapedPrayerTimes } from "./types.js";

/**
 * Scraper for Islamic Center of Brandon (https://www.brandonmasjid.org/)
 *
 * Website analysis: Prayer times are displayed in plain HTML list format
 * on the homepage. Scrapable with cheerio.
 *
 * TODO: Inspect the live site HTML and fill in CSS selectors.
 * Run `curl https://www.brandonmasjid.org/ | head -500` to examine structure.
 */
export default class BrandonScraper implements MasjidScraper {
  private readonly url = "https://www.brandonmasjid.org/";

  async scrape(): Promise<ScrapedPrayerTimes> {
    const res = await fetch(this.url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${this.url}: ${res.status}`);
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    // TODO: Fill in selectors based on site HTML structure
    // Example pattern:
    //   const fajr = $(".prayer-time-fajr .iqama").text().trim();
    throw new Error(
      "Brandon scraper selectors not yet implemented. " +
        "Inspect the site HTML and update this file."
    );
  }
}
