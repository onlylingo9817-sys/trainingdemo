const L=m=>out.push(m);const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});
// ① 上架弹窗:未挂载提示 + 一键挂载
const un=S.contents.find(c=>!(c.kps||[]).length&&usableC(c)&&!isPub(c));
if(un){A.cPub({dataset:{id:un.id}});const t1=document.querySelector('#dlg').innerText;L('①未挂载上架弹窗: '+un.id+' hint='+/还没挂知识点/.test(t1)+' rec='+recKps(un).map(k=>k.id).join(','));
  const r=recKps(un)[0];if(r){A.kpPubMount({dataset:{id:un.id,k:r.id}});const t2=document.querySelector('#dlg').innerText;L('①挂载后弹窗: kps='+un.kps+' hint已挂='+/已挂载知识点/.test(t2));}closeDlg()}else L('①(没有已定稿未上架且未挂载的内容)');
const mounted=S.contents.find(c=>(c.kps||[]).length&&usableC(c));A.cPub({dataset:{id:mounted.id}});L('①已挂载上架弹窗 hint='+/已挂载知识点/.test(document.querySelector('#dlg').innerText));closeDlg();
// ② 零售通发布页有知识点列(先造待上架 / 推荐位数据,否则空页签没有表头)
const _c0=S.contents.find(x=>usableC(x)&&!isPub(x)&&(x.kps||[]).length);if(_c0){A.cPub({dataset:{id:_c0.id}});document.querySelector('#pu_pt').value='定时发布';A.cPubOk({dataset:{id:_c0.id}})}const _d0=S.contents.find(x=>isPub(x));if(_d0)_d0.recommend={on:true,until:addDays(today,20)};
PTABS.forEach(t=>{UI.page='publish';UI.tab.publish=t;try{render();L('②发布页 '+t+' 有知识点列='+/知识点/.test(tx()))}catch(e){L('ERR publish '+t+' '+e.message+' @'+(e.stack||'').split('\n')[1])}});
// ② 知识点详情页「怎么补」
S.kps.forEach(k=>{UI.page='kp';UI.kid=k.id;try{render()}catch(e){L('ERR kp '+k.id+' '+e.message+' @'+(e.stack||'').split('\n')[1])}});
['K3','K7','K12','K17'].forEach(id=>{UI.page='kp';UI.kid=id;render();const h=kpHealth(kp(id));L('②'+id+' 讲解='+h.cells.exp.s+' 怎么补='+/怎么补/.test(tx())+' | '+(tx().match(/怎么补[\s\S]{0,90}/)||[''])[0].replace(/\n/g,' ')+' | 掌握度卡='+/学员掌握度/.test(tx()))});
// ③ 看板弱点人数列 + 掌握度卡
UI.page='catalog';UI.tab.catalog='完备度看板';render();L('③看板有弱点人数列='+/弱点人数/.test(tx())+' 集中薄弱卡='+/学员集中薄弱/.test(tx()));
L('③weakList='+kpWeakList().map(x=>x.k.id+':'+x.w+'/'+x.t).join(','));
// ④ 生成课题 → 课题池 → 新建内容带知识点 → 保存 → 上架 → 学员复测
const wl=kpWeakList();let target;
if(wl.length){target=wl[0].k;const n0=S.topics.length;A.kpToTopic({dataset:{id:target.id}});const tp=kpTopicOf(target);L('④生成课题 '+tp.id+' topics '+n0+'→'+S.topics.length+' kpId='+tp.kpId+' 标题='+tp.title);
  A.kpToTopic({dataset:{id:target.id}});L('④重复生成不新增 topics='+S.topics.length);
  UI.page='topics';UI.tab.topics='发现的问题';render();L('④课题池能渲染 含课题='+tx().includes(tp.id));UI.page='topic';UI.tid=tp.id;try{render();L('④课题详情渲染 ok')}catch(e){L('ERR topic detail '+e.message+' @'+(e.stack||'').split('\n')[1])}
  A.cNew({dataset:{t:tp.id}});L('④由课题新建内容 C.kps='+C.kps+' car='+C.car);
  C.title='联动测试内容 · '+target.name;C.cover='x.png';C.kw=(target.syn||[])[0]||'联动';C.spin={S:'哥，测试情境。',P:'测试痛点。',I:'测试**影响**。',N:'测试需求收益。'};C.bscene='展厅';C.lecturer='王磊';
  A.cSave({dataset:{s:'1'}});const nc=S.contents[0];L('④保存提交 '+nc.id+' st='+nc.st+' kps='+nc.kps);
  A.cReview({dataset:{id:nc.id}});A.cPass({dataset:{id:nc.id}});L('④通过 st='+nc.st);
  const before=kpHealth(target).cells.exp.s;A.cPub({dataset:{id:nc.id}});A.cPubOk({dataset:{id:nc.id}});L('④上架 pub='+pubOf(nc)+' 讲解格 '+before+'→'+kpHealth(target).cells.exp.s);
  // 学员:提升清单里「学一学」能点到
  document.body.dataset.end='rn';ME=PEOPLE.find(p=>mst(p.mid,target.id))||PEOPLE[1];renderRN();rgo('adapt');renderRN();L('④零售通提升清单含该点='+$('#rscr').innerText.includes(target.name));
  A.adLearn({dataset:{k:target.id}});L('④学一学 sheet zone='+(R.sheet&&R.sheet.zone));R.sheet=null;
  // 学员复测:练到过关
  if(!mst(ME.mid,target.id)){mstSet(ME.mid,target.id,{v:30,tries:0})}
  let g=0;while(mst(ME.mid,target.id)&&mst(ME.mid,target.id).v<KP_PASS&&g++<10){A.adPractice({dataset:{k:target.id}});let h=0;while(QZ&&!QZ.end&&h++<10){const q=qzQ();QZ.picked=q.ans.slice();A.qzSubmit();A.qzNext()}A.qzExit()}
  document.body.dataset.end='pc';render();
  const w0=wl[0].w;UI.page='kp';UI.kid=target.id;render();L('④复测后 弱点 '+w0+'→'+kpWeak(target)+' 详情页掌握度卡='+/学员掌握度/.test(tx()));
}else L('④无集中薄弱的知识点');
// 全部生成
A.kpToTopicAll();L('④全部生成后 weakList 都有课题='+kpWeakList().every(x=>kpTopicOf(x.k)));
// 三种身份 + 旧页面不炸
['r1','boss'].forEach(r=>{A.roleSwitch({value:r});const ok=PAGES_OK[UI.role.type];if(ok.includes('publish')){UI.page='publish';PTABS.forEach(t=>{UI.tab.publish=t;try{render()}catch(e){L('ERR '+r+' publish '+t+' '+e.message)}})}if(ok.includes('catalog')){UI.page='catalog';KP_TABS.forEach(t=>{UI.tab.catalog=t;try{render()}catch(e){L('ERR '+r+' catalog '+t+' '+e.message)}})}L(r+' ok')});
A.roleSwitch({value:'hq'});
}catch(e){L('TOP '+e.message+' @'+(e.stack||'').split('\n')[1])}
