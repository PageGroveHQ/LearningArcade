const CACHE = "asher-arcade-v7";
const PACKS = {"cartoon-dog-heeler":["sheaf","were","between","extreme","turkey","trolley","wheat","feast","copy","astronomy","complete","envy","money","sincere","speech","kneel","tease","freeze","barley","empty"],"william-cypher":["police","promise","reply","slight","behind","child","mire","cyclone","sighing","satisfy","lightning","die","rind","thy","untie","whine","divide","decide","sign","thigh"]};
const AUDIO = Object.entries(PACKS).flatMap(([pack,words])=>[`./audio/${pack}/poems/the-crocodile.mp3`,...words.map(word=>`./audio/${pack}/spelling/${word}.mp3`)]);
const LOCAL = ["./","./index.html","./styles.css","./data.js","./app.js","./manifest.webmanifest","./icon.svg","./vendor/d3.min.js","./vendor/topojson-client.min.js","./vendor/states-10m.json",...AUDIO];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(LOCAL))));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const sameOrigin = new URL(event.request.url).origin === self.location.origin;
  if (sameOrigin) event.respondWith(fetch(event.request).then(response => {const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match("./index.html"))));
  else event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;})));
});
