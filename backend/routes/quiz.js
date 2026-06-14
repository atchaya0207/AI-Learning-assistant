// routes/quiz.js — Quiz Generator using FREE Groq API
const express     = require("express");
const { protect } = require("../middleware/auth");
const { askGroq } = require("../utils/groq");
const Quiz        = require("../models/Quiz");
const router      = express.Router();

// POST /api/quiz/generate
router.post("/generate", protect, async (req, res) => {
  try {
    const { topic, numQuestions = 5 } = req.body;

    const prompt = `Generate a ${numQuestions}-question multiple choice quiz about: "${topic}"
Return ONLY a JSON array, no extra text, no markdown, no backticks.
Format:
[{"question":"...","options":["A","B","C","D"],"answer":0,"explanation":"..."}]
"answer" is the 0-based index of the correct option.`;

    const raw       = await askGroq("You are a quiz generator. Return only valid JSON.", prompt, 2048);
    const jsonStart = raw.indexOf("[");
    const jsonEnd   = raw.lastIndexOf("]") + 1;
    const questions = JSON.parse(raw.slice(jsonStart, jsonEnd));

    const quiz = await Quiz.create({ userId: req.user._id, topic, questions });
    res.status(201).json({ quizId: quiz._id, topic, questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/quiz/submit
router.post("/submit", protect, async (req, res) => {
  try {
    const { quizId, userAnswers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    let correct = 0;
    const results = quiz.questions.map((q, i) => {
      const isCorrect = userAnswers[i] === q.answer;
      if (isCorrect) correct++;
      return { isCorrect, correctAnswer: q.answer, explanation: q.explanation };
    });

    quiz.score     = Math.round((correct / quiz.questions.length) * 100);
    quiz.completed = true;
    await quiz.save();

    res.json({ score: quiz.score, correct, total: quiz.questions.length, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/quiz
router.get("/", protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user._id })
      .sort({ createdAt: -1 }).select("topic score completed createdAt");
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
