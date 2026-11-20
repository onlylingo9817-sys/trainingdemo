const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.reset();A.roleSwitch({value:'hq'});closeDlg();
/* —— 建一个带「学习包」节点的学习项目(走真实 compile + afterPublish) —— */
const tpl=S.packTpl[0];
const kp4=S.kps.find(k=>k.id==='K4')||S.kps.find(k=>k.st==='启用');
const node=mkNode('学习','学习包',{tpl:tpl.id+' · '+tpl.name,kp:kp4.id+' '+kp4.name});
const p={id:'P'+(S.projects.length+1),name:'学习包节点测试',type:'专题训',sub:'政策类',status:'已生效',start:today,end:addDays(today,30),finishType:1,finishDays:30,finishTime:addDays(today,45),cover:{tag:'全员',positions:['门店岗位'],regions:['华北'],mids:'',useMid:false},mids:[],aud:{regions:['华北'],level:'全体'},guide:'',stages:[{modules:[{name:'学习包模块',nodes:[node]}]}],from:null,gray:null,off:false};
compile(p);S.projects.unshift(p);
const pn=p.nodes.find(n=>n.rel==='学习包');
CK('编译出学习包节点并解析模板/知识点',!!pn&&pn.packTpl===tpl.id&&pn.packKp===kp4.id,JSON.stringify(pn&&{tpl:pn.packTpl,kp:pn.packKp}));
const pk0=S.packs.length;
afterPublish(p);
const eligibleN=PEOPLE.filter(x=>eligible(p,x)).length;
CK('项目生效后为覆盖学员物化学习包',S.packs.length===pk0+eligibleN&&eligibleN>0,'新增 '+(S.packs.length-pk0)+' / 覆盖 '+eligibleN);
CK('物化带模板步数与 need',S.packs[0].steps.length===tpl.steps.length&&S.packs[0].steps[1].need===tpl.steps[1][1]);
/* —— 学员视角:节点可见、可进入、步骤按证据推进 —— */
document.body.dataset.end='rn';
ME=PEOPLE.find(x=>eligible(p,x));R.stack=[];R.pid=p.id;R.page='trainDetail';renderRN();
CK('任务详情出现学习包节点',/学习包/.test(document.querySelector('#rscr').innerText));
A.rTask({dataset:{pid:p.id,n:pn.id}});
CK('点节点进入学习包详情',R.page==='pack'&&!!R.packId);
const pk=S.packs.find(x=>x.id===R.packId);
CK('重复进入复用同一实例(幂等)',S.packs.length===pk0+eligibleN);
/* —— R2b:复测按步独立开放 —— */
const retest=pk.steps.find(s=>s.t==='复测');
if(retest){
  CK('复测 initially 锁:先完成前面的步骤',/先完成前面的步骤|后开放/.test(packStepLock(pk,retest,pk.steps.indexOf(retest))));
  pk.steps.filter(s=>s.t!=='复测').forEach(s=>packAdvance(pk,s.t==='学'?'学':s.t==='演练'?'演练':'题',null));
  CK('前置步骤完成后复测获得独立开放时间',!!retest.openAt&&retest.openAt===addDays(today,3),'openAt='+retest.openAt);
  CK('开放日未到仍锁定',/天后开放/.test(packStepLock(pk,retest,pk.steps.indexOf(retest))));
  retest.openAt=today;
  CK('到达开放日后解锁',packStepLock(pk,retest,pk.steps.indexOf(retest))==='');
  packAdvance(pk,'复测',null);
  CK('复测完成后学习包整体完成',pk.status==='已完成');
  CK('项目节点随学习包完成而完成',stepDone(p,pn)===true);
}else CK('模板无复测步骤(跳过)',true);
document.body.dataset.end='pc';
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
