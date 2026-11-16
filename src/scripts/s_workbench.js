/* ========== 工作台 v22 ==========
   一个入口回答「今天我该处理什么」。所有"待办"都汇到这里(以前分散在 课题池 / 内容中心「待我处理」/ 知识点「总览」/ 报名审批),
   每条都带「去处理」,点进去落到对应模块的对应对象。回流通道也只有这一条:
   零售通反馈 / 学员薄弱 / 候选缺口 / 内容到期 → 工作台待办 → 由人决定 生成课题 / 改版 / 补内容。 */
/* [筛选键, 界面显示名, 说明]。键保持 v22 原值,避免待办数据与筛选条件错位 */
const WB_GROUPS=[['发现','发现问题','课题'],['备料','准备内容','知识点 · 内容'],['发布','上架','零售通'],['实施','组织培训','学习项目'],['效果','看效果','就绪度 · 错题 · 调优']];
function wbItems(){
  const it=[];const add=(g,sev,tag,title,desc,act,attrs)=>it.push({g,sev,tag,title,desc,act,attrs:attrs||''});
  const ck='data-act="wbGo"';
  /* —— 发现:课题 —— */
  S.topics.filter(t=>visTopics().includes(t)&&['新发现'].includes(t.flow)).forEach(t=>add('发现',prio(t).k==='P0'?3:prio(t).k==='P1'?2:1,'新课题','<b>'+esc(t.title)+'</b>',prio(t).k+' · 证据 '+t.stats.sess+' 条会话 / '+t.stats.stores+' 家门店','去看',ck+' data-p="topic" data-id="'+t.id+'" data-ky="tid"'));
  /* —— 备料:知识点缺口(最影响学员的先排)—— */
  /* 只给「已启用」的点派发缺讲解待办;停用且无负责人的点只留一条批量治理提示,避免 67 条待办被同一类问题淹没 */
  const act=S.kps.filter(k=>k.st==='启用'&&k.owner);
  act.forEach(k=>{const h=kpHealth(k);const w=kpWeak(k),tt=kpTested(k);
    if(h.cells.exp.s!=='ok')add('备料',3,'缺讲解','<b>'+esc(kpLabel(k))+'</b>',(tt?'学员 '+w+'/'+tt+' 人未过关 · ':'')+h.cells.exp.t,'去补',ck+' data-p="kp" data-id="'+k.id+'" data-ky="kid"');
  });
  const qNeed=act.filter(k=>{const h=kpHealth(k);return h.cells.q.s!=='ok'&&k.type==='事实型'});
  if(qNeed.length)add('备料',1,'缺测评题','<b>'+qNeed.length+' 个产品知识</b>测评题不够','题太少会影响诊断和掌握度；可批量进内容中心补题','去补题',ck+' data-p="content" data-tab="题" data-ky="none"');
  const weakTodo=act.filter(k=>{const w=kpWeak(k),tt=kpTested(k);return tt>=KP_WEAK_N&&w/tt>=KP_WEAK_R&&!kpTopicOf(k)});
  if(weakTodo.length)add('备料',2,'学员集中薄弱','<b>'+weakTodo.length+' 个知识点</b>讲解齐全但学员集中薄弱','通常是讲法或练习不够；可进知识点总览批量生成课题','去看',ck+' data-p="catalog" data-tab="总览" data-ky="none"');
  const noOwner=S.kps.filter(k=>!k.owner);if(noOwner.length)add('备料',2,'没有负责人','<b>'+noOwner.length+' 个知识点</b>还没有负责人','这些点不会启用,学员也看不到。建议先批量指派负责人','批量指派',ck+' data-p="catalog" data-tab="知识点库" data-ky="none"');
  S.kpCand.filter(x=>x.st==='待确认').forEach(x=>add('备料',2,'候选知识点','<b>'+esc(x.name)+'</b>',x.from+':'+x.why,'去确认',' data-act="wbCand" data-id="'+x.id+'"'));
  const un=S.contents.filter(c=>visC(c)&&!(c.kps||[]).length&&c.st!=='已归档');if(un.length)add('备料',1,'未挂载','<b>'+un.length+' 条内容</b>还没挂知识点','进不了完备度检查,学员的提升清单也推荐不到','去挂载',' data-act="wbUnmounted"');
  /* —— 备料:内容生产(原「内容中心 · 待我处理」)—— */
  const cw=cWork(S.contents.filter(visC));const cwAgg={};
  cw.forEach(x=>{const p={'待我审核':3,'区域推荐待审核':2,'导入待确认':2,'课题待生产':2,'一线纠错':3,'点踩反馈':2,'反馈异常':2,'待上架':1,'即将到期':3,'下架待处理':2,'我的草稿':1}[x.tag];if(!p)return;const g=x.tag==='待上架'||x.tag==='下架待处理'?'发布':'备料';if(p<=2){(cwAgg[x.tag]=cwAgg[x.tag]||[]).push({x,p,g});return}it.push({g,sev:p,tag:x.tag,title:x.title,desc:x.desc,act:'',attrs:'',raw:x.btn})});
  Object.keys(cwAgg).forEach(tag=>{const arr=cwAgg[tag];if(arr.length<2){const a=arr[0];it.push({g:a.g,sev:a.p,tag,title:a.x.title,desc:a.x.desc,act:'',attrs:'',raw:a.x.btn});return}it.push({g:arr[0].g,sev:arr[0].p,tag,title:'<b>'+arr.length+' 条</b>「'+tag+'」',desc:'同类事项合并，进去按列表处理',act:'去处理',attrs:ck+' data-p="content" data-tab="全部内容" data-ky="none"'})});
  /* —— 题 / 演练草稿 —— */
  const qDraft=S.qs.filter(q=>q.st==='草稿');if(qDraft.length)add('备料',1,'题待定稿','<b>'+qDraft.length+' 道题</b>还没定稿','草稿题不会进入诊断；可逐个编辑或先放着','去处理',ck+' data-p="content" data-tab="题" data-ky="none"');
  const dDraft=S.drills.filter(d=>d.st==='草稿');if(dDraft.length)add('备料',1,'演练待定稿','<b>'+dDraft.length+' 个演练</b>还没定稿','草稿演练不会进入学员练习','去处理',ck+' data-p="content" data-tab="演练" data-ky="none"');
  /* —— v23:效果与调优待办 —— */
  if(typeof v23Diag==='function'&&S.lrn&&S.lrn.length){
    v23Diag().filter(x=>x.ok==='bad').forEach(x=>add('效果',3,'效果诊断','<b>第 '+x.no+' 层 · '+esc(x.ttl)+'</b>',esc(x.sym)+' · '+esc(x.read[0][0])+' '+esc(String(x.read[0][1])),'去调优',ck+' data-p="effect" data-tab="调优" data-ky="none"'));
    const rec=S.mis.filter(m=>m.status==='recurred');
    if(rec.length)add('效果',2,'错题复发','<b>'+rec.length+' 条错题关闭后复发</b>','复发率 '+v23RecurRate()+'% · 涉及 '+new Set(rec.map(m=>m.kp)).size+' 个知识点','去错题集',ck+' data-p="effect" data-tab="错题集" data-ky="none"');
    const gaps=S.lrn.filter(l=>{const r=v23Readiness(l.mid,l.tier);return r.ach!=null&&r.ach<S.cfg.pass*0.7});
    if(gaps.length)add('效果',2,'画像缺口','<b>'+gaps.length+' 人</b>目标达成率明显低于过关线','按画像项看缺口,可指派学习包','去就绪度',ck+' data-p="effect" data-tab="就绪度" data-ky="none"');
    const cv=S.cfgV.find(v=>v.status==='观察中');const od=cv&&v23ObsDue(cv);
    if(cv&&od)add('效果',od.left<=0?3:1,'配置观察期','<b>配置版本 v'+cv.ver+'</b> '+(od.left<=0?'观察期已满,该对比效果了':'观察中,还剩 '+od.left+' 天'),'观察期 '+S.cfg.obsWeeks+' 周,满期后对比生效前后','去对比',ck+' data-p="effect" data-tab="调优" data-ky="none"');
  }
  /* —— 实施:报名审批 —— */
  const pa=pendingFor();if(pa.length)add('实施',2,'待审批','<b>'+pa.length+' 条报名</b>待审批','先到先得;名额满进候补','去审批',ck+' data-p="approvals" data-ky="none"');
  return it.sort((a,b)=>b.sev-a.sev)}
const WB_SEV={3:['紧急','err'],2:['建议','warn'],1:['可选','']};
function pgWorkbench(){
  const it=wbItems();const f=UI.sel.wbf||'';const rows=it.filter(x=>!f||x.g===f);
  const cnt=g=>it.filter(x=>x.g===g).length;
  const st=kpStats();const act=S.kps.filter(k=>k.st==='启用');const hs=act.map(kpHealth);
  const cover=act.length?Math.round(hs.filter(h=>h.cells.exp.s==='ok').length/act.length*100):0;
  const num=(l,v,sub,attr)=>'<div class="stat kp-click" '+attr+' style="cursor:pointer"><div class="l">'+l+'</div><div class="n">'+v+'</div><div class="hint">'+sub+'</div></div>';
  /* 主线:发现问题 → 准备内容 → 上架 → 组织培训 → 看效果 */
  const flow='<div class="wb-flow">'+[['发现问题','课题池',S.topics.filter(t=>t.flow==='新发现').length+' 个新课题','topics'],['准备内容','知识点 · 内容',st.err+' 个缺口 · '+S.contents.filter(c=>c.st==='草稿'||c.st==='审核中').length+' 条在途','catalog'],['上架','上架到零售通',S.contents.filter(isPub).length+' 条已上架','publish'],['组织培训','学习项目',S.projects.length+' 个项目','projects'],['看效果','效果追踪',S.projects.filter(p=>p.eff).length+' 个已出效果','effect']].map((x,i)=>(i?'<i>→</i>':'')+'<div class="wb-n kp-click" data-act="go" data-p="'+x[3]+'"><small>'+x[0]+'</small><b>'+x[1]+'</b><span>'+x[2]+'</span></div>').join('')+'</div>';
  return '<div class="ph"><h2>工作台 <span class="hint" style="font-weight:400">今天该处理什么:所有待办都汇在这里,点「去处理」直接落到对应对象</span></h2></div>'
   +flow
   +'<div class="grid g4" style="margin-bottom:16px">'+num('待办总数',it.length,'紧急 '+it.filter(x=>x.sev===3).length+' · 建议 '+it.filter(x=>x.sev===2).length,'data-act="wbF" data-v=""')
   +num('讲解覆盖率',cover+'%','启用的知识点里有可用讲解','data-act="go" data-p="catalog"')
   +num('未挂载内容',st.un,'进不了完备度检查','data-act="wbUnmounted"')
   +num('学员集中薄弱',kpWeakList().length,'已测 ≥3 人且 ≥50% 未过关','data-act="go" data-p="catalog" data-t="总览"')+'</div>'
   +'<div class="card"><h3>待办 <span class="hint">按紧急程度排序;「紧急」= 学员现在就受影响</span></h3><div class="wb-tabs"><span class="'+(f?'':'on')+'" data-act="wbF" data-v="">全部 '+it.length+'</span>'+WB_GROUPS.map(g=>'<span class="'+(f===g[0]?'on':'')+'" data-act="wbF" data-v="'+g[0]+'">'+g[1]+' '+cnt(g[0])+'</span>').join('')+'</div>'
   +(rows.length?'<table class="t"><tr><th style="width:64px">优先</th><th style="width:96px">类型</th><th>对象</th><th>为什么</th><th style="width:96px"></th></tr>'+rows.slice(0,25).map(x=>'<tr><td><span class="tag '+WB_SEV[x.sev][1]+'">'+WB_SEV[x.sev][0]+'</span></td><td><span class="tag" style="white-space:nowrap">'+x.tag+'</span></td><td style="white-space:normal;min-width:200px">'+x.title+'</td><td class="hint" style="white-space:normal">'+x.desc+'</td><td>'+(x.raw?x.raw:'<button class="btn sm pri" '+x.attrs+'>'+x.act+'</button>')+'</td></tr>').join('')+'</table>'+(rows.length>25?'<div class="hint" style="margin-top:6px">只显示优先级最高的 25 条,共 '+rows.length+' 条;可用上方分组收敛范围</div>':''):'<div class="chk ok"><b>✓</b><span>这一类没有待办</span></div>')+'</div>'}
A.wbF=el=>{UI.sel.wbf=el.dataset.v;render()};
A.wbGo=el=>{const d=el.dataset;closeDlg();UI.page=d.p;if(d.tab)UI.tab[d.p]=d.tab;if(d.ky==='tid')UI.tid=d.id;if(d.ky==='kid')UI.kid=d.id;render();$('#main').scrollTop=0};
A.wbCand=el=>{UI.page='catalog';UI.tab.catalog='看板';UI.sel.kpf={};render()};
A.wbUnmounted=()=>{UI.page='content';UI.tab.content='内容';UI.sel.cq={kp:'未挂载'};render()};
/* ================= 内容中心:四种性质统一入口(话术 / 课程 / 题 / 演练)=================
   话术、课程 = 原来的内容(S.contents);题 = S.qs;演练 = S.drills。
   数据结构不变(各有各的编辑页),但在内容中心里用同一张"全部内容"列表、同一套状态(草稿 / 已定稿 / 已停用)、同一套"挂知识点"呈现。 */
const CK4=['话术','课程','题','演练'];
function cAll(){
  const rows=[];
  S.contents.filter(visC).forEach(c=>rows.push({k:c.kind,id:c.id,title:c.title,kp:(c.kps||[]).slice(),st:c.st,pub:pubOf(c),sub:(c.kind==='话术'&&c.car?c.car:c.type)+' · v'+c.ver,who:cShort(c.creator),use:c.views||0,raw:c}));
  S.qs.forEach(q=>rows.push({k:'题',id:q.id,title:q.stem,kp:[q.kp],st:q.st,pub:null,sub:q.type+' · 难度 '+q.lv,who:q.owner,use:q.stat.n,raw:q}));
  S.drills.forEach(d=>rows.push({k:'演练',id:d.id,title:d.name,kp:[d.kp],st:d.st,pub:null,sub:d.scene+' · '+d.turns.length+' 回合',who:d.owner,use:d.stat.n,raw:d}));
  return rows}
const cOpenAct=r=>r.k==='题'?['qOpen','编辑']:r.k==='演练'?['drOpen','编辑']:['cView','查看'];
function cAllList(){
  const q=UI.sel.caf||(UI.sel.caf={});const kw=q.q||'';
  const all=cAll();
  const rows=all.filter(r=>(!q.k||r.k===q.k)&&(!q.st||r.st===q.st)&&(!q.kp||(q.kp==='未挂载'?(r.k==='话术'||r.k==='课程')&&!r.kp.length:r.kp.includes(q.kp)))&&(!kw||r.title.includes(kw)||r.id===kw));
  const n=k=>all.filter(r=>r.k===k).length;
  const so=(key,l,o)=>'<div class="fi2"><label>'+l+'</label><select data-wc="cafset" data-k="'+key+'"><option value="">全部</option>'+o.map(x=>'<option '+(q[key]===x?'selected':'')+'>'+x+'</option>').join('')+'</select></div>';
  const seg='<div class="wb-tabs" style="margin-bottom:12px">'+'<span class="'+(q.k?'':'on')+'" data-act="cafK" data-v="">全部 '+all.length+'</span>'+CK4.map(k=>'<span class="'+(q.k===k?'on':'')+'" data-act="cafK" data-v="'+k+'">'+k+' '+n(k)+'</span>').join('')+'</div>';
  const fil='<div class="card" style="padding:14px 18px"><div class="filg"><div class="fi2"><label>标题 / 题干 / ID</label><input data-wc="cafkw" value="'+esc(kw)+'" placeholder="关键词"></div>'+so('st','状态',['草稿','审核中','已定稿','已停用','已归档'])+'<div class="fi2"><label>知识点</label><select data-wc="cafset" data-k="kp"><option value="">全部</option><option '+(q.kp==='未挂载'?'selected':'')+'>未挂载</option>'+S.kps.map(k=>'<option value="'+k.id+'" '+(q.kp===k.id?'selected':'')+'>'+esc(kpLabel(k))+'</option>').join('')+'</select></div><div class="fi2" style="align-self:end"><button class="btn" data-act="cafAdv">高级筛选(上架 / 有效期 / 来源…)</button></div></div></div>';
  const list=rows.length?'<div class="tw"><table class="t nw stk"><tr><th>性质</th><th>ID</th><th>标题 / 题干</th><th>知识点</th><th>状态</th><th>上架</th><th>使用</th><th>负责人</th><th>操作</th></tr>'+rows.map(r=>{const a=cOpenAct(r);const st=r.st;return '<tr><td>'+({话术:kindTag('话术'),课程:kindTag('课程'),题:'<span class="tag blue">题</span>',演练:'<span class="tag" style="background:#f3e8ff;color:#7b3fc4">演练</span>'}[r.k])+'</td><td>'+r.id+'</td><td style="white-space:normal;min-width:240px;max-width:340px"><a class="link" data-act="'+a[0]+'" data-id="'+r.id+'">'+esc(r.title.length>60?r.title.slice(0,60)+'…':r.title)+'</a><div class="hint">'+esc(r.sub)+'</div></td><td style="white-space:normal">'+(r.kp.map(kp).filter(Boolean).map(k=>'<a class="link" data-act="kpOpen" data-id="'+k.id+'">'+esc(k.name)+'</a>').join('、')||'<span class="tag warn">未挂载</span>')+'</td><td>'+((r.k==='话术'||r.k==='课程')?cchip(st):'<span class="tag '+(st==='已定稿'?'ok':st==='草稿'?'blue':'')+'">'+st+'</span>')+'</td><td>'+(r.pub?pubchip(r.pub):'<span class="hint">—</span>')+'</td><td>'+(r.use||'<span class="hint">0</span>')+'</td><td>'+esc(r.who||'')+'</td><td><a class="link" data-act="'+a[0]+'" data-id="'+r.id+'">'+a[1]+'</a>'+(r.k==='题'&&st==='草稿'?' <a class="link" data-act="qPass" data-id="'+r.id+'">定稿</a>':'')+(r.k==='演练'&&st==='草稿'?' <a class="link" data-act="drPass" data-id="'+r.id+'">定稿</a>':'')+'</td></tr>'}).join('')+'</table></div>':cta('没有符合条件的内容','调整筛选,或点右上角新增。','');
  return seg+fil+list}
A.cafK=el=>{const q=UI.sel.caf||(UI.sel.caf={});if(el.dataset.v)q.k=el.dataset.v;else delete q.k;render()};
A.cafset=el=>{const q=UI.sel.caf||(UI.sel.caf={});if(el.value)q[el.dataset.k]=el.value;else delete q[el.dataset.k];render()};
A.cafkw=el=>{(UI.sel.caf||(UI.sel.caf={})).q=el.value.trim();render()};
A.cafAdv=()=>{UI.tab.content='话术与课程(高级)';render()};
A.cNewAny=el=>{const k=el.dataset.v;if(k==='题')return A.qNew();if(k==='演练')return A.drNew();A.cNew({dataset:{}});C.kind=k;if(k==='课程')C.type='图文';render()};

/* ================= 链路条:每个对象都显示"上一步 / 下一步",每一段都能点 =================
   课题 → 内容(话术/课程/题/演练)→ 知识点 → 零售通发布 → 学习项目 / 学员;缺的那一段标红并给出动作。 */
const LK=(label,txt,attr,state)=>'<div class="lk-n '+(state||'')+'" '+(attr||'')+'><small>'+label+'</small><b>'+txt+'</b></div>';
function linkBar(o){
  const seg=[];const arrow='<i>→</i>';
  if(o.type==='content'){const c=o.c;const tp=c.topic&&topic(c.topic);const ks=(c.kps||[]).map(kp).filter(Boolean);const u=usedBy(c.id);
    seg.push(tp?LK('来自课题',esc(tp.id+' '+tp.title.slice(0,14)),'data-act="topicOpen" data-id="'+tp.id+'"','ok'):LK('来自','自己定题 / 导入','', ''));
    seg.push(LK('这条内容',esc(c.kind)+' · '+c.st,'','cur'));
    seg.push(ks.length?LK('挂在知识点',esc(ks.map(k=>k.name).join('、')),'data-act="kpOpen" data-id="'+ks[0].id+'"','ok'):LK('挂在知识点','未挂载 · 去挂','data-act="lkMount" data-id="'+c.id+'"','bad'));
    seg.push(isPub(c)?LK('零售通','已上架 v'+c.pubVer,'data-act="cdtab" data-v="发布到零售通"','ok'):usableC(c)?LK('零售通','已定稿未上架 · 去上架','data-act="cdtab" data-v="发布到零售通"','bad'):LK('零售通','要先定稿','','dim'));
    seg.push(u.length?LK('被引用',u.length+' 个学习项目','data-act="cdtab" data-v="使用与反馈"','ok'):LK('被引用','暂无','','dim'))}
  if(o.type==='kp'){const k=o.k;const m=kpMounted(k);const h=kpHealth(k);const tp=kpTopicOf(k);const used=kpUsedBy(k);const tn=kpTested(k),w=kpWeak(k);
    seg.push(tp?LK('来自课题',esc(tp.id),'data-act="topicOpen" data-id="'+tp.id+'"','ok'):LK('来自','手工新建 / 候选','',''));
    seg.push(LK('这个知识点',esc(k.name),'','cur'));
    seg.push(m.length?LK('讲解 / 题 / 演练',m.length+' 条讲解 · '+qsOf(k.id,'已定稿').length+' 题 · '+drsOf(k.id,'已定稿').length+' 演练','','ok'):LK('讲解 / 题 / 演练','还没有 · 去准备','data-act="kpGoMount"','bad'));
    seg.push(h.cells.exp.s==='ok'?LK('零售通','讲解已上架','','ok'):LK('零售通','没有可用讲解','','bad'));
    seg.push(tn?LK('学员',w+'/'+tn+' 人未过关','',(w/tn>=0.5?'bad':'ok')):LK('学员','还没人测','','dim'));
    seg.push(used?LK('学习项目',used+' 个引用','','ok'):LK('学习项目','未被引用','','dim'))}
  if(o.type==='topic'){const t=o.t;const cs=(t.cids||[]).map(content).filter(Boolean);
    seg.push(LK('来源',esc(t.src),'','ok'));seg.push(LK('这个课题',esc(t.flow),'','cur'));
    seg.push(cs.length?LK('生成内容',cs.length+' 条','data-act="cView" data-id="'+cs[0].id+'"','ok'):LK('生成内容','还没有 · 去生成','','bad'));
    const kps=[...new Set(cs.flatMap(c=>c.kps||[]))].map(kp).filter(Boolean);seg.push(kps.length?LK('挂在知识点',esc(kps.map(k=>k.name).join('、')),'data-act="kpOpen" data-id="'+kps[0].id+'"','ok'):(t.kpId&&kp(t.kpId)?LK('来自知识点',esc(kp(t.kpId).name),'data-act="kpOpen" data-id="'+t.kpId+'"','ok'):LK('挂在知识点','待挂载','','dim')));
    seg.push(cs.some(isPub)?LK('零售通','已上架','','ok'):LK('零售通','未上架','','dim'))}
  return '<div class="lk">'+seg.join(arrow)+'</div>'}
A.lkMount=el=>{const c=content(el.dataset.id);const r=recKps(c);openDlg('把这条内容挂到知识点','<div class="hint" style="margin-bottom:10px">挂上之后,它会进入知识点的完备度检查,学员的提升清单也能推荐到它。</div>'+(r.length?'<div>系统推荐:<br>'+r.map(k=>'<div style="margin:8px 0"><button class="btn sm pri" data-act="lkMountDo" data-id="'+c.id+'" data-k="'+k.id+'">挂到「'+esc(kpLabel(k))+'」</button></div>').join('')+'</div>':'<div class="hint">没有合适的推荐。可以先到「知识点」新建一个,或去编辑页手动选择。</div>')+'<div style="margin-top:12px"><a class="link" data-act="cEdit" data-id="'+c.id+'">去编辑页手动选择 ›</a></div>','<button class="btn" data-act="close">关闭</button>')};
A.lkMountDo=el=>{const c=content(el.dataset.id);c.kps=c.kps||[];if(!c.kps.includes(el.dataset.k))c.kps.push(el.dataset.k);chist(c,'挂载知识点',kpLabel(kp(el.dataset.k)));closeDlg();toast('已挂载到「'+kp(el.dataset.k).name+'」','ok');render()};
