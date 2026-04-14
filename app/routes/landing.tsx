import { Link } from "react-router";
import { useTheme } from "../useTheme";

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

export default function Landing() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div className="layout-container landing-page" style={{ paddingBottom: 0 }}>
      <header className="header-top">
        <h1 className="header-brand">TampaMuslim.com</h1>
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </header>
      <main className="main-content">
        <h2 className="section-title">Assalamu Alaikum</h2>
        <p className="landing-subtitle">What are you looking for?</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "500px", margin: "0 auto", width: "100%" }}>
          {SECTIONS.map(({ tab, label, description, icon }) => (
            <Link key={tab} to={`/app?tab=${tab}`} prefetch="intent" className="section-card">
              <span className="section-card__icon">{icon}</span>
              <div style={{ flex: 1 }}>
                <div className="section-card__label">{label}</div>
                <div className="section-card__desc">{description}</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="section-card__chevron" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link to="/changelog" prefetch="intent" className="landing-changelog-link">
            View changelog
          </Link>
        </div>
      </main>
    </div>
  );
}
