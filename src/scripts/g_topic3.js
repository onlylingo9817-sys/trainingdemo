/* ---------- 问题详情 / 分析页 ---------- */
function weeksSeries(t){const s=t.stats;return Array.from({length:8},(_,i)=>Math.max(1,Math.round(s.sess/8*(1+(s.trend/100)*(i-3.5)/1.2))))}
function pgTopicDetail(){
  const t=topic(UI.tid);if(!t){UI.page='topics';return pgTopics()}
  const s=t.stats,g=t.sug;
  let left='<div class="card"><h3>基本信息</h3><dl class="kv"><dt>来源</dt><dd><span class="tag '+({'系统出题':'pri','自主提出':'blue','对外洞察':'warn'}[t.src])+'">'+t.src+'</span> '+(t.batch?'批次 '+t.batch+' · ':'')+esc(t.by)+' · '+t.time+'</dd><dt>问题描述</dt><dd>'+esc(t.desc||'-')+'</dd><dt>场景 / 对象</dt><dd>'+t.scene+' / '+esc(t.obj)+'</dd><dt>涉及区域</dt><dd>'+rgTxt(g.regions)+'</dd><dt>优先级</dt><dd>'+pchip(t)+' 分 '+prio(t).s+'(会话数 ÷ 30 + 门店数 ÷ 6 + 近 4 周增幅 × 1.5)</dd>'+(t.merged&&t.merged.length?'<dt>已补充</dt><dd>'+t.merged.length+' 条洞察并入证据</dd>':'')+'</dl></div>';
  let ai='<div class="card"><h3>AI 分析 '+chip(t.st)+' '+(t.ev?chip(t.ev):'')+'<span class="hint">来源:汽车语料 + agent</span></h3>';
  if(t.st==='分析中')ai+='<div class="hint">agent 正在用语料验证问题是否成立、对比销冠与一般做法……可离开页面,完成后通知你。</div>';
  else if(t.st==='分析失败')ai+='<div style="color:var(--err)">AI 分析失败(agent 超时),可重试。不影响你直接用它建学习项目。</div>';
  else{
   ai+='<div class="grid g4" style="margin-bottom:10px"><div class="stat"><div class="l">相关会话</div><div class="n">'+s.sess+'</div></div><div class="stat"><div class="l">涉及门店</div><div class="n">'+s.stores+'</div></div><div class="stat"><div class="l">涉及省份</div><div class="n">'+s.prov+'</div></div><div class="stat"><div class="l">近 4 周</div><div class="n" style="color:'+(s.trend>0?'var(--err)':'var(--ok)')+'">'+(s.trend>0?'↑':'↓')+Math.abs(s.trend)+'%</div></div></div>'
    +'<div class="hint" style="margin-bottom:4px">近 8 周会话趋势</div>'+lineSvg([{n:'会话数',c:'#ff6900',d:weeksSeries(t)}],{w:440,h:130});
   if(t.ev==='不足')ai+='<div class="tag warn" style="display:block;margin-top:8px;line-height:1.7;padding:4px 10px">证据偏少(低于出题阈值:会话 ≥ '+S.cfg.topicSess+'、门店 ≥ '+S.cfg.topicStores+'),仅供参考。</div>';
   else{const q=UI.sel.q&&UI.sel.q[t.id];
    ai+='<h4>销冠与一般做法的差异</h4><div>销冠先说“同价位下少了哪些配置”,再给折算;一般顾问只报价格。</div><h4>归因线索:话术缺失为主</h4>'+(q?'<div style="background:#f7f8fa;border-radius:6px;padding:8px 12px;line-height:1.8">“你这个和竞品比,贵在哪?”(138****0000)→ 顾问:“我们价格就是这样。”<br>“配置差在哪你能说下吗?”(139****1111)→ 顾问:“都差不多。”<div class="hint">原话已脱敏;本次查看已留痕</div></div>':'<button class="btn sm" data-act="tQuotes" data-id="'+t.id+'">查看代表性原话(留痕)</button> <span class="hint">原话查看会记录</span>')
    +'<h4>建议怎么培训</h4><div>培训类型 <b>'+g.type+(g.sub?' · '+g.sub:'')+'</b>;主指标 <b>'+(ind(g.ind)?ind(g.ind).name:'-')+'</b>;关键词 <b>'+esc(g.kw||'-')+'</b>;涉及区域 <b>'+rgTxt(g.regions)+'</b><div class="hint">这些会预填到「新增学习项目」,你都可以改;基线以新增项目时按指标口径取数为准。</div></div><h4>数据盲区</h4><div>展厅接待环节暂无数据,结论仅覆盖试驾 / 外呼。</div>'}
   if(t.versions.length>1)ai+='<h4>分析版本</h4><table class="t"><tr><th>版本</th><th>时间</th><th>证据</th><th>会话</th><th>门店</th></tr>'+t.versions.slice().reverse().map(v=>'<tr><td>v'+v.v+'</td><td>'+v.t+'</td><td>'+chip(v.ev)+'</td><td>'+v.sess+'</td><td>'+v.stores+'</td></tr>').join('')+'</table>';
  }
  ai+='</div>';
  let pj='';
  if(t.proj){const p=proj(t.proj);pj='<div class="card"><h3>关联学习项目 '+(p?chip(p.status):'')+'</h3>'+(p?'<div><a class="link" data-act="go" data-p="detail" data-id="'+p.id+'">'+p.id+' · '+esc(p.name)+'</a></div><div class="hint">目标:'+goalTxt(p)+',当前 '+(p.cur==null?'无数据':p.cur+p.unit)+'</div>':'')+(t.result?'<div class="tag '+(t.result.status==='已达成'?'ok':t.result.status==='未达成'?'err':'warn')+'" style="display:block;margin-top:8px;line-height:1.8;padding:4px 10px">结项回写:效果「'+t.result.status+'」,结论「'+t.result.closeRes+'」——'+esc(t.result.closeWhy)+'</div>':'<div class="hint" style="margin-top:6px">项目结项后,效果结论会写回这里,方便复盘。</div>')+'</div>'}
  let cc='';const tcs=topicContentState(t);const tcsCls={'待生产':'','草稿中':'','生产中':'warn','已有内容':'blue','已落地':'ok'}[tcs.k];
  cc='<div class="card"><h3>内容生产 <span class="tag '+tcsCls+'">'+tcs.k+'</span> <span class="hint">课题是「需求单」,不是内容;由它生产的内容如下</span></h3>'
   +((t.cids||[]).length?'<table class="t"><tr><th>内容</th><th>性质</th><th>内容状态</th><th>上架状态</th><th>引用项目</th><th></th></tr>'+t.cids.map(id=>content(id)).filter(Boolean).map(c=>'<tr><td><a class="link" data-act="cView" data-id="'+c.id+'">'+esc(c.title)+'</a><div class="hint">v'+c.ver+'</div></td><td>'+kindTag(c.kind)+'</td><td>'+cchip(c.st)+'</td><td>'+pubchip(pubOf(c))+'</td><td>'+contentUse(c.id)+' 个</td><td style="white-space:nowrap">'+(usableC(c)&&['hq','region'].includes(UI.role.type)?'<button class="link" data-act="cToProject" data-id="'+c.id+'">做成学习任务</button>':'')+(c.st==='草稿'&&canEditC(c)?'<button class="link" data-act="cEdit" data-id="'+c.id+'">编辑</button>':'')+'</td></tr>').join('')+'</table>':'<div class="hint">还没有由它生产的内容。可以用「生成内容」让 agent 起草话术 / 课程。</div>')
   +'<div class="hint" style="margin-top:8px">进度:有待生产的内容 → 有草稿 / 审核中 → 有已定稿 → 被学习任务引用(已落地)。点踩偏高、命中偏低的反馈会在这里提示需要新内容。</div>'
   +((t.cids||[]).length?'<div style="margin-top:10px"><button class="btn sm" data-act="tGenContent" data-id="'+t.id+'">再生成一条内容</button></div>':'')
   +'</div>';
  const act=topicActions(t);
  const right='<div class="card" style="border-color:var(--pri)"><h3>你可以</h3>'+act+'</div><div class="card"><h3>记录 <span class="hint">谁提的、AI 看了什么、谁处理的</span></h3>'+t.hist.map(x=>'<div style="padding:5px 0;border-top:1px solid #f2f3f5;font-size:13px"><span class="hint">'+x.t+'</span> <b>'+esc(x.who)+'</b> '+esc(x.act)+(x.note?'<div class="hint" style="white-space:normal">'+esc(x.note)+'</div>':'')+'</div>').join('')+'</div>';
  return crumb('<a data-act="go" data-p="topics">课题池</a> / '+t.id)+linkBar({type:'topic',t})+'<div class="ph"><h2>'+esc(t.title)+'</h2><div>'+pchip(t)+' '+tipChip(t.flow)+(t.reopen?' <span class="tag warn">回炉 ×'+t.reopen+'</span>':'')+'</div></div>'+(t.flow==='暂不做'?'<div class="tag" style="display:block;margin-bottom:10px;line-height:1.8;padding:4px 10px">已标记「暂不做」'+(t.skipReason?':'+esc(t.skipReason):'')+'。随时可以恢复。</div>':'')
   +'<div class="grid g2" style="grid-template-columns:3fr 2fr;align-items:start"><div>'+left+ai+cc+pj+'</div><div>'+right+'</div></div>';
}
function topicActions(t){
  const B=(l,a,cls,extra)=>'<button class="btn '+(cls||'')+'" data-act="'+a+'" data-id="'+t.id+'" '+(extra||'')+' style="margin:0 6px 6px 0">'+l+'</button>';
  const why=x=>'<div class="hint">'+x+'</div>';let h='';
  if(t.st==='分析中')return why('AI 分析中,完成后会通知你。')+B('刷新','topicOpen');
  if(t.st==='分析失败')h+=B('重试分析','tRetry','pri');
  if(t.flow==='新发现'||t.flow==='暂不做'){
    h+=canUseT(t)?B('生成内容','tGenContent','pri')+B('直接建学习项目','tToProject')+why('「生成内容」:agent 按这个问题出话术 / 课程初稿,审核定稿后再做成学习任务(可先灰度)或上架零售通。「直接建学习项目」会带入类型「'+g0(t)+'」、主指标、关键词、区域。都不需要审批。'):why(UI.role.type==='region'?'涉及区域不含你负责的区域,可联系相关区域或总部。':'当前身份不能新增学习项目(切换成总部培训部或区域老师)。');
    if(t.flow==='新发现')h+=B('暂不做','tSkip');else h+=B('恢复','tRestore');
  }
  if(t.flow==='已采纳'&&canUseT(t))h+=B('再生成内容','tGenContent');
  if((t.flow==='已采纳'||t.flow==='已闭环')&&t.proj)h+=B('查看项目','go','pri','data-p="detail" data-id="'+t.proj+'"');
  if(t.st==='已出结论'&&t.flow!=='已闭环')h+=B('重新分析','tRetry');
  h+=B('添加备注','tNote');
  return h;
}
const g0=t=>t.sug.type+(t.sug.sub?'·'+t.sug.sub:'');
A.tQuotes=el=>{const t=topic(el.dataset.id);(UI.sel.q||(UI.sel.q={}))[t.id]=1;thist(t,meName(),'查看原话','查看 2 条脱敏原话(留痕)');render()};
A.tNote=el=>openDlg('添加备注','<div class="f"><label><b>*</b>备注</label><div class="in"><textarea id="nt" placeholder="补充背景、区域反馈等"></textarea></div></div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="tNoteOk" data-id="'+el.dataset.id+'">保存</button>');
A.tNoteOk=el=>{const v=$('#nt').value.trim();if(!v)return toast('请填写备注','err');thist(topic(el.dataset.id),meName(),'备注',v);closeDlg();toast('已记录','ok');render()};
A.tSkip=el=>openDlg('暂不做','<div class="f"><label>原因(选填)</label><div class="in"><input type="text" id="sr" placeholder="如 本季培训已饱和 / 已有类似课程" style="min-width:360px"></div></div><div class="hint" style="margin-left:0">只是从「新发现」里收起来,随时可以在「暂不做」里恢复。</div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="tSkipOk" data-id="'+el.dataset.id+'">暂不做</button>');
A.tSkipOk=el=>{const t=topic(el.dataset.id);t.flow='暂不做';t.skipReason=($('#sr').value||'').trim();thist(t,meName(),'标记暂不做',t.skipReason);closeDlg();toast('已收起,可在「暂不做」里恢复','ok');render()};
A.tRestore=el=>{const t=topic(el.dataset.id);t.flow='新发现';thist(t,meName(),'恢复','回到「新发现」');toast('已恢复','ok');render()};
A.tGenContent=el=>{const t=topic(el.dataset.id);if(!canUseT(t)||!['hq','region'].includes(UI.role.type))return toast('当前身份不能生成内容','err');closeDlg();A.cNew({dataset:{t:t.id}})};
A.tToProject=el=>{const t=topic(el.dataset.id);if(!canUseT(t)||!['hq','region'].includes(UI.role.type))return toast('当前身份不能用它建学习项目','err');closeDlg();formInit(t)};
A.tRetry=el=>{const t=topic(el.dataset.id);thist(t,meName(),'重新分析','提交 agent 重新分析(保留历史版本)');startAI(t.id,2500);toast('已重新提交 AI 分析','ok');render()};
/* ---------- 结项回写(辅助信息,方便复盘) ---------- */
function topicWriteback(p){const t=p.from&&topic(p.from);if(!t)return;
  const st=p.eff?(smallNow(p)?'无法判断':metV(p,p.cur)?'已达成':'未达成'):'无效果数据';
  t.result={proj:p.id,closeRes:p.closeRes,closeWhy:p.closeWhy,status:st};
  if(p.closeRes==='回炉'){t.flow='新发现';t.reopen=(t.reopen||0)+1;thist(t,'系统','项目回炉退回','项目 '+p.id+' 效果「'+st+'」,话术已下线;问题回到「新发现」,可以再建一个项目')}
  else{const cs=(t.cids||[]).map(content).filter(Boolean);const gap=[];if(!cs.length)gap.push('无内容');else if(!cs.some(isPub))gap.push('未上架');if(!p.id)gap.push('无项目');t.flow='已闭环';t.evidenceGap=gap;thist(t,'系统','项目结项回写','项目 '+p.id+' 效果「'+st+'」,结论「'+p.closeRes+'」:'+p.closeWhy+(gap.length?';证据不全:'+gap.join(' / '):''))}}
function rulesTopic(){return '<div class="card"><h3>6. 课题池(辅助工具)</h3><div class="tw"><table class="t"><tr><th>状态</th><th>怎么进入</th><th>谁做</th><th>下一步</th></tr>'
 +[['新发现','系统出题 / 对外洞察转入 / 有人提出问题;AI 自动分析','系统 / agent / 任何有后台权限的人','看分析 → 「用它建学习项目」,或「暂不做」'],['已采纳','用它生成了内容,或用它建了学习项目(自动关联)','总部培训部 / 区域老师','内容走「审核 → 定稿 → 做成学习任务 / 上架零售通」;项目走完状态机'],['暂不做','手动收起,可填原因','任何能处理的人','可恢复'],['已闭环','关联项目结项(复制 / 转入店辅导 / 终止)','系统','效果结论写回,方便复盘;选「回炉」则回到「新发现」']].map(r=>'<tr>'+r.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('')+'</table></div><div class="hint" style="margin-top:6px">课题池不是必经入口:没有课题也可以直接去「内容管理」生成内容或新增学习项目;有课题时,「生成内容」会把问题、证据带给 agent,内容入库后再做成学习任务。没有校对、定题、审批。出题阈值:会话 ≥ '+S.cfg.topicSess+'、门店 ≥ '+S.cfg.topicStores+'(配置中心可改)。</div></div>'}
