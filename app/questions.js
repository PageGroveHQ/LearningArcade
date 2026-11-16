// Question rendering and answer choices for every practice mode.
// Part of the Learning Arcade app. Files in app/ share one global scope and load in the order listed in index.html.
  function renderQuestionBody(q){
    const body=$("#questionBody");const mode=session.currentMode;
    const guide=`<div class="question-guide"><img src="assets/characters/professor-volt.png" alt=""><span>Professor Volt asks:</span></div>`;
    if(q.subject==="poem-read") {body.innerHTML=`${guide}<h2>${esc(q.prompt)}</h2><p class="helper">${esc(q.detail)}</p><button class="secondary" style="margin-bottom:16px" data-play-poem>🔊 Play poem audio</button><div class="poem-text">${esc(q.answer)}</div><button class="primary" style="margin-top:18px" data-self-done>I read it aloud</button>`;$('[data-play-poem]').onclick=()=>playPracticeAudio(q.speech,q.audio,q.poemId);$('[data-self-done]').onclick=()=>grade(true);return;}
    const speech=q.speech&&mode!=="assembly"?`<button class="subject-icon" id="speakWord" aria-label="Hear the word" style="border:0;color:#5e4bd0">🔊</button>`:"";
    if(mode==="map-place"){body.innerHTML=`${guide}<h2>${esc(q.prompt)}</h2><div class="state-drag-chip" draggable="true">${esc(q.state.name)}</div><div class="us-placement-map" id="placementMap"><span class="helper">Loading U.S. map…</span></div><div id="interaction"></div>`;renderStatePlacement(q);return;}
    body.innerHTML=`${guide}${q.map?`<div class="map-stage" id="mapStage"><span class="helper">Loading state shape…</span></div>`:""}${speech}<h2 class="${q.subject?.startsWith('poem')?'poem-text':''}">${esc(q.prompt)}</h2>${q.translation?`<div class="spelling-translation"><span>${q.challengeWord?'CHALLENGE WORD · ':''}ENGLISH MEANING</span><strong>${esc(q.translation)}</strong></div>`:""}${StudyRich.render(q.diagram)}<div id="interaction"></div>`;
    if(q.map){if(q.country)AtlasQuest.shape(q.country);else renderStateMap(q.state);}
    if(q.speech&&mode!=="assembly"){const speak=()=>playPracticeAudio(q.speech,q.audio,"",q.language||"");$("#speakWord").onclick=speak;setTimeout(()=>{if(session&&!session.paused)speak();},1200);}
    if(mode==="assembly")renderAssembly(q);else if(mode==="accent")renderAccentLab(q);else if(mode==="parent") renderParent(q); else if(q.response&&(mode!=="choice"||q.response.fields.length>1)) renderRichTyped(q); else if(mode==="choice") renderMultipleChoice(q); else renderTyped(q);
    if(q.language?.startsWith("es")&&mode==="type")wireSpanishAccents();
  }

  function renderParent(q){
    const it=$("#interaction");it.innerHTML=`<button class="secondary" id="revealAnswer">Reveal answer</button><div id="revealed" hidden><div class="feedback good">${q.subject==="poem-recite"?`<div class="poem-text">${esc(q.answer)}</div>`:esc(q.detail||q.answer)}</div><div class="grade-row"><button class="grade wrong" data-grade="false">← Keep practicing</button><button class="grade right" data-grade="true">Got it →</button></div><div class="swipe-hint"><span>Swipe left</span><span>Swipe right</span></div></div>`;
    $("#revealAnswer").onclick=()=>{$("#revealAnswer").hidden=true;$("#revealed").hidden=false;};
    $$('[data-grade]').forEach(b=>b.onclick=()=>grade(b.dataset.grade==="true"));wireSwipe();
  }

  function renderAssembly(q){
    const it=$("#interaction"),wordState=WordGames.assemblyState(q.answer,q.assemblyGuesses||[]);session.assemblyMisses??=session.questions.reduce((n,item)=>n+WordGames.assemblyState(item.answer,item.assemblyGuesses||[]).misses,0);const state={...wordState,misses:Math.min(6,session.assemblyMisses),remaining:Math.max(0,6-session.assemblyMisses),lost:session.assemblyMisses>=6},parts=[['head','Head'],['torso','Torso'],['right-arm','Right arm'],['left-arm','Left arm'],['right-leg','Right leg'],['left-leg','Left leg']],rows=['qwertyuiop','asdfghjkl','zxcvbnm',...(q.language?.startsWith('es')?['ñáéíóúü']:[])];
    $("#flashCard").classList.add('word-game-card');
it.innerHTML=`${q.language?.startsWith('es')?'':`<div class="assembly-clue"><small>DEFINITION</small><strong>${esc(q.clue||'Ask a grown-up to add this word’s meaning.')}</strong></div>`}<div class="assembly-belt" aria-label="${state.misses} of six parts filled">${parts.map(([id,label],index)=>`<div class="assembly-part ${index<state.misses?'filled':''}"><svg class="sentinel-part-art" viewBox="${[[0,30,390,660],[390,30,385,660],[775,30,320,660],[1100,30,310,660],[1410,30,380,660],[1790,30,382,660]][index].join(' ')}" role="img" aria-label="${index<state.misses?'Filled':'Outline'} ${label}"><defs><clipPath id="assembly-crop-${index}" clipPathUnits="userSpaceOnUse"><rect x="${[0,390,775,1100,1410,1790][index]}" y="30" width="${[390,385,320,310,380,382][index]}" height="660"/></clipPath></defs><image href="assets/word-games/sentinel-parts-v2.png" width="2172" height="724" clip-path="url(#assembly-crop-${index})"/></svg><small>${label}</small></div>`).join('')}</div><p class="assembly-status" role="status">${state.remaining} letter mistakes remaining in this round</p><div class="word-slots" aria-label="${[...q.answer].length} letter positions">${[...q.answer.normalize('NFC')].map(letter=>`<span class="word-slot">${!WordGames.isLetter(letter)||state.chosen.includes(WordGames.normalize(letter))?esc(letter):'<span class="sr-only">Blank</span>'}</span>`).join('')}</div><div class="word-keyboard" aria-label="Letter keyboard">${rows.map(row=>`<div class="word-key-row">${[...row].map(letter=>{const used=state.chosen.includes(letter),correct=WordGames.normalize(q.answer).includes(letter);return `<button class="word-key ${used?(correct?'used-correct':'used-wrong'):''}" data-guess="${letter}" aria-label="Guess ${letter.toUpperCase()}" ${used||state.won||state.lost?'disabled':''}>${letter.toUpperCase()}</button>`;}).join('')}</div>`).join('')}</div><div class="word-game-actions"><button class="secondary" id="assemblyHint" ${state.won||state.lost?'disabled':''}>Hint: Hear the word</button></div>${q.hintUsed?'<p class="assembly-hint-used">Audio hint used · no life cost</p>':''}<div id="feedback"></div>`;
    $$('[data-guess]').forEach(button=>button.onclick=()=>{if(session.locked)return;const letter=button.dataset.guess;if(state.chosen.includes(letter))return;q.assemblyGuesses=[...state.chosen,letter];if(!WordGames.normalize(q.answer).includes(letter))session.assemblyMisses++;persistSessionProgress();renderAssembly(q);});
    $("#assemblyHint").onclick=()=>{if(session.locked)return;q.hintUsed=true;playPracticeAudio(q.answer,q.audio,"",q.language||"");persistSessionProgress();const button=$("#assemblyHint");button.textContent='Hint: Hear the word again';};
    if(state.won||state.lost)finishAnswer(state.won,q);
  }

  function renderAccentLab(q){
    const it=$("#interaction"),word=q.accentDraft||WordGames.unmarked(q.answer);$("#flashCard").classList.add('word-game-card');
    it.innerHTML=`<p class="helper">Tap a vowel to cycle its accent, or N to change it to Ñ. Leave letters plain when no mark is needed.</p><div class="accent-tiles" aria-label="Choose Spanish letter marks">${[...word].map((letter,index)=>`<button class="accent-tile ${WordGames.unmarked(letter)!==letter?'marked':''}" data-accent-index="${index}" aria-label="Letter ${index+1}: ${letter}" ${WordGames.marks[WordGames.unmarked(letter)]?'':'disabled'}>${esc(letter)}</button>`).join('')}</div><div class="word-game-actions"><button class="secondary" id="resetAccentMarks">Clear marks</button><button class="primary" id="checkAccentMarks">Check marks</button></div><div id="feedback"></div>`;
    $$('[data-accent-index]').forEach(button=>button.onclick=()=>{if(session.locked)return;q.accentDraft=WordGames.cycleMark(word,+button.dataset.accentIndex);persistSessionProgress();renderAccentLab(q);});
    $("#resetAccentMarks").onclick=()=>{if(session.locked)return;q.accentDraft=WordGames.unmarked(q.answer);persistSessionProgress();renderAccentLab(q);};
    $("#checkAccentMarks").onclick=()=>{if(session.locked)return;q.detail=`${q.answer}${q.translation?` — ${q.translation}`:''}. ${WordGames.markExplanation(q.answer)}`;finishAnswer(WordGames.normalize(word)===WordGames.normalize(q.answer),q);};
  }

  function mathAnswerOptions(q) {
    const n=Number(q.answer);
    const candidates=[n+q.a,n+q.b,n-q.a,n-q.b,n+1,n-1,n+2,n-2,q.a+q.b,Math.abs(q.a-q.b),q.a,q.b];
    const distractors=[...new Set(candidates.filter(value=>Number.isInteger(value)&&value>=0&&value!==n))];
    for(let step=1;distractors.length<3;step++) [n+step,n-step].forEach(value=>{if(value>=0&&value!==n&&!distractors.includes(value))distractors.push(value);});
    return shuffle([n,...shuffle(distractors).slice(0,3)]).map(String);
  }

  function spellingAnswerOptions(q) {
    const answer=String(q.answer||"").trim(),letters="abcdefghijklmnopqrstuvwxyz";
    if(!answer)return [];
    const variants=[
      answer.slice(0,-1)+(answer.endsWith("e")?"a":"e"),
      answer.replace(/([aeiou])/i,"$1$1"),
      answer.length>4?answer.slice(0,2)+answer.slice(3):answer+"e",
      answer+"e",
      answer.slice(0,-1),
      answer.slice(0,-1)+letters[(letters.indexOf(answer.slice(-1).toLowerCase())+1)%26]
    ];
    const seen=new Set([norm(answer)]),distractors=[];
    const add=candidate=>{candidate=String(candidate||"").trim();const key=norm(candidate);if(!candidate||!key||seen.has(key))return;seen.add(key);distractors.push(candidate);};
    variants.forEach(add);
    for(let index=0;distractors.length<3;index++)add(`${answer}${letters[index%letters.length]}${index>=letters.length?Math.floor(index/letters.length):""}`);
    return shuffle([answer,...shuffle(distractors).slice(0,3)]);
  }

  function stateAnswerOptions(q){
    if(q.oddStates?.length)return shuffle(q.oddStates.map(state=>state.name));
    if(q.combined){const pool=[...new Map([q.state,...shuffle(q.pool||[]),...shuffle(STATE_DATA)].filter(Boolean).map(state=>[state.abbr,state])).values()].slice(0,4);return shuffle(pool).map(state=>q.map?`${state.name} · ${state.abbr} · ${state.capital}`:`${state.abbr} · ${state.capital}`);}
    if(q.answerType==="region")return shuffle([q.answer,...["Northeast","Midwest","South","West"].filter(value=>value!==q.answer).slice(0,3)]);
    if(q.answerType==="division"){const divisions=[...new Set(STATE_DATA.map(state=>state.division.replace(" Division","")))];return shuffle([q.answer,...shuffle(divisions.filter(value=>value!==q.answer)).slice(0,3)]);}
    const prop=q.answerType==="state"?"name":q.answerType==="capital"?"capital":"abbr",choices=[q.answer,...shuffle(q.pool||[]).map(state=>state[prop]),...shuffle(STATE_DATA).map(state=>state[prop])],unique=[...new Set(choices)];
    return shuffle(unique.slice(0,4));
  }

  function answerOptions(q){
    if(q.country)return AtlasQuest.options(q);
    if(q.subject==="math") return mathAnswerOptions(q);
    if(q.subject==="spelling"||q.subject==="state-spelling")return spellingAnswerOptions(q);
    if(q.subject==="states")return stateAnswerOptions(q);
    if(q.subject==="study"){const poolAnswers=(q.pool||[]).map(item=>item.answer).filter(Boolean),fallback=["Not stated in the study guide","None of these","Unable to determine","All of these","Another answer"],choices=[q.answer,...(q.distractors||[]),...shuffle(poolAnswers.filter(answer=>norm(answer)!==norm(q.answer))),...fallback],unique=[...new Map(choices.map(value=>[norm(value),value])).values()];return shuffle(unique.slice(0,4));}
    return [q.answer];
  }
  function renderMultipleChoice(q){const it=$("#interaction"),accepted=[q.answer,...(q.accepted||[])].map(norm),opts=answerOptions(q);it.innerHTML=`<div class="answers">${opts.map(o=>`<button class="answer" data-answer="${esc(o)}">${esc(o)}</button>`).join("")}</div><div id="feedback"></div>`;$$('[data-answer]').forEach(b=>b.onclick=()=>{if(session.locked)return;const ok=accepted.includes(norm(b.dataset.answer));b.classList.add(ok?'correct':'wrong');finishAnswer(ok,q);});}
  function renderRichTyped(q){const it=$("#interaction");it.innerHTML=`<form id="richAnswerForm" class="stack">${q.response.fields.length>1?'<p class="helper rich-choice-note">Answer each part. Every part must be correct to complete this question.</p>':''}<div class="rich-answer-fields">${q.response.fields.map((field,index)=>`<label>${esc(field.label)}<input class="answer-input" data-rich-part="${index}" aria-label="${esc(field.label)}" inputmode="${field.type==='number'?'decimal':'text'}" value="${esc(q.draft?.[index]||'')}" autocomplete="off"></label>`).join('')}</div><button class="primary">Check answer</button></form><div id="feedback"></div>`;const inputs=$$('[data-rich-part]');inputs.forEach(input=>input.oninput=()=>{q.draft=inputs.map(field=>field.value);persistSessionProgress();});$("#richAnswerForm").onsubmit=e=>{e.preventDefault();if(session.locked)return;const values=inputs.map(input=>input.value);if(values.some(value=>!value.trim()))return toast("Answer every part before checking");finishAnswer(StudyRich.grade(q.response,values),q);};}
  // Place names may be typed as "St. Paul" or "Saint Paul".
  function typedKey(value,q){const key=norm(value);return q.subject==="states"?key.replace(/\bst\b/g,"saint"):key;}
  function renderTyped(q){const it=$("#interaction");if(q.combined){const labels=q.map?["State","Abbreviation","Capital"]:["Abbreviation","Capital"];it.innerHTML=`<div class="stack">${labels.map((l,i)=>`<input class="answer-input" data-part="${i}" aria-label="${l}" placeholder="${l}" autocapitalize="words">`).join("")}<button class="primary" data-check>Check answer</button></div><div id="feedback"></div>`;$('[data-check]').onclick=()=>{const vals=$$('[data-part]').map(x=>x.value);const expected=q.map?[q.state.name,q.state.abbr,q.state.capital]:[q.state.abbr,q.state.capital];finishAnswer(vals.every((v,i)=>typedKey(v,q)===typedKey(expected[i],q)),q);};}
    else{it.innerHTML=`<form id="answerForm" class="stack"><input class="answer-input" id="typedAnswer" aria-label="Your answer" placeholder="Type your answer" autocomplete="off" autocapitalize="words"><button class="primary">Check answer</button></form><div id="feedback"></div>`;$("#answerForm").onsubmit=e=>{e.preventDefault();const response=typedKey($("#typedAnswer").value,q),accepted=[q.answer,...(q.accepted||[])].map(value=>typedKey(value,q));finishAnswer(accepted.includes(response),q);};setTimeout(()=>$("#typedAnswer")?.focus(),80);}}
