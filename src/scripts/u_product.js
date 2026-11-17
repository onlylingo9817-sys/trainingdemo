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
  return '<div class="kp-panel"><div class="kp-ph"><h3>车型 × 标签:哪款车还缺内容</h3><span class="hint">格子里是「能上课的点 / 已建的点」。能上课 = 有负责人 + 有已上架讲解；点格子直接筛知识点</span></div>'
   +'<div class="tw"><table class="t nw kp-matrix"><tr><th>标签</th>'+cars.map(c=>'<th>'+esc(c)+'</th>').join('')+'</tr>'
   +cats.map(c=>'<tr><td><b>'+esc(c.name)+'</b></td>'+cars.map(car=>'<td>'+kpCellHtml(car,c.id)+'</td>').join('')+'</tr>').join('')
   +'</table></div><div class="hint" style="margin-top:6px">通用车型的知识点会计入每一款车；同一卖点同时适用 N90 和探索版时，只建一个知识点即可。</div></div>';
}
function kpTagTree(){
  const cars=kpCarsHost();
  const rows=PTAGS.filter(t=>t.lv<=2&&t.path.split('_').length<=2&&t.status!=='off');
  return '<div class="kp-panel"><div class="kp-ph"><h3>按标签看各车型完备率</h3><span class="hint">每个标签分支单独显示各车型的完备率；「能上课 / 已建」= 有负责人且有已上架讲解</span></div>'
   +'<div class="tw"><table class="t nw kp-tagtree"><tr><th>标签</th><th>已建</th><th>能上课</th><th>完备率</th>'+cars.map(c=>'<th>'+esc(c)+'</th>').join('')+'</tr>'
   +rows.map(t=>{const all=kpStatFor(t.id,'');const pct=all.n?Math.round(all.ready/all.n*100):0;return '<tr><td style="padding-left:'+(10+(t.lv-1)*18)+'px">'+(ptagKids(t.id).length?'<b>'+esc(t.name)+'</b>':esc(t.name))+'</td><td>'+all.n+'</td><td>'+all.ready+'</td><td><span class="tag '+(pct>=80?'ok':pct>0?'warn':'err')+'">'+(all.n?pct+'%':'未建')+'</span></td>'+cars.map(car=>{const st=kpStatFor(t.id,car);const g=kpCellGrade(st.ready,st.n);const ratio=st.n?Math.round(st.ready/st.n*100):0;return '<td><span class="kp-mx '+g+'"><b>'+(st.n?ratio+'%':'未建')+'</b><small>'+(st.n?st.ready+'/'+st.n:'')+'</small></span></td>'}).join('')+'</tr>'}).join('')
   +'</table></div><div class="hint" style="margin-top:6px">同一标签在 N90 也许已能上课，在 N70 仍是「未建」或 0%——多车型不再被一个总数掩盖。点上方「车型 × 标签」格子可直接筛到缺口。</div></div>';
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
  return srcBar('这页回答「我们的知识点清单全不全」。先看车型 × 标签矩阵，再看要补哪几个点；学员薄弱只放在页尾，用来决定先补哪块。')
   +kpNextCard()
   +'<div class="grid g4" style="margin-bottom:16px">'+metric('在售车型',kpCarsHost().length,'N70 / N90 / 探索版 / 其他')+metric('已启用知识点',act.length,'停用 '+S.kps.filter(k=>k.st==='停用').length+' 个')+metric('能上课',ready+' / '+act.length,'有负责人 + 已上架讲解')+metric('缺可用讲解',noExp,'这 '+noExp+' 个要先补内容')+'</div>'
   +kpCarMatrix()+kpIssueList()+kpTagTree()
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
  const so=(key,label,arr)=>'<div class="fi2"><label>'+label+'</label><select data-wc="kpset" data-k="'+key+'"><option value="" '+(!f[key]?'selected':'')+'>全部</option>'+arr.map(x=>{const v=String(x.v||x),n=x.n||x;return '<option value="'+esc(v)+'" '+(String(f[key]||'')===v?'selected':'')+'>'+esc(n)+'</option>'}).join('')+'</select></div>';
  const tags=tagOptions({});
  const filter='<div class="kp-panel"><div class="kp-ph"><h3>知识点库</h3><span class="hint">按左侧标签、车型、动作筛；勾选后可批量指派负责人 / 批量启停</span></div><div class="filg">'
   +'<div class="fi2"><label>搜索</label><input data-wc="kpq" value="'+esc(f.q||'')+'" placeholder="名称 / 同义词"></div>'
   +'<div class="fi2"><label>标签</label><select data-wc="kpset" data-k="tag"><option value="" '+(!f.tag?'selected':'')+'>全部</option><option value="__none" '+(f.tag==='__none'?'selected':'')+'>未挂标签</option>'+tagOptions({}).map(t=>'<option value="'+t.id+'" '+(f.tag===t.id?'selected':'')+'>'+'　'.repeat(t.lv-1)+esc(t.name)+'</option>').join('')+'</select></div>'
   +so('car','适用车型',cars)+so('dim','主要训练能力',ab.map(x=>x.name))
   +so('owner','负责人',kpOwners().concat(['(无)']).map(x=>({v:x,n:x})))
   +'<div class="fi2"><label>状态</label><select data-wc="kpset" data-k="lv"><option value="" '+(!f.lv?'selected':'')+'>全部</option>'+['只看有缺口','只看待补','只看完备'].map(x=>'<option '+(f.lv===x?'selected':'')+'>'+x+'</option>').join('')+'</select></div>'
   +'<div class="fi2" style="align-self:end"><button class="btn" data-act="kpFclr">清除</button></div></div></div>';
  const bulk='<div class="kp-bulkbar"><b>已选 '+selN+' 个</b><select id="kp_bulk_owner"><option value="">批量指定负责人…</option>'+kpOwners().map(x=>'<option>'+esc(x)+'</option>').join('')+'</select><button class="btn sm" data-act="kpBulkOwner">指定</button><button class="btn sm" data-act="kpBulkOn">批量启用</button><button class="btn sm" data-act="kpBulkOff">批量停用</button>'+(selN?'<button class="link" data-act="kpSelClear">取消选择</button>':'<span class="hint">先勾选左侧复选框，再点批量操作</span>')+'</div>';
  return '<div class="tag-layout">'+tagTreeHtml(f.tag||'',{}) + '<div>'+filter+bulk+'<div class="kp-panel"><div class="tw"><table class="t nw stk kp-lib"><tr><th style="width:28px"><input type="checkbox" data-wc="kpSelAll" '+(rows.length&&rows.every(k=>sel[k.id])?'checked':'')+'></th><th>知识点</th><th>标签</th><th>适用车型</th><th>负责人</th><th>状态</th><th>操作</th></tr>'
   +rows.map(k=>{const h=kpHealth(k);const m=kpMounted(k);return '<tr class="'+(k.st==='停用'?'off':'')+'"><td><input type="checkbox" data-wc="kpSel" data-id="'+k.id+'" '+(sel[k.id]?'checked':'')+'></td><td style="white-space:normal;min-width:180px"><a class="link" data-act="kpOpen" data-id="'+k.id+'">'+esc(k.name)+'</a>'+(k.st==='停用'?' <span class="tag">停用</span>':'')+'<div class="hint">'+k.id+' · '+kpTypeText(k)+' · '+esc(kpAbText(k))+'</div></td><td style="white-space:normal;min-width:150px">'+(kpTagNames(k).map(p=>'<span class="tag" style="margin:0 3px 3px 0">'+esc(p)+'</span>').join('')||'<span class="hint">未挂</span>')+'</td><td style="white-space:normal;min-width:120px">'+kpCars(k).map(c=>kpCarChip(c)).join('')+'</td><td>'+(k.owner?esc(k.owner):'<span class="tag err">无</span>')+'</td><td><span class="kp-dots">'+kpDots(h)+'</span> <span class="hint">'+(kpReady(k)?'能上课':'缺口')+'</span></td><td><a class="link" data-act="kpOpen" data-id="'+k.id+'">查看</a></td></tr>'}).join('')
   +'</table>'+(rows.length?'':'<div class="empty">没有符合条件的知识点，换个标签或新建一个。</div>')+'</div></div>'+'</div></div>';
}
function kpStatForKp(k,car){if(!kpCarsHas(k,car))return '—';return kpReady(k)?'✓':'缺'}
function kpImportResultHtml(){
  const r=UI.sel.kpImportResult;if(!r)return '';
  return '<div class="kp-import-result'+(r.total?' warn':' ok')+'"><b>上次导入：成功 '+r.ok+' 条'+(r.total?'，跳过 '+r.total+' 条':'')+'</b>'+(r.errs.length?'<ul>'+r.errs.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'')+(r.total>r.errs.length?'<div class="hint">…还有 '+(r.total-r.errs.length)+' 条</div>':'')+'<a class="link" data-act="kpClearImportResult">收起</a></div>';
}
A.kpClearImportResult=()=>{UI.sel.kpImportResult=null;render()};
function kpBatchPage(){
  const kpc=UI.sel.kpc||{};
  const cars=kpCarsHost();
  const ab=kpAbRows();
  return '<div class="kp-batch">'
   +'<div class="kp-panel"><div class="kp-ph"><h3>从 Excel / CSV 批量导入</h3><span class="hint">适合新车上市一次导入几十个知识点；先下载模板，按列填写后上传或直接粘贴</span></div>'
   +'<div class="kp-actions"><button class="btn" data-act="kpTpl">下载 CSV 模板</button><button class="btn" data-act="kpSample">载入示例 CSV</button><input type="file" accept=".csv,text/csv" id="kp_file" data-wc="kpImportFile" style="display:none"><button class="btn pri" data-act="kpPickFile">选择 CSV 文件</button></div>'
   +'<div class="hint" style="margin:10px 0">列：名称 / 适用车型（多个用顿号）/ 标签（如 能源_外放电）/ 主要训练能力 / 负责人 / 同义词 / 状态。车型或标签不存在的行会被跳过并报告。</div>'
   +'<textarea id="kp_csv" style="width:100%;min-height:170px;font:12px/1.6 Menlo,monospace" placeholder="先点「载入示例 CSV」看格式；也可以直接把 Excel 里的列复制过来。\n\n名称,适用车型,标签,主要训练能力,负责人,同义词,状态"></textarea>'
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
  let t=curTab('catalog',KP_TABS);if(KP_TAB_ALIAS[t])t=KP_TAB_ALIAS[t];
  if(t==='题库')return '<div class="crumb"><a data-act="go" data-p="catalog" data-t="知识点库">知识点</a> / 题库</div>'+kpQuiz();
  if(t==='演练')return '<div class="crumb"><a data-act="go" data-p="catalog" data-t="知识点库">知识点</a> / 情景演练</div>'+kpDrills();
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
A.kpOpenBatch=()=>{UI.tab.catalog=KP_TAB_BATCH;render();$('#main').scrollTop=0};
A.kpBulkTab=()=>{UI.tab.catalog=KP_TAB_LIB;UI.sel.kpf={};render()};
A.kpJump=el=>{const d=el.dataset;if(d.tab){if(d.tab==='未挂载内容')return A.kpGoMount();UI.tab.catalog=KP_TAB_ALIAS[d.tab]||d.tab;return render()}UI.sel.kpf={};if(d.fk)UI.sel.kpf[d.fk]=d.fv;if(d.fk2)UI.sel.kpf[d.fk2]=d.fv2;UI.tab.catalog=KP_TAB_LIB;render();$('#main').scrollTop=0};

A.kpSel=el=>{const s=kpSelSet();s[el.dataset.id]=el.checked;render()};
A.kpSelAll=el=>{const s=kpSelSet();const f=kpLibFilter();const rows=S.kps.filter(k=>!f.car||kpCarsHas(k,f.car));rows.forEach(k=>s[k.id]=el.checked);render()};
A.kpSelClear=()=>{UI.sel.kpSel={};render()};
A.kpBulkOwner=()=>{const o=$('#kp_bulk_owner').value;if(!o)return toast('先选负责人','err');const s=kpSelSet();let n=0;Object.keys(s).filter(id=>s[id]).forEach(id=>{const k=kp(id);if(k){k.owner=o;kpHist(k,'批量指定负责人',o);n++}});toast('已为 '+n+' 个知识点指定负责人='+o,'ok');UI.sel.kpSel={};render()};
A.kpBulkOn=()=>{const s=kpSelSet();let n=0,skip=0;Object.keys(s).filter(id=>s[id]).forEach(id=>{const k=kp(id);if(!k)return;if(!k.owner){skip++;return}k.st='启用';kpHist(k,'批量启用');n++});toast('已启用 '+n+' 个'+(skip?'，'+skip+' 个无负责人跳过':''),skip?'warn':'ok');UI.sel.kpSel={};render()};
A.kpBulkOff=()=>{const s=kpSelSet();let n=0;Object.keys(s).filter(id=>s[id]).forEach(id=>{const k=kp(id);if(k){k.st='停用';kpHist(k,'批量停用');n++}});toast('已停用 '+n+' 个','ok');UI.sel.kpSel={};render()};

A.kpTpl=()=>{const rows=[['名称','适用车型','标签','主要训练能力','负责人','同义词','状态'],['车载冰箱','N90 Max、N90 Max 探索版','内饰_车内冰箱','卖点转译','王磊','压缩机冰箱、冷冻','启用'],['迎宾踏板','N70系列','外饰_迎宾踏板','卖点转译','','电动侧踏、上下车','停用']];const csv='\ufeff'+rows.map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='知识点导入模板.csv';document.body.appendChild(a);a.click();a.remove()};
A.kpSample=()=>{$('#kp_csv').value='名称,适用车型,标签,主要训练能力,负责人,同义词,状态\n车内冰箱,N90 Max、N90 Max 探索版,内饰_车内冰箱,卖点转译,王磊,压缩机冰箱、冷冻,启用\n迎宾踏板,N70系列,外饰_迎宾踏板,卖点转译,,电动侧踏、上下车,停用\n车载香氛,通用车型,内饰_空间布局,场景匹配,李娜,香氛、气味,停用';toast('已载入示例，点「校验并导入」','ok')};
A.kpPickFile=()=>$('#kp_file').click();
A.kpImportFile=el=>{const f=el.files&&el.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('#kp_csv').value=r.result;A.kpImportRun()};r.readAsText(f,'utf-8')};
function kpCsvRows(text){
  const rows=[];let row=[],cell='',q=false;const s=String(text||'').replace(/^\ufeff/,'');
  for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'){if(q&&s[i+1]==='"'){cell+='"';i++}else q=!q}else if(c===','&&!q){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&s[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x!==''))rows.push(row);row=[];cell=''}else cell+=c}
  row.push(cell);if(row.some(x=>x!==''))rows.push(row);return rows;
}
A.kpImportRun=()=>{const rows=kpCsvRows(($('#kp_csv')||{}).value||'');if(rows.length<2)return toast('没有可导入的行','err');const head=rows[0].map(x=>x.trim());const col=(r,n)=>{const i=head.indexOf(n);return i>=0?(r[i]||'').trim():''};let ok=0;const errs=[];rows.slice(1).forEach((r,i)=>{const name=col(r,'名称');if(!name){errs.push('第 '+(i+2)+' 行：名称为空');return}
  if(S.kps.some(k=>k.name===name&&k.cars.some(c=>col(r,'适用车型').includes(c)))){errs.push('第 '+(i+2)+' 行：已存在同名同车型「'+name+'」');return}
  const cars=col(r,'适用车型').split(/[、,，/;；]+/).map(x=>x.trim()).filter(Boolean);if(!cars.length){errs.push('第 '+(i+2)+' 行：适用车型为空');return}
  const tagPath=col(r,'标签');const tag=tagPath?ptagByPath(tagPath):null;if(tagPath&&!tag){errs.push('第 '+(i+2)+' 行：找不到标签「'+tagPath+'」');return}
  const abname=col(r,'主要训练能力');const ab=kpAbRows().find(x=>x.name===abname||x.root===abname||(abname==='卖点转译'&&x.name==='场景化讲车'));if(abname&&!ab){errs.push('第 '+(i+2)+' 行：找不到主要训练能力「'+abname+'」，可用：'+kpAbRows().map(x=>x.name).join(' / '));return}
  const owner=col(r,'负责人')||null;const syn=col(r,'同义词').split(/[、,，]+/).filter(Boolean);const id='K'+(Math.max(0,...S.kps.map(x=>+x.id.slice(1)))+1);
  cars.forEach(kpEnsureCar);const k={id,name,type:(tag?'事实型':'技能型'),tags:tag?[tag.id]:[],car:cars[0],cars,syn,owner,st:col(r,'状态')==='启用'&&owner?'启用':'停用',ext:[],created:today,hist:[]};kpApplyMeta(k,{cars,tags:k.tags,abId:ab?ab.id:null,owner});S.kps.push(k);kpHist(k,'批量导入',owner?'':'没有负责人，先停用');ok++});
  render();UI.sel.kpImportResult={ok,errs:errs.slice(0,8),total:errs.length};toast('导入完成：成功 '+ok+' 条'+(errs.length?'，跳过 '+errs.length+' 条（查看下方明细）':''),errs.length?'warn':'ok');
};
A.kpClSet=()=>{};
A.kpClonePreview=()=>{const from=$('#kp_clone_from').value,to=($('#kp_clone_to').value||'').trim();if(!to)return toast('请填写新车型名称','err');if(kpCarsHost().includes(to))return toast('这个车型已经有知识点了，直接看知识点库','err');const count=S.kps.filter(k=>k.st==='启用'&&kpCars(k).includes(from)).length;UI.sel.kpc={from,to,count};render()};
A.kpCloneRun=()=>{let st=UI.sel.kpc||{};if(!st.to){st={from:$('#kp_clone_from').value,to:($('#kp_clone_to').value||'').trim(),count:0};}if(!st.to)return toast('请填写新车型名称','err');if(kpCarsHost().includes(st.to))return toast('这个车型已经有知识点了','err');const src=S.kps.filter(k=>k.st==='启用'&&kpCars(k).includes(st.from));if(!src.length)return toast('源车型没有可复制的知识点','err');kpEnsureCar(st.to);let n=Math.max(0,...S.kps.map(k=>+String(k.id).replace(/\D/g,'')||0));const ids=[];src.forEach(k=>{const cars=[...new Set(kpCars(k).concat(st.to))];const nk={id:'K'+(++n),name:k.name,type:k.type,tags:(k.tags||[]).slice(),car:cars[0],cars,syn:(k.syn||[]).slice(),owner:null,st:'停用',ext:[],created:today,hist:[{t:today,who:meShort(),act:'克隆自 '+k.id,note:'新车型骨架，待补负责人和讲解'}]};kpApplyMeta(nk,{cars,tags:nk.tags,abId:(k.dims&&k.dims.Dab||[])[0],owner:null});S.kps.push(nk);ids.push(nk.id)});UI.sel.kpc={from:st.from,to:st.to,count:0};toast('已克隆 '+ids.length+' 个知识点到「'+st.to+'」，全部停用待补','ok');UI.tab.catalog=KP_TAB_LIB;UI.sel.kpf={car:st.to};render()};
A.kpQuickAdd=()=>{const name=($('#kp_multi_name')||{}).value||'';const tag=$('#kp_multi_tag')?$('#kp_multi_tag').value:'';const ab=$('#kp_multi_ab')?$('#kp_multi_ab').value:'';const owner=$('#kp_multi_owner')?$('#kp_multi_owner').value:'';const cars=[...document.querySelectorAll('.kp_multi_car:checked')].map(x=>x.value);if(!name.trim())return toast('请填写名称','err');if(!cars.length)return toast('至少选一个适用车型','err');if(S.kps.some(k=>k.name===name.trim()&&k.cars.some(c=>cars.includes(c))))return toast('同名同车型已经有知识点了','err');cars.forEach(kpEnsureCar);const id='K'+(Math.max(0,...S.kps.map(x=>+String(x.id).replace(/\D/g,'')||0))+1);const k={id,name:name.trim(),type:tag?'事实型':'技能型',tags:tag?[tag]:[],car:cars[0],cars,syn:[],owner:owner||null,st:'启用',ext:[],created:today,hist:[]};kpApplyMeta(k,{cars,tags:k.tags,abId:ab||null,owner:owner||null});S.kps.push(k);kpHist(k,'新增',owner?'':'没有负责人');toast('已建「'+name.trim()+'」，同时适用 '+cars.join('、'),'ok');UI.tab.catalog=KP_TAB_LIB;UI.sel.kpf={};render()};

/* 编辑页:一套能力口径 + 多车型 */
A.kpNew=()=>{KF={id:null,name:'',type:'事实型',cars:['通用车型'],tags:[],abId:(kpAbRows()[0]||{}).id||'',syn:'',owner:kpDefOwner(),more:false};UI.page='kpform';render()};
A.kpEdit=()=>{const k=kp(UI.kid);KF={id:k.id,name:k.name,type:k.type,cars:kpCars(k).slice(),tags:(k.tags||[]).slice(),abId:(k.dims&&k.dims.Dab||[])[0]||'',syn:(k.syn||[]).join('、'),owner:k.owner||'',more:true};UI.page='kpform';render()};
A.kfCar=el=>{const v=el.value;if(el.checked){if(!KF.cars.includes(v))KF.cars.push(v)}else KF.cars=KF.cars.filter(x=>x!==v);if(!KF.cars.length)KF.cars=['通用车型'];render()};
A.kfAb=el=>{KF.abId=el.value;render()};
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
   +FR('负责人','<select data-wc="kfset" data-k="owner"><option value="">暂不指定（保存后停用）</option>'+kpOwners().map(x=>'<option '+(KF.owner===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select>',{h:'没有负责人不能启用'})+'</div>';
  return crumb('<a data-act="go" data-p="catalog">知识点</a> / '+(KF.id?'编辑 '+KF.id:'新增知识点'))+'<div class="ph"><h2>'+(KF.id?'编辑知识点':'新增知识点')+' <span class="hint" style="font-weight:400">必填：名称、适用车型、知识类型；其他可以后补</span></h2></div>'
   +'<div class="card frm">'+FR('名称','<input type="text" data-kf="name" value="'+esc(KF.name)+'" placeholder="一个能单独讲一次、单独出一道题的点，如：6.6kW 外放电" style="width:100%;max-width:460px">',{req:1,h:'太粗就拆，太细就并'})
   +FR('适用车型',carBox,{req:1,h:'可以多选。同一个卖点同时适用多款车时，建一个点就够了，不用复制多条'})
   +FR('知识类型','<div class="rels">'+[['事实型','产品知识'],['技能型','销售动作']].map(x=>'<span class="'+(KF.type===x[0]?'on':'')+'" data-act="kfType" data-v="'+x[0]+'">'+x[1]+'</span>').join('')+'</div>',{req:1,h:KF.type==='事实型'?'产品知识：记住这款车有什么、怎么讲':'销售动作：探需、讲车、处理异议等，看练得怎么样'})
   +FR('主要训练能力','<select data-wc="kfAb">'+ab.map(x=>'<option value="'+x.id+'" '+(KF.abId===x.id?'selected':'')+'>'+esc(x.root+' · '+x.name)+'</option>').join('')+'</select>'+(typeof aiKpAbilityAdviceHtml==='function'?aiKpAbilityAdviceHtml():''),{req:1,h:'和岗位画像使用同一套能力项；这样诊断、画像、效果看板才对得上'})
   +more
   +((KF.type==='事实型'&&!KF.tags.length)?'<div class="chk rec"><b>·</b><span>产品知识建议挂至少一个标签，否则标签筛选里容易漏掉它</span></div>':'')
   +(dup?'<div class="chk must"><b>!</b><span>已经有「'+esc(dup.name)+'」适用这些车型，不要重复建</span></div>':'')
   +'</div><div class="dock"><span class="sp"></span><button class="btn" data-act="kfCancel">取消</button><button class="btn pri" data-act="kfSave">保存</button></div>';
}
A.kfSave=()=>{const n=(KF.name||'').trim();if(!n)return toast('请填写名称','err');if(!KF.cars.length)return toast('至少选一个适用车型','err');if(!KF.abId)return toast('请选择主要训练能力','err');if(S.kps.some(k=>k.id!==KF.id&&k.name===n&&k.cars.some(c=>KF.cars.includes(c))))return toast('已有同名同车型的知识点','err');
  const syn=String(KF.syn||'').split(/[、,，\s]+/).filter(Boolean);KF.cars.forEach(kpEnsureCar);let k;
  if(KF.id){k=kp(KF.id);Object.assign(k,{name:n,type:KF.type,tags:KF.tags.slice(),syn,owner:KF.owner||null});kpApplyMeta(k,{cars:KF.cars,tags:KF.tags,abId:KF.abId,owner:KF.owner||null});if(!k.owner&&k.st==='启用'){k.st='停用';kpHist(k,'停用','没有负责人')}kpHist(k,'编辑')}
  else{const id='K'+(Math.max(0,...S.kps.map(x=>+String(x.id).replace(/\D/g,'')||0))+1);k={id,name:n,type:KF.type,tags:KF.tags.slice(),car:KF.cars[0],cars:KF.cars.slice(),syn,owner:KF.owner||null,st:KF.owner?'启用':'停用',ext:[],created:today,hist:[]};kpApplyMeta(k,{cars:KF.cars,tags:KF.tags,abId:KF.abId,owner:KF.owner||null});S.kps.push(k);kpHist(k,'新增',KF.owner?'':'没有负责人，先停用')}
  KF=null;UI.kid=k.id;UI.page='kp';toast(k.st==='启用'?'已保存并启用':'已保存，待指定负责人后启用','ok');render()};

