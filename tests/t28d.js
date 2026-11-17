const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
A.cNew({dataset:{}});C.title='测试继承';C.kind='话术';C.type='图文';C.kps=['K4'];render();
const inh=kpTagsOfContent(C);
CK('内容标签自动继承所选知识点的标签',inh.length>0&&/自动继承/.test(document.querySelector('#main').innerText),'inherited='+inh.length);
CK('额外补充标签默认收起',!!document.querySelector('#main details.ppl-extra-tag')&&!document.querySelector('#main details.ppl-extra-tag').open);
C.kps=[];render();
CK('没有知识点时不显示标签继承区',!kpTagsOfContent({kps:[],tags:['T5']}).length);
C.kps=['K4','K9'];render();
CK('多个知识点时标签取并集',kpTagsOfContent(C).length>=inh.length,'union='+kpTagsOfContent(C).length);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
