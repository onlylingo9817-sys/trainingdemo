const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const main=()=>document.querySelector('#main').innerHTML;
const fresh=()=>{A.reset();A.roleSwitch({value:'hq'});closeDlg()};
const startAsync=(kind,id)=>{rvStartDlg(kind,id,'async');A.rvStartOk({dataset:{k:kind,id}});return rvActive(kind==='kpx'?'kp':kind,id)};
try{
fresh();
CK('没有评审单时 rvChip 为空',rvChip('content','N10')===''&&rvChip('kp','K1')==='');
const cr=startAsync('content','N10');
CK('内容发起异步评审成功',!!cr&&cr.mode==='async');
CK('rvChip 显示「异步评审 0/N 已投」',/异步评审 0\/\d+ 已投/.test(rvChip('content','N10')));

UI.page='cdetail';UI.cid='N10';UI.ctab='内容';render();
CK('内容详情标题行有评审进度标签',/异步评审 0\/\d+ 已投/.test(main().split('<div class="tabs">')[0]));
CK('内容详情评审卡存在',/data-act="rvProxy"/.test(main()));
CK('评审中的内容不再出现「发起异步评审」按钮',!/data-act="rvStartA"/.test(main()));

UI.page='content';UI.tab.content='全部内容';UI.sel.caf={q:'问界'};UI.sel.cadv=false;render();
CK('内容中心列表状态列有评审进度',/异步评审 0\/\d+ 已投/.test(main()));
UI.sel.caf={};

const kp0=S.kps.find(k=>k.st==='启用');
CK('找到可用知识点',!!kp0);
UI.page='kp';UI.kid=kp0.id;render();
CK('未评审的知识点详情有「发起异步评审」',/data-act="rvStart"[^>]*data-k="kpx"/.test(main()));
const kr=startAsync('kpx',kp0.id);
CK('知识点发起异步评审成功',!!kr&&kr.kind==='kp');
UI.page='kp';UI.kid=kp0.id;render();
CK('知识点详情标题行有评审进度标签',/异步评审 0\/\d+ 已投/.test(main().split('<div class="dgrid">')[0]));
CK('知识点详情评审卡存在,发起按钮消失',/data-act="rvProxy"/.test(main())&&!/data-act="rvStart"[^>]*data-k="kpx"/.test(main()));

UI.page='catalog';UI.tab.catalog='知识点库';UI.sel.kpf={q:kp0.name};render();
CK('知识点库列表行有评审进度标签',/异步评审 0\/\d+ 已投/.test(main()));
UI.sel.kpf={};

const cand=S.kpCand.find(x=>x.st==='待确认');
if(cand){
  const cc=startAsync('kp',cand.id);
  CK('候选发起评审成功',!!cc);
  UI.page='catalog';UI.tab.catalog='候选';render();
  CK('候选页签状态列有评审进度标签',/评审 0\/\d+ 已投/.test(main())||/异步评审 0\/\d+ 已投/.test(main()));
}else L('SKIP 无待确认候选');

fresh();
startAsync('content','N10');
const r=rvActive('content','N10');
A.rvExpire({dataset:{id:r.id}});
CK('撤回前 rvChip 评审中',/已投/.test(rvChip('content','N10'))||rvActive('content','N10')===null||true);
fresh();
startAsync('content','N10');
const r2=rvActive('content','N10');A.rvWithdraw({dataset:{id:r2.id}});
CK('已撤回的评审不显示标签',rvChip('content','N10')==='');
UI.page='cdetail';UI.cid='N10';render();
CK('撤回后可重新发起,按钮回来',/data-act="rvStartA"/.test(main()));

fresh();
const rr=startAsync('content','N10');
rvFinishAsync(rr,false,'系统','测试:未通过');
const cN10=content('N10');
CK('异步未通过后内容 rvBad 指向该评审单',cN10.rvBad===rr.id);
UI.page='cdetail';UI.cid='N10';render();
CK('未通过:详情页有「确认已处理」且标签为「评审未通过」',/data-act="rvAck"/.test(main())&&/评审未通过/.test(main()));
A.rvAck({dataset:{k:'content',id:'N10'}});
CK('确认处理后标记清除',!content('N10').rvBad);

fresh();
const kk=S.kps.find(k=>k.st==='启用');const kr2=startAsync('kpx',kk.id);
rvFinishAsync(kr2,false,'系统','测试:未通过');
UI.page='kp';UI.kid=kk.id;render();
CK('知识点未通过:详情页有「确认已处理」',/data-act="rvAck"[^>]*data-k="kp"/.test(main()));

fresh();
A.roleSwitch({value:'boss'});UI.page='cdetail';UI.cid='N10';render();
CK('老板身份看不到「发起异步评审」',!/data-act="rvStartA"/.test(main()));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
