export const qs = (sel, root=document)=>root.querySelector(sel);
export const qsa = (sel, root=document)=>[...root.querySelectorAll(sel)];

export function fmtTime(ts){
  try{
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    const mo = String(d.getMonth()+1).padStart(2,'0');
    const yyyy = d.getFullYear();
    return `${hh}:${mm} ${dd}/${mo}/${yyyy}`;
  }catch(e){ return ""; }
}

export function toast(el, msg, kind=""){
  if(!el) return;
  el.textContent = msg;
  el.className = `notice ${kind||""}`;
  el.style.display = "block";
  setTimeout(()=>{ el.style.display="none"; }, 3000);
}