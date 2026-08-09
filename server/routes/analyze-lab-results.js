import { getGemini, dataUrlToInlinePart } from "../lib/gemini.js";

const langInstruction = {
  en: "Respond in English.",
  ru: "Отвечай на русском языке.",
  hy: "Պատասխանիր հայերեն.",
};

const responseSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    rows: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          value: { type: "string" },
          unit: { type: "string" },
          referenceRange: { type: "string" },
          status: { type: "string", enum: ["normal", "high", "low", "unknown"] },
          explanation: { type: "string" },
        },
        required: ["name", "value", "status"],
      },
    },
    insights: { type: "array", items: { type: "string" } },
    recommendation: { type: "string" },
    disclaimer: { type: "string" },
    recommendedPrograms: {
      type: "array",
      items: {
        type: "string",
        enum: ["edu-t1d", "edu-t2d", "insulin-calc", "weight-loss", "pregnancy-nutrition"],
      },
    },
  },
  required: ["summary", "rows", "insights", "recommendation", "disclaimer", "recommendedPrograms"],
};

const systemPrompt = (language) => `You are a medical assistant that helps patients understand their laboratory results.
You are NOT a doctor and you do NOT provide diagnoses or prescriptions.
${langInstruction[language] ?? langInstruction.en}

Analyze the provided lab report (which may span multiple pages/images) and return STRICT JSON with:
- summary: 1-2 sentence plain-language overview
- rows: list of detected markers, each with { name, value, unit, referenceRange, status: "normal"|"high"|"low"|"unknown", explanation }
- insights: 1-3 short, actionable observations a patient can understand
- recommendation: short suggestion (e.g., "consult a specialist", "recheck in X weeks")
- disclaimer: a brief reminder that this is informational only
- recommendedPrograms: array of IDs from the PROGRAMS CATALOG below that are most relevant (0-3 items, only if clearly relevant)

PROGRAMS CATALOG (Insula educational programs):
- edu-t1d: Education program for people with Type 1 Diabetes — for newly diagnosed or unmanaged T1D.
- edu-t2d: Education program for people with Type 2 Diabetes — for newly diagnosed or unmanaged T2D.
- insulin-calc: Insulin Dose Calculation course — for insulin-using patients struggling with dosing.
- weight-loss: Weight Loss & Metabolic Health program — for elevated lipids, glucose, or metabolic syndrome markers.
- pregnancy-nutrition: Nutrition During Pregnancy program — for pregnancy-related findings.

Only recommend items clearly justified by the lab findings. Return empty arrays if nothing fits.
Be cautious, factual, and never alarmist.`;

export default async function analyzeLabResults(req, res) {
  try {
    const { imageBase64, images, mimeType, text, language = "en" } = req.body ?? {};

    const allImages = [];
    if (imageBase64) allImages.push(imageBase64);
    if (Array.isArray(images)) allImages.push(...images);

    if (allImages.length === 0 && !text) {
      return res.status(400).json({ error: "Provide imageBase64, images, or text" });
    }

    const parts = [];
    if (text) parts.push({ text: `Lab report text:\n${text}` });
    for (const img of allImages) parts.push(dataUrlToInlinePart(img, mimeType ?? "image/jpeg"));
    if (allImages.length > 0) {
      parts.push({
        text:
          allImages.length > 1
            ? `Please analyze this lab report (${allImages.length} pages).`
            : "Please analyze this lab report image.",
      });
    }

    const genAI = getGemini();
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: systemPrompt(language),
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const result = await model.generateContent(parts);
    const raw = result.response.text();
    const analysis = JSON.parse(raw);
    return res.json({ analysis });
  } catch (e) {
    console.error("analyze-lab-results error:", e);
    const status = /GEMINI_API_KEY/.test(String(e?.message)) ? 500 : 500;
    return res.status(status).json({ error: e?.message ?? "AI analysis failed" });
  }
}
