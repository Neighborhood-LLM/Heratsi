import { GoogleGenerativeAI } from "@google/generative-ai";

let client = null;
export const getGemini = () => {
  if (!client) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY not configured");
    client = new GoogleGenerativeAI(key);
  }
  return client;
};

// Splits a "data:image/jpeg;base64,AAAA..." string (or a raw base64 string)
// into the { mimeType, data } shape Gemini's inlineData wants.
export const dataUrlToInlinePart = (dataUrlOrBase64, fallbackMime = "image/jpeg") => {
  const match = /^data:([^;]+);base64,(.*)$/s.exec(dataUrlOrBase64);
  if (match) {
    return { inlineData: { mimeType: match[1], data: match[2] } };
  }
  return { inlineData: { mimeType: fallbackMime, data: dataUrlOrBase64 } };
};
