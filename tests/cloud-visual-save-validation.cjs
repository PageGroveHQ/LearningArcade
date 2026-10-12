const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('cloud-sync.js','utf8'),study=JSON.parse(fs.readFileSync('temporary-imports/study-lab-math-visual-practice.json','utf8'));
const payload={profiles:[{id:'test',stats:{rounds:[]},homeworkTasks:[{title:'Spanish spelling quiz',day:3}],savedRound:{questions:[study.questions[7]]},lastRoundUndo:{before:{stats:{rounds:[{answers:[{question:study.questions[2]}]}]}}}}],studySets:[study],spellingSets:[{words:['último','también'],language:'es',translations:{último:'last',también:'also'}}]};
let stored=null,imports=[],writes=0,meta=new Map(),changes=0,online=true;
const context={TextEncoder,JSON,Date,Set,Math,console,navigator:{get onLine(){return online}},localStorage:{getItem:k=>meta.get(k)||null,setItem:(k,v)=>meta.set(k,v),removeItem:k=>meta.delete(k)},setTimeout:()=>1,clearTimeout(){},window:{LEARNING_ARCADE_FIREBASE:null,LearningArcadeDataBridge:{exportData:()=>payload,deviceId:()=> 'test-device',markSynced(){changes++},importData:d=>imports.push(d)},dispatchEvent(){},addEventListener(){}},CustomEvent:class{}};
vm.createContext(context);vm.runInContext(source.replace('emit();initialize();','emit();')+'\nglobalThis.__test={encodeCloudData,decodeCloudData,syncErrorMessage,applyCloud,status,setAPI:value=>{api=value;user={uid:"test-user"};}};',context);
const t=context.__test,wire=t.encodeCloudData(payload);
assert.equal(typeof wire,'string');assert.deepEqual(JSON.parse(wire),payload);assert.deepEqual(JSON.parse(JSON.stringify(t.decodeCloudData({version:2,data:wire}))),payload);assert.deepEqual(JSON.parse(JSON.stringify(t.decodeCloudData({version:1,data:payload}))),payload);
assert.throws(()=>t.encodeCloudData({large:'á'.repeat(500001)}));assert.throws(()=>t.decodeCloudData({version:2,data:'invalid'}));assert.throws(()=>t.decodeCloudData({version:3,data:payload}));assert.throws(()=>t.decodeCloudData({version:2,data:'{}'}));
function rejectNested(value){if(Array.isArray(value))value.forEach(item=>{assert(!Array.isArray(item),'Firestore rejects nested arrays');rejectNested(item)});else if(value&&typeof value==='object')Object.values(value).forEach(rejectNested)}
assert.throws(()=>rejectNested(payload));
t.setAPI({doc:()=>({}),serverTimestamp:()=>123,setDoc:async(_,data)=>{rejectNested(data);stored=data;writes++},getDoc:async()=>({data:()=>({...stored,updatedAt:456})})});
(async()=>{
 await context.window.LearningArcadeCloud.push();assert.equal(writes,1);assert.equal(stored.version,2);assert.deepEqual(JSON.parse(stored.data),payload);assert.equal(t.status.phase,'ready');assert.equal(changes,1);
 await t.applyCloud({data:()=>stored});assert.deepEqual(JSON.parse(JSON.stringify(imports[0])),payload);
 await t.applyCloud({data:()=>({version:1,data:payload,updatedAt:789})});assert.equal(imports.length,2);
 const oldMeta=[...meta];await assert.rejects(t.applyCloud({data:()=>({version:2,data:'broken',updatedAt:999})}));assert.deepEqual([...meta],oldMeta,'Bad cloud data must not be acknowledged');assert.equal(imports.length,2);
 t.setAPI({doc:()=>({}),serverTimestamp:()=>123,setDoc:async()=>{throw {code:'permission-denied',message:'PRIVATE SAVE CONTENT'};}});await context.window.LearningArcadeCloud.push();assert.equal(t.status.phase,'error');assert.equal(t.status.pending,true);assert.match(t.status.message,/access was denied/);assert(!t.status.message.includes('PRIVATE'));assert.equal(writes,1);assert.deepEqual(JSON.parse(stored.data),payload);
 online=false;assert.match(t.syncErrorMessage({code:'unavailable'}),/Offline/);online=true;assert.match(t.syncErrorMessage({code:'resource-exhausted'}),/limit/);assert.match(t.syncErrorMessage({code:'save-too-large'}),/too large/);
 console.log('PASS: nested-diagram upload/restore, legacy saves, Spanish metadata, paused rounds and undo, UTF-8 size guard, rejected restore protection and safe error messages.');
})().catch(e=>{console.error(e);process.exitCode=1});
