/**
 * Centralized masjid registry — single source of truth for all masjid
 * metadata and scraping configuration. Both the frontend app and the
 * scraper import from here.
 */

export type ScrapingMethod = "cheerio" | "puppeteer" | "none";

export type MasjidScrapingConfig = {
  enabled: boolean;
  scrapable: boolean;
  method: ScrapingMethod;
  scraperModule: string;
  notes: string;
  /**
   * True when the masjid publishes a fixed prayer time schedule weeks or
   * months ahead of time (e.g. a seasonal PDF, a static page, or a monthly
   * table). These times can be encoded directly in app/data/schedules.ts
   * instead of relying on the community form or a live scrape.
   */
  hardcodable: boolean;
  hardcodeNotes: string;
};

export type MasjidRecord = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  website: string;
  scraping: MasjidScrapingConfig;
};

export const MASJID_REGISTRY: MasjidRecord[] = [
  {
    id: "istaba",
    name: "Islamic Society of Tampa Bay Area (ISTABA)",
    address: "7326 E. Sligh Ave, Tampa, FL",
    lat: 27.9897,
    lng: -82.3876,
    website: "https://www.istaba.org/",
    scraping: {
      enabled: false,
      scrapable: false,
      method: "puppeteer",
      scraperModule: "./scrapers/istaba.ts",
      notes: "Uses iframe from themasjidapp.org. Requires Puppeteer — not scrapable with cheerio.",
      hardcodable: false,
      hardcodeNotes: "Schedule not published ahead of time — updated weekly via themasjidapp.org.",
    },
  },
  {
    id: "isonet",
    name: "Islamic Society of New Tampa (ISONET)",
    address: "15830 Morris Bridge Rd, Tampa, FL",
    lat: 28.0742,
    lng: -82.3471,
    website: "https://www.newtampamasjid.org/",
    scraping: {
      enabled: false,
      scrapable: false,
      method: "none",
      scraperModule: "./scrapers/isonet.ts",
      notes: "Prayer schedule is a PNG image. Not scrapable.",
      hardcodable: true,
      hardcodeNotes: "Publishes a monthly PNG schedule — times are fixed per month and can be read manually and encoded.",
    },
  },
  {
    id: "qassam",
    name: "Masjid Al-Qassam (ICT)",
    address: "6406 N 56th St, Tampa, FL",
    lat: 28.0244,
    lng: -82.3936,
    website: "https://ictampa.org/",
    scraping: {
      enabled: false,
      scrapable: true,
      method: "cheerio",
      scraperModule: "./scrapers/qassam.ts",
      notes: "Uses Athan Plus widget (timing.athanplus.com). Server-rendered HTML — scrapable with cheerio.",
      hardcodable: true,
      hardcodeNotes: "Iqamah times are set manually by the masjid and tend to stay fixed for weeks at a time. The Athan Plus widget exposes them — scraping it once gives stable data that can be encoded until the masjid changes them.",
    },
  },
  {
    id: "brndon",
    name: "Islamic Center of Brandon",
    address: "1006 Victoria Street, Brandon, FL 33510",
    lat: 27.9333,
    lng: -82.2878,
    website: "https://www.brandonmasjid.org/",
    scraping: {
      enabled: false,
      scrapable: true,
      method: "cheerio",
      scraperModule: "./scrapers/brandon.ts",
      notes: "Prayer times in plain HTML list format on homepage. Scrapable with cheerio.",
      hardcodable: false,
      hardcodeNotes: "Homepage times appear to be updated in place — no advance schedule published.",
    },
  },
  {
    id: "tmc",
    name: "The Muslim Connection (TMC)",
    address: "8080 N 56th St, Tampa, FL 33617",
    lat: 28.0444,
    lng: -82.3936,
    website: "https://tmcflorida.org/",
    scraping: {
      enabled: false,
      scrapable: false,
      method: "puppeteer",
      scraperModule: "./scrapers/tmc.ts",
      notes: "React SPA with Firebase backend (tmcflorida.org). Site is reachable but fully client-side rendered — cheerio cannot see prayer times. Puppeteer required to render the /prayer-times page.",
      hardcodable: false,
      hardcodeNotes: "Times are fetched from Firebase at runtime — no static schedule to read. Hardcoding not viable without first rendering the page.",
    },
  },
  {
    id: "alrahma",
    name: "Masjid Al-Rahma",
    address: "9844 Skewlee Rd, Thonotosassa, FL 33592",
    lat: 28.0550,
    lng: -82.2850,
    website: "https://alrahmamasjid.org/",
    scraping: {
      enabled: false,
      scrapable: true,
      method: "cheerio",
      scraperModule: "./scrapers/alrahma.ts",
      notes: "Prayer times displayed in an HTML table. Scrapable with cheerio.",
      hardcodable: false,
      hardcodeNotes: "Table appears to be updated continuously — no advance schedule observed.",
    },
  },
  {
    id: "jsmc",
    name: "Jesus Son of Mary Center (JSMC)",
    address: "3457 W Kenyon Ave, Tampa, FL 33614",
    lat: 28.0260,
    lng: -82.4980,
    website: "https://jsmctampa.org/",
    scraping: {
      enabled: false,
      scrapable: false,
      method: "none",
      scraperModule: "./scrapers/jsmc.ts",
      notes: "Client-side JS rendered. Not scrapable with cheerio.",
      hardcodable: true,
      hardcodeNotes: "Publishes a fixed monthly/seasonal iqamah schedule — times can be read from the site and encoded manually.",
    },
  },
];
