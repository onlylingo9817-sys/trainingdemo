const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
UI.page='people';UI.sel.ppl={};UI.sel.pplPage={page:1,size:20};render();
CK('人员页有需关注口径入口',/需关注口径/.test(document.querySelector('#main').innerText));
const ps=personScope();const before=ps.filter(personNeedCare).length;A.pplCareDlg();document.querySelector('#care_ratio').value='0.99';document.querySelector('#care_packs').value='0';A.pplCareSave();
UI.page='people';render();
CK('调整口径后需关注人数变化',personScope().filter(personNeedCare).length>=before,'before='+before);
CK('人员列表有勾选与批量栏',!!document.querySelector('[data-act=lstSel]'));
const pick=personScope().find(p=>p.group!=='对照批');A.lstSel({dataset:{k:'pplPage',id:pick.mid},checked:true});
CK('勾选后出现三种批量动作',/批量指派学习包/.test(document.querySelector('#main').innerText)&&/批量发起辅导/.test(document.querySelector('#main').innerText));
const ctrl=personScope().find(p=>p.group==='对照批');if(ctrl){UI.page='person';UI.stuMid=ctrl.mid;render();const btns=[...document.querySelectorAll('#main button')].filter(b=>/指派学习包|加入项目/.test(b.innerText));CK('对照批详情动作置灰',btns.length>0&&btns.every(b=>b.disabled))}
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
