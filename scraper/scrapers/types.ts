export type ScrapedPrayerTimes = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Jumuah: string;
  "Jumuah 2"?: string;
};

export interface MasjidScraper {
  scrape(): Promise<ScrapedPrayerTimes>;
}

/** Validates that a string looks like a prayer time (e.g. "5:30 AM", "1:15 PM") */
export function isValidTime(value: string): boolean {
  return /^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(value.trim());
}

/** Validates all required fields in scraped times */
export function validateScrapedTimes(times: ScrapedPrayerTimes): boolean {
  const required: (keyof ScrapedPrayerTimes)[] = [
    "Fajr",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha",
    "Jumuah",
  ];
  return required.every((key) => isValidTime(times[key]));
}
