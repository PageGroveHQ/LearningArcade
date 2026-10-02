const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');

for (const id of ['atlas-aegis','cipher-talon','quotient-titan','verse-valkyrie','null-regent']) {
  assert(app.includes(`id:"${id}"`), `${id} is missing from the Season Two campaign`);
  assert(sw.includes(`"${id}"`), `${id} is missing from the offline cache`);
  assert(fs.existsSync(path.join(root, 'assets', 'characters', 'bosses', 'season-2', `${id}.webp`)), `${id} art is missing`);
}
for (const id of ['state-pathfinder','knowledge-weaver','number-architect','memory-keeper','mastery-signal']) assert(app.includes(`id:"${id}"`), `${id} record is missing`);
assert(app.includes('const ALL_BOSSES = [...BOSSES,...SEASON_TWO_BOSSES]'), 'Combined boss registry is missing');
assert(app.includes('stopBackgroundAudio()'), 'Page lifecycle does not stop audio');
assert(app.includes('navigator.mediaSession.playbackState="none"'), 'Lock-screen media state is not cleared');
assert(app.includes('window.speechSynthesis?.cancel()'), 'Device speech is not stopped in the background');
assert(css.includes('.rival-card') && css.includes('.sentinel-records'), 'Season Two presentation styles are missing');
console.log('Season Two, Sentinel Records, and background-audio checks passed.');
