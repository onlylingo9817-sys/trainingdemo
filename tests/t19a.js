const L=m=>out.push(m);const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});
L('kps='+S.kps.length+' cand='+S.kpCand.length+' mounted='+S.contents.filter(c=>(c.kps||[]).length).length+'/'+S.contents.length);
const st=kpStats();L('stats '+JSON.stringify(st));
KP_TABS.forEach(t=>{UI.page='catalog';UI.tab.catalog=t;try{render();L('catalog '+t+' len='+tx().length)}catch(e){L('ERR catalog '+t+' '+e.message+' @'+(e.stack||'').split('\n')[1])}});
S.kps.forEach(k=>{UI.page='kp';UI.kid=k.id;try{render()}catch(e){L('ERR kp '+k.id+' '+e.message+' @'+(e.stack||'').split('\n')[1])}});L('all kp detail ok');
A.kpNew();render();L('form ok '+tx().length);KF.name='测试点';A.kfSave();L('new kp '+UI.kid+' st='+kp(UI.kid).st);
KF=null;A.kpEdit();render();A.kfCancel();
// 没负责人不能启用
const bad=S.kps.find(k=>!k.owner&&k.st==='停用');UI.kid=bad.id;A.kpToggle();L('enable w/o owner -> '+bad.st);
A.kpOwner({value:'王磊'});A.kpToggle();L('after owner -> '+bad.st);
// 挂载
const un=S.contents.filter(c=>!(c.kps||[]).length&&c.st!=='已归档');L('unmounted '+un.length+' e.g. '+un.slice(0,3).map(c=>c.id+':'+recKps(c).map(k=>k.name).join('/')).join(' | '));
const n0=un.length;A.kpAcceptAll();L('acceptAll -> unmounted '+S.contents.filter(c=>!(c.kps||[]).length&&c.st!=='已归档').length+' (was '+n0+')');
// 候选
A.kpCandOk({dataset:{id:'C3'}});L('cand C3 -> '+S.kpCand[2].st+' newKp='+UI.kid+' st='+kp(UI.kid).st);
A.kpCandMerge({dataset:{id:'C1'}});L('cand C1 -> '+S.kpCand[0].st+' syn5='+kp('K5').syn.slice(-1));
// 清河
const qh=S.kps.filter(kpUsesQH);L('qh points '+qh.length+' ownable '+qh.filter(k=>kpOwnQn(k)>=S.cfg.kpQ).map(k=>k.id).join(','));
const k22=kp('K22');A.kpQhOff({dataset:{id:'K22'}});L('K22 qh off: usesQH='+kpUsesQH(k22)+' ext='+k22.ext.map(e=>e.src).join('/'));
// 新车型复制
UI.page='config';UI.tab.config='知识点规则';render();$('#kp_cp_from').value='N90 Max';$('#kp_cp_to').value='YU7 Max';A.kpCopy();const ny=S.kps.filter(k=>k.car==='YU7 Max');L('copy YU7: '+ny.length+' st='+[...new Set(ny.map(k=>k.st))]+' inTax='+S.cfg.tax.car.includes('YU7 Max'));
// 门槛
UI.page='config';UI.tab.config='知识点规则';render();$('#kp_q').value='3';A.kpCfg();L('kpQ='+S.cfg.kpQ);
// 内容编辑页挂载
A.cEdit({dataset:{id:'N101'}});render();L('edit has picker='+/知识点/.test(tx()));C.kps=['K1'];A.cKpAdd({value:kpPickLbl(kp('K2'))});L('edit kps='+C.kps.join(','));A.cSave({dataset:{s:'0'}});L('saved N101 kps='+content('N101').kps.join(','));
// 详情页/列表筛选
A.cView({dataset:{id:'N101'}});render();L('detail shows kp='+/极致储物/.test(tx()));
UI.page='content';UI.tab.content='内容列表';UI.sel.cq={kp:'未挂载'};render();L('list filter 未挂载 ok '+tx().length);UI.sel.cq={kp:'K1'};render();L('list filter K1 ok');UI.sel.cq={};
// 零售通
document.body.dataset.end='rn';ME=PEOPLE[0];R.page='school';renderRN();L('rn school has 提升清单='+/我的提升清单/.test($('#rscr').innerText));
A.rgo?rgo('adapt'):0;renderRN();L('rn adapt before diag: '+/先测一测/.test($('#rscr').innerText));
A.adDiag();let _g=0;while(QZ&&!QZ.end&&_g++<40){const q=qzQ();QZ.picked=[(q.ans[0]+1)%q.opts.length];if(q.type==='多选')QZ.picked=[0];A.qzSubmit();A.qzNext()}A.qzExit();L('rn after diag: tested='+adaptTested(ME.mid).length+' weak='+adaptList(ME.mid).filter(x=>x.m.v<KP_PASS).length);
const w=adaptList(ME.mid).find(x=>x.m.v<KP_PASS);if(w){let g=0;while(mst(ME.mid,w.k.id).v<KP_PASS&&g++<10){A.adPractice({dataset:{k:w.k.id}});let h=0;while(QZ&&!QZ.end&&h++<10){const q=qzQ();QZ.picked=q.ans.slice();A.qzSubmit();A.qzNext()}A.qzExit()}L('practice -> '+w.k.name+' v='+mst(ME.mid,w.k.id).v+' tries='+mst(ME.mid,w.k.id).tries+' next='+mst(ME.mid,w.k.id).next)}
const lk=adaptList(ME.mid).find(x=>kpMounted(x.k).some(c=>isPub(c)));A.adLearn({dataset:{k:lk.k.id}});L('learn sheet zone='+(R.sheet&&R.sheet.zone));R.sheet=null;renderRN();
document.body.dataset.end='pc';render();
// 重置后(示例数据)
A.reset();L('reset: kps='+S.kps.length+' cfg.kpQ='+S.cfg.kpQ);A.clear();L('clear: kps='+S.kps.length);UI.page='catalog';['完备度看板','未挂载内容','待确认候选','脱离清河','规则'].forEach(t=>{UI.tab.catalog=t;try{render()}catch(e){L('ERR clear '+t+' '+e.message)}});L('clear pages ok');
}catch(e){L('TOP '+e.message+' @'+(e.stack||'').split('\n')[1])}
