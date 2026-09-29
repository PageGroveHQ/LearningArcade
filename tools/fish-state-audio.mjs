import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const args = Object.fromEntries(process.argv.slice(2).map(argument => {
  const [key, ...rest] = argument.replace(/^--/, "").split("=");
  return [key, rest.join("=") || true];
}));
const configPath = path.resolve(root, String(args.config || "tools/fish-state-audio.example.json"));
const config = JSON.parse(await fs.readFile(configPath, "utf8"));
const apiKey = process.env.FISH_AUDIO_API_KEY;
const dryRun = args["dry-run"] === true || args["dry-run"] === "true";
if (!dryRun && !apiKey) throw new Error("FISH_AUDIO_API_KEY is missing. Start this tool with the secure PowerShell launcher.");
if (!config.voice?.referenceId) throw new Error(`Add the Circuit Sentinel referenceId to ${configPath}.`);

const context = {window:{}};
vm.runInNewContext(await fs.readFile(path.join(root, "data.js"), "utf8"), context);
const locations = context.window.STATE_DATA;
if (!Array.isArray(locations) || locations.length !== 51) throw new Error(`Expected 50 states plus Washington, D.C.; found ${locations?.length || 0}.`);

const categories = String(args.categories || "names,capitals").split(",").map(value => value.trim()).filter(Boolean);
const validCategories = new Set(["names", "capitals"]);
if (categories.some(category => !validCategories.has(category))) throw new Error("Categories must be names, capitals, or both.");

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const exists = async file => fs.access(file).then(() => true, () => false);

async function synthesize({text, file}) {
  const partial = `${file}.part`;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const response = await fetch("https://api.fish.audio/v1/tts", {
      method:"POST",
      headers:{
        Authorization:`Bearer ${apiKey}`,
        "Content-Type":"application/json",
        model:config.model || "s2.1-pro-free"
      },
      body:JSON.stringify({
        text,
        reference_id:config.voice.referenceId,
        format:"mp3"
      })
    });
    if (response.ok) {
      const audio = Buffer.from(await response.arrayBuffer());
      if (audio.length < 1000) throw new Error(`Fish returned an unexpectedly small audio file for “${text}”.`);
      await fs.writeFile(partial, audio);
      await fs.rename(partial, file);
      return;
    }
    const message = await response.text();
    if (attempt === 4 || ![408, 429, 500, 502, 503, 504].includes(response.status)) {
      const error = new Error(`${response.status}: ${message}`);
      error.status = response.status;
      throw error;
    }
    await sleep(750 * 2 ** attempt);
  }
}

try {
  let generated = 0;
  let skipped = 0;
  for (const location of locations) {
    for (const category of categories) {
      const directory = path.join(root, "audio", config.voice.name, "states", category);
      const file = path.join(directory, `${location.abbr.toLowerCase()}.mp3`);
      const text = category === "names" ? location.name : location.capital;
      if (await exists(file)) {
        console.log(`skip ${path.relative(root, file)}`);
        skipped++;
        continue;
      }
      console.log(`${dryRun ? "plan" : "make"} ${location.abbr}/${category}: ${text}`);
      if (!dryRun) {
        await fs.mkdir(directory, {recursive:true});
        await synthesize({text, file});
        await sleep(Number(config.delayMs || 350));
        generated++;
      }
    }
  }

  console.log(dryRun
    ? `Dry run complete: ${locations.length} locations and ${locations.length * categories.length} planned recordings.`
    : `State audio generation complete: ${generated} created, ${skipped} preserved.`);
} catch (error) {
  if (error.status === 402) {
    console.error("Fish Audio declined the request with HTTP 402 even though the free developer model was explicitly requested.");
    console.error("Open https://fish.audio/app/developers while signed into the account that owns this key, then check its API/free-model access or API balance.");
  } else {
    console.error(`Fish Audio generation stopped: ${error.message}`);
  }
  await sleep(300);
  process.exitCode = 1;
}
