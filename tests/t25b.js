const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
/* t25b:v1.2 内容编辑的知识点选择器（推荐 / 主讲解唯一 / 不自动保存） */
try{
A.roleSwitch({value:'hq'});closeDlg();
A.cNew({dataset:{}});C.kind='话术';C.title='价格异议 · 价值锚点';C.bscene='客户说太贵时';C.spin={S:'客户嫌贵',P:'怕买亏',I:'影响成交',N:'算总拥有成本'};C.cover='x.png';render();
CK('内容编辑有知识点搜索框',!!document.querySelector('#cp_kl'));
CK('内容编辑有 AI 建议区',!!document.querySelector('#cKpAdv'));
const k=S.kps.find(x=>x.code==='KP-SALE-13');
A.cKpAdd({value:kpV12PickLabel(k)});
CK('采纳知识点后加入 C.kps',C.kps.includes(k.id),C.kps.join(','));
CK('第一个知识点默认主讲解',C.mainKp===k.id,C.mainKp);
const k2=S.kps.find(x=>x.code==='KP-SALE-14');
A.cKpAdd({value:kpV12PickLabel(k2)});
CK('第二个知识点默认补充材料',C.kpRole[k2.id]==='补充材料',C.kpRole[k2.id]);
A.cKpRole({dataset:{v:k2.id}});
CK('切换主讲解后只有一个主讲解',C.mainKp===k2.id&&Object.values(C.kpRole).filter(r=>r==='主讲解').length===1,JSON.stringify(C.kpRole));
CK('内容 AI 建议不会自动保存',!S.contents.some(c=>c.title===C.title));
A.kfCancel&&0;
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
