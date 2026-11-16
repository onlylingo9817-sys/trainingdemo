const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
const pages=['workbench','coach','catalog','content','effect','projects','config','tagmanage'];let missAll=[];
pages.forEach(p=>{UI.page=p;render();const acts=[...document.querySelectorAll('#main [data-act]')].map(e=>e.dataset.act);const miss=[...new Set(acts)].filter(a=>!A[a]&&a!=='go'&&a!=='close'&&a!=='end');miss.forEach(a=>missAll.push(p+':'+a))});
CK('关键页面没有无处理器的 data-act',missAll.length===0,missAll.slice(0,10).join(','));
/* 内容中心导入按钮 */
UI.page='content';UI.tab.content='全部内容';render();A.cTab({dataset:{v:'导入'}});CK('内容中心导入按钮可用',UI.tab.content==='导入'&&/选择资料/.test(document.querySelector('#main').innerText));
/* 推荐店发起辅导 */
UI.page='coach';UI.tab.coach='推荐辅导店';render();const b=document.querySelector('#main [data-act=mkTicket]');CK('推荐店有发起辅导按钮',!!b);if(b){const n=S.tickets.length;A.mkTicket({dataset:{s:b.dataset.s,p:b.dataset.p}});CK('发起辅导真的创建工单',S.tickets.length===n+1&&S.tickets[S.tickets.length-1].st==='触发','before='+n+' after='+S.tickets.length)}
/* 区域过滤：不能给外区门店建辅导 */
A.roleSwitch({value:'r1'});UI.page='coach';UI.tab.coach='推荐辅导店';render();const bb=document.querySelector('#main [data-act=mkTicket]');if(bb){CK('区域推荐店不出现外区门店',pp2(bb.dataset.s)==='华北',bb.dataset.s)}else CK('区域推荐店为空或本区',true);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
