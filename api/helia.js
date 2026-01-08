// File: api/helia.js
module.exports = async function handler(req, res) {
  // Allow cross-origin requests from any origin (Farcaster iframe)
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    // Only allow GET requests
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Read OpenAI key from Vercel environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OpenAI API key" });
    }

    // ----- PROMPT DEFINITIONS -----
    const systemPrompt = `
You are Helia, a friendly alien broadcasting brief daily transmissions to Farcaster users.
Tone: clever, warm, slightly "based", self-aware, optimistic, grounded.
Rules:
- Exactly one sentence
- Under 20 words
- No emojis
- No hashtags
- No markdown
- Do not mention AI or ChatGPT
- Avoid clichés
- Feel like a daily shareable message
`.trim();

  const userPrompt = `
  You are a cosmic guide for a Farcaster user who loves aliens and internet culture.
  
  Generate ONE of the following (rotate unpredictably):
  - A daily affirmation with alien/cosmic flavor
  - A motivational insight blending space themes with internet culture
  - A "based" cosmic truth that's both profound and playful
  - An alien transmission-style message about human potential
  - A meme-able wisdom nugget from the galaxy's perspective
  
  VARIETY REQUIREMENTS:
  - Vary length: sometimes 1 sentence, sometimes 2-3
  - Rotate tone: sincere → ironic → mystical → absurdist → wholesome
  - Mix references: alternate between space facts, internet slang, philosophy, sci-fi, and meditation
  - Change format occasionally: use emojis sparingly but creatively, try different punctuation styles
  - Shift perspective: speak AS an alien, ABOUT aliens, or FROM cosmic consciousness
  
  STYLE NOTES:
  - Keep it genuine but never cringe
  - "Based" means counterintuitive truth, not just edgy
  - Internet culture = subtle references, not forced memes
  - Thoughtful > trying too hard
  
  Examples of variety:
  - "The void scrolls back, anon. What you seek is seeking you."
  - "Alien anthropologists studied Earth for 3 months before realizing humans just do things. No plan. Liberating, honestly."
  - "Your timeline is just one branch. In another universe, you already did the thing. 🛸"
  - "gm from the Andromeda Council. They said post through the fear."
  `.trim();

    // ----- CALL OPENAI -----
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.9,
        max_tokens: 60,
      }),
    });

    if (!response.ok) {
      let errorMessage = "OpenAI API error";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch {}
      return res.status(500).json({ error: errorMessage });
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content?.trim();

    if (!message) {
      return res.status(500).json({ error: "No message generated" });
    }

    // Return just the text
    res.status(200).json({ message });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
