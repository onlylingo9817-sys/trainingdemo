/* 知识点 v14：车型 / 年款真正参与「能讲 / 能考 / 能练」、资源标注入口、实操观察闭环。
 * 定位是 Demo 逻辑闭环：数据仍是模拟值，不新增任何车型或年款事实，存量资源的年款由业务在「待标年款」里自己选。
 * 加载位置：x_kp_v13.js 之后、f_rn.js 之前；只覆盖判定函数、补表单字段和实操观察，不改数据模型字段名。
 *
 * 规则（与界面文案一致）：
 *  - 看某个车型：讲解、题、演练按各自的 carScope（只到车系，空 = 通用）过滤；老讲解只有单值 car 的，按它所在车系算。
 *  - 选了年款：只认 yearScope 含该年款的资源；没标年款的不算有，也不算真缺，单独统计「待标年款」。
 *  - 实操观察是独立证据：独立完成 = 合格；提示后完成 = 合格但生成巩固补学；未完成 = 不合格并生成补学。
 *    观察人必须是主管 / 带教，学员自己和 AI 对话都不能代替，AI 对话只作参考、不计入。
 */

/* ---------- 1. 口径：页面当前看的车型 / 年款 ---------- */
function kpScopeCtx(){
  const o=(typeof UI!=='undefined'&&UI&&UI.sel&&UI.sel.kpOv)||{};
  let car='';
  if(typeof UI!=='undefined'&&UI.page==='catalog'){
    const t=UI.tab&&UI.tab.catalog;
    if(t==='总览')car=o.car&&o.car!=='全部车型'?o.car:'';
    else if(t===KP_TAB_LIB){const f=(UI.sel&&UI.sel.kpf)||{};car=f.car&&f.car!=='通用车型'?f.car:''}
  }
  return {car,year:o.year||''};
}
/* 讲解的车系范围：carScope 优先；老数据只有单值 car（如「澎程 N90 Max」）时按它所在车系 */
function kpItemScope(item){
  const s=kpAssetScope(item);
  if(s.length)return s;
  if(item&&item.kind&&item.car&&item.car!=='通用车型'){
    const sr=kpSeriesOfCar(item.car);
    if(sr==='澎程')return ['澎程 N70','澎程 N90'];
    if(sr)return [sr];
  }
  return [];
}
function kpAssetFits(item, ctx){
  ctx=ctx||kpScopeCtx();
  if(ctx.car&&!kpAssetFitsCar({carScope:kpItemScope(item)}, ctx.car))return false;
  if(ctx.year&&!kpYearFits(item, ctx.year))return false;
  return true;
}
const kpNoYear=x=>!!x&&(x.yearPending||!(x.yearScope||[]).length);

/* ---------- 2. 能讲 / 能考 / 能练：按车型 + 年款过滤 ---------- */
kpV12HasLecture=function(k, includePlaceholder, ctx){
  ctx=ctx||kpScopeCtx();
  return (S.contents||[]).some(c=>{
    if(c.kpMap==='待整理')return false;
    if(!(c.kps||[]).includes(k.id))return false;
    if(!ctx.year&&((c.kpRole&&c.kpRole[k.id])||'主讲解')!=='主讲解')return false;
    if(typeof isPub==='function'&&!isPub(c))return false;
    if(typeof expState==='function'&&expState(c)==='已过期')return false;
    if(!includePlaceholder&&typeof kpIsPlaceholder==='function'&&kpIsPlaceholder(c))return false;
    return kpAssetFits(c, ctx);
  });
};
const kpAnchorQs=(k,ctx)=>(S.qs||[]).filter(q=>q.kp===k.id&&q.st==='已定稿'&&q.role==='锚题'&&q.kpMap!=='待整理'&&kpAssetFits(q,ctx||kpScopeCtx()));
const kpAnchorDrills=(k,ctx)=>(S.drills||[]).filter(d=>d.kp===k.id&&d.st==='已定稿'&&d.role==='锚定演练'&&d.kpMap!=='待整理'&&kpAssetFits(d,ctx||kpScopeCtx()));
kpV12AnchorQn=function(k, ctx){return kpAnchorQs(k, ctx).length};
kpV12AnchorDrillN=function(k, ctx){return kpAnchorDrills(k, ctx).length};

/* 没标年款的资源：选了年款时不算有，但要统计出来，别让人把「没标」当成「真缺」 */
function kpPendingYearItems(k){
  const mine=x=>x&&x.kpMap!=='待整理'&&kpNoYear(x)&&(x.kp===k.id||(x.kps||[]).includes(k.id));
  return {c:(S.contents||[]).filter(mine).length,q:(S.qs||[]).filter(mine).length,d:(S.drills||[]).filter(mine).length};
}
function kpPendingYearList(){
  const out=[];
  (S.contents||[]).forEach(c=>{if(c.kpMap!=='待整理'&&kpNoYear(c)&&(c.kps||[]).length)out.push({key:'c:'+c.id,kind:c.kind||'内容',id:c.id,title:c.title,kpIds:(c.kps||[]).slice(),item:c})});
  (S.qs||[]).forEach(q=>{if(q.kpMap!=='待整理'&&kpNoYear(q)&&q.kp)out.push({key:'q:'+q.id,kind:'题',id:q.id,title:q.stem||q.id,kpIds:[q.kp],item:q})});
  (S.drills||[]).forEach(d=>{if(d.kpMap!=='待整理'&&kpNoYear(d)&&d.kp)out.push({key:'d:'+d.id,kind:'演练',id:d.id,title:d.name||d.id,kpIds:[d.kp],item:d})});
  return out;
}

/* ---------- 3. 总览指标：每个车型各算各的 ---------- */
kpV12Metrics=function(k,ctx){
  ctx=ctx||{};
  const role=ctx.role||'零售顾问',car=ctx.car||'SU7 Pro',batch=ctx.batch||'B3-后续',pri=ctx.pri||'P0';
  const st=kpV12Status(k);
  const inDenom=st!=='停用'&&st!=='草案'&&(k.roles||[]).includes(role)&&kpV12BatchRank(kpV12Batch(k))<=kpV12BatchRank(batch)&&kpV12CoversCar(k,car)&&(pri==='全部'||k.pri===pri);
  if(!inDenom)return null;
  /* 判定一律用这一行自己的车型和年款，不读页面当前选的那个 */
  const sc={car:car==='全部车型'?'':car,year:ctx.year||''};
  const pending=kpV12Health(k).pending;
  const includePh=ctx.placeholder==='include';
  const lecture=kpV12HasLecture(k,includePh,sc);
  const needDrill=['卖点','技能','流程'].includes(kpV12Type(k));
  const spec=kpAnchorQs(k,sc).length>=3&&(!needDrill||kpAnchorDrills(k,sc).length>=1);
  return {inDenom:true,coverage:lecture,teachable:lecture&&!pending,assessable:spec&&!pending,fresh:lecture&&kpV12ReviewOk(k)&&!pending,pending,placeholder:includePh?'include':'exclude'};
};

/* 知识点库每行的文字：年款没标的单独说明 */
const __rowStatusV14=kpRowStatus;
kpRowStatus=function(k){
  const s=__rowStatusV14(k);const ctx=kpScopeCtx();
  if(ctx.year){
    const p=kpPendingYearItems(k);
    if(s.missTeach&&p.c)s.teach+='（'+p.c+' 条讲解未标年款）';
    if(s.missQ&&p.q)s.exam+='（'+p.q+' 道题未标年款）';
    if(s.missD&&p.d)s.drill+='（'+p.d+' 场演练未标年款）';
  }
  return s;
};
kpScopeCell=function(k){
  const cars=kpCars(k)||[];
  const uni=cars.indexOf('通用车型')>=0;
  const shown=uni?[]:cars;
  const carTxt=uni?'通用':(shown.slice(0,2).join('、')+(shown.length>2?'等'+shown.length+'个':''));
  const year=(UI.sel.kpOv||{}).year||'';
  const p=kpPendingYearItems(k);const n=p.c+p.q+p.d;
  const yearTxt=(year?'当前看 '+year+(n?' · '+n+' 条资源未标，不计入':''):(n?n+' 条资源未标年款':'资源年款已标全'));
  return '<td class="kp-scope"><b>'+esc(carTxt)+'</b><div class="hint" title="'+esc(cars.join('、')||'未标车型')+'">'+esc(yearTxt)+'</div></td>';
};

/* ---------- 4. 表单：讲解 / 题 / 演练都能选车系和年款 ---------- */
function kpYearFieldHtml(item, act){
  const on=(item&&item.yearScope)||[];
  return KP_YEARS.map(y=>'<label style="margin-right:12px;font-size:13px"><input type="checkbox" data-wc="'+act+'" data-v="'+esc(y)+'" '+(on.includes(y)?'checked':'')+'> '+esc(y)+'</label>').join('')
    +'<div class="fh">不勾选 = 还没标年款：按年款看时不算有，会进「待标年款」。演示年款不是真实在售参数。</div>';
}
function kpToggleYear(item, el){
  if(!item)return;
  const v=el.dataset.v;const cur=(item.yearScope||[]).slice();
  item.yearScope=el.checked?cur.concat(v).filter((x,i,a)=>a.indexOf(x)===i):cur.filter(x=>x!==v);
  item.yearPending=!item.yearScope.length;
}
A.qYear=el=>{if(typeof QF!=='undefined'&&QF){kpToggleYear(QF,el);render()}};
A.drYear=el=>{if(typeof DF!=='undefined'&&DF){kpToggleYear(DF,el);render()}};
A.cYear=el=>{if(typeof C!=='undefined'&&C){kpToggleYear(C,el);render()}};
A.cScope=el=>{
  if(typeof C==='undefined'||!C)return;
  const v=el.dataset.v;const cur=(C.carScope||[]).slice();
  C.carScope=el.checked?cur.concat(v).filter((x,i,a)=>a.indexOf(x)===i):cur.filter(x=>x!==v);
  render();
};
function kpContentScopeHtml(c){
  const on=c.carScope||[];
  return KP_SERIES_V12.map(s=>'<label style="margin-right:12px;font-size:13px"><input type="checkbox" data-wc="cScope" data-v="'+esc(s)+'" '+(on.includes(s)?'checked':'')+'> '+esc(s)+'</label>').join('')
    +'<div class="fh">不勾选 = 通用，各车系都能用。按车型看能讲时，只认适用车系含该车型的讲解。</div>';
}
const __pgContentEditV14=pgContentEdit;
pgContentEdit=function(){
  const html=__pgContentEditV14();
  if(typeof C==='undefined'||!C)return html;
  const mark='<div class="fr"><div class="flb">适用人群';
  if(html.indexOf(mark)<0)return html;
  return html.replace(mark,FR('适用车系',kpContentScopeHtml(C))+FR('适用年款',kpYearFieldHtml(C,'cYear'))+mark);
};
const __cFromCV14=cFromC;
cFromC=function(c){
  const r=__cFromCV14(c);
  r.carScope=kpItemScope(c);
  r.yearScope=(c.yearScope||[]).slice();
  r.yearPending=!r.yearScope.length;
  return r;
};
const __cSaveV14=A.cSave;
A.cSave=function(el){
  const f=(typeof C!=='undefined'&&C)?{id:C.id,ok:!!String(C.title||'').trim(),carScope:(C.carScope||[]).slice(),yearScope:(C.yearScope||[]).slice()}:null;
  const n0=(S.contents||[]).length;
  const r=__cSaveV14(el);
  if(f&&f.ok){
    const c=f.id?content(f.id):((S.contents||[]).length>n0?S.contents[0]:null);
    if(c){
      c.carScope=f.carScope;c.yearScope=f.yearScope;c.yearPending=!f.yearScope.length;
      if(typeof C!=='undefined'&&C&&C.id===c.id){C.carScope=f.carScope.slice();C.yearScope=f.yearScope.slice();C.yearPending=c.yearPending}
    }
  }
  return r;
};
const __pgQFormV14=pgQForm;
pgQForm=function(){
  const html=__pgQFormV14();
  if(typeof QF==='undefined'||!QF)return html;
  const m=html.indexOf('<div class="fr"><div class="flb"><b>*</b>题型');
  return m<0?html:html.slice(0,m)+FR('适用年款',kpYearFieldHtml(QF,'qYear'))+html.slice(m);
};
const __qSaveV14=A.qSave;
A.qSave=function(el){
  if(typeof QF!=='undefined'&&QF&&!Array.isArray(QF.yearScope)){QF.yearScope=[];QF.yearPending=true}
  return __qSaveV14(el);
};
const __pgDrFormV14=pgDrForm;
pgDrForm=function(){
  const html=__pgDrFormV14();
  if(typeof DF==='undefined'||!DF)return html;
  const m=html.indexOf('<div class="fr"><div class="flb">场景');
  return m<0?html:html.slice(0,m)+FR('适用年款',kpYearFieldHtml(DF,'drYear'))+html.slice(m);
};
const __drSaveV14=A.drSave;
A.drSave=function(el){
  if(typeof DF!=='undefined'&&DF&&!Array.isArray(DF.yearScope)){DF.yearScope=[];DF.yearPending=true}
  return __drSaveV14(el);
};

/* ---------- 5. 待标年款：存量资源的批量标注（年款由业务自己选，系统不替人编） ---------- */
function kpYearFilter(){return UI.sel.yrF||(UI.sel.yrF={kind:'',q:''})}
function kpYearRowsShown(){
  const f=kpYearFilter();const q=(f.q||'').trim();
  return kpPendingYearList().filter(r=>(!f.kind||r.kind===f.kind)&&(!q||r.title.indexOf(q)>=0||r.id.indexOf(q)>=0||r.kpIds.some(id=>((kp(id)||{}).name||'').indexOf(q)>=0)));
}
function kpYearBody(){
  const f=kpYearFilter();const all=kpPendingYearList();const rows=kpYearRowsShown();const pick=UI.sel.yrPick||(UI.sel.yrPick={});
  const n=rows.filter(r=>pick[r.key]).length;
  const kinds=['课程','话术','题','演练'];
  return '<div class="hint" style="margin-bottom:10px">这些资源已经归到知识点，但没标年款。按年款看「能讲 / 能考 / 能练」时它们不会被算进去。年款由业务确认后再标，没把握的先不动。</div>'
   +'<div class="filg" style="margin-bottom:8px"><div class="fi2"><label>类型</label><select data-wc="yrF" data-k="kind"><option value="">全部 '+all.length+'</option>'+kinds.map(x=>'<option value="'+x+'" '+(f.kind===x?'selected':'')+'>'+x+' '+all.filter(r=>r.kind===x).length+'</option>').join('')+'</select></div>'
   +'<div class="fi2"><label>搜索</label><input data-wc="yrF" data-k="q" value="'+esc(f.q||'')+'" placeholder="标题 / 编号 / 知识点"></div></div>'
   +'<div style="margin-bottom:8px"><button type="button" class="btn sm" data-act="yrAll" data-v="1">全选当前 '+rows.length+' 条</button> <button type="button" class="btn sm" data-act="yrAll" data-v="0">取消全选</button> <span class="hint">已选 '+n+' 条</span></div>'
   +(rows.length?'<div class="tw"><table class="t"><tr><th></th><th>类型</th><th>资源</th><th>知识点</th><th>适用车系</th></tr>'
     +rows.slice(0,80).map(r=>'<tr><td><input type="checkbox" data-wc="yrTick" data-k="'+esc(r.key)+'" '+(pick[r.key]?'checked':'')+'></td><td>'+esc(r.kind)+'</td><td style="white-space:normal;max-width:320px"><b>'+esc(String(r.title).slice(0,40))+'</b><div class="hint">'+esc(r.id)+'</div></td><td style="white-space:normal">'+esc(r.kpIds.map(id=>(kp(id)||{}).name||id).slice(0,2).join('、'))+'</td><td>'+esc(kpItemScope(r.item).join('、')||'通用')+'</td></tr>').join('')+'</table></div>'
     +(rows.length>80?'<div class="hint" style="margin-top:6px">只显示前 80 条，筛选后再标其余的。</div>':'')
    :'<div class="chk ok"><b>✓</b><span>'+(all.length?'没有符合筛选的资源。':'所有已归属的资源都标了年款。')+'</span></div>');
}
function kpYearFoot(){return '<button class="btn" data-act="yrMark" data-v="演示年款A">标为 演示年款A</button><button class="btn" data-act="yrMark" data-v="演示年款B">标为 演示年款B</button><button class="btn pri" data-act="yrMark" data-v="both">两个年款都适用</button><button class="btn" data-act="drwClose">完成</button>'}
function kpYearRefresh(){if(UI.drw&&/待标年款/.test(UI.drw.title)){UI.drw.body=kpYearBody();renderDrawer()}}
A.kpYearOpen=()=>{UI.sel.yrPick={};drawerOpen('待标年款的资源',kpYearBody(),kpYearFoot())};
A.yrF=el=>{kpYearFilter()[el.dataset.k]=el.value;kpYearRefresh()};
A.yrTick=el=>{const p=UI.sel.yrPick||(UI.sel.yrPick={});if(el.checked)p[el.dataset.k]=1;else delete p[el.dataset.k];kpYearRefresh()};
A.yrAll=el=>{const p=UI.sel.yrPick=UI.sel.yrPick||{};if(el.dataset.v==='1')kpYearRowsShown().forEach(r=>{p[r.key]=1});else UI.sel.yrPick={};kpYearRefresh()};
A.yrMark=el=>{
  const p=UI.sel.yrPick||{};const keys=Object.keys(p).filter(k=>p[k]);
  if(!keys.length)return toast('先勾选要标的资源','err');
  const years=el.dataset.v==='both'?KP_YEARS.slice():[el.dataset.v];
  const byKey={};kpPendingYearList().forEach(r=>{byKey[r.key]=r});
  let n=0;keys.forEach(k=>{const r=byKey[k];if(!r)return;r.item.yearScope=years.slice();r.item.yearPending=false;r.item.yearMarkedBy=meShort();r.item.yearMarkedAt=today;n++});
  UI.sel.yrPick={};toast('已标 '+n+' 条为 '+years.join('、'),'ok');kpYearRefresh();render();
};
const __kpLibraryV14=kpLibrary;
kpLibrary=function(){
  const html=__kpLibraryV14();const n=kpPendingYearList().length;
  return html.replace('<div class="kp-filter-actions">','<div class="kp-filter-actions"><button class="btn sm" data-act="kpYearOpen" title="没标年款的资源按年款看时不计入">待标年款 '+n+'</button>');
};

/* ---------- 6. 总览：选年款、说明口径、实操观察汇总 ---------- */
const __kpOverviewV14=kpOverviewNew;
kpOverviewNew=function(){
  let html=__kpOverviewV14();
  const ctx=UI.sel.kpOv||{};const n=kpPendingYearList().length;const o=kpObsSummary();
  const scope='<div class="ux-note">车型按资源的适用车系算（不勾 = 通用）；热力格每个车型单独算，不是同一个数。年款只认已标注的资源：'
    +(ctx.year?'当前看 <b>'+esc(ctx.year)+'</b>，':'当前不限年款，')+'<b>'+n+'</b> 条已归属资源没标年款，按年款看时不计入、也不算真缺。<a class="link" data-act="kpYearOpen">去标年款 ›</a></div>'
    +'<div class="ux-subline"><span>实操观察 <b>'+o.valid+'</b> 条有效 · 合格 <b>'+o.pass+'</b> · 要补学 <b>'+o.gap+'</b>'+(o.ai?' · AI 对话 <b>'+o.ai+'</b> 条不计入':'')+'</span><span class="hint">实操由主管 / 带教现场观察，不能由对话代替</span></div>';
  html=html.replace('<div class="ux-note">',scope+'<div class="ux-note">');
  return html;
};
/* 总览口径条加年款 */
(function(){
  const src=kpOverviewNew;
  kpOverviewNew=function(){
    const html=src();
    const ctx=UI.sel.kpOv||{};
    const sel='<div class="fi2"><label>年款</label><select data-wc="kpV12OvSet" data-k="year"><option value="" '+(!ctx.year?'selected':'')+'>不限年款</option>'+KP_YEARS.map(y=>'<option value="'+y+'" '+(ctx.year===y?'selected':'')+'>'+y+'</option>').join('')+'</select></div>';
    return html.replace('</div><span class="ux-bar-r hint">',sel+'</div><span class="ux-bar-r hint">');
  };
})();

/* ---------- 7. 实操观察闭环 ---------- */
const KP_OBS_DIMS={
  R01:['探需有效','事实准确与范围','安全有效演示','下一步与记录'],
  E01:['先查证再答复','不编时限与承诺','下一步与记录'],
  T01:['转专业评估','旧车价与新车价分开','不保证处置']
};
const KP_OBS_GRADES=['独立完成','提示后完成','未完成','未观察'];
const KP_OBS_SOURCES=['主管现场观察','带教现场观察','AI对话（不计入）'];
const kpObsNeed=p=>!!(p&&p.needObs);
const kpObsDims=p=>(p&&p.obsDims)||KP_OBS_DIMS[p&&p.train]||[];
function kpObsValid(o){return !!o&&o.counted!==false&&o.source!=='AI对话（不计入）'&&!!o.by&&o.grade!=='未观察'}
/* 每个维度取最近一条有效记录 */
function kpObsStatus(p){
  const dims=kpObsDims(p);const rows=(p.observe||[]).filter(kpObsValid);
  const by={};rows.forEach(o=>{by[o.dim]=o});
  const per=dims.map(d=>({dim:d,rec:by[d]||null,pass:!!by[d]&&by[d].grade!=='未完成'}));
  return {per,ok:dims.length>0&&per.every(x=>x.pass),done:per.filter(x=>x.pass).length,total:dims.length};
}
function kpObsRows(k){
  const out=[];
  (S.packs||[]).forEach(p=>{if(p.kp!==k.id&&(p.observe||[]).every(o=>o.kp!==k.id))return;(p.observe||[]).forEach(o=>out.push(Object.assign({packId:p.id,mid:p.mid},o)))});
  return out;
}
function kpObsSummary(){
  let valid=0,pass=0,gap=0,ai=0;
  (S.packs||[]).forEach(p=>(p.observe||[]).forEach(o=>{
    if(o.source==='AI对话（不计入）'||o.counted===false){ai++;return}
    if(!kpObsValid(o))return;valid++;
    if(o.grade==='独立完成')pass++;else gap++;
  }));
  return {valid,pass,gap,ai};
}
function kpObsPerson(p){return (S.lrn||[]).find(l=>l.mid===p.mid)||{}}
/* 提示后完成 / 未完成 → 补学任务；同一学员同一包同一维度只留一条，之后独立完成就复测关闭 */
function kpObsTask(p,rec){
  S.tasks=S.tasks||[];
  const person=kpObsPerson(p);const k=kp(p.kp)||{};
  const open=S.tasks.find(t=>t.obsPack===p.id&&t.obsDim===rec.dim&&!['已复测','已关闭'].includes(t.state));
  if(rec.grade==='独立完成'){
    if(open){open.state='已复测';open.retestedAt=today;open.closeBy='实操观察独立完成'}
    return;
  }
  const level=rec.grade==='未完成'?'L2-实操未完成':'L1-实操需巩固';
  const reason='实操观察「'+rec.dim+'」：'+rec.grade+(rec.note?'（'+rec.note+'）':'');
  if(open){open.level=level;open.reason=reason;open.due=addDays(today,7);return}
  S.tasks.push({id:'T_OBS_'+p.id+'_'+rec.dim,mid:p.mid,name:person.name||p.mid,kpId:k.id||p.kp,kpCode:k.code||p.kp,kpName:k.name||'',specVer:k.specVer||1,level,reason,
    due:addDays(today,7),state:'未读',store:person.store||'',role:person.tier||'零售顾问',line:'销售',sourceContentId:'',mergedFrom:[],ts:today,readAt:'',confirmedAt:'',retestedAt:'',
    obsPack:p.id,obsDim:rec.dim,fromObs:true});
}
const __planFinishV14=planFinish;
planFinish=function(p){
  if(kpObsNeed(p)){
    const req=(p.steps||[]).filter(s=>s.req!==false);
    if(req.length&&req.every(s=>s.done)){
      if(kpObsStatus(p).ok){if(p.status!=='已完成'){p.status='已完成';p.doneTs=today;if(typeof notify==='function')notify('学习包「'+p.name+'」已完成（含实操观察）')}}
      else p.status='待实操观察';
    }
    return;
  }
  return __planFinishV14(p);
};
const __packAdvanceV14=packAdvance;
packAdvance=function(p,type,evidence){
  if(!kpObsNeed(p)||kpObsStatus(p).ok)return __packAdvanceV14(p,type,evidence);
  const __n=notify;notify=function(){};
  let r;try{r=__packAdvanceV14(p,type,evidence)}finally{notify=__n}
  if(r&&p.status==='已完成'){p.status='待实操观察';delete p.doneTs;notify('学习包「'+p.name+'」的题和演练已完成，还差主管实操观察')}
  return r;
};
function kpObsBoxHtml(p){
  const st=kpObsStatus(p);const dims=kpObsDims(p);
  const done=(p.steps||[]).filter(s=>s.req!==false).every(s=>s.done);
  const rows=(p.observe||[]).map(o=>{
    const cnt=kpObsValid(o);
    return '<div class="hint" style="margin-top:3px">'+esc(o.dim)+' · '+esc(o.grade)+' · '+esc(o.by||'未写观察人')+'（'+esc((o.source||'').replace('（不计入）',''))+'）'+(cnt?'':' <span class="tag warn">不计入</span>')+(o.note?' · '+esc(o.note):'')+'</div>';
  }).join('');
  const prog=st.per.map(x=>'<span class="tag '+(x.pass?(x.rec.grade==='独立完成'?'ok':'warn'):'')+'" style="margin:2px 4px 2px 0">'+esc(x.dim)+' '+(x.rec?(x.pass?x.rec.grade:'未完成，已安排补学'):'待观察')+'</span>').join('');
  const head=p.status==='已完成'?'<b>实操观察已通过。</b>':(done?'<b>题和演练已完成，还差主管 / 带教的现场观察，学习包才算完成。</b>':'<b>实操观察由主管或带教现场记，和做题分开。</b>');
  return '<div class="rx-note">'+head+' 不下订也可以完成这次接待。AI 对话不能代替实车观察，选「AI 对话」只会留作参考。<div style="margin:6px 0">'+prog+'</div>'
   +'<div style="margin-top:6px"><select id="ob_dim">'+dims.map(d=>'<option>'+esc(d)+'</option>').join('')+'</select> <select id="ob_grade">'+KP_OBS_GRADES.map(g=>'<option>'+g+'</option>').join('')+'</select> <select id="ob_src">'+KP_OBS_SOURCES.map(s=>'<option>'+s+'</option>').join('')+'</select></div>'
   +'<input id="ob_by" placeholder="观察人（主管 / 带教姓名，学员本人不能填）" style="width:100%;margin:6px 0 0"><input id="ob_note" placeholder="看到的具体动作" style="width:100%;margin:6px 0">'
   +'<button class="rb" data-act="trainObs" data-id="'+p.id+'">记下这次实操</button>'+rows+'</div>';
}
A.trainObs=el=>{
  const p=(S.packs||[]).find(x=>x.id===el.dataset.id);if(!p)return;
  const v=id=>($('#'+id)||{}).value||'';
  const dim=v('ob_dim')||kpObsDims(p)[0]||'',grade=v('ob_grade')||'未观察',src=v('ob_src')||KP_OBS_SOURCES[0],by=v('ob_by').trim(),note=v('ob_note');
  const self=kpObsPerson(p).name||'';
  const ai=src==='AI对话（不计入）';
  if(!ai&&!by)return toast('请填写观察人（主管 / 带教）。实操观察不能由学员自己记','err');
  if(!ai&&by===self)return toast('观察人不能是学员本人','err');
  p.observe=p.observe||[];
  const rec={dim,grade,note,kp:p.kp,at:today,sim:true,by:ai?'AI':by,source:src,counted:!ai};
  p.observe.push(rec);
  if(ai){toast('AI 对话不能代替实车观察，这条只作参考，不计入合格','warn')}
  else{
    kpObsTask(p,rec);
    if(typeof planFinish==='function'){
      const was=p.status;
      if(kpObsNeed(p)&&(p.steps||[]).filter(s=>s.req!==false).every(s=>s.done))planFinish(p);
      toast(rec.grade==='独立完成'?'已记下：「'+dim+'」独立完成'+(p.status==='已完成'&&was!=='已完成'?'，学习包完成':''):rec.grade==='未完成'?'已记下：「'+dim+'」未完成，已生成补学任务':rec.grade==='提示后完成'?'已记下：「'+dim+'」提示后完成，已生成巩固补学':'已记下（未观察，不计入）','ok');
    }
  }
  if(typeof renderRN==='function')renderRN();
};
/* 知识点详情：实操观察卡片 */
const __pgKpV14=pgKp;
pgKp=function(){
  const html=__pgKpV14();const k=kp(UI.kid);if(!k)return html;
  const rows=kpObsRows(k);const packs=(S.packs||[]).filter(p=>kpObsNeed(p)&&p.kp===k.id);
  if(!rows.length&&!packs.length)return html;
  const tag=o=>!kpObsValid(o)?'<span class="tag warn">不计入</span>':o.grade==='独立完成'?'<span class="tag ok">合格</span>':'<span class="tag warn">要补学</span>';
  const card='<div class="card"><h3>实操观察 <span class="hint">主管 / 带教现场记；和做题成绩分开，AI 对话不计入</span></h3>'
    +(rows.length?'<div class="tw"><table class="t"><tr><th>维度</th><th>结论</th><th>观察人</th><th>来源</th><th>日期</th><th>是否计入</th></tr>'+rows.map(o=>'<tr><td>'+esc(o.dim)+'</td><td>'+esc(o.grade)+'</td><td>'+esc(o.by||'—')+'</td><td>'+esc((o.source||'').replace('（不计入）',''))+'</td><td>'+esc(o.at||'')+'</td><td>'+tag(o)+'</td></tr>').join('')+'</table></div>'
      :'<div class="hint">还没有实操记录。'+packs.map(p=>esc(p.name)).join('、')+' 做完题和演练后，要由主管 / 带教现场观察才算完成。</div>')+'</div>';
  return html.indexOf('<div class="dgrid">')>=0?html.replace('<div class="dgrid">',card+'<div class="dgrid">'):html+card;
};
/* 知识点库「能练」下面补一行实操结论 */
const __statusCellV14=kpStatusCell;
kpStatusCell=function(k){
  const html=__statusCellV14(k);
  const rows=kpObsRows(k).filter(kpObsValid);
  if(!rows.length)return html;
  const pass=rows.filter(o=>o.grade==='独立完成').length;
  return html.replace('</td>','<div class="kp-st '+(pass===rows.length?'ok':'gap')+'">实操 '+pass+'/'+rows.length+' 合格</div></td>');
};

/* ---------- 8. 演示路径：完整接待、异常成交、置换各一个学习包，都要实操观察 ---------- */
const __kpV13TrainV14=kpV13Train;
kpV13Train=function(){
  __kpV13TrainV14();
  const mid=(S.lrn&&S.lrn[0]&&S.lrn[0].mid)||'';
  const r=(S.packs||[]).find(p=>p.id==='PK_R01');
  if(r){r.needObs=true;r.obsDims=KP_OBS_DIMS.R01.slice();r.observe=r.observe||[]}
  const mk=(id,train,kid,name,drill)=>{
    if((S.packs||[]).some(p=>p.id===id))return;
    S.packs.unshift({id,tpl:'train',mid,mids:[],kp:kid,name,arranged:true,planCopied:true,fromCourse:'',train,year:'演示年款A',car:'',status:'进行中',due:typeof addDays==='function'?addDays(today,7):'',ts:today,audience:1,
      steps:[{id:'drill',t:'演练',req:true,drillIds:[drill],done:false}],bank:{qs:[],drills:[drill],contentId:''},pick:{contentId:'',qIds:[],drillIds:[drill]},observe:[],needObs:true,obsDims:KP_OBS_DIMS[train].slice()});
  };
  mk('PK_E01','E01','XM-O01','异常成交 · 改配或退款只查证','D_E01');
  mk('PK_T01','T01','XM-O07','置换 · 只转评估不自己估价','D_T01');
};
