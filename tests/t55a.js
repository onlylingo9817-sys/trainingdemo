const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
const setv=(id,v)=>{let e=document.getElementById(id);if(!e){e=document.createElement('input');e.id=id;document.body.appendChild(e)}e.value=v};
/* t55a：车型 / 年款参与能讲能考能练；表单有年款入口；待标年款；实操观察闭环 */
try{
A.roleSwitch({value:'hq'});closeDlg();A.reset();
const base={role:'零售顾问',batch:'B3-后续',pri:'全部'};
/* 1. 车型真的参与判定 */
const by={};['SU7 Pro','YU7 Pro','澎程 N70 Pro','澎程 N90 Max'].forEach(c=>{const s=kpV12Summary(Object.assign({},base,{car:c}));by[c]=s.t+'/'+s.a});
CK('换车型后可授课/可考核不再是同一组数',new Set(Object.values(by)).size>=3,JSON.stringify(by));
const sq=S.qs.filter(q=>q.kp==='XM-P18'&&q.st==='已定稿'&&q.role==='锚题'&&(q.carScope||[]).length&&q.kpMap!=='待整理')[0];
S.qs.push({id:'QT1',kp:'XM-P02',type:'单选',stem:'x',opts:['a','b'],ans:[0],st:'已定稿',role:'锚题',carScope:['SU7'],yearScope:[],yearPending:true,stat:{n:0,ok:0}});
const k2=kp('XM-P02');
CK('SU7 专属题算给 SU7，不算给 YU7',kpAnchorQs(k2,{car:'SU7 Pro',year:''}).some(q=>q.id==='QT1')&&!kpAnchorQs(k2,{car:'YU7 Pro',year:''}).some(q=>q.id==='QT1'));
const cN90=S.contents.find(c=>c.car==='澎程 N90 Max'&&(c.kps||[]).length);
CK('老讲解只有单值 car 时按所在车系算',!!cN90&&kpItemScope(cN90).join()==='澎程 N90'&&kpAssetFits(cN90,{car:'澎程 N90 Max',year:''})&&!kpAssetFits(cN90,{car:'SU7 Pro',year:''}));
/* 2. 年款：只认已标注，没标的单独统计 */
const sY=kpV12Summary(Object.assign({},base,{car:'SU7 Pro',year:'演示年款A'})),sN=kpV12Summary(Object.assign({},base,{car:'SU7 Pro',year:''}));
CK('选年款后只算已标注年款的资源',sY.t<sN.t&&sY.t>=0,sN.t+' → '+sY.t);
CK('没标年款的资源有单独清单',kpPendingYearList().length>100,String(kpPendingYearList().length));
CK('年款 A 的课不算给年款 B',kpAssetFits(content('C_YEAR_A'),{car:'SU7 Pro',year:'演示年款A'})&&!kpAssetFits(content('C_YEAR_A'),{car:'SU7 Pro',year:'演示年款B'}));
/* 3. 总览 */
UI.page='catalog';UI.tab.catalog='总览';UI.sel.kpOv={role:'零售顾问',car:'SU7 Pro',batch:'B3-后续',pri:'P0',placeholder:'exclude',year:'演示年款A'};render();
CK('总览有年款下拉',!!document.querySelector('[data-wc=kpV12OvSet][data-k=year]'));
CK('总览说明口径和待标年款数',/没标年款/.test(tx())&&/去标年款/.test(tx())&&/实操观察/.test(tx()));
CK('热力格不再每个车型同一个数',(()=>{UI.sel.kpOv.year='';UI.sel.kpOv.car='全部车型';UI.sel.kpOv.pri='全部';render();const r=[...document.querySelectorAll('.ux-heat tr')].slice(1).map(tr=>[...tr.querySelectorAll('td')].slice(1).map(x=>x.innerText.trim()).join('|'));return new Set(r).size>=3})());
UI.sel.kpOv={role:'零售顾问',car:'SU7 Pro',batch:'B3-后续',pri:'P0',placeholder:'exclude'};
/* 4. 表单有年款入口并能保存 */
A.qNew();CK('题表单有适用年款',/适用年款/.test(tx()));
QF.stem='年款测试题';QF.opts=['a','b','c','d'];A.qYear({dataset:{v:'演示年款B'},checked:true});A.qSave({dataset:{s:'0'}});
const q=S.qs[S.qs.length-1];CK('题保存后带年款',q.stem==='年款测试题'&&q.yearScope.join()==='演示年款B'&&q.yearPending===false);
A.drNew();CK('演练表单有适用年款',/适用年款/.test(tx()));
DF.name='年款测试演练';DF.turns=[{say:'x',ref:'y',emoT:'',mustT:'a|b',ideaT:'c|d'}];A.drYear({dataset:{v:'演示年款A'},checked:true});A.drSave({dataset:{s:'0'}});
const d=S.drills[S.drills.length-1];CK('演练保存后带年款',d.name==='年款测试演练'&&d.yearScope.join()==='演示年款A');
A.cNew();CK('内容表单有适用车系和年款',/适用车系/.test(tx())&&/适用年款/.test(tx()));
C.title='年款测试话术';A.cScope({dataset:{v:'YU7'},checked:true});A.cYear({dataset:{v:'演示年款A'},checked:true});A.cYear({dataset:{v:'演示年款B'},checked:true});A.cSave({dataset:{s:'0'}});
const c=S.contents[0];CK('内容保存后带车系和年款',c.title==='年款测试话术'&&c.carScope.join()==='YU7'&&c.yearScope.length===2&&c.yearPending===false);
/* 5. 待标年款批量标注 */
UI.page='catalog';UI.tab.catalog='知识点库';render();
CK('知识点库有待标年款入口',/待标年款 \d+/.test(tx()));
const n0=kpPendingYearList().length;A.kpYearOpen();CK('抽屉打开',/待标年款的资源/.test(document.body.innerText));
A.yrMark({dataset:{v:'演示年款A'}});CK('没勾选时拦住',kpPendingYearList().length===n0);
UI.sel.yrPick={};kpPendingYearList().slice(0,4).forEach(r=>UI.sel.yrPick[r.key]=1);A.yrMark({dataset:{v:'演示年款B'}});
CK('批量标注后清单减少',kpPendingYearList().length===n0-4,n0+' → '+kpPendingYearList().length);
A.drwClose();
/* 6. 三条演示路径都要实操观察 */
kpMigrateV13(true);
CK('接待、异常成交、置换三个学习包',['PK_R01','PK_E01','PK_T01'].every(id=>{const p=S.packs.find(x=>x.id===id);return p&&p.needObs&&p.obsDims.length>=3}));
const pk=S.packs.find(p=>p.id==='PK_E01');const nm=S.lrn[0].name;const T0=S.tasks.length;
const rec=(dim,g,src,by,note)=>{setv('ob_dim',dim);setv('ob_grade',g);setv('ob_src',src);setv('ob_by',by);setv('ob_note',note||'');A.trainObs({dataset:{id:'PK_E01'}})};
rec('先查证再答复','独立完成','主管现场观察','');
CK('没填观察人不记',pk.observe.length===0);
rec('先查证再答复','独立完成','主管现场观察',nm);
CK('学员本人不能当观察人',pk.observe.length===0);
rec('先查证再答复','独立完成','AI对话（不计入）','');
CK('AI 对话只留作参考，不计入、不生成任务',pk.observe.length===1&&pk.observe[0].counted===false&&S.tasks.length===T0&&kpObsStatus(pk).done===0);
rec('先查证再答复','未完成','主管现场观察','周丽','说了七天');
const t1=S.tasks.find(t=>t.obsPack==='PK_E01'&&t.obsDim==='先查证再答复');
CK('未完成 → 生成补学任务（L2）',!!t1&&/L2/.test(t1.level)&&t1.fromObs===true&&t1.state!=='已复测');
rec('不编时限与承诺','提示后完成','主管现场观察','周丽');
const t2=S.tasks.find(t=>t.obsPack==='PK_E01'&&t.obsDim==='不编时限与承诺');
CK('提示后完成 → 合格但生成巩固补学（L1）',!!t2&&/L1/.test(t2.level)&&kpObsStatus(pk).per[1].pass);
CK('同一维度不重复生成任务',(()=>{rec('先查证再答复','未完成','主管现场观察','周丽');return S.tasks.filter(t=>t.obsPack==='PK_E01'&&t.obsDim==='先查证再答复').length===1})());
packAdvance(pk,'演练','D1');
CK('题和演练做完但实操没过 → 待实操观察，不算完成',pk.status==='待实操观察');
rec('先查证再答复','独立完成','带教现场观察','陈刚');
CK('之后独立完成 → 关闭补学任务',S.tasks.find(t=>t.obsPack==='PK_E01'&&t.obsDim==='先查证再答复').state==='已复测');
rec('不编时限与承诺','独立完成','主管现场观察','周丽');rec('下一步与记录','独立完成','主管现场观察','周丽');
CK('各维度都过 → 学习包完成',pk.status==='已完成'&&kpObsStatus(pk).ok);
const sm=kpObsSummary();CK('总览汇总：有效、合格、补学、AI 不计入',sm.valid>=5&&sm.pass>=3&&sm.gap>=2&&sm.ai===1,JSON.stringify(sm));
CK('实操记录不改题目成绩',!(S.ansLog||[]).some(a=>a.mode==='obs'));
/* 7. 页面呈现 */
document.body.dataset.end='rn';R.packId='PK_E01';R.page='pack';renderRN();
CK('零售通接待包有观察人输入和 AI 声明',!!document.getElementById('ob_by')&&/AI 对话不能代替/.test(document.body.innerText));
document.body.dataset.end='pc';
UI.page='kp';UI.kid='XM-O01';render();
CK('知识点详情有实操观察卡',/实操观察/.test(tx())&&/不计入/.test(tx()));
UI.page='catalog';UI.tab.catalog='补学进度';render();
CK('补学任务页标出来自实操观察',/来自实操观察/.test(tx()));
UI.tab.catalog='知识点库';UI.sel.kpf={q:'XM-O01'};render();
CK('知识点库显示实操合格比',/实操 \d+\/\d+ 合格/.test(tx()));
CK('页面无 undefined / NaN',!/undefined|NaN/.test(tx()));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' | '))}
