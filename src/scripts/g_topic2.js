/* ---------- 对外洞察(agent)---------- */
function tpInsight(){
  const g=UI.sel.ag||(UI.sel.ag={range:'近 2 周',kind:'全部',obj:'',region:'全国'});
  const opt=(arr,cur)=>arr.map(o=>'<option '+(cur===o?'selected':'')+'>'+o+'</option>').join('');
  return srcBar('由「培训内容生产专员」agent 提供(腾讯 IM 对接,异步,返回字段已约定为结构化)。我方提供入参:时间范围、关注的竞品 / 政策、区域;返回:课题标题、证据频次、涉及省份、建议培训类型。每次调用都留痕(入参、返回、耗时、版本)。agent 不可用时课题照常提交,AI 状态标「分析失败,可重试」。')
   +'<div class="card"><h3>同步参数(入参)</h3><div class="fil"><span>时间范围</span><select data-wc="agset" data-k="range">'+opt(['近 2 周','近 4 周'],g.range)+'</select><span>类型</span><select data-wc="agset" data-k="kind">'+opt(['全部','竞品','政策'],g.kind)+'</select><span>关注对象</span><input data-wc="agset" data-k="obj" value="'+esc(g.obj)+'" placeholder="如 问界 / 以旧换新,可空" style="width:200px"><span>区域</span><select data-wc="agset" data-k="region">'+opt(['全国'].concat(ALLR),g.region)+'</select><button class="btn pri" data-act="syncInsight">同步洞察(调用 agent)</button><label style="margin-left:12px"><input type="checkbox" data-wc="agDown" '+(S.agentDown?'checked':'')+'> 模拟 agent 超时</label></div></div>'
   +(S.insight.length?'<div class="tw" style="margin-bottom:14px"><table class="t"><tr><th>洞察</th><th>类型</th><th>证据</th><th>涉及</th><th>建议培训类型</th><th>状态</th><th>操作</th></tr>'+S.insight.map(i=>'<tr><td>'+esc(i.title)+'</td><td><span class="tag warn">'+i.tag+'</span></td><td>'+i.freq+'</td><td>'+i.prov+' 省</td><td>'+i.sug.type+(i.sug.sub?' · '+i.sug.sub:'')+'</td><td><span class="tag '+(i.st==='待校对'?'warn':'ok')+'">'+(i.st==='待校对'?'未转入':'已转课题池 '+i.tid)+'</span></td><td>'+(i.st==='待校对'?'<button class="link" data-act="insTo" data-id="'+i.id+'">转入课题池</button>':'<button class="link" data-act="topicOpen" data-id="'+i.tid+'">查看课题</button>')+'</td></tr>').join('')+'</table></div>':'<div class="cta" style="margin-bottom:14px">还没有洞察,设置参数后点「同步洞察」</div>')
   +'<div class="card"><h3>agent 调用记录(留痕)</h3>'+(S.agentCalls.length?'<table class="t"><tr><th>时间</th><th>入参</th><th>状态</th><th>返回</th><th>耗时</th><th>agent 版本</th></tr>'+S.agentCalls.map(c=>'<tr><td>'+c.t+'</td><td>'+esc(c.p)+'</td><td>'+(c.ok?'<span class="tag ok">成功</span>':'<span class="tag err">超时</span>')+'</td><td>'+(c.ok?c.n+' 条':'-(降级:不阻塞课题处理)')+'</td><td>'+c.dur+' s</td><td>'+c.ver+'</td></tr>').join('')+'</table>':'<div class="hint">暂无调用</div>')+'</div>';
}
A.agset=el=>{UI.sel.ag[el.dataset.k]=el.value;if(el.dataset.k==='obj')return};
A.agDown=el=>{S.agentDown=el.checked;toast(el.checked?'已模拟 agent 超时:新的 AI 分析 / 同步会失败,可重试':'agent 已恢复','ok');render()};
A.syncInsight=()=>{const g=UI.sel.ag;const p=g.range+' / '+g.kind+' / '+(g.obj||'不限对象')+' / '+g.region;const at=new Date().toTimeString().slice(0,5);
  if(S.agentDown){S.agentCalls.unshift({t:today+' '+at,p,ok:false,dur:30,ver:'v1.2'});toast('agent 调用超时,可稍后重试','err');return render()}
  const got=INS_POOL.filter(i=>(g.kind==='全部'||i.tag===g.kind)&&(!g.obj||(i.obj+i.title).includes(g.obj))&&(g.region==='全国'||i.sug.regions.includes(g.region))&&!S.insight.some(x=>x.id===i.id));
  got.forEach(i=>S.insight.push(Object.assign({st:'待校对'},JSON.parse(JSON.stringify(i)))));
  S.agentCalls.unshift({t:today+' '+at,p,ok:true,n:got.length,dur:+(6+hsh(p)%9).toFixed(1),ver:'v1.2'});
  toast(got.length?'agent 返回 '+got.length+' 条新洞察':'没有符合条件的新洞察','ok');render()};
A.insTo=el=>{const i=S.insight.find(x=>x.id===el.dataset.id);const sim=similarTo(i.title+i.obj);
  if(sim)return openDlg('已有相似课题','<div>课题 <b>'+sim.id+'</b>「'+esc(sim.title)+'」(状态:'+sim.flow+')与这条洞察相似。</div><div class="hint" style="margin-top:6px">建议把洞察作为补充证据并进去,避免重复。</div>','<button class="btn" data-act="close">取消</button><button class="btn" data-act="insNew" data-id="'+i.id+'">仍转为新课题</button><button class="btn pri" data-act="insMerge" data-id="'+i.id+'" data-t="'+sim.id+'">补充到 '+sim.id+'</button>');
  A.insNew(el)};
A.insNew=el=>{closeDlg();const i=S.insight.find(x=>x.id===el.dataset.id);const t=mkTopic({title:i.title,desc:i.freq+',涉及 '+i.prov+' 省',scene:'试驾',obj:i.obj,sess:i.sess,stores:i.stores,prov:i.prov,trend:i.trend,sug:i.sug},'对外洞察','培训内容生产专员(agent)','agent');i.st='已转';i.tid=t.id;toast('已转入课题池:'+t.id,'ok');render()};
A.insMerge=el=>{closeDlg();const i=S.insight.find(x=>x.id===el.dataset.id);const t=topic(el.dataset.t);t.stats.sess+=i.sess;t.stats.stores=Math.max(t.stats.stores,i.stores);thist(t,'培训内容生产专员(agent)','补充证据','合并洞察「'+i.title+'」:会话 +'+i.sess);i.st='已转';i.tid=t.id;toast('已补充到 '+t.id,'ok');render()};

/* ---------- 出题批次(系统)---------- */
function tpBatch(){
  const ok=c=>c.sess>=S.cfg.topicSess&&c.stores>=S.cfg.topicStores;
  return srcBar('系统每双周自动从「汽车语料」近 14 天的 badcase(试驾 / 外呼 / 客服)聚类出候选问题;只有会话数、门店数都达到阈值才出课题,其余记录为「未达阈值」,不会凭空消失。阈值在「配置中心 → 阈值与口径」。出的课题进「发现的问题」,看到有用的点「用它建学习项目」即可。演示最多模拟 '+POOLS.length+' 个批次。')
   +'<div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><div>当前阈值:会话数 ≥ <b>'+S.cfg.topicSess+'</b>,涉及门店 ≥ <b>'+S.cfg.topicStores+'</b>(语料延迟:试驾 12 小时 / 客服 2 小时;ASR 准确率 '+S.cfg.asrNow+'%) <a class="link" data-act="go" data-p="config" data-t="阈值与口径" style="margin-left:8px">去调整</a></div>'+'<button class="btn pri" data-act="runBatch">运行第 '+(S.batches.length+1)+' 批(演示:模拟双周定时任务)</button>'+'</div></div>'
   +(S.batches.length?'<div class="tw"><table class="t"><tr><th>批次</th><th>运行时间</th><th>语料范围</th><th>候选聚类</th><th>已出题</th><th>未达阈值</th><th>操作</th></tr>'+S.batches.map(b=>'<tr><td>'+b.id+'</td><td>'+b.t+'</td><td>近 14 天 · 试驾 / 外呼 / 客服</td><td>'+b.cands.length+'</td><td>'+b.cands.filter(c=>c.tid).length+'</td><td>'+b.cands.filter(c=>!c.tid).length+'</td><td><button class="link" data-act="batchView" data-id="'+b.id+'">查看明细</button></td></tr>').join('')+'</table></div>':cta('还没有出题批次','点右上角「运行第 1 批」。',''));
}
A.runBatch=()=>{if(UI.role.type!=='hq'&&UI.page==='topics'&&curTab('topics',[])!=='工作台'&&false)return;const i=S.batches.length;if(i>=POOLS.length)return toast('演示数据已用完(最多 '+POOLS.length+' 个批次)','err');
  const b={id:'B'+(i+1),t:today+' '+new Date().toTimeString().slice(0,5),cands:JSON.parse(JSON.stringify(POOLS[i]))};
  let n=0;b.cands.forEach((c,k)=>{c.idx=k;if(c.sess>=S.cfg.topicSess&&c.stores>=S.cfg.topicStores){c.tid=mkTopic(c,'系统出题','系统(双周)','sys',{batch:b.id}).id;n++}});
  S.batches.push(b);notify('系统出题完成:批次 '+b.id+' 从汽车语料 badcase 聚类 '+b.cands.length+' 个候选,出题 '+n+' 个');toast('批次 '+b.id+':候选 '+b.cands.length+',出题 '+n+',未达阈值 '+(b.cands.length-n),'ok');UI.tab.topics='系统出题';render()};
A.batchView=el=>{const b=S.batches.find(x=>x.id===el.dataset.id);openDlg('批次 '+b.id+' 明细','<table class="t"><tr><th>候选问题</th><th>会话数</th><th>门店数</th><th>结果</th></tr>'+b.cands.map(c=>{const ok=c.sess>=S.cfg.topicSess&&c.stores>=S.cfg.topicStores;return '<tr><td>'+esc(c.title)+'</td><td>'+c.sess+'</td><td>'+c.stores+'</td><td>'+(c.tid?'<span class="tag ok">已出题 '+c.tid+'</span> <button class="link" data-act="topicOpen" data-id="'+c.tid+'">查看</button>':'<span class="tag warn">未达阈值</span><div class="hint">'+(c.sess<S.cfg.topicSess?'会话 '+c.sess+' < '+S.cfg.topicSess+' ':'')+(c.stores<S.cfg.topicStores?'门店 '+c.stores+' < '+S.cfg.topicStores:'')+'</div>'+(ok?'<button class="btn sm pri" data-act="batchAdd" data-b="'+b.id+'" data-i="'+c.idx+'">按当前阈值补出题</button>':''))+'</td></tr>'}).join('')+'</table><div class="hint" style="margin-top:8px">调低阈值后,原来过滤掉的候选可在这里补出题。</div>','<button class="btn" data-act="close">关闭</button>',true)};
A.batchAdd=el=>{const b=S.batches.find(x=>x.id===el.dataset.b);const c=b.cands[+el.dataset.i];c.tid=mkTopic(c,'系统出题','系统(双周)','sys',{batch:b.id}).id;toast('已补出题 '+c.tid,'ok');A.batchView({dataset:{id:b.id}});};

/* ---------- 提出问题(两项必填,其余选填) ---------- */
A.newTopic=()=>openDlg('提出问题','<div class="f"><label><b>*</b>一句话问题</label><div class="in"><input type="text" id="tt" placeholder="如:客户拿问界 M8 对比时,顾问说不清优势" style="min-width:420px" oninput="setTimeout(A.tHint,0)"><div id="tHint" style="width:100%"></div></div></div><div class="f"><label><b>*</b>你看到的情况</label><div class="in"><textarea id="td" placeholder="发生在哪、什么表现、大概多少人"></textarea></div></div><details style="margin-left:0"><summary class="hint" style="cursor:pointer">补充信息(选填,填得越多 AI 分析越准)</summary><div class="f" style="margin-top:8px"><label>场景</label><div class="in"><select id="ts"><option>试驾</option><option>外呼</option><option>展厅</option><option>客服</option></select></div></div><div class="f"><label>车型 / 竞品 / 政策</label><div class="in"><input type="text" id="to" placeholder="如 奔驰 GLC" oninput="setTimeout(A.tHint,0)"></div></div><div class="f"><label>涉及区域</label><div class="in">'+ALLR.map(r=>'<label style="margin-right:10px"><input type="checkbox" class="tr" value="'+r+'" '+(UI.role.type==='region'&&r!==UI.role.region?'disabled ':'')+(UI.role.type==='region'?(r===UI.role.region?'checked':''):'checked')+'> '+r+'</label>').join('')+'</div></div></details><div class="hint" style="margin:8px 0 0 0">提交后 AI 自动分析(约几秒),告诉你问题有多普遍、销冠怎么做、建议怎么培训。不需要任何人审批。</div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="submitTopic">提交并分析</button>');
A.tHint=()=>{const e=$('#tHint');if(!e)return;const v=($('#tt').value||'')+($('#to')?$('#to').value:'');const s=similarTo(v);e.innerHTML=s?'<div class="tag warn" style="line-height:1.6;padding:2px 8px">已有相似问题 '+s.id+'「'+esc(s.title)+'」,可以直接<a class="link" data-act="topicOpen" data-id="'+s.id+'">去看它的分析</a>。</div>':''};
A.submitTopic=()=>{const ti=$('#tt').value.trim(),de=$('#td').value.trim();if(!ti)return toast('请填写一句话问题','err');if(!de)return toast('请描述你看到的情况','err');
  const rg=[...document.querySelectorAll('.tr:checked')].map(x=>x.value);const regions=rg.length?rg:(UI.role.type==='region'?[UI.role.region]:ALLR.slice());
  const o=($('#to').value||'').trim();const all=ti+de+o;
  let sug;if(/GLC|竞品|对比|特斯拉|问界|极氪/.test(all))sug={type:'专题训',sub:'强竞品',ind:'I1',kw:'同价位, 配置折算',trig:o||'竞品名',base:31};
  else if(/政策|补贴|国补|地补|以旧换新/.test(all))sug={type:'专题训',sub:'政策类',ind:'I1',kw:'国补, 地补, 叠加',trig:o||'政策名',base:42};
  else if(/邀约|约试驾/.test(all))sug={type:'专题训',sub:'技能类·约试驾',ind:'I2',kw:'这周末, 方便, 预约',trig:'发出邀约',base:38};
  else if(/新人/.test(all))sug={type:'新人训',sub:'',ind:'I5',kw:'',trig:'',base:77};
  else sug={type:'专题训',sub:'短板类',ind:'I3',kw:'',trig:'',base:40};
  sug.regions=regions;
  const t=mkTopic({title:ti,desc:de,scene:($('#ts').value||'试驾'),obj:o||'-',sess:0,stores:0,trend:0,sug},'自主提出',meName(),UI.role.k);
  t.st='分析中';t.thin=/问候|接待/.test(all);t.stats={sess:0,stores:0,prov:0,trend:0};t.versions=[];t.hist[0].note='等待 agent 分析';
  closeDlg();UI.page='topics';UI.tab.topics='发现的问题';UI.sel.tq={flow:'新发现'};render();toast('已提交 '+t.id+',AI 分析中,完成后通知你','ok');startAI(t.id,2800)};

/* ---------- AI 分析(异步)---------- */
function startAI(id,ms){const t=topic(id);t.st='分析中';tmr.push(setTimeout(()=>doneAI(id),ms||2500))}
function doneAI(id){const t=topic(id);if(!t||t.st!=='分析中')return;
  if(S.agentDown){t.st='分析失败';thist(t,'培训内容生产专员(agent)','分析失败','agent 超时,可重试;不影响你直接建学习项目');notify('课题「'+t.title+'」AI 分析失败,可重试');toast(t.id+' AI 分析失败,可重试','err');return refreshT()}
  const v=(t.versions.length||0)+1;const h=hsh(t.id+t.title);
  const s=t.thin?{sess:23,stores:6,prov:2,trend:1}:{sess:Math.round((t.stats.sess||(300+h%900))*(v>1?1.06:1)),stores:0,prov:0,trend:t.stats.trend||(4+h%12)};
  if(!t.thin){s.stores=Math.max(t.stats.stores||0,Math.round(s.sess/4.2));s.prov=Math.round(s.stores/14)}
  t.stats=s;t.ev=s.sess>=S.cfg.topicSess&&s.stores>=S.cfg.topicStores?'充分':'不足';t.st='已出结论';t.versions.push({v,t:today+' '+new Date().toTimeString().slice(0,5),ev:t.ev,sess:s.sess,stores:s.stores});
  thist(t,'培训内容生产专员(agent)','AI 分析 v'+v,'证据'+t.ev+':会话 '+s.sess+' / 门店 '+s.stores);notify('课题「'+t.title+'」AI 分析已完成(证据'+t.ev+')');toast(t.id+' AI 分析已完成(证据'+t.ev+')','ok');refreshT()}
function refreshT(){if(UI.page==='topics'||UI.page==='topic')render()}
A.tRetry=el=>{const t=topic(el.dataset.id);thist(t,meName(),'重新分析','提交 agent 重新分析(保留历史版本)');startAI(t.id,2500);toast('已重新提交 AI 分析','ok');render()};
A.topicOpen=el=>{closeDlg();UI.tid=el.dataset.id;UI.page='topic';render();$('#main').scrollTop=0};
