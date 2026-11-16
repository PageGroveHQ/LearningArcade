// Navigation between screens, page header, home screen and shared menu controls.
// Part of the Learning Arcade app. Files in app/ share one global scope and load in the order listed in index.html.
  function go(name) {
    if(name==="settings"&&!parentUnlocked){requestParentAccess(()=>go("settings"));return;}
    $$(".screen").forEach(s => s.classList.toggle("active", s.dataset.screen === name));
    window.scrollTo(0, 0); $("#app").focus({preventScroll:true});
    if (name === "home") renderHome();
    if (name === "states") renderStates();
    if (name === "spelling") renderSpelling();
    if (name === "math") renderMath();
    if (name === "poems") renderPoems();
    if (name === "story") renderStory();
    if (name === "chapter") renderChapter();
    if (name === "armory") renderArmory();
    if (name === "profiles") renderProfiles();
    if (name === "reports") renderReports();
    if (name === "study") renderStudyLab();
    if (name === "study-editor") renderStudyEditor();
    if (name === "homework") renderHomeworkBoard();
    if (name === "settings") renderSettings();
    if(name!=="session")setQuestionAudioDuck(false);
    setAudioScene(name === "session" ? (session?.silentMusic?"silent":"level") : "menu");
  }

  function head(title, subtitle, back = "home") {
    return `<div class="page-head"><button class="back" data-go="${back}" aria-label="Go back">‹</button><div class="page-title"><h1>${esc(title)}</h1>${subtitle ? `<p>${esc(subtitle)}</p>` : ""}</div><div class="menu-cast" aria-hidden="true"><img src="assets/characters/professor-volt.png" alt=""><img src="${sentinelArt()}" alt=""></div></div>`;
  }

  function renderHome() {
    syncActiveProfile();
    const profile=activeProfile(),stats=profile.stats;
    applyEquippedTheme(profile);
    const totals=Object.values(stats.subjects).reduce((sum,item)=>({answered:sum.answered+(item.answered||0),correct:sum.correct+(item.correct||0)}),{answered:0,correct:0});
    const accuracy=totals.answered?Math.round(totals.correct/totals.answered*100):0;
    const mission=MISSIONS.find(item=>item.id===profile.activeMissionId&&missionUnlocked(profile,item)&&(profile.missions[item.id]?.progress||0)<item.goal)||MISSIONS.find(item=>missionUnlocked(profile,item)&&(profile.missions[item.id]?.progress||0)<item.goal)||MISSIONS[MISSIONS.length-1];
    const progress=Math.min(profile.missions[mission.id]?.progress||0,mission.goal);
    $("#profileName").textContent=profile.name;
    $(".profile-meta small").textContent=profile.equippedCosmetics?.title||"ACTIVE PILOT";
    $("#profileInitial").textContent=profile.name.charAt(0).toUpperCase();
    $("#totalStars").textContent = stats.stars || 0;
    $("#homeSentinelSlot").innerHTML=sentinelVisual("idle",profile,"home-sentinel-visual",`${activeWeapon(profile).name} Circuit Sentinel`);
    $("#storyLaunchStatus").textContent=`${completedMissionCount(profile)}/20 systems restored · ${Object.keys(profile.bosses||{}).filter(id=>profile.bosses[id]?.defeated).length}/${ALL_BOSSES.length} bosses cleared`;
    $("#homeReport").innerHTML=`<div><p class="eyebrow">${esc(profile.name)} · ${completedMissionCount(profile)}/20 missions</p><h2>${totals.answered?`${accuracy}% accuracy across ${totals.answered} answers`:"Ready to restore the Learning Arcade"}</h2><p class="helper">Current mission: ${esc(mission.title)} · ${progress}/${mission.goal}</p></div><button class="report-orb" data-go="reports" aria-label="Open reports"><img src="assets/ui/energy-orb.png" alt=""><strong>${stats.rounds.length}</strong><small>rounds</small></button>`;
    const saved=profile.savedRound,card=$("#savedRoundCard");card.hidden=!saved;if(saved){card.innerHTML=`<section class="saved-round-card"><div><p class="eyebrow">MISSION ON HOLD</p><h2>${esc(saved.title||"Saved round")}</h2><p>Continue at question ${Math.min((saved.index||0)+1,saved.questions?.length||1)} of ${saved.questions?.length||1}${saved.remainingMs?` · ${Math.ceil(saved.remainingMs/60000)} min remaining`:''}</p></div><button class="primary" id="resumeSavedRound">Resume</button></section>`;$("#resumeSavedRound").onclick=resumeSavedRound;}
    renderWeeklyLoadout();
    renderHomeMode();
    $$('[data-home-mode]').forEach(button=>button.onclick=()=>{const next=button.dataset.homeMode;if(next==="parent"){requestParentAccess(()=>{homeMode="parent";renderHomeMode();},true);return;}parentUnlocked=false;homeMode="student";renderHomeMode();});
  }

  function renderWeeklyLoadout(){const root=$("#weeklyLoadoutCard");if(!root)return;const loadout=store.weeklyLoadout||defaults.weeklyLoadout,stateSet=store.statePresets.find(set=>set.id===loadout.stateSetId&&!set.archived),wordSet=store.spellingSets.find(set=>set.id===loadout.spellingSetId&&!set.archived)||activeSpellingSet(),poem=store.poems.find(item=>item.id===loadout.poemId&&!item.archived)||activePoem(),study=store.studySets.find(set=>set.id===loadout.studySetId&&!set.archived),mathLabel=loadout.mathProgram==='division'?'Division Drive':loadout.mathProgram==='extended'?'Extended Tables 11s–15s':'Core Fluency 0s–10s';root.innerHTML=`<div class="weekly-loadout-card"><div class="weekly-loadout-head"><div><p class="eyebrow">THIS WEEK'S TRAINING</p><h2>Weekly Learning Loadout</h2></div><span>READY</span></div><div class="weekly-loadout-grid"><button data-loadout-target="states"><b>⌖</b><span>Atlas Quest<small>${esc(stateSet?.name||'Current selection')}</small></span></button><button data-loadout-target="spelling"><b>Aa</b><span>Word Wizard<small>${esc(wordSet?.name||'Current words')}</small></span></button><button data-loadout-target="math"><b>×</b><span>Math Mayhem<small>${esc(mathLabel)}</small></span></button><button data-loadout-target="poems"><b>❝</b><span>Poem Power<small>${esc(poem?.title||'Current poem')}</small></span></button>${study?`<button data-loadout-target="study"><b>▤</b><span>Study Lab<small>${esc(study.title)}</small></span></button>`:''}</div></div>`;$$('[data-loadout-target]',root).forEach(button=>button.onclick=()=>{const target=button.dataset.loadoutTarget;if(target==='states'&&stateSet){store.statePrefs.region='Custom selection';store.statePrefs.customStates=[...stateSet.states];store.statePrefs.activePresetId=stateSet.id;}if(target==='spelling'&&wordSet)activateSpellingSet(wordSet.id);if(target==='math'){store.mathPrefs.sector=loadout.mathProgram==='division'?'divide':'multiply';store.mathPrefs.tables=loadout.mathProgram==='extended'?[11,12,13,14,15]:Array.from({length:11},(_,i)=>i);}if(target==='poems'&&poem)store.activePoemId=poem.id;save();go(target);});}

  function renderHomeMode(){const parent=homeMode==="parent";$$('[data-home-panel]').forEach(panel=>panel.hidden=panel.dataset.homePanel!==homeMode);$$('.dashboard-switch [data-home-mode]').forEach(button=>button.classList.toggle('selected',button.dataset.homeMode===homeMode));$(".home-cast").hidden=parent;$("#homeEyebrow").textContent=parent?"Parent Command":"Choose a quest";$("#homeTitle").textContent=parent?"What should we manage?":"What should we practice?";document.body.dataset.homeMode=homeMode;}

  function modeButtons(current) {
    return `<div class="option-grid" data-choice-group="mode">
      <button class="choice ${current === "parent" ? "selected" : ""}" data-value="parent">Parent swipe</button>
      <button class="choice ${current === "choice" ? "selected" : ""}" data-value="choice">Multiple choice</button>
      <button class="choice ${current === "type" ? "selected" : ""}" data-value="type">Fill in blank</button>
      <button class="choice ${current === "mixed" ? "selected" : ""}" data-value="mixed">Mix it up</button>
    </div>`;
  }

  function learnModePanel(enabled=false){return `<div class="panel learn-mode-panel"><div class="panel-title-row"><div><p class="label">Guided practice</p><h2>Learn Mode</h2></div><label class="settings-sound-toggle"><input type="checkbox" data-learn-toggle ${enabled?'checked':''}> Learn</label></div><p class="helper">Misses do not cost a life, the correct answer is explained, and the missed item returns once later in the round.</p></div>`;}
  function challengePanel(enabled=true){return `<div class="panel challenge-rule"><div class="panel-title-row"><div><p class="label">Mission rules</p><h2>Three-life challenge</h2></div><label class="settings-sound-toggle"><input type="checkbox" data-challenge-toggle ${enabled?'checked':''}> 3 lives</label></div><p class="helper">Turn this off for unlimited training. In challenge mode, three missed answers interrupt the run and recommend review.</p></div>`;}

  function wireChoices(root, onChange) {
    $$('[data-choice-group]', root).forEach(group => {
      group.addEventListener("click", e => {
        const btn = e.target.closest("[data-value]"); if (!btn) return;
        $$('[data-value]', group).forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); onChange(group.dataset.choiceGroup, btn.dataset.value);
      });
    });
  }
