/* ========== 演练 v21 ==========
   演练 = 挂在知识点上的一种资产(和题、话术、课程并列)。形态参照现网「话术演练」:
   一个脚本 = 若干个"客户说一句 → 学员答一句 → 评分 + 点评 + 参考话术"的回合。
   评分沿用现网话术演练三维度:知识正确 35 / 情绪安抚 15 / 思路正确 50,共 100,通关线 60。
   ★ 真实系统由 AI 评分;Demo 无法接 AI,用「命中关键点」的可解释规则代替(界面和流程是真的,分数是示意)。
   规则:知识正确 = 命中「必说点」比例 ×35;情绪安抚 = 命中「安抚词」×15(没有安抚词的回合此项按满分,不惩罚);
        思路正确 = 命中「思路点」比例 ×50;命中依据来自来源话术,回答里没出现就不得分。 */
const DR_DIM=[['know','知识正确',35],['emo','情绪安抚',15],['idea','思路正确',50]];
const DR_PASS=60;
const drById=id=>S.drills.find(d=>d.id===id);
const drsOf=(kid,st)=>S.drills.filter(d=>d.kp===kid&&(!st||d.st===st));
const drUsable=d=>d.st==='已定稿'&&d.turns.length>0;
/* 脚本:[id, 知识点, 名称, 场景, 客户画像, 来源话术, 回合[{say, must:[[关键点,[同义说法…]]], emo:[安抚词…], idea:[[思路点,[说法…]]], ref}] ] */
const DR_SEED=[
 ['D1','K18','客户说"你们比 GLC 贵一截"','展厅','首购客户,拿 GLC 比价,有点犹豫','N7',[
  {say:'你们这价格比奔驰 GLC 还高一点,我觉得有点贵。',emo:['理解','正常','认真比','能理解'],must:[['总拥有成本/三年使用成本',['总拥有成本','三年','使用成本','成本']],['保值率或权益',['保值','权益']]],idea:[['先认同再讲价值',['理解','正常','认真比']],['把账算给客户',['算','帮您算','算出来']]],ref:'您觉得价格有压力,这很正常,说明您在认真比。我们不只看买车这一刻,三年的使用成本、保值率和权益一起算,总拥有成本其实更低。'},
  {say:'那你给我算算,到底怎么个低法?',emo:[],must:[['配置折算或具体项目',['配置','座舱','智驾','补能','折算']]],idea:[['引导客户说出在意的点',['您更看重','您在意','哪一项','哪一块']],['邀请体验',['体验','试驾','试一下']]],ref:'我把这笔账给您算出来,您看哪一项是您最在意的。我们重点体验。'}]],
 ['D2','K19','客户拿 GLC 对比','试驾','对比型客户,刚试完 GLC','N1',[
  {say:'我刚试完 GLC,感觉你们和它差不多,为什么要选你们?',emo:['理解','最常被比','正常'],must:[['同价位配置折算',['同价位','配置折算','折算','座舱','智驾','补能']]],idea:[['承认对方是对手并尊重',['理解','常被比','正常']],['落到客户在意的点',['您更看重','您在意','哪一块','哪一项']]],ref:'理解您会拿 GLC 一起比,这是同价位里最常被比的一款。同样的预算,我帮您把配置折算一下:座舱、智驾、补能这几项,折下来我们多给您的价值。您更看重哪一块?我们重点体验。'}]],
 ['D3','K22','客户问国补和地补能不能叠加','外呼','电话咨询的客户,对政策不熟','N2',[
  {say:'国补和地补到底能不能一起享受?别到时候又说不行。',emo:['放心','确认','不用担心'],must:[['可以叠加',['可以叠加','能叠加','可以一起','叠加享受']],['以当地最新口径为准',['最新口径','以当地','以所在','为准']]],idea:[['按车型和所在地帮客户算',['帮您算','按车型','所在地','算一下']],['给出下一步',['材料','办理','今天','当场']]],ref:'先和您确认:国补和地补是可以叠加享受的,具体以您所在省市的最新口径为准。我帮您按车型和所在地算一下,叠加后实际到手价是多少。需要的材料我现在列给您,今天确定的话我们当场协助办理。'}]],
 ['D4','K23','客户刚进店','展厅','自己看车、不想被打扰的客户','N16',[
  {say:'(客户刚走进展厅,在车旁边站着看)',emo:[],must:[['欢迎并询问想了解的车型',['欢迎','哪款','了解']]],idea:[['给客户空间,不过度打扰',['随便看','您先看','我就在旁边','有问题']]],ref:'您好,欢迎来小米汽车,今天主要想了解哪款车?您先随便看,有任何问题我就在旁边。'}]],
 ['D5','K1','客户问装得下婴儿车吗','展厅','带孩子的家庭客户','N101',[
  {say:'我家有个小孩,后备箱能装下婴儿车和行李吗?',emo:[],must:[['后备箱容积',['1203','后备箱']],['拓展到更大空间',['2425','放倒','拓展']]],idea:[['结合客户场景(推车行李)',['婴儿车','推车','行李','出门','逢年过节']],['引导到更多家庭场景',['全家','舒适','滑雪板','自行车']]],ref:'咱小米澎程后备箱 1203L 同级最大;二排一放倒直接拓展到 2425L,24 个 20 寸行李箱塞得下。地板纯平、格局方正,怎么摆都不硌;后备箱开口又大又低,搬东西不费腰。'}]]
];
function drSeed(){
  S.drills=DR_SEED.map(a=>({id:a[0],kp:a[1],name:a[2],scene:a[3],persona:a[4],src:a[5],turns:a[6],st:'已定稿',owner:(kp(a[1])||{}).owner||'李娜',created:addDays(today,-8),stat:{n:0,sum:0,pass:0}}));
  /* 一个草稿(回合不全,不能定稿) + 一个已停用 */
  S.drills.push({id:'D6',kp:'K21',name:'电话邀约:客户说"这周没空"',scene:'外呼',persona:'意向一般,说没时间',src:'N3',turns:[],st:'草稿',owner:'王磊',created:addDays(today,-1),stat:{n:0,sum:0,pass:0}});
  S.drills.push({id:'D7',kp:'K18',name:'(旧)价格异议 — 口径已过期',scene:'展厅',persona:'-',src:'N7',turns:[{say:'太贵了',emo:[],must:[['x',['x']]],idea:[['x',['x']]],ref:'旧口径'}],st:'已停用',owner:'李娜',created:addDays(today,-40),stat:{n:5,sum:240,pass:1}});
  /* 演练不再手工"登记"到知识点:登记表里只保留清河考试(演练由真实脚本统计) */
  S.kps.forEach(k=>{k.ext=(k.ext||[]).filter(e=>e.t==='清河考试')});
}
/* 评分:返回 {know,emo,idea,total,hits:{must:[[点,命中]],idea:[…],emo:bool}} */
function drScore(turn,ans){
  const T=String(ans||'').replace(/\s/g,'');const has=arr=>arr.some(w=>w&&T.includes(w));
  const must=turn.must.map(m=>[m[0],has(m[1])]),idea=turn.idea.map(m=>[m[0],has(m[1])]);
  const emoHit=!turn.emo.length||has(turn.emo);
  const rate=a=>a.length?a.filter(x=>x[1]).length/a.length:1;
  const know=Math.round(rate(must)*35),emo=emoHit?15:0,ide=Math.round(rate(idea)*50);
  return {know,emo,idea:ide,total:know+emo+ide,hits:{must,idea,emo:emoHit,hasEmo:turn.emo.length>0}}
}
/* 一次演练的总分 = 各回合平均;通关线 60 */
const drTotal=L=>L.length?Math.round(L.reduce((a,x)=>a+x.sc.total,0)/L.length):0;
/* ================= 后台:演练(知识点 → 演练 页签)+ 脚本编辑 ================= */
const drFx=()=>UI.sel.df||(UI.sel.df={});
const drAvg=d=>d.stat.n?Math.round(d.stat.sum/d.stat.n):null;
const drPassRate=d=>d.stat.n?Math.round(d.stat.pass/d.stat.n*100):null;
function kpDrills(){
  const f=drFx();const rows=S.drills.filter(d=>(!f.kp||d.kp===f.kp)&&(!f.st||d.st===f.st)&&(!f.scene||d.scene===f.scene)&&(!f.q||d.name.includes(f.q)));
  const so=(k,l,o)=>'<div class="fi2"><label>'+l+'</label><select data-wc="drset" data-k="'+k+'"><option value="">全部</option>'+o.map(x=>'<option '+(f[k]===x?'selected':'')+'>'+x+'</option>').join('')+'</select></div>';
  const kpOpts='<div class="fi2"><label>知识点</label><select data-wc="drset" data-k="kp"><option value="">全部</option>'+S.kps.map(k=>'<option value="'+k.id+'" '+(f.kp===k.id?'selected':'')+'>'+esc(kpLabel(k))+'</option>').join('')+'</select></div>';
  const n=st=>S.drills.filter(d=>d.st===st).length;const noD=S.kps.filter(k=>k.st==='启用'&&k.type==='技能型'&&!drsOf(k.id,'已定稿').length).length;
  const dPg=lstPage('drillPage',rows,20);
  return srcBar('演练 = 挂在知识点上的一种资产。一个脚本由若干<b>回合</b>组成:客户说一句 → 学员答一句 → 立刻评分、点评、给参考话术。<b>评分沿用现网话术演练三维度:知识正确 35 / 情绪安抚 15 / 思路正确 50,通关线 60</b>。每个回合要写清「必说点」(没说到就扣知识分)和「思路点」(没做到就扣思路分),依据都来自来源话术。<b>真实系统由 AI 评分、语音对话;Demo 用"命中关键点"的规则文字演示</b>,界面和流程是真的,分数是示意。')
   +'<div class="grid g4" style="margin-bottom:16px"><div class="stat"><div class="l">已定稿</div><div class="n">'+n('已定稿')+'</div><div class="hint">学员可以练</div></div><div class="stat"><div class="l">草稿</div><div class="n">'+n('草稿')+'</div><div class="hint">回合不全不能定稿</div></div><div class="stat"><div class="l">技能型知识点没有演练</div><div class="n" style="color:'+(noD?'#c8323a':'')+'">'+noD+'</div><div class="hint">技能类最适合用演练测</div></div><div class="stat"><div class="l">本月演练次数</div><div class="n">'+S.drills.reduce((a,d)=>a+d.stat.n,0)+'</div><div class="hint">含示意数据</div></div></div>'
   +'<div class="card" style="padding:14px 18px"><div class="filg"><div class="fi2"><label>名称</label><input data-wc="drkw" value="'+esc(f.q||'')+'" placeholder="关键词"></div>'+kpOpts+so('st','状态',Q_ST)+so('scene','场景',['展厅','试驾','外呼','客服'])+'<div class="fi2" style="align-self:end"><button class="btn pri" data-act="drNew">新增演练</button> <button class="btn" data-act="drGen">AI 从话术生成草稿</button></div></div></div>'
   +(rows.length?'<div class="fil" style="margin-bottom:8px"><span class="hint">共 '+rows.length+' 个演练</span><span style="flex:1"></span>'+lstCsvBtn(['ID','名称','知识点','场景','回合','状态','练习次数','平均分','通关率'],[['ID','名称','知识点','场景','回合','状态','练习次数','平均分','通关率']].concat(rows.map(d=>[d.id,d.name,(kp(d.kp)||{}).name||'',d.scene,d.turns.length,d.st,d.stat.n,drAvg(d)==null?'':drAvg(d),drPassRate(d)==null?'':drPassRate(d)])),'演练')+'</div>'
   +'<div class="tw"><table class="t nw stk"><tr><th>ID</th><th>名称</th><th>知识点</th><th>场景</th><th>回合</th><th>状态</th><th>练习次数</th><th>平均分</th><th>通关率</th><th>来源</th><th>操作</th></tr>'+dPg.rows.map(d=>{const k=kp(d.kp);const a=drAvg(d);return '<tr><td>'+d.id+'</td><td style="white-space:normal;min-width:220px"><a class="link" data-act="drOpen" data-id="'+d.id+'">'+esc(d.name)+'</a><div class="hint">'+esc(d.persona)+'</div></td><td>'+(k?'<a class="link" data-act="kpOpen" data-id="'+k.id+'">'+esc(k.name)+'</a>':'-')+'</td><td>'+d.scene+'</td><td>'+d.turns.length+'</td><td><span class="tag '+(d.st==='已定稿'?'ok':d.st==='草稿'?'blue':'')+'">'+d.st+'</span></td><td>'+(d.stat.n||'<span class="hint">0</span>')+'</td><td>'+(a==null?'<span class="hint">—</span>':a)+'</td><td>'+(a==null?'<span class="hint">—</span>':drPassRate(d)+'%'+(drPassRate(d)<30&&d.stat.n>=3?' <span class="tag kp-lv-warn">偏低</span>':''))+'</td><td>'+(content(d.src)?'<a class="link" data-act="cView" data-id="'+d.src+'">'+d.src+'</a>':'-')+'</td><td><a class="link" data-act="drOpen" data-id="'+d.id+'">编辑</a>'+(d.st==='草稿'?' <a class="link" data-act="drPass" data-id="'+d.id+'">定稿</a>':d.st==='已定稿'?' <a class="link err" data-act="drOff" data-id="'+d.id+'">停用</a>':' <a class="link" data-act="drPass" data-id="'+d.id+'">恢复</a>')+'</td></tr>'}).join('')+'</table></div>'+lstPager('drillPage',dPg):cta('没有符合条件的演练','调整筛选,或「新增演练」/「AI 从话术生成草稿」。','<button class="btn pri" data-act="drNew">新增演练</button>'))}
A.drset=el=>{const f=drFx();if(el.value)f[el.dataset.k]=el.value;else delete f[el.dataset.k];render()};
A.drkw=el=>{drFx().q=el.value.trim();render()};
function drHard(d){const h=[];if(!d.name.trim())h.push('请填写名称');if(!d.turns.length)h.push('至少要有 1 个回合');d.turns.forEach((t,i)=>{const n='回合 '+(i+1);if(!String(t.say||'').trim())h.push(n+':客户的话没填');if(!t.must.length)h.push(n+':至少 1 个必说点');if(!t.idea.length)h.push(n+':至少 1 个思路点');if(!String(t.ref||'').trim())h.push(n+':参考话术没填');if(/请补/.test(String(t.say)+String(t.ref)))h.push(n+':还有 AI 占位文字没改')});return h}
A.drPass=el=>{const d=drById(el.dataset.id);if(d.st!=='已停用'){const h=drHard(d);if(h.length)return toast('不能定稿:'+h[0]+(h.length>1?'(共 '+h.length+' 项)':''),'err')}d.st='已定稿';toast('已定稿:'+d.id,'ok');render()};
A.drOff=el=>{drById(el.dataset.id).st='已停用';toast('已停用(已练习的记录保留)','ok');render()};
let DF=null;
const drLines=(arr)=>arr.map(m=>m[0]+'='+m[1].join(',')).join('\n');
const drParse=(txt)=>String(txt||'').split('\n').map(x=>x.trim()).filter(Boolean).map(l=>{const i=l.indexOf('=');const name=(i<0?l:l.slice(0,i)).trim();const ws=(i<0?[name]:l.slice(i+1).split(/[,,、]/)).map(x=>x.trim()).filter(Boolean);return [name,ws.length?ws:[name]]});
A.drOpen=el=>{const d=drById(el.dataset.id);DF=JSON.parse(JSON.stringify(d));DF.turns=DF.turns.map(t=>({say:t.say,ref:t.ref,emoT:t.emo.join(','),mustT:drLines(t.must),ideaT:drLines(t.idea)}));DF._new=false;UI.page='dform';render();$('#main').scrollTop=0};
A.drNew=()=>{const f=drFx();DF={id:null,kp:f.kp||(S.kps.find(k=>k.type==='技能型')||S.kps[0]).id,name:'',scene:'展厅',persona:'',src:'',turns:[drBlank()],st:'草稿',owner:UI.role.name,_new:true};UI.page='dform';render()};
const drBlank=()=>({say:'',ref:'',emoT:'',mustT:'',ideaT:''});
A.drGen=()=>{let n=0;S.kps.filter(k=>k.st==='启用'&&k.type==='技能型'&&!drsOf(k.id).length&&kpMounted(k).length).slice(0,3).forEach(k=>{
  const c=kpMounted(k).find(x=>usableC(x))||kpMounted(k)[0];const sp=(c.body||{}).spin||{};
  const say=(sp.S||c.title||'').replace(/\*\*/g,'').slice(0,40);
  const must=(sp.P||'').replace(/\*\*/g,'').split(/[，。、;；]/).map(x=>x.trim()).filter(x=>x.length>=2).slice(0,3).map(x=>[x.slice(0,12),[x.slice(0,4)]]);
  const idea=(sp.N||'').replace(/\*\*/g,'').split(/[，。、;；]/).map(x=>x.trim()).filter(x=>x.length>=2).slice(0,2).map(x=>[x.slice(0,10),[x.slice(0,4)]]);
  const ref=([sp.S,sp.P,sp.I,sp.N].filter(Boolean).map(x=>x.replace(/\*\*/g,'')).join(' ')||(c.title+'(请从来源话术补充参考回答)')).slice(0,200);
  const emo=['理解','明白','正常'];
  const id='D'+(S.drills.length+1+n);
  S.drills.push({id,kp:k.id,name:'客户异议 · '+kpLabel(k),scene:'展厅',persona:'(草稿)客户提到「'+(say||kpLabel(k))+'」,有顾虑',src:c.id,turns:[{say:say||'(话术场景)',emo,must:must.length?must:[['核心卖点',[kpLabel(k).slice(0,4)]]],idea:idea.length?idea:[['先认同',['理解','明白']]],ref}],st:'草稿',owner:k.owner||UI.role.name,created:today,stat:{n:0,sum:0,pass:0},aiDraft:true});n++});
  toast(n?'AI 一次生成了 '+n+' 个完整演练草稿(客户话 / 必说点 / 思路点 / 参考话术均由话术拆出);请核对改字后再定稿':'没有可生成的技能型知识点(都已有演练或没挂内容)',n?'ok':'err');render()};
function pgDrForm(){
  if(!DF){UI.page='catalog';return pgCatalog()}
  const th=DF.turns.map((t,i)=>'<div class="card" style="margin-bottom:12px;background:#fafbfc"><h3 style="margin-bottom:10px">回合 '+(i+1)+' <a class="link err" data-act="drTurnDel" data-i="'+i+'" style="font-weight:400;font-size:12px;margin-left:8px">'+(DF.turns.length>1?'删除':'')+'</a></h3>'
    +'<div class="fr"><div class="flb"><b>*</b>客户说</div><div class="fc"><textarea class="w" data-dt="say" data-i="'+i+'" style="min-height:50px">'+esc(t.say)+'</textarea></div></div>'
    +'<div class="fr"><div class="flb"><b>*</b>必说点</div><div class="fc"><textarea class="w" data-dt="mustT" data-i="'+i+'" style="min-height:64px" placeholder="每行一个:点名=说法1,说法2">'+esc(t.mustT)+'</textarea><div class="fh">每行一个。「点名=学员可能的说法1,说法2」,回答里出现任一说法即算说到。决定「知识正确 35 分」</div></div></div>'
    +'<div class="fr"><div class="flb">安抚词</div><div class="fc"><input type="text" data-dt="emoT" data-i="'+i+'" value="'+esc(t.emoT)+'" placeholder="理解,正常,放心" style="width:100%;max-width:420px"><div class="fh">客户有情绪时填;回答里出现任一个即得「情绪安抚 15 分」。不填 = 这回合不考安抚,按满分算</div></div></div>'
    +'<div class="fr"><div class="flb"><b>*</b>思路点</div><div class="fc"><textarea class="w" data-dt="ideaT" data-i="'+i+'" style="min-height:64px" placeholder="每行一个:点名=说法1,说法2">'+esc(t.ideaT)+'</textarea><div class="fh">方法对不对:先认同、算账、引导体验、给下一步…决定「思路正确 50 分」</div></div></div>'
    +'<div class="fr"><div class="flb"><b>*</b>参考话术</div><div class="fc"><textarea class="w" data-dt="ref" data-i="'+i+'" style="min-height:64px">'+esc(t.ref)+'</textarea><div class="fh">答完展示给学员对照;建议直接取来源话术原文</div></div></div></div>').join('');
  const c=DF.src&&content(DF.src);const chk=drHard(Object.assign({},DF,{turns:DF.turns.map(t=>({say:t.say,ref:t.ref,must:drParse(t.mustT),idea:drParse(t.ideaT),emo:[]}))}));
  const dockHtml='<!--DOCK_START--><div class="dock"><span class="sp"></span><button class="btn" data-act="drCancel">取消</button><button class="btn" data-act="drSave" data-s="0">保存草稿</button><button class="btn pri" data-act="drSave" data-s="1">保存并定稿</button></div><!--DOCK_END-->';
  return crumb('<a data-act="go" data-p="content">内容中心</a> / 演练 / '+(DF._new?'新增':DF.id))+dockHtml+'<div class="ph"><h2>'+(DF._new?'新增演练':'编辑 '+DF.id)+'</h2></div>'
   +'<div class="card frm">'+FR('名称','<input type="text" data-df="name" value="'+esc(DF.name)+'" placeholder="如:客户说"你们比 GLC 贵"" style="width:100%;max-width:420px">',{req:1})
   +FR('知识点','<select data-wc="dfset" data-k="kp">'+S.kps.map(k=>'<option value="'+k.id+'" '+(DF.kp===k.id?'selected':'')+'>'+esc(kpLabel(k))+(k.type==='技能型'?'':'(事实型)')+'</option>').join('')+'</select>',{req:1,h:'技能型知识点(异议处理、探需…)最适合用演练来测'})
   +FR('场景','<select data-wc="dfset" data-k="scene">'+['展厅','试驾','外呼','客服'].map(x=>'<option '+(DF.scene===x?'selected':'')+'>'+x+'</option>').join('')+'</select>')
   +FR('客户画像','<input type="text" data-df="persona" value="'+esc(DF.persona)+'" placeholder="如:首购客户,拿 GLC 比价,有点犹豫" style="width:100%;max-width:420px">',{h:'学员开始前会看到,帮助进入情境'})
   +FR('来源话术',(c?'<a class="link" data-act="cView" data-id="'+c.id+'">'+c.id+' '+esc(c.title)+'</a>':'<span class="hint">未关联</span>')+' <select data-wc="dfset" data-k="src"><option value="">更换…</option>'+kpMounted(kp(DF.kp)||{id:''}).map(x=>'<option value="'+x.id+'">'+x.id+' '+esc(x.title)+'</option>').join('')+'</select>',{h:'从该知识点已挂载的内容里选;评分依据'})
   +FR('回合','<div>'+th+'</div><button class="btn sm" data-act="drTurnAdd">+ 增加回合</button>',{req:1})
   +(chk.length?chk.slice(0,6).map(x=>'<div class="chk must"><b>!</b><span>'+esc(x)+'(定稿前必须补)</span></div>').join('')+(chk.length>6?'<div class="hint">还有 '+(chk.length-6)+' 项…</div>':''):'<div class="chk ok"><b>✓</b><span>可以定稿</span></div>')
   +'</div>'}
document.addEventListener('input',e=>{const el=e.target;if(!DF||!el.dataset)return;if(el.dataset.df)DF[el.dataset.df]=el.value;if(el.dataset.dt!==undefined&&el.dataset.i!==undefined)DF.turns[+el.dataset.i][el.dataset.dt]=el.value});
A.dfset=el=>{DF[el.dataset.k]=el.value;if(el.dataset.k==='kp')DF.src='';render()};
A.drTurnAdd=()=>{DF.turns.push(drBlank());render()};
A.drTurnDel=el=>{if(DF.turns.length>1){DF.turns.splice(+el.dataset.i,1);render()}};
A.drCancel=()=>{DF=null;UI.page='content';UI.tab.content='全部内容';UI.sel.cadv=false;(UI.sel.caf||(UI.sel.caf={})).k='演练';render()};
A.drSave=el=>{const fin=el.dataset.s==='1';if(!DF.name.trim())return toast('请先填写名称','err');
  const o=JSON.parse(JSON.stringify(DF));delete o._new;o.turns=DF.turns.map(t=>({say:t.say.trim(),ref:t.ref.trim(),emo:String(t.emoT||'').split(/[,,、\s]+/).filter(Boolean),must:drParse(t.mustT),idea:drParse(t.ideaT)}));
  if(fin){const h=drHard(o);if(h.length)return toast('不能定稿:'+h[0]+(h.length>1?'(共 '+h.length+' 项)':''),'err')}
  let d=DF.id&&drById(DF.id);o.st=fin?'已定稿':(d&&d.st==='已定稿'?'草稿':(d&&d.st==='已停用'?'已停用':'草稿'));
  if(d){Object.assign(d,o)}else{o.id='D'+(Math.max(0,...S.drills.map(x=>+x.id.slice(1)))+1);o.created=today;o.stat={n:0,sum:0,pass:0};S.drills.push(o);d=o}
  DF=null;UI.page='content';UI.tab.content='全部内容';UI.sel.cadv=false;(UI.sel.caf||(UI.sel.caf={})).k='演练';toast(fin?'已保存并定稿 '+d.id:'已保存草稿 '+d.id,'ok');render()};
/* ================= 零售通:演练(对话式)=================
   进入:提升清单里"练一练"(有演练的点优先)/ 学堂首页「AI 实战」/ 学习中心。
   流程:看客户画像 → 客户说一句(气泡)→ 学员输入回答(可点"看提示")→ 提交 → 三维度得分 + 命中/未命中的点 + 参考话术 → 下一回合 → 总分与是否通关。
   计入掌握度:一次演练总分 ≥60 记为"对",否则"错"(与题共用一套掌握度算法)。 */
let DZ=null;
const dzTurn=()=>DZ&&drById(DZ.id).turns[DZ.i];
function drPick(mid,kid){const L=drsOf(kid,'已定稿').filter(drUsable);if(!L.length)return null;const done={};(S.ansLog||[]).filter(a=>a.mid===mid&&a.mode==='drill').forEach(a=>{done[a.q]=a.ok});return L.slice().sort((a,b)=>((a.id in done)?(done[a.id]?3:1):0)-((b.id in done)?(done[b.id]?3:1):0))[0]}
function rDrill(){
  const d=drById(DZ.id);const t=d.turns[DZ.i];const tot=d.turns.length;
  let b=rnav('演练 '+(DZ.i+1)+'/'+tot,false).replace('<div class="nav">','<div class="nav"><span class="bk" data-act="dzExit">✕</span>');
  if(DZ.step==='intro'){
    return b+'<div class="dz-intro"><div class="dz-av">客</div><b>'+esc(d.name)+'</b><div class="dz-p">场景:'+esc(d.scene)+'<br>客户:'+esc(d.persona)+'</div><div class="dz-r">你有 <b>'+tot+'</b> 个回合。每回合客户说一句,你用<b>自己的话</b>回答。系统按「知识正确 35 · 情绪安抚 15 · 思路正确 50」评分,<b>≥60 分算通关</b>。</div><div class="hint" style="color:#999;font-size:11px;margin:8px 16px">演示版:不接语音和 AI,用文字作答、按关键点评分;真实系统是语音对话 + AI 评分。</div></div><div class="rbar"><button class="rb" data-act="dzStart">开始演练</button></div>'}
  b+='<div class="dz"><div class="dz-bar"><i style="width:'+Math.round((DZ.i+(DZ.step==='fb'?1:0))/tot*100)+'%"></i></div>'
   +'<div class="dz-m c"><span class="dz-a">客</span><div class="dz-b">'+esc(t.say)+'</div></div>';
  if(DZ.step==='ans'){
    b+='<div class="dz-in"><textarea id="dz_t" placeholder="像面对客户一样,写出你会怎么回答…" data-dz="1">'+esc(DZ.text)+'</textarea>'+(DZ.hint?'<div class="dz-h">提示:'+t.must.map(m=>esc(m[0])).concat(t.idea.map(m=>esc(m[0]))).join(' · ')+'</div>':'<a class="dz-hl" data-act="dzHint">看提示(会提示这一回合要说到哪些点)</a>')+'</div>'
      +'</div><div class="rbar"><button class="rb '+(DZ.text.trim()?'':'dis')+'" data-act="dzSubmit">提交回答</button></div>'}
  else{
    const sc=DZ.sc;
    b+='<div class="dz-m m"><span class="dz-a">我</span><div class="dz-b">'+esc(DZ.text)+'</div></div>'
     +'<div class="dz-sc"><div class="dz-t"><b>'+sc.total+'</b><small>本回合得分</small></div>'+DR_DIM.map(x=>{const v=sc[x[0]];return '<div class="dz-d"><div class="dz-dn"><span>'+x[1]+'</span><span>'+v+' / '+x[2]+'</span></div><div class="dz-db"><i style="width:'+Math.round(v/x[2]*100)+'%;background:'+(v>=x[2]*0.7?'#12a36b':v>=x[2]*0.4?'#e8830c':'#e5484d')+'"></i></div></div>'}).join('')+'</div>'
     +'<div class="dz-cm"><b>点评</b>'+sc.hits.must.map(x=>'<div class="'+(x[1]?'ok':'no')+'">'+(x[1]?'✓ 说到了':'✗ 没说到')+':'+esc(x[0])+'</div>').join('')+sc.hits.idea.map(x=>'<div class="'+(x[1]?'ok':'no')+'">'+(x[1]?'✓ 做到了':'✗ 没做到')+':'+esc(x[0])+'</div>').join('')+(sc.hits.hasEmo?'<div class="'+(sc.hits.emo?'ok':'no')+'">'+(sc.hits.emo?'✓ 有安抚客户情绪':'✗ 没有先安抚客户情绪')+'</div>':'')+'</div>'
     +'<div class="dz-rf"><b>参考话术</b><div>'+esc(t.ref)+'</div>'+(content(d.src)?'<div class="qz-l" data-act="qzSrc" data-id="'+d.src+'">看原话术:'+esc(content(d.src).title)+' ›</div>':'')+'</div>'
     +'</div><div class="rbar"><button class="rb" data-act="dzNext">'+(DZ.i+1>=tot?'看总成绩':'下一回合')+'</button></div>'}
  return b}
function rDrillEnd(){
  const d=drById(DZ.id);const tot=drTotal(DZ.log);const ok=tot>=DR_PASS;const L=DZ.log;
  let b=rnav('演练结果',false).replace('<div class="nav">','<div class="nav"><span class="bk" data-act="dzExit">✕</span>');
  const dim=DR_DIM.map(x=>Math.round(L.reduce((a,y)=>a+y.sc[x[0]],0)/L.length));
  const o=mst(ME.mid,d.kp)||{};const ch=DZ.chg||{};
  return b+'<div class="qz-end"><div class="qz-sc"><b style="color:'+(ok?'#12a36b':'#e5484d')+'">'+tot+'</b>/100</div><div style="font-size:16px;font-weight:600;color:'+(ok?'#12a36b':'#e5484d')+'">'+(ok?'通关':'未通关')+'<small style="color:#999;font-weight:400"> · 通关线 '+DR_PASS+'</small></div></div>'
   +'<div style="background:#fff;padding:6px 16px 10px">'+DR_DIM.map((x,i)=>'<div class="dz-d"><div class="dz-dn"><span>'+x[1]+'</span><span>'+dim[i]+' / '+x[2]+'</span></div><div class="dz-db"><i style="width:'+Math.round(dim[i]/x[2]*100)+'%;background:'+(dim[i]>=x[2]*0.7?'#12a36b':dim[i]>=x[2]*0.4?'#e8830c':'#e5484d')+'"></i></div></div>').join('')+'<div class="hint" style="margin-top:8px;color:#888">'+(Math.min(...dim.map((v,i)=>v/DR_DIM[i][2]))>=0.9?'三项都很扎实':'最需要加强的一项:<b>'+DR_DIM[dim.map((v,i)=>v/DR_DIM[i][2]).indexOf(Math.min(...dim.map((v,i)=>v/DR_DIM[i][2])))][1]+'</b>')+'</div></div>'
   +'<div style="background:#fff;margin-top:8px;padding:10px 16px"><b style="font-size:13px">「'+esc((kp(d.kp)||{}).name)+'」掌握度</b><div class="ad-m" style="margin-top:6px"><span>'+(ch.was==null?'首次':ch.was)+' → <b>'+(o.v==null?'—':o.v)+'</b>(过关线 '+KP_PASS+')</span><span>'+(ok?'本次计为"对"':'本次计为"错"')+'</span></div></div>'
   +'<div style="height:70px"></div><div class="rbar"><button class="rb gh" data-act="dzAgain">再练一次</button><button class="rb" data-act="dzExit">回到提升清单</button></div>'}
A.dzStart=()=>{DZ.step='ans';DZ.text='';DZ.hint=false;renderRN()};
A.dzHint=()=>{DZ.text=($('#dz_t')||{}).value||DZ.text;DZ.hint=true;renderRN();const e=$('#dz_t');if(e){e.value=DZ.text}};
document.addEventListener('input',e=>{if(e.target&&e.target.dataset&&e.target.dataset.dz&&DZ){DZ.text=e.target.value;const b=document.querySelector('#rscr .rbar .rb');if(b)b.classList.toggle('dis',!DZ.text.trim())}});
A.dzSubmit=()=>{if(DZ.step!=='ans')return;const e=$('#dz_t');if(e)DZ.text=e.value;if(!DZ.text.trim())return toast('先写一下你会怎么回答','');const d=drById(DZ.id);const t=d.turns[DZ.i];const sc=drScore(t,DZ.text);DZ.sc=sc;DZ.step='fb';DZ.log.push({i:DZ.i,text:DZ.text,sc});renderRN()};
A.dzNext=()=>{const d=drById(DZ.id);if(DZ.i+1>=d.turns.length){/* 结算 */
    const tot=drTotal(DZ.log);const ok=tot>=DR_PASS;S.ansLog=S.ansLog||[];S.ansLog.push({mid:ME.mid,q:d.id,kp:d.kp,ok,pick:[],t:today,mode:'drill',score:tot});d.stat.n++;d.stat.sum+=tot;if(ok)d.stat.pass++;if(DZ.packId&&typeof rxPackOnDrill==='function'){rxPackOnDrill(DZ.packId,tot)}
    if(typeof v23Sync==='function'&&S.ev)v23Sync(ME.mid,d.kp,'drill');
    const r=mRefresh(ME.mid,d.kp);DZ.chg={was:r?r.was:null};DZ.step='end';DZ.end=true;return renderRN()}
  DZ.i++;DZ.step='ans';DZ.text='';DZ.hint=false;DZ.sc=null;renderRN()};
A.dzExit=()=>{DZ=null;R.page='adapt';renderRN()};
A.dzAgain=()=>{const id=DZ.id;DZ=null;dzStart(id)};
function dzStart(id){const d=drById(id);if(!d||!drUsable(d))return toast('这个演练还不能练','err');DZ={id,i:0,step:'intro',text:'',hint:false,sc:null,log:[]};R.page='drill';renderRN()}
A.adDrill=el=>{const k=kp(el.dataset.k);const d=drPick(ME.mid,k.id);if(!d)return toast('这个知识点还没有可练的演练','err');dzStart(d.id)};
A.adDrillId=el=>dzStart(el.dataset.id);
//DR_PART4
