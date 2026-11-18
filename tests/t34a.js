const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
const tabTexts=()=>[...document.querySelectorAll('#main .tab')].map(e=>e.innerText.trim());
try{
closeDlg();
/* 1. 老板：不得出现任何学员姓名 / MID */
const names=[...new Set(S.lrn.map(l=>l.name).concat(PEOPLE.map(p=>p.name)))].filter(Boolean);
const mids=[...new Set(S.lrn.map(l=>l.mid).concat(PEOPLE.map(p=>p.mid)))].filter(Boolean);
A.roleSwitch({value:'boss'});
const bossViews=[['overview','老板视图'],['overview','流程与规则'],['effect','效果看板'],['effect','就绪度'],['effect','错题集'],['effect','人员'],['effect','效果报告']];
let bossLeakName=[],bossLeakMid=[];
bossViews.forEach(([p,t])=>{UI.page=p;UI.tab[p]=t;render();const x=tx();
  names.forEach(n=>{if(n&&x.includes(n))bossLeakName.push(p+'/'+t+':'+n)});
  mids.forEach(m=>{if(m&&x.includes(String(m)))bossLeakMid.push(p+'/'+t+':'+m)});
});
CK('老板所有可见页不含学员姓名',bossLeakName.length===0,bossLeakName.slice(0,6).join(', '));
CK('老板所有可见页不含 MID',bossLeakMid.length===0,bossLeakMid.slice(0,6).join(', '));
UI.page='effect';UI.tab.effect='人员';render();
CK('老板效果追踪无「人员」页签',!tabTexts().includes('人员'),tabTexts().join('/'));

/* 2. 区域老师：不得出现外区学员姓名 */
A.roleSwitch({value:'r1'});
const outside=names.filter(n=>{const x=S.lrn.find(l=>l.name===n)||PEOPLE.find(p=>p.name===n);return x&&x.region!=='华北'});
const regionViews=[['effect','就绪度'],['effect','错题集'],['effect','人员'],['approvals','']];
let regionLeak=[];
regionViews.forEach(([p,t])=>{UI.page=p;if(t)UI.tab[p]=t;render();const x=tx();outside.forEach(n=>{if(n&&x.includes(n))regionLeak.push(p+'/'+t+':'+n)})});
CK('区域老师看不到外区学员姓名',regionLeak.length===0,regionLeak.slice(0,6).join(', '));

/* 3. 区域老师不能改全局配置 */
const v0=S.cfgV.length,w0=JSON.stringify(S.cfg.srcW);
A.tnFix();A.tnFixDo();
CK('区域老师不能创建调整项',S.cfgV.length===v0&&JSON.stringify(S.cfg.srcW)===w0,'v='+(S.cfgV.length-v0)+' cfg='+(JSON.stringify(S.cfg.srcW)!==w0));
const v1=S.cfgV.length;
A.tnRollback({dataset:{v:S.cfgV[S.cfgV.length-1].ver}});
CK('区域老师不能回滚配置',S.cfgV.length===v1);
UI.page='effect';UI.tab.effect='调优';UI.tab.tune='诊断';render();
CK('区域老师调优页无「一键创建调整项」按钮',![...document.querySelectorAll('#main button,#main a')].some(e=>/一键创建调整项/.test(e.innerText)));

/* 4. 标签管理入口：区域老师隐藏，总部可见 */
UI.page='content';UI.tab.content='全部内容';render();
CK('区域老师无「管理标签」按钮',![...document.querySelectorAll('#main button,#main a')].some(e=>/管理标签/.test(e.innerText)));
A.roleSwitch({value:'hq'});
UI.page='content';UI.tab.content='全部内容';render();
CK('总部有「管理标签」按钮',[...document.querySelectorAll('#main button,#main a')].some(e=>/管理标签/.test(e.innerText)));
A.tagOpenManage();render();
CK('总部可进入配置中心标签管理',UI.page==='config'&&UI.tab.config==='标签管理');

/* 5. 工作台候选落点 */
A.roleSwitch({value:'hq'});UI.page='workbench';render();
A.wbCand();
CK('候选待办落到「候选」页签',UI.page==='catalog'&&UI.tab.catalog==='候选','落点='+UI.page+'/'+UI.tab.catalog);
const cand=tx();
CK('候选页包含候选表头',/候选|类型|车型|来源/.test(cand));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
