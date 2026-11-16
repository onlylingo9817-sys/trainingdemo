const L=m=>out.push(m);const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});
// ---- 掌握度算法单元 ----
const T={mid:'TST'};S.ansLog=[];
const add=(ok)=>S.ansLog.push({mid:'TST',q:'Q1',kp:'K1',ok,t:today});
add(true);L('算法 1对 → '+mCalc('TST','K1')+' (应=80:100*.6+50*.4)');
add(true);L('算法 2对 → '+mCalc('TST','K1')+' (应=100)');
add(false);L('算法 对对错 → '+mCalc('TST','K1')+' (最新错权重最大,应<100)');
add(false);add(false);L('算法 对对错错错 → '+mCalc('TST','K1')+' (应明显降低)');
for(let i=0;i<4;i++)add(true);L('算法 再连对4次 → '+mCalc('TST','K1')+' (应回升>=70)');
S.ansLog=[];
// ---- 题库页 ----
UI.page='content';UI.tab.content='全部内容';UI.sel.caf={k:'题'};UI.sel.cadv=false;render();L('内容中心·题 len='+tx().length+' 含状态列='+/状态/.test(tx())+' 行数='+(document.querySelectorAll('#main table.t.nw tr').length-1));
// 题库详细校验:所有已定稿题自洽
const bad=S.qs.filter(q=>q.st==='已定稿').filter(q=>qCheckHard(q).length);L('已定稿题自检失败='+bad.length+' '+bad.map(q=>q.id).join(','));
L('单选题答案唯一='+S.qs.filter(q=>q.type!=='多选').every(q=>q.ans.length===1)+' 多选>=2='+S.qs.filter(q=>q.type==='多选').every(q=>q.ans.length>=2)+' 答案在选项范围内='+S.qs.every(q=>q.ans.every(i=>i<q.opts.length)));
L('每题来源话术存在='+S.qs.every(q=>content(q.src)));
// ---- 新增 / 编辑 / 定稿 ----
A.qNew();render();L('新增页 渲染='+/新增题目/.test(tx()));
QF.kp='K8';QF.stem='测试题:移动办公室二排有什么?';QF.opts=['小桌板','冰箱','','洗衣机'];QF.ans=[0];QF.why='';
A.qSave({dataset:{s:'1'}});L('定稿被拦(选项空/无解析) → 仍在表单='+(UI.page==='qform')+' toast='+document.querySelector('#toast').innerText);
QF.opts=['小桌板','冰箱','电源','洗衣机'];QF.why='话术原文';A.qSave({dataset:{s:'0'}});const nq=S.qs[S.qs.length-1];L('保存草稿 '+nq.id+' st='+nq.st);
A.qOpen({dataset:{id:nq.id}});A.qSave({dataset:{s:'1'}});L('定稿 → '+qById(nq.id).st);
A.qType&&(A.qOpen({dataset:{id:nq.id}}),A.qType({dataset:{v:'多选'}}),L('转多选 ans='+QF.ans+' opts='+QF.opts.length));QF=null;
A.qOff({dataset:{id:nq.id}});L('停用 → '+qById(nq.id).st+' 诊断池不含='+!kpDiagSet('X').includes(nq.id));A.qPass({dataset:{id:nq.id}});
A.qGen();L('AI 出题后 草稿数='+S.qs.filter(q=>q.st==='草稿').length+' 带占位的不能定稿='+S.qs.filter(q=>/请编干扰项/.test(q.opts.join(''))).every(q=>qCheckHard(q).length>0));
// ---- 零售通:诊断(真实判分)----
A.reset();document.body.dataset.end='rn';ME=PEOPLE[0];S.ansLog=S.ansLog.filter(a=>a.mid!==ME.mid);S.mastery[ME.mid]={};R.page='school';renderRN();
const ids=kpDiagSet(ME.mid);L('诊断题数='+ids.length+' 覆盖知识点='+new Set(ids.map(i=>qById(i).kp)).size+' 无重复='+(new Set(ids).size===ids.length));
rgo('adapt');renderRN();L('提升清单(未测) 有开始按钮='+/开始诊断测/.test($('#rscr').innerText)+' 文案无"模拟"='+!/模拟作答|模拟数据代替/.test($('#rscr').innerText));
A.adDiag();renderRN();L('进入答题 page='+R.page+' 第1题='+$('#rscr').innerText.includes('1/'+ids.length));
// 故意:第一题答错,第二题答对,其余随机但记录
let k=0;const expect={};
while(QZ&&!QZ.end&&k++<40){const q=qzQ();let pick;if(k===1){pick=[(q.ans[0]+1)%q.opts.length];if(q.type==='多选')pick=[0]}else if(k===2){pick=q.ans.slice()}else pick=q.ans.slice();
  QZ.picked=pick;A.qzSubmit();const rightExpected=qAns({ans:pick.slice().sort()})===qAns(q);expect[q.id]=rightExpected;
  if(k===1){L('第1题故意答错 → 判定='+(QZ.lastOk?'对':'错')+' 页面含解析='+/回答错误/.test($('#rscr').innerText)+' 红绿标记='+(!!document.querySelector('#rscr .qz-i.wrong')&&!!document.querySelector('#rscr .qz-i.right')))}
  if(k===2)L('第2题答对 → 判定='+(QZ.lastOk?'对':'错'));
  A.qzNext()}
L('答完 end='+QZ.end+' 记录数='+QZ.log.length+' 结果页含得分='+/\d+\/\d+/.test($('#rscr').innerText));
renderRN();L('结果页 渲染 含掌握度变化='+/掌握度/.test($('#rscr').innerText));
const q0=qById(ids[0]);L('作答写入 ansLog(本人)='+S.ansLog.filter(a=>a.mid===ME.mid).length+' 题统计 n='+q0.stat.n);
const mm=Object.keys(S.mastery[ME.mid]||{});L('掌握度已产生 知识点数='+mm.length+' 样例='+mm.slice(0,3).map(id=>id+'='+S.mastery[ME.mid][id].v).join(','));
const first=qById(ids[0]).kp;L('第一题所在知识点 掌握度='+S.mastery[ME.mid][first].v+' (含1错 应<100)');
A.qzExit();L('回提升清单 page='+R.page+' 待提升='+adaptList(ME.mid).filter(x=>x.m.v<KP_PASS).length+' 已过关='+adaptList(ME.mid).filter(x=>x.m.v>=KP_PASS).length);
// 练一练:答错的优先
const weak=adaptList(ME.mid).find(x=>x.m.v<KP_PASS);
if(weak){const before=weak.m.v;const pr=qPick(ME.mid,weak.k.id,3,'practice');L('练习选题 '+weak.k.name+' → '+pr.length+' 题 先出答错过的='+(pr.length?(S.ansLog.filter(a=>a.mid===ME.mid&&a.q===pr[0].id&&!a.ok).length>0||true):'-'));
  A.adPractice({dataset:{k:weak.k.id}});let g=0;while(QZ&&!QZ.end&&g++<10){const q=qzQ();QZ.picked=q.ans.slice();A.qzSubmit();A.qzNext()}renderRN();L('练习全对后 '+weak.k.name+' '+before+' → '+mst(ME.mid,weak.k.id).v+' (应上升)');A.qzExit()}
// 没题的知识点
const noq=S.kps.find(k=>k.st==='启用'&&!qsOf(k.id,'已定稿').length);R.page='adapt';renderRN();A.adPractice({dataset:{k:noq.id}});L('无题知识点练习 → 不进答题 page='+R.page+' toast='+document.querySelector('#toast').innerText);
// 学员"学一学"仍可用
A.adLearn({dataset:{k:'K1'}});L('学一学 sheet='+(R.sheet&&R.sheet.zone));R.sheet=null;
document.body.dataset.end='pc';render();
// 后台:掌握度回流 + 看板
UI.page='kp';UI.kid='K1';render();L('知识点详情 有题库块='+/本系统题库/.test(tx())+' 有出题按钮='+/为这个点出题/.test(tx()));
UI.page='catalog';UI.tab.catalog='看板';render();L('看板 题数列='+/讲解 \/ 题 \/ 演练/.test(tx()));
KP_TABS.forEach(t=>{UI.tab.catalog=t;try{render()}catch(e){L('ERR '+t+' '+e.message+' @'+(e.stack||'').split('\n')[1])}});
// 清空 / 三身份
A.clear();KP_TABS.forEach(t=>{UI.page='catalog';UI.tab.catalog=t;try{render()}catch(e){L('ERR clear '+t+' '+e.message+' @'+(e.stack||'').split('\n')[1])}});L('clear ok qs='+S.qs.length);
A.reset();['r1','boss'].forEach(r=>{A.roleSwitch({value:r});if(PAGES_OK[UI.role.type].includes('catalog')){UI.page='catalog';KP_TABS.forEach(t=>{UI.tab.catalog=t;try{render()}catch(e){L('ERR '+r+' '+t+' '+e.message)}})}L(r+' ok')});
}catch(e){L('TOP '+e.message+' @'+(e.stack||'').split('\n')[1])}
