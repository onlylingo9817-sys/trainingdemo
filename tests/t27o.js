const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
UI.page='content';UI.tab.content='全部内容';UI.sel.call={page:1,size:20};render();
const n=document.querySelectorAll('#main table.t tr').length;
CK('内容全部内容按每页 20 条分页',n<=21,n+' 行(含表头)');
CK('内容列表有分页器',/第 1 \//.test(document.querySelector('#main').innerText));
CK('内容列表有导出 CSV',!!document.querySelector('[data-act=lstExport]'));
CK('内容列表有每页条数切换',!!document.querySelector('[data-wc=casize]'));
const cb=document.querySelectorAll('#main table.t input[type=checkbox]')[1];
A.lstSel({dataset:{k:'call',id:cb.dataset.id},checked:true});
CK('勾选后出现批量栏',/批量提交审核/.test(document.querySelector('#main').innerText)&&lstPicked('call').length===1);
A.lstPg({dataset:{k:'call',v:'next'}});
CK('翻页后仍在内容全部内容页',UI.sel.call.page===2&&UI.tab.content==='全部内容');
UI.sel.call={page:1,size:20};render();
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
