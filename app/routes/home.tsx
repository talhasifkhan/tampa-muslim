import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { PrayerTimes } from "~/prayerTimes/prayerTimes";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TampaMuslim.com" },
    { name: "description", content: "Welcome to TampaMuslims.com!" },
  ];
}

export default function Home() {
  return <PrayerTimes />;
}
