/* ================= 零售通扩展（rx 前缀）：学习包 / 错题本 / 消息 / 反馈回流 / 首页待办 =================
   约定：所有函数只在调用时访问 S/R/UI，脚本顶层不碰全局状态。 */
const RX_STEP_GO={学:'去学习',练题:'做几道题',演练:'去演练',复测:'去复测'};

/* ---------- 学习包详情 ---------- */
function rxPackHtml(){
  const isCtrl=(typeof personOf==='function'&&(personOf(ME.mid)||{}).group==='对照批');
  if(isCtrl){R.page='adapt';setTimeout(()=>{try{toast('你暂时不需要完成学习包','')}catch(e){}},0);return rAdapt()}
  const p=S.packs.find(x=>x.id===R.packId);
  if(!p){R.page='adapt';return rAdapt()}
  const k=kp(p.kp)||{};const pg=packProgress(p);
  const rows=(p.steps||[]).map((s,i)=>{
    const need=packStepNeed(s);
    const lock=(s.t==='复测'&&!s.done&&p.due&&today<p.due)?'<span class="rst2 lock">'+Math.max(1,Math.round((new Date(p.due)-new Date(today))/864e5))+' 天后开放</span>':'';
    return '<div class="rx-step '+(s.done?'done':'')+'"><div class="rx-step-h"><b>'+(i+1)+'. '+esc(s.t)+'</b>'+(s.done?'<span class="rst2 ok">已完成</span>':lock||'<button class="rb" data-act="rxPackGo" data-id="'+p.id+'" data-i="'+i+'">'+RX_STEP_GO[s.t]+'</button>')+'</div>'
      +'<div class="rx-step-b">'+rxStepHint(s,need,k)+'</div></div>';
  }).join('');
  return rnav('学习包',true)+'<div class="rx-wrap"><div class="rx-hero"><b>'+esc(p.name)+'</b><div class="rx-meta">知识点 '+esc(k.name||'-')+' · 截止 '+esc(p.due||'-')+' · 进度 '+pg.done+'/'+pg.total+'</div>'
   +'<div class="rx-bar"><i style="width:'+(pg.total?Math.round(pg.done/pg.total*100):0)+'%"></i></div></div>'
   +'<div class="rx-note">每一步都由系统证据推进：读完并答对 1 道理解题、做完规定题数、演练达到通关分、复测达到过关线。不能自己点“完成”。</div>'
   +rows+'<div style="height:30px"></div></div>';
}
function rxStepHint(s,need,k){
  if(s.t==='学')return '读完「'+esc(k.name||'该知识点')+'」的已上架讲解，并答对 1 道理解题。';
  if(s.t==='练题')return '完成 '+need+' 道该知识点的题（按作答记录计数，重复答同一题不重复计）。';
  if(s.t==='演练')return '完成 1 场演练，得分 ≥ '+need+' 分。';
  if(s.t==='复测')return '间隔 3/7/14 天后复测，掌握度 ≥ '+((typeof KP_PASS!=='undefined')?KP_PASS:70)+'。';
  return '';
}
A.rxPackGo=el=>{const p=S.packs.find(x=>x.id===el.dataset.id);if(!p)return;const i=+el.dataset.i;const s=p.steps[i];if(!s||s.done)return;
  R.packStep=i;
  if(s.t==='学'){const k=kp(p.kp);const c=k?kpMounted(k).find(x=>usableC(x)&&isPub(x)):null;
    if(!c)return toast('这个知识点还没有已上架讲解，已记入待办','warn');
    R.packQuizKp=p.kp;R.page='quiz';R.quizCtx={mode:'pack',packId:p.id,kp:p.kp};return rxPackLearnStart(p,c)}
  if(s.t==='练题'){R.page='quiz';R.quizCtx={mode:'pack',packId:p.id,kp:p.kp,need:packStepNeed(s)};return qzStartPack(p)}
  if(s.t==='演练'){const d=drPick(ME.mid,p.kp);if(!d)return toast('还没有可练的演练，已记入待办','warn');R.page='drill';DZ={id:d.id,i:0,step:'intro',text:'',hint:false,log:[],chg:{},packId:p.id};return renderRN()}
  if(s.t==='复测'){R.page='quiz';R.quizCtx={mode:'pack',packId:p.id,kp:p.kp,retest:true};return qzStartPack(p)}
};
/* 学：先看做讲解，再做 1 道理解题 */
function rxPackLearnStart(p,c){
  const qs=qsOf(p.kp,'已定稿');
  if(!qs.length)return toast('这个知识点还没有题，先完成阅读即可','warn');
  R.page='quiz';R.quizCtx={mode:'pack',packId:p.id,kp:p.kp,need:1,learn:true};
  return qzStartPack(p);
}
A.rxPackRead=el=>{const p=S.packs.find(x=>x.id===el.dataset.id);if(!p)return;renderRN();toast('已记录阅读，接着答 1 道理解题','ok')};

/* ---------- 学习包步骤推进（被作答/演练结算调用） ---------- */
function rxPackOnQuiz(packId,qid,ok){
  const p=S.packs.find(x=>x.id===packId);if(!p)return false;
  if(!ok)return false;
  const s=(p.steps||[]).find(x=>!x.done&&(x.t==='练题'||x.t==='学'||x.t==='复测'));if(!s)return false;
  s._ev=s._ev||{};s._ev[qid]=1;
  const need=(s.t==='学')?1:packStepNeed(s);
  if(Object.keys(s._ev).length>=need)return packAdvance(p,s.t==='学'?'学':s.t==='复测'?'复习':'题',qid);
  return false;
}
function rxPackOnDrill(packId,score){
  const p=S.packs.find(x=>x.id===packId);if(!p)return false;
  const s=(p.steps||[]).find(x=>!x.done&&x.t==='演练');if(!s)return false;
  if(score<packStepNeed(s))return false;
  return packAdvance(p,'演练','D'+today);
}

/* ---------- 错题本 ---------- */
function rxMisRows(){
  const L=misOf(ME.mid);
  const by={};L.forEach(m=>{(by[m.kp]=by[m.kp]||[]).push(m)});
  return Object.keys(by).map(k=>({kp:k,rows:by[k],recur:by[k].some(x=>x.status==='recurred'),cnt:by[k].reduce((a,b)=>a+b.count,0),last:by[k].map(x=>x.lastTs||'').sort().pop()}))
    .sort((a,b)=>(b.recur-a.recur)||(b.cnt-a.cnt));
}
function rxMisHtml(){
  const rows=rxMisRows();
  return rnav('错题本',true)+'<div class="rx-wrap"><div class="rx-note">成绩只在系统里记录；错题关闭由系统判定（再做对），不能手动关。</div>'
   +(rows.length?rows.map(x=>{const k=kp(x.kp)||{};return '<div class="rx-card"><div class="rx-card-h"><b>'+esc(k.name||x.kp)+'</b>'+(x.recur?'<span class="rst2 err">复发置顶</span>':'')+'</div><div class="rx-meta">错 '+x.cnt+' 次 · 最近 '+esc((x.last||'').slice(5))+'</div>'
     +x.rows.slice(0,2).map(m=>'<div class="rx-q"><div>你当时：'+esc(m.quote||'（无原文）')+'</div>'+(m.goldId&&content(m.goldId)?'<div class="hint">金牌话术：'+esc(content(m.goldId).title)+'</div>':'')+'</div>').join('')
     +'<button class="rb" data-act="rxMisPractice" data-kp="'+x.kp+'">再练一次</button></div>'}).join('')
   :'<div class="rx-empty">没有错题。做完诊断测后，答错的题会汇总到这里。</div>')+'<div style="height:30px"></div></div>';
}
A.rxMisPractice=el=>{const kpId=el.dataset.kp;R.quizCtx={mode:'practice',kp:kpId};R.page='quiz';qzStart('practice',kp(kpId),qPick(kpId,3));renderRN()};

/* ---------- 消息 ---------- */
function rxMsgList(){
  return (S.notices||[]).filter(n=>!n.mid||n.mid===ME.mid).slice(0,30);
}
function rxMsgHtml(){
  const L=rxMsgList();
  return rnav('消息',true)+'<div class="rx-wrap">'+(L.length?L.map(n=>'<div class="rx-card '+(n.read?'':'unread')+'"><div class="rx-card-h"><b>'+esc(n.m)+'</b><span class="hint">'+esc(n.t||'')+'</span></div></div>').join(''):'<div class="rx-empty">暂无消息</div>')+'</div>';
}

/* ---------- 反馈回流 ---------- */
function rxFbPush(type,kpId,ref,text){
  S.fbk2=S.fbk2||[];
  S.fbk2.unshift({id:'F'+(S.fbk2.length+1),type,mid:ME.mid,kp:kpId||'',ref:ref||'',text:text||'',ts:today,st:'待处理'});
}
A.rxFbKp=el=>{rxFbPush('缺内容',el.dataset.kp,'','学员反馈该知识点缺讲解');toast('已通知培训部','ok');renderRN()};
A.rxFbQuiz=el=>{rxFbPush('题目有问题',R.quizCtx&&R.quizCtx.kp||'',el.dataset.q||'','学员反馈题目有问题');toast('已反馈，培训部会复核这道题','ok')};
A.rxFbDrill=el=>{rxFbPush('评分不对',el.dataset.kp||'','','学员反馈演练评分不准确');toast('已反馈，会用于调整评分规则','ok')};

/* ---------- 首页：我的待办（合并今日待学习/学习包/错题/消息） ---------- */
function rxTodoList(){
  const out=[];
  try{const isCtrl=(typeof personOf==='function'&&(personOf(ME.mid)||{}).group==='对照批');
    if(!isCtrl)(packsOf(ME.mid)).filter(p=>p.status!=='已完成').forEach(p=>out.push({w:3,t:'学习包 · '+p.name,d:'截止 '+p.due,act:'rxGoPack',id:p.id,btn:'去完成'}))}catch(e){}
  try{if(typeof rvRnTodo==='function')rvRnTodo().forEach(x=>out.push(x))}catch(e){}
  try{const mo=rxMisRows();if(mo.length)out.push({w:2,t:'错题本有 '+mo.length+' 个知识点待巩固',d:mo.filter(x=>x.recur).length+' 个复发',act:'rxGoMis',btn:'去看'})}catch(e){}
  try{const n=(S.notices||[]).filter(x=>(!x.mid||x.mid===ME.mid)&&!x.read).length;if(n)out.push({w:1,t:'你有 '+n+' 条新消息',d:'报名 / 分班 / 学习包 / 反馈处理',act:'rxGoMsg',btn:'查看'})}catch(e){}
  return out.sort((a,b)=>b.w-a.w).slice(0,5);
}
A.rxGoPack=el=>{R.packId=el.dataset.id;R.page='pack';renderRN()};
A.rxGoMis=()=>{R.page='mis';renderRN()};
A.rxGoMsg=()=>{R.page='msg';renderRN()};
