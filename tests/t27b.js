const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
/* AI 入口位置：知识点表单 */
A.kpNew();KF.name='露营外放电';KF.syn='露营用电、电磁炉';KF.more=true;render();A.kfAdvice();render();
const tagBox=document.querySelector('[data-field=kfTag]');const tagAdv=document.querySelector('#kfAdv');const abBox=document.querySelector('[data-wc=kfAb]');const abAdv=document.querySelector('#kfAbAdv');
CK('知识点标签 AI 建议在标签控件附近',tagBox&&tagAdv&&Math.abs(tagAdv.getBoundingClientRect().top-tagBox.getBoundingClientRect().bottom)<120,'gap='+(tagAdv&&tagBox?Math.round(tagAdv.getBoundingClientRect().top-tagBox.getBoundingClientRect().bottom):'-'));
CK('知识点能力 AI 建议在能力控件附近',abBox&&abAdv&&Math.abs(abAdv.getBoundingClientRect().top-abBox.getBoundingClientRect().bottom)<120,'gap='+(abAdv&&abBox?Math.round(abAdv.getBoundingClientRect().top-abBox.getBoundingClientRect().bottom):'-'));
CK('AI 建议每条动作单行展示',(!document.querySelector('#kfAdv')||getComputedStyle(document.querySelector('#kfAdv .ai-sug-act')).display==='flex'),document.querySelector('#kfAdv .ai-sug-act')?getComputedStyle(document.querySelector('#kfAdv .ai-sug-act')).display:'none');
/* AI 入口位置：内容编辑 */
A.cNew({dataset:{}});C.kind='话术';C.title='露营外放电 · 电磁炉和电水壶';C.bscene='露营时客户问能不能用电';C.spin={S:'周末露营',P:'没电不方便',I:'影响体验',N:'6.6kW 外放电,电磁炉电水壶都能带'};C.cover='x.png';render();
const kpAdv=document.querySelector('#cKpAdv');const kpPicker=document.querySelector('#cp_kl')?document.querySelector('#cp_kl').parentNode:null;const tagPicker=document.querySelector('.tag-picker');
CK('内容编辑知识点推荐在知识点字段附近',!!kpAdv&&!!document.querySelector('#cp_kl'),'kpAdv='+!!kpAdv);
CK('内容编辑标签推荐在标签控件附近',!!document.querySelector('#cTagAdv')&&!!tagPicker,'tagAdv='+!!document.querySelector('#cTagAdv'));
CK('内容编辑 AI 建议不会挤成多行竖排',!document.querySelector('#cKpAdv .ai-sug')||getComputedStyle(document.querySelector('#cKpAdv .ai-sug')).display==='flex');
/* 解释入口 */
A.aiWhy();CK('有“为什么这样建议”解释',/可解释规则/.test(document.querySelector('#dlg').innerText));closeDlg();
CK('AI 建议块有依据入口',!!document.querySelector('#kfAdv [data-act=aiWhy]')||!!document.querySelector('#cKpAdv [data-act=aiWhy]'));
/* 入店辅导页面引导 */
UI.page='coach';UI.tab.coach='辅导总览';render();CK('入店辅导有引导文案',/学 → 练 → 检 → 用 → 馈/.test(document.querySelector('#main').innerText));
/* 页面不存在横向溢出：检查关键卡片 */
const ov=document.querySelector('.coach-board');
CK('辅导卡不横向溢出',!ov||ov.scrollWidth<=ov.clientWidth+2,(ov?ov.scrollWidth+'/'+ov.clientWidth:'none'));
/* 计划按钮能打开 */
const x=S.tickets.find(t=>t.st==='触发');A.tPlan({dataset:{id:x.id}});CK('计划弹窗打开',!!document.querySelector('#dlg')&&/保存计划/.test(document.querySelector('#dlg').innerText));closeDlg();
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
