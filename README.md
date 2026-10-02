# Learning Arcade

A mobile-first, installable learning app for:

- U.S. states, capitals, abbreviations, and map shapes
- Reusable, named Word Wizard sets with parent-controlled archives
- Multiplication and division practice through core 0s–10s and extended 11s–15s tables
- Product/quotient fluency, fact-family, missing-factor, and equal-groups math modes
- Selectable poem sets with editable memorization and recitation practice
- Local learner profiles and a 20-mission four-sector story campaign
- Six animated story chapters unlocked across the restoration campaign
- Energy-orb progression, Sentinel reward unlocks, and animated results
- A profile-local Orb Shop and Locker with five 250-orb cosmetic forms
- Selector, success, and thinking artwork that follows the equipped Sentinel form throughout the app
- Question-level mistake tracking with targeted repair rounds
- Learn Mode that explains misses without costing lives and returns missed items later in the round
- A Mastery Review Queue that prioritizes unresolved, repeatedly missed skills
- Ten-question subject assessments and cumulative parent reports
- Weekly Parent Summaries plus detailed review of the five latest completed rounds
- Exact parent-controlled undo for the newest eligible completed round, including its orbs and progression
- Optional three-life missions with shields, repairs, retries, clues, and an Emergency Reboot
- A reusable Study Lab for parent-created flashcards, multiple choice, typed answers, and mixed practice
- CSV import/export for Study Lab sets, with a downloadable weekly-use template
- A per-profile Monday-through-Sunday Mission Board with completion, parent verification, and optional weekly rewards
- Named State Quest selections for repeatedly practicing a teacher's current group of states
- Multi-select State Quest question styles, renamed/archived sets, and correct-map-location feedback
- State placement, neighboring-state, region/division sorting, capital speed-run, odd-one-out, and discovery modes
- Optional, fully reversible Smart Review rounds based on unrepaired mistakes
- Required Parent Portal PIN controls for editing tools, with practice and the Orb Shop left open
- One-time onboarding that establishes the PIN and child profile before Student Arcade opens
- Versioned full-app backups with restore previews and a two-week backup reminder
- Separate master, music, and sound-effect controls powered through a mobile-safe audio mixer
- Resumable rounds with an in-game pause mixer, Save & Exit, and automatic background pausing
- Optional owner-protected Firebase Cloud Save for synchronizing family data across devices
- A Weekly Learning Loadout that surfaces the current state, word, math, poem, and optional Study Lab materials
- A visual Reward Gallery with six freely equipable campaign honors, including armor trims and circuit auras
- A Circuit Sentinel home-screen icon sized for iPhone and installable-app use

Everything is static and can be hosted on GitHub Pages. Practice data is always stored in the browser first; Cloud Save is an optional second copy for using the same family data on multiple devices.

## Free Cloud Save setup

Cloud Save uses Firebase's no-cost Spark plan. The app remains fully usable with local saves when Firebase is not configured or when a device is offline.

1. Create a Firebase project and keep it on the **Spark (no-cost)** plan. Do not add a billing method.
2. In **Build → Authentication → Sign-in method**, enable **Email/Password**.
3. In **Build → Firestore Database**, create a database. Choose the region closest to the family.
4. In **Project settings → Your apps**, register a Web app and copy its `firebaseConfig` object.
5. In `cloud-config.js`, replace `null` with that public configuration object. This is normal public web configuration—not a private API, service-account, or Admin SDK key.
6. In Firestore **Rules**, publish the contents of `firestore.rules`. The supplied rule permits each signed-in account to read and write only its own Learning Arcade save.
7. Publish the site, open **Parent Setup → Cloud Save** on the primary device, create the family account, and use that same sign-in on the other devices.

GitHub Pages distributes app code, layout changes, artwork, and bundled audio. Cloud Save synchronizes the changing family data: profiles, progress, reports, orbs and purchases, equipped cosmetics, settings, spelling and poem edits, Study Lab sets, State Quest sets, Mission Board assignments, and paused rounds. Manual JSON backups remain available as a separate recovery option. Avoid actively playing or editing the same profile on two devices at the exact same time; the most recently synchronized save becomes current.

Parent Setup also includes **Start completely fresh**. It removes only Learning Arcade's own browser keys, never data belonging to another PageGrove app on the shared GitHub Pages domain. When Cloud Save is signed in, the cloud document is replaced with a blank Learning Arcade save so connected devices receive the reset; the Firebase login itself remains available for reuse.

## Study Lab imports

The included `templates/study-lab-import-template.csv` opens in Excel, Numbers, or Google Sheets. Each row is one question. `set_title`, `question`, and `answer` are required; optional alternate answers and multiple-choice distractors use semicolons inside their cells. Multiple rows with the same set title become one reusable study set.

## Mission Board imports

The Mission Board accepts CSV files with `date`, `subject`, `assignment`, `notes`, and `estimated_minutes` columns. Dates use `YYYY-MM-DD`; `date` and `assignment` are required. Assignments are placed into the correct Monday–Sunday week automatically, and importing the same file again skips matching assignments. A reusable example is available at `templates/mission-board-import-template.csv`.

## Publish with GitHub Pages

1. Put these files in the root of a GitHub repository.
2. In **Settings → Pages**, choose **Deploy from a branch**.
3. Select the main branch and the repository root.
4. Open the Pages URL on the iPhone, then use **Share → Add to Home Screen**.

Ordinary updates do not require replacing the home-screen shortcut. When changing the icon itself, use **Parent Setup → Download backup** before deleting and re-adding the shortcut.

## Story and armory progression

- The prologue is available immediately. Additional chapters unlock after 4, 8, 12, 16, and 20 completed missions.
- Core Sentinel is included automatically. Ember Cannon, Frost Lance, Volt Disc, Cyclone Boomerang, and Prism Shield each cost 250 Energy Orbs.
- Purchases, ownership, equipped form, story progress, and viewed chapters are saved separately for each local learner profile.
- Math Mayhem includes Multiplication Reactor and Division Drive. Both support fluency, fact families, missing factors/divisors, and equal-group story prompts.
- The Orb Shop includes consumable support items, permanent interface cosmetics, ten unlockable mission soundtracks, and full Sentinel forms.
- Campaign milestones unlock two armor-trim modules and four circuit auras. Newly earned honors auto-equip and can be changed or removed in the Reward Gallery at no orb cost.
- Sentinel forms and permanent cosmetics do not change question difficulty or scoring. Support items are limited-use inventory.

The armory and story assets are original Circuit Sentinel designs created for this project.

Season Two, **The Mirror Citadel**, opens after the Doubt Cloud. Five rival Sentinels unlock in order through cumulative Sentinel Records: 100 correct State Quest answers, 100 combined Word Wizard/Study Lab answers, 150 Math Mayhem answers, 40 Poem Power answers, and 500 correct answers overall. Existing progress counts immediately. Additional records recognize repaired mistakes, verified homework, and practice days. Records are derived from saved history, so Undo Latest Round also reverses their progress. Boss bonuses are awarded once; replays award ordinary practice progress.

The five rival portraits use lossless WebP with verified identical visible colors and transparency, reducing this asset download by about 44%. Source PNGs are preserved locally and in the image-generation library. `tools/optimize-boss-art.cjs` verifies the conversion. Browser regression checks can be rerun with `node tests/season-two-browser.cjs` when Playwright and Chrome are available. These checks cover mobile rendering, question sources, sequential unlocks, and background pause.

Switching apps, hiding the browser, or locking the device pauses active gameplay and stops music, previews, recorded speech, device speech, and synthesized effects. The app clears its Media Session state. Returning to an active mission leaves its pause menu open; menu music may resume when the app becomes visible. Physical iOS lock-screen behavior should also be checked on-device.

## Generating Circuit Sentinel State Quest audio

`tools/fish-state-audio.mjs` generates individual Circuit Sentinel recordings for all 50 state names, their capitals, District of Columbia, and Washington, D.C. directly from `STATE_DATA`. It explicitly selects Fish Audio's `s2.1-pro-free` model in the request header. The generated paths are deterministic, temporary API failures are retried, existing MP3s are preserved, and incomplete `.part` files are never used by the app.

1. Run `tools/run-fish-state-audio.ps1` from a visible PowerShell terminal.
2. Confirm that the terminal displays `SECURE HIDDEN PROMPT` before entering the Learning Arcade Fish Audio key.
3. Paste the key only at that prompt. It should not appear on screen.
4. Leave the terminal open until it reports that generation is complete and the key has been removed.

The public Circuit Sentinel voice ID is stored in `tools/fish-state-audio.example.json`. The private API key is never stored in that file or GitHub. A local voice override may be saved as `tools/fish-state-audio.local.json`, which is ignored by Git. Output is written under `audio/circuit-sentinel/states/names/` and `audio/circuit-sentinel/states/capitals/`. State Quest automatically falls back to the selected device voice if a recording is unavailable.

## Generating Circuit Sentinel Word Wizard audio

The reusable Word Wizard workflow reads one word per line from `tools/circuit-sentinel-word-bank.txt` and writes matching MP3 files to `audio/circuit-sentinel/spelling/`. Change that text file whenever a new weekly bank is ready, then keep `BUNDLED_SPELLING_WORDS` in `data.js` synchronized with it.

1. Double-click `tools/run-fish-word-bank-audio.cmd`. It opens the correct folder and runs the PowerShell launcher automatically.
2. Paste the Learning Arcade Fish Audio key only into the secure hidden prompt.
3. Wait for `Word-bank audio generation complete` and confirmation that the key was removed.
4. Run `node tests/word-bank-audio-validation.cjs`, then commit the newly generated MP3 files with the matching word-bank update.

Existing recordings are preserved, temporary `.part` files are ignored, and missing recordings fall back to the selected device voice. Retired voice packs are kept only in the local Git-ignored `.local-audio-archive/` folder so they can be recovered without continuing to publish them on GitHub Pages.
