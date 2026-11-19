const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.reset();A.roleSwitch({value:'hq'});closeDlg();
/* 工作台「未挂载内容」→ 内容中心简版列表带上筛选 */
UI.page='workbench';render();
A.wbUnmounted();
CK('工作台未挂载直达内容中心且筛选生效',UI.page==='content'&&UI.sel.caf&&UI.sel.caf.kp==='未挂载'&&!UI.sel.cadv);
/* 简版 → 高级 条件互带 */
UI.sel.caf={kp:'K1',st:'已定稿',k:'话术',q:'冰箱'};
A.cafAdv();
const q=UI.sel.cq||{};
CK('进高级筛选带上 知识点/状态/性质/关键词',q.kp==='K1'&&q.st==='已定稿'&&q.kind==='话术'&&UI.sel.cqs==='冰箱',JSON.stringify(q));
UI.sel.cq.st='草稿';
A.cafAdvOff();
CK('回简版带回高级里改的条件',UI.sel.caf.st==='草稿'&&UI.sel.caf.kp==='K1');
render();
CK('简版列表按带回的条件过滤',document.querySelector('#main').innerText.length>100);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
