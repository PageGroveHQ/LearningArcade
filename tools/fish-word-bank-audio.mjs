import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const args = Object.fromEntries(process.argv.slice(2).map(argument => {
  const [key, ...rest] = argument.replace(/^--/, "").split("=");
  return [key, rest.join("=") || true];
}));
const configPath = path.resolve(root, String(args.config || "tools/fish-state-audio.example.json"));
const inputPath = path.resolve(root, String(args.input || "tools/circuit-sentinel-word-bank.txt"));
const outputDirectory = path.resolve(root, String(args.output || "audio/circuit-sentinel/spelling"));
const allowedOutputRoot = path.resolve(root, "audio", "circuit-sentinel");
const config = JSON.parse(await fs.readFile(configPath, "utf8"));
const apiKey = process.env.FISH_AUDIO_API_KEY;
const dryRun = args["dry-run"] === true || args["dry-run"] === "true";

if (!dryRun && !apiKey) throw new Error("FISH_AUDIO_API_KEY is missing. Start this tool with the secure PowerShell launcher.");
if (!config.voice?.referenceId) throw new Error(`Add the Circuit Sentinel referenceId to ${configPath}.`);
if (outputDirectory !== allowedOutputRoot && !outputDirectory.startsWith(`${allowedOutputRoot}${path.sep}`)) {
  throw new Error("The output folder must remain inside audio/circuit-sentinel.");
}

const rawWords = (await fs.readFile(inputPath, "utf8"))
  .split(/\r?\n/)
  .map(word => word.trim())
  .filter(word => word && !word.startsWith("#"));
const words = [...new Map(rawWords.map(word => [word.toLocaleLowerCase("en-US"), word])).values()];
if (!words.length) throw new Error(`No words were found in ${inputPath}.`);

const fileNameFor = word => {
  const slug = word.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!slug) throw new Error(`Cannot create a safe filename for “${word}”.`);
  return `${slug}.mp3`;
};
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
      body:JSON.stringify({text,reference_id:config.voice.referenceId,format:"mp3"})
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
  const seenFiles = new Set();
  let generated = 0;
  let skipped = 0;
  for (const word of words) {
    const fileName = fileNameFor(word);
    if (seenFiles.has(fileName)) throw new Error(`Two words resolve to the same filename: ${fileName}`);
    seenFiles.add(fileName);
    const file = path.join(outputDirectory, fileName);
    if (await exists(file)) {
      console.log(`skip ${path.relative(root, file)} (${word})`);
      skipped++;
      continue;
    }
    console.log(`${dryRun ? "plan" : "make"} ${fileName}: ${word}`);
    if (!dryRun) {
      await fs.mkdir(outputDirectory, {recursive:true});
      await synthesize({text:word, file});
      await sleep(Number(config.delayMs || 350));
      generated++;
    }
  }
  console.log(dryRun
    ? `Dry run complete: ${words.length} planned Circuit Sentinel word recordings.`
    : `Word-bank audio generation complete: ${generated} created, ${skipped} preserved.`);
} catch (error) {
  if (error.status === 402) {
    console.error("Fish Audio declined the request with HTTP 402. Check the developer account associated with this API key.");
  } else {
    console.error(`Fish Audio generation stopped: ${error.message}`);
  }
  await sleep(300);
  process.exitCode = 1;
}
