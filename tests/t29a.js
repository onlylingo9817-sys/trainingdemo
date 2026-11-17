const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
UI.page='projects';UI.tab.projects='学习项目配置';UI.sel.projF={};UI.sel.projPage={page:1,size:20};render();
CK('学习项目有 7 个筛选/排序控件',document.querySelectorAll('[data-wc=projF]').length>=7);
CK('学习项目可导出',!!document.querySelector('[data-act=lstExport]'));
const n0=document.querySelectorAll('#main table.t tr').length;A.projF({dataset:{k:'type'},value:'新品训'});
CK('学习项目筛选生效并回第 1 页',document.querySelectorAll('#main table.t tr').length<=n0&&UI.sel.projPage.page===1);
UI.page='publish';UI.tab.publish='已上架';UI.sel.pubF={};UI.sel.pub={page:1,size:20};render();
CK('已上架有 6 个筛选',document.querySelectorAll('[data-wc=pubF]').length>=6);
UI.page='catalog';UI.tab.catalog=KP_TAB_LIB;UI.sel.kpf={};UI.sel.kpPage={page:1,size:5};render();
CK('知识点库分页+排序+导出',/第 1 \//.test(document.querySelector('#main').innerText)&&!!document.querySelector('[data-k=sort]')&&!!document.querySelector('[data-act=lstExport]'));
const p=S.projects.find(x=>x.status!=='未生效'&&x.nodes.length);UI.page='detail';UI.projId=p.id;UI.ptab='下发明细';UI.sel.issueF={};UI.sel.issuePage={page:1,size:5};render();
CK('下发明细有筛选/逾期说明/导出',document.querySelectorAll('[data-wc=issueF]').length>=4&&/逾期口径/.test(document.querySelector('#main').innerText)&&!!document.querySelector('[data-act=lstExport]'));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
