// Regression checks for the November 2026 review: save size, exact undo, error recovery, Alaska outline,
// local dates, the ambiguous zero fact, "St." place names and state mastery matching.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{const u=req.url.split('?')[0],f=path.resolve(root,'.'+(u==='/'?'/index.html':u));if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json'})[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));}catch{res.writeHead(404);res.end();}});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block',timezoneId:'America/New_York'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://**',r=>r.abort());
 const setup=async()=>{await page.waitForFunction(()=>typeof renderHome==='function'&&typeof store==='object');await page.evaluate(()=>{store.onboardingVersion=1;store.audioPrefs.enabled=false;document.body.classList.remove('intro-active','onboarding-active');document.querySelector('#startupGate').hidden=true;document.querySelector('#onboardingGate').hidden=true;});};
 await page.goto(`http://127.0.0.1:${server.address().port}/`);await setup();
 const playRound=()=>page.evaluate(()=>{const questions=shuffle(stateQuestionBank(STATE_DATA,['facts','map','triples'])).slice(0,25);startSession('Atlas Quest',questions,'choice',0,{livesEnabled:false});for(let i=0;i<25;i++)grade(i%4!==0,false);});
 // Save size: history is stored once, only recent rounds keep answer detail, and growth levels off.
 const sizes=[];for(let i=0;i<14;i++){await playRound();sizes.push(await page.evaluate(()=>localStorage.getItem('learning-arcade-v2').length));}
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('learning-arcade-v2')));
 assert.equal('stats' in saved,false,'the active-profile alias must not be saved twice');assert.equal(saved.profiles[0].stats.rounds.length,14);
 assert.equal(saved.profiles[0].stats.rounds.filter(round=>round.answers).length,10,'only the ten newest rounds keep answers');
 assert.equal(saved.profiles[0].lastRoundUndo.before.stats.rounds,undefined);assert(JSON.stringify(saved.profiles[0].lastRoundUndo).length<40000,'undo receipt stays small');
 assert(sizes[13]-sizes[12]<12000,`late rounds should add little (added ${sizes[13]-sizes[12]})`);assert(sizes[13]<450000,`14 long rounds stay well under the cloud limit (${sizes[13]})`);
 assert.equal(await page.evaluate(()=>JSON.stringify(window.LearningArcadeDataBridge.exportData()).includes('"stats":{"stars"')&&!('stats' in window.LearningArcadeDataBridge.exportData())),true);
 // Undo restores exactly what was there before the round.
 const comparable=()=>page.evaluate(()=>{const p=structuredClone(activeProfile());delete p.lastRoundUndo;delete p.savedRound;p.stats.rounds.forEach(round=>delete round.answers);return JSON.stringify(p);});
 const before=await comparable();await playRound();assert.notEqual(await comparable(),before);assert.equal(await page.evaluate(()=>rollbackLatestRound()),true);assert.equal(await comparable(),before,'undo must restore the earlier state exactly');
 // A reload keeps everything and still starts.
 await page.reload();await setup();assert.equal(await page.evaluate(()=>activeProfile().stats.rounds.length),14);
 // A full device does not break play.
 await page.evaluate(()=>{const real=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('full','QuotaExceededError')};window.__restore=()=>Storage.prototype.setItem=real;});
 assert.equal(await page.evaluate(()=>save()),false);await playRound();assert.equal(await page.evaluate(()=>document.body.dataset.saveFailed),'true');await page.evaluate(()=>window.__restore());assert.equal(await page.evaluate(()=>save()),true);
 // A screen that fails to draw explains itself and offers a way home.
 await page.evaluate(()=>{window.__realStates=renderStates;renderStates=()=>{throw new Error('test failure')};go('states');});
 assert.match(await page.locator('#statesView').innerText(),/could not load[\s\S]*test failure/);await page.locator('#statesView [data-go="home"]').click();assert.equal(await page.evaluate(()=>document.querySelector('.screen.active').dataset.screen),'home');
 await page.evaluate(()=>{renderStates=window.__realStates;go('states');});assert(await page.locator('#startStates').isVisible());
 // A question that fails to draw can be skipped.
 await page.evaluate(()=>{const qs=stateQuestionBank(STATE_DATA.slice(0,3),['facts']).slice(0,2);qs[0]={...qs[0],modeOverride:'map-place',state:null};startSession('Broken',qs,'choice',0,{livesEnabled:false});});
 assert.match(await page.locator('#sessionView').innerText(),/This question could not load/);await page.locator('#skipBrokenQuestion').click();assert.equal(await page.locator('.answer').count(),4);await page.evaluate(()=>{clearSavedRound();session=null;go('home');});
 // Alaska's outline fills the frame instead of shrinking to a speck.
 await page.evaluate(()=>startSession('Outline',[stateQuestion(STATE_DATA.find(s=>s.abbr==='AK'),'map')],'choice',0,{livesEnabled:false}));await page.waitForSelector('#mapStage svg path');
 const box=await page.evaluate(()=>{const b=document.querySelector('#mapStage svg path').getBBox();return {w:b.width,h:b.height};});assert(box.w>250&&box.h>120,`Alaska outline too small: ${JSON.stringify(box)}`);
 fs.mkdirSync(path.join(root,'tmp'),{recursive:true});await page.locator('#mapStage').screenshot({path:path.join(root,'tmp/alaska-outline.png')});
 for(const abbr of ['MT','HI','TX','RI']){await page.evaluate(abbr=>startSession('Outline',[stateQuestion(STATE_DATA.find(s=>s.abbr===abbr),'map')],'choice',0,{livesEnabled:false}),abbr);await page.waitForSelector('#mapStage svg path');const b=await page.evaluate(()=>{const b=document.querySelector('#mapStage svg path').getBBox();return Math.max(b.width/314,b.height/204);});assert(b>.95&&b<1.01,`${abbr} outline should fit its frame (${b})`);}
 await page.evaluate(()=>{clearSavedRound();session=null;go('home');});
 // Dates follow the device's own calendar day (New York evening is still "today").
 await page.clock.install({time:new Date('2026-11-17T01:30:00Z')});assert.equal(await page.evaluate(()=>today()),'2026-11-16');
 // 0 × ? = 0 is no longer asked; other missing-factor facts remain.
 const factors=await page.evaluate(()=>mathQuestionBank({tables:[0,3],sector:'multiply',divisionMode:'factor'}).map(q=>q.prompt));assert(!factors.some(prompt=>prompt.startsWith('0 ×')));assert.equal(factors.length,11);
 // "St. Paul" is accepted for Saint Paul; spelling drills stay exact.
 const typed=async(answer)=>{await page.evaluate(()=>startSession('Typed',[stateQuestion(STATE_DATA.find(s=>s.abbr==='MN'),'facts','state-capital')],'type',0,{livesEnabled:false}));await page.locator('#typedAnswer').fill(answer);await page.locator('#answerForm button').click();const ok=await page.locator('#feedback .good').count();await page.evaluate(()=>{clearSavedRound();session=null;});return !!ok;};
 assert.equal(await typed('St. Paul'),true);assert.equal(await typed('saint paul'),true);assert.equal(await typed('St. Peter'),false);
 assert.equal(await page.evaluate(()=>typedKey('St. Paul',{subject:'state-spelling'})===typedKey('Saint Paul',{subject:'state-spelling'})),false);
 // Mastery matching no longer credits the wrong state.
 const match=await page.evaluate(()=>{const by=abbr=>STATE_DATA.find(s=>s.abbr===abbr),m=(prompt,answer,abbr,stateName)=>skillMatchesState({prompt,answer,...(stateName?{stateName}:{})},by(abbr));return {
  indianaFromSentence:m('The U.S. Space & Rocket Center is in Huntsville.','Alabama','IN'),alabama:m('The U.S. Space & Rocket Center is in Huntsville.','Alabama','AL'),
  kansasFromArkansas:m('What is the capital of Arkansas?','Little Rock','KS'),arkansas:m('What is the capital of Arkansas?','Little Rock','AR'),
  virginiaFromWest:m('What is the capital of West Virginia?','Charleston','VA'),westVirginia:m('What is the capital of West Virginia?','Charleston','WV'),
  abbr:m('IN stands for which state?','Indiana','IN'),oklahoma:m('Oklahoma City is the capital of which state?','Oklahoma','OK'),
  washingtonFromDC:m('What is the capital of District of Columbia?','Washington, D.C.','WA'),tagged:m('Which state is this?','x','MT','Montana'),taggedOther:m('Montana','Helena','MT','Idaho')};});
 assert.deepEqual(match,{indianaFromSentence:false,alabama:true,kansasFromArkansas:false,arkansas:true,virginiaFromWest:false,westVirginia:true,abbr:true,oklahoma:true,washingtonFromDC:false,tagged:true,taggedOther:false});
 assert.deepEqual(errors,[]);console.log(`PASS: compact saves (${sizes[13]} chars after 14 long rounds), exact undo, full-storage and broken-screen recovery, Alaska outline, local dates, zero fact, St./Saint and mastery matching.`);
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1});
