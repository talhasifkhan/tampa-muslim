import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";
import { useTheme } from "../useTheme";

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
    website: "https://www.newtampamasjid.org/",
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

/* ────────── Static Restaurant Data ────────── */
export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  lat: number;
  lng: number;
  image: string;
};

const STATIC_RESTAURANT_INFO: Restaurant[] = [
  {
    id: "mezza",
    name: "Mezza Mediterranean Grill",
    cuisine: "Mediterranean",
    address: "1780 E Fowler Ave, Tampa, FL 33612",
    lat: 28.0551,
    lng: -82.4418,
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "salems",
    name: "Salem's Fresh Eats",
    cuisine: "Fast Food",
    address: "8008 E Hillsborough Ave, Tampa, FL 33610",
    lat: 27.9960,
    lng: -82.3550,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "taaza",
    name: "Taaza Mart & Grill",
    cuisine: "Indian / Pakistani",
    address: "2608 E Fowler Ave, Tampa, FL 33612",
    lat: 28.0550,
    lng: -82.4300,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "petras",
    name: "Petra Restaurant",
    cuisine: "Middle Eastern",
    address: "1118 W Kennedy Blvd, Tampa, FL 33606",
    lat: 27.9450,
    lng: -82.4720,
    image: "https://images.unsplash.com/photo-1529144415895-6aaf8be872fb?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "mezbaan",
    name: "Mezbaan Indian Restaurant",
    cuisine: "Indian / Pakistani",
    address: "11627 N 56th St, Temple Terrace, FL 33617",
    lat: 28.0555,
    lng: -82.3934,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop",
  }
];

/* ────────── Static Events Data ────────── */
type CommunityEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: "lecture" | "fundraiser" | "social" | "youth" | "class";
};

const STATIC_EVENTS: CommunityEvent[] = [
  {
    id: "halaqa-apr",
    title: "Weekly Halaqa & Qur'an Study",
    date: "Every Sunday",
    time: "After Fajr",
    location: "ISTABA — 7326 E. Sligh Ave, Tampa",
    description: "Join us for a weekly circle of Qur'an recitation and reflection. All levels welcome.",
    category: "class",
  },
  {
    id: "youth-basketball",
    title: "Muslim Youth Basketball League",
    date: "Saturdays, Apr 12 – May 31",
    time: "10:00 AM – 12:00 PM",
    location: "ISONET Gym — 15830 Morris Bridge Rd, Tampa",
    description: "Weekly co-ed basketball for ages 10–18. Registration required. Contact ISONET for details.",
    category: "youth",
  },
  {
    id: "masjid-fundraiser",
    title: "ISTABA Annual Fundraiser Dinner",
    date: "Saturday, Apr 19",
    time: "6:30 PM",
    location: "ISTABA Banquet Hall — 7326 E. Sligh Ave, Tampa",
    description: "Support your masjid at our annual fundraising dinner. Live auction, guest speakers, and catered dinner included.",
    category: "fundraiser",
  },
  {
    id: "jumuah-lecture",
    title: "Friday Khutbah: Strengthening Family Bonds",
    date: "Friday, Apr 25",
    time: "1:15 PM",
    location: "Masjid Al-Qassam — 6406 N 56th St, Tampa",
    description: "Guest speaker Sh. Omar Suleiman will deliver the Friday khutbah on building stronger Muslim families.",
    category: "lecture",
  },
  {
    id: "community-iftar",
    title: "Community Iftar & Networking Night",
    date: "Saturday, May 3",
    time: "Maghrib (approx. 7:45 PM)",
    location: "The Muslim Connection — 8080 N 56th St, Tampa",
    description: "Break bread with your neighbors. Open to all. Bring a dish to share if you can!",
    category: "social",
  },
  {
    id: "new-muslim",
    title: "New Muslim Support Group",
    date: "Every 2nd & 4th Wednesday",
    time: "7:00 PM",
    location: "Islamic Center of Brandon — 1006 Victoria St, Brandon",
    description: "A welcoming space for new Muslims to ask questions, connect, and learn at their own pace.",
    category: "class",
  },
];

const EVENT_CATEGORY_LABELS: Record<CommunityEvent["category"], string> = {
  lecture: "Lecture",
  fundraiser: "Fundraiser",
  social: "Community",
  youth: "Youth",
  class: "Class / Study",
};

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

/* ────────── Masjid Card ────────── */
function MasjidCard({ masjid }: { masjid: Masjid }) {
  return (
    <div className="masjid-card">
      <div className="masjid-card__header">
        <h3 className="masjid-card__name">{masjid.name}</h3>
        <span className="masjid-card__address">{masjid.address}</span>
      </div>

      <div className="masjid-card__prayers">
        <div className="masjid-card__prayer-labels">
          <span>IQAMAH</span>
        </div>
        {PRAYER_ORDER.map((prayer) => {
          if (prayer === "Jumuah") {
            const jumuahTimes = masjid.jumuahTimes;
            const primaryTime =
              jumuahTimes && jumuahTimes.length > 0
                ? jumuahTimes[0]
                : masjid.iqamahTimes.Jumuah;
            return (
              <div className="masjid-card__prayer-row" key={prayer}>
                <span className="masjid-card__prayer-name">{prayer}</span>
                <span className="masjid-card__prayer-time">{primaryTime}</span>
              </div>
            );
          }
          return (
            <div className="masjid-card__prayer-row" key={prayer}>
              <span className="masjid-card__prayer-name">{prayer}</span>
              <span className="masjid-card__prayer-time">
                {masjid.iqamahTimes[prayer]}
              </span>
            </div>
          );
        })}

        {masjid.multipleKhutbahs &&
          masjid.jumuahTimes &&
          masjid.jumuahTimes.length > 1
          ? masjid.jumuahTimes.slice(1).map((time, index) => (
            <div className="masjid-card__prayer-row" key={`extra-jumuah-${index}`}>
              <span className="masjid-card__prayer-name">
                {`Jumuah ${index + 2}`}
              </span>
              <span className="masjid-card__prayer-time">{time}</span>
            </div>
          ))
          : null}
      </div>

      <div className="masjid-card__meta">
        <span className="masjid-card__updated">
          {masjid.lastUpdated && `Updated: ${masjid.lastUpdated}`}
        </span>
        <a
          className="masjid-card__report"
          href="https://docs.google.com/forms/d/e/1FAIpQLSfakgO9s0pIemEJJvdgs_zw_xcTZa8dmFrwOTE0a6FMP995bQ/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
        >
          Report incorrect times
        </a>
      </div>

      <div className="masjid-card__actions">
        <a
          className="masjid-card__btn masjid-card__btn--website"
          href={masjid.website}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Website
        </a>
        <a
          className="masjid-card__btn masjid-card__btn--navigate"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(masjid.address)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Navigate
        </a>
      </div>
    </div>
  );
}

/* ────────── Component ────────── */
export function PrayerTimes({
  csvData = [],
  initialTab = "prayers",
}: {
  csvData?: any[];
  initialTab?: "prayers" | "restaurants" | "events" | "about";
}) {
  const { isDark, toggleTheme } = useTheme();
  const [selectedMasjidId, setSelectedMasjidId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"prayers" | "restaurants" | "events" | "about">(
    initialTab
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

  /* ── restaurant state ── */
  const [restaurantSearchQuery, setRestaurantSearchQuery] = useState("");
  const [restaurantLocateStatus, setRestaurantLocateStatus] = useState<"idle" | "loading" | "found" | "denied" | "unavailable">("idle");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Memoized restaurant list
  const filteredRestaurants = useMemo(() => {
    let list = [...STATIC_RESTAURANT_INFO];
    
    if (restaurantSearchQuery.trim()) {
      const q = restaurantSearchQuery.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q));
    }

    if (userLocation) {
      // sort by distance
      list.sort((a, b) => {
        const distA = haversineDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = haversineDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      });
    } else {
      // sort alphabetical
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [restaurantSearchQuery, userLocation]);

  const handleRestaurantFindClosest = useCallback(() => {
    if (!navigator.geolocation) {
      setRestaurantLocateStatus("unavailable");
      return;
    }
    setRestaurantLocateStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setRestaurantLocateStatus("found");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setRestaurantLocateStatus("denied");
        } else {
          setRestaurantLocateStatus("unavailable");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

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
      inputRef.current?.blur(); // dismiss keyboard on mobile
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
        <Link to="/" className="header-brand" style={{ textDecoration: "none" }}>TampaMuslim.com</Link>

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

      {/* ── Main Content Area ── */}
      <main className="main-content">
        <h2 className={`section-title${activeTab === "prayers" && selectedMasjid ? " section-title--hidden-mobile" : ""}`}>{headingTitle}</h2>

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
              <div className="masjid-grid masjid-grid--single">
                <MasjidCard masjid={selectedMasjid} />
              </div>
            ) : (
              <div className="masjid-grid">
                {masjidsData.map((m) => (
                  <MasjidCard key={m.id} masjid={m} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "events" && (
          <div className="tab-content event-view">
            <p className="dummy-data-notice">⚠️ Events listed are sample data and may not reflect real community events.</p>
            <div className="event-list">
              {STATIC_EVENTS.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-card__header">
                    <span className={`event-card__category event-card__category--${event.category}`}>
                      {EVENT_CATEGORY_LABELS[event.category]}
                    </span>
                    <h3 className="event-card__title">{event.title}</h3>
                  </div>
                  <div className="event-card__meta">
                    <span className="event-card__meta-row">
                      <svg className="event-card__meta-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
                      </svg>
                      {event.date}
                    </span>
                    <span className="event-card__meta-row">
                      <svg className="event-card__meta-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
                      </svg>
                      {event.time}
                    </span>
                    <span className="event-card__meta-row">
                      <svg className="event-card__meta-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
                      </svg>
                      {event.location}
                    </span>
                  </div>
                  <p className="event-card__description">{event.description}</p>
                </div>
              ))}
            </div>
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
