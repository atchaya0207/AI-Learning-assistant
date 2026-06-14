// routes/flashcard.js — Flashcard Generator using FREE Groq API
const express     = require("express");
const { protect } = require("../middleware/auth");
const { askGroq } = require("../utils/groq");
const Flashcard   = require("../models/Flashcard");
const router      = express.Router();

// POST /api/flashcard/generate
router.post("/generate", protect, async (req, res) => {
  try {
    const { topic, numCards = 8 } = req.body;

    const prompt = `Create ${numCards} flashcards for learning: "${topic}"
Return ONLY a JSON array, no markdown, no backticks, no extra text.
Format: [{"term":"...","definition":"..."}]`;

    const raw       = await askGroq("You are a flashcard generator. Return only valid JSON.", prompt);
    const jsonStart = raw.indexOf("[");
    const jsonEnd   = raw.lastIndexOf("]") + 1;
    const cards     = JSON.parse(raw.slice(jsonStart, jsonEnd));

    const saved = await Flashcard.insertMany(
      cards.map((c) => ({ userId: req.user._id, topic, term: c.term, definition: c.definition }))
    );
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/flashcard
router.get("/", protect, async (req, res) => {
  try {
    const cards = await Flashcard.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/flashcard/:id — toggle mastered
router.patch("/:id", protect, async (req, res) => {
  try {
    const card = await Flashcard.findById(req.params.id);
    if (!card) return res.status(404).json({ error: "Card not found" });
    card.mastered = !card.mastered;
    await card.save();
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
