const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
/* t50a：知识点行内用途、课程选用、演示出题、学习包点名具体资源。100 题只在本页临时造，不写入默认种子。 */
try{
A.roleSwitch({value:'hq'});closeDlg();A.reset();
const ex0=kpV12Summary({role:'零售顾问',car:'SU7 Pro',batch:'B3-后续',pri:'P0'});
CK('占位口径仍是 24/24/36',ex0.n===33&&ex0.cov===24&&ex0.teach===24&&ex0.assess===36,JSON.stringify(ex0));
UI.kid='K57';UI.page='kp';render();
const q=S.qs.find(x=>x.kp==='K57'&&x.st==='已定稿');
const role0=q.role;
A.kpQRole({dataset:{id:q.id}});
CK('题的用途在知识点页行内切换',UI.page==='kp'&&UI.kid==='K57'&&q.role!==role0);
A.kpQRole({dataset:{id:q.id}});
CK('再点一次回到原来的用途',q.role===role0&&UI.page==='kp');
const kp0=q.kp;
A.qOpen({dataset:{id:q.id}});
CK('从知识点进入题编辑',UI.page==='qform'&&UI.sel.returnKp==='K57');
A.qCancel();
CK('取消回到原知识点',UI.page==='kp'&&UI.kid==='K57'&&q.kp===kp0);
A.kpQUnlink({dataset:{id:q.id}});
CK('解除关联后题目还在、归属变空',qById(q.id)&&q.kp===''&&UI.page==='kp');
q.kp='K57';
/* 课程选用不改归属 */
const course=content('N_CEMN1');
const other=S.qs.find(x=>x.kp&&x.kp!=='K57'&&x.st==='已定稿');
const keep=other.kp;
kpPicks(course).qs=[other.id];
CK('选用不改变原知识点',other.kp===keep&&kpPicks(course).qs[0]===other.id);
A.cPickDel({dataset:{cid:course.id,kind:'q',id:other.id}});
CK('移出选用后题还在原知识点',other.kp===keep&&kpPicks(course).qs.indexOf(other.id)<0);
/* 按大纲出演示草稿 */
UI.cid=course.id;UI.page='cdetail';UI.ctab='内容';render();
CK('课程详情有选用和演示出题',/本课怎么用/.test(document.querySelector('#main').innerText)&&/按大纲出演示草稿/.test(document.querySelector('#main').innerText));
A.cGenOpen({dataset:{id:course.id}});
const box=document.querySelector('.cg_line');
CK('出题前要勾选大纲，并标明演示生成',!!box&&/演示生成/.test(document.querySelector('#dlg').innerText)&&document.querySelectorAll('.cg_line:checked').length===0);
box.checked=true;
const n0=S.qs.length;
A.cGenDo();
const drafted=S.qs[S.qs.length-1];
CK('勾选后写入草稿，来源是课程，没有自动加入选用',S.qs.length===n0+1&&drafted.demoGen===true&&drafted.src===course.id&&drafted.st==='草稿'&&kpPicks(course).qs.indexOf(drafted.id)<0&&/演示生成/.test(drafted.stem+drafted.why));
CK('草稿的知识点是这门课已挂的点',(course.kps||[]).includes(drafted.kp));
/* 100 题：筛选、全选、批量改用途、批量选用，不改归属 */
const host=course.id;const baseKp='K3';
const ids=[];
for(let i=0;i<100;i++){
  const id='QB'+i;
  S.qs.push({id,kp:baseKp,type:'单选',stem:'百题场景 '+i,opts:['对','错'],ans:[0],why:'隔离测试',lv:1,src:i<40?host:'',st:'已定稿',role:'练习题',owner:'王磊',created:today,stat:{n:0,ok:0},carScope:[],carScopeManual:false});
  ids.push(id);
}
UI.page='content';UI.tab.content='全部内容';UI.sel.cZone='q';UI.sel.cq={kind:'题',course:host};UI.sel.cqs='';UI.sel.call={page:1,size:100,pick:{}};render();
const shown=(UI.sel.cRowIds||[]).filter(id=>String(id).indexOf('QB')===0);
CK('题库工作区按来源课程筛出 40 道，不和课混排',shown.length===40&&document.querySelectorAll('#main .c-table tr').length>1&&/题库/.test(document.querySelector('#main').innerText),shown.length+'');
A.cSelZone();
CK('全选筛选结果',lstPicked('call').length===(UI.sel.cRowIds||[]).length&&lstPicked('call').indexOf('QB0')>=0,lstPicked('call').length+'/'+(UI.sel.cRowIds||[]).length);
const beforeKp=qById('QB0').kp;
A.cBulkQRole({dataset:{role:'锚题'}});
CK('批量改用途不改知识点',qById('QB0').role==='锚题'&&qById('QB0').kp===beforeKp);
A.cBulkPickCourse=A.cBulkPickCourse;
const sel=document.getElementById('c_pick_course');
if(sel)sel.value=host;
A.cBulkPickCourse();
CK('批量加入课程选用',kpPicks(course).qs.indexOf('QB0')>=0&&qById('QB0').kp===baseKp);
/* 学习包点名这些题 */
kpPicks(course).qs=['QB0','QB1'];
kpPicks(course).drills=[S.drills.find(d=>d.st==='已定稿').id];
A.cPackFrom({dataset:{id:course.id}});
const pk=S.packs[0];
CK('学习包复制配套，不把题改挂走',pk.arranged&&pk.bank&&pk.bank.qs.join()==='QB0,QB1'&&pk.fromCourse===host&&qById('QB0').kp===baseKp);
const inStep=pk.steps.find(s=>s.t==='课中');
R.packStep=pk.steps.indexOf(inStep);
R.quizCtx={mode:'pack',packId:pk.id,kp:pk.kp,slot:'课中',step:R.packStep};
qzStartPack(pk);
CK('学员端课中只用安排里的题',QZ&&QZ.ids.join()===inStep.qIds.filter(id=>{const q=qById(id);return q&&q.st==='已定稿'}).join(),QZ&&QZ.ids.join());
QZ=null;
/* 项目演练引用演练库 */
const d0=S.drills.find(d=>d.st==='已定稿');
document.body.dataset.end='rn';
const fakeP={id:'PTEST',nodes:[{id:'T1',t:'情景演练',rel:'有情景演练',module:'练',mi:0,name:d0.id+' · '+d0.name,cfg:{ref:d0.id+' · '+d0.name},contentId:''}],off:false};
S.projects.push(fakeP);
R.sheet={pid:'PTEST',nid:'T1'};
const sheet=rSheetHtml();
CK('项目演练打开的是演练库这场',sheet.indexOf('演练库 '+d0.id)>=0&&sheet.indexOf('rSheetDrill')>=0);
S.projects.pop();
/* 刷新后选用还在 */
saveNow();loadNow();
CK('选用写入后还能读回',kpPicks(content(host)).qs.indexOf('QB0')>=0);
document.body.dataset.end='pc';
CK('页面无 undefined / NaN',!/undefined|NaN/.test(document.querySelector('#main').innerHTML));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' | '))}
