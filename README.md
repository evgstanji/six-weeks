# 6-Weeks Calisthenics Tracker (Telegram Mini App)

A lightweight, free, and open-source **Telegram Mini App (TMA)** workout tracker designed for bodyweight progressive overload. Built with a local-first client architecture, zero server infrastructure, and structured around the classic **"Just 6 Weeks" / Steve Speirs** linear progression methodology.

---

## 📌 About the Methodology

The training programs in this repository are based on the **"The 6-Week Training Program"** framework (originally created and popularized by Steve Speirs via *hundredpushups.com*, *50pullups.com*, etc., and later adapted by commercial apps like *Just 6 Weeks* and *Runtastic*).

### Core Training Principles:
1. **Initial Assessment (Exhaustion Test):** Users test their max clean reps in a single set before Week 1, sorting them into discrete starting tiers (`Tier 1` to `Tier 4`).
2. **Submaximal Volume Density:** Each workout splits the target load across 5 to 8 sets with strict rest timers (45–120s), training muscular endurance and mitochondrial capacity without systemic fatigue.
3. **AMRAP Final Sets:** The final set of every session is an *As Many Reps As Possible* set (minimum threshold target, pushed to failure) to gauge recovery and adaptation.
4. **Bi-weekly Exhaustion Tests:** End of Weeks 2, 4, and 5 require a maximum-effort single set to automatically recalculate the tier for the next training block.

---

## 🚀 Features

- **Zero-Backend Architecture:** Runs 100% on the client side with no monthly server bills or external databases.
- **Telegram Native:** Seamless single-click onboarding via Telegram WebApp integration.
- **Cross-Device Cloud Sync:** Progress is persisted using `Telegram.WebApp.CloudStorage` (backed up across devices without user registration).
- **Haptic Rest Timers:** Built-in countdown clock with native device vibration patterns (`HapticFeedback`) upon completion.
- **Complete Exercise Datasets:** Ready-to-import, schema-validated JSON matrices for:
  - 100 Pushups (`pushups_100`)
  - 50 Pull-ups (`pullups_50`)
  - 200 Squats (`squats_200`)
  - 200 Sit-ups / Crunches (`situps_200`)

---

## 📂 Repository Structure

```text
├── data/
│   ├── pushups_program.json     # Full 6-week matrix for pushups
│   ├── pullups_program.json     # Pull-ups matrix with 90-120s timers
│   ├── squats_program.json      # Squats progression (high-volume sets)
│   └── situps_program.json      # Core training volume matrix
├── src/
│   ├── components/              # Set cards, Rest Timer, Onboarding Flow
│   ├── hooks/                   # useTelegram, useCloudStorage, useWorkout
│   ├── types/                   # TypeScript interfaces for JSON matrices
│   ├── App.tsx                  # Root SPA component
│   └── main.tsx                 # Entrypoint
├── public/                      # Static assets & icons
├── package.json
└── README.md
```

---

## 📊 Data Schema Overview

Each workout JSON follows a deterministic structure:

```json
{
  "program_id": "pushups_100",
  "title": "100 Pushups in 6 Weeks",
  "initial_test": {
    "tiers": [
      { "tier_id": "tier_1", "min_reps": 0, "max_reps": 5, "start_week": 1 }
    ]
  },
  "weeks": [
    {
      "week_number": 1,
      "days": [
        {
          "day_number": 1,
          "tiers": {
            "tier_1": {
              "sets": [2, 3, 2, 2, 3],
              "rest_seconds": [60, 60, 60, 60],
              "amrap_last_set": true
            }
          }
        }
      ],
      "benchmark_test_after_week": null
    }
  ]
}
```

---

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- pnpm, yarn, or npm
- A Telegram bot created via [@BotFather](https://t.me/BotFather)

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/tma-6weeks-workout.git
cd tma-6weeks-workout

# Install dependencies
npm install

# Start local dev server
npm run dev
```

### Exposing to Telegram for Local Testing
To test Telegram WebApp features locally (such as `CloudStorage` and `HapticFeedback`), expose your local port with a secure tunnel:
```bash
npx ngrok http 5173
```
Then paste the generated HTTPS forwarding URL into your Bot settings on `@BotFather` (`/setmenubutton` or `/newapp`).

---

## 🤖 Bot

The `bot/` folder contains a tiny Cloudflare Worker that replies to `/start` with a welcome message
(free app, workouts run in the mini app, feedback link). It is deployed by GitHub Actions — see `bot/README.md`.

---

## 🚢 Deployment (100% Free Hosting)

This application can be deployed instantly using GitHub Actions to **GitHub Pages**, **Vercel**, or **Cloudflare Pages**:

1. Push your code to the `main` branch.
2. Set up GitHub Pages under `Settings` -> `Pages` -> Source: `GitHub Actions`.
3. Link the resulting `https://<username>.github.io/<repo>` URL to your Telegram Bot in `@BotFather`.

---

## 📜 License

MIT License. Free for personal, commercial, and educational use. Contributions and PRs are welcome!