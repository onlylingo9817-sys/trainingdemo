/* ========== 入店辅导 v25 ==========
   按《入店辅导五维度提炼参考》组织：学 / 练 / 检 / 用 / 馈。
   工单是“辅导项目”，不是一张状态卡；从发现 → 定计划 → 到店执行 → 陪跑反馈 → 复测结案，全程留痕。 */
const COACH_STEPS=[['触发','为什么去'],['计划','学什么·练什么'],['到店','现场检核'],['陪跑','用起来·日周月反馈'],['复测','效果是否回来'],['结案','结论与沉淀']];
const COACH_LEARN=[
 ['关键岗位','店长 / 主管 / 内训师工作标准与看板','岗位标准、管理看板、例会机制'],
 ['产品知识','本品知识、竞品对比话术','产品卖点、竞品攻防、配置折算'],
 ['销售流程','邀约 → 接待 → 试驾 → 关单','全流程动作、CEMN 判断工具'],
 ['标杆参访','当地标杆门店参访交流','现场观察、复盘、可复制动作']
];
const COACH_PRACTICE=[
 ['产品强化','双 7 系列 / 澎程系列 / 竞品应对','按门店实际短板选 1-2 项'],
 ['政策权益','权益 / 政策 / 金融 / 服务促单话术','必须用最新政策口径'],
 ['话术工具','SPIN / 问听应 / FROM-NEEDS / CEMN','选一个主工具练透'],
 ['动作固化','电话邀约 → 接待 → 试乘试驾 → 商谈关单','按真实场景串联演练']
];
const COACH_CHECK={
 pre:[['留资回访效率','是否及时、是否留下下一步'],['邀约话术','是否给出两个时间选项'],['企微沟通','是否合规、是否可追踪'],['新媒体合规','宣传口径是否符合规范'],['现场接待全流程','迎宾 → 探需 → 讲车 → 试驾 → 商谈']],
 during:[['运营维度','明检与合规内容是否到位'],['展厅接待能力','开场、探需、讲车是否完整'],['试乘试驾能力','路线、讲解、体验点是否到位'],['购车商谈能力','报价、异议、关单推进'],['客户跟进能力','回访节奏与记录'],['员工心声','发展需求、对管理的反馈']]
};
const COACH_TRACK=[
 ['留资率','线索留资 / 到店客流'],['首触率','首次触达 / 分配线索'],['排程试驾率','排程试驾 / 邀约到店'],['HAD 试驾率','HAD 试驾 / 总试驾'],
 ['试驾质检达标率','质检达标 / 抽检试驾'],['心愿单保存率','试驾后保存心愿单 / 试驾'],['试驾满意度','满意样本 / 有效评价']
];
function coachPlanOf(x){
  x.learn=x.learn||COACH_LEARN.slice(0,3).map(r=>({name:r[0],detail:r[1],on:true}));
  x.practice=x.practice||COACH_PRACTICE.slice(0,3).map(r=>({name:r[0],detail:r[1],on:true}));
  x.checks=x.checks||{pre:COACH_CHECK.pre.map(r=>({name:r[0],detail:r[1],done:false})),during:COACH_CHECK.during.map(r=>({name:r[0],detail:r[1],done:false}))};
  x.track=x.track||COACH_TRACK.slice(0,5).map(r=>({name:r[0],formula:r[1],on:true,base:'',target:''}));
  x.post=x.post||null;x.feedback=x.feedback||[];x.log=x.log||[];
  return x;
}
function coachStepIndex(st){return Math.max(0,COACH_STEPS.findIndex(x=>x[0]===st))}
function coachProgress(x){
  coachPlanOf(x);let n=0,d=0;
  d++;if(x.st!=='触发')n++;
  d+=2;if(x.st!=='触发')n++;if((x.learn||[]).some(y=>y.on)&&(x.practice||[]).some(y=>y.on))n++;
  d+=2;if(['到店','陪跑','复测','结案'].includes(x.st))n++;if((x.checks.pre||[]).every(y=>y.done)&&(x.checks.during||[]).filter(y=>y.done).length>=2)n++;
  d+=2;if(['陪跑','复测','结案'].includes(x.st))n++;if((x.feedback||[]).length>=2)n++;
  d++;if(x.post)n++;
  d++;if(x.st==='结案')n++;
  return Math.round(n/d*100);
}
function coachNext(x){
  if(x.st==='触发')return {t:'先确认辅导目标',d:'看触发原因，补齐门店负责人和到店时间。',act:'tPlan',label:'去定计划'};
  if(x.st==='计划')return {t:'带着学 / 练计划到店',d:'现场按检核清单走一遍，记录真实卡点。',act:'tGoStore',label:'开始到店'};
  if(x.st==='到店')return {t:'把检核结果转成陪跑动作',d:'至少记录 1 条日反馈、1 条周反馈，再进入复测。',act:'tCoaching',label:'进入陪跑'};
  if(x.st==='陪跑')return {t:'复测效果有没有回来',d:'填辅导后的数据和结论，不要只看一个数字。',act:'tRetest',label:'去复测'};
  if(x.st==='复测')return {t:'写结论并沉淀',d:'有效就复制动作，无效就调整计划或升级支持。',act:'tClose',label:'结案'};
  return {t:'已结案',d:'回看结论与动作，决定是否复制到其他门店。',act:'',label:''};
}
function coachMetricOf(x){
  const goal=String(x.goal||'');
  const known=['留资率','首触率','排程试驾率','HAD 试驾率','试驾质检达标率','心愿单保存率','试驾满意度','邀约→试驾转化比例','关键词开口率','到店率','试驾率','转化率','掌握度'];
  const found=known.find(n=>goal.includes(n));
  const name=found||'本店目标指标';
  const formula=(COACH_TRACK.find(r=>r[0]===name)||[])[1]||'与项目培训目标一致';
  const target=(goal.match(/→\s*([^·;；,，]+)/)||[])[1]||'';
  return {name,formula,base:x.pre,target:(x.goalTarget||target).trim()};
}
function coachGoalText(x){const m=coachMetricOf(x);return m.name+' '+x.pre+'% → '+(m.target||x.goal)}
function coachNewTicket(o){
  const x=coachPlanOf(Object.assign({id:'W'+(S.tickets.length+1),st:'触发',owner:'-',trig:'目标未达成',src:'推荐辅导店',log:[]},o));
  x.log.unshift({t:today,who:meShort(),act:'创建辅导项目',note:x.src});
  S.tickets.push(x);return x;
}
function mkTickets(p,n,src){
  if(!p.eff)return 0;const rows=storeRows(p).filter(r=>!metV(p,r.v)).sort((a,b)=>p.goal.main.dir==='低'?b.v-a.v:a.v-b.v).slice(0,n);let c=0;
  rows.forEach(r=>{if(S.tickets.some(t=>t.store===r.store&&t.proj===p.id))return;coachNewTicket({store:r.store,proj:p.id,src,goal:p.metric+' '+r.v+'% → '+p.target+'%',pre:r.v,trig:'目标未达成'});c++});return c}
function recStores(){
  const inRegion=store=>UI.role.type!=='region'||pp2(store)===UI.role.region;
  const m={};visibleP().filter(p=>p.eff).forEach(p=>storeRows(p).forEach(r=>{if(!inRegion(r.store)||metV(p,r.v))return;const gap=Math.abs(p.target-r.v);const x=m[r.store]||(m[r.store]={store:r.store,score:0,why:[],proj:p.id});x.score+=Math.min(60,40+gap*5);x.why.push('「'+p.name+'」'+r.v+'% 未达目标 '+p.target+'%')}));
  return Object.values(m).map(x=>({...x,score:Math.min(99,Math.round(x.score))})).sort((a,b)=>b.score-a.score).slice(0,8)}
A.mkTicket=el=>{const p=proj(el.dataset.p);const r=p&&storeRows(p).find(x=>x.store===el.dataset.s);if(!p||!r)return toast('找不到门店或项目','err');if(UI.role.type==='region'&&pp2(r.store)!==UI.role.region)return toast('不能给本区域外的门店创建辅导','err');if(S.tickets.some(x=>x.store===r.store&&x.st!=='结案'))return toast('该门店已有进行中的辅导','warn');coachNewTicket({store:r.store,proj:p.id,src:'推荐辅导店',goal:p.metric+' '+r.v+'% → '+p.target+'%',pre:r.v,trig:'目标未达成'});UI.tab.coach='辅导总览';toast('已创建辅导项目（触发）','ok');render()};
const tkVis=()=>S.tickets.filter(t=>UI.role.type!=='region'||pp2(t.store)===UI.role.region);
function coachTabs(){return ['辅导总览','推荐辅导店']}
function coachMetricRow(x){
  const m=coachMetricOf(x);const base=m.base!==''&&m.base!=null?m.base:x.pre;
  return '<div class="coach-metric"><span class="coach-metric-l">核心指标</span><b>'+esc(m.name)+'</b><span class="hint">辅导前 '+esc(base==null?'—':base+'%')+' → 目标 '+esc(m.target||'待定')+'</span></div>';
}
function coachStepBar(x){
  const cur=coachStepIndex(x.st);
  return '<div class="coach-steps">'+COACH_STEPS.map((s,i)=>'<div class="coach-step '+(i<cur?'done':i===cur?'on':'')+'"><span>'+String(i+1).padStart(2,'0')+'</span><b>'+s[0]+'</b><small>'+s[1]+'</small></div>').join('')+'</div>';
}
function coachAiSuggestions(){
  const L=tkVis().filter(x=>x.st!=='结案').map(x=>{coachPlanOf(x);const reasons=[];let score=0;
    if(x.st==='复测'){score+=50;reasons.push('已到复测，结果最接近可复用')}
    if(x.st==='陪跑'){score+=30;reasons.push('正在陪跑，适合看执行是否走样')}
    if(x.st==='到店'){score+=20;reasons.push('已到店，适合先补检核记录')}
    if(x.st==='触发'){score+=10;reasons.push('还没定计划，容易拖成“只建了工单”')}
    if(!(x.feedback||[]).length&&['陪跑','复测'].includes(x.st)){score+=12;reasons.push('没有日/周/月反馈，效果无法解释')}
    if(!x.post&&x.st==='复测'){score+=18;reasons.push('还没复测，无法判断是否有效')}
    if(!x.owner||x.owner==='-'){score+=8;reasons.push('还没派辅导人')}
    return {x,score,reasons:reasons.slice(0,3)};
  }).sort((a,b)=>b.score-a.score).slice(0,3);
  return L;
}
function coachAiHtml(){
  const L=coachAiSuggestions();if(!L.length)return '';
  return '<div class="coach-ai"><div class="coach-ai-h"><span class="ai-dot">AI</span><b>先跟哪家店</b><span class="hint">按阶段 / 缺失反馈 / 是否复测排序；只建议，不自动推进</span><button class="link" data-act="aiWhy">依据</button></div>'
   +L.map(({x,reasons})=>'<div class="coach-ai-row"><div><b>'+esc(x.store)+'</b><span class="tag '+(x.st==='复测'?'warn':'blue')+'">'+x.st+'</span><span class="hint">'+esc(reasons.join(' · '))+'</span></div><button class="btn sm" data-act="ticket" data-id="'+x.id+'">打开</button></div>').join('')
   +'</div>';
}

function coachOverview(){
  const L=tkVis();L.forEach(coachPlanOf);const active=L.filter(x=>x.st!=='结案');const st={触发:0,计划:0,到店:0,陪跑:0,复测:0,结案:0};L.forEach(x=>st[x.st]=(st[x.st]||0)+1);
  const done=L.filter(x=>x.post).length;const metrics=L.map(x=>coachProgress(x));const next=L.filter(x=>x.st!=='结案').sort((a,b)=>coachStepIndex(b.st)-coachStepIndex(a.st)).slice(0,3);
  const metric=(l,v,h,color)=>'<div class="stat"><div class="l">'+l+'</div><div class="n" '+(color?'style="color:'+color+'"':'')+'>'+v+'</div><div class="hint">'+h+'</div></div>';
  return srcBar('这页按「学 → 练 → 检 → 用 → 馈」组织入店辅导。工单不是一张卡，而是一个有目标、有检核、有陪跑反馈、有复测结案的辅导项目；建议只提示动作，是否推进由辅导人决定。')
   +((UI.role.type==='region'&&!L.length)?'<div class="card" style="border-color:#f3dc9b;background:#fffbf4"><b>当前区域还没有辅导项目</b><div class="hint" style="margin-top:4px">入店辅导来自两个入口：① 项目进入「评估中」后，在「推荐辅导店」发现未达标门店；② 项目结项时选「转入店辅导」。先确认项目是否已进入评估中，或切换到总部视角查看。</div></div>':'')
   +'<div class="coach-status">'+COACH_STEPS.map((s,i)=>'<span><b>'+s[0]+'</b><em>'+(st[s[0]]||0)+'</em></span>').join('')+'</div>'
   +'<div class="grid g4" style="margin-bottom:16px">'+metric('进行中',active.length,'另有已结案 '+st.结案+' 个')+metric('待复测',st.陪跑+st.复测,'陪跑后要回看数据')+metric('已有复测',done,'结案前必须留结论')+metric('平均完成度',metrics.length?Math.round(metrics.reduce((a,b)=>a+b,0)/metrics.length)+'%':'—','按学/练/检/用/馈计算')+'</div>'
   +coachAiHtml()
   +(L.length?'<div class="coach-board">'+L.map(x=>{const next=coachNext(x);const pct=coachProgress(x);const m=coachMetricOf(x);const base=m.base!==''&&m.base!=null?m.base:x.pre;return '<div class="coach-card" data-act="ticket" data-id="'+x.id+'"><div class="coach-card-h"><div><b>'+esc(x.store)+'</b><span class="tag '+(x.st==='结案'?'ok':x.st==='复测'?'warn':'blue')+'">'+x.st+'</span></div><button class="link" data-act="ticket" data-id="'+x.id+'">打开 →</button></div>'+coachStepBar(x)+coachMetricRow(x)+'<div class="coach-evidence">'+esc(x.trig||'目标未达成')+' · '+esc(x.goal||'')+'</div><div class="coach-next"><span class="coach-next-t">下一步</span><b>'+esc(next.t)+'</b><span>'+esc(next.d)+'</span>'+(next.act?'<button class="btn sm pri" data-act="'+next.act+'" data-id="'+x.id+'">'+next.label+'</button>':'')+'</div><div class="coach-progress"><i style="width:'+pct+'%"></i><span>完成度 '+pct+'%</span></div><div class="coach-card-f">'+(x.owner&&x.owner!=='-'?'辅导人 '+esc(x.owner):'<span class="tag warn">未派辅导人</span>')+'<span class="hint">'+esc(x.src)+(x.feedback&&x.feedback.length?' · 反馈 '+x.feedback.length+' 条':'')+'</span></div></div>'}).join('')+'</div>':'<div class="card"><div class="empty">还没有辅导项目。先从「推荐辅导店」发现一家，或从项目结项「转入店辅导」生成。</div><button class="btn pri" data-act="tab" data-k="coach" data-v="推荐辅导店">看推荐辅导店</button></div>');
}
function coachRec(){
  const rec=recStores();
  return srcBar('推荐店由效果追踪中「未达成目标的门店」评分得出：目标差距越大、涉及项目越多分越高。推荐只说明“值得看”，是否辅导由人决定。')
   +(rec.length?'<div class="tw"><table class="t"><tr><th>门店</th><th>推荐分</th><th>推荐理由</th><th>操作</th></tr>'+rec.map(r=>'<tr><td><b>'+esc(r.store)+'</b></td><td><div style="display:flex;align-items:center;gap:8px"><div class="bar" style="width:100px"><i style="width:'+r.score+'%"></i></div>'+r.score+'</div></td><td style="white-space:normal">'+r.why.map(esc).join('；')+'</td><td>'+(S.tickets.some(x=>x.store===r.store&&x.st!=='结案')?'<span class="hint">已有进行中辅导</span>':'<button class="btn sm pri" data-act="mkTicket" data-s="'+esc(r.store)+'" data-p="'+r.proj+'">发起辅导</button>')+'</td></tr>').join('')+'</table></div>':'<div class="card"><div class="empty">暂无推荐辅导店。需要有项目进入「评估中」，并且有门店未达目标。</div><button class="btn" data-act="go" data-p="projects">去学习项目</button></div>');
}
function pgCoach(){
  const tabs=coachTabs();const t=curTab('coach',tabs);let b='';
  if(t==='辅导总览')b=coachOverview();else b=coachRec();
  return '<div class="ph"><h2>入店辅导 <span class="hint" style="font-weight:400">从发现门店问题到效果回来，按「学 → 练 → 检 → 用 → 馈」走完一个辅导项目</span></h2></div>'+tabsH('coach',tabs)+b;
}
function coachPanel(x,tab){
  coachPlanOf(x);const m=coachMetricOf(x);
  if(tab==='计划'){
    return '<div class="coach-two"><div class="card"><h3>学：到店教什么 <span class="hint">只选门店真正需要的</span></h3>'+COACH_LEARN.map((r,i)=>{const on=(x.learn||[]).some(y=>y.name===r[0]&&y.on);return '<label class="coach-check"><input type="checkbox" data-wc="coachLearn" data-id="'+x.id+'" value="'+esc(r[0])+'" '+(on?'checked':'')+'><div><b>'+esc(r[0])+'</b><span>'+esc(r[2])+'</span></div></label>'}).join('')+'</div>'
     +'<div class="card"><h3>练：让门店伙伴练什么 <span class="hint">按短板选，不贪多</span></h3>'+COACH_PRACTICE.map(r=>{const on=(x.practice||[]).some(y=>y.name===r[0]&&y.on);return '<label class="coach-check"><input type="checkbox" data-wc="coachPractice" data-id="'+x.id+'" value="'+esc(r[0])+'" '+(on?'checked':'')+'><div><b>'+esc(r[0])+'</b><span>'+esc(r[1])+'</span></div></label>'}).join('')+'</div></div>'
     +coachPrescribeHtml(x)+'<div class="card"><h3>辅导目标 <span class="hint">先锁定一个主指标，后面复测才有对照</span></h3><div class="coach-target"><div><label>主指标</label><b>'+esc(m.name)+'</b></div><div><label>辅导前</label><b>'+esc(x.pre==null?'—':x.pre+'%')+'</b></div><div><label>目标</label><input id="coach_goal" data-id="'+x.id+'" value="'+esc(x.goalTarget||m.target||'')+'" placeholder="如 +5pt 或 70%"></div></div><div class="coach-assist"><span>不知道目标怎么定？</span><span class="hint">可参考同城优秀店或项目目标；Demo 中建议 +3~5pt 作为可验证的起步目标。</span><button class="btn sm" data-act="coachGoalSuggest" data-id="'+x.id+'">用 +5pt 起步目标</button></div><div class="hint" style="margin-top:6px">'+esc(m.formula)+'；复测时只对比这个指标，不拿多个数混在一起下结论。</div></div>'
     +'<div class="coach-actions"><button class="btn" data-act="ticket" data-id="'+x.id+'">取消</button><button class="btn pri" data-act="tPlanSave" data-id="'+x.id+'">保存计划，开始到店</button></div>';
  }
  if(tab==='检核'){
    const preDone=(x.checks.pre||[]).filter(r=>r.done).length;const duringDone=(x.checks.during||[]).filter(r=>r.done).length;
    return '<div class="coach-two"><div class="card"><h3>入店前检核 <span class="hint">'+preDone+' / '+(x.checks.pre||[]).length+' 完成</span></h3>'+(x.checks.pre||[]).map((r,i)=>'<label class="coach-check"><input type="checkbox" data-wc="coachCheck" data-id="'+x.id+'" data-phase="pre" data-i="'+i+'" '+(r.done?'checked':'')+'><div><b>'+esc(r.name)+'</b><span>'+esc(r.detail)+'</span></div></label>').join('')+'</div>'
     +'<div class="card"><h3>辅导中检核 <span class="hint">'+duringDone+' / '+(x.checks.during||[]).length+' 完成，至少 2 项</span></h3>'+(x.checks.during||[]).map((r,i)=>'<label class="coach-check"><input type="checkbox" data-wc="coachCheck" data-id="'+x.id+'" data-phase="during" data-i="'+i+'" '+(r.done?'checked':'')+'><div><b>'+esc(r.name)+'</b><span>'+esc(r.detail)+'</span></div></label>').join('')+'</div></div>'
     +'<div class="card"><h3>本次到店记录 <span class="hint">不是打分，是留下可复盘的事实</span></h3><textarea class="w" id="coach_note" data-wc="coachNote" data-id="'+x.id+'" placeholder="例：顾问能讲卖点，但客户说贵时马上让价；试驾路线没有结合家庭场景。">'+esc(x.note||'')+'</textarea><div class="hint">建议写“看到了什么 + 影响了什么 + 下次改什么”。</div></div>'
     +'<div class="coach-actions"><span class="hint" style="margin-right:auto">'+((duringDone>=2&&(x.note||'').trim())?'<span class="tag ok">可以进入陪跑</span>':'<span class="tag warn">完成 2 项检核 + 写一条记录后可进入陪跑</span>')+'</span><button class="btn" data-act="ticket" data-id="'+x.id+'">取消</button><button class="btn pri" data-act="tGoSave" data-id="'+x.id+'">完成到店，进入陪跑</button></div>';
  }
  if(tab==='陪跑'){
    const need=['日','周','月'].filter(k=>!(x.feedback||[]).some(f=>f.kind===k));
    const mark=k=>(x.feedback||[]).some(f=>f.kind===k)?'<span class="tag ok">已留</span>':'<span class="tag warn">待留</span>';
    return '<div class="coach-two"><div class="card"><h3>用：辅导后跟踪什么 <span class="hint">选指标，实时跟踪</span></h3>'+(x.track||[]).map((r,i)=>'<label class="coach-check"><input type="checkbox" data-wc="coachTrack" data-id="'+x.id+'" data-i="'+i+'" '+(r.on?'checked':'')+'><div><b>'+esc(r.name)+'</b><span>'+esc(r.formula)+'</span></div></label>').join('')+'<div class="hint">日看动作、周看趋势、月看结果；不要用单日波动下结论。</div></div>'
     +'<div class="card"><h3>反馈节奏 <span class="hint">日 / 周 / 月各留一条，辅导才不是“来一趟就走”</span></h3><div class="coach-feedback"><div><span class="tag blue">日</span><b>每日关注数据与动作</b><span>'+mark('日')+'<em>问题点当天复盘、纠偏</em></span></div><div><span class="tag pri">周</span><b>周度复盘数据变化</b><span>'+mark('周')+'<em>纵向看自己，横向看同城优秀店</em></span></div><div><span class="tag warn">月</span><b>陪跑结束总结</b><span>'+mark('月')+'<em>数据变化 + 店长反馈 + 后续动作</em></span></div></div>'+(need.length?'<div class="coach-empty-ai"><span>还缺 '+need.join(' / ')+' 反馈，补一条再进入复测更稳。</span><button class="btn sm" data-act="coachFocusFb" data-id="'+x.id+'" data-v="'+need[0]+'">现在补'+need[0]+'反馈</button></div>':'')+'</div></div>'
     +'<div class="card"><h3>已留反馈 <span class="hint">'+(x.feedback||[]).length+' 条</span></h3>'+((x.feedback||[]).length?'<div class="coach-feed-list">'+x.feedback.map(f=>'<div class="coach-feed"><span class="tag '+(f.kind==='日'?'blue':f.kind==='周'?'pri':'warn')+'">'+f.kind+'</span><div><b>'+esc(f.title||'')+'</b><div class="hint">'+esc(f.text||'')+'</div></div><small>'+esc(f.t)+'</small></div>').join('')+'</div>':'<div class="hint">还没有反馈。建议今天先留一条日反馈。</div>')+'<div class="coach-feed-form"><select id="coach_fb_kind">'+['日','周','月'].map(k=>'<option '+(need[0]===k?'selected':'')+'>'+k+'</option>').join('')+'</select><input id="coach_fb_title" placeholder="一句话结论，如「周日到店量下降」"><textarea id="coach_fb_text" placeholder="具体看到什么、准备怎么纠偏"></textarea><button class="btn pri" data-act="coachFb" data-id="'+x.id+'">添加反馈</button></div></div>'
     +'<div class="coach-actions"><button class="btn" data-act="ticket" data-id="'+x.id+'">取消</button><button class="btn pri" data-act="tRetest" data-id="'+x.id+'" '+(need.length?'data-warn="1"':'')+'>'+(need.length?'仍要复测':'进入复测')+'</button></div>';
  }
  if(tab==='复测'){
    const done=x.post;const pre=x.pre==null?0:x.pre;const vr=done?+done.value:pre+2.8;const delta=+(vr-pre).toFixed(1);
    return '<div class="coach-two"><div class="card"><h3>复测：效果有没有回来 <span class="hint">至少 2 周后再看，避免当天波动</span></h3>'+coachMetricRow(x)+'<div class="coach-retest"><div><label>辅导前</label><b>'+esc(pre+'%')+'</b></div><div><label>复测值</label><input id="coach_post" type="number" step="0.1" value="'+esc(done?done.value:vr.toFixed(1))+'" placeholder="%"></div><div><label>变化</label><b class="'+(delta>=0?'coach-up':'coach-down')+'">'+(delta>=0?'+':'')+delta+'pt</b></div></div><div class="fld"><label>复测结论</label><select id="coach_result">'+['有效，继续巩固','有改善，但还不稳定','没有改善，需要调整计划','数据不足，延长观察'].map(o=>'<option '+(done&&done.result===o?'selected':'')+'>'+o+'</option>').join('')+'</select></div><div class="fld"><label>下一步动作</label><textarea id="coach_next" placeholder="例：把有效话术复制到早会；对未改善的顾问再做一次一对一">'+esc(done?done.next:'')+'</textarea></div><div class="hint">复测不是打分，是判断“这次辅导值不值得复制”。</div></div>'
     +'<div class="card"><h3>过程 → 结果 <span class="hint">过程和结果要对得上</span></h3><div class="coach-review">'+[['学',(x.learn||[]).filter(y=>y.on).map(y=>y.name).join('、')||'未选'],['练',(x.practice||[]).filter(y=>y.on).map(y=>y.name).join('、')||'未选'],['检',(x.checks.pre||[]).filter(y=>y.done).length+' / '+(x.checks.pre||[]).length+' 项完成'],['馈',(x.feedback||[]).length+' 条反馈']].map(r=>'<div><span>'+r[0]+'</span><b>'+esc(r[1])+'</b></div>').join('')+'</div><div class="coach-interp"><span class="tag '+(delta>=2?'ok':delta>0?'warn':'err')+'">'+(delta>=2?'结果有改善':delta>0?'有改善但幅度小':'没有改善')+'</span><span>'+(delta>=2?'可以复制有效动作':'先回看检核和陪跑记录，再决定是否调整计划')+'</span></div><div class="hint" style="margin-top:6px">如果过程和结果不一致，优先回看“检”与“用”，不要只怪学员。</div></div></div>'
     +'<div class="coach-actions"><button class="btn" data-act="ticket" data-id="'+x.id+'">取消</button><button class="btn pri" data-act="coachPostSave" data-id="'+x.id+'">保存复测</button></div>';
  }
  if(tab==='结案'){
    return '<div class="card"><h3>结案结论 <span class="hint">把这次辅导变成下一次可复用的东西</span></h3><div class="coach-summary"><div><span>辅导目标</span><b>'+esc(x.goal)+'</b></div><div><span>复测</span><b>'+(x.post?esc(x.post.value+'% / '+x.post.result):'未复测')+'</b></div><div><span>完成度</span><b>'+coachProgress(x)+'%</b></div></div><div class="fld"><label>结论</label><select id="coach_close_res">'+['有效，复制到其他门店','部分有效，继续巩固','无效，调整方案','暂不结案'].map(o=>'<option '+(x.closeRes===o?'selected':'')+'>'+o+'</option>').join('')+'</select></div><div class="fld"><label>复盘一句话</label><textarea id="coach_close_why" placeholder="哪件事最有用？哪件事下次不做了？">'+esc(x.closeWhy||'')+'</textarea></div><div class="fld"><label><input type="checkbox" id="coach_sink" '+(x.topicId?'checked disabled':'')+'> 把这次经验沉淀到课题池'+(x.topicId?'（已沉淀到 '+esc(x.topicId)+'）':'')+'</label><div class="hint">沉淀后出现在「课题池」，可继续生成内容或建学习项目；不自动改学员和门店数据。</div></div><div class="fld"><label>可沉淀动作</label><div class="coach-tags">'+['话术','检核表','陪跑节奏','门店管理动作','培训内容'].map(t=>'<span class="tag" data-act="coachAsset" data-id="'+x.id+'" data-v="'+t+'">+ '+t+'</span>').join('')+'</div><div class="hint">点击添加；Demo 只留标记，正式版应回写内容中心 / 知识点。</div></div></div><div class="coach-actions"><button class="btn" data-act="ticket" data-id="'+x.id+'">取消</button><button class="btn pri" data-act="coachClose" data-id="'+x.id+'">结案</button></div>';
  }
  return '';
}
A.ticket=el=>{const x=coachPlanOf(S.tickets.find(t=>t.id===el.dataset.id));if(!x)return;const tab=UI.sel.coachTab||'概览';const next=coachNext(x);const tabs=['概览','计划','检核','陪跑','复测','结案'];
  const body='<div class="coach-detail">'+coachStepBar(x)+'<div class="coach-detail-h"><div><b>'+esc(x.store)+'</b> <span class="tag '+(x.st==='结案'?'ok':'blue')+'">'+x.st+'</span></div><div class="hint">'+esc(x.src)+(x.proj?' · <a class="link" data-act="go" data-p="detail" data-id="'+x.proj+'">'+esc(proj(x.proj).name)+'</a>':'')+' · 辅导人 '+esc(x.owner||'-')+'</div></div>'+'<div class="coach-evi"><span>触发证据</span><b>'+esc(x.trig||'目标未达成')+'</b> <span class="hint">'+esc(x.goal||'')+'</span></div>'
   +'<div class="coach-tabs">'+tabs.map(t=>'<span class="'+(tab===t?'on':'')+'" data-act="coachTab" data-id="'+x.id+'" data-v="'+t+'">'+t+'</span>').join('')+'</div>'
   +(tab==='概览'?'<div class="coach-next"><span class="coach-next-t">下一步</span><b>'+esc(next.t)+'</b><span>'+esc(next.d)+'</span>'+(next.act?'<button class="btn sm pri" data-act="'+next.act+'" data-id="'+x.id+'">'+next.label+'</button>':'')+'</div>'+coachMetricRow(x)+'<div class="coach-two"><div class="card" style="margin:0"><h3>学 / 练 / 检 / 用 / 馈</h3><div class="coach-pillars">'+[['学',(x.learn||[]).filter(y=>y.on).length+' 项'],['练',(x.practice||[]).filter(y=>y.on).length+' 项'],['检',((x.checks.pre||[]).filter(y=>y.done).length+(x.checks.during||[]).filter(y=>y.done).length)+' 项'],['用',(x.track||[]).filter(y=>y.on).length+' 指标'],['馈',(x.feedback||[]).length+' 条']].map(r=>'<div><span>'+r[0]+'</span><b>'+r[1]+'</b></div>').join('')+'</div></div><div class="card" style="margin:0"><h3>为什么来 <span class="hint">'+esc(x.trig)+'</span></h3><div class="coach-flow">'+COACH_STEPS.map((s,i)=>'<div class="'+(i<=coachStepIndex(x.st)?'on':'')+'"><i></i><b>'+s[0]+'</b><span>'+s[1]+'</span></div>').join('')+'</div></div></div>'+coachPanel(x,'')+'':coachPanel(x,tab))
   +'<div class="coach-log"><h4>过程记录</h4>'+((x.log||[]).length?x.log.slice(0,8).map(l=>'<div><span>'+esc(l.t)+'</span><b>'+esc(l.who)+'</b>'+esc(l.act)+(l.note?' <span class="hint">'+esc(l.note)+'</span>':'')+'</div>').join(''):'<div class="hint">还没有记录</div>')+'</div></div>';
  openDlg('辅导项目 · '+x.store,body,'<button class="btn" data-act="close">关闭</button>',true);
};
A.coachTab=el=>{UI.sel.coachTab=el.dataset.v;A.ticket({dataset:{id:el.dataset.id}})};
A.tPlan=el=>{UI.sel.coachTab='计划';A.ticket({dataset:{id:el.dataset.id}})};
A.tGoStore=el=>{UI.sel.coachTab='检核';A.ticket({dataset:{id:el.dataset.id}})};
A.tCoaching=el=>{UI.sel.coachTab='陪跑';A.ticket({dataset:{id:el.dataset.id}})};
A.tRetest=el=>{UI.sel.coachTab='复测';A.ticket({dataset:{id:el.dataset.id}})};
A.tClose=el=>{UI.sel.coachTab='结案';A.ticket({dataset:{id:el.dataset.id}})};
function coachSave(x,st,act,note){if(st)x.st=st;x.log.unshift({t:today,who:meShort(),act,note:note||''});S.tickets=S.tickets.slice();if(UI.page==='coach')render();notify('辅导项目「'+x.store+'」：'+act)}
A.coachLearn=el=>{const x=coachPlanOf(S.tickets.find(t=>t.id===el.dataset.id));const r=(x.learn||[]).find(y=>y.name===el.value);if(r)r.on=el.checked;render()};
A.coachPractice=el=>{const x=coachPlanOf(S.tickets.find(t=>t.id===el.dataset.id));const r=(x.practice||[]).find(y=>y.name===el.value);if(r)r.on=el.checked;render()};
A.coachGoalSuggest=el=>{const x=coachPlanOf(S.tickets.find(t=>t.id===el.dataset.id));x.goalTarget='+'+(5)+'pt';if(x.track&&x.track[0])x.track[0].target=x.goalTarget;A.ticket({dataset:{id:x.id}});toast('已建议 +5pt，请根据实际调整','ok')};
A.coachGoal=el=>{const x=coachPlanOf(S.tickets.find(t=>t.id===el.dataset.id));x.goalTarget=el.value;if(x.track&&x.track[0])x.track[0].target=el.value;}
A.tPlanSave=el=>{const x=coachPlanOf(S.tickets.find(t=>t.id===el.dataset.id));const gi=$('#coach_goal');if(gi&&gi.value.trim())x.goalTarget=gi.value.trim();if(!x.goalTarget&&!coachMetricOf(x).target)return toast('请填写辅导目标','err');if(!(x.learn||[]).some(y=>y.on))return toast('至少选 1 项“学”的内容','err');if(!(x.practice||[]).some(y=>y.on))return toast('至少选 1 项“练”的内容','err');x.st='到店';x.owner=x.owner==='-'?UI.role.name:x.owner;coachSave(x,'到店','完成辅导计划','学 '+x.learn.filter(y=>y.on).length+' 项；练 '+x.practice.filter(y=>y.on).length+' 项；目标 '+coachMetricOf(x).target);toast('计划已保存，进入「到店」','ok');UI.sel.coachTab='检核';A.ticket({dataset:{id:x.id}})};
A.coachCheck=el=>{const x=coachPlanOf(S.tickets.find(t=>t.id===el.dataset.id));const i=+el.dataset.i;(x.checks[el.dataset.phase]||[])[i].done=el.checked;render()};
A.coachNote=el=>{const x=coachPlanOf(S.tickets.find(t=>t.id===el.dataset.id));x.note=el.value};
A.tGoSave=el=>{const x=coachPlanOf(S.tickets.find(t=>t.id===el.dataset.id));const n=($('#coach_note')||{}).value||x.note||'';x.note=n;if(!n.trim())return toast('先写一条到店记录，再进入陪跑','err');const dn=(x.checks.during||[]).filter(y=>y.done).length;if(dn<2)return toast('辅导中检核至少完成 2 项','err');coachSave(x,'陪跑','完成到店检核','检核 '+dn+' 项；记录：'+n.slice(0,30));toast('已记录到店结果，进入「陪跑」','ok');UI.sel.coachTab='陪跑';A.ticket({dataset:{id:x.id}})};
A.coachTrack=el=>{const x=coachPlanOf(S.tickets.find(t=>t.id===el.dataset.id));const i=+el.dataset.i;(x.track[i]||{}).on=el.checked;render()};
A.coachFocusFb=el=>{const s=document.querySelector('#coach_fb_kind');if(s){s.value=el.dataset.v;const t=document.querySelector('#coach_fb_title');if(t)t.focus()}toast('请填写'+el.dataset.v+'反馈','')};
A.coachFb=el=>{const x=coachPlanOf(S.tickets.find(t=>t.id===el.dataset.id));const kind=$('#coach_fb_kind')?$('#coach_fb_kind').value:'日';const title=($('#coach_fb_title')||{}).value||'';const text=($('#coach_fb_text')||{}).value||'';if(!title.trim()&&!text.trim())return toast('先写一句反馈','err');x.feedback.push({t:today,who:meShort(),kind,title:title.trim()||text.trim().slice(0,20),text:text.trim()});coachSave(x,'陪跑','添加'+kind+'反馈',title||text);toast('反馈已记录','ok');A.ticket({dataset:{id:x.id}})};
A.coachPostSave=el=>{const x=coachPlanOf(S.tickets.find(t=>t.id===el.dataset.id));const v=parseFloat(($('#coach_post')||{}).value);if(isNaN(v))return toast('请填写复测值','err');const result=($('#coach_result')||{}).value||'有改善，但还不稳定';const next=($('#coach_next')||{}).value||'';x.post={value:v,result,next,pre:x.pre,t:today};x.st='复测';coachSave(x,'复测','记录复测结果',result+'；'+(v-x.pre).toFixed(1)+'pt；'+next);toast('复测已保存，可以结案','ok');UI.sel.coachTab='结案';A.ticket({dataset:{id:x.id}})};
A.coachAsset=el=>{const x=coachPlanOf(S.tickets.find(t=>t.id===el.dataset.id));x.assets=x.assets||[];if(!x.assets.includes(el.dataset.v))x.assets.push(el.dataset.v);toast('已标记可沉淀：'+el.dataset.v,'ok');A.ticket({dataset:{id:x.id}})};
A.coachClose=el=>{const x=coachPlanOf(S.tickets.find(t=>t.id===el.dataset.id));if(!x)return;const res=($('#coach_close_res')||{}).value||'';const why=(($('#coach_close_why')||{}).value||'').trim();if(!why)return toast('请写一句复盘结论','err');const sinkBox=$('#coach_sink');const sink=!!(sinkBox&&sinkBox.checked&&!sinkBox.disabled);x.st='结案';x.closeRes=res;x.closeWhy=why;coachSave(x,'结案','结案：'+res,why);if(sink){const t=coachSinkTopic(x,why);toast('辅导已结案,经验已沉淀到课题池 '+t.id,'ok')}else toast('辅导已结案','ok');A.ticket({dataset:{id:x.id}})};


/* ========== 效果追踪 ========== */
const smallNow=p=>{const e=p.eff;return Math.min(e.a,e.noCtrl?e.a:e.b)<S.cfg.minN};
function pgEffect(){
  const tabs=UI.role.type==='boss'?['效果看板','效果报告','复制与回炉','就绪度','错题集']:['效果看板','就绪度','错题集','调优','效果报告','复制与回炉'];const t=curTab('effect',tabs);let b='';
  const withEff=visibleP().filter(p=>p.eff);
  if(t==='效果看板')b=withEff.length?efBoard(withEff):srcBar('效果数据不是手工录入的:项目提交 → 培训 → 观察期结束后,系统在「评估中」阶段从北斗 BI(业务结果)、汽车语料(行为/话术)、清河大学(掌握度)同步。')+cta('还没有项目产生效果数据',S.projects.length?'已有 '+S.projects.length+' 个项目,但都还没到「评估中」。到项目概览里推进阶段。':'先「新增学习项目」,走完培训,再回来看效果。',S.projects.length?'<button class="btn pri" data-act="go" data-p="projects">去培训项目</button>':'<button class="btn pri" data-act="formNew">新增学习项目</button>');
  if(t==='效果报告')b=rptTab(withEff);
  if(t==='就绪度')return tabsH('effect',tabs)+pgRdy();
  if(t==='错题集')return tabsH('effect',tabs)+pgMis();
  if(t==='调优')return tabsH('effect',tabs)+pgTune();
  if(t==='复制与回炉'){
    const L=visibleP().filter(p=>p.status==='评估中'||p.status==='已结项');
    b=srcBar('结项是闭环的最后一步:项目进入「评估中」后在这里(或项目概览)选结论 → 复制 / 回炉 / 转入店辅导(自动生成辅导工单)/ 终止。')+(L.length?'<div class="grid g2">'+L.map(p=>'<div class="card"><h3>'+esc(p.name)+' '+chip(p.status)+'</h3><div class="hint">'+goalTxt(p)+',当前 '+p.cur+p.unit+(smallNow(p)?'(样本不足,无法判断)':'')+'</div><div style="margin:8px 0">'+(p.status==='已结项'?'结论:<b>'+p.closeRes+'</b> · '+esc(p.closeWhy||''):(smallNow(p)?'样本不足,建议延长观察期或合并下一批再判断':pct(p)>=100?'目标已达成:沉淀好做法并复制到其他区域':'目标未达成:话术回炉或转入店辅导'))+'</div>'+(p.status==='已结项'?'':(UI.role.type==='boss'?'<span class="hint">老板只读,由项目负责人结项</span>':'<button class="btn pri" data-act="closeProj" data-id="'+p.id+'">结项并选结论</button>'))+'</div>').join('')+'</div>':cta('暂无可结项的项目','项目进入「评估中」后出现在这里。',''));
  }
  return '<div class="ph"><h2>效果追踪</h2><span class="hint">扩展现有「数据看板」:学习完成层沿用,新增目标 / 对照 / 三层指标</span></div>'+tabsH('effect',tabs)+b;
}
A.subOk=()=>toast('订阅已保存','ok');
A.efsel=el=>{UI.ef=el.value;UI.drill=[];render()};
function efBoard(list){
  if(!list.some(p=>p.id===UI.ef))UI.ef=list[0].id;
  const p=proj(UI.ef),e=p.eff;const small=smallNow(p);const d=e.did;const asrBad=S.cfg.asrNow<S.cfg.asr;
  const status=small?'<span class="tag warn" style="font-size:14px">无法判断</span>':(metV(p,p.cur)?'<span class="tag ok" style="font-size:14px">已达成</span>':'<span class="tag err" style="font-size:14px">未达成</span>');
  const diff=(d[1]-d[0])-(d[3]-d[2]);
  let b='<div class="fil"><span>选择项目:</span><select data-wc="efsel">'+list.map(i=>'<option value="'+i.id+'" '+(UI.ef===i.id?'selected':'')+'>'+esc(i.name)+'('+i.status+')</option>').join('')+'</select><span class="hint">数据同步于 '+e.syncAt+';观察期结束后留出数据延迟再出结论</span></div>'
   +srcBar('本页每个数字都标注了来源:基线来自创建项目时的北斗 BI / 汽车语料快照;当前值与三层指标在「评估中」阶段同步;样本门槛 '+S.cfg.minN+'、ASR 底线 '+S.cfg.asr+'% 取自「配置中心」。')
   +'<div class="card"><h3>目标 vs 实际 '+status+'</h3><div class="grid g4"><div><div class="hint">指标</div><b>'+p.metric+'</b></div><div><div class="hint">基线</div><b>'+p.base+p.unit+'</b>'+ds(p.baseSrc)+'</div><div><div class="hint">目标(创建时设定)</div><b style="color:var(--pri)">'+p.target+p.unit+'</b></div><div><div class="hint">当前</div><b>'+p.cur+p.unit+'</b></div></div>'+(small?'':'<div style="margin-top:10px"><div class="bar" style="height:12px"><i class="'+(metV(p,p.cur)?'ok':'')+'" style="width:'+Math.min(100,pct(p))+'%"></i></div><div class="hint" style="margin-top:4px">达成进度 '+pct(p)+'%(类型:'+typeTxt(p)+')</div></div>')
   +(small?'<div class="card" style="background:#fff7e0;margin:10px 0 0;border-color:#f3dc9b">样本不足:受训 '+e.a+' 人'+(e.noCtrl?'':' / 对照 '+e.b+' 人')+',低于门槛 '+S.cfg.minN+' 人(配置中心)。只展示趋势,不写「达成 / 未达成」。</div>':'')+'</div>'
   +'<div class="card"><h3>三层指标(受训 vs 对照)</h3><div class="grid g3">'+e.L.map((l,i)=>'<div style="border:1px solid var(--bd);border-radius:6px;padding:12px"><div class="hint">第 '+(i+1)+' 层</div><b>'+l.n+'</b>'+l.rows.map(r=>{const gate=l.asr&&asrBad;return '<div style="display:flex;justify-content:space-between;margin-top:6px;gap:8px"><span class="hint">'+r[0]+(r[2]?ds(r[2]):'')+'</span><b>'+(gate?'<span class="tag warn">数据暂缺</span>':r[1])+'</b></div>'}).join('')+(l.asr&&asrBad?'<div class="hint err" style="margin-top:6px">ASR 准确率 '+S.cfg.asrNow+'% 低于底线 '+S.cfg.asr+'%,关键词类指标暂不展示(配置中心可调)</div>':'')+'</div>').join('')+'</div></div>'
   +'<div class="grid g2"><div class="card"><h3>对照方式与可信度 '+chip(e.trust)+'</h3><div>'+RELEASE[p.rel].n+':'+RELEASE[p.rel].way+'</div><ul class="hint" style="margin:8px 0 0 18px">'+RELEASE[p.rel].why.map(x=>'<li>'+x+'</li>').join('')+'<li>受训 '+e.a+' 人'+(e.noCtrl?'':'、对照 '+e.b+' 人')+'</li></ul>'+e.inf.map(x=>'<div class="tag warn" style="margin-top:6px;display:block;line-height:1.6;padding:2px 8px">可能干扰:'+esc(x)+'</div>').join('')+'<div class="hint" style="margin-top:8px">受训人数口径:'+(p.off&&p.signup==='报名制'?'线下班次培训取报名名额 '+p.quota:'取覆盖范围预估人数')+';'+(p.goal.main.params['离职人员']==='保留'?'离职人员保留在统计内(指标参数「离职人员」=保留)':'观察期内离职人员已剔除 '+(Math.round(e.a*0.03)+hsh(p.id)%3)+' 人,转店 '+(1+hsh(p.id+'t')%4)+' 人已标注并按规则归属(来源:入转调离)')+'</div>'+'<h4>双重差分</h4>'+(small||e.noCtrl?'<div class="hint">'+(e.noCtrl?'没有对照,仅供参考。':'样本不足,不计算结论,仅展示趋势。')+'</div>':'<div>(试点后 − 试点前) − (对照后 − 对照前)<br>= ('+d[1]+' − '+d[0]+') − ('+d[3]+' − '+d[2]+') = <b style="color:'+((p.goal.main.dir==='低'?diff<=0:diff>=0)?'var(--ok)':'var(--err)')+';font-size:18px">'+(diff>=0?'+':'')+diff.toFixed(1)+'pt</b></div><div class="hint">展示相关性,不作因果结论。</div>')+'</div>'
   +'<div class="card"><h3>走势(试点 vs 对照)</h3>'+lineSvg([{n:'试点',c:'#ff6900',d:e.pilot},{n:'对照',c:'#4e8cff',d:e.ctrl,dash:1}],{w:460,h:200,cut:e.cut})+'</div></div>'
   +efDrill(p);
  return b;
}
const NAMES=['刘子涵','陈思远','赵一鸣','孙雅婷','周凯','吴佳怡','郑浩然','王诗琪','冯俊杰'];
function efDrill(p){
  const L=UI.drill;const all=storeRows(p).filter(x=>UI.role.type!=='region'||x.reg===UI.role.region);let rows=[],hd='';
  if(L.length===0){hd='区域';rows=p.aud.regions.filter(r=>all.some(x=>x.reg===r)).map(r=>{const s=all.filter(x=>x.reg===r);const n=s.reduce((a,x)=>a+x.n,0);return{name:r,n,v:+(s.reduce((a,x)=>a+x.v*x.n,0)/n).toFixed(1),c:+(s.reduce((a,x)=>a+x.c*x.n,0)/n).toFixed(1),sub:true}})}
  else if(L.length===1){hd='门店';rows=all.filter(x=>x.reg===L[0]).map(x=>({name:x.store,n:x.n,v:x.v,c:x.c,sub:true}))}
  else{hd='人员';const real=PEOPLE.filter(x=>x.store===L[1]&&eligible(p,x));const nm=real.map(x=>x.name).concat(NAMES.slice(0,3));rows=nm.slice(0,3).map((n,i)=>{const s=all.find(x=>x.store===L[1]);return{name:n,n:1,v:+(s.v+((hsh(n)%60)-30)/10).toFixed(1),c:s.c}})}
  return '<div class="card"><h3>下钻:区域 → 门店 → 人 '+ds('北斗 BI / 汽车语料')+'</h3><div style="margin-bottom:8px"><a class="link" data-act="drill" data-l="">全部区域</a>'+L.map((x,i)=>' › <a class="link" data-act="drill" data-l="'+L.slice(0,i+1).join(',')+'">'+x+'</a>').join('')+'</div><table class="t"><tr><th>'+hd+'</th><th>受训人数</th><th>'+p.metric+'(受训)</th><th>对照</th><th>差值</th><th>是否达目标</th><th></th></tr>'+rows.map(r=>'<tr><td>'+r.name+'</td><td>'+r.n+'</td><td>'+r.v+p.unit+'</td><td>'+r.c+p.unit+'</td><td style="color:'+((p.goal.main.dir==='低'?r.v-r.c<=0:r.v-r.c>=0)?'var(--ok)':'var(--err)')+'">'+(r.v-r.c>=0?'+':'')+(r.v-r.c).toFixed(1)+'pt</td><td>'+(metV(p,r.v)?'<span class="tag ok">达标</span>':'<span class="tag err">未达标</span>')+'</td><td>'+(r.sub?'<button class="link" data-act="drill" data-l="'+L.concat(r.name).join(',')+'">下钻 ›</button>':'')+'</td></tr>').join('')+'</table></div>';
}
A.drill=el=>{UI.drill=el.dataset.l?el.dataset.l.split(','):[];render()};

/* ========== 配置中心 ========== */
function pgConfig(){
  const tabs=['指标库','培训类型默认值','阈值与口径','维度体系','岗位画像','评价口径','学习包模板','内容管理','知识点规则','数据源'];const t=curTab('config',tabs);let b='';
  const cellsOver=()=>{let n=0;[...new Set(PEOPLE.map(x=>x.store))].forEach(s=>WEEKS.forEach(w=>{if(loadAt(s,w)>S.cfg.limit)n++}));return n};
  const resN=Object.values(S.results).reduce((s,r)=>s+Object.values(r).filter(x=>x.offline!=null).length,0);
  if(t==='指标库'){
    const LAY={lrn:'学习过程',beh:'行为 / 话术',biz:'业务结果'};
    b=srcBar('「培训目标」选的指标都从这里来。<b>新增指标 3 步生效:</b>① 在这里定义口径(数据源、分子 / 分母、方向、基线窗口、项目里可调参数)并「启用」→ 立刻出现在「新增学习项目 → 培训目标」的主指标 / 辅助指标里;② (可选)到「培训类型默认值」把它设为某类型的默认主 / 辅助指标;③ 新增项目时选用,提交后取口径快照锁定。改口径只影响之后新增的项目。')
     +'<div class="ph"><span></span><button class="btn pri" data-act="indEdit" data-id="">新增指标</button></div><div class="tw"><table class="t"><tr><th>指标</th><th>状态</th><th>数据源 / 展示层</th><th>口径(分子 ÷ 分母)</th><th>方向</th><th>项目里可配参数</th><th>默认用于(培训类型)</th><th>被项目使用</th><th>操作</th></tr>'
     +S.indicators.map(i=>{const dt=Object.keys(S.cfg.typeDef).filter(k=>S.cfg.typeDef[k].main===i.id||S.cfg.typeDef[k].aux.includes(i.id));return '<tr style="'+(i.on===false?'opacity:.55':'')+'"><td><b>'+esc(i.name)+'</b><div class="hint">'+i.tpl+(i.custom?' · 自定义':'')+'</div></td><td>'+(i.on===false?'<span class="tag">已停用</span>':'<span class="tag ok">已启用</span>')+'</td><td>'+i.src+'<div class="hint">'+(LAY[i.cat]||'业务结果')+'层</div></td><td>'+esc(i.num)+' ÷ '+esc(i.den)+'<div class="hint">基线取近 '+i.bwin+' 天</div></td><td>'+(i.dir==='低'?'越低越好':'越高越好')+'</td><td>'+(i.params.length?i.params.map(p=>'<span class="tag">'+p[0].replace('(选填)','')+'</span>').join(''):'<span class="hint">无</span>')+'</td><td>'+(dt.length?dt.map(k=>'<span class="tag blue">'+k+'</span>').join(''):'<span class="hint">未绑定</span>')+'</td><td>'+indUse(i.id)+' 个</td><td><button class="link" data-act="indEdit" data-id="'+i.id+'">编辑</button><button class="link" data-act="indToggle" data-id="'+i.id+'">'+(i.on===false?'启用':'停用')+'</button>'+(i.custom&&!indUse(i.id)?'<button class="link err" data-act="indDel" data-id="'+i.id+'">删除</button>':'')+'</td></tr>'}).join('')+'</table></div>'
     +'<div class="hint" style="margin-top:8px">例:「新人首月开单率」= 过训后 N 天内有锁单的新人 ÷ 已过训新人。N、统计维度、分母范围、离职人员处理都是参数,在「新增学习项目 → 培训目标」按项目选择;与现有看板「30 天人均锁单量」是两个指标,并存。</div>';
  }
  if(t==='培训类型默认值'){
    b=srcBar('「新增学习项目」选了培训类型后,按这里带出主指标、辅助指标、对照方式、观察周期;线下类(新人训 / 进阶训)还会预置一个「线下班次培训」节点。可改。')
     +'<div class="tw"><table class="t"><tr><th>培训类型</th><th>主指标</th><th>辅助指标</th><th>默认对照方式</th><th>观察周期(天)</th><th>预置节点</th></tr>'+Object.keys(S.cfg.typeDef).map(k=>{const d=S.cfg.typeDef[k];const kk=k.replace(/'/g,'');return '<tr><td><b>'+k+'</b></td><td><select data-wc="tdmain" data-k="'+k+'">'+activeInds().map(i=>'<option value="'+i.id+'" '+(d.main===i.id?'selected':'')+'>'+i.name+'</option>').join('')+'</select></td><td>'+activeInds().filter(i=>i.id!==d.main).map(i=>'<label style="margin-right:8px;white-space:nowrap"><input type="checkbox" data-wc="tdaux" data-k="'+k+'" value="'+i.id+'" '+(d.aux.includes(i.id)?'checked':'')+'> '+i.name+'</label>').join('')+'</td><td><select data-wc="tdrel" data-k="'+k+'">'+Object.keys(RELEASE).map(r=>'<option value="'+r+'" '+(d.rel===r?'selected':'')+'>'+RELEASE[r].n.split('(')[0]+'</option>').join('')+'</select></td><td><input type="number" data-wc="tdcyc" data-k="'+k+'" value="'+esc(d.cycle)+'" style="width:80px;border:1px solid var(--bd);border-radius:4px;padding:3px 6px"></td><td>'+(OFFLINE_TYPES.includes(k)?'线下班次培训':'-')+'</td></tr>'}).join('')+'</table></div>';
  }
  if(t==='阈值与口径'){
    const rows=[
     ['limit','同批人在途任务上限','人',[['学习任务 → 培训日历','projects','培训日历'],['新增学习项目 →「覆盖角色」下发管控','form']],'目前培训日历里有 <b>'+cellsOver()+'</b> 个门店周超限'],
     ['minN','样本量门槛','人',[['新增学习项目 →「覆盖角色」样本提示','form'],['效果追踪 → 效果看板「是否下结论」','effect','效果看板']],'目前 <b>'+S.projects.filter(p=>p.eff&&smallNow(p)).length+'</b> 个项目因样本不足无法判断'],
     ['pass','培训结果通过线','分',[['学习项目详情 → 培训结果「通过 / 未通过」判定','projects']],'已录入线下成绩 <b>'+resN+'</b> 条'],
     ['wOnline','总评中线上成绩占比','%',[['学习项目详情 → 培训结果「总评」计算','projects']],'线下占比 = '+(100-S.cfg.wOnline)+'%'],
     ['asr','话术使用率 ASR 准确率底线','%',[['效果追踪 → 效果看板「行为 / 话术」层']],'当前汽车语料 ASR 准确率 <b>'+S.cfg.asrNow+'%</b>('+(S.cfg.asrNow>=S.cfg.asr?'达标,关键词指标正常展示':'低于底线,关键词指标显示「数据暂缺」')+')'],
     ['topicSess','课题出题:候选聚类最少会话数','条',[['课题池 → 系统出题(判定是否出题)','topics','系统出题']],'已有 <b>'+S.batches.length+'</b> 个批次,已出课题 <b>'+S.topics.filter(t=>t.src==='系统出题').length+'</b> 个'],
     ['topicStores','课题出题:候选聚类最少涉及门店数','家',[['课题池 → 系统出题(判定是否出题)','topics','系统出题']],'与上一项同时满足才出题'],
     ['dislikeTh','话术点踩率预警线','%',[['内容管理 → 使用与反馈「点踩偏高」标记','content','使用与反馈'],['学习项目 → 灰度对比「通过标准」','projects']],'目前 <b>'+S.contents.filter(c=>c.up+c.down>0&&c.down/(c.up+c.down)*100>=S.cfg.dislikeTh).length+'</b> 条内容被标「点踩偏高」'],
     ['hitTh','话术语料命中率预警线','%',[['内容管理 → 使用与反馈「命中偏低」标记','content','使用与反馈']],'目前 <b>'+S.contents.filter(hitLow).length+'</b> 条话术被标「命中偏低」(ASR 达标时才判定)']
    ];
    b=srcBar('系统规则的唯一来源,改了立刻在「作用于」列的页面生效。新人开单率的统计窗口等口径不在这里,在「指标库」。')
     +'<div class="tw"><table class="t"><tr><th>配置项</th><th style="width:110px">当前值</th><th>作用于哪里</th><th>当前引用情况</th></tr>'+rows.map(r=>'<tr><td><b>'+r[1]+'</b></td><td><input type="number" id="cf_'+r[0]+'" value="'+S.cfg[r[0]]+'" style="width:70px;border:1px solid var(--bd);border-radius:4px;padding:4px 6px"> '+r[2]+'</td><td>'+r[3].map(x=>x[1]?'<div><a class="link" data-act="go" data-p="'+x[1]+'"'+(x[2]?' data-t="'+x[2]+'"':'')+'>'+x[0]+'</a></div>':'<div>'+x[0]+'</div>').join('')+'</td><td>'+r[4]+'</td></tr>').join('')+'</table></div><div style="margin-top:10px"><button class="btn pri" data-act="cfgSave">保存</button> <span class="hint">试试把「样本量门槛」改成 50,再看效果看板;或把「ASR 底线」改成 90,看行为 / 话术层变化。</span></div>';
  }
  if(t==='维度体系')b=cfgDims();
  if(t==='岗位画像')b=cfgProfile();
  if(t==='评价口径')b=cfgEval();
  if(t==='学习包模板')b=cfgPack();
  if(t==='知识点规则')b=kpRules();
  if(t==='内容管理'){
    const T=S.cfg.tax;const L={car:'车型',theme:'场景分类',subject:'主题对象',scene:'场景',ability:'能力维度',aud:'适用人群'};
    b=srcBar('内容管理的「分类标签」「有效期提醒」「绝对化用语词表」在这里维护,改了立刻作用于内容管理的筛选、编辑页的下拉、质量检查和到期提醒。')
     +'<div class="card"><h3>标签体系 <span class="hint">用于检索,也是效果归因的挂钩点(能力维度 → 效果)</span></h3><table class="t"><tr><th style="width:110px">维度</th><th>可选值</th><th style="width:260px">新增</th></tr>'+Object.keys(L).map(k=>'<tr><td><b>'+L[k]+'</b></td><td>'+T[k].map(v=>'<span class="tag" style="margin:0 6px 6px 0;padding:3px 8px">'+esc(v)+' <a class="link" data-act="taxDel" data-k="'+k+'" data-v="'+esc(v)+'">×</a></span>').join('')+'</td><td><div style="display:flex;gap:6px"><input type="text" id="tax_'+k+'" placeholder="新值" style="width:140px"><button class="btn sm" data-act="taxAdd" data-k="'+k+'">添加</button></div></td></tr>').join('')+'</table><div class="hint" style="margin-top:6px">删除只影响今后选择,已打了该标签的内容保持不变。能力维度对应文档的「探需、场景化讲车、顾虑解除」三个收敛方向。</div></div>'
     +'<div class="card"><h3>有效期与质量规则</h3><div class="fgrid"><div class="fld"><label>到期提前提醒(天)</label><input type="number" id="cf_expWarn" value="'+S.cfg.expWarn+'" style="width:120px"><div class="fh">内容到期前这么多天进入创建人的「即将到期」待办;到期当天自动下线(可续期 / 改版)</div></div><div class="fld full"><label>绝对化 / 高风险用语词表(逗号分隔)</label><input type="text" id="cf_banned" value="'+esc(S.cfg.banned.join(', '))+'"><div class="fh">内容正文含这些词,质量检查会「提醒」(不拦截,由人决定)。目前 <b>'+S.contents.filter(c=>qcheck(qIn(c)).soft.some(x=>/绝对化/.test(x))).length+'</b> 条内容命中</div></div></div><button class="btn pri" data-act="cfgContent">保存</button></div>'
     +'<div class="card"><h3>硬规则(提交审核前必须满足,代码固定)</h3><div class="hint" style="line-height:2">政策类内容:必须有有效期和出处 · 话术:必须有关键词组 · 其余沿用现有「内容管理」的必填校验(标题、讲师、封面图、可见范围、对应素材)</div></div>';
  }
  if(t==='数据源')b=srcBar('系统里所有「不是人手工录入」的数据都来自这里,只读。点「立即同步」模拟一次拉取。')
    +'<div class="tw"><table class="t"><tr><th>数据源</th><th>系统</th><th>提供什么</th><th>用在哪里</th><th>同步频率</th><th>状态</th></tr>'+DS.map(d=>'<tr><td><b>'+d[0]+'</b></td><td>'+d[1]+'</td><td>'+d[2]+'</td><td>'+d[3]+'</td><td>'+d[4]+'</td><td><span class="tag ok">已连接</span> <button class="link" data-act="dsSync" data-n="'+d[0]+'">立即同步</button></td></tr>').join('')+'</table></div>'
    +'<div class="card" style="margin-top:14px"><h3>人员主数据概况(人事系统)</h3><table class="t"><tr><th>区域</th><th>销售顾问</th><th>其中新人(入职 ≤ 90 天)</th><th>门店</th></tr>'+Object.keys(REG).map(r=>'<tr><td>'+r+'</td><td>'+REG[r].all+'</td><td>'+REG[r].nb+'</td><td>'+REG[r].stores.join('、')+'</td></tr>').join('')+'</table><div class="hint" style="margin-top:6px">「覆盖角色」的预估人数、新人判定都取自这张表;演示名单 '+PEOPLE.length+' 人是其中可在零售通扮演的学员。</div></div>';
  return '<div class="ph"><h2>配置中心</h2></div>'+tabsH('config',tabs)+b;
}
A.tdmain=el=>{const d=S.cfg.typeDef[el.dataset.k];d.main=el.value;d.aux=d.aux.filter(x=>x!==el.value);toast('「'+el.dataset.k+'」默认主指标已改,新增项目时生效','ok');render()};
A.tdaux=el=>{const d=S.cfg.typeDef[el.dataset.k];d.aux=el.checked?[...new Set([...d.aux,el.value])]:d.aux.filter(x=>x!==el.value)};
A.tdrel=el=>{S.cfg.typeDef[el.dataset.k].rel=el.value;toast('默认对照方式已改','ok')};
A.tdcyc=el=>{S.cfg.typeDef[el.dataset.k].cycle=+el.value||30;toast('默认观察周期已改,新增项目时带出','ok')};
A.dsSync=el=>toast('已从「'+el.dataset.n+'」同步最新数据(示意)','ok');
A.addRole=()=>openDlg('添加角色成员','<div class="f"><label><b>*</b>姓名</label><div class="in"><input type="text" id="rn_n"></div></div><div class="f"><label>角色</label><div class="in"><select id="rn_r"><option>区域老师</option><option>总部培训部</option></select></div></div><div class="f"><label>负责区域</label><div class="in"><select id="rn_g">'+allRegions.concat(['全国']).map(r=>'<option>'+r+'</option>').join('')+'</select></div></div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="addRoleOk">添加</button>');
A.addRoleOk=()=>{const n=$('#rn_n').value.trim();if(!n)return toast('请填写姓名','err');S.roles.push({name:n,role:$('#rn_r').value,region:$('#rn_g').value});closeDlg();toast('已添加,线下班次培训的「审批人」下拉里可选','ok');render()};
A.taxAdd=el=>{const k=el.dataset.k;const v=($('#tax_'+k).value||'').trim();if(!v)return toast('请填写新值','err');if(S.cfg.tax[k].includes(v))return toast('已存在','err');S.cfg.tax[k].push(v);render()};
A.taxDel=el=>{const k=el.dataset.k;if(S.cfg.tax[k].length<=1)return toast('至少保留一个','err');S.cfg.tax[k]=S.cfg.tax[k].filter(x=>x!==el.dataset.v);render()};
A.cfgContent=()=>{const n=+$('#cf_expWarn').value;if(!(n>0))return toast('提醒天数请填大于 0 的数','err');S.cfg.expWarn=n;S.cfg.banned=($('#cf_banned').value||'').split(/[,,、\s]+/).map(x=>x.trim()).filter(Boolean);toast('已保存','ok');render()};
A.cfgSave=()=>{const ks=['limit','minN','pass','wOnline','asr','dislikeTh','hitTh','topicSess','topicStores'];const v={};for(const k of ks){v[k]=+$('#cf_'+k).value;if(!(v[k]>0))return toast('请填写大于 0 的数值','err')}
  if(v.wOnline>100||v.asr>100||v.pass>100||v.dislikeTh>100)return toast('占比 / 分数不能超过 100','err');ks.forEach(k=>S.cfg[k]=v[k]);toast('已保存,已在作用的页面生效','ok');render()};
const activeInds=()=>S.indicators.filter(i=>i.on!==false);
const PT=[['text','文本'],['num','数字'],['sel','下拉(填选项)'],['tags','关键词组']];
function pRows(rows){return rows.map((r,k)=>'<div class="row" style="display:grid;grid-template-columns:1.2fr 1fr 1.6fr auto;gap:8px;margin-bottom:6px"><input type="text" class="ip_n" value="'+esc(r[0])+'" placeholder="参数名,如 时间窗口(天)"><select class="ip_t">'+PT.map(t=>'<option value="'+t[0]+'" '+(r[1]===t[0]?'selected':'')+'>'+t[1]+'</option>').join('')+'</select><input type="text" class="ip_v" value="'+esc(r[2])+'" placeholder="'+(r[1]==='sel'?'选项,用 | 分隔,第一个为默认':'默认值')+'"><button class="btn sm err" data-act="ipDel" data-k="'+k+'">删</button></div>').join('')||'<div class="hint">没有参数:项目里不能再调整这个指标的口径</div>'}
function ipCollect(){const rows=[...document.querySelectorAll('.ip_n')].map((x,k)=>[x.value.trim(),document.querySelectorAll('.ip_t')[k].value,document.querySelectorAll('.ip_v')[k].value.trim()]);return rows}
function indChecks(i){
  const r=window._ir,okName=!!$('#in_n').value.trim(),okDef=!!$('#in_a').value.trim()&&!!$('#in_b').value.trim();
  const src=$('#in_s').value;const conn=DS.some(d=>d[1]===src||d[0]===src||src.includes(d[0]));
  const used=Object.keys(S.cfg.typeDef).filter(k=>S.cfg.typeDef[k].main===(i&&i.id)||S.cfg.typeDef[k].aux.includes(i&&i.id));
  const ck=(ok,t,h)=>'<div class="chk '+(ok?'ok':'must')+'"><b>'+(ok?'✓':'!')+'</b><span>'+t+(h?' <span class="hint">'+h+'</span>':'')+'</span></div>';
  return ck(okName&&okDef,'口径完整','名称、分子、分母都已填')+ck(conn,'数据源已连接','「'+src+'」可取数('+(conn?'配置中心 → 数据源':'未连接,取不到数')+')')+ck($('#in_on').checked,'已启用','停用后不会出现在新增项目里')
   +'<div class="chk '+(used.length?'ok':'rec')+'"><b>'+(used.length?'✓':'·')+'</b><span>'+(used.length?'已设为默认指标:'+used.join('、'):'未设为任何类型的默认指标')+' <span class="hint">(可选,在「培训类型默认值」绑定)</span></span></div>'}
A.indRefresh=()=>{const e=$('#ind_chk');if(e)e.innerHTML=indChecks(window._ii)};
A.indEdit=el=>{const i=el.dataset.id?ind(el.dataset.id):{name:'',src:'北斗 BI',tpl:'⑤ 过程量与结果',cat:'biz',num:'',den:'',bwin:30,params:[],rng:[30,50],note:'',dir:'高',on:true,custom:1};window._ii=el.dataset.id?i:null;window._ir=i;
  const opt=(arr,cur)=>arr.map(o=>'<option '+(cur===o?'selected':'')+'>'+o+'</option>').join('');
  openDlg(el.dataset.id?'编辑指标 · '+i.name:'新增指标','<div class="fgrid"><div class="fld full"><label><b>*</b>指标名称</label><input type="text" id="in_n" value="'+esc(i.name)+'" placeholder="如 到店率" oninput="A.indRefresh()"></div>'
   +'<div class="fld"><label><b>*</b>数据源</label><select id="in_s" data-wc="indRef">'+opt(['北斗 BI','汽车语料','清河大学'],i.src)+'</select><div class="fh">决定基线和效果数据从哪里取</div></div>'
   +'<div class="fld"><label>效果页展示层</label><select id="in_c"><option value="lrn" '+(i.cat==='lrn'?'selected':'')+'>学习过程</option><option value="beh" '+(i.cat==='beh'?'selected':'')+'>行为 / 话术</option><option value="biz" '+(i.cat==='biz'?'selected':'')+'>业务结果</option></select><div class="fh">效果追踪「三层指标」里放哪一层</div></div>'
   +'<div class="fld"><label>验证方法模板</label><select id="in_t">'+opt(['① 关键词开口率','② 转化比例','③ 行为出现率','④ 掌握度','⑤ 过程量与结果'],i.tpl)+'</select><div class="fh">项目里会显示为该验证方法</div></div>'
   +'<div class="fld"><label>指标方向</label><select id="in_d"><option value="高" '+(i.dir!=='低'?'selected':'')+'>越高越好(目标需高于基线)</option><option value="低" '+(i.dir==='低'?'selected':'')+'>越低越好(目标需低于基线)</option></select></div>'
   +'<div class="fld full"><label><b>*</b>分子口径</label><input type="text" id="in_a" value="'+esc(i.num)+'" placeholder="如 到店人数" oninput="A.indRefresh()"></div><div class="fld full"><label><b>*</b>分母口径</label><input type="text" id="in_b" value="'+esc(i.den)+'" placeholder="如 邀约人数" oninput="A.indRefresh()"></div>'
   +'<div class="fld"><label>基线取数窗口(天)</label><input type="number" id="in_w" value="'+i.bwin+'"><div class="fh">新增项目时按覆盖范围取近 N 天</div></div><div class="fld"><label>状态</label><label style="font-weight:400"><input type="checkbox" id="in_on" '+(i.on!==false?'checked':'')+' onchange="A.indRefresh()"> 启用(可在新增项目里选用)</label></div>'
   +'<div class="fld full"><label>项目里可调参数 <button class="btn sm" data-act="ipAdd" style="margin-left:8px">+ 加一个参数</button></label><div id="iprows">'+pRows(i.params.map(p=>[p[0],p[1],p[1]==='sel'?p[2]:p[2]]))+'</div><div class="fh">参数在「新增学习项目 → 培训目标」里按项目填,比如时间窗口、统计维度。没有参数就不能在项目里调口径。</div></div></div>'
   +'<div class="card" style="background:#fafbfc;margin:14px 0 0;padding:14px 16px"><h3 style="font-size:14px">生效检查 <button class="btn sm" data-act="indTest">测试取数</button></h3><div id="ind_chk">'+'</div></div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="indSave" data-id="'+(el.dataset.id||'')+'">保存</button>',true);
  A.indRefresh()};
A.indRef=()=>A.indRefresh();
A.ipAdd=()=>{const rows=ipCollect();rows.push(['','text','']);$('#iprows').innerHTML=pRows(rows)};
A.ipDel=el=>{const rows=ipCollect();rows.splice(+el.dataset.k,1);$('#iprows').innerHTML=pRows(rows)};
A.indTest=()=>{const n=$('#in_n').value.trim()||'该指标',h=hsh(n+$('#in_a').value);const v=(20+h%30+(h%10)/10).toFixed(1);toast('测试取数成功:「'+n+'」近 '+($('#in_w').value||30)+' 天基线约 '+v+'%('+$('#in_s').value+',示意值)','ok')};
A.indToggle=el=>{const i=ind(el.dataset.id);i.on=i.on===false;const bound=Object.keys(S.cfg.typeDef).filter(k=>S.cfg.typeDef[k].main===i.id);if(!i.on&&bound.length)toast('已停用。注意「'+bound.join('、')+'」类型默认主指标是它,新增项目时会自动换成第一个启用的指标','');else toast(i.on?'已启用,新增项目里可选':'已停用,新增项目里不再出现(已提交项目不受影响)','ok');render()};
A.indDel=el=>{const bound=Object.keys(S.cfg.typeDef).filter(k=>S.cfg.typeDef[k].main===el.dataset.id||S.cfg.typeDef[k].aux.includes(el.dataset.id));if(indUse(el.dataset.id)||bound.length)return toast('指标正被'+(indUse(el.dataset.id)?indUse(el.dataset.id)+' 个项目':'')+(bound.length?'「'+bound.join('、')+'」类型默认值':'')+'使用,不能删除;可以先停用','err');S.indicators=S.indicators.filter(x=>x.id!==el.dataset.id);toast('已删除','ok');render()};
A.indSave=el=>{const n=$('#in_n').value.trim(),a=$('#in_a').value.trim(),b=$('#in_b').value.trim();if(!n||!a||!b)return toast('请填写指标名称、分子和分母口径','err');
  if(S.indicators.some(x=>x.name===n&&x.id!==el.dataset.id))return toast('已有同名指标','err');
  const rows=ipCollect().filter(r=>r[0]||r[2]);const names=rows.map(r=>r[0]);
  if(rows.some(r=>!r[0]))return toast('参数名不能为空','err');if(new Set(names).size!==names.length)return toast('参数名不能重复','err');
  if(rows.some(r=>r[1]==='sel'&&r[2].split('|').filter(Boolean).length<2))return toast('下拉参数至少填 2 个选项,用 | 分隔','err');
  let i=el.dataset.id?ind(el.dataset.id):null;const isNew=!i;
  if(!i){const h=hsh(n);i={id:'I'+(Math.max(...S.indicators.map(x=>+x.id.slice(1)||0))+1),note:'',custom:1,rng:[18+h%14,36+h%20]};S.indicators.push(i)}
  Object.assign(i,{name:n,src:$('#in_s').value,cat:$('#in_c').value,tpl:$('#in_t').value,dir:$('#in_d').value,num:a,den:b,bwin:+$('#in_w').value||30,on:$('#in_on').checked,params:rows.map(r=>[r[0],r[1],r[2]])});
  closeDlg();toast(isNew?'指标「'+n+'」已创建'+(i.on?',现在可在「新增学习项目 → 培训目标」选用':'(未启用)'):'指标已保存;新增项目时生效,已提交项目保留原口径快照','ok');render()};
function coachPrescribe(x){
  coachPlanOf(x);const m=coachMetricOf(x);const miss=(x.checks.pre||[]).concat(x.checks.during||[]).filter(r=>!r.done).map(r=>r.name);
  const LEARN_BY_CHECK={'留资回访效率':'销售流程','邀约话术':'销售流程','企微沟通':'关键岗位','新媒体合规':'关键岗位','现场接待全流程':'销售流程','运营维度':'关键岗位','展厅接待能力':'销售流程','试乘试驾能力':'产品知识','购车商谈能力':'产品知识','客户跟进能力':'销售流程','员工心声':'关键岗位'};
  const PRACTICE_BY_CHECK={'留资回访效率':'动作固化','邀约话术':'话术工具','企微沟通':'政策权益','新媒体合规':'政策权益','现场接待全流程':'动作固化','运营维度':'政策权益','展厅接待能力':'动作固化','试乘试驾能力':'产品强化','购车商谈能力':'话术工具','客户跟进能力':'动作固化','员工心声':'动作固化'};
  const pickLearn=COACH_LEARN.find(r=>r[0]===(LEARN_BY_CHECK[miss[0]]||'销售流程'))||COACH_LEARN[2];
  const pickPractice=COACH_PRACTICE.find(r=>r[0]===(PRACTICE_BY_CHECK[miss[0]]||'话术工具'))||COACH_PRACTICE[2];
  const learn=[pickLearn];const practice=[pickPractice];
  const check=miss.slice(0,2);
  const fbWeak=(x.feedback||[]).length<2;
  return {goal:m.name+' '+(x.pre==null?'—':x.pre+'%')+' → '+(m.target||'待定'),
    learn:learn.map(r=>r[0]),practice:practice.map(r=>r[0]),check,
    feedback:fbWeak?'日反馈先盯'+m.name+'的日变化,周反馈对比同城店':'已有反馈,复测前补一条月度结论',
    basis:'触发证据「'+(x.trig||'目标未达成')+'」;未完成检核 '+miss.length+' 项'+(x.post?';已有复测值 '+x.post.value+'%':'')};
}
A.coachPrescribeFill=el=>{const x=coachPlanOf(S.tickets.find(t=>t.id===el.dataset.id));if(!x)return;const rx=coachPrescribe(x);
  x.learn=COACH_LEARN.filter(r=>rx.learn.includes(r[0])).map(r=>({name:r[0],detail:r[1],on:true}));
  x.practice=COACH_PRACTICE.filter(r=>rx.practice.includes(r[0])).map(r=>({name:r[0],detail:r[1],on:true}));
  if(rx.goal&&!x.goalTarget)x.goalTarget='+5pt';
  aiLog('门店处方填入计划',x.store,[{name:rx.learn.concat(rx.practice).join('、')}],true);
  toast('已按处方填入学 / 练项与目标,请核对后保存计划','ok');A.ticket({dataset:{id:x.id}})};
function coachPrescribeHtml(x){
  const rx=coachPrescribe(x);
  return '<div class="ai-box coach-rx"><div class="ai-box-h">'+AI_TAG+' <span class="hint">门店处方（草稿）：根据触发证据和未完成的检核生成，只填表不保存</span></div>'
   +'<div class="coach-rx-grid"><div><span>学</span><b>'+rx.learn.map(esc).join('、')+'</b></div><div><span>练</span><b>'+rx.practice.map(esc).join('、')+'</b></div><div><span>检</span><b>'+(rx.check.length?rx.check.map(esc).join('、'):'无未完成项')+'</b></div><div><span>目标</span><b>'+esc(rx.goal)+'</b></div><div><span>馈</span><b>'+esc(rx.feedback)+'</b></div></div>'
   +'<div class="hint" style="margin-top:6px">依据：'+esc(rx.basis)+'</div>'
   +'<div style="margin-top:8px"><button class="btn sm pri" data-act="coachPrescribeFill" data-id="'+x.id+'">采纳，填入计划</button></div></div>';
}
function coachSinkTopic(x,why){
  const rx=coachPrescribe(x);const cs=x.topicId&&topic(x.topicId);if(cs)return toast('已沉淀到课题 '+cs.id,'warn');
  const t=mkTopic({title:'门店辅导经验:'+x.store+' · '+(coachMetricOf(x).name),desc:why,scene:'展厅',obj:coachMetricOf(x).name,sess:0,stores:0,prov:0,trend:x.post?Math.round(x.post.value-(x.pre||0)):0,sug:{type:'辅导复盘',sub:'',ind:'I5',kw:(rx.learn.concat(rx.practice)).join(', '),trig:x.trig||'',base:x.pre||0,regions:ALLR}},'辅导结案回流','系统(入店辅导)','sys',{result:{closeRes:x.closeRes||'',closeWhy:why,post:x.post?x.post.value:null},fromTicket:x.id});
  x.topicId=t.id;coachSave(x,null,'结案经验沉淀到课题',t.id+' · '+why.slice(0,30));return t}
