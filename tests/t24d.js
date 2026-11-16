const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
A.cNew({dataset:{}});C.kind='课程';C.type='图文';C.title='多知识点课程测试';C.cover='x.png';C.lecturer='王磊';C.intro='1. 外放电\n2. 价格异议';C.kps=['K4','K18'];C.mainKp='K4';C.kpRole={K4:'主讲解',K18:'提及'};
const k4b=kpMounted(kp('K4')).length,k18b=kpMounted(kp('K18')).length;
A.cSave({dataset:{s:'0'}});const c=S.contents[0];
CK('一门课程可挂多个知识点',(c.kps||[]).length===2,c.kps.join(','));
CK('主讲解与提及分别保存',c.mainKp==='K4'&&c.kpRole.K4==='主讲解'&&c.kpRole.K18==='提及',JSON.stringify(c.kpRole));
CK('主讲解计入完备度',kpMounted(kp('K4')).length===k4b+1,k4b+'→'+kpMounted(kp('K4')).length);
CK('提及不冒充可用讲解',kpMounted(kp('K18')).length===k18b&&kpMentioned(kp('K18')).length===1,'主讲解 '+kpMounted(kp('K18')).length+' 提及 '+kpMentioned(kp('K18')).length);
A.cView({dataset:{id:c.id}});render();const t=document.querySelector('#main').innerText;
CK('详情明确标注主讲解/提及',/主讲解/.test(t)&&/主题对象/.test(t));
/* 编辑页切主讲解 */
A.cEdit({dataset:{id:c.id}});render();const b=document.querySelector('#main [data-act=cKpRole][data-v=K18]');CK('编辑页可切换主讲解',!!b);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n').join(' >> '))}
