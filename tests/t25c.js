const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});closeDlg();
/* 新车检查：识别、缺口、不自动改数据 */
const before=S.kps.length;
const r=aiCheckNewCar('YU7 Max 上市，定位与 N90 Max 接近，卖点有外放电、二排座椅、智能驾驶；帮我检查还缺哪些标签和知识点');
CK('能识别新车名',!!r.car&&/YU7/.test(r.car),r.car);
CK('能给出参考车型',!!r.srcCar,r.srcCar);
CK('检查不会自动新建知识点',S.kps.length===before,before+'→'+S.kps.length);
CK('检查结果有缺口说明',r.gaps.length>0,r.gaps.join('；'));
UI.sel.kpCar=r;A.kpCarAdoptOne({dataset:{id:r.suggested[0].id}});
CK('单个采纳会建停用骨架',S.kps.length===before+1&&S.kps[S.kps.length-1].st==='停用','kps='+S.kps.length);
CK('单个骨架继承标签',S.kps[S.kps.length-1].tags.length>0||r.suggested[0].tags.length===0);
const n1=S.kps.length;A.kpCarIgnore();
CK('忽略只收起结果不改数据',S.kps.length===n1&&!UI.sel.kpCar);
/* CSV 预检 */
UI.page='catalog';UI.tab.catalog='批量新建';render();A.kpSample();
A.kpAiAudit();CK('批量导入预检有汇总',UI.sel.kpCsvAudit&&UI.sel.kpCsvAudit.summary.total>0,JSON.stringify(UI.sel.kpCsvAudit&&UI.sel.kpCsvAudit.summary));
CK('预检页面可见',/导入前预检/.test(tx()));
const n2=S.kps.length;CK('预检不写入知识点',S.kps.length===n2);
/* 标签治理 */
UI.page='tagmanage';render();CK('标签管理页不再常驻治理块（重复校验改在新建时）',!/标签治理：只提示/.test(tx()));
/* 全站引导 */
UI.page='workbench';render();CK('工作台有单页引导',/今天先处理/.test(tx()));
CK('工作台有 AI 建议卡',/AI 检查建议/.test(tx()));
A.pageHelp();CK('怎么用弹窗仍然可用',/这页怎么用/.test(document.querySelector('#dlg').innerText));closeDlg();
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
