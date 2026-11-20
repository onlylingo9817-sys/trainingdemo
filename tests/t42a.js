const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
/* t42a:知识点体系 v1.2 —— 68 条 / 五维 / 四指标 / 锚练分流 / 补学任务 */
try{
A.roleSwitch({value:'hq'});closeDlg();A.reset();
const M=V23_TAX_META;const val=window.__KP_VALIDATION||kpV12ValidateAll();
CK('v1.2 共 68 条知识点',S.tax.length===68,S.tax.length+' 条');
CK('P0 50 / P1 18',S.tax.filter(t=>t.pri==='P0').length===50&&S.tax.filter(t=>t.pri==='P1').length===18,S.tax.filter(t=>t.pri==='P0').length+' / '+S.tax.filter(t=>t.pri==='P1').length);
CK('5 个启用维度',S.dims.filter(d=>d.status!=='off').length===5,S.dims.filter(d=>d.status!=='off').map(d=>d.name).join('/'));
CK('能力项 7 项',M.abilities.length===7,M.abilities.join('/'));
CK('知识域 7 项',M.domains.length===7,M.domains.join('/'));
CK('车型树 17 个值 / 12 个叶子',M.cars.length===17&&V23_CAR_LEAVES.length===12,M.cars.length+' / '+V23_CAR_LEAVES.length);
CK('产品知识:能力项为空、卖点分类必填',S.kps.filter(k=>k.domain==='产品知识').every(k=>!k.ability&&!!k.sellpoint),S.kps.filter(k=>k.domain==='产品知识'&&(k.ability||!k.sellpoint)).map(k=>k.code).join(','));
CK('非产品知识:能力项必填、卖点分类为空',S.kps.filter(k=>k.domain!=='产品知识').every(k=>!!k.ability&&!k.sellpoint),S.kps.filter(k=>k.domain!=='产品知识'&&(!k.ability||k.sellpoint)).map(k=>k.code).join(','));
CK('数据校验 0 error / 48 warn',val.errors===0&&val.warns===48,val.errors+' error / '+val.warns+' warn');
CK('SU7 / YU7 / N70 / N90 分母 33/32/32/32',v23TaxDenom('SU7 Pro',false).length===33&&v23TaxDenom('YU7 Pro',false).length===32&&v23TaxDenom('澎程 N70 Max',false).length===32&&v23TaxDenom('澎程 N90 Max',false).length===32,[v23TaxDenom('SU7 Pro',false).length,v23TaxDenom('YU7 Pro',false).length,v23TaxDenom('澎程 N70 Max',false).length,v23TaxDenom('澎程 N90 Max',false).length].join('/'));
CK('交付顾问 2 / 店长 2',S.tax.filter(t=>t.pri==='P0'&&(t.roles||[]).includes('交付顾问')).length===2&&v23TaxDenom('通用车型',true).length===2);
const s=kpV12Summary({role:'零售顾问',car:'SU7 Pro',batch:'B3-后续',pri:'P0'});
CK('四指标:33 条 / 覆盖 94% / 可授课 94% / 可考核 36%',s.n===33&&s.cov===94&&s.teach===94&&s.assess===36,JSON.stringify(s));
const mains={};(S.contents||[]).forEach(c=>(c.kps||[]).forEach(id=>{if(((c.kpRole&&c.kpRole[id])||'主讲解')==='主讲解')mains[id]=(mains[id]||0)+1}));
CK('每个知识点最多 1 条主讲解',Object.values(mains).every(n=>n<=1),Object.keys(mains).filter(id=>mains[id]>1).join(','));
CK('内容/题/演练都指向有效知识点',(S.contents||[]).every(c=>(c.kps||[]).every(id=>kp(id)))&&(S.qs||[]).every(q=>!q.kp||kp(q.kp))&&(S.drills||[]).every(d=>!d.kp||kp(d.kp)));
/* 锚 / 练分流 */
const mid=S.lrn[0].mid,kid='K57';const before=v23Mastery(mid,kid);
const pq=S.qs.find(q=>q.kp===kid&&q.role!=='锚题'&&q.st==='已定稿');
if(pq){S.ansLog.push({mid,q:pq.id,kp:kid,ok:true,pick:[],t:today,mode:'diag'});v23Sync(mid,kid,'quiz');v23MRefresh(mid,kid)}
CK('练习题不改变考核掌握度',!pq||v23Mastery(mid,kid)===before,before+' → '+v23Mastery(mid,kid));
const aq=S.qs.find(q=>q.kp===kid&&q.role==='锚题'&&q.st==='已定稿');
if(aq){const n0=((S.ev.q[mid]||{})[kid]||{}).n||0;S.ansLog.push({mid,q:aq.id,kp:kid,ok:true,pick:[],t:today,mode:'diag'});v23Sync(mid,kid,'quiz');v23MRefresh(mid,kid);CK('锚题写入证据流',(((S.ev.q[mid]||{})[kid]||{}).n||0)===n0+1,(n0+1)+'')}
CK('成绩有效期状态',!!v23MasteryStatus(mid,kid)&&/有效|待确认|未过关/.test(v23MasteryStatus(mid,kid).status),JSON.stringify(v23MasteryStatus(mid,kid)));
CK('补学任务 28 条 / 人员 41',S.tasks.length===28&&S.people.length===41,S.tasks.length+' / '+S.people.length);
UI.page='config';UI.tab.config='知识点库 v1.2';render();const page=tx();
CK('知识点库 v1.2 页面可渲染',/v1.2 标准库/.test(page)&&/68 条清单/.test(page)&&/校验/.test(page));
UI.page='catalog';UI.tab.catalog='补学进度';render();
CK('补学进度页可渲染',/任务明细/.test(tx())&&/应完成/.test(tx()));
CK('页面无 undefined / NaN',!/undefined|NaN/.test(tx()));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' | '))}
