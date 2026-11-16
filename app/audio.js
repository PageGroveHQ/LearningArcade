// Sound: music and effects mixer, voice cues, speech and recorded practice audio.
// Part of the Learning Arcade app. Files in app/ share one global scope and load in the order listed in index.html.
  let availableVoices = [];
  let activeAudio = null;
  let audioUnlocked = false;
  let audioScene = "menu";
  let appBackgrounded = document.hidden;
  let musicDucked = false;
  let questionAudioDucked = false;
  let openingPlayed = false, openingAttempting = false;
  let audioContext = null, masterGain = null, musicGain = null, effectsGain = null, voiceGain = null;
  const mediaSources = new WeakMap();
  const MUSIC = {menu:"audio/interface/game-select.mp3",level:"audio/interface/level-play.mp3",finished:"audio/interface/round-finished.mp3"};
  const CUES = {opening:"audio/interface/professor-opening.mp3",start:"audio/interface/sentinel-start.mp3"};
  const backgroundMusic = new Audio(); backgroundMusic.loop=true; backgroundMusic.preload="auto";
  const previewMusic = new Audio(); previewMusic.loop=false; previewMusic.preload="metadata";
  const answerSound = new Audio("audio/interface/answer-selected.wav"); answerSound.preload="auto";
  const wrongAnswerSound = new Audio("audio/interface/wrong-answer.mp3"); wrongAnswerSound.preload="auto";
  const voiceCue = new Audio(CUES.opening); voiceCue.preload="auto";

  const clampVolume=value=>Math.max(0,Math.min(1,Number(value)||0));
  function masterVolume(){return clampVolume(store.audioPrefs.master);}
  function musicVolume(){return clampVolume(store.audioPrefs.music);}
  function effectsVolume(){return clampVolume(store.audioPrefs.effects);}
  function connectMedia(media,gain){if(!audioContext||!gain||mediaSources.has(media))return;const source=audioContext.createMediaElementSource(media);source.connect(gain);mediaSources.set(media,source);media.volume=1;}
  function ensureAudioGraph(){const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)return;try{if(!audioContext){audioContext=new AudioContextClass();masterGain=audioContext.createGain();musicGain=audioContext.createGain();effectsGain=audioContext.createGain();voiceGain=audioContext.createGain();musicGain.connect(masterGain);effectsGain.connect(masterGain);voiceGain.connect(masterGain);masterGain.connect(audioContext.destination);connectMedia(backgroundMusic,musicGain);connectMedia(previewMusic,musicGain);connectMedia(answerSound,effectsGain);connectMedia(wrongAnswerSound,effectsGain);connectMedia(voiceCue,voiceGain);if(activeAudio)connectMedia(activeAudio,voiceGain);}if(audioContext.state==="suspended"&&!appBackgrounded)audioContext.resume().catch(()=>{});applySoundVolumes();}catch{audioContext=null;masterGain=musicGain=effectsGain=voiceGain=null;}}
  function applySoundVolumes(){const duck=musicDucked?.05:questionAudioDucked?.16:1,master=store.audioPrefs.enabled?masterVolume():0,music=musicVolume()*duck,effects=effectsVolume();document.body.dataset.masterVolume=String(masterVolume());document.body.dataset.musicVolume=String(musicVolume());document.body.dataset.effectsVolume=String(effectsVolume());document.body.dataset.effectiveMusicVolume=String(master*music);if(audioContext&&masterGain){masterGain.gain.value=master;musicGain.gain.value=music;effectsGain.gain.value=effects;voiceGain.gain.value=1;[backgroundMusic,previewMusic,answerSound,wrongAnswerSound,voiceCue,activeAudio].filter(Boolean).forEach(media=>media.volume=1);}else{backgroundMusic.volume=master*music;previewMusic.volume=master*music;answerSound.volume=master*effects;wrongAnswerSound.volume=master*effects;voiceCue.volume=master;if(activeAudio)activeAudio.volume=master;}}
  function musicSource(scene){const track=MUSIC_TRACKS.find(item=>item.id===activeProfile()?.equippedTrack);return scene==="level"&&track?track.file:(MUSIC[scene]||MUSIC.menu);}
  function setAudioScene(scene){audioScene=scene;document.body.dataset.audioScene=scene;document.body.dataset.soundEnabled=String(store.audioPrefs.enabled);if(scene==="silent"||appBackgrounded||document.hidden){backgroundMusic.pause();applySoundVolumes();return;}const source=musicSource(scene);if(backgroundMusic.getAttribute("src")!==source){backgroundMusic.src=source;backgroundMusic.load();}applySoundVolumes();if(!store.audioPrefs.enabled||!audioUnlocked){backgroundMusic.pause();return;}ensureAudioGraph();backgroundMusic.play().catch(()=>{});}
  function stopBackgroundAudio(){appBackgrounded=true;[backgroundMusic,previewMusic,answerSound,wrongAnswerSound,voiceCue,activeAudio].filter(Boolean).forEach(media=>{try{media.pause();}catch{}});window.speechSynthesis?.cancel();musicDucked=false;applySoundVolumes();audioContext?.suspend?.().catch(()=>{});if(navigator.mediaSession){navigator.mediaSession.playbackState="none";navigator.mediaSession.metadata=null;}document.body.dataset.appBackgrounded="true";}
  function restoreForegroundAudio(){appBackgrounded=false;document.body.dataset.appBackgrounded="false";if(audioScene!=="silent")setAudioScene(audioScene);}
  function previewTrack(track){if(!track||!store.audioPrefs.enabled)return toast("Turn sound on to preview music");audioUnlocked=true;ensureAudioGraph();backgroundMusic.pause();previewMusic.pause();previewMusic.src=track.file;previewMusic.currentTime=0;previewMusic.onended=()=>setAudioScene(audioScene);previewMusic.play().catch(()=>setAudioScene(audioScene));setTimeout(()=>{if(!previewMusic.paused){previewMusic.pause();setAudioScene(audioScene);}},15000);}
  function playAnswerSound(ok=true){if(!store.audioPrefs.enabled||!audioUnlocked||appBackgrounded||document.hidden)return;ensureAudioGraph();const sound=ok?answerSound:wrongAnswerSound;sound.currentTime=0;sound.play().catch(()=>{});}
  function playFormEffect(ok=true){
    playAnswerSound(ok);
    if(!ok||!store.audioPrefs.enabled||!audioUnlocked)return;
    ensureAudioGraph();
    if(!audioContext||!effectsGain)return;
    const notes={core:[520,680],ember:[220,440],frost:[880,660],volt:[330,990],cyclone:[420,560,720],prism:[523,659,784]}[activeWeapon().id]||[520,680];
    const now=audioContext.currentTime;
    notes.forEach((frequency,index)=>{
      const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();
      oscillator.type=activeWeapon().id==="volt"?"square":activeWeapon().id==="frost"?"sine":"triangle";
      oscillator.frequency.setValueAtTime(frequency,now+index*.055);
      gain.gain.setValueAtTime(.0001,now+index*.055);
      gain.gain.exponentialRampToValueAtTime(.045,now+index*.055+.018);
      gain.gain.exponentialRampToValueAtTime(.0001,now+index*.055+.2);
      oscillator.connect(gain);gain.connect(effectsGain);oscillator.start(now+index*.055);oscillator.stop(now+index*.055+.22);
    });
  }
  function duckMusic(duck=true){musicDucked=duck;applySoundVolumes();}
  function setQuestionAudioDuck(duck=false){questionAudioDucked=duck;applySoundVolumes();}
  function playVoiceCue(source){if(!store.audioPrefs.enabled||!audioUnlocked||appBackgrounded||document.hidden)return Promise.resolve(false);ensureAudioGraph();voiceCue.pause();if(voiceCue.getAttribute("src")!==source){voiceCue.src=source;voiceCue.load();}voiceCue.currentTime=0;duckMusic(true);voiceCue.onended=()=>duckMusic(false);voiceCue.onerror=()=>duckMusic(false);return voiceCue.play().then(()=>true).catch(()=>{duckMusic(false);return false;});}
  function tryOpeningCue(){if(openingPlayed||openingAttempting||!store.audioPrefs.enabled||!$("[data-screen='home']").classList.contains("active"))return;openingAttempting=true;playVoiceCue(CUES.opening).then(started=>{openingAttempting=false;if(started)openingPlayed=true;});}
  function playStartCue(){playVoiceCue(CUES.start);}
  function wireSoundControls(){const enabled=$("#soundEnabled"),volume=$("#soundVolume");enabled.checked=store.audioPrefs.enabled;volume.value=Math.round(masterVolume()*100);enabled.onchange=()=>{audioUnlocked=true;ensureAudioGraph();store.audioPrefs.enabled=enabled.checked;if(!enabled.checked){activeAudio?.pause();voiceCue.pause();window.speechSynthesis?.cancel();duckMusic(false);}save();applySoundVolumes();setAudioScene(audioScene);};volume.oninput=()=>{audioUnlocked=true;ensureAudioGraph();store.audioPrefs.master=Number(volume.value)/100;applySoundVolumes();save();syncMixerControls();if(store.audioPrefs.enabled&&backgroundMusic.paused&&audioScene!=="silent")setAudioScene(audioScene);};document.addEventListener("pointerdown",()=>{if(document.body.classList.contains("intro-active"))return;audioUnlocked=true;ensureAudioGraph();setAudioScene(audioScene);},{capture:true});}

  function refreshVoices() { availableVoices = window.speechSynthesis?.getVoices?.().filter(v => /^en([-_]|$)/i.test(v.lang)) || []; }
  refreshVoices();
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = refreshVoices;

  function speakText(text,language="") {
    if(!store.audioPrefs.enabled)return toast("Turn sound on to hear audio");
    if(appBackgrounded||document.hidden)return;
    if (activeAudio) { activeAudio.pause(); activeAudio = null; }
    if (!window.speechSynthesis) return toast("Speech is not available on this device");
    refreshVoices(); speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const matchingVoices=language?availableVoices.filter(v=>v.lang.toLowerCase().split('-')[0]===language.toLowerCase().split('-')[0]):availableVoices;
    const chosen = matchingVoices.find(v => v.voiceURI === store.voicePrefs.voiceURI) || matchingVoices.find(v => /natural|premium|enhanced/i.test(v.name)) || matchingVoices[0];
    if (chosen) utterance.voice = chosen;
    if(language)utterance.lang=language;
    const styles = {natural:{rate:.92,pitch:1},bright:{rate:.94,pitch:1.18},hero:{rate:1.04,pitch:1.06},calm:{rate:.82,pitch:.94}};
    Object.assign(utterance, styles[store.voicePrefs.style] || styles.bright);
    duckMusic(true);utterance.onend=()=>duckMusic(false);utterance.onerror=()=>duckMusic(false);speechSynthesis.speak(utterance);
  }

  function recordedAudioFor(text) {
    return window.AUDIO_PACKS?.[store.voicePrefs.source]?.spelling?.[norm(text)] || "";
  }

  function stateRecordedAudio(state, field) {
    return window.AUDIO_PACKS?.["circuit-sentinel"]?.states?.[state?.abbr]?.[field] || "";
  }

  function playPracticeAudio(text, suppliedAudio="", poemId="",language="") {
    if(!store.audioPrefs.enabled)return toast("Turn sound on to hear audio");
    if(appBackgrounded||document.hidden)return;
    const pack = window.AUDIO_PACKS?.[store.voicePrefs.source];
    const audioPath = pack ? (poemId ? pack.poems?.[poemId] || suppliedAudio : suppliedAudio||recordedAudioFor(text)) : suppliedAudio;
    if (!audioPath) { speakText(text,language); return; }
    window.speechSynthesis?.cancel();
    if (activeAudio) activeAudio.pause();
    activeAudio = new Audio(audioPath);
    ensureAudioGraph();connectMedia(activeAudio,voiceGain);applySoundVolumes();duckMusic(true);activeAudio.onended=()=>duckMusic(false);activeAudio.onerror=()=>{duckMusic(false);speakText(text,language);};activeAudio.play().catch(()=>{duckMusic(false);speakText(text,language);});
  }

  function voicePanelMarkup() {
    refreshVoices();
    const packs=Object.entries(window.AUDIO_PACKS||{}).map(([id,pack])=>`<option value="${esc(id)}" ${store.voicePrefs.source===id?'selected':''}>${esc(pack.label)} recordings</option>`).join("");
    return `<div class="panel voice-panel"><p class="label">Reading voice</p><div class="field"><label>Audio source</label><select data-audio-source>${packs}<option value="system" ${store.voicePrefs.source==='system'?'selected':''}>Device voice</option></select></div><div class="device-voice-options" ${store.voicePrefs.source==='system'?'':'hidden'}><div class="field"><label>Device voice</label><select data-voice-select><option value="">Best available voice</option>${availableVoices.map(v=>`<option value="${esc(v.voiceURI)}" ${store.voicePrefs.voiceURI===v.voiceURI?'selected':''}>${esc(v.name)} (${esc(v.lang)})</option>`).join("")}</select></div><div class="field"><label>Voice style</label><select data-voice-style><option value="bright" ${store.voicePrefs.style==='bright'?'selected':''}>Bright explorer</option><option value="hero" ${store.voicePrefs.style==='hero'?'selected':''}>Upbeat hero</option><option value="calm" ${store.voicePrefs.style==='calm'?'selected':''}>Calm storyteller</option><option value="natural" ${store.voicePrefs.style==='natural'?'selected':''}>Natural</option></select></div></div><button class="secondary" data-test-voice>Hear a sample</button><p class="helper">A recorded pack plays its matching words and poem. Other text automatically uses the selected device voice.</p></div>`;
  }
  function wireVoicePanel(root) {
    $('[data-audio-source]',root)?.addEventListener('change',e=>{store.voicePrefs.source=e.target.value;save();root.querySelector('.device-voice-options').hidden=e.target.value!=="system";});
    $('[data-voice-select]',root)?.addEventListener('change',e=>{store.voicePrefs.voiceURI=e.target.value;save();});
    $('[data-voice-style]',root)?.addEventListener('change',e=>{store.voicePrefs.style=e.target.value;save();});
    $('[data-test-voice]',root)?.addEventListener('click',()=>{const sample=window.AUDIO_PACKS?.[store.voicePrefs.source]?.sampleWord||"Ready for a learning adventure? Let's go!";playPracticeAudio(sample);});
  }
