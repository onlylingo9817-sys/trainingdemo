/* ========== 新增学习项目(沿用现有:基础信息 / 学习模块;新增:培训类型、培训目标;任务类型各有精细配置) ========== */
const allRegions=Object.keys(REG);
const EXAM='https://edu.mioffice.cn/clientcn/exam/1599';
const CHECKS=['GLC 对比话术检核','邀约试驾检核','顾虑解除 AI 检核'];
const SCENES=['新车卖点情景演练','价格异议情景演练','竞品对比话术演练','邀约话术演练'];
const NODE_META={'学习':['书','#2b6fe0'],'练习':['笔','#7a4dd8'],'考试':['考','#e8590c'],'检核':['核','#12a36b'],'报名任务':['班','#ff6700'],'情景演练':['演','#d6336c']};
const NODE_DESC={'学习':'看内容、学课程','练习':'课后作业','考试':'清河大学考试','检核':'AI 检核话术 / 视频','报名任务':'报名 / 线下班次','情景演练':'AI 对练'};
const apprList=()=>S.roles.filter(r=>r.role==='区域老师').map(r=>r.name+'(区域老师·'+r.region+')');
const apprDef=()=>{const r=UI.role.type==='region'?{name:UI.role.name,region:UI.role.region}:S.roles.find(x=>x.role==='区域老师');return r?r.name+'(区域老师·'+r.region+')':''};
/* 字段规格:t=控件 sel/num/text/url/date/content/sel2/appr;req=必填;d=默认;show=条件显示;g=分组 */
const FS={
 '学习|学堂内容':[{k:'ref',l:'学堂内容',t:'content',req:1,full:1,h:'来自「内容管理」中审核通过的内容(话术是其中的图文内容)。点「选择」打开选择学堂内容弹窗;没有合适的先去内容管理新建或生成'},{k:'req',l:'完成条件',t:'sel',o:['按内容类型自动判定','累计学习时长达标'],d:'按内容类型自动判定',h:'图文读到末尾 / 视频看完 / PDF 翻到末页'},{k:'mins',l:'要求时长(分钟)',t:'num',d:10,show:c=>c.req==='累计学习时长达标',h:'即现有「学习时长要求」'},{k:'seq',l:'解锁方式',t:'sel',o:['自由学习','完成上一节点后解锁'],d:'自由学习'}],
 '学习|清河大学课程':[{k:'link',l:'课程链接',t:'url',req:1,full:1,v:'course',h:'清河大学课程链接,需包含 /course/课程 id'},{k:'prog',l:'完成条件',t:'sel',o:['学习进度 100%','学习进度 ≥ 80%'],d:'学习进度 100%',h:'进度由清河大学回写'},{k:'seq',l:'解锁方式',t:'sel',o:['自由学习','完成上一节点后解锁'],d:'自由学习'}],
 '学习|学习包':[{k:'tpl',l:'学习包模板',t:'sel2',opts:()=>(S.packTpl||[]).filter(t=>t.on!==false).map(t=>t.id+' · '+t.name+'（'+t.steps.map(s=>s[0]).join('→')+' · '+t.dueDays+' 天）'),req:1,full:1,h:'模板在「配置中心 → 学习包模板」维护；项目生效后为覆盖范围内每名学员生成一个学习包实例，步骤由系统证据推进'},{k:'kp',l:'针对知识点',t:'sel2',opts:()=>S.kps.filter(k=>k.st==='启用').map(k=>k.id+' '+k.name),req:1,full:1,h:'学习包的学 / 练 / 演 / 测都围绕这个知识点'},{k:'course',l:'带入课程安排',t:'sel2',opts:()=>[''].concat((S.contents||[]).filter(c=>c.kind==='课程'||c.kind==='话术').map(c=>c.id+' · '+c.title)),full:1,h:'可选。生成学习包时复制这门课的默认安排（学什么、课中、课后、演练、结业）。复制之后各改各的，不跟着课程变，也不会把配套题全部派给学员。不选则仍按模板次数抽题。'},{k:'seq',l:'解锁方式',t:'sel',o:['自由学习','完成上一节点后解锁'],d:'自由学习'}],
 '练习|有作业':[{k:'link',l:'作业链接',t:'url',req:1,full:1,v:'homework',h:'清河大学作业链接,需包含 homeworkid'},{k:'submit',l:'完成条件',t:'sel',o:['提交即完成','评阅通过才完成'],d:'评阅通过才完成'},{k:'grader',l:'评阅方',t:'sel',o:['清河大学评阅','带教师傅评阅','培训老师评阅'],d:'清河大学评阅'},{k:'pass',l:'通过分',t:'num',d:60,show:c=>c.submit==='评阅通过才完成',min:0,max:100}],
 '考试|有考试':[{k:'link',l:'考试链接',t:'url',req:1,full:1,v:'exam',h:'清河大学考试链接,需包含 /exam/考试 id'},{k:'pass',l:'及格分',t:'num',d:()=>S.cfg.pass,min:0,max:100,h:'默认取「配置中心 → 培训结果通过线」'},{k:'tries',l:'补考次数',t:'num',d:1,min:0,max:3},{k:'limit',l:'考试时限(分钟)',t:'num',d:60,min:5,max:240},{k:'unlock',l:'考试前提',t:'sel',o:['无','需先完成本模块学习任务'],d:'需先完成本模块学习任务'},{k:'late',l:'逾期处理',t:'sel',o:['逾期不可考','逾期可补考一次'],d:'逾期不可考'}],
 '检核|有检核':[{k:'ref',l:'检核任务',t:'sel2',opts:CHECKS,req:1,full:1,h:'来自「检核任务管理」'},{k:'mode',l:'检核对象',t:'sel',o:['话术录音','演练视频','实拍视频'],d:'话术录音'},{k:'std',l:'通过标准(分)',t:'num',d:80,min:0,max:100},{k:'sample',l:'人工抽检比例(%)',t:'num',d:10,min:0,max:100,h:'沿用「AI 检核抽检」'}],
 '情景演练|有情景演练':[{k:'ref',l:'演练',t:'sel2',opts:()=>(S.drills||[]).filter(d=>d.st!=='已停用').map(d=>d.id+' · '+d.name).concat(SCENES),req:1,full:1,h:'优先选演练库里的一场。旧项目里的固定剧本名仍可保留。'},{k:'kind',l:'演练类型',t:'sel',o:['情景演练','话术演练'],d:'情景演练',h:'话术演练会做关键词命中,可用于「关键词开口率」'},{k:'times',l:'最少演练次数',t:'num',d:2,min:1,max:10},{k:'pass',l:'通关分',t:'num',d:80,min:0,max:100},{k:'feedback',l:'即时点评',t:'sel',o:['开启','关闭'],d:'开启'}],
 '报名任务|清河大学报名':[{k:'link',l:'报名链接',t:'url',req:1,full:1,v:'domain',h:'只校验域名为 mioffice.cn'}],
 '报名任务|线下班次培训':[
  {g:'班次信息',k:'name',l:'班次培训名称',t:'text',req:1,full:1,d:''},{k:'hours',l:'课时',t:'text',d:'2 天'},{k:'assess',l:'考核方式',t:'sel',o:['线下评分表 + 结业考试(清河大学)','线下评分表'],d:'线下评分表 + 结业考试(清河大学)'},
  {g:'报名类型',k:'signup',l:'报名类型',t:'seg',o:['报名制','指定范围'],d:'报名制',full:1,h:'报名制:学员在零售通自己报名,需审批,满额进候补;指定范围:培训部指定名单,免报名、免审批,直接进参训名单'},{k:'roster',l:'名单来源',t:'seg',o:['按覆盖角色自动生成','导入名单(MID)'],d:'按覆盖角色自动生成',show:c=>c.signup==='指定范围',full:1,h:'自动生成:取上面「覆盖人群」范围内的人员;导入:粘贴 MID 名单(演示不做 Excel 上传)'},{k:'rosterMids',l:'参训 MID 名单',t:'text',show:c=>c.signup==='指定范围'&&c.roster==='导入名单(MID)',full:1,req:1,d:'',h:'逗号或空格分隔,如 2024101, 2024102;校验是否在人员主数据中'},{g:'报名与审批',k:'approver',l:'审批人',t:'appr',req:1,show:c=>c.signup==='报名制',d:()=>apprDef(),h:'候选为各区域的区域老师'},
  {k:'quota',l:'名额',t:'num',show:c=>c.signup==='报名制',d:30,min:1,max:500,req:1,h:'满额进入候补'},{k:'deadline',l:'报名截止',t:'date',show:c=>c.signup==='报名制',d:()=>addDays(today,5),req:1},
  {k:'waitlist',l:'候补自动递补',t:'sel',o:['开启','关闭'],d:'开启',show:c=>c.signup==='报名制',h:'有人撤销资格,按申请时间递补'},{k:'cancel',l:'撤销报名',t:'sel',o:['截止前可撤销','不可撤销'],d:'截止前可撤销',show:c=>c.signup==='报名制'},
  {g:'到课与结果',k:'sign',l:'签到方式',t:'sel',o:['学员扫班次码签到','学员在零售通点击签到'],d:'学员扫班次码签到',h:'扫码:老师在后台「分班 → 班次 → 签到码」展示 / 打印二维码,学员在零售通扫码;点击签到:学员在零售通直接点'},{k:'retake',l:'补考次数',t:'num',d:1,min:0,max:3,h:'补考后仍未过,通知区域老师'},
  {k:'passrule',l:'通过规则',t:'text',ro:1,d:()=>'总评 ≥ '+S.cfg.pass+' 分(线上 '+S.cfg.wOnline+'% + 线下 '+(100-S.cfg.wOnline)+'%)',full:1,h:'取自「配置中心 → 阈值与口径」,这里只读'},
  {g:'提醒',k:'remind',l:'开班前提醒',t:'sel',o:['不提醒','前 1 天','前 3 天'],d:'前 1 天',h:'通过零售通消息提醒已分班学员'}]
};
const RELS={'学习':['学堂内容','清河大学课程','学习包'],'练习':['有作业'],'考试':['有考试'],'检核':['有检核'],'报名任务':['清河大学报名','线下班次培训'],'情景演练':['有情景演练']};
const cfgDef=(t,rel)=>{const o={};(FS[t+'|'+rel]||[]).forEach(f=>{if(f.d!==undefined)o[f.k]=typeof f.d==='function'?f.d():f.d});return o};
const mkNode=(t,rel,patch)=>{const n={t,rel:rel||'无',cfg:{}};if(rel&&rel!=='无')n.cfg=Object.assign(cfgDef(t,rel),patch||{});return n};
const newModule=()=>({name:'',nodes:NODE_TYPES.map(t=>mkNode(t[0],'无'))});
function modOf(name,spec){const m=newModule();m.name=name;Object.keys(spec).forEach(t=>{const sp=Object.assign({},spec[t]);const rel=sp.rel;delete sp.rel;const i=m.nodes.findIndex(x=>x.t===t);m.nodes[i]=mkNode(t,rel,sp)});return m}
const sumOf=n=>{const c=n.cfg||{};
  if(n.rel==='学堂内容')return c.req==='累计学习时长达标'?'时长 ≥ '+c.mins+' 分钟':'按内容判定';
  if(n.rel==='清河大学课程')return c.prog||'';
  if(n.rel==='有作业')return c.submit==='提交即完成'?'提交即完成':'评阅 ≥ '+c.pass+' 分';
  if(n.rel==='有考试')return '及格 '+c.pass+' · 补考 '+c.tries+' 次';
  if(n.rel==='有检核')return '≥ '+c.std+' 分 · '+c.mode;
  if(n.rel==='有情景演练')return c.kind+' · '+c.times+' 次 · 通关 '+c.pass;
  if(n.rel==='学习包')return '学习包 · '+(String(c.tpl||'').split(' · ')[1]||c.tpl||'-')+(c.kp?' · '+String(c.kp).split(' ')[0]:'');
  if(n.rel==='线下班次培训')return (c.signup==='报名制'?'报名制 · 名额 '+c.quota+' · 需审批':'指定范围 · 免审批')+' · '+c.hours;
  return ''};
/* 按类型的推荐配置(什么类型配什么内容) */
const TPL={
 '新人训':[['线下班次培训',{'报名任务':{rel:'线下班次培训'}}],['入职学习与考试',{'学习':{rel:'学堂内容',ref:'N5'},'考试':{rel:'有考试',link:EXAM}}],['实战演练',{'情景演练':{rel:'有情景演练',ref:'新车卖点情景演练'}}]],
 '进阶训':[['线下班次培训',{'报名任务':{rel:'线下班次培训'}}],['课前学习与实战',{'学习':{rel:'学堂内容',ref:'N4'},'情景演练':{rel:'有情景演练',ref:'竞品对比话术演练'}}]],
 '强竞品':[['话术学习',{'学习':{rel:'学堂内容',ref:'N1'}}],['话术演练',{'情景演练':{rel:'有情景演练',ref:'竞品对比话术演练',kind:'话术演练'}}],['考核',{'检核':{rel:'有检核',ref:'GLC 对比话术检核'}}]],
 '政策类':[['政策学习',{'学习':{rel:'学堂内容',ref:'N2'}}],['政策考试',{'考试':{rel:'有考试',link:EXAM}}]],
 '技能类·约试驾':[['方法学习',{'学习':{rel:'学堂内容',ref:'N3'}}],['邀约演练与检核',{'情景演练':{rel:'有情景演练',ref:'邀约话术演练',kind:'话术演练'},'检核':{rel:'有检核',ref:'邀约试驾检核'}}]],
 '技能类·探需':[['探需学习',{'学习':{rel:'学堂内容',ref:'N4'}}],['探需演练',{'情景演练':{rel:'有情景演练',ref:'新车卖点情景演练'}}]],
 '短板类':[['短板学习',{'学习':{rel:'学堂内容',ref:'N4'}}],['AI 检核',{'检核':{rel:'有检核',ref:'顾虑解除 AI 检核'}}]],
 '新品训':[['新品学习',{'学习':{rel:'学堂内容',ref:'N6'}}],['认证考试',{'考试':{rel:'有考试',link:EXAM,pass:80}}]],
 '入店辅导':[['辅导学习',{'学习':{rel:'学堂内容',ref:'N4'}}]]
};
const TPL_WHY={'新人训':'线下班次打基础 → 线上学习考试 → 实战演练','进阶训':'线下班次 → 课前学习 + 实战对练','强竞品':'学话术 → 话术演练(带关键词命中)→ AI 检核','政策类':'学口径 → 考试验收','技能类·约试驾':'学方法 → 邀约话术演练 + 检核','技能类·探需':'学提问清单 → 情景演练','短板类':'学补短板内容 → AI 检核','新品训':'学产品知识 → 认证考试','入店辅导':'线上学习为辅,主要靠辅导工单(入店辅导菜单)'};
function tplMods(key){return (TPL[key]||TPL['政策类']).map(([n,sp])=>{const m=modOf(n,sp);const off=m.nodes.find(x=>x.t==='报名任务'&&x.rel==='线下班次培训');if(off){off.cfg.name=key.replace(/·.*/,'')+'班次培训'}return m})}
/* 类型规则:[说明,是否满足,是否必须] */
const anyN=fn=>F.stages[0].modules.some(m=>m.nodes.some(n=>n.rel!=='无'&&fn(n)));
const hasN=(t,rel)=>anyN(n=>n.t===t&&(!rel||n.rel===rel));
const hasScript=()=>anyN(n=>n.rel==='学堂内容'&&n.cfg.ref&&(content(n.cfg.ref)||{}).script);
const TYPE_RULES={
 '新人训':[['含「线下班次培训」节点',()=>hasN('报名任务','线下班次培训'),1],['含结业「考试」',()=>hasN('考试'),1],['含「情景演练」实战',()=>hasN('情景演练'),0]],
 '进阶训':[['含「线下班次培训」节点',()=>hasN('报名任务','线下班次培训'),1],['含练习或情景演练',()=>hasN('练习')||hasN('情景演练'),0]],
 '强竞品':[['含话术学习(学堂内容·话术)',hasScript,1],['含话术演练(演练类型选「话术演练」)',()=>anyN(n=>n.t==='情景演练'&&n.cfg.kind==='话术演练'),0],['含考核(考试或检核)',()=>hasN('考试')||hasN('检核'),0]],
 '政策类':[['含学堂内容',()=>hasN('学习','学堂内容'),1],['含考试验收',()=>hasN('考试'),1]],
 '技能类·约试驾':[['含学习',()=>hasN('学习'),1],['含话术演练或检核',()=>hasN('情景演练')||hasN('检核'),0]],
 '技能类·探需':[['含学习',()=>hasN('学习'),1],['含情景演练',()=>hasN('情景演练'),0]],
 '短板类':[['含学习',()=>hasN('学习'),1],['含检核',()=>hasN('检核'),0]],
 '新品训':[['含认证「考试」',()=>hasN('考试'),1],['含学习',()=>hasN('学习'),1]],
 '入店辅导':[['含学习',()=>hasN('学习'),0]]
};
const rulesOf=()=>(TYPE_RULES[tk(F.type,F.sub)]||[]).map(r=>({l:r[0],ok:!!r[1](),must:!!r[2]}));
function setPath(o,path,v){const ks=path.split('.');let c=o;for(let i=0;i<ks.length-1;i++)c=c[ks[i]];c[ks[ks.length-1]]=v}
function getPath(o,path){return path.split('.').reduce((c,k)=>c==null?c:c[k],o)}
const baseNow=()=>calcBase(F.goal.main,F.cover);
function estCover(){const a={regions:F.cover.regions,level:F.cover.tag==='新人'?'新人':'全体'};const mids=(F.cover.useMid?F.cover.mids.split(/[\s,，;；、]+/).filter(Boolean):[]);return {a,est:estN(a),mids}}
function offNodeOf(){for(const m of F.stages[0].modules)for(const n of m.nodes)if(n.t==='报名任务'&&n.rel==='线下班次培训')return n.cfg;return null}

function formInit(topic,copy,cid){
  const sug=topic&&topic.sug;
  if(copy){F=JSON.parse(JSON.stringify({name:copy.name,type:copy.type,sub:copy.sub,start:today,end:addDays(today,30),finishType:copy.finishType,finishDays:copy.finishDays,finishTime:addDays(today,45),cover:Object.assign({},copy.cover,{mids:'',useMid:false}),guide:copy.guide,stages:copy.stages,goal:copy.goal,from:null,open:null,gray:{on:false,mids:'',days:7,onTimeout:'提醒我决策'}}));F.name=(F.name+'(复制)').slice(0,15);F.goal.target=String(copy.target);F.modDirty=true;toast('已复制配置;指定 MID 不复制(与现有逻辑一致)','ok')}
  else{
   F={name:topic?(sug.sub||sug.type)+'·'+(sug.trig||topic.title.slice(0,8)):'',type:sug?sug.type:'专题训',sub:sug?sug.sub:'强竞品',start:today,end:addDays(today,30),finishType:1,finishDays:30,finishTime:addDays(today,45),cover:{tag:'全员',positions:['门店岗位'],regions:allRegions.slice(),mids:'',useMid:false},guide:'',stages:[{modules:[newModule()]}],from:topic?topic.id:null,modDirty:false,sugKw:sug?sug.kw:'',sugTrig:sug?sug.trig:'',open:null,gray:{on:false,mids:'',days:7,onTimeout:'提醒我决策'}};
   F.name=F.name.slice(0,15);applyType();
   if(topic){if(sug.ind){const kw={kw:sug.kw,trig:sug.trig};F.goal.main=indSnap(sug.ind,null,kw);F.goal.aux=S.cfg.typeDef[tk(F.type,F.sub)].aux.filter(x=>x!==sug.ind).map(id=>indSnap(id))}
    if(sug.regions&&sug.regions.length){let rg=sug.regions.slice();if(UI.role.type==='region')rg=rg.filter(r=>r===UI.role.region);F.cover.regions=rg.length?rg:F.cover.regions}
    toast('已带入课题 '+topic.id+' 的类型、主指标、关键词和区域,都可以改','ok')}
   if(cid)injectContent(cid,!topic);
  }
  UI.page='form';render();$('#main').scrollTop=0;
}
function injectContent(cid,useSug){
  const c=content(cid);if(!c)return;
  if(useSug&&c.sug){F.type=c.sug.type;F.sub=c.sug.sub||(SUBS[c.sug.type]?SUBS[c.sug.type][0]:'');F.sugKw=c.sug.kw||'';F.sugTrig=c.sug.trig||'';applyType();
    if(c.sug.ind){F.goal.main=indSnap(c.sug.ind,null,{kw:c.sug.kw,trig:c.sug.trig});F.goal.aux=S.cfg.typeDef[tk(F.type,F.sub)].aux.filter(x=>x!==c.sug.ind).map(id=>indSnap(id))}}
  const key=tk(F.type,F.sub);const t='学习';const rel='学堂内容';
  F.stages[0].modules=tplMods(key);let done=false;
  for(const m of F.stages[0].modules){const i=m.nodes.findIndex(n=>n.t===t&&n.rel!=='无');if(i>=0&&!done){m.nodes[i]=mkNode(t,rel,{ref:cid});done=true}}
  if(!done){const m=newModule();m.name='内容学习';const i=m.nodes.findIndex(n=>n.t===t);m.nodes[i]=mkNode(t,rel,{ref:cid});F.stages[0].modules.push(m)}
  F.modDirty=true;F.open=null;if(!F.name.trim()||useSug)F.name=((F.sub||F.type)+'·'+c.title).slice(0,15);
  if(!c.orig&&contentUse(c.id)===0)toast('已带入内容「'+c.title+'」。它还没被一线验证过,建议在「下发方式」里先分批灰度','ok');else toast('已带入内容「'+c.title+'」','ok')}
function applyType(){
  const key=tk(F.type,F.sub);const d=S.cfg.typeDef[key]||S.cfg.typeDef['政策类'];
  F.cover.tag=F.type==='新人训'?'新人':'全员';F.cover.regions=OFFLINE_TYPES.includes(F.type)?['华北']:allRegions.slice();if(UI.role.type==='region')F.cover.regions=[UI.role.region];
  const mid=(ind(d.main)&&ind(d.main).on!==false)?d.main:activeInds()[0].id;F.goal={main:indSnap(mid,null,F.sugKw?{kw:F.sugKw,trig:F.sugTrig}:null),aux:d.aux.filter(id=>ind(id)&&ind(id).on!==false&&id!==mid).map(id=>indSnap(id)),rel:d.rel,cycle:d.cycle,target:''};
  if(!F.modDirty){F.stages[0].modules=tplMods(key);F.open=null}
  if(F.gray&&F.gray.on)F.goal.rel='A';
}
/* ---- 页面 ---- */
const icn={base:'1',cover:'2',goal:'3',mod:'4'};
function fld(path,f,cfg){
  if(f.show&&!f.show(cfg))return '';
  const v=cfg[f.k]===undefined?'':cfg[f.k];const id=path+f.k;let inp='';
  if(f.t==='sel'||f.t==='sel2'||f.t==='appr'){const opts=f.t==='sel'?f.o:f.t==='sel2'?(typeof f.opts==='function'?f.opts():f.opts):apprList();inp='<select data-wc="fset" data-f="'+id+'">'+(f.t!=='sel'?'<option value="">请选择</option>':'')+opts.map(o=>'<option '+(String(v)===String(o)?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select>'}
  else if(f.t==='seg')inp='<div class="rels">'+f.o.map(o=>'<span class="'+(String(v)===o?'on':'')+'" data-act="fseg" data-f="'+id+'" data-v="'+o+'">'+o+'</span>').join('')+'</div>';
  else if(f.t==='content'){const sc=content(v);inp='<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button class="btn sm pri" data-act="cpick" data-f="'+id+'">'+(sc?'重新选择':'选择学堂内容')+'</button>'+(sc?'<span><b>'+esc(sc.title)+'</b> <span class="hint">ID '+sc.id+' · '+esc(sc.type)+(sc.script?' · 话术':'')+'</span></span>':'<span class="hint">未选择</span>')+'</div>';if(sc)inp+='<div class="fh">来源 '+esc(sc.origin)+' · 可见 '+esc(sc.vis)+(sc.script?' · 关键词:'+esc(sc.kw||'未设置'):'')+(!sc.orig&&contentUse(sc.id)===0?' · <b style="color:var(--warn)">首次使用,建议灰度</b>':'')+(expState(sc)==='即将到期'?' · <b style="color:var(--warn)">'+expDays(sc)+' 天后到期</b>':'')+' · 提交后锁定 v'+sc.ver+'</div>'}
  else if(f.t==='num')inp='<input type="number" data-f="'+id+'" value="'+esc(v)+'"'+(f.min!=null?' min="'+f.min+'"':'')+(f.max!=null?' max="'+f.max+'"':'')+'>';
  else if(f.t==='date')inp='<input type="date" data-wc="fset" data-f="'+id+'" value="'+esc(v)+'">';
  else inp='<input type="text" data-f="'+id+'" value="'+esc(v)+'"'+(f.ro?' disabled':'')+' placeholder="'+(f.t==='url'?'https://edu.mioffice.cn/…':'')+'">';
  return '<div class="fld '+(f.full?'full':'')+'"><label>'+(f.req?'<b>*</b>':'')+f.l+'</label>'+inp+(f.h&&f.t!=='content'?'<div class="fh">'+f.h+'</div>':f.h&&f.t==='content'&&!content(v)?'<div class="fh">'+f.h+'</div>':'')+'</div>'}
function nodePanel(mi,ni){
  const n=F.stages[0].modules[mi].nodes[ni];const meta=NODE_META[n.t];const pre='stages.0.modules.'+mi+'.nodes.'+ni+'.cfg.';
  const fs=FS[n.t+'|'+n.rel]||[];let h='<div class="np"><div class="np-h"><span class="tag" style="background:'+meta[1]+';color:#fff">'+meta[0]+'</span><h4>'+n.t+'任务配置</h4>'
   +(RELS[n.t].length>1?'<div class="rels">'+RELS[n.t].map(r=>'<span class="'+(n.rel===r?'on':'')+'" data-act="nrel" data-m="'+mi+'" data-n="'+ni+'" data-r="'+r+'">'+r+(r==='线下班次培训'?' <b style="color:var(--pri)">新</b>':'')+'</span>').join('')+'</div>':'<span class="tag blue">'+n.rel+'</span>')
   +'<span style="flex:1"></span><button class="btn sm err" data-act="nrm" data-m="'+mi+'" data-n="'+ni+'">移除此任务</button></div>';
  let grp=null,buf='';const flush=()=>{if(buf)h+='<div class="fgrid">'+buf+'</div>';buf=''};
  fs.forEach(f=>{if(f.g&&f.g!==grp){flush();grp=f.g;h+='<div class="np-g">'+f.g+'</div>'}buf+=fld(pre,f,n.cfg)});flush();
  return h+'</div>'}
function modCard(mi,m,total){
  const open=F.open&&F.open[0]===mi?F.open[1]:-1;
  const tiles=m.nodes.map((n,ni)=>{const meta=NODE_META[n.t];const on=n.rel!=='无';return '<div class="tile '+(on?'on ':'')+(open===ni?'sel':'')+'" style="--c:'+meta[1]+'" data-act="tile" data-m="'+mi+'" data-n="'+ni+'"><i>'+meta[0]+'</i><b>'+n.t+'</b><span>'+(on?esc(n.rel==='线下班次培训'?'线下班次':n.rel)+(sumOf(n)?'<br>'+esc(sumOf(n)):''):NODE_DESC[n.t]+'<br>+ 点击添加')+'</span></div>'}).join('');
  return '<div class="mod"><div class="mod-h"><span class="no">'+(mi+1)+'</span><input data-f="stages.0.modules.'+mi+'.name" value="'+esc(m.name)+'" maxlength="20" placeholder="模块名称(必填)"><button class="btn sm" '+(mi===0?'disabled':'')+' data-act="modMove" data-m="'+mi+'" data-d="-1">↑</button><button class="btn sm" '+(mi===total-1?'disabled':'')+' data-act="modMove" data-m="'+mi+'" data-d="1">↓</button><button class="btn sm err" '+(total===1?'disabled':'')+' data-act="modDel" data-m="'+mi+'">删除</button></div><div class="tiles">'+tiles+'</div>'+(open>=0?nodePanel(mi,open):'')+'</div>'}
function pgForm(){
  if(!F)formInit(null);
  const g=F.goal,m=g.main,base=baseNow(),cv=F.cover,ec=estCover();
  const oc=offNodeOf();const tn=oc&&oc.signup==='报名制'?+oc.quota||0:ec.est+ec.mids.length;const ol=overLimit(ec.a,F.start,F.end);
  const inf=interf(cv.regions,F.start,F.end,null,F.type);
  const key=tk(F.type,F.sub);const d=S.cfg.typeDef[key];const lo=m.dir==='低';
  const rules=rulesOf();const mods=F.stages[0].modules;
  const tv=parseFloat(g.target);const goalOk=!isNaN(tv)&&(lo?tv<base:tv>base);
  const gOk=!F.gray.on||(grayMids().length>0&&grayMids().length<grayPool().length&&grayMids().every(m=>grayPool().some(x=>x.mid===m)));
  const secOk={gray:gOk,base:!!F.name.trim()&&F.start<F.end,cover:cv.regions.length>0||(cv.useMid&&cv.mids.trim()),goal:goalOk,mod:rules.every(r=>r.ok||!r.must)&&mods.some(x=>x.nodes.some(n=>n.rel!=='无'))};
  const navI=(id,l,n)=>'<a class="'+(secOk[id]?'ok':'')+'" data-act="jump" data-s="'+id+'"><i>'+(secOk[id]?'✓':n)+'</i>'+l+'</a>';
  const secLabel={base:'基础信息',cover:'覆盖人群',goal:'培训目标',mod:'学习模块',gray:'下发方式'};
  const missIds=Object.keys(secLabel).filter(k=>!secOk[k]);
  const missingHtml=missIds.length?'<span class="hint" style="color:var(--warn)">还差：</span>'+missIds.map(k=>'<a class="link" data-act="jump" data-s="'+k+'" style="color:var(--warn)">'+secLabel[k]+'</a>').join('<span class="hint">、</span>'):'<span class="hint" style="color:var(--ok)">必填已完整，可以提交</span>';
  const sec=(id,n,t,hint,body)=>'<div class="card" id="sec_'+id+'"><div class="sech"><i>'+n+'</i><h3>'+t+'</h3>'+(hint?'<span class="hint">'+hint+'</span>':'')+'</div>'+body+'</div>';
  let b=crumb('<a data-act="go" data-p="projects">学习任务</a> / 新增学习项目')+'<div class="ph"><h2>新增学习项目<span class="hint">培训项目就是带「培训目标」的学习项目;配置沿用现有「基础信息 → 学习模块」,新增培训类型和培训目标</span></h2><div class="pill-row">'+(F.from?'<span class="tag pri">参考课题 '+F.from+'</span>':'')+'</div></div>';
  // 左导航 + 中 + 右
  let L='<div class="fl-nav">'+navI('base','基础信息','1')+navI('cover','覆盖人群','2')+navI('goal','培训目标','3')+navI('mod','学习模块','4')+navI('gray','下发方式','5')+'<div class="hint" style="padding:14px 12px;line-height:1.6">橙色「新」标记的是现有学习任务里没有、本次新增的配置。</div></div>';
  let M='';
  M+=sec('base','1','基础信息','','<div class="fgrid">'
   +'<div class="fld full"><label><b>*</b>项目名称</label><input type="text" data-f="name" value="'+esc(F.name)+'" maxlength="15" placeholder="不超过 15 字"><div class="fh">'+F.name.length+'/15</div></div>'
   +'<div class="fld full"><label>参考课题 <span class="tag pri">新</span></label><select data-wc="fref"><option value="">不参考(自己定)</option>'+S.topics.filter(t=>(t.flow!=='暂不做'&&canUseT(t))||t.id===F.from).sort((x,y)=>prio(y).s-prio(x).s).map(t=>'<option value="'+t.id+'" '+(F.from===t.id?'selected':'')+'>'+prio(t).k+' · '+esc(t.title)+'</option>').join('')+'</select><div class="fh">可选。选一个系统 / AI 给的问题,自动带入类型、主指标、关键词、区域;不选也能直接建。</div></div>'
   +'<div class="fld full"><label><b>*</b>培训类型 <span class="tag pri">新</span></label><div class="pill-row">'+TYPES.map(t=>'<div class="opt '+(F.type===t?'on':'')+'" data-act="ftype" data-v="'+t+'" style="min-width:140px"><b>'+t+'</b><div class="s">'+({'新品训':'线上认证 + 展厅','专题训':'线上学练考','新人训':'线下班次 + 线上考试','进阶训':'线上 + 线下班次','入店辅导':'到店辅导为主'}[t])+'</div></div>').join('')+'</div>'+(SUBS[F.type]?'<div class="pill-row" style="margin-top:10px">'+SUBS[F.type].map(s=>'<div class="opt '+(F.sub===s?'on':'')+'" data-act="fsub" data-v="'+s+'" style="padding:6px 14px">'+s+'</div>').join('')+'</div>':'')+'<div class="fh">类型决定默认的培训目标指标、对照方式,以及推荐的学习模块(取自「配置中心 → 培训类型默认值」)</div></div>'
   +'<div class="fld"><label><b>*</b>项目下发周期</label><div class="row"><input type="date" data-wc="fset" data-f="start" value="'+F.start+'"><span>~</span><input type="date" data-wc="fset" data-f="end" value="'+F.end+'"></div><div class="fh">选择时间段内进行下发,如 8.1~8.30 的新人项目,此期间入职的新人收到任务</div></div>'
   +'<div class="fld"><label><b>*</b>项目完成截止</label><div class="row"><select data-wc="fset" data-f="finishType" style="width:130px"><option value="1" '+(F.finishType===1?'selected':'')+'>灵活天数</option><option value="2" '+(F.finishType===2?'selected':'')+'>指定日期</option></select>'+(F.finishType===1?'<span>下发后</span><input type="number" data-f="finishDays" value="'+F.finishDays+'" style="width:80px"><span>天</span>':'<input type="date" data-f="finishTime" value="'+F.finishTime+'">')+'</div><div class="fh">超过截止未完成,将标记为未完成</div></div>'
   +'<div class="fld full"><label>引导语</label><textarea data-f="guide" maxlength="100" placeholder="最多不超过 100 个字">'+esc(F.guide)+'</textarea></div></div>');
  M+=sec('cover','2','覆盖人群','沿用现有「覆盖角色」','<div class="fgrid"><div class="fld"><label>岗位类型</label><div class="pill-row">'+POSITIONS.map(x=>'<label><input type="checkbox" '+(cv.positions.includes(x)?'checked':'')+' data-wc="fpos" value="'+x+'"> '+x+'</label>').join('')+'</div><div class="fh">岗位类型、渠道沿用现有字段,演示里不参与人数预估</div></div>'
   +'<div class="fld"><label>人员标签</label><div class="pill-row"><label><input type="radio" name="ftag" '+(cv.tag==='新人'?'checked':'')+' data-wc="fset" data-f="cover.tag" value="新人"> 新人(入职 ≤ 90 天)</label><label><input type="radio" name="ftag" '+(cv.tag==='全员'?'checked':'')+' data-wc="fset" data-f="cover.tag" value="全员"> 全员</label>'+ds('人员主数据')+'</div></div>'
   +'<div class="fld full"><label>门店范围(区域)</label><div class="pill-row">'+allRegions.map(r=>'<label><input type="checkbox" '+(cv.regions.includes(r)?'checked':'')+(UI.role.type==='region'&&r!==UI.role.region?' disabled':'')+' data-wc="freg" value="'+r+'"> '+r+'</label>').join('')+'</div>'+(UI.role.type==='region'?'<div class="fh">区域老师只能选本区</div>':'')+'</div>'
   +'<div class="fld full"><label><input type="checkbox" '+(cv.useMid?'checked':'')+' data-wc="fset" data-f="cover.useMid"> 另外指定 MID</label>'+(cv.useMid?'<textarea data-f="cover.mids" placeholder="MID,逗号或换行分隔">'+esc(cv.mids)+'</textarea>':'')+'</div></div>'
   +'<div class="pill-row" style="margin-top:12px"><span class="tag '+(tn<S.cfg.minN?'warn':'ok')+'">预估受训 '+tn+' 人'+(tn<S.cfg.minN?' < 样本门槛 '+S.cfg.minN+',效果只展示趋势':' ≥ 样本门槛 '+S.cfg.minN)+'</span><span class="tag '+(ol.max>S.cfg.limit?'err':'ok')+'">周期内最忙门店「'+(ol.who||'-')+'」叠加后在途 '+ol.max+' 项,'+(ol.max>S.cfg.limit?'超过':'未超过')+'上限 '+S.cfg.limit+'</span></div><div class="hint" style="margin-top:6px">覆盖范围内共 '+ec.est+' 人'+(ec.mids.length?'(另指定 MID '+ec.mids.length+' 人)':'')+';人员来自人事系统</div>');
  M+=sec('goal','3','培训目标','现有学习项目没有,本次新增;提交后锁定','<div class="src" style="margin-bottom:14px"><b>说明</b><span>指标来自「配置中心 → 指标库」,口径、参数、基线窗口都在那里配;提交后<b>目标与口径快照锁定</b>,之后改指标库不影响本项目。</span></div><div class="fgrid">'
   +'<div class="fld"><label><b>*</b>主指标</label><select data-wc="fmain">'+activeInds().concat(S.indicators.filter(x=>x.id===m.id&&x.on===false)).map(i=>'<option value="'+i.id+'" '+(m.id===i.id?'selected':'')+'>'+i.name+'('+i.src+')</option>').join('')+'</select><div class="fh">按类型「'+key+'」默认:'+ind(d.main).name+'</div></div>'
   +'<div class="fld"><label>辅助指标</label><div class="pill-row">'+activeInds().filter(i=>i.id!==m.id).map(i=>'<label><input type="checkbox" data-wc="faux" value="'+i.id+'" '+(g.aux.some(a=>a.id===i.id)?'checked':'')+'> '+i.name+'</label>').join('')+'</div><div class="fh">只展示、不设目标、不影响是否达成</div></div>'
   +'<div class="fld full"><label>统计口径 <span class="tag">快照 v'+m.ver+'</span> <span class="tag '+(lo?'warn':'')+'">'+(lo?'越低越好':'越高越好')+'</span></label><div style="background:#f7f8fa;border-radius:10px;padding:10px 14px;line-height:1.8"><b>'+m.name+'</b> '+ds(m.src)+'<br>'+defText(m)+(m.note?'<br><span class="hint">'+m.note+'</span>':'')+'</div></div>'
   +m.def.map(p=>'<div class="fld '+(p[1]==='tags'||p[1]==='text'?'full':'')+'"><label>'+(/选填/.test(p[0])?'':'<b>*</b>')+p[0].replace('(选填)','')+'</label>'+(p[1]==='sel'?'<select data-wc="fset" data-f="goal.main.params.'+p[0]+'">'+p[2].split('|').map(o=>'<option '+(m.params[p[0]]===o?'selected':'')+'>'+o+'</option>').join('')+'</select>':p[1]==='num'?'<input type="number" data-wc="fset" data-f="goal.main.params.'+p[0]+'" value="'+esc(m.params[p[0]])+'">':'<input type="text" data-f="goal.main.params.'+p[0]+'" value="'+esc(m.params[p[0]])+'">'+(p[1]==='tags'?'<div class="fh">'+(F.sugKw?'来自课题 / 话术关键词组,老师可补充':'多个词逗号分隔,可含同义词')+'</div>':''))+'</div>').join('')
   +(g.aux.length?'<div class="fld full"><label>辅助指标口径</label>'+g.aux.map(a=>'<div class="hint" style="line-height:1.8"><b>'+a.name+'</b> '+ds(a.src)+':'+defText(a)+'</div>').join('')+'</div>':'')
   +'<div class="fld"><label>基线值</label><div class="row"><b style="font-size:20px">'+base+'%</b><button class="btn sm" data-act="reBase">重新取数</button></div><div class="fh">'+m.src+' · 近 '+winOf(m)+' 天 · '+scopeTxt(cv)+(m.params['统计维度']?' · '+m.params['统计维度']+'口径':'')+';提交后锁定</div></div>'
   +'<div class="fld"><label><b>*</b>目标值(%)</label><div class="row"><input type="number" step="0.1" data-f="goal.target" value="'+esc(g.target)+'" placeholder="需'+(lo?'低于':'高于')+'基线 '+base+'%" oninput="setTimeout(A.tgt,0)" style="width:130px"><button class="btn sm" data-act="plus" data-v="5">'+(lo?'−':'+')+'5pt</button><button class="btn sm" data-act="plus" data-v="8">'+(lo?'−':'+')+'8pt</button><button class="btn sm" data-act="plus" data-v="10">'+(lo?'−':'+')+'10pt</button></div><div class="fh" id="tgtHint"></div></div>'
   +'<div class="fld"><label><b>*</b>观察周期(天)</label><input type="number" data-wc="fset" data-f="goal.cycle" value="'+esc(g.cycle)+'" style="width:130px"><div class="fh">培训结束后满 N 天再同步数据出结论,预计 '+addDays(F.end,+g.cycle||0)+'(线下以最后班次为准)</div></div>'
   +'<div class="fld"><label>对照方式</label><select data-wc="fset" data-f="goal.rel">'+Object.keys(RELEASE).map(k=>'<option value="'+k+'" '+(g.rel===k?'selected':'')+'>'+RELEASE[k].n+(d.rel===k?'(系统推荐)':'')+'</option>').join('')+'</select><div class="fh">'+RELEASE[g.rel].way+' · 可信度 '+RELEASE[g.rel].trust+(inf.length?' · <span style="color:var(--warn)">'+inf.length+' 项可能干扰,可信度下调一档</span>':'')+'</div></div></div>');
  const tplBanner=!F.modDirty?'<div class="tpl"><span style="font-size:20px">✨</span><div style="flex:1">已按「<b>'+key+'</b>」预置推荐配置:<b>'+TPL_WHY[key]+'</b>。<span class="hint">可直接用,也可以点任务卡片改配置、增删模块。</span></div></div>':'<div class="tpl" style="background:#fff;border-color:var(--bd)"><div style="flex:1" class="hint">已自定义模块。想回到「'+key+'」的推荐配置?</div><button class="btn sm" data-act="tplReset">恢复推荐配置</button></div>';
  M+=sec('mod','4','学习模块配置','阶段 → 模块 → 任务节点;点击任务卡片配置','<div class="hint" style="margin-bottom:10px">不同任务类型的配置项不同:学习看完成条件,考试看及格分与补考,检核看通过标准,演练看次数与通关分,线下班次看报名、审批、签到和通过规则。</div>'+tplBanner+mods.map((mm,mi)=>modCard(mi,mm,mods.length)).join('')+'<button class="btn" data-act="modAdd">+ 新增学习模块</button>');
  M+=formGray(sec);
  // 右侧
  let R2='<div class="fl-sum"><div class="card"><h3>实时概览</h3><dl class="kv"><dt>项目</dt><dd><b>'+(esc(F.name)||'<span class="hint">未命名</span>')+'</b></dd><dt>类型</dt><dd>'+typeTxt({type:F.type,sub:F.sub})+'</dd><dt>周期</dt><dd>'+F.start+' ~ '+F.end+'</dd><dt>覆盖</dt><dd>'+cv.regions.join('、')+' · '+cv.tag+'<br><span class="hint">预估 '+tn+' 人</span></dd><dt>目标</dt><dd>'+m.name+'<br><b>'+base+'%</b> → <b style="color:var(--pri-d)">'+(isNaN(tv)?'?':tv+'%')+'</b>'+(goalOk?' <span class="tag ok">合格</span>':'')+'</dd><dt>对照</dt><dd>'+RELEASE[g.rel].n.split('(')[0]+' · '+chip(RELEASE[g.rel].trust)+'</dd><dt>下发</dt><dd>'+(F.gray.on?'分批灰度:第一批 '+grayMids().length+' 人 · 观察 '+F.gray.days+' 天<br><span class="hint">对照批 '+Math.max(0,grayPool().length-grayMids().length)+' 人,暂不下发</span>':'一次性全量')+'</dd></dl></div>'
   +'<div class="card"><h3>类型规则检查 <span class="tag pri">'+key+'</span></h3>'+(rules.length?rules.map(r=>'<div class="chk '+(r.ok?'ok':r.must?'must':'rec')+'"><b>'+(r.ok?'✓':r.must?'!':'·')+'</b><span>'+r.l+(r.ok?'':r.must?' <span style="color:var(--err)">(必须)</span>':' <span class="hint">(建议)</span>')+'</span></div>').join(''):'<div class="hint">该类型无规则</div>')+'</div>'
   +'<div class="card"><h3>任务流程预览</h3>'+mods.map((x,i)=>'<div style="margin-bottom:10px"><div style="font-weight:600;font-size:13px">'+(i+1)+'. '+(esc(x.name)||'<span class="hint">未命名模块</span>')+'</div><div class="seq" style="margin-top:4px">'+(x.nodes.filter(n=>n.rel!=='无').map(n=>'<span class="m" style="border-left:3px solid '+NODE_META[n.t][1]+'">'+n.t+'<em>'+esc(sumOf(n)).slice(0,14)+'</em></span>').join('')||'<span class="hint">暂无任务</span>')+'</div></div>').join('')+'</div></div>';
  b+='<!--DOCK_START--><div class="dock form-dock"><div class="form-dock-state">'+missingHtml+'<span class="hint">· 提交后培训目标与口径锁定</span></div><span class="sp"></span><button class="btn" data-act="go" data-p="projects">取消</button><button class="btn pri" data-act="fsubmit">检查并提交</button></div><!--DOCK_END--><div class="fl">'+L+'<div>'+M+'</div>'+R2+'</div>';
  setTimeout(()=>A.tgt(),0);
  return b;
}
A.jump=el=>{const e=$('#sec_'+el.dataset.s);if(e)e.scrollIntoView({behavior:'smooth',block:'start'})};
A.tgt=()=>{const h=$('#tgtHint');if(!h||!F)return;const b=baseNow(),v=parseFloat(F.goal.target),lo=F.goal.main.dir==='低';if(isNaN(v)){h.textContent='';return}const ok=lo?v<b:v>b;h.textContent=ok?'较基线 '+(v>b?'+':'')+(v-b).toFixed(1)+'pt':'需'+(lo?'低于':'高于')+'基线 '+b+'%';h.className='fh'+(ok?'':' err')};
document.addEventListener('input',e=>{const el=e.target;if(el.dataset&&el.dataset.f&&F){setPath(F,el.dataset.f,el.value);if(/modules\.\d+\./.test(el.dataset.f))F.modDirty=true}});
A.fset=el=>{let v=el.value;const f=el.dataset.f;if(f==='finishType')v=+v;if(f==='cover.useMid')v=el.checked;setPath(F,f,v);if(/modules/.test(f))F.modDirty=true;render()};
A.tile=el=>{const mi=+el.dataset.m,ni=+el.dataset.n;const n=F.stages[0].modules[mi].nodes[ni];
  if(n.rel==='无'){const rel=RELS[n.t][RELS[n.t].length>1&&n.t==='报名任务'&&OFFLINE_TYPES.includes(F.type)?1:0];F.stages[0].modules[mi].nodes[ni]=mkNode(n.t,rel,rel==='线下班次培训'?{name:F.type+'班次培训'}:{});F.modDirty=true}
  F.open=(F.open&&F.open[0]===mi&&F.open[1]===ni&&n.rel!=='无')?null:[mi,ni];render()};
A.fseg=el=>{setPath(F,el.dataset.f,el.dataset.v);F.modDirty=true;render()};
A.nrel=el=>{const mi=+el.dataset.m,ni=+el.dataset.n;const n=F.stages[0].modules[mi].nodes[ni];if(n.rel===el.dataset.r)return;F.stages[0].modules[mi].nodes[ni]=mkNode(n.t,el.dataset.r,el.dataset.r==='线下班次培训'?{name:F.type+'班次培训'}:{});F.modDirty=true;render()};
A.nrm=el=>{const mi=+el.dataset.m,ni=+el.dataset.n;const n=F.stages[0].modules[mi].nodes[ni];F.stages[0].modules[mi].nodes[ni]=mkNode(n.t,'无');F.open=null;F.modDirty=true;render()};
A.tplReset=()=>{F.modDirty=false;F.stages[0].modules=tplMods(tk(F.type,F.sub));F.open=null;render();toast('已恢复推荐配置','ok')};
A.ftype=el=>{F.type=el.dataset.v;F.sub=SUBS[F.type]?SUBS[F.type][0]:'';F.sugKw='';applyType();render()};
A.fsub=el=>{F.sub=el.dataset.v;F.sugKw='';applyType();render()};
A.fpos=el=>{const c=F.cover;c.positions=el.checked?[...new Set([...c.positions,el.value])]:c.positions.filter(x=>x!==el.value)};
A.freg=el=>{const c=F.cover;c.regions=el.checked?[...new Set([...c.regions,el.value])]:c.regions.filter(x=>x!==el.value);render()};
A.fmain=el=>{const keepAux=F.goal.aux.map(a=>a.id).filter(x=>x!==el.value);F.goal.main=indSnap(el.value,null,F.sugKw?{kw:F.sugKw,trig:F.sugTrig}:null);F.goal.aux=keepAux.map(id=>indSnap(id));F.goal.target='';render()};
A.faux=el=>{if(el.checked)F.goal.aux.push(indSnap(el.value));else F.goal.aux=F.goal.aux.filter(a=>a.id!==el.value);render()};
A.plus=el=>{const lo=F.goal.main.dir==='低';F.goal.target=String(+(baseNow()+(lo?-1:1)*parseFloat(el.dataset.v)).toFixed(1));render()};
A.reBase=()=>{toast('已按当前口径和覆盖范围重新取数:'+baseNow()+'%('+F.goal.main.src+')','ok');render()};
A.modAdd=()=>{F.stages[0].modules.push(newModule());F.modDirty=true;F.open=[F.stages[0].modules.length-1,0];render()};
A.modDel=el=>{F.stages[0].modules.splice(+el.dataset.m,1);F.modDirty=true;F.open=null;render()};
A.modMove=el=>{const a=F.stages[0].modules,i=+el.dataset.m,j=i+ +el.dataset.d;const t=a[i];a[i]=a[j];a[j]=t;F.open=null;render()};
A.fref=el=>{if(!el.value){F.from=null;render();return}const t=topic(el.value);const sug=t.sug;F.from=t.id;F.type=sug.type;F.sub=sug.sub;F.sugKw=sug.kw;F.sugTrig=sug.trig;applyType();
  if(sug.ind){F.goal.main=indSnap(sug.ind,null,{kw:sug.kw,trig:sug.trig});F.goal.aux=S.cfg.typeDef[tk(F.type,F.sub)].aux.filter(x=>x!==sug.ind).map(id=>indSnap(id))}
  if(sug.regions&&sug.regions.length){let rg=sug.regions.slice();if(UI.role.type==='region')rg=rg.filter(r=>r===UI.role.region);if(rg.length)F.cover.regions=rg}
  if(!F.name.trim())F.name=((sug.sub||sug.type)+'·'+(sug.trig||t.title.slice(0,8))).slice(0,15);
  render();toast('已带入课题 '+t.id+' 的类型、主指标、关键词和区域,都可以改','ok')};
A.formNew=()=>{if(!['hq','region'].includes(UI.role.type))return toast('当前身份不能新增学习项目','err');formInit(null)};
A.overOk=()=>{const r=$('#ovr').value.trim();if(!r)return toast('请填写超限原因','err');F.overReason=r;closeDlg();A.fsubmit()};
/* ---- 校验 / 编译 / 提交 ---- */
function formCheck(){
  const fail=(m,sec,open)=>{toast(m,'err');if(open)F.open=open;if(open)render();const e=$('#sec_'+sec);if(e)e.scrollIntoView({block:'start',behavior:'smooth'});return false};
  if(!F.name.trim())return fail('请输入项目名称','base');
  if(F.start>=F.end)return fail('项目下发周期:结束时间需晚于开始时间','base');
  if(F.finishType===1&&!(+F.finishDays>0))return fail('请输入项目完成截止时间(正整数天)','base');
  if(!F.cover.regions.length&&!(F.cover.useMid&&F.cover.mids.trim()))return fail('请至少选择一个区域或指定 MID','cover');
  const g=F.goal,b=baseNow(),v=parseFloat(g.target);
  if(isNaN(v))return fail('请填写目标值,没有目标无法提交','goal');
  if(g.main.dir==='低'?v>=b:v<=b)return fail('目标值需优于基线 '+b+'%('+(g.main.dir==='低'?'该指标越低越好,需低于基线':'该指标越高越好,需高于基线')+')','goal');
  if(!(+g.cycle>0))return fail('请填写观察周期(天)','goal');
  for(const p of g.main.def){if(/选填/.test(p[0]))continue;if(!String(g.main.params[p[0]]||'').trim())return fail('请填写「'+p[0]+'」','goal')}
  let cnt=0;const mods=F.stages[0].modules;
  for(const [mi,m] of mods.entries()){
    if(!m.name.trim())return fail('请输入学习模块'+(mi+1)+'的名称','mod');
    for(const [ni,n] of m.nodes.entries()){if(n.rel==='无')continue;cnt++;const c=n.cfg;const at=[mi,ni];
      for(const f of (FS[n.t+'|'+n.rel]||[])){if(f.show&&!f.show(c))continue;const val=c[f.k];
        if(f.req&&!String(val==null?'':val).trim())return fail('「'+m.name+' · '+n.t+'」请填写「'+f.l+'」','mod',at);
        if(f.t==='url'&&val){if(!/mioffice\.cn/.test(val))return fail('「'+n.t+'」请填写正确的清河大学链接(域名需为 mioffice.cn)','mod',at);
          if(f.v==='course'&&!/\/course\/\d+/.test(val))return fail('清河大学课程链接不存在 id 字段(需包含 /course/数字)','mod',at);
          if(f.v==='exam'&&!/\/exam\/\d+/.test(val))return fail('清河大学考试链接不存在 id 字段(需包含 /exam/数字)','mod',at);
          if(f.v==='homework'&&!/homeworkid=/.test(val))return fail('清河大学作业链接不存在 homeworkid 字段','mod',at)}
        if(f.t==='num'&&val!==''&&val!=null){const x=+val;if(isNaN(x)||(f.min!=null&&x<f.min)||(f.max!=null&&x>f.max))return fail('「'+n.t+'」'+f.l+' 需在 '+(f.min!=null?f.min:'')+'~'+(f.max!=null?f.max:'')+' 之间','mod',at)}}
      if(n.rel==='线下班次培训'&&c.signup==='指定范围'&&c.roster==='导入名单(MID)'){const ms=String(c.rosterMids||'').split(/[\s,，;；、]+/).filter(Boolean);if(!ms.length)return fail('指定范围:请填写参训 MID 名单','mod',at);const bad=ms.filter(x=>!PEOPLE.some(p=>p.mid===x));if(bad.length)return fail('MID 不在人员主数据中:'+bad.join('、'),'mod',at)}
      if(n.rel==='线下班次培训'&&c.signup==='报名制'){if(c.deadline>F.end)return fail('报名截止需早于项目下发周期结束','mod',at);if(c.deadline<F.start)return fail('报名截止需晚于项目下发周期开始(报名在项目生效后开放)','mod',at)}}}
  if(!cnt)return fail('请至少配置一个学习任务节点','mod');
  if(F.gray.on){const ms=grayMids(),pool=grayPool();
    if(!ms.length)return fail('分批灰度:请选择第一批人群(评审团 / 试点)','gray');
    const bd=ms.filter(m=>!pool.some(x=>x.mid===m));if(bd.length)return fail('第一批里有不在覆盖人群中的 MID:'+bd.join('、'),'gray');
    if(ms.length>=pool.length)return fail('第一批不能是全部覆盖人群,需要留出对照批','gray');
    if(!(+F.gray.days>0))return fail('请填写灰度观察天数(正整数)','gray')}
  const bad=rulesOf().find(r=>r.must&&!r.ok);if(bad)return fail('「'+tk(F.type,F.sub)+'」类型必须:'+bad.l,'mod');
  return true;
}
function compile(p){
  p.nodes=[];p.offNode=null;let k=0;
  p.stages.forEach((st,si)=>st.modules.forEach((m,mi)=>m.nodes.forEach(n=>{if(n.rel==='无')return;const c=n.cfg||{};
    const o={id:'T'+(++k),t:n.t,rel:n.rel,module:m.name,mi,cfg:c,sum:sumOf(n)};
    if(n.rel==='学堂内容'){o.contentId=c.ref;const cc=content(c.ref);o.name=(cc||{title:n.t}).title;o.contentVer=cc?cc.ver:1;if(cc&&cc.vers&&cc.vers.length){const vv=cc.vers.find(x=>x.v===cc.ver)||cc.vers[cc.vers.length-1];o.contentVer=vv.v;o.snap=JSON.parse(JSON.stringify(vv.snap))}}
    else if(c.link)o.name='清河大学'+n.t+'('+(String(c.link).match(/(\d{3,}|homeworkid=\w+)/)||[''])[0].slice(0,10)+')';
    else if(n.rel==='学习包'){o.name='学习包 · '+(String(c.tpl||'').split(' · ')[1]||String(c.tpl||''));o.packTpl=String(c.tpl||'').split(' · ')[0];o.packKp=String(c.kp||'').split(' ')[0]}
    else if(n.rel==='线下班次培训'){o.name=c.name;o.offline=1;p.offNode=c}
    else o.name=c.ref||n.t;
    p.nodes.push(o)})));
  p.off=!!p.offNode;
  if(p.off){const o=p.offNode;p.roster=o.roster;p.signup=o.signup;p.quota=+o.quota||30;p.deadline=o.deadline;p.approver=o.approver;p.offName=o.name}
}
A.fsubmit=()=>{if(!formCheck())return;
  const ec=estCover();const tn=ec.est+ec.mids.length;const g=F.goal;const main=g.main;
  openDlg('提交前确认','<div style="line-height:1.9;font-size:13.5px">'
   +'<div><b>项目</b>：'+esc(F.name||'未命名')+'</div>'
   +'<div><b>类型</b>：'+esc(tk(F.type,F.sub))+'</div>'
   +'<div><b>周期</b>：'+F.start+' ~ '+F.end+'</div>'
   +'<div><b>覆盖</b>：'+esc(F.cover.regions.join('、')||'—')+' · 预估 '+tn+' 人</div>'
   +'<div><b>目标</b>：'+esc(main.name)+' '+baseNow()+'% → <b>'+esc(F.goal.target||'?')+'%</b></div>'
   +'<div><b>下发</b>：'+(F.gray.on?'分批灰度（第一批 '+grayMids().length+' 人）':'一次性全量')+'</div>'
   +'<div class="hint" style="margin-top:8px">提交后培训目标与评价口径会锁定；如需修改，要走「目标变更申请」。请确认以上信息无误。</div></div>',
   '<button class="btn" data-act="close">返回检查</button><button class="btn pri" data-act="fsubmitOk">确认提交</button>');
};
A.fsubmitOk=()=>{closeDlg();
  const ec=estCover();const ol0=overLimit(ec.a,F.start,F.end);
  if(ol0.max>S.cfg.limit&&!F.overReason){openDlg('在途任务超限','<div style="margin-bottom:10px">周期内门店「'+ol0.who+'」叠加后在途任务 <b>'+ol0.max+'</b> 项,超过上限 <b>'+S.cfg.limit+'</b>(配置中心)。可调整项目下发周期,或填写原因后继续提交(留痕)。</div><div class="f"><label><b>*</b>超限原因</label><div class="in"><textarea id="ovr" placeholder="如:新车上市培训,总部要求同期完成"></textarea></div></div>','<button class="btn" data-act="close">返回修改</button><button class="btn pri" data-act="overOk">继续提交</button>');return}
  const g=F.goal;const base=baseNow();const id='P'+(S.projects.length+1);
  const main=JSON.parse(JSON.stringify(g.main));
  const p={id,name:F.name,type:F.type,sub:F.sub,status:F.start<=today?'已生效':'未生效',start:F.start,end:F.end,finishType:F.finishType,finishDays:+F.finishDays,finishTime:F.finishTime,cover:JSON.parse(JSON.stringify(F.cover)),mids:ec.mids,aud:{regions:F.cover.regions.slice(),level:F.cover.tag==='新人'?'新人':'全体'},guide:F.guide,stages:JSON.parse(JSON.stringify(F.stages)),
   goal:{main,aux:JSON.parse(JSON.stringify(g.aux)),rel:g.rel,cycle:g.cycle,base,baseSrc:main.src+' · 近 '+winOf(main)+' 天 · '+scopeTxt(F.cover)},
   metric:main.name,unit:'%',base,baseSrc:main.src+' · 近 '+winOf(main)+' 天 · '+scopeTxt(F.cover),target:parseFloat(g.target),cur:null,tpls:[main.tpl].concat(g.aux.map(a=>a.tpl)),params:main.params,rel:g.rel,cycle:g.cycle,owner:UI.role.type==='region'?UI.role.name+'(区域老师·'+UI.role.region+')':'刘翔(总部培训部)',created:today,from:F.from,classPub:false,obsDays:+g.cycle,overReason:F.overReason||''};
  if(F.gray.on){p.gray={mids:grayMids(),days:+F.gray.days,onTimeout:F.gray.onTimeout,stage:'灰度中',startedAt:F.start>today?F.start:today,reminded:[]};p.rel='A';p.goal.rel='A'}
  compile(p);S.projects.unshift(p);logp(p,'提交学习项目,培训目标「'+p.metric+' '+p.base+'% → '+p.target+'%」已锁定'+(p.overReason?'(在途超限,原因:'+p.overReason+')':'')+(p.gray?';分批灰度:第一批 '+p.gray.mids.length+' 人,观察 '+p.gray.days+' 天,对照批暂不下发':''));afterPublish(p);F=null;UI.projId=id;UI.ptab='概览';UI.page='detail';render();$('#main').scrollTop=0;
  toast('提交成功。培训目标与口径已锁定'+(p.status==='未生效'?';到下发周期开始后下发':p.gray?';任务已下发给第一批 '+p.gray.mids.length+' 人,对照批暂不下发':';任务已下发到零售通'),'ok')};
function afterPublish(p){
  if(p.from){const t=S.topics.find(x=>x.id===p.from);if(t){t.flow='已采纳';t.proj=p.id;thist(t,UI.role.n.split(' · ')[0],'建了学习项目','项目 '+p.id+'「'+p.name+'」,目标 '+p.metric+' '+p.base+'% → '+p.target+'%')}}
  if(p.status==='已生效'&&typeof packEnsure==='function')(p.nodes||[]).filter(n=>n.rel==='学习包').forEach(n=>{const n0=S.packs.length;PEOPLE.filter(x=>eligible(p,x)).forEach(x=>packEnsure(p,n,x.mid));const n1=S.packs.length-n0;if(n1)notify('学习项目「'+p.name+'」：已为 '+n1+' 名覆盖学员生成学习包')});
  if(p.off&&p.signup==='指定范围'){const o=p.offNode;const ms=o.roster==='导入名单(MID)'?String(o.rosterMids||'').split(/[\s,，;；、]+/).filter(Boolean):PEOPLE.filter(x=>eligible(p,x)).map(x=>x.mid);ms.forEach(m=>S.apps.push({id:'A'+m+p.id,proj:p.id,mid:m,time:today+' 09:00',status:'已通过',src:o.roster==='导入名单(MID)'?'导入名单(免审)':'范围选择(免审)'}))}
  notify('学习项目「'+p.name+'」已提交'+(p.off?(p.signup==='报名制'?',覆盖范围内学员可在零售通报名':',参训名单已按范围生成'):',任务已下发'));
}
function interf(regions,start,end,skipId,type){
  const out=[];S.projects.forEach(p=>{if(p.id===skipId||['已结项','已下线'].includes(p.status))return;if(p.aud.regions.some(r=>regions.includes(r))&&p.start<=end&&p.end>=start)out.push('同期「'+p.name+'」也在培训同区域人员,可能叠加')});
  if(type==='新品训')out.push('观察期内有新车上市,可能干扰');return out}
