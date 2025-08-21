# whatsapp-schedule

A tiny Express.js server that returns **today’s home service schedule** based on a CSV-like data block.  
Scheduling is computed using the **Asia/Muscat** timezone and simple “Every <weekday>” rules, then sorted by reporting time.

> **Endpoint:** `GET /` returns an HTML-formatted message listing today’s jobs (or a message if none).

---

## Table of Contents
- [Features](#features)
- [How It Works](#how-it-works)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [API](#api)
- [Data Format](#data-format)
- [Project Structure](#project-structure)
- [Known Limitations](#known-limitations)
- [Roadmap / Ideas](#roadmap--ideas)
- [License](#license)

---

## Features
- 🚀 Minimal setup: single route using Express.
- 🕒 Timezone-aware: computes “today” using **Asia/Muscat**.
- 📅 Supports simple recurrence rules:
  - `Daily`
  - `Every <Weekday>` (e.g., `Every Sunday`)
  - Multiple weekdays with `|` (e.g., `Every Sunday|Wednesday`)
- ⏱️ Results sorted by **Reporting Time**.

---

## How It Works
1. A CSV-like string defines scheduled jobs (contract number, mobile, location, vehicle count, schedule rule, and reporting time).
2. The server determines “today” in **Asia/Muscat** and checks each row’s schedule string.
3. Matching rows are sorted by reporting time and rendered as a simple HTML message with `<br>` breaks.

---

## Quick Start

### Prerequisites
- **Node.js ≥ 18** (recommended)

### Installation & Run
```bash
# clone your repository
git clone <your-repo-url>
cd whatsapp-schedule

# install dependencies
npm install

# start the server
npm start
