# Heratsi by Yos and Melk

Upload a lab report (PDF/JPG/PNG), get an AI-assisted structured interpretation, and
chat with the AI about any marker via the "?" button. Multilingual (EN / RU / HY) with
an accessibility widget.

Runs **entirely locally** — no Supabase, no Lovable Cloud, no external accounts other
than a Google Gemini API key.

## Stack
- Frontend: React 18 + Vite + TypeScript + Tailwind + shadcn/ui + framer-motion + pdfjs-dist
- Backend: a small local Express server (`server/`) that calls the Google Gemini API directly

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and add your Gemini API key (free tier available at
https://aistudio.google.com/apikey):

```
GEMINI_API_KEY=your-key-here
```

## Run

```bash
npm run dev
```

This starts both the Vite dev server (http://localhost:8080) and the local API
backend (http://localhost:8787) together, with Vite proxying `/api/*` to the backend.
Open http://localhost:8080.

To run them separately:
```bash
npm run server   # backend only, http://localhost:8787
vite              # frontend only, http://localhost:8080
```

## Build for production

```bash
npm run build      # outputs static frontend to dist/
npm run server      # run the backend (serve dist/ yourself, or point VITE_API_URL at it)
```

If you deploy the frontend and backend on different hosts/ports, set `VITE_API_URL`
in `.env` before building, so the frontend calls the right backend URL.

## What changed from the original Lovable project

- The two Supabase Edge Functions (`analyze-lab-results`, `explain-marker`) are now
  plain Express routes in `server/routes/`, calling Gemini directly via
  `@google/generative-ai` instead of the Lovable AI Gateway.
- There is no Supabase project, no auth, and no database. The "Book consultation" flow
  no longer requires signing in — it's a simple form that posts to `POST /api/bookings`,
  which just logs the request server-side (swap in real persistence/notifications if
  you need them later).
- Telegram admin notifications were removed along with the Lovable connector they
  depended on.

## Entry points
- `src/pages/AILab.tsx` — page shell (logo, language switcher, footer)
- `src/components/AILabInterpretationSection.tsx` — hero/marketing + CTA
- `src/components/LabUploadModal.tsx` — upload, PDF→image, results, status filters, "?" buttons
- `src/components/MarkerChatModal.tsx` — AI chat per marker
- `src/components/BookingModal.tsx` — simple local booking form (no auth/DB)
- `server/index.js` — Express app; `server/routes/*.js` — the three API routes
