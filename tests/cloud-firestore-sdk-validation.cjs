// Build (but NEVER commit) Firebase SDK batches to exercise its real wire-data validation.
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage();await page.goto('about:blank');const study=JSON.parse(fs.readFileSync('temporary-imports/study-lab-math-visual-practice.json','utf8'));
 const result=await page.evaluate(async study=>{const core=await import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),sdk=await import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js');const db=sdk.getFirestore(core.initializeApp({projectId:'demo-arcade-validation',apiKey:'not-a-real-key'},'read-only-validation'));const ref=sdk.doc(db,'validation','never-committed'),payload={profiles:[{id:'test'}],studySets:[study]};let oldError='';try{sdk.writeBatch(db).set(ref,{version:1,data:payload});}catch(e){oldError=e.message;}sdk.writeBatch(db).set(ref,{version:2,dataEncoding:'json',data:JSON.stringify(payload)});return {oldError,newAccepted:true};},study);
 assert.match(result.oldError,/Nested arrays/i);assert(result.newAccepted);console.log('PASS: official Firebase SDK rejects original visual save and accepts JSON-string save. No batch was committed and no account data was accessed.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
