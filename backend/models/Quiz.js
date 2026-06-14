// models/Quiz.js
const mongoose = require("mongoose");
const quizSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  topic:     { type: String, required: true },
  questions: [{
    question:    String,
    options:     [String],
    answer:      Number,
    explanation: String,
  }],
  score:     { type: Number, default: null },
  completed: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model("Quiz", quizSchema);
