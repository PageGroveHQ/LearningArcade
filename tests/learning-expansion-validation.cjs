const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'features.css'), 'utf8');

for (const marker of [
  'Weekly Learning Loadout','Mastery Review Queue','Learn Mode','REWARD GALLERY','Set Archives',
  'Weekly Parent Summary','Undo latest round','Last five completed items','Division Drive',
  'Fact families','Missing factor','Equal groups','Choose a poem','Rename this State Quest set',
  'Name the new spelling set','Correct location:'
]) assert(app.includes(marker), `Missing Learning Arcade expansion marker: ${marker}`);

assert(html.includes('id="weeklyLoadoutCard"'), 'Weekly loadout is not mounted on Student Arcade');
assert(app.includes('function recordAnswer(ok,q,elapsed=0){const snapshot=questionSnapshot(q);session.answerEvents'), 'Answers must queue in the round transaction');
assert(!/function recordAnswer\([^)]*\)\{[^}]*stats\./.test(app), 'recordAnswer must not change persistent statistics');
assert(app.indexOf('function commitRoundResults') < app.indexOf('commitRoundResults(profile,boss,bossWon,total,correct,pct);'), 'Round completion must use the commit boundary');
assert(app.includes('profile.lastRoundUndo={roundId:round.id,before'), 'Completed round must create an exact undo receipt');
assert(app.includes('restoreProgress(profile,receipt.before)'), 'Undo must restore the pre-round snapshot');
assert(app.includes('rounds:structuredClone(stats.rounds||[])'), 'Undo must restore the exact prior round history, including a trimmed oldest record');
assert(app.includes('before.consumables=structuredClone(session.inventoryBefore)'), 'Undo must restore support items used by the round');
assert(app.includes('answers:(session.answerEvents||[]).map'), 'Completed rounds must preserve question-level review data');
assert(app.includes('p.kinds.includes(value)'), 'State Quest must support multiple simultaneous question styles');
assert(app.includes('store.spellingSets') && app.includes('activeSpellingSetId'), 'Word Wizard saved sets are incomplete');
assert(app.includes('activePoemId') && app.includes('featured-poem'), 'Poem selection is incomplete');
assert(app.includes('The app never archives learning material automatically'), 'Set Archives must be parent controlled');

for (const selector of ['.weekly-loadout-card','.math-program-tabs','.learn-mode-panel','.reward-gallery','.weekly-summary-grid','.round-review-list','.correction-location']) {
  assert(css.includes(selector), `Missing styling for ${selector}`);
}

assert(app.includes("dividing?'1s':'0s'"), 'Division Drive must not present zero as a divisor table');
assert(css.includes('.table-grid>.choice:last-child:nth-child(odd){grid-column:auto}'), 'Odd table buttons must retain the same width as their neighbors');
assert(app.includes('if(reopenCore)$("#coreTableGrid")?.closest("details")?.setAttribute("open","")'), 'Core table customization must stay expanded across selections');
assert(app.includes('d3.zoom().scaleExtent([1,7])'), 'State placement map must support bounded pinch and pan zoom');
assert(app.includes('data-map-zoom="in"') && app.includes('data-map-zoom="reset"'), 'State placement map zoom controls are missing');
assert(app.includes('event.defaultPrevented||session.locked'), 'Dragging the map must not submit a state answer');
assert(css.includes('.map-zoom-controls') && css.includes('touch-action:none'), 'Responsive map zoom styling is missing');
assert(app.includes('data-equip-reward') && app.includes('sentinelVisual('), 'Campaign reward cosmetics must be equipable and visible on Sentinel');
assert(css.includes('.sentinel-reward-aura') && css.includes('.sentinel-reward-trim'), 'Campaign reward visual layers are missing');
for (const reward of ['cyan-armor-trim','navigator-badge','energy-orb-trail','reactor-glow','archive-crest','master-sentinel-emblem']) {
  assert(fs.existsSync(path.join(root, 'assets', 'ui', 'rewards', `${reward}.png`)), `Missing campaign reward art: ${reward}`);
}
for (const versioned of ['styles.css?v=44','features.css?v=43','app.js?v=44','cloud-sync.js?v=40']) {
  assert(html.includes(versioned), `Missing current asset marker: ${versioned}`);
}

console.log('Validated deferred round commits, exact latest-round undo, detailed history, guided practice, saved curricula, expanded math, weekly planning, rewards, summaries, and archive controls.');
