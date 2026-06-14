// utils/groq.js — Reusable Groq AI helper
// Groq is FREE and uses Llama 3 model (super fast!)
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Call Groq AI (Llama 3)
 * @param {string} systemPrompt - Tells AI how to behave
 * @param {string} userMessage  - The user's question
 * @param {number} maxTokens    - Max response length (default 1024)
 */
const askGroq = async (systemPrompt, userMessage, maxTokens = 1024) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",   // FREE Llama 3 model on Groq
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userMessage  },
    ],
  });
  return response.choices[0].message.content;
};

module.exports = { askGroq };
