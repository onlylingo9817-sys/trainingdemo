/* ========== 课题池(重新规划):来源 → AI 分析 → 校对 → 定题 → 转学习项目 → 结项回写 ========== */
const ALLKEYS=['新品训','强竞品','政策类','技能类·约试驾','技能类·探需','短板类','新人训','进阶训','入店辅导'];
const ALLR=['华北','华东','华南','西南','华中'];
const TKEYS=['GLC','国补','地补','国地补','问界','极氪','邀约','探需','以旧换新','续航','价格','问候','Model Y','YU7'];
const simKeys=s=>TKEYS.filter(k=>String(s).includes(k));
function similarTo(text,skipId){const ks=simKeys(text);if(!ks.length)return null;return S.topics.find(t=>t.id!==skipId&&t.flow!=='暂不做'&&simKeys(t.title+t.obj).some(k=>ks.includes(k)))||null}
// 语料 badcase 候选聚类(系统出题的原料,按批次)
const POOLS=[[
 {title:'客户提到奔驰 GLC 时,顾问不会讲「同价位」配置折算',desc:'试驾环节客户拿 GLC 对比,顾问多只报价,未解释同价位下的配置差。',scene:'试驾',obj:'奔驰 GLC',sess:1286,stores:312,prov:23,trend:12,sug:{type:'专题训',sub:'强竞品',ind:'I1',kw:'同价位, 配置折算',trig:'奔驰 GLC',base:31,regions:ALLR}},
 {title:'国地补政策口径讲错,客户被误导叠加方式',desc:'外呼中把国补与地补说成不可叠加。',scene:'外呼',obj:'国地补',sess:642,stores:205,prov:11,trend:8,sug:{type:'专题训',sub:'政策类',ind:'I1',kw:'国补, 地补, 叠加',trig:'国地补',base:42,regions:['华东','华南']}},
 {title:'新人试驾环节探需提问不足',desc:'新人试驾中很少主动询问用车场景。',scene:'试驾',obj:'全车型',sess:880,stores:260,prov:15,trend:5,sug:{type:'新人训',sub:'',ind:'I5',kw:'',trig:'',base:77,regions:['华北']}},
 {title:'邀约试驾话术缺少时间选项,邀约→试驾转化低',desc:'外呼邀约时顾问不主动给出具体时间让客户选。',scene:'外呼',obj:'全车型',sess:540,stores:170,prov:12,trend:9,sug:{type:'专题训',sub:'技能类·约试驾',ind:'I2',kw:'这周末, 方便, 预约',trig:'发出邀约',base:38,regions:ALLR}},
 {title:'价格异议处理缺少价值锚点',desc:'客户说“太贵了”后,顾问直接让价。',scene:'展厅',obj:'全车型',sess:410,stores:120,prov:9,trend:-3,sug:{type:'专题训',sub:'短板类',ind:'I3',kw:'',trig:'',base:40,regions:['华东']}},
 {title:'展厅接待首句问候不统一',desc:'区域反馈展厅接待体验。',scene:'展厅',obj:'-',sess:120,stores:38,prov:4,trend:1,sug:{type:'专题训',sub:'短板类',ind:'I3',kw:'',trig:'',base:40,regions:['华北']}},
 {title:'YU7 对比特斯拉 Model Y:续航话术被质疑',desc:'客户质疑续航虚标。',scene:'试驾',obj:'特斯拉 Model Y',sess:95,stores:30,prov:5,trend:2,sug:{type:'专题训',sub:'强竞品',ind:'I1',kw:'实测续航, CLTC',trig:'特斯拉 Model Y',base:31,regions:['华北']}}
],[
 {title:'以旧换新置换补贴讲解不清,客户流失',desc:'客户问置换补贴怎么算,顾问含糊。',scene:'客服',obj:'以旧换新',sess:760,stores:230,prov:14,trend:11,sug:{type:'专题训',sub:'政策类',ind:'I1',kw:'置换补贴, 以旧换新',trig:'以旧换新',base:42,regions:ALLR}},
 {title:'试驾后跟进话术缺失,未约二次到店',desc:'试驾结束没有约下次动作。',scene:'试驾',obj:'全车型',sess:690,stores:190,prov:13,trend:6,sug:{type:'专题训',sub:'技能类·约试驾',ind:'I2',kw:'二次到店, 下周',trig:'完成试驾',base:38,regions:['华东','华南']}},
 {title:'竞品极氪 7X 价格战下报价话术混乱',desc:'顾问对极氪报价反应不一。',scene:'展厅',obj:'极氪 7X',sess:150,stores:42,prov:6,trend:4,sug:{type:'专题训',sub:'强竞品',ind:'I1',kw:'',trig:'极氪 7X',base:31,regions:['华南']}}
]];
const INS_POOL=[
 {id:'I1',tag:'竞品',obj:'问界 M8',title:'竞品攻防:问界 M8 在 17 省与我们对比,战败 312 单',freq:'对比会话 2,140 条',prov:17,sess:2140,stores:410,trend:15,sug:{type:'专题训',sub:'强竞品',ind:'I1',kw:'同价位, 配置折算',trig:'问界 M8',base:31,regions:ALLR}},
 {id:'I2',tag:'竞品',obj:'极氪 7X',title:'竞品攻防:极氪 7X 价格战,华南 6 个区域有解法',freq:'对比会话 980 条',prov:6,sess:980,stores:210,trend:9,sug:{type:'专题训',sub:'强竞品',ind:'I1',kw:'价值对比',trig:'极氪 7X',base:31,regions:['华南']}},
 {id:'I3',tag:'政策',obj:'以旧换新',title:'政策变化:多地以旧换新补贴口径 11/1 起调整',freq:'客户咨询 860 条',prov:11,sess:860,stores:240,trend:12,sug:{type:'专题训',sub:'政策类',ind:'I1',kw:'补贴, 以旧换新',trig:'以旧换新',base:42,regions:ALLR}},
 {id:'I4',tag:'政策',obj:'地补',title:'政策变化:华东 3 省地补叠加规则更新',freq:'客户咨询 430 条',prov:3,sess:430,stores:130,trend:6,sug:{type:'专题训',sub:'政策类',ind:'I1',kw:'地补, 叠加',trig:'地补',base:42,regions:['华东']}}
];

const tipChip=f=>'<span class="tag '+({'新发现':'pri','已采纳':'blue','已闭环':'ok','暂不做':''}[f]||'')+'">'+f+'</span>';
const prio=t=>{const s=Math.round(t.stats.sess/30+t.stats.stores/6+Math.max(0,t.stats.trend)*1.5);return {k:s>=85?'P0':s>=55?'P1':'P2',s}};
const pchip=t=>{const p=prio(t);return '<span class="tag '+(p.k==='P0'?'err':p.k==='P1'?'warn':'')+'" title="优先级分 '+p.s+'">'+p.k+'</span>'};
const canUseT=t=>UI.role.type==='hq'||(UI.role.type==='region'&&((t.sug.regions||[]).includes(UI.role.region)));
const topic=id=>S.topics.find(t=>t.id===id);
const rgTxt=rg=>!rg||rg.length>=5?'全国':rg.join('、');
function thist(t,who,act,note){t.hist.unshift({t:today+' '+new Date().toTimeString().slice(0,5),who,act,note:note||''})}
const meName=()=>UI.role.n.split(' · ')[0]+(UI.role.type==='region'||UI.role.type==='vp'||UI.role.type==='hq'?' '+UI.role.name:'');
function visTopics(){const r=UI.role;return S.topics.filter(t=>r.type!=='region'||(t.sug.regions||[]).includes(r.region)||t.byKey===r.k)}
function mkTopic(c,src,by,byKey,extra){
  const ev=c.sess>=S.cfg.topicSess&&c.stores>=S.cfg.topicStores?'充分':'不足';
  const t=Object.assign({id:'T'+(S.topics.length+1),title:c.title,desc:c.desc||'',src,by,byKey,time:today,scene:c.scene||'试驾',obj:c.obj||'-',st:'已出结论',ev,flow:'新发现',
   stats:{sess:c.sess,stores:c.stores,prov:c.prov||Math.round(c.stores/14),trend:c.trend},sug:JSON.parse(JSON.stringify(c.sug)),
   versions:[{v:1,t:today,ev,sess:c.sess,stores:c.stores}],hist:[],reopen:0,merged:[]},extra||{});
  thist(t,src==='自主提出'?by:src==='对外洞察'?'培训内容生产专员(agent)':'系统',src==='自主提出'?'提出问题':src==='对外洞察'?'转入课题池':'系统出题','证据:会话 '+c.sess+' 条 / 门店 '+c.stores+' 家,AI 结论「证据'+ev+'」');
  S.topics.unshift(t);return t}

/* ---------- 页面:课题池(辅助工具:发现问题、分析问题) ---------- */
function pgTopics(){
  const tabs=['发现的问题','系统出题','对外洞察'];const t=curTab('topics',tabs);let b='';
  if(t==='发现的问题')b=tpList();
  if(t==='系统出题')b=tpBatch();
  if(t==='对外洞察')b=tpInsight();
  return '<div class="ph"><h2>课题池 <span class="hint" style="font-weight:400">辅助工具:帮你发现问题、分析问题;不是新增学习项目的前置步骤</span></h2><button class="btn pri" data-act="newTopic">提出问题</button></div>'+tabsH('topics',tabs)+b;
}
function tpList(){
  const V=visTopics();const q=UI.sel.tq||{};const fl=q.flow===undefined?'新发现':q.flow;const kw=UI.sel.tqs||'';
  const cnt=f=>V.filter(t=>t.flow===f).length;
  let h='';
  if(!V.length){
    h+='<div class="card"><h3>这里有什么?</h3><div style="line-height:1.9">系统和 AI 帮你找出「哪里值得培训」,你看一眼、觉得有用就一键「生成内容」(话术 / 课程),再把定稿的内容做成学习任务或上架零售通;不需要也可以忽略,直接去「内容管理」或「学习任务」。<ul style="margin-left:18px"><li><b>系统出题</b>:每双周从汽车语料里自动找出顾问反复做不好的地方(如客户提到竞品时不会讲)。</li><li><b>对外洞察</b>:竞品、政策的最新变化,由 agent 整理。</li><li><b>你自己提</b>:发现了问题,写一两句,AI 帮你分析有多普遍。</li></ul></div></div>'
     +'<div class="grid g3"><div class="card"><h3>1. 看系统出题</h3><div class="hint" style="min-height:40px">从语料里自动聚类,达到阈值(会话 ≥ '+S.cfg.topicSess+'、门店 ≥ '+S.cfg.topicStores+')才出题。</div><button class="btn pri" data-act="runBatch">运行本期出题</button></div><div class="card"><h3>2. 看对外洞察</h3><div class="hint" style="min-height:40px">竞品、政策变化,由 agent 提供。</div><button class="btn" data-act="tab" data-k="topics" data-v="对外洞察">去同步洞察</button></div><div class="card"><h3>3. 提一个问题</h3><div class="hint" style="min-height:40px">写标题和一句描述即可,AI 自动分析。</div><button class="btn" data-act="newTopic">提出问题</button></div></div>';
    return h}
  const rows=V.filter(t=>(!fl||t.flow===fl)&&(!kw||t.title.includes(kw)||t.id===kw)&&(!q.src||t.src===q.src)).sort((x,y)=>prio(y).s-prio(x).s);
  h+='<div class="fil"><div style="display:flex;gap:6px">'+['新发现','已采纳','暂不做','已闭环',''].map(f=>'<span class="tag '+(fl===f?'pri':'')+'" style="cursor:pointer;padding:3px 12px;font-size:13px" data-act="tflow" data-f="'+f+'">'+(f||'全部')+' '+(f?cnt(f):V.length)+'</span>').join('')+'</div><input data-wc="tkw" value="'+esc(kw)+'" placeholder="搜索标题 / 编号" style="min-width:180px"><select data-wc="tsel" data-k="src"><option value="">全部来源</option>'+['系统出题','对外洞察','自主提出'].map(o=>'<option '+(q.src===o?'selected':'')+'>'+o+'</option>').join('')+'</select><span class="hint">按优先级排序;P0/P1/P2 由会话数、门店数、近 4 周趋势算出</span></div>';
  h+=rows.length?rows.map(t=>tCard(t)).join(''):cta('这个筛选下没有问题','换个状态看看,或者去「系统出题 / 对外洞察」产生新的。','');
  return h}
function tCard(t){
  const g=t.sug,s=t.stats,i=ind(g.ind);
  const acts=[];
  if(t.flow==='新发现'||t.flow==='暂不做'){if(canUseT(t)){acts.push('<button class="btn pri sm" data-act="tGenContent" data-id="'+t.id+'">生成内容</button>');acts.push('<button class="btn sm" data-act="tToProject" data-id="'+t.id+'">直接建学习项目</button>')}}
  if(t.flow==='新发现')acts.push('<button class="btn sm" data-act="tSkip" data-id="'+t.id+'">暂不做</button>');
  if(t.flow==='暂不做')acts.push('<button class="btn sm" data-act="tRestore" data-id="'+t.id+'">恢复</button>');
  if(t.flow==='已采纳'&&canUseT(t))acts.push('<button class="btn sm" data-act="tGenContent" data-id="'+t.id+'">再生成内容</button>');
  if((t.flow==='已采纳'||t.flow==='已闭环')&&t.proj)acts.push('<button class="btn sm" data-act="go" data-p="detail" data-id="'+t.proj+'">查看项目</button>');
  return '<div class="card" style="padding:14px 18px"><div style="display:flex;gap:12px;align-items:flex-start"><div style="flex:1;min-width:0"><div>'+pchip(t)+' <a class="link" style="font-weight:600;font-size:15px;margin-right:6px" data-act="topicOpen" data-id="'+t.id+'">'+esc(t.title)+'</a> '+tipChip(t.flow)+(t.reopen?' <span class="tag warn">回炉 ×'+t.reopen+'</span>':'')+'</div>'
   +'<div class="hint" style="margin:6px 0">'+esc(t.desc||'')+'</div>'
   +'<div style="font-size:13px;line-height:1.9">'+(t.st==='分析中'?'<span class="tag blue">AI 分析中…</span>':t.st==='分析失败'?'<span class="tag err">AI 分析失败</span> <a class="link" data-act="tRetry" data-id="'+t.id+'">重试</a>':'<b>'+s.sess+'</b> 条会话 · <b>'+s.stores+'</b> 家门店 · 近 4 周 <b style="color:'+(s.trend>0?'var(--err)':'var(--ok)')+'">'+(s.trend>0?'↑':'↓')+Math.abs(s.trend)+'%</b> '+(t.ev==='不足'?'<span class="tag warn">证据偏少</span>':'<span class="tag ok">证据充分</span>')+'<br><span class="hint">AI 建议:</span>'+g.type+(g.sub?' · '+g.sub:'')+',看「'+(i?i.name:'-')+'」'+(g.kw?',关键词 '+esc(g.kw):'')+(g.regions?',区域 '+rgTxt(g.regions):''))+'</div>'
   +'<div class="hint" style="margin-top:4px"><span class="tag '+({'系统出题':'pri','自主提出':'blue','对外洞察':'warn'}[t.src])+'">'+t.src+'</span> '+esc(t.by)+' · '+t.time+(t.proj?' · 关联项目 <a class="link" data-act="go" data-p="detail" data-id="'+t.proj+'">'+t.proj+'</a>':'')+((t.cids||[]).length?' · 已生成内容 '+t.cids.map(id=>'<a class="link" data-act="cView" data-id="'+id+'">'+id+'</a>').join('、'):'')+'</div></div><div style="display:flex;flex-direction:column;gap:6px;flex:none">'+acts.join('')+'<button class="btn sm" data-act="topicOpen" data-id="'+t.id+'">看分析</button></div></div></div>';}
A.tflow=el=>{(UI.sel.tq||(UI.sel.tq={})).flow=el.dataset.f;render()};
A.tsel=el=>{const q=UI.sel.tq||(UI.sel.tq={});if(el.value)q[el.dataset.k]=el.value;else delete q[el.dataset.k];render()};
A.tkw=el=>{UI.sel.tqs=el.value;const p=el.selectionStart;render();const e=document.querySelector('[data-wc=tkw]');if(e){e.focus();e.setSelectionRange(p,p)}};
