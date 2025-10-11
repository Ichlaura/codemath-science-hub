const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ 
    message: "CodeMath Science Hub API is working!",
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    environment: process.env.NODE_ENV || "development"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
  console.log("📚 Visit: http://localhost:" + PORT);
});
