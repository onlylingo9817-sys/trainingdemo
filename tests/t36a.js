const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const html=()=>document.querySelector('#main').innerHTML;
const dlg=()=>document.querySelector('#dlg').innerHTML;
const gateOn=()=>{rvCfg().ruleMode='gate';rvCfg().rules.firstUse=false};
const mk=id=>{A.cSubmit({dataset:{id}});A.cReview({dataset:{id}});A.cPass({dataset:{id}});A.rvStartOk({dataset:{k:'content',id}});return rvActive('content',id)};
try{
/* 1. 规则触发:命中的内容,审核人点通过会转评审,不会直接定稿 */
A.reset();A.roleSwitch({value:'hq'});closeDlg();gateOn();
const c=content('N17');
CK('政策口径类内容命中规则',rvTriggers(c).includes('政策口径类内容'),JSON.stringify(rvTriggers(c)));
CK('存量已定稿内容不被「首次使用」拦截',!S.contents.filter(x=>x.st==='已定稿').some(x=>rvTriggers(x).includes('首次使用的新话术')));
A.cSubmit({dataset:{id:'N17'}});A.cReview({dataset:{id:'N17'}});
CK('审核弹窗提示命中规则并改按钮文案',/命中评审规则/.test(dlg())&&/命中规则,发起评审灰度/.test(dlg()));
A.cPass({dataset:{id:'N17'}});
CK('命中规则时点通过不会直接定稿',c.st==='审核中'&&/发起评审灰度 · /.test(dlg()));
A.rvStartOk({dataset:{k:'content',id:'N17'}});
let r=rvActive('content','N17');
CK('发起后产生评审单,评审团含总部与销冠',!!r&&r.jury.some(j=>j.ch==='pc')&&r.jury.some(j=>j.ch==='rn'),r&&r.jury.map(j=>j.name+'/'+j.ch).join(','));
CK('评审团有且仅有预设的必须点',r.jury.filter(j=>j.must).length===1);
A.cPass({dataset:{id:'N17'}});
CK('评审进行中再点通过被拦住',c.st==='审核中');
UI.page='cdetail';UI.cid='N17';UI.ctab='内容';render();
CK('详情页显示评审卡与「我来评审」',/评审灰度/.test(html())&&/rvPcOpen/.test(html()));
/* 2. 工作台待办 + PC 投票 */
const wb=wbItems().filter(x=>x.tag==='待我评审');
CK('总部评审人工作台出现「待我评审」',wb.length===1&&wb[0].attrs.includes('rvPcOpen'));
A.rvPcOpen({dataset:{id:r.id}});
CK('评审弹窗含正文与评审意见框',/评审意见/.test(dlg())&&/国补|补贴|以旧换新/.test(dlg()));
A.rvPcVote({dataset:{id:r.id,v:'fix'}});
CK('选「要改」不写意见被拒',!r.votes['hq:liuxiang']);
/* 3. 必须点不通过 → 整体不通过,内容退回草稿 */
document.querySelector('#rvNote').value='口径需和政策部再确认';A.rvPcVote({dataset:{id:r.id,v:'fix'}});
CK('必须点投「要改」→ 评审未通过',r.st==='未通过'&&c.st==='草稿',r.st+'/'+c.st);
CK('评审留痕含投票与结论',r.log.length>=3&&r.log.some(x=>/评审未通过/.test(x.msg)));
/* 4. 通过路径:必须点 + 过半「能用」→ 定稿,生成版本快照 */
A.reset();A.roleSwitch({value:'hq'});closeDlg();gateOn();
r=mk('N17');const cc=content('N17');
rvVote(r,'hq:liuxiang','pass','','刘翔');
CK('只有必须点通过时仍在评审中',r.st==='评审中');
const sg=r.jury.filter(j=>j.ch==='rn');
rvVote(r,sg[0].mid,'pass','','x');rvVote(r,sg[1].mid,'pass','','x');
CK('必须点通过且过半能用 → 定稿',r.st==='已通过'&&cc.st==='已定稿',r.st+'/'+cc.st);
CK('定稿后写入当前版本快照',cc.vers.some(v=>v.v===cc.ver&&/评审灰度/.test(v.note)));
CK('评审通过后审核再点通过不再重复拦截',!rvNeedsGate(cc));
/* 5. 非必须点多数「不行」→ 提前判不通过 */
A.reset();A.roleSwitch({value:'hq'});closeDlg();gateOn();
r=mk('N17');
rvVote(r,'hq:zhoulei','deny','口径不对','周磊');rvVote(r,'hq:lixm','deny','口径不对','李晓梅');rvVote(r,r.jury.find(j=>j.ch==='rn').mid,'deny','不像我们会说的','x');
CK('通过票不可能过半时提前判定不通过',r.st==='未通过',r.st+' '+r.res);
/* 6. 催办 / 撤回 / 超期 */
A.reset();A.roleSwitch({value:'hq'});closeDlg();gateOn();
r=mk('N17');A.rvRemind({dataset:{id:r.id}});
CK('催办记录被催的人且不重复',r.reminded.length===r.jury.length);
A.rvRemind({dataset:{id:r.id}});CK('再次催办无新增',r.reminded.length===r.jury.length);
A.rvExpire({dataset:{id:r.id}});
CK('评审期满且配置为「提醒发起人」时不自动推进',r.st==='评审中'&&wbItems().some(x=>x.tag==='评审超期'));
A.rvWithdraw({dataset:{id:r.id}});
CK('撤回后评审单已撤回、内容退回草稿',r.st==='已撤回'&&content('N17').st==='草稿');
/* 7. 超时推进规则:无反对且已投票过半 */
A.reset();A.roleSwitch({value:'hq'});closeDlg();gateOn();rvCfg().onTimeout='已投票过半且无反对则推进';
r=mk('N17');rvVote(r,'hq:liuxiang','pass','','刘翔');rvVote(r,'hq:zhoulei','pass','','周磊');
A.rvExpire({dataset:{id:r.id}});
CK('超时推进:5 人团只投 2 票(未过半)时不推进',r.st==='评审中',r.st);
A.reset();A.roleSwitch({value:'hq'});closeDlg();gateOn();rvCfg().onTimeout='已投票过半且无反对则推进';
r=mk('N17');rvVote(r,'hq:liuxiang','pass','','刘翔');rvVote(r,'hq:zhoulei','fix','再看看措辞','周磊');rvVote(r,'hq:lixm','pass','','李晓梅');
CK('3 票其中 1 票「要改」:能用 2 票未过半,仍在评审中',r.st==='评审中');
A.rvExpire({dataset:{id:r.id}});
CK('超时推进:有「要改」票(非全部同意)时不推进',r.st==='评审中',r.st);
A.reset();A.roleSwitch({value:'hq'});closeDlg();gateOn();rvCfg().onTimeout='已投票过半且无反对则推进';
r=mk('N17');rvVote(r,'hq:liuxiang','pass','','刘翔');rvVote(r,'hq:zhoulei','pass','','周磊');
const leftover=r.jury.find(j=>j.ch==='rn');rvVote(r,leftover.mid,'fix','不确定','x');
A.rvExpire({dataset:{id:r.id}});
CK('超时推进:3 人已投但有「要改」→ 不推进(只提醒)',r.st==='评审中'&&wbItems().some(x=>x.tag==='评审超期'),r.st);
/* 8. 知识点候选:评审中不可直接确认,通过后才入库 */
A.reset();A.roleSwitch({value:'hq'});closeDlg();gateOn();
const x=S.kpCand[0];const nK=S.kps.length;
rvStartDlg('kp',x.id);A.rvStartOk({dataset:{k:'kp',id:x.id}});const rk=rvActive('kp',x.id);
CK('候选发起评审后状态为评审中',x.st==='评审中'&&!!rk);
A.kpCandOk({dataset:{id:x.id}});CK('评审中不能确认新增',S.kps.length===nK&&x.st==='评审中');
A.kpCandNo({dataset:{id:x.id}});CK('评审中不能忽略',x.st==='评审中');
rvVote(rk,'hq:liuxiang','pass','','刘翔');rvVote(rk,rk.jury.filter(j=>j.ch==='rn')[0].mid,'pass','','x');rvVote(rk,rk.jury.filter(j=>j.ch==='rn')[1].mid,'pass','','x');
CK('评审通过后候选回到待确认且标记已评审',x.st==='待确认'&&x.rvPass===true);
A.kpCandOk({dataset:{id:x.id}});CK('评审通过后可确认新增入库',S.kps.length===nK+1&&x.st==='已新增');
/* 9. 零售通手机端:销冠评审卡 */
A.reset();A.roleSwitch({value:'hq'});closeDlg();gateOn();
r=mk('N17');document.body.dataset.end='rn';
const champ=PEOPLE.find(p=>p.mid===r.jury.find(j=>j.ch==='rn').mid);
const other=PEOPLE.find(p=>!r.jury.some(j=>j.mid===p.mid));
ME=other;R.page='school';R.stack=[];renderRN();
CK('不在评审团的学员看不到评审待办',!/去评审/.test(document.querySelector('#rscr').innerHTML));
ME=champ;renderRN();
CK('评审团销冠首页出现评审待办',/评审 · /.test(document.querySelector('#rscr').innerHTML));
A.rxGoRv({dataset:{id:r.id}});
CK('手机评审页含正文、三个按钮与评估维度',(document.querySelector('#rscr').innerHTML.match(/rxRvVote/g)||[]).length===3&&/准确/.test(document.querySelector('#rscr').innerHTML));
A.rxRvVote({dataset:{id:r.id,v:'deny'}});CK('手机端选「不行」不写原因被拒',!r.votes[champ.mid]);
document.querySelector('#rvRnNote').value='不像我们会说的';A.rxRvVote({dataset:{id:r.id,v:'deny'}});
CK('手机端写原因后投票成功并显示已投',r.votes[champ.mid].v==='deny'&&/你已投/.test(document.querySelector('#rscr').innerHTML));
renderRN();CK('已投后首页待办消失',!/评审 · /.test(document.querySelector('#rscr').innerHTML));
A.rxRvVote({dataset:{id:r.id,v:'pass'}});CK('同一人已投「不行」后再投「能用」,票不被覆盖',r.votes[champ.mid].v==='deny',r.votes[champ.mid].v);
document.body.dataset.end='pc';
/* 10. 不在评审团的人投票被拒;老板与区域老师边界 */
const res=rvVote(r,'hq:nobody','pass','','x');CK('不在评审团的人不能投票',!!res.err);
A.roleSwitch({value:'boss'});UI.page='workbench';
CK('老板的待办里没有评审类事项',!wbItems().some(x=>/评审/.test(x.tag)));
A.roleSwitch({value:'r1'});UI.page='config';render();
CK('区域老师不能进入配置中心',UI.page!=='config');
/* 11. 配置中心:分组 + 评审规则页 */
A.reset();A.roleSwitch({value:'hq'});UI.page='config';
const all=['指标库','培训类型默认值','阈值与口径','维度体系','岗位画像','评价口径','学习包模板','内容管理','知识点规则','评审灰度','标签管理','数据源'];
let bad=[];all.forEach(t=>{UI.tab.config=t;try{render();const m=document.querySelector('#main');const tabs=[...m.querySelectorAll('.tabs .tab')].map(e=>e.textContent.trim());if(!tabs.includes(t)||m.innerHTML.length<500)bad.push(t)}catch(e){bad.push(t+':'+e.message)}});
CK('配置中心 12 个页签均可渲染且落在所属分组内',bad.length===0,bad.join(','));
UI.tab.config='指标库';render();
CK('配置中心有 4 个分组栏',document.querySelectorAll('#main .wb-tabs span').length===4);
UI.tab.config='评审灰度';render();A.rvCfgRule({dataset:{k:'policy'},checked:false});
CK('关闭政策规则后政策类内容不再命中',!rvTriggers(content('N17')).includes('政策口径类内容'));
A.rvCfgOn({checked:false});CK('总开关关闭后不自动拦截',rvTriggers(content('N7')).length===0);
/* 12. 持久化:评审单随存档保存 */
CK('评审单字段已纳入存档',LS_FIELDS.includes('rvw'));
/* 13. 全部页面遍历不报错(评审中的数据存在时) */
A.reset();A.roleSwitch({value:'hq'});closeDlg();gateOn();mk('N17');
let errs=[];['hq','r1','r2','boss'].forEach(role=>{A.roleSwitch({value:role});PAGES_OK[UI.role.type].forEach(p=>{if(['detail','cdetail','cedit','topic','kp','kpform','qform','dform','student','person','form'].includes(p))return;UI.page=p;try{render()}catch(e){errs.push(role+'/'+p+':'+e.message)}})});
CK('四种身份遍历所有页面无异常',errs.length===0,errs.slice(0,3).join(' | '));

/* 14. 复核发现的缺陷回归 */
const fresh=()=>{A.reset();A.roleSwitch({value:'hq'});closeDlg();gateOn()};
const pass3=r=>{rvVote(r,'hq:liuxiang','pass','','x');const g=r.jury.filter(j=>j.ch==='rn');rvVote(r,g[0].mid,'pass','','x');rvVote(r,g[1].mid,'pass','','x')};
fresh();let q1=mk('N17');A.rvWithdraw({dataset:{id:q1.id}});let q2=mk('N17');
CK('同日撤回后重发:最新一张为进行中且单号递增',rvActive('content','N17')&&rvActive('content','N17').id===q2.id&&q1.id!==q2.id,q1.id+','+q2.id);
A.rvStartOk({dataset:{k:'content',id:'N17'}});
CK('已有进行中评审时不能再建第二张',rvList().filter(x=>x.st==='评审中').length===1);
fresh();q1=mk('N17');A.cReview({dataset:{id:'N17'}});A.cReturn({dataset:{id:'N17'}});
CK('评审进行中不能直接退回内容',content('N17').st==='审核中'&&q1.st==='评审中');
fresh();q1=mk('N17');content('N17').title='评审期间被改';pass3(q1);
CK('评审期间内容被改:通过结果作废、内容回草稿、不会被定稿',q1.st==='已撤回'&&content('N17').st==='草稿',q1.st+'/'+content('N17').st);
fresh();q1=mk('N17');pass3(q1);const cN=content('N17');
CK('评审通过后未改动:不再需要评审',cN.st==='已定稿'&&!rvNeedsGate(cN));
cN.title='通过后又改了标题';
CK('评审通过后再改内容:重新需要评审',rvNeedsGate(cN));
fresh();q1=mk('N17');A.roleSwitch({value:'r2'});A.rvWithdraw({dataset:{id:q1.id}});A.rvRemind({dataset:{id:q1.id}});
CK('非发起人的区域老师不能撤回/催办总部发起的评审',q1.st==='评审中'&&q1.reminded.length===0);
A.roleSwitch({value:'boss'});A.rvForce({dataset:{id:q1.id,v:'go'}});
CK('老板不能强推评审',q1.st==='评审中');
A.roleSwitch({value:'hq'});A.rvForce({dataset:{id:q1.id,v:'go'}});
CK('0 票不能强推通过',q1.st==='评审中');
rvVote(q1,'hq:zhoulei','pass','','x');A.rvForce({dataset:{id:q1.id,v:'go'}});
CK('必须点未投且在评审期内不能强推通过',q1.st==='评审中');
A.rvExpire({dataset:{id:q1.id}});A.rvForce({dataset:{id:q1.id,v:'go'}});
CK('评审超期后总部可强推并留痕',q1.st==='已通过'&&q1.log.some(x=>/决策推进/.test(x.msg)));
fresh();q1=mk('N17');rvVote(q1,'hq:liuxiang','pass','','x');const dup=rvVote(q1,'hq:liuxiang','deny','改主意','x');
CK('同一人不能重复改票',!!dup.err&&q1.votes['hq:liuxiang'].v==='pass');
q1.due=addDays(today,-1);const late=rvVote(q1,'hq:zhoulei','pass','','x');
CK('评审过期后不能再投票',!!late.err);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
