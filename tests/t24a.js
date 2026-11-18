const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});closeDlg();
/* 1. 一套能力口径 */
const abs=dimOf('Dab').values.map(v=>v.name);
CK('全站能力只有 4 个业务项',abs.length===4&&abs.join('/')==='探需/场景化讲车/顾虑解除/带人辅导',abs.join('/'));
CK('知识点能力与画像同源',S.kps.every(k=>{const id=(k.dims.Dab||[])[0];return !id||!!dimVal('Dab',id)}));
CK('没有旧六力残留',!JSON.stringify(S).match(/技术力|沟通力|业务力|服务力|领导力|执行力/));
/* 2. 多车型 */
CK('知识点支持多车型字段',S.kps.every(k=>Array.isArray(k.cars)&&k.cars.length>0));
CK('多车型统计按车型分开',(()=>{const t=ptagByPath('内饰');const stats=kpCarsHost().map(c=>kpStatFor(t.id,c));return stats.length===3&&stats.some((x,i,a)=>i&&x.n!==a[0].n)})() ,kpCarsHost().map(c=>c+'='+kpStatFor(ptagByPath('内饰').id,c).n).join(' / '));
/* 3. 知识点页:三件事 */
UI.page='catalog';UI.tab.catalog='总览';render();const ov=tx();
CK('总览第一屏是缺口而不是学员列表',/先做这三步/.test(ov)&&/车型 × 标签/.test(ov)&&ov.indexOf('车型 × 标签')<ov.indexOf('学员集中薄弱'),'矩阵位置 '+ov.indexOf('车型 × 标签')+' 薄弱位置 '+ov.indexOf('学员集中薄弱'));
CK('总览矩阵每款车单独列',kpCarsHost().every(c=>document.querySelector('#main').innerText.includes(c)));
CK('总览不再出现「车型 × 部位」',!/车型 × 部位|车上的部位/.test(ov));
UI.tab.catalog='知识点库';render();const lib=tx();
CK('知识点库可按适用车型筛',/适用车型/.test(lib)&&/标签/.test(lib));
CK('知识点库支持批量操作',/批量指定负责人|批量启用/.test(lib));
UI.tab.catalog='知识点库';render();A.kpOpenBatch();const batch=document.querySelector('#drw-root').innerText;
CK('批量新建含 CSV 导入',/批量导入/.test(batch)&&/下载 CSV 模板/.test(batch));
CK('批量新建含新车克隆',/新车型一键克隆/.test(batch));
CK('批量新建含一个点多车型',/一个卖点，多个车型/.test(batch));
/* 4. 工作台不再被同一类待办淹没 */
UI.page='workbench';render();const it=wbItems();
CK('待办总量可控(<=45)',it.length<=45,'待办='+it.length);
CK('无负责人的点合并成一条治理待办',it.filter(x=>x.tag==='没有负责人').length<=1,'条数='+it.filter(x=>x.tag==='没有负责人').length);
CK('分组筛选键与数据一致',WB_GROUPS.every(g=>it.some(x=>x.g===g[0]))&&WB_GROUPS.every(g=>typeof g[1]==='string'));
const g0=WB_GROUPS[1];A.wbF({dataset:{v:g0[0]}});const shown=Math.min(25,it.filter(x=>x.g===g0[0]).length);const rows=document.querySelectorAll('#main table.t tr').length-1;CK('准备内容筛选有结果',rows===shown,rows+' vs '+shown);A.wbF({dataset:{v:''}});
/* 5. 新用户导览 */
A.pageHelp();CK('页头「怎么用」可用',/这页怎么用/.test(document.querySelector('#dlg').innerText));closeDlg();
/* 6. 新建一个多车型点 */
UI.page='catalog';UI.tab.catalog='知识点库';render();A.kpOpenBatch();
$('#kp_multi_name').value='测试多车型点';document.querySelectorAll('.kp_multi_car')[1].checked=true;document.querySelectorAll('.kp_multi_car')[2].checked=true;A.kpQuickAdd();
const nk=S.kps.find(k=>k.name==='测试多车型点');CK('新建一个点多车型成功',!!nk&&nk.cars.length===2,nk?nk.cars.join('/'):'没建成');
/* 7. 详情:不再出现黑话 */
if(nk){UI.page='kp';UI.kid=nk.id;render();const d=tx();CK('详情用业务语言',!/归属|上下文|弹药/.test(d)&&/这个点能上课了吗/.test(d))}
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
