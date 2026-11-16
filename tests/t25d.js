const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});closeDlg();
/* 1. 内容页正确落到「导入」页签，不再空白 */
A.aiGoImport();UI.page='content';UI.tab.content='导入';render();
CK('内容中心「导入」页签可渲染',/选择资料|导入内容|批次/.test(tx()),tx().slice(0,80).replace(/\n/g,' / '));
/* 2. 导入 AI 建议改为行下展开，重复检测保留 */
UI.sel.ciB=null;UI.sel.ci={files:[],text:'',link:'',dept:'',direct:false};A.ciSample();A.ciRun();UI.tab.content='导入';UI.sel.ciB=S.cimps[0].id;render();
CK('导入确认表有 AI 行下展开',document.querySelectorAll('#main tr.ci-airow').length>0,'rows='+document.querySelectorAll('#main tr.ci-airow').length);
CK('重复检测仍在业务行',/检查 · 重复/.test(tx())&&/重复：无|重复/.test(tx()));
CK('AI 建议行不被截断',document.querySelectorAll('#main tr.ci-airow .ai-cell').length>0);
/* 3. 内容编辑页 AI 检查读取表单知识点与标签 */
A.cNew({dataset:{}});C.title='测试内容';C.kind='话术';C.type='图文';C.cover='x.png';C.kps=['K4'];C.mainKp='K4';C.tags=[];render();
const rows=aiAuditContent({_form:true});
CK('链路检查能读到表单知识点',!rows.some(x=>x.t==='未挂知识点'),rows.map(x=>x.t).join('/'));
CK('链路检查能提示缺内容标签',rows.some(x=>x.t==='缺内容标签'));
A.cAiKp({dataset:{v:'K9'}});CK('内容采纳第二个知识点为提及',C.kps.includes('K9')&&C.kpRole.K9==='提及',JSON.stringify(C.kpRole));
/* 4. 页面引导和软提示 */
UI.page='catalog';UI.tab.catalog='总览';render();CK('知识点总览有 AI 找缺口入口',/AI 找缺口/.test(tx()));
UI.page='tagmanage';render();CK('标签管理有治理提示',/标签治理/.test(tx()));
UI.page='catalog';UI.tab.catalog='题库';render();CK('题库有推荐来源或空态',/推荐出题来源|没有题的知识点|AI 从话术出题/.test(tx()));
UI.tab.catalog='演练';render();CK('演练有推荐来源或空态',/推荐演练来源|技能型知识点没有演练|AI 从话术/.test(tx()));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
