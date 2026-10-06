// Convert the original standalone worksheet's question data into a portable Study Lab set.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const rich=require('../study-rich.js');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'temporary-imports/math-unit-2-practice.html'),'utf8');
const start=html.indexOf('const questions=['),end=html.indexOf('\nconst fmt=',start);
const context={};vm.createContext(context);vm.runInContext(html.slice(start,end)+';globalThis.items=questions',context);
const set={format:rich.FORMAT,version:1,title:'Addition and Subtraction - Fresh Practice',subject:'Math',testDate:'2026-10-07',questions:context.items.map(q=>{
 const fields=q.answers.map((answer,i)=>({label:q.labels?.[i]||'Answer',answer:String(answer),type:'number',accepted:[]}));
 const item={question:q.prompt,answer:fields.length===1?fields[0].answer:fields.map(f=>`${f.label}: ${f.answer}`).join(' · '),accepted:[],explanation:q.explain,distractors:(q.choices||[]).filter(v=>v!==q.answers[0]).map(String),response:{fields,alternatives:[]}};
 if(q.puzzle){for(const a of [2,3,7,8])for(const b of [2,3,7,8])for(const c of [2,3,7,8])for(const d of [2,3,7,8]){const v=[a,b,c,d];if(new Set(v).size===4&&4100+10*a+b+10*c+d===4210)item.response.alternatives.push(v.map(String));}}
 if(q.kind==='table')item.diagram={type:'table',rows:q.data};
 if(q.kind==='hex')item.diagram={type:'number-bonds',groups:q.data};
 if(q.kind==='equation')item.diagram={type:'equation',lines:[q.data]};
 if(q.kind==='vertical')item.diagram={type:'vertical',lines:q.data};
 if(q.kind==='pyramid')item.diagram={type:'pyramid',rows:q.data};
 if(q.kind==='parts')item.diagram={type:'part-whole',total:q.data.total,parts:q.data.parts.map(v=>({label:v,width:typeof v==='number'?v:231}))};
 if(q.kind==='compare')item.diagram={type:'comparison',total:960,longLabel:'a',shortLabel:385,difference:'b',shortRatio:385/575};
 if(q.kind==='colored')item.diagram={type:'segment-bars',rows:[{segments:['light','light','dark','dark','dark'],label:1230},{segments:['light','dark','dark','dark'],label:990},{segments:['light','dark','dark','dark','dark'],label:'?'}]};
 return item;
})};
const clean=rich.validate(set);
fs.writeFileSync(path.join(root,'temporary-imports/study-lab-math-visual-practice.json'),JSON.stringify(clean,null,2)+'\n');
console.log(`Created ${clean.questions.length} visual questions (${Buffer.byteLength(JSON.stringify(clean))} bytes).`);
