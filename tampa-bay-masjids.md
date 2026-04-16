# Tampa Bay Area Masjids

Compiled: 2026-04-13  
Purpose: Review list before adding to TampaMuslim.com

**Format for each entry matches the `STATIC_MASJID_INFO` structure:**
`id`, `name`, `address`, `lat`, `lng`, `website`

> ✅ = Already in the app  
> 🆕 = New, needs review  
> ⚠️ = Coordinates need verification (approximated from address)

---

## Already in the App

| # | Name | ID | Address | Lat | Lng | Website |
|---|------|----|---------|-----|-----|---------|
| 1 | Islamic Society of Tampa Bay Area (ISTABA) | `istaba` | 7326 E. Sligh Ave, Tampa, FL 33610 | 27.9897 | -82.3876 | https://www.istaba.org/ |
| 2 | Islamic Society of New Tampa (ISONET) | `isonet` | 15830 Morris Bridge Rd, Tampa, FL 33592 | 28.0742 | -82.3471 | https://www.newtampamasjid.org/ |
| 3 | Masjid Al-Qassam (ICT) | `qassam` | 6406 N 56th St, Tampa, FL 33617 | 28.0244 | -82.3936 | https://ictampa.org/ |
| 4 | Islamic Center of Brandon | `brndon` | 1006 Victoria Street, Brandon, FL 33510 | 27.9333 | -82.2878 | https://www.brandonmasjid.org/ |
| 5 | The Muslim Connection (TMC) | `tmc` | 8080 N 56th St, Tampa, FL 33617 | 28.0444 | -82.3936 | https://themuslimconnection.com/ |
| 6 | Masjid Al-Rahma | `alrahma` | 9844 Skewlee Rd, Thonotosassa, FL 33592 | 28.0550 | -82.2850 | https://alrahmamasjid.org/ |
| 7 | Jesus Son of Mary Center (JSMC) | `jsmc` | 3457 W Kenyon Ave, Tampa, FL 33614 | 28.0260 | -82.4980 | https://jsmctampa.org/ |

---

## Candidates to Add

> **Note:** Coordinates below are approximate — verify on Google Maps before adding to the app.  
> Iqamah times will need to be added to the Google Sheet separately.

---

### Hillsborough County

| # | Name | ID | Address | Lat (approx) | Lng (approx) | Website |
|---|------|----|---------|-------------|-------------|---------|
| 8 | Masjid Abu Bakr As-Siddiq | `abubakr` | 11010 N 30th St, Tampa, FL 33612 | 28.0520 | -82.4590 | https://masjedabubakr.com/ |
| 9 | Masjid Omar Al Mokhtar | `omaralmokhtar` | 1307 W North B St, Tampa, FL 33606 | 27.9510 | -82.4660 | https://masjidomaralmokhtar.org/ |
| 10 | Masjid Al Ansar | `alansar` | 4334 W Waters Ave, Tampa, FL 33614 | 28.0290 | -82.5080 | — |
| 11 | Barkallah Islamic Community Center | `barkallah` | 916 York Dr, Brandon, FL 33510 | 27.9350 | -82.2980 | https://barkallahtampa.org/ |
| 12 | ISRA Masjid (Islamic Society of Riverview Area) | `isra` | 8527 Richmond St, Gibsonton, FL 33534 | 27.8370 | -82.3710 | https://isramasjid.org/ |

---

### Pasco County

| # | Name | ID | Address | Lat (approx) | Lng (approx) | Website |
|---|------|----|---------|-------------|-------------|---------|
| 13 | Masjid An-Noor / Islamic Community of Wesley Chapel | `annoor` | 2250 Ashley Oaks Cir #101, Wesley Chapel, FL 33544 | 28.2110 | -82.3500 | https://wesleychapelmasjid.org/ |

---

### Pinellas County

| # | Name | ID | Address | Lat (approx) | Lng (approx) | Website |
|---|------|----|---------|-------------|-------------|---------|
| 14 | Islamic Society of Pinellas County (ISPC) — Masjid Ebad Alrahman | `ispc` | 9400 67th St N, Pinellas Park, FL 33782 | 27.8640 | -82.7220 | https://ispc-fl.org/ |
| 15 | Masjid Al Salaam (Islamic Society of North Pinellas) | `alsalaam` | 1218 New York Ave, Dunedin, FL 34698 | 28.0200 | -82.7760 | https://dunedinmasjid.org/ |
| 16 | St. Petersburg Islamic Center — Masjid Al Muminin | `spic` | 3762 18th Ave S, St. Petersburg, FL 33711 | 27.7520 | -82.6700 | — |
| 17 | Muhammad Mosque No. 95 | `mm95` | 1111 18th Ave S, St. Petersburg, FL 33705 | 27.7540 | -82.6580 | https://mosque95.org/ |

---

### Polk County

| # | Name | ID | Address | Lat (approx) | Lng (approx) | Website |
|---|------|----|---------|-------------|-------------|---------|
| 18 | Islamic Center of Lakeland | `lakeland` | 1161 Blossom Cir S, Lakeland, FL 33805 | 28.0370 | -81.9450 | — |
| 19 | Masjid Al Nur | `alnur` | 325 Lyle Pkwy, Bartow, FL 33830 | 27.8960 | -81.8300 | https://alnurbartow.com/ |

---

## Action Items Before Adding

- [ ] Verify coordinates for all "Candidates to Add" entries using Google Maps
- [ ] Confirm addresses are current (some may have moved)
- [ ] Check if masjids have working websites (noted `—` where unknown)
- [ ] Add iqamah times to the Google Sheet for each new masjid
- [ ] Confirm `id` field doesn't conflict with existing entries in `STATIC_MASJID_INFO`
- [ ] Decide scope: include Polk County masjids (Lakeland/Bartow) or keep to Tampa Bay proper?

---

## Sources

- Individual masjid websites
- Salatomatic Tampa Bay directory
- IslamicFinder
- Google Maps searches for "mosque Tampa Bay", "Islamic center Pinellas county", etc.
