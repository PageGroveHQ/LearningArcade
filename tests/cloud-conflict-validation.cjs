// Cloud Save must not silently replace progress: when the cloud copy is newer and this device has
// unsynced work, sync pauses until the parent chooses a copy.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'..','cloud-sync.js'),'utf8');
function harness({lastSynced,cloudUpdated,localChanged,hasProgress,cloudExists=true}){
  const meta=new Map(),imports=[],writes=[];let timers=0;
  if(lastSynced)meta.set('learning-arcade-cloud-meta-v1',JSON.stringify({uid:'u1',lastSyncedAt:lastSynced}));
  const bridge={exportData:()=>({profiles:[{id:'local'}]}),deviceId:()=>'device-a',markSynced(){},importData:data=>imports.push(data),changedAt:()=>localChanged,hasProgress:()=>hasProgress};
  const context={TextEncoder,JSON,Date,Set,Math,Number,console,navigator:{onLine:true},localStorage:{getItem:key=>meta.get(key)||null,setItem:(key,value)=>meta.set(key,value),removeItem:key=>meta.delete(key)},setTimeout:()=>{timers++;return timers},clearTimeout(){},window:{LEARNING_ARCADE_FIREBASE:null,LearningArcadeDataBridge:bridge,dispatchEvent(){},addEventListener(){}},CustomEvent:class{}};
  vm.createContext(context);vm.runInContext(source.replace('emit();initialize();','emit();')+'\nglobalThis.__test={reconcile,schedulePush,upload,status,setAPI:value=>{api=value;user={uid:"u1"};}};',context);
  const record={version:2,data:JSON.stringify({profiles:[{id:'cloud'}]}),updatedAt:cloudUpdated,updatedBy:'device-b'};
  context.__test.setAPI({doc:()=>({}),serverTimestamp:()=>999,setDoc:async(_,data)=>{writes.push(data)},getDoc:async()=>({exists:()=>cloudExists,data:()=>record})});
  return {t:context.__test,imports,writes,timers:()=>timers};
}
(async()=>{
  // Second device signs in for the first time and already has its own progress: ask, do not overwrite.
  let h=harness({lastSynced:0,cloudUpdated:500,localChanged:300,hasProgress:true});await h.t.reconcile();
  assert.equal(h.t.status.phase,'conflict');assert.equal(h.imports.length,0);assert.equal(h.writes.length,0);assert.match(h.t.status.message,/Restore from cloud/);
  h.t.schedulePush();assert.equal(h.timers(),0,'automatic uploads stay paused during a conflict');
  await h.t.upload();assert.equal(h.writes.length,1,'the parent can still choose to keep this device');assert.equal(h.t.status.phase,'ready');
  // Brand-new device with nothing on it: take the cloud copy as before.
  h=harness({lastSynced:0,cloudUpdated:500,localChanged:300,hasProgress:false});await h.t.reconcile();assert.equal(h.imports.length,1);assert.equal(h.imports[0].profiles[0].id,'cloud');
  // Device played offline while another device synced: ask.
  h=harness({lastSynced:400,cloudUpdated:500,localChanged:450,hasProgress:true});await h.t.reconcile();assert.equal(h.t.status.phase,'conflict');assert.equal(h.imports.length,0);
  // Idle device, cloud moved on: follow the cloud.
  h=harness({lastSynced:400,cloudUpdated:500,localChanged:400,hasProgress:true});await h.t.reconcile();assert.equal(h.imports.length,1);
  // Only this device changed: upload.
  h=harness({lastSynced:500,cloudUpdated:500,localChanged:600,hasProgress:true});await h.t.reconcile();assert.equal(h.writes.length,1);assert.equal(h.imports.length,0);
  // Nothing changed anywhere.
  h=harness({lastSynced:500,cloudUpdated:500,localChanged:500,hasProgress:true});await h.t.reconcile();assert.equal(h.t.status.phase,'ready');assert.equal(h.writes.length+h.imports.length,0);
  console.log('PASS: Cloud Save pauses for a parent choice instead of overwriting unsynced progress; ordinary sync paths unchanged.');
})().catch(error=>{console.error(error);process.exitCode=1});
