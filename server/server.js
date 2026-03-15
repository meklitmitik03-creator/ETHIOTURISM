const express = require("express");
const cors = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ethioturism AI server running");
});

app.post("/ask", async (req, res) => {

  const question = req.body.question;

  try {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },

      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant. Answer any question clearly. If the question is about Ethiopia tourism, give detailed helpful answers."
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

    res.json({
      answer: "Server error. Please try again."
    });

  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});