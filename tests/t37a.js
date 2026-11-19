const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const html=()=>document.querySelector('#main').innerHTML;
const dlg=()=>document.querySelector('#dlg').innerHTML;
const fresh=()=>{A.reset();A.roleSwitch({value:'hq'});closeDlg()};
const startAsync=(id)=>{rvStartDlg('content',id,'async');A.rvStartOk({dataset:{k:'content',id}});return rvActive('content',id)};
try{
/* ===== 1. 建议模式(默认):命中规则只提示,不拦截 ===== */
fresh();
CK('默认规则模式为「只建议」',rvCfg().ruleMode==='suggest');
CK('「首次使用的新话术」默认开启',rvCfg().rules.firstUse===true);
A.cNew({dataset:{}});C.kind='话术';C.type='图文';C.title='建议模式新话术';C.items=['先问需求,再给方案'];C.kw='需求, 场景';C.cover='a.png';C.lecturer='王磊';C.chan=['汽车销售'];C.subject='探需';C.expire='';C.source='';C.cat='销售技巧';render();
A.cSave({dataset:{s:'1'}});const nc=S.contents[0];
CK('新话术命中「首次使用」规则',rvTriggers(nc).includes('首次使用的新话术'));
CK('建议模式下 rvNeedsGate 为 false(不拦)',!rvNeedsGate(nc)&&rvSuggest(nc));
A.cReview({dataset:{id:nc.id}});
CK('审核弹窗给「建议评审」提示,且提供「通过并发起异步评审」',/建议评审/.test(dlg())&&/cPassAsync/.test(dlg()));
A.cPass({dataset:{id:nc.id}});
CK('建议模式点通过直接定稿(不评审也行)',nc.st==='已定稿'&&!rvActive('content',nc.id));
/* ===== 2. 通过并发起异步评审 ===== */
fresh();
A.cNew({dataset:{}});C.kind='话术';C.type='图文';C.title='定稿并异步评审';C.items=['先问需求,再给方案'];C.kw='需求, 场景';C.cover='a.png';C.lecturer='王磊';C.chan=['汽车销售'];C.subject='探需';C.expire='';C.source='';C.cat='销售技巧';render();
A.cSave({dataset:{s:'1'}});const c2=S.contents[0];A.cReview({dataset:{id:c2.id}});A.cPassAsync({dataset:{id:c2.id}});
CK('「通过并发起异步评审」:内容已定稿且弹出评审发起框',c2.st==='已定稿'&&/发起异步评审/.test(dlg()));
A.rvStartOk({dataset:{k:'content',id:c2.id}});
let ra=rvActive('content',c2.id);
CK('异步评审单已建立,模式 async,内容仍是已定稿',ra&&ra.mode==='async'&&c2.st==='已定稿');
CK('异步评审不阻塞:rvBlocking 为空',!rvBlocking('content',c2.id));
/* ===== 3. 对已定稿(已上架)内容事后发起异步评审 ===== */
fresh();
const c3=content('N10');
CK('已定稿内容只能发起异步评审',JSON.stringify(rvModesFor('content','N10'))==='["async"]');
UI.page='cdetail';UI.cid='N10';UI.ctab='内容';render();
CK('已定稿内容详情页有「发起异步评审」按钮',/rvStartA/.test(html()));
A.rvStartA({dataset:{id:'N10'}});
CK('发起框的「先评审后定稿」选项对已定稿内容不可选',/value="gate"[^>]*disabled/.test(dlg())&&/value="async"[^>]*checked/.test(dlg()));
A.rvStartOk({dataset:{k:'content',id:'N10'}});
ra=rvActive('content','N10');
CK('已定稿内容异步评审:状态与上架状态不变',c3.st==='已定稿'&&ra.mode==='async');
CK('评审单未结束时同一内容不能再建一张',(()=>{const n=rvList().length;A.rvStartOk({dataset:{k:'content',id:'N10'}});return rvList().length===n})());
CK('异步评审期间仍可打开上架弹窗',(()=>{A.cPub({dataset:{id:'N10'}});const ok=/上架到零售通/.test(dlg());closeDlg();return ok})());
CK('异步评审期间仍可改版',(()=>{const v=c3.ver;A.cRevise({dataset:{id:'N10'}});return c3.ver>v||c3.st!=='已定稿'})());
/* ===== 4. 异步评审的结果回流 ===== */
fresh();ra=startAsync('N10');const c4=content('N10');
rvVote(ra,'hq:liuxiang','pass','','刘翔');const g=ra.jury.filter(j=>j.ch==='rn');const need=Math.floor(ra.jury.length/2)+1;g.slice(0,need-1).forEach(j=>rvVote(ra,j.mid,'pass','','x'));
CK('异步评审通过:打「已评审」,内容状态不变',ra.st==='已通过'&&c4.st==='已定稿'&&rvPassedNow(c4),ra.st+'/'+c4.st);
fresh();ra=startAsync('N10');const c5=content('N10');
rvVote(ra,'hq:liuxiang','deny','口径有误','刘翔');
CK('异步评审未通过:不自动下线,内容保持已定稿,只打待办标记',ra.st==='未通过'&&c5.st==='已定稿'&&c5.rvBad===ra.id,ra.st+'/'+c5.st+'/'+c5.rvBad);
CK('未通过的异步评审会在内容历史里留痕',c5.hist.some(h=>/异步评审未通过/.test(h.act)));
/* ===== 5. 代录意见 ===== */
fresh();ra=startAsync('N10');
rvProxyDlg(ra.id);
CK('代录弹窗含未投评审人与 5 种渠道',/rvpWho/.test(dlg())&&(dlg().match(/<option>(微信|电话|会议|邮件|当面)/g)||[]).length===5);
document.querySelector('#rvpWho').value='hq:zhoulei';document.querySelector('#rvpCh').value='电话';document.querySelector('#rvpV').value='fix';document.querySelector('#rvpNote').value='';A.rvProxyOk({dataset:{id:ra.id}});
CK('代录「要改」不写意见被拒',!ra.votes['hq:zhoulei']);
document.querySelector('#rvpNote').value='措辞太绝对';A.rvProxyOk({dataset:{id:ra.id}});
CK('代录成功,票上带代录标记与渠道',ra.votes['hq:zhoulei']&&ra.votes['hq:zhoulei'].proxy&&ra.votes['hq:zhoulei'].proxy.ch==='电话');
CK('代录在留痕里写明代谁录入与渠道',ra.log.some(x=>/代周磊录入/.test(x.who)&&/电话/.test(x.who)));
CK('评审卡显示「代录」标签',(()=>{UI.page='cdetail';UI.cid='N10';UI.ctab='内容';render();return /代录·电话/.test(html())})());
rvProxyDlg(ra.id);document.querySelector('#rvpWho').value='hq:zhoulei';
CK('已被代录的人不再出现在候选里',!/value="hq:zhoulei"/.test(dlg()));closeDlg();
A.roleSwitch({value:'r2'});ra.by='总部培训部 刘翔';A.rvProxyOk({dataset:{id:ra.id}});
CK('区域老师(非发起人)不能代录',Object.keys(ra.votes).length===1);
/* ===== 6. 导入直接定稿 + 异步评审 ===== */
fresh();
const mkBatch=(id,asyncRv)=>({id,t:today,who:'刘翔',cK:'hq',files:[{name:'t.csv'}],items:[
 {inc:true,title:id+'话术A',kind:'话术',type:'图文',subject:'探需',vis:'全国',kw:'需求, 场景',body:{scene:'展厅',lines:'您好,先请问您主要用车场景是什么?'},assets:[],kps:[],file:'t.csv',line:2,act:'新建'},
 {inc:true,title:id+'话术B',kind:'话术',type:'图文',subject:'探需',vis:'全国',kw:'预算, 方案',body:{scene:'展厅',lines:'您的预算大概在什么范围?我给您推荐合适的配置。'},assets:[],kps:[],file:'t.csv',line:3,act:'新建'}],bad:[],st:'待确认',cids:[],direct:true,asyncRv});
let b=mkBatch('B_X1',true);S.cimps.unshift(b);UI.sel.ciB=b.id;UI.page='content';UI.tab.content='导入';render();
CK('导入页有「同时发起异步评审」勾选',/data-wc="ciAsync"/.test(html()));
A.ciConfirm({dataset:{id:b.id}});
CK('导入直接定稿后每条都发起了异步评审',b.nStored===2&&b.nRv===2&&b.cids.every(id=>content(id).st==='已定稿'&&rvActive('content',id)&&rvActive('content',id).mode==='async'));
b=mkBatch('B_X2',false);S.cimps.unshift(b);const n0=rvList().length;A.ciConfirm({dataset:{id:b.id}});
CK('不勾异步时导入不产生评审单',rvList().length===n0&&b.nRv===0);
/* ===== 7. 批量确认候选 + 异步评审 ===== */
fresh();
UI.sel.candSel=S.kpCand.filter(x=>x.st==='待确认').map(x=>x.id);UI.page='catalog';UI.tab.catalog='候选';
const k0=S.kps.length;A.candBulkOk();
CK('批量确认弹出确认框并含异步评审选项',/cbAsync/.test(dlg()));
document.querySelector('#cbAsync').checked=true;A.candBulkOkGo({dataset:{}});
CK('批量确认入库 3 个知识点,id 不重复且是数字序号',S.kps.length===k0+3&&new Set(S.kps.map(k=>k.id)).size===S.kps.length&&!S.kps.some(k=>/NaN/.test(k.id)));
CK('批量确认后为每个新知识点建了异步评审',rvList().filter(r=>r.kind==='kp'&&r.mode==='async').length===3);
const kNew=S.kps[S.kps.length-1];const rk=rvActive('kp',kNew.id);
rvVote(rk,'hq:liuxiang','deny','与已有知识点重复','刘翔');
CK('知识点异步评审未通过:不自动停用,打标记待处理',rk.st==='未通过'&&kNew.rvBad===rk.id);
fresh();UI.sel.candSel=S.kpCand.filter(x=>x.st==='待确认').map(x=>x.id);A.candBulkOk();A.candBulkOkGo({dataset:{}});
CK('不勾选时批量确认不产生评审单',rvList().length===0);
/* ===== 8. 候选仍可选择「先评审后入库」 ===== */
fresh();const cand=S.kpCand[0];
CK('候选可选 gate 与 async 两种方式',JSON.stringify(rvModesFor('kp',cand.id))==='["gate","async"]');
rvStartDlg('kp',cand.id,'gate');A.rvStartOk({dataset:{k:'kp',id:cand.id}});
CK('候选 gate 模式仍把状态置为评审中',cand.st==='评审中');
fresh();const cand2=S.kpCand[0];rvStartDlg('kp',cand2.id,'async');
document.querySelector('input[name=rvMode][value=async]').checked=true;A.rvStartOk({dataset:{k:'kp',id:cand2.id}});
CK('候选异步评审不改候选状态,仍可直接确认',cand2.st==='待确认'&&rvActive('kp',cand2.id)&&rvActive('kp',cand2.id).mode==='async');
A.kpCandOk({dataset:{id:cand2.id}});CK('候选异步评审中可直接确认入库',cand2.st==='已新增');
/* ===== 9. 强制模式可切换回来 ===== */
fresh();rvCfg().ruleMode='gate';
CK('强制模式下命中规则的草稿被拦',(()=>{A.cSubmit({dataset:{id:'N17'}});return rvNeedsGate(content('N17'))})());
UI.page='config';UI.tab.config='业务规则';render();
CK('业务规则页能切换评审规则命中后的处理方式',/data-wc="bizRvMode"/.test(html()));
A.bizRvMode({value:'suggest'});CK('切回「只建议」后不再拦',!rvNeedsGate(content('N17')));
/* ===== 10. 业务规则:谁能结项 ===== */
fresh();UI.page='config';UI.tab.config='业务规则';render();
CK('业务规则页含 10 个单选项(结项3+回炉2+对照批3+评审2)',(html().match(/data-wc="biz/g)||[]).length===10);
const radio=document.querySelector('input[data-wc="bizClose"][value="region"]');radio.checked=true;radio.dispatchEvent(new window.Event('change',{bubbles:true}));
CK('单选框的 change 事件真正写入配置',bizCfg().close.who==='region');
A.bizClose({value:'hq'});A.roleSwitch({value:'r1'});
CK('默认仅总部可结项:区域老师不可结',!bizCanClose(proj('P5')));
A.closeProj({dataset:{id:'P5'}});CK('绕过界面直接调用 closeProj 也被拦',!/结项/.test(dlg()));
UI.page='detail';UI.projId='P5';UI.ptab='效果';render();
CK('区域老师效果页不显示结项钮,并说明原因',!/data-act="closeProj"/.test(html())&&/你不能结项/.test(html()));
A.roleSwitch({value:'hq'});A.bizClose({value:'region'});proj('P4').aud.regions=['华北'];
A.roleSwitch({value:'r1'});
CK('「region」档:区域老师不能结覆盖多区域的项目',!bizCanClose(proj('P5')));
CK('「region」档:区域老师可结只覆盖本区域的项目',bizCanClose(proj('P4')));
A.roleSwitch({value:'r2'});CK('「region」档:其他区域老师不能结别区的项目',!bizCanClose(proj('P4')));
A.roleSwitch({value:'hq'});A.bizClose({value:'both'});A.roleSwitch({value:'r1'});
CK('「both」档:区域老师可结自己可见的项目',bizCanClose(proj('P5')));
A.roleSwitch({value:'boss'});CK('老板任何档都不能结项',!bizCanClose(proj('P5')));
/* ===== 11. 区域老师「回炉」需总部确认 ===== */
const rework=(mode)=>{A.reset();A.roleSwitch({value:'hq'});A.bizClose({value:'both'});A.bizRework({value:mode});A.roleSwitch({value:'r1'});A.closeProj({dataset:{id:'P4'}});document.querySelector('input[name=cr][value="回炉"]').checked=true;document.querySelector('#cw').value='话术无效';A.closeOk({dataset:{id:'P4'}})};
const n1=()=>content('N1').st+'/v'+content('N1').ver;
A.reset();const n1Before=n1();rework('hq');const pp4=proj('P4');
CK('需总部确认:区域老师选回炉后项目已结项但内容未下线',pp4.status==='已结项'&&!!pp4.reworkPending&&n1()===n1Before,n1Before+'→'+n1());
A.reworkOk({dataset:{id:'P4'}});CK('区域老师不能自己确认回炉',!!pp4.reworkPending);
A.roleSwitch({value:'hq'});UI.page='detail';UI.projId='P4';UI.ptab='效果';render();
CK('总部在效果页看到确认/驳回按钮',/reworkOk/.test(html())&&/reworkNo/.test(html()));
A.reworkOk({dataset:{id:'P4'}});CK('总部确认后内容转改版',pp4.closeRes==='回炉'&&!pp4.reworkPending&&content('N1').st==='草稿');
rework('hq');A.roleSwitch({value:'hq'});A.reworkNo({dataset:{id:'P4'}});
CK('总部驳回:按终止结项,内容保持已定稿',proj('P4').closeRes==='终止(总部驳回回炉)'&&content('N1').st==='已定稿');
rework('self');CK('「self」档:区域老师选回炉立即执行',proj('P4').closeRes==='回炉'&&!proj('P4').reworkPending&&content('N1').st==='草稿');
/* ===== 12. 对照批干预三档 ===== */
fresh();const ctrl=personAll().find(p=>p.group==='对照批');
const packs=()=>S.packs.length;
A.bizCtrl({value:'block'});let pk0=packs();A.pplPack({dataset:{mid:ctrl.mid}});
CK('block:不能给对照批人员指派学习包',packs()===pk0);
UI.page='person';UI.stuMid=ctrl.mid;render();
CK('block:详情页按钮置灰并说明配置位置',/disabled[^>]*title="对照批人员不参与干预/.test(html()));
A.bizCtrl({value:'warn'});closeDlg();pk0=packs();A.pplPack({dataset:{mid:ctrl.mid}});
CK('warn:先弹出原因框,未确认前不指派',/干预对照批人员/.test(dlg())&&packs()===pk0);
document.querySelector('#ctrlWhy').value='';A.pplPackCtrlOk({dataset:{mid:ctrl.mid}});CK('warn:不写原因不放行',packs()===pk0);
document.querySelector('#ctrlWhy').value='该学员连续三周异常';A.pplPackCtrlOk({dataset:{mid:ctrl.mid}});
CK('warn:写原因后放行,并记录干预',packs()===pk0+1&&(S.ctrlHit||[]).length===1&&S.ctrlHit[0].why==='该学员连续三周异常');
const hitP=S.projects.find(p=>p.ctrlHit&&p.eff);
CK('warn:相关项目被标记,操作记录写入原因',!!hitP&&hitP.log.some(x=>/被干预/.test(x.m||x.msg||'')));
UI.page='detail';UI.projId=hitP.id;UI.ptab='效果';render();
CK('warn:项目效果页提示「对照已被干预,结论仅供参考」',/对照已被干预/.test(html()));
A.bizCtrl({value:'free'});pk0=packs();A.pplPack({dataset:{mid:ctrl.mid}});
CK('free:直接放行并留痕',packs()===pk0+1&&(S.ctrlHit||[]).length===2);
CK('对照批干预记录已纳入存档字段',LS_FIELDS.includes('ctrlHit'));
/* ===== 复核发现的缺陷回归 ===== */
const shown=()=>document.querySelector('#mask').classList.contains('show');
const gate=()=>{rvCfg().ruleMode='gate'};
/* R1 异步评审期间内容被改:通过结果只对旧版本有效,不当作当前内容已评审,也不绕过强制评审 */
fresh();gate();ra=startAsync('N10');const cr1=content('N10');cr1.title='评审期间被改的标题';cr1.st='草稿';
rvVote(ra,'hq:liuxiang','pass','','x');const gg=ra.jury.filter(j=>j.ch==='rn');gg.slice(0,Math.floor(ra.jury.length/2)).forEach(j=>rvVote(ra,j.mid,'pass','','x'));
CK('异步评审期间内容被改:通过结论不算当前内容已评审',ra.st==='已通过'&&!rvPassedNow(cr1)&&!cr1.rvBad);
CK('异步评审通过时不覆盖发起时的内容指纹',!!ra.fp&&ra.fp!==rvFp(cr1));
fresh();gate();ra=startAsync('N10');const cr2=content('N10');
rvVote(ra,'hq:liuxiang','pass','','x');const g2=ra.jury.filter(j=>j.ch==='rn');g2.slice(0,Math.floor(ra.jury.length/2)).forEach(j=>rvVote(ra,j.mid,'pass','','x'));
CK('内容没被改:异步评审通过算评审通过',rvPassedNow(cr2));
/* R2 结项守卫与回炉幂等 */
fresh();A.closeProj({dataset:{id:'P7'}});
CK('未生效项目不能结项(弹窗不打开)',!shown());
const rw=()=>{A.reset();A.roleSwitch({value:'hq'});A.bizClose({value:'both'});A.bizRework({value:'hq'});A.roleSwitch({value:'r1'});A.closeProj({dataset:{id:'P4'}});document.querySelector('input[name=cr][value="回炉"]').checked=true;document.querySelector('#cw').value='x';A.closeOk({dataset:{id:'P4'}});closeDlg()};
rw();const tp4=S.topics.find(t=>t.id===proj('P4').from);
CK('区域老师申请回炉也会回写课题(与直接回炉一致)',proj('P4').closeRes==='回炉(待总部确认)'&&tp4&&tp4.flow!=='已采纳',tp4&&tp4.flow);
A.roleSwitch({value:'hq'});A.closeProj({dataset:{id:'P4'}});
CK('已结项(含待确认回炉)的项目不能再次结项',!shown());
const v1=content('N1').ver;A.closeOk({dataset:{id:'P4'}});CK('已结项项目直接调 closeOk 不会重复回炉',content('N1').ver===v1);
A.reworkOk({dataset:{id:'P4'}});const v2=content('N1').ver;A.reworkOk({dataset:{id:'P4'}});
CK('总部确认回炉只升一版,重复确认幂等',v2===v1+1&&content('N1').ver===v2);
A.roleSwitch({value:'boss'});rw();A.roleSwitch({value:'boss'});A.reworkOk({dataset:{id:'P4'}});A.reworkNo({dataset:{id:'P4'}});
CK('老板不能确认或驳回回炉',!!proj('P4').reworkPending);
/* R3 对照批不在 PEOPLE 里的人也要被标记到相关项目 */
fresh();A.bizCtrl({value:'free'});
const miss=personAll().filter(p=>p.group==='对照批'&&!PEOPLE.find(x=>x.mid===p.mid));
CK('样本里存在不在 PEOPLE 的对照批人员',miss.length>0,String(miss.length));
A.pplPack({dataset:{mid:miss[0].mid}});
CK('不在 PEOPLE 的对照批人员被干预后,相关项目同样被标记',S.projects.some(p=>p.ctrlHit>0));
/* R4 批量发起辅导:free 模式下对照批人员被纳入且留痕;block 模式下被跳过 */
fresh();A.bizCtrl({value:'free'});
const ctl=personAll().find(p=>p.group==='对照批'&&!(S.tickets||[]).some(t=>t.store===p.store&&t.st!=='结案'));
UI.sel.pplPage={pick:{[ctl.mid]:true}};
CK('测试前提:对照批人员已被选中',pplBulkTargets().ok.length===1&&pplBulkTargets().skip.length===0);
const hit0=(S.ctrlHit||[]).length,tk0=S.tickets.length;
A.pplBulkCoach();A.pplBulkCoachOk();
CK('free:批量发起辅导真的建了辅导项目',S.tickets.length===tk0+1);
CK('free:批量发起辅导对对照批人员留痕',(S.ctrlHit||[]).length===hit0+1&&S.ctrlHit[S.ctrlHit.length-1].what==='批量发起入店辅导');
fresh();A.bizCtrl({value:'block'});UI.sel.pplPage={pick:{[ctl.mid]:true}};
CK('block:批量路径把对照批人员放进「跳过」',pplBulkTargets().skip.length===1&&pplBulkTargets().ok.length===0);
/* R5 候选异步评审后被单条确认入库:否决结论转挂到新知识点 */
fresh();rvStartDlg('kp','C1','async');A.rvStartOk({dataset:{k:'kp',id:'C1'}});const rk1=rvActive('kp','C1');
A.kpCandOk({dataset:{id:'C1'}});const nk1=S.kps[S.kps.length-1];rvVote(rk1,'hq:liuxiang','deny','与已有重复','x');
CK('候选异步评审后入库再被否决:结论挂到新知识点',nk1.rvBad===rk1.id);
/* R6 gate 强制 + 进行中的异步评审:点通过给明确提示,不弹发起框 */
fresh();gate();A.cSubmit({dataset:{id:'N17'}});startAsync('N17');closeDlg();
A.cReview({dataset:{id:'N17'}});A.cPass({dataset:{id:'N17'}});
CK('强制评审 + 已有异步评审:点通过提示先撤回,不弹发起框',!shown()&&content('N17').st==='审核中'&&/先在评审卡里「撤回」/.test(document.querySelector('#toast').textContent));
/* R7 异步评审未通过出工作台待办,可在详情页确认处理 */
fresh();ra=startAsync('N10');rvVote(ra,'hq:liuxiang','deny','口径有误','x');
CK('内容异步评审未通过:工作台出现「异步评审未通过」待办',wbItems().some(x=>x.tag==='异步评审未通过'&&/N10|问界/.test(x.title+x.attrs)));
UI.page='cdetail';UI.cid='N10';UI.ctab='内容';render();
CK('详情页给出「确认已处理」',/rvAck/.test(html()));
A.rvAck({dataset:{k:'content',id:'N10'}});
CK('确认处理后标记与待办消失',!content('N10').rvBad&&!wbItems().some(x=>x.tag==='异步评审未通过'));
fresh();const kx=S.kps.find(x=>x.owner);UI.page='kp';UI.kid=kx.id;render();
CK('知识点详情页有「发起异步评审」',/data-k="kpx"/.test(html()));
rvStartDlg('kpx',kx.id,'async');A.rvStartOk({dataset:{k:'kpx',id:kx.id}});rvVote(rvActive('kp',kx.id),'hq:liuxiang','deny','不对','x');render();
CK('知识点异步评审未通过:详情页有确认处理,待办出现',/rvAck/.test(html())&&wbItems().some(x=>x.tag==='异步评审未通过'));
/* R8 批量路径不再抛 ReferenceError,不会重复指派,执行后清空选择 */
fresh();A.bizCtrl({value:'block'});
const two=personAll().filter(p=>p.group!=='对照批').slice(0,2);
UI.sel.pplPage={pick:{[two[0].mid]:true,[two[1].mid]:true}};
const pk8=S.packs.length;let threw8=null;
try{A.pplBulkPack();A.pplBulkPackOk()}catch(e){threw8=e.message}
CK('批量指派学习包不抛错',!threw8,threw8||'');
CK('批量指派学习包只指派一次(2 人 2 个包)',S.packs.length===pk8+2,pk8+'→'+S.packs.length);
CK('批量指派后选择被清空、弹窗已关',pplBulkTargets().list.length===0&&!shown());
const pj=S.projects.find(p=>p.status!=='已结项'&&p.status!=='已下线');
UI.sel.pplPage={pick:{[two[0].mid]:true}};A.pplBulkProj();document.querySelector('#bp_pid').value=pj.id;
let threw8b=null;try{A.pplBulkProjOk()}catch(e){threw8b=e.message}
CK('批量加入项目不抛错并清空选择',!threw8b&&pplBulkTargets().list.length===0,threw8b||'');
/* ===== 13. 遍历 ===== */
fresh();startAsync('N10');A.bizCtrl({value:'warn'});A.bizClose({value:'both'});
let errs=[];['hq','r1','r2','boss'].forEach(role=>{A.roleSwitch({value:role});PAGES_OK[UI.role.type].forEach(p=>{if(['detail','cdetail','cedit','topic','kp','kpform','qform','dform','student','person','form'].includes(p))return;UI.page=p;try{render()}catch(e){errs.push(role+'/'+p+':'+e.message)}})});
const all=['指标库','培训类型默认值','阈值与口径','业务规则','维度体系','岗位画像','评价口径','学习包模板','内容管理','知识点规则','评审灰度','标签管理','数据源'];
A.roleSwitch({value:'hq'});UI.page='config';all.forEach(t=>{UI.tab.config=t;try{render();if(document.querySelector('#main').innerHTML.length<300)errs.push('config/'+t+' 内容过短')}catch(e){errs.push('config/'+t+':'+e.message)}});
CK('四种身份遍历所有页面、配置中心 13 个页签无异常',errs.length===0,errs.slice(0,3).join(' | '));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
