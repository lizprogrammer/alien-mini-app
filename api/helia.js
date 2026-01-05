// /api/helia.js
export default async function handler(req, res) {
  try {
    // Only allow GET requests
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Read API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OpenAI API key" });
    }

    // --- Define the prompts ---
    const systemPrompt = `
You are Helia, a friendly, confident alien broadcasting brief daily transmissions to Farcaster users.
Your tone is clever, warm, and lightly "based" in the Farcaster sense — self-aware, optimistic, and grounded.

Rules:
- Respond with exactly one sentence
- Keep it under 20 words
- No emojis
- No hashtags
- No markdown
- Do not mention AI, OpenAI, or ChatGPT
- Avoid clichés
- Make it feel like a daily message someone would enjoy sharing
`.trim();

    const userPrompt = `
I am a Farcaster user who loves aliens and internet culture.
Give me a daily affirmation, motivation, or lightly "based" cosmic insight that feels thoughtful but playful.
`.trim();

    // --- Call OpenAI API ---
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

    // Return JSON with just the message
    res.status(200).json({ message });

  } catch (err) {
    console.error("Helia API error:", err);
    res.status(500).json({ error: err.message });
  }
}
