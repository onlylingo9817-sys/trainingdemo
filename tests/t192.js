const L=m=>out.push(m);const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});
L('KP_TABS='+KP_TABS.join('/'));
L('树 节点='+PTAGS.length+' 层级最大='+Math.max(...PTAGS.map(t=>t.lv))+' 示例路径='+ptagByPath('外饰_迎宾踏板').path+' id='+ptagByPath('外饰_迎宾踏板').id);
L('种子 标签挂载: '+S.kps.filter(k=>(k.tags||[]).length).length+'/'+S.kps.length+' 无pAxis='+S.kps.every(k=>k.pAxis===undefined&&k.sAxis===undefined)+' K3='+kpTagTxt(kp('K3')).join(','));
// 总览
UI.page='catalog';UI.tab.catalog='总览';render();const t=tx();
L('总览 渲染 len='+t.length+' 覆盖率='+/讲解覆盖率/.test(t)+' 树='+/按产品标签树看/.test(t)+' 叶子缺口='+/还没有知识点的叶子/.test(t)+' 按车型='+/按车型/.test(t)+' 按负责人='+/按负责人/.test(t)+' 近30天='+/近 30 天变化/.test(t)+' 最该处理='+/现在最该处理/.test(t));
L('总览 树行数='+document.querySelectorAll('#main tr.kp-click').length+' 可点元素='+document.querySelectorAll('#main .kp-click').length);
const yp=ptagByPath('外饰');L('外饰 节点含子='+ptagDesc(yp.id).length+' 统计='+JSON.stringify(kpTreeStat(yp.id)));
L('树叶子无知识点='+PTAGS.filter(x=>ptagLeaf(x.id)&&!S.kps.some(k=>(k.tags||[]).includes(x.id))).map(x=>x.name).join(','));
// 跳转
A.kpJump({dataset:{fk:'tag',fv:yp.id}});L('跳转 标签=外饰 → tab='+UI.tab.catalog+' 行数='+document.querySelectorAll('#main table.t.nw tr').length+' 含K3='+tx().includes('上下车便利')+' 含K4(能源,不应含)='+tx().includes('6.6kW'));
A.kpJump({dataset:{fk:'car',fv:'N70系列'}});L('跳转 车型 N70 → 行='+(document.querySelectorAll('#main table.t.nw tr').length-1));
A.kpJump({dataset:{fk:'owner',fv:'(无)'}});L('跳转 无负责人 → '+(document.querySelectorAll('#main table.t.nw tr').length-1)+' 个');
A.kpJump({dataset:{fk:'tag',fv:'__none'}});L('跳转 事实型无标签 → '+(document.querySelectorAll('#main table.t.nw tr').length-1)+' 个='+S.kps.filter(k=>k.type==='事实型'&&!(k.tags||[]).length).map(k=>k.name).join('、'));
A.kpJump({dataset:{tab:'未挂载内容'}});L('跳转 tab=未挂载内容 → '+UI.tab.catalog);
A.kpJump({dataset:{fk:'lv',fv:'只看有缺口'}});L('跳转 有缺口 → '+(document.querySelectorAll('#main table.t.nw tr').length-1)+' 个');
UI.sel.kpf={};
// 看板 标签列 / 筛选项
UI.page='catalog';UI.tab.catalog='看板';render();L('看板 有产品标签筛选='+/含子节点/.test(tx())+' 有标签列='+/产品标签/.test(tx()));
// 新建表单:3 必填 + 默认值
A.kpNew();render();let f=tx();L('新建表单 必填提示='+/只有名称、车型、类型必填/.test(f)+' 折叠='+/展开修改/.test(f)+' 默认维度='+KF.dim+' 默认负责人='+KF.owner+' 无产品轴字段='+!/产品轴路径|场景轴/.test(f));
A.kfType({dataset:{v:'技能型'}});L('切技能型 → 维度='+KF.dim);A.kfType({dataset:{v:'事实型'}});L('切回事实型 → 维度='+KF.dim);
A.kfMore();render();f=tx();L('展开后 有标签选择='+/产品标签树/.test(f)+' 同义词='+/同义词/.test(f));
A.kfTagAdd({value:ptagByPath('能源_外放电').id});A.kfTagAdd({value:ptagByPath('内饰_座椅').id});L('选标签 → '+KF.tags.length+' 个 '+KF.tags.map(id=>ptagOf(id).path).join(','));
KF.name='迎宾踏板灯语';KF.car='N90 Max';A.kfSave();const nk=kp(UI.kid);L('新建保存 '+nk.id+' st='+nk.st+' owner='+nk.owner+' tags='+nk.tags.length+' dim='+nk.dim);
A.kpEdit();render();L('编辑表单 展开='+KF.more);A.kfCancel();
// 从总览"树上无知识点的叶子"一键建
A.kpNewTag({dataset:{id:ptagByPath('外饰_车轮').id}});render();L('从叶子建 → 预选标签='+KF.tags.map(id=>ptagOf(id).name)+' 表单渲染='+/新增知识点/.test(tx()));KF=null;
// 详情页
UI.page='kp';UI.kid='K3';render();L('详情 属性卡 标签='+/外饰_迎宾踏板|外饰_电动侧踏/.test(tx())+' 无产品轴='+!/产品轴|场景轴/.test(tx()));
// 内容编辑页:按车型预过滤 + 搜索
A.cEdit({dataset:{id:'N101'}});render();const e=tx();const opts=document.querySelectorAll('#cp_kl option').length;L('编辑页 选择器=input+datalist='+!!document.querySelector('input[list=cp_kl]')+' 可选='+opts+' 预过滤提示='+/已按这条话术的车型预过滤/.test(e)+' (N101 车型='+C.car+')');
const all=S.kps.filter(k=>k.st==='启用'&&!(C.kps||[]).includes(k.id)).length;L('  启用点总数(未挂)='+all+' → 预过滤后='+opts);
A.cKpAdd({value:'不存在的点'});L('  输入不存在 → 不新增 kps='+C.kps.length);
A.cKpAdd({value:kpPickLbl(kp('K4'))});L('  按标签标注的名字选 K4 → kps='+C.kps.join(','));
A.cKpAdd({value:'K5'});L('  按 id 选 K5 → kps='+C.kps.join(','));
// 推荐加标签词
const tcont={title:'迎宾踏板介绍',kw:'',car:'N90 Max',text:'电动侧踏三节台阶'};L('推荐 含标签词 → '+recKpsFor(tcont,3).map(k=>k.name).join('/'));
// 候选/复制/清空
A.reset();UI.page='catalog';UI.tab.catalog='总览';render();L('reset 后总览 ok len='+tx().length);
A.clear();KP_TABS.forEach(t=>{UI.tab.catalog=t;try{render()}catch(er){L('ERR clear '+t+' '+er.message+' @'+(er.stack||'').split('\n')[1])}});L('clear 全页签 ok');
['r1','boss'].forEach(r=>{A.reset();A.roleSwitch({value:r});const ok=PAGES_OK[UI.role.type];if(ok.includes('catalog')){UI.page='catalog';KP_TABS.forEach(t=>{UI.tab.catalog=t;try{render()}catch(er){L('ERR '+r+' '+t+' '+er.message+' @'+(er.stack||'').split('\n')[1])}});A.kpNew();try{render();L(r+' 新建表单 默认负责人='+KF.owner)}catch(er){L('ERR '+r+' form '+er.message)}}L(r+' ok')});
}catch(e){L('TOP '+e.message+' @'+(e.stack||'').split('\n')[1])}
