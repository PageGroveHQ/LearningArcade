// Atlas Quest (USA): menu, question building and round start.
// Part of the Learning Arcade app. Files in app/ share one global scope and load in the order listed in index.html.
  function renderStates() {
    if(store.statePrefs.realm==="world")return AtlasQuest.menu(store,{head,save,renderStates,shuffle,startSession});
    const p = store.statePrefs || defaults.statePrefs;
    const regions = ["All 50","Northeast Region","Midwest Region","South Region","West Region","Custom selection"];
    const divisions = ["All 50","Custom selection"].includes(p.region) ? [] : [...new Set(STATE_DATA.filter(s=>s.region===p.region).map(s=>s.division))];
    if (p.division !== "All" && !divisions.includes(p.division)) p.division = "All";
    const selectedStates = activeStates(p.region,p.division,p.customStates);
    p.kinds=(Array.isArray(p.kinds)?p.kinds:[]).filter(kind=>["facts","map","placement","neighbors","regions","odd","discovery","triples","spelling"].includes(kind));if(!p.kinds.length)p.kinds=["facts"];
    const setSize = selectedStates.length;
    const maxCount = stateQuestionBank(selectedStates,p.kinds).length;
    if (p.count !== 'max' && +p.count > maxCount) { p.count = 'max'; store.statePrefs = p; save(); }
    $("#statesView").innerHTML = `${head("Atlas Quest","Connect every state, capital, abbreviation, and shape")}<div class="atlas-tabs"><button class="selected" data-realm="usa">USA · States</button><button data-realm="world">World · Countries</button></div>
      <div class="panel"><p class="label">Study set</p><details class="atlas-fold"><summary>Choose U.S. region<span>${esc(p.region)}</span></summary><div class="atlas-fold-body option-grid">${regions.map(r=>`<button class="choice ${p.region===r?'selected':''}" data-region-pick="${esc(r)}">${esc(r)}</button>`).join("")}</div></details><div class="field" hidden><label>Region</label><select id="stateRegion">${regions.map(r=>`<option ${p.region===r?'selected':''}>${r}</option>`).join("")}</select></div>${divisions.length?`<details class="atlas-fold"><summary>Choose division<span>${esc(p.division)}</span></summary><div class="atlas-fold-body option-grid">${["All",...divisions].map(d=>`<button class="choice ${p.division===d?'selected':''}" data-division-pick="${esc(d)}">${esc(d)}</button>`).join("")}</div></details>`:""}<div class="field" hidden><label>${p.region==='Custom selection'?'Selection':'Division'}</label><select id="stateDivision" ${p.region==='Custom selection'?'disabled':''}><option>${p.region==='Custom selection'?'Choose locations below':'All'}</option>${divisions.map(d=>`<option ${p.division===d?'selected':''}>${d}</option>`).join("")}</select></div><p class="helper">${setSize} location${setSize===1?'':'s'} in this study set${p.region==='South Region'?', including Washington, D.C.':'.'}</p></div>
      ${p.region==='Custom selection'?customStatePickerMarkup(p.customStates):''}
      <details class="atlas-fold state-mode-panel" open><summary>Question styles<span>Choose one or more</span></summary><div class="atlas-fold-body"><div class="panel-title-row"><div><p class="label">Question styles</p><h2>Choose one or more</h2></div><button class="tiny" id="stateMixedPreset">Recommended mix</button></div><div class="option-grid multi-style-grid">
        ${[["facts","Names & capitals"],["map","Map shapes"],["placement","Place on U.S. map"],["neighbors","Neighbor match"],["regions","Region sorting"],["odd","Which doesn't belong?"],["discovery","Flags & landmarks"],["triples","Three-way match"],["spelling","Spell state & capital"]].map(([value,label])=>`<button class="choice ${p.kinds.includes(value)?'selected':''}" data-state-kind="${value}" aria-pressed="${p.kinds.includes(value)}">${label}</button>`).join("")}
      </div><button class="secondary" id="startCapitalSpeed" style="margin-top:10px" ${setSize?'':'disabled'}>Start separate Capital Speed Run</button></div></details>
      <div class="panel"><p class="label">Round length</p><div class="option-grid" data-choice-group="count"><button class="choice ${p.count==='10'?'selected':''}" data-value="10">10 questions</button><button class="choice ${p.count==='25'?'selected':''}" data-value="25">25 questions</button><button class="choice ${p.count==='max'?'selected':''}" data-value="max">Max · ${maxCount}</button></div></div>
      <div class="panel"><p class="label">Who is holding the phone?</p>${modeButtons(p.mode)}</div>
      ${learnModePanel(p.learnMode)}
      ${challengePanel(p.challenge)}
      <button class="primary" id="startStates" ${setSize?'':'disabled'}>${setSize?`Start ${p.count==='max'?maxCount:Math.min(+p.count,maxCount)}-question quest`:'Choose at least one location'}</button>`;
    $("[data-realm=\"world\"]").onclick=()=>{store.statePrefs.realm="world";save();renderStates();};
    $("#stateRegion").onchange=e=>{const previous=activeStates(p.region,p.division,p.customStates);p.region=e.target.value;p.division="All";if(p.region==='Custom selection'&&!p.customStates.length)p.customStates=previous.map(state=>state.abbr);store.statePrefs=p;save();renderStates();};
    $$("[data-region-pick]").forEach(b=>b.onclick=()=>{const select=$("#stateRegion");select.value=b.dataset.regionPick;select.dispatchEvent(new Event("change"));});$$("[data-division-pick]").forEach(b=>b.onclick=()=>{const select=$("#stateDivision");select.value=b.dataset.divisionPick;select.dispatchEvent(new Event("change"));});
    $("#stateDivision").onchange=e=>{p.division=e.target.value;store.statePrefs=p;save();renderStates();};
    $$("[data-state-fold]").forEach(d=>d.ontoggle=()=>{p.openRegions=(p.openRegions||[]).filter(r=>r!==d.dataset.stateFold);if(d.open)p.openRegions.push(d.dataset.stateFold);save();});
    $("#customStatePicker")?.addEventListener("change",e=>{const input=e.target.closest("[data-state-abbr]");if(!input)return;p.activePresetId="";p.customStates=input.checked?[...new Set([...p.customStates,input.dataset.stateAbbr])]:p.customStates.filter(abbr=>abbr!==input.dataset.stateAbbr);store.statePrefs=p;save();renderStates();});
    $$('[data-state-preset]',$("#statesView")).forEach(button=>button.onclick=()=>{p.activePresetId="";if(button.dataset.statePreset==='clear')p.customStates=[];else if(button.dataset.statePreset==='all')p.customStates=STATE_DATA.map(state=>state.abbr);else p.customStates=[...new Set([...p.customStates,...STATE_DATA.filter(state=>state.region===button.dataset.statePreset).map(state=>state.abbr)])];store.statePrefs=p;save();renderStates();});
    $("#savedStateSet")?.addEventListener("change",e=>{const preset=store.statePresets.find(item=>item.id===e.target.value);if(!preset)return;p.activePresetId=preset.id;p.customStates=[...preset.states];store.statePrefs=p;save();renderStates();toast(`${preset.name} loaded`);});
    $("#saveStateSet")?.addEventListener("click",()=>{if(!p.customStates.length)return toast("Select at least one location first");const name=prompt("Name this Atlas Quest set");if(!name?.trim())return;const preset={id:`state-set-${Date.now()}`,name:name.trim(),states:[...p.customStates],archived:false};store.statePresets.push(preset);p.activePresetId=preset.id;store.statePrefs=p;save();renderStates();toast("State set saved");});
    $("#renameStateSet")?.addEventListener("click",()=>{const preset=store.statePresets.find(item=>item.id===p.activePresetId);if(!preset)return toast("Load a saved set first");const name=prompt("Rename this Atlas Quest set",preset.name);if(!name?.trim())return;preset.name=name.trim();save();renderStates();toast("State set renamed");});
    $("#archiveStateSet")?.addEventListener("click",()=>{const preset=store.statePresets.find(item=>item.id===p.activePresetId);if(!preset)return toast("Load a saved set first");preset.archived=true;p.activePresetId="";save();renderStates();toast("State set moved to Archives");});
    $("#deleteStateSet")?.addEventListener("click",()=>{const preset=store.statePresets.find(item=>item.id===p.activePresetId);if(!preset)return toast("Load a saved set first");if(!confirm(`Delete “${preset.name}”?`))return;store.statePresets=store.statePresets.filter(item=>item.id!==preset.id);p.activePresetId="";save();renderStates();toast("Saved state set deleted");});
    $$('[data-state-kind]',$('#statesView')).forEach(button=>button.onclick=()=>{const value=button.dataset.stateKind;p.kinds=p.kinds.includes(value)?p.kinds.filter(item=>item!==value):[...p.kinds,value];if(!p.kinds.length)p.kinds=[value];store.statePrefs=p;save();renderStates();});
    $("#stateMixedPreset").onclick=()=>{p.kinds=["facts","map","neighbors","regions","discovery"];store.statePrefs=p;save();renderStates();};
    $("#startCapitalSpeed").onclick=()=>startStates({...p,kinds:["capital-speed"],count:"max"});
    wireChoices($("#statesView"), (group, value) => { p[group] = value; store.statePrefs = p; save(); renderStates(); });
    $('[data-learn-toggle]',$('#statesView')).onchange=e=>{p.learnMode=e.target.checked;store.statePrefs=p;save();renderStates();};
    $('[data-challenge-toggle]',$('#statesView')).onchange=e=>{p.challenge=e.target.checked;store.statePrefs=p;save();};
    $("#startStates").onclick = () => startStates(p);
  }

  function customStatePickerMarkup(selected=[]) {
    const regions=["Northeast Region","Midwest Region","South Region","West Region"];
    const activePresets=store.statePresets.filter(preset=>!preset.archived);
    return `<div class="panel custom-state-panel"><div class="panel-title-row"><div><p class="label">Custom locations</p><h2>Choose only what is being taught</h2></div><span class="selection-count">${selected.length} selected</span></div><div class="saved-state-set"><select id="savedStateSet" aria-label="Saved Atlas Quest sets"><option value="">Load a saved set…</option>${activePresets.map(preset=>`<option value="${esc(preset.id)}" ${store.statePrefs.activePresetId===preset.id?'selected':''}>${esc(preset.name)} · ${preset.states.length}</option>`).join("")}</select><button class="tiny" id="saveStateSet">Save current</button>${activePresets.length?'<button class="tiny" id="renameStateSet">Rename</button><button class="tiny" id="archiveStateSet">Archive</button><button class="tiny danger-text" id="deleteStateSet">Delete</button>':''}</div><div class="custom-state-actions"><button class="tiny" data-state-preset="all">Select all</button><button class="tiny" data-state-preset="clear">Clear all</button></div><div id="customStatePicker" class="state-picker">${regions.map(region=>`<details class="atlas-fold state-region-group" data-state-fold="${esc(region)}" ${store.statePrefs.openRegions?.includes(region)?'open':''}><summary>${esc(region.replace(" Region",""))}<span>${STATE_DATA.filter(s=>s.region===region&&selected.includes(s.abbr)).length} selected</span></summary><button class="tiny" data-state-preset="${esc(region)}">Select region</button>${[...new Set(STATE_DATA.filter(state=>state.region===region).map(state=>state.division))].map(division=>`<div class="state-division-group"><span>${esc(division)}</span><div class="state-check-grid">${STATE_DATA.filter(state=>state.region===region&&state.division===division).map(state=>`<label class="state-check ${selected.includes(state.abbr)?'selected':''}"><input type="checkbox" data-state-abbr="${esc(state.abbr)}" ${selected.includes(state.abbr)?'checked':''}><b>${esc(state.abbr)}</b><small>${esc(state.name)}</small></label>`).join("")}</div></div>`).join("")}</details>`).join("")}</div></div>`;
  }

  function activeStates(region,division="All",customStates=[]) { if(region==="Custom selection")return STATE_DATA.filter(state=>customStates.includes(state.abbr));const regional=region === "All 50" ? STATE_DATA.filter(s=>!s.district) : STATE_DATA.filter(s => s.region === region); return division === "All" ? regional : regional.filter(s=>s.division===division); }
  function stateQuestion(state, kind, direction) {
    if (kind === "map") return {subject:"states", state, map:true, prompt:"Which state is this?", answer:`${state.name} · ${state.abbr} · ${state.capital}`, accepts:[state.name,state.abbr,state.capital], combined:true, detail:`${state.name} — ${state.abbr} — ${state.capital}`};
    if (kind === "triples") return {subject:"states", state, prompt:`Complete the set for ${state.name}`, answer:`${state.abbr} · ${state.capital}`, accepts:[state.abbr,state.capital], combined:true, detail:`${state.name} — ${state.abbr} — ${state.capital}`};
    if (kind === "spelling") { const field=direction==='capital'?'capital':'name',answer=state[field]; return {subject:"state-spelling",state,prompt:`Spell the ${direction==='capital'?'capital':'state name'} you hear`,answer,speech:answer,audio:stateRecordedAudio(state,field),detail:`${state.name} — ${state.capital}`}; }
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

  function stateNeighborQuestion(state,states=STATE_DATA){
    const neighbors=(STATE_NEIGHBORS[state.abbr]||[]).map(abbr=>states.find(item=>item.abbr===abbr)||STATE_DATA.find(item=>item.abbr===abbr)).filter(Boolean),names=neighbors.map(item=>item.name);
    if(!names.length)return null;
    const list=names.length===1?names[0]:names.length===2?`${names[0]} and ${names[1]}`:`${names.slice(0,-1).join(", ")}, and ${names.at(-1)}`;
    return {subject:"states",state,prompt:`Which state borders ${state.name}?`,answer:pick(names),accepted:names,answerType:"state",detail:`${state.name} borders ${list}.`,neighbor:true};
  }

  function stateQuestionBank(states,kind) {
    const kinds = Array.isArray(kind)?kind:(kind === 'mixed' ? ['facts','map','triples','spelling','neighbors','regions','discovery'] : [kind]);
    const questions=[];
    states.forEach(state=>kinds.forEach(k=>{
      if(k==='facts') ["state-capital","state-abbr","capital-state","abbr-state","capital-abbr","abbr-capital"].forEach(d=>questions.push(stateQuestion(state,k,d)));
      else if(k==='spelling') ['state','capital'].forEach(d=>questions.push(stateQuestion(state,k,d)));
      else if(k==='placement') questions.push({subject:"states",state,prompt:`Place ${state.name} on the map`,answer:state.name,detail:`${state.name} — ${state.abbr} — ${state.capital}`,placement:true,modeOverride:"map-place"});
      else if(k==='neighbors'){const question=stateNeighborQuestion(state,states);if(question)questions.push(question);}
      else if(k==='regions'){questions.push({subject:"states",state,prompt:`Which region contains ${state.name}?`,answer:state.region.replace(" Region",""),answerType:"region",detail:`${state.name} is in the ${state.region}.`,regionSort:true});questions.push({subject:"states",state,prompt:`Which division contains ${state.name}?`,answer:state.division.replace(" Division",""),answerType:"division",detail:`${state.name} is in the ${state.division}.`,regionSort:true});}
      else if(k==='capital-speed'){questions.push(stateQuestion(state,'facts',Math.random()>.5?'state-capital':'capital-state'));}
      else if(k==='discovery') questions.push({subject:"states",state,prompt:STATE_DISCOVERY[state.abbr],answer:state.name,answerType:"state",detail:`${STATE_DISCOVERY[state.abbr]} Answer: ${state.name}.`,discovery:true});
      else if(k==='map'||k==='triples') questions.push(stateQuestion(state,k));
    }));
    if(kinds.includes('odd')){
      const groups=[...new Set(states.map(state=>state.region))];
      groups.forEach(region=>{const same=states.filter(state=>state.region===region),other=states.filter(state=>state.region!==region);if(same.length>=3&&other.length){for(let index=0;index<Math.min(4,same.length);index++){const odd=other[index%other.length],set=shuffle([...shuffle(same).slice(0,3),odd]);questions.push({subject:"states",prompt:`Which state does not belong with the ${region.replace(" Region","")} group?`,answer:odd.name,answerType:"state",detail:`${odd.name} belongs to the ${odd.region}.`,oddStates:set,modeOverride:"choice"});}}});
    }
    questions.forEach(q=>q.pool=states);
    return questions;
  }

  function startStates(p) {
    const states = activeStates(p.region,p.division,p.customStates); if(!states.length)return toast("Choose at least one location"); const bank=shuffle(stateQuestionBank(states,p.kinds));if(!bank.length)return toast("These styles need a broader state selection"); const wanted=p.count==='max'?bank.length:Math.min(+p.count,bank.length); const questions=bank.slice(0,wanted),speed=p.kinds.length===1&&p.kinds[0]==='capital-speed';
    startSession(speed?"Capital Speed Run":"Atlas Quest", questions, p.mode,speed?1:0,{livesEnabled:p.challenge&&!p.learnMode,learnMode:!!p.learnMode});
  }
