# Cosmora Development Log

Project: Cosmora (Hack Club Stardance Mission)  
Author: Kantaraj Luitel (Susant)  
GitHub: https://github.com/susantedit  

---

### Day 1: Project Setup and Initial Layout
- Decided to build an astronomy new tab start page for the Hack Club Stardance mission.
- Set up a clean Vite project with vanilla HTML, CSS, and JavaScript.
- Built the top navigation header and viewport container with glassmorphic cards.
- Configured `.env.example` and `.gitignore` to keep NASA API keys safe.

---

### Day 2: Dynamic Canvas Starfield
- The initial dark background felt too static, so I built an HTML5 canvas particle background.
- Generated hundreds of stars with independent twinkle speeds and subtle upward drift.
- Added cross lens flares for brighter foreground stars and occasional shooting stars.
- Hooked into `document.visibilitychange` to stop `requestAnimationFrame` when the user switches tabs to save CPU and battery.
- Added a `prefers-reduced-motion` media query check so users with motion sensitivity get a clean static background.

---

### Day 3: NASA APOD Integration
- Integrated NASA's Astronomy Picture of the Day API (`https://api.nasa.gov/planetary/apod`).
- Handled different media types returned by NASA (JPG/PNG images, YouTube video embeds, and direct MP4 clips).
- Added an in-memory Map cache so switching between views or re-selecting dates does not trigger unnecessary API requests.
- Built the temporal date picker modal allowing users to view any APOD record since June 16, 1995.

---

### Day 4: New Tab Dashboard & Local Storage Widgets
- Created the centerpiece digital clock and Google search input with a `/` hotkey focus shortcut.
- Built the quick launcher shortcuts card with an "Add Shortcut" modal, persisting custom bookmarks to `localStorage`.
- Built the daily task tracker to let users check off and delete items, also saved to `localStorage`.
- Created the quick scratchpad note area with automatic debounced saving to `localStorage` and character/word counters.
- Implemented lunar ephemeris calculations based on synodic orbital math to show moon illumination and render dynamic SVG phase shadow curves.

---

### Day 5: 3D Solar System Integration & Web Audio Synth
- Integrated Julian Garnier's open-source 3D CSS Solar System module (under MIT license) into an iframe for the "3D Orbits" view so users can inspect planetary orbits and toggle 2D/3D views.
- Created an ambient deep-space drone sound using native Web Audio API oscillators (55Hz sine sub-bass + 110Hz triangle wave) passing through a 220Hz lowpass filter with exponential gain fading.
- Cleaned up build scripts so the solar assets reside directly in `public/solar/` without needing custom copy scripts during build.

---

### Day 6: Modular Refactor, Testing & Polish
- Refactored the monolithic script into clean ES modules in `src/` (`apod.js`, `background.js`, `clock.js`, `shortcuts.js`, `tasks.js`, `notes.js`, `lunar.js`, `iss.js`, `audio.js`, `navigation.js`, and `main.js`).
- Verified responsive layouts on mobile and desktop viewports.
- Tested production build with `npm run build` and verified zero console warnings or missing assets.
