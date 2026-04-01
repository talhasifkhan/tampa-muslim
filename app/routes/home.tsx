import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { PrayerTimes } from "~/prayerTimes/prayerTimes";
import Papa from "papaparse";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TampaMuslim.com" },
    { name: "description", content: "Welcome to TampaMuslims.com!" },
  ];
}

export async function clientLoader() {
  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq2AWn26xfZBvpsXjYnnMi4GkMA1TsbkSY56NG9n6KWKAZ86Z5O2PfTqYjw285NoR6AqNoTrZKOsnC/pub?gid=1483093150&single=true&output=csv";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet CSV: ${response.statusText}`);
    }
    const csvText = await response.text();
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    return { csvData: parsed.data };
  } catch (err) {
    console.error("Error fetching or parsing CSV:", err);
    return { csvData: [] };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  if (!loaderData || !loaderData.csvData) {
    return <PrayerTimes csvData={[]} />;
  }
  return <PrayerTimes csvData={loaderData.csvData} />;
}
