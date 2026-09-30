const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname,"..");
const app = fs.readFileSync(path.join(root,"app.js"),"utf8");
const data = fs.readFileSync(path.join(root,"data.js"),"utf8");
const context={window:{}};
vm.createContext(context);
vm.runInContext(data,context);
const states=context.window.STATE_DATA;
const spelling=context.window.BUNDLED_SPELLING_WORDS;
const topology=JSON.parse(fs.readFileSync(path.join(root,"vendor","states-10m.json"),"utf8"));

const canonical={
  AL:["Alabama","Montgomery"],AK:["Alaska","Juneau"],AZ:["Arizona","Phoenix"],AR:["Arkansas","Little Rock"],CA:["California","Sacramento"],CO:["Colorado","Denver"],CT:["Connecticut","Hartford"],DE:["Delaware","Dover"],DC:["District of Columbia","Washington, D.C."],FL:["Florida","Tallahassee"],GA:["Georgia","Atlanta"],HI:["Hawaii","Honolulu"],ID:["Idaho","Boise"],IL:["Illinois","Springfield"],IN:["Indiana","Indianapolis"],IA:["Iowa","Des Moines"],KS:["Kansas","Topeka"],KY:["Kentucky","Frankfort"],LA:["Louisiana","Baton Rouge"],ME:["Maine","Augusta"],MD:["Maryland","Annapolis"],MA:["Massachusetts","Boston"],MI:["Michigan","Lansing"],MN:["Minnesota","Saint Paul"],MS:["Mississippi","Jackson"],MO:["Missouri","Jefferson City"],MT:["Montana","Helena"],NE:["Nebraska","Lincoln"],NV:["Nevada","Carson City"],NH:["New Hampshire","Concord"],NJ:["New Jersey","Trenton"],NM:["New Mexico","Santa Fe"],NY:["New York","Albany"],NC:["North Carolina","Raleigh"],ND:["North Dakota","Bismarck"],OH:["Ohio","Columbus"],OK:["Oklahoma","Oklahoma City"],OR:["Oregon","Salem"],PA:["Pennsylvania","Harrisburg"],RI:["Rhode Island","Providence"],SC:["South Carolina","Columbia"],SD:["South Dakota","Pierre"],TN:["Tennessee","Nashville"],TX:["Texas","Austin"],UT:["Utah","Salt Lake City"],VT:["Vermont","Montpelier"],VA:["Virginia","Richmond"],WA:["Washington","Olympia"],WV:["West Virginia","Charleston"],WI:["Wisconsin","Madison"],WY:["Wyoming","Cheyenne"]
};

assert.equal(states.length,51,"State Quest must include 50 states plus Washington, D.C.");
assert.equal(Object.keys(canonical).length,51,"Canonical location list is incomplete");
assert.equal(new Set(states.map(state=>state.id)).size,51,"Location map IDs must be unique");
assert.equal(new Set(states.map(state=>state.abbr)).size,51,"Location abbreviations must be unique");
assert.equal(new Set(states.map(state=>state.name)).size,51,"Location names must be unique");
for(const state of states){
  assert.deepEqual([state.name,state.capital],canonical[state.abbr],`Incorrect name or capital for ${state.abbr}`);
  assert(state.region.endsWith(" Region"),`${state.name} has an invalid region`);
  assert(state.division.endsWith(" Division"),`${state.name} has an invalid division`);
}
const expectedDivisions={
  "New England":["CT","ME","MA","NH","RI","VT"],
  "Middle Atlantic":["NJ","NY","PA"],
  "East North Central":["IL","IN","MI","OH","WI"],
  "West North Central":["IA","KS","MN","MO","NE","ND","SD"],
  "South Atlantic":["DE","FL","GA","MD","NC","SC","VA","DC","WV"],
  "East South Central":["AL","KY","MS","TN"],
  "West South Central":["AR","LA","OK","TX"],
  Mountain:["AZ","CO","ID","MT","NV","NM","UT","WY"],
  Pacific:["AK","CA","HI","OR","WA"]
};
for(const [division,abbreviations] of Object.entries(expectedDivisions)){
  const actual=Array.from(states.filter(state=>state.division===`${division} Division`),state=>state.abbr).sort();
  assert.deepEqual(actual,[...abbreviations].sort(),`${division} membership is incorrect`);
}
const mapIds=new Set(topology.objects.states.geometries.map(item=>String(item.id).padStart(2,"0")));
for(const state of states)assert(mapIds.has(state.id),`${state.name} is missing from the map data`);

function extract(name,next){
  const start=app.indexOf(`function ${name}`),end=app.indexOf(`  function ${next}`,start);
  assert(start>=0&&end>start,`Could not extract ${name}`);
  return app.slice(start,end);
}
const norm=value=>String(value??"").trim().toLowerCase().replace(/[.,!?]/g,"");
const shuffle=values=>{
  const copy=[...values];
  for(let index=copy.length-1;index>0;index--){const swap=Math.floor(Math.random()*(index+1));[copy[index],copy[swap]]=[copy[swap],copy[index]];}
  return copy;
};
const spellingAnswerOptions=Function("norm","shuffle",`${extract("spellingAnswerOptions(q)","stateAnswerOptions(q)")}; return spellingAnswerOptions;`)(norm,shuffle);
const stateAnswerOptions=Function("STATE_DATA","shuffle",`${extract("stateAnswerOptions(q)","answerOptions(q)")}; return stateAnswerOptions;`)(states,shuffle);
const stateQuestion=Function(`${extract("stateQuestion(state, kind, direction)","stateQuestionBank(states,kind)")}; return stateQuestion;`)();
const spellingTargets=[...spelling,...states.flatMap(state=>[state.name,state.capital])];
for(const answer of spellingTargets){
  for(let trial=0;trial<200;trial++){
    const options=spellingAnswerOptions({answer});
    assert.equal(options.length,4,`${answer} did not have four spelling choices`);
    assert.equal(new Set(options.map(norm)).size,4,`${answer} had duplicate spelling choices`);
    assert.equal(options.filter(option=>norm(option)===norm(answer)).length,1,`${answer} did not include the correct answer exactly once`);
  }
}

function validateChoices(label,options,answer){
  assert.equal(options.length,4,`${label} did not have four choices`);
  assert.equal(new Set(options.map(norm)).size,4,`${label} had duplicate choices`);
  assert.equal(options.filter(option=>norm(option)===norm(answer)).length,1,`${label} did not include the correct answer exactly once`);
}
for(const state of states){
  const factExpectations={"state-capital":[state.capital,"capital"],"state-abbr":[state.abbr,"abbreviation"],"capital-state":[state.name,"state"],"abbr-state":[state.name,"state"],"capital-abbr":[state.abbr,"abbreviation"],"abbr-capital":[state.capital,"capital"]};
  for(const [direction,[answer,answerType]] of Object.entries(factExpectations)){
    const question=stateQuestion(state,"facts",direction);
    assert.equal(question.answer,answer,`${state.name} ${direction} generated the wrong answer`);
    assert.equal(question.answerType,answerType,`${state.name} ${direction} generated the wrong answer type`);
    assert(question.prompt.includes(state.name)||question.prompt.includes(state.abbr)||question.prompt.includes(state.capital),`${state.name} ${direction} generated an unrelated prompt`);
  }
  for(let trial=0;trial<100;trial++){
    validateChoices(`${state.name} state`,stateAnswerOptions({answerType:"state",answer:state.name,pool:states}),state.name);
    validateChoices(`${state.name} capital`,stateAnswerOptions({answerType:"capital",answer:state.capital,pool:states}),state.capital);
    validateChoices(`${state.name} abbreviation`,stateAnswerOptions({answerType:"abbr",answer:state.abbr,pool:states}),state.abbr);
    const combined=`${state.abbr} · ${state.capital}`;
    validateChoices(`${state.name} combined`,stateAnswerOptions({combined:true,state,pool:states}),combined);
    const mapCombined=`${state.name} · ${state.abbr} · ${state.capital}`;
    validateChoices(`${state.name} map combined`,stateAnswerOptions({combined:true,map:true,state,pool:states}),mapCombined);
    const region=state.region.replace(" Region","");
    validateChoices(`${state.name} region`,stateAnswerOptions({answerType:"region",answer:region}),region);
    const division=state.division.replace(" Division","");
    validateChoices(`${state.name} division`,stateAnswerOptions({answerType:"division",answer:division}),division);
  }
}
for(const region of ["Northeast Region","Midwest Region","South Region","West Region"]){
  const same=states.filter(state=>state.region===region),other=states.find(state=>state.region!==region),oddStates=[...same.slice(0,3),other];
  validateChoices(`${region} odd-state set`,stateAnswerOptions({oddStates}),other.name);
}

for(const subject of ["poem-line","poem-missing"]){
  const pattern=new RegExp(`subject:\"${subject}\"[^}]*modeOverride:\"choice\"`);
  assert(!pattern.test(app),`${subject} unexpectedly uses multiple choice without a distractor bank`);
}
assert(app.includes('startSession(`Next-Line Prompts — ${poem.title}`,shuffle(qs).slice(0,8),"type"'),"Next-line poems must use typed answers");
assert(app.includes('startSession(`Missing Words — ${poem.title}`,qs,"type"'),"Missing-word poems must use typed answers");

console.log(`Validated 51 canonical locations, all nine division rosters, map coverage, 306 generated fact questions, ${(states.length*7*100).toLocaleString()} State Quest choice sets, and ${(spellingTargets.length*200).toLocaleString()} spelling-choice sets.`);
