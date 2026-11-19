const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.reset();A.roleSwitch({value:'hq'});closeDlg();
UI.page='workbench';render();
const it=wbItems();
CK('每条待办都有稳定 key',it.length>0&&it.every(x=>typeof x.key==='string'&&x.key.split('|').length===3));
const target=it[0];
A.wbAssign({dataset:{k:target.key}});
const sel=document.querySelector('#wb_asg');
CK('派人弹窗给出负责人下拉',!!sel&&sel.options.length>1);
sel.value=sel.options[1].value;A.wbAssignOk({dataset:{k:target.key}});
const after1=wbItems().find(x=>x.key===target.key);
CK('派人后状态挂到待办上',after1&&after1.asg===sel.options[1].value);
CK('列表显示「已派给」',/已派给/.test(document.querySelector('#main').innerText));
A.wbSnooze({dataset:{k:target.key}});
document.querySelector('#wb_sn').value='7';A.wbSnoozeOk({dataset:{k:target.key}});
const after2=wbItems().find(x=>x.key===target.key);
CK('暂缓日期按演示日期 +7 天',after2&&after2.sn===addDays(today,7),after2&&after2.sn);
CK('暂缓后不再出现在主列表计数',/已暂缓 1/.test(document.querySelector('#main').innerText));
A.wbSnzT();
CK('已暂缓视图里能看到这条,带恢复入口',/暂缓到/.test(document.querySelector('#main').innerText)&&!!document.querySelector('[data-act="wbUnsnooze"]'));
A.wbUnsnooze({dataset:{k:target.key}});
A.wbSnzT();
CK('恢复后回到主列表',!!wbItems().find(x=>x.key===target.key&&!x.sn));
A.wbAssign({dataset:{k:target.key}});
document.querySelector('#wb_asg').value='';A.wbAssignOk({dataset:{k:target.key}});
CK('取消指派后标记消失',!wbItems().find(x=>x.key===target.key).asg);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
