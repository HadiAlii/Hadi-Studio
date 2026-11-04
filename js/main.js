(function(){
const D=window.DATA,$=s=>document.querySelector(s);
const h=(t,a={},...c)=>{const e=document.createElement(t);for(const k in a){if(k==='html')e.innerHTML=a[k];else e.setAttribute(k,a[k])}e.append(...c);return e};
const hl=o=>JSON.stringify(o,null,2)
 .replace(/"([^"]+)":/g,'<i class="k">$1</i>:')
 .replace(/^(\s+)"([^"]*)"(,?)$/gm,'$1<i class="s">"$2"</i>$3')
 .replace(/: "([^"]*)"/g,': <i class="s">"$1"</i>')
 .replace(/: (\d+)/g,': <i class="n">$1</i>');
const lb=$('#lb'),lbi=lb.querySelector('img'),lbp=lb.querySelector('p');let gal=[],gi=0;
const show=()=>{const s=gal[gi];lbi.src=s.src;lbi.alt=s.t||'';lbp.textContent=(s.t||'')+(gal.length>1?`  (${gi+1}/${gal.length})`:'')};
const step=d=>{gi=(gi+d+gal.length)%gal.length;show()};
const open=(g,i)=>{gal=g;gi=i;show();lb.showModal()};
lb.querySelector('.x').onclick=()=>lb.close();lb.querySelector('.pv').onclick=()=>step(-1);lb.querySelector('.nx').onclick=()=>step(1);
lb.addEventListener('click',e=>{if(e.target===lb)lb.close()});
lb.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
function card(it,sib){
 const f=h('figure',{class:'card'});let b;
 if(it.k==='vid'){
  b=h('button',{type:'button','aria-label':'Play '+it.t,style:`aspect-ratio:${it.w}/${it.h}`},h('img',{src:it.poster,alt:it.t,loading:'lazy',width:it.w,height:it.h}),h('span',{class:'play'},'▶ '+it.dur));
  b.onclick=()=>{const v=h('video',{src:it.src,poster:it.poster,controls:'',autoplay:'',playsinline:'',preload:'metadata','aria-label':it.t});v.style.aspectRatio=`${it.w}/${it.h}`;b.replaceWith(v)};
 }else{
  const g=it.k==='car'?it.slides:sib.filter(x=>x.k==='img');
  b=h('button',{type:'button','aria-label':'Open '+it.t},h('img',{src:it.src,alt:it.t,loading:'lazy',width:it.w,height:it.h}));
  if(it.k==='car')b.append(h('span',{class:'badge'},it.slides.length+' photos'));
  b.onclick=()=>open(g,it.k==='car'?0:g.indexOf(it));
 }
 f.append(b,h('figcaption',{},it.t));return f;
}
const main=$('#work');
D.sections.forEach(s=>{
 const sec=h('section',{id:s.id,class:'sec wrap'},h('h2',{},s.title),h('p',{class:'lead'},s.lead));
 s.blocks.forEach(b=>{
  const blk=h('div');if(b.title)blk.append(h('h3',{},b.title));
  blk.append(h('pre',{class:'term glass',role:'note','aria-label':'Project summary',html:'const project = '+hl(b.meta)+';'}));
  b.groups.forEach(g=>{blk.append(h('h4',{},g.name));const m=h('div',{class:'masonry'});g.items.forEach(i=>m.append(card(i,g.items)));blk.append(m)});
  if(b.note)blk.append(h('p',{class:'empty glass'},b.note));
  sec.append(blk)});
 main.append(sec)});
const strip=$('#strip');[...D.hero,...D.hero].forEach((x,i)=>strip.append(h('img',{src:x.src,alt:i<D.hero.length?x.t:'','aria-hidden':i<D.hero.length?'false':'true',loading:i<4?'eager':'lazy'})));
const reels=[];D.sections.forEach(s=>s.blocks.forEach(b=>b.groups.forEach(g=>g.items.forEach(i=>{if(i.k==='vid')reels.push(i)}))));
const labels=['All',...new Set(reels.map(r=>r.from))],chips=$('#chips'),grid=$('#reelGrid');
function draw(f){grid.replaceChildren(...reels.filter(r=>f==='All'||r.from===f).map(r=>{const c=card(r);c.querySelector('figcaption').textContent=r.from+' · '+r.t;return c}));
 chips.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.f===f))}
labels.forEach(l=>{const c=h('button',{type:'button','data-f':l},l+(l==='All'?` (${reels.length})`:''));c.onclick=()=>draw(l);chips.append(c)});
draw('All');$('#yr').textContent=new Date().getFullYear();
})();
