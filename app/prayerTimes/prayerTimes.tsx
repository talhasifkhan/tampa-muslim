import { useMemo, useState, useEffect } from "react";

type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha" | "Jumuah";

export type Masjid = {
  id: string;
  name: string;
  address: string;
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
    website: "https://www.istaba.org/",
  },
  {
    id: "isonet",
    name: "Islamic Society of New Tampa (ISONET)",
    address: "15830 Morris Bridge Rd, Tampa, FL",
    website: "https://www.isonet.org/",
  },
  {
    id: "qassam",
    name: "Masjid Al-Qassam (ICT)",
    address: "6406 N 56th St, Tampa, FL",
    website: "https://ictampa.org/",
  },
  {
    id: "brndon",
    name: "Islamic Center of Brandon",
    address: "1006 Victoria Street. Brandon, FL 33510",
    website: "https://www.brandonmasjid.org/",
  },
  {
    id: "tmc",
    name: "The Muslim Connection (TMC)",
    address: "8080 N 56th St, Tampa, FL 33617",
    website: "https://themuslimconnection.com/",
  }
];

const PRAYER_ORDER: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha", "Jumuah"];

export function PrayerTimes({ csvData = [] }: { csvData?: any[] }) {
  const [selectedMasjidId, setSelectedMasjidId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"prayers" | "events" | "about">("prayers");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setIsDrawerOpen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTabSelect = (tab: "prayers" | "events" | "about") => {
    setActiveTab(tab);
    if (typeof window === "undefined") {
      return;
    }

    if (window.innerWidth < 1024) {
      setIsDrawerOpen(false);
    }
  };

  const masjidsData = useMemo(() => {
    return STATIC_MASJID_INFO.map((info) => {
      const csvRow = csvData.find((row) => row.masjid_name?.trim() === info.name.trim());
      
      const iqamahTimes: Record<PrayerName, string> = {
        Fajr: csvRow?.Fajr || "-",
        Dhuhr: csvRow?.Dhuhr || "-",
        Asr: csvRow?.Asr || "-",
        Maghrib: csvRow?.Maghrib || "-",
        Isha: csvRow?.Isha || "-",
        Jumuah: csvRow?.Jumuah || "-"
      };
      
      const jumuahTimesRaw = csvRow?.Jumuah || "";
      let jumuahTimesArray: string[] = [];
      if (jumuahTimesRaw && jumuahTimesRaw !== "-") {
        jumuahTimesArray = jumuahTimesRaw.split(",").map((s: string) => s.trim());
      }
      
      return {
        ...info,
        iqamahTimes,
        multipleKhutbahs: jumuahTimesArray.length > 1,
        jumuahTimes: jumuahTimesArray,
        lastUpdated: csvRow?.last_updated || ""
      } as Masjid;
    });
  }, [csvData]);

  const selectedMasjid = useMemo(
    () => masjidsData.find((masjid) => masjid.id === selectedMasjidId),
    [selectedMasjidId, masjidsData],
  );

  const headingTitle =
    activeTab === "prayers"
      ? "Prayer Times"
      : activeTab === "events"
        ? "Community Events"
        : "About TampaMuslim";

  return (
    <>
      <header className="prayer-brand">TampaMuslim.com</header>
      <button
        type="button"
        className="drawer-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={isDrawerOpen}
        aria-controls="prayer-sidebar"
        onClick={() => setIsDrawerOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <aside
        id="prayer-sidebar"
        className={`prayer-drawer${isDrawerOpen ? " prayer-drawer--open" : ""}`}
      >
        <div className="prayer-drawer__header">
          <h2>tampamuslim.com</h2>
          <p>Your community quick links</p>
        </div>
        <nav className="prayer-drawer__nav" aria-label="Prayer app sections">
          <button
            type="button"
            className={`prayer-drawer__link${activeTab === "prayers" ? " prayer-drawer__link--active" : ""}`}
            onClick={() => handleTabSelect("prayers")}
          >
            Prayer Times
          </button>
          <button
            type="button"
            className={`prayer-drawer__link${activeTab === "events" ? " prayer-drawer__link--active" : ""}`}
            onClick={() => handleTabSelect("events")}
          >
            Events
          </button>
          <button
            type="button"
            className={`prayer-drawer__link${activeTab === "about" ? " prayer-drawer__link--active" : ""}`}
            onClick={() => handleTabSelect("about")}
          >
            About
          </button>
        </nav>
      </aside>

      <div
        className={`prayer-overlay${isDrawerOpen ? " prayer-overlay--visible" : ""}`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden={!isDrawerOpen}
      />

      <main className="prayer-main">
        <section className="prayer-card">
          <header className="prayer-heading">
            <h1 className="prayer-heading__title">{headingTitle}</h1>
          </header>

          {activeTab === "prayers" && (
            <>
              <label className="prayer-form" htmlFor="masjid-select">
                <span className="prayer-form__label">Masjid</span>
                <select
                  id="masjid-select"
                  value={selectedMasjidId}
                  onChange={(event) => setSelectedMasjidId(event.target.value)}
                  className="prayer-select"
                >
                  <option value="" disabled>
                    Choose a masjid...
                  </option>
                  {masjidsData.map((masjid) => (
                    <option key={masjid.id} value={masjid.id}>
                      {masjid.name}
                    </option>
                  ))}
                </select>
              </label>

              {selectedMasjid ? (
                <article className="prayer-card__content">
                  <div className="prayer-info">
                    <h2 className="prayer-info__title">{selectedMasjid.name}</h2>
                    <span className="prayer-info__subtitle">
                      {selectedMasjid.address}
                    </span>
                  </div>

                  <div className="prayer-grid">
                    {PRAYER_ORDER.map((prayer) => {
                      if (prayer === "Jumuah") {
                        const jumuahTimes = selectedMasjid.jumuahTimes;
                        const primaryTime =
                          jumuahTimes && jumuahTimes.length > 0
                            ? jumuahTimes[0]
                            : selectedMasjid.iqamahTimes.Jumuah;

                        return (
                          <div className="prayer-grid__item" key={prayer}>
                            <span className="prayer-grid__name">{prayer}</span>
                            <span className="prayer-grid__time">{primaryTime}</span>
                          </div>
                        );
                      }

                      return (
                        <div className="prayer-grid__item" key={prayer}>
                          <span className="prayer-grid__name">{prayer}</span>
                          <span className="prayer-grid__time">
                            {selectedMasjid.iqamahTimes[prayer]}
                          </span>
                        </div>
                      );
                    })}

                    {selectedMasjid.multipleKhutbahs &&
                    selectedMasjid.jumuahTimes &&
                    selectedMasjid.jumuahTimes.length > 1
                      ? selectedMasjid.jumuahTimes.slice(1).map((time, index) => (
                          <div className="prayer-grid__item" key={`extra-jumuah-${index}`}>
                            <span className="prayer-grid__name">{`Jumuah ${index + 2}`}</span>
                            <span className="prayer-grid__time">{time}</span>
                          </div>
                        ))
                      : null}
                  </div>
                  
                  <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", fontSize: "0.85rem", color: "#666" }}>
                    <span>
                      {selectedMasjid.lastUpdated && `Last updated: ${selectedMasjid.lastUpdated}`}
                    </span>
                    <a 
                      href="https://docs.google.com/forms/d/e/1FAIpQLSfakgO9s0pIemEJJvdgs_zw_xcTZa8dmFrwOTE0a6FMP995bQ/viewform?usp=dialog" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: "#2563eb", textDecoration: "underline", textUnderlineOffset: "2px" }}
                    >
                      Notice incorrect times? Update here
                    </a>
                  </div>

                  <div className="prayer-actions">
                    <a
                      className="prayer-action"
                      href={selectedMasjid.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
                    <a
                      className="prayer-action prayer-action--secondary"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedMasjid.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Maps
                    </a>
                  </div>
                </article>
              ) : (
                <article className="prayer-card__content prayer-card__content--empty">
                  <p className="prayer-empty">
                    Select a masjid to view prayer times.
                  </p>
                </article>
              )}
            </>
          )}

          {activeTab === "events" && (
            <article className="prayer-card__content prayer-card__content--empty">
              <p className="prayer-empty">Events coming soon!</p>
            </article>
          )}

          {activeTab === "about" && (
            <article className="prayer-card__content prayer-card__content--empty">
              <p className="prayer-empty">
                TampaMuslim.com exists to make it easy to keep up with prayer timings and happenings
                across the community. Stay tuned as we add more!
              </p>
            </article>
          )}
        </section>
      </main>
    </>
  );
}
