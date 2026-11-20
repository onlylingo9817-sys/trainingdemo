const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS':'FAIL ')+' '+name+(detail?' — '+detail:''));
try{
A.reset();A.roleSwitch({value:'hq'});closeDlg();
UI.gdOpen=true;gdRender();
CK('体验任务面板有「我卡住了」入口',!!document.querySelector('[data-act="stuck"]'));
UI.page='workbench';render();
A.stuck();
const dlg=document.querySelector('#dlg').innerText;
CK('卡住弹窗显示当前位置',/工作台/.test(dlg));
CK('卡住弹窗给出本页说明',/待办/.test(dlg));
CK('卡住弹窗给出可执行的下一步',/接下来可以做这几步/.test(dlg));
CK('卡住弹窗能进写反馈',!![...document.querySelectorAll('#dlg [data-act]')].find(x=>x.dataset.act==='fbkOpen'));
closeDlg();
A.end({dataset:{v:'rn'}});
A.stuck();
const dlg2=document.querySelector('#dlg').innerText;
CK('零售通侧也能打开卡住弹窗',/零售通/.test(dlg2));
closeDlg();A.end({dataset:{v:'pc'}});
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
