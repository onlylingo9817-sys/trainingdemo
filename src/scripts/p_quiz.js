/* ========== 题库 v20 ==========
   题 = 挂在知识点上的一种资产,有自己的状态(草稿 / 已定稿 / 已停用)和来源话术。
   诊断和练习用「已定稿」的题真实判分,掌握度由作答算出(不再是模拟分数)。
   题目只用来源话术原文里明确出现的事实出题;干扰项是编的,体验时请核对。 */
const Q_TYPES=['单选','多选','判断'];
const Q_ST=['草稿','已定稿','已停用'];
const qById=id=>S.qs.find(q=>q.id===id);
const qsOf=(kid,st)=>S.qs.filter(q=>q.kp===kid&&(!st||q.st===st));
const qUsable=q=>q.st==='已定稿';
const qAns=q=>(Array.isArray(q.ans)?q.ans:[q.ans]).slice().sort().join('');
const qLetters='ABCDEF';
/* 题:[id, 知识点, 类型, 题干, 选项, 答案(索引数组或 true/false), 解析, 难度, 来源话术] */
const Q_SEED=[
 ['Q1','K1','单选','N70 的后备箱常规容积是多少?',['1203L','800L','2425L','1500L'],[0],'话术原文:后备箱 1203L 同级最大。2425L 是二排放倒后的最大容积。',1,'N101'],
 ['Q2','K1','单选','N70 二排放倒后,储物空间最大可拓展到多少?',['1203L','1800L','2425L','3000L'],[2],'话术原文:二排一放倒直接拓展到 2425L,24 个 20 寸行李箱塞得下。',2,'N101'],
 ['Q3','K1','判断','客户问"后备箱装不装得下婴儿车",只能说"装得下",不需要结合他的具体场景。',null,false,'好的讲法要结合客户场景(推车、行李、露营装备),而不是只报一个"装得下"。',1,'N101'],
 ['Q4','K7','单选','N70 车身使用了多少处 2200 兆帕级超强钢?',['八处','十四处','二十处','三处'],[1],'话术原文:N70 十四处 2200 兆帕级超强钢。',1,'N105'],
 ['Q5','K7','单选','话术里说同级 L6 用的超强钢是多少兆帕级?',['1000','1500','2200','1800'],[1],'话术原文:同级 L6 才用 1500 兆帕。',2,'N105'],
 ['Q6','K3','多选','N90 Max 方便老人和孩子上下车,主要靠哪两项设计?',['开门角度大','电动侧踏三节台阶','车身更矮','自动升降底盘'],[0,1],'话术原文:开门角度大 + 电动侧踏三节台阶。',2,'N106'],
 ['Q7','K2','单选','二排零重力座椅能做到什么?',['一键躺平、腿托抬起','座椅自动加热到 50 度','座椅可 360 度旋转','自动按摩 3 档'],[0],'话术原文:一键躺平、腿托抬起,腰背腿都有支撑。',1,'N107'],
 ['Q8','K4','单选','N90 Max 外放电的功率是多少?',['3.3kW','6.6kW','11kW','2.2kW'],[1],'话术原文:6.6kW 外放电。',1,'N118'],
 ['Q9','K4','多选','话术里,6.6kW 外放电露营时一次可以同时带动哪些设备?',['电磁炉','电水壶','电烤箱','电动空调压缩机'],[0,1,2],'话术原文:一次带动一台电磁炉 + 一个电水壶 + 一个电烤箱。',2,'N118'],
 ['Q10','K4','判断','6.6kW 外放电露营时,需要另外带明火或笨重的移动电源。',null,false,'话术原文:不用明火、不用带笨重的移动电源。',1,'N119'],
 ['Q11','K5','单选','N90 Max 的纯电续航是多少公里?',['464','600','1705','800'],[0],'话术原文:纯电 464 公里。1705 公里是综合续航。',1,'N122'],
 ['Q12','K5','单选','话术里说的"综合续航"是多少公里?',['464','1705','1200','2000'],[1],'话术原文:综合续航 1705 公里,北京到上海中间不用补能。',2,'N122'],
 ['Q13','K6','单选','N90 Max 全系标配的驾驶辅助叫什么,主动安全辅助有多少项?',['XLA / 26 项','XLB / 16 项','XLA / 12 项','NOA / 26 项'],[0],'话术原文:满血小米驾驶辅助 XLA、26 项主动安全辅助。',2,'N121'],
 ['Q14','K15','单选','话术里说,保养是多少年多少公里?',['3 年 3 万公里','2 年 2 万公里','5 年 10 万公里','1 年 1 万公里'],[0],'话术原文:保养 3 年 3 万公里。',1,'N137'],
 ['Q15','K16','单选','哨兵模式一天大约耗多少电?',['不到一度电','三度电','五度电','十度电'],[0],'话术原文:24 小时监控、360 度无死角,一天不到一度电。',2,'N138'],
 ['Q16','K16','单选','低速照明在车速多少以下自动开启?',['10 迈','30 迈','60 迈','5 迈'],[0],'话术原文:10 迈以下自动开启低速照明,同级没有。',1,'N139'],
 ['Q17','K12','判断','车载压缩机冰箱只能制冷,不能制热。',null,false,'话术原文:压缩机冰箱,制冷制热都行。',1,'N126'],
 ['Q18','K9','单选','话术里,N90 Max 为二胎家庭做的安全座椅安装,二排和三排分别怎么样?',['二排、三排都能放儿童座椅','只有二排能放','只有三排能放','都不能放'],[0],'话术原文:二排、三排都能放儿童座椅。',2,'N117'],
 ['Q19','K10','单选','话术里描述的情侣私人影院,大屏是多大?',['21.4 寸','15.6 寸','32 寸','12.3 寸'],[0],'话术原文:21.4 寸大屏 + 全景音。',2,'N120']
];
function qSeed(){
  S.qs=Q_SEED.map((a,i)=>({id:a[0],kp:a[1],type:a[2],stem:a[3],opts:a[4]||['正确','错误'],ans:a[2]==='判断'?(a[5]?[0]:[1]):a[5],why:a[6],lv:a[7],src:a[8],st:'已定稿',owner:(kp(a[1])||{}).owner||'李娜',created:addDays(today,-9),stat:{n:0,ok:0}}));
  /* 两道草稿 + 一道已停用,演示状态 */
  S.qs.push({id:'Q20',kp:'K8',type:'单选',stem:'移动办公室场景里,二排提供了什么便利?',opts:['小桌板、电源、静谧座舱','独立卫生间','办公椅可升降','车内打印机'],ans:[0],why:'话术原文:小桌板、电源、静谧座舱都有。',lv:1,src:'N125',st:'草稿',owner:'李娜',created:addDays(today,-2),stat:{n:0,ok:0}});
  S.qs.push({id:'Q21',kp:'K13',type:'判断',stem:'话术里提到的宠物出行场景,猫可以在车内自由活动。',opts:['正确','错误'],ans:[0],why:'话术原文:猫可以自由活动,随时撸猫。',lv:1,src:'N134',st:'草稿',owner:'王磊',created:addDays(today,-1),stat:{n:0,ok:0}});
  S.qs.push({id:'Q22',kp:'K5',type:'单选',stem:'(旧口径)N90 Max 纯电续航是 400 公里。',opts:['正确','错误'],ans:[1],why:'已不符合最新话术,停用。',lv:1,src:'N122',st:'已停用',owner:'陈刚',created:addDays(today,-30),stat:{n:6,ok:2}});
  /* 登记到知识点的"本系统练习题"改由真实题库统计,不再手填题数 */
  S.kps.forEach(k=>{k.ext=(k.ext||[]).filter(e=>e.t!=='练习题')});
}
/* 题数 = 已定稿的真实题 + 其他系统登记(演练 / 清河);不再重复计"本系统练习题" */
const kpQn=k=>qsOf(k.id,'已定稿').length+(k.ext||[]).filter(e=>KP_Q_T.includes(e.t)&&e.t!=='练习题').reduce((a,e)=>a+(+e.n||0),0);
const kpOwnQn=k=>qsOf(k.id,'已定稿').length+(k.ext||[]).filter(e=>KP_Q_T.includes(e.t)&&e.t!=='练习题'&&e.src!=='清河大学').reduce((a,e)=>a+(+e.n||0),0);
/* ================= 后台:题库(知识点 → 题库 页签)+ 单题编辑 ================= */
const qFx=()=>UI.sel.qf||(UI.sel.qf={});
const qTxt=q=>q.type==='判断'?(q.ans[0]===0?'正确':'错误'):q.ans.map(i=>qLetters[i]).join('、');
const qAcc=q=>q.stat&&q.stat.n?Math.round(q.stat.ok/q.stat.n*100):null;
function kpQuiz(){
  const f=qFx();const rows=S.qs.filter(q=>(!f.kp||q.kp===f.kp)&&(!f.st||q.st===f.st)&&(!f.type||q.type===f.type)&&(!f.q||q.stem.includes(f.q)));
  const so=(k,l,o)=>'<div class="fi2"><label>'+l+'</label><select data-wc="qset" data-k="'+k+'"><option value="">全部</option>'+o.map(x=>'<option '+(f[k]===x?'selected':'')+'>'+x+'</option>').join('')+'</select></div>';
  const kpOpts='<div class="fi2"><label>知识点</label><select data-wc="qset" data-k="kp"><option value="">全部</option>'+S.kps.map(k=>'<option value="'+k.id+'" '+(f.kp===k.id?'selected':'')+'>'+esc(kpLabel(k))+'</option>').join('')+'</select></div>';
  const n=st=>S.qs.filter(q=>q.st===st).length;const noQ=S.kps.filter(k=>k.st==='启用'&&!qsOf(k.id,'已定稿').length).length;
  const low=S.qs.filter(q=>qAcc(q)!=null&&q.stat.n>=3&&qAcc(q)<40&&q.st==='已定稿').length;
  return srcBar('题库里的题<b>挂在知识点上</b>,走「草稿 → 已定稿」,零售通的诊断和练习只用<b>已定稿</b>的题,作答<b>真实判分</b>、掌握度由作答算出。题目只根据来源话术原文出题(原文里没有的数字不出),每题带解析和来源话术,方便核对。题型:单选、多选、判断(客观题,判分确定,不依赖 AI)。简答 / 情景题走情景演练,不在这里。')
   +'<div class="grid g4" style="margin-bottom:16px"><div class="stat"><div class="l">已定稿</div><div class="n">'+n('已定稿')+'</div><div class="hint">可用于诊断和练习</div></div><div class="stat"><div class="l">草稿</div><div class="n">'+n('草稿')+'</div><div class="hint">待审核定稿</div></div><div class="stat kp-click" data-act="qJumpNoQ" style="cursor:pointer"><div class="l">没有题的知识点</div><div class="n" style="color:'+(noQ?'#c8323a':'')+'">'+noQ+'</div><div class="hint">启用中、没有已定稿题</div></div><div class="stat"><div class="l">正确率偏低的题</div><div class="n" style="color:'+(low?'#a15c00':'')+'">'+low+'</div><div class="hint">≥3 人作答且低于 40%,可能题有问题</div></div></div>'
   +(typeof aiQuizGapHtml==='function'?aiQuizGapHtml():'')
   +'<div class="card" style="padding:14px 18px"><div class="filg"><div class="fi2"><label>题干</label><input data-wc="qkw" value="'+esc(f.q||'')+'" placeholder="关键词"></div>'+kpOpts+so('st','状态',Q_ST)+so('type','题型',Q_TYPES)+'<div class="fi2" style="align-self:end"><button class="btn pri" data-act="qNew">新增题目</button> <button class="btn" data-act="qGen">AI 从话术出题</button></div></div></div>'
   +(rows.length?'<div class="tw"><table class="t nw stk"><tr><th>ID</th><th>题干</th><th>知识点</th><th>题型</th><th>答案</th><th>状态</th><th>作答 / 正确率</th><th>来源</th><th>操作</th></tr>'+rows.map(q=>{const k=kp(q.kp);const a=qAcc(q);return '<tr><td>'+q.id+'</td><td style="white-space:normal;min-width:260px;max-width:340px"><a class="link" data-act="qOpen" data-id="'+q.id+'">'+esc(q.stem)+'</a></td><td>'+(k?'<a class="link" data-act="kpOpen" data-id="'+k.id+'">'+esc(k.name)+'</a>':'-')+'</td><td>'+q.type+'</td><td>'+qTxt(q)+'</td><td><span class="tag '+(q.st==='已定稿'?'ok':q.st==='草稿'?'blue':'')+'">'+q.st+'</span></td><td>'+(q.stat.n?q.stat.n+' 次 / '+a+'%'+(a<40&&q.stat.n>=3?' <span class="tag kp-lv-warn">偏低</span>':''):'<span class="hint">未作答</span>')+'</td><td>'+(content(q.src)?'<a class="link" data-act="cView" data-id="'+q.src+'">'+q.src+'</a>':'-')+'</td><td><a class="link" data-act="qOpen" data-id="'+q.id+'">编辑</a>'+(q.st==='草稿'?' <a class="link" data-act="qPass" data-id="'+q.id+'">定稿</a>':q.st==='已定稿'?' <a class="link err" data-act="qOff" data-id="'+q.id+'">停用</a>':' <a class="link" data-act="qPass" data-id="'+q.id+'">恢复</a>')+'</td></tr>'}).join('')+'</table></div>':cta('没有符合条件的题','调整筛选,或「新增题目」/「AI 从话术出题」。','<button class="btn pri" data-act="qNew">新增题目</button>'))}
A.qset=el=>{const f=qFx();if(el.value)f[el.dataset.k]=el.value;else delete f[el.dataset.k];render()};
A.qkw=el=>{qFx().q=el.value.trim();render()};
A.qJumpNoQ=()=>{const k=S.kps.find(k=>k.st==='启用'&&!qsOf(k.id,'已定稿').length);if(k)A.kpOpen({dataset:{id:k.id}})};
A.qPass=el=>{const q=qById(el.dataset.id);const was=q.st;q.st='已定稿';toast((was==='已停用'?'已恢复':'已定稿')+':'+q.id,'ok');render()};
A.qOff=el=>{const q=qById(el.dataset.id);q.st='已停用';toast('已停用:'+q.id+'(已作答的记录保留)','ok');render()};
A.qOpen=el=>{const q=qById(el.dataset.id);QF=JSON.parse(JSON.stringify(q));QF._new=false;UI.page='qform';render();$('#main').scrollTop=0};
A.qNew=()=>{const f=qFx();QF={id:null,kp:f.kp||(S.kps[0]||{}).id,type:'单选',stem:'',opts:['','','',''],ans:[0],why:'',lv:1,src:'',st:'草稿',owner:UI.role.name,_new:true};UI.page='qform';render()};
let QF=null;
/* AI 从话术出题(演示:取话术 N 段里的数字/名词出填空式选择题的"草稿",走审核) */
function qGenFactsOf(c){
  const text=((c.body||{}).spin?SPIN_K.map(k=>(c.body.spin[k]||'')).join('。'):spl((c.body||{}).lines||'').join('。'))||'';
  const sents=text.replace(/\*\*/g,'').split(/[。！？!?\n；;]/).map(s=>s.trim()).filter(Boolean);
  return sents.map(s=>{const m=s.match(/(\d[\d.,]*\s?(?:kW|L|公里|兆帕|项|处|寸|年|万公里|迈|度|度电|%))/);return m?{num:m[1].replace(/\s/g,''),sent:s,raw:m[1]}:null}).filter(Boolean);
}
function qGenDistractors(num,pool){
  const unit=(num.match(/[^\d.,]+$/)||[''])[0];const val=parseFloat(num);
  const cands=[...new Set(pool.map(f=>f.num).filter(x=>x!==num&&x.endsWith(unit)))];
  return cands.filter(x=>!isNaN(parseFloat(x))).slice(0,3);
}
A.qGen=()=>{const un=S.kps.filter(k=>k.st==='启用'&&qsOf(k.id,'已定稿').length<3&&kpMounted(k).length);let n=0;
  un.slice(0,6).forEach(k=>{
    const pool=kpMounted(k).flatMap(c=>qGenFactsOf(c).map(f=>Object.assign(f,{src:c})));
    if(!pool.length)return;
    const corpus=S.contents.filter(c=>visC(c)&&usableC(c)).flatMap(c=>qGenFactsOf(c));
    const f=pool.find(x=>[...new Set(corpus.map(y=>y.num).filter(y=>y!==x.num&&y.endsWith((x.num.match(/[^\d.,]+$/)||[''])[0])))].length>=3);if(!f)return;
    const unit=(f.num.match(/[^\d.,]+$/)||[''])[0];
    const dis=[...new Set(corpus.map(y=>y.num).filter(y=>y!==f.num&&y.endsWith(unit)&&!isNaN(parseFloat(y))))].slice(0,3);
    const opts=[f.num].concat(dis);const order=opts.map((x,i)=>({x,i})).sort((a,b)=>hsh(k.id+a.x)-hsh(k.id+b.x));
    const ansIdx=order.findIndex(o=>o.i===0);
    const id='Q'+(S.qs.length+1+n);
    S.qs.push({id,kp:k.id,type:'单选',stem:'话术「'+f.src.title.split(' · ').pop()+'」里提到的关键数据是?(草稿,定稿前请核对)',opts:order.map(o=>o.x),ans:[ansIdx],why:'来源话术原文:'+f.sent+'。',lv:1,src:f.src.id,st:'草稿',owner:k.owner||UI.role.name,created:today,stat:{n:0,ok:0},aiDraft:true});n++});
  toast(n?'AI 一次生成了 '+n+' 道完整草稿题(选项与解析已由话术原文生成);请核对后再定稿':'没有可出题的知识点(已有 ≥3 道题、没挂内容或话术里没有数据)',n?'ok':'err');render()};
function pgQForm(){
  if(!QF){UI.page='catalog';return pgCatalog()}
  const isJ=QF.type==='判断';const opts=isJ?['正确','错误']:QF.opts;
  const oh=opts.map((o,i)=>'<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px"><label style="width:34px;font-weight:600">'+qLetters[i]+'</label>'+(isJ?'<span style="min-width:160px">'+o+'</span>':'<input type="text" data-qf-o="'+i+'" value="'+esc(o)+'" placeholder="选项 '+qLetters[i]+'" style="width:100%;max-width:380px">')+'<label class="sw2"><input type="'+(QF.type==='多选'?'checkbox':'radio')+'" name="qa" data-wc="qAnsSet" data-i="'+i+'" '+(QF.ans.includes(i)?'checked':'')+'> 正确答案</label>'+(!isJ&&opts.length>2?'<a class="link err" data-act="qOptDel" data-i="'+i+'">删除</a>':'')+'</div>').join('');
  const c=QF.src&&content(QF.src);
  const chk=[];if(!QF.stem.trim())chk.push('请填写题干');if(!isJ&&opts.some(o=>!String(o).trim()))chk.push('有选项没填');if(!QF.ans.length)chk.push('请选择正确答案');if(QF.type==='多选'&&QF.ans.length<2)chk.push('多选题至少 2 个正确答案');if(!QF.why.trim())chk.push('请写解析(学员答错会看到)');if(!isJ&&new Set(opts.map(o=>String(o).trim())).size<opts.length)chk.push('选项有重复');if(/请编干扰项|AI 草稿/.test(QF.stem+opts.join('')))chk.push('还有 AI 占位文字没改');
  return crumb('<a data-act="go" data-p="content">内容中心</a> / 题 / '+(QF._new?'新增':QF.id))+'<div class="ph"><h2>'+(QF._new?'新增题目':'编辑 '+QF.id)+'</h2></div>'
   +'<div class="card frm">'+FR('知识点','<select data-wc="qfset" data-k="kp">'+S.kps.map(k=>'<option value="'+k.id+'" '+(QF.kp===k.id?'selected':'')+'>'+esc(kpLabel(k))+'</option>').join('')+'</select>',{req:1,h:'题挂在知识点上;诊断时每个知识点抽题'})
   +FR('题型','<div class="rels">'+Q_TYPES.map(x=>'<span class="'+(QF.type===x?'on':'')+'" data-act="qType" data-v="'+x+'">'+x+'</span>').join('')+'</div>',{req:1})
   +FR('题干','<textarea class="w" data-qf="stem" style="min-height:70px">'+esc(QF.stem)+'</textarea>',{req:1,h:'只考话术 / 课程原文里明确有的事实;不要出原文里没有的数字'})
   +FR('选项与答案',oh+(!isJ&&opts.length<6?'<a class="link" data-act="qOptAdd">+ 增加选项</a>':''),{req:1})
   +FR('解析','<textarea class="w" data-qf="why" style="min-height:56px">'+esc(QF.why)+'</textarea>',{req:1,h:'答错时展示;建议写明出自哪条话术'})
   +FR('难度','<select data-wc="qfset" data-k="lv"><option value="1" '+(QF.lv==1?'selected':'')+'>1 · 记忆</option><option value="2" '+(QF.lv==2?'selected':'')+'>2 · 辨析</option></select>')
   +FR('来源话术',(c?'<a class="link" data-act="cView" data-id="'+c.id+'">'+c.id+' '+esc(c.title)+'</a>':'<span class="hint">未关联</span>')+' <select data-wc="qfset" data-k="src"><option value="">更换…</option>'+kpMounted(kp(QF.kp)||{id:''}).map(x=>'<option value="'+x.id+'">'+x.id+' '+esc(x.title)+'</option>').join('')+'</select>',{h:'从该知识点已挂载的内容里选;出题依据'})
   +(chk.length?chk.map(x=>'<div class="chk must"><b>!</b><span>'+esc(x)+'(定稿前必须补)</span></div>').join(''):'<div class="chk ok"><b>✓</b><span>可以定稿</span></div>')
   +'</div><div class="dock"><span class="sp"></span><button class="btn" data-act="qCancel">取消</button><button class="btn" data-act="qSave" data-s="0">保存草稿</button><button class="btn pri" data-act="qSave" data-s="1">保存并定稿</button></div>'}
document.addEventListener('input',e=>{const el=e.target;if(!QF||!el.dataset)return;if(el.dataset.qf)QF[el.dataset.qf]=el.value;if(el.dataset.qfO!==undefined)QF.opts[+el.dataset.qfO]=el.value});
A.qfset=el=>{QF[el.dataset.k]=el.dataset.k==='lv'?+el.value:el.value;if(el.dataset.k==='kp')QF.src='';render()};
A.qType=el=>{const t=el.dataset.v;QF.type=t;if(t==='判断'){QF.opts=['正确','错误'];QF.ans=[0]}else{if(QF.opts.length<3||QF.opts[0]==='正确')QF.opts=['','','',''];QF.ans=[0]}render()};
A.qAnsSet=el=>{const i=+el.dataset.i;if(QF.type==='多选'){QF.ans=el.checked?[...new Set(QF.ans.concat(i))]:QF.ans.filter(x=>x!==i)}else QF.ans=[i];render()};
A.qOptAdd=()=>{QF.opts.push('');render()};
A.qOptDel=el=>{const i=+el.dataset.i;QF.opts.splice(i,1);QF.ans=QF.ans.filter(x=>x!==i).map(x=>x>i?x-1:x);render()};
A.qCancel=()=>{QF=null;UI.page='content';UI.tab.content='全部内容';UI.sel.cadv=false;(UI.sel.caf||(UI.sel.caf={})).k='题';render()};
function qCheckHard(q){const isJ=q.type==='判断';const h=[];if(!q.stem.trim())h.push('请填写题干');if(!isJ&&q.opts.some(o=>!String(o).trim()))h.push('有选项没填');if(!q.ans.length)h.push('请选择正确答案');if(q.type==='多选'&&q.ans.length<2)h.push('多选题至少 2 个正确答案');if(!q.why.trim())h.push('请写解析');if(!isJ&&new Set(q.opts.map(o=>String(o).trim())).size<q.opts.length)h.push('选项有重复');if(/请编干扰项|AI 草稿/.test(q.stem+q.opts.join('')))h.push('还有 AI 占位文字没改');return h}
A.qSave=el=>{const fin=el.dataset.s==='1';if(!QF.stem.trim())return toast('请先填写题干','err');if(fin){const h=qCheckHard(QF);if(h.length)return toast('不能定稿:'+h[0]+(h.length>1?'(共 '+h.length+' 项)':''),'err')}
  let q=QF.id&&qById(QF.id);const o=JSON.parse(JSON.stringify(QF));delete o._new;o.st=fin?'已定稿':(q&&q.st==='已定稿'?'草稿':o.st==='已停用'?'已停用':'草稿');
  if(q){Object.assign(q,o)}else{o.id='Q'+(Math.max(0,...S.qs.map(x=>+x.id.slice(1)))+1);o.created=today;o.stat={n:0,ok:0};S.qs.push(o);q=o}
  QF=null;UI.page='catalog';UI.tab.catalog='题库';toast(fin?'已保存并定稿 '+q.id:'已保存草稿 '+q.id,'ok');render()};
/* ================= 零售通:真实作答(诊断 / 练习)=================
   掌握度算法(可解释,起步版):按时间倒序取该学员在该知识点最近 6 次作答,权重 1.0 / 0.85 / 0.7 … 逐次衰减,
   加权正确率 ×100。作答少于 2 次时,掌握度向 50 收缩(避免一两道题就判生死)。过关线 70。
   BKT / IRT 等数据足够后再引入。 */
const KP_DECAY=0.85,KP_WIN=6;
/* v23:掌握度改为「多来源按权重合成」(测评 + 演练 + 实战行为 + 人工评价 + 自评),权重与参数在配置中心可调。
   - 学员有证据流(S.ev)时走 v23Mastery;
   - 学员只有作答流水(ansLog)、没有证据流时,退回 v22 单来源算法(保证新加入的学员、旧测试都有掌握度)。 */
function mClassic(mid,kid){const L=((S.ansLog||[]).filter(a=>a.mid===mid&&a.kp===kid)).slice(-KP_WIN).reverse();if(!L.length)return null;let w=1,sw=0,so=0;L.forEach(a=>{sw+=w;so+=w*(a.ok?1:0);w*=KP_DECAY});let v=so/sw*100;if(L.length<2)v=v*0.6+50*0.4;return Math.round(v)}
const mHasEv=(mid,kid)=>!!(S&&S.ev&&S.cfg&&S.cfg.srcW&&['q','dr','co','se'].some(s=>((S.ev[s]||{})[mid]||{})[kid])||(S&&S.beh&&(S.beh[mid]||{})[kid]));
function mCalc(mid,kid){if(typeof v23Mastery==='function'&&mHasEv(mid,kid))return v23Mastery(mid,kid);return mClassic(mid,kid)}
function mRefresh(mid,kid){if(typeof v23MRefresh==='function'&&mHasEv(mid,kid))return v23MRefresh(mid,kid);
  const v=mClassic(mid,kid);if(v==null)return;const tries=(S.ansLog||[]).filter(a=>a.mid===mid&&a.kp===kid).length;const o=mst(mid,kid)||{};const was=o.v;mstSet(mid,kid,{v,tries,at:today});if(v>=KP_PASS&&(was==null||was<KP_PASS))mstSet(mid,kid,{next:addDays(today,3).slice(5)+' 复测'});return {was,v}}
/* 题的挑选:诊断 = 每个知识点 2 题(难度低优先,不重复);练习 = 该知识点最近答错的优先,再补没做过的 */
function qPick(mid,kid,n,mode){const pool=qsOf(kid,'已定稿');const seen={};(S.ansLog||[]).filter(a=>a.mid===mid&&a.kp===kid).forEach(a=>{seen[a.q]=a});
  const sc=q=>{const a=seen[q.id];if(mode==='diag')return (a?5:0)+q.lv+hsh(mid+q.id)%3/10;return a?(a.ok?3:0):1.5};
  return pool.slice().sort((a,b)=>sc(a)-sc(b)).slice(0,n)}
function kpDiagSet(mid){const ks=kpPool().filter(k=>qsOf(k.id,'已定稿').length>=1).sort((a,b)=>hsh(mid+a.id)-hsh(mid+b.id)).slice(0,8);const L=[];ks.forEach(k=>qPick(mid,k.id,2,'diag').forEach(q=>L.push(q.id)));return L}
let QZ=null; /* 当前一场:{mode:'diag'|'practice'|'exam', kid, ids:[], i, picked:[], shown:false, log:[]} */
const qzQ=()=>QZ&&qById(QZ.ids[QZ.i]);
function rQuiz(){
  const q=qzQ();const tot=QZ.ids.length;const k=kp(q.kp);const isM=q.type==='多选';
  let b=rnav((QZ.mode==='diag'?'诊断测':QZ.mode==='exam'?'模拟考试':'练一练')+' '+(QZ.i+1)+'/'+tot,false);
  b=b.replace('<div class="nav">','<div class="nav"><span class="bk" data-act="qzExit">✕</span>');
  const isAns=QZ.shown;
  b+='<div class="qz"><div class="qz-bar"><i style="width:'+Math.round((QZ.i+(isAns?1:0))/tot*100)+'%"></i></div>'
   +'<div class="qz-k">'+esc(k?k.name:'')+' · '+q.type+(isM?'(选出所有正确答案)':'')+'</div><div class="qz-s">'+esc(q.stem)+'</div>'
   +'<div class="qz-o">'+q.opts.map((o,i)=>{const on=QZ.picked.includes(i);const right=q.ans.includes(i);const cls=isAns?(right?'right':on?'wrong':''):(on?'on':'');return '<div class="qz-i '+cls+'" data-act="qzPick" data-i="'+i+'"><b>'+qLetters[i]+'</b><span>'+esc(o)+'</span>'+(isAns&&right?'<em>✓</em>':isAns&&on?'<em>✗</em>':'')+'</div>'}).join('')+'</div>'
   +(isAns?'<div class="qz-w '+(QZ.lastOk?'ok':'bad')+'"><b>'+(QZ.lastOk?'回答正确':'回答错误')+'</b><div>'+esc(q.why)+'</div>'+(content(q.src)?'<div class="qz-l" data-act="qzSrc" data-id="'+q.src+'">看原话术:'+esc(content(q.src).title)+' ›</div>':'')+'</div>':'')
   +'</div><div class="rbar">'+(isAns?'<button class="rb" data-act="qzNext">'+(QZ.i+1>=tot?'看结果':'下一题')+'</button>':'<button class="rb '+(QZ.picked.length?'':'dis')+'" data-act="qzSubmit">提交答案</button>')+'</div>';
  return b}
function rQuizEnd(){
  const L=QZ.log;const ok=L.filter(x=>x.ok).length;const byK={};L.forEach(x=>{(byK[x.kp]=byK[x.kp]||[]).push(x)});
  let b=rnav('结果',false).replace('<div class="nav">','<div class="nav"><span class="bk" data-act="qzExit">✕</span>');
  b+='<div class="qz-end"><div class="qz-sc"><b>'+ok+'</b>/'+L.length+'</div><div class="hint" style="color:#999">'+(QZ.mode==='diag'?'诊断完成,下面是你可以提升的点':'这一组练完了')+'</div></div>'
   +'<div style="background:#fff;padding:2px 14px 8px">'+Object.keys(byK).map(id=>{const k=kp(id);const x=byK[id];const o=mst(ME.mid,id)||{};const ch=QZ.chg[id]||{};return '<div class="ad-r"><div class="ad-h"><b>'+esc(k.name)+'</b><span class="pill '+(o.v>=KP_PASS?'g':o.v>=50?'y':'r')+'">'+(o.v>=KP_PASS?'已过关':o.v>=50?'接近':'待提升')+'</span></div><div class="ad-m"><span>本次 '+x.filter(y=>y.ok).length+'/'+x.length+' 对</span><span>掌握度 '+(ch.was==null?'首次':ch.was)+' → <b>'+o.v+'</b>(过关线 '+KP_PASS+')</span></div></div>'}).join('')+'</div>'
   +'<div style="height:70px"></div><div class="rbar"><button class="rb gh" data-act="qzExit">回到提升清单</button></div>';
  return b}
A.qzPick=el=>{if(QZ.shown)return;const i=+el.dataset.i;const q=qzQ();if(q.type==='多选')QZ.picked=QZ.picked.includes(i)?QZ.picked.filter(x=>x!==i):QZ.picked.concat(i);else QZ.picked=[i];renderRN()};
A.qzSubmit=()=>{if(QZ.shown)return;if(!QZ.picked.length)return toast('先选一个答案','');const q=qzQ();const ok=qAns({ans:QZ.picked.slice().sort()})===qAns(q);QZ.lastOk=ok;QZ.shown=true;
  S.ansLog=S.ansLog||[];S.ansLog.push({mid:ME.mid,q:q.id,kp:q.kp,ok,pick:QZ.picked.slice(),t:today,mode:QZ.mode});q.stat.n++;if(ok)q.stat.ok++;QZ.log.push({q:q.id,kp:q.kp,ok});
  if(typeof v23Sync==='function'&&S.ev)v23Sync(ME.mid,q.kp,'quiz');
  const r=mRefresh(ME.mid,q.kp);if(r&&!(q.kp in QZ.chg))QZ.chg[q.kp]={was:r.was};renderRN()};
A.qzNext=()=>{if(QZ.i+1>=QZ.ids.length){QZ.end=true;return renderRN()}QZ.i++;QZ.picked=[];QZ.shown=false;renderRN()};
A.qzExit=()=>{QZ=null;R.page='adapt';renderRN()};
A.qzSrc=el=>{R.sheet={zone:el.dataset.id};R.fb=null;renderRN()};
const qzStart=(mode,kid,ids)=>{if(!ids.length)return toast('这个知识点还没有已定稿的题','err');QZ={mode,kid,ids,i:0,picked:[],shown:false,log:[],chg:{}};R.page='quiz';renderRN()};
