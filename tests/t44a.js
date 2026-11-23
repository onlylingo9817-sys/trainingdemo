const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const html=()=>document.querySelector('#main').innerHTML;
const tx=()=>document.querySelector('#main').innerText;
/* t44a：知识点业务化掌握标准 + 定义 / 边界规范 + 新增前 AI 评估 */
try{
A.roleSwitch({value:'hq'});closeDlg();A.reset();
A.kpNew();render();
CK('表单先解释知识点定义与边界',/独立讲、独立练、独立考/.test(tx())&&/查看入库规范/.test(tx()));
CK('掌握标准使用业务语言',/怎样算学会/.test(tx())&&/核心考核/.test(tx())&&/巩固练习/.test(tx())&&!/锚题数量|锚定演练数量/.test(tx()));
CK('概念类型给出可理解的学会定义',/理解并说清/.test(tx())&&/准确解释含义、适用条件和边界/.test(tx()));
CK('题量与演练默认收进高级设置',!document.querySelector('.kp-assess-advanced')&&/高级：调整题量与演练/.test(tx()));
A.kpAssessAdv();
CK('高级设置解释三类数量的不同作用',/核心考核题（过关 \/ 复测）/.test(tx())&&/巩固练习题（不计过关）/.test(tx())&&/过关情景演练/.test(tx()));
A.kfAssess({dataset:{k:'anchorQ'},value:'4'});
CK('高级题量仍写回底层考核配置',KF.assess.anchorQ===4&&/4 道核心题/.test(tx()));
A.kfTypeV12({value:'技能'});
CK('技能类型强调实际场景独立做出来',/能在场景中独立做出来/.test(tx())&&KF.assess.anchorDrill===1&&/1 场情景演练/.test(tx()));
A.kpSpecGuide();
CK('入库规范包含五项判断与拆分合并边界',/同时满足这 5 条/.test(document.querySelector('#dlg').innerText)&&/过宽主题，应拆分/.test(document.querySelector('#dlg').innerText)&&/同一结果跨车型，应合并/.test(document.querySelector('#dlg').innerText));
closeDlg();
/* 定义清楚、有依据、无重复：建议添加，但不能自动入库 */
A.kpNew();KF.name='SU7 外放电安全边界';KF.one='学员能向客户讲清外放电的适用场景、限制和安全注意事项。';KF.cars=['SU7'];KF.roles=['零售顾问'];KF.domain='产品知识';KF.typeV12='概念';KF.sellpoint='产品讲解';KF.srcDoc='DOC-DEMO';KF.owner=kpDefOwner();
const n0=S.kps.length,log0=(S.aiLog||[]).length;A.kpSpecReview();const good=UI.sel.kpSpecReview;
CK('清晰且合规的新点得到建议添加',good.decision==='建议添加'&&good.rows.every(x=>x.s==='ok'),good.rows.map(x=>x.s+':'+x.t).join(' | '));
CK('AI 只给建议并留痕，不自动入库',S.kps.length===n0&&S.aiLog.length===log0+1&&S.aiLog[0].type==='知识点定义与边界评估'&&!S.aiLog[0].accepted);
CK('结果明确展示建议、原因和模拟边界',/建议添加/.test(tx())&&/规则模拟/.test(tx())&&/业务负责人最终确认/.test(tx()));
KF.name='SU7 外放电安全边界（改）';render();
CK('表单变更后旧评估标记为过期',/结果可能已过期/.test(tx()));
/* 重复、过宽、非知识点、缺定义分别给不同原因 */
A.kpNew();KF.name=kp('K12').name;KF.one='学员能按预算和用车需求带客户选对版本。';KF.cars=['SU7'];const dup=kpSpecEvaluate();
CK('同名且车型重叠不建议重复新增',dup.decision==='不建议新增'&&dup.rows.some(x=>x.s==='err'&&/同名且适用范围重叠/.test(x.t)));
A.kpNew();KF.name='产品知识大全';KF.one='学员能掌握所有产品知识。';const broad=kpSpecEvaluate();
CK('过宽主题提示拆分而不是直接入库',broad.decision==='不建议新增'&&broad.rows.some(x=>/范围看起来过大/.test(x.t)));
A.kpNew();KF.name='SU7 培训课程';KF.one='学员能完成 SU7 产品培训。';const course=kpSpecEvaluate();
CK('课程资料类对象被识别为非知识点',course.decision==='不建议新增'&&course.rows.some(x=>/更像课程、资料或活动/.test(x.t)));
A.kpNew();KF.name='外放电安全边界';KF.one='';const missing=kpSpecEvaluate();
CK('缺学习结果时要求补充后再评估',missing.decision==='补充信息后再评估'&&missing.rows.some(x=>/学完要会什么/.test(x.t)));
/* 编辑时不把自身当重复；保存仍保留底层锚 / 练数据 */
UI.kid='K12';A.kpEdit();const edit=kpSpecEvaluate();
CK('编辑复核不会把知识点自身误判为重复',edit.rows.every(x=>!/同名且适用范围重叠/.test(x.t)));
A.kpNew();KF.name='Demo 外放电安全边界';KF.one='学员能向客户讲清外放电的适用场景、限制和安全注意事项。';KF.cars=['SU7'];KF.roles=['零售顾问'];KF.domain='产品知识';KF.typeV12='概念';KF.sellpoint='产品讲解';KF.srcDoc='DOC-DEMO';KF.statusV12='结构已核';KF.assess.anchorQ=4;KF.assess.practiceQ=6;KF.assess.anchorDrill=0;KF.assess.pass=80;A.kfSave();
const saved=S.kps.find(k=>k.name==='Demo 外放电安全边界');
CK('业务化表单保存后题量和过关规则不丢失',!!saved&&saved.assess.anchorQ===4&&saved.assess.practiceQ===6&&saved.assess.anchorDrill===0&&saved.assess.pass===80);
CK('页面无 undefined / NaN',!/undefined|NaN/.test(html()));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' | '))}
