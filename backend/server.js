const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "API running clean" });
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "API running clean" });
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
