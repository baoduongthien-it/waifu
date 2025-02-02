import { readFile, writeFile } from "node:fs/promises";
import "dotenv/config";

import app from "./src/server.js";
import groq from "./src/groq.js";

import { TELEGRAM_URL } from "./src/configs/index.js";
import { modelConfig } from "./src/configs/model.config.js";
import { systemMessage } from "./src/template/prompt.template.js";

const chatHistoriesDB = JSON.parse(
  await readFile(new URL("./src/db/db.json", import.meta.url))
);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.post("/", async (req, res) => {
  const chatId = req.body.message.chat.id;
  let output = "";

  try {
    // console.log(chatHistoriesDB);

    const userMessage = {
      role: "user",
      content: req.body.message.text,
    };
    // Thêm vào chatHistoriesDB
    chatHistoriesDB.push(userMessage);
    writeFile("./src/db/db.json", JSON.stringify(chatHistoriesDB));

    const messages = [systemMessage, ...chatHistoriesDB];

    const chatCompletion = await groq.chat.completions.create({
      ...modelConfig,
      messages,
    });

    output = chatCompletion.choices[0]?.message?.content || "";
    const assistantMessage = {
      role: "assistant",
      content: output,
    };
    // Thêm vào chatHistoriesDB
    chatHistoriesDB.push(assistantMessage);
    writeFile("./src/db/db.json", JSON.stringify(chatHistoriesDB));
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
