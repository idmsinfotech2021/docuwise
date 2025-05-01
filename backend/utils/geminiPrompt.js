const { callGeminiAPI } = require('./geminiService');

// Build prompt by combining previous confirmed answers and current input
function buildPromptWithContext(session, currentSection, questionText, userInput) {
  const previousSections = session.answers
    .filter(a => a.confirmed && a.sectionName !== currentSection)
    .map(a => `Section: ${a.sectionName}\nContent: ${a.finalContent}`)
    .join('\n\n');

  const prompt = `
${previousSections}

Now generate a professional response for section "${currentSection}" based on this:

Q: ${questionText}  
User Input: ${userInput}
`;

  return prompt.trim();
}

module.exports = { buildPromptWithContext, callGeminiAPI };
