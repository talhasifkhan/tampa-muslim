import { Link } from "react-router";
import { useEffect } from "react";
import { useTheme } from "../useTheme";
import { prefetchPrayerTimes } from "../data/csvCache";

const QUOTES = [
  {
    text: "Indeed, with hardship comes ease.",
    source: "Quran 94:6",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
  },
  {
    text: "And He is with you wherever you are.",
    source: "Quran 57:4",
    arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
  },
  {
    text: "So remember Me; I will remember you.",
    source: "Quran 2:152",
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
  },
  {
    text: "And your Lord says, 'Call upon Me; I will respond to you.'",
    source: "Quran 40:60",
    arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
  },
  {
    text: "Allah does not burden a soul beyond that it can bear.",
    source: "Quran 2:286",
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
  },
  {
    text: "Verily, Allah is with the patient.",
    source: "Quran 2:153",
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
  },
  {
    text: "And He found you lost and guided you.",
    source: "Quran 93:7",
    arabic: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ",
  },
  {
    text: "Whoever saves one life, it is as if he has saved all of mankind.",
    source: "Quran 5:32",
    arabic: "وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا",
  },
  {
    text: "Indeed, Allah loves those who rely upon Him.",
    source: "Quran 3:159",
    arabic: "إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ",
  },
  {
    text: "And do good; indeed, Allah loves the doers of good.",
    source: "Quran 2:195",
    arabic: "وَأَحْسِنُوا ۛ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ",
  },
  {
    text: "The best of people are those who are most beneficial to others.",
    source: "Hadith — al-Mu'jam al-Awsat",
    arabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
  },
  {
    text: "None of you truly believes until he loves for his brother what he loves for himself.",
    source: "Hadith — Bukhari & Muslim",
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
  },
  {
    text: "Smiling at your brother is charity.",
    source: "Hadith — Tirmidhi",
    arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ",
  },
  {
    text: "Speak good or remain silent.",
    source: "Hadith — Bukhari & Muslim",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
  },
  {
    text: "The strong person is not the one who can wrestle someone down, but the one who controls themselves when angry.",
    source: "Hadith — Bukhari",
    arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",
  },
  {
    text: "Make things easy, do not make them difficult; give glad tidings, do not cause people to flee.",
    source: "Hadith — Bukhari & Muslim",
    arabic: "يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا",
  },
  {
    text: "The merciful are shown mercy by the Most Merciful. Show mercy to those on earth, and He in heaven will show mercy to you.",
    source: "Hadith — Tirmidhi",
    arabic: "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الْأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ",
  },
  {
    text: "Verily, actions are by intentions.",
    source: "Hadith — Bukhari & Muslim",
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
  },
  {
    text: "Take advantage of five before five: your youth before your old age, your health before your illness, your wealth before your poverty, your free time before your preoccupation, and your life before your death.",
    source: "Hadith — al-Hakim",
    arabic: "اغْتَنِمْ خَمْسًا قَبْلَ خَمْسٍ",
  },
  {
    text: "Do not belittle any good deed, even meeting your brother with a cheerful face.",
    source: "Hadith — Muslim",
    arabic: "لَا تَحْقِرَنَّ مِنَ الْمَعْرُوفِ شَيْئًا، وَلَوْ أَنْ تَلْقَى أَخَاكَ بِوَجْهٍ طَلْقٍ",
  },
];

const dailyQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];


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
    tab: "restaurants",
    label: "Halal Restaurants",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h1" />
        <line x1="21" y1="15" x2="21" y2="22" />
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

  // Kick off the CSV fetch while the user reads the landing page so
  // prayer times are ready (or nearly ready) when they navigate to /app.
  useEffect(() => {
    prefetchPrayerTimes();
  }, []);
  return (
    <div className="layout-container" style={{ paddingBottom: 0 }}>
      <header className="header-top">
        <h1 className="header-brand">
          <img src="/favicon/favicon.svg" alt="" className="header-brand__logo" aria-hidden="true" />
          TampaMuslim.com
        </h1>
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
      <main className="main-content landing-welcome">
        <div className="landing-icon" aria-hidden="true">
          <img src="/favicon/favicon.svg" alt="" className="landing-icon__logo" />
        </div>
        <h2 className="section-title">Assalamu Alaikum</h2>
        <p className="landing-subtitle">What are you looking for?</p>
        {/* <div className="daily-reminder landing-reminder">
          <p className="daily-reminder__arabic">{dailyQuote.arabic}</p>
          <p className="daily-reminder__translation">"{dailyQuote.text}"</p>
          <p className="daily-reminder__reference">— {dailyQuote.source}</p>
        </div> */}
        <div className="landing-cards-container">
          {SECTIONS.map(({ tab, label, icon }) => (
            <Link key={tab} to={`/app?tab=${tab}`} prefetch="intent" viewTransition className="section-card">
              <span className="section-card__icon">{icon}</span>
              <div style={{ flex: 1 }}>
                <div className="section-card__label">{label}</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="section-card__chevron" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
          <Link to="/changelog" prefetch="intent" viewTransition className="landing-changelog-link">
            View changelog
          </Link>
        </div>
      </main>
    </div>
  );
}
