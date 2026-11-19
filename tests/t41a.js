const L=m=>out.push(String(m));const tx=()=>document.querySelector('#main').innerText;
/* t41a:岗位三档(静态职级) + 销冠动态身份(按月滚动) + 分档双级线(及格/优秀) */
const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.reset();A.roleSwitch({value:'hq'});
/* ---- 1. 岗位档只有静态三档,销冠不在其中 ---- */
CK('岗位档 = 零售顾问/零售主管/零售店长(不含销冠)',JSON.stringify(V23_TIER)===JSON.stringify(['零售顾问','零售主管','零售店长']),V23_TIER.join('/'));
CK('三档画像齐备且权重=100',S.profiles.length===3&&S.profiles.every(p=>pfWsum(p)===100));
/* ---- 2. 销冠是动态身份 ---- */
const ch=v23Champions();
CK('销冠名单非空且每区域至多 1 名',ch.length>0&&new Set(ch.map(c=>c.region)).size===ch.length,ch.map(c=>c.region+':'+c.name).join(' '));
CK('销冠不含店长(店长不参与评定)',ch.every(c=>c.tier!=='零售店长'),ch.map(c=>c.name+'/'+c.tier).join(','));
CK('销冠都过了本岗位及格线(目标达成率)',ch.every(c=>c.ach!=null&&c.ach>=v23Goal(c.tier).pass));
CK('销冠 = 本区域近 4 周锁单第 1(且过线)',ch.every(c=>{const w=v23Wins();
  const top=S.lrn.filter(l=>l.region===c.region&&l.tier!=='零售店长')
   .map(l=>({mid:l.mid,lock:outSum(l.mid,w.cur[0],w.cur[1]).锁单,ach:(v23Readiness(l.mid,l.tier)||{}).ach}))
   .filter(x=>x.lock>0)
   .sort((a,b)=>b.lock-a.lock||(b.ach||0)-(a.ach||0)||(a.mid<b.mid?-1:1))
   .find(x=>x.ach!=null&&x.ach>=v23Goal((lrnOf(x.mid)||{}).tier).pass);
  return top&&top.mid===c.mid}));
CK('评定是函数化的(随数据滚动,重算一致)',JSON.stringify(v23Champions())===JSON.stringify(ch));
CK('销冠不定线:双级线里没有销冠档',!S.cfg.tierGoal['销冠']&&!v23ChampOf('__none__'));
/* ---- 3. 分档双级线 ---- */
CK('双级线:顾问 70/85 · 主管 80/90 · 店长 85/95',v23Goal('零售顾问').pass===70&&v23Goal('零售顾问').good===85&&v23Goal('零售主管').pass===80&&v23Goal('零售主管').good===90&&v23Goal('零售店长').pass===85&&v23Goal('零售店长').good===95,JSON.stringify(S.cfg.tierGoal));
CK('判定语义:优秀 ≥ 优秀线 > 达标 ≥ 及格线 > 未达标',v23Judge(84,'零售顾问')==='达标'&&v23Judge(85,'零售顾问')==='优秀'&&v23Judge(69,'零售顾问')==='未达标'&&v23Judge(null,'零售顾问')==='无证据');
CK('同一达成率在不同档判定不同(线跟岗位走,不跟身份走)',v23Judge(75,'零售顾问')==='达标'&&v23Judge(75,'零售主管')==='未达标'&&v23Judge(92,'零售主管')==='优秀'&&v23Judge(92,'零售顾问')==='优秀');
/* ---- 4. 评审团 = 当期销冠滚动名单 ---- */
const jury=rvJuryDefault();
CK('默认评审团含当期销冠,且全部来自当期名单',jury.some(j=>j.ch==='rn')&&jury.filter(j=>j.ch==='rn').every(j=>ch.some(c=>c.mid===j.mid)),jury.filter(j=>j.ch==='rn').map(j=>j.name).join(','));
/* ---- 5. 带教优先派当期销冠 ---- */
const c0=ch[0];const peer=PEOPLE.find(p=>p.store===c0.store&&p.mid!==c0.mid);
const mt=peer?mentorOf(peer.mid):null;
CK('同店有同事时,带教师傅 = 当期销冠',!!mt&&mt.mid===c0.mid&&mt.champ===1,mt?mt.name+' @'+mt.store:'无');
/* ---- 6. 页面:画像页等级带 + 销冠卡;就绪度 / 详情判定走双级线 ---- */
UI.page='config';UI.tab.config='岗位画像';UI.sel.pff={tier:'零售主管'};render();
const _pf1=/及格线/.test(tx()),_pf2=/优秀线/.test(tx()),_pf3=/销冠\(动态身份\)/.test(document.querySelector('#main').innerHTML);
CK('画像页含及格线 / 优秀线输入与销冠动态身份卡',_pf1&&_pf2&&_pf3,[_pf1,_pf2,_pf3].join(','));
A.pfGoal({value:'88',dataset:{k:'good'}});
CK('等级带可改(主管优秀线 90→88)',v23Goal('零售主管').good===88);
const nv0=S.cfgV.length;A.pfSave();
CK('等级带改动随画像保存进配置版本',S.cfgV.length===nv0+1&&S.cfgV[S.cfgV.length-1].diff.some(d=>/等级带/.test(d[0])));
A.pfReset();CK('还原起步值:主管优秀线回到 90',v23Goal('零售主管').good===90);
UI.page='effect';UI.tab.effect='就绪度';UI.sel.rdy={scope:'全国',store:'',tier:'',verdict:''};UI.sel.rdyPage={page:1,size:100};render();
CK('就绪度页判定列走双级线(达标 / 未达标标签)',/达标/.test(tx()));
CK('就绪度页销冠带「当期销冠」标识',/当期销冠/.test(document.querySelector('#main').innerHTML));
UI.page='student';UI.stuMid=ch[0].mid;render();
CK('学员详情显示双级线与销冠身份',/及格线/.test(tx())&&/当期销冠/.test(document.querySelector('#main').innerHTML));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
