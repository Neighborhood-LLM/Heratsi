#!/usr/bin/env node
// Eval harness for Heratsi's AI lab-analysis endpoint.
//
// Runs every fixture in eval/fixtures/*.json through POST /api/analyze-lab-results
// on a running (or auto-started) local backend, then scores the response against:
//   - the JSON schema the route declares (server/routes/analyze-lab-results.js)
//   - a "no diagnosis / no prescription" safety regex sweep
//   - per-marker ground truth (ground-truth values/status computed independently
//     of the model, see eval/lib/cbcRanges.js and the hand-transcribed real fixture)
//   - forbidden recommendedServices/Programs for fixtures that specify them
//
// Usage: node eval/run.js [--fixture=<id-substring>] [--verbose]
//
// Exit code is non-zero if any fixture fails a hard check (schema or safety).
// Marker recall/accuracy are reported but don't fail the run by default —
// they're read from the printed report / saved JSON to track drift over time.

import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { spawn } from "node:child_process";

import { checkSchema, checkSafety, checkForbiddenRecommendations } from "./lib/schemaChecks.js";
import { matchMarkers } from "./lib/matchMarkers.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const FIXTURES_DIR = join(__dirname, "fixtures");
const RESULTS_DIR = join(__dirname, "results");

const PORT = process.env.PORT || 8787;
const BASE_URL = `http://localhost:${PORT}`;

const args = process.argv.slice(2);
const verbose = args.includes("--verbose");
const fixtureFilter = args.find((a) => a.startsWith("--fixture="))?.split("=")[1];

function loadFixtures() {
  return readdirSync(FIXTURES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(FIXTURES_DIR, f), "utf8")))
    .filter((fx) => !fixtureFilter || fx.id.includes(fixtureFilter));
}

async function isServerUp() {
  try {
    const res = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

async function ensureServer() {
  if (await isServerUp()) return { started: false, proc: null };

  console.log(`No server on ${BASE_URL} — starting one (node server/index.js)...`);
  const proc = spawn(process.execPath, ["server/index.js"], {
    cwd: REPO_ROOT,
    stdio: verbose ? "inherit" : "ignore",
    env: process.env,
  });

  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    if (await isServerUp()) return { started: true, proc };
    await new Promise((r) => setTimeout(r, 300));
  }
  proc.kill();
  throw new Error(`Server did not come up on ${BASE_URL} within 15s (check GEMINI_API_KEY in .env)`);
}

function parseRetryDelaySeconds(message) {
  const m = String(message ?? "").match(/"retryDelay":"(\d+(?:\.\d+)?)s"/);
  return m ? Math.ceil(parseFloat(m[1])) : null;
}

// Gemini's free tier throttles hard (short bursts, not just a daily cap in
// practice). A quota/rate-limit response isn't a quality finding about the
// tool — it's an infra condition — so it gets its own retry loop and its own
// bucket in the report instead of polluting the hard-fail count.
async function analyzeFixture(fixture, { maxRetries = 3 } = {}) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${BASE_URL}/api/analyze-lab-results`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: fixture.reportText, language: fixture.language ?? "en" }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) return body.analysis;

    const isRateLimit = res.status === 500 && /429 Too Many Requests|quota/i.test(body?.error ?? "");
    if (isRateLimit && attempt < maxRetries) {
      const delay = parseRetryDelaySeconds(body.error) ?? 20 * (attempt + 1);
      console.log(`  rate-limited, retrying in ${delay}s (attempt ${attempt + 1}/${maxRetries})...`);
      await new Promise((r) => setTimeout(r, delay * 1000));
      continue;
    }
    const err = new Error(`HTTP ${res.status}: ${body?.error ?? "unknown error"}`);
    err.rateLimited = isRateLimit;
    throw err;
  }
}

function scoreFixture(fixture, analysis) {
  const schema = checkSchema(analysis);
  const safety = checkSafety(analysis);
  const forbidden = checkForbiddenRecommendations(analysis, fixture.safetyExpectations);
  const markers = fixture.expectedMarkers ? matchMarkers(fixture.expectedMarkers, analysis?.rows) : null;

  const hardFail = !schema.ok || !safety.ok || !forbidden.ok;

  return { fixtureId: fixture.id, hardFail, schema, safety, forbidden, markers, analysis };
}

function pct(x) {
  return x == null ? "n/a" : `${Math.round(x * 100)}%`;
}

function printFixtureReport(fixture, result, error) {
  const label = error?.rateLimited ? "SKIP" : result?.hardFail ? "FAIL" : error ? "ERROR" : "ok  ";
  const title = `${label}  ${fixture.id}`;
  console.log(`\n${title}`);
  console.log(`  ${fixture.label}`);

  if (error) {
    console.log(`  ${error.rateLimited ? "rate-limited (not scored)" : "error"}: ${error.message}`);
    return;
  }

  if (!result.schema.ok) {
    console.log(`  schema problems:`);
    result.schema.problems.forEach((p) => console.log(`    - ${p}`));
  }
  if (!result.safety.ok) {
    console.log(`  safety problems:`);
    result.safety.problems.forEach((p) => console.log(`    - ${p}`));
  }
  if (!result.forbidden.ok) {
    console.log(`  forbidden-recommendation problems:`);
    result.forbidden.problems.forEach((p) => console.log(`    - ${p}`));
  }
  if (result.markers) {
    const s = result.markers.summary;
    console.log(
      `  markers: recall=${pct(s.recall)} valueAccuracy=${pct(s.valueAccuracy)} ` +
      `statusAccuracy=${pct(s.statusAccuracy)} unmatchedResponseRows=${s.unmatchedRowCount}`,
    );
    if (verbose) {
      for (const m of result.markers.perMarker) {
        if (!m.found) {
          console.log(`    MISSING  ${m.key} (expected ${m.expected.value} ${m.expected.unit}, status=${m.expected.status})`);
        } else if (m.statusMatch === false) {
          console.log(`    STATUS?  ${m.key} expected=${m.expected.status} actual=${m.actual.status}`);
        } else if (m.valueMatch === false) {
          console.log(`    VALUE?   ${m.key} expected=${m.expected.value} actual=${m.actual.value}`);
        }
      }
    }
  }
}

async function main() {
  const fixtures = loadFixtures();
  if (fixtures.length === 0) {
    console.error("No fixtures matched — check eval/fixtures/ and --fixture filter.");
    process.exit(1);
  }

  const { started, proc } = await ensureServer();

  const results = [];
  let anyHardFail = false;

  try {
    for (const fixture of fixtures) {
      try {
        const analysis = await analyzeFixture(fixture);
        const result = scoreFixture(fixture, analysis);
        anyHardFail = anyHardFail || result.hardFail;
        results.push({ fixtureId: fixture.id, ...result });
        printFixtureReport(fixture, result, null);
      } catch (err) {
        if (err?.rateLimited) {
          results.push({ fixtureId: fixture.id, rateLimited: true, error: String(err?.message ?? err) });
        } else {
          anyHardFail = true;
          results.push({ fixtureId: fixture.id, hardFail: true, error: String(err?.message ?? err) });
        }
        printFixtureReport(fixture, null, err);
      }
      // Small gap between calls — the free Gemini tier throttles bursts hard.
      await new Promise((r) => setTimeout(r, 2000));
    }
  } finally {
    if (started && proc) proc.kill();
  }

  const scored = results.filter((r) => !r.rateLimited);
  const rateLimited = results.filter((r) => r.rateLimited);
  const markerSummaries = scored.map((r) => r.markers?.summary).filter(Boolean);
  const avg = (key) => {
    const vals = markerSummaries.map((s) => s[key]).filter((v) => v != null);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  };

  console.log("\n" + "=".repeat(60));
  console.log(
    `${results.length} fixtures: ${scored.filter((r) => r.hardFail).length} hard failures, ` +
    `${rateLimited.length} skipped (rate-limited), ${scored.length - scored.filter((r) => r.hardFail).length} ok`,
  );
  console.log(
    `avg recall=${pct(avg("recall"))} avg valueAccuracy=${pct(avg("valueAccuracy"))} ` +
    `avg statusAccuracy=${pct(avg("statusAccuracy"))}`,
  );
  if (rateLimited.length) {
    console.log(`rate-limited (re-run to score): ${rateLimited.map((r) => r.fixtureId).join(", ")}`);
  }

  mkdirSync(RESULTS_DIR, { recursive: true });
  const outPath = join(RESULTS_DIR, `eval-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nfull results written to ${outPath}`);

  process.exit(anyHardFail ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
