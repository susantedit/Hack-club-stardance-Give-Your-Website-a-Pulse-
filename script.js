const savedTheme = localStorage.getItem("theme") || "dark";
document.body.classList.add(savedTheme);

const clock = document.getElementById("clock");
const date = document.getElementById("date");

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  date.textContent = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
updateClock();
setInterval(updateClock, 1000);

const background = document.querySelector(".background");
const apodLink = document.getElementById("apod-link");
const todayDateStr = new Date().toISOString().split("T")[0];

function applyApodData(data) {
  if (data && data.media_type === "image") {
    const imageUrl = data.hdurl || data.url;
    background.style.backgroundImage = `url('${imageUrl}')`;
    if (apodLink) {
      apodLink.title = `${data.title || "APOD"} (${data.date || "NASA"}) - Click to learn more`;
      if (data.hdurl || data.url) {
        apodLink.href = data.hdurl || data.url;
      }
    }
  }
}

background.style.backgroundImage = "url('backgrounds/defaultbg.jpg')";

const cachedApod = localStorage.getItem("nasa_apod_cache");
if (cachedApod) {
  try {
    const parsed = JSON.parse(cachedApod);
    if (parsed.date === todayDateStr && parsed.media_type === "image") {
      applyApodData(parsed);
    }
  } catch (e) {
    console.error("APOD cache parse error:", e);
  }
}

fetch(
  `https://api.nasa.gov/planetary/apod?api_key=pvidCKfvbcTQOPGd1CI1G6FGfOjjvKk9hc8kH2xc`
)
  .then((response) => {
    if (!response.ok) throw new Error("NASA API response error");
    return response.json();
  })
  .then((data) => {
    applyApodData(data);
    try {
      localStorage.setItem("nasa_apod_cache", JSON.stringify(data));
    } catch (e) {
      console.warn("Could not cache APOD data:", e);
    }
  })
  .catch((error) => {
    console.warn("Using default background image due to APOD error:", error);
  });

const searchInput = document.getElementById("search-input");
const engineButton = document.getElementById("engine-button");
const engineIcon = document.getElementById("engine-icon");
const dropdown = document.getElementById("engine-dropdown");

const searchEngines = {
  google: {
    name: "Google",
    icon: "icons/google.svg",
    url: "https://www.google.com/search?q=",
  },
  duckduckgo: {
    name: "DuckDuckGo",
    icon: "icons/duckduckgo.svg",
    url: "https://duckduckgo.com/?q=",
  },
  brave: {
    name: "Brave",
    icon: "icons/brave.svg",
    url: "https://search.brave.com/search?q=",
  },
  startpage: {
    name: "Startpage",
    icon: "icons/startpage.svg",
    url: "https://www.startpage.com/search?q=",
  },
};

let currentEngine = localStorage.getItem("searchEngine") || "google";
if (!searchEngines[currentEngine]) {
  currentEngine = "google";
}

function setEngine(engine) {
  currentEngine = engine;
  engineIcon.src = searchEngines[engine].icon;
  engineIcon.alt = searchEngines[engine].name;
  localStorage.setItem("searchEngine", engine);
}

setEngine(currentEngine);

engineButton.addEventListener("click", (e) => {
  e.stopPropagation();
  const isHidden = dropdown.classList.toggle("hidden");
  engineButton.setAttribute("aria-expanded", !isHidden);
});

document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target) && e.target !== engineButton) {
    dropdown.classList.add("hidden");
    engineButton.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll(".engine-option").forEach((option) => {
  option.addEventListener("click", () => {
    setEngine(option.dataset.engine);
    dropdown.classList.add("hidden");
    engineButton.setAttribute("aria-expanded", "false");
    searchInput.focus();
  });
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  const query = searchInput.value.trim();
  if (!query) return;

  const url = searchEngines[currentEngine].url + encodeURIComponent(query);
  window.open(url, "_blank");
});

searchInput.addEventListener("focus", () => {
  document.body.classList.add("search-active");
});

searchInput.addEventListener("blur", () => {
  document.body.classList.remove("search-active");
});

const settingsButton = document.getElementById("settings-button");
const settingsPanel = document.getElementById("settings-panel");

settingsButton.addEventListener("click", () => {
  const isHidden = settingsPanel.classList.toggle("hidden");
  settingsButton.setAttribute("aria-expanded", !isHidden);
});

document.addEventListener("click", (e) => {
  if (
    !settingsPanel.contains(e.target) &&
    e.target !== settingsButton &&
    !settingsButton.contains(e.target)
  ) {
    settingsPanel.classList.add("hidden");
    settingsButton.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll(".accent").forEach((button) => {
  button.addEventListener("click", () => {
    document.documentElement.style.setProperty("--accent", button.dataset.color);
    localStorage.setItem("accent", button.dataset.color);
  });
});

const savedAccent = localStorage.getItem("accent");
if (savedAccent) {
  document.documentElement.style.setProperty("--accent", savedAccent);
}

const themeButtons = document.querySelectorAll(".theme-btn");
themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;
    document.body.classList.remove("dark", "light");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  });
});

const newsContainer = document.getElementById("news-container");
const newsTabs = document.querySelectorAll(".news-tab");
const API_KEY = "7c45c4dc5b53ff03b4aabbb890d066b2";

function loadNews(category = "general") {
  newsContainer.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
      <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.5rem;"></i>
      <p style="margin-top: 10px;">Fetching latest stories...</p>
    </div>
  `;

  fetch(
    `https://corsproxy.io/?https://gnews.io/api/v4/top-headlines?lang=en&country=in&category=${category}&max=9&apikey=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      newsContainer.innerHTML = "";
      if (!data.articles || data.articles.length === 0) {
        newsContainer.innerHTML = `
          <p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">
            No news available right now.
          </p>
        `;
        return;
      }

      data.articles.forEach((article) => {
        const publishDate = new Date(article.publishedAt);
        const formattedDate = publishDate.toLocaleDateString([], {
          month: "short",
          day: "numeric",
        });

        const card = document.createElement("a");
        card.className = "news-card";
        card.href = article.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";

        card.innerHTML = `
          <img src="${article.image || "backgrounds/newspaper.jpg"}" 
               alt="News Thumbnail"
               onerror="this.onerror=null;this.src='backgrounds/newspaper.jpg';">
          <div class="news-content">
            <h3>${article.title || "Headline"}</h3>
            <p>${article.description || "Click to read the full story on the original publication."}</p>
            <div class="news-footer">
              <i class="fa-regular fa-newspaper"></i>
              ${(article.source && article.source.name) || "News"} • ${formattedDate}
            </div>
          </div>
        `;

        newsContainer.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("GNews Error:", error);
      newsContainer.innerHTML = `
        <p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">
          Failed to load news headlines at the moment.
        </p>
      `;
    });
}

loadNews();

newsTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    newsTabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    loadNews(tab.dataset.category);
  });
});

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
    return;
  }

  if (
    e.key === "/" &&
    document.activeElement !== searchInput &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.altKey
  ) {
    e.preventDefault();
    searchInput.focus();
    return;
  }

  if (e.key === "Escape") {
    if (searchInput === document.activeElement) {
      searchInput.value = "";
      searchInput.blur();
    }
    dropdown.classList.add("hidden");
    settingsPanel.classList.add("hidden");
  }
});
