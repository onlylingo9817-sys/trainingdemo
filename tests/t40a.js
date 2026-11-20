const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
/* t40a:知识点库 v1 标准库 —— 维度自洽 / 版本口径 / 完备率分母 / 页面 / 批量导入与新车克隆 */
try{
A.roleSwitch({value:'hq'});closeDlg();A.reset();
const M=V23_TAX_META;
/* ---- 1. 数量与维度自洽 ---- */
CK('v1 共 73 条知识点',S.tax.length===73,S.tax.length+' 条');
CK('P0 56 / P1 17',S.tax.filter(t=>t.pri==='P0').length===56&&S.tax.filter(t=>t.pri==='P1').length===17,S.tax.filter(t=>t.pri==='P0').length+' / '+S.tax.filter(t=>t.pri==='P1').length);
CK('7 个维度',S.dims.length===7,S.dims.map(d=>d.name).join('/'));
CK('能力项 7 项且全部单值',M.abilities.length===7&&S.tax.every(t=>M.abilities.includes(t.ab)),M.abilities.join('/'));
CK('知识域全部在字典内',S.tax.every(t=>M.domains.includes(t.domain)));
CK('销售阶段全部在字典内',S.tax.every(t=>t.stages.length&&t.stages.every(s=>M.stages.includes(s))));
CK('车型全部在字典内',S.tax.every(t=>t.cars.length&&t.cars.every(c=>M.cars.includes(c))));
CK('场景 / 客户 / 竞品全部在字典内',S.tax.every(t=>(t.scenes||[]).every(v=>M.scenes.includes(v))&&(t.custs||[]).every(v=>M.custs.includes(v))&&(t.comps||[]).every(v=>M.comps.includes(v))));
CK('行业洞察 v1 预留、不铺知识点',M.domains.includes('行业洞察')&&S.tax.filter(t=>t.domain==='行业洞察').length===0);
/* ---- 2. 版本口径 ---- */
const pc3=S.tax.find(t=>t.code==='KP-PC-03'),pc4=S.tax.find(t=>t.code==='KP-PC-04');
CK('车型是 车系 → 版本 → 通用 三级(18 个值)',M.cars.length===18&&M.cars.includes('SU7')&&M.cars.includes('YU7')&&M.cars.includes('澎程 N70')&&M.cars.includes('澎程 N90')&&M.cars.includes('SU7 标准版')&&M.cars.includes('SU7 Pro')&&M.cars.includes('SU7 Max')&&M.cars.includes('SU7 Ultra')&&M.cars.includes('YU7 长续航版')&&M.cars.includes('澎程 N70 Pro')&&M.cars.includes('澎程 N90 Max 探索版')&&M.cars.includes('通用车型'),M.cars.join('/'));
CK('续航按版本写(N70 Max 505 / N90 Max 464)',/505/.test(pc3.name)&&/464/.test(pc3.name)&&v23TaxCarMatch(pc3,'澎程 N70 Max')&&v23TaxCarMatch(pc3,'澎程 N90 Max'),pc3.name);
CK('油耗按版本写(5.7 / 6.1 / 6.26)',/5\.7/.test(pc4.name)&&/6\.1/.test(pc4.name)&&/6\.26/.test(pc4.name),pc4.name);
CK('SU7 Ultra 是 SU7 车系下的版本值',M.cars.includes('SU7 Ultra')&&M.cars.filter(c=>/^SU7/.test(c)).length===5);
CK('知识点可挂车系:SU7 车系级覆盖到 SU7 Pro',v23TaxCarMatch(S.tax.find(t=>t.code==='KP-SU7-01'),'SU7 Pro')&&!v23TaxCarMatch(S.tax.find(t=>t.code==='KP-SU7-09'),'SU7 Pro'));
CK('SU7 续航不用“100 度电”一刀切',!/100 度电/.test(S.tax.find(t=>t.code==='KP-SU7-04').name));
const sale1=S.tax.find(t=>t.code==='KP-SALE-01');
CK('首触改为知识库口径 5 分钟',/5 分钟/.test(sale1.name)&&!/2 小时/.test(sale1.name),sale1.name);
CK('每条都有可回查的 document_id',S.tax.every(t=>/^[0-9a-f]{16,}$/.test(t.doc||'')),S.tax.filter(t=>!/^[0-9a-f]{16,}$/.test(t.doc||'')).map(t=>t.code).join(','));
/* ---- 3. 完备率分母与公式 ---- */
const den=c=>v23TaxCovered(c,false).denom;
CK('SU7 / YU7 各版本分母 37',den('SU7 标准版')===37&&den('SU7 Pro')===37&&den('SU7 Max')===37&&den('SU7 Ultra')===37&&den('YU7 标准版')===37&&den('YU7 长续航版')===37&&den('YU7 Pro')===37&&den('YU7 Max')===37&&den('YU7 GT')===37,[den('SU7 标准版'),den('SU7 Pro'),den('YU7 长续航版'),den('YU7 GT')].join('/'));
CK('N70 37 / N90 38(大七座只算 N90)',den('澎程 N70 Pro')===37&&den('澎程 N70 Max')===37&&den('澎程 N90 Max')===38&&den('澎程 N90 Max 探索版')===38,[den('澎程 N70 Pro'),den('澎程 N90 Max')].join('/'));
CK('店长分母 2 且只算带人辅导',v23TaxCovered('通用车型',true).denom===2);
CK('带人辅导不进顾问车型分母',!v23TaxDenom('SU7 标准版',false).some(t=>t.ab==='带人辅导'));
/* ---- 4. 旧知识点映射与新知识点归属 ---- */
CK('旧知识点已打上 v1 编号',S.kps.filter(k=>k.code).length>=20,S.kps.filter(k=>k.code).length+' 条');
CK('所有启用知识点都有车型 / 知识域 / 能力',S.kps.filter(k=>k.st==='启用').every(k=>(k.dims.Dcar||[]).length&&(k.dims.Ddomain||[]).length&&(k.dims.Dab||[]).length),S.kps.filter(k=>k.st==='启用'&&(!(k.dims.Dcar||[]).length||!(k.dims.Ddomain||[]).length||!(k.dims.Dab||[]).length)).map(k=>k.id).join(','));
CK('新知识点有负责人(能启用)',S.kps.filter(k=>k.taxCode&&k.st==='启用').every(k=>!!k.owner));
/* ---- 5. 页面 ---- */
UI.page='config';UI.tab.config='知识点库 v1';render();const t=tx();
CK('知识点库 v1 页面可渲染',/v1 标准库/.test(t)&&/车型 × 知识域/.test(t)&&/这次核对后改掉/.test(t));
CK('页面没有 undefined / NaN',!/undefined|NaN/.test(t));
CK('页面含 73 条清单与缺口',/知识点清单/.test(t)&&/P0 缺口/.test(t));
CK('配置中心页签可进入',S.dims&&document.querySelector('#main')!=null);
/* ---- 6. 批量导入 / 新车克隆 ---- */
const n0=S.tax.length,k0=S.kps.length;
$('#tax_csv').value='知识点编号,名称,类型,知识域,能力项,销售阶段,车型,客户场景,客户类型,竞品,优先级,来源\nKP-CUS-TEST,测试·家庭日试驾路线,技能,销售技能,试乘试驾,试乘试驾,通用车型,家庭出行,家庭用户,,P0,测试文档';
A.taxCsvImport();
CK('CSV 导入新增标准条目 + 知识点骨架',S.tax.length===n0+1&&S.kps.length===k0+1&&S.tax.some(x=>x.code==='KP-CUS-TEST'),S.tax.length+' / '+S.kps.length);
const carN=S.cfg.tax.car.length;
$('#tax_clone_src').value='YU7';$('#tax_clone_name').value='YU7 Max 2027';A.taxClone();
CK('新车型克隆:新增车型值并复制 P0 骨架',S.cfg.tax.car.includes('YU7 Max 2027')&&S.cfg.tax.car.length===carN+1&&S.kps.some(k=>k.cars.includes('YU7 Max 2027')),S.cfg.tax.car.join('/'));
/* ---- 7. 知识点表单可选车系 / 版本 / 通用 ---- */
A.kpNew();render();
const boxes=[...document.querySelectorAll('[data-wc=kfCar]')].map(x=>x.value);
CK('知识点表单可选车系 / 版本 / 通用',boxes.includes('SU7')&&boxes.includes('SU7 Pro')&&boxes.includes('通用车型'),boxes.slice(0,8).join('/'));
CK('车系级知识点自动覆盖版本、不跨车系(kpCarsHas)',kpCarsHas(kp(S.tax.find(t=>t.code==='KP-SU7-01').kpId),'SU7 Pro')&&!kpCarsHas(kp(S.tax.find(t=>t.code==='KP-YU7-01').kpId),'SU7 Pro'));
/* ---- 8. 工作台不被同类待办淹没 ---- */
A.reset();UI.page='workbench';render();
CK('工作台待办总量可控(<=45)',wbItems().length<=45,'待办='+wbItems().length);
CK('缺讲解合并为一条',wbItems().filter(x=>x.tag==='缺讲解').length<=1,'条数='+wbItems().filter(x=>x.tag==='缺讲解').length);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' | '))}