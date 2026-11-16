/* ========== 分批灰度:灰度就是学习项目里的「分批下发 + 对照批」,复用对照方式 A ========== */
const grayBase=p=>PEOPLE.filter(x=>eligibleRaw(p,x));
function grayParts(p){const base=grayBase(p);return {A:base.filter(x=>p.gray.mids.includes(x.mid)),B:base.filter(x=>!p.gray.mids.includes(x.mid))}}
function fbOfProj(p){const out={};Object.keys(S.likes||{}).forEach(k=>{const a=k.split('|');if(a[0]===p.id)(out[a[2]]||(out[a[2]]=[])).push(S.likes[k])});return out}
const grayEnd=p=>addDays(p.gray.startedAt,p.gray.days);
const grayLeft=p=>Math.round((new Date(grayEnd(p)+'T00:00:00')-D0)/864e5);
function grayStats(p){
  const {A,B}=grayParts(p);const fb=fbOfProj(p);
  const done=A.filter(x=>learnDone(p,x.mid)).length,doneRate=A.length?Math.round(done/A.length*100):0;
  let up=0,dn=0;A.forEach(x=>(fb[x.mid]||[]).forEach(v=>v>0?up++:dn++));const dis=up+dn?dn/(up+dn)*100:0;
  const scr=p.nodes.some(n=>n.contentId&&(content(n.contentId)||{}).script);
  const hitA=34+hsh(p.id+'a')%12,hitB=22+hsh(p.id+'b')%8;
  const m=p.goal.main,lo=m.dir==='低',pl=p.target-p.base;
  const vA=+(p.base+pl*(0.45+(hsh(p.id+'va')%20)/100)).toFixed(1),vB=+(p.base+(lo?-0.6:0.6)+(hsh(p.id+'vb')%10)/10*(lo?-1:1)).toFixed(1);
  const checks=[['学习完成率 ≥ 60%',A.length?doneRate>=60:null,doneRate+'%'],['点踩率 < '+S.cfg.dislikeTh+'%',up+dn?dis<S.cfg.dislikeTh:null,up+dn?dis.toFixed(0)+'%':'暂无反馈']];
  if(scr)checks.push(['语料命中率较对照批提升 ≥ 3pt',S.cfg.asrNow<S.cfg.asr?null:hitA-hitB>=3,S.cfg.asrNow<S.cfg.asr?'数据暂缺':'+'+(hitA-hitB)+'pt']);
  checks.push(['主指标朝目标方向变化',lo?vA<vB:vA>vB,(vA-vB>=0?'+':'')+(vA-vB).toFixed(1)+'pt']);
  const bad=checks.some(c=>c[1]===false),wait=checks.some(c=>c[1]===null);
  return {A,B,done,doneRate,up,dn,dis,scr,hitA,hitB,vA,vB,checks,verdict:bad?'back':wait?'wait':'go'}}
function tabGray(p){
  const g=p.gray,s=grayStats(p),m=p.goal.main;const left=grayLeft(p);const on=g.stage==='灰度中';
  const stag=on?'<span class="tag blue">灰度中</span>':g.stage==='已全量'?'<span class="tag ok">已扩大到全量</span>':'<span class="tag err">已回炉</span>';
  const vd={go:'<span class="tag ok" style="font-size:13px">建议:扩大到全量</span>',back:'<span class="tag err" style="font-size:13px">建议:回炉修改内容</span>',wait:'<span class="tag warn" style="font-size:13px">数据不足:继续观察</span>'}[s.verdict];
  const fb=fbOfProj(p);const rem=g.reminded||[];
  let h=srcBar('灰度不是单独的评审模块,而是学习项目的一种下发方式:<b>第一批(评审团 / 试点)先收到任务,对照批暂不下发</b>(对照方式 A「分批推广」)。比较的是完成、点赞 / 点踩(零售通学员)、语料命中率和主指标(汽车语料 / 北斗 BI,示意值);通过后扩大到全量,不通过回炉改内容。')
   +'<div class="card"><h3>灰度状态 '+stag+'</h3><div class="grid g4"><div><div class="hint">第一批(评审团 / 试点)</div><b style="font-size:20px">'+s.A.length+' 人</b></div><div><div class="hint">对照批</div><b style="font-size:20px">'+s.B.length+' 人</b><div class="hint">观察期内不下发</div></div><div><div class="hint">观察期</div><b style="font-size:20px">'+g.days+' 天</b><div class="hint">'+g.startedAt+' ~ '+grayEnd(p)+'</div></div><div><div class="hint">'+(on?'剩余':'状态')+'</div><b style="font-size:20px;color:'+(on&&left<=0?'var(--err)':'inherit')+'">'+(on?(left>0?left+' 天':'已满,待决策'):g.stage==='已全量'?g.fullAt:g.backAt)+'</b><div class="hint">到期未决策:'+g.onTimeout+'</div></div></div></div>'
   +'<div class="grid g2" style="grid-template-columns:3fr 2fr;align-items:start"><div class="card"><h3>第一批 vs 对照批</h3><table class="t"><tr><th>指标</th><th>第一批</th><th>对照批</th><th>来源</th></tr>'
   +'<tr><td>人数</td><td>'+s.A.length+'</td><td>'+s.B.length+'</td><td>'+ds('人员主数据')+'</td></tr>'
   +'<tr><td>学习完成率</td><td>'+s.doneRate+'%('+s.done+' / '+s.A.length+')</td><td><span class="hint">未下发</span></td><td>'+ds('零售通学员操作')+'</td></tr>'
   +'<tr><td>点赞 / 点踩</td><td>👍 '+s.up+' / 👎 '+s.dn+'</td><td><span class="hint">—</span></td><td>'+ds('零售通学员操作')+'</td></tr>'
   +(s.scr?'<tr><td>话术语料命中率</td><td>'+(S.cfg.asrNow<S.cfg.asr?'<span class="tag warn">数据暂缺</span>':s.hitA+'%')+'</td><td>'+(S.cfg.asrNow<S.cfg.asr?'—':s.hitB+'%')+'</td><td>'+ds('汽车语料')+'</td></tr>':'')
   +'<tr><td>'+esc(m.name)+'</td><td>'+s.vA+'%</td><td>'+s.vB+'%</td><td>'+ds(m.src)+'</td></tr></table><div class="hint" style="margin-top:6px">命中率、主指标为同步到当前的示意值;完成率与点赞 / 点踩是零售通学员实际操作的结果。样本很小,只用于「要不要扩大」的判断,不进入效果结论。</div></div>'
   +'<div class="card"><h3>通过标准 '+vd+'</h3>'+s.checks.map(c=>'<div class="chk '+(c[1]===true?'ok':c[1]===false?'must':'rec')+'"><b>'+(c[1]===true?'✓':c[1]===false?'!':'·')+'</b><span>'+c[0]+' <span class="hint">当前 '+c[2]+'</span></span></div>').join('')
   +'<div class="hint" style="margin-top:6px">标准取自「配置中心 → 阈值与口径」(点踩率预警线)和灰度规则;不通过不会自动动作,由负责人决定。</div></div></div>'
   +'<div class="card"><h3>第一批名单 <span class="hint">任务有截止,未完成的可以催办</span></h3><table class="t"><tr><th>姓名</th><th>门店</th><th>学习进度</th><th>反馈</th><th>催办</th></tr>'+s.A.map(x=>{const d=((S.learn[p.id]||{})[x.mid]||[]);const ts=tasksOf(p);const f=fb[x.mid];return '<tr><td>'+x.name+'</td><td>'+x.store+'</td><td>'+(learnDone(p,x.mid)?'<span class="tag ok">已完成</span>':d.length+' / '+ts.length)+'</td><td>'+(f?(f[0]>0?'👍 有用':'👎 没用'):'<span class="hint">未反馈</span>')+'</td><td>'+(rem.includes(x.mid)?'<span class="tag blue">已催办</span>':learnDone(p,x.mid)?'':'<span class="hint">—</span>')+'</td></tr>'}).join('')+'</table></div>';
  if(on){const un=s.A.filter(x=>!learnDone(p,x.mid)&&!rem.includes(x.mid)).length;
    h+='<div class="card" style="border-color:var(--pri)"><h3>决策</h3><button class="btn" data-act="gRemind" data-id="'+p.id+'" '+(un?'':'disabled')+'>催办未完成('+un+' 人)</button> <button class="btn pri" data-act="gFull" data-id="'+p.id+'">扩大到全量</button> <button class="btn err" data-act="gBack" data-id="'+p.id+'">回炉修改内容</button> <button class="btn" data-act="gExpire" data-id="'+p.id+'">模拟观察期满(演示)</button><div class="hint" style="margin-top:6px">扩大到全量:其余 '+s.B.length+' 人(对照批)也收到任务,灰度结束;回炉:本项目用到的新内容下线回炉、项目下线。'+(s.verdict==='back'?' <b style="color:var(--err)">当前有未通过的标准,建议先回炉。</b>':'')+'</div></div>'}
  else h+='<div class="card"><h3>决策记录</h3>'+(g.decision?esc(g.decision):'—')+'</div>';
  return h}
A.gRemind=el=>{const p=proj(el.dataset.id);const s=grayStats(p);const un=s.A.filter(x=>!learnDone(p,x.mid)&&!(p.gray.reminded||[]).includes(x.mid));p.gray.reminded=(p.gray.reminded||[]).concat(un.map(x=>x.mid));logp(p,'催办灰度第一批未完成 '+un.length+' 人:'+un.map(x=>x.name).join('、'));notify('已催办项目「'+p.name+'」灰度第一批 '+un.length+' 人(复用学习任务催办)');toast('已催办 '+un.length+' 人','ok');render()};
function grayFull(p,auto){p.gray.stage='已全量';p.gray.fullAt=today;p.gray.decision=today+' '+(auto?'观察期满,达标,系统自动':UI.role.name)+'扩大到全量;其余 '+grayParts(p).B.length+' 人开始收到任务';logp(p,p.gray.decision,auto?'系统':undefined);notify('项目「'+p.name+'」灰度通过,已扩大到全量('+grayParts(p).B.length+' 人新增下发)')}
A.gFull=el=>{const p=proj(el.dataset.id);const s=grayStats(p);
  const go=()=>{closeDlg();grayFull(p);toast('已扩大到全量,其余人员开始收到任务','ok');render()};
  if(s.verdict==='go'){go();return}
  openDlg('扩大到全量','<div>灰度标准'+(s.verdict==='back'?'<b style="color:var(--err)">有未通过项</b>':'数据还不足')+':</div>'+s.checks.map(c=>'<div class="chk '+(c[1]===true?'ok':c[1]===false?'must':'rec')+'"><b>'+(c[1]===true?'✓':c[1]===false?'!':'·')+'</b><span>'+c[0]+' · '+c[2]+'</span></div>').join('')+'<div class="hint" style="margin-top:8px">仍要扩大吗?这个决定会记入项目操作记录。</div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="gFullOk" data-id="'+p.id+'">仍然扩大到全量</button>')};
A.gFullOk=el=>{const p=proj(el.dataset.id);closeDlg();grayFull(p);toast('已扩大到全量','ok');render()};
A.gBack=el=>openDlg('回炉修改内容','<div class="f"><label><b>*</b>原因</label><div class="in"><input type="text" id="gbk" style="min-width:360px" placeholder="如:点踩偏高,一线反馈“听不懂”"></div></div><div class="hint">本项目里首次使用的新内容会下线回炉(可在内容管理「回炉修改」后重提审核),项目下线;对照批没有受到任何影响。</div>','<button class="btn" data-act="close">取消</button><button class="btn err" data-act="gBackOk" data-id="'+el.dataset.id+'">确认回炉</button>');
A.gBackOk=el=>{const r=($('#gbk').value||'').trim();if(!r)return toast('请填写原因','err');const p=proj(el.dataset.id);const ids=[...new Set(p.nodes.filter(n=>n.contentId).map(n=>n.contentId))].filter(id=>content(id)&&!content(id).orig&&usableC(content(id)));
  ids.forEach(id=>{const c=content(id);c.st='草稿';c.ver++;chist(c,'灰度未通过,进入改版','灰度项目「'+p.name+'」未通过:'+r);const t=c.topic&&topic(c.topic);if(t)thist(t,meShort(),'内容需改版','「'+c.title+'」灰度未通过:'+r)});
  p.gray.stage='已回炉';p.gray.backAt=today;p.gray.decision=today+' '+UI.role.name+'回炉:'+r;p.status='已下线';logp(p,'灰度未通过,回炉:'+r+';下线内容 '+ids.length+' 条,项目下线');notify('项目「'+p.name+'」灰度未通过,内容已回炉');closeDlg();toast('已回炉:内容下线 '+ids.length+' 条,项目下线','ok');render()};
A.gExpire=el=>{const p=proj(el.dataset.id);p.gray.startedAt=addDays(today,-p.gray.days);const s=grayStats(p);logp(p,'观察期已满(演示:模拟时间流逝)',UI.role.name);
  if(p.gray.onTimeout==='达标则自动扩大全量'&&s.verdict==='go'){grayFull(p,true);toast('观察期满且达标:已自动扩大到全量','ok')}
  else{notify('项目「'+p.name+'」灰度观察期已满,待决策('+(p.gray.onTimeout==='达标则自动扩大全量'?'未达标,不自动扩大':'已提醒负责人')+')');toast(p.gray.onTimeout==='达标则自动扩大全量'?'观察期满但未达标,不自动扩大,已提醒负责人':'观察期满,已提醒负责人决策','ok')}
  render()};

/* ---------- 新增学习项目表单里的「下发方式」 ---------- */
const grayPool=()=>PEOPLE.filter(x=>F.cover.regions.includes(x.region)&&(F.cover.tag==='新人'?isNew(x):true));
const grayMids=()=>String(F.gray.mids||'').split(/[\s,，;；、]+/).filter(Boolean);
function newContentIds(){const ids=[];F.stages[0].modules.forEach(m=>m.nodes.forEach(n=>{if(n.rel!=='无'&&n.cfg&&n.cfg.ref&&content(n.cfg.ref)){const c=content(n.cfg.ref);if(!c.orig&&contentUse(c.id)===0)ids.push(c.id)}}));return [...new Set(ids)]}
function formGray(sec){
  const g=F.gray,pool=grayPool(),ms=grayMids();const inPool=ms.filter(m=>pool.some(x=>x.mid===m));const bad=ms.filter(m=>!pool.some(x=>x.mid===m));const nc=newContentIds();
  let b='<div class="rels" style="margin-bottom:12px"><span class="'+(!g.on?'on':'')+'" data-act="fgray" data-v="0">一次性全量下发</span><span class="'+(g.on?'on':'')+'" data-act="fgray" data-v="1">分批灰度 <b style="color:var(--pri)">新</b></span></div>';
  if(nc.length&&!g.on)b+='<div class="tpl" style="margin-bottom:12px"><span style="font-size:20px">💡</span><div style="flex:1">本项目用了 <b>'+nc.length+'</b> 条首次使用的新内容('+nc.map(id=>esc(content(id).title)).join('、')+'),还没被一线验证过。<b>建议先分批灰度</b>:第一批试用,看反馈和命中率,再扩大。</div><button class="btn sm pri" data-act="fgray" data-v="1">改为分批灰度</button></div>';
  if(!g.on)return sec('gray','5','下发方式','灰度 = 分批下发 + 对照批',b+'<div class="hint">覆盖人群一次性收到任务(演示名单内 '+pool.length+' 人)。验证新内容时选「分批灰度」。</div>');
  const ctrl=pool.length-inPool.length;
  b+='<div class="fgrid"><div class="fld full"><label><b>*</b>第一批人群(评审团 / 试点)</label><div class="pill-row" style="margin-bottom:8px"><button class="btn sm" data-act="gpick" data-m="senior">选 6 名资深顾问(入职 > 1 年)</button><button class="btn sm" data-act="gpick" data-m="store">每店抽 1 人</button><button class="btn sm" data-act="gpick" data-m="clear">清空</button></div><textarea data-f="gray.mids" placeholder="MID,逗号或空格分隔;评审团由创建人选人(销冠 / 省分培训老师 / 总部零售运营等)">'+esc(g.mids)+'</textarea><div class="fh">'+(inPool.length?'已选 '+inPool.length+' 人:'+inPool.slice(0,8).map(m=>pp(m).name).join('、')+(inPool.length>8?'…':''):'从覆盖人群里选')+(bad.length?' <span style="color:var(--err)">不在覆盖人群:'+bad.join('、')+'</span>':'')+'</div></div>'
   +'<div class="fld"><label><b>*</b>观察天数</label><input type="number" data-f="gray.days" value="'+esc(g.days)+'" style="width:130px"><div class="fh">从项目开始日算起;期间第一批要完成任务并给反馈,任务有截止并可催办(复用学习任务)</div></div>'
   +'<div class="fld"><label>到期未决策</label><select data-wc="fset" data-f="gray.onTimeout">'+['提醒我决策','达标则自动扩大全量'].map(o=>'<option '+(g.onTimeout===o?'selected':'')+'>'+o+'</option>').join('')+'</select><div class="fh">不达标永远不会自动扩大,只会提醒</div></div>'
   +'<div class="fld full"><label>对照批</label><div style="background:#f7f8fa;border-radius:10px;padding:10px 14px;line-height:1.8">覆盖人群里除第一批外的 <b>'+ctrl+'</b> 人,观察期内<b>不下发</b>,作为对照;对照方式自动采用「<b>A. 分批推广</b>」。扩大到全量后他们才收到任务。</div></div>'
   +'<div class="fld full"><label>通过标准(灰度结束时对比)</label><div class="hint" style="line-height:1.9">学习完成率 ≥ 60% · 点踩率 &lt; '+S.cfg.dislikeTh+'%(配置中心)· 话术内容:语料命中率较对照批提升 ≥ 3pt · 主指标朝目标方向变化。<br>不通过不自动动作,由你决定扩大或回炉。</div></div></div>';
  return sec('gray','5','下发方式','灰度 = 分批下发 + 对照批',b)}
A.fgray=el=>{F.gray.on=el.dataset.v==='1';if(F.gray.on)F.goal.rel='A';else if(F.goal.rel==='A'&&S.cfg.typeDef[tk(F.type,F.sub)].rel!=='A')F.goal.rel=S.cfg.typeDef[tk(F.type,F.sub)].rel;render();if(F.gray.on)toast('已切到分批灰度,对照方式自动改为 A. 分批推广','ok')};
A.gpick=el=>{const pool=grayPool();let ids=[];const m=el.dataset.m;
  if(m==='senior')ids=pool.filter(x=>x.hire>365).slice(0,6).map(x=>x.mid);
  if(m==='store'){const seen={};pool.forEach(x=>{if(!seen[x.store])seen[x.store]=x.mid});ids=Object.values(seen)}
  if(m!=='clear'&&ids.length>=pool.length)ids=ids.slice(0,Math.max(1,pool.length-1));
  F.gray.mids=ids.join(', ');if(m!=='clear'&&!ids.length)toast('覆盖人群里没有符合条件的人','err');render()};
