const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const html=()=>document.querySelector('#main').innerHTML;
const tx=()=>document.querySelector('#main').innerText;
const tabTexts=()=>[...document.querySelectorAll('#main .tab')].map(e=>e.innerText.trim().replace(/\s+\d+$/,''));
try{
closeDlg();
A.roleSwitch({value:'hq'});
/* 1. 项目详情「效果」页签内嵌看板，不再跳转 */
UI.page='detail';UI.projId='P5';UI.ptab='效果';render();
CK('评估中项目:效果页签内嵌三层指标',/三层指标/.test(html()));
CK('内嵌看板无项目下拉、无跳转按钮',!/data-wc="efsel"/.test(html())&&!/查看完整效果看板/.test(html()));
CK('评估中项目:页内有结项按钮',/data-act="closeProj"/.test(html()));
UI.projId='P6';render();
CK('已结项项目:显示结论且无结项按钮',/结论:<b>/.test(html())&&!/data-act="closeProj"/.test(html()));
UI.projId='P9';render();
CK('无效果数据项目:显示空态',/还没有效果数据/.test(html()));
/* 2. 下钻状态按项目隔离 */
UI.projId='P5';UI.drill=['华东'];UI.drillP='P1';render();
CK('切换项目后下钻重置',UI.drill.length===0&&UI.drillP==='P5');
/* 3. 效果总览按培训类型 */
UI.page='effect';UI.tab.effect='效果总览';UI.sel.efType='';render();
CK('页签名为「效果总览」',tabTexts().includes('效果总览')&&!tabTexts().includes('效果看板'),tabTexts().join('/'));
CK('按培训类型出卡片',(html().match(/data-act="efType"/g)||[]).length>=4);
CK('总览列出全部可见项目',(html().match(/data-pt="效果"/g)||[]).length===visibleP().length);
UI.tab.effect='效果看板';render();
CK('旧页签名「效果看板」仍可打开总览',/data-act="efType"/.test(html()));
UI.tab.effect='效果总览';UI.sel.efType='强竞品';render();
CK('点类型可筛选项目列表',(html().match(/data-pt="效果"/g)||[]).length===S.projects.filter(p=>tk(p.type,p.sub)==='强竞品').length);
UI.sel.efType='';
/* 4. 结项汇总入口指向项目详情 */
UI.tab.effect='调优与结项';UI.tab.tune='结项';render();
CK('调优与结项里不再直接放结项按钮',!/data-act="closeProj"/.test(html())&&/去看效果并结项/.test(html()));
/* 5. 老板不进项目明细 */
A.roleSwitch({value:'boss'});UI.page='effect';UI.tab.effect='效果总览';render();
CK('老板总览无项目详情链接',!/data-p="detail"/.test(html()));
const names=[...new Set(S.lrn.map(l=>l.name).concat(PEOPLE.map(p=>p.name)))].filter(Boolean);
CK('老板总览不含学员姓名',!names.some(n=>tx().includes(n)));
/* 6. 人员详情：参与项目前后的行为变化 */
A.roleSwitch({value:'hq'});
const pr=proj('P5');const m=PEOPLE.find(x=>eligible(pr,x)&&lrnOf(x.mid));
UI.page='person';UI.stuMid=m.mid;render();
CK('人员详情含「参与项目前后的行为变化」',/参与项目前后的行为变化/.test(html()));
CK('明确标注相关性非因果',/相关性/.test(html())&&/不是因果/.test(html()));
const d=pplProjectDelta(personOf(m.mid),pr);
CK('前后值来自行为序列且为数',d.rows.length>0&&d.rows.every(r=>r.pre==null||typeof r.pre==='number'),JSON.stringify(d.rows));
const np=PEOPLE.find(x=>!pplProjectsOf(x).length);
if(np){UI.stuMid=np.mid;render();CK('无参与项目的人显示空态',/暂无可对照/.test(html()))}
/* 7. 区域老师不能越区看人 */
A.roleSwitch({value:'r1'});const r1=UI.role;const other=PEOPLE.find(x=>x.region!==r1.region);
UI.page='person';UI.stuMid=other.mid;render();
CK('区域老师越区访问被拦回人员列表',UI.page==='people');
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
