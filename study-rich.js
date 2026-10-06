(function(root){
  'use strict';
  const FORMAT='learning-arcade-study-set',VERSION=1,MAX_BYTES=250000;
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function fail(message){throw new Error(message);}
  function text(value,label,max=2000){if(typeof value!=='string'||!value.trim()||value.length>max)fail(`${label} must be nonempty text (up to ${max} characters).`);return value.trim();}
  function list(value,label,max=20){if(!Array.isArray(value)||!value.length||value.length>max)fail(`${label} needs 1–${max} entries.`);return value;}
  function optionalAnswers(value,label,max=30){if(value===undefined)return [];if(!Array.isArray(value)||value.length>max)fail(`${label} must be a list of up to ${max} answers.`);return value.map(v=>text(String(v),label,1000));}
  function cell(value){if(typeof value==='number'&&Number.isFinite(value))return value;if(typeof value==='string'&&value.length<=120)return value;fail('Diagram labels must be text or finite numbers.');}
  function diagram(value){
    if(!value||typeof value!=='object'||Array.isArray(value))fail('Invalid diagram.');
    const type=value.type,caption=value.caption===undefined||value.caption===''?'':text(value.caption,'Diagram caption',1000);
    let out={type,caption};
    if(type==='table')out.rows=list(value.rows,'Table rows',15).map(row=>list(row,'Table columns',8).map(cell));
    else if(type==='equation'||type==='vertical')out.lines=list(value.lines,'Equation lines',8).map(v=>text(v,'Equation line',150));
    else if(type==='pyramid')out.rows=list(value.rows,'Pyramid rows',5).map(row=>list(row,'Pyramid bricks',6).map(cell));
    else if(type==='number-bonds')out.groups=list(value.groups,'Number patterns',4).map(row=>{if(list(row,'Number pattern',3).length!==3)fail('Each number pattern needs two parts and one whole.');return row.map(cell);});
    else if(type==='part-whole'){out.total=cell(value.total);out.parts=list(value.parts,'Bar parts',8).map(part=>{const width=part.width===undefined?1:part.width;if(!Number.isFinite(width)||width<=0||width>10000)fail('Bar widths must be positive numbers.');return {label:cell(part.label),width};});}
    else if(type==='comparison'){out.total=cell(value.total);out.longLabel=cell(value.longLabel);out.shortLabel=cell(value.shortLabel);out.difference=cell(value.difference);out.shortRatio=value.shortRatio??.65;if(!Number.isFinite(out.shortRatio)||out.shortRatio<.1||out.shortRatio>.9)fail('Comparison ratio must be between 0.1 and 0.9.');}
    else if(type==='segment-bars')out.rows=list(value.rows,'Segment bars',5).map(row=>({segments:list(row.segments,'Segments',8).map(v=>{if(!['light','dark'].includes(v))fail('Segments must be light or dark.');return v;}),label:cell(row.label)}));
    else if(type==='bar-chart'){out.title=text(value.title,'Chart title',120);out.axisLabel=text(value.axisLabel,'Chart axis label',120);out.step=value.step;if(!Number.isFinite(out.step)||out.step<=0)fail('Chart step must be positive.');out.bars=list(value.bars,'Chart bars',8).map(bar=>{if(!Number.isFinite(bar.value)||bar.value<0||bar.value>10000)fail('Chart values must be nonnegative numbers up to 10,000.');return {label:text(bar.label,'Bar label',40),value:bar.value};});if(Math.ceil(Math.max(...out.bars.map(b=>b.value),1)/out.step)>20)fail('Chart must use at most 20 scale intervals.');}
    else fail(`Unsupported diagram type: ${String(type).slice(0,40)}`);
    if(type==='table'&&out.rows.some(row=>row.length!==out.rows[0].length))fail('All table rows must have the same number of columns.');
    return out;
  }
  function validate(raw){
    if(!raw||raw.format!==FORMAT||raw.version!==VERSION)fail('Use a Learning Arcade study-set JSON file, version 1.');
    if(JSON.stringify(raw).length>MAX_BYTES)fail('This practice set is too large. Split it into smaller sets.');
    const title=text(raw.title,'Set title',120),subject=text(raw.subject||'General','Subject',80),testDate=raw.testDate||'';
    if(testDate&&(!/^\d{4}-\d{2}-\d{2}$/.test(testDate)||Number.isNaN(Date.parse(testDate))||new Date(testDate).toISOString().slice(0,10)!==testDate))fail('Test date must be a real YYYY-MM-DD date.');
    const questions=list(raw.questions,'Questions',100).map((q,index)=>{
      const prefix=`Question ${index+1}`,question=text(q.question,prefix,3000),answer=text(String(q.answer??''),`${prefix} answer`,1000);
      const out={question,answer,accepted:optionalAnswers(q.accepted,'Alternate answers'),explanation:q.explanation?text(q.explanation,'Explanation',4000):'',distractors:optionalAnswers(q.distractors,'Distractors',10)};
      if(out.accepted.length>30||out.distractors.length>10)fail('Too many alternate answers or distractors.');
      if(q.diagram)out.diagram=diagram(q.diagram);
      if(q.response){out.response={fields:list(q.response.fields,'Answer fields',8).map(field=>({label:text(field.label,'Answer label',80),answer:text(String(field.answer??''),'Field answer',500),type:field.type==='number'?'number':'text',accepted:optionalAnswers(field.accepted,'Field alternate answers')})),alternatives:[]};if(q.response.alternatives!==undefined){if(!Array.isArray(q.response.alternatives)||q.response.alternatives.length>30)fail('Use at most 30 answer arrangements.');out.response.alternatives=q.response.alternatives.map(row=>{if(!Array.isArray(row)||row.length!==out.response.fields.length)fail('An alternate arrangement must answer every field.');return row.map(v=>text(String(v),'Alternate field answer',500));});}}
      if(out.response){
        const fields=out.response.fields;
        fields.forEach((field,index)=>{if(!same(field.answer,field.answer,field.type))fail(`${prefix}: ${field.label} needs a valid numeric answer.`);[...field.accepted,...out.response.alternatives.map(row=>row[index])].forEach(answer=>{if(!same(answer,answer,field.type))fail(`${prefix}: invalid alternate answer for ${field.label}.`);});});
        if(fields.length===1){
          if(!same(out.answer,fields[0].answer,fields[0].type))fail(`${prefix}: the answer and answer field must agree.`);
          fields[0].accepted=[...new Set([...fields[0].accepted,...out.accepted])];
          out.accepted=[...new Set([...out.accepted,...fields[0].accepted,...out.response.alternatives.map(row=>row[0])])];
          out.distractors=out.distractors.filter(value=>!grade(out.response,[value]));
        }else out.answer=fields.map(field=>`${field.label}: ${field.answer}`).join(' · ');
      }
      return out;
    });return {format:FORMAT,version:VERSION,title,subject,testDate,questions};
  }
  function same(a,b,type){if(type==='number'){const clean=v=>String(v).trim().replace(/,/g,'');const x=clean(a),y=clean(b);return /^-?\d+(?:\.\d+)?$/.test(x)&&/^-?\d+(?:\.\d+)?$/.test(y)&&Number(x)===Number(y);}return String(a).trim().toLowerCase().replace(/\s+/g,' ')===String(b).trim().toLowerCase().replace(/\s+/g,' ');}
  function grade(response,values){if(!response||values.length!==response.fields.length)return false;const normal=response.fields.every((f,i)=>[f.answer,...f.accepted].some(answer=>same(values[i],answer,f.type)));return normal||(response.alternatives||[]).some(row=>row.every((answer,i)=>same(values[i],answer,response.fields[i].type)));}
  const format=v=>typeof v==='number'?v.toLocaleString('en-US'):v;
  const label=(x,y,v)=>`<text x="${x}" y="${y}" text-anchor="middle">${escape(format(v))}</text>`;
  const box=(x,y,w,h,fill='#eef4f8')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="#2f4658" stroke-width="2"/>`;
  function svg(body,h,alt){return `<svg viewBox="0 0 650 ${h}" role="img" aria-label="${escape(alt)}"><title>${escape(alt)}</title>${body}</svg>`;}
  function render(input){
    if(!input)return '';let d;try{d=diagram(input);}catch{return '<p class="helper">This diagram could not be displayed. Export and check the study set.</p>';}
    let body='',alt=d.caption;
    if(d.type==='table')body=`<table><thead><tr>${d.rows[0].map(v=>`<th scope="col">${escape(format(v))}</th>`).join('')}</tr></thead><tbody>${d.rows.slice(1).map(row=>`<tr>${row.map(v=>`<td>${escape(format(v))}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    else if(d.type==='equation'||d.type==='vertical')body=`<div class="rich-${d.type}">${d.lines.map(v=>`<div>${escape(v)}</div>`).join('')}</div>`;
    else if(d.type==='pyramid')body=`<div class="rich-pyramid">${d.rows.map(row=>`<div>${row.map(v=>`<span>${escape(format(v))}</span>`).join('')}</div>`).join('')}</div>`;
    else if(d.type==='number-bonds'){let b='';d.groups.forEach((r,i)=>{let x=(i%2)*325+10,y=Math.floor(i/2)*185+10;const hex=(cx,cy,v)=>`<polygon points="${cx},${cy+25} ${cx+25},${cy} ${cx+120},${cy} ${cx+145},${cy+25} ${cx+120},${cy+70} ${cx+25},${cy+70}" fill="#eef4f8" stroke="#2f4658" stroke-width="2"/>`+label(cx+72,cy+43,v);b+=hex(x,y,r[0])+hex(x+145,y,r[1])+hex(x+72,y+70,r[2]);});body=svg(b,Math.ceil(d.groups.length/2)*185,alt||d.groups.map(r=>`${r[0]} and ${r[1]} give ${r[2]}`).join('. '));}
    else if(d.type==='part-whole'){let x=40,b=label(325,32,`Whole: ${format(d.total)}`),sum=d.parts.reduce((s,p)=>s+p.width,0);d.parts.forEach((p,i)=>{let w=570*p.width/sum;b+=box(x,65,w,48,i%2?'#b9cedc':'#eef4f8')+label(x+w/2,153,p.label);x+=w;});body=svg(b,180,alt||`Whole ${d.total}. Parts: ${d.parts.map(p=>p.label).join(', ')}.`);}
    else if(d.type==='comparison'){const w=480*d.shortRatio;body=svg(label(325,30,`Total of both bars: ${format(d.total)}`)+box(45,60,480,45)+label(285,91,d.longLabel)+box(45,135,w,45,'#b9cedc')+label(45+w/2,166,d.shortLabel)+`<path d="M${45+w} 191v12H525v-12" fill="none" stroke="#2f4658" stroke-width="2"/>`+label((45+w+525)/2,239,d.difference),265,alt||`Longer bar ${d.longLabel}; shorter bar ${d.shortLabel}; total ${d.total}; difference ${d.difference}.`);}
    else if(d.type==='segment-bars'){let b='';const width=470/Math.max(...d.rows.map(r=>r.segments.length));d.rows.forEach((r,i)=>{r.segments.forEach((s,k)=>b+=box(20+k*width,20+i*90,width,44,s==='light'?'#eef4f8':'#738e9e'));b+=label(565,51+i*90,`= ${format(r.label)}`);});body=svg(b,d.rows.length*90,alt||d.rows.map(r=>`${r.segments.join(', ')} equals ${r.label}`).join('. '));}
    else if(d.type==='bar-chart'){const max=Math.ceil(Math.max(...d.bars.map(b=>b.value),1)/d.step)*d.step;let b=label(325,25,d.title);for(let n=0;n<=max;n+=d.step){let y=320-250*n/max;b+=`<path d="M65 ${y}H620" stroke="#beced8"/>`+label(32,y+7,n);}const slot=550/d.bars.length;d.bars.forEach((bar,i)=>{let x=65+i*slot+slot*.15,h=250*bar.value/max;b+=box(x,320-h,slot*.7,h,'#94cbe2')+label(x+slot*.35,355,bar.label)});b+=label(325,395,d.axisLabel);body=svg(b,420,alt||`${d.title}. ${d.bars.map(b=>`${b.label}: ${b.value}`).join('; ')}. Scale step ${d.step}.`);}
    return `<figure class="study-diagram">${body}${d.caption?`<figcaption>${escape(d.caption)}</figcaption>`:''}</figure>`;
  }
  const api={FORMAT,VERSION,MAX_BYTES,validate,diagram,render,grade};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.StudyRich=api;
})(typeof window!=='undefined'?window:globalThis);
