// Game state variables
let playerTiles = [];
let timeLeft = 180; // Timer duration in seconds
let gameActive = false;

// Generate all Mahjong tiles
function generateAllTiles() {
  return [
    { name: "1万", points: 1, type: "character", translation: "1 character", image: "mj/1-character.png" },
    { name: "2万", points: 2, type: "character", translation: "2 characters", image: "mj/2-character.png" },
    { name: "3万", points: 3, type: "character", translation: "3 characters", image: "mj/3-character.png" },
    { name: "4万", points: 4, type: "character", translation: "4 characters", image: "mj/4-character.png" },
    { name: "5万", points: 5, type: "character", translation: "5 characters", image: "mj/5-character.png" },
    { name: "6万", points: 6, type: "character", translation: "6 characters", image: "mj/6-character.png" },
    { name: "7万", points: 7, type: "character", translation: "7 characters", image: "mj/7-character.png" },
    { name: "8万", points: 8, type: "character", translation: "8 characters", image: "mj/8-character.png" },
    { name: "9万", points: 9, type: "character", translation: "9 characters", image: "mj/9-character.png" },
    { name: "1筒", points: 1, type: "dot", translation: "1 dot", image: "mj/1-dot.png" },
    { name: "2筒", points: 2, type: "dot", translation: "2 dots", image: "mj/2-dot.png" },
    { name: "3筒", points: 3, type: "dot", translation: "3 dots", image: "mj/3-dot.png" },
    { name: "4筒", points: 4, type: "dot", translation: "4 dots", image: "mj/4-dot.png" },
    { name: "5筒", points: 5, type: "dot", translation: "5 dots", image: "mj/5-dot.png" },
    { name: "6筒", points: 6, type: "dot", translation: "6 dots", image: "mj/6-dot.png" },
    { name: "7筒", points: 7, type: "dot", translation: "7 dots", image: "mj/7-dot.png" },
    { name: "8筒", points: 8, type: "dot", translation: "8 dots", image: "mj/8-dot.png" },
    { name: "9筒", points: 9, type: "dot", translation: "9 dots", image: "mj/9-dot.png" },
    { name: "1条", points: 1, type: "bamboo", translation: "1 bamboo", image: "mj/1-bamboo.png" },
    { name: "2条", points: 2, type: "bamboo", translation: "2 bamboos", image: "mj/2-bamboo.png" },
    { name: "3条", points: 3, type: "bamboo", translation: "3 bamboos", image: "mj/3-bamboo.png" },
    { name: "4条", points: 4, type: "bamboo", translation: "4 bamboos", image: "mj/4-bamboo.png" },
    { name: "5条", points: 5, type: "bamboo", translation: "5 bamboos", image: "mj/5-bamboo.png" },
    { name: "6条", points: 6, type: "bamboo", translation: "6 bamboos", image: "mj/6-bamboo.png" },
    { name: "7条", points: 7, type: "bamboo", translation: "7 bamboos", image: "mj/7-bamboo.png" },
    { name: "8条", points: 8, type: "bamboo", translation: "8 bamboos", image: "mj/8-bamboo.png" },
    { name: "9条", points: 9, type: "bamboo", translation: "9 bamboos", image: "mj/9-bamboo.png" },
  ];
}

// Generate random tiles for the player
function getRandomTiles(count) {
  const tiles = generateAllTiles(); // Retrieve the full set of tiles
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles.slice(0, count);
}

// Update the score message dynamically
function updateScoreMessage(result) {
  const scoreMessage = document.getElementById("score-message");
  scoreMessage.textContent = `Score: ${result.totalScore} (${result.shunziCount} Shunzi, ${result.keziCount} Kezi, ${result.duiziCount} Duizi).`;
  if (result.isHu) {
    scoreMessage.textContent += " Congratulations, you achieved Hu!";
  }
  scoreMessage.style.display = "block";
}

// Render the game board
function renderBoard() {
  const gameBoard = document.getElementById("game-board");
  const scoreCounter = document.getElementById("score-counter");
  gameBoard.innerHTML = ""; // Clear the game board

  const groups = getGroups(playerTiles);

  groups.forEach((group) => {
    const groupDiv = document.createElement("div");
    groupDiv.classList.add("tile-group");

    group.forEach((tile) => {
      const tileDiv = document.createElement("div");
      tileDiv.classList.add("tile");

      // Add image and translation
      tileDiv.innerHTML = `
        <img src="${tile.image}" alt="${tile.translation}">
        <span>${tile.translation}</span>
      `;

      // Add click event
      tileDiv.addEventListener("click", () => {
        if (gameActive) {
          const tileIndex = playerTiles.indexOf(tile);
          playerTiles[tileIndex] = getRandomTiles(1)[0];
          renderBoard(); // Re-render the board
        }
      });

      groupDiv.appendChild(tileDiv);
    });

    gameBoard.appendChild(groupDiv);
  });

  // Calculate score
  const result = calculateScore(groups);
  scoreCounter.textContent = `Score: ${result.totalScore}`;
  updateScoreMessage(result);
}

// Timer logic
function startTimer() {
  const timerElement = document.getElementById("timer");
  const interval = setInterval(() => {
    if (!gameActive || timeLeft <= 0) {
      clearInterval(interval);
      if (timeLeft <= 0) endGame();
      return;
    }
    timeLeft--;
    timerElement.textContent = `Time Left: ${timeLeft}`;
  }, 1000);
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

async function submitScore(playerName, score) {
  try {
    const response = await axios.post("http://localhost:3000/submit-score", {
      playerName, // Ensure playerName is included
      score,
    });

    if (response.data.message) {
      alert("Score submitted successfully!");
    }
  } catch (error) {
    console.error("Error submitting score:", error);
    alert("Failed to submit score. Please try again.");
  }
}


// Fetch leaderboard data
function fetchLeaderboard() {
  fetch('http://localhost:3000/get-scores')
    .then(response => response.json())
    .then(data => {
      const leaderboardDiv = document.getElementById('leaderboard');
      leaderboardDiv.innerHTML = '';

      const scoresList = document.createElement('ul');
      data.scores.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. Score: ${entry.score}, Time: ${entry.timeStamp}`;
        scoresList.appendChild(listItem);
      });

      leaderboardDiv.appendChild(scoresList);
    });
}

// Handle score submission
document.getElementById("submit-score-btn").addEventListener("click", () => {
  const playerName = document.getElementById("player-name").value.trim();


  if (!playerName) {
    alert("Please enter your name!");
    return;
  }
      // calculating score
      const groups = [];
      for (let i = 0; i < 5; i++) {
        const groupSize = i < 4 ? 3 : 2; 
        groups.push(playerTiles.slice(i * 3, i * 3 + groupSize));
      }

      // get score
      const { totalScore } = calculateScore(groups);

      // submit score
      submitScore(totalScore); // Submit the score
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
function updateScoreMessage(result) {
  const scoreMessage = document.getElementById("score-message");
  scoreMessage.textContent = `Score: ${result.totalScore} (${result.shunziCount} Shunzi, ${result.keziCount} Kezi, ${result.duiziCount} Duizi).`;
  if (result.isHu) {
      scoreMessage.textContent += " Congratulations, you achieved Hu!";
  }
  scoreMessage.style.display = "block";
}

// Example integration at the end of the game:
function endGame() {
  const groups = getGroups(playerTiles); // Divide player's tiles into groups
  const result = calculateScore(groups); // Calculate score
  updateScoreMessage(result); // Update score message
}


// Initialize player tiles and start the game
document.getElementById("play-btn").addEventListener("click", () => {
  console.log("Start Game clicked"); // Debug log
  playerTiles = getRandomTiles(14); // Generate 14 random tiles
  timeLeft = 180; // Reset timer to 180 seconds
  gameActive = true; // Activate the game

  renderBoard(); //  the game board
  startTimer(); // Start the timer
  console.log("Game initialized"); // Debug log
});







