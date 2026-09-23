(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const esc = (value = "") => String(value).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const shuffle = arr => [...arr].sort(() => Math.random() - .5);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const norm = value => String(value).trim().toLowerCase().replace(/[.?!,'’]/g, "").replace(/\s+/g, " ");
  const today = () => new Date().toISOString().slice(0, 10);
  const STORE = "asher-learning-arcade-v1";
  const defaults = {
    spelling: ["because", "friend", "school", "people", "favorite", "different", "thought", "through"],
    poems: window.DEFAULT_POEMS,
    stats: {stars: 0, days: {}},
    statePrefs: {region:"New England", mode:"mixed", kind:"mixed"},
    mathPrefs: {tables:[0,1,2,3,4,5,6,7,8,9], mode:"mixed"},
    spellingPrefs: {mode:"mixed"}
  };
  let store;
  try { store = {...defaults, ...JSON.parse(localStorage.getItem(STORE) || "{}")}; }
  catch { store = structuredClone(defaults); }
  store.stats ||= {stars:0, days:{}}; store.stats.days ||= {};
  store.poems = Array.isArray(store.poems) && store.poems.length ? store.poems : window.DEFAULT_POEMS;
  store.spelling = Array.isArray(store.spelling) ? store.spelling : defaults.spelling;
  const save = () => localStorage.setItem(STORE, JSON.stringify(store));
  let session = null;
  let mapTopology = null;

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
    if (name === "settings") renderSettings();
  }

  function head(title, subtitle, back = "home") {
    return `<div class="page-head"><button class="back" data-go="${back}" aria-label="Go back">‹</button><div><h1>${esc(title)}</h1>${subtitle ? `<p>${esc(subtitle)}</p>` : ""}</div></div>`;
  }

  function renderHome() {
    const count = store.stats.days[today()]?.answered || 0;
    $("#totalStars").textContent = store.stats.stars || 0;
    $("#todayCount").textContent = count ? `${count} answer${count === 1 ? "" : "s"} practiced today` : "Ready for your first round";
    $("#progressRing span").textContent = count;
    $("#progressRing").style.background = `conic-gradient(var(--gold) ${Math.min(count / 20, 1) * 360}deg,#eeeafa 0)`;
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
    const regions = ["New England","All 50","Mid-Atlantic","Southeast","Midwest","Southwest","West"];
    $("#statesView").innerHTML = `${head("State Quest","Connect every state, capital, abbreviation, and shape")}
      <div class="panel"><p class="label">Study set</p><div class="pill-row" data-choice-group="region">${regions.map(r => `<button class="pill ${p.region === r ? "selected" : ""}" data-value="${r}">${r}</button>`).join("")}</div><p class="helper">Regional groups are ready to adjust later when the teacher shares the exact class list.</p></div>
      <div class="panel"><p class="label">Question style</p><div class="option-grid" data-choice-group="kind">
        <button class="choice ${p.kind === "mixed" ? "selected" : ""}" data-value="mixed">Mixed clues</button><button class="choice ${p.kind === "map" ? "selected" : ""}" data-value="map">Map shapes</button>
        <button class="choice ${p.kind === "facts" ? "selected" : ""}" data-value="facts">Names & capitals</button><button class="choice ${p.kind === "triples" ? "selected" : ""}" data-value="triples">Three-way match</button>
      </div></div>
      <div class="panel"><p class="label">Who is holding the phone?</p>${modeButtons(p.mode)}</div>
      <button class="primary" id="startStates">Start 10-question quest</button>`;
    wireChoices($("#statesView"), (group, value) => { p[group] = value; store.statePrefs = p; save(); });
    $("#startStates").onclick = () => startStates(p);
  }

  function activeStates(region) { return region === "All 50" ? STATE_DATA : STATE_DATA.filter(s => s.region === region); }
  function stateQuestion(states, kind) {
    const state = pick(states); const actualKind = kind === "mixed" ? pick(["facts","facts","map","triples"]) : kind;
    if (actualKind === "map") return {subject:"states", state, map:true, prompt:"Which state is this?", answer:`${state.name} · ${state.abbr} · ${state.capital}`, accepts:[state.name,state.abbr,state.capital], combined:true, detail:`${state.name} — ${state.abbr} — ${state.capital}`};
    if (actualKind === "triples") return {subject:"states", state, prompt:`Complete the set for ${state.name}`, answer:`${state.abbr} · ${state.capital}`, accepts:[state.abbr,state.capital], combined:true, detail:`${state.name} — ${state.abbr} — ${state.capital}`};
    const direction = pick(["state-capital","state-abbr","capital-state","abbr-state","capital-abbr","abbr-capital"]);
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

  function startStates(p) {
    const states = activeStates(p.region); const questions = Array.from({length:10}, () => stateQuestion(states, p.kind));
    questions.forEach(q => q.pool = states);
    startSession("State Quest", questions, p.mode);
  }

  function renderSpelling() {
    const p = store.spellingPrefs || defaults.spellingPrefs;
    $("#spellingView").innerHTML = `${head("Word Wizard",`${store.spelling.length} words in this week's bank`)}
      <div class="panel"><p class="label">This week's words</p><div class="pill-row">${store.spelling.slice(0,10).map(w => `<span class="pill">${esc(w)}</span>`).join("")}${store.spelling.length > 10 ? `<span class="pill">+${store.spelling.length-10}</span>`:""}</div><button class="secondary" data-go="settings" data-focus="spelling">Edit word bank</button></div>
      <div class="panel"><p class="label">Practice mode</p>${modeButtons(p.mode)}</div>
      <div class="panel"><p class="helper"><strong>Listen mode:</strong> in child play, tap the speaker to hear each word. In parent mode, the spelling stays visible only to the person holding the phone.</p></div>
      <button class="primary" id="startSpelling" ${store.spelling.length ? "" : "disabled"}>Start spelling round</button>`;
    wireChoices($("#spellingView"), (_,value) => { p.mode=value; store.spellingPrefs=p; save(); });
    $("#startSpelling").onclick = () => {
      const words = shuffle(store.spelling).slice(0,Math.min(12,store.spelling.length));
      startSession("Word Wizard", words.map(word => ({subject:"spelling",prompt:"Spell the word you hear",answer:word,speech:word,detail:word,pool:store.spelling})), p.mode);
    };
  }

  function renderMath() {
    const p = store.mathPrefs || defaults.mathPrefs;
    $("#mathView").innerHTML = `${head("Multiply Mayhem","Build speed and confidence from 0 × 0 to 9 × 9")}
      <div class="panel"><p class="label">Choose tables</p><div class="option-grid" id="tableGrid">${[0,1,2,3,4,5,6,7,8,9].map(n => `<button class="choice ${p.tables.includes(n)?"selected":""}" data-table="${n}">${n}s</button>`).join("")}</div><div class="two" style="margin-top:10px"><button class="tiny" data-preset="all">All tables</button><button class="tiny" data-preset="tricky">6s–9s</button></div></div>
      <div class="panel"><p class="label">Practice mode</p>${modeButtons(p.mode)}</div>
      <button class="primary" id="startMath">Start 12-question round</button>`;
    $("#tableGrid").onclick = e => { const b=e.target.closest("[data-table]"); if(!b)return; const n=+b.dataset.table; p.tables=p.tables.includes(n)?p.tables.filter(x=>x!==n):[...p.tables,n].sort(); if(!p.tables.length)p.tables=[n]; store.mathPrefs=p;save();renderMath(); };
    $$('[data-preset]',$("#mathView")).forEach(b=>b.onclick=()=>{p.tables=b.dataset.preset==="all"?[0,1,2,3,4,5,6,7,8,9]:[6,7,8,9];store.mathPrefs=p;save();renderMath();});
    wireChoices($("#mathView"),(_,value)=>{p.mode=value;store.mathPrefs=p;save();});
    $("#startMath").onclick=()=>{const qs=[];const seen=new Set();while(qs.length<12){const a=pick(p.tables),b=Math.floor(Math.random()*10),key=`${a}x${b}`;if(seen.has(key)&&p.tables.length>1)continue;seen.add(key);qs.push({subject:"math",prompt:`${a} × ${b}`,answer:String(a*b),detail:`${a} × ${b} = ${a*b}`,a,b});}startSession("Multiply Mayhem",qs,p.mode);};
  }

  function renderPoems() {
    const poem = store.poems[0];
    $("#poemsView").innerHTML = `${head("Poem Power","Learn a poem a little at a time")}
      <div class="panel"><p class="label">Choose a poem</p><div class="stack" id="poemList">${store.poems.map((p,i)=>`<button class="list-item ${i===0?"selected":""}" data-poem="${esc(p.id)}"><span class="subject-icon" style="background:#f1e8ff;color:#8047b1">❝</span><span class="grow"><strong>${esc(p.title)}</strong><small>${esc(p.author||"Author not listed")}</small></span><span>›</span></button>`).join("")}</div><button class="secondary" style="margin-top:10px" data-go="settings" data-focus="poems">Add or edit poems</button></div>
      <div class="panel" id="poemModes">${poemModeMarkup(poem)}</div>`;
    let selected=poem;
    $("#poemList").onclick=e=>{const b=e.target.closest("[data-poem]");if(!b)return;selected=store.poems.find(p=>p.id===b.dataset.poem);$$('[data-poem]').forEach(x=>x.classList.toggle('selected',x===b));$("#poemModes").innerHTML=poemModeMarkup(selected);wirePoemModes(selected);};
    wirePoemModes(selected);
  }

  function poemModeMarkup(poem){return `<p class="label">Practice ${esc(poem.title)}</p><div class="stack">
    <button class="choice" data-poem-mode="read">Read it aloud</button><button class="choice" data-poem-mode="missing">Missing words</button><button class="choice" data-poem-mode="lines">Next-line prompts</button><button class="choice" data-poem-mode="recite">Recite from memory</button></div>`;}
  function wirePoemModes(poem){$$('[data-poem-mode]',$("#poemModes")).forEach(b=>b.onclick=()=>startPoem(poem,b.dataset.poemMode));}
  function startPoem(poem,mode){
    const lines=poem.text.split("\n").filter(x=>x.trim());
    if(mode==="read"){session={title:"Poem Power",questions:[{subject:"poem-read",prompt:poem.title,answer:poem.text,detail:poem.author}],index:0,correct:0,mode:"read"};go("session");renderQuestion();return;}
    if(mode==="recite"){session={title:"Poem Power",questions:[{subject:"poem-recite",prompt:`Recite “${poem.title}” from memory`,answer:poem.text,detail:poem.author}],index:0,correct:0,mode:"parent"};go("session");renderQuestion();return;}
    if(mode==="lines"){const qs=lines.slice(0,-1).map((line,i)=>({subject:"poem-line",prompt:line,answer:lines[i+1],detail:`Next line: ${lines[i+1]}`}));startSession("Next-Line Prompts",shuffle(qs).slice(0,8),"type");return;}
    const words=poem.text.match(/[A-Za-z’']+/g)||[];const targets=shuffle(words.filter(w=>w.length>3)).slice(0,Math.min(8,words.length));const qs=targets.map(word=>({subject:"poem-missing",prompt:poem.text.replace(new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i'),"_____"),answer:word,detail:`The missing word was “${word}.”`}));startSession("Missing Words",qs,"type");
  }

  function startSession(title,questions,mode){session={title,questions,index:0,correct:0,mode,locked:false};go("session");renderQuestion();}
  function resolvedMode(){return session.mode==="mixed"?pick(["choice","type"]):session.mode;}
  function renderQuestion(){
    const view=$("#sessionView");const q=session.questions[session.index];if(!q){renderFinish();return;}session.locked=false;session.currentMode=resolvedMode();
    const pct=(session.index/session.questions.length)*100;
    view.innerHTML=`<div class="quiz-shell"><div class="quiz-top"><button class="back" data-end-session aria-label="End round">×</button><div class="quiz-progress"><span style="width:${pct}%"></span></div><div class="score">★ ${session.correct}</div></div><div class="flash-card" id="flashCard"><p class="prompt-label">${esc(session.title)} · ${session.index+1} of ${session.questions.length}</p><div id="questionBody"></div></div></div>`;
    $('[data-end-session]').onclick=()=>{session=null;go('home');};
    renderQuestionBody(q);
  }

  function renderQuestionBody(q){
    const body=$("#questionBody");const mode=session.currentMode;
    if(q.subject==="poem-read") {body.innerHTML=`<h2>${esc(q.prompt)}</h2><p class="helper">${esc(q.detail)}</p><div class="poem-text">${esc(q.answer)}</div><button class="primary" style="margin-top:18px" data-self-done>Read it aloud</button>`;$('[data-self-done]').onclick=()=>grade(true);return;}
    const speech=q.speech?`<button class="subject-icon" id="speakWord" aria-label="Hear the word" style="border:0;color:#5e4bd0">🔊</button>`:"";
    body.innerHTML=`${q.map?`<div class="map-stage" id="mapStage"><span class="helper">Loading state shape…</span></div>`:""}${speech}<h2 class="${q.subject?.startsWith('poem')?'poem-text':''}">${esc(q.prompt)}</h2><div id="interaction"></div>`;
    if(q.map) renderStateMap(q.state);
    if(q.speech){const speak=()=>{speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(q.speech));};$("#speakWord").onclick=speak;setTimeout(speak,250);}
    if(mode==="parent") renderParent(q); else if(mode==="choice") renderMultipleChoice(q); else renderTyped(q);
  }

  function renderParent(q){
    const it=$("#interaction");it.innerHTML=`<button class="secondary" id="revealAnswer">Reveal answer</button><div id="revealed" hidden><div class="feedback good">${q.subject==="poem-recite"?`<div class="poem-text">${esc(q.answer)}</div>`:esc(q.detail||q.answer)}</div><div class="grade-row"><button class="grade wrong" data-grade="false">← Keep practicing</button><button class="grade right" data-grade="true">Got it →</button></div><div class="swipe-hint"><span>Swipe left</span><span>Swipe right</span></div></div>`;
    $("#revealAnswer").onclick=()=>{$("#revealAnswer").hidden=true;$("#revealed").hidden=false;};
    $$('[data-grade]').forEach(b=>b.onclick=()=>grade(b.dataset.grade==="true"));wireSwipe();
  }

  function answerOptions(q){
    if(q.subject==="math"){const n=+q.answer;return shuffle([...new Set([n,n+q.a,n+q.b,Math.max(0,n-q.a),n+1])]).slice(0,4).map(String);}
    if(q.subject==="spelling"){const w=q.answer;const variants=[w,w.slice(0,-1)+(w.endsWith('e')?'a':'e'),w.replace(/([aeiou])/, '$1$1'),w.length>4?w.slice(0,2)+w.slice(3):w+'e'];return shuffle([...new Set(variants)]).slice(0,4);}
    if(q.subject==="states"){
      if(q.combined){return shuffle([q.state,...shuffle(q.pool.filter(s=>s!==q.state)).slice(0,3)]).map(s=>q.map?`${s.name} · ${s.abbr} · ${s.capital}`:`${s.abbr} · ${s.capital}`);}
      const prop=q.answerType==="state"?"name":q.answerType==="capital"?"capital":"abbr";return shuffle([q.answer,...shuffle(q.pool.filter(s=>s!==q.state)).slice(0,3).map(s=>s[prop])]);
    }
    return [q.answer];
  }
  function renderMultipleChoice(q){const it=$("#interaction");const opts=answerOptions(q);it.innerHTML=`<div class="answers">${opts.map(o=>`<button class="answer" data-answer="${esc(o)}">${esc(o)}</button>`).join("")}</div><div id="feedback"></div>`;$$('[data-answer]').forEach(b=>b.onclick=()=>{if(session.locked)return;const ok=norm(b.dataset.answer)===norm(q.answer);b.classList.add(ok?'correct':'wrong');finishAnswer(ok,q);});}
  function renderTyped(q){const it=$("#interaction");if(q.combined){const labels=q.map?["State","Abbreviation","Capital"]:["Abbreviation","Capital"];it.innerHTML=`<div class="stack">${labels.map((l,i)=>`<input class="answer-input" data-part="${i}" aria-label="${l}" placeholder="${l}" autocapitalize="words">`).join("")}<button class="primary" data-check>Check answer</button></div><div id="feedback"></div>`;$('[data-check]').onclick=()=>{const vals=$$('[data-part]').map(x=>x.value);const expected=q.map?[q.state.name,q.state.abbr,q.state.capital]:[q.state.abbr,q.state.capital];finishAnswer(vals.every((v,i)=>norm(v)===norm(expected[i])),q);};}
    else{it.innerHTML=`<form id="answerForm" class="stack"><input class="answer-input" id="typedAnswer" aria-label="Your answer" placeholder="Type your answer" autocomplete="off" autocapitalize="words"><button class="primary">Check answer</button></form><div id="feedback"></div>`;$("#answerForm").onsubmit=e=>{e.preventDefault();finishAnswer(norm($("#typedAnswer").value)===norm(q.answer),q);};setTimeout(()=>$("#typedAnswer")?.focus(),80);}}

  function finishAnswer(ok,q){if(session.locked)return;session.locked=true;const feedback=$("#feedback")||$("#interaction");const correction=q.subject==="math"&&!ok?`${q.a} groups of ${q.b}: ${Array(q.a).fill(q.b).join(" + ") || "0"} = ${q.answer}`:q.detail||`Answer: ${q.answer}`;feedback.innerHTML=`<div class="feedback ${ok?'good':'try'}">${ok?pick(["Nice work!","You got it!","Great recall!","Level up!"]):`Good try. ${esc(correction)}`}</div><button class="primary" style="margin-top:10px" data-next>${session.index===session.questions.length-1?'See results':'Next question'}</button>`;$('[data-next]').onclick=()=>grade(ok);}
  function grade(ok){if(ok)session.correct++;const day=store.stats.days[today()]||{answered:0,correct:0};day.answered++;if(ok)day.correct++;store.stats.days[today()]=day;if(ok)store.stats.stars=(store.stats.stars||0)+1;save();session.index++;renderQuestion();}
  function wireSwipe(){let startX=0;const card=$("#flashCard");card.addEventListener('touchstart',e=>startX=e.touches[0].clientX,{passive:true});card.addEventListener('touchend',e=>{if($("#revealed")?.hidden)return;const d=e.changedTouches[0].clientX-startX;if(Math.abs(d)>70)grade(d>0);},{passive:true});}

  async function renderStateMap(state){const stage=$("#mapStage");try{if(!mapTopology){const res=await fetch("vendor/states-10m.json");mapTopology=await res.json();}const features=topojson.feature(mapTopology,mapTopology.objects.states).features;const feature=features.find(f=>String(f.id).padStart(2,'0')===state.id);const projection=d3.geoIdentity().reflectY(true).fitExtent([[18,14],[332,218]],feature);const path=d3.geoPath(projection);stage.innerHTML=`<svg viewBox="0 0 350 232" role="img" aria-label="Unlabeled state outline"><path d="${path(feature)}"></path></svg>`;}catch{stage.innerHTML=`<div class="feedback try">This state outline could not load. Try reopening the app.</div>`;}}
  function renderFinish(){const total=session.questions.length,correct=session.correct,pct=Math.round(correct/Math.max(1,total)*100);$("#sessionView").innerHTML=`${head("Round complete!",session.title,"home")}<div class="panel" style="text-align:center;padding:32px"><div style="font-size:3rem">${pct>=80?'🏆':pct>=60?'⭐':'🌱'}</div><h1 style="margin:10px 0">${correct} of ${total}</h1><p class="helper">${pct>=80?'Fantastic focus!':pct>=60?'Strong work—one more round will make it stick.':'Every practice round grows your brain.'}</p></div><div class="stack"><button class="primary" data-again>Practice again</button><button class="secondary" data-go="home">Back to quests</button></div>`;$('[data-again]').onclick=()=>{session.index=0;session.correct=0;session.questions=shuffle(session.questions);renderQuestion();};}

  function renderSettings(){
    $("#settingsView").innerHTML=`${head("Parent Setup","Update weekly practice without rebuilding the app")}
      <div class="panel" id="spellingSettings"><h2>Spelling word bank</h2><p class="helper">Enter one word per line or separate words with commas.</p><div class="field"><textarea id="wordBank">${esc(store.spelling.join("\n"))}</textarea></div><button class="primary" id="saveWords">Save word bank</button></div>
      <div class="panel" id="poemSettings"><h2>Poems</h2><div class="stack">${store.poems.map((p,i)=>`<div class="list-item"><span class="grow"><strong>${esc(p.title)}</strong><small>${esc(p.author||"")}</small></span><button class="tiny" data-edit-poem="${i}">Edit</button></div>`).join("")}</div><button class="secondary" style="margin-top:10px" id="addPoem">Add a poem</button><div id="poemEditor"></div></div>
      <div class="panel"><h2>Save protection</h2><p class="helper">Progress is saved on this device. Download a backup before deleting and re-adding the home-screen app.</p><div class="two"><button class="secondary" id="exportData">Download backup</button><button class="secondary" id="importData">Import backup</button></div><input type="file" id="importFile" accept="application/json" hidden></div>
      <div class="panel"><h2>Home-screen updates</h2><p class="helper">Keep the existing icon. Open this page online and tap “Check for update” to load the newest version without replacing saved progress.</p><button class="secondary" id="checkUpdate">Check for update</button></div>`;
    $("#saveWords").onclick=()=>{store.spelling=$("#wordBank").value.split(/[\n,]+/).map(w=>w.trim()).filter(Boolean);save();toast(`${store.spelling.length} spelling words saved`);};
    $("#addPoem").onclick=()=>renderPoemEditor();$$('[data-edit-poem]').forEach(b=>b.onclick=()=>renderPoemEditor(+b.dataset.editPoem));
    $("#exportData").onclick=exportData;$("#importData").onclick=()=>$("#importFile").click();$("#importFile").onchange=importData;
    $("#checkUpdate").onclick=async()=>{if(!('serviceWorker'in navigator)){toast('No update is waiting');return;}const reg=await navigator.serviceWorker.getRegistration();await reg?.update();toast('Update check complete');};
  }
  function renderPoemEditor(index){const poem=Number.isInteger(index)?store.poems[index]:{title:"",author:"",text:""};$("#poemEditor").innerHTML=`<div class="field"><label>Title</label><input id="poemTitle" value="${esc(poem.title)}"></div><div class="field"><label>Author</label><input id="poemAuthor" value="${esc(poem.author)}"></div><div class="field"><label>Poem text</label><textarea id="poemText">${esc(poem.text)}</textarea></div><div class="two"><button class="primary" id="savePoem">Save poem</button>${Number.isInteger(index)?'<button class="danger-btn" id="deletePoem">Delete</button>':''}</div>`;$("#poemTitle").focus();$("#savePoem").onclick=()=>{const title=$("#poemTitle").value.trim(),text=$("#poemText").value.trim();if(!title||!text){toast('Add a title and poem text');return;}const next={id:(poem.id||title.toLowerCase().replace(/[^a-z0-9]+/g,'-'))+(!Number.isInteger(index)?`-${Date.now()}`:''),title,author:$("#poemAuthor").value.trim(),text};if(Number.isInteger(index))store.poems[index]=next;else store.poems.push(next);save();renderSettings();toast('Poem saved');};if(Number.isInteger(index))$("#deletePoem").onclick=()=>{if(store.poems.length===1){toast('Keep at least one poem');return;}store.poems.splice(index,1);save();renderSettings();};}
  function exportData(){const blob=new Blob([JSON.stringify(store,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`asher-arcade-backup-${today()}.json`;a.click();URL.revokeObjectURL(a.href);}
  function importData(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result);store={...defaults,...parsed};save();renderSettings();toast('Backup restored');}catch{toast('That backup could not be read');}};reader.readAsText(file);}

  document.addEventListener("click", e => {const nav=e.target.closest("[data-go]");if(nav)go(nav.dataset.go);});
  window.addEventListener("hashchange",()=>go(location.hash.slice(1)||"home"));
  if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
  if (document.modelContext?.registerTool) {
    const register = tool => Promise.resolve(document.modelContext.registerTool(tool)).catch(() => {});
    register({name:"read_learning_sets",title:"Read learning sets",description:"Read the current spelling words and poem titles configured in Asher's Learning Arcade.",inputSchema:{type:"object",properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>({spellingWords:[...store.spelling],poems:store.poems.map(p=>({id:p.id,title:p.title,author:p.author}))})});
    register({name:"update_spelling_words",title:"Update spelling words",description:"Replace the weekly spelling word bank and update the visible app.",inputSchema:{type:"object",properties:{words:{type:"array",items:{type:"string",minLength:1},minItems:1}},required:["words"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:({words})=>{if(!Array.isArray(words)||!words.length)throw new Error("At least one word is required");store.spelling=[...new Set(words.map(w=>String(w).trim()).filter(Boolean))];save();if($("[data-screen='settings']").classList.contains("active"))renderSettings();return{saved:true,count:store.spelling.length};}});
    register({name:"add_practice_poem",title:"Add practice poem",description:"Add a poem to the memorization and recitation list.",inputSchema:{type:"object",properties:{title:{type:"string",minLength:1},author:{type:"string"},text:{type:"string",minLength:1}},required:["title","text"],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:({title,author="",text})=>{if(!String(title).trim()||!String(text).trim())throw new Error("Title and poem text are required");const poem={id:`poem-${Date.now()}`,title:String(title).trim(),author:String(author).trim(),text:String(text).trim()};store.poems.push(poem);save();if($("[data-screen='poems']").classList.contains("active"))renderPoems();return{saved:true,id:poem.id,title:poem.title};}});
  }
  renderHome();
})();

