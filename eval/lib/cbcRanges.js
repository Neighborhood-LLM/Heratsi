// Standard adult CBC reference ranges used as ground truth for the eval harness.
// Deliberately simple (no age bands beyond adult) — good enough to score whether
// the model's status classification matches a widely-cited normal range, not a
// substitute for real lab-specific ranges.
export const CBC_RANGES = {
  WBC: { unit: "10^9/L", low: 4.0, high: 11.0 },
  RBC: { unit: "10^12/L", male: { low: 4.5, high: 5.9 }, female: { low: 4.0, high: 5.2 } },
  HGB: { unit: "g/L", male: { low: 135, high: 175 }, female: { low: 120, high: 155 } },
  HCT: { unit: "L/L", male: { low: 0.40, high: 0.52 }, female: { low: 0.36, high: 0.46 } },
  MCV: { unit: "fL", low: 80, high: 100 },
  MCH: { unit: "pg", low: 27, high: 33 },
  MCHC: { unit: "g/L", low: 320, high: 360 },
  RDW: { unit: "%", low: 11.5, high: 14.5 },
  PLT: { unit: "10^9/L", low: 150, high: 400 },
  "NEU%": { unit: "%", low: 40, high: 75 },
  "LYM%": { unit: "%", low: 20, high: 45 },
  "MONO%": { unit: "%", low: 2, high: 10 },
  "EOS%": { unit: "%", low: 1, high: 6 },
  "BASO%": { unit: "%", low: 0, high: 2 },
  NEU: { unit: "10^9/L", low: 2.0, high: 7.5 },
  LYM: { unit: "10^9/L", low: 1.0, high: 4.0 },
  MONO: { unit: "10^9/L", low: 0.2, high: 0.8 },
  EOS: { unit: "10^9/L", low: 0.02, high: 0.5 },
  BASO: { unit: "10^9/L", low: 0.02, high: 0.1 },
};

const FULL_NAMES = {
  WBC: "White blood cell count",
  RBC: "Red blood cell count",
  HGB: "Hemoglobin",
  HCT: "Hematocrit",
  MCV: "Mean corpuscular volume",
  MCH: "Mean corpuscular hemoglobin",
  MCHC: "Mean corpuscular hemoglobin concentration",
  RDW: "Red cell distribution width",
  PLT: "Platelet count",
  "NEU%": "Neutrophils %",
  "LYM%": "Lymphocytes %",
  "MONO%": "Monocytes %",
  "EOS%": "Eosinophils %",
  "BASO%": "Basophils %",
  NEU: "Neutrophils (absolute)",
  LYM: "Lymphocytes (absolute)",
  MONO: "Monocytes (absolute)",
  EOS: "Eosinophils (absolute)",
  BASO: "Basophils (absolute)",
};

// A parser might reasonably use any of these strings for the marker name;
// used by the matcher to line up ground truth with the model's free-text output.
export const ALIASES = {
  WBC: ["wbc", "white blood cell", "white blood cells", "leukocyte"],
  RBC: ["rbc", "red blood cell", "red blood cells", "erythrocyte"],
  HGB: ["hgb", "hemoglobin", "haemoglobin"],
  HCT: ["hct", "hematocrit", "haematocrit"],
  MCV: ["mcv", "mean corpuscular volume"],
  MCH: ["mch", "mean corpuscular hemoglobin"],
  MCHC: ["mchc"],
  RDW: ["rdw"],
  PLT: ["plt", "platelet"],
  "NEU%": ["neu%", "neutrophil %", "neutrophils %", "% neutrophil"],
  "LYM%": ["lym%", "lymphocyte %", "lymphocytes %", "% lymphocyte"],
  "MONO%": ["mono%", "monocyte %", "monocytes %", "% monocyte"],
  "EOS%": ["eos%", "eosinophil %", "eosinophils %", "% eosinophil"],
  "BASO%": ["baso%", "basophil %", "basophils %", "% basophil"],
  NEU: ["neu", "neutrophil", "neutrophils", "absolute neutrophil"],
  LYM: ["lym", "lymphocyte", "lymphocytes", "absolute lymphocyte"],
  MONO: ["mono", "monocyte", "monocytes", "absolute monocyte"],
  EOS: ["eos", "eosinophil", "eosinophils", "absolute eosinophil"],
  BASO: ["baso", "basophil", "basophils", "absolute basophil"],
};

export function fullName(key) {
  return FULL_NAMES[key] ?? key;
}

export function rangeFor(key, sex) {
  const r = CBC_RANGES[key];
  if (!r) return null;
  if (r.male || r.female) return sex === "male" ? r.male : r.female;
  return r;
}

export function classify(key, value, sex) {
  const r = rangeFor(key, sex);
  if (!r || value == null || Number.isNaN(value)) return "unknown";
  if (value < r.low) return "low";
  if (value > r.high) return "high";
  return "normal";
}

export function formatRange(key, sex) {
  const r = rangeFor(key, sex);
  if (!r) return "";
  return `${r.low}-${r.high}`;
}
