const L=m=>out.push(m);const tx=()=>document.querySelector('#main').innerText;
try{closeDlg();
A.roleSwitch({value:'hq'});
// ---- 评分规则单元 ----
const d1=drById('D1');const t1=d1.turns[0];
const good='您觉得价格有压力,这很正常,说明您在认真比。我们不只看买车这一刻,三年的使用成本、保值率和权益一起算,总拥有成本其实更低,我帮您算出来。';
const sg=drScore(t1,good);L('规范回答 → '+JSON.stringify({k:sg.know,e:sg.emo,i:sg.idea,t:sg.total})+' (应接近满分)');
const sb=drScore(t1,'我们的车就是这个价,您看着办吧');L('糟糕回答 → '+JSON.stringify({k:sb.know,e:sb.emo,i:sb.idea,t:sb.total})+' (应很低)');
const sh=drScore(t1,'理解您的感受,价格确实是大家都关心的');L('只有安抚 → '+JSON.stringify({k:sh.know,e:sh.emo,i:sh.idea,t:sh.total})+' (安抚满,知识思路少)');
const se=drScore(t1,'');L('空回答 → '+sh.total+' / '+drScore(t1,'').total);
const t4=drById('D4').turns[0];const s4=drScore(t4,'您好,欢迎光临,今天想了解哪款车?您先随便看,有事叫我');L('无安抚词的回合 emo 按满分且 hasEmo=false → '+s4.emo+' '+s4.hits.hasEmo+' 总分='+s4.total);
L('总分=回合平均 → '+drTotal([{sc:{total:80}},{sc:{total:40}}])+' (应 60)');
// ---- 后台:演练页签 ----
UI.page='content';UI.tab.content='全部内容';UI.sel.caf={k:'演练'};UI.sel.cadv=false;render();L('内容中心·演练 len='+tx().length+' 行='+(document.querySelectorAll('#main table.t.nw tr').length-1)+' 含状态='+/状态/.test(tx()));
L('已定稿脚本自检失败='+S.drills.filter(d=>d.st==='已定稿').filter(d=>drHard(d).length).length);
L('每个脚本来源话术存在='+S.drills.every(d=>content(d.src)));
// 编辑页
A.drOpen({dataset:{id:'D1'}});render();L('编辑页 渲染='+/编辑 D1/.test(tx())+' 回合数='+DF.turns.length+' 必说点文本='+DF.turns[0].mustT.split('\n').length+'行');
DF.turns[0].mustT='';A.drSave({dataset:{s:'1'}});L('必说点清空→定稿被拦 toast='+document.querySelector('#toast').innerText);DF=null;
// 新增 + 保存草稿 + 定稿
A.drNew();render();L('新增页 渲染='+/新增演练/.test(tx()));DF.kp='K20';DF.name='测试演练:客户说随便看看';DF.turns=[{say:'我就随便看看。',ref:'好的,您先看,我在旁边。',emoT:'',mustT:'欢迎=欢迎\n询问=想了解,哪款',ideaT:'不打扰=随便看,您先看,我在旁边'}];
A.drSave({dataset:{s:'0'}});const nd=S.drills[S.drills.length-1];L('保存草稿 '+nd.id+' st='+nd.st+' 回合='+nd.turns.length+' 必说点='+JSON.stringify(nd.turns[0].must));
A.drOpen({dataset:{id:nd.id}});A.drSave({dataset:{s:'1'}});L('定稿 → '+drById(nd.id).st);
A.drOff({dataset:{id:nd.id}});L('停用 → '+drById(nd.id).st+' 学员不再出='+!drPick('X','K20'));A.drPass({dataset:{id:nd.id}});L('恢复 → '+drById(nd.id).st);
// 多回合增删
A.drOpen({dataset:{id:nd.id}});A.drTurnAdd();L('加回合 → '+DF.turns.length);A.drTurnDel({dataset:{i:'1'}});L('删回合 → '+DF.turns.length);DF=null;
// AI 草稿
A.drGen();L('AI 草稿后 草稿数='+S.drills.filter(d=>d.st==='草稿').length+' 带占位不能定稿='+S.drills.filter(d=>/请补/.test(d.persona+d.turns.map(t=>t.say).join(''))).every(d=>drHard(d).length>0));
// 草稿 D6(无回合)定稿被拦
A.drPass({dataset:{id:'D6'}});L('D6 无回合定稿被拦 st='+drById('D6').st);
// ---- 零售通:一场完整演练 ----
A.reset();closeDlg();document.body.dataset.end='rn';ME=PEOPLE[0];S.ansLog=S.ansLog.filter(a=>a.mid!==ME.mid);S.mastery[ME.mid]={};
S.ansLog.push({mid:ME.mid,q:'Q6',kp:'K18',ok:false,t:today,mode:'diag'});mRefresh(ME.mid,'K18');
R.page='adapt';renderRN();L('提升清单 含"去演练"='+/去演练/.test($('#rscr').innerText));
A.adDrill({dataset:{k:'K18'}});L('进入演练 page='+R.page+' step='+DZ.step+' 说明页含通关线='+/≥60/.test($('#rscr').innerText)+' 含演示说明='+/演示版/.test($('#rscr').innerText));
A.dzStart();renderRN();L('第1回合 客户气泡='+/贵/.test($('#rscr').innerText)+' 提交按钮禁用='+document.querySelector('#rscr .rbar .rb').classList.contains('dis'));
A.dzSubmit();L('空提交被拦 step='+DZ.step);
document.getElementById('dz_t').value='您觉得价格有压力,这很正常,说明您在认真比。我们不只看买车这一刻,三年的使用成本、保值率和权益一起算,总拥有成本其实更低。';DZ.text=document.getElementById('dz_t').value;
A.dzHint();L('点提示后 文本保留='+(document.getElementById('dz_t').value===DZ.text)+' 提示显示='+/提示:/.test($('#rscr').innerText));
A.dzSubmit();L('提交后 step='+DZ.step+' 得分='+DZ.sc.total+' 页面含点评='+/点评/.test($('#rscr').innerText)+' 含参考话术='+/参考话术/.test($('#rscr').innerText)+' 三维度='+(/知识正确/.test($('#rscr').innerText)&&/思路正确/.test($('#rscr').innerText)));
A.dzSubmit();L('重复提交不重复记录 log='+DZ.log.length);
A.dzNext();L('进入第2回合 i='+DZ.i+' step='+DZ.step);
document.getElementById('dz_t').value='好的,我帮您算,配置折算下来座舱智驾补能都多给您。您更看重哪一项?我们去体验一下。';DZ.text=document.getElementById('dz_t').value;A.dzSubmit();
const n0=S.ansLog.length;const v0=mst(ME.mid,'K18').v;A.dzNext();L('结算 end='+DZ.end+' 总分='+drTotal(DZ.log)+' 写入作答 '+n0+'→'+S.ansLog.length+' 掌握度 '+v0+'→'+mst(ME.mid,'K18').v+' 脚本统计 n='+drById('D1').stat.n);
renderRN();L('结果页 渲染 含通关='+/通关/.test($('#rscr').innerText)+' 含最弱项='+/最需要加强的一项|三项都很扎实/.test($('#rscr').innerText)+' 含掌握度='+/掌握度/.test($('#rscr').innerText));
const last=S.ansLog[S.ansLog.length-1];L('作答记录 mode='+last.mode+' q='+last.q+' ok='+last.ok+' score='+last.score);
A.dzAgain();L('再练一次 回到 intro='+(DZ.step==='intro'));A.dzExit();L('退出 page='+R.page);
// 故意答得很差 → 未通关、掌握度下降
A.adDrill({dataset:{k:'K18'}});A.dzStart();for(let i=0;i<drById(DZ.id).turns.length;i++){document.getElementById('dz_t').value='不知道';DZ.text='不知道';A.dzSubmit();A.dzNext()}
L('故意答差 总分='+drTotal(DZ.log)+' 未通关='+(drTotal(DZ.log)<DR_PASS)+' 结果页含未通关='+(renderRN(),/未通关/.test($('#rscr').innerText)));A.dzExit();
// 中途退出 不记录
const n1=S.ansLog.length;A.adDrill({dataset:{k:'K19'}});A.dzStart();document.getElementById('dz_t').value='abc';DZ.text='abc';A.dzSubmit();A.dzExit();L('中途退出不记录='+(S.ansLog.length===n1));
// 无演练的点
A.adDrill({dataset:{k:'K8'}});L('无演练的点 → 不进入 page='+R.page+' toast='+document.querySelector('#toast').innerText);
// 已停用 / 草稿 不出现
L('停用和草稿不入 drPick='+(!drPick('X','K21')));
// 首页入口
R.page='school';renderRN();L('学堂首页 AI 实战入口 → 去练习 指向提升清单='+/去练习/.test($('#rscr').innerText)+' 演练数='+(($('#rscr').innerText.match(/(\d+) 个演练/)||[])[1]));
document.body.dataset.end='pc';
// 知识点详情页:演练块
UI.page='kp';UI.kid='K18';render();L('知识点详情 有演练块='+/弹药 · 演练\(本系统\)/.test(tx())+' 有建演练按钮='+/为这个点建演练/.test(tx())+' 统计='+/次 \/ /.test(tx()));
UI.kid='K17';render();L('技能型无演练提示='+/技能型知识点最适合用演练来测/.test(tx()));
// 全页签 / 三身份 / 清空
KP_TABS.forEach(t=>{UI.page='catalog';UI.tab.catalog=t;try{render()}catch(e){L('ERR '+t+' '+e.message+' @'+(e.stack||'').split('\n')[1])}});
A.clear();KP_TABS.forEach(t=>{UI.page='catalog';UI.tab.catalog=t;try{render()}catch(e){L('ERR clear '+t+' '+e.message+' @'+(e.stack||'').split('\n')[1])}});L('clear ok drills='+S.drills.length);
A.reset();['r1','boss'].forEach(r=>{A.roleSwitch({value:r});if(PAGES_OK[UI.role.type].includes('catalog')){UI.page='catalog';KP_TABS.forEach(t=>{UI.tab.catalog=t;try{render()}catch(e){L('ERR '+r+' '+t+' '+e.message)}})}L(r+' ok')});
}catch(e){L('TOP '+e.message+' @'+(e.stack||'').split('\n')[1])}
