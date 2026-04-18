import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { useTheme } from "../useTheme";
import { MASJID_REGISTRY } from "../data/masjids";

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
type EventCategory = "lecture" | "fundraiser" | "social" | "youth" | "class";

type CommunityEvent = {
  id: string;
  title: string;
  date: string; // human-readable display (may describe recurrence)
  /** ISO date (YYYY-MM-DD) of the next occurrence, used for sorting and calendar placement. */
  startDate: string;
  /** When set, the event repeats; calendar view expands these into per-day dots. */
  recurrence?: "weekly" | "biweekly";
  time: string;
  location: string;
  description: string;
  category: EventCategory;
  /** Optional association with a masjid from MASJID_REGISTRY for filtering. */
  masjidId?: string;
};

const STATIC_EVENTS: CommunityEvent[] = [
  {
    id: "halaqa-apr",
    title: "Weekly Halaqa & Qur'an Study",
    date: "Every Sunday",
    startDate: "2026-04-19",
    recurrence: "weekly",
    time: "After Fajr",
    location: "ISTABA — 7326 E. Sligh Ave, Tampa",
    description: "Join us for a weekly circle of Qur'an recitation and reflection. All levels welcome.",
    category: "class",
    masjidId: "istaba",
  },
  {
    id: "youth-basketball",
    title: "Muslim Youth Basketball League",
    date: "Saturdays, Apr 18 – May 30",
    startDate: "2026-04-18",
    recurrence: "weekly",
    time: "10:00 AM – 12:00 PM",
    location: "ISONET Gym — 15830 Morris Bridge Rd, Tampa",
    description: "Weekly co-ed basketball for ages 10–18. Registration required. Contact ISONET for details.",
    category: "youth",
    masjidId: "isonet",
  },
  {
    id: "masjid-fundraiser",
    title: "ISTABA Annual Fundraiser Dinner",
    date: "Saturday, Apr 25",
    startDate: "2026-04-25",
    time: "6:30 PM",
    location: "ISTABA Banquet Hall — 7326 E. Sligh Ave, Tampa",
    description: "Support your masjid at our annual fundraising dinner. Live auction, guest speakers, and catered dinner included.",
    category: "fundraiser",
    masjidId: "istaba",
  },
  {
    id: "jumuah-lecture",
    title: "Friday Khutbah: Strengthening Family Bonds",
    date: "Friday, Apr 24",
    startDate: "2026-04-24",
    time: "1:15 PM",
    location: "Masjid Al-Qassam — 6406 N 56th St, Tampa",
    description: "Guest speaker Sh. Omar Suleiman will deliver the Friday khutbah on building stronger Muslim families.",
    category: "lecture",
    masjidId: "qassam",
  },
  {
    id: "community-iftar",
    title: "Community Iftar & Networking Night",
    date: "Saturday, May 2",
    startDate: "2026-05-02",
    time: "Maghrib (approx. 7:45 PM)",
    location: "The Muslim Connection — 8080 N 56th St, Tampa",
    description: "Break bread with your neighbors. Open to all. Bring a dish to share if you can!",
    category: "social",
    masjidId: "tmc",
  },
  {
    id: "new-muslim",
    title: "New Muslim Support Group",
    date: "Every other Wednesday",
    startDate: "2026-04-22",
    recurrence: "biweekly",
    time: "7:00 PM",
    location: "Islamic Center of Brandon — 1006 Victoria St, Brandon",
    description: "A welcoming space for new Muslims to ask questions, connect, and learn at their own pace.",
    category: "class",
    masjidId: "brndon",
  },
  {
    id: "sisters-halaqa",
    title: "Sisters' Halaqa: Tafsir of Surah Yusuf",
    date: "Saturday, May 9",
    startDate: "2026-05-09",
    time: "11:00 AM",
    location: "Masjid An-Noor — Tampa",
    description: "Monthly sisters-only study circle exploring the lessons of Surah Yusuf.",
    category: "class",
    masjidId: "annoor",
  },
  {
    id: "youth-game-night",
    title: "Youth Game Night & Pizza",
    date: "Friday, May 8",
    startDate: "2026-05-08",
    time: "7:30 PM",
    location: "Islamic Society of Riverview Area (ISRA)",
    description: "Board games, pizza, and good company. Open to teens & young adults.",
    category: "youth",
    masjidId: "isra",
  },
];

const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  lecture: "Lecture",
  fundraiser: "Fundraiser",
  social: "Community",
  youth: "Youth",
  class: "Class / Study",
};

const EVENT_CATEGORY_ORDER: EventCategory[] = [
  "lecture",
  "class",
  "youth",
  "social",
  "fundraiser",
];

/* ────────── Event date helpers ────────── */
function parseYmd(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Returns whether a (possibly recurring) event has an occurrence on `ymd`. */
function eventOccursOn(event: CommunityEvent, ymd: string): boolean {
  const target = parseYmd(ymd);
  const start = parseYmd(event.startDate);
  if (target < start) return false;
  if (!event.recurrence) return event.startDate === ymd;
  const diffDays = Math.round((target.getTime() - start.getTime()) / 86_400_000);
  const step = event.recurrence === "weekly" ? 7 : 14;
  return diffDays % step === 0;
}

/** Returns the next occurrence date (YYYY-MM-DD) on or after `fromYmd`, or null. */
function nextOccurrenceFrom(event: CommunityEvent, fromYmd: string): string | null {
  const from = parseYmd(fromYmd);
  const start = parseYmd(event.startDate);
  if (!event.recurrence) {
    return start >= from ? event.startDate : null;
  }
  const step = event.recurrence === "weekly" ? 7 : 14;
  if (start >= from) return event.startDate;
  const diffDays = Math.ceil((from.getTime() - start.getTime()) / 86_400_000);
  const stepsAhead = Math.ceil(diffDays / step);
  const next = new Date(start);
  next.setDate(start.getDate() + stepsAhead * step);
  return formatYmd(next);
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];

/* ────────── Event Calendar ────────── */
function EventCalendar({
  year,
  month,
  events,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: {
  year: number;
  month: number; // 0-indexed
  events: CommunityEvent[];
  selectedDate: string | null;
  onSelectDate: (ymd: string | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const todayYmd = formatYmd(new Date());
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<{ ymd: string; day: number } | null> = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ ymd: formatYmd(new Date(year, month, d)), day: d });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="event-calendar">
      <div className="event-calendar__header">
        <button
          type="button"
          className="event-calendar__nav"
          onClick={onPrevMonth}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="event-calendar__title">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          type="button"
          className="event-calendar__nav"
          onClick={onNextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="event-calendar__weekdays">
        {WEEKDAY_HEADERS.map((w, i) => (
          <span key={i} className="event-calendar__weekday">{w}</span>
        ))}
      </div>

      <div className="event-calendar__grid">
        {cells.map((cell, idx) => {
          if (!cell) return <div key={idx} className="event-calendar__cell event-calendar__cell--empty" />;
          const dayEvents = events.filter((e) => eventOccursOn(e, cell.ymd));
          const categories = Array.from(new Set(dayEvents.map((e) => e.category)));
          const isSelected = selectedDate === cell.ymd;
          const isToday = cell.ymd === todayYmd;
          return (
            <button
              key={idx}
              type="button"
              className={`event-calendar__cell${isSelected ? " event-calendar__cell--selected" : ""}${isToday ? " event-calendar__cell--today" : ""}${dayEvents.length ? " event-calendar__cell--has-events" : ""}`}
              onClick={() => onSelectDate(isSelected ? null : cell.ymd)}
              aria-pressed={isSelected}
              aria-label={`${cell.day}${dayEvents.length ? ` — ${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}` : ""}`}
            >
              <span className="event-calendar__day">{cell.day}</span>
              {categories.length > 0 && (
                <span className="event-calendar__dots">
                  {categories.slice(0, 3).map((cat) => (
                    <span
                      key={cat}
                      className={`event-calendar__dot event-calendar__dot--${cat}`}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatSelectedDate(ymd: string): string {
  const d = parseYmd(ymd);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

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
  const [restaurantSort, setRestaurantSort] = useState<"name" | "distance">("name");
  const [restaurantCuisineFilter, setRestaurantCuisineFilter] = useState<string>("");
  const [restaurantLocateStatus, setRestaurantLocateStatus] = useState<"idle" | "loading" | "found" | "denied" | "unavailable">("idle");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  /* ── event filter / sort state ── */
  const [eventSort, setEventSort] = useState<"upcoming" | "masjid" | "category">("upcoming");
  const [eventCategoryFilter, setEventCategoryFilter] = useState<EventCategory | "">("");
  const [eventSelectedDate, setEventSelectedDate] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [eventCalendarMonth, setEventCalendarMonth] = useState<{ year: number; month: number }>(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });

  const filteredEvents = useMemo(() => {
    const todayYmd = formatYmd(new Date());
    let list = STATIC_EVENTS.slice();

    if (eventCategoryFilter) {
      list = list.filter((e) => e.category === eventCategoryFilter);
    }
    if (eventSelectedDate) {
      list = list.filter((e) => eventOccursOn(e, eventSelectedDate));
    }

    if (eventSort === "upcoming") {
      list.sort((a, b) => {
        const ref = eventSelectedDate ?? todayYmd;
        const na = nextOccurrenceFrom(a, ref) ?? a.startDate;
        const nb = nextOccurrenceFrom(b, ref) ?? b.startDate;
        return na.localeCompare(nb);
      });
    } else if (eventSort === "masjid") {
      const masjidName = (id?: string) =>
        MASJID_REGISTRY.find((m) => m.id === id)?.name ?? "";
      list.sort((a, b) => masjidName(a.masjidId).localeCompare(masjidName(b.masjidId)));
    } else if (eventSort === "category") {
      list.sort((a, b) => {
        const ca = EVENT_CATEGORY_ORDER.indexOf(a.category);
        const cb = EVENT_CATEGORY_ORDER.indexOf(b.category);
        if (ca !== cb) return ca - cb;
        return a.startDate.localeCompare(b.startDate);
      });
    }

    return list;
  }, [eventCategoryFilter, eventSelectedDate, eventSort]);

  const shiftEventCalendar = useCallback((delta: number) => {
    setEventCalendarMonth((prev) => {
      const d = new Date(prev.year, prev.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }, []);

  // Memoized restaurant list
  const filteredRestaurants = useMemo(() => {
    let list = [...STATIC_RESTAURANT_INFO];
    
    if (restaurantSearchQuery.trim()) {
      const q = restaurantSearchQuery.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q));
    }

    if (restaurantCuisineFilter) {
      list = list.filter(r => r.cuisine === restaurantCuisineFilter);
    }

    if (restaurantSort === "distance" && userLocation) {
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
  }, [restaurantSearchQuery, userLocation, restaurantCuisineFilter, restaurantSort]);

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
        setRestaurantSort("distance");
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
    return MASJID_REGISTRY.map((info) => {
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
      : activeTab === "restaurants"
        ? "Halal Restaurants"
        : activeTab === "events"
          ? "Community Events"
          : "About TampaMuslim";

  return (
    <div className="layout-container">
      {/* ── Top Header ── */}
      <header className="header-top">
        <Link to="/" className="header-brand" style={{ textDecoration: "none" }}>
          <img src="/favicon/favicon.svg" alt="" className="header-brand__logo" aria-hidden="true" />
          TampaMuslim.com
        </Link>

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
            className={`desktop-nav__tab ${activeTab === "restaurants" ? "desktop-nav__tab--active" : ""}`}
            onClick={() => setActiveTab("restaurants")}
          >
            Restaurants
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

        <div key={activeTab} className="tab-panel">
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

            <div className="event-controls">
              <div className="event-controls__row">
                <label className="event-select">
                  <span className="event-select__label">Sort</span>
                  <select
                    value={eventSort}
                    onChange={(e) => setEventSort(e.target.value as typeof eventSort)}
                  >
                    <option value="upcoming">Most Recent</option>
                    <option value="masjid">By Masjid</option>
                    <option value="category">By Category</option>
                  </select>
                </label>

                <label className="event-select">
                  <span className="event-select__label">Filter by</span>
                  <select
                    value={eventCategoryFilter}
                    onChange={(e) => setEventCategoryFilter(e.target.value as EventCategory | "")}
                  >
                    <option value="">All categories</option>
                    {EVENT_CATEGORY_ORDER.map((cat) => (
                      <option key={cat} value={cat}>{EVENT_CATEGORY_LABELS[cat]}</option>
                    ))}
                  </select>
                </label>

                <div className="event-calendar-btn-group">
                  <button
                    type="button"
                    className={`event-calendar-btn${eventSelectedDate ? " event-calendar-btn--active" : ""}`}
                    onClick={() => setIsCalendarOpen(true)}
                    aria-label="Filter by date"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="16" height="16">
                      <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
                    </svg>
                    {eventSelectedDate ? formatSelectedDate(eventSelectedDate) : "Pick a date"}
                  </button>
                  {eventSelectedDate && (
                    <button
                      type="button"
                      className="event-calendar-clear-btn"
                      onClick={() => setEventSelectedDate(null)}
                      title="Clear date filter"
                      aria-label="Clear date filter"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {isCalendarOpen && typeof document !== "undefined" && createPortal(
              <div
                className="event-calendar-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Pick a date"
                onClick={() => setIsCalendarOpen(false)}
              >
                <div
                  className="event-calendar-modal__content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="event-calendar-modal__head">
                    <span className="event-calendar-modal__title">Filter by date</span>
                    <button
                      type="button"
                      className="event-calendar-modal__close"
                      onClick={() => setIsCalendarOpen(false)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                  <EventCalendar
                    year={eventCalendarMonth.year}
                    month={eventCalendarMonth.month}
                    events={STATIC_EVENTS}
                    selectedDate={eventSelectedDate}
                    onSelectDate={(ymd) => {
                      setEventSelectedDate(ymd);
                      setIsCalendarOpen(false);
                    }}
                    onPrevMonth={() => shiftEventCalendar(-1)}
                    onNextMonth={() => shiftEventCalendar(1)}
                  />
                  {eventSelectedDate && (
                    <button
                      type="button"
                      className="event-calendar-modal__clear"
                      onClick={() => {
                        setEventSelectedDate(null);
                        setIsCalendarOpen(false);
                      }}
                    >
                      Clear date filter
                    </button>
                  )}
                </div>
              </div>,
              document.body
            )}

            <div className="event-list">
              {filteredEvents.length === 0 ? (
                <p className="event-empty">No events match the current filters.</p>
              ) : (
                filteredEvents.map((event) => (
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
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "restaurants" && (
          <div className="tab-content restaurant-view">
            <p className="dummy-data-notice">⚠️ Restaurants listed are sample data and may not reflect current halal status or hours.</p>
            <div className="event-controls">
              <div className="event-controls__row">
                <label className="event-select">
                  <span className="event-select__label">Sort</span>
                  <select
                    value={restaurantSort}
                    onChange={(e) => setRestaurantSort(e.target.value as "name" | "distance")}
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="distance" disabled={!userLocation}>Closest First</option>
                  </select>
                </label>

                <label className="event-select">
                  <span className="event-select__label">Cuisine</span>
                  <select
                    value={restaurantCuisineFilter}
                    onChange={(e) => setRestaurantCuisineFilter(e.target.value)}
                  >
                    <option value="">All Cuisines</option>
                    {Array.from(new Set(STATIC_RESTAURANT_INFO.map(r => r.cuisine))).sort().map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>

                <div className="event-calendar-btn-group">
                  <button
                    type="button"
                    className={`event-calendar-btn${userLocation ? " event-calendar-btn--active" : ""}`}
                    onClick={handleRestaurantFindClosest}
                    disabled={restaurantLocateStatus === "loading"}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="16" height="16">
                      <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
                    </svg>
                    {restaurantLocateStatus === "loading"
                      ? "Locating..."
                      : restaurantLocateStatus === "denied" || restaurantLocateStatus === "unavailable"
                      ? "Location Unavailable"
                      : userLocation
                      ? "Location Found"
                      : "Find closest"}
                  </button>
                  {userLocation && (
                    <button
                      type="button"
                      className="event-calendar-clear-btn"
                      onClick={() => {
                        setUserLocation(null);
                        setRestaurantLocateStatus("idle");
                        if (restaurantSort === "distance") setRestaurantSort("name");
                      }}
                      title="Clear location"
                      aria-label="Clear location"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="restaurant-list">
              {filteredRestaurants.length === 0 ? (
                <p className="event-empty" style={{ gridColumn: "1 / -1" }}>No restaurants match your filters.</p>
              ) : (
                filteredRestaurants.map((r) => (
                  <div key={r.id} className="restaurant-card">
                  <div className="restaurant-card__image-container">
                    <img src={r.image} alt={r.name} className="restaurant-card__image" loading="lazy" />
                  </div>
                  <div className="restaurant-card__content">
                    <div className="restaurant-card__info">
                      <span className="restaurant-card__cuisine">{r.cuisine}</span>
                      <h3 className="restaurant-card__name">{r.name}</h3>
                      <div className="restaurant-card__meta">
                        <span className="restaurant-card__address">{r.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="about-content" style={{ padding: "0.5rem" }}>
            <p className="about-intro">
              <strong>TampaMuslim.com</strong> is your unified hub for connecting with the Tampa Bay Muslim community.
            </p>
            <div className="about-grid">
              <div className="about-card">
                <div className="about-card__header">
                  <span className="about-card__icon" aria-hidden="true">📍</span>
                  <h3 className="about-card__title">Prayer Times</h3>
                </div>
                <p className="about-card__text">
                  Find real-time Iqamah and Jumuah times backed dynamically by community-maintained sources, and effortlessly discover the closest masjids via your location.
                </p>
              </div>
              <div className="about-card">
                <div className="about-card__header">
                  <span className="about-card__icon" aria-hidden="true">🗓️</span>
                  <h3 className="about-card__title">Community Events</h3>
                </div>
                <p className="about-card__text">
                  Stay updated with our comprehensive calendar of halaqas, youth activities, fundraisers, and social gatherings.
                </p>
              </div>
              <div className="about-card">
                <div className="about-card__header">
                  <span className="about-card__icon" aria-hidden="true">🍔</span>
                  <h3 className="about-card__title">Halal Restaurants</h3>
                </div>
                <p className="about-card__text">
                  Explore our curated directory of local halal dining options, sortable by distance to satisfy any craving.
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
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
          className={`nav-tab ${activeTab === "restaurants" ? "nav-tab--active" : ""}`}
          onClick={() => setActiveTab("restaurants")}
        >
          <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><line x1="7" y1="2" x2="7" y2="22"></line><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h1"></path><line x1="21" y1="15" x2="21" y2="22"></line>
          </svg>
          Restaurants
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
