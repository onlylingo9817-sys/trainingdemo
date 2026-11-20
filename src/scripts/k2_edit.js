const CK={ // 主题库:[对象, 关键词组, 三句话术]
 glc:['奔驰 GLC','同价位, 配置折算, 价格折算','理解您会拿 GLC 一起比,这是同价位里最常被比的一款。','同样的预算,我帮您把配置折算一下:座舱、智驾、补能这几项,折下来我们多给您的价值(具体数值以最新价格政策为准)。','所以不是贵,是同价位您拿到的更多。您更看重哪一块?我们重点体验。'],
 aito:['问界 M8','同价位, 空间, 智驾体验','问界 M8 确实很多客户在比,尤其看重家用空间。','我们先看您实际用车场景:几个人坐、多久跑一次长途。按您的场景,我把两款的空间和补能体验对一下。','对完您再决定,今天可以两款都试,体验差异最直接。'],
 zeekr:['极氪 7X','价值对比, 续航, 价格','极氪最近价格动作比较大,您关注价格是对的。','价格之外,建议您把三年的使用成本、补能网络和保值率一起算。','我帮您列一张对比表,您对着看,再来试驾确认。'],
 modely:['特斯拉 Model Y','实测续航, CLTC, 智驾','Model Y 是很好的对比对象,您想重点看哪一方面?','续航我们用实测数据说话(以公开测试结果为准),不只看标称值。','您可以直接做一次同路线试驾,对比续航和辅助驾驶的真实体验。'],
 policy:['国补 / 地补','国补, 地补, 叠加','先和您确认一下:国补和地补是可以叠加享受的,具体以您所在省市的最新口径为准。','我帮您按您的车型和所在地算一下,国补多少、地补多少,叠加后实际到手价是多少。','需要的材料我现在列给您,今天确定的话我们当场协助办理。'],
 invite:['邀约试驾','这周末, 方便, 预约','王先生,这周六上午或周日下午,您哪个时间方便来体验一下?','给您留一个 40 分钟的试驾位,您到店直接找我就行。','我把时间和地址发您微信,前一天再提醒您一次。'],
 need:['探需','用车场景, 家里几口人, 预算','咱们先不急着看车,我想先了解一下您平时主要怎么用车?','家里几口人、上下班多远、周末会不会跑长途?这些决定了哪款更适合您。','了解下来,我给您推荐最合适的一款,再安排试驾。'],
 price:['价格异议','价值锚点, 总拥有成本, 保值率','您觉得价格有压力,这很正常,说明您在认真比。','我们不只看买车这一刻,三年的使用成本、保值率和权益一起算,总拥有成本其实更低。','我把这笔账给您算出来,您看哪一项是您最在意的。'],
 greet:['展厅接待首句','欢迎, 您好, 看车','您好,欢迎来小米汽车,今天主要想了解哪款车?','您先随便看,有任何问题我就在旁边,需要的话随时叫我。','我先给您倒杯水,您想先看外观还是先坐进去体验一下?'],
 gen:['通用场景','关键场景, 价值','先理解客户关注点,用一句话复述确认。','再给出一个具体的事实或数据,而不是空泛的优点。','最后用一个小问题推进下一步动作(试驾 / 到店 / 留资)。']};
function cKeyOf(txt){return /GLC|奔驰/.test(txt)?'glc':/问界|M8/.test(txt)?'aito':/极氪|7X/.test(txt)?'zeekr':/Model Y|特斯拉/.test(txt)?'modely':/国补|地补|以旧换新|补贴|政策/.test(txt)?'policy':/邀约|约试驾/.test(txt)?'invite':/问候|接待/.test(txt)?'greet':/探需/.test(txt)?'need':/价格|贵|让价/.test(txt)?'price':'gen'}
function inferSug(all,o){let sug;
  if(/GLC|竞品|对比|特斯拉|问界|极氪/.test(all))sug={type:'专题训',sub:'强竞品',ind:'I1',kw:'同价位, 配置折算',trig:o||'竞品名',base:31};
  else if(/政策|补贴|国补|地补|以旧换新/.test(all))sug={type:'专题训',sub:'政策类',ind:'I1',kw:'国补, 地补, 叠加',trig:o||'政策名',base:42};
  else if(/邀约|约试驾/.test(all))sug={type:'专题训',sub:'技能类·约试驾',ind:'I2',kw:'这周末, 方便, 预约',trig:'发出邀约',base:38};
  else if(/探需/.test(all))sug={type:'专题训',sub:'技能类·探需',ind:'I3',kw:'',trig:'',base:40};
  else if(/新人/.test(all))sug={type:'新人训',sub:'',ind:'I5',kw:'',trig:'',base:77};
  else sug={type:'专题训',sub:'短板类',ind:'I3',kw:'',trig:'',base:40};
  return sug}

/* ---------- 新增 / 编辑页:沿用现有「内容管理 → 新建内容」单列表单(label 在左、控件在右、底部固定按钮),
   AI 生成放在最上面一个可折叠面板,生成结果直接填进下面的表单;人逐项改完再提交 ---------- */
let C=null;
const REF_T=['销冠讲法','线下资料','已有内容','语料片段','我的笔记'];
const TOPIC_TAGS=['新车上市','竞品攻防','政策口径','新人培训','价格异议','邀约试驾'];
function altOf(t){const p=String(t).split(/[,。;?!?]/).map(x=>x.trim()).filter(Boolean);if(p.length>2)return p[0]+'。'+p[p.length-1]+'。';return String(t).replace(/您/g,'你').replace(/。$/,'')+'(口语版)'}
const cDefVis=()=>UI.role.type==='region'?'仅'+UI.role.region+'区域':'全国';
function cBlank(o){return Object.assign({id:null,kind:'话术',type:'图文',lecturer:UI.role.name&&LECTURERS.includes(UI.role.name)?UI.role.name:LECTURERS[0],cover:'',chan:['汽车销售'],vis:cDefVis(),tags:[],intro:'',items:[],spin:{S:'',P:'',I:'',N:''},aiSpin:null,car:'通用车型',theme:'',bscene:'',kw:'',assets:[],link:'',title:'',cat:'销售技巧',recOn:false,recUntil:'',publishType:'立即发布',publishTime:'',authority:0,subject:'通用',scene:'不限',ability:'不限',aud:'全员',expire:'',source:'',aiOpen:false,gen:'idle',tid:'',goal:'',desc:'',req:'',refs:[],rnew:{t:'销冠讲法',v:''},aiItems:[],srcTag:'',origin:'手工编写',rv:0,lnk:'',subjectAuto:true,kps:[],kpRole:{},mainKp:''},o||{})}
const aiSpinOf=L=>{const o={S:'',P:'',I:'',N:''};L.forEach(x=>{const m=String(x).match(/^([SPIN])：([\s\S]*)$/);if(m)o[m[1]]=m[2]});return o};
function cFromC(c){c=cEnsure(c);c.mainKp=c.mainKp||(c.kps||[])[0]||'';c.kpRole=Object.assign({},c.kpRole||{});(c.kps||[]).forEach(kid=>{c.kpRole[kid]=c.kpRole[kid]||(kid===c.mainKp?'主讲解':'补充材料')});const sp=c.kind==='话术'?(c.body.spin?Object.assign({S:'',P:'',I:'',N:''},c.body.spin):{S:'',P:'',I:'',N:spl(c.body.lines).join('\n')}):{S:'',P:'',I:'',N:''};const L=[];return cBlank({kps:(c.kps||[]).slice(),kpRole:Object.assign({},c.kpRole||{}),mainKp:c.mainKp||'',spin:sp,legacy:c.kind==='话术'&&!c.body.spin&&!!spl(c.body.lines).length,car:c.car||'通用车型',theme:c.theme||'',id:c.id,kind:c.kind,type:c.type,lecturer:c.lecturer,cover:c.cover==='默认封面.png'?'':c.cover,chan:(c.chan||[]).slice(),vis:c.vis,tags:(c.tags||[]).slice(),intro:c.kind==='课程'?(c.body.outline||''):'',items:L,bscene:c.body.scene||'',kw:c.kw||'',assets:JSON.parse(JSON.stringify(c.assets||[])),link:c.link||'',title:c.title,cat:c.cat,recOn:!!(c.recommend&&c.recommend.on),recUntil:(c.recommend&&c.recommend.until)||'',publishType:c.publishType,publishTime:c.publishTime||'',authority:c.authority||0,subject:c.subject,scene:c.scene,ability:c.ability,aud:c.aud,expire:c.expire||'',source:c.source||'',aiOpen:false,gen:'done',tid:c.topic||'',goal:c.goal||'',desc:c.desc||'',req:c.req||'',refs:JSON.parse(JSON.stringify(c.refs||[])),aiItems:(c.aiLines||[]).slice(),aiSpin:(c.aiLines||[]).length&&c.body.spin?aiSpinOf(c.aiLines):null,srcTag:c.srcTag||'',origin:c.origin,subjectAuto:false})}
function cAsObj(){ // 把表单状态转成可检查的内容对象
  const body=C.kind==='话术'?{scene:C.bscene,spin:{S:(C.spin.S||'').trim(),P:(C.spin.P||'').trim(),I:(C.spin.I||'').trim(),N:(C.spin.N||'').trim()}}:{outline:C.intro};
  return {id:C.id,kind:C.kind,type:C.type,title:C.title,lecturer:C.lecturer,cover:C.cover,chan:C.chan,link:C.link,assets:C.assets,body,kw:C.kw,subject:C.subject,expire:C.expire,source:C.source}}
A.cNew=el=>{if(!['hq','region'].includes(UI.role.type))return toast('当前身份不能新增内容','err');UI.sel.cAiStale=false;
  const tid=(el&&el.dataset&&el.dataset.t)||'';const t=tid&&topic(tid);C=cBlank({tid,aiOpen:!!(el&&el.dataset&&(el.dataset.ai||el.dataset.t))});
  if(t){C.kind=['强竞品','政策类','技能类·约试驾'].includes(t.sug.sub)?'话术':'课程';cFromTopic(t);if(t.kpId){C.kps=[t.kpId];const kk=kp(t.kpId);if(kk&&kk.car&&kk.car!=='通用车型')C.car=kk.car}}
  if(C.kind==='课程')C.type='图文';
  UI.page='cedit';render();$('#main').scrollTop=0};
function cFromTopic(t){const i=ind(t.sug.ind);C.goal='让顾问遇到「'+(t.obj&&t.obj!=='-'?t.obj:t.title.slice(0,10))+'」相关场景时能讲对、讲全'+(i?',提升「'+i.name+'」':'');C.desc=t.desc||t.title;const k=CK[cKeyOf(t.title+t.obj+(t.sug.kw||''))];if(k&&C.subjectAuto)C.subject=k[0]}
A.cEdit=el=>{closeDlg();C=cFromC(content(el.dataset.id));UI.sel.cAiStale=false;UI.page='cedit';render();$('#main').scrollTop=0};
document.addEventListener('input',e=>{const el=e.target;if(el.dataset&&el.dataset.cf&&C){setPath(C,el.dataset.cf,el.value);cLive();if(UI.sel.cAiStale!==false)UI.sel.cAiStale=true;const adv=document.querySelector('#cKpAdv');if(adv)adv.classList.add('stale')}});
function cLive(){const e=$('#qcbox');if(e&&C)e.innerHTML=qcHtml();const p=$('#spinpv');if(p&&C)p.innerHTML=spinHtml(C.spin)}
const SPIN_HINT={S:'情境:客户现在的场景 / 一句话开场(称呼 + 具体场景)',P:'痛点:这个场景下客户遇到的难处',I:'影响:不解决会怎样(把后果加亮)',N:'需求-收益:我们的产品怎么解决,带上客户的感受'};
A.spinHl=el=>{const t=$('#sp_'+el.dataset.k);const s=t.selectionStart,e=t.selectionEnd;if(s===e)return toast('先在文本框里选中要加亮的短语','err');const v=t.value;C.spin[el.dataset.k]=v.slice(0,s)+'**'+v.slice(s,e)+'**'+v.slice(e);render()};
A.spinUn=el=>{C.spin[el.dataset.k]=(C.spin[el.dataset.k]||'').replace(/\*\*/g,'');render()};
A.cset=el=>{const k=el.dataset.k;C[k]=el.type==='checkbox'?(el.checked?1:0):el.value;if(k==='subject')C.subjectAuto=false;if(k==='tid'){const t=el.value&&topic(el.value);if(t&&!C.goal.trim()&&!C.desc.trim())cFromTopic(t)}if(k==='recOn')C.recOn=el.checked;if(k==='authority')C.authority=el.checked?1:0;render()};
A.cchan=el=>{C.chan=el.checked?[...new Set(C.chan.concat(el.value))]:C.chan.filter(x=>x!==el.value);render()};
A.ctag=el=>{const v=el.dataset.v;C.tags=C.tags.includes(v)?C.tags.filter(x=>x!==v):C.tags.concat(v);render()};
A.ckind=el=>{if(C.kind===el.dataset.v)return;C.kind=el.dataset.v;if(C.kind==='话术')C.type='图文';if(C.gen==='done'&&!C.id&&C.aiItems.length){C.spin={S:'',P:'',I:'',N:''};C.intro='';C.aiItems=[];C.gen='idle'}render()};
A.ctype=el=>{C.type=el.dataset.v;render()};
A.cCover=el=>{const f=el.files[0];if(!f)return;if(!/\.(jpg|jpeg|png)$/i.test(f.name))return toast('封面图格式需为 JPG / PNG(尺寸 324×220)','err');C.cover=f.name;render()};
A.cCoverDemo=()=>{C.cover='示例封面_324x220.png';render()};
A.cCoverDel=()=>{C.cover='';render()};
A.cAiToggle=()=>{C.aiOpen=!C.aiOpen;render()};
A.cGen=()=>{if(!C.goal.trim()||!C.desc.trim())return toast('请填写「目标」和「描述」,agent 才知道要生成什么','err');
  C.gen='running';const at=new Date().toTimeString().slice(0,5);const t=C.tid&&topic(C.tid);const p=C.kind+' / '+(t?t.id+' '+t.title.slice(0,14):'无课题')+' / '+C.goal.slice(0,16)+(C.refs.length?' / 参考素材 '+C.refs.length+' 项':'');
  render();tmr.push(setTimeout(()=>{if(!C||C.gen!=='running')return;
    if(S.agentDown){C.gen=spinPlain(C.spin)||C.intro||C.title?'done':'fail';S.agentCalls.unshift({t:today+' '+at,p:'生成内容:'+p,ok:false,dur:30,ver:'v1.2'});toast('agent 超时,可重试;也可以直接手工填写下面的表单','err')}
    else{const d=genDraft(C);C.title=d.title;C.kw=d.kw;C.srcTag=d.srcTag;if(C.subjectAuto)C.subject=d.subject;C.scene=d.scene;C.ability=d.ability;C.cat=catOf({subject:C.subject,title:C.title});C.origin='AI 生成';
      if(C.kind==='话术'){C.spin=d.spin;C.theme=C.theme||d.theme;C.bscene=d.bscene;C.legacy=false;C.aiItems=bodyLines('话术',{spin:d.spin});C.aiSpin=JSON.parse(JSON.stringify(d.spin))}else{C.intro=d.intro;C.aiItems=spl(d.intro)}
      if(isPolicy({subject:C.subject,title:C.title})&&!C.expire)C.expire=addDays(today,90);C.gen='done';
      S.agentCalls.unshift({t:today+' '+at,p:'生成内容:'+p,ok:true,n:1,dur:+(4+hsh(p)%7).toFixed(1),ver:'v1.2'});toast('agent 已返回初稿并填进下面的表单。接下来由你逐项取舍、改写,再提交审核','ok')}
    if(UI.page==='cedit')render()},1800))};
function genDraft(C){
  const t=C.tid&&topic(C.tid);const refTxt=C.refs.map(r=>r.t+' '+r.label+' '+(r.text||'')).join(' ');const txt=(t?t.title+t.obj+(t.sug.kw||''):'')+C.goal+C.desc+C.req+refTxt;const K=CK[cKeyOf(txt)];
  const sess=t&&t.stats&&t.stats.sess?t.stats.sess:300+hsh(txt)%900,top=3+hsh(txt)%6;
  const rf=C.refs.length?';整合你放入的参考素材 '+C.refs.length+' 项('+C.refs.map(r=>r.t).join('、')+')':'';
  const srcTag='销冠语料蒸馏:近 14 天 '+sess+' 条会话,'+top+' 位销冠的共同讲法(示意)+ 你填写的目标 / 描述 / 要求'+rf;
  const o=K[0],kw=K[1];const d={srcTag,theme:'',kw:C.kind==='话术'?kw:'',subject:o,scene:t?t.scene:'不限',ability:/价格|让价/.test(txt)?'顾虑解除':/探需/.test(txt)?'探需':'场景化讲车',items:[],intro:'',bscene:''};
  const mine=C.refs.filter(r=>['销冠讲法','我的笔记'].includes(r.t)&&(r.text||'').trim()).map(r=>r.text.trim());
  if(C.kind==='话术'){d.title=(d.theme=/价格|让价/.test(txt)?'顾虑处理':/邀约/.test(txt)?'邀约到店':/政策|国补/.test(txt)?'政策口径':'场景化讲车')+' · '+o+(/邀约/.test(o)?'约时间':'');
    const need=(t&&t.desc)||C.desc||'';const sit=need.split(/[。\n]/)[0].slice(0,60)||('客户谈到「'+o+'」');
    d.spin={S:'哥，'+sit+'，对吧？',P:(C.goal||'').slice(0,60)?'这时候最怕的是：'+C.goal.replace(/^让/,'').slice(0,50)+'没做到，客户越聊越犹豫。':'这时候客户心里其实是有顾虑的，只是没说出口。',I:'如果这一步没接住，客户会拿着疑问去别家比，**成交就拖长甚至丢掉**。',N:(mine.length?mine.join('\n'):K.slice(2).join(''))};
    d.bscene=t?t.scene+'环节,'+(t.obj&&t.obj!=='-'?'客户提到「'+t.obj+'」时':'客户提出异议时'):'客户提到「'+o+'」时'}
  else{d.title=o+' · '+(C.goal.slice(0,12)||'讲清要点');const L=['为什么客户会问到「'+o+'」','销冠怎么讲(三步法,附真实对话)'].concat(mine).concat(['常见异议与应对','避免的说法(禁说词)','课后练习:用自己的话复述一遍']);d.intro=L.map((x,i)=>(i+1)+'. '+x).join('\n')}
  return d}
function qcHtml(){const q=qcheck(cAsObj());
  return q.hard.length||q.soft.length?q.hard.map(x=>'<div class="chk must"><b>!</b><span>'+esc(x)+' <span style="color:var(--err)">(提交审核前必须补)</span></span></div>').join('')+q.soft.map(x=>'<div class="chk rec"><b>·</b><span>'+esc(x)+' <span class="hint">(提醒,你决定)</span></span></div>').join(''):'<div class="chk ok"><b>✓</b><span>全部通过</span></div>'}
A.cRefAdd=()=>{const r=C.rnew;if(!(r.v||'').trim())return toast('请填写参考素材的内容或选择已有内容','err');
  if(r.t==='已有内容'){const c=content(r.v);C.refs.push({t:r.t,label:c.title,text:bodyLines(c.kind,c.body).slice(0,3).join(' ')})}else C.refs.push({t:r.t,label:(r.t==='线下资料'||r.t==='语料片段')?r.v.slice(0,30):r.v.slice(0,18)+(r.v.length>18?'…':''),text:r.t==='线下资料'?'':r.v});
  C.rnew={t:r.t,v:''};render()};
A.cRefDel=el=>{C.refs.splice(+el.dataset.i,1);render()};
A.crt=el=>{C.rnew={t:el.value,v:''};render()};
A.cItRe=el=>{const i=+el.dataset.i;C.items[i]=altOf(C.items[i]);toast('已让 agent 重写这一句(示意);不满意可以直接改','ok');render()};
A.cItDel=el=>{C.items.splice(+el.dataset.i,1);render()};
A.cItAdd=()=>{C.items.push('');render()};
A.cItMove=el=>{const i=+el.dataset.i,j=i+ +el.dataset.d;if(j<0||j>=C.items.length)return;const t=C.items[i];C.items[i]=C.items[j];C.items[j]=t;render()};
A.cAsset=el=>{const f=el.files[0];if(!f)return;const ext=(f.name.split('.').pop()||'').toLowerCase();const kd={mp4:'视频',mov:'视频',pdf:'PDF',ppt:'PPT',pptx:'PPT',mp3:'音频',m4a:'音频',wav:'音频',png:'图片',jpg:'图片',jpeg:'图片'}[ext]||'PDF';
  if(el.dataset.need==='视频'&&kd!=='视频')return toast('请上传 mp4 / mov 格式视频','err');if(el.dataset.need==='PDF'&&kd!=='PDF')return toast('请上传 PDF 文件,最大 100MB','err');
  C.assets.push({name:f.name,kind:kd,size:f.size>1048576?(f.size/1048576).toFixed(1)+' MB':Math.max(1,Math.round(f.size/1024))+' KB',note:'本次上传'});toast('已添加:'+f.name+(FMT_NEW.includes(kd)?'(PPT / 音频需要学堂新增上传能力)':''),'ok');render()};
A.cAssetDemo=el=>{const k=el.dataset.k;C.assets.push({name:k==='视频'?'示例视频.mp4':k==='PDF'?'示例资料.pdf':'示例附件.pptx',kind:k,size:k==='视频'?'86 MB':'3.2 MB',note:'演示用占位'});render()};
A.cAssetDel=el=>{C.assets.splice(+el.dataset.i,1);render()};
const FR=(label,ctl,o)=>{o=o||{};return '<div class="fr"><div class="flb">'+(o.req?'<b>*</b>':'')+label+(o.nw?NEW:'')+'</div><div class="fc">'+ctl+(o.h?'<div class="fh">'+o.h+'</div>':'')+'</div></div>'};
function pgContentEdit(){
  if(!C){UI.page='content';return pgContent()}
  const t=C.tid&&topic(C.tid);const km=KIND_META[C.kind];const tax=S.cfg.tax;const rn=C.rnew;
  const sel=(k,arr,cur)=>'<select data-wc="cset" data-k="'+k+'">'+(arr.includes(cur)?arr:arr.concat([cur])).map(o=>'<option '+(cur===o?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select>';
  const vopts=UI.role.type==='region'?['仅'+UI.role.region+'区域']:['全国'].concat(allRegions.map(r=>'仅'+r+'区域'));
  const upl=(need,label)=>{const a=C.assets.filter(x=>x.kind===need);return (a.length?a.map(x=>'<div style="margin-bottom:6px"><span class="tag">'+x.kind+'</span> '+esc(x.name)+' <span class="hint">'+esc(x.size)+'</span> <a class="link err" data-act="cAssetDel" data-i="'+C.assets.indexOf(x)+'">删除</a></div>').join(''):'')+(a.length?'':'<label class="btn sm" style="cursor:pointer">'+label+'<input type="file" style="display:none" data-wc="cAsset" data-need="'+need+'" accept="'+(need==='视频'?'.mp4,.mov':'.pdf')+'"></label> <a class="link" data-act="cAssetDemo" data-k="'+need+'">使用示例文件</a>')};
  // ---- AI 面板 ----
  const ai='<div class="card" style="border-color:'+(C.aiOpen?'var(--pri)':'var(--bd)')+'"><div style="display:flex;align-items:center;gap:10px;cursor:pointer" data-act="cAiToggle"><b>AI 辅助生成'+NEW+'</b><span class="hint" style="flex:1">'+(C.gen==='done'&&C.srcTag?'已生成初稿,结果已填进下面的表单。'+(C.aiItems.length?'你改过的地方会被记为「人改」,用于统计 AI 初稿采纳率。':''):'可选。填目标 / 描述 / 要求(可再放入自己的素材),agent 起草标题、正文、关键词和属性,填进下面的表单,由你修改。')+'</span><span class="link">'+(C.aiOpen?'收起 ▴':'展开 ▾')+'</span></div>'
   +(C.aiOpen?'<div class="frm" style="margin-top:14px">'
    +FR('选题(课题)','<select data-wc="cset" data-k="tid"><option value="">不关联课题(自己定题)</option>'+S.topics.filter(x=>visTopics().includes(x)||x.id===C.tid).sort((a,b)=>prio(b).s-prio(a).s).map(x=>'<option value="'+x.id+'" '+(C.tid===x.id?'selected':'')+'>'+prio(x).k+' · '+esc(x.title)+'</option>').join('')+'</select>',{h:t?'依据:'+t.stats.sess+' 条会话 · '+t.stats.stores+' 家门店;选了会带入目标和描述,可改':'课题池是辅助入口,不选也能直接生成'})
    +FR('目标','<textarea class="w" data-cf="goal" placeholder="'+esc(km.ph)+'">'+esc(C.goal)+'</textarea>',{req:1,h:'希望学员学完能做到什么'})
    +FR('描述','<textarea class="w" data-cf="desc" placeholder="背景:发生了什么问题、客户怎么说、现在顾问怎么答">'+esc(C.desc)+'</textarea>',{req:1})
    +FR('要求','<textarea class="w" data-cf="req" placeholder="如:3 句以内,口语化;先认同再对比;不要绝对化承诺" style="min-height:56px">'+esc(C.req)+'</textarea>')
    +FR('参考素材包','<div class="tag pri" style="margin-bottom:6px">你的判断优先</div>'+(C.refs.length?'<div style="margin-bottom:8px">'+C.refs.map((r,i)=>'<span class="tag blue" style="margin:0 6px 6px 0;padding:3px 8px">'+r.t+':'+esc(r.label)+' <a class="link" data-act="cRefDel" data-i="'+i+'" style="margin-left:4px">×</a></span>').join('')+'</div>':'')+'<div style="display:grid;grid-template-columns:110px 1fr auto;gap:6px"><select data-wc="crt">'+REF_T.map(x=>'<option '+(rn.t===x?'selected':'')+'>'+x+'</option>').join('')+'</select>'+(rn.t==='已有内容'?'<select data-cf="rnew.v"><option value="">选择库里的内容</option>'+S.contents.filter(x=>visC(x)&&x.id!==C.id).map(x=>'<option value="'+x.id+'" '+(rn.v===x.id?'selected':'')+'>'+esc(x.title)+'</option>').join('')+'</select>':'<input type="text" data-cf="rnew.v" value="'+esc(rn.v)+'" placeholder="'+({销冠讲法:'贴一段销冠的原话 / 讲法',线下资料:'资料名称,如 11月竞品汇编.pptx',语料片段:'语料编号或片段',我的笔记:'你自己的想法、案例'}[rn.t]||'')+'">')+'<button class="btn sm" data-act="cRefAdd">添加</button></div>',{h:'agent 整理和提炼你放进来的东西,不凭空写;「销冠讲法」「我的笔记」里的原话会直接成为初稿里的句子'})
    +FR('','<button class="btn pri" data-act="cGen" '+(C.gen==='running'?'disabled':'')+'>'+(C.gen==='running'?'agent 生成中…':C.gen==='done'&&C.srcTag?'重新生成(覆盖下面的标题和正文)':'生成初稿')+'</button> <label style="margin-left:12px"><input type="checkbox" data-wc="agDown" '+(S.agentDown?'checked':'')+'> 模拟 agent 超时</label>',{h:'由「培训内容生产专员」agent 返回(异步),生成会留痕到「课题池 → 对外洞察 → agent 调用记录」。超时不阻塞,直接手工填下面的表单即可'})
    +'</div>':'')+'</div>';
  // ---- 主表单(沿用现有「新建内容」字段顺序)----
  let f='<div class="card frm"><h3 style="margin-bottom:14px">'+(C.id?'编辑内容 '+C.id:'新增内容')+'</h3>'
   +FR('内容性质','<div class="rels">'+KINDS.map(k=>'<span class="'+(C.kind===k?'on':'')+'" data-act="ckind" data-v="'+k+'">'+k+'</span>').join('')+'</div>',{req:1,nw:1,h:C.kind==='话术'?'话术 = 「图文」内容 + 话术字段(SPIN 四段、关键词组),用于「关键词开口率」等指标':'课程 = 现有学堂内容(图文 / 视频 / PDF / 外部链接)'})
   +FR('内容类型','<div class="rels">'+CTYPES.map(x=>'<span class="'+(C.type===x?'on':'')+'" '+(C.kind==='话术'&&x!=='图文'?'style="opacity:.4;pointer-events:none"':'')+' data-act="ctype" data-v="'+x+'">'+x+'</span>').join('')+'</div>',{req:1})
   +FR('覆盖哪些知识点'+NEW,kpPicker(),{h:'一门课可以覆盖多个点：主讲解算作该点的可用讲解；提及只用于检索和推荐，不会让知识点误判为已备齐'})
   +(typeof aiContentKpAdviceHtml==='function'?aiContentKpAdviceHtml():'')
   +FR('课程讲师','<select data-wc="cset" data-k="lecturer">'+LECTURERS.map(x=>'<option '+(C.lecturer===x?'selected':'')+'>'+x+'</option>').join('')+'</select> <span class="hint">新增讲师请先在「讲师管理」新建哦</span>',{req:1})
   +FR('封面图',C.cover?'<span class="cov" style="width:64px;height:44px">封面</span> '+esc(C.cover)+' <a class="link err" data-act="cCoverDel">删除</a>':'<label class="btn sm" style="cursor:pointer">上传封面图<input type="file" style="display:none" data-wc="cCover" accept=".png,.jpg,.jpeg"></label> <a class="link" data-act="cCoverDemo">使用示例封面</a><div class="fh">图片固定尺寸 324px×220px,格式 JPG / PNG(沿用现有规则)</div>',{req:1})
   +(C.type==='外部链接'?FR('链接地址','<input type="text" data-cf="link" value="'+esc(C.link)+'" placeholder="配置链接时请确认授权了文档应用知识服务中心-汽车学堂" style="width:100%;max-width:520px">',{req:1}):'')
   +(C.type==='视频'?FR('视频文件',upl('视频','上传视频'),{req:1,h:'请上传 mp4 / mov 格式视频;上传后需压缩完成才能被学习任务选择(沿用现有规则)'}):'')
   +(C.type==='PDF'?FR('PDF 文件',upl('PDF','上传 PDF'),{req:1,h:'请上传 PDF 文件,最大 100MB'}):'')
   +FR('课程标题','<input type="text" data-cf="title" value="'+esc(C.title)+'" maxlength="50" placeholder="请输入课程标题,最多 50 个字符" style="width:100%;max-width:520px">',{req:1})
   +FR('可见范围','<div class="pill-row">'+CHANS.map(x=>'<label><input type="checkbox" data-wc="cchan" value="'+x+'" '+(C.chan.includes(x)?'checked':'')+'> '+x+'</label>').join('')+'</div><div class="fh">万能账号,汽车总部角色,合作商角色默认全部可见</div>',{req:1})
   +FR('课程专题','<div class="pill-row">'+TOPIC_TAGS.map(x=>'<span class="tag '+(C.tags.includes(x)?'pri':'')+'" style="cursor:pointer;padding:3px 10px" data-act="ctag" data-v="'+x+'">'+x+'</span>').join('')+'</div>')
   +(C.kind==='话术'?FR('使用场景','<input type="text" data-cf="bscene" value="'+esc(C.bscene)+'" placeholder="如:试驾环节,客户提到「问界 M8」时" style="width:100%;max-width:520px">',{nw:1})
     +(C.legacy?FR('','<div class="tag warn" style="white-space:normal;padding:6px 12px;line-height:1.7">这条话术是旧格式(逐句)。下面已把原有句子放进「N 需求-收益」,请按 S → P → I → N 重新整理;保存后即升级为 SPIN 格式。</div>'):'')
     +FR('话术(SPIN)',SPIN_K.map(k=>{const bd=C.aiSpin?((C.aiSpin[k]||'')===(C.spin[k]||'')?'<span class="tag pri">AI</span>':'<span class="tag ok">人改 / 增</span>'):'';return '<div class="spf" style="--c:'+SPIN_M[k][1]+'"><div class="spf-h"><b>'+k+'</b><span>'+SPIN_M[k][0]+'</span>'+bd+'<span class="sp"></span><button class="link" data-act="spinHl" data-k="'+k+'" title="先在文本框里选中一段,再点这里">▎加亮选中</button><button class="link" data-act="spinUn" data-k="'+k+'">取消加亮</button></div><textarea class="w" id="sp_'+k+'" data-cf="spin.'+k+'" placeholder="'+SPIN_HINT[k]+'" style="min-height:'+(k==='N'?96:64)+'px;max-width:none">'+esc(C.spin[k]||'')+'</textarea></div>'}).join('')
       +'<div class="fh" style="margin-top:4px">沿用团队文档的格式:S 蓝 / P 橙 / I 红 / N 绿;选中关键短语点「加亮选中」,一线看到的是黄色加亮(内部用 **…** 标记)。</div><div id="spinpv" class="spinpv">'+spinHtml(C.spin)+'</div>',{req:1,nw:1,h:''})
     +FR('关键词组','<input type="text" data-cf="kw" value="'+esc(C.kw)+'" placeholder="多个词逗号分隔" style="width:100%;max-width:520px">',{req:1,nw:1,h:'项目里选「关键词开口率」指标时自动继承这组词'})
    :FR(C.type==='图文'?'内容编辑':'课程简介','<textarea class="w" data-cf="intro" style="min-height:'+(C.type==='图文'?150:100)+'px;max-width:none" placeholder="'+(C.type==='图文'?'图文正文(现有为富文本编辑器,Demo 用文本框示意)':'请输入课程简介')+'">'+esc(C.intro)+'</textarea>',{req:C.type==='图文'||C.type==='视频'}))
   +FR('发布到零售通','<span class="hint">曝光相关设置(分类、可见范围、发布方式、首页推荐、权威)在内容定稿后,到详情「发布到零售通」里做;这里只维护内容本身</span>')
   +'</div>';
  let nw='<div class="card frm"><h3 style="margin-bottom:4px">内容属性'+NEW+'</h3><div class="hint" style="margin-bottom:14px">用于检索、到期提醒和效果归因;现有「内容管理」没有这组字段</div>'
   +(C.kind==='话术'?FR('车型',sel('car',tax.car,C.car))+FR('场景分类',sel('theme',['']  .concat(tax.theme),C.theme),{h:'与团队话术文档一致:空间与舒适 / 商务与工作 / 亲子与家庭 …'}):'')+FR('内容属性','<div class="hint">知识域/能力/卖点/车型/批次从所选知识点继承；不再手填主题对象/场景/能力。</div>')+FR('内容属性','<div class="hint">v1.2 已取消“标签”：知识域/能力/卖点/车型/批次从所选知识点继承；只有这条内容另有口径时，才在知识点里调整。</div>')+FR('适用人群',sel('aud',tax.aud,C.aud))
   +FR('有效期','<input type="date" data-cf="expire" value="'+esc(C.expire)+'">',{req:isPolicy({subject:C.subject,title:C.title}),h:'空 = 长期有效;到期前 '+S.cfg.expWarn+' 天提醒,到期自动下架。政策类必填'})
   +FR('出处','<input type="text" data-cf="source" value="'+esc(C.source)+'" placeholder="文件名 / 文号 / 链接,如 国补实施细则(2026 年 10 月版)" style="width:100%;max-width:520px">',{req:isPolicy({subject:C.subject,title:C.title}),h:'政策类必填'})
   +FR('附件素材','<div id="astbox">'+(C.assets.filter(a=>!['视频','PDF'].includes(a.kind)||C.type!==a.kind).map(a=>'<div style="margin-bottom:6px"><span class="tag">'+a.kind+'</span> '+esc(a.name)+(FMT_NEW.includes(a.kind)?' <span class="tag warn">需学堂新增上传</span>':'')+' <span class="hint">'+esc(a.size)+'</span> <a class="link err" data-act="cAssetDel" data-i="'+C.assets.indexOf(a)+'">删除</a></div>').join(''))+'<label class="btn sm" style="cursor:pointer">上传附件<input type="file" style="display:none" data-wc="cAsset" accept=".mp4,.mov,.pdf,.ppt,.pptx,.mp3,.m4a,.wav,.png,.jpg,.jpeg"></label></div>',{h:'PPT / 音频 / 图片等随内容挂的参考资料。视频、PDF 沿用现有上传规则;PPT、音频是新增形态,需学堂侧新增。Demo 只记录文件名'})
   +'</div>';
  const qc='<div class="card"><h3>质量检查 <span class="hint">硬规则不满足不能提交审核;提醒项由你决定</span></h3><div id="qcbox">'+qcHtml()+'</div></div>';
  const aud2=C.id&&content(C.id)?content(C.id).rName:meFull();
  const dock='<!--DOCK_START--><div class="dock"><span class="hint">审核人:'+esc(aud2)+'(本人,预留可配置)</span><span class="sp"></span>'+(C.rv?'<button class="btn pri" data-act="cSave" data-s="2">保存修改</button>':'<button class="btn pri" data-act="cSave" data-s="1">提交审核</button><button class="btn" data-act="cSave" data-s="0">保存草稿</button>')+'<button class="btn" data-act="cPreview">预 览</button><button class="btn" data-act="go" data-p="content">取 消</button></div><!--DOCK_END-->';
  return crumb('<a data-act="go" data-p="content">内容管理</a> / '+(C.id?'编辑 '+C.id:'新增内容'))+dock+'<div class="ph"><h2>'+(C.id?'编辑内容 '+C.id:'新增内容')+(t?' <span class="tag pri">课题 '+t.id+'</span>':'')+(C.rv?' <span class="tag warn">审核人直接修改</span>':'')+'</h2></div>'+(C.id?'':ai)+f+nw+qc;
}
A.cpt=el=>{C.publishType=el.dataset.v;render()};
A.cPreview=()=>{const o=cAsObj();const L=C.kind==='话术'?[]:spl(C.intro);
  openDlg('零售通预览(示意)','<div class="phone-pv"><div class="pv-nav">学堂 › 学习专区 › '+esc(C.cat)+'</div><div class="pv-card"><div class="pv-cov">'+(C.cover?'封面':'未上传封面')+'</div><div><b>'+esc(C.title||'(未填标题)')+'</b><div class="hint">'+C.type+(C.kind==='话术'?' · 话术':'')+' · 讲师 '+esc(C.lecturer)+'</div></div></div><div class="pv-body">'+(C.kind==='话术'?spinHtml(C.spin,1):L.length?L.slice(0,6).map(x=>'<div>'+esc(x)+'</div>').join(''):'<span class="hint">(无正文)</span>')+'</div><div class="pv-lk">这条'+C.kind+'对你有用吗?  👍 有用   👎 没用   · 内容有误?纠错</div></div><div class="hint" style="margin-top:8px">发布后出现在零售通学堂「学习专区」的「'+esc(C.cat)+'」分类,可见:'+esc(C.chan.join('、')||'未选')+' · '+esc(C.vis)+'</div>','<button class="btn" data-act="close">关闭</button>')};
A.cSave=el=>{const mode=el.dataset.s;UI.sel.cAiStale=false;
  if(!C.title.trim())return toast('请输入课程标题','err');
  let c=C.id?content(C.id):null;const isNew=!c;const me=meFull();
  const t=C.tid&&topic(C.tid);const sug=t?JSON.parse(JSON.stringify(t.sug)):(c&&c.sug)||inferSug(C.title+C.goal+C.desc,'');
  if(isNew){c={id:nextCid(),up:0,down:0,orig:0,ver:1,hist:[],vers:[],creator:me,cK:UI.role.k,rK:UI.role.k,rName:me,created:today,views:0};S.contents.unshift(c)}
  const body=cAsObj().body;
  const k0=(C.kps||[]).map(kp).filter(Boolean)[0];
  const kpRole={};(C.kps||[]).forEach(kid=>{kpRole[kid]=(C.kpRole&&C.kpRole[kid])||(C.mainKp===kid?'主讲解':'补充材料')});
  Object.assign(c,{kps:(C.kps||[]).slice(),kpRole,mainKp:C.mainKp||(C.kps||[])[0]||'',title:C.title.trim(),kind:C.kind,type:C.type,lecturer:C.lecturer,cover:C.cover||'默认封面.png',coverSet:!!C.cover,chan:C.chan.slice(),vis:C.vis,tags:C.tags.slice(),link:C.link,script:C.kind==='话术'?1:0,src:C.srcTag?'销冠挖掘':'培训部编写',srcTag:C.srcTag,kw:C.kw||'',car:C.kind==='话术'?C.car:'通用车型',theme:C.kind==='话术'?C.theme:'',topic:C.tid||'',goal:C.goal,desc:C.desc,req:C.req,body:JSON.parse(JSON.stringify(body)),sug,subject:k0?(k0.sellpoint||k0.name):C.subject,scene:k0?k0.stage:C.scene,ability:k0?(k0.ability||'产品知识'):C.ability,aud:C.aud,expire:C.expire||'',source:C.source||'',assets:JSON.parse(JSON.stringify(C.assets)),refs:JSON.parse(JSON.stringify(C.refs)),aiLines:C.aiItems.slice(),cat:C.cat,recommend:{on:C.recOn,until:C.recUntil},publishType:C.publishType,publishTime:C.publishTime,authority:C.authority,origin:c.origin&&!isNew&&c.origin!=='手工编写'?c.origin:(C.origin||'手工编写')});
  if(mode==='2'){chist(c,'审核人直接修改','审核人 '+meShort()+' 修改了内容后保存');C=null;toast('已保存修改。请回到详情页「审核」','ok');UI.cid=c.id;UI.ctab='内容';UI.page='cdetail';render();return}
  c.st='草稿';c.pubSt=c.pubSt||'未上架';
  chist(c,isNew?(C.srcTag?'AI 生成并保存草稿':'新增并保存草稿'):'保存草稿',C.srcTag?'agent 初稿 + 人工修改'+(aiAdopt(c)!=null?',AI 初稿采纳率 '+aiAdopt(c)+'%':''):'手工编写');
  if(t){t.cids=t.cids||[];if(!t.cids.includes(c.id)){t.cids.push(c.id);thist(t,meShort(),'生成了内容','「'+c.title+'」('+c.kind+')')}if(['新发现','暂不做'].includes(t.flow))t.flow='已采纳'}
  if(mode==='1'){const q=qcheck(c);
    if(q.hard.length){C=cFromC(c);toast('草稿已保存,但不能提交审核:'+q.hard[0]+(q.hard.length>1?'(共 '+q.hard.length+' 项,见下方质量检查)':''),'err');render();return}
    C=null;A.cSubmit({dataset:{id:c.id}});return}
  C=null;toast('草稿已保存','ok');UI.page='content';UI.tab.content='全部内容';UI.sel.cq={};UI.sel.cadv=false;render()};

/* ---------- 学习任务里的「选择学堂内容」弹窗(对应现有 LearnContentDialog:内容 ID / 内容类型 / 内容标题 筛选 + 表格 + 选择) ---------- */
let CP={f:'',id:'',type:'',title:'',kind:''};
A.cpick=el=>{CP={f:el.dataset.f,id:'',type:'',title:'',kind:''};cpOpen()};
function cpRows(){return S.contents.filter(c=>usableC(c)&&c.enabled!==0&&expState(c)!=='已过期'&&visC(c)&&(!CP.id||c.id.includes(CP.id))&&(!CP.type||c.type===CP.type)&&(!CP.kind||c.kind===CP.kind)&&(!CP.title||c.title.includes(CP.title))).sort((a,b)=>(b.created||'')>(a.created||'')?1:-1)}
function cpOpen(){const rows=cpRows();
  openDlg('选择学堂内容','<div class="filg" style="margin-bottom:12px"><div class="fi2"><label>内容ID</label><input data-wc="cpset" data-k="id" value="'+esc(CP.id)+'" placeholder="请输入内容ID"></div><div class="fi2"><label>内容类型</label><select data-wc="cpset" data-k="type"><option value="">全部</option>'+CTYPES.map(x=>'<option '+(CP.type===x?'selected':'')+'>'+x+'</option>').join('')+'</select></div><div class="fi2"><label>内容性质'+NEW+'</label><select data-wc="cpset" data-k="kind"><option value="">全部</option>'+KINDS.map(x=>'<option '+(CP.kind===x?'selected':'')+'>'+x+'</option>').join('')+'</select></div><div class="fi2"><label>内容标题</label><input data-wc="cpset" data-k="title" value="'+esc(CP.title)+'" placeholder="请输入内容标题"></div></div>'
   +'<table class="t"><tr><th>ID</th><th>标题</th><th>创建时间</th><th>类型</th><th>性质'+NEW+'</th><th>状态</th><th>版本'+NEW+'</th><th></th></tr>'+(rows.length?rows.map(c=>'<tr><td>'+c.id+'</td><td style="white-space:normal;max-width:300px">'+esc(c.title)+(!c.orig&&contentUse(c.id)===0?' <span class="tag warn">首次使用</span>':'')+(expState(c)==='即将到期'?' <span class="tag warn">'+expDays(c)+' 天后到期</span>':'')+'</td><td>'+(c.created||'-')+'</td><td>'+c.type+'</td><td>'+kindTag(c.kind)+'</td><td>'+cchip(c.st)+'</td><td>v'+c.ver+'</td><td><button class="btn sm pri" data-act="cpPick" data-id="'+c.id+'">选择</button></td></tr>').join(''):'<tr><td colspan="8" class="hint">没有符合条件的内容。只有「待发布 / 已发布」、未过期、有权限看到的内容能选;没有合适的先去「内容管理」新增或 AI 生成。</td></tr>')+'</table><div class="hint" style="margin-top:8px">选择后提交学习项目时锁定当前版本。</div>','<button class="btn" data-act="close">关闭</button>',true)}
A.cpset=el=>{CP[el.dataset.k]=el.value;cpOpen()};
A.cpPick=el=>{setPath(F,CP.f,el.dataset.id);F.modDirty=true;closeDlg();render()};

function kpTagsOfContent(c){const out=[];(c.kps||[]).forEach(id=>{const k=kp(id);if(k)(k.tags||[]).forEach(t=>{if(!out.includes(t))out.push(t)})});return out}

function kpMetaOfContent(c){const kps=[],ab=[],cars=[];(c.kps||[]).forEach(id=>{const k=kp(id);if(!k)return;kps.push(k.name);const a=kpAbText(k);if(a&&a!=='未指定'&&!ab.includes(a))ab.push(a);kpCars(k).forEach(x=>{if(x!=='通用车型'&&!cars.includes(x))cars.push(x)})});return {kps,ab,cars}}
