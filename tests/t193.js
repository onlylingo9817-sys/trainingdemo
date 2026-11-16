const L=m=>out.push(m);const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});
const menu=document.querySelector('#menu').innerText;L('菜单含"知识点"='+/知识点/.test(menu)+' 菜单不含"目录"='+!/目录/.test(menu));
KP_TABS.concat([]).forEach(t=>{UI.page='catalog';UI.tab.catalog=t;render();const x=document.body.innerText;L(t+' 无"目录"字样='+!/目录/.test(x)+(/目录/.test(x)?' !!命中:'+x.match(/.{0,12}目录.{0,12}/)[0]:''))});
UI.tab.catalog='总览';render();L('标题='+/知识点/.test(tx())+' 副标题含弹药库='+/弹药库/.test(tx()));
UI.page='kp';UI.kid='K3';render();L('详情 无目录='+!/目录/.test(document.body.innerText)+' 弹药标题='+/弹药 · 讲解/.test(tx())+' '+/弹药 · 测评与演练/.test(tx())+' '+/弹药是否备齐/.test(tx())+' 面包屑='+/知识点 \/ K3/.test(tx().replace(/\n/g,' ')));
A.kpNew();render();L('新建表单 无目录='+!/目录/.test(document.body.innerText)+' 面包屑='+/知识点 \/ 新增知识点/.test(tx().replace(/\n/g,' ')));KF.name='K3';KF.car='N90 Max';A.kfSave();L('重名提示 toast='+document.querySelector('#toast').innerText);KF=null;
A.cEdit({dataset:{id:'N101'}});render();L('内容编辑页 提示='+/知识点/.test(tx())+' 无目录='+!/目录/.test(document.body.innerText));
A.cView({dataset:{id:'N108'}});render();L('内容详情(未挂载) 提示含知识点='+/知识点/.test(tx())+' 无目录='+!/目录/.test(tx()));
const un=S.contents.find(c=>!(c.kps||[]).length&&usableC(c)&&!isPub(c));if(un){A.cPub({dataset:{id:un.id}});L('上架弹窗 无目录='+!/目录/.test(document.querySelector('#dlg').innerText));closeDlg()}
document.body.dataset.end='rn';renderRN();L('零售通 无目录='+!/目录/.test(document.body.innerText));document.body.dataset.end='pc';
['r1','boss'].forEach(r=>{A.roleSwitch({value:r});const ok=PAGES_OK[UI.role.type];L(r+' 菜单含知识点='+/知识点/.test(document.querySelector('#menu').innerText)+' (应='+ok.includes('catalog')+')')});
A.roleSwitch({value:'hq'});
}catch(e){L('TOP '+e.message+' @'+(e.stack||'').split('\n')[1])}
