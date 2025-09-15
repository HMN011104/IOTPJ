import { qs } from "./utils.js";

// js/ui.js (updated functions with modal support)
import { showDeviceModal, updateCurrentDevice } from "./device-modal.js";

export function renderDevices(container, devices, onToggle){
 container.innerHTML = "";
 if(!devices || devices.length===0){
   container.innerHTML = `<div class="empty">Chưa có thiết bị</div>`;
   return;
 }
 devices.forEach(dev=>{
   const wrap = document.createElement("div");
   wrap.className = "device";
   wrap.style.cssText = "display:block !important; flex-direction:column !important;";
   
   // Add click cursor style for modal
   wrap.style.cursor = "pointer";
   
   const isOn = !!dev.status;
   wrap.innerHTML = `
     <div class="row">
       <div>
         <div class="kicker">${dev.name||"Thiết bị"}</div>
         <div class="small muted">ID: ${dev.deviceId||"-"}</div>
       </div>
       <div style="display:flex; gap:8px; align-items:center;">
         <span class="status-pill ${isOn?'status-on':'status-off'}">${isOn?'Đang bật':'Đang tắt'}</span>
         <button class="btn ${isOn?'':'success'}" data-action="toggle">
           ${isOn? 'Tắt' : 'Bật'}
         </button>
         <button class="btn btn-timer">⏱ Hẹn giờ</button>
       </div>
     </div>
     <div class="timer-panel" style="display:none; margin-top:10px; width:100%; background:#f1f5f9; padding:12px; border-radius:8px; border:1px solid #e2e8f0;">
       <label style="display:inline-block; margin-right:15px;">Phút:
         <select class="sel-min" style="margin-left:5px; padding:4px;">
           ${Array.from({length:60},(_,i)=>`<option value="${i}">${i}</option>`).join("")}
         </select>
       </label>
       <label style="display:inline-block; margin-right:15px;">Giây:
         <select class="sel-sec" style="margin-left:5px; padding:4px;">
           ${Array.from({length:60},(_,i)=>`<option value="${i}">${i}</option>`).join("")}
         </select>
       </label>
       <button class="btn btn-set-timer" style="background:#16a34a; color:white;">Đặt hẹn giờ</button>
       <span class="countdown small muted" style="margin-left:10px;"></span>
     </div>
   `;
   
   // Add click handler for device modal (avoid buttons and controls)
   wrap.addEventListener("click", (e) => {
     // Don't open modal if clicking on buttons or controls
     if (e.target.closest('button') || e.target.closest('select') || e.target.closest('.timer-panel')) {
       return;
     }
     showDeviceModal(dev);
   });
   
   const toggleBtn = wrap.querySelector('[data-action="toggle"]');
   toggleBtn.addEventListener("click", (e) => {
     e.stopPropagation(); // Prevent modal from opening
     onToggle(dev, !isOn);
     
     // Update device object for modal if it's currently showing this device
     const updatedDev = { ...dev, status: !isOn, lastUpdated: new Date() };
     updateCurrentDevice(updatedDev);
   });
   
   const btnTimer   = wrap.querySelector(".btn-timer");
   const timerPanel = wrap.querySelector(".timer-panel");
   const btnSet     = wrap.querySelector(".btn-set-timer");
   const countdown  = wrap.querySelector(".countdown");
   
   btnTimer.addEventListener("click", (e) => {
     e.stopPropagation(); // Prevent modal from opening
     timerPanel.style.display = (timerPanel.style.display==="none") ? "block":"none";
   });
   
   let countdownInterval = null;
   
   btnSet.addEventListener("click", (e) => {
     e.stopPropagation(); // Prevent modal from opening
     const min = parseInt(wrap.querySelector(".sel-min").value);
     const sec = parseInt(wrap.querySelector(".sel-sec").value);
     let remaining = min*60 + sec;
     if(remaining<=0){
       alert("Vui lòng chọn thời gian > 0");
       return;
     }
     const targetState = !isOn;
     
     countdown.textContent = formatTime(remaining);
     clearInterval(countdownInterval);
     countdownInterval = setInterval(()=>{
       remaining--;
       if(remaining>0){
         countdown.textContent = formatTime(remaining);
       }else{
         clearInterval(countdownInterval);
         countdown.textContent = "";
         onToggle(dev, targetState);
         
         // Update device object for modal if it's currently showing this device
         const updatedDev = { ...dev, status: targetState, lastUpdated: new Date() };
         updateCurrentDevice(updatedDev);
       }
     },1000);
   });
   
   container.appendChild(wrap);
 });
 
 function formatTime(totalSec){
   const m = Math.floor(totalSec/60);
   const s = totalSec%60;
   return `${m}:${s.toString().padStart(2,"0")}`;
 }
}

export function renderHistory(container, items){
  container.innerHTML = "";
  if(!items || items.length===0){
    container.innerHTML = `<div class="empty">Chưa có lịch sử</div>`;
    return;
  }
  items.forEach(h=>{
    const li = document.createElement("div");
    li.className = "card";
    const time = h._fmt || "";
    const st = h.status ? "bật" : "tắt";
    li.textContent = `${h.deviceName||"Thiết bị"} đã ${st} lúc ${time}`;
    container.appendChild(li);
  });
}

export function renderNotifications(container, items){
  container.innerHTML = "";
  if(!items || items.length===0){
    container.innerHTML = `<div class="empty">Chưa có thông báo</div>`;
    return;
  }
  items.forEach(n=>{
    const li = document.createElement("div");
    li.className = "card";
    const time = n._fmt || "";
    li.textContent = `Bạn vừa đăng nhập lúc ${time}.`;
    container.appendChild(li);
  });
}
