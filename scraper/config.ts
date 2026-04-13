/**
 * Per-masjid scraping configuration.
 *
 * Set `scrapingEnabled` to true to have the scraper automatically pull
 * prayer times from the masjid's website. When false, times are only
 * updated via the community Google Form.
 *
 * Website analysis (2026-04-11):
 * ─────────────────────────────────────────────────────────────────────
 * istaba   — Uses iframe from themasjidapp.org. Requires Puppeteer.
 *            Not scrapable with cheerio. Keep form-only for now.
 * isonet   — Prayer schedule is a PNG image. Not scrapable.
 * qassam   — Uses athanplus widget (timing.athanplus.com). The widget
 *            returns server-rendered HTML with monthly prayer table.
 *            Scrapable with cheerio via the widget URL.
 * brndon   — Prayer times are in plain HTML list format on homepage.
 *            Scrapable with cheerio.
 * tmc      — Site returned ECONNREFUSED during testing. Unreachable.
 * alrahma  — Prayer times displayed in an HTML table. Scrapable with
 *            cheerio.
 * jsmc     — Prayer schedule page renders no visible times (likely
 *            client-side JS rendered). Not scrapable with cheerio.
 * ─────────────────────────────────────────────────────────────────────
 */

export type ScraperConfig = {
  masjidId: string;
  masjidName: string; // must exactly match CSV masjid_name column
  scrapingEnabled: boolean;
  scraperModule: string;
};

export const SCRAPER_CONFIGS: ScraperConfig[] = [
  {
    masjidId: "istaba",
    masjidName: "Islamic Society of Tampa Bay Area (ISTABA)",
    scrapingEnabled: false,
    scraperModule: "./scrapers/istaba.ts",
  },
  {
    masjidId: "isonet",
    masjidName: "Islamic Society of New Tampa (ISONET)",
    scrapingEnabled: false,
    scraperModule: "./scrapers/isonet.ts",
  },
  {
    masjidId: "qassam",
    masjidName: "Masjid Al-Qassam (ICT)",
    scrapingEnabled: false,
    scraperModule: "./scrapers/qassam.ts",
  },
  {
    masjidId: "brndon",
    masjidName: "Islamic Center of Brandon",
    scrapingEnabled: false,
    scraperModule: "./scrapers/brandon.ts",
  },
  {
    masjidId: "tmc",
    masjidName: "The Muslim Connection (TMC)",
    scrapingEnabled: false,
    scraperModule: "./scrapers/tmc.ts",
  },
  {
    masjidId: "alrahma",
    masjidName: "Masjid Al-Rahma",
    scrapingEnabled: false,
    scraperModule: "./scrapers/alrahma.ts",
  },
  {
    masjidId: "jsmc",
    masjidName: "Jesus Son of Mary Center (JSMC)",
    scrapingEnabled: false,
    scraperModule: "./scrapers/jsmc.ts",
  },
];
