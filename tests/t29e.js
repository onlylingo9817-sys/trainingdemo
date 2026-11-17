const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
S.kps.push({id:'KSAVE1',name:'持久化断言',type:'事实型',tags:[],car:'通用车型',st:'停用'});saveNow();
CK('保存写入 localStorage',!!localStorage.getItem('trainingdemo.save.v1'));
S.kps=S.kps.filter(k=>k.id!=='KSAVE1');loadNow();
CK('重载后数据一致',S.kps.some(k=>k.id==='KSAVE1'));
localStorage.setItem('trainingdemo.save.v1',JSON.stringify({schema:999}));
CK('schema 不匹配时丢弃',loadNow()===false);
A.reset();A.roleSwitch({value:'hq'});render();
CK('重置清档且不写回',!localStorage.getItem('trainingdemo.save.v1'));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
