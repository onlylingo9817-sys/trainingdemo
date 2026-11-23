const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
/* t52a：49 点分组、旧资源迁移、演示年款不串、接待任务证据分开 */
try{
A.roleSwitch({value:'hq'});closeDlg();A.reset();
CK('49 个知识点且含澎程增程专项',S.kps.filter(k=>String(k.code||'').indexOf('XM-')===0).length===49&&kp('XM-P18')&&(kp('XM-P18').cars||[]).indexOf('澎程 N70')>=0);
UI.page='catalog';UI.tab.catalog='知识点库';render();
CK('默认按领域分组',/基础/.test(tx())&&/销售旅程/.test(tx())&&/成交交接/.test(tx())&&/产品专项/.test(tx()));
UI.sel.kpf={grp:'基础',q:''};render();
CK('筛选后只留有结果的组',/基础 ·/.test(tx())&&!/销售旅程 ·/.test(tx()));
UI.sel.kpf={q:'XM-O07'};render();
CK('搜索能找到置换协同',/置换评估协同/.test(tx()));
UI.sel.kpf={};A.kpOpen({dataset:{id:'XM-P18'}});
CK('详情有学习结果和包括不包括',/能在已核实的增程规则下/.test(tx())&&/不包括/.test(tx())&&/待核实/.test(tx()));
CK('超强钢题按主题改挂到被动安全',qById('Q4').kp==='XM-P06'&&qById('Q4').kpMap==='已迁移');
CK('对不上的资源标成待整理',S.qs.some(q=>q.kpMap==='待整理'));
const mid=S.lrn[0].mid;const old=(kp('XM-S11').aliasIds||[])[0];
S.mastery[mid]={[old]:{v:88}};S.cfg.kpInit='';kpMigrateV13(true);
const after=S.mastery[mid]||{};
CK('拆分旧点的成绩不会复制成多个新点都掌握',!(after['XM-S11']&&after['XM-S11'].v===88&&after['XM-O02']&&after['XM-O02'].v===88));
S.kps.push({id:'KUSER',code:'LOCAL-1',name:'门店自建点',group:'自建',domain:'自建',st:'启用',roles:['零售顾问'],cars:['通用车型'],pri:'P1',one:'门店自己加的'});
S.cfg.kpInit='';kpMigrateV13(true);
CK('自建知识点还在',!!kp('KUSER')&&kp('KUSER').name==='门店自建点');
CK('年款A的讲解覆盖不了年款B',kpYearFits(content('C_YEAR_A'),'演示年款A')&&!kpYearFits(content('C_YEAR_A'),'演示年款B')&&kpYearFits(content('C_YEAR_B'),'演示年款B'));
R.diagYear='演示年款B';
const picked=qPick(mid,'XM-P02',5,'diag','SU7').map(q=>q.id);
CK('抽题不会把年款A的题抽进年款B',picked.indexOf('Q_YEAR_A')<0&&picked.indexOf('Q_YEAR_B')>=0,picked.join(','));
R.diagYear='';
document.body.dataset.end='rn';R.packId='PK_R01';R.page='pack';renderRN();
CK('接待任务引用指定资源且允许不下订',/可不下订/.test(document.body.innerText)&&/演示年款A/.test(document.body.innerText));
A.trainObs({dataset:{id:'PK_R01'}});
const pk=S.packs.find(p=>p.id==='PK_R01');
CK('实操记录不写进题目成绩',pk.observe&&pk.observe.length===1&&pk.observe[0].sim===true);
CK('异常和置换演练在',!!drById('D_E01')&&/不能答应几天/.test(drById('D_E01').turns[0].ref)&&!!drById('D_T01'));
document.body.dataset.end='pc';
CK('页面无 undefined / NaN',!/undefined|NaN/.test(document.querySelector('#main').innerHTML));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' | '))}
