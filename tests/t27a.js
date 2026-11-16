const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});closeDlg();
/* 入店辅导五段闭环 */
UI.page='coach';UI.tab.coach='辅导总览';render();
CK('入店辅导页按五段/六步组织',/学 → 练 → 检 → 用 → 馈/.test(tx())&&/触发/.test(tx())&&/复测/.test(tx()));
CK('首屏有先跟哪家店/下一步',/先跟哪家店/.test(tx())&&/下一步/.test(tx()));
const x=S.tickets.find(t=>t.st==='触发');
CK('触发工单有明确的去定计划入口',!!document.querySelector('[data-act="tPlan"]'),'cards='+document.querySelectorAll('.coach-card').length);
A.tPlan({dataset:{id:x.id}});
const plan=document.querySelector('#dlg').innerText;
CK('计划页含学什么/练什么/辅导目标',/学：到店教什么/.test(plan)&&/练：让门店伙伴练什么/.test(plan)&&/辅导前/.test(plan));
CK('计划页把目标与复测挂上',/复测时只对比这个指标/.test(plan));
/* 计划保存后到检核 */
A.tPlanSave({dataset:{id:x.id}});CK('保存计划进入到店检核',x.st==='到店'&&/入店前检核/.test(document.querySelector('#dlg').innerText));
/* 完成检核 + 记录进入陪跑 */
A.coachCheck({dataset:{id:x.id,phase:'during',i:'0'},checked:true});A.coachCheck({dataset:{id:x.id,phase:'during',i:'1'},checked:true});
document.querySelector('#coach_note').value='顾问能讲卖点，但客户说贵就让价';
A.tGoSave({dataset:{id:x.id}});CK('检核+记录后可进入陪跑',x.st==='陪跑',x.st);
/* 陪跑：日/周/月反馈 + 缺口提示 */
const coach=document.querySelector('#dlg').innerText;
CK('陪跑页有日/周/月反馈节奏',/每日关注数据与动作/.test(coach)&&/周度复盘数据变化/.test(coach)&&/陪跑结束总结/.test(coach));
document.querySelector('#coach_fb_kind').value='日';document.querySelector('#coach_fb_title').value='日反馈：回访有遗漏';document.querySelector('#coach_fb_text').value='2 条超 2 小时';A.coachFb({dataset:{id:x.id}});
CK('添加日反馈成功',x.feedback.length===1&&x.feedback[0].kind==='日');
document.querySelector('#coach_fb_kind').value='周';document.querySelector('#coach_fb_title').value='周反馈：到店回升';document.querySelector('#coach_fb_text').value='同城仍低';A.coachFb({dataset:{id:x.id}});
CK('添加周反馈成功',x.feedback.length===2&&x.feedback.some(f=>f.kind==='周'));
/* 复测：预填/解释 */
A.tRetest({dataset:{id:x.id}});CK('复测页有辅导前/复测/变化',/辅导前/.test(document.querySelector('#dlg').innerText)&&/复测值/.test(document.querySelector('#dlg').innerText)&&/变化/.test(document.querySelector('#dlg').innerText));
document.querySelector('#coach_post').value=String(x.pre+2);document.querySelector('#coach_next').value='把有效话术放进早会';A.coachPostSave({dataset:{id:x.id}});CK('复测保存写入 post 与阶段',!!x.post&&x.st==='复测'&&x.post.value===x.pre+2);
/* 结案：必须写复盘 */
A.tClose({dataset:{id:x.id}});document.querySelector('#coach_close_res').value='有效，复制到其他门店';document.querySelector('#coach_close_why').value='先认同再算账有效';A.coachClose({dataset:{id:x.id}});CK('结案写入结论和复盘',x.st==='结案'&&x.closeRes&&x.closeWhy);
/* 过程记录 */
CK('过程记录留痕',x.log.length>=5,x.log.map(l=>l.act).join(' / '));
/* 推荐辅导店 */
UI.tab.coach='推荐辅导店';render();CK('推荐辅导店可见且有理有据',/推荐分/.test(tx())||/暂无推荐辅导店/.test(tx()));
/* 新人工单派发 */
const y=S.tickets.find(t=>t.st!=='结案'&&t.id!==x.id);if(y){CK('已有工单可打开详情',(()=>{try{A.ticket({dataset:{id:y.id}});return document.querySelector('#dlg').innerText.includes('辅导项目')}catch(e){return false}})());}
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
