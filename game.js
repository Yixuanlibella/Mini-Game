class Tile {
    constructor(name, points, type, translation) {
      this.name = name; // Chinese name
      this.points = points; // Tile points
      this.type = type; // Tile type (character, dot, bamboo)
      this.translation = translation; // English translation
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
  
  let playerTiles = [];
  let timeLeft = 60;
  let gameActive = false;
  
  function getRandomTiles(count) {
    const selectedTiles = [];
    for (let i = 0; i < count; i++) {
      selectedTiles.push(tiles[Math.floor(Math.random() * tiles.length)]);
    }
    return selectedTiles;
  }
  
  function calculateScore(units) {
    let totalScore = 0;
    let keziCount = 0;
    let shunziCount = 0;
  
    units.forEach((unit) => {
      const points = unit.map((tile) => tile.points);
      const types = unit.map((tile) => tile.type);
  
      const isKezi = unit.every(
        (tile) =>
          tile.name === unit[0].name &&
          tile.type === unit[0].type &&
          tile.points === unit[0].points
      );
  
      const isShunzi =
        types.every((type) => type === types[0]) &&
        points.sort((a, b) => a - b).every((val, idx, arr) => idx === 0 || val === arr[idx - 1] + 1);
  
      let unitScore = points.reduce((sum, point) => sum + point, 0);
      if (isKezi) {
        unitScore *= 2;
        keziCount++;
      } else if (isShunzi) {
        unitScore *= 2;
        shunziCount++;
      }
  
      totalScore += unitScore;
    });
  
    return `Congratulations, you have formed ${shunziCount} Shunzi, ${keziCount} Kezi, your total score is: ${totalScore}`;
  }
  
  function renderBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";
  
    const segments = [];
    for (let i = 0; i < 4; i++) {
      segments.push(playerTiles.slice(i * 3, i * 3 + 3));
    }
  
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
            renderBoard(); // Rerender to reflect changes
          });
        }
        segmentDiv.appendChild(tileDiv);
      });
  
      gameBoard.appendChild(segmentDiv);
  
      if (segmentIndex < 3) {
        const divider = document.createElement("div");
        divider.classList.add("divider");
        gameBoard.appendChild(divider);
      }
    });
  
    if (!gameActive) {
      document.getElementById("score-message").textContent = calculateScore(segments);
    }
  }
  
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
        renderBoard(); // End game and display score
      }
    }, 1000);
  }
  
  document.getElementById("play-btn").addEventListener("click", () => {
    playerTiles = getRandomTiles(12); // Generate 12 random tiles
    timeLeft = 60; // Reset timer
    gameActive = true;
    renderBoard();
    startTimer();
  });
  
  renderBoard();
  