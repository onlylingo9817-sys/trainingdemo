const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
UI.page='tagmanage';render();
CK('标签管理不再常驻“标签治理”AI块',!/标签治理：只提示/.test(document.querySelector('#main').innerText));
const i=document.querySelector('#tag_new_name');i.value='车内冰箱';i.dispatchEvent(new Event('input',{bubbles:true}));
CK('新建标签输入相似名时提示已有标签',/已有相似标签/.test((document.querySelector('#tag_dup_hint')||{}).innerText||''));
const before=PTAGS.length;
A.tagAdd();
CK('未勾选「仍然新建」时相似名被拦下',PTAGS.length===before);
const fc=document.querySelector('#tag_new_force');
CK('相似提示里给出「仍然新建」勾选项',!!fc);
fc.checked=true;A.tagAdd();
CK('勾选后允许新建相似标签',PTAGS.length===before+1);
const created=PTAGS[PTAGS.length-1];PTAGS.splice(PTAGS.indexOf(created),1);refreshTagPaths();render();
i.value='全新的测试标签';i.dispatchEvent(new Event('input',{bubbles:true}));
CK('无相似名时不打扰',!((document.querySelector('#tag_dup_hint')||{}).innerText||'').trim());
UI.page='content';UI.tab.content='题';render();
CK('题库不再常驻“推荐出题来源”',!/推荐出题来源/.test(document.querySelector('#main').innerText));
UI.page='content';UI.tab.content='演练';render();
CK('演练不再常驻“推荐演练来源”',!/推荐演练来源|按技能型知识点推荐/.test(document.querySelector('#main').innerText));
UI.page='catalog';UI.tab.catalog=KP_TAB_LIB;render();
CK('知识点页不再有“AI 找缺口”按钮',!/AI 找缺口/.test(document.querySelector('#main').innerText));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
