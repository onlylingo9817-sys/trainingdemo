/* ================= 知识点 UX v1.3 =================
 * 职责：知识点模块的信息层级、操作路径、表格 / 表单交互，以及空 / 加载 / 报错状态。
 * 规范见 docs/KP-UX-v1.3.md。
 * 加载位置：x_kp_v12.js 之后、f_rn.js 之前。本文件只改「展示与交互」，不改知识点数据模型和业务规则。
 */

/* ---------- 1. 状态组件：空 / 报错 / 加载 ---------- */
function uxState(kind,o){
  o=o||{};
  const btn=(a,l,pri)=>a?'<button class="btn sm'+(pri?' pri':'')+'" data-act="'+a+'">'+esc(l||'确定')+'</button>':'';
  return '<div class="ux-state '+kind+'" role="'+(kind==='error'?'alert':'status')+'"><div class="ux-state-t">'+esc(o.title||'')+'</div>'
    +(o.desc?'<div class="ux-state-d">'+esc(o.desc)+'</div>':'')
    +(o.detail?'<div class="ux-state-x">'+esc(o.detail)+'</div>':'')
    +((o.act||o.act2)?'<div class="ux-state-a">'+btn(o.act,o.label,true)+btn(o.act2,o.label2,false)+'</div>':'')+'</div>';
}
const uxEmpty=o=>uxState('empty',o);
const uxError=o=>uxState('error',o);
/* 加载占位：规范已定义；Demo 没有异步数据源，暂未接入页面。接真实接口时在请求期间渲染它。 */
function uxSkeleton(rows){let h='';for(let i=0;i<(rows||4);i++)h+='<i style="width:'+(96-i*9)+'%"></i>';return '<div class="ux-skel" role="status" aria-busy="true" aria-label="加载中">'+h+'</div>'}
A.kpRetry=()=>render();
A.kpBackLib=()=>{UI.page='catalog';UI.tab.catalog=KP_TAB_LIB;render();const m=$('#main');if(m)m.scrollTop=0};

/* ---------- 2. 页签说明 / 帮助：按当前页面显示，替代全站统一横幅 ---------- */
const KP_TAB_NOTE={
  '总览':'按岗位、车型、学习阶段看每个知识点能不能讲、能不能考，并按领域汇总；点领域、热力格或缺口可直接进入知识点库。',
  '知识图谱':'看知识点之间的先学、后学和相关关系，用来安排学习顺序；颜色对应知识点库的领域分组。',
  '知识点库':'公司要教的全部知识点。先看红色缺口，点一行进入详情，补讲解、题和演练。',
  '候选':'系统从语料、一线反馈、课题池里发现的候选。确认后才进入知识点库；和已有点相近的，先并入。',
  '补学进度':'知识点口径变更后，谁还没补学。当前是演示数据，不向学员推送。'
};
function kpTabNote(t){const s=KP_TAB_NOTE[t];return s?'<div class="ux-note">'+esc(s)+'</div>':''}
const KP_HELP={
  '总览':'先选统计口径（岗位 / 车型 / 学习阶段 / 优先级），再看四个指标、缺口清单和各领域进展；点领域行、热力格或「去补」进入知识点库。',
  '知识图谱':'点任意节点看它的先学、后学和相关点；「只突出有缺口的点」按知识点库的缺口判定，可以先看哪里最缺。',
  '知识点库':'用顶部视图或筛选缩小范围，点一行进入详情；缺口列直接写明缺什么。',
  '候选':'「补全并新增」会打开预填好的新增表单，走和手工新增一样的校验；相近的先「并入已有」。',
  '补学进度':'按状态筛选，逾期的先催办；任务关闭后会留在「已完成」里。',
  kp:'这里看一个知识点能不能上课：先看顶部结论，再按「核心讲解 → 核心测评题 → 过关演练」补齐，最后看学员掌握度。',
  kpform:'先写清定义与边界，再选适用范围和分类（带「请选择」的必须自己选），最后说明怎样算学会。保存前建议跑一次 AI 评估。'
};
function kpHelpOf(){
  if(UI.page==='catalog')return KP_HELP[UI.tab.catalog||'总览']||'';
  if(UI.page==='kp')return KP_HELP.kp;
  if(UI.page==='kpform')return KP_HELP.kpform;
  return '';
}
const __uxPht=pageHelpText;
pageHelpText=function(){return kpHelpOf()||__uxPht()};
const __uxPh=pageHelp;
pageHelp=function(){
  const h=kpHelpOf();
  if(h)return openDlg('这页怎么用','<div style="line-height:1.9">'+esc(h)+'</div><div class="hint" style="margin-top:10px">AI 建议只作参考，写入前都需要你确认。</div>','<button class="btn pri" data-act="close">知道了</button>');
  return __uxPh();
};
/* 知识点相关页面不再显示全站顶部横幅（说明改为页内一行 + 「怎么用」）；标签建议已随标签取消而下线 */
const __uxApg=aiPageGuideHtml;
aiPageGuideHtml=function(){return ['catalog','kp','kpform'].includes(UI.page)?'':__uxApg()};
aiKpDetailAdvice=function(){return ''};

/* ---------- 3. 缺口表述：列表、总览、详情共用同一套文字 ---------- */
function kpGapList(k,h){
  h=h||kpV12Health(k);
  const a=kpV12Assess(k),nq=a.anchorQ||0,nd=['卖点','技能','流程'].includes(kpV12Type(k))?(a.anchorDrill||0):0;
  const o=[];
  if(!k.owner)o.push(['err','缺负责人','缺负责人']);
  if(h.cells.exp.s!=='ok')o.push(['err','缺核心讲解','缺讲解']);
  if(h.aq<nq)o.push(['warn','核心题 '+h.aq+'/'+nq,'题 '+h.aq+'/'+nq]);
  if(h.ad<nd)o.push(['warn','过关演练 '+h.ad+'/'+nd,'演练 '+h.ad+'/'+nd]);
  if(h.cells.exp.s==='ok'&&!h.fresh)o.push(['warn','待复核或已过期','待复核']);
  return o;
}
function kpGapChips(k,h){
  const a=kpGapList(k,h);
  return a.slice(0,3).map(x=>'<span class="tag '+x[0]+'">'+esc(x[2]||x[1])+'</span>').join('')+(a.length>3?'<span class="hint"> 等 '+a.length+' 项</span>':'');
}
function kpReadyLine(k,h){
  const g=kpGapList(k,h);
  if(!g.length&&!h.pending)return '<div class="ux-verdict ok">已完备：负责人、核心讲解、考核规格和时效都已就绪。</div>';
  if(!g.length)return '<div class="ux-verdict warn">内容待核：业务口径还没和负责人核对，暂按未完成统计。</div>';
  const blocked=g.some(x=>x[0]==='err');
  return '<div class="ux-verdict '+(blocked?'err':'warn')+'">'+(blocked?'还不能上课：':'可以上课，但还没完备：')+g.map(x=>esc(x[1])).join('、')+'。</div>';
}

/* ---------- 4. 补学任务：状态由「截止日 + 演示日期」推导，不写死 ---------- */
function kpTaskEff(t){
  if(['已复测','已关闭','挂起'].includes(t.state))return t.state;
  if(t.due&&t.due<today)return '逾期';
  if(t.state==='逾期')return t.readAt?'已读':'未读';
  return t.state;
}
function kpTaskStats(){
  const T=S.tasks||[];const eff=T.map(kpTaskEff);const c=s=>eff.filter(x=>x===s).length;
  const done=c('已复测')+c('已关闭');
  return {total:T.length,done,overdue:c('逾期'),suspend:c('挂起'),open:T.length-done-c('逾期')-c('挂起'),people:new Set(T.map(t=>t.mid)).size};
}
function kpTaskDays(t,e){
  if(['已复测','已关闭'].includes(e)||!t.due)return '';
  const d=Math.round((new Date(t.due)-new Date(today))/864e5);
  return d<0?'已逾期 '+(-d)+' 天':d===0?'今天截止':'还剩 '+d+' 天';
}
const KP_TASK_GROUPS=['全部','进行中','逾期','已完成','挂起'];
function kpTaskInGroup(t,g){
  const e=kpTaskEff(t);
  return g==='全部'||(g==='进行中'?['未读','已读','已确认'].includes(e):g==='已完成'?['已复测','已关闭'].includes(e):e===g);
}
kpTasksPage=function(){
  const T=S.tasks||[];const f=UI.sel.kpTf||(UI.sel.kpTf={st:'全部',q:''});
  const ts=kpTaskStats();const q=(f.q||'').trim();
  const rows=T.filter(t=>kpTaskInGroup(t,f.st||'全部')&&(!q||[t.name,t.store,t.kpName,t.kpCode].some(x=>String(x||'').includes(q))));
  const card=(l,v,h,g)=>'<div class="stat kp-click" data-act="kpTaskF" data-v="'+g+'"><div class="l">'+l+'</div><div class="n">'+v+'</div><div class="hint">'+h+'</div></div>';
  const chip=g=>{const n=T.filter(t=>kpTaskInGroup(t,g)).length;return '<button type="button" class="kp-view '+((f.st||'全部')===g?'on':'')+'" data-act="kpTaskF" data-v="'+g+'">'+g+' '+n+'</button>'};
  const tagOf=e=>e==='逾期'?'err':['已复测','已关闭'].includes(e)?'ok':e==='挂起'?'':'warn';
  const row=t=>{
    const e=kpTaskEff(t);const open=!['已复测','已关闭'].includes(e);
    return '<tr><td><b>'+esc(t.name||t.mid)+'</b><div class="hint">'+esc(t.store||'')+' · '+esc(t.role||'')+'</div></td>'
      +'<td style="white-space:normal;min-width:200px"><a class="link" data-act="kpOpen" data-id="'+esc(t.kpId)+'">'+esc(t.kpName||'')+'</a><div class="hint">'+esc(t.kpCode||'')+' · v'+esc(t.specVer||1)+'</div>'+(t.fromObs&&t.reason?'<div class="hint">'+esc(t.reason)+'</div>':'')+'</td>'
      +'<td>'+esc(String(t.level||'').replace(/^L\d-/,''))+'<div class="hint">'+esc((String(t.level||'').match(/^L\d/)||[''])[0])+(t.fromObs?' · 来自实操观察':'')+'</div></td>'
      +'<td><span class="tag '+tagOf(e)+'">'+esc(e)+'</span></td>'
      +'<td>'+esc(t.due||'')+(kpTaskDays(t,e)?'<div class="hint'+(e==='逾期'?' err':'')+'">'+kpTaskDays(t,e)+'</div>':'')+'</td>'
      +'<td class="hint">'+esc(t.remindAt?'催办 '+t.remindAt:(t.retestedAt||t.confirmedAt||t.readAt||'—'))+'</td>'
      +'<td>'+(open?'<a class="link" data-act="kpTaskRemind" data-id="'+esc(t.id)+'">催办</a><a class="link" data-act="kpTaskClose" data-id="'+esc(t.id)+'">关闭</a>':'<span class="hint">—</span>')+'</td></tr>';
  };
  return '<div class="grid g4" style="margin-bottom:12px">'
    +card('应完成',ts.total,'涉及 '+ts.people+' 人','全部')+card('已完成',ts.done,(ts.total?Math.round(ts.done/ts.total*100):0)+'% 已补学并复测','已完成')
    +card('逾期',ts.overdue,'升级店长；不挂钩学分 / 资质','逾期')+card('挂起',ts.suspend,'请假 / 离岗 / 调店','挂起')+'</div>'
    +'<div class="card"><h3>任务明细 <span class="hint">演示数据；真实环境接人员发展平台</span></h3>'
    +'<div class="ux-toolbar"><div class="kp-view-bar" style="margin:0">'+KP_TASK_GROUPS.map(chip).join('')+'</div><input data-wc="kpTq" value="'+esc(f.q||'')+'" placeholder="搜索人 / 门店 / 知识点" aria-label="搜索补学任务"></div>'
    +(rows.length?'<div class="tw"><table class="t nw stk"><tr><th>人 / 门店</th><th>知识点</th><th>级别</th><th>状态</th><th>截止</th><th>最后动作</th><th>操作</th></tr>'+rows.map(row).join('')+'</table></div>'
      :(T.length?uxEmpty({title:'没有符合条件的任务',desc:'换个状态或关键词再看。',act:'kpTaskF2',label:'清除筛选'}):uxEmpty({title:'还没有补学任务',desc:'知识点口径变更（L2 / L3）后，系统会为受影响的人生成补学任务。'})))
    +'</div>';
};
A.kpTaskF=el=>{const f=UI.sel.kpTf||(UI.sel.kpTf={st:'全部',q:''});f.st=el.dataset.v;render()};
A.kpTaskF2=()=>{UI.sel.kpTf={st:'全部',q:''};render()};
A.kpTq=el=>{const f=UI.sel.kpTf||(UI.sel.kpTf={st:'全部',q:''});f.q=el.value;render()};
A.kpTaskRemind=el=>{const t=(S.tasks||[]).find(x=>x.id===el.dataset.id);if(!t)return;t.remindAt=today;toast('已记录对「'+(t.name||t.mid)+'」的催办（演示环境不向学员推送）','ok');render()};
A.kpTaskClose=el=>{const t=(S.tasks||[]).find(x=>x.id===el.dataset.id);if(!t)return;openDlg('关闭补学任务','<div style="line-height:1.8">关闭后任务计入「已完成」，不再催办。<br><b>'+esc(t.name||t.mid)+'</b> · '+esc(t.kpName||'')+'</div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="kpTaskCloseOk" data-id="'+esc(t.id)+'">确认关闭</button>')};
A.kpTaskCloseOk=el=>{const t=(S.tasks||[]).find(x=>x.id===el.dataset.id);if(!t)return;t.state='已关闭';t.closedAt=today;closeDlg();toast('已关闭任务','ok');render()};

/* ---------- 5. 总览：先口径，再指标，再缺口，最后明细 ---------- */
const KP_BATCH_LABEL={'B1-30天':'新人 30 天内','B2-90天':'入职 90 天内','B3-后续':'全部阶段'};
/* 总览按「领域」（知识点的 group）统计，与知识点库的领域分组同一套；不再用 v1.2 的卖点分类 / 能力项两张表 */
function kpUxHeat(kind,ctx){
  const cols=kpGroupOrder();
  const rows=V23_CAR_LEAVES.slice();
  const cell=(car,col)=>{
    let n=0,t=0,a=0;
    (S.kps||[]).forEach(k=>{
      if((k.group||'其他')!==col)return;
      const m=kpV12Metrics(k,Object.assign({},ctx,{car}));if(!m)return;n++;if(m.teachable)t++;if(m.assessable)a++;
    });
    if(!n)return '<span class="hint">—</span>';
    const p=Math.round(t/n*100);const cls=p>=80?'ok':p>0?'warn':'err';
    return '<button type="button" class="ux-cell '+cls+'" data-act="kpHeatGo" data-kind="grp" data-car="'+esc(car)+'" data-col="'+esc(col)+'" title="可授课 '+t+' / '+n+'；可考核 '+a+'；点击查看这些知识点">'+t+'/'+n+'</button>';
  };
  return '<div class="tw"><table class="t nw ux-heat"><tr><th>车型</th>'+cols.map(c=>'<th>'+esc(c)+'</th>').join('')+'</tr>'
    +rows.map(car=>'<tr><td><b>'+esc(car)+'</b></td>'+cols.map(c=>'<td>'+cell(car,c)+'</td>').join('')+'</tr>').join('')
    +'</table></div><div class="hint" style="margin-top:6px">格子 = 可授课 / 应有知识点（'+(ctx&&ctx.placeholder==='include'?'含合成占位':'不含合成占位')+'），绿色 ≥80%、橙色有缺口、红色全缺；「—」表示当前口径下这个领域没有应教的点；点格子进入对应知识点。</div>';
}
/* 领域汇总：每行用和上方四指标同一套口径，各领域加起来等于「应覆盖」 */
function kpUxGroupRows(ctx){
  return kpGroupOrder().map(g=>{
    let n=0,c=0,t=0,a=0;
    (S.kps||[]).forEach(k=>{
      if((k.group||'其他')!==g)return;
      const m=kpV12Metrics(k,ctx);if(!m)return;n++;if(m.coverage)c++;if(m.teachable)t++;if(m.assessable)a++;
    });
    return {g,n,c,t,a,total:(S.kps||[]).filter(k=>(k.group||'其他')===g).length};
  });
}
function kpUxGroupTable(ctx){
  const rows=kpUxGroupRows(ctx);
  const pct=(x,n)=>n?Math.round(x/n*100)+'%':'—';
  const tag=(x,n)=>n?'<span class="tag '+(x===n?'ok':x?'warn':'err')+'">'+x+' / '+n+'</span>':'<span class="hint">—</span>';
  return '<div class="tw"><table class="t"><tr><th>领域</th><th>应覆盖</th><th>有核心讲解</th><th>可授课</th><th>可考核</th><th>操作</th></tr>'
    +rows.map(r=>'<tr class="kp-click" data-act="kpGrpGo" data-g="'+esc(r.g)+'"><td><b>'+esc(r.g)+'</b><div class="hint">共 '+r.total+' 个点'+(r.n?'':' · 当前口径下没有应教的点')+'</div></td><td>'+(r.n||'<span class="hint">—</span>')+'</td><td>'+tag(r.c,r.n)+'</td><td>'+tag(r.t,r.n)+(r.n?' <span class="hint">'+pct(r.t,r.n)+'</span>':'')+'</td><td>'+tag(r.a,r.n)+'</td><td><a class="link" data-act="kpGrpGo" data-g="'+esc(r.g)+'">看这个领域 ›</a></td></tr>').join('')+'</table></div>'
    +'<div class="hint" style="margin-top:6px">各领域「应覆盖」相加等于上方的应覆盖数；还没确认归属的待整理资源不计入能讲、能考。</div>';
}
A.kpHeatGo=el=>{
  const ctx=UI.sel.kpOv||{};const f={car:el.dataset.car,grp:el.dataset.col};
  if(ctx.pri&&ctx.pri!=='全部')f.pri=ctx.pri;
  if(ctx.role)f.role=ctx.role;
  UI.sel.kpf=f;UI.sel.kpPage={page:1,size:20};UI.tab.catalog=KP_TAB_LIB;render();$('#main').scrollTop=0;
};
A.kpGrpGo=el=>{
  const ctx=UI.sel.kpOv||{};const f={grp:el.dataset.g};
  if(ctx.pri&&ctx.pri!=='全部')f.pri=ctx.pri;
  if(ctx.car&&ctx.car!=='全部车型')f.car=ctx.car;
  if(ctx.role)f.role=ctx.role;
  UI.sel.kpf=f;UI.sel.kpPage={page:1,size:20};UI.tab.catalog=KP_TAB_LIB;render();$('#main').scrollTop=0;
};
A.kpGapAll=()=>{
  const ctx=UI.sel.kpOv||{};const f={lv:'未完备'};
  if(ctx.pri&&ctx.pri!=='全部')f.pri=ctx.pri;
  if(ctx.car&&ctx.car!=='全部车型')f.car=ctx.car;
  if(ctx.role)f.role=ctx.role;
  UI.sel.kpf=f;UI.sel.kpPage={page:1,size:20};UI.tab.catalog=KP_TAB_LIB;render();$('#main').scrollTop=0;
};
kpOverviewNew=function(){
  const ctx=UI.sel.kpOv||(UI.sel.kpOv={role:'零售顾问',car:'SU7 Pro',batch:'B3-后续',pri:'P0'});
  if(ctx.placeholder!=='include')ctx.placeholder='exclude';
  const sReal=kpV12Summary(Object.assign({},ctx,{placeholder:'exclude'}));
  const sAll=kpV12Summary(Object.assign({},ctx,{placeholder:'include'}));
  const s=ctx.placeholder==='include'?sAll:sReal,ts=kpTaskStats();
  const val=window.__KP_VALIDATION||kpV12ValidateAll();
  const phLabel=ctx.placeholder==='include'?'含合成占位':'不含合成占位';
  const sel=(k,label,arr,lab)=>'<div class="fi2"><label>'+label+'</label><select data-wc="kpV12OvSet" data-k="'+k+'">'+arr.map(x=>'<option value="'+esc(x)+'" '+(ctx[k]===x?'selected':'')+'>'+esc((lab&&lab[x])||x)+'</option>').join('')+'</select></div>';
  const bar='<div class="ux-bar"><div class="filg">'+sel('role','岗位',KP_DICT_V12.roles)+sel('car','车型',['全部车型'].concat(V23_CAR_LEAVES))+sel('batch','学习阶段',KP_DICT_V12.batches,KP_BATCH_LABEL)+sel('pri','优先级',['P0','P1','全部'])+'</div><span class="ux-bar-r hint">当前口径下应覆盖 <b>'+s.n+'</b> 个知识点</span></div>';
  const caliber='<div class="ux-note">覆盖度、可授课率<b>默认不含合成占位主讲解</b>。不含占位是 <b>'+sReal.cov+'% / '+sReal.teach+'%</b>（'+sReal.c+' / '+sReal.n+'），含占位是 <b>'+sAll.cov+'% / '+sAll.teach+'%</b>（'+sAll.c+' / '+sAll.n+'）。可考核率两种口径都是 <b>'+sReal.assess+'%</b>。占位稿仍挂在知识点上，标题标「合成占位」，不进默认完成数；待补缺口仍按「有没有挂上主讲解」列。</div>'
    +'<div class="kp-view-bar"><span>主讲解口径</span><button type="button" class="kp-view '+(ctx.placeholder!=='include'?'on':'')+'" data-act="kpOvPh" data-v="exclude">不含占位 '+sReal.cov+'%</button><button type="button" class="kp-view '+(ctx.placeholder==='include'?'on':'')+'" data-act="kpOvPh" data-v="include">含占位 '+sAll.cov+'%</button></div>';
  const m=(l,v,sub,tip)=>'<div class="ux-metric" title="'+esc(tip)+'"><div class="l">'+l+'</div><div class="n">'+v+'</div><div class="s">'+sub+'</div></div>';
  const strip='<div class="ux-metrics">'+m('覆盖度',s.cov+'%',s.c+' / '+s.n+' 个点有核心讲解（'+phLabel+'）','有核心讲解的知识点占应覆盖的比例。默认不含合成占位。')
    +m('可授课率',s.teach+'%',s.t+' / '+s.n+' 个点已上架且未过期（'+phLabel+'）','核心讲解已上架且未过期。默认不含合成占位。')
    +m('可考核率',s.assess+'%',s.a+' / '+s.n+' 个点题和演练齐','核心测评题和过关演练都达到要求。与占位讲解无关。')
    +m('时效健康度',s.fresh+'%',s.f+' / '+Math.max(1,s.c)+' 个点在有效期内','计入覆盖度的点里，未过期、未超复核日的占比')+'</div>';
  const sub='<div class="ux-subline"><span>内容待核 <b>'+s.p+'</b> 个<span class="hint">（计入分母，不计入完成）</span></span><span>补学任务 <b>'+ts.done+' / '+ts.total+'</b> 已完成，逾期 <b'+(ts.overdue?' style="color:var(--err)"':'')+'>'+ts.overdue+'</b> <a class="link" data-act="tab" data-k="catalog" data-v="补学进度">去看 ›</a></span></div>';
  const sev=k=>kpGapList(k).some(x=>x[0]==='err')?0:1;
  const gaps=(S.kps||[]).filter(k=>kpV12Metrics(k,ctx)&&kpGapList(k).length).sort((a,b)=>sev(a)-sev(b)||(a.pri===b.pri?0:a.pri==='P0'?-1:1)||a.name.localeCompare(b.name,'zh'));
  const gapRow=k=>'<tr class="kp-click" data-act="kpOpen" data-id="'+k.id+'"><td><b>'+esc(k.name)+'</b><div class="hint">'+esc(k.code)+' · '+esc(k.group||k.domain)+' · '+esc(k.pri)+'</div></td><td>'+kpGapChips(k)+'</td><td>'+(k.owner?esc(k.owner):'<span class="tag err">未指定</span>')+'</td><td><a class="link" data-act="kpOpen" data-id="'+k.id+'">去补 ›</a></td></tr>';
  const gapCard='<div class="card"><h3>待补缺口 <span class="hint">当前口径下 '+gaps.length+' 个点还没完备（缺讲解、负责人的排前面）</span>'+(gaps.length>8?'<a class="link" data-act="kpGapAll" style="margin:0">查看全部 '+gaps.length+' 条 ›</a>':'')+'</h3>'
    +(gaps.length?'<div class="tw"><table class="t"><tr><th>知识点</th><th>缺什么</th><th>负责人</th><th>操作</th></tr>'+gaps.slice(0,8).map(gapRow).join('')+'</table></div>'
      :'<div class="chk ok"><b>✓</b><span>当前口径下没有缺口。</span></div>')+'</div>';
  const heat='<div class="card"><h3>各领域进展 <span class="hint">点一行进入该领域的知识点</span></h3>'+kpUxGroupTable(ctx)+'</div>'
    +'<div class="card"><h3>车型 × 领域 <span class="hint">看哪款车在哪个领域还缺讲解</span></h3>'+kpUxHeat('grp',ctx)+'</div>';
  const by={};(S.kps||[]).forEach(k=>{if(k.stage==='不直接对应')return;const w=kpWeak(k),t=kpTested(k);const x=by[k.stage]=by[k.stage]||{n:0,w:0,t:0};x.n++;x.w+=w;x.t+=t});
  const stages=Object.keys(by).sort((a,b)=>(by[b].t?by[b].w/by[b].t:0)-(by[a].t?by[a].w/by[a].t:0));
  const stageBody=stages.length?'<div class="tw"><table class="t"><tr><th>业务环节</th><th>知识点数</th><th>已测人次</th><th>未过关人次</th><th>未过关占比</th></tr>'+stages.map(st=>{const x=by[st];const p=x.t?Math.round(x.w/x.t*100):0;return '<tr><td><b>'+esc(st)+'</b></td><td>'+x.n+'</td><td>'+x.t+'</td><td>'+x.w+'</td><td><span class="tag '+(p>=50?'err':p?'warn':'ok')+'">'+p+'%</span></td></tr>'}).join('')+'</table></div><div class="hint" style="margin-top:6px">只用于定位和对照，不作因果结论；样本量与对照批在真实接入后由效果页给出。</div>':uxEmpty({title:'还没有可对照的知识点'});
  const fold=(t,h,b)=>'<details class="card ux-fold"><summary>'+t+(h?' <span class="hint">'+h+'</span>':'')+'</summary><div class="ux-fold-b">'+b+'</div></details>';
  const check=fold('数据校验','管理员用',(val.errors?'<div class="ux-inline warn">'+val.errorList.slice(0,8).map(esc).join('<br>')+'</div>':'<div class="chk ok"><b>✓</b><span>标准库结构校验通过（'+val.total+' 条）。</span></div>')+'<div class="hint">结构错误 '+val.errors+' 个；另有 '+val.warns+' 条缺口提示，来自上面的「待补缺口」，不是系统故障。</div>');
  return bar+caliber+strip+sub+gapCard+heat+fold('业务环节对照','按主要业务环节汇总学员未过关情况',stageBody)+check;
};
A.kpOvPh=el=>{const f=UI.sel.kpOv||(UI.sel.kpOv={});f.placeholder=el.dataset.v==='include'?'include':'exclude';render()};

/* ---------- 6. 候选：确认新增走新增表单，不再生成残缺知识点 ---------- */
function kpCandCars(x){
  const c=x.car||'通用车型';if(c==='通用车型')return ['通用车型'];
  const flat=s=>String(s).replace(/\s/g,'');
  const leaf=(V23_CAR_LEAVES||[]).find(v=>v===c||flat(v).endsWith(flat(c)));
  const series=Object.keys(V23_CAR_TREE||{}).find(s=>s===c);
  return leaf?[leaf]:series?[series]:['通用车型'];
}
function kpCandKF(x){
  const f=kpFormFrom(null);const product=x.type!=='技能型';
  f.candId=x.id;f.name=x.name;f.one='';f.cars=kpCandCars(x);
  f.domain=product?'产品知识':'销售技能';f.typeV12=product?'概念':'技能';
  if(product){f.ability='';f.abId='';f.sellpoint=KP_SELLPOINT_LEAVES_V12[0]||''}
  else{f.sellpoint='';const a=kpAbRows()[0];f.abId=a?a.id:'';f.ability=a?a.name:''}
  const drill=['卖点','技能','流程'].includes(f.typeV12);
  f.assess.anchorDrill=drill?1:0;f.assess.validityDays=drill?90:180;
  return f;
}
function kpCandSimilar(x){const n=(x.sug||[])[0];return n?S.kps.find(k=>k.name===n||(k.syn||[]).indexOf(n)>=0):null}
kpCands=function(){
  const candSel=UI.sel.candSel||(UI.sel.candSel=[]);
  const from=UI.sel.kpCandFrom||'';
  const rows=from?S.kpCand.filter(x=>String(x.from||'').includes(from)):S.kpCand;
  const pend=rows.filter(x=>x.st==='待确认');
  const stat=x=>x.st==='评审中'?'<span class="tag blue">评审中</span>'+(typeof rvChip==='function'&&rvActive('kp',x.id)?'<div style="margin-top:4px">'+rvChip('kp',x.id)+'</div><div class="hint">期限 '+rvActive('kp',x.id).due+'</div>':'')
    :x.st==='待确认'?'<span class="tag warn">待确认</span>'+(x.rvPass?' <span class="tag ok">评审已通过</span>':'')+(typeof rvChip==='function'&&!x.rvPass?(function(){const c=rvChip('kp',x.id);return c?'<div style="margin-top:4px">'+c+'</div>':''})():'')
    :'<span class="tag '+(x.st==='已新增'?'ok':'')+'">'+esc(x.st)+'</span>';
  const ops=x=>{
    if(x.st!=='待确认')return '<span class="hint">—</span>';
    const sim=kpCandSimilar(x);
    return '<div class="ux-ops"><button class="btn sm pri" data-act="kpCandForm" data-id="'+x.id+'">补全并新增</button>'
      +'<button class="btn sm" data-act="kpCandMerge" data-id="'+x.id+'" '+(sim?'':'disabled title="没有相近的已有知识点"')+'>并入已有</button>'
      +'<button class="btn sm" data-act="kpCandNo" data-id="'+x.id+'">忽略</button>'
      +(x.rvPass?'':'<a class="link" data-act="rvStart" data-k="kp" data-id="'+x.id+'">发起评审</a>')+'</div>';
  };
  const row=x=>{const sim=kpCandSimilar(x);
    return '<tr><td>'+(x.st==='待确认'?'<input type="checkbox" data-act="candSel" data-id="'+x.id+'" '+(candSel.includes(x.id)?'checked':'')+' aria-label="选择候选">':'')+'</td>'
      +'<td><b>'+esc(x.name)+'</b><div class="hint">'+(typeof kpTypeText==='function'?kpTypeText(x):esc(x.type))+' · '+esc(x.car)+'</div></td>'
      +'<td class="hint" style="white-space:normal">'+esc(x.from)+'</td>'
      +'<td style="white-space:normal">'+esc(x.why)+(sim&&x.st==='待确认'?'<div class="ux-inline warn" style="margin:6px 0 0">与已有「<a class="link" data-act="kpOpen" data-id="'+sim.id+'" style="margin:0">'+esc(sim.name)+'</a>」相近，建议先并入，而不是新建。</div>':'')+'</td>'
      +'<td>'+stat(x)+'</td><td>'+ops(x)+'</td></tr>';};
  const bar=rows.length?'<div class="ux-toolbar"><label style="display:flex;align-items:center;gap:6px;font-size:13px"><input type="checkbox" data-act="candAll" '+(pend.length&&pend.every(x=>candSel.includes(x.id))?'checked':'')+'> 全选待确认</label><span class="sp" style="flex:1"></span>'
    +(candSel.length?'<b style="font-size:13px">已选 '+candSel.length+' 个</b><button class="btn sm pri" data-act="candBulkOk">批量确认新增</button><button class="btn sm" data-act="candBulkIgnore">批量忽略</button>':'<span class="hint">勾选后可批量处理；批量新增的都是停用草案，需逐个补全后启用</span>')+'</div>':'';
  return '<div class="card"><h3>候选知识点 <span class="hint">'+(from?esc(from):pend.length+' 个待确认')+'</span>'+(from?'<a class="link" data-act="kpCandClearFrom" style="margin:0">看全部候选 ›</a>':'')+'</h3>'
    +(rows.length?bar+'<div class="tw"><table class="t ux-fit"><colgroup><col style="width:32px"><col style="width:170px"><col style="width:120px"><col><col style="width:110px"><col style="width:250px"></colgroup><tr><th></th><th>候选</th><th>来源</th><th>为什么要加</th><th>状态</th><th>操作</th></tr>'+rows.map(row).join('')+'</table></div>'
      :uxEmpty({title:'暂时没有候选知识点',desc:'客户反复在问、但还没有对应知识点时，系统会在这里提出候选。',act:from?'kpCandClearFrom':'',label:'看全部候选'}))+'</div>';
};
A.kpCandForm=el=>{
  const x=S.kpCand.find(c=>c.id===el.dataset.id);if(!x)return;
  if(x.st==='评审中')return toast('这个候选正在评审灰度,评审通过后才能确认新增','err');
  KF=kpCandKF(x);KF._ph={cls:1};UI.sel.kpSpecReview=null;UI.sel.kfShowErr=false;UI.sel.kfSkipAi=false;
  UI.page='kpform';render();$('#main').scrollTop=0;
};
function kpCandDone(cid,k){
  const x=S.kpCand.find(c=>c.id===cid);if(!x)return;
  x.st='已新增';x.newKpId=k.id;kpHist(k,'由候选确认新增',x.from||'');
  if(x.contentId){const c=content(x.contentId);if(c){c.kps=c.kps||[];c.kpRole=c.kpRole||{};if(!c.kps.includes(k.id))c.kps.push(k.id);if(!c.mainKp){c.mainKp=k.id;c.kpRole[k.id]='主讲解'}else c.kpRole[k.id]=c.kpRole[k.id]||'提及';chist(c,'确认课程候选知识点',x.name)}}
}
/* 直接确认（批量 / 程序调用）：同样走 kfSave 的校验，生成结构完整的停用草案；评审中的候选保持原拦截 */
const __uxCandOk=A.kpCandOk;
A.kpCandOk=function(el){
  const x=S.kpCand.find(c=>c.id===el.dataset.id);
  if(!x||x.st==='评审中')return __uxCandOk.apply(this,arguments);
  const prev=KF;KF=kpCandKF(x);KF.owner='';KF.st='停用';
  A.kfSave();
  if(KF)KF=prev;
};
const __uxKfSave=A.kfSave;
A.kfSave=function(){
  const cid=KF&&KF.candId;const n0=S.kps.length;
  const r=__uxKfSave.apply(this,arguments);
  if(S.kps.length>n0){if(cid)kpCandDone(cid,S.kps[S.kps.length-1]);UI.sel.kfShowErr=false;UI.sel.kfSkipAi=false}
  return r;
};

/* ---------- 7. 详情翻页：按进入时的列表顺序 ---------- */
const __uxKpOpen=A.kpOpen;
A.kpOpen=function(el){if(!(el&&el.closest&&el.closest('.kp-list')))UI.kpOrder=null;return __uxKpOpen.apply(this,arguments)};
A.kpNav=el=>{
  const ord=(UI.kpOrder&&UI.kpOrder.includes(UI.kid))?UI.kpOrder:S.kps.map(k=>k.id);
  const i=ord.indexOf(UI.kid)+ +el.dataset.d;if(i<0||i>=ord.length)return;
  UI.kid=ord[i];render();$('#main').scrollTop=0;
};

/* ---------- 8. 表单：必填项「请选择」、行内报错、分区导航、未评估提示 ---------- */
const phOn=k=>!!(KF&&KF._ph&&KF._ph[k]);
const phOpt=k=>phOn(k)?'<option value="" selected disabled>请选择</option>':'';
function kfCheck(){
  const e=[];const add=(id,msg)=>e.push({id,msg});const ph=KF._ph||{};
  if(!(KF.name||'').trim())add('name','请填写知识点名称');
  else{const n=KF.name.trim();const dup=S.kps.find(k=>k.id!==KF.id&&k.name===n&&kpCarOverlap(kpCars(k),KF.cars||[]));if(dup)add('name','已有同名且适用范围重叠的知识点「'+dup.name+'」，请维护原知识点');}
  if(!(KF.cars||[]).length)add('car','请至少选择一个适用车型');
  if(!(KF.roles||[]).length)add('role','请至少选择一个适用岗位');
  if(ph.domain)add('domain','请选择知识域');
  if(ph.type)add('type','请选择知识点类型');
  if(ph.cls)add('cls',KF.domain==='产品知识'?'请选择卖点分类':'请选择能力项');
  return e;
}
A.kfSubmit=()=>{
  if(!KF)return;
  const errs=kfCheck();
  if(errs.length){UI.sel.kfShowErr=true;render();setTimeout(()=>{const e=document.getElementById('kfe_'+errs[0].id);if(e)e.scrollIntoView({block:'center'})},0);return}
  UI.sel.kfShowErr=false;
  if(!KF.id&&!UI.sel.kpSpecReview&&!UI.sel.kfSkipAi)return openDlg('还没做 AI 评估','<div style="line-height:1.8">新增前建议先让 AI 评估一次：这个点是否单一、能独立考核、和现有知识点是否重复。</div>','<button class="btn" data-act="kfSaveAnyway">仍然保存</button><button class="btn pri" data-act="kfGoAi">先去评估</button>');
  A.kfSave();
};
A.kfSaveAnyway=()=>{UI.sel.kfSkipAi=true;closeDlg();A.kfSubmit()};
A.kfGoAi=()=>{closeDlg();A.kpSpecReview()};
A.kfJump=el=>{const e=document.getElementById(el.dataset.id);if(e)e.scrollIntoView({block:'start',behavior:'smooth'})};
const __uxKfDomain=A.kfDomain;A.kfDomain=el=>{if(KF&&KF._ph){delete KF._ph.domain;KF._ph.cls=1}__uxKfDomain(el)};
const __uxKfType=A.kfTypeV12;A.kfTypeV12=el=>{if(KF&&KF._ph)delete KF._ph.type;__uxKfType(el)};
const __uxKfAb=A.kfAb;A.kfAb=el=>{if(KF&&KF._ph)delete KF._ph.cls;__uxKfAb(el)};
const __uxKfset=A.kfset;A.kfset=el=>{if(KF&&KF._ph&&el.dataset.k==='sellpoint')delete KF._ph.cls;__uxKfset(el)};
const __uxKpNew=A.kpNew;
A.kpNew=function(){__uxKpNew.apply(this,arguments);if(KF){KF._ph={domain:1,type:1,cls:1};UI.sel.kpSpecReview=null;UI.sel.kfShowErr=false;UI.sel.kfSkipAi=false;render()}};
const __uxKpEdit=A.kpEdit;
A.kpEdit=function(){UI.sel.kfShowErr=false;UI.sel.kfSkipAi=false;return __uxKpEdit.apply(this,arguments)};
const __uxKfCancel=A.kfCancel;
A.kfCancel=function(){UI.sel.kfShowErr=false;UI.sel.kfSkipAi=false;return __uxKfCancel.apply(this,arguments)};
const __uxPgKpForm=pgKpForm;
pgKpForm=function(){
  let h=__uxPgKpForm();
  if(!KF)return h;
  const errs=UI.sel.kfShowErr?kfCheck():[];
  const lab={name:'知识点名称',car:'适用车型',role:'适用岗位',domain:'知识域',type:'知识点类型',cls:KF.domain==='产品知识'?'卖点分类':'能力项'};
  errs.forEach(e=>{
    const a='<div class="fr"><div class="flb"><b>*</b>'+lab[e.id]+'</div><div class="fc">';
    if(h.includes(a))h=h.replace(a,()=>'<div class="fr has-err" id="kfe_'+e.id+'"><div class="flb"><b>*</b>'+lab[e.id]+'</div><div class="fc"><div class="ferr">'+esc(e.msg)+'</div>');
  });
  const summary=errs.length?'<div class="ux-errsum" role="alert"><b>还有 '+errs.length+' 项需要处理后才能保存</b><ul>'+errs.map(e=>'<li><a data-act="kfJump" data-id="kfe_'+e.id+'">'+esc(e.msg)+'</a></li>').join('')+'</ul></div>':'';
  const cand=KF.candId?S.kpCand.find(c=>c.id===KF.candId):null;
  const banner=cand?'<div class="ux-inline">来自候选「'+esc(cand.name)+'」· '+esc(cand.from||'')+'。保存后该候选会标记为「已新增」。</div>':'';
  const nav='<div class="ux-anchor" role="navigation" aria-label="表单分区">'+[['kfs1','1 定义与边界'],['kfs2','2 谁需要、用在哪里'],['kfs3','3 怎样算学会'],['kfs4','4 谁负责、何时复核'],['kfs5','5 学习先后与关联']].map(x=>'<a data-act="kfJump" data-id="'+x[0]+'">'+x[1]+'</a>').join('')+'</div>';
  h=h.replace('<div class="card frm kp-form-v12">',()=>nav+summary+banner+'<div class="card frm kp-form-v12">');
  h=h.replace('<span class="sp"></span><button class="btn" data-act="kfCancel">取消</button><button class="btn pri" data-act="kfSave">保存</button>',()=>'<b class="dock-t">'+(KF.id?'编辑知识点':'新增知识点')+'</b><span class="hint dock-n">'+esc(KF.name||'尚未填写名称')+'</span><span class="sp"></span><button class="btn" data-act="kfCancel">取消</button><button class="btn pri" data-act="kfSubmit">保存</button>');
  return h;
};

/* ---------- 9. 图谱显示范围 ---------- */
A.kgScope=el=>{UI.sel.kgScope=el.value;render()};

/* ---------- 10. 批量导入：读取 CSV 的加载态与失败提示 ---------- */
function kpBusySet(label){
  UI.sel.kpBusy=label||null;
  if(UI.drw&&/批量导入|新车克隆/.test(UI.drw.title)){UI.drw.body=kpBatchPage();renderDrawer();}
  else render();
}
const __uxKpImportFile=A.kpImportFile;
A.kpImportFile=function(el){
  const f=el.files&&el.files[0];if(!f)return;
  kpBusySet('正在读取 '+f.name+'…');
  const r=new FileReader();
  r.onload=()=>{UI.sel.kpBusy=null;const t=$('#kp_csv');if(t)t.value=String(r.result||'');A.kpImportRun();};
  r.onerror=()=>{kpBusySet(null);toast('文件读取失败：请确认是 UTF-8 编码的 CSV，或直接粘贴内容','err');};
  r.readAsText(f,'utf-8');
};
