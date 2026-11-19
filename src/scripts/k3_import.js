/* ========== 导入内容:线下资料 → 解析 → 逐条确认 → 草稿(或已核对直接定稿) ========== */
const CI_HEAD=['类型','标题','主题对象','场景','能力维度','适用人群','可见范围','有效期','出处','关键词组','正文','及格分'];
const CI_SEP='‖';
const CI_SAMPLES=[
 {name:'话术清单_11月.csv',size:'6 KB',dept:'华东培训组',text:null},
 {name:'11月竞品攻防汇编.pptx',size:'4.2 MB',dept:'总部产品部'},
 {name:'国补政策解读.docx',size:'380 KB',dept:'GTM 政策组'},
 {name:'新人入职第一周实战录像.mp4',size:'218 MB',dept:'华北培训组'},
 {name:'展厅接待话术录音.mp3',size:'12 MB',dept:'华北培训组'}];
function ciCsvTemplate(){const r=[CI_HEAD.join(',')];
  r.push(['话术','价格异议 · 价值锚点三句','价格异议','展厅','顾虑解除','全员','全国','','','价值, 总拥有成本, 保值率',['您觉得价格有压力,这很正常。','我们三年的使用成本、保值率和权益一起算,总拥有成本其实更低。','我把这笔账算给您看,您最在意哪一项?'].join(CI_SEP),''].join(','));
  r.push(['课程','国补口径速读','国补 / 地补','不限','不限','全员','全国','2026-12-31','国补实施细则(10 月版)','',['为什么客户总问国补','国补由哪几部分构成','叠加规则以当地最新口径为准'].join(CI_SEP),''].join(','));
  return r.join('\n')}
function ciSampleCsv(){const r=[CI_HEAD.join(',')];
  r.push(['话术','邀约试驾 · 给两个时间选项','邀约试驾','外呼','场景化讲车','全员','全国','','','这周末, 方便, 预约',['王先生,这周六上午或周日下午,您哪个时间方便来体验一下?','给您留一个 40 分钟的试驾位,您到店直接找我就行。'].join(CI_SEP),''].join(','));
  r.push(['话术','GLC 对比话术 · 同价位配置折算','奔驰 GLC','试驾','场景化讲车','全员','全国','','','同价位, 配置折算',['理解您会拿 GLC 一起比。','同样的预算,我帮您把配置折算一下。'].join(CI_SEP),''].join(','));
  r.push(['课程','以旧换新补贴速读','以旧换新','客服','不限','全员','全国','2026-12-31','以旧换新补贴口径(11 月)','',['置换补贴由哪几部分构成','补贴口径以最新政策为准'].join(CI_SEP),''].join(','));
  r.push(['话术','极氪价格战应对','极氪 7X','展厅','顾虑解除','全员','全国','','','价值对比, 价格',['价格之外建议您把三年使用成本一起算。'].join(CI_SEP),''].join(','));
  r.push(['视频','错误类型行','通用','不限','不限','全员','全国','','','','正文',''].join(','));
  r.push(['话术','缺关键词的话术','国补 / 地补','展厅','不限','全员','全国','2026-12-31','文件','','先认同,再讲事实',''].join(','));
  return r.join('\n')}
function ciCsvRows(text){const rows=[];let row=[],cur='',q=false;const s=String(text).replace(/^﻿/,'');for(let i=0;i<s.length;i++){const ch=s[i];if(q){if(ch==='"'){if(s[i+1]==='"'){cur+='"';i++}else q=false}else cur+=ch}else if(ch==='"')q=true;else if(ch===','||ch==='\t'||ch==='，'){row.push(cur);cur=''}else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&s[i+1]==='\n')i++;row.push(cur);rows.push(row);row=[];cur=''}else cur+=ch}if(cur!==''||row.length){row.push(cur);rows.push(row)}return rows.filter(r=>r.some(x=>String(x).trim()))}
const ciUid=()=>'i'+Math.random().toString(36).slice(2,7);
function ciFromRow(c,line,file,dept){
  const [kind,title,subject,scene,ability,aud,vis,expire,source,kw,bodyTxt,pass]=c.map(x=>String(x||'').trim());
  const err=[];if(!KINDS.includes(kind))err.push('类型「'+kind+'」不支持,应为 话术 / 课程');if(!title)err.push('标题为空');if(!bodyTxt)err.push('正文为空');
  if(err.length)return {bad:'第 '+line+' 行:'+err.join(';')};
  const parts=bodyTxt.split(CI_SEP).map(x=>x.trim()).filter(Boolean);let body={};
  if(kind==='话术'){const sp={S:'',P:'',I:'',N:''};let ok=false;parts.forEach(x=>{const m=x.match(/^([SPIN])[:：]\s*(.*)$/);if(m){sp[m[1]]=m[2];ok=true}});body=ok?{scene:scene||'',spin:sp}:{scene:scene||'',lines:parts.join('\n')}}if(kind==='课程')body={mins:15,outline:parts.map((x,i)=>/^\d+\./.test(x)?x:(i+1)+'. '+x).join('\n')};
  return {k:ciUid(),file,dept,kind,title,subject:S.cfg.tax.subject.includes(subject)?subject:(subject||'通用'),scene:S.cfg.tax.scene.includes(scene)?scene:'不限',ability:S.cfg.tax.ability.includes(ability)?ability:'不限',aud:S.cfg.tax.aud.includes(aud)?aud:'全员',vis:vis||'全国',expire:/^\d{4}-\d{2}-\d{2}$/.test(expire)?expire:'',source,kw,body,type:'图文',assets:[],line}}
function ciAI(f,dept){ // 示意解析:真实环境由 agent 提取文本并建议类型 / 标题 / 关键词
  const nm=f.name,ext=(nm.split('.').pop()||'').toLowerCase();const out=[];const sbj=cKeyOf(nm);const K=CK[sbj];
  const asset={name:nm,kind:{mp4:'视频',mov:'视频',mp3:'音频',m4a:'音频',wav:'音频',ppt:'PPT',pptx:'PPT',pdf:'PDF',png:'图片',jpg:'图片',jpeg:'图片'}[ext]||'PDF',size:f.size,note:'导入时挂入'};
  const base={k:null,file:nm,dept,scene:'不限',ability:'场景化讲车',aud:'全员',vis:UI.role.type==='region'?'仅'+UI.role.region+'区域':'全国',expire:'',source:'',kw:'',assets:[asset]};
  if(['mp4','mov','mp3','m4a','wav','png','jpg','jpeg'].includes(ext)){
    const tit=nm.replace(/\.[^.]+$/,'');
    out.push(Object.assign({},base,{k:ciUid(),kind:'课程',title:tit,subject:/入职|新人/.test(nm)?'通用':K[0],type:asset.kind==='视频'?'视频':'图文',ability:/入职|新人/.test(nm)?'不限':'场景化讲车',aud:/新人|入职/.test(nm)?'新人':'全员',body:{outline:'1. '+(asset.kind==='音频'?'录音转写要点(示意):客户开场与第一反应':'内容要点(示意):核心场景与做法')+'\n2. 销冠的关键动作\n3. 常见错误\n4. 课后思考'},ai:true}));return out}
  const kind=/话术|讲法|口径|问答/.test(nm)?'话术':'课程';
  const keys=/汇编|手册/.test(nm)?['glc','aito']:[sbj];
  keys.forEach(key=>{const p=CK[key];const o=Object.assign({},base,{k:ciUid(),kind,subject:p[0],ai:true,source:/政策|国补|补贴/.test(nm)?nm.replace(/\.[^.]+$/,''):''});
    o.title=keys.length>1?p[0]+' 对比要点(摘自《'+nm.replace(/\.[^.]+$/,'')+'》)':nm.replace(/\.[^.]+$/,'').replace(/\d+月/g,'').trim()+(kind==='话术'?' 话术':'');
    if(kind==='话术'){o.kw=p[1];o.body={scene:'',spin:{S:'哥,'+p[2].replace(/^理解您会/,'您是不是也会').replace(/。$/,'')+'?',P:'客户拿着对比的车来问,顾问一不小心就会陷入参数和价格的拉扯。',I:'如果接不住,客户会觉得**说不清楚,不够专业**,转头去别家。',N:p.slice(3).join('')}};o.type='图文'}
    else{o.body={outline:'1. 背景:为什么客户会问到「'+p[0]+'」\n2. 要点一(摘自原文第 1~3 页)\n3. 要点二(摘自原文第 4~6 页)\n4. 常见问题'};o.type=asset.kind==='PDF'?'PDF':'图文'}
    out.push(o)});
  return out}
/* ---------- 课程链接 / 讲师手册：课程骨架 + 候选知识点 ----------
   前端无法直接跨域读取飞书正文，因此这里既支持「服务端解析后回填正文」的 linkText，
   也支持运营把讲师手册正文粘贴进来。解析结果只生成建议，确认后才写入内容库。 */
function ciCourseLinkCandidate(f){return !!(f&&f.link&&/课程|讲师|手册|课件|训练营|CEMN|购买层级/i.test(f.name+' '+(f.courseText||'')))}
function ciCourseText(f){return String((f&&(f.courseText||f.text))||'').trim()}
function ciCourseTitle(text,fallback){
  const t=String(text||'');
  const norm=s=>s.replace(/[【】]/g,'').replace(/——+/g,' · ').replace(/\s+/g,' ').trim();
  let m=t.match(/^#\s*(.+)$/m);if(m)return norm(m[1]).slice(0,40)||'课程';
  m=t.match(/^(.+?(?:讲师手册|课程|手册|课件))$/m);if(m)return norm(m[1]).slice(0,40)||'课程';
  const raw=String(fallback||'课程').replace(/^https?:\/\/[^\s/]+\/wiki\//,'');
  return norm(raw.replace(/[（(]?讲师手册[）)]?/g,'')).slice(0,40)||'课程';
}
function ciCourseSections(text){
  const t=String(text||'');
  const heads=[...t.matchAll(/^#{2,4}\s*(.+)$/gm)].map(m=>m[1].replace(/^[🎯📌📖💬❓⚠️🎮💡]+\s*/,'').trim()).filter(Boolean);
  return [...new Set(heads)].filter(h=>!/^课程概览|讲师必读|开篇$/.test(h));
}
function ciCourseAbility(text){
  const t=String(text||'');
  if(/CEMN|购买层级|Why Car|Why EV|Why MI|Why Now|诊断|卡点|关单/.test(t))return '顾虑解除';
  if(/探需|需求挖掘|用车场景|家庭几口/.test(t))return '探需';
  if(/带教|辅导|店长|例会/.test(t))return '带人辅导';
  return '场景化讲车';
}
function ciCourseKeywords(text){
  const t=String(text||'');const cand=['CEMN','购买层级','Why Car','Why EV','Why MI','Why Now','开放式提问','封闭式提问','反向验证','顾虑解除','关单','试驾','诊断','卡点'];
  return [...new Set(cand.filter(x=>t.includes(x)))].slice(0,8).join(', ');
}
function ciCourseOutline(text){
  const t=String(text||'');
  const modules=[
   ['课程目标与适用场景',/课程总目标|课程定位|适用场景|讲师要求/],
   ['CEMN 四个购买层级',/CEMN|四个层级|Why Car|Why EV|Why MI|Why Now/],
   ['层级诊断与反向验证',/诊断|反向验证|逐层上推|卡点/],
   ['开放式 / 封闭式提问',/开放式提问|封闭式提问|锁定范围|提问是/],
   ['顾虑解除与关单推进',/治疗|解除顾虑|推进|备货充分/],
   ['全流程演练与复盘',/全流程演练|案例|Log|总结|回顾/]
  ];
  const picked=modules.filter(x=>x[1].test(t)).map(x=>x[0]);
  return (picked.length?picked:['课程目标与适用场景','核心概念','诊断方法','推进与话术','练习与复盘']).map((x,i)=>(i+1)+'. '+x).join('\n');
}
function ciCourseLinkItem(f,st){
  const text=ciCourseText(f);if(!text)return null;
  const title=ciCourseTitle(text,f.name);
  const secs=ciCourseSections(text);
  const ability=ciCourseAbility(text);
  return {k:ciUid(),file:f.name,dept:st.dept||'课程资料导入',kind:'课程',title,subject:'通用',scene:'不限',ability,aud:/新人|入职/.test(text)?'新人':'全员',vis:UI.role.type==='region'?'仅'+UI.role.region+'区域':'全国',expire:'',source:f.name,kw:ciCourseKeywords(text),assets:[{name:f.name,kind:'外部链接',size:'-',note:'飞书课程原文'}],body:{mins:180,outline:ciCourseOutline(text),sections:secs,course:true,sourceText:text},type:'图文',ai:true,car:'通用车型',theme:'',line:null};
}
function ciCourseKpSuggestions(title,text){
  const t=String(title||'')+' '+String(text||'');const out=[];
  const add=(name,why,syn)=>{if(name&&!out.some(x=>x.name===name))out.push({name,why,type:'技能型',syn:syn||[]})};
  const isSpin=/SPIN|场景化讲车|场景化销售/.test(t);
  if(!isSpin)if(/CEMN|购买层级|四个层级|Why Car|Why EV|Why MI|Why Now/.test(t))add('CEMN 购买层级识别','课程把购买拆成四个层级，是本课的核心概念',['CEMN','四个 Why','购买层级']);
  if(!isSpin)if(/诊断|卡点|处在哪个层级/.test(t))add('客户购买层级诊断','课程要求先判断客户卡在哪一层，再决定推进动作',['层级诊断','卡点诊断']);
  if(!isSpin)if(/开放式提问|封闭式提问|锁定范围/.test(t))add('开放式与封闭式提问','课程明确区分收集范围和锁定范围两类提问',['开放式','封闭式','锁定']);
  if(!isSpin)if(/反向验证|逐层上推|往回推/.test(t))add('反向验证与逐层推进','课程用反向验证确认上一层级是否成立',['反向验证','逐层上推']);
  if(!isSpin)if(/顾虑|治疗|解除|推进/.test(t))add('顾虑解除与关单推进','课程把诊断后的动作定义为治疗、解除顾虑并推进',['治疗','关单','推进']);
  if(!isSpin)if(/演练|案例|Case|customer/i.test(t))add('CEMN 实战演练','课程包含案例、对练和全流程演练',['案例演练','对练']);
  /* 场景化讲车 / SPIN 类课程 */
  if(/SPIN|场景化/.test(t)){
    add('场景化讲车 SPIN 四步','课程把讲车拆成现状、问题、影响、方案四步',['SPIN','场景化讲车','四步']);
    add('从现状切入了解客户','先问家庭、职业、用车场景，再讲车',['现状','Situation','家庭信息']);
    add('找到并放大客户痛点','把生活里的不完美说出来，放大影响',['痛点','Problem','影响','Implication']);
    add('用产品方案回应场景','把卖点翻译成该场景下的解决方案',['需求','方案','Need','场景匹配']);
  }
  if(/案例|李先生|王哥|孙先生|刘叔/.test(t))add('场景化讲车案例演练','课程含多类客户案例，可做对练脚本',['案例','对练','角色扮演']);
  return out;
}
function ciCourseKpToCand(item,contentId){
  const suggests=ciCourseKpSuggestions(item.title,item.body&&item.body.sourceText||'');
  S.kpCand=S.kpCand||[];
  const existing=[];let n=0;
  suggests.forEach(s=>{
    const exist=S.kps.find(k=>aiNorm(k.name)===aiNorm(s.name));
    if(exist){existing.push(s.name);return}
    if(S.kpCand.some(x=>x.name===s.name&&x.st==='待确认')){existing.push(s.name+'（已在候选）');return}
    S.kpCand.push({id:'C'+(Math.max(0,...S.kpCand.map(x=>+String(x.id).replace(/\D/g,'')||0))+1),name:s.name,type:s.type,car:'通用车型',from:'课程导入：'+item.title,why:s.why,st:'待确认',sug:[],contentId:contentId||null});
    n++;
  });
  return {n,existing};
}
function ciCourseEditorHtml(){
  const st=ciState();const has=st.files.some(f=>f.link);
  if(!has)return '';
  const target=st.files.filter(f=>f.link).slice(-1)[0];
  return '<div class="card" style="border-color:#f3dc9b"><h3>课程链接 / 讲师手册</h3><div class="hint" style="margin-bottom:8px;line-height:1.7">飞书正文在浏览器里受登录态 / 跨域限制。生产接飞书应用后，服务端把正文回填到这里；Demo 里可上传 Markdown / TXT 讲师手册，或把正文粘贴到下框。系统只解析课程标题、章节和候选知识点，不会把整篇手册直接塞成图文课。</div>'
   +'<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px"><label class="btn sm" style="cursor:pointer">上传课程正文(.md / .txt)<input type="file" style="display:none" data-wc="ciCourseFile" accept=".md,.markdown,.txt"></label><button class="btn sm" data-act="ciCourseSample">载入 CEMN 示例</button><span class="hint">适合课程链接暂时抓不到正文时先用资料跑通流程</span></div>'
   +'<textarea class="w" id="ci_course_text" data-wc="ciCourseTextInput" style="width:100%;min-height:120px;font:12px/1.6 ui-monospace,monospace" placeholder="粘贴课程正文 / 讲师手册：支持 Markdown 标题，如 ## P1 · 课程总目标">'+esc((target&&target.courseText)||st.courseText||'')+'</textarea><div style="margin-top:8px"><button class="btn sm" data-act="ciCourseSet">应用到课程链接</button><span class="hint" style="margin-left:8px">只生成建议；确认页再采纳知识点</span></div></div>';
}
function ciCourseSampleText(){
  return `# 【CEMN-购买层级诊断与推进】——讲师手册
## P1 · 课程总目标
清楚客户购买有四个层级（CEMN）：Why Car、Why EV、Why MI、Why Now；能诊断客户所处层级；能解除顾虑并推进到下一层级。
## P3 · 概念讲解：CEMN 四个层级
四个 Why 是购买的四层理由，不是挑客工具。
## P22–P25 · 反向验证，逐层上推
从当前卡点往上一个层级提问，用封闭式问题确认上一层级是否成立。
## P27 · 开放式收集 · 封闭式锁定
开放式提问收集范围，封闭式提问锁定范围；没有锁定范围前不贸然解除顾虑。
## P29–P32 · 话术演练：一开放 + 一锁定
每个层级用一个开放问题收集，再用最后一句封闭式问题锁定层级。
## P39–P43 · 治疗话术共创
按四个层级准备推进理由与话术，小组共创、上台展示、AI 收纳资料库。
## P46–P48 · 全流程演练：诊断 + 治疗
先诊断具体层级和卡点，再开启治疗并尝试推进；案例难度逐步增加。`;
}
function ciSpinSampleText(){
  return `# 场景化讲车小技巧 — SPIN
## 常见讲车问题
习惯讲性能、参数、功能配置；习惯讲自己的车好在哪。
## 什么是场景化销售：4 步招术
Step1 从现状入手，了解对方的基本情况。
Step2 找到对方生活中有一点不完美的地方。
Step3 放大当前的不完美，挖掘痛点，暗示对方需要立即改变。
Step4 提供完美的解决方案，创造向往。
## 对应 SPIN
S Situation：用户的基本情况、现状（家庭信息、休闲方式、职业信息、现用车型与用车场景）。
P Problem：用户生活或者用车中的问题（麻烦、不方便、没法更好照顾家人）。
I Implication：问题不解决会带来的影响（时间精力成本、家庭和睦、身体健康）。
N Need：产品可以满足需求，激发向往（介绍功能、激发拥有冲动）。
## 案例一：李先生，三代同堂
一家五口，父母七十多岁腿脚不便上下车得扶，五岁女儿要坐安全座椅、放婴儿车。
担心底盘高了老人孩子迈不上来，低了老人弯腰难受。
父母出行意愿下降，慢慢就不愿意去了；等孩子大了老人也走不动了，陪伴家人的窗口期很短。
N90 Max 电动门开启 90 度、开口大，电动侧踏三节台阶，老人不用弯腰、小朋友不用爬。
## 案例二：王哥，写字楼午休
中午只有一小时，办公室没地方休息，只能趴桌睡，脖子酸手麻。
下午最累，没歇好脑子昏沉，长期颈椎腰椎受不了。
N70 后排一放倒就是大床模式，隐私玻璃一拉，安静睡一小时；接客户时就是独立会客空间。
## 案例三：孙先生，油车换新能源
开了十多年油车，最在意省心靠谱，又怕充电排队、续航没底。
担心续航焦虑、技术可靠、保值率三件事。
顾虑不解决就下不了决心，油费涨、老车掉价，犹豫本身也在花钱。
N90 Max 增程，综合续航 1700 多公里只加 92 号油，日常纯电一公里不到 1 毛，北方冬天电池不冻。
## 案例四：刘叔，退休自驾
退休时间自由，想和老伴走遍全国。
怕车操作复杂学不会，长途续航和充电不方便。
退休了更要趁身体好多走走，车学不会、怕趴窝，自驾游就变成受罪。
N90 Max 探索版按键沿用传统习惯，万事皆可小爱；综合续航 1600 多公里，后排放倒就是大床房。`;
}
A.ciCourseSet=()=>{const st=ciState();const txt=($('#ci_course_text')||{}).value||'';const target=st.files.filter(f=>f.link).slice(-1)[0];if(!target)return toast('先添加一个课程链接','err');if(!txt.trim())return toast('请粘贴课程正文','err');target.courseText=txt;st.courseText=txt;toast('已把正文挂到课程链接，解析时会生成课程骨架','ok');render()};
A.ciCourseFile=el=>{const f=el.files&&el.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const st=ciState();const txt=String(r.result||'');st.courseText=txt;const target=st.files.filter(x=>x.link).slice(-1)[0];if(target)target.courseText=txt;render();toast('已读取 '+f.name+'，解析时会生成课程骨架','ok')};r.readAsText(f,'utf-8')};
A.ciCourseSample=()=>{const st=ciState();st.courseText=ciCourseSampleText();const f=st.files.filter(x=>x.link).slice(-1)[0];if(f)f.courseText=st.courseText;render();toast('已载入 CEMN 示例正文','ok')};
function ciDup(it){const norm=s=>String(s||'').replace(/[\s·\-—_()()]/g,'');const a=norm(it.title);const first=bodyLines(it.kind,it.body)[0];
  return S.contents.find(c=>c.kind===it.kind&&c.st!=='草稿'&&(norm(c.title)===a||(a.length>6&&(norm(c.title).includes(a)||a.includes(norm(c.title))))||(first&&bodyLines(c.kind,c.body)[0]===first)))||null}
const ciState=()=>UI.sel.ci||(UI.sel.ci={files:[],text:'',link:'',dept:'',direct:false});
function pgImport(){
  const bid=UI.sel.ciB;if(bid&&S.cimps.find(b=>b.id===bid))return ciBatch(S.cimps.find(b=>b.id===bid));
  const st=ciState();const mine=S.cimps.filter(b=>UI.role.type==='hq'||b.cK===UI.role.k);
  return srcBar('<b>已有线下资料怎么进内容管理</b>:选文件 → 系统解析(Excel / CSV 逐行校验;PPT / Word / PDF 由 AI 提取文本并建议类型、标题、关键词、主题,长文可拆成多条;视频 / 音频 / 图片登记为素材)→ <b>你逐条确认、修改</b> → 进入「草稿」(也可勾选「我已核对,直接定稿」)。导入内容会标「线下资料导入」,保留原文件名和来源部门。')
   +'<div class="grid g2" style="grid-template-columns:3fr 2fr;align-items:start"><div class="card"><h3>① 选择资料</h3>'
   +'<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px"><label class="btn" style="cursor:pointer">选择文件(可多选)<input type="file" multiple style="display:none" data-wc="ciFile" accept=".csv,.txt,.xlsx,.xls,.pptx,.ppt,.docx,.doc,.pdf,.mp4,.mov,.mp3,.m4a,.wav,.png,.jpg,.jpeg"></label><button class="btn" data-act="ciSample">载入示例资料(演示)</button><button class="btn sm" data-act="ciDl">下载 CSV 模板</button></div>'
   +'<div class="fld" style="margin-bottom:10px"><label>或直接粘贴 CSV 内容</label><textarea class="w" id="cit" data-wc="ciText" placeholder="按模板列粘贴,首行为表头" style="min-height:70px;font-family:ui-monospace,monospace;font-size:12px;max-width:none">'+esc(st.text)+'</textarea></div>'
   +'<div class="fld" style="margin-bottom:10px"><label>飞书文档链接(可选)</label><div style="display:flex;gap:8px"><input type="text" data-wc="ciLink" value="'+esc(st.link)+'" placeholder="https://xxx.feishu.cn/docx/…" style="flex:1"><button class="btn sm" data-act="ciLinkAdd">添加</button></div><div class="fh">能抓取到正文的按文本解析；抓不到的降级为「外部链接」素材。课程类链接会先生成课程骨架 + 候选知识点，确认后才入库。</div></div>'
   +ciCourseEditorHtml()
   +(st.files.length?'<table class="t" style="margin-bottom:10px"><tr><th>文件 / 链接</th><th>大小</th><th></th></tr>'+st.files.map((f,i)=>'<tr><td>'+esc(f.name)+(f.text?' <span class="tag ok">CSV 逐行校验</span>':f.link?' <span class="tag blue">飞书链接</span>':' <span class="tag">AI 提取</span>')+'</td><td>'+esc(f.size)+'</td><td><button class="link err" data-act="ciRm" data-i="'+i+'">移除</button></td></tr>').join('')+'</table>':'')
   +'<div class="fgrid"><div class="fld"><label>来源部门(选填)</label><input type="text" data-wc="ciDept" value="'+esc(st.dept)+'" placeholder="如 华东培训组 / 产品部"></div><div class="fld"><label>可见范围</label><div class="hint" style="padding-top:8px">默认 '+(UI.role.type==='region'?'仅'+UI.role.region+'区域':'全国')+',确认页里逐条可改</div></div></div>'
   +'<div class="tag warn" style="display:block;margin:10px 0;white-space:normal;line-height:1.7;padding:6px 12px">涉密 / 未经授权的资料请不要上传;含价格、政策的资料请在确认页补有效期和出处。</div>'
   +'<button class="btn pri" data-act="ciRun">解析并进入确认</button></div>'
   +'<div class="card"><h3>各类资料怎么处理</h3><table class="t"><tr><th>资料</th><th>处理</th></tr><tr><td>Excel / CSV(话术清单、课程清单)</td><td>按模板逐行校验;错误行跳过并记录原因;一行 = 一条内容</td></tr><tr><td>Word / PPT / PDF</td><td>AI 提取文本 → 建议类型、标题、关键词、主题;汇编类长文可拆多条;原文件挂为素材</td></tr><tr><td>视频 / 音频 / 图片</td><td>登记为素材;AI 建议标题和要点(音频、视频可转写,示意);默认建成「课程」草稿</td></tr><tr><td>飞书文档</td><td>抓取正文后按文本处理;抓不到降级为外部链接素材</td></tr></table><div class="hint" style="margin-top:8px;line-height:1.8">CSV 列:'+CI_HEAD.join(' / ')+'。「正文」多条用「'+CI_SEP+'」隔开;课程「正文」会作为课程简介 / 图文内容。Excel 请先另存为 CSV(演示不直接解析 .xlsx)。</div></div></div>'
   +'<div class="card"><h3>导入批次记录 <span class="hint">谁导的、成功多少、失败原因;可整批撤销(已被学习项目引用的不能撤销)</span></h3>'+(mine.length?'<table class="t nw"><tr><th>批次</th><th>时间</th><th>导入人</th><th>文件</th><th>条数</th><th>结果</th><th>状态</th><th>操作</th></tr>'+mine.map(b=>'<tr><td><b>'+b.id+'</b></td><td>'+b.t+'</td><td>'+esc(cShort(b.who))+'</td><td style="white-space:normal;max-width:240px">'+b.files.map(f=>esc(f.name)).join('、')+'</td><td>'+b.items.length+'</td><td style="white-space:normal">'+(b.st==='待确认'?'<span class="hint">待确认</span>':'草稿 '+b.nDraft+' · 直接定稿 '+b.nStored+' · 跳过 '+b.nSkip+(b.bad.length?' · <span style="color:var(--err)">失败 '+b.bad.length+'</span>':''))+'</td><td>'+(b.st==='待确认'?'<span class="tag warn">待确认</span>':b.st==='已撤销'?'<span class="tag">已撤销</span>':'<span class="tag ok">已导入</span>')+'</td><td>'+(b.st==='待确认'?'<button class="link" data-act="ciOpen" data-id="'+b.id+'">去确认</button><button class="link err" data-act="ciDrop" data-id="'+b.id+'">放弃</button>':'<button class="link" data-act="ciOpen" data-id="'+b.id+'">查看</button>'+(b.st==='已导入'?'<button class="link err" data-act="ciUndo" data-id="'+b.id+'">撤销整批</button>':''))+'</td></tr>').join('')+'</table>':'<div class="hint">还没有导入记录。可以点「载入示例资料」体验一遍。</div>')+'</div>'}
A.ciFile=el=>{const st=ciState();[...el.files].forEach(f=>{const ext=(f.name.split('.').pop()||'').toLowerCase();const sz=f.size>1048576?(f.size/1048576).toFixed(1)+' MB':Math.max(1,Math.round(f.size/1024))+' KB';
  if(['csv','txt'].includes(ext)){const r=new FileReader();r.onload=()=>{st.files.push({name:f.name,size:sz,text:String(r.result)});render()};r.readAsText(f)}else st.files.push({name:f.name,size:sz})});if(![...el.files].some(f=>/\.(csv|txt)$/i.test(f.name))){render();toast('已添加 '+el.files.length+' 个文件','ok')}};
A.ciText=el=>{ciState().text=el.value};A.ciDept=el=>{ciState().dept=el.value};A.ciLink=el=>{ciState().link=el.value};
A.ciCourseTextInput=el=>{ciState().courseText=el.value};
A.ciSample=()=>{const st=ciState();st.files=CI_SAMPLES.map(s=>s.name==='话术清单_11月.csv'?Object.assign({},s,{text:ciSampleCsv()}):Object.assign({},s));st.dept=st.dept||'华东培训组 等';st.link='https://mi.feishu.cn/docx/DemoSalesTalk2026';A.ciLinkAdd();st.link=SPIN_URL;A.ciLinkAdd();toast('已载入示例资料:CSV、PPT、Word、视频、音频、2 个飞书链接(其中一个是团队 SPIN 话术文档)','ok')};
A.ciLinkAdd=()=>{const st=ciState();const v=(st.link||'').trim();if(!/^https?:\/\//.test(v))return toast('请填写 http(s) 链接','err');if(st.files.some(f=>f.name===v))return render();st.files.push({name:v,size:'-',link:1});st.link='';render()};
A.ciRm=el=>{ciState().files.splice(+el.dataset.i,1);render()};
A.ciDl=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+ciCsvTemplate()],{type:'text/csv;charset=utf-8'}));a.download='内容管理导入模板.csv';a.click();toast('已下载模板(含 2 行示例)','ok')};
A.ciRun=()=>{const st=ciState();const files=st.files.slice();if((st.text||'').trim())files.push({name:'粘贴的 CSV',size:'-',text:st.text});if(!files.length)return toast('请先选择文件、粘贴内容或添加链接','err');
  const items=[],bad=[];
  files.forEach(f=>{
    if(f.text!=null){const rows=ciCsvRows(f.text);if(!rows.length){bad.push(f.name+':内容为空');return}
      if(CI_HEAD.some((h,i)=>String(rows[0][i]||'').trim()!==h)){bad.push(f.name+':表头不对,应为 '+CI_HEAD.join(','));return}
      rows.slice(1).forEach((r,i)=>{const it=ciFromRow(r,i+2,f.name,st.dept);if(it.bad)bad.push(f.name+' '+it.bad);else items.push(it)})}
    else if(f.link&&/Z0Xsw1MwRihsXJklZe8cMSxdnhU/.test(f.name)){SPIN_DOC.forEach(x=>items.push({k:ciUid(),file:'销售话术积累(飞书文档)',dept:st.dept||'一线销售话术沉淀',kind:'话术',title:x.t+'(再次导入)',subject:'通用',scene:'不限',ability:'场景化讲车',aud:'全员',vis:UI.role.type==='region'?'仅'+UI.role.region+'区域':'全国',expire:'',source:f.name,kw:spinKw(x),assets:[{name:f.name,kind:'外部链接',size:'-',note:'飞书原文'}],body:{scene:x.t.split(' · ')[0]+'场景',spin:{S:x.S,P:x.P,I:x.I,N:x.N}},type:'图文',ai:true,car:x.car,theme:x.t.split(' · ')[0]}))}
    else if(f.link&&typeof ciCourseLinkCandidate==='function'&&ciCourseLinkCandidate(f)){
      const parsed=ciCourseLinkItem(f,st);if(parsed)items.push(parsed);else bad.push(f.name+':识别为课程链接，但没解析出课程结构；请确认链接可访问，或在正文里粘贴课程大纲');
    }
    else if(f.link){if(/feishu|larksuite/.test(f.name)){const o={k:ciUid(),file:f.name,dept:st.dept,kind:'课程',title:'销售话术沉淀(飞书文档)',subject:'通用',scene:'不限',ability:'不限',aud:'全员',vis:UI.role.type==='region'?'仅'+UI.role.region+'区域':'全国',expire:'',source:f.name,kw:'',assets:[{name:f.name,kind:'外部链接',size:'-',note:'飞书文档原链接'}],body:{outline:'1. 背景\n2. 做法\n3. 案例\n4. 注意事项'},type:'图文',ai:true};items.push(o)}
      else{bad.push(f.name+':无法抓取正文,已降级为外部链接素材,请在确认页补充正文');items.push({k:ciUid(),file:f.name,dept:st.dept,kind:'课程',title:'外部资料链接',subject:'通用',scene:'不限',ability:'不限',aud:'全员',vis:UI.role.type==='region'?'仅'+UI.role.region+'区域':'全国',expire:'',source:f.name,kw:'',assets:[{name:f.name,kind:'外部链接',size:'-'}],body:{outline:''},type:'外部链接',link:f.name})}}
    else ciAI(f,st.dept).forEach(it=>items.push(it))});
  items.forEach(it=>{if(it&&it.body&&it.body.course){it.kpSuggest=ciCourseKpSuggestions(it.title,it.body.sourceText||'');}});
  if(!items.length){S.cimps.unshift({id:'B'+(S.cimps.length+1),t:today+' '+new Date().toTimeString().slice(0,5),who:meFull(),cK:UI.role.k,files:files.map(f=>({name:f.name,size:f.size})),items:[],bad,st:'已导入',nDraft:0,nStored:0,nSkip:0,cids:[],direct:false});toast('没有可导入的内容:'+bad[0],'err');return render()}
  items.forEach(it=>{const d=ciDup(it);it.dup=d?d.id:null;it.act=d?'跳过':'新建';it.inc=true;if(typeof aiDecorateImportItem==='function')aiDecorateImportItem(it)});
  const b={id:'B'+(S.cimps.length+1),t:today+' '+new Date().toTimeString().slice(0,5),who:meFull(),cK:UI.role.k,files:files.map(f=>({name:f.name,size:f.size})),items,bad,st:'待确认',direct:false,cids:[],nDraft:0,nStored:0,nSkip:0};
  S.cimps.unshift(b);UI.sel.ciB=b.id;UI.sel.ci={files:[],text:'',link:'',dept:'',direct:false};toast('已解析出 '+items.length+' 条'+(bad.length?','+bad.length+' 处失败(见确认页)':'')+',请逐条确认','ok');render();$('#main').scrollTop=0};
A.ciOpen=el=>{UI.page='content';UI.tab.content='导入';UI.sel.ciB=el.dataset.id;render();$('#main').scrollTop=0};
A.ciOpenCand=el=>{const b=S.cimps.find(x=>x.id===el.dataset.id);const cid=b&&b.cids&&b.cids[0];closeDlg();UI.page='catalog';UI.tab.catalog='候选';if(cid)UI.sel.kpCandFrom='课程导入：'+(content(cid)||{}).title;render()};
A.ciBack=()=>{UI.sel.ciB=null;render()};
A.ciDrop=el=>{const i=S.cimps.findIndex(b=>b.id===el.dataset.id);S.cimps.splice(i,1);toast('已放弃该批次','ok');render()};
function ciCourseSuggestHtml(r){
  if(!(r&&r.kpSuggest&&r.kpSuggest.length))return '';
  return '<div class="hint" style="margin-top:6px">课程建议知识点（确认导入后进入「知识点 → 候选」待确认）</div>'+r.kpSuggest.map(x=>'<span class="tag pri" style="margin:2px 5px 2px 0">'+esc(x.name)+'</span>').join('')+'<div class="hint" style="margin-top:2px">'+r.kpSuggest.map(x=>esc(x.why)).join('；')+'</div>';
}
function ciBatch(b){
  const done=b.st!=='待确认';const sel=(i,k,arr,cur)=>'<select data-wc="ciSet" data-i="'+i+'" data-k="'+k+'" '+(done?'disabled':'')+'>'+(arr.includes(cur)?arr:arr.concat([cur])).map(o=>'<option '+(cur===o?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select>';
  let h='<div class="crumb"><a data-act="ciBack">导入内容</a> / 批次 '+b.id+'</div><div class="ph"><h2>批次 '+b.id+' · '+(done?(b.st==='已撤销'?'已撤销':'已导入'):'逐条确认')+' <span class="hint" style="font-weight:400">'+b.t+' · '+esc(cShort(b.who))+' · '+b.files.length+' 个来源 · '+b.items.length+' 条</span></h2></div>';
  if(b.bad.length)h+='<div class="card" style="border-color:var(--err)"><h3 style="color:var(--err)">解析失败 / 降级('+b.bad.length+')</h3>'+b.bad.map(x=>'<div class="hint" style="white-space:normal;line-height:1.8">· '+esc(x)+'</div>').join('')+'</div>';
  const rows=b.items;
  h+=srcBar(done?'这批内容已导入,明细如下。':'每条可以改类型、标题、主题、范围、有效期,也可以「跳过」。绿色「AI」= AI 提取 / 建议,请你核对;与库内相似的内容会提示,默认跳过,你可以选择「仍新建」或「作为新版本」。硬规则没满足的内容只能进草稿,不能直接定稿。'+(rows.some(r=>r.body&&r.body.course)?' <span class="tag warn">课程类导入：确认页可改能力维度 / 车型；确认后候选知识点在「知识点 → 候选」逐条确认并自动回挂课程。</span>':''))
   +'<div class="tw"><table class="t ci-table"><tr><th class="ci-col-check">'+(done?'':'<input type="checkbox" data-wc="ciAll" '+(rows.every(r=>r.inc)?'checked':'')+'>')+'</th><th>内容</th><th class="ci-col-kind">类型</th><th class="ci-col-meta">主题 · 范围 · 有效期</th><th class="ci-col-check-state">检查 · 重复</th></tr>'
   +rows.map((r,i)=>{const q=qcheck(qIn(r));const d=r.dup&&content(r.dup);
     return '<tr style="'+(r.inc?'':'opacity:.5')+'"><td>'+(done?'':'<input type="checkbox" data-wc="ciInc" data-i="'+i+'" '+(r.inc?'checked':'')+'>')+'</td><td style="min-width:260px;max-width:360px;white-space:normal">'+(done?esc(r.title):'<input type="text" data-wc="ciSet" data-i="'+i+'" data-k="title" value="'+esc(r.title)+'" style="width:100%">')+'<div class="hint" style="white-space:normal;line-height:1.6;margin-top:3px">'+(r.ai?'<span class="tag pri">AI 解析</span> ':'')+(r.aiKp&&r.aiKp.length?'<span class="tag warn">AI 已推荐 '+r.aiKp.length+' 个知识点</span> ':'')+esc(r.file)+(r.dept?' · '+esc(r.dept):'')+(r.line?' · 第 '+r.line+' 行':'')+'</div><div class="hint" style="white-space:normal;margin-top:2px">'+esc((bodyLines(r.kind,r.body)[0]||'').slice(0,46))+(r.assets.length?' · 素材:'+r.assets.map(a=>a.kind).join('/'):'')+'</div></td><td class="ci-col-kind">'+sel(i,'kind',KINDS,r.kind)+'</td><td class="ci-col-meta"><div class="ci-meta-grid">'+sel(i,'subject',S.cfg.tax.subject,r.subject)+(r.body&&r.body.course?'<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">'+sel(i,'ability',S.cfg.tax.ability,r.ability)+sel(i,'car',S.cfg.tax.car,r.car||'通用车型')+'</div>':'')+(UI.role.type==='region'?'<span class="hint">范围:'+esc(r.vis)+'</span>':sel(i,'vis',['全国'].concat(allRegions.map(x=>'仅'+x+'区域')),r.vis))+'<input type="date" data-wc="ciSet" data-i="'+i+'" data-k="expire" value="'+esc(r.expire)+'" '+(done?'disabled':'')+' title="有效期,空=长期"></div></td><td class="ci-col-check-state" style="white-space:normal">'+(q.hard.length?q.hard.map(x=>'<div class="chk must" style="margin:0 0 3px"><b>!</b><span>'+esc(x)+'</span></div>').join(''):'<span class="tag ok">硬规则通过</span>')+(q.soft.length?'<div class="hint" style="white-space:normal">提醒 '+q.soft.length+' 条</div>':'')+(d?'<div style="margin-top:5px"><span class="tag warn">重复</span> <a class="link" data-act="cView" data-id="'+d.id+'">'+d.id+'</a><div class="hint" style="white-space:normal">'+esc(d.title.slice(0,18))+'</div>'+(done?'<div class="hint">'+r.act+'</div>':'<select data-wc="ciSet" data-i="'+i+'" data-k="act">'+['跳过','仍新建','作为新版本'].map(o=>'<option '+(r.act===o?'selected':'')+'>'+o+'</option>').join('')+'</select>')+'</div>':'<div class="hint" style="margin-top:5px">重复：无</div>')+'</td></tr>'+(done?'':'<tr class="ci-airow"><td></td><td colspan="4">'+(typeof aiImportRecHtml==='function'?aiImportRecHtml(r,i,done):'')+ciCourseSuggestHtml(r)+ '</td></tr>')}).join('')+'</table></div>';
  if(!done){const n=rows.filter(r=>r.inc&&!(r.dup&&r.act==='跳过')).length;const okN=rows.filter(r=>r.inc&&!(r.dup&&r.act==='跳过')&&!qcheck(qIn(r)).hard.length).length;
    h+='<div class="card" style="border-color:var(--pri)"><label style="display:block;margin-bottom:8px"><input type="checkbox" data-wc="ciDirect" '+(b.direct?'checked':'')+'> 我已核对,硬规则通过的内容直接定稿(审核人 = 我本人,仍会留痕记录操作人)</label>'+(typeof rvBatchAsync==='function'?'<label style="display:block;margin-bottom:8px"><input type="checkbox" data-wc="ciAsync" '+(b.asyncRv?'checked':'')+'> 同时发起<b>异步评审</b>(不阻塞定稿;评审团事后评估,未通过会出待办提醒改版)'+(b.direct?'':' <span class="hint">仅对直接定稿的内容生效</span>')+'</label>':'')+'<div class="hint" style="margin-bottom:10px">本次将导入 <b>'+n+'</b> 条(跳过 '+(rows.length-n)+' 条);其中 <b>'+okN+'</b> 条硬规则通过,'+(b.direct?'将直接定稿':'默认进「草稿」,逐条编辑后提交审核')+';<b>'+(n-okN)+'</b> 条没满足硬规则,只能进草稿。</div><button class="btn pri" data-act="ciConfirm" data-id="'+b.id+'">确认导入 '+n+' 条</button> <button class="btn" data-act="ciBack">稍后再说(保留批次)</button> <button class="btn err" data-act="ciDrop" data-id="'+b.id+'">放弃整批</button></div>'}
  else h+='<div class="card"><h3>导入结果</h3><div class="grid g4"><div class="stat"><div class="l">进草稿</div><div class="n">'+b.nDraft+'</div></div><div class="stat"><div class="l">直接定稿</div><div class="n">'+b.nStored+'</div></div><div class="stat"><div class="l">跳过</div><div class="n">'+b.nSkip+'</div></div><div class="stat"><div class="l">失败</div><div class="n" style="color:'+(b.bad.length?'var(--err)':'inherit')+'">'+b.bad.length+'</div></div></div>'+(b.cids.length?'<div style="margin-top:10px">生成的内容:'+b.cids.map(id=>content(id)?'<a class="link" data-act="cView" data-id="'+id+'" style="margin-right:8px">'+id+'</a>':'<span class="hint">'+id+'(已撤销)</span>').join('')+'</div>':'')+(b.kpCandN?'<div style="margin-top:6px"><span class="tag warn">课程建议知识点 '+b.kpCandN+' 个</span> <a class="link" data-act="ciOpenCand" data-id="'+b.id+'">去「知识点 → 候选」确认</a> <span class="hint">确认后会回挂到这节课程</span></div>':(b.kpCandExist&&b.kpCandExist.length?'<div style="margin-top:6px"><span class="tag">课程建议知识点均已有对应项</span> <span class="hint">已存在：'+b.kpCandExist.slice(0,6).map(esc).join('、')+'</span></div>':''))+(b.st==='已导入'?'<div style="margin-top:10px"><button class="btn err" data-act="ciUndo" data-id="'+b.id+'">撤销整批</button> <span class="hint">已被学习项目引用的不能撤销</span></div>':'')+'</div>';
  return h}
A.ciSet=el=>{const b=S.cimps.find(x=>x.id===UI.sel.ciB);const r=b.items[+el.dataset.i];const k=el.dataset.k;const v=el.type==='checkbox'?el.checked:el.value;r[k]=v;if(k==='kind'){r.type=KIND_META[r.kind].fmt;const lines=bodyLines(r.kind,r.body);if(!lines.length)r.body={}}if(k==='title'){const d=ciDup(r);r.dup=d?d.id:null;r.act=d?'跳过':'新建'}render()};
A.ciInc=el=>{const b=S.cimps.find(x=>x.id===UI.sel.ciB);b.items[+el.dataset.i].inc=el.checked;render()};
A.ciAll=el=>{const b=S.cimps.find(x=>x.id===UI.sel.ciB);b.items.forEach(r=>r.inc=el.checked);render()};
A.ciAsync=el=>{S.cimps.find(x=>x.id===UI.sel.ciB).asyncRv=el.checked;render()};
A.ciDirect=el=>{S.cimps.find(x=>x.id===UI.sel.ciB).direct=el.checked;render()};
A.ciConfirm=el=>{const b=S.cimps.find(x=>x.id===el.dataset.id);const me=meFull();let nD=0,nS=0,nK=0;const touched=[];
  b.items.forEach(r=>{if(!r.inc||(r.dup&&r.act==='跳过')){nK++;return}
    const q=qcheck(qIn(r));const store=b.direct&&!q.hard.length;
    const sug=inferSug(r.title+' '+r.subject,'');
    if(r.dup&&r.act==='作为新版本'){const c=content(r.dup);c.body=JSON.parse(JSON.stringify(r.body));c.kw=r.kw||c.kw;c.assets=c.assets.concat(JSON.parse(JSON.stringify(r.assets)));const kps=(r.kps||[]).slice();const mainKp=r.mainKp||kps[0]||'';c.kps=kps;c.kpRole={};kps.forEach(kid=>{c.kpRole[kid]=r.kpRole&&r.kpRole[kid]||(kid===mainKp?'主讲解':'提及')});c.mainKp=mainKp;c.tags=(r.tags||[]).slice();c.st='草稿';c.ver++;chist(c,'线下资料导入为新版本 v'+c.ver,'来自 '+r.file+'(批次 '+b.id+'),审核通过后生成新版本;已引用的项目继续用锁定版本');touched.push(c.id);nD++;return}
    const role={};const kps=(r.kps||[]).slice();const mainKp=r.mainKp||kps[0]||'';kps.forEach(kid=>{role[kid]=r.kpRole&&r.kpRole[kid]||(kid===mainKp?'主讲解':'提及')});const c=cEnsure({id:nextCid(),car:r.car||'通用车型',theme:r.theme||'',title:r.title.trim(),kind:r.kind,type:r.type,lecturer:UI.role.name,cat:r.cat||catOf({subject:r.subject,title:r.title}),vis:r.vis,script:r.kind==='话术'?1:0,src:'培训部编写',srcTag:'',kw:r.kw||'',topic:'',up:0,down:0,orig:0,ver:1,hist:[],vers:[],creator:me,cK:UI.role.k,rK:UI.role.k,rName:me,created:today,body:JSON.parse(JSON.stringify(r.body)),sug,subject:r.subject,scene:r.scene,ability:r.ability,aud:r.aud,expire:r.expire||'',source:r.source||'',assets:JSON.parse(JSON.stringify(r.assets)),origin:'线下资料导入',srcFile:r.file,srcDept:r.dept||'',batch:b.id,st:store?'已定稿':'草稿',kps,kpRole:role,mainKp,tags:(r.tags||[]).slice()});
    chist(c,'线下资料导入('+b.id+')','来自「'+r.file+'」'+(r.dept?'('+r.dept+')':'')+(r.ai?',AI 提取后由 '+meShort()+' 确认':',CSV 第 '+r.line+' 行')+(store?';勾选「我已核对」,直接定稿,审核人 '+meShort():';进入草稿待编辑'));
    if(r.body&&r.body.course){const cr=ciCourseKpToCand({title:r.title,body:r.body},c.id);b.kpCandN=(b.kpCandN||0)+cr.n;if(cr.existing.length){b.kpCandExist=(b.kpCandExist||[]).concat(cr.existing)}}
    if(store){c.vers=[{v:1,t:today,who:meShort(),note:'导入时已核对,直接定稿',snap:snapOf(c)}];nS++}else nD++;
    S.contents.unshift(c);b.cids.push(c.id)});
  let nR=0;if(b.asyncRv&&nS&&typeof rvBatchAsync==='function'){nR=rvBatchAsync('content',b.cids.filter(id=>{const c=content(id);return c&&c.st==='已定稿'}),'导入批次 '+b.id+' 直接定稿,事后补评审')}
  Object.assign(b,{st:'已导入',nDraft:nD,nStored:nS,nSkip:nK,touched,nRv:nR});notify('导入批次 '+b.id+' 完成:草稿 '+nD+'、直接定稿 '+nS+'、跳过 '+nK);toast('已导入:草稿 '+nD+' 条,直接定稿 '+nS+' 条,跳过 '+nK+' 条'+(nR?',已发起异步评审 '+nR+' 条':''),'ok');render()};
A.ciUndo=el=>{const b=S.cimps.find(x=>x.id===el.dataset.id);const used=b.cids.filter(id=>content(id)&&contentUse(id)>0);
  if(used.length)return toast('不能撤销:'+used.map(id=>content(id).title).slice(0,2).join('、')+' 已被学习项目引用。请先到项目里处理,或只对单条内容下线','err');
  b.cids.forEach(id=>{const i=S.contents.findIndex(c=>c.id===id);if(i>=0)S.contents.splice(i,1)});b.st='已撤销';toast('已撤销整批('+b.cids.length+' 条内容已删除)'+((b.touched||[]).length?';作为新版本合并的 '+b.touched.length+' 条保留,请到对应内容里处理':''),'ok');render()};
