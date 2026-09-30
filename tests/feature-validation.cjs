const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const data = fs.readFileSync(path.join(root, 'data.js'), 'utf8');

function objectLiteral(source, name, nextMarker) {
  const start = source.indexOf(`const ${name} = `);
  if (start < 0) throw new Error(`${name} is missing`);
  const valueStart = start + `const ${name} = `.length;
  const end = source.indexOf(nextMarker, valueStart);
  if (end < 0) throw new Error(`Could not find the end of ${name}`);
  return Function(`"use strict"; return (${source.slice(valueStart, end).replace(/;\s*$/, '')});`)();
}

const stateMatch = data.match(/window\.STATE_DATA\s*=\s*(\[[\s\S]*?\]);/);
if (!stateMatch) throw new Error('STATE_DATA is missing');
const states = Function(`"use strict"; return (${stateMatch[1]});`)();
const neighbors = objectLiteral(app, 'STATE_NEIGHBORS', 'const STATE_DISCOVERY');
const discovery = objectLiteral(app, 'STATE_DISCOVERY', 'const CHAPTERS');
const stateAbbrs = new Set(states.map(state => state.abbr));

for (const state of states) {
  if (!Object.hasOwn(neighbors, state.abbr)) throw new Error(`Missing neighbor entry for ${state.abbr}`);
  if (!discovery[state.abbr]) throw new Error(`Missing discovery clue for ${state.abbr}`);
  for (const neighbor of neighbors[state.abbr]) {
    if (!stateAbbrs.has(neighbor)) throw new Error(`${state.abbr} references unknown neighbor ${neighbor}`);
    if (!neighbors[neighbor].includes(state.abbr)) throw new Error(`${state.abbr}/${neighbor} neighbor relationship is not symmetric`);
  }
}

const audioFiles = [
  'storm-eagle-theme-x.mp3','infinity-mjinion-theme.mp3','esperanto.mp3','straight-ahead.mp3',
  'storm-owl-theme-x4.mp3','wilys-castle-theme.mp3','zero-theme.mp3','x5-opening.mp3',
  'cannonball-mythos.mp3','x-vs-zero.mp3'
];
for (const file of audioFiles) {
  const full = path.join(root, 'audio', 'shop-music', file);
  if (!fs.existsSync(full) || fs.statSync(full).size < 1000) throw new Error(`Missing shop music: ${file}`);
}

for (const marker of ['Targeting Chip','Emergency Reboot','Three-life challenge','Place on U.S. map','Neighbor match','Region sorting','Capital Speed Run','Which doesn\'t belong?','Flags & landmarks','Math Mayhem','Multiplication Reactor','Division Drive']) {
  if (!app.includes(marker)) throw new Error(`Missing feature marker: ${marker}`);
}

for (const marker of ['data-armory-pose','cosmeticDemo(item)','Buy for ${item.cost} orbs']) {
  if (!app.includes(marker)) throw new Error(`Missing shop usability marker: ${marker}`);
}

console.log(`Validated ${states.length} locations, ${audioFiles.length} shop tracks, State Quest expansion markers, and three-life support systems.`);
