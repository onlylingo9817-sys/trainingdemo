const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});closeDlg();
CK('标签根是业务分类',tagRoots().map(t=>t.name).join('/')==='车型卖点/政策口径/销售场景',tagRoots().map(t=>t.name).join('/'));
CK('标签支持车上部位之外的政策',!!tagOptions().find(t=>/政策口径/.test(t.path)),tagOptions().filter(t=>/政策/.test(t.path)).map(t=>t.path).slice(0,3).join(' | '));
UI.page='tagmanage';UI.sel.tagMgr='';render();
const before=PTAGS.length;
document.querySelector('#tag_new_name').value='政策测试专用标签';
document.querySelector('#tag_new_parent').value=PTAGS.find(t=>t.name==='政策口径').id;A.tagAdd();
const nt=PTAGS.find(t=>t.name==='政策测试专用标签');
UI.page='catalog';UI.tab.catalog='知识点库';UI.sel.kpf={};render();
CK('可以新建标签',!!nt&&PTAGS.length>before,nt?nt.path:'没建成');
CK('新标签层级正确',nt&&nt.path==='政策口径_政策测试专用标签',nt?nt.path:'');
nt.name='金融方案（改）';refreshTagPaths();CK('改名后路径同步',nt.path==='政策口径_金融方案（改）',nt.path);
UI.page='catalog';UI.tab.catalog='知识点库';UI.sel.kpf={};render();
CK('知识点库有左侧标签树',document.querySelectorAll('.tag-row').length>=4,'nodes='+document.querySelectorAll('.tag-row').length);
const n0=document.querySelectorAll('#main table.t tr').length-1;const pol=PTAGS.find(t=>t.name==='政策口径');A.tagSelect({dataset:{id:pol.id}});const n1=document.querySelectorAll('#main table.t tr').length-1;CK('知识点库点标签后列表收敛',n0>0&&n1<n0,'all='+n0+' filtered='+n1);
UI.page='content';UI.tab.content='全部内容';UI.sel.caf={};UI.sel.cq={};UI.sel.cadv=true;render();
const allN=document.querySelectorAll('#main table.t tr').length-1;const interior=PTAGS.find(x=>x.name==='内饰');A.tagSelect({dataset:{id:interior.id}});const filteredN=document.querySelectorAll('#main table.t tr').length-1;
CK('内容中心有左侧标签树',document.querySelectorAll('.tag-row').length>=4);
CK('内容中心点标签后列表收敛',filteredN>0&&filteredN<allN,allN+' → '+filteredN);
UI.page='kp';UI.kid='K3';render();CK('知识点详情用“标签”而不是部位',/标签/.test(tx())&&!/车上的部位/.test(tx()));
UI.page='catalog';UI.tab.catalog='总览';UI.sel.kpf={};render();CK('总览矩阵覆盖多个标签根',tx().includes('车型卖点')&&tx().includes('政策口径'));
CK('标签树可维护字段存在',PTAGS.every(t=>typeof t.status==='string'));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
