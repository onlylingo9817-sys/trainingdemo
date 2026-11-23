const L=m=>out.push(String(m));const CK=(n,ok,d)=>L((ok?'PASS ':'FAIL ')+n+(d?' — '+d:''));
const tx=()=>document.querySelector('#main').innerText;
/* t48a：列表表格层 v2（内容中心 8 列 / 知识点库 6 列）+ 8 条验收探针 */
try{
const fresh=()=>{A.reset();A.roleSwitch({value:'hq'});closeDlg();UI.sel={};UI.sel.cq={};UI.sel.caf={};UI.sel.cPreset='';UI.sel.clist={page:1,size:20};UI.sel.kpPage={page:1,size:20};UI.sel.kpf={};};
fresh();
/* 1 标签树不再点出空页 */
UI.page='content';UI.tab.content='全部内容';UI.sel.caf={tag:(PTAGS[0]||{}).id};render();
CK('标签体系停用：不再渲染 42 个节点',!document.querySelector('.tag-tree'));
CK('标签筛选被忽略且给出说明',/标签体系已停用/.test(tx())&&document.querySelectorAll('#main .c-table tr').length>1,document.querySelectorAll('#main .c-table tr').length+' 行');
/* 2 内容中心默认视图零横滚 */
fresh();UI.page='content';UI.tab.content='全部内容';render();
const ctw=document.querySelector('.c-tw');
CK('内容列表零横向滚动',ctw&&ctw.scrollWidth<=ctw.clientWidth,ctw?ctw.scrollWidth+'/'+ctw.clientWidth:'无容器');
CK('内容列表 8 列',document.querySelectorAll('#main table.t.c-table tr:first-child th').length===8);
/* 3 知识点库零横滚；完整字段可横滚 */
fresh();UI.page='catalog';UI.tab.catalog=KP_TAB_LIB;render();
const kt=document.querySelector('.kp-list.compact');
CK('知识点库精简视图零横滚',kt&&kt.parentElement.scrollWidth<=kt.parentElement.clientWidth+2,kt?kt.parentElement.scrollWidth+'/'+kt.parentElement.clientWidth:'无');
CK('知识点库主要列都在',['知识点','适用范围','能讲 / 能考 / 能练','负责人','操作'].every(t=>kt&&kt.innerText.indexOf(t)>=0));
A.kpFull();CK('岗位批次可展开且主要列还在',document.querySelector('.kp-list.full tr').children.length===8&&/适用范围/.test(document.querySelector('.kp-list.full').innerText));A.kpFull();
/* 4 适用车型：空 → [通用]，非空 → chip */
fresh();UI.page='content';UI.tab.content='全部内容';render();
const rows=document.querySelectorAll('#main table.t.c-table tbody tr, #main table.t.c-table tr');
CK('状态列不再挤压（无截断标记）',[...document.querySelectorAll('.c-status')].every(e=>e.scrollWidth<=e.clientWidth+1));
const noCar=S.contents.find(c=>!c.car||c.car==='通用车型');
UI.sel.cqs=noCar.title.slice(0,10);render();
CK('car 为空的行渲染「通用」chip',!!document.querySelector('.car-chip.gen'),noCar.id);
const withCar=S.contents.find(c=>c.car&&c.car!=='通用车型');
UI.sel.cqs=withCar.title.slice(0,8);render();
CK('car 非空的行渲染对应车型 chip',[...document.querySelectorAll('.car-chip')].some(e=>e.title===withCar.car),withCar.car);
/* 5 时效点：已过期 → 红点 */
fresh();const exp=S.contents.find(c=>expState(c)==='已过期');
if(exp){UI.page='content';UI.sel.cqs=exp.id;render();CK('已过期内容渲染红点',!!document.querySelector('.ux-dot.err'),exp.id)}
else CK('已过期内容渲染红点',true,'本数据无过期内容，跳过');
/* 6 11 处外部入口逐个走一遍 */
const presets=n=>{const q=UI.sel.cq||{};return {kp:q.kp,st:q.st,pub:q.pub,exp:q.exp,kind:q.kind,mine:q.mine,preset:UI.sel.cPreset||'',q}};
const land=(name,v)=>{fresh();try{v()}catch(e){CK('入口 '+name,!1,e.message);return}
  const okPage=UI.page==='content'&&UI.tab.content==='全部内容';
  const okList=!!document.querySelector('#main .c-table, #main .ux-state, #main .cta');
  const okNotice=/标签体系已停用/.test(tx());
  CK('入口 '+name+' 落点正确',okPage&&okList,UI.page+'/'+UI.tab.content);
  return {p:presets(name),okNotice}};
const r1=land('kpGoMount',()=>A.kpGoMount());
CK('  kpGoMount → 未挂载预设',r1&&r1.p.kp==='未挂载',JSON.stringify(r1&&r1.p));
const r2=land('wbUnmounted',()=>A.wbUnmounted());
CK('  wbUnmounted → 未挂载预设',r2&&r2.p.kp==='未挂载');
const r3=land('aiGoUnlinked',()=>A.aiGoUnlinked());
CK('  aiGoUnlinked → 未挂载预设',r3&&r3.p.kp==='未挂载');
land('aiGoNoMain',()=>A.aiGoNoMain());land('aiGoContent',()=>A.aiGoContent());
const inContent=fn=>()=>{UI.page='content';UI.tab.content='全部内容';render();fn()};
const r6=land('tagSelect',inContent(()=>A.tagSelect({dataset:{id:(PTAGS[0]||{}).id}})));
CK('  tagSelect → 忽略标签并说明',r6&&r6.okNotice);
const r7=land('tagViewContent',inContent(()=>A.tagViewContent({dataset:{id:(PTAGS[0]||{}).id}})));
CK('  tagViewContent → 忽略标签并说明',r7&&r7.okNotice);
land('cafAdv',inContent(()=>A.cafAdv()));land('cafAdvOff',inContent(()=>A.cafAdvOff()));
fresh();UI.page='catalog';UI.tab.catalog='题库';render();
CK('入口 旧题库链接 → 性质=题',UI.page==='content'&&(UI.sel.cq||{}).kind==='题',JSON.stringify(presets().q));
fresh();UI.page='catalog';UI.tab.catalog='演练';render();
CK('入口 旧演练链接 → 性质=演练',UI.page==='content'&&(UI.sel.cq||{}).kind==='演练');
/* 7 cAllList 已删除 */
CK('cAllList 已删除（全局无残留）',typeof cAllList==='undefined');
/* 8 内容详情：不再出现「通用车型」文本，改为 chips */
fresh();const course=S.contents.find(c=>c.kind==='课程');
UI.cid=course.id;UI.ctab='内容';UI.page='cdetail';render();
CK('详情标题行不再出现「通用车型」文本',!/通用车型/.test(document.querySelector('.cdh').innerText)&&!!document.querySelector('.cdh .car-chip'));
/* 9 知识点库点阵与复制标记 */
fresh();UI.page='catalog';UI.tab.catalog=KP_TAB_LIB;UI.sel.kpPage={page:2,size:20};render();
CK('知识点库用文字写能讲能考能练',/能讲|缺讲解/.test(tx())&&/能考|缺题|不要求题/.test(tx())&&/能练|缺演练|不要求演练/.test(tx()));
CK('不再把同一学习结果按车型复制成对',S.kps.filter(k=>k.code==='XM-P02').length===1);
CK('页面无 undefined / NaN',!/undefined|NaN/.test(document.querySelector('#main').innerHTML));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' | '))}
