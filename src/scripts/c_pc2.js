/* ========== 学习任务(沿用现有「学习项目配置」列表) ========== */
const FLOW=['未生效','已生效','观察期','评估中','已结项'];
function pgProjects(){
  const tabs=['学习项目配置','培训日历'];const t=curTab('projects',tabs);let b='';const n=pendingFor().length;
  if(t==='学习项目配置'){
    const fn=UI.sel.pn||'',fst=UI.sel.pst||'';
    const rows=visibleP().filter(p=>(!fn||p.name.includes(fn))&&(!fst||p.status===fst));
    b=srcBar('沿用现有「学习任务 → 学习项目配置」。本次新增列:培训类型、培训目标、达成进度;「任务状态」在现有「未生效 / 已生效 / 已下线」基础上增加「观察期 / 评估中 / 已结项」。线下培训不是新对象,是项目里的一种任务节点(「报名任务 → 线下班次培训」)。'+(UI.role.type==='region'?'<br>当前身份是区域老师:只显示覆盖本区或自己审批的项目。':''))
    +'<div class="fil"><span>项目名称</span><input data-wc="pnf" value="'+esc(fn)+'" placeholder="项目名称"><span>任务状态</span><select data-wc="pstf"><option value="">全部</option>'+FLOW.concat(['已下线']).map(s=>'<option '+(fst===s?'selected':'')+'>'+s+'</option>').join('')+'</select></div>'
    +(rows.length?'<div class="tw"><table class="t stk"><tr><th>ID</th><th>项目名称</th><th>培训类型 <span class="tag pri">新增</span></th><th>报名类型 <span class="tag pri">新增</span></th><th>培训目标 <span class="tag pri">新增</span></th><th>达成进度 <span class="tag pri">新增</span></th><th>任务下发周期</th><th>当前任务数</th><th>任务状态</th><th>创建人 / 时间</th><th>操作</th></tr>'
     +rows.map(p=>'<tr><td>'+p.id+'</td><td><a class="link" data-act="go" data-p="detail" data-id="'+p.id+'">'+esc(p.name)+'</a></td><td>'+typeTxt(p)+'</td><td>'+(p.off?'<span class="tag '+(p.signup==='报名制'?'blue':'pri')+'">'+p.signup+'</span>'+(p.signup==='报名制'?'<div class="hint">名额 '+p.quota+'</div>':'<div class="hint">'+(p.roster==='导入名单(MID)'?'导入名单':'按覆盖角色')+'</div>'):'<span class="hint">线上,无需报名</span>')+'</td><td>'+goalTxt(p)+'</td><td>'+progBar(p)+'</td><td>'+p.start+' ~ '+p.end+'</td><td>'+p.nodes.length+'</td><td>'+chip(p.status)+(p.gray&&p.gray.stage==='灰度中'?' <span class="tag blue">灰度中</span>':'')+(appsOf(p.id).some(a=>a.status==='待审批')?' <span class="tag warn">待审批 '+appsOf(p.id).filter(a=>a.status==='待审批').length+'</span>':'')+'</td><td>'+p.owner+'<div class="hint">'+p.created+'</div></td><td><button class="link" data-act="go" data-p="detail" data-id="'+p.id+'">查看详情</button>'+(p.status!=='已下线'&&p.status!=='已结项'?'<button class="link err" data-act="offline" data-id="'+p.id+'">下线任务</button>':'')+'<button class="link" data-act="copyProj" data-id="'+p.id+'">复制该项目</button>'+(p.status!=='未生效'?'<button class="link" data-act="go" data-p="detail" data-id="'+p.id+'" data-pt="下发明细">查看下发明细</button>':'')+'</td></tr>').join('')+'</table></div>'
     :cta('还没有学习项目','点「新增学习项目」。培训项目就是带「培训目标」的学习项目;也可以到「内容管理」把入库的内容一键做成学习任务。','<button class="btn pri" data-act="formNew">新增学习项目</button>'));
  }else{
    const stores=[...new Set(PEOPLE.map(x=>x.store))].slice(0,12);
    b=srcBar('每店每周在途任务 = 现有学习任务下发(学习任务系统)+ 本系统新建项目的叠加。同批人在途上限取「配置中心」,当前 <b>'+S.cfg.limit+'</b>,超限标红;新增学习项目的「覆盖角色」会按这里检查。')
     +'<div class="tw"><table class="t cal"><tr><th style="text-align:left">门店</th><th>区域</th>'+WEEKS.map(w=>'<th>'+weekLabel(w)+'</th>').join('')+'</tr>'
     +stores.map(s=>'<tr><td style="text-align:left">'+s+'</td><td>'+pp2(s)+'</td>'+WEEKS.map(w=>{const v=loadAt(s,w);const bl=baseLoad(s,w);return '<td class="'+(v>S.cfg.limit?'hot':v===S.cfg.limit?'warm':'')+'">'+v+(v>bl?' <span class="hint">(+'+(v-bl)+')</span>':'')+(v>S.cfg.limit?' 超限':'')+'</td>'}).join('')+'</tr>').join('')+'</table></div><div class="hint" style="margin-top:6px">(+n)= 本系统新建项目带来的任务数。</div>';
  }
  return '<div class="ph"><h2>学习项目配置</h2><div><button class="btn" data-act="go" data-p="approvals" style="margin-right:8px">待我审批'+(n?' <span class="dot" style="display:inline-block">'+n+'</span>':'')+'</button><button class="btn pri" data-act="formNew">新增学习项目</button></div></div>'+tabsH('projects',tabs)+b;
}
A.pnf=el=>{UI.sel.pn=el.value;render()};A.pstf=el=>{UI.sel.pst=el.value;render()};
A.offline=el=>{const p=proj(el.dataset.id);p.status='已下线';toast('已下线任务,学员不再看到','ok');render()};
A.copyProj=el=>{formInit(null,proj(el.dataset.id))};

/* ========== 新增学习项目(沿用现有表单:基础信息 / 引导语 / 学习模块,新增「培训目标」) ========== */
