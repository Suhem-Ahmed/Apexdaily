# Apex Daily — Personal Day Planner

A premium, professional day-planning app with hourly timeline scheduling, daily/weekly views, and progress tracking. Warm white theme with amber accents.

![Theme](https://img.shields.io/badge/theme-warm%20white-C96A0A) ![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-blue)

---

## ✨ Features

- **Today Dashboard** — Daily progress ring, focus-time stats, task list
- **Hourly Timeline** — 24-hour scrollable view with a live "now" indicator line
- **Week Overview** — 7-day heatmap, category breakdown, upcoming tasks
- **Goals & Insights** — Streaks, 14-day activity chart, all-time stats
- **Add/Edit Tasks** — Category tags, priority levels, time pickers, notes
- **Persistent Storage** — All data saved locally on-device (AsyncStorage)
- **Offline-first** — No account, no server, no internet required

---

## 📱 Get the APK (3 ways)

### Option A — EAS Build (recommended, easiest, free)

1. **Push this project to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Apex Daily"
   git remote add origin https://github.com/YOUR_USERNAME/apex-daily.git
   git push -u origin main
   ```

2. **Create a free Expo account** at [expo.dev](https://expo.dev/signup)

3. **Install EAS CLI and build** (run locally or in GitHub Codespaces):
   ```bash
   npm install -g eas-cli
   npm install
   eas login
   eas build:configure
   eas build --platform android --profile preview
   ```

4. Wait ~10–15 minutes. EAS gives you a **download link for the `.apk`** directly — install it on your phone.

> The `eas.json` in this repo is already configured with a `preview` profile that builds a direct `.apk` (not an `.aab`), so you can sideload it immediately.

### Option B — GitHub Actions (fully automated)

Add this workflow file to auto-build on every push — see `.github/workflows/build.yml` included in this repo. You'll need to add your `EXPO_TOKEN` as a GitHub Secret (get it from expo.dev → Account Settings → Access Tokens).

Once set up, every push to `main` triggers a build, and you can download the resulting APK from the EAS dashboard or the Actions run summary.

### Option C — Local build (no EAS, full control)

```bash
npm install
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```
The APK will be at `android/app/build/outputs/apk/release/app-release.apk`.
Requires Android Studio / Android SDK installed locally.

---

## 🛠 Local Development

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS) to preview instantly without building anything.

---

## 📁 Project Structure

```
apex-daily/
├── App.js                      # Navigation + global state
├── app.json                    # Expo app config
├── eas.json                    # Build profiles (APK config)
├── babel.config.js
├── package.json
├── assets/                     # Icons & splash screen
└── src/
    ├── theme.js                 # Design tokens (colors, type, spacing)
    ├── storage.js                # AsyncStorage persistence helpers
    ├── components/index.js       # Shared UI (TaskCard, tags, etc.)
    ├── data/sampleTasks.js       # Categories, priorities, seed data
    └── screens/
        ├── DashboardScreen.js     # "Today" tab
        ├── TimelineScreen.js      # "Timeline" tab — hourly view
        ├── WeekScreen.js          # "Week" tab — overview
        ├── GoalsScreen.js         # "Goals" tab — stats/streaks
        └── AddTaskScreen.js       # Add/edit task modal
```

---

## 🎨 Theme

| Role | Color |
|---|---|
| Background | `#FAFAF8` Warm White |
| Card Surface | `#FFFFFF` / `#F4EFE6` |
| Primary Accent | `#C96A0A` Warm Amber |
| Work | `#C96A0A` |
| Focus | `#1D6FA4` Steel Blue |
| Health | `#1A7D5A` Forest Green |
| Personal | `#7040B0` Purple |
| Text | `#1C1917` Rich Charcoal |

All tokens live in `src/theme.js` — change them there to re-theme the whole app.

---

## 🔧 Customizing

- **Change app name/icon**: edit `app.json` and replace files in `/assets`
- **Change starting data**: edit `src/data/sampleTasks.js` → `getSampleTasks()`
- **Change colors**: edit `src/theme.js` → `Colors` object
- **Add new categories**: edit `CATEGORIES` in `src/data/sampleTasks.js`

---

## 📦 Tech Stack

- Expo SDK 51 / React Native 0.74
- React Navigation (bottom tabs + native stack)
- AsyncStorage for local persistence
- date-fns for date handling
- No backend — fully local, fully private
