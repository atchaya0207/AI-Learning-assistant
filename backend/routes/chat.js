// routes/chat.js — AI Tutor using FREE Groq API
const express     = require("express");
const { protect } = require("../middleware/auth");
const { askGroq } = require("../utils/groq");
const Chat        = require("../models/Chat");
const User        = require("../models/User");
const router      = express.Router();

// POST /api/chat/ask
router.post("/ask", protect, async (req, res) => {
  try {
    const { message, topic = "General" } = req.body;

    const systemPrompt = `You are an expert tutor specializing in:
- Coding: JavaScript, Python, React, Node.js, Express, MongoDB
- Language Learning: Spanish, French, and other languages
Give clear, beginner-friendly explanations with code examples when relevant.
Keep answers concise (under 200 words). Current topic: ${topic}`;

    // Call Groq (FREE Llama 3)
    const answer = await askGroq(systemPrompt, message);

    // Save to MongoDB
    let chat = await Chat.findOne({ userId: req.user._id, topic });
    if (!chat) chat = await Chat.create({ userId: req.user._id, topic, messages: [] });
    chat.messages.push({ role: "user",      content: message });
    chat.messages.push({ role: "assistant", content: answer  });
    await chat.save();

    await User.findByIdAndUpdate(req.user._id, { $inc: { "stats.questionsAsked": 1 } });

    res.json({ answer, chatId: chat._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chat
router.get("/", protect, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id }).sort({ updatedAt: -1 }).limit(20);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
