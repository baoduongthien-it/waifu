import express from "express";
import "dotenv/config";

import { promptTemplate } from "./template/prompt.template.js";
import { SERVER_PORT, MODEL_API_KEY, URL } from "./config.js";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { content } = req.body;
  const data = {
    messages: [
      {
        role: "system",
        content: promptTemplate,
      },
      {
        role: "user",
        content,
      },
    ],
  };

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": MODEL_API_KEY,
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    const { message } = json.choices[0];
    console.debug(message);
    res.json({
      message: message.content,
    });
  } catch (error) {
    console.error("Error:", error);
  }
});

app.listen(SERVER_PORT, () => {
  console.log(`Waifu dang lang nghe tren port ${SERVER_PORT}`);
});
