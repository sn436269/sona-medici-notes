// Firebase is loaded only after a valid public project configuration exists.
export async function connectCloud(config, callbacks) {
  const base='https://www.gstatic.com/firebasejs/12.4.0/';
  const [appSdk,authSdk,dbSdk]=await Promise.all(['firebase-app.js','firebase-auth.js','firebase-firestore.js'].map(f=>import(base+f)));
  const app=appSdk.initializeApp(config), auth=authSdk.getAuth(app), db=dbSdk.getFirestore(app);
  await authSdk.setPersistence(auth,authSdk.browserLocalPersistence);
  let unsubscribe=null;
  authSdk.onAuthStateChanged(auth,async user=>{
    unsubscribe?.();unsubscribe=null;
    await callbacks.auth(user?{uid:user.uid,email:user.email}:null);
    if(user)unsubscribe=dbSdk.onSnapshot(dbSdk.collection(db,'users',user.uid,'events'),snapshot=>callbacks.events(snapshot.docs.map(d=>d.data())),error=>callbacks.error(error));
  });
  return {
    login:(email,password)=>authSdk.signInWithEmailAndPassword(auth,email,password),
    logout:()=>authSdk.signOut(auth),
    reset:email=>authSdk.sendPasswordResetEmail(auth,email),
    async push(event){
      if(!auth.currentUser)throw Error('請先登入雲端帳號。');
      const uid=auth.currentUser.uid, eventRef=dbSdk.doc(db,'users',uid,'events',event.id), walletRef=dbSdk.doc(db,'users',uid,'private','wallet');
      return dbSdk.runTransaction(db,async transaction=>{
        const [existing,wallet]=await Promise.all([transaction.get(eventRef),transaction.get(walletRef)]);
        if(existing.exists())return;
        const amount=wallet.exists()?wallet.data().balance:0;
        const delta=event.type==='attempt'?window.StudyCore.award(event.payload.correct,event.payload.items.length):event.type==='redeem'?-event.payload.amount:0;
        if(amount+delta<0)throw Error('雲端點數不足，請先同步最新紀錄。');
        transaction.set(eventRef,event);
        if(delta!==0||!wallet.exists())transaction.set(walletRef,{balance:amount+delta,updatedAt:dbSdk.serverTimestamp()});
      });
    }
  };
}
