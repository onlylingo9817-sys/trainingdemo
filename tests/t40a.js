/* t40a 学习包模板:新建 / 编辑 / 校验 / 启停过滤 / 实例不受影响(§37.12) */
const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.reset();A.roleSwitch({value:'hq'});closeDlg();
UI.page='config';UI.tab.config='学习包模板';render();
CK('模板页有「新建模板」入口',!!document.querySelector('[data-act="pkTplNew"]'));
CK('每个模板行都有编辑入口',document.querySelectorAll('[data-act="pkTplEdit"]').length===S.packTpl.length);
/* —— 新建 —— */
const n0=S.packTpl.length;
A.pkTplNew();
CK('新建弹窗打开',!!document.getElementById('pk_name'));
A.pkStepAdd();
CK('草稿步骤可追加',PK_DRAFT.steps.length===3);
document.getElementById('pk_name').value='演示专项包';
document.getElementById('pk_aud').value='演示人群';
A.pkTplSave();
const nt=()=>S.packTpl.find(t=>t.name==='演示专项包');
CK('新模板保存成功',!!nt()&&S.packTpl.length===n0+1,nt()&&nt().id);
CK('新模板默认启用且步骤完整',nt()&&nt().on===true&&nt().steps.length===3);
CK('列表页出现新模板',document.querySelector('#main').innerText.includes('演示专项包'));
/* —— 校验 —— */
A.pkTplNew();document.getElementById('pk_name').value='';A.pkTplSave();
CK('空名称被拦截',S.packTpl.length===n0+1);
A.pkTplNew();document.getElementById('pk_name').value='演示专项包';A.pkTplSave();
CK('重名被拦截',S.packTpl.filter(t=>t.name==='演示专项包').length===1);
PK_DRAFT=null;closeDlg();
/* —— 编辑 —— */
A.pkTplEdit({dataset:{id:nt().id}});
document.getElementById('pk_due').value='21';
document.getElementById('pk_rule').value='学完即可';
A.pkTplSave();
CK('编辑保存生效',nt().dueDays===21&&nt().passRule==='学完即可','due='+nt().dueDays);
/* —— 停用过滤 —— */
A.pkTplToggle({dataset:{id:nt().id}});
CK('停用后状态翻转',nt().on===false);
CK('停用后新建项目选不到它',!FS['学习|学习包'][0].opts().some(o=>o.includes('演示专项包')));
A.pkTplToggle({dataset:{id:nt().id}});
CK('重新启用后恢复可选',FS['学习|学习包'][0].opts().some(o=>o.includes('演示专项包')));
/* —— 已下发实例不受模板编辑影响 —— */
S.packs.unshift({id:'PKX',tpl:nt().id,kp:'K3',name:'实例快照',steps:nt().steps.map(s=>({t:s[0],need:s[1],done:false})),due:today,status:'进行中',ts:today,audience:1});
const before=JSON.stringify(S.packs[0].steps);
A.pkTplEdit({dataset:{id:nt().id}});A.pkStepAdd();A.pkTplSave();
CK('模板加步骤后,进行中的实例步骤不变',JSON.stringify(S.packs.find(p=>p.id==='PKX').steps)===before);
CK('模板本身步骤已更新',nt().steps.length===4);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
