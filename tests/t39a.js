const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const main=()=>document.querySelector('#main').innerHTML;const dlg=()=>document.querySelector('#dlg').innerHTML;
const fresh=()=>{A.reset();A.roleSwitch({value:'hq'});closeDlg()};
const start=()=>{rvStartDlg('content','N10','async');A.rvStartOk({dataset:{k:'content',id:'N10'}});return rvActive('content','N10')};
try{
fresh();
CK('只有一单时详情页不显示「评审记录」',rvHistory('content','N10')==='');
let r=start();A.rvWithdraw({dataset:{id:r.id}});start();
UI.page='cdetail';UI.cid='N10';UI.ctab='内容';render();
const h=main();
CK('两单时详情页显示「评审记录」',/评审记录/.test(h));
CK('记录里含已撤回的旧单号',h.includes(r.id));
CK('记录里含当前进行中的单号',h.includes(rvActive('content','N10').id));
CK('记录区给出每单的状态',/已撤回/.test(h)&&/评审中/.test(h));
CK('每单有「查看」入口',(h.match(/data-act="rvPick"/g)||[]).length===2);
A.rvPick({dataset:{id:r.id,k:'content',oid:'N10'}});
CK('历史单弹窗打开且是只读快照',/评审单 /.test(dlg())&&/只读快照/.test(dlg()));
CK('只读快照里不出现代录 / 撤回之类的操作按钮',!/data-act="rvProxy"/.test(dlg())&&!/data-act="rvWithdraw"/.test(dlg()));
closeDlg();
/* 知识点侧也要有 */
A.roleSwitch({value:'hq'});const k=S.kps.find(x=>x.st==='启用');
rvStartDlg('kpx',k.id,'async');A.rvStartOk({dataset:{k:'kpx',id:k.id}});
const kr=rvActive('kp',k.id);A.rvWithdraw({dataset:{id:kr.id}});
rvStartDlg('kpx',k.id,'async');A.rvStartOk({dataset:{k:'kpx',id:k.id}});
UI.page='kp';UI.kid=k.id;render();
CK('知识点详情也有「评审记录」',/评审记录/.test(main()));
/* 两单且最新一单也撤回:记录区仍在,卡片如实显示「已撤回」,且可重新发起 */
fresh();r=start();A.rvWithdraw({dataset:{id:r.id}});
const r2=start();A.rvWithdraw({dataset:{id:r2.id}});
UI.page='cdetail';UI.cid='N10';render();
CK('两单都撤回后评审记录仍在',/评审记录/.test(main()));
CK('已撤回的单在记录里可查',/已撤回/.test(main()));
CK('撤回后可重新发起评审(按钮回来)',/data-act="rvStartA"/.test(main()));
A.rvPick({dataset:{id:r.id,k:'content',oid:'N10'}});
CK('可翻看更早的那一单',/评审单 RV/.test(dlg()));closeDlg();
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
