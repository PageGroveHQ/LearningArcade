const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root, "data.js"), "utf8"), context);
const states = context.window.STATE_DATA;
if (states.length !== 51) throw new Error(`Expected 50 states plus Washington, D.C.; found ${states.length}.`);
if (!states.some(state=>state.abbr === "DC" && state.name === "District of Columbia" && state.capital === "Washington, D.C.")) throw new Error("Washington, D.C. mapping is missing.");

const mappings = context.window.AUDIO_PACKS?.["circuit-sentinel"]?.states;
for (const state of states) {
  const expectedName = `audio/circuit-sentinel/states/names/${state.abbr.toLowerCase()}.mp3`;
  const expectedCapital = `audio/circuit-sentinel/states/capitals/${state.abbr.toLowerCase()}.mp3`;
  if (mappings?.[state.abbr]?.name !== expectedName) throw new Error(`Incorrect state-name mapping for ${state.abbr}.`);
  if (mappings?.[state.abbr]?.capital !== expectedCapital) throw new Error(`Incorrect capital mapping for ${state.abbr}.`);
}

const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
for (const marker of ["stateRecordedAudio(state, field)", "audio:stateRecordedAudio(state,field)", "playPracticeAudio(q.speech,q.audio)", "audio:q.audio||\"\""]) {
  if (!app.includes(marker)) throw new Error(`State Quest playback integration is missing: ${marker}`);
}

const generatedFiles = states.flatMap(state=>[mappings[state.abbr].name,mappings[state.abbr].capital]).filter(file=>fs.existsSync(path.join(root,file)));
if (process.argv.includes("--require-files")) {
  if (generatedFiles.length !== 102) throw new Error(`Expected 102 generated MP3s; found ${generatedFiles.length}.`);
  for (const file of generatedFiles) {
    const fullPath = path.join(root,file);
    if (fs.statSync(fullPath).size < 1000) throw new Error(`Audio file is unexpectedly small: ${file}`);
    const header = fs.readFileSync(fullPath).subarray(0,3);
    const looksLikeMp3 = header.toString("ascii") === "ID3" || (header[0] === 0xff && (header[1] & 0xe0) === 0xe0);
    if (!looksLikeMp3) throw new Error(`Audio file does not have an MP3 header: ${file}`);
  }
}

console.log(`Validated 51 locations and 102 Circuit Sentinel state-audio mappings${process.argv.includes("--require-files") ? " with generated MP3 files" : ""}.`);
