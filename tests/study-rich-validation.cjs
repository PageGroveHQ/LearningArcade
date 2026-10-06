const assert=require('node:assert/strict'),fs=require('node:fs'),rich=require('../study-rich.js');
const set=JSON.parse(fs.readFileSync('temporary-imports/study-lab-math-visual-practice.json','utf8'));
const clean=rich.validate(set);assert.equal(clean.questions.length,20);assert.equal(clean.questions.filter(q=>q.diagram).length,14);
const computed=[854,2764+3859,367+648+285,5842-1967,65%10,6000-90,6831-2584-200-40-7,[845+880,1475+1770],[3,3],[2,3,8,7],248+76+185,462-96-135,[960-385,960-385-385],2840+975-1685,4079,1875-(3460-1875),2400-625-(625+284),1546-2*428,[6420-5265,3180-(6420-5265),6420-3180],240+4*250].map(v=>(Array.isArray(v)?v:[v]).map(String));
clean.questions.forEach((q,i)=>{assert.deepEqual(q.response.fields.map(f=>f.answer),computed[i]);assert(rich.grade(q.response,computed[i]));assert(!rich.grade(q.response,computed[i].map(()=>'')));});
assert(rich.grade(clean.questions[9].response,['8','7','2','3']));assert(!rich.grade(clean.questions[9].response,['2','2','8','8']));
assert(rich.grade(clean.questions[2].response,['1,300']));assert(!rich.grade(clean.questions[2].response,['1300 bananas']));
assert(!rich.grade(clean.questions[7].response,['1725','3000']));
const variants=[{type:'table',rows:[['Label','Count'],['<img src=x onerror=alert(1)>',12]]},{type:'bar-chart',title:'Book sales',axisLabel:'Books',step:20,bars:[{label:'Monday',value:80},{label:'Tuesday',value:120}]},...clean.questions.filter(q=>q.diagram).map(q=>q.diagram)];
for(const d of variants){const html=rich.render(d);assert(html.includes('study-diagram'));assert(!html.includes('<img'));}
for(const changes of [{version:2},{questions:[]},{questions:[{question:'?',answer:'1',diagram:{type:'html',body:'<script>alert(1)</script>'}}]},{testDate:'2026-02-31'},{questions:[{question:'?',answer:'1',diagram:{type:'table',rows:[['a','b'],['c']]}}]}])assert.throws(()=>rich.validate({...set,...changes}));
assert.throws(()=>rich.validate({...set,questions:[{question:'?',answer:'1',response:{fields:[{label:'a',answer:'1'}],alternatives:[['1','2']]}}]}));
assert.throws(()=>rich.diagram({type:'bar-chart',title:'x',axisLabel:'x',step:.001,bars:[{label:'x',value:1000}]}));
assert.throws(()=>rich.validate({...set,questions:[{question:'?',answer:'2',response:{fields:[{label:'Answer',answer:'3',type:'number'}]}}]}));
assert.throws(()=>rich.validate({...set,questions:[{question:'?',answer:'2',accepted:'not an array'}]}));
assert.deepEqual(rich.validate(clean),clean,'Export/re-import validation must be lossless');
assert(rich.validate(JSON.parse(fs.readFileSync('templates/study-lab-visual-template.json','utf8'))));
const index=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');assert(index.indexOf('study-rich.js')<index.indexOf('app.js'));for(const asset of ['./study-rich.js','./study-rich.css'])assert(sw.includes(asset));
console.log('Validated 20 independent answer keys, all diagram types, alternate arrangements, numeric grading, portable template, escaped labels, invalid file rejection, and offline assets.');
