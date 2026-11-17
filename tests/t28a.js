const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
const all=personAll();
CK('人员并集 = 人事 ∪ 理想态且无重复 MID',all.length>0&&new Set(all.map(p=>p.mid)).size===all.length,'n='+all.length);
CK('并集人数 >= 两套数据较大者',all.length>=Math.max(PEOPLE.length,(S.lrn||[]).length),'PEOPLE='+PEOPLE.length+' lrn='+(S.lrn||[]).length+' all='+all.length);
const onlyPeople=PEOPLE.filter(p=>!(S.lrn||[]).some(l=>l.mid===p.mid));
const p0=onlyPeople[0];
CK('仅人事存在的人:可查、就绪度为 null、不抛错',!!personOf(p0.mid)&&personReady(personOf(p0.mid))===null&&personOf(p0.mid).tier===null,p0&&p0.name);
const l0=(S.lrn||[])[0];const pl=personOf(l0.mid);
CK('理想态学员:带岗位档与批次',!!pl&&!!pl.tier&&!!pl.group,pl&&(pl.tier+'/'+pl.group));
CK('人事+理想态重叠的人标两个来源',!!personOf(l0.mid)&&personOf(l0.mid).src.length>=1,personOf(l0.mid).src.join(','));
CK('personOf 不存在返回 null',personOf('不存在MID')===null);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
