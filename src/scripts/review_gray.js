/* ========== 评审灰度(内容 / 知识点候选共用) ==========
   和「学员灰度」(l_gray.js,定稿后给学员分批下发)不同:评审灰度发生在定稿之前,
   由评审团(总部同事 + 销冠)评估「这条能不能用」,通过才定稿 / 才入库。
   数据:S.rvw = 评审单数组。脚本顶层不得访问 S / UI,所有读取都在函数体内。
   评审单 = {id,kind:'content'|'kp',oid,title,by,at,due,jury:[{mid,name,role,must,ch}],votes:{mid:{v,note,t}},
            st:'评审中'|'已通过'|'未通过'|'已撤回',why:触发原因,res,resAt,reminded:[],log:[]}
   投票 v: pass 能用 / fix 要改 / deny 不行 */
const RV_DIMS=['准确(口径、数字没错)','能说出口(销冠愿意这样讲)','风险(合规、禁说词、夸大)'];
const RV_VOTE={pass:['能用','ok'],fix:['要改','warn'],deny:['不行','err']};
const rvCfg=()=>{const c=S.cfg;if(!c.rvw)c.rvw={on:true,days:3,onTimeout:'提醒发起人',ruleMode:'suggest',rules:{policy:true,compete:true,champion:true,firstUse:true},defaultJury:null};if(!c.rvw.ruleMode)c.rvw.ruleMode='suggest';return c.rvw};
const rvList=()=>S.rvw||(S.rvw=[]);
const rvSeq=r=>+String(r.id).replace(/\D/g,'');
const rvOf=(kind,oid)=>rvList().filter(r=>r.kind===kind&&r.oid===oid).sort((a,b)=>rvSeq(b)-rvSeq(a))[0];
const rvActive=(kind,oid)=>{const r=rvOf(kind,oid);return r&&r.st==='评审中'?r:null};
/* 只关心「会阻塞流程」的评审(先评审后定稿 / 入库);异步评审不阻塞任何操作 */
const rvBlocking=(kind,oid)=>{const r=rvOf(kind,oid);return r&&r.st==='评审中'&&r.mode!=='async'?r:null};
/* 销冠 = 动态身份:取当期滚动评定名单(v23),不是静态岗位档;名单随每月评定可进可出 */
const rvChampions=()=>typeof v23Champions==='function'?v23Champions().map(c=>({mid:c.mid,name:c.name,region:c.region,store:c.store,hire:(lrnOf(c.mid)||{}).hire||0})):[];
const rvLog=(r,who,msg)=>{r.log.unshift({t:today+' '+new Date().toTimeString().slice(0,5),who,msg})};
const rvJuryHas=(r,mid)=>r.jury.some(j=>j.mid===mid);
/* 评审团成员:销冠(手机端)或总部同事(PC 端,mid 以 hq: 开头) */
const rvHqPeople=()=>[{mid:'hq:liuxiang',name:'刘翔',role:'总部培训部',ch:'pc'},{mid:'hq:zhoulei',name:'周磊',role:'总部零售运营',ch:'pc'},{mid:'hq:lixm',name:'李晓梅',role:'总部产品部',ch:'pc'}];
const rvCanManage=r=>{if(!UI||!UI.role||UI.role.type==='boss')return false;if(UI.role.type==='hq')return true;return String(r.by||'').includes(UI.role.name)};
const rvPcMe=()=>UI&&UI.role&&UI.role.type==='hq'?'hq:liuxiang':null;

/* ---- 触发规则:返回命中的原因数组,空数组=不强制 ---- */
function rvTriggers(c){
  const cfg=rvCfg();const out=[];if(!cfg.on||!c)return out;
  const txt=(c.title||'')+(c.subject||'')+(c.theme||'')+(c.kw||'');
  if(cfg.rules.policy&&(/政策|补贴|口径|国补|以旧换新|税|金融/.test(txt)||c.sub==='政策类'))out.push('政策口径类内容');
  if(cfg.rules.compete&&c.kind==='话术'&&/对比|竞品/.test(txt))out.push('竞品对比话术');
  if(cfg.rules.champion&&c.src==='销冠挖掘')out.push('来源是销冠语料蒸馏');
  /* 只管还在生产中的新话术(草稿 / 审核中且从没被引用);已定稿在用的存量内容不重新拦 */
  if(cfg.rules.firstUse&&!c.orig&&['草稿','审核中'].includes(c.st)&&contentUse(c.id)===0&&c.kind==='话术')out.push('首次使用的新话术');
  return out;
}
const rvFp=c=>{try{return JSON.stringify([c.title,c.kw,c.body,c.vis,c.kps])}catch(e){return ''}};
const rvPassedNow=c=>{const r=rvOf('content',c.id);return !!(r&&r.st==='已通过'&&r.ver===c.ver&&r.fp===rvFp(c))};
/* 强制:规则命中且 ruleMode=gate 且还没评审通过 → 审核人通过时必须先评审;suggest 模式只在界面上建议,从不拦截 */
function rvNeedsGate(c){return rvCfg().ruleMode==='gate'&&rvTriggers(c).length>0&&!rvPassedNow(c)}
/* 建议:命中规则、还没评审通过、也没有进行中的评审 */
function rvSuggest(c){return rvTriggers(c).length>0&&!rvPassedNow(c)&&!rvActive('content',c.id)}

/* ---- 评审单的创建 / 投票 / 判定 ---- */
function rvCreate(o){
  const cfg=rvCfg();
  const r={id:'RV'+(1+Math.max(0,...rvList().map(rvSeq))),mode:o.mode||'gate',kind:o.kind,oid:o.oid,title:o.title,ver:o.ver||null,by:o.by||meShort(),at:today,due:addDays(today,o.days||cfg.days),
    jury:o.jury,votes:{},st:'评审中',fp:o.fp||null,why:o.why||'手动发起',reminded:[],log:[]};
  rvList().push(r);rvLog(r,r.by,(r.mode==='async'?'发起异步评审(不阻塞定稿/入库):':'发起评审灰度:')+r.why+';评审团 '+r.jury.length+' 人,必须点 '+r.jury.filter(j=>j.must).length+' 人,期限 '+r.due);
  notify((o.kind==='kp'?'候选知识点「':'内容「')+o.title+(r.mode==='async'?'」发起异步评审':'」进入评审灰度')+',评审团 '+r.jury.length+' 人');
  return r;
}
function rvTally(r){
  const js=r.jury,vs=js.map(j=>({j,v:r.votes[j.mid]}));
  const n=js.length,voted=vs.filter(x=>x.v).length;
  const pass=vs.filter(x=>x.v&&x.v.v==='pass').length,deny=vs.filter(x=>x.v&&x.v.v==='deny').length,fix=vs.filter(x=>x.v&&x.v.v==='fix').length;
  const must=vs.filter(x=>x.j.must);
  const mustBad=must.filter(x=>x.v&&x.v.v!=='pass').length,mustWait=must.filter(x=>!x.v).length;
  const need=Math.floor(n/2)+1;
  /* 通过标准:必须点全部「能用」且「能用」票过半;必须点有人「不行/要改」直接不通过;无人可能再翻盘也提前判定 */
  let verdict='wait';
  if(mustBad>0)verdict='back';
  else if(pass>=need&&mustWait===0)verdict='go';
  else if(pass+(n-voted)<need)verdict='back';
  return {n,voted,pass,fix,deny,need,mustWait,mustBad,verdict};
}
function rvFinishAsync(r,ok,who,note){
  r.st=ok?'已通过':'未通过';r.resAt=today;r.res=note||'';rvLog(r,who,(ok?'异步评审通过':'异步评审未通过')+(note?':'+note:''));
  if(r.kind==='content'){const c=content(r.oid);if(!c)return;
    /* 评审的是发起时的那一版(ver + 内容指纹);之后内容被改过,结论只记日志,不往新内容上打标,也不当作评审通过 */
    const same=r.ver===c.ver&&(!r.fp||r.fp===rvFp(c));
    if(!same){rvLog(r,'系统','评审期间内容已被修改(v'+r.ver+' → v'+c.ver+'或正文变化),本结论只对旧版本有效,不记为当前内容的评审结果');chist(c,ok?'异步评审(旧版本)通过':'异步评审(旧版本)未通过','结论只对发起时的版本有效',who);return}
    if(ok){chist(c,'异步评审通过(已评审)',note||'',who);notify('内容「'+c.title+'」异步评审通过')}
    else{c.rvBad=r.id;chist(c,'异步评审未通过,建议改版',note||'',who);notify('内容「'+c.title+'」异步评审未通过:'+(note||'见评审意见')+';已定稿内容不会自动下线,请决定是否改版')}}
  if(r.kind==='kp'){
    /* 评审单挂的可能是候选 Cx(async 后被单条确认入库了):转到入库后的知识点上 */
    let k=S.kps.find(z=>z.id===r.oid);
    if(!k){const cd=S.kpCand.find(z=>z.id===r.oid);if(cd&&cd.newKpId)k=S.kps.find(z=>z.id===cd.newKpId)}
    if(!k)return;
    if(ok){k.rvOk=r.id;k.hist.push({t:today,who,act:'异步评审通过',note:note||''});notify('知识点「'+k.name+'」异步评审通过')}
    else{k.rvBad=r.id;k.hist.push({t:today,who,act:'异步评审未通过',note:note||''});notify('知识点「'+k.name+'」异步评审未通过:'+(note||'见评审意见')+';不会自动停用,请负责人处理')}}
}
function rvFinish(r,ok,who,note){
  if(r.mode==='async')return rvFinishAsync(r,ok,who,note);
  if(r.kind==='content'){const c0=content(r.oid);
    if(c0&&ok&&c0.st!=='审核中'){r.st='已撤回';rvLog(r,'系统','内容已不在审核中('+c0.st+'),评审作废,不再定稿');return}
    if(c0&&ok&&r.fp&&r.fp!==rvFp(c0)){r.st='已撤回';rvLog(r,'系统','评审期间内容被修改,评审结果作废,请重新提审后再评审');chist(c0,'评审作废','评审期间内容被修改');c0.st='草稿';notify('内容「'+c0.title+'」评审期间被修改,评审作废');return}}
  r.st=ok?'已通过':'未通过';r.resAt=today;r.res=note||'';rvLog(r,who,(ok?'评审通过':'评审未通过')+(note?':'+note:''));
  if(r.kind==='content'){const c=content(r.oid);if(!c)return;
    if(ok){r.fp=rvFp(c);c.st='已定稿';c.vers=c.vers.filter(x=>x.v!==c.ver);c.vers.push({v:c.ver,t:today,who:who,note:'评审灰度通过',snap:snapOf(c)});chist(c,'评审灰度通过,已定稿(v'+c.ver+')',note||'',who);
      const t=c.topic&&topic(c.topic);if(t)thist(t,who,'内容已定稿','「'+c.title+'」评审灰度通过');
      notify('内容「'+c.title+'」评审灰度通过,已定稿')}
    else{c.st='草稿';chist(c,'评审灰度未通过,退回草稿',note||'',who);notify('内容「'+c.title+'」评审灰度未通过:'+(note||'见评审意见'))}}
  if(r.kind==='kp'){const x=S.kpCand.find(k=>k.id===r.oid);if(!x)return;
    if(ok){x.st='待确认';x.rvPass=true;notify('候选知识点「'+x.name+'」评审通过,可以确认新增')}
    else{x.st='已忽略';x.rvDeny=r.id;notify('候选知识点「'+x.name+'」评审未通过,已忽略')}}
}
function rvVote(r,mid,v,note,who){
  if(r.st!=='评审中')return {err:'评审已结束'};
  if(!rvJuryHas(r,mid))return {err:'你不在这次评审团里'};
  if(r.votes[mid])return {err:'你已经投过票,不能重复修改'};
  if(r.due<today)return {err:'评审已过期('+r.due+'),请等发起人决策'};
  if(v!=='pass'&&!String(note||'').trim())return {err:'选「要改」或「不行」必须写一句意见'};
  r.votes[mid]={v,note:String(note||'').trim(),t:today+' '+new Date().toTimeString().slice(0,5)};
  rvLog(r,who,'投「'+RV_VOTE[v][0]+'」'+(note?':'+note:''));
  const t=rvTally(r);
  if(t.verdict==='go')rvFinish(r,true,'系统','通过票 '+t.pass+'/'+t.n+',必须点全部通过');
  else if(t.verdict==='back')rvFinish(r,false,'系统',t.mustBad?'必须点未通过':'通过票不可能过半('+t.pass+'/'+t.n+')');
  return {ok:true,t};
}
/* 观察期满 / 超时:按配置处理;只处理已过期的评审中单 */
function rvSweep(){
  rvList().filter(r=>r.st==='评审中'&&r.due<today).forEach(r=>{
    const cfg=rvCfg();if(r.timeoutDone)return;r.timeoutDone=true;
    const t=rvTally(r);
    if(cfg.onTimeout==='已投票过半且无反对则推进'&&t.voted*2>t.n&&t.deny===0&&t.fix===0&&t.mustBad===0&&t.pass>=1&&t.mustWait===0){rvFinish(r,true,'系统','超时推进:已投票 '+t.voted+'/'+t.n+',无「要改 / 不行」,必须点已通过')}
    else{rvLog(r,'系统','评审已超期('+r.due+'),待发起人决策');notify('评审「'+r.title+'」已超期,待发起人决策')}});
}

/* ---- 发起评审(内容):审核人在审核弹窗里点「发起评审灰度」,或规则命中时通过被拦截 ---- */
function rvJuryDefault(){
  const cfg=rvCfg();const pool=rvChampions();
  /* defaultJury = null 表示「当期销冠全部默认入团」;手动勾选过的按勾选名单(已滚出名单的自然失效) */
  const ms=cfg.defaultJury===null?pool.map(x=>x.mid):(cfg.defaultJury||[]);
  const ch=pool.filter(x=>ms.includes(x.mid)).map(x=>({mid:x.mid,name:x.name,role:'销冠 · '+x.region,must:false,ch:'rn'}));
  const hq=rvHqPeople().map((x,i)=>Object.assign({must:i===0},x));
  return hq.concat(ch);
}
const rvKpDesc=oid=>{const x=S.kpCand.find(k=>k.id===oid);if(x)return x.why||x.name;const k=S.kps.find(z=>z.id===oid);return k?(k.name+(k.syn&&k.syn.length?'(同义:'+k.syn.join('、')+')':'')+' · '+(k.type||'')+' · 负责人 '+(k.owner||'无')):''};
const rvObj=(kind,oid)=>kind==='content'?content(oid):kind==='kp'?S.kpCand.find(x=>x.id===oid):S.kps.find(x=>x.id===oid);
/* 能不能发起异步:内容已定稿 / 知识点已入库(kpx)或候选(kp) */
function rvModesFor(kind,oid){
  const o=rvObj(kind,oid);if(!o)return [];
  if(kind==='content')return o.st==='审核中'||o.st==='草稿'?(o.st==='审核中'?['gate','async']:['async']):(o.st==='已定稿'?['async']:[]);
  if(kind==='kp')return o.st==='待确认'?['gate','async']:[];
  return ['async'];
}
function rvStartDlg(kind,oid,pref){
  const c=rvObj(kind,oid);if(!c)return;
  const title=kind==='content'?c.title:c.name;
  const modes=rvModesFor(kind,oid);if(!modes.length)return toast('当前状态不能发起评审','err');
  const mode=modes.includes(pref)?pref:modes[0];
  const trig=kind==='content'?rvTriggers(c):[kind==='kp'?'候选知识点,新增前先评估':'已入库知识点,事后补评审'];
  const J=rvJuryDefault();const cfg=rvCfg();
  const hq=rvHqPeople().map(x=>Object.assign({grp:'hq'},x));
  const champ=rvChampions().map(x=>({mid:x.mid,name:x.name,role:'销冠 · '+x.region,ch:'rn',grp:'ch'}));
  UI.sel.rvDraft={kind,oid,mode,jury:J.map(j=>j.mid),must:J.filter(j=>j.must).map(j=>j.mid),days:cfg.days,why:trig.length?trig.join('、'):'手动发起'};
  const D=UI.sel.rvDraft;
  const pick=arr=>'<div class="rvx-pick">'+arr.map(p=>'<label><input type="checkbox" class="rvj" value="'+p.mid+'" '+(D.jury.includes(p.mid)?'checked':'')+'><span>'+esc(p.name)+(p.grp==='hq'?' <small>'+esc(p.role)+'</small>':' <small>'+esc(p.role.replace('销冠 · ',''))+'</small>')+'</span><span class="must"><input type="checkbox" class="rvm" value="'+p.mid+'" '+(D.must.includes(p.mid)?'checked':'')+'>必须点</span></label>').join('')+'</div>';
  const modeCard=(v,t,d)=>'<label class="'+(modes.includes(v)?'':'off')+'"><input type="radio" name="rvMode" value="'+v+'" '+(mode===v?'checked':'')+(modes.includes(v)?'':' disabled')+'> <b style="display:inline">'+t+'</b><div class="hint">'+d+(modes.includes(v)?'':'(当前状态不可选)')+'</div></label>';
  openDlg((mode==='async'?'发起异步评审 · ':'发起评审灰度 · ')+title,'<div class="rvx-start">'
   +'<div class="grp"><div class="gh"><b style="color:var(--err)">*</b>评审方式</div><div class="rvx-mode">'
   +modeCard('gate','先评审后定稿 / 入库','评审通过才定稿 / 入库;未通过退回')
   +modeCard('async','异步评审,不阻塞','不影响定稿 / 上架 / 入库;结论事后回流,通过打「已评审」,未通过出待办,不自动下线')
   +'</div></div>'
   +(trig.length?'<div class="tag warn" style="display:block;margin-bottom:12px;white-space:normal;line-height:1.7;padding:6px 12px">命中规则:'+trig.map(esc).join('、')+'</div>':'')
   +'<div class="grp"><div class="gh"><b style="color:var(--err)">*</b>评审团 <span class="hint">勾选入团;入团后可标「必须点」</span></div>'
   +'<div class="hint" style="margin-bottom:6px">总部(PC 工作台)</div>'+pick(hq)
   +'<div class="hint" style="margin:10px 0 6px">销冠(零售通手机端)</div>'+pick(champ)+'</div>'
   +'<div class="grp"><div class="gh"><b style="color:var(--err)">*</b>评审期限</div><div><input type="number" id="rvDays" value="'+cfg.days+'" min="1" style="width:80px"> 天</div></div>'
   +'<div class="hint" style="line-height:1.8">通过标准:<b>必须点全部「能用」且「能用」票过半</b>;必须点投了「要改 / 不行」判不通过。评估维度:'+RV_DIMS.map(esc).join(' · ')+'。评审团成员没法登录时,发起人可以<b>代录意见</b>(注明渠道)。</div></div>',
   '<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="rvStartOk" data-k="'+kind+'" data-id="'+oid+'">发起评审</button>',true);
}
A.rvStart=el=>rvStartDlg(el.dataset.k||'content',el.dataset.id,el.dataset.m);
A.rvStartOk=el=>{
  const kind=el.dataset.k,oid=el.dataset.id;
  const sel=[...document.querySelectorAll('.rvj:checked')].map(x=>x.value),must=[...document.querySelectorAll('.rvm:checked')].map(x=>x.value);
  const days=+($('#rvDays')||{}).value||rvCfg().days;
  const modeEl=document.querySelector('input[name=rvMode]:checked');const mode=modeEl?modeEl.value:'gate';
  if(sel.length<2)return toast('评审团至少 2 人','err');
  if(must.some(m=>!sel.includes(m)))return toast('必须点的人要先在评审团里','err');
  const pool=rvHqPeople().concat(rvChampions().map(x=>({mid:x.mid,name:x.name,role:'销冠 · '+x.region,ch:'rn'})));
  const jury=sel.map(m=>{const p=pool.find(x=>x.mid===m);return {mid:m,name:p.name,role:p.role,ch:p.ch,must:must.includes(m)}});
  const d=UI.sel.rvDraft||{};
  if(!rvModesFor(kind,oid).includes(mode))return toast('当前状态不支持这种评审方式','err');
  if(rvActive(kind==='kpx'?'kp':kind,oid)||rvActive(kind,oid))return toast('已有进行中的评审','err');
  const rk=kind==='kpx'?'kp':kind;  /* 评审单 kind 只分 content / kp;kpx 是「已入库的知识点」,oid 是知识点 id */
  if(kind==='content'){const c=content(oid);if(!c)return;
    if(mode==='gate')c.st='审核中';
    rvCreate({kind:'content',mode,oid,title:c.title,ver:c.ver,fp:rvFp(c),jury,days,why:d.why});chist(c,mode==='async'?'发起异步评审':'发起评审灰度','评审团 '+jury.map(j=>j.name).join('、')+';期限 '+days+' 天')}
  else if(kind==='kp'){const x=S.kpCand.find(k=>k.id===oid);if(!x)return;
    if(mode==='gate')x.st='评审中';
    rvCreate({kind:'kp',mode,oid,title:x.name,jury,days,why:d.why})}
  else{const k=S.kps.find(z=>z.id===oid);if(!k)return;
    rvCreate({kind:'kp',mode:'async',oid,title:k.name,jury,days,why:d.why,xk:1});k.hist.push({t:today,who:meShort(),act:'发起异步评审',note:'评审团 '+jury.map(j=>j.name).join('、')})}
  closeDlg();toast(mode==='async'?'已发起异步评审,不影响定稿 / 入库,评审团 '+jury.length+' 人':'已发起评审灰度,评审团 '+jury.length+' 人','ok');render()};

/* ---- PC 投票(总部评审团成员)---- */
function rvPcVoteDlg(id){
  const r=rvList().find(x=>x.id===id);if(!r)return;
  const o=r.kind==='content'?content(r.oid):null;
  openDlg('评审 · '+r.title,'<div class="hint" style="margin-bottom:6px">发起:'+esc(r.by)+' · 期限 '+r.due+' · '+esc(r.why)+'</div>'
   +(o?cBodyHtml(o):'<div class="card" style="margin:0">知识点:'+esc(r.title)+'。'+esc(rvKpDesc(r.oid))+'</div>')
   +'<div class="f" style="margin-top:12px"><label>评审意见</label><div class="in"><textarea id="rvNote" placeholder="选「能用」可不填;选「要改」「不行」必须写一句" style="width:100%;max-width:none"></textarea></div></div><div class="hint">评估维度:'+RV_DIMS.map(esc).join(' · ')+'</div>',
   '<button class="btn" data-act="close">取消</button><button class="btn err" data-act="rvPcVote" data-id="'+id+'" data-v="deny">不行</button><button class="btn" data-act="rvPcVote" data-id="'+id+'" data-v="fix">要改</button><button class="btn pri" data-act="rvPcVote" data-id="'+id+'" data-v="pass">能用</button>',true);
}
A.rvPcOpen=el=>rvPcVoteDlg(el.dataset.id);
A.rvPcVote=el=>{
  const r=rvList().find(x=>x.id===el.dataset.id);const me=rvPcMe();if(!r||!me)return toast('只有总部评审团成员能在 PC 投票','err');
  const res=rvVote(r,me,el.dataset.v,($('#rvNote')||{}).value,meShort());
  if(res.err)return toast(res.err,'err');closeDlg();toast(r.st==='评审中'?'已投票':'已投票,评审已'+r.st,'ok');render()};

/* ---- 代录意见:评审团成员没法登录 PC 投票时,发起人 / 总部替他录一条,注明渠道,留痕 ---- */
const RV_CHANNELS=['微信','电话','会议','邮件','当面'];
function rvProxyDlg(id){
  const r=rvList().find(x=>x.id===id);if(!r||r.st!=='评审中')return;
  const left=r.jury.filter(j=>!r.votes[j.mid]);
  if(!left.length)return toast('评审团都已投票','err');
  openDlg('代录评审意见 · '+r.title,'<div class="hint" style="margin-bottom:8px">评审人当面 / 微信 / 电话给了意见,但没在系统里投票:由你代为录入,<b>注明渠道,留痕为「代录」</b>。同一人只能录一次。</div>'
   +'<div class="fgrid"><div class="fld"><label><b>*</b>评审人</label><select id="rvpWho">'+left.map(j=>'<option value="'+j.mid+'">'+esc(j.name)+' · '+esc(j.role)+(j.must?'(必须点)':'')+'</option>').join('')+'</select></div>'
   +'<div class="fld"><label><b>*</b>来源渠道</label><select id="rvpCh">'+RV_CHANNELS.map(x=>'<option>'+x+'</option>').join('')+'</select></div>'
   +'<div class="fld"><label><b>*</b>结论</label><select id="rvpV"><option value="pass">能用</option><option value="fix">要改</option><option value="deny">不行</option></select></div>'
   +'<div class="fld full"><label>意见原话</label><textarea id="rvpNote" placeholder="选「要改」「不行」必须写;尽量保留对方原话" style="width:100%"></textarea></div></div>',
   '<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="rvProxyOk" data-id="'+id+'">录入</button>',true);
}
A.rvProxy=el=>rvProxyDlg(el.dataset.id);
A.rvProxyOk=el=>{
  const r=rvList().find(x=>x.id===el.dataset.id);if(!r)return;if(!rvCanManage(r))return toast('只有发起人或总部能代录','err');
  const mid=($('#rvpWho')||{}).value,ch=($('#rvpCh')||{}).value,v=($('#rvpV')||{}).value,note=(($('#rvpNote')||{}).value||'').trim();
  const j=r.jury.find(x=>x.mid===mid);if(!j)return toast('请选择评审人','err');
  const res=rvVote(r,mid,v,note,meShort()+'(代'+j.name+'录入,渠道:'+ch+')');
  if(res.err)return toast(res.err,'err');
  r.votes[mid].proxy={by:meShort(),ch};closeDlg();toast('已代录 '+j.name+' 的意见','ok');render()};

/* ---- 发起人动作:催办 / 撤回 / 超期决策 ---- */
A.rvRemind=el=>{const r=rvList().find(x=>x.id===el.dataset.id);if(!r||r.st!=='评审中')return;if(!rvCanManage(r))return toast('只有发起人或总部能处理这张评审单','err');
  const un=r.jury.filter(j=>!r.votes[j.mid]&&!r.reminded.includes(j.mid));r.reminded=r.reminded.concat(un.map(j=>j.mid));
  rvLog(r,meShort(),'催办 '+un.length+' 人:'+un.map(j=>j.name).join('、'));notify('已催办评审「'+r.title+'」'+un.length+' 人');toast('已催办 '+un.length+' 人','ok');render()};
A.rvWithdraw=el=>{const r=rvList().find(x=>x.id===el.dataset.id);if(!r||r.st!=='评审中')return;if(!rvCanManage(r))return toast('只有发起人或总部能处理这张评审单','err');
  r.st='已撤回';rvLog(r,meShort(),'撤回评审');
  if(r.mode!=='async'){if(r.kind==='content'){const c=content(r.oid);if(c){c.st='草稿';chist(c,'撤回评审灰度,退回草稿')}}
  else{const x=S.kpCand.find(k=>k.id===r.oid);if(x)x.st='待确认'}}
  else if(r.kind==='content'){const c=content(r.oid);if(c)chist(c,'撤回异步评审')}
  toast('已撤回评审','ok');render()};
A.rvForce_=el=>{const r=rvList().find(x=>x.id===el.dataset.id);if(!r||r.st!=='评审中')return;if(!rvCanManage(r))return toast('只有发起人或总部能处理这张评审单','err');const ok=el.dataset.v==='go';
  rvFinish(r,ok,meShort(),'发起人'+(r.due<today?'在超期后':'提前')+'决策'+(ok?'推进':'终止')+'(评审票未达标准,已留痕)');toast(ok?'已推进(留痕)':'已终止评审','ok');render()};
A.rvExpire=el=>{const r=rvList().find(x=>x.id===el.dataset.id);if(!r||r.st!=='评审中')return;if(!rvCanManage(r))return toast('只有发起人或总部能处理这张评审单','err');r.due=addDays(today,-1);rvLog(r,meShort(),'观察期已满(演示:模拟时间流逝)');rvSweep();toast('已模拟评审期满','ok');render()};

/* ---- 内容详情里的评审卡(放在「内容」页签主区上方)---- */
function rvChip(kind,oid){
  const r=rvOf(kind,oid);if(!r||r.st==='已撤回')return '';
  const t=rvTally(r);
  const label=(r.mode==='async'?'异步评审':'评审')+' ';
  if(r.st==='评审中')return '<span class="tag blue" title="'+esc(r.id)+' · 期限 '+r.due+'">'+label+t.voted+'/'+t.n+' 已投'+(r.due<today?' · 已超期':'')+'</span>';
  if(r.st==='已通过')return '<span class="tag ok" title="'+esc(r.id)+'">已评审通过</span>';
  if(r.st==='未通过')return '<span class="tag err" title="'+esc(r.id)+'">评审未通过</span>';
  return '';
}
function cchipRv(c){
  const chip=rvChip('content',c.id);
  return cchip(c.st)+(chip?'<div style="margin-top:4px">'+chip+'</div>':'');
}
function rvCard(kind,oid,byId){
  const ro=!!byId;const r=byId?rvList().find(x=>x.id===byId):rvOf(kind,oid);if(!r)return '';
  const t=rvTally(r);const me=rvPcMe();const live=r.st==='评审中';
  const mine=!ro&&me&&rvJuryHas(r,me)&&!r.votes[me]&&live;
  const stag={评审中:'<span class="tag blue">评审中</span>',已通过:'<span class="tag ok">已通过</span>',未通过:'<span class="tag err">未通过</span>',已撤回:'<span class="tag">已撤回</span>'}[r.st];
  const canOwn=!ro&&rvCanManage(r);
  const pct=n=>t.n?(n/t.n*100).toFixed(1):0;
  const needPct=pct(t.need);
  const bar='<div class="rvx-bar"><div class="track"><i class="seg-pass" style="width:'+pct(t.pass)+'%"></i><i class="seg-fix" style="width:'+pct(t.fix)+'%"></i><i class="seg-deny" style="width:'+pct(t.deny)+'%"></i><span class="mark" style="left:calc('+needPct+'% - 1px)" title="通过线:'+t.need+' 票「能用」"></span></div>'
    +'<div class="cap"><span>已投 '+t.voted+' / '+t.n+(t.mustWait?' · <b style="color:var(--warn)">必须点还差 '+t.mustWait+' 人</b>':'')+'</span><span>通过线 '+t.need+' 票「能用」</span></div></div>';
  const nums='<div class="rvx-nums"><span class="p"><b>'+t.pass+'</b>能用</span><span class="f"><b>'+t.fix+'</b>要改</span><span class="d"><b>'+t.deny+'</b>不行</span><span><b>'+(t.n-t.voted)+'</b>未投</span></div>';
  const people=r.jury.map(j=>{
    const v=r.votes[j.mid];
    const vtag=v?'<span class="tag '+RV_VOTE[v.v][1]+'" style="margin:0">'+RV_VOTE[v.v][0]+'</span>'+(v.proxy?'<span class="tag" style="margin:0" title="'+esc(v.proxy.by)+'">代录·'+esc(v.proxy.ch)+'</span>':''):'<span class="hint">未投</span>'+(r.reminded.includes(j.mid)?'<span class="tag blue" style="margin:0">已催办</span>':'');
    return '<div class="rvx-p '+(j.must?'must ':'')+(v?'v-'+v.v:'')+'"><div class="top"><span class="nm">'+esc(j.name)+'</span>'+(j.must?'<span class="tag warn" style="margin:0">必须点</span>':'')+'<span class="rvx-st">'+vtag+'</span></div>'
      +'<div class="rl">'+esc(j.role)+' · '+(j.ch==='pc'?'PC':'手机')+'</div>'+(v&&v.note?'<div class="note">“'+esc(v.note)+'”</div>':'')+'</div>';
  }).join('');
  const unvoted=r.jury.filter(j=>!r.votes[j.mid]&&!r.reminded.includes(j.mid)).length;
  const force=canOwn&&live&&(r.due<today||t.verdict!=='wait');
  const more=canOwn&&live?'<details class="more"><summary class="btn">更多 ▾</summary><div class="menu2">'
    +(force?'<button data-act="rvForce" data-id="'+r.id+'" data-v="go">'+(r.mode==='async'?'按通过结案':'仍然推进')+'</button><button class="err" data-act="rvForce" data-id="'+r.id+'" data-v="back">'+(r.mode==='async'?'按不通过结案':'终止')+'</button>':'')
    +'<button data-act="rvWithdraw" data-id="'+r.id+'">撤回评审</button><button data-act="rvExpire" data-id="'+r.id+'">模拟评审期满(演示)</button></div></details>':'';
  const foot=live?'<div class="rvx-ft">'+(mine?'<button class="btn pri" data-act="rvPcOpen" data-id="'+r.id+'">我来评审</button>':'')
    +(canOwn?'<button class="btn" data-act="rvProxy" data-id="'+r.id+'">代录意见</button><button class="btn" data-act="rvRemind" data-id="'+r.id+'" '+(unvoted?'':'disabled')+'>催办未投('+unvoted+')</button>':'')
    +'<span class="sp"></span>'+more+'</div>'
    +'<div class="rvx-tip">'+(r.mode==='async'?'异步评审不影响当前定稿 / 上架 / 入库,结论事后回流。':'')+'销冠在零售通手机端的「评审」入口投票;总部成员在这里或工作台投票。到期未决策:'+esc(rvCfg().onTimeout)+'。</div>':'';
  const res=!live&&r.res?'<div class="rvx-tip" style="padding-top:0">结论:'+esc(r.res)+'</div>':'';
  return '<div class="rvx '+(live?'live':'')+'"><div class="rvx-hd"><div class="ttl">'+(r.mode==='async'?'异步评审':'评审灰度')+' '+stag+(r.mode==='async'?'<span class="tag">不阻塞</span>':'')+'</div>'
   +'<div class="meta">'+esc(r.id)+' · 发起 '+esc(r.by)+' · 期限 '+r.due+(live&&r.due<today?' <b style="color:var(--err)">(已超期)</b>':'')+' · '+esc(r.why)+'</div></div>'
   +'<div class="rvx-sum">'+bar+nums+'</div><div class="rvx-jury">'+people+'</div>'+foot+res
   +'<details class="rvx-log" style="margin-top:8px"><summary>留痕 '+r.log.length+' 条</summary>'+r.log.slice(0,12).map(x=>'<div style="padding:3px 0;border-top:1px solid #f2f3f5;font-size:12px"><span class="hint">'+x.t+'</span> <b>'+esc(x.who)+'</b> '+esc(x.msg)+'</div>').join('')+'</details></div>';
}

/* ---- 工作台待办:总部评审人「待我评审」、发起人「评审超期」、销冠入口提示 ---- */
function rvWbItems(add){
  if(typeof UI==='undefined'||!UI||UI.role.type==='boss')return;
  rvSweep();
  const me=rvPcMe();
  /* 异步评审未通过:内容 / 知识点打了 rvBad 但还没处理,出待办(给内容负责人 / 总部) */
  S.contents.filter(c=>c.rvBad&&c.st!=='已归档'&&(UI.role.type==='hq'||c.cK===UI.role.k)).forEach(c=>{const r=rvList().find(x=>x.id===c.rvBad);
    add('备料',2,'异步评审未通过','<b>'+esc(c.title)+'</b>',(r?'评审结论:'+(r.res||'见评审卡'):'评审未通过')+';已定稿内容不会自动下线,请决定改版或忽略','去处理',' data-act="cView" data-id="'+c.id+'" data-tab="内容"')});
  S.kps.filter(k=>k.rvBad&&(UI.role.type==='hq'||UI.role.type==='region')).forEach(k=>{const r=rvList().find(x=>x.id===k.rvBad);
    add('备料',2,'异步评审未通过','<b>'+esc(k.name)+'</b>',(r?'评审结论:'+(r.res||'见评审意见'):'评审未通过')+';知识点不会自动停用,请负责人决定调整或停用','去处理',' data-act="kpOpen" data-id="'+k.id+'"')});
  rvList().filter(r=>r.st==='评审中').forEach(r=>{
    const lk=r.kind==='content'?'data-act="cView" data-id="'+r.oid+'"':'data-act="wbCand"';
    if(me&&rvJuryHas(r,me)&&!r.votes[me])add('备料',r.due<=today?3:2,'待我评审','<b>'+esc(r.title)+'</b>',r.why+' · 期限 '+r.due,'去评审',' data-act="rvPcOpen" data-id="'+r.id+'"');
    const own=UI.role.type==='hq'||(r.by||'').includes(UI.role.name);
    if(own&&r.due<=today)add('备料',3,'评审超期','<b>'+esc(r.title)+'</b>','评审期限 '+r.due+' 已到,未投 '+(r.jury.length-Object.keys(r.votes).length)+' 人;需要你决策','去决策',lk+(r.kind==='content'?' data-tab="内容"':''))});
}
/* ---- 零售通手机端:销冠评审卡 ---- */
const rvMine=()=>typeof ME==='undefined'||!ME?[]:rvList().filter(r=>r.st==='评审中'&&rvJuryHas(r,ME.mid));
function rvRnTodo(){return rvMine().filter(r=>!r.votes[ME.mid]).map(r=>({w:3,t:'评审 · '+r.title,d:'截止 '+r.due+' · '+r.why,act:'rxGoRv',id:r.id,btn:'去评审'}))}
A.rxGoRv=el=>{R.rvId=el.dataset.id;R.page='rv';renderRN()};
A.rxRvList=()=>{R.rvId=null;R.page='rv';renderRN()};
function rvRnHtml(){
  const r=R.rvId?rvList().find(x=>x.id===R.rvId):null;
  if(!r){const L=rvMine();return rnav('评审',true)+'<div class="rx-wrap">'+(L.length?L.map(x=>'<div class="rx-card" data-act="rxGoRv" data-id="'+x.id+'" style="cursor:pointer"><div class="rx-card-h"><b>'+esc(x.title)+'</b><span class="hint">截止 '+x.due+'</span></div><div class="hint">'+esc(x.why)+' · '+(x.votes[ME.mid]?'你已投「'+RV_VOTE[x.votes[ME.mid].v][0]+'」':'待你评审')+'</div></div>').join(''):'<div class="rx-empty">暂无需要你评审的内容</div>')+'</div>'}
  const o=r.kind==='content'?content(r.oid):null;const my=r.votes[ME.mid];
  return rnav('评审',true)+'<div class="rx-wrap"><div class="rx-card"><div class="rx-card-h"><b>'+esc(r.title)+'</b><span class="hint">截止 '+r.due+'</span></div>'
   +'<div style="background:#fff;border-radius:12px;padding:10px 12px;font-size:13px;line-height:1.75;margin:8px 0">'+(o?rnBody(o.kind,o.body):esc(rvKpDesc(r.oid)||r.title))+'</div>'
   +'<div class="hint" style="margin-bottom:8px">请从这三点看:'+RV_DIMS.map(esc).join(' · ')+'</div>'
   +(r.st!=='评审中'?'<div class="hint">评审已'+r.st+'</div>':my?'<div class="hint">你已投「'+RV_VOTE[my.v][0]+'」'+(my.note?':'+esc(my.note):'')+'</div>'
     :'<textarea id="rvRnNote" placeholder="选「要改」「不行」请写一句原因" style="width:100%;min-height:60px;border:1px solid #e5e6eb;border-radius:8px;padding:8px;box-sizing:border-box"></textarea>'
      +'<div style="display:flex;gap:8px;margin-top:8px"><button class="rb gh" data-act="rxRvVote" data-id="'+r.id+'" data-v="deny">不行</button><button class="rb gh" data-act="rxRvVote" data-id="'+r.id+'" data-v="fix">要改</button><button class="rb" data-act="rxRvVote" data-id="'+r.id+'" data-v="pass">能用</button></div>')
   +'</div></div>';
}
A.rxRvVote=el=>{const r=rvList().find(x=>x.id===el.dataset.id);if(!r)return;
  const res=rvVote(r,ME.mid,el.dataset.v,($('#rvRnNote')||{}).value,ME.name+'(销冠)');
  if(res.err)return toast(res.err,'err');toast('已提交评审','ok');renderRN()};

/* ---- 配置中心 · 评审灰度:触发规则 / 默认评审团 / 期限 / 超时规则 ---- */
function cfgReview(){
  const c=rvCfg();const R_=c.rules;
  const pool=rvChampions();
  const hitN=S.contents.filter(x=>rvTriggers(x).length).length;
  const act=rvList().filter(r=>r.st==='评审中').length;
  const rule=(k,t,d)=>'<label class="rvx-rule"><input type="checkbox" data-wc="rvCfgRule" data-k="'+k+'" '+(R_[k]?'checked':'')+(c.on?'':' disabled')+'><span><b>'+t+'</b><span class="hint">'+d+'</span></span></label>';
  const mode=(v,t,d)=>'<label class="rvx-opt"><input type="radio" name="bizRvMode" data-wc="bizRvMode" value="'+v+'" '+(c.ruleMode===v?'checked':'')+'><span><b>'+t+'</b><span class="hint">'+d+'</span></span></label>';
  return srcBar('评审发生在内容<b>定稿 / 入库之前或之后</b>:评审团(总部同事 + 销冠)评估「能不能用」。和学习项目里「定稿后给学员分批下发」的学员灰度是两件事。评审始终可以手动发起,下面只决定「哪些内容会被提示 / 要求评审」。')
   +'<div class="rvx-stat"><div><b>'+hitN+'</b><span>条内容命中规则</span></div><div><b>'+act+'</b><span>个评审进行中</span></div><div><b>'+rvList().filter(r=>r.st==='未通过').length+'</b><span>个评审未通过</span></div></div>'
   +'<div class="card"><h3>1 · 命中规则后怎么处理</h3>'
   +mode('suggest','只建议(默认)','审核时提示「建议评审」,审核人仍可直接定稿,也可以定稿并同时发起异步评审,不阻塞')
   +mode('gate','强制先评审','命中规则的内容必须先评审通过才能定稿;评审期间不能直接通过')
   +'</div>'
   +'<div class="card"><h3>2 · 哪些内容算「命中」 <label class="rvx-sw"><input type="checkbox" data-wc="rvCfgOn" '+(c.on?'checked':'')+'> 启用规则</label></h3>'
   +'<div class="hint" style="margin-bottom:8px">关闭后不再提示 / 拦截任何内容,但仍可手动发起评审。</div>'
   +rule('policy','政策口径类','标题 / 主题 / 关键词含政策、补贴、口径、国补、以旧换新、税、金融,或培训类型为政策类')
   +rule('compete','竞品对比话术','话术里涉及对比 / 竞品,说错容易引发投诉')
   +rule('champion','销冠语料蒸馏来源','AI 从销冠会话里提炼的话术,先让销冠本人确认「像不像我们会说的」')
   +rule('firstUse','首次使用的新话术','还没被任何项目引用的新话术(范围较大,默认关闭)')
   +'</div>'
   +'<div class="card"><h3>3 · 默认评审团与期限</h3>'
   +'<div class="hint" style="margin-bottom:6px">总部成员在 PC 投票(刘翔默认「必须点」),销冠在零售通手机端投票;发起评审时可临时调整。</div>'
   +'<div style="margin-bottom:8px"><b>总部</b>:'+rvHqPeople().map((x,i)=>esc(x.name)+'('+esc(x.role)+(i===0?',默认必须点':'')+')').join('、')+'</div>'
   +'<div style="margin-bottom:12px"><b>销冠</b>(当期滚动评定,共 '+pool.length+' 人,勾选默认入团;评定口径:'+esc(typeof V23_CHAMP_RULE==='string'?V23_CHAMP_RULE:'')+'):<div class="rvx-pick" style="margin-top:6px">'+pool.map(x=>'<label><input type="checkbox" data-wc="rvCfgJury" data-m="'+x.mid+'" '+(c.defaultJury===null||c.defaultJury.includes(x.mid)?'checked':'')+'><span>'+esc(x.name)+' <small>'+esc(x.region)+' · '+esc(x.store)+'</small></span></label>').join('')+'</div></div>'
   +'<div class="fgrid"><div class="fld"><label>默认评审期限(天)</label><input type="number" min="1" id="rvCfgDays" value="'+c.days+'" style="width:110px"><div class="fh">发起评审时可单独改</div></div>'
   +'<div class="fld"><label>到期未决策</label><select data-wc="rvCfgTimeout">'+['提醒发起人','已投票过半且无反对则推进'].map(o=>'<option '+(c.onTimeout===o?'selected':'')+'>'+o+'</option>').join('')+'</select><div class="fh">必须点没通过时永远不会自动推进,只提醒</div></div></div>'
   +'<div style="margin-top:10px"><button class="btn pri" data-act="rvCfgSave">保存期限</button></div></div>'
   +'<div class="card"><h3>通过标准(固定)</h3><div class="hint" style="line-height:1.9">必须点全部「能用」,且「能用」票过半 → 通过。必须点投了「要改 / 不行」→ 直接不通过。其余人「要改 / 不行」必须写一句原因。全程留痕。<br>先评审后定稿:通过才定稿 / 入库,未通过退回草稿(候选标记已忽略)。异步评审:不影响定稿 / 上架 / 入库,通过打「已评审」,未通过出待办提醒改版,不会自动下线。</div></div>';
}
A.rvCfgOn=el=>{rvCfg().on=el.checked;toast(el.checked?'已启用评审规则':'已关闭自动拦截(仍可手动发起)','ok');render()};
A.rvCfgRule=el=>{rvCfg().rules[el.dataset.k]=el.checked;render()};
A.rvCfgTimeout=el=>{rvCfg().onTimeout=el.value;toast('已保存','ok')};
A.rvCfgJury=el=>{const c=rvCfg();const m=el.dataset.m;if(c.defaultJury===null)c.defaultJury=rvChampions().map(x=>x.mid);c.defaultJury=c.defaultJury.filter(x=>x!==m);if(el.checked)c.defaultJury.push(m);render()};
A.rvCfgSave=()=>{const d=+($('#rvCfgDays')||{}).value;if(!(d>0))return toast('期限请填正整数','err');rvCfg().days=Math.round(d);toast('已保存','ok');render()};

A.rvForce=el=>{const r=rvList().find(x=>x.id===el.dataset.id);if(!r||r.st!=='评审中')return;if(!rvCanManage(r))return toast('只有发起人或总部能处理这张评审单','err');
  if(el.dataset.v==='go'&&Object.keys(r.votes).length===0)return toast('还没有任何人投票,不能直接推进;可以撤回或终止','err');
  const must=r.jury.filter(j=>j.must&&!r.votes[j.mid]);if(el.dataset.v==='go'&&must.length&&r.due>=today)return toast('必须点还没投票('+must.map(j=>j.name).join('、')+'),评审期内不能强推','err');
  return A.rvForce_(el)};

/* ---- 批量发起异步评审:导入直接定稿、批量确认候选后,一次性给每条建一张异步评审单(共用默认评审团) ---- */
function rvBatchAsync(kind,oids,why){
  const J=rvJuryDefault();let n=0;
  oids.forEach(oid=>{const o=rvObj(kind,oid);if(!o)return;if(rvActive(kind==='kpx'?'kp':kind,oid))return;
    const jury=J.map(j=>Object.assign({},j));
    if(kind==='content'){rvCreate({kind:'content',mode:'async',oid,title:o.title,ver:o.ver,fp:rvFp(o),jury,why});chist(o,'发起异步评审',why)}
    else{rvCreate({kind:'kp',mode:'async',oid,title:o.name,jury,why,xk:1});o.hist&&o.hist.push({t:today,who:meShort(),act:'发起异步评审',note:why})}
    n++});
  return n;
}

/* ========== 业务规则策略:区域老师结项 / 对照批干预 ==========
   这两件事业务还没拍板,所以做成「配置中心 → 业务规则」可选项,默认取最保守的一档;
   改配置不需要改代码。所有拦截点都读这里的统一函数,不要在别处另写判断。
   S.cfg.biz = {close:{who,rework,reworkReview}, ctrl:{mode}} */
const bizCfg=()=>{const c=S.cfg;if(!c.biz)c.biz={close:{who:'hq',rework:'self',reworkReview:false},ctrl:{mode:'block'}};
  const b=c.biz;if(!b.close)b.close={who:'hq',rework:'self',reworkReview:false};if(!b.ctrl)b.ctrl={mode:'block'};return b};
/* 谁能结项:hq=仅总部;region=区域老师可结本区域项目(项目覆盖区域只有本区时);both=总部与区域老师(本区域可见项目) */
const BIZ_CLOSE_WHO=[['hq','仅总部可结项(默认)'],['region','总部 + 区域老师可结项,但区域老师只能结「只覆盖本区域」的项目'],['both','总部 + 区域老师都可结项(区域老师可结自己可见的全部项目)']];
/* 结项选「回炉」时:self=按所选执行;hq=区域老师选回炉要总部确认(转评审单);review=回炉前必须发起评审 */
const BIZ_REWORK=[['self','结项人自己决定,选了立即执行(默认)'],['hq','区域老师选「回炉」需总部确认(先记为待确认,总部点确认才下线内容)']];
/* 对照批干预:block=不允许(默认);warn=允许,但需写原因并在该项目效果页标「对照已被干预」;free=允许且仅留痕 */
const BIZ_CTRL=[['block','不允许干预对照批(默认,保护效果对照)'],['warn','允许干预,但必须写原因,并在对应项目的效果页标记「对照已被干预,结论仅供参考」'],['free','允许干预,仅留痕(不推荐)']];
function bizCanClose(p){
  if(!UI||!UI.role||UI.role.type==='boss')return false;
  if(UI.role.type==='hq')return true;
  if(UI.role.type!=='region')return false;
  const w=bizCfg().close.who;
  if(w==='hq')return false;
  if(w==='both')return canSee(p);
  /* region:只能结只覆盖本区域的项目 */
  return canSee(p)&&p.aud.regions.length===1&&p.aud.regions[0]===UI.role.region;
}
const bizCloseWhyNot=p=>{const w=bizCfg().close.who;if(UI.role.type==='boss')return '老板视角只读';if(UI.role.type==='hq')return '';
  if(w==='hq')return '当前配置:仅总部可结项(配置中心 → 业务规则 可调整)';
  if(w==='region'&&!(p.aud.regions.length===1&&p.aud.regions[0]===UI.role.region))return '当前配置:区域老师只能结「只覆盖本区域」的项目;本项目覆盖 '+p.aud.regions.length+' 个区域,请联系总部';
  return ''};
const bizCtrlMode=()=>bizCfg().ctrl.mode;
/* 对照批人员能不能被干预;warn 模式返回需要原因 */
function bizCtrlGate(person){
  if(!person||person.group!=='对照批')return {ok:true};
  const m=bizCtrlMode();
  if(m==='block')return {ok:false,msg:'对照批人员不建议单独干预(配置中心 → 业务规则 可改为「允许但标记」)'};
  return {ok:true,needWhy:m==='warn',mark:true};
}
/* 记录一次对照批被干预:挂到该人参与的、有对照的项目上,效果页据此打标 */
function bizCtrlMark(person,what,why){
  S.ctrlHit=S.ctrlHit||[];
  S.ctrlHit.push({mid:person.mid,name:person.name,what,why:why||'',by:meShort(),t:today});
  const raw=PEOPLE.find(x=>x.mid===person.mid)||{mid:person.mid,name:person.name,store:person.store,region:person.region,hire:person.hire};
  S.projects.filter(p=>p.eff&&eligibleRaw(p,raw)).forEach(p=>{p.ctrlHit=(p.ctrlHit||0)+1;logp(p,'对照批人员「'+person.name+'」被干预('+what+')'+(why?',原因:'+why:''),meShort())});
}

/* ---- 配置中心 · 业务规则 ---- */
function cfgBiz(){
  const b=bizCfg();const opt=(arr,cur,wc)=>arr.map(o=>'<label style="display:block;margin-bottom:6px"><input type="radio" name="'+wc+'" data-wc="'+wc+'" value="'+o[0]+'" '+(cur===o[0]?'checked':'')+'> '+esc(o[1])+'</label>').join('');
  const nPend=S.projects.filter(p=>p.reworkPending).length,nHit=(S.ctrlHit||[]).length;
  const rcfg=rvCfg();
  return srcBar('这几项业务还没拍板,所以做成可选配置:<b>默认取最保守的一档</b>,改了立刻在对应页面生效,不需要改代码。每次生效的动作都会在项目操作记录里留痕。')
   +'<div class="card"><h3>谁能结项 <span class="hint">作用于「学习项目 → 效果」页的结项按钮</span></h3>'+opt(BIZ_CLOSE_WHO,b.close.who,'bizClose')+'</div>'
   +'<div class="card"><h3>区域老师选「回炉」时 <span class="hint">回炉会让项目用到的话术下线,影响面大</span></h3>'+opt(BIZ_REWORK,b.close.rework,'bizRework')+'<div class="hint">当前有 '+nPend+' 个项目在等总部确认回炉。</div></div>'
   +'<div class="card"><h3>对照批人员能不能干预 <span class="hint">干预 = 指派补练包 / 加入项目 / 发起辅导</span></h3>'+opt(BIZ_CTRL,b.ctrl.mode,'bizCtrl')+'<div class="hint">已记录 '+nHit+' 次对照批被干预。被干预的项目,效果页会提示「对照已被干预,结论仅供参考」。</div></div>'
   +'<div class="card"><h3>评审灰度 <span class="hint">规则命中后的处理方式已合并到「配置中心 → 内容与知识点 → 评审灰度」</span></h3><a class="link" data-act="go" data-p="config" data-t="评审灰度">去评审灰度页签 ›</a><div style="display:none"><input type="radio" name="bizRvMode" data-wc="bizRvMode" value="suggest" '+(rcfg.ruleMode==='suggest'?'checked':'')+'><input type="radio" name="bizRvMode" data-wc="bizRvMode" value="gate" '+(rcfg.ruleMode==='gate'?'checked':'')+'></div></div>';
}
A.bizClose=el=>{bizCfg().close.who=el.value;toast('已保存:结项权限','ok');render()};
A.bizRework=el=>{bizCfg().close.rework=el.value;toast('已保存','ok');render()};
A.bizCtrl=el=>{bizCfg().ctrl.mode=el.value;toast('已保存:对照批干预规则','ok');render()};
A.bizRvMode=el=>{rvCfg().ruleMode=el.value;toast('已保存:评审规则命中后的处理方式','ok');render()};

/* 处理异步评审未通过的标记:改版(内容)/ 忽略 */
A.rvAck=el=>{const k=el.dataset.k,id=el.dataset.id;const o=k==='content'?content(id):S.kps.find(x=>x.id===id);if(!o)return;
  const r=rvList().find(x=>x.id===o.rvBad);o.rvBad=null;if(r)rvLog(r,meShort(),'已确认处理(标记清除)');
  if(k==='content')chist(o,'确认异步评审未通过的结论','标记已清除');else o.hist.push({t:today,who:meShort(),act:'确认异步评审未通过的结论',note:'标记已清除'});
  toast('已清除待办标记','ok');render()};

/* 详情页评审区:内容 / 已入库知识点 / 候选共用同一个入口。
   评审单 kind 只分 content / kp(候选与已入库知识点的 oid 不会重复);UI 层 kind 额外有 kpx = 已入库知识点。 */
const rvRk=kind=>kind==='kpx'?'kp':kind;
function rvCanStart(kind,oid){
  const o=rvObj(kind,oid);if(!o||rvActive(rvRk(kind),oid))return false;
  if(kind==='content')return typeof canEditC==='function'&&canEditC(o)&&o.st==='已定稿';
  return UI.role.type==='hq'||UI.role.type==='region';
}
function rvStartBtn(kind,oid,cls){
  if(!rvCanStart(kind,oid))return '';
  const o=rvObj(kind,oid);const hint=kind==='content'&&rvSuggest(o);
  const act=kind==='content'?'rvStartA':'rvStart';
  return '<button class="btn '+(cls||'')+'" data-act="'+act+'" data-k="'+kind+'" data-m="async" data-id="'+oid+'">'+(hint?'发起异步评审(建议)':'发起异步评审')+'</button>';
}
function rvPanel(kind,oid){
  const o=rvObj(kind,oid);if(!o)return '';
  const rk=rvRk(kind);const r=rvOf(rk,oid);
  const can=rk==='content'?!!(r&&rvCanManage(r)):(UI.role.type==='hq'||UI.role.type==='region');
  const warnTxt=rk==='content'?'异步评审未通过:已定稿内容不会自动下线。请决定是否改版;处理完点 ':'异步评审未通过:知识点不会自动停用。请决定调整或停用;处理完点 ';
  const ack=o.rvBad&&can&&r&&r.id===o.rvBad?'<div class="tag warn" style="display:block;margin-bottom:8px;white-space:normal;line-height:1.8;padding:6px 12px">'+warnTxt+'<button class="btn sm" data-act="rvAck" data-k="'+rk+'" data-id="'+oid+'">确认已处理</button></div>':'';
  return ack+(r?rvCard(rk,oid):'')+rvHistory(kind,oid);
}
/* 详情页「评审记录」:这个对象上的全部评审单(最新一单在上)。
   评审卡只显示最新一单,所以撤回 / 已结束的旧单以前会被整个藏掉,这里补全。 */
const RV_ST_CLS={评审中:'blue',已通过:'ok',未通过:'err',已撤回:''};
function rvHistory(kind,oid){
  const rk=rvRk(kind);const all=rvList().filter(r=>r.kind===rk&&r.oid===oid).sort((a,b)=>rvSeq(b)-rvSeq(a));
  if(all.length<2)return '';
  const rows=all.map(r=>{
    const t=rvTally(r);
    const un=r.jury.filter(j=>!r.votes[j.mid]).length;
    const stat=r.st==='评审中'?'已投 '+t.voted+'/'+t.n+(un?' · '+un+' 人未投':''):(r.st==='已通过'?'结论:通过':r.st==='未通过'?'结论:未通过':'');
    return '<div class="rvx-hist-row"><span class="tag '+(RV_ST_CLS[r.st]||'')+'" style="margin:0">'+esc(r.st)+'</span>'
      +'<span class="rvx-hist-id">'+esc(r.id)+'</span><span class="hint">'+(r.mode==='async'?'异步':'先评审')+' · 发起 '+esc(r.by)+' · '+r.at+' · 期限 '+r.due+'</span>'
      +'<span class="rvx-hist-num">'+stat+'</span>'
      +'<button class="btn sm" data-act="rvPick" data-id="'+r.id+'" data-k="'+kind+'" data-oid="'+oid+'">查看</button></div>';
  }).join('');
  return '<div class="card rvx-hist"><h3>评审记录 <span class="hint">共 '+all.length+' 单;上面卡片显示最新一单</span></h3>'+rows+'</div>';
}
A.rvPick=el=>{
  const r=rvList().find(x=>x.id===el.dataset.id);if(!r)return;
  openDlg('评审单 '+r.id+' · '+r.title,'<div class="hint" style="margin-bottom:8px">这是历史评审单的只读快照;操作按钮仍以详情页最新一单为准。</div>'
   +rvCard(rvRk(el.dataset.k),r.oid,r.id),'<button class="btn" data-act="close">关闭</button>',true);
};
function rvKpBox(k){
  const start=rvStartBtn('kpx',k.id,'sm');
  return (start?'<div style="margin-bottom:10px">'+start+' <span class="hint">不影响这个知识点的启用 / 使用;评审团事后评估,未通过会出待办</span></div>':'')+rvPanel('kpx',k.id);
}
