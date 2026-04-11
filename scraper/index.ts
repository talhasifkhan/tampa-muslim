import { SCRAPER_CONFIGS } from "./config.js";
import { updatePrayerTimes } from "./sheets.js";
import { validateScrapedTimes } from "./scrapers/types.js";
import type { MasjidScraper } from "./scrapers/types.js";

async function main() {
  const enabledConfigs = SCRAPER_CONFIGS.filter((c) => c.scrapingEnabled);

  if (enabledConfigs.length === 0) {
    console.log("No masjids have scraping enabled. Nothing to do.");
    return;
  }

  console.log(
    `Scraping ${enabledConfigs.length} masjid(s): ${enabledConfigs.map((c) => c.masjidId).join(", ")}`
  );

  let successCount = 0;
  let failCount = 0;

  for (const config of enabledConfigs) {
    try {
      console.log(`\n--- ${config.masjidName} (${config.masjidId}) ---`);

      // Dynamic import of the scraper module
      const scraperModule = await import(config.scraperModule);
      const ScraperClass = scraperModule.default;
      const scraper: MasjidScraper = new ScraperClass();

      // Scrape prayer times
      const times = await scraper.scrape();
      console.log("Scraped times:", times);

      // Validate before writing
      if (!validateScrapedTimes(times)) {
        console.error(
          `Validation failed for ${config.masjidName} — times don't look right. Skipping sheet update.`
        );
        failCount++;
        continue;
      }

      // Write to Google Sheet
      await updatePrayerTimes(config.masjidName, times);
      console.log(`Updated sheet for ${config.masjidName}`);
      successCount++;
    } catch (err) {
      console.error(`Failed to scrape ${config.masjidName}:`, err);
      failCount++;
      // Do NOT update the sheet — existing data preserved
    }
  }

  console.log(
    `\nDone. ${successCount} succeeded, ${failCount} failed out of ${enabledConfigs.length} total.`
  );

  if (failCount > 0) {
    process.exit(1);
  }
}

main();
