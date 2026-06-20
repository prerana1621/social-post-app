const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authMiddleware = require("./middleware/authMiddleware");
const postRoutes = require("./routes/postRoutes");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
