class Tile {
    constructor(name, points, type, translation) {
      this.name = name; // Chinese name
      this.points = points; // Tile points
      this.type = type; // Tile type (character, dot, bamboo)
      this.translation = translation; // English translation
      this.image = name; // Placeholder for now
    }
  }
  
  // Define tiles
  const tiles = [
    new Tile("1万", 1, "character", "1 character"),
    new Tile("2万", 2, "character", "2 characters"),
    new Tile("3万", 3, "character", "3 characters"),
    new Tile("4万", 4, "character", "4 characters"),
    new Tile("5万", 5, "character", "5 characters"),
    new Tile("6万", 6, "character", "6 characters"),
    new Tile("7万", 7, "character", "7 characters"),
    new Tile("8万", 8, "character", "8 characters"),
    new Tile("9万", 9, "character", "9 characters"),
    new Tile("1筒", 1, "dot", "1 dot"),
    new Tile("2筒", 2, "dot", "2 dots"),
    new Tile("3筒", 3, "dot", "3 dots"),
    new Tile("4筒", 4, "dot", "4 dots"),
    new Tile("5筒", 5, "dot", "5 dots"),
    new Tile("6筒", 6, "dot", "6 dots"),
    new Tile("7筒", 7, "dot", "7 dots"),
    new Tile("8筒", 8, "dot", "8 dots"),
    new Tile("9筒", 9, "dot", "9 dots"),
    new Tile("1条", 1, "bamboo", "1 bamboo"),
    new Tile("2条", 2, "bamboo", "2 bamboos"),
    new Tile("3条", 3, "bamboo", "3 bamboos"),
    new Tile("4条", 4, "bamboo", "4 bamboos"),
    new Tile("5条", 5, "bamboo", "5 bamboos"),
    new Tile("6条", 6, "bamboo", "6 bamboos"),
    new Tile("7条", 7, "bamboo", "7 bamboos"),
    new Tile("8条", 8, "bamboo", "8 bamboos"),
    new Tile("9条", 9, "bamboo", "9 bamboos")
  ];
  
  // Helper function to get random tiles
  function getRandomTiles(count) {
    const selectedTiles = [];
    for (let i = 0; i < count; i++) {
      const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
      selectedTiles.push(randomTile);
    }
    return selectedTiles;
  }
  
  // Initialize game state
  let playerTiles = [];
  let timeLeft = 60;
  let gameActive = false;
  
  // Render game board
  function renderBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = ""; // Clear board
  
    // Divide tiles into four segments
    const segments = [];
    for (let i = 0; i < 4; i++) {
      segments.push(playerTiles.slice(i * 3, i * 3 + 3));
    }
  
    // Render each segment
    segments.forEach((segment, segmentIndex) => {
      const segmentDiv = document.createElement("div");
      segmentDiv.classList.add("segment");
  
      segment.forEach((tile, tileIndex) => {
        const tileDiv = document.createElement("div");
        tileDiv.classList.add("tile");
        tileDiv.innerHTML = `<strong>${tile.name}</strong><br>${tile.translation}`;
        if (gameActive) {
          tileDiv.addEventListener("click", () => {
            const globalTileIndex = segmentIndex * 3 + tileIndex;
            playerTiles[globalTileIndex] = tiles[Math.floor(Math.random() * tiles.length)];
            renderBoard();
          });
        }
        segmentDiv.appendChild(tileDiv);
      });
  
      // Append the segment to the board
      gameBoard.appendChild(segmentDiv);
  
      // Add a visible divider after each segment except the last one
      if (segmentIndex < 3) {
        const divider = document.createElement("div");
        divider.classList.add("divider");
        gameBoard.appendChild(divider);
      }
    });
  }
  
  // Timer countdown
  function startTimer() {
    const timerElement = document.getElementById("timer");
    const interval = setInterval(() => {
      if (!gameActive) {
        clearInterval(interval);
        return;
      }
      timeLeft--;
      timerElement.textContent = `Time Left: ${timeLeft}`;
      if (timeLeft <= 0) {
        clearInterval(interval);
        gameActive = false;
        alert("Time's up!");
        renderBoard(); // Remove click listeners
      }
    }, 1000);
  }
  
  // Play button functionality
  document.getElementById("play-btn").addEventListener("click", () => {
    if (!gameActive) {
      playerTiles = getRandomTiles(12); // Assign new tiles
      timeLeft = 60; // Reset timer
      gameActive = true;
      renderBoard();
      startTimer();
    }
  });
  
  // Initial render
  renderBoard();
  