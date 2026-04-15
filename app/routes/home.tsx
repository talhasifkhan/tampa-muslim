import type { Route } from "./+types/home";
import { useSearchParams } from "react-router";
import { PrayerTimes } from "~/prayerTimes/prayerTimes";
import { getPrayerTimes } from "~/data/csvCache";

const VALID_TABS = ["prayers", "restaurants", "events", "about"] as const;
type TabName = typeof VALID_TABS[number];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TampaMuslim.com" },
    { name: "description", content: "Welcome to TampaMuslims.com!" },
  ];
}

export async function clientLoader() {
  const csvData = await getPrayerTimes();
  return { csvData };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") as TabName;
  const initialTab: TabName = VALID_TABS.includes(tab) ? tab : "prayers";
  return <PrayerTimes csvData={loaderData?.csvData ?? []} initialTab={initialTab} />;
}
