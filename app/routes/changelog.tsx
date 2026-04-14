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
    date: "April 14, 2026",
    title: "Dark mode & visual polish",
    items: [
      "Dark mode toggle in the header — persists across sessions and respects system preference",
      "Dark theme uses neutral grays (no blue tint) for a clean night-time look",
      "Masjid card names are larger and easier to read",
      "All cards (masjid, event, restaurant) share a consistent warm off-white background",
      "Landing page navigation cards use a soft green tint tied to the app's emerald accent",
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
