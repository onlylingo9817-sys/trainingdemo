const L=m=>out.push(m);
try{
A.roleSwitch({value:'hq'});
L('面板存在='+!!document.getElementById('gd')+' 标题='+/体验任务/.test(document.getElementById('gd').innerText)+' 默认='+document.getElementById('gd').innerText.replace(/\n/g,' ').slice(0,30));
UI.gdOpen=true;gdRender();const g=()=>document.getElementById('gd').innerText;
L('展开后 任务数='+document.querySelectorAll('#gd .gd-i').length+' 已完成='+document.querySelectorAll('#gd .gd-i.ok').length);
// t1: 看总览
UI.page='catalog';UI.tab.catalog='总览';render();L('t1 看总览后 勾选='+document.querySelectorAll('#gd .gd-i.ok').length+' 计数文案与任务总数一致='+(g().replace(/\s/g,'').indexOf('/'+document.querySelectorAll('#gd .gd-i').length)>=0)); 
// t2: 指定负责人
UI.page='kp';UI.kid='K7';render();A.kpOwner({value:'王磊'});L('t2 指定负责人后 已完成='+document.querySelectorAll('#gd .gd-i.ok').length);
// t3: 挂载
const un=S.contents.find(c=>!(c.kps||[]).length);if(un){A.kpMount({dataset:{id:un.id,k:recKps(un)[0]?recKps(un)[0].id:'K1'}})}L('t3 挂载后 已完成='+document.querySelectorAll('#gd .gd-i.ok').length);
// t4: 新增知识点
A.kpNew();KF.name='体验新增点';A.kfSave();L('t4 新增后 已完成='+document.querySelectorAll('#gd .gd-i.ok').length);
// t5: 出题定稿
A.qNew();QF.kp='K8';QF.stem='体验题';QF.opts=['甲','乙','丙','丁'];QF.ans=[0];QF.why='体验解析';A.qSave({dataset:{s:'1'}});L('t5 出题定稿后 已完成='+document.querySelectorAll('#gd .gd-i.ok').length);
// t5b: 建演练并定稿
A.drNew();DF.kp='K20';DF.name='体验演练';DF.turns=[{say:'随便看看',ref:'好的您先看',emoT:'',mustT:'欢迎=欢迎',ideaT:'不打扰=您先看'}];A.drSave({dataset:{s:'1'}});L('t5b 建演练并定稿后 已完成='+document.querySelectorAll('#gd .gd-i.ok').length);
// t6: 上架
const c3=S.contents.find(c=>usableC(c)&&!isPub(c));A.cPub({dataset:{id:c3.id}});A.cPubOk({dataset:{id:c3.id}});L('t6 上架后 已完成='+document.querySelectorAll('#gd .gd-i.ok').length+'/'+document.querySelectorAll('#gd .gd-i').length);
// 学员侧
document.body.dataset.end='rn';ME=PEOPLE[0];S.ansLog=S.ansLog.filter(a=>a.mid!==ME.mid);S.mastery[ME.mid]={};R.page='school';renderRN();L('RN 面板切换为学员任务='+/学员 · 零售通/.test(g())+' 已完成='+document.querySelectorAll('#gd .gd-i.ok').length);
rgo('adapt');renderRN();L('s1 打开提升清单 已完成='+document.querySelectorAll('#gd .gd-i.ok').length);
A.adDiag();let k=0;while(QZ&&!QZ.end&&k++<40){const q=qzQ();QZ.picked=q.ans.slice();A.qzSubmit();A.qzNext()}A.qzExit();L('s2 做完诊断 已完成='+document.querySelectorAll('#gd .gd-i.ok').length);
const w=adaptList(ME.mid)[0];A.adLearn({dataset:{k:w.k.id}});L('s3 学一学 已完成='+document.querySelectorAll('#gd .gd-i.ok').length);R.sheet=null;renderRN();
// 把一个点练到过关
const target=adaptList(ME.mid)[0].k.id;S.ansLog=S.ansLog.filter(a=>!(a.mid===ME.mid&&a.kp===target));for(let i=0;i<3;i++){S.ansLog.push({mid:ME.mid,q:'Q1',kp:target,ok:false,t:today})}mRefresh(ME.mid,target);let g2=0;while(mst(ME.mid,target).v<KP_PASS&&g2++<8){A.adPractice({dataset:{k:target}});let h=0;while(QZ&&!QZ.end&&h++<10){const q=qzQ();QZ.picked=q.ans.slice();A.qzSubmit();A.qzNext()}A.qzExit()}
L('s4 练到过关 掌握度='+mst(ME.mid,target).v+' 已完成='+document.querySelectorAll('#gd .gd-i.ok').length+'/'+document.querySelectorAll('#gd .gd-i').length);
// s3b: 完整练一场演练
A.adDrill({dataset:{k:'K18'}});A.dzStart();for(let i=0;i<drById(DZ.id).turns.length;i++){document.getElementById('dz_t').value='您觉得价格有压力很正常,三年使用成本和保值率权益,总拥有成本更低';DZ.text=document.getElementById('dz_t').value;A.dzSubmit();A.dzNext()}A.dzExit();L('s3b 练完演练后 已完成='+document.querySelectorAll('#gd .gd-i.ok').length+'/'+document.querySelectorAll('#gd .gd-i').length);
// 反馈
A.fbkOpen();L('反馈弹窗 位置='+FBK.where+' 有输入='+!!document.getElementById('fbk_t'));A.fbkSave();L('空内容被拦 条数='+S.fbk.length);
document.getElementById('fbk_t').value='我想找缺内容的卖点,但不知道点哪里';document.getElementById('fbk_who').value='培训部';A.fbkType({dataset:{v:'卡住了/看不懂'}});L('切类型后文本保留='+(document.getElementById('fbk_t').value.length>0));A.fbkSave();L('提交后 条数='+S.fbk.length+' 记录='+JSON.stringify(S.fbk[0]).slice(0,120));
document.body.dataset.end='pc';UI.page='catalog';UI.tab.catalog='总览';render();A.fbkOpen();L('后台反馈位置='+FBK.where);closeDlg();
A.fbkAll();L('反馈列表 渲染='+/全部反馈/.test(document.getElementById('dlg').innerText)+' 含刚提交='+/卡住了/.test(document.getElementById('dlg').innerText));closeDlg();
// reset 后反馈是否保留
const n0=S.fbk.length;A.reset();L('载入示例数据后 反馈 '+n0+' → '+S.fbk.length+' (体验反馈不应因重置丢失)');
A.clear();L('清空数据后 反馈='+S.fbk.length);
// 三种身份面板
['r1','boss'].forEach(r=>{A.roleSwitch({value:r});L(r+' 面板='+!!document.getElementById('gd'))});
}catch(e){L('TOP '+e.message+' @'+(e.stack||'').split('\n')[1])}
