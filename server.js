//DB - 0 - install and load lowdb module
import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const app = express();

//DB - 1 - connect to the DB
const defaultData = { gameScores: [] };
const adapter = new JSONFile("db.json");
const db = new Low(adapter, defaultData);

//to parse JSON
app.use(express.json());

app.post("/submit-score", async (req, res) => {
  const { score } = req.body;

  // 将分数记录添加到数据库
  if (!db.data.gameScores) {
    db.data.gameScores = []; // Initialize the gameScores array if it doesn't exist
  }
  
  db.data.gameScores.push({
    score,
    timeStamp: new Date().toISOString(), // Automatically record timestamp
  });
  
  await db.write(); // Write to the database
  
  res.json({ message: "Score submitted successfully" });
});

// 路由 - 获取所有分数记录
app.get("/get-scores", async (req, res) => {
  await db.read(); // 读取数据库内容
  res.json({ scores: db.data.gameScores });
});

app.use("/", express.static("public"));
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("listening at localhost:3000");
});



