/* ========== 体验指引 + 意见反馈 v20 ==========
   给"被找来体验的人"用:一份按角色的任务清单(自动打勾)、一个随处可点的"反馈"按钮、一页汇总。
   反馈存在页面里(S.fbk),可导出 CSV 发回;刷新页面会丢,所以每次体验完请点"导出"。 */
const TRYS=[
 ['培训部 · 工作台 / 知识点 / 内容中心','hq',[
  ['t0','打开「工作台」,挑一条紧急待办,点「去处理」落到对应对象',()=>UI.__seen&&UI.__seen.wb,'所有待办(缺讲解、待审核、反馈、候选…)都汇在这里'],
  ['t1','打开「知识点 → 总览」,找出「缺口最大的一个领域」',()=>UI.__seen&&UI.__seen.ov,'总览里有「各领域进展」表，点一行会跳到该领域的知识点列表'],
  ['t2','在看板里筛出「没有负责人」的知识点,给其中一个指定负责人并启用',()=>S.kps.some(k=>k.hist&&k.hist.some(h=>h.act==='指定负责人')),'知识点详情页右侧「管理」'],
  ['t3','给一条「未挂载」的内容挂上知识点',()=>S.contents.some(c=>(c.hist||[]).some(h=>h.act==='挂载知识点'&&h.t.slice(0,10)===today)),'内容中心 → 知识点筛「未挂载」→ 点详情顶部链路条里的「去挂」'],
  ['t4','新增一个知识点(看看是不是只需要填三项)',()=>S.kps.some(k=>(k.hist||[]).some(h=>h.act==='新增')),'右上角「新增知识点」'],
  ['t5','给一个知识点出一道题并定稿,看看解析有没有写清楚',()=>S.qs.some(q=>q.created===today&&q.st==='已定稿'),'内容中心 → 新增 ▾ → 题'],
  ['t5b','给一个销售动作类知识点(如「探需提问」)建一个演练:写客户一句话、必说点、思路点,定稿',()=>S.drills.some(d=>d.created===today&&d.st==='已定稿'),'内容中心 → 新增 ▾ → 演练;看看"必说点=说法1,说法2"这种写法好不好理解'],
  ['t6','找一条「已定稿但没上架」的话术,从知识点详情里一路走到上架',()=>S.contents.some(c=>(c.hist||[]).some(h=>h.act==='上架到零售通'&&h.t.slice(0,10)===today)),'工作台或知识点详情页「怎么补 → 去上架」'],
  ['v1','打开「效果追踪 → 就绪度」,在「学得好·卖得好」象限里点一个离群点,进学员详情',()=>UI.__seen&&UI.__seen.stu,'橙点=试点批,蓝点=对照批;注意顶部「仅相关」说明和「数据说明」'],
  ['v2','打开「效果追踪 → 错题集」,找到复发率,对一个高频错题点「指派学习包」',()=>S.packs.some(p=>p.ts===today&&p.tpl==='PT2'),'每条错题有代表原文和对应金牌话术'],
  ['v3','打开「效果追踪 → 调优 → 诊断」,看哪一层被命中,点「一键创建调整项」看影响预估再确认',()=>S.cfgV&&S.cfgV.length>1,'确认后会生成配置版本 v2 进入观察期'],
  ['v4','到「调优 → 前后对比」看生效前后 + 对照批,然后试一次「回滚到上一版」',()=>S.cfgV&&S.cfgV.some(v=>v.status==='已回滚'),'回滚后就绪度会按旧口径重算'],
  ['v5','到「配置中心 → 岗位画像」改一个权重,看合计校验和保存时的影响预估',()=>S.cfgV&&S.cfgV.some(v=>/画像/.test(v.note||'')),'权重合计必须 = 100'],
  ['v6','到「配置中心 → 维度体系」停用或合并一个值,看对知识点的影响提示',()=>(S.dimLog||[]).length>0,'合并会留 mergedTo,历史数据可追溯']]],
 ['学员 · 零售通','rn',[
  ['s1','切到「零售通」,在学堂首页找到「我的提升清单」',()=>UI.__seen&&UI.__seen.adapt,'AI 实战下面'],
  ['s2','做一次诊断测(12 题左右),答错几道,看看解析',()=>(S.ansLog||[]).some(a=>a.mid===ME.mid&&a.t===today),'答完会立刻告诉你对错和原因'],
  ['s3','看提升清单,挑一个「待提升」的点,点「学一学」读原话术',()=>UI.__seen&&UI.__seen.learn,''],
  ['s3b','在提升清单里找一个带「去演练」的点,完整练一场(2 个回合),看看点评是否说得清',()=>(S.ansLog||[]).some(a=>a.mid===ME.mid&&a.mode==='drill'&&a.t===today),'用自己的话回答客户;可以先不看提示,再看看提示'],
  ['s4','回来「练一练」,把这个点练到过关(掌握度 ≥ 70)',()=>adaptList(ME.mid).some(x=>x.m.v>=KP_PASS&&x.m.tries>=3),'再练会优先出你答错过的题'],
  ['s5','看提升清单顶部的「我的就绪度」,确认「最该先补」和下面列表第一项是不是同一个方向',()=>UI.__seen&&UI.__seen.adapt,'列表按画像权重排序,不再只看缺口大小']]]
];
function tryDone(t){try{return !!t[2]()}catch(e){return false}}
function tryBox(){
  const grp=document.body.dataset.end==='rn'?TRYS[1]:TRYS[0];const n=grp[2].filter(tryDone).length;
  return '<div class="gd-h" data-act="gdToggle"><b>体验任务</b><span>'+n+' / '+grp[2].length+'</span><em>'+(UI.gdOpen?'收起':'展开')+'</em></div>'
   +(UI.gdOpen?'<div class="gd-b"><div class="gd-t">'+esc(grp[0])+'</div>'+grp[2].map(t=>'<div class="gd-i '+(tryDone(t)?'ok':'')+'"><i>'+(tryDone(t)?'✓':'○')+'</i><div><div>'+esc(t[1])+'</div>'+(t[3]?'<small>'+esc(t[3])+'</small>':'')+'</div></div>').join('')
    +'<div class="gd-f"><button class="btn sm" data-act="gdOther">'+(document.body.dataset.end==='rn'?'看培训部任务':'看学员任务')+'</button> <button class="btn sm" data-act="stuck">我卡住了</button> <button class="btn sm pri" data-act="fbkOpen">写反馈</button> <button class="btn sm" data-act="fbkAll">看全部反馈('+S.fbk.length+')</button></div></div>':'');}
A.gdToggle=()=>{UI.gdOpen=!UI.gdOpen;gdRender()};
A.gdOther=()=>{A.end({dataset:{v:document.body.dataset.end==='rn'?'pc':'rn'}})};
function gdRender(){let e=document.getElementById('gd');if(!e){e=document.createElement('div');e.id='gd';document.body.appendChild(e)}e.className='gd'+(UI.gdOpen?' open':'');e.innerHTML=tryBox()}
/* 浏览痕迹:用于自动勾选(由 render() / renderRN() 末尾调用) */
function gdTrack(){UI.__seen=UI.__seen||{};if(UI.page==='workbench')UI.__seen.wb=true;if(UI.page==='student')UI.__seen.stu=true;if(UI.page==='catalog'&&curTab('catalog',KP_TABS)==='总览')UI.__seen.ov=true;if(R&&R.page==='adapt')UI.__seen.adapt=true;if(R&&R.sheet&&R.sheet.zone&&R.page==='adapt')UI.__seen.learn=true;gdRender()}
/* ---- 反馈 ---- */
const FBK_TYPES=['卡住了/看不懂','觉得多余','缺了什么','有 bug','好用'];
let FBK=null;
function fbkWhere(){const rn=document.body.dataset.end==='rn';if(rn)return '零售通 · '+({school:'学堂首页',learn:'学习中心',adapt:'提升清单',quiz:'答题',trainDetail:'学习任务',offDetail:'班次'}[R.page]||R.page);const tab=(UI.tab||{})[UI.page];const nm={workbench:'工作台',overview:'培训总览',topics:'课题池',topic:'课题详情',content:'内容中心',cedit:'内容编辑',cdetail:'内容详情',catalog:'知识点',kp:'知识点详情',kpform:'新增/编辑知识点',qform:'题目编辑',dform:'演练编辑',publish:'零售通发布',projects:'学习项目',form:'新增项目',detail:'项目详情',approvals:'报名审批',coach:'入店辅导',effect:'效果追踪',config:'配置中心'}[UI.page]||UI.page;return '后台 · '+nm+(tab?' · '+tab:'')}
A.fbkOpen=()=>{FBK={type:FBK_TYPES[0],text:'',who:'',where:fbkWhere()};fbkDlg()};
function fbkDlg(){openDlg('写反馈','<div class="fgrid"><div class="fld full"><label>你在哪(自动记录)</label><div style="padding:6px 0;color:#667085">'+esc(FBK.where)+'</div></div><div class="fld"><label>类型</label><div class="rels">'+FBK_TYPES.map(x=>'<span class="'+(FBK.type===x?'on':'')+'" data-act="fbkType" data-v="'+x+'">'+x+'</span>').join('')+'</div></div><div class="fld"><label>你是谁(选填,如 培训部 / 区域老师 / 门店顾问)</label><input type="text" id="fbk_who" value="'+esc(FBK.who)+'" style="width:100%"></div><div class="fld full"><label><b>*</b>具体说说(你想做什么 / 卡在哪 / 希望怎样)</label><textarea id="fbk_t" style="width:100%;min-height:96px" placeholder="例如:我想找某个车型缺内容的卖点,但不知道该点哪里">'+esc(FBK.text)+'</textarea></div></div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="fbkSave">提交</button>')}
A.fbkType=el=>{FBK.text=($('#fbk_t')||{}).value||'';FBK.who=($('#fbk_who')||{}).value||'';FBK.type=el.dataset.v;fbkDlg()};
A.fbkSave=()=>{const t=($('#fbk_t').value||'').trim();if(!t)return toast('请写一下具体情况','err');S.fbk.push({role:UI.role.n.split(' · ')[0],id:'U'+(S.fbk.length+1),t:(()=>{const d=new Date();return fmt(d)+' '+d.toTimeString().slice(0,5)})(),type:FBK.type,who:($('#fbk_who').value||'').trim()||'未填',where:FBK.where,text:t});FBK=null;closeDlg();toast('已记录,谢谢!(记得体验完点「看全部反馈 → 导出」发回)','ok');gdRender()};
A.fbkAll=()=>{openDlg('全部反馈('+S.fbk.length+')',S.fbk.length?'<table class="t"><tr><th>时间</th><th>位置</th><th>类型</th><th>谁</th><th>内容</th></tr>'+S.fbk.map(f=>'<tr><td class="hint">'+f.t+'</td><td style="white-space:normal">'+esc(f.where)+'</td><td><span class="tag '+(f.type==='好用'?'ok':f.type==='有 bug'?'err':'warn')+'">'+f.type+'</span></td><td>'+esc(f.who)+'</td><td style="white-space:normal;min-width:220px">'+esc(f.text)+'</td></tr>').join('')+'</table>':'<div class="empty">还没有反馈</div>','<button class="btn" data-act="close">关闭</button><button class="btn" data-act="fbkCsv">导出 CSV</button><button class="btn" data-act="fbkClr">清空</button>',true)};
A.fbkCsv=()=>{const rows=[['时间','当时的身份','位置','类型','谁','内容']].concat(S.fbk.map(f=>[f.t,f.role||'',f.where,f.type,f.who,f.text]));const csv='﻿'+rows.map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='体验反馈_'+fmt(new Date())+'.csv';document.body.appendChild(a);a.click();a.remove();toast('已导出 CSV','ok')};
A.fbkClr=()=>{S.fbk=[];closeDlg();gdRender()};

/* ---- 首次进入的欢迎说明(只弹一次;右上角"演示数据"菜单里可再看) ---- */
const WELCOME_HTML='<div style="line-height:1.9;font-size:13.5px"><p><b>这是一个交互 Demo,不是正式系统。</b>数据都是示意的,点什么都不会影响真实业务;随时可以在右上角「演示数据」里重置。</p>'
 +'<p><b>想让你帮忙看的是:</b>这套"工作台发现问题 → 知识点看缺什么 → 内容中心做讲解与练习 → 上架零售通 → 学员学习 / 诊断 / 演练"的流程,<b>是不是好理解、好操作、缺不缺东西</b>。</p>'
 +'<p><b>怎么体验:</b>左下角 / 右下角有「体验任务」清单(按你的角色),照着做,会自动打勾;卡住了、觉得多余、缺东西,点「写反馈」随手记一句,<b>系统会自动记下你当时在哪个页面</b>。</p>'
 +'<p><b>两个端:</b>顶部切换「学堂后台」(培训部 / 区域老师用)和「零售通」(一线学员用)。右上角下拉可以换身份。</p>'
 +'<p style="color:#98a2b3;font-size:12.5px">体验完请点「看全部反馈 → 导出 CSV」发回给我们。刷新页面会丢失反馈。</p></div>';
function welcome(){openDlg('欢迎来体验',WELCOME_HTML,'<button class="btn" data-act="close">先自己看看</button><button class="btn pri" data-act="welcomeGo">打开体验任务</button>')}
function pageHelpText(){const map={workbench:'先看这边：把待办按「紧急」处理完，点「去处理」会自动跳到对应对象。',catalog:'先看「总览」的四指标、各领域进展和车型×领域热力图；补清单去「知识点库」，或用页头的「批量导入 / 新车克隆」。',kp:'这里看一个点的资料齐不齐；缺的项点「去补」会到内容中心。',content:'这里是做讲课材料的地方：话术、课程、题、演练；做完要挂知识点、审核定稿。',publish:'这里决定内容在零售通给谁看；只能上架已定稿的内容。',projects:'这里组织一场培训：选人、配学习任务、排线下班次。',effect:'这里回答「培训有没有用」：先看就绪度，再看错题和调优。',config:'这里改规则和标准；一线日常不用常来。'};return map[UI.page]||''}
function pageHelp(){return pageHelpText()}
A.pageHelp=()=>{const h=pageHelp();openDlg('这页怎么用',h?'<div style="font-size:13.5px;line-height:1.8">'+esc(h)+'</div>':'<div class="hint">当前页没有额外说明。</div>','<button class="btn pri" data-act="close">知道了</button>')};
A.welcomeGo=()=>{closeDlg();UI.gdOpen=true;gdRender()};
A.welcome=()=>{welcome()};
/* ---- 我卡住了:按当前位置给"接下来可执行的几步",对接体验任务与反馈 ---- */
const RN_HELP={school:'学堂首页：先看「我的提升清单」，它按岗位画像权重排好了你最该补的点。',learn:'学习中心：这里是要学的内容，点进去读原文，读完回来打勾。',adapt:'提升清单：按「学一学 → 练一练 → 去演练」的顺序补一个点，掌握度到 70 就过关。',quiz:'答题页：答错会立刻给解析；错题会自动进错题本，之后再练会优先出这些题。',trainDetail:'学习任务：按节点顺序完成就行，卡在某个节点点进去看要求。',offDetail:'班次页：看清时间地点，到现场点签到。'};
A.stuck=()=>{
  const rn=document.body.dataset.end==='rn';
  const grp=rn?TRYS[1]:TRYS[0];
  const todo=grp[2].filter(t=>!tryDone(t)).slice(0,3);
  const help=rn?(RN_HELP[R.page]||''):(pageHelpText()||(typeof AI_PAGE_GUIDE!=='undefined'&&AI_PAGE_GUIDE[UI.page]?AI_PAGE_GUIDE[UI.page][0]+'。'+AI_PAGE_GUIDE[UI.page][1]:''));
  openDlg('我卡住了','<div class="f" style="margin-bottom:8px"><label>你现在在</label><div style="color:#667085">'+esc(fbkWhere())+'</div></div>'
   +(help?'<div class="chk" style="margin-bottom:10px"><b>💡</b><span>'+esc(help)+'</span></div>':'')
   +(todo.length?'<div style="font-size:12.5px;color:#667085;margin-bottom:4px">接下来可以做这几步（取自你的体验任务，做完会自动打勾）：</div>'+todo.map((t,i)=>'<div style="display:flex;gap:10px;padding:7px 0;border-top:1px solid #f2f3f5"><b style="color:#175cd3">'+('123'[i])+'</b><div><div>'+esc(t[1])+'</div>'+(t[3]?'<div class="hint" style="margin-top:2px">'+esc(t[3])+'</div>':'')+'</div></div>').join(''):'<div class="chk ok"><b>✓</b><span>你这边的体验任务都完成了！可以写条反馈告诉我们感受。</span></div>')
   +'<div class="hint" style="margin-top:10px">还是找不到？点「写反馈」，系统会自动记下你在哪个页面，我们来跟进。</div>',
   '<button class="btn" data-act="close">继续自己试</button><button class="btn" data-act="welcomeGo">打开体验任务</button><button class="btn pri" data-act="fbkOpen">写反馈</button>')};
