// /utils/geminiService.js
const axios = require('axios');

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

/**
 * Generates AI content for proposal section based on prompt
 * @param {String} promptText Prompt with full context and current question
 * @returns {String} AI-generated section content
 */
const callGeminiAPI = async (promptText) => {
  console.log("222222222222222222222222222")
  try {
//      promptText = `
// Based on the following Q&A, generate a brief paragraph for a proposal section.

// Questions and Answers:
// 1. What is the primary goal of the project?
// A: To automate and streamline business operations.

// 2. Who are the key stakeholders?
// A: Client IT Head, Delivery Manager, Business Sponsor.

// Return only the generated paragraph as plain text. Do not include "Answer:", no bullet points, no markdown, and no code formatting.
// Just return a single paragraph response.
// `;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: promptText
            }
          ]
        }
      ]
    };

    const response = await axios.post(GEMINI_URL, payload);
    //console.log("333333333333333 response ", response)
    let resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!resultText) throw new Error('No content returned from Gemini');

    // Cleanup: remove any markdown or formatting wrappers
    return resultText
      .replace(/```(?:json)?/g, '')
      .replace(/^\s*`+/, '')
      .replace(/`+$/, '')
      .trim();

  } catch (err) {
    console.error('❌ Gemini API Error:', err.response?.data || err.message);
    return '⚠️ Failed to generate content. Please try again later.';
  }
};

module.exports = { callGeminiAPI };
