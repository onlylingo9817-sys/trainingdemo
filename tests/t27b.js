const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
/* t27b:v1.2 内容编辑的知识点推荐 / AI 建议位置 */
try{
A.roleSwitch({value:'hq'});closeDlg();
A.cNew({dataset:{}});C.kind='话术';C.title='露营外放电 · 电磁炉和电水壶';C.bscene='露营时客户问能不能用电';C.spin={S:'周末露营',P:'没电不方便',I:'影响体验',N:'6.6kW 外放电'};C.cover='x.png';render();
CK('内容编辑有知识点搜索框',!!document.querySelector('#cp_kl'));
CK('内容编辑有 AI 建议块',!!document.querySelector('#cKpAdv'));
CK('AI 建议块有依据入口',!!document.querySelector('#cKpAdv [data-act=aiWhy]')||/可解释规则/.test(document.querySelector('#cKpAdv').innerText));
CK('AI 建议不会挤成多行竖排',!document.querySelector('#cKpAdv .ai-sug')||getComputedStyle(document.querySelector('#cKpAdv .ai-sug')).display==='flex');
A.aiWhy();CK('有“为什么这样建议”解释',/可解释规则/.test((document.querySelector('#dlg')||{}).innerText||''));closeDlg();
UI.page='coach';UI.tab.coach='辅导总览';render();CK('入店辅导有引导文案',/学 → 练 → 检 → 用 → 馈/.test(tx()));
const ov=document.querySelector('.coach-board');CK('辅导卡不横向溢出',!ov||ov.scrollWidth<=ov.clientWidth+2,(ov?ov.scrollWidth+'/'+ov.clientWidth:'none'));
const x=S.tickets.find(t=>t.st==='触发');A.tPlan({dataset:{id:x.id}});CK('计划弹窗打开',!!document.querySelector('#dlg')&&/保存计划/.test(document.querySelector('#dlg').innerText));closeDlg();
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
