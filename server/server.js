const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

/* Basic route */
app.get("/", (req, res) => {
  res.send("Ethioturism AI server is running");
});

/* AI Question route */
app.post("/ask", async (req, res) => {
  const question = req.body.question;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful tourism assistant for Ethiopia. Answer questions about Ethiopian culture, animals, landscapes, and tourist places."
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      answer: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ answer: "Error getting AI response." });
  }
});

/* Render requires this port setup */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});