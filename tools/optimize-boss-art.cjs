const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const sharp=require(process.env.SHARP_MODULE||'sharp');
(async()=>{
  const directory=path.join(__dirname,'..','assets','characters','bosses','season-2');
  for(const name of ['atlas-aegis','cipher-talon','quotient-titan','verse-valkyrie','null-regent']){
    const source=path.join(directory,`${name}.png`),output=path.join(directory,`${name}.webp`);
    await sharp(source).webp({lossless:true,effort:6}).toFile(output);
    const original=await sharp(source).ensureAlpha().raw().toBuffer(),converted=await sharp(output).ensureAlpha().raw().toBuffer();
    assert.equal(original.length,converted.length);
    for(let i=0;i<original.length;i+=4){assert.equal(original[i+3],converted[i+3],`${name}: alpha differs`);if(original[i+3])for(let channel=0;channel<3;channel++)assert.equal(original[i+channel],converted[i+channel],`${name}: visible color differs`);}
    const before=(await fs.stat(source)).size,after=(await fs.stat(output)).size;
    console.log(`${name}: ${before} -> ${after} bytes; identical visible colors and alpha`);
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
