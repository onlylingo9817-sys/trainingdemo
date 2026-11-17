const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
UI.page='topics';UI.sel.tq={flow:'已闭环'};UI.sel.tqP={};UI.sel.topicPage={page:1,size:10};render();
CK('已闭环课题显示行为/复测证据',/行为\/复测/.test(document.querySelector('#main').innerText));
UI.sel.tq={};UI.sel.tqP={};UI.sel.tqView='list';render();
CK('课题池有列表视图与筛选导出',/内容\/上架/.test(document.querySelector('#main').innerText)&&document.querySelectorAll('[data-wc=tqP]').length>=4);
A.tqView({dataset:{v:'card'}});CK('可切回卡片视图',UI.sel.tqView==='card');
UI.page='content';UI.tab.content='使用与反馈';UI.sel.useF={};render();
CK('使用与反馈有筛选与导出',document.querySelectorAll('[data-wc=useF]').length>=3&&!!document.querySelector('[data-act=lstExport]'));
UI.page='catalog';UI.tab.catalog='候选';UI.sel.candSel=[];render();
CK('候选支持批量',/全选待确认/.test(document.querySelector('#main').innerText));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
