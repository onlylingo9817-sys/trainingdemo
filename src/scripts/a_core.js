/* ========== 基础工具 ========== */
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let S,UI,W,ME,tmr=[],toastT;
function toast(m,t){const e=$('#toast');e.textContent=m;e.className=t||'';e.style.display='block';clearTimeout(toastT);toastT=setTimeout(()=>e.style.display='none',2800)}
function openDlg(title,body,btns,wide){
  $('#dlg').className='dlg'+(wide?' w8':'');
  $('#dlg').innerHTML='<div class="hd">'+esc(title)+'<span data-act="close">✕</span></div><div class="bd">'+body+'</div>'+(btns?'<div class="ft">'+btns+'</div>':'');
  $('#mask').classList.add('show');
}
function closeDlg(){$('#mask').classList.remove('show')}
const today='2026-11-09';
const D0=new Date('2026-11-09T00:00:00');
const fmt=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const addDays=(s,n)=>{const d=new Date(s+'T00:00:00');d.setDate(d.getDate()+n);return fmt(d)};
function hsh(s){let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))%9973;return h}

/* ========== 外部数据(只读,来源已标注) ========== */
// 人员主数据:来自人事系统(入转调离)
const REG={
 '华北':{all:1860,nb:86,stores:['北京望京店','北京亦庄店','北京朝阳大悦城店','天津滨海店']},
 '华东':{all:2740,nb:132,stores:['上海徐汇店','上海浦东店','杭州西湖店','南京河西店']},
 '华南':{all:1980,nb:94,stores:['广州天河店','深圳南山店','深圳福田店']},
 '西南':{all:1210,nb:58,stores:['成都春熙路店','成都高新店','重庆观音桥店']},
 '华中':{all:1430,nb:71,stores:['武汉光谷店','郑州二七店','长沙五一店']}
};
const PEOPLE=[
['2024118','张晨','北京望京店','华北',60],['2024101','刘子涵','北京亦庄店','华北',45],['2024102','陈思远','北京朝阳大悦城店','华北',80],['2024103','赵一鸣','天津滨海店','华北',30],['2024112','马丽','北京望京店','华北',70],['2024113','郭峰','北京亦庄店','华北',400],['2023201','马俊','北京亦庄店','华北',700],['2023202','田雨','北京望京店','华北',900],
['2024104','孙雅婷','上海徐汇店','华东',55],['2024105','周凯','上海浦东店','华东',85],['2024106','吴佳怡','杭州西湖店','华东',40],['2024107','郑浩然','南京河西店','华东',65],['2023203','钱多多','上海徐汇店','华东',800],['2024114','朱琳','杭州西湖店','华东',300],
['2024111','杨帆','深圳南山店','华南',50],['2023204','黄磊','广州天河店','华南',650],['2024115','梁慧','深圳福田店','华南',75],['2024116','谢天','广州天河店','华南',20],
['2024108','王诗琪','成都春熙路店','西南',35],['2024117','唐宇','成都高新店','西南',88],['2023206','蒋欣','重庆观音桥店','西南',500],
['2024109','冯俊杰','武汉光谷店','华中',60],['2023205','林萧','郑州二七店','华中',750],['2024119','彭程','长沙五一店','华中',25],['2024120','邓超','武汉光谷店','华中',82]
].map(a=>({mid:a[0],name:a[1],store:a[2],region:a[3],hire:a[4]}));
const pp=mid=>PEOPLE.find(p=>p.mid===mid)||{mid,name:mid,store:'-',region:'-',hire:0};
const isNew=p=>p.hire<=90;
const DS=[
 ['人员主数据','人事系统(入转调离)','人员、MID、门店、区域、入职天数','培训对象范围、受训人数预估、MID 批量搜索、新人判定','每日 02:00'],
 ['北斗 BI','北斗 BI','试驾、邀约、锁单、电话量、开单(个人级)','培训目标基线、效果看板「业务结果」层、新人首月开单率','T+1'],
 ['汽车语料','汽车语料平台','会话、ASR 转写、关键词命中、行为标签','系统出题、关键词开口率、行为出现率','试驾 12 小时 / 客服 2 小时'],
 ['清河大学','清河大学','线上考试成绩、认证考试','培训结果「线上成绩」同步','实时回写'],
 ['培训内容生产专员','agent(腾讯 IM 对接)','对外洞察课题、AI 分析、关键词组','课题池(对外洞察、AI 分析)、话术关键词组','异步']
];

/* ========== 培训类型 / 指标库 / 对照方式 ========== */
const TYPES=['新品训','专题训','新人训','进阶训','入店辅导'];
const SUBS={'专题训':['强竞品','政策类','技能类·约试驾','技能类·探需','短板类']};
const tk=(t,s)=>s||t;
const OFFLINE_TYPES=['新人训','进阶训'];
const RELEASE={
 A:{n:'A. 分批推广(全国都要培训,只是分批)',way:'第二批等待期人员当第一批的对照;按门店随机分批',trust:'高',why:['对照组同期无其他培训','按门店随机分批'],r:.9},
 B:{n:'B. 报名满员,有候补',way:'报名但未排上班次的候补人员当对照',trust:'高',why:['候补人员与受训者同样积极,消除自选偏差'],r:.3},
 C:{n:'C. 灰度某城市/区域',way:'匹配对照城市:按培训前 8~12 周水平和走势推荐 2~3 个最像的城市,取平均',trust:'中',why:['对照城市前 8 周走势一致','选择偏差无法完全消除'],r:1},
 D:{n:'D. 同一批人前后对比',way:'同一批人未培训的同类内容当参照',trust:'中',why:['同一批人、同一时间,只差“培没培训”'],r:1},
 E:{n:'E. 新人训 / 上一款同期',way:'同入职天数的上一批新人,或同类型上一款上市同期',trust:'中',why:['同入职天数,避免月份不同的影响'],r:1.2},
 F:{n:'F. 入店辅导(几个人)',way:'同区域匹配的相似门店,加辅导前后自身对比',trust:'低',why:['样本太小,仅供参考'],r:0},
 G:{n:'G. 只能前后对比,没有对照',way:'无',trust:'低',why:['仅供参考,不得进入“培训有效”结论'],r:0}
};
// 指标库(配置中心维护):培训目标从这里选,口径与参数都可配置,项目提交时取快照
const IND_SEED=[
 {id:'I1',name:'关键词开口率',tpl:'① 关键词开口率',src:'汽车语料',cat:'beh',rng:[26,44],num:'命中必说关键词组的会话数',den:'触发场景会话数(客户提到触发条件)',bwin:30,dir:'高',params:[['触发条件(客户提到)','text','奔驰 GLC'],['必说关键词组','tags','同价位, 配置折算'],['命中规则','sel','任一|全部|至少 N 个'],['禁说词(选填)','tags',''],['数据范围','sel','试驾|外呼']],note:'分母是触发场景会话,不是全部会话;词库带同义词和常见误识别变体,以相对提升为准'},
 {id:'I2',name:'邀约→试驾转化比例',tpl:'② 转化比例',src:'北斗 BI',cat:'biz',rng:[32,44],num:'终点事件人数',den:'起点事件人数',bwin:30,dir:'高',params:[['起点事件','text','发出邀约'],['终点事件','text','完成试驾'],['时间窗口(天)','num','7'],['统计对象','sel','销售顾问|门店']],note:'按线索 / 客户关联起点与终点事件'},
 {id:'I3',name:'行为出现率',tpl:'③ 行为出现率',src:'汽车语料',cat:'beh',rng:[38,54],num:'出现该行为的会话数',den:'相关会话数',bwin:30,dir:'高',params:[['行为标签','sel','探需|场景化讲车|顾虑解除'],['数据范围','sel','试驾|外呼']],note:'行为标签体系由语料 AI 清洗打标'},
 {id:'I4',name:'认证 / 考试通过率',tpl:'④ 掌握度',src:'清河大学',cat:'lrn',rng:[70,86],num:'考试通过人数',den:'参加考试人数',bwin:30,dir:'高',params:[['考核方式','sel','清河大学考试|演练通关分'],['通过线(分)','num','70']],note:''},
 {id:'I5',name:'新人首月开单率',tpl:'⑤ 过程量与结果',src:'北斗 BI',cat:'biz',rng:[70,80],num:'过训后窗口内有锁单的新人数',den:'已过训新人数',bwin:30,dir:'高',params:[['开单统计窗口(天)','num','30'],['统计维度','sel','批次|班次|全量|培训周期'],['分母范围','sel','已结业新人|全部入班新人'],['离职人员','sel','剔除|保留']],note:'与现有看板「30 天人均锁单量」是不同指标,两者并存;个人级锁单取自北斗 BI lock_cnt'},
 {id:'I6',name:'试驾→锁单率',tpl:'⑤ 过程量与结果',src:'北斗 BI',cat:'biz',rng:[18,24],num:'锁单人数',den:'试驾人数',bwin:30,dir:'高',params:[['时间窗口(天)','num','14']],note:''},
 {id:'I7',name:'禁说词出现率',tpl:'① 关键词开口率',src:'汽车语料',cat:'beh',rng:[4,12],num:'出现禁说词的会话数',den:'触发场景会话数',bwin:30,dir:'低',params:[['禁说词','tags','全额退税'],['数据范围','sel','试驾|外呼']],note:'越低越好,用来防说错政策'}
];
// 培训类型默认值(配置中心维护):新建项目选了类型后,按这里带出主指标 / 辅助指标 / 对照方式 / 观察周期
const TYPE_DEF_SEED={
 '新品训':{main:'I4',aux:['I6'],rel:'E',cycle:21},
 '强竞品':{main:'I1',aux:['I6'],rel:'A',cycle:21},
 '政策类':{main:'I1',aux:['I7'],rel:'A',cycle:10},
 '技能类·约试驾':{main:'I2',aux:['I1','I6'],rel:'A',cycle:21},
 '技能类·探需':{main:'I3',aux:['I6'],rel:'A',cycle:21},
 '短板类':{main:'I3',aux:['I2'],rel:'A',cycle:21},
 '新人训':{main:'I5',aux:['I4'],rel:'B',cycle:30},
 '进阶训':{main:'I3',aux:['I4','I6'],rel:'B',cycle:30},
 '入店辅导':{main:'I6',aux:['I3'],rel:'F',cycle:14}
};
const NODE_TYPES=[
 ['学习','学习任务配置',['无','学堂内容','清河大学课程']],
 ['练习','作业任务配置',['无','有作业']],
 ['考试','考试任务配置',['无','有考试']],
 ['检核','检核任务配置',['无','有检核']],
 ['报名任务','报名任务配置',['无','清河大学报名','线下班次培训']],
 ['情景演练','情景演练任务配置',['无','有情景演练']]
];
const POSITIONS=['大区岗位','小区岗位','城市岗位','门店岗位'];

/* ========== 系统数据(从空白开始,全部由操作产生) ========== */
const CARS=['N70系列','N90 Max','N90 Max 探索版','通用车型'];const THEMES=['空间与舒适','商务与工作','亲子与家庭','户外与露营','娱乐与休闲','安全与实用','个人经济与创业','宠物出行','顾虑处理','邀约到店','政策口径','场景化讲车'];
const TAX0={car:CARS.slice(),theme:THEMES.slice(),subject:['奔驰 GLC','问界 M8','极氪 7X','特斯拉 Model Y','国补 / 地补','以旧换新','邀约试驾','探需','价格异议','展厅接待','YU7 产品','通用'],scene:['试驾','外呼','展厅','客服','不限'],ability:['探需','场景化讲车','顾虑解除','带人辅导','未指定'],aud:['新人','进阶','全员']};
const C0=o=>Object.assign({ver:1,hist:[],assets:[],refs:[],creator:'总部培训部 刘翔',cK:'hq',rK:'hq',rName:'总部培训部 刘翔',up:0,down:0,orig:1,created:'2026-09-15',st:'已定稿',pubSt:'已上架',pubVer:1,lecturer:'王磊',vis:'全国',topic:'',src:'培训部编写',srcTag:'',body:{},kw:'',script:0},o);
const SEED={
 // 学堂现有「内容管理」:话术是图文内容,本次只补「来源」「关键词组」,点赞 / 点踩挂在内容上
 contents:[
  C0({id:'N1',title:'GLC 对比话术 · 同价位配置折算',kind:'话术',type:'图文',lecturer:'王磊',script:1,src:'销冠挖掘',kw:'同价位, 配置折算, 价格折算',up:326,down:12,body:{scene:'试驾环节,客户提到「奔驰 GLC」时',lines:'理解您会拿 GLC 一起比,这是同价位里最常被比的一款。\n同样的预算,我帮您把配置折算一下:座舱、智驾、补能这几项,折下来我们多给您的价值。\n所以不是贵,是同价位您拿到的更多。您更看重哪一块?我们重点体验。'}}),
  C0({id:'N2',title:'国地补政策口径 1 页纸',kind:'话术',type:'图文',lecturer:'李娜',script:1,src:'培训部编写',kw:'国补, 地补, 叠加',up:210,down:9,body:{scene:'外呼 / 展厅,客户问国补地补怎么算时',lines:'先和您确认:国补和地补是可以叠加享受的,具体以您所在省市的最新口径为准。\n我帮您按车型和所在地算一下,叠加后实际到手价是多少。\n需要的材料我现在列给您,今天确定的话我们当场协助办理。'}}),
  C0({id:'N3',title:'邀约试驾 5 步法',kind:'课程',type:'视频',lecturer:'王磊',up:180,down:6,body:{mins:12,outline:'1. 为什么要给时间选项\n2. 邀约 5 步法\n3. 常见拒绝与应对\n4. 邀约后的提醒'}}),
  C0({id:'N4',title:'探需提问清单',kind:'课程',type:'图文',lecturer:'李娜',up:152,down:4,body:{mins:8,outline:'1. 用车场景\n2. 家庭与出行人数\n3. 预算与置换\n4. 顾虑与对比对象'}}),
  C0({id:'N5',title:'新人入职第一周实战',kind:'课程',type:'视频',lecturer:'王磊',up:480,down:5,body:{mins:40,outline:'1. 展厅接待流程\n2. 产品三分钟讲车\n3. 试驾流程与安全\n4. 首周每日打卡'}}),
  C0({id:'N6',title:'小米 YU7 产品知识手册',kind:'课程',type:'PDF',lecturer:'陈刚',up:96,down:7,body:{mins:25,outline:'1. 核心参数\n2. 卖点与场景\n3. 与竞品对比\n4. 常见问答'}})
 ],
 indicators:JSON.parse(JSON.stringify(IND_SEED)),
 kps:[],kpCand:[],mastery:{},qs:[],drills:[],ansLog:[],fbk:[],reports:[],likes:{},feedback:[],cimps:[],topics:[],insight:[],batches:[],agentCalls:[],agentDown:false,projects:[],apps:[],classes:[],results:{},learn:{},tickets:[],notices:[],
 /* ---- v23 理想态数据容器 ---- */
 dims:[],profiles:[],lrn:[],ev:{q:{},dr:{},co:{},se:{}},beh:{},out:{},mis:[],cfgV:[],packTpl:[],packs:[],trial:null,
 roles:[{name:'周丽',role:'区域老师',region:'华北'},{name:'陈磊',role:'区域老师',region:'华东'},{name:'吴芳',role:'区域老师',region:'华南'},{name:'李晓梅',role:'总部培训部',region:'全国'}],
 cfg:{limit:10,minN:200,asr:80,asrNow:86,pass:70,wOnline:40,dislikeTh:25,hitTh:20,expWarn:14,kpQ:5,banned:['最低价','保证','绝对','100%','稳赚','包退'],tax:JSON.parse(JSON.stringify(TAX0)),topicSess:300,topicStores:50,notifOff:[],typeDef:JSON.parse(JSON.stringify(TYPE_DEF_SEED)),
  /* v23 可调杠杆(「配置中心 → 评价口径」):来源权重 / 掌握度参数 / 阈值 / 观察窗口 */
  srcW:{quiz:.35,drill:.25,behavior:.30,coach:.10,self:0},behWin:4,behN:18,win:6,decay:.85,shrinkA:.6,shrinkB:.4,retestDays:3,
  weakN:3,weakR:.5,obsWeeks:4,smallN:8,corrTh:.3,funnelGate:8}
};
const ROLES=[{k:'hq',n:'总部培训部 · 刘翔',name:'刘翔',type:'hq',region:'全国'},{k:'r1',n:'区域老师 · 周丽(华北)',name:'周丽',type:'region',region:'华北'},{k:'r2',n:'区域老师 · 陈磊(华东)',name:'陈磊',type:'region',region:'华东'},{k:'boss',n:'管理层 · 老板',name:'老板',type:'boss',region:'全国'}];
const PAGES_OK={hq:['tagmanage','workbench','overview','topics','topic','content','cedit','cdetail','catalog','kp','kpform','qform','dform','publish','projects','form','detail','approvals','coach','effect','student','people','person','config'],region:['workbench','overview','topics','topic','content','cedit','cdetail','catalog','kp','kpform','qform','dform','publish','projects','form','detail','approvals','coach','effect','student','people','person'],boss:['overview','effect','student']};
function reset(){
  if(typeof clearSave==='function')clearSave();
  window.__SKIP_SAVE_UNTIL=Date.now()+800;
  tmr.forEach(clearTimeout);tmr=[];
  const _fbk=(typeof S!=='undefined'&&S&&S.fbk)?S.fbk:[];const _gd=(typeof UI!=='undefined'&&UI)?UI.gdOpen:undefined;
  S=JSON.parse(JSON.stringify(SEED));S.fbk=_fbk;
  UI={page:(ROLES[0]?'workbench':'overview'),tab:{},projId:null,ptab:'概览',sel:{},ef:null,drill:[],topic:null,role:ROLES[0],gdOpen:_gd===undefined?false:_gd};$('#roleSel')&&($('#roleSel').value='hq');
  S.contents.forEach(cEnsure);
  F=null;ME=PEOPLE[0];
  R={page:'school',pid:null,stack:[],learnTab:'学习项目'};
}
let R,F;
const proj=id=>S.projects.find(p=>p.id===id);
const role=()=>UI.role;
const canSee=p=>{const r=UI.role;if(r.type!=='region')return true;return p.aud.regions.includes(r.region)||(p.approver||'').startsWith(r.name)};
const visibleP=()=>S.projects.filter(canSee);
const myApprovals=()=>S.apps.filter(a=>{const p=proj(a.proj);if(!p||!canSee(p))return false;const r=UI.role;return r.type!=='region'||(p.approver||'').startsWith(r.name)});
const pendingFor=()=>myApprovals().filter(a=>a.status==='待审批');
const metV=(p,v)=>p.goal.main.dir==='低'?v<=p.target:v>=p.target;
const logp=(p,msg,who)=>{(p.log||(p.log=[])).unshift({t:today+' '+new Date().toTimeString().slice(0,5),who:who||UI.role.n.split(' · ')[0]+(UI.role.type==='region'?' '+UI.role.name:''),msg})};
const obsEnd=p=>{let last=p.end;S.classes.filter(k=>k.proj===p.id).forEach(k=>{if(k.date>last)last=k.date});return addDays(last,p.obsDays||30)};
const content=id=>S.contents.find(c=>c.id===id);
const ind=id=>S.indicators.find(i=>i.id===id);
const appsOf=id=>S.apps.filter(a=>a.proj===id);
const cntOk=id=>appsOf(id).filter(a=>a.status==='已通过').length;
const pendingAll=()=>S.apps.filter(a=>a.status==='待审批');
const NOTIF=[['apply','报名审批结果(通过 / 候补 / 驳回)','学员','零售通消息','审批后立即','报名、审批'],['class','分班结果发布 / 调班','学员','零售通消息','发布时','分班'],['grad','结业与成绩发布','学员','零售通消息','结业时','培训结果'],['topic','系统出题完成','总部培训部','后台通知','每双周','课题池'],['ai','课题 AI 分析完成','提出人','后台通知','agent 回传后','课题池'],['sync','项目数据同步完成(进入评估中)','项目负责人','后台通知','同步后','效果追踪'],['submit','学习项目提交 / 下发','项目负责人','后台通知','提交时','学习任务'],['review','内容审核通过 / 退回','内容创建人','后台通知','审核时','内容管理'],['retake','补考后仍未通过','区域老师','后台通知','补考出分后','培训结果'],['tai','问题 AI 分析完成 / 失败','提出人','后台通知','agent 回传后','课题池']];
function evOf(m){if(/审批结果|被驳回|候补/.test(m))return 'apply';if(/分班结果|班次已调整/.test(m))return 'class';if(/结业/.test(m))return 'grad';if(/系统出题/.test(m))return 'topic';if(/AI 分析/.test(m))return 'tai';if(/数据同步/.test(m))return 'sync';if(/内容「.*(审核|入库|发布|回炉)/.test(m))return 'review';if(/补考/.test(m))return 'retake';return 'submit'}
function notify(msg){if(S.cfg.notifOff.includes(evOf(msg)))return;S.notices.unshift({t:new Date().toTimeString().slice(0,5),m:msg});renderBell()}
function renderBell(){const n=S.notices.length;const e=$('#bellN');e.style.display=n?'block':'none';e.textContent=n}
const indUse=id=>S.projects.filter(p=>p.goal&&(p.goal.main.id===id||p.goal.aux.some(a=>a.id===id))).length;

/* ========== 指标:取数口径 / 基线(由指标定义计算,不写死) ========== */
function indParams(i){const o={};i.params.forEach(p=>{o[p[0]]=p[1]==='sel'?p[2].split('|')[0]:p[2]});return o}
function indSnap(id,vals,topic){const i=ind(id);const params=Object.assign(indParams(i),vals||{});
  if(topic){Object.keys(params).forEach(k=>{if(/关键词组/.test(k)&&topic.kw)params[k]=topic.kw;if(/触发条件/.test(k)&&topic.trig)params[k]=topic.trig})}
  return {id:i.id,name:i.name,tpl:i.tpl,src:i.src,cat:i.cat,dir:i.dir||'高',rng:i.rng,num:i.num,den:i.den,bwin:i.bwin,params,def:i.params,ver:1,note:i.note}}
function winOf(g){const w=g.params['开单统计窗口(天)']||g.params['时间窗口(天)'];return w?(+w||g.bwin):g.bwin}
function scopeTxt(cv){return cv.regions.join('、')+(cv.tag==='新人'?' · 新人':' · 全员')}
function calcBase(g,cv){const w=winOf(g);const dim=g.params['统计维度']||'';const h=hsh(g.id+cv.regions.join()+cv.tag+w+dim);return +(g.rng[0]+(g.rng[1]-g.rng[0])*((h%100)/100)).toFixed(1)}
function defText(g){const w=winOf(g);let t=g.num+' ÷ '+g.den;
  if(g.id==='I5')t='过训后 '+w+' 天内有锁单的新人 ÷ '+g.params['分母范围']+'('+g.params['统计维度']+'口径,'+g.params['离职人员']+'离职人员)';
  if(g.id==='I2')t='('+g.params['终点事件']+')人数 ÷ ('+g.params['起点事件']+')人数,时间窗口 '+g.params['时间窗口(天)']+' 天,统计对象:'+g.params['统计对象'];
  return t}

/* ========== 受训对象 / 样本 ========== */
function eligible(p,pr){if(p.gray&&p.gray.stage==='灰度中'&&pr&&!p.gray.mids.includes(pr.mid))return false;return eligibleRaw(p,pr)}
function eligibleRaw(p,pr){if(!pr||pr.region==='-')return false;if((p.mids||[]).includes(pr.mid))return true;if(p.off&&p.signup==='指定范围'&&p.offNode&&p.offNode.roster==='导入名单(MID)')return String(p.offNode.rosterMids||'').split(/[\s,，;；、]+/).includes(pr.mid);return p.aud.regions.includes(pr.region)&&(p.aud.level==='新人'?isNew(pr):true)}
function estN(aud){return aud.regions.reduce((s,r)=>s+(aud.level==='新人'?REG[r].nb:REG[r].all),0)}
function trainedN(p){return p.off&&p.signup==='报名制'?p.quota:estN(p.aud)}
const ctrlN=p=>p.rel==='F'?18:Math.round(trainedN(p)*RELEASE[p.rel].r);

/* ========== 在途任务(培训日历) ========== */
const WEEKS=[0,7,14,21,28,35].map(n=>addDays(today,n));
const weekLabel=w=>w.slice(5).replace('-','/')+' 周';
function baseLoad(store,w){return 3+hsh(store+w)%5} // 现有学习任务下发(来源:学习任务)
function projLoad(store,w,skipId){
  const reg=pp2(store);let n=0;
  S.projects.forEach(p=>{if(p.id===skipId||p.status==='草稿'||p.status==='已结项')return;if(!p.aud.regions.includes(reg))return;if(p.start<=addDays(w,6)&&p.end>=w)n++});return n}
function pp2(store){const x=PEOPLE.find(q=>q.store===store);if(x)return x.region;for(const r in REG)if(REG[r].stores.includes(store))return r;return '-'}
function loadAt(store,w,skipId){return baseLoad(store,w)+projLoad(store,w,skipId)}
function overLimit(aud,start,end){ // 新建项目叠加后是否超限
  let max=0,who='',wk='';
  aud.regions.forEach(r=>REG[r].stores.forEach(st=>WEEKS.forEach(w=>{if(start<=addDays(w,6)&&end>=w){const v=loadAt(st,w)+1;if(v>max){max=v;who=st;wk=w}}})));
  return {max,who,wk};
}

/* ---------- 持久化（E1）：只存用户可变子集，不存可从种子重算的理想态 ---------- */
const LS_KEY='trainingdemo.save.v1';
const LS_SCHEMA=1;
const LS_FIELDS=['kps','contents','qs','drills','topics','projects','apps','classes','results','learn','tickets','packs','fbk','aiLog','PTAGS','cfg','cfgV','kpCand','cimps','feedback','aiSnooze'];
function saveNow(){
  try{
    const data={schema:LS_SCHEMA,today:today,at:new Date().toISOString()};
    LS_FIELDS.forEach(k=>{if(typeof S!=='undefined'&&S&&S[k]!==undefined)data[k]=S[k]});
    localStorage.setItem(LS_KEY,JSON.stringify(data));return true;
  }catch(e){return false}
}
function loadNow(){
  try{
    const raw=localStorage.getItem(LS_KEY);if(!raw)return false;
    const data=JSON.parse(raw);
    if(!data||data.schema!==LS_SCHEMA){localStorage.removeItem(LS_KEY);return false}
    LS_FIELDS.forEach(k=>{if(data[k]!==undefined)S[k]=data[k]});
    return true;
  }catch(e){return false}
}
function clearSave(){try{localStorage.removeItem(LS_KEY)}catch(e){}}
