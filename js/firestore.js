import { db } from "./firebase-config.js";
import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp,
  collection, query, where, orderBy, limit, onSnapshot, addDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

export async function ensureUserDoc(user, username){
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if(!snap.exists()){
    await setDoc(ref, {
      username: username || (user.email?.split("@")[0]) || "user",
      email: user.email || "",
      circuitId: "",
      createdAt: serverTimestamp(),
      userId: user.uid
    });
  }
}

export async function getUserDoc(uid){
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function updateCircuitId(uid, circuitId){
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { circuitId });
}

export function listenDevicesByCircuit(circuitId, cb){
  if(!circuitId) return ()=>{};
  const q = query(
    collection(db,"devices"),
    where("circuitId","==", circuitId),
    orderBy("name","asc")
  );
  return onSnapshot(q, snap=>{
    const list = [];
    snap.forEach(d=> list.push({ id:d.id, ...d.data() }));
    cb(list);
  });
}

export async function toggleDevice(deviceDocId, newStatus){
  const ref = doc(db,"devices", deviceDocId);
  await updateDoc(ref, {
    status: newStatus,
    lastUpdated: serverTimestamp()
  });
}

export async function addHistory(device){
  await addDoc(collection(db,"history"), {
    deviceId: device.deviceId,
    deviceName: device.name,
    status: device.status,
    timestamp: serverTimestamp()
  });
}

export function listenHistoryByCircuit(circuitId, cb){
  if(!circuitId) return ()=>{};
  const q = query(
    collection(db,"history"),
    where("deviceId","in", []), 
  );
  return ()=>{}; 
}

export async function addHistoryWithCircuit(device, circuitId){
  await addDoc(collection(db,"history"), {
    deviceId: device.deviceId,
    deviceName: device.name,
    status: device.status,
    circuitId,
    timestamp: serverTimestamp()
  });
}

export function listenHistoryByCircuit2(circuitId, cb){
  if(!circuitId) return ()=>{};
  const q = query(
    collection(db,"history"),
    where("circuitId","==", circuitId),
    orderBy("timestamp","desc"),
    limit(10)
  );
  return onSnapshot(q, snap=>{
    const list = [];
    snap.forEach(d=> list.push({ id:d.id, ...d.data() }));
    cb(list);
  });
}

export async function addLoginNotification(userId){
  await addDoc(collection(db,"notifications"), {
    userId,
    timestamp: serverTimestamp()
  });
}

export function listenNotifications(userId, cb){
  const q2 = query(
    collection(db,"notifications"),
    where("userId","==", userId),
    orderBy("timestamp","desc"),
    limit(5)
  );
  return onSnapshot(q2, snap=>{
    const list = [];
    snap.forEach(d=> list.push({ id:d.id, ...d.data() }));
    cb(list);
  });
}
