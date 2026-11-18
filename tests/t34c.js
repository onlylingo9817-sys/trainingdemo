const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});closeDlg();UI.page='overview';UI.tab.overview='流程与规则';render();
const t=tx();
CK('流程页以日常五步开头',/日常五步/.test(t)&&/看今天该处理什么/.test(t)&&/看效果并决定下一步/.test(t));
CK('五步入口指向当前页面',/去工作台/.test(t)&&/去知识点/.test(t)&&/去内容中心/.test(t)&&/去学习项目/.test(t)&&/去效果追踪/.test(t));
CK('角色边界使用当前页签口径',/人员就绪度/.test(t)&&/调优与结项/.test(t)&&/标签管理/.test(t));
CK('角色边界写明区域老师调优只读',/调优：看诊断/.test(t)&&/调优：创建调整项 \/ 回滚配置/.test(t));
CK('不再引用已移除页签',!/复制与回炉/.test(t)&&!/批量新建/.test(t)&&!/清河迁移/.test(t));
CK('状态机含评估中与结项结论',/学习项目状态机/.test(t)&&/评估中/.test(t)&&/已结项/.test(t));
CK('数据来源与关键规则仍在',/数据从哪来/.test(t)&&/关键规则速查/.test(t)&&/样本不足不下结论/.test(t));
CK('设计边界放到最后且标明评审用',/设计边界与已知未闭环/.test(t)&&/评审用/.test(t));
A.roleSwitch({value:'r1'});UI.page='overview';UI.tab.overview='流程与规则';render();
CK('区域老师也能看到流程页',/日常五步/.test(tx()));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
