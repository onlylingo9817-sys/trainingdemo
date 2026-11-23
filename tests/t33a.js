const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
/* t33a:v1.2 知识关系 / 总览热力图 / 分类完整性 */
try{
A.roleSwitch({value:'hq'});closeDlg();
const act=S.kps.filter(k=>k.st==='启用');
CK('知识点支持前置/相关关系',S.kps.some(k=>(k.pre||[]).length)&&S.kps.some(k=>(k.rel||[]).length));
CK('孤岛知识点少于 5 个',act.filter(k=>!(k.pre||[]).length&&!(k.rel||[]).length).length<=5,act.filter(k=>!(k.pre||[]).length&&!(k.rel||[]).length).length+' 个');
CK('所有启用知识点都有业务线/岗位/分类',act.every(k=>k.line&&(k.roles||[]).length&&k.domain&&(k.ability||k.sellpoint)));
UI.page='catalog';UI.tab.catalog='总览';render();
const t=document.querySelector('#main').innerText;
CK('总览有各领域进展',/各领域进展/.test(t));
CK('总览有车型×领域热力图',/车型 × 领域/.test(t));
CK('总览有补学进度',/补学进度/.test(t));
UI.page='catalog';UI.tab.catalog='知识点库';UI.sel.kpf={q:'XM-S11'};render();
CK('知识点库可搜索编号',/顾虑澄清/.test(document.querySelector('#main').innerText));
UI.sel.kpf={};
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
