// Game configuration - Easy to extend and maintain
// Comments in English only

window.GamesConfig = {
  games: [
    {
      id: "random-student",
      name: "Random Gọi Tên",
      description: "Quay chọn học sinh ngẫu nhiên bằng hình ảnh và tên",
      icon: "group",
      path: "games/random-student/index.html",
      color: "#22c55e", // primary green
    },
    {
      id: "mushroom-game",
      name: "Trò Chơi Cây Nấm",
      description: "Chọn các cây nấm có từ chứa vần ôn hoặc ôt",
      icon: "eco",
      path: "games/mushroom-game/index.html",
      color: "#e63946", // red (mushroom cap color)
    },
    // Add more games here in the future
  ],
};

