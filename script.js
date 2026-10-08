const $=id=>document.getElementById(id), D=new Date(W.weddingDate);
const first=n=>n.split(" ")[0];
$("gn").textContent=first(W.groom.name);$("bn").textContent=first(W.bride.name);
$("hash").textContent=W.hashtag;$("dt").textContent=W.dateText;
$("with").textContent="With Love, "+W.family;
$("ct").outerHTML="<div id='ct'>"+W.contacts.map(c=>`<div class="ct"><span>${c.name}</span>${c.phone?`<a href="tel:${c.phone}">${c.phone}</a>`:""}</div>`).join("")+"</div>";
$("tl").innerHTML=W.events.map((e,i)=>`<li class="rv"><div class="row"><h3 class="en" style="margin:0">${e.name}</h3><span>${e.time}</span></div>
<div class="row d"><span>${e.date}</span><span>${e.day}</span></div><p class="pl">${e.place}</p>
<div class="btns"><a href="${e.map}" target="_blank" rel="noopener">Get Directions</a><button data-i="${i}" aria-haspopup="dialog">Event Details</button></div></li>`).join("");
const dlg=$("dlg");
$("tl").addEventListener("click",ev=>{const b=ev.target.closest("button");if(!b)return;const e=W.events[b.dataset.i];
$("dn").textContent=e.name;$("dw").textContent=e.date+" · "+e.day;$("dtm").textContent=e.time;$("dp").textContent=e.place;
$("dnote").textContent=e.note||"";$("dmap").href=e.map;dlg.showModal()});
$("dx").addEventListener("click",()=>dlg.close());
dlg.addEventListener("click",ev=>{if(ev.target===dlg)dlg.close()});
function tick(){const s=Math.max(0,Math.floor((D-Date.now())/1e3)),p=n=>String(n).padStart(2,"0");
$("boxes").innerHTML=[["Days",Math.floor(s/86400)],["Hours",Math.floor(s%86400/3600)],["Minutes",Math.floor(s%3600/60)],["Seconds",s%60]].map(([l,n])=>`<div><b>${p(n)}</b><small>${l}</small></div>`).join("")}
tick();setInterval(tick,1e3);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.15});
const snd=$("snd");let on=false,synth=null,file=null;
if(W.music){file=new Audio(W.music);file.loop=true;file.volume=.6;file.addEventListener("error",()=>{file=null;if(on)startSynth()})}
function startSynth(){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
if(synth){synth.ctx.resume();return}
const ctx=new C(),out=ctx.createGain();out.gain.value=.25;out.connect(ctx.destination);
const sc=[293.66,329.63,369.99,440,493.88,587.33,659.25];
const note=(f,t,d,v)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type="sine";o.frequency.value=f;
g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(out);o.start(t);o.stop(t+d)};
const dr=ctx.createOscillator(),dg=ctx.createGain();dr.frequency.value=146.83;dg.gain.value=.12;dr.connect(dg);dg.connect(out);dr.start();
let i=0;const run=()=>{const t=ctx.currentTime+.05;note(sc[[0,2,4,2,5,4,2,1][i%8]],t,2.2,.35);if(i%4===0)note(sc[0]/2,t,3,.3);i++};
run();synth={ctx,id:setInterval(run,650)}}
function play(){on=true;snd.classList.remove("off");snd.setAttribute("aria-pressed","true");
if(file)file.play().catch(()=>{});else startSynth()}
function stop(){on=false;snd.classList.add("off");snd.setAttribute("aria-pressed","false");
if(file)file.pause();if(synth)synth.ctx.suspend()}
snd.addEventListener("click",()=>on?stop():play());
const env=$("env");
function open(){if(env.classList.contains("open"))return;env.classList.add("open");document.body.classList.remove("locked");snd.hidden=false;play();
document.querySelectorAll(".rv").forEach(el=>io.observe(el));setTimeout(()=>env.classList.add("gone"),2200)}
env.addEventListener("click",open);env.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")open()});
