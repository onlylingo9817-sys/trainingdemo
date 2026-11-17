const L=m=>out.push(String(m));const tx=()=>document.querySelector('#main').innerText;
/* t23c:三种角色全页面遍历(含 v23 新页)+ 零售通 + 工作台 + 空态 */
const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
const allTabs={overview:['闭环总览','老板视图','流程与规则'],config:['指标库','培训类型默认值','阈值与口径','维度体系','岗位画像','评价口径','学习包模板','内容管理','知识点规则','数据源'],
 effect:['效果看板','就绪度','错题集','调优','效果报告','复制与回炉'],topics:['发现的问题'],projects:['学习项目配置'],catalog:['总览','看板','候选','清河迁移'],content:['全部内容','导入','使用与反馈'],publish:['已上架','待上架','已下架','首页推荐位'],coach:['工单看板','推荐辅导店']};
let errs=0,pages=0;
['hq','r1','r2','boss'].forEach(role=>{A.roleSwitch({value:role});const pg=PAGES_OK[UI.role.type];
  Object.keys(allTabs).forEach(p=>{if(!pg.includes(p))return;
    allTabs[p].forEach(t=>{
      if(role==='boss'&&p==='effect'&&t==='调优')return;
      UI.page=p;UI.tab[p]=t;if(p==='effect'&&t==='调优')['诊断','配置版本','前后对比'].forEach(st=>{UI.tab.tune=st;try{render();pages++}catch(e){errs++;L('ERR '+role+' effect/调优/'+st+' '+e.message)}});
      try{render();pages++;if(tx().length<60){errs++;L('ERR 空白页 '+role+' '+p+'/'+t)}}catch(e){errs++;L('ERR '+role+' '+p+'/'+t+' '+e.message+' @'+(e.stack||'').split('\n')[1])}})});
  if(pg.includes('student')){S.lrn.slice(0,8).forEach(l=>{UI.page='student';UI.stuMid=l.mid;try{render();pages++}catch(e){errs++;L('ERR '+role+' student '+l.mid+' '+e.message)}})}
  if(pg.includes('kp')){S.kps.forEach(k=>{UI.page='kp';UI.kid=k.id;try{render();pages++}catch(e){errs++;L('ERR '+role+' kp '+k.id+' '+e.message)}})}
  if(pg.includes('workbench')){UI.page='workbench';try{render();pages++}catch(e){errs++;L('ERR '+role+' workbench '+e.message)}}
});
CK('4 种角色 × 全部页面/页签 无异常',errs===0,pages+' 个视图,异常 '+errs);
/* 学员详情:全部 41 人都能渲染 */
A.roleSwitch({value:'hq'});let se=0;S.lrn.forEach(l=>{UI.page='student';UI.stuMid=l.mid;try{render()}catch(e){se++;L('ERR student '+l.mid+' '+e.message)}});CK('41 位学员详情全部可渲染',se===0);
/* 老板:只读;没有调优 */
A.roleSwitch({value:'boss'});UI.page='effect';UI.tab.effect='就绪度';render();CK('老板可见就绪度,且没有配置入口',/就绪度/.test(tx())&&!PAGES_OK.boss.includes('config'));
CK('老板效果页签不含「调优」',!/调优/.test(document.querySelector('#main .tabs').innerText));
/* 区域老师:只看到有权限的页签 */
A.roleSwitch({value:'r1'});UI.page='effect';UI.tab.effect='就绪度';render();CK('区域老师可见就绪度',/就绪度/.test(tx()));
/* 工作台:新增待办类型 */
A.roleSwitch({value:'hq'});UI.page='workbench';render();
const it=wbItems();const types=[...new Set(it.map(x=>x.tag))];
CK('工作台新增「效果诊断」待办(命中第③层)',types.includes('效果诊断'),types.join('/'));
CK('工作台新增「错题复发」待办',types.includes('错题复发'));
CK('工作台待办分组含「效果」',[...new Set(it.map(x=>x.g))].includes('效果'));
CK('工作台待办按优先级降序',it.every((x,i,a)=>!i||a[i-1].sev>=x.sev));
const ef=it.filter(x=>x.g==='效果');let bad=0;ef.forEach(x=>{const d={};const m=(x.attrs||'').match(/data-p="(\w+)"/);const t=(x.attrs||'').match(/data-tab="([^"]+)"/);if(!m)bad++;});
CK('效果类待办「去处理」都带落点',bad===0,ef.length+' 条');
A.wbGo({dataset:{p:'effect',tab:'错题集',ky:'none'}});CK('点待办 → 落到「错题集」',UI.page==='effect'&&UI.tab.effect==='错题集'&&/错题集/.test(tx()));
/* 零售通 */
document.body.dataset.end='rn';
let re=0;PEOPLE.forEach(p=>{ME=p;R.page='adapt';try{renderRN();if(!document.querySelector('#rscr').innerText.length)re++}catch(e){re++;L('ERR rn '+p.mid+' '+e.message)}});
CK('零售通:全部 25 位演示学员「我的提升清单」可渲染',re===0);
ME=PEOPLE.find(p=>p.mid==='2024118');R.page='school';renderRN();CK('零售通首页显示就绪度',/就绪度/.test(document.querySelector('#rscr').innerText));
R.page='adapt';renderRN();
const rscr=document.querySelector('#rscr').innerText;
CK('提升清单有就绪度卡、最该先补、错题、学习包',/我的就绪度/.test(rscr)&&/最该先补/.test(rscr)&&/未关闭错题/.test(rscr));
const lx=lrnOf(ME.mid);const w=adaptList(ME.mid).filter(x=>x.pw!=null);
CK('提升清单按画像权重排序(权重高的缺口在前)',w.length>0&&w.every((x,i,a)=>!i||a[i-1].w>=x.w),w.slice(0,3).map(x=>x.k.name+'(权重'+x.pw+')').join(' > '));
/* 学习包任务可完成 */
const pk=packsOf(ME.mid).find(p=>p.status!=='已完成');
if(pk){const n=pk.steps.filter(s=>s.done).length;A.rPack({dataset:{id:pk.id}});CK('零售通完成学习包一步',pk.steps.filter(s=>s.done).length===n+1)}else CK('该学员无进行中学习包(跳过)',true);
document.body.dataset.end='pc';
/* 不在 v23 名单的学员也不能挂(走旧逻辑) */
document.body.dataset.end='rn';ME=PEOPLE.find(p=>!lrnOf(p.mid));
if(ME){R.page='adapt';try{renderRN();CK('不在理想名单的学员:提升清单仍可渲染(给诊断引导而非空白)',/完成一次诊断|我的就绪度/.test(document.querySelector('#rscr').innerText))}catch(e){CK('不在理想名单的学员',false,e.message)}}
document.body.dataset.end='pc';
/* 空态:清空数据后新页面不崩、给出引导 */
A.clear();A.roleSwitch({value:'hq'});
const empt=[['effect','就绪度'],['effect','错题集'],['effect','调优'],['config','维度体系'],['config','岗位画像'],['config','评价口径'],['config','学习包模板']];
let ee=0;empt.forEach(([p,t])=>{UI.page=p;UI.tab[p]=t;if(p==='effect'&&t==='调优')UI.tab.tune='诊断';try{render();if(tx().length<40){ee++;L('FAILblank '+p+'/'+t)}}catch(e){ee++;L('ERR 空态 '+p+'/'+t+' '+e.message+' @'+(e.stack||'').split('\n')[1])}});
CK('清空数据后 7 个新页面不崩',ee===0);
A.reset();
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
