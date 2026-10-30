'use strict';
const $=id=>document.getElementById(id),pad=n=>String(n).padStart(2,'0');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const projects=allProjects.filter(p=>p.group==='Web');
// Current checkout contains demonstration content. Media records retain native dimensions.
for(const [title,zh] of [['ARCHIVE','作品檔案'],['Pocket Studio','行動工作室']])projects.push({id:allProjects.length+projects.length,title,zh,lines:title.replace(' ','<br>'),category:'Mobile website',year:'2026',role:'介面設計、互動規劃',label:'DIGITAL EXPERIENCE',color:'#c8d6a5',description:'以手機的閱讀與操作節奏為出發點，整理資訊層級，讓內容清楚呈現。',mobileOnly:true});
projects[1].mobileOnly=true;
const tones=['#d5e4af','#bbc9de','#e3bca8','#d6c6df','#d3d3c2'];
function placeholder(w,h,label,tone=tones[0]){const text=label.replace(/[<>&"]/g,'');return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${tone}"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#32392d" font-family="Arial,sans-serif" font-size="${Math.max(18,Math.min(w,h)*.075)}">${text}</text></svg>`);}
const media=(w,h,i=0)=>({w,h,src:placeholder(w,h,`${w} × ${h}`,tones[i%tones.length]),alt:`${w} × ${h} color-block layout preview`});
const visuals=[
 {title:'杭州亞運',type:'EDM / Long Image',layout:'long',detail:true,images:[media(750,3000)]},
 {title:'OFF GRID',type:'Campaign / 2 × 2',layout:'grid',images:[media(1080,1080),media(1080,1080,1),media(1080,1080,2),media(1080,1080,3)]},
 {title:'FORM / 01',type:'Single Visual / 1:1',layout:'single',images:[media(1080,1080,2)]},
 {title:'Soft Spoken',type:'Series / 3-up',layout:'three',images:[media(1080,1920,1),media(1080,1920,3),media(1080,1920,0)]},
 {title:'PLAY AGAIN',type:'Wide / 16:9',layout:'wide',images:[media(1920,1080,2)]},
 {title:'NEW WAVE',type:'Banner / 1200 × 630',layout:'wide',images:[media(1200,630,0)]},
 {title:'OPEN HOUSE',type:'Series / 2 × 2',layout:'grid',images:[media(1200,630,0),media(1200,630,1),media(1200,630,2),media(1200,630,3)]},
 {title:'TYPE / 02',type:'Single Visual / 9:16',layout:'single',images:[media(1080,1920,3)]},
 {title:'Slow Days',type:'Series / 3-up',layout:'three',images:[media(1080,1080,4),media(1200,630,1),media(1080,1920,2)]},
 {title:'星巴克膠囊咖啡',type:'EDM / Long Image',layout:'long',detail:true,images:[media(750,3600,4)]}
];
const motions=allProjects.filter(p=>p.group==='Motion').map((p,i)=>({...p,clips:[{w:[1080,1920,640,1080][i%4],h:[1920,1080,1386,1080][i%4],src:null}]}));
motions.push({title:'Short Stories',clips:[{w:1080,h:1920,src:null}]},{title:'Moving Type',clips:[{w:1920,h:1080,src:null}]});
motions[0].clips.push({w:1920,h:1080,src:null},{w:1080,h:1080,src:null});
motions.forEach((p,i)=>p.clips.forEach((clip,j)=>{const phone=clip.h>clip.w||clip.h===clip.w;clip.w=phone?640:1920;clip.h=phone?1386:1080;}));
let selected=0,visualIndex=0,motionIndex=0,clipIndex=0,activeModal=null,lastFocus=null,scrollPosition=0;
let lenis=null;
function setupScroll(){lenis?.destroy();lenis=null;if(!reduced.matches&&window.Lenis)lenis=new Lenis({autoRaf:true,lerp:.24,smoothWheel:true,syncTouch:false,wheelMultiplier:1,anchors:false,prevent:node=>node instanceof Element&&!!node.closest('[data-lenis-prevent]')});if(activeModal)lenis?.stop();}
setupScroll();
reduced.addEventListener('change',()=>{setupScroll();if(reduced.matches){document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));document.getAnimations().forEach(a=>a.finish());}});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const href=a.getAttribute('href');const target=href==='#'?0:document.querySelector(href);if(target===null)return;e.preventDefault();if(href==='#works'){heroSnapArmed=false;snapToWorks();return;}if(lenis)lenis.scrollTo(target,{duration:.55,lerp:undefined});else if(target===0)window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});else target.scrollIntoView({behavior:reduced.matches?'instant':'smooth'});}));
// Snap once when leaving the hero; re-arm only after returning to the top.
let heroSnapArmed=window.scrollY<8,heroSnapRunning=false,previousScrollY=window.scrollY;
// Consume the rest of the gesture that initiated the snap, including trackpad inertia.
let heroGestureSettling=false,heroGestureTimer=0;
function settleHeroGesture(){
 heroGestureSettling=true;
 clearTimeout(heroGestureTimer);
 heroGestureTimer=setTimeout(()=>{heroGestureSettling=false;},200);
}
window.addEventListener('wheel',event=>{
 if(activeModal||(!heroSnapRunning&&!heroGestureSettling))return;
 if(!heroSnapRunning&&event.deltaY<0){clearTimeout(heroGestureTimer);heroGestureSettling=false;return;}
 if(event.ctrlKey)return;
 if(event.cancelable)event.preventDefault();
 event.stopImmediatePropagation();
 settleHeroGesture();
},{capture:true,passive:false});
window.addEventListener('scroll',()=>{
 const y=window.scrollY,down=y>previousScrollY;previousScrollY=y;
 if(heroSnapRunning||activeModal)return;
 if(y<8){heroSnapArmed=true;return;}
 const targetY=$('works').getBoundingClientRect().top+y;
 if(!heroSnapArmed||!down||y<32)return;
 heroSnapArmed=false;
 if(y>=targetY-8)return;
 snapToWorks();
},{passive:true});
function snapToWorks(){
 if(heroSnapRunning||activeModal)return;
 heroSnapRunning=true;
 const works=$('works');
 works.classList.add('is-arriving');
 works.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));
 const targetY=Math.round(works.getBoundingClientRect().top+window.scrollY);
 const finish=()=>{settleHeroGesture();heroSnapRunning=false;previousScrollY=window.scrollY;works.classList.remove('is-arriving');};
 if(lenis)lenis.scrollTo(targetY,{duration:.65,lerp:0,easing:t=>1-Math.pow(1-t,3),lock:true,onComplete:finish});
 else{window.scrollTo({top:targetY,behavior:reduced.matches?'instant':'smooth'});setTimeout(finish,reduced.matches?0:800);}
}
function normalChinese(root=document.body){const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];let n;while(n=walker.nextNode())if(/[\p{Script=Han}]/u.test(n.nodeValue)&&!n.parentElement.closest('script,style,.zh,svg'))nodes.push(n);for(const text of nodes){const frag=document.createDocumentFragment();for(const part of text.nodeValue.split(/([\p{Script=Han}\u3000-\u303f\uff00-\uffef]+)/u)){if(!part)continue;if(/[\p{Script=Han}]/u.test(part)){const span=document.createElement('span');span.className='zh';span.textContent=part;frag.append(span);}else frag.append(document.createTextNode(part));}text.replaceWith(frag);}}
function cover(p,i){return `<div class="cover cover-${i%6+1}"><div class="cover-top"><span>SR—${pad(i+1)}</span><span>${p.year} / SELECTED</span></div><div class="cover-title">${p.lines}</div><div class="cover-bottom"><span>${p.label}</span><span>OPEN</span></div></div>`;}
$('cards').innerHTML=projects.map((p,i)=>`<button class="record" data-index="${i}" aria-label="${p.title}">${cover(p,p.id)}</button>`).join('');
function renderWeb(){const mobile=innerWidth<=600,start=Math.max(0,Math.min(selected-1,projects.length-4));document.querySelectorAll('.record').forEach((card,i)=>{const d=i-selected,visible=i>=start&&i<start+4;card.hidden=!visible;card.setAttribute('aria-hidden',String(!visible));card.classList.toggle('active',d===0);card.style.zIndex=15-Math.abs(d);card.style.opacity=visible?'1':'0';card.style.pointerEvents=visible?'auto':'none';card.style.filter=d?'brightness(.88)':'none';card.style.transform=mobile?`translate(-50%,-50%) translateX(${d*205}px) perspective(1400px) rotateY(${d===0?0:d>0?-24:24}deg) scale(${d===0?1:.88/(1+Math.abs(d)*.07)})`:`translate(-50%,-50%) translateY(${-d*65}px) perspective(1400px) scale(${1/(1+Math.abs(d)*.08)}) rotateX(${d===0?-8:d>0?-40:32}deg) rotateZ(${d===0?-5:0}deg)`;card.tabIndex=visible?0:-1;});$('current-title').textContent=projects[selected].title;$('current-category').textContent=projects[selected].mobileOnly?'Mobile only':projects[selected].category;$('counter').textContent=pad(selected+1);$('web-progress').style.width=`${(selected+1)/projects.length*100}%`;$('prev').disabled=selected===0;$('next').disabled=selected===9;normalChinese($('web'));}
function selectWeb(i){selected=Math.max(0,Math.min(9,i));renderWeb();}
$('prev').onclick=()=>selectWeb(selected-1);$('next').onclick=()=>selectWeb(selected+1);
function openModal(modal,key){lastFocus=document.activeElement;scrollPosition=window.scrollY;lenis?.stop();document.body.style.position='fixed';document.body.style.top=`-${scrollPosition}px`;document.body.style.width='100%';document.body.style.overflow='hidden';activeModal=modal;history.pushState({portfolioModal:true},'',`#${key}`);modal.showModal();modal.scrollTop=0;modal.querySelector('button').focus();normalChinese(modal);}
function restoreModal(){if(!activeModal)return;activeModal.querySelectorAll('video').forEach(v=>v.pause());activeModal.close();activeModal=null;document.body.style.position='';document.body.style.top='';document.body.style.width='';document.body.style.overflow='';window.scrollTo({top:scrollPosition,behavior:'instant'});lenis?.start();lenis?.resize();lenis?.scrollTo(scrollPosition,{immediate:true});lastFocus?.focus({preventScroll:true});}
function closeModal(){if(history.state?.portfolioModal)history.back();else restoreModal();}
window.addEventListener('popstate',restoreModal);
for(const d of [$('project-dialog'),$('image-lightbox')])d.addEventListener('cancel',e=>{e.preventDefault();closeModal();});
$('close').onclick=closeModal;$('lightbox-close').onclick=closeModal;
function formatBlock(label,w,h,tone){return `<figure class="format-item portrait"><div class="format-block" style="aspect-ratio:${w}/${h};--block-color:${tone}"><span class="format-kind">WEB</span><strong>${label}</strong><span class="format-caption">LAYOUT PREVIEW</span></div></figure>`;}
function openProject(){const p=projects[selected];$('project-content').innerHTML=`<article class="project-page" style="--project-color:${p.color}"><div class="project-masthead"><span>WORKS</span><span>WEB / ${pad(selected+1)}</span></div><section class="project-intro"><div class="sleeve-scene" aria-label="Cover with a half-exposed vinyl record"><div class="vinyl-disc" aria-hidden="true"><img src="assets/vinyl-reference.jpg" alt=""><span class="vinyl-label"></span></div><div class="album-sleeve">${cover(p,p.id)}</div></div><div class="project-details"><span class="eyebrow">${p.zh}</span><h2 id="project-title">${p.title}</h2><dl class="project-facts"><div><dt>TYPE</dt><dd>${p.mobileOnly?'Mobile only':'Responsive web design'}</dd></div><div><dt>ROLE</dt><dd>${p.role}</dd></div></dl></div></section><section class="project-story"><div class="story-inner"><div class="story-block"><h3>關於專案</h3><p class="story-lead">${p.description}</p></div><div class="story-block"><h3>設計方向</h3><p>以清楚的資訊層級、字級與留白，建立流暢的閱讀與操作體驗。</p></div><div class="web-study ${p.mobileOnly?'mobile-only':''}">${p.mobileOnly?'':formatBlock('Desktop · 1440 × 2400',1440,2400,tones[0])}${formatBlock('Mobile · 390 × 1800',390,1800,tones[1])}</div></div></section></article>`;openModal($('project-dialog'),`project-${selected+1}`);}
$('open-project').onclick=openProject;
function imageMarkup(item){return `<img src="${item.src}" width="${item.w}" height="${item.h}" alt="${item.alt}" draggable="false">`;}
function renderVisual(){const p=visuals[visualIndex],canvas=$('visual-canvas');canvas.className=`current-canvas layout-${p.layout}`;canvas.innerHTML=p.images.map(imageMarkup).join('');canvas.setAttribute('role',p.detail?'button':'group');canvas.setAttribute('aria-label',`${p.title}${p.detail?' — Open large image':''}`);canvas.classList.toggle('has-detail',!!p.detail);$('visual-title').textContent=p.title;$('visual-layout').textContent=p.type;$('visual-note').textContent=p.detail?'Click canvas to view full image':'Layout preview';updateControls('visual',visualIndex,10);normalChinese($('visual'));}
function updateControls(type,i,n){$(type+'-index').textContent=pad(i+1);$(type+'-progress').style.width=`${(i+1)/n*100}%`;$(type+'-prev').disabled=i===0;$(type+'-next').disabled=i===n-1;}
const busy={visual:false,motion:false};
async function changeSlide(type,direction){const old=type==='visual'?visualIndex:motionIndex,n=type==='visual'?10:8,next=Math.max(0,Math.min(n-1,old+direction));if(old===next||busy[type])return;busy[type]=true;const canvas=$(type+'-canvas');canvas.querySelectorAll('video').forEach(v=>v.pause());try{if(!reduced.matches)await canvas.animate([{transform:'translateX(0)',opacity:1},{transform:`translateX(${-direction*40}px)`,opacity:0}],{duration:160,easing:'ease-in',fill:'forwards'}).finished;if(type==='visual'){visualIndex=next;renderVisual();}else{motionIndex=next;clipIndex=0;renderMotion();}canvas.getAnimations().forEach(a=>a.cancel());if(!reduced.matches)await canvas.animate([{transform:`translateX(${direction*40}px)`,opacity:0},{transform:'translateX(0)',opacity:1}],{duration:260,easing:'cubic-bezier(.2,.7,.2,1)'}).finished;}finally{canvas.getAnimations().forEach(a=>a.cancel());busy[type]=false;}}
function openLightbox(){const p=visuals[visualIndex];if(!p.detail||busy.visual)return;$('lightbox-title').textContent=p.title;$('lightbox-content').innerHTML=p.images.map(imageMarkup).join('');openModal($('image-lightbox'),`visual-image-${visualIndex+1}`);}
$('visual-canvas').onclick=()=>{if(!swipeSuppressed)openLightbox();};
function renderMotion(){const p=motions[motionIndex],clip=p.clips[clipIndex],ratio=clip.w/clip.h,kind=ratio<.8?'phone':ratio>1.2?'monitor':'square',frameHeight=Math.min(innerHeight*.51,560),maxWidth=Math.max(180,$('motion-canvas').clientWidth-36),height=Math.min(frameHeight,maxWidth/ratio),width=height*ratio;const label=clip.w===640?'640 × 1386':ratio===1?'1:1':ratio<1?'9:16':'16:9';$('motion-canvas').innerHTML=`<div class="device ${kind}" style="--media-w:${width}px;--media-ratio:${clip.w}/${clip.h}">${clip.src?`<video controls playsinline preload="metadata" src="${clip.src}" aria-label="${p.title}"></video>`:`<div class="video-placeholder"><span>MOTION / ${pad(motionIndex+1)}</span><strong>${label}</strong><span>VIDEO PLACEHOLDER</span></div>`}</div>`;$('motion-title').textContent=p.title;$('motion-format').textContent=`${kind==='phone'?'Phone':kind==='monitor'?'Desktop / Monitor':'Square Player'} · ${label}`;$('motion-clips').innerHTML=p.clips.map((c,i)=>`<button data-clip="${i}" aria-pressed="${i===clipIndex}">FILM ${pad(i+1)}</button>`).join('');updateControls('motion',motionIndex,8);normalChinese($('motion'));}
$('motion-clips').onclick=e=>{const b=e.target.closest('[data-clip]');if(!b||busy.motion)return;$('motion-canvas').querySelectorAll('video').forEach(v=>v.pause());clipIndex=Number(b.dataset.clip);renderMotion();};
for(const type of ['visual','motion']){$(type+'-prev').onclick=()=>changeSlide(type,-1);$(type+'-next').onclick=()=>changeSlide(type,1);$(type+'-canvas').addEventListener('keydown',e=>{if(e.target.matches('video'))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();changeSlide(type,e.key==='ArrowRight'?1:-1);}if(type==='visual'&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openLightbox();}});}
let swipeSuppressed=false;
function swipe(el,callback,vertical=false){let start=null;el.addEventListener('pointerdown',e=>{if(e.target.matches('video'))return;start={x:e.clientX,y:e.clientY};swipeSuppressed=false;});el.addEventListener('pointerup',e=>{if(!start)return;let dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;const delta=vertical&&innerWidth>600&&Math.abs(dy)>Math.abs(dx)?-dy:dx;if(Math.abs(delta)>35&&(vertical||Math.abs(dx)>Math.abs(dy))){swipeSuppressed=true;callback(delta<0?1:-1);setTimeout(()=>swipeSuppressed=false,50);}});el.addEventListener('pointercancel',()=>start=null);}
swipe($('stage'),d=>selectWeb(selected+d),true);swipe($('visual-canvas'),d=>changeSlide('visual',d));swipe($('motion-canvas'),d=>changeSlide('motion',d));
$('cards').onclick=e=>{if(swipeSuppressed)return;const c=e.target.closest('.record');if(!c)return;const i=Number(c.dataset.index);if(i===selected)openProject();else selectWeb(i);};
$('stage').onkeydown=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();selectWeb(selected+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1));}};
renderWeb();renderVisual();renderMotion();normalChinese();
window.addEventListener('resize',()=>{renderWeb();const video=$('motion-canvas').querySelector('video');if(!video)renderMotion();});
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});
document.querySelectorAll('.portfolio-section').forEach(section=>section.querySelectorAll('.reveal').forEach((el,i)=>{el.style.setProperty('--reveal-delay',`${Math.min(i,2)*.12}s`);if(reduced.matches)el.classList.add('is-visible');else revealObserver.observe(el);}));

function activateTab(name,focus=false){
 document.querySelectorAll('[data-tab]').forEach(button=>{const active=button.dataset.tab===name;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;if(active&&focus)button.focus();});
 document.querySelectorAll('.portfolio-section').forEach(panel=>{panel.hidden=panel.id!==name;if(panel.hidden)panel.querySelectorAll('video').forEach(video=>video.pause());});
 if(name==='web')renderWeb();if(name==='visual')renderVisual();if(name==='motion')renderMotion();lenis?.resize();
 const panel=$(name);panel.querySelectorAll('.reveal').forEach((el,i)=>{el.classList.add('is-visible');el.getAnimations().forEach(a=>a.cancel());if(!reduced.matches)el.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:Math.min(i,2)*120,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'});});
}
const tabs=[...document.querySelectorAll('[data-tab]')];
tabs.forEach((button,i)=>{button.onclick=()=>activateTab(button.dataset.tab);button.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();activateTab(tabs[next].dataset.tab,true);}});});
activateTab('web');
