const L=m=>out.push(m);const tx=()=>document.querySelector('#main').innerText;
try{closeDlg();
A.roleSwitch({value:'hq'});
L('首页='+UI.page+' (应 workbench)');
L('菜单顺序='+[...document.querySelectorAll('#menu .mg')].map(e=>e.innerText).join(' > '));
// ---- 结构:旧入口已迁走 ----
L('知识点页签='+KP_TABS.join('/')+' | 内容中心页签='+CTABS.join('/'));
L('内容中心性质='+CK4.join('/')+' 全部='+cAll().length+' (话术+课程='+S.contents.filter(visC).length+' 题='+S.qs.length+' 演练='+S.drills.length+')');
L('菜单不再有"AI 演练剧本中心"='+!/AI 演练剧本中心/.test(document.querySelector('#menu').innerText));
// ---- 工作台 ----
UI.page='workbench';render();const wb=tx();
L('工作台 主线5段='+/发现[\s\S]*备料[\s\S]*发布[\s\S]*实施[\s\S]*效果/.test(wb)+' 待办数='+wbItems().length+' 按优先级降序='+wbItems().every((x,i,a)=>!i||a[i-1].sev>=x.sev));
const grp={};wbItems().forEach(x=>grp[x.g]=(grp[x.g]||0)+1);L('待办分组='+JSON.stringify(grp));
A.wbF({dataset:{v:'备料'}});L('过滤"备料" 行='+(document.querySelectorAll('#main table.t tr').length-1)+' = '+grp['备料']);A.wbF({dataset:{v:''}});
// 每类待办的"去处理"都能落地(不抛错、落到正确页面)
const kinds={};wbItems().forEach(x=>{if(!kinds[x.tag])kinds[x.tag]=x});let bad=0;
Object.values(kinds).forEach(x=>{UI.page='workbench';UI.sel.wbf='';render();const tmp=document.createElement('div');tmp.innerHTML=x.raw||'<button '+x.attrs+'></button>';const el=tmp.querySelector('[data-act]');if(!el){L('  ✗ 无动作:'+x.tag);bad++;return}
  try{const f=A[el.dataset.act];if(!f){L('  ✗ 缺 action '+el.dataset.act+' ('+x.tag+')');bad++;return}f(el);if(!document.querySelector('#main').innerText.length){L('  ✗ 落地页空白:'+x.tag);bad++}closeDlg()}catch(e){L('  ✗ '+x.tag+' → '+e.message);bad++}});
L('待办类型 '+Object.keys(kinds).length+' 种,「去处理」失败='+bad);
// ---- 回流闭环:学员薄弱 → 工作台 → 课题 → 内容 → 上架 ----
A.reset();closeDlg();
const wk=kpWeakList();const k=wk.find(x=>!kpTopicOf(x.k)&&kpHealth(x.k).cells.exp.s==='ok');
if(k){const kid=k.k.id;UI.page='workbench';render();
  const has=()=>wbItems().some(x=>x.tag==='学员集中薄弱'&&x.attrs.includes('data-id="'+kid+'"'));
  L('① 学员集中薄弱 → 工作台有待办='+has());
  A.kpToTopic({dataset:{id:kid}});const tp=kpTopicOf(kp(kid));L('② 生成课题 '+tp.id+' 待办消失='+!has());
  UI.page='topic';UI.tid=tp.id;render();L('③ 课题详情 链路条='+/这个课题/.test(tx())+' 含知识点='+/来自知识点/.test(tx()));
  A.cNew({dataset:{t:tp.id}});L('④ 从课题新建内容 自动挂知识点='+(C.kps||[]).includes(kid));C.title='闭环测试 · '+kp(kid).name;C.cover='x.png';C.kw=(kp(kid).syn||[])[0]||'闭环';C.lecturer='王磊';if(C.kind==='话术'){C.spin={S:'哥,测试。',P:'痛点。',I:'**影响**。',N:'收益。'};C.bscene='展厅'}else{C.intro='1. 要点一\n2. 要点二'}
  A.cSave({dataset:{s:'1'}});const nc=S.contents[0];const _rv=wbItems().some(x=>x.tag==='待我审核'&&x.title.includes('闭环测试'));L('⑤ 提交审核 '+nc.id+' st='+nc.st+' (保存草稿并提交:若硬规则不过则仍是草稿) 工作台出现待审核='+_rv);if(nc.st==='草稿'){A.cSubmit({dataset:{id:nc.id}})}L('   提交后 st='+nc.st+' 工作台待审核='+wbItems().some(x=>x.tag==='待我审核'&&x.title.includes('闭环测试')));
  A.cReview({dataset:{id:nc.id}});A.cPass({dataset:{id:nc.id}});L('⑥ 定稿 st='+nc.st+' 工作台出现待上架='+wbItems().some(x=>x.tag==='待上架'&&x.title.includes(nc.title.slice(0,6))));
  A.cPub({dataset:{id:nc.id}});A.cPubOk({dataset:{id:nc.id}});L('⑦ 上架 pub='+pubOf(nc)+' 待上架待办消失='+!wbItems().some(x=>x.tag==='待上架'&&x.title.includes(nc.title.slice(0,6))));
  A.cView({dataset:{id:nc.id}});L('⑧ 内容详情 链路条:'+document.querySelector('#main .lk').innerText.replace(/\n/g,' ').slice(0,120));
  UI.page='kp';UI.kid=kid;render();L('⑨ 知识点详情 链路条含课题='+/来自课题/.test(document.querySelector('#main .lk').innerText)+' 讲解弹药='+kpMounted(kp(kid)).length+' 条')
}else L('(没有可用于闭环测试的薄弱知识点)');
// ---- 链路条在三种对象上 ----
A.cView({dataset:{id:'N108'}});L('未挂载内容 链路条显示"未挂载 · 去挂"='+/去挂/.test(document.querySelector('#main .lk').innerText));
A.lkMount({dataset:{id:'N108'}});L('点"去挂" → 弹出推荐='+/系统推荐/.test(document.getElementById('dlg').innerText));const mb=document.querySelector('#dlg [data-act=lkMountDo]');if(mb){A.lkMountDo({dataset:{id:'N108',k:mb.dataset.k}});L('一键挂载 → kps='+content('N108').kps)}
// ---- 内容中心新增菜单 ----
A.cNewMenu();L('新增菜单 4 项='+(document.querySelectorAll('#dlg [data-act=cNewAny]').length===4));
['话术','课程','题','演练'].forEach(k=>{closeDlg();try{A.cNewAny({dataset:{v:k}});L('  新增 '+k+' → page='+UI.page)}catch(e){L('  ✗ 新增 '+k+' '+e.message)}});
// ---- 内容中心统一列表:每种性质"编辑/查看"都能打开 ----
UI.page='content';UI.tab.content='全部内容';UI.sel.cadv=false;
['话术','课程','题','演练'].forEach(k=>{UI.sel.caf={k};render();const a=document.querySelector('#main table.t.nw a.link[data-act]');if(!a){L('  ✗ '+k+' 无可点');return}try{A[a.dataset.act](a);L('  '+k+' 列表 → 打开 '+UI.page)}catch(e){L('  ✗ '+k+' '+e.message)}UI.page='content';UI.tab.content='全部内容'});
// ---- 题/演练 编辑返回到内容中心 ----
A.qOpen({dataset:{id:'Q1'}});A.qCancel();L('题编辑取消 → '+UI.page+' / '+UI.tab.content);A.drOpen({dataset:{id:'D1'}});A.drCancel();L('演练编辑取消 → '+UI.page);
// ---- 配置中心接收了规则 ----
UI.page='config';UI.tab.config='知识点规则';render();L('配置中心·知识点规则 含完备度5点='+/完备度的 5 个点/.test(tx())+' 新车型模板='+/新车型怎么起知识点/.test(tx()));
// ---- 三身份 ----
['r1','boss'].forEach(r=>{A.reset();A.roleSwitch({value:r});const ok=PAGES_OK[UI.role.type];L(r+' 首页='+UI.page+' 工作台权限='+ok.includes('workbench')+' 待办='+(ok.includes('workbench')?(UI.page='workbench',render(),wbItems().length):'-'));['content','catalog'].forEach(p=>{if(ok.includes(p)){UI.page=p;try{render()}catch(e){L('ERR '+r+' '+p+' '+e.message)}}})});
// ---- 清空数据 ----
A.roleSwitch({value:'hq'});A.clear();['workbench','content','catalog','overview'].forEach(p=>{UI.page=p;try{render();L('清空后 '+p+' ok len='+tx().length)}catch(e){L('ERR clear '+p+' '+e.message+' @'+(e.stack||'').split('\n')[1])}});
}catch(e){L('TOP '+e.message+' @'+(e.stack||'').split('\n')[1])}
