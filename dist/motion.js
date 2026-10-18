// Progressive enhancement: no dependency, no changes to navigation or stored data.
const main=document.querySelector('#main');
const dialog=document.querySelector('#details');
const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
const easing='cubic-bezier(.22,1,.36,1)';
const pending=new Set();
const seen=new WeakSet();
const running=new Set();
let heroIntroduced=false;
let positions=new Map();
let scheduled=false;

function play(element,frames,options={}){
  if(!element||preference.matches||!element.animate)return;
  const animation=element.animate(frames,{duration:520,easing,...options});
  running.add(animation);
  animation.finished.catch(()=>{}).finally(()=>running.delete(animation));
  return animation;
}
function arrive(element,delay=0,distance=18){
  play(element,[{opacity:0,transform:`translateY(${distance}px)`},{opacity:1,transform:'translateY(0)'}],{delay,fill:'backwards'});
}
const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(!entry.isIntersecting)continue;
    const element=entry.target;
    observer.unobserve(element);pending.delete(element);element.classList.remove('motion-pending');
    arrive(element,Number(element.dataset.motionDelay)||0);
  }
},{threshold:.08}):null;

function reveal(element,index=0){
  if(seen.has(element))return;
  seen.add(element);
  if(preference.matches||!observer)return;
  element.dataset.motionDelay=String(Math.min(index%3*55,110));
  element.classList.add('motion-pending');pending.add(element);observer.observe(element);
}
function itemPositions(){return new Map([...main.querySelectorAll('.trip-item')].map(item=>[item.querySelector('[data-detail]')?.dataset.detail,item.getBoundingClientRect()]));}
function rememberPositions(){positions=itemPositions();}
function refresh(){
  scheduled=false;
  for(const element of pending){if(!element.isConnected){observer?.unobserve(element);pending.delete(element);}}
  const hero=main.querySelector('.hero');
  if(hero&&!heroIntroduced){
    heroIntroduced=true;
    hero.querySelectorAll('.hero>div:first-child>*').forEach((el,i)=>arrive(el,80+i*70,15));
    play(hero.querySelector('.hero-photo'),[{opacity:0,transform:'translateY(22px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:1000,delay:160,fill:'backwards'});
    play(hero.querySelector('.stamp'),[{opacity:0,transform:'rotate(26deg) scale(1.12)'},{opacity:1,transform:'rotate(14deg) scale(1)'}],{duration:750,delay:450,fill:'backwards'});
    play(hero.querySelector('.ticket'),[{opacity:0,transform:'translateY(16px) rotate(-1deg)'},{opacity:1,transform:'translateY(0) rotate(-5deg)'}],{duration:800,delay:400,fill:'backwards'});
  }
  main.querySelectorAll('.section-head,.toolbar,.filters,.callout,.trip-header,.trip-settings,.route-card,.empty,.banner').forEach(el=>reveal(el));
  main.querySelectorAll('.card').forEach((el,i)=>reveal(el,i));
  main.querySelectorAll('.trip-item').forEach((el,i)=>{
    const id=el.querySelector('[data-detail]')?.dataset.detail;
    const before=positions.get(id),after=el.getBoundingClientRect();
    const dy=before?before.top-after.top:0;
    if(before&&Math.abs(dy)>1&&Math.abs(dy)<700){
      seen.add(el);play(el,[{transform:`translateY(${dy}px)`},{transform:'translateY(0)'}],{duration:420});
    }else if(before){seen.add(el);}else reveal(el,i);
  });
  positions.clear();
}
// Observe only containers replaced by app rendering, not typing or note updates.
new MutationObserver(records=>{
  if(records.some(record=>record.target===main||record.target.id==='cards'||record.target.id==='load-message')){
    if(!scheduled){scheduled=true;queueMicrotask(refresh);}
  }
}).observe(main,{childList:true,subtree:true});
new MutationObserver(records=>{
  if(records.some(record=>record.attributeName==='open')&&dialog.open){
    play(dialog,[{opacity:0,transform:'translateY(18px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:360});
  }
}).observe(dialog,{attributes:true,attributeFilter:['open']});

document.addEventListener('click',event=>{
  if(!(event.target instanceof Element))return;
  if(event.target.closest('[data-move],[data-remove]'))rememberPositions();
},true);
document.addEventListener('change',event=>{
  if(event.target instanceof Element&&event.target.matches('[data-day],#trip-days'))rememberPositions();
},true);
// A small collection confirmation; only animate when the number changes.
const count=document.querySelector('#trip-count');
let previousCount=count.textContent;
new MutationObserver(()=>{
  if(count.textContent!==previousCount){previousCount=count.textContent;play(count,[{transform:'scale(1)'},{transform:'scale(1.3)',offset:.45},{transform:'scale(1)'}],{duration:320});}
}).observe(count,{childList:true});
preference.addEventListener('change',()=>{
  if(preference.matches){
    running.forEach(animation=>animation.cancel());
    pending.forEach(element=>{element.classList.remove('motion-pending');observer?.unobserve(element);});pending.clear();
  }
});
window.addEventListener('beforeprint',()=>{running.forEach(animation=>animation.finish());pending.forEach(el=>el.classList.remove('motion-pending'));});
refresh();
