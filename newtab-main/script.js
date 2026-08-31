// light and dark theme

const savedTheme = localStorage.getItem("theme") || "dark";

document.body.classList.add(savedTheme);

// live clock and date

const clock = document.getElementById("clock");
const date = document.getElementById("date");

function updateClock() {
  const now = new Date();
  // time
  clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  // date
  date.textContent = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
updateClock();
setInterval(updateClock, 1000);

// nasa apod background

const background = document.querySelector(".background");
background.style.backgroundImage = "url('backgrounds/defaultbg.jpg')";

fetch(
  `https://api.nasa.gov/planetary/apod?api_key=pvidCKfvbcTQOPGd1CI1G6FGfOjjvKk9hc8kH2xc`
)
  .then((response) => response.json())
  .then((data) => {
    if (data.media_type === "image") {
      background.style.backgroundImage = `url(${data.hdurl || data.url})`;
    }
  })
  .catch((error) => {
    console.error(error);
  });

// search selector + searching part

const searchInput = document.getElementById("search-input");

const engineButton = document.getElementById("engine-button");
const engineIcon = document.getElementById("engine-icon");
const dropdown = document.getElementById("engine-dropdown");

const searchEngines = {
  google: {
    icon: "icons/google.svg",
    url: "https://www.google.com/search?q=",
  },

  duckduckgo: {
    icon: "icons/duckduckgo.svg",
    url: "https://duckduckgo.com/?q=",
  },

  brave: {
    icon: "icons/brave.svg",
    url: "https://search.brave.com/search?q=",
  },

  startpage: {
    icon: "icons/startpage.svg",
    url: "https://www.startpage.com/search?q=",
  },
};

let currentEngine = localStorage.getItem("searchEngine") || "google";

function setEngine(engine) {
  currentEngine = engine;

  engineIcon.src = searchEngines[engine].icon;

  localStorage.setItem("searchEngine", engine);
}

setEngine(currentEngine);

engineButton.addEventListener("click", (e) => {
  e.stopPropagation();

  dropdown.classList.toggle("hidden");
});

document.addEventListener("click", () => {
  dropdown.classList.add("hidden");
});

document.querySelectorAll(".engine-option").forEach((option) => {
  option.addEventListener("click", () => {
    setEngine(option.dataset.engine);

    dropdown.classList.add("hidden");
  });
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  const query = searchInput.value.trim();

  if (!query) return;

  const url = searchEngines[currentEngine].url + encodeURIComponent(query);
  window.open(url, "_blank");
});

// search box focus

searchInput.addEventListener("focus", () => {
  document.body.classList.add("search-active");
});

searchInput.addEventListener("blur", () => {
  document.body.classList.remove("search-active");
});

// settings panel works and accents
const settingsButton = document.getElementById("settings-button");

const settingsPanel = document.getElementById("settings-panel");

settingsButton.addEventListener("click", () => {
  settingsPanel.classList.toggle("hidden");
});

document.querySelectorAll(".accent").forEach((button) => {
  button.addEventListener("click", () => {
    document.documentElement.style.setProperty(
      "--accent",
      button.dataset.color
    );

    localStorage.setItem("accent", button.dataset.color);
  });
});

const accent = localStorage.getItem("accent");

if (accent) {
  document.documentElement.style.setProperty("--accent", accent);
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

// news section

const newsContainer = document.getElementById("news-container");

const newsTabs = document.querySelectorAll(".news-tab");

const API_KEY = "7c45c4dc5b53ff03b4aabbb890d066b2";

function loadNews(category = "general") {
  newsContainer.innerHTML = "";

  fetch(
    `https://corsproxy.io/?https://gnews.io/api/v4/top-headlines?lang=en&country=in&category=${category}&max=9&apikey=${API_KEY}`
  )
    .then((response) => response.json())

    .then((data) => {
      if (!data.articles || data.articles.length === 0) {
        newsContainer.innerHTML = `
                <p style="color:var(--text-muted);">
                    No news available.
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
                <img src="${
                  article.image || "backgrounds/newspaper.jpg"
                }" alt="News Image">

                <div class="news-content">

                    <h3>${article.title}</h3>

                    <p>${
                      article.description || "Click to read the full article."
                    }</p>

                    <div class="news-footer">

                        <i class="fa-regular fa-newspaper"></i>

                        ${article.source.name} • ${formattedDate}

                    </div>

                </div>
            `;

        newsContainer.appendChild(card);
      });
    })

    .catch((error) => {
      console.error("GNews Error:", error);

      newsContainer.innerHTML = `
            <p style="color:red;">
                Failed to load news.
            </p>
        `;
    });
}

loadNews();

newsTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelector(".news-tab.active").classList.remove("active");

    tab.classList.add("active");

    loadNews(tab.dataset.category);
  });
});

// had to use proxy api cuz i hosted this site in github
// fetch(
//   `https://gnews.io/api/v4/top-headlines?lang=en&country=in&category=${category}&max=9&apikey=${API_KEY}`
// )

// keyboard shortcuts
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
    searchInput.value = "";
    searchInput.blur();
  }
});
