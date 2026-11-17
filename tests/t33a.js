const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
const act=S.kps.filter(k=>k.st==='启用');
CK('知识点支持前置关系',typeof kp('K_SPIN2').pre!=='undefined'&&kp('K_SPIN2').pre.length>0);
CK('知识点支持相关关系',kp('K_SPIN2').rel.length>0);
CK('关系形成有向链(SPIN)',kp('K_SPIN1').pre.includes('K_SPIN0')&&kp('K_SPIN2').pre.includes('K_SPIN1'));
CK('孤岛知识点少于 5 个',act.filter(k=>!(k.pre||[]).length&&!(k.rel||[]).length).length<=5);
UI.page='catalog';UI.tab.catalog='总览';render();
const t=document.querySelector('#main').innerText;
CK('总览有知识图谱',/知识图谱/.test(t)&&document.querySelectorAll('#main svg circle').length>10);
CK('图谱连线体现前置/相关',/实线=前置关系/.test(t));
CK('总览有知识点治理面板',/知识点治理/.test(t)&&/没挂标签/.test(t)&&/没进岗位画像/.test(t));
CK('所有启用知识点都有标签',act.filter(k=>!(k.tags||[]).length).length===0,act.filter(k=>!(k.tags||[]).length).map(k=>k.name).join(','));
A.kpNew();KF.name='无标签拦截测试';KF.cars=['通用车型'];KF.abId=(kpAbRows()[0]||{}).id;KF.tags=[];A.kfSave();
CK('新增知识点不挂标签会被拦截',UI.page==='kpform'&&/至少挂一个标签/.test(document.querySelector('#toast').innerText));
KF=null;
UI.kid='K_SPIN2';UI.page='kp';render();
CK('知识点详情显示知识关系',/知识关系/.test(document.querySelector('#main').innerText));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
