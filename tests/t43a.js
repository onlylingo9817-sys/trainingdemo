const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const html=()=>document.querySelector('#main').innerHTML;
/* t43a:知识点维护闭环 + 车系/版本树 + 精简列表 */
try{
A.roleSwitch({value:'hq'});closeDlg();A.reset();
/* 产品知识不再被能力项旧规则拦截 */
UI.kid='K12';A.kpEdit();
CK('编辑表单使用业务化分组与车型树',/定义与边界/.test(html())&&/谁需要、用在哪里/.test(html())&&!!document.querySelector('.kp-car-tree'));
A.kfSave();let k=kp('K12');
CK('K12 产品知识直接保存成功',UI.page==='kp'&&k.domain==='产品知识'&&!k.ability&&!((k.dims||{}).Dab||[]).length&&!!k.sellpoint);
CK('新的学习结果进入运行时',!!k.one&&k.one.indexOf('推荐合适车型')>=0,k.one||'空');
/* 非产品知识改能力后三个字段同步 */
UI.kid='K57';A.kpEdit();const abId=dimIdByName('Dab','促单成交');A.kfAb({value:abId});A.kfSave();k=kp('K57');
CK('K57 能力名称 / dim / dims.Dab 同步',k.ability==='促单成交'&&k.dim==='促单成交'&&(k.dims.Dab||[])[0]===abId,JSON.stringify({ability:k.ability,dim:k.dim,Dab:k.dims.Dab}));
/* 新增产品点进入实际数据、标准库与校验 */
const n0=S.kps.length;A.kpNew();KF.name=' Demo 产品知识维护闭环';KF.one='用于验证新增产品知识的分类和保存。';KF.statusV12='结构已核';A.kfSave();
const nk=S.kps.find(x=>x.name===' Demo 产品知识维护闭环'.trim());const nt=nk&&S.tax.find(t=>t.kpId===nk.id);const val=kpV12ValidateAll();
CK('新增产品知识不落成销售技能',!!nk&&nk.domain==='产品知识'&&nk.type==='事实型'&&!nk.ability&&!!nk.sellpoint,nk?nk.domain+' / '+nk.type:'未新增');
CK('新增后实际列表与标准库同步',S.kps.length===n0+1&&!!nt&&nt.name===nk.name&&nt.domain===nk.domain&&nt.sellpoint===nk.sellpoint&&nt.one===nk.one);
CK('新增数据进入结构校验且 0 error',val.total===S.kps.length&&val.errors===0,val.total+' 条 / '+val.errors+' error');
/* 通用互斥、车系覆盖、子版本归并、折叠 */
A.kpNew();KF.cars=['SU7'];A.kfCar({value:'通用车型',checked:true});
CK('选通用车型清除具体车型',JSON.stringify(KF.cars)===JSON.stringify(['通用车型']),KF.cars.join('/'));
A.kfCar({value:'SU7 Pro',checked:true});
CK('选具体车型清除通用车型',JSON.stringify(KF.cars)===JSON.stringify(['SU7 Pro']),KF.cars.join('/'));
A.kfCar({value:'SU7',checked:true});
CK('选车系移除其子版本冗余',JSON.stringify(KF.cars)===JSON.stringify(['SU7']),KF.cars.join('/'));
KF.cars=[];V23_CAR_TREE.YU7.forEach(v=>A.kfCar({value:v,checked:true}));
CK('子版本全选自动归并为车系',JSON.stringify(KF.cars)===JSON.stringify(['YU7']),KF.cars.join('/'));
KF.cars=['SU7'];render();const child=document.querySelector('input[data-wc="kfCar"][value="SU7 Pro"]');
CK('车系已选时子版本禁用',!!child&&child.disabled);
UI.sel.kpCarFold={};A.kpCarFold({dataset:{v:'SU7'}});
CK('车系树可折叠',UI.sel.kpCarFold.SU7===true&&!kpCarTreeHtml().includes('value="SU7 Pro"'));
A.kpCarFold({dataset:{v:'SU7'}});CK('车系树可重新展开',!UI.sel.kpCarFold.SU7&&kpCarTreeHtml().includes('value="SU7 Pro"'));
/* 默认 6 列、完整字段、更多筛选、常用视图 */
UI.page='catalog';UI.tab.catalog=KP_TAB_LIB;UI.sel.kpf={};render();
CK('知识点列表默认有管理列',['知识点','适用范围','分类','能讲 / 能考 / 能练','负责人','操作'].every(t=>document.querySelector('.kp-list.compact tr').innerText.indexOf(t)>=0),document.querySelectorAll('.kp-list.compact tr:first-child th').length+' 列');
CK('车型筛选按车系分组且支持通用车型',document.querySelectorAll('select[data-k="car"] optgroup').length===4&&!!document.querySelector('select[data-k="car"] option[value="通用车型"]'));
CK('更多筛选默认收起',!!document.querySelector('.kp-more-filters')&&document.querySelector('.kp-more-filters').hidden);
A.kpMore();CK('更多筛选可展开',!document.querySelector('.kp-more-filters').hidden);
A.kpFull();CK('显示岗位和批次后主要列还在',document.querySelector('.kp-list.full tr').children.length===8&&/岗位/.test(document.querySelector('.kp-list.full tr').innerText)&&/适用范围/.test(document.querySelector('.kp-list.full tr').innerText));
A.kpFull();
const viewRows=v=>S.kps.filter(x=>kpV12ListMatch(x,{view:v}));
CK('我负责的视图只保留本人知识点',viewRows('mine').every(x=>x.owner===meShort()),viewRows('mine').length+' 条');
CK('P0 缺讲解视图口径正确',viewRows('p0gap').every(x=>x.pri==='P0'&&kpV12Health(x).cells.exp.s!=='ok'),viewRows('p0gap').length+' 条');
CK('考核不全视图口径正确',viewRows('assess').every(x=>kpV12Health(x).cells.spec.s!=='ok'),viewRows('assess').length+' 条');
CK('政策 / 待复核视图口径正确',viewRows('review').every(x=>kpV12Type(x)==='政策'||!kpV12ReviewOk(x)||kpV12Health(x).pending),viewRows('review').length+' 条');
CK('车系筛选覆盖子版本且不串车系',kpV12ListMatch(kp('XM-P18'),{car:'澎程 N90'})&&!kpV12ListMatch(kp('XM-P18'),{car:'SU7'}));
A.kpView({dataset:{v:'p0gap'}});CK('常用视图可点击应用',kpLibFilter().view==='p0gap'&&!!document.querySelector('.kp-view.on'));
A.kpEditRow({dataset:{id:kp('K12').id}});CK('列表可直接进入编辑',UI.page==='kpform'&&KF.id===kp('K12').id);
/* 知识图谱必须有独立可见入口，不能被总览覆盖后静默消失 */
UI.page='catalog';UI.tab.catalog='知识图谱';UI.sel.kgView='overview';render();
CK('知识图谱独立页签可见',KP_TABS.includes('知识图谱')&&document.querySelector('.tab.on').innerText==='知识图谱');
CK('图谱全貌渲染全部启用知识点',document.querySelectorAll('.kg-node').length===S.kps.filter(x=>x.st==='启用').length,document.querySelectorAll('.kg-node').length+' 个节点');
A.kgQ({value:'顾虑'});CK('图谱搜索会高命中的节点',document.querySelectorAll('.kg-node.hit').length>0);
A.kgPick({dataset:{id:kp('K57').id}});CK('单点前置/后续/相关关系视图可用',UI.sel.kgView==='focus'&&document.querySelectorAll('.kg-col').length===4&&/顾虑澄清/.test(html()));
CK('页面无 undefined / NaN',!/undefined|NaN/.test(html()));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n').slice(1,3).join(' | '))}
