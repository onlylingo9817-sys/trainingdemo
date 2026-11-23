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

/* 2. v1.2 总览：四指标 + 两张热力图 */
UI.page='catalog';UI.tab.catalog='总览';render();
CK('总览有四指标',/覆盖度/.test(tx())&&/可授课率/.test(tx())&&/可考核率/.test(tx())&&/时效健康度/.test(tx()));
CK('总览有各领域进展',/各领域进展/.test(tx()));
CK('总览有车型×领域热力图',/车型 × 领域/.test(tx()));
CK('总览有口径选择',!!document.querySelector('[data-wc=kpV12OvSet]'));
CK('总览有补学进度',/补学进度/.test(tx()));
CK('总览无旧标签树',document.querySelectorAll('#main .tag-row').length===0);
CK('总览无 undefined/NaN',!/undefined|NaN/.test(tx()));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
