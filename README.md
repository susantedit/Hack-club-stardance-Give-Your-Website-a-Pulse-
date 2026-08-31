# Cosmora

Cosmora is a space-themed new tab dashboard and astronomy start page built for the Hack Club Stardance mission.

Instead of opening a blank browser tab, Cosmora gives you a clean dark dashboard featuring NASA's Astronomy Picture of the Day, an interactive 3D solar system view, local task tracking, quick bookmarks, scratchpad notes, moon phase math, and ambient space audio.

## Demo

- Live site: https://susantedit.github.io/Hack-club-stardance-Give-Your-Website-a-Pulse-/
- GitHub: https://github.com/susantedit/Hack-club-stardance-Give-Your-Website-a-Pulse-

## Why I Built It

I spend a lot of time in my browser and wanted a custom new tab page that felt like an astronomy dashboard rather than an empty page or a generic browser default. I have always been fascinated by space exploration and wanted to build something that combines daily NASA imagery with useful everyday developer tools like quick links, a task list, and a scratchpad.

## Features

- **Daily NASA APOD**: Pulls the daily Astronomy Picture of the Day from NASA's Open API, supporting high-resolution images, YouTube video embeds, and direct MP4 clips with scientific explanations.
- **Archive Date Explorer**: Allows jumping back to any date in astronomical history since NASA started the APOD archive on June 16, 1995.
- **Interactive 3D Solar System**: View planetary orbits, toggle between 2D and 3D perspectives, and inspect planet speeds and sizes.
- **Lunar Calculations**: Computes real-time synodic moon phases, illumination percentage, lunar age in days, and countdown to the next full moon.
- **Simulated ISS Telemetry**: Shows simulated real-time orbital speed, altitude, coordinates, and geomagnetic conditions.
- **Quick Bookmarks Launcher**: Customizable shortcuts for favorite websites stored locally in `localStorage`.
- **Mission Task List**: Persistent checklist to keep track of daily goals, saved in `localStorage`.
- **Scratchpad Notes**: Auto-saving note area with live character and word counters.
- **Ambient Space Drone**: Dual-oscillator synthesizer built using native Web Audio API (55Hz sine wave and 110Hz triangle wave through a low-pass filter).
- **Canvas Starfield**: Procedural 2D canvas starfield with drifting stars, twinkling brightness, and shooting meteors.

## Technologies Used

- **HTML5 & CSS3**: Glassmorphism dark UI, CSS Grid layout, responsive typography (Cinzel, Cormorant Garamond, Manrope).
- **JavaScript (ES Modules)**: Native vanilla JS without framework dependencies.
- **Web APIs**: Web Audio API (ambient synth), Canvas 2D API (starfield), LocalStorage API (tasks, notes, shortcuts).
- **NASA Open Data API**: Planetary Astronomy Picture of the Day (APOD) endpoint.
- **Vite 5**: Bundler and local development server.

## Third-Party Components & Attribution

- **3D CSS Solar System**: The 3D planetary visualization embedded in the "3D Orbits" view is based on Julian Garnier's [3D CSS Solar System](https://github.com/juliangarnier/3D-CSS-Solar-System), licensed under the MIT License (see `public/solar/LICENSE.md`). Cosmora integrates this module into an iframe and provides the surrounding dashboard, NASA APOD integrations, canvas engine, and application logic.

## Running Locally

### Prerequisites
- Node.js 18 or higher
- npm

### 1. Clone the repository
```bash
git clone https://github.com/susantedit/Hack-club-stardance-Give-Your-Website-a-Pulse-.git
cd Hack-club-stardance-Give-Your-Website-a-Pulse-
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables (Optional)
Copy the example environment file:
```bash
cp .env.example .env
```
Add your NASA API key in `.env`:
```ini
VITE_NASA_API_KEY=YOUR_NASA_API_KEY
```
*(If no key is provided, the application defaults to `DEMO_KEY`).*

### 4. Start development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Build for production
```bash
npm run build
```
The production bundle will be generated inside the `dist/` directory.

## Project Structure

```text
- index.html: Main HTML layout and dashboard structure
- style.css: Design system and layout styles
- vite.config.js: Vite configuration
- package.json: Project dependencies
- src/main.js: App entry point and event wiring
- src/apod.js: NASA APOD fetching, caching, and media rendering
- src/background.js: Canvas starfield particle loop and parallax
- src/clock.js: Dashboard and UTC clocks
- src/shortcuts.js: Bookmark launcher and modal
- src/tasks.js: Persistent to-do list manager
- src/notes.js: Scratchpad with auto-save and counters
- src/lunar.js: Moon phase calculations and SVG shadow curve
- src/iss.js: Simulated ISS orbital telemetry
- src/audio.js: Web Audio ambient drone synthesizer
- src/navigation.js: View routing and modal controls
- public/COSMORA.png: Logo asset
- public/solar/: 3D Solar System module by Julian Garnier (MIT)
```

## What I Learned

- How to fetch and parse diverse REST API payloads (handling both static image formats and YouTube/HTML5 video embeds).
- How to create a performant 2D canvas animation that pauses gracefully when the browser tab is hidden using `document.visibilitychange`.
- How to generate audio directly in the browser with Web Audio API oscillators and gain nodes without loading external MP3 files.
- Calculating synodic lunar orbital cycles to dynamically construct SVG shadow curves for moon phases.
- Structuring a modular vanilla JavaScript codebase using ES modules.

## Known Limitations

- The ISS orbital telemetry and geomagnetic Kp-index values are simulated via mathematical approximations rather than live satellite radio feeds.
- The default NASA `DEMO_KEY` has hourly rate limits (30 requests per IP per hour). Adding a free personal key from api.nasa.gov is recommended for heavy archive browsing.

## Creator

Built by **Kantaraj Luitel (Susant)**
- GitHub: https://github.com/susantedit
- LinkedIn: https://linkedin.com/in/kantaraj-luitel

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
