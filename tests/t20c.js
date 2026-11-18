const L=m=>out.push(m);const tx=()=>document.querySelector('#main').innerText;
try{closeDlg();
/* 自查:体验者从零开始会遇到什么 */
// 1) 刷新后默认状态
L('首屏 页面='+UI.page+' 身份='+UI.role.k+' 面板收起='+!UI.gdOpen);
// 2) 空状态:清空数据后,每个新页面是否给出下一步
A.clear();
const empties=[['catalog','总览'],['catalog','看板'],['catalog','候选'],['catalog','清河迁移'],['workbench',''],['content','全部内容'],['config','知识点规则']];
empties.forEach(([p,t])=>{UI.page=p;if(p==='catalog')UI.tab.catalog=t;if(p==='content'){UI.tab.content=t;UI.sel.cadv=false;UI.sel.caf={}}if(p==='config')UI.tab.config=t;try{render();const x=tx();L('清空后 '+t+' len='+x.length+' 空白='+(x.length<120))}catch(e){L('ERR 空 '+t+' '+e.message)}});
// 3) 零售通 清空后进提升清单
document.body.dataset.end='rn';ME=PEOPLE[0];R.page='adapt';try{renderRN();const x=$('#rscr').innerText;L('清空后 提升清单='+x.replace(/\n/g,' ').slice(0,80));A.adDiag();L('清空后 点诊断 → page='+R.page+' toast='+document.querySelector('#toast').innerText)}catch(e){L('ERR rn 空 '+e.message)}
document.body.dataset.end='pc';A.reset();closeDlg();
// 4) 一线学员连点两次提交 / 没选就提交
document.body.dataset.end='rn';ME=PEOPLE[0];S.ansLog=S.ansLog.filter(a=>a.mid!==ME.mid);S.mastery[ME.mid]={};A.adDiag();
const n0=S.ansLog.length;A.qzSubmit();L('没选就提交 → 不记录='+(S.ansLog.length===n0));
const q=qzQ();QZ.picked=q.ans.slice();A.qzSubmit();const n1=S.ansLog.length;A.qzSubmit();L('重复点提交 → 只记 1 次='+(S.ansLog.length===n1));
A.qzPick({dataset:{i:'0'}});L('已提交后再点选项 → 不改变='+QZ.picked.join(',')+' (应仍为正确答案 '+q.ans.join(',')+')');
// 5) 中途退出再进:不丢已答的
A.qzNext();A.qzExit();L('中途退出 → 已记录 '+S.ansLog.filter(a=>a.mid===ME.mid).length+' 条,回清单 page='+R.page+' 有已测点='+adaptTested(ME.mid).length);
A.adDiag();L('再次诊断 → 优先出没做过的题 第1题 id='+qzQ().id+' 已答过='+S.ansLog.some(a=>a.mid===ME.mid&&a.q===qzQ().id));A.qzExit();
// 6) 题被停用后,学员侧不再出;已答记录保留
const qq=S.qs.find(x=>x.st==='已定稿');A.qOff({dataset:{id:qq.id}});L('停用题不再入诊断池='+!kpDiagSet(ME.mid).includes(qq.id)+' 已有作答不删='+(S.ansLog.length>0));A.qPass({dataset:{id:qq.id}});
// 7) 知识点停用后学员侧
const kk=S.kps.find(k=>k.st==='启用'&&adaptTested(ME.mid).includes(k.id));if(kk){kk.st='停用';L('知识点停用后 提升清单不显示它='+!adaptList(ME.mid).some(x=>x.k.id===kk.id));kk.st='启用'}
// 8) 多选题:只选一个对的 → 判错
const mq=S.qs.find(x=>x.type==='多选'&&x.st==='已定稿');if(mq){QZ={mode:'practice',kid:mq.kp,ids:[mq.id],i:0,picked:[mq.ans[0]],shown:false,log:[],chg:{}};R.page='quiz';A.qzSubmit();L('多选只选对一个 → '+(QZ.lastOk?'判对(错!)':'判错(对)'));QZ=null}
// 9) 判断题:选"错误"
const jq=S.qs.find(x=>x.type==='判断'&&x.st==='已定稿');if(jq){QZ={mode:'practice',kid:jq.kp,ids:[jq.id],i:0,picked:[jq.ans[0]===0?1:0],shown:false,log:[],chg:{}};R.page='quiz';A.qzSubmit();L('判断题选反 → '+(QZ.lastOk?'判对(错!)':'判错(对)'));QZ=null}
document.body.dataset.end='pc';A.reset();
// 10) 区域老师能不能看到题库与知识点
A.roleSwitch({value:'r1'});UI.page='catalog';UI.tab.catalog='题库';try{render();L('区域老师 旧题库链接 → '+UI.page+'/'+UI.tab.content+' len='+tx().length)}catch(e){L('ERR r1 题库 '+e.message)}
A.roleSwitch({value:'boss'});L('老板 能访问知识点管理='+PAGES_OK.boss.includes('catalog')+' 菜单不显示='+!/知识点管理/.test(document.querySelector('#menu').innerText));
A.roleSwitch({value:'hq'});
// 11) 所有已定稿题:题干无"原文里没有的数字"自检(数字必须出现在来源话术里)
const miss=[];S.qs.filter(x=>x.st==='已定稿').forEach(x=>{const c=content(x.src);const T=c?(((c.body||{}).spin?Object.values(c.body.spin).join(''):'')+c.title).replace(/\*\*/g,''):'';const rightTxt=(x.type==='判断'?[]:x.ans.map(i=>x.opts[i])).join(' ');(rightTxt.match(/\d[\d.,]*/g)||[]).forEach(n=>{if(!T.includes(n.replace(/,/g,'')))miss.push(x.id+':'+n)})});
L('正确答案里的数字必须出现在来源话术原文 → 不一致='+miss.length+' '+miss.join(' '));
// 12) 同一知识点题目不重复(题干)
const dup=S.qs.filter((x,i,a)=>a.findIndex(y=>y.stem===x.stem)!==i);L('重复题干='+dup.length);
}catch(e){L('TOP '+e.message+' @'+(e.stack||'').split('\n')[1])}
