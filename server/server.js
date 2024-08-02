require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/recipeStream", (req, res) => {
  const ingredients = req.query.ingredients;
  const mealType = req.query.mealType;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (chunk) => {
    let chunkResponse;
    if (chunk.choices[0].finish_reason === "stop") {
      res.write(`data: ${JSON.stringify({ action: "close" })}\n\n`);
    } else {
      if (
        chunk.choices[0].delta.role &&
        chunk.choices[0].delta.role === "assistant"
      ) {
        chunkResponse = {
          action: "start",
        };
      } else {
        chunkResponse = {
          action: "chunk",
          chunk: chunk.choices[0].delta.content,
        };
      }
      res.write(`data: ${JSON.stringify(chunkResponse)}\n\n`);
    }
  };

  const prompt = [];
  prompt.push("Generate a recipe that incorporates the following details:");
  prompt.push(`[Ingredients: ${ingredients}]`);
  prompt.push(`[Meal Type: ${mealType}]`);

  prompt.push(
    "Please provide a detailed recipe, including steps for preparation and cooking. Only use the ingredients."
  );
  prompt.push(
    "The recipe should highlight the fresh and vibrant nature of the ingredients."
  );
  prompt.push(
    "Format the ingredient list so that each subsequent step and ingredient appears on a new line, paragraph, and keep the text to 2,300 words or less."
  );

  const messages = [
    {
      role: "system",
      content: prompt.join(" "),
    },
  ];

  fetchOpenAICompletionsStream(messages, sendEvent);
  req.on("close", () => {
    res.end();
  });
});

async function fetchOpenAICompletionsStream(messages, callback) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const aiModel = "gpt-4o";

  try {
    const completion = await openai.chat.completions.create({
      model: aiModel,
      messages: messages,
      stream: true,
    });
    for await (const chunk of completion) {
      callback(chunk);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
