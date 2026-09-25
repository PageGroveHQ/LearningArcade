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
  const blankStats = () => ({stars:0,days:{},subjects:{},rounds:[],mistakes:{},skills:{},assessments:{}});
  const createProfile = (name="Player 1", stats=blankStats()) => ({id:`profile-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,name,stats,missions:{},activeMissionId:"state-scan-1",inventory:["core"],equippedWeapon:"core",seenChapters:[],bosses:{}});
  const SECTORS = {
    states:{title:"Atlas Station",subtitle:"State Quest",icon:"⌖",className:"atlas",target:"states"},
    spelling:{title:"Word Workshop",subtitle:"Word Wizard",icon:"Aa",className:"words",target:"spelling"},
    math:{title:"Multiplication Reactor",subtitle:"Multiply Mayhem",icon:"×",className:"reactor",target:"math"},
    poems:{title:"Poetry Signal Tower",subtitle:"Poem Power",icon:"❝",className:"poetry",target:"poems"}
  };
  const MISSIONS = [
    {id:"state-scan-1",subject:"states",title:"Wake the State Scanner",story:"Identify 5 geographic signals so Professor Volt can locate Atlas Station.",goal:5,reward:3},
    {id:"state-scan-2",subject:"states",title:"Calibrate the Compass",story:"Complete 10 state answers to align the navigation array.",goal:10,reward:5},
    {id:"state-scan-3",subject:"states",title:"Trace the Borders",story:"Decode 15 names, capitals, abbreviations, or map shapes.",goal:15,reward:6},
    {id:"state-scan-4",subject:"states",title:"Link the Regions",story:"Send 20 correct coordinates through the regional network.",goal:20,reward:8},
    {id:"state-scan-5",subject:"states",title:"Restore Atlas Station",story:"Finish 25 final signals and bring the whole station online.",goal:25,reward:12},
    {id:"word-vault-1",subject:"spelling",title:"Open the Word Vault",story:"Spell 5 signal words to unlock the archive door.",goal:5,reward:3},
    {id:"word-vault-2",subject:"spelling",title:"Sort the Sound Crystals",story:"Complete 10 correct spellings to organize the archive.",goal:10,reward:5},
    {id:"word-vault-3",subject:"spelling",title:"Repair the Letter Grid",story:"Spell 15 words to reconnect the workshop terminals.",goal:15,reward:6},
    {id:"word-vault-4",subject:"spelling",title:"Decode the Master List",story:"Complete 20 correct spellings from the active word bank.",goal:20,reward:8},
    {id:"word-vault-5",subject:"spelling",title:"Restore the Word Workshop",story:"Transmit 20 final spellings without losing the signal.",goal:20,reward:12},
    {id:"math-core-1",subject:"math",title:"Start the Number Engine",story:"Solve 10 facts to start the reactor's first turbine.",goal:10,reward:3},
    {id:"math-core-2",subject:"math",title:"Balance the Arrays",story:"Complete 15 facts to steady the multiplication field.",goal:15,reward:5},
    {id:"math-core-3",subject:"math",title:"Charge the Core",story:"Solve 20 facts and fill the reactor with learning energy.",goal:20,reward:6},
    {id:"math-core-4",subject:"math",title:"Break the Speed Barrier",story:"Complete 25 facts to synchronize every number channel.",goal:25,reward:8},
    {id:"math-core-5",subject:"math",title:"Restore the Reactor",story:"Solve 30 final facts and return full power to the arcade.",goal:30,reward:12},
    {id:"poetry-signal-1",subject:"poems",title:"Find the Lost Verse",story:"Complete 1 poem activity to locate the missing broadcast.",goal:1,reward:3},
    {id:"poetry-signal-2",subject:"poems",title:"Tune the Rhythm",story:"Complete 3 poem activities to clear the transmission.",goal:3,reward:5},
    {id:"poetry-signal-3",subject:"poems",title:"Rebuild the Memory Beam",story:"Complete 5 poem activities to strengthen recall.",goal:5,reward:6},
    {id:"poetry-signal-4",subject:"poems",title:"Broadcast the Stanzas",story:"Complete 8 poem activities across the tower.",goal:8,reward:8},
    {id:"poetry-signal-5",subject:"poems",title:"Restore the Poetry Signal",story:"Complete 10 final activities and send the poem across the arcade.",goal:10,reward:12}
  ].map(m=>({...m,target:SECTORS[m.subject].target}));
  const REWARDS = [
    {at:2,name:"Cyan Armor Trim",icon:"◇"},{at:5,name:"Navigator Badge",icon:"⌖"},{at:8,name:"Energy Orb Trail",icon:"✦"},
    {at:12,name:"Reactor Glow",icon:"⚡"},{at:16,name:"Archive Crest",icon:"❖"},{at:20,name:"Master Sentinel Emblem",icon:"★"}
  ];
  const WEAPONS = [
    {id:"core",name:"Core Sentinel",cost:0,element:"Balanced",color:"#27c9e8",glow:"#7ef6ff",power:3,speed:3,guard:3,description:"The dependable original armor. Calibrated for every learning mission.",ability:"Core Pulse",lore:"Professor Volt built the Core system from the first light recovered inside the Learning Arcade.",effect:"Pulse rings"},
    {id:"ember",name:"Ember Cannon",cost:250,element:"Focus",color:"#ff5b3d",glow:"#ffc34f",power:5,speed:3,guard:2,description:"A bright heat-energy form forged for bold starts and determined finishes.",ability:"Blazing Recall",lore:"Forged when a learner held onto one difficult fact until the answer finally sparked.",effect:"Ember burst"},
    {id:"frost",name:"Frost Lance",cost:250,element:"Patience",color:"#50d8ff",glow:"#d8fbff",power:4,speed:2,guard:5,description:"A cool, steady form that rewards careful thinking before every answer.",ability:"Crystal Focus",lore:"Its crystal core slows the noise around a problem so the clearest answer can shine through.",effect:"Crystal shimmer"},
    {id:"volt",name:"Volt Disc",cost:250,element:"Speed",color:"#9b62ff",glow:"#ffe24d",power:4,speed:5,guard:2,description:"A fast electric form built for fluency streaks and quick recall.",ability:"Flash Circuit",lore:"A rapid-response system powered by confident answers and the rhythm of a growing fluency streak.",effect:"Lightning arc"},
    {id:"cyclone",name:"Cyclone Boomerang",cost:250,element:"Agility",color:"#20c97a",glow:"#70ffe0",power:3,speed:5,guard:3,description:"A sweeping wind form that always circles back to repair missed skills.",ability:"Return Current",lore:"Its returning current remembers every missed signal and guides Sentinel back for another try.",effect:"Wind spiral"},
    {id:"prism",name:"Prism Shield",cost:250,element:"Confidence",color:"#ef46b5",glow:"#8ff8ff",power:3,speed:2,guard:5,description:"A radiant barrier form that turns steady practice into brilliant confidence.",ability:"Spectrum Guard",lore:"Each color in the prism represents a different kind of knowledge working together as one defense.",effect:"Prism flare"}
  ];
  const CHAPTERS = [
    {id:"blackout",at:0,number:"Prologue",title:"The Great Arcade Blackout",summary:"A mysterious static storm drains every learning sector.",accent:"#59d9f3",scenes:[
      {speaker:"Professor Volt",pose:"idle",text:"The Learning Arcade has gone dark. Atlas, Words, Math, and Poetry have all lost their signal!"},
      {speaker:"Circuit Sentinel",pose:"thinking",text:"I can still sense four weak energy trails. If we learn our way through them, we can bring every station back."},
      {speaker:"Professor Volt",pose:"success",text:"Then the restoration begins now. Every correct answer will create an Energy Orb—and every Orb will make our hero stronger."}
    ]},
    {id:"first-light",at:4,number:"Chapter 1",title:"First Light",summary:"The first restored systems reveal a hidden transmission.",accent:"#f6c85f",scenes:[
      {speaker:"Professor Volt",pose:"idle",text:"Four systems are glowing again. Their signals are joining into a message buried beneath the arcade."},
      {speaker:"Circuit Sentinel",pose:"thinking",text:"It says, “Knowledge opens every locked circuit.” Someone wanted us to find this—but who?"},
      {speaker:"Circuit Sentinel",pose:"success",text:"No matter who sent it, we keep moving. The next sector is already calling!"}
    ]},
    {id:"signal-thief",at:8,number:"Chapter 2",title:"The Signal Thief",summary:"A shadow signal steals power from newly repaired stations.",accent:"#9b62ff",scenes:[
      {speaker:"Professor Volt",pose:"thinking",text:"A strange echo is copying our signals and carrying their power deeper into the grid."},
      {speaker:"Circuit Sentinel",pose:"idle",text:"Then we will follow the echo. Every fact, word, state, and verse gives us a clearer trail."},
      {speaker:"Professor Volt",pose:"success",text:"Excellent deduction! Repair eight more systems and the thief will have nowhere left to hide."}
    ]},
    {id:"core-storm",at:12,number:"Chapter 3",title:"The Core Storm",summary:"The stolen energy erupts into a storm around the central reactor.",accent:"#ff6a55",scenes:[
      {speaker:"Circuit Sentinel",pose:"thinking",text:"The signal thief was not a person. It was a runaway program feeding on unfinished challenges."},
      {speaker:"Professor Volt",pose:"idle",text:"It grows whenever learners give up—but careful practice weakens it. Mistakes repaired are stronger than answers never attempted."},
      {speaker:"Circuit Sentinel",pose:"success",text:"Then this storm picked the wrong arcade. We know how to try again!"}
    ]},
    {id:"archive-awakens",at:16,number:"Chapter 4",title:"The Archive Awakens",summary:"An ancient library of learning tools comes back online.",accent:"#20c997",scenes:[
      {speaker:"Professor Volt",pose:"idle",text:"Sixteen systems restored! The Grand Archive is opening for the first time in years."},
      {speaker:"Circuit Sentinel",pose:"thinking",text:"Its records say the runaway program has a name: the Doubt Cloud. It cannot survive a fully powered learner signal."},
      {speaker:"Professor Volt",pose:"success",text:"Four final systems remain. Trust what you know, learn what you do not, and the path will clear."}
    ]},
    {id:"arcade-reborn",at:20,number:"Finale",title:"The Learning Arcade Reborn",summary:"Every restored sector combines to clear the Doubt Cloud.",accent:"#ffd85a",scenes:[
      {speaker:"Circuit Sentinel",pose:"idle",text:"All twenty systems are online. Atlas gives us direction, Words give us a voice, Math gives us power, and Poetry gives us imagination."},
      {speaker:"Professor Volt",pose:"success",text:"The Doubt Cloud is gone. You did not win by never making mistakes—you won by returning stronger each time."},
      {speaker:"Circuit Sentinel",pose:"success",text:"The arcade is restored, but our journey is only beginning. There will always be a new skill to discover!"}
    ]}
  ];
  const BOSSES = [
    {id:"static-swarm",subject:"states",name:"The Static Swarm",sector:"Atlas Station",goal:8,questions:12,reward:40,color:"#35dff1",art:"assets/characters/bosses/static-swarm.png",brief:"A cloud of compass drones is scrambling every border signal.",hint:"Use names, capitals, abbreviations, and shapes to lock onto the real coordinates."},
    {id:"echo-engine",subject:"spelling",name:"The Echo Engine",sector:"Word Workshop",goal:8,questions:12,reward:40,color:"#ef65c7",art:"assets/characters/bosses/echo-engine.png",brief:"Its speakers repeat almost-correct words until the archive cannot tell which spelling is real.",hint:"Listen closely, build each word, and silence the false echoes."},
    {id:"number-glitch",subject:"math",name:"The Number Glitch",sector:"Multiplication Reactor",goal:8,questions:12,reward:40,color:"#ffc240",art:"assets/characters/bosses/number-glitch.png",brief:"A runaway calculation program is swapping products inside the reactor.",hint:"Solve the facts accurately to stabilize its spinning number rings."},
    {id:"verse-vortex",subject:"poems",name:"The Verse Vortex",sector:"Poetry Signal Tower",goal:6,questions:10,reward:40,color:"#a47cff",art:"assets/characters/bosses/verse-vortex.png",brief:"A ribbon storm has pulled words and lines out of their proper order.",hint:"Restore missing words and next lines to calm the rhythm of the storm."},
    {id:"doubt-cloud",subject:"final",name:"The Doubt Cloud",sector:"Central Grid",goal:12,questions:18,reward:100,color:"#d68cff",art:"assets/characters/bosses/doubt-cloud.png",brief:"The program feeding on unfinished challenges has gathered above the restored arcade.",hint:"Combine every skill you have repaired. The Cloud weakens each time you try with confidence."}
  ];
  const defaults = {
    spelling: BUNDLED_SPELLING,
    poems: window.DEFAULT_POEMS,
    stats: {stars: 0, days: {}},
    statePrefs: {region:"Northeast Region", division:"All", mode:"mixed", kind:"mixed", count:"10"},
    mathPrefs: {tables:[0,1,2,3,4,5,6,7,8,9], mode:"mixed", count:"10", timer:"0"},
    spellingPrefs: {mode:"mixed", count:"max"},
    voicePrefs: {source:"circuit-sentinel", voiceURI:"", style:"bright"},
    audioPrefs: {enabled:true,master:.7,music:.45,effects:.8},
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
    profile.seenChapters=Array.isArray(profile.seenChapters)?profile.seenChapters.filter(id=>CHAPTERS.some(chapter=>chapter.id===id)):[];
    profile.bosses=profile.bosses&&typeof profile.bosses==="object"?profile.bosses:{};
    if(!MISSIONS.some(m=>m.id===profile.activeMissionId)) profile.activeMissionId="state-scan-1";
  });
  if (!store.profiles.some(profile=>profile.id===store.activeProfileId)) store.activeProfileId=store.profiles[0].id;
  const activeProfile = () => store.profiles.find(profile=>profile.id===store.activeProfileId) || store.profiles[0];
  const activeWeapon = (profile=activeProfile()) => WEAPONS.find(weapon=>weapon.id===profile.equippedWeapon) || WEAPONS[0];
  const sentinelArt = (pose="idle",profile=activeProfile()) => `assets/characters/skins/${activeWeapon(profile).id}-${pose}.png`;
  function applyEquippedTheme(profile=activeProfile()){const weapon=activeWeapon(profile);document.body.dataset.form=weapon.id;document.body.style.setProperty("--form-color",weapon.color);document.body.style.setProperty("--form-glow",weapon.glow);}
  const syncActiveProfile = () => {store.stats=activeProfile().stats;};
  syncActiveProfile();
  applyEquippedTheme();
  store.poems = Array.isArray(store.poems) && store.poems.length ? store.poems : window.DEFAULT_POEMS;
  store.spelling = Array.isArray(store.spelling) ? store.spelling : defaults.spelling;
  if (!store.statePrefs || !["All 50","Northeast Region","Midwest Region","South Region","West Region"].includes(store.statePrefs.region)) store.statePrefs = {...defaults.statePrefs};
  store.mathPrefs = {...defaults.mathPrefs, ...(store.mathPrefs || {})};
  store.spellingPrefs = {...defaults.spellingPrefs, ...(store.spellingPrefs || {})};
  store.voicePrefs = {...defaults.voicePrefs, ...(store.voicePrefs || {})};
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
  let activeChapterId = "blackout";
  let chapterStep = 0;
  let mapTopology = null;
  let availableVoices = [];
  let activeAudio = null;
  let audioUnlocked = false;
  let audioScene = "menu";
  let musicDucked = false;
  let questionAudioDucked = false;
  let openingPlayed = false;
  let audioContext = null, masterGain = null, musicGain = null, effectsGain = null, voiceGain = null;
  const mediaSources = new WeakMap();
  const MUSIC = {menu:"audio/interface/game-select.mp3",level:"audio/interface/level-play.mp3",finished:"audio/interface/round-finished.mp3"};
  const CUES = {opening:"audio/interface/professor-opening.mp3",start:"audio/interface/sentinel-start.mp3"};
  const backgroundMusic = new Audio(); backgroundMusic.loop=true; backgroundMusic.preload="auto";
  const answerSound = new Audio("audio/interface/answer-selected.wav"); answerSound.preload="auto";
  const wrongAnswerSound = new Audio("audio/interface/wrong-answer.mp3"); wrongAnswerSound.preload="auto";
  const voiceCue = new Audio(); voiceCue.preload="auto";

  const clampVolume=value=>Math.max(0,Math.min(1,Number(value)||0));
  function masterVolume(){return clampVolume(store.audioPrefs.master);}
  function musicVolume(){return clampVolume(store.audioPrefs.music);}
  function effectsVolume(){return clampVolume(store.audioPrefs.effects);}
  function connectMedia(media,gain){if(!audioContext||!gain||mediaSources.has(media))return;const source=audioContext.createMediaElementSource(media);source.connect(gain);mediaSources.set(media,source);media.volume=1;}
  function ensureAudioGraph(){const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)return;try{if(!audioContext){audioContext=new AudioContextClass();masterGain=audioContext.createGain();musicGain=audioContext.createGain();effectsGain=audioContext.createGain();voiceGain=audioContext.createGain();musicGain.connect(masterGain);effectsGain.connect(masterGain);voiceGain.connect(masterGain);masterGain.connect(audioContext.destination);connectMedia(backgroundMusic,musicGain);connectMedia(answerSound,effectsGain);connectMedia(wrongAnswerSound,effectsGain);connectMedia(voiceCue,voiceGain);if(activeAudio)connectMedia(activeAudio,voiceGain);}if(audioContext.state==="suspended")audioContext.resume().catch(()=>{});applySoundVolumes();}catch{audioContext=null;masterGain=musicGain=effectsGain=voiceGain=null;}}
  function applySoundVolumes(){const duck=musicDucked?.05:questionAudioDucked?.16:1,master=store.audioPrefs.enabled?masterVolume():0,music=musicVolume()*duck,effects=effectsVolume();document.body.dataset.masterVolume=String(masterVolume());document.body.dataset.musicVolume=String(musicVolume());document.body.dataset.effectsVolume=String(effectsVolume());document.body.dataset.effectiveMusicVolume=String(master*music);if(audioContext&&masterGain){masterGain.gain.value=master;musicGain.gain.value=music;effectsGain.gain.value=effects;voiceGain.gain.value=1;[backgroundMusic,answerSound,wrongAnswerSound,voiceCue,activeAudio].filter(Boolean).forEach(media=>media.volume=1);}else{backgroundMusic.volume=master*music;answerSound.volume=master*effects;wrongAnswerSound.volume=master*effects;voiceCue.volume=master;if(activeAudio)activeAudio.volume=master;}}
  function setAudioScene(scene){audioScene=scene;document.body.dataset.audioScene=scene;document.body.dataset.soundEnabled=String(store.audioPrefs.enabled);if(scene==="silent"){backgroundMusic.pause();applySoundVolumes();return;}const source=MUSIC[scene]||MUSIC.menu;if(backgroundMusic.getAttribute("src")!==source){backgroundMusic.src=source;backgroundMusic.load();}applySoundVolumes();if(!store.audioPrefs.enabled||!audioUnlocked){backgroundMusic.pause();return;}ensureAudioGraph();backgroundMusic.play().catch(()=>{});}
  function playAnswerSound(ok=true){if(!store.audioPrefs.enabled||!audioUnlocked)return;ensureAudioGraph();const sound=ok?answerSound:wrongAnswerSound;sound.currentTime=0;sound.play().catch(()=>{});}
  function playFormEffect(ok=true){
    playAnswerSound(ok);
    if(!ok||!store.audioPrefs.enabled||!audioUnlocked)return;
    ensureAudioGraph();
    if(!audioContext||!effectsGain)return;
    const notes={core:[520,680],ember:[220,440],frost:[880,660],volt:[330,990],cyclone:[420,560,720],prism:[523,659,784]}[activeWeapon().id]||[520,680];
    const now=audioContext.currentTime;
    notes.forEach((frequency,index)=>{
      const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();
      oscillator.type=activeWeapon().id==="volt"?"square":activeWeapon().id==="frost"?"sine":"triangle";
      oscillator.frequency.setValueAtTime(frequency,now+index*.055);
      gain.gain.setValueAtTime(.0001,now+index*.055);
      gain.gain.exponentialRampToValueAtTime(.045,now+index*.055+.018);
      gain.gain.exponentialRampToValueAtTime(.0001,now+index*.055+.2);
      oscillator.connect(gain);gain.connect(effectsGain);oscillator.start(now+index*.055);oscillator.stop(now+index*.055+.22);
    });
  }
  function duckMusic(duck=true){musicDucked=duck;applySoundVolumes();}
  function setQuestionAudioDuck(duck=false){questionAudioDucked=duck;applySoundVolumes();}
  function playVoiceCue(source){if(!store.audioPrefs.enabled||!audioUnlocked)return;ensureAudioGraph();voiceCue.pause();voiceCue.src=source;voiceCue.currentTime=0;duckMusic(true);voiceCue.onended=()=>duckMusic(false);voiceCue.onerror=()=>duckMusic(false);voiceCue.play().catch(()=>duckMusic(false));}
  function playStartCue(){playVoiceCue(CUES.start);}
  function wireSoundControls(){const enabled=$("#soundEnabled"),volume=$("#soundVolume");enabled.checked=store.audioPrefs.enabled;volume.value=Math.round(masterVolume()*100);enabled.onchange=()=>{audioUnlocked=true;ensureAudioGraph();store.audioPrefs.enabled=enabled.checked;if(!enabled.checked){activeAudio?.pause();voiceCue.pause();window.speechSynthesis?.cancel();duckMusic(false);}save();applySoundVolumes();setAudioScene(audioScene);if(enabled.checked&&!openingPlayed&&$("[data-screen='home']").classList.contains("active")){openingPlayed=true;playVoiceCue(CUES.opening);}};volume.oninput=()=>{audioUnlocked=true;ensureAudioGraph();store.audioPrefs.master=Number(volume.value)/100;applySoundVolumes();save();syncMixerControls();if(store.audioPrefs.enabled&&backgroundMusic.paused&&audioScene!=="silent")setAudioScene(audioScene);};document.addEventListener("pointerdown",()=>{audioUnlocked=true;ensureAudioGraph();setAudioScene(audioScene);if(store.audioPrefs.enabled&&!openingPlayed&&$("[data-screen='home']").classList.contains("active")){openingPlayed=true;playVoiceCue(CUES.opening);}},{once:true,capture:true});}

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
    ensureAudioGraph();connectMedia(activeAudio,voiceGain);applySoundVolumes();duckMusic(true);activeAudio.onended=()=>duckMusic(false);activeAudio.onerror=()=>duckMusic(false);activeAudio.play().catch(()=>{duckMusic(false);speakText(text);});
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
    if (name === "chapter") renderChapter();
    if (name === "armory") renderArmory();
    if (name === "profiles") renderProfiles();
    if (name === "reports") renderReports();
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
    $("#profileInitial").textContent=profile.name.charAt(0).toUpperCase();
    $("#totalStars").textContent = stats.stars || 0;
    $(".home-robot").src=sentinelArt("idle",profile);
    $(".home-robot").alt=`${activeWeapon(profile).name} Circuit Sentinel`;
    $("#homeReport").innerHTML=`<div><p class="eyebrow">${esc(profile.name)} · ${completedMissionCount(profile)}/20 missions</p><h2>${totals.answered?`${accuracy}% accuracy across ${totals.answered} answers`:"Ready to restore the Learning Arcade"}</h2><p class="helper">Current mission: ${esc(mission.title)} · ${progress}/${mission.goal}</p></div><button class="report-orb" data-go="reports" aria-label="Open reports"><img src="assets/ui/energy-orb.png" alt=""><strong>${stats.rounds.length}</strong><small>rounds</small></button>`;
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
    if(mode==="read"){startSession("Poem Power",[{subject:"poem-read",prompt:poem.title,answer:poem.text,detail:poem.author,speech:poem.text,audio:poem.audio||"",poemId:poem.id}],"read",0,{silentMusic:true});return;}
    if(mode==="recite"){startSession("Poem Power",[{subject:"poem-recite",prompt:`Recite “${poem.title}” from memory`,answer:poem.text,detail:poem.author}],"parent");return;}
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

  const completedMissionCount=profile=>MISSIONS.filter(m=>(profile.missions[m.id]?.progress||0)>=m.goal).length;
  const unlockedRewards=profile=>REWARDS.filter(reward=>completedMissionCount(profile)>=reward.at);
  function missionUnlocked(profile,mission){const sector=MISSIONS.filter(m=>m.subject===mission.subject),index=sector.findIndex(m=>m.id===mission.id);return index===0||(profile.missions[sector[index-1].id]?.progress||0)>=sector[index-1].goal;}
  function currentMissionFor(profile,subject){return MISSIONS.find(m=>m.subject===subject&&missionUnlocked(profile,m)&&(profile.missions[m.id]?.progress||0)<m.goal)||MISSIONS.filter(m=>m.subject===subject).at(-1);}
  function missionSummary(profile,mission){const progress=Math.min(profile.missions[mission.id]?.progress||0,mission.goal);return {progress,pct:Math.round(progress/mission.goal*100),done:progress>=mission.goal,unlocked:missionUnlocked(profile,mission)};}
  const chapterUnlocked=(profile,chapter)=>chapter.id==="arcade-reborn"?!!profile.bosses?.["doubt-cloud"]?.defeated:completedMissionCount(profile)>=chapter.at;
  const bossDefeated=(profile,boss)=>!!profile.bosses?.[boss.id]?.defeated;
  function bossUnlocked(profile,boss){
    if(boss.subject==="final")return BOSSES.filter(item=>item.subject!=="final").every(item=>bossDefeated(profile,item));
    return MISSIONS.filter(mission=>mission.subject===boss.subject).every(mission=>missionSummary(profile,mission).done);
  }
  function bossQuestions(boss){
    const spelling=()=>shuffle(store.spelling.flatMap(word=>[
      {subject:"spelling",prompt:"Spell the word you hear",answer:word,speech:word,detail:word,pool:store.spelling,modeOverride:"choice"},
      {subject:"spelling",prompt:"Spell the word you hear",answer:word,speech:word,detail:word,pool:store.spelling,modeOverride:"type"}
    ]));
    const math=()=>shuffle(Array.from({length:100},(_,index)=>{const a=Math.floor(index/10),b=index%10;return {subject:"math",prompt:`${a} × ${b}`,answer:String(a*b),detail:`${a} × ${b} = ${a*b}`,a,b,modeOverride:index%2?"choice":"type"};}));
    const states=()=>shuffle(stateQuestionBank(STATE_DATA.filter(state=>!state.district),"mixed")).map((question,index)=>({...question,modeOverride:index%3?"choice":"type"}));
    const poems=()=>{const poem=store.poems[0],lines=poem.text.split("\n").filter(line=>line.trim()),missing=lines.map(line=>({line,words:(line.match(/[A-Za-z’']+/g)||[]).filter(word=>word.length>3)})).filter(item=>item.words.length).map(({line,words})=>{const word=pick(words);return {subject:"poem-missing",prompt:line.replace(new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i'),"_____"),answer:word,detail:`The missing word was “${word}.”`,modeOverride:"type"};}),next=lines.slice(0,-1).map((line,index)=>({subject:"poem-line",prompt:line,answer:lines[index+1],detail:`Next line: ${lines[index+1]}`,modeOverride:"type"}));return shuffle([...missing,...next]);};
    let bank=boss.subject==="states"?states():boss.subject==="spelling"?spelling():boss.subject==="math"?math():boss.subject==="poems"?poems():shuffle([...states().slice(0,8),...spelling().slice(0,8),...math().slice(0,8),...poems().slice(0,8)]);
    while(bank.length<boss.questions)bank=[...bank,...bank];
    return shuffle(bank).slice(0,boss.questions);
  }
  function startBoss(id){const boss=BOSSES.find(item=>item.id===id),profile=activeProfile();if(!boss||!bossUnlocked(profile,boss))return toast("Restore the required systems before this boss mission");startSession(`Boss Mission: ${boss.name}`,bossQuestions(boss),"mixed",0,{bossId:boss.id,bossDamage:0,bossGoal:boss.goal,bossDefeated:false});}
  function openChapter(id){const chapter=CHAPTERS.find(item=>item.id===id);if(!chapter||!chapterUnlocked(activeProfile(),chapter))return toast("Complete more missions to unlock this chapter");activeChapterId=id;chapterStep=0;go("chapter");}

  function renderStory(){
    const profile=activeProfile();
    const completed=completedMissionCount(profile),rewards=unlockedRewards(profile),sectorBosses=BOSSES.filter(boss=>boss.subject!=="final"),finalBoss=BOSSES.find(boss=>boss.subject==="final"),bossesCleared=BOSSES.filter(boss=>bossDefeated(profile,boss)).length;
    $("#storyView").innerHTML=`${head("Story Mode",`${profile.name}'s restoration campaign`)}
      <div class="mission-map-hero"><div class="mission-map-copy"><p class="eyebrow">Restore the Learning Arcade</p><h2>${completed} missions · ${bossesCleared} bosses cleared</h2><p>Repair each learning sector, defeat its signal guardian, then challenge the Doubt Cloud above the Central Grid.</p><div class="campaign-meter"><span style="width:${(completed+bossesCleared*4)/(MISSIONS.length+BOSSES.length*4)*100}%"></span></div></div></div>
      <div class="panel story-intro"><img src="assets/characters/professor-volt.png" alt="Professor Volt"><div><p class="eyebrow">Mission briefing</p><h2>${completed===MISSIONS.length?'The arcade is fully restored!':'Choose an available sector'}</h2><p class="helper">Correct answers power the current mission. Finish missions to unlock animated chapters, earn bonus orbs, and build Sentinel's armory.</p></div><img src="${sentinelArt()}" alt="${esc(activeWeapon(profile).name)} Circuit Sentinel"></div>
      <section class="campaign-route" aria-label="Connected campaign route"><div class="route-line" aria-hidden="true"></div>${Object.entries(SECTORS).map(([key,sector],index)=>{const missions=MISSIONS.filter(mission=>mission.subject===key),done=missions.filter(mission=>missionSummary(profile,mission).done).length,boss=sectorBosses.find(item=>item.subject===key),defeated=bossDefeated(profile,boss),ready=bossUnlocked(profile,boss);return `<button class="route-stop ${defeated?'restored':ready?'ready':done?'active':''}" data-route-sector="${key}" style="--route-color:${boss.color}"><span class="route-chapter">${index+1}</span><b>${sector.icon}</b><strong>${esc(sector.title)}</strong><small>${defeated?'Boss cleared':ready?'Boss ready':`${done}/5 systems`}</small></button>`;}).join('')}<div class="route-gate ${bossUnlocked(profile,finalBoss)?'open':''}">◆</div><button class="route-stop final ${bossDefeated(profile,finalBoss)?'restored':bossUnlocked(profile,finalBoss)?'ready':''}" data-route-final style="--route-color:${finalBoss.color}"><span class="route-chapter">FINAL</span><img src="${finalBoss.art}" alt=""><strong>Doubt Cloud</strong><small>${bossDefeated(profile,finalBoss)?'Central Grid restored':bossUnlocked(profile,finalBoss)?'Final battle ready':'Clear four bosses'}</small></button></section>
      <section class="chapter-log"><div class="section-heading"><div><p class="eyebrow">Transmission archive</p><h2>Story chapters</h2></div><span>${CHAPTERS.filter(chapter=>chapterUnlocked(profile,chapter)).length}/${CHAPTERS.length} unlocked</span></div><div class="chapter-grid">${CHAPTERS.map(chapter=>{const unlocked=chapterUnlocked(profile,chapter),seen=profile.seenChapters.includes(chapter.id),requirement=chapter.id==="arcade-reborn"?"Defeat Doubt Cloud":`${chapter.at} missions`;return `<button class="chapter-card ${unlocked?'unlocked':'locked'} ${unlocked&&!seen?'new':''}" data-chapter="${chapter.id}" ${unlocked?'':'disabled'} style="--chapter-accent:${chapter.accent}"><span class="chapter-number">${unlocked?esc(chapter.number):'🔒'}</span><strong>${unlocked?esc(chapter.title):requirement}</strong><small>${unlocked?esc(chapter.summary):chapter.id==="arcade-reborn"?'Win the Central Grid final battle to reveal this transmission.':'Restore more systems to reveal this transmission.'}</small>${unlocked&&!seen?'<b>NEW</b>':''}</button>`;}).join('')}</div></section>
      <div class="reward-strip" aria-label="Unlocked rewards">${REWARDS.map(reward=>{const unlocked=completed>=reward.at;return `<div class="reward-chip ${unlocked?'unlocked':'locked'}"><span>${unlocked?reward.icon:'🔒'}</span><small>${esc(reward.name)}<br>${reward.at} missions</small></div>`;}).join('')}</div>
      <div class="sector-grid">${Object.entries(SECTORS).map(([key,sector])=>{const missions=MISSIONS.filter(m=>m.subject===key),done=missions.filter(m=>missionSummary(profile,m).done).length,boss=sectorBosses.find(item=>item.subject===key),ready=bossUnlocked(profile,boss),defeated=bossDefeated(profile,boss);return `<section class="sector-card ${sector.className}" id="sector-${key}"><div class="sector-head"><span class="sector-icon">${sector.icon}</span><div><p class="eyebrow">${esc(sector.subtitle)}</p><h2>${esc(sector.title)}</h2><p>${done}/5 systems online</p></div></div><div class="sector-missions">${missions.map((mission,index)=>{const state=missionSummary(profile,mission),active=profile.activeMissionId===mission.id;return `<article class="mission-node ${state.done?'complete':''} ${!state.unlocked?'locked':''} ${active?'active':''}"><div class="mission-number">${state.done?'✓':state.unlocked?index+1:'🔒'}</div><div class="grow"><strong>${esc(mission.title)}</strong><small>${esc(mission.story)}</small><div class="mission-progress"><span style="width:${state.pct}%"></span></div><div class="mission-meta"><span>${state.progress}/${mission.goal} correct</span><span>+${mission.reward} orbs</span></div></div><button class="tiny" data-start-mission="${mission.id}" ${state.unlocked?'':'disabled'}>${state.done?'Replay':active?'Selected':'Start'}</button></article>`;}).join('')}</div><article class="boss-gate ${defeated?'defeated':ready?'ready':'locked'}" style="--boss-color:${boss.color}"><img src="${boss.art}" alt="${esc(boss.name)}"><div class="grow"><p class="eyebrow">${defeated?'Boss cleared':ready?'Boss signal located':'Sector boss locked'}</p><h3>${esc(boss.name)}</h3><small>${esc(boss.brief)}</small><p>${boss.goal} correct hits · +${boss.reward} bonus orbs</p></div><button class="${ready?'primary':'secondary'}" data-start-boss="${boss.id}" ${ready?'':'disabled'}>${defeated?'Replay':ready?'Battle':'Complete 5 missions'}</button></article></section>`;}).join('')}</div>
      <section class="final-boss-gate ${bossDefeated(profile,finalBoss)?'defeated':bossUnlocked(profile,finalBoss)?'ready':'locked'}" id="final-boss" style="--boss-color:${finalBoss.color}"><div><p class="eyebrow">Central Grid · Final boss</p><h2>${esc(finalBoss.name)}</h2><p>${esc(finalBoss.brief)}</p><p class="helper">${esc(finalBoss.hint)}</p><button class="primary" data-start-boss="${finalBoss.id}" ${bossUnlocked(profile,finalBoss)?'':'disabled'}>${bossDefeated(profile,finalBoss)?'Replay final battle':bossUnlocked(profile,finalBoss)?'Begin final battle':'Defeat all four sector bosses'}</button></div><img src="${finalBoss.art}" alt="${esc(finalBoss.name)}"></section>
      <div class="panel locker-callout"><img src="${sentinelArt()}" alt=""><div class="grow"><p class="label">Orb Shop & Locker</p><h2>${esc(activeWeapon(profile).name)} equipped</h2><p class="helper">Spend Energy Orbs on five original Sentinel forms, then switch your look at any time.</p></div><button class="secondary" data-go="armory">Open armory</button></div>
      ${rewards.length?`<div class="panel"><p class="label">Campaign honors</p><p class="helper">${rewards.map(r=>`${r.icon} ${esc(r.name)}`).join(' · ')}</p></div>`:''}`;
    $$('[data-chapter]').forEach(button=>button.onclick=()=>openChapter(button.dataset.chapter));
    $$('[data-start-mission]').forEach(button=>button.onclick=()=>{const mission=MISSIONS.find(item=>item.id===button.dataset.startMission);if(!missionUnlocked(profile,mission))return;profile.activeMissionId=mission.id;save();go(mission.target);});
    $$('[data-start-boss]').forEach(button=>button.onclick=()=>startBoss(button.dataset.startBoss));
    $$('[data-route-sector]').forEach(button=>button.onclick=()=>document.querySelector(`#sector-${button.dataset.routeSector}`)?.scrollIntoView({behavior:"smooth",block:"start"}));
    $('[data-route-final]')?.addEventListener('click',()=>$("#final-boss")?.scrollIntoView({behavior:"smooth",block:"center"}));
  }

  function renderChapter(){
    const profile=activeProfile(),chapter=CHAPTERS.find(item=>item.id===activeChapterId)||CHAPTERS[0];
    if(!chapterUnlocked(profile,chapter)){go("story");return;}
    const scene=chapter.scenes[chapterStep]||chapter.scenes[0],isProfessor=scene.speaker==="Professor Volt",last=chapterStep===chapter.scenes.length-1;
    const art=isProfessor?"assets/characters/professor-volt.png":sentinelArt(scene.pose||"idle",profile);
    $("#chapterView").innerHTML=`${head(chapter.title,`${chapter.number} · Transmission ${chapterStep+1} of ${chapter.scenes.length}`,"story")}
      <article class="story-scene" style="--chapter-accent:${chapter.accent}"><div class="story-circuit-lines" aria-hidden="true"></div><div class="scene-location">Learning Arcade · Central Grid</div><img class="scene-character ${isProfessor?'professor':'sentinel'}" src="${art}" alt="${esc(scene.speaker)}"><div class="scene-dialogue"><p class="eyebrow">${esc(scene.speaker)}</p><p>${esc(scene.text)}</p></div><div class="scene-dots">${chapter.scenes.map((_,index)=>`<span class="${index===chapterStep?'active':''}"></span>`).join('')}</div></article>
      <div class="chapter-controls">${chapterStep?'<button class="secondary" data-chapter-prev>Previous</button>':''}<button class="primary" data-chapter-next>${last?'Finish chapter':'Continue'}</button></div>`;
    $('[data-chapter-prev]')?.addEventListener('click',()=>{chapterStep--;renderChapter();});
    $('[data-chapter-next]').onclick=()=>{if(last){if(!profile.seenChapters.includes(chapter.id))profile.seenChapters.push(chapter.id);save();go("story");toast(`${chapter.title} added to the archive`);}else{chapterStep++;renderChapter();}};
  }

  function renderArmory(){
    const profile=activeProfile(),weapon=activeWeapon(profile),orbs=profile.stats.stars||0;
    $("#armoryView").innerHTML=`${head("Orb Shop & Locker",`${profile.name}'s cosmetic Sentinel forms`)}
      <section class="armory-console" style="--weapon-color:${weapon.color};--weapon-glow:${weapon.glow}"><div class="armory-scan" aria-hidden="true"></div><div class="selected-form"><p class="eyebrow">CURRENT FORM</p><img src="${sentinelArt("idle",profile)}" alt="${esc(weapon.name)}"><div class="form-name"><span>${esc(weapon.element)} system</span><h2>${esc(weapon.name)}</h2></div><div class="pose-preview" aria-label="Form pose preview"><figure><img src="${sentinelArt("idle",profile)}" alt=""><small>Ready</small></figure><figure><img src="${sentinelArt("success",profile)}" alt=""><small>Victory</small></figure><figure><img src="${sentinelArt("thinking",profile)}" alt=""><small>Think</small></figure></div></div><div class="weapon-spec"><div class="orb-wallet"><img src="assets/ui/energy-orb.png" alt=""><strong>${orbs}</strong><span>available orbs</span></div><p class="eyebrow">SPECIAL PROGRAM</p><h2>${esc(weapon.ability)}</h2><p>${esc(weapon.description)}</p><div class="form-lore"><strong>Archive record</strong><span>${esc(weapon.lore)}</span></div><div class="form-effect"><i></i><span>Answer effect: ${esc(weapon.effect)}</span></div>${[["Power",weapon.power],["Speed",weapon.speed],["Guard",weapon.guard]].map(([label,value])=>`<div class="spec-row"><span>${label}</span><i><b style="width:${value*20}%"></b></i></div>`).join('')}<small>Forms change armor art, interface energy, victory effects, and answer sounds. Difficulty and scoring stay fair.</small></div></section>
      <div class="section-heading"><div><p class="eyebrow">FORM SELECT</p><h2>Choose your Sentinel</h2></div><span>${profile.inventory.length}/${WEAPONS.length} owned</span></div>
      <div class="weapon-grid">${WEAPONS.map(item=>{const owned=profile.inventory.includes(item.id),equipped=profile.equippedWeapon===item.id;return `<article class="weapon-card ${equipped?'equipped':''}" style="--weapon-color:${item.color}"><div class="weapon-preview"><img src="assets/characters/skins/${item.id}-idle.png" alt="${esc(item.name)}"><span>${esc(item.element)}</span></div><div class="weapon-card-copy"><h3>${esc(item.name)}</h3><small>${esc(item.ability)}</small>${equipped?'<button class="tiny equipped-label" disabled>Equipped</button>':owned?`<button class="secondary" data-equip-weapon="${item.id}">Equip</button>`:`<button class="primary" data-buy-weapon="${item.id}"><img src="assets/ui/energy-orb.png" alt=""> ${item.cost}</button>`}</div></article>`;}).join('')}</div>`;
    $$('[data-equip-weapon]').forEach(button=>button.onclick=()=>{profile.equippedWeapon=button.dataset.equipWeapon;applyEquippedTheme(profile);playFormEffect(true);save();renderArmory();toast(`${activeWeapon(profile).name} equipped`);});
    $$('[data-buy-weapon]').forEach(button=>button.onclick=()=>{const item=WEAPONS.find(candidate=>candidate.id===button.dataset.buyWeapon);if(!item||profile.inventory.includes(item.id))return;if((profile.stats.stars||0)<item.cost)return toast(`You need ${item.cost-(profile.stats.stars||0)} more orbs`);profile.stats.stars-=item.cost;profile.inventory.push(item.id);profile.equippedWeapon=item.id;syncActiveProfile();applyEquippedTheme(profile);playFormEffect(true);save();renderArmory();toast(`${item.name} unlocked and equipped!`);});
  }

  function renderProfiles(){
    const current=activeProfile();
    const completed=completedMissionCount(current),rank=completed>=20?'Master Sentinel':completed>=12?'Senior Sentinel':completed>=5?'Field Sentinel':'Sentinel Cadet';
    $("#profilesView").innerHTML=`${head("Learner Profiles","Progress is stored locally on this device")}
      <div class="panel profile-hero"><img src="${sentinelArt("success",current)}" alt="${esc(activeWeapon(current).name)} Circuit Sentinel celebrating"><div><p class="eyebrow">${rank}</p><h2>${esc(current.name)}</h2><p class="helper">${completed}/20 missions · ${unlockedRewards(current).length}/6 rewards · ${current.stats.stars||0} energy orbs</p><button class="tiny" data-go="armory">${esc(activeWeapon(current).name)} equipped</button></div></div>
      <div class="panel"><p class="label">Choose a learner</p><div class="profile-list">${store.profiles.map(profile=>`<button class="profile-row ${profile.id===store.activeProfileId?'selected':''}" data-profile="${esc(profile.id)}"><span>${esc(profile.name.charAt(0).toUpperCase())}</span><span class="grow"><strong>${esc(profile.name)}</strong><small>${completedMissionCount(profile)} missions · ${profile.stats.rounds.length} rounds · ${profile.stats.stars||0} orbs</small></span><b>${profile.id===store.activeProfileId?'Active':'Choose'}</b></button>`).join("")}</div></div>
      <div class="panel"><p class="label">Add a local profile</p><form id="profileForm" class="profile-form"><input class="answer-input" id="newProfileName" maxlength="24" placeholder="Learner name" autocomplete="off"><button class="primary">Create profile</button></form><p class="helper">Profiles stay on this device and are included in downloaded backups.</p></div>`;
    $$('[data-profile]').forEach(button=>button.onclick=()=>{store.activeProfileId=button.dataset.profile;syncActiveProfile();applyEquippedTheme();save();renderProfiles();toast(`${activeProfile().name} selected`);});
    $("#profileForm").onsubmit=event=>{event.preventDefault();const name=$("#newProfileName").value.trim();if(!name)return toast("Enter a learner name");const profile=createProfile(name);store.profiles.push(profile);store.activeProfileId=profile.id;syncActiveProfile();save();renderProfiles();toast(`${name} profile created`);};
  }

  function masteryInfo(items=[]){const answered=items.reduce((sum,item)=>sum+(item.answered||0),0),correct=items.reduce((sum,item)=>sum+(item.correct||0),0),accuracy=answered?Math.round(correct/answered*100):0,level=!answered?"unseen":accuracy>=90&&answered>=3?"mastered":accuracy>=70?"growing":"practice";return {answered,correct,accuracy,level};}
  function masteryLegend(){return `<div class="mastery-legend"><span><i class="unseen"></i>Not seen</span><span><i class="practice"></i>Practice</span><span><i class="growing"></i>Growing</span><span><i class="mastered"></i>Mastered</span></div>`;}
  function renderMasteryMap(subject){
    const root=$("#masteryMap");if(!root)return;const skills=Object.values(activeProfile().stats.skills||{}),bySubject=skills.filter(item=>item.subject===subject);
    if(subject==="math"){
      const cells=Array.from({length:100},(_,index)=>{const a=Math.floor(index/10),b=index%10,info=masteryInfo(bySubject.filter(item=>norm(item.prompt)===norm(`${a} × ${b}`)));return `<div class="heat-cell ${info.level}" title="${a} × ${b}: ${info.answered?`${info.accuracy}% across ${info.answered}`:'not practiced'}"><b>${a}×${b}</b><small>${info.answered?`${info.accuracy}%`:'—'}</small></div>`;}).join('');root.innerHTML=`<p class="helper">Every multiplication fact has its own signal. Three or more tries at 90%+ turns a fact gold.</p><div class="math-heatmap">${cells}</div>${masteryLegend()}`;return;
    }
    if(subject==="spelling"){
      root.innerHTML=`<p class="helper">Each word combines multiple-choice and typed attempts into one mastery signal.</p><div class="word-mastery">${store.spelling.map(word=>{const info=masteryInfo(bySubject.filter(item=>norm(item.answer)===norm(word)));return `<article class="word-chip ${info.level}"><strong>${esc(word)}</strong><span>${info.answered?`${info.accuracy}% · ${info.answered} tries`:'Not practiced'}</span></article>`;}).join('')}</div>${masteryLegend()}`;return;
    }
    if(subject==="poems"){
      const poem=store.poems[0],lines=poem.text.split("\n").filter(line=>line.trim());root.innerHTML=`<p class="helper">Each line gains mastery from missing-word and next-line practice.</p><div class="poem-mastery"><h3>${esc(poem.title)}</h3>${lines.map((line,index)=>{const normalized=norm(line),matches=bySubject.filter(item=>norm(item.prompt)===normalized||norm(item.answer)===normalized||norm(String(item.prompt).replace(/_+/g,item.answer))===normalized),info=masteryInfo(matches);return `<article class="poem-line-mastery ${info.level}"><b>${index+1}</b><span>${esc(line)}</span><small>${info.answered?`${info.accuracy}%`:'—'}</small></article>`;}).join('')}</div>${masteryLegend()}`;return;
    }
    renderStateMasteryMap(root,bySubject);
  }
  async function renderStateMasteryMap(root,skills){
    root.innerHTML=`<p class="helper">Loading the national signal map…</p>`;
    try{
      if(!mapTopology){const response=await fetch("vendor/states-10m.json");mapTopology=await response.json();}
      const states=STATE_DATA.filter(state=>!state.district),features=topojson.feature(mapTopology,mapTopology.objects.states).features,collection={type:"FeatureCollection",features:features.filter(feature=>states.some(state=>String(feature.id).padStart(2,'0')===state.id))},projection=d3.geoAlbersUsa().fitExtent([[16,16],[959,594]],collection),path=d3.geoPath(projection);
      root.innerHTML=`<p class="helper">States brighten as names, capitals, abbreviations, and shapes become fluent.</p><div class="state-mastery-map"><svg viewBox="0 0 975 610" role="img" aria-label="State Quest mastery map">${collection.features.map(feature=>{const state=states.find(item=>item.id===String(feature.id).padStart(2,'0')),pattern=new RegExp(`\\b${state.abbr}\\b`,'i'),matches=skills.filter(item=>{const text=`${item.prompt} ${item.answer}`;return norm(text).includes(norm(state.name))||norm(text).includes(norm(state.capital))||pattern.test(text);}),info=masteryInfo(matches);return `<path class="${info.level}" d="${path(feature)}"><title>${esc(state.name)}: ${info.answered?`${info.accuracy}% across ${info.answered}`:'not practiced'}</title></path>`;}).join('')}</svg></div>${masteryLegend()}`;
    }catch{root.innerHTML=`<div class="empty">The State Quest mastery map could not load. Reopen the app and try again.</div>`;}
  }

  function renderReports(){
    const profile=activeProfile(),stats=profile.stats;
    const groups=["states","spelling","math","poems"];
    const totals=groups.reduce((sum,key)=>{const item=stats.subjects[key]||{};sum.answered+=item.answered||0;sum.correct+=item.correct||0;return sum;},{answered:0,correct:0});
    const accuracy=totals.answered?Math.round(totals.correct/totals.answered*100):0;
    const subjectRows=groups.map(key=>{const item=stats.subjects[key]||{answered:0,correct:0,totalMs:0};const pct=item.answered?Math.round(item.correct/item.answered*100):0,pace=item.answered?Math.round((item.totalMs||0)/item.answered/1000):0,level=!item.answered?'Not started':pct>=90&&item.answered>=20?'Mastered':pct>=75?'Proficient':'Practicing';return `<div class="assessment-row"><div><strong>${subjectLabel(key)}</strong><small>${item.answered} answered · ${pace||'—'} sec average</small></div><div class="mastery ${level.toLowerCase().replace(' ','-')}"><b>${item.answered?`${pct}%`:'—'}</b><span>${level}</span></div><button class="tiny" data-assess="${key}">Assess</button></div>`;}).join("");
    const recent=stats.rounds.slice(-8).reverse();
    const outstanding=Object.values(stats.mistakes||{}).filter(item=>(item.misses||0)>(item.corrected||0)).sort((a,b)=>(b.misses-b.corrected)-(a.misses-a.corrected));
    const strongest=groups.map(key=>({key,item:stats.subjects[key]||{answered:0,correct:0}})).filter(x=>x.item.answered).sort((a,b)=>(b.item.correct/b.item.answered)-(a.item.correct/a.item.answered))[0],strongestPct=strongest?Math.round(strongest.item.correct/strongest.item.answered*100):0;
    const nextMission=currentMissionFor(profile,groups.map(key=>({key,left:MISSIONS.filter(m=>m.subject===key&&!missionSummary(profile,m).done).length})).sort((a,b)=>b.left-a.left)[0]?.key||'states');
    $("#reportsView").innerHTML=`${head("Assessments & Reports",`${profile.name}'s saved learning record`)}
      <div class="report-cards"><div class="report-stat"><strong>${totals.answered}</strong><span>Total answers</span></div><div class="report-stat"><strong>${totals.answered?`${accuracy}%`:'—'}</strong><span>Overall accuracy</span></div><div class="report-stat"><strong>${stats.rounds.length}</strong><span>Completed rounds</span></div><div class="report-stat"><strong>${stats.stars||0}</strong><span>Energy orbs</span></div></div>
      <div class="panel report-coach"><img src="assets/characters/professor-volt.png" alt="Professor Volt"><div><p class="eyebrow">Professor Volt's assessment</p><h2>${strongest?strongestPct>=75?`${subjectLabel(strongest.key)} is the strongest signal so far.`:`Keep strengthening ${subjectLabel(strongest.key)}.`:'Complete a round to begin an assessment.'}</h2><p class="helper">${outstanding.length?`${outstanding.length} skill${outstanding.length===1?'':'s'} ready for targeted repair.`:`Recommended next mission: ${esc(nextMission.title)}.`}</p></div></div>
      <div class="panel"><p class="label">Subject mastery</p><div class="assessment-table">${subjectRows}</div><p class="helper">Assessments are focused 10-question checkups and are saved separately from ordinary practice.</p></div>
      <div class="panel mastery-panel"><div class="panel-title-row"><div><p class="label">Skill mastery maps</p><h2>See exactly what is sticking</h2></div></div><div class="mastery-tabs">${groups.map((key,index)=>`<button class="tiny ${index===0?'selected':''}" data-mastery-tab="${key}">${subjectLabel(key)}</button>`).join('')}</div><div id="masteryMap" class="mastery-map"></div></div>
      <div class="panel"><div class="panel-title-row"><div><p class="label">Practice mistakes</p><h2>${outstanding.length?`${outstanding.length} items ready`:'No outstanding mistakes'}</h2></div>${outstanding.length?'<button class="tiny" id="practiceMistakes">Start repair round</button>':''}</div>${outstanding.length?`<div class="mistake-list">${outstanding.slice(0,8).map(item=>`<div><strong>${esc(item.prompt)}</strong><span>${esc(item.answer)} · missed ${item.misses}× · repaired ${item.corrected||0}×</span></div>`).join('')}</div>`:'<p class="helper">When an answer is missed, it will appear here until it is answered correctly in a later round.</p>'}</div>
      <div class="panel"><p class="label">Recent completed rounds</p>${recent.length?`<div class="report-table">${recent.map(round=>`<div class="report-row"><strong>${esc(round.title)}</strong><span>${esc(round.date)}${round.assessment?' · Assessment':''}</span><b>${round.correct}/${round.total}</b></div>`).join("")}</div>`:'<div class="empty">Complete a practice round to begin this report.</div>'}</div>`;
    $$('[data-assess]').forEach(button=>button.onclick=()=>startAssessment(button.dataset.assess));
    $("#practiceMistakes")?.addEventListener('click',()=>startMistakeRound(outstanding));
    $$('[data-mastery-tab]').forEach(button=>button.onclick=()=>{$$('[data-mastery-tab]').forEach(item=>item.classList.toggle('selected',item===button));renderMasteryMap(button.dataset.masteryTab);});
    renderMasteryMap("states");
  }

  function questionSnapshot(q){return {subject:q.subject,prompt:q.prompt,answer:q.answer,detail:q.detail||q.answer,speech:q.speech||"",a:q.a,b:q.b,map:!!q.map,combined:!!q.combined,answerType:q.answerType||"",stateName:q.state?.name||"",modeOverride:q.modeOverride||""};}
  function mistakeKey(q){return `${q.subject}|${q.prompt}|${q.answer}`;}
  function hydrateQuestion(item){const q={subject:item.subject,prompt:item.prompt,answer:item.answer,detail:item.detail,speech:item.speech||"",a:item.a,b:item.b,map:item.map,combined:item.combined,answerType:item.answerType,modeOverride:item.modeOverride||undefined};if(item.stateName){q.state=STATE_DATA.find(state=>state.name===item.stateName);q.pool=STATE_DATA;}else if(item.subject==="spelling")q.pool=store.spelling;return q;}
  function startMistakeRound(items){const questions=shuffle(items).slice(0,20).map(hydrateQuestion).filter(q=>q.answer&&(!q.stateName||q.state));if(!questions.length)return toast("No mistakes are waiting for practice");startSession("Mistake Repair",questions,"mixed",0,{repair:true});}
  function startAssessment(subject){let questions=[],mode="mixed";
    if(subject==="states")questions=shuffle(stateQuestionBank(STATE_DATA.filter(s=>!s.district),"facts")).slice(0,10);
    if(subject==="spelling")questions=shuffle(store.spelling).slice(0,10).map((word,index)=>({subject:"spelling",prompt:"Spell the word you hear",answer:word,speech:word,detail:word,pool:store.spelling,modeOverride:index%2?"type":"choice"}));
    if(subject==="math")questions=shuffle(Array.from({length:100},(_,i)=>{const a=Math.floor(i/10),b=i%10;return {subject:"math",prompt:`${a} × ${b}`,answer:String(a*b),detail:`${a} × ${b} = ${a*b}`,a,b};})).slice(0,10);
    if(subject==="poems"){mode="type";const poem=store.poems[0],lines=poem.text.split("\n").filter(Boolean),candidates=lines.map(line=>({line,words:(line.match(/[A-Za-z’']+/g)||[]).filter(w=>w.length>3)})).filter(x=>x.words.length);questions=shuffle(candidates).slice(0,10).map(({line,words})=>{const word=pick(words);return {subject:"poem-missing",prompt:line.replace(new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i'),"_____"),answer:word,detail:`The missing word was “${word}.”`};});}
    if(!questions.length)return toast("Add learning material before starting this assessment");
    startSession(`${subjectLabel(subject)} Assessment`,questions,mode,0,{assessment:true,assessmentSubject:subject});
  }
  function startSession(title,questions,mode,minutes=0,options={}){playStartCue();session={title,questions,index:0,correct:0,answeredCount:0,mode,locked:false,minutes,deadline:minutes?Date.now()+minutes*60000:0,timedOut:false,startedAt:Date.now(),earnedOrbs:0,wrongQuestions:[],completedMissions:[],newRewards:[],newChapters:[],...options};go("session");renderQuestion();}
  function resolvedMode(){return session.questions[session.index]?.modeOverride || (session.mode==="mixed"?pick(["choice","type"]):session.mode);}
  function updateTimer(){if(!session?.deadline)return;const left=Math.max(0,session.deadline-Date.now()),seconds=Math.ceil(left/1000),el=$("#timer");if(el)el.textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;if(left<=0){clearInterval(session.timerId);session.timedOut=true;renderFinish();}}
  function renderQuestion(){
    clearInterval(session?.timerId);const view=$("#sessionView");const q=session.questions[session.index];if(!q){renderFinish();return;}session.locked=false;session.currentMode=resolvedMode();
    setQuestionAudioDuck(!!q.speech);setAudioScene(session.silentMusic?"silent":"level");session.questionStarted=Date.now();
    const pct=(session.index/session.questions.length)*100,boss=session.bossId?BOSSES.find(item=>item.id===session.bossId):null,damage=Math.min(session.bossDamage||0,boss?.goal||0),health=boss?Math.max(0,Math.round((1-damage/boss.goal)*100)):0;
    const bossHud=boss?`<div class="boss-hud" style="--boss-color:${boss.color}"><img src="${boss.art}" alt="${esc(boss.name)}"><div><span>${esc(boss.sector)} boss</span><strong>${esc(boss.name)}</strong><div class="boss-health"><i style="width:${health}%"></i></div><small>${damage}/${boss.goal} signal hits</small></div></div>`:"";
    view.innerHTML=`<div class="quiz-shell">${bossHud}<div class="quiz-top"><button class="back" data-end-session aria-label="End round">×</button><div class="quiz-progress"><span style="width:${pct}%"></span></div>${session.deadline?'<div class="timer" id="timer">0:00</div>':''}<div class="score"><img src="assets/ui/energy-orb.png" alt="">${session.correct}</div></div><div class="flash-card ${q.map?'map-card':''}" id="flashCard"><p class="prompt-label">${esc(session.title)} · ${session.index+1} of ${session.questions.length}</p><div id="questionBody"></div></div></div>`;
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

  function finishAnswer(ok,q){if(session.locked)return;session.locked=true;playFormEffect(ok);const feedback=$("#feedback")||$("#interaction"),form=activeWeapon();const correction=q.subject==="math"&&!ok?`${q.a} groups of ${q.b}: ${Array(q.a).fill(q.b).join(" + ") || "0"} = ${q.answer}`:q.detail||`Answer: ${q.answer}`;const message=ok?pick(["Nice work!","You got it!","Great recall!","Level up!"]):`Good try. ${esc(correction)}`;feedback.innerHTML=`<div class="feedback ${ok?'good':'try'} mascot-feedback form-feedback fx-${form.id}"><div class="form-answer-fx" aria-hidden="true"></div><img src="${sentinelArt(ok?'success':'thinking')}" alt=""><span>${message}</span></div><button class="primary" style="margin-top:10px" data-next>${session.index===session.questions.length-1?'See results':'Next question'}</button>`;$('[data-next]').onclick=()=>grade(ok,false);}
  function recordAnswer(ok,q,elapsed=0){
    const profile=activeProfile(),stats=profile.stats,group=subjectGroup(q?.subject||"");
    const day=stats.days[today()]||{answered:0,correct:0};day.answered++;if(ok)day.correct++;stats.days[today()]=day;
    const subject=stats.subjects[group]||{answered:0,correct:0,totalMs:0};subject.answered++;subject.totalMs=(subject.totalMs||0)+elapsed;if(ok)subject.correct++;stats.subjects[group]=subject;
    const skillId=mistakeKey(q),skill=stats.skills[skillId]||{subject:group,prompt:q.prompt,answer:q.answer,answered:0,correct:0};skill.answered++;if(ok)skill.correct++;stats.skills[skillId]=skill;
    const existing=stats.mistakes[skillId];
    if(ok&&existing)existing.corrected=(existing.corrected||0)+1;
    if(!ok){const snapshot=questionSnapshot(q),mistake=existing||{...snapshot,misses:0,corrected:0};mistake.misses=(mistake.misses||0)+1;mistake.lastSeen=today();stats.mistakes[skillId]=mistake;session.wrongQuestions.push(snapshot);}
    if(ok){stats.stars=(stats.stars||0)+1;session.earnedOrbs=(session.earnedOrbs||0)+1;}
    const selected=MISSIONS.find(m=>m.id===profile.activeMissionId&&m.subject===group&&missionUnlocked(profile,m)&&(profile.missions[m.id]?.progress||0)<m.goal);
    const mission=selected||currentMissionFor(profile,group);
    if(ok&&mission){const beforeRewards=unlockedRewards(profile).map(r=>r.name),beforeChapters=CHAPTERS.filter(chapter=>chapterUnlocked(profile,chapter)).map(chapter=>chapter.id),state=profile.missions[mission.id]||{progress:0,complete:false};if(!state.complete){state.progress=Math.min(mission.goal,(state.progress||0)+1);profile.missions[mission.id]=state;if(state.progress>=mission.goal){state.complete=true;stats.stars=(stats.stars||0)+mission.reward;session.earnedOrbs+=mission.reward;session.completedMissions.push(mission);const next=MISSIONS.find(m=>m.subject===group&&missionUnlocked(profile,m)&&(profile.missions[m.id]?.progress||0)<m.goal);if(next)profile.activeMissionId=next.id;}const afterRewards=unlockedRewards(profile).filter(r=>!beforeRewards.includes(r.name));session.newRewards.push(...afterRewards);const newChapters=CHAPTERS.filter(chapter=>chapterUnlocked(profile,chapter)&&!beforeChapters.includes(chapter.id));session.newChapters.push(...newChapters);}}
    syncActiveProfile();
  }
  function grade(ok,withSound=true){if(withSound)playFormEffect(ok);const q=session.questions[session.index],elapsed=Math.max(0,Date.now()-(session.questionStarted||Date.now()));session.answeredCount=(session.answeredCount||0)+1;if(ok){session.correct++;if(session.bossId)session.bossDamage=(session.bossDamage||0)+1;}recordAnswer(ok,q,elapsed);save();if(session.bossId&&session.bossDamage>=session.bossGoal){session.bossDefeated=true;session.index=session.questions.length;}else session.index++;renderQuestion();}
  function wireSwipe(){let startX=0;const card=$("#flashCard");card.addEventListener('touchstart',e=>startX=e.touches[0].clientX,{passive:true});card.addEventListener('touchend',e=>{if($("#revealed")?.hidden)return;const d=e.changedTouches[0].clientX-startX;if(Math.abs(d)>70)grade(d>0);},{passive:true});}

  async function renderStateMap(state){const stage=$("#mapStage");try{if(!mapTopology){const res=await fetch("vendor/states-10m.json");mapTopology=await res.json();}const features=topojson.feature(mapTopology,mapTopology.objects.states).features;const feature=features.find(f=>String(f.id).padStart(2,'0')===state.id);const projection=d3.geoIdentity().reflectY(true).fitExtent([[18,14],[332,218]],feature);const path=d3.geoPath(projection);stage.innerHTML=`<svg viewBox="0 0 350 232" role="img" aria-label="Unlabeled state outline"><path d="${path(feature)}"></path></svg>`;}catch{stage.innerHTML=`<div class="feedback try">This state outline could not load. Try reopening the app.</div>`;}}
  function renderFinish(){
    clearInterval(session?.timerId);setQuestionAudioDuck(false);setAudioScene("finished");
    const boss=session.bossId?BOSSES.find(item=>item.id===session.bossId):null,profile=activeProfile(),bossWon=!!boss&&(session.bossDefeated||session.bossDamage>=boss.goal);
    const total=boss?(session.answeredCount||session.index):(session.timedOut?session.index:session.questions.length),correct=session.correct,pct=Math.round(correct/Math.max(1,total)*100),pose=bossWon||pct>=60?'success':'thinking';
    const missed=[...new Map((session.wrongQuestions||[]).map(q=>[mistakeKey(q),q])).values()];
    if(bossWon&&!bossDefeated(profile,boss)){profile.bosses[boss.id]={defeated:true,date:today()};profile.stats.stars=(profile.stats.stars||0)+boss.reward;session.earnedOrbs=(session.earnedOrbs||0)+boss.reward;if(boss.id==="doubt-cloud"){const finale=CHAPTERS.find(chapter=>chapter.id==="arcade-reborn");if(finale&&!profile.seenChapters.includes(finale.id))session.newChapters.push(finale);}save();}
    if(!session.roundSaved){const stats=activeProfile().stats,round={date:today(),title:session.title,total,correct,accuracy:pct,durationMs:Date.now()-(session.startedAt||Date.now()),assessment:!!session.assessment};stats.rounds.push(round);stats.rounds=stats.rounds.slice(-100);if(session.assessment&&session.assessmentSubject)stats.assessments[session.assessmentSubject]=round;session.roundSaved=true;save();}
    const completed=session.completedMissions||[],newRewards=session.newRewards||[],newChapters=session.newChapters||[];
    $("#sessionView").innerHTML=`${head(boss?bossWon?"Boss defeated!":"Boss retreat":session.timedOut?"Time's up!":session.assessment?"Assessment complete!":"Mission round complete!",session.title,"home")}
      ${boss?`<section class="boss-result ${bossWon?'defeated':'retry'}" style="--boss-color:${boss.color}"><img class="boss-result-enemy" src="${boss.art}" alt="${esc(boss.name)}"><img class="boss-result-hero" src="${sentinelArt(pose)}" alt="Circuit Sentinel"><div><p class="eyebrow">${bossWon?'Sector restored':'Signal still unstable'}</p><h2>${bossWon?`${esc(boss.name)} cleared!`:`${session.bossDamage||0} of ${boss.goal} hits landed`}</h2><p>${bossWon?`The ${esc(boss.sector)} is secure. Boss reward: ${boss.reward} bonus orbs.`:esc(boss.hint)}</p></div></section>`:''}
      <div class="result-hero ${bossWon||pct>=80?'victory':'practice'} form-result"><div class="result-burst"></div><img class="result-mascot" src="${sentinelArt(pose)}" alt="Circuit Sentinel ${bossWon||pct>=60?'celebrating':'thinking'}"><div class="result-copy"><p class="eyebrow">${bossWon?activeWeapon(profile).ability:pct>=90?'Gold signal':pct>=75?'Strong signal':'Signal training'}</p><h1>${correct} of ${total}</h1><div class="result-stars" aria-label="Performance rating">${[1,2,3].map((star,i)=>`<span class="${pct>=[60,75,90][i]?'lit':''}">★</span>`).join('')}</div><p>${bossWon?`${activeWeapon(profile).name} delivered the finishing signal.`:session.timedOut?`You answered ${total} before time ended. `:''}${bossWon?'':pct>=90?'Outstanding work—the sector is glowing!':pct>=75?'Great progress. Your recall is getting stronger.':pct>=60?'Solid practice. Repair the missed signals next.':'Every repaired mistake makes the Sentinel stronger.'}</p></div></div>
      <div class="result-rewards"><div><img src="assets/ui/energy-orb.png" alt=""><strong>+${session.earnedOrbs||0}</strong><span>Energy orbs</span></div><div><strong>${pct}%</strong><span>Accuracy</span></div><div><strong>${missed.length}</strong><span>To repair</span></div></div>
      ${completed.map(mission=>`<div class="panel mission-celebration"><img src="assets/characters/professor-volt.png" alt="Professor Volt"><div><p class="eyebrow">Mission complete</p><h2>${esc(mission.title)}</h2><p class="helper">Professor Volt restored another arcade system. Bonus: ${mission.reward} orbs.</p></div></div>`).join('')}
      ${newRewards.map(reward=>`<div class="unlock-banner"><span>${reward.icon}</span><div><p class="eyebrow">New Sentinel reward</p><h2>${esc(reward.name)}</h2></div></div>`).join('')}
      ${newChapters.map(chapter=>`<button class="chapter-unlock" data-chapter="${chapter.id}" style="--chapter-accent:${chapter.accent}"><span>NEW STORY</span><strong>${esc(chapter.number)} · ${esc(chapter.title)}</strong><small>Play the new animated transmission ›</small></button>`).join('')}
      <div class="stack">${missed.length?'<button class="primary" data-repair>Practice missed answers</button>':''}<button class="${missed.length?'secondary':'primary'}" data-again>${boss?(bossWon?'Replay boss mission':'Retry boss mission'):'Practice this round again'}</button><button class="secondary" data-go="armory">Open Orb Shop & Locker</button><button class="secondary" data-go="story">Open mission map</button><button class="secondary" data-go="reports">View assessment report</button><button class="secondary" data-go="home">Back to quests</button></div>`;
    $('[data-repair]')?.addEventListener('click',()=>startMistakeRound(missed));
    $$('[data-chapter]').forEach(button=>button.onclick=()=>openChapter(button.dataset.chapter));
    $('[data-again]').onclick=()=>{session.index=0;session.correct=0;session.answeredCount=0;session.bossDamage=0;session.bossDefeated=false;session.roundSaved=false;session.timedOut=false;session.startedAt=Date.now();session.earnedOrbs=0;session.wrongQuestions=[];session.completedMissions=[];session.newRewards=[];session.newChapters=[];session.deadline=session.minutes?Date.now()+session.minutes*60000:0;session.questions=boss?bossQuestions(boss):shuffle(session.questions);renderQuestion();};
  }

  function renderSettings(){
    $("#settingsView").innerHTML=`${head("Parent Setup","Update weekly practice without rebuilding the app")}
      <div class="panel"><h2>Learner profiles</h2><p class="helper">Create or switch local profiles so reports and missions stay separate for each learner.</p><button class="secondary" data-go="profiles">Manage profiles</button></div>
      <div class="panel audio-mixer"><div class="panel-title-row"><div><p class="label">Audio mixer</p><h2>Sound levels</h2></div><label class="settings-sound-toggle"><input type="checkbox" id="settingsSoundEnabled" ${store.audioPrefs.enabled?'checked':''}> Sound on</label></div><p class="helper">Master Volume controls everything. Music and sound effects can be balanced separately.</p>${[['master','Master Volume'],['music','Music Volume'],['effects','Sound Effect Volume']].map(([key,label])=>`<label class="mixer-row"><span>${label}</span><input type="range" min="0" max="100" value="${Math.round(store.audioPrefs[key]*100)}" data-mixer="${key}" aria-label="${label}"><output data-mixer-output="${key}">${Math.round(store.audioPrefs[key]*100)}%</output></label>`).join('')}</div>
      <div class="panel" id="spellingSettings"><h2>Spelling word bank</h2><p class="helper">Enter one word per line or separate words with commas.</p><div class="field"><textarea id="wordBank">${esc(store.spelling.join("\n"))}</textarea></div><button class="primary" id="saveWords">Save word bank</button></div>
      <div class="panel" id="poemSettings"><h2>Poems</h2><div class="stack">${store.poems.map((p,i)=>`<div class="list-item"><span class="grow"><strong>${esc(p.title)}</strong><small>${esc(p.author||"")}</small></span><button class="tiny" data-edit-poem="${i}">Edit</button></div>`).join("")}</div><button class="secondary" style="margin-top:10px" id="addPoem">Add a poem</button><div id="poemEditor"></div></div>
      <div class="panel"><h2>Save protection</h2><p class="helper">Progress is saved on this device. Download a backup before deleting and re-adding the home-screen app.</p><div class="two"><button class="secondary" id="exportData">Download backup</button><button class="secondary" id="importData">Import backup</button></div><input type="file" id="importFile" accept="application/json" hidden></div>
      <div class="panel"><h2>Home-screen updates</h2><p class="helper">Tap “Check for update” to load the newest code without replacing saved progress. iPhone may require removing and re-adding the home-screen shortcut before a new app icon appears.</p><button class="secondary" id="checkUpdate">Check for update</button></div>`;
    wireMixerControls();
    $("#saveWords").onclick=()=>{store.spelling=$("#wordBank").value.split(/[\n,]+/).map(w=>w.trim()).filter(Boolean);save();toast(`${store.spelling.length} spelling words saved`);};
    $("#addPoem").onclick=()=>renderPoemEditor();$$('[data-edit-poem]').forEach(b=>b.onclick=()=>renderPoemEditor(+b.dataset.editPoem));
    $("#exportData").onclick=exportData;$("#importData").onclick=()=>$("#importFile").click();$("#importFile").onchange=importData;
    $("#checkUpdate").onclick=async()=>{if(!('serviceWorker'in navigator)){toast('No update is waiting');return;}const reg=await navigator.serviceWorker.getRegistration();await reg?.update();toast('Update check complete');};
  }
  function syncMixerControls(){const top=$("#soundVolume");if(top)top.value=Math.round(masterVolume()*100);['master','music','effects'].forEach(key=>{const input=$(`[data-mixer="${key}"]`),output=$(`[data-mixer-output="${key}"]`);if(input)input.value=Math.round(store.audioPrefs[key]*100);if(output)output.textContent=`${Math.round(store.audioPrefs[key]*100)}%`;});const toggle=$("#settingsSoundEnabled");if(toggle)toggle.checked=store.audioPrefs.enabled;}
  function wireMixerControls(){syncMixerControls();$$('[data-mixer]').forEach(input=>input.oninput=()=>{audioUnlocked=true;ensureAudioGraph();store.audioPrefs[input.dataset.mixer]=Number(input.value)/100;applySoundVolumes();save();syncMixerControls();if(store.audioPrefs.enabled&&backgroundMusic.paused&&audioScene!=="silent")setAudioScene(audioScene);});const toggle=$("#settingsSoundEnabled");if(toggle)toggle.onchange=()=>{store.audioPrefs.enabled=toggle.checked;$("#soundEnabled").checked=toggle.checked;audioUnlocked=true;ensureAudioGraph();if(!toggle.checked){activeAudio?.pause();voiceCue.pause();window.speechSynthesis?.cancel();}applySoundVolumes();save();setAudioScene(audioScene);};}
  function renderPoemEditor(index){const poem=Number.isInteger(index)?store.poems[index]:{title:"",author:"",text:""};$("#poemEditor").innerHTML=`<div class="field"><label>Title</label><input id="poemTitle" value="${esc(poem.title)}"></div><div class="field"><label>Author</label><input id="poemAuthor" value="${esc(poem.author)}"></div><div class="field"><label>Poem text</label><textarea id="poemText">${esc(poem.text)}</textarea></div><div class="two"><button class="primary" id="savePoem">Save poem</button>${Number.isInteger(index)?'<button class="danger-btn" id="deletePoem">Delete</button>':''}</div>`;$("#poemTitle").focus();$("#savePoem").onclick=()=>{const title=$("#poemTitle").value.trim(),text=$("#poemText").value.trim();if(!title||!text){toast('Add a title and poem text');return;}const next={id:(poem.id||title.toLowerCase().replace(/[^a-z0-9]+/g,'-'))+(!Number.isInteger(index)?`-${Date.now()}`:''),title,author:$("#poemAuthor").value.trim(),text,...(poem.audio?{audio:poem.audio}:{})};if(Number.isInteger(index))store.poems[index]=next;else store.poems.push(next);save();renderSettings();toast('Poem saved');};if(Number.isInteger(index))$("#deletePoem").onclick=()=>{if(store.poems.length===1){toast('Keep at least one poem');return;}store.poems.splice(index,1);save();renderSettings();};}
  function exportData(){const blob=new Blob([JSON.stringify(store,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`learning-arcade-backup-${today()}.json`;a.click();URL.revokeObjectURL(a.href);}
  function importData(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result);store={...defaults,...parsed};localStorage.setItem(STORE,JSON.stringify(store));location.reload();}catch{toast('That backup could not be read');}};reader.readAsText(file);}

  document.addEventListener("click", e => {const nav=e.target.closest("[data-go]");if(nav)go(nav.dataset.go);});
  window.addEventListener("hashchange",()=>go(location.hash.slice(1)||"home"));
  if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js?v=20"));
  if (document.modelContext?.registerTool) {
    const register = tool => Promise.resolve(document.modelContext.registerTool(tool)).catch(() => {});
    register({name:"read_learning_sets",title:"Read learning sets",description:"Read the current spelling words and poem titles configured in Learning Arcade.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>({spellingWords:[...store.spelling],poems:store.poems.map(p=>({id:p.id,title:p.title,author:p.author}))})});
    register({name:"update_spelling_words",title:"Update spelling words",description:"Replace the weekly spelling word bank and update the visible app.",inputSchema:{type:"object",properties:{words:{type:"array",items:{type:"string",minLength:1},minItems:1}},required:["words"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:({words})=>{if(!Array.isArray(words)||!words.length)throw new Error("At least one word is required");store.spelling=[...new Set(words.map(w=>String(w).trim()).filter(Boolean))];save();if($("[data-screen='settings']").classList.contains("active"))renderSettings();return{saved:true,count:store.spelling.length};}});
    register({name:"add_practice_poem",title:"Add practice poem",description:"Add a poem to the memorization and recitation list.",inputSchema:{type:"object",properties:{title:{type:"string",minLength:1},author:{type:"string"},text:{type:"string",minLength:1}},required:["title","text"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:({title,author="",text})=>{if(!String(title).trim()||!String(text).trim())throw new Error("Title and poem text are required");const poem={id:`poem-${Date.now()}`,title:String(title).trim(),author:String(author).trim(),text:String(text).trim()};store.poems.push(poem);save();if($("[data-screen='poems']").classList.contains("active"))renderPoems();return{saved:true,id:poem.id,title:poem.title};}});
  }
  wireSoundControls();renderHome();setAudioScene("menu");
})();
