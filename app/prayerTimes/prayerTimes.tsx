import { useMemo, useState, useEffect } from "react";


type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha" | "Jumuah";

type Masjid = {
  id: string;
  name: string;
  address: string;
  iqamahTimes: Record<PrayerName, string>;
  website: string;
  multipleKhutbahs: boolean;
  jumuahTimes?: string[];
};

const MASJIDS: Masjid[] = [
  {
    id: "istaba",
    name: "Islamic Society of Tampa Bay Area (ISTABA)",
    address: "7326 E. Sligh Ave, Tampa, FL",
    iqamahTimes: {
      Fajr: "5:45 AM",
      Dhuhr: "1:30 PM",
      Asr: "5:00 PM",
      Maghrib: "Sunset",
      Isha: "8:30 PM",
      Jumuah: "12:30 PM"
    },
    website: "https://www.istaba.org/",
    multipleKhutbahs: true,
    jumuahTimes: ["12:30 PM", "1:40 PM"],
  },
  {
    id: "isonet",
    name: "Islamic Society of New Tampa (ISONET) ",
    address: "15830 Morris Bridge Rd, Tampa, FL",
    iqamahTimes: {
      Fajr: "6:00 AM",
      Dhuhr: "1:35 PM",
      Asr: "4:55 PM",
      Maghrib: "Sunset",
      Isha: "8:45 PM",
      Jumuah: "1:30 PM"
    },
    website: "https://www.isonet.org/",
    multipleKhutbahs: true,
    jumuahTimes: ["1:30 PM", "2:45 PM"],
  },
  {
    id: "qassam",
    name: "Masjid Al-Qassam (ICT)",
    address: "6406 N 56th St, Tampa, FL",
    iqamahTimes: {
      Fajr: "5:50 AM",
      Dhuhr: "1:25 PM",
      Asr: "5:05 PM",
      Maghrib: "Sunset",
      Isha: "8:35 PM",
      Jumuah: "1:40 PM"
    },
    website: "https://ictampa.org/",
    multipleKhutbahs: false,
    jumuahTimes: ["1:40 PM"],
  },
    {
    id: "brndon",
    name: "Islamic Center of Brandon",
    address: "1006 Victoria Street. Brandon, FL 33510",
    iqamahTimes: {
      Fajr: "5:50 AM",
      Dhuhr: "1:25 PM",
      Asr: "5:05 PM",
      Maghrib: "Sunset",
      Isha: "8:35 PM",
      Jumuah: "1:40 PM"
    },
    website: "https://www.brandonmasjid.org/",
    multipleKhutbahs: false,
    jumuahTimes: ["1:40 PM"],
  },
];

const PRAYER_ORDER: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha", "Jumuah"];

export function PrayerTimes() {
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

  const selectedMasjid = useMemo(
    () => MASJIDS.find((masjid) => masjid.id === selectedMasjidId),
    [selectedMasjidId],
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
                  {MASJIDS.map((masjid) => (
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
