/* ========== 签到码 / 成绩导入 / 课后评价 / 班次改期 / 闭环审查 ========== */
const signMode=p=>(p.offNode&&p.offNode.sign)||'学员扫班次码签到';
const isScan=p=>signMode(p).indexOf('扫')>=0;
/* --- 伪二维码(演示)--- */
function qrSvg(seed,size){const n=21,cell=size/n;let h=0;for(const c of seed)h=(h*131+c.charCodeAt(0))%1000003;const rnd=()=>{h=(h*1103515245+12345)%2147483647;return h};
  let s='<svg viewBox="0 0 '+size+' '+size+'" width="'+size+'" height="'+size+'" style="background:#fff"><rect width="'+size+'" height="'+size+'" fill="#fff"/>';
  const finder=(x,y)=>{s+='<rect x="'+x*cell+'" y="'+y*cell+'" width="'+7*cell+'" height="'+7*cell+'" fill="#101828"/><rect x="'+(x+1)*cell+'" y="'+(y+1)*cell+'" width="'+5*cell+'" height="'+5*cell+'" fill="#fff"/><rect x="'+(x+2)*cell+'" y="'+(y+2)*cell+'" width="'+3*cell+'" height="'+3*cell+'" fill="#101828"/>'};
  finder(0,0);finder(n-7,0);finder(0,n-7);
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){if((x<8&&y<8)||(x>n-9&&y<8)||(x<8&&y>n-9))continue;if(rnd()%100<48)s+='<rect x="'+x*cell+'" y="'+y*cell+'" width="'+cell+'" height="'+cell+'" fill="#101828"/>'}
  return s+'</svg>'}
const codeOf=k=>'TC-'+k.id+'-'+(k.salt||1)+'-'+(hsh(k.id+k.date)%9000+1000);
A.signCode=el=>{const k=S.classes.find(x=>x.id===el.dataset.id);const p=proj(k.proj);const R=S.results[p.id]||{};const sg=k.members.filter(m=>(R[m]||{}).signed).length;
  openDlg('班次签到码 · '+k.name,isScan(p)?'<div style="display:grid;grid-template-columns:260px 1fr;gap:22px"><div style="text-align:center">'+qrSvg(codeOf(k),240)+'<div class="hint" style="margin-top:6px">'+codeOf(k)+'</div></div><div><dl class="kv"><dt>班次</dt><dd>'+esc(k.name)+' · '+k.date+' '+k.time+'</dd><dt>地点</dt><dd>'+esc(k.place)+'</dd><dt>有效时段</dt><dd>开课当天 08:00 ~ 24:00</dd><dt>怎么用</dt><dd>老师在教室投屏或打印这张码;学员在零售通班次详情页点「扫码签到」,扫码即签到。</dd><dt>已签到</dt><dd><b>'+sg+'</b> / '+k.members.length+' 人</dd></dl><div class="hint" style="margin-top:10px">码只对本班次有效;刷新后旧码立即失效。未带手机或扫不上的学员,老师在「培训结果」点「补签」。</div></div></div>':'<div class="cta">本项目签到方式是「学员在零售通点击签到」,没有签到码。<p>要改成扫班次码,到项目的线下班次培训节点把「签到方式」改为「学员扫班次码签到」(新增项目时配置)。</p></div>',
   isScan(p)?'<button class="btn" data-act="codeRefresh" data-id="'+k.id+'">刷新二维码</button><button class="btn" data-act="codeDl" data-id="'+k.id+'">下载图片</button><button class="btn pri" data-act="close">关闭</button>':'<button class="btn" data-act="close">关闭</button>',true)};
A.codeRefresh=el=>{const k=S.classes.find(x=>x.id===el.dataset.id);k.salt=(k.salt||1)+1;logp(proj(k.proj),'刷新班次「'+k.name+'」签到码');toast('已刷新,旧码失效','ok');A.signCode(el)};
A.codeDl=el=>{const k=S.classes.find(x=>x.id===el.dataset.id);const svg=qrSvg(codeOf(k),400);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));a.download='签到码_'+k.name+'.svg';a.click();toast('已下载签到码图片','ok')};
/* --- 班次改期 / 改地点 --- */
A.editClass=el=>{const k=S.classes.find(x=>x.id===el.dataset.id);const p=proj(k.proj);
  openDlg('编辑班次 · '+k.name,'<div class="fgrid"><div class="fld"><label>日期</label><input type="date" id="ek_d" value="'+k.date+'"></div><div class="fld"><label>时间</label><input type="text" id="ek_t" value="'+esc(k.time)+'"></div><div class="fld full"><label>地点</label><input type="text" id="ek_p" value="'+esc(k.place)+'"></div><div class="fld"><label>讲师</label><input type="text" id="ek_k" value="'+esc(k.teacher)+'"></div><div class="fld"><label>容量</label><input type="number" id="ek_c" value="'+k.cap+'"></div></div><div class="hint" style="margin-top:10px">'+(p.classPub?'分班结果已发布:修改后会通过零售通通知本班全部学员。':'分班结果未发布,修改不会通知学员。')+'</div>','<button class="btn" data-act="close">取消</button><button class="btn pri" data-act="editClassOk" data-id="'+k.id+'">保存</button>')};
A.editClassOk=el=>{const k=S.classes.find(x=>x.id===el.dataset.id);const p=proj(k.proj);const d=$('#ek_d').value,pl=$('#ek_p').value.trim(),tc=$('#ek_k').value.trim(),cap=+$('#ek_c').value;
  if(!d||!pl||!tc||!(cap>0))return toast('日期、地点、讲师、容量都要填','err');if(d<p.start||d>p.end)return toast('班次日期需在培训周期内','err');if(cap<k.members.length)return toast('容量不能小于已入班人数 '+k.members.length,'err');
  const ch=[];if(d!==k.date)ch.push('日期 '+k.date+' → '+d);if(pl!==k.place)ch.push('地点 → '+pl);if(tc!==k.teacher)ch.push('讲师 → '+tc);
  Object.assign(k,{date:d,time:$('#ek_t').value.trim(),place:pl,teacher:tc,cap});closeDlg();
  if(ch.length){logp(p,'修改班次「'+k.name+'」:'+ch.join(';'));if(p.classPub&&k.members.includes(ME.mid))notify('「'+p.name+'」班次信息已变更:'+ch.join(';'))}
  toast('班次已更新'+(ch.length&&p.classPub?',已通知 '+k.members.length+' 位学员':''),'ok');render()};
/* --- 线下成绩导入 --- */
const IMP_HEAD=['MID','姓名','班次','线下成绩','是否缺考','评语'];
function impTemplate(p){const rows=[IMP_HEAD.join(',')];S.classes.filter(k=>k.proj===p.id).forEach(k=>k.members.forEach(m=>{const r=((S.results[p.id]||{})[m])||{};rows.push([m,pp(m).name,k.name,r.offline==null?'':r.offline,'否',''].join(','))}));return rows.join('\n')}
A.impOpen=()=>{const p=proj(UI.projId);window._imp={text:impTemplate(p),rows:null,file:'线下成绩.csv'};
  openDlg('导入线下成绩','<div class="src" style="margin-bottom:12px"><b>导什么</b><span>线下成绩 = 培训老师按「'+esc(p.offNode.assess)+'」给每位学员打的分(0~100)。线上成绩不用导,从清河大学自动同步。总评 = 线上 '+S.cfg.wOnline+'% + 线下 '+(100-S.cfg.wOnline)+'%,通过线 '+S.cfg.pass+' 分。</span></div>'
   +'<div style="display:flex;gap:8px;align-items:center;margin-bottom:10px"><button class="btn sm" data-act="impDl">下载模板(CSV,已带本项目学员)</button><label class="btn sm" style="cursor:pointer">选择文件<input type="file" id="impf" accept=".csv,.txt" style="display:none" data-wc="impFile"></label><span class="hint">模板列:'+IMP_HEAD.join(' / ')+';缺考填「是」时成绩留空;也可直接在下方编辑</span></div>'
   +'<textarea id="impt" style="width:100%;min-height:150px;font-family:ui-monospace,monospace;font-size:12px;max-width:none">'+esc(window._imp.text)+'</textarea><div id="impv" style="margin-top:12px"></div>','<button class="btn" data-act="close">取消</button><button class="btn" data-act="impCheck">校验</button><button class="btn pri" data-act="impDo">确认导入</button>',true)};
A.impDl=()=>{const p=proj(UI.projId);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+impTemplate(p)],{type:'text/csv;charset=utf-8'}));a.download='线下成绩导入模板_'+p.name+'.csv';a.click();toast('已下载模板','ok')};
A.impFile=el=>{const f=el.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('#impt').value=String(r.result).replace(/^﻿/,'');window._imp.file=f.name;toast('已读取 '+f.name,'ok');A.impCheck()};r.readAsText(f)};
function impParse(p){const lines=$('#impt').value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);const out={err:null,rows:[]};
  if(!lines.length){out.err='内容为空';return out}
  const head=lines[0].split(/[,\t，]/).map(x=>x.trim());if(IMP_HEAD.some((h,i)=>head[i]!==h)){out.err='表头不对,应为:'+IMP_HEAD.join(',');return out}
  const mem={};S.classes.filter(k=>k.proj===p.id).forEach(k=>k.members.forEach(m=>mem[m]=k.name));const seen={};const R=S.results[p.id]||{};
  lines.slice(1).forEach((ln,i)=>{const c=ln.split(/[,\t，]/).map(x=>x.trim());const mid=c[0],sc=c[3],ab=c[4]==='是';let e='';
    if(!mem[mid])e='MID 不在本项目班次里';else if(seen[mid])e='文件内重复';else if((R[mid]||{}).st==='已结业')e='已结业,不能再改成绩';
    else if(!ab){if(sc===''||sc==null)e='成绩为空(缺考请填「是」)';else if(isNaN(+sc)||+sc<0||+sc>100)e='成绩需为 0~100 的数字'}
    seen[mid]=1;out.rows.push({line:i+2,mid,name:pp(mid).name,cls:mem[mid]||'-',score:ab?null:+sc,absent:ab,note:c[5]||'',err:e})});
  return out}
A.impCheck=()=>{const p=proj(UI.projId);const r=impParse(p);window._imp.rows=r;const v=$('#impv');
  if(r.err){v.innerHTML='<div class="tag err" style="padding:4px 10px">'+r.err+'</div>';return}
  const ok=r.rows.filter(x=>!x.err).length;v.innerHTML='<div style="margin-bottom:6px"><span class="tag ok">可导入 '+ok+' 行</span> <span class="tag '+(r.rows.length-ok?'err':'')+'">有问题 '+(r.rows.length-ok)+' 行</span> <span class="hint">有问题的行会被跳过,不影响其他行</span></div><div class="tw" style="max-height:200px;overflow:auto"><table class="t"><tr><th>行</th><th>MID</th><th>姓名</th><th>班次</th><th>成绩</th><th>缺考</th><th>校验</th></tr>'+r.rows.map(x=>'<tr><td>'+x.line+'</td><td>'+x.mid+'</td><td>'+x.name+'</td><td>'+esc(x.cls)+'</td><td>'+(x.score==null?'-':x.score)+'</td><td>'+(x.absent?'是':'否')+'</td><td>'+(x.err?'<span class="tag err">'+x.err+'</span>':'<span class="tag ok">通过</span>')+'</td></tr>').join('')+'</table></div>'};
A.impDo=()=>{const p=proj(UI.projId);A.impCheck();const r=window._imp.rows;if(!r||r.err)return toast(r&&r.err||'请先校验','err');const ok=r.rows.filter(x=>!x.err);if(!ok.length)return toast('没有可导入的行','err');
  const R=S.results[p.id];ok.forEach(x=>{const o=R[x.mid];if(x.absent){o.st='缺考';o.offline=null}else{o.offline=x.score;if(o.st==='缺考')o.st='待录入'}o.note=x.note;recalc(p.id,x.mid)});
  const bad=r.rows.filter(x=>x.err);(p.imports=p.imports||[]).unshift({t:today+' '+new Date().toTimeString().slice(0,5),who:meName(),file:window._imp.file,total:r.rows.length,ok:ok.length,bad:bad.map(x=>'第 '+x.line+' 行 '+x.mid+':'+x.err)});
  logp(p,'导入线下成绩:成功 '+ok.length+' 行,失败 '+bad.length+' 行('+window._imp.file+')');closeDlg();toast('已导入 '+ok.length+' 行'+(bad.length?',跳过 '+bad.length+' 行(见导入记录)':''),'ok');render()};
function importLog(p){const L=p.imports||[];return '<div class="card"><h3>成绩导入记录 <span class="hint">每次导入留痕:谁、什么时候、成功几行、失败原因</span></h3>'+(L.length?'<table class="t"><tr><th>时间</th><th>操作人</th><th>文件</th><th>总行数</th><th>成功</th><th>失败明细</th></tr>'+L.map(x=>'<tr><td>'+x.t+'</td><td>'+esc(x.who)+'</td><td>'+esc(x.file)+'</td><td>'+x.total+'</td><td>'+x.ok+'</td><td>'+(x.bad.length?x.bad.map(esc).join('<br>'):'-')+'</td></tr>').join('')+'</table>':'<div class="hint">暂无导入记录</div>')+'</div>'}
function evalSum(p){const E=(S.evals||{})[p.id]||{};const ks=S.classes.filter(k=>k.proj===p.id);if(!ks.length)return '';
  return '<div class="card"><h3>课后评价汇总 <span class="hint">学员在零售通结业后评价;按班次 / 讲师汇总</span></h3><table class="t"><tr><th>班次</th><th>讲师</th><th>评价率</th><th>内容有用度</th><th>讲师</th></tr>'+ks.map(k=>{const es=k.members.map(m=>E[m]).filter(Boolean);const avg=f=>es.length?(es.reduce((s,x)=>s+x[f],0)/es.length).toFixed(1):'-';return '<tr><td>'+esc(k.name)+'</td><td>'+esc(k.teacher)+'</td><td>'+es.length+' / '+k.members.length+'</td><td>'+avg('content')+'</td><td>'+avg('teacher')+'</td></tr>'}).join('')+'</table></div>'}
/* --- 闭环审查清单(规则页)--- */
function rulesAudit(){
  const rows=[
   ['班次签到','老师在哪看到签到码?','分班 tab → 班次卡片「签到码」:二维码、有效时段、已签到人数,可刷新 / 下载;未带手机的学员老师在培训结果里补签','已闭环'],
   ['班次变更','改期、改地点学员怎么知道?','分班 tab →「编辑班次」,已发布时自动通知全班学员并留痕','已闭环'],
   ['线下成绩','导什么、怎么导?','培训结果 tab →「导入线下成绩」:下载带本项目学员的 CSV 模板,列为 MID/姓名/班次/线下成绩/是否缺考/评语;逐行校验,错误行跳过并记入「成绩导入记录」','已闭环'],
   ['线上成绩','从哪来?','清河大学,点「同步」自动回写,不用导入','已闭环'],
   ['带教师傅','零售通「后续安排」里的师傅哪来的?','人事系统师徒关系(演示按同店资深同事推导)','已标注来源'],
   ['课后评价','反应层数据哪来?','学员结业后在零售通打分(内容 / 讲师),培训结果 tab 按班次汇总','已闭环'],
   ['学习任务完成','零售通任务完成后后台怎么看?','项目详情「下发明细」按学员 × 任务节点;完成状态来自零售通学员操作','已闭环'],
   ['效果数据 / 基线','哪来的?','评估中阶段从北斗 BI / 语料 / 清河同步;基线在新增项目时按指标口径取数','已闭环(演示为模拟值)'],
   ['结项回写','结论去哪了?','写回课题池的课题;回炉会下线话术并把课题退回新发现','已闭环'],
   ['内容从哪来','话术 / 课程怎么产生?','内容管理「生成内容」:选题 / 目标 / 描述 / 要求 → agent 初稿 → 创建人修改 → 审核(默认本人)→ 入库 / 发布;课题定题后「生成内容」直达','已闭环'],
   ['新内容怎么先验证','没验证过的话术直接全量下发?','项目「下发方式」选分批灰度:第一批试用 + 对照批不下发,比较后扩大或回炉;没有「单独下发话术」','已闭环'],
   ['内容反馈怎么回流','点踩高 / 命中低的内容怎么办?','内容管理「使用与反馈」标记异常,一键回炉(写原因)→ 回炉修改 → 重新审核;老板视图读同一份数据','已闭环'],
   ['线下已有资料','怎么进内容管理?','导入内容:CSV 逐行校验;PPT / Word / PDF 由 AI 提取(示意);视频 / 音频登记为素材;逐条确认后进草稿,可整批撤销(被引用的不可撤销)','已闭环'],
   ['内容改版 / 上架','项目里的旧版本、零售通的旧版本怎么办?','项目引用时锁定版本,新版本审核通过后项目内提示「可更新」;零售通提示「更新上架」,两件事分开决定;灰度中不允许更新','已闭环'],
   ['内容过期','政策口径变了怎么办?','内容有有效期,到期前提醒、到期自动下线;政策类必须填有效期和出处','已闭环'],
   ['一线纠错','学员发现内容错了怎么办?','零售通点「内容有误?纠错」/ 点踩选原因,进内容管理反馈收件箱,创建人采纳并改版','已闭环'],
   ['销售顾问投稿','一线主动分享自己的讲法?','下一期','未闭环(下期)'],
   ['AI 视频 / 短片','AI 生成短片?','本次不做;内容管理只存素材引用','未闭环(范围外)'],
   ['周报 / 月报','谁看、怎么产生?','效果追踪「效果报告」:周一 / 月初自动产出,可手动生成;按门店 / 人出,附内容反馈与回流建议;零售通推送与订阅界面未做','部分闭环'],
   ['通知渠道','企微渠道?','只做后台通知和零售通消息;企微未做','未闭环(范围外)'],
   ['人员异动','离职 / 转店怎么影响名单?','只在效果口径里体现(剔除 / 保留);名单、班次不会自动变化','部分闭环'],
   ['下发失败','学习任务下发失败怎么办?','沿用现有「下发失败人员列表 / 重试」,本 Demo 未复刻','沿用现有'],
   ['Excel 导入名单','指定范围能传 Excel 吗?','只支持粘贴 MID;Excel 上传未做','部分闭环']];
  return '<div class="card"><h3>8. 闭环审查(设计走查)</h3><div class="tw"><table class="t"><tr><th>环节</th><th>问题</th><th>当前设计</th><th>状态</th></tr>'+rows.map(r=>'<tr><td><b>'+r[0]+'</b></td><td>'+r[1]+'</td><td>'+r[2]+'</td><td><span class="tag '+(r[3].startsWith('已')?'ok':r[3].startsWith('未')?'err':'warn')+'">'+r[3]+'</span></td></tr>').join('')+'</table></div></div>'}
