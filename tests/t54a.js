const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
/* t54a：总览和知识图谱跟随 49 点领域分组，口径与知识点库一致 */
try{
A.roleSwitch({value:'hq'});closeDlg();A.reset();
const order=kpGroupOrder();const act=S.kps.filter(k=>k.st==='启用');
CK('领域顺序与知识点库一致且是 8 个',order.join('/')==='基础/产品共性/产品专项/销售旅程/成交交接/客户经营/交付服务/带教管理',order.join('/'));
UI.page='catalog';UI.tab.catalog='总览';render();
CK('总览不再有旧的卖点分类/能力项表',!/车型 × 卖点分类|车型 × 能力项/.test(tx()));
CK('总览有各领域进展和车型×领域',/各领域进展/.test(tx())&&/车型 × 领域/.test(tx()));
const ctx=UI.sel.kpOv;const s=kpV12Summary(ctx);const rows=kpUxGroupRows(ctx);
CK('各领域应覆盖相加等于总览应覆盖',rows.reduce((a,r)=>a+r.n,0)===s.n,rows.reduce((a,r)=>a+r.n,0)+' / '+s.n);
CK('各领域可授课、可考核相加等于总览',rows.reduce((a,r)=>a+r.t,0)===s.t&&rows.reduce((a,r)=>a+r.a,0)===s.a);
CK('各领域点数相加等于 49',rows.reduce((a,r)=>a+r.total,0)===49);
CK('热力表列是领域',[...document.querySelectorAll('.ux-heat tr:first-child th')].slice(1).map(x=>x.textContent).join('/')===order.join('/'));
const cell=document.querySelector('.ux-cell');A.kpHeatGo({dataset:{kind:cell.dataset.kind,car:cell.dataset.car,col:cell.dataset.col}});
const hf=kpLibFilter();
CK('点热力格进入对应领域和车型的列表',UI.tab.catalog===KP_TAB_LIB&&hf.grp===cell.dataset.col&&hf.car===cell.dataset.car);
const want=S.kps.filter(k=>kpV12ListMatch(k,hf)).length,got=[...document.querySelectorAll('.kp-group tr.kp-click')].length;
CK('列表行数等于筛选结果',got===want&&want>0,got+' / '+want);
UI.page='catalog';UI.tab.catalog='总览';render();
A.kpGrpGo({dataset:{g:'销售旅程'}});
CK('点领域行带着口径进列表',UI.tab.catalog===KP_TAB_LIB&&kpLibFilter().grp==='销售旅程'&&/销售旅程 ·/.test(tx())&&!/基础 ·/.test(tx()));
UI.page='catalog';UI.tab.catalog='总览';UI.sel.kpOv.car='全部车型';UI.sel.kpOv.pri='全部';render();
CK('全部车型+全部优先级下零售顾问只有交付、带教两个领域没有应教的点',kpUxGroupRows(UI.sel.kpOv).filter(r=>!r.n).map(r=>r.g).join('')==='交付服务带教管理','岗位是零售顾问，交付与带教领域不是该岗位');
UI.sel.kpOv.role='交付顾问';render();
CK('切到交付顾问后交付服务领域有数',kpUxGroupRows(UI.sel.kpOv).find(r=>r.g==='交付服务').n>0);
UI.sel.kpOv={role:'零售顾问',car:'SU7 Pro',batch:'B3-后续',pri:'P0'};
/* 知识图谱 */
UI.tab.catalog='知识图谱';UI.sel.kgView='overview';UI.sel.kgScope='all';UI.sel.kgDim='全部';UI.sel.kgQ='';render();
CK('图谱节点数等于 49',document.querySelectorAll('.kg-node').length===49);
const legend=[...document.querySelectorAll('.kg-legend span')].map(x=>x.textContent.trim()).filter(x=>x&&!/越大/.test(x));
CK('图例是 8 个领域',legend.join('/')===order.join('/'),legend.join('/'));
CK('图谱不再用旧能力维度图例',!/探需|试乘试驾|带人辅导/.test(document.querySelector('.kg-legend').innerText));
const E=kgEdgePairs(act);
CK('关系去重：线条数等于去重后的关系数',document.querySelectorAll('.kg-net line').length===E.length&&E.length===41,document.querySelectorAll('.kg-net line').length+' / '+E.length);
CK('相关关系不再重复先学关系',E.every(e=>e[2]==='pre'||!E.some(x=>x[2]==='pre'&&[x[0],x[1]].sort().join()===[e[0],e[1]].sort().join())));
const st=[...document.querySelectorAll('.kg-ov-stats b')].map(x=>+x.textContent);
CK('统计条：49 点、先学 41、相关 0、孤岛 0',st.join()==='49,41,0,0',st.join());
CK('同组节点同色、不同组不同色',new Set(S.kps.filter(k=>k.group==='基础').map(kgColorOf)).size===1&&kgColorOf(kp('XM-B01'))!==kgColorOf(kp('XM-P01')));
A.kgPick({dataset:{id:'XM-P06'}});
const cols=[...document.querySelectorAll('.kg-col')].map(c=>c.querySelectorAll('.kg-card').length);
CK('单点关系：先学 1、当前 1、后续 1、相关 0',cols.join()==='1,1,1,0',cols.join());
CK('卡片显示领域而不是能力项',/产品共性 · 薄弱/.test(tx())&&!/产品知识（卖点分类）/.test(tx()));
const sel=document.querySelector('[data-wc=kgDim]');
CK('单点视图筛选是领域',/领域/.test(document.querySelector('.kg-toolbar').innerText)&&[...sel.options].map(o=>o.textContent).join('/')==='全部/'+order.join('/'));
A.kgDim({value:'销售旅程'});
const opts=[...document.querySelectorAll('[data-wc=kgSkill] option')];
CK('选领域后聚焦下拉只列该领域',opts.length===12&&kp(UI.sel.kgId||kgFocusId()).group==='销售旅程',opts.length+' 项');
CK('聚焦下拉带编号',/XM-S01/.test(opts[0].textContent));
A.kgView({dataset:{v:'overview'}});UI.sel.kgScope='gap';render();
const gapN=act.filter(k=>kpRowStatus(k).gap).length;
CK('只突出缺口：非缺口节点淡化，口径同知识点库',document.querySelectorAll('.kg-node.dim').length===act.length-gapN,document.querySelectorAll('.kg-node.dim').length+' / '+(act.length-gapN));
const mc=kgMiniCard(kp('XM-P06'),'前置');
CK('卡片圆点：缺讲解红',/#e5484d/.test(mc)===kpRowStatus(kp('XM-P06')).missTeach);
CK('页面无 undefined / NaN',!/undefined|NaN/.test(tx()));
/* 引导文案 */
CK('页面引导不再提标签树或卖点/能力热力图',!/车型×卖点\/能力热力图/.test(pageHelpText())&&!/按标签树的热力图/.test(JSON.stringify(TRYS)));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' | '))}
