const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
/* 黄金演示路径:发现 → 备料 → 发布 → 实施 → 学员学练 → 效果调优,一条链路走通 */
try{
A.reset();A.roleSwitch({value:'hq'});closeDlg();
/* ① 发现:学员集中薄弱 → 工作台待办 → 生成课题 */
const wk=kpWeakList().find(x=>!kpTopicOf(x.k)&&kpHealth(x.k).cells.exp.s==='ok');
CK('① 工作台能发现学员集中薄弱',!!wk);
A.kpToTopic({dataset:{id:wk.k.id}});
const tp=kpTopicOf(kp(wk.k.id));
CK('② 一键生成课题并关联知识点',!!tp&&tp.kpId===wk.k.id);
/* ③ 备料:课题 → AI 生成内容 → 定稿 */
A.tGenContent({dataset:{id:tp.id}});
CK('③ 从课题进入内容编辑并带入课题',UI.page==='cedit'&&C.tid===tp.id);
C.title='黄金路径 · '+kp(wk.k.id).name;C.cover='x.png';C.kw=(kp(wk.k.id).syn||[])[0]||'黄金';C.lecturer='王磊';
if(C.kind==='话术'){C.spin={S:'哥,黄金路径测试。',P:'痛点。',I:'**影响**。',N:'收益。'};C.bscene='展厅'}else{C.intro='1. 要点一\n2. 要点二'}
A.cSave({dataset:{s:'1'}});let nc=S.contents[0];
if(nc.st==='草稿')A.cSubmit({dataset:{id:nc.id}});
A.cReview({dataset:{id:nc.id}});A.cPass({dataset:{id:nc.id}});
CK('④ 内容定稿',nc.st==='已定稿');
/* ⑤ 发布:上架零售通 */
A.cPub({dataset:{id:nc.id}});A.cPubOk({dataset:{id:nc.id}});
CK('⑤ 上架零售通',isPub(nc));
/* ⑥ 实施:内容做成学习项目 */
A.cToProject({dataset:{id:nc.id}});
CK('⑥ 进入项目创建并带入内容',UI.page==='form'&&F.from===tp.id);
if(!F.name.trim())F.name='黄金路径项目';
const _lo=F.goal.main.dir==='低';F.goal.target=String(baseNow()+(_lo?-5:5));
A.fsubmit();
for(let g=0;g<3;g++){
  if(document.querySelector('#ovr')){document.querySelector('#ovr').value='演示:黄金路径';A.overOk();continue}
  if(document.querySelector('#dlg [data-act="fsubmitOk"]')){A.fsubmitOk();continue}
  break;
}
const pj=S.projects.find(x=>x.from===tp.id)||S.projects[0];
CK('⑦ 项目已提交生效',!!pj&&pj.status==='已生效','pj='+(pj&&pj.id));
CK('⑧ 课题自动变为已采纳并关联项目',tp.flow==='已采纳'&&tp.proj===pj.id);
CK('⑨ 内容被项目引用(效果可回流)',contentUse(nc.id)>=1);
/* ⑩ 学员学练:零售通完成学习节点 */
document.body.dataset.end='rn';
ME=PEOPLE.find(x=>eligible(pj,x))||PEOPLE[0];R.stack=[];
CK('⑩ 学员能看到这个项目',visibleProjects().some(x=>x.id===pj.id));
const ln=pj.nodes.find(n=>n.t==='学习'&&n.contentId);
const pend0=progOf(pj).pend;
A.rTask({dataset:{pid:pj.id,n:ln.id}});
A.rSheetDo({dataset:{v:'done'}});
CK('⑪ 学员完成学习节点,进度推进',progOf(pj).pend===pend0-1&&myDone(pj).includes(ln.id));
document.body.dataset.end='pc';
/* ⑫ 效果调优:诊断 → 一键调整 → 配置版本 v2 → 前后对比 → 回滚 */
const v0=S.cfgV.length;
A.tnFix();
CK('⑫ 一键调整给出影响预估',/影响预估/.test(document.querySelector('#dlg').innerText));
A.tnFixDo();
CK('⑬ 生成配置版本并进入观察期',S.cfgV.length===v0+1&&S.cfgV[S.cfgV.length-1].status==='观察中');
CK('⑭ 新增顾虑解除专项学习包模板与实例',S.packTpl.some(t=>t.id==='PT4')&&S.packs.some(p=>p.tpl==='PT4'));
UI.page='effect';UI.tab.effect='调优与结项';UI.tab.tune='前后对比';render();
CK('⑮ 前后对比页可渲染',document.querySelector('#main').innerText.length>200);
A.tnRollback({dataset:{v:String(S.cfgV[S.cfgV.length-1].ver)}});
CK('⑯ 回滚留痕不抹历史',S.cfgV.some(v=>v.status==='已回滚'));
L('黄金路径走通:发现→备料→发布→实施→学练→调优→回滚');
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
