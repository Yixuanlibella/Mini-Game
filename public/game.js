// Game state variables
let playerTiles = [];
let timeLeft = 180; // Timer duration in seconds
let gameActive = false;

// Generate all Mahjong tiles
function generateAllTiles() {
  return [
    // Character tiles (1万 - 9万)
    { name: "1万", points: 1, type: "character", translation: "1 character" },
    { name: "2万", points: 2, type: "character", translation: "2 characters" },
    { name: "3万", points: 3, type: "character", translation: "3 characters" },
    { name: "4万", points: 4, type: "character", translation: "4 characters" },
    { name: "5万", points: 5, type: "character", translation: "5 characters" },
    { name: "6万", points: 6, type: "character", translation: "6 characters" },
    { name: "7万", points: 7, type: "character", translation: "7 characters" },
    { name: "8万", points: 8, type: "character", translation: "8 characters" },
    { name: "9万", points: 9, type: "character", translation: "9 characters" },

    // Dot tiles (1筒 - 9筒)
    { name: "1筒", points: 1, type: "dot", translation: "1 dot" },
    { name: "2筒", points: 2, type: "dot", translation: "2 dots" },
    { name: "3筒", points: 3, type: "dot", translation: "3 dots" },
    { name: "4筒", points: 4, type: "dot", translation: "4 dots" },
    { name: "5筒", points: 5, type: "dot", translation: "5 dots" },
    { name: "6筒", points: 6, type: "dot", translation: "6 dots" },
    { name: "7筒", points: 7, type: "dot", translation: "7 dots" },
    { name: "8筒", points: 8, type: "dot", translation: "8 dots" },
    { name: "9筒", points: 9, type: "dot", translation: "9 dots" },

    // Bamboo tiles (1条 - 9条)
    { name: "1条", points: 1, type: "bamboo", translation: "1 bamboo" },
    { name: "2条", points: 2, type: "bamboo", translation: "2 bamboos" },
    { name: "3条", points: 3, type: "bamboo", translation: "3 bamboos" },
    { name: "4条", points: 4, type: "bamboo", translation: "4 bamboos" },
    { name: "5条", points: 5, type: "bamboo", translation: "5 bamboos" },
    { name: "6条", points: 6, type: "bamboo", translation: "6 bamboos" },
    { name: "7条", points: 7, type: "bamboo", translation: "7 bamboos" },
    { name: "8条", points: 8, type: "bamboo", translation: "8 bamboos" },
    { name: "9条", points: 9, type: "bamboo", translation: "9 bamboos" },
  ];
}

// Generate random tiles for the player
function getRandomTiles(count) {
  const tiles = generateAllTiles();
  const selectedTiles = [];
  for (let i = 0; i < count; i++) {
    selectedTiles.push(tiles[Math.floor(Math.random() * tiles.length)]);
  }
  return selectedTiles;
}

// Render the game board
function renderBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = ""; // Clear the game board

  const groups = getGroups(playerTiles); // Divide tiles into groups

  // Calculate the current score and patterns (Shunzi, Kezi, Duizi)
  const result = calculateScore(groups);

  // Update the live message
  const scoreMessageElement = document.getElementById("score-message");
  scoreMessageElement.textContent = `Score: ${result.totalScore} (${result.shunziCount} Shunzi, ${result.keziCount} Kezi, ${result.duiziCount} Duizi).`;

  // Render each group of tiles
  groups.forEach((group) => {
    const groupDiv = document.createElement("div");
    groupDiv.classList.add("tile-group");

    group.forEach((tile) => {
      const tileDiv = document.createElement("div");
      tileDiv.classList.add("tile");
      tileDiv.innerHTML = `<strong>${tile.name}</strong><br>${tile.translation}`;

      // Add click event to replace the tile
      tileDiv.addEventListener("click", () => {
        if (gameActive) {
          const tileIndex = playerTiles.indexOf(tile);
          playerTiles[tileIndex] = getRandomTiles(1)[0]; // Replace the clicked tile
          renderBoard(); // Re-render the board with updated tiles
        }
      });

      groupDiv.appendChild(tileDiv);
    });

    gameBoard.appendChild(groupDiv);
  });

  console.log("Game board rendered. Current score:", result); // Debug log
}


// Timer logic
function startTimer() {
  const timerElement = document.getElementById("timer");
  const interval = setInterval(() => {
    if (!gameActive || timeLeft <= 0) {
      clearInterval(interval);
      if (timeLeft <= 0) {
        endGame(); // Call endGame when time runs out
      }
      return;
    }

    timeLeft--;
    timerElement.textContent = `Time Left: ${timeLeft}`;
  }, 1000); // Update every second
}
function calculateScore(groups) {
  let totalScore = 0;
  let keziCount = 0;
  let shunziCount = 0;
  let duiziCount = 0;

  // Evaluate 4 groups of 3 tiles
  for (let i = 0; i < 4; i++) {
    const group = groups[i];
    const points = group.map((tile) => tile.points);
    const types = group.map((tile) => tile.type);

    const isKezi =
      group.length === 3 &&
      group.every((tile) => tile.name === group[0].name);

    const isShunzi =
      group.length === 3 &&
      types.every((type) => type === types[0]) &&
      points
        .slice()
        .sort((a, b) => a - b)
        .every((val, idx, arr) => idx === 0 || val === arr[idx - 1] + 1);

    let groupScore = points.reduce((sum, point) => sum + point, 0);
    if (isKezi) {
      groupScore *= 2;
      keziCount++;
    } else if (isShunzi) {
      groupScore *= 2;
      shunziCount++;
    }

    totalScore += groupScore;
  }

  // Evaluate the last group of 2 tiles
  const lastGroup = groups[4];
  if (
    lastGroup.length === 2 &&
    lastGroup[0].name === lastGroup[1].name
  ) {
    duiziCount++;
    totalScore += (lastGroup[0].points + lastGroup[1].points) * 2;
  } else {
    totalScore += lastGroup.reduce((sum, tile) => sum + tile.points, 0);
  }

  // Check for Hu (winning pattern)
  const isHu = keziCount + shunziCount === 4 && duiziCount === 1;

  return {
    totalScore,
    keziCount,
    shunziCount,
    duiziCount,
    isHu, // Add the Hu status to the result
  };
}

// Split tiles into groups
function getGroups(tiles) {
  const groups = [];
  for (let i = 0; i < 4; i++) {
    groups.push(tiles.slice(i * 3, i * 3 + 3)); // 3-tile groups
  }
  groups.push(tiles.slice(12)); // 2-tile group
  return groups;
}

// Fetch leaderboard data
async function fetchLeaderboard() {
  try {
    const response = await axios.get("http://localhost:3000/leaderboard");
    const leaderboard = response.data.leaderboard;

    const list = document.getElementById("leaderboard-list");
    list.innerHTML = ""; // Clear the list

    leaderboard.forEach((entry) => {
      const li = document.createElement("li");
      li.textContent = `${entry.playerName}: ${entry.score}`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    alert("Failed to load leaderboard. Please try again.");
  }
}

// Submit score to the server
async function submitScore(playerName, score) {
  try {
    const response = await axios.post("http://localhost:3000/submit-score", {
      playerName,
      score,
    });

    if (response.data.message) {
      alert("Score submitted successfully!"); // Notify user
      await fetchLeaderboard(); // Refresh the leaderboard
    }
  } catch (error) {
    console.error("Error submitting score:", error);
    alert("Failed to submit score. Please try again.");
  }
}

// Handle score submission
document.getElementById("submit-score-btn").addEventListener("click", () => {
  const playerName = document.getElementById("player-name").value.trim();
  const groups = getGroups(playerTiles); // Divide tiles into groups
  const result = calculateScore(groups); // Calculate the final score
  const score = result.totalScore;

  if (!playerName) {
    alert("Please enter your name!");
    return;
  }

  submitScore(playerName, score); // Submit the score
  document.getElementById("player-name").value = ""; // Clear input
});

// Toggle leaderboard visibility
document.getElementById("leaderboard-btn").addEventListener("click", async () => {
  const leaderboard = document.getElementById("leaderboard");
  if (leaderboard.style.display === "none" || leaderboard.style.display === "") {
    leaderboard.style.display = "block"; // Show leaderboard
    await fetchLeaderboard(); // Fetch and display leaderboard data
  } else {
    leaderboard.style.display = "none"; // Hide leaderboard
  }
});

// End the game and calculate the score
function endGame() {
  const groups = getGroups(playerTiles); // Divide tiles into groups
  const result = calculateScore(groups); // Calculate the score

  // Create the message
  let message = `Score: ${result.totalScore} (${result.shunziCount} Shunzi, ${result.keziCount} Kezi, ${result.duiziCount} Duizi).`;
  if (result.isHu) {
    message += " Congratulations, you have reached Hu! (Winning Pattern)";
  }

  // Display the message in the score area
  const scoreMessageElement = document.getElementById("score-message");
  scoreMessageElement.textContent = message;
  scoreMessageElement.style.display = "block"; // Ensure it is visible

  // Show a pop-up with the final score
  alert(message);

  // End the game
  gameActive = false;
}


// Initialize player tiles and start the game
document.getElementById("play-btn").addEventListener("click", () => {
  console.log("Start Game clicked"); // Debug log
  playerTiles = getRandomTiles(14); // Generate 14 random tiles
  timeLeft = 180; // Reset timer to 180 seconds
  gameActive = true; // Activate the game

  renderBoard(); // Render the game board
  startTimer(); // Start the timer
  console.log("Game initialized"); // Debug log
});







