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
- A reusable Study Lab for parent-created flashcards, multiple choice, typed answers, and mixed practice
- CSV import/export for Study Lab sets, with a downloadable weekly-use template
- A per-profile Monday-through-Sunday Mission Board with completion, parent verification, and optional weekly rewards
- Named State Quest selections for repeatedly practicing a teacher's current group of states
- Optional, fully reversible Smart Review rounds based on unrepaired mistakes
- Optional local parent PIN controls for editing tools, with practice and the Orb Shop left open
- Versioned full-app backups with restore previews and a two-week backup reminder
- Separate master, music, and sound-effect controls powered through a mobile-safe audio mixer
- A Circuit Sentinel home-screen icon sized for iPhone and installable-app use

Everything is static and can be hosted on GitHub Pages. Practice data is stored only in the browser on the current device.

## Study Lab imports

The included `templates/study-lab-import-template.csv` opens in Excel, Numbers, or Google Sheets. Each row is one question. `set_title`, `question`, and `answer` are required; optional alternate answers and multiple-choice distractors use semicolons inside their cells. Multiple rows with the same set title become one reusable study set.

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
- Sentinel forms are cosmetic rewards and do not change question difficulty or scoring.

The armory and story assets are original Circuit Sentinel designs created for this project.
