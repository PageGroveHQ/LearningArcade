// Built-in game content: sectors, missions, rewards, shop items, story chapters, bosses.
// Part of the Learning Arcade app. Files in app/ share one global scope and load in the order listed in index.html.
  const SECTORS = {
    states:{title:"Atlas Station",subtitle:"Atlas Quest",icon:"⌖",className:"atlas",target:"states"},
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
    {id:"cyan-trim",at:2,name:"Cyan Armor Trim",slot:"trim",art:"assets/ui/rewards/cyan-armor-trim.png",description:"A luminous cyan armor-edge module for every Sentinel form."},
    {id:"navigator-trim",at:5,name:"Navigator Badge",slot:"trim",art:"assets/ui/rewards/navigator-badge.png",description:"A silver, cyan, and gold navigator module with a precision glow."},
    {id:"orb-trail-aura",at:8,name:"Energy Orb Trail",slot:"aura",art:"assets/ui/rewards/energy-orb-trail.png",description:"Three fast energy orbs sweep around Sentinel in a bright arc."},
    {id:"reactor-aura",at:12,name:"Reactor Glow",slot:"aura",art:"assets/ui/rewards/reactor-glow.png",description:"A segmented solar reactor halo powers up behind Sentinel."},
    {id:"archive-aura",at:16,name:"Archive Crest",slot:"aura",art:"assets/ui/rewards/archive-crest.png",description:"The restored Learning Archive appears as a violet circuit crest."},
    {id:"master-aura",at:20,name:"Master Sentinel Emblem",slot:"aura",art:"assets/ui/rewards/master-sentinel-emblem.png",description:"The final prismatic emblem for restoring all twenty systems."}
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
    {id:"map",name:"Map Scanner",cost:15,icon:"⌖",description:"Reveal a useful Atlas Quest location clue.",limit:9},
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
  const SENTINEL_RECORDS = [
    {id:"state-pathfinder",name:"Atlas Pathfinder",description:"Record 100 correct Atlas Quest answers.",goal:100,progress:profile=>profile.stats.subjects.states?.correct||0},
    {id:"knowledge-weaver",name:"Knowledge Weaver",description:"Record 100 correct Word Wizard and Study Lab answers.",goal:100,progress:profile=>(profile.stats.subjects.spelling?.correct||0)+(profile.stats.subjects.study?.correct||0)},
    {id:"number-architect",name:"Number Architect",description:"Record 150 correct Math Mayhem answers.",goal:150,progress:profile=>profile.stats.subjects.math?.correct||0},
    {id:"memory-keeper",name:"Memory Keeper",description:"Record 40 correct Poem Power answers.",goal:40,progress:profile=>profile.stats.subjects.poems?.correct||0},
    {id:"mastery-signal",name:"Mastery Signal",description:"Record 500 correct answers across every learning system.",goal:500,progress:profile=>Object.values(profile.stats.subjects||{}).reduce((sum,item)=>sum+(item.correct||0),0)},
    {id:"repair-tech",name:"Repair Technician",description:"Correct 15 previously missed signals.",goal:15,progress:profile=>Object.values(profile.stats.mistakes||{}).reduce((sum,item)=>sum+(item.corrected||0),0)},
    {id:"homework-hero",name:"Mission Board Hero",description:"Verify 10 completed homework assignments.",goal:10,progress:profile=>(profile.homeworkTasks||[]).filter(task=>task.verified).length},
    {id:"steady-signal",name:"Steady Signal",description:"Practice on 10 different days.",goal:10,progress:profile=>Object.keys(profile.stats.days||{}).length}
  ];
  const SEASON_TWO_BOSSES = [
    {id:"atlas-aegis",season:2,subject:"states",recordId:"state-pathfinder",name:"Atlas Aegis",sector:"Frontier Grid",goal:9,questions:13,reward:55,color:"#25d6a2",art:"assets/characters/bosses/season-2/atlas-aegis.webp",brief:"An elite cartography Sentinel has sealed every route beyond the restored arcade.",hint:"Break his coordinate shield with precise state, capital, abbreviation, border, and map answers."},
    {id:"cipher-talon",season:2,subjects:["spelling","study"],recordId:"knowledge-weaver",name:"Cipher Talon",sector:"Cipher Vault",goal:9,questions:13,reward:55,color:"#d84be9",art:"assets/characters/bosses/season-2/cipher-talon.webp",brief:"A blade-fast code Sentinel is slicing words and study signals into false patterns.",hint:"Use spelling and Study Lab knowledge to identify each true signal."},
    {id:"quotient-titan",season:2,subject:"math",recordId:"number-architect",name:"Quotient Titan",sector:"Number Foundry",goal:10,questions:14,reward:65,color:"#ff9d2e",art:"assets/characters/bosses/season-2/quotient-titan.webp",brief:"A heavy calculation Sentinel has locked the foundry gears in an endless equation.",hint:"Use multiplication and division fluency to overpower his number gauntlets."},
    {id:"verse-valkyrie",season:2,subjects:["poems","study"],recordId:"memory-keeper",name:"Verse Valkyrie",sector:"Resonance Spire",goal:8,questions:12,reward:55,color:"#df63d7",art:"assets/characters/bosses/season-2/verse-valkyrie.webp",brief:"A ruthless signal commander has turned memory and meaning into a weaponized rhythm.",hint:"Restore poem lines and knowledge signals before her resonance field peaks."},
    {id:"null-regent",season:2,subject:"final",recordId:"mastery-signal",name:"Null Regent",sector:"Mirror Citadel",goal:14,questions:20,reward:125,color:"#58ccff",art:"assets/characters/bosses/season-2/null-regent.webp",brief:"The commander behind the Mirror Signal has copied every restored system into a final defense.",hint:"Combine every subject and prove that true mastery cannot be copied."}
  ];
  const SEASON_TWO_CHAPTERS = [
    {id:"mirror-signal",season:2,afterBoss:"doubt-cloud",number:"Season 2 · Prologue",title:"The Mirror Signal",summary:"A disciplined rival network answers the restored arcade.",accent:"#55d8ff",scenes:[
      {speaker:"Professor Volt",pose:"thinking",text:"The Doubt Cloud is gone, but a new transmission is reflecting every signal we send."},
      {speaker:"Circuit Sentinel",pose:"idle",text:"These are not runaway programs. Five armored Sentinels are guarding a citadel beyond the Central Grid."},
      {speaker:"Null Regent",art:"assets/characters/bosses/season-2/null-regent.webp",location:"Mirror Citadel",text:"Restoration proves persistence. Mastery requires far more. Enter my grid—if your records are strong enough."}
    ]},
    {id:"frontier-lock",season:2,afterBoss:"atlas-aegis",number:"Season 2 · Chapter 1",title:"The Frontier Lock",summary:"Atlas Aegis yields the first route into the rival grid.",accent:"#25d6a2",scenes:[
      {speaker:"Atlas Aegis",art:"assets/characters/bosses/season-2/atlas-aegis.webp",location:"Frontier Grid",text:"Your coordinates are exact. The Frontier Lock recognizes a true Pathfinder."},
      {speaker:"Circuit Sentinel",pose:"success",text:"One route is open. Four rival signals remain between us and the Mirror Citadel."}
    ]},
    {id:"cipher-breach",season:2,afterBoss:"cipher-talon",number:"Season 2 · Chapter 2",title:"The Cipher Breach",summary:"The Cipher Vault reveals how the rival network studies the arcade.",accent:"#d84be9",scenes:[
      {speaker:"Cipher Talon",art:"assets/characters/bosses/season-2/cipher-talon.webp",location:"Cipher Vault",text:"You recognized every false pattern. My archive can no longer conceal the Citadel route."},
      {speaker:"Professor Volt",pose:"thinking",text:"The Regent has been copying finished answers. He never learned what makes practice turn into understanding."}
    ]},
    {id:"foundry-break",season:2,afterBoss:"quotient-titan",number:"Season 2 · Chapter 3",title:"The Foundry Break",summary:"Multiplication and division bring the Number Foundry to a halt.",accent:"#ff9d2e",scenes:[
      {speaker:"Quotient Titan",art:"assets/characters/bosses/season-2/quotient-titan.webp",location:"Number Foundry",text:"My calculations were powerful—but yours were connected. Products, factors, and quotients moved as one."},
      {speaker:"Circuit Sentinel",pose:"success",text:"The foundry gears are ours. The path now points toward the Resonance Spire."}
    ]},
    {id:"resonance-falls",season:2,afterBoss:"verse-valkyrie",number:"Season 2 · Chapter 4",title:"When Resonance Falls",summary:"Memory and meaning silence the final tower guarding the Citadel.",accent:"#df63d7",scenes:[
      {speaker:"Verse Valkyrie",art:"assets/characters/bosses/season-2/verse-valkyrie.webp",location:"Resonance Spire",text:"You did more than repeat the signal. You remembered its order and understood its meaning."},
      {speaker:"Professor Volt",pose:"success",text:"All four outer guards are down. Only the Null Regent remains."}
    ]},
    {id:"true-signal",season:2,afterBoss:"null-regent",number:"Season 2 · Finale",title:"The True Signal",summary:"The Learning Arcade proves that mastery is built, not copied.",accent:"#ffd86b",scenes:[
      {speaker:"Null Regent",art:"assets/characters/bosses/season-2/null-regent.webp",location:"Mirror Citadel",text:"I copied every answer, yet your signal grew stronger. Your mistakes became repairs. Mine became cracks."},
      {speaker:"Circuit Sentinel",pose:"success",text:"Knowledge is not a collection of perfect answers. It is what we can use, connect, and keep building."},
      {speaker:"Professor Volt",pose:"success",text:"Season Two is complete. The Mirror Citadel now stands beside the Learning Arcade as a new training frontier."}
    ]}
  ];
  const ALL_BOSSES = [...BOSSES,...SEASON_TWO_BOSSES];
  const ALL_CHAPTERS = [...CHAPTERS,...SEASON_TWO_CHAPTERS];
