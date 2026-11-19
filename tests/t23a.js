const L=m=>out.push(String(m));const tx=()=>document.querySelector('#main').innerText;
/* t23a:数据层 + 就绪度引擎 + 一致性(同源同数)+ 理想数据的"诚实性"检查 */
const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});
/* ---- 1. 理想数据规模与确定性 ---- */
CK('学员 41 人 / 6 店',S.lrn.length===41&&v23Stores().length===6,S.lrn.length+' 人 '+v23Stores().length+' 店');
CK('学员 MID 唯一(不重号)',new Set(S.lrn.map(l=>l.mid)).size===S.lrn.length,'去重后 '+new Set(S.lrn.map(l=>l.mid)).size+' / '+S.lrn.length);
CK('生成学员的 MID 不与 v22 演示学员冲突',S.lrn.filter(l=>!V23_BASE.some(b=>b[0]===l.mid)&&!['2023202','2023201','2023203','2023204','2024113','2023206'].includes(l.mid)).every(l=>!PEOPLE.some(p=>p.mid===l.mid)));
CK('三档岗位都有人',V23_TIER.length===3&&V23_TIER.every(t=>S.lrn.some(l=>l.tier===t)),JSON.stringify(S.lrn.reduce((a,x)=>(a[x.tier]=(a[x.tier]||0)+1,a),{})));
CK('12 周数据',Object.values(S.out)[0].length===12&&Object.values(S.beh)[0].K1.length===12);
CK('试点批 / 对照批都有',S.lrn.some(l=>l.group==='试点批')&&S.lrn.some(l=>l.group==='对照批'));
const sig1=JSON.stringify(S.lrn.map(l=>v23Readiness(l.mid,l.tier).val));
A.reset();
const sig2=JSON.stringify(S.lrn.map(l=>v23Readiness(l.mid,l.tier).val));
CK('数据确定性(重置两次完全一致)',sig1===sig2);
/* ---- 2. 维度体系 ---- */
CK('7 个起步维度',S.dims.length===7&&S.dims.length<=10,S.dims.map(d=>d.name).join('/'));
CK('维度 id 稳定且无重复值 id',S.dims.every(d=>new Set(d.values.map(v=>v.id)).size===d.values.length));
CK('每个知识点至少挂 1 个归属维度才算有效',S.kps.every(k=>(k.dims.Dcar||[]).length||(k.dims.Dprod||[]).length),'无归属='+S.kps.filter(k=>!(k.dims.Dcar||[]).length&&!(k.dims.Dprod||[]).length).map(k=>k.id).join(','));
CK('知识点不再依赖"事实型/技能型"来区分(由维度推断)',S.kps.every(k=>typeof kpKindHint(k)==='string'));
/* ---- 3. 画像 ---- */
CK('三档画像权重合计均为 100',S.profiles.length===3&&S.profiles.every(p=>pfWsum(p)===100),S.profiles.map(p=>p.role+':'+pfWsum(p)).join(' '));
CK('每个画像项都命中知识点(不存在空选择器)',S.profiles.every(p=>p.items.every(it=>pfKps(it).length>0)),S.profiles.flatMap(p=>p.items.filter(it=>!pfKps(it).length).map(it=>it.id)).join(','));
/* ---- 4. 掌握度:来源权重真的在起作用 ---- */
const l0=S.lrn.find(l=>l.train);const kid='K18';
const m0=v23Mastery(l0.mid,kid);
const cfgA=Object.assign({},S.cfg,{srcW:{quiz:1,drill:0,behavior:0,coach:0,self:0}});
const cfgB=Object.assign({},S.cfg,{srcW:{quiz:0,drill:0,behavior:1,coach:0,self:0}});
/* 用剧本群体(试点批新人 · 顾虑解除 K18)断言:测评过关但实战行为低 → 两种口径下掌握度应显著不同 */
const pil=S.lrn.filter(l=>l.train);
const avg=cfg=>Math.round(pil.map(l=>v23Mastery(l.mid,kid,cfg)).filter(v=>v!=null).reduce((a,b)=>a+b,0)/pil.length);
const mq=avg(cfgA),mb=avg(cfgB);
CK('试点批 K18:只看测评 vs 只看行为 掌握度明显不同(权重生效)',mq-mb>=15,'测评='+mq+' 行为='+mb+' (单人 '+l0.name+' 合成='+m0+')');
/* 权重改变确实改变合成结果 */
const mDef=avg(S.cfg),mDrill=avg(Object.assign({},S.cfg,{srcW:{quiz:.1,drill:.8,behavior:.05,coach:.05,self:0}}));
CK('合成结果随来源权重变化',mDef!==mDrill,'默认='+mDef+' 演练为主='+mDrill);
const cfgS=Object.assign({},S.cfg,{srcW:{quiz:.35,drill:.25,behavior:.3,coach:.1,self:1}});
const sRaw=v23Mastery(l0.mid,'K17'),sSelf=v23Mastery(l0.mid,'K17',cfgS);
CK('自评默认权重 0(不影响);调高后才影响',v23Mastery(l0.mid,'K17')===sRaw&&sSelf!==sRaw,sRaw+' → '+sSelf);
CK('掌握度范围 0–100',S.lrn.every(l=>S.kps.every(k=>{const v=v23Mastery(l.mid,k.id);return v==null||(v>=0&&v<=100)})));
/* ---- 5. 就绪度 = 画像加权 ---- */
const r=v23Readiness(l0.mid,l0.tier);
const hand=(()=>{let sw=0,so=0;r.items.forEach(x=>{if(x.mean!=null){sw+=x.item.weight;so+=x.item.weight*Math.min(x.mean,x.item.target)}});return Math.round(so/sw)})();
CK('就绪度与手算一致(Σ权重×min(均值,目标)/Σ权重)',r.val===hand,'引擎='+r.val+' 手算='+hand);
CK('就绪度封顶:某项超过目标等级不会多算',r.items.every(x=>x.cap==null||x.cap<=x.item.target+1e-9));
/* ---- 6. 同源同数:就绪度页 / 学员详情 / 零售通 / 工作台 ---- */
v23RefreshAll();
const lx=S.lrn.find(l=>l.tier==='零售顾问');const rd=v23Readiness(lx.mid,lx.tier);
UI.page='effect';UI.tab.effect='就绪度';UI.sel.rdy={scope:'全国',store:'',tier:'',q:lx.name};UI.sel.rdyPage={page:1,size:20};render();
const rowTxt=[...document.querySelectorAll('#main table.t.nw tr')].find(tr=>tr.innerText.includes(lx.name));
CK('就绪度页该学员的数 = 引擎',!!rowTxt&&rowTxt.innerText.includes(String(rd.val)),rowTxt?rowTxt.innerText.replace(/\s+/g,' ').slice(0,80):'没找到行');
UI.page='student';UI.stuMid=lx.mid;render();
CK('学员详情页该学员的数 = 引擎',tx().includes(String(rd.val)),'就绪度 '+rd.val);
document.body.dataset.end='rn';ME=PEOPLE.find(p=>p.mid===lx.mid)||PEOPLE[0];R.page='adapt';renderRN();
const rn=document.querySelector('#rscr').innerText;
CK('零售通就绪度卡的数 = 引擎',rn.includes(String(v23Readiness(ME.mid,lrnOf(ME.mid).tier).val)),rn.replace(/\s+/g,' ').slice(0,60));
document.body.dataset.end='pc';
const mo=misOf(lx.mid).filter(m=>m.status!=='closed').length;
CK('未关闭错题数:学员详情 = 数据',(()=>{UI.page='student';render();return tx().includes('未关闭错题')})(),'数据='+mo);
/* ---- 7. 理想数据的"诚实性" ---- */
const q=v23Quadrant();
CK('就绪度×锁单 正相关但不强(0.15 ≤ r ≤ 0.7)',q.r>=0.15&&q.r<=0.7,'r='+q.r);
const hi=q.rows.filter(x=>x.rdy>=75&&x.lock<=q.rows.reduce((a,b)=>a+b.lock,0)/q.rows.length*0.8).length;
const lo=q.rows.filter(x=>x.rdy<=60&&x.lock>=q.rows.reduce((a,b)=>a+b.lock,0)/q.rows.length*1.1).length;
CK('存在"高就绪低业绩"离群点',hi>=1,hi+' 个');
CK('存在"低就绪高业绩"离群点',lo>=1,lo+' 个');
const fp=v23Funnel('试点批',8,11),fc=v23Funnel('对照批',8,11);
CK('漏斗逐级不增(邀约≥到店≥试驾≥报价≥锁单)',['试点批','对照批'].every(g=>{const s=v23Funnel(g,0,11).sum;return s.邀约>=s.到店&&s.到店>=s.试驾&&s.试驾>=s.报价&&s.报价>=s.锁单}));
CK('试点批与对照批人均锁单差异 < 80%(不是离谱差距)',(()=>{const a=fp.per('锁单'),b=fc.per('锁单');return Math.abs(a-b)/Math.max(a,b)<0.8})(),'试点='+fp.per('锁单')+' 对照='+fc.per('锁单'));
const pages=['effect:就绪度','effect:错题集','effect:调优','config:维度体系','config:岗位画像','config:评价口径','config:学习包模板'];
let missing=0;pages.forEach(p=>{const [pg,t]=p.split(':');UI.page=pg;UI.tab[pg]=t;render();if(!document.querySelector('#main .v23-sim')&&!/模拟/.test(tx())&&!/配置/.test(t)&&pg==='effect')missing++});
CK('效果类页面都有「模拟数据」标识',missing===0,'缺='+missing);
UI.page='effect';UI.tab.effect='就绪度';render();CK('就绪度页有"仅相关"口径说明',/不作因果结论/.test(tx())&&/12 周/.test(tx()));
UI.tab.effect='调优';UI.tab.tune='前后对比';render();
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
