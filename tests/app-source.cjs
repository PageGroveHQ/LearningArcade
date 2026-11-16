// The app's code is split across app/*.js plus app.js. Source-inspection tests read it as one text, in load order.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const files=[...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="(app(?:\/[\w-]+)?\.js)\?v=\d+"><\/script>/g)].map(match=>match[1]);
if(files.at(-1)!=='app.js'||files.length<2)throw new Error('index.html must load app/*.js followed by app.js');
module.exports={files,read:()=>files.map(file=>fs.readFileSync(path.join(root,file),'utf8')).join('\n')};
