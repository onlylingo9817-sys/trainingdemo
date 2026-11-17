const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();A.aiOpen();
const dlg=document.querySelector('#dlg');
const rows=[...document.querySelectorAll('.ai-row')];
CK('AI 检查弹窗打开',!!dlg&&/AI 检查建议/.test(dlg.innerText));
CK('每条检查都有独立操作区',rows.length>0&&rows.every(r=>!!r.querySelector('.ai-row-actions')),'rows='+rows.length);
const actions=[...document.querySelectorAll('.ai-row-actions')];
const twoBtnRows=[...document.querySelectorAll('.ai-row-actions')].filter(a=>a.querySelectorAll('.btn').length>=2);
CK('AI 检查操作列宽度足够',actions.every(a=>a.getBoundingClientRect().width>=160),actions.map(a=>Math.round(a.getBoundingClientRect().width)).join(','));
const buttons=[...document.querySelectorAll('.ai-row-actions .btn')];
CK('AI 检查按钮强制横排',buttons.length>0&&buttons.every(b=>getComputedStyle(b).whiteSpace==='nowrap'),buttons.map(b=>getComputedStyle(b).whiteSpace).join(','));
CK('AI 检查按钮没有被压成竖条',buttons.every(b=>b.getBoundingClientRect().width>=44&&b.getBoundingClientRect().height<=32),buttons.map(b=>Math.round(b.getBoundingClientRect().width)+'x'+Math.round(b.getBoundingClientRect().height)).join(','));
CK('同一行两个操作按钮在同一水平线',twoBtnRows.length>0&&twoBtnRows.every(a=>{const b=[...a.querySelectorAll('.btn')];return b.every(x=>Math.abs(x.getBoundingClientRect().top-b[0].getBoundingClientRect().top)<2)}),twoBtnRows.length+' 行');
CK('AI 检查按钮文字未被裁切',buttons.every(b=>b.scrollHeight<=b.clientHeight+1&&b.scrollWidth<=b.clientWidth+1));
const note=document.querySelector('#dlg .ft .dlg-note');
const body=document.querySelector('#dlg .bd');
CK('规则模拟说明固定在底部按钮栏',!!note&&!!note.closest('.ft')&&!note.closest('.bd'));
CK('底部说明不会被滚动区裁切',!!note&&note.getBoundingClientRect().bottom<=note.closest('#dlg').getBoundingClientRect().bottom&&note.getBoundingClientRect().top>=body.getBoundingClientRect().bottom-1);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
