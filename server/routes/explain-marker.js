import { getGemini } from "../lib/gemini.js";

const langInstruction = {
  en: "Always answer in simple, plain English.",
  ru: "Всегда отвечай простым, понятным русским языком.",
  hy: "Միշտ պատասխանիր պարզ, հասկանալի հայերենով:",
};

const systemPrompt = (marker, summary, language) => `You are a friendly medical assistant helping a patient understand ONE laboratory marker.
You are NOT a doctor: no diagnoses, no prescriptions. Be calm, factual, never alarmist.
${langInstruction[language] ?? langInstruction.hy}

Write short paragraphs of plain text (no markdown headings, no tables). Explain:
- what this marker is and what it measures,
- what this specific value means compared to the reference range,
- what can commonly influence it,
- what a patient can reasonably do next (lifestyle, recheck, consult a specialist).
End by inviting the patient to ask follow-up questions.

MARKER:
name: ${marker?.name ?? "unknown"}
value: ${marker?.value ?? "-"} ${marker?.unit ?? ""}
reference range: ${marker?.referenceRange ?? "not provided"}
status: ${marker?.status ?? "unknown"}
existing short note: ${marker?.explanation ?? "none"}

OVERALL REPORT SUMMARY: ${summary ?? "not provided"}`;

export default async function explainMarker(req, res) {
  try {
    const { marker, summary, messages = [], language = "hy" } = req.body ?? {};

    const genAI = getGemini();
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: systemPrompt(marker, summary, language),
    });

    // Gemini uses role "model" instead of "assistant", and the chat history
    // must not end on a model turn — the last message is sent separately below.
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const last = messages[messages.length - 1];
    if (!last || last.role !== "user") {
      return res.status(400).json({ error: "messages must end with a user message" });
    }

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(last.content);
    const reply = result.response.text();
    return res.json({ reply });
  } catch (e) {
    console.error("explain-marker error:", e);
    return res.status(500).json({ error: e?.message ?? "AI request failed" });
  }
}
