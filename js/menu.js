// Menu JavaScript - Dynamically load games from config
// Comments in English only

window.addEventListener("DOMContentLoaded", () => {
  const gamesGrid = document.getElementById("gamesGrid");

  if (!gamesGrid || !window.GamesConfig) {
    console.error("Games config or grid not found");
    return;
  }

  // Render all games
  window.GamesConfig.games.forEach((game) => {
    const gameCard = createGameCard(game);
    gamesGrid.appendChild(gameCard);
  });

  // If no games, show message
  if (window.GamesConfig.games.length === 0) {
    gamesGrid.innerHTML = `
      <div style="text-align: center; color: var(--muted); grid-column: 1 / -1; padding: 48px;">
        <p>Chưa có trò chơi nào được cấu hình.</p>
      </div>
    `;
  }
});

function createGameCard(game) {
  const card = document.createElement("a");
  card.href = game.path;
  card.className = "game-card";
  card.setAttribute("data-game-id", game.id);

  // Icon with color
  const iconStyle = game.color
    ? `background: linear-gradient(135deg, ${game.color}40, ${game.color}20); color: ${game.color};`
    : "";

  card.innerHTML = `
    <div class="game-icon" style="${iconStyle}">
      <span class="material-icons-round">${game.icon || "casino"}</span>
    </div>
    <div class="game-info">
      <h2 class="game-name">${game.name}</h2>
      <p class="game-description">${game.description || ""}</p>
    </div>
  `;

  return card;
}

