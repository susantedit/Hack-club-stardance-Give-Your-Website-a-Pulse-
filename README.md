# NASA New Tab (Stardance Mission)

A custom, space-themed new tab dashboard built for the [Hack Club Stardance: Give Your Website a Pulse](https://stardance.hackclub.com/missions/nasa-page) mission.

Built with **Vite**, **Vanilla JS**, **Glassmorphism CSS**, **NASA APOD API**, and automated **GitHub Actions CI/CD deployment**.

---

## 🌟 Key Features

- **NASA APOD API Integration**: Automatically fetches NASA's Astronomy Picture of the Day with full title, image, and scientific explanation modal.
- **Glassmorphism Space UI**: Custom typography (`Space Grotesk` + `Outfit`), translucent panels, ambient starfield particle canvas animation.
- **Interactive Dashboard**:
  - **12h / 24h Clock Toggle**: Click on the time to switch formats.
  - **Quick Links CRUD**: Add your favorite bookmarks and remove them on hover.
  - **Google Search Hotkey**: Press `/` anywhere on the page to jump focus to the search bar.
  - **Modal Escape Key**: Press `Escape` to dismiss open dialogs.
- **Environment Variable Security**: Uses `.env` and `import.meta.env.VITE_NASA_API_KEY` to keep keys organized across dev and prod environments.
- **Automated GitHub Actions Deployment**: Continuous deployment workflow (`.github/workflows/deploy.yml`) builds and deploys directly to GitHub Pages on every push to `main`.

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
├── index.html              # Main HTML structure
├── package.json            # Vite scripts & dependencies
├── script.js               # Dashboard logic, APOD API, Starfield canvas
├── style.css               # Glassmorphism design system & animations
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

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_NASA_API_KEY=your_nasa_api_key_here
   ```

4. **Start the Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for Production**:
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

Built with ❤️ by **[susantedit]** for Hack Club Stardance!
