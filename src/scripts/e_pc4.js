/* ========== 入店辅导 ========== */
function mkTickets(p,n,src){
  if(!p.eff)return 0;const rows=storeRows(p).filter(r=>!metV(p,r.v)).sort((a,b)=>p.goal.main.dir==='低'?b.v-a.v:a.v-b.v).slice(0,n);let c=0;
  rows.forEach(r=>{if(S.tickets.some(t=>t.store===r.store&&t.proj===p.id))return;S.tickets.push({id:'W'+(S.tickets.length+1),store:r.store,proj:p.id,src,goal:p.metric+' '+r.v+'% → '+p.target+'%',pre:r.v,st:'触发',owner:'-',trig:'目标未达成'});c++});return c}
function recStores(){
  const m={};visibleP().filter(p=>p.eff).forEach(p=>storeRows(p).forEach(r=>{if(!metV(p,r.v)){const gap=Math.abs(p.target-r.v);const x=m[r.store]||(m[r.store]={store:r.store,score:0,why:[],proj:p.id});x.score+=Math.min(60,40+gap*5);x.why.push('「'+p.name+'」'+r.v+'% 未达目标 '+p.target+'%')}}));
  return Object.values(m).map(x=>({...x,score:Math.min(99,Math.round(x.score))})).sort((a,b)=>b.score-a.score).slice(0,8)}
const tkVis=()=>S.tickets.filter(t=>UI.role.type!=='region'||pp2(t.store)===UI.role.region);
function pgCoach(){
  const tabs=['工单看板','推荐辅导店'];const t=curTab('coach',tabs);let b='';
  if(t==='工单看板'){
    const cols=['触发','派单','到店','复测'];
    b=srcBar('工单来自:① 「推荐辅导店」手工创建;② 项目结项时选「转入店辅导」自动生成(按效果下钻中未达标的门店)。工单阶段:触发 → 派单 → 到店 → 复测(2 周后对照)。')
     +(S.tickets.length?'<div class="kan">'+cols.map(c=>'<div class="col"><h4>'+c+'<span class="tag">'+tkVis().filter(x=>x.st===c).length+'</span></h4>'+tkVis().filter(x=>x.st===c).map(x=>'<div class="kc" data-act="ticket" data-id="'+x.id+'"><b>'+x.store+'</b><div class="s">'+x.src+'</div><div class="s">'+x.goal+'</div>'+(x.owner!=='-'?'<div class="s">辅导人:'+x.owner+'</div>':'')+'</div>').join('')+'</div>').join('')+'</div>':cta('还没有辅导工单','工单来自「推荐辅导店」或项目结项「转入店辅导」。推荐辅导店需要先有项目进入「评估中」。','<button class="btn" data-act="tab" data-k="coach" data-v="推荐辅导店">看推荐辅导店</button>'));
  }else{
    const rec=recStores();
    b=srcBar('推荐店由效果追踪中「未达成目标的门店」评分得出(目标差距越大、涉及项目越多分越高)。没有项目进入「评估中」就没有推荐。')
     +(rec.length?'<div class="tw"><table class="t"><tr><th>门店</th><th>评分</th><th>推荐理由</th><th>操作</th></tr>'+rec.map(r=>'<tr><td>'+r.store+'</td><td><div style="display:flex;align-items:center;gap:8px"><div class="bar" style="width:100px"><i style="width:'+r.score+'%"></i></div>'+r.score+'</div></td><td>'+r.why.join(';')+'</td><td>'+(S.tickets.some(x=>x.store===r.store)?'<span class="hint">已有工单</span>':'<button class="link" data-act="mkTicket" data-s="'+r.store+'" data-p="'+r.proj+'">创建辅导工单</button>')+'</td></tr>').join('')+'</table></div>':cta('暂无推荐辅导店','需要有项目进入「评估中」并存在未达标门店。','<button class="btn" data-act="go" data-p="projects">去培训项目推进阶段</button>'));
  }
  return '<div class="ph"><h2>入店辅导</h2></div>'+tabsH('coach',tabs)+b;
}
A.mkTicket=el=>{const p=proj(el.dataset.p);const r=storeRows(p).find(x=>x.store===el.dataset.s);S.tickets.push({id:'W'+(S.tickets.length+1),store:el.dataset.s,proj:p.id,src:'推荐辅导店',goal:p.metric+' '+r.v+'% → '+p.target+'%',pre:r.v,st:'触发',owner:'-',trig:'目标未达成'});UI.tab.coach='工单看板';toast('已创建辅导工单(触发)','ok');render()};
A.ticket=el=>{const x=S.tickets.find(t=>t.id===el.dataset.id);const nxt={触发:'派单',派单:'到店',到店:'复测'}[x.st];
  openDlg('辅导工单 · '+x.store,'<dl class="kv"><dt>来源</dt><dd>'+x.src+(x.proj?' · 项目 '+esc(proj(x.proj).name):'')+'</dd><dt>触发原因</dt><dd>'+x.trig+'</dd><dt>当前阶段</dt><dd>'+x.st+'</dd><dt>辅导目标</dt><dd>'+x.goal+'(辅导前确认)</dd><dt>辅导人</dt><dd>'+x.owner+'</dd></dl><h4>复测对照(辅导 2 周后)</h4>'+(x.st==='复测'?'<div class="grid g3"><div class="stat"><div class="l">辅导前</div><div class="n">'+x.pre+'%</div></div><div class="stat"><div class="l">复测</div><div class="n" style="color:var(--ok)">'+(+(x.pre+2.5+hsh(x.id)%20/10).toFixed(1))+'%</div></div><div class="stat"><div class="l">变化</div><div class="n">+'+(+(2.5+hsh(x.id)%20/10).toFixed(1))+'pt</div></div></div><div class="hint">只有几个人,仅作参考,不下结论;数据来自北斗 BI。</div>':'<div class="hint">到店辅导完成 2 周后复测,与辅导前对比(北斗 BI)。</div>'),
   '<button class="btn" data-act="close">关闭</button>'+(nxt?'<button class="btn pri" data-act="tnext" data-id="'+x.id+'">推进到「'+nxt+'」</button>':''))};
A.tnext=el=>{const x=S.tickets.find(t=>t.id===el.dataset.id);x.st={触发:'派单',派单:'到店',到店:'复测'}[x.st];if(x.owner==='-')x.owner='周丽';closeDlg();toast('工单已推进到「'+x.st+'」','ok');render()};

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
