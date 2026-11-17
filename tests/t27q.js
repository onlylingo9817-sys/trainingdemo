const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
const bad=S.topics.filter(t=>t.flow==='已闭环').filter(t=>{const cs=(t.cids||[]).map(content).filter(Boolean);return !cs.length||!cs.some(isPub)});
UI.page='topics';UI.sel.tq={flow:'已闭环'};render();
const txt=document.querySelector('#main').innerText;
CK('证据不全的已闭环课题被显式标注',bad.length===0||/证据不全/.test(txt),'bad='+bad.length);
CK('标注同时指出缺哪段证据',bad.length===0||/无内容|未上架/.test(txt));
const t=S.topics.find(x=>x.flow==='已闭环');
if(t){t.cids=[];t.flow='已闭环';render();CK('无内容时仍能看到缺口提示',/无内容|证据不全/.test(document.querySelector('#main').innerText))}
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
