const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
UI.kid='K3';UI.page='kp';render();
CK('知识点详情标题区有编辑入口',!!document.querySelector('[data-act=kpEdit]'));
A.kpMountDrawer();
const total0=mountCands().length;
const i=document.getElementById('mount_q');i.value='N1';i.dispatchEvent(new Event('input',{bubbles:true}));
CK('挂载抽屉支持搜索且缩小列表',mountCands().length<total0&&mountCands().length>0,total0+'→'+mountCands().length);
CK('搜索后焦点仍在搜索框',document.activeElement&&document.activeElement.id==='mount_q');
const k3=kp('K3');const before=kpMounted(k3).length;
const pick=mountCands()[0];A.kpMountOne({dataset:{id:pick.id}});
CK('挂载后该点关联数+1、角色为提及且抽屉不关',kpMountedAll(k3).length===before+1&&kpRoleOf(content(pick.id),'K3')==='提及'&&!!document.querySelector('.drw'),before+'→'+kpMountedAll(k3).length);
const st=document.getElementById('mount_st');if(st){st.value='已上架';st.dispatchEvent(new Event('change',{bubbles:true}));CK('按上架状态筛选生效',mountCands().every(c=>pubOf(c)==='已上架'))}
A.drwClose();
A.kpNew();KF.name='车型测试';render();
document.querySelector('#kf_newcar').value='YU7 Max';A.kfAddCar();
CK('表单可新增车型并选中',KF.cars.includes('YU7 Max')&&S.cfg.tax.car.includes('YU7 Max'));
KF=null;
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
