# 🚀 COSMORA — Hack Club Stardance Mission Devlog

> *"Somewhere in the cosmos, something is waiting."*  
> *"The universe is closer than you think."*

Welcome to the official development log for **COSMORA**, a custom deep-space astronomical observation dashboard created by **[Kantaraj Luitel (Susant)](https://github.com/susantedit)** for the [Hack Club Stardance Mission](https://stardance.hackclub.com/missions/nasa-page).

- 👨‍💻 **Developer**: Kantaraj Luitel (Susant) (Nepal 🇳🇵)
- 🌐 **Portfolio/GitHub**: [https://github.com/susantedit](https://github.com/susantedit)
- ☕ **Support/Donate**: [Buy Me a Coffee](https://buymeacoffee.com/Susantedit)

---

## 📅 Log Entry 1: Conceptualization & Architecture Setup
- **Goal**: Create a new tab dashboard experience that feels like looking through a spacecraft observation viewport into deep space.
- **Tech Stack Selected**: HTML5, Vanilla CSS3 (Glassmorphism design system), Vanilla JavaScript (ES Modules), Vite bundler, and NASA APOD REST API.
- **Initial Setup**: Configured Vite configuration (`vite.config.js`), environment variable handling (`.env` and `.env.example`), `.gitignore` secret exclusion, and Node 22 GitHub Actions automated deployment workflow (`.github/workflows/deploy.yml`).

---

## 🌌 Log Entry 2: Cosmic Background & Particle Animation Engine
- **Procedural Canvas Starfield**: Built an HTML5 `<canvas>` particle system generating multi-depth star layers (far faint stars + near bright starlight flares) with continuous upward floating motion, sinusoidal sway, and individual twinkling phases.
- **4-Point Starlight Lens Flares**: Programmed a 4-point cross flare renderer (`draw4PointStar`) for prominent celestial stars.
- **Shooting Meteors**: Added a dynamic meteor generator spawning 45-degree angle shooting stars with gradient decay tails across the screen.

---

## 🪐 Log Entry 3: 3D Celestial Planets & Atmosphere
- **Saturn-Like Ringed Gas Giant**: Constructed a 3D CSS planet (`.planet-saturn`) with an tilted elliptical dual-tone ring system (`.saturn-ring-system`) and subtle 45s floating keyframe animation.
- **Plasma Sun Core**: Rendered a deep space plasma star (`.star-plasma-sun`) in the upper-left quadrant featuring pulsating radial solar flare gradients.
- **Orbiting Exo-Moon**: Created a 3D orbiting moon (`.moon-orbit-system`) revolving in a 360° trajectory around its celestial anchor.
- **Violet Aurora Curtain**: Added a glowing violet/magenta nebula curtain (`.nebula-aurora`) with 40s ambient rotation.

---

## 📡 Log Entry 4: NASA APOD API Integration & In-Memory Cache
- **Data Service Engine**: Integrated NASA's Planetary APOD API (`getAPOD()`) with support for High-Res Images, 16:9 YouTube video embeds, native MP4 videos, and interactive fallbacks.
- **In-Memory Transmission Cache**: Implemented an in-memory `apodCache = new Map()` data structure. Revisiting previously viewed dates or clicking `TODAY` loads instantly from memory with zero redundant API calls.
- **Layout Shift Prevention (CLS < 0.01)**: Designed fixed-dimension skeleton loaders matching the APOD media stage container.

---

## 🔊 Log Entry 5: Web Audio API Cosmic Synth & Interactive Features
- **Pure Browser Web Audio Synth**: Programmed a zero-dependency dual-oscillator Web Audio synth (55Hz sub-bass drone + 110Hz harmonic) with smooth exponential gain fading accessible via the **`AUDIO ON`** button in the top navigation bar.
- **Temporal Date Archive Explorer**: Built an in-page modal date picker allowing visitors to explore historical NASA observations back to June 16, 1995.
- **Live Telemetry Clock**: UTC clock displaying hours, minutes, and seconds with clickable 12h / 24h format toggling.

---

## ♿ Log Entry 6: Accessibility, Performance & SEO Audit
- **WCAG AA Compliance**: High-contrast typography palette (`#f2f6ff` primary text, 16.8:1 contrast ratio against deep space background).
- **Reduced Motion**: Full `@media (prefers-reduced-motion: reduce)` support disabling canvas rendering and CSS keyframe transforms for users with motion sensitivity.
- **Production Build & CI/CD**: Verified clean Vite production builds (`npm run build`) and automated GitHub Pages deployment.

---

🌐 **Live Deployed Site**: [https://susantedit.github.io/Hack-club-stardance-Give-Your-Website-a-Pulse-/](https://susantedit.github.io/Hack-club-stardance-Give-Your-Website-a-Pulse-/)  
📁 **GitHub Repository**: [susantedit/Hack-club-stardance-Give-Your-Website-a-Pulse-](https://github.com/susantedit/Hack-club-stardance-Give-Your-Website-a-Pulse-)
