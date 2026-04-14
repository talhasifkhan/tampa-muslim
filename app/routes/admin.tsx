import { Link } from "react-router";
import { useTheme } from "../useTheme";
import { MASJID_REGISTRY } from "../data/masjids";
import type { MasjidRecord } from "../data/masjids";
import type { Route } from "./+types/admin";
import Papa from "papaparse";
import { useState, useRef } from "react";

const SESSION_KEY = "admin_authed";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;

function useAdminAuth() {
  const [authed, setAuthed] = useState(() => {
    if (!ADMIN_PASSWORD) return true; // no password configured → open
    return sessionStorage.getItem(SESSION_KEY) === "1";
  });

  function login(input: string) {
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }

  return { authed, login, logout };
}

function LoginGate({ onLogin }: { onLogin: (pw: string) => boolean }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!onLogin(value)) {
      setError(true);
      setValue("");
      inputRef.current?.focus();
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__form" onSubmit={handleSubmit}>
        <h2 className="admin-login__title">Admin</h2>
        <input
          ref={inputRef}
          type="password"
          className={`admin-login__input${error ? " admin-login__input--error" : ""}`}
          placeholder="Password"
          value={value}
          autoFocus
          onChange={(e) => { setValue(e.target.value); setError(false); }}
        />
        {error && <p className="admin-login__error">Incorrect password</p>}
        <button type="submit" className="admin-login__btn">Sign in</button>
      </form>
    </div>
  );
}

export function meta() {
  return [
    { title: "Admin — TampaMuslim.com" },
    { name: "description", content: "Masjid administration dashboard" },
  ];
}

type CsvRow = Record<string, string>;

export async function clientLoader() {
  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq2AWn26xfZBvpsXjYnnMi4GkMA1TsbkSY56NG9n6KWKAZ86Z5O2PfTqYjw285NoR6AqNoTrZKOsnC/pub?gid=1483093150&single=true&output=csv";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.statusText);
    const csvText = await response.text();
    const parsed = Papa.parse<CsvRow>(csvText, { header: true, skipEmptyLines: true });
    return { csvData: parsed.data };
  } catch {
    return { csvData: [] as CsvRow[] };
  }
}

const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha", "Jumuah", "Jumuah 2"] as const;

function getCsvRow(csvData: CsvRow[], masjid: MasjidRecord): CsvRow | undefined {
  return csvData.find((row) => row.masjid_name?.trim() === masjid.name.trim());
}

function StatusBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={`admin-badge ${active ? "admin-badge--active" : "admin-badge--inactive"}`}>
      {label}
    </span>
  );
}

function MethodBadge({ method }: { method: string }) {
  const cls =
    method === "cheerio"
      ? "admin-badge--cheerio"
      : method === "puppeteer"
        ? "admin-badge--puppeteer"
        : "admin-badge--none";
  return <span className={`admin-badge ${cls}`}>{method}</span>;
}

function MasjidRow({ masjid, csvRow, expanded, onToggle }: {
  masjid: MasjidRecord;
  csvRow: CsvRow | undefined;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasTimes = csvRow && PRAYER_NAMES.some((p) => csvRow[p] && csvRow[p] !== "-");

  return (
    <>
      <tr className="admin-row" onClick={onToggle} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onToggle()}>
        <td className="admin-cell admin-cell--id">
          <code>{masjid.id}</code>
        </td>
        <td className="admin-cell admin-cell--name">{masjid.name}</td>
        <td className="admin-cell admin-cell--status">
          <StatusBadge active={!!hasTimes} label={hasTimes ? "Active" : "No data"} />
        </td>
        <td className="admin-cell admin-cell--scraping">
          <StatusBadge active={masjid.scraping.enabled} label={masjid.scraping.enabled ? "On" : "Off"} />
        </td>
        <td className="admin-cell admin-cell--scrapable">
          <StatusBadge active={masjid.scraping.scrapable} label={masjid.scraping.scrapable ? "Yes" : "No"} />
        </td>
        <td className="admin-cell admin-cell--hardcodable">
          <StatusBadge active={masjid.scraping.hardcodable} label={masjid.scraping.hardcodable ? "Yes" : "No"} />
        </td>
        <td className="admin-cell admin-cell--method">
          <MethodBadge method={masjid.scraping.method} />
        </td>
        <td className="admin-cell admin-cell--chevron">
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 150ms" }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </td>
      </tr>
      {expanded && (
        <tr className="admin-detail-row">
          <td colSpan={8}>
            <div className="admin-detail">
              <div className="admin-detail__grid">
                {/* Metadata */}
                <div className="admin-detail__section">
                  <h4 className="admin-detail__heading">Metadata</h4>
                  <dl className="admin-dl">
                    <dt>Address</dt>
                    <dd>{masjid.address}</dd>
                    <dt>Coordinates</dt>
                    <dd>{masjid.lat}, {masjid.lng}</dd>
                    <dt>Website</dt>
                    <dd>
                      <a href={masjid.website} target="_blank" rel="noopener noreferrer" className="admin-link">
                        {masjid.website}
                      </a>
                    </dd>
                    <dt>Last Updated</dt>
                    <dd>{csvRow?.last_updated || "—"}</dd>
                  </dl>
                </div>

                {/* Prayer Times */}
                <div className="admin-detail__section">
                  <h4 className="admin-detail__heading">Current Prayer Times</h4>
                  {csvRow ? (
                    <table className="admin-times-table">
                      <tbody>
                        {PRAYER_NAMES.map((prayer) => (
                          <tr key={prayer}>
                            <td className="admin-times-table__label">{prayer}</td>
                            <td className="admin-times-table__value">{csvRow[prayer] || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="admin-empty">No CSV data found for this masjid</p>
                  )}
                </div>

                {/* Scraping Config */}
                <div className="admin-detail__section">
                  <h4 className="admin-detail__heading">Scraping Configuration</h4>
                  <dl className="admin-dl">
                    <dt>Enabled</dt>
                    <dd><StatusBadge active={masjid.scraping.enabled} label={masjid.scraping.enabled ? "Yes" : "No"} /></dd>
                    <dt>Scrapable</dt>
                    <dd><StatusBadge active={masjid.scraping.scrapable} label={masjid.scraping.scrapable ? "Yes" : "No"} /></dd>
                    <dt>Hardcodable</dt>
                    <dd><StatusBadge active={masjid.scraping.hardcodable} label={masjid.scraping.hardcodable ? "Yes" : "No"} /></dd>
                    <dt>Method</dt>
                    <dd><MethodBadge method={masjid.scraping.method} /></dd>
                    <dt>Module</dt>
                    <dd><code>{masjid.scraping.scraperModule}</code></dd>
                  </dl>
                  <p className="admin-detail__notes">{masjid.scraping.notes}</p>
                  {masjid.scraping.hardcodeNotes && (
                    <p className="admin-detail__notes">{masjid.scraping.hardcodeNotes}</p>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function Admin({ loaderData }: Route.ComponentProps) {
  const { isDark, toggleTheme } = useTheme();
  const { authed, login, logout } = useAdminAuth();
  const csvData = (loaderData?.csvData ?? []) as CsvRow[];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!authed) return <LoginGate onLogin={login} />;

  const stats = {
    total: MASJID_REGISTRY.length,
    active: MASJID_REGISTRY.filter((m) => {
      const row = getCsvRow(csvData, m);
      return row && PRAYER_NAMES.some((p) => row[p] && row[p] !== "-");
    }).length,
    scrapingEnabled: MASJID_REGISTRY.filter((m) => m.scraping.enabled).length,
    scrapable: MASJID_REGISTRY.filter((m) => m.scraping.scrapable).length,
    hardcodable: MASJID_REGISTRY.filter((m) => m.scraping.hardcodable).length,
  };

  return (
    <div className="layout-container" style={{ paddingBottom: 0 }}>
      <header className="header-top">
        <Link to="/" viewTransition className="header-brand" style={{ textDecoration: "none" }}>
          TampaMuslim.com
        </Link>
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
        {ADMIN_PASSWORD && (
          <button type="button" className="admin-logout-btn" onClick={logout}>
            Sign out
          </button>
        )}
      </header>

      <main className="main-content">
        <h2 className="section-title">Admin Panel</h2>

        {/* Summary Cards */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <span className="admin-stat-card__value">{stats.total}</span>
            <span className="admin-stat-card__label">Total Masjids</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-card__value">{stats.active}</span>
            <span className="admin-stat-card__label">With Prayer Data</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-card__value">{stats.scrapable}</span>
            <span className="admin-stat-card__label">Scrapable</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-card__value">{stats.hardcodable}</span>
            <span className="admin-stat-card__label">Hardcodable</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-card__value">{stats.scrapingEnabled}</span>
            <span className="admin-stat-card__label">Scraping Enabled</span>
          </div>
        </div>

        {/* Masjid Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th">ID</th>
                <th className="admin-th">Name</th>
                <th className="admin-th">Data</th>
                <th className="admin-th">Scraping</th>
                <th className="admin-th">Scrapable</th>
                <th className="admin-th">Hardcodable</th>
                <th className="admin-th">Method</th>
                <th className="admin-th" style={{ width: 32 }}></th>
              </tr>
            </thead>
            <tbody>
              {MASJID_REGISTRY.map((masjid) => (
                <MasjidRow
                  key={masjid.id}
                  masjid={masjid}
                  csvRow={getCsvRow(csvData, masjid)}
                  expanded={expandedId === masjid.id}
                  onToggle={() => setExpandedId(expandedId === masjid.id ? null : masjid.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
