/* ========== PC 框架 ========== */
const A={};
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||el.disabled)return;const f=A[el.dataset.act];if(f)f(el,e)});
document.addEventListener('input',e=>{const el=e.target;if(el.dataset&&el.dataset.w&&W){W[el.dataset.w]=el.value;if(A.winput)A.winput(el)}});
document.addEventListener('change',e=>{const el=e.target;if(el.dataset&&el.dataset.wc){A[el.dataset.wc](el)}});
const chipMap={'未生效':'','已生效':'pri','已下线':'','已发布':'pri','进行中':'blue','观察期':'warn','评估中':'warn','已结项':'ok','草稿':'','已定稿':'blue','已归档':'','未上架':'','待上架':'warn','已上架':'ok','已下架':'err','已通过':'ok','待审批':'warn','候补':'blue','已驳回':'err','分析中':'blue','已出结论':'ok','分析失败':'err','充分':'ok','不足':'warn','高':'ok','中':'warn','低':'err','已上线':'ok','审核中':'warn','待发布':'blue','已下线':''};
const chip=t=>'<span class="tag '+(chipMap[t]||'')+'">'+esc(t)+'</span>';
function tabsH(k,list){const cur=UI.tab[k]||list[0];return '<div class="tabs">'+list.map(t=>'<div class="tab '+(cur===t?'on':'')+'" data-act="tab" data-k="'+k+'" data-v="'+t+'">'+t+'</div>').join('')+'</div>'}
const curTab=(k,list)=>UI.tab[k]||list[0];
const srcBar=h=>'<div class="src"><b>数据来源</b><span>'+h+'</span></div>';
const lk=(label,p,extra)=>'<a data-act="go" data-p="'+p+'" '+(extra||'')+'>'+label+'</a>';
const ds=n=>'<span class="srcs">'+n+'</span>';
/* 示意数据标记：凡是接入外部数据前用占位生成的，都必须带这个标记 */
const dsDemo=n=>'<span class="srcs" style="background:#fff4e5;color:#b54708;border:1px dashed #f0b46a">'+n+' · 示意待接入</span>';
const demoNote=t=>'<div class="boss-demo-note">⚠ 演示数据：'+t+'；接入真实数据源后以实际口径为准。</div>';
const cta=(t,d,btn)=>'<div class="cta"><b style="font-size:15px;color:#1f2329">'+t+'</b><p>'+d+'</p>'+btn+'</div>';
function pct(p){if(p.cur==null)return null;return Math.max(0,Math.min(120,Math.round((p.cur-p.base)/(p.target-p.base)*100)))}
function progLayers(p){
  if(!p)return null;
  let learn=null;try{const mids=(p.mids&&p.mids.length?p.mids:PEOPLE.filter(x=>eligible(p,x)).map(x=>x.mid));const ts=tasksOf(p);if(mids.length&&ts.length){let don=0,tot=0;mids.forEach(m=>{const d=((S.learn[p.id]||{})[m]||[]);tot+=ts.length;don+=d.filter(id=>ts.some(n=>n.id===id)).length});learn=tot?Math.round(don/tot*100):null}}catch(e){}
  let beh=null,biz=null;
  if(p.eff&&p.eff.L){p.eff.L.forEach(L=>{const lab=(L.n||'')+(L.asr?'':'');
    if(/行为|话术/.test(L.n||'')){const r=(L.rows||[]).find(x=>/受训/.test(x[0]));beh=r?r[1]:null}
    if(/业务/.test(L.n||'')){const r=(L.rows||[]).find(x=>/受训/.test(x[0]));biz=r?r[1]:null}})}
  return {learn,beh,biz};
}
function progBar(p){const v=pct(p);const L=progLayers(p);
  const small=(()=>{try{return typeof smallNow==='function'?smallNow(p):false}catch(e){return false}})();
  const tag=(txt,color)=>'<span class="tag" style="'+(color?color:'')+';margin-right:3px">'+txt+'</span>';
  const layers='<div class="hint" style="margin-top:2px;white-space:nowrap">'
    +(L&&L.learn!=null?tag('学 '+L.learn+'%','background:#eef4ff'):tag('学 —'))
    +(L&&L.beh!=null?tag('行为 '+L.beh,''+(small?'color:#98a2b3':'')):tag('行为 —'))
    +(L&&L.biz!=null?tag('业务 '+L.biz+'（相关）',small?'color:#98a2b3':''):tag('业务 —'))
    +'</div>';
  if(v==null)return '<span class="hint">无数据</span>'+layers;
  return '<div style="display:flex;align-items:center;gap:8px"><div class="bar" style="width:90px"><i class="'+(v>=100?'ok':'')+'" style="width:'+Math.min(v,100)+'%"></i></div><span>'+v+'%</span></div>'+layers+(small?'<div class="hint">样本不足，不下结论</div>':'')}
const goalTxt=p=>p.metric+' '+p.base+p.unit+' → '+p.target+p.unit;
const typeTxt=p=>p.type+(p.sub?' · '+p.sub:'');

A.end=el=>{document.body.dataset.end=el.dataset.v;$('#bPc').classList.toggle('on',el.dataset.v==='pc');$('#bRn').classList.toggle('on',el.dataset.v==='rn');render()};
A.close=()=>closeDlg();
A.bell=()=>openDlg('通知',S.notices.length?S.notices.map(n=>'<div style="padding:8px 0;border-bottom:1px solid #f0f1f3"><span class="hint">'+n.t+'</span>　'+esc(n.m)+'</div>').join(''):'<div class="empty">暂无通知</div>','<button class="btn" data-act="close">关闭</button>');
A.tab=el=>{UI.tab[el.dataset.k]=el.dataset.v;render()};
A.go=el=>{closeDlg();UI.page=el.dataset.p;if(el.dataset.t)UI.tab[el.dataset.p]=el.dataset.t;if(el.dataset.id){UI.projId=el.dataset.id;UI.ptab=el.dataset.pt||'概览'}if(el.dataset.ef)UI.ef=el.dataset.ef;render();$('#main').scrollTop=0};
function render(){
  if(UI&&UI.page==='tagmanage'){UI.page='config';UI.tab=UI.tab||{};UI.tab.config='标签管理'}
  if(document.body.dataset.end==='rn')renderRN();else renderPC();
  if(!(window.__SKIP_SAVE_UNTIL&&Date.now()<window.__SKIP_SAVE_UNTIL)&&typeof saveNow==='function'&&UI)saveNow();
}

/* 权限判断：只能在函数体内用 UI（脚本顶层不能碰 S/UI） */
function canSeePerson(){return typeof UI!=='undefined'&&UI&&(UI.role.type==='hq'||UI.role.type==='region')}
function personInScope(region){if(typeof UI==='undefined'||!UI)return false;if(UI.role.type==='hq')return true;return UI.role.type==='region'&&region===UI.role.region}
function canConfigure(){return typeof UI!=='undefined'&&UI&&UI.role.type==='hq'}
function isBoss(){return typeof UI!=='undefined'&&UI&&UI.role.type==='boss'}
const IC={ov:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
 tp:'<svg viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>',
 ct:'<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
 pj:'<svg viewBox="0 0 24 24"><path d="M3 6l2 2 4-4M3 14l2 2 4-4M13 6h8M13 14h8M13 20h8"/></svg>',
 ap:'<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M16 11l2 2 4-4"/></svg>',
 co:'<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
 ef:'<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>',
 cf:'<svg viewBox="0 0 24 24"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
 ca:'<svg viewBox="0 0 24 24"><path d="M3 5h6v6H3zM15 5h6v6h-6zM3 15h6v6H3zM12 8h3M9 18h6M18 11v4"/></svg>',
 gr:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>'};
function renderMenu(){
  const P=UI.page;const n=pendingFor().length;const ok=PAGES_OK[UI.role.type];
  const it=(ps,t,go,ic,tg)=>ok.includes(go)?'<div class="mi '+(ps.includes(P)?'on':'')+'" data-act="go" data-p="'+go+'">'+IC[ic]+'<span>'+t+'</span>'+(tg||'')+'</div>':'';
  const nw='<span class="tg">新</span>',ex='<span class="tg b">扩展</span>';
  const g=(t,k)=>k.some(x=>ok.includes(x))?'<div class="mg">'+t+'</div>':'';
  $('#menu').innerHTML='<div class="who"><b>'+UI.role.n.split(' · ')[1]+'</b>'+UI.role.n.split(' · ')[0]+' · 数据范围:'+(UI.role.type==='region'?UI.role.region:'全国')+'</div>'
   +g('工作台',['workbench','overview'])+it(['workbench'],'工作台','workbench','ov','<span class="tg">新</span>')+it(['overview'],'培训总览','overview','ov','')
   +g('发现问题',['topics'])+it(['topics','topic'],'课题池','topics','tp','')
   +g('准备内容',['catalog','content','publish'])+it(['catalog','kp','kpform'],'知识点','catalog','ca','')+it(['content','cedit','cdetail','qform','dform'],'内容中心','content','ct','')+it(['publish'],'上架到零售通','publish','gr','')
   +g('组织培训',['projects','approvals','coach'])+it(['projects','detail','form'],'学习项目','projects','pj','')+it(['approvals'],'报名审批','approvals','ap',n?'<span class="dot">'+n+'</span>':'')+it(['coach'],'入店辅导','coach','co','')
   +g('看效果',['effect','people','person','student'])+it(['effect','student'],'效果追踪','effect','ef','')
   +g('系统',['config'])+it(['config'],'配置中心','config','cf','')
   +(UI.role.type==='boss'?'':'<details class="mg-fold"><summary class="mg">现有功能(未复刻) ▾</summary>'+['专题管理','检核任务管理','晨读管理','学堂首页配置','日志管理'].map(x=>'<div class="mi gray">'+IC.gr+'<span>'+x+'</span></div>').join('')+'</details>');
}
A.roleSwitch=el=>{UI.role=ROLES.find(r=>r.k===el.value);UI.tab={};UI.sel={};F=null;if(!PAGES_OK[UI.role.type].includes(UI.page))UI.page=(PAGES_OK[UI.role.type].includes('workbench')?'workbench':'overview');render();toast('已切换身份:'+UI.role.n+'(可见页面和数据范围随之变化)','ok')};
function renderPC(){
  renderMenu();if(!PAGES_OK[UI.role.type].includes(UI.page))UI.page=(PAGES_OK[UI.role.type].includes('workbench')?'workbench':'overview');
  const fn={workbench:pgWorkbench,overview:pgOverview,topics:pgTopics,topic:pgTopicDetail,content:pgContent,cedit:pgContentEdit,cdetail:pgContentDetail,catalog:pgCatalog,kp:pgKp,kpform:pgKpForm,qform:pgQForm,dform:pgDrForm,publish:pgPublish,projects:pgProjects,form:pgForm,detail:pgDetail,approvals:pgApprovals,coach:pgCoach,effect:pgEffect,student:pgStudent,people:(typeof pgPeople==='function'?pgPeople:pgStudent),person:(typeof pgPerson==='function'?pgPerson:pgStudent),config:pgConfig,tagmanage:pgTagManage}[UI.page];
  const m=$('#main');const st=m.scrollTop;
  const raw=(typeof aiPageGuideHtml==='function'?aiPageGuideHtml():'')+fn();
  const S='<!--DOCK_START-->',E='<!--DOCK_END-->';
  let dockHtml='',html=raw;
  const i=raw.indexOf(S),j=raw.indexOf(E);
  if(i>=0&&j>i){dockHtml=raw.slice(i+S.length,j);html=raw.slice(0,i)+raw.slice(j+E.length);}
  m.innerHTML=html;
  m.classList.toggle('has-dock',!!dockHtml);
  const dockRoot=document.getElementById('dock-root');
  if(dockRoot)dockRoot.innerHTML=dockHtml;
  m.scrollTop=st;
  if(typeof gdTrack==='function')gdTrack();
}
const crumb=a=>'<div class="crumb">'+a+'</div>';

/* ========== 图表 ========== */
function lineSvg(series,opt){
  opt=opt||{};const w=opt.w||520,h=opt.h||180,pl=36,pb=22,pt=10,pr=10;
  const all=series.flatMap(s=>s.d);const mn=Math.floor(Math.min(...all)-3),mx=Math.ceil(Math.max(...all)+3);
  const n=series[0].d.length;const X=i=>pl+i*(w-pl-pr)/(n-1),Y=v=>pt+(h-pt-pb)*(1-(v-mn)/(mx-mn));
  let s='<svg viewBox="0 0 '+w+' '+h+'" width="100%" style="max-width:'+w+'px">';
  for(let k=0;k<4;k++){const v=mn+(mx-mn)*k/3;s+='<line x1="'+pl+'" x2="'+(w-pr)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="#eee"/><text x="'+(pl-6)+'" y="'+(Y(v)+4)+'" font-size="10" fill="#999" text-anchor="end">'+v.toFixed(0)+'</text>'}
  if(opt.cut!=null)s+='<line x1="'+X(opt.cut)+'" x2="'+X(opt.cut)+'" y1="'+pt+'" y2="'+(h-pb)+'" stroke="#ff6900" stroke-dasharray="4 3"/><text x="'+(X(opt.cut)+4)+'" y="'+(pt+10)+'" font-size="10" fill="#ff6900">培训开始</text>';
  series.forEach(se=>{s+='<polyline fill="none" stroke="'+se.c+'" stroke-width="2" '+(se.dash?'stroke-dasharray="5 3"':'')+' points="'+se.d.map((v,i)=>X(i)+','+Y(v)).join(' ')+'"/>';se.d.forEach((v,i)=>{s+='<circle cx="'+X(i)+'" cy="'+Y(v)+'" r="2.5" fill="'+se.c+'"/>'})});
  for(let i=0;i<n;i+=2)s+='<text x="'+X(i)+'" y="'+(h-6)+'" font-size="10" fill="#999" text-anchor="middle">W'+(i+1)+'</text>';
  return s+'</svg><div class="hint" style="margin-top:2px">'+series.map(x=>'<span style="color:'+x.c+'">━</span> '+x.n).join('　')+'</div>';
}
const hbars=(rows,max,unit)=>rows.map(r=>'<div style="display:flex;align-items:center;gap:10px;margin:8px 0"><div style="width:200px;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(r[0])+'</div><div class="bar" style="flex:1;height:12px"><i style="width:'+Math.min(100,r[1]/max*100)+'%;background:'+(r[2]||'var(--pri)')+'"></i></div><div style="width:60px;text-align:right">'+r[1]+(unit||'')+'</div></div>').join('');

/* ========== 培训总览 ========== */
function guide(){
  const P=S.projects;const off=P.filter(p=>p.off);
  return [
   ['① 发现(可选):课题池看系统 / AI 发现的问题,决定做不做','课题池',S.topics.some(t=>['已采纳','已闭环'].includes(t.flow)),'topics'],
   ['② 准备内容:先在「知识点」看缺什么，再到「内容中心」做话术 / 课程 / 题 / 演练，挂到知识点，审核定稿（定稿≠上架）','内容中心 · 知识点',S.contents.some(c=>!c.orig&&(c.kps||[]).length),'content'],
   ['③ 发布:把已定稿的内容上架到零售通学习专区(学员也能在「我的提升清单」里诊断、练题、做演练)','零售通发布',S.contents.some(isPub),'publish'],
   ['④ 实施:新增学习项目——定培训目标、配学习模块(含「线下班次培训」节点)、选覆盖角色','学习任务',P.length>0,'form'],
   ['零售通:学员报名(右上角切到零售通,可切换学员)','零售通',S.apps.some(a=>a.src==='零售通报名'),'rn'],
   ['后台:报名审批','报名审批',S.apps.some(a=>a.status==='已通过'||a.status==='候补')&&S.apps.some(a=>a.src==='零售通报名'&&a.status!=='待审批'),'approvals'],
   ['后台:分班并发布分班结果','项目详情·分班',off.some(p=>p.classPub),'projects'],
   ['零售通签到 → 后台录成绩、结业','项目详情·培训结果',Object.values(S.results).some(r=>Object.values(r).some(x=>x.st==='已结业')),'projects'],
   ['⑤ 效果:推进项目阶段,同步数据,看效果追踪','效果追踪',S.projects.some(p=>p.eff),'effect'],
   ['结项并选结论(复制 / 回炉 / 终止)','效果追踪·调优与结项',S.projects.some(p=>p.status==='已结项'),'effect']
  ];
}
function pgOverview(){
  const tabs=UI.role.type==='boss'?['老板视图','流程与规则']:['闭环总览','老板视图','流程与规则'];const t=curTab('overview',tabs);let b='';
  if(t==='闭环总览'){
    const P=S.projects;const gl=guide();const nx=gl.findIndex(g=>!g[2]);
    const grad=Object.values(S.results).reduce((s,r)=>s+Object.values(r).filter(x=>x.st==='已结业').length,0);
    const nodes=[
     ['课题(可选)',S.topics.length,'已采纳 '+S.topics.filter(t=>['已采纳','已闭环'].includes(t.flow)).length+' · 辅助发现问题','topics'],
     ['知识点 · 内容',S.kps.length+' 点 / '+(S.contents.length+S.qs.length+S.drills.length)+' 条','话术 课程 题 演练;已上架 '+S.contents.filter(isPub).length,'catalog'],
     ['学习项目',P.length,'带培训目标;由课题转入或手工新增','projects'],
     ['报名申请',S.apps.length,'零售通学员提交 / 范围选择生成','approvals'],
     ['班次',S.classes.length,'后台人工分班','projects'],
     ['结业人数',grad,'线上成绩来自清河大学 + 线下录入','projects'],
     ['效果数据',S.projects.filter(p=>p.eff).length,'评估中阶段同步北斗 BI / 语料','effect'],
     ['已结项',S.projects.filter(p=>p.status==='已结项').length,'结论:复制 / 回炉 / 终止','effect']
    ];
    b+='<div class="src" style="background:#fff6ef"><b>日常从「工作台」开始</b><span>这里是整条闭环的<b>流程说明和验收清单</b>;每天要处理什么、缺什么,看「工作台」。 <a class="link" data-act="go" data-p="workbench">去工作台 ›</a></span></div><div class="src"><b>怎么读</b><span>已载入一套自洽的示例数据(课题、项目、报名、分班、成绩、效果、辅导工单都有),所有数字都是实时统计;右上角「清空数据」可以从零开始走一遍闭环。外部数据(人员、北斗 BI、语料、清河大学、agent)只读,在「配置中心 → 数据源」可查看。</span></div>'
     +'<div class="card"><h3>闭环链路(点击节点进入对应页面)</h3><div class="chain">'+nodes.map((n,i)=>'<div class="cn '+(i===({0:0,1:1,2:2,3:3,4:3,5:4,6:5,7:6,8:7}[nx]===undefined?-1:({0:0,1:1,2:2,3:3,4:3,5:4,6:5,7:6,8:7}[nx]))?'next':'')+'" data-act="go" data-p="'+n[3]+'"><div class="n '+(n[1]?'':'z')+'">'+n[1]+'</div><b>'+n[0]+'</b><div class="w">'+n[2]+'</div></div>'+(i<7?'<div class="arrow">→</div>':'')).join('')+'</div></div>'
     +'<div class="grid g2"><div class="card"><h3>闭环检查(示例数据下已全部走通;清空后按顺序做会自动打勾)</h3>'+gl.map((g,i)=>'<div class="gl '+(g[2]?'ok':i===nx?'nx':'')+'"><span class="ck">'+(g[2]?'✓':i+1)+'</span><span style="flex:1">'+g[0]+' <span class="hint">· '+g[1]+'</span></span>'+(g[2]?'':(g[3]==='rn'?'<button class="btn sm" data-act="end" data-v="rn">切到零售通</button>':(g[3]==='topics'?'<button class="btn sm" data-act="go" data-p="topics">去课题池</button>':g[3]==='form'?'<button class="btn sm" data-act="formNew">去创建</button>':'<button class="btn sm" data-act="go" data-p="'+g[3]+'">去处理</button>')))+'</div>').join('')+'</div>'
     +'<div class="card"><h3>外部数据源(只读)</h3>'+DS.map(d=>'<div style="padding:6px 0;border-top:1px solid #f2f3f5"><b>'+d[0]+'</b> <span class="hint">'+d[1]+'</span><div class="hint">提供:'+d[2]+'</div><div class="hint">用于:'+d[3]+'</div></div>').join('')+'<div style="margin-top:8px"><button class="btn sm" data-act="go" data-p="config" data-t="数据源">查看详情</button></div></div></div>';
  }else if(t==='流程与规则'){b=pgRules()}
  else{b=bossView()}
  return '<div class="ph"><h2>培训总览</h2></div>'+tabsH('overview',tabs)+b;
}

/* ========== 流程与规则（业务操作版：先照着做，再看边界） ========== */
function pgRules(){
  const c=S.cfg;
  const T=(h,rows,cls)=>'<div class="tw '+(cls?cls+'-wrap':'')+'" style="margin-bottom:14px"><table class="t '+(cls||'')+'"><tr>'+h.map(x=>'<th>'+x+'</th>').join('')+'</tr>'+rows.map(r=>'<tr>'+r.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('')+'</table></div>';
  const ruleStep=(n,t,d,go)=>'<div class="kp-step"><span>'+n+'</span><div><b>'+t+'</b><div class="hint">'+d+'</div></div>'+(go?'<a class="link" data-act="go" data-p="'+go[0]+'"'+(go[1]?' data-t="'+go[1]+'"':'')+'>'+go[2]+' ›</a>':'')+'</div>';
  const state=(t,v)=>'<span class="tag '+(v?'ok':'')+'">'+t+'</span>';
  return srcBar('这页是业务操作说明：先看「日常五步」，再按角色查「谁能做什么」，最后才是状态机、数据来源和设计边界。页面里的门槛、权重都取「配置中心」当前值，改了配置这里同步变化。')
   +'<div class="card"><h3>1. 日常五步（第一次用就按这个顺序）</h3>'
    +ruleStep(1,'看今天该处理什么','从「工作台」开始：缺讲解、题不够、待审核、报名审批、效果诊断都汇总在这里，点「去处理」直达对象。',['workbench','','去工作台'])
    +ruleStep(2,'把知识点清单补完整','知识点页只看「要讲什么、有没有讲的内容」：先看车型 × 标签矩阵，缺的用页头「批量导入 / 新车克隆」补，再用「内容中心」造讲解、题和演练。',['catalog','','去知识点'])
    +ruleStep(3,'把讲解和练习做出来并定稿','内容中心统一管话术、课程、题、演练；定稿 ≠ 上架，定稿后才能被学习任务引用。',['content','','去内容中心'])
    +ruleStep(4,'组织一场培训','新增学习项目：定培训目标、配学习任务、选覆盖角色；线下班次培训还要做报名审批、分班、签到、成绩、结业。',['projects','','去学习项目'])
    +ruleStep(5,'看效果并决定下一步','效果追踪先看「人员就绪度」，再看「错题集」找共性；证据不足才去「调优与结项」改口径；项目结束在「结项」选结论。',['effect','','去效果追踪'])
    +'<div class="hint" style="margin-top:6px">课题池是辅助入口，不是必经流程；没有课题也可以直接准备内容、建学习项目。</div></div>'
   +'<div class="card"><h3>2. 角色边界（能看到什么、能改什么）</h3>'+T(['动作','总部培训部','区域老师','老板','销售顾问（零售通）'],[
    ['知识点：看清单 / 补缺口 / 批量导入 / 新车克隆','✓ 全国','✓ 本区可见范围','—','—'],
    ['内容中心：生成 / 编辑 / 审核 / 定稿 / 归档','✓ 全国内容','✓ 本区内容（审核人默认本人）','—','点赞 / 点踩 / 纠错'],
    ['零售通发布：上架 / 更新上架 / 下架','✓ 全国内容','✓ 本区内容','—','看学习专区'],
    ['标签管理：改标签树 / 合并 / 停用','✓ 配置中心 → 标签管理','—（只读使用）','—','—'],
    ['新增学习项目（含培训目标）','✓ 任意区域','✓ 仅本区','—','—'],
    ['报名审批 / 撤销资格','✓ 全部','✓ 仅自己是审批人的项目，且只审批本区学员','—','报名 / 撤销报名'],
    ['分班 / 录成绩 / 结业 / 结项','✓ 全部','✓ 本区项目','—','签到 / 看班次 / 看成绩'],
    ['效果追踪：人员就绪度 / 错题集 / 效果报告','✓ 全国个人明细','✓ 仅本区个人明细','✓ 只读群体聚合，不看姓名 / MID','—'],
    ['调优：看诊断','✓','✓ 只读','—','—'],
    ['调优：创建调整项 / 回滚配置','✓','—','—','—'],
    ['目标变更审批 / 配置中心','✓','提交目标变更申请','—','—']],'rules-role')+'</div>'
   +'<div class="card"><h3>3. 学习项目状态机</h3>'+T(['状态','怎么进入','前置条件','谁触发','这一步产生什么'],[
    ['未生效','提交学习项目，下发周期开始日在今天之后','目标优于基线、至少一个任务节点','提交人','项目、培训目标快照、任务节点；线下节点含报名设置'],
    ['已生效','下发周期开始（开始日 ≤ 今天则提交即生效）','—','时间驱动','任务按「覆盖角色」下发到零售通；报名制开放报名；指定范围生成参训名单'],
    ['观察期','培训周期结束','线下班次培训：至少 1 人结业','时间驱动 / 人工确认','观察期 '+c.obsWeeks+' 周；之后再留 1 天数据延迟'],
    ['评估中','观察期结束','—','时间驱动','从北斗 BI / 汽车语料 / 清河大学同步当前值、三层指标、对照、门店下钻'],
    ['已结项','结项时选结论','必须选结论并写一句原因','项目负责人','复制（带入配置新建）/ 回炉（话术下线）/ 转入店辅导（生成工单）/ 终止'],
    ['已下线','列表「下线任务」','—','项目负责人','学员不再看到任务']])+'</div>'
   +'<div class="card"><h3>4. 线下班次培训：从报名到结业</h3>'+T(['步骤','谁做','规则','失败 / 边界'],[
    ['报名','学员（零售通）','对象范围内可见；报名截止前可报、可撤销','截止后不可报；被驳回可重新报名'],
    ['审批','审批人（后台）','通过占名额；名额已满进候补；驳回原因选填','有人被撤销资格，候补按申请时间自动递补'],
    ['分班','培训老师（后台）','只能从「已通过」且未分班的学员里，按 MID 批量搜索加入；班次日期需在培训周期内；不超过班次容量','班次容量合计需 ≥ 已通过人数，否则分班页提示'],
    ['签到','学员（零售通）','分班结果发布后可签到：扫班次码 / 点击签到；老师可在培训结果补签','缺考由老师标记；扫了别的班次的码会被拒绝'],
    ['成绩','老师（后台）','线上成绩从清河大学同步；线下成绩手工录入或按 CSV 导入；总评 = 线上 '+c.wOnline+'% + 线下 '+(100-c.wOnline)+'%；通过线 '+c.pass+' 分','不及格 / 缺考可补考一次，仍未过通知区域老师'],
    ['结业','老师（后台）','只有「通过」的学员可结业；结业后零售通显示成绩、目标进度、带教师傅','—']])+'</div>'
   +'<div class="card"><h3>5. 数据从哪来（哪些能改，哪些只读）</h3>'+T(['数据','产生 / 来源','在哪看或改','用在哪里'],[
    ['人员、门店、区域、入职天数','人事系统（入转调离）','配置中心 → 数据源（只读）','覆盖角色、预估人数、MID 搜索、新人判定'],
    ['知识点','业务维护；支持 CSV 批量导入、新车克隆','知识点页','内容挂载、车型矩阵、岗位画像、诊断'],
    ['标签树','业务自主维护','配置中心 → 标签管理','知识点与内容共用分类；不用建两套'],
    ['话术 / 课程 / 题 / 演练','课题 / agent 出初稿 / 导入 / 手工','内容中心','定稿后可做学习任务；话术、课程可上架零售通'],
    ['上架记录','从已定稿内容上架','零售通发布','零售通「学习专区」'],
    ['指标定义、口径参数','培训部维护','配置中心 → 指标库 / 阈值与口径','培训目标的主 / 辅助指标；提交时取快照'],
    ['报名申请 / 班次 / 成绩','学员 / 培训老师','报名审批、项目详情 → 分班 / 培训结果','总评、结业、效果'],
    ['效果数据','北斗 BI / 汽车语料 / 清河大学','项目进入「评估中」时自动同步','效果追踪、老板视图、报告'],
    ['辅导工单','效果追踪未达标门店 / 结项「转入店辅导」','入店辅导','复测对照'],
    ['点赞 / 点踩 / 纠错','学员（零售通）','内容中心 → 使用与反馈','点踩率 ≥ '+c.dislikeTh+'% 标「点踩偏高」；命中率 < '+c.hitTh+'% 标「命中偏低」']])+'</div>'
   +'<div class="card"><h3>6. 关键规则速查</h3>'+T(['规则','当前取值','来源配置'],[
    ['培训目标没填不能提交；目标需优于基线（越高越好要大过基线，越低越好要小过基线）','—','指标方向在指标库'],
    ['提交后培训目标和口径锁定，变更走「目标变更申请」，总部培训部审批','—','—'],
    ['同批人同时在途任务上限','超限需填原因才能提交：'+c.limit+' 项','阈值与口径'],
    ['样本不足不下结论（受训或对照人数低于门槛）','门槛 '+c.minN+' 人','阈值与口径'],
    ['关键词类指标：ASR 准确率低于底线显示「数据暂缺」','底线 '+c.asr+'%（当前 '+c.asrNow+'%）','阈值与口径'],
    ['效果数据只作选样和验收，不直接用于绩效考核或 PIP 判定','—','—']])+'</div>'
   +rulesTopic()+rulesContent()
   +'<div class="card"><h3>9. 设计边界与已知未闭环（评审用）</h3><div class="hint" style="margin-bottom:8px">上面是业务操作口径；这里是 Demo 还没做到、需要业务确认或后续迭代的部分，不粉饰。</div>'+rulesAudit().replace(/^<div class="card"><h3>8\. 闭环审查\(设计走查\)<\/h3>/,'').replace(/<\/div>$/,'')+'</div>';
}
/* E2 演示日期切换（默认保持 2026-11-09，改后刷新派生数据） */
A.demoDate=()=>{openDlg('演示日期','<div class="hint" style="margin-bottom:8px">所有「今天 / 到期 / 入职天数」都基于这个日期。默认 2026-11-09，改大会让到期和逾期变多。</div><div class="f"><label>日期</label><div class="in"><input type="date" id="dd_val" value="'+esc(today)+'"></div></div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="demoDateOk">应用</button>')};
A.demoDateOk=()=>{const v=(($('#dd_val')||{}).value||'').trim();if(!/^\d{4}-\d{2}-\d{2}$/.test(v))return toast('日期格式不对','err');window.__DEMO_TODAY=v;today=v;D0=new Date(v+'T00:00:00');closeDlg();toast('演示日期已设为 '+v+'，到期 / 逾期 / 倒计时已按新日期重算','ok');render()};
