(function(){
var WA='https://wa.me/923396699111?text=';
var D=document,R=D.documentElement,$=function(s,c){return (c||D).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||D).querySelectorAll(s))};
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function openWA(msg){var a=D.createElement('a');a.href=WA+encodeURIComponent(msg);a.target='_blank';a.rel='noopener';D.body.appendChild(a);a.click();a.remove()}

/* drawer */
var dr=$('#drawer'),ob=$('#menu-open'),cb=$('#menu-close');
if(dr&&ob){var set=function(o){dr.hidden=!o;ob.setAttribute('aria-expanded',o);D.body.style.overflow=o?'hidden':'';(o?cb:ob).focus()};
  ob.addEventListener('click',function(){set(true)});cb.addEventListener('click',function(){set(false)});
  $$('a',dr).forEach(function(a){a.addEventListener('click',function(){set(false)})});
  D.addEventListener('keydown',function(e){if(e.key==='Escape'&&!dr.hidden)set(false)})}

/* nav: solid after scroll, hides going down, returns going up */
var top=$('.top'),lastY=0;
function onScroll(){var y=window.scrollY||0;if(!top)return;top.classList.toggle('solid',y>40);
  if(y>400&&y>lastY+4)top.classList.add('hide');else if(y<lastY-4||y<400)top.classList.remove('hide');lastY=y}
var waf=$('.wa');
function onWa(){if(waf)waf.classList.toggle('show',(window.scrollY||0)>window.innerHeight*.6||D.body.classList.contains('has-mbar'))}
window.addEventListener('scroll',function(){onScroll();onWa()},{passive:true});onScroll();onWa();

/* live status and hours (Pakistan time) */
var OPENING=R.getAttribute('data-opening')||'2026-11-16';
function pk(){var n=new Date();return new Date(n.getTime()+n.getTimezoneOffset()*60000+5*3600000)}
var now=pk(),dow=now.getDay(),h=now.getHours()+now.getMinutes()/60,opened=now>=new Date(OPENING+'T00:00:00');
$$('[data-status]').forEach(function(el){var t,open=false;
  if(!opened){t='Opening this November'}else if(dow===0){t='Closed today. Open Monday, 4 PM'}
  else if(h<16){t='Opens today at 4 PM'}else if(h<22){t='Open now until 10 PM';open=true}
  else{t=dow===6?'Closed now. Open Monday, 4 PM':'Closed now. Opens tomorrow, 4 PM'}
  el.querySelector('span').textContent=t;el.classList.toggle('open',open)});
$$('.hours span').forEach(function(s){if(+s.dataset.d===dow)s.classList.add('today')});

/* copy buttons */
$$('[data-copy]').forEach(function(b){b.addEventListener('click',function(){var t=b.dataset.copy,done=function(){var o=b.textContent;b.textContent='Copied';setTimeout(function(){b.textContent=o},1600)};
  try{navigator.clipboard.writeText(t).then(done,function(){})}catch(e){}})});

/* booking form */
$$('form.bf').forEach(function(f){
  f.addEventListener('submit',function(e){e.preventDefault();var n=f.pname.value.trim(),err=$('.err',f);
    if(!n){err.textContent='Please add your name so we know whom to expect.';f.pname.focus();return}err.textContent='';
    openWA('Assalam o Alaikum Nafasat, I would like to book a visit.\nName: '+n+'\nFor: '+f.treatment.value+'\nPreferred time: '+f.time.value)})});
$$('[data-book]').forEach(function(a){a.addEventListener('click',function(){var f=$('form.bf');if(!f)return;var v=a.dataset.book;
  for(var i=0;i<f.treatment.options.length;i++)if(f.treatment.options[i].text===v)f.treatment.selectedIndex=i})});

/* treatment planner */
var plan=$('#planner');
if(plan){
  var chosen=[],list=$('#sel'),empty=$('#sel-empty'),bar=$('.meter .bar i'),mtxt=$('.meter p'),vis=$('#visits'),lockp=$('#lock-text'),send=$('#plan-send'),mb=$('.mbar'),mbc=$('#mb-count');
  var tabs=$$('.ptabs button'),groups=$$('.pgroup');
  tabs.forEach(function(t){t.addEventListener('click',function(){tabs.forEach(function(o){o.setAttribute('aria-selected',o===t)});
    groups.forEach(function(g){g.hidden=g.id!==t.getAttribute('aria-controls')})})});
  function render(){
    list.innerHTML='';chosen.forEach(function(c){var li=D.createElement('li'),s=D.createElement('span'),x=D.createElement('button');s.textContent=c.n;x.type='button';x.setAttribute('aria-label','Remove '+c.n);x.textContent='×';
      x.addEventListener('click',function(){toggle(c.n,false)});li.appendChild(s);li.appendChild(x);list.appendChild(li)});
    var k=chosen.length;list.hidden=!k;empty.hidden=!!k;
    bar.style.transform='scaleX('+(k?Math.min(.92,.45+k*.12):.08)+')';
    mtxt.textContent=k?'Your plan is '+Math.round(Math.min(92,45+k*12))+'% ready. One message finishes it.':'Pick what you need. It takes under a minute.';
    var vs=chosen.map(function(c){return c.v}).sort(function(a,b){return b-a}),est=vs.length?Math.round(vs[0]+vs.slice(1).reduce(function(a,b){return a+b},0)*.5):0;
    var ortho=chosen.some(function(c){return /braces|aligners/i.test(c.n)});
    vis.innerHTML=k?'<span>Rough guide</span><b>about '+est+' visit'+(est>1?'s':'')+(ortho?' plus monthly reviews':'')+'</b>':'<span>Rough guide</span><b>1 visit to start</b>';
    lockp.innerHTML=k?'Your price for <b>'+k+' treatment'+(k>1?'s':'')+'</b> is ready. Send your plan and we reply on WhatsApp with your exact price and your <b>founding discount</b>.':'Choose a treatment and your price unlocks on WhatsApp, with a <b>founding discount</b> for early patients.';
    send.classList.toggle('go-pulse',k>0);
    if(mb){mb.classList.toggle('show',k>0);D.body.classList.toggle('has-mbar',k>0);mbc.textContent=k+' selected'}
    $$('.ptabs button').forEach(function(t){var g=$('#'+t.getAttribute('aria-controls')),n=g?$$('.opt[aria-pressed="true"]',g).length:0,b=$('.n',t);if(b){b.textContent=n;b.hidden=!n}});
  }
  function toggle(n,on){var b=$$('.opt').filter(function(o){return o.dataset.name===n})[0];if(!b)return;
    if(on===undefined)on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);
    chosen=chosen.filter(function(c){return c.n!==n});if(on)chosen.push({n:n,v:+b.dataset.v||1});render()}
  $$('.opt').forEach(function(b){b.addEventListener('click',function(){toggle(b.dataset.name)})});
  function sendPlan(){
    if(!chosen.length){var f=$('.opt');tabs[0].click();f.focus();lockp.innerHTML='Choose at least one treatment first, then send your plan.';return}
    var nm=$('#p-name').value.trim(),who=$('#p-who').value,tm=$('#p-time').value;
    openWA('Assalam o Alaikum Nafasat, I built my treatment plan on your website.\n\nMy plan:\n'+chosen.map(function(c){return '• '+c.n}).join('\n')+
      '\n\nFor: '+who+(nm?'\nName: '+nm:'')+'\nPreferred time: '+tm+'\n\nPlease send my price with the founding discount.')}
  send.addEventListener('click',sendPlan);var mbtn=$('#mb-send');if(mbtn)mbtn.addEventListener('click',sendPlan);
  $('#plan-clear').addEventListener('click',function(){chosen.slice().forEach(function(c){toggle(c.n,false)})});
  var pre={'#implants':['Dental implant with crown'],'#braces':['Metal braces'],'#whitening':['In-office whitening'],'#root-canal':['Root canal treatment'],'#scaling':['Scaling and polishing'],
    '#crowns':['Crown'],'#fillings':['Tooth-coloured filling'],'#kids':['Child check-up'],'#dentures':['Complete dentures'],'#extraction':['Tooth extraction'],'#first-visit':['First Visit Ritual']};
  (pre[location.hash]||[]).forEach(function(n){toggle(n,true);var b=$$('.opt').filter(function(o){return o.dataset.name===n})[0],g=b&&b.closest('.pgroup');
    if(g)tabs.forEach(function(t){if(t.getAttribute('aria-controls')===g.id)t.click()})});
  render();
}

/* family card slots, without motion library */
function fillSlots(){$$('.slots').forEach(function(s){var i=$$('i',s);i.forEach(function(x,j){if(j<2)setTimeout(function(){x.classList.add('on')},reduce?0:300+j*350)})})}

/* motion */
function motion(){
  if(!window.gsap||!window.ScrollTrigger||reduce){fillSlots();return}
  var g=window.gsap,ST=window.ScrollTrigger;g.registerPlugin(ST);
  /* hero */
  var hero=$('.hero');if(hero)g.to('.hero .arch .ph img',{yPercent:6,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}});
  /* reveals */
  g.set('.rv',{autoAlpha:0,y:36});
  ST.batch('.rv',{start:'top 88%',once:true,onEnter:function(b){g.to(b,{autoAlpha:1,y:0,duration:1.2,ease:'expo.out',stagger:.1,overwrite:true})}});
  /* words fill in as you read */
  $$('.fill').forEach(function(f){var w=$$('.w',f);g.fromTo(w,{opacity:.16},{opacity:1,stagger:.06,ease:'none',scrollTrigger:{trigger:f,start:'top 78%',end:'bottom 45%',scrub:true}})});
  /* counters */
  $$('[data-count]').forEach(function(el){var t=+el.dataset.count,o={v:0};ST.create({trigger:el,start:'top 90%',once:true,onEnter:function(){
    g.to(o,{v:t,duration:2,ease:'power3.out',onUpdate:function(){el.textContent=Math.round(o.v)}})}})});
  /* parallax images */
  $$('[data-speed]').forEach(function(el){g.to(el,{yPercent:-(+el.dataset.speed),ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}})});
  $$('.founder .arch .ph img,.prof .arch .ph img').forEach(function(im){g.fromTo(im,{scale:1.18},{scale:1,ease:'none',scrollTrigger:{trigger:im.closest('.arch'),start:'top bottom',end:'bottom 40%',scrub:1}})});
  /* consultant arches rise in sequence */
  ST.batch('.con',{start:'top 88%',once:true,onEnter:function(b){g.from(b,{y:60,autoAlpha:0,duration:1.3,ease:'expo.out',stagger:.12})}});
  /* journey cards rise in a gentle wave */
  ST.batch('.jcard',{start:'top 90%',once:true,onEnter:function(b){g.from(b,{y:50,autoAlpha:0,duration:1.1,ease:'expo.out',stagger:.1})}});
  /* family card slots */
  $$('.slots').forEach(function(s){ST.create({trigger:s,start:'top 85%',once:true,onEnter:function(){var i=$$('i',s);
    i.slice(0,2).forEach(function(x,j){setTimeout(function(){x.classList.add('on')},j*380)});
    g.from(i,{scale:.4,autoAlpha:0,duration:.9,stagger:.08,ease:'back.out(2)'})}})});
  /* map route draws in */
  $$('.route-draw').forEach(function(p){g.fromTo(p,{strokeDashoffset:1},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.mapcard',start:'top 80%',end:'center 50%',scrub:1}})});
  /* magnetic buttons */
  if(matchMedia('(pointer:fine)').matches)$$('.btn.mag').forEach(function(b){var xt=g.quickTo(b,'x',{duration:.5,ease:'power3'}),yt=g.quickTo(b,'y',{duration:.5,ease:'power3'});
    b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();xt((e.clientX-r.left-r.width/2)*.25);yt((e.clientY-r.top-r.height/2)*.35)});
    b.addEventListener('mouseleave',function(){xt(0);yt(0)})});
  window.addEventListener('load',function(){ST.refresh()});
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',motion);else motion();
})();
