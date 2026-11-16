// Saved data: defaults, loading and one-time migrations, save(), cloud bridge, shared runtime state.
// Part of the Learning Arcade app. Files in app/ share one global scope and load in the order listed in index.html.
  const defaults = {
    spelling: [],
    poems: window.DEFAULT_POEMS,
    stats: {stars: 0, days: {}},
    statePrefs: {region:"Northeast Region", division:"All", customStates:[], mode:"mixed", kind:"mixed", kinds:["facts","map","neighbors"], count:"10", challenge:true,learnMode:false},
    mathPrefs: {sector:"multiply",tables:[0,1,2,3,4,5,6,7,8,9,10], mode:"mixed", divisionMode:"fluency", count:"10", timer:"0", challenge:true,learnMode:false},
    spellingPrefs: {mode:"mixed", count:"max", challenge:true,learnMode:false},
    challengePrefs: {poems:true,study:true,poemLearnMode:false},
    voicePrefs: {source:"system", voiceURI:"", style:"bright"},
    audioPrefs: {enabled:true,master:.7,music:.45,effects:.8},
    studySets: [],
    spellingSets: [],
    activeSpellingSetId: "",
    statePresets: [],
    activePoemId: "",
    weeklyLoadout: {stateSetId:"",spellingSetId:"",mathProgram:"core",poemId:"",studySetId:""},
    smartReview: {enabled:false,count:10},
    parentControls: {pinHash:""},
    onboardingVersion: 0,
    backupMeta: {lastBackupAt:""},
    profiles: [],
    activeProfileId: ""
  };
  let store;
  try { store = {...defaults, ...JSON.parse(localStorage.getItem(STORE) || localStorage.getItem(OLD_STORE) || "{}")}; }
  catch { store = structuredClone(defaults); }
  store.stats ||= {stars:0, days:{}}; store.stats.days ||= {};
  if (!Array.isArray(store.profiles) || !store.profiles.length) store.profiles = [createProfile("Player 1",store.stats)];
  store.profiles.forEach(profile=>{
    profile.name=String(profile.name||"Player").trim()||"Player";
    profile.stats={...blankStats(),...(profile.stats||{})};
    profile.stats.days||={};profile.stats.subjects||={};profile.stats.skills||={};profile.stats.mistakes||={};profile.stats.assessments||={};
    profile.stats.rounds=Array.isArray(profile.stats.rounds)?profile.stats.rounds:[];profile.missions||={};
    profile.inventory=Array.isArray(profile.inventory)?[...new Set(["core",...profile.inventory.filter(id=>WEAPONS.some(weapon=>weapon.id===id))])]:["core"];
    profile.equippedWeapon=profile.inventory.includes(profile.equippedWeapon)&&WEAPONS.some(weapon=>weapon.id===profile.equippedWeapon)?profile.equippedWeapon:"core";
    profile.seenChapters=Array.isArray(profile.seenChapters)?profile.seenChapters.filter(id=>ALL_CHAPTERS.some(chapter=>chapter.id===id)):[];
    profile.bosses=profile.bosses&&typeof profile.bosses==="object"?profile.bosses:{};
    profile.homeworkTasks=Array.isArray(profile.homeworkTasks)?profile.homeworkTasks:[];
    profile.homeworkRewards=Array.isArray(profile.homeworkRewards)?profile.homeworkRewards:[];
    profile.savedRound=profile.savedRound&&typeof profile.savedRound==="object"?profile.savedRound:null;
    profile.lastRoundUndo=profile.lastRoundUndo&&typeof profile.lastRoundUndo==="object"?profile.lastRoundUndo:null;
    // Only the newest rounds keep their question-by-question detail; older receipts held a second copy of every round.
    profile.stats.rounds.slice(0,-ROUND_DETAIL_LIMIT).forEach(round=>{delete round.answers;});
    if(Array.isArray(profile.lastRoundUndo?.before?.stats?.rounds)){delete profile.lastRoundUndo.before.stats.rounds;profile.lastRoundUndo.before.droppedRounds||=[];}
    profile.consumables=profile.consumables&&typeof profile.consumables==="object"?profile.consumables:{};
    SUPPORT_ITEMS.forEach(item=>profile.consumables[item.id]=Math.max(0,Number(profile.consumables[item.id])||0));
    profile.cosmeticsOwned=Array.isArray(profile.cosmeticsOwned)?profile.cosmeticsOwned.filter(id=>COSMETICS.some(item=>item.id===id)):[];
    profile.equippedCosmetics=profile.equippedCosmetics&&typeof profile.equippedCosmetics==="object"?profile.equippedCosmetics:{};
    profile.tracksOwned=Array.isArray(profile.tracksOwned)?profile.tracksOwned.filter(id=>MUSIC_TRACKS.some(track=>track.id===id)):[];
    profile.equippedTrack=profile.tracksOwned.includes(profile.equippedTrack)?profile.equippedTrack:"";
    if(!MISSIONS.some(m=>m.id===profile.activeMissionId)) profile.activeMissionId="state-scan-1";
  });
  if (!store.profiles.some(profile=>profile.id===store.activeProfileId)) store.activeProfileId=store.profiles[0].id;
  const activeProfile = () => store.profiles.find(profile=>profile.id===store.activeProfileId) || store.profiles[0];
  const activeWeapon = (profile=activeProfile()) => WEAPONS.find(weapon=>weapon.id===profile.equippedWeapon) || WEAPONS[0];
  const sentinelArt = (pose="idle",profile=activeProfile()) => `assets/characters/skins/${activeWeapon(profile).id}-${pose}.png`;
  const rewardSlotKey=slot=>slot==="trim"?"rewardTrim":"rewardAura";
  function equippedReward(profile=activeProfile(),slot="aura"){
    const id=profile.equippedCosmetics?.[rewardSlotKey(slot)];
    return REWARDS.find(reward=>reward.id===id&&reward.slot===slot&&completedMissionCount(profile)>=reward.at);
  }
  function sentinelVisual(pose="idle",profile=activeProfile(),className="",alt="Circuit Sentinel"){
    const trim=equippedReward(profile,"trim"),aura=equippedReward(profile,"aura");
    return `<span class="sentinel-visual ${className}" data-reward-trim="${esc(trim?.id||'none')}" data-reward-aura="${esc(aura?.id||'none')}">${aura?`<img class="sentinel-reward-aura" src="${aura.art}" alt="">`:''}<img class="sentinel-character" src="${sentinelArt(pose,profile)}" alt="${esc(alt)}">${trim?`<img class="sentinel-reward-trim" src="${trim.art}" alt="">`:''}</span>`;
  }
  function applyEquippedTheme(profile=activeProfile()){const weapon=activeWeapon(profile),equipped=profile.equippedCosmetics||{};document.body.dataset.form=weapon.id;document.body.dataset.pilotFrame=equipped.frame||"none";document.body.dataset.orbTrail=equipped.trail||"none";document.body.dataset.arcadeTheme=equipped.theme||"default";document.body.style.setProperty("--form-color",weapon.color);document.body.style.setProperty("--form-glow",weapon.glow);const title=COSMETICS.find(item=>item.type==="title"&&item.value===equipped.title)?.value||"";document.body.dataset.pilotTitle=title;}
  const syncActiveProfile = () => {store.stats=activeProfile().stats;};
  syncActiveProfile();
  applyEquippedTheme();
  store.poems = Array.isArray(store.poems) && store.poems.length ? store.poems : window.DEFAULT_POEMS;
  store.spelling = Array.isArray(store.spelling) ? store.spelling : defaults.spelling;
  if (!store.statePrefs || !["All 50","Northeast Region","Midwest Region","South Region","West Region","Custom selection"].includes(store.statePrefs.region)) store.statePrefs = {...defaults.statePrefs};
  store.statePrefs = {...defaults.statePrefs, ...store.statePrefs};
  store.statePrefs.customStates = Array.isArray(store.statePrefs.customStates) ? store.statePrefs.customStates.filter(abbr=>STATE_DATA.some(state=>state.abbr===abbr)) : [];
  store.mathPrefs = {...defaults.mathPrefs, ...(store.mathPrefs || {})};
  store.mathPrefs.tables=Array.isArray(store.mathPrefs.tables)?[...new Set(store.mathPrefs.tables.map(Number).filter(value=>value>=0&&value<=20))]:[0,1,2,3,4,5,6,7,8,9,10];
  if(!store.mathPrefs.tables.length)store.mathPrefs.tables=[0,1,2,3,4,5,6,7,8,9,10];
  store.spellingPrefs = {...defaults.spellingPrefs, ...(store.spellingPrefs || {})};
  store.challengePrefs = {...defaults.challengePrefs, ...(store.challengePrefs || {})};
  store.voicePrefs = {...defaults.voicePrefs, ...(store.voicePrefs || {})};
  store.studySets = Array.isArray(store.studySets) ? store.studySets : [];
  store.studySets.forEach(set=>set.archived=!!set.archived);
  store.statePresets = Array.isArray(store.statePresets) ? store.statePresets : [];
  store.statePresets.forEach(set=>set.archived=!!set.archived);
  store.spellingSets=Array.isArray(store.spellingSets)?store.spellingSets:[];
  if(!store.spellingSets.length)store.spellingSets=[{id:`word-set-${Date.now()}`,name:"Current Word List",words:[...store.spelling],archived:false}];
  store.spellingSets.forEach(set=>{set.words=Array.isArray(set.words)?set.words:[];set.archived=!!set.archived;});
  if(!store.spellingSets.some(set=>set.id===store.activeSpellingSetId&&!set.archived))store.activeSpellingSetId=store.spellingSets.find(set=>!set.archived)?.id||store.spellingSets[0].id;
  const initialWordSet=store.spellingSets.find(set=>set.id===store.activeSpellingSetId)||store.spellingSets[0];store.spelling=[...(initialWordSet?.words||store.spelling)];
  store.poems.forEach(poem=>poem.archived=!!poem.archived);
  if(!store.poems.some(poem=>poem.id===store.activePoemId&&!poem.archived))store.activePoemId=store.poems.find(poem=>!poem.archived)?.id||store.poems[0]?.id||"";
  store.weeklyLoadout={...defaults.weeklyLoadout,...(store.weeklyLoadout||{})};
  const legacyKinds=store.statePrefs.kind&&store.statePrefs.kind!=="mixed"?[store.statePrefs.kind]:defaults.statePrefs.kinds;
  store.statePrefs.kinds=Array.isArray(store.statePrefs.kinds)&&store.statePrefs.kinds.length?[...new Set(store.statePrefs.kinds)]:legacyKinds;
  store.smartReview = {...defaults.smartReview, ...(store.smartReview || {})};
  store.parentControls = {...defaults.parentControls, ...(store.parentControls || {})};
  store.onboardingVersion = Number(store.onboardingVersion)||0;
  store.backupMeta = {...defaults.backupMeta, ...(store.backupMeta || {})};
  const savedAudioPrefs=store.audioPrefs||{};
  store.audioPrefs = {...defaults.audioPrefs, ...savedAudioPrefs};
  if(!Object.prototype.hasOwnProperty.call(savedAudioPrefs,"master"))store.audioPrefs.master=Number.isFinite(Number(savedAudioPrefs.volume))?Number(savedAudioPrefs.volume):defaults.audioPrefs.master;
  store.audioPrefs.master=Math.max(0,Math.min(1,Number(store.audioPrefs.master)));store.audioPrefs.music=Math.max(0,Math.min(1,Number(store.audioPrefs.music)));store.audioPrefs.effects=Math.max(0,Math.min(1,Number(store.audioPrefs.effects)));
  const sameWords = (a,b) => a.length === b.length && a.every((word,index)=>norm(word)===norm(b[index]));
  if (!store.audioContentV1) {
    if (sameWords(store.spelling, ORIGINAL_SPELLING)) store.spelling = [...BUNDLED_SPELLING];
    const crocodile = window.DEFAULT_POEMS.find(poem=>poem.id==="the-crocodile");
    if (crocodile && !store.poems.some(poem=>poem.id===crocodile.id)) store.poems.unshift(crocodile);
    store.audioContentV1 = true;
    saveSoon();
  }
  if (!store.audioContentV2) {
    if (sameWords(store.spelling, ORIGINAL_SPELLING)) store.spelling = [...BUNDLED_SPELLING];
    if (!store.voicePrefs.source) store.voicePrefs.source = "circuit-sentinel";
    store.spellingPrefs.count = "max";
    store.audioContentV2 = true;
    saveSoon();
  }
  if (!store.audioContentV3) {
    const crocodile=store.poems.find(poem=>poem.id==="the-crocodile");
    if(crocodile){crocodile.text=crocodile.text.replace(/ev[’']ry/gi,"every");crocodile.audio="audio/circuit-sentinel/poems/the-crocodile.mp3";}
    store.audioContentV3=true;
    saveSoon();
  }
  if (!store.audioContentV4) {
    const currentSetId="word-set-circuit-sentinel-current";
    if(store.voicePrefs.source!=="system"&&!window.AUDIO_PACKS?.[store.voicePrefs.source])store.voicePrefs.source="circuit-sentinel";
    let currentSet=store.spellingSets.find(set=>set.id===currentSetId);
    if(!currentSet){
      currentSet={id:currentSetId,name:"Circuit Sentinel — Current Words",words:[...BUNDLED_SPELLING],archived:false};
      store.spellingSets.push(currentSet);
    }else{
      currentSet.name="Circuit Sentinel — Current Words";
      currentSet.words=[...BUNDLED_SPELLING];
      currentSet.archived=false;
    }
    const activeSet=store.spellingSets.find(set=>set.id===store.activeSpellingSetId);
    const emptyOrBundledDefault=!activeSet||(!activeSet.words.length&&/current word list/i.test(activeSet.name||""));
    if(emptyOrBundledDefault){
      if(activeSet&&activeSet.id!==currentSetId)store.spellingSets=store.spellingSets.filter(set=>set.id!==activeSet.id);
      store.activeSpellingSetId=currentSetId;
      store.spelling=[...BUNDLED_SPELLING];
    }
    store.audioContentV4=true;
    saveSoon();
  }
  if(!store.october2026WordBanksV1){
    (window.BUNDLED_WORD_SETS||[]).forEach(source=>{if(!store.spellingSets.some(set=>set.id===source.id))store.spellingSets.push({...structuredClone(source),archived:false});});
    store.october2026WordBanksV1=true;
    saveSoon();
  }
  if(!store.correctedSpanishOctober2026V1){
    const source=window.BUNDLED_WORD_SETS?.find(set=>set.id==="spanish-spelling-2026-10-15"),existing=store.spellingSets.find(set=>set.id===source?.id);
    if(source){if(existing)Object.assign(existing,structuredClone(source),{archived:false});else store.spellingSets.push({...structuredClone(source),archived:false});if(store.activeSpellingSetId===source.id)store.spelling=[...source.words];}
    const obsolete=q=>String(q.audio||"").startsWith("audio/circuit-sentinel/spelling/spanish/");
    store.profiles.forEach(profile=>{[profile.stats.mistakes,profile.lastRoundUndo?.before?.stats?.mistakes].filter(Boolean).forEach(mistakes=>Object.entries(mistakes).forEach(([key,q])=>{if(obsolete(q))delete mistakes[key];}));if(profile.savedRound?.questions?.some(obsolete)){if(profile.savedRound.inventoryBefore)profile.consumables=structuredClone(profile.savedRound.inventoryBefore);profile.savedRound=null;}});
    store.correctedSpanishOctober2026V1=true;saveSoon();
  }
  if(!store.visualRewardsV1){
    store.profiles.forEach(profile=>{
      const completed=MISSIONS.filter(mission=>(profile.missions[mission.id]?.progress||0)>=mission.goal).length;
      ["trim","aura"].forEach(slot=>{
        const key=rewardSlotKey(slot);
        if(!profile.equippedCosmetics[key]){
          const newest=REWARDS.filter(reward=>reward.slot===slot&&completed>=reward.at).at(-1);
          if(newest)profile.equippedCosmetics[key]=newest.id;
        }
      });
    });
    store.visualRewardsV1=true;
    saveSoon();
  }
  const legacyBrandedPoem=store.poems.find(poem=>poem.author==="Asher's Learning Arcade");
  if(legacyBrandedPoem){store.poems.forEach(poem=>{if(poem.author==="Asher's Learning Arcade")poem.author="Learning Arcade";});saveSoon();}
  const LOCAL_CHANGED="learning-arcade-local-changed-at-v1",DEVICE_ID="learning-arcade-device-id-v1";
  // store.stats is only a live alias of the active profile's stats, so it is left out of every saved copy.
  const persistable = () => ({...store,stats:undefined});
  let saveFailed = false;
  const save = () => {
    try{localStorage.setItem(STORE,JSON.stringify(persistable()));localStorage.setItem(LOCAL_CHANGED,String(Date.now()));saveFailed=false;document.body.dataset.saveFailed="false";}
    catch(error){console.error("Learning Arcade could not save",error);document.body.dataset.saveFailed="true";if(!saveFailed){saveFailed=true;setTimeout(()=>toast("This device's storage is full. Download a backup in Parent Setup."),0);}return false;}
    window.LearningArcadeCloud?.schedulePush?.();return true;
  };
  // Defer the lookup as well as the call. Fresh installs reach the content
  // migrations above before the `save` constant has finished initializing.
  function saveSoon(){setTimeout(()=>save(),0);}
  function freshData(){const fresh=structuredClone(defaults),profile=createProfile("Player 1");fresh.poems=structuredClone(window.DEFAULT_POEMS||[]);fresh.profiles=[profile];fresh.activeProfileId=profile.id;return fresh;}
  function clearLocalData(){[STORE,OLD_STORE,LOCAL_CHANGED,DEVICE_ID,"learning-arcade-cloud-meta-v1"].forEach(key=>localStorage.removeItem(key));location.hash="";location.reload();}
  window.LearningArcadeDataBridge={exportData:()=>JSON.parse(JSON.stringify(persistable())),hasProgress:()=>store.profiles.some(profile=>profile.stats.rounds.length||Object.keys(profile.stats.subjects||{}).length||profile.homeworkTasks.length)||store.studySets.length>0||store.statePresets.length>0,freshData,clearLocalData,importData:data=>{if(!data||!Array.isArray(data.profiles)||!data.profiles.length)throw new Error("Invalid cloud save");localStorage.setItem(STORE,JSON.stringify({...defaults,...data}));sessionStorage.setItem(SKIP_INTRO_ONCE,"1");location.reload();},changedAt:()=>Number(localStorage.getItem(LOCAL_CHANGED))||0,markSynced:timestamp=>localStorage.setItem(LOCAL_CHANGED,String(timestamp||Date.now())),deviceId:()=>{let id=localStorage.getItem(DEVICE_ID);if(!id){id=`device-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;localStorage.setItem(DEVICE_ID,id);}return id;}};
  let session = null;
  let editingStudySetId = "";
  let homeworkWeekOffset = 0;
  let editingHomeworkId = "";
  let parentUnlocked = false;
  let homeMode = "student";
  let pendingOnboardingPin = "";
  let pendingParentAction = null;
  let activeChapterId = "blackout";
  let chapterStep = 0;
  let armoryPose = "idle";
  let mapTopology = null;
