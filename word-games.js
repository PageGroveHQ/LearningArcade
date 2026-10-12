(function(root){
  'use strict';
  const normalize=word=>String(word).normalize('NFC').toLowerCase();
  const isLetter=letter=>/^\p{L}$/u.test(letter);
  function assemblyState(answer,guesses=[]){const word=normalize(answer),chosen=[...new Set(guesses.map(normalize).filter(letter=>[...letter].length===1&&isLetter(letter)))],letters=[...new Set([...word].filter(isLetter))],misses=chosen.filter(letter=>!word.includes(letter)).length;return {chosen,misses:Math.min(6,misses),remaining:Math.max(0,6-misses),won:letters.length>0&&letters.every(letter=>chosen.includes(letter)),lost:misses>=6};}
  const marks={a:['a','á'],e:['e','é'],i:['i','í'],o:['o','ó'],u:['u','ú','ü'],n:['n','ñ']};
  function unmarked(word){return normalize(word).replace(/[áéíóúüñ]/g,letter=>({'á':'a','é':'e','í':'i','ó':'o','ú':'u','ü':'u','ñ':'n'}[letter]));}
  function cycleMark(word,index){const letters=[...word],base=unmarked(letters[index]||''),variants=marks[base];if(variants)letters[index]=variants[(variants.indexOf(letters[index])+1)%variants.length];return letters.join('');}
  function markExplanation(word){const letters=[...normalize(word)],acute=letters.flatMap((letter,index)=>/[áéíóú]/.test(letter)?[`Written accent on ${letter} (letter ${index+1}).`]:[]);if(letters.includes('ñ'))acute.push('Ñ is its own Spanish letter; its tilde is not a stress accent.');if(letters.includes('ü'))acute.push('Ü uses a diaeresis to show the u is pronounced.');return acute.join(' ')||'This word has no written accent or tilde.';}
  const api={normalize,isLetter,assemblyState,unmarked,cycleMark,markExplanation,marks};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WordGames=api;
})(typeof window!=='undefined'?window:globalThis);
