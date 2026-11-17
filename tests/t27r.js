const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
const menu=document.querySelector('#menu').innerText;
CK('标签管理移到「准备内容」分组',menu.indexOf('准备内容')<menu.indexOf('标签管理')&&menu.indexOf('标签管理')<menu.indexOf('组织培训'));
CK('系统分组不再有标签管理',!menu.slice(menu.indexOf('系统')).includes('标签管理'));
CK('未复刻菜单折叠为 details',!!document.querySelector('#menu details.mg-fold'));
UI.page='effect';UI.tab.effect='错题集';UI.sel.misPage={page:1,size:20};render();
CK('错题明细不再硬截 30 条',/共 \d+ 条/.test(document.querySelector('#main').innerText));
CK('错题明细有分页',/第 1 \//.test(document.querySelector('#main').innerText));
CK('错题明细可导出',!!document.querySelector('[data-act=lstExport]'));
CK('错题明细可排序',!!document.querySelector('[data-wc=misSort]'));
UI.page='approvals';UI.sel.fs='';UI.sel.apPage={page:1,size:20};render();
CK('报名审批有姓名/MID 搜索',!!document.querySelector('[data-wc=aq]'));
CK('报名审批有分页',/第 1 \//.test(document.querySelector('#main').innerText));
CK('报名审批可导出',!!document.querySelector('[data-act=lstExport]'));
A.lstPg({dataset:{k:'apPage',v:'next'}});CK('报名审批可翻页',UI.sel.apPage.page===2);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
