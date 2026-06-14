// models/Flashcard.js
const mongoose = require("mongoose");
const flashcardSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic:      { type: String, required: true },
  term:       { type: String, required: true },
  definition: { type: String, required: true },
  mastered:   { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model("Flashcard", flashcardSchema);
