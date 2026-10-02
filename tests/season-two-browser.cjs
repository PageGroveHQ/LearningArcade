const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req,res)=>{
  const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  try { const body=fs.readFileSync(file);res.setHeader('Content-Type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json'})[path.extname(file)] || 'application/octet-stream');res.end(body); } catch {res.writeHead(404);res.end();}
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser = await chromium.launch({channel:'chrome',headless:true});
  try {
    const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/app.js?*',async route=>{
      let source=fs.readFileSync(path.join(root,'app.js'),'utf8');
      source=source.replace('wireSoundControls();wireStartupGate();', 'window.__test={store,activeProfile,bossQuestions,bossUnlocked,ALL_BOSSES,ALL_CHAPTERS,chapterUnlocked,renderStory,renderChapter,recordState,SENTINEL_RECORDS,go,startBoss,stopBackgroundAudio,restoreForegroundAudio,backgroundMusic,previewMusic,voiceCue,getSession:()=>session,getAudioScene:()=>audioScene,commitRoundResults,rollbackLatestRound};wireSoundControls();wireStartupGate();');
      await route.fulfill({contentType:'text/javascript',body:source});
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.waitForFunction(()=>window.__test);
    await page.evaluate(()=>{
      const t=window.__test,p=t.activeProfile();t.store.onboardingVersion=1;document.body.classList.remove('intro-active');document.querySelector('#startupGate').hidden=true;
      p.bosses['doubt-cloud']={defeated:true};p.stats.subjects={states:{correct:100},spelling:{correct:100},math:{correct:150},poems:{correct:40},study:{correct:110}};
      t.store.studySets=[{id:'test-study',title:'Test',questions:[{question:'What is the capital of France?',answer:'Paris',distractors:['Rome','Berlin','Madrid']}]}];t.go('story');
    });
    assert.equal(await page.locator('.rival-card').count(),5);
    assert.equal(await page.locator('[data-start-boss="atlas-aegis"]').isEnabled(),true);
    assert.equal(await page.locator('[data-start-boss="cipher-talon"]').isEnabled(),false);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile story overflows');
    await page.screenshot({path:path.join(root,'tmp','season-two-mobile.png'),fullPage:true});
    await page.locator('.season-two').screenshot({path:path.join(root,'tmp','season-two-cards.png')});
    const banks=await page.evaluate(()=>{const t=window.__test;return t.ALL_BOSSES.filter(b=>b.season===2).map(b=>({id:b.id,questions:t.bossQuestions(b)}));});
    assert(banks[1].questions.some(q=>q.subject==='study'),'Cipher Talon must use Study Lab');
    assert(banks[2].questions.some(q=>q.operation==='divide'),'Quotient Titan must include division');
    for(const bank of banks)assert(bank.questions.every(q=>q.answer!==undefined),'Boss question lacks answer');
    await page.locator('[data-start-boss="atlas-aegis"]').click();
    await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
    const hidden=await page.evaluate(()=>{const t=window.__test;return {paused:t.getSession().paused,audio:[t.backgroundMusic,t.previewMusic,t.voiceCue].every(a=>a.paused),scene:t.getAudioScene()};});
    assert(hidden.paused&&hidden.audio&&hidden.scene==='silent','Backgrounding must pause gameplay and audio');
    await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
    assert.equal(await page.evaluate(()=>window.__test.getSession().paused),true,'Returning must keep round paused');
    const undo=await page.evaluate(()=>{const t=window.__test,p=t.activeProfile(),before=JSON.stringify({stats:p.stats,bosses:p.bosses,missions:p.missions}),s=t.getSession(),boss=t.ALL_BOSSES.find(b=>b.id==='atlas-aegis');s.answerEvents=s.questions.slice(0,9).map(q=>({ok:true,question:q,elapsed:1000}));t.commitRoundResults(p,boss,true,9,9,100);const won=p.bosses['atlas-aegis']?.defeated,next=t.bossUnlocked(p,t.ALL_BOSSES.find(b=>b.id==='cipher-talon'));t.rollbackLatestRound(p);return {won,next,restored:before===JSON.stringify({stats:p.stats,bosses:p.bosses,missions:p.missions})};});
    assert(undo.won&&undo.next&&undo.restored,'Latest-round undo must reverse rival unlocks, rewards, and answer totals');
    assert.deepEqual(errors,[],'Browser runtime errors');
    console.log('Mobile Season Two rendering, boss banks, sequential unlocks, and background pause passed.');
  } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
