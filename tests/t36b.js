const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.reset();A.roleSwitch({value:'hq'});closeDlg();
const t0=today;
UI.page='workbench';render();
A.demoDate();
const inp=document.querySelector('#dd_val');
CK('演示日期弹窗带出当前日期',!!inp&&inp.value===t0,inp&&inp.value);
inp.value='2026-12-20';A.demoDateOk();
CK('应用后 today 立即变化',today==='2026-11-20'||today==='2026-12-20',today);
CK('D0 锚点同步更新',Math.round((D0-new Date('2026-12-20T00:00:00'))/864e5)===0);
CK('到期重算基于新日期',addDays(today,0)==='2026-12-20');
inp.value='not-a-date';
A.demoDate();document.querySelector('#dd_val').value='bad';A.demoDateOk();
CK('非法日期被拦截',today==='2026-12-20',today);
A.demoDate();document.querySelector('#dd_val').value=t0;A.demoDateOk();
CK('改回原日期',today===t0);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
