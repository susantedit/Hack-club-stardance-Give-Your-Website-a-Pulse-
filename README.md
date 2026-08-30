# COSMORA — Deep Space Astronomical Observation Console

> *"Somewhere in the cosmos, something is waiting."*  
> *"The universe is closer than you think."*

A custom, cinematic deep-space observation dashboard built for the [Hack Club Stardance: Give Your Website a Pulse](https://stardance.hackclub.com/missions/nasa-page) mission.

Built with **Vite**, **Vanilla JS**, **Glassmorphism CSS**, **NASA APOD API**, and automated **GitHub Actions CI/CD deployment**.

🌐 **Live Website**: [https://susantedit.github.io/Hack-club-stardance-Give-Your-Website-a-Pulse-/](https://susantedit.github.io/Hack-club-stardance-Give-Your-Website-a-Pulse-/)  
📝 **Development Log**: [DEVLOG.md](DEVLOG.md)

---

## 🌟 Key Features

- **COSMORA Spacecraft Console**: A multi-layered celestial environment featuring procedural starfield canvas, breathing nebula cloud, gas giant planet sphere, and responsive 3D depth parallax.
- **Triple-State APOD Media Renderer**: Automatically handles High-Res Images (with HD view links), YouTube 16:9 responsive embeds, native HTML5 MP4 videos, and external interactive fallbacks.
- **Temporal Archive Explorer**: Search and view any historical NASA observation from **June 16, 1995 to Today** without full-page reloads.
- **Scientific Mission Log**: NASA explanations presented in a high-readability scientific observation panel with controlled measure (`70ch`) and line height.
- **Cosmic Telemetry HUD Grid**: Displays real-time observation date, media type, API source, and live transmission status.
- **Performance & Accessibility First**:
  - In-memory data caching (`apodCache` Map) eliminates redundant network calls.
  - Zero Cumulative Layout Shift (CLS < 0.01) with fixed skeleton loading boxes.
  - Full `@media (prefers-reduced-motion: reduce)` support and high-contrast WCAG AA typography.
  - Hotkey support (`/` to focus web search, `Escape` to close modals, `tabindex="0"` focus rings).

---

## 🛠️ Project Structure

```
nasa-new-tab/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions CI/CD deployment workflow
├── .env                    # Local API key (ignored by Git)
├── .env.example            # Environment template for GitHub
├── .gitignore              # Ignores .env, node_modules, dist
├── COSMORA.png             # Official COSMORA brand logo asset
├── index.html              # Main HTML structure & SEO metadata
├── package.json            # Vite scripts & dependencies
├── script.js               # COSMORA engine, APOD fetcher, starfield canvas
├── style.css               # Cosmic design system, glass panels & animations
├── vite.config.js          # Vite config & base URL for GitHub Pages
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher)
- A free NASA API key from [api.nasa.gov](https://api.nasa.gov/)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/susantedit/Hack-club-stardance-Give-Your-Website-a-Pulse-.git
   cd Hack-club-stardance-Give-Your-Website-a-Pulse-
   ```

2. **Navigate into the project folder**:
   > **Note**: Make sure to run `cd nasa-new-tab` before running npm commands!
   ```bash
   cd nasa-new-tab
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Configure Environment Variables**:
   Create a `.env` file inside `nasa-new-tab/`:
   ```env
   VITE_NASA_API_KEY=your_nasa_api_key_here
   ```

5. **Start the Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

6. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to GitHub Pages with GitHub Actions

1. Go to your repo on GitHub: **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret**:
   - **Name**: `VITE_NASA_API_KEY`
   - **Value**: Your actual NASA API key.
3. Go to **Settings** > **Pages** > **Source** and select **GitHub Actions**.
4. Push any commit to `main`. The `.github/workflows/deploy.yml` action will automatically build and publish your site!

---

## 📜 License & Author

Built with ❤️ by **[susantedit]** for [Hack Club Stardance: Give Your Website a Pulse](https://stardance.hackclub.com/missions/nasa-page)!
