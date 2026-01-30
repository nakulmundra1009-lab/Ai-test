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

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://aiveno-ai.netlify.app", // required
          "X-Title": "Aiveno AI" // required
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct:free",
          messages,
          temperature: 0.7,
          max_tokens: 600
        })
      }
    );

    const text = await response.text();
    console.log("OpenRouter raw response:", text);

    const data = JSON.parse(text);

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
        { message: { content: "Server error: " + err.message } }
      ]
    });
  }
});

// Render-safe port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Aiveno AI backend running on port ${PORT}`);
});
