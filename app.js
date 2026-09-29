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
  const createProfile = (name="Player 1", stats=blankStats()) => ({id:`profile-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,name,stats,missions:{},activeMissionId:"state-scan-1",inventory:["core"],equippedWeapon:"core",consumables:{},cosmeticsOwned:[],equippedCosmetics:{},tracksOwned:[],equippedTrack:"",seenChapters:[],bosses:{},homeworkTasks:[],homeworkRewards:[]});
  const SECTORS = {
    states:{title:"Atlas Station",subtitle:"State Quest",icon:"⌖",className:"atlas",target:"states"},
    spelling:{title:"Word Workshop",subtitle:"Word Wizard",icon:"Aa",className:"words",target:"spelling"},
    math:{title:"Multiplication Reactor",subtitle:"Math Mayhem",icon:"×",className:"reactor",target:"math"},
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
  const SUPPORT_ITEMS = [
    {id:"targeting",name:"Targeting Chip",cost:10,icon:"◎",description:"Remove one incorrect multiple-choice option.",limit:9},
    {id:"letter",name:"Letter Scanner",cost:10,icon:"Aa",description:"Reveal one letter in a typed spelling answer.",limit:9},
    {id:"recall",name:"Recall Chip",cost:15,icon:"↻",description:"Put a missed question immediately back in the mission.",limit:9},
    {id:"time",name:"Time Battery",cost:15,icon:"+30",description:"Add 30 seconds to a timed mission.",limit:9},
    {id:"map",name:"Map Scanner",cost:15,icon:"⌖",description:"Reveal a useful State Quest location clue.",limit:9},
    {id:"verse",name:"Verse Echo",cost:10,icon:"❝",description:"Reveal the opening word of a poem answer.",limit:9},
    {id:"shield",name:"Shield Cell",cost:20,icon:"◇",description:"Protect the next life from an incorrect answer.",limit:9},
    {id:"repair",name:"Repair Capsule",cost:25,icon:"+1",description:"Restore one life during a three-life mission.",limit:9},
    {id:"reboot",name:"Emergency Reboot",cost:40,icon:"⚡",description:"Continue once after losing all three lives.",limit:5}
  ];
  const COSMETICS = [
    {id:"frame-cyan",name:"Cyan Circuit Frame",cost:30,type:"frame",value:"cyan",icon:"▣",description:"A glowing cyan frame around your active-pilot badge."},
    {id:"frame-gold",name:"Gold Core Frame",cost:45,type:"frame",value:"gold",icon:"▣",description:"A gold energy frame for the pilot display."},
    {id:"trail-prism",name:"Prism Orb Trail",cost:55,type:"trail",value:"prism",icon:"✦",description:"A rainbow energy trail on rewards and results."},
    {id:"trail-static",name:"Static Spark Trail",cost:55,type:"trail",value:"static",icon:"ϟ",description:"Electric sparks follow collected Energy Orbs."},
    {id:"theme-violet",name:"Violet Grid Theme",cost:75,type:"theme",value:"violet",icon:"◈",description:"A violet circuitry accent across Student Arcade."},
    {id:"theme-gold",name:"Solar Grid Theme",cost:90,type:"theme",value:"gold",icon:"☀",description:"A warm gold command-grid accent."},
    {id:"title-pathfinder",name:"Pathfinder Title",cost:35,type:"title",value:"Pathfinder",icon:"⌖",description:"Display Pathfinder beside the active pilot."},
    {id:"title-core-keeper",name:"Core Keeper Title",cost:50,type:"title",value:"Core Keeper",icon:"◆",description:"Display Core Keeper beside the active pilot."}
  ];
  const MUSIC_TRACKS = [
    {id:"storm-eagle",name:"Storm Eagle Theme X",cost:65,file:"audio/shop-music/storm-eagle-theme-x.mp3"},
    {id:"infinity-mjinion",name:"Infinity Mjinion Theme",cost:65,file:"audio/shop-music/infinity-mjinion-theme.mp3"},
    {id:"esperanto",name:"Esperanto",cost:65,file:"audio/shop-music/esperanto.mp3"},
    {id:"straight-ahead",name:"Straight Ahead",cost:65,file:"audio/shop-music/straight-ahead.mp3"},
    {id:"storm-owl",name:"Storm Owl Theme X4",cost:65,file:"audio/shop-music/storm-owl-theme-x4.mp3"},
    {id:"wily-castle",name:"Wily's Castle Theme",cost:65,file:"audio/shop-music/wilys-castle-theme.mp3"},
    {id:"zero-theme",name:"Zero Theme",cost:65,file:"audio/shop-music/zero-theme.mp3"},
    {id:"x5-opening",name:"X5 Opening",cost:65,file:"audio/shop-music/x5-opening.mp3"},
    {id:"cannonball",name:"Cannonball Mythos",cost:65,file:"audio/shop-music/cannonball-mythos.mp3"},
    {id:"x-vs-zero",name:"X Vs Zero",cost:65,file:"audio/shop-music/x-vs-zero.mp3"}
  ];
  const STATE_NEIGHBORS = {
    AL:["FL","GA","MS","TN"],AK:[],AZ:["CA","CO","NV","NM","UT"],AR:["LA","MS","MO","OK","TN","TX"],CA:["AZ","NV","OR"],CO:["AZ","KS","NE","NM","OK","UT","WY"],CT:["MA","NY","RI"],DE:["MD","NJ","PA"],DC:["MD","VA"],FL:["AL","GA"],GA:["AL","FL","NC","SC","TN"],HI:[],ID:["MT","NV","OR","UT","WA","WY"],IL:["IA","IN","KY","MO","WI"],IN:["IL","KY","MI","OH"],IA:["IL","MN","MO","NE","SD","WI"],KS:["CO","MO","NE","OK"],KY:["IL","IN","MO","OH","TN","VA","WV"],LA:["AR","MS","TX"],ME:["NH"],MD:["DC","DE","PA","VA","WV"],MA:["CT","NH","NY","RI","VT"],MI:["IN","OH","WI"],MN:["IA","ND","SD","WI"],MS:["AL","AR","LA","TN"],MO:["AR","IA","IL","KS","KY","NE","OK","TN"],MT:["ID","ND","SD","WY"],NE:["CO","IA","KS","MO","SD","WY"],NV:["AZ","CA","ID","OR","UT"],NH:["ME","MA","VT"],NJ:["DE","NY","PA"],NM:["AZ","CO","OK","TX","UT"],NY:["CT","MA","NJ","PA","VT"],NC:["GA","SC","TN","VA"],ND:["MN","MT","SD"],OH:["IN","KY","MI","PA","WV"],OK:["AR","CO","KS","MO","NM","TX"],OR:["CA","ID","NV","WA"],PA:["DE","MD","NJ","NY","OH","WV"],RI:["CT","MA"],SC:["GA","NC"],SD:["IA","MN","MT","ND","NE","WY"],TN:["AL","AR","GA","KY","MS","MO","NC","VA"],TX:["AR","LA","NM","OK"],UT:["AZ","CO","ID","NV","NM","WY"],VT:["MA","NH","NY"],VA:["DC","KY","MD","NC","TN","WV"],WA:["ID","OR"],WV:["KY","MD","OH","PA","VA"],WI:["IA","IL","MI","MN"],WY:["CO","ID","MT","NE","SD","UT"]
  };
  const STATE_DISCOVERY = {
    AL:"The U.S. Space & Rocket Center is in Huntsville.",AK:"Denali, North America's highest peak, is here.",AZ:"The Grand Canyon crosses its northern landscape.",AR:"Hot Springs National Park protects historic bathhouses.",CA:"Its landmarks include Yosemite and the Golden Gate Bridge.",CO:"The Rocky Mountains cross the center of the state.",CT:"Its flag shows three grapevines on a blue field.",DE:"It was the first state to ratify the Constitution.",DC:"The Washington Monument and U.S. Capitol are here.",FL:"The Everglades cover part of its southern peninsula.",GA:"Its flag includes the state coat of arms and thirteen stars.",HI:"It is the only state made entirely of islands.",ID:"Hells Canyon lies along part of its western border.",IL:"Chicago stands on the shore of Lake Michigan.",IN:"The Indianapolis 500 is held here.",IA:"The state lies between the Missouri and Mississippi Rivers.",KS:"Its flag includes a sunflower above the state seal.",KY:"Mammoth Cave, the world's longest known cave system, is here.",LA:"The Mississippi River delta and bayous shape its coast.",ME:"Acadia National Park sits along its Atlantic coast.",MD:"Chesapeake Bay divides much of the state.",MA:"Plymouth and the Freedom Trail are important historic sites.",MI:"It consists of two peninsulas surrounded by Great Lakes.",MN:"Its nickname refers to its thousands of lakes.",MS:"The Mississippi River forms much of its western border.",MO:"The Gateway Arch stands beside the Mississippi River.",MT:"Glacier National Park stretches across its northern mountains.",NE:"Chimney Rock guided many travelers moving west.",NV:"Most of the state lies within the Great Basin.",NH:"Mount Washington rises in the White Mountains.",NJ:"Its eastern shore faces the Atlantic Ocean.",NM:"White Sands National Park contains enormous gypsum dunes.",NY:"Niagara Falls lies along its border with Canada.",NC:"The Outer Banks form a long chain of barrier islands.",ND:"Theodore Roosevelt National Park protects colorful badlands.",OH:"The Rock and Roll Hall of Fame is in Cleveland.",OK:"Its panhandle extends west between Kansas and Texas.",OR:"Crater Lake fills an ancient volcanic caldera.",PA:"The Liberty Bell is in Philadelphia.",RI:"It is the smallest U.S. state by area.",SC:"Fort Sumter stands in Charleston Harbor.",SD:"Mount Rushmore is carved into the Black Hills.",TN:"Great Smoky Mountains National Park lies along its eastern border.",TX:"The Alamo is in San Antonio.",UT:"Five national parks protect its red-rock landscapes.",VT:"The Green Mountains run north to south through the state.",VA:"Shenandoah National Park follows the Blue Ridge Mountains.",WA:"Mount Rainier is a glacier-covered volcano.",WV:"The New River Gorge cuts through the Appalachian Mountains.",WI:"Its shoreline touches Lake Michigan and Lake Superior.",WY:"Yellowstone became the world's first national park."
  };
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
    spelling: [],
    poems: window.DEFAULT_POEMS,
    stats: {stars: 0, days: {}},
    statePrefs: {region:"Northeast Region", division:"All", customStates:[], mode:"mixed", kind:"mixed", count:"10", challenge:true},
    mathPrefs: {tables:[0,1,2,3,4,5,6,7,8,9], mode:"mixed", count:"10", timer:"0", challenge:true},
    spellingPrefs: {mode:"mixed", count:"max", challenge:true},
    challengePrefs: {poems:true,study:true},
    voicePrefs: {source:"system", voiceURI:"", style:"bright"},
    audioPrefs: {enabled:true,master:.7,music:.45,effects:.8},
    studySets: [],
    statePresets: [],
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
    profile.seenChapters=Array.isArray(profile.seenChapters)?profile.seenChapters.filter(id=>CHAPTERS.some(chapter=>chapter.id===id)):[];
    profile.bosses=profile.bosses&&typeof profile.bosses==="object"?profile.bosses:{};
    profile.homeworkTasks=Array.isArray(profile.homeworkTasks)?profile.homeworkTasks:[];
    profile.homeworkRewards=Array.isArray(profile.homeworkRewards)?profile.homeworkRewards:[];
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
  store.spellingPrefs = {...defaults.spellingPrefs, ...(store.spellingPrefs || {})};
  store.challengePrefs = {...defaults.challengePrefs, ...(store.challengePrefs || {})};
  store.voicePrefs = {...defaults.voicePrefs, ...(store.voicePrefs || {})};
  store.studySets = Array.isArray(store.studySets) ? store.studySets : [];
  store.statePresets = Array.isArray(store.statePresets) ? store.statePresets : [];
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
    store.audioContentV3=true;
    saveSoon();
  }
  const legacyBrandedPoem=store.poems.find(poem=>poem.author==="Asher's Learning Arcade");
  if(legacyBrandedPoem){store.poems.forEach(poem=>{if(poem.author==="Asher's Learning Arcade")poem.author="Learning Arcade";});saveSoon();}
  const save = () => localStorage.setItem(STORE, JSON.stringify(store));
  function saveSoon(){setTimeout(()=>localStorage.setItem(STORE,JSON.stringify(store)),0);}
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
  let availableVoices = [];
  let activeAudio = null;
  let audioUnlocked = false;
  let audioScene = "menu";
  let musicDucked = false;
  let questionAudioDucked = false;
  let openingPlayed = false, openingAttempting = false;
  let audioContext = null, masterGain = null, musicGain = null, effectsGain = null, voiceGain = null;
  const mediaSources = new WeakMap();
  const MUSIC = {menu:"audio/interface/game-select.mp3",level:"audio/interface/level-play.mp3",finished:"audio/interface/round-finished.mp3"};
  const CUES = {opening:"audio/interface/professor-opening.mp3",start:"audio/interface/sentinel-start.mp3"};
  const backgroundMusic = new Audio(); backgroundMusic.loop=true; backgroundMusic.preload="auto";
  const previewMusic = new Audio(); previewMusic.loop=false; previewMusic.preload="metadata";
  const answerSound = new Audio("audio/interface/answer-selected.wav"); answerSound.preload="auto";
  const wrongAnswerSound = new Audio("audio/interface/wrong-answer.mp3"); wrongAnswerSound.preload="auto";
  const voiceCue = new Audio(CUES.opening); voiceCue.preload="auto";

  const clampVolume=value=>Math.max(0,Math.min(1,Number(value)||0));
  function masterVolume(){return clampVolume(store.audioPrefs.master);}
  function musicVolume(){return clampVolume(store.audioPrefs.music);}
  function effectsVolume(){return clampVolume(store.audioPrefs.effects);}
  function connectMedia(media,gain){if(!audioContext||!gain||mediaSources.has(media))return;const source=audioContext.createMediaElementSource(media);source.connect(gain);mediaSources.set(media,source);media.volume=1;}
  function ensureAudioGraph(){const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)return;try{if(!audioContext){audioContext=new AudioContextClass();masterGain=audioContext.createGain();musicGain=audioContext.createGain();effectsGain=audioContext.createGain();voiceGain=audioContext.createGain();musicGain.connect(masterGain);effectsGain.connect(masterGain);voiceGain.connect(masterGain);masterGain.connect(audioContext.destination);connectMedia(backgroundMusic,musicGain);connectMedia(previewMusic,musicGain);connectMedia(answerSound,effectsGain);connectMedia(wrongAnswerSound,effectsGain);connectMedia(voiceCue,voiceGain);if(activeAudio)connectMedia(activeAudio,voiceGain);}if(audioContext.state==="suspended")audioContext.resume().catch(()=>{});applySoundVolumes();}catch{audioContext=null;masterGain=musicGain=effectsGain=voiceGain=null;}}
  function applySoundVolumes(){const duck=musicDucked?.05:questionAudioDucked?.16:1,master=store.audioPrefs.enabled?masterVolume():0,music=musicVolume()*duck,effects=effectsVolume();document.body.dataset.masterVolume=String(masterVolume());document.body.dataset.musicVolume=String(musicVolume());document.body.dataset.effectsVolume=String(effectsVolume());document.body.dataset.effectiveMusicVolume=String(master*music);if(audioContext&&masterGain){masterGain.gain.value=master;musicGain.gain.value=music;effectsGain.gain.value=effects;voiceGain.gain.value=1;[backgroundMusic,previewMusic,answerSound,wrongAnswerSound,voiceCue,activeAudio].filter(Boolean).forEach(media=>media.volume=1);}else{backgroundMusic.volume=master*music;previewMusic.volume=master*music;answerSound.volume=master*effects;wrongAnswerSound.volume=master*effects;voiceCue.volume=master;if(activeAudio)activeAudio.volume=master;}}
  function musicSource(scene){const track=MUSIC_TRACKS.find(item=>item.id===activeProfile()?.equippedTrack);return scene==="level"&&track?track.file:(MUSIC[scene]||MUSIC.menu);}
  function setAudioScene(scene){audioScene=scene;document.body.dataset.audioScene=scene;document.body.dataset.soundEnabled=String(store.audioPrefs.enabled);if(scene==="silent"){backgroundMusic.pause();applySoundVolumes();return;}const source=musicSource(scene);if(backgroundMusic.getAttribute("src")!==source){backgroundMusic.src=source;backgroundMusic.load();}applySoundVolumes();if(!store.audioPrefs.enabled||!audioUnlocked){backgroundMusic.pause();return;}ensureAudioGraph();backgroundMusic.play().catch(()=>{});}
  function previewTrack(track){if(!track||!store.audioPrefs.enabled)return toast("Turn sound on to preview music");audioUnlocked=true;ensureAudioGraph();backgroundMusic.pause();previewMusic.pause();previewMusic.src=track.file;previewMusic.currentTime=0;previewMusic.onended=()=>setAudioScene(audioScene);previewMusic.play().catch(()=>setAudioScene(audioScene));setTimeout(()=>{if(!previewMusic.paused){previewMusic.pause();setAudioScene(audioScene);}},15000);}
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
  function playVoiceCue(source){if(!store.audioPrefs.enabled||!audioUnlocked)return Promise.resolve(false);ensureAudioGraph();voiceCue.pause();if(voiceCue.getAttribute("src")!==source){voiceCue.src=source;voiceCue.load();}voiceCue.currentTime=0;duckMusic(true);voiceCue.onended=()=>duckMusic(false);voiceCue.onerror=()=>duckMusic(false);return voiceCue.play().then(()=>true).catch(()=>{duckMusic(false);return false;});}
  function tryOpeningCue(){if(openingPlayed||openingAttempting||!store.audioPrefs.enabled||!$("[data-screen='home']").classList.contains("active"))return;openingAttempting=true;playVoiceCue(CUES.opening).then(started=>{openingAttempting=false;if(started)openingPlayed=true;});}
  function playStartCue(){playVoiceCue(CUES.start);}
  function wireSoundControls(){const enabled=$("#soundEnabled"),volume=$("#soundVolume");enabled.checked=store.audioPrefs.enabled;volume.value=Math.round(masterVolume()*100);enabled.onchange=()=>{audioUnlocked=true;ensureAudioGraph();store.audioPrefs.enabled=enabled.checked;if(!enabled.checked){activeAudio?.pause();voiceCue.pause();window.speechSynthesis?.cancel();duckMusic(false);}save();applySoundVolumes();setAudioScene(audioScene);};volume.oninput=()=>{audioUnlocked=true;ensureAudioGraph();store.audioPrefs.master=Number(volume.value)/100;applySoundVolumes();save();syncMixerControls();if(store.audioPrefs.enabled&&backgroundMusic.paused&&audioScene!=="silent")setAudioScene(audioScene);};document.addEventListener("pointerdown",()=>{if(document.body.classList.contains("intro-active"))return;audioUnlocked=true;ensureAudioGraph();setAudioScene(audioScene);},{capture:true});}

  function wireStartupGate(){
    const gate=$("#startupGate"),button=$("#enterArcade"),status=$("#startupStatus"),message=$("#startupMessage");if(!gate||!button)return;
    const launch=()=>{
      if(gate.classList.contains("launching"))return;
      gate.classList.add("launching");button.disabled=true;status.textContent="INITIALIZING CENTRAL GRID";message.textContent=store.audioPrefs.enabled?"Professor Volt is opening the Learning Arcade…":"Initializing the Learning Arcade…";
      audioUnlocked=true;ensureAudioGraph();backgroundMusic.pause();audioScene="silent";openingAttempting=true;openingPlayed=true;
      let finished=false,fallback;
      const finish=()=>{if(finished)return;finished=true;clearTimeout(fallback);openingAttempting=false;status.textContent="SYSTEMS READY";gate.classList.add("complete");setTimeout(()=>{document.body.classList.remove("intro-active");gate.hidden=true;setAudioScene("menu");showRequiredOnboarding();},420);};
      if(store.audioPrefs.enabled){voiceCue.pause();voiceCue.src=CUES.opening;voiceCue.currentTime=0;applySoundVolumes();voiceCue.onended=finish;voiceCue.onerror=finish;voiceCue.play().catch(()=>setTimeout(finish,1400));fallback=setTimeout(finish,5200);}else fallback=setTimeout(finish,1800);
    };
    button.onclick=launch;
    button.addEventListener("click",launch);
  }

  function showRequiredOnboarding(){
    if(store.onboardingVersion>=1)return;
    const gate=$("#onboardingGate"),choice=$("#onboardingProfileChoice"),name=$("#onboardingChildName");if(!gate)return;
    choice.innerHTML=store.profiles.map(profile=>`<option value="${esc(profile.id)}" ${profile.id===store.activeProfileId?'selected':''}>Keep ${esc(profile.name)} and saved progress</option>`).join("")+`<option value="new">Create a fresh child profile</option>`;
    name.value=activeProfile().name==="Player 1"?"":activeProfile().name;gate.hidden=false;document.body.classList.add("onboarding-active");
  }

  function wireOnboarding(){
    const pinStep=$("#onboardingPinStep"),profileStep=$("#onboardingProfileStep"),choice=$("#onboardingProfileChoice"),name=$("#onboardingChildName");if(!pinStep||!profileStep)return;
    const showStep=step=>{pinStep.hidden=step!==1;profileStep.hidden=step!==2;$$('[data-onboarding-dot]').forEach(dot=>dot.classList.toggle('active',+dot.dataset.onboardingDot<=step));};
    pinStep.onsubmit=event=>{event.preventDefault();const pin=$("#onboardingPin").value.trim(),confirmation=$("#onboardingPinConfirm").value.trim();if(!/^\d{4,8}$/.test(pin))return toast("Use a 4–8 digit PIN");if(pin!==confirmation)return toast("The PINs do not match");pendingOnboardingPin=pinHash(pin);showStep(2);setTimeout(()=>name.focus(),80);};
    choice.onchange=()=>{const profile=store.profiles.find(item=>item.id===choice.value);name.value=profile&&profile.name!=="Player 1"?profile.name:"";};
    $("#onboardingBack").onclick=()=>showStep(1);
    profileStep.onsubmit=event=>{event.preventDefault();const childName=name.value.trim();if(!childName)return toast("Enter the child's display name");let profile;if(choice.value==="new"){profile=createProfile(childName);store.profiles.push(profile);}else{profile=store.profiles.find(item=>item.id===choice.value)||activeProfile();profile.name=childName;}store.activeProfileId=profile.id;store.parentControls.pinHash=pendingOnboardingPin;store.onboardingVersion=1;pendingOnboardingPin="";parentUnlocked=false;homeMode="student";syncActiveProfile();applyEquippedTheme();save();$("#onboardingGate").hidden=true;document.body.classList.remove("onboarding-active");renderHome();toast("Parent Portal and Student Arcade are ready");};
  }

  function requestParentAccess(callback,always=false){
    if(!store.parentControls.pinHash){showRequiredOnboarding();return;}
    if(parentUnlocked&&!always){callback();return;}
    pendingParentAction=callback;const gate=$("#parentPinGate"),entry=$("#parentPinEntry"),error=$("#parentPinError");error.textContent="";entry.value="";gate.hidden=false;document.body.classList.add("pin-active");setTimeout(()=>entry.focus(),80);
  }

  function wireParentPinGate(){
    const gate=$("#parentPinGate"),form=$("#parentPinForm"),entry=$("#parentPinEntry"),error=$("#parentPinError");if(!gate||!form)return;
    const close=()=>{gate.hidden=true;document.body.classList.remove("pin-active");pendingParentAction=null;};
    $("#parentPinCancel").onclick=close;
    form.onsubmit=event=>{event.preventDefault();if(pinHash(entry.value.trim())!==store.parentControls.pinHash){error.textContent="That PIN was not correct. Try again.";entry.select();return;}parentUnlocked=true;const action=pendingParentAction;gate.hidden=true;document.body.classList.remove("pin-active");pendingParentAction=null;action?.();};
  }

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

  function pinHash(value=""){let hash=2166136261;for(const char of String(value)){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(36);}
  function ensureParentAccess(always=false){if(!store.parentControls.pinHash){toast("Complete Parent Portal setup first");return false;}if(parentUnlocked&&!always)return true;const entered=prompt("Enter the parent PIN");if(entered===null)return false;if(pinHash(entered)===store.parentControls.pinHash){parentUnlocked=true;return true;}toast("That PIN was not correct");return false;}
  function isoLocal(date){const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,"0"),d=String(date.getDate()).padStart(2,"0");return `${y}-${m}-${d}`;}
  function weekStart(offset=0){const date=new Date(),day=(date.getDay()+6)%7;date.setHours(12,0,0,0);date.setDate(date.getDate()-day+(offset*7));return date;}
  function addDays(date,days){const next=new Date(date);next.setDate(next.getDate()+days);return next;}
  function prettyDate(date){return date.toLocaleDateString(undefined,{month:"short",day:"numeric"});}
  function downloadText(filename,text,type="text/plain"){const blob=new Blob([text],{type}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),0);}
  function parseCSV(text){const rows=[];let row=[],cell="",quoted=false;for(let i=0;i<text.length;i++){const char=text[i],next=text[i+1];if(char==='"'&&quoted&&next==='"'){cell+='"';i++;}else if(char==='"')quoted=!quoted;else if(char===','&&!quoted){row.push(cell);cell="";}else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&next==='\n')i++;row.push(cell);if(row.some(value=>value.trim()))rows.push(row);row=[];cell="";}else cell+=char;}row.push(cell);if(row.some(value=>value.trim()))rows.push(row);return rows;}

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
    $(".home-robot").src=sentinelArt("idle",profile);
    $(".home-robot").alt=`${activeWeapon(profile).name} Circuit Sentinel`;
    $("#storyLaunchStatus").textContent=`${completedMissionCount(profile)}/20 systems restored · ${Object.keys(profile.bosses||{}).filter(id=>profile.bosses[id]?.defeated).length}/5 bosses cleared`;
    $("#homeReport").innerHTML=`<div><p class="eyebrow">${esc(profile.name)} · ${completedMissionCount(profile)}/20 missions</p><h2>${totals.answered?`${accuracy}% accuracy across ${totals.answered} answers`:"Ready to restore the Learning Arcade"}</h2><p class="helper">Current mission: ${esc(mission.title)} · ${progress}/${mission.goal}</p></div><button class="report-orb" data-go="reports" aria-label="Open reports"><img src="assets/ui/energy-orb.png" alt=""><strong>${stats.rounds.length}</strong><small>rounds</small></button>`;
    renderHomeMode();
    $$('[data-home-mode]').forEach(button=>button.onclick=()=>{const next=button.dataset.homeMode;if(next==="parent"){requestParentAccess(()=>{homeMode="parent";renderHomeMode();},true);return;}parentUnlocked=false;homeMode="student";renderHomeMode();});
  }

  function renderHomeMode(){const parent=homeMode==="parent";$$('[data-home-panel]').forEach(panel=>panel.hidden=panel.dataset.homePanel!==homeMode);$$('.dashboard-switch [data-home-mode]').forEach(button=>button.classList.toggle('selected',button.dataset.homeMode===homeMode));$(".home-cast").hidden=parent;$("#homeEyebrow").textContent=parent?"Parent Command":"Choose a quest";$("#homeTitle").textContent=parent?"What should we manage?":"What should we practice?";document.body.dataset.homeMode=homeMode;}

  function modeButtons(current) {
    return `<div class="option-grid" data-choice-group="mode">
      <button class="choice ${current === "parent" ? "selected" : ""}" data-value="parent">Parent swipe</button>
      <button class="choice ${current === "choice" ? "selected" : ""}" data-value="choice">Multiple choice</button>
      <button class="choice ${current === "type" ? "selected" : ""}" data-value="type">Fill in blank</button>
      <button class="choice ${current === "mixed" ? "selected" : ""}" data-value="mixed">Mix it up</button>
    </div>`;
  }
  function challengePanel(enabled=true){return `<div class="panel challenge-rule"><div class="panel-title-row"><div><p class="label">Mission rules</p><h2>Three-life challenge</h2></div><label class="settings-sound-toggle"><input type="checkbox" data-challenge-toggle ${enabled?'checked':''}> 3 lives</label></div><p class="helper">Turn this off for unlimited training. In challenge mode, three missed answers interrupt the run and recommend review.</p></div>`;}

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
    const regions = ["All 50","Northeast Region","Midwest Region","South Region","West Region","Custom selection"];
    const divisions = ["All 50","Custom selection"].includes(p.region) ? [] : [...new Set(STATE_DATA.filter(s=>s.region===p.region).map(s=>s.division))];
    if (p.division !== "All" && !divisions.includes(p.division)) p.division = "All";
    const selectedStates = activeStates(p.region,p.division,p.customStates);
    const setSize = selectedStates.length;
    const maxCount = stateQuestionBank(selectedStates,p.kind).length;
    if (p.count !== 'max' && +p.count > maxCount) { p.count = 'max'; store.statePrefs = p; save(); }
    $("#statesView").innerHTML = `${head("State Quest","Connect every state, capital, abbreviation, and shape")}
      <div class="panel"><p class="label">Study set</p><div class="field"><label>Region</label><select id="stateRegion">${regions.map(r=>`<option ${p.region===r?'selected':''}>${r}</option>`).join("")}</select></div><div class="field"><label>${p.region==='Custom selection'?'Selection':'Division'}</label><select id="stateDivision" ${p.region==='Custom selection'?'disabled':''}><option>${p.region==='Custom selection'?'Choose locations below':'All'}</option>${divisions.map(d=>`<option ${p.division===d?'selected':''}>${d}</option>`).join("")}</select></div><p class="helper">${setSize} location${setSize===1?'':'s'} in this study set${p.region==='South Region'?', including Washington, D.C.':'.'}</p></div>
      ${p.region==='Custom selection'?customStatePickerMarkup(p.customStates):''}
      <div class="panel state-mode-panel"><p class="label">Question style</p><div class="option-grid" data-choice-group="kind">
        <button class="choice ${p.kind === "mixed" ? "selected" : ""}" data-value="mixed">Mixed clues</button><button class="choice ${p.kind === "map" ? "selected" : ""}" data-value="map">Map shapes</button>
        <button class="choice ${p.kind === "placement" ? "selected" : ""}" data-value="placement">Place on U.S. map</button><button class="choice ${p.kind === "neighbors" ? "selected" : ""}" data-value="neighbors">Neighbor match</button>
        <button class="choice ${p.kind === "regions" ? "selected" : ""}" data-value="regions">Region sorting</button><button class="choice ${p.kind === "odd" ? "selected" : ""}" data-value="odd">Which doesn't belong?</button>
        <button class="choice ${p.kind === "capital-speed" ? "selected" : ""}" data-value="capital-speed">Capital speed run</button><button class="choice ${p.kind === "discovery" ? "selected" : ""}" data-value="discovery">Flags & landmarks</button>
        <button class="choice ${p.kind === "facts" ? "selected" : ""}" data-value="facts">Names & capitals</button><button class="choice ${p.kind === "triples" ? "selected" : ""}" data-value="triples">Three-way match</button><button class="choice ${p.kind === "spelling" ? "selected" : ""}" data-value="spelling">Spell state & capital</button>
      </div></div>
      <div class="panel"><p class="label">Round length</p><div class="option-grid" data-choice-group="count"><button class="choice ${p.count==='10'?'selected':''}" data-value="10">10 questions</button><button class="choice ${p.count==='25'?'selected':''}" data-value="25">25 questions</button><button class="choice ${p.count==='max'?'selected':''}" data-value="max">Max · ${maxCount}</button></div></div>
      <div class="panel"><p class="label">Who is holding the phone?</p>${modeButtons(p.mode)}</div>
      ${challengePanel(p.challenge)}
      <button class="primary" id="startStates" ${setSize?'':'disabled'}>${setSize?`Start ${p.count==='max'?maxCount:Math.min(+p.count,maxCount)}-question quest`:'Choose at least one location'}</button>`;
    $("#stateRegion").onchange=e=>{const previous=activeStates(p.region,p.division,p.customStates);p.region=e.target.value;p.division="All";if(p.region==='Custom selection'&&!p.customStates.length)p.customStates=previous.map(state=>state.abbr);store.statePrefs=p;save();renderStates();};
    $("#stateDivision").onchange=e=>{p.division=e.target.value;store.statePrefs=p;save();renderStates();};
    $("#customStatePicker")?.addEventListener("change",e=>{const input=e.target.closest("[data-state-abbr]");if(!input)return;p.activePresetId="";p.customStates=input.checked?[...new Set([...p.customStates,input.dataset.stateAbbr])]:p.customStates.filter(abbr=>abbr!==input.dataset.stateAbbr);store.statePrefs=p;save();renderStates();});
    $$('[data-state-preset]',$("#statesView")).forEach(button=>button.onclick=()=>{p.activePresetId="";if(button.dataset.statePreset==='clear')p.customStates=[];else if(button.dataset.statePreset==='all')p.customStates=STATE_DATA.map(state=>state.abbr);else p.customStates=[...new Set([...p.customStates,...STATE_DATA.filter(state=>state.region===button.dataset.statePreset).map(state=>state.abbr)])];store.statePrefs=p;save();renderStates();});
    $("#savedStateSet")?.addEventListener("change",e=>{const preset=store.statePresets.find(item=>item.id===e.target.value);if(!preset)return;p.activePresetId=preset.id;p.customStates=[...preset.states];store.statePrefs=p;save();renderStates();toast(`${preset.name} loaded`);});
    $("#saveStateSet")?.addEventListener("click",()=>{if(!ensureParentAccess())return;if(!p.customStates.length)return toast("Select at least one location first");const name=prompt("Name this State Quest set");if(!name?.trim())return;const preset={id:`state-set-${Date.now()}`,name:name.trim(),states:[...p.customStates]};store.statePresets.push(preset);p.activePresetId=preset.id;store.statePrefs=p;save();renderStates();toast("State set saved");});
    $("#deleteStateSet")?.addEventListener("click",()=>{if(!ensureParentAccess())return;const preset=store.statePresets.find(item=>item.id===p.activePresetId);if(!preset)return toast("Load a saved set first");if(!confirm(`Delete “${preset.name}”?`))return;store.statePresets=store.statePresets.filter(item=>item.id!==preset.id);p.activePresetId="";save();renderStates();toast("Saved state set deleted");});
    wireChoices($("#statesView"), (group, value) => { p[group] = value; store.statePrefs = p; save(); renderStates(); });
    $('[data-challenge-toggle]',$('#statesView')).onchange=e=>{p.challenge=e.target.checked;store.statePrefs=p;save();};
    $("#startStates").onclick = () => startStates(p);
  }

  function customStatePickerMarkup(selected=[]) {
    const regions=["Northeast Region","Midwest Region","South Region","West Region"];
    return `<div class="panel custom-state-panel"><div class="panel-title-row"><div><p class="label">Custom locations</p><h2>Choose only what is being taught</h2></div><span class="selection-count">${selected.length} selected</span></div><div class="saved-state-set"><select id="savedStateSet" aria-label="Saved State Quest sets"><option value="">Load a saved set…</option>${store.statePresets.map(preset=>`<option value="${esc(preset.id)}" ${store.statePrefs.activePresetId===preset.id?'selected':''}>${esc(preset.name)} · ${preset.states.length}</option>`).join("")}</select><button class="tiny" id="saveStateSet">Save current</button>${store.statePresets.length?'<button class="tiny danger-text" id="deleteStateSet">Delete selected</button>':''}</div><div class="custom-state-actions"><button class="tiny" data-state-preset="all">Select all</button><button class="tiny" data-state-preset="clear">Clear all</button></div><div id="customStatePicker" class="state-picker">${regions.map(region=>`<section class="state-region-group"><div class="state-region-heading"><strong>${esc(region.replace(" Region",""))}</strong><button class="tiny" data-state-preset="${esc(region)}">Select region</button></div>${[...new Set(STATE_DATA.filter(state=>state.region===region).map(state=>state.division))].map(division=>`<div class="state-division-group"><span>${esc(division)}</span><div class="state-check-grid">${STATE_DATA.filter(state=>state.region===region&&state.division===division).map(state=>`<label class="state-check ${selected.includes(state.abbr)?'selected':''}"><input type="checkbox" data-state-abbr="${esc(state.abbr)}" ${selected.includes(state.abbr)?'checked':''}><b>${esc(state.abbr)}</b><small>${esc(state.name)}</small></label>`).join("")}</div></div>`).join("")}</section>`).join("")}</div></div>`;
  }

  function activeStates(region,division="All",customStates=[]) { if(region==="Custom selection")return STATE_DATA.filter(state=>customStates.includes(state.abbr));const regional=region === "All 50" ? STATE_DATA.filter(s=>!s.district) : STATE_DATA.filter(s => s.region === region); return division === "All" ? regional : regional.filter(s=>s.division===division); }
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
    const kinds = kind === 'mixed' ? ['facts','map','triples','spelling','neighbors','regions','discovery'] : [kind];
    const questions=[];
    states.forEach(state=>kinds.forEach(k=>{
      if(k==='facts') ["state-capital","state-abbr","capital-state","abbr-state","capital-abbr","abbr-capital"].forEach(d=>questions.push(stateQuestion(state,k,d)));
      else if(k==='spelling') ['state','capital'].forEach(d=>questions.push(stateQuestion(state,k,d)));
      else if(k==='placement') questions.push({subject:"states",state,prompt:`Place ${state.name} on the map`,answer:state.name,detail:`${state.name} — ${state.abbr} — ${state.capital}`,placement:true,modeOverride:"map-place"});
      else if(k==='neighbors') (STATE_NEIGHBORS[state.abbr]||[]).filter(abbr=>states.some(item=>item.abbr===abbr)).slice(0,2).forEach(abbr=>{const neighbor=states.find(item=>item.abbr===abbr);questions.push({subject:"states",state,prompt:`Which state borders ${state.name}?`,answer:neighbor.name,answerType:"state",detail:`${neighbor.name} borders ${state.name}.`,neighbor:true});});
      else if(k==='regions'){questions.push({subject:"states",state,prompt:`Which region contains ${state.name}?`,answer:state.region.replace(" Region",""),answerType:"region",detail:`${state.name} is in the ${state.region}.`,regionSort:true});questions.push({subject:"states",state,prompt:`Which division contains ${state.name}?`,answer:state.division.replace(" Division",""),answerType:"division",detail:`${state.name} is in the ${state.division}.`,regionSort:true});}
      else if(k==='capital-speed'){questions.push(stateQuestion(state,'facts',Math.random()>.5?'state-capital':'capital-state'));}
      else if(k==='discovery') questions.push({subject:"states",state,prompt:STATE_DISCOVERY[state.abbr],answer:state.name,answerType:"state",detail:`${STATE_DISCOVERY[state.abbr]} Answer: ${state.name}.`,discovery:true});
      else questions.push(stateQuestion(state,k));
    }));
    if(kinds.includes('odd')){
      const groups=[...new Set(states.map(state=>state.region))];
      groups.forEach(region=>{const same=states.filter(state=>state.region===region),other=states.filter(state=>state.region!==region);if(same.length>=3&&other.length){for(let index=0;index<Math.min(4,same.length);index++){const odd=other[index%other.length],set=shuffle([...shuffle(same).slice(0,3),odd]);questions.push({subject:"states",prompt:`Which state does not belong with the ${region.replace(" Region","")} group?`,answer:odd.name,answerType:"state",detail:`${odd.name} belongs to the ${odd.region}.`,oddStates:set,modeOverride:"choice"});}}});
    }
    questions.forEach(q=>q.pool=states);
    return questions;
  }

  function startStates(p) {
    const states = activeStates(p.region,p.division,p.customStates); if(!states.length)return toast("Choose at least one location"); const bank=shuffle(stateQuestionBank(states,p.kind));if(!bank.length)return toast(p.kind==='neighbors'?"Choose a set containing neighboring states":p.kind==='odd'?"Choose states from more than one region":"This study set needs more locations"); const wanted=p.count==='max'?bank.length:Math.min(+p.count,bank.length); const questions=bank.slice(0,wanted);
    startSession(p.kind==='capital-speed'?"Capital Speed Run":"State Quest", questions, p.mode,p.kind==='capital-speed'?1:0,{livesEnabled:p.challenge});
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
      ${challengePanel(p.challenge)}
      <div class="panel"><p class="helper"><strong>Listen mode:</strong> in child play, tap the speaker to hear each word. In parent mode, the spelling stays visible only to the person holding the phone.</p></div>
      <button class="primary" id="startSpelling" ${store.spelling.length ? "" : "disabled"}>Start spelling round</button>`;
    wireChoices($("#spellingView"), (group,value) => { p[group]=value; store.spellingPrefs=p; save(); renderSpelling(); });
    wireVoicePanel($("#spellingView"));
    $('[data-challenge-toggle]',$('#spellingView')).onchange=e=>{p.challenge=e.target.checked;store.spellingPrefs=p;save();};
    $("#startSpelling").onclick = () => {
      const makeQuestion=(word,modeOverride)=>({subject:"spelling",prompt:"Spell the word you hear",answer:word,speech:word,detail:word,pool:store.spelling,modeOverride});
      const bank=p.mode==="mixed"?store.spelling.flatMap(word=>[makeQuestion(word,"choice"),makeQuestion(word,"type")]):store.spelling.map(word=>makeQuestion(word,p.mode));
      const wanted=p.count==='max'?bank.length:Math.min(+p.count,bank.length);
      startSession("Word Wizard", shuffle(bank).slice(0,wanted), p.mode,0,{livesEnabled:p.challenge});
    };
  }

  function studyQuestionBank(set){const pool=set.questions||[];return pool.map((item,index)=>({subject:"study",studySetId:set.id,prompt:item.question,answer:item.answer,accepted:item.accepted||[],detail:item.explanation||`Answer: ${item.answer}`,distractors:item.distractors||[],pool,index}));}
  function startStudySet(set,mode){const bank=shuffle(studyQuestionBank(set));if(!bank.length)return toast("Add at least one question first");const questions=bank.map((question,index)=>({...question,modeOverride:mode==="mixed"?["choice","type","parent"][index%3]:mode}));startSession(set.title,questions,mode,0,{studySetId:set.id,livesEnabled:store.challengePrefs.study});}
  function smartReviewItems(){return Object.values(activeProfile().stats.mistakes||{}).filter(item=>(item.misses||0)>(item.corrected||0)).sort((a,b)=>((b.misses||0)-(b.corrected||0))-((a.misses||0)-(a.corrected||0))).slice(0,Math.max(5,+store.smartReview.count||10));}
  function startSmartReview(){const items=smartReviewItems();if(!items.length)return toast("No missed questions need review right now");startMistakeRound(items);}
  function csvCell(value=""){const text=String(value);return /[",\n]/.test(text)?`"${text.replace(/"/g,'""')}"`:text;}
  function exportStudySet(set){const header="set_title,subject,test_date,question,answer,acceptable_answers,explanation,distractors",rows=(set.questions||[]).map(item=>[set.title,set.subject||"General",set.testDate||"",item.question,item.answer,(item.accepted||[]).join("; "),item.explanation||"",(item.distractors||[]).join("; ")].map(csvCell).join(","));downloadText(`${set.title.toLowerCase().replace(/[^a-z0-9]+/g,"-")||"study-set"}.csv`,[header,...rows].join("\n"),"text/csv");}
  function importStudyCSV(file){const reader=new FileReader();reader.onload=()=>{try{const rows=parseCSV(reader.result);if(rows.length<2)throw new Error();const headers=rows[0].map(value=>value.trim().toLowerCase()),required=["set_title","question","answer"];if(required.some(key=>!headers.includes(key)))throw new Error();const at=key=>headers.indexOf(key),groups={};rows.slice(1).forEach(row=>{const title=(row[at("set_title")]||"Imported Study Set").trim(),question=(row[at("question")]||"").trim(),answer=(row[at("answer")]||"").trim();if(!question||!answer)return;groups[title]||={id:`study-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,title,subject:(row[at("subject")]||"General").trim()||"General",testDate:(row[at("test_date")]||"").trim(),createdAt:today(),questions:[]};groups[title].questions.push({id:`q-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,question,answer,accepted:(row[at("acceptable_answers")]||"").split(";").map(value=>value.trim()).filter(Boolean),explanation:(row[at("explanation")]||"").trim(),distractors:(row[at("distractors")]||"").split(";").map(value=>value.trim()).filter(Boolean)});});const imported=Object.values(groups).filter(set=>set.questions.length);if(!imported.length)throw new Error();store.studySets.push(...imported);save();renderStudyLab();toast(`${imported.length} study set${imported.length===1?'':'s'} imported`);}catch{toast("That CSV did not match the Study Lab template");}};reader.readAsText(file);}
  function renderStudyLab(){
    const review=store.smartReview.enabled?smartReviewItems():[];
    $("#studyView").innerHTML=`${head("Study Lab","Build reusable practice for any subject")}
      <div class="study-command panel"><div><p class="eyebrow">Parent-created learning</p><h2>${store.studySets.length} saved study set${store.studySets.length===1?'':'s'}</h2><p class="helper">Create sets in the app, paste question-and-answer lines, or import the reusable CSV template.</p></div><div class="stack"><button class="primary" id="newStudySet">Create study set</button><button class="secondary" id="importStudySet">Import CSV</button><a class="secondary link-button" href="templates/study-lab-import-template.csv" download>Download CSV template</a></div><input type="file" id="studyCSVFile" accept=".csv,text/csv" hidden></div>
      ${store.smartReview.enabled?`<div class="panel smart-review-card"><div><p class="label">Optional Smart Review</p><h2>${review.length?`${review.length} priority question${review.length===1?'':'s'}`:'Everything repaired'}</h2><p class="helper">Uses only saved mistakes to prioritize local practice. Turn it off anytime in Parent Setup.</p></div><button class="secondary" id="startSmartReview" ${review.length?'':'disabled'}>Start smart review</button></div>`:''}
      ${challengePanel(store.challengePrefs.study)}
      <div class="study-set-grid">${store.studySets.length?store.studySets.map(set=>`<article class="study-set-card"><div class="study-set-top"><span>${esc((set.subject||"General").slice(0,2).toUpperCase())}</span><div class="grow"><p class="eyebrow">${esc(set.subject||"General")}</p><h2>${esc(set.title)}</h2><small>${set.questions?.length||0} questions${set.testDate?` · Test ${esc(set.testDate)}`:''}</small></div></div><div class="study-mode-grid"><button class="tiny" data-study-start="${esc(set.id)}" data-study-mode="parent">Flashcards</button><button class="tiny" data-study-start="${esc(set.id)}" data-study-mode="choice">Multiple choice</button><button class="tiny" data-study-start="${esc(set.id)}" data-study-mode="type">Typed answers</button><button class="tiny" data-study-start="${esc(set.id)}" data-study-mode="mixed">Mixed test</button></div><div class="study-card-actions"><button data-edit-study="${esc(set.id)}">Edit</button><button data-duplicate-study="${esc(set.id)}">Duplicate</button><button data-export-study="${esc(set.id)}">Export</button><button class="danger-text" data-delete-study="${esc(set.id)}">Delete</button></div></article>`).join(""):'<div class="panel empty">No study sets yet. Create one or import the template to begin.</div>'}</div>`;
    $("#newStudySet").onclick=()=>{if(!ensureParentAccess())return;editingStudySetId="";go("study-editor");};
    $("#importStudySet").onclick=()=>{if(ensureParentAccess())$("#studyCSVFile").click();};$("#studyCSVFile").onchange=e=>{if(e.target.files[0])importStudyCSV(e.target.files[0]);};
    $("#startSmartReview")?.addEventListener("click",startSmartReview);
    $('[data-challenge-toggle]',$('#studyView')).onchange=e=>{store.challengePrefs.study=e.target.checked;save();};
    $$('[data-study-start]').forEach(button=>button.onclick=()=>{const set=store.studySets.find(item=>item.id===button.dataset.studyStart);if(set)startStudySet(set,button.dataset.studyMode);});
    $$('[data-edit-study]').forEach(button=>button.onclick=()=>{if(!ensureParentAccess())return;editingStudySetId=button.dataset.editStudy;go("study-editor");});
    $$('[data-duplicate-study]').forEach(button=>button.onclick=()=>{if(!ensureParentAccess())return;const source=store.studySets.find(item=>item.id===button.dataset.duplicateStudy);if(!source)return;const copy=structuredClone(source);copy.id=`study-${Date.now()}`;copy.title=`${source.title} Copy`;copy.questions.forEach(question=>question.id=`q-${Date.now()}-${Math.random().toString(36).slice(2,6)}`);store.studySets.push(copy);save();renderStudyLab();toast("Study set duplicated");});
    $$('[data-export-study]').forEach(button=>button.onclick=()=>{const set=store.studySets.find(item=>item.id===button.dataset.exportStudy);if(set)exportStudySet(set);});
    $$('[data-delete-study]').forEach(button=>button.onclick=()=>{if(!ensureParentAccess())return;const set=store.studySets.find(item=>item.id===button.dataset.deleteStudy);if(!set||!confirm(`Delete “${set.title}”?`))return;store.studySets=store.studySets.filter(item=>item.id!==set.id);save();renderStudyLab();toast("Study set deleted");});
  }
  function studyBulkText(set){return (set?.questions||[]).map(item=>[item.question,item.answer,(item.accepted||[]).join("; "),item.explanation||"",(item.distractors||[]).join("; ")].join(" | ")).join("\n");}
  function renderStudyEditor(){
    if(!ensureParentAccess()){go("study");return;}const existing=store.studySets.find(item=>item.id===editingStudySetId),set=existing||{title:"",subject:"",testDate:"",questions:[]};
    $("#studyEditorView").innerHTML=`${head(existing?"Edit Study Set":"New Study Set","One line per question using the guided format","study")}<div class="panel"><div class="field"><label>Set title</label><input id="studyTitle" value="${esc(set.title)}" placeholder="Science — Unit 2"></div><div class="two"><div class="field"><label>Subject</label><input id="studySubject" value="${esc(set.subject||"")}" placeholder="Science"></div><div class="field"><label>Test date (optional)</label><input id="studyDate" type="date" value="${esc(set.testDate||"")}"></div></div><div class="field"><label>Questions</label><textarea id="studyBulk" class="study-bulk" placeholder="Question | Answer | acceptable answer; another answer | explanation | wrong choice; wrong choice">${esc(studyBulkText(set))}</textarea></div><p class="helper"><strong>Required:</strong> Question | Answer<br><strong>Optional:</strong> acceptable answers | explanation | multiple-choice distractors. Separate multiple entries with semicolons.</p><button class="primary" id="saveStudySet">Save study set</button></div>`;
    $("#saveStudySet").onclick=()=>{const title=$("#studyTitle").value.trim(),lines=$("#studyBulk").value.split(/\r?\n/).map(line=>line.trim()).filter(Boolean),questions=lines.map(line=>{const parts=line.split("|").map(part=>part.trim());return {id:`q-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,question:parts[0]||"",answer:parts[1]||"",accepted:(parts[2]||"").split(";").map(value=>value.trim()).filter(Boolean),explanation:parts[3]||"",distractors:(parts[4]||"").split(";").map(value=>value.trim()).filter(Boolean)};}).filter(item=>item.question&&item.answer);if(!title||!questions.length)return toast("Add a title and at least one Question | Answer line");const next={id:existing?.id||`study-${Date.now()}`,title,subject:$("#studySubject").value.trim()||"General",testDate:$("#studyDate").value,createdAt:existing?.createdAt||today(),questions};if(existing)store.studySets[store.studySets.indexOf(existing)]=next;else store.studySets.push(next);save();editingStudySetId="";go("study");toast("Study set saved");};
  }

  function renderHomeworkBoard(){
    const profile=activeProfile(),start=weekStart(homeworkWeekOffset),end=addDays(start,6),weekKey=isoLocal(start),days=Array.from({length:7},(_,index)=>addDays(start,index)),tasks=profile.homeworkTasks.filter(task=>task.week===weekKey),completed=tasks.filter(task=>task.done).length,verified=tasks.filter(task=>task.verified).length,rewarded=profile.homeworkRewards.includes(weekKey),editing=profile.homeworkTasks.find(task=>task.id===editingHomeworkId);
    $("#homeworkView").innerHTML=`${head("Weekly Mission Board",`${prettyDate(start)}–${prettyDate(end)} · ${profile.name}`)}
      <div class="week-nav"><button class="tiny" data-week-move="-1">‹ Previous</button><button class="tiny" data-week-current>This week</button><button class="tiny" data-week-move="1">Next ›</button></div>
      <div class="panel week-summary"><div><p class="label">Weekly briefing</p><h2>${tasks.length?`${completed} of ${tasks.length} assignments finished`:'No assignments entered'}</h2><p class="helper">${verified} parent verified · ${tasks.length-completed} remaining</p></div><div class="week-progress-ring" style="--week-progress:${tasks.length?Math.round(completed/tasks.length*360):0}deg"><strong>${tasks.length?Math.round(completed/tasks.length*100):0}%</strong></div></div>
      <div class="homework-days">${days.map((date,index)=>{const dayTasks=tasks.filter(task=>task.day===index);return `<section class="homework-day ${isoLocal(date)===isoLocal(new Date())?'today':''}"><div class="homework-day-head"><div><span>${date.toLocaleDateString(undefined,{weekday:"short"})}</span><strong>${prettyDate(date)}</strong></div><b>${dayTasks.filter(task=>task.done).length}/${dayTasks.length}</b></div><div class="homework-list">${dayTasks.length?dayTasks.map(task=>`<article class="homework-task ${task.done?'done':''} ${task.verified?'verified':''}"><label class="task-check"><input type="checkbox" data-task-done="${esc(task.id)}" ${task.done?'checked':''}><span>✓</span></label><div class="grow"><small>${esc(task.subject||"General")}${task.minutes?` · ${task.minutes} min`:''}</small><strong>${esc(task.title)}</strong>${task.notes?`<p>${esc(task.notes)}</p>`:''}</div>${task.verified?'<span class="verified-mark" title="Parent verified">★</span>':''}<div class="task-actions"><button data-edit-homework="${esc(task.id)}">Edit</button><button data-verify-homework="${esc(task.id)}">${task.verified?'Unverify':'Verify'}</button><button data-delete-homework="${esc(task.id)}">Delete</button></div></article>`).join(""):'<p class="day-empty">Open mission slot</p>'}</div></section>`;}).join("")}</div>
      ${tasks.length&&completed===tasks.length&&!rewarded?'<button class="primary weekly-reward" id="claimWeekReward">Claim 10-orb weekly reward</button>':rewarded?'<div class="panel weekly-reward claimed">✓ Weekly completion reward claimed</div>':''}
      <div class="panel homework-tools"><div class="panel-title-row"><div><p class="label">Parent planning tools</p><h2>${editing?'Edit assignment':'Add an assignment'}</h2></div></div><div class="two"><div class="field"><label>Day</label><select id="homeworkDay">${days.map((date,index)=>`<option value="${index}" ${editing?.day===index?'selected':''}>${date.toLocaleDateString(undefined,{weekday:"long"})}</option>`).join("")}</select></div><div class="field"><label>Subject</label><input id="homeworkSubject" value="${esc(editing?.subject||"")}" placeholder="Science"></div></div><div class="field"><label>Assignment</label><input id="homeworkTitle" value="${esc(editing?.title||"")}" placeholder="Read pages 34–39"></div><div class="field"><label>Notes or instructions</label><textarea id="homeworkNotes" class="short-textarea" placeholder="Optional details">${esc(editing?.notes||"")}</textarea></div><div class="field"><label>Estimated minutes</label><input id="homeworkMinutes" type="number" min="0" max="600" value="${editing?.minutes||""}" placeholder="20"></div><div class="two"><button class="primary" id="saveHomework">${editing?'Save changes':'Add assignment'}</button>${editing?'<button class="secondary" id="cancelHomeworkEdit">Cancel</button>':'<button class="secondary" id="copyPreviousWeek">Copy previous week</button>'}</div><button class="secondary" id="carryHomework" style="margin-top:10px">Carry unfinished assignments from last week</button></div>`;
    $$('[data-week-move]').forEach(button=>button.onclick=()=>{homeworkWeekOffset+=+button.dataset.weekMove;editingHomeworkId="";renderHomeworkBoard();});$("[data-week-current]").onclick=()=>{homeworkWeekOffset=0;editingHomeworkId="";renderHomeworkBoard();};
    $$('[data-task-done]').forEach(input=>input.onchange=()=>{const task=profile.homeworkTasks.find(item=>item.id===input.dataset.taskDone);if(task){task.done=input.checked;if(!task.done)task.verified=false;save();renderHomeworkBoard();}});
    $$('[data-edit-homework]').forEach(button=>button.onclick=()=>{if(!ensureParentAccess())return;editingHomeworkId=button.dataset.editHomework;renderHomeworkBoard();});
    $$('[data-verify-homework]').forEach(button=>button.onclick=()=>{if(!ensureParentAccess())return;const task=profile.homeworkTasks.find(item=>item.id===button.dataset.verifyHomework);if(task){task.verified=!task.verified;if(task.verified)task.done=true;save();renderHomeworkBoard();}});
    $$('[data-delete-homework]').forEach(button=>button.onclick=()=>{if(!ensureParentAccess())return;const task=profile.homeworkTasks.find(item=>item.id===button.dataset.deleteHomework);if(!task||!confirm(`Delete “${task.title}”?`))return;profile.homeworkTasks=profile.homeworkTasks.filter(item=>item.id!==task.id);save();renderHomeworkBoard();});
    $("#saveHomework").onclick=()=>{if(!ensureParentAccess())return;const title=$("#homeworkTitle").value.trim();if(!title)return toast("Enter an assignment");const next={id:editing?.id||`homework-${Date.now()}`,week:weekKey,day:+$("#homeworkDay").value,subject:$("#homeworkSubject").value.trim()||"General",title,notes:$("#homeworkNotes").value.trim(),minutes:+$("#homeworkMinutes").value||0,done:editing?.done||false,verified:editing?.verified||false};if(editing)profile.homeworkTasks[profile.homeworkTasks.indexOf(editing)]=next;else profile.homeworkTasks.push(next);editingHomeworkId="";save();renderHomeworkBoard();toast(editing?"Assignment updated":"Assignment added");};
    $("#cancelHomeworkEdit")?.addEventListener("click",()=>{editingHomeworkId="";renderHomeworkBoard();});
    $("#copyPreviousWeek")?.addEventListener("click",()=>{if(!ensureParentAccess())return;const previous=isoLocal(addDays(start,-7)),source=profile.homeworkTasks.filter(task=>task.week===previous);if(!source.length)return toast("The previous week has no assignments");source.forEach(task=>profile.homeworkTasks.push({...task,id:`homework-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,week:weekKey,done:false,verified:false}));save();renderHomeworkBoard();toast("Previous week copied");});
    $("#carryHomework").onclick=()=>{if(!ensureParentAccess())return;const previous=isoLocal(addDays(start,-7)),source=profile.homeworkTasks.filter(task=>task.week===previous&&!task.done);if(!source.length)return toast("No unfinished assignments to carry forward");source.forEach(task=>profile.homeworkTasks.push({...task,id:`homework-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,week:weekKey,day:0,done:false,verified:false}));save();renderHomeworkBoard();toast(`${source.length} assignment${source.length===1?'':'s'} carried forward`);};
    $("#claimWeekReward")?.addEventListener("click",()=>{if(!tasks.length||tasks.some(task=>!task.done)||profile.homeworkRewards.includes(weekKey))return;profile.homeworkRewards.push(weekKey);profile.stats.stars=(profile.stats.stars||0)+10;syncActiveProfile();save();renderHomeworkBoard();toast("Weekly mission complete: +10 orbs");});
  }

  function renderMath() {
    const p = store.mathPrefs || defaults.mathPrefs;
    $("#mathView").innerHTML = `${head("Math Mayhem","Choose a number-training sector")}
      <section class="math-sector active"><div><p class="eyebrow">ACTIVE PROGRAM</p><h2>Multiplication Reactor</h2><p>Build multiplication fluency from 0 × 0 through 9 × 9.</p></div><span>×</span></section>
      <div class="math-sector-grid" aria-label="Future Math Mayhem sectors"><div><b>÷</b><strong>Division Drive</strong><small>Future sector</small></div><div><b>+</b><strong>Addition Array</strong><small>Future sector</small></div><div><b>−</b><strong>Subtraction Circuit</strong><small>Future sector</small></div></div>
      <div class="panel"><p class="label">Choose tables</p><div class="option-grid" id="tableGrid">${[0,1,2,3,4,5,6,7,8,9].map(n => `<button class="choice ${p.tables.includes(n)?"selected":""}" data-table="${n}">${n}s</button>`).join("")}</div><div class="two" style="margin-top:10px"><button class="tiny" data-preset="all">All tables</button><button class="tiny" data-preset="tricky">6s–9s</button></div></div>
      <div class="panel"><p class="label">Practice mode</p>${modeButtons(p.mode)}</div>
      <div class="panel"><p class="label">Round length</p><div class="option-grid" data-choice-group="count"><button class="choice ${p.count==='10'?'selected':''}" data-value="10">10 questions</button><button class="choice ${p.count==='25'?'selected':''}" data-value="25">25 questions</button><button class="choice ${p.count==='max'?'selected':''}" data-value="max">Max · ${p.tables.length*10}</button></div></div>
      <div class="panel"><p class="label">Timer</p><div class="option-grid" data-choice-group="timer"><button class="choice ${p.timer==='0'?'selected':''}" data-value="0">No timer</button><button class="choice ${p.timer==='1'?'selected':''}" data-value="1">1 minute</button><button class="choice ${p.timer==='3'?'selected':''}" data-value="3">3 minutes</button><button class="choice ${p.timer==='5'?'selected':''}" data-value="5">5 minutes</button></div></div>
      ${challengePanel(p.challenge)}
      <button class="primary" id="startMath">Start ${p.count==='max'?p.tables.length*10:Math.min(+p.count,p.tables.length*10)}-question round</button>`;
    $("#tableGrid").onclick = e => { const b=e.target.closest("[data-table]"); if(!b)return; const n=+b.dataset.table; p.tables=p.tables.includes(n)?p.tables.filter(x=>x!==n):[...p.tables,n].sort(); if(!p.tables.length)p.tables=[n]; store.mathPrefs=p;save();renderMath(); };
    $$('[data-preset]',$("#mathView")).forEach(b=>b.onclick=()=>{p.tables=b.dataset.preset==="all"?[0,1,2,3,4,5,6,7,8,9]:[6,7,8,9];store.mathPrefs=p;save();renderMath();});
    wireChoices($("#mathView"),(group,value)=>{p[group]=value;store.mathPrefs=p;save();renderMath();});
    $('[data-challenge-toggle]',$('#mathView')).onchange=e=>{p.challenge=e.target.checked;store.mathPrefs=p;save();};
    $("#startMath").onclick=()=>{const bank=shuffle(p.tables.flatMap(a=>Array.from({length:10},(_,b)=>({subject:"math",prompt:`${a} × ${b}`,answer:String(a*b),detail:`${a} × ${b} = ${a*b}`,a,b}))));const wanted=p.count==='max'?bank.length:Math.min(+p.count,bank.length);startSession("Multiplication Reactor",bank.slice(0,wanted),p.mode,+p.timer,{livesEnabled:p.challenge});};
  }

  function renderPoems() {
    const poem = store.poems[0];
    $("#poemsView").innerHTML = `${head("Poem Power","Learn a poem a little at a time")}
      <div class="panel"><p class="label">Choose a poem</p><div class="stack" id="poemList">${store.poems.map((p,i)=>`<button class="list-item ${i===0?"selected":""}" data-poem="${esc(p.id)}"><span class="subject-icon" style="background:#f1e8ff;color:#8047b1">❝</span><span class="grow"><strong>${esc(p.title)}</strong><small>${esc(p.author||"Author not listed")}</small></span><span>›</span></button>`).join("")}</div><button class="secondary" style="margin-top:10px" data-go="settings" data-focus="poems">Add or edit poems</button></div>
      ${voicePanelMarkup()}
      ${challengePanel(store.challengePrefs.poems)}
      <div class="panel" id="poemModes">${poemModeMarkup(poem)}</div>`;
    let selected=poem;
    $("#poemList").onclick=e=>{const b=e.target.closest("[data-poem]");if(!b)return;selected=store.poems.find(p=>p.id===b.dataset.poem);$$('[data-poem]').forEach(x=>x.classList.toggle('selected',x===b));$("#poemModes").innerHTML=poemModeMarkup(selected);wirePoemModes(selected);};
    wirePoemModes(selected);
    wireVoicePanel($("#poemsView"));
    $('[data-challenge-toggle]',$('#poemsView')).onchange=e=>{store.challengePrefs.poems=e.target.checked;save();};
  }

  function poemModeMarkup(poem){return `<p class="label">Practice ${esc(poem.title)}</p><div class="stack">
    <button class="choice" data-poem-mode="read">Read it aloud</button><button class="choice" data-poem-mode="missing">Missing words</button><button class="choice" data-poem-mode="lines">Next-line prompts</button><button class="choice" data-poem-mode="recite">Recite from memory</button></div>`;}
  function wirePoemModes(poem){$$('[data-poem-mode]',$("#poemModes")).forEach(b=>b.onclick=()=>startPoem(poem,b.dataset.poemMode));}
  function startPoem(poem,mode){
    const lines=poem.text.split("\n").filter(x=>x.trim());
    if(mode==="read"){startSession("Poem Power",[{subject:"poem-read",prompt:poem.title,answer:poem.text,detail:poem.author,speech:poem.text,audio:poem.audio||"",poemId:poem.id}],"read",0,{silentMusic:true});return;}
    if(mode==="recite"){startSession("Poem Power",[{subject:"poem-recite",prompt:`Recite “${poem.title}” from memory`,answer:poem.text,detail:poem.author}],"parent");return;}
    if(mode==="lines"){const qs=lines.slice(0,-1).map((line,i)=>({subject:"poem-line",prompt:line,answer:lines[i+1],detail:`Next line: ${lines[i+1]}`}));startSession("Next-Line Prompts",shuffle(qs).slice(0,8),"type",0,{livesEnabled:store.challengePrefs.poems});return;}
    const candidates=lines.map(line=>({line,words:(line.match(/[A-Za-z’']+/g)||[]).filter(w=>w.length>3)})).filter(x=>x.words.length);const qs=shuffle(candidates).slice(0,Math.min(8,candidates.length)).map(({line,words})=>{const word=pick(words);return {subject:"poem-missing",prompt:line.replace(new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i'),"_____"),answer:word,detail:`The missing word was “${word}.”`};});startSession("Missing Words",qs,"type",0,{livesEnabled:store.challengePrefs.poems});
  }

  function subjectGroup(subject="") {
    if(subject==="states"||subject==="state-spelling")return "states";
    if(subject==="spelling")return "spelling";
    if(subject==="math")return "math";
    if(subject.startsWith("poem"))return "poems";
    if(subject==="study")return "study";
    return "other";
  }
  const subjectLabel=subject=>({states:"State Quest",spelling:"Word Wizard",math:"Math Mayhem",poems:"Poem Power",study:"Study Lab",other:"Other"}[subject]||subject);

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

  function cosmeticDemo(item){
    const appliesTo={frame:"Active Pilot profile frame",trail:"Energy Orb rewards and results",theme:"Student Arcade interface accents",title:"Active Pilot title"}[item.type]||"Student Arcade";
    let preview="";
    if(item.type==="frame") preview=`<div class="demo-profile demo-${item.value}"><b>A</b><span><small>ACTIVE PILOT</small><strong>Asher</strong></span></div>`;
    if(item.type==="trail") preview=`<div class="demo-orb demo-${item.value}"><i></i><i></i><img src="assets/ui/energy-orb.png" alt=""><i></i></div>`;
    if(item.type==="theme") preview=`<div class="demo-theme demo-${item.value}"><i></i><span>ARCADE GRID</span><i></i></div>`;
    if(item.type==="title") preview=`<div class="demo-title"><small>PILOT TITLE</small><strong>${esc(item.value)}</strong></div>`;
    return `<div class="cosmetic-demo cosmetic-${item.type}">${preview}<span class="cosmetic-applies">Changes: ${esc(appliesTo)}</span></div>`;
  }

  function renderArmory(){
    const profile=activeProfile(),weapon=activeWeapon(profile),orbs=profile.stats.stars||0;
    const equippedTrack=MUSIC_TRACKS.find(track=>track.id===profile.equippedTrack);
    $("#armoryView").innerHTML=`${head("Orb Shop & Locker",`${profile.name}'s upgrades, supplies, music, and Sentinel forms`)}
      <section class="armory-console" style="--weapon-color:${weapon.color};--weapon-glow:${weapon.glow}"><div class="armory-scan" aria-hidden="true"></div><div class="selected-form"><p class="eyebrow">CURRENT FORM</p><img src="${sentinelArt(armoryPose,profile)}" alt="${esc(weapon.name)} ${esc(armoryPose)} pose"><div class="form-name"><span>${esc(weapon.element)} system</span><h2>${esc(weapon.name)}</h2></div><div class="pose-preview" aria-label="Choose a form pose">${[["idle","Ready"],["success","Victory"],["thinking","Think"]].map(([pose,label])=>`<button type="button" class="pose-choice ${armoryPose===pose?'selected':''}" data-armory-pose="${pose}" aria-pressed="${armoryPose===pose}"><img src="${sentinelArt(pose,profile)}" alt=""><small>${label}</small></button>`).join('')}</div></div><div class="weapon-spec"><div class="orb-wallet"><img src="assets/ui/energy-orb.png" alt=""><strong>${orbs}</strong><span>available orbs</span></div><p class="eyebrow">SPECIAL PROGRAM</p><h2>${esc(weapon.ability)}</h2><p>${esc(weapon.description)}</p><div class="form-lore"><strong>Archive record</strong><span>${esc(weapon.lore)}</span></div><div class="form-effect"><i></i><span>Answer effect: ${esc(weapon.effect)}</span></div>${[["Power",weapon.power],["Speed",weapon.speed],["Guard",weapon.guard]].map(([label,value])=>`<div class="spec-row"><span>${label}</span><i><b style="width:${value*20}%"></b></i></div>`).join('')}<small>Tap Ready, Victory, or Think to inspect every pose. Forms change armor art, interface energy, victory effects, and answer sounds. Difficulty and scoring stay fair.</small></div></section>
      <div class="section-heading"><div><p class="eyebrow">FIELD SUPPLIES</p><h2>Mission support items</h2></div><span>10–40 orbs</span></div>
      <div class="supply-grid">${SUPPORT_ITEMS.map(item=>`<article class="shop-tile support-tile"><span class="shop-icon">${item.icon}</span><div><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p><small>${profile.consumables[item.id]||0} in inventory · maximum ${item.limit}</small></div><button class="tiny shop-buy" data-buy-support="${item.id}" ${(profile.consumables[item.id]||0)>=item.limit?'disabled':''}><img src="assets/ui/energy-orb.png" alt=""> ${item.cost}</button></article>`).join('')}</div>
      <div class="section-heading"><div><p class="eyebrow">STYLE MODULES</p><h2>Permanent cosmetics</h2></div><span>${profile.cosmeticsOwned.length}/${COSMETICS.length} owned</span></div>
      <div class="cosmetic-grid">${COSMETICS.map(item=>{const owned=profile.cosmeticsOwned.includes(item.id),equipped=profile.equippedCosmetics[item.type]===item.value;return `<article class="shop-tile cosmetic-tile ${equipped?'equipped':''}"><span class="shop-icon">${item.icon}</span><div><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p></div>${cosmeticDemo(item)}${equipped?`<button class="tiny" data-unequip-cosmetic="${item.type}">Equipped · remove</button>`:owned?`<button class="secondary" data-equip-cosmetic="${item.id}">Equip this look</button>`:`<button class="primary" data-buy-cosmetic="${item.id}"><img src="assets/ui/energy-orb.png" alt=""> Buy for ${item.cost} orbs</button>`}</article>`;}).join('')}</div>
      <div class="section-heading"><div><p class="eyebrow">MISSION JUKEBOX</p><h2>Unlock a round soundtrack</h2></div><span>${profile.tracksOwned.length}/${MUSIC_TRACKS.length} owned</span></div>
      <div class="panel jukebox-now"><span>♫</span><div><small>Equipped mission music</small><strong>${esc(equippedTrack?.name||"Standard Level Theme")}</strong></div>${equippedTrack?'<button class="tiny" data-clear-track>Use standard</button>':''}</div>
      <div class="music-grid">${MUSIC_TRACKS.map(track=>{const owned=profile.tracksOwned.includes(track.id),equipped=profile.equippedTrack===track.id;return `<article class="music-tile ${equipped?'equipped':''}"><button class="music-preview" data-preview-track="${track.id}" aria-label="Preview ${esc(track.name)}">▶</button><div><strong>${esc(track.name)}</strong><small>${owned?'Permanent unlock':'15-second preview'}</small></div>${equipped?'<button class="tiny" disabled>Equipped</button>':owned?`<button class="tiny" data-equip-track="${track.id}">Equip</button>`:`<button class="tiny shop-buy" data-buy-track="${track.id}"><img src="assets/ui/energy-orb.png" alt=""> ${track.cost}</button>`}</article>`;}).join('')}</div>
      <div class="section-heading"><div><p class="eyebrow">FORM SELECT</p><h2>Choose your Sentinel</h2></div><span>${profile.inventory.length}/${WEAPONS.length} owned</span></div>
      <div class="weapon-grid">${WEAPONS.map(item=>{const owned=profile.inventory.includes(item.id),equipped=profile.equippedWeapon===item.id;return `<article class="weapon-card ${equipped?'equipped':''}" style="--weapon-color:${item.color}"><div class="weapon-preview"><img src="assets/characters/skins/${item.id}-idle.png" alt="${esc(item.name)}"><span>${esc(item.element)}</span></div><div class="weapon-card-copy"><h3>${esc(item.name)}</h3><small>${esc(item.ability)}</small>${equipped?'<button class="tiny equipped-label" disabled>Equipped</button>':owned?`<button class="secondary" data-equip-weapon="${item.id}">Equip</button>`:`<button class="primary" data-buy-weapon="${item.id}"><img src="assets/ui/energy-orb.png" alt=""> ${item.cost}</button>`}</div></article>`;}).join('')}</div>`;
    const spend=(cost,onSuccess)=>{if((profile.stats.stars||0)<cost){toast(`You need ${cost-(profile.stats.stars||0)} more orbs`);return false;}profile.stats.stars-=cost;onSuccess();syncActiveProfile();save();renderArmory();return true;};
    $$('[data-armory-pose]').forEach(button=>button.onclick=()=>{armoryPose=button.dataset.armoryPose;const hero=$(".selected-form>img");if(hero){hero.src=sentinelArt(armoryPose,profile);hero.alt=`${weapon.name} ${armoryPose} pose`;}$$('[data-armory-pose]').forEach(choice=>{const selected=choice.dataset.armoryPose===armoryPose;choice.classList.toggle("selected",selected);choice.setAttribute("aria-pressed",String(selected));});});
    $$('[data-buy-support]').forEach(button=>button.onclick=()=>{const item=SUPPORT_ITEMS.find(candidate=>candidate.id===button.dataset.buySupport);if(!item||(profile.consumables[item.id]||0)>=item.limit)return;spend(item.cost,()=>{profile.consumables[item.id]=(profile.consumables[item.id]||0)+1;toast(`${item.name} added to inventory`);});});
    $$('[data-buy-cosmetic]').forEach(button=>button.onclick=()=>{const item=COSMETICS.find(candidate=>candidate.id===button.dataset.buyCosmetic);if(!item||profile.cosmeticsOwned.includes(item.id))return;spend(item.cost,()=>{profile.cosmeticsOwned.push(item.id);profile.equippedCosmetics[item.type]=item.value;applyEquippedTheme(profile);toast(`${item.name} unlocked and equipped`);});});
    $$('[data-equip-cosmetic]').forEach(button=>button.onclick=()=>{const item=COSMETICS.find(candidate=>candidate.id===button.dataset.equipCosmetic);if(!item||!profile.cosmeticsOwned.includes(item.id))return;profile.equippedCosmetics[item.type]=item.value;applyEquippedTheme(profile);save();renderArmory();toast(`${item.name} equipped`);});
    $$('[data-unequip-cosmetic]').forEach(button=>button.onclick=()=>{delete profile.equippedCosmetics[button.dataset.unequipCosmetic];applyEquippedTheme(profile);save();renderArmory();toast("Cosmetic removed");});
    $$('[data-preview-track]').forEach(button=>button.onclick=()=>previewTrack(MUSIC_TRACKS.find(track=>track.id===button.dataset.previewTrack)));
    $$('[data-buy-track]').forEach(button=>button.onclick=()=>{const track=MUSIC_TRACKS.find(candidate=>candidate.id===button.dataset.buyTrack);if(!track||profile.tracksOwned.includes(track.id))return;spend(track.cost,()=>{profile.tracksOwned.push(track.id);profile.equippedTrack=track.id;toast(`${track.name} unlocked and equipped`);});});
    $$('[data-equip-track]').forEach(button=>button.onclick=()=>{profile.equippedTrack=button.dataset.equipTrack;save();renderArmory();toast("Mission soundtrack equipped");});
    $('[data-clear-track]')?.addEventListener('click',()=>{profile.equippedTrack="";save();renderArmory();toast("Standard level music restored");});
    $$('[data-equip-weapon]').forEach(button=>button.onclick=()=>{profile.equippedWeapon=button.dataset.equipWeapon;applyEquippedTheme(profile);playFormEffect(true);save();renderArmory();toast(`${activeWeapon(profile).name} equipped`);});
    $$('[data-buy-weapon]').forEach(button=>button.onclick=()=>{const item=WEAPONS.find(candidate=>candidate.id===button.dataset.buyWeapon);if(!item||profile.inventory.includes(item.id))return;if((profile.stats.stars||0)<item.cost)return toast(`You need ${item.cost-(profile.stats.stars||0)} more orbs`);profile.stats.stars-=item.cost;profile.inventory.push(item.id);profile.equippedWeapon=item.id;syncActiveProfile();applyEquippedTheme(profile);playFormEffect(true);save();renderArmory();toast(`${item.name} unlocked and equipped!`);});
  }

  function renderProfiles(){
    const current=activeProfile();
    const completed=completedMissionCount(current),rank=completed>=20?'Master Sentinel':completed>=12?'Senior Sentinel':completed>=5?'Field Sentinel':'Sentinel Cadet';
    $("#profilesView").innerHTML=`${head("Learner Profiles","Progress is stored locally on this device")}
      <div class="panel profile-hero"><img src="${sentinelArt("success",current)}" alt="${esc(activeWeapon(current).name)} Circuit Sentinel celebrating"><div><p class="eyebrow">${rank}</p><h2>${esc(current.name)}</h2><p class="helper">${completed}/20 missions · ${unlockedRewards(current).length}/6 rewards · ${current.stats.stars||0} energy orbs</p><button class="tiny" data-go="armory">${esc(activeWeapon(current).name)} equipped</button></div></div>
      <div class="panel"><p class="label">Choose a learner</p><div class="profile-list">${store.profiles.map(profile=>`<div class="profile-row-wrap"><button class="profile-row ${profile.id===store.activeProfileId?'selected':''}" data-profile="${esc(profile.id)}"><span>${esc(profile.name.charAt(0).toUpperCase())}</span><span class="grow"><strong>${esc(profile.name)}</strong><small>${completedMissionCount(profile)} missions · ${profile.stats.rounds.length} rounds · ${profile.stats.stars||0} orbs</small></span><b>${profile.id===store.activeProfileId?'Active':'Choose'}</b></button><button class="profile-delete" data-delete-profile="${esc(profile.id)}" aria-label="Delete ${esc(profile.name)} profile" ${store.profiles.length===1?'disabled':''}>Delete</button></div>`).join("")}</div>${store.profiles.length===1?'<p class="helper profile-delete-note">Create another profile before deleting this one.</p>':''}</div>
      <div class="panel"><p class="label">Add a local profile</p><form id="profileForm" class="profile-form"><input class="answer-input" id="newProfileName" maxlength="24" placeholder="Learner name" autocomplete="off"><button class="primary">Create profile</button></form><p class="helper">Profiles stay on this device and are included in downloaded backups.</p></div>`;
    $$('[data-profile]').forEach(button=>button.onclick=()=>{store.activeProfileId=button.dataset.profile;syncActiveProfile();applyEquippedTheme();save();renderProfiles();toast(`${activeProfile().name} selected`);});
    $$('[data-delete-profile]').forEach(button=>button.onclick=()=>{if(!ensureParentAccess())return;if(store.profiles.length===1)return toast("Keep at least one learner profile");const profile=store.profiles.find(item=>item.id===button.dataset.deleteProfile);if(!profile)return;if(!confirm(`Delete ${profile.name}'s profile and all saved progress on this device?`))return;store.profiles=store.profiles.filter(item=>item.id!==profile.id);if(store.activeProfileId===profile.id)store.activeProfileId=store.profiles[0].id;syncActiveProfile();applyEquippedTheme();save();renderProfiles();toast(`${profile.name}'s profile deleted`);});
    $("#profileForm").onsubmit=event=>{event.preventDefault();if(!ensureParentAccess())return;const name=$("#newProfileName").value.trim();if(!name)return toast("Enter a learner name");const profile=createProfile(name);store.profiles.push(profile);store.activeProfileId=profile.id;syncActiveProfile();save();renderProfiles();toast(`${name} profile created`);};
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

  function questionSnapshot(q){return {subject:q.subject,prompt:q.prompt,answer:q.answer,detail:q.detail||q.answer,speech:q.speech||"",a:q.a,b:q.b,map:!!q.map,placement:!!q.placement,neighbor:!!q.neighbor,regionSort:!!q.regionSort,discovery:!!q.discovery,combined:!!q.combined,answerType:q.answerType||"",stateName:q.state?.name||"",oddStateNames:(q.oddStates||[]).map(state=>state.name),modeOverride:q.modeOverride||"",accepted:q.accepted||[],distractors:q.distractors||[],studySetId:q.studySetId||""};}
  function mistakeKey(q){return `${q.subject}|${q.prompt}|${q.answer}`;}
  function hydrateQuestion(item){const q={subject:item.subject,prompt:item.prompt,answer:item.answer,detail:item.detail,speech:item.speech||"",a:item.a,b:item.b,map:item.map,placement:item.placement,neighbor:item.neighbor,regionSort:item.regionSort,discovery:item.discovery,combined:item.combined,answerType:item.answerType,modeOverride:item.modeOverride||undefined,accepted:item.accepted||[],distractors:item.distractors||[],studySetId:item.studySetId||""};q.oddStates=(item.oddStateNames||[]).map(name=>STATE_DATA.find(state=>state.name===name)).filter(Boolean);if(item.stateName){q.state=STATE_DATA.find(state=>state.name===item.stateName);q.pool=STATE_DATA;}else if(item.subject==="states")q.pool=STATE_DATA;else if(item.subject==="spelling")q.pool=store.spelling;else if(item.subject==="study"){const set=store.studySets.find(candidate=>candidate.id===item.studySetId);q.pool=set?.questions||[];}return q;}
  function startMistakeRound(items){const questions=shuffle(items).slice(0,20).map(hydrateQuestion).filter(q=>q.answer&&(!q.stateName||q.state));if(!questions.length)return toast("No mistakes are waiting for practice");startSession("Mistake Repair",questions,"mixed",0,{repair:true});}
  function startAssessment(subject){let questions=[],mode="mixed";
    if(subject==="states")questions=shuffle(stateQuestionBank(STATE_DATA.filter(s=>!s.district),"facts")).slice(0,10);
    if(subject==="spelling")questions=shuffle(store.spelling).slice(0,10).map((word,index)=>({subject:"spelling",prompt:"Spell the word you hear",answer:word,speech:word,detail:word,pool:store.spelling,modeOverride:index%2?"type":"choice"}));
    if(subject==="math")questions=shuffle(Array.from({length:100},(_,i)=>{const a=Math.floor(i/10),b=i%10;return {subject:"math",prompt:`${a} × ${b}`,answer:String(a*b),detail:`${a} × ${b} = ${a*b}`,a,b};})).slice(0,10);
    if(subject==="poems"){mode="type";const poem=store.poems[0],lines=poem.text.split("\n").filter(Boolean),candidates=lines.map(line=>({line,words:(line.match(/[A-Za-z’']+/g)||[]).filter(w=>w.length>3)})).filter(x=>x.words.length);questions=shuffle(candidates).slice(0,10).map(({line,words})=>{const word=pick(words);return {subject:"poem-missing",prompt:line.replace(new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i'),"_____"),answer:word,detail:`The missing word was “${word}.”`};});}
    if(!questions.length)return toast("Add learning material before starting this assessment");
    startSession(`${subjectLabel(subject)} Assessment`,questions,mode,0,{assessment:true,assessmentSubject:subject});
  }
  function startSession(title,questions,mode,minutes=0,options={}){playStartCue();const subjects=new Set(questions.map(q=>q.subject)),quietPractice=options.assessment||options.repair||subjects.has("poem-read")||subjects.has("poem-recite"),defaultChallenge=subjects.has("study")?store.challengePrefs.study:[...subjects].some(subject=>subject.startsWith("poem"))?store.challengePrefs.poems:true,livesEnabled=options.livesEnabled??(!quietPractice&&defaultChallenge);session={title,questions,index:0,correct:0,answeredCount:0,mode,locked:false,minutes,deadline:minutes?Date.now()+minutes*60000:0,timedOut:false,startedAt:Date.now(),earnedOrbs:0,wrongQuestions:[],completedMissions:[],newRewards:[],newChapters:[],livesEnabled,lives:livesEnabled?3:0,maxLives:3,shieldActive:false,rebootUsed:false,endedByLives:false,...options};go("session");renderQuestion();}
  function resolvedMode(){return session.questions[session.index]?.modeOverride || (session.mode==="mixed"?pick(["choice","type"]):session.mode);}
  function updateTimer(){if(!session?.deadline)return;const left=Math.max(0,session.deadline-Date.now()),seconds=Math.ceil(left/1000),el=$("#timer");if(el)el.textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;if(left<=0){clearInterval(session.timerId);session.timedOut=true;renderFinish();}}
  function renderQuestion(){
    clearInterval(session?.timerId);const view=$("#sessionView");const q=session.questions[session.index];if(!q){renderFinish();return;}session.locked=false;session.currentMode=resolvedMode();
    setQuestionAudioDuck(!!q.speech);setAudioScene(session.silentMusic?"silent":"level");session.questionStarted=Date.now();
    const pct=(session.index/session.questions.length)*100,boss=session.bossId?BOSSES.find(item=>item.id===session.bossId):null,damage=Math.min(session.bossDamage||0,boss?.goal||0),health=boss?Math.max(0,Math.round((1-damage/boss.goal)*100)):0;
    const bossHud=boss?`<div class="boss-hud" style="--boss-color:${boss.color}"><img src="${boss.art}" alt="${esc(boss.name)}"><div><span>${esc(boss.sector)} boss</span><strong>${esc(boss.name)}</strong><div class="boss-health"><i style="width:${health}%"></i></div><small>${damage}/${boss.goal} signal hits</small></div></div>`:"";
    const lives=session.livesEnabled?`<div class="life-hud" aria-label="${session.lives} of ${session.maxLives} lives">${Array.from({length:session.maxLives},(_,index)=>`<span class="${index<session.lives?'charged':''}">◆</span>`).join('')}</div>`:"";
    view.innerHTML=`<div class="quiz-shell">${bossHud}<div class="quiz-top"><button class="back" data-end-session aria-label="End round">×</button><div class="quiz-progress"><span style="width:${pct}%"></span></div>${session.deadline?'<div class="timer" id="timer">0:00</div>':''}${lives}<div class="score"><img src="assets/ui/energy-orb.png" alt="">${session.correct}</div></div>${supportTrayMarkup(q)}<div class="flash-card ${q.map||q.placement?'map-card':''}" id="flashCard"><p class="prompt-label">${esc(session.title)} · ${session.index+1} of ${session.questions.length}</p><div id="questionBody"></div></div></div>`;
    $('[data-end-session]').onclick=()=>{clearInterval(session?.timerId);session=null;go('home');};
    if(session.deadline){updateTimer();session.timerId=setInterval(updateTimer,250);}
    renderQuestionBody(q);
    wireSupportTray(q);
  }

  function supportTrayMarkup(q){const items=activeProfile().consumables||{},mode=session.currentMode,buttons=[];if(mode==="choice"&&items.targeting)buttons.push(["targeting","◎","Remove choice"]);if(mode==="type"&&(q.subject==="spelling"||q.subject==="state-spelling")&&items.letter)buttons.push(["letter","Aa","Reveal letter"]);if(q.subject==="states"&&items.map)buttons.push(["map","⌖","Map clue"]);if(q.subject?.startsWith("poem")&&items.verse)buttons.push(["verse","❝","Verse clue"]);if(session.deadline&&items.time)buttons.push(["time","+30","Add time"]);if(session.livesEnabled&&!session.shieldActive&&items.shield)buttons.push(["shield","◇","Shield"]);if(session.livesEnabled&&session.lives<session.maxLives&&items.repair)buttons.push(["repair","+1","Repair life"]);return buttons.length?`<div class="support-tray"><small>SUPPORT DECK</small>${buttons.map(([id,icon,label])=>`<button data-use-support="${id}"><b>${icon}</b><span>${label}</span><em>${items[id]}</em></button>`).join('')}</div>`:"";}
  function consumeSupport(id){const inventory=activeProfile().consumables;if(!inventory?.[id])return false;inventory[id]--;save();return true;}
  function wireSupportTray(q){$$('[data-use-support]').forEach(button=>button.onclick=()=>{const id=button.dataset.useSupport;if(id==="targeting"){const wrong=$$('.answer').filter(answer=>norm(answer.dataset.answer)!==norm(q.answer)&&!answer.hidden);if(!wrong.length)return toast("No removable answer remains");if(consumeSupport(id)){pick(wrong).hidden=true;button.remove();toast("One incorrect option removed");}}else if(id==="letter"){const answer=String(q.answer),available=[...answer].map((char,index)=>/[a-z]/i.test(char)&&!session.revealedLetters?.includes(index)?index:-1).filter(index=>index>=0);if(!available.length)return toast("Every letter is already visible");if(consumeSupport(id)){session.revealedLetters=[...(session.revealedLetters||[]),pick(available)];const hint=[...answer].map((char,index)=>/[a-z]/i.test(char)?session.revealedLetters.includes(index)?char:"_":char).join(" ");let hintEl=$("#supportHint");if(!hintEl){hintEl=document.createElement("div");hintEl.id="supportHint";hintEl.className="support-hint";$("#interaction").prepend(hintEl);}hintEl.textContent=hint;renderQuestionSupportCount(button,id);}}else if(id==="shield"){if(consumeSupport(id)){session.shieldActive=true;button.remove();toast("Shield Cell armed");}}else if(id==="repair"){if(session.lives>=session.maxLives)return toast("Lives are already full");if(consumeSupport(id)){session.lives++;renderQuestion();toast("One life restored");}}else if(id==="time"){if(consumeSupport(id)){session.deadline+=30000;renderQuestionSupportCount(button,id);toast("30 seconds added");}}else if(id==="map"){if(consumeSupport(id)){toast(`${q.state?.name||q.answer}: ${q.state?.region||"Look for its region"} · ${q.state?.division||""}`);renderQuestionSupportCount(button,id);}}else if(id==="verse"){if(consumeSupport(id)){const first=String(q.answer).trim().split(/\s+/)[0];toast(`The answer begins with “${first}…”`);renderQuestionSupportCount(button,id);}}});}
  function renderQuestionSupportCount(button,id){const count=activeProfile().consumables[id]||0,em=button.querySelector('em');if(em)em.textContent=count;if(!count)button.remove();}

  function renderQuestionBody(q){
    const body=$("#questionBody");const mode=session.currentMode;
    const guide=`<div class="question-guide"><img src="assets/characters/professor-volt.png" alt=""><span>Professor Volt asks:</span></div>`;
    if(q.subject==="poem-read") {body.innerHTML=`${guide}<h2>${esc(q.prompt)}</h2><p class="helper">${esc(q.detail)}</p><button class="secondary" style="margin-bottom:16px" data-play-poem>🔊 Play poem audio</button><div class="poem-text">${esc(q.answer)}</div><button class="primary" style="margin-top:18px" data-self-done>I read it aloud</button>`;$('[data-play-poem]').onclick=()=>playPracticeAudio(q.speech,q.audio,q.poemId);$('[data-self-done]').onclick=()=>grade(true);return;}
    const speech=q.speech?`<button class="subject-icon" id="speakWord" aria-label="Hear the word" style="border:0;color:#5e4bd0">🔊</button>`:"";
    if(mode==="map-place"){body.innerHTML=`${guide}<h2>${esc(q.prompt)}</h2><div class="state-drag-chip" draggable="true">${esc(q.state.name)}</div><div class="us-placement-map" id="placementMap"><span class="helper">Loading U.S. map…</span></div><div id="interaction"></div>`;renderStatePlacement(q);return;}
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
    if(q.subject==="spelling"||q.subject==="state-spelling"){const w=q.answer,letters="abcdefghijklmnopqrstuvwxyz",variants=[w,w.slice(0,-1)+(w.endsWith('e')?'a':'e'),w.replace(/([aeiou])/, '$1$1'),w.length>4?w.slice(0,2)+w.slice(3):w+'e',w+"e",w.slice(0,-1),w.slice(0,-1)+letters[(letters.indexOf(w.slice(-1).toLowerCase())+1)%26]];const unique=[...new Set(variants.filter(Boolean))];for(let i=0;unique.length<4;i++)unique.push(`${w}${letters[i]}`);return shuffle(unique).slice(0,4);}
    if(q.subject==="states"){
      if(q.oddStates)return shuffle(q.oddStates.map(state=>state.name));
      if(q.combined){const pool=[...new Map([q.state,...shuffle(q.pool||[]),...shuffle(STATE_DATA)].filter(Boolean).map(state=>[state.abbr,state])).values()].slice(0,4);return shuffle(pool).map(s=>q.map?`${s.name} · ${s.abbr} · ${s.capital}`:`${s.abbr} · ${s.capital}`);}
      if(q.answerType==="region")return shuffle([q.answer,...["Northeast","Midwest","South","West"].filter(value=>value!==q.answer).slice(0,3)]);
      if(q.answerType==="division"){const divisions=[...new Set(STATE_DATA.map(state=>state.division.replace(" Division","")))];return shuffle([q.answer,...shuffle(divisions.filter(value=>value!==q.answer)).slice(0,3)]);}
      const prop=q.answerType==="state"?"name":q.answerType==="capital"?"capital":"abbr",choices=[q.answer,...shuffle(q.pool||[]).map(s=>s[prop]),...shuffle(STATE_DATA).map(s=>s[prop])],unique=[...new Set(choices)];return shuffle(unique.slice(0,4));
    }
    if(q.subject==="study"){const poolAnswers=(q.pool||[]).map(item=>item.answer).filter(Boolean),fallback=["Not stated in the study guide","None of these","Unable to determine","All of these","Another answer"],choices=[q.answer,...(q.distractors||[]),...shuffle(poolAnswers.filter(answer=>norm(answer)!==norm(q.answer))),...fallback],unique=[...new Map(choices.map(value=>[norm(value),value])).values()];return shuffle(unique.slice(0,4));}
    return [q.answer];
  }
  function renderMultipleChoice(q){const it=$("#interaction");const opts=answerOptions(q);it.innerHTML=`<div class="answers">${opts.map(o=>`<button class="answer" data-answer="${esc(o)}">${esc(o)}</button>`).join("")}</div><div id="feedback"></div>`;$$('[data-answer]').forEach(b=>b.onclick=()=>{if(session.locked)return;const ok=norm(b.dataset.answer)===norm(q.answer);b.classList.add(ok?'correct':'wrong');finishAnswer(ok,q);});}
  function renderTyped(q){const it=$("#interaction");if(q.combined){const labels=q.map?["State","Abbreviation","Capital"]:["Abbreviation","Capital"];it.innerHTML=`<div class="stack">${labels.map((l,i)=>`<input class="answer-input" data-part="${i}" aria-label="${l}" placeholder="${l}" autocapitalize="words">`).join("")}<button class="primary" data-check>Check answer</button></div><div id="feedback"></div>`;$('[data-check]').onclick=()=>{const vals=$$('[data-part]').map(x=>x.value);const expected=q.map?[q.state.name,q.state.abbr,q.state.capital]:[q.state.abbr,q.state.capital];finishAnswer(vals.every((v,i)=>norm(v)===norm(expected[i])),q);};}
    else{it.innerHTML=`<form id="answerForm" class="stack"><input class="answer-input" id="typedAnswer" aria-label="Your answer" placeholder="Type your answer" autocomplete="off" autocapitalize="words"><button class="primary">Check answer</button></form><div id="feedback"></div>`;$("#answerForm").onsubmit=e=>{e.preventDefault();const response=norm($("#typedAnswer").value),accepted=[q.answer,...(q.accepted||[])].map(norm);finishAnswer(accepted.includes(response),q);};setTimeout(()=>$("#typedAnswer")?.focus(),80);}}

  function finishAnswer(ok,q){if(session.locked)return;session.locked=true;playFormEffect(ok);const feedback=$("#feedback")||$("#interaction"),form=activeWeapon(),canRecall=!ok&&(activeProfile().consumables.recall||0)>0;const correction=q.subject==="math"&&!ok?`${q.a} groups of ${q.b}: ${Array(q.a).fill(q.b).join(" + ") || "0"} = ${q.answer}`:q.detail||`Answer: ${q.answer}`;const message=ok?pick(["Nice work!","You got it!","Great recall!","Level up!"]):`Good try. ${esc(correction)}`;feedback.innerHTML=`<div class="feedback ${ok?'good':'try'} mascot-feedback form-feedback fx-${form.id}"><div class="form-answer-fx" aria-hidden="true"></div><img src="${sentinelArt(ok?'success':'thinking')}" alt=""><span>${message}</span></div>${canRecall?`<button class="secondary recall-answer" data-recall-answer>↻ Use Recall Chip (${activeProfile().consumables.recall})</button>`:''}<button class="primary" style="margin-top:10px" data-next>${session.index===session.questions.length-1?'See results':'Next question'}</button>`;$('[data-recall-answer]')?.addEventListener('click',()=>{if(!consumeSupport('recall'))return;session.retryRequested=true;grade(false,false);});$('[data-next]').onclick=()=>grade(ok,false);}
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
  function grade(ok,withSound=true){if(withSound)playFormEffect(ok);const q=session.questions[session.index],elapsed=Math.max(0,Date.now()-(session.questionStarted||Date.now()));session.answeredCount=(session.answeredCount||0)+1;if(ok){session.correct++;if(session.bossId)session.bossDamage=(session.bossDamage||0)+1;}else if(session.livesEnabled){if(session.shieldActive){session.shieldActive=false;toast("Shield Cell protected your life");}else session.lives=Math.max(0,session.lives-1);}recordAnswer(ok,q,elapsed);if(!ok&&session.retryRequested){session.questions.splice(session.index+1,0,{...q});session.retryRequested=false;}save();if(session.bossId&&session.bossDamage>=session.bossGoal){session.bossDefeated=true;session.index=session.questions.length;}else session.index++;if(session.livesEnabled&&!session.lives){session.endedByLives=true;renderFinish();}else renderQuestion();}
  function wireSwipe(){let startX=0;const card=$("#flashCard");card.addEventListener('touchstart',e=>startX=e.touches[0].clientX,{passive:true});card.addEventListener('touchend',e=>{if($("#revealed")?.hidden)return;const d=e.changedTouches[0].clientX-startX;if(Math.abs(d)>70)grade(d>0);},{passive:true});}

  async function renderStatePlacement(q){const stage=$("#placementMap");try{if(!mapTopology){const res=await fetch("vendor/states-10m.json");mapTopology=await res.json();}const features=topojson.feature(mapTopology,mapTopology.objects.states).features,collection={type:"FeatureCollection",features},projection=d3.geoAlbersUsa().fitExtent([[8,8],[572,348]],collection),path=d3.geoPath(projection);stage.innerHTML=`<svg viewBox="0 0 580 356" role="img" aria-label="Blank United States placement map">${features.map(feature=>`<path data-state-id="${String(feature.id).padStart(2,'0')}" d="${path(feature)||''}"><title>Choose this location</title></path>`).join('')}</svg><p class="helper">Drag the state chip or tap its correct location.</p>`;$$('[data-state-id]',stage).forEach(shape=>{shape.onclick=()=>{if(session.locked)return;const ok=shape.dataset.stateId===q.state.id;shape.classList.add(ok?'correct':'wrong');if(ok)$$('[data-state-id]',stage).forEach(item=>{if(item.dataset.stateId===q.state.id)item.classList.add('correct');});finishAnswer(ok,q);};shape.ondragover=event=>event.preventDefault();shape.ondrop=event=>{event.preventDefault();shape.click();};});const chip=$('.state-drag-chip');chip?.addEventListener('dragstart',event=>event.dataTransfer.setData('text/plain',q.state.id));}catch{stage.innerHTML=`<div class="feedback try">The placement map could not load. Reopen the app and try again.</div>`;}}
  async function renderStateMap(state){const stage=$("#mapStage");try{if(!mapTopology){const res=await fetch("vendor/states-10m.json");mapTopology=await res.json();}const features=topojson.feature(mapTopology,mapTopology.objects.states).features;const feature=features.find(f=>String(f.id).padStart(2,'0')===state.id);const projection=d3.geoIdentity().reflectY(true).fitExtent([[18,14],[332,218]],feature);const path=d3.geoPath(projection);stage.innerHTML=`<svg viewBox="0 0 350 232" role="img" aria-label="Unlabeled state outline"><path d="${path(feature)}"></path></svg>`;}catch{stage.innerHTML=`<div class="feedback try">This state outline could not load. Try reopening the app.</div>`;}}
  function renderFinish(){
    clearInterval(session?.timerId);setQuestionAudioDuck(false);setAudioScene("finished");
    const boss=session.bossId?BOSSES.find(item=>item.id===session.bossId):null,profile=activeProfile(),bossWon=!!boss&&(session.bossDefeated||session.bossDamage>=boss.goal);
    const interrupted=!!session.endedByLives,total=boss?(session.answeredCount||session.index):(session.timedOut||interrupted?session.answeredCount:session.questions.length),correct=session.correct,pct=Math.round(correct/Math.max(1,total)*100),pose=bossWon||pct>=60?'success':'thinking';
    const missed=[...new Map((session.wrongQuestions||[]).map(q=>[mistakeKey(q),q])).values()];
    if(bossWon&&!bossDefeated(profile,boss)){profile.bosses[boss.id]={defeated:true,date:today()};profile.stats.stars=(profile.stats.stars||0)+boss.reward;session.earnedOrbs=(session.earnedOrbs||0)+boss.reward;if(boss.id==="doubt-cloud"){const finale=CHAPTERS.find(chapter=>chapter.id==="arcade-reborn");if(finale&&!profile.seenChapters.includes(finale.id))session.newChapters.push(finale);}save();}
    if(!session.roundSaved){const stats=activeProfile().stats,round={date:today(),title:session.title,total,correct,accuracy:pct,durationMs:Date.now()-(session.startedAt||Date.now()),assessment:!!session.assessment};stats.rounds.push(round);stats.rounds=stats.rounds.slice(-100);if(session.assessment&&session.assessmentSubject)stats.assessments[session.assessmentSubject]=round;session.roundSaved=true;save();}
    const completed=session.completedMissions||[],newRewards=session.newRewards||[],newChapters=session.newChapters||[];
    $("#sessionView").innerHTML=`${head(boss?bossWon?"Boss defeated!":interrupted?"Mission interrupted":"Boss retreat":interrupted?"Mission interrupted":session.timedOut?"Time's up!":session.assessment?"Assessment complete!":"Mission round complete!",session.title,"home")}
      ${interrupted?`<section class="life-interrupted"><div class="interrupted-core">◇</div><div><p class="eyebrow">ENERGY DEPLETED</p><h2>Three lives used</h2><p>This run is saved. Review the missed signals, train without lives, or use one Emergency Reboot to continue.</p></div></section>`:''}
      ${boss?`<section class="boss-result ${bossWon?'defeated':'retry'}" style="--boss-color:${boss.color}"><img class="boss-result-enemy" src="${boss.art}" alt="${esc(boss.name)}"><img class="boss-result-hero" src="${sentinelArt(pose)}" alt="Circuit Sentinel"><div><p class="eyebrow">${bossWon?'Sector restored':'Signal still unstable'}</p><h2>${bossWon?`${esc(boss.name)} cleared!`:`${session.bossDamage||0} of ${boss.goal} hits landed`}</h2><p>${bossWon?`The ${esc(boss.sector)} is secure. Boss reward: ${boss.reward} bonus orbs.`:esc(boss.hint)}</p></div></section>`:''}
      <div class="result-hero ${bossWon||pct>=80?'victory':'practice'} form-result"><div class="result-burst"></div><img class="result-mascot" src="${sentinelArt(pose)}" alt="Circuit Sentinel ${bossWon||pct>=60?'celebrating':'thinking'}"><div class="result-copy"><p class="eyebrow">${bossWon?activeWeapon(profile).ability:pct>=90?'Gold signal':pct>=75?'Strong signal':'Signal training'}</p><h1>${correct} of ${total}</h1><div class="result-stars" aria-label="Performance rating">${[1,2,3].map((star,i)=>`<span class="${pct>=[60,75,90][i]?'lit':''}">★</span>`).join('')}</div><p>${bossWon?`${activeWeapon(profile).name} delivered the finishing signal.`:session.timedOut?`You answered ${total} before time ended. `:''}${bossWon?'':pct>=90?'Outstanding work—the sector is glowing!':pct>=75?'Great progress. Your recall is getting stronger.':pct>=60?'Solid practice. Repair the missed signals next.':'Every repaired mistake makes the Sentinel stronger.'}</p></div></div>
      <div class="result-rewards"><div><img src="assets/ui/energy-orb.png" alt=""><strong>+${session.earnedOrbs||0}</strong><span>Energy orbs</span></div><div><strong>${pct}%</strong><span>Accuracy</span></div><div><strong>${missed.length}</strong><span>To repair</span></div></div>
      ${completed.map(mission=>`<div class="panel mission-celebration"><img src="assets/characters/professor-volt.png" alt="Professor Volt"><div><p class="eyebrow">Mission complete</p><h2>${esc(mission.title)}</h2><p class="helper">Professor Volt restored another arcade system. Bonus: ${mission.reward} orbs.</p></div></div>`).join('')}
      ${newRewards.map(reward=>`<div class="unlock-banner"><span>${reward.icon}</span><div><p class="eyebrow">New Sentinel reward</p><h2>${esc(reward.name)}</h2></div></div>`).join('')}
      ${newChapters.map(chapter=>`<button class="chapter-unlock" data-chapter="${chapter.id}" style="--chapter-accent:${chapter.accent}"><span>NEW STORY</span><strong>${esc(chapter.number)} · ${esc(chapter.title)}</strong><small>Play the new animated transmission ›</small></button>`).join('')}
      <div class="stack">${interrupted&&!session.rebootUsed&&session.index<session.questions.length&&(profile.consumables.reboot||0)>0?`<button class="primary emergency-reboot" data-emergency-reboot>⚡ Emergency Reboot (${profile.consumables.reboot})</button>`:''}${missed.length?'<button class="primary" data-repair>Practice missed answers</button>':''}<button class="${missed.length?'secondary':'primary'}" data-again>${boss?(bossWon?'Replay boss mission':'Retry boss mission'):'Practice this round again'}</button><button class="secondary" data-go="armory">Open Orb Shop & Locker</button><button class="secondary" data-go="story">Open mission map</button><button class="secondary" data-go="reports">View assessment report</button><button class="secondary" data-go="home">Back to quests</button></div>`;
    $('[data-emergency-reboot]')?.addEventListener('click',()=>{if(!consumeSupport('reboot'))return;if(session.roundSaved){profile.stats.rounds.pop();session.roundSaved=false;}session.lives=1;session.endedByLives=false;session.rebootUsed=true;save();setAudioScene("level");renderQuestion();toast("Emergency Reboot restored one life");});
    $('[data-repair]')?.addEventListener('click',()=>startMistakeRound(missed));
    $$('[data-chapter]').forEach(button=>button.onclick=()=>openChapter(button.dataset.chapter));
    $('[data-again]').onclick=()=>{session.index=0;session.correct=0;session.answeredCount=0;session.bossDamage=0;session.bossDefeated=false;session.roundSaved=false;session.timedOut=false;session.endedByLives=false;session.lives=session.livesEnabled?session.maxLives:0;session.shieldActive=false;session.rebootUsed=false;session.startedAt=Date.now();session.earnedOrbs=0;session.wrongQuestions=[];session.completedMissions=[];session.newRewards=[];session.newChapters=[];session.deadline=session.minutes?Date.now()+session.minutes*60000:0;session.questions=boss?bossQuestions(boss):shuffle(session.questions);renderQuestion();};
  }

  function renderSettings(){
    const lastBackup=store.backupMeta.lastBackupAt?new Date(store.backupMeta.lastBackupAt):null,backupAge=lastBackup?Math.floor((Date.now()-lastBackup.getTime())/86400000):Infinity,backupStatus=!lastBackup?"No full backup downloaded yet":backupAge>14?`Last full backup was ${backupAge} days ago`:`Last full backup: ${lastBackup.toLocaleDateString()}`;
    $("#settingsView").innerHTML=`${head("Parent Setup","Update weekly practice without rebuilding the app")}
      <div class="panel"><h2>Learner profiles</h2><p class="helper">Create or switch local profiles so reports and missions stay separate for each learner.</p><button class="secondary" data-go="profiles">Manage profiles</button></div>
      <div class="panel parent-controls"><div class="panel-title-row"><div><p class="label">Parent controls</p><h2>Parent PIN is on</h2></div><span class="status-pill on">Protected</span></div><p class="helper">The required PIN protects Parent Command, editing, imports, profile changes, and planning tools on this device. Practice, reports, and the Orb Shop stay open in Student Arcade.</p><div class="two"><div class="field"><label>New PIN</label><input id="parentPin" type="password" inputmode="numeric" maxlength="8" placeholder="••••"></div><div class="field"><label>Confirm PIN</label><input id="parentPinConfirm" type="password" inputmode="numeric" maxlength="8" placeholder="••••"></div></div><button class="primary" id="saveParentPin">Change PIN</button><button class="tiny lock-now" id="lockParentNow">Lock Parent Command now</button></div>
      <div class="panel"><div class="panel-title-row"><div><p class="label">Smart Review</p><h2>Optional mistake practice</h2></div><label class="settings-sound-toggle"><input type="checkbox" id="smartReviewEnabled" ${store.smartReview.enabled?'checked':''}> Enabled</label></div><p class="helper">When enabled, Study Lab offers a short round built from answers that still need repair. Turning it off immediately removes the suggestion but keeps normal learning history intact.</p><label class="mixer-row"><span>Questions per review</span><select id="smartReviewCount"><option value="5" ${+store.smartReview.count===5?'selected':''}>5</option><option value="10" ${+store.smartReview.count===10?'selected':''}>10</option><option value="20" ${+store.smartReview.count===20?'selected':''}>20</option></select></label></div>
      <div class="panel audio-mixer"><div class="panel-title-row"><div><p class="label">Audio mixer</p><h2>Sound levels</h2></div><label class="settings-sound-toggle"><input type="checkbox" id="settingsSoundEnabled" ${store.audioPrefs.enabled?'checked':''}> Sound on</label></div><p class="helper">Master Volume controls everything. Music and sound effects can be balanced separately.</p>${[['master','Master Volume'],['music','Music Volume'],['effects','Sound Effect Volume']].map(([key,label])=>`<label class="mixer-row"><span>${label}</span><input type="range" min="0" max="100" value="${Math.round(store.audioPrefs[key]*100)}" data-mixer="${key}" aria-label="${label}"><output data-mixer-output="${key}">${Math.round(store.audioPrefs[key]*100)}%</output></label>`).join('')}</div>
      <div class="panel" id="spellingSettings"><h2>Spelling word bank</h2><p class="helper">Enter one word per line or separate words with commas.</p><div class="field"><textarea id="wordBank">${esc(store.spelling.join("\n"))}</textarea></div><button class="primary" id="saveWords">Save word bank</button></div>
      <div class="panel" id="poemSettings"><h2>Poems</h2><div class="stack">${store.poems.map((p,i)=>`<div class="list-item"><span class="grow"><strong>${esc(p.title)}</strong><small>${esc(p.author||"")}</small></span><button class="tiny" data-edit-poem="${i}">Edit</button></div>`).join("")}</div><button class="secondary" style="margin-top:10px" id="addPoem">Add a poem</button><div id="poemEditor"></div></div>
      <div class="panel ${backupAge>14?'backup-reminder':''}"><div class="panel-title-row"><div><p class="label">Save protection</p><h2>Full app backup</h2></div><span class="status-pill ${backupAge<=14?'on':''}">${backupAge<=14?'Current':'Recommended'}</span></div><p class="helper">Progress is saved on this device. A full backup includes profiles, reports, Study Lab sets, state sets, weekly assignments, settings, and unlocks.</p><p class="backup-status">${esc(backupStatus)}</p><div class="two"><button class="secondary" id="exportData">Download backup</button><button class="secondary" id="importData">Restore backup</button></div><input type="file" id="importFile" accept="application/json,.json" hidden></div>
      <div class="panel"><h2>Home-screen updates</h2><p class="helper">Tap “Check for update” to load the newest code without replacing saved progress. iPhone may require removing and re-adding the home-screen shortcut before a new app icon appears.</p><button class="secondary" id="checkUpdate">Check for update</button></div>`;
    wireMixerControls();
    $("#saveParentPin").onclick=()=>{const pin=$("#parentPin").value.trim(),confirmation=$("#parentPinConfirm").value.trim();if(!/^\d{4,8}$/.test(pin))return toast("Use a 4–8 digit PIN");if(pin!==confirmation)return toast("The PINs do not match");store.parentControls.pinHash=pinHash(pin);parentUnlocked=true;save();renderSettings();toast("Parent PIN saved");};
    $("#lockParentNow")?.addEventListener("click",()=>{parentUnlocked=false;homeMode="student";go("home");toast("Parent Command locked");});
    $("#smartReviewEnabled").onchange=e=>{store.smartReview.enabled=e.target.checked;save();toast(e.target.checked?"Smart Review enabled":"Smart Review turned off");};
    $("#smartReviewCount").onchange=e=>{store.smartReview.count=+e.target.value;save();};
    $("#saveWords").onclick=()=>{store.spelling=$("#wordBank").value.split(/[\n,]+/).map(w=>w.trim()).filter(Boolean);save();toast(`${store.spelling.length} spelling words saved`);};
    $("#addPoem").onclick=()=>renderPoemEditor();$$('[data-edit-poem]').forEach(b=>b.onclick=()=>renderPoemEditor(+b.dataset.editPoem));
    $("#exportData").onclick=exportData;$("#importData").onclick=()=>$("#importFile").click();$("#importFile").onchange=importData;
    $("#checkUpdate").onclick=async()=>{if(!('serviceWorker'in navigator)){toast('No update is waiting');return;}const reg=await navigator.serviceWorker.getRegistration();await reg?.update();toast('Update check complete');};
  }
  function syncMixerControls(){const top=$("#soundVolume");if(top)top.value=Math.round(masterVolume()*100);['master','music','effects'].forEach(key=>{const input=$(`[data-mixer="${key}"]`),output=$(`[data-mixer-output="${key}"]`);if(input)input.value=Math.round(store.audioPrefs[key]*100);if(output)output.textContent=`${Math.round(store.audioPrefs[key]*100)}%`;});const toggle=$("#settingsSoundEnabled");if(toggle)toggle.checked=store.audioPrefs.enabled;}
  function wireMixerControls(){syncMixerControls();$$('[data-mixer]').forEach(input=>input.oninput=()=>{audioUnlocked=true;ensureAudioGraph();store.audioPrefs[input.dataset.mixer]=Number(input.value)/100;applySoundVolumes();save();syncMixerControls();if(store.audioPrefs.enabled&&backgroundMusic.paused&&audioScene!=="silent")setAudioScene(audioScene);});const toggle=$("#settingsSoundEnabled");if(toggle)toggle.onchange=()=>{store.audioPrefs.enabled=toggle.checked;$("#soundEnabled").checked=toggle.checked;audioUnlocked=true;ensureAudioGraph();if(!toggle.checked){activeAudio?.pause();voiceCue.pause();window.speechSynthesis?.cancel();}applySoundVolumes();save();setAudioScene(audioScene);};}
  function renderPoemEditor(index){const poem=Number.isInteger(index)?store.poems[index]:{title:"",author:"",text:""};$("#poemEditor").innerHTML=`<div class="field"><label>Title</label><input id="poemTitle" value="${esc(poem.title)}"></div><div class="field"><label>Author</label><input id="poemAuthor" value="${esc(poem.author)}"></div><div class="field"><label>Poem text</label><textarea id="poemText">${esc(poem.text)}</textarea></div><div class="two"><button class="primary" id="savePoem">Save poem</button>${Number.isInteger(index)?'<button class="danger-btn" id="deletePoem">Delete</button>':''}</div>`;$("#poemTitle").focus();$("#savePoem").onclick=()=>{const title=$("#poemTitle").value.trim(),text=$("#poemText").value.trim();if(!title||!text){toast('Add a title and poem text');return;}const next={id:(poem.id||title.toLowerCase().replace(/[^a-z0-9]+/g,'-'))+(!Number.isInteger(index)?`-${Date.now()}`:''),title,author:$("#poemAuthor").value.trim(),text,...(poem.audio?{audio:poem.audio}:{})};if(Number.isInteger(index))store.poems[index]=next;else store.poems.push(next);save();renderSettings();toast('Poem saved');};if(Number.isInteger(index))$("#deletePoem").onclick=()=>{if(store.poems.length===1){toast('Keep at least one poem');return;}store.poems.splice(index,1);save();renderSettings();};}
  function exportData(){store.backupMeta.lastBackupAt=new Date().toISOString();save();const backup={format:"circuit-sentinel-learning-arcade",version:2,exportedAt:store.backupMeta.lastBackupAt,data:store};downloadText(`learning-arcade-full-backup-${today()}.json`,JSON.stringify(backup,null,2),"application/json");renderSettings();toast("Full backup downloaded");}
  function importData(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result),data=parsed?.format==="circuit-sentinel-learning-arcade"?parsed.data:parsed;if(!data||typeof data!=="object"||!Array.isArray(data.profiles)||!data.profiles.length)throw new Error();const sets=Array.isArray(data.studySets)?data.studySets.length:0,tasks=data.profiles.reduce((sum,profile)=>sum+(Array.isArray(profile.homeworkTasks)?profile.homeworkTasks.length:0),0);if(!confirm(`Restore this backup?\n\n${data.profiles.length} profile(s)\n${sets} Study Lab set(s)\n${tasks} Mission Board assignment(s)\n\nThis will replace the app data currently saved on this device.`))return;localStorage.setItem(STORE,JSON.stringify({...defaults,...data}));location.reload();}catch{toast('That file is not a valid Learning Arcade backup');}finally{e.target.value="";}};reader.readAsText(file);}

  document.addEventListener("click", e => {const nav=e.target.closest("[data-go]");if(nav)go(nav.dataset.go);});
  window.addEventListener("hashchange",()=>go(location.hash.slice(1)||"home"));
  if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js?v=29"));
  if (document.modelContext?.registerTool) {
    const register = tool => Promise.resolve(document.modelContext.registerTool(tool)).catch(() => {});
    register({name:"read_learning_sets",title:"Read learning sets",description:"Read the current spelling words and poem titles configured in Learning Arcade.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>({spellingWords:[...store.spelling],poems:store.poems.map(p=>({id:p.id,title:p.title,author:p.author}))})});
    register({name:"update_spelling_words",title:"Update spelling words",description:"Replace the weekly spelling word bank and update the visible app.",inputSchema:{type:"object",properties:{words:{type:"array",items:{type:"string",minLength:1},minItems:1}},required:["words"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:({words})=>{if(!Array.isArray(words)||!words.length)throw new Error("At least one word is required");store.spelling=[...new Set(words.map(w=>String(w).trim()).filter(Boolean))];save();if($("[data-screen='settings']").classList.contains("active"))renderSettings();return{saved:true,count:store.spelling.length};}});
    register({name:"add_practice_poem",title:"Add practice poem",description:"Add a poem to the memorization and recitation list.",inputSchema:{type:"object",properties:{title:{type:"string",minLength:1},author:{type:"string"},text:{type:"string",minLength:1}},required:["title","text"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:({title,author="",text})=>{if(!String(title).trim()||!String(text).trim())throw new Error("Title and poem text are required");const poem={id:`poem-${Date.now()}`,title:String(title).trim(),author:String(author).trim(),text:String(text).trim()};store.poems.push(poem);save();if($("[data-screen='poems']").classList.contains("active"))renderPoems();return{saved:true,id:poem.id,title:poem.title};}});
  }
  wireSoundControls();wireStartupGate();wireOnboarding();wireParentPinGate();renderHome();setAudioScene("menu");
})();
