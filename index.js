import "dotenv/config";

import { promptTemplate } from "./promptTemplate.js";

const apiKey = process.env.SEGMIND_API_KEY;
const URL = "https://api.segmind.com/v1/deepseek-chat";

const data = {
  messages: [
    {
      role: "system",
      content: promptTemplate,
    },
    {
      role: "user",
      content: "hi vợ!",
    },
  ],
};

(async function () {
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();

    console.log(json);
    console.log(json.choices[0].message);
  } catch (error) {
    console.error("Error:", error);
  }
})();
