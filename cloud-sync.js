const config=window.LEARNING_ARCADE_FIREBASE;
const bridge=window.LearningArcadeDataBridge;
const listeners=new Set();
const status={configured:!!(config?.apiKey&&config?.projectId&&config?.authDomain),phase:config?"loading":"unconfigured",email:"",message:config?"Connecting…":"One-time Firebase setup required",lastSyncedAt:0,pending:false};
let auth,db,user,api,pushTimer,pushing=false,pushAgain=false,unsubscribe;
const META="learning-arcade-cloud-meta-v1";
const readMeta=()=>{try{return JSON.parse(localStorage.getItem(META)||"{}");}catch{return {};}};
const writeMeta=value=>localStorage.setItem(META,JSON.stringify(value));
const emit=()=>{const snapshot={...status};listeners.forEach(listener=>listener(snapshot));window.dispatchEvent(new CustomEvent("learning-arcade-cloud-state",{detail:snapshot}));};
const cloudMillis=value=>typeof value?.toMillis==="function"?value.toMillis():Number(value)||0;
// Firestore rejects nested arrays in diagram rows and answer arrangements.
// Store the complete save as a JSON string, while still reading version-one object saves.
const MAX_SAVE_BYTES=1000000;
function encodeCloudData(data){const text=JSON.stringify(data);if(new TextEncoder().encode(text).length>MAX_SAVE_BYTES){const error=new Error("Save exceeds the safe single-document limit");error.code="save-too-large";throw error;}return text;}
function decodeCloudData(record){if(!record||![1,2].includes(record.version??1))throw new Error("Unsupported cloud save version");const data=typeof record.data==="string"?JSON.parse(record.data):record.data;if(!data||typeof data!=="object"||!Array.isArray(data.profiles)||!data.profiles.length)throw new Error("Invalid cloud save");return data;}
function syncErrorMessage(error){if(!navigator.onLine)return "Offline — changes are safe on this device";const code=String(error?.code||"").replace(/^firestore\//,"");if(code==="save-too-large")return "Cloud save is too large. Download a local backup; your local data is unchanged.";if(code==="permission-denied"||code==="unauthenticated")return "Cloud save access was denied. Download a backup, then check your sign-in and Firebase rules.";if(code==="resource-exhausted")return "Firebase's cloud-save limit was reached. Your local data is safe; try again later.";if(code==="unavailable"||code==="deadline-exceeded")return "Cloud save could not connect. Your local data is safe; try again shortly.";const safeCode=/^[a-z0-9_-]{1,60}$/i.test(code)?` (${code})`:"";return `Cloud save could not update${safeCode}. Your local data is safe.`;}
async function loadFirebase(){
  if(api)return api;
  const [core,authApi,firestore]=await Promise.all([
    import("https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js")
  ]);
  const app=core.getApps().length?core.getApps()[0]:core.initializeApp(config);
  auth=authApi.getAuth(app);db=firestore.getFirestore(app);api={...authApi,...firestore};return api;
}
function cloudDocument(uid=user?.uid){return api.doc(db,"learningArcadeSaves",uid);}
function reportSyncError(error){status.phase="error";status.pending=true;status.message=syncErrorMessage(error);emit();}
async function upload(){
  if(!user||!bridge||pushing)return;
  pushing=true;status.phase="syncing";status.message="Uploading this device…";status.pending=false;emit();
  try{
    const payload=encodeCloudData(bridge.exportData());
    await api.setDoc(cloudDocument(),{format:"circuit-sentinel-learning-arcade",version:2,dataEncoding:"json",data:payload,updatedAt:api.serverTimestamp(),updatedBy:bridge.deviceId()});
    const saved=await api.getDoc(cloudDocument()),updatedAt=cloudMillis(saved.data()?.updatedAt)||Date.now();writeMeta({uid:user.uid,lastSyncedAt:updatedAt});bridge.markSynced(updatedAt);status.lastSyncedAt=updatedAt;status.phase="ready";status.message="Cloud save is current";
  }catch(error){status.phase="error";status.pending=true;status.message=syncErrorMessage(error);}
  finally{pushing=false;emit();if(pushAgain){pushAgain=false;schedulePush();}}
}
function schedulePush(){if(!user||status.phase==="loading"||status.phase==="pulling")return;if(pushing){pushAgain=true;return;}status.pending=true;clearTimeout(pushTimer);pushTimer=setTimeout(upload,1400);emit();}
async function applyCloud(snapshot){
  const record=snapshot.data(),updatedAt=cloudMillis(record?.updatedAt)||Date.now();if(!record?.data)return;
  const data=decodeCloudData(record);
  status.phase="pulling";status.message="Loading cloud save…";emit();bridge.importData(data);writeMeta({uid:user.uid,lastSyncedAt:updatedAt});bridge.markSynced(updatedAt);
}
function acknowledgeOwnSnapshot(snapshot){
  const record=snapshot.data();
  if(record?.updatedBy!==bridge.deviceId())return false;
  const updatedAt=cloudMillis(record?.updatedAt);if(!updatedAt)return true;
  const meta=readMeta(),lastSynced=meta.uid===user?.uid?Number(meta.lastSyncedAt)||0:0;
  if(updatedAt>lastSynced){writeMeta({uid:user.uid,lastSyncedAt:updatedAt});bridge.markSynced(updatedAt);}
  status.lastSyncedAt=Math.max(Number(status.lastSyncedAt)||0,updatedAt);status.pending=false;
  if(status.phase!=="syncing"){status.phase="ready";status.message="Cloud save is current";emit();}
  return true;
}
async function reconcile(){
  const snapshot=await api.getDoc(cloudDocument()),meta=readMeta(),localChanged=bridge.changedAt();
  if(!snapshot.exists()){await upload();return;}
  const cloudUpdated=cloudMillis(snapshot.data()?.updatedAt),lastSynced=meta.uid===user.uid?Number(meta.lastSyncedAt)||0:0;
  if(!lastSynced||cloudUpdated>lastSynced){await applyCloud(snapshot);return;}
  status.lastSyncedAt=cloudUpdated;if(localChanged>lastSynced){await upload();return;}
  status.phase="ready";status.message="Cloud save is current";emit();
}
async function initialize(){
  if(!status.configured||!bridge){emit();return;}
try{await loadFirebase();api.setPersistence(auth,api.browserLocalPersistence).catch(()=>{});api.onAuthStateChanged(auth,async current=>{unsubscribe?.();user=current;status.email=current?.email||"";if(!current){status.phase="signed-out";status.message="Sign in to synchronize devices";emit();return;}status.phase="loading";status.message="Checking cloud save…";emit();try{await reconcile();unsubscribe=api.onSnapshot(cloudDocument(),snapshot=>{if(!snapshot.exists()||pushing)return;if(acknowledgeOwnSnapshot(snapshot))return;const remote=cloudMillis(snapshot.data()?.updatedAt),meta=readMeta();if(remote>(Number(meta.lastSyncedAt)||0)&&bridge.changedAt()<=(Number(meta.lastSyncedAt)||0))applyCloud(snapshot).catch(reportSyncError);},reportSyncError);}catch(error){reportSyncError(error);}});}catch(error){reportSyncError(error);}
}
async function createAccount(email,password){await loadFirebase();status.phase="loading";status.message="Creating cloud account…";emit();await api.createUserWithEmailAndPassword(auth,email,password);}
async function signIn(email,password){await loadFirebase();status.phase="loading";status.message="Signing in…";emit();await api.signInWithEmailAndPassword(auth,email,password);}
async function signOut(){clearTimeout(pushTimer);await api.signOut(auth);user=null;status.email="";status.phase="signed-out";status.message="Signed out; local saving continues";emit();}
async function pull(){if(!user)return;const snapshot=await api.getDoc(cloudDocument());if(snapshot.exists())await applyCloud(snapshot);}
async function resetAll(){clearTimeout(pushTimer);if(user){status.phase="syncing";status.message="Resetting Cloud Save…";emit();const fresh=bridge.freshData();await api.setDoc(cloudDocument(),{format:"circuit-sentinel-learning-arcade",version:2,dataEncoding:"json",data:encodeCloudData(fresh),resetAt:api.serverTimestamp(),updatedAt:api.serverTimestamp(),updatedBy:bridge.deviceId()});await api.signOut(auth);}unsubscribe?.();localStorage.removeItem(META);bridge.clearLocalData();}
window.LearningArcadeCloud={state:()=>({...status}),subscribe(listener){listeners.add(listener);listener({...status});return()=>listeners.delete(listener);},createAccount,signIn,signOut,push:upload,pull,resetAll,schedulePush};
emit();initialize();window.addEventListener("online",()=>{if(status.pending)schedulePush();});
