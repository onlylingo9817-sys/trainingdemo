const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
const x=coachPlanOf(S.tickets.find(t=>t.st==='触发')||coachNewTicket({store:'北京望京店',proj:S.projects[0].id,src:'推荐辅导店',goal:'留资率 40% → 45%',pre:40,trig:'目标未达成'}));
const rx=coachPrescribe(x);
CK('处方生成学/练/检/馈/目标',rx.learn.length>0&&rx.practice.length>0&&!!rx.goal&&!!rx.feedback,JSON.stringify(rx.learn)+' / '+JSON.stringify(rx.practice));
CK('处方附依据',/触发证据/.test(rx.basis));
const before=x.learn.length;
CK('生成处方不写入计划',x.learn.length===before&&!x.goalTarget);
UI.sel.coachTab='计划';A.ticket({dataset:{id:x.id}});
CK('计划页显示处方卡',/门店处方/.test(document.querySelector('#dlg').innerText));
A.coachPrescribeFill({dataset:{id:x.id}});
const x2=S.tickets.find(t=>t.id===x.id);
CK('采纳后填入学/练项',x2.learn.map(r=>r.name).join('')===rx.learn.join('')||x2.learn.some(r=>rx.learn.includes(r.name)),x2.learn.map(r=>r.name).join('、'));
CK('采纳后记录留痕',(S.aiLog||[]).some(a=>a.type==='门店处方填入计划'));
const tcount=S.topics.length;
x.st='复测';x.closeWhy='';
document.body.dataset.nosink='1';
UI.sel.coachTab='结案';A.ticket({dataset:{id:x.id}});
CK('未勾选沉淀则不进课题池',S.topics.length===tcount,'');
UI.sel.coachTab='结案';A.ticket({dataset:{id:x.id}});document.querySelector('#coach_close_why').value='先认同再算账有效';document.querySelector('#coach_sink').checked=true;
coachSinkTopic(x,'先认同再算账有效');
CK('沉淀后课题池多一条并回写工单',S.topics.length===tcount+1&&!!x.topicId&&S.topics.some(t=>t.id===x.topicId),x.topicId||'');
coachSinkTopic(x,'先认同再算账有效');
CK('重复沉淀不再新增课题',S.topics.length===tcount+1);

const CHECKS_ALL=COACH_CHECK.pre.map(r=>r[0]).concat(COACH_CHECK.during.map(r=>r[0]));
const badRx=CHECKS_ALL.filter(n=>{const t=coachPlanOf({id:'Z',st:'触发',store:'x',goal:'留资率 40% → 45%',pre:40,trig:'目标未达成',checks:{pre:[{name:n,done:false}],during:[]},feedback:[],log:[]});return coachPrescribe(t).learn.length!==1||coachPrescribe(t).practice.length!==1});
CK('每个检核项都有明确的学/练映射',badRx.length===0,badRx.join('、'));
const tn=S.topics.length;const tz=coachPlanOf(coachNewTicket({store:'测试店',proj:S.projects[0].id,src:'推荐辅导店',goal:'留资率 40% → 45%',pre:40,trig:'目标未达成'}));
tz.st='复测';UI.sel.coachTab='结案';A.ticket({dataset:{id:tz.id}});document.querySelector('#coach_close_why').value='';document.querySelector('#coach_sink').checked=true;
A.coachClose({dataset:{id:tz.id}});
CK('复盘为空时结案被拒绝',tz.st==='复测',tz.st);
CK('复盘为空时不沉淀课题',S.topics.length===tn,'');
document.querySelector('#coach_close_why').value='先认同再算账有效';
A.coachClose({dataset:{id:tz.id}});
CK('复盘有值且勾选时结案并沉淀',tz.st==='结案'&&S.topics.length===tn+1&&!!tz.topicId);
CK('沉淀课题不伪造会话证据',(S.topics.find(t=>t.id===tz.topicId)||{}).stats.sess===0);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
