/**
 * Scraper configuration is derived from the centralized masjid registry.
 * Edit app/data/masjids.ts to update metadata or scraping settings.
 *
 * Note: the registry lives in the app/ directory but is plain TypeScript
 * with no browser/React imports, so tsx can import it directly here.
 */

import { MASJID_REGISTRY } from "../app/data/masjids";

export type ScraperConfig = {
  masjidId: string;
  masjidName: string; // must exactly match CSV masjid_name column
  scrapingEnabled: boolean;
  scraperModule: string;
};

export const SCRAPER_CONFIGS: ScraperConfig[] = MASJID_REGISTRY.map((m) => ({
  masjidId: m.id,
  masjidName: m.name,
  scrapingEnabled: m.scraping.enabled,
  scraperModule: m.scraping.scraperModule,
}));
