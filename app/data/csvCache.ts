/**
 * Shared prayer times CSV fetch.
 *
 * - In-memory cache: survives SPA navigation, cleared on page reload
 *   (ensures users always see fresh data after a refresh)
 * - Deduplicates concurrent callers so only one fetch is ever in flight
 */

import Papa from "papaparse";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq2AWn26xfZBvpsXjYnnMi4GkMA1TsbkSY56NG9n6KWKAZ86Z5O2PfTqYjw285NoR6AqNoTrZKOsnC/pub?gid=1483093150&single=true&output=csv";

let memoryCache: unknown[] | null = null;
let inFlight: Promise<unknown[]> | null = null;

/** Fetch prayer times, returning the in-memory cache if already loaded. */
export function getPrayerTimes(): Promise<unknown[]> {
  if (memoryCache) return Promise.resolve(memoryCache);

  if (inFlight) return inFlight;

  inFlight = fetch(CSV_URL)
    .then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.text();
    })
    .then((text) => {
      const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });
      memoryCache = data as unknown[];
      return memoryCache;
    })
    .catch(() => [] as unknown[])
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/**
 * Fire-and-forget: kick off the fetch while the user is still on the
 * landing page so it's warm (or done) by the time they navigate to /app.
 */
export function prefetchPrayerTimes() {
  getPrayerTimes();
}
