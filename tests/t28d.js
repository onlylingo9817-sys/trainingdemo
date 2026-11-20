const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
/* t28d:v1.2 内容属性从知识点继承（标签已取消） */
try{
A.roleSwitch({value:'hq'});closeDlg();
A.cNew({dataset:{}});C.title='测试继承';C.kind='话术';C.type='图文';C.kps=['K57'];render();
const meta=kpMetaOfContent(C);
CK('内容继承所选知识点的名称/能力/车型',meta.kps.length===1&&!!meta.ab.length,C.kps.join(',')+' / '+meta.ab.join(','));
CK('内容编辑显示知识点与角色',/主讲解|补充/.test(tx())&&!!document.querySelector('#cp_kl'));
C.kps=[];render();
CK('没有知识点时不显示继承信息',kpMetaOfContent(C).kps.length===0);
C.kps=['K57','K58'];render();
CK('多个知识点时继承并集',kpMetaOfContent(C).kps.length===2,kpMetaOfContent(C).kps.join(','));
CK('内容不再出现标签选择器',!/内容标签/.test(tx()));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
