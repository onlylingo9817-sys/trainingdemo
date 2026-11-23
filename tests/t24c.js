const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
/* 1. 学习完成不等于能力提升 */
document.body.dataset.end='rn';const mid=PEOPLE[0].mid;ME=PEOPLE[0];const p=S.projects.find(x=>!x.off&&x.status==='已生效'&&x.nodes.some(n=>n.contentId));
const before=JSON.stringify(adaptList(mid).map(x=>[x.k.id,x.m.v]));R.page='trainDetail';R.pid=p.id;renderRN();const n=p.nodes.find(n=>n.contentId);R.sheet={pid:p.id,nid:n.id};renderRN();A.rSheetDo({dataset:{v:'done'}});
CK('学习任务完成会更新进度',myDone(p).includes(n.id),'done='+myDone(p).length);
CK('学习完成不伪装成掌握度提升',before===JSON.stringify(adaptList(mid).map(x=>[x.k.id,x.m.v])));
/* 2. 答题会进入证据流 */
const kid4=kp('K4').id;const q=qsOf(kid4,'已定稿')[0];const m0=(S.mastery[mid]||{})[kid4]||{v:null};QZ={mode:'practice',kid:kid4,ids:[q.id],i:0,picked:[],shown:false,log:[],chg:{}};R.page='quiz';renderRN();QZ.picked=qzQ().ans.slice();A.qzSubmit();
CK('真实答题写入证据流',!!((S.ev.q[mid]||{})[kid4]),'ev='+JSON.stringify((S.ev.q[mid]||{})[kid4]));
CK('真实答题更新掌握度',(S.mastery[mid]||{})[kid4]&&(S.mastery[mid]||{})[kid4].v!==m0.v,(m0.v==null?'—':m0.v)+'→'+(((S.mastery[mid]||{})[kid4]||{}).v));
/* 3. 薄弱点 -> 补练包 -> 学员可见 */
document.body.dataset.end='pc';UI.page='kp';UI.kid=kid4;render();const t=document.querySelector('#main').innerText;
CK('薄弱点详情给出怎么补',/怎么补/.test(t)&&/指派补练包/.test(t));
const n0=S.packs.length;A.kpWeakPack({dataset:{id:kid4}});const pk=S.packs[0];
CK('指派补练包覆盖未过关学员',pk.mids.length>0&&pk.audience===pk.mids.length,'mids='+pk.mids.length+' audience='+pk.audience);
document.body.dataset.end='rn';const found=pk.mids.find(m=>PEOPLE.some(p=>p.mid===m)&&((personOf(m)||{}).group!=='对照批'))||PEOPLE[0];ME=PEOPLE.find(p=>p.mid===found)||PEOPLE[0];R.page='adapt';renderRN();
CK('学员端能看到补练包',document.querySelector('#rscr').innerText.includes(pk.name));
/* 4. 效果口径 */
document.body.dataset.end='pc';UI.page='effect';UI.tab.effect='就绪度';render();
CK('就绪度页说明仅相关',/相关|不作因果/.test(document.querySelector('#main').innerText));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n').join(' >> '))}
/* 5. 已闭环必须显示证据缺口 */
try{A.roleSwitch({value:'hq'});UI.page='topics';UI.tab.topics='发现的问题';UI.sel.tq={flow:'已闭环'};render();const ct=document.querySelector('#main').innerText;CK('已闭环但无内容会标“闭环证据不全”',/闭环证据不全/.test(ct)&&/无内容/.test(ct),ct.slice(0,120).replace(/\n/g,' / '));}catch(e){L('ERR close '+e.message)}
