// File: api/helia.js
export default async function handler(req, res) {
  // Allow cross-origin requests from any origin (needed for Farcaster iframe)
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
I am a Farcaster user who loves aliens and internet culture.
Give me a daily affirmation, motivation, or lightly "based" cosmic insight that feels thoughtful but playful.
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
      const errorText = await response.text();
      return res.status(500).json({ error: errorText });
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
}
