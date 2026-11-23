const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const html=()=>document.querySelector('#main').innerHTML;
const tx=()=>document.querySelector('#main').innerText;
const dtx=()=>document.querySelector('#drw-root').innerText;
/* t46a：核心讲解 / 测评题 / 演练统一“添加已有 + 新增”；题和演练按单归属移入 */
try{
A.roleSwitch({value:'hq'});closeDlg();A.reset();
UI.kid='K6';A.kpOpen({dataset:{id:'K6'}});
CK('三类资源都有添加已有入口',!!document.querySelector('[data-act="kpMountDrawer"]')&&!!document.querySelector('[data-act="kpQuizExisting"]')&&!!document.querySelector('[data-act="kpDrillExisting"]'));
CK('三类资源都保留新增入口',!!document.querySelector('[data-act="kpContentNew"]')&&!!document.querySelector('[data-act="kpQuizDrawer"]')&&!!document.querySelector('[data-act="kpDrillDrawer"]'));
/* 已有题：搜索、用途、状态筛选；移入保留资产与历史 */
A.kpQuizExisting();
CK('题目抽屉说明单归属与历史保留',/只能属于一个知识点/.test(dtx())&&/从原知识点移出/.test(dtx())&&/历史作答和统计保留/.test(dtx()));
CK('题目抽屉有搜索用途状态筛选和已有题',!!document.querySelector('#kp_asset_q')&&!!document.querySelector('#kp_asset_role')&&!!document.querySelector('#kp_asset_st')&&/Q_V12_K12_A1/.test(dtx()));
const qid='Q_V12_K12_A1',q0=qById(qid),qStat=JSON.stringify(q0.stat),qLog=JSON.stringify(S.ansLog.filter(a=>a.q===qid));
const roleEl=document.querySelector('#kp_asset_role');roleEl.value='锚题';roleEl.dispatchEvent(new Event('change',{bubbles:true}));
const stEl=document.querySelector('#kp_asset_st');stEl.value='已定稿';stEl.dispatchEvent(new Event('change',{bubbles:true}));
CK('题目用途和状态筛选真实生效',kpAssetCands().length>0&&kpAssetCands().every(q=>q.role==='锚题'&&q.st==='已定稿'));
const searchEl=document.querySelector('#kp_asset_q');searchEl.value=qid;searchEl.dispatchEvent(new Event('input',{bubbles:true}));
CK('题目按 ID 搜索且焦点不丢',kpAssetCands().length===1&&kpAssetCands()[0].id===qid&&document.activeElement.id==='kp_asset_q');
const oldQKp=kp('K12'),newQKp=kp('K6'),oldQN=kpV12AnchorQn(oldQKp),newQN=kpV12AnchorQn(newQKp);
const qRole=q0.role,qState=q0.st;q0.src=kpMounted(oldQKp)[0].id;
CK('测试来源讲解确实未挂到目标点',!kpMounted(newQKp).some(c=>c.id===q0.src));
A.kpAssetMove({dataset:{kind:'q',id:qid}});
CK('已有题移入后新旧核心数量同步变化',q0.kp==='K6'&&kpV12AnchorQn(oldQKp)===oldQN-1&&kpV12AnchorQn(newQKp)===newQN+1,oldQN+'→'+kpV12AnchorQn(oldQKp)+' / '+newQN+'→'+kpV12AnchorQn(newQKp));
CK('题目用途定稿状态和作答统计保留',q0.role===qRole&&q0.st===qState&&JSON.stringify(q0.stat)===qStat);
CK('题目历史作答不改写',JSON.stringify(S.ansLog.filter(a=>a.q===qid))===qLog);
CK('新旧知识点都有题目移入移出留痕',oldQKp.hist[0].act==='移出题目'&&newQKp.hist[0].act==='移入题目'&&oldQKp.hist[0].note.includes(qid)&&newQKp.hist[0].note.includes(qid));
CK('目标点没有来源讲解时自动清空',q0.src===''&&/来源讲解已清空，请重新选择/.test(document.querySelector('#toast').innerText));
CK('移入后题目退出可添加列表并出现在详情',!kpAssetCands().some(q=>q.id===qid)&&!dtx().includes(qid)&&tx().includes(q0.stem));
/* 已有演练：同一套交互与规则 */
A.drwClose();A.kpDrillExisting();
CK('演练抽屉复用同一套单归属说明',/只能属于一个知识点/.test(dtx())&&/移到这个点/.test(dtx())&&/D_V12_K57/.test(dtx()));
const did='D_V12_K57',d0=drById(did),dStat=JSON.stringify(d0.stat),dLog=JSON.stringify(S.ansLog.filter(a=>a.q===did));
const oldDKp=kp('K57'),newDKp=kp('K6'),oldDN=kpV12AnchorDrillN(oldDKp),newDN=kpV12AnchorDrillN(newDKp);
const dRole=d0.role,dScene=d0.scene,dState=d0.st;d0.src=kpMounted(oldDKp)[0].id;
CK('演练测试来源确实未挂到目标点',!kpMounted(newDKp).some(c=>c.id===d0.src));
A.kpAssetMove({dataset:{kind:'d',id:did}});
CK('已有演练移入后新旧过关数量同步变化',d0.kp==='K6'&&kpV12AnchorDrillN(oldDKp)===oldDN-1&&kpV12AnchorDrillN(newDKp)===newDN+1,oldDN+'→'+kpV12AnchorDrillN(oldDKp)+' / '+newDN+'→'+kpV12AnchorDrillN(newDKp));
CK('演练用途场景定稿状态和练习统计保留',d0.role===dRole&&d0.scene===dScene&&d0.st===dState&&JSON.stringify(d0.stat)===dStat);
CK('演练历史作答不改写',JSON.stringify(S.ansLog.filter(a=>a.q===did))===dLog);
CK('新旧知识点都有演练移入移出留痕',oldDKp.hist[0].act==='移出演练'&&newDKp.hist[0].act==='移入演练'&&oldDKp.hist[0].note.includes(did)&&newDKp.hist[0].note.includes(did));
CK('演练来源清理且详情可见',d0.src===''&&tx().includes(d0.name));
CK('已移入演练不再出现在可添加列表',!kpAssetCands().some(d=>d.id===did)&&!dtx().includes(did));
CK('页面与抽屉无 undefined / NaN',!/undefined|NaN/.test(html()+document.querySelector('#drw-root').innerHTML));
A.drwClose();A.kpContentNew();
CK('新增内容预挂当前知识点且默认补充材料',UI.page==='cedit'&&C.kps.length===1&&C.kps[0]==='K6'&&C.kpRole.K6==='补充材料'&&!C.mainKp);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' | '))}
