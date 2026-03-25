import express from "express";

const app = express();
app.use(express.json());
app.use(express.static("."));

// Use the environment variable set in Render
const API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Stedje AI, a helpful math teacher." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Use Render’s dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Stedje AI backend running on port ${PORT}`));
