const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});closeDlg();
/* 导入：解析后只给建议，不写入内容 */
UI.page='content';UI.tab.content='导入内容';UI.sel.ciB=null;
UI.sel.ci={files:[],text:'',link:'',dept:'',direct:false};A.ciSample();const before=S.contents.length;A.ciRun();
const b=S.cimps.find(x=>x.st==='待确认');
CK('导入解析后有推荐知识点',b&&b.items.some(r=>(r.aiKp||[]).length>0),'推荐='+(b?b.items.reduce((a,r)=>a+(r.aiKp||[]).length,0):0));
CK('导入解析后有推荐标签',b&&b.items.some(r=>(r.aiTags||[]).length>0),'标签='+(b?b.items.reduce((a,r)=>a+(r.aiTags||[]).length,0):0));
CK('建议默认没有写入内容库',S.contents.length===before,'before='+before+' after='+S.contents.length);
const r=b.items.find(x=>(x.aiKp||[]).length&&(x.aiTags||[]).length);
const kid=r.aiKp[0].id;const nK=(r.kps||[]).length;
A.ciAiKp({dataset:{i:String(b.items.indexOf(r)),k:kid}});
CK('采纳推荐知识点写入当前导入条目',(r.kps||[]).includes(kid)&&r.mainKp===kid,'kps='+(r.kps||[]).join(',')+' main='+r.mainKp);
CK('采纳后设置主讲解/提及语义',r.kpRole[kid]==='主讲解',JSON.stringify(r.kpRole));
const tid=r.aiTags[0].id;A.ciAiTag({dataset:{i:String(b.items.indexOf(r)),v:tid}});
CK('采纳推荐标签写入当前条目',(r.tags||[]).includes(tid),(r.tags||[]).join(','));
const k2=r.aiKp[1]&&r.aiKp[1].id;
if(k2){A.ciAiIgnoreKp({dataset:{i:String(b.items.indexOf(r)),k:k2}});CK('忽略先弹原因选择',!!document.querySelector('#ai_ig_rs'));A.ciAiIgnoreKp({dataset:{i:String(b.items.indexOf(r)),k:k2,rs:'1'}});CK('忽略知识点建议不改写入且标记忽略',!(r.kps||[]).includes(k2)&&(r.aiIgnored.kp||[]).includes(k2));CK('忽略原因写进留痕',(S.aiLog||[]).some(x=>/忽略/.test(x.type)&&x.accepted===0&&x.reason),JSON.stringify((S.aiLog||[])[0]||{}));}
/* 导入保存字段完整 */
A.ciConfirm({dataset:{id:b.id}});const c=S.contents.find(x=>x.batch===b.id&&x.title===r.title);
CK('导入保存时落 kps/mainKp/kpRole/tags',!!c&&(c.kps||[]).includes(kid)&&c.mainKp===kid&&c.kpRole[kid]==='主讲解'&&(c.tags||[]).includes(tid),c?JSON.stringify({kps:c.kps,main:c.mainKp,tags:c.tags}):'未找到内容');
CK('导入建议有留痕',(S.aiLog||[]).some(x=>/导入推荐/.test(x.type)&&x.accepted===1));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
