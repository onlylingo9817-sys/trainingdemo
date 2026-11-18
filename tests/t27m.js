const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
UI.page='coach';UI.tab.coach='辅导总览';render();
CK('辅导总览有手动新建入口',!!document.querySelector('[data-act=coachNewManual]'));
A.coachNewManual();
CK('新建弹窗可渲染店名/目标/SOP阶段',/门店名称/.test(document.querySelector('#dlg').innerText)&&/SOP/.test(document.querySelector('#dlg').innerText));
const n0=S.tickets.length;
document.querySelector('#cm_store').value='测试门店A';document.querySelector('#cm_goal').value='留资率 40% → 45%';document.querySelector('#cm_pre').value='40';
A.coachNewManualSave();
CK('手动新建会生成辅导项目',S.tickets.length===n0+1&&S.tickets[S.tickets.length-1].store==='测试门店A','');
const x=S.tickets[S.tickets.length-1];
CK('手动新建的项目来源标注为手动',x.src==='手动新建');
CK('手动新建的项目默认在触发阶段',x.st==='触发');
x.visitDate='2026-11-09';A.coachSopLog({dataset:{id:x.id,v:'入店前两周'}});
const x2=S.tickets.find(t=>t.id===x.id);
CK('SOP 线下节点可记录',(x2.sop||[]).some(r=>r.stage==='入店前两周'),JSON.stringify((x2.sop||[]).map(r=>r.stage)));
CK('SOP 节点记录留痕',(x2.log||[]).some(l=>/SOP/.test(l.act)));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
