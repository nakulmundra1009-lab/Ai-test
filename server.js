import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Aiveno AI backend is running ✅");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",   // fast & stable
          messages,
          temperature: 0.7,
          max_tokens: 600
        })
      }
    );

    const data = await response.json();
console.log("OPENAI RESPONSE:", data);


    // Always respond safely
    if (!data.choices || !data.choices[0]) {
      return res.json({
        choices: [
          { message: { content: "I’m having trouble responding right now." } }
        ]
      });
    }

    res.json(data);

  } catch (err) {
    console.error("Backend error:", err);
    res.json({
      choices: [
        { message: { content: "Server error. Please try again later." } }
      ]
    });
  }
});

// ✅ Render-safe port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Aiveno AI backend running on port ${PORT}`);
});
