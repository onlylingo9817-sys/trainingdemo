/* ========== 示例数据:一套自洽的、各模块都有数据的演示状态(可「清空」从零走闭环) ========== */
function seedLog(p,d,who,msg){(p.log||(p.log=[])).push({t:d+' '+'10:00',who,msg})}
function seedProj(o){
  const key=tk(o.type,o.sub||'');const d=S.cfg.typeDef[key];
  const cover={tag:o.tag||'全员',positions:['门店岗位'],regions:o.regions,mids:'',useMid:false};
  const kw=o.topic?{kw:o.topic.sug.kw,trig:o.topic.sug.trig}:null;
  const main=indSnap(o.main||d.main,null,kw);const aux=(o.aux||d.aux).filter(x=>x!==main.id).map(id=>indSnap(id));
  const base=calcBase(main,cover);const target=+(o.target||+(base+(main.dir==='低'?-8:8)).toFixed(1));
  const id='P'+(S.projects.length+1);
  const p={id,name:o.name,type:o.type,sub:o.sub||'',status:o.status,start:o.start,end:o.end,finishType:1,finishDays:30,finishTime:addDays(o.end,15),cover,mids:[],aud:{regions:o.regions.slice(),level:o.tag==='新人'?'新人':'全体'},guide:o.guide||'',stages:[{modules:o.mods}],
   goal:{main,aux,rel:o.rel||d.rel,cycle:d.cycle,base,baseSrc:main.src+' · 近 '+winOf(main)+' 天 · '+scopeTxt(cover)},metric:main.name,unit:'%',base,baseSrc:main.src+' · 近 '+winOf(main)+' 天 · '+scopeTxt(cover),target,cur:null,
   tpls:[main.tpl].concat(aux.map(a=>a.tpl)),params:main.params,rel:o.rel||d.rel,cycle:d.cycle,owner:o.owner,created:o.created,from:o.topic?o.topic.id:null,classPub:!!o.classPub,obsDays:d.cycle,overReason:''};
  compile(p);S.projects.unshift(p);
  if(o.topic){const t=o.topic;t.flow='已采纳';t.proj=p.id;thist(t,o.owner.split('(')[0],'建了学习项目','项目 '+p.id+'「'+p.name+'」,目标 '+p.metric+' '+p.base+'% → '+p.target+'%')}
  seedLog(p,o.created,o.owner.split('(')[0],'提交学习项目,培训目标「'+p.metric+' '+p.base+'% → '+p.target+'%」已锁定');
  return p}
const T$=kw=>S.topics.find(t=>t.title.includes(kw));
function seedDemo(){
  const D=n=>addDays(today,n);
  UI.sel.ag={range:'近 2 周',kind:'全部',obj:'',region:'全国'};
  /* 课题:系统出题两批 + 对外洞察 + 自主提出 */
  A.runBatch();A.runBatch();
  S.agentDown=true;A.syncInsight();S.agentDown=false;A.syncInsight();
  A.insNew({dataset:{id:'I1'}});
  const mine=mkTopic({title:'展厅接待首句问候不统一',desc:'区域反馈展厅接待体验,首句问候各店差异大。',scene:'展厅',obj:'-',sess:120,stores:38,prov:4,trend:1,sug:{type:'专题训',sub:'短板类',ind:'I3',kw:'',trig:'',base:40,regions:['华北']}},'自主提出','周丽(区域老师·华北)','r1');
  mine.hist.push({t:D(-3)+' 10:00',who:'周丽(区域老师·华北)',act:'备注',note:'亦庄、望京两店近期客户投诉首句问候不规范'});
  const tPrice=T$('价格异议');tPrice.flow='暂不做';tPrice.skipReason='本季培训已饱和,下月复看';thist(tPrice,'刘翔','标记暂不做',tPrice.skipReason);
  /* 内容中心:话术 / 课程,覆盖草稿、审核中、已定稿,以及上架状态(未上架 / 待上架 / 已上架 / 已下架) */
  const tAito=T$('问界'),tPolicy=T$('国地补'),tOld=T$('以旧换新');
  const hs=(...a)=>a.map(x=>({t:x[0]+' 10:00',who:x[1],act:x[2],note:x[3]||''}));
  const gSrc='销冠语料蒸馏:近 14 天 2140 条会话,6 位销冠的共同讲法(示意)+ 你填写的目标 / 描述 / 要求';
  S.contents.push(
   C0({id:'N7',title:'价格异议处理 · 价值锚点话术',kind:'话术',type:'图文',script:1,src:'销冠挖掘',srcTag:'销冠语料蒸馏:近 14 天 410 条会话,5 位销冠的共同讲法(示意)',kw:'价值, 总拥有成本, 保值率',orig:0,created:D(-2),st:'审核中',goal:'让顾问在客户说“太贵了”时,先认同再讲价值锚点,不直接让价',desc:'价格异议处理缺少价值锚点:客户说“太贵了”后,顾问直接让价。',req:'3 句以内,口语化',body:{scene:'展厅,客户说“太贵了”时',lines:'您觉得价格有压力,这很正常,说明您在认真比。\n我们不只看买车这一刻,三年的使用成本、保值率和权益一起算,总拥有成本其实更低。\n我把这笔账给您算出来,您看哪一项是您最在意的。'},hist:hs([D(-1),'总部培训部 刘翔','提交审核','审核人:总部培训部 刘翔(默认本人,预留可配置)'],[D(-2),'总部培训部 刘翔','生成并保存草稿','agent 初稿 + 人工修改'])}),
   C0({id:'N8',title:'极氪 7X 对比话术(旧版)',kind:'话术',type:'图文',lecturer:'吴芳',script:1,src:'培训部编写',kw:'续航, 价格',up:96,down:41,orig:0,vis:'仅华南区域',created:D(-40),creator:'总部培训部 刘翔',topic:'',body:{scene:'展厅,客户拿极氪 7X 比价时',lines:'极氪最近价格动作比较大,您关注价格是对的。\n价格之外,建议您把三年的使用成本、补能网络和保值率一起算。\n我帮您列一张对比表,您对着看,再来试驾确认。'},hist:hs([D(-38),'总部培训部 刘翔','发布','零售通「学习专区」可见'],[D(-39),'总部培训部 刘翔','审核通过,已定稿'],[D(-40),'总部培训部 刘翔','保存草稿','手工编写'])}),
   C0({id:'N9',title:'以旧换新补贴口径问答',kind:'话术',type:'图文',lecturer:'陈刚',script:1,src:'培训部编写',kw:'以旧换新, 置换补贴',up:58,down:3,orig:0,created:D(-20),topic:tOld?tOld.id:'',goal:'客户问置换补贴怎么算时能讲清口径',desc:tOld?tOld.desc:'',body:{scene:'客服 / 展厅,客户问置换补贴时',lines:'置换补贴按您旧车的车况和所在地政策两部分算。\n我先帮您估一下旧车残值,再叠加当地补贴,算出实际到手价。\n具体口径以最新政策为准,我把材料清单发您。'},hist:hs([D(-19),'总部培训部 刘翔','发布','零售通「学习专区」可见'],[D(-20),'总部培训部 刘翔','审核通过,已定稿'],[D(-21),'总部培训部 刘翔','生成并保存草稿','agent 初稿 + 人工修改'])}),
   C0({id:'N10',title:'问界 M8 对比话术 · 空间与补能',kind:'话术',type:'图文',lecturer:'刘翔',script:1,src:'销冠挖掘',srcTag:gSrc,kw:'同价位, 空间, 智驾体验',up:4,down:1,orig:0,created:D(-8),st:'已定稿',pubSt:'未上架',topic:tAito?tAito.id:'',goal:'让顾问在客户拿问界 M8 对比时,能讲清空间与补能体验的差异',desc:tAito?tAito.desc:'',req:'3 句以内,口语化,先认同再对比',body:{scene:'试驾环节,客户提到「问界 M8」时',lines:'问界 M8 确实很多客户在比,尤其看重家用空间。\n我们先看您实际用车场景:几个人坐、多久跑一次长途。按您的场景,我把两款的空间和补能体验对一下。\n对完您再决定,今天可以两款都试,体验差异最直接。'},hist:hs([D(-5),'总部培训部 刘翔','做成学习任务','项目「强竞品·问界M8」,分批灰度'],[D(-7),'总部培训部 刘翔','审核通过,已定稿','审核人=创建人本人'],[D(-8),'总部培训部 刘翔','提交审核'],[D(-8),'总部培训部 刘翔','生成并保存草稿','agent 初稿 + 人工修改'])}),
   C0({id:'N16',title:'展厅接待首句问候话术',kind:'话术',type:'图文',lecturer:'周丽',script:1,src:'培训部编写',srcTag:'',kw:'欢迎, 您好, 看车',orig:0,created:D(-1),vis:'仅华北区域',st:'审核中',creator:'周丽(区域老师)',cK:'r1',rK:'r1',rName:'周丽(区域老师)',topic:'',goal:'统一华北展厅首句问候',desc:'亦庄、望京两店近期客户投诉首句问候不规范。',body:{scene:'展厅,客户进店 3 秒内',lines:'您好,欢迎来小米汽车,今天主要想了解哪款车?\n您先随便看,有任何问题我就在旁边。'},hist:hs([D(-1),'周丽(区域老师)','提交审核','审核人:周丽(区域老师)(默认本人,预留可配置)'],[D(-1),'周丽(区域老师)','保存草稿','手工编写'])}),
   C0({id:'N17',title:'以旧换新补贴口径速读',kind:'课程',type:'图文',lecturer:'刘翔',orig:0,created:D(-1),st:'草稿',srcTag:'销冠语料蒸馏:近 14 天 760 条会话,4 位销冠的共同讲法(示意)',topic:tOld?tOld.id:'',goal:'让顾问 10 分钟内讲清以旧换新补贴怎么算',desc:'客户问置换补贴怎么算,顾问含糊。',req:'配案例',body:{mins:10,outline:'1. 为什么客户总问置换补贴\n2. 补贴由哪几部分构成\n3. 三个真实案例\n4. 不能说的话'},hist:hs([D(-1),'总部培训部 刘翔','保存草稿','agent 初稿 + 人工修改'])}),
  );
  /* v15:内容管理精细化——元数据、有效期、来源、版本、AI 采纳率、导入批次、一线反馈、区域推荐 */
  const set=(id,o)=>Object.assign(content(id),o);
  S.contents.forEach(cEnsure);
  set('N1',{subject:'奔驰 GLC',scene:'试驾',ability:'场景化讲车',expire:D(120),source:'GLC 对比口径(培训部 9 月版)'});
  set('N2',{subject:'国补 / 地补',scene:'外呼',ability:'不限',expire:D(10),source:'国补实施细则(10 月版)',aiLines:[]});
  set('N3',{subject:'邀约试驾',scene:'外呼',ability:'场景化讲车',assets:[{name:'邀约试驾5步法.mp4',kind:'视频',size:'86 MB',note:'学堂现有素材'}]});
  set('N4',{subject:'探需',scene:'试驾',ability:'探需'});
  set('N5',{subject:'通用',scene:'展厅',ability:'不限',aud:'新人',assets:[{name:'新人入职第一周实战.mp4',kind:'视频',size:'218 MB',note:'学堂现有素材'}]});
  set('N6',{subject:'YU7 产品',scene:'展厅',ability:'场景化讲车',assets:[{name:'YU7产品知识手册.pdf',kind:'PDF',size:'18 MB',note:'学堂现有素材'}]});
  set('N7',{subject:'价格异议',scene:'展厅',ability:'顾虑解除',aiLines:spl(content('N7').body.lines).slice(0,2).concat(['您觉得价格有压力,说明您在认真比。']),refs:[{t:'销冠讲法',label:'华东销冠 · 价值锚点三句',text:'我们不只看买车这一刻,三年的使用成本、保值率和权益一起算'},{t:'线下资料',label:'价格异议处理手册.docx',text:''}]});
  set('N8',{subject:'极氪 7X',scene:'展厅',ability:'顾虑解除',expire:D(-3),st:'已定稿',pubSt:'已下架',pubBack:{reason:'已到有效期('+D(-3)+'),系统自动下线;点踩率 30%',t:D(-3),who:'系统'}});
  set('N9',{subject:'以旧换新',scene:'客服',ability:'不限',expire:D(45),source:'以旧换新补贴口径(11 月)',origin:'线下资料导入',srcFile:'以旧换新补贴问答.docx',srcDept:'GTM 政策组',srcTag:'',batch:'B0',aiLines:[]});
  set('N10',{subject:'问界 M8',scene:'试驾',ability:'场景化讲车',expire:D(80),aiLines:spl(content('N10').body.lines).slice(0,2).concat(['建议您先试驾体验一下。']),refs:[{t:'销冠讲法',label:'华东销冠 · M8 对比讲法',text:'先问几个人坐、多久跑一次长途'},{t:'语料片段',label:'试驾会话 2140 条对比片段',text:''}]});
    set('N16',{subject:'展厅接待',scene:'展厅',ability:'不限',aud:'全员'});
  set('N17',{subject:'以旧换新',scene:'客服',ability:'不限',expire:D(45),source:'以旧换新补贴口径(11 月)'});
  ['N7','N8','N9','N10'].forEach(id=>{const c=content(id);if(usableC(c)||pubOf(c)!=='未上架'){c.vers=[{v:1,t:c.created,who:c.creator,note:'审核通过',snap:snapOf(c)}]}});
  // N1 改版演示:v2 已发布(项目 P4 仍锁定 v1);N2 刚改过口径
  (function(){const c=content('N1');const v1=snapOf(c);c.vers=[{v:1,t:'2026-09-15',who:'总部培训部 刘翔',note:'学堂现有内容并入',snap:v1}];c.body.lines=c.body.lines.replace('理解您会拿 GLC 一起比。','理解您会拿 GLC 一起比,这是同价位里最常被比的一款。');c.ver=2;c.vers.push({v:2,t:D(-6),who:'总部培训部 刘翔',note:'补充「最常被比」的开场认同,依据一线点踩原因「说法生硬」',snap:snapOf(c)});chist(c,'改版 v2 审核通过','依据一线反馈:说法生硬');})();
  // 导入批次演示:B0 已导入(N9)、B1 待确认(区域老师周丽)
  S.cimps=[{id:'B0',t:D(-20)+' 14:05',who:'总部培训部 刘翔',cK:'hq',files:[{name:'以旧换新补贴问答.docx',size:'210 KB'}],items:[{title:'以旧换新补贴口径问答',kind:'话术',file:'以旧换新补贴问答.docx',ai:true,inc:true,act:'新建',body:{},assets:[]}],bad:[],st:'已导入',nDraft:0,nStored:1,nSkip:0,cids:['N9'],direct:true},
   {id:'B1',t:D(-1)+' 16:40',who:'周丽(区域老师)',cK:'r1',files:[{name:'华北门店高频问题.csv',size:'4 KB'}],items:[
    {k:'i1',file:'华北门店高频问题.csv',dept:'华北培训组',kind:'话术',title:'客户问「能不能再便宜点」',subject:'价格异议',scene:'展厅',ability:'顾虑解除',aud:'全员',vis:'仅华北区域',expire:'',source:'',kw:'价值, 保值率',body:{scene:'展厅',lines:'您看得很仔细。\n这个价格已经包含了三年的权益,我帮您算一下总拥有成本。'},type:'图文',assets:[],line:2,dup:null,act:'新建',inc:true},
    {k:'i2',file:'华北门店高频问题.csv',dept:'华北培训组',kind:'话术',title:'价格异议 · 价值锚点话术',subject:'价格异议',scene:'展厅',ability:'顾虑解除',aud:'全员',vis:'仅华北区域',expire:'',source:'',kw:'价值',body:{scene:'展厅',lines:content('N7').body.lines.split('\n')[0]+'\n华北补充:冬季续航也一并算'},type:'图文',assets:[],line:3,dup:'N7',act:'跳过',inc:true},
    {k:'i3',file:'华北门店高频问题.csv',dept:'华北培训组',kind:'课程',title:'展厅接待速读',subject:'展厅接待',scene:'展厅',ability:'不限',aud:'新人',vis:'仅华北区域',expire:'',source:'',kw:'',body:{outline:''},type:'图文',assets:[],line:4,dup:null,act:'新建',inc:true}],bad:['华北门店高频问题.csv 第 5 行:类型「视频」不支持,应为 话术 / 课程'],st:'待确认',direct:false,cids:[],nDraft:0,nStored:0,nSkip:0}];
  // 一线反馈:带原因的点踩 + 纠错
  S.feedback=[{id:'F1',cid:'N8',type:'点踩',reason:'已经过时',text:'极氪最近降价了,说法不对',who:'黄磊(广州天河店)',t:D(-5)+' 10:12',st:'待处理',proj:'',ver:1},{id:'F2',cid:'N8',type:'点踩',reason:'和实际不符',text:'',who:'梁慧(深圳福田店)',t:D(-5)+' 11:30',st:'待处理',proj:'',ver:1},{id:'F3',cid:'N2',type:'纠错',reason:'数字 / 政策有误',text:'第二句里地补上限写错了,应以当地最新口径为准',who:'周凯(上海浦东店)',t:D(-1)+' 09:20',st:'待处理',proj:'',ver:1},{id:'F4',cid:'N1',type:'点踩',reason:'说法生硬',text:'开场太直接',who:'孙雅婷(上海徐汇店)',t:D(-8)+' 15:02',st:'已采纳',proj:'',ver:1}];
  // 区域推荐:华南的极氪话术(N8)区域内容 → 周丽的区域话术推荐到全国
  set('N16',{rec:null});
  S.contents.unshift(cEnsure(C0({id:'N19',title:'华北冬季续航话术',kind:'话术',type:'图文',lecturer:'周丽',script:1,src:'培训部编写',kw:'冬季续航, 实测, 低温',up:41,down:2,orig:0,vis:'仅华北区域',st:'已定稿',pubSt:'已上架',pubVer:1,creator:'周丽(区域老师)',cK:'r1',rK:'r1',rName:'周丽(区域老师)',created:D(-30),subject:'国补 / 地补',origin:'手工编写',body:{scene:'展厅,客户问冬天续航时',lines:'冬天续航会有衰减,这是所有电车的共性,我们看实测数据说话(以公开测试结果为准)。\n低温下预热、驻车热管理都有设置建议,我现场给您演示。\n您平时通勤多远?我按您的路线帮您估一下冬季实际续航。'},hist:[{t:D(-28)+' 10:00',who:'周丽(区域老师)',act:'发布',note:'零售通学习专区可见(仅华北)'}],rec:{st:'待总部审核',by:'周丽(区域老师)',why:'华北两个月使用点踩率 5%,冬季南下的区域也能用',t:D(-1)}})));
  /* 一线话术沉淀文档(飞书)→ 通过「导入内容 → 飞书链接」进入内容中心:SPIN 格式,按车型分组 */
  (function(){const ids=[];SPIN_DOC.forEach((x,i)=>{const id='N'+(101+i);const th=x.t.split(' · ')[0],nm=x.t.split(' · ')[1]||x.t;const st=i%13===12?'草稿':'已定稿';const pub=st==='已定稿'&&i%3!==2?'已上架':'未上架';
    const c=cEnsure(C0({id,title:x.t,kind:'话术',type:'图文',lecturer:['王磊','李娜','陈刚'][i%3],script:1,src:'培训部编写',srcTag:'',kw:spinKw(x),up:pub==='已上架'?20+hsh(id)%90:0,down:pub==='已上架'?hsh(id+'d')%5:0,orig:0,created:D(-12+i%9),st,pubSt:pub==='已上架'?'已上架':'未上架',pubVer:pub==='已上架'?1:undefined,car:x.car,theme:th,vis:'全国',subject:'通用',scene:/邀约|接待/.test(x.t)?'展厅':'试驾',ability:'场景化讲车',origin:'线下资料导入',srcFile:'销售话术积累(飞书文档)',srcDept:'一线销售话术沉淀',batch:'B2',source:SPIN_URL,body:{scene:th+' · '+nm.replace(/\d+$/,'')+(x.car!=='通用车型'?'(客户看 '+x.car+')':''),spin:{S:x.S,P:x.P,I:x.I,N:x.N}},creator:'总部培训部 刘翔',cK:'hq',rK:'hq',rName:'总部培训部 刘翔',hist:[{t:D(-12+i%9)+' 15:20',who:'总部培训部 刘翔',act:'线下资料导入(B2)',note:'来自飞书文档「销售话术积累」,'+(st==='已定稿'?'已核对,直接定稿':'进入草稿待补充')}]}));
    c.assets=[{name:SPIN_URL,kind:'外部链接',size:'-',note:'飞书原文'}];if(st==='已定稿')c.vers=[{v:1,t:c.created,who:'总部培训部 刘翔',note:'导入时已核对,直接定稿',snap:snapOf(c)}];if(pub==='已上架'){c.pubAt=c.created+' 10:00';c.hist.unshift({t:c.created+' 10:30',who:'总部培训部 刘翔',act:'上架到零售通',note:'分类「销售技巧」'})}
    S.contents.unshift(c);ids.push(id)});
    S.cimps.unshift({id:'B2',t:D(-12)+' 15:20',who:'总部培训部 刘翔',cK:'hq',files:[{name:'销售话术积累(飞书文档)',size:'-'}],items:SPIN_DOC.map((x,i)=>({title:x.t,kind:'话术',file:'销售话术积累(飞书文档)',ai:true,inc:true,act:'新建',body:{scene:'',spin:{S:x.S,P:x.P,I:x.I,N:x.N}},assets:[],subject:'通用',scene:'不限',ability:'场景化讲车',aud:'全员',vis:'全国',expire:'',source:SPIN_URL,kw:'',type:'图文'})),bad:[],st:'已导入',nDraft:3,nStored:SPIN_DOC.length-3,nSkip:0,cids:ids,direct:true})})();
  content('N19').subject='通用';content('N19').vers=[{v:1,t:D(-30),who:'周丽(区域老师)',note:'审核通过',snap:snapOf(content('N19'))}];
  [[tAito,'N10'],[tOld,'N9'],[tOld,'N17']].forEach(([t,id])=>{if(t){t.cids=(t.cids||[]).concat(id);if(['新发现','暂不做'].includes(t.flow))t.flow='已采纳';thist(t,'刘翔','生成了内容','「'+content(id).title+'」('+content(id).kind+')')}});
  /* 项目 */
  // P1 新人训第10期:已评估,样本偏少
  const p1=seedProj({name:'新人训第10期',type:'新人训',tag:'新人',regions:['华北','华东'],status:'评估中',start:D(-60),end:D(-30),created:D(-70),owner:'周丽(区域老师·华北)',
    mods:[modOf('线下班次培训',{'报名任务':{rel:'线下班次培训',name:'新人训班次培训',signup:'报名制',quota:40,deadline:D(-62),approver:'周丽(区域老师·华北)'}}),modOf('入职第一周',{'学习':{rel:'学堂内容',ref:'N5'},'考试':{rel:'有考试',link:EXAM}})]});
  // P2 新人训第12期:报名中(名额 4,有候补 / 待审批 / 驳回),可演示审批与分班
  const p2=seedProj({name:'新人训第12期',type:'新人训',tag:'新人',regions:['华北','华东'],status:'已生效',start:D(-3),end:D(27),created:D(-6),owner:'周丽(区域老师·华北)',topic:T$('探需提问'),classPub:true,
    mods:[modOf('线下班次培训',{'报名任务':{rel:'线下班次培训',name:'新人训班次培训',signup:'报名制',quota:4,deadline:D(4),approver:'周丽(区域老师·华北)'}}),modOf('入职第一周',{'学习':{rel:'学堂内容',ref:'N5'},'考试':{rel:'有考试',link:EXAM}})]});
  // P3 进阶训探需班:华东,待审批 2
  const p3=seedProj({name:'进阶训探需班第3期',type:'进阶训',regions:['华东'],status:'已生效',start:D(-2),end:D(28),created:D(-5),owner:'陈磊(区域老师·华东)',
    mods:[modOf('线下班次培训',{'报名任务':{rel:'线下班次培训',name:'探需进阶班次培训',hours:'1 天',signup:'报名制',quota:3,deadline:D(3),approver:'陈磊(区域老师·华东)'}}),modOf('课前学习',{'学习':{rel:'学堂内容',ref:'N4'}})]});
  // P4 强竞品 GLC:评估中,达成
  const p4=seedProj({name:'强竞品·奔驰GLC',type:'专题训',sub:'强竞品',regions:ALLR.slice(),status:'评估中',start:D(-40),end:D(-10),created:D(-45),owner:'李晓梅(总部培训部)',topic:T$('GLC'),
    mods:[modOf('GLC 对比话术',{'学习':{rel:'学堂内容',ref:'N1'},'检核':{rel:'有检核',ref:'GLC 对比话术检核'}})]});
  // P5 约试驾:评估中,未达成 → 辅导工单
  const p5=seedProj({name:'技能·邀约试驾',type:'专题训',sub:'技能类·约试驾',regions:ALLR.slice(),status:'评估中',start:D(-55),end:D(-25),created:D(-60),owner:'李晓梅(总部培训部)',topic:T$('邀约试驾'),
    mods:[modOf('邀约 5 步法',{'学习':{rel:'学堂内容',ref:'N3'},'考试':{rel:'有考试',link:EXAM}})]});
  // P6 国地补:已结项(复制)
  const p6=seedProj({name:'政策·国地补口径',type:'专题训',sub:'政策类',regions:['华东','华南'],status:'已结项',start:D(-100),end:D(-70),created:D(-105),owner:'李晓梅(总部培训部)',topic:T$('国地补'),
    mods:[modOf('政策口径',{'学习':{rel:'学堂内容',ref:'N2'}})]});
  // P7 新品训 YU7:未生效
  const p7=seedProj({name:'新品训·YU7认证',type:'新品训',regions:ALLR.slice(),status:'未生效',start:D(7),end:D(37),created:D(-1),owner:'李晓梅(总部培训部)',
    mods:[modOf('YU7 认证',{'学习':{rel:'学堂内容',ref:'N6'},'考试':{rel:'有考试',link:EXAM}})]});
  // P8 进阶训:指定范围(华南,按覆盖角色自动生成名单,免审批)
  const p8=seedProj({name:'进阶训华南指定班',type:'进阶训',regions:['华南'],status:'已生效',start:D(-1),end:D(29),created:D(-3),owner:'吴芳(区域老师·华南)',
    mods:[modOf('线下班次培训',{'报名任务':{rel:'线下班次培训',name:'进阶班次培训',signup:'指定范围',roster:'按覆盖角色自动生成',approver:'吴芳(区域老师·华南)'}}),modOf('课前学习',{'学习':{rel:'学堂内容',ref:'N4'}}),modOf('极氪对比话术',{'学习':{rel:'学堂内容',ref:'N8'}})]});
  ['2024111','2024115','2024116','2023204'].forEach(m=>S.apps.push({id:'A'+m+p8.id,proj:p8.id,mid:m,time:D(-1)+' 09:00',status:'已通过',src:'范围选择(免审)'}));seedLog(p8,D(-1),'吴芳','提交学习项目,指定范围:按覆盖角色生成参训名单 4 人');p8.log.reverse();
  // P9 强竞品·问界M8:分批灰度中(第一批 华东 6 人,对照批 华南 4 人),新内容 N10 首次使用
  const p9=seedProj({name:'强竞品·问界M8',type:'专题训',sub:'强竞品',rel:'A',regions:['华东','华南'],status:'已生效',start:D(-4),end:D(26),created:D(-5),owner:'李晓梅(总部培训部)',topic:T$('问界'),
    mods:[modOf('问界 M8 对比话术',{'学习':{rel:'学堂内容',ref:'N10'},'情景演练':{rel:'有情景演练',ref:'竞品对比话术演练',kind:'话术演练'}})]});
  p9.gray={mids:['2024104','2024105','2024106','2024107','2023203','2024114'],days:7,onTimeout:'提醒我决策',stage:'灰度中',startedAt:D(-4),reminded:[]};
  S.learn[p9.id]={};['2024104','2024105','2024106','2023203'].forEach(m=>S.learn[p9.id][m]=p9.nodes.map(n=>n.id));S.learn[p9.id]['2024107']=[p9.nodes[0].id];
  [['2024104',1],['2024105',1],['2024106',1],['2023203',1],['2024107',-1]].forEach(([m,v])=>S.likes[p9.id+'|'+p9.nodes[0].id+'|'+m]=v);
  seedLog(p9,D(-5),'李晓梅','提交学习项目,培训目标「'+p9.metric+' '+p9.base+'% → '+p9.target+'%」已锁定;分批灰度:第一批 6 人(华东),观察 7 天,对照批 4 人(华南)暂不下发');p9.log.reverse();
  /* P1 报名 / 分班 / 成绩 */
  const g1=['2024101','2024102','2024103','2024112','2024104','2024105','2024106','2024107'];
  g1.forEach((m,i)=>S.apps.push({id:'A'+m+p1.id,proj:p1.id,mid:m,time:D(-64)+' 1'+(i%10)+':20',status:'已通过',src:'零售通报名'}));
  S.classes.push({id:'K1',proj:p1.id,name:'第10期一班',course:p1.offName,date:D(-57),time:'09:00-17:30',place:'北京·亦庄培训中心 3 层 301',teacher:'王磊',cap:30,members:g1.slice(0,4)},{id:'K2',proj:p1.id,name:'第10期二班',course:p1.offName,date:D(-56),time:'09:00-17:30',place:'上海·徐汇培训中心 2 层 201',teacher:'李娜',cap:30,members:g1.slice(4)});
  S.results[p1.id]={};g1.forEach((m,i)=>{S.results[p1.id][m]=m==='2024105'?{signed:false,online:null,offline:null,st:'缺考'}:{signed:true,online:78+hsh(m)%16,offline:72+hsh(m+'o')%22,st:'已结业'}});
  S.learn[p1.id]={};g1.filter(m=>m!=='2024105').forEach(m=>S.learn[p1.id][m]=tasksOf(p1).map(n=>n.id));
  S.evals={};S.evals[p1.id]={};['2024101','2024102','2024103','2024112'].forEach((m,i)=>S.evals[p1.id][m]={content:4+(i%2),teacher:5-(i%3===2?1:0),t:D(-29)});
  p1.imports=[{t:D(-30)+' 16:20',who:'周丽(区域老师·华北)',file:'新人训第10期_线下成绩.csv',total:8,ok:7,bad:['第 9 行 2024105:成绩为空(缺考请填「是」)']}];
  /* P2 */
  [['2024101','已通过'],['2024102','已通过'],['2024103','已通过'],['2024112','已通过'],['2024104','候补'],['2024106','待审批'],['2024107','待审批'],['2024105','已驳回']].forEach(([m,st],i)=>S.apps.push({id:'A'+m+p2.id,proj:p2.id,mid:m,time:D(-2)+' 0'+(9+i)+':'+(10+i*3),status:st,src:'零售通报名',reason:st==='已驳回'?'已参加上一期新人训':undefined}));
  S.classes.push({id:'K3',proj:p2.id,name:'第12期一班',course:p2.offName,date:D(9),time:'09:00-17:30',place:'北京·亦庄培训中心 3 层 302',teacher:'王磊',cap:30,members:['2024101','2024102']});
  ensureRes(p2.id,'2024101');ensureRes(p2.id,'2024102');
  /* P3 */
  [['2024104','已通过'],['2024105','已通过'],['2023203','待审批'],['2024114','待审批']].forEach(([m,st],i)=>S.apps.push({id:'A'+m+p3.id,proj:p3.id,mid:m,time:D(-1)+' 1'+i+':05',status:st,src:'零售通报名'}));
  /* 线上项目学习记录 */
  const done=(p,ms,upto)=>{S.learn[p.id]=S.learn[p.id]||{};ms.forEach(m=>S.learn[p.id][m]=tasksOf(p).slice(0,upto||99).map(n=>n.id))};
  const all=PEOPLE.map(x=>x.mid).filter(m=>m!=='2024118');
  done(p4,all.slice(0,16));done(p4,['2024118'],1);
  done(p5,all.slice(2,14));done(p6,all.slice(0,12));
  /* 效果数据(进入评估中的同步结果) */
  [[p1,1.1],[p4,1.25],[p5,0.5],[p6,1.3]].forEach(([p,r])=>gen(p,r));
  seedLog(p1,D(-58),'周丽','审批通过 8 人,新建班次 2 个');seedLog(p1,D(-55),'周丽','发布分班结果');seedLog(p1,D(-30),'周丽','结业 7 人,缺考 1 人');seedLog(p1,D(-1),'系统','推进到「评估中」,同步北斗 BI / 汽车语料 / 清河大学');
  seedLog(p2,D(-2),'周丽','审批 刘子涵、陈思远、赵一鸣、马丽:已通过;孙雅婷:候补(名额已满)');seedLog(p2,D(-1),'周丽','新建班次「第12期一班」并发布分班结果');
  seedLog(p3,D(-1),'陈磊','审批 孙雅婷、周凯:已通过');
  seedLog(p4,D(-10),'系统','培训结束,进入观察期');seedLog(p4,D(-2),'系统','推进到「评估中」,同步数据');
  seedLog(p5,D(-25),'系统','培训结束,进入观察期');seedLog(p5,D(-3),'系统','推进到「评估中」,同步数据');
  p6.closeRes='复制';p6.closeWhy='开口率 +16pt,同期无其他培训,复制到华北、西南';seedLog(p6,D(-70),'系统','培训结束,进入观察期');seedLog(p6,D(-38),'系统','推进到「评估中」');seedLog(p6,D(-30),'李晓梅','结项,结论「复制」:'+p6.closeWhy);
  topicWriteback(p6);
  seedLog(p7,D(-1),'李晓梅','提交学习项目,下发周期 '+D(7)+' 开始');
  [p1,p2,p3,p4,p5,p6,p7].forEach(p=>p.log.reverse());
  /* 辅导工单(由 P5 未达标门店 + 手工推荐生成) */
  mkTickets(p5,3,'推荐辅导店');
  const tk3=S.tickets.filter(t=>t.proj===p5.id);
  if(tk3[0]){tk3[0].st='复测';tk3[0].owner='周丽';tk3[0].post={value:+(tk3[0].pre+3.1).toFixed(1),pre:tk3[0].pre,result:'有改善，但还不稳定',next:'把有效话术放进早会，继续观察一周',t:addDays(today,-2)};tk3[0].feedback=[{t:addDays(today,-7),who:'周丽',kind:'日',title:'日反馈：留资回访有遗漏',text:'抽查 5 条线索，2 条超过 2 小时未回访；已要求当天补齐。'},{t:addDays(today,-3),who:'周丽',kind:'周',title:'周反馈：邀约到店回升',text:'本周邀约到店 42%，高于上周 36%；同城标杆 48%，还有差距。'}]}
  if(tk3[1]){tk3[1].st='陪跑';tk3[1].owner='陈磊';tk3[1].feedback=[{t:addDays(today,-5),who:'陈磊',kind:'日',title:'现场动作有改善',text:'试驾前会主动确认家庭场景，但报价时仍先让价。'}]}
  if(tk3[2]){tk3[2].st='到店';tk3[2].owner='吴芳';tk3[2].checks.during[0].done=true;tk3[2].checks.during[1].done=true;tk3[2].note='顾问接待完整，试驾路线单一，商谈时缺少总拥有成本对比。'}
  mkTickets(p4,1,'项目结项转入');
  // 项目内容版本锁定:已有项目节点锁定当时版本
  S.projects.forEach(p=>p.nodes.forEach(n=>{if(n.contentId&&content(n.contentId)){const c=content(n.contentId);const vv=(c.vers||[]).find(x=>x.v===1)||(c.vers||[])[0]||{v:1,snap:snapOf(c)};n.contentVer=vv.v;n.snap=JSON.parse(JSON.stringify(vv.snap))}}));
  /* 效果报告:周一 / 月初自动产出 */
  S.reports=[];[[-21],[-14],[-7],[0]].forEach(([d])=>mkReport('周报','全国',D(d),true));mkReport('月报','全国',D(-9),true);mkReport('周报','华北',D(0),true);mkReport('周报','华东',D(0),true);
  /* 内容点赞点踩已体现在 contents;通知 */
  S.notices=[{t:'09:12',m:'课题「国地补口径」所属项目已结项,效果结论已写回'},{t:'09:05',m:'系统出题完成:批次 B2 从汽车语料 badcase 聚类 3 个候选,出题 2 个'},{t:'08:40',m:'项目「新人训第12期」分班结果已发布:第12期一班'},{t:'08:30',m:'项目「技能·邀约试驾」数据同步完成,可在「效果追踪」查看'},{t:'昨天',m:'内容「价格异议处理 · 价值锚点话术」已提交审核,审核人:总部培训部 刘翔'},{t:'08:10',m:'项目「强竞品·问界M8」灰度中:第一批 6 人已收到任务,对照批 4 人暂不下发'}];
  kpSeed();qSeed();drSeed();kpSeedMastery();
  ciSeedCourse();ciSeedSpinCourse();kpRelSeed();kpTagSeed();
  /* v23:理想态数据层(维度 / 画像 / 12 周证据 / 业务结果 / 错题 / 学习包 / 配置版本),并覆盖掌握度算法 */
  if(typeof v23Seed==='function')v23Seed();
  $('#toast').style.display='none';
  renderBell();
}
A.reset=()=>{reset();seedDemo();render();toast('已载入示例数据(各模块都有数据,可直接演示)','ok')};
A.clear=()=>{reset();render();toast('已清空,从零开始走闭环','ok')};


/* 真实课程样例：CEMN 讲师手册（assets/cemn_course.md 的摘要版）
   目的：让本地启动后可以直接看到「课程链接 → 课程骨架 + 候选知识点 → 回挂 → 上架」结果，无需依赖飞书登录态。 */
/* 真实课程样例二：场景化讲车 SPIN（assets/spin_course.md）
   与 CEMN 一样走「课程 → 候选知识点 → 回挂 → 上架」，并额外生成一条演练脚本。 */
/* 补齐评审点出的缺口：展厅接待首句问候（来自课题 T9） */
function kpGapSeed(){
  if(S.kps.some(k=>k.id==='K_RECV1'))return;
  const tag=ptagByPath('销售场景_展厅接待');
  const ab=(typeof kpAbRows==='function'?kpAbRows().find(x=>x.name==='探需'):null)||{};
  const nk={id:'K_RECV1',name:'展厅接待首句问候',type:'技能型',tags:tag?[tag.id]:[],dim:'探需',dims:{},
    car:'通用车型',cars:['通用车型'],syn:['首句问候','接待开场','迎宾话术'],owner:'王磊',st:'启用',ext:[],
    pre:['K20'],rel:['K21'],created:today,
    hist:[{t:today,who:'总部培训部 刘翔',act:'由课题补齐',note:'课题 T9：展厅接待首句问候不统一'}]};
  if(ab.id)nk.dims.Dab=[ab.id];
  if(tag)nk.dims.Dprod=[tag.id];
  nk.dims.Dcar=(typeof kpCarIds==='function'?kpCarIds(nk.cars):[]);
  S.kps.push(nk);
}
/* 标签补齐：按知识点语义补上标签，避免治理页一打开全是缺口 */
function kpTagSeed(){
  const T=(path)=>ptagByPath(path);
  const set=(id,paths)=>{
    const k=S.kps.find(x=>x.id===id);if(!k||(k.tags||[]).length)return;
    const ids=paths.map(T).filter(Boolean).map(t=>t.id);if(ids.length)k.tags=ids;
  };
  set('K17',['销售场景_展厅接待']);
  set('K18',['销售场景_报价谈判']);
  set('K19',['车型卖点_智驾_辅助驾驶','销售场景_展厅接待']);
  set('K20',['销售场景_展厅接待']);
  set('K21',['销售场景_邀约到店']);
  set('K22',['政策口径_国补地补']);
  set('K24',['带人辅导_新人带教']);
  set('K25',['带人辅导_目标与例会']);
  ['K_CEMN0','K_CEMN1','K_CEMN2','K_CEMN3','K_CEMN4','K_CEMN5','K_CEMN6'].forEach(id=>set(id,['销售场景_展厅接待']));
  ['K_SPIN0','K_SPIN1','K_SPIN2','K_SPIN3','K_SPIN4'].forEach(id=>set(id,['销售场景_展厅接待']));
}
/* 知识关系种子：前置(learn before) / 相关(常一起讲) */
function kpRelSeed(){
  const set=(id,pre,rel)=>{const k=S.kps.find(x=>x.id===id);if(!k)return;k.pre=(pre||[]).filter(x=>S.kps.some(y=>y.id===x));k.rel=(rel||[]).filter(x=>S.kps.some(y=>y.id===x))};
  /* 场景化讲车：按家庭 / 露营 / 商务 / 安全 四组卖点互相关联 */
  set('K1',[],['K2','K8','K9','K13']);        /* 储物 相关 座椅/办公/儿童/宠物 */
  set('K2',[],['K3','K9','K11']);             /* 座椅 相关 上下车/儿童/露营 */
  set('K3',[],['K2','K9']);                   /* 上下车便利 相关 座椅/儿童 */
  set('K4',[],['K11','K5']);                  /* 外放电 相关 露营/补能 */
  set('K5',[],['K4','K16']);                  /* 续航补能 相关 外放电/哨兵 */
  set('K6',[],['K16','K5']);                  /* 辅助驾驶 相关 哨兵/补能 */
  set('K8',[],['K1','K10']);                  /* 移动办公 相关 储物/影音 */
  set('K9',[],['K2','K3']);                   /* 儿童座椅 相关 座椅/上下车 */
  set('K10',[],['K8','K11']);                 /* 影音 相关 办公/露营 */
  set('K11',[],['K4','K2','K10']);            /* 露营休息 相关 外放电/座椅/影音 */
  set('K13',[],['K1','K9']);                  /* 宠物出行 相关 储物/儿童 */
  set('K16',[],['K6','K5']);                  /* 哨兵 相关 智驾/补能 */
  /* 顾虑解除：先探需 → 再讲价值 → 再处理价格/竞品/政策 */
  set('K15',['K20'],['K18','K19']);           /* 用车成本 前置探需 */
  set('K18',['K20','K15'],['K19','K22']);     /* 价格异议 前置探需+成本 */
  set('K19',['K20'],['K18','K22']);           /* 竞品对比 */
  set('K22',['K20'],['K18','K19']);           /* 政策口径 */
  /* 探需 → 讲车 的先后 */
  set('K20',[],['K21','K18']);                /* 探需提问 相关 邀约/价格 */
  set('K21',['K20'],['K17']);                 /* 邀约到店 前置探需 */
  set('K17',['K20'],['K_SPIN0']);             /* 场景化讲车 前置探需 */
  /* 带人辅导 */
  set('K24',[],['K25']);                      /* 带教陪访 相关 例会 */
  set('K25',[],['K24']);                      /* 例会目标 相关 带教 */
  /* CEMN 链 */
  set('K_CEMN0',[],['K_CEMN1','K_CEMN2']);
  set('K_CEMN1',['K_CEMN0'],['K_CEMN3']);
  set('K_CEMN2',['K_CEMN0'],['K_CEMN3']);
  set('K_CEMN3',['K_CEMN1','K_CEMN2'],['K_CEMN4']);
  set('K_CEMN4',['K_CEMN3'],['K_CEMN5']);
  set('K_CEMN5',['K_CEMN4'],['K_CEMN6']);
  set('K_CEMN6',['K_CEMN5'],['K_SPIN4']);
  /* SPIN 链 */
  set('K_SPIN0',['K20'],['K_SPIN1']);
  set('K_SPIN1',['K_SPIN0'],['K_SPIN2']);
  set('K_SPIN2',['K_SPIN1'],['K_SPIN3']);
  set('K_SPIN3',['K_SPIN2'],['K_SPIN4']);
  set('K_SPIN4',['K_SPIN3'],['K_CEMN6']);
}
function ciSeedSpinCourse(){
  if(S.contents.some(c=>c.id==='N_SPIN1'))return;
  const src=typeof ciSpinSampleText==='function'?ciSpinSampleText():'';
  const item=ciCourseLinkItem({name:'场景化讲车小技巧 — SPIN',link:1,courseText:src},{dept:'总部培训部'});
  if(!item)return;
  const c=cEnsure(C0(Object.assign({},item,{
    id:'N_SPIN1',ver:1,up:0,down:0,views:0,lecturer:'王磊',cover:'默认封面.png',
    chan:['汽车销售'],vis:'全国',st:'已定稿',pubSt:'已上架',pubVer:1,pubAt:addDays(today,-1)+' 09:30',
    creator:'总部培训部 刘翔',cK:'hq',rK:'hq',rName:'总部培训部 刘翔',created:addDays(today,-2),
    origin:'线下资料导入',srcFile:'场景化讲车小技巧 — SPIN',srcDept:'总部培训部',
    hist:[{t:addDays(today,-2)+' 09:30',who:'总部培训部 刘翔',act:'课程导入',note:'课程链接解析为课程骨架 + 候选知识点'}],
    kps:[],kpRole:{},mainKp:'',tags:[]
  })));
  c.body=Object.assign({},c.body,{course:true});
  S.contents.unshift(c);
  const cands=ciCourseKpSuggestions(item.title,item.body.sourceText);
  const kids=[];
  cands.forEach((x,i)=>{
    const kid='K_SPIN'+i;if(S.kps.some(k=>k.id===kid))return;
    S.kps.push({id:kid,name:x.name,type:x.type,tags:[],dim:'场景化讲车',car:'通用车型',cars:['通用车型'],syn:x.syn||[],owner:'王磊',st:'启用',ext:[],created:addDays(today,-2),hist:[{t:addDays(today,-2),who:'总部培训部 刘翔',act:'课程候选确认',note:'来自场景化讲车课程导入'}]});
    kids.push(kid);
  });
  c.kps=kids;c.mainKp=kids[0]||'';c.kpRole={};kids.forEach((kid,i)=>c.kpRole[kid]=i===0?'主讲解':'提及');
  c.vers=[{v:1,t:today,who:'总部培训部 刘翔',note:'课程导入并定稿',snap:snapOf(c)}];
  S.cimps.unshift({id:'B_SPIN',t:addDays(today,-2)+' 09:30',who:'总部培训部 刘翔',cK:'hq',files:[{name:'场景化讲车小技巧 — SPIN',size:'-'}],items:[item],bad:[],st:'已导入',nDraft:0,nStored:1,nSkip:0,cids:['N_SPIN1'],direct:true,kpCandN:kids.length});
  /* 用课程案例生成一条演练脚本：客户是三代同堂、父母腿脚不便 */
  if(!S.drills.some(d=>d.id==='D_SPIN1')&&kids[2]){
    S.drills.push({id:'D_SPIN1',kp:kids[2],name:'场景化讲车 · 三代同堂上下车',scene:'展厅',
      persona:'李先生，三代同堂，父母 70 多岁腿脚不便，女儿 5 岁，正在看 N90 Max',src:'N_SPIN1',
      turns:[{say:'我爸妈七十多了，上车得扶着，孩子还小，你觉得这车合适吗？',emo:['理解','明白'],
        must:[['电动门开口大',['90度','开口','电动门']],['电动侧踏三节台阶',['侧踏','三节','台阶']]],
        idea:[['先了解家庭情况',['一家','老人','孩子','平时']],['放大陪伴窗口期',['陪伴','出行','走不动']]],
        ref:'您看我们 N90 Max，电动门开启 90 度、开口大，您扶着叔叔阿姨上车都行；加上电动侧踏有三节台阶，老人不用弯腰，小朋友不用爬，下车脚直接落地。'}],
      st:'已定稿',owner:'王磊',created:addDays(today,-1),stat:{n:0,sum:0,pass:0}});
  }
}
function ciSeedCourse(){
  if(typeof ciCourseKpSuggestions!=='function')return;
  const md=typeof ciCourseSampleText==='function'?ciCourseSampleText():'';
  const item=ciCourseLinkItem({name:'【CEMN-购买层级诊断与推进】——讲师手册',link:1,courseText:md},{dept:'总部培训部'});
  if(!item)return;
  const c=cEnsure(C0(Object.assign({},item,{id:'N_CEMN1',ver:1,up:0,down:0,views:0,lecturer:'王磊',cover:'默认封面.png',chan:['汽车销售'],vis:'全国',st:'已定稿',pubSt:'已上架',pubVer:1,pubAt:addDays(today,-2)+' 10:00',creator:'总部培训部 刘翔',cK:'hq',rK:'hq',rName:'总部培训部 刘翔',created:addDays(today,-3),origin:'线下资料导入',srcFile:'【CEMN-购买层级诊断与推进】——讲师手册',srcDept:'总部培训部',hist:[{t:addDays(today,-3)+' 10:00',who:'总部培训部 刘翔',act:'课程导入',note:'课程链接解析为课程骨架 + 候选知识点'}],kps:[],kpRole:{},mainKp:'',tags:[]})));
  S.contents.unshift(c);
  c.body=Object.assign({},c.body,{course:true});
  const cands=ciCourseKpSuggestions(item.title,item.body.sourceText);
  const kids=[];
  cands.forEach((x,i)=>{
    const kid='K_CEMN'+i;if(S.kps.some(k=>k.id===kid))return;
    S.kps.push({id:kid,name:x.name,type:x.type,tags:[],dim:'顾虑解除',car:'通用车型',cars:['通用车型'],syn:x.syn||[],owner:'李娜',st:'启用',ext:[],created:addDays(today,-3),hist:[{t:addDays(today,-3),who:'总部培训部 刘翔',act:'课程候选确认',note:'来自 CEMN 课程导入'}]});
    kids.push(kid);
  });
  c.kps=kids;c.mainKp=kids[0]||'';c.kpRole={};kids.forEach((kid,i)=>c.kpRole[kid]=i===0?'主讲解':'提及');
  c.vers=[{v:1,t:today,who:'总部培训部 刘翔',note:'课程导入并定稿',snap:snapOf(c)}];
  S.cimps.unshift({id:'B_CEMN',t:addDays(today,-3)+' 10:00',who:'总部培训部 刘翔',cK:'hq',files:[{name:'【CEMN-购买层级诊断与推进】——讲师手册',size:'-'}],items:[item],bad:[],st:'已导入',nDraft:0,nStored:1,nSkip:0,cids:['N_CEMN1'],direct:true,kpCandN:kids.length});
}
