const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
UI.page='workbench';UI.sel.wbMore=false;render();
const n25=document.querySelectorAll('#main table.t tr').length;
CK('工作台默认最多 25 条',n25<=26,n25+' 行(含表头)');
if(n25>26){CK('工作台有看全部入口',!!document.querySelector('[data-act=wbMore]'));A.wbMore();CK('看全部后渲染更多待办',document.querySelectorAll('#main table.t tr').length>n25,'')}else{CK('工作台待办≤25,无需看全部',true,n25+' 行')}
UI.page='tagmanage';render();
const t=tagActive().find(x=>x.name==='车内冰箱')||tagActive()[1];
A.tagRename({dataset:{id:t.id}});
CK('改名使用统一弹窗而非浏览器 prompt',/改名/.test(document.querySelector('#dlg').innerText)&&!!document.querySelector('#tr_name'));
document.querySelector('#tr_name').value='车内冰箱改名测试';A.tagRenameOk({dataset:{id:t.id}});
CK('改名后标签名生效',ptagOf(t.id).name==='车内冰箱改名测试');
A.tagMove({dataset:{id:t.id}});
CK('移动使用统一弹窗(下拉选择)',!!document.querySelector('#tm_pid'));
A.drwClose&&A.drwClose();closeDlg();
A.tagOff({dataset:{id:t.id}});
CK('停用使用统一弹窗(非 confirm)',/停用/.test(document.querySelector('#dlg').innerText)&&!!document.querySelector('[data-act=tagOffOk]'));
closeDlg();
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
