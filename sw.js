const CACHE = "learning-arcade-v22";
const PACKS = {"cartoon-dog-heeler":["sheaf","were","between","extreme","turkey","trolley","wheat","feast","copy","astronomy","complete","envy","money","sincere","speech","kneel","tease","freeze","barley","empty"],"william-cypher":["police","promise","reply","slight","behind","child","mire","cyclone","sighing","satisfy","lightning","die","rind","thy","untie","whine","divide","decide","sign","thigh"],"circuit-sentinel":["police","promise","reply","slight","behind","child","mire","cyclone","sighing","satisfy","lightning","die","rind","thy","untie","whine","divide","decide","sign","thigh"]};
const AUDIO = Object.entries(PACKS).flatMap(([pack,words])=>[`./audio/${pack}/poems/the-crocodile.mp3`,...words.map(word=>`./audio/${pack}/spelling/${word}.mp3`)]);
const SKINS = ["core","ember","frost","volt","cyclone","prism"].flatMap(form=>["idle","success","thinking"].map(pose=>`./assets/characters/skins/${form}-${pose}.png`));
const BOSSES = ["static-swarm","echo-engine","number-glitch","verse-vortex","doubt-cloud"].map(boss=>`./assets/characters/bosses/${boss}.png`);
const ART = ["./assets/backgrounds/circuit-lab.jpg","./assets/backgrounds/metal-panel.jpg","./assets/backgrounds/mission-map.png","./assets/characters/circuit-sentinel-action.png","./assets/characters/circuit-sentinel-success.png","./assets/characters/circuit-sentinel-thinking.png","./assets/characters/professor-volt.png","./assets/icons/app-icon-180.png","./assets/icons/app-icon-192.png","./assets/icons/app-icon-512.png","./assets/ui/energy-orb.png",...SKINS,...BOSSES];
const SOUNDS = ["./audio/interface/game-select.mp3","./audio/interface/level-play.mp3","./audio/interface/round-finished.mp3","./audio/interface/answer-selected.wav","./audio/interface/wrong-answer.mp3","./audio/interface/professor-opening.mp3","./audio/interface/sentinel-start.mp3"];
const LOCAL = ["./","./index.html","./styles.css","./data.js","./app.js","./manifest.webmanifest","./icon.svg","./vendor/d3.min.js","./vendor/topojson-client.min.js","./vendor/states-10m.json",...ART,...AUDIO,...SOUNDS];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(LOCAL)).then(()=>self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const sameOrigin = new URL(event.request.url).origin === self.location.origin;
  if (sameOrigin) event.respondWith(fetch(event.request).then(response => {const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match("./index.html"))));
  else event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;})));
});
