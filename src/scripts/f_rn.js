/* ========== 零售通(手机):沿用现有「学堂 → 学习中心 → 学习任务详情」,新增「线下班次培训」节点 ========== */
function rgo(page,pid,opt){R.stack.push({page:R.page,pid:R.pid});R.page=page;if(pid)R.pid=pid;if(opt&&opt.tab)R.learnTab=opt.tab;renderRN();$('#rscr').scrollTop=0}
function rback(){const s=R.stack.pop();if(s){R.page=s.page;R.pid=s.pid}else R.page='school';renderRN();$('#rscr').scrollTop=0}
A.rgo=el=>rgo(el.dataset.p,el.dataset.pid,{tab:el.dataset.t});
A.rback=()=>rback();
A.rlt=el=>{R.learnTab=el.dataset.v;renderRN()};
A.persona=el=>{ME=PEOPLE.find(x=>x.mid===el.value);R.stack=[];R.page='school';renderRN();toast('已切换为「'+ME.name+'」','ok')};

const myApp=pid=>appsOf(pid).find(a=>a.mid===ME.mid);
const myClass=pid=>S.classes.find(k=>k.proj===pid&&k.members.includes(ME.mid));
const myRes=pid=>(S.results[pid]||{})[ME.mid];
const visibleProjects=()=>S.projects.filter(p=>!['未生效','已下线'].includes(p.status)&&(myApp(p.id)||(eligible(p,ME)&&(!p.off||p.status==='已生效'))));
const myDone=p=>((S.learn[p.id]||{})[ME.mid]||[]);
function offStep(pid){
  const p=proj(pid),a=myApp(pid);
  if(!a)return {step:0,label:'去报名',cls:'o'};
  if(a.status==='待审批')return {step:1,label:'待审批',cls:'y'};
  if(a.status==='候补')return {step:1,label:'候补',cls:'y'};
  if(a.status==='已驳回')return {step:1,label:'已驳回',cls:'r',bad:true};
  const k=myClass(pid),r=myRes(pid);
  if(!(k&&p.classPub))return {step:2,label:'待分班',cls:'o'};
  if(r&&r.st==='已结业')return {step:5,label:'已结业',cls:'g'};
  if(r&&(r.offline!=null||['缺考','补考中'].includes(r.st)))return {step:4,label:r.st==='通过'?'成绩已出·通过':r.st==='未通过'?'成绩已出·未通过':r.st,cls:r.st==='通过'?'g':'y'};
  if(r&&r.signed)return {step:4,label:'已签到,待出成绩',cls:'o'};
  return {step:3,label:'待上课签到',cls:'o'};
}
function myState(pid){
  const p=proj(pid);const ts=tasksOf(p);const d=myDone(p);const n=ts.filter(x=>d.includes(x.id)).length;
  const offDone=!p.off||offStep(pid).step>=5;
  if(p.status==='已结项')return {label:'已结束',cls:''};
  if(n===ts.length&&offDone)return {label:'已完成',cls:'g'};
  return {label:'学习中',cls:'o'};
}
function renderRN(){
  const vis=visibleProjects();
  $('#rside').innerHTML='<div class="card"><b>当前学员(零售通账号)</b><select class="persona" data-wc="persona">'+PEOPLE.map(x=>'<option value="'+x.mid+'" '+(x.mid===ME.mid?'selected':'')+'>'+x.name+' · '+x.store+(isNew(x)?' · 新人':'')+'</option>').join('')+'</select><div class="hint" style="margin-top:6px">MID '+ME.mid+' · '+ME.region+' · 入职 '+ME.hire+' 天。人员来自人事系统。能看到哪些学习项目,取决于项目「覆盖角色」。</div></div>'
   +'<div class="card"><b>页面结构说明</b><div class="hint" style="margin-top:6px;line-height:1.7">按现有零售通代码还原:<br>学堂首页:搜索栏 → 今日待学习 → AI 实战 → 轮播 → 金刚位 → 直播课 → 学习专区(角色 + 分类)<br>学习中心(MyTaskList):每日晨读 / 学习项目 / 练习与考试 三个分区<br>学习任务详情(StudyProjectDetail):引导图 → 统计 → 待完成任务模块 → 已完成任务(可折叠)<br>本次新增:模块里的「线下班次培训」节点,点进去是班次详情页(报名 → 审批 → 分班 → 签到 → 结果 → 评价)。</div></div>'
   +'<div class="card"><b>我的学习项目('+vis.length+')</b>'+(vis.length?vis.map(p=>'<div style="margin-top:6px">'+esc(p.name)+' <span class="pill '+myState(p.id).cls+'">'+myState(p.id).label+'</span>'+(p.off?' <span class="pill '+offStep(p.id).cls+'">班次:'+offStep(p.id).label+'</span>':'')+'</div>').join(''):'<div class="hint" style="margin-top:6px">暂无。学习项目由后台「学习任务 → 新增学习项目」提交且已生效、覆盖角色包含当前学员才会出现。</div>')+'<div class="hint" style="margin-top:8px">后台「报名审批」「分班」「培训结果」操作后,回到这里即可看到变化。</div></div>'
   +(S.notices.length?'<div class="card"><b>消息</b>'+S.notices.slice(0,3).map(n=>'<div style="margin-top:6px"><span class="hint">'+n.t+'</span> '+esc(n.m)+'</div>').join('')+'</div>':'');
  const sc=$('#rscr');const st=sc.scrollTop;
  const f={school:rSchool,learn:rLearn,trainDetail:rDetail,offDetail:rOff,adapt:rAdapt,quiz:()=>QZ&&QZ.end?rQuizEnd():rQuiz(),drill:()=>DZ&&DZ.end?rDrillEnd():rDrill()}[R.page];
  sc.innerHTML=f();sc.scrollTop=st;
  let sh=document.getElementById('rsh');if(!sh){sh=document.createElement('div');sh.id='rsh';sh.className='rsh';document.querySelector('.phone').appendChild(sh)}
  sh.innerHTML=R.sheet?rSheetHtml():'';sh.style.display=R.sheet?'flex':'none';
  if(typeof gdTrack==='function')gdTrack();
}
const rnav=(t,back)=>'<div class="nav">'+(back?'<span class="bk" data-act="rback">‹</span>':'')+t+'</div>';
const mentorOf=mid=>{const me=pp(mid);return PEOPLE.find(x=>x.mid!==mid&&x.store===me.store&&x.hire>=365)||PEOPLE.find(x=>x.hire>=365)};
/* ---- 任务数据:模块 → 步骤 ---- */
function modulesOf(p){const ms=[];p.nodes.forEach(n=>{let m=ms.find(x=>x.mi===n.mi);if(!m){m={mi:n.mi,name:n.module,steps:[]};ms.push(m)}m.steps.push(n)});return ms}
const stepDone=(p,n)=>n.offline?offStep(p.id).step>=5:myDone(p).includes(n.id);
const examFails=(p,n)=>((S.exam||{})[p.id+':'+ME.mid+':'+n.id])||0;
const examLeft=(p,n)=>(+n.cfg.tries||0)+1-examFails(p,n);
function stepLocked(p,m,i){const n=m.steps[i];if(n.offline||stepDone(p,n))return false;
  if(n.cfg&&n.cfg.seq==='完成上一节点后解锁'&&i>0&&!stepDone(p,m.steps[i-1]))return true;
  if(n.t==='考试'&&n.cfg&&n.cfg.unlock==='需先完成本模块学习任务'&&m.steps.some(x=>x!==n&&x.t!=='考试'&&!x.offline&&!stepDone(p,x)))return true;
  return false}
function stepStatus(p,m,i){const n=m.steps[i];
  if(n.offline){const s=offStep(p.id);return {txt:s.label,k:s.step>=5?'done':'go'}}
  if(stepDone(p,n))return {txt:n.t==='考试'?'已通过':n.t==='练习'?'重新练习':'去复习',k:'done'};
  if(stepLocked(p,m,i))return {txt:'待解锁',k:'lock'};
  if(n.t==='考试'&&examLeft(p,n)<=0)return {txt:'未通过',k:'fail'};
  return {txt:{学习:'去学习',练习:'去练习',考试:'去考试',检核:'去检核',情景演练:'去演练',报名任务:'去报名'}[n.t],k:'go'}}
function tagOf(n){if(n.offline)return '线下班次';if(n.t==='学习'){const c=n.contentId&&content(n.contentId);return c?c.type:'课程'}return {练习:'练习',考试:'考试',检核:'检核',情景演练:'演练',报名任务:'报名'}[n.t]||n.t}
function progOf(p){const total=p.nodes.length;const done=p.nodes.filter(n=>stepDone(p,n)).length;return {total,done,pend:total-done,pct:total?Math.round(done/total*100):0}}
function leftDays(p){if(p.finishType===2)return Math.max(0,Math.round((new Date(p.finishTime)-D0)/864e5));return +p.finishDays||0}
const deadlineTxt=p=>p.finishType===2?'截止 '+p.finishTime:'下发后 '+p.finishDays+' 天内完成';
const rpill=(t,k)=>'<span class="rst2 '+k+'">'+t+'</span>';

/* ---- 学堂首页(对应 School/home/indexV2.js)---- */
function rSchool(){
  const vis=visibleProjects();
  const todo=vis.filter(p=>p.status!=='已结项'&&progOf(p).pend>0).slice(0,4);
  const jg=[['知识库','书'],['学习中心','课'],['直播','播'],['考试','考'],['晨读','晨'],['话术','话'],['排行榜','榜'],['学习任务','任'],['证书','证'],['更多','…']];
  const cats=['全部'].concat(CATS);const ci=R.cat==null?0:R.cat;
  const cl=S.contents.filter(c=>isPub(c)&&c.enabled!==0&&visCR(c)&&(c.chan||[]).includes('汽车销售')&&(ci===0||c.cat===cats[ci]));
  return '<div class="rtab"><span>AI助手</span><span class="on">学堂</span><span>社区</span><span>看板</span></div>'
   +'<div class="srch" data-act="rtoast" data-m="搜索课程(现有功能)">🔍 搜索你想学习的课程</div>'
   +(todo.length?'<div class="tdy"><div class="tdy-h"><b>今日待学习</b><span data-act="rgo" data-p="learn">学习中心 ›</span></div>'+todo.map(p=>{const g=progOf(p);return '<div class="tdy-r"><div class="tdy-n"><span>'+esc(p.name)+'</span><em>进度:<b>'+g.done+'</b>/'+g.total+'</em></div><button class="tdy-b" data-act="rgo" data-p="trainDetail" data-pid="'+p.id+'">去完成</button></div>'}).join('')+'</div><div style="height:8px"></div>':'')
   +'<div class="ai"><div><b>AI 实战</b><div style="font-size:12px;color:#999">模拟客户对练,即时点评('+S.drills.filter(drUsable).length+' 个演练)</div></div><button class="rb" data-act="rgo" data-p="adapt">去练习</button></div>'
   +'<div class="ai" style="margin-top:8px"><div><b>我的提升清单'+'<span class="pill o" style="margin-left:6px">新</span></b><div style="font-size:12px;color:#999">'+(typeof lrnOf==='function'&&lrnOf(ME.mid)&&S.profiles.length?'就绪度 '+(v23Readiness(ME.mid,lrnOf(ME.mid).tier).val==null?'—':v23Readiness(ME.mid,lrnOf(ME.mid).tier).val)+' · ':'')+(adaptTested(ME.mid).length?'待提升 '+adaptList(ME.mid).filter(x=>x.m.v<KP_PASS).length+' 项 · 逐项学、练、过关':'先测一测,看看哪里可以提升')+'</div></div><button class="rb" data-act="rgo" data-p="adapt">'+(adaptTested(ME.mid).length?'去提升':'去诊断')+'</button></div>'
   +'<div class="ban">新品 YU7 认证上线<small>完成认证考试,赢取学习积分</small></div>'
   +'<div class="jg">'+jg.map(j=>'<div '+((j[0]==='学习任务'||j[0]==='学习中心')?'data-act="rgo" data-p="learn"':'')+'><i>'+j[1]+'</i>'+j[0]+'</div>').join('')+'</div>'
   +'<div class="sec"><h5>直播课<span>更多 ›</span></h5><div class="td"><div class="ic">播</div><div class="tx"><b>11 月新车销售话术直播</b><small>今天 19:30 · 讲师 王磊</small></div><button class="rb gh">预约</button></div></div>'
   +'<div class="zone"><div class="zone-h"><b>学习专区·销售顾问</b><span class="dd2">切换角色 ▾</span></div><div class="zone-t">'+cats.map((c,i)=>'<span class="'+(ci===i?'on':'')+'" data-act="rcat" data-i="'+i+'">'+c+'</span>').join('')+'</div>'
   +'<div style="padding:4px 14px 20px">'+(cl.length?cl.map(c=>'<div class="td" data-act="rZone" data-id="'+c.id+'" style="cursor:pointer"><div class="ic" style="background:#eef3ff;color:#2b6fe0">'+({图文:'文',视频:'视',PDF:'P'}[c.type]||'文')+'</div><div class="tx"><b>'+esc(c.title)+'</b><small>'+c.type+(c.script?' · 话术':'')+(c.car&&c.car!=='通用车型'?' · '+esc(c.car):'')+' · 👍 '+c.up+'</small></div></div>').join(''):'<div style="text-align:center;color:#999;padding:24px 0;font-size:13px">暂无内容</div>')+'</div></div>';
}
A.rcat=el=>{R.cat=+el.dataset.i;renderRN()};
A.rtoast=el=>toast(el.dataset.m,'');

/* ---- 学习中心(对应 myTask/index.js:SectionList 三个分区)---- */
function rLearn(){
  const vis=visibleProjects();
  const card=p=>{const g=progOf(p);const done=g.pend===0;const cut=p.status==='已结项';const tag=cut?'已截止':'';
    return '<div class="spc"><div class="spc-h"><b>'+esc(p.name)+'</b>'+(tag?'<em class="spc-tag">'+tag+'</em>':'')+'</div><div class="spc-r"><div class="spc-bar"><i style="width:'+g.pct+'%"></i></div><button class="spc-b '+(done||cut?'rv':'')+'" data-act="rgo" data-p="trainDetail" data-pid="'+p.id+'">'+(done||cut?'去回顾':'去学习')+'</button></div><div class="spc-t">进度:'+g.done+'/<b>'+g.total+'</b> '+deadlineTxt(p)+'</div>'+(done?'<span class="spc-pass">✓ 已通过</span>':'')+'</div>'};
  const exams=vis.flatMap(p=>p.nodes.filter(n=>n.t==='考试').map(n=>({p,n})));
  const sh=(t,right)=>'<div class="sh0"><div class="sh1"><b>'+t+'</b>'+(right?'<span>'+right+' ›</span>':'')+'</div></div>';
  return rnav('学习中心',true)
   +sh('每日晨读','全部晨读')+'<div style="background:#fff;padding:6px 12px 10px"><div class="rd"><div><b>新车卖点三句话</b><small>今日晨读 · 2 分钟</small></div><button class="rb gh">去阅读</button></div></div>'
   +(vis.length?sh('学习项目')+'<div style="background:#fff;padding-bottom:6px">'+vis.map(card).join('')+'</div>':'')
   +(exams.length?sh('练习与考试')+'<div style="background:#fff;padding:2px 14px 8px">'+exams.map(x=>{const d=stepDone(x.p,x.n);return '<div class="ex"><div><b>'+esc(x.n.name)+'</b><small>'+esc(x.p.name)+' · 及格 '+x.n.cfg.pass+' 分</small></div>'+rpill(d?'已通过':'去考试',d?'done':'go')+'</div>'}).join('')+'</div>':'')
   +(!vis.length?'<div style="text-align:center;color:#999;padding:80px 0;font-size:13px">暂无学习项目<br>学习项目由后台提交并生效后出现</div>':'')+'<div style="height:30px"></div>';
}

/* ---- 学习任务详情(对应 StudyProjectDetail:引导图 → 统计 → 待完成模块 → 已完成折叠)---- */
function rDetail(){
  const p=proj(R.pid);if(!p){R.page='school';return rSchool()}
  const g=progOf(p);const mods=modulesOf(p);
  const isDone=m=>m.steps.every(n=>stepDone(p,n));
  const pend=mods.filter(m=>!isDone(m)),done=mods.filter(isDone);
  const modCard=m=>{
    if(m.steps.length===1){const i=0,n=m.steps[0],s=stepStatus(p,m,i);return '<div class="mc"><div class="mc-h" data-act="rTask" data-pid="'+p.id+'" data-n="'+n.id+'"><div class="mc-l"><b>'+esc(m.name)+'</b><i class="mc-tag">'+tagOf(n)+'</i>'+(n.t==='考试'&&s.k!=='lock'?'<small>剩余机会 <em style="color:'+(examLeft(p,n)>0?'#3D7EFF':'#FF4D4F')+'">'+examLeft(p,n)+'</em></small>':'')+'</div>'+stBtn(s)+'</div></div>'}
    const first=m.steps.findIndex((n,i)=>!stepDone(p,n));const fs=first>=0?first:0;const hs=stepStatus(p,m,fs);
    return '<div class="mc"><div class="mc-h" data-act="rTask" data-pid="'+p.id+'" data-n="'+m.steps[fs].id+'"><div class="mc-l"><b>'+esc(m.name)+'</b><i class="mc-tag">'+tagOf(m.steps[fs])+'</i></div>'+stBtn(hs)+'</div>'
     +m.steps.map((n,i)=>{const s=stepStatus(p,m,i);return '<div class="mc-s" data-act="rTask" data-pid="'+p.id+'" data-n="'+n.id+'"><span>'+esc(n.offline?n.name+'(线下班次培训)':n.name)+'</span>'+(n.t==='考试'&&s.k==='go'?'<small>剩余机会 <em>'+examLeft(p,n)+'</em></small>':'')+'<em class="stx '+s.k+'">'+s.txt+'</em></div>'}).join('')+'</div>'};
  const stBtn=s=>'<span class="mc-b '+s.k+'">'+s.txt+'</span>';
  const open=R.doneOpen;
  const warn=p.status==='已结项'&&g.pend>0?'<div class="warn">项目已截止,可继续学习,之后完成任务不更新进度</div>':'';
  return '<div class="nav" style="background:transparent;border:0;position:absolute;left:0;right:0;z-index:6;color:#fff"><span class="bk" data-act="rback" style="color:#fff">‹</span></div>'
   +'<div class="dh"><div><b>'+esc(p.name)+'</b><p>'+esc(p.guide||'完成下方学习任务,提升业务能力')+'</p></div></div>'
   +'<div style="height:8px;background:#F8F9FF"></div>'
   +'<div class="dsec"><div class="dsec-t"><i>▤</i>学习任务</div><div class="dsec-s">完成所有任务后,解锁激励提现能力</div></div>'
   +'<div class="sts2"><div><b>'+g.pend+'</b><span>待完成任务</span></div><div><b>'+g.done+'</b><span>已完成任务</span></div><div><b>'+g.pct+'%</b><span>完成进度</span></div><div><b>'+leftDays(p)+'天</b><span>剩余时间</span></div></div>'
   +'<div class="goalrow"><span>培训目标 <em>新增</em></span><b>'+p.metric+' '+p.base+'% → '+p.target+'%</b></div>'
   +(g.pend===0?'<div class="okbar">🎉 恭喜你,已完成所有任务</div>':'')+warn
   +'<div style="padding:4px 12px 10px">'+pend.map(m=>'<div style="margin-bottom:10px">'+modCard(m)+'</div>').join('')+'</div>'
   +(done.length?'<div class="dn"><div class="dn-h" data-act="rDoneTog">已完成任务 <span>'+done.length+' 个模块 '+(open?'▴':'▾')+'</span></div>'+(open?'<div style="padding:0 12px 10px">'+done.map(m=>'<div style="margin-bottom:10px">'+modCard(m)+'</div>').join('')+'</div>':'')+'</div>':'')
   +'<div style="height:30px"></div>';
}
A.rDoneTog=()=>{R.doneOpen=!R.doneOpen;renderRN()};
/* ---- 任务底部弹层(示意各类任务的完成方式)---- */
function zoneSheet(){const c=content(R.sheet.zone);const key='zone|'+c.id+'|'+ME.mid;
  return '<div class="rsh-m" data-act="rSheetClose"></div><div class="rsh-b"><div class="rsh-h"><b>学习专区 · '+esc(c.cat)+'</b><span data-act="rSheetClose">✕</span></div><div class="rs-c"><b>'+esc(c.title)+'</b><small>'+c.type+' · 讲师 '+esc(c.lecturer)+(c.script?' · 话术':'')+'</small><div class="rs-p" style="text-align:left;line-height:1.8;height:auto;display:block;padding:8px 10px">'+(c.type==='视频'?'▶ 视频播放(示意)':c.type==='PDF'?'📄 PDF 阅读(示意)':rnBody(c.kind,c.body)||'图文内容')+'</div></div><div class="rs-lk"><span>这条'+c.kind+'对你有用吗?</span><button class="rb gh" data-act="rZoneDo" data-v="like">👍 有用</button><button class="rb gh" data-act="rZoneDo" data-v="dislike">👎 没用</button></div>'+(R.fb&&R.fb.zone?'<div style="background:#fff7ef;border-radius:10px;padding:8px 10px;font-size:12px">'+(R.fb.mode==='dislike'?'没用的原因:':'哪里有误?')+'<div style="margin:6px 0;display:flex;flex-wrap:wrap;gap:6px">'+(R.fb.mode==='dislike'?['太长了','听不懂','客户不这么问','和实际不符','已经过时']:['数字 / 政策有误','说法不当','错别字','和其他内容矛盾']).map(x=>'<span class="rb gh" data-act="rFbReason" data-v="'+x+'" style="'+(R.fb.reason===x?'background:var(--pri);color:#fff':'')+'">'+x+'</span>').join('')+'</div><input id="rfbt" placeholder="补充一句(选填)" style="width:100%;border:1px solid #eee;border-radius:8px;padding:6px 8px"><div style="margin-top:6px"><button class="rb" data-act="rFbSend">提交</button> <button class="rb gh" data-act="rFbCancel">取消</button></div></div>':'<div style="text-align:right;font-size:12px"><a data-act="rFbErr" style="color:#999;text-decoration:underline">内容有误?纠错</a></div>')+'</div>'}
A.rZone=el=>{const c=content(el.dataset.id);c.views=(c.views||0)+1;R.sheet={zone:c.id};R.fb=null;renderRN()};
A.rZoneDo=el=>{const c=content(R.sheet.zone);const key='zone|'+c.id+'|'+ME.mid;const v=el.dataset.v;if(S.likes[key])return toast('你已反馈过','');if(v==='like'){S.likes[key]=1;c.up++;toast('已反馈,计入「内容管理」','ok');return renderRN()}R.fb={zone:c.id,mode:'dislike',reason:''};renderRN()};
function rSheetHtml(){
  if(R.sheet.zone)return zoneSheet();
  const s=R.sheet;const p=proj(s.pid);const n=p.nodes.find(x=>x.id===s.nid);let c=n.contentId?content(n.contentId):null;const cf=n.cfg||{};const done=stepDone(p,n);if(c&&n.snap){c=Object.assign({},c,{title:n.snap.title,body:n.snap.body,kw:n.snap.kw})}
  let body='',btn='';
  if(n.t==='学习'&&c){body='<div class="rs-c"><b>'+esc(c.title)+'</b><small>'+c.type+' · 讲师 '+esc(c.lecturer)+(c.script?' · 话术(来源:'+c.src+')':' · '+c.kind)+'</small><div class="rs-p">'+(c.type==='视频'?'▶ 视频播放(示意)':c.type==='PDF'?'📄 PDF 阅读(示意)':'图文内容(示意)')+'</div><small>完成条件:'+esc(sumOf(n)||'按内容判定')+'</small></div>'+(c.kind==='话术'||c.kind==='课程'?(c.kind==='话术'&&bodyLines('话术',c.body).length?'<div class="rs-p" style="text-align:left;line-height:1.8;margin-top:8px;height:auto;display:block;padding:8px 10px">'+rnBody('话术',c.body)+'</div>':'')+'<div class="rs-lk"><span>这条'+c.kind+'对你有用吗?</span><button class="rb gh" data-act="rSheetDo" data-v="like">👍 有用</button><button class="rb gh" data-act="rSheetDo" data-v="dislike">👎 没用</button></div>'+(R.fb&&R.fb.nid===n.id?'<div style="background:#fff7ef;border-radius:10px;padding:8px 10px;font-size:12px">'+(R.fb.mode==='dislike'?'没用的原因:':'哪里有误?')+'<div style="margin:6px 0;display:flex;flex-wrap:wrap;gap:6px">'+(R.fb.mode==='dislike'?['太长了','听不懂','客户不这么问','和实际不符','已经过时']:['数字 / 政策有误','说法不当','错别字','和其他内容矛盾']).map(x=>'<span class="rb gh" data-act="rFbReason" data-v="'+x+'" style="'+(R.fb.reason===x?'background:var(--pri);color:#fff':'')+'">'+x+'</span>').join('')+'</div><input id="rfbt" placeholder="补充一句(选填)" style="width:100%;border:1px solid #eee;border-radius:8px;padding:6px 8px"><div style="margin-top:6px"><button class="rb" data-act="rFbSend">提交</button> <button class="rb gh" data-act="rFbCancel">取消</button></div></div>':'<div style="text-align:right;font-size:12px"><a data-act="rFbErr" style="color:#999;text-decoration:underline">内容有误?纠错</a></div>'):'');btn=done?'':'<button class="rb" data-act="rSheetDo" data-v="done">'+(cf.req==='累计学习时长达标'?'学满 '+cf.mins+' 分钟后完成(演示:直接完成)':'学完了')+'</button>'}
  else if(n.t==='学习'){body='<div class="rs-c"><b>清河大学课程</b><small>跳转清河大学学习,进度由清河回写</small><div class="rs-p">外部课程(示意)</div><small>完成条件:'+esc(cf.prog||'')+'</small></div>';btn=done?'':'<button class="rb" data-act="rSheetDo" data-v="done">模拟清河回写:学习完成</button>'}
  else if(n.t==='练习'){body='<div class="rs-c"><b>'+esc(n.name)+'</b><small>评阅方:'+esc(cf.grader||'清河大学评阅')+' · '+esc(cf.submit||'')+(cf.submit==='评阅通过才完成'?' · 通过分 '+cf.pass:'')+'</small><div class="rs-p">作业提交(示意)</div></div>';btn=done?'':'<button class="rb" data-act="rSheetDo" data-v="done">提交作业</button>'}
  else if(n.t==='考试'){body='<div class="rs-c"><b>'+esc(n.name)+'</b><small>及格 '+cf.pass+' 分 · 时限 '+cf.limit+' 分钟 · 剩余机会 '+examLeft(p,n)+(cf.late?' · '+cf.late:'')+'</small><div class="rs-p">'+(n.rel==='内容管理考题'?'内容管理考题,系统内作答(示意)':'清河大学考试(示意)')+'</div></div>';btn=done?'':'<button class="rb" data-act="rSheetDo" data-v="pass">模拟考试通过</button> <button class="rb gh" data-act="rSheetDo" data-v="fail">模拟未通过</button>'}
  else{body='<div class="rs-c"><b>'+esc(n.name)+'</b><small>'+n.t+' · '+esc(sumOf(n))+'</small><div class="rs-p">'+n.t+'任务(示意)</div></div>';btn=done?'':'<button class="rb" data-act="rSheetDo" data-v="done">完成'+n.t+'</button>'}
  return '<div class="rsh-m" data-act="rSheetClose"></div><div class="rsh-b"><div class="rsh-h"><b>'+esc(n.module)+' · '+n.t+'</b><span data-act="rSheetClose">✕</span></div>'+body+'<div class="rsh-f">'+(done?'<span class="pill g">已完成</span>':'')+btn+'</div></div>';
}
A.rTask=el=>{const p=proj(el.dataset.pid);const n=p.nodes.find(x=>x.id===el.dataset.n);const m=modulesOf(p).find(x=>x.mi===n.mi);const i=m.steps.indexOf(n);
  if(n.offline){rgo('offDetail',p.id);return}
  const s=stepStatus(p,m,i);if(s.k==='lock')return toast('该任务尚未解锁:'+(n.t==='考试'?'需先完成本模块的学习任务':'需先完成上一个任务'),'err');
  if(s.k==='fail')return toast('考试机会已用完,请联系区域老师','err');
  R.sheet={pid:p.id,nid:n.id};renderRN()};
A.rSheetClose=()=>{R.sheet=null;R.fb=null;renderRN()};
A.rFbReason=el=>{R.fb.reason=el.dataset.v;renderRN()};
A.rFbErr=()=>{const s=R.sheet;R.fb=s.zone?{zone:s.zone,mode:'err',reason:''}:{nid:s.nid,mode:'err',reason:''};renderRN()};
A.rFbCancel=()=>{R.fb=null;renderRN()};
A.rFbSend=()=>{const s=R.sheet;const z=!!s.zone;const p=z?null:proj(s.pid);const n=z?null:p.nodes.find(x=>x.id===s.nid);const c=content(z?s.zone:n.contentId);const f=R.fb;if(!f.reason)return toast('请选一个原因','err');const t=($('#rfbt')||{}).value||'';
  if(f.mode==='dislike'){const key=z?'zone|'+c.id+'|'+ME.mid:p.id+'|'+n.id+'|'+ME.mid;S.likes[key]=-1;c.down++}
  S.feedback.unshift({id:'F'+(S.feedback.length+1),cid:c.id,type:f.mode==='err'?'纠错':'点踩',reason:f.reason,text:t.trim(),who:ME.name+'('+ME.store+')',t:today+' '+new Date().toTimeString().slice(0,5),st:'待处理',proj:z?'':p.id,ver:z?c.ver:(n.contentVer||1)});
  R.fb=null;toast(f.mode==='err'?'已提交纠错,内容负责人会收到':'已反馈,内容负责人会收到','ok');renderRN()};
A.rSheetDo=el=>{const s=R.sheet;const p=proj(s.pid);const n=p.nodes.find(x=>x.id===s.nid);const v=el.dataset.v;
  if(v==='like'){const c=content(n.contentId);const key=p.id+'|'+n.id+'|'+ME.mid;if(S.likes[key])return toast('你已反馈过','');S.likes[key]=1;c.up++;toast('已反馈,计入「内容管理」(灰度项目会按批次比较)','ok');return renderRN()}
  if(v==='dislike'){const key=p.id+'|'+n.id+'|'+ME.mid;if(S.likes[key])return toast('你已反馈过','');R.fb={nid:n.id,mode:'dislike',reason:''};return renderRN()}
  if(v==='fail'){S.exam=S.exam||{};const k=p.id+':'+ME.mid+':'+n.id;S.exam[k]=(S.exam[k]||0)+1;toast('未通过,剩余机会 '+Math.max(0,examLeft(p,n)),'err');if(examLeft(p,n)<=0)R.sheet=null;return renderRN()}
  const L=S.learn[p.id]||(S.learn[p.id]={});const d=L[ME.mid]||(L[ME.mid]=[]);if(!d.includes(n.id))d.push(n.id);R.sheet=null;
  const g=progOf(p);toast(g.pend===0&&!p.off?'恭喜,已完成所有任务':'任务已完成','ok');renderRN()};

/* ---- 线下班次培训详情(新增页,放在模块里的「线下班次培训」节点点进来)---- */
function rOff(){
  const p=proj(R.pid);if(!p||!p.off){R.page='school';return rSchool()}
  const s=offStep(p.id),a=myApp(p.id),k=myClass(p.id),r=myRes(p.id);
  const steps=['报名','审批','分班','上课签到','培训结果'];
  const pl='<div class="sec"><div class="pl">'+steps.map((x,i)=>'<div class="'+(i<s.step?'done':i===s.step?(s.bad?'bad':'cur'):'')+'">'+(i===1&&s.label==='候补'?'候补':i===1&&s.bad?'已驳回':x)+'</div>').join('')+'</div></div>';
  let body='',bar='';const o=p.offNode;
  const info='<div class="sec"><h5>培训信息</h5><div class="rkv"><span>所属项目</span><span style="text-align:right;max-width:200px">'+esc(p.name)+'</span></div><div class="rkv"><span>课时</span><span>'+esc(o.hours)+'</span></div><div class="rkv"><span>考核方式</span><span style="text-align:right;max-width:200px">'+esc(o.assess)+'</span></div><div class="rkv"><span>报名类型</span><span>'+p.signup+'</span></div>'+(p.signup==='报名制'?'<div class="rkv"><span>报名截止</span><span>'+p.deadline+'</span></div><div class="rkv"><span>名额</span><span>'+cntOk(p.id)+' / '+p.quota+'</span></div><div class="rkv"><span>审批人</span><span style="text-align:right;max-width:190px">'+esc(p.approver)+'</span></div>':'')+'</div>';
  if(!a){
    body=info+'<div class="sec"><h5>报名说明</h5><div style="font-size:13px;color:#666;line-height:1.7">报名后由审批人审批;名额已满将进入候补'+(o.waitlist==='开启'?',有人退出会按申请时间自动递补':'')+'。'+(o.cancel==='不可撤销'?'报名后不可撤销。':'截止前可撤销报名。')+'</div></div>';
    if(p.signup==='报名制')bar=p.deadline<today?'<div class="rbar"><button class="rb dis">报名已截止</button></div>':'<div class="rbar"><button class="rb" data-act="rApply" data-pid="'+p.id+'">立即报名</button></div>';
  }else if(a.status==='待审批'){
    body='<div class="sec"><h5>已提交报名</h5><div style="font-size:13px;color:#666;line-height:1.7">提交时间 '+a.time+'<br>正在等待审批,结果会推送给你。</div></div>'+info;
    bar=o.cancel==='不可撤销'?'':'<div class="rbar"><button class="rb gh" data-act="rCancel" data-pid="'+p.id+'">撤销报名</button></div>';
  }else if(a.status==='候补'){
    const idx=appsOf(p.id).filter(x=>x.status==='候补').sort((x,y)=>x.time<y.time?-1:1).findIndex(x=>x.id===a.id)+1;
    body='<div class="sec"><h5>名额已满 · 候补中</h5><div style="font-size:13px;color:#666;line-height:1.7">你在候补队列第 <b>'+idx+'</b> 位。有人退出后将自动递补,递补后会通知你。</div></div>'+info;
  }else if(a.status==='已驳回'){
    body='<div class="sec"><h5 style="color:var(--err)">报名未通过</h5><div style="font-size:13px;color:#666;line-height:1.7">驳回原因:'+(a.reason?esc(a.reason):'审批人未填写原因')+'</div></div>'+info;
    bar='<div class="rbar"><button class="rb" data-act="rApply" data-pid="'+p.id+'">重新报名</button></div>';
  }else{
    if(s.step===2)body='<div class="sec"><h5 style="color:var(--ok)">'+(a.src.indexOf('免审')>=0?'你在本期培训名单中':'审批已通过')+'</h5><div style="font-size:13px;color:#666;line-height:1.7">正在分班,分班结果发布后会通知你。</div></div>'+info;
    else{
      const scan=(o.sign||'').indexOf('扫')>=0;
      body='<div class="sec"><h5>我的班次</h5><div style="font-size:16px;font-weight:600;margin:4px 0">'+esc(k.name)+'</div><div class="rkv"><span>课程</span><span style="text-align:right;max-width:200px">'+esc(k.course)+'</span></div><div class="rkv"><span>上课时间</span><span>'+k.date+' '+k.time+'</span></div><div class="rkv"><span>地点</span><span style="text-align:right;max-width:200px">'+esc(k.place)+'</span></div><div class="rkv"><span>讲师</span><span>'+esc(k.teacher)+'</span></div><div class="rkv"><span>签到方式</span><span>'+(scan?'到课现场扫班次二维码':'点击签到')+'</span></div><div class="rkv"><span>签到</span><span>'+(r&&r.signed?'<span class="pill g">已签到</span>':'<span class="pill">未签到</span>')+'</span></div></div>';
      if(s.step===3)bar='<div class="rbar"><button class="rb" data-act="rSign" data-pid="'+p.id+'">'+(scan?'扫码签到':'上课签到')+'</button></div>';
      if(s.step>=4&&r&&(r.offline!=null||r.st==='已结业')){
        const f=fin(r);
        body+='<div class="sec"><h5>培训成绩</h5><div class="rkv"><span>线上考试</span><span>'+(r.online==null?'-':r.online)+'</span></div><div class="rkv"><span>线下评分</span><span>'+(r.offline==null?'-':r.offline)+'</span></div><div class="rkv"><span>总评</span><span><b>'+(f==null?'-':f)+'</b></span></div><div class="rkv"><span>通过状态</span><span>'+(r.st==='已结业'||r.st==='通过'?'<span class="pill g">通过</span>':'<span class="pill r">未通过</span>')+(r.st==='已结业'?' <span class="pill g">已结业</span>':'')+'</span></div></div>';
        if(r.st==='已结业'){
          const mt=mentorOf(ME.mid);const ev=((S.evals||{})[p.id]||{})[ME.mid];
          body+='<div class="sec"><h5>项目目标进度</h5><div class="rkv"><span>'+p.metric+'</span><span>基线 '+p.base+'% → 目标 '+p.target+'%</span></div><div style="font-size:12px;color:#999;margin-top:6px">'+(p.cur==null?'观察期结束后统计,结果会在这里更新':'当前 '+p.cur+'%')+'</div></div><div class="sec"><h5>后续安排</h5><div class="rkv"><span>带教师傅</span><span>'+(mt?esc(mt.name)+'('+esc(mt.store)+')':'待分配')+'</span></div><div class="rkv"><span>首月目标</span><span>'+p.metric+' 达到 '+p.target+'%</span></div><div style="font-size:11px;color:#bbb;margin-top:6px">带教师傅来自人事系统师徒关系</div></div>';
          body+='<div class="sec"><h5>课后评价</h5>'+(ev?'<div style="font-size:13px;color:#666">已评价:内容有用度 '+ev.content+' 星 · 讲师 '+ev.teacher+' 星,谢谢你的反馈</div>':'<div class="rv"><span>内容有用度</span>'+[1,2,3,4,5].map(i=>'<i class="st '+((R.rv&&R.rv.c>=i)?'on':'')+'" data-act="rStar" data-k="c" data-v="'+i+'">★</i>').join('')+'</div><div class="rv"><span>讲师</span>'+[1,2,3,4,5].map(i=>'<i class="st '+((R.rv&&R.rv.t>=i)?'on':'')+'" data-act="rStar" data-k="t" data-v="'+i+'">★</i>').join('')+'</div><button class="rb" style="width:100%;margin-top:8px" data-act="rEval" data-pid="'+p.id+'">提交评价</button>')+'</div>';
        }else if(r.st==='未通过')body+='<div class="sec"><div style="font-size:13px;color:#666">未通过,可联系区域老师安排补考(最多 '+(o.retake==null?1:o.retake)+' 次)。</div></div>';
      }else if(s.step===4)body+='<div class="sec"><div style="font-size:13px;color:#666">已签到,线下成绩录入后会在这里显示。</div></div>';
    }
    body+=info;
  }
  return rnav('线下班次培训',true)+'<div class="hero"><h3>'+esc(o.name)+'</h3><p>'+esc(p.name)+' · <span class="pill '+s.cls+'">'+s.label+'</span></p></div>'+pl+body+'<div style="height:30px"></div>'+bar;
}
A.rStar=el=>{R.rv=R.rv||{c:0,t:0};R.rv[el.dataset.k]=+el.dataset.v;renderRN()};
A.rEval=el=>{const v=R.rv||{};if(!v.c||!v.t)return toast('请给内容和讲师都打分','err');S.evals=S.evals||{};(S.evals[el.dataset.pid]=S.evals[el.dataset.pid]||{})[ME.mid]={content:v.c,teacher:v.t,t:today};R.rv=null;logp(proj(el.dataset.pid),'课后评价:内容 '+v.c+' 星 / 讲师 '+v.t+' 星',ME.name);toast('感谢评价','ok');renderRN()};
A.rApply=el=>{const pid=el.dataset.pid;const p=proj(pid);if(p.deadline<today)return toast('报名已截止','err');
  S.apps=S.apps.filter(a=>!(a.proj===pid&&a.mid===ME.mid));S.apps.push({id:'A'+ME.mid+pid,proj:pid,mid:ME.mid,time:today+' '+new Date().toTimeString().slice(0,5),status:'待审批',src:'零售通报名'});logp(p,'报名提交(零售通)',ME.name);toast('报名已提交,等待审批','ok');renderRN();renderMenu()};
A.rCancel=el=>{S.apps=S.apps.filter(a=>!(a.proj===el.dataset.pid&&a.mid===ME.mid));toast('已撤销报名','ok');renderRN();renderMenu()};
/* 签到:扫班次码 / 点击签到 */
function doSign(pid){ensureRes(pid,ME.mid);S.results[pid][ME.mid].signed=true;logp(proj(pid),'上课签到(零售通)',ME.name);toast('签到成功','ok');R.sheet=null;renderRN()}
A.rSign=el=>{const p=proj(el.dataset.pid);const scan=(p.offNode.sign||'').indexOf('扫')>=0;if(!scan)return doSign(p.id);
  R.sheet={scan:p.id};renderRN()};
A.rScanOk=el=>{const p=proj(el.dataset.pid);const k=myClass(p.id);doSign(p.id)};
A.rScanBad=()=>toast('二维码不属于你的班次,请扫描本班次的签到码','err');
/* 扫码弹层 */
const _rSheetHtml=rSheetHtml;
rSheetHtml=function(){const s=R.sheet;if(s.scan){const p=proj(s.scan);const k=myClass(p.id);return '<div class="rsh-m" data-act="rSheetClose"></div><div class="rsh-b"><div class="rsh-h"><b>扫码签到</b><span data-act="rSheetClose">✕</span></div><div class="rs-c"><div class="rs-p" style="height:150px;background:#111;color:#9fe">📷 摄像头取景(示意)<br><small style="color:#6c9">请对准老师展示的班次二维码</small></div><small>班次:'+esc(k.name)+' · '+k.date+'。老师在后台「分班 → 班次 → 签到码」展示或打印二维码。演示环境不校验日期。</small></div><div class="rsh-f"><button class="rb" data-act="rScanOk" data-pid="'+p.id+'">模拟:扫到本班次码</button> <button class="rb gh" data-act="rScanBad">模拟:扫到别的班次码</button></div></div>'}return _rSheetHtml()};

/* ========== 启动 ========== */
reset();seedDemo();renderBell();render();
if(typeof welcome==='function'&&!window.__NOWELCOME)setTimeout(welcome,300);
