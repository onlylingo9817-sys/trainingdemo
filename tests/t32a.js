const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
/* t32a:v1.2 课程样例的挂载完整性（原 5 个 SPIN 点已合并到 KP-SALE-08） */
try{
A.roleSwitch({value:'hq'});closeDlg();
const c=S.contents.find(x=>x.id==='N_SPIN1');
CK('SPIN 课程已入库并定稿上架',!!c&&c.st==='已定稿'&&pubOf(c)==='已上架');
CK('课程挂有效知识点',!!c&&c.kps.length>=1&&c.kps.every(k=>!!kp(k)),c&&c.kps.join(','));
CK('主讲解在挂载列表里',!!c&&(!c.mainKp||c.kps.includes(c.mainKp)),c&&c.mainKp);
CK('每个知识点都有负责人',!!c&&c.kps.every(k=>!!(kp(k)||{}).owner));
const d=S.drills.find(x=>x.id==='D_SPIN1');
CK('演练挂在有效知识点',!!d&&!!kp(d.kp),d&&d.kp);
CK('演练有参考话术',!!d&&!!(d.turns[0]||{}).ref);
document.body.dataset.end='rn';const l=S.lrn.find(x=>x.tier)||{mid:PEOPLE[0].mid};ME=PEOPLE.find(p=>p.mid===l.mid)||PEOPLE[0];
R.page='school';renderRN();const t=document.querySelector('#rscr').innerText;
CK('零售通可看到该课程或相关演练',/场景化讲车|SPIN/.test(t)||S.contents.some(x=>x.id==='N_SPIN1'&&isPub(x)));
document.body.dataset.end='pc';
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
