const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const html=()=>document.querySelector('#main').innerHTML;
const tx=()=>document.querySelector('#main').innerText;
/* t45a：核心讲解 / 核心测评题 / 过关情景演练的查看、编辑与统计 */
try{
A.roleSwitch({value:'hq'});closeDlg();A.reset();
UI.kid='K12';A.kpOpen({dataset:{id:'K12'}});
CK('详情页明确三类核心资源',/核心讲解/.test(tx())&&/核心测评题/.test(tx())&&/过关情景演练/.test(tx()));
CK('详情页说明场景不是独立对象',/场景属于演练，不单独维护“核心场景”/.test(tx()));
CK('核心讲解有直达内容编辑入口',!!document.querySelector('[data-act="cEdit"]')&&/编辑正文/.test(tx()));
const lecture=kpV12MainLecture(kp('K12'));A.cEdit({dataset:{id:lecture.id}});
CK('核心讲解在内容编辑页维护',UI.page==='cedit'&&/核心讲解/.test(tx())&&C.kpRole.K12==='主讲解');
/* 新建题默认巩固；切换为核心并定稿后才进入核心数量 */
A.qNew();QF.kp='K12';render();
CK('新建题默认巩固练习',QF.role==='练习题'&&/巩固练习（不计过关）/.test(tx())&&/核心测评（用于过关 \/ 复测）/.test(tx()));
const aq0=kpV12AnchorQn(kp('K12'));A.qfset({dataset:{k:'role'},value:'锚题'});QF.stem='Demo 核心测评：版本选择应依据什么？';QF.opts=['预算和用车需求','只看颜色','随机推荐','回避需求'];QF.ans=[0];QF.why='依据知识点的一句话定义。';A.qSave({dataset:{s:'1'}});
const nq=S.qs[S.qs.length-1];
CK('核心测评题保存有效 ID、角色和定稿状态',/^Q\d+$/.test(nq.id)&&nq.role==='锚题'&&nq.st==='已定稿',nq.id);
CK('核心题定稿后计入核心数量',kpV12AnchorQn(kp('K12'))===aq0+1);
A.qOpen({dataset:{id:nq.id}});CK('重新编辑保留核心测评角色',QF.role==='锚题'&&/核心测评（用于过关 \/ 复测）/.test(tx()));
A.qfset({dataset:{k:'role'},value:'练习题'});A.qSave({dataset:{s:'1'}});
CK('改为巩固练习后退出核心数量',qById(nq.id).role==='练习题'&&kpV12AnchorQn(kp('K12'))===aq0);
delete qById(nq.id).role;A.qOpen({dataset:{id:nq.id}});
CK('无角色旧题按巩固练习兼容',QF.role==='练习题'&&/巩固练习（不计过关）/.test(tx()));
/* 新建演练默认巩固；用途和场景都在演练编辑页保存 */
A.drNew();DF.kp='K57';render();
CK('新建演练默认巩固且场景仍属演练',DF.role==='练习演练'&&/过关情景演练（用于过关 \/ 复测）/.test(tx())&&/系统没有单独的“核心场景”对象/.test(tx()));
const ad0=kpV12AnchorDrillN(kp('K57'));A.dfset({dataset:{k:'role'},value:'锚定演练'});A.dfset({dataset:{k:'scene'},value:'试驾'});DF.name='Demo 核心价格异议演练';DF.turns[0].say='客户说别家更便宜';DF.turns[0].mustT='总拥有成本=成本,权益';DF.turns[0].ideaT='先认同=理解,明白';DF.turns[0].ref='理解您在意价格，我们一起算总拥有成本。';A.drSave({dataset:{s:'1'}});
const nd=S.drills[S.drills.length-1];
CK('过关演练保存有效 ID、角色、场景和定稿状态',/^D\d+$/.test(nd.id)&&nd.role==='锚定演练'&&nd.scene==='试驾'&&nd.st==='已定稿',nd.id);
CK('过关演练定稿后计入核心数量',kpV12AnchorDrillN(kp('K57'))===ad0+1);
A.drOpen({dataset:{id:nd.id}});CK('重新编辑保留过关角色和场景',DF.role==='锚定演练'&&DF.scene==='试驾');
A.dfset({dataset:{k:'role'},value:'练习演练'});A.drSave({dataset:{s:'1'}});
CK('改为巩固演练后退出核心数量',drById(nd.id).role==='练习演练'&&kpV12AnchorDrillN(kp('K57'))===ad0);
delete drById(nd.id).role;A.drOpen({dataset:{id:nd.id}});
CK('无角色旧演练按巩固演练兼容',DF.role==='练习演练');
/* 详情页快捷新建也维护角色，草稿不提前进入核心口径 */
UI.kid='K12';A.kpOpen({dataset:{id:'K12'}});A.kpQuizDrawer();
CK('快捷出题可选核心测评',!!document.querySelector('#dq_role')&&document.querySelector('#dq_role').value==='练习题');
document.querySelector('#dq_role').value='锚题';document.querySelector('#dq_stem').value='Demo 快捷核心题';document.querySelector('#dq_opts').value='预算和需求\n只看颜色';document.querySelector('#dq_why').value='依据定义';const quickAq=kpV12AnchorQn(kp('K12'));A.kpQuizSave();const qq=S.qs[S.qs.length-1];
CK('快捷核心题保存角色且草稿不计核心',qq.role==='锚题'&&qq.st==='草稿'&&kpV12AnchorQn(kp('K12'))===quickAq&&/^Q\d+$/.test(qq.id));
UI.kid='K57';A.kpOpen({dataset:{id:'K57'}});A.kpDrillDrawer();document.querySelector('#dd_role').value='锚定演练';document.querySelector('#dd_scene').value='外呼';document.querySelector('#dd_name').value='Demo 快捷过关演练';A.kpDrillSave();const dd=S.drills[S.drills.length-1];
CK('快捷演练保存用途和场景且草稿不计核心',dd.role==='锚定演练'&&dd.scene==='外呼'&&dd.st==='草稿'&&kpV12AnchorDrillN(kp('K57'))===ad0&&/^D\d+$/.test(dd.id));
/* 缺口与直达入口 */
UI.kid='K6';A.kpOpen({dataset:{id:'K6'}});
CK('详情展示核心缺口和新增入口',/核心题 \d+\/\d+/.test(tx())&&/过关演练 \d+\/\d+/.test(tx())&&!!document.querySelector('[data-act="kpQuizDrawer"]')&&!!document.querySelector('[data-act="kpDrillDrawer"]'));
A.qNewFor();CK('详情新增题保留知识点且默认巩固',UI.page==='qform'&&QF.kp==='K6'&&QF.role==='练习题');
UI.kid='K6';A.drNewFor();CK('详情新增演练保留知识点且默认巩固',UI.page==='dform'&&DF.kp==='K6'&&DF.role==='练习演练');
UI.kid='K12';A.kpOpen({dataset:{id:'K12'}});CK('页面无 undefined / NaN',!/undefined|NaN/.test(html()));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' | '))}
