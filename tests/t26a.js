const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
const text=ciCourseSampleText();
const it=ciCourseLinkItem({name:'【CEMN-购买层级诊断与推进】——讲师手册',link:1,courseText:text},{dept:'总部培训部'});
CK('课程链接能生成一条课程（不是外部链接素材）',!!it&&it.kind==='课程'&&it.title.includes('CEMN'),it&&it.title);
CK('课程标题不重复“讲师手册”后缀',!/讲师手册.*讲师手册|】/.test(it.title),it.title);
CK('目录是业务模块，不是页码堆叠',/四个购买层级/.test(it.body.outline)&&/诊断/.test(it.body.outline)&&/演练/.test(it.body.outline),it.body.outline.replace(/\n/g,' / '));
CK('能力归到顾虑解除',it.ability==='顾虑解除',it.ability);
CK('关键词包含 CEMN 真实业务词',/CEMN/.test(it.kw)&&/开放式/.test(it.kw)&&/封闭式/.test(it.kw),it.kw);
const sug=ciCourseKpSuggestions(it.title,it.body.sourceText);
CK('从课程提炼候选知识点（不是页级拆分）',sug.length>=5&&sug.every(x=>!/^P\d|互动|转场|收尾/.test(x.name)),sug.map(x=>x.name).join(' / '));
CK('候选知识点覆盖概念/诊断/提问/推进/演练',['购买层级','诊断','开放式','反向','顾虑','演练'].every(k=>sug.some(x=>x.name.includes(k)||x.why.includes(k))));
/* 完整导入 + 候选回挂 */
UI.page='content';UI.tab.content='导入';UI.sel.ciB=null;UI.sel.ci={files:[],text:'',link:'',dept:'',direct:false};
ciState().files=[{name:'【CEMN-购买层级诊断与推进】——讲师手册',size:'-',link:1,courseText:text}];A.ciRun();
const b=S.cimps.find(x=>x.st==='待确认');CK('导入确认页出现课程建议知识点',b&&b.items[0].kpSuggest.length>=5,'n='+(b&&b.items[0].kpSuggest.length));
/* 预置了同名 CEMN，导入默认跳过；测试直接使用新批次，不走重复检测，以验证导入和回挂 */
if(b&&b.items[0].dup){b.items[0].dup=null;b.items[0].act='新建';b.items[0].title='CEMN-购买层级诊断与推进 · 讲师手册（课程导入测试）';}
A.ciConfirm({dataset:{id:b.id}});const c=S.contents.find(x=>x.batch===b.id);
CK('课程导入后进入内容库草稿',!!c&&c.kind==='课程'&&c.st==='草稿',c&&c.title);
if(!c){L('STOP 未找到本次导入课程');}else{
const fresh=S.kpCand.filter(x=>x.contentId===c.id&&x.st==='待确认');
CK('课程导入产生候选知识点或明确说明已存在',fresh.length>=5||(b.kpCandExist&&b.kpCandExist.length>=5),'new='+fresh.length+' existing='+((b.kpCandExist||[]).length));
if(fresh.length){
  A.kpCandOk({dataset:{id:fresh[0].id}});
  const c2=content(c.id);const kid=(c2.kps||[])[0];
  CK('候选确认后回挂到课程',!!kid&&(c2.kps||[]).includes(kid),'kps='+(c2.kps||[]).join(','));
  CK('第一个回挂点是主讲解',c2.mainKp===kid&&c2.kpRole[c2.mainKp]==='主讲解',c2.mainKp+' / '+JSON.stringify(c2.kpRole));
  c2.st='已定稿';c2.cover='course-cover.png';c2.chan=['汽车销售'];c2.vis='全国';c2.publishType='立即发布';c2.pubSt='已上架';c2.pubVer=c2.ver||1;c2.pubAt=today+' 10:00';
  document.body.dataset.end='rn';ME=PEOPLE[0];R.page='school';renderRN();
  CK('课程上架后零售通学习专区可见',document.querySelector('#rscr').innerText.includes(c2.title),c2.title);
  CK('课程详情可打开且展示大纲',(()=>{document.body.dataset.end='pc';UI.page='cdetail';UI.cid=c2.id;UI.ctab='内容';render();const t=document.querySelector('#main').innerText;return t.includes('CEMN')&&t.includes('购买层级')&&!/vundefined|undefined/.test(t)})());
CK('预置 CEMN 课程字段完整',(()=>{const x=content('N_CEMN1');return !!x&&x.ver===1&&x.up===0&&x.down===0&&x.views===0})());
}else{CK('候选为空时有已存在说明',!!(b.kpCandExist&&b.kpCandExist.length),((b.kpCandExist||[]).join('、')));}
}
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
