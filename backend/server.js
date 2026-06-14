// server.js — Main Express entry point
require("dotenv").config();
console.log("GROQ:", process.env.GROQ_API_KEY);
console.log("MONGO:", process.env.MONGO_URI);
const express   = require("express");
const cors      = require("cors");
const mongoose  = require("mongoose");

const authRoutes      = require("./routes/auth");
const chatRoutes      = require("./routes/chat");
const quizRoutes      = require("./routes/quiz");
const flashcardRoutes = require("./routes/flashcard");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Routes
app.use("/api/auth",      authRoutes);
app.use("/api/chat",      chatRoutes);
app.use("/api/quiz",      quizRoutes);
app.use("/api/flashcard", flashcardRoutes);

// Health check
app.get("/", (req, res) => res.json({ message: "LearnAI API running 🚀 (Groq powered)" }));

// Connect MongoDB & start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
