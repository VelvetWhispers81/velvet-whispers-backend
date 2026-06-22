const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
