// Shared helpers: DOM shortcuts, text/date/CSV utilities, toast, profile factory.
// Part of the Learning Arcade app. Files in app/ share one global scope and load in the order listed in index.html.
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const esc = (value = "") => String(value).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const shuffle = arr => [...arr].sort(() => Math.random() - .5);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const norm = value => String(value).trim().toLowerCase().replace(/[.?!,'’]/g, "").replace(/\s+/g, " ");
  const today = () => isoLocal(new Date());
  const STORE = "learning-arcade-v2",SKIP_INTRO_ONCE="learning-arcade-skip-intro-once-v1";
  const OLD_STORE = "asher-learning-arcade-v1";
  const ROUND_DETAIL_LIMIT = 10;
  const ORIGINAL_SPELLING = ["because", "friend", "school", "people", "favorite", "different", "thought", "through"];
  const BUNDLED_SPELLING = window.BUNDLED_SPELLING_WORDS || [];
  const blankStats = () => ({stars:0,days:{},subjects:{},rounds:[],mistakes:{},skills:{},assessments:{}});
  const createProfile = (name="Player 1", stats=blankStats()) => ({id:`profile-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,name,stats,missions:{},activeMissionId:"state-scan-1",inventory:["core"],equippedWeapon:"core",consumables:{},cosmeticsOwned:[],equippedCosmetics:{},tracksOwned:[],equippedTrack:"",seenChapters:[],bosses:{},homeworkTasks:[],homeworkRewards:[],savedRound:null,lastRoundUndo:null});

  function toast(message) {
    const el = $("#toast"); el.textContent = message; el.classList.add("show");
    clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("show"), 1800);
  }

  function isoLocal(date){const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,"0"),d=String(date.getDate()).padStart(2,"0");return `${y}-${m}-${d}`;}
  function weekStart(offset=0){const date=new Date(),day=(date.getDay()+6)%7;date.setHours(12,0,0,0);date.setDate(date.getDate()-day+(offset*7));return date;}
  function addDays(date,days){const next=new Date(date);next.setDate(next.getDate()+days);return next;}
  function prettyDate(date){return date.toLocaleDateString(undefined,{month:"short",day:"numeric"});}
  function downloadText(filename,text,type="text/plain"){const blob=new Blob([text],{type}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),0);}
  function parseCSV(text){const rows=[];let row=[],cell="",quoted=false;for(let i=0;i<text.length;i++){const char=text[i],next=text[i+1];if(char==='"'&&quoted&&next==='"'){cell+='"';i++;}else if(char==='"')quoted=!quoted;else if(char===','&&!quoted){row.push(cell);cell="";}else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&next==='\n')i++;row.push(cell);if(row.some(value=>value.trim()))rows.push(row);row=[];cell="";}else cell+=char;}row.push(cell);if(row.some(value=>value.trim()))rows.push(row);return rows;}
