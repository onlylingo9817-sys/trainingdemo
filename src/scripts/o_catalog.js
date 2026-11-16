/* ========== 知识点 ==========
   知识点平铺,不自建层级;分类用「标签树」,一个点可挂多个标签。
   标签树可自主维护:可以是车上部位,也可以是政策、卖点、场景等业务分类。
   内容、题、演练都"挂"在知识点上,各留在原来的地方。 */
const KP_TABS=['总览','知识点库','批量新建','候选','清河迁移'];
const KP_TYPES=['事实型','技能型'];
const KP_DIMS=['探需','场景化讲车','顾虑解除','带人辅导'];
const KP_EXT_T=['清河考试','话术演练','角色演练'];
const KP_EXT_SRC={话术演练:'情景演练',角色演练:'情景演练',清河考试:'清河大学',练习题:'本系统'};
const KP_Q_T=['话术演练','清河考试','练习题'];
const KP_CELLS=[['owner','负责人'],['exp','讲解'],['q','测评题'],['drill','演练'],['fresh','新鲜度']];
/* ---- 标签树种子:第一次进入时装载;之后可在标签管理里维护,PTAGS 是当前生效的节点 ---- */
const PTAG_RAW=[
 ['车型卖点',[
  ['外饰',['迎宾踏板','电动侧踏','车身结构','车灯','车轮']],
  ['内饰',['座椅','储物','空间布局','车内冰箱','桌板']],
  ['座舱',['大屏','音响','影音']],
  ['能源',['外放电','续航','充电与补能']],
  ['智驾',['辅助驾驶','主动安全','哨兵']],
  ['安全',['车身安全','被动安全']],
  ['经济性',['用车成本']]
 ]],
 ['政策口径',['国补地补','以旧换新','金融方案']],
 ['销售场景',['邀约到店','展厅接待','试驾','报价谈判']]
];
const PTAGS=[];
function ptagSeed(){
  PTAGS.length=0;let n=0;
  const walk=(name,kids,pid,lv)=>{const id='T'+(++n);const path=(pid?PTAGS.find(x=>x.id===pid).path+'_':'')+name;PTAGS.push({id,name,pid,lv,path,status:'on'});(kids||[]).forEach(k=>typeof k==='string'?walk(k,null,id,lv+1):walk(k[0],k[1],id,lv+1))};
  PTAG_RAW.forEach(r=>walk(r[0],r[1],null,1));
  return PTAGS;
}
ptagSeed();
const ptagOf=id=>PTAGS.find(t=>t.id===id);
const ptagByPath=p=>{const norm=p.replace(/^产品_/,'车型卖点_');return PTAGS.find(t=>(t.path===norm||t.path===p||t.path==='产品_'+p||t.path==='车型卖点_'+p)&&t.status!=='off')};
const ptagKids=id=>PTAGS.filter(t=>t.pid===id&&t.status!=='off');
const ptagDesc=id=>{const r=[id];ptagKids(id).forEach(c=>ptagDesc(c.id).forEach(x=>r.push(x)));return r};
const ptagLeaf=id=>!PTAGS.filter(t=>t.pid===id&&t.status!=='off').length;
const kpTagTxt=k=>(k.tags||[]).map(id=>{const t=ptagOf(id);return t?t.path:''}).filter(Boolean);
const kpTagNames=k=>(k.tags||[]).map(id=>{const t=ptagOf(id);return t?t.name:''}).filter(Boolean);
const kp=id=>S.kps.find(k=>k.id===id);
const kpMounted=k=>S.contents.filter(c=>(c.kps||[]).includes(k.id));
const kpUsesQH=k=>(k.ext||[]).some(e=>e.src==='清河大学');
const kpLabel=k=>k.name+(k.cars&&k.cars.length?' · '+k.cars.join('/'):(k.car&&k.car!=='通用车型'?' · '+k.car:''));
const kpOwners=()=>[...new Set(LECTURERS.concat(S.roles.map(r=>r.name)).concat(UI.role.type==='boss'?[]:[UI.role.name]))];
const kpLinks=c=>(c.kps||[]).map(kp).filter(Boolean).map(k=>'<a class="link" data-act="kpOpen" data-id="'+k.id+'">'+esc(kpLabel(k))+'</a>').join('、')||'<span class="tag warn">未挂载</span> <span class="hint">到「知识点」挂到知识点上</span>';
const kpUsedBy=k=>{const ids=new Set();kpMounted(k).forEach(c=>usedBy(c.id).forEach(p=>ids.add(p.id)));return ids.size};

function kpHealth(k){
  const m=kpMounted(k);const good=m.filter(c=>usableC(c)&&isPub(c)&&expState(c)!=='已过期');const cells={};
  cells.owner=k.owner?{s:'ok',t:'负责人:'+k.owner}:{s:'err',t:'没有负责人(不能启用)'};
  if(good.length)cells.exp={s:'ok',t:good.length+' 条可用讲解(已定稿且已上架)'};
  else if(!m.length)cells.exp={s:'err',t:'没有挂载任何内容'};
  else if(m.some(c=>usableC(c)))cells.exp={s:'err',t:'有已定稿内容,但没上架或已过期'};
  else cells.exp={s:'err',t:'挂载的内容还没定稿('+m.map(c=>c.st).join('、')+')'};
  const qn=kpQn(k);cells.q=qn>=S.cfg.kpQ?{s:'ok',t:'测评题 '+qn+' 道'}:{s:'warn',t:qn?'测评题 '+qn+' 道,少于 '+S.cfg.kpQ+' 道':'没有测评题'};
  const dro=drsOf(k.id,'已定稿');const dr=(k.ext||[]).filter(e=>['话术演练','角色演练'].includes(e.t));cells.drill=dro.length?{s:'ok',t:dro.length+' 个演练(本系统)'+(dr.length?' + '+dr.length+' 个登记':'')}:dr.length?{s:'ok',t:dr.length+' 个演练(登记自情景演练)'}:{s:'warn',t:(k.type==='技能型'?'技能型知识点没有演练':'没有演练')};
  if(!m.length)cells.fresh={s:'na',t:'没有挂载内容,无法判断'};
  else{const ex=m.filter(c=>expState(c)==='已过期'),soon=m.filter(c=>expState(c)==='即将到期'),fb=m.reduce((a,c)=>a+fbOf(c.id).filter(f=>f.st==='待处理').length,0),hi=m.filter(c=>c.up+c.down>0&&c.down/(c.up+c.down)*100>=S.cfg.dislikeTh).length;
    const bad=[];if(ex.length)bad.push(ex.length+' 条已过期');if(soon.length)bad.push(soon.length+' 条即将到期');if(fb)bad.push(fb+' 条一线反馈待处理');if(hi)bad.push(hi+' 条点踩偏高');
    cells.fresh=bad.length?{s:'warn',t:bad.join('、')}:{s:'ok',t:'内容在有效期内,无待处理反馈'}}
  const vals=Object.values(cells).map(x=>x.s);return {cells,level:vals.includes('err')?'err':vals.includes('warn')?'warn':'ok'}}
const kpDots=h=>KP_CELLS.map(x=>'<span class="kp-d s-'+h.cells[x[0]].s+'" title="'+esc(x[1]+':'+h.cells[x[0]].t)+'"></span>').join('');
const kpLv=l=>'<span class="tag kp-lv-'+l+'">'+({ok:'完备',warn:'待补',err:'有缺口'}[l])+'</span>';

/* ---- 挂载推荐:点名 / 同义词命中 + 二字词重合,同车型加分(演示用规则;正式做用语义向量) ---- */
function kpBg(s){s=String(s||'').replace(/[\s\d·，。、,.!！?？\-—（）()「」"'：:；;]/g,'');const o=new Set();for(let i=0;i<s.length-1;i++)o.add(s.slice(i,i+2));return o}
function kpScore(k,T,car){let s=0;if(T.includes(k.name))s+=6;(k.syn||[]).forEach(w=>{if(w&&T.includes(w))s+=5});
  const b=kpBg(k.name),t=kpBg(T);let ov=0;b.forEach(x=>{if(t.has(x))ov++});if(b.size)s+=4*ov/b.size;
  (k.tags||[]).forEach(id=>{const t=ptagOf(id);if(t&&t.name.length>=2&&T.includes(t.name))s+=3});
  if(car&&car!=='通用车型'&&kpCars(k).includes(car))s+=1.5;return s}
function recKpsFor(o,n){const T=(o.title||'')+' '+(o.kw||'')+' '+(o.text||'');
  return S.kps.filter(k=>k.st==='启用').map(k=>[k,kpScore(k,T,o.car)]).filter(x=>x[1]>=2.5).sort((a,b)=>b[1]-a[1]).slice(0,n).map(x=>x[0])}
const recKps=c=>recKpsFor({title:c.title,kw:c.kw,car:c.car,text:bodyLines(c.kind,c.body||{}).join(' ')},3);

/* ---- 内容编辑页的「知识点」选择器:先推荐再确认;可搜索;按内容车型预过滤 ---- */
const kpPickLbl=k=>kpLabel(k)+((k.tags||[]).length?' ['+((ptagOf(k.tags[0])||{}).name||'')+']':'');
const kpCarOk=(k,car)=>!car||car==='通用车型'||kpCars(k).includes(car)||kpCars(k).includes('通用车型');
function kpPicker(){
  const has=C.kps||[];const sel=has.map(kp).filter(Boolean);
  const rec=recKpsFor({title:C.title,kw:C.kw,car:C.car,text:(C.kind==='话术'?SPIN_K.map(k=>C.spin[k]||'').join(' '):C.intro)+' '+C.bscene},3).filter(k=>!has.includes(k.id));
  const opts=S.kps.filter(k=>k.st==='启用'&&!has.includes(k.id)&&kpCarOk(k,C.kind==='话术'?C.car:''));
  return (sel.length?'<div style="margin-bottom:8px">'+sel.map(k=>'<span class="tag pri" style="margin:0 6px 6px 0;padding:3px 8px">'+esc(kpLabel(k))+' <a class="link" data-act="cKpDel" data-v="'+k.id+'">×</a></span>').join('')+'</div>':'<div class="hint" style="margin-bottom:6px">还没有挂知识点。不挂也能提交,但进不了完备度检查。</div>')
   +(rec.length?'<div style="margin-bottom:8px"><span class="hint">系统推荐(点一下确认):</span> '+rec.map(k=>'<span class="tag blue" style="cursor:pointer;margin:0 6px 4px 0;padding:3px 8px" data-act="cKpRec" data-v="'+k.id+'">+ '+esc(kpPickLbl(k))+'</span>').join('')+'</div>':'')
   +'<input list="cp_kl" data-wc="cKpAdd" placeholder="输入关键词搜索知识点,如 储物、外放电" style="width:100%;max-width:420px"><datalist id="cp_kl">'+opts.map(k=>'<option value="'+esc(kpPickLbl(k))+'"></option>').join('')+'</datalist>'
   +'<div class="hint" style="margin-top:4px">'+(C.kind==='话术'&&C.car&&C.car!=='通用车型'?'已按这条话术的车型预过滤(「'+esc(C.car)+'」+ 通用车型),可选 '+opts.length+' 个':'可选 '+opts.length+' 个')+'</div>'}
A.cKpAdd=el=>{const v=(el.value||'').trim();if(!v)return;const k=S.kps.find(x=>x.id===v)||S.kps.find(x=>kpPickLbl(x)===v||kpLabel(x)===v);if(!k)return toast('没有这个知识点,请从提示列表里选','err');C.kps=C.kps||[];if(!C.kps.includes(k.id))C.kps.push(k.id);render()};
A.cKpRec=el=>{C.kps=C.kps||[];if(!C.kps.includes(el.dataset.v))C.kps.push(el.dataset.v);render()};
A.cKpDel=el=>{C.kps=(C.kps||[]).filter(x=>x!==el.dataset.v);render()};
/* ---- 种子:知识点(试点:销售顾问 · 讲车)。在售车型 10 多个,这里只做 N70 / N90 / 通用三组 ---- */
const KP_SEED=[
 // [id, 名称, 类型, 标签(路径,可多个), 能力维度, 车型, 同义词, 负责人]
 ['K1','极致储物','事实型',['内饰_储物','内饰_空间布局'],'场景化讲车','N70系列',['后备箱容量','储物空间','装得下'],'王磊'],
 ['K2','二排零重力座椅','事实型',['内饰_座椅'],'场景化讲车','N90 Max',['零重力','一键躺平','腿托'],'王磊'],
 ['K3','上下车便利','事实型',['外饰_迎宾踏板','外饰_电动侧踏'],'场景化讲车','N90 Max',['电动侧踏','三节台阶','开门角度'],'李娜'],
 ['K4','6.6kW 外放电','事实型',['能源_外放电'],'场景化讲车','N90 Max',['外放电','露营用电','电磁炉'],'陈刚'],
 ['K5','长续航与补能','事实型',['能源_续航','能源_充电与补能'],'场景化讲车','N90 Max',['续航','纯电 464','1705'],'陈刚'],
 ['K6','辅助驾驶与主动安全','事实型',['智驾_辅助驾驶','智驾_主动安全'],'场景化讲车','N90 Max',['XLA','驾驶辅助','主动安全'],'李娜'],
 ['K7','车身安全与超强钢','事实型',['外饰_车身结构','安全_车身安全'],'场景化讲车','N70系列',['2200兆帕','超强钢'],null],
 ['K8','移动办公空间','事实型',['内饰_桌板','内饰_空间布局'],'场景化讲车','N90 Max',['移动办公室','办公桌板','商务接待','洽谈'],'李娜'],
 ['K9','家庭出行与儿童座椅','事实型',['内饰_座椅','内饰_空间布局'],'场景化讲车','N90 Max',['二胎','儿童座椅','带娃','孕妇','老人'],'李娜'],
 ['K10','车内影音与娱乐','事实型',['座舱_大屏','座舱_音响','座舱_影音'],'场景化讲车','N90 Max',['私人影院','贵妃椅','21.4寸','电影'],'王磊'],
 ['K11','露营与车内休息','事实型',['能源_外放电','内饰_座椅'],'场景化讲车','N90 Max 探索版',['露营','大床房','户外电影'],'陈刚'],
 ['K12','车载冰箱','事实型',['内饰_车内冰箱'],'场景化讲车','通用车型',['压缩机冰箱','冷冻'],null],
 ['K13','宠物出行','事实型',['内饰_空间布局'],'场景化讲车','通用车型',['大型犬','猫咖','猫砂盆'],'王磊'],
 ['K14','个人创业与移动工作','事实型',['内饰_空间布局','能源_外放电'],'场景化讲车','通用车型',['移动咖啡店','移动工作室'],null],
 ['K15','用车成本与省钱账','事实型',['经济性_用车成本'],'场景化讲车','通用车型',['油耗','保养','省钱'],'陈刚'],
 ['K16','哨兵模式与低速照明','事实型',['智驾_哨兵','外饰_车灯'],'场景化讲车','通用车型',['哨兵','低速照明','360'],'李娜'],
 ['K17','场景化讲车(SPIN 四步)','技能型',[],'场景化讲车','通用车型',['SPIN','情境痛点影响需求'],'王磊'],
 ['K18','价格异议处理','技能型',[],'顾虑解除','通用车型',['你们更贵','让价','价值锚点'],'李娜'],
 ['K19','竞品对比与顾虑解除','技能型',[],'顾虑解除','通用车型',['GLC','问界','极氪','对比'],'李娜'],
 ['K20','探需提问','技能型',[],'探需','通用车型',['探需','需求挖掘'],'李娜'],
 ['K21','邀约到店 / 试驾','技能型',[],'探需','通用车型',['邀约','约时间','预约试驾'],'王磊'],
 ['K22','国补地补政策口径','事实型',[],'顾虑解除','通用车型',['国补','地补','以旧换新','补贴'],'李娜'],
 ['K23','展厅接待与开场','技能型',[],'探需','通用车型',['接待','首句问候'],null]
];
/* 外部资源登记:情景演练问答(来自 xm_ast_dialogue_script_qa)/ 清河考试。数量是示意,正式对接时由各系统回写 */
const KP_EXT_SEED={K1:[['话术演练','极致储物应答',4,'情景演练']],K2:[['话术演练','二排座椅卖点',3,'情景演练']],K5:[['清河考试','续航与补能考核',8,'清河大学']],K6:[['清河考试','辅助驾驶认证考试',10,'清河大学']],K7:[['清河考试','车身安全认证考试',6,'清河大学']],K17:[['话术演练','SPIN 话术问答',12,'情景演练'],['角色演练','展厅接待-首购客户',0,'情景演练']],K18:[['话术演练','价格异议应答',8,'情景演练'],['角色演练','关单谈判-价格异议',0,'情景演练']],K19:[['话术演练','竞品对比应答',6,'情景演练']],K20:[['角色演练','门店接待-探需',0,'情景演练']],K21:[['角色演练','电话邀约-首购客户',0,'情景演练'],['清河考试','邀约流程考核',6,'清河大学']],K22:[['清河考试','国补地补政策考试',10,'清河大学']],K23:[['角色演练','门店接待-首次到店',0,'情景演练']]};
/* 话术 / 课程 → 知识点:按标题(卖点名)归类;手工指定几条旧内容,留一批"未挂载"让运营看到缺口 */
const KP_MAP_TITLE=[[/极致储物/,'K1'],[/零重力/,'K2'],[/上下车/,'K3'],[/6\.6kW/,'K4'],[/长续航/,'K5'],[/辅助驾驶/,'K6'],[/2200|超强钢/,'K7'],[/移动办公|商务接待/,'K8'],[/二胎|孕妇|老人|宝妈|带孩子露营|孩子的|小饭桌|游乐场/,'K9'],[/影院|电影之夜/,'K10'],[/露营大床|环国/,'K11'],[/冰箱/,'K12'],[/大型犬|猫咖/,'K13'],[/咖啡店|移动工作室/,'K14'],[/省钱/,'K15'],[/哨兵|低速照明/,'K16']];
const KP_MAP_OLD={N1:['K19'],N2:['K22'],N3:['K21'],N4:['K20'],N7:['K18'],N8:['K19'],N9:['K22'],N10:['K19'],N16:['K23'],N17:['K22']};
function kpSeed(){
  S.kps=KP_SEED.map(a=>({id:a[0],name:a[1],type:a[2],tags:a[3].map(p=>(ptagByPath(p)||{}).id).filter(Boolean),dim:a[4],car:a[5],cars:[a[5]],syn:a[6],owner:a[7],st:a[7]?'启用':'停用',ext:(KP_EXT_SEED[a[0]]||[]).map(e=>({t:e[0],name:e[1],n:e[2],src:e[3]})),created:addDays(today,-20),hist:[]}));
  S.kps.filter(k=>!k.owner).forEach(k=>{k.hist.push({t:addDays(today,-3),who:'系统',act:'停用',note:'没有负责人,按规则不能启用'})});
  S.contents.forEach(c=>{if(KP_MAP_OLD[c.id]){c.kps=KP_MAP_OLD[c.id].slice();return}
    if(/^N1\d\d$/.test(c.id)){const nm=c.title.split(' · ')[1]||c.title;const m=KP_MAP_TITLE.find(x=>x[0].test(nm));
      if(m&&!['N108','N124'].includes(c.id)){c.kps=[m[1]];if(c.id==='N105'||c.id==='N107')c.kps=['K2']}}});
  /* 其中有一条话术同时讲两个点:空间 + 家庭出行 */
  const n15=content('N115');if(n15&&n15.kps)n15.kps=['K9','K1'];
  S.kpCand=[
    {id:'C1',name:'充电与补能规划',type:'事实型',car:'N90 Max',from:'汽车语料 badcase 聚类',why:'近 14 天 86 条会话客户问"路上怎么充电",现有内容没有对应知识点',st:'待确认',sug:['长续航与补能']},
    {id:'C2',name:'智驾功能边界说明',type:'技能型',car:'通用车型',from:'一线点踩反馈',why:'「辅助驾驶省心」被点踩 3 次,原因"夸大"',st:'待确认',sug:['辅助驾驶与主动安全']},
    {id:'C3',name:'金融方案讲解',type:'事实型',car:'通用车型',from:'课题池「金融口径」',why:'课题池 1 个问题无对应知识点',st:'待确认',sug:[]}
  ];
  S.kpDone=0}
/* ================= 知识点页 ================= */
const kpFx=()=>UI.sel.kpf||(UI.sel.kpf={});
function pgCatalog(){
  const t=curTab('catalog',KP_TABS);const head='<div class="ph"><h2>知识点 <span class="hint" style="font-weight:400">备料的"清单":要备什么、备齐没有。一点一座"弹药库"(讲解 + 题 + 演练),缺什么一眼看出;弹药本身在「内容中心」造</span></h2><div><button class="btn pri" data-act="kpNew">新增知识点</button></div></div>';
  let b='';
  if(t==='总览'||t==='完备度看板')b=kpOverview();
  if(t==='看板')b=kpBoard();
  if(t==='候选'||t==='待确认候选')b=kpCands();
  if(t==='清河迁移'||t==='脱离清河')b=kpQh();
  const cnt={候选:S.kpCand.filter(x=>x.st==='待确认').length};
  return head+'<div class="tabs">'+KP_TABS.map(x=>'<div class="tab '+(t===x?'on':'')+'" data-act="tab" data-k="catalog" data-v="'+x+'">'+x+(cnt[x]?' <span class="dot" style="display:inline-block">'+cnt[x]+'</span>':'')+'</div>').join('')+'</div>'+b}
/* 总览里每个数字 / 色块都能点进去:带着筛选条件跳到「看板」 */
A.kpJump=el=>{const d=el.dataset;if(d.tab&&!d.fk){if(d.tab==='未挂载内容'){return A.kpGoMount()}UI.tab.catalog=({'完备度看板':'看板','待确认候选':'候选','脱离清河':'清河迁移'}[d.tab]||d.tab);return render()}UI.sel.kpf={};if(d.fk)UI.sel.kpf[d.fk]=d.fv;if(d.fk2)UI.sel.kpf[d.fk2]=d.fv2;UI.tab.catalog='看板';render();$('#main').scrollTop=0};
function kpTreeStat(id){const ids=new Set(ptagDesc(id));const ks=S.kps.filter(k=>k.st==='启用'&&(k.tags||[]).some(t=>ids.has(t)));const hs=ks.map(kpHealth);const all=S.kps.filter(k=>(k.tags||[]).some(t=>ids.has(t)));
  return {n:ks.length,all:all.length,ok:hs.filter(h=>h.level==='ok').length,err:hs.filter(h=>h.level==='err').length,warn:hs.filter(h=>h.level==='warn').length,noExp:hs.filter(h=>h.cells.exp.s!=='ok').length}}
function kpOverview(){
  const st=kpStats();const act=S.kps.filter(k=>k.st==='启用');const hs=act.map(k=>kpHealth(k));
  const cover=act.length?Math.round(hs.filter(h=>h.cells.exp.s==='ok').length/act.length*100):0;const okp=act.length?Math.round(st.ok/act.length*100):0;
  const num=(l,v,sub,attr,col)=>'<div class="stat kp-click" '+attr+' style="cursor:pointer;'+(col?'border-color:'+col:'')+'"><div class="l">'+l+'</div><div class="n">'+v+'</div><div class="hint">'+sub+'</div></div>';
  /* 标签树热力图 */
  const row=t=>{const x=kpTreeStat(t.id);const rate=x.n?Math.round(x.ok/x.n*100):null;const kids=ptagKids(t.id);const lvl=x.n?(x.err?'err':x.warn?'warn':'ok'):'na';
    return '<tr class="kp-click" data-act="kpJump" data-fk="tag" data-fv="'+t.id+'" style="cursor:pointer"><td style="padding-left:'+(10+(t.lv-1)*20)+'px">'+(kids.length?'<b>'+esc(t.name)+'</b>':esc(t.name))+' <span class="hint">'+(t.lv===1?'':'')+'</span></td><td>'+(x.all?x.all:'<span class="tag kp-lv-err" title="树上有这个节点,还没有知识点">0</span>')+'</td><td style="min-width:150px">'+(x.n?'<div style="display:flex;align-items:center;gap:8px"><div class="bar" style="width:90px"><i class="'+(rate>=70?'ok':rate>=30?'warn':'')+'" style="width:'+rate+'%"></i></div><span class="hint">'+x.ok+' / '+x.n+' 完备</span></div>':'<span class="hint">—</span>')+'</td><td>'+(x.n?(x.noExp?'<span class="tag kp-lv-err">'+x.noExp+' 缺讲解</span>':'<span class="tag kp-lv-ok">讲解齐</span>'):'')+'</td><td><span class="kp-d s-'+lvl+'"></span></td></tr>'};
  const tree='<div class="card"><h3>按标签树看 <span class="hint">点任意一行，带着该标签（含子标签）跳到知识点库</span></h3><table class="t"><tr><th>标签</th><th>知识点数</th><th>完备率</th><th>讲解</th><th></th></tr>'+PTAGS.filter(t=>t.lv<=4).map(row).join('')+'</table><div class="hint" style="margin-top:6px">标签可在「标签管理」里自主维护；一个知识点可挂多个标签，所以各行数字不能相加。</div></div>';
  /* 标签树上还没有知识点的叶子 */
  const gaps=PTAGS.filter(t=>ptagLeaf(t.id)&&!S.kps.some(k=>(k.tags||[]).includes(t.id)));
  const gapCard='<div class="card"><h3>树上有、还没有知识点的叶子 <span class="hint">共 '+gaps.length+' 个。叶子是部件 / 系统,通常要拆成若干卖点才是知识点</span></h3>'+(gaps.length?'<div>'+gaps.map(t=>'<span class="tag" style="margin:0 8px 8px 0;padding:4px 10px">'+esc(t.path.replace(/^[^_]+_/,''))+' <a class="link" data-act="kpNewTag" data-id="'+t.id+'">建知识点</a></span>').join('')+'</div>':'<div class="chk ok"><b>✓</b><span>每个叶子下都至少有一个知识点</span></div>')+'<div class="hint" style="margin-top:4px">树和知识点不是一一对应:树解决"这是车的什么部分",知识点解决"这个部分能讲出什么卖点"。</div></div>';
  /* 按车型 / 按负责人分布 */
  const dist=(title,keys,fkey,ofn,fmt)=>{const rows=keys.map(k=>{const ks=act.filter(x=>ofn(x)===k);const h=ks.map(kpHealth);return {k,n:ks.length,ok:h.filter(x=>x.level==='ok').length,err:h.filter(x=>x.level==='err').length,warn:h.filter(x=>x.level==='warn').length}}).filter(r=>r.n);
    return '<div class="card"><h3>'+title+'</h3>'+rows.map(r=>'<div class="kp-click" data-act="kpJump" data-fk="'+fkey+'" data-fv="'+esc(r.k)+'" style="display:flex;align-items:center;gap:10px;margin:8px 0;cursor:pointer"><div style="width:120px;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(fmt?fmt(r.k):r.k)+'</div><div class="kp-seg" style="flex:1" title="完备 '+r.ok+' · 待补 '+r.warn+' · 缺口 '+r.err+'"><i class="s-ok" style="width:'+r.ok/r.n*100+'%"></i><i class="s-warn" style="width:'+r.warn/r.n*100+'%"></i><i class="s-err" style="width:'+r.err/r.n*100+'%"></i></div><div class="hint" style="width:90px;text-align:right">'+r.n+' 个'+(r.err?' · <b style="color:#c8323a">'+r.err+' 缺口</b>':'')+'</div></div>').join('')+'<div class="hint">绿 完备 · 黄 待补 · 红 有缺口;点一行跳到看板</div></div>'};
  const cars=[...new Set(act.map(k=>k.car))];const owners=kpOwners().concat(['(无)']);
  /* 本月变化:能由事件算出来的部分 */
  const since=addDays(today,-30);
  const nNew=S.kps.filter(k=>k.created>=since).length;
  const nMount=S.contents.reduce((a,c)=>a+(c.hist||[]).filter(h=>h.act==='挂载知识点'&&h.t.slice(0,10)>=since).length,0);
  const nTopic=S.topics.filter(t=>t.kpId).length;
  const nExp=S.contents.filter(c=>(c.kps||[]).length&&(expState(c)==='已过期'||expState(c)==='即将到期')).length;
  const chg='<div class="card"><h3>近 30 天变化 <span class="hint">能由操作记录算出来的部分;完整趋势(缺口比上月多还是少)需要每日快照,演示未做</span></h3><div class="grid g4"><div class="stat"><div class="l">新增知识点</div><div class="n">'+nNew+'</div></div><div class="stat"><div class="l">新增挂载</div><div class="n">'+nMount+'</div></div><div class="stat"><div class="l">由薄弱点生成的课题</div><div class="n">'+nTopic+'</div></div><div class="stat kp-click" data-act="kpJump" data-fk="lv" data-fv="只看待补" style="cursor:pointer"><div class="l">挂载内容快到期 / 已过期</div><div class="n" style="color:'+(nExp?'#a15c00':'')+'">'+nExp+'</div></div></div></div>';
  /* 整体问题清单 */
  const noOwner=S.kps.filter(k=>!k.owner).length,noTag=S.kps.filter(k=>k.type==='事实型'&&!(k.tags||[]).length).length,noExpl=hs.filter(h=>h.cells.exp.s!=='ok').length;
  const todo='<div class="card"><h3>现在最该处理的 <span class="hint">每条点进去就是对应的列表</span></h3>'
   +[[noOwner,'个知识点没有负责人(不能启用)','data-act="kpJump" data-fk="owner" data-fv="(无)"'],[noExpl,'个启用的知识点没有可用讲解','data-act="kpJump" data-fk="lv" data-fv="只看有缺口"'],[st.un,'条内容还没挂知识点','data-act="kpJump" data-tab="未挂载内容"'],[S.kpCand.filter(x=>x.st==='待确认').length,'个候选知识点待确认','data-act="kpJump" data-tab="待确认候选"'],[noTag,'个产品知识没挂标签','data-act="kpJump" data-fk="tag" data-fv="__none"'],[kpWeakList().length,'个知识点学员集中薄弱','data-act="kpJump" data-tab="完备度看板"']].filter(x=>x[0]).map(x=>'<div class="kp-click" '+x[2]+' style="padding:7px 0;border-top:1px solid #f2f3f5;cursor:pointer"><b style="color:var(--pri)">'+x[0]+'</b> '+x[1]+' <span class="link">去处理 ›</span></div>').join('')+'</div>';
  return srcBar('这页回答"知识点整体怎么样"：覆盖到哪、缺口在哪个标签 / 车型 / 谁手里、学员侧哪里弱。所有数字和色块都能点，带着筛选条件跳到知识点库。')
   +'<div class="grid g4" style="margin-bottom:16px">'
   +num('讲解覆盖率',cover+'%','启用的点里有可用讲解的占比','data-act="kpJump" data-fk="lv" data-fv="只看有缺口"')
   +num('完备点占比',okp+'%','5 个点全绿的占比','data-act="kpJump" data-fk="lv" data-fv="只看完备"')
   +num('有缺口的点',st.err,'缺负责人 / 没有可用讲解','data-act="kpJump" data-fk="lv" data-fv="只看有缺口"',st.err?'#f3b5b8':'')
   +num('未挂载的内容',st.un,'进不了完备度检查','data-act="kpJump" data-tab="未挂载内容"')+'</div>'
   +todo+tree+gapCard+'<div class="grid g2">'+dist('按车型',cars,'car',k=>k.car)+dist('按负责人',owners,'owner',k=>k.owner||'(无)')+'</div>'+chg+kpWeakCard()}
A.kpNewTag=el=>{const t=ptagOf(el.dataset.id);KF={id:null,name:'',type:'事实型',car:'通用车型',tags:[t.id],dim:'场景化讲车',syn:'',owner:kpDefOwner()};UI.page='kpform';render()};
function kpStats(){
  const act=S.kps.filter(k=>k.st==='启用');const hs=act.map(k=>kpHealth(k));
  const un=S.contents.filter(c=>visC(c)&&!(c.kps||[]).length&&c.st!=='已归档').length;
  return {act:act.length,ok:hs.filter(h=>h.level==='ok').length,warn:hs.filter(h=>h.level==='warn').length,err:hs.filter(h=>h.level==='err').length,off:S.kps.filter(k=>k.st==='停用').length,un}}
function kpTagSel(f){return '<div class="fi2"><label>标签（含子标签）</label><select data-wc="kpset" data-k="tag"><option value="">全部</option><option value="__none" '+(f.tag==='__none'?'selected':'')+'>未挂标签</option>'+PTAGS.map(t=>'<option value="'+t.id+'" '+(f.tag===t.id?'selected':'')+'>'+'　'.repeat(t.lv-1)+esc(t.name)+'</option>').join('')+'</select></div>'}
function kpBoard(){
  const f=kpFx();const st=kpStats();const T=kp=>kp;
  const cars=[...new Set(S.kps.map(k=>k.car))];
  const rows=S.kps.filter(k=>(!f.tag||(f.tag==='__none'?(k.type==='事实型'&&!(k.tags||[]).length):(k.tags||[]).some(t=>ptagDesc(f.tag).includes(t))))&&(!f.car||k.car===f.car)&&(!f.type||k.type===f.type)&&(!f.dim||k.dim===f.dim)&&(!f.owner||(f.owner==='(无)'?!k.owner:k.owner===f.owner))&&(!f.q||k.name.includes(f.q)||(k.syn||[]).some(w=>w.includes(f.q)))).map(k=>({k,h:kpHealth(k)}))
    .filter(x=>!f.lv||(f.lv==='只看有缺口'?x.h.level==='err':f.lv==='只看待补'?x.h.level!=='ok':x.h.level==='ok'));
  const so=(k,l,o)=>'<div class="fi2"><label>'+l+'</label><select data-wc="kpset" data-k="'+k+'"><option value="">全部</option>'+o.map(x=>'<option '+(f[k]===x?'selected':'')+'>'+x+'</option>').join('')+'</select></div>';
  const fil='<div class="card" style="padding:14px 18px"><div class="filg"><div class="fi2"><label>知识点 / 同义词</label><input data-wc="kpq" value="'+esc(f.q||'')+'" placeholder="如:储物、外放电"></div>'+kpTagSel(f)+so('car','车型',cars)+so('type','类型',KP_TYPES)+so('dim','能力维度',KP_DIMS)+so('owner','负责人',kpOwners().concat(['(无)']))+so('lv','完备度',['只看有缺口','只看待补','只看完备'])+'</div></div>';
  const pend=S.kps.filter(k=>k.st==='停用').length;
  const mini=(l,v,h,c)=>'<div class="stat" style="'+(c?'border-color:'+c:'')+'"><div class="l">'+l+'</div><div class="n">'+v+'</div><div class="hint">'+h+'</div></div>';
  return srcBar('每个知识点一行,5 个点依次是:<b>负责人 · 讲解 · 测评题 · 演练 · 新鲜度</b>。绿 = 满足,黄 = 提醒,红 = 缺口,灰 = 无法判断(鼠标放上去看原因)。「讲解」要求至少 1 条<b>已定稿且已上架</b>的话术或课程;测评题数 = 本系统题库已定稿的题 + 演练、清河考试登记的题数。门槛在「规则」里改。')
   +'<div class="grid g4" style="margin-bottom:16px">'+mini('启用的知识点',st.act,'停用 '+st.off+' 个(没有负责人)')+mini('有缺口(红)',st.err,'缺负责人 / 没有可用讲解',st.err?'#f3b5b8':'')+mini('待补(黄)',st.warn,'缺题 / 缺演练 / 内容快到期')+mini('未挂载的内容',st.un,'还没挂到任何知识点','')+'</div>'
   +kpWeakCard()+fil+(rows.length?'<div class="tw"><table class="t nw stk"><tr><th>知识点</th><th>标签</th><th>车型</th><th>类型</th><th>能力维度</th><th>负责人</th><th>讲解 / 题 / 演练</th><th>完备度</th><th>弱点人数</th><th>被项目引用</th><th>操作</th></tr>'
   +rows.map(x=>{const k=x.k,m=kpMounted(k);return '<tr style="'+(k.st==='停用'?'opacity:.6':'')+'"><td style="white-space:normal;min-width:170px"><a class="link" data-act="kpOpen" data-id="'+k.id+'">'+esc(k.name)+'</a>'+(k.st==='停用'?' <span class="tag">停用</span>':'')+'<div class="hint">'+k.id+'</div></td><td style="white-space:normal;min-width:140px">'+(kpTagTxt(k).map(p=>'<span class="tag" style="margin:0 4px 4px 0">'+esc(p.replace(/^[^_]+_/,''))+'</span>').join('')||'<span class="hint">—</span>')+'</td><td>'+esc(k.car)+'</td><td>'+k.type+'</td><td>'+esc(k.dim)+'</td><td>'+(k.owner?esc(k.owner):'<span class="tag err">无</span>')+'</td><td>'+m.length+' / '+kpQn(k)+' / '+(k.ext||[]).filter(e=>/演练/.test(e.t)).length+'</td><td><span class="kp-dots">'+kpDots(x.h)+'</span> '+kpLv(x.h.level)+'</td><td>'+kpWeakTxt(k)+'</td><td>'+kpUsedBy(k)+' 个</td><td><a class="link" data-act="kpOpen" data-id="'+k.id+'">查看</a></td></tr>'}).join('')+'</table></div>'
   :cta('没有符合条件的知识点','调整上面的筛选条件。','<button class="btn" data-act="kpFclr">清除筛选</button>'))}
A.kpset=el=>{const f=kpFx();if(el.value)f[el.dataset.k]=el.value;else delete f[el.dataset.k];render()};
A.kpq=el=>{const f=kpFx();f.q=el.value.trim();render()};
A.kpFclr=()=>{UI.sel.kpf={};render()};
function kpUnmounted(){
  const rows=S.contents.filter(c=>visC(c)&&!(c.kps||[]).length&&c.st!=='已归档');
  return srcBar('这些内容还没挂到任何知识点,所以进不了完备度检查,诊断出短板时也推荐不到。点「挂载」会按标题、关键词、车型给出最多 3 个推荐,点一下确认即可;也可以一键采纳全部推荐。')
   +'<div class="card"><h3>未挂载的内容 <span class="hint">共 '+rows.length+' 条</span> <button class="btn sm" data-act="kpAcceptAll" style="margin-left:10px">采纳全部首选推荐</button></h3>'+(rows.length?'<table class="t"><tr><th>ID</th><th>标题</th><th>性质</th><th>车型</th><th>状态</th><th>系统推荐(点击挂载)</th><th></th></tr>'+rows.map(c=>{const r=recKps(c);return '<tr><td>'+c.id+'</td><td style="white-space:normal;min-width:200px"><a class="link" data-act="cView" data-id="'+c.id+'">'+esc(c.title)+'</a></td><td>'+kindTag(c.kind)+'</td><td>'+esc(c.car||'-')+'</td><td>'+cchip(c.st)+'</td><td>'+(r.length?r.map(k=>'<span class="tag blue" style="cursor:pointer;margin:0 6px 4px 0;padding:3px 8px" data-act="kpMount" data-id="'+c.id+'" data-k="'+k.id+'">+ '+esc(kpLabel(k))+'</span>').join(''):'<span class="hint">没有合适的,先新增知识点</span>')+'</td><td><a class="link" data-act="cView" data-id="'+c.id+'">打开</a></td></tr>'}).join('')+'</table>':'<div class="chk ok"><b>✓</b><span>所有内容都已挂载到知识点</span></div>')+'</div>'}
A.kpMount=el=>{const c=content(el.dataset.id);c.kps=c.kps||[];if(!c.kps.includes(el.dataset.k))c.kps.push(el.dataset.k);chist(c,'挂载知识点',kpLabel(kp(el.dataset.k)));toast('已挂载到「'+kp(el.dataset.k).name+'」','ok');render()};
A.kpAcceptAll=()=>{let n=0;S.contents.filter(c=>visC(c)&&!(c.kps||[]).length&&c.st!=='已归档').forEach(c=>{const r=recKps(c);if(r.length){c.kps=[r[0].id];chist(c,'挂载知识点','采纳系统推荐:'+kpLabel(r[0]));n++}});toast(n?'已采纳 '+n+' 条首选推荐':'没有可采纳的推荐',n?'ok':'err');render()};
function kpCands(){
  const rows=S.kpCand;
  return srcBar('候选知识点由系统从<b>汽车语料 badcase、一线点踩、课题池</b>里发现:客户反复在问、但还没有对应的知识点。运营只做三件事:确认新增、并入已有知识点、忽略。确认新增后需要指定负责人才能启用。')
   +'<div class="card"><h3>候选知识点 <span class="hint">AI 提取,人确认;同义词去重沿用语料标签治理的做法(相似度 + 人工确认)</span></h3>'+(rows.length?'<table class="t"><tr><th>候选</th><th>类型 / 车型</th><th>来源</th><th>为什么要加</th><th>状态</th><th>操作</th></tr>'+rows.map(x=>'<tr><td><b>'+esc(x.name)+'</b></td><td>'+x.type+' · '+esc(x.car)+'</td><td class="hint" style="white-space:normal">'+esc(x.from)+'</td><td style="white-space:normal;min-width:220px">'+esc(x.why)+(x.sug.length?'<div class="hint">相近的已有知识点:'+x.sug.map(esc).join('、')+'(可能是同义,建议先并入)</div>':'')+'</td><td>'+(x.st==='待确认'?'<span class="tag warn">待确认</span>':'<span class="tag '+(x.st==='已新增'?'ok':'')+'">'+x.st+'</span>')+'</td><td>'+(x.st==='待确认'?'<button class="btn sm pri" data-act="kpCandOk" data-id="'+x.id+'">确认新增</button> <button class="btn sm" data-act="kpCandMerge" data-id="'+x.id+'" '+(x.sug.length?'':'disabled')+'>并入已有</button> <button class="btn sm" data-act="kpCandNo" data-id="'+x.id+'">忽略</button>':'<span class="hint">—</span>')+'</td></tr>').join('')+'</table>':'<div class="hint">暂无候选</div>')+'</div>'}
A.kpCandOk=el=>{const x=S.kpCand.find(c=>c.id===el.dataset.id);const id='K'+(Math.max(0,...S.kps.map(k=>+k.id.slice(1)))+1);S.kps.push({id,name:x.name,type:x.type,tags:[],dim:x.type==='事实型'?'场景化讲车':'探需',car:x.car,syn:[],owner:null,st:'停用',ext:[],created:today,hist:[{t:today,who:meShort(),act:'由候选确认新增',note:x.from}]});x.st='已新增';toast('已新增「'+x.name+'」。还没有负责人,先停用状态;指定负责人后才能启用','ok');UI.kid=id;UI.page='kp';render()};
A.kpCandMerge=el=>{const x=S.kpCand.find(c=>c.id===el.dataset.id);const k=S.kps.find(k=>k.name===x.sug[0]);if(k){k.syn=(k.syn||[]).concat([x.name]);x.st='已并入「'+k.name+'」';toast('已并入「'+k.name+'」,并加为它的同义词','ok')}render()};
A.kpCandNo=el=>{const x=S.kpCand.find(c=>c.id===el.dataset.id);x.st='已忽略';render()};

/* ---- 脱离清河:登记里来源是清河大学的资源,按知识点列出;有自有题/演练的点可「切换」 ---- */
function kpQh(){
  const ks=S.kps.filter(kpUsesQH);const own=k=>kpOwnQn(k)>=S.cfg.kpQ;const left=ks.filter(k=>!own(k));
  const prog=ks.length?Math.round((ks.length-left.length)/ks.length*100):100;
  return srcBar('清河大学目前承担课程、作业、考试、报名。按"现在不满足的用清河兜底,后续逐步独立"的思路:凡是只靠清河的知识点,自动汇成这份<b>待替换清单</b>。自有题(本系统题库已定稿题 + 情景演练问答)达到 '+S.cfg.kpQ+' 道,即视为可以脱离。证书已决定过渡到资质,不在本清单。')
   +'<div class="grid g3" style="margin-bottom:16px"><div class="stat"><div class="l">仍登记清河资源的知识点</div><div class="n">'+ks.length+'</div></div><div class="stat"><div class="l">已有自有题可替换</div><div class="n">'+(ks.length-left.length)+'</div></div><div class="stat"><div class="l">脱离进度</div><div class="n">'+prog+'%</div><div class="bar" style="margin-top:6px"><i class="ok" style="width:'+prog+'%"></i></div></div></div>'
   +'<div class="card"><h3>待替换清单</h3><table class="t"><tr><th>知识点</th><th>清河资源</th><th>清河题数</th><th>自有题数</th><th>状态</th><th>操作</th></tr>'+(ks.length?ks.map(k=>{const q=(k.ext||[]).filter(e=>e.src==='清河大学');const qn=q.reduce((a,e)=>a+e.n,0);return '<tr><td><a class="link" data-act="kpOpen" data-id="'+k.id+'">'+esc(k.name)+'</a><div class="hint">'+esc(k.car)+' · 负责人 '+esc(k.owner||'无')+'</div></td><td>'+q.map(e=>esc(e.name)).join('、')+'</td><td>'+qn+'</td><td>'+kpOwnQn(k)+'</td><td>'+(own(k)?'<span class="tag ok">可替换</span>':'<span class="tag warn">只靠清河</span>')+'</td><td>'+(own(k)?'<button class="btn sm pri" data-act="kpQhOff" data-id="'+k.id+'">切到自有题</button>':'<a class="link" data-act="kpOpen" data-id="'+k.id+'">去补题</a>')+'</td></tr>'}).join(''):'<tr><td colspan="6"><div class="chk ok"><b>✓</b><span>所有知识点都不再依赖清河</span></div></td></tr>')+'</table><div class="hint" style="margin-top:8px">「切到自有题」= 把清河资源标为"只读保留历史成绩"。新的练习 / 考试只用自有题,清河里已下发的任务照旧跑完。</div></div>'}
A.kpQhOff=el=>{const k=kp(el.dataset.id);k.ext.filter(e=>e.src==='清河大学').forEach(e=>{e.src='清河大学(只读)';e.ro=1});kpHist(k,'切到自有题','清河资源转只读保留历史成绩');toast('「'+k.name+'」已切到自有题;清河成绩只读保留','ok');render()};
const kpHist=(k,act,note)=>k.hist.unshift({t:today+' '+new Date().toTimeString().slice(0,5),who:meShort(),act,note:note||''});

function kpRules(){
  const car=[...new Set(S.kps.map(k=>k.car))].filter(x=>x!=='通用车型');
  const T=(h,r)=>'<table class="t"><tr>'+h.map(x=>'<th>'+x+'</th>').join('')+'</tr>'+r.map(x=>'<tr>'+x.map(y=>'<td style="white-space:normal">'+y+'</td>').join('')+'</tr>').join('')+'</table>';
  return srcBar('这页是给运营看的"怎么用":知识点要填什么、怎么算好、新车型怎么起知识点。门槛数值可在本页改,改了完备度立刻变化。(原在知识点页签里,现统一放配置中心)')
   +'<div class="card"><h3>知识点怎么管：平铺 + 引用标签</h3>'+T(['字段','谁填 / 怎么来','用来干什么'],[
    ['名称(必填)','运营。粒度:能单独讲一次、单独出一道题','—'],
    ['车型(必填)','运营选。同一卖点在不同车型上话术不同,拆成不同的点','挂载推荐加分、新车型复制、编辑页预过滤'],
    ['类型(必填)','运营选:事实型(记没记住)/ 技能型(练没练到位)','决定怎么测评'],
    ['标签(选填,可多个)','引用「标签树」；标签可在「标签管理」自主维护，可以是车上部位、政策口径、卖点或场景。运营只选，不手填路径','按标签筛选、总览矩阵、挂载推荐'],
    ['能力项','产品知识默认「场景化讲车」，销售动作默认「探需」；与岗位标准共用 4 个能力项','岗位标准、诊断、效果归因'],
    ['负责人','默认创建人,可改。没有负责人不能启用','治理'],
    ['同义词','选填;语料里客户的说法也可加进来','挂载推荐、搜索']])
   +'<div class="hint" style="margin-top:8px;line-height:1.8"><b>为什么用标签</b>：同一个卖点可以同时属于「能源」「露营」「政策」等不同分类，标签支持多选，比单一目录更灵活。标签树由业务自己维护，改名不会让已挂的知识点失效。<br><b>标签和知识点的关系</b>：标签回答“它属于哪一类”，知识点回答“具体要讲什么”。标签可以比知识点粗，不要求一一对应。</div></div>'
   +'<div class="card"><h3>完备度的 5 个点</h3>'+T(['点','满足条件','不满足'],[['负责人','指定了一个具体的人','红:没有负责人,不能启用(自动停用)'],['讲解','至少 1 条「已定稿且已上架且未过期」的话术或课程','红:没挂载 / 没定稿 / 没上架'],['测评题','本系统题库已定稿题 + 演练问答 + 清河考试的题数合计 ≥ <input type="number" id="kp_q" value="'+S.cfg.kpQ+'" style="width:60px"> 道','黄'],['演练','至少 1 个情景演练(话术演练 / 角色演练)','黄'],['新鲜度','挂载内容无过期 / 即将到期 / 待处理一线反馈 / 点踩偏高','黄']])+'<div style="margin-top:10px"><button class="btn pri" data-act="kpCfg">保存门槛</button></div></div>'
   +'<div class="card"><h3>运营怎么用(4 个动作)</h3><div style="line-height:2"><b>① 看全貌</b>:「总览」看覆盖率、哪款车 / 哪个标签 / 谁手里缺口大，点进去就是列表。<br><b>② 看缺口</b>：在「知识点库」左侧选标签，右侧按车型、负责人、完备度筛。<br><b>③ 清未挂载</b>:到「内容中心」筛「知识点 = 未挂载」,点内容详情顶部链路条里的「未挂载 · 去挂」,系统给推荐,点一下确认。新增内容时表单里也能选。<br><b>④ 处理候选</b>:「候选」是系统从语料、反馈、课题池里发现的缺口,确认 / 并入 / 忽略;也会出现在「工作台」待办里。</div></div>'
   +'<div class="card"><h3>新车型怎么起知识点</h3><div class="hint" style="line-height:1.9;margin-bottom:8px">目前在售 10 多个车型。新车型上市时「一键复制」已有车型的卖点模板(含标签):复制出的知识点都是<b>停用 + 无讲解</b>,运营逐个补内容、指定负责人后再启用,不用重搭。</div><div style="display:flex;gap:8px;align-items:center"><select id="kp_cp_from">'+car.map(x=>'<option>'+esc(x)+'</option>').join('')+'</select> → <input type="text" id="kp_cp_to" placeholder="新车型名称,如 YU7 Max" style="width:180px"><button class="btn" data-act="kpCopy">复制卖点模板</button></div></div>'}
A.kpCfg=()=>{const v=+$('#kp_q').value;if(!(v>=1&&v<=50))return toast('请填 1–50','err');S.cfg.kpQ=v;toast('已保存:测评题门槛 '+v+' 道','ok');render()};
A.kpCopy=()=>{const from=$('#kp_cp_from').value,to=($('#kp_cp_to').value||'').trim();if(!to)return toast('请填写新车型名称','err');if(S.kps.some(k=>k.car===to))return toast('这个车型已经有知识点了','err');
  const src=S.kps.filter(k=>k.car===from&&k.type==='事实型');let n=Math.max(...S.kps.map(k=>+k.id.slice(1)));
  src.forEach(k=>S.kps.push({id:'K'+(++n),name:k.name,type:k.type,tags:(k.tags||[]).slice(),dim:k.dim,car:to,syn:(k.syn||[]).slice(),owner:null,st:'停用',ext:[],created:today,hist:[{t:today,who:meShort(),act:'复制自 '+k.id,note:'新车型卖点模板,待补内容和负责人'}]}));
  if(!S.cfg.tax.car.includes(to))S.cfg.tax.car.push(to);toast('已复制 '+src.length+' 个卖点知识点到「'+to+'」,都是停用状态,补内容并指定负责人后启用','ok');UI.page='catalog';UI.tab.catalog='看板';UI.sel.kpf={car:to};render()};
/* ================= 知识点详情 ================= */
function pgKp(){
  const k=kp(UI.kid);if(!k){UI.page='catalog';return pgCatalog()}
  const h=kpHealth(k);const m=kpMounted(k);const lst=S.kps;const ix=lst.indexOf(k);
  const cellT=KP_CELLS.map(x=>{const c=h.cells[x[0]];return '<div class="kp-cell s-'+c.s+'"><i></i><div><b>'+x[1]+'</b><div class="hint">'+esc(c.t)+'</div></div></div>'}).join('');
  const ext=(k.ext||[]);
  const dimBox=(typeof kpDimsHtml==='function'?kpDimsHtml(k):'');
  const sideInfo=(dimBox?'<div class="card sd"><h3>这个点教什么 <span class="hint">给内容和学员看的信息</span></h3>'+dimBox+'</div>':'')+'<div class="card sd"><h3>基本信息</h3><dl class="kv sm"><dt>知识类型</dt><dd>'+(typeof kpTypeText==='function'?kpTypeText(k):k.type)+'</dd><dt>适用车型</dt><dd>'+esc((k.cars||[k.car]).join(' / '))+'</dd><dt>标签</dt><dd>'+(kpTagTxt(k).map(p=>'<span class="tag" style="margin:0 4px 4px 0">'+esc(p.replace(/^[^_]+_/,''))+'</span>').join('')||'<span class="hint">未挂（销售动作类可以不挂）</span>')+'</dd><dt>同义词</dt><dd>'+((k.syn||[]).map(w=>'<span class="tag" style="margin:0 4px 4px 0">'+esc(w)+'</span>').join('')||'-')+'</dd></dl></div>'
   +'<div class="card sd"><h3>管理</h3><dl class="kv sm"><dt>负责人</dt><dd>'+(k.owner?esc(k.owner):'<span class="tag err">无</span>')+'</dd><dt>状态</dt><dd>'+(k.st==='启用'?'<span class="tag ok">启用</span>':'<span class="tag">停用</span>')+'</dd><dt>创建</dt><dd>'+esc(k.created)+'</dd><dt>被项目引用</dt><dd>'+kpUsedBy(k)+' 个学习项目</dd></dl>'
   +'<div style="margin-top:10px"><select data-wc="kpOwner"><option value="">指定负责人…</option>'+kpOwners().map(x=>'<option '+(k.owner===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select> <button class="btn sm" data-act="kpToggle">'+(k.st==='启用'?'停用':'启用')+'</button> <button class="btn sm" data-act="kpEdit">编辑</button></div></div>'
   +'<div class="card sd"><h3>变更记录</h3>'+((k.hist||[]).length?k.hist.slice(0,6).map(x=>'<div style="padding:3px 0;font-size:12.5px"><span class="hint">'+esc(x.t)+'</span> '+esc(x.who)+' '+esc(x.act)+(x.note?'<span class="hint"> · '+esc(x.note)+'</span>':'')+'</div>').join(''):'<div class="hint">无</div>')+'</div>';
  const main='<div class="card"><h3>这个点能上课了吗 '+kpLv(h.level)+'</h3><div class="hint" style="margin-bottom:8px">至少要有负责人、已上架讲解、'+S.cfg.kpQ+' 道题和一个演练；缺哪项点「去补」。</div><div class="kp-cells">'+cellT+'</div>'+kpFix(k,h)+'</div>'+kpMasteryCard(k)
   +'<div class="card"><h3>讲解 <span class="hint">话术 / 课程，在内容中心做。共 '+m.length+' 条</span> <button class="btn sm" data-act="kpGoMount" style="margin-left:8px">去挂载更多</button></h3>'+(m.length?'<table class="t"><tr><th>ID</th><th>标题</th><th>性质</th><th>状态</th><th>上架</th><th>有效期</th><th>点赞 / 点踩</th><th></th></tr>'+m.map(c=>'<tr><td>'+c.id+'</td><td style="white-space:normal;min-width:200px"><a class="link" data-act="cView" data-id="'+c.id+'">'+esc(c.title)+'</a></td><td>'+kindTag(c.kind)+'</td><td>'+cchip(c.st)+'</td><td>'+pubchip(pubOf(c))+'</td><td>'+(c.expire||'长期')+'</td><td>'+c.up+' / '+c.down+'</td><td><a class="link err" data-act="kpUnmount" data-id="'+c.id+'">取消挂载</a></td></tr>').join('')+'</table>':'<div class="hint">还没有内容挂在这个知识点上。去「内容中心」筛出「未挂载」的内容挂上来，或新建一条。</div>')+'</div>'
   +'<div class="card"><h3>测评题 <span class="hint">共 '+qsOf(k.id).length+' 道，已定稿 '+qsOf(k.id,'已定稿').length+'</span> <button class="btn sm" data-act="qNewFor" style="margin-left:8px">为这个点出题</button> <a class="link" data-act="qViewFor" style="font-size:12px;margin-left:6px">看全部 ›</a></h3>'+(qsOf(k.id).length?'<table class="t"><tr><th>题干</th><th>题型</th><th>状态</th><th>作答 / 正确率</th></tr>'+qsOf(k.id).map(q=>'<tr><td style="white-space:normal"><a class="link" data-act="qOpen" data-id="'+q.id+'">'+esc(q.stem)+'</a></td><td>'+q.type+'</td><td><span class="tag '+(q.st==='已定稿'?'ok':q.st==='草稿'?'blue':'')+'">'+q.st+'</span></td><td>'+(q.stat.n?q.stat.n+' 次 / '+qAcc(q)+'%':'<span class="hint">未作答</span>')+'</td></tr>').join('')+'</table>':'<div class="hint">这个知识点还没有题。</div>')+'</div>'
   +'<div class="card"><h3>情景演练 <span class="hint">共 '+drsOf(k.id).length+' 个，已定稿 '+drsOf(k.id,'已定稿').length+'</span> <button class="btn sm" data-act="drNewFor" style="margin-left:8px">为这个点建演练</button> <a class="link" data-act="drViewFor" style="font-size:12px;margin-left:6px">看全部 ›</a></h3>'+(drsOf(k.id).length?'<table class="t"><tr><th>名称</th><th>场景</th><th>回合</th><th>状态</th><th>练习 / 平均分 / 通关率</th></tr>'+drsOf(k.id).map(d=>'<tr><td style="white-space:normal"><a class="link" data-act="drOpen" data-id="'+d.id+'">'+esc(d.name)+'</a></td><td>'+d.scene+'</td><td>'+d.turns.length+'</td><td><span class="tag '+(d.st==='已定稿'?'ok':d.st==='草稿'?'blue':'')+'">'+d.st+'</span></td><td>'+(d.stat.n?d.stat.n+' 次 / '+drAvg(d)+' / '+drPassRate(d)+'%':'<span class="hint">未练习</span>')+'</td></tr>').join('')+'</table>':'<div class="hint">这个知识点还没有演练'+(k.type==='技能型'?'（销售动作最适合用演练来测）':'')+'。</div>')+'</div><div class="card"><h3>其他系统的测评 <span class="hint">不迁移，只登记在哪、有多少题；各系统以后回写</span></h3>'+(ext.length?'<table class="t"><tr><th>类型</th><th>名称</th><th>题数</th><th>来源系统</th><th></th></tr>'+ext.map((e,i)=>'<tr><td><span class="tag '+(/清河/.test(e.src)?'warn':'blue')+'">'+e.t+'</span></td><td>'+esc(e.name)+'</td><td>'+(e.n||'—')+'</td><td>'+esc(e.src)+(e.ro?' <span class="hint">历史只读</span>':'')+'</td><td><a class="link err" data-act="kpExtDel" data-i="'+i+'">移除</a></td></tr>').join('')+'</table>':'<div class="hint">没有登记测评和演练。</div>')
   +'<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;align-items:center"><select id="kpx_t">'+KP_EXT_T.map(x=>'<option>'+x+'</option>').join('')+'</select><input type="text" id="kpx_n" placeholder="名称" style="width:160px"><input type="number" id="kpx_c" placeholder="题数" style="width:80px"><button class="btn sm" data-act="kpExtAdd">登记</button></div></div>';
  return crumb('<a data-act="go" data-p="catalog">知识点</a> / '+k.id)
   +linkBar({type:'kp',k})+'<div class="cdh"><div class="cdh-l"><h2>'+esc(k.name)+'</h2><div class="ph-meta"><span class="tag">'+(typeof kpTypeText==='function'?kpTypeText(k):k.type)+'</span><span class="tag">'+esc((k.cars||[k.car]).join(' / '))+'</span>'+kpLv(h.level)+(k.st==='停用'?'<span class="tag">停用</span>':'')+'</div></div><div class="cdh-r"><div class="dnav"><button class="btn sm" data-act="kpNav" data-d="-1" '+(ix<=0?'disabled':'')+'>‹ 上一个</button><span class="hint">'+(ix+1)+' / '+lst.length+'</span><button class="btn sm" data-act="kpNav" data-d="1" '+(ix>=lst.length-1?'disabled':'')+'>下一个 ›</button></div></div></div>'
   +'<div class="dgrid"><div class="dmain">'+main+'</div><div class="dside">'+sideInfo+'</div></div>'}
A.kpOpen=el=>{closeDlg();UI.kid=el.dataset.id;UI.page='kp';render();$('#main').scrollTop=0};
A.kpNav=el=>{const i=S.kps.findIndex(x=>x.id===UI.kid)+ +el.dataset.d;if(i<0||i>=S.kps.length)return;UI.kid=S.kps[i].id;render();$('#main').scrollTop=0};
A.drNewFor=()=>{UI.sel.df={kp:UI.kid};A.drNew()};
A.drViewFor=()=>{UI.sel.caf={k:'演练',kp:UI.kid};UI.sel.cadv=false;UI.page='content';UI.tab.content='全部内容';render()};
A.qNewFor=()=>{UI.sel.qf={kp:UI.kid};A.qNew()};
A.qViewFor=()=>{UI.sel.caf={k:'题',kp:UI.kid};UI.sel.cadv=false;UI.page='content';UI.tab.content='全部内容';render()};
A.kpGoMount=()=>{UI.sel.caf={kp:'未挂载'};UI.sel.cadv=false;UI.page='content';UI.tab.content='全部内容';render()};
A.kpUnmount=el=>{const c=content(el.dataset.id);c.kps=(c.kps||[]).filter(x=>x!==UI.kid);chist(c,'取消挂载知识点',kp(UI.kid).name);toast('已取消挂载','ok');render()};
A.kpOwner=el=>{const k=kp(UI.kid);if(!el.value)return;k.owner=el.value;kpHist(k,'指定负责人',el.value);toast('已指定负责人:'+el.value,'ok');render()};
A.kpToggle=()=>{const k=kp(UI.kid);if(k.st==='停用'){if(!k.owner)return toast('没有负责人不能启用,请先指定负责人','err');k.st='启用';kpHist(k,'启用')}else{k.st='停用';kpHist(k,'停用')}toast('已'+k.st,'ok');render()};
A.kpExtAdd=()=>{const k=kp(UI.kid);const n=($('#kpx_n').value||'').trim(),t=$('#kpx_t').value,c=+$('#kpx_c').value||0;if(!n)return toast('请填写名称','err');k.ext.push({t,name:n,n:c,src:KP_EXT_SRC[t]});kpHist(k,'登记'+t,n+(c?'('+c+' 题)':''));render()};
A.kpExtDel=el=>{const k=kp(UI.kid);const e=k.ext.splice(+el.dataset.i,1)[0];kpHist(k,'移除登记',e.name);render()};
let KF=null;
const kpDefOwner=()=>UI.role.type==='boss'?'':UI.role.name;
const kpDefDim=t=>t==='事实型'?'场景化讲车':'探需';
A.kpNew=()=>{KF={id:null,name:'',type:'事实型',car:'通用车型',tags:[],dim:'场景化讲车',dimAuto:true,syn:'',owner:kpDefOwner(),more:false};UI.page='kpform';render()};
A.kpEdit=()=>{const k=kp(UI.kid);KF={id:k.id,name:k.name,type:k.type,car:k.car,tags:(k.tags||[]).slice(),dim:k.dim,dimAuto:false,syn:(k.syn||[]).join('、'),owner:k.owner||'',more:true};UI.page='kpform';render()};
A.kfset=el=>{KF[el.dataset.k]=el.value;if(el.dataset.k==='dim')KF.dimAuto=false;render()};
A.kfMore=()=>{KF.more=!KF.more;render()};
A.kfTagAdd=el=>{const v=el.value;if(!v)return;if(!KF.tags.includes(v))KF.tags.push(v);render()};
A.kfTagDel=el=>{KF.tags=KF.tags.filter(x=>x!==el.dataset.v);render()};
document.addEventListener('input',e=>{const el=e.target;if(el.dataset&&el.dataset.kf&&KF)KF[el.dataset.kf]=el.value});
function pgKpForm(){
  if(!KF){UI.page='catalog';return pgCatalog()}
  const sel=(k,arr)=>'<select data-wc="kfset" data-k="'+k+'">'+arr.map(o=>'<option '+(KF[k]===o?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select>';
  const dup=S.kps.find(k=>k.id!==KF.id&&k.name===KF.name.trim()&&k.car===KF.car);
  const tagOpts=PTAGS.filter(t=>!KF.tags.includes(t.id));
  const more=KF.more?
    FR('标签','<div style="margin-bottom:6px">'+(KF.tags.length?KF.tags.map(id=>'<span class="tag pri" style="margin:0 6px 6px 0;padding:3px 8px">'+esc(ptagOf(id).path.replace(/^[^_]+_/,''))+' <a class="link" data-act="kfTagDel" data-v="'+id+'">×</a></span>').join(''):'<span class="hint">未选</span>')+'</div><select data-wc="kfTagAdd"><option value="">从标签树里选(可多个)…</option>'+tagOpts.map(t=>'<option value="'+t.id+'">'+'　'.repeat(t.lv-1)+esc(t.name)+(t.lv>1?'  ('+esc(t.path.replace(/^[^_]+_/,''))+')':'')+'</option>').join('')+'</select>',{h:'引用可维护的标签树，不手填路径；一个点可以挂多个标签'})
   +FR('能力维度',sel('dim',KP_DIMS),{h:'默认：产品知识 → 场景化讲车，销售动作 → 探需。与岗位画像使用同一套 4 个能力'})
   +FR('同义词','<input type="text" data-kf="syn" value="'+esc(KF.syn)+'" placeholder="多个用顿号或逗号隔开,如 后备箱容量、装得下" style="width:100%;max-width:420px">',{h:'用于挂载推荐和搜索'})
   +FR('负责人','<select data-wc="kfset" data-k="owner"><option value="">(暂不指定,创建后为停用)</option>'+kpOwners().map(x=>'<option '+(KF.owner===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select>',{h:'默认是你自己;没有负责人不能启用'})
   :'<div class="fr"><div class="flb"></div><div class="fc"><span class="hint">其余默认:能力维度 <b>'+KF.dim+'</b> · 负责人 <b>'+esc(KF.owner||'暂无')+'</b>'+(KF.tags.length?' · 标签 <b>'+KF.tags.length+'</b> 个':'')+'</span> <a class="link" data-act="kfMore">展开修改(标签、同义词…)</a></div></div>';
  return crumb('<a data-act="go" data-p="catalog">知识点</a> / '+(KF.id?'编辑 '+KF.id:'新增知识点'))+'<div class="ph"><h2>'+(KF.id?'编辑知识点':'新增知识点')+' <span class="hint" style="font-weight:400">只有名称、车型、类型必填</span></h2></div>'
   +'<div class="card frm">'+FR('名称','<input type="text" data-kf="name" value="'+esc(KF.name)+'" placeholder="一个点能单独讲一次、单独出一道题,如:6.6kW 外放电" style="width:100%;max-width:420px">',{req:1,h:'粒度判断:能单独讲一次、单独出一道题。太粗 → 拆;太细 → 并'})
   +FR('车型',sel('car',S.cfg.tax.car),{req:1,h:'同一卖点在不同车型上话术不同,所以拆成不同的点'})
   +FR('类型','<div class="rels">'+KP_TYPES.map(x=>'<span class="'+(KF.type===x?'on':'')+'" data-act="kfType" data-v="'+x+'">'+x+'</span>').join('')+'</div>',{req:1,h:KF.type==='事实型'?'事实型:某车型的某个卖点 / 政策口径,看"记没记住"':'技能型:异议处理、探需等,看"练没练到位"'})
   +more
   +(KF.type==='事实型'&&!KF.tags.length&&KF.more?'<div class="chk rec"><b>·</b><span>产品知识建议至少挂一个标签，方便在标签树里检索（提醒，不拦截）</span></div>':'')
   +(dup?'<div class="chk must"><b>!</b><span>已经有「'+esc(dup.name)+'」('+esc(dup.car)+'),不要重复建。</span></div>':'')
   +'</div><div class="dock"><span class="sp"></span><button class="btn" data-act="kfCancel">取消</button><button class="btn pri" data-act="kfSave">保存</button></div>'}
A.kfType=el=>{KF.type=el.dataset.v;if(KF.dimAuto)KF.dim=kpDefDim(KF.type);render()};
A.kfCancel=()=>{const id=KF&&KF.id;KF=null;UI.page=id?'kp':'catalog';if(id)UI.kid=id;render()};
A.kfSave=()=>{const n=(KF.name||'').trim();if(!n)return toast('请填写名称','err');if(S.kps.some(k=>k.id!==KF.id&&k.name===n&&k.car===KF.car))return toast('已有同名同车型的知识点','err');
  const syn=String(KF.syn||'').split(/[、,，\s]+/).filter(Boolean);let k;
  if(KF.id){k=kp(KF.id);Object.assign(k,{name:n,type:KF.type,car:KF.car,tags:KF.tags.slice(),dim:KF.dim,syn,owner:KF.owner||null});if(!k.owner&&k.st==='启用'){k.st='停用';kpHist(k,'停用','没有负责人')}kpHist(k,'编辑')}
  else{const id='K'+(Math.max(0,...S.kps.map(x=>+x.id.slice(1)))+1);k={id,name:n,type:KF.type,tags:KF.tags.slice(),dim:KF.dim,car:KF.car,syn,owner:KF.owner||null,st:KF.owner?'启用':'停用',ext:[],created:today,hist:[]};S.kps.push(k);kpHist(k,'新增',KF.owner?'':'没有负责人,先停用')}
  KF=null;UI.kid=k.id;UI.page='kp';toast(k.st==='启用'?'已保存并启用':'已保存。还没有负责人,先停用;指定后才能启用','ok');render()};
/* ================= 零售通:自适应学习(诊断 → 提升清单 → 学 → 练 → 过关 → 间隔复测) =================
   演示版:作答由模拟数据代替;正式版题目取自知识点登记的演练问答 / 练习题,掌握度由答题和演练成绩算出 */
const KP_PASS=70;
const mst=(mid,kid)=>((S.mastery[mid]||{})[kid]);
function mstSet(mid,kid,o){(S.mastery[mid]||(S.mastery[mid]={}))[kid]=Object.assign(mst(mid,kid)||{},o)}
const kpPool=()=>S.kps.filter(k=>k.st==='启用'&&kpMounted(k).some(c=>usableC(c)&&isPub(c)));
const adaptTested=mid=>Object.keys(S.mastery[mid]||{}).filter(id=>kp(id));
/* v23:有画像时,排序权重 = 缺口 × 该知识点所在画像项的权重;没有画像(旧学员)退回 v22 的"缺口 × 被引用数" */
function adaptList(mid){
  const l=typeof lrnOf==='function'?lrnOf(mid):null;
  const pf=l&&S.profiles&&S.profiles.length?pfOf(l.tier):null;
  const wOf=k=>{if(!pf)return null;let w=0;pf.items.forEach(it=>{if(pfKps(it).some(x=>x.id===k.id))w=Math.max(w,it.weight)});return w};
  return adaptTested(mid).map(id=>({k:kp(id),m:mst(mid,id)})).filter(x=>x.k&&x.k.st==='启用').map(x=>{const pw=wOf(x.k);return Object.assign(x,{pw,w:pw==null?(100-x.m.v)*(1+Math.min(3,kpUsedBy(x.k)))/2:(100-x.m.v)*(0.4+pw/50)})}).sort((a,b)=>b.w-a.w)}
function rAdapt(){
  const mid=ME.mid;const L=adaptList(mid);const weak=L.filter(x=>x.m.v<KP_PASS),pass=L.filter(x=>x.m.v>=KP_PASS);const pool=kpPool();
  const avg=L.length?Math.round(L.reduce((a,x)=>a+x.m.v,0)/L.length):0;
  let b=rnav('我的提升清单',true);
  if(!L.length){
    return b+'<div class="ad-hero"><b>先测一测,再逐项提升</b><p>每个知识点 2 题,答完马上告诉你对错和原因。测完列出你可以提升的点,逐项学、练、过关。</p><div class="ad-n">本次覆盖 <b>'+kpDiagSet(mid).map(id=>qById(id).kp).filter((v,i,a)=>a.indexOf(v)===i).length+'</b> 个知识点 · <b>'+kpDiagSet(mid).length+'</b> 题 · 约 5 分钟</div><button class="rb" style="padding:9px 24px;font-size:14px" data-act="adDiag">开始诊断测</button><div class="hint" style="margin-top:8px;color:#999;font-size:11px">题目来自一线话术原文,答案和解析都来自话术</div></div>'+'<div style="height:30px"></div>'}
  b+=rdyCard(mid);
  b+='<div class="ad-sum"><div><b>'+avg+'</b><small>平均掌握度</small></div><div><b style="color:#e5484d">'+weak.length+'</b><small>待提升</small></div><div><b style="color:#12a36b">'+pass.length+'</b><small>已过关</small></div></div>';
  const row=x=>{const k=x.k,v=x.m.v;const lc=kpMounted(k).filter(c=>usableC(c)&&isPub(c)&&expState(c)!=='已过期');const can=qsOf(k.id,'已定稿').length>0;const hasD=!!drPick(ME.mid,k.id);
    return '<div class="ad-r"><div class="ad-h"><b>'+esc(k.name)+'</b><span class="pill '+(v>=KP_PASS?'g':v>=50?'y':'r')+'">'+(v>=KP_PASS?'已过关':v>=50?'接近':'待提升')+'</span></div><div class="ad-b"><i style="width:'+v+'%;background:'+(v>=KP_PASS?'#12a36b':v>=50?'#e8830c':'#e5484d')+'"></i><u style="left:'+KP_PASS+'%"></u></div><div class="ad-m"><span>掌握度 '+v+' / 过关线 '+KP_PASS+'</span><span>'+(x.m.tries?'练过 '+x.m.tries+' 次':'未练习')+(x.m.next&&v>=KP_PASS?' · '+x.m.next+' 复测':'')+'</span></div>'
      +'<div class="ad-a">'+(lc.length?'<button class="rb gh" data-act="adLearn" data-k="'+k.id+'">学一学('+lc.length+')</button>':'<span class="pill">暂无讲解</span>')+(hasD?'<button class="rb '+(v>=KP_PASS?'gh':'')+'" data-act="adDrill" data-k="'+k.id+'">'+(k.type==='技能型'?'去演练':'演练一下')+'</button>':'')+(can?'<button class="rb gh" data-act="adPractice" data-k="'+k.id+'">'+(v>=KP_PASS?'再做几题':'做几道题')+'</button>':'')+(!can&&!hasD?'<span class="pill">暂无练习</span>':'')+'</div></div>'};
  b+=(weak.length?'<div class="sh0"><div class="sh1"><b>可以提升的点</b><span>按影响排序</span></div></div><div style="background:#fff;padding:2px 14px 8px">'+weak.map(row).join('')+'</div>':'<div style="background:#fff;padding:24px 14px;text-align:center;color:#12a36b;font-size:13px">这一轮的知识点都过关了 🎉</div>')
   +(pass.length?'<div class="sh0"><div class="sh1"><b>已过关</b></div></div><div style="background:#fff;padding:2px 14px 8px">'+pass.map(row).join('')+'</div>':'')
   +'<div style="padding:14px"><button class="rb gh" style="width:100%;padding:9px" data-act="adDiag">重新诊断</button></div><div style="height:20px"></div>';
  return b}
A.adDiag=()=>{const ids=kpDiagSet(ME.mid);if(!ids.length)return toast('还没有可用的诊断题(需要知识点下有已定稿的题,且挂了已上架的讲解)','err');if(!ids.length)return;qzStart('diag','',ids)};
A.adLearn=el=>{const k=kp(el.dataset.k);const c=kpMounted(k).find(c=>usableC(c)&&isPub(c)&&expState(c)!=='已过期');if(!c)return;c.views=(c.views||0)+1;R.sheet={zone:c.id};R.fb=null;renderRN()};
A.adPractice=el=>{const k=kp(el.dataset.k);qzStart('practice',k.id,qPick(ME.mid,k.id,3,'practice').map(q=>q.id))};
function kpMasteryCard(k){
  const rs=Object.keys(S.mastery).map(mid=>({mid,m:(S.mastery[mid]||{})[k.id]})).filter(x=>x.m);if(!rs.length)return '';
  const avg=Math.round(rs.reduce((a,x)=>a+x.m.v,0)/rs.length),weak=rs.filter(x=>x.m.v<KP_PASS).length;
  return '<div class="card"><h3>学员掌握度 <span class="hint">来自零售通「提升清单」的诊断(演示数据)</span></h3><div class="grid g3"><div class="stat"><div class="l">已测人数</div><div class="n">'+rs.length+'</div></div><div class="stat"><div class="l">平均掌握度</div><div class="n">'+avg+'</div></div><div class="stat"><div class="l">未过关人数</div><div class="n" style="color:'+(weak?'#e5484d':'#12a36b')+'">'+weak+'</div></div></div><div class="hint" style="margin-top:8px">掌握度低且人数多的知识点,就是该补内容 / 开项目的地方。</div></div>'}
function kpSeedMastery(){
  /* 种子:8 位学员各做过若干题(由 hash 决定对错,约 55% 正确率),掌握度由这些作答按真实算法算出 */
  S.mastery={};S.ansLog=[];const ks=S.kps.filter(k=>k.st==='启用'&&qsOf(k.id,'已定稿').length);
  PEOPLE.slice(1,9).forEach(p=>{ks.slice().sort((a,b)=>hsh(p.mid+a.id)-hsh(p.mid+b.id)).slice(0,7).forEach(k=>{
    qsOf(k.id,'已定稿').slice(0,3).forEach((q,i)=>{const ok=hsh(p.mid+q.id+'a')%100<(k.id==='K4'||k.id==='K11'?30:62);S.ansLog.push({mid:p.mid,q:q.id,kp:k.id,ok,pick:[],t:addDays(today,-(i+2)),mode:'diag'});q.stat.n++;if(ok)q.stat.ok++});
    mRefresh(p.mid,k.id)})})}
/* ================= 联动:内容中心 ↔ 知识点 ↔ 零售通发布 ↔ 零售通 ================= */
/* ① 上架弹窗:没挂知识点就提醒(不拦截),给出推荐一键挂载 */
function kpPubHint(c){
  if((c.kps||[]).length)return '<div class="tag blue" style="display:block;margin-bottom:10px;padding:6px 12px;white-space:normal">已挂载知识点:'+(c.kps||[]).map(kp).filter(Boolean).map(k=>esc(kpLabel(k))).join('、')+'。上架后会计入这些知识点的「讲解」,学员的提升清单里也能点到它。</div>';
  const r=recKps(c);
  return '<div class="tag warn" style="display:block;margin-bottom:10px;padding:8px 12px;white-space:normal;line-height:1.8"><b>还没挂知识点</b>:可以正常上架,但不会进入完备度检查,学员的提升清单也推荐不到它。'+(r.length?'<br>系统推荐:'+r.map(k=>'<span class="tag blue" style="cursor:pointer;margin:2px 6px 2px 0;padding:3px 8px" data-act="kpPubMount" data-id="'+c.id+'" data-k="'+k.id+'">+ 挂到「'+esc(kpLabel(k))+'」</span>').join(''):'<br><span class="hint">没有合适的知识点,可先到「知识点」新增。</span>')+'</div>'}
A.kpPubMount=el=>{const c=content(el.dataset.id);c.kps=c.kps||[];if(!c.kps.includes(el.dataset.k))c.kps.push(el.dataset.k);chist(c,'挂载知识点',kpLabel(kp(el.dataset.k))+'(上架时)');toast('已挂载到「'+kp(el.dataset.k).name+'」','ok');A.cPub({dataset:{id:c.id}})};
/* ② 零售通发布列表的「知识点」列 */
const kpCol=c=>{const ks=(c.kps||[]).map(kp).filter(Boolean);return ks.length?ks.map(k=>'<a class="link" data-act="kpOpen" data-id="'+k.id+'">'+esc(k.name)+'</a>').join('、'):'<span class="tag warn" title="没挂知识点:不进完备度检查,也不进提升清单">未挂载</span>'};
/* ② 知识点详情:讲解格红 / 新鲜度黄时,直达修复入口(去审核 / 去上架 / 去续期 / 去处理反馈) */
function kpFix(k,h){
  const m=kpMounted(k);const a=[];
  const tested=kpTested(k),weak=kpWeak(k);
  if(tested>=KP_WEAK_N&&weak/tested>=KP_WEAK_R){
    a.push('<span class="tag kp-lv-err">学员集中薄弱</span> '+weak+'/'+tested+' 人未过关。已有讲解还弱，通常是<b>讲法或练习不够</b>；建议组合：补演练 / 补题 / 指派学习包。'
      +' <a class="link" data-act="kpWeakPack" data-id="'+k.id+'">指派补练包</a>'
      +' · <a class="link" data-act="kpToTopic" data-id="'+k.id+'">生成课题</a>'
      +(drsOf(k.id,'已定稿').length?'':' · <a class="link" data-act="kpWeakDrill" data-id="'+k.id+'">去建演练</a>'));
  }
  if(!k.owner)a.push('<span class="tag err">没有负责人</span> 在右侧「管理」里指定后才能启用');
  if(h.cells.exp.s==='err'&&m.length){
    m.filter(c=>c.st==='审核中').forEach(c=>a.push('<span class="tag kp-lv-warn">待审核</span> '+esc(c.title)+' <a class="link" data-act="cView" data-id="'+c.id+'">去审核</a>'));
    m.filter(c=>c.st==='草稿').forEach(c=>a.push('<span class="tag">草稿</span> '+esc(c.title)+' <a class="link" data-act="cView" data-id="'+c.id+'">去编辑 / 提交审核</a>'));
    m.filter(c=>usableC(c)&&!isPub(c)&&expState(c)!=='已过期').forEach(c=>a.push('<span class="tag kp-lv-warn">已定稿未上架</span> '+esc(c.title)+' <a class="link" data-act="cView" data-id="'+c.id+'" data-tab="发布到零售通">去上架</a>'));
    m.filter(c=>usableC(c)&&expState(c)==='已过期').forEach(c=>a.push('<span class="tag kp-lv-err">已过期</span> '+esc(c.title)+' <a class="link" data-act="cView" data-id="'+c.id+'">去续期</a>'))}
  if(h.cells.exp.s==='err'&&!m.length)a.push('<span class="tag kp-lv-err">没有讲解</span> <a class="link" data-act="kpGoMount">去挂载已有内容</a> · <a class="link" data-act="cNew">新建内容</a>');
  m.filter(c=>expState(c)==='即将到期'&&isPub(c)).forEach(c=>a.push('<span class="tag kp-lv-warn">快到期</span> '+esc(c.title)+' <a class="link" data-act="cView" data-id="'+c.id+'">去续期</a>'));
  m.forEach(c=>{const n=fbOf(c.id).filter(f=>f.st==='待处理').length;if(n)a.push('<span class="tag kp-lv-warn">'+n+' 条一线反馈</span> '+esc(c.title)+' <a class="link" data-act="cView" data-id="'+c.id+'" data-tab="使用与反馈">去处理</a>')});
  return a.length?'<div style="margin-top:12px;border-top:1px dashed var(--bd);padding-top:10px"><b style="font-size:13px">怎么补</b>'+a.map(x=>'<div style="padding:4px 0;font-size:13px">'+x+'</div>').join('')+'</div>':''}
/* ③ 学员掌握度 → 知识点 */
const kpWeak=k=>Object.keys(S.mastery).filter(mid=>{const o=(S.mastery[mid]||{})[k.id];return o&&o.v<KP_PASS}).length;
const kpTested=k=>Object.keys(S.mastery).filter(mid=>(S.mastery[mid]||{})[k.id]).length;
const kpWeakTxt=k=>{const t=kpTested(k);if(!t)return '<span class="hint">未测</span>';const w=kpWeak(k);return '<span class="tag '+(w/t>=0.5?'err':w?'warn':'ok')+'" style="padding:0 8px">'+w+' / '+t+'</span>'};
/* ④ 掌握度低且人数多 → 自动生成课题条目(接回「课题→内容→上架→提升」闭环) */
const KP_WEAK_N=3,KP_WEAK_R=0.5;
const kpTopicOf=k=>S.topics.find(t=>t.kpId===k.id);
function kpWeakList(){return S.kps.filter(k=>k.st==='启用').map(k=>({k,t:kpTested(k),w:kpWeak(k)})).filter(x=>x.t>=KP_WEAK_N&&x.w/x.t>=KP_WEAK_R).sort((a,b)=>b.w-a.w)}
function kpWeakCard(){
  const LL=kpWeakList();const L=LL.slice(0,5);
  return '<div class="card"><h3>学员集中薄弱的知识点 <span class="hint">已测 ≥ '+KP_WEAK_N+' 人且未过关占比 ≥ '+Math.round(KP_WEAK_R*100)+'%'+(LL.length>5?';共 '+LL.length+' 个,这里显示最严重的 5 个':'')+'</span></h3>'+(L.length?'<table class="t"><tr><th>知识点</th><th>车型</th><th>未过关 / 已测</th><th>讲解</th><th>建议动作</th></tr>'+L.map(x=>{const t=kpTopicOf(x.k);const h=kpHealth(x.k);const noD=!drsOf(x.k.id,'已定稿').length;return '<tr><td><a class="link" data-act="kpOpen" data-id="'+x.k.id+'">'+esc(x.k.name)+'</a></td><td>'+esc(kpCarText(x.k))+'</td><td><b>'+x.w+'</b> / '+x.t+'</td><td>'+(h.cells.exp.s==='ok'?'<span class="tag ok">有可用讲解</span>':'<span class="tag err">缺讲解</span>')+'</td><td style="white-space:nowrap">'+(h.cells.exp.s==='ok'
    ?'<button class="btn sm pri" data-act="kpWeakPack" data-id="'+x.k.id+'">指派补练包</button> '+(noD?'<a class="link" data-act="kpWeakDrill" data-id="'+x.k.id+'">建演练</a> ':'')+(t?'<a class="link" data-act="topicOpen" data-id="'+t.id+'">'+t.id+'</a>':'<a class="link" data-act="kpToTopic" data-id="'+x.k.id+'">生成课题</a>')
    :'<a class="link" data-act="kpOpen" data-id="'+x.k.id+'">去补讲解</a>')+'</td></tr>'}).join('')+'</table><div style="margin-top:8px"><button class="btn sm" data-act="kpToTopicAll">全部生成课题</button> <span class="hint">已有讲解却仍薄弱时，优先补练/指派学习包；缺讲解才先补内容</span></div>':'<div class="chk ok"><b>✓</b><span>目前没有集中薄弱的知识点</span></div>')+'</div>'}
function kpMkTopic(k){
  if(kpTopicOf(k))return kpTopicOf(k);const t=kpTested(k),w=kpWeak(k);
  const tp=mkTopic({title:'学员在「'+kpLabel(k)+'」上集中薄弱:'+w+'/'+t+' 人未过关',desc:'来自零售通「提升清单」的诊断汇总。'+(kpHealth(k).cells.exp.s==='ok'?'目前已有可用讲解,可能需要补测评或改写讲法。':'目前缺可用讲解,需要先补内容。'),scene:'展厅',obj:k.name,sess:t*30,stores:t*4,prov:Math.max(1,Math.round(t/3)),trend:Math.round(w/t*20),
    sug:{type:k.type==='技能型'?'技能训':'专题训',sub:'',ind:'I5',kw:(k.syn||[]).slice(0,3).join(', '),trig:k.name,base:60,regions:ALLR}},'系统出题','系统(提升清单汇总)','sys',{kpId:k.id});
  kpHist(k,'生成课题',tp.id);return tp}
A.kpToTopic=el=>{const t=kpMkTopic(kp(el.dataset.id));toast('已生成课题 '+t.id+',在「课题池」里处理','ok');render()};
A.kpToTopicAll=()=>{let n=0;kpWeakList().forEach(x=>{if(!kpTopicOf(x.k)){kpMkTopic(x.k);n++}});toast(n?'已生成 '+n+' 个课题':'没有需要生成的',n?'ok':'err');render()};
/* 从薄弱点直接指派补练包：这是“发现问题 → 让人练起来”的最短路径 */
A.kpWeakPack=el=>{
  const k=kp(el.dataset.id);const tested=kpTested(k),weak=kpWeak(k);
  const tpl=(S.packTpl||[]).find(t=>t.id==='PT1')||{steps:[['学',2],['练题',5],['演练',1],['复测',1]],dueDays:7};
  const mids=Object.keys(S.mastery||{}).filter(mid=>{const o=(S.mastery[mid]||{})[k.id];return o&&o.v<KP_PASS});const n=Math.max(1,mids.length||weak);
  S.packs.unshift({id:'PK'+(S.packs.length+1),tpl:tpl.id||'PT1',mid:'',mids,kp:k.id,name:'补练包 · '+k.name,steps:tpl.steps.map(s=>({t:s[0],done:false})),due:addDays(today,tpl.dueDays),status:'进行中',ts:today,audience:n});
  kpHist(k,'指派补练包','覆盖 '+n+' 个未过关学员');toast('已指派补练包给 '+n+' 位薄弱学员：'+tpl.steps.map(s=>s[0]).join(' → ')+'，截止 '+addDays(today,tpl.dueDays),'ok');render()};
A.kpWeakDrill=el=>{UI.sel.caf={k:'演练',kp:el.dataset.id};UI.sel.cadv=false;UI.page='content';UI.tab.content='全部内容';A.drNewFor();};
