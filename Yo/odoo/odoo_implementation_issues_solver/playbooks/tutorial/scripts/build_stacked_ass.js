/*
  Build a stacked (multi-line) ASS subtitle file from a storyboard JSON.

  Usage:
    node build_stacked_ass.js --storyboard "path\\storyboard.json" --languages "en,es" --primary "en" --out "path\\subtitles.stacked.ass"

  The storyboard JSON is expected to have a top-level "cues" array where each cue has:
    - start_ms
    - end_ms
    - translations (object) and/or text
*/

"use strict";

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i++;
  }
  return args;
}

function formatAssTime(ms) {
  const value = Math.max(0, Number(ms) || 0);
  const hours = Math.floor(value / 3600000);
  const remainder1 = value % 3600000;
  const minutes = Math.floor(remainder1 / 60000);
  const remainder2 = remainder1 % 60000;
  const seconds = Math.floor(remainder2 / 1000);
  const centiseconds = Math.floor((remainder2 % 1000) / 10);

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const cs = String(centiseconds).padStart(2, "0");
  return `${hours}:${mm}:${ss}.${cs}`;
}

function escapeAssText(text) {
  let value = String(text ?? "");
  value = value.replaceAll("\\", "\\\\");
  value = value.replaceAll("{", "\\{");
  value = value.replaceAll("}", "\\}");
  value = value.replaceAll("\r\n", "\\N");
  value = value.replaceAll("\n", "\\N");
  value = value.replaceAll("\r", "\\N");
  return value;
}

function getCueText(cue, language, primaryLanguage) {
  const lang = String(language ?? "").trim().toLowerCase() || String(primaryLanguage ?? "").trim().toLowerCase();
  const primary = String(primaryLanguage ?? "").trim().toLowerCase();

  const translations = cue && cue.translations && typeof cue.translations === "object" ? cue.translations : {};
  if (lang && Object.prototype.hasOwnProperty.call(translations, lang)) return String(translations[lang] ?? "");
  if (primary && Object.prototype.hasOwnProperty.call(translations, primary)) return String(translations[primary] ?? "");
  if (cue && typeof cue.text === "string") return cue.text;
  return "";
}

function ensureParentDir(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const args = parseArgs(process.argv);
  const storyboardPath = args.storyboard || args.cues;
  const outPath = args.out;
  const languagesRaw = args.languages || "";
  const primaryLanguage = String(args.primary || "en").trim().toLowerCase();

  if (!storyboardPath) throw new Error("Missing --storyboard (or --cues).");
  if (!outPath) throw new Error("Missing --out.");
  if (!languagesRaw) throw new Error("Missing --languages (e.g. \"en\" or \"es,en\").");

  const languages = languagesRaw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const raw = fs.readFileSync(storyboardPath, "utf8");
  const json = JSON.parse(raw.replace(/^\uFEFF/, ""));
  const cues = Array.isArray(json) ? json : Array.isArray(json?.cues) ? json.cues : [];
  if (!Array.isArray(cues) || cues.length === 0) throw new Error("No cues found in storyboard JSON.");

  const header =
    "[Script Info]\n" +
    "Title: WAIBA Tutorial Stacked Subtitles\n" +
    "ScriptType: v4.00+\n" +
    "WrapStyle: 2\n" +
    "ScaledBorderAndShadow: yes\n" +
    "\n" +
    "[V4+ Styles]\n" +
    "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n" +
    "Style: Default,Arial,42,&H00FFFFFF,&H0000FFFF,&H00101010,&H60000000,0,0,0,0,100,100,0,0,1,2,1,2,30,30,48,1\n" +
    "\n" +
    "[Events]\n" +
    "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n";

  let events = "";
  for (const cue of cues) {
    if (!cue || typeof cue !== "object") continue;

    const startMs = Number(cue.start_ms ?? 0);
    const endMsRaw = Number(cue.end_ms ?? startMs + 1000);
    const endMs = endMsRaw > startMs ? endMsRaw : startMs + 1000;

    const lines = [];
    for (const language of languages) {
      const txt = getCueText(cue, language, primaryLanguage);
      if (txt.trim()) lines.push(escapeAssText(txt));
    }
    if (lines.length === 0) continue;

    const stackedText = lines.join("\\N");
    events += `Dialogue: 0,${formatAssTime(startMs)},${formatAssTime(endMs)},Default,,0,0,0,,${stackedText}\n`;
  }

  ensureParentDir(outPath);
  fs.writeFileSync(outPath, header + events, "utf8");

  process.stdout.write(
    JSON.stringify({
      ok: true,
      out_path: outPath,
      storyboard_path: storyboardPath,
      cues_count: cues.length,
      languages,
      primary_language: primaryLanguage,
    })
  );
}

try {
  main();
} catch (err) {
  const message = err && err.message ? err.message : String(err);
  process.stdout.write(JSON.stringify({ ok: false, error: message }));
  process.exitCode = 1;
}
