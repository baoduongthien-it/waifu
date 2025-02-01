import "dotenv/config";

import app from "./src/server.js";
import groq from "./src/groq.js";

import { TELEGRAM_URL } from "./src/configs/index.js";
import { promptTemplate } from "./src/template/prompt.template.js";
import { modelConfig } from "./src/configs/model.config.js";

app.post("/", async (req, res) => {
  const chatId = req.body.message.chat.id;
  let output = "hello chong";

  try {
    const { text } = req.body.message;
    console.debug("text input:", text);

    const chatCompletion = await groq.chat.completions.create({
      ...modelConfig,
      messages: [
        {
          role: "system",
          content: promptTemplate,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    output = chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Loi phia AI API:", error);
    return res.json({
      status: "error",
    });
  }

  try {
    const data = {
      chat_id: chatId,
      text: output,
    };
    console.debug("output data:", data);

    const response = await fetch(`${TELEGRAM_URL}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    res.json({
      status: "ok",
    });
  } catch (error) {
    console.error("Loi phia Telegram API:", error);
    return res.json({
      status: "error",
    });
  }
});

process.on("SIGINT", () => {
  console.log("Exiting...");
});
