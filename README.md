# Learning Arcade

A mobile-first, installable learning app for:

- U.S. states, capitals, abbreviations, and map shapes
- Weekly spelling word banks
- Multiplication facts from 0 × 0 through 9 × 9
- Editable poem memorization and recitation practice
- Local learner profiles and a 20-mission four-sector story campaign
- Six animated story chapters unlocked across the restoration campaign
- Energy-orb progression, Sentinel reward unlocks, and animated results
- A profile-local Orb Shop and Locker with five 250-orb cosmetic forms
- Selector, success, and thinking artwork that follows the equipped Sentinel form throughout the app
- Question-level mistake tracking with targeted repair rounds
- Ten-question subject assessments and cumulative parent reports
- Optional three-life missions with shields, repairs, retries, clues, and an Emergency Reboot
- A reusable Study Lab for parent-created flashcards, multiple choice, typed answers, and mixed practice
- CSV import/export for Study Lab sets, with a downloadable weekly-use template
- A per-profile Monday-through-Sunday Mission Board with completion, parent verification, and optional weekly rewards
- Named State Quest selections for repeatedly practicing a teacher's current group of states
- State placement, neighboring-state, region/division sorting, capital speed-run, odd-one-out, and discovery modes
- Optional, fully reversible Smart Review rounds based on unrepaired mistakes
- Required Parent Portal PIN controls for editing tools, with practice and the Orb Shop left open
- One-time onboarding that establishes the PIN and child profile before Student Arcade opens
- Versioned full-app backups with restore previews and a two-week backup reminder
- Separate master, music, and sound-effect controls powered through a mobile-safe audio mixer
- A Circuit Sentinel home-screen icon sized for iPhone and installable-app use

Everything is static and can be hosted on GitHub Pages. Practice data is stored only in the browser on the current device.

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
- Math Mayhem currently opens the Multiplication Reactor; Division Drive, Addition Array, and Subtraction Circuit are reserved as future sectors.
- The Orb Shop includes consumable support items, permanent interface cosmetics, ten unlockable mission soundtracks, and full Sentinel forms.
- Sentinel forms and permanent cosmetics do not change question difficulty or scoring. Support items are limited-use inventory.

The armory and story assets are original Circuit Sentinel designs created for this project.

## Generating Circuit Sentinel State Quest audio

`tools/fish-state-audio.mjs` generates individual Circuit Sentinel recordings for all 50 state names, their capitals, District of Columbia, and Washington, D.C. directly from `STATE_DATA`. It explicitly selects Fish Audio's `s2.1-pro-free` model in the request header. The generated paths are deterministic, temporary API failures are retried, existing MP3s are preserved, and incomplete `.part` files are never used by the app.

1. Run `tools/run-fish-state-audio.ps1` from a visible PowerShell terminal.
2. Confirm that the terminal displays `SECURE HIDDEN PROMPT` before entering the Learning Arcade Fish Audio key.
3. Paste the key only at that prompt. It should not appear on screen.
4. Leave the terminal open until it reports that generation is complete and the key has been removed.

The public Circuit Sentinel voice ID is stored in `tools/fish-state-audio.example.json`. The private API key is never stored in that file or GitHub. A local voice override may be saved as `tools/fish-state-audio.local.json`, which is ignored by Git. Output is written under `audio/circuit-sentinel/states/names/` and `audio/circuit-sentinel/states/capitals/`. State Quest automatically falls back to the selected device voice if a recording is unavailable.
