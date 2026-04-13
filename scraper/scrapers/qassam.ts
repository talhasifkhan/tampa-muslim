import * as cheerio from "cheerio";
import type { MasjidScraper, ScrapedPrayerTimes } from "./types.js";

/**
 * Scraper for Masjid Al-Qassam / ICT (https://ictampa.org/)
 *
 * Website analysis: Uses an Athan Plus widget. The widget at
 * timing.athanplus.com returns server-rendered HTML with a monthly
 * prayer table. Scrapable with cheerio via the widget URL rather
 * than the main site.
 *
 * TODO: Inspect the widget HTML and fill in selectors.
 * Try fetching: https://timing.athanplus.com/masjid/widgets/monthly?masjid_id=0aAegzKj
 */
export default class QassamScraper implements MasjidScraper {
  private readonly widgetUrl =
    "https://timing.athanplus.com/masjid/widgets/monthly?masjid_id=0aAegzKj";

  async scrape(): Promise<ScrapedPrayerTimes> {
    const res = await fetch(this.widgetUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch widget: ${res.status}`);
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    // TODO: Fill in selectors based on widget HTML structure
    // The widget likely has a table with today's row highlighted
    // or a daily view with labeled times.
    throw new Error(
      "Qassam/ICT scraper selectors not yet implemented. " +
        "Inspect the widget HTML and update this file."
    );
  }
}
