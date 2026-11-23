const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
/* t51a：配套题库和一次学习安排分开。100 道只在本页临时造。 */
try{
A.roleSwitch({value:'hq'});closeDlg();A.reset();
const ex0=kpV12Summary({role:'零售顾问',car:'SU7 Pro',batch:'B3-后续',pri:'P0'});
CK('占位口径仍是 24/24/36',ex0.n===33&&ex0.cov===24&&ex0.teach===24&&ex0.assess===36);
const c=content('N_CEMN1');
const ids=[];
for(let i=0;i<100;i++){
  const id='QC'+i;
  S.qs.push({id,kp:'K3',type:'单选',stem:'配套题 '+i,opts:['对','错'],ans:[0],why:'隔离测试',lv:1,src:'',st:'已定稿',role:i<8?'锚题':'练习题',owner:'王磊',created:today,stat:{n:0,ok:0},carScope:i===0?['YU7']:[],carScopeManual:false});
  ids.push(id);
}
kpPicks(c).qs=ids.slice();
const drill=S.drills.find(d=>d.st==='已定稿');
kpPicks(c).drills=[drill.id];
const roles=ids.map(id=>id+qById(id).role).join();
c.plan={saved:true,steps:[
  {id:'learn',t:'学',req:true,contentId:c.id},
  {id:'in',t:'课中',req:true,mode:'fixed',qIds:['QC1','QC2'],n:2},
  {id:'after',t:'课后',req:false,mode:'draw',qIds:[],pool:ids.slice(),n:4},
  {id:'drill',t:'演练',req:false,drillIds:[drill.id]},
  {id:'exam',t:'考试',req:true,mode:'fixed',qIds:['QC0','QC3'],n:2}
]};
UI.cid=c.id;UI.page='cdetail';UI.ctab='内容';render();
const page=document.querySelector('#main').innerText;
CK('课程页分开配套和默认安排',/配套题库/.test(page)&&/默认安排/.test(page)&&/按默认安排建学习包/.test(page)&&/不是实时继承/.test(page));
A.cPackFrom({dataset:{id:c.id}});
const a=S.packs[0];
CK('一键建包是复制初始安排',a.arranged&&a.planCopied&&a.fromCourse===c.id&&a.bank.qs.length===100&&a.steps.find(s=>s.t==='课中').qIds.join()==='QC1,QC2'&&a.steps.find(s=>s.t==='课后').n===4);
const afterI=a.steps.findIndex(s=>s.t==='课后');
a.steps[afterI].n=2;
const drillI=a.steps.findIndex(s=>s.t==='演练');
A.planMove({dataset:{owner:'pack',id:a.id,i:String(drillI),v:'1'}});
A.planReq({dataset:{owner:'pack',id:a.id,i:String(a.steps.findIndex(s=>s.t==='演练'))}});
CK('顺序调整只写在这个包',a.steps.map(s=>s.t).join()!==c.plan.steps.map(s=>s.t).join());
A.cPackFrom({dataset:{id:c.id}});
const b=S.packs[0];
const a2=S.packs.find(p=>p.id===a.id);
CK('改一个包不影响另一个包和课程默认',b.id!==a.id&&b.steps.find(s=>s.t==='课后').n===4&&a2.steps.find(s=>s.t==='课后').n===2&&c.plan.steps.find(s=>s.t==='课后').n===4);
CK('配套还在且知识点用途没被改写',kpPicks(content(c.id)).qs.length===100&&ids.map(id=>id+qById(id).role).join()===roles&&qById('QC1').kp==='K3');
saveNow();loadNow();
const pa=S.packs.find(p=>p.id===a.id);
CK('刷新后本次抽题数量还在',pa.arranged&&pa.steps.find(s=>s.t==='课后').n===2&&kpPicks(content(c.id)).qs.length===100);
document.body.dataset.end='rn';
pa.steps.forEach(s=>{if(s.t==='学')s.done=true});
const ii=pa.steps.findIndex(s=>s.t==='课中');
A.rxPackGo({dataset:{id:pa.id,i:String(ii)}});
CK('学员课中只做点名的两道',QZ&&QZ.mode==='pack'&&QZ.ids.join()==='QC1,QC2',QZ&&QZ.ids.join());
QZ=null;
const ai=pa.steps.findIndex(s=>s.t==='课后');
pa.steps.forEach((s,i)=>{if(i<ai)s.done=true});
A.rxPackGo({dataset:{id:pa.id,i:String(ai)}});
CK('学员课后只抽出设定的数量',QZ&&QZ.ids.length===2&&QZ.ids.every(id=>pa.bank.qs.includes(id))&&QZ.ids.length!==100,QZ&&QZ.ids.join());
QZ=null;
const draw=pa.steps.find(s=>s.t==='课后');draw.n=150;draw.done=false;
const short=planIssue(draw,pa.id+'after');
CK('候选不够时说明且不拿池外的题',short.short&&short.have===100&&short.ids.length===100&&short.ids.every(id=>pa.bank.qs.includes(id))&&/只有/.test(short.note),short.note);
const examIssue=planIssue(pa.steps.find(s=>s.t==='考试'),'car','SU7');
CK('车系不符的题被拿掉且不另抓',examIssue.ids.indexOf('QC0')<0&&examIssue.ids.join()==='QC3',examIssue.ids.join());
pa.steps.forEach(s=>{if(s.t!=='考试')s.done=true});
const ei=pa.steps.findIndex(s=>s.t==='考试');
A.rxPackGo({dataset:{id:pa.id,i:String(ei)}});
CK('结业考核复用考试作答',QZ&&QZ.mode==='exam'&&QZ.ids.length&&QZ.ids.every(id=>id==='QC0'||id==='QC3'),QZ&&QZ.mode+' '+(QZ&&QZ.ids.join()));
while(QZ&&!QZ.end){const q=qById(QZ.ids[QZ.i]);QZ.picked=[q.ans[0]];A.qzSubmit();A.qzNext()}
CK('结业交卷后记下完成和得分',pa.steps.find(s=>s.t==='考试').done&&pa.steps.find(s=>s.t==='考试').score!=null);
const pb=S.packs.find(p=>p.id===b.id);
pb.steps.forEach(s=>{s.done=false;s.skip=false});
const opt=pb.steps.findIndex(s=>s.req===false);
pb.steps.forEach((s,i)=>{if(i<opt)s.done=true});
A.planSkip({dataset:{id:pb.id,i:String(opt)}});
CK('选修可以跳过，必修环节还在',pb.steps[opt].skip&&pb.steps[opt].t==='课后'&&pb.steps.find(s=>s.t==='课中').req!==false);
QZ=null;R.page='adapt';
const locked=S.packs.find(p=>p.id===b.id);
locked.steps.forEach(s=>{s.done=false;s.skip=false});
A.rxPackGo({dataset:{id:locked.id,i:'1'}});
CK('前面没做完时后面的环节不开做',!QZ);
A.planReimport({dataset:{id:pb.id,ok:'1'}});
CK('再次带入只覆盖这个包',S.packs.find(p=>p.id===pb.id).steps.find(s=>s.t==='课后').n===4&&S.packs.find(p=>p.id===pa.id).steps.find(s=>s.t==='课后').n===150);
const old={id:'PKOLD',name:'旧包',kp:'K3',arranged:false,steps:[{t:'练题',need:1,done:false}],pick:{qIds:['QC8'],drillIds:[]},status:'进行中'};
S.packs.unshift(old);
R.packStep=null;R.quizCtx={};QZ=null;
qzStartPack(old);
CK('没有新安排的旧包仍按原来点名的题',QZ&&QZ.ids.join()==='QC8');
document.body.dataset.end='pc';
CK('页面无 undefined / NaN',!/undefined|NaN/.test(document.querySelector('#main').innerHTML));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' | '))}
