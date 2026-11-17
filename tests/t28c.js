const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
UI.page='people';UI.sel.ppl={view:'store'};UI.sel.pplStoreOpen={};render();
const tx=()=>document.querySelector('#main').innerText;
CK('可切到按门店看',/按人看/.test(tx())&&/平均就绪度/.test(tx()));
CK('门店表可导出汇总与员工明细',document.querySelectorAll('[data-act=lstExport]').length>=2);
const btn=document.querySelector('[data-act=pplStoreToggle]');
CK('门店行可点击展开',!!btn);
const store=btn.dataset.v;A.pplStoreToggle(btn);
CK('展开后出现该店员工表',!!UI.sel.pplStoreOpen[store]&&document.querySelectorAll('#main table.t table.t').length===1);
const names=[...document.querySelectorAll('#main table.t table.t a[data-act=pplOpen]')].map(a=>a.dataset.mid);
CK('展开的员工都属于该门店',names.length>0&&names.every(mid=>personOf(mid).store===store),store+' n='+names.length);
if(names.length){A.pplOpen({dataset:{mid:names[0]}});CK('展开里点姓名进人员详情',UI.page==='person'&&UI.stuMid===names[0])}
A.pplStoreToggle({dataset:{v:store}});CK('再点可收起',!UI.sel.pplStoreOpen[store]);
A.roleSwitch({value:'r1'});UI.page='people';UI.sel.ppl={view:'store'};UI.sel.pplStoreOpen={};render();
CK('区域老师门店视角只含本区域门店',[...document.querySelectorAll('[data-act=pplStoreToggle]')].every(b=>personScope().some(p=>p.store===b.dataset.v)));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
