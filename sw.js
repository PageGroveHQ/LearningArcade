const CACHE = "learning-arcade-v44";
const PACKS = {"circuit-sentinel":["yolk","post","thrown","throat","suppose","though","approach","bellow","foam","know","joe","colt","doughnut","yoke","stroll","hoe","throne","boast","woeful","prove"]};
// Word recordings are cached on first successful use. Keeping them out of the
// install list lets a newly entered bank use device speech until its MP3s are generated.
const AUDIO = Object.keys(PACKS).map(pack=>`./audio/${pack}/poems/the-crocodile.mp3`);
const STATE_ABBRS = ["al","ak","az","ar","ca","co","ct","de","dc","fl","ga","hi","id","il","in","ia","ks","ky","la","me","md","ma","mi","mn","ms","mo","mt","ne","nv","nh","nj","nm","ny","nc","nd","oh","ok","or","pa","ri","sc","sd","tn","tx","ut","vt","va","wa","wv","wi","wy"];
const STATE_AUDIO = STATE_ABBRS.flatMap(abbr=>[`./audio/circuit-sentinel/states/names/${abbr}.mp3`,`./audio/circuit-sentinel/states/capitals/${abbr}.mp3`]);
const SKINS = ["core","ember","frost","volt","cyclone","prism"].flatMap(form=>["idle","success","thinking"].map(pose=>`./assets/characters/skins/${form}-${pose}.png`));
const BOSSES = ["static-swarm","echo-engine","number-glitch","verse-vortex","doubt-cloud"].map(boss=>`./assets/characters/bosses/${boss}.png`);
const SEASON_TWO_BOSSES = ["atlas-aegis","cipher-talon","quotient-titan","verse-valkyrie","null-regent"].map(boss=>`./assets/characters/bosses/season-2/${boss}.webp`);
const REWARD_ART = ["cyan-armor-trim","navigator-badge","energy-orb-trail","reactor-glow","archive-crest","master-sentinel-emblem"].map(name=>`./assets/ui/rewards/${name}.png`);
const ART = ["./assets/backgrounds/circuit-lab.jpg","./assets/backgrounds/metal-panel.jpg","./assets/backgrounds/mission-map.png","./assets/backgrounds/stage-loading.png","./assets/characters/circuit-sentinel-action.png","./assets/characters/circuit-sentinel-success.png","./assets/characters/circuit-sentinel-thinking.png","./assets/characters/professor-volt.png","./assets/icons/app-icon-180.png","./assets/icons/app-icon-192.png","./assets/icons/app-icon-512.png","./assets/ui/energy-orb.png",...REWARD_ART,...SKINS,...BOSSES,...SEASON_TWO_BOSSES];
const SOUNDS = ["./audio/interface/game-select.mp3","./audio/interface/level-play.mp3","./audio/interface/round-finished.mp3","./audio/interface/answer-selected.wav","./audio/interface/wrong-answer.mp3","./audio/interface/professor-opening.mp3","./audio/interface/sentinel-start.mp3"];
const LOCAL = ["./","./index.html","./styles.css","./features.css","./data.js","./cloud-config.js","./cloud-sync.js","./app.js","./manifest.webmanifest","./icon.svg","./templates/study-lab-import-template.csv","./templates/mission-board-import-template.csv","./vendor/d3.min.js","./vendor/topojson-client.min.js","./vendor/states-10m.json",...ART,...AUDIO,...STATE_AUDIO,...SOUNDS];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(LOCAL)).then(()=>self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const sameOrigin = new URL(event.request.url).origin === self.location.origin;
  if (sameOrigin) event.respondWith(fetch(event.request).then(response => {const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match("./index.html"))));
  else event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;})));
});
