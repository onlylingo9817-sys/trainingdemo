/* 产品层:统一能力口径、多车型知识点、知识点总览 / 知识点库 / 批量新建 */
const KP_TAB_LIB='知识点库', KP_TAB_BATCH='批量新建';
const KP_TAB_ALIAS={'看板':KP_TAB_LIB,'完备度看板':KP_TAB_LIB};
const kpCars=k=>{const a=(k&&k.cars&&k.cars.length)?k.cars.slice():[k&&k.car].filter(Boolean);return a.length?a:['通用车型']};
const kpCarText=k=>kpCars(k).join(' / ');
const kpCarsHas=(k,car)=>!car||car==='通用车型'||kpCars(k).includes(car)||kpCars(k).includes('通用车型');
const kpTypeText=k=>k.type==='事实型'?'产品知识':'销售动作';
/* 4 个能力项目前只有一层；保留 lv=2 兼容未来拆子项，但如果只有一层就返回这一层 */
const kpAbRows=()=>{const d=dimOf('Dab');if(!d)return[];return d.values.filter(v=>v.lv===2||!dimKids('Dab',v.id).length).map(v=>({id:v.id,name:v.name,root:dimPath('Dab',v.id).split('_')[0]}))};
const kpAbText=k=>{const id=(k.dims&&k.dims.Dab||[])[0];const v=id&&dimVal('Dab',id);return v?v.name:(k.dim||'未指定')};
const kpReady=k=>{const h=kpHealth(k);return h.cells.owner.s==='ok'&&h.cells.exp.s==='ok'};
const kpCarChip=(car,state)=>'<span class="tag '+(state||'')+'" style="margin:0 3px 3px 0;padding:1px 7px">'+esc(car)+'</span>';
const kpCarsHost=()=>S.cfg.tax.car.filter(c=>c!=='通用车型');

function kpEnsureCar(name){
  name=String(name||'').trim();if(!name)return null;if(!S.cfg.tax.car.includes(name))S.cfg.tax.car.push(name);
  const d=dimOf('Dcar');
  if(d&&!d.values.some(v=>v.name===name))d.values.push({id:'Vcar_'+hsh(name),name,lv:1,path:name,status:'on'});
  return name;
}
function kpCarIds(cars){const d=dimOf('Dcar');return (cars||[]).map(n=>d&&d.values.find(v=>v.name===n)).filter(Boolean).map(v=>v.id)}
function kpApplyMeta(k,o){
  const cars=(o.cars&&o.cars.length?o.cars:['通用车型']).filter(Boolean);
  k.cars=[...new Set(cars)];k.car=k.cars[0]||'通用车型';
  k.tags=(o.tags||[]).slice();k.syn=(o.syn||[]).slice();
  k.dims=Object.assign({},k.dims||{});
  k.dims.Dcar=kpCarIds(k.cars);
  if(k.tags.length)k.dims.Dprod=k.tags.slice(0,2);else delete k.dims.Dprod;
  if(o.abId){const v=dimVal('Dab',o.abId);if(v){k.dims.Dab=[o.abId];k.dim=v.name}}
  if(o.owner!==undefined)k.owner=o.owner||null;
  if(o.pre!==undefined)k.pre=(o.pre||[]).filter(id=>id!==k.id);
  if(o.rel!==undefined)k.rel=(o.rel||[]).filter(id=>id!==k.id);
  return k;
}
function kpStatFor(tagId,car){
  const ids=new Set(ptagDesc(tagId));
  const ks=S.kps.filter(k=>k.st==='启用'&&(k.tags||[]).some(t=>ids.has(t))&&kpCarsHas(k,car));
  const ready=ks.filter(kpReady).length;
  return {n:ks.length,ready,missing:ks.length-ready};
}
function kpCellGrade(ready,n){if(!n)return 'na';const r=ready/n;return r>=.8?'ok':r>0?'warn':'err'}
function kpCellHtml(car,tag){
  const st=kpStatFor(tag,car);const g=kpCellGrade(st.ready,st.n);
  return '<span class="kp-mx '+g+'" data-act="kpJump" data-fk="car" data-fv="'+esc(car)+'" data-fk2="tag" data-fv2="'+tag+'"><b>'+(st.n?st.ready+'/'+st.n:'未建')+'</b><small>'+(st.n?'能上课':'')+'</small></span>';
}
function kpProductCats(){return tagRoots().flatMap(r=>tagChildrenSorted(r.id)).filter(t=>t.status!=='off')}
function kpCarMatrix(){
  const cars=kpCarsHost();
  if(!cars.length)return '<div class="kp-panel"><h3>车型 × 标签完备矩阵</h3><div class="hint">还没有在售车型。先在「配置中心 → 维度体系 → 车型」添加。</div></div>';
  const cats=kpProductCats();
  const cell=(tag,car)=>{
    const st=kpStatFor(tag,car);const g=kpCellGrade(st.ready,st.n);const ratio=st.n?Math.round(st.ready/st.n*100):0;
    return '<span class="kp-mx '+g+'" data-act="kpJump" data-fk="car" data-fv="'+esc(car)+'" data-fk2="tag" data-fv2="'+tag+'"><b>'+(st.n?ratio+'%':'未建')+'</b><small>'+(st.n?st.ready+'/'+st.n+' 能上课':'')+'</small></span>';
  };
  return '<div class="kp-panel"><div class="kp-ph"><h3>车型 × 标签：哪款车还缺内容</h3><span class="hint">每个格子 = 该标签在该车型的完备率；小字「能上课/已建」；点格子直接筛知识点</span></div>'
   +'<div class="tw"><table class="t nw kp-matrix"><tr><th>标签</th><th>全部车型</th>'+cars.map(c=>'<th>'+esc(c)+'</th>').join('')+'</tr>'
   +cats.map(c=>{const all=kpStatFor(c.id,'');const pct=all.n?Math.round(all.ready/all.n*100):0;
     return '<tr><td><b>'+esc((ptagOf(c.pid)||{}).name||'')+' / '+esc(c.name)+'</b></td><td><span class="tag '+(pct>=80?'ok':pct>0?'warn':'err')+'">'+(all.n?pct+'%':'未建')+'</span>'+(all.n?'<div class="hint">'+all.ready+' / '+all.n+' 能上课</div>':'')+'</td>'
      +cars.map(car=>'<td>'+cell(c.id,car)+'</td>').join('')+'</tr>'}).join('')
   +'</table></div><div class="hint" style="margin-top:6px">完备率 = 能上课的点 ÷ 已建的点；能上课 = 有负责人 + 有已上架讲解。通用车型的知识点会计入每一款车。</div></div>';
}
function kpNextCard(){
  const act=S.kps.filter(k=>k.st==='启用');const noExp=act.filter(k=>!kpHealth(k).cells.exp.s==='ok'||kpHealth(k).cells.exp.s!=='ok').length;
  const noOwner=S.kps.filter(k=>!k.owner).length;const cars=kpCarsHost().length;
  const step=(n,title,desc,act_,attr)=>'<div class="kp-step"><span>'+n+'</span><div><b>'+title+'</b><div class="hint">'+desc+'</div></div>'+(attr?'<a class="link" '+attr+'>'+act_+' ›</a>':'')+'</div>';
  return '<div class="kp-panel kp-next"><div class="kp-ph"><h3>先做这三步</h3><span class="hint">知识点页只负责「要讲什么、有没有讲的内容」，讲课材料在内容中心做</span></div>'
   +step(1,'看哪款车缺什么','先看下面的「车型 × 标签」，红色/未建就是缺口。', '去看','data-act="kpJump" data-tab="'+KP_TAB_LIB+'"')
   +step(2,'把清单补完整','没有负责人 '+noOwner+' 个；没有可用讲解 '+noExp+' 个。可单个新增，也可批量导入 / 新车克隆。','去补','data-act="kpBulkTab"')
   +step(3,'去内容中心造讲解','知识点只是清单，话术、课程、题、演练在内容中心造完并上架。','去内容中心','data-act="go" data-p="content"')
   +'<div class="hint" style="margin-top:4px">在售车型 '+cars+' 款 · 已启用知识点 '+act.length+' 个</div></div>';
}
function kpIssueList(){
  const act=S.kps.filter(k=>k.st==='启用');
  const pri=[];
  act.forEach(k=>{const h=kpHealth(k);if(h.cells.owner.s!=='ok')pri.push([3,k,'没有负责人','先去指定负责人']);else if(h.cells.exp.s!=='ok')pri.push([2,k,'没有可用讲解','去内容中心补话术/课程']);else if(h.cells.q.s!=='ok')pri.push([1,k,'题不够','补测评题']);else if(h.cells.drill.s!=='ok')pri.push([0,k,'没有演练','补一个情景演练'])});
  const sorted=pri.sort((a,b)=>b[0]-a[0]).slice(0,8);
  return '<div class="kp-panel"><div class="kp-ph"><h3>现在最该处理的</h3><span class="hint">按「没有负责人 → 没有讲解 → 测评题 / 情景演练」排，点一行进详情</span></div>'
   +(sorted.length?'<div class="kp-issues">'+sorted.map(x=>'<div class="kp-issue"><span class="tag '+(x[0]===3?'err':x[0]===2?'warn':'')+'">'+x[2]+'</span><a class="link" data-act="kpOpen" data-id="'+x[1].id+'">'+esc(x[1].name)+'</a><span class="hint">'+esc(kpCarText(x[1]))+'</span><span style="margin-left:auto" class="hint">'+x[3]+'</span></div>').join('')+'</div>':'<div class="chk ok"><b>✓</b><span>所有启用知识点都有负责人和可用讲解</span></div>')+'</div>';
}
function kpOverviewNew(){
  const act=S.kps.filter(k=>k.st==='启用');const ready=act.filter(kpReady).length;const noExp=act.filter(k=>kpHealth(k).cells.exp.s!=='ok').length;
  const metric=(l,n,h)=>'<div class="stat"><div class="l">'+l+'</div><div class="n">'+n+'</div><div class="hint">'+h+'</div></div>';
  return srcBar('这页回答「我们的知识点清单全不全」。先看知识图谱全貌，再看车型 × 标签矩阵要补哪几个点；学员薄弱只放在页尾，用来决定先补哪块。')
   +'<div class="grid g4" style="margin-bottom:16px">'+metric('在售车型',kpCarsHost().length,'N70 / N90 / 探索版 / 其他')+metric('已启用知识点',act.length,'停用 '+S.kps.filter(k=>k.st==='停用').length+' 个')+metric('能上课',ready+' / '+act.length,'有负责人 + 已上架讲解')+metric('缺可用讲解',noExp,'这 '+noExp+' 个要先补内容')+'</div>'
   +kpGraphView()+kpCarMatrix()+kpNextCard()+kpGovernance()+kpIssueList()
   +'<div class="kp-panel"><div class="kp-ph"><h3>学员集中薄弱</h3><span class="hint">来自零售通诊断，只用于决定「先补哪块」，具体任务在工作台</span></div>'+kpWeakCard().replace(/^<div class="card">/,'<div>').replace(/<\/div>$/,'</div>')+'</div>';
}
function kpLibFilter(){return UI.sel.kpf||(UI.sel.kpf={})}
function kpSelSet(){return UI.sel.kpSel||(UI.sel.kpSel={})}
function kpDimsHtml(k){
  const parts=[];const add=(label,val)=>{if(val)parts.push('<div class="kv-line"><span>'+label+'</span><b>'+esc(val)+'</b></div>')};
  const tid=(k.dims&&k.dims.Dprod||[]);const tags=[...new Set(tid.map(id=>ptagOf(id)).filter(Boolean).map(t=>t.path.replace('产品_','')))];
  add('标签',tags.join('、'));add('主要训练',kpAbText(k));add('适用车型',kpCarText(k));
  add('用在什么场景',(k.dims&&k.dims.Dscene||[]).map(v=>dimLabel('Dscene',v)).join('、'));
  add('主要客户',(k.dims&&k.dims.Dcust||[]).map(v=>dimLabel('Dcust',v)).join('、'));
  add('对比对象',(k.dims&&k.dims.Dcomp||[]).map(v=>dimLabel('Dcomp',v)).join('、'));
  add('销售阶段',(k.dims&&k.dims.Dstage||[]).map(v=>dimLabel('Dstage',v)).join('、'));
  return parts.join('')+'<div class="hint" style="margin-top:6px">'+(typeof kpKindHint==='function'?kpKindHint(k):'')+'</div>';
}
function kpKindHint(k){const hasProd=(k.dims&&k.dims.Dprod||[]).length;return hasProd?'产品知识：讲这款车有什么、怎么讲':'销售动作：练习怎么问、怎么应对'}
function kpLibrary(){
  const f=kpLibFilter();const sel=kpSelSet();const cars=kpCarsHost();const ab=kpAbRows();
  const rows=tagFilterKp(S.kps,f.tag).filter(k=>(!f.car||kpCarsHas(k,f.car))&&(!f.type||k.type===f.type)&&(!f.owner||(f.owner==='(无)'?!k.owner:k.owner===f.owner))&&(!f.dim||f.dim===kpAbText(k))&&(!f.q||k.name.includes(f.q)||(k.syn||[]).some(w=>w.includes(f.q)))&&(!f.lv||(f.lv==='只看有缺口'?!kpReady(k):f.lv==='只看待补'?!kpReady(k):kpReady(k))));
  const selN=Object.keys(sel).filter(id=>sel[id]).length;
  const sortKey=f.sort||'gap';
  const sortVal=k=>{const h=kpHealth(k);if(sortKey==='name')return k.name;if(sortKey==='weak')return kpWeak(k);if(sortKey==='exp')return kpMounted(k).length;if(sortKey==='q')return qsOf(k.id,'已定稿').length;return kpReady(k)?1:0};
  const sortedRows=rows.slice().sort((a,b)=>{const va=sortVal(a),vb=sortVal(b);return (va>vb?1:va<vb?-1:0)});
  const pg=lstPage('kpPage',sortedRows);
  const so=(key,label,arr)=>'<div class="fi2"><label>'+label+'</label><select data-wc="kpset" data-k="'+key+'"><option value="" '+(!f[key]?'selected':'')+'>全部</option>'+arr.map(x=>{const v=String(x.v||x),n=x.n||x;return '<option value="'+esc(v)+'" '+(String(f[key]||'')===v?'selected':'')+'>'+esc(n)+'</option>'}).join('')+'</select></div>';
  const tags=tagOptions({});
  const filter='<div class="kp-panel"><div class="kp-ph"><h3>知识点库</h3><span class="hint">按左侧标签、车型、动作筛；勾选后可批量指派负责人 / 批量启停</span></div><div class="filg">'
   +'<div class="fi2"><label>搜索</label><input data-wc="kpq" value="'+esc(f.q||'')+'" placeholder="名称 / 同义词"></div>'
   +'<div class="fi2"><label>标签</label><select data-wc="kpset" data-k="tag"><option value="" '+(!f.tag?'selected':'')+'>全部</option><option value="__none" '+(f.tag==='__none'?'selected':'')+'>未挂标签</option>'+tagOptions({}).map(t=>'<option value="'+t.id+'" '+(f.tag===t.id?'selected':'')+'>'+'　'.repeat(t.lv-1)+esc(t.name)+'</option>').join('')+'</select></div>'
   +so('car','适用车型',cars)+so('dim','主要训练能力',ab.map(x=>x.name))
   +so('owner','负责人',kpOwners().concat(['(无)']).map(x=>({v:x,n:x})))
   +'<div class="fi2"><label>状态</label><select data-wc="kpset" data-k="lv"><option value="" '+(!f.lv?'selected':'')+'>全部</option>'+['只看有缺口','只看待补','只看完备'].map(x=>'<option '+(f.lv===x?'selected':'')+'>'+x+'</option>').join('')+'</select></div>'
   +'<div class="fi2"><label>排序</label><select data-wc="kpset" data-k="sort"><option value="gap" '+(f.sort==='gap'||!f.sort?'selected':'')+'>有缺口优先</option><option value="name" '+(f.sort==='name'?'selected':'')+'>名称</option><option value="weak" '+(f.sort==='weak'?'selected':'')+'>未过关人数</option><option value="exp" '+(f.sort==='exp'?'selected':'')+'>讲解数</option><option value="q" '+(f.sort==='q'?'selected':'')+'>题数</option></select></div>'
   +'<div class="fi2" style="align-self:end"><button class="btn" data-act="kpFclr">清除</button></div>'
   +'<div class="fi2" style="align-self:end">'+lstCsvBtn(['ID','名称','标签','适用车型','能力','负责人','状态','讲解数','题数','演练数','未过关','已测'],[['ID','名称','标签','适用车型','能力','负责人','状态','讲解数','题数','演练数','未过关','已测']].concat(sortedRows.map(k=>[k.id,k.name,kpTagTxt(k).join(' / '),kpCarText(k),kpAbText(k),k.owner||'',k.st,kpMounted(k).length,qsOf(k.id,'已定稿').length,drsOf(k.id,'已定稿').length,kpWeak(k),kpTested(k)])),'知识点库')+'</div></div></div>';
  const bulk='<div class="kp-bulkbar"><b>已选 '+selN+' 个</b><select id="kp_bulk_owner"><option value="">批量指定负责人…</option>'+kpOwners().map(x=>'<option>'+esc(x)+'</option>').join('')+'</select><button class="btn sm" data-act="kpBulkOwner">指定</button><button class="btn sm" data-act="kpBulkOn">批量启用</button><button class="btn sm" data-act="kpBulkOff">批量停用</button>'+(selN?'<button class="link" data-act="kpSelClear">取消选择</button>':'<span class="hint">先勾选左侧复选框，再点批量操作</span>')+'</div>';
  return '<div class="tag-layout">'+tagTreeHtml(f.tag||'',{}) + '<div>'+filter+bulk+'<div class="kp-panel"><div class="tw"><table class="t nw stk kp-lib"><tr><th style="width:28px"><input type="checkbox" data-wc="kpSelAll" '+(rows.length&&rows.every(k=>sel[k.id])?'checked':'')+'></th><th>知识点</th><th>标签</th><th>适用车型</th><th>负责人</th><th>状态</th><th>备料 / 未过关</th><th>操作</th></tr>'
   +pg.rows.map(k=>{const h=kpHealth(k);const m=kpMounted(k);return '<tr class="'+(k.st==='停用'?'off':'')+'"><td><input type="checkbox" data-wc="kpSel" data-id="'+k.id+'" '+(sel[k.id]?'checked':'')+'></td><td style="white-space:normal;min-width:180px"><a class="link" data-act="kpOpen" data-id="'+k.id+'">'+esc(k.name)+'</a>'+(k.st==='停用'?' <span class="tag">停用</span>':'')+'<div class="hint">'+k.id+' · '+kpTypeText(k)+' · '+esc(kpAbText(k))+'</div></td><td style="white-space:normal;min-width:150px">'+(kpTagNames(k).map(p=>'<span class="tag" style="margin:0 3px 3px 0">'+esc(p)+'</span>').join('')||'<span class="hint">未挂</span>')+'</td><td style="white-space:normal;min-width:120px">'+kpCars(k).map(c=>kpCarChip(c)).join('')+'</td><td>'+(k.owner?esc(k.owner):'<span class="tag err">无</span>')+'</td><td><span class="kp-dots">'+kpDots(h)+'</span> <span class="hint">'+(kpReady(k)?'能上课':'缺口')+'</span></td>'
   +'<td style="white-space:nowrap">讲解 '+m.length+' / 题 '+qsOf(k.id,'已定稿').length+' / 演练 '+drsOf(k.id,'已定稿').length+'<div class="hint">未过关 '+kpWeak(k)+' / 已测 '+kpTested(k)+'</div></td>'
   +'<td><a class="link" data-act="kpOpen" data-id="'+k.id+'">查看</a></td></tr>'}).join('')
   +'</table>'+lstPager('kpPage',pg)+(rows.length?'':'<div class="empty">没有符合条件的知识点，换个标签或新建一个。</div>')+'</div></div>'+'</div></div>';
}
function kpStatForKp(k,car){if(!kpCarsHas(k,car))return '—';return kpReady(k)?'✓':'缺'}

/* ---------- 知识图谱：按能力维度聚焦，只展开选中节点的上下游 ---------- */
function kgDims(){
  const act=S.kps.filter(k=>k.st==='启用');
  return KP_DIMS.map(dim=>({dim,list:act.filter(k=>kpAbText(k)===dim)})).filter(g=>g.list.length).concat((()=>{const rest=act.filter(k=>!KP_DIMS.includes(kpAbText(k)));return rest.length?[{dim:'未分能力',list:rest}]:[]})());
}
function kgFocusId(){
  const act=S.kps.filter(k=>k.st==='启用');
  const inDim=k=>!UI.sel.kgDim||UI.sel.kgDim==='全部'||kpAbText(k)===UI.sel.kgDim;
  if(UI.sel.kgId&&act.some(k=>k.id===UI.sel.kgId&&inDim(k)))return UI.sel.kgId;
  const inScope=act.filter(inDim);
  const hasFlow=k=>(k.pre||[]).length||act.some(x=>(x.pre||[]).includes(k.id));
  const linked=inScope.filter(hasFlow);
  return (linked[0]||inScope.find(k=>(k.rel||[]).length)||inScope[0]||act[0]||{}).id||'';
}
function kgRelations(id){
  const act=S.kps.filter(k=>k.st==='启用');
  const k=S.kps.find(x=>x.id===id);if(!k)return {pre:[],next:[],rel:[]};
  const pre=(k.pre||[]).map(x=>S.kps.find(y=>y.id===x)).filter(Boolean);
  const next=act.filter(x=>(x.pre||[]).includes(id));
  const rel=(k.rel||[]).map(x=>S.kps.find(y=>y.id===x)).filter(Boolean).concat(act.filter(x=>(x.rel||[]).includes(id)&&!(k.rel||[]).includes(x.id)));
  const uniq=a=>a.filter((x,i,arr)=>arr.findIndex(y=>y.id===x.id)===i);
  return {pre:uniq(pre),next:uniq(next),rel:uniq(rel)};
}
function kgMiniCard(k,side){
  const h=kpHealth(k);const color=h.cells.exp.s==='ok'?(kpReady(k)?'#12a36b':'#e8830c'):'#e5484d';
  return '<div class="kg-card" data-act="kpOpen" data-id="'+k.id+'"><i style="background:'+color+'"></i><div><b>'+esc(k.name)+'</b><div class="hint">'+esc(kpAbText(k))+' · 薄弱 '+kpWeak(k)+' 人</div></div>'+(side?'<span class="hint">'+side+'</span>':'')+'</div>';
}
const KG_COLORS={'探需':'#2b6fe0','场景化讲车':'#12a36b','顾虑解除':'#e8830c','带人辅导':'#7b3fc4','未分能力':'#98a2b3'};
function kgColorOf(k){return KG_COLORS[kpAbText(k)]||KG_COLORS['未分能力']}
function kgLayout(){
  const act=S.kps.filter(k=>k.st==='启用');
  const W=1000,H=620;
  let seed=20261117;const rnd=()=>{seed=(seed*1103515245+12345)%2147483648;return seed/2147483648};
  const dims=KP_DIMS.map(d=>({d,i:KP_DIMS.indexOf(d)}));
  const angleOf=k=>{const i=KP_DIMS.indexOf(kpAbText(k));return (i<0?4:i)/Math.max(1,KP_DIMS.length)*Math.PI*2};
  const pos=act.map(k=>{const a=angleOf(k);const r=170+rnd()*90;return {k,x:W/2+Math.cos(a)*r+(rnd()-.5)*40,y:H/2+Math.sin(a)*r*0.72+(rnd()-.5)*40,vx:0,vy:0}});
  const idx={};pos.forEach((p,i)=>idx[p.k.id]=i);
  const edges=[];const seen={};
  pos.forEach((p,i)=>{
    (p.k.pre||[]).forEach(id=>{if(idx[id]==null)return;const a=idx[id],b=i;const key=[Math.min(a,b),Math.max(a,b),'pre'].join('-');if(seen[key])return;seen[key]=1;edges.push([a,b,'pre'])});
    (p.k.rel||[]).forEach(id=>{if(idx[id]==null)return;const a=i,b=idx[id];const key=[Math.min(a,b),Math.max(a,b),'rel'].join('-');if(seen[key])return;seen[key]=1;edges.push([a,b,'rel'])});
  });
  const deg={};edges.forEach(([a,b])=>{deg[a]=(deg[a]||0)+1;deg[b]=(deg[b]||0)+1});
  for(let it=0;it<260;it++){
    const cool=1-it/300;
    for(let i=0;i<pos.length;i++)for(let j=i+1;j<pos.length;j++){
      let dx=pos[j].x-pos[i].x,dy=pos[j].y-pos[i].y;let d=Math.sqrt(dx*dx+dy*dy)||1;
      const min=70;if(d<min){const f=(min-d)/d*0.5*cool;dx*=f;dy*=f;pos[i].x-=dx;pos[i].y-=dy;pos[j].x+=dx;pos[j].y+=dy}
    }
    edges.forEach(([a,b,type])=>{const pa=pos[a],pb=pos[b];let dx=pb.x-pa.x,dy=pb.y-pa.y;let d=Math.sqrt(dx*dx+dy*dy)||1;const target=type==='pre'?120:150;const f=(d-target)/d*0.035*cool;dx*=f;dy*=f;pa.x+=dx;pa.y+=dy;pb.x-=dx;pb.y-=dy});
    pos.forEach(p=>{p.x+=(W/2-p.x)*0.006*cool;p.y+=(H/2-p.y)*0.006*cool});
  }
  const xs=pos.map(p=>p.x),ys=pos.map(p=>p.y);const minx=Math.min(...xs),maxx=Math.max(...xs),miny=Math.min(...ys),maxy=Math.max(...ys);
  pos.forEach(p=>{p.x=60+(p.x-minx)/Math.max(1,maxx-minx)*(W-120);p.y=50+(p.y-miny)/Math.max(1,maxy-miny)*(H-100)});
  return {pos,edges,deg,W,H};
}
function kpNetworkSvg(){
  const L=kgLayout();const q=(UI.sel.kgQ||'').trim().toLowerCase();const sel=UI.sel.kgId||'';
  const act=L.pos.length;
  const edges=L.edges.map(([a,b,type])=>{const pa=L.pos[a],pb=L.pos[b];
    return '<line x1="'+pa.x.toFixed(1)+'" y1="'+pa.y.toFixed(1)+'" x2="'+pb.x.toFixed(1)+'" y2="'+pb.y.toFixed(1)+'" stroke="'+(type==='pre'?'#b6bfcc':'#dfe4ea')+'" stroke-width="'+(type==='pre'?'1.1':'1')+'"'+(type==='rel'?' stroke-dasharray="3 4"':'')+' stroke-opacity=".75"/>'}).join('');
  const nodes=L.pos.map((p,i)=>{const k=p.k;const weak=kpWeak(k);const deg=L.deg[i]||0;const r=Math.min(26,10+Math.sqrt(weak)*1.5+deg*0.5);const color=kgColorOf(k);
    const hit=q&&k.name.toLowerCase().includes(q);const dim=q&&!hit;const on=sel&&sel===k.id;
    const showLabel=hit||on||deg>=4||weak>=20;
    return '<g class="kg-node'+(hit?' hit':'')+(dim?' dim':'')+(on?' on':'')+'" data-id="'+k.id+'" data-act="kgPick" style="cursor:pointer">'
      +'<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="'+r.toFixed(1)+'" fill="'+color+'" fill-opacity="'+(dim?'.12':'.82')+'" stroke="#fff" stroke-width="1.6"><title>'+esc(k.name+' · '+kpAbText(k)+' · 薄弱 '+weak+' 人 · 关系 '+deg+' 条')+'</title></circle>'
      +(showLabel?'<text x="'+(p.x+r+5).toFixed(1)+'" y="'+(p.y+3.5).toFixed(1)+'" font-size="10.5" fill="'+(dim?'#c9ced6':'#344054')+'" style="paint-order:stroke;stroke:#fff;stroke-width:3">'+esc(k.name.length>11?k.name.slice(0,11)+'…':k.name)+'</text>':'')
      +'</g>'}).join('');
  return '<div class="kg-net-wrap"><div class="kg-net-bar"><input id="kg_q" value="'+esc(UI.sel.kgQ||'')+'" placeholder="搜索知识点，命中会高亮…" oninput="A.kgQ(this)"><span class="hint">点击任意节点 → 看它的先学/后续/相关</span></div>'
    +'<svg class="kg-net" viewBox="0 0 '+L.W+' '+L.H+'" width="100%" style="max-width:'+L.W+'px" data-nodes="'+act+'">'+edges+nodes+'</svg>'
    +'<div class="kg-legend">'+Object.keys(KG_COLORS).filter(d=>d!=='未分能力').map(d=>'<span><i style="background:'+KG_COLORS[d]+'"></i>'+d+'</span>').join('')+'<span><i class="ring"></i>越大=薄弱人数越多</span></div></div>';
}
A.kgQ=el=>{const v=(el.value||'').trim();UI.sel.kgQ=v;const q=v.toLowerCase();document.querySelectorAll('.kg-net .kg-node').forEach(g=>{const t=(g.querySelector('title')||{}).textContent||'';const hit=!!q&&t.toLowerCase().includes(q);g.classList.toggle('hit',hit);g.classList.toggle('dim',!!q&&!hit)})};
function kpGraphOverview(){
  const act=S.kps.filter(k=>k.st==='启用');
  const relCount=act.reduce((n,k)=>n+(k.pre||[]).length+(k.rel||[]).length,0);
  return '<div class="kg-overview">'
   +'<div class="kg-ov-stats"><div><span>启用知识点</span><b>'+act.length+'</b></div><div><span>前置关系</span><b>'+act.reduce((n,k)=>n+(k.pre||[]).length,0)+'</b></div><div><span>相关关系</span><b>'+act.reduce((n,k)=>n+(k.rel||[]).length,0)+'</b></div><div><span>没有关系</span><b>'+act.filter(k=>!(k.pre||[]).length&&!(k.rel||[]).length&&!S.kps.some(x=>(x.pre||[]).includes(k.id)||(x.rel||[]).includes(k.id))).length+'</b></div></div>'
   +kpNetworkSvg()
   +'<div class="hint" style="margin-top:8px">这是全貌：颜色=能力维度，大小=薄弱人数，实线=先学后学，虚线=相关。搜索或点击节点可下钻到单点关系。</div></div>';
}
function kpGraphView(){
  const act=S.kps.filter(k=>k.st==='启用');
  const noRel=act.filter(k=>!(k.pre||[]).length&&!(k.rel||[]).length&&!S.kps.some(x=>(x.pre||[]).includes(k.id)||(x.rel||[]).includes(k.id)));
  const view=UI.sel.kgView||'overview';
  const dim=UI.sel.kgDim||'全部';
  const focus=kgFocusId();
  const fk=S.kps.find(k=>k.id===focus);
  const rel=kgRelations(focus);
  const dims=['全部'].concat(KP_DIMS).filter((d,i,a)=>a.indexOf(d)===i);
  return '<div class="kp-panel"><div class="kp-ph"><h3>知识图谱 <span class="hint">先看全貌，再点一个点看它的先学/后续/相关</span></h3><span class="hint">'+act.length+' 个启用点 · '+noRel.length+' 个没有任何关系</span></div>'
   +'<div class="kg-view-tabs"><span class="'+(view==='overview'?'on':'')+'" data-act="kgView" data-v="overview">全貌</span><span class="'+(view==='focus'?'on':'')+'" data-act="kgView" data-v="focus">单点关系</span></div>'
   +(view==='overview'?kpGraphOverview():
     '<div class="kg-toolbar"><div class="fi2"><label>能力维度</label><select data-wc="kgDim">'+['全部'].concat(KP_DIMS).filter((d,i,a)=>a.indexOf(d)===i).map(d=>'<option '+(dim===d?'selected':'')+'>'+d+'</option>').join('')+'</select></div><div class="fi2"><label>聚焦知识点</label><select data-wc="kgSkill">'+act.map(k=>'<option value="'+k.id+'" '+(focus===k.id?'selected':'')+'>'+esc(k.name)+'</option>').join('')+'</select></div><span class="hint">关系在「编辑知识点 → 先学（前置）/ 相关知识点」维护</span></div>'
     +'<div class="kg-focus">'
      +'<div class="kg-col"><div class="kg-col-h">先学（前置）<span>'+rel.pre.length+'</span></div>'+(rel.pre.length?rel.pre.map(k=>kgMiniCard(k,'前置')).join(''):'<div class="kg-empty">没有前置</div>')+'</div>'
      +'<div class="kg-col kg-main"><div class="kg-col-h">当前知识点</div>'+(fk?kgMiniCard(fk,''):'<div class="kg-empty">没有可显示的知识点</div>')+'<div class="kg-actions"><button class="btn sm" data-act="kpOpen" data-id="'+focus+'">看详情</button><button class="btn sm" data-act="kgEditRel" data-id="'+focus+'">维护关系</button></div></div>'
      +'<div class="kg-col"><div class="kg-col-h">学完可接（后续）<span>'+rel.next.length+'</span></div>'+(rel.next.length?rel.next.map(k=>kgMiniCard(k,'后续')).join(''):'<div class="kg-empty">没有后续依赖</div>')+'</div>'
      +'<div class="kg-col"><div class="kg-col-h">相关（无先后）<span>'+rel.rel.length+'</span></div>'+(rel.rel.length?rel.rel.map(k=>kgMiniCard(k,'相关')).join(''):'<div class="kg-empty">没有相关点</div>')+'</div>'
     +'</div>')
   +(noRel.length?'<div style="margin-top:10px"><b style="font-size:13px">孤岛知识点（没有任何关系）</b><div class="hint" style="margin-top:4px">'+noRel.slice(0,10).map(k=>'<a class="link" data-act="kpOpen" data-id="'+k.id+'" style="margin-right:10px">'+esc(k.name)+'</a>').join('')+(noRel.length>10?' …还有 '+(noRel.length-10)+' 个':'')+'</div></div>':'')+'</div>';
}
A.kgView=el=>{UI.sel.kgView=el.dataset.v;render()};
A.kgPick=el=>{UI.sel.kgId=el.dataset.id;UI.sel.kgView='focus';render()};
A.kgEditRel=el=>{UI.kid=el.dataset.id;A.kpEdit();};

A.kgDim=el=>{UI.sel.kgDim=el.value;UI.sel.kgId='';render()};
A.kgSkill=el=>{UI.sel.kgId=el.value;render()};
/* ---------- 知识点治理：没标签 / 没画像 / 没课题 / 孤岛 / 没被培训过 ---------- */
function kpGovernance(){
  const act=S.kps.filter(k=>k.st==='启用');
  const noTag=act.filter(k=>!(k.tags||[]).length);
  const profIds=new Set();(S.profiles||[]).forEach(pf=>pf.items.forEach(it=>pfKps(it).forEach(k=>profIds.add(k.id))));
  const noProfile=act.filter(k=>!profIds.has(k.id));
  const topicKp=new Set(S.topics.map(t=>t.kpId).filter(Boolean));
  const cidsOf=k=>(k.tags||[]).length;
  const noTopic=act.filter(k=>!topicKp.has(k.id)&&tpNoKp(k));
  const usedKp=new Set();S.projects.forEach(p=>(p.nodes||[]).forEach(n=>{const c=n.contentId&&content(n.contentId);if(c)(c.kps||[]).forEach(id=>usedKp.add(id))}));
  const noTrain=act.filter(k=>!usedKp.has(k.id));
  const isolated=act.filter(k=>!(k.pre||[]).length&&!(k.rel||[]).length&&!S.kps.some(x=>(x.pre||[]).includes(k.id)||(x.rel||[]).includes(k.id)));
  const blk=(title,n,cls,hint,list)=>'<div class="card" style="margin:0"><div style="display:flex;justify-content:space-between;align-items:baseline"><b>'+title+'</b><span class="tag '+(cls||'')+'">'+n+' 个</span></div><div class="hint" style="margin:4px 0 6px">'+hint+'</div>'
    +(list.length?'<div style="line-height:2">'+list.slice(0,8).map(k=>'<a class="link" data-act="kpOpen" data-id="'+k.id+'" style="margin-right:10px">'+esc(k.name)+'</a>').join('')+(list.length>8?'<span class="hint">…还有 '+(list.length-8)+' 个</span>':'')+'</div>':'<div class="chk ok" style="margin:0"><b>✓</b><span>没有缺口</span></div>')+'</div>';
  return '<div class="kp-panel"><div class="kp-ph"><h3>知识点治理 <span class="hint">清单是否真的被人管、被用起来</span></h3><span class="hint">'+act.length+' 个启用点</span></div>'
   +'<div class="grid g2" style="gap:12px">'
   +blk('没挂标签',noTag.length,noTag.length?'warn':'', '标签树和车型矩阵里会漏掉它们', noTag)
   +blk('没进岗位画像',noProfile.length,noProfile.length?'warn':'', '不会出现在任何岗位的就绪度计算里', noProfile)
   +blk('没有课题来源',noTopic.length,'', '既不是系统/人工发现的缺口，也没被培训过', noTopic)
   +blk('没被任何学习项目用过',noTrain.length,'', '从没进入过培训任务，学员碰不到', noTrain)
   +blk('孤岛知识点',isolated.length,'', '没有前置/相关关系，无法看出学习先后', isolated)
   +'</div></div>';
}
function tpNoKp(k){
  const tp=kpTopicOf(k);if(tp)return false;
  const cs=kpMounted(k);if(!cs.length)return true;
  return true;
}
function kpImportResultHtml(){
  const r=UI.sel.kpImportResult;if(!r)return '';
  return '<div class="kp-import-result'+(r.total?' warn':' ok')+'"><b>上次导入：成功 '+r.ok+' 条'+(r.total?'，跳过 '+r.total+' 条':'')+'</b>'+(r.errs.length?'<ul>'+r.errs.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'')+(r.total>r.errs.length?'<div class="hint">…还有 '+(r.total-r.errs.length)+' 条</div>':'')+'<a class="link" data-act="kpClearImportResult">收起</a></div>';
}
A.kpClearImportResult=()=>{UI.sel.kpImportResult=null;kpBatchRefresh()};
function kpBatchCapture(){
  const c=$('#kp_csv');if(c)UI.sel.kpCsvText=c.value;
  const t=$('#kp_clone_to');if(t)UI.sel.kpc=Object.assign(UI.sel.kpc||{},{to:t.value});
  const f=$('#kp_clone_from');if(f)UI.sel.kpc=Object.assign(UI.sel.kpc||{},{from:f.value});
}
function kpBatchPage(){
  const kpc=UI.sel.kpc||{};
  const cars=kpCarsHost();
  const ab=kpAbRows();
  return '<div class="kp-batch">'
   +'<div class="kp-panel"><div class="kp-ph"><h3>从 Excel / CSV 批量导入</h3><span class="hint">适合新车上市一次导入几十个知识点；先下载模板，按列填写后上传或直接粘贴</span></div>'
   +'<div class="kp-actions"><button class="btn" data-act="kpTpl">下载 CSV 模板</button><button class="btn" data-act="kpSample">载入示例 CSV</button><input type="file" accept=".csv,text/csv" id="kp_file" data-wc="kpImportFile" style="display:none"><button class="btn pri" data-act="kpPickFile">选择 CSV 文件</button></div>'
   +'<div class="hint" style="margin:10px 0">列：名称 / 适用车型（多个用顿号）/ 标签（如 能源_外放电）/ 主要训练能力 / 负责人 / 同义词 / 状态。车型或标签不存在的行会被跳过并报告。</div>'
   +'<textarea id="kp_csv" style="width:100%;min-height:170px;font:12px/1.6 Menlo,monospace" placeholder="先点「载入示例 CSV」看格式；也可以直接把 Excel 里的列复制过来。\n\n名称,适用车型,标签,主要训练能力,负责人,同义词,状态">'+esc(UI.sel.kpCsvText||'')+'</textarea>'
   +'<div style="margin-top:10px"><button class="btn" data-act="kpAiAudit">AI 预检</button> <button class="btn pri" data-act="kpImportRun">校验并导入</button> <span class="hint">没有负责人会自动停用；不会覆盖已有同名同车型知识点。</span></div>'
   +kpImportResultHtml()
   +(typeof aiKpCsvAuditHtml==='function'?aiKpCsvAuditHtml():'')
   +'<div class="kp-excel"><b>从 Excel 过来？</b><span>按上面 7 列复制粘贴即可，车型多个用顿号隔开；标签写法如「车型卖点_内饰_座椅」或「政策口径_国补地补」。</span></div></div>'
   +(typeof aiNewCarPanel==='function'?aiNewCarPanel():'')
   +'<div class="kp-panel"><div class="kp-ph"><h3>新车型一键克隆</h3><span class="hint">复制的是知识点骨架（名称 + 标签 + 动作 + 适用车型），不复制讲解、题、演练；适合新车型先起清单</span></div>'
   +'<div class="kp-actions"><select id="kp_clone_from">'+cars.map(c=>'<option '+(kpc.from===c?'selected':'')+'>'+esc(c)+'</option>').join('')+'</select><span>→</span><input id="kp_clone_to" value="'+esc(kpc.to||'')+'" placeholder="新车型，如 YU7 Max" style="width:180px"><button class="btn" data-act="kpClonePreview">预览</button><button class="btn pri" data-act="kpCloneRun">开始克隆</button></div>'
   +(kpc.count?'<div class="kp-preview">将把「'+esc(kpc.from)+'」的 '+kpc.count+' 个知识点复制到「'+esc(kpc.to)+'」，全部为停用、待补负责人和讲解。'+(kpc.count?'<button class="link" data-act="kpCloneRun">确认克隆</button>':'')+'</div>':'')
   +'</div>'
   +'<div class="kp-panel"><div class="kp-ph"><h3>一个卖点，多个车型</h3><span class="hint">同一个卖点同时适用 N90 和探索版时，不用复制两条；勾选多个车型即可</span></div>'
   +'<div class="filg"><div class="fi2"><label>知识点名称</label><input id="kp_multi_name" placeholder="如：车内冰箱"></div><div class="fi2"><label>标签</label><select id="kp_multi_tag"><option value="">暂不挂</option>'+PTAGS.filter(t=>t.lv>=2).map(t=>'<option value="'+t.id+'">'+(t.lv-1>1?'　'.repeat(t.lv-2):'')+esc(t.path.replace('产品_',''))+'</option>').join('')+'</select></div><div class="fi2"><label>主要训练能力</label><select id="kp_multi_ab">'+ab.map(x=>'<option value="'+x.id+'">'+esc(x.name)+'</option>').join('')+'</select></div><div class="fi2"><label>负责人</label><select id="kp_multi_owner"><option value="">暂不指定</option>'+kpOwners().map(x=>'<option>'+esc(x)+'</option>').join('')+'</select></div></div>'
   +'<div class="kp-actions" style="margin-top:10px"><span class="hint">适用车型：</span>'+cars.map(c=>'<label class="kp-check"><input type="checkbox" class="kp_multi_car" value="'+esc(c)+'"> '+esc(c)+'</label>').join('')+'<label class="kp-check"><input type="checkbox" class="kp_multi_car" value="通用车型"> 通用车型</label><button class="btn pri" data-act="kpQuickAdd">建一个点多车型</button></div></div></div>';
}
function aiKpContentAuditRows(){
  const cars=kpCarsHost();const out=[];
  cars.forEach(car=>{const ks=S.kps.filter(k=>k.st==='启用'&&kpCarsHas(k,car));const ready=ks.filter(kpReady).length;if(!ks.length||ready/ks.length<0.8)out.push({car,n:ks.length,ready,gap:Math.max(0,ks.length-ready)});});
  return out.sort((a,b)=>(b.n?b.ready/b.n:0)-(a.n?a.ready/a.n:0));
}
A.kpGapDemo=el=>{const car=el.dataset.car;const r=aiCheckNewCar(car);UI.sel.kpCar=r;closeDlg();UI.page='catalog';UI.tab.catalog=KP_TAB_BATCH;render();setTimeout(()=>{const e=document.getElementById('kp_car_info');if(e)e.scrollIntoView({block:'center'})},50)};
function pgCatalog(){
  let t=curTab('catalog',KP_TABS);
  if(t==='清河迁移'||t==='脱离清河'){UI.page='config';UI.tab.config='数据源';return pgConfig()}
  if(t===KP_TAB_BATCH){t=KP_TAB_LIB;UI.tab.catalog=KP_TAB_LIB;setTimeout(()=>{A.kpOpenBatch()},0)}
  if(KP_TAB_ALIAS[t])t=KP_TAB_ALIAS[t];
  if(t==='题库'){UI.page='content';UI.tab.content='全部内容';UI.sel.cadv=false;UI.sel.caf=Object.assign(UI.sel.caf||{},{k:'题'});return pgContent()}
  if(t==='演练'){UI.page='content';UI.tab.content='全部内容';UI.sel.cadv=false;UI.sel.caf=Object.assign(UI.sel.caf||{},{k:'演练'});return pgContent()}
  const head='<div class="ph"><h2>知识点 <span class="hint" style="font-weight:400">这里管「要讲什么、有没有讲的内容」。话术/课程/测评题 / 情景演练在内容中心造；先把清单补完整。</span></h2><div><button class="btn" data-act="kpOpenBatch">批量导入</button> <button class="btn" data-act="kpOpenBatch">新车克隆</button> <button class="btn pri" data-act="kpNew">新增知识点</button></div></div>';
  let b='';
  if(t==='总览')b=kpOverviewNew();
  if(t===KP_TAB_LIB)b=kpLibrary();
  if(t===KP_TAB_BATCH)b=kpBatchPage();
  if(t==='候选')b=kpCands();
  if(t==='清河迁移')b=kpQh();
  const cnt={候选:S.kpCand.filter(x=>x.st==='待确认').length};
  return head+'<div class="tabs">'+KP_TABS.map(x=>'<div class="tab '+(t===x?'on':'')+'" data-act="tab" data-k="catalog" data-v="'+x+'">'+x+(cnt[x]?' <span class="dot" style="display:inline-block">'+cnt[x]+'</span>':'')+'</div>').join('')+'</div>'+b;
}
function kpBatchRefresh(){render();if(UI.drw&&/批量导入|新车克隆/.test(UI.drw.title)){UI.drw.body=kpBatchPage();renderDrawer()}}
A.kpOpenBatch=()=>{UI.page='catalog';if(!KP_TABS.includes(UI.tab.catalog))UI.tab.catalog=KP_TAB_LIB;render();drawerOpen('批量导入 / 新车克隆',kpBatchPage(),'<button class="btn" data-act="drwClose">完成</button>')};
A.kpBulkTab=()=>{UI.tab.catalog=KP_TAB_LIB;UI.sel.kpf={};render()};
A.kpJump=el=>{const d=el.dataset;if(d.tab){if(d.tab==='未挂载内容')return A.kpGoMount();UI.tab.catalog=KP_TAB_ALIAS[d.tab]||d.tab;return render()}UI.sel.kpf={};if(d.fk)UI.sel.kpf[d.fk]=d.fv;if(d.fk2)UI.sel.kpf[d.fk2]=d.fv2;UI.tab.catalog=KP_TAB_LIB;render();$('#main').scrollTop=0};

A.kpSel=el=>{const s=kpSelSet();s[el.dataset.id]=el.checked;render()};
A.kpSelAll=el=>{const s=kpSelSet();const f=kpLibFilter();const rows=S.kps.filter(k=>!f.car||kpCarsHas(k,f.car));rows.forEach(k=>s[k.id]=el.checked);render()};
A.kpSelClear=()=>{UI.sel.kpSel={};render()};
A.kpBulkOwner=()=>{const o=$('#kp_bulk_owner').value;if(!o)return toast('先选负责人','err');const s=kpSelSet();let n=0;Object.keys(s).filter(id=>s[id]).forEach(id=>{const k=kp(id);if(k){k.owner=o;kpHist(k,'批量指定负责人',o);n++}});toast('已为 '+n+' 个知识点指定负责人='+o,'ok');UI.sel.kpSel={};render()};
A.kpBulkOn=()=>{const s=kpSelSet();let n=0,skip=0;Object.keys(s).filter(id=>s[id]).forEach(id=>{const k=kp(id);if(!k)return;if(!k.owner){skip++;return}k.st='启用';kpHist(k,'批量启用');n++});toast('已启用 '+n+' 个'+(skip?'，'+skip+' 个无负责人跳过':''),skip?'warn':'ok');UI.sel.kpSel={};render()};
A.kpBulkOff=()=>{const s=kpSelSet();let n=0;Object.keys(s).filter(id=>s[id]).forEach(id=>{const k=kp(id);if(k){k.st='停用';kpHist(k,'批量停用');n++}});toast('已停用 '+n+' 个','ok');UI.sel.kpSel={};render()};

A.kpTpl=()=>{const rows=[['名称','适用车型','标签','主要训练能力','负责人','同义词','状态'],['车载冰箱','N90 Max、N90 Max 探索版','内饰_车内冰箱','卖点转译','王磊','压缩机冰箱、冷冻','启用'],['迎宾踏板','N70系列','外饰_迎宾踏板','卖点转译','','电动侧踏、上下车','停用']];const csv='\ufeff'+rows.map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='知识点导入模板.csv';document.body.appendChild(a);a.click();a.remove()};
A.kpSample=()=>{UI.sel.kpCsvText='名称,适用车型,标签,主要训练能力,负责人,同义词,状态\n车内冰箱,N90 Max、N90 Max 探索版,内饰_车内冰箱,卖点转译,王磊,压缩机冰箱、冷冻,启用\n迎宾踏板,N70系列,外饰_迎宾踏板,卖点转译,,电动侧踏、上下车,停用\n车载香氛,通用车型,内饰_空间布局,场景匹配,李娜,香氛、气味,停用';$('#kp_csv').value=UI.sel.kpCsvText;toast('已载入示例，点「校验并导入」','ok')};
A.kpPickFile=()=>$('#kp_file').click();
A.kpImportFile=el=>{const f=el.files&&el.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('#kp_csv').value=r.result;A.kpImportRun()};r.readAsText(f,'utf-8')};
function kpCsvRows(text){
  const rows=[];let row=[],cell='',q=false;const s=String(text||'').replace(/^\ufeff/,'');
  for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'){if(q&&s[i+1]==='"'){cell+='"';i++}else q=!q}else if(c===','&&!q){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&s[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x!==''))rows.push(row);row=[];cell=''}else cell+=c}
  row.push(cell);if(row.some(x=>x!==''))rows.push(row);return rows;
}
A.kpImportRun=()=>{kpBatchCapture();const rows=kpCsvRows(UI.sel.kpCsvText||'');if(rows.length<2)return toast('没有可导入的行','err');const head=rows[0].map(x=>x.trim());const col=(r,n)=>{const i=head.indexOf(n);return i>=0?(r[i]||'').trim():''};let ok=0;const errs=[];rows.slice(1).forEach((r,i)=>{const name=col(r,'名称');if(!name){errs.push('第 '+(i+2)+' 行：名称为空');return}
  if(S.kps.some(k=>k.name===name&&k.cars.some(c=>col(r,'适用车型').includes(c)))){errs.push('第 '+(i+2)+' 行：已存在同名同车型「'+name+'」');return}
  const cars=col(r,'适用车型').split(/[、,，/;；]+/).map(x=>x.trim()).filter(Boolean);if(!cars.length){errs.push('第 '+(i+2)+' 行：适用车型为空');return}
  const tagPath=col(r,'标签');const tag=tagPath?ptagByPath(tagPath):null;if(tagPath&&!tag){errs.push('第 '+(i+2)+' 行：找不到标签「'+tagPath+'」');return}
  const abname=col(r,'主要训练能力');const ab=kpAbRows().find(x=>x.name===abname||x.root===abname||(abname==='卖点转译'&&x.name==='场景化讲车'));if(abname&&!ab){errs.push('第 '+(i+2)+' 行：找不到主要训练能力「'+abname+'」，可用：'+kpAbRows().map(x=>x.name).join(' / '));return}
  const owner=col(r,'负责人')||null;const syn=col(r,'同义词').split(/[、,，]+/).filter(Boolean);const id='K'+(Math.max(0,...S.kps.map(x=>+x.id.slice(1)))+1);
  cars.forEach(kpEnsureCar);const k={id,name,type:(tag?'事实型':'技能型'),tags:tag?[tag.id]:[],car:cars[0],cars,syn,owner,st:col(r,'状态')==='启用'&&owner?'启用':'停用',ext:[],created:today,hist:[]};kpApplyMeta(k,{cars,tags:k.tags,abId:ab?ab.id:null,owner});S.kps.push(k);kpHist(k,'批量导入',owner?'':'没有负责人，先停用');ok++});
  UI.sel.kpImportResult={ok,errs:errs.slice(0,8),total:errs.length};kpBatchRefresh();toast('导入完成：成功 '+ok+' 条'+(errs.length?'，跳过 '+errs.length+' 条（查看下方明细）':''),errs.length?'warn':'ok');
};
A.kpClSet=()=>{};
A.kpClonePreview=()=>{kpBatchCapture();const st=UI.sel.kpc||{};const from=st.from||$('#kp_clone_from').value,to=(st.to||'').trim();if(!to)return toast('请填写新车型名称','err');if(kpCarsHost().includes(to))return toast('这个车型已经有知识点了，直接看知识点库','err');const count=S.kps.filter(k=>k.st==='启用'&&kpCars(k).includes(from)).length;UI.sel.kpc={from,to,count};kpBatchRefresh()};
A.kpCloneRun=()=>{kpBatchCapture();let st=UI.sel.kpc||{};if(!st.to){st={from:st.from||$('#kp_clone_from').value,to:st.to||($('#kp_clone_to').value||'').trim(),count:0};}if(!st.to)return toast('请填写新车型名称','err');if(kpCarsHost().includes(st.to))return toast('这个车型已经有知识点了','err');const src=S.kps.filter(k=>k.st==='启用'&&kpCars(k).includes(st.from));if(!src.length)return toast('源车型没有可复制的知识点','err');kpEnsureCar(st.to);let n=Math.max(0,...S.kps.map(k=>+String(k.id).replace(/\D/g,'')||0));const ids=[];src.forEach(k=>{const cars=[...new Set(kpCars(k).concat(st.to))];const nk={id:'K'+(++n),name:k.name,type:k.type,tags:(k.tags||[]).slice(),car:cars[0],cars,syn:(k.syn||[]).slice(),owner:null,st:'停用',ext:[],created:today,hist:[{t:today,who:meShort(),act:'克隆自 '+k.id,note:'新车型骨架，待补负责人和讲解'}]};kpApplyMeta(nk,{cars,tags:nk.tags,abId:(k.dims&&k.dims.Dab||[])[0],owner:null});S.kps.push(nk);ids.push(nk.id)});UI.sel.kpc={from:st.from,to:st.to,count:0};toast('已克隆 '+ids.length+' 个知识点到「'+st.to+'」，全部停用待补','ok');UI.tab.catalog=KP_TAB_LIB;UI.sel.kpf={car:st.to};kpBatchRefresh()};
A.kpQuickAdd=()=>{const name=($('#kp_multi_name')||{}).value||'';const tag=$('#kp_multi_tag')?$('#kp_multi_tag').value:'';const ab=$('#kp_multi_ab')?$('#kp_multi_ab').value:'';const owner=$('#kp_multi_owner')?$('#kp_multi_owner').value:'';const cars=[...document.querySelectorAll('.kp_multi_car:checked')].map(x=>x.value);if(!name.trim())return toast('请填写名称','err');if(!cars.length)return toast('至少选一个适用车型','err');if(S.kps.some(k=>k.name===name.trim()&&k.cars.some(c=>cars.includes(c))))return toast('同名同车型已经有知识点了','err');cars.forEach(kpEnsureCar);const id='K'+(Math.max(0,...S.kps.map(x=>+String(x.id).replace(/\D/g,'')||0))+1);const k={id,name:name.trim(),type:tag?'事实型':'技能型',tags:tag?[tag]:[],car:cars[0],cars,syn:[],owner:owner||null,st:'启用',ext:[],created:today,hist:[]};kpApplyMeta(k,{cars,tags:k.tags,abId:ab||null,owner:owner||null});S.kps.push(k);kpHist(k,'新增',owner?'':'没有负责人');toast('已建「'+name.trim()+'」，同时适用 '+cars.join('、'),'ok');UI.tab.catalog=KP_TAB_LIB;UI.sel.kpf={};kpBatchRefresh()};

/* 编辑页:一套能力口径 + 多车型 */
A.kpNew=()=>{KF={id:null,name:'',type:'事实型',cars:['通用车型'],tags:[],abId:(kpAbRows()[0]||{}).id||'',syn:'',owner:kpDefOwner(),more:true,pre:[],rel:[]};UI.page='kpform';render()};
A.kpEdit=()=>{const k=kp(UI.kid);KF={id:k.id,name:k.name,type:k.type,cars:kpCars(k).slice(),tags:(k.tags||[]).slice(),abId:(k.dims&&k.dims.Dab||[])[0]||'',syn:(k.syn||[]).join('、'),owner:k.owner||'',more:true,pre:(k.pre||[]).slice(),rel:(k.rel||[]).slice()};UI.page='kpform';render()};
A.kfCar=el=>{const v=el.value;if(el.checked){if(!KF.cars.includes(v))KF.cars.push(v)}else KF.cars=KF.cars.filter(x=>x!==v);if(!KF.cars.length)KF.cars=['通用车型'];render()};
A.kfAb=el=>{KF.abId=el.value;render()};
function kfRelPick(field){
  const cur=(KF[field]||[]).map(kp).filter(Boolean);
  const others=S.kps.filter(k=>k.id!==KF.id&&!(KF[field]||[]).includes(k.id));
  return '<div class="kf-rel"><div style="margin-bottom:6px">'+(cur.length?cur.map(k=>'<span class="tag pri" style="margin:0 6px 6px 0;padding:3px 8px">'+esc(kpLabel(k))+' <a class="link" data-act="kfRelDel" data-f="'+field+'" data-v="'+k.id+'">×</a></span>').join(''):'<span class="hint">未选</span>')+'</div>'
   +'<select data-wc="kfRelAdd" data-f="'+field+'"><option value="">选择知识点…</option>'+others.map(k=>'<option value="'+k.id+'">'+esc(kpLabel(k))+'</option>').join('')+'</select></div>';
}
A.kfRelAdd=el=>{const f=el.dataset.f;const id=el.value;if(!id)return;KF[f]=KF[f]||[];if(!KF[f].includes(id))KF[f].push(id);render()};
A.kfRelDel=el=>{const f=el.dataset.f;KF[f]=(KF[f]||[]).filter(x=>x!==el.dataset.v);render()};
A.kfType=el=>{KF.type=el.dataset.v;if(KF.type==='事实型'&&!KF.tags.length){const ab=kpAbRows().find(x=>x.name==='场景化讲车');if(ab)KF.abId=ab.id}render()};
function pgKpForm(){
  if(!KF){UI.page='catalog';return pgCatalog()}
  const cars=kpCarsHost().concat(['通用车型']);const ab=kpAbRows();
  const tags=tagOptions({});
  const dup=S.kps.find(k=>k.id!==KF.id&&k.name===KF.name.trim()&&k.cars.some(c=>KF.cars.includes(c)));
  const carBox='<div class="kp-checks">'+cars.map(c=>'<label class="kp-check"><input type="checkbox" data-wc="kfCar" value="'+esc(c)+'" '+(KF.cars.includes(c)?'checked':'')+'> '+esc(c)+'</label>').join('')+'</div>';
  const tagBox=tagPickerHtml('kfTag',KF.tags,{})+'<div class="tag-ai-slot">'+(typeof aiKpFormAdviceHtml==='function'?aiKpFormAdviceHtml():'')+'</div>';
  const more='<div class="kp-more">'+FR('标签',tagBox,{h:'可以是车上部位，也可以是政策、卖点、场景等；一个点可挂多个标签'})
   +FR('同义词','<input type="text" data-kf="syn" value="'+esc(KF.syn)+'" placeholder="用户会怎么说，如 后备箱、装得下" style="width:100%;max-width:460px">',{h:'用于搜索和内容挂载推荐'})
   +FR('负责人','<select data-wc="kfset" data-k="owner"><option value="">暂不指定（保存后停用）</option>'+kpOwners().map(x=>'<option '+(KF.owner===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select>',{h:'没有负责人不能启用'})
   +FR('先学（前置知识点）',kfRelPick('pre'),{h:'在这里维护学习顺序：学这个点之前，学员应先掌握哪些点。图谱的箭头由此生成'})
   +FR('相关知识点',kfRelPick('rel'),{h:'常一起讲/互相引用，没有先后顺序；只用于检索和推荐，不代表先学后学'})+'</div>';
  const dockHtml='<!--DOCK_START--><div class="dock"><span class="sp"></span><button class="btn" data-act="kfCancel">取消</button><button class="btn pri" data-act="kfSave">保存</button></div><!--DOCK_END-->';
  return crumb('<a data-act="go" data-p="catalog">知识点</a> / '+(KF.id?'编辑 '+KF.id:'新增知识点'))+dockHtml+'<div class="ph"><h2>'+(KF.id?'编辑知识点':'新增知识点')+' <span class="hint" style="font-weight:400">必填：名称、适用车型、知识类型；其他可以后补</span></h2></div>'
   +'<div class="card frm">'+FR('名称','<input type="text" data-kf="name" value="'+esc(KF.name)+'" placeholder="一个能单独讲一次、单独出一道题的点，如：6.6kW 外放电" style="width:100%;max-width:460px">',{req:1,h:'太粗就拆，太细就并'})
   +FR('适用车型',carBox+'<div style="margin-top:8px"><input type="text" id="kf_newcar" placeholder="没有你要的车型？输入新车型名称" style="width:220px"> <button class="btn sm" data-act="kfAddCar">新增车型</button></div>',{req:1,h:'可以多选。同一个卖点同时适用多款车时，建一个点就够了，不用复制多条'})
   +FR('知识类型','<div class="rels">'+[['事实型','产品知识'],['技能型','销售动作']].map(x=>'<span class="'+(KF.type===x[0]?'on':'')+'" data-act="kfType" data-v="'+x[0]+'">'+x[1]+'</span>').join('')+'</div>',{req:1,h:'决定「怎么测」：产品知识用客观题，销售动作用演练。它不影响下面的能力项'})
   +FR('主要训练能力','<select data-wc="kfAb">'+ab.map(x=>'<option value="'+x.id+'" '+(KF.abId===x.id?'selected':'')+'>'+esc(x.root+' · '+x.name)+'</option>').join('')+'</select>'+(typeof aiKpAbilityAdviceHtml==='function'?aiKpAbilityAdviceHtml():''),{req:1,h:'决定「归到画像哪一维」：和岗位画像用同一套能力项，诊断、个人画像、效果看板才对得上。和上面的知识类型是两个维度'})
   +more
   +((KF.type==='事实型'&&!KF.tags.length)?'<div class="chk rec"><b>·</b><span>产品知识建议挂至少一个标签，否则标签筛选里容易漏掉它</span></div>':'')
   +(dup?'<div class="chk must"><b>!</b><span>已经有「'+esc(dup.name)+'」适用这些车型，不要重复建</span></div>':'')
   +'</div>';
}
A.kfSave=()=>{const n=(KF.name||'').trim();if(!n)return toast('请填写名称','err');if(!KF.cars.length)return toast('至少选一个适用车型','err');if(!KF.abId)return toast('请选择主要训练能力','err');
  if(!(KF.tags||[]).length)return toast('请至少挂一个标签：否则标签树和车型矩阵里会漏掉这个知识点','err');if(S.kps.some(k=>k.id!==KF.id&&k.name===n&&k.cars.some(c=>KF.cars.includes(c))))return toast('已有同名同车型的知识点','err');
  const syn=String(KF.syn||'').split(/[、,，\s]+/).filter(Boolean);KF.cars.forEach(kpEnsureCar);let k;
  if(KF.id){k=kp(KF.id);Object.assign(k,{name:n,type:KF.type,tags:KF.tags.slice(),syn,owner:KF.owner||null});kpApplyMeta(k,{cars:KF.cars,tags:KF.tags,abId:KF.abId,owner:KF.owner||null,pre:KF.pre,rel:KF.rel});if(!k.owner&&k.st==='启用'){k.st='停用';kpHist(k,'停用','没有负责人')}kpHist(k,'编辑')}
  else{const id='K'+(Math.max(0,...S.kps.map(x=>+String(x.id).replace(/\D/g,'')||0))+1);k={id,name:n,type:KF.type,tags:KF.tags.slice(),car:KF.cars[0],cars:KF.cars.slice(),syn,owner:KF.owner||null,st:KF.owner?'启用':'停用',ext:[],created:today,hist:[]};kpApplyMeta(k,{cars:KF.cars,tags:KF.tags,abId:KF.abId,owner:KF.owner||null,pre:KF.pre,rel:KF.rel});S.kps.push(k);kpHist(k,'新增',KF.owner?'':'没有负责人，先停用')}
  KF=null;UI.kid=k.id;UI.page='kp';toast(k.st==='启用'?'已保存并启用':'已保存，待指定负责人后启用','ok');render()};


A.kfAddCar=()=>{const n=((($('#kf_newcar')||{}).value)||'').trim();if(!n)return toast('请输入车型名称','err');if(!S.cfg.tax.car.includes(n))kpEnsureCar(n);if(!KF.cars.includes(n))KF.cars=KF.cars.filter(x=>x!=='通用车型').concat([n]);toast('已新增车型「'+n+'」并选中','ok');render()};

function kpRelHtml(k){
  if(!k)return '';
  const pre=(k.pre||[]).map(kp).filter(Boolean),rel=(k.rel||[]).map(kp).filter(Boolean);
  const revPre=S.kps.filter(x=>(x.pre||[]).includes(k.id)),revRel=S.kps.filter(x=>(x.rel||[]).includes(k.id));
  if(!pre.length&&!rel.length&&!revPre.length&&!revRel.length)return '';
  const L=(t,arr)=>arr.length?'<div style="margin:3px 0"><span class="hint">'+t+'</span>'+arr.map(x=>'<a class="link" data-act="kpOpen" data-id="'+x.id+'" style="margin-right:8px">'+esc(x.name)+'</a>').join('')+'</div>':'';
  return '<div class="card sd"><h3>知识关系 <span class="hint">前置 / 相关</span></h3>'+L('前置',pre)+L('相关',rel)+(revPre.length?'<div style="margin:3px 0"><span class="hint">被这些点当作前置</span>'+revPre.map(x=>'<a class="link" data-act="kpOpen" data-id="'+x.id+'" style="margin-right:8px">'+esc(x.name)+'</a>').join('')+'</div>':'')+(revRel.length?'<div style="margin:3px 0"><span class="hint">被这些点当作相关</span>'+revRel.map(x=>'<a class="link" data-act="kpOpen" data-id="'+x.id+'" style="margin-right:8px">'+esc(x.name)+'</a>').join('')+'</div>':'')+'</div>';
}
