const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.join(__dirname,"..");
const app=fs.readFileSync(path.join(root,"app.js"),"utf8");
const data=fs.readFileSync(path.join(root,"data.js"),"utf8");
const context={window:{}};vm.createContext(context);vm.runInContext(data,context);
const states=context.window.STATE_DATA;

function objectLiteral(source,name,nextMarker){const start=source.indexOf(`const ${name} = `),valueStart=start+`const ${name} = `.length,end=source.indexOf(nextMarker,valueStart);assert(start>=0&&end>valueStart,`Could not find ${name}`);return Function(`return (${source.slice(valueStart,end).replace(/;\s*$/,"")});`)();}
function functionSource(signature,nextSignature){const start=app.indexOf(`function ${signature}`),end=app.indexOf(`  function ${nextSignature}`,start);assert(start>=0&&end>start,`Could not find ${signature}`);return app.slice(start,end);}

const neighbors=objectLiteral(app,"STATE_NEIGHBORS","const STATE_DISCOVERY");
const stateNeighborQuestion=Function("STATE_NEIGHBORS","STATE_DATA","pick",`${functionSource("stateNeighborQuestion(state,states=STATE_DATA)","stateQuestionBank(states,kind)")};return stateNeighborQuestion;`)(neighbors,states,values=>values[0]);
for(const state of states){
  const question=stateNeighborQuestion(state,states),expected=(neighbors[state.abbr]||[]).map(abbr=>states.find(item=>item.abbr===abbr).name);
  if(!expected.length){assert.equal(question,null,`${state.name} should not have a land-border question`);continue;}
  assert.deepEqual([...question.accepted].sort(),[...expected].sort(),`${state.name} did not accept every bordering state`);
  assert(question.accepted.includes(question.answer),`${state.name}'s primary answer was not accepted`);
  for(const name of expected)assert(question.detail.includes(name),`${state.name}'s feedback omitted ${name}`);
}
assert.equal(stateNeighborQuestion(states.find(state=>state.abbr==="FL"),states).accepted.length,2,"Florida should accept Alabama and Georgia");
assert.equal(stateNeighborQuestion(states.find(state=>state.abbr==="TN"),states).accepted.length,8,"Tennessee should accept all eight bordering states");
assert(app.includes('accepted=[q.answer,...(q.accepted||[])].map(norm)'),"Multiple-choice grading does not use alternate accepted answers");

const questionSnapshot=Function(`${functionSource("questionSnapshot(q)","mistakeKey(q)")};return questionSnapshot;`)();
const snapshotFactory=Function("questionSnapshot","input",`let session=input;${functionSource("savedSessionSnapshot()","persistSessionProgress()")};return savedSessionSnapshot();`);
const saved=snapshotFactory(questionSnapshot,{title:"State Quest",index:2,questions:[{subject:"states",prompt:"Which state borders Florida?",answer:"Alabama",accepted:["Alabama","Georgia"],detail:"Florida borders Alabama and Georgia."}],wrongQuestions:[],paused:true,pausedRemainingMs:42000,pausedElapsedMs:9000,deadline:Date.now()+100000,startedAt:Date.now()-9000,timerId:123});
assert.equal(saved.remainingMs,42000,"Paused timer duration was not frozen");
assert.equal(saved.elapsedMs,9000,"Paused play duration was not frozen");
assert.equal(saved.questions[0].accepted.length,2,"Saved rounds lost accepted border answers");
assert(!Object.hasOwn(saved,"timerId"),"Saved rounds must not serialize live timer handles");
for(const marker of ["Game Paused","Save & Exit","Exit Without Saving","resumeSavedRound","visibilitychange","pagehide","savedRoundCard"])assert(app.includes(marker)||fs.readFileSync(path.join(root,"index.html"),"utf8").includes(marker),`Missing pause/resume marker: ${marker}`);
console.log("Validated every state border answer, Florida's two neighbors, Tennessee's eight neighbors, and resumable paused-session snapshots.");
