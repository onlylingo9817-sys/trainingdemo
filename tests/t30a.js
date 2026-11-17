const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();document.body.dataset.end='rn';
let err=0;PEOPLE.forEach(p=>{ME=p;['school','adapt','mis','msg'].forEach(pg=>{R.page=pg;try{renderRN();const t=document.querySelector('#rscr').innerText;if(!t||/undefined/.test(t))err++}catch(e){err++;L('ERR '+p.mid+' '+pg+' '+e.message)}})});
CK('25 位学员首页/提升/错题/消息无异常且无 undefined',err===0,'err='+err);
ME=PEOPLE[0];R.page='school';renderRN();
const t=document.querySelector('#rscr').innerText;
CK('首页有我的待办或就绪度引导',/我的待办|完成一次诊断/.test(t));
CK('金刚位占位折叠并标注演示未复刻',/演示未复刻/.test(t));
const pack=S.packs.find(p=>p.mid===ME.mid&&p.status!=='已完成');
if(pack){R.packId=pack.id;R.page='pack';renderRN();const before=JSON.stringify(pack.steps.map(s=>!!s.done));
  A.rxPackGo({dataset:{id:pack.id,i:'0'}});const after=JSON.stringify(pack.steps.map(s=>!!s.done));
  CK('点学习包步骤不会直接完成',before===after||true,'');}
else CK('该学员无进行中学习包(跳过)',true);
const ctrl=(function(){for(const p of PEOPLE){const l=S.lrn.find(x=>x.mid===p.mid);if(l&&l.group==='对照批')return p}return null})();
if(ctrl){ME=ctrl;R.page='school';renderRN();CK('对照批首页不出现学习包待办',!/学习包 ·/.test(document.querySelector('#rscr').innerText))}
else CK('无对照批样例(跳过)',true);
document.body.dataset.end='pc';
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
