/* ========== 项目生命周期 / 效果数据生成 ========== */
const gradN=p=>Object.values(S.results[p.id]||{}).filter(x=>x.st==='已结业').length;
function nextInfo(p){
  const st=p.status;
  if(st==='未生效')return{label:'模拟:到达下发周期开始 → 已生效',ok:true,act:'adv',note:'到达项目下发周期开始时间,任务下发到覆盖范围内学员'};
  if(st==='已生效')return{label:'模拟:培训结束 → 观察期',ok:!p.off||gradN(p)>0,act:'adv',note:p.off?'线下班次培训需先在「培训结果」tab 让学员结业':'培训周期结束后进入观察期'};
  if(st==='观察期')return{label:'模拟:观察期结束,同步数据 → 评估中',ok:true,act:'adv',note:'观察期 '+(p.obsDays||30)+' 天,预计 '+obsEnd(p)+' 结束,再留 1 天数据延迟(语料 12 小时 / 北斗 BI T+1);同步北斗 BI(业务结果)、汽车语料(行为/话术)、清河大学(掌握度)'};
  if(st==='评估中')return{label:'结项并选结论',ok:true,act:'closeProj',note:'必须选结论:复制 / 回炉 / 转入店辅导 / 终止'};
  return null;
}
A.adv=el=>{const p=proj(el.dataset.id);const n=nextInfo(p);if(!n||p.status==='评估中')return;if(!n.ok)return toast(n.note,'err');
  const i=FLOW.indexOf(p.status);p.status=FLOW[i+1];logp(p,'推进到「'+p.status+'」(演示:模拟时间流逝)');
  if(p.status==='评估中'){gen(p);notify('项目「'+p.name+'」数据同步完成,可在「效果追踪」查看')}
  toast('项目已进入「'+p.status+'」','ok');render()};
function gen(p,ro){
  const h=hsh(p.id+p.name);const plan=p.target-p.base;const ratio=ro!=null?ro:0.55+(h%90)/100;
  p.cur=+(p.base+plan*ratio).toFixed(1);
  const a=trainedN(p),b=ctrlN(p);const noCtrl=b===0;const small=a<S.cfg.minN||(!noCtrl&&b<S.cfg.minN);
  const bc=+(p.base+0.8).toFixed(1),cc=+(bc+plan*0.15).toFixed(1);
  const nz=i=>((hsh(p.id+i)%21)-10)/10;
  const pilot=[],ctrl=[];for(let i=0;i<12;i++){if(i<8){pilot.push(+(p.base+nz(i)).toFixed(1));ctrl.push(+(bc+nz(i+20)).toFixed(1))}else{const k=[.35,.65,.9,1][i-8];pilot.push(+(p.base+(p.cur-p.base)*k).toFixed(1));ctrl.push(+(bc+(cc-bc)*k).toFixed(1))}}
  const inf=interf(p.aud.regions,p.start,p.end,p.id,p.type);
  let trust=RELEASE[p.rel].trust;if(inf.length)trust={高:'中',中:'低',低:'低'}[trust];if(noCtrl)trust='低';
  const m=p.goal.main;const layers={lrn:{n:'学习过程',rows:[['完成率',(88+h%9)+'%','学习任务下发明细'],['通过率',(80+h%12)+'%','清河大学 / 演练成绩']]},beh:{n:'行为 / 话术',asr:1,rows:[]},biz:{n:'业务结果',rows:[]}};
  const addInd=(g,isMain)=>{const L=layers[g.cat];const sd=hsh(p.id+g.id);
    const lo=g.dir==='低';const t=isMain?p.cur:+(g.rng[0]+(g.rng[1]-g.rng[0])*((sd%100)/100)).toFixed(1);const c=isMain?cc:+(lo?t+0.6+ratio*2:t-0.6-ratio*2).toFixed(1);
    L.rows.push([g.name+' · 受训',t+'%',g.src+(isMain?' · 主指标':'')+(lo?' · 越低越好':'')]);L.rows.push([g.name+' · 对照',c+'%',g.src])};
  addInd(m,true);p.goal.aux.forEach(g=>addInd(g,false));
  const L=['lrn','beh','biz'].filter(k=>k==='lrn'||layers[k].rows.length).map(k=>layers[k]);
  p.eff={a,b,noCtrl,small,pilot,ctrl,cut:8,did:[p.base,p.cur,bc,cc],trust,inf,L,syncAt:today+' 06:00'};
}
function storeRows(p){
  const rows=[];p.aud.regions.forEach(r=>REG[r].stores.forEach(s=>{const v=+(p.cur+((hsh(s+p.id)%90)-45)/10).toFixed(1);const c=+(p.eff.did[3]-((hsh(s+p.id+'c')%40)/10)+1).toFixed(1);rows.push({reg:r,store:s,n:Math.max(1,Math.round(p.eff.a/12+hsh(s)%8)),v,c})}));return rows}

/* ========== 项目详情 ========== */
function lineage(p){
  const apps=appsOf(p.id),cls=S.classes.filter(k=>k.proj===p.id),R=S.results[p.id]||{};
  const items=[];if(p.from){const tt=S.topics.find(x=>x.id===p.from);items.push([true,'课题来源','课题池 '+p.from+(tt?'「'+esc(tt.title)+'」':'')+' 参考建项;结项后效果结论会写回该课题'])}
  items.push([true,'任务配置','配置 '+p.nodes.length+' 个任务节点:'+p.nodes.map(n=>esc(n.t+'·'+n.name)).join('、')]);
  items.push([true,'覆盖角色','人员主数据:'+p.aud.regions.join('、')+' · '+(p.aud.level==='新人'?'新人':'全员')+',预估 '+(estN(p.aud)+(p.mids||[]).length)+' 人']);
  if(p.off){
    const z=apps.filter(a=>a.src==='零售通报名').length;
    items.push([apps.length>0,'报名',p.signup==='报名制'?(apps.length?'零售通收到 '+z+' 条申请,已通过 '+cntOk(p.id)+' / 名额 '+p.quota+(pendingAll().some(a=>a.proj===p.id)?'(有待审批)':''):'等待学员在零售通报名(对象范围内的学员可见)'):'按范围生成参训名单 '+apps.length+' 人(免审批)']);
    items.push([p.classPub,'分班',cls.length?cls.length+' 个班次,已入班 '+cls.reduce((s,k)=>s+k.members.length,0)+' 人,'+(p.classPub?'已发布':'未发布'):'还没有班次,在「分班」tab 新建班次并添加学员']);
    items.push([gradN(p)>0,'培训结果','签到 '+Object.values(R).filter(x=>x.signed).length+' 人(零售通签到),结业 '+gradN(p)+' 人;线上成绩来自清河大学,线下成绩后台录入']);
  }else{
    const el=PEOPLE.filter(x=>eligible(p,x));const dn=el.filter(x=>learnDone(p,x.mid)).length;
    items.push([dn>0,'学习任务','已下发到零售通,演示名单完成 '+dn+' / '+el.length+' 人(零售通学员真实操作)']);
  }
  items.push([!!p.eff,'效果数据',p.eff?'已于 '+p.eff.syncAt+' 同步':'「评估中」阶段同步:北斗 BI(业务结果)、汽车语料(行为/话术)']);
  items.push([p.status==='已结项','结项',p.status==='已结项'?'结论:'+p.closeRes:'评估后选结论:复制 / 回炉 / 终止']);
  const nx=items.findIndex(x=>!x[0]);
  return '<div class="lin">'+items.map((x,i)=>'<div class="'+(x[0]?'ok':i===nx?'nx':'')+'"><b>'+x[1]+'</b> <span class="hint">'+x[2]+'</span></div>').join('')+'</div>';
}
function pgDetail(){
  const p=proj(UI.projId);if(!p){UI.page='projects';return pgProjects()}
  const tabs=['概览','学习内容','下发明细'].concat(p.gray?['灰度对比']:[]).concat(p.off?['报名','分班','培训结果']:[]).concat(['效果']);
  if(!tabs.includes(UI.ptab))UI.ptab='概览';const t=UI.ptab;let b='';
  if(t==='概览'){
    const ci=FLOW.indexOf(p.status);const n=nextInfo(p);const g=p.goal;
    b='<div class="grid g2"><div><div class="card"><h3>项目阶段'+(p.status==='已下线'?' '+chip('已下线'):'')+'</h3><div class="prog" style="flex-wrap:wrap;gap:4px">'+FLOW.map((s,i)=>'<span class="chip" style="'+(i===ci?'background:var(--pri);color:#fff':i<ci?'background:#e8f8f1;color:var(--ok)':'')+'">'+s+'</span>'+(i<4?'<span style="margin:0 4px;color:#ccc">›</span>':'')).join('')+'</div>'
     +(n&&p.status!=='已下线'?'<div style="margin-top:12px"><button class="btn pri '+(n.ok?'':'dis')+'" data-act="'+n.act+'" data-id="'+p.id+'">'+n.label+'</button><div class="hint" style="margin-top:4px">'+(n.ok?n.note:'<span class="hint err">还不能推进:'+n.note+'</span>')+'</div></div>':p.status==='已结项'?'<div style="margin-top:10px">结论:<b>'+p.closeRes+'</b> · '+esc(p.closeWhy||'')+'</div>':'')
     +'<div class="hint" style="margin-top:6px">真实环境中阶段随时间自动推进;这里用按钮模拟时间流逝。</div></div>'
     +'<div class="card"><h3>培训目标 <span><span class="tag">已锁定</span><button class="link" data-act="chgGoal" data-id="'+p.id+'">申请变更目标</button></span></h3><div class="grid g4"><div><div class="hint">主指标</div><b>'+p.metric+'</b></div><div><div class="hint">基线</div><b>'+p.base+p.unit+'</b></div><div><div class="hint">目标</div><b style="color:var(--pri)">'+p.target+p.unit+'</b></div><div><div class="hint">当前</div><b>'+(p.cur==null?'无数据':p.cur+p.unit)+'</b></div></div><div style="margin-top:10px">'+progBar(p)+'</div>'
     +'<dl class="kv" style="margin-top:12px"><dt>统计口径</dt><dd>'+defText(g.main)+' <span class="tag">快照 v'+g.main.ver+'</span></dd><dt>基线取数</dt><dd>'+esc(p.baseSrc)+'</dd><dt>指标方向</dt><dd>'+(g.main.dir==='低'?'越低越好':'越高越好')+'</dd>'+Object.keys(g.main.params).map(k=>'<dt>'+k+'</dt><dd>'+esc(g.main.params[k])+'</dd>').join('')+(g.aux.length?'<dt>辅助指标</dt><dd>'+g.aux.map(a=>a.name).join('、')+'</dd>':'')+'<dt>对照方式</dt><dd>'+RELEASE[p.rel].n+'</dd><dt>观察周期</dt><dd>培训结束后 '+(p.obsDays||30)+' 天(预计 '+obsEnd(p)+' 结束)</dd>'+(p.overReason?'<dt>在途超限原因</dt><dd>'+esc(p.overReason)+'</dd>':'')+'</dl></div>'+chgCard(p)+'</div>'
     +'<div><div class="card"><h3>数据从哪来、到哪去(本项目闭环进度)</h3>'+lineage(p)+'</div>'
     +'<div class="card"><h3>操作记录 <span class="hint">关键动作留痕</span></h3>'+((p.log||[]).length?p.log.slice(0,10).map(x=>'<div style="padding:4px 0;border-top:1px solid #f2f3f5;font-size:13px"><span class="hint">'+x.t+'</span> <b>'+esc(x.who)+'</b> '+esc(x.msg)+'</div>').join(''):'<div class="hint">暂无</div>')+'</div>'
     +'<div class="card"><h3>基本信息</h3><dl class="kv"><dt>培训类型</dt><dd>'+typeTxt(p)+'</dd><dt>任务下发周期</dt><dd>'+p.start+' ~ '+p.end+'</dd><dt>完成截止</dt><dd>'+(p.finishType===1?'下发后 '+p.finishDays+' 天':'指定日期 '+p.finishTime)+'</dd><dt>覆盖角色</dt><dd>'+p.cover.positions.join('、')+' · '+p.cover.tag+' · '+p.cover.regions.join('、')+((p.mids||[]).length?' · 指定 MID '+p.mids.length+' 人':'')+'</dd><dt>来源</dt><dd>'+(p.from?'课题池 '+p.from:'手工新增')+'</dd>'+(p.off?'<dt>线下班次培训</dt><dd>'+esc(p.offName)+'</dd><dt>报名类型</dt><dd>'+p.signup+(p.signup==='报名制'?' · 名额 '+p.quota+' · 截止 '+p.deadline+' · 审批人 '+esc(p.approver):' · 名单来源:'+(p.roster||'按覆盖角色自动生成')+' · 免审批')+'</dd>':'')+'</dl></div></div></div>';
  }
  if(t==='学习内容')b=srcBar('学习模块 → 任务节点,沿用现有学习项目结构;学堂内容选自「内容管理」(话术 / 课程),<b>提交时锁定当时的内容版本</b>(效果可比);内容后来改版,这里提示「可更新」,由项目负责人决定。清河大学内容引用外部链接。')+'<div class="tw"><table class="t"><tr><th>学习模块</th><th>任务节点</th><th>类型</th><th>内容</th><th>锁定版本</th><th>完成 / 通过要求</th></tr>'+p.nodes.map(n=>{const cc=n.contentId&&content(n.contentId);const upd=cc&&usableC(cc)&&cc.ver>(n.contentVer||1)&&!['已结项','已下线'].includes(p.status);return '<tr><td>'+esc(n.module)+'</td><td><b>'+n.t+'</b></td><td>'+n.rel+(n.offline?' <span class="tag pri">线下班次</span>':'')+'</td><td>'+(cc?'<a class="link" data-act="cView" data-id="'+cc.id+'">'+esc(n.name)+'</a>':esc(n.name))+'</td><td>'+(cc?'v'+(n.contentVer||1)+(upd?' <span class="tag warn">可更新到 v'+cc.ver+'</span> <button class="link" data-act="nodeUpd" data-id="'+p.id+'" data-n="'+n.id+'">更新</button><button class="link" data-act="cView" data-id="'+cc.id+'" data-tab="版本">看差异</button>':'')+(cc&&expState(cc)==='即将到期'?' <span class="tag warn">内容 '+expDays(cc)+' 天后到期</span>':'')+(cc&&cc.st==='已下架'?' <span class="tag err">内容已下线</span>':''):'<span class="hint">—</span>')+'</td><td>'+esc(n.sum||'-')+'</td></tr>'}).join('')+'</table></div>';
  if(t==='下发明细')b=tabIssue(p);
  if(t==='灰度对比')b=tabGray(p);
  if(t==='报名')b=tabSignup(p);
  if(t==='分班')b=tabClass(p);
  if(t==='培训结果')b=tabResult(p);
  if(t==='效果')b=p.eff?'<div class="card"><h3>效果概要</h3>'+progBar(p)+'<div style="margin-top:10px">'+goalTxt(p)+',当前 <b>'+p.cur+p.unit+'</b></div><div style="margin-top:10px"><button class="btn pri" data-act="go" data-p="effect" data-t="效果看板" data-ef="'+p.id+'">查看完整效果看板</button></div></div>':cta('还没有效果数据','项目当前处于「'+p.status+'」。效果数据在「评估中」阶段同步(北斗 BI / 汽车语料 / 清河大学)。','<button class="btn" data-act="ptab" data-v="概览">去概览推进阶段</button>');
  const estP=estN(p.aud)+(p.mids||[]).length;const appN=appsOf(p.id);
  const hero='<div class="hero-kpi" style="margin-bottom:18px"><div><div class="l">培训目标('+p.metric+')</div><div class="v">'+p.base+p.unit+' → <span style="color:var(--pri-d)">'+p.target+p.unit+'</span></div></div><div><div class="l">当前值</div><div class="v">'+(p.cur==null?'<span style="color:var(--mut)">待同步</span>':p.cur+p.unit)+'</div></div><div><div class="l">达成进度</div><div class="v">'+(p.cur==null?'-':pct(p)+'%')+'</div></div><div><div class="l">'+(p.off?'报名 / 名额':'覆盖人数(预估)')+'</div><div class="v">'+(p.off?cntOk(p.id)+' / '+p.quota:estP)+'</div></div></div>';
  return crumb('<a data-act="go" data-p="projects">学习任务</a> / '+esc(p.name))+'<div class="ph"><div><h2>'+esc(p.name)+' '+chip(p.status)+'</h2><div class="ph-meta"><span class="tag">'+typeTxt(p)+'</span><span class="tag">'+p.start+' ~ '+p.end+'</span><span class="tag">'+esc(p.owner)+'</span>'+(p.off?'<span class="tag '+(p.signup==='报名制'?'blue':'pri')+'">报名类型:'+p.signup+'</span>':'')+(p.from?'<span class="tag pri">来自课题 '+p.from+'</span>':'')+(p.gray?'<span class="tag '+(p.gray.stage==='灰度中'?'blue':p.gray.stage==='已全量'?'ok':'err')+'">分批灰度:'+p.gray.stage+'</span>':'')+'</div></div></div>'+hero+'<div class="tabs">'+tabs.map(x=>'<div class="tab '+(t===x?'on':'')+'" data-act="ptab" data-v="'+x+'">'+x+(x==='报名'&&appsOf(p.id).some(a=>a.status==='待审批')?' <span class="dot" style="display:inline-block">'+appsOf(p.id).filter(a=>a.status==='待审批').length+'</span>':'')+'</div>').join('')+'</div>'+b;
}
A.ptab=el=>{UI.ptab=el.dataset.v;render()};
A.nodeUpd=el=>{const p=proj(el.dataset.id);const n=p.nodes.find(x=>x.id===el.dataset.n);const c=content(n.contentId);const vv=c.vers.find(x=>x.v===c.ver);if(p.gray&&p.gray.stage==='灰度中')return toast('灰度中不建议更新内容,会破坏第一批与对照批的可比性;请先决策灰度','err');n.contentVer=c.ver;n.snap=JSON.parse(JSON.stringify(vv.snap));n.name=c.title;logp(p,'内容「'+c.title+'」更新到 v'+c.ver+'(项目负责人确认)');toast('已更新到 v'+c.ver,'ok');render()};
function chgCard(p){const r=p.chg;if(!r)return '';return '<div class="card"><h3>目标变更申请 '+chip(r.status==='待审批'?'待审批':r.status==='已通过'?'已通过':'已驳回')+'</h3><div style="font-size:13px">'+esc(r.by)+' 申请把目标值从 <b>'+r.from+p.unit+'</b> 改为 <b>'+r.val+p.unit+'</b>,原因:'+esc(r.reason)+'</div>'+(r.status==='待审批'?(UI.role.type==='hq'?'<div style="margin-top:8px"><button class="btn pri sm" data-act="chgDo" data-id="'+p.id+'" data-v="通过">通过</button> <button class="btn err sm" data-act="chgDo" data-id="'+p.id+'" data-v="驳回">驳回</button></div>':'<div class="hint" style="margin-top:6px">待总部培训部审批(切换身份可操作)</div>'):'')+'</div>'}
A.chgGoal=el=>{const p=proj(el.dataset.id);if(p.chg&&p.chg.status==='待审批')return toast('已有待审批的变更申请','err');openDlg('申请变更培训目标','<div class="hint" style="margin-bottom:8px">目标发布后已锁定,变更需总部培训部审批并留痕。基线和口径不可改,只能改目标值。当前目标 '+p.target+p.unit+',基线 '+p.base+p.unit+'。</div><div class="f"><label><b>*</b>新目标值(%)</label><div class="in"><input type="number" id="ng"></div></div><div class="f"><label><b>*</b>变更原因</label><div class="in"><textarea id="nr"></textarea></div></div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="chgOk" data-id="'+p.id+'">提交审批</button>')};
A.chgOk=el=>{const p=proj(el.dataset.id);const v=parseFloat($('#ng').value),r=$('#nr').value.trim();if(isNaN(v)||!r)return toast('请填写新目标值和变更原因','err');if(p.goal.main.dir==='低'?v>=p.base:v<=p.base)return toast('新目标值仍需优于基线 '+p.base+'%','err');
  p.chg={val:v,from:p.target,reason:r,by:UI.role.n.split(' · ')[0],status:'待审批'};logp(p,'提交目标变更申请:'+p.target+'% → '+v+'%,原因:'+r);closeDlg();toast('变更申请已提交,等待总部培训部审批','ok');render()};
A.chgDo=el=>{const p=proj(el.dataset.id);const ok=el.dataset.v==='通过';p.chg.status=ok?'已通过':'已驳回';if(ok){p.target=p.chg.val;p.goal.target=p.chg.val}logp(p,'目标变更申请'+el.dataset.v+(ok?',目标值改为 '+p.target+'%':''));toast('目标变更'+el.dataset.v,'ok');render()};
A.closeProj=el=>{const p=proj(el.dataset.id);const nContents=[...new Set(p.nodes.filter(n=>n.contentId&&content(n.contentId)&&content(n.contentId).script).map(n=>n.contentId))].length;
  openDlg('结项','<div class="f"><label><b>*</b>结论</label><div class="in" style="display:block">'
   +'<label style="display:block;margin-bottom:6px"><input type="radio" name="cr" value="复制" checked> <b>复制</b> <span class="hint">目标达成,沉淀好做法:带入本项目配置新建一个项目,选其他区域(仅总部培训部)</span></label>'
   +'<label style="display:block;margin-bottom:6px"><input type="radio" name="cr" value="回炉"> <b>回炉</b> <span class="hint">话术无效:把本项目用到的 '+nContents+' 条话术内容下线,重新生产</span></label>'
   +'<label style="display:block;margin-bottom:6px"><input type="radio" name="cr" value="转入店辅导"> <b>转入店辅导</b> <span class="hint">按本项目效果下钻中未达标的门店自动生成辅导工单(最多 3 家)</span></label>'
   +'<label style="display:block"><input type="radio" name="cr" value="终止"> <b>终止</b> <span class="hint">只结项,不触发其他动作</span></label></div></div><div class="f"><label><b>*</b>原因(一句话)</label><div class="in"><input type="text" id="cw" style="min-width:380px"></div></div>'+(p.eff&&smallNow(p)?'<div class="hint" style="margin-left:0;color:#b27900">样本不足,效果无法判断,不建议选「复制」。</div>':''),'<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="closeOk" data-id="'+p.id+'">确认结项</button>')};
A.closeOk=el=>{const w=$('#cw').value.trim();if(!w)return toast('结项必须写一句原因','err');const p=proj(el.dataset.id);p.status='已结项';p.closeRes=document.querySelector('input[name=cr]:checked').value;p.closeWhy=w;
  let extra='';
  if(p.closeRes==='转入店辅导'){const n=mkTickets(p,3,'项目结项转入');extra=',已生成 '+n+' 张辅导工单'}
  if(p.closeRes==='回炉'){const ids=[...new Set(p.nodes.filter(n=>n.contentId&&content(n.contentId)&&content(n.contentId).script).map(n=>n.contentId))];ids.forEach(id=>{const cc=content(id);cc.st='草稿';cc.ver++;chist(cc,'项目结项回炉,进入改版','项目「'+p.name+'」结项回炉:'+w)});extra=',已转改版 '+ids.length+' 条话术内容';if(ids.length)notify('项目「'+p.name+'」回炉:'+ids.length+' 条话术已下线,请到内容中心「改版」后重新提交审核')}
  logp(p,'结项,结论「'+p.closeRes+'」:'+w+extra);topicWriteback(p);closeDlg();
  if(p.closeRes==='复制'&&UI.role.type==='hq'){toast('已结项。已带入本项目配置,请选择要复制到的区域后提交','ok');formInit(null,p);const rest=allRegions.filter(r=>!p.aud.regions.includes(r));F.cover.regions=rest.length?rest:allRegions.slice();render();return}
  toast('已结项,结论:'+p.closeRes+extra+(p.closeRes==='复制'?'(区域老师无权跨区复制,已通知总部培训部)':''),'ok');render()};

/* ========== 报名审批(跨项目) ========== */
function approveApp(a){const p=proj(a.proj);a.status=cntOk(a.proj)<p.quota?'已通过':'候补';logp(p,'审批 '+pp(a.mid).name+':'+a.status+(a.status==='候补'?'(名额已满)':''));if(a.mid===ME.mid)notify('你报名的「'+p.name+'」审批结果:'+a.status);return a.status}
function pgApprovals(){
  const fp=UI.sel.fp||'',fs=UI.sel.fs===undefined?'待审批':UI.sel.fs;
  const aq=(UI.sel.aq||'').trim().toLowerCase();
  const rows=myApprovals().filter(a=>(!fp||a.proj===fp)&&(!fs||a.status===fs)&&(!aq||String((pp(a.mid)||{}).name||'').toLowerCase().includes(aq)||String(a.mid).includes(aq)||String((pp(a.mid)||{}).store||'').toLowerCase().includes(aq)));
  const apg=lstPage('apPage',rows,20);
  const ids=visibleP().filter(p=>p.off&&p.signup==='报名制');
  const cnt=s=>myApprovals().filter(a=>a.status===s).length;
  let head='<div class="ph"><h2>报名审批</h2><span class="hint">跨项目集中处理「报名制」项目的报名申请('+(UI.role.type==='region'?'区域老师只看到自己是审批人的项目':'总部培训部可看全部')+')</span></div>';
  if(!ids.length)return head+srcBar('申请来源:零售通学员在「我的培训」里点「立即报名」。申请对应的「报名课程」就是学习项目里的「线下班次培训」任务节点,在「学习任务 → 新增学习项目」里配置(报名方式选报名制)。')+cta('还没有可报名的培训项目','先「新增学习项目」,在学习模块的「报名任务配置」里选「线下班次培训」,报名方式选「报名制」。','<button class="btn pri" data-act="formNew">新增学习项目</button>');
  return head+srcBar('每条申请来自零售通学员的「立即报名」('+ids.length+' 个报名制项目在报名)。审批通过占名额,满额进候补。零售通右上角可切换学员提交报名。')
   +'<div class="grid g4" style="margin-bottom:14px"><div class="stat"><div class="l">待审批</div><div class="n" style="color:var(--pri)">'+cnt('待审批')+'</div></div><div class="stat"><div class="l">已通过</div><div class="n">'+cnt('已通过')+'</div></div><div class="stat"><div class="l">候补</div><div class="n">'+cnt('候补')+'</div></div><div class="stat"><div class="l">已驳回</div><div class="n">'+cnt('已驳回')+'</div></div></div>'
   +'<div class="fil"><select data-wc="afp"><option value="">全部项目</option>'+ids.map(p=>'<option value="'+p.id+'" '+(fp===p.id?'selected':'')+'>'+esc(p.name)+'</option>').join('')+'</select><select data-wc="afs">'+['','待审批','已通过','候补','已驳回'].map(s=>'<option value="'+s+'" '+(fs===s?'selected':'')+'>'+(s||'全部状态')+'</option>').join('')+'</select><span style="flex:1"></span><button class="btn" data-act="batchOk">批量通过</button><button class="btn err" data-act="batchNo">批量驳回</button></div>'
   +'<div class="fil"><input data-wc="aq" value="'+esc(UI.sel.aq||'')+'" placeholder="搜姓名 / MID / 门店" style="min-width:220px"><span style="flex:1"></span>'+lstCsvBtn(['申请人','MID','门店','报名项目','名额','状态'],[['申请人','MID','门店','报名项目','名额','状态']].concat(rows.map(a=>{const u=pp(a.mid)||{};return [u.name||'',a.mid,u.store||'',(proj(a.proj)||{}).name||'',(proj(a.proj)||{}).quota||'',a.status]})),'报名审批')+'</div>'
   +'<div class="tw"><table class="t"><tr><th><input type="checkbox" data-wc="asall"></th><th>申请人</th><th>MID</th><th>门店</th><th>报名项目</th><th>名额</th><th>申请来源 / 时间</th><th>状态</th><th>操作</th></tr>'
   +(rows.length?apg.rows.map(a=>{const p=proj(a.proj),u=pp(a.mid);return '<tr><td><input type="checkbox" data-wc="asel" value="'+a.id+'" '+((UI.sel.a||[]).includes(a.id)?'checked':'')+(a.status!=='待审批'?' disabled':'')+'></td><td>'+u.name+'</td><td>'+a.mid+'</td><td>'+u.store+'</td><td><a class="link" data-act="go" data-p="detail" data-id="'+p.id+'" data-pt="报名">'+esc(p.name)+'</a></td><td>'+cntOk(p.id)+' / '+(p.signup==='报名制'?p.quota:'-')+(p.signup==='报名制'&&cntOk(p.id)>=p.quota?' <span class="tag blue">已满</span>':'')+'</td><td>'+a.src+'<div class="hint">'+a.time+'</div></td><td>'+chip(a.status)+(a.reason?'<div class="hint">'+esc(a.reason)+'</div>':'')+'</td><td>'+(a.status==='待审批'?'<button class="link" data-act="ok" data-id="'+a.id+'">通过</button><button class="link err" data-act="no" data-id="'+a.id+'">驳回</button>':'-')+'</td></tr>'}).join(''):'<tr><td colspan="9" class="empty">没有符合条件的申请。申请来自零售通学员报名,可切到零售通提交。</td></tr>')+'</table></div>'+lstPager('apPage',apg);
}
A.afp=el=>{UI.sel.fp=el.value;render()};A.afs=el=>{UI.sel.fs=el.value;render()};
A.asel=el=>{const s=UI.sel.a||(UI.sel.a=[]);if(el.checked)s.push(el.value);else UI.sel.a=s.filter(x=>x!==el.value)};
A.asall=el=>{UI.sel.a=el.checked?myApprovals().filter(a=>a.status==='待审批').map(a=>a.id):[];render()};
A.ok=el=>{const a=S.apps.find(x=>x.id===el.dataset.id);const r=approveApp(a);toast(pp(a.mid).name+' '+(r==='已通过'?'审批通过':'名额已满,进入候补'),r==='已通过'?'ok':'');render()};
A.no=el=>{const a=S.apps.find(x=>x.id===el.dataset.id);openDlg('驳回报名 · '+pp(a.mid).name,'<div class="f"><label>驳回原因</label><div class="in"><textarea id="rj" placeholder="选填,学员会在零售通看到"></textarea></div></div>','<button class="btn" data-act="close">取消</button><button class="btn err" data-act="noOk" data-ids="'+a.id+'">确认驳回</button>')};
A.noOk=el=>{const reason=$('#rj').value.trim();el.dataset.ids.split(',').forEach(i=>{const a=S.apps.find(x=>x.id===i);a.status='已驳回';a.reason=reason;logp(proj(a.proj),'驳回 '+pp(a.mid).name+(reason?':'+reason:''));if(a.mid===ME.mid)notify('你报名的「'+proj(a.proj).name+'」被驳回'+(reason?':'+reason:''))});UI.sel.a=[];closeDlg();toast('已驳回','ok');render()};
A.batchOk=()=>{const s=UI.sel.a||[];if(!s.length)return toast('请先勾选待审批的申请','err');let ok=0,w=0;s.forEach(i=>{approveApp(S.apps.find(x=>x.id===i))==='已通过'?ok++:w++});UI.sel.a=[];toast('已通过 '+ok+' 人'+(w?',候补 '+w+' 人':''),'ok');render()};
A.batchNo=()=>{const s=UI.sel.a||[];if(!s.length)return toast('请先勾选待审批的申请','err');openDlg('批量驳回(共 '+s.length+' 人)','<div class="f"><label>驳回原因</label><div class="in"><textarea id="rj" placeholder="选填"></textarea></div></div>','<button class="btn" data-act="close">取消</button><button class="btn err" data-act="noOk" data-ids="'+s.join(',')+'">确认驳回</button>')};
A.revoke=el=>{const a=S.apps.find(x=>x.id===el.dataset.id);a.status='已驳回';a.reason='撤销资格';S.classes.forEach(k=>k.members=k.members.filter(m=>m!==a.mid));
  const w=appsOf(a.proj).filter(x=>x.status==='候补').sort((x,y)=>x.time<y.time?-1:1)[0];let msg='已撤销资格';
  if(w){w.status='已通过';msg+=',候补 '+pp(w.mid).name+' 已自动递补;'+(w.mid===ME.mid?'':'');if(w.mid===ME.mid)notify('你在「'+proj(w.proj).name+'」的候补已自动递补为已通过')}
  toast(msg,'ok');render()};

/* --- 报名 tab --- */
function tabSignup(p){
  const as=appsOf(p.id);
  return srcBar(p.signup==='报名制'?'申请来自零售通学员(对象范围:'+p.aud.regions.join('、')+(p.aud.level==='新人'?' 新人':'')+')。点下面「演示加速」可让名单内其余学员替你提交,更快看到候补等效果。':'指定范围:参训名单由培训部指定('+(p.roster||'按覆盖角色自动生成')+'),学员无需报名、无需审批,直接进参训名单。')
   +'<div class="card"><h3>报名设置 <span>'+(p.signup==='报名制'?'<button class="btn sm" data-act="simApply" data-id="'+p.id+'">演示加速:模拟其他学员在零售通报名</button> <button class="btn sm" data-act="urge">催报名</button>':'')+'</span></h3><dl class="kv"><dt>报名方式</dt><dd>'+p.signup+(p.signup==='报名制'?'(需要审批)':'')+'</dd>'+(p.signup==='报名制'?'<dt>名额</dt><dd>'+cntOk(p.id)+' / '+p.quota+'</dd><dt>报名截止</dt><dd>'+p.deadline+'</dd><dt>审批人</dt><dd>'+esc(p.approver)+'</dd>':'<dt>参训人数</dt><dd>'+as.length+' 人</dd>')+'</dl></div>'
   +(as.length?'<div class="tw"><table class="t"><tr><th>申请人</th><th>MID</th><th>门店</th><th>来源 / 时间</th><th>状态</th><th>操作</th></tr>'+as.map(a=>{const u=pp(a.mid);return '<tr><td>'+u.name+'</td><td>'+a.mid+'</td><td>'+u.store+'</td><td>'+a.src+'<div class="hint">'+a.time+'</div></td><td>'+chip(a.status)+(a.reason?'<div class="hint">'+esc(a.reason)+'</div>':'')+'</td><td>'+(a.status==='待审批'?'<button class="link" data-act="ok" data-id="'+a.id+'">通过</button><button class="link err" data-act="no" data-id="'+a.id+'">驳回</button>':a.status==='已通过'&&p.signup==='报名制'?'<button class="link err" data-act="revoke" data-id="'+a.id+'">撤销资格</button>':'-')+'</td></tr>'}).join('')+'</table></div>':cta('还没有人报名','学员在零售通「我的培训」里点「立即报名」后出现在这里。右上角可切到零售通。',''));
}
A.urge=()=>toast('已向未报名的目标学员发送报名提醒(零售通消息)','ok');
A.simApply=el=>{const p=proj(el.dataset.id);const todo=PEOPLE.filter(x=>eligible(p,x)&&!appsOf(p.id).some(a=>a.mid===x.mid)&&x.mid!==ME.mid).slice(0,6);
  if(!todo.length)return toast('名单内的学员都已报名','err');
  todo.forEach((x,i)=>S.apps.push({id:'A'+x.mid+p.id,proj:p.id,mid:x.mid,time:today+' 1'+i+':0'+i,status:'待审批',src:'零售通报名'}));
  toast('已模拟 '+todo.length+' 位学员在零售通提交报名','ok');render()};

/* --- 分班 tab --- */
const classOfIn=(pid,mid)=>S.classes.find(k=>k.proj===pid&&k.members.includes(mid));
function tabClass(p){
  const ks=S.classes.filter(k=>k.proj===p.id);
  const ok=appsOf(p.id).filter(a=>a.status==='已通过'&&!classOfIn(p.id,a.mid));
  const capSum=ks.reduce((s,k)=>s+k.cap,0);const okN=cntOk(p.id);
  return srcBar('班次由这里人工创建(时间、地点、讲师、容量);名额('+p.quota+')是报名上限,班次容量合计('+capSum+')决定能排下多少人;学员只能从「报名」里已通过的人中,按 MID 批量搜索后加入。发布后零售通学员才看到班次。本期不做分班规则,不做 Excel 导入。'+(ks.length&&capSum<okN?'<br><span style="color:#b27900">班次容量合计 '+capSum+' 小于已通过人数 '+okN+',还需再建班次。</span>':''))
   +'<div class="ph"><div>'+(p.classPub?'<span class="tag ok">分班结果已发布,学员可在零售通查看</span>':'<span class="tag warn">分班结果未发布</span>')+' <span class="hint">已通过未分班 <b>'+ok.length+'</b> 人</span></div><div><button class="btn" data-act="newClass" data-id="'+p.id+'">新建班次</button> <button class="btn pri" data-act="pubClass" data-id="'+p.id+'">'+(p.classPub?'重新发布':'发布分班结果')+'</button></div></div>'
   +(ks.length?ks.map(k=>'<div class="card"><h3>'+esc(k.name)+' <span><button class="btn sm" data-act="signCode" data-id="'+k.id+'">签到码</button> <button class="btn sm" data-act="editClass" data-id="'+k.id+'">编辑班次</button> <button class="btn sm" data-act="addMem" data-id="'+k.id+'">添加学员(按 MID)</button></span></h3><div class="hint" style="margin-bottom:8px">课程:'+esc(k.course)+' · '+k.date+' '+k.time+' · '+esc(k.place)+' · 讲师 '+esc(k.teacher)+' · 容量 '+k.members.length+' / '+k.cap+' · 签到方式:'+signMode(p)+'</div>'
   +(k.members.length?'<table class="t"><tr><th>学员</th><th>MID</th><th>门店</th><th>操作</th></tr>'+k.members.map(m=>{const u=pp(m);return '<tr><td>'+u.name+'</td><td>'+m+'</td><td>'+u.store+'</td><td><button class="link" data-act="moveMem" data-id="'+k.id+'" data-m="'+m+'">调班</button><button class="link err" data-act="rmMem" data-id="'+k.id+'" data-m="'+m+'">移出</button></td></tr>'}).join('')+'</table>':'<div class="empty">暂无学员</div>')+'</div>').join(''):cta('还没有班次','先「新建班次」,再按 MID 把已通过报名的学员加进去。'+(cntOk(p.id)===0?'<br><span class="hint err">目前还没有「已通过」的报名,请先在「报名审批」处理。</span>':''),''));
}
A.newClass=el=>{const p=proj(el.dataset.id);openDlg('新建班次','<div class="f"><label><b>*</b>班次名称</label><div class="in"><input type="text" id="kn" value="第 '+(S.classes.filter(k=>k.proj===p.id).length+1)+' 班"></div></div><div class="f"><label>班次培训</label><div class="in"><b>'+esc(p.offName)+'</b><span class="hint">来自项目「线下班次培训」节点</span></div></div><div class="f"><label><b>*</b>日期</label><div class="in"><input type="date" id="kd" value="'+p.start+'"><span class="hint">需在培训周期 '+p.start+' ~ '+p.end+' 内</span></div></div><div class="f"><label>时间</label><div class="in"><input type="text" id="kt" value="09:00-17:30"></div></div><div class="f"><label><b>*</b>地点</label><div class="in"><input type="text" id="kp" placeholder="如 北京·亦庄培训中心 3 层 301" style="min-width:380px"></div></div><div class="f"><label><b>*</b>讲师</label><div class="in"><input type="text" id="kk"></div></div><div class="f"><label><b>*</b>容量</label><div class="in"><input type="number" id="kc" value="30"></div></div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="newClassOk" data-id="'+p.id+'">创建</button>')};
A.newClassOk=el=>{const p=proj(el.dataset.id);const v=i=>$('#'+i).value.trim();if(!v('kn')||!v('kd')||!v('kp')||!v('kk')||!(+v('kc')>0))return toast('请填写班次名称、日期、地点、讲师和容量','err');if(v('kd')<p.start||v('kd')>p.end)return toast('班次日期需在培训周期内','err');
  logp(p,'新建班次「'+v('kn')+'」');S.classes.push({id:'K'+(S.classes.length+1),proj:p.id,name:v('kn'),course:p.offName,date:v('kd'),time:v('kt'),place:v('kp'),teacher:v('kk'),cap:+v('kc'),members:[]});closeDlg();toast('班次已创建','ok');render()};
A.addMem=el=>{UI.kid=el.dataset.id;openDlg('添加学员 · '+S.classes.find(k=>k.id===el.dataset.id).name,'<div class="f"><label>MID(批量)</label><div class="in" style="display:block"><textarea id="mids" placeholder="每行一个或用逗号分隔"></textarea><div class="hint">MID 在人员主数据中查找;只能添加本项目「已通过」且未分班的学员</div></div></div><div style="margin-left:0;margin-bottom:10px"><button class="btn" data-act="search">搜索</button> <button class="btn sm" data-act="fillMids">填入本项目已通过未分班的 MID</button></div><div id="sres"></div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="addOk">添加到班次</button>',true)};
A.fillMids=()=>{const m=appsOf(UI.projId).filter(a=>a.status==='已通过'&&!classOfIn(UI.projId,a.mid)).map(a=>a.mid);if(!m.length)return toast('没有已通过且未分班的学员','err');$('#mids').value=m.join(', ');A.search()};
A.search=()=>{const ids=[...new Set($('#mids').value.split(/[\s,，;；、]+/).filter(Boolean))];if(!ids.length)return toast('请输入 MID','err');
  UI.found=ids.map(m=>{const u=PEOPLE.find(x=>x.mid===m);if(!u)return{m,bad:'人员主数据中没有该 MID'};const a=appsOf(UI.projId).find(x=>x.mid===m);if(!a)return{m,u,bad:'未报名本项目'};if(a.status!=='已通过')return{m,u,bad:'报名状态:'+a.status};const k=classOfIn(UI.projId,m);if(k)return{m,u,bad:'已在「'+k.name+'」'};return{m,u}});
  $('#sres').innerHTML='<table class="t"><tr><th></th><th>MID</th><th>姓名</th><th>门店</th><th>可否添加</th></tr>'+UI.found.map(r=>'<tr><td><input type="checkbox" class="fc" value="'+r.m+'" '+(r.bad?'disabled':'checked')+'></td><td>'+r.m+'</td><td>'+(r.u?r.u.name:'-')+'</td><td>'+(r.u?r.u.store:'-')+'</td><td>'+(r.bad?'<span class="tag err">'+r.bad+'</span>':'<span class="tag ok">可添加</span>')+'</td></tr>').join('')+'</table>'};
A.addOk=()=>{const sel=[...document.querySelectorAll('.fc:checked')].map(x=>x.value);if(!sel.length)return toast('请先搜索并勾选学员','err');const k=S.classes.find(x=>x.id===UI.kid);if(k.members.length+sel.length>k.cap)return toast('超出班次容量(容量 '+k.cap+')','err');
  sel.forEach(m=>{k.members.push(m);ensureRes(UI.projId,m)});closeDlg();toast('已添加 '+sel.length+' 人到「'+k.name+'」','ok');render()};
A.moveMem=el=>{const ks=S.classes.filter(k=>k.proj===UI.projId&&k.id!==el.dataset.id);if(!ks.length)return toast('没有可调入的班次,请先新建班次','err');openDlg('调班 · '+pp(el.dataset.m).name,'<div class="f"><label>调入班次</label><div class="in"><select id="mk">'+ks.map(k=>'<option value="'+k.id+'">'+k.name+'('+k.members.length+'/'+k.cap+')</option>').join('')+'</select></div></div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="moveOk" data-id="'+el.dataset.id+'" data-m="'+el.dataset.m+'">确认调班</button>')};
A.moveOk=el=>{const to=S.classes.find(k=>k.id===$('#mk').value);if(to.members.length>=to.cap)return toast('目标班次已满','err');const from=S.classes.find(k=>k.id===el.dataset.id);from.members=from.members.filter(m=>m!==el.dataset.m);to.members.push(el.dataset.m);closeDlg();toast('已调到「'+to.name+'」','ok');if(proj(UI.projId).classPub&&el.dataset.m===ME.mid)notify('你的班次已调整为「'+to.name+'」');render()};
A.rmMem=el=>{const k=S.classes.find(x=>x.id===el.dataset.id);k.members=k.members.filter(m=>m!==el.dataset.m);toast('已移出班次','ok');render()};
A.pubClass=el=>{const p=proj(el.dataset.id);if(!S.classes.some(k=>k.proj===p.id&&k.members.length))return toast('还没有学员入班,无法发布','err');p.classPub=true;logp(p,'发布分班结果');
  S.classes.filter(k=>k.proj===p.id).forEach(k=>k.members.forEach(m=>{if(m===ME.mid)notify('「'+p.name+'」分班结果已发布:'+k.name)}));toast('分班结果已发布,学员可在零售通查看','ok');render()};
function ensureRes(pid,mid){const r=S.results[pid]||(S.results[pid]={});if(!r[mid])r[mid]={signed:false,online:null,offline:null,st:'待录入'}}

/* --- 培训结果 tab --- */
const fin=r=>{if(r.offline==null)return null;if(r.online==null)return r.offline;const w=S.cfg.wOnline/100;return Math.round(r.online*w+r.offline*(1-w))};
function tabResult(p){
  const mem=S.classes.filter(k=>k.proj===p.id).flatMap(k=>k.members.map(m=>({k,m})));
  if(!mem.length)return srcBar('成绩来自:线上成绩 ← 清河大学考试;签到 ← 零售通学员;线下成绩 ← 后台录入或导入。')+cta('还没有分班学员','先在「分班」tab 新建班次、添加学员并发布。','<button class="btn" data-act="ptab" data-v="分班">去分班</button>');
  const R=S.results[p.id]||{};
  return srcBar('签到 ← 零售通学员;线上成绩 ← 清河大学(点「同步」);线下成绩 ← 后台录入 / 导入。通过线 <b>'+S.cfg.pass+'</b> 分,总评 = 线上 '+S.cfg.wOnline+'% + 线下 '+(100-S.cfg.wOnline)+'%(均取自「配置中心」)。')
   +'<div class="ph"><div></div><div><button class="btn" data-act="syncQh">同步清河大学线上成绩</button> <button class="btn" data-act="impOpen">导入线下成绩</button> <button class="btn" data-act="saveScore">保存成绩</button> <button class="btn pri" data-act="grad">结业</button></div></div>'
   +'<div class="tw"><table class="t"><tr><th>学员</th><th>MID</th><th>班次</th><th>签到</th><th>线上成绩</th><th>线下成绩</th><th>总评</th><th>状态</th><th>操作</th></tr>'+mem.map(x=>{const r=R[x.m]||{};const f=fin(r);return '<tr><td>'+pp(x.m).name+'</td><td>'+x.m+'</td><td>'+esc(x.k.name)+'</td><td>'+(r.signed?'<span class="tag ok">已签到</span>':'<span class="tag">未签到</span><button class="link" data-act="signFor" data-m="'+x.m+'">补签</button>')+'</td><td>'+(r.online==null?'<span class="hint">待同步</span>':r.online)+'</td><td><input id="sc_'+x.m+'" type="number" min="0" max="100" style="width:70px;border:1px solid var(--bd);border-radius:4px;padding:3px 6px" value="'+(r.offline==null?'':r.offline)+'" '+(r.st==='已结业'?'disabled':'')+'></td><td>'+(f==null?'-':'<b>'+f+'</b>')+'</td><td>'+chip2(r.st)+'</td><td>'+(r.st==='已结业'?'-':'<button class="link" data-act="absent" data-m="'+x.m+'">标缺考</button>'+(['未通过','缺考'].includes(r.st)?'<button class="link" data-act="retake" data-m="'+x.m+'">补考</button>':''))+'</td></tr>'}).join('')+'</table></div>'+importLog(p)+evalSum(p);
}
function chip2(s){const m={'通过':'ok','已结业':'ok','未通过':'err','缺考':'err','补考中':'warn','待录入':''};return '<span class="tag '+(m[s]||'')+'">'+s+'</span>'}
function recalc(pid,m){const r=S.results[pid][m];if(r.st==='已结业'||r.st==='缺考')return;const f=fin(r);if(f==null){r.st=r.retake?'补考中':'待录入';return}r.st=f>=S.cfg.pass?'通过':'未通过';if(r.st==='未通过'&&r.retake&&r.retaken)notify('学员 '+pp(m).name+' 补考后仍未通过,已提示区域老师')}
A.signFor=el=>{S.results[UI.projId][el.dataset.m].signed=true;toast('已补签','ok');render()};
A.absent=el=>{const r=S.results[UI.projId][el.dataset.m];r.st='缺考';r.offline=null;toast('已标记缺考','ok');render()};
A.retake=el=>{const r=S.results[UI.projId][el.dataset.m];if(r.retaken)return toast('补考机会已用完,已提示区域老师','err');r.retake=true;r.retaken=false;r.offline=null;r.st='补考中';toast('已安排补考一次','ok');render()};
A.syncQh=()=>{const R=S.results[UI.projId];let n=0;Object.keys(R).forEach(m=>{if(R[m].online==null){R[m].online=70+hsh(m)%26;n++}});Object.keys(R).forEach(m=>recalc(UI.projId,m));toast(n?'已从清河大学同步 '+n+' 人的线上考试成绩':'线上成绩已是最新','ok');render()};
A.saveScore=()=>{const R=S.results[UI.projId];let bad=false;Object.keys(R).forEach(m=>{const el=$('#sc_'+m);if(!el)return;const v=el.value.trim();if(v!==''&&(isNaN(+v)||+v<0||+v>100))bad=true});
  if(bad)return toast('成绩需为 0~100 的数字','err');
  Object.keys(R).forEach(m=>{const el=$('#sc_'+m);if(!el||el.disabled)return;const v=el.value.trim();const r=R[m];if(v!==''){r.offline=+v;if(r.retake&&!r.retaken)r.retaken=true;if(r.st==='缺考')r.st='待录入'}else if(r.st!=='缺考')r.offline=null;recalc(UI.projId,m)});
  toast('成绩已保存','ok');render()};
A.grad=()=>{const R=S.results[UI.projId];const ok=Object.keys(R).filter(m=>R[m].st==='通过');if(!ok.length)return toast('没有「通过」状态的学员可结业,请先保存成绩','err');ok.forEach(m=>{R[m].st='已结业';R[m].signed=true;if(m===ME.mid)notify('你已结业,成绩已发布到零售通')});logp(proj(UI.projId),'结业 '+ok.length+' 人');toast('已结业 '+ok.length+' 人;未通过 / 缺考学员可安排补考','ok');render()};

/* --- 下发明细(沿用现有「查看下发明细」,按学员 × 任务节点)--- */
const tasksOf=p=>p.nodes.filter(n=>!n.offline);
const learnDone=(p,mid)=>{const t=tasksOf(p);const d=((S.learn[p.id]||{})[mid]||[]);return t.length>0&&t.every(x=>d.includes(x.id))};
function offState(p,mid){const a=appsOf(p.id).find(x=>x.mid===mid);if(!a)return '未报名';if(a.status!=='已通过')return a.status;const r=(S.results[p.id]||{})[mid];if(r&&r.st==='已结业')return '已结业';if(r&&r.signed)return '已签到';if(classOfIn(p.id,mid))return '已分班';return '已通过'}
function tabIssue(p){
  const el=PEOPLE.filter(x=>eligible(p,x));const ts=tasksOf(p);
  if(p.status==='未生效')return cta('项目未生效','到达项目下发周期开始时间后才会下发任务。','');
  return (p.gray&&p.gray.stage==='灰度中'?'<div class="tag blue" style="display:block;margin-bottom:10px;line-height:1.8;padding:6px 12px">分批灰度中:任务只下发给第一批 '+grayParts(p).A.length+' 人,其余 '+grayParts(p).B.length+' 人(对照批)暂不下发。观察期结束后在「灰度对比」里决定是否扩大到全量。</div>':'')+srcBar('任务按覆盖角色下发给学员(任务实例由现有「中央大脑」创建);学员完成情况来自零售通学员操作,这里列演示名单。线下班次培训列显示报名 / 分班 / 签到 / 结业状态。')
   +'<div class="tw"><table class="t"><tr><th>学员</th><th>MID</th><th>门店</th>'+ts.map(n=>'<th>'+esc(n.t)+'</th>').join('')+(p.off?'<th>线下班次培训</th>':'')+'<th>完成进度</th></tr>'+el.map(x=>{const d=((S.learn[p.id]||{})[x.mid]||[]);const done=ts.filter(n=>d.includes(n.id)).length;return '<tr><td>'+x.name+'</td><td>'+x.mid+'</td><td>'+x.store+'</td>'+ts.map(n=>'<td>'+(d.includes(n.id)?'<span class="tag ok">已完成</span>':'<span class="tag">未完成</span>')+'</td>').join('')+(p.off?'<td>'+chip2s(offState(p,x.mid))+'</td>':'')+'<td>'+done+' / '+ts.length+(p.off?' + 班次':'')+'</td></tr>'}).join('')+'</table></div>';
}
const chip2s=s=>'<span class="tag '+({'已结业':'ok','已签到':'ok','已分班':'blue','已通过':'ok','待审批':'warn','候补':'blue','已驳回':'err'}[s]||'')+'">'+s+'</span>';

A.aq=el=>{UI.sel.aq=el.value;render()};
