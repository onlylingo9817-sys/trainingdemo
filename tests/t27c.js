const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
/* 结项转入生成工单：项目/证据/目标要带过来 */
const p=S.projects.find(p=>p.status!=='已结项'&&p.eff);
A.closeProj({dataset:{id:p.id}});
// choose 转入店辅导
const radio=document.querySelector('input[name=cr][value="转入店辅导"]');if(radio)radio.checked=true;
document.querySelector('#cw').value='测试：线上没解决，转入店辅导';
A.closeOk({dataset:{id:p.id}});
const tk=S.tickets.filter(t=>t.proj===p.id).slice(-1)[0];
CK('结项转入生成工单',!!tk,'ticket='+(tk&&tk.id));
CK('工单带项目与指标证据',!!tk&&!!tk.proj&&!!tk.goal&&!!tk.pre,(tk?tk.goal:''));
/* 区域无数据空态 */
A.reset();A.roleSwitch({value:'r1'});UI.page='coach';render();CK('区域空态有明确引导',/当前区域还没有辅导项目/.test(document.querySelector('#main').innerText));
/* 工单详情展示证据 */
A.roleSwitch({value:'hq'});UI.page='coach';render();const x=S.tickets.find(t=>t.st!=='结案');A.ticket({dataset:{id:x.id}});CK('辅导详情展示触发证据',/触发证据/.test(document.querySelector('#dlg').innerText));
/* AI 辅导建议 */
CK('辅导总览有 AI 先跟哪家店',/先跟哪家店/.test(document.querySelector('#main').innerText));
/* 老板统计兼容 post 对象 */
const pc=document.querySelector('#main');UI.page='effect';UI.tab.effect='效果报告';render();CK('效果报告可渲染不报错',pc.innerText.length>0);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
