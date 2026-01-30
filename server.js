import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Aiveno AI backend (OpenRouter) is running ✅");
});

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.json({
        choices: [
          { message: { content: "Server misconfiguration: API key missing." } }
        ]
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://aiveno-ai.netlify.app",
          "X-Title": "Aiveno AI"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct:free",
          messages,
          temperature: 0.7,
          max_tokens: 600
        })
      }
    );

    const raw = await response.text();
    console.log("OpenRouter RAW:", raw);

    const data = JSON.parse(raw);

    if (data.error) {
      return res.json({
        choices: [
          { message: { content: "AI error: " + data.error.message } }
        ]
      });
    }

    res.json(data);

  } catch (err) {
    console.error("Backend error:", err);
    res.json({
      choices: [
        { message: { content: "Backend error: " + err.message } }
      ]
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Aiveno AI backend running on port ${PORT}`);
});
