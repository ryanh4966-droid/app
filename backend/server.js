const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("../db/app.db");

// =======================
// DATABASE INIT
// =======================
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    plan TEXT DEFAULT 'free'
  )`);
});

// =======================
// AUTH HELPERS
// =======================
function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, "secretkey");
}

// =======================
// REGISTER
// =======================
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hash],
    function (err) {
      if (err) return res.status(400).json({ error: "User exists" });

      res.json({ status: "registered" });
    }
  );
});

// =======================
// LOGIN
// =======================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email=?", [email], async (err, user) => {
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Wrong password" });

    const token = createToken(user);

    res.json({
      token,
      plan: user.plan,
      email: user.email
    });
  });
});

// =======================
// PROTECTED ROUTE
// =======================
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// =======================
// PREMIUM ROUTE
// =======================
app.get("/premium", auth, (req, res) => {
  db.get(
    "SELECT plan FROM users WHERE id=?",
    [req.user.id],
    (err, user) => {
      if (!user || user.plan !== "pro") {
        return res.status(403).json({ error: "Upgrade required" });
      }

      res.json({ secret: "🔥 PRO CONTENT UNLOCKED" });
    }
  );
});

// =======================
// SERVER START
// =======================
app.listen(3000, () => {
  console.log("🚀 Production API running on port 3000");
});
