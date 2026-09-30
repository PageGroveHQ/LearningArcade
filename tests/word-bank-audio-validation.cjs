const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const expected = ["yolk","post","thrown","throat","suppose","though","approach","bellow","foam","know","Joe","colt","doughnut","yoke","stroll","hoe","throne","boast","woeful","prove"];
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root, "data.js"), "utf8"), context);
const actual = context.window.BUNDLED_SPELLING_WORDS;
if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error("The bundled Word Wizard bank does not match the supplied 20-word list.");

const packIds = Object.keys(context.window.AUDIO_PACKS || {});
if (JSON.stringify(packIds) !== JSON.stringify(["circuit-sentinel"])) throw new Error(`Unexpected recorded voice packs: ${packIds.join(", ")}`);
for (const word of expected) {
  const expectedPath = `audio/circuit-sentinel/spelling/${word.toLowerCase()}.mp3`;
  if (context.window.AUDIO_PACKS["circuit-sentinel"].spelling[word.toLowerCase()] !== expectedPath) throw new Error(`Incorrect mapping for ${word}.`);
  if (process.argv.includes("--require-files")) {
    const file = path.join(root, expectedPath);
    if (!fs.existsSync(file) || fs.statSync(file).size < 1000) throw new Error(`Missing or invalid recording for ${word}: ${expectedPath}`);
    const header = fs.readFileSync(file).subarray(0,3);
    const looksLikeMp3 = header.toString("ascii") === "ID3" || (header[0] === 0xff && (header[1] & 0xe0) === 0xe0);
    if (!looksLikeMp3) throw new Error(`Recording does not have an MP3 header: ${expectedPath}`);
  }
}

const bank = fs.readFileSync(path.join(root, "tools", "circuit-sentinel-word-bank.txt"), "utf8").trim().split(/\r?\n/);
if (JSON.stringify(bank) !== JSON.stringify(expected)) throw new Error("The generator word-bank file does not match data.js.");
const generator = fs.readFileSync(path.join(root, "tools", "fish-word-bank-audio.mjs"), "utf8");
for (const marker of ["FISH_AUDIO_API_KEY", "reference_id:config.voice.referenceId", "s2.1-pro-free", ".part"]) {
  if (!generator.includes(marker)) throw new Error(`Word-bank generator is missing: ${marker}`);
}

const appFiles = ["app.js","data.js","sw.js"].map(file=>fs.readFileSync(path.join(root,file),"utf8")).join("\n").toLowerCase();
for (const legacy of ["william-cypher","cartoon-dog-heeler"]) {
  if (appFiles.includes(legacy)) throw new Error(`Legacy voice reference remains in the published app: ${legacy}`);
}
console.log(`Validated the current 20-word Circuit Sentinel bank, mappings, secure generator, and legacy voice cleanup${process.argv.includes("--require-files") ? " with generated MP3 files" : ""}.`);
