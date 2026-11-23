const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const html=()=>document.querySelector('#main').innerHTML;
const tx=()=>document.querySelector('#main').innerText;
/* t47a:知识点 UX v1.3 —— 候选走表单 / 补学状态推导 / 列表缺口列 / 表单必填 / 空与报错状态 */
try{
A.roleSwitch({value:'hq'});closeDlg();A.reset();
/* 补学任务：状态与截止日一致 */
const T=S.tasks;
CK('逾期任务截止日都已过',T.filter(t=>kpTaskEff(t)==='逾期').every(t=>t.due<today));
CK('进行中任务截止日都未过',T.filter(t=>['未读','已读','已确认'].includes(kpTaskEff(t))).every(t=>t.due>=today));
const st=kpTaskStats();CK('统计与明细一致',st.done+st.overdue+st.suspend+st.open===st.total,JSON.stringify(st));
UI.page='catalog';UI.tab.catalog='补学进度';UI.sel.kpTf=null;render();
CK('补学进度有状态筛选和搜索',document.querySelectorAll('[data-act="kpTaskF"]').length>=5&&!!document.querySelector('[data-wc="kpTq"]'));
A.kpTaskF({dataset:{v:'逾期'}});CK('按状态筛选只剩逾期行',document.querySelectorAll('tr td .tag.err').length===st.overdue,document.querySelectorAll('tr td .tag.err').length+' / '+st.overdue);
const open=T.find(t=>kpTaskEff(t)==='逾期');A.kpTaskClose({dataset:{id:open.id}});
CK('关闭任务先确认',/确认关闭/.test(document.querySelector('#dlg').innerText)&&open.state!=='已关闭');
A.kpTaskCloseOk({dataset:{id:open.id}});CK('确认后任务已关闭',open.state==='已关闭'&&kpTaskEff(open)==='已关闭');
A.kpTq({value:'不存在的人xyz'});CK('无匹配显示空状态',!!document.querySelector('.ux-state.empty'));
UI.sel.kpTf=null;
/* 候选：确认走表单，不生成残缺知识点 */
UI.tab.catalog='候选';render();
CK('候选按钮为「补全并新增」且无旧按钮',/补全并新增/.test(tx())&&!document.querySelector('[data-act="kpCandOk"]'));
CK('候选相近提示指向 v1.2 已有知识点',S.kpCand.filter(x=>x.st==='待确认').every(x=>(x.sug||[]).every(n=>S.kps.some(k=>k.name===n))));
CK('「金融方案讲解」可并入已有',!document.querySelector('[data-act="kpCandMerge"][data-id="C3"]').disabled);
const c1=S.kpCand.find(x=>x.id==='C1');const n0=S.kps.length;
A.kpCandForm({dataset:{id:'C1'}});
CK('打开预填表单',UI.page==='kpform'&&KF.name===c1.name&&KF.candId==='C1'&&/来自候选/.test(tx()));
A.kfSubmit();
CK('卖点分类未选时拦截并行内报错',S.kps.length===n0&&UI.page==='kpform'&&!!document.querySelector('.ux-errsum')&&!!document.querySelector('.fr.has-err'));
A.kfSet&&0;KF._ph={};KF.sellpoint='充电补能';KF.one='学员能向客户讲清路上充电的几种方式与适用场景。';UI.sel.kpSpecReview=null;
A.kfSubmit();
CK('未做 AI 评估时提示',/还没做 AI 评估/.test(document.querySelector('#dlg').innerText)&&S.kps.length===n0);
A.kfSaveAnyway();
const nk=S.kps[S.kps.length-1];
CK('保存后新知识点结构完整',S.kps.length===n0+1&&!!nk.code&&!!nk.domain&&!!nk.sellpoint&&(nk.roles||[]).length>0&&!!nk.assess,nk.code);
CK('候选标记已新增并回链',c1.st==='已新增'&&c1.newKpId===nk.id);
const c3=S.kpCand.find(x=>x.id==='C3');A.kpCandMerge({dataset:{id:'C3'}});CK('并入已有写入同义词',/已并入/.test(c3.st)&&kp('K61').syn.includes(c3.name));
/* 新增表单：必填项默认「请选择」 */
A.kpNew();render();
CK('必填下拉默认「请选择」',document.querySelectorAll('select option[disabled][selected]').length>=3);
A.kfSubmit();
CK('空表单保存列出全部缺项',document.querySelectorAll('.ux-errsum li').length>=3,document.querySelectorAll('.ux-errsum li').length+' 项');
CK('表单有分区导航和标题吸顶栏',document.querySelectorAll('.ux-anchor a').length===5&&!!document.querySelector('.dock-t'));
CK('「内容审核状态」已改名',/依据核对状态/.test(tx())&&!/内容审核状态/.test(tx()));
A.kfCancel();
/* 列表：缺什么 / 行点击 / 翻页顺序 */
UI.page='catalog';UI.tab.catalog=KP_TAB_LIB;UI.sel.kpf={};render();
CK('列表有「缺什么」且 P0 缺口在前',/缺讲解|题 \d\/\d/.test(tx())&&kp(UI.kpOrder[0]).pri==='P0');
CK('整行可点击进入详情',document.querySelectorAll('tr.kp-click[data-act="kpOpen"]').length>0);
UI.sel.kpf={domain:'客户运营'};render();const ord=UI.kpOrder.slice();
const first=document.querySelector('tr.kp-click');A.kpOpen({dataset:{id:first.dataset.id},closest:s=>first.closest(s)});
A.kpNav({dataset:{d:'1'}});CK('上一个/下一个按列表顺序翻',ord.length<2||UI.kid===ord[1],UI.kid+' vs '+ord[1]);
/* 详情 */
UI.kid='K6';UI.page='kp';render();
CK('详情有结论条且不再有重复基本信息卡',!!document.querySelector('.ux-verdict')&&(tx().match(/基本信息/g)||[]).length===1);
CK('详情不再出现已下线的标签建议',!/建议补这些标签/.test(tx()));
CK('页签说明按页面显示、无全站顶部横幅',!!document.querySelector('.ux-note')===false&&!document.querySelector('.ai-guide'));
UI.kid='NOPE';UI.page='kp';render();
CK('找不到知识点显示报错状态',!!document.querySelector('.ux-state.error')&&/返回知识点库/.test(tx()));
/* 总览 */
UI.page='catalog';UI.tab.catalog='总览';render();
const ovCtx=UI.sel.kpOv;const ovGaps=S.kps.filter(k=>kpV12Metrics(k,ovCtx)&&kpGapList(k).length).length;const shown=+((tx().match(/当前口径下 (\d+) 个点还没完备/)||[])[1]);
CK('总览缺口数 = 逐点缺口判定之和（与详情结论同一口径）',shown===ovGaps&&ovGaps>0,shown+' / '+ovGaps);
CK('总览无开发口径',!/分母应为|\d+ error|数据来源/.test(tx()));
CK('热力格可点击进入知识点库',!!document.querySelector('.ux-cell'));
const cell=document.querySelector('.ux-cell');A.kpHeatGo({dataset:{kind:cell.dataset.kind,car:cell.dataset.car,col:cell.dataset.col}});
CK('点热力格进入已筛选的知识点库',UI.tab.catalog===KP_TAB_LIB&&!!(kpLibFilter().sellpoint||kpLibFilter().ability));
/* 加载态：批量导入读取 CSV 期间 */
UI.page='catalog';UI.tab.catalog=KP_TAB_LIB;A.kpOpenBatch();
UI.sel.kpBusy='正在读取 知识点清单.csv…';UI.drw.body=kpBatchPage();renderDrawer();
CK('读取文件时显示加载态',/正在读取/.test(document.querySelector('#drw-root').innerText)&&!!document.querySelector('#drw-root .ux-skel'));
UI.sel.kpBusy=null;UI.drw.body=kpBatchPage();renderDrawer();
CK('读取完成后加载态消失',!document.querySelector('#drw-root .ux-skel'));
A.drwClose();
/* 报错兜底 */
const keep=kpLibrary;kpLibrary=function(){throw new Error('boom')};UI.tab.catalog=KP_TAB_LIB;render();
CK('页签渲染异常显示报错状态并可重试',!!document.querySelector('.ux-state.error')&&/重试/.test(tx()));
kpLibrary=keep;A.kpRetry();CK('重试后恢复',!document.querySelector('.ux-state.error'));
CK('页面无 undefined / NaN',!/undefined|NaN/.test(html()));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' | '))}
