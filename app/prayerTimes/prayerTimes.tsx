import { useMemo, useState, useEffect, useRef, useCallback } from "react";

type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha" | "Jumuah";

export type Masjid = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  iqamahTimes: Record<PrayerName, string>;
  website: string;
  multipleKhutbahs: boolean;
  jumuahTimes?: string[];
  lastUpdated?: string;
};

const STATIC_MASJID_INFO = [
  {
    id: "istaba",
    name: "Islamic Society of Tampa Bay Area (ISTABA)",
    address: "7326 E. Sligh Ave, Tampa, FL",
    lat: 27.9897,
    lng: -82.3876,
    website: "https://www.istaba.org/",
  },
  {
    id: "isonet",
    name: "Islamic Society of New Tampa (ISONET)",
    address: "15830 Morris Bridge Rd, Tampa, FL",
    lat: 28.0742,
    lng: -82.3471,
    website: "https://ISONET.org/",
  },
  {
    id: "qassam",
    name: "Masjid Al-Qassam (ICT)",
    address: "6406 N 56th St, Tampa, FL",
    lat: 28.0244,
    lng: -82.3936,
    website: "https://ictampa.org/",
  },
  {
    id: "brndon",
    name: "Islamic Center of Brandon",
    address: "1006 Victoria Street. Brandon, FL 33510",
    lat: 27.9333,
    lng: -82.2878,
    website: "https://www.brandonmasjid.org/",
  },
  {
    id: "tmc",
    name: "The Muslim Connection (TMC)",
    address: "8080 N 56th St, Tampa, FL 33617",
    lat: 28.0444,
    lng: -82.3936,
    website: "https://themuslimconnection.com/",
  },
  {
    id: "alrahma",
    name: "Masjid Al-Rahma",
    address: "9844 Skewlee Rd, Thonotosassa, FL 33592",
    lat: 28.0550,
    lng: -82.2850,
    website: "https://alrahmamasjid.org/",
  },
  {
    id: "jsmc",
    name: "Jesus Son of Mary Center (JSMC)",
    address: "3457 W Kenyon Ave, Tampa, FL 33614",
    lat: 28.0260,
    lng: -82.4980,
    website: "https://jsmctampa.org/",
  },
];

const PRAYER_ORDER: PrayerName[] = [
  "Fajr",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
  "Jumuah",
];

/* ────────── Haversine distance (miles) ────────── */
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ────────── Component ────────── */
export function PrayerTimes({ csvData = [] }: { csvData?: any[] }) {
  const [selectedMasjidId, setSelectedMasjidId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"prayers" | "events" | "about">(
    "prayers"
  );

  /* ── search combobox state ── */
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const comboRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  /* ── geolocation state ── */
  const [locateStatus, setLocateStatus] = useState<
    "idle" | "loading" | "found" | "denied" | "unavailable"
  >("idle");
  const [closestDistance, setClosestDistance] = useState<number | null>(null);

  /* ── click-outside to close dropdown ── */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── scroll highlighted item into view ── */
  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll("[role='option']");
    items[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  /* ── build masjid data from CSV ── */
  const masjidsData = useMemo(() => {
    return STATIC_MASJID_INFO.map((info) => {
      const csvRow = csvData.find(
        (row) => row.masjid_name?.trim() === info.name.trim()
      );
      
      const iqamahTimes: Record<PrayerName, string> = {
        Fajr: csvRow?.Fajr || "-",
        Dhuhr: csvRow?.Dhuhr || "-",
        Asr: csvRow?.Asr || "-",
        Maghrib: csvRow?.Maghrib || "-",
        Isha: csvRow?.Isha || "-",
        Jumuah: csvRow?.Jumuah || "-",
      };
      
      const jumuahTimesRaw = csvRow?.Jumuah || "";
      let jumuahTimesArray: string[] = [];
      if (jumuahTimesRaw && jumuahTimesRaw !== "-") {
        jumuahTimesArray.push(jumuahTimesRaw.trim());
      }
      
      const jumuah2Raw = csvRow?.["Jumuah 2"];
      if (jumuah2Raw && jumuah2Raw !== "-") {
        jumuahTimesArray.push(jumuah2Raw.trim());
      }

      return {
        ...info,
        iqamahTimes,
        multipleKhutbahs: jumuahTimesArray.length > 1,
        jumuahTimes: jumuahTimesArray,
        lastUpdated: csvRow?.last_updated || "",
      } as Masjid;
    });
  }, [csvData]);

  const selectedMasjid = useMemo(
    () => masjidsData.find((m) => m.id === selectedMasjidId),
    [selectedMasjidId, masjidsData]
  );

  /* ── filtered list for combobox (now supports address) ── */
  const filteredMasjids = useMemo(() => {
    if (!searchQuery.trim()) return masjidsData;
    const q = searchQuery.toLowerCase();
    return masjidsData.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.address.toLowerCase().includes(q)
    );
  }, [searchQuery, masjidsData]);

  /* ── select a masjid from the combobox ── */
  const selectMasjid = useCallback(
    (masjid: Masjid) => {
      setSelectedMasjidId(masjid.id);
      setSearchQuery(masjid.name);
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
      setClosestDistance(null);
      setLocateStatus("idle");
    },
    []
  );

  /* ── clear selection ── */
  const clearSelection = useCallback(() => {
    setSelectedMasjidId("");
    setSearchQuery("");
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    setClosestDistance(null);
    setLocateStatus("idle");
    inputRef.current?.focus();
  }, []);

  /* ── keyboard navigation ── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isDropdownOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        setIsDropdownOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
        return;
      }
      if (!isDropdownOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((i) =>
            i < filteredMasjids.length - 1 ? i + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((i) =>
            i > 0 ? i - 1 : filteredMasjids.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredMasjids[highlightedIndex]) {
            selectMasjid(filteredMasjids[highlightedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsDropdownOpen(false);
          break;
      }
    },
    [isDropdownOpen, highlightedIndex, filteredMasjids, selectMasjid]
  );

  /* ── find closest masjid ── */
  const handleFindClosest = useCallback(() => {
    if (!navigator.geolocation) {
      setLocateStatus("unavailable");
      return;
    }
    setLocateStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let minDist = Infinity;
        let closest: Masjid | null = null;

        for (const m of masjidsData) {
          const d = haversineDistance(latitude, longitude, m.lat, m.lng);
          if (d < minDist) {
            minDist = d;
            closest = m;
          }
        }

        if (closest) {
          setSelectedMasjidId(closest.id);
          setSearchQuery(closest.name);
          setClosestDistance(Math.round(minDist * 10) / 10);
          setLocateStatus("found");
          setIsDropdownOpen(false);
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocateStatus("denied");
        } else {
          setLocateStatus("unavailable");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [masjidsData]);

  const headingTitle =
    activeTab === "prayers"
      ? "Prayer Times"
      : activeTab === "events"
        ? "Community Events"
        : "About TampaMuslim";

  return (
    <div className="layout-container">
      {/* ── Top Header ── */}
      <header className="header-top">
        <h1 className="header-brand">TampaMuslim.com</h1>
        
        {/* Desktop Navigation (hidden on mobile) */}
        <nav className="desktop-nav">
          <button
            className={`desktop-nav__tab ${activeTab === "prayers" ? "desktop-nav__tab--active" : ""}`}
            onClick={() => setActiveTab("prayers")}
          >
            Prayer Times
          </button>
          <button
            className={`desktop-nav__tab ${activeTab === "events" ? "desktop-nav__tab--active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            Events
          </button>
          <button
            className={`desktop-nav__tab ${activeTab === "about" ? "desktop-nav__tab--active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </nav>
      </header>

      {/* ── Main Content Area ── */}
      <main className="main-content">
        <h2 className="section-title">{headingTitle}</h2>

        {activeTab === "prayers" && (
          <div className="tab-content">
            {/* ── Masjid Search + Locate ── */}
            <div className="masjid-picker">
              <div className="masjid-picker__row">
                {/* Combobox */}
                <div
                  className="masjid-search"
                  ref={comboRef}
                  role="combobox"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="listbox"
                  aria-owns="masjid-listbox"
                >
                  <div className="masjid-search__input-wrap">
                    <svg
                      className="masjid-search__icon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      ref={inputRef}
                      id="masjid-search-input"
                      type="text"
                      className="masjid-search__input"
                      placeholder="Search name or address..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                        setHighlightedIndex(0);
                        if (!e.target.value) {
                          setSelectedMasjidId("");
                          setClosestDistance(null);
                          setLocateStatus("idle");
                        }
                      }}
                      onFocus={() => {
                        setIsDropdownOpen(true);
                        setHighlightedIndex(-1);
                      }}
                      onKeyDown={handleKeyDown}
                      autoComplete="off"
                      aria-autocomplete="list"
                      aria-controls="masjid-listbox"
                      aria-activedescendant={
                        highlightedIndex >= 0
                          ? `masjid-option-${highlightedIndex}`
                          : undefined
                      }
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="masjid-search__clear"
                        onClick={clearSelection}
                        aria-label="Clear selection"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {isDropdownOpen && (
                    <ul
                      id="masjid-listbox"
                      ref={listRef}
                      className="masjid-search__dropdown"
                      role="listbox"
                    >
                      {filteredMasjids.length > 0 ? (
                        filteredMasjids.map((m, idx) => (
                          <li
                            key={m.id}
                            id={`masjid-option-${idx}`}
                            role="option"
                            aria-selected={m.id === selectedMasjidId}
                            className={`masjid-search__option${idx === highlightedIndex ? " masjid-search__option--highlighted" : ""}${m.id === selectedMasjidId ? " masjid-search__option--selected" : ""}`}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            onMouseDown={(e) => {
                              e.preventDefault(); // prevent blur before click
                              selectMasjid(m);
                            }}
                          >
                            <span className="masjid-search__option-name">
                              {m.name}
                            </span>
                            <span className="masjid-search__option-addr">
                              {m.address}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="masjid-search__no-results">
                          No masjids found
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                {/* Locate button - Now a clear text pill */}
                <button
                  type="button"
                  className="masjid-locate-btn"
                  onClick={handleFindClosest}
                  disabled={locateStatus === "loading"}
                >
                  {locateStatus === "loading" ? (
                    <span className="masjid-locate-btn__spinner" />
                  ) : (
                    <>📍 Closest</>
                  )}
                </button>
              </div>

              {/* Status messages */}
              {locateStatus === "found" && closestDistance !== null && (
                <span className="masjid-distance-badge">
                  📍 {closestDistance} mi away
                </span>
              )}
              {locateStatus === "denied" && (
                <span className="masjid-locate-error">
                  Location access denied. Please enable location.
                </span>
              )}
              {locateStatus === "unavailable" && (
                <span className="masjid-locate-error">
                  Location is not available.
                </span>
              )}
            </div>

            {selectedMasjid ? (
              <div className="prayer-view">
                <div className="prayer-view__header">
                  <h3 className="masjid-name">{selectedMasjid.name}</h3>
                  <span className="masjid-address">{selectedMasjid.address}</span>
                </div>

                <div className="prayer-list">
                  {PRAYER_ORDER.map((prayer) => {
                    if (prayer === "Jumuah") {
                      const jumuahTimes = selectedMasjid.jumuahTimes;
                      const primaryTime =
                        jumuahTimes && jumuahTimes.length > 0
                          ? jumuahTimes[0]
                          : selectedMasjid.iqamahTimes.Jumuah;
                      return (
                        <div className="prayer-row" key={prayer}>
                          <span className="prayer-row__name">{prayer}</span>
                          <span className="prayer-row__time">{primaryTime}</span>
                        </div>
                      );
                    }
                    return (
                      <div className="prayer-row" key={prayer}>
                        <span className="prayer-row__name">{prayer}</span>
                        <span className="prayer-row__time">
                          {selectedMasjid.iqamahTimes[prayer]}
                        </span>
                      </div>
                    );
                  })}

                  {selectedMasjid.multipleKhutbahs &&
                  selectedMasjid.jumuahTimes &&
                  selectedMasjid.jumuahTimes.length > 1
                    ? selectedMasjid.jumuahTimes.slice(1).map((time, index) => (
                        <div className="prayer-row" key={`extra-jumuah-${index}`}>
                          <span className="prayer-row__name">
                            {`Jumuah ${index + 2}`}
                          </span>
                          <span className="prayer-row__time">{time}</span>
                        </div>
                      ))
                    : null}
                </div>

                <div className="meta-info">
                  <div className="meta-info__links">
                    <span>
                      {selectedMasjid.lastUpdated &&
                        `Updated: ${selectedMasjid.lastUpdated}`}
                    </span>
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSfakgO9s0pIemEJJvdgs_zw_xcTZa8dmFrwOTE0a6FMP995bQ/viewform?usp=dialog"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Report incorrect times
                    </a>
                  </div>
                  <p className="disclaimer-text">
                    Disclaimer: Prayer times are community-sourced and may occasionally be out of date.
                  </p>
                </div>

                <div className="action-buttons">
                  <a
                    className="action-btn action-btn--secondary"
                    href={selectedMasjid.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                  </a>
                  <a
                    className="action-btn action-btn--navigate"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedMasjid.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🧭 Navigate
                  </a>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <p>Search for a location or tap 📍 Closest to view times.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "events" && (
          <div className="empty-state">
            <p>Events coming soon!</p>
          </div>
        )}

        {activeTab === "about" && (
          <div className="empty-state">
            <p>
              TampaMuslim.com makes it easy to keep up with prayer timings and happenings
              across the local community.
            </p>
          </div>
        )}
      </main>

      {/* ── Bottom Navigation Bar ── */}
      <nav className="bottom-nav">
        <button
          className={`nav-tab ${activeTab === "prayers" ? "nav-tab--active" : ""}`}
          onClick={() => setActiveTab("prayers")}
        >
          <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Prayer Times
        </button>
        <button
          className={`nav-tab ${activeTab === "events" ? "nav-tab--active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Events
        </button>
        <button
          className={`nav-tab ${activeTab === "about" ? "nav-tab--active" : ""}`}
          onClick={() => setActiveTab("about")}
        >
          <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          About
        </button>
      </nav>
    </div>
  );
}
