# InPost Point Advisor

## Author

- **Name:** Sylwia Rybak
- **Email:** sylwwia.72@gmail.com

## Overview

InPost Point Finder is a web app that helps you find the best InPost parcel locker or pickup point near any address across Europe. You enter a location, set your preferences, and get a ranked list of the closest and most suitable points — with an interactive map to explore them visually.

## Demo & Description

### The problem

Whenever I needed to pick up a parcel, the InPost app would show me a flat list of nearby lockers with no real sense of which one is actually the best option for me. Distance matters, but so does whether a point is operating, available 24/7, or a locker vs. a staffed pickup point. I wanted something that makes that decision for me.

### What it does

You type in an address (or just a city or landmark — anything Nominatim can geocode), pick a country, set your max distance and result count, and hit **Find best points**. The app:

1. Fetches all InPost points for the selected country directly from the InPost API
2. Geocodes your address to coordinates using Nominatim (OpenStreetMap's free geocoder)
3. Scores every point using a weighted algorithm that factors in distance, operating status, 24/7 availability, and your preferred point type
4. Returns a ranked list with the top results and an interactive map showing the top 5

Clicking any result on the list scrolls to the map and flies to that pin. Searching the same country again skips the fetch entirely and recalculates instantly from cached data.

### Scoring algorithm

Each point is scored out of a maximum of ~485 points:

- **Distance** — up to 400 points, decreasing linearly (`400 - distance_km × 80`). Proximity is the dominant factor by design.
- **Operating status** — +50 points
- **24/7 availability** — +20 points
- **Preferred type match** — +15 points if the user selected locker or pickup point specifically

Points are sorted by score descending, with distance as a tiebreaker.

### Demo

https://github.com/user-attachments/assets/6e91830d-3400-4abd-902d-1dd755f0d9a3

## Technologies

| **React + TypeScript** | Component model fits the UI well; TypeScript catches shape mismatches against the API early |
| **Vite** | Fast dev server and build, zero config for a React/TS project |
| **Leaflet + react-leaflet** | Best-in-class open source map library, no API key required, pairs naturally with OpenStreetMap tiles |
| **OpenStreetMap (Nominatim)** | Free geocoding with no key needed — converts addresses to coordinates |
| **InPost Points API** | The primary data source — paginated REST API |

No UI component library was used — all styles are hand-written CSS to keep the bundle lean and the design intentional.

## How to run

### Prerequisites

- Node.js 18 or higher
- npm

### Build & run

```bash
# Clone the repository
git clone https://github.com/rybaks72/InPost-Point-Advisor.git
cd InPost-Point-Advisor

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# To build for production
npm run build
```

## What I would do with more time

**Smarter data loading** — right now the app fetches all pages for a country in parallel on first search (~150k points for Poland). It's fast thanks to `Promise.all`, but the data could be cached in `localStorage` with a TTL so repeat visits don't fetch at all.

**Locker availability** — the API returns `locker_availability` with slot status (A/B/C sizes). Surfacing this in the ranking card would make the tool genuinely more useful than the official app.

**More scoring signals** — `easy_access_zone`, `physical_type` (e.g. InPost Next vs standard), and `location_category` are all in the API response and could meaningfully affect recommendations.

**Tests** — the scoring and recommendation logic is pure functions with no side effects, making them ideal candidates for unit tests. I would start there.

## AI usage

I used Claude as a sounding board for specific problems — mostly when I was stuck on something like the Leaflet map behaviour or structuring the parallel fetch. I'd describe the issue, evaluate what it suggested, and adapt it to fit the codebase. The architecture, the scoring logic, and the product decisions were mine. AI sped up the debugging loop, but I wrote and understood every line that made it in.

## Anything else?

The InPost API has no location-based filtering — you can't ask it for "points near Warsaw". That means you have to fetch an entire country's worth of data and filter client-side, which is why the initial load takes a few seconds for larger countries like Poland (307 pages × 500 items). The parallel fetch brings this down significantly compared to sequential requests, but it's a fundamental constraint of the API.

One deliberate design choice: distance is weighted heavily enough that a point 0.1 km away will always beat a 24/7 point 2 km away. I think that's the right call for a tool meant to help you pick the most convenient option — convenience is almost always about proximity first.
