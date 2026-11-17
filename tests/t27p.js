const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
UI.page='effect';UI.tab.effect='就绪度';UI.sel.rdy={scope:'全国'};UI.sel.rdyPage={page:1,size:20};render();
CK('就绪度按 20 条分页',document.querySelectorAll('#main table.t tr').length<=21);
CK('就绪度有姓名/MID 搜索',!!document.querySelector('[data-k=q]'));
CK('就绪度可导出',!!document.querySelector('[data-act=lstExport]'));
A.lstPg({dataset:{k:'rdyPage',v:'next'}});CK('就绪度可翻页',UI.sel.rdyPage.page===2);
UI.sel.rdy={scope:'全国',q:'张'};UI.sel.rdyPage={page:1,size:20};render();
CK('就绪度搜索生效',document.querySelectorAll('#main table.t tr').length<=21&&/张/.test(document.querySelector('#main').innerText));
UI.page='publish';UI.tab.publish='已上架';UI.sel.pub={page:1,size:20};render();
CK('已上架分页',document.querySelectorAll('#main table.t tr').length<=21);
CK('已上架有导出',!!document.querySelector('[data-act=lstExport]'));
const cb=document.querySelectorAll('#main table.t input[type=checkbox]')[1];
A.lstSel({dataset:{k:'pub',id:cb.dataset.id},checked:true});
CK('已上架勾选出现批量栏',/批量上架/.test(document.querySelector('#main').innerText));
A.lstSelClear({dataset:{k:'pub'}});
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
