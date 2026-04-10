import { Link } from "react-router";

export function meta() {
  return [
    { title: "TampaMuslim.com" },
    { name: "description", content: "Your guide to the Tampa Muslim community." },
  ];
}

const SECTIONS = [
  {
    tab: "prayers",
    label: "Prayer Times",
    description: "Iqamah schedules for Tampa-area masajid",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    tab: "restaurants",
    label: "Halal Restaurants",
    description: "Find halal dining near you",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </svg>
    ),
  },
  {
    tab: "events",
    label: "Community Events",
    description: "Lectures, classes & social gatherings",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    tab: "about",
    label: "About",
    description: "About TampaMuslim.com",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

const chevron = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#cbd5e1", flexShrink: 0 }}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function Landing() {
  return (
    <div className="layout-container" style={{ paddingBottom: 0 }}>
      <header className="header-top">
        <h1 className="header-brand">TampaMuslim.com</h1>
      </header>
      <main className="main-content">
        <h2 className="section-title">Assalamu Alaikum</h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "1.5rem", marginTop: "-0.5rem" }}>
          What are you looking for?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {SECTIONS.map(({ tab, label, description, icon }) => (
            <Link key={tab} to={`/app?tab=${tab}`} className="section-card">
              <span style={{ color: "#10b981", flexShrink: 0 }}>{icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: "1rem", color: "#0f172a" }}>{label}</div>
                <div style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 300 }}>{description}</div>
              </div>
              {chevron}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
