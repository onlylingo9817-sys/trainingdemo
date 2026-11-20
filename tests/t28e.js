const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
A.cNew({dataset:{}});C.title='t';C.kind='话术';C.type='图文';C.kps=['K4'];render();
const tx=()=>document.querySelector('#main').innerText;
CK('内容属性自动带出知识点/能力',/从所选知识点继承|知识域\/能力\/卖点/.test(tx())&&kpMetaOfContent(C).ab.length>0,JSON.stringify(kpMetaOfContent(C)));
CK('内容属性只读继承(不再手填)',/不再手填|从所选知识点继承/.test(tx())&&!/主题对象 \/ 场景 \/ 能力/.test(tx()));
C.kps=[];render();
CK('没选知识点时提示先挂知识点',/还没有挂知识点|上架前必须挂/.test(tx()));
A.kpNew();render();
CK('知识点表单解释知识类型与能力项的区别',/决定「怎么测」/.test(document.querySelector('#main').innerText)&&/归到画像哪一维/.test(document.querySelector('#main').innerText));
CK('知识类型筛选与规则仍保留',typeof kpTypeText==='function'&&S.kps.some(k=>k.type==='事实型'));
KF=null;
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
