// Math Mayhem: menu and fact generation.
// Part of the Learning Arcade app. Files in app/ share one global scope and load in the order listed in index.html.
  function renderMath() {
    const p = store.mathPrefs || defaults.mathPrefs;
    const dividing=p.sector==="divide",coreTables=Array.from({length:dividing?10:11},(_,i)=>i+(dividing?1:0));
    const program=dividing?"Division Drive":"Multiplication Reactor",symbol=dividing?"÷":"×",bank=mathQuestionBank(p),maxCount=bank.length;
    $("#mathView").innerHTML = `${head("Math Mayhem","Choose a number-training sector")}
      <div class="math-program-tabs"><button class="math-sector-choice ${p.sector==='multiply'?'selected':''}" data-math-sector="multiply"><b>×</b><span><strong>Multiplication Reactor</strong><small>Products, factors, and equal groups</small></span></button><button class="math-sector-choice ${p.sector==='divide'?'selected':''}" data-math-sector="divide"><b>÷</b><span><strong>Division Drive</strong><small>Quotients and connected fact families</small></span></button></div>
      <section class="math-sector active"><div><p class="eyebrow">ACTIVE PROGRAM</p><h2>${program}</h2><p>${p.sector==='divide'?'Use known multiplication facts to divide into equal groups.':'Build core fluency, then extend through the 15s.'}</p></div><span>${symbol}</span></section>
      <div class="panel"><div class="panel-title-row"><div><p class="label">Core fluency</p><h2>${dividing?'1s':'0s'} through 10s</h2></div><button class="choice core-table-toggle ${coreTables.every(n=>p.tables.includes(n))?'selected':''}" data-preset="core">${coreTables.every(n=>p.tables.includes(n))?'Core selected':'Select core'}</button></div><details><summary>Customize core tables</summary><div class="option-grid table-grid" id="coreTableGrid">${coreTables.map(n=>`<button class="choice ${p.tables.includes(n)?'selected':''}" data-table="${n}">${n}s</button>`).join("")}</div></details></div>
      <div class="panel"><div class="panel-title-row"><div><p class="label">Extended tables</p><h2>11s through 15s</h2></div><button class="tiny" data-preset="extended">Select all</button></div><div class="option-grid table-grid" id="extendedTableGrid">${[11,12,13,14,15].map(n=>`<button class="choice ${p.tables.includes(n)?'selected':''}" data-table="${n}">${n}s</button>`).join("")}</div></div>
      <div class="panel"><p class="label">Training mode</p><div class="option-grid" data-choice-group="divisionMode"><button class="choice ${p.divisionMode==='fluency'?'selected':''}" data-value="fluency">${p.sector==='divide'?'Quotient':'Product'} fluency</button><button class="choice ${p.divisionMode==='fact-family'?'selected':''}" data-value="fact-family">Fact families</button><button class="choice ${p.divisionMode==='factor'?'selected':''}" data-value="factor">Missing factor</button><button class="choice ${p.divisionMode==='groups'?'selected':''}" data-value="groups">Equal groups</button></div></div>
      <div class="panel"><p class="label">Practice mode</p>${modeButtons(p.mode)}</div>
      <div class="panel"><p class="label">Round length</p><div class="option-grid" data-choice-group="count"><button class="choice ${p.count==='10'?'selected':''}" data-value="10">10 questions</button><button class="choice ${p.count==='25'?'selected':''}" data-value="25">25 questions</button><button class="choice ${p.count==='max'?'selected':''}" data-value="max">Max · ${maxCount}</button></div></div>
      <div class="panel"><p class="label">Timer</p><div class="option-grid" data-choice-group="timer"><button class="choice ${p.timer==='0'?'selected':''}" data-value="0">No timer</button><button class="choice ${p.timer==='1'?'selected':''}" data-value="1">1 minute</button><button class="choice ${p.timer==='3'?'selected':''}" data-value="3">3 minutes</button><button class="choice ${p.timer==='5'?'selected':''}" data-value="5">5 minutes</button></div></div>
      ${learnModePanel(p.learnMode)}
      ${challengePanel(p.challenge)}
      <button class="primary" id="startMath" ${maxCount?'':'disabled'}>Start ${p.count==='max'?maxCount:Math.min(+p.count,maxCount)}-question ${program}</button>`;
    $$('[data-math-sector]',$('#mathView')).forEach(button=>button.onclick=()=>{p.sector=button.dataset.mathSector;store.mathPrefs=p;save();renderMath();});
    $$('.table-grid',$('#mathView')).forEach(grid=>grid.onclick=e=>{const b=e.target.closest("[data-table]");if(!b)return;const reopenCore=grid.id==="coreTableGrid"&&grid.closest("details")?.open,n=+b.dataset.table;p.tables=p.tables.includes(n)?p.tables.filter(x=>x!==n):[...p.tables,n].sort((a,b)=>a-b);if(!p.tables.length)p.tables=[n];store.mathPrefs=p;save();renderMath();if(reopenCore)$("#coreTableGrid")?.closest("details")?.setAttribute("open","");});
    $$('[data-preset]',$("#mathView")).forEach(b=>b.onclick=()=>{const values=b.dataset.preset==="core"?coreTables:[11,12,13,14,15];p.tables=[...new Set([...p.tables,...values])].sort((a,b)=>a-b);store.mathPrefs=p;save();renderMath();});
    wireChoices($("#mathView"),(group,value)=>{p[group]=value;store.mathPrefs=p;save();renderMath();});
    $('[data-learn-toggle]',$('#mathView')).onchange=e=>{p.learnMode=e.target.checked;store.mathPrefs=p;save();renderMath();};
    $('[data-challenge-toggle]',$('#mathView')).onchange=e=>{p.challenge=e.target.checked;store.mathPrefs=p;save();};
    $("#startMath").onclick=()=>{const questions=shuffle(mathQuestionBank(p)),wanted=p.count==='max'?questions.length:Math.min(+p.count,questions.length);startSession(program,questions.slice(0,wanted),p.mode,+p.timer,{livesEnabled:p.challenge&&!p.learnMode,learnMode:!!p.learnMode});};
  }

  function mathQuestionBank(p){
    const questions=[];
    p.tables.forEach(a=>Array.from({length:11},(_,b)=>b).forEach(b=>{
      const product=a*b,mode=p.divisionMode||"fluency";
      if(p.sector==="divide"){
        if(a===0)return;
        if(mode==="factor"&&b===0)return;
        if(mode==="fact-family")questions.push({subject:"math",operation:"divide",prompt:`${a} × ${b} = ${product}.  ${product} ÷ ${a} = ?`,answer:String(b),detail:`Fact family: ${a} × ${b} = ${product}, ${product} ÷ ${a} = ${b}.`,a,b,product});
        else if(mode==="factor")questions.push({subject:"math",operation:"divide",prompt:`${product} ÷ ? = ${b}`,answer:String(a),detail:`The missing divisor is ${a}, because ${a} × ${b} = ${product}.`,a,b,product});
        else if(mode==="groups")questions.push({subject:"math",operation:"divide",prompt:`${product} Energy Orbs are shared equally among ${a} stations. How many does each station receive?`,answer:String(b),detail:`${product} ÷ ${a} = ${b}.`,a,b,product});
        else questions.push({subject:"math",operation:"divide",prompt:`${product} ÷ ${a}`,answer:String(b),detail:`${product} ÷ ${a} = ${b}, because ${a} × ${b} = ${product}.`,a,b,product});
      }else{
        if(mode==="fact-family")questions.push({subject:"math",operation:"multiply",prompt:`Fact family: ${a} × ${b} = ?`,answer:String(product),detail:`${a} × ${b} = ${product}; ${b} × ${a} = ${product}; ${product} ÷ ${Math.max(1,a)} = ${a?b:0}.`,a,b,product});
        else if(mode==="factor")questions.push({subject:"math",operation:"multiply",prompt:`${a} × ? = ${product}`,answer:String(b),detail:`The missing factor is ${b}: ${a} × ${b} = ${product}.`,a,b,product});
        else if(mode==="groups")questions.push({subject:"math",operation:"multiply",prompt:`${a} groups of ${b} Energy Orbs make how many altogether?`,answer:String(product),detail:`${a} groups of ${b}: ${a} × ${b} = ${product}.`,a,b,product});
        else questions.push({subject:"math",operation:"multiply",prompt:`${a} × ${b}`,answer:String(product),detail:`${a} × ${b} = ${product}`,a,b,product});
      }
    }));
    return questions;
  }
