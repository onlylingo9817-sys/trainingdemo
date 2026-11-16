/* AI 建议:统一“推荐 + 理由 + 采纳 / 忽略 + 留痕”机制。
   Demo 内用可解释的规则与词面相似度模拟 AI；正式接入时只替换 aiRecommendKps / aiRecommendTags / aiCheckNewCar / aiAuditContent 等函数，
   页面、采纳动作、留痕都不变。所有建议都必须由人确认后才写入；AI 不直接改业务事实。 */
const AI_TAG='<span class="tag warn">AI 建议 · 需确认</span>';
const AI_CONF={higher:3.2,mid:2.2,low:1.4};
function aiLog(type,input,output,accepted){
  S.aiLog=S.aiLog||[];
  S.aiLog.unshift({id:'AI'+(S.aiLog.length+1),t:today+' '+new Date().toTimeString().slice(0,5),type,input:String(input||'').slice(0,160),output:(output||[]).map(x=>x.name||x.kp&&x.kp.name||x.tag&&x.tag.name||x.label||'').filter(Boolean).join('、'),accepted:accepted?1:0,who:meShort()});
  if(S.aiLog.length>80)S.aiLog.length=80;
}
function aiNorm(s){return String(s||'').replace(/[\s·\-—_()（）「」“”"'，。！？、：:；;,.!?]/g,'')}
function aiBodyText(it){
  if(!it)return '';
  if(typeof it==='string')return it;
  const b=it.body||{};
  const lines=(typeof bodyLines==='function')?bodyLines(it.kind||'课程',b):[];
  return [it.title,it.subject,it.scene,it.kw,it.intro,lines.join(' ')].filter(Boolean).join(' ');
}
function aiKpReasons(k,text,car){
  const T=aiNorm(text);const R=[];
  if(!T||!k)return R;
  if(T.includes(aiNorm(k.name)))R.push('点名命中「'+k.name+'」');
  (k.syn||[]).forEach(w=>{if(w&&T.includes(aiNorm(w)))R.push('同义词「'+w+'」')});
  (k.tags||[]).forEach(id=>{const t=ptagOf(id);if(t&&t.name&&T.includes(aiNorm(t.name)))R.push('标签「'+t.name+'」')});
  if(car&&car!=='通用车型'&&kpCars(k).includes(car))R.push('同车型「'+car+'」');
  return [...new Set(R)].slice(0,3);
}
function aiRecommendKps(text,opt){
  opt=opt||{};const limit=opt.limit||3;const car=opt.car||'';
  if(!String(text||'').trim())return [];
  return S.kps.filter(k=>k.st==='启用').map(k=>{
    const reasons=aiKpReasons(k,text,car);
    const score=(typeof kpScore==='function'?kpScore(k,text,car):0)+(reasons.length?1:0);
    return {kp:k,score,reasons};
  }).filter(x=>x.score>=2.5).sort((a,b)=>b.score-a.score).slice(0,limit);
}
function aiRecommendTags(text,opt){
  opt=opt||{};const limit=opt.limit||5;const T=aiNorm(text);const out=[];
  if(!T)return out;
  tagActive().forEach(t=>{
    if(t.name&&t.name.length>=2&&T.includes(aiNorm(t.name))){
      out.push({tag:t,score:3,reason:'文本提到「'+t.name+'」'});
    }
  });
  const rec=aiRecommendKps(text,{limit:2});
  rec.forEach(r=>{(r.kp.tags||[]).forEach(id=>{const t=ptagOf(id);if(t&&!out.some(x=>x.tag.id===t.id))out.push({tag:t,score:1.5,reason:'相似知识点「'+r.kp.name+'」挂了此标签'})})});
  return out.sort((a,b)=>b.score-a.score).slice(0,limit);
}
function aiConfText(score){return score>=AI_CONF.higher?'高':score>=AI_CONF.mid?'中':'低'}
function aiOverrideKey(){return ((typeof UI!=='undefined'&&UI&&UI.role&&UI.role.k)||'hq')+':'+today}
function aiSnoozed(){S.aiSnooze=Object.assign({},S.aiSnooze||{});return S.aiSnooze[aiOverrideKey()]||{}}
function aiTagChips(items,act,extra,accepted,ignoreAct){
  if(!items||!items.length)return '<span class="hint">暂无推荐</span>';
  return items.map(x=>{
    const t=x.tag;const reason=x.reason||'';const on=(accepted||[]).includes(t.id);
    return '<span class="tag pri" style="margin:0 6px 6px 0;padding:3px 8px">'+esc(t.name)+' <span class="hint" style="color:inherit;opacity:.75">'+esc(reason)+'</span> '+(on?'<span class="tag ok" style="margin:0 0 0 4px">已采纳</span>':'<a class="link" data-act="'+act+'" data-v="'+t.id+'" '+(extra||'')+'>采纳</a>'+(ignoreAct?' <a class="link" style="color:#98a2b3" data-act="'+ignoreAct+'" data-v="'+t.id+'">忽略</a>':''))+'</span>';
  }).join('');
}
function aiKpChips(items,act,extra,accepted,ignoreAct){
  if(!items||!items.length)return '<span class="hint">暂无匹配</span>';
  return items.map(x=>{
    const on=(accepted||[]).includes(x.kp.id);
    return '<div style="margin:4px 0;line-height:1.6"><span class="tag pri">'+esc(x.kp.name)+'</span> <span class="hint">'+esc((x.reasons||[]).join(' · ')||'文本相似')+'</span> '+(on?'<span class="tag ok">已采纳</span>':'<a class="link" data-act="'+act+'" data-v="'+x.kp.id+'" '+(extra||'')+'>采纳</a>'+(ignoreAct?' <a class="link" style="color:#98a2b3" data-act="'+ignoreAct+'" data-v="'+x.kp.id+'">忽略</a>':''))+'</div>';
  }).join('');
}
function aiAdoptKpRole(kid,mainKp,kpRole,isMain){
  kpRole=kpRole||{};
  if(isMain)mainKp=kid;
  kpRole[kid]=isMain?'主讲解':(mainKp===kid?'主讲解':'提及');
  return {mainKp,kpRole};
}
function aiNextKpId(){return 'K'+(Math.max(0,...S.kps.map(x=>+String(x.id).replace(/\D/g,'')||0))+1)}
function aiMakeKpSkeleton(k,car,srcCar,origin){
  const cars=[...new Set(kpCars(k).concat(car))];
  const nk={id:aiNextKpId(),name:k.name,type:k.type,tags:(k.tags||[]).slice(),car:cars[0],cars,syn:(k.syn||[]).slice(),owner:null,st:'停用',ext:[],created:today,hist:[{t:today,who:meShort(),act:origin||'AI 建议采纳',note:'参考 '+srcCar+'，待补负责人和讲解'}]};
  kpApplyMeta(nk,{cars,tags:nk.tags,abId:(k.dims&&k.dims.Dab||[])[0],owner:null});
  return nk;
}
/* ---------- 内容导入:解析时就给出推荐 ---------- */
function aiDecorateImportItem(it){
  const text=aiBodyText(it);
  it.aiKp=aiRecommendKps(text,{car:it.car||'',limit:3}).map(x=>({id:x.kp.id,score:x.score,reasons:x.reasons}));
  it.aiTags=aiRecommendTags(text,{limit:4}).map(x=>({id:x.tag.id,reason:x.reason,score:x.score}));
  it.kps=it.kps||[];it.kpRole=it.kpRole||{};it.tags=it.tags||[];it.mainKp=it.mainKp||'';
  it.aiIgnored=it.aiIgnored||{kp:[],tag:[]};
  return it;
}
function aiImportRecHtml(r,i,done){
  if(done)return '';
  const kps=(r.aiKp||[]).map(x=>({kp:kp(x.id),score:x.score,reasons:x.reasons})).filter(x=>x.kp);
  const tags=(r.aiTags||[]).map(x=>({tag:ptagOf(x.id),reason:x.reason,score:x.score})).filter(x=>x.tag&&!(r.aiIgnored&&(r.aiIgnored.tag||[]).includes(x.id)));
  const selected=(r.kps||[]).map(kp).filter(Boolean);
  const selectedTags=(r.tags||[]).map(ptagOf).filter(Boolean);
  const ignoredKp=(r.aiIgnored&&r.aiIgnored.kp)||[];
  return '<div class="ai-cell"><div class="ai-cell-h">'+AI_TAG+' <span class="hint">只建议，点「采纳」才写入；可逐条忽略</span></div>'
   +(kps.length?'<div class="hint" style="margin:4px 0 2px">推荐知识点</div>'+kps.map(x=>{const on=(r.kps||[]).includes(x.kp.id);const ig=ignoredKp.includes(x.kp.id);return '<div style="margin:2px 0;'+(ig?'opacity:.55':'')+'"><span class="tag '+(r.mainKp===x.kp.id?'ok':'')+'">'+esc(x.kp.name)+'</span> <span class="hint">'+esc((x.reasons||[]).join(' · '))+(x.score!=null?' · 置信度 '+aiConfText(x.score):'')+'</span> '+(on?'<span class="tag ok">已采纳'+(r.mainKp===x.kp.id?' · 主讲解':' · 提及')+'</span>':ig?'<span class="hint">已忽略</span>':'<a class="link" data-act="ciAiKp" data-i="'+i+'" data-k="'+x.kp.id+'">采纳</a> <a class="link" data-act="ciAiIgnoreKp" data-i="'+i+'" data-k="'+x.kp.id+'">忽略</a>')+'</div>'}).join(''):'')
   +(tags.length?'<div class="hint" style="margin:4px 0 2px">推荐标签</div><div>'+tags.map(x=>'<span class="tag" style="margin:0 5px 4px 0">'+esc(x.tag.name)+' <span class="hint" style="color:inherit;opacity:.7">'+esc(x.reason)+'</span> '+((r.tags||[]).includes(x.tag.id)?'<span class="tag ok" style="margin-left:4px">已采纳</span>':'<a class="link" data-act="ciAiTag" data-i="'+i+'" data-v="'+x.tag.id+'">采纳</a> <a class="link" style="color:#98a2b3" data-act="ciAiIgnoreTag" data-i="'+i+'" data-v="'+x.tag.id+'">忽略</a>')+'</span>').join('')+'</div>':'')
   +(selected.length?'<div class="hint">已采纳知识点：'+selected.map(x=>esc(x.name)).join('、')+'</div>':'')
   +(selectedTags.length?'<div class="hint">已采纳标签：'+selectedTags.map(x=>esc(x.name)).join('、')+'</div>':'')
   +(kps.length||tags.length?'<div style="margin-top:3px"><a class="link" data-act="ciAiAll" data-i="'+i+'">采纳高置信建议</a> <span class="hint">只采纳有明确命中依据的项</span></div>':'')
   +'</div>';
}
A.ciAiKp=el=>{const b=S.cimps.find(x=>x.id===UI.sel.ciB);const r=b&&b.items[+el.dataset.i];if(!r)return;const kid=el.dataset.k;const rec=(r.aiKp||[]).find(x=>x.id===kid);r.kps=r.kps||[];r.kpRole=r.kpRole||{};if(!r.kps.includes(kid))r.kps.push(kid);const o=aiAdoptKpRole(kid,r.mainKp,r.kpRole,!r.mainKp);r.mainKp=o.mainKp;r.kpRole=o.kpRole;r.aiIgnored=r.aiIgnored||{kp:[],tag:[]};r.aiIgnored.kp=(r.aiIgnored.kp||[]).filter(x=>x!==kid);aiLog('导入推荐知识点',r.title,[{kp:kp(kid)}],true);toast('已采纳「'+(kp(kid)||{}).name+'」'+(r.mainKp===kid?'为主讲解':'为提及'),'ok');render()};
A.ciAiIgnoreKp=el=>{const b=S.cimps.find(x=>x.id===UI.sel.ciB);const r=b&&b.items[+el.dataset.i];if(!r)return;const kid=el.dataset.k;r.aiIgnored=r.aiIgnored||{kp:[],tag:[]};r.aiIgnored.kp=[...new Set((r.aiIgnored.kp||[]).concat(kid))];r.kps=(r.kps||[]).filter(x=>x!==kid);if(r.kpRole)delete r.kpRole[kid];if(r.mainKp===kid)r.mainKp=(r.kps||[])[0]||'';aiLog('导入忽略知识点',r.title,[{kp:kp(kid)}],false);toast('已忽略该建议，不会写入','ok');render()};
A.ciAiTag=el=>{const b=S.cimps.find(x=>x.id===UI.sel.ciB);const r=b&&b.items[+el.dataset.i];if(!r)return;const id=el.dataset.v;r.tags=r.tags||[];if(!r.tags.includes(id))r.tags.push(id);r.aiIgnored=r.aiIgnored||{kp:[],tag:[]};r.aiIgnored.tag=(r.aiIgnored.tag||[]).filter(x=>x!==id);aiLog('导入推荐标签',r.title,[{name:(ptagOf(id)||{}).name}],true);toast('已采纳标签「'+(ptagOf(id)||{}).name+'」','ok');render()};
A.ciAiIgnoreTag=el=>{const b=S.cimps.find(x=>x.id===UI.sel.ciB);const r=b&&b.items[+el.dataset.i];if(!r)return;const id=el.dataset.v;r.aiIgnored=r.aiIgnored||{kp:[],tag:[]};r.aiIgnored.tag=[...new Set((r.aiIgnored.tag||[]).concat(id))];r.tags=(r.tags||[]).filter(x=>x!==id);aiLog('导入忽略标签',r.title,[{name:(ptagOf(id)||{}).name}],false);toast('已忽略该标签建议','ok');render()};
A.ciAiAll=el=>{const b=S.cimps.find(x=>x.id===UI.sel.ciB);const r=b&&b.items[+el.dataset.i];if(!r)return;let n=0;r.kps=r.kps||[];r.kpRole=r.kpRole||{};(r.aiKp||[]).forEach(x=>{if(x.score<AI_CONF.mid||!kp(x.id))return;if(!r.kps.includes(x.id)){r.kps.push(x.id);n++}if(!r.mainKp){r.mainKp=x.id;r.kpRole[x.id]='主讲解'}else r.kpRole[x.id]=r.kpRole[x.id]||'提及'});r.tags=r.tags||[];(r.aiTags||[]).forEach(x=>{if(x.score<AI_CONF.mid||!ptagOf(x.id))return;if(!r.tags.includes(x.id)){r.tags.push(x.id);n++}});aiLog('导入批量采纳高置信',r.title,[{name:n+' 项'}],n>0);toast(n?'已采纳 '+n+' 项高置信建议；低置信建议保留待你判断':'没有可自动采纳的高置信建议',n?'ok':'warn');render()};
/* ---------- 知识点新建:标签 / 能力推荐 ---------- */
function aiKpFormText(){
  if(!KF)return '';
  const tags=(KF.tags||[]).map(id=>{const t=ptagOf(id);return t?t.path:''}).join(' ');
  return [KF.name||'',KF.syn||'',tags,KF.type==='事实型'?'产品知识':'销售动作'].join(' ');
}
A.kfAdvice=()=>{
  const text=aiKpFormText();
  const tags=aiRecommendTags(text,{limit:5}).filter(x=>!(KF.tags||[]).includes(x.tag.id)&&!(KF.__aiIgnoreTags||[]).includes(x.tag.id));
  const ab=(/价格|异议|竞品|政策|补贴|异议/.test(text)?'顾虑解除':/探需|需求|场景|邀约/.test(text)?'探需':/带教|辅导|目标|例会/.test(text)?'带人辅导':'场景化讲车');
  UI.sel.kfAdvice={tags,ab,at:Date.now()};render();
};
function aiKpFormAdviceHtml(){
  const a=UI.sel.kfAdvice;if(!a)return '';
  const abRow=kpAbRows().find(x=>x.name===a.ab);
  return '<div class="ai-box" id="kfAdv"><div class="ai-box-h">'+AI_TAG+' <span class="hint">根据名称 / 同义词 / 已选标签推荐；采纳前请核对</span></div>'
   +(a.tags.length?'<div style="margin-top:4px"><b style="font-size:13px">推荐标签</b> '+aiTagChips(a.tags,'kfAiTag','',null,'kfAiTagIgnore')+' <a class="link" data-act="kfAiTagAll">采纳全部</a></div>':'<div class="hint" style="margin-top:4px">没有匹配到合适标签，可手动选择，或先补充同义词。</div>')
   +'<div style="margin-top:6px"><b style="font-size:13px">建议主要训练能力</b> <span class="tag pri">'+esc(a.ab)+'</span> '+(abRow&&KF.abId===abRow.id?'<span class="tag ok">已采纳</span>':'<a class="link" data-act="kfAiAb" data-v="'+esc(a.ab)+'">采纳</a>')+'</div></div>';
}
A.kfAiTag=el=>{const id=el.dataset.v;if(KF&&!KF.tags.includes(id))KF.tags.push(id);aiLog('知识点推荐标签',KF&&KF.name,[{name:(ptagOf(id)||{}).name}],true);toast('已采纳标签「'+(ptagOf(id)||{}).name+'」','ok');render()};
A.kfAiTagIgnore=el=>{if(!KF)return;const id=el.dataset.v;KF.__aiIgnoreTags=KF.__aiIgnoreTags||[];KF.__aiIgnoreTags=[...new Set(KF.__aiIgnoreTags.concat(id))];aiLog('知识点忽略标签',KF.name,[{name:(ptagOf(id)||{}).name}],false);toast('已忽略该标签建议','ok');render()};
A.kfAiTagAll=()=>{const a=UI.sel.kfAdvice||{};let n=0;(a.tags||[]).forEach(x=>{if(KF&&!KF.tags.includes(x.tag.id)){KF.tags.push(x.tag.id);n++}});aiLog('知识点批量采纳标签',KF&&KF.name,(a.tags||[]).map(x=>({name:x.tag.name})),n>0);toast(n?'已采纳 '+n+' 个推荐标签':'没有新的可采纳标签',n?'ok':'warn');render()};
A.kfAiAb=el=>{const name=el.dataset.v;const ab=kpAbRows().find(x=>x.name===name);if(ab&&KF){KF.abId=ab.id;aiLog('知识点推荐能力',KF.name,[{name:ab.name}],true);toast('已采纳能力「'+name+'」','ok')}render()};
/* ---------- 知识点详情：标签建议 ---------- */
function aiKpDetailAdvice(k){
  if(!k)return '';
  const text=[k.name,(k.syn||[]).join(' '),kpTagTxt(k).join(' ')].join(' ');
  const tags=aiRecommendTags(text,{limit:4}).filter(x=>!(k.tags||[]).includes(x.tag.id));
  if(!tags.length)return '';
  return '<div class="ai-box"><div class="ai-box-h">'+AI_TAG+' <span class="hint">这个点的标签可能不全；建议基于名称 / 同义词 / 已有标签</span></div>'
   +tags.map(x=>'<span class="tag pri" style="margin:4px 6px 0 0;padding:3px 8px">'+esc(x.tag.name)+' <span class="hint" style="color:inherit;opacity:.7">'+esc(x.reason)+'</span> <a class="link" data-act="kpAiTag" data-k="'+k.id+'" data-v="'+x.tag.id+'">采纳</a></span>').join('')
   +'</div>';
}
A.kpAiTag=el=>{const k=kp(el.dataset.k);if(!k)return;k.tags=k.tags||[];const id=el.dataset.v;if(!k.tags.includes(id))k.tags.push(id);kpApplyMeta(k,{cars:kpCars(k),tags:k.tags,abId:(k.dims&&k.dims.Dab||[])[0],owner:k.owner});kpHist(k,'采纳 AI 标签建议',(ptagOf(id)||{}).name||'');aiLog('知识点标签建议',k.name,[{name:(ptagOf(id)||{}).name}],true);toast('已采纳标签「'+(ptagOf(id)||{}).name+'」','ok');render()};
/* ---------- 内容编辑:推荐知识点 / 标签 / 质量提示 ---------- */
function aiContentText(){
  if(typeof C==='undefined'||!C)return '';
  const spin=SPIN_K.map(k=>(C.spin||{})[k]||'').join(' ');
  return aiBodyText({title:C.title,subject:C.subject,scene:C.scene,kw:C.kw,intro:C.intro,body:C.kind==='话术'?{scene:C.bscene,spin:C.spin}:{outline:C.intro},kind:C.kind})+' '+spin+' '+C.bscene;
}
function aiContentAdviceHtml(){
  if(typeof C==='undefined'||!C)return '';
  const text=aiContentText();
  const rec=aiRecommendKps(text,{car:C.car,limit:3}).filter(x=>!(C.kps||[]).includes(x.kp.id)&&!(C.__aiIgnoreKps||[]).includes(x.kp.id));
  const tags=aiRecommendTags(text,{limit:4}).filter(x=>!(C.tags||[]).includes(x.tag.id)&&!(C.__aiIgnoreTags||[]).includes(x.tag.id));
  const hard=[];
  if((C.kps||[]).length>1&&!C.mainKp)hard.push('已挂多个知识点，但还没指定主讲解');
  if((C.kps||[]).length===1&&!C.mainKp)hard.push('建议把这条内容的主讲解知识点设为「'+(kp(C.kps[0])||{}).name+'」');
  const dup=S.contents.find(x=>x.id!==C.id&&x.title&&C.title&&aiNorm(x.title)===aiNorm(C.title));
  if(dup)hard.push('标题与已有内容「'+dup.title+'」重复');
  return '<div class="ai-box"><div class="ai-box-h">'+AI_TAG+' <span class="hint">基于标题 / 正文 / 关键词；采纳后仍可修改</span></div>'
   +(hard.length?'<div style="margin-top:4px">'+hard.map(x=>'<div class="tag warn" style="display:block;margin:3px 0;white-space:normal;line-height:1.6">'+esc(x)+'</div>').join('')+'</div>':'')
   +(rec.length?'<div style="margin-top:4px"><b style="font-size:13px">推荐知识点</b> '+aiKpChips(rec,'cAiKp','',null,'cAiIgnoreKp')+'</div>':'')
   +(tags.length?'<div style="margin-top:4px"><b style="font-size:13px">推荐标签</b> '+aiTagChips(tags,'cAiTag','',null,'cAiTagIgnore')+'</div>':'')+ '<div style="margin-top:6px"><button class="btn sm" data-act="cAiRefresh">重新检查</button> <button class="btn sm" data-act="cAiContentAudit">查看链路检查</button> <span class="hint">建议只写进当前编辑表单，保存后才落库</span></div>'
   +'</div>';
}
A.cAiKp=el=>{const id=el.dataset.v;if(!C)return;const had=(C.kps||[]).includes(id);C.kps=C.kps||[];C.kpRole=C.kpRole||{};if(!had)C.kps.push(id);const o=aiAdoptKpRole(id,C.mainKp,C.kpRole,!C.mainKp);C.mainKp=o.mainKp;C.kpRole=o.kpRole;aiLog('内容推荐知识点',C.title,[{kp:kp(id)}],true);toast(had?'已设为主讲解':'已采纳「'+kp(id).name+'」为主讲解','ok');render()};
A.cAiIgnoreKp=el=>{if(!C)return;const id=el.dataset.v;C.__aiIgnoreKps=C.__aiIgnoreKps||[];C.__aiIgnoreKps=[...new Set(C.__aiIgnoreKps.concat(id))];aiLog('内容忽略知识点',C.title,[{kp:kp(id)}],false);toast('已忽略该建议，不会写入','ok');render()};
A.cAiTag=el=>{const id=el.dataset.v;if(!C)return;C.tags=C.tags||[];const had=C.tags.includes(id);if(!had)C.tags.push(id);aiLog('内容推荐标签',C.title,[{name:(ptagOf(id)||{}).name}],true);toast(had?'该标签已在列表中':'已采纳标签「'+(ptagOf(id)||{}).name+'」',had?'warn':'ok');render()};
A.cAiRefresh=()=>{if(!C)return;UI.sel.cAiTick=(UI.sel.cAiTick||0)+1;toast('已按当前标题 / 正文重新检查','ok');render()};
A.cAiContentAudit=()=>{if(!C)return;const rows=aiAuditContent({_form:true});openDlg('AI 链路检查','<div class="ai-box"><div class="ai-box-h">'+AI_TAG+' <span class="hint">检查这条内容是否挂对知识点、是否有主讲解；不会自动写入</span></div>'+(rows.length?rows.map(r=>'<div style="margin:6px 0"><span class="tag '+(r.lv>=2?'err':'warn')+'">'+esc(r.t)+'</span> <span class="hint">'+esc(r.d)+'</span></div>').join(''):'<div class="chk ok"><b>✓</b><span>当前链路检查通过</span></div>')+'</div>','<button class="btn" data-act="close">关闭</button>')};
function aiAuditContent(c){
  const out=[];
  if(!c)return out;
  const src=c._form&&typeof C!=='undefined'?C:c;const ks=(src.kps||[]).map(kp).filter(Boolean);
  if(!ks.length)out.push({lv:3,t:'未挂知识点',d:'这条内容不会进入完备度，也不会被学员提升清单推荐。',act:'挂知识点'});
  if(ks.length>1&&!src.mainKp)out.push({lv:2,t:'没有主讲解',d:'多个知识点中未指定主讲解，完备度会按兼容口径处理，建议明确。',act:'去编辑'});
  const same=ks.filter(k=>{const m=kpMounted(k).filter(x=>x.id!==c.id);return m.length>0});
  if(same.length)out.push({lv:1,t:'同一知识点已有讲解',d:same.map(k=>k.name).join('、')+' 已有其他可用讲解，确认是补充角度还是重复。',act:'去看知识点'});
  if(!(src.tags||[]).length)out.push({lv:1,t:'缺内容标签',d:'按标签筛选时容易漏掉这条内容。',act:'去编辑'});
  return out;
}
function aiContentAuditHtml(c){
  if(!c)return '';
  const rows=aiAuditContent(c);if(!rows.length)return '<div class="chk ok"><b>✓</b><span>链路检查通过</span></div>';
  return rows.map(r=>'<div class="chk '+(r.lv>=2?'must':'rec')+'" style="margin:4px 0"><b>'+(r.lv>=3?'!':'·')+'</b><span>'+esc(r.t)+'：'+esc(r.d)+'</span></div>').join('');
}
/* ---------- 新车信息检查 ---------- */
function aiParseCarName(text){
  const t=String(text||'');
  /* 先抓“新车名 / 车型名 / YU7 Max 上市”这类冒号或上市句式；已知车型只能作为参考，不能盖掉待检查的新车 */
  const lead=t.match(/(?:^|\n)\s*(?:新车|车型|名称)?\s*[:：]?\s*([A-Za-z]+\s?\d{1,4}[A-Za-z0-9\- ]{0,10})\s*(?:上市|发布|到店|即将|配置|卖点)/);
  if(lead)return lead[1].trim().slice(0,20);
  const named=t.match(/(?:新车|车型|名称)\s*[:：]\s*([A-Za-z0-9\u4e00-\u9fa5\- ]{2,20})/);
  if(named)return named[1].trim().split(/\n/)[0].slice(0,20);
  const known=S.cfg.tax.car.filter(c=>c!=='通用车型'&&t.includes(c));
  if(known.length)return known.sort((a,b)=>b.length-a.length)[0];
  const m=t.match(/(?:车型|新车|名称)[:：\s]*([A-Za-z0-9\u4e00-\u9fa5\- ]{2,20})/);
  if(m)return m[1].trim().split(/\n/)[0].slice(0,20);
  const first=t.split(/\n/).map(x=>x.trim()).filter(Boolean)[0]||'';
  return first.replace(/^(新车|车型)[:：]?/,'').slice(0,20);
}
function aiCheckNewCar(text){
  const car=aiParseCarName(text);const known=S.cfg.tax.car.filter(c=>c!=='通用车型');
  const isKnown=known.includes(car);const targetPts=S.kps.filter(k=>kpCars(k).includes(car));
  const srcCar=(isKnown?known.filter(c=>c!==car):known).sort((a,b)=>S.kps.filter(k=>kpCars(k).includes(b)).length-S.kps.filter(k=>kpCars(k).includes(a)).length)[0];
  const srcPts=S.kps.filter(k=>kpCars(k).includes(srcCar));
  const targetNames=new Set(targetPts.map(k=>aiNorm(k.name)));
  const suggested=srcPts.filter(k=>!targetNames.has(aiNorm(k.name))&&k.st==='启用');
  const srcTags=[...new Set(srcPts.flatMap(k=>k.tags||[]))];const targetTags=new Set(targetPts.flatMap(k=>k.tags||[]));
  const missingTags=srcTags.filter(id=>!targetTags.has(id)).map(id=>ptagOf(id)).filter(Boolean);
  const matchedTags=[...new Set(targetPts.flatMap(k=>k.tags||[]))].map(id=>ptagOf(id)).filter(Boolean);
  const gaps=[];if(!targetPts.length)gaps.push('该车型还没有任何知识点');if(missingTags.length)gaps.push('有 '+missingTags.length+' 个标签在参考车型有、这辆车上没有');if(!isKnown)gaps.push('车型「'+car+'」不在当前车型清单，采纳时会新增车型');
  return {car,isKnown,srcCar,targetPts,suggested,missingTags,matchedTags,gaps,text,confidence:targetPts.length?(suggested.length?'中':'高'):'低'};
}
A.kpCarCheck=()=>{const text=($('#kp_car_info')||{}).value||(UI.sel.kpCar&&UI.sel.kpCar.text)||'';if(!text.trim())return toast('请粘贴新车信息','err');const r=aiCheckNewCar(text);UI.sel.kpCar=r;aiLog('新车检查',text,r.suggested.map(k=>({name:k.name})),false);toast('检查完成：'+r.gaps.length+' 项缺口，逐项决定是否采纳','ok');render()};
A.kpCarAdopt=()=>{const r=UI.sel.kpCar;if(!r)return;if(!r.car)return toast('没有识别出车型名','err');kpEnsureCar(r.car);let n=0;r.suggested.forEach(k=>{if(S.kps.some(x=>x.name===k.name&&kpCars(x).includes(r.car)))return;S.kps.push(aiMakeKpSkeleton(k,r.car,r.srcCar,'新车检查采纳'));n++});aiLog('新车采纳知识点',r.car,r.suggested.map(k=>({name:k.name})),n>0);UI.tab.catalog=KP_TAB_LIB;UI.sel.kpf={car:r.car};toast(n?'已为「'+r.car+'」采纳 '+n+' 个知识点骨架，全部停用待补':'没有新的可采纳知识点（可能已存在）',n?'ok':'warn');render()};
A.kpCarAdoptOne=el=>{const r=UI.sel.kpCar;if(!r)return;const k=kp(el.dataset.id)||S.kps.find(x=>x.id===el.dataset.id);const src=(r.suggested||[]).find(x=>x.id===el.dataset.id)||k;if(!src)return toast('找不到这条建议','err');if(S.kps.some(x=>x.name===src.name&&kpCars(x).includes(r.car)))return toast('该车型下已有同名知识点','warn');kpEnsureCar(r.car);S.kps.push(aiMakeKpSkeleton(src,r.car,r.srcCar,'新车检查采纳'));aiLog('新车采纳单个知识点',r.car,[{name:src.name}],true);toast('已采纳「'+src.name+'」骨架，待补负责人和讲解','ok');render()};
A.kpCarIgnore=()=>{UI.sel.kpCar=null;toast('已收起检查结果，未改任何数据','ok');render()};
A.kpCarCopySkeleton=()=>{const r=UI.sel.kpCar;if(!r||!r.srcCar)return toast('没有可参考的车型','err');if(kpCarsHost().includes(r.car))return toast('该车型已有知识点，直接去知识点库补缺口','warn');kpEnsureCar(r.car);const src=S.kps.filter(k=>k.st==='启用'&&kpCars(k).includes(r.srcCar));let n=0;src.forEach(k=>{if(S.kps.some(x=>x.name===k.name&&kpCars(x).includes(r.car)))return;S.kps.push(aiMakeKpSkeleton(k,r.car,r.srcCar,'新车克隆骨架'));n++});aiLog('新车克隆骨架',r.car,src.map(k=>({name:k.name})),n>0);UI.tab.catalog=KP_TAB_LIB;UI.sel.kpf={car:r.car};toast('已从「'+r.srcCar+'」克隆 '+n+' 个知识点骨架，全部停用待补','ok');render()};
function aiNewCarPanel(){
  const r=UI.sel.kpCar;
  return '<div class="kp-panel ai-box"><div class="kp-ph"><h3>上传新车信息，检查标签 / 知识点全不全</h3><span class="hint">适合新车上市：粘贴配置表、卖点清单或会议纪要；先给建议，点「采纳」才建知识点</span></div>'
   +'<textarea id="kp_car_info" style="width:100%;min-height:110px" placeholder="示例：YU7 Max 上市，定位与 N90 Max 接近，卖点有外放电、二排座椅、智能驾驶；帮我检查还缺哪些标签和知识点">'+esc(r&&r.text||'')+'</textarea>'
   +'<div class="kp-actions" style="margin-top:8px"><button class="btn pri" data-act="kpCarCheck">检查缺什么</button><span class="hint">不会直接改数据；检查完逐项采纳</span></div>'
   +(r?'<div class="ai-box" style="margin-top:12px"><div class="ai-box-h">'+AI_TAG+' <span class="hint">识别车型：<b>'+esc(r.car)+'</b> · 参考车型：'+esc(r.srcCar||'-')+' · 置信度 '+r.confidence+'</span></div>'
     +(r.gaps.length?'<div style="margin-top:6px">'+r.gaps.map(g=>'<div class="tag warn" style="display:block;margin:4px 0;white-space:normal;line-height:1.6">'+esc(g)+'</div>').join('')+'</div>':'<div class="chk ok" style="margin-top:6px"><b>✓</b><span>车型已存在，暂未发现明显缺口</span></div>')
     +(r.missingTags.length?'<div style="margin-top:8px"><b style="font-size:13px">标签缺口</b> '+r.missingTags.map(t=>'<span class="tag" style="margin:0 5px 4px 0">'+esc(t.name)+'</span>').join('')+'</div>':'')
     +(r.suggested.length?'<div style="margin-top:8px"><b style="font-size:13px">建议补的知识点</b> '+r.suggested.slice(0,10).map(k=>'<span class="tag pri" style="margin:0 5px 4px 0">'+esc(k.name)+' <a class="link" data-act="kpCarAdoptOne" data-id="'+k.id+'">采纳</a></span>').join('')+'</div><div style="margin-top:6px"><button class="btn sm pri" data-act="kpCarAdopt">采纳全部骨架（停用待补）</button> <button class="btn sm" data-act="kpCarCopySkeleton">从参考车型克隆全部</button> <button class="btn sm" data-act="kpCarIgnore">忽略并收起</button></div>':'<div style="margin-top:8px"><button class="btn sm" data-act="kpCarIgnore">忽略并收起</button></div>')
     +'</div>':'')+'</div>';
}
/* ---------- 知识点批量导入:导入前预检 ---------- */
function aiKpCsvAudit(text){
  const rows=(typeof kpCsvRows==='function'?kpCsvRows(text):[]);if(rows.length<2)return {rows:[],summary:{total:0,unknownTag:0,dup:0,noOwner:0,noAb:0}};
  const head=rows[0].map(x=>x.trim());const col=(r,n)=>{const i=head.indexOf(n);return i>=0?(r[i]||'').trim():''};
  const out=rows.slice(1).map((r,i)=>{
    const name=col(r,'名称');const cars=col(r,'适用车型').split(/[、,，/;；]+/).map(x=>x.trim()).filter(Boolean);
    const tagPath=col(r,'标签');const tag=tagPath?ptagByPath(tagPath):null;
    const abname=col(r,'主要训练能力');const ab=kpAbRows().find(x=>x.name===abname||x.root===abname||(abname==='卖点转译'&&x.name==='场景化讲车'));
    const owner=col(r,'负责人');const syn=col(r,'同义词').split(/[、,，]+/).filter(Boolean);
    const dup=S.kps.find(k=>k.name===name&&k.cars.some(c=>cars.includes(c)));
    const recTags=aiRecommendTags((name+' '+tagPath+' '+syn.join(' ')),{limit:3}).filter(x=>!tag||x.tag.id!==tag.id);
    const issue=[];if(!name)issue.push('名称为空');if(!cars.length)issue.push('适用车型为空');if(tagPath&&!tag)issue.push('标签不存在：'+tagPath);if(abname&&!ab)issue.push('能力不存在：'+abname);if(!owner)issue.push('缺负责人，导入后停用');if(!abname)issue.push('缺主要训练能力');if(dup)issue.push('同名同车型已存在（会跳过）');
    return {line:i+2,name,cars,tagPath,tag,abname,ab,owner,syn,dup,recTags,issue,raw:r};
  });
  return {rows:out,summary:{total:out.length,unknownTag:out.filter(x=>x.tagPath&&!x.tag).length,dup:out.filter(x=>x.dup).length,noOwner:out.filter(x=>!x.owner).length,noAb:out.filter(x=>!x.abname).length}};
}
function aiKpCsvAuditHtml(){
  const a=UI.sel.kpCsvAudit;if(!a)return '';
  const s=a.summary;if(!s.total)return '';
  return '<div class="ai-box"><div class="ai-box-h">'+AI_TAG+' <span class="hint">导入前预检：'+s.total+' 行 · 未知标签 '+s.unknownTag+' · 重复 '+s.dup+' · 缺负责人 '+s.noOwner+' · 缺能力 '+s.noAb+'</span></div>'
   +(a.rows.filter(x=>x.issue.length).slice(0,8).map(x=>'<div style="margin:3px 0;font-size:12.5px"><b>第 '+x.line+' 行 '+(x.name?'「'+esc(x.name)+'」':'')+'</b> <span class="hint">'+esc(x.issue.join('；'))+'</span></div>').join('')||'<div class="chk ok" style="margin-top:4px"><b>✓</b><span>未发现明显问题</span></div>')
   +(a.rows.filter(x=>x.recTags.length).slice(0,5).map(x=>'<div style="margin:3px 0;font-size:12.5px">第 '+x.line+' 行推荐标签：'+x.recTags.map(t=>'<span class="tag pri" style="margin:0 4px">'+esc(t.tag.name)+' <span class="hint" style="color:inherit;opacity:.7">'+esc(t.reason)+'</span></span>').join('')+'</div>').join(''))
   +'<div class="hint" style="margin-top:4px">预检只提示，不改数据；未知标签仍会被正式导入拦截。</div></div>';
}
A.kpAiAudit=()=>{const text=($('#kp_csv')||{}).value||'';if(!text.trim())return toast('请先粘贴或载入 CSV','err');UI.sel.kpCsvAudit=aiKpCsvAudit(text);toast('预检完成：'+UI.sel.kpCsvAudit.summary.total+' 行','ok');render()};
/* ---------- 标签治理 ---------- */
function aiTagAudit(){
  const out=[];const active=tagActive();
  active.forEach(a=>{
    active.forEach(b=>{
      if(a.id>=b.id)return;
      if(a.name===b.name||aiNorm(a.name)===aiNorm(b.name))out.push({type:'duplicate',a,b,reason:'名称相同或近似'});
    });
  });
  return out;
}
function aiTagAuditHtml(){
  const dup=aiTagAudit();
  return '<div class="ai-box"><div class="ai-box-h">'+AI_TAG+' <span class="hint">标签治理：只提示，不自动合并/停用</span></div>'
   +(dup.length?dup.slice(0,6).map(x=>'<div style="margin:4px 0;font-size:12.5px"><span class="tag warn">疑似重复</span> '+esc(x.a.path)+' 与 '+esc(x.b.path)+' <span class="hint">'+esc(x.reason)+'</span> <a class="link" data-act="tagAiMerge" data-a="'+x.a.id+'" data-b="'+x.b.id+'">查看合并建议</a></div>').join(''):'<div class="chk ok" style="margin-top:4px"><b>✓</b><span>未发现明显重复标签</span></div>')
   +'<div class="hint" style="margin-top:4px">合并会把历史引用改到保留标签上，并与「删除」不同，可追溯。</div></div>';
}
A.tagAiAudit=()=>{UI.page='tagmanage';render();setTimeout(()=>{const e=document.querySelector('.ai-box');if(e)e.scrollIntoView({block:'center'})},50)};
A.aiQuizGap=()=>{UI.page='content';UI.tab.content='题';render()};
A.aiDrillGap=()=>{UI.page='content';UI.tab.content='演练';render()};
A.tagAiMerge=el=>{const a=ptagOf(el.dataset.a),b=ptagOf(el.dataset.b);if(!a||!b)return;openDlg('合并标签建议', '<div style="line-height:1.8">建议保留「<b>'+esc(a.path)+'</b>」，把「'+esc(b.path)+'」的历史引用合并过来。<br><span class="hint">合并后 b 标签停用；知识点 / 内容上的标签会改为 a。</span></div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="tagAiMergeDo" data-a="'+a.id+'" data-b="'+b.id+'">确认合并</button>')};
A.tagAiMergeDo=el=>{const a=ptagOf(el.dataset.a),b=ptagOf(el.dataset.b);if(!a||!b)return;S.kps.forEach(k=>{k.tags=(k.tags||[]).map(x=>x===b.id?a.id:x).filter((x,i,arr)=>arr.indexOf(x)===i)});S.contents.forEach(c=>{c.tags=(c.tags||[]).map(x=>x===b.id?a.id:x).filter((x,i,arr)=>arr.indexOf(x)===i)});b.status='off';refreshTagPaths();aiLog('标签合并',b.name,[{name:a.name}],true);closeDlg();toast('已合并到「'+a.name+'」','ok');render()};
/* ---------- 题库 / 演练:推荐出题来源 ---------- */
function aiQuizGapHtml(){
  const need=S.kps.filter(k=>k.st==='启用'&&kpMounted(k).length&&qsOf(k.id,'已定稿').length<3).slice(0,5);
  if(!need.length)return '';
  return '<div class="ai-box"><div class="ai-box-h">'+AI_TAG+' <span class="hint">按知识点推荐出题来源；不是自动生成题目</span></div>'
   +need.map(k=>{const c=kpMounted(k).find(x=>usableC(x));return '<div style="margin:4px 0;font-size:12.5px"><b>'+esc(k.name)+'</b> <span class="hint">现有题 '+qsOf(k.id,'已定稿').length+' 道，建议从「'+esc(c?c.title:'暂无可用讲解')+'」补充</span> '+(c?'<a class="link" data-act="qNewFrom" data-kp="'+k.id+'" data-src="'+c.id+'">去出题</a>':'')+'</div>'}).join('')
   +'<div class="hint" style="margin-top:4px">AI 只指出「哪条讲解适合出题」，题干 / 干扰项仍要人确认。</div></div>';
}
A.qNewFrom=el=>{const kid=el.dataset.kp;const src=el.dataset.src;A.qNew();if(QF){QF.kp=kid;QF.src=src||'';render()}return};
function aiDrillGapHtml(){
  const need=S.kps.filter(k=>k.st==='启用'&&k.type==='技能型'&&kpMounted(k).length&&!drsOf(k.id,'已定稿').length).slice(0,5);
  if(!need.length)return '';
  return '<div class="ai-box"><div class="ai-box-h">'+AI_TAG+' <span class="hint">按技能型知识点推荐演练来源；不是自动生成脚本</span></div>'
   +need.map(k=>{const c=kpMounted(k).find(x=>usableC(x));return '<div style="margin:4px 0;font-size:12.5px"><b>'+esc(k.name)+'</b> <span class="hint">已有讲解，但没有可练演练；建议从「'+esc(c?c.title:'暂无可用讲解')+'」提炼客户异议</span> '+(c?'<a class="link" data-act="drNewFrom" data-kp="'+k.id+'" data-src="'+c.id+'">去建演练</a>':'')+'</div>'}).join('')
   +'<div class="hint" style="margin-top:4px">演练脚本的客户话、必说点、思路点仍需人写；AI 只推荐来源。</div></div>';
}
A.drNewFrom=el=>{const kid=el.dataset.kp;const src=el.dataset.src;A.drNew();if(DF){DF.kp=kid;DF.src=src||'';const c=content(src);if(c){DF.name='客户异议 · '+kp(kid).name;DF.persona='客户提到「'+((c.body&&c.body.scene)||kp(kid).name)+'」，有顾虑'}render()}return};
/* ---------- 全站操作动线：新人第一次进来先做什么 ---------- */
const AI_PAGE_GUIDE={
 workbench:['今天先处理最紧急的 3 件事','待办按「紧急 → 建议 → 可选」排；点「去处理」直达对象。AI 建议卡只提示缺口，不会自动改数据。','aiOpen','看 AI 建议'],
 catalog:['先看「总览」哪款车缺什么','总览 → 车型 × 标签矩阵 → 点格子筛知识点；补清单用「批量新建」，造讲解去内容中心。','kpAiContentAudit','AI 找缺口'],
 kp:['先看这个点能不能上课','按「负责人 → 讲解 → 题 → 演练」看缺口；缺讲解点「去内容中心」，缺题/演练在下方入口。','aiOpen','AI 检查建议'],
 tagmanage:['标签由业务自己维护','统一用业务词建标签（部位 / 政策 / 卖点 / 场景）；先治理重复标签，再补空白标签。','tagAiAudit','AI 查重'],
 content:['先确认内容有没有挂对知识点','列表按标签树筛选；没挂知识点的内容进不了完备度。导入内容时会自动推荐知识点 / 标签，确认后才写入。','aiGoUnlinked','看未挂载'],
 cedit:['先看 AI 建议，再人工确认','AI 只根据标题 / 正文 / 关键词推荐知识点和标签；采纳后仍可在表单里改。主讲解才算可用讲解。','aiContentAdvice','看 AI 建议'],
 qform:['一题只考一个知识点','题要挂在知识点上，并从已定稿讲解里找依据；AI 可推荐来源，题干 / 干扰项必须人写。','aiQuizGap','看推荐来源'],
 dform:['一个演练只练一个点','技能型知识点最适合做演练；AI 只推荐来源讲解，客户话 / 必说点 / 思路点要人补。','aiDrillGap','看推荐来源'],
 effect:['先看就绪度，再看错题','就绪度回答「学得好是否卖得好」；错题集找共性；调优只在证据不足时改口径。','aiOpen','AI 检查建议'],
}
function aiPageGuideHtml(){
  const key=UI.page==='kpform'?'kp':UI.page==='cedit'?'cedit':UI.page==='qform'?'qform':UI.page==='dform'?'dform':UI.page;
  const g=AI_PAGE_GUIDE[key];if(!g)return '';
  return '<div class="ai-guide"><b>'+esc(g[0])+'</b><span>'+esc(g[1])+'</span><button class="link" data-act="'+g[2]+'">'+esc(g[3])+' →</button></div>';
}
const _aiOldPageHelp=typeof pageHelp==='function'?pageHelp:null;
pageHelp=function(){
  const key=UI.page==='kpform'?'kp':UI.page==='cedit'?'cedit':UI.page==='qform'?'qform':UI.page==='dform'?'dform':UI.page;
  const g=AI_PAGE_GUIDE[key];
  if(g)return openDlg('这页怎么用', '<div style="line-height:1.9"><b>'+esc(g[0])+'</b><div style="margin-top:6px;color:#475467">'+esc(g[1])+'</div><div class="hint" style="margin-top:10px">AI 建议只作为参考，所有写入都需要你点「采纳」。</div></div>','<button class="btn" data-act="close">知道了</button>');
  return _aiOldPageHelp? _aiOldPageHelp():toast('这一页暂无额外说明','');
};
/* ---------- 全局 AI 检查 / 工作台 ---------- */
function aiGlobalCounts(){
  const imports=S.cimps.filter(b=>b.st==='待确认');
  const unlinked=S.contents.filter(c=>visC(c)&&!(c.kps||[]).length&&c.st!=='已归档');
  const kpNoTag=S.kps.filter(k=>k.st==='启用'&&!(k.tags||[]).length);
  const contentNoTag=S.contents.filter(c=>visC(c)&&!(c.tags||[]).length&&c.st!=='已归档');
  const weak=kpWeakList();
  const noMain=S.contents.filter(c=>visC(c)&&(c.kps||[]).length>1&&!c.mainKp&&c.st!=='已归档');
  const tagDup=aiTagAudit();
  const carGap=(typeof kpCarsHost==='function')?kpCarsHost().filter(car=>S.kps.filter(k=>kpCars(k).includes(car)).length===0):[];
  return {imports,unlinked,kpNoTag,contentNoTag,weak,noMain,tagDup,carGap};
}
A.aiSnooze=el=>{const key=aiOverrideKey();const day=S.aiSnooze&&S.aiSnooze[key]||{};day[el.dataset.v]=today;S.aiSnooze=Object.assign({},S.aiSnooze||{},{[key]:day});toast('已忽略这类提醒（今天不再提示），不会改业务数据','ok');render()};
A.aiOpen=()=>{const c=aiGlobalCounts();const row=(icon,title,desc,btn)=>'<div class="ai-row"><span>'+icon+'</span><div><b>'+title+'</b><div class="hint">'+desc+'</div></div>'+btn+'</div>';
  const sn=aiSnoozed();const cnt=(k,n)=>sn[k]?0:n;const total=cnt('imports',c.imports.length)+cnt('unlinked',c.unlinked.length)+cnt('kptag',c.kpNoTag.length)+cnt('contentTag',c.contentNoTag.length)+cnt('noMain',c.noMain.length)+cnt('tagdup',c.tagDup.length)+cnt('weak',c.weak.length)+cnt('carGap',c.carGap.length);
  openDlg('AI 检查建议','<div class="ai-box"><div class="ai-box-h">'+AI_TAG+' <span class="hint">只在当前 Demo 数据上检查；'+total+' 项可处理，采纳前请核对</span></div>'
   +row('📥','导入待确认 '+c.imports.length+' 批','解析后已给知识点/标签推荐，确认时逐条采纳',c.imports.length?'<button class="btn sm pri" data-act="aiGoImport">去确认</button> <button class="btn sm" data-act="aiSnooze" data-v="imports">今天忽略</button>':'')
   +row('🔗','未挂知识点的内容 '+c.unlinked.length+' 条','挂上后才能进入完备度和学员提升清单',c.unlinked.length?'<button class="btn sm" data-act="aiGoUnlinked">去挂载</button> <button class="btn sm" data-act="aiSnooze" data-v="unlinked">今天忽略</button>':'')
   +row('🎯','多知识点但没有主讲解 '+c.noMain.length+' 条','只有主讲解计入该点的可用讲解',c.noMain.length?'<button class="btn sm" data-act="aiGoNoMain">去处理</button>':'')
   +row('🏷️','缺标签的启用知识点 '+c.kpNoTag.length+' 个','标签树和车型矩阵会漏掉它们',c.kpNoTag.length?'<button class="btn sm" data-act="aiGoKpNoTag">去补标签</button> <button class="btn sm" data-act="aiSnooze" data-v="kptag">今天忽略</button>':'')
   +row('🧩','缺内容标签 '+c.contentNoTag.length+' 条','不影响状态，但按标签检索会漏',c.contentNoTag.length?'<button class="btn sm" data-act="aiGoContent">去看内容</button>':'')
   +row('🧹','疑似重复标签 '+c.tagDup.length+' 组','标签治理只提示，不自动合并',c.tagDup.length?'<button class="btn sm" data-act="aiGoTag">去治理</button> <button class="btn sm" data-act="aiSnooze" data-v="tagdup">今天忽略</button>':'')
   +row('🚗','空白车型 '+c.carGap.length+' 款','在售车型还没有任何知识点',c.carGap.length?'<button class="btn sm" data-act="aiGoCarGap">去检查</button>':'')
   +row('⚠️','学员集中薄弱 '+c.weak.length+' 个点','已有讲解仍弱时，优先补练/指派学习包',c.weak.length?'<button class="btn sm" data-act="aiGoWeak">去处理</button>':'')
   +row('🚙','新车信息检查','粘贴新车信息，检查标签和知识点齐不齐','<button class="btn sm" data-act="aiGoCar">去检查</button>')
   +'<div class="hint" style="margin-top:8px">所有建议均需人工采纳；AI 不自动写入业务数据。采纳 / 忽略会留痕。</div>'
   +'</div>','<button class="btn" data-act="close">关闭</button>',true);};
A.aiGoImport=()=>{const b=S.cimps.find(x=>x.st==='待确认');if(!b)return toast('没有待确认批次','err');closeDlg();UI.page='content';UI.tab.content='导入';UI.sel.ciB=b.id;render()};
A.aiGoUnlinked=()=>{closeDlg();UI.page='content';UI.tab.content='全部内容';UI.sel.caf={kp:'未挂载'};UI.sel.cadv=true;render()};
A.aiGoNoMain=()=>{closeDlg();UI.page='content';UI.tab.content='全部内容';UI.sel.caf={};UI.sel.cadv=true;render();toast('点开标题进详情，编辑页可设主讲解','')};
A.aiGoKpNoTag=()=>{closeDlg();UI.page='catalog';UI.tab.catalog=KP_TAB_LIB;UI.sel.kpf={tag:'__none'};render()};
A.aiGoContent=()=>{closeDlg();UI.page='content';UI.tab.content='全部内容';UI.sel.caf={};UI.sel.cadv=true;render();toast('可到内容详情补内容标签','')};
A.aiGoTag=()=>{closeDlg();UI.page='tagmanage';render()};
A.aiGoCarGap=()=>{const c=aiGlobalCounts();const car=c.carGap[0];closeDlg();UI.page='catalog';UI.tab.catalog=KP_TAB_BATCH;render();if(car){UI.sel.kpCar=aiCheckNewCar(car);render()}setTimeout(()=>{const e=document.getElementById('kp_car_info');if(e)e.scrollIntoView({block:'center'})},50)};
A.aiGoWeak=()=>{closeDlg();UI.page='catalog';UI.tab.catalog='总览';render()};
A.aiGoCar=()=>{closeDlg();UI.page='catalog';UI.tab.catalog=KP_TAB_BATCH;render();setTimeout(()=>{const e=document.getElementById('kp_car_info');if(e)e.scrollIntoView({block:'center'})},50)};
function aiWorkbenchCard(){
  const c=aiGlobalCounts();const sn=aiSnoozed();const n=c.imports.length+c.unlinked.length+c.kpNoTag.length+c.contentNoTag.length+c.noMain.length+c.tagDup.length+c.weak.length+c.carGap.length;
  const chips=[];
  if(c.imports.length&&!sn.imports)chips.push('导入待确认 '+c.imports.length+' 批');
  if(c.unlinked.length&&!sn.unlinked)chips.push('未挂知识点 '+c.unlinked.length+' 条');
  if(c.noMain.length&&!sn.noMain)chips.push('缺主讲解 '+c.noMain.length+' 条');
  if(c.contentNoTag.length&&!sn.contentTag)chips.push('缺内容标签 '+c.contentNoTag.length+' 条');
  if(c.tagDup.length&&!sn.tagdup)chips.push('疑似重复标签 '+c.tagDup.length+' 组');
  return '<div class="ai-wb"><div><b>AI 检查建议</b><span class="hint">'+n+' 项可处理 · 只建议，不自动改数据</span><div style="margin-top:2px">'+chips.slice(0,4).map(x=>'<span class="tag warn" style="margin:2px 4px 0 0">'+esc(x)+'</span>').join('')+'</div></div><button class="btn sm" data-act="aiOpen">查看建议</button></div>';
}
