// Generates synthetic CBC lab-report fixtures for the eval harness.
//
// The raw rows below are hand-picked from a larger synthetic CBC dataset the
// project owner provided (~250 patient panels). Each one is chosen to exercise
// a specific pattern: a clean normal panel, a common single-lineage abnormality,
// a multi-abnormality/critical-value panel, and two deliberately corrupted-data
// cases (garbled numeric tokens, a nonsense date of birth) that a PDF/OCR
// pipeline can plausibly produce.
//
// Run: node eval/fixtures/build-cbc-fixtures.js
// Writes eval/fixtures/synthetic-cbc-<id>.json

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { CBC_RANGES, classify, formatRange, fullName, ALIASES } from "../lib/cbcRanges.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ORDER = ["WBC", "RBC", "HGB", "HCT", "MCV", "MCH", "MCHC", "RDW", "PLT",
  "NEU%", "LYM%", "MONO%", "EOS%", "BASO%", "NEU", "LYM", "MONO", "EOS", "BASO"];

const RAW_CASES = [
  {
    id: "cbc-normal-baseline",
    label: "Clean, entirely-normal adult female CBC",
    sex: "female", dob: "1999-03-20",
    values: { WBC: 5.604, RBC: 5.062, HGB: 155.1, HCT: 0.4422, MCV: 87.36, MCH: 30.65, MCHC: 350.8, RDW: 10.78, PLT: 269.2, "NEU%": 52.18, "LYM%": 41.27, "MONO%": 5.252, "EOS%": 0.5648, "BASO%": 0.7342, NEU: 2.925, LYM: 2.313, MONO: 0.2944, EOS: 0.0317, BASO: 0.0411 },
  },
  {
    id: "cbc-mild-anemia-missing-fields",
    label: "Mild normocytic anemia; source omits some fields (blank PCT/PDW upstream)",
    sex: "female", dob: "1961-09-01",
    values: { WBC: 4.7, RBC: 3.79, HGB: 111, HCT: 0.350, MCV: 92.4, MCH: 29.3, MCHC: 317, RDW: 12.4, PLT: 258, "NEU%": 52.4, "LYM%": 38.8, "MONO%": 7.2, "EOS%": 1.5, "BASO%": 0.1, NEU: 2.5, LYM: 1.8, MONO: 0.3, EOS: 0.1, BASO: 0.0 },
  },
  {
    id: "cbc-polycythemia-pattern",
    label: "High RBC/HGB/HCT across the erythroid line (polycythemia-like)",
    sex: "male", dob: "1980-07-03",
    values: { WBC: 8.395, RBC: 6.420, HGB: 189.1, HCT: 0.54, MCV: 84.12, MCH: 29.45, MCHC: 350.1, RDW: 11.59, PLT: 294.9, "NEU%": 50.26, "LYM%": 40.75, "MONO%": 5.026, "EOS%": 2.909, "BASO%": 1.052, NEU: 4.219, LYM: 3.421, MONO: 0.4219, EOS: 0.2442, BASO: 0.0883 },
  },
  {
    id: "cbc-critical-thrombocytopenia-garbled",
    label: "Severe thrombocytopenia + microcytic anemia, with garbled MPV/PDW tokens from the source",
    sex: "male", dob: "1968-08-07",
    values: { WBC: 8.153, RBC: 5.063, HGB: 96.52, HCT: 0.3304, MCV: 65.26, MCH: 19.06, MCHC: 292.1, RDW: 14.08, PLT: 15.08, "NEU%": 68.53, "LYM%": 22.57, "MONO%": 6.076, "EOS%": 1.626, "BASO%": 1.199, NEU: 5.587, LYM: 1.840, MONO: 0.4953, EOS: 0.1325, BASO: 0.0978 },
    garbledMPV: ">>>>>", garbledPDW: "-----",
  },
  {
    id: "cbc-leukocytosis-neutrophilia",
    label: "Marked leukocytosis with neutrophilia (infection/inflammation pattern)",
    sex: "female", dob: "1958-09-25",
    values: { WBC: 16.18, RBC: 4.731, HGB: 144.4, HCT: 0.4133, MCV: 87.35, MCH: 30.53, MCHC: 349.5, RDW: 11.15, PLT: 284.1, "NEU%": 82.26, "LYM%": 12.20, "MONO%": 5.012, "EOS%": 0.2913, "BASO%": 0.2310, NEU: 13.31, LYM: 1.975, MONO: 0.8110, EOS: 0.0471, BASO: 0.0374 },
  },
  {
    id: "cbc-extreme-multi-abnormal",
    label: "Extreme leukocytosis + neutrophilia + marked thrombocytosis + high MCHC (multiple severe findings)",
    sex: "male", dob: "1988-03-18",
    values: { WBC: 17.48, RBC: 4.861, HGB: 164.5, HCT: 0.4361, MCV: 89.72, MCH: 33.84, MCHC: 377.1, RDW: 12.44, PLT: 851.8, "NEU%": 79.80, "LYM%": 14.20, "MONO%": 4.790, "EOS%": 0.6038, "BASO%": 0.6038, NEU: 13.95, LYM: 2.482, MONO: 0.8373, EOS: 0.1055, BASO: 0.1055 },
  },
  {
    id: "cbc-thalassemia-like-pattern",
    label: "Microcytic/hypochromic indices with high-normal RBC count and mild leukopenia (thalassemia-trait-like)",
    sex: "female", dob: "1965-05-02",
    values: { WBC: 3.022, RBC: 5.409, HGB: 111.9, HCT: 0.356, MCV: 65.82, MCH: 20.69, MCHC: 314.3, RDW: 15.21, PLT: 131.3, "NEU%": 54.04, "LYM%": 35.75, "MONO%": 6.784, "EOS%": 1.560, "BASO%": 1.866, NEU: 1.633, LYM: 1.080, MONO: 0.2050, EOS: 0.0471, BASO: 0.0564 },
  },
  {
    id: "cbc-bogus-dob-neutrophilia",
    label: "Corrupted date-of-birth field (1001-01-01) alongside a real neutrophilia/lymphopenia pattern",
    sex: "female", dob: "1001-01-01",
    values: { WBC: 9.032, RBC: 4.928, HGB: 139.1, HCT: 0.4148, MCV: 84.17, MCH: 28.23, MCHC: 335.4, RDW: 12.05, PLT: 182.6, "NEU%": 83.80, "LYM%": 14.06, "MONO%": 1.652, "EOS%": 0.0844, "BASO%": 0.4099, NEU: 7.569, LYM: 1.270, MONO: 0.1492, EOS: 0.0076, BASO: 0.0370 },
  },
];

function buildFixture(raw) {
  const expectedMarkers = ORDER.map((key) => {
    const value = raw.values[key];
    return {
      key,
      name: fullName(key),
      aliases: ALIASES[key],
      value,
      unit: CBC_RANGES[key].unit,
      referenceRange: formatRange(key, raw.sex),
      status: classify(key, value, raw.sex),
    };
  });

  const lines = [
    `Complete Blood Count (CBC) with differential`,
    `Sex: ${raw.sex}    Date of birth: ${raw.dob}`,
    ``,
    `Test\tResult\tUnit\tReference range`,
  ];
  for (const m of expectedMarkers) {
    lines.push(`${m.key}\t${m.value}\t${m.unit}\t${m.referenceRange}`);
  }
  // MPV/PDW are printed in the source report but have no ground-truth range in
  // this harness; the garbled-token fixture uses them to test robustness to
  // corrupted OCR values that aren't part of the scored marker set.
  lines.push(`MPV\t${raw.garbledMPV ?? "7.5"}\tfL\t7.5-11.5`);
  lines.push(`PDW\t${raw.garbledPDW ?? "16-18"}\tGSD\t9-17`);

  return {
    id: raw.id,
    label: raw.label,
    source: "synthetic-cbc",
    language: "en",
    reportText: lines.join("\n"),
    expectedMarkers,
  };
}

for (const raw of RAW_CASES) {
  const fixture = buildFixture(raw);
  const outPath = join(__dirname, `synthetic-${fixture.id}.json`);
  writeFileSync(outPath, JSON.stringify(fixture, null, 2) + "\n");
  console.log(`wrote ${outPath}`);
}
