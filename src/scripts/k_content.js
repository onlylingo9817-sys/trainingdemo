/* ========== 内容中心(生产侧):沿用现有「内容管理」的表单与字段;内容状态与上架状态分开 ==========
   内容状态:草稿 → 审核中 → 已定稿(可归档);上架状态(零售通发布):未上架 / 待上架 / 已上架 / 已下架 */
const KINDS=['话术','课程'];
const CTYPES=['图文','视频','PDF','外部链接'];
const CSTATE=['草稿','审核中','已定稿','已归档'];
const PSTATE=['未上架','待上架','已上架','已下架'];
const CATS=['知识库','销售技巧','产品知识','政策竞品'];
const CHANS=['汽车销售','汽车交付','汽车服务'];
const LECTURERS=['王磊','李娜','陈刚'];
const ASSET_KINDS=['视频','PDF','PPT','音频','图片','外部链接'];
const FMT_NEW=['PPT','音频'];
const KIND_META={话术:{c:'#ff6700',ph:'如:客户拿奔驰 GLC 对比说“你们更贵”时,顾问能先认同、再折算配置、最后引导体验'},课程:{c:'#2b6fe0',ph:'如:让新人 30 分钟内讲清国补与地补的叠加规则'}};
const kindTag=k=>'<span class="tag" style="background:'+KIND_META[k].c+'1a;color:'+KIND_META[k].c+'">'+k+'</span>';
const cchip=t=>'<span class="tag '+({审核中:'warn',已定稿:'blue',已归档:''}[t]||'')+'">'+t+'</span>';
const pubchip=t=>'<span class="tag '+({待上架:'warn',已上架:'ok',已下架:'err'}[t]||'')+'">'+t+'</span>';
const ORIGIN_CLS={'AI 生成':'pri','线下资料导入':'blue','手工编写':'','学堂现有':'','复制自':'warn'};
const SPIN_K=['S','P','I','N'];
const SPIN_M={S:['情境','#2b6fe0'],P:['痛点','#e8830c'],I:['影响','#e5484d'],N:['需求-收益','#12a36b']};
const hlx=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<mark class="hl">$1</mark>');
const spinPlain=sp=>SPIN_K.filter(k=>((sp||{})[k]||'').trim()).map(k=>k+'：'+sp[k].replace(/\*\*/g,'').trim()).join('\n');
function spinHtml(sp,rn){sp=sp||{};return '<div class="spin'+(rn?' rn':'')+'">'+SPIN_K.map(k=>{const t=(sp[k]||'').trim();return '<div class="sr"><div class="sh" style="color:'+SPIN_M[k][1]+'"><b>'+k+'</b><small>'+SPIN_M[k][0]+'</small></div><div class="stx">'+(t?hlx(t):'<span class="hint">(未填写)</span>')+'</div></div>'}).join('')+'</div>'}
function rnBody(kind,b){b=b||{};if(kind==='话术'&&b.spin)return spinHtml(b.spin,1);return bodyLines(kind,b).map((x,i)=>'<div>'+(kind==='话术'?(i+1)+'. ':'')+esc(x)+'</div>').join('')}
const originTag=c=>'<span class="tag '+(ORIGIN_CLS[String(c.origin).split(' ')[0]]||'')+'">'+esc(c.origin)+'</span>';
const visC=c=>UI.role.type==='hq'||UI.role.type==='boss'||c.vis==='全国'||(UI.role.type==='region'&&(c.vis.includes(UI.role.region)||c.cK===UI.role.k));
const visCR=c=>c.vis==='全国'||c.vis.includes(ME.region);
const canEditC=c=>UI.role.type==='hq'||c.cK===UI.role.k;
const usedBy=id=>S.projects.filter(p=>(p.nodes||[]).some(x=>x.contentId===id));
const contentUse=id=>usedBy(id).length;
const usableC=c=>c.st==='已定稿';
const pubOf=c=>c.pubSt||'未上架';
const isPub=c=>pubOf(c)=='已上架';
const dRate=c=>c.up+c.down>0?c.down/(c.up+c.down)*100:0;
const dHigh=c=>c.up+c.down>0&&dRate(c)>=S.cfg.dislikeTh;
const hitOf=c=>!c.script||S.cfg.asrNow<S.cfg.asr?null:(c.hit!=null?c.hit:16+hsh(c.id)%34);
const hitLow=c=>{const h=hitOf(c);return h!=null&&contentUse(c.id)>0&&h<S.cfg.hitTh};
const expDays=c=>c.expire?Math.round((new Date(c.expire+'T00:00:00')-D0)/864e5):null;
const expState=c=>!c.expire?'长期':expDays(c)<0?'已过期':expDays(c)<=S.cfg.expWarn?'即将到期':'有效';
const verdictC=c=>contentUse(c.id)===0?'未使用':dHigh(c)?'点踩偏高':hitLow(c)?'命中偏低':'正常';
const cShort=n=>String(n||'').replace('总部培训部 ','').replace('(区域老师)','');
const meShort=()=>UI.role.n.split(' · ')[0]+' '+UI.role.name;
const meFull=()=>UI.role.name+(UI.role.type==='region'?'(区域老师)':'(总部培训部)');
function chist(c,act,note,who){c.hist.unshift({t:today+' '+new Date().toTimeString().slice(0,5),who:who||meShort(),act,note:note||''})}
const nextCid=()=>'N'+(Math.max(0,...S.contents.map(c=>+String(c.id).replace(/\D/g,'')||0))+1);
const snapOf=c=>JSON.parse(JSON.stringify({title:c.title,body:c.body||{},kw:c.kw||'',type:c.type}));
const isPolicy=o=>/国补|地补|以旧换新|补贴|政策/.test((o.subject||'')+(o.title||''));
const spl=s=>String(s||'').split('\n').map(x=>x.trim()).filter(Boolean);
function bodyLines(kind,b){b=b||{};if(kind==='话术'&&b.spin)return SPIN_K.filter(k=>(b.spin[k]||'').trim()).map(k=>k+'：'+b.spin[k].trim());return kind==='话术'?spl(b.lines):spl(b.outline)}
const catOf=o=>/国补|地补|以旧换新|补贴|政策|GLC|问界|极氪|Model Y|竞品/.test((o.subject||'')+(o.title||''))?'政策竞品':/YU7|产品|参数/.test((o.subject||'')+(o.title||''))?'产品知识':'销售技巧';
function cEnsure(c){
  if(!c.kps)c.kps=[];if(!c.assets)c.assets=[];if(!c.refs)c.refs=[];if(!c.hist)c.hist=[];if(!c.body)c.body={};
  if(!c.origin)c.origin=c.orig?'学堂现有':c.srcTag?'AI 生成':'手工编写';
  if(c.subject===undefined){const k=typeof CK!=='undefined'&&CK[cKeyOf((c.title||'')+(c.kw||'')+(c.desc||''))];c.subject=k?k[0]:'通用'}
  if(!c.scene)c.scene=((c.body.scene||'').match(/试驾|外呼|展厅|客服/)||['不限'])[0];
  if(!c.ability)c.ability=/价格|让价/.test(c.title)?'顾虑解除':/探需/.test(c.title)?'探需':'场景化讲车';
  if(!c.car)c.car='通用车型';if(!c.theme)c.theme='';if(!c.aud)c.aud='全员';if(c.expire===undefined)c.expire='';if(c.source===undefined)c.source='';
  /* 旧数据迁移:原来的「待发布/已发布/已下架」= 内容已定稿 + 对应的上架状态 */
  if(c.pubSt===undefined){c.pubSt=c.st==='已发布'?'已上架':c.st==='待发布'?'待上架':c.st==='已下架'?'已下架':'未上架';if(['待发布','已发布','已下架'].includes(c.st))c.st='已定稿';if(c.pubSt==='已上架'||c.pubSt==='已下架')c.pubVer=c.pubVer||1;}
  if(!c.cat)c.cat=catOf(c);if(!c.chan)c.chan=['汽车销售'];if(!c.publishType)c.publishType='立即发布';if(c.publishTime===undefined)c.publishTime='';
  if(!c.cover)c.cover='默认封面.png';if(!c.tags)c.tags=[];if(c.authority===undefined)c.authority=0;if(!c.lecturer)c.lecturer=LECTURERS[0];if(c.enabled===undefined)c.enabled=1;
  if(!c.views)c.views=(c.up||0)*7+hsh(c.id)%40;
  if(!c.vers)c.vers=c.st==='已定稿'?[{v:c.ver,t:c.created||today,who:c.creator||'',note:c.orig?'学堂现有内容并入':'审核通过',snap:snapOf(c)}]:[];
  return c}
const qIn=o=>Object.assign({lecturer:LECTURERS[0],cover:'导入默认封面.png',chan:['汽车销售'],link:''},o);
function qcheck(o){
  const hard=[],soft=[];const kind=o.kind,b=o.body||{};const L=bodyLines(kind,b);const type=o.type||o.fmt||'图文';
  if(!(o.title||'').trim())hard.push('请输入课程标题');
  if(!(o.lecturer||'').trim())hard.push('请选择课程讲师');
  if(!(o.cover||'').trim())hard.push('请上传封面图(324×220,JPG / PNG)');
  if(!(o.chan||[]).length)hard.push('请选择可见范围');
  if(type==='外部链接'&&!/^https?:\/\//.test(o.link||''))hard.push('请填写链接地址');
  if(type==='视频'&&!(o.assets||[]).some(a=>a.kind==='视频'))hard.push('请上传视频文件(mp4 / mov)');
  if(type==='PDF'&&!(o.assets||[]).some(a=>a.kind==='PDF'))hard.push('请上传 PDF 文件');
  if(type==='图文'&&!L.length)hard.push('请输入内容');
  if(isPolicy(o)){if(!o.expire)hard.push('政策类内容必须填写有效期');if(!(o.source||'').trim())hard.push('政策类内容必须填写出处(文件名 / 文号 / 链接)')}
  if(kind==='话术'&&!(o.kw||'').trim())hard.push('话术必须有关键词组(用于「关键词开口率」)');
  const txt=L.join(' ');const hit=S.cfg.banned.filter(w=>w&&txt.includes(w));
  if(hit.length)soft.push('含绝对化 / 高风险用词:'+hit.join('、')+'(建议改成「以最新政策为准」等表述)');
  if(kind==='话术'&&!o.expire&&!isPolicy(o))soft.push('没设有效期:价格、竞品类话术建议设置,避免过期还在被使用');
  if(kind==='话术'&&b.spin){const miss=SPIN_K.filter(k=>!(b.spin[k]||'').trim());if(miss.length&&miss.length<4)soft.push('SPIN 还缺 '+miss.join(' / ')+' 段(建议四段齐全:情境 → 痛点 → 影响 → 需求-收益)');if((b.spin.I||'').trim()&&!/\*\*/.test(b.spin.I))soft.push('「影响」段没有加亮关键短语,建议把客户最在意的后果加亮,一线扫一眼就能抓住重点')}
  if(kind==='话术'&&!b.spin&&L.some(x=>x.length>60))soft.push('有话术单句超过 60 字,一线不好记,建议拆句');
  if(isPolicy(o)&&expState(o)==='已过期')soft.push('政策类内容已过有效期,上架前请先续期');
  return {hard,soft}}
function cSweep(){
  S.contents.forEach(c=>{if(c.pubSt==='已上架'&&c.expire&&c.expire<today){c.pubSt='已下架';c.pubBack={reason:'已到有效期('+c.expire+'),系统自动下架',t:today,who:'系统'};chist(c,'到期自动下架','有效期 '+c.expire,'系统');notify('内容「'+c.title+'」已到有效期,已从零售通下架,请续期或改版')}});
  S.contents.forEach(c=>{if(c.pubSt==='待上架'&&c.publishType==='定时发布'&&c.publishTime&&c.publishTime.slice(0,10)<=today){c.pubSt='已上架';c.pubVer=c.ver;c.pubAt=c.publishTime.slice(0,16);chist(c,'定时上架到零售通','计划 '+c.publishTime,'系统');notify('内容「'+c.title+'」已按计划上架到零售通')}});
}
const fbOf=id=>S.feedback.filter(f=>f.cid===id);
const fbOpen=()=>S.feedback.filter(f=>f.st==='待处理'&&(UI.role.type==='hq'||(content(f.cid)&&canEditC(content(f.cid)))));
function effOf(id){const P=usedBy(id).filter(p=>p.eff&&!smallNow(p));return P.length?Math.round(P.reduce((a,p)=>a+Math.min(120,pct(p)),0)/P.length):null}
function aiAdopt(c){const a=c.aiLines||[];if(!a.length)return null;const f=bodyLines(c.kind,c.body);return Math.round(a.filter(x=>f.includes(x)).length/a.length*100)}
const reuseRate=()=>{const multi=S.contents.filter(c=>contentUse(c.id)>=2);const used=S.contents.filter(c=>contentUse(c.id)>0);return used.length?Math.round(multi.length/used.length*100):0};
const NEW='<span class="tag pri" style="margin-left:4px;padding:0 6px">新</span>';
/* 课题进度(由它生产的内容决定) */
function topicContentState(t){const cs=(t.cids||[]).map(content).filter(Boolean);if(!cs.length)return {k:'待生产',c:0};if(cs.some(c=>contentUse(c.id)>0))return {k:'已落地',c:cs.length};if(cs.some(c=>c.st==='已定稿'))return {k:'已有内容',c:cs.length};if(cs.some(c=>c.st==='审核中'))return {k:'生产中',c:cs.length};return {k:'草稿中',c:cs.length}}

/* ---------- 内容中心:页签 ---------- */
const CTABS=['全部内容','导入','使用与反馈'];
function cChain(){
  const V=S.contents.filter(visC);const c=s=>V.filter(x=>x.st===s).length;const used=V.filter(x=>contentUse(x.id)>0).length;
  const steps=[['草稿','AI 生成 / 导入 / 手工,人来编辑',c('草稿'),{st:'草稿'}],['审核中','审核人(默认本人)',c('审核中'),{st:'审核中'}],['已定稿','可被学习任务引用(不要求上架)',c('已定稿'),{st:'已定稿'}],['被学习任务引用','按版本锁定,可灰度',used,{used:1}],['上架到零售通','已上架 / 待上架',V.filter(x=>['已上架','待上架'].includes(pubOf(x))).length,{pub:1}],['回炉 / 归档','改版、归档、到期下架',c('已归档'),{st:'已归档'}]];
  return '<div class="chain" style="margin-bottom:14px">'+steps.map((s,i)=>'<div class="cn" data-act="cflt" data-q=\''+JSON.stringify(s[3])+'\'><div class="n '+(s[2]?'':'z')+'" style="font-size:20px">'+s[2]+'</div><b>'+s[0]+'</b><div class="w">'+s[1]+'</div></div>'+(i<5?'<div class="arrow">→</div>':'')).join('')+'</div>'}
A.cflt=el=>{UI.sel.cq=JSON.parse(el.dataset.q||'{}');UI.sel.cqs='';UI.sel.cadv=true;UI.tab.content='全部内容';render()};
A.cqset=el=>{const q=UI.sel.cq||(UI.sel.cq={});if(el.value)q[el.dataset.k]=el.value;else delete q[el.dataset.k]};
A.cqkw=el=>{UI.sel.cqs=el.value};
A.cqSearch=()=>render();
A.cqReset=()=>{UI.sel.cq={};UI.sel.cqs='';render()};
function cBtn(c,l,f,cls){return '<button class="link '+(cls||'')+'" data-act="'+f+'" data-id="'+c.id+'">'+l+'</button>'}
function cRowActs(c){
  const a=[];
  if(canEditC(c))a.push(cBtn(c,'编辑','cEdit'));
  if(c.st==='草稿'&&canEditC(c))a.push(cBtn(c,'提交审核','cSubmit'));
  if(c.st==='审核中'&&c.rK===UI.role.k)a.push(cBtn(c,'审核','cReview'));
  if(usableC(c)&&['hq','region'].includes(UI.role.type))a.push(cBtn(c,'做成学习任务','cToProject'));
  if(usableC(c)&&canEditC(c)&&pubOf(c)!=='已上架'&&!['已下架'].includes(pubOf(c)))a.push(cBtn(c,pubOf(c)==='待上架'?'改发布计划':'上架零售通','cPub','pri'));
  if(usableC(c)&&canEditC(c)&&pubOf(c)==='已上架')a.push(cBtn(c,'更新上架','cPub'));
  if(canEditC(c)&&!c.orig&&c.st!=='已定稿')a.push(cBtn(c,'删除','cDel','err'));
  return a.join('')}
function cWork(V){
  const me=UI.role.k;const rows=[];const R=(tag,cls,title,desc,btn)=>rows.push({tag,cls,title,desc,btn});
  V.forEach(c=>{const t='<a class="link" data-act="cView" data-id="'+c.id+'">'+esc(c.title)+'</a> '+kindTag(c.kind);
    if(c.st==='审核中'&&c.rK===me)R('待我审核','warn',t,'审核人是你(默认创建人本人)',cBtn(c,'审核','cReview'));
    if(c.st==='草稿'&&canEditC(c))R('我的草稿','pri',t,'来源:'+c.origin+(c.batch?'('+c.batch+')':'')+';补充后提交审核',cBtn(c,'继续编辑','cEdit'));
    if(usableC(c)&&canEditC(c)&&pubOf(c)==='未上架')R('待上架','blue',t,'已定稿,还没上架到零售通(只经学习任务下发不影响)',cBtn(c,'上架','cPub'));
    if(usableC(c)&&canEditC(c)&&['即将到期','已过期'].includes(expState(c)))R('即将到期','err',t,'有效期 '+c.expire+'(还剩 '+expDays(c)+' 天;到期自动下架)',cBtn(c,'续期','cRenew')+cBtn(c,'改版','cRevise'));
    if(pubOf(c)==='已下架'&&canEditC(c)&&c.pubBack)R('下架待处理','err',t,'原因:'+c.pubBack.reason,cBtn(c,'重新上架','cPub')+(/有效期/.test(c.pubBack.reason)?cBtn(c,'续期','cRenew'):''));
    if(usableC(c)&&canEditC(c)&&['点踩偏高','命中偏低'].includes(verdictC(c)))R('反馈异常','err',t,'「'+verdictC(c)+'」:'+(dHigh(c)?'点踩率 '+dRate(c).toFixed(0)+'%':'语料命中率 '+hitOf(c)+'%')+',建议改版 / 回炉',cBtn(c,'改版','cRevise','err'));
    if(usableC(c)&&canEditC(c)&&contentUse(c.id)===0&&!['即将到期','已过期'].includes(expState(c))&&pubOf(c)==='已上架')R('已上架未被引用','',t,'可做成学习任务',cBtn(c,'做成学习任务','cToProject'));
    if(c.st==='已归档'&&canEditC(c))R('已归档','',t,'归档内容不参与选择;可恢复为定稿',cBtn(c,'恢复','cRestore'));
  });
  /* 课题待生产:已采纳 / 新发现但还没有任何内容的课题 */
  S.topics.filter(t=>visTopics().includes(t)&&['新发现','已采纳'].includes(t.flow)&&!((t.cids||[]).length)).forEach(t=>{const st=topicContentState(t);rows.push({tag:'课题待生产',cls:'pri',title:'<a class="link" data-act="topicOpen" data-id="'+t.id+'">'+esc(t.title)+'</a>',desc:prio(t).k+' · 证据:'+t.stats.sess+' 条会话 / '+t.stats.stores+' 家门店 · '+(t.src||''),btn:'<button class="link pri" data-act="tGenContent" data-id="'+t.id+'">AI 生成内容</button>'})});
  fbOpen().forEach(f=>{const c=content(f.cid);if(!c||!visC(c))return;R(f.type==='纠错'?'一线纠错':'点踩反馈',f.type==='纠错'?'err':'warn','<a class="link" data-act="cView" data-id="'+c.id+'" data-tab="使用与反馈">'+esc(c.title)+'</a>',esc(f.reason||'')+(f.text?':'+esc(f.text):'')+' · '+esc(f.who),'<button class="link" data-act="fbAccept" data-id="'+f.id+'">采纳并改版</button><button class="link" data-act="fbIgnore" data-id="'+f.id+'">忽略</button>')});
  S.cimps.filter(b=>b.st==='待确认'&&b.cK===me).forEach(b=>R('导入待确认','blue','批次 '+b.id+' · '+b.items.length+' 条待确认','来自 '+b.files.map(f=>f.name).slice(0,2).join('、')+(b.files.length>2?' 等':''),'<button class="link" data-act="ciOpen" data-id="'+b.id+'">去确认</button>'));
  if(UI.role.type==='hq')S.contents.filter(c=>c.rec&&c.rec.st==='待总部审核').forEach(c=>R('区域推荐待审核','pri','<a class="link" data-act="cView" data-id="'+c.id+'">'+esc(c.title)+'</a> '+kindTag(c.kind),c.rec.by+' 推荐「'+c.vis+'」内容升为全国可见:'+esc(c.rec.why||''),'<button class="link" data-act="cRecYes" data-id="'+c.id+'">通过</button><button class="link err" data-act="cRecNo" data-id="'+c.id+'">不通过</button>'));
  const ord=['待我审核','区域推荐待审核','导入待确认','课题待生产','一线纠错','点踩反馈','反馈异常','待上架','即将到期','下架待处理','我的草稿','已上架未被引用','已归档'];rows.sort((a,b)=>ord.indexOf(a.tag)-ord.indexOf(b.tag));
  return rows}
function pgContent(){
  cSweep();let t=curTab('content',CTABS);if(t==='内容'||t==='话术与课程(高级)')t='全部内容';let b='';const V=S.contents.filter(visC);
  const canNew=['hq','region'].includes(UI.role.type);
  const head='<div class="ph"><h2>内容中心 <span class="hint" style="font-weight:400">备料:话术、课程、题、演练都在这里造,同一套状态(草稿 → 已定稿)、同样挂知识点。造完去「零售通发布」上架</span></h2><div>'+(canNew?'<button class="btn" data-act="cTab" data-v="导入" style="margin-right:8px">导入内容</button><button class="btn" data-act="cNew" data-ai="1" style="margin-right:8px">AI 生成内容</button><span class="dd2" style="display:inline-block"><button class="btn pri" data-act="cNewMenu">新增 ▾</button></span>':'')+'</div></div>';
  if(t==='全部内容')b=cListU(V);
  if(t==='导入')b=pgImport();
  if(t==='使用与反馈')b=cUsage(V);
  return head+tabsH('content',CTABS)+b}
A.cTab=el=>{UI.tab.content=el.dataset.v||'全部内容';render()};
A.cNewMenu=()=>{openDlg('新增什么?','<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+[['话术','一条一线话术(SPIN 四段)'],['课程','图文 / 视频 / PDF / 外链'],['题','单选 / 多选 / 判断,带解析'],['演练','客户一句 → 学员答 → 评分点评']].map(x=>'<div class="card kp-click" style="cursor:pointer;margin:0;text-align:center" data-act="cNewAny" data-v="'+x[0]+'"><b style="font-size:16px">'+x[0]+'</b><div class="hint" style="margin-top:6px">'+x[1]+'</div></div>').join('')+'</div>','<button class="btn" data-act="close">取消</button>')};
const _cNewAny=A.cNewAny;A.cNewAny=el=>{closeDlg();const k=el.dataset.v;if(k==='题')return A.qNew();if(k==='演练')return A.drNew();A.cNew({dataset:{}});C.kind=k;if(k==='课程')C.type='图文';render()};
/* 简版(caf) ↔ 高级(cq)筛选互通:进入高级时带上简版条件,回简版时带回来 */
A.cafAdv=()=>{const f=UI.sel.caf||{};const q={};if(f.kp)q.kp=f.kp;if(f.st)q.st=f.st;if(f.k==='话术'||f.k==='课程')q.kind=f.k;UI.sel.cq=q;UI.sel.cqs=f.q||'';UI.sel.cadv=true;render()};
A.cafAdvOff=()=>{const q=UI.sel.cq||{};const f=UI.sel.caf||(UI.sel.caf={});if(q.kp)f.kp=q.kp;else delete f.kp;if(q.st)f.st=q.st;else delete f.st;if(q.kind)f.k=q.kind;else if(f.k==='话术'||f.k==='课程')delete f.k;if(UI.sel.cqs)f.q=UI.sel.cqs;else delete f.q;UI.sel.cadv=false;render()};
A.cafAdvToggle=()=>{UI.sel.cadv=!UI.sel.cadv;render()};
function cList(V){
  const q=Object.assign({},UI.sel.cq||{},{tag:(UI.sel.caf||{}).tag});const kw=UI.sel.cqs||'';
  const rows=tagFilterContent(V,q.tag).filter(c=>(!q.kp||(q.kp==='未挂载'?!(c.kps||[]).length:(c.kps||[]).includes(q.kp)))&&(!q.type||c.type===q.type)&&(!q.kind||c.kind===q.kind)&&(!q.car||(c.kind==='话术'&&c.car===q.car))&&(!q.theme||c.theme===q.theme)&&(!q.cat||c.cat===q.cat)&&(!q.st||c.st===q.st)&&(!q.pub||pubOf(c)===q.pub)&&(!q.origin||c.origin.split(' ')[0]===q.origin)&&(!q.exp||expState(c)===q.exp)&&(!q.used||contentUse(c.id)>0)&&(!q.topic||(c.topic||'')===q.topic)&&(!kw||c.title.includes(kw)||c.id===kw||(c.topic||'')===kw)).sort((x,y)=>CSTATE.indexOf(x.st)-CSTATE.indexOf(y.st)||PSTATE.indexOf(pubOf(x))-PSTATE.indexOf(pubOf(y)));
  const so=(k,l,opts,nw)=>'<div class="fi2"><label>'+l+(nw?NEW:'')+'</label><select data-wc="cqset" data-k="'+k+'"><option value="">全部</option>'+opts.map(o=>'<option '+(q[k]===o?'selected':'')+'>'+o+'</option>').join('')+'</select></div>';
  const sortKey=(UI.sel.cqs2||'updated').split(':')[0];const sortDir=(UI.sel.cqs2||'updated:desc').split(':')[1]||'desc';
  const sorted=rows.slice().sort((a,b)=>{const get=x=>sortKey==='use'?contentUse(x.id):sortKey==='down'?dRate(x):sortKey==='expire'?(expDays(x)??99999):(x.updated||x.created||'');const va=get(a),vb=get(b);return (va>vb?1:va<vb?-1:0)*(sortDir==='asc'?1:-1)});
  const pg=lstPage('clist',sorted,20);
  const fil='<div class="card" style="padding:14px 18px"><div class="filg"><div class="fi2"><label>内容标题</label><input data-wc="cqkw" value="'+esc(kw)+'" placeholder="标题 / 内容 ID / 课题编号"></div>'+so('type','内容类型',CTYPES)+so('cat','内容分类',CATS)+so('st','内容状态',CSTATE)+so('pub','上架状态',PSTATE,1)+so('kind','内容性质',KINDS,1)+'<div class="fi2"><label>知识点'+NEW+'</label><select data-wc="cqset" data-k="kp"><option value="">全部</option><option '+(q.kp==='未挂载'?'selected':'')+'>未挂载</option>'+S.kps.map(k=>'<option value="'+k.id+'" '+(q.kp===k.id?'selected':'')+'>'+esc(kpLabel(k))+'</option>').join('')+'</select></div>'+so('car','车型(话术)',S.cfg.tax.car,1)+so('theme','场景分类',S.cfg.tax.theme,1)+so('origin','来源',['AI 生成','线下资料导入','手工编写','学堂现有','复制自'],1)+so('exp','有效期',['即将到期','已过期','有效','长期'],1)+'<div class="fi2" style="align-self:end"><button class="btn pri sm" data-act="cqSearch">查询</button> <button class="btn sm" data-act="cqReset">重置</button></div></div></div>';
  const tool='<div class="filg" style="margin:0 0 8px"><div class="fi2"><label>排序</label><select data-wc="cqs2"><option value="updated:desc" '+(UI.sel.cqs2==='updated:desc'||!UI.sel.cqs2?'selected':'')+'>最近更新</option><option value="updated:asc" '+(UI.sel.cqs2==='updated:asc'?'selected':'')+'>最早更新</option><option value="use:desc" '+(UI.sel.cqs2==='use:desc'?'selected':'')+'>引用次数多</option><option value="down:desc" '+(UI.sel.cqs2==='down:desc'?'selected':'')+'>点踩率高</option><option value="expire:asc" '+(UI.sel.cqs2==='expire:asc'?'selected':'')+'>最快到期</option></select></div><div class="fi2" style="align-self:end">'+lstCsvBtn(['ID','标题','性质','状态','上架','引用','有效期'],[['ID','标题','性质','状态','上架','引用','有效期']].concat(sorted.map(c=>[c.id,c.title,c.kind,c.st,pubOf(c),contentUse(c.id),c.expire||'长期'])),'内容清单')+'</div><div class="fi2" style="align-self:end"><span class="hint">共 '+rows.length+' 条</span></div></div>';
  const picked=lstPicked('clist');
  const batch=picked.length?'<div class="lst-batch"><b>已选 '+picked.length+' 条</b><button class="btn sm" data-act="cBulkSubmit">批量提交审核</button><button class="btn sm" data-act="lstSelAll" data-k="clist" data-ids="'+esc(JSON.stringify(picked))+'" data-clear="1">清空选择</button></div>':'';
  return '<div class="tag-layout">'+tagTreeHtml(q.tag||'',{})+'<div>'+fil+tool+(rows.length?'<div class="tw"><table class="t nw stk"><tr><th style="width:36px"><input type="checkbox" data-act="lstSelAll" data-k="clist" data-ids="'+esc(JSON.stringify(pg.rows.map(c=>c.id)))+'" '+(pg.rows.length&&pg.rows.every(c=>picked.includes(c.id))?'checked':'')+'></th><th>ID</th><th>标题</th><th>性质'+NEW+'</th><th>状态'+NEW+'</th><th>上架'+NEW+'</th><th>引用'+NEW+'</th><th>有效期'+NEW+'</th><th>浏览 / 点赞</th><th>操作</th></tr>'
    +pg.rows.map(c=>{const es=expState(c);const tp=c.topic&&topic(c.topic);return '<tr><td><input type="checkbox" data-act="lstSel" data-k="clist" data-id="'+c.id+'" '+(picked.includes(c.id)?'checked':'')+'></td><td>'+c.id+'</td><td style="white-space:normal;min-width:250px;max-width:320px"><a class="link" data-act="cView" data-id="'+c.id+'">'+esc(c.title)+'</a><div class="hint">v'+c.ver+' · '+(c.kind==='话术'&&c.car?esc(c.car):esc(c.type))+' · '+esc(cShort(c.creator))+(tp?' · 课题 <a class="link" data-act="topicOpen" data-id="'+tp.id+'">'+tp.id+'</a>':'')+(c.st==='审核中'?' · 审核人 '+esc(cShort(c.rName||c.creator)):'')+(c.st==='已归档'?' · 已归档':'')+'</div>'+(c.st==='审核中'&&c.rName?'':'')+'</td><td>'+kindTag(c.kind)+'</td><td>'+(typeof cchipRv==='function'?cchipRv(c):cchip(c.st))+'</td><td>'+pubchip(pubOf(c))+(pubOf(c)==='待上架'&&c.publishTime?'<div class="hint">'+esc(c.publishTime)+'</div>':'')+(pubOf(c)==='已上架'&&c.pubVer<c.ver?'<div class="hint" style="color:var(--warn)">有新版 v'+c.ver+'</div>':'')+(pubOf(c)==='已下架'?'<div class="hint">已下架</div>':'')+'</td><td>'+contentUse(c.id)+' 处</td><td>'+(es==='长期'?'<span class="hint">长期</span>':'<span style="'+(es==='即将到期'?'color:var(--warn)':es==='已过期'?'color:var(--err)':'')+'">'+c.expire+'</span>')+'</td><td>'+(c.views||0)+' / '+c.up+(dHigh(c)?' <span class="tag err">点踩高</span>':'')+'</td><td>'+cRowActs(c)+'</td></tr>'}).join('')+'</table></div>'+lstPager('clist',pg)+batch+'<div class="hint" style="margin:8px 4px">共 条。带「新」的列是本次新增;内容状态与上架状态分开管,细节在内容详情里看。</div>'
    :cta('没有符合条件的内容','调整上面的筛选,或「新增内容」/「AI 生成内容」/「导入内容」。','<button class="btn pri" data-act="cNew">新增内容</button>'))+'</div></div>'}
function cUsage(V){
  const inbox=S.feedback.filter(f=>{const c=content(f.cid);return c&&visC(c)}).sort((a,b)=>a.st==='待处理'?-1:1);
  const uf=UI.sel.useF||(UI.sel.useF={});
  const rows=V.filter(c=>c.st==='已定稿'||pubOf(c)!=='未上架').filter(c=>contentUse(c.id)>0||c.up+c.down>0)
    .filter(c=>!uf.verdict||(uf.verdict==='需改版'?(dHigh(c)||hitLow(c)):(!dHigh(c)&&!hitLow(c))))
    .filter(c=>{if(!uf.dr)return true;const r=dRate(c);return uf.dr==='≥25%'?r>=25:uf.dr==='10-25%'?(r>=10&&r<25):r<10})
    .filter(c=>!uf.proj||usedBy(c.id).some(p=>p.id===uf.proj));
  return srcBar('每条内容的使用情况:被哪些学习项目引用(含灰度、锁定的版本),点赞 / 点踩及原因、纠错来自零售通学员,语料命中率来自汽车语料(只对话术),平均达成来自引用它的已评估项目。预警线在「配置中心 → 阈值与口径」。')
   +'<div class="card"><h3>一线反馈收件箱 <span class="hint">点踩原因与纠错;采纳 = 进入改版,忽略 = 记录不处理</span></h3>'+(inbox.length?'<table class="t"><tr><th>时间</th><th>内容</th><th>类型</th><th>原因 / 内容</th><th>来自</th><th>状态</th><th></th></tr>'+inbox.map(f=>{const c=content(f.cid);return '<tr><td>'+f.t+'</td><td><a class="link" data-act="cView" data-id="'+c.id+'">'+esc(c.title)+'</a></td><td><span class="tag '+(f.type==='纠错'?'err':'warn')+'">'+f.type+'</span></td><td style="white-space:normal;max-width:300px">'+esc(f.reason||'')+(f.text?':'+esc(f.text):'')+'</td><td>'+esc(f.who)+'</td><td>'+(f.st==='待处理'?'<span class="tag warn">待处理</span>':'<span class="tag">'+f.st+'</span>')+'</td><td style="white-space:nowrap">'+(f.st==='待处理'&&canEditC(c)?'<button class="link" data-act="fbAccept" data-id="'+f.id+'">采纳并改版</button><button class="link" data-act="fbIgnore" data-id="'+f.id+'">忽略</button>':'')+'</td></tr>'}).join('')+'</table>':'<div class="hint">暂无反馈。学员在零售通学习任务里点「没用」选原因、或点「内容有误」纠错,会进到这里。</div>')+'</div>'
   +'<div class="card"><h3>内容使用与效果</h3>'
   +'<div class="fil" style="margin-bottom:8px"><select data-wc="useF" data-k="verdict"><option value="">全部判定</option>'+['需改版','正常'].map(v=>'<option '+(uf.verdict===v?'selected':'')+'>'+v+'</option>').join('')+'</select>'
   +'<select data-wc="useF" data-k="dr"><option value="">全部点踩率</option>'+['<10%','10-25%','≥25%'].map(v=>'<option '+(uf.dr===v?'selected':'')+'>'+v+'</option>').join('')+'</select>'
   +'<select data-wc="useF" data-k="proj"><option value="">全部项目</option>'+visibleP().map(pr=>'<option '+(uf.proj===pr.id?'selected':'')+'>'+esc(pr.name)+'</option>').join('')+'</select>'
   +'<span class="hint">共 '+rows.length+' 条</span><span style="flex:1"></span>'
   +lstCsvBtn(['内容','性质','引用项目','点赞','点踩','点踩率','判定'],[['内容','性质','引用项目','点赞','点踩','点踩率','判定']].concat(rows.map(c=>[c.title,c.kind,usedBy(c.id).length,c.up,c.down,Math.round(dRate(c)),verdictC(c)])),'内容使用与反馈')
   +'</div>'
   +(rows.length?'<div class="tw"><table class="t nw"><tr><th>内容</th><th>性质</th><th>引用的学习项目(锁定版本)</th><th>点赞 / 点踩</th><th>点踩率</th><th>语料命中率'+ds('汽车语料')+'</th><th>平均达成</th><th>判定</th><th>操作</th></tr>'+rows.map(c=>{const u=usedBy(c.id);const v=verdictC(c);const h=hitOf(c);const ef=effOf(c.id);return '<tr><td style="white-space:normal;max-width:240px"><a class="link" data-act="cView" data-id="'+c.id+'">'+esc(c.title)+'</a><div class="hint">'+c.id+' · v'+c.ver+' · '+c.st+' · '+pubOf(c)+'</div></td><td>'+kindTag(c.kind)+'</td><td style="white-space:normal">'+(u.length?u.map(p=>{const n=p.nodes.find(x=>x.contentId===c.id);return '<div><a class="link" data-act="go" data-p="detail" data-id="'+p.id+'">'+esc(p.name)+'</a> <span class="hint">v'+(n.contentVer||1)+'</span>'+(p.gray&&p.gray.stage==='灰度中'?' <span class="tag blue">灰度中</span>':'')+'</div>'}).join(''):'<span class="hint">未被引用</span>')+'</td><td>'+c.up+' / '+c.down+'</td><td>'+(c.up+c.down>0?'<span style="color:'+(dHigh(c)?'var(--err)':'inherit')+'">'+dRate(c).toFixed(1)+'%</span>':'—')+'</td><td>'+(c.script?(S.cfg.asrNow<S.cfg.asr?'<span class="tag warn">数据暂缺</span>':'<span style="color:'+(hitLow(c)?'var(--err)':'inherit')+'">'+h+'%</span>'):'—')+'</td><td>'+(ef==null?'<span class="hint">无已评估项目</span>':ef+'%')+'</td><td><span class="tag '+(v==='正常'?'ok':v==='未使用'?'':'err')+'">'+v+'</span></td><td>'+(usableC(c)&&canEditC(c)&&v!=='正常'&&v!=='未使用'?cBtn(c,'改版','cRevise','err'):'')+'</td></tr>'}).join('')+'</table></div>':'<div class="hint">内容被学习任务引用、学员在零售通点赞 / 点踩后,这里才有数据。</div>')+'</div>'}
A.fbAccept=el=>{const f=S.feedback.find(x=>x.id===el.dataset.id);const c=content(f.cid);f.st='已采纳';chist(c,'采纳一线反馈',f.type+':'+(f.reason||'')+(f.text?'—'+f.text:''));if(usableC(c)){c.st='草稿';c.ver++;chist(c,'改版 v'+c.ver,'依据一线反馈修改;已引用它的项目继续使用已锁定版本,已上架的保持原版本直到更新上架')}else{c.st='草稿';c.ver++;chist(c,'改版 v'+c.ver,'依据一线反馈修改')}toast('已采纳,进入改版(v'+c.ver+')','ok');A.cEdit({dataset:{id:c.id}})};
A.fbIgnore=el=>{const f=S.feedback.find(x=>x.id===el.dataset.id);f.st='已忽略';chist(content(f.cid),'忽略一线反馈',f.reason||'');toast('已忽略','ok');render()};
A.cDel=el=>{const c=content(el.dataset.id);if(contentUse(c.id))return toast('已被学习项目引用,不能删除;可改为归档','err');if(pubOf(c)!=='未上架')return toast('已上架 / 待上架的内容不能删除,请先下架','err');S.contents.splice(S.contents.indexOf(c),1);toast('已删除','ok');render()};

/* ---------- 内容详情(整页) ---------- */
const DTABS=['内容','发布到零售通','版本','使用与反馈','关联'];
A.cView=el=>{closeDlg();UI.cid=el.dataset.id;UI.ctab=DTABS.includes(el.dataset.tab)?el.dataset.tab:'内容';UI.page='cdetail';render();$('#main').scrollTop=0};
A.cdtab=el=>{UI.ctab=el.dataset.v;render()};
function cBodyHtml(c,snap){
  const b=snap?snap.body:(c.body||{});const kw=snap?snap.kw:c.kw;
  if(c.kind==='话术'&&b.spin)return '<div class="cb-scene"><span>使用场景</span>'+esc(b.scene||'-')+'</div>'+spinHtml(b.spin)+'<div class="cb-kw"><span>关键词组</span>'+String(kw||'').split(/[,，、]\s*/).filter(Boolean).map(x=>'<i>'+esc(x)+'</i>').join('')+'</div>';
  if(c.kind==='话术')return '<dl class="kv"><dt>使用场景</dt><dd>'+esc(b.scene||'-')+'</dd><dt>话术</dt><dd>'+spl(b.lines).map((x,i)=>'<div>'+(i+1)+'. '+esc(x)+'</div>').join('')+'</dd><dt>关键词组</dt><dd>'+esc(kw||'-')+'</dd></dl>';
  return '<dl class="kv"><dt>'+((snap?snap.type:c.type)==='图文'?'内容':'课程简介')+'</dt><dd>'+spl(b.outline).map(x=>'<div>'+esc(x)+'</div>').join('')+'</dd></dl>'}
function diffHtml(a,b){const A_=new Set(a),B_=new Set(b);return a.filter(x=>!B_.has(x)).map(x=>'<div style="background:#fdecec;color:#b42318;text-decoration:line-through;padding:2px 8px;margin:2px 0;border-radius:4px">'+esc(x)+'</div>').join('')+b.map(x=>A_.has(x)?'<div style="padding:2px 8px;margin:2px 0;color:#667085">'+esc(x)+'</div>':'<div style="background:#e8f8f1;color:#087443;padding:2px 8px;margin:2px 0;border-radius:4px">+ '+esc(x)+'</div>').join('')}
function cActions(c){
  const B=(l,a,cls)=>'<button class="btn '+(cls||'')+'" data-act="'+a+'" data-id="'+c.id+'">'+l+'</button>';let h='';
  if(c.st==='草稿'&&canEditC(c))h+=B('提交审核','cSubmit','pri');
  if(c.st==='审核中'&&c.rK===UI.role.k)h+=B('审核','cReview','pri');
  if(usableC(c)){
    if(['hq','region'].includes(UI.role.type))h+=B('做成学习任务','cToProject','pri');
    if(canEditC(c)&&pubOf(c)!=='已上架')h+=B(pubOf(c)==='待上架'?'改发布计划':'上架零售通','cPub');
    if(canEditC(c)&&pubOf(c)==='已上架')h+=B('更新上架','cPub');
    if(canEditC(c)&&pubOf(c)==='已上架')h+=B('下架','cUnpub','err');
  }
  if(canEditC(c)&&c.st!=='审核中')h+=B('编辑','cEdit');
  if(usableC(c)&&canEditC(c))h+=B('改版(新版本)','cRevise')+B(c.expire?'续期':'设置有效期','cRenew');
  if(['hq','region'].includes(UI.role.type)&&(c.vis==='全国'||!canEditC(c)))h+=B('复制并属地化','cCopy');
  if(UI.role.type==='region'&&usableC(c)&&canEditC(c)&&c.vis!=='全国'&&!(c.rec&&c.rec.st==='待总部审核'))h+=B('推荐到全国','cRec');
  if(typeof rvStartBtn==='function')h+=rvStartBtn('content',c.id);
  if(canEditC(c)&&c.st==='已定稿')h+=B('归档','cArchive');
  if(c.st==='已归档'&&canEditC(c))h+=B('恢复到定稿','cRestore','pri');
  return h}
function pgContentDetail(){
  cSweep();const c=content(UI.cid);if(!c||!visC(c)){UI.page='content';return pgContent()}
  const tab=DTABS.includes(UI.ctab)?UI.ctab:'内容';const u=usedBy(c.id);const tp=c.topic&&topic(c.topic);const qc=qcheck(c);
  const es=expState(c);const ad=aiAdopt(c);const fp=fbOf(c.id).filter(f=>f.st==='待处理');let main='';
  let side='';
  if(tab==='内容'){
    const assets=(c.assets||[]).length?'<div class="card"><h3>附件素材 <span class="hint">'+c.assets.length+' 个</span></h3><table class="t">'+c.assets.map(a=>'<tr><td>'+esc(a.name)+'</td><td><span class="tag">'+a.kind+'</span>'+(FMT_NEW.includes(a.kind)?' <span class="tag warn">需学堂新增上传</span>':'')+'</td><td>'+esc(a.size||'-')+'</td><td class="hint">'+esc(a.note||'')+'</td></tr>').join('')+'</table></div>':'';
    main=(typeof rvPanel==='function'?rvPanel('content',c.id):'')+'<div class="card cbody"><div class="cbody-h"><h3>正文'+(c.kind==='话术'&&c.body&&c.body.spin?' <span class="tag blue">SPIN 话术</span>':'')+'</h3><div class="cbody-a">'+(c.kind==='话术'?'<button class="btn sm" data-act="cCopyTxt" data-id="'+c.id+'">复制话术</button>':'')+'<button class="btn sm" data-act="cPvRn" data-id="'+c.id+'">零售通效果</button></div></div>'+cBodyHtml(c)+'</div>'+assets;
    const fbn=fp.length;
    const mini=(l,v,h)=>'<div class="mini"><div class="l">'+l+'</div><div class="v">'+v+'</div>'+(h?'<div class="h">'+h+'</div>':'')+'</div>';
    side='<div class="card sd"><h3>基本信息</h3><dl class="kv sm"><dt>内容性质</dt><dd>'+kindTag(c.kind)+' '+esc(c.type)+'</dd>'
      +(c.kind==='话术'?'<dt>适用车型</dt><dd>'+carChipsHtml(carListOf(c),3)+'</dd>'+(c.theme?'<dt>场景分类</dt><dd>'+esc(c.theme)+'</dd>':''):'')
      +'<dt>知识点</dt><dd>'+kpLinks(c)+((c.kps||[]).length>1?' <span class="hint">'+(c.mainKp?'主讲解:'+(kp(c.mainKp)||{}).name+'；其余为提及':'未区分主讲解')+'</span>':'')+'</dd><dt>主题对象</dt><dd>'+esc(c.subject)+'</dd><dt>环节 / 能力</dt><dd>'+esc(c.scene)+' / '+esc(c.ability)+'</dd><dt>适用人群</dt><dd>'+esc(c.aud)+'</dd><dt>讲师</dt><dd>'+esc(c.lecturer)+'</dd>'
      +'<dt>可见范围</dt><dd>'+esc((c.chan||[]).join('、'))+' · '+esc(c.vis)+'</dd><dt>有效期</dt><dd>'+(c.expire?c.expire+' <span class="tag '+(es==='有效'?'ok':es==='即将到期'?'warn':'err')+'">'+es+'</span>':'长期有效')+'</dd><dt>出处</dt><dd>'+esc(c.source||'-')+'</dd><dt>封面</dt><dd><span class="cov" style="width:44px;height:30px">图</span> <span class="hint">'+esc(c.cover)+'</span></dd></dl></div>'
      +'<div class="card sd"><h3>来源 '+originTag(c)+'</h3><dl class="kv sm"><dt>说明</dt><dd>'+esc(c.srcTag||(c.origin==='线下资料导入'?'线下资料:'+(c.srcFile||'-')+(c.srcDept?'(来自 '+esc(c.srcDept)+')':'')+(c.batch?' · 导入批次 '+c.batch:''):c.origin==='学堂现有'?'学堂原有「内容管理」':'人工编写'))+'</dd>'+(tp?'<dt>课题</dt><dd><a class="link" data-act="topicOpen" data-id="'+tp.id+'">'+tp.id+' '+esc(tp.title)+'</a></dd>':'')+(c.goal?'<dt>生成输入</dt><dd>目标:'+esc(c.goal)+'<br>描述:'+esc(c.desc||'-')+'<br>要求:'+esc(c.req||'-')+'</dd>':'')+((c.refs||[]).length?'<dt>参考素材</dt><dd>'+c.refs.map(r=>'<span class="tag blue" style="margin:0 4px 4px 0">'+esc(r.t)+':'+esc(r.label)+'</span>').join('')+'</dd>':'')+(ad!=null?'<dt>AI 采纳率</dt><dd><b>'+ad+'%</b> <span class="hint">其余为人改 / 新增</span></dd>':'')+'</dl></div>'
      +'<div class="card sd"><h3>应用情况 <a class="link" data-act="cdtab" data-v="使用与反馈" style="font-weight:400;font-size:12px">看详情</a></h3><div class="minis">'+mini('零售通',pubchip(pubOf(c)),isPub(c)?'上架 v'+c.pubVer:'')+mini('学习项目',u.length+' 个',u.length?'已锁定版本引用':'未被引用')+mini('浏览',c.views||0,'')+mini('点赞 / 点踩',c.up+' / '+c.down,fbn?fbn+' 条反馈待处理':'')+'</div></div>'
      +(qc.hard.length||qc.soft.length?'<div class="card sd" style="border-color:#f5d6a8"><h3>质量检查 <span class="hint">硬规则 = 提交前必须补</span></h3>'+qc.hard.map(x=>'<div class="chk must"><b>!</b><span>'+esc(x)+'</span></div>').join('')+qc.soft.map(x=>'<div class="chk rec"><b>·</b><span>'+esc(x)+' <span class="hint">(提醒)</span></span></div>').join('')+'</div>':'<div class="card sd" style="padding:12px 18px"><span class="chk ok" style="margin:0"><b>✓</b><span>质量检查通过</span></span></div>');
  }
  if(tab==='发布到零售通'){
    const pv=c.pubVer||0;const newer=c.ver>pv;
    main='<div class="card"><h3>上架状态 '+pubchip(pubOf(c))+'</h3>'+(usableC(c)?'':'<div class="tag warn" style="display:block;margin-bottom:10px;padding:6px 12px;white-space:normal">内容还没定稿,不能上架。先走完审核。</div>')
     +'<div class="grid g4"><div><div class="hint">上架版本</div><b style="font-size:20px">'+(pv?'v'+pv:'—')+'</b><div class="hint">内容当前 v'+c.ver+'</div></div><div><div class="hint">发布方式</div><b>'+c.publishType+'</b><div class="hint">'+(c.publishTime||'—')+'</div></div><div><div class="hint">内容分类</div><b>'+esc(c.cat)+'</b></div><div><div class="hint">可见范围</div><b>'+esc((c.chan||[]).join('、'))+'</b><div class="hint">'+esc(c.vis)+'</div></div></div>'
     +'<div class="grid g4" style="margin-top:12px"><div><div class="hint">浏览量</div><b>'+(c.views||0)+'</b></div><div><div class="hint">点赞 / 点踩</div><b>'+c.up+' / '+c.down+'</b></div><div><div class="hint">是否推荐</div><b>'+(c.recommend&&c.recommend.on?'是(至 '+esc(c.recommend.until||'-')+')':'否')+'</b></div><div><div class="hint">是否权威</div><b>'+(c.authority?'是':'否')+'</b></div></div>'
     +(pubOf(c)==='已下架'&&c.pubBack?'<div class="tag err" style="display:block;margin-top:10px;padding:6px 12px;white-space:normal">下架原因:'+esc(c.pubBack.reason)+'</div>':'')
     +(isPub(c)&&newer?'<div class="tag warn" style="display:block;margin-top:10px;padding:6px 12px;white-space:normal">内容已改版到 v'+c.ver+',零售通上还是 v'+pv+'。可以「更新上架」;已引用它的学习项目继续用锁定版本。</div>':'')
     +'<div class="hint" style="margin-top:10px;line-height:1.8">上架是单独动作,不影响学习任务:一条内容可以只做成学习任务、不上架(不会出现在零售通「学习专区」);上架也不代表会自动下发,学员仍要在学习任务里看到它。</div>'
     +'<div style="margin-top:12px">'+(usableC(c)&&canEditC(c)?'<button class="btn pri" data-act="cPub" data-id="'+c.id+'">'+(isPub(c)?'更新上架':'上架到零售通')+'</button> ':'')+(isPub(c)&&canEditC(c)?'<button class="btn err" data-act="cUnpub" data-id="'+c.id+'">下架</button>':'')+'</div></div>';
  }
  if(tab==='版本'){
    const vs=c.vers.slice().reverse();const cur=c.vers.length?c.vers[c.vers.length-1]:null;
    main='<div class="card"><h3>版本记录 <span class="hint">每次审核通过生成一个版本;学习项目引用时锁定该版本,零售通上架也锁定版本</span></h3>'+(vs.length?'<table class="t"><tr><th>版本</th><th>时间</th><th>操作人</th><th>说明</th><th>被哪些项目锁定</th><th>零售通</th><th></th></tr>'+vs.map(v=>{const pj=u.filter(p=>p.nodes.some(n=>n.contentId===c.id&&(n.contentVer||1)===v.v));return '<tr><td><b>v'+v.v+'</b>'+(v.v===c.ver&&usableC(c)?' <span class="tag ok">当前</span>':'')+'</td><td>'+v.t+'</td><td>'+esc(cShort(v.who))+'</td><td style="white-space:normal;max-width:240px">'+esc(v.note||'')+'</td><td>'+(pj.length?pj.map(p=>esc(p.name)).join('、'):'<span class="hint">—</span>')+'</td><td>'+(isPub(c)&&(c.pubVer||0)===v.v?'<span class="tag ok">上架中</span>':'<span class="hint">—</span>')+'</td><td><button class="link" data-act="cVerView" data-id="'+c.id+'" data-v="'+v.v+'">查看</button></td></tr>'}).join('')+'</table>':'<div class="hint">还没有通过审核的版本。</div>')+'</div>'
     +(c.vers.length>1?'<div class="card"><h3>与上一版的差异</h3>'+diffHtml(bodyLines(c.kind,c.vers[c.vers.length-2].snap.body),bodyLines(c.kind,cur.snap.body))+'</div>':'')
     +(c.aiLines&&c.aiLines.length?'<div class="card"><h3>AI 初稿 → 最终稿 <span class="hint">采纳率 '+ad+'%;红色 = 人删掉 / 改掉的,绿色 = 人新增 / 改写的</span></h3>'+diffHtml(c.aiLines,bodyLines(c.kind,c.body))+'</div>':'');
  }
  if(tab==='使用与反馈'){
    const fb=fbOf(c.id);const rs={};fb.filter(f=>f.type==='点踩').forEach(f=>rs[f.reason]=(rs[f.reason]||0)+1);
    main='<div class="card"><h3>使用情况</h3><div class="grid g4"><div class="stat"><div class="l">被引用项目</div><div class="n">'+u.length+'</div></div><div class="stat"><div class="l">点赞 / 点踩</div><div class="n" style="font-size:20px">'+c.up+' / '+c.down+'</div></div><div class="stat"><div class="l">语料命中率</div><div class="n">'+(hitOf(c)==null?'—':hitOf(c)+'%')+'</div></div><div class="stat"><div class="l">引用项目平均达成</div><div class="n">'+(effOf(c.id)==null?'—':effOf(c.id)+'%')+'</div></div></div>'
     +(u.length?'<table class="t" style="margin-top:12px"><tr><th>项目</th><th>锁定版本</th><th>状态</th><th>达成</th></tr>'+u.map(p=>{const n=p.nodes.find(x=>x.contentId===c.id);return '<tr><td><a class="link" data-act="go" data-p="detail" data-id="'+p.id+'">'+esc(p.name)+'</a>'+(p.gray&&p.gray.stage==='灰度中'?' <span class="tag blue">灰度中</span>':'')+'</td><td>v'+(n.contentVer||1)+(usableC(c)&&c.ver>(n.contentVer||1)?' <span class="tag warn">有新版本 v'+c.ver+'</span>':'')+'</td><td>'+chip(p.status)+'</td><td>'+(p.eff?(smallNow(p)?'样本不足':pct(p)+'%'):'—')+'</td></tr>'}).join('')+'</table>':'')+'</div>'
     +'<div class="card"><h3>点踩原因与纠错</h3>'+(Object.keys(rs).length?'<div style="margin-bottom:8px">'+Object.keys(rs).map(k=>'<span class="tag warn" style="margin-right:6px">'+esc(k)+' × '+rs[k]+'</span>').join('')+'</div>':'')+(fb.length?'<table class="t"><tr><th>时间</th><th>类型</th><th>内容</th><th>来自</th><th>状态</th><th></th></tr>'+fb.map(f=>'<tr><td>'+f.t+'</td><td><span class="tag '+(f.type==='纠错'?'err':'warn')+'">'+f.type+'</span></td><td style="white-space:normal">'+esc(f.reason||'')+(f.text?':'+esc(f.text):'')+'</td><td>'+esc(f.who)+'</td><td>'+f.st+'</td><td>'+(f.st==='待处理'&&canEditC(c)?'<button class="link" data-act="fbAccept" data-id="'+f.id+'">采纳并改版</button><button class="link" data-act="fbIgnore" data-id="'+f.id+'">忽略</button>':'')+'</td></tr>').join('')+'</table>':'<div class="hint">暂无一线反馈。</div>')+'</div>';
  }
  if(tab==='关联'){
    const same=S.contents.filter(x=>x.id!==c.id&&x.subject===c.subject&&visC(x)).slice(0,6);const tcs=tp?topicContentState(tp):null;
    main='<div class="card"><h3>来源与去向(血缘)</h3><div style="line-height:2.1">'+(tp?'课题 <a class="link" data-act="topicOpen" data-id="'+tp.id+'">'+tp.id+' '+esc(tp.title)+'</a>'+(tcs?' <span class="tag '+(tcs.k==='已落地'?'ok':'blue')+'">'+tcs.k+'</span>':''):'<span class="hint">无来源课题(自己定题 / 导入)</span>')+' → <b>本内容 v'+c.ver+'</b> → '+(u.length?u.map(p=>'<a class="link" data-act="go" data-p="detail" data-id="'+p.id+'">'+esc(p.name)+'</a>').join('、'):'<span class="hint">未被学习任务引用</span>')+(isPub(c)?' → 已上架零售通「'+esc(c.cat)+'」':'')+(c.copyFrom?'<br>复制自 <a class="link" data-act="cView" data-id="'+c.copyFrom+'">'+c.copyFrom+'</a>':'')+'</div></div>'
     +'<div class="card"><h3>和其他功能的衔接</h3><dl class="kv"><dt>零售通</dt><dd>'+(isPub(c)?'已上架:出现在学堂「学习专区」的「'+esc(c.cat)+'」分类,'+esc((c.chan||[]).join('、'))+'可见'+(c.recommend&&c.recommend.on?',并在首页推荐(至 '+c.recommend.until+')':''):pubOf(c)==='待上架'?'待上架:'+esc(c.publishTime||''):'未上架:零售通不可见')+'</dd><dt>学习项目</dt><dd>任务节点「学习 → 学堂内容」选用;只要求「已定稿」,不要求上架;提交时锁定版本</dd><dt>指标</dt><dd>'+(c.kind==='话术'&&c.kw?'关键词组「'+esc(c.kw)+'」在项目选「关键词开口率」时自动继承':'课程不产生关键词指标')+';能力维度「'+esc(c.ability)+'」用于效果归因</dd><dt>效果追踪</dt><dd>'+(effOf(c.id)==null?'引用它的项目评估后,这里汇总平均达成':'引用项目平均达成 '+effOf(c.id)+'%;周 / 月报告的「内容反馈」会列出它')+'</dd></dl></div>'
     +(same.length?'<div class="card"><h3>同主题「'+esc(c.subject)+'」的其他内容</h3><table class="t">'+same.map(x=>'<tr><td><a class="link" data-act="cView" data-id="'+x.id+'">'+esc(x.title)+'</a></td><td>'+kindTag(x.kind)+'</td><td>'+cchip(x.st)+'</td><td>'+pubchip(pubOf(x))+'</td></tr>').join('')+'</table></div>':'');
  }
  const alerts=[];if(es==='即将到期')alerts.push('<span class="tag warn">'+expDays(c)+' 天后到期,已上架的会自动下架</span>');if(es==='已过期')alerts.push('<span class="tag err">已过期</span>');if(fp.length)alerts.push('<a class="tag warn" data-act="cdtab" data-v="使用与反馈">'+fp.length+' 条一线反馈待处理 ›</a>');if(isPub(c)&&c.pubVer<c.ver)alerts.push('<span class="tag warn">有新版未上架 v'+c.ver+'</span>');
  const lst=S.contents.filter(visC);const ix=lst.indexOf(c);
  const ki=(l,v)=>'<span class="ki"><i>'+l+'</i><b>'+v+'</b></span>';
  const pubTxt=isPub(c)?(c.pubAt||c.publishTime||'已上架').slice(0,16)+(c.pubVer<c.ver?' (v'+c.pubVer+')':''):pubOf(c)==='待上架'?'计划 '+esc(c.publishTime||'-'):'—';
  const upd=(c.hist[0]&&c.hist[0].t||c.created||'').slice(0,10);
  const keyinfo='<div class="keyinfo">'+ki('版本','v'+c.ver+(isPub(c)&&c.pubVer<c.ver?' <small>零售通 v'+c.pubVer+'</small>':''))+ki('发布时间',pubTxt)+ki('负责人',esc(cShort(c.creator)))+ki('审核人',esc(cShort(c.rName||c.creator)))+ki('最近更新',upd||'-')+ki('有效期',c.expire?c.expire:'长期')+'</div>';
  const acts=cActions(c);
  return crumb('<a data-act="go" data-p="content">内容中心</a> / '+c.id)
   +linkBar({type:'content',c})+'<div class="cdh"><div class="cdh-l"><h2>'+esc(c.title)+'</h2><div class="ph-meta">'+kindTag(c.kind)+carChipsHtml(carListOf(c),3)+cchip(c.st)+pubchip(pubOf(c))+originTag(c)+(typeof kpPlaceholderTag==='function'?kpPlaceholderTag(c):'')+(typeof rvChip==='function'?rvChip('content',c.id):'')+alerts.join('')+'</div>'+(typeof kpIsPlaceholder==='function'&&kpIsPlaceholder(c)?'<div class="ux-inline warn" style="margin-top:8px">这是系统自动合成的占位主讲解（定义 / 关键讲法 / 常见错误 / 练习）。默认不计入覆盖度和可授课率。</div>':'')+keyinfo+'</div>'
   +'<div class="cdh-r"><div class="dnav"><button class="btn sm" data-act="cNav" data-d="-1" '+(ix<=0?'disabled':'')+'>‹ 上一条</button><span class="hint">'+(ix+1)+' / '+lst.length+'</span><button class="btn sm" data-act="cNav" data-d="1" '+(ix>=lst.length-1?'disabled':'')+'>下一条 ›</button></div><div class="dacts">'+(acts||'<span class="hint">当前无可做的操作</span>')+'</div>'+(c.st==='审核中'&&c.rK!==UI.role.k?'<div class="hint" style="margin-top:6px;text-align:right">等待审核人 '+esc(c.rName)+' 处理</div>':'')+'</div></div>'
   +'<div class="tabs">'+DTABS.map(x=>'<div class="tab '+(tab===x?'on':'')+'" data-act="cdtab" data-v="'+x+'">'+x+(x==='使用与反馈'&&fp.length?' <span class="dot" style="display:inline-block">'+fp.length+'</span>':'')+'</div>').join('')+'</div>'
   +(tab==='内容'?'<div class="dgrid"><div class="dmain">'+main+'</div><div class="dside">'+side+'</div></div>':main)
   +'<div class="card"><h3>操作记录 <span class="hint">共 '+c.hist.length+' 条</span></h3>'+(c.hist.length?c.hist.slice(0,8).map(x=>'<div style="padding:4px 0;border-top:1px solid #f2f3f5;font-size:13px"><span class="hint">'+x.t+'</span> <b>'+esc(cShort(x.who))+'</b> '+esc(x.act)+(x.note?'<span class="hint"> · '+esc(x.note)+'</span>':'')+'</div>').join(''):'<div class="hint">学堂现有内容,无本系统记录</div>')+'</div>'}
A.cNav=el=>{const lst=S.contents.filter(visC);const i=lst.findIndex(x=>x.id===UI.cid)+ +el.dataset.d;if(i<0||i>=lst.length)return;UI.cid=lst[i].id;render();$('#main').scrollTop=0};
A.cCopyTxt=el=>{const c=content(el.dataset.id);const b=c.body||{};const t=c.kind==='话术'&&b.spin?c.title+'\n'+spinPlain(b.spin):c.title+'\n'+bodyLines(c.kind,b).join('\n');if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).catch(()=>{});toast('已复制话术正文(纯文本,去掉了加亮标记),可直接粘贴到微信 / 笔记','ok')};
A.cPvRn=el=>{const c=content(el.dataset.id);openDlg('零售通阅读效果(示意)','<div class="phone-pv" style="max-width:360px;margin:0 auto"><div class="pv-nav">学堂 › 学习专区 › '+esc(c.cat)+'</div><div style="font-weight:650;margin-bottom:8px">'+esc(c.title)+'</div><div style="background:#fff;border-radius:12px;padding:10px 12px;font-size:13px;line-height:1.75">'+rnBody(c.kind,c.body)+'</div></div><div class="hint" style="margin-top:8px;text-align:center">一线在手机上看到的样子:S / P / I / N 分段着色,黄色加亮保留</div>','<button class="btn" data-act="close">关闭</button>')};
A.cVerView=el=>{const c=content(el.dataset.id);const v=c.vers.find(x=>x.v===+el.dataset.v);openDlg(c.title+' · v'+v.v+(v.v===c.ver?'(当前)':'(历史版本)'),cBodyHtml(c,v.snap)+'<div class="hint" style="margin-top:8px">'+v.t+' · '+esc(cShort(v.who))+' · '+esc(v.note||'')+'</div>','<button class="btn" data-act="close">关闭</button>',true)};

/* ---------- 状态流转:内容 ---------- */
A.cSubmit=el=>{const c=content(el.dataset.id);const q=qcheck(c);
  if(q.hard.length){toast('不能提交审核:'+q.hard[0]+(q.hard.length>1?'(共 '+q.hard.length+' 项)':''),'err');return A.cEdit(el)}
  closeDlg();c.st='审核中';chist(c,'提交审核','审核人:'+(c.rName||c.creator)+'(默认本人,预留可配置)'+(q.soft.length?';带 '+q.soft.length+' 条提醒':''));notify('内容「'+c.title+'」已提交审核,审核人:'+(c.rName||c.creator));toast(c.rK===UI.role.k?'已提交审核。你就是审核人,可在「工作台」里审核':'已提交审核','ok');render()};
A.cReview=el=>{const c=content(el.dataset.id);closeDlg();const q=qcheck(c);
  openDlg('审核内容 · '+c.title,'<div style="margin-bottom:8px">'+kindTag(c.kind)+' <span class="tag">'+c.type+'</span> <span class="tag">v'+c.ver+'</span> <span class="tag">可见:'+esc(c.vis)+'</span> '+originTag(c)+'</div>'+cBodyHtml(c)+(q.soft.length?'<div class="tag warn" style="display:block;margin-top:8px;white-space:normal;line-height:1.7;padding:6px 12px">提醒:'+q.soft.map(esc).join(';')+'</div>':'')+'<div class="f" style="margin-top:12px"><label>审核意见</label><div class="in"><textarea id="rvt" placeholder="通过可不填;退回修改必须填写" style="width:100%;max-width:none"></textarea></div></div>'+(typeof rvTriggers==='function'&&rvNeedsGate(c)?'<div class="tag warn" style="display:block;margin-top:8px;white-space:normal;line-height:1.7;padding:6px 12px">命中评审规则:'+rvTriggers(c).map(esc).join('、')+'。配置中心已设为「强制先评审」,通过后才能定稿。</div>':typeof rvSuggest==='function'&&rvSuggest(c)?'<div class="tag blue" style="display:block;margin-top:8px;white-space:normal;line-height:1.7;padding:6px 12px">建议评审:'+rvTriggers(c).map(esc).join('、')+'。可以先评审再定稿,也可以直接定稿、同时发起异步评审(不阻塞),或不评审。</div>':'')+'<div class="hint">审核通过后内容进入「已定稿」。定稿不等于上架:上架在「发布到零售通」里单独做;做成学习任务只要求定稿。</div>','<button class="btn" data-act="close">取消</button><button class="btn" data-act="cReviewEdit" data-id="'+c.id+'">直接修改</button><button class="btn err" data-act="cReturn" data-id="'+c.id+'">退回修改</button><button class="btn" data-act="rvStart" data-k="content" data-m="gate" data-id="'+c.id+'">先评审再定稿</button>'+(typeof rvNeedsGate==='function'&&rvNeedsGate(c)?'':'<button class="btn" data-act="cPassAsync" data-id="'+c.id+'">通过并发起异步评审</button>')+'<button class="btn pri" data-act="cPass" data-id="'+c.id+'">'+(typeof rvNeedsGate==='function'&&rvNeedsGate(c)?'命中规则,发起评审灰度':'审核通过,进入已定稿')+'</button>',true)};
A.cPassAsync=el=>{const id=el.dataset.id;const c=content(id);const v=(($('#rvt')||{}).value||'').trim();A.cPass({dataset:{id}});if(c.st==='已定稿')rvStartDlg('content',id,'async')};
A.cReviewEdit=el=>{closeDlg();A.cEdit(el);C.rv=1;render()};
A.cPass=el=>{const c=content(el.dataset.id);
  if(typeof rvBlocking==='function'&&rvBlocking('content',c.id)){closeDlg();return toast('评审灰度进行中,由评审团结果决定是否定稿','err')}
  const v=(($('#rvt')||{}).value||'').trim();
  if(typeof rvNeedsGate==='function'&&rvNeedsGate(c)&&typeof rvActive==='function'&&rvActive('content',c.id)){closeDlg();return toast('这条内容已有进行中的异步评审,而配置要求先评审再定稿:请先在评审卡里「撤回」异步评审,再发起「先评审再定稿」','err')}
  if(typeof rvNeedsGate==='function'&&rvNeedsGate(c)){chist(c,'审核人通过,转评审灰度','命中规则:'+rvTriggers(c).join('、')+(v?';审核意见:'+v:''));return rvStartDlg('content',c.id)}
  c.st='已定稿';c.vers=c.vers.filter(x=>x.v!==c.ver);c.vers.push({v:c.ver,t:today,who:meShort(),note:v||'审核通过',snap:snapOf(c)});chist(c,'审核通过,已定稿(v'+c.ver+')',v);closeDlg();const t=c.topic&&topic(c.topic);if(t)thist(t,meShort(),'内容已定稿','「'+c.title+'」('+c.kind+')');notify('内容「'+c.title+'」审核通过,已定稿');toast('已定稿(v'+c.ver+')。可以做成学习任务,或去「零售通发布」上架','ok');render()};
A.cReturn=el=>{const c=content(el.dataset.id);if(typeof rvBlocking==='function'&&rvBlocking('content',c.id)){closeDlg();return toast('评审灰度进行中,请先在评审卡里「撤回」再退回','err')}const v=($('#rvt').value||'').trim();if(!v)return toast('退回请填写审核意见','err');c.st='草稿';chist(c,'审核退回',v);closeDlg();notify('内容「'+c.title+'」审核退回:'+v);toast('已退回草稿','ok');render()};
/* ---------- 状态流转:上架 ---------- */
A.cPub=el=>{closeDlg();const c=content(el.dataset.id);if(!usableC(c))return toast('内容还没定稿,不能上架','err');if(!(c.kps||[]).length)return toast('先挂至少 1 个知识点再上架；草稿可以暂不挂','err');
  const pv=c.pubVer||0;const upd=isPub(c);
  openDlg(upd?'更新上架到零售通':'上架到零售通',kpPubHint(c)+'<div class="tag '+(upd?'warn':'pri')+'" style="display:block;margin-bottom:12px;padding:6px 12px;white-space:normal">'+(upd?'当前零售通是 v'+pv+',将更新到 v'+c.ver+'。':'把 v'+c.ver+' 上架到零售通「学习专区」。')+'上架不影响学习任务,学员仍要经学习任务看到它。</div>'
   +'<div class="fgrid"><div class="fld"><label><b>*</b>内容分类</label><select id="pu_cat">'+CATS.map(x=>'<option '+(c.cat===x?'selected':'')+'>'+x+'</option>').join('')+'</select><div class="fh">发布后出现在学堂「学习专区」的这个分类下</div></div>'
   +'<div class="fld"><label><b>*</b>可见范围</label><div class="pill-row">'+CHANS.map(x=>'<label><input type="checkbox" class="pu_ch" value="'+x+'" '+(c.chan.includes(x)?'checked':'')+'> '+x+'</label>').join('')+'</div></div>'
   +'<div class="fld"><label><b>*</b>可见区域</label><select id="pu_vis">'+(UI.role.type==='region'?['仅'+UI.role.region+'区域']:['全国'].concat(allRegions.map(r=>'仅'+r+'区域'))).map(v=>'<option '+(c.vis===v?'selected':'')+'>'+v+'</option>').join('')+'</select></div>'
   +'<div class="fld"><label><b>*</b>发布方式</label><select id="pu_pt" data-wc="puPt"><option '+(c.publishType!=='定时发布'?'selected':'')+'>立即发布</option><option '+(c.publishType==='定时发布'?'selected':'')+'>定时发布</option></select></div>'
   +'<div class="fld" id="pu_time" style="'+(c.publishType==='定时发布'?'':'display:none')+'"><label><b>*</b>发布时间</label><input type="datetime-local" id="pu_ptime" value="'+esc(c.publishTime||addDays(today,1)+'T09:00')+'"></div>'
   +'<div class="fld"><label>首页推荐</label><label class="sw2"><input type="checkbox" id="pu_rec" '+(c.recommend&&c.recommend.on?'checked':'')+'> 加入首页推荐</label> <input type="date" id="pu_recu" value="'+esc((c.recommend&&c.recommend.until)||addDays(today,30))+'" style="width:150px"></div>'
   +'<div class="fld"><label>权威内容</label><label class="sw2"><input type="checkbox" id="pu_auth" '+(c.authority?'checked':'')+'> 是</label><div class="fh">权威级别将使该文档在检索中被优先采用</div></div></div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="cPubOk" data-id="'+c.id+'">'+(upd?'更新上架':'确认上架')+'</button>',true)};
A.puPt=el=>{const e=$('#pu_time');if(e)e.style.display=el.value==='定时发布'?'':'none'};
A.cPubOk=el=>{const c=content(el.dataset.id);const ch=[...document.querySelectorAll('.pu_ch:checked')].map(x=>x.value);if(!ch.length)return toast('请至少选择一个可见范围','err');
  const pt=$('#pu_pt').value;const ptime=pt==='定时发布'?$('#pu_ptime').value:'';if(pt==='定时发布'&&!ptime)return toast('请选择发布时间','err');
  Object.assign(c,{cat:$('#pu_cat').value,chan:ch,vis:$('#pu_vis').value,publishType:pt,publishTime:ptime,recommend:{on:$('#pu_rec').checked,until:$('#pu_recu').value},authority:$('#pu_auth').checked?1:0});
  c.pubSt=pt==='定时发布'?'待上架':'已上架';if(c.pubSt==='已上架'){c.pubVer=c.ver;c.pubAt=today+' '+new Date().toTimeString().slice(0,5)}c.pubBack=null;
  chist(c,pt==='定时发布'?'设置定时上架':'上架到零售通','分类「'+c.cat+'」· '+ch.join('、')+' · '+c.vis+(ptime?' · 计划 '+ptime:''));notify('内容「'+c.title+'」'+(pt==='定时发布'?'已设置定时上架:'+ptime:'已上架到零售通'));closeDlg();
  toast(pt==='定时发布'?'已设置定时上架:'+ptime:'已上架到零售通「'+c.cat+'」','ok');render()};
A.cUnpub=el=>{const c=content(el.dataset.id);openDlg('下架','<div>内容「<b>'+esc(c.title)+'</b>」将从零售通「学习专区」下架。</div><div class="f" style="margin-top:10px"><label><b>*</b>原因</label><div class="in"><input type="text" id="ubk" style="min-width:360px" placeholder="如:口径已过期 / 反馈差"></div></div><div class="hint">下架只影响零售通展示:已引用它的学习项目继续用锁定版本;内容本身仍是「已定稿」,可以再上架。</div>','<button class="btn" data-act="close">取消</button><button class="btn err" data-act="cUnpubOk" data-id="'+c.id+'">确认下架</button>')};
A.cUnpubOk=el=>{const c=content(el.dataset.id);const r=($('#ubk').value||'').trim();if(!r)return toast('请填写下架原因','err');c.pubSt='已下架';c.pubBack={reason:r,t:today,who:meShort()};chist(c,'从零售通下架',r);notify('内容「'+c.title+'」已从零售通下架');closeDlg();toast('已下架','ok');render()};
A.cArchive=el=>{const c=content(el.dataset.id);if(isPub(c))return toast('已上架的内容请先下架,再归档','err');c.st='已归档';chist(c,'归档','不再参与选择,保留历史');toast('已归档','ok');render()};
A.cRestore=el=>{const c=content(el.dataset.id);c.st='已定稿';chist(c,'恢复为已定稿','');toast('已恢复到已定稿','ok');render()};
A.cRework=el=>{const c=content(el.dataset.id);c.st='草稿';c.ver++;chist(c,'回炉修改','版本 v'+c.ver+',改完重新提交审核');toast('已回到草稿(v'+c.ver+')','ok');A.cEdit(el)};
A.cRevise=el=>{const c=content(el.dataset.id);c.st='草稿';c.ver++;chist(c,'改版 v'+c.ver,'改版期间,已引用的项目继续用锁定版本;零售通保持 v'+(c.pubVer||'-')+' 直到更新上架');toast('已创建新版本 v'+c.ver+'(草稿)。审核通过后,项目里提示「可更新」,零售通可「更新上架」','ok');A.cEdit(el)};
A.cRenew=el=>{closeDlg();const c=content(el.dataset.id);openDlg('有效期','<div>内容「<b>'+esc(c.title)+'</b>」'+(c.expire?'当前有效期 '+c.expire:'未设置有效期')+'</div><div class="f" style="margin-top:10px"><label><b>*</b>新的有效期</label><div class="in"><input type="date" id="rn" value="'+addDays(c.expire&&c.expire>today?c.expire:today,90)+'"></div></div><div class="hint">到期前 '+S.cfg.expWarn+' 天会提醒;到期后只自动从零售通下架,不影响学习任务。</div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="cRenewOk" data-id="'+c.id+'">确定</button>')};
A.cRenewOk=el=>{const c=content(el.dataset.id);const v=$('#rn').value;if(!v||v<=today)return toast('有效期需晚于今天','err');c.expire=v;chist(c,'续期','有效期至 '+v);closeDlg();toast('已更新有效期至 '+v,'ok');render()};
A.cCopy=el=>{const s=content(el.dataset.id);const c=cEnsure(JSON.parse(JSON.stringify(s)));Object.assign(c,{id:nextCid(),st:'草稿',pubSt:'未上架',pubVer:0,ver:1,up:0,down:0,views:0,orig:0,vers:[],hist:[],assets:(s.assets||[]).slice(),creator:meFull(),cK:UI.role.k,rK:UI.role.k,rName:meFull(),created:today,origin:'复制自 '+s.id,copyFrom:s.id,vis:UI.role.type==='region'?'仅'+UI.role.region+'区域':s.vis,title:s.title+'(属地化)',aiLines:[],rec:null,back:null,pubBack:null,batch:null,publishType:'立即发布',publishTime:'',recommend:{on:false,until:''}});S.contents.unshift(c);chist(c,'复制并属地化','复制自 '+s.id+'「'+s.title+'」,可见范围 '+c.vis+',改成本区说法后提交审核');toast('已复制为草稿 '+c.id+',改成本区的说法吧','ok');A.cEdit({dataset:{id:c.id}})};
A.cRec=el=>{closeDlg();const c=content(el.dataset.id);openDlg('推荐到全国','<div>把「<b>'+esc(c.title)+'</b>」(现在仅 '+esc(c.vis)+' 可见)推荐给总部,通过后全国可见,可被其他区域的项目选用。</div><div class="f" style="margin-top:10px"><label><b>*</b>推荐理由</label><div class="in"><input type="text" id="rcw" style="min-width:360px" placeholder="如:本区使用后点踩率低、达成 +9pt"></div></div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="cRecOk" data-id="'+c.id+'">提交推荐</button>')};
A.cRecOk=el=>{const c=content(el.dataset.id);const w=($('#rcw').value||'').trim();if(!w)return toast('请填写推荐理由','err');c.rec={st:'待总部审核',by:meShort(),why:w,t:today};chist(c,'推荐到全国',w);closeDlg();notify('区域内容「'+c.title+'」推荐到全国,待总部审核');toast('已提交,等待总部培训部审核','ok');render()};
A.cRecYes=el=>{const c=content(el.dataset.id);c.rec.st='已通过';c.vis='全国';chist(c,'总部通过推荐','升为全国可见');notify('内容「'+c.title+'」已升为全国可见');toast('已升为全国可见','ok');render()};
A.cRecNo=el=>{const c=content(el.dataset.id);c.rec.st='未通过';chist(c,'总部未通过推荐','');toast('已标记未通过','ok');render()};
A.cToProject=el=>{closeDlg();const c=content(el.dataset.id);if(!usableC(c))return toast('内容需先审核通过(已定稿)才能做成学习任务','err');if(!['hq','region'].includes(UI.role.type))return toast('当前身份不能新增学习项目','err');formInit(c.topic?topic(c.topic):null,null,c.id)};

/* ---------- 零售通发布(分发侧) ---------- */
const PTABS=['已上架','待上架','已下架','首页推荐位'];
A.pTab=el=>{UI.tab.publish=el.dataset.v;render()};
A.pqkw=el=>{UI.sel.pq=el.value};
A.pqSearch=()=>render();
function pgPublish(){
  cSweep();const t=curTab('publish',PTABS);const q=(UI.sel.pq||'').trim();
  const pf=UI.sel.pubF||(UI.sel.pubF={});
  const V=S.contents.filter(c=>visC(c)&&pubOf(c)!=='未上架'&&(!q||c.title.includes(q)||c.id===q)
    &&(!pf.kp||(pf.kp==='未挂载'?!(c.kps||[]).length:(c.kps||[]).includes(pf.kp)))
    &&(!pf.kind||c.kind===pf.kind)&&(!pf.cat||c.cat===pf.cat)&&(!pf.vis||c.vis===pf.vis)
    &&(!pf.from||(c.publishTime||c.pubAt||'')>=pf.from)&&(!pf.to||(c.publishTime||c.pubAt||'')<=pf.to));
  let rows;
  if(t==='首页推荐位')rows=V.filter(c=>c.recommend&&c.recommend.on&&isPub(c)).sort((a,b)=>(a.recommend.until||'')>(b.recommend.until||'')?1:-1);
  else rows=V.filter(c=>pubOf(c)===t).sort((a,b)=>(b.pubAt||b.publishTime||b.created||'')>(a.pubAt||a.publishTime||a.created||'')?1:-1);
  const pg=lstPage('pub',rows,20);const picked=lstPicked('pub');
  const tool='<div class="card pub-filter" style="padding:14px 18px"><div class="pub-filter-grid">'
    +'<div class="fi2"><label>知识点</label><select data-wc="pubF" data-k="kp"><option value="">全部</option><option value="未挂载"'+(pf.kp==='未挂载'?' selected':'')+'>未挂载</option>'+S.kps.map(k=>'<option value="'+k.id+'"'+(pf.kp===k.id?' selected':'')+'>'+esc(k.name)+'</option>').join('')+'</select></div>'
    +'<div class="fi2"><label>内容类型</label><select data-wc="pubF" data-k="kind"><option value="">全部</option>'+['话术','课程'].map(v=>'<option'+(pf.kind===v?' selected':'')+'>'+v+'</option>').join('')+'</select></div>'
    +'<div class="fi2"><label>内容分类</label><select data-wc="pubF" data-k="cat"><option value="">全部</option>'+CATS.map(v=>'<option'+(pf.cat===v?' selected':'')+'>'+v+'</option>').join('')+'</select></div>'
    +'<div class="fi2"><label>可见范围</label><select data-wc="pubF" data-k="vis"><option value="">全部</option>'+[...new Set(S.contents.map(c=>c.vis).filter(Boolean))].map(v=>'<option'+(pf.vis===v?' selected':'')+'>'+esc(v)+'</option>').join('')+'</select></div>'
    +'<div class="fi2 pub-range"><label>发布时间</label><div class="pub-range-row"><input type="date" data-wc="pubF" data-k="from" value="'+esc(pf.from||'')+'"><span>至</span><input type="date" data-wc="pubF" data-k="to" value="'+esc(pf.to||'')+'"></div></div>'
    +'<div class="fi2"><label>每页</label><select data-wc="pubsize">'+[20,50,100].map(n=>'<option '+(pg.size===n?'selected':'')+'>'+n+'</option>').join('')+'</select></div>'
    +'<div class="fi2 pub-actions">'+lstCsvBtn(['ID','标题','上架状态','上架版本','发布时间'],[['ID','标题','上架状态','上架版本','发布时间']].concat(rows.map(c=>[c.id,c.title,pubOf(c),c.pubVer||1,c.publishTime||c.pubAt||''])),'零售通发布')+'<span class="hint">共 '+rows.length+' 条</span></div>'
    +'</div></div>';
  const batch=picked.length?'<div class="lst-batch"><b>已选 '+picked.length+' 条</b><button class="btn sm" data-act="pubBulkOn">批量上架</button><button class="btn sm" data-act="pubBulkOff">批量下架</button><button class="btn sm" data-act="lstSelClear" data-k="pub">清空</button></div>':'';
  const head='<div class="ph"><h2>零售通发布 <span class="hint" style="font-weight:400">分发侧:内容在零售通上怎么露出、给谁看、放哪、什么时候。只能从内容中心「已定稿」的内容上架</span></h2></div>';
  const tabs='<div class="tabs">'+PTABS.map(x=>'<div class="tab '+(t===x?'on':'')+'" data-act="pTab" data-v="'+x+'">'+x+' <span class="hint">'+S.contents.filter(c=>visC(c)&&(x==='首页推荐位'?(c.recommend&&c.recommend.on&&isPub(c)):pubOf(c)===x)).length+'</span></div>').join('')+'</div>';
  const fil='<div class="card" style="padding:14px 18px"><div class="filg"><div class="fi2"><label>内容标题</label><input data-wc="pqkw" value="'+esc(q)+'" placeholder="标题 / 内容 ID"></div><div class="fi2" style="align-self:end"><button class="btn pri sm" data-act="pqSearch">查询</button></div><span class="hint" style="align-self:end">上架 / 更新 / 下架在内容详情「发布到零售通」页签里做;待上架的定时内容可在详情里改发布计划。</span></div></div>';
  const T=(h,body)=>'<div class="tw pub-table-wrap"><table class="t nw stk"><tr>'+h.map(x=>'<th>'+x+'</th>').join('')+'</tr>'+body+'</table></div>';
  let b=srcBar('这一页只读上架相关的字段(沿用现有「内容管理」列表的发布方式、发布状态、启用、可见范围、分类、首页推荐、权威、浏览点赞)。内容本身在「内容中心」维护;列表里的内容都是「已定稿」后才上的架。')+fil+'<div class="hint" style="margin:-4px 0 8px">表格列较多，可左右滑动查看「可见范围 / 发布状态 / 版本」。</div>';
  if(!rows.length)b+=cta(t==='已上架'?'还没有已上架的内容':'这一栏没有内容',t==='已上架'?'去「内容中心」把定稿的内容上架。':'','<button class="btn" data-act="go" data-p="content">去内容中心</button>');
  else if(t==='首页推荐位')b+=T(['ID','标题','知识点','分类','推荐截止','浏览 / 点赞','上架版本','操作'],rows.map(c=>'<tr><td>'+c.id+'</td><td style="white-space:normal;max-width:280px"><a class="link" data-act="cView" data-id="'+c.id+'" data-tab="发布到零售通">'+esc(c.title)+'</a></td><td>'+kpCol(c)+'</td><td>'+esc(c.cat)+'</td><td>'+esc(c.recommend.until||'-')+'</td><td>'+(c.views||0)+' / '+c.up+'</td><td>v'+(c.pubVer||1)+'</td><td>'+cBtn(c,'调整推荐','cPub')+cBtn(c,'下架','cUnpub','err')+'</td></tr>').join(''));
  else b+=T(['<input type="checkbox" data-act="lstSelAll" data-k="pub" data-ids="'+esc(JSON.stringify(pg.rows.map(c=>c.id)))+'">','ID','内容 / 知识点','可见范围','发布状态','版本 / 时间','操作'],pg.rows.map(c=>'<tr><td><input type="checkbox" data-act="lstSel" data-k="pub" data-id="'+c.id+'" '+(picked.includes(c.id)?'checked':'')+'></td><td>'+c.id+'</td><td style="white-space:normal;min-width:260px"><a class="link" data-act="cView" data-id="'+c.id+'" data-tab="发布到零售通">'+esc(c.title)+'</a>'+(c.pubVer<c.ver?' <span class="tag warn">有新版本 v'+c.ver+'</span>':'')+'<div class="hint">'+c.type+' · '+esc(c.cat)+'</div><div class="hint">'+kpCol(c)+'</div></td><td style="white-space:normal">'+esc((c.chan||[]).map(x=>x.replace('汽车','')).join('、'))+'<div class="hint">'+(c.vis==='全国'?'全国':c.vis.replace('仅','').replace('区域',''))+'</div></td><td>'+pubchip(pubOf(c))+'</td><td>v'+(c.pubVer||1)+'<div class="hint">'+(c.publishTime||c.pubAt||c.created||'-')+'</div><div class="hint">浏览 '+(c.views||0)+' / 赞 '+c.up+'</div></td><td><a class="link" data-act="cView" data-id="'+c.id+'" data-tab="发布到零售通">查看</a>'+(pubOf(c)==='已上架'?' <a class="link" data-act="cPub" data-id="'+c.id+'">更新上架</a> <a class="link err" data-act="cUnpub" data-id="'+c.id+'">下架</a>':pubOf(c)==='待上架'?' <a class="link" data-act="cPub" data-id="'+c.id+'">改发布计划</a>':' <a class="link" data-act="cPub" data-id="'+c.id+'">重新上架</a>')+'<div class="hint">'+c.publishType+'</div></td></tr>').join(''));
  if(rows.length)b+=lstPager('pub',pg)+batch;
  return head+tabs+tool+b}
function rulesContent(){const T=(h,rows)=>'<div class="tw" style="margin-bottom:10px"><table class="t"><tr>'+h.map(x=>'<th>'+x+'</th>').join('')+'</tr>'+rows.map(r=>'<tr>'+r.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('')+'</table></div>';
  return '<div class="card"><h3>8. 内容中心 / 零售通发布（两套状态各管各的）</h3>'
   +T(['内容状态(内容中心)','怎么进入','谁做','下一步'],[['草稿','新增 / AI 生成 / 线下导入 / 审核退回 / 改版(版本 +1)','创建人(总部或区域老师)','编辑 → 质量检查 → 提交审核'],['审核中','提交审核(硬规则必须通过)','审核人(先设为创建人本人,预留可配置),可直接修改','通过 → 已定稿;退回(必须写意见)→ 草稿'],['已定稿','审核通过','—','做成学习任务(不要求上架);上架到零售通;可改版 / 归档'],['已归档','手动归档(已上架需先下架)','创建人','不参与选择,保留历史;可恢复到已定稿']])
   +T(['上架状态(零售通发布)','怎么进入','去哪了','下一步'],[['未上架','内容定稿后默认','零售通不可见','上架(立即 / 定时)'],['待上架','上架时选「定时发布」','零售通暂不可见,到点自动上架','改发布计划,或到点自动上架'],['已上架','立即发布 / 定时到点','零售通学堂「学习专区」按内容分类、可见范围展示;首页推荐位按推荐截止展示','更新上架(有新版本时)/ 下架'],['已下架','手动下架 / 到期自动下架','零售通不再展示;已引用的学习项目继续用锁定版本','重新上架 / 续期 / 改版']])
   +T(['规则','说明'],[['两套状态各管各的','内容状态管「内容本身能不能用」,上架状态管「零售通上露不露」。定稿 ≠ 上架;上架 ≠ 下发'],['学习任务引用','只要求「已定稿」,不要求上架;引用时锁定版本,可分批灰度'],['版本','改版审核通过生成新版本;已引用项目提示「可更新」,零售通提示「更新上架」,两件事分开决定'],['有效期','到期前 '+S.cfg.expWarn+' 天提醒;到期只自动从零售通下架,不影响学习任务,可续期'],['沿用现有校验','课程标题、讲师、封面、可见范围、内容类型对应素材(视频 / PDF / 链接 / 图文)都必填,与现有「内容管理」一致;新增硬规则:政策类有效期和出处、话术关键词组'],['提醒(人决定)','含绝对化用语(词表在「配置中心 → 内容管理」);话术没设有效期;单句过长;政策类已过期'],['范围','现有「可见范围」(渠道 / 岗位)不变;新增「可见区域」:总部内容全国可见,区域内容只在本区可见;区域可「推荐到全国」,总部可「复制并属地化」'],['线下资料导入','「导入内容」:上传 → 解析 → 逐条确认 → 草稿(可勾选「已核对,直接定稿」);CSV 逐行校验;PPT / Word / PDF 由 AI 提取文本(示意);批次可整批撤销']])+'</div>'}

/* ---------- 列表通用能力：分页 / 排序 / 导出 / 批量 ---------- */
function lstPage(key,rows,size){
  const st=UI.sel[key]||(UI.sel[key]={page:1,size:size||20});
  if(size&&st.size!==size)st.size=size;
  const total=rows.length;const pages=Math.max(1,Math.ceil(total/st.size));
  if(st.page>pages)st.page=pages;
  const from=(st.page-1)*st.size;
  return {rows:rows.slice(from,from+st.size),total,pages,page:st.page,size:st.size,from};
}
function lstPager(key,info){
  if(info.total<=info.size&&info.pages<=1)return '<div class="hint" style="margin-top:8px">共 '+info.total+' 条</div>';
  return '<div class="lst-pager"><span class="hint">共 '+info.total+' 条 · 第 '+info.page+' / '+info.pages+' 页</span><button class="btn sm" data-act="lstPg" data-k="'+key+'" data-v="prev" '+(info.page<=1?'disabled':'')+'>上一页</button><button class="btn sm" data-act="lstPg" data-k="'+key+'" data-v="next" '+(info.page>=info.pages?'disabled':'')+'>下一页</button></div>';
}
A.lstPg=el=>{const st=UI.sel[el.dataset.k];if(!st)return;st.page=Math.max(1,st.page+(el.dataset.v==='next'?1:-1));render()};
A.lstSize=el=>{const st=UI.sel[el.dataset.k];if(!st)return;st.size=+el.value;st.page=1;render()};
function lstCsv(name,head,rows){
  const csv='\ufeff'+[head].concat(rows).map(r=>r.map(x=>'"'+String(x==null?'':x).replace(/"/g,'""')+'"').join(',')).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download=name+'_'+fmt(new Date())+'.csv';document.body.appendChild(a);a.click();a.remove();toast('已导出 '+rows.length+' 条','ok');
}
function lstCsvBtn(head,rows,name){return '<button class="btn sm" data-act="lstExport" data-json="'+esc(JSON.stringify({name,head,rows:rows.slice(0,2000)}))+'">导出 CSV</button>'}
A.lstExport=el=>{try{const o=JSON.parse(el.dataset.json);lstCsv(o.name,o.head,o.rows)}catch(e){toast('导出失败','err')}};
A.lstSel=el=>{const s=UI.sel[el.dataset.k]||(UI.sel[el.dataset.k]={page:1,size:20});s.pick=s.pick||{};s.pick[el.dataset.id]=el.checked;render()};
A.lstSelAll=el=>{const s=UI.sel[el.dataset.k];if(!s)return;s.pick={};(JSON.parse(el.dataset.ids||'[]')).forEach(id=>s.pick[id]=el.checked);render()};
function lstPicked(key){const s=UI.sel[key];return Object.keys((s&&s.pick)||{}).filter(id=>s.pick[id])}
A.cqs2=el=>{UI.sel.cqs2=el.value;render()};
A.cBulkSubmit=()=>{const ids=lstPicked('clist');if(!ids.length)return toast('先勾选内容','err');let n=0,skip=0;
  ids.forEach(id=>{const c=content(id);if(!c)return;if(c.st!=='草稿'){skip++;return}c.st='审核中';chist(c,'批量提交审核',meShort());n++});
  UI.sel.clist.pick={};toast(n?'已批量提交 '+n+' 条审核'+(skip?'，'+skip+' 条非草稿跳过':''):'没有可提交的草稿',n?'ok':'warn');render()};

A.pubsize=el=>{const st=UI.sel.pub||(UI.sel.pub={page:1,size:20});st.size=+el.value;st.page=1;render()};
A.pubBulkOn=()=>{const ids=lstPicked('pub');if(!ids.length)return toast('先勾选','err');let n=0,skip=0;ids.forEach(id=>{const c=content(id);if(!c)return;if(!usableC(c)||isPub(c)){skip++;return}c.pubSt='已上架';c.pubAt=today;chist(c,'批量上架',meShort());n++});UI.sel.pub.pick={};toast(n?'已批量上架 '+n+' 条'+(skip?'，'+skip+' 条跳过':''):'没有可上架的',n?'ok':'warn');render()};
A.pubBulkOff=()=>{const ids=lstPicked('pub');if(!ids.length)return toast('先勾选','err');openDlg('批量下架','<div>将把勾选的 <b>'+ids.length+'</b> 条内容从零售通下架。</div><div class="f"><label>下架原因</label><div class="in"><input type="text" id="pboff_reason" placeholder="如：口径已过期" style="width:100%"></div></div>','<button class="btn" data-act="close">取消</button><button class="btn err" data-act="pubBulkOffOk">确认下架</button>')};
A.pubBulkOffOk=()=>{const ids=lstPicked('pub');const reason=(($('#pboff_reason')||{}).value||'').trim()||'批量下架';let n=0;ids.forEach(id=>{const c=content(id);if(!c||!isPub(c))return;c.pubSt='已下架';chist(c,'批量下架',reason);n++});UI.sel.pub.pick={};closeDlg();toast('已下架 '+n+' 条','ok');render()};

A.pubF=el=>{const f=UI.sel.pubF||(UI.sel.pubF={});const k=el.dataset.k;const v=el.value;if(v)f[k]=v;else delete f[k];if(UI.sel.pub)UI.sel.pub.page=1;render()};

A.useF=el=>{const f=UI.sel.useF||(UI.sel.useF={});const k=el.dataset.k;const v=el.value;if(v)f[k]=v;else delete f[k];if(UI.sel.usePage)UI.sel.usePage.page=1;render()};
A.rvStartA=el=>rvStartDlg('content',el.dataset.id,'async');
