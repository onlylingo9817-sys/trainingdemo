/* ================= 列表表格层 v2：内容中心 8 列 / 知识点库 6 列 =================
 * 对齐 docs/UI-DESIGN-KP-v2.md 第九章（列定义对照表）。
 * 本文件只做展示与筛选状态，不改数据模型：
 *  - 适用车型列先吃 content.car（单值），渲染按多值写；B1 落地后只换数据源（car → carScope[]）。
 *  - 空车型一律渲染「通用」chip，不留白（口径级决定）。
 *  - 有效期在「状态 · 上架」列画时效点：绿=正常 / 黄=7 天内到期 / 红=已过期。
 * 加载在 index.html 的 x_kp_v12 / y_kp_ux 之后、f_rn.js 之前。
 */

/* ---------- 1. 车型与状态小件 ---------- */
function carListOf(o){
  if(!o)return ['通用车型'];
  if(Array.isArray(o.carScope)&&o.carScope.length)return o.carScope.slice();
  if(Array.isArray(o.cars)&&o.cars.length)return o.cars.slice();
  if(typeof o.car==='string'&&o.car)return [o.car];
  return ['通用车型'];
}
function carShortName(x){
  if(x==='通用车型')return '通用';
  return String(x).replace(/^澎程\s*/,'').replace(/^小米\s*/,'');
}
function carChipsHtml(list,max){
  const L=[...new Set((list||[]).filter(Boolean))];
  const arr=L.length?L:['通用车型'];
  const m=max==null?2:max;
  return arr.slice(0,m).map(x=>'<span class="tag car-chip'+(x==='通用车型'?' gen':'')+'" title="'+esc(x)+'">'+esc(carShortName(x))+'</span>').join('')
    +(arr.length>m?'<span class="hint">+'+(arr.length-m)+'</span>':'');
}
function expDotHtml(c){
  if(!c)return '';
  const es=expState(c);
  const cls=es==='已过期'?'err':es==='即将到期'?'warn':'ok';
  const tip=c.expire?(es+' · 有效期 '+c.expire+(expDays(c)!=null?'（'+expDays(c)+' 天）':'')):'长期有效';
  return '<i class="ux-dot '+cls+'" title="'+esc(tip)+'"></i>';
}
function kindBadge(kind){
  if(kind==='题')return '<span class="tag blue">题</span>';
  if(kind==='演练')return '<span class="tag" style="background:#f3e8ff;color:#7b3fc4">演练</span>';
  return kindTag(kind);
}

/* ---------- 2. 内容中心：筛选状态归一 ---------- */
const C_VIEWS=[['all','全部'],['unmounted','未挂载'],['review','待审核'],['tostage','待上架'],['expiring','即将到期'],['mine','我的草稿']];
function cNormState(){
  const caf=UI.sel.caf||{};const q=UI.sel.cq||(UI.sel.cq={});
  if(caf.k){q.kind=caf.k;delete caf.k}
  if(caf.kp){q.kp=caf.kp;delete caf.kp}
  if(caf.st){q.st=caf.st;delete caf.st}
  if(typeof caf.q==='string'&&caf.q){UI.sel.cqs=caf.q;delete caf.q}
  if(caf.tag){UI.sel.cTagIgnored=caf.tag;delete caf.tag}
  delete UI.sel.cadv;
}
function cPresetApply(name){
  const q=UI.sel.cq||(UI.sel.cq={});UI.sel.cPreset=name;
  delete q.kp;delete q.st;delete q.pub;delete q.exp;delete q.mine;
  if(name==='unmounted')q.kp='未挂载';
  if(name==='review')q.st='审核中';
  if(name==='tostage'){q.st='已定稿';q.pub='未上架'}
  if(name==='expiring')q.exp='即将到期';
  if(name==='mine'){q.mine=1;q.st='草稿'}
  UI.sel.clist={page:1,size:20};
}
A.cPreset=el=>{cPresetApply(el.dataset.v);render()};
A.cPresetClear=()=>{UI.sel.cPreset='';UI.sel.cq={};UI.sel.cqs='';UI.sel.clist={page:1,size:20};render()};
A.cTagInfo=()=>openDlg('标签树怎么处理','<div style="line-height:1.9">内容与知识点里的<b>标签数据已全部为空</b>（88 条内容 / 68 条知识点均为 0 个标签），标签体系已在 v1.2 取消，改用<b>知识域 + 车型树</b>表达分类。<br><br>所以这一栏点开只会得到空列表。下一步会把左侧标签树换成「知识域 / 车型」两棵树；在此之前保留一行说明，不再渲染 42 个空节点。</div>','<button class="btn pri" data-act="close">知道了</button>');

/* ---------- 3. 内容中心：统一列表（话术 / 课程 / 题 / 演练） ---------- */
function cRowOf(r){
  const isC=r.k==='话术'||r.k==='课程';const o=r.raw||{};
  return {k:r.k,id:r.id,title:r.title,st:r.st,kp:r.kp||[],pub:r.pub||'',who:r.who||'',use:r.use||0,
    car:carListOf(o),exp:isC&&o.expire?o.expire:'',raw:o,isC};
}
function cRowMatch(row,q,kw){
  if(q.kind&&row.k!==q.kind)return false;
  if(q.st&&row.st!==q.st)return false;
  if(q.kp){
    if(q.kp==='未挂载'){if(!row.isC||row.kp.length)return false}
    else if(!row.kp.includes(q.kp))return false;
  }
  if(q.pub&&row.isC&&row.pub!==q.pub)return false;
  if(q.car&&row.isC&&!row.car.includes(q.car))return false;
  if(q.car&&!row.isC&&typeof kpAssetFitsCar==='function'&&!kpAssetFitsCar(row.raw||{carScope:row.car},q.car))return false;
  if(q.used&&!(row.use>0))return false;
  if(q.mine&&row.raw&&row.raw.creator&&row.raw.creator!==meFull())return false;
  if(q.exp){
    const es=row.isC?expState(row.raw):'有效';
    if(es!==q.exp)return false;
  }
  if(kw&&!(String(row.title||'').includes(kw)||row.id===kw))return false;
  return true;
}
function cListU(V){
  cNormState();
  const q=UI.sel.cq||(UI.sel.cq={});const kw=(UI.sel.cqs||'').trim();
  const preset=UI.sel.cPreset||(q.kp==='未挂载'?'unmounted':q.exp==='即将到期'?'expiring':q.st==='审核中'?'review':q.pub==='未上架'?'tostage':q.mine?'mine':'');
  if(preset&&preset!==UI.sel.cPreset)UI.sel.cPreset=preset;
  const all=cAll().map(cRowOf);
  const rows=all.filter(r=>cRowMatch(r,q,kw))
    .sort((x,y)=>CSTATE.indexOf(x.st)-CSTATE.indexOf(y.st)||(x.title||'').localeCompare(y.title||'','zh'));
  const pg=lstPage('call',rows,20);const picked=lstPicked('call');
  const viewBar='<div class="ux-viewbar"><span>常用视图</span>'+C_VIEWS.map(v=>{
    const n=all.filter(r=>{const t={};if(v[0]==='all')return true;if(v[0]==='unmounted')return r.isC&&!r.kp.length;if(v[0]==='review')return r.st==='审核中';if(v[0]==='tostage')return r.isC&&r.st==='已定稿'&&r.pub==='未上架';if(v[0]==='expiring')return r.isC&&expState(r.raw)==='即将到期';if(v[0]==='mine')return r.st==='草稿';return true}).length;
    return '<button type="button" class="kp-view '+(preset===v[0]?'on':'')+'" data-act="cPreset" data-v="'+v[0]+'">'+v[1]+' '+n+'</button>';
  }).join('')+(preset?'<button type="button" class="link" data-act="cPresetClear">清除视图</button>':'')+'</div>';
  const so=(k,l,opts,nw)=>'<div class="fi2"><label>'+l+(nw?NEW:'')+'</label><select data-wc="cqset" data-k="'+k+'"><option value="">全部</option>'+opts.map(o=>'<option '+(q[k]===o?'selected':'')+'>'+o+'</option>').join('')+'</select></div>';
  const fil='<div class="card c-filter"><div class="filg"><div class="fi2"><label>标题 / 题干 / ID</label><input data-wc="cqkw" value="'+esc(kw)+'" placeholder="关键词"></div>'
    +so('kind','性质',['话术','课程','题','演练'])
    +'<div class="fi2"><label>知识点</label><select data-wc="cqset" data-k="kp"><option value="">全部</option><option '+(q.kp==='未挂载'?'selected':'')+'>未挂载</option>'+S.kps.map(k=>'<option value="'+k.id+'" '+(q.kp===k.id?'selected':'')+'>'+esc(kpLabel(k))+'</option>').join('')+'</select></div>'
    +so('st','状态',['草稿','审核中','已定稿','已停用','已归档'])
    +so('pub','上架',PSTATE)+so('car','适用车型',['通用车型'].concat(V23_CAR_LEAVES))
    +'<div class="fi2" style="align-self:end"><button class="btn pri sm" data-act="cqSearch">查询</button> <button class="btn sm" data-act="cqReset">重置</button></div></div></div>';
  const sortSel='<div class="fi2"><label>排序</label><select data-wc="cqs2">'
    +[['updated:desc','最近更新'],['use:desc','引用次数多'],['down:desc','点踩率高'],['expire:asc','最快到期']].map(x=>'<option value="'+x[0]+'" '+((UI.sel.cqs2||'updated:desc')===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></div>';
  const tool='<div class="ux-toolbar">'+viewBar+'<span style="flex:1"></span>'+sortSel
    +'<span class="hint">共 '+rows.length+' 条</span>'
    +'<div class="fi2"><label>每页</label><select data-wc="casize">'+[20,50,100].map(n=>'<option '+(pg.size===n?'selected':'')+'>'+n+'</option>').join('')+'</select></div>'
    +lstCsvBtn(['性质','ID','标题','知识点','适用车型','状态','上架','使用','负责人'],[['性质','ID','标题','知识点','适用车型','状态','上架','使用','负责人']].concat(rows.map(r=>[r.k,r.id,r.title,(r.kp||[]).map(id=>(kp(id)||{}).name||'').join('、'),(r.car||[]).join('、'),r.st,r.pub||'',r.use||0,r.who||''])),'内容清单')
    +'</div>';
  const batch=picked.length?'<div class="lst-batch"><b>已选 '+picked.length+' 条</b><button class="btn sm" data-act="cBulkSubmit">批量提交审核</button><button class="btn sm" data-act="lstSelClear" data-k="clist">清空选择</button></div>':'';
  const narrow=(typeof window!=='undefined')&&window.innerWidth<1100;/* 窄屏：让出「引用·使用 / 负责人」两列，保证标题与状态不被挤没 */
  const cols=narrow?[36,0,110,86,160,72]:[36,0,116,92,140,96,70,72];
  const head='<tr><th style="width:36px"><input type="checkbox" data-act="lstSelAll" data-k="call" data-ids="'+esc(JSON.stringify(pg.rows.map(r=>r.id)))+'" '+(pg.rows.length&&pg.rows.every(r=>picked.includes(r.id))?'checked':'')+'></th>'
    +'<th>内容 / 性质</th><th>知识点</th><th>适用车型</th><th>状态 · 上架</th>'+(narrow?'':'<th>引用·使用</th><th>负责人</th>')+'<th>操作</th></tr>';
  const row=r=>{
    const act=r.k==='题'?['qOpen','编辑']:r.k==='演练'?['drOpen','编辑']:['cView','查看'];
    const kpCell=r.kp.length?r.kp.slice(0,3).map(id=>{const k=kp(id);return k?'<a class="link kp-mini" data-act="kpOpen" data-id="'+k.id+'">'+esc(k.name.length>8?k.name.slice(0,8)+'…':k.name)+'</a>':''}).join('')+(r.kp.length>3?'<span class="hint">+'+r.kp.length+'</span>':''):'<span class="tag err">未挂载</span>';
    const carCell=carChipsHtml(r.car,2);
    const statusCell='<div class="c-status"><div>'+kindBadge(r.k)+' <span class="tag '+(r.st==='已定稿'?'ok':r.st==='审核中'?'warn':r.st==='已归档'?'':'blue')+'">'+esc(r.st)+'</span></div>'
      +(r.isC?'<div class="sub">'+pubchip(r.pub)+expDotHtml(r.raw)+(typeof rvChip==='function'?rvChip('content',r.id):'')+'</div>':'')+'</div>';
    const useCell=r.isC?('<span class="hint" title="被 '+contentUse(r.id)+' 个学习项目引用">用 '+(r.use||0)+' · 引 '+contentUse(r.id)+'</span>'):('<span class="hint">用 '+(r.use||0)+'</span>');
    return '<tr><td><input type="checkbox" data-act="lstSel" data-k="call" data-id="'+r.id+'" '+(picked.includes(r.id)?'checked':'')+'></td>'
      +'<td class="c-title"><a class="link" data-act="'+act[0]+'" data-id="'+r.id+'">'+esc(r.title)+'</a>'+(r.isC&&typeof kpPlaceholderTag==='function'?kpPlaceholderTag(r.raw):'')+'<div class="hint">'+r.id+' · '+esc(r.k==='题'?'题':r.k==='演练'?'演练':(r.raw.type||r.k))+(r.isC?' · v'+r.raw.ver:'')+'</div></td>'
      +'<td>'+kpCell+'</td><td>'+carCell+'</td><td>'+statusCell+'</td>'+(narrow?'':'<td>'+useCell+'</td><td>'+(r.who?esc(r.who):'<span class="hint">—</span>')+'</td>')
      +'<td><a class="link" data-act="'+act[0]+'" data-id="'+r.id+'">'+act[1]+'</a></td></tr>';
  };
  const body=rows.length?'<div class="tw c-tw"><table class="t stk c-table"><colgroup>'+cols.map(w=>'<col'+(w?' style="width:'+w+'px"':'')+'>').join('')+'</colgroup>'+head+pg.rows.map(row).join('')+'</table></div>'+lstPager('call',pg)+batch
    :(all.length?cta('没有符合条件的内容','调整筛选或清除视图再试。','<button class="btn" data-act="cPresetClear">清除筛选</button><button class="btn pri" data-act="cNew">新增内容</button>'):cta('还没有内容','先新增一条话术或课程，或从线下资料导入。','<button class="btn pri" data-act="cNew">新增内容</button>'));
  const tagbar='<div class="ux-tagbar"><b>按标签浏览</b><span class="hint">标签体系已停用，42 个标签下均无内容</span><a class="link" data-act="cTagInfo">了解替代方案（知识域 / 车型树）</a>'+(UI.role.type==='hq'?'<span style="flex:1"></span><a class="link" data-act="tagOpenManage">管理标签</a>':'')+'</div>';
  return tagbar+fil+tool+body;
}
A.lstCsvC=()=>toast('导出功能沿用列表筛选结果（Demo 环境仅提示）','');
A.cafAdv=()=>{cNormState();render()};
A.cafAdvOff=()=>{render()};
A.cafK=el=>{const q=UI.sel.cq||(UI.sel.cq={});if(el.dataset.v)q.kind=el.dataset.v;else delete q.kind;UI.sel.cPreset='';render()};
A.cafset=el=>{const q=UI.sel.cq||(UI.sel.cq={});if(el.value)q[el.dataset.k]=el.value;else delete q[el.dataset.k];render()};
A.cafkw=el=>{UI.sel.cqs=el.value.trim();render()};
A.casize=el=>{const st=UI.sel.clist||(UI.sel.clist={page:1,size:20});st.size=+el.value;st.page=1;render()};

/* ---------- 4. 内容中心页（覆盖）：单列表 + 常用视图 ---------- */
pgContent=function(){
  cSweep();let t=curTab('content',CTABS);if(t==='内容'||t==='话术与课程(高级)')t='全部内容';
  let b='';const V=S.contents.filter(visC);const canNew=['hq','region'].includes(UI.role.type);
  const head='<div class="ph"><h2>内容中心 <span class="hint" style="font-weight:400">备料：话术、课程、题、演练都在这里；造完挂知识点，定稿后再去零售通上架。</span></h2><div>'+(canNew?'<button class="btn" data-act="cTab" data-v="导入" style="margin-right:8px">导入内容</button><button class="btn" data-act="cNew" data-ai="1" style="margin-right:8px">AI 生成内容</button><span class="dd2" style="display:inline-block"><button class="btn pri" data-act="cNewMenu">新增 ▾</button></span>':'')+'</div></div>';
  if(t==='全部内容')b=cListU(V);
  if(t==='导入')b=pgImport();
  if(t==='使用与反馈')b=cUsage(V);
  return head+tabsH('content',CTABS)+b;
};

/* ---------- 5. 疑似复制对（知识点合并讨论用） ---------- */
function kpDupOf(k){
  const norm=n=>String(n||'').replace(/SU7|YU7|澎程|N70|N90|探索版|标准版|Ultra|Pro|Max|长续航|车系|版本|全系/g,'').replace(/[的与和、\/·\s（）()：:]/g,'');
  const setOf=s=>[...new Set(s)].sort().join('');
  const n=norm(k.name);if(n.length<3)return null;
  const ns=setOf(n);
  const other=S.kps.find(x=>{
    if(x.id===k.id||kpCarOverlap(kpCars(x),kpCars(k)))return false;
    const m=norm(x.name);if(m.length<3)return false;
    if(setOf(m)===ns)return true;                       // 字集相同（先后顺序不同也算）
    const common=[...new Set(m)].filter(ch=>n.includes(ch)).length;
    return m.length>=4&&n.length>=4&&common/Math.max(n.length,m.length)>=0.8;
  });
  if(other)return other;
  // 同卖点 + 不同车系 且都是产品知识：语义上就是「同一学习结果按车系复制」
  if(k.domain==='产品知识'&&k.sellpoint){
    return S.kps.find(x=>x.id!==k.id&&x.domain==='产品知识'&&x.sellpoint===k.sellpoint&&!kpCarOverlap(kpCars(x),kpCars(k)))||null;
  }
  return null;
}
function kpAssetCell(k){
  const series=['SU7','YU7','澎程 N70','澎程 N90'];
  const mains=(S.contents||[]).filter(c=>(c.kps||[]).includes(k.id)&&((c.kpRole&&c.kpRole[k.id])||'主讲解')==='主讲解'&&isPub(c)&&expState(c)!=='已过期');
  const dot=(s)=>{if(!kpV12CoversCar(k,s))return '<i class="ux-dot na" title="'+s+'：不在应覆盖范围"></i>';
    const ok=mains.some(c=>carListOf(c).some(x=>x===s||x==='通用车型'));
    return '<i class="ux-dot '+(ok?'ok':mains.length?'warn':'err')+'" title="'+s+'：'+(ok?'有已上架主讲解':mains.length?'有讲解但未上架/已过期':'无讲解')+'"></i>'};
  const a=kpV12Assess(k),needQ=a.anchorQ||0,needD=['卖点','技能','流程'].includes(kpV12Type(k))?(a.anchorDrill||0):0;
  const aq=kpV12AnchorQn(k),ad=kpV12AnchorDrillN(k);const h=kpV12Health(k);
  const qDot=needQ?(aq>=needQ?'ok':aq>0?'warn':'err'):'na';
  const dDot=needD?(ad>=needD?'ok':ad>0?'warn':'err'):'na';
  const verdict=h.level==='ok'?'<span class="tag ok">完备</span>':h.level==='warn'?'<span class="tag warn">待补</span>':'<span class="tag err">缺口</span>';
  const title='讲解：'+series.map(s=>s+' '+(mains.some(c=>carListOf(c).some(x=>x===s||x==='通用车型'))?'有':'无')).join(' / ')+'；核心题 '+aq+'/'+needQ+'；过关演练 '+ad+'/'+needD;
  return '<div class="kp-assets" title="'+esc(title)+'">'
    +'<div class="row">'+series.map(dot).join('')+'<span class="hint">'+(mains.length?mains.length+' 讲':'无讲解')+'</span></div>'
    +'<div class="row"><i class="ux-dot '+qDot+'"></i><span class="hint">题 '+aq+'/'+needQ+'</span><i class="ux-dot '+dDot+'"></i><span class="hint">演练 '+ad+'/'+needD+'</span>'+verdict+'</div>'
    +'</div>';
}

/* ---------- 6. 知识点库（覆盖）：6 列精简 + 12 列技术视图 ---------- */
kpLibrary=function(){
  const f=kpLibFilter();const full=!!f.full;
  const rows=(S.kps||[]).filter(k=>kpV12ListMatch(k,f));
  const sort=f.sort||'gap';
  if(sort==='name')rows.sort((a,b)=>a.name.localeCompare(b.name,'zh'));
  if(sort==='gap')rows.sort((a,b)=>{const r=x=>(x.pri==='P0'?0:3)+(kpV12Health(x).level==='err'?0:kpV12Health(x).level==='warn'?1:2);return r(a)-r(b)||a.name.localeCompare(b.name,'zh')});
  if(sort==='pri')rows.sort((a,b)=>String(a.pri).localeCompare(String(b.pri))||a.name.localeCompare(b.name,'zh'));
  UI.kpOrder=rows.map(k=>k.id);
  const MORE=['line','role','ability','sellpoint','batch','status','pri','owner'];const nMore=MORE.filter(x=>f[x]).length;const nAct=Object.keys(f).filter(x=>f[x]&&!['more','full','sort'].includes(x)).length;
  const pg=lstPage('kpPage',rows);
  const sel=(key,label,arr)=>'<div class="fi2"><label>'+label+'</label><select data-wc="kpset" data-k="'+key+'"><option value="">全部</option>'+arr.map(x=>'<option value="'+esc(x)+'" '+(f[key]===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></div>';
  const carOpts='<option value="">全部车型</option><option value="通用车型" '+(f.car==='通用车型'?'selected':'')+'>通用车型</option>'+Object.keys(V23_CAR_TREE).map(sr=>'<optgroup label="'+esc(sr)+'"><option value="'+esc(sr)+'" '+(f.car===sr?'selected':'')+'>'+esc(sr)+' 全系</option>'+V23_CAR_TREE[sr].map(v=>'<option value="'+esc(v)+'" '+(f.car===v?'selected':'')+'>'+esc(v)+'</option>').join('')+'</optgroup>').join('');
  const views=[['mine','我负责的'],['p0gap','P0 缺讲解'],['assess','考核不全'],['review','政策 / 待复核']];
  const viewBar='<div class="kp-view-bar"><span>常用视图</span>'+views.map(v=>'<button type="button" class="kp-view '+(f.view===v[0]?'on':'')+'" data-act="kpView" data-v="'+v[0]+'">'+v[1]+'</button>').join('')+(f.view?'<button type="button" class="link" data-act="kpView" data-v="'+f.view+'">取消视图</button>':'')+'</div>';
  const primary='<div class="filg kp-filter-primary">'
    +'<div class="fi2"><label>搜索</label><input data-wc="kpq" value="'+esc(f.q||'')+'" placeholder="编号 / 名称 / 旧编号"></div>'
    +'<div class="fi2"><label>适用车型</label><select data-wc="kpset" data-k="car">'+carOpts+'</select></div>'
    +sel('domain','知识域',KP_DICT_V12.domains)
    +'<div class="fi2"><label>完备度</label><select data-wc="kpset" data-k="lv"><option value="">全部</option>'+['未完备','只看有缺口','只看待补','只看完备'].map(x=>'<option '+(f.lv===x?'selected':'')+'>'+x+'</option>').join('')+'</select></div></div>';
  const more='<div class="filg kp-more-filters" '+(f.more?'':'hidden')+'>'
    +sel('line','业务线',KP_DICT_V12.businessLines)+sel('role','岗位',KP_DICT_V12.roles)
    +sel('ability','能力项',KP_DICT_V12.abilities)+sel('sellpoint','卖点分类',KP_SELLPOINT_LEAVES_V12)
    +sel('batch','批次',KP_DICT_V12.batches)+sel('status','内容状态',KP_DICT_V12.statuses)+sel('pri','优先级',['P0','P1','全部'])
    +sel('owner','负责人',kpOwners().concat(['(无)']))+'</div>';
  const filter='<div class="card kp-filter-card">'+viewBar+primary+more+'<div class="kp-filter-actions"><button class="btn sm" data-act="kpMore">'+(f.more?'收起筛选':'更多筛选'+(nMore?'（已选 '+nMore+'）':''))+'</button><button class="btn sm" data-act="kpFclr" '+(nAct?'':'disabled')+'>清除筛选</button><span class="sp"></span><button class="btn sm" data-act="kpFull">'+(full?'返回精简视图':'完整字段')+'</button>'
    +lstCsvBtn(['编号','名称','业务线','岗位','车型','知识域','能力/卖点','类型','批次','主要环节','完备度'],[['编号','名称','业务线','岗位','车型','知识域','能力/卖点','类型','批次','主要环节','完备度']].concat(rows.map(k=>[k.code,k.name,k.line,(k.roles||[]).join('、'),kpCarText(k),k.domain,k.ability||k.sellpoint,kpV12Type(k),kpV12Batch(k),k.stage,kpV12Health(k).level])),'知识点库')+'</div></div>';
  const nameCell=k=>{const dup=kpDupOf(k);const g=kpGapList(k).filter(x=>/^缺/.test(String(x[2]||x[1])));const show=g.slice(0,1).map(x=>'<span class="tag '+x[0]+'">'+esc(x[1])+'</span>').join('')+(g.length>1?'<span class="hint">+'+(g.length-1)+'</span>':'');
    return '<td class="kp-name-cell"><a class="link" data-act="kpOpen" data-id="'+k.id+'" title="'+esc(k.one||'')+'">'+esc(k.name)+'</a>'
      +(typeof rvChip==='function'?' '+rvChip('kp',k.id):'')
      +(dup?' <a class="link kp-dup" data-act="kpOpen" data-id="'+k.id+'" title="与 '+dup.code+' 疑似重复（'+esc(dup.name)+'）→ 打开对比">⚠</a>':'')
      +' <span class="tag '+(k.pri==='P0'?'pri':'')+'">'+esc(k.pri)+'</span>'
      +'<div class="hint">'+esc(k.code)+(show?' · '+show:'')+'</div></td>'};
  const carCell=k=>'<td class="kp-car-cell" title="'+esc((kpCars(k)||[]).join('、'))+'">'+carChipsHtml(kpCars(k),2)+'</td>';
  const catCell=k=>'<td><b>'+esc(k.domain)+'</b><div class="hint">'+esc(k.ability||('卖点 · '+(k.sellpoint||'—')))+' · '+esc(kpV12Type(k))+'</div></td>';
  const actionCell=k=>'<td class="kp-row-actions"><a class="link" data-act="kpOpen" data-id="'+k.id+'">查看</a> <a class="link" data-act="kpEditRow" data-id="'+k.id+'">编辑</a></td>';
  const kNarrow=(typeof window!=='undefined')&&window.innerWidth<1100;/* 窄屏：只留 知识点 / 状态·完备 / 操作 */
  const compactCols=kNarrow?[0,240,96]:[266,104,108,212,80,92];
  const compactHead=kNarrow?'<tr><th>知识点</th><th>状态 · 完备</th><th>操作</th></tr>':'<tr><th>知识点</th><th>适用车型</th><th>分类</th><th>状态 · 完备</th><th>负责人</th><th>操作</th></tr>';
  const compactRow=k=>'<tr class="kp-click" data-act="kpOpen" data-id="'+k.id+'">'+nameCell(k)+(kNarrow?'':carCell(k)+catCell(k))+'<td>'+kpAssetCell(k)+'</td>'+(kNarrow?'':'<td>'+(k.owner?esc(k.owner):'<span class="tag err">未指定</span>')+'</td>')+actionCell(k)+'</tr>';
  const fullHead='<tr><th>知识点</th><th>编号</th><th>业务线/岗位</th><th>适用车型</th><th>知识域</th><th>能力 / 卖点</th><th>类型/批次</th><th>主要环节</th><th>完备度</th><th>考核规格</th><th>弱点</th><th>操作</th></tr>';
  const fullRow=k=>{const h=kpV12Health(k);return '<tr class="kp-click" data-act="kpOpen" data-id="'+k.id+'">'+nameCell(k)+'<td><b>'+esc(k.code)+'</b><div class="hint">'+(k.legacy?'旧 '+esc(k.legacy):'')+'</div></td><td>'+esc(k.line)+'<div class="hint">'+esc((k.roles||[]).join('、'))+'</div></td><td class="kp-car-cell">'+esc(kpCarText(k))+'</td><td>'+esc(k.domain)+'</td><td>'+esc(k.ability||('卖点 · '+(k.sellpoint||'—')))+'</td><td>'+esc(kpV12Type(k))+'<div class="hint">'+esc(kpV12Batch(k))+'</div></td><td>'+esc(k.stage)+'</td><td><span class="tag '+(h.level==='ok'?'ok':h.level==='warn'?'warn':'err')+'">'+(h.level==='ok'?'完备':h.level==='warn'?'待补':'缺口')+'</span></td><td>'+h.aq+' 锚 / '+h.ad+' 演练</td><td>'+kpWeakTxt(k)+'</td>'+actionCell(k)+'</tr>'};
  const table=full
    ?'<div class="tw"><table class="t nw stk kp-list full">'+fullHead+pg.rows.map(fullRow).join('')+'</table></div>'
    :'<div class="tw"><table class="t stk kp-list compact"><colgroup>'+compactCols.map(w=>'<col'+(w?' style="width:'+w+'px"':'')+'>').join('')+'</colgroup>'+compactHead+pg.rows.map(compactRow).join('')+'</table></div>';
  return filter+'<div class="card"><div class="kp-list-head"><h3>知识点清单 <span class="hint">'+(nAct?'筛选后 '+rows.length+' / '+S.kps.length+' 条':'共 '+S.kps.length+' 条')+'</span></h3><div class="kp-list-tools"><label class="hint">排序 <select data-wc="kpset" data-k="sort"><option value="gap" '+(sort==='gap'?'selected':'')+'>缺口优先（P0 在前）</option><option value="pri" '+(sort==='pri'?'selected':'')+'>优先级</option><option value="name" '+(sort==='name'?'selected':'')+'>名称</option></select></label><span class="hint">'+(full?'完整字段':'精简视图')+'</span></div></div>'+table+lstPager('kpPage',pg)+(rows.length?'':(S.kps.length?uxEmpty({title:'没有符合条件的知识点',desc:'换个关键词，或清除筛选后再看。',act:'kpFclr',label:'清除筛选'}):uxEmpty({title:'知识点库还是空的',desc:'先新增一个知识点，或批量导入标准清单。',act:'kpNew',label:'新增知识点',act2:'kpOpenBatch',label2:'批量导入'})))+'</div>';
};
