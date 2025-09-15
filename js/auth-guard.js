import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { qs } from "./utils.js";

export function requireAuth(){
  return new Promise(resolve=>{
    onAuthStateChanged(auth, user=>{
      if(user){ resolve(user); }
      else{ location.href = "login.html"; }
    });
  });
}

export function wireTopbar(user){
  const username = localStorage.getItem("username") || user?.email?.split("@")[0] || "User";
  const elUser = qs("#welcomeUser");
  if(elUser) elUser.textContent = `Chào mừng ${username}`;
  const btnProfile = qs("#btnProfile");
  if(btnProfile) btnProfile.addEventListener("click",()=>location.href="profile.html");
  const btnLogout = qs("#btnLogout");
  if(btnLogout) btnLogout.addEventListener("click",()=>signOut(auth).then(()=>location.href="login.html"));
}
