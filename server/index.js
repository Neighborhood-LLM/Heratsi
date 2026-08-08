// Local backend replacing the Lovable Cloud edge functions.
// Talks directly to Google Gemini — no Lovable, no Supabase.
import "dotenv/config";
import express from "express";
import cors from "cors";
import analyzeLabResults from "./routes/analyze-lab-results.js";
import explainMarker from "./routes/explain-marker.js";
import bookings from "./routes/bookings.js";

const app = express();
const PORT = process.env.PORT || 8787;

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "\n⚠️  GEMINI_API_KEY is not set. Copy .env.example to .env and add your key " +
      "(https://aistudio.google.com/apikey) or the AI features will fail.\n",
  );
}

app.use(cors());
// Lab report images (esp. multi-page PDFs rendered to JPEGs) can be a few MB each.
app.use(express.json({ limit: "25mb" }));

app.post("/api/analyze-lab-results", analyzeLabResults);
app.post("/api/explain-marker", explainMarker);
app.post("/api/bookings", bookings);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Insula AI Lab backend running on http://localhost:${PORT}`);
});
