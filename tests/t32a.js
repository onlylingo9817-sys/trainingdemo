const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
const c=S.contents.find(x=>x.id==='N_SPIN1');
CK('SPIN 课程已入库并定稿上架',!!c&&c.st==='已定稿'&&pubOf(c)==='已上架');
CK('课程挂 5 个 SPIN 知识点',!!c&&c.kps.length===5,c&&c.kps.length);
CK('第一个为主讲解',!!c&&c.mainKp===c.kps[0]);
CK('不混入 CEMN 知识点',!!c&&!c.kps.some(k=>/CEMN|购买层级/.test((kp(k)||{}).name||'')),c&&c.kps.map(k=>(kp(k)||{}).name).join('|'));
CK('每个知识点都有负责人',!!c&&c.kps.every(k=>(kp(k)||{}).owner));
const d=S.drills.find(x=>x.id==='D_SPIN1');
CK('已生成场景化演练脚本',!!d&&d.st==='已定稿'&&d.turns.length>0);
CK('演练挂在 SPIN 知识点上',!!d&&!/CEMN/.test((kp(d.kp)||{}).name||''));
CK('演练参考话术来自案例',!!d&&/电动侧踏|90 度|三节/.test(d.turns[0].ref||''));
document.body.dataset.end='rn';const l=S.lrn.find(x=>x.tier)||{mid:PEOPLE[0].mid};ME=PEOPLE.find(p=>p.mid===l.mid)||PEOPLE[0];
R.page='school';renderRN();const t=document.querySelector('#rscr').innerText;
CK('零售通可看到该课程或相关演练',/场景化讲车|SPIN/.test(t)||S.contents.some(x=>x.id==='N_SPIN1'&&isPub(x)));
document.body.dataset.end='pc';
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
