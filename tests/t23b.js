const L=m=>out.push(String(m));const tx=()=>document.querySelector('#main').innerText;
/* t23b:维度配置 / 画像校验 / 错题生命周期 / 配置版本 / 调优回路 全流程 */
const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});
const readAll=()=>JSON.stringify(S.lrn.map(l=>v23Readiness(l.mid,l.tier).val));
/* ============ 维度配置:新增 / 停用 / 合并 后,知识点与统计一致 ============ */
UI.page='config';UI.tab.config='维度体系';render();
CK('维度体系页渲染且列出 7 个维度',/维度列表/.test(tx())&&S.dims.length===7);
const dsc=dimOf('Dscene');
A.dmOpen({dataset:{id:'Dscene'}});$('#dm_new').value='自驾游';A.dmAdd({dataset:{d:'Dscene'}});
CK('新增维度值',dimIdByName('Dscene','自驾游')!=null&&dsc.values.length===7,'场景值='+dsc.values.length);
const dup=dsc.values.length;$('#dm_new').value='自驾游';A.dmAdd({dataset:{d:'Dscene'}});
CK('重复值被拦截',dsc.values.length===dup&&/已存在/.test(document.querySelector('#toast').innerText));
/* 停用:已挂的知识点保留,统计不丢 */
const v1=dsc.values.find(v=>v.name==='露营');const nUse0=S.kps.filter(k=>((k.dims||{}).Dscene||[]).includes(v1.id)).length;
A.dmToggle({dataset:{d:'Dscene',v:v1.id}});
const nUse1=S.kps.filter(k=>((k.dims||{}).Dscene||[]).includes(v1.id)).length;
CK('停用值:已挂知识点引用保留(不丢历史)',v1.status==='off'&&nUse0===nUse1&&nUse0>0,nUse0+' → '+nUse1);
A.dmToggle({dataset:{d:'Dscene',v:v1.id}});
/* 合并:引用改写 + mergedTo 留痕;画像命中数应一致 */
const ab=dimOf('Dab');const pj=ab.values.find(v=>v.name==='价格异议'),zc=ab.values.find(v=>v.name==='政策口径');
const hitBefore=S.profiles.map(p=>p.items.map(it=>pfKps(it).length).join(','));
const kA=S.kps.filter(k=>((k.dims||{}).Dab||[]).includes(zc.id)).length,kB=S.kps.filter(k=>((k.dims||{}).Dab||[]).includes(pj.id)).length;
UI.sel.dmf={id:'Dab'};
A.dmMerge({dataset:{d:'Dab',v:zc.id}});
$('#dm_to').value=pj.id;A.dmMergeDo({dataset:{d:'Dab',v:zc.id}});
const kA2=S.kps.filter(k=>((k.dims||{}).Dab||[]).includes(zc.id)).length,kB2=S.kps.filter(k=>((k.dims||{}).Dab||[]).includes(pj.id)).length;
CK('合并:被合并值引用归零、目标值引用 = 两者之和',kA2===0&&kB2===kA+kB,'政策口径 '+kA+'→'+kA2+' 价格异议 '+kB+'→'+kB2);
CK('合并:原值留 mergedTo 且已停用',zc.mergedTo===pj.id&&zc.status==='off');
CK('合并:变更留痕',(S.dimLog||[]).some(x=>/合并/.test(x.act)));
/* 合并后的画像:选择器含已合并值时,命中的知识点数不丢(沿用到目标值) */
const hitAfter=S.profiles.map(p=>p.items.map(it=>pfKps(it).length).join(','));
const dropped=S.profiles.some(p=>p.items.some((it,i)=>pfKps(it).length<(hitBefore[S.profiles.indexOf(p)].split(',')[i]|0)));
CK('合并后画像命中知识点数没有减少(不因维度整理而丢证据)',!dropped,hitBefore.join(' | ')+' → '+hitAfter.join(' | '));
/* ============ 画像:权重校验 + 就绪度重算 ============ */
A.reset();UI.page='config';UI.tab.config='岗位画像';UI.sel.pff={tier:'新人顾问'};render();
const p=pfOf('新人顾问');const base=readAll();
p.items[0].weight=60;render();
CK('权重合计≠100:页面提示且保存被拦',/≠ 100/.test(tx()));
const nvx=S.cfgV.length;A.pfSave();
CK('权重≠100 保存失败、不生成版本',S.cfgV.length===nvx&&/权重合计需等于 100/.test(document.querySelector('#toast').innerText));
p.items[0].weight=35;p.items[1].weight=30;A.pfSave();
const after=readAll();
CK('合法修改:生成配置版本并重算就绪度',S.cfgV.length===nvx+1&&after!==base,'版本 '+nvx+'→'+S.cfgV.length);
CK('版本差异记录了画像项的权重变化',S.cfgV[S.cfgV.length-1].diff.some(d=>/产品卖点/.test(d[0])));
/* ============ 评价口径:校验 / 影响预估 / 保存 / 版本 ============ */
A.reset();UI.page='config';UI.tab.config='评价口径';render();
const w0=JSON.stringify(S.cfg.srcW);
$('#ce_w_drill').value='1.5';A.ceSave();
CK('非法来源权重(>1)被拦截',JSON.stringify(S.cfg.srcW)===w0&&/0–1/.test(document.querySelector('#toast').innerText));
$('#ce_w_drill').value='0.5';A.ceEst();
CK('影响预估:展示差异与受影响人数',/影响预估/.test($('#ce_est').innerText)&&/就绪度上升/.test($('#ce_est').innerText));
CK('影响预估不写入配置',JSON.stringify(S.cfg.srcW)===w0);
const nv0=S.cfgV.length;A.ceSave();
CK('保存后生成版本 + 配置生效',S.cfgV.length===nv0+1&&S.cfg.srcW.drill===0.5);
$('#ce_win').value='0';A.ceSave();CK('「最近 N 次」=0 被拦截',/至少 1/.test(document.querySelector('#toast').innerText));
/* ============ 错题生命周期 ============ */
A.reset();
const recN=S.mis.filter(m=>m.status==='recurred').length,closedN=S.mis.filter(m=>m.status==='closed').length;
CK('存在「关闭后复发」案例',recN>=2,'复发='+recN+' 已关闭='+closedN);
CK('复发率 = 复发 ÷ (已关闭+复发)',v23RecurRate()===Math.round(recN/(recN+closedN)*100),v23RecurRate()+'%');
CK('复发的错题都有 closedTs(曾被关闭过)',S.mis.filter(m=>m.status==='recurred').every(m=>m.closedTs));
CK('每条错题有代表原文与知识点',S.mis.every(m=>m.quote&&kp(m.kp)));
const op=S.mis.find(m=>m.status==='open');
A.misNext({dataset:{id:op.id}});CK('错题推进 未处理→改善中',op.status==='improving');
A.misNext({dataset:{id:op.id}});CK('错题推进 改善中→已关闭',op.status==='closed'&&op.closedTs===today);
const before=S.packs.length;A.misPackOne({dataset:{id:S.mis.find(m=>m.status!=='closed').id}});
CK('指派学习包:按模板生成实例',S.packs.length===before+1&&S.packs[0].tpl==='PT2');
const tps=S.topics.length;A.misTopic({dataset:{kp:'K18'}});CK('生成课题:进入课题池',S.topics.length===tps+1);
UI.page='effect';UI.tab.effect='错题集';render();CK('错题集页渲染',/按知识点聚合/.test(tx())&&/复发率/.test(tx()));
/* ============ 调优回路 ============ */
A.reset();
const r0=readAll();
const dg=v23Diag();const hit=dg.filter(x=>x.ok==='bad').map(x=>x.no);
CK('剧本起点:诊断命中第 ③ 层(测评过关但行为不升)',hit.includes('③'),'命中='+hit.join(','));
UI.page='effect';UI.tab.effect='调优';UI.tab.tune='前后对比';render();
CK('调整前「前后对比」是空态引导,不是造出来的数',/还没有可对比/.test(tx()));
A.tnFix();CK('一键调整弹窗含影响预估',/影响预估/.test(document.querySelector('#dlg').innerText)&&/就绪度上升/.test(document.querySelector('#dlg').innerText));
const srcBefore=JSON.stringify(S.cfg.srcW);
CK('弹窗只预估,不改配置',JSON.stringify(S.cfg.srcW)===srcBefore&&S.cfgV.length===1);
A.tnFixDo();
CK('生成 v2 且状态=观察中',S.cfgV.length===2&&S.cfgV[1].status==='观察中');
CK('v2 差异里包含来源权重与学习包',S.cfgV[1].diff.some(d=>/演练/.test(d[0]))&&S.cfgV[1].diff.some(d=>/学习包/.test(d[0])));
CK('新增「顾虑解除专项」模板与实例',S.packTpl.some(t=>t.id==='PT4')&&S.packs.some(p=>p.tpl==='PT4'));
CK('配置已改为新权重',S.cfg.srcW.drill===0.4);
const r2=readAll();CK('就绪度已按新口径重算',r2!==r0);
UI.tab.tune='前后对比';render();
const t=tx();CK('前后对比:展示生效前后 + 对照批 + 双重差分',/生效前/.test(t)&&/生效后/.test(t)&&/对照/.test(t)&&/双重差分/.test(t));
CK('前后对比:声明只是相关、样本小',/只是.*相关/.test(t)||/相关/.test(t)&&/区间宽/.test(t));
const a3=v23A3Rate('试点批',v23Wins().cur[0],v23Wins().cur[1]),a3b=v23A3Rate('试点批',v23Wins().prev[0],v23Wins().prev[1]);
CK('生效后试点批「顾虑解除」行为出现率上升',a3>a3b,a3b+'% → '+a3+'%');
A.tnRollback({dataset:{v:2}});
CK('回滚:权重恢复为 v1',JSON.stringify(S.cfg.srcW)===srcBefore);
CK('回滚:留痕(v2=已回滚,新增一条记录)',S.cfgV[1].status==='已回滚'&&S.cfgV.length===3&&/回滚/.test(S.cfgV[2].note));
/* 回滚后重算 == 用 v1 口径在同一时间点重算(逐人) */
const v1raw=S.cfgV[0].raw;const c1=Object.assign({},S.cfg,v1raw);
const viaV1=JSON.stringify(S.lrn.map(l=>v23Readiness(l.mid,l.tier,c1).val));
CK('回滚后就绪度 = 用 v1 口径重算(逐人一致)',readAll()===viaV1);
['诊断','配置版本','前后对比'].forEach(tb=>{UI.tab.tune=tb;try{render();CK('回滚后「'+tb+'」可渲染',tx().length>100)}catch(e){CK('回滚后「'+tb+'」',false,e.message)}});
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
