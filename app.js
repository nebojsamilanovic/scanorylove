/* Moonlit Love Story — final experience preview. Data is injected through the
   normalized SCANORY_STORY object, never embedded in layout templates. Customer
   information and locked letters require a private production backend. */
(() => {
'use strict';
const demo=window.SCANORY_STORY||{}, $=id=>document.getElementById(id);
const story=structuredClone(demo);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const smooth=()=>reduce?'instant':'smooth';
const set=(id,value)=>{if($(id)&&value!==undefined&&value!==null)$(id).textContent=String(value)};
const enabled=(key)=>story.enabled?.[key]!==false;
function sanitizeURL(u){try{const o=new URL(u,location.href);return ['https:','http:','blob:'].includes(o.protocol)?o.href:''}catch{return ''}}
function dateLabel(value){if(!value)return 'A DAY TO REMEMBER';const m=String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);if(!m)return 'A DAY TO REMEMBER';const d=new Date(Date.UTC(+m[1],+m[2]-1,+m[3]));return Number.isFinite(d.getTime())?new Intl.DateTimeFormat('en',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(d).toUpperCase():'A DAY TO REMEMBER'}
let scroller=()=>{};
function setStory(s){Object.assign(story,s);render()}
window.ScanoryPreview={update:s=>{if(s&&typeof s==='object')setStory(s)},getData:()=>structuredClone(story)};
function applyFeatureFlags(){
 document.querySelectorAll('[data-section]').forEach(el=>{const key=el.dataset.section;if(key==='surprises'||key==='intro')return;el.hidden=!enabled(key)});
 $('opening').classList.toggle('intro-minimal',!enabled('intro')); // The access gate stays available even when intro content is switched off.
 const halves=$('surprises');if(halves)halves.hidden=!enabled('surprises')||(!enabled('scratch')&&!enabled('song'));
 for(const key of ['scratch','song']){const el=document.querySelector(`[data-section="${key}"]`);if(el)el.hidden=!enabled(key)}
 for(const key of ['timeline','gallery','reasons']){if(!story[key]?.length){const el=document.querySelector(`[data-section="${key}"]`);if(el)el.hidden=true}}
 document.querySelectorAll('.act-rule').forEach(rule=>{let next=rule.nextElementSibling,any=false;while(next&&!next.classList.contains('act-rule')){if(next.matches('[data-section]')&&!next.hidden)any=true;else if(next.querySelector('[data-section]:not([hidden])'))any=true;next=next.nextElementSibling}rule.hidden=!any});
}
function calendarMonths(start, now){const sy=start.getUTCFullYear(),sm=start.getUTCMonth(),sd=start.getUTCDate();function anchor(n){const m=sm+n,y=sy+Math.floor(m/12),mm=((m%12)+12)%12;const end=new Date(Date.UTC(y,mm+1,0)).getUTCDate();return Date.UTC(y,mm,Math.min(sd,end),start.getUTCHours(),start.getUTCMinutes(),start.getUTCSeconds())}let n=Math.max(0,(now.getUTCFullYear()-sy)*12+now.getUTCMonth()-sm);while(anchor(n)>now.getTime())n--;while(anchor(n+1)<=now.getTime())n++;return {months:n,anchor:anchor(n)}}
let timer=null;function startClock(){clearInterval(timer);const d=new Date(story.origin?.dateTime||story.origin?.date||'');if(!Number.isFinite(d.getTime())){for(const id of ['years','months','days','hours','minutes','seconds'])set(id+'-count','—');return}
 const offMatch=String(story.origin?.dateTime||'').match(/([+-])(\d{2}):(\d{2})$/);const offset=offMatch?(offMatch[1]==='-'?-1:1)*(Number(offMatch[2])*60+Number(offMatch[3]))*60000:0;const localStart=new Date(d.getTime()+offset);
 function tick(){const now=new Date();if(now<d){for(const id of ['years','months','days','hours','minutes','seconds'])set(id+'-count','00');return}const m=calendarMonths(localStart,new Date(now.getTime()+offset)),delta=Math.max(0,now.getTime()+offset-m.anchor);const days=Math.floor(delta/86400000),hours=Math.floor(delta%86400000/3600000),minutes=Math.floor(delta%3600000/60000),seconds=Math.floor(delta%60000/1000);const units={years:Math.floor(m.months/12),months:m.months%12,days,hours,minutes,seconds};for(const [name,n] of Object.entries(units))set(name+'-count',String(n).padStart(2,'0'))}
 tick();timer=setInterval(tick,1000);
}
function renderTimeline(){const host=$('timeline-list');host.replaceChildren();const rail=document.createElement('div');rail.className='timeline-trail';rail.setAttribute('aria-hidden','true');const fill=document.createElement('div');fill.className='timeline-trail-progress';fill.id='timeline-trail-progress';rail.append(fill);host.append(rail);for(const entry of story.timeline||[]){const item=document.createElement('article');item.className='timeline-item timeline-hidden';const date=document.createElement('span');date.className='timeline-date';date.textContent=entry.date||'';const content=document.createElement('div');const title=document.createElement('h3');title.className='timeline-title';title.textContent=entry.title||'';const text=document.createElement('p');text.className='timeline-text';text.textContent=entry.description||'';content.append(title,text);
 // Keep moments easy to consume: original description is the content; no nested bonus CTA.
 item.append(date,content);host.append(item)}}
let dialogEntry=null;function renderGallery(){const host=$('gallery-rail');host.replaceChildren();(story.gallery||[]).forEach((entry,i)=>{const b=document.createElement('button');b.className='gallery-card';b.type='button';b.setAttribute('aria-label',`Open photograph ${i+1}: ${entry.caption||'Our memory'}`);const image=document.createElement('span');image.className='gallery-photo';if(entry.src)image.style.backgroundImage=`url(${JSON.stringify(sanitizeURL(entry.src))})`;const foot=document.createElement('span');foot.className='gallery-number';const num=document.createElement('span');num.textContent=`${String(i+1).padStart(2,'0')} / ${String(story.gallery.length).padStart(2,'0')}`;const caption=document.createElement('span');caption.textContent=entry.caption||'OUR MEMORY';foot.append(num,caption);b.append(image,foot);b.onclick=()=>{dialogEntry=entry;const photo=$('dialog-photo');photo.style.backgroundImage=entry.src?`url(${JSON.stringify(sanitizeURL(entry.src))})`:'none';set('photo-dialog-title',entry.caption||'OUR MEMORY');$('gallery-bonus-control').hidden=!entry.bonus;$('gallery-bonus-message').hidden=true;$('gallery-bonus-control').setAttribute('aria-expanded','false');$('gallery-bonus-message').textContent=entry.bonus||'';$('photo-dialog').showModal()};host.append(b)})}
function renderReasons(){const host=$('things-grid');host.replaceChildren();(story.reasons||[]).forEach((entry,i)=>{const b=document.createElement('button');b.type='button';b.className='thing-button reveal in-view';b.setAttribute('aria-expanded','false');b.setAttribute('aria-label',`Discover message ${i+1}: ${entry.hint||'A little secret'}`);const index=document.createElement('span');index.className='thing-number';index.textContent=String(i+1).padStart(2,'0');const hint=document.createElement('span');hint.className='thing-prompt';hint.textContent=entry.hint||'A LITTLE SECRET';const action=document.createElement('span');action.className='thing-hint';action.textContent='OPEN TO DISCOVER';const body=document.createElement('span');body.className='thing-reveal';body.hidden=true;const title=document.createElement('strong');title.className='thing-reveal-title';title.textContent=entry.title||'';const detail=document.createElement('span');detail.textContent=entry.text||'';body.append(title,detail);b.append(index,hint,action,body);b.onclick=()=>{const open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));body.hidden=!open;action.textContent=open?'CLOSE THE NOTE':'OPEN TO DISCOVER'};host.append(b)})}
function renderLetter(){const host=$('letter-status');host.replaceChildren();const allowed=story.letter?.state==='unlocked'&&!!story.letter?.message;
 if(!allowed){const e=document.createElement('p');e.className='letter-date';e.textContent=story.letter?.unlockLabel||'A DAY STILL TO COME';host.append(e);return}
 const b=document.createElement('button');b.type='button';b.id='letter-envelope-control';b.className='letter-stage';b.setAttribute('aria-label','Open your personal letter');b.setAttribute('aria-expanded','false');const sheet=document.createElement('span');sheet.className='letter-sheet';const sheetText=document.createElement('span');sheetText.className='letter-sheet-text';sheetText.textContent=story.letter.message;sheet.append(sheetText);const back=document.createElement('span');back.className='letter-pocket-back';const front=document.createElement('span');front.className='letter-pocket-front';const flap=document.createElement('span');flap.className='letter-flap';const seal=document.createElement('span');seal.className='letter-stamp';seal.textContent='S';const label=document.createElement('span');label.className='letter-instruction';label.textContent='TAP TO OPEN THE LETTER';b.append(back,sheet,front,flap,seal,label);b.onclick=()=>{const open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));b.classList.toggle('opened',open);b.setAttribute('aria-label',open?'Close your personal letter':'Open your personal letter');label.textContent=open?'TAP TO CLOSE THE LETTER':'TAP TO OPEN THE LETTER'};host.append(b)
}
let audio=null;function renderSong(){const host=$('soundtrack-control');host.replaceChildren();audio?.pause();audio=null;const src=sanitizeURL(story.song?.url||'');if(!src){const msg=document.createElement('p');msg.className='audio-awaiting';msg.textContent=story.song?.title||'Our song';host.append(msg);return}const b=document.createElement('button');b.className='audio-control';b.type='button';b.textContent='Play';b.setAttribute('aria-label','Play the chosen song');audio=document.createElement('audio');audio.preload='none';audio.src=src;b.onclick=async()=>{if(audio.paused){try{await audio.play()}catch{b.textContent='Unavailable';b.setAttribute('aria-label','Audio unavailable')}}else audio.pause()};audio.onplay=()=>{b.textContent='Pause';b.setAttribute('aria-label','Pause the chosen song')};audio.onpause=()=>{b.textContent='Play';b.setAttribute('aria-label','Play the chosen song')};audio.onended=()=>{b.textContent='Play';b.setAttribute('aria-label','Replay the song')};host.append(b,audio)}
function updateEditorialCopy(){for(const [id,raw] of Object.entries(story.copy||{})){const el=$(id);if(!el||typeof raw!=='string'||!raw.trim())continue;
   // Safe emphasis parsing: plain text plus optional *italic* spans only.
   const parts=raw.split(/(\*[^*]+\*)/g);el.replaceChildren(...parts.filter(Boolean).map(part=>{if(part.startsWith('*')&&part.endsWith('*')){const em=document.createElement('em');em.textContent=part.slice(1,-1);return em}return document.createTextNode(part)}))}}
function render(){updateEditorialCopy();set('recipient-name',`${story.recipient||'You'}.`);set('intro-signature',`WITH LOVE, ${(story.sender||'SOMEONE SPECIAL').toUpperCase()}`);set('origin-title',story.origin?.title);set('origin-description',story.origin?.description);set('origin-caption',story.origin?.caption);set('beginning-intro',story.origin?.intro);set('origin-date-label',dateLabel(story.origin?.dateTime||story.origin?.date));set('touch-message',story.memoryNote);set('promise-quote',`“${story.promise||''}”`);set('final-note',story.finale?.note);set('final-signature',`With love, ${story.sender||'me'}`);set('scratch-after-note',story.secretPhoto?.note||'');
 const origin=$('.origin-picture');if(story.originImage){const safe=sanitizeURL(story.originImage);if(safe)document.querySelector('.origin-picture').style.backgroundImage=`linear-gradient(180deg,rgba(25,23,20,.06),rgba(25,23,20,.52)),url(${JSON.stringify(safe)})`}
 const mem=$('memory-photo');if(mem&&story.memoryImage)mem.style.backgroundImage=`linear-gradient(180deg,transparent 65%,rgba(15,12,10,.48)),url(${JSON.stringify(sanitizeURL(story.memoryImage))})`;
 const scratch=$('scratch-image-underlay');if(scratch&&story.secretPhoto?.image)scratch.style.backgroundImage=`url(${JSON.stringify(sanitizeURL(story.secretPhoto.image))})`;
 renderTimeline();renderGallery();renderReasons();renderLetter();renderSong();applyFeatureFlags();startClock();setupScratch();promiseRevealed=false;$('promise-quote').hidden=true;$('promise-quote').classList.remove('promise-written');$('promise-shake').hidden=false;$('promise-reveal').hidden=false;requestAnimationFrame(updateTimelineProgress)}
// Kept gated on EVERY visit, exactly one way into the experience.
const experience=$('experience'),startButton=$('begin-story'),portal=$('portal-transition');let opening=false;
function enterStory(){
 if(opening)return;opening=true;startButton.disabled=true;portal.hidden=false;
 portal.classList.remove('is-entering','is-leaving');void portal.offsetWidth;
 portal.classList.add('is-entering');
 const first=reduce?90:1050, exit=reduce?90:650;
 setTimeout(()=>{
  experience.hidden=false;document.body.classList.remove('story-gated');
  startButton.setAttribute('aria-expanded','true');document.documentElement.classList.add('story-entered');
  window.scrollTo({top:0,behavior:'instant'});
  $('beginning').scrollIntoView({block:'start',behavior:'instant'});
  observeReveals();updateTimelineProgress();
  // The story appears UNDER the departing veil instead of a hard overlay removal.
  portal.classList.add('is-leaving');
  setTimeout(()=>{portal.hidden=true;portal.classList.remove('is-entering','is-leaving');opening=false;startButton.disabled=false},exit);
 },first);
}
startButton.addEventListener('click',enterStory);
const homeLink=document.querySelector('.brand');homeLink.addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:smooth()})});$('return-beginning').addEventListener('click',()=>window.scrollTo({top:0,behavior:smooth()}));
$('memory-reveal').addEventListener('click',()=>{const b=$('memory-reveal'),open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));$('memory-photo').classList.toggle('turned',open);$('memory-secret').setAttribute('aria-hidden',String(!open));b.innerHTML=open?'Turn this memory back <span aria-hidden="true"></span>':'Turn this memory over <span aria-hidden="true"></span>'});
// Dust reveal: only the explicit Reveal button triggers the gentle fall-away effect.
// The canvas is visual only; there are no swipe, touch, pointer or 90% completion handlers.
let scratchState={finished:false,resize:null,raf:0};
function setupScratch(){
 const canvas=$('scratch-canvas'),host=$('scratch-photo'),under=$('scratch-image-underlay'),button=$('scratch-reveal'),label=$('scratch-overlay');
 if(!canvas||!host)return;
 if(scratchState.resize)window.removeEventListener('resize',scratchState.resize);
 cancelAnimationFrame(scratchState.raf);
 scratchState={finished:false,resize:null,raf:0};
 const ctx=canvas.getContext('2d');
 canvas.hidden=false;canvas.classList.remove('dust-releasing');
 label.classList.remove('revealed');
 under.style.filter='blur(18px)';
 $('scratch-after-note').hidden=true;
 button.textContent='Reveal';button.disabled=false;button.setAttribute('aria-expanded','false');
 function paintDust(){
  if(scratchState.finished)return;
  const r=host.getBoundingClientRect();if(!r.width||!r.height)return;
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.fillStyle='#c7b59c';ctx.fillRect(0,0,r.width,r.height);
  ctx.fillStyle='rgba(242,235,221,.15)';
  for(let i=0;i<190;i++)ctx.fillRect((i*97)%r.width,(i*43)%r.height,1.5,1.5);
 }
 scratchState.raf=requestAnimationFrame(paintDust);
 scratchState.resize=()=>{if(!scratchState.finished)paintDust()};
 window.addEventListener('resize',scratchState.resize);
 function reveal(){
  if(scratchState.finished)return;
  scratchState.finished=true;button.disabled=true;
  button.textContent='Memory revealed';button.setAttribute('aria-expanded','true');
  $('scratch-after-note').hidden=false;
  set('scratch-after-note',story.secretPhoto?.note||'');
  label.classList.add('revealed');
  if(reduce){canvas.hidden=true;under.style.filter='blur(0px)';return}
  // Preserve existing particle choreography and cover fade; no finger interaction.
  const dust=document.createElement('canvas');dust.className='dust-fall';
  const r=host.getBoundingClientRect();dust.width=Math.max(1,Math.round(r.width));dust.height=Math.max(1,Math.round(r.height));host.append(dust);
  const dc=dust.getContext('2d');
  const particles=Array.from({length:115},()=>({x:Math.random()*dust.width,y:Math.random()*dust.height,size:1+Math.random()*3,speed:.7+Math.random()*1.9,drift:(Math.random()-.5)*1.2,delay:Math.random()*450}));
  canvas.classList.add('dust-releasing');
  let begin;
  function draw(t){
   if(begin===undefined)begin=t;const dt=t-begin;
   dc.clearRect(0,0,dust.width,dust.height);
   for(const part of particles){const age=Math.max(0,dt-part.delay);if(age<=0)continue;
    const opacity=Math.max(0,1-age/1150);dc.fillStyle=`rgba(201,181,151,${opacity})`;
    dc.beginPath();dc.arc(part.x+part.drift*age/10,part.y+part.speed*age/7,part.size,0,Math.PI*2);dc.fill();}
   if(dt<1850)requestAnimationFrame(draw);else dust.remove();
  }
  requestAnimationFrame(draw);
  setTimeout(()=>{canvas.hidden=true;under.style.filter='blur(0px)'},480);
 }
 button.onclick=reveal;
}
// A concealed quote is revealed only by an intentional motion or accessible tap.
let promiseRevealed=false,previousMotion=null,lastShake=0,shakeCount=0;
function revealPromise(){if(promiseRevealed||!enabled('promise'))return;promiseRevealed=true;
 const text=$('promise-quote'),hint=$('promise-shake');text.hidden=false;hint.hidden=true;$('promise-reveal').hidden=true;
 text.classList.add('promise-written');if(reduce)return;
 const content=text.textContent||'';text.replaceChildren();const words=content.match(/\S+\s*/g)||[];
 words.forEach((word,i)=>{const span=document.createElement('span');span.className='promise-word';span.textContent=word;span.style.setProperty('--word-delay',`${Math.min(i*65,5500)}ms`);text.append(span)})
}
$('promise-reveal').addEventListener('click',revealPromise);
$('promise-shake').addEventListener('click',async()=>{
 const D=window.DeviceMotionEvent;
 if(D&&typeof D.requestPermission==='function'){
  try{const result=await D.requestPermission();if(result==='granted')$('shake-hint').textContent='Gently shake your phone';else revealPromise()}catch{revealPromise()}
 }else revealPromise();
});
window.addEventListener('devicemotion',e=>{if(promiseRevealed||!enabled('promise'))return;
 const a=e.accelerationIncludingGravity||e.acceleration;if(!a||![a.x,a.y,a.z].every(Number.isFinite))return;
 const now=performance.now();if(previousMotion){const strength=Math.abs(a.x-previousMotion.x)+Math.abs(a.y-previousMotion.y)+Math.abs(a.z-previousMotion.z);
 if(strength>17&&now-lastShake>260){shakeCount++;lastShake=now;if(shakeCount>=2)revealPromise()}
 if(now-lastShake>1600)shakeCount=0;
 }previousMotion={x:a.x,y:a.y,z:a.z};
},{passive:true});

// Timeline ink is derived from viewport position, so scrolling up erases it again.
function updateTimelineProgress(){const host=$('timeline-list');if(!host||host.closest('[data-section="timeline"]').hidden||experience.hidden)return;
 const rect=host.getBoundingClientRect();const target=innerHeight*.68;
 const filled=Math.max(0,Math.min(1,(target-rect.top)/Math.max(rect.height,1)));
 const progress=$('timeline-trail-progress');if(progress)progress.style.transform=`scaleY(${filled.toFixed(4)})`;
 host.querySelectorAll('.timeline-item').forEach(item=>{const r=item.getBoundingClientRect();item.classList.toggle('timeline-visible',r.top<target&&r.bottom>0);});
}
$('gallery-bonus-control').addEventListener('click',()=>{const b=$('gallery-bonus-control'),open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));$('gallery-bonus-message').hidden=!open;b.textContent=open?'Close note':'There is a note here'});
$('photo-close').addEventListener('click',()=>$('photo-dialog').close());$('photo-dialog').addEventListener('click',e=>{if(e.target===$('photo-dialog'))$('photo-dialog').close()});$('gallery-prev').addEventListener('click',()=>$('gallery-rail').scrollBy({left:-$('gallery-rail').clientWidth*.7,behavior:smooth()}));$('gallery-next').addEventListener('click',()=>$('gallery-rail').scrollBy({left:$('gallery-rail').clientWidth*.7,behavior:smooth()}));
// Gentle heart fall: only at finale arrival, capped, no pointer interference.
let finalePlayed=false;function hearts(){if(finalePlayed||reduce||!enabled('finale'))return;finalePlayed=true;const canvas=$('finale-hearts'),ctx=canvas.getContext('2d');const rect=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(rect.width*ratio);canvas.height=Math.round(rect.height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);const count=Math.min(30,Math.max(16,Math.round(rect.width/35))),p=Array.from({length:count},(_,i)=>({x:rect.width*.5+(Math.random()-.5)*Math.min(rect.width*.8,480),y:rect.height*.38+(Math.random()-.5)*70,vx:(Math.random()-.5)*1.6,vy:1.1+Math.random()*1.1,size:5+Math.random()*7,phase:Math.random()*6.28,delay:Math.random()*500}));let start=0;function tick(t){if(!start)start=t;const elapsed=t-start;ctx.clearRect(0,0,rect.width,rect.height);for(const a of p){const tt=Math.max(0,elapsed-a.delay)/1000;if(!tt)continue;const x=a.x+a.vx*tt*45+Math.sin(tt*2+a.phase)*10,y=a.y-(Math.min(tt,.4)*90)+Math.max(0,tt-.4)*a.vy*55,opacity=Math.min(1,tt*5)*Math.min(1,Math.max(0,(rect.height+40-y)/100))*Math.max(0,(5.8-tt)/1.4);if(opacity<=0)continue;ctx.fillStyle=`rgba(168,135,89,${opacity*.83})`;ctx.beginPath();const s=a.size;ctx.moveTo(x,y+s*.75);ctx.bezierCurveTo(x-2*s,y-s*.25,x-s*.65,y-s,x,y-s*.3);ctx.bezierCurveTo(x+s*.65,y-s,x+2*s,y-s*.25,x,y+s*.75);ctx.fill()}if(elapsed<6400)requestAnimationFrame(tick);else ctx.clearRect(0,0,rect.width,rect.height)}requestAnimationFrame(tick)}
let revealObserver;if('IntersectionObserver'in window){revealObserver=new IntersectionObserver(entries=>{for(const ent of entries){if(ent.isIntersecting){ent.target.classList.add('in-view');revealObserver.unobserve(ent.target)}}},{threshold:.04,rootMargin:'0px 0px -15px 0px'});const finalObserver=new IntersectionObserver(entries=>{if(entries.some(x=>x.isIntersecting)){hearts();finalObserver.disconnect()}},{threshold:.35});finalObserver.observe($('promise'))}
function observeReveals(){if(reduce||!revealObserver)return;document.querySelectorAll('.experience .reveal').forEach(el=>revealObserver.observe(el))}
let raf=false;window.addEventListener('scroll',()=>{if(raf)return;raf=true;requestAnimationFrame(()=>{updateTimelineProgress();const max=document.documentElement.scrollHeight-innerHeight;$('reading-bar').style.width=(max>0?Math.max(0,Math.min(100,scrollY/max*100)):0)+'%';const r=$('promise').getBoundingClientRect();$('topbar').classList.toggle('on-dark',!experience.hidden&&r.top<80&&r.bottom>80);raf=false})},{passive:true});
// Optional scoped preview updates; real portal will call an authenticated API.
window.addEventListener('message',e=>{if(e.source!==window.parent||e.origin!=='null'&&e.origin!==location.origin)return;if(e.data?.type==='scanory-preview-update'&&e.data.story&&typeof e.data.story==='object')setStory(e.data.story)});
render();document.body.classList.add('story-gated');
})();
