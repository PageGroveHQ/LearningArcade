// Poem Power: menu and practice modes.
// Part of the Learning Arcade app. Files in app/ share one global scope and load in the order listed in index.html.
  function activePoem(){return store.poems.find(poem=>poem.id===store.activePoemId&&!poem.archived)||store.poems.find(poem=>!poem.archived)||store.poems[0];}

  function renderPoems() {
    const poem = activePoem(),poems=store.poems.filter(item=>!item.archived);
    $("#poemsView").innerHTML = `${head("Poem Power","Learn a poem a little at a time")}
      <div class="panel poem-selector"><p class="label">Choose a poem</p><div class="field"><select id="poemSelect">${poems.map(item=>`<option value="${esc(item.id)}" ${item.id===poem.id?'selected':''}>${esc(item.title)}</option>`).join("")}</select></div><article class="featured-poem" id="featuredPoem"><span>❝</span><div><h2>${esc(poem.title)}</h2><p>${esc(poem.author||"Author not listed")}</p><small>${poem.text.split(/\n/).filter(line=>line.trim()).length} lines</small></div></article><button class="secondary" style="margin-top:10px" data-go="settings" data-focus="poems">Add or edit poems</button></div>
      ${voicePanelMarkup()}
      ${learnModePanel(store.challengePrefs.poemLearnMode)}
      ${challengePanel(store.challengePrefs.poems)}
      <div class="panel" id="poemModes">${poemModeMarkup(poem)}</div>`;
    $("#poemSelect").onchange=e=>{store.activePoemId=e.target.value;save();renderPoems();};
    wirePoemModes(poem);
    wireVoicePanel($("#poemsView"));
    $('[data-learn-toggle]',$('#poemsView')).onchange=e=>{store.challengePrefs.poemLearnMode=e.target.checked;save();renderPoems();};
    $('[data-challenge-toggle]',$('#poemsView')).onchange=e=>{store.challengePrefs.poems=e.target.checked;save();};
  }

  function poemModeMarkup(poem){return `<p class="label">Practice ${esc(poem.title)}</p><div class="stack">
    <button class="choice" data-poem-mode="read">Read it aloud</button><button class="choice" data-poem-mode="missing">Missing words</button><button class="choice" data-poem-mode="lines">Next-line prompts</button><button class="choice" data-poem-mode="recite">Recite from memory</button></div>`;}
  function wirePoemModes(poem){$$('[data-poem-mode]',$("#poemModes")).forEach(b=>b.onclick=()=>startPoem(poem,b.dataset.poemMode));}
  function startPoem(poem,mode){
    const lines=poem.text.split("\n").filter(x=>x.trim());
    if(mode==="read"){startSession("Poem Power",[{subject:"poem-read",prompt:poem.title,answer:poem.text,detail:poem.author,speech:poem.text,audio:poem.audio||"",poemId:poem.id}],"read",0,{silentMusic:true});return;}
    if(mode==="recite"){startSession("Poem Power",[{subject:"poem-recite",prompt:`Recite “${poem.title}” from memory`,answer:poem.text,detail:poem.author}],"parent");return;}
    if(mode==="lines"){const qs=lines.slice(0,-1).map((line,i)=>({subject:"poem-line",poemId:poem.id,prompt:line,answer:lines[i+1],detail:`Next line: ${lines[i+1]}`}));startSession(`Next-Line Prompts — ${poem.title}`,shuffle(qs).slice(0,8),"type",0,{livesEnabled:store.challengePrefs.poems&&!store.challengePrefs.poemLearnMode,learnMode:store.challengePrefs.poemLearnMode});return;}
    const candidates=lines.map(line=>({line,words:(line.match(/[A-Za-z’']+/g)||[]).filter(w=>w.length>3)})).filter(x=>x.words.length);const qs=shuffle(candidates).slice(0,Math.min(8,candidates.length)).map(({line,words})=>{const word=pick(words);return {subject:"poem-missing",poemId:poem.id,prompt:line.replace(new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i'),"_____"),answer:word,detail:`The missing word was “${word}.”`};});startSession(`Missing Words — ${poem.title}`,qs,"type",0,{livesEnabled:store.challengePrefs.poems&&!store.challengePrefs.poemLearnMode,learnMode:store.challengePrefs.poemLearnMode});
  }
