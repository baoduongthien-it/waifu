import express from "express";

import { SERVER_PORT } from "./configs/index.js";

const app = express();

app.use(express.json());

app.listen(SERVER_PORT, () => {
  console.log(`Waifu dang lang nghe tren port ${SERVER_PORT}`);
});

export default app;
