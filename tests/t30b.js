const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();document.body.dataset.end='rn';
const p=S.packs.find(x=>x.status!=='已完成'&&x.kp);
if(!p){CK('无学习包样例',false);throw new Error('skip')}
const ME0=PEOPLE.find(x=>x.mid===p.mid)||PEOPLE[0];ME=ME0;
const step0=p.steps.find(s=>!s.done);
CK('学习包步骤有真实判定说明',typeof packStepNeed==='function'&&packStepNeed({t:'练题',need:3})===3);
const okAdv=packAdvance(p,'题','QTEST1');
CK('系统证据可推进学习包步骤',okAdv&&p.steps.some(s=>s.done&&s.ts==='QTEST1'));
CK('重复同一证据不重复推进',packAdvance(p,'题','QTEST1')===false);
R.page='pack';R.packId=p.id;renderRN();
CK('学习包详情可见并显示进度',/学习包/.test(document.querySelector('#rscr').innerText)&&/进度/.test(document.querySelector('#rscr').innerText));
document.body.dataset.end='pc';
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
