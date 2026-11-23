const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
/* t24b:v1.2 知识点库筛选 / 热力图 / 标签不再作为独立概念 */
try{
A.roleSwitch({value:'hq'});closeDlg();
CK('当前目录 49 条知识点',S.kps.filter(k=>String(k.code||'').indexOf('XM-')===0).length===49,S.kps.length+' 条');
UI.page='catalog';UI.tab.catalog='知识点库';UI.sel.kpf={};UI.sel.kpPage={page:1,size:50};render();
CK('知识点库有业务线/岗位/知识域/卖点筛选',['line','role','domain','ability','sellpoint'].every(k=>!!document.querySelector('[data-k='+k+']')),'');
CK('知识点库有排序与导出',!!document.querySelector('[data-k=sort]')&&!!document.querySelector('[data-act=lstExport]'));
const n0=document.querySelectorAll('#main table.kp-list tr').length;
A.kpset({dataset:{k:'domain'},value:'产品知识'});
const n1=document.querySelectorAll('#main table.kp-list tr').length;
CK('按知识域筛选后列表收敛',n1>0&&n1<n0,n0+' → '+n1);
A.kpset({dataset:{k:'domain'},value:''});render();
CK('不再有左侧标签树',document.querySelectorAll('#main .tag-row').length===0);
UI.tab.catalog='总览';render();
CK('总览有车型×卖点/能力两张热力图',/车型 × 卖点分类/.test(tx())&&/车型 × 能力项/.test(tx()));
CK('总览有四项指标',/覆盖度/.test(tx())&&/可授课率/.test(tx())&&/可考核率/.test(tx())&&/时效健康度/.test(tx()));
UI.page='catalog';UI.tab.catalog='补学进度';render();
CK('补学进度页存在',/任务明细/.test(tx()));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
