/* ================= v23 页面:效果·就绪度 / 错题集 / 调优 + 学员详情 + 配置中心四页签 ================= */

/* ---------- 空态:数据被清空时,新页面给出「下一步」而不是崩 ---------- */
const v23Empty=()=>!(S.lrn&&S.lrn.length&&S.profiles&&S.profiles.length&&S.dims&&S.dims.length);
const v23EmptyCta=(what)=>cta('还没有'+what,'v23 的理想态数据(维度、画像、12 周证据、业务结果、错题)在「清空数据」后是空的。点「载入理想态数据」即可恢复;也可以到「配置中心」从零开始配置维度和画像。','<button class="btn pri" data-act="v23Load">载入理想态数据</button>');
/* 理想态数据叠加在 v22 的知识点 / 题 / 内容底座之上,所以「载入」必须走完整的重置,保证只有一套数 */
A.v23Load=()=>{A.reset();A.roleSwitch({value:UI.role.k});UI.page='effect';UI.tab.effect='就绪度'};
/* ---------- 通用小组件 ---------- */
function v23Radar(items,opt){
  /* items: [{label,val,target}] val/target 0-100 */
  opt=opt||{};const n=items.length;const W=opt.w||300,H=opt.h||280,cx=W/2,cy=H/2+4,R=opt.r||104;
  if(!n)return '<div class="hint">没有画像项</div>';
  const pt=(i,v)=>{const a=-Math.PI/2+i*2*Math.PI/n;const rr=R*v/100;return [cx+rr*Math.cos(a),cy+rr*Math.sin(a)]};
  let s='<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:'+W+'px">';
  [25,50,75,100].forEach(g=>{s+='<polygon points="'+items.map((_,i)=>pt(i,g).join(',')).join(' ')+'" fill="none" stroke="#eef0f4" stroke-width="1"/>'});
  items.forEach((_,i)=>{const p=pt(i,100);s+='<line x1="'+cx+'" y1="'+cy+'" x2="'+p[0]+'" y2="'+p[1]+'" stroke="#eef0f4"/>'});
  s+='<polygon points="'+items.map((it,i)=>pt(i,Math.min(100,it.target||100)).join(',')).join(' ')+'" fill="none" stroke="#98a2b3" stroke-width="1.4" stroke-dasharray="4 3"/>';
  s+='<polygon points="'+items.map((it,i)=>pt(i,Math.max(0,Math.min(100,it.val||0))).join(',')).join(' ')+'" fill="rgba(255,103,0,.16)" stroke="#ff6700" stroke-width="2"/>';
  items.forEach((it,i)=>{const p=pt(i,Math.max(0,Math.min(100,it.val||0)));s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3" fill="#ff6700"/>';
    const lp=pt(i,124);s+='<text x="'+lp[0]+'" y="'+lp[1]+'" font-size="10.5" fill="#667085" text-anchor="middle" dominant-baseline="middle">'+esc(it.short||it.label)+'</text>'});
  return s+'</svg>';
}
function v23QuadSvg(rows,opt){
  opt=opt||{};const W=opt.w||520,H=opt.h||300,pl=42,pb=30,pt2=12,pr=14;
  if(!rows.length)return '<div class="hint">没有数据</div>';
  const xs=rows.map(r=>r.rdy),ys=rows.map(r=>r.lock);
  const x0=0,x1=100;const y0=0,y1=Math.max(4,Math.ceil(Math.max(...ys)*1.1));
  const X=v=>pl+(x1-x0?((v-x0)/(x1-x0))*(W-pl-pr):0),Y=v=>pt2+(H-pt2-pb)*(1-(v-y0)/(y1-y0));
  const mx=(x0+x1)/2,my=(y0+y1)/2;
  let s='<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:'+W+'px">';
  s+='<rect x="'+pl+'" y="'+pt2+'" width="'+(W-pl-pr)+'" height="'+(H-pt2-pb)+'" fill="#fcfcfd" stroke="#eef0f4"/>';
  s+='<line x1="'+X(mx)+'" x2="'+X(mx)+'" y1="'+pt2+'" y2="'+(H-pb)+'" stroke="#e4e7ec" stroke-dasharray="4 3"/>';
  s+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+Y(my)+'" y2="'+Y(my)+'" stroke="#e4e7ec" stroke-dasharray="4 3"/>';
  const lab=(t,x,y,an)=>'<text x="'+x+'" y="'+y+'" font-size="10" fill="#98a2b3" text-anchor="'+(an||'middle')+'">'+t+'</text>';
  s+=lab('高就绪 · 低业绩(要查:是不是练过但没在店里用)',pl+8,pt2+14,'start');
  s+=lab('高就绪 · 高业绩(可复制)',W-pr-8,pt2+14,'end');
  s+=lab('低就绪 · 低业绩(优先补)',pl+8,H-pb-8,'start');
  s+=lab('低就绪 · 高业绩(经验未被沉淀)',W-pr-8,H-pb-8,'end');
  rows.forEach(r=>{const c=r.group==='试点批'?'#ff6700':'#4e8cff';
    s+='<circle class="rd-pt" data-act="v23Stu" data-mid="'+r.mid+'" cx="'+X(r.rdy).toFixed(1)+'" cy="'+Y(r.lock).toFixed(1)+'" r="5" fill="'+c+'" fill-opacity=".78" stroke="#fff" stroke-width="1.2"><title>'+esc(r.name+' · '+r.store+'\n就绪度 '+r.rdy+' · 近 4 周锁单 '+r.lock+' 台')+'</title></circle>'});
  s+=lab('就绪度 →',W/2,H-8);
  s+='<text x="12" y="'+(H/2)+'" font-size="10" fill="#98a2b3" transform="rotate(-90 12 '+(H/2)+')" text-anchor="middle">近 4 周锁单(台)</text>';
  return s+'</svg>';
}
const v23RdyColor=v=>v==null?'#c9ced6':v>=80?'#12a36b':v>=60?'#e8830c':'#e5484d';
function v23RdyPill(v){const t=v==null?['—','']:v>=80?['就绪','ok']:v>=60?['接近','warn']:['有缺口','err'];return '<span class="tag '+t[1]+'">'+t[0]+'</span>'}

/* ---------- 效果 · 就绪度 ---------- */
A.v23Stu=el=>{closeDlg();const p=personOf(el.dataset.mid);if(p&&(UI.role.type!=='region'||p.region===UI.role.region)){UI.page='person';UI.stuMid=el.dataset.mid}else{UI.page='people';if(p&&p.region!==UI.role.region)toast('只能查看本区域人员','err');else UI.page='student',UI.stuMid=el.dataset.mid}render();$('#main').scrollTop=0};
function pgRdy(){
  if(v23Empty())return '<div class="ph"><h2>就绪度</h2><div>'+V23_SIM+'</div></div>'+v23EmptyCta('就绪度数据');
  const f=UI.sel.rdy||(UI.sel.rdy={scope:'全国',store:'',tier:''});
  const all=S.lrn.map(l=>{const r=v23Readiness(l.mid,l.tier);return {l,rdy:r.val,ach:r.ach,items:r.items,pass:r.ach!=null&&r.ach>=S.cfg.pass}});
  const scopeRows=all.filter(x=>f.scope==='全国'||x.l.region===f.scope);
  const kw=(f.q||'').trim().toLowerCase();
  const rows=scopeRows.filter(x=>(!f.store||x.l.store===f.store)&&(!f.tier||x.l.tier===f.tier)&&(!kw||x.l.name.toLowerCase().includes(kw)||String(x.l.mid).includes(kw))&&(!f.verdict||(f.verdict==='已达标'?x.pass:f.verdict==='未达标'?(!x.pass&&x.rdy!=null):x.rdy==null)));
  const q=v23Quadrant();
  const tested=rows.filter(x=>x.rdy!=null);
  const avg=tested.length?Math.round(tested.reduce((a,x)=>a+x.rdy,0)/tested.length):null;
  const passN=tested.filter(x=>x.pass).length;
  const noEv=S.lrn.length-tested.length;
  /* 分布:按 10 分一档 */
  const bins=Array.from({length:10},()=>0);tested.forEach(x=>bins[Math.min(9,Math.floor(x.rdy/10))]++);
  const mx=Math.max(1,...bins);
  const hist='<div class="rd-hist">'+bins.map((n,i)=>'<div class="'+(i*10>=S.cfg.pass?'on':'')+'" style="height:'+Math.max(2,n/mx*88)+'px" title="'+i*10+'~'+(i*10+9)+' 分:'+n+' 人"><span>'+(n||'')+'</span></div>').join('')+'</div><div class="rd-hist-x">'+bins.map((_,i)=>'<div>'+(i*10)+'</div>').join('')+'</div>';
  /* 按画像项的下钻:全范围内每项平均 */
  const p0=pfOf('新人顾问');
  const itemAvg=p0.items.map(it=>{const vs=scopeRows.map(x=>{const m=x.items.find(y=>y.item.id===it.id);return m&&m.mean!=null?m.mean:null}).filter(v=>v!=null);return {it,mean:vs.length?Math.round(vs.reduce((a,b)=>a+b,0)/vs.length):null,n:vs.length}});
  const sel=(k,label,opts,cur)=>'<div class="fi2"><label>'+label+'</label><select data-wc="rdySet" data-k="'+k+'"><option value="">全部</option>'+opts.map(o=>'<option '+(cur===o?'selected':'')+'>'+o+'</option>').join('')+'</select></div>';
  const zero=!tested.length;
  const rdySorted=tested.slice().sort((a,b)=>(b.rdy||0)-(a.rdy||0));const rdyPg=lstPage('rdyPage',rdySorted,20);const testPaged=rdyPg.rows;
  return '<div class="ph"><h2>就绪度 <span class="hint" style="font-weight:400">按岗位画像加权算出的"这个人现在能不能上阵";证据来自测评 + 演练 + 实战行为 + 人工评价</span></h2><div>'+V23_SIM+'</div></div>'
   +srcBar('就绪度 = Σ(画像项权重 × min(该项下知识点掌握度均值, 目标等级)) ÷ Σ权重。掌握度 = 各来源证据按<b>权重</b>合成,权重在「配置中心 → 评价口径」可调。画像四档:新人 / 进阶 / 销冠 / 店长。')
   +V23_CORR
   +v23DataNote()
   +(S.lrn.length?''
   +'<div class="fil"><span class="hint">范围</span><select data-wc="rdySet" data-k="scope"><option value="全国" '+(f.scope==='全国'?'selected':'')+'>全国</option>'+ALLR.map(r=>'<option '+(f.scope===r?'selected':'')+'>'+r+'</option>').join('')+'</select>'
     +'<select data-wc="rdySet" data-k="store"><option value="">全部门店</option>'+v23Stores().filter(s=>f.scope==='全国'||pp2(s)===f.scope).map(s=>'<option '+(f.store===s?'selected':'')+'>'+s+'</option>').join('')+'</select>'
     +'<select data-wc="rdySet" data-k="tier"><option value="">全部岗位</option>'+V23_TIER.map(t=>'<option '+(f.tier===t?'selected':'')+'>'+t+'</option>').join('')+'</select>'
     +'<span style="flex:1"></span><span class="hint">共 '+rows.length+' 人,有证据 '+tested.length+' 人'+(noEv?' · '+noEv+' 人无证据不计入':'')+'</span></div>'
   +'<div class="rd-hero">'
     +'<div class="rd-stat"><div class="l">平均就绪度</div><div class="n" style="color:'+v23RdyColor(avg)+'">'+(avg==null?'—':avg)+'</div><div class="h">满分 100,过关线 '+S.cfg.pass+'</div><div class="rd-bar"><i style="width:'+(avg||0)+'%;background:'+v23RdyColor(avg)+'"></i></div></div>'
     +'<div class="rd-stat"><div class="l">已达标人数</div><div class="n">'+passN+'<small>/ '+tested.length+'</small></div><div class="h">目标达成率 ≥ '+S.cfg.pass+'</div></div>'
     +'<div class="rd-stat"><div class="l">就绪度 × 锁单相关</div><div class="n">'+(q.r==null?'—':q.r)+'</div><div class="h">Pearson r · 只说明相关,不是因果</div></div>'
     +'<div class="rd-stat"><div class="l">画像命中知识点</div><div class="n">'+[...new Set(rows.flatMap(x=>x.items.flatMap(i=>i.kps.map(k=>k.id))))].length+'</div><div class="h">'+V23_TIER.length+' 档画像合计</div></div>'
   +'</div>'
   +(zero?cta('这个范围内还没有证据','换一个范围,或先到零售通做诊断 / 演练产生证据。','')
   :'<div class="rd-grid"><div class="card"><h3>学得好 · 卖得好 <span class="hint">点任意点看学员详情</span></h3>'
     +'<div class="rd-quad">'+v23QuadSvg(q.rows.filter(r=>f.scope==='全国'||r.region===f.scope))+'</div>'
     +'<div class="hint" style="margin-top:8px">橙 = 试点批,蓝 = 对照批。相关系数 r='+(q.r==null?'—':q.r)+',属于弱到中等相关;<b>存在明显离群点</b>(高就绪低业绩 / 低就绪高业绩),说明就绪度不能单独解释业绩。</div></div>'
     +'<div class="card"><h3>就绪度分布 <span class="hint">橙色 = 已达过关线</span></h3>'+hist
     +'<div class="hint" style="margin-top:10px">按画像项看(新人档画像,全范围平均):</div>'
     +itemAvg.map(x=>'<div class="rd-item"><div class="nm" title="'+esc(x.it.label)+'">'+esc(x.it.label)+'</div><div class="bw"><i style="width:'+(x.mean||0)+'%;background:'+v23RdyColor(x.mean)+'"></i><u style="left:'+x.it.target+'%"></u></div><div class="vv">'+(x.mean==null?'—':x.mean)+' / 目标 '+x.it.target+'</div><div class="wt">'+x.it.weight+'%</div></div>').join('')
     +'</div></div>'
   +'<div class="card"><h3>学员 × 就绪度 <span class="hint">点姓名进详情;这里与「学员详情 / 零售通 / 工作台」同一套数</span></h3>'
   +'<div class="filg" style="margin-bottom:10px"><div class="fi2"><label>姓名 / MID</label><input data-wc="rdySet" data-k="q" value="'+esc(f.q||'')+'" placeholder="搜索姓名或 MID"></div><div class="fi2"><label>判定</label><select data-wc="rdySet" data-k="verdict"><option value="">全部</option>'+['已达标','未达标','无证据'].map(v=>'<option '+(f.verdict===v?'selected':'')+'>'+v+'</option>').join('')+'</select></div><div class="fi2"><label>每页</label><select data-wc="rdySize">'+[20,50,100].map(n=>'<option '+(rdyPg.size===n?'selected':'')+'>'+n+'</option>').join('')+'</select></div><div class="fi2" style="align-self:end">'+lstCsvBtn(['学员','MID','门店','岗位','批次','就绪度','目标达成','判定'],[['学员','MID','门店','岗位','批次','就绪度','目标达成','判定']].concat(testPaged.map(x=>[x.l.name,x.l.mid,x.l.store,x.l.tier,x.l.group,x.rdy,x.ach,x.pass?'已达标':'未达标'])),'就绪度')+'</div></div>'
   +'<div class="tw"><table class="t nw stk"><tr><th>学员</th><th>门店</th><th>岗位</th><th>批次</th><th>就绪度</th><th>目标达成</th><th>薄弱项</th><th>错题</th><th>近 4 周锁单</th><th>判定</th><th>操作</th></tr>'
   +testPaged.map(x=>{
     const weak=x.items.filter(i=>i.mean!=null&&i.mean<i.item.target).map(i=>i.item.label).slice(0,2);
     const mo=misOf(x.l.mid).filter(m=>m.status!=='closed').length;
     const lk=outSum(x.l.mid,V23_NWK-4,V23_NWK-1).锁单;
     return '<tr><td><a class="link" data-act="v23Stu" data-mid="'+x.l.mid+'">'+esc(x.l.name)+'</a><div class="hint">'+x.l.mid+'</div></td><td>'+esc(x.l.store)+'</td><td>'+x.l.tier+'</td><td><span class="tag '+(x.l.group==='试点批'?'pri':'blue')+'">'+x.l.group+'</span></td>'
      +'<td><b style="color:'+v23RdyColor(x.rdy)+'">'+(x.rdy==null?'—':x.rdy)+'</b></td><td>'+(x.ach==null?'—':x.ach+'%')+'</td>'
      +'<td style="white-space:normal;min-width:170px">'+(weak.length?weak.map(w=>'<span class="tag warn" style="margin:0 4px 4px 0">'+esc(w)+'</span>').join(''):'<span class="tag ok">无</span>')+'</td>'
      +'<td>'+(mo?'<b style="color:#c8323a">'+mo+'</b>':'<span class="hint">0</span>')+'</td><td>'+lk+' 台</td><td>'+v23RdyPill(x.rdy)+'</td>'
      +'<td><a class="link" data-act="v23Stu" data-mid="'+x.l.mid+'">详情</a></td></tr>'}).join('')+'</table></div>'+lstPager('rdyPage',rdyPg)+'</div>')
   :'')
}
A.rdySet=el=>{const f=UI.sel.rdy||(UI.sel.rdy={});if(el.value)f[el.dataset.k]=el.value;else delete f[el.dataset.k];if(el.dataset.k==='scope')delete f.store;render()};

/* 证据流水按来源分层取样(每类最多 4 条,最近的),再按时间排,保证五类来源都能看到 */
function v23EvShow(list){
  const by={};list.forEach(e=>(by[e.s]=by[e.s]||[]).push(e));
  let out=[];Object.keys(by).forEach(k=>{out=out.concat(by[k].sort((a,b)=>(b.ts||'').localeCompare(a.ts||'')).slice(0,4))});
  return out.sort((a,b)=>(b.ts||'').localeCompare(a.ts||''))}
/* ---------- 学员详情 ---------- */
function pgStudent(){
  if(v23Empty()){UI.page='effect';UI.tab.effect='就绪度';return pgEffect()}
  const l=lrnOf(UI.stuMid)||S.lrn[0];if(!l){UI.page='effect';return pgEffect()}
  const r=v23Readiness(l.mid,l.tier);const mo=misOf(l.mid);
  const radarItems=r.items.map(i=>({label:i.item.label,short:i.item.label.replace(/\(.*?\)/g,'').slice(0,6),val:i.mean,target:i.item.target}));
  const outRows=[{k:'近 4 周',v:outSum(l.mid,V23_NWK-4,V23_NWK-1)},{k:'前 4 周',v:outSum(l.mid,V23_NWK-8,V23_NWK-5)}];
  /* 证据流水:测评 / 演练 / 人工评价 / 自评 来自 S.ev;实战行为来自 S.beh(取每个知识点最近一个有样本的周) */
  const evList=[];
  const EVK={quiz:'q',drill:'dr',coach:'co',self:'se'};
  Object.keys(EVK).forEach(src=>{
    const o=((S.ev[EVK[src]]||{})[l.mid]||{});
    Object.keys(o).forEach(kid=>{if(S.cfg.srcW[src]>0||src==='self')evList.push({s:src,kid,score:o[kid].score,n:o[kid].n,ts:o[kid].ts})})});
  if(S.cfg.srcW.behavior>0)Object.keys((S.beh||{})[l.mid]||{}).forEach(kid=>{
    const arr=S.beh[l.mid][kid].slice(0,v23End()+1).filter(x=>x.n>=S.cfg.behN*0.3);if(!arr.length)return;
    const last=arr[arr.length-1];evList.push({s:'behavior',kid,score:last.rate,n:last.n,ts:v23Week(last.w)})});
  /* 行为:取该学员最弱 5 个知识点的 12 周走势 */
  const behKeys=S.kps.filter(k=>k.st==='启用'&&((S.beh[l.mid]||{})[k.id])).map(k=>({k,last:((S.beh[l.mid]||{})[k.id]||[]).slice(-4).reduce((a,x)=>a+x.rate,0)/4})).sort((a,b)=>a.last-b.last).slice(0,1);
  const mk=q=>packsOf(l.mid).length;
  const pks=packsOf(l.mid);
  return crumb('<a data-act="go" data-p="effect" data-t="就绪度">就绪度</a> / '+esc(l.name))
   +'<div class="ph"><h2>'+esc(l.name)+' <span class="hint" style="font-weight:400">'+esc(l.store)+' · '+l.tier+' · 入职 '+l.hire+' 天</span></h2><div>'+V23_SIM+'</div></div>'
   +'<div class="card"><div class="stu-hero"><div class="stu-av">'+esc(l.name.slice(0,1))+'</div>'
    +'<div style="flex:1"><div class="stu-kv">'
    +'<div>就绪度<b style="color:'+v23RdyColor(r.val)+'">'+(r.val==null?'—':r.val)+'</b></div>'
    +'<div>目标达成<b>'+(r.ach==null?'—':r.ach+'%')+'</b></div>'
    +'<div>画像<b style="font-size:13px">'+r.tier+'</b></div>'
    +'<div>批次<b style="font-size:13px">'+l.group+(l.train?' · 已参训':'')+'</b></div>'
    +'<div>未关闭错题<b style="color:'+(mo.filter(m=>m.status!=='closed').length?'#c8323a':'')+'">'+mo.filter(m=>m.status!=='closed').length+'</b></div>'
    +'<div>学习包<b style="font-size:13px">'+pks.length+' 个</b></div>'
    +'</div></div>'+v23RdyPill(r.val)+'</div></div>'
   +'<div class="rd-grid"><div class="card"><h3>画像雷达 <span class="hint">实线 = 当前,虚线 = 目标等级</span></h3>'
     +'<div class="rd-radar">'+v23Radar(radarItems)+'<div class="rd-legend">'+r.items.map(i=>'<div><i style="background:'+v23RdyColor(i.mean)+'"></i>'+esc(i.item.label)+' <span class="hint">'+i.item.weight+'% · '+(i.mean==null?'无证据':Math.round(i.mean))+'/'+i.item.target+'</span></div>').join('')+'</div></div></div>'
     +'<div class="card"><h3>业务结果(周度漏斗)</h3>'
     +'<table class="t"><tr><th>区间</th><th>邀约</th><th>到店</th><th>试驾</th><th>报价</th><th>锁单</th></tr>'
     +outRows.map(x=>'<tr><td>'+x.k+'</td>'+['邀约','到店','试驾','报价','锁单'].map(k=>'<td'+(k==='锁单'?' style="font-weight:650"':'')+'>'+x.v[k]+'</td>').join('')+'</tr>').join('')+'</table>'
     +'<div class="hint" style="margin-top:6px">来自北斗 BI(个人级),按周聚合。仅用于选样与验收,不作因果结论。</div>'
     +(behKeys.length?'<h4>最弱知识点的行为出现率(12 周)</h4>'+lineSvg([{n:behKeys[0].k.name,c:'#ff6700',d:((S.beh[l.mid]||{})[behKeys[0].k.id]||[]).map(x=>x.rate)}],{w:420,h:150})+'<div class="hint">来自汽车语料:该知识点相关会话里行为出现比例。</div>':'')+'</div></div>'
   +'<div class="grid g2"><div class="card"><h3>证据流水 <span class="hint">共 '+evList.length+' 条,每类来源取最近 4 条</span></h3>'
     +'<div class="tw" style="max-height:300px;overflow:auto"><table class="t"><tr><th>来源</th><th>知识点</th><th>得分</th><th>样本</th><th>时间</th></tr>'
     +v23EvShow(evList).map(e=>'<tr><td><span class="tag '+(e.s==='behavior'?'pri':'')+'">'+srcName[e.s]+'</span></td><td>'+esc((kp(e.kid)||{}).name||'')+'</td><td>'+e.score+'</td><td>'+e.n+'</td><td class="hint">'+e.ts+'</td></tr>').join('')+'</table></div>'
     +'<div class="hint" style="margin-top:6px">掌握度按来源权重合成;自评默认权重 0,只做展示。</div></div>'
   +'<div class="card"><h3>错题 <span class="hint">未关闭 '+mo.filter(m=>m.status!=='closed').length+' 条</span></h3>'
     +(mo.length?'<div class="tw" style="max-height:300px;overflow:auto"><table class="t"><tr><th>知识点</th><th>类型</th><th>次数</th><th>状态</th></tr>'
     +mo.slice(0,14).map(m=>'<tr><td>'+esc((kp(m.kp)||{}).name||'')+'</td><td>'+m.type+'</td><td>'+m.count+'</td><td>'+('<span class="tag '+(m.status==='closed'?'ok':m.status==='recurred'?'err':'warn')+'">'+({open:'未处理',improving:'改善中',closed:'已关闭',recurred:'关闭后复发'}[m.status])+'</span>')+'</td></tr>').join('')+'</table></div>':'<div class="chk ok"><b>✓</b><span>没有错题</span></div>')
     +'<div style="margin-top:8px"><a class="link" data-act="go" data-p="effect" data-t="错题集">去错题集看全部 ›</a></div></div></div>'
   +'<div class="card"><h3>学习包</h3>'+(pks.length?'<table class="t"><tr><th>学习包</th><th>步骤</th><th>截止</th><th>状态</th></tr>'
     +pks.map(p=>'<tr><td>'+esc(p.name)+'</td><td>'+p.steps.map(s=>s.t+(s.done?'✓':'')).join(' → ')+'</td><td>'+p.due+'</td><td><span class="tag '+(p.status==='已完成'?'ok':p.status==='逾期'?'err':'warn')+'">'+p.status+'</span></td></tr>').join('')+'</table>':'<div class="hint">暂无学习包。</div>')+'</div>'
}

/* ---------- 效果 · 错题集 ---------- */
A.v23MisJump=el=>{const d=el.dataset;const f=UI.sel.misf||(UI.sel.misf={});
  if(d.kp)f.kp=d.kp;if(d.st)f.st=d.st;if(d.type)f.type=d.type;UI.page='effect';UI.tab.effect='错题集';render();$('#main').scrollTop=0};
function misRows(f){
  return S.mis.filter(m=>(!f.kp||m.kp===f.kp)&&(!f.type||m.type===f.type)&&(!f.st||m.status===f.st)&&(!f.store||(lrnOf(m.mid)||{}).store===f.store)&&(!f.reg||(lrnOf(m.mid)||{}).region===f.reg));
}
/* 按知识点聚合:错题人数 / 次数 / 复发 / 代表原文 / 金牌话术 */
function misAgg(rows){
  const m={};
  rows.forEach(x=>{const a=m[x.kp]||(m[x.kp]={kp:x.kp,n:0,cnt:0,rec:0,people:new Set(),quotes:[],last:'',types:{}});
    a.n++;a.cnt+=x.count;a.people.add(x.mid);if(x.status==='recurred')a.rec++;
    a.types[x.type]=(a.types[x.type]||0)+1;
    if(x.quote&&!a.quotes.includes(x.quote))a.quotes.push(x.quote);
    if(x.lastTs>a.last)a.last=x.lastTs});
  return Object.values(m).sort((a,b)=>b.n-a.n);
}
function pgMis(){
  if(!(S.mis&&S.mis.length)&&v23Empty())return '<div class="ph"><h2>错题集</h2><div>'+V23_SIM+'</div></div>'+v23EmptyCta('错题数据');
  const f=UI.sel.misf||(UI.sel.misf={});
  const rows=misRows(f);const agg=misAgg(rows);
  const misSorted=rows.slice().sort((a,b)=>UI.sel.misSort==='recent'?(b.lastTs||'').localeCompare(a.lastTs||''):(b.severity-a.severity)||(b.count-a.count));const misPg=lstPage('misPage',misSorted,20);
  const rr=v23RecurRate();
  const open=rows.filter(m=>m.status!=='closed').length;
  const recN=rows.filter(m=>m.status==='recurred').length;
  const byType=V23_MIS_TYPE.map(t=>({t,n:rows.filter(m=>m.type===t).length}));
  const mxT=Math.max(1,...byType.map(x=>x.n));
  const sel=(k,label,arr,cur)=>'<div class="fi2"><label>'+label+'</label><select data-wc="misSet" data-k="'+k+'"><option value="">全部</option>'+arr.map(o=>'<option value="'+esc(o[0])+'" '+(cur===o[0]?'selected':'')+'>'+esc(o[1])+'</option>').join('')+'</select></div>';
  const kpOpts=[...new Set(S.mis.map(m=>m.kp))].map(id=>[id,(kp(id)||{}).name||id]);
  const stMap=[['open','未处理'],['improving','改善中'],['recurred','关闭后复发'],['closed','已关闭']];
  return '<div class="ph"><h2>错题集 <span class="hint" style="font-weight:400">"先建表再跑批":每条错误可累积、可统计复发;高频错题回流工作台生成课题</span></h2><div>'+V23_SIM+'</div></div>'
   +srcBar('错题来自:① 题答错;② 演练必说点 / 思路点缺失(沿用演练命中结果);③ 人工评价指出的问题。状态机:未处理 → 改善中 → 已关闭;<b>关闭后再次出现记为「复发」</b>,复发率 = 复发数 ÷ 已关闭过的总数。')
   +'<div class="rd-hero">'
    +'<div class="rd-stat"><div class="l">错题记录</div><div class="n">'+rows.length+'</div><div class="h">涉及 '+new Set(rows.map(m=>m.mid)).size+' 人 / '+new Set(rows.map(m=>m.kp)).size+' 个知识点</div></div>'
    +'<div class="rd-stat"><div class="l">未关闭</div><div class="n" style="color:'+(open?'#c8323a':'#12a36b')+'">'+open+'</div><div class="h">含「改善中」</div></div>'
    +'<div class="rd-stat"><div class="l">复发率</div><div class="n" style="color:'+(rr>=25?'#c8323a':'#12a36b')+'">'+(rr==null?'—':rr+'%')+'</div><div class="h">已关闭后又错的比例</div></div>'
    +'<div class="rd-stat"><div class="l">复发条数</div><div class="n">'+recN+'</div><div class="h">需重做学习包 / 改话术</div></div>'
   +'</div>'
   +'<div class="card"><h3>按知识点聚合 <span class="hint">错题人数多的先处理</span></h3>'
   +'<div class="tw"><table class="t nw stk"><tr><th>知识点</th><th>错题人数</th><th>累计次数</th><th>复发</th><th>主要类型</th><th>代表原文</th><th>对应金牌话术</th><th>最近一次</th><th>操作</th></tr>'
   +(agg.length?agg.slice(0,18).map(a=>{
     const k=kp(a.kp)||{};const topType=Object.entries(a.types).sort((x,y)=>y[1]-x[1])[0];
     const gold=a.quotes.length?(S.mis.find(m=>m.kp===a.kp&&m.goldId)||{}).goldId:'';
     const gc=gold&&content(gold);
     return '<tr><td style="white-space:normal;min-width:150px"><a class="link" data-act="kpOpen" data-id="'+a.kp+'">'+esc(k.name||a.kp)+'</a><div class="hint">'+esc(k.car||'')+'</div></td>'
      +'<td><b>'+a.people.size+'</b> 人</td><td>'+a.cnt+'</td><td>'+(a.rec?'<span class="mis-cell mis-s3">'+a.rec+'</span>':'<span class="hint">0</span>')+'</td>'
      +'<td><span class="mis-cell mis-s2">'+(topType?topType[0]:'—')+'</span></td>'
      +'<td style="white-space:normal;min-width:200px;max-width:280px"><div class="mis-q">'+esc(a.quotes[0]||'')+'</div></td>'
      +'<td style="white-space:normal;min-width:150px">'+(gc?'<a class="link" data-act="cView" data-id="'+gc.id+'">'+esc(gc.title.slice(0,22))+'</a>':'<span class="tag warn">缺金牌话术</span>')+'</td>'
      +'<td class="hint">'+a.last+'</td>'
      +'<td style="white-space:nowrap"><a class="link" data-act="misTopic" data-kp="'+a.kp+'">生成课题</a>'+(gc?'':' <a class="link" data-act="misFix" data-kp="'+a.kp+'">补话术</a>')+' <a class="link" data-act="misPack" data-kp="'+a.kp+'">指派学习包</a></td></tr>'}).join('')
     :'<tr><td colspan="9"><div class="hint">没有符合条件的错题</div></td></tr>')+'</table></div>'
   +'<div class="hint" style="margin-top:8px">高频错题(错题人数 ≥ '+S.cfg.weakN+' 且占已测比例 ≥ '+Math.round(S.cfg.weakR*100)+'%)会在「调优」诊断树的第 ② 层出现,也会进工作台待办。</div></div>'
   +'<div class="rd-grid"><div class="card"><h3>错题类型分布</h3>'
     +byType.map(x=>'<div class="rd-item"><div class="nm">'+x.t+'</div><div class="bw"><i style="width:'+(x.n/mxT*100)+'%;background:#ff6700"></i></div><div class="vv">'+x.n+' 条</div><div class="wt"></div></div>').join('')
     +'<div class="hint" style="margin-top:8px">知识错 = 记错事实;表达错 = 说法有问题;思路错 = 顺序 / 结构不对;遗漏 = 该说的没说。</div></div>'
   +'<div class="card"><h3>按门店 / 区域看</h3>'
     +'<table class="t"><tr><th>门店</th><th>错题人数</th><th>累计次数</th><th>复发</th></tr>'
     +[...new Set(S.mis.map(m=>(lrnOf(m.mid)||{}).store).filter(Boolean))].map(st=>{
       const rs=S.mis.filter(m=>(lrnOf(m.mid)||{}).store===st);
       return '<tr><td>'+esc(st)+'</td><td>'+new Set(rs.map(m=>m.mid)).size+'</td><td>'+rs.reduce((a,b)=>a+b.count,0)+'</td><td>'+(rs.filter(m=>m.status==='recurred').length||'<span class="hint">0</span>')+'</td></tr>'}).join('')+'</table></div></div>'
   +'<div class="card" style="padding:14px 18px"><div class="filg">'
     +sel('kp','知识点',kpOpts,f.kp)+sel('type','类型',V23_MIS_TYPE.map(t=>[t,t]),f.type)+sel('st','状态',stMap,f.st)
     +sel('reg','区域',ALLR.map(r=>[r,r]),f.reg)
     +'<div class="fi2" style="align-self:end"><button class="btn" data-act="misClear">清除筛选</button></div>'
     +'<div class="fi2" style="align-self:end;margin-left:auto"><span class="hint">筛选后 '+rows.length+' 条</span></div></div></div>'
   +'<div class="card"><h3>错题明细 <span class="hint">按严重度排序,可翻页/导出</span></h3>'
   +'<div class="filg" style="margin-bottom:10px"><div class="fi2"><label>排序</label><select data-wc="misSort"><option value="sev" '+(UI.sel.misSort!=='recent'?'selected':'')+'>严重度</option><option value="recent" '+(UI.sel.misSort==='recent'?'selected':'')+'>最近发生</option></select></div><div class="fi2"><label>每页</label><select data-wc="misSize">'+[20,50,100].map(n=>'<option '+(misPg.size===n?'selected':'')+'>'+n+'</option>').join('')+'</select></div><div class="fi2" style="align-self:end">'+lstCsvBtn(['学员','门店','知识点','类型','环节','严重度','次数','代表原文','状态'],[['学员','门店','知识点','类型','环节','严重度','次数','代表原文','状态']].concat(misSorted.map(m=>{const l=lrnOf(m.mid)||{};return [l.name||m.mid,l.store||'',(kp(m.kp)||{}).name||'',m.type,m.step,m.severity,m.count,m.quote,m.status]})),'错题明细')+'</div><div class="fi2" style="align-self:end"><span class="hint">共 '+rows.length+' 条</span></div></div>'
   +'<div class="tw"><table class="t nw stk"><tr><th>学员</th><th>门店</th><th>知识点</th><th>类型</th><th>环节</th><th>严重度</th><th>次数</th><th>代表原文</th><th>首次 / 最近</th><th>状态</th><th>操作</th></tr>'
   +misPg.rows.map(m=>{const l=lrnOf(m.mid)||{};return '<tr><td><a class="link" data-act="v23Stu" data-mid="'+m.mid+'">'+esc(l.name||m.mid)+'</a></td><td>'+esc(l.store||'')+'</td><td>'+esc((kp(m.kp)||{}).name||'')+'</td>'
     +'<td><span class="mis-cell mis-s2">'+m.type+'</span></td><td>'+m.step+'</td><td><span class="mis-cell mis-s'+m.severity+'">'+['','低','中','高'][m.severity]+'</span></td><td>'+m.count+'</td>'
     +'<td style="white-space:normal;min-width:200px;max-width:260px"><div class="mis-q">'+esc(m.quote)+'</div></td>'
     +'<td class="hint">'+m.firstTs.slice(5)+' / '+m.lastTs.slice(5)+'</td>'
     +'<td><span class="tag '+(m.status==='closed'?'ok':m.status==='recurred'?'err':m.status==='improving'?'warn':'')+'">'+({open:'未处理',improving:'改善中',closed:'已关闭',recurred:'关闭后复发'}[m.status])+'</span>'+(m.status==='recurred'?'<div class="mis-re">复发</div>':'')+'</td>'
     +'<td style="white-space:nowrap">'+(m.status==='closed'?'':'<a class="link" data-act="misNext" data-id="'+m.id+'">推进</a>')+' <a class="link" data-act="misPackOne" data-id="'+m.id+'">指派学习包</a></td></tr>'}).join('')
   +'</table></div>'+lstPager('misPage',misPg)+'</div>'
}
A.misSet=el=>{const f=UI.sel.misf||(UI.sel.misf={});if(el.value)f[el.dataset.k]=el.value;else delete f[el.dataset.k];render()};
A.misClear=()=>{UI.sel.misf={};render()};
A.misNext=el=>{const m=S.mis.find(x=>x.id===el.dataset.id);const nx={open:'improving',improving:'closed',recurred:'improving'}[m.status]||'closed';
  m.status=nx;if(nx==='closed')m.closedTs=today;toast('已推进到「'+({open:'未处理',improving:'改善中',closed:'已关闭'}[nx])+'」','ok');render()};
A.misTopic=el=>{const kid=el.dataset.kp;const k=kp(kid);const n=misRows({kp:kid}).length;
  const tp=mkTopic({title:'学员在「'+(k?k.name:kid)+'」上反复出错:'+n+' 条错题未关闭',
    desc:'来自错题集聚合:该知识点错题人数最多、复发明显,需要补金牌话术或改讲法。',scene:'展厅',obj:k?k.name:'-',sess:n*26,stores:Math.max(2,Math.round(n/4)),prov:2,trend:Math.round(n/3),
    sug:{type:'专题训',sub:'短板类',ind:'I3',kw:((k||{}).syn||[]).slice(0,3).join(', '),trig:k?k.name:'',base:40,regions:ALLR}},'系统出题','系统(错题集汇总)','sys',{kpId:kid});
  toast('已生成课题 '+tp.id+',在「课题池」里处理','ok');render()};
A.misFix=el=>{const kid=el.dataset.kp;UI.page='content';UI.tab.content='全部内容';UI.sel.caf={kp:kid};render();toast('已筛出挂在该知识点上的内容;缺金牌话术的需要新建一条','')};
A.misPack=el=>{A.misPackDo(el.dataset.kp,null)};
A.misPackOne=el=>{const m=S.mis.find(x=>x.id===el.dataset.id);A.misPackDo(m.kp,m.mid)};
A.misPackDo=(kid,mid)=>{
  const tpl=S.packTpl.find(t=>t.id==='PT2');
  const n=mid?1:misRows({kp:kid}).filter(m=>m.status!=='closed').length||1;
  S.packs.unshift({id:'PK'+(S.packs.length+1),tpl:'PT2',mid:mid||'',kp:kid,name:'错题复发包 · '+((kp(kid)||{}).name||''),steps:tpl.steps.map(s=>({t:s[0],done:false})),due:addDays(today,tpl.dueDays),status:'进行中',ts:today,audience:mid?1:n});
  toast('已按模板「错题复发包」指派:步骤 '+tpl.steps.map(s=>s[0]).join(' → ')+',截止 '+addDays(today,tpl.dueDays)+(mid?'':' · 覆盖 '+n+' 人'),'ok');render()};

/* ---------- 效果 · 调优 ---------- */
/* 诊断树:每层 = 判定规则 + 当前读数 + 建议杠杆,读数全部现算 */
function v23Diag(){
  const c=S.cfg;const rows=[];
  /* ① 触达:任务完成率 */
  const pilots=S.lrn.filter(l=>l.train);
  const doneN=pilots.filter(l=>Object.keys(S.mastery[l.mid]||{}).length>=3).length;
  const reach=pilots.length?Math.round(doneN/pilots.length*100):0;
  rows.push({no:'①',ttl:'触达',sym:'任务完成率低 = 人没来、或者来了没学',
    read:[['试点批完成诊断',reach+'%'],['未启动',pilots.length-doneN+' 人']],
    ok:reach>=80?'ok':reach>=55?'warn':'bad',verdict:reach>=80?'正常':'偏低',
    lever:'学习包频次 / 步骤、下发对象、推送节奏',go:['pack','学习包模板'],
    fix:reach>=80?null:'调学习包模板的下发节奏'});
  /* ② 内容:题正确率 / 命中率 / 点踩 */
  const qs=S.qs.filter(q=>q.st==='已定稿'&&q.stat.n>=3);
  const lowQ=qs.filter(q=>q.stat.n&&q.stat.ok/q.stat.n<0.4);
  const dislike=S.contents.filter(x=>x.up+x.down>0&&x.down/(x.up+x.down)*100>=c.dislikeTh);
  const misTop=misAgg(S.mis.filter(m=>m.status!=='closed')).slice(0,1)[0];
  const cBad=lowQ.length&&lowQ.length/qs.length>=0.15||dislike.length;
  rows.push({no:'②',ttl:'内容',sym:'命中低 / 点踩高 / 题正确率异常 = 话术或题本身有问题',
    read:[['低正确率题(<40%)',lowQ.length+' 道'],['点踩偏高的内容',dislike.length+' 条'],['最高频错题的知识点',misTop?((kp(misTop.kp)||{}).name||'')+'('+misTop.people.size+' 人)':'—']],
    ok:cBad?'warn':'ok',verdict:cBad?'需处理':'正常',
    lever:'改话术、改题、补演练 → 回流工作台',go:['effect','错题集'],fix:cBad?'去错题集看高频错题':'null'});
  /* ③ 练习与实战脱节:测评+演练过关,但「顾虑解除」实战行为出现率没起来(只看新人顾问) */
  const W=v23Wins();
  const a3k=v23A3Kps();
  const testScore=(mid,kid)=>{const q=((S.ev.q[mid]||{})[kid]||{}).score,d=((S.ev.dr[mid]||{})[kid]||{}).score;const a=[q,d].filter(v=>v!=null);return a.length?a.reduce((x,y)=>x+y,0)/a.length:null};
  const trainNew=v23NewL('试点批').filter(l=>l.train);
  const mScore=a3k.length&&trainNew.length?Math.round(a3k.reduce((s,k)=>{const vs=trainNew.map(l=>testScore(l.mid,k.id)).filter(v=>v!=null);return s+(vs.length?vs.reduce((x,y)=>x+y,0)/vs.length:0)},0)/a3k.length):0;
  const pPrev=v23A3Rate('试点批',W.prev[0],W.prev[1]),pCur=v23A3Rate('试点批',W.cur[0],W.cur[1]);
  const cPrev=v23A3Rate('对照批',W.prev[0],W.prev[1]),cCur=v23A3Rate('对照批',W.cur[0],W.cur[1]);
  const gapP=(pPrev!=null&&pCur!=null)?+(pCur-pPrev).toFixed(1):null;
  const gapC=(cPrev!=null&&cCur!=null)?+(cCur-cPrev).toFixed(1):null;
  const lowVsCtrl=(pCur!=null&&cCur!=null)?+(pCur-cCur).toFixed(1):null;
  const stuck=mScore>=c.pass&&((gapP!=null&&gapP<5)||(lowVsCtrl!=null&&lowVsCtrl<-5));
  rows.push({no:'③',ttl:'练习与实战脱节',sym:'测评过关、行为出现率却不升 = 会背不会用',
    read:[['「顾虑解除」测评+演练均分',mScore+' / 过关线 '+c.pass],
          ['试点批行为出现率 近 4 周 vs 前 4 周',(pPrev==null?'—':pPrev+'%')+' → '+(pCur==null?'—':pCur+'%')+(gapP!=null?'('+(gapP>=0?'+':'')+gapP+'pt)':'')],
          ['对照批同期(未参训)',(cPrev==null?'—':cPrev+'%')+' → '+(cCur==null?'—':cCur+'%')+(gapC!=null?'('+(gapC>=0?'+':'')+gapC+'pt)':'')]],
    ok:stuck?'bad':'ok',verdict:stuck?'命中':'正常',
    lever:'加演练比重、提高演练权重、改情景、新增专项学习包',go:['effect','配置版本'],fix:'去看配置版本与前后对比'});
  /* ④ 画像:就绪度与业绩相关性弱 */
  const q=v23Quadrant();const corrOk=q.r!=null&&Math.abs(q.r)>=c.corrTh;
  rows.push({no:'④',ttl:'画像',sym:'就绪度与业绩相关性弱 = 画像选错了能力项或权重',
    read:[['就绪度 × 锁单 Pearson r',q.r==null?'—':q.r],['阈值',c.corrTh],['样本',q.rows.length+' 人']],
    ok:corrOk?'ok':'warn',verdict:corrOk?'可用':'偏弱',
    lever:'调画像项权重 / 目标等级、换能力项',go:['profile','岗位画像'],fix:corrOk?null:'去调画像权重'});
  /* ⑤ 度量:样本少 */
  const small=q.rows.filter(x=>x.lock!=null).length<c.smallN;
  rows.push({no:'⑤',ttl:'度量',sym:'样本少 / 口径漂移 = 结论不可信',
    read:[['样本人数',q.rows.length+' 人(门槛 '+c.smallN+')'],['观察期',c.obsWeeks+' 周']],
    ok:small?'warn':'ok',verdict:small?'样本偏少':'充分',
    lever:'延长观察、扩大对照、统一口径',go:['cfgEval','评价口径'],fix:small?'延长观察期':'null'});
  return rows;
}
/* ---------- 效果 · 调优(诊断树 + 配置版本 + 前后对比) ---------- */
function pgTune(){
  if(v23Empty()||!(S.cfgV&&S.cfgV.length))return '<div class="ph"><h2>调优</h2><div>'+V23_SIM+'</div></div>'+v23EmptyCta('可调优的数据');
  const sub=UI.tab.tune||'诊断';
  const dl=v23Diag();const hit=dl.filter(x=>x.ok==='bad');
  const cv=S.cfgV.find(v=>v.status==='观察中');
  const due=v23ObsDue(cv);
  let b='';
  if(sub==='诊断'){
    b=srcBar('从近到远逐层排查:触达 → 内容 → 练习与实战脱节 → 画像 → 度量。每层给出<b>判定规则 + 当前读数(现算) + 建议动作</b>。命中「问题」的那一层会高亮,并可一键创建调整项(生成配置版本 / 学习包)。')
     +'<div class="card"><h3>诊断树 <span class="hint">'+(hit.length?'命中 '+hit.length+' 层,最可能是第 '+hit[0].no+' 层':'各层均正常')+'</span></h3>'
     +dl.map(x=>'<div class="tn-l '+(x.ok==='bad'?'hit':'')+'">'
       +'<div class="no">'+x.no+'</div>'
       +'<div class="ttl"><b>'+x.ttl+'</b><div class="sym">'+x.sym+'</div></div>'
       +'<div class="rd">'+x.read.map(r=>'<div><span class="k">'+r[0]+'</span> <b>'+r[1]+'</b></div>').join('')+'</div>'
       +'<div><div class="tn-verdict '+x.ok+'">'+x.verdict+'</div>'
         +'<div class="hint" style="margin-top:6px;line-height:1.6">建议:'+x.lever+'</div>'
         +(x.ok==='bad'?'<button class="btn sm pri" style="margin-top:8px;width:100%" data-act="tnFix" data-no="'+x.no+'">一键创建调整项</button>':
           x.fix&&x.fix!=='null'?'<button class="btn sm" style="margin-top:8px;width:100%" data-act="go" data-p="'+x.go[0]+'" '+((x.go[1]&&x.go[0]==='effect')?'data-t="'+x.go[1]+'"':(x.go[0]==='cfgEval'?'data-p="config" data-t="评价口径"':''))+'">'+esc(x.fix)+'</button>':'')
       +'</div></div>').join('')
     +'</div>'
     +'<div class="card" style="border-color:var(--pri)"><h3>推荐的下一步</h3>'
     +(hit.length?'<div class="hint" style="line-height:1.9">当前命中:<b>第 '+hit.map(x=>x.no+' '+x.ttl).join(' / ')+'</b> 层。'
     +'<br>剧本:新人训第10期 —— 试点批在「顾虑解除」上测评 + 演练都过关,但<b>实战行为出现率几乎没升</b>,和对照批差不多 → 问题不在"学没学",而在"练得不够、没在店里用起来"。'
     +'<br>建议:① 提高演练比重;② 提高「演练」来源权重;③ 新增「顾虑解除专项」学习包(带演练与复测)。三项一起生成配置版本 v'+(Math.max(...S.cfgV.map(v=>v.ver))+1)+',进入观察期。</div>'
     +'<div style="margin-top:10px"><button class="btn pri" data-act="tnFix" data-no="③">一键创建调整项</button> <button class="btn" data-act="tnTab" data-v="配置版本">看看已有版本</button></div>'
     :'<div class="hint" style="line-height:1.9">各层目前都没有命中「问题」。'+(cv?'配置版本 v'+cv.ver+' 正在观察期,可以去「前后对比」看效果。':'')+'</div>'
      +'<div style="margin-top:10px">'+(cv?'<button class="btn pri" data-act="tnTab" data-v="前后对比">看前后对比</button> ':'')+'<button class="btn" data-act="tnTab" data-v="配置版本">看配置版本</button></div>')+'</div>';
  }
  if(sub==='配置版本'){
    b=srcBar('每次改口径都会生成一个<b>配置版本</b>(含差异、影响预估、观察期)。可以查看差异、回滚到任一版本;观察期满会提醒「对比效果」。所有杠杆都存在配置里,不是写死的。')
     +(due&&due.left<=0?'<div class="card" style="background:#fff7e0;border-color:#f3dc9b"><h3>观察期已到期</h3><div class="hint">配置版本 v'+cv.ver+' 已观察 '+(S.cfg.obsWeeks)+' 周,可以去「前后对比」看效果,再决定保留还是回滚。</div><div style="margin-top:8px"><button class="btn pri" data-act="tnTab" data-v="前后对比">去看前后对比</button></div></div>':'')
     +'<div class="card"><h3>版本列表</h3>'
     +S.cfgV.slice().sort((a,b)=>b.ver-a.ver).map(v=>{
       const cls=v.status==='观察中'?'on':v.status==='已生效'?'cur':'back';
       return '<div class="tn-ver"><div class="tn-vb '+cls+'">v'+v.ver+'</div><div style="flex:1">'
        +'<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b style="font-size:13.5px">'+(v.ver===1?'起步口径':'调优')+'</b>'
        +'<span class="tag '+(v.status==='观察中'?'warn':v.status==='已生效'?'ok':'')+'">'+v.status+'</span>'
        +'<span class="hint">'+v.ts+' · '+esc(v.by)+'</span></div>'
        +'<div class="hint" style="margin-top:3px">'+esc(v.note)+'</div>'
        +(v.diff.length?'<div class="tn-diff" style="margin-top:6px">'+v.diff.map(d=>'<div><code>'+esc(d[0])+'</code> '+esc(d[1])+' → <b>'+esc(d[2])+'</b></div>').join('')+'</div>':'<div class="hint" style="margin-top:6px">起步版本,无差异</div>')
        +'<div style="margin-top:8px">'
          +(v.status==='观察中'?'<button class="btn sm" data-act="tnCompare" data-v="'+v.ver+'">对比效果</button> <button class="btn sm err" data-act="tnRollback" data-v="'+v.ver+'">回滚到上一版</button>':'')
          +'<button class="btn sm" data-act="tnSnap" data-v="'+v.ver+'">看口径快照</button>'
          +(v.status!=='观察中'&&v.ver<Math.max(...S.cfgV.map(x=>x.ver))?' <button class="btn sm" data-act="tnRollbackTo" data-v="'+v.ver+'">回滚到此版本</button>':'')
        +'</div></div></div>'}).join('')
     +'</div>'
     +'<div class="card"><h3>当前生效口径 <span class="hint">改动在「配置中心 → 评价口径」,保存即生成新版本</span></h3>'
     +'<div class="grid g3">'+[['来源权重 测评',S.cfg.srcW.quiz],['来源权重 演练',S.cfg.srcW.drill],['来源权重 实战行为',S.cfg.srcW.behavior],['来源权重 人工评价',S.cfg.srcW.coach],['掌握度 最近 N 次',S.cfg.win],['复测间隔(天)',S.cfg.retestDays],['观察期(周)',S.cfg.obsWeeks],['过关线',S.cfg.pass],['弱点预警',S.cfg.weakN+' 人 / '+Math.round(S.cfg.weakR*100)+'%']].map(x=>'<div class="rd-stat" style="padding:10px 12px"><div class="l">'+x[0]+'</div><div class="n" style="font-size:17px">'+x[1]+'</div></div>').join('')+'</div></div>';
  }
  if(sub==='前后对比'){
    b=pgCompare();
  }
  return '<div class="ph"><h2>调优 <span class="hint" style="font-weight:400">效果不理想 → 知道哪里不理想 → 改一个杠杆 → 看改完有没有变好 → 不行就回滚</span></h2><div>'+V23_SIM+'</div></div>'
   +tabsH('tune',['诊断','配置版本','前后对比'])+b;
}
A.tnTab=el=>{UI.tab.tune=el.dataset.v;render();$('#main').scrollTop=0};
/* 一键创建调整项:提高演练比重 + 行为权重下调 + 新增专项学习包 → 生成新配置版本(观察中) */
A.tnFix=()=>{
  const last=Math.max(...S.cfgV.map(v=>v.ver));
  const oldW=Object.assign({},S.cfg.srcW);
  const newW={quiz:.30,drill:.40,behavior:.20,coach:.10,self:0};
  /* 影响预估:用新权重重算全体就绪度,与现值比较 */
  const before=S.lrn.map(l=>({mid:l.mid,name:l.name,v:(v23Readiness(l.mid,l.tier)||{}).val}));
  const cfg2=Object.assign({},S.cfg,{srcW:newW});
  const after=S.lrn.map(l=>{const r=v23Readiness(l.mid,l.tier,cfg2);return {mid:l.mid,name:l.name,v:r.val,ach:r.ach}});
  let up=0,down=0,flip=0;const p=S.cfg.pass;
  before.forEach((b,i)=>{const a=after[i];if(b.v!=null&&a.v!=null){if(a.v>b.v)up++;else if(a.v<b.v)down++;
    const bp=v23Readiness(b.mid,(lrnOf(b.mid)||{}).tier).ach>=p,ap=a.ach!=null&&a.ach>=p;if(bp&&!ap)flip++}});
  const body='<div class="hint" style="line-height:1.9">诊断命中「第 ③ 层 练习与实战脱节」。建议同时调整三处:<br>'
   +'① <b>来源权重</b>:演练 .25 → .40、实战行为 .30 → .20、测评 .35 → .30<br>'
   +'② <b>学习包模板</b>:新增「顾虑解除专项」(学 → 演练 ×2 → 练题 → 复测)<br>'
   +'③ <b>下发对象</b>:新人训试点批已参训的 '+v23NewL('试点批').filter(l=>l.train).length+' 人(画像「顾虑解除」项)</div>'
   +'<div class="card" style="background:#fafbfc;margin:12px 0 0"><h3 style="font-size:14px">影响预估(用新权重重算全体,不是写死)</h3>'
   +'<div class="grid g4"><div><div class="hint">就绪度上升</div><b style="font-size:18px">'+up+'</b> 人</div>'
   +'<div><div class="hint">就绪度下降</div><b style="font-size:18px">'+down+'</b> 人</div>'
   +'<div><div class="hint">由达标变未达标</div><b style="font-size:18px;color:'+(flip?'#c8323a':'')+'">'+flip+'</b> 人</div>'
   +'<div><div class="hint">新增学习包</div><b style="font-size:18px">1</b> 个</div></div>'
   +'<div class="hint" style="margin-top:8px">演练权重上调后,有演练证据的人就绪度会变;只有测评证据的人会相对下降。这就是"改完谁受影响"的预估。</div></div>';
  openDlg('创建调整项 · 生成配置版本 v'+(last+1),body,
   '<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="tnFixDo">确认创建(进入观察期)</button>',true);
};
A.tnFixDo=()=>{
  const last=Math.max(...S.cfgV.map(v=>v.ver));const nv=last+1;
  const newW={quiz:.30,drill:.40,behavior:.20,coach:.10,self:0};
  const oldW=Object.assign({},S.cfg.srcW);
  S.cfg.srcW=newW;
  S.cfgV.filter(v=>v.status==='观察中').forEach(v=>v.status='已生效');
  S.cfgV.push({ver:nv,ts:today+' '+new Date().toTimeString().slice(0,5),by:UI.role.n.split(' · ')[0]+' '+UI.role.name,status:'观察中',
    note:'诊断命中「练习与实战脱节」:提高演练比重 + 行为权重下调,并新增「顾虑解除专项」学习包',
    diff:[['来源权重 演练',oldW.drill,newW.drill],['来源权重 实战行为',oldW.behavior,newW.behavior],['来源权重 测评',oldW.quiz,newW.quiz],['新增学习包模板','—','顾虑解除专项(PT4)']],
    snap:cfgFlat(S.cfg),raw:JSON.parse(JSON.stringify(S.cfg)),effWeek:v23End()+1});
  /* 新增学习包模板与实例 */
  if(!S.packTpl.some(t=>t.id==='PT4'))S.packTpl.push(JSON.parse(JSON.stringify(V23_PACK_V2)));
  if(!S.packs.some(p=>p.tpl==='PT4')){const n=v23NewL('试点批').filter(l=>l.train).length;
    S.packs.unshift({id:'PK0',tpl:'PT4',mid:'',kp:'K18',name:'顾虑解除专项(试点批 '+n+' 人)',steps:[{t:'学',done:false},{t:'演练',done:false},{t:'练题',done:false},{t:'复测',done:false}],due:addDays(today,14),status:'进行中',ts:today,v2:1,audience:n})}
  /* 演示用:预置的"生效后 3 周"数据现在揭晓(真实环境要等观察期满) */
  S.v2seen=true;
  v23RefreshAll();
  closeDlg();UI.tab.tune='配置版本';
  toast('已生成配置版本 v'+nv+',进入 '+S.cfg.obsWeeks+' 周观察期;就绪度已按新口径重算,「生效后 3 周」演示数据已揭晓','ok');
  render();
};
A.tnSnap=el=>{const v=S.cfgV.find(x=>x.ver===+el.dataset.v);
  openDlg('配置快照 · v'+v.ver,Object.keys(v.snap).map(k=>'<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f2f3f5"><span class="hint">'+esc(k)+'</span><b>'+esc(String(v.snap[k]))+'</b></div>').join(''),
   '<button class="btn" data-act="close">关闭</button>')};
A.tnRollback=el=>{const v=S.cfgV.find(x=>x.ver===+el.dataset.v);const prev=S.cfgV.filter(x=>x.ver<v.ver).sort((a,b)=>b.ver-a.ver)[0];
  if(!prev)return toast('没有更早的版本可回滚','err');
  A.tnRollbackTo({dataset:{v:prev.ver}})};
A.tnRollbackTo=el=>{const v=S.cfgV.find(x=>x.ver===+el.dataset.v);if(!v)return;
  const cur={ver:Math.max(...S.cfgV.map(x=>x.ver)),srcW:Object.assign({},S.cfg.srcW)};
  S.cfg.srcW=Object.assign({},v.raw.srcW);S.cfg.win=v.raw.win;S.cfg.decay=v.raw.decay;S.cfg.behWin=v.raw.behWin;S.cfg.behN=v.raw.behN;S.cfg.pass=v.raw.pass;S.cfg.obsWeeks=v.raw.obsWeeks;S.cfg.smallN=v.raw.smallN;S.cfg.corrTh=v.raw.corrTh;
  S.cfgV.filter(x=>x.status==='观察中').forEach(x=>x.status='已回滚');
  const nv=Math.max(...S.cfgV.map(x=>x.ver))+1;
  S.cfgV.push({ver:nv,ts:today+' '+new Date().toTimeString().slice(0,5),by:UI.role.n.split(' · ')[0]+' '+UI.role.name,status:'已生效',
    note:'回滚到 v'+v.ver+' 的口径',diff:[['来源权重 演练',cur.srcW.drill,v.raw.srcW.drill],['来源权重 实战行为',cur.srcW.behavior,v.raw.srcW.behavior],['来源权重 测评',cur.srcW.quiz,v.raw.srcW.quiz]],
    snap:cfgFlat(S.cfg),raw:JSON.parse(JSON.stringify(S.cfg))});
  v23RefreshAll();toast('已回滚到 v'+v.ver+' 的口径(生成 v'+nv+' 记录),就绪度已重算','ok');render()};
function pgCompare(){
  const v=S.cfgV.find(x=>x.status==='观察中')||S.cfgV[S.cfgV.length-1];
  if(!S.v2seen||!v.effWeek){
    return srcBar('「前后对比」需要先有一个<b>观察中</b>的配置版本,并等观察期积累数据。')
     +cta('还没有可对比的调整','先到「诊断」按建议创建调整项(生成配置版本),观察期满后这里展示生效前后 vs 对照批。','<button class="btn pri" data-act="tnTab" data-v="诊断">去诊断</button>');
  }
  const end=v23End();const cut=v.effWeek;const W=Math.max(1,end-cut+1);          /* 生效后可见 W 周 */
  const b1=Math.max(0,cut-W),b2=cut-1,a1=cut,a2=end;
  const beh=(grp,a,b)=>v23A3Rate(grp,a,b);
  const lockPer=(grp,a,b)=>{const L=v23NewL(grp);const t=L.reduce((s,l)=>s+outSum(l.mid,a,b).锁单,0);return L.length?+(t/L.length/Math.max(1,b-a+1)).toFixed(2):null};
  const rdyNow=grp=>{const L=v23NewL(grp);const vs=L.map(l=>v23Readiness(l.mid,l.tier).val).filter(x=>x!=null);return vs.length?+(vs.reduce((x,y)=>x+y,0)/vs.length).toFixed(1):null};
  /* 就绪度:生效前 = 用 v1 口径(上一版)重算,生效后 = 当前口径,同一批人 */
  const prevV=S.cfgV.filter(x=>x.ver<v.ver).sort((a,b)=>b.ver-a.ver)[0];
  const cfgBefore=Object.assign({},S.cfg,prevV?prevV.raw:{});
  const rdyBefore=(grp)=>{const L=v23NewL(grp);const vs=L.map(l=>v23Readiness(l.mid,l.tier,cfgBefore).val).filter(x=>x!=null);return vs.length?+(vs.reduce((x,y)=>x+y,0)/vs.length).toFixed(1):null};
  const rows=[
   {n:'「顾虑解除」行为出现率',bef:beh('试点批',b1,b2),aft:beh('试点批',a1,a2),unit:'%',pilot:1},
   {n:'平均就绪度(新人)',bef:rdyBefore('试点批'),aft:rdyNow('试点批'),unit:'',pilot:1,note:'口径重算'},
   {n:'人均周锁单(台)',bef:lockPer('试点批',b1,b2),aft:lockPer('试点批',a1,a2),unit:'',pilot:1},
   {n:'「顾虑解除」行为出现率',bef:beh('对照批',b1,b2),aft:beh('对照批',a1,a2),unit:'%',pilot:0},
   {n:'人均周锁单(台)',bef:lockPer('对照批',b1,b2),aft:lockPer('对照批',a1,a2),unit:'',pilot:0}
  ];
  const p3=rows[0],c3=rows[3];
  const did=+(((p3.aft-p3.bef)-(c3.aft-c3.bef))).toFixed(1);
  const pN=v23NewL('试点批').filter(l=>l.train).length,cN=v23NewL('对照批').length;
  return srcBar('对配置版本 v'+v.ver+',展示<b>生效前 '+W+' 周 vs 生效后 '+W+' 周</b>(第 '+(b1+1)+'–'+(b2+1)+' 周 vs 第 '+(a1+1)+'–'+(a2+1)+' 周);试点批与对照批<b>同期</b>对比。<b>只说相关,不说因果</b>;样本小,区间宽,不作绩效依据。')
   +'<div class="card"><h3>v'+v.ver+' 前后对比 <span class="hint">'+v.ts.slice(0,10)+' 生效 · 已观察 '+W+' / '+S.cfg.obsWeeks+' 周</span></h3>'
   +'<div class="tn-cmp" style="border-top:0"><div class="hd">指标</div><div class="hd">生效前 '+W+' 周</div><div class="hd">生效后 '+W+' 周</div><div class="hd">变化</div></div>'
   +rows.map(x=>{const d=(x.bef==null||x.aft==null)?null:+(x.aft-x.bef).toFixed(2);
     return '<div class="tn-cmp" '+(x.pilot?'':'style="opacity:.8"')+'><div>'+(x.pilot?'<b>试点</b> ':'<span class="hint">对照 </span>')+x.n+(x.note?' <span class="hint">('+x.note+')</span>':'')+'</div><div>'+(x.bef==null?'—':x.bef+x.unit)+'</div><div><b>'+(x.aft==null?'—':x.aft+x.unit)+'</b></div>'
      +'<div class="'+(d==null?'':d>=0?'up':'dn')+'">'+(d==null?'—':(d>=0?'+':'')+d+x.unit)+'</div></div>'}).join('')
   +'<div style="margin-top:12px;padding-top:10px;border-top:1px dashed var(--bd)"><b style="font-size:13px">双重差分(「顾虑解除」行为出现率)</b>'
     +'<div class="hint" style="margin-top:4px">(试点后 − 试点前) − (对照后 − 对照前) = ('+p3.aft+' − '+p3.bef+') − ('+c3.aft+' − '+c3.bef+') = <b style="font-size:16px;color:'+(did>=0?'#0b7a50':'#c8323a')+'">'+(did>=0?'+':'')+did.toFixed(1)+'pt</b></div>'
     +'<div class="hint" style="margin-top:6px">这只是<b>相关</b>:同期可能有新车上市、价格政策、门店活动等干扰;样本试点 '+pN+' 人 / 对照 '+cN+' 人,区间宽。要下结论需更长观察与更大样本。</div></div></div>'
   +'<div class="grid g2"><div class="card"><h3>行为出现率走势(试点 vs 对照)</h3>'
   +lineSvg([{n:'试点批(新人)',c:'#ff6700',d:v23WeekSeries('试点批').slice(0,end+1)},{n:'对照批(新人)',c:'#4e8cff',d:v23WeekSeries('对照批').slice(0,end+1),dash:1}],{w:460,h:200,cut:cut})
   +'<div class="hint">虚线位置 = 配置版本 v'+v.ver+' 生效周。来自汽车语料「顾虑解除」行为出现率。</div></div>'
   +'<div class="card"><h3>结论与建议</h3><div class="hint" style="line-height:1.95">'
   +'· 生效后「顾虑解除」行为出现率 <b>'+((p3.aft-p3.bef)>=0?'上升':'下降')+' '+Math.abs(p3.aft-p3.bef).toFixed(1)+'pt</b>,对照批同期 '+((c3.aft-c3.bef)>=0?'+':'')+(c3.aft-c3.bef).toFixed(1)+'pt → 方向看起来是对的。<br>'
   +'· 就绪度变化主要来自<b>权重重算</b>(演练权重上调),<b>不是学员突然变强</b>,必须写清楚。<br>'
   +'· 锁单变化样本太小,不下结论。<br>'
   +'· 建议:保留 v'+v.ver+' 口径,把观察期再延长 '+S.cfg.obsWeeks+' 周;若行为出现率回落,回滚到 v'+(v.ver-1)+'。</div>'
   +'<div style="margin-top:10px"><button class="btn pri" data-act="tnKeep" data-v="'+v.ver+'">保留此口径(转已生效)</button> <button class="btn err" data-act="tnRollback" data-v="'+v.ver+'">回滚到上一版</button></div></div></div>';
}
function v23WeekSeries(grp){
  const kids=v23A3Kps().map(k=>k.id);
  const L=v23NewL(grp);
  return Array.from({length:V23_NWK},(_,w)=>{
    const vs=L.map(l=>{const arr=kids.map(kid=>((S.beh[l.mid]||{})[kid]||[])[w]).filter(Boolean);if(!arr.length)return null;
      const sw=arr.reduce((a,x)=>a+x.n,0),so=arr.reduce((a,x)=>a+x.n*x.rate,0);return sw?so/sw:null}).filter(v=>v!=null);
    return vs.length?Math.round(vs.reduce((a,b)=>a+b,0)/vs.length):0});
}
A.tnKeep=el=>{const v=S.cfgV.find(x=>x.ver===+el.dataset.v);v.status='已生效';toast('已保留 v'+v.ver+' 口径','ok');render()};
A.tnCompare=el=>{UI.tab.tune='前后对比';render();$('#main').scrollTop=0};

/* ---------- 配置中心 · 维度体系 ---------- */
function cfgDims(){
  if(!(S.dims&&S.dims.length))return srcBar('维度体系是「标签」的升级:把产品、车型、场景、客户类型、竞品、销售阶段、能力做成可配置的维度。')+v23EmptyCta('维度');
  const f=UI.sel.dmf||(UI.sel.dmf={});
  const roleTxt={belong:['归类项','belong','决定归在哪个车型/部位，参与完备率统计'],context:['筛选条件','context','用于筛选和推荐'],ability:['能力项','ability','带权重等级，进入岗位标准']};
  const nUse=(did,vid)=>S.kps.filter(k=>((k.dims||{})[did]||[]).includes(vid)).length;
  const nUseAny=did=>S.kps.filter(k=>((k.dims||{})[did]||[]).length).length;
  const sel=f.id||S.dims[0].id;const d=dimOf(sel)||S.dims[0];
  const lim=10;
  const tpl=['产品','车型','场景','客户类型','竞品','销售阶段','能力'];
  return srcBar('这里是系统里可维护的分类方式。业务上只需要理解三件事：<b>车型和标签</b>决定一个知识点归在哪、完备率怎么算；<b>场景和客户</b>用于筛选；<b>4 个能力项</b>用于岗位标准和效果诊断。改名不会影响已挂的知识点，合并会保留历史。')
   +'<div class="grid g4" style="margin-bottom:16px">'
     +'<div class="rd-stat"><div class="l">维度数</div><div class="n">'+S.dims.length+'<small>/ '+lim+' 上限</small></div><div class="h">超过上限需先停用旧维度(防配置地狱)</div></div>'
     +'<div class="rd-stat"><div class="l">归类项</div><div class="n">'+S.dims.filter(x=>x.role==='belong').length+'</div><div class="h">车型、标签；决定完备率</div></div>'
     +'<div class="rd-stat"><div class="l">能力项</div><div class="n">'+S.dims.filter(x=>x.role==='ability').length+'</div><div class="h">探需 / 讲车 / 顾虑 / 带人</div></div>'
     +'<div class="rd-stat"><div class="l">已归类的知识点</div><div class="n">'+S.kps.filter(k=>Object.keys(k.dims||{}).length).length+'<small>/ '+S.kps.length+'</small></div><div class="h">归类后才进入车型 × 标签矩阵</div></div></div>'
   +'<div class="card"><h3>维度列表 <span class="hint">起步模板 7 个维度,开箱即用</span></h3>'
   +'<div class="tw"><table class="t nw"><tr><th>维度</th><th>形态</th><th>角色</th><th>多选</th><th>必填对象</th><th>来源</th><th>值数量</th><th>被知识点引用</th><th>操作</th></tr>'
   +S.dims.map(x=>{const rt=roleTxt[x.role];
     return '<tr style="'+(x.id===sel?'background:#fff9f4':'')+'"><td><b>'+esc(x.name)+'</b><div class="hint">'+x.id+(x.note?' · '+esc(x.note):'')+'</div></td>'
      +'<td>'+(x.shape==='tree'?'树形(≤4 级)':'平铺')+'</td><td><span class="dm-role dm-tag '+x.role+'" style="margin:0;padding:1px 8px">'+rt[0]+'</span><div class="hint">'+rt[2]+'</div></td>'
      +'<td>'+(x.multi?'多选':'单选')+'</td><td>'+((x.requiredFor||[]).length?'知识点':'—')+'</td>'
      +'<td>'+(x.source==='sync'?'<span class="tag blue">外部同步 · 只读</span>':'<span class="tag">手工维护</span>')+'</td>'
      +'<td>'+x.values.filter(v=>v.status!=='off').length+'</td><td>'+nUseAny(x.id)+' / '+S.kps.length+'</td>'
      +'<td><a class="link" data-act="dmOpen" data-id="'+x.id+'">管理值</a></td></tr>'}).join('')
   +'</table></div></div>'
   +'<div class="card"><h3>「'+esc(d.name)+'」的值 <span class="hint">'+(d.source==='sync'?'来自外部同步,只读':'可新增 / 停用 / 合并')+'</span></h3>'
   +(d.shape==='tree'?'<div class="tw"><table class="t nw"><tr><th>值</th><th>层级</th><th>状态</th><th>知识点数</th><th>操作</th></tr>'
      +d.values.map(v=>{const n=nUse(d.id,v.id)+dimKids(d.id,v.id).reduce((a,k)=>a+nUse(d.id,k.id),0);
        return '<tr style="'+(v.status==='off'?'opacity:.5':'')+'"><td style="padding-left:'+(12+(v.lv-1)*20)+'px">'+(dimKids(d.id,v.id).length?'<b>'+esc(v.name)+'</b>':esc(v.name))+'<span class="hint"> '+v.id+(v.mergedTo?' → 已合并到 '+v.mergedTo:'')+'</span></td><td>'+v.lv+'</td><td>'+(v.status==='off'?'<span class="tag">已停用</span>':'<span class="tag ok">启用</span>')+'</td><td>'+(n||'<span class="hint">0</span>')+'</td>'
         +'<td>'+(d.source==='sync'?'<span class="hint">只读</span>':(v.status==='off'?'<a class="link" data-act="dmToggle" data-d="'+d.id+'" data-v="'+v.id+'">启用</a>':'<a class="link" data-act="dmToggle" data-d="'+d.id+'" data-v="'+v.id+'">停用</a> <a class="link" data-act="dmMerge" data-d="'+d.id+'" data-v="'+v.id+'">合并到…</a>'))+'</td></tr>'}).join('')+'</table></div>'
    :'<div style="margin-bottom:10px">'+d.values.map(v=>'<span class="dm-tag '+d.role+'" style="'+(v.status==='off'?'opacity:.45;text-decoration:line-through':'')+'"><b>'+esc(v.name)+'</b> · '+nUse(d.id,v.id)+' 个点 <a class="link" style="margin:0 0 0 4px" data-act="dmToggle" data-d="'+d.id+'" data-v="'+v.id+'">'+(v.status==='off'?'启用':'停用')+'</a></span>').join('')+'</div>'
     +'<div style="display:flex;gap:8px;align-items:center"><input type="text" id="dm_new" placeholder="新值,如:自驾游" style="width:200px"><button class="btn sm pri" data-act="dmAdd" data-d="'+d.id+'">添加</button></div>')
   +'<div class="hint" style="margin-top:10px">停用某个值会影响:<b>'+S.kps.filter(k=>((k.dims||{})[d.id]||[]).length).length+'</b> 个已挂「'+esc(d.name)+'」的知识点(只停止新选,已挂的保留;合并会改写引用并留 <code>mergedTo</code>)。</div></div>'
   +'<div class="card"><h3>变更留痕</h3>'+((S.dimLog||[]).length?'<table class="t"><tr><th>时间</th><th>维度</th><th>动作</th><th>影响</th></tr>'+S.dimLog.slice(0,10).map(x=>'<tr><td class="hint">'+x.t+'</td><td>'+esc(x.dim)+'</td><td>'+esc(x.act)+'</td><td class="hint">'+esc(x.eff)+'</td></tr>').join('')+'</table>':'<div class="hint">还没有变更。停用 / 合并 / 新增值会在这里留痕。</div>')+'</div>';
}
A.dmOpen=el=>{(UI.sel.dmf||(UI.sel.dmf={})).id=el.dataset.id;render()};
function dmLog(dim,act,eff){(S.dimLog=S.dimLog||[]).unshift({t:today+' '+new Date().toTimeString().slice(0,5),dim,act,eff})}
A.dmAdd=el=>{const d=dimOf(el.dataset.d);const n=($('#dm_new').value||'').trim();if(!n)return toast('请填写新值','err');if(d.values.some(v=>v.name===n))return toast('已存在','err');
  const id='V'+d.id.slice(1)+'_'+Date.now().toString(36).slice(-4);d.values.push({id,name:n,lv:1,path:n,status:'on'});dmLog(d.name,'新增值「'+n+'」','不影响已有知识点');toast('已添加「'+n+'」','ok');render()};
A.dmToggle=el=>{const d=dimOf(el.dataset.d);const v=dimVal(d.id,el.dataset.v);const n=S.kps.filter(k=>((k.dims||{})[d.id]||[]).includes(v.id)).length;
  v.status=v.status==='off'?'on':'off';dmLog(d.name,(v.status==='off'?'停用':'启用')+'值「'+v.name+'」','影响 '+n+' 个知识点(已挂的保留)');
  toast((v.status==='off'?'已停用':'已启用')+'「'+v.name+'」,影响 '+n+' 个知识点','ok');render()};
A.dmMerge=el=>{const d=dimOf(el.dataset.d);const v=dimVal(d.id,el.dataset.v);
  const opts=d.values.filter(x=>x.id!==v.id&&x.status!=='off'&&x.pid===v.pid);
  if(!opts.length)return toast('没有可合并的同级值','err');
  openDlg('合并「'+v.name+'」','<div class="hint" style="margin-bottom:10px">合并会把挂了「'+esc(v.name)+'」的知识点改挂到目标值,并在原值上留 <code>mergedTo</code>(历史数据可追溯)。</div><select id="dm_to" style="width:100%;height:34px;border:1px solid var(--bd2);border-radius:8px">'+opts.map(x=>'<option value="'+x.id+'">'+esc(x.name)+'</option>').join('')+'</select>',
   '<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="dmMergeDo" data-d="'+d.id+'" data-v="'+v.id+'">确认合并</button>')};
A.dmMergeDo=el=>{const d=dimOf(el.dataset.d);const v=dimVal(d.id,el.dataset.v);const to=dimVal(d.id,$('#dm_to').value);
  let n=0;S.kps.forEach(k=>{const a=(k.dims||{})[d.id];if(a&&a.includes(v.id)){k.dims[d.id]=[...new Set(a.map(x=>x===v.id?to.id:x))];n++}});
  v.status='off';v.mergedTo=to.id;dmLog(d.name,'合并「'+v.name+'」→「'+to.name+'」','改写 '+n+' 个知识点的引用,原值留 mergedTo');
  closeDlg();toast('已合并,改写 '+n+' 个知识点','ok');render()};

/* ---------- 配置中心 · 岗位画像 ---------- */
function cfgProfile(){
  if(!(S.profiles&&S.profiles.length))return srcBar('岗位画像 = 岗位 × 能力项 × 权重 × 目标等级。')+v23EmptyCta('岗位画像');
  pfBaseOf(V23_TIER[0]); /* 进入页面即拍基线(保存前的画像),之后的编辑都是相对它的草稿 */
  const f=UI.sel.pff||(UI.sel.pff={});const tier=f.tier||V23_TIER[0];const p=pfOf(tier);
  const ws=pfWsum(p);const ok=ws===100;
  const abVals=dimOf('Dab').values.filter(v=>v.lv===2||!dimKids('Dab',v.id).length);
  const nPeople=S.lrn.filter(l=>l.tier===tier).length;
  const hit=(it)=>pfKps(it);
  return srcBar('岗位标准回答：这个岗位最该会什么、各占多少分。这里只用 4 个业务能力项（探需 / 场景化讲车 / 顾虑解除 / 带人辅导）。改权重会立刻影响这个岗位所有人的就绪度，保存前会给出影响人数。权重合计必须 = 100。')
   +'<div class="fil"><span class="hint">岗位档</span>'+V23_TIER.map(t=>'<span class="'+(tier===t?'tag pri':'tag')+'" style="cursor:pointer;padding:3px 12px" data-act="pfTier" data-v="'+t+'">'+t+' · '+S.lrn.filter(l=>l.tier===t).length+' 人</span>').join('')+'</div>'
   +'<div class="card"><h3>'+tier+' 画像 <span class="pf-sum '+(ok?'ok':'err')+'">权重合计 '+ws+(ok?' ✓':' ≠ 100,无法保存')+'</span></h3>'
   +'<div class="hint" style="margin-bottom:8px">'+esc(p.note||'')+'</div>'
   +'<div class="pf-item" style="border-top:0"><div class="hint">能力项(选择器 → 命中知识点)</div><div class="hint">权重</div><div class="hint">目标等级</div><div class="hint">命中</div></div>'
   +p.items.map((it,i)=>{const ks=hit(it);
     return '<div class="pf-item"><div class="sel"><b>'+esc(it.label)+'</b><em>'+it.vals.map(v=>'能力项 = '+dimLabel('Dab',v)).join(' 或 ')+'</em></div>'
      +'<div><input type="number" min="0" max="100" value="'+it.weight+'" data-wc="pfEdit" data-i="'+i+'" data-k="weight"></div>'
      +'<div><input type="number" min="0" max="100" value="'+it.target+'" data-wc="pfEdit" data-i="'+i+'" data-k="target"></div>'
      +'<div><span class="tag '+(ks.length?'ok':'err')+'">'+ks.length+' 个知识点</span></div></div>'}).join('')
   +'<div class="hint" style="margin-top:10px">预览:当前 '+nPeople+' 位「'+tier+'」。改权重 / 目标会<b>立刻影响</b>他们的就绪度(保存时给影响预估并生成配置版本)。</div>'
   +'<div style="margin-top:12px"><button class="btn pri '+(ok?'':'dis')+'" '+(ok?'':'disabled')+' data-act="pfSave">保存并生成配置版本</button> <button class="btn" data-act="pfReset">还原起步值</button></div></div>'
   +'<div class="card"><h3>命中知识点预览</h3><div class="tw"><table class="t nw"><tr><th>画像项</th><th>权重</th><th>命中知识点</th></tr>'
   +p.items.map(it=>'<tr><td>'+esc(it.label)+'</td><td>'+it.weight+'%</td><td style="white-space:normal;min-width:260px">'+(hit(it).map(k=>'<a class="link" data-act="kpOpen" data-id="'+k.id+'">'+esc(k.name)+'</a>').join('、')||'<span class="tag err">没有命中,该项无证据</span>')+'</td></tr>').join('')+'</table></div></div>';
}
A.pfTier=el=>{(UI.sel.pff||(UI.sel.pff={})).tier=el.dataset.v;render()};
A.pfEdit=el=>{const f=UI.sel.pff||{};const tier=f.tier||V23_TIER[0];const p=pfOf(tier);const it=p.items[+el.dataset.i];const v=+el.value;
  if(!(v>=0&&v<=100))return toast('请填 0–100','err');it[el.dataset.k]=v;render()};
A.pfReset=()=>{const f=UI.sel.pff||{};const tier=f.tier||V23_TIER[0];const seed=V23_PROFILE_SEED.find(x=>x.role===tier);const p=pfOf(tier);
  p.items=JSON.parse(JSON.stringify(seed.items));p.items.forEach(it=>{it.vals=it.vals.map(n=>dimIdByName(it.dim,n)).filter(Boolean)});toast('已还原起步值','ok');render()};
/* 画像编辑是"草稿态":改动直接落在 S.profiles(便于预览命中),基线 PF_BASE 保存时才更新。
   这样「影响预估」能拿保存前的基线 vs 当前草稿比较,而不是自己跟自己比。 */
let PF_BASE=null;
const pfBaseOf=tier=>{if(!PF_BASE)PF_BASE=JSON.parse(JSON.stringify(S.profiles));return PF_BASE.find(p=>p.role===tier)};
function pfReadinessWith(l,prof){const cur=S.profiles;S.profiles=PF_BASE?PF_BASE.map(p=>p.role===prof.role?prof:p):cur;const r=v23Readiness(l.mid,l.tier);S.profiles=cur;return r}
A.pfSave=()=>{const f=UI.sel.pff||{};const tier=f.tier||V23_TIER[0];const p=pfOf(tier);if(pfWsum(p)!==100)return toast('权重合计需等于 100','err');
  const base=pfBaseOf(tier);
  const people=S.lrn.filter(l=>l.tier===tier);
  const before=people.map(l=>pfReadinessWith(l,base).val);
  const after=people.map(l=>v23Readiness(l.mid,l.tier).val);
  const chg=after.filter((a,i)=>a!==before[i]).length;
  const wdiff=p.items.map((it,i)=>[it.label,base.items[i]?base.items[i].weight+'/'+base.items[i].target:'—',it.weight+'/'+it.target]).filter(x=>x[1]!==x[2]);
  if(!wdiff.length)return toast('没有改动','');
  const nv=Math.max(...S.cfgV.map(v=>v.ver))+1;
  S.cfgV.filter(v=>v.status==='观察中').forEach(v=>v.status='已生效');
  S.cfgV.push({ver:nv,ts:today+' '+new Date().toTimeString().slice(0,5),by:UI.role.n.split(' · ')[0]+' '+UI.role.name,status:'观察中',note:'调整「'+tier+'」画像权重 / 目标等级(影响 '+chg+' 人的就绪度)',diff:wdiff.map(x=>['画像 '+tier+' · '+x[0]+'(权重/目标)',x[1],x[2]]),snap:cfgFlat(S.cfg),raw:JSON.parse(JSON.stringify(S.cfg)),profile:JSON.parse(JSON.stringify(S.profiles))});
  PF_BASE=JSON.parse(JSON.stringify(S.profiles));
  v23RefreshAll();
  toast('已保存,生成配置版本 v'+nv+';'+chg+' 人的就绪度发生变化','ok');render()};

/* ---------- 配置中心 · 评价口径 ---------- */
function cfgEval(){
  const c=S.cfg;const W=c.srcW;
  const tot=Object.values(W).reduce((a,b)=>a+b,0);
  const fld=(k,label,val,hint,step,attr)=>'<div class="fld"><label>'+label+'</label><input type="number" step="'+(step||1)+'" id="ce_'+k+'" value="'+val+'" '+(attr||'')+' data-wc="ceChange"><div class="fh">'+hint+'</div></div>';
  return srcBar('评价口径 = <b>所有可调杠杆</b>。每次保存会<b>先给影响预估</b>(用新值重算全体就绪度),再生成配置版本。这是"效果不理想时能改"的入口。')
   +'<div class="card"><h3>① 来源权重 <span class="hint">五类证据按权重合成掌握度;缺失的来源不参与(自动归一);自评默认 0</span></h3>'
   +'<div class="fgrid">'+[['quiz','测评(题)',W.quiz],['drill','演练',W.drill],['behavior','实战行为(语料)',W.behavior],['coach','人工评价',W.coach],['self','自评',W.self]].map(x=>fld('w_'+x[0],x[1],x[2],'占比 0–1',.05,'min="0" max="1"')).join('')+'</div>'
   +'<div class="hint">合计 <b style="color:'+(Math.abs(tot-1)<0.001?'#0b7a50':'#a15c00')+'">'+tot.toFixed(2)+'</b>(不强制 = 1,系统按实际参与来源归一)</div></div>'
   +'<div class="card"><h3>② 掌握度参数</h3><div class="fgrid">'
     +fld('win','最近 N 次作答',c.win,'取最近 N 次参与计算',1,'min="1"')+fld('decay','时间衰减',c.decay,'每往前一次权重 × 该值',.01,'min="0.5" max="1"')
     +fld('shrinkA','证据少时:保留比例',c.shrinkA,'只有 1 个来源时,保留原值的比例',.05)+fld('shrinkB','证据少时:向 50 收缩比例',c.shrinkB,'其余向 50 靠拢',.05)
     +fld('retestDays','复测间隔(天)',c.retestDays,'过关后多少天再测',1)+fld('pass','过关线',c.pass,'掌握度 / 目标达成率的过关线',1)
   +'</div></div>'
   +'<div class="card"><h3>③ 行为与阈值</h3><div class="fgrid">'
     +fld('behWin','行为统计窗口(周)',c.behWin,'实战行为取最近几周',1)+fld('behN','行为最小样本',c.behN,'少于此数的周按"样本不足"处理',1)
     +fld('weakN','弱点预警:最少人数',c.weakN,'已测人数 ≥ 此值才预警',1)+fld('weakR','弱点预警:未过关占比',c.weakR,'0–1',.05)
     +fld('obsWeeks','观察期(周)',c.obsWeeks,'配置改动后观察几周再对比',1)+fld('smallN','小样本门槛(人)',c.smallN,'低于此样本不下结论',1)
     +fld('corrTh','相关性预警阈值',c.corrTh,'|r| 低于此值,画像层标"偏弱"',.05)
   +'</div></div>'
   +'<div class="card" style="border-color:var(--pri)"><h3>影响预估与保存</h3>'
   +'<div class="hint" style="margin-bottom:10px">点「预估影响」用上面的新值重算全体就绪度,与当前值对比,不写入;确认后「保存」才生成配置版本。</div>'
   +'<button class="btn" data-act="ceEst">预估影响</button> <button class="btn pri" data-act="ceSave">保存并生成配置版本</button> <button class="btn" data-act="ceReset">还原为当前值</button>'
   +'<div id="ce_est" style="margin-top:12px"></div></div>';
}
A.ceChange=()=>{};
function ceRead(){
  const g=k=>+$('#ce_'+k).value;
  return {srcW:{quiz:g('w_quiz'),drill:g('w_drill'),behavior:g('w_behavior'),coach:g('w_coach'),self:g('w_self')},
    win:g('win'),decay:g('decay'),shrinkA:g('shrinkA'),shrinkB:g('shrinkB'),retestDays:g('retestDays'),pass:g('pass'),
    behWin:g('behWin'),behN:g('behN'),weakN:g('weakN'),weakR:g('weakR'),obsWeeks:g('obsWeeks'),smallN:g('smallN'),corrTh:g('corrTh')};
}
function ceCheck(n){
  for(const k of ['quiz','drill','behavior','coach','self'])if(!(n.srcW[k]>=0&&n.srcW[k]<=1))return '来源权重需在 0–1 之间';
  if(!(n.win>=1))return '「最近 N 次」至少 1';if(!(n.decay>=0.5&&n.decay<=1))return '时间衰减需在 0.5–1';
  if(!(n.pass>0&&n.pass<=100))return '过关线需在 1–100';if(!(n.behWin>=1))return '行为窗口至少 1 周';
  if(!(n.weakR>=0&&n.weakR<=1))return '弱点占比需在 0–1';if(!(n.obsWeeks>=1))return '观察期至少 1 周';
  return null}
function ceDiff(n){const o=S.cfg;const d=[];const push=(l,a,b)=>{if(String(a)!==String(b))d.push([l,a,b])};
  push('来源权重 测评',o.srcW.quiz,n.srcW.quiz);push('来源权重 演练',o.srcW.drill,n.srcW.drill);push('来源权重 实战行为',o.srcW.behavior,n.srcW.behavior);push('来源权重 人工评价',o.srcW.coach,n.srcW.coach);push('来源权重 自评',o.srcW.self,n.srcW.self);
  [['win','最近 N 次'],['decay','时间衰减'],['shrinkA','收缩 A'],['shrinkB','收缩 B'],['retestDays','复测间隔'],['pass','过关线'],['behWin','行为窗口'],['behN','行为最小样本'],['weakN','弱点最少人数'],['weakR','弱点占比'],['obsWeeks','观察期'],['smallN','小样本'],['corrTh','相关性阈值']].forEach(x=>push(x[1],o[x[0]],n[x[0]]));
  return d}
A.ceEst=()=>{const n=ceRead();const er=ceCheck(n);if(er)return toast(er,'err');const d=ceDiff(n);
  if(!d.length){$('#ce_est').innerHTML='<div class="hint">没有改动。</div>';return}
  const cfg2=Object.assign({},S.cfg,n);
  const bef=S.lrn.map(l=>{const r=v23Readiness(l.mid,l.tier);return {mid:l.mid,v:r.val,ok:r.ach!=null&&r.ach>=S.cfg.pass}});
  const aft=S.lrn.map(l=>{const r=v23Readiness(l.mid,l.tier,cfg2);return {mid:l.mid,v:r.val,ok:r.ach!=null&&r.ach>=n.pass}});
  let up=0,dn=0,a2b=0,b2a=0,sum=0,cnt=0;
  bef.forEach((b,i)=>{const a=aft[i];if(b.v==null||a.v==null)return;if(a.v>b.v)up++;else if(a.v<b.v)dn++;if(b.ok&&!a.ok)a2b++;if(!b.ok&&a.ok)b2a++;sum+=a.v-b.v;cnt++});
  $('#ce_est').innerHTML='<div class="card" style="background:#fafbfc;margin:0"><h3 style="font-size:14px">影响预估 <span class="hint">共 '+d.length+' 项改动,用新值重算 '+cnt+' 人</span></h3>'
   +'<div class="tn-diff">'+d.map(x=>'<div><code>'+esc(x[0])+'</code> '+esc(String(x[1]))+' → <b>'+esc(String(x[2]))+'</b></div>').join('')+'</div>'
   +'<div class="grid g4" style="margin-top:10px"><div><div class="hint">就绪度上升</div><b style="font-size:18px">'+up+'</b> 人</div><div><div class="hint">就绪度下降</div><b style="font-size:18px">'+dn+'</b> 人</div>'
   +'<div><div class="hint">达标 → 未达标</div><b style="font-size:18px;color:'+(a2b?'#c8323a':'')+'">'+a2b+'</b> 人</div><div><div class="hint">未达标 → 达标</div><b style="font-size:18px;color:#0b7a50">'+b2a+'</b> 人</div></div>'
   +'<div class="hint" style="margin-top:8px">平均变化 '+(cnt?(sum/cnt>=0?'+':'')+(sum/cnt).toFixed(1):0)+' 分。<b>这是口径变化带来的重算,不是学员能力变化</b>,保存时必须写在版本说明里。</div></div>'};
A.ceSave=()=>{const n=ceRead();const er=ceCheck(n);if(er)return toast(er,'err');const d=ceDiff(n);if(!d.length)return toast('没有改动','');
  const nv=Math.max(...S.cfgV.map(v=>v.ver))+1;
  S.cfgV.filter(v=>v.status==='观察中').forEach(v=>v.status='已生效');
  Object.assign(S.cfg,n);
  S.cfgV.push({ver:nv,ts:today+' '+new Date().toTimeString().slice(0,5),by:UI.role.n.split(' · ')[0]+' '+UI.role.name,status:'观察中',note:'手动调整评价口径('+d.length+' 项)',diff:d,snap:cfgFlat(S.cfg),raw:JSON.parse(JSON.stringify(S.cfg))});
  v23RefreshAll();toast('已保存,生成配置版本 v'+nv+',进入 '+S.cfg.obsWeeks+' 周观察期','ok');render()};
A.ceReset=()=>{render()};

/* ---------- 配置中心 · 学习包模板 ---------- */
function cfgPack(){
  if(!(S.packTpl&&S.packTpl.length))return srcBar('学习包 = 任务化下发的一组步骤。')+v23EmptyCta('学习包模板');
  const T=S.packTpl;
  const stC={学:'blue',练题:'ok',演练:'pri',复测:'warn'};
  return srcBar('学习包 = 任务化下发的一组步骤(<b>学 → 练题 → 演练 → 复测</b>)。触发条件命中后按模板给学员下发;下发走「学习项目 → 节点」。模板的触发、步骤、频次、截止都可调。')
   +'<div class="card"><h3>模板 <span class="hint">'+T.length+' 个</span></h3>'
   +'<div class="tw"><table class="t nw"><tr><th>模板</th><th>触发条件</th><th>步骤</th><th>次数</th><th>截止(天)</th><th>下发对象</th><th>通过规则</th><th>已下发</th></tr>'
   +T.map(t=>'<tr><td><b>'+esc(t.name)+'</b>'+(t.v2?' <span class="tag warn">v2 新增</span>':'')+'<div class="hint">'+t.id+'</div></td><td>'+esc(t.trigger)+'</td>'
     +'<td>'+t.steps.map(s=>'<span class="tag '+(stC[s[0]]||'')+'">'+s[0]+(s[1]>1?' ×'+s[1]:'')+'</span>').join('<span class="hint"> → </span>')+'</td>'
     +'<td>'+t.count+'</td><td>'+t.dueDays+'</td><td style="white-space:normal;min-width:180px">'+esc(t.audience)+'</td><td>'+esc(t.passRule)+'</td><td>'+S.packs.filter(p=>p.tpl===t.id).length+' 个</td></tr>').join('')
   +'</table></div></div>'
   +'<div class="card"><h3>已下发的学习包 <span class="hint">共 '+S.packs.length+' 个</span></h3>'
   +'<div class="tw"><table class="t nw"><tr><th>学习包</th><th>学员 / 范围</th><th>知识点</th><th>步骤进度</th><th>截止</th><th>状态</th></tr>'
   +S.packs.slice(0,14).map(p=>{const l=p.mid?lrnOf(p.mid):null;return '<tr><td>'+esc(p.name)+'</td><td>'+(l?esc(l.name)+'<div class="hint">'+esc(l.store)+'</div>':'<span class="tag pri">试点批 '+(p.audience||'')+' 人</span>')+'</td><td>'+esc((kp(p.kp)||{}).name||'')+'</td>'
     +'<td>'+p.steps.map(s=>'<span class="tag '+(s.done?'ok':'')+'">'+s.t+(s.done?' ✓':'')+'</span>').join('')+'</td><td>'+p.due+'</td><td><span class="tag '+(p.status==='已完成'?'ok':p.status==='逾期'?'err':'warn')+'">'+p.status+'</span></td></tr>'}).join('')
   +'</table></div></div>';
}

/* ---------- 零售通:就绪度卡 / 学习包入口(与后台同源) ---------- */
function rdyCard(mid){
  const l=typeof lrnOf==='function'?lrnOf(mid):null;
  if(!l||!S.profiles||!S.profiles.length)return '';
  const r=v23Readiness(l.mid,l.tier);
  const mo=misOf(l.mid).filter(m=>m.status!=='closed').length;
  const pk=packsOf(l.mid).filter(p=>p.status!=='已完成');
  const weak=r.items.filter(i=>i.mean!=null&&i.mean<i.item.target).sort((a,b)=>(b.item.weight*(1-a.mean/a.item.target))-(a.item.weight*(1-b.mean/b.item.target)));
  return '<div class="r-rdy"><div class="r-rdy-h"><div><div style="font-size:12px;color:#999">我的就绪度 · '+l.tier+'画像</div><div class="r-rdy-n" style="color:'+v23RdyColor(r.val)+'">'+(r.val==null?'—':r.val)+'<small style="font-size:12px;color:#999;font-weight:400"> / 100</small></div></div>'
    +'<div style="text-align:right;font-size:11px;color:#999">目标达成 <b style="color:#333;font-size:14px">'+(r.ach==null?'—':r.ach+'%')+'</b><br><span style="color:#bbb">模拟数据</span></div></div>'
    +'<div class="r-rdy-bar"><i style="width:'+(r.val||0)+'%"></i></div>'
    +'<div style="font-size:12px;color:#666;line-height:1.7">'+(weak.length?'最该先补:<b>'+esc(weak[0].item.label)+'</b>(权重 '+weak[0].item.weight+'%,当前 '+Math.round(weak[0].mean)+' / 目标 '+weak[0].item.target+')':'各项都达到目标等级 🎉')+'</div>'
    +'<div style="display:flex;gap:14px;margin-top:8px;font-size:12px;color:#888"><span>未关闭错题 <b style="color:'+(mo?'#e5484d':'#12a36b')+'">'+mo+'</b></span><span>学习包 <b style="color:#333">'+pk.length+'</b> 个进行中</span></div></div>'
   +(pk.length?pk.slice(0,2).map(p=>'<div class="r-pk"><div class="c"><b>'+esc(p.name)+'</b><span class="r-pk-t">'+p.steps.map(s=>s.t+(s.done?'✓':'')).join(' → ')+' · 截止 '+p.due+'</span></div><button class="rb" data-act="rPack" data-id="'+p.id+'">去完成</button></div>').join(''):'');
}
A.rPack=el=>{const p=S.packs.find(x=>x.id===el.dataset.id);if(!p)return;
  const nx=p.steps.find(s=>!s.done);if(!nx){toast('这个学习包已全部完成','ok');return}
  nx.done=true;if(p.steps.every(s=>s.done))p.status='已完成';
  toast('已完成「'+nx.t+'」'+(p.status==='已完成'?',学习包完成':''),'ok');renderRN()};

/* ---------- 知识点页:维度组合展示(替代"事实型 / 技能型"硬分类的说明) ---------- */
function kpDimsHtml(k){
  if(!k.dims||!Object.keys(k.dims).length)return '';
  const order=['Dprod','Dcar','Dab','Dscene','Dcust','Dcomp','Dstage'];
  return order.filter(did=>(k.dims[did]||[]).length&&dimOf(did)).map(did=>{const d=dimOf(did);
    return '<div style="margin-bottom:6px"><span class="hint" style="display:block;font-size:11px;margin-bottom:2px">'+esc(d.name)+'</span>'
     +k.dims[did].map(v=>'<span class="dm-tag '+d.role+'"><b>'+esc(dimLabel(did,v))+'</b></span>').join('')+'</div>'}).join('')
   +'<div class="hint" style="margin-top:4px;line-height:1.6">'+kpKindHint(k)+'</div>';
}
/* 由挂的维度自然区分:有产品维度 = 产品卖点;只有能力 + 场景 = 销售动作 */
function kpKindHint(k){
  if(!k.dims)return '';
  const hasProd=(k.dims.Dprod||[]).length,hasAb=(k.dims.Dab||[]).length;
  if(hasProd&&hasAb)return '(挂了产品 + 能力:产品卖点)';
  if(hasAb&&!hasProd)return '(只挂能力 + 场景:销售动作)';
  return '';
}

/* ---------- 数据说明(理想态数据自检):让评审者一眼看懂"这些数是怎么来的、有多真" ---------- */
function v23DataNote(){
  if(v23Empty())return '';
  const q=v23Quadrant();const w=v23Wins();
  const fp=v23Funnel('试点批',w.cur[0],w.cur[1]),fc=v23Funnel('对照批',w.cur[0],w.cur[1]);
  const diff=(a,b)=>b?+((a-b)/b*100).toFixed(0):0;
  const tiers=V23_TIER.map(t=>t+' '+S.lrn.filter(l=>l.tier===t).length).join(' · ');
  const evN=['q','dr','co','se'].reduce((a,k)=>a+Object.values(S.ev[k]||{}).reduce((x,o)=>x+Object.keys(o).length,0),0);
  const behN=Object.values(S.beh||{}).reduce((a,o)=>a+Object.keys(o).length*V23_NWK,0);
  const hi=q.rows.filter(x=>x.rdy>=75).length,lo=q.rows.filter(x=>x.rdy<=60).length;
  return '<div class="card" style="background:#fffaf2;border-color:#f3dc9b"><h3>数据说明 <span class="hint">这页的所有数据都是模拟的理想态;下面是它的"体检单"</span></h3>'
   +'<div class="grid g4" style="margin-bottom:10px">'
   +'<div class="rd-stat"><div class="l">规模</div><div class="n" style="font-size:18px">'+S.lrn.length+' 人 / '+v23Stores().length+' 店 / '+V23_NWK+' 周</div><div class="h">'+tiers+'</div></div>'
   +'<div class="rd-stat"><div class="l">证据条数</div><div class="n" style="font-size:18px">'+(evN+behN).toLocaleString()+'</div><div class="h">测评/演练/人工/自评 '+evN+' · 行为周记录 '+behN.toLocaleString()+'</div></div>'
   +'<div class="rd-stat"><div class="l">就绪度 × 锁单 r</div><div class="n" style="font-size:18px">'+(q.r==null?'—':q.r)+'</div><div class="h">刻意控制在弱到中等,有离群点;不是 0.9 的假象</div></div>'
   +'<div class="rd-stat"><div class="l">试点 vs 对照 人均锁单</div><div class="n" style="font-size:18px">'+fp.per('锁单')+' vs '+fc.per('锁单')+'</div><div class="h">差异 '+(diff(fp.per('锁单'),fc.per('锁单'))>=0?'+':'')+diff(fp.per('锁单'),fc.per('锁单'))+'%,样本小、区间宽</div></div></div>'
   +'<div class="hint" style="line-height:1.9">· 数据由固定种子<b>确定性生成</b>:每次打开一致,可复现、可断言。 · 就绪度高低各档人数:高(≥75)'+hi+' 人 / 低(≤60)'+lo+' 人。<br>'
   +'· 业务结果与"潜在能力"挂钩,但叠加了<b>岗位基线、门店客流、随机噪声、少量离群点</b>,所以不会出现"就绪度越高业绩越高"的整齐结果。<br>'
   +'· 调优剧本是<b>预先埋好的</b>:新人训试点批在「顾虑解除」上测评 + 演练过关,实战行为却停在约 28%——这是为了演示"诊断 → 调整 → 对比 → 回滚"的完整回路,<b>不代表真实培训效果</b>。<br>'
   +'· 演练评分仍是关键词规则代替 AI;题的干扰项是编的,需业务核对。外部系统(语料、北斗 BI、人事)均未核对真实接口。</div></div>'
}
A.v23DataNote=()=>{};

A.rdySize=el=>{const st=UI.sel.rdy||(UI.sel.rdy={});UI.sel.rdyPage=UI.sel.rdyPage||{page:1,size:20};UI.sel.rdyPage.size=+el.value;UI.sel.rdyPage.page=1;render()};

A.misSort=el=>{UI.sel.misSort=el.value;render()};
A.misSize=el=>{const st=UI.sel.misPage||(UI.sel.misPage={page:1,size:20});st.size=+el.value;st.page=1;render()};

/* ================= 人员视角：以 MID 为键，PEOPLE ∪ S.lrn 只读适配 =================
   不合并存储：PEOPLE 是人事主数据，S.lrn 是理想态学员（多 tier/group/train）。
   缺字段给 null，由页面显示「暂无」，不兜底造数。 */
function personOf(mid){
  const p=PEOPLE.find(x=>x.mid===mid)||null;
  const l=(S.lrn||[]).find(x=>x.mid===mid)||null;
  if(!p&&!l)return null;
  const base=p||l;
  const ev=(S.ev&&S.ev.q&&S.ev.q[mid])||(S.ev&&S.ev.dr&&S.ev.dr[mid])||(S.ev&&S.ev.co&&S.ev.co[mid])||(S.beh&&S.beh[mid]);
  return {mid, name:base.name, store:base.store, region:base.region, hire:base.hire,
    tier:l?l.tier:null, group:l?l.group:null, train:l?!!l.train:null,
    hasEvidence:!!ev, src:[p?'人事':null,l?'理想态':null].filter(Boolean)};
}
function personAll(){
  const ids=[...new Set([].concat(PEOPLE.map(p=>p.mid),(S.lrn||[]).map(l=>l.mid)))];
  return ids.map(personOf).filter(Boolean);
}
function personScope(){
  const all=personAll();
  return UI.role.type==='region'?all.filter(p=>p.region===UI.role.region):all;
}
function personReady(p){
  if(!p.hasEvidence||!p.tier)return null;
  try{const r=v23Readiness(p.mid,p.tier);return r&&r.val!=null?r.val:null}catch(e){return null}
}
function personMisOpen(p){try{return misOf(p.mid).filter(m=>m.status!=='closed').length}catch(e){return 0}}
function personPacks(p){try{return packsOf(p.mid).filter(x=>x.status!=='已完成').length}catch(e){return 0}}
function personNeedCare(p){const v=personReady(p);const rec=personMisOpen(p)>0&&misOf(p.mid).some(m=>m.status==='recurred');return (v!=null&&v<S.cfg.pass*0.7)||rec||personPacks(p)>2}

/* ---------- 人员列表 ---------- */
function pplFilter(){
  const f=UI.sel.ppl||(UI.sel.ppl={});
  if(UI.role.type==='region')f.region=UI.role.region;
  if(f.region&&f.region!==''&&UI.role.type!=='region'){/* 总部可选区域 */}
  return f;
}
function pplRows(){
  const f=pplFilter();const kw=(f.q||'').trim().toLowerCase();
  const mids=kw?kw.split(/[\s,，;；]+/).filter(Boolean):[];
  return personScope().filter(p=>{
    if(f.region&&p.region!==f.region)return false;
    if(f.store&&p.store!==f.store)return false;
    if(f.tier&&p.tier!==f.tier)return false;
    if(f.group&&p.group!==f.group)return false;
    if(f.hire==='≤30'&&!(p.hire!=null&&p.hire<=30))return false;
    if(f.hire==='≤90'&&!(p.hire!=null&&p.hire<=90))return false;
    if(f.hire==='>90'&&!(p.hire!=null&&p.hire>90))return false;
    if(f.ready){const v=personReady(p);if(f.ready==='无证据'&&v!=null)return false;if(f.ready==='<50'&&!(v!=null&&v<50))return false;if(f.ready==='50-70'&&!(v!=null&&v>=50&&v<70))return false;if(f.ready==='≥70'&&!(v!=null&&v>=70))return false;}
    if(f.care==='需关注'&&!personNeedCare(p))return false;
    if(f.care==='有未关闭错题'&&personMisOpen(p)===0)return false;
    if(f.care==='有进行中学习包'&&personPacks(p)===0)return false;
    if(mids.length&&!mids.some(m=>p.mid.includes(m)||String(p.name).toLowerCase().includes(m)))return false;
    return true;
  });
}
function pplSort(rows){
  const f=pplFilter();const key=f.sort||'care';
  const val=p=>{if(key==='name')return p.name;if(key==='hire')return p.hire==null?1e9:p.hire;if(key==='ready'){const v=personReady(p);return v==null?1e9:v}if(key==='mis')return personMisOpen(p);return personNeedCare(p)?0:1};
  return rows.slice().sort((a,b)=>{const va=val(a),vb=val(b);if(va===vb)return 0;if(key==='ready'||key==='hire')return (f.dir==='desc'?-1:1)*(vb>va?1:vb<va?-1:0);return (va>vb?1:-1)});
}
function pgPeople(){
  const f=pplFilter();const all=personScope();const rows=pplSort(pplRows());
  const care=all.filter(personNeedCare).length;const training=all.filter(p=>p.train).length;const newbies=all.filter(p=>p.hire!=null&&p.hire<=30).length;
  const pg=lstPage('pplPage',rows,20);
  const sel=(k,label,opts)=>'<div class="fi2"><label>'+label+'</label><select data-wc="pplSet" data-k="'+k+'"><option value="">全部</option>'+opts.map(o=>'<option '+(f[k]===o?'selected':'')+'>'+o+'</option>').join('')+'</select></div>';
  const stores=[...new Set(all.filter(p=>!f.region||p.region===f.region).map(p=>p.store))].filter(Boolean);
  const head='<div class="ph"><h2>人员 <span class="hint" style="font-weight:400">按人看：这个人学到哪、哪里薄弱、在哪个项目、有没有辅导；点姓名进详情</span></h2><div><button class="btn sm" data-act="pplView" data-v="'+(f.view==='store'?'people':'store')+'">'+(f.view==='store'?'按人看':'按门店看')+'</button></div></div>'
    +'<div class="ai-guide"><b>用途声明</b><span>仅用于培训选样与辅导，不用于绩效考核或 PIP 判定；业务结果仅为相关性，不作因果结论。</span></div>';
  const sum='<div class="grid g4" style="margin-bottom:14px">'
    +'<div class="stat kp-click" data-act="pplQuick" data-v=""><div class="l">全部人员</div><div class="n">'+all.length+'</div><div class="hint">人事 ∪ 理想态，按 MID 去重</div></div>'
    +'<div class="stat kp-click" data-act="pplQuick" data-v="care"><div class="l">需关注</div><div class="n" style="color:#c8323a">'+care+'</div><div class="hint">就绪度 &lt; 过关线×0.7 / 错题复发 / 学习包积压</div></div>'
    +'<div class="stat"><div class="l">在训中</div><div class="n">'+training+'</div><div class="hint">在试点/对照批内的理想态学员</div></div>'
    +'<div class="stat"><div class="l">本月新人</div><div class="n">'+newbies+'</div><div class="hint">入职 ≤ 30 天</div></div></div>';
  const fil='<div class="card" style="padding:14px 18px"><div class="filg"><div class="fi2"><label>姓名 / MID</label><input data-wc="pplSet" data-k="q" value="'+esc(f.q||'')+'" placeholder="可粘贴多个 MID,用空格或逗号分隔"></div>'
    +(UI.role.type==='region'?'':'<div class="fi2"><label>区域</label><select data-wc="pplSet" data-k="region"><option value="">全国</option>'+ALLR.map(r=>'<option '+(f.region===r?'selected':'')+'>'+r+'</option>').join('')+'</select></div>')
    +'<div class="fi2"><label>门店</label><select data-wc="pplSet" data-k="store"><option value="">全部门店</option>'+stores.map(s=>'<option '+(f.store===s?'selected':'')+'>'+esc(s)+'</option>').join('')+'</select></div>'
    +sel('tier','岗位档',V23_TIER)+sel('group','批次',['试点批','对照批'])+sel('hire','入职天数',['≤30','≤90','>90'])+sel('ready','就绪度',['<50','50-70','≥70','无证据'])+sel('care','状态',['需关注','有未关闭错题','有进行中学习包'])
    +'<div class="fi2"><label>排序</label><select data-wc="pplSet" data-k="sort"><option value="care" '+(f.sort==='care'||!f.sort?'selected':'')+'>需关注优先</option><option value="ready" '+(f.sort==='ready'?'selected':'')+'>就绪度</option><option value="hire" '+(f.sort==='hire'?'selected':'')+'>入职天数</option><option value="name" '+(f.sort==='name'?'selected':'')+'>姓名</option><option value="mis" '+(f.sort==='mis'?'selected':'')+'>错题数</option></select></div>'
    +'<div class="fi2" style="align-self:end"><button class="btn" data-act="pplClear">清除筛选</button></div>'
    +'<div class="fi2" style="align-self:end;margin-left:auto">'+lstCsvBtn(['姓名','MID','门店','区域','岗位档','批次','入职天数','就绪度','未关闭错题'],[['姓名','MID','门店','区域','岗位档','批次','入职天数','就绪度','未关闭错题']].concat(rows.map(p=>[p.name,p.mid,p.store,p.region,p.tier||'未分档',p.group||'',p.hire,personReady(p)==null?'':personReady(p),personMisOpen(p)])),'人员清单')+'</div></div></div>';
  if(f.view==='store')return head+sum+fil+pplStoreTable();
  const list='<div class="tw"><table class="t nw stk"><tr><th>姓名 / MID</th><th>门店 · 区域</th><th>岗位档 · 入职</th><th>就绪度</th><th>最弱能力</th><th>学习进度</th><th>待办</th><th>操作</th></tr>'
    +(pg.rows.length?pg.rows.map(p=>{const v=personReady(p);const w=pplWeakItems(p);const mo=personMisOpen(p),pk=personPacks(p);
      return '<tr><td><a class="link" data-act="pplOpen" data-mid="'+p.mid+'">'+esc(p.name)+'</a>'+(p.group==='对照批'?' <span class="tag">对照</span>':'')+'<div class="hint">'+p.mid+'</div></td>'
      +'<td>'+esc(p.store||'—')+'<div class="hint">'+esc(p.region||'—')+'</div></td>'
      +'<td>'+(p.tier||'<span class="hint">未分档</span>')+'<div class="hint">'+(p.hire==null?'—':'入职 '+p.hire+' 天')+'</div></td>'
      +'<td>'+(v==null?'<span class="hint" title="'+(p.hasEvidence?'缺岗位档':'无证据')+'">—<div class="hint">'+(p.hasEvidence?'未分档':'无证据')+'</div></span>':'<b style="color:'+v23RdyColor(v)+'">'+v+'</b>')+'</td>'
      +'<td style="white-space:normal;min-width:140px">'+(w.length?w.map(x=>'<span class="tag warn" style="margin:0 4px 4px 0;white-space:nowrap">'+esc(x)+'</span>').join(' '):'<span class="hint">—</span>')+'</td>'
      +'<td>'+pplLearnProgress(p)+'</td>'
      +'<td style="white-space:nowrap">'+(mo?'<span class="tag err">错题 '+mo+'</span> ':'')+(pk?'<span class="tag warn">学习包 '+pk+'</span> ':'')+(!mo&&!pk?'<span class="hint">—</span>':'')+'</td>'
      +'<td><a class="link" data-act="pplOpen" data-mid="'+p.mid+'">查看</a>'+(p.group==='对照批'?'':' · <a class="link" data-act="pplPack" data-mid="'+p.mid+'">指派学习包</a>')+'</td></tr>'}).join(''):'<tr><td colspan="8" class="empty">没有符合条件的人员。换个筛选，或清除筛选。</td></tr>')+'</table></div>'+lstPager('pplPage',pg);
  return head+sum+fil+list;
}
function pplWeakItems(p){try{const r=v23Readiness(p.mid,p.tier);return r.items.filter(i=>i.mean!=null&&i.mean<i.item.target).map(i=>i.item.label).slice(0,2)}catch(e){return []}}
function pplLearnProgress(p){try{const ps=visibleP().filter(x=>eligible(x,p));if(!ps.length)return '<span class="hint">未参与项目</span>';let tot=0,don=0;ps.forEach(x=>{const t=tasksOf(x);tot+=t.length;const d=((S.learn[x.id]||{})[p.mid])||[];don+=d.filter(id=>t.some(n=>n.id===id)).length});return ps.length+' 个项目<div class="hint">任务 '+don+'/'+tot+'</div>'}catch(e){return '<span class="hint">—</span>'}}
function pplStoreTable(){
  const f=pplFilter();const stores=[...new Set(personScope().filter(p=>!f.region||p.region===f.region).map(p=>p.store))].filter(Boolean);
  const rows=stores.map(s=>{const ps=personScope().filter(p=>p.store===s);const withR=ps.map(personReady).filter(v=>v!=null);const avg=withR.length?Math.round(withR.reduce((a,b)=>a+b,0)/withR.length):null;return {s,ps,avg,care:ps.filter(personNeedCare).length,train:ps.filter(p=>p.train).length,mo:ps.reduce((a,p)=>a+personMisOpen(p),0)}});
  const open=UI.sel.pplStoreOpen||{};
  const head='<div class="filg" style="margin:0 0 8px"><span class="hint">点门店行展开该店人员；门店平均就绪度样本 &lt;3 人时不给结论</span><span style="flex:1"></span>'
    +lstCsvBtn(['门店','区域','新人/总人数','平均就绪度','需关注','在训','未关闭错题'],[['门店','区域','新人/总人数','平均就绪度','需关注','在训','未关闭错题']].concat(rows.map(x=>[x.s,(x.ps[0]||{}).region||'',x.ps.filter(p=>p.hire!=null&&p.hire<=90).length+'/'+x.ps.length,x.avg==null?'':x.avg,x.care,x.train,x.mo])),'门店视角')+lstCsvBtn(['门店','区域','姓名','MID','岗位档','批次','入职天数','就绪度','未关闭错题','参与项目','任务完成'],[['门店','区域','姓名','MID','岗位档','批次','入职天数','就绪度','未关闭错题','参与项目','任务完成']].concat(rows.flatMap(x=>x.ps.map(p=>{const ps=pplProjectsOf(p);return [x.s,p.region,p.name,p.mid,p.tier||'未分档',p.group||'',p.hire,personReady(p)==null?'':personReady(p),personMisOpen(p),ps.length,ps.reduce((a,y)=>a+y.done,0)+'/'+ps.reduce((a,y)=>a+y.tasks.length,0)]}))),'门店员工明细')+'</div>';
  const body='<div class="tw"><table class="t"><tr><th style="width:28px"></th><th>门店</th><th>人数(新人/总)</th><th>平均就绪度</th><th>需关注</th><th>在训</th><th>未关闭错题</th></tr>'
    +rows.map(x=>{const isOpen=!!open[x.s];return '<tr class="ppl-store-row" data-act="pplStoreToggle" data-v="'+esc(x.s)+'"><td>'+(isOpen?'▾':'▸')+'</td><td><b>'+esc(x.s)+'</b></td><td>'+x.ps.filter(p=>p.hire!=null&&p.hire<=90).length+' / '+x.ps.length+'</td><td>'+(x.avg==null?'<span class="hint">样本不足</span>':x.avg+' <span class="hint">n='+x.ps.filter(p=>personReady(p)!=null).length+'</span>')+'</td><td>'+(x.care||'<span class="hint">0</span>')+'</td><td>'+x.train+'</td><td>'+(x.mo||'<span class="hint">0</span>')+'</td></tr>'
      +(isOpen?'<tr><td></td><td colspan="6" style="background:#fafbfc"><table class="t" style="margin:0"><tr><th>姓名</th><th>岗位档</th><th>入职</th><th>就绪度</th><th>未关闭错题</th><th>批次</th><th></th></tr>'
        +x.ps.map(p=>{const v=personReady(p);return '<tr><td><a class="link" data-act="pplOpen" data-mid="'+p.mid+'">'+esc(p.name)+'</a><div class="hint">'+p.mid+'</div></td><td>'+(p.tier||'<span class="hint">未分档</span>')+'</td><td>'+(p.hire==null?'—':'入职 '+p.hire+' 天')+'</td><td>'+(v==null?'<span class="hint">—</span>':'<b style="color:'+v23RdyColor(v)+'">'+v+'</b>')+'</td><td>'+personMisOpen(p)+'</td><td>'+(p.group?'<span class="tag '+(p.group==='对照批'?'':'pri')+'">'+p.group+'</span>':'<span class="hint">—</span>')+'</td><td><a class="link" data-act="pplOpen" data-mid="'+p.mid+'">查看</a></td></tr>'}).join('')
        +'</table></td></tr>':'')}).join('')+'</table></div>';
  return head+body;
}
A.pplStoreToggle=el=>{const s=el.dataset.v;UI.sel.pplStoreOpen=UI.sel.pplStoreOpen||{};if(UI.sel.pplStoreOpen[s])delete UI.sel.pplStoreOpen[s];else UI.sel.pplStoreOpen[s]=1;render()};

A.pplSet=el=>{const f=pplFilter();const k=el.dataset.k;if(el.value)f[k]=el.value;else delete f[k];if(k==='region')delete f.store;if(UI.sel.pplPage)UI.sel.pplPage.page=1;render()};
A.pplClear=()=>{UI.sel.ppl={};UI.sel.pplPage={page:1,size:20};render()};
A.pplQuick=el=>{const f=pplFilter();if(el.dataset.v==='care')f.care='需关注';else delete f.care;render()};
A.pplView=el=>{const f=pplFilter();f.view=el.dataset.v;render()};
A.pplOpen=el=>{const p=personOf(el.dataset.mid);if(!p)return toast('找不到这个人','err');if(UI.role.type==='region'&&p.region!==UI.role.region)return toast('只能查看本区域人员','err');UI.page='person';UI.stuMid=p.mid;render();$('#main').scrollTop=0};
A.pplPack=el=>{const p=personOf(el.dataset.mid);if(!p)return;if(p.group==='对照批')return toast('对照批人员不建议单独干预','warn');const k=S.kps.find(k=>k.st==='启用'&&kpMounted(k).length);if(!k)return toast('没有可指派的知识点','err');const tpl=(S.packTpl||[])[0]||{steps:[['学',2],['练题',5],['演练',1],['复测',1]],dueDays:7};S.packs.unshift({id:'PK'+(S.packs.length+1),tpl:tpl.id||'PT1',mid:p.mid,mids:[p.mid],kp:k.id,name:'补练包 · '+k.name,steps:tpl.steps.map(s=>({t:s[0],done:false})),due:addDays(today,tpl.dueDays),status:'进行中',ts:today,audience:1});toast('已给 '+p.name+' 指派补练包','ok');render()};

/* ---------- 人员详情 ---------- */
function pplProjectsOf(p){
  return visibleP().filter(x=>eligible(x,p)).map(pr=>{
    const app=(S.apps||[]).find(a=>a.proj===pr.id&&a.mid===p.mid);
    const lr=(S.learn[pr.id]||{})[p.mid];
    const rs=((S.results[pr.id]||{})[p.mid])||{};
    const cls=(S.classes||[]).find(k=>k.proj===pr.id&&(k.members||[]).includes(p.mid));
    const tasks=tasksOf(pr);const done=(lr||[]).filter(id=>tasks.some(n=>n.id===id)).length;
    return {pr,app,lr,rs,cls,tasks,done};
  });
}
function pgPerson(){
  const p=personOf(UI.stuMid);
  if(!p){UI.page='people';return pgPeople()}
  if(UI.role.type==='region'&&p.region!==UI.role.region){UI.page='people';return pgPeople()}
  const v=personReady(p);const items=pplWeakItems(p);const mo=personMisOpen(p);const pk=personPacks(p);
  const projs=pplProjectsOf(p);
  const head=crumb('<a data-act="go" data-p="people">人员</a> / '+esc(p.name))
   +'<div class="ph"><h2>'+esc(p.name)+' '+V23_SIM+' <span class="hint" style="font-weight:400">'+esc(p.store||'—')+' · '+esc(p.region||'—')+' · '+(p.tier||'未分档')+' · '+(p.hire==null?'入职未知':'入职 '+p.hire+' 天')+'</span></h2>'
   +'<div>'+(p.group==='对照批'?'<span class="tag">对照批 · 不建议单独干预</span> ':'')+'<button class="btn sm" data-act="pplBack">返回列表</button></div></div>'
   +'<div class="ai-guide"><b>用途声明</b><span>仅用于培训选样与辅导，不用于绩效考核或 PIP 判定；业务结果仅为相关性，不作因果结论。</span></div>';
  const hero='<div class="grid g4" style="margin-bottom:14px">'
   +'<div class="stat"><div class="l">就绪度</div><div class="n" style="color:'+(v==null?'':v23RdyColor(v))+'">'+(v==null?'—':v)+'</div><div class="hint">'+(p.hasEvidence?'过关线 '+S.cfg.pass:'无证据，不兜底造数')+'</div></div>'
   +'<div class="stat"><div class="l">未关闭错题</div><div class="n" style="color:'+(mo?'#c8323a':'')+'">'+mo+'</div><div class="hint">含关闭后复发</div></div>'
   +'<div class="stat"><div class="l">进行中学习包</div><div class="n">'+pk+'</div><div class="hint">指派补练后在这里看</div></div>'
   +'<div class="stat"><div class="l">参与项目</div><div class="n">'+projs.length+'</div><div class="hint">按覆盖范围判定</div></div></div>';
  const next='<div class="card"><h3>最该先补的 3 件事 <span class="hint">画像权重 × 缺口，规则生成，不是 AI</span></h3>'
   +(v==null?'<div class="chk ok"><b>·</b><span>没有证据，先让这位同事在零售通做一次诊断测或演练，再谈补什么。</span></div>'
     :(items.length?items.map(x=>'<div class="chk rec"><b>·</b><span>补「'+esc(x)+'」：低于画像目标</span></div>').join(''):'<div class="chk ok"><b>✓</b><span>画像项都达标，暂无必补项。</span></div>')
     +(mo?'<div class="chk must"><b>!</b><span>有 '+mo+' 个未关闭错题，优先指派补练包</span></div>':''))+'</div>';
  const learn='<div class="card"><h3>学习与培训 <span class="hint">参与的项目、报名、班次、成绩、结业</span></h3>'
   +(projs.length?'<div class="tw"><table class="t nw"><tr><th>项目</th><th>报名状态</th><th>班次</th><th>任务完成</th><th>签到</th><th>线上 / 线下</th><th>结业</th></tr>'
     +projs.map(x=>'<tr><td><a class="link" data-act="go" data-p="detail" data-id="'+x.pr.id+'">'+esc(x.pr.name)+'</a><div class="hint">'+esc(x.pr.type||'')+'</div></td>'
      +'<td>'+(x.app?x.app.status:'<span class="hint">未报名</span>')+'</td><td>'+(x.cls?esc(x.cls.name):'<span class="hint">—</span>')+'</td>'
      +'<td>'+x.done+' / '+x.tasks.length+'</td><td>'+(x.rs.signed?'<span class="tag ok">已签到</span>':'<span class="hint">—</span>')+'</td>'
      +'<td>'+(x.rs.online==null&&x.rs.offline==null?'<span class="hint">—</span>':(x.rs.online==null?'—':x.rs.online)+' / '+(x.rs.offline==null?'—':x.rs.offline))+'</td>'
      +'<td>'+(x.rs.st?'<span class="tag '+(x.rs.st==='已结业'?'ok':'')+'">'+esc(x.rs.st)+'</span>':'<span class="hint">—</span>')+'</td></tr>').join('')+'</table></div>'
     :'<div class="hint">没有参与任何学习项目。要么不在覆盖名单内，要么还没被下发。</div>')+'</div>';
  const coach=(function(){const ts=(S.tickets||[]).filter(t=>t.store===p.store);return '<div class="card"><h3>辅导与记录 <span class="hint">该门店的入店辅导</span></h3>'
    +(ts.length?ts.map(t=>'<div style="padding:6px 0;border-top:1px solid #f2f3f5"><b>'+esc(t.store)+'</b> <span class="tag '+(t.st==='结案'?'ok':'blue')+'">'+t.st+'</span> <span class="hint">'+esc(t.goal||'')+'</span> <a class="link" data-act="ticket" data-id="'+t.id+'">打开辅导</a></div>').join(''):'<div class="hint">该门店没有在途或历史辅导记录。</div>')+'</div>'})();
  return head+hero+next+learn+coach+'<div class="card"><h3>能力与证据 <span class="hint">与就绪度页、零售通同一套数</span></h3>'
   +(p.hasEvidence&&p.tier?'<button class="btn sm" data-act="pplStudent" data-mid="'+p.mid+'">打开完整画像 / 证据流水 / 错题</button>':'<div class="hint">这位同事还没有证据数据（只在人事主数据里），所以没有画像可看。</div>')+'</div>';
}
A.pplStudent=el=>{UI.page='student';UI.stuMid=el.dataset.mid;render()};
A.pplBack=()=>{UI.page='people';render()};
