import { Link } from "react-router";

export function meta() {
  return [
    { title: "Changelog — TampaMuslim.com" },
    { name: "description", content: "Recent updates to TampaMuslim.com" },
  ];
}

type ChangeEntry = {
  date: string;
  title: string;
  items: string[];
};

const CHANGELOG: ChangeEntry[] = [
  {
    date: "April 16, 2026",
    title: "Logo, Arabic verse & UI refinements",
    items: [
      "App logo now appears in the header next to TampaMuslim.com across all pages",
      "Logo replaces the crescent icon above Assalamu Alaikum on the landing page",
      "Logo displayed on loading screens above the spinner",
      "Daily Quran/hadith reminder restored on the landing page with Arabic text and translation",
      "Arabic script uses Scheherazade New, a font designed for Quranic text",
      "Restaurants tab width constrained to match events tab on desktop",
      "Search bar made more prominent with a stronger border, taller input, tinted background, and larger icon",
      "Favicon and PWA icons replaced with proper assets across all sizes",
    ],
  },
  {
    date: "April 16, 2026",
    title: "Mobile UI polish & restaurants tab restored",
    items: [
      "Landing page redesigned as a welcome screen — crescent icon, larger greeting, cards no longer span the full screen width on mobile",
      "Restaurants tab restored with halal dining listings and a sample data notice matching the events tab",
      "Nav card subtitles removed for a cleaner look; daily reminder verse hidden for now",
      "Increased padding throughout on mobile so the layout feels less cramped",
      "Page background softened from pure white to a subtle off-white (#f8f9fa) in light mode",
    ],
  },
  {
    date: "April 15, 2026",
    title: "Icon, spinner & desktop layout improvements",
    items: [
      "Replaced default favicon with a custom TM SVG icon (green, rounded corners) — shows in browser tabs and on the home screen",
      "Removed legacy favicon.ico so the SVG icon takes effect in all browsers",
      "PWA manifest updated to reference the new SVG icon",
      "Replaced the thin navigation loading bar with a centered spinner overlay for clearer feedback during page loads",
      "Desktop nav tabs are now properly centered in the header via absolute positioning",
      "Events list and sample data warning are constrained to 720px on desktop for better readability",
      "Prayer times CSV fetch now starts in the background while the landing page loads, so times are ready sooner",
    ],
  },
  {
    date: "April 14, 2026",
    title: "Performance, PWA support & animations",
    items: [
      "Fonts are now self-hosted — no more Google Fonts dependency, faster load on mobile",
      "App is installable as a PWA via Add to Home Screen on iOS and Android",
      "Service worker caches the app shell for offline use; prayer times use network-first with offline fallback",
      "Prayer times data is cached in memory per session — updates to the sheet appear on next page refresh",
      "Page transitions use the View Transitions API for smooth fade animations between routes",
      "Tab switches within the app animate in",
      "Loading bar appears at the top of the screen when navigating to a page that fetches data",
      "Removed aggressive back/forward cache reload that caused unnecessary full-page refreshes",
      "Theme toggle and changelog link have larger tap targets (44px+) for easier mobile tapping",
    ],
  },
  {
    date: "April 14, 2026",
    title: "Dark mode & visual polish",
    items: [
      "Dark mode toggle in the header — persists across sessions and respects system preference",
      "Dark theme uses neutral grays throughout — no dark green backgrounds or borders",
      "Masjid card names are larger and easier to read",
      "All cards (masjid, event, restaurant) share a consistent warm off-white background",
      "Landing page shows a randomly selected Quran verse or hadith with Arabic text and translation on each visit",
    ],
  },
  {
    date: "April 13, 2026",
    title: "Prayer times card redesign",
    items: [
      "All masjid prayer times now shown in a card grid by default — no need to search first",
      "Cards are responsive: 1 column on mobile, 2 on tablet, 3 on desktop",
      "Search narrows the grid to a single card; clearing restores the full grid",
      "Landing page buttons no longer stretch on wide screens",
    ],
  },
  {
    date: "April 6, 2026",
    title: "Web scraping infrastructure",
    items: [
      "Added scraping system for masjid websites that reliably publish prayer times",
      "Scraping can be toggled per-masjid; disabled by default",
      "Restaurants section temporarily hidden from the UI",
    ],
  },
  {
    date: "March 30, 2026",
    title: "Initial launch",
    items: [
      "Prayer times for 7 Tampa-area masajid sourced from community Google Form",
      "Community events page with sample data",
      "Mobile-first design with bottom navigation",
      "Landing page with quick navigation",
      "Find closest masjid via geolocation",
    ],
  },
];

export default function Changelog() {
  return (
    <div className="layout-container" style={{ paddingBottom: 0 }}>
      <header className="header-top">
        <Link to="/" viewTransition className="header-brand" style={{ textDecoration: "none" }}>
          <img src="/favicon/favicon.svg" alt="" className="header-brand__logo" aria-hidden="true" />
          TampaMuslim.com
        </Link>
      </header>
      <main className="main-content">
        <h2 className="section-title">Changelog</h2>
        <div className="changelog">
          {CHANGELOG.map((entry, i) => (
            <div key={i} className="changelog__entry">
              <span className="changelog__date">{entry.date}</span>
              <h3 className="changelog__title">{entry.title}</h3>
              <ul className="changelog__list">
                {entry.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
