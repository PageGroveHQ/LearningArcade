(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const esc = (value = "") => String(value).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const shuffle = arr => [...arr].sort(() => Math.random() - .5);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const norm = value => String(value).trim().toLowerCase().replace(/[.?!,'’]/g, "").replace(/\s+/g, " ");
  const today = () => new Date().toISOString().slice(0, 10);
  const STORE = "learning-arcade-v2";
  const OLD_STORE = "asher-learning-arcade-v1";
  const ORIGINAL_SPELLING = ["because", "friend", "school", "people", "favorite", "different", "thought", "through"];
  const BUNDLED_SPELLING = window.BUNDLED_SPELLING_WORDS || [];
  const blankStats = () => ({stars:0,days:{},subjects:{},rounds:[]});
  const createProfile = (name="Player 1", stats=blankStats()) => ({id:`profile-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,name,stats,missions:{},activeMissionId:"state-scan"});
  const MISSIONS = [
    {id:"state-scan",title:"Power the State Scanner",story:"Professor Volt needs geographic coordinates to restart the navigation deck.",subject:"states",goal:10,target:"states",reward:5},
    {id:"word-vault",title:"Decode the Word Vault",story:"Spell ten signal words to open the encrypted archive.",subject:"spelling",goal:10,target:"spelling",reward:5},
    {id:"math-core",title:"Repair the Multiplication Core",story:"Solve twenty multiplication facts to stabilize the arcade reactor.",subject:"math",goal:20,target:"math",reward:8},
    {id:"poetry-signal",title:"Restore the Poetry Signal",story:"Complete five poem activities so Circuit Sentinel can transmit the final message.",subject:"poems",goal:5,target:"poems",reward:8}
  ];
  const defaults = {
    spelling: BUNDLED_SPELLING,
    poems: window.DEFAULT_POEMS,
    stats: {stars: 0, days: {}},
    statePrefs: {region:"Northeast Region", division:"All", mode:"mixed", kind:"mixed", count:"10"},
    mathPrefs: {tables:[0,1,2,3,4,5,6,7,8,9], mode:"mixed", count:"10", timer:"0"},
    spellingPrefs: {mode:"mixed", count:"max"},
    voicePrefs: {source:"circuit-sentinel", voiceURI:"", style:"bright"},
    audioPrefs: {enabled:true,volume:.45},
    profiles: [],
    activeProfileId: ""
  };
  let store;
  try { store = {...defaults, ...JSON.parse(localStorage.getItem(STORE) || localStorage.getItem(OLD_STORE) || "{}")}; }
  catch { store = structuredClone(defaults); }
  store.stats ||= {stars:0, days:{}}; store.stats.days ||= {};
  if (!Array.isArray(store.profiles) || !store.profiles.length) store.profiles = [createProfile("Player 1",store.stats)];
  store.profiles.forEach(profile=>{profile.name=String(profile.name||"Player").trim()||"Player";profile.stats={...blankStats(),...(profile.stats||{})};profile.stats.days||={};profile.stats.subjects||={};profile.stats.rounds=Array.isArray(profile.stats.rounds)?profile.stats.rounds:[];profile.missions||={};profile.activeMissionId||="state-scan";});
  if (!store.profiles.some(profile=>profile.id===store.activeProfileId)) store.activeProfileId=store.profiles[0].id;
  const activeProfile = () => store.profiles.find(profile=>profile.id===store.activeProfileId) || store.profiles[0];
  const syncActiveProfile = () => {store.stats=activeProfile().stats;};
  syncActiveProfile();
  store.poems = Array.isArray(store.poems) && store.poems.length ? store.poems : window.DEFAULT_POEMS;
  store.spelling = Array.isArray(store.spelling) ? store.spelling : defaults.spelling;
  if (!store.statePrefs || !["All 50","Northeast Region","Midwest Region","South Region","West Region"].includes(store.statePrefs.region)) store.statePrefs = {...defaults.statePrefs};
  store.mathPrefs = {...defaults.mathPrefs, ...(store.mathPrefs || {})};
  store.spellingPrefs = {...defaults.spellingPrefs, ...(store.spellingPrefs || {})};
  store.voicePrefs = {...defaults.voicePrefs, ...(store.voicePrefs || {})};
  store.audioPrefs = {...defaults.audioPrefs, ...(store.audioPrefs || {})};
  const sameWords = (a,b) => a.length === b.length && a.every((word,index)=>norm(word)===norm(b[index]));
  if (!store.audioContentV1) {
    if (sameWords(store.spelling, ORIGINAL_SPELLING)) store.spelling = [...BUNDLED_SPELLING];
    const crocodile = window.DEFAULT_POEMS.find(poem=>poem.id==="the-crocodile");
    if (crocodile && !store.poems.some(poem=>poem.id===crocodile.id)) store.poems.unshift(crocodile);
    store.audioContentV1 = true;
    saveSoon();
  }
  if (!store.audioContentV2) {
    const earlierWords = window.AUDIO_PACKS?.["cartoon-dog-heeler"]?.words || [];
    if (sameWords(store.spelling, earlierWords) || sameWords(store.spelling, ORIGINAL_SPELLING)) store.spelling = [...BUNDLED_SPELLING];
    if (!store.voicePrefs.source || store.voicePrefs.source === "cartoon-dog-heeler") store.voicePrefs.source = "william-cypher";
    store.spellingPrefs.count = "max";
    store.audioContentV2 = true;
    saveSoon();
  }
  if (!store.audioContentV3) {
    const crocodile=store.poems.find(poem=>poem.id==="the-crocodile");
    if(crocodile){crocodile.text=crocodile.text.replace(/ev[’']ry/gi,"every");crocodile.audio="audio/circuit-sentinel/poems/the-crocodile.mp3";}
    store.voicePrefs.source="circuit-sentinel";
    store.audioContentV3=true;
    saveSoon();
  }
  const legacyBrandedPoem=store.poems.find(poem=>poem.author==="Asher's Learning Arcade");
  if(legacyBrandedPoem){store.poems.forEach(poem=>{if(poem.author==="Asher's Learning Arcade")poem.author="Learning Arcade";});saveSoon();}
  const save = () => localStorage.setItem(STORE, JSON.stringify(store));
  function saveSoon(){setTimeout(()=>localStorage.setItem(STORE,JSON.stringify(store)),0);}
  let session = null;
  let mapTopology = null;
  let availableVoices = [];
  let activeAudio = null;
  let audioUnlocked = false;
  let audioScene = "menu";
  let musicDucked = false;
  let openingPlayed = false;
  const MUSIC = {menu:"audio/interface/game-select.mp3",level:"audio/interface/level-play.mp3",finished:"audio/interface/round-finished.mp3"};
  const CUES = {opening:"audio/interface/professor-opening.mp3",start:"audio/interface/sentinel-start.mp3"};
  const backgroundMusic = new Audio(); backgroundMusic.loop=true; backgroundMusic.preload="auto";
  const answerSound = new Audio("audio/interface/answer-selected.wav"); answerSound.preload="auto";
  const voiceCue = new Audio(); voiceCue.preload="auto";

  function masterVolume(){return Math.max(0,Math.min(1,Number(store.audioPrefs.volume)||0));}
  function applySoundVolumes(){backgroundMusic.volume=masterVolume()*(musicDucked?.16:1);answerSound.volume=masterVolume();voiceCue.volume=masterVolume();if(activeAudio)activeAudio.volume=masterVolume();}
  function setAudioScene(scene){audioScene=scene;document.body.dataset.audioScene=scene;document.body.dataset.soundEnabled=String(store.audioPrefs.enabled);const source=MUSIC[scene]||MUSIC.menu;if(backgroundMusic.getAttribute("src")!==source){backgroundMusic.src=source;backgroundMusic.load();}applySoundVolumes();if(!store.audioPrefs.enabled||!audioUnlocked){backgroundMusic.pause();return;}backgroundMusic.play().catch(()=>{});}
  function playAnswerSound(){if(!store.audioPrefs.enabled||!audioUnlocked)return;answerSound.currentTime=0;answerSound.volume=masterVolume();answerSound.play().catch(()=>{});}
  function duckMusic(duck=true){musicDucked=duck;applySoundVolumes();}
  function playVoiceCue(source){if(!store.audioPrefs.enabled||!audioUnlocked)return;voiceCue.pause();voiceCue.src=source;voiceCue.currentTime=0;duckMusic(true);voiceCue.onended=()=>duckMusic(false);voiceCue.onerror=()=>duckMusic(false);voiceCue.play().catch(()=>duckMusic(false));}
  function playStartCue(){playVoiceCue(CUES.start);}
  function wireSoundControls(){const enabled=$("#soundEnabled"),volume=$("#soundVolume");enabled.checked=store.audioPrefs.enabled;volume.value=Math.round(masterVolume()*100);enabled.onchange=()=>{audioUnlocked=true;store.audioPrefs.enabled=enabled.checked;if(!enabled.checked){activeAudio?.pause();voiceCue.pause();window.speechSynthesis?.cancel();duckMusic(false);}save();setAudioScene(audioScene);if(enabled.checked&&!openingPlayed&&$("[data-screen='home']").classList.contains("active")){openingPlayed=true;playVoiceCue(CUES.opening);}};volume.oninput=()=>{audioUnlocked=true;store.audioPrefs.volume=Number(volume.value)/100;applySoundVolumes();save();if(store.audioPrefs.enabled&&backgroundMusic.paused)setAudioScene(audioScene);};document.addEventListener("pointerdown",()=>{audioUnlocked=true;setAudioScene(audioScene);if(store.audioPrefs.enabled&&!openingPlayed&&$("[data-screen='home']").classList.contains("active")){openingPlayed=true;playVoiceCue(CUES.opening);}},{once:true,capture:true});}

  function refreshVoices() { availableVoices = window.speechSynthesis?.getVoices?.().filter(v => /^en([-_]|$)/i.test(v.lang)) || []; }
  refreshVoices();
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = refreshVoices;

  function speakText(text) {
    if(!store.audioPrefs.enabled)return toast("Turn sound on to hear audio");
    if (activeAudio) { activeAudio.pause(); activeAudio = null; }
    if (!window.speechSynthesis) return toast("Speech is not available on this device");
    refreshVoices(); speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const chosen = availableVoices.find(v => v.voiceURI === store.voicePrefs.voiceURI) || availableVoices.find(v => /natural|premium|enhanced/i.test(v.name)) || availableVoices[0];
    if (chosen) utterance.voice = chosen;
    const styles = {natural:{rate:.92,pitch:1},bright:{rate:.94,pitch:1.18},hero:{rate:1.04,pitch:1.06},calm:{rate:.82,pitch:.94}};
    Object.assign(utterance, styles[store.voicePrefs.style] || styles.bright);
    duckMusic(true);utterance.onend=()=>duckMusic(false);utterance.onerror=()=>duckMusic(false);speechSynthesis.speak(utterance);
  }

  function recordedAudioFor(text) {
    return window.AUDIO_PACKS?.[store.voicePrefs.source]?.spelling?.[norm(text)] || "";
  }

  function playPracticeAudio(text, suppliedAudio="", poemId="") {
    if(!store.audioPrefs.enabled)return toast("Turn sound on to hear audio");
    const pack = window.AUDIO_PACKS?.[store.voicePrefs.source];
    const fallbackPack=window.AUDIO_PACKS?.["william-cypher"];
    const audioPath = pack ? (poemId ? pack.poems?.[poemId] || suppliedAudio : recordedAudioFor(text)||fallbackPack?.spelling?.[norm(text)]||suppliedAudio) : suppliedAudio;
    if (!audioPath) { speakText(text); return; }
    window.speechSynthesis?.cancel();
    if (activeAudio) activeAudio.pause();
    activeAudio = new Audio(audioPath);
    activeAudio.volume=masterVolume();duckMusic(true);activeAudio.onended=()=>duckMusic(false);activeAudio.onerror=()=>duckMusic(false);activeAudio.play().catch(()=>{duckMusic(false);speakText(text);});
  }

  function voicePanelMarkup() {
    refreshVoices();
    const packs=Object.entries(window.AUDIO_PACKS||{}).map(([id,pack])=>`<option value="${esc(id)}" ${store.voicePrefs.source===id?'selected':''}>${esc(pack.label)} recordings</option>`).join("");
    return `<div class="panel voice-panel"><p class="label">Reading voice</p><div class="field"><label>Audio source</label><select data-audio-source>${packs}<option value="system" ${store.voicePrefs.source==='system'?'selected':''}>Device voice</option></select></div><div class="device-voice-options" ${store.voicePrefs.source==='system'?'':'hidden'}><div class="field"><label>Device voice</label><select data-voice-select><option value="">Best available voice</option>${availableVoices.map(v=>`<option value="${esc(v.voiceURI)}" ${store.voicePrefs.voiceURI===v.voiceURI?'selected':''}>${esc(v.name)} (${esc(v.lang)})</option>`).join("")}</select></div><div class="field"><label>Voice style</label><select data-voice-style><option value="bright" ${store.voicePrefs.style==='bright'?'selected':''}>Bright explorer</option><option value="hero" ${store.voicePrefs.style==='hero'?'selected':''}>Upbeat hero</option><option value="calm" ${store.voicePrefs.style==='calm'?'selected':''}>Calm storyteller</option><option value="natural" ${store.voicePrefs.style==='natural'?'selected':''}>Natural</option></select></div></div><button class="secondary" data-test-voice>Hear a sample</button><p class="helper">A recorded pack plays its matching words and poem. Other text automatically uses the selected device voice.</p></div>`;
  }
  function wireVoicePanel(root) {
    $('[data-audio-source]',root)?.addEventListener('change',e=>{store.voicePrefs.source=e.target.value;save();root.querySelector('.device-voice-options').hidden=e.target.value!=="system";});
    $('[data-voice-select]',root)?.addEventListener('change',e=>{store.voicePrefs.voiceURI=e.target.value;save();});
    $('[data-voice-style]',root)?.addEventListener('change',e=>{store.voicePrefs.style=e.target.value;save();});
    $('[data-test-voice]',root)?.addEventListener('click',()=>{const sample=window.AUDIO_PACKS?.[store.voicePrefs.source]?.sampleWord||"Ready for a learning adventure? Let's go!";playPracticeAudio(sample);});
  }

  function toast(message) {
    const el = $("#toast"); el.textContent = message; el.classList.add("show");
    clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("show"), 1800);
  }

  function go(name) {
    $$(".screen").forEach(s => s.classList.toggle("active", s.dataset.screen === name));
    window.scrollTo(0, 0); $("#app").focus({preventScroll:true});
    if (name === "home") renderHome();
    if (name === "states") renderStates();
    if (name === "spelling") renderSpelling();
    if (name === "math") renderMath();
    if (name === "poems") renderPoems();
    if (name === "story") renderStory();
    if (name === "profiles") renderProfiles();
    if (name === "reports") renderReports();
    if (name === "settings") renderSettings();
    setAudioScene(name === "session" ? "level" : "menu");
  }

  function head(title, subtitle, back = "home") {
    return `<div class="page-head"><button class="back" data-go="${back}" aria-label="Go back">‹</button><div class="page-title"><h1>${esc(title)}</h1>${subtitle ? `<p>${esc(subtitle)}</p>` : ""}</div><div class="menu-cast" aria-hidden="true"><img src="assets/characters/professor-volt.png" alt=""><img src="assets/characters/circuit-sentinel-action.png" alt=""></div></div>`;
  }

  function renderHome() {
    syncActiveProfile();
    const profile=activeProfile(),stats=profile.stats;
    const totals=Object.values(stats.subjects).reduce((sum,item)=>({answered:sum.answered+(item.answered||0),correct:sum.correct+(item.correct||0)}),{answered:0,correct:0});
    const accuracy=totals.answered?Math.round(totals.correct/totals.answered*100):0;
    const mission=MISSIONS.find(item=>(profile.missions[item.id]?.progress||0)<item.goal)||MISSIONS[MISSIONS.length-1];
    const progress=Math.min(profile.missions[mission.id]?.progress||0,mission.goal);
    $("#profileName").textContent=profile.name;
    $("#profileInitial").textContent=profile.name.charAt(0).toUpperCase();
    $("#totalStars").textContent = stats.stars || 0;
    $("#homeReport").innerHTML=`<div><p class="eyebrow">${esc(profile.name)}'s learning record</p><h2>${totals.answered?`${accuracy}% accuracy across ${totals.answered} answers`:"Ready to begin a learning record"}</h2><p class="helper">Current mission: ${esc(mission.title)} · ${progress}/${mission.goal}</p></div><button class="report-orb" data-go="reports" aria-label="Open reports"><img src="assets/ui/energy-orb.png" alt=""><strong>${stats.rounds.length}</strong><small>rounds</small></button>`;
  }

  function modeButtons(current) {
    return `<div class="option-grid" data-choice-group="mode">
      <button class="choice ${current === "parent" ? "selected" : ""}" data-value="parent">Parent swipe</button>
      <button class="choice ${current === "choice" ? "selected" : ""}" data-value="choice">Multiple choice</button>
      <button class="choice ${current === "type" ? "selected" : ""}" data-value="type">Fill in blank</button>
      <button class="choice ${current === "mixed" ? "selected" : ""}" data-value="mixed">Mix it up</button>
    </div>`;
  }

  function wireChoices(root, onChange) {
    $$('[data-choice-group]', root).forEach(group => {
      group.addEventListener("click", e => {
        const btn = e.target.closest("[data-value]"); if (!btn) return;
        $$('[data-value]', group).forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); onChange(group.dataset.choiceGroup, btn.dataset.value);
      });
    });
  }

  function renderStates() {
    const p = store.statePrefs || defaults.statePrefs;
    const regions = ["All 50","Northeast Region","Midwest Region","South Region","West Region"];
    const divisions = p.region === "All 50" ? [] : [...new Set(STATE_DATA.filter(s=>s.region===p.region).map(s=>s.division))];
    if (p.division !== "All" && !divisions.includes(p.division)) p.division = "All";
    const setSize = activeStates(p.region,p.division).length;
    const maxCount = stateQuestionBank(activeStates(p.region,p.division),p.kind).length;
    if (p.count !== 'max' && +p.count > maxCount) { p.count = 'max'; store.statePrefs = p; save(); }
    $("#statesView").innerHTML = `${head("State Quest","Connect every state, capital, abbreviation, and shape")}
      <div class="panel"><p class="label">Study set</p><div class="field"><label>Region</label><select id="stateRegion">${regions.map(r=>`<option ${p.region===r?'selected':''}>${r}</option>`).join("")}</select></div><div class="field"><label>Division</label><select id="stateDivision"><option>All</option>${divisions.map(d=>`<option ${p.division===d?'selected':''}>${d}</option>`).join("")}</select></div><p class="helper">${setSize} location${setSize===1?'':'s'} in this study set${p.region==='South Region'?', including Washington, D.C.':'.'}</p></div>
      <div class="panel"><p class="label">Question style</p><div class="option-grid" data-choice-group="kind">
        <button class="choice ${p.kind === "mixed" ? "selected" : ""}" data-value="mixed">Mixed clues</button><button class="choice ${p.kind === "map" ? "selected" : ""}" data-value="map">Map shapes</button>
        <button class="choice ${p.kind === "facts" ? "selected" : ""}" data-value="facts">Names & capitals</button><button class="choice ${p.kind === "triples" ? "selected" : ""}" data-value="triples">Three-way match</button><button class="choice ${p.kind === "spelling" ? "selected" : ""}" data-value="spelling">Spell state & capital</button>
      </div></div>
      <div class="panel"><p class="label">Round length</p><div class="option-grid" data-choice-group="count"><button class="choice ${p.count==='10'?'selected':''}" data-value="10">10 questions</button><button class="choice ${p.count==='25'?'selected':''}" data-value="25">25 questions</button><button class="choice ${p.count==='max'?'selected':''}" data-value="max">Max · ${maxCount}</button></div></div>
      <div class="panel"><p class="label">Who is holding the phone?</p>${modeButtons(p.mode)}</div>
      <button class="primary" id="startStates">Start ${p.count==='max'?maxCount:Math.min(+p.count,maxCount)}-question quest</button>`;
    $("#stateRegion").onchange=e=>{p.region=e.target.value;p.division="All";store.statePrefs=p;save();renderStates();};
    $("#stateDivision").onchange=e=>{p.division=e.target.value;store.statePrefs=p;save();renderStates();};
    wireChoices($("#statesView"), (group, value) => { p[group] = value; store.statePrefs = p; save(); renderStates(); });
    $("#startStates").onclick = () => startStates(p);
  }

  function activeStates(region,division="All") { const regional=region === "All 50" ? STATE_DATA.filter(s=>!s.district) : STATE_DATA.filter(s => s.region === region); return division === "All" ? regional : regional.filter(s=>s.division===division); }
  function stateQuestion(state, kind, direction) {
    if (kind === "map") return {subject:"states", state, map:true, prompt:"Which state is this?", answer:`${state.name} · ${state.abbr} · ${state.capital}`, accepts:[state.name,state.abbr,state.capital], combined:true, detail:`${state.name} — ${state.abbr} — ${state.capital}`};
    if (kind === "triples") return {subject:"states", state, prompt:`Complete the set for ${state.name}`, answer:`${state.abbr} · ${state.capital}`, accepts:[state.abbr,state.capital], combined:true, detail:`${state.name} — ${state.abbr} — ${state.capital}`};
    if (kind === "spelling") { const answer=direction==='capital'?state.capital:state.name; return {subject:"state-spelling",state,prompt:`Spell the ${direction==='capital'?'capital':'state name'} you hear`,answer,speech:answer,detail:`${state.name} — ${state.capital}`}; }
    const map = {
      "state-capital":[`What is the capital of ${state.name}?`,state.capital,"capital"],
      "state-abbr":[`What is the abbreviation for ${state.name}?`,state.abbr,"abbreviation"],
      "capital-state":[`${state.capital} is the capital of which state?`,state.name,"state"],
      "abbr-state":[`${state.abbr} stands for which state?`,state.name,"state"],
      "capital-abbr":[`Which abbreviation goes with ${state.capital}?`,state.abbr,"abbreviation"],
      "abbr-capital":[`What is the capital of ${state.abbr}?`,state.capital,"capital"]
    }[direction];
    return {subject:"states", state, prompt:map[0], answer:map[1], answerType:map[2], detail:`${state.name} — ${state.abbr} — ${state.capital}`};
  }

  function stateQuestionBank(states,kind) {
    const kinds = kind === 'mixed' ? ['facts','map','triples','spelling'] : [kind];
    const questions=[];
    states.forEach(state=>kinds.forEach(k=>{
      if(k==='facts') ["state-capital","state-abbr","capital-state","abbr-state","capital-abbr","abbr-capital"].forEach(d=>questions.push(stateQuestion(state,k,d)));
      else if(k==='spelling') ['state','capital'].forEach(d=>questions.push(stateQuestion(state,k,d)));
      else questions.push(stateQuestion(state,k));
    }));
    questions.forEach(q=>q.pool=states);
    return questions;
  }

  function startStates(p) {
    const states = activeStates(p.region,p.division); const bank=shuffle(stateQuestionBank(states,p.kind)); const wanted=p.count==='max'?bank.length:Math.min(+p.count,bank.length); const questions=bank.slice(0,wanted);
    startSession("State Quest", questions, p.mode);
  }

  function renderSpelling() {
    const p = store.spellingPrefs || defaults.spellingPrefs;
    const maxCount = p.mode === "mixed" ? store.spelling.length * 2 : store.spelling.length;
    if (!['10','20','max'].includes(p.count)) p.count='max';
    $("#spellingView").innerHTML = `${head("Word Wizard",`${store.spelling.length} words in this week's bank`)}
      <div class="panel"><p class="label">This week's words</p><div class="pill-row">${store.spelling.slice(0,10).map(w => `<span class="pill">${esc(w)}</span>`).join("")}${store.spelling.length > 10 ? `<span class="pill">+${store.spelling.length-10}</span>`:""}</div><button class="secondary" data-go="settings" data-focus="spelling">Edit word bank</button></div>
      <div class="panel"><p class="label">Practice mode</p>${modeButtons(p.mode)}</div>
      <div class="panel"><p class="label">Round length</p><div class="option-grid" data-choice-group="count"><button class="choice ${p.count==='10'?'selected':''}" data-value="10">10 questions</button><button class="choice ${p.count==='20'?'selected':''}" data-value="20">20 questions</button><button class="choice ${p.count==='max'?'selected':''}" data-value="max">Max · ${maxCount}</button></div></div>
      ${voicePanelMarkup()}
      <button class="secondary" id="loadAudioWords" style="margin-bottom:14px">Load the William Cypher word list</button>
      <div class="panel"><p class="helper"><strong>Listen mode:</strong> in child play, tap the speaker to hear each word. In parent mode, the spelling stays visible only to the person holding the phone.</p></div>
      <button class="primary" id="startSpelling" ${store.spelling.length ? "" : "disabled"}>Start spelling round</button>`;
    wireChoices($("#spellingView"), (group,value) => { p[group]=value; store.spellingPrefs=p; save(); renderSpelling(); });
    wireVoicePanel($("#spellingView"));
    $("#loadAudioWords").onclick=()=>{store.spelling=[...BUNDLED_SPELLING];save();renderSpelling();toast("20 recorded words loaded");};
    $("#startSpelling").onclick = () => {
      const makeQuestion=(word,modeOverride)=>({subject:"spelling",prompt:"Spell the word you hear",answer:word,speech:word,detail:word,pool:store.spelling,modeOverride});
      const bank=p.mode==="mixed"?store.spelling.flatMap(word=>[makeQuestion(word,"choice"),makeQuestion(word,"type")]):store.spelling.map(word=>makeQuestion(word,p.mode));
      const wanted=p.count==='max'?bank.length:Math.min(+p.count,bank.length);
      startSession("Word Wizard", shuffle(bank).slice(0,wanted), p.mode);
    };
  }

  function renderMath() {
    const p = store.mathPrefs || defaults.mathPrefs;
    $("#mathView").innerHTML = `${head("Multiply Mayhem","Build speed and confidence from 0 × 0 to 9 × 9")}
      <div class="panel"><p class="label">Choose tables</p><div class="option-grid" id="tableGrid">${[0,1,2,3,4,5,6,7,8,9].map(n => `<button class="choice ${p.tables.includes(n)?"selected":""}" data-table="${n}">${n}s</button>`).join("")}</div><div class="two" style="margin-top:10px"><button class="tiny" data-preset="all">All tables</button><button class="tiny" data-preset="tricky">6s–9s</button></div></div>
      <div class="panel"><p class="label">Practice mode</p>${modeButtons(p.mode)}</div>
      <div class="panel"><p class="label">Round length</p><div class="option-grid" data-choice-group="count"><button class="choice ${p.count==='10'?'selected':''}" data-value="10">10 questions</button><button class="choice ${p.count==='25'?'selected':''}" data-value="25">25 questions</button><button class="choice ${p.count==='max'?'selected':''}" data-value="max">Max · ${p.tables.length*10}</button></div></div>
      <div class="panel"><p class="label">Timer</p><div class="option-grid" data-choice-group="timer"><button class="choice ${p.timer==='0'?'selected':''}" data-value="0">No timer</button><button class="choice ${p.timer==='1'?'selected':''}" data-value="1">1 minute</button><button class="choice ${p.timer==='3'?'selected':''}" data-value="3">3 minutes</button><button class="choice ${p.timer==='5'?'selected':''}" data-value="5">5 minutes</button></div></div>
      <button class="primary" id="startMath">Start ${p.count==='max'?p.tables.length*10:Math.min(+p.count,p.tables.length*10)}-question round</button>`;
    $("#tableGrid").onclick = e => { const b=e.target.closest("[data-table]"); if(!b)return; const n=+b.dataset.table; p.tables=p.tables.includes(n)?p.tables.filter(x=>x!==n):[...p.tables,n].sort(); if(!p.tables.length)p.tables=[n]; store.mathPrefs=p;save();renderMath(); };
    $$('[data-preset]',$("#mathView")).forEach(b=>b.onclick=()=>{p.tables=b.dataset.preset==="all"?[0,1,2,3,4,5,6,7,8,9]:[6,7,8,9];store.mathPrefs=p;save();renderMath();});
    wireChoices($("#mathView"),(group,value)=>{p[group]=value;store.mathPrefs=p;save();renderMath();});
    $("#startMath").onclick=()=>{const bank=shuffle(p.tables.flatMap(a=>Array.from({length:10},(_,b)=>({subject:"math",prompt:`${a} × ${b}`,answer:String(a*b),detail:`${a} × ${b} = ${a*b}`,a,b}))));const wanted=p.count==='max'?bank.length:Math.min(+p.count,bank.length);startSession("Multiply Mayhem",bank.slice(0,wanted),p.mode,+p.timer);};
  }

  function renderPoems() {
    const poem = store.poems[0];
    $("#poemsView").innerHTML = `${head("Poem Power","Learn a poem a little at a time")}
      <div class="panel"><p class="label">Choose a poem</p><div class="stack" id="poemList">${store.poems.map((p,i)=>`<button class="list-item ${i===0?"selected":""}" data-poem="${esc(p.id)}"><span class="subject-icon" style="background:#f1e8ff;color:#8047b1">❝</span><span class="grow"><strong>${esc(p.title)}</strong><small>${esc(p.author||"Author not listed")}</small></span><span>›</span></button>`).join("")}</div><button class="secondary" style="margin-top:10px" data-go="settings" data-focus="poems">Add or edit poems</button></div>
      ${voicePanelMarkup()}
      <div class="panel" id="poemModes">${poemModeMarkup(poem)}</div>`;
    let selected=poem;
    $("#poemList").onclick=e=>{const b=e.target.closest("[data-poem]");if(!b)return;selected=store.poems.find(p=>p.id===b.dataset.poem);$$('[data-poem]').forEach(x=>x.classList.toggle('selected',x===b));$("#poemModes").innerHTML=poemModeMarkup(selected);wirePoemModes(selected);};
    wirePoemModes(selected);
    wireVoicePanel($("#poemsView"));
  }

  function poemModeMarkup(poem){return `<p class="label">Practice ${esc(poem.title)}</p><div class="stack">
    <button class="choice" data-poem-mode="read">Read it aloud</button><button class="choice" data-poem-mode="missing">Missing words</button><button class="choice" data-poem-mode="lines">Next-line prompts</button><button class="choice" data-poem-mode="recite">Recite from memory</button></div>`;}
  function wirePoemModes(poem){$$('[data-poem-mode]',$("#poemModes")).forEach(b=>b.onclick=()=>startPoem(poem,b.dataset.poemMode));}
  function startPoem(poem,mode){
    const lines=poem.text.split("\n").filter(x=>x.trim());
    if(mode==="read"){playStartCue();session={title:"Poem Power",questions:[{subject:"poem-read",prompt:poem.title,answer:poem.text,detail:poem.author,speech:poem.text,audio:poem.audio||"",poemId:poem.id}],index:0,correct:0,mode:"read",minutes:0};go("session");renderQuestion();return;}
    if(mode==="recite"){playStartCue();session={title:"Poem Power",questions:[{subject:"poem-recite",prompt:`Recite “${poem.title}” from memory`,answer:poem.text,detail:poem.author}],index:0,correct:0,mode:"parent"};go("session");renderQuestion();return;}
    if(mode==="lines"){const qs=lines.slice(0,-1).map((line,i)=>({subject:"poem-line",prompt:line,answer:lines[i+1],detail:`Next line: ${lines[i+1]}`}));startSession("Next-Line Prompts",shuffle(qs).slice(0,8),"type");return;}
    const candidates=lines.map(line=>({line,words:(line.match(/[A-Za-z’']+/g)||[]).filter(w=>w.length>3)})).filter(x=>x.words.length);const qs=shuffle(candidates).slice(0,Math.min(8,candidates.length)).map(({line,words})=>{const word=pick(words);return {subject:"poem-missing",prompt:line.replace(new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i'),"_____"),answer:word,detail:`The missing word was “${word}.”`};});startSession("Missing Words",qs,"type");
  }

  function subjectGroup(subject="") {
    if(subject==="states"||subject==="state-spelling")return "states";
    if(subject==="spelling")return "spelling";
    if(subject==="math")return "math";
    if(subject.startsWith("poem"))return "poems";
    return "other";
  }
  const subjectLabel=subject=>({states:"State Quest",spelling:"Word Wizard",math:"Multiply Mayhem",poems:"Poem Power",other:"Other"}[subject]||subject);

  function renderStory(){
    const profile=activeProfile();
    const completed=MISSIONS.filter(m=>(profile.missions[m.id]?.progress||0)>=m.goal).length;
    $("#storyView").innerHTML=`${head("Story Mode",`${profile.name}'s mission map`)}
      <div class="panel story-intro"><img src="assets/characters/professor-volt.png" alt="Professor Volt"><div><p class="eyebrow">Arcade restoration</p><h2>${completed} of ${MISSIONS.length} missions complete</h2><p class="helper">Practice in any learning game to advance its mission. Completed missions award bonus energy orbs.</p></div><img src="assets/characters/circuit-sentinel-action.png" alt="Circuit Sentinel"></div>
      <div class="mission-list">${MISSIONS.map((mission,index)=>{const state=profile.missions[mission.id]||{progress:0,complete:false};const progress=Math.min(state.progress||0,mission.goal),done=progress>=mission.goal,pct=Math.round(progress/mission.goal*100);return `<article class="panel mission-card ${done?'mission-complete':''}"><div class="mission-number">${done?'✓':index+1}</div><div class="grow"><p class="eyebrow">Mission ${index+1}</p><h2>${esc(mission.title)}</h2><p class="helper">${esc(mission.story)}</p><div class="mission-progress"><span style="width:${pct}%"></span></div><div class="mission-meta"><strong>${progress}/${mission.goal} activities</strong><span>+${mission.reward} orbs</span></div></div><button class="tiny" data-start-mission="${mission.id}">${done?'Practice again':'Start mission'}</button></article>`;}).join("")}</div>`;
    $$('[data-start-mission]').forEach(button=>button.onclick=()=>{const mission=MISSIONS.find(item=>item.id===button.dataset.startMission);profile.activeMissionId=mission.id;save();go(mission.target);});
  }

  function renderProfiles(){
    const current=activeProfile();
    $("#profilesView").innerHTML=`${head("Learner Profiles","Progress is stored locally on this device")}
      <div class="panel profile-hero"><img src="assets/characters/professor-volt.png" alt="Professor Volt"><div><p class="eyebrow">Current learner</p><h2>${esc(current.name)}</h2><p class="helper">Each learner has separate rewards, missions, assessments, and reports.</p></div></div>
      <div class="panel"><p class="label">Choose a learner</p><div class="profile-list">${store.profiles.map(profile=>`<button class="profile-row ${profile.id===store.activeProfileId?'selected':''}" data-profile="${esc(profile.id)}"><span>${esc(profile.name.charAt(0).toUpperCase())}</span><span class="grow"><strong>${esc(profile.name)}</strong><small>${profile.stats.rounds.length} completed rounds · ${profile.stats.stars||0} orbs</small></span><b>${profile.id===store.activeProfileId?'Active':'Choose'}</b></button>`).join("")}</div></div>
      <div class="panel"><p class="label">Add a local profile</p><form id="profileForm" class="profile-form"><input class="answer-input" id="newProfileName" maxlength="24" placeholder="Learner name" autocomplete="off"><button class="primary">Create profile</button></form><p class="helper">Profiles stay on this device and are included in downloaded backups.</p></div>`;
    $$('[data-profile]').forEach(button=>button.onclick=()=>{store.activeProfileId=button.dataset.profile;syncActiveProfile();save();renderProfiles();toast(`${activeProfile().name} selected`);});
    $("#profileForm").onsubmit=event=>{event.preventDefault();const name=$("#newProfileName").value.trim();if(!name)return toast("Enter a learner name");const profile=createProfile(name);store.profiles.push(profile);store.activeProfileId=profile.id;syncActiveProfile();save();renderProfiles();toast(`${name} profile created`);};
  }

  function renderReports(){
    const profile=activeProfile(),stats=profile.stats;
    const groups=["states","spelling","math","poems"];
    const totals=groups.reduce((sum,key)=>{const item=stats.subjects[key]||{};sum.answered+=item.answered||0;sum.correct+=item.correct||0;return sum;},{answered:0,correct:0});
    const accuracy=totals.answered?Math.round(totals.correct/totals.answered*100):0;
    const subjectRows=groups.map(key=>{const item=stats.subjects[key]||{answered:0,correct:0};const pct=item.answered?Math.round(item.correct/item.answered*100):0;return `<div class="report-row"><strong>${subjectLabel(key)}</strong><span>${item.answered} answered</span><b>${item.answered?`${pct}%`:'—'}</b></div>`;}).join("");
    const recent=stats.rounds.slice(-8).reverse();
    $("#reportsView").innerHTML=`${head("Assessments & Reports",`${profile.name}'s saved learning record`)}
      <div class="report-cards"><div class="report-stat"><strong>${totals.answered}</strong><span>Total answers</span></div><div class="report-stat"><strong>${totals.answered?`${accuracy}%`:'—'}</strong><span>Overall accuracy</span></div><div class="report-stat"><strong>${stats.rounds.length}</strong><span>Completed rounds</span></div><div class="report-stat"><strong>${stats.stars||0}</strong><span>Energy orbs</span></div></div>
      <div class="panel"><p class="label">Subject assessment</p><div class="report-table">${subjectRows}</div></div>
      <div class="panel"><p class="label">Recent completed rounds</p>${recent.length?`<div class="report-table">${recent.map(round=>`<div class="report-row"><strong>${esc(round.title)}</strong><span>${esc(round.date)}</span><b>${round.correct}/${round.total}</b></div>`).join("")}</div>`:'<div class="empty">Complete a practice round to begin this report.</div>'}</div>`;
  }

  function startSession(title,questions,mode,minutes=0){playStartCue();session={title,questions,index:0,correct:0,mode,locked:false,minutes,deadline:minutes?Date.now()+minutes*60000:0,timedOut:false};go("session");renderQuestion();}
  function resolvedMode(){return session.questions[session.index]?.modeOverride || (session.mode==="mixed"?pick(["choice","type"]):session.mode);}
  function updateTimer(){if(!session?.deadline)return;const left=Math.max(0,session.deadline-Date.now()),seconds=Math.ceil(left/1000),el=$("#timer");if(el)el.textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;if(left<=0){clearInterval(session.timerId);session.timedOut=true;renderFinish();}}
  function renderQuestion(){
    clearInterval(session?.timerId);const view=$("#sessionView");const q=session.questions[session.index];if(!q){renderFinish();return;}session.locked=false;session.currentMode=resolvedMode();
    setAudioScene("level");
    const pct=(session.index/session.questions.length)*100;
    view.innerHTML=`<div class="quiz-shell"><div class="quiz-top"><button class="back" data-end-session aria-label="End round">×</button><div class="quiz-progress"><span style="width:${pct}%"></span></div>${session.deadline?'<div class="timer" id="timer">0:00</div>':''}<div class="score"><img src="assets/ui/energy-orb.png" alt="">${session.correct}</div></div><div class="flash-card ${q.map?'map-card':''}" id="flashCard"><p class="prompt-label">${esc(session.title)} · ${session.index+1} of ${session.questions.length}</p><div id="questionBody"></div></div></div>`;
    $('[data-end-session]').onclick=()=>{clearInterval(session?.timerId);session=null;go('home');};
    if(session.deadline){updateTimer();session.timerId=setInterval(updateTimer,250);}
    renderQuestionBody(q);
  }

  function renderQuestionBody(q){
    const body=$("#questionBody");const mode=session.currentMode;
    const guide=`<div class="question-guide"><img src="assets/characters/professor-volt.png" alt=""><span>Professor Volt asks:</span></div>`;
    if(q.subject==="poem-read") {body.innerHTML=`${guide}<h2>${esc(q.prompt)}</h2><p class="helper">${esc(q.detail)}</p><button class="secondary" style="margin-bottom:16px" data-play-poem>🔊 Play poem audio</button><div class="poem-text">${esc(q.answer)}</div><button class="primary" style="margin-top:18px" data-self-done>I read it aloud</button>`;$('[data-play-poem]').onclick=()=>playPracticeAudio(q.speech,q.audio,q.poemId);$('[data-self-done]').onclick=()=>grade(true);return;}
    const speech=q.speech?`<button class="subject-icon" id="speakWord" aria-label="Hear the word" style="border:0;color:#5e4bd0">🔊</button>`:"";
    body.innerHTML=`${guide}${q.map?`<div class="map-stage" id="mapStage"><span class="helper">Loading state shape…</span></div>`:""}${speech}<h2 class="${q.subject?.startsWith('poem')?'poem-text':''}">${esc(q.prompt)}</h2><div id="interaction"></div>`;
    if(q.map) renderStateMap(q.state);
    if(q.speech){const speak=()=>playPracticeAudio(q.speech);$("#speakWord").onclick=speak;setTimeout(speak,1200);}
    if(mode==="parent") renderParent(q); else if(mode==="choice") renderMultipleChoice(q); else renderTyped(q);
  }

  function renderParent(q){
    const it=$("#interaction");it.innerHTML=`<button class="secondary" id="revealAnswer">Reveal answer</button><div id="revealed" hidden><div class="feedback good">${q.subject==="poem-recite"?`<div class="poem-text">${esc(q.answer)}</div>`:esc(q.detail||q.answer)}</div><div class="grade-row"><button class="grade wrong" data-grade="false">← Keep practicing</button><button class="grade right" data-grade="true">Got it →</button></div><div class="swipe-hint"><span>Swipe left</span><span>Swipe right</span></div></div>`;
    $("#revealAnswer").onclick=()=>{$("#revealAnswer").hidden=true;$("#revealed").hidden=false;};
    $$('[data-grade]').forEach(b=>b.onclick=()=>grade(b.dataset.grade==="true"));wireSwipe();
  }

  function mathAnswerOptions(q) {
    const n=q.a*q.b;
    const candidates=[n+q.a,n+q.b,n-q.a,n-q.b,q.a*(q.b+1),q.a*Math.max(0,q.b-1),(q.a+1)*q.b,Math.max(0,q.a-1)*q.b,n+1,n-1,n+2,n-2,q.a+q.b,Math.abs(q.a-q.b)];
    const distractors=[...new Set(candidates.filter(value=>Number.isInteger(value)&&value>=0&&value!==n))];
    for(let step=1;distractors.length<3;step++) [n+step,n-step].forEach(value=>{if(value>=0&&value!==n&&!distractors.includes(value))distractors.push(value);});
    return shuffle([n,...shuffle(distractors).slice(0,3)]).map(String);
  }

  function answerOptions(q){
    if(q.subject==="math") return mathAnswerOptions(q);
    if(q.subject==="spelling"||q.subject==="state-spelling"){const w=q.answer;const variants=[w,w.slice(0,-1)+(w.endsWith('e')?'a':'e'),w.replace(/([aeiou])/, '$1$1'),w.length>4?w.slice(0,2)+w.slice(3):w+'e'];return shuffle([...new Set(variants)]).slice(0,4);}
    if(q.subject==="states"){
      if(q.combined){return shuffle([q.state,...shuffle(q.pool.filter(s=>s!==q.state)).slice(0,3)]).map(s=>q.map?`${s.name} · ${s.abbr} · ${s.capital}`:`${s.abbr} · ${s.capital}`);}
      const prop=q.answerType==="state"?"name":q.answerType==="capital"?"capital":"abbr";return shuffle([q.answer,...shuffle(q.pool.filter(s=>s!==q.state)).slice(0,3).map(s=>s[prop])]);
    }
    return [q.answer];
  }
  function renderMultipleChoice(q){const it=$("#interaction");const opts=answerOptions(q);it.innerHTML=`<div class="answers">${opts.map(o=>`<button class="answer" data-answer="${esc(o)}">${esc(o)}</button>`).join("")}</div><div id="feedback"></div>`;$$('[data-answer]').forEach(b=>b.onclick=()=>{if(session.locked)return;const ok=norm(b.dataset.answer)===norm(q.answer);b.classList.add(ok?'correct':'wrong');finishAnswer(ok,q);});}
  function renderTyped(q){const it=$("#interaction");if(q.combined){const labels=q.map?["State","Abbreviation","Capital"]:["Abbreviation","Capital"];it.innerHTML=`<div class="stack">${labels.map((l,i)=>`<input class="answer-input" data-part="${i}" aria-label="${l}" placeholder="${l}" autocapitalize="words">`).join("")}<button class="primary" data-check>Check answer</button></div><div id="feedback"></div>`;$('[data-check]').onclick=()=>{const vals=$$('[data-part]').map(x=>x.value);const expected=q.map?[q.state.name,q.state.abbr,q.state.capital]:[q.state.abbr,q.state.capital];finishAnswer(vals.every((v,i)=>norm(v)===norm(expected[i])),q);};}
    else{it.innerHTML=`<form id="answerForm" class="stack"><input class="answer-input" id="typedAnswer" aria-label="Your answer" placeholder="Type your answer" autocomplete="off" autocapitalize="words"><button class="primary">Check answer</button></form><div id="feedback"></div>`;$("#answerForm").onsubmit=e=>{e.preventDefault();finishAnswer(norm($("#typedAnswer").value)===norm(q.answer),q);};setTimeout(()=>$("#typedAnswer")?.focus(),80);}}

  function finishAnswer(ok,q){if(session.locked)return;session.locked=true;playAnswerSound();const feedback=$("#feedback")||$("#interaction");const correction=q.subject==="math"&&!ok?`${q.a} groups of ${q.b}: ${Array(q.a).fill(q.b).join(" + ") || "0"} = ${q.answer}`:q.detail||`Answer: ${q.answer}`;const message=ok?pick(["Nice work!","You got it!","Great recall!","Level up!"]):`Good try. ${esc(correction)}`;feedback.innerHTML=`<div class="feedback ${ok?'good':'try'} mascot-feedback"><img src="assets/characters/circuit-sentinel-${ok?'success':'thinking'}.png" alt=""><span>${message}</span></div><button class="primary" style="margin-top:10px" data-next>${session.index===session.questions.length-1?'See results':'Next question'}</button>`;$('[data-next]').onclick=()=>grade(ok,false);}
  function recordAnswer(ok,q){
    const stats=activeProfile().stats,group=subjectGroup(q?.subject||"");
    const day=stats.days[today()]||{answered:0,correct:0};day.answered++;if(ok)day.correct++;stats.days[today()]=day;
    const subject=stats.subjects[group]||{answered:0,correct:0};subject.answered++;if(ok)subject.correct++;stats.subjects[group]=subject;
    if(ok)stats.stars=(stats.stars||0)+1;
    const mission=MISSIONS.find(item=>item.subject===group);
    if(mission){const state=activeProfile().missions[mission.id]||{progress:0,complete:false};if(!state.complete){state.progress=Math.min(mission.goal,(state.progress||0)+1);if(state.progress>=mission.goal){state.complete=true;stats.stars=(stats.stars||0)+mission.reward;toast(`Mission complete! +${mission.reward} bonus orbs`);}activeProfile().missions[mission.id]=state;}}
    syncActiveProfile();
  }
  function grade(ok,withSound=true){if(withSound)playAnswerSound();const q=session.questions[session.index];if(ok)session.correct++;recordAnswer(ok,q);save();session.index++;renderQuestion();}
  function wireSwipe(){let startX=0;const card=$("#flashCard");card.addEventListener('touchstart',e=>startX=e.touches[0].clientX,{passive:true});card.addEventListener('touchend',e=>{if($("#revealed")?.hidden)return;const d=e.changedTouches[0].clientX-startX;if(Math.abs(d)>70)grade(d>0);},{passive:true});}

  async function renderStateMap(state){const stage=$("#mapStage");try{if(!mapTopology){const res=await fetch("vendor/states-10m.json");mapTopology=await res.json();}const features=topojson.feature(mapTopology,mapTopology.objects.states).features;const feature=features.find(f=>String(f.id).padStart(2,'0')===state.id);const projection=d3.geoIdentity().reflectY(true).fitExtent([[18,14],[332,218]],feature);const path=d3.geoPath(projection);stage.innerHTML=`<svg viewBox="0 0 350 232" role="img" aria-label="Unlabeled state outline"><path d="${path(feature)}"></path></svg>`;}catch{stage.innerHTML=`<div class="feedback try">This state outline could not load. Try reopening the app.</div>`;}}
  function renderFinish(){clearInterval(session?.timerId);setAudioScene("finished");const total=session.timedOut?session.index:session.questions.length,correct=session.correct,pct=Math.round(correct/Math.max(1,total)*100),pose=pct>=60?'success':'thinking';if(!session.roundSaved){const stats=activeProfile().stats;stats.rounds.push({date:today(),title:session.title,total,correct,accuracy:pct});stats.rounds=stats.rounds.slice(-100);session.roundSaved=true;save();}$("#sessionView").innerHTML=`${head(session.timedOut?"Time's up!":"Round complete!",session.title,"home")}<div class="panel finish-panel"><img class="finish-mascot" src="assets/characters/circuit-sentinel-${pose}.png" alt="Circuit Sentinel"><div><img class="finish-orb" src="assets/ui/energy-orb.png" alt="Energy orb reward"><h1>${correct} of ${total}</h1><p class="helper">${session.timedOut?`You answered ${total} before the timer ended. `:''}${pct>=80?'Fantastic focus!':pct>=60?'Strong work—one more round will make it stick.':'Every practice round grows your brain.'}</p></div></div><div class="stack"><button class="primary" data-again>Practice again</button><button class="secondary" data-go="reports">View report</button><button class="secondary" data-go="home">Back to quests</button></div>`;$('[data-again]').onclick=()=>{session.index=0;session.correct=0;session.roundSaved=false;session.timedOut=false;session.deadline=session.minutes?Date.now()+session.minutes*60000:0;session.questions=shuffle(session.questions);renderQuestion();};}

  function renderSettings(){
    $("#settingsView").innerHTML=`${head("Parent Setup","Update weekly practice without rebuilding the app")}
      <div class="panel"><h2>Learner profiles</h2><p class="helper">Create or switch local profiles so reports and missions stay separate for each learner.</p><button class="secondary" data-go="profiles">Manage profiles</button></div>
      <div class="panel" id="spellingSettings"><h2>Spelling word bank</h2><p class="helper">Enter one word per line or separate words with commas.</p><div class="field"><textarea id="wordBank">${esc(store.spelling.join("\n"))}</textarea></div><button class="primary" id="saveWords">Save word bank</button></div>
      <div class="panel" id="poemSettings"><h2>Poems</h2><div class="stack">${store.poems.map((p,i)=>`<div class="list-item"><span class="grow"><strong>${esc(p.title)}</strong><small>${esc(p.author||"")}</small></span><button class="tiny" data-edit-poem="${i}">Edit</button></div>`).join("")}</div><button class="secondary" style="margin-top:10px" id="addPoem">Add a poem</button><div id="poemEditor"></div></div>
      <div class="panel"><h2>Save protection</h2><p class="helper">Progress is saved on this device. Download a backup before deleting and re-adding the home-screen app.</p><div class="two"><button class="secondary" id="exportData">Download backup</button><button class="secondary" id="importData">Import backup</button></div><input type="file" id="importFile" accept="application/json" hidden></div>
      <div class="panel"><h2>Home-screen updates</h2><p class="helper">Keep the existing icon. Open this page online and tap “Check for update” to load the newest version without replacing saved progress.</p><button class="secondary" id="checkUpdate">Check for update</button></div>`;
    $("#saveWords").onclick=()=>{store.spelling=$("#wordBank").value.split(/[\n,]+/).map(w=>w.trim()).filter(Boolean);save();toast(`${store.spelling.length} spelling words saved`);};
    $("#addPoem").onclick=()=>renderPoemEditor();$$('[data-edit-poem]').forEach(b=>b.onclick=()=>renderPoemEditor(+b.dataset.editPoem));
    $("#exportData").onclick=exportData;$("#importData").onclick=()=>$("#importFile").click();$("#importFile").onchange=importData;
    $("#checkUpdate").onclick=async()=>{if(!('serviceWorker'in navigator)){toast('No update is waiting');return;}const reg=await navigator.serviceWorker.getRegistration();await reg?.update();toast('Update check complete');};
  }
  function renderPoemEditor(index){const poem=Number.isInteger(index)?store.poems[index]:{title:"",author:"",text:""};$("#poemEditor").innerHTML=`<div class="field"><label>Title</label><input id="poemTitle" value="${esc(poem.title)}"></div><div class="field"><label>Author</label><input id="poemAuthor" value="${esc(poem.author)}"></div><div class="field"><label>Poem text</label><textarea id="poemText">${esc(poem.text)}</textarea></div><div class="two"><button class="primary" id="savePoem">Save poem</button>${Number.isInteger(index)?'<button class="danger-btn" id="deletePoem">Delete</button>':''}</div>`;$("#poemTitle").focus();$("#savePoem").onclick=()=>{const title=$("#poemTitle").value.trim(),text=$("#poemText").value.trim();if(!title||!text){toast('Add a title and poem text');return;}const next={id:(poem.id||title.toLowerCase().replace(/[^a-z0-9]+/g,'-'))+(!Number.isInteger(index)?`-${Date.now()}`:''),title,author:$("#poemAuthor").value.trim(),text,...(poem.audio?{audio:poem.audio}:{})};if(Number.isInteger(index))store.poems[index]=next;else store.poems.push(next);save();renderSettings();toast('Poem saved');};if(Number.isInteger(index))$("#deletePoem").onclick=()=>{if(store.poems.length===1){toast('Keep at least one poem');return;}store.poems.splice(index,1);save();renderSettings();};}
  function exportData(){const blob=new Blob([JSON.stringify(store,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`learning-arcade-backup-${today()}.json`;a.click();URL.revokeObjectURL(a.href);}
  function importData(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result);store={...defaults,...parsed};localStorage.setItem(STORE,JSON.stringify(store));location.reload();}catch{toast('That backup could not be read');}};reader.readAsText(file);}

  document.addEventListener("click", e => {const nav=e.target.closest("[data-go]");if(nav)go(nav.dataset.go);});
  window.addEventListener("hashchange",()=>go(location.hash.slice(1)||"home"));
  if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js?v=16"));
  if (document.modelContext?.registerTool) {
    const register = tool => Promise.resolve(document.modelContext.registerTool(tool)).catch(() => {});
    register({name:"read_learning_sets",title:"Read learning sets",description:"Read the current spelling words and poem titles configured in Learning Arcade.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>({spellingWords:[...store.spelling],poems:store.poems.map(p=>({id:p.id,title:p.title,author:p.author}))})});
    register({name:"update_spelling_words",title:"Update spelling words",description:"Replace the weekly spelling word bank and update the visible app.",inputSchema:{type:"object",properties:{words:{type:"array",items:{type:"string",minLength:1},minItems:1}},required:["words"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:({words})=>{if(!Array.isArray(words)||!words.length)throw new Error("At least one word is required");store.spelling=[...new Set(words.map(w=>String(w).trim()).filter(Boolean))];save();if($("[data-screen='settings']").classList.contains("active"))renderSettings();return{saved:true,count:store.spelling.length};}});
    register({name:"add_practice_poem",title:"Add practice poem",description:"Add a poem to the memorization and recitation list.",inputSchema:{type:"object",properties:{title:{type:"string",minLength:1},author:{type:"string"},text:{type:"string",minLength:1}},required:["title","text"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:({title,author="",text})=>{if(!String(title).trim()||!String(text).trim())throw new Error("Title and poem text are required");const poem={id:`poem-${Date.now()}`,title:String(title).trim(),author:String(author).trim(),text:String(text).trim()};store.poems.push(poem);save();if($("[data-screen='poems']").classList.contains("active"))renderPoems();return{saved:true,id:poem.id,title:poem.title};}});
  }
  wireSoundControls();renderHome();setAudioScene("menu");
})();
