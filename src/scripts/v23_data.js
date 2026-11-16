/* ================= v23 理想态数据层 + 证据 / 就绪度引擎 =================
   一句话:个人数据、语料、配置维度一律按理想状态设计;缺的数据都视为"可落地、可对接",先用高质量
   模拟数据把模型跑出来。所有理想数据在界面上都标「模拟数据 · 理想态演示」。
   数据确定性生成(固定种子 hsh),每次打开一致,测试可断言。
   ========================================================================== */

/* ---------- 0. 口径常量 ---------- */
const V23_NWK=12;                                  // 12 周(含本周)
const v23Week=i=>addDays(today,-7*(V23_NWK-1-i));   // 第 i 周(0=最早)
const v23WeekEnd=i=>addDays(v23Week(i),6);
const V23_SIM='<span class="tag warn v23-sim" title="Demo 内的模拟数据,真实对接口径留待落地">模拟数据</span>';
const V23_CORR='<div class="src" style="background:#fff8ef"><b>口径说明</b><span>时间窗 <b>12 周</b>(含观察期);效果只做<b>相关</b>展示,<b>不作因果结论</b>;业绩数据用于「选样」和「验收」,不据此判断话术对错。</span></div>';


/* ---------- 0b. 演示时间线(as-of 周) ----------
   调优剧本:初始只有 v1,数据只到第 9 周(之后 3 周「生效后」数据尚未揭晓)。
   用户一键创建 v2 后,预置的"生效后 3 周"数据才可见(演示用,真实环境要等观察期满)。 */
const V23_PRE=V23_NWK-3;                               // v2 生效前最后一周(含)的下一周下标 = 9
function v23End(){return S.v2seen?V23_NWK-1:V23_PRE-1} // 当前可见的最后一周下标
function v23Wins(){const e=v23End();return {end:e,cur:[Math.max(0,e-3),e],prev:[Math.max(0,e-7),Math.max(0,e-4)]}}
const v23NewL=grp=>S.lrn.filter(l=>l.group===grp&&l.tier==='新人顾问');

/* ---------- 0c. 真实作答 → 证据流 ----------
   学员在零售通真实答题 / 演练时,v22 只写 S.ansLog。v23 的掌握度读证据流(S.ev),所以必须把作答折算进去,
   否则"答对了掌握度却不涨"。折算规则:同一知识点最近 N 次作答(含种子里的历史)按时间衰减加权,
   写成该来源的一条 score,n = 作答条数。 */
function v23Sync(mid,kid,mode){
  const src=mode==='drill'?'dr':'q';
  const L=(S.ansLog||[]).filter(a=>a.mid===mid&&a.kp===kid&&(mode==='drill'?a.mode==='drill':a.mode!=='drill'));
  if(!L.length)return;
  const W=S.cfg.win,dec=S.cfg.decay;
  const rec=L.slice(-W).reverse();let w=1,sw=0,so=0;
  rec.forEach(a=>{const sc=(mode==='drill'&&a.score!=null)?a.score:(a.ok?100:0);sw+=w;so+=w*sc;w*=dec});
  const score=Math.round(so/sw);
  S.ev[src][mid]=S.ev[src][mid]||{};
  /* 新作答占主导:与已有证据按条数加权(历史证据最多当 3 条) */
  const old=S.ev[src][mid][kid];
  const nOld=old?Math.min(3,old.n):0;
  const blended=old?Math.round((old.score*nOld+score*rec.length)/(nOld+rec.length)):score;
  S.ev[src][mid][kid]={score:blended,n:(old?old.n:0)+1,ts:today,live:true};
}
/* ---------- 1. 维度体系(标签树的底层分类) ---------- */
/* shape: tree|flat · role: belong 归属(参与统计)/context 上下文(筛选推荐)/ability 能力(带权重,进画像) */
const V23_DIM_SEED=[
 {id:'Dprod',name:'产品',shape:'tree',role:'belong',multi:1,requiredFor:['kp'],source:'sync',values:null,note:'标签树可在标签管理里维护,id 稳定,改名不改 id'},
 {id:'Dcar',name:'车型',shape:'flat',role:'belong',multi:1,requiredFor:['kp'],source:'manual',values:['N70系列','N90 Max','N90 Max 探索版','通用车型']},
 {id:'Dscene',name:'场景',shape:'flat',role:'context',multi:1,requiredFor:[],source:'manual',values:['家庭出行','露营','通勤','长途','商务接待','首购到店']},
 {id:'Dcust',name:'客户类型',shape:'flat',role:'context',multi:1,requiredFor:[],source:'manual',values:['首购家庭','增换购','企业客户','年轻个人']},
 {id:'Dcomp',name:'竞品',shape:'flat',role:'context',multi:1,requiredFor:[],source:'manual',values:['奔驰 GLC','问界 M8','极氪 7X','特斯拉 Model Y']},
 {id:'Dstage',name:'销售阶段',shape:'flat',role:'context',multi:1,requiredFor:[],source:'manual',values:['邀约','接待','试驾','报价','交付']},
 {id:'Dab',name:'能力',shape:'tree',role:'ability',multi:1,requiredFor:['kp'],source:'manual',values:null}
];
/* 能力树:探需 / 场景化讲车 / 顾虑解除 三个收敛方向 + 店长带人 */
const V23_AB_RAW=[
 ['探需',[]],
 ['场景化讲车',[]],
 ['顾虑解除',[]],
 ['带人辅导',[]]
];
function v23Dims(){
  S.dims=V23_DIM_SEED.map(d=>Object.assign({},d,{
    /* tree 维度的值从树源码重建;flat 维度直接沿用种子里的字面量(转成 {id,name} 结构) */
    values:d.shape==='tree'?[]:d.values.map(n=>({id:'V'+d.id.slice(1)+'_'+n.length+'_'+hsh(n),name:n,lv:1,path:n,status:'on'})),
    hist:[]
  }));
  /* 产品:从 PTAGS 平铺进维度值,保留 lv/pid 表达树 */
  const dp=dimOf('Dprod');
  dp.values=PTAGS.map(t=>({id:t.id,name:t.name,pid:t.pid,lv:t.lv,path:t.path,status:'on'}));
  /* 能力:两层树 */
  const da=dimOf('Dab');let n=0;
  V23_AB_RAW.forEach(a=>{const id='AB'+(++n);da.values.push({id,name:a[0],pid:null,lv:1,path:a[0],status:'on'});a[1].forEach(c=>da.values.push({id:'AB'+(++n),name:c,pid:id,lv:2,path:a[0]+'_'+c,status:'on'}))});
  return S.dims;
}
const dimOf=id=>S.dims.find(d=>d.id===id);
function dimVal(did,vid){const d=dimOf(did);return d&&d.values.find(v=>v.id===vid)}
/* 按名字找 flat 维度的值 id(种子数据里用业务名书写,读的时候再解析成稳定 id) */
function dimIdByName(did,name){const d=dimOf(did);const v=d&&d.values.find(v=>v.name===name);return v?v.id:null}
function dimIdsByNames(did,names){return (names||[]).map(n=>dimIdByName(did,n)).filter(Boolean)}
function dimPath(did,vid){const v=dimVal(did,vid);return v?(v.path||v.name):''}
function dimKids(did,vid){const d=dimOf(did);return d?d.values.filter(v=>v.pid===vid):[]}
function dimDesc(did,vid){const r=[vid];dimKids(did,vid).forEach(c=>dimDesc(did,c.id).forEach(x=>r.push(x)));return r}
/* 合并留痕:旧值仍能被解析到目标值,避免画像/筛选引用旧 id 后突然失效 */
function dimResolve(did,vid){let v=dimVal(did,vid);const seen=new Set();while(v&&v.mergedTo&&!seen.has(v.id)){seen.add(v.id);v=dimVal(did,v.mergedTo)}return v?v.id:vid}
const dimLabel=(did,vid)=>dimPath(did,vid).replace(/^.*_/,'')||dimPath(did,vid);
/* 能力值 → 简称(用于画像项显示) */
const abName=(vid,short)=>{const p=dimPath('Dab',vid);return short?p.split('_').pop():p.replace('_',' / ')};

/* ---------- 2. 知识点 × 维度值组合 ---------- */
/* 知识点不再分"事实型/技能型",由挂的维度自然区分:挂产品=产品卖点,挂能力+场景=销售动作 */
const V23_KP_DIM={
 K1:{scene:['家庭出行','长途'],cust:['首购家庭'],stage:['接待','试驾'],ab:'场景化讲车'},
 K2:{scene:['家庭出行','商务接待'],cust:['增换购'],stage:['接待','试驾'],ab:'场景化讲车'},
 K3:{scene:['家庭出行'],cust:['首购家庭','增换购'],stage:['接待'],ab:'场景化讲车'},
 K4:{scene:['露营','长途'],cust:['年轻个人','首购家庭'],stage:['试驾'],ab:'场景化讲车'},
 K5:{scene:['长途','通勤'],cust:['首购家庭'],stage:['接待','试驾'],ab:'场景化讲车'},
 K6:{scene:['长途','通勤'],cust:['首购家庭'],stage:['试驾'],ab:'场景化讲车'},
 K7:{scene:['家庭出行'],cust:['首购家庭'],stage:['接待'],ab:'场景化讲车'},
 K8:{scene:['商务接待'],cust:['企业客户'],stage:['接待'],ab:'场景化讲车'},
 K9:{scene:['家庭出行'],cust:['首购家庭'],stage:['接待','试驾'],ab:'场景化讲车'},
 K10:{scene:['家庭出行','露营'],cust:['首购家庭','年轻个人'],stage:['试驾'],ab:'场景化讲车'},
 K11:{scene:['露营'],cust:['年轻个人'],stage:['试驾'],ab:'场景化讲车'},
 K12:{scene:['家庭出行','长途'],cust:['首购家庭'],stage:['接待'],ab:'场景化讲车'},
 K13:{scene:['家庭出行'],cust:['年轻个人'],stage:['接待'],ab:'场景化讲车'},
 K14:{scene:['商务接待'],cust:['企业客户','年轻个人'],stage:['接待'],ab:'场景化讲车'},
 K15:{scene:['通勤'],cust:['增换购'],stage:['报价'],ab:'顾虑解除'},
 K16:{scene:['通勤'],cust:['首购家庭'],stage:['试驾'],ab:'场景化讲车'},
 K17:{scene:['试驾到店'],cust:['首购家庭'],stage:['试驾'],ab:'场景化讲车',comp:['奔驰 GLC']},
 K18:{scene:['首购到店'],cust:['增换购'],stage:['报价'],ab:'顾虑解除'},
 K19:{scene:['首购到店'],cust:['首购家庭','增换购'],stage:['报价'],ab:'顾虑解除',comp:['奔驰 GLC','问界 M8','极氪 7X']},
 K20:{scene:['首购到店'],cust:['首购家庭'],stage:['接待'],ab:'探需'},
 K21:{scene:['首购到店'],cust:['首购家庭'],stage:['邀约'],ab:'探需'},
 K22:{scene:['首购到店'],cust:['增换购'],stage:['报价'],ab:'顾虑解除'},
 K23:{scene:['首购到店'],cust:['首购家庭'],stage:['接待'],ab:'探需'},
 K24:{scene:['首购到店'],cust:[],stage:['接待'],ab:'带人辅导'},
 K25:{scene:['首购到店'],cust:[],stage:['接待'],ab:'带人辅导'}
};/* 店长带人:两个示意知识点(画像里权重很小) */
const V23_EXTRA_KP=[
 {id:'K24',name:'新人带教与陪访',car:'通用车型',owner:'周丽',syn:['带教','陪访','师徒']},
 {id:'K25',name:'门店例会与目标拆解',car:'通用车型',owner:'陈磊',syn:['例会','晨会','目标拆解']}
];
function v23KpDims(){
  S.v23={};
  V23_EXTRA_KP.forEach(x=>{if(!kp(x.id))S.kps.push({id:x.id,name:x.name,type:'技能型',tags:[],dim:'带人辅导',car:x.car,syn:x.syn,owner:x.owner,st:'启用',ext:[],created:addDays(today,-40),hist:[]})});
  S.kps.forEach(k=>{
    const m=V23_KP_DIM[k.id]||{};
    k.dims={};
    k.cars=(k.cars&&k.cars.length?k.cars:[k.car||'通用车型']).slice();
    const carIds=k.cars.map(n=>dimIdByName('Dcar',n)).filter(Boolean);
    if(carIds.length)k.dims.Dcar=carIds;
    if((k.tags||[]).length)k.dims.Dprod=k.tags.slice(0,2);
    const put=(did,names)=>{const ids=dimIdsByNames(did,names);if(ids.length)k.dims[did]=ids};
    put('Dscene',m.scene);put('Dcust',m.cust);put('Dcomp',m.comp);put('Dstage',m.stage);
    /* 能力维度按业务名解析成树里的稳定 id(可指父节点) */
    if(m.ab){const ab=dimIdByName('Dab',m.ab);if(ab){k.dims.Dab=[ab];k.dim=abName(ab,true)}}
  });
}
/* 知识点是否挂了某个维度值(含树形父节点) */
function kpHasDim(k,did,vid){const vs=(k.dims||{})[did]||[];if(!vs.length)return false;const target=dimResolve(did,vid);if(vs.includes(target))return true;return vs.some(v=>dimDesc(did,target).includes(dimResolve(did,v)))}
const kpDimsTxt=k=>Object.keys(k.dims||{}).map(did=>{const d=dimOf(did);if(!d)return '';return (k.dims[did]||[]).map(v=>dimLabel(did,v)).join('/')}).filter(Boolean);

/* 是否属于「顾虑解除」能力分支(按名称解析,不依赖 id 编号) */
function v23IsConcern(k){
  const d=dimOf('Dab');if(!d)return false;
  const root=d.values.find(v=>v.name==='顾虑解除'&&!v.pid);if(!root)return false;
  const ids=dimDesc('Dab',root.id);
  return ((k.dims||{}).Dab||[]).some(v=>ids.includes(v));
}
/* ---------- 3. 岗位画像(四档,理想数据,业务可改) ---------- */
const V23_TIER=['新人顾问','进阶顾问','销冠','店长'];
const V23_PROFILE_SEED=[
 {id:'PF1',role:'新人顾问',note:'先把产品讲清楚，再学会问需求、处理常见顾虑',
  items:[{id:'PF1-1',dim:'Dab',vals:['场景化讲车'],weight:50,target:85,label:'产品讲解'},
         {id:'PF1-2',dim:'Dab',vals:['探需'],weight:25,target:70,label:'探需'},
         {id:'PF1-3',dim:'Dab',vals:['顾虑解除'],weight:25,target:60,label:'顾虑处理'}]},
 {id:'PF2',role:'进阶顾问',note:'从会讲产品，到会问、会应对',
  items:[{id:'PF2-1',dim:'Dab',vals:['探需'],weight:35,target:85,label:'探需'},
         {id:'PF2-2',dim:'Dab',vals:['场景化讲车'],weight:35,target:85,label:'场景化讲车'},
         {id:'PF2-3',dim:'Dab',vals:['顾虑解除'],weight:30,target:75,label:'顾虑解除'}]},
 {id:'PF3',role:'销冠',note:'复杂异议和竞品对比能稳定处理，打法可复制',
  items:[{id:'PF3-1',dim:'Dab',vals:['顾虑解除'],weight:45,target:90,label:'复杂异议与竞品'},
         {id:'PF3-2',dim:'Dab',vals:['场景化讲车'],weight:30,target:90,label:'场景化讲车'},
         {id:'PF3-3',dim:'Dab',vals:['探需'],weight:25,target:85,label:'探需'}]},
 {id:'PF4',role:'店长',note:'带人辅导为主，同时能判断讲法和异议处理是否到位',
  items:[{id:'PF4-1',dim:'Dab',vals:['带人辅导'],weight:50,target:85,label:'带人辅导'},
         {id:'PF4-2',dim:'Dab',vals:['探需'],weight:25,target:75,label:'判断探需'},
         {id:'PF4-3',dim:'Dab',vals:['顾虑解除'],weight:25,target:70,label:'判断讲法'}]}
];
function v23Profiles(){
  S.profiles=JSON.parse(JSON.stringify(V23_PROFILE_SEED));
  /* 画像项的 vals 用业务名书写,装载时解析成维度值的稳定 id */
  S.profiles.forEach(p=>p.items.forEach(it=>{
    it.vals=it.vals.map(n=>dimIdByName(it.dim,n)).filter(Boolean);
  }));
  return S.profiles;
}
const pfOf=tier=>(S.profiles||[]).find(p=>p.role===tier)||(S.profiles||[])[0]||{id:'',role:tier||'',items:[],note:''};
/* 画像项 → 命中的知识点 */
/* 选择器语义:维度值之间是「或」(命中任一值即归入);树形维度选父节点会连子孙一起命中 */
function pfKps(item){return S.kps.filter(k=>k.st==='启用'&&item.vals.some(v=>kpHasDim(k,item.dim,v)))}
const pfWsum=p=>((p&&p.items)||[]).reduce((a,x)=>a+x.weight,0);

/* ---------- 4. 学员与门店(6 店 / 40 人 / 12 周) ---------- */
const V23_STORES=[
 {name:'北京望京店',region:'华北',quota:8},{name:'北京亦庄店',region:'华北',quota:7},
 {name:'上海徐汇店',region:'华东',quota:7},{name:'上海浦东店',region:'华东',quota:6},
 {name:'广州天河店',region:'华南',quota:7},{name:'成都春熙路店',region:'西南',quota:5}
];
const V23_NAME_POOL=['李思睿','韩雪','范文博','曹雨欣','程佳','沈毅','温晓','杜明','钟灵','费翔','汤佳','贺兰','路遥','霍然','谷雨','关山','乔羽','岳亮','段宁','祝晓','俞晴','季聪','束昊','章黎','云帆','苏芮','白露','宁远'];
/* 与 v22 的 ME / PEOPLE 兼容:这些人是真实存在的演示学员,直接沿用 */
const V23_BASE=[
 ['2024118','张晨','北京望京店','华北',60],['2024112','马丽','北京望京店','华北',70],['2023202','田雨','北京望京店','华北',900],
 ['2024101','刘子涵','北京亦庄店','华北',45],['2024113','郭峰','北京亦庄店','华北',400],['2023201','马俊','北京亦庄店','华北',700],
 ['2024104','孙雅婷','上海徐汇店','华东',55],['2023203','钱多多','上海徐汇店','华东',800],
 ['2024105','周凯','上海浦东店','华东',85],
 ['2023204','黄磊','广州天河店','华南',650],['2024116','谢天','广州天河店','华南',20],
 ['2024108','王诗琪','成都春熙路店','西南',35]
];
const v23Tier=hire=>hire<=90?'新人顾问':hire<=450?'进阶顾问':'销冠';
function v23Learners(){
  S.lrn=[];let seq=0;
  V23_BASE.forEach(a=>S.lrn.push({mid:a[0],name:a[1],store:a[2],region:a[3],hire:a[4],tier:v23Tier(a[4]),group:hsh(a[0])%5<3?'试点批':'对照批'}));
  /* 店长:每店一个(店长也看就绪度,但画像不同) */
  const mgr={'北京望京店':'田雨','北京亦庄店':'马俊','上海徐汇店':'钱多多','广州天河店':'黄磊','上海浦东店':'郭峰','成都春熙路店':'蒋欣'};
  const mgrMid={'北京望京店':'2023202','北京亦庄店':'2023201','上海徐汇店':'2023203','广州天河店':'2023204','上海浦东店':'2024113','成都春熙路店':'2023206'};
  V23_STORES.forEach(st=>{
    let have=S.lrn.filter(x=>x.store===st.name).length;
    while(have<st.quota){
      const nm=V23_NAME_POOL[seq%V23_NAME_POOL.length]+(seq>=V23_NAME_POOL.length?String(Math.floor(seq/V23_NAME_POOL.length)+1):'');
      const mid='2025'+String(100+seq).padStart(3,'0');   /* 独立号段 2025xxx,避免与 v22 已有的 2024xxx / 2023xxx 重号 */
      const hire=[18,26,34,45,58,72,88,120,180,260,320,700][(seq*7+3)%12];
      S.lrn.push({mid,name:nm,store:st.name,region:st.region,hire,tier:v23Tier(hire),group:hsh(mid+st.name)%5<3?'试点批':'对照批'});
      have++;seq++;
    }
  });
  /* 每店一个店长(tier 覆盖) */
  Object.keys(mgr).forEach(st=>{
    let x=S.lrn.find(l=>l.mid===mgrMid[st]);
    if(!x){x={mid:mgrMid[st],name:mgr[st],store:st,region:(V23_STORES.find(s=>s.name===st)||{}).region,hire:1000,tier:'店长',group:hsh(mgrMid[st])%5<3?'试点批':'对照批'};S.lrn.push(x)}
    x.tier='店长';x.hire=Math.max(x.hire,900);
  });
  /* 新人训试点:试点批里的新人参加,对照批新人未参加 */
  S.lrn.forEach(l=>{l.train=l.tier==='新人顾问'&&l.group==='试点批'});
  return S.lrn;
}
const lrnOf=mid=>S.lrn.find(x=>x.mid===mid);
const v23Stores=()=>[...new Set(S.lrn.map(x=>x.store))];
function v23Q(mid){/* 每个学员的潜在能力 0-1,决定掌握度 / 行为率 / 锁单,再叠噪声 */}
function v23Latent(l){
  const base={'新人顾问':.68,'进阶顾问':.80,'销冠':.90,'店长':.82}[l.tier]||.7;
  return Math.min(.97,Math.max(.25,base+(hsh(l.mid+'q')%36-18)/100));
}

/* ---------- 5. 证据:测评 / 演练 / 实战行为 / 人工评价 ---------- */
/* ev 结构:ev.q[mid][kid]={score,n,ts}  同理 dr/co/se;beh[mid][kid]=[{w,rate,n}] */
/* 个别知识点对全员偏难(用来制造"学员集中薄弱"的区分度,而不是全员都弱) */
const V23_HARD_KP=['K4','K11','K19'];
const V23_FOCUS_KP=['K1','K2','K4','K5','K9','K15','K17','K18','K19','K20','K21','K22','K23'];
let v23MigMatchHits=0;
function v23Evidence(){
  S.ev={q:{},dr:{},co:{},se:{}};S.beh={};S.ansLog=[];
  const qsOk=S.qs.filter(q=>q.st==='已定稿');
  S.lrn.forEach(l=>{
    const q=v23Latent(l);const fk=S.kps.filter(k=>k.st==='启用').map(k=>k.id);
    fk.forEach((kid,i)=>{
      const k=kp(kid);if(!k)return;
      const rel=kpHasDim(k,'Dab',pfOf(l.tier).items[0].vals[0])||true;
      const noise=((hsh(l.mid+kid+'n')%30)-15)/100;
      const s=Math.round(Math.min(100,Math.max(8,(q+noise)*100)));
      /* 剧本:新人训试点批 —— 测评过关率高,但"顾虑解除"类实战行为几乎没升(前 9 周) */
      const isA3=v23IsConcern(k);
      /* 剧本:试点批在「顾虑解除」上"会背不会用"——测评/演练稳定过关(78~92),但实战行为仍低 */
      const val=l.train&&isA3?78+(hsh(l.mid+kid+'pq')%15):Math.max(8,s-(V23_HARD_KP.includes(kid)?26:0));
      const ts=addDays(today,-(3+(i*2+hsh(l.mid+kid)%9)));
      S.ev.q[l.mid]=S.ev.q[l.mid]||{};
      S.ev.q[l.mid][kid]={score:val,n:2+(hsh(l.mid+kid+'m')%3),ts};
      /* 演练:只给技能类知识点(试点批 A3 也过关,但"会背不会用") */
      if(/^K(1[7-9]|2[0-3])$/.test(kid)){
        S.ev.dr[l.mid]=S.ev.dr[l.mid]||{};
        S.ev.dr[l.mid][kid]={score:val,n:1+(hsh(l.mid+kid+'d')%2),ts:addDays(today,-(2+hsh(l.mid+kid)%8))};
      }
      /* ansLog:与 ev.q 一致的作答流水(供旧页面的"最近 N 次"和题目统计) */
      const qp=qsOk.filter(x=>x.kp===kid);
      if(qp.length){const n=Math.min(qp.length,3);for(let j=0;j<n;j++){const ok=(hsh(l.mid+kid+j+'o')%100)<val;S.ansLog.push({mid:l.mid,q:qp[j].id,kp:kid,ok,pick:[],t:addDays(today,-(j*2+1)),mode:'diag'})}}
    });
    /* 人工评价:店长 / 区域老师打分(不是所有人都有) */
    if(hsh(l.mid+'co')%3<2){S.ev.co[l.mid]={};['K18','K20','K23','K17'].forEach(kid=>{const s=Math.round(Math.min(100,Math.max(30,(q+((hsh(l.mid+kid+'c')%24)-12)/100)*100)));S.ev.co[l.mid][kid]={score:s,n:1,ts:addDays(today,-5)}})}
    /* 自评:默认权重 0,只做展示 */
    S.ev.se[l.mid]={};['K17','K20','K23'].forEach(kid=>{S.ev.se[l.mid][kid]={score:Math.round(Math.min(100,(q*100+12))),n:1,ts:addDays(today,-6)}});
    /* 实战行为:每个知识点 × 12 周,带样本数 n */
    S.beh[l.mid]={};
    S.kps.filter(k=>k.st==='启用').forEach(k=>{
      const qBase=v23Latent(l);
      const isA3=v23IsConcern(k);
      const arr=[];
      for(let w=0;w<V23_NWK;w++){
        let rate=22+qBase*66+((hsh(l.mid+k.id+w+'b')%22)-11)+w*0.35-(V23_HARD_KP.includes(k.id)?22:0);   /* 随周数缓慢自然上升;个别难点整体偏弱 */
        /* 剧本:新人训试点批 —— 测评过关但"顾虑解除"行为几乎没升(前 9 周);第 9 周起调优后升 */
        /* 剧本:前 9 周行为出现率停在 ~30%(会背不会用);调优生效(第 10 周起)后逐周爬升,
           3 周后回到约 45–50%,而不是一步跳到"正常水平"——真实行为改变是渐进的 */
        if(l.train&&isA3){const base=28+((hsh(l.mid+k.id+w+'f')%9)-4);rate=w<9?base:base+[7,13,18][w-9]+((hsh(l.mid+k.id+w+'g')%5)-2)}
        /* 未参训的对照批:自然缓慢增长 */
        if(l.group==='对照批')rate=rate*0.94+w*0.8;
        arr.push({w,rate:Math.max(6,Math.min(96,Math.round(rate))),n:6+(hsh(l.mid+k.id+w+'n')%14)});
      }
      S.beh[l.mid][k.id]=arr;
    });
  });
  return S;
}

/* ---------- 6. 业务结果(周度漏斗,试点批 / 对照批各一组) ---------- */
function v23Outcome(){
  S.out={};S.outAgg=null;
  const mk=(l,w)=>{
    const q=v23Latent(l);
    /* 锁单:与就绪度弱相关(r≈0.4),并留出高就绪低业绩 / 低就绪高业绩的离群点 */
    const outLier=(hsh(l.mid+'x')%11===0)?(hsh(l.mid+'y')%2?2.1:0.25):1;
    /* 锁单与"潜在能力"挂钩(其中一部分被就绪度捕获,另一部分是噪声与门店/客流等外因),相关中等偏弱 */
    const store=({'北京望京店':1.15,'北京亦庄店':.95,'上海徐汇店':1.1,'上海浦东店':.9,'广州天河店':1.0,'成都春熙路店':.85})[l.store]||1;   /* 门店客流差异:与个人能力无关的外因 */
    /* 岗位基准:销冠 > 进阶 > 店长(带团队、自己的单少) > 新人;再叠加能力、门店客流、噪声 */
    const tierK={'新人顾问':0.8,'进阶顾问':1.15,'销冠':1.55,'店长':0.85}[l.tier]||1;
    const lock=Math.max(0,Math.round((0.3+q*2.9+((hsh(l.mid+w+'l')%34)-17)/10)*tierK*store*outLier));
    const f=(k)=>Math.max(lock,Math.round(lock*k+((hsh(l.mid+w+k)%9)-4)/2));
    return {w,邀约:f(19),到店:f(8.5),试驾:f(3.6),报价:f(2.2),锁单:lock};
  };
  S.lrn.forEach(l=>{S.out[l.mid]=[];for(let w=0;w<V23_NWK;w++)S.out[l.mid].push(mk(l,w))});
  return S.out;
}
const outSum=(mid,a,b)=>{const L=(S.out[mid]||[]).filter(x=>x.w>=a&&x.w<=b);return L.reduce((s,x)=>({邀约:s.邀约+x.邀约,到店:s.到店+x.到店,试驾:s.试驾+x.试驾,报价:s.报价+x.报价,锁单:s.锁单+x.锁单}),{邀约:0,到店:0,试驾:0,报价:0,锁单:0})};

/* ---------- 7. 错题表(可累积、可统计复发) ---------- */
const V23_MIS_TYPE=['知识错','表达错','思路错','遗漏'];
const V23_MIS_STEP=['S','P','I','N'];
const V23_QUOTES={
 K18:['客户说太贵了,我直接说可以再让一点','我先讲了一遍参数,客户就没兴趣了','这是我们最低价了(禁说词)'],
 K19:['问界 M8 也是好车,看您喜欢(没有对比)','极氪那个续航虚标(贬低竞品)','我给您算一下差价就清楚了'],
 K20:['您预算多少?(封闭式提问太早)','直接问客户要什么配置','没问用车场景就讲卖点'],
 K21:['有空来看看吧(没有给时间选项)','我发个地址给您,您自己过来','(客户说忙)那改天再联系'],
 K22:['国补地补只能二选一','补贴金额我回头帮您问一下','肯定能拿到全额(绝对化)'],
 K17:['先讲了 N 再讲 S(顺序反了)','没有确认需求就讲方案','讲完没有确认式提问'],
 K9:['二排能放儿童座椅(只讲了一句)','没问几个孩子、多大','安全座椅接口在哪我没说清'],
 K1:['后备箱 1203L(只报数字)','没有结合客户出行场景','装得下(客户问婴儿车时)'],
 K5:['续航 1705 公里(把综合当纯电)','没提冬季衰减','没有给补能建议'],
 K4:['外放电 6.6kW(没说能同时带什么)','露营场景没展开','需要另带移动电源(错)'],
 K2:['零重力座椅能躺平(没讲支撑)','没说二排怎么调','一键躺平(客户问老人上下车)']
};
function v23Mistakes(){
  S.mis=[];let n=0;
  S.lrn.forEach(l=>{
    const q=v23Latent(l);
    Object.keys(S.ev.q[l.mid]||{}).forEach(kid=>{
      const s=(S.ev.q[l.mid][kid]||{}).score||0;
      if(s>=72)return;                      /* 过了就不算错题 */
      const k=kp(kid);if(!k)return;
      const isA3=v23IsConcern(k);
      const cnt=1+(hsh(l.mid+kid+'mc')%3);
      const typ=V23_MIS_TYPE[hsh(l.mid+kid+'t')%4];
      const step=isA3?V23_MIS_STEP[hsh(l.mid+kid+'s')%4]:'S';
      const first=addDays(today,-(30+hsh(l.mid+kid+'f')%40));
      const last=addDays(today,-(hsh(l.mid+kid+'l')%14));
      const qs=V23_QUOTES[kid]||['回答没有覆盖关键点'];
      const gold=(S.contents.find(c=>(c.kps||[]).includes(kid)&&usableC(c))||{}).id||'';
      /* 状态:多数 open;部分 improving;少数 closed —— 其中 2 条"关闭后复发" */
      let st=hsh(l.mid+kid+'st')%5===0?'closed':hsh(l.mid+kid+'st')%5===1?'improving':'open';
      const rec=st==='closed'&&hsh(l.mid+kid+'rc')%3===0;
      if(rec)st='recurred';
      S.mis.push({id:'M'+(++n),mid:l.mid,kp:kid,ref:{qid:''},type:typ,step,severity:1+(hsh(l.mid+kid+'sv')%3),
        count:cnt,firstTs:first,lastTs:last,quote:qs[hsh(l.mid+kid+'q')%qs.length],goldId:gold,status:st,
        closedTs:st==='recurred'?addDays(last,-9):null});
    });
  });
  /* 保证剧本里"顾虑解除"是最高频错题簇 */
  return S.mis;
}
const misOf=mid=>S.mis.filter(m=>m.mid===mid);
const misOpen=()=>S.mis.filter(m=>m.status!=='closed');
/* 复发率 = 关闭后再次出错的 / 已关闭过的 */
function v23RecurRate(){
  const closed=S.mis.filter(m=>m.status==='closed'||m.status==='recurred');
  if(!closed.length)return null;
  return Math.round(closed.filter(m=>m.status==='recurred').length/closed.length*100);
}

/* ---------- 8. 掌握度 / 就绪度(全部参数来自 S.cfg,不写死) ---------- */
const srcName={quiz:'测评',drill:'演练',behavior:'实战行为',coach:'人工评价',self:'自评'};
const srcList=()=>['quiz','drill','behavior','coach','self'];
function behScore(mid,kid,weeks){
  const arr=(S.beh[mid]||{})[kid];if(!arr||!arr.length)return null;
  const c=S.cfg;const W=weeks||c.behWin;
  const L=arr.slice(0,v23End()+1).slice(-W);let sw=0,so=0,tn=0;
  L.forEach(x=>{if(!x.n||x.n<c.behN*0.3)return;sw+=x.n;so+=x.n*x.rate;tn+=x.n});
  if(!tn)return null;
  return {score:Math.round(so/sw),n:tn};
}
/* 合成掌握度:各来源按权重加权;缺失来源不参与(权重重新归一),但自评默认 0 权重 */
function v23Mastery(mid,kid,cfg){
  const c=cfg||S.cfg;const parts=[];const W=c.srcW;
  const g=(s)=>{const o=((S.ev[s]||{})[mid]||{})[kid];return o&&o.n?o:null};
  const q=g('q'),dr=g('dr'),co=g('co'),se=g('se'),b=behScore(mid,kid,c.behWin);
  if(q&&W.quiz>0)parts.push([W.quiz,q.score]);
  if(dr&&W.drill>0)parts.push([W.drill,dr.score]);
  if(b&&W.behavior>0)parts.push([W.behavior,b.score]);
  if(co&&W.coach>0)parts.push([W.coach,co.score]);
  if(se&&W.self>0)parts.push([W.self,se.score]);
  if(!parts.length)return null;
  const sw=parts.reduce((a,x)=>a+x[0],0);
  let v=parts.reduce((a,x)=>a+x[0]*x[1],0)/sw;
  /* 证据条数少 → 向 50 收缩(参数可配) */
  const nParts=parts.length;
  if(nParts<2)v=v*c.shrinkA+50*c.shrinkB;
  return Math.round(Math.max(0,Math.min(100,v)));
}
function v23MasteryParts(mid,kid){
  const c=S.cfg;const W=c.srcW;const out=[];
  const g=(s)=>{const o=((S.ev[s]||{})[mid]||{})[kid];return o&&o.n?o:null};
  const b=behScore(mid,kid,c.behWin);
  [['quiz',g('q')],['drill',g('dr')],['behavior',b],['coach',g('co')],['self',g('se')]].forEach(([k,o])=>{
    if(o&&W[k]>0)out.push({k,w:W[k],score:o.score,n:o.n})});
  return out;
}
/* 就绪度 = Σ(画像项权重 × min(该项 KP 掌握度均值, 目标等级)) ÷ Σ权重 */
function v23Readiness(mid,tier,cfg){
  const p=pfOf(tier||(lrnOf(mid)||{}).tier);const items=[];
  p.items.forEach(it=>{
    const ks=pfKps(it);const vs=ks.map(k=>v23Mastery(mid,k.id,cfg)).filter(v=>v!=null);
    const mean=vs.length?vs.reduce((a,b)=>a+b,0)/vs.length:null;
    items.push({item:it,kps:ks,n:vs.length,mean,cap:mean==null?null:Math.min(mean,it.target),hit:mean!=null&&mean>=it.target});
  });
  const ws=items.filter(x=>x.mean!=null);
  const sw=ws.reduce((a,x)=>a+x.item.weight,0);
  const val=sw?Math.round(ws.reduce((a,x)=>a+x.item.weight*x.cap,0)/sw):null;
  /* 目标达成率:加权"命中目标"比例 */
  const ach=sw?Math.round(ws.reduce((a,x)=>a+x.item.weight*Math.min(1,(x.mean/x.item.target)),0)/sw*100):null;
  return {val,ach,items,tier:p.role,profile:p};
}
/* 达标记号:就绪度 / 目标达成率 ≥ 门槛 */
const v23RdyPass=()=>S.cfg.pass;
const v23Ready=l=>{const r=v23Readiness(l.mid,l.tier);return r.ach!=null&&r.ach>=v23RdyPass()};

/* ---------- 9. 一致性刷新:把派生值写回 S.mastery(全站同源) ---------- */
function v23RefreshAll(){
  S.kps.filter(k=>k.st==='启用').forEach(k=>{
    S.lrn.forEach(l=>{
      const v=v23Mastery(l.mid,k.id);
      if(v==null)return;
      S.mastery[l.mid]=S.mastery[l.mid]||{};
      S.mastery[l.mid][k.id]={v,tries:((S.ansLog||[]).filter(a=>a.mid===l.mid&&a.kp===k.id).length),at:today};
    });
  });
}
/* 覆盖 v22 的 mCalc / mRefresh,让零售通、知识点页、效果页读同一套(在 v23Seed 里挂,避免加载顺序依赖) */
function v23MCalc(mid,kid){return v23Mastery(mid,kid)}
function v23MRefresh(mid,kid){const v=v23Mastery(mid,kid);if(v==null)return;const o=(S.mastery[mid]||{})[kid]||{};const was=o.v;
  S.mastery[mid]=S.mastery[mid]||{};S.mastery[mid][kid]=Object.assign({},o,{v,tries:(S.ansLog||[]).filter(a=>a.mid===mid&&a.kp===kid).length,at:today});
  if(v>=S.cfg.pass&&(was==null||was<S.cfg.pass))S.mastery[mid][kid].next=addDays(today,S.cfg.retestDays).slice(5)+' 复测';
  return {was,v}}

/* ---------- 10. 学习包模板与实例 ---------- */
const V23_PACK_SEED=[
 {id:'PT1',name:'诊断缺口包',trigger:'诊断缺口',steps:[['学',2],['练题',5],['演练',1],['复测',1]],count:3,dueDays:7,audience:'按诊断结果命中的知识点',passRule:'复测 ≥ 过关线',on:true},
 {id:'PT2',name:'错题复发包',trigger:'错题复发',steps:[['学',1],['练题',3],['演练',1]],count:2,dueDays:5,audience:'有复发错题的知识点',passRule:'复测 ≥ 过关线',on:true},
 {id:'PT3',name:'新内容上线包',trigger:'新内容上线',steps:[['学',1],['练题',2]],count:2,dueDays:10,audience:'内容挂载的知识点 + 画像命中人群',passRule:'学完即可',on:true},
];
/* v2 才新增的专项包模板(一键调整时写入) */
const V23_PACK_V2={id:'PT4',name:'顾虑解除专项',trigger:'画像缺口',steps:[['学',1],['演练',2],['练题',3],['复测',1]],count:2,dueDays:14,audience:'画像「顾虑解除」项未达标的试点批',passRule:'演练通关 + 复测 ≥ 过关线',on:true,v2:1};
function v23Packs(){
  S.packTpl=JSON.parse(JSON.stringify(V23_PACK_SEED));
  S.packs=[];
  const pilot=S.lrn.filter(l=>l.train);
  pilot.slice(0,10).forEach((l,i)=>{
    const weak=Object.keys(S.ev.q[l.mid]||{}).filter(kid=>((S.ev.q[l.mid][kid]||{}).score||0)<70).slice(0,2);
    weak.forEach((kid,j)=>{
      S.packs.push({id:'PK'+(S.packs.length+1),tpl:'PT2',mid:l.mid,kp:kid,name:'错题复发包 · '+((kp(kid)||{}).name||''),
        steps:[{t:'学',done:i%3!==0},{t:'练题',done:i%2===0},{t:'演练',done:false}],due:addDays(today,5-(i%4)),status:i%4===0?'已完成':i%3===0?'逾期':'进行中',ts:addDays(today,-(i%7+1))});
    });
  });
  return S.packs;
}
const packsOf=mid=>S.packs.filter(p=>p.mid===mid||(p.mids||[]).includes(mid)||(!p.mid&&p.kp&&(S.mastery[mid]||{})[p.kp]&&(S.mastery[mid]||{})[p.kp].v<S.cfg.pass));

/* ---------- 11. 配置版本与调优剧本 ---------- */
const V23_CFG_KEYS=[['srcW','来源权重'],['win','掌握度:最近 N 次'],['decay','掌握度:时间衰减'],['shrinkA','证据少时收缩系数'],['shrinkB','证据少时向 50 的占比'],['retestDays','复测间隔(天)'],['behWin','行为统计窗口(周)'],['behN','行为最小样本数'],['weakN','弱点预警:最少人数'],['weakR','弱点预警:未过关占比'],['obsWeeks','观察期(周)'],['smallN','小样本门槛(人)'],['corrTh','相关性预警阈值'],['pass','过关线']];
function cfgFlat(c){
  return {'来源权重 测评':c.srcW.quiz,'来源权重 演练':c.srcW.drill,'来源权重 实战行为':c.srcW.behavior,'来源权重 人工评价':c.srcW.coach,'来源权重 自评':c.srcW.self,
   '掌握度 最近 N 次':c.win,'掌握度 时间衰减':c.decay,'证据少收缩 A':c.shrinkA,'证据少收缩 B':c.shrinkB,'复测间隔(天)':c.retestDays,
   '行为窗口(周)':c.behWin,'行为最小样本':c.behN,'弱点最少人数':c.weakN,'弱点未过关占比':c.weakR,'观察期(周)':c.obsWeeks,'小样本门槛':c.smallN,'相关性阈值':c.corrTh,'过关线':c.pass};
}
function v23CfgVersions(){
  const base=JSON.parse(JSON.stringify(S.cfg));
  S.cfgV=[{ver:1,ts:addDays(today,-56)+' 10:20',by:'总部培训部 刘翔',status:'已生效',note:'起步口径:测评 .35 / 演练 .25 / 行为 .30 / 人工 .10',diff:[],snap:cfgFlat(base),raw:JSON.parse(JSON.stringify(base))}];
  S.v2seen=false;
  return S.cfgV;
}
/* 观察期到期提醒:v2 已生效 3 周 < 4 周 → 未到期 */
function v23ObsDue(v){if(!v||v.status!=='观察中')return null;const d=Math.ceil((new Date(today+'T00:00:00')-new Date(v.ts.slice(0,10)+'T00:00:00'))/864e5);return {days:d,left:S.cfg.obsWeeks*7-d}}

/* ---------- 12. 统计:象限 / 漏斗 / 诊断 ---------- */
function v23Pearson(xs,ys){
  const n=xs.length;if(n<3)return null;
  const mx=xs.reduce((a,b)=>a+b,0)/n,my=ys.reduce((a,b)=>a+b,0)/n;
  let a=0,b=0,c=0;for(let i=0;i<n;i++){const dx=xs[i]-mx,dy=ys[i]-my;a+=dx*dy;b+=dx*dx;c+=dy*dy}
  return (b&&c)?+(a/Math.sqrt(b*c)).toFixed(2):null;
}
function v23Quadrant(){
  const rows=S.lrn.map(l=>{
    const r=v23Readiness(l.mid,l.tier);const w=v23Wins();const o=outSum(l.mid,w.cur[0],w.cur[1]);
    return {mid:l.mid,name:l.name,store:l.store,region:l.region,tier:l.tier,group:l.group,rdy:r.val,ach:r.ach,lock:o.锁单,n:1};
  }).filter(x=>x.rdy!=null);
  const r=v23Pearson(rows.map(x=>x.rdy),rows.map(x=>x.lock));
  return {rows,r};
}
function v23Funnel(grp,a,b){
  const L=S.lrn.filter(l=>l.group===grp);
  const sum=L.reduce((s,l)=>{const o=outSum(l.mid,a,b);['邀约','到店','试驾','报价','锁单'].forEach(k=>s[k]=(s[k]||0)+o[k]);return s},{邀约:0,到店:0,试驾:0,报价:0,锁单:0});
  const n=L.length;const per=k=>n?+(sum[k]/n).toFixed(1):0;
  return {n,sum,per};
}
/* 行为出现率(按能力维度聚合,用于漏斗"行为变"层与前后对比) */
function v23BehRate(mid,kids,a,b){
  let sw=0,so=0;
  kids.forEach(kid=>{const arr=(S.beh[mid]||{})[kid]||[];arr.filter(x=>x.w>=a&&x.w<=b).forEach(x=>{sw+=x.n;so+=x.n*x.rate})});
  return sw?+(so/sw).toFixed(1):null;
}
function v23A3Kps(){return S.kps.filter(k=>k.st==='启用'&&v23IsConcern(k))}
function v23A3Rate(grp,a,b){
  const L=v23NewL(grp);const kids=v23A3Kps().map(k=>k.id);const vs=L.map(l=>v23BehRate(l.mid,kids,a,b)).filter(v=>v!=null);
  return vs.length?+(vs.reduce((a,c)=>a+c,0)/vs.length).toFixed(1):null;
}

/* ---------- 13. 一次装好 ---------- */
function v23Seed(){
  /* 理想态数据依赖 v22 的知识点 / 题 / 内容底座;底座为空时不生成半截数据 */
  if(!S.kps||!S.kps.length||!S.qs||!S.qs.length)return S;
  if(typeof PF_BASE!=='undefined')PF_BASE=null;
  v23Dims();v23KpDims();v23Profiles();v23Learners();v23Evidence();v23Outcome();v23Mistakes();v23Packs();v23CfgVersions();
  v23RefreshAll();
  S.trial={projId:(S.projects[2]||{}).id||'',name:'新人训第10期',start:addDays(today,-35),end:addDays(today,4),
    pilot:S.lrn.filter(l=>l.group==='试点批').length,ctrl:S.lrn.filter(l=>l.group==='对照批').length,
    pilotN:S.lrn.filter(l=>l.train).length,ctrlN:S.lrn.filter(l=>l.group==='对照批'&&l.tier==='新人顾问').length};
  return S;
}
