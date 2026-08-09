// Lines up the ground-truth markers in a fixture with the free-text `rows`
// array the model returns, and scores name recall, numeric-value fidelity, and
// status-classification accuracy.

function normalize(s) {
  return String(s ?? "").toLowerCase().replace(/[^a-z0-9%]/g, "");
}

function parseNumber(raw) {
  if (raw == null) return null;
  const m = String(raw).match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

// Two-pass: exact normalized-name match first, substring fallback second (and
// only for candidates long enough that a false-positive prefix collision is
// unlikely — e.g. "MCH" is a substring of "MCHC", "NEU" of "NEU%", so short
// abbreviations must match exactly rather than via .includes()).
function findMatchingRowIndex(expected, rows, claimed) {
  const candidates = [expected.key, expected.name, ...(expected.aliases ?? [])].map(normalize).filter(Boolean);

  const exactIdx = rows.findIndex((row, i) => {
    if (claimed.has(i)) return false;
    const rowName = normalize(row?.name);
    return rowName && candidates.includes(rowName);
  });
  if (exactIdx !== -1) return exactIdx;

  return rows.findIndex((row, i) => {
    if (claimed.has(i)) return false;
    const rowName = normalize(row?.name);
    if (!rowName) return false;
    return candidates.some((c) => c.length >= 5 && (rowName.includes(c) || c.includes(rowName)));
  });
}

export function matchMarkers(expectedMarkers, rows) {
  const rowsArr = Array.isArray(rows) ? rows : [];
  const matchedRowIndices = new Set();
  const perMarker = expectedMarkers.map((expected) => {
    const idx = findMatchingRowIndex(expected, rowsArr, matchedRowIndices);
    if (idx === -1) {
      return { key: expected.key, found: false, valueMatch: null, statusMatch: null, expected, actual: null };
    }
    matchedRowIndices.add(idx);
    const row = rowsArr[idx];

    const actualValue = parseNumber(row.value);
    let valueMatch = null;
    if (typeof expected.value === "number" && actualValue != null) {
      const tolerance = Math.max(Math.abs(expected.value) * 0.03, 0.05);
      valueMatch = Math.abs(actualValue - expected.value) <= tolerance;
    }

    const statusMatch = expected.status === "unknown" ? null : row.status === expected.status;

    return { key: expected.key, found: true, valueMatch, statusMatch, expected, actual: row };
  });

  const unmatchedRows = rowsArr.filter((_, i) => !matchedRowIndices.has(i));

  const found = perMarker.filter((m) => m.found).length;
  const valueEligible = perMarker.filter((m) => m.valueMatch !== null);
  const valueCorrect = valueEligible.filter((m) => m.valueMatch).length;
  const statusEligible = perMarker.filter((m) => m.statusMatch !== null);
  const statusCorrect = statusEligible.filter((m) => m.statusMatch).length;

  return {
    perMarker,
    unmatchedRows,
    summary: {
      totalExpected: expectedMarkers.length,
      recall: expectedMarkers.length ? found / expectedMarkers.length : null,
      valueAccuracy: valueEligible.length ? valueCorrect / valueEligible.length : null,
      statusAccuracy: statusEligible.length ? statusCorrect / statusEligible.length : null,
      unmatchedRowCount: unmatchedRows.length,
    },
  };
}
