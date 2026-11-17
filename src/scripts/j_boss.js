/* ========== 老板视图:一屏回答「目标有没有达成、培训有没有用、哪里要决策」 ========== */
const BOSS_REG={ // 区域底表(外部数据:人事 + 北斗 BI,示意)
 '华北':{lock:23.4,ctl:21.2,full:62},'华东':{lock:24.9,ctl:22.0,full:71},'华南':{lock:22.1,ctl:21.6,full:58},'西南':{lock:20.8,ctl:20.9,full:49},'华中':{lock:21.5,ctl:20.7,full:55}};
const COMP=[ // 竞品攻防(语料 + 北斗 BI,示意):对比省份 / 战败省份 / 战败单 / 有解法的区域
 {n:'特斯拉 Model Y',cmp:23,lose:20,orders:486,fix:['华东'],fixNote:'江浙沪「价值锚点」话术战败率低 11pt',topic:'Model Y'},
 {n:'奔驰 GLC',cmp:19,lose:12,orders:312,fix:['华北','华东'],fixNote:'「同价位配置折算」开口率已从 31% 升到 44%',topic:'GLC'},
 {n:'问界 M8',cmp:17,lose:11,orders:274,fix:[],fixNote:'暂无区域有成熟解法',topic:'问界'},
 {n:'极氪 7X',cmp:12,lose:6,orders:168,fix:['华南'],fixNote:'华南价格战话术有效',topic:'极氪'}];
function bossData(){
  const P=S.projects,E=P.filter(p=>p.eff),done=E.filter(p=>!smallNow(p));
  const hit=E.filter(p=>!smallNow(p)&&metV(p,p.cur)).length;
  const nb=P.find(p=>p.type==='新人训'&&p.cur!=null);
  const nbRate=nb?nb.cur:77,nbTarget=nb?nb.target:85;
  const wins=E.filter(p=>!p.eff.noCtrl&&!smallNow(p)).map(p=>p.eff.did[1]-p.eff.did[3]);
  const lift=wins.length?(wins.reduce((a,b)=>a+b,0)/wins.length):null;
  const rp=S.reports||[],reportOk=rp.length?Math.round(rp.filter(r=>r.onTime).length/rp.length*100):0,topicOnTime=S.batches.length?100:0;
  const traceable=P.length?Math.round(P.filter(p=>p.eff&&!p.eff.noCtrl).length/P.length*100):0;
  const closed=P.filter(p=>p.status==='已结项').length,evald=P.filter(p=>['评估中','已结项'].includes(p.status)).length;
  return {P,E,done,hit,nbRate,nbTarget,lift,reportOk,topicOnTime,traceable,closeRate:evald?Math.round(closed/evald*100):0,hasNB:!!nb};
}
function kpi(l,v,sub,cls){return '<div style="padding:16px 18px;border-right:1px solid var(--bd)"><div class="hint">'+l+'</div><div style="font-size:26px;font-weight:650;letter-spacing:-.5px;margin-top:2px;'+(cls||'')+'">'+v+'</div><div class="hint">'+sub+'</div></div>'}
function scatter(pts){const w=560,h=300,pl=44,pb=34,pt=14,pr=14;const X=v=>pl+(v-30)/(100-30)*(w-pl-pr),Y=v=>pt+(h-pt-pb)*(1-(v-14)/(30-14));
  let s='<svg viewBox="0 0 '+w+' '+h+'" width="100%" style="max-width:'+w+'px"><rect x="'+X(70)+'" y="'+Y(19)+'" width="'+(X(100)-X(70))+'" height="'+(Y(14)-Y(19))+'" fill="#fff4d6" opacity=".7"/><text x="'+(X(70)+6)+'" y="'+(Y(14)-6)+'" font-size="11" fill="#a15c00">学得好 · 卖得差(背离)</text>';
  for(let v=14;v<=30;v+=4)s+='<line x1="'+pl+'" x2="'+(w-pr)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="#eee"/><text x="'+(pl-6)+'" y="'+(Y(v)+4)+'" font-size="10" fill="#999" text-anchor="end">'+v+'%</text>';
  for(let v=30;v<=100;v+=10)s+='<text x="'+X(v)+'" y="'+(h-12)+'" font-size="10" fill="#999" text-anchor="middle">'+v+'</text>';
  s+='<text x="'+(w/2)+'" y="'+(h-1)+'" font-size="11" fill="#667085" text-anchor="middle">学习掌握度(学习完成率 × 通过率)</text><text x="12" y="'+(h/2)+'" font-size="11" fill="#667085" transform="rotate(-90 12 '+(h/2)+')" text-anchor="middle">试驾→锁单率</text>';
  pts.forEach(p=>{s+='<circle cx="'+X(p.x)+'" cy="'+Y(p.y)+'" r="'+(p.bad?7:5)+'" fill="'+(p.bad?'#e5484d':'#ff6700')+'" opacity=".8"><title>'+p.store+' 掌握度 '+p.x+' 锁单 '+p.y+'%</title></circle>'});
  return s+'</svg>'}
function bossView(){
  const d=bossData();const regs=Object.keys(BOSS_REG).filter(r=>UI.role.type!=='region'||r===UI.role.region);
  /* 1 KPI */
  const k='<div class="hero-kpi" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px;background:#fff">'
   +kpi('新人首月开单率',d.nbRate+'%',d.hasNB?'目标 '+d.nbTarget+'% · 基线 77%':'基线 77% · 暂无新人训数据')
   +kpi('三层指标可查率',d.traceable+'%','能出对照的项目占比')
   +kpi('双周课题按时产出',d.topicOnTime+'%',S.batches.length+' 个批次已跑')
   +kpi('报告按时产出',d.reportOk+'%',(S.reports||[]).length+' 份已产出(周报 / 月报)')+'</div>';
  /* 2 趋势 + 目标达成榜 */
  const wk=[0,1,2,3,4,5,6,7];const nbTrend=wk.map(i=>+(72+i*0.7+(hsh('nb'+i)%10)/10).toFixed(1));
  const pickId=UI.sel.bossProj||'';
  const focusP=(pickId&&d.E.find(p=>p.id===pickId))||d.E.filter(p=>!smallNow(p)).sort((a,b)=>(b.eff.a||0)-(a.eff.a||0))[0]||d.E[0]||null;
  const focusPicker='<div class="filg" style="margin:0 0 8px"><div class="fi2"><label>看哪个项目</label><select data-wc="bossProj"><option value="">默认（样本最充分）</option>'+d.E.map(p=>'<option value="'+p.id+'" '+(pickId===p.id?'selected':'')+'>'+esc(p.name)+(smallNow(p)?'（样本不足）':'')+'</option>').join('')+'</select></div><div class="fi2" style="align-self:end"><span class="hint">共 '+d.E.length+' 个已同步效果的项目</span></div></div>';
  /* 曲线绑定所选项目的主指标量级：起点=基线，终点=当前值，对照从对照基线小幅波动 */
  const tBase=focusP&&focusP.base!=null?focusP.base:21.4, tCur=focusP&&focusP.cur!=null?focusP.cur:tBase+2.5;
  const cBase=focusP&&focusP.eff&&focusP.eff.did?focusP.eff.did[2]:tBase+0.8, cCur=focusP&&focusP.eff&&focusP.eff.did?focusP.eff.did[3]:cBase+0.4;
  const lockT=wk.map(i=>+(tBase+(tCur-tBase)*(i/7)+(hsh('lt'+i)%6-3)/10).toFixed(1));
  const lockC=wk.map(i=>+(cBase+(cCur-cBase)*(i/7)+(hsh('lc'+i)%4-2)/10).toFixed(1));
  const ps=d.E.map(p=>({p,v:pct(p)})).sort((a,b)=>b.v-a.v);
  const focus=focusP;
  const focusTitle=focus?('「'+focus.name+'」受训 vs 对照 · '+(focus.metric||'主指标')):'受训 vs 对照 · 试驾→锁单率';
  const realA=focus?Object.values(S.results[focus.id]||{}).filter(x=>x.st==='已结业').length:0;
  const focusScope=focus?('培训项目：「'+focus.name+'」（'+(focus.type||'')+'，'+(focus.start||'')+' ~ '+(focus.end||'')+'）'
    +'<br>受训组：覆盖范围内预估 '+(focus.eff.a||0)+' 人'+(realA?'，已结业 '+realA+' 人':'')
    +'<br>对照组：同岗位同期未参训'+'（'+(focus.eff.noCtrl?'本项目未设对照':('预估 '+(focus.eff.b||0)+' 人'))+'）'):'暂无可用项目';
  const row2=focusPicker+'<div class="grid g2" style="grid-template-columns:3fr 2fr"><div class="card"><h3>'+esc(focusTitle)+'（近 8 周）'+dsDemo('北斗 BI')+'</h3>'+demoNote('曲线为演示占位，不是真实读数')
   +'<div class="hint" style="margin:2px 0 6px;line-height:1.7;white-space:normal">'+focusScope+(focus?'<br>指标：'+(focus.metric||'主指标')+'，按周统计；仅展示相关性，不作因果结论。':'')+'</div>'
   +lineSvg([{n:focus?'受训（'+esc(focus.name)+'）':'受训',c:'#ff6700',d:lockT},{n:'对照（同岗位未参训）',c:'#4e8cff',d:lockC,dash:1}],{w:520,h:170})+'<div class="hint">效果数据不直接用于绩效考核或 PIP 判定。</div></div>'
   +'<div class="card"><h3>新人首月开单率趋势'+dsDemo('北斗 BI')+'</h3>'+demoNote('趋势为演示占位')+'<div class="hint" style="margin:2px 0 6px;line-height:1.7">人群：入职 ≤ 90 天且已完成新人训的顾问<br>口径：过训后 30 天内有锁单的人数 ÷ 已过训新人</div>'+lineSvg([{n:'开单率',c:'#12a36b',d:nbTrend}],{w:360,h:170})+'</div></div>';
  const row3='<div class="grid g2"><div class="card"><h3>项目目标达成榜</h3>'+(ps.length?hbars(ps.map(x=>[x.p.name,x.v,smallNow(x.p)?'#d0d5dd':x.v>=100?'var(--ok)':'var(--pri)']),120,'%')+'<div class="hint">灰色 = 样本不足(无法判断)。达成率 =(当前 − 基线)÷(目标 − 基线)。</div>':'<div class="empty">暂无项目进入评估</div>')+'</div>'
   +'<div class="card"><h3>需要你决策的项目</h3>'+(()=>{const L=d.P.filter(p=>p.status==='评估中');return L.length?'<table class="t"><tr><th>项目</th><th>现状</th><th>建议</th><th></th></tr>'+L.map(p=>'<tr><td>'+esc(p.name)+'</td><td>'+goalTxt(p)+'<div class="hint">当前 '+p.cur+p.unit+'</div></td><td>'+(smallNow(p)?'<span class="tag warn">样本不足</span> 延长观察期或并入下一批':metV(p,p.cur)?'<span class="tag ok">已达成</span> 复制到其他区域':'<span class="tag err">未达成</span> 回炉 / 转入店辅导')+'</td><td><button class="link" data-act="go" data-p="effect" data-t="复制与回炉">去处理</button></td></tr>').join('')+'</table>':'<div class="empty">没有待决策的项目</div>'})()+'</div></div>';
  /* 3 竞品攻防 */
  const comp='<div class="card"><h3>竞品攻防 · 谁在赢我们、哪里有解法'+dsDemo('汽车语料 + 北斗 BI')+'<span class="hint">全国 27 个省</span></h3><table class="t"><tr><th>竞品</th><th>对比省份</th><th>战败省份</th><th>战败单量</th><th>战败占比</th><th>有解法的区域</th><th>做法</th><th></th></tr>'
   +COMP.map(c=>'<tr><td><b>'+c.n+'</b></td><td>'+c.cmp+' / 27</td><td><b style="color:var(--err)">'+c.lose+'</b></td><td>'+c.orders+'</td><td><div class="bar" style="width:90px"><i style="width:'+Math.round(c.lose/c.cmp*100)+'%;background:var(--err)"></i></div></td><td>'+(c.fix.length?c.fix.map(r=>'<span class="tag ok">'+r+'</span>').join(''):'<span class="tag err">无</span>')+'</td><td style="max-width:260px">'+c.fixNote+'</td><td>'+(S.topics.some(t=>t.title.includes(c.topic))?'<button class="link" data-act="go" data-p="topics">看课题</button>':'<button class="link" data-act="go" data-p="topics" data-t="系统出题">去出题</button>')+'</td></tr>').join('')+'</table><div class="hint" style="margin-top:6px">取长补短:有解法的区域把话术沉淀为内容,由培训部复制到其他区域(项目结项选「复制」)。</div></div>';
  /* 4 学得好-卖得好 + 区域对比 */
  const stores=[...new Set(PEOPLE.map(x=>x.store))];
  const pts=stores.map(st=>{const x=40+hsh(st+'x')%58;let y=16+x*0.1+((hsh(st+'y')%90)-45)/10;y=Math.max(15,Math.min(29,+y.toFixed(1)));const bad=x>=72&&y<19.5;return{store:st,x,y,bad,reg:pp2(st)}}).filter(p=>UI.role.type!=='region'||p.reg===UI.role.region);
  const bads=pts.filter(p=>p.bad);
  const sc='<div class="card"><h3>学得好 – 卖得好'+ds('清河大学 + 北斗 BI')+'</h3>'+scatter(pts)+'<div class="hint">每个点是一家门店。右下角黄区:学习掌握度高但锁单低,可能卡在展厅 / 关单环节(该环节暂无数据),优先安排辅导。</div>'+(bads.length?'<div style="margin-top:8px">'+bads.map(p=>'<span class="tag err">'+p.store+'</span>').join('')+'</div>':'')+'</div>';
  const regT='<div class="card"><h3>区域对比</h3><table class="t nw"><tr><th>区域</th><th>销售顾问</th><th>学习完成率</th><th>锁单(受训)</th><th>锁单(未受训)</th><th>差值</th><th>在跑项目</th></tr>'+regs.map(r=>{const b=BOSS_REG[r];const n=S.projects.filter(p=>p.aud.regions.includes(r)&&!['已结项','已下线'].includes(p.status)).length;return '<tr><td><b>'+r+'</b></td><td>'+REG[r].all+'</td><td><div class="bar" style="width:80px"><i style="width:'+b.full+'%"></i></div>'+b.full+'%</td><td>'+b.lock+'%</td><td>'+b.ctl+'%</td><td style="color:'+(b.lock>=b.ctl?'var(--ok)':'var(--err)')+'">'+(b.lock>=b.ctl?'+':'')+(b.lock-b.ctl).toFixed(1)+'pt</td><td>'+n+'</td></tr>'}).join('')+'</table></div>';
  /* 5 新人开单闭环 + 预警 */
  const nbs=PEOPLE.filter(isNew).filter(p=>UI.role.type!=='region'||p.region===UI.role.region);
  const fun=[['入职新人',nbs.length*38],['完成入职培训',Math.round(nbs.length*38*0.93)],['首周电话量达标',Math.round(nbs.length*38*0.71)],['试驾排程达标',Math.round(nbs.length*38*0.58)],['首月已开单',Math.round(nbs.length*38*(d.nbRate/100)*0.82)]];
  const warn=nbs.filter(p=>hsh(p.mid)%3!==0).slice(0,6).map(p=>({p,why:hsh(p.mid)%2?'首周电话量低于目标 40%':'试驾排程 0 次(第 2 周)',day:p.hire}));
  const nbC='<div class="grid g2" style="grid-template-columns:2fr 3fr"><div class="card"><h3>新人开单闭环 · 漏斗'+dsDemo('人事 + 北斗 BI')+'</h3>'+demoNote('漏斗为按人数估算的演示值')+hbars(fun.map((f,i)=>[f[0],f[1],i===4?'var(--ok)':'var(--pri)']),fun[0][1],' 人')+'<div class="hint">用转化率倒推过程量:10% 转化 → 1000 组线索 / 100 组试驾,周度追踪电话量、试驾排程。</div></div>'
   +'<div class="card"><h3>新人过程预警 <span class="hint">异常 → 提醒区域老师介入(只做「建议关注」,不触发 PIP)</span>'+dsDemo('演示规则')+'</h3>'+demoNote('预警名单与原因由演示规则生成')+''+(warn.length?'<table class="t nw"><tr><th>新人</th><th>门店</th><th>入职</th><th>异常</th><th>状态</th><th></th></tr>'+warn.map(w=>{const k2=(S.warned||(S.warned={}))[w.p.mid];return '<tr><td>'+w.p.name+'</td><td>'+w.p.store+'</td><td>第 '+w.day+' 天</td><td>'+w.why+'</td><td>'+(k2?'<span class="tag ok">已通知 '+k2+'</span>':'<span class="tag warn">待介入</span>')+'</td><td>'+(k2?'':'<button class="link" data-act="warnTo" data-m="'+w.p.mid+'">通知区域老师</button>')+'</td></tr>'}).join('')+'</table>':'<div class="empty">暂无预警</div>')+'<div class="hint" style="margin-top:6px">效果数据只作「选样」和「验收」,不直接用于绩效考核或 PIP 判定;首月未开单是否启动 PIP,由区域老师人工确认。</div></div></div>';
  /* 6 内容与回路 + 培训部运营 */
  const up=S.contents.reduce((a,c)=>a+c.up,0),dn=S.contents.reduce((a,c)=>a+c.down,0);
  const mine=S.contents.filter(c=>!c.orig),gen=mine.filter(c=>c.srcTag).length;
  const used=S.contents.filter(c=>contentUse(c.id)>0),grayN=S.projects.filter(p=>p.gray&&p.gray.stage==='灰度中').length;
  const bad=S.contents.filter(c=>usableC(c)&&['点踩偏高','命中偏低'].includes(verdictC(c))).length;
  const cell=(l,v,s)=>'<div><div class="hint">'+l+'</div><div style="font-size:22px;font-weight:650">'+v+'</div>'+(s?'<div class="hint">'+s+'</div>':'')+'</div>';
  const ops='<div class="grid g2"><div class="card"><h3>内容回路:从问题到内容到反馈'+ds('内容管理 + 零售通 + 汽车语料')+'</h3><div class="grid g4" style="grid-template-columns:repeat(4,1fr);gap:14px">'
   +cell('内容管理',S.contents.length,'话术 '+S.contents.filter(c=>c.kind==='话术').length+' · 课程 '+S.contents.filter(c=>c.kind==='课程').length+'')
   +cell('已定稿 / 已上架',S.contents.filter(usableC).length,'已上架 '+S.contents.filter(isPub).length+' · 待上架 '+S.contents.filter(c=>pubOf(c)==='待上架').length)
   +cell('审核中 / 草稿',S.contents.filter(c=>c.st==='审核中').length+' / '+S.contents.filter(c=>c.st==='草稿').length,'待处理的生产任务')
   +cell('源自语料蒸馏',(mine.length?Math.round(gen/mine.length*100):0)+'%','新产出 '+mine.length+' 条中 '+gen+' 条')
   +cell('被学习任务引用',used.length,'其中灰度中项目 '+grayN+' 个')
   +'</div><div class="grid g4" style="grid-template-columns:repeat(4,1fr);gap:14px;margin-top:12px">'
   +cell('点赞 / 点踩',up+' / '+dn,'来自零售通学员')
   +cell('反馈异常',bad,'点踩偏高 / 命中偏低,待回炉')
   +cell('已从零售通下架',S.contents.filter(c=>pubOf(c)==='已下架').length,'内容仍保留,可重新上架')
   +cell('灰度决策',S.projects.filter(p=>p.gray&&p.gray.stage!=='灰度中').length+' 个已定','扩大到全量 '+S.projects.filter(p=>p.gray&&p.gray.stage==='已全量').length+' · 回炉 '+S.projects.filter(p=>p.gray&&p.gray.stage==='已回炉').length)
   +'</div><div class="grid g4" style="grid-template-columns:repeat(4,1fr);gap:14px;margin-top:12px">'
   +cell('资产复用率',reuseRate()+'%','被 2 个以上项目引用的内容占比')
   +cell('AI 初稿采纳率',(function(){const a=S.contents.map(aiAdopt).filter(x=>x!=null);return a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length)+'%':'—'})(),'人对 AI 初稿的保留程度')
   +cell('即将到期 / 已过期',S.contents.filter(c=>['即将到期','已过期'].includes(expState(c))).length,'到期自动下线')
   +cell('一线反馈待处理',S.feedback.filter(f=>f.st==='待处理').length,'点踩原因 + 纠错')
   +'</div><div class="hint" style="margin-top:8px">回路:课题 → agent 出初稿 → 审核入库 → 做成学习任务(新内容先灰度)→ 点赞 / 点踩 + 语料命中 → 好的留在资产库复制,无效的回炉。</div></div>'
   +'<div class="card"><h3>培训部运营度量</h3><table class="t"><tr><th>指标</th><th>当前</th></tr><tr><td>项目绑定目标比例</td><td>'+(S.projects.length?'100%':'—')+'</td></tr><tr><td>线下培训线上化比例</td><td>'+(S.projects.filter(p=>p.off).length?'100%(报名 / 分班 / 成绩均在系统内)':'—')+'</td></tr><tr><td>结项并给出结论的比例</td><td>'+d.closeRate+'%</td></tr><tr><td>课题 → 项目转化</td><td>'+(S.topics.length?Math.round(S.topics.filter(t=>['已采纳','已闭环'].includes(t.flow)).length/S.topics.length*100)+'%':'—')+'('+S.topics.filter(t=>['已采纳','已闭环'].includes(t.flow)).length+' / '+S.topics.length+')</td></tr><tr><td>辅导工单复测回升</td><td>'+(S.tickets.filter(t=>t.post).length?S.tickets.filter(t=>t.post).length+' 张已复测,均值 +'+(S.tickets.filter(t=>t.post).reduce((a,t)=>a+((t.post.value!=null?t.post.value:t.post)-t.pre),0)/S.tickets.filter(t=>t.post).length).toFixed(1)+'pt · 有效 '+S.tickets.filter(t=>t.post&&/有效|改善/.test(t.post.result||'')).length+' 张':'暂无复测')+'</td></tr></table></div></div>';
  const verdict=(function(){
  const judged=d.done.length,hit=d.hit,small=d.E.filter(smallNow).length;
  const decide=d.P.filter(p=>p.status==='评估中').length;
  return '<div class="grid g3" style="margin-bottom:14px">'
   +'<div class="card" style="margin:0"><div class="hint">目标有没有达成</div><div style="font-size:22px;font-weight:650">'+(judged?hit+' / '+judged:'—')+'</div><div class="hint">可判断项目中达标数'+(small?'；另有 '+small+' 个样本不足不计入':'')+'</div><span class="srcs" style="background:#eefaf3;color:#067647">实测</span></div>'
   +'<div class="card" style="margin:0"><div class="hint">培训有没有用</div><div style="font-size:22px;font-weight:650">'+(d.lift==null?'—':'+'+d.lift.toFixed(1)+'pt')+'</div><div class="hint">'+(d.lift==null?'样本不足，不下结论':'受训 vs 对照锁单差均值（'+judged+' 个项目）· 仅相关不作因果')+'</div><span class="srcs" style="background:#eefaf3;color:#067647">实测</span></div>'
   +'<div class="card" style="margin:0;border-color:#f3dc9b;background:#fffbf4"><div class="hint">需要你拍板</div><div style="font-size:22px;font-weight:650;color:#b54708">'+decide+'</div><div class="hint">评估中待选结项结论的项目</div>'+(decide?'<button class="btn sm pri" style="margin-top:6px" data-act="go" data-p="effect" data-t="复制与回炉">去处理</button>':'')+'</div></div>';
})();
return '<div class="src"><b>老板视图</b><span>关心「目标有没有达成、培训有没有用、哪里要决策」。<b>实测</b>来自系统内真实记录(项目 / 报名 / 结业 / 内容 / 反馈);<b>示意</b>为接入外部数据前的演示值,带橙色虚线标记,不能当作业务结论。</span></div>'
  +verdict+k+row2+row3+comp+'<div class="grid g2" style="grid-template-columns:1fr 1fr">'+sc+regT+'</div>'+nbC+ops;
}
A.warnTo=el=>{(S.warned||(S.warned={}))[el.dataset.m]=today;notify('已通知区域老师介入新人 '+pp(el.dataset.m).name+' 的过程异常');toast('已通知区域老师','ok');render()};

A.bossProj=el=>{UI.sel.bossProj=el.value;render()};
