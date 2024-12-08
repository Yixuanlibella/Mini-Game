import express from "express";
import cors from "cors"; // Middleware for handling CORS
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const app = express();

// Initialize Lowdb with a JSON file
const adapter = new JSONFile("db.json");
const db = new Low(adapter);

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors());

// Initialize the database
(async () => {
  await db.read();
  db.data ||= { leaderboard: [] }; // Initialize the leaderboard if it doesn't exist
  await db.write();
})();

// Endpoint to get the leaderboard
app.get("/leaderboard", async (req, res) => {
  await db.read(); // Read data from the database
  res.json({ leaderboard: db.data.leaderboard });
});

// Endpoint to submit a score
app.post("/submit-score", async (req, res) => {
  const { playerName, score } = req.body;

  // Validate input data
  if (!playerName || typeof score !== "number") {
    return res.status(400).json({ error: "Invalid data. Player name and score are required." });
  }

  // Add the score to the leaderboard
  db.data.leaderboard.push({ playerName, score });
  db.data.leaderboard.sort((a, b) => b.score - a.score); // Sort leaderboard by descending scores
  await db.write(); // Save changes to the database

  res.json({ message: "Score submitted successfully" });
});

// Serve static files for the client (e.g., index.html, game.js, style.css)
app.use(express.static("public"));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:5501`);
});
