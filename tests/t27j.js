const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
UI.kid='K3';UI.page='kp';render();
const page0=UI.page,kid0=UI.kid;
A.kpMountDrawer();
CK('挂载已有内容留在知识点页打开抽屉',!!document.querySelector('.drw')&&UI.page==='kp'&&UI.kid===kid0,UI.page);
A.drwClose();CK('关闭抽屉回到原页面与原知识点',!document.querySelector('.drw')&&UI.page===page0&&UI.kid===kid0);
A.kpGoMount();CK('去挂载入口在知识点页改为抽屉',!!document.querySelector('.drw')&&UI.page==='kp');A.drwClose();
A.kpQuizDrawer();CK('为这个点出题留在知识点页',!!document.querySelector('.drw')&&UI.page==='kp');A.drwClose();
A.kpDrillDrawer();CK('为这个点建演练留在知识点页',!!document.querySelector('.drw')&&UI.page==='kp');A.drwClose();
A.qViewFor();CK('测评题“看全部”不切换到内容中心',!!document.querySelector('.drw')&&UI.page==='kp');A.drwClose();
A.drViewFor();CK('演练“看全部”不切换到内容中心',!!document.querySelector('.drw')&&UI.page==='kp');A.drwClose();
A.kpWeakDrill({dataset:{id:'K3'}});CK('薄弱点“去建演练”留在知识点页',!!document.querySelector('.drw')&&UI.page==='kp');A.drwClose();
const q0=S.qs.length;A.kpQuizDrawer();document.querySelector('#dq_stem').value='测试题干';document.querySelector('#dq_opts').value='A正确\nB错误';A.kpQuizSave();CK('抽屉出题保存为草稿且不切页',S.qs.length===q0+1&&S.qs[S.qs.length-1].st==='草稿'&&UI.page==='kp');
const d0=S.drills.length;A.kpDrillDrawer();document.querySelector('#dd_name').value='测试演练';A.kpDrillSave();CK('抽屉建演练保存为草稿且不切页',S.drills.length===d0+1&&S.drills[S.drills.length-1].st==='草稿'&&UI.page==='kp');
const t0=S.topics.length;A.kpToTopic({dataset:{id:'K3'}});CK('生成课题留在当前页',S.topics.length===t0+1&&UI.page==='kp');
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
