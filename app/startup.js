// Startup gate, first-time onboarding and the Parent PIN gate.
// Part of the Learning Arcade app. Files in app/ share one global scope and load in the order listed in index.html.
  function wireStartupGate(){
    const gate=$("#startupGate"),button=$("#enterArcade"),status=$("#startupStatus"),message=$("#startupMessage");if(!gate||!button)return;
    if(sessionStorage.getItem(SKIP_INTRO_ONCE)==="1"){sessionStorage.removeItem(SKIP_INTRO_ONCE);document.body.classList.remove("intro-active");gate.hidden=true;setAudioScene("menu");showRequiredOnboarding();return;}
    let launchStarted=false;
    const launch=()=>{
      if(launchStarted)return;launchStarted=true;
      gate.classList.add("launching");button.disabled=true;status.textContent="INITIALIZING CENTRAL GRID";message.textContent=store.audioPrefs.enabled?"Professor Volt is opening the Learning Arcade…":"Initializing the Learning Arcade…";
      let finished=false,fallback;
      const finish=()=>{if(finished)return;finished=true;clearTimeout(fallback);openingAttempting=false;status.textContent="SYSTEMS READY";gate.classList.add("complete");setTimeout(()=>{document.body.classList.remove("intro-active");gate.hidden=true;setAudioScene("menu");showRequiredOnboarding();},420);};
      fallback=setTimeout(finish,4800);
      try{audioUnlocked=true;ensureAudioGraph();backgroundMusic.pause();audioScene="silent";openingAttempting=true;openingPlayed=true;if(store.audioPrefs.enabled){voiceCue.pause();voiceCue.src=CUES.opening;voiceCue.currentTime=0;applySoundVolumes();voiceCue.onended=finish;voiceCue.onerror=finish;const playback=voiceCue.play();if(playback&&typeof playback.catch==="function")playback.catch(()=>setTimeout(finish,900));}else setTimeout(finish,1200);}catch{setTimeout(finish,300);}
    };
    button.addEventListener("click",launch);
    if(window.__arcadeEnterRequested)setTimeout(launch,0);
  }

  function showRequiredOnboarding(){
    if(store.onboardingVersion>=1)return;
    const gate=$("#onboardingGate"),choice=$("#onboardingProfileChoice"),name=$("#onboardingChildName");if(!gate)return;
    choice.innerHTML=store.profiles.map(profile=>`<option value="${esc(profile.id)}" ${profile.id===store.activeProfileId?'selected':''}>Keep ${esc(profile.name)} and saved progress</option>`).join("")+`<option value="new">Create a fresh child profile</option>`;
    name.value=activeProfile().name==="Player 1"?"":activeProfile().name;gate.hidden=false;document.body.classList.add("onboarding-active");
  }

  function wireOnboarding(){
    const pinStep=$("#onboardingPinStep"),profileStep=$("#onboardingProfileStep"),choice=$("#onboardingProfileChoice"),name=$("#onboardingChildName");if(!pinStep||!profileStep)return;
    const showStep=step=>{pinStep.hidden=step!==1;profileStep.hidden=step!==2;$$('[data-onboarding-dot]').forEach(dot=>dot.classList.toggle('active',+dot.dataset.onboardingDot<=step));};
    pinStep.onsubmit=event=>{event.preventDefault();const pin=$("#onboardingPin").value.trim(),confirmation=$("#onboardingPinConfirm").value.trim();if(!/^\d{4,8}$/.test(pin))return toast("Use a 4–8 digit PIN");if(pin!==confirmation)return toast("The PINs do not match");pendingOnboardingPin=pinHash(pin);showStep(2);setTimeout(()=>name.focus(),80);};
    choice.onchange=()=>{const profile=store.profiles.find(item=>item.id===choice.value);name.value=profile&&profile.name!=="Player 1"?profile.name:"";};
    $("#onboardingBack").onclick=()=>showStep(1);
    profileStep.onsubmit=event=>{event.preventDefault();const childName=name.value.trim();if(!childName)return toast("Enter the child's display name");let profile;if(choice.value==="new"){profile=createProfile(childName);store.profiles.push(profile);}else{profile=store.profiles.find(item=>item.id===choice.value)||activeProfile();profile.name=childName;}store.activeProfileId=profile.id;store.parentControls.pinHash=pendingOnboardingPin;store.onboardingVersion=1;pendingOnboardingPin="";parentUnlocked=false;homeMode="student";syncActiveProfile();applyEquippedTheme();save();$("#onboardingGate").hidden=true;document.body.classList.remove("onboarding-active");renderHome();toast("Parent Portal and Student Arcade are ready");};
  }

  function requestParentAccess(callback,always=false){
    if(!store.parentControls.pinHash){showRequiredOnboarding();return;}
    if(parentUnlocked&&!always){callback();return;}
    pendingParentAction=callback;const gate=$("#parentPinGate"),entry=$("#parentPinEntry"),error=$("#parentPinError");error.textContent="";entry.value="";gate.hidden=false;document.body.classList.add("pin-active");setTimeout(()=>entry.focus(),80);
  }

  function wireParentPinGate(){
    const gate=$("#parentPinGate"),form=$("#parentPinForm"),entry=$("#parentPinEntry"),error=$("#parentPinError");if(!gate||!form)return;
    const close=()=>{gate.hidden=true;document.body.classList.remove("pin-active");pendingParentAction=null;};
    $("#parentPinCancel").onclick=close;
    form.onsubmit=event=>{event.preventDefault();if(pinHash(entry.value.trim())!==store.parentControls.pinHash){error.textContent="That PIN was not correct. Try again.";entry.select();return;}parentUnlocked=true;const action=pendingParentAction;gate.hidden=true;document.body.classList.remove("pin-active");pendingParentAction=null;action?.();};
  }

  function pinHash(value=""){let hash=2166136261;for(const char of String(value)){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(36);}
  function ensureParentAccess(always=false){if(!store.parentControls.pinHash){toast("Complete Parent Portal setup first");return false;}if(parentUnlocked&&!always)return true;const entered=prompt("Enter the parent PIN");if(entered===null)return false;if(pinHash(entered)===store.parentControls.pinHash){parentUnlocked=true;return true;}toast("That PIN was not correct");return false;}
