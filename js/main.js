const grid = document.getElementById("puzzleGrid");
const searchInput = document.getElementById("searchInput");
const difficultyFilter = document.getElementById("difficultyFilter");
const tagFilters = document.getElementById("tagFilters");
const resultCount = document.getElementById("resultCount");
const emptyMessage = document.getElementById("emptyMessage");
const randomButton = document.getElementById("randomButton");

let selectedTag = "すべて";

const allTags = [...new Set(PUZZLES.flatMap(p => p.tags))];

function stars(level) {
  return "★".repeat(level) + "☆".repeat(5 - level);
}

function createTags() {
  tagFilters.innerHTML = "";

  ["すべて", ...allTags].forEach(tag => {
    const button = document.createElement("button");
    button.className = "tag-filter" + (tag === selectedTag ? " active" : "");
    button.textContent = tag;

    button.addEventListener("click", () => {
      selectedTag = tag;
      createTags();
      render();
    });

    tagFilters.appendChild(button);
  });
}

function matches(puzzle) {
  const keyword = searchInput.value.trim().toLowerCase();
  const difficulty = Number(difficultyFilter.value);

  const text = [
    puzzle.title,
    puzzle.description,
    ...puzzle.tags
  ].join(" ").toLowerCase();

  const keywordMatch = !keyword || text.includes(keyword);
  const tagMatch = selectedTag === "すべて" || puzzle.tags.includes(selectedTag);
  const difficultyMatch = difficulty === 0 || puzzle.difficulty === difficulty;

  return keywordMatch && tagMatch && difficultyMatch;
}

function createCard(puzzle) {
  const article = document.createElement("article");
  article.className = "puzzle-card";

  article.innerHTML = `
    <a href="${puzzle.url}" target="_blank" rel="noopener" class="card-image">
      <img src="${puzzle.image}" alt="${puzzle.title}" onerror="this.style.display='none'">
      <div class="image-placeholder">${puzzle.title}</div>
      <span class="open-mark">↗</span>
    </a>

    <div class="card-body">
      <div class="card-tags">
        ${puzzle.tags.map(tag => `<span>${tag}</span>`).join("")}
      </div>

      <h3>${puzzle.title}</h3>
      <p class="description">${puzzle.description}</p>

      <div class="meta">
        <span>${stars(puzzle.difficulty)}</span>
        <span>${puzzle.playTime}</span>
      </div>

      <div class="card-actions">
        <a class="play-button" href="${puzzle.url}" target="_blank" rel="noopener">
          WEB版で遊ぶ
        </a>
        ${
          puzzle.vrchat
            ? `<a class="vrchat-button" href="${puzzle.vrchatUrl}" target="_blank" rel="noopener">VRChat版</a>`
            : ""
        }
      </div>
    </div>
  `;

  return article;
}

function render() {
  const filtered = PUZZLES.filter(matches);

  grid.innerHTML = "";
  filtered.forEach(puzzle => grid.appendChild(createCard(puzzle)));

  resultCount.textContent = `${filtered.length}作品`;
  emptyMessage.classList.toggle("hidden", filtered.length !== 0);
}

searchInput.addEventListener("input", render);
difficultyFilter.addEventListener("change", render);

randomButton.addEventListener("click", () => {
  const candidates = PUZZLES.filter(matches);
  if (candidates.length === 0) {
    alert("条件に一致する作品がありません。");
    return;
  }

  const puzzle = candidates[Math.floor(Math.random() * candidates.length)];
  window.open(puzzle.url, "_blank", "noopener");
});

createTags();
render();
