const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});closeDlg();
/* 1. 知识点不再保留题库/演练页签，旧链接落内容中心 */
UI.page='catalog';UI.tab.catalog='总览';render();
const tabs=[...document.querySelectorAll('#main .tab')].map(e=>e.innerText.trim().replace(/\s+\d+$/,''));
CK('知识点页签保留总览/知识图谱/知识点库/候选/补学进度',tabs.length===5&&tabs.join('/')==='总览/知识图谱/知识点库/候选/补学进度',tabs.join('/'));
UI.tab.catalog='题库';render();
CK('旧题库链接落到内容中心并筛题',UI.page==='content'&&(UI.sel.cq||{}).kind==='题',UI.page+'/'+((UI.sel.cq||{}).kind||''));
UI.page='catalog';UI.tab.catalog='演练';render();
CK('旧演练链接落到内容中心并筛演练',UI.page==='content'&&(UI.sel.cq||{}).kind==='演练',UI.page+'/'+((UI.sel.cq||{}).kind||''));
UI.page='content';UI.sel.caf={k:'题'};render();
UI.sel.cq={kind:'题'};UI.sel.clist={page:1,size:20};
const q0=S.qs[0];UI.sel.cqs=q0.stem.slice(0,8);render();
CK('内容中心仍是题/演练唯一维护入口',document.querySelector('#main').innerText.includes(q0.stem.slice(0,8)));
UI.sel.cqs='';

/* 2. 上架页：筛选网格 + 表格可横滚 */
UI.page='publish';UI.tab.publish='已上架';render();
CK('上架筛选使用网格布局',!!document.querySelector('#main .pub-filter-grid'));
CK('发布时间是完整日期范围',!!document.querySelector('#main .pub-range-row')&&document.querySelectorAll('#main .pub-range-row input[type=date]').length===2);
CK('上架表格有滚动容器',!!document.querySelector('#main .pub-table-wrap'));
const pt=document.querySelector('#main .pub-table-wrap');
CK('上架表格可横向滚动',pt.scrollWidth>=pt.clientWidth,pt.scrollWidth+'/'+pt.clientWidth);
CK('上架表格列数不超过 9',document.querySelectorAll('#main .pub-table-wrap thead th, #main table.t th').length<=9);
CK('上架页提示可左右滑动',/左右滑动/.test(tx()));

/* 3. 学习项目：缺失项提示 + 确认弹窗 */
A.formNew();render();
const fd=document.querySelector('#dock-root .form-dock');
CK('学习项目底部显示缺失项',!!fd&&/还差/.test(fd.innerText),fd&&fd.innerText);
CK('学习项目提交按钮改为检查并提交',!!document.querySelector('#dock-root [data-act=fsubmit]'));
CK('缺失项可点击跳转',!!document.querySelector('#dock-root .form-dock [data-act=jump]'));
F.name='测试项目';F.goal.target=String(+(baseNow()+5).toFixed(1));
A.fsubmit();
CK('提交前弹出确认',!!document.querySelector('#dlg')&&/提交前确认/.test(document.querySelector('#dlg').innerText));
CK('确认弹窗含项目/目标/锁定说明',/项目/.test(document.querySelector('#dlg').innerText)&&/目标/.test(document.querySelector('#dlg').innerText)&&/锁定/.test(document.querySelector('#dlg').innerText));
closeDlg();
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
