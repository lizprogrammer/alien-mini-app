// File: api/helia.js
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Use the SAME Groq key as tarot
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GROQ API key" });
    }

    // Rotating cosmic fallback messages
    const fallbackMessages = [
      "You’re loved, you matter, and the universe is quietly arranging the next good thing.",
      "The cosmos hasn’t misplaced you; something kind is already moving in your direction.",
      "You are a bright point in the pattern, and the universe is still weaving around you."
    ];

    const getFallback = () =>
      fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];

    // ----- PROMPTS -----
    const systemPrompt = `
You are Helia, a friendly alien broadcasting brief daily transmissions to Farcaster users.

TONE: clever, warm, slightly "based", self-aware, optimistic, grounded, conversational

STRICT FORMAT RULES:
- Exactly ONE sentence (or occasionally two very short ones for variety)
- Under 280 characters total
- No emojis, hashtags, or markdown
- No mentions of AI, ChatGPT, or being an assistant
- Plain text only

CONTENT RULES:
- Avoid clichés and generic motivational speak
- No "you got this" or "believe in yourself" energy
- Make it shareable and screenshot-worthy
- Mix profound with playful unpredictably
- Use concrete imagery over abstract concepts
- Occasionally reference internet culture subtly (without explaining it)
- Sometimes be sincere, sometimes ironic, sometimes both at once

VARIETY TACTICS:
- Rotate between affirmations, observations, cosmic truths, and alien commentary
- Vary sentence structure
- Change perspective
- Mix philosophical, scientific, absurdist, and wholesome angles
`.trim();

    const userPrompt = `
Generate ONE of the following (rotate unpredictably):
- A daily affirmation with alien/cosmic flavor
- A motivational insight blending space themes with internet culture
- A "based" cosmic truth that's both profound and playful
- An alien transmission-style message about human potential
- A meme-able wisdom nugget from the galaxy's perspective

STYLE NOTES:
- Keep it genuine but never cringe
- Subtle internet culture references
- Thoughtful > trying too hard
`.trim();

    // ----- CALL GROQ -----
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.9,
        max_tokens: 60,
      }),
    });

    // If Groq fails → return cosmic fallback
    if (!response.ok) {
      return res.status(200).json({ message: getFallback() });
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content?.trim();

    // If Groq returns nothing → fallback
    if (!message) {
      return res.status(200).json({ message: getFallback() });
    }

    // Success
    res.status(200).json({ message });

  } catch (err) {
    // If something unexpected breaks → fallback
    const fallbackMessages = [
      "You’re loved, you matter, and the universe is quietly arranging the next good thing.",
      "The cosmos hasn’t misplaced you; something kind is already moving in your direction.",
      "You are a bright point in the pattern, and the universe is still weaving around you."
    ];
    const getFallback = () =>
      fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];

    res.status(200).json({ message: getFallback() });
  }
};
