import Groq from "groq-sdk";

import { MODEL_API_KEY } from "./configs/index.js";

const groq = new Groq({ apiKey: MODEL_API_KEY });

export default groq;
