// models/Chat.js
const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic:    { type: String, default: "General" },
  messages: [{
    role:    { type: String, enum: ["user","assistant"] },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });
module.exports = mongoose.model("Chat", chatSchema);
