const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});closeDlg();
/* 1. SOP 以实际到店日为锚点 */
A.coachNewManual();['cm_store','cm_goal','cm_trig','cm_visit'].forEach(id=>{const e=document.getElementById(id);if(e)e.value=id==='cm_store'?'测试门店':id==='cm_goal'?'留资率 40% → 45%':id==='cm_visit'?'2026-11-20':'手动创建'});
A.coachNewManualSave();const x=S.tickets.find(t=>t.store==='测试门店');
CK('辅导项目记录实际到店日期',!!x&&x.visitDate==='2026-11-20',x&&x.visitDate);
const dates=coachSopDates(x);
CK('SOP 节点按到店日推算',dates.find(d=>d.stage==='入店前两周').date==='2026-11-06'&&dates.find(d=>d.stage==='入店当天 Day1').date==='2026-11-20'&&dates.find(d=>d.stage==='30天总结').date==='2026-12-20',dates.map(d=>d.stage+'='+d.date).join(','));
A.ticket({dataset:{id:x.id}});A.coachTab({dataset:{id:x.id,v:'计划'}});
CK('SOP 首屏显示到店日与时间轴',/到店日/.test(document.querySelector('#dlg').innerText)&&/2026-11-20/.test(document.querySelector('#dlg').innerText)&&/时间轴/.test(document.querySelector('#dlg').innerText));
CK('SOP 提供改到店日期入口',!!document.querySelector('#dlg [data-act=coachVisitEdit]'));
CK('未来节点不出现记录按钮',(()=>{const nodes=[...document.querySelectorAll('#dlg .coach-sop-node.future')];return nodes.length>0&&nodes.every(n=>!n.querySelector('[data-act=coachSopLog]'))})());
/* 改到店日期后推算变化 */
A.coachVisitEdit({dataset:{id:x.id}});document.getElementById('cv_date').value='2026-11-25';A.coachVisitSave({dataset:{id:x.id}});
CK('改到店日期后节点重新推算',coachSopDates(x).find(d=>d.stage==='入店当天 Day1').date==='2026-11-25');

/* 2. 知识图谱聚焦视图 */
UI.page='catalog';UI.tab.catalog='总览';render();
CK('图谱默认全貌网络视图',!!document.querySelector('#main .kg-net')&&document.querySelectorAll('#main .kg-net circle').length>20);
CK('图谱可按能力着色',document.querySelectorAll('#main .kg-net circle').length>20&&[...document.querySelectorAll('#main .kg-net circle')].map(c=>c.getAttribute('fill')).filter((v,i,a)=>a.indexOf(v)===i).length>=3);
A.kgView({dataset:{v:'focus'}});CK('图谱可切单点并选择聚焦',!!document.querySelector('[data-wc=kgDim]')&&!!document.querySelector('[data-wc=kgSkill]'));
CK('单点视图聚焦一个关键点',document.querySelectorAll('#main .kg-main .kg-card').length===1);
CK('单点视图不依赖全量网络图',document.querySelectorAll('#main .kg-net').length===0);
CK('图谱分前置/后续/相关三栏',/先学（前置）/.test(tx())&&/学完可接（后续）/.test(tx())&&/相关（无先后）/.test(tx()));
const first=UI.sel.kgId||document.querySelector('[data-wc=kgSkill]').value;A.kgSkill({value:first});
CK('切换聚焦点后仍只显示局部',document.querySelectorAll('#main .kg-main .kg-card').length===1);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
