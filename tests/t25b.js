const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});closeDlg();
/* 新建知识点：软提示 + 采纳标签 */
A.kpNew();KF.name='露营外放电';KF.syn='露营用电、电磁炉';render();
A.kfAdvice();
const adv=UI.sel.kfAdvice;
CK('AI 匹配标签有结果',adv&&adv.tags.length>0,'tags='+(adv?adv.tags.length:0));
CK('建议不自动写入选中的标签',KF.tags.length===0,KF.tags.join(','));
const tid=adv.tags[0].tag.id;A.kfAiTag({dataset:{v:tid}});
CK('采纳后写入表单标签',KF.tags.includes(tid),KF.tags.join(','));
const n0=KF.tags.length;A.kfAiTagIgnore({dataset:{v:adv.tags[1]?adv.tags[1].tag.id:tid}});A.kfAdvice();
CK('忽略建议不会新增标签',KF.tags.length===n0,'before='+n0+' after='+KF.tags.length);
CK('知识点表单可见 AI 建议',/AI 建议/.test(document.querySelector('#main').innerText));
/* 内容编辑：推荐知识点 / 标签 */
A.cNew({dataset:{}});C.kind='话术';C.title='露营外放电 · 电磁炉和电水壶';C.bscene='露营时客户问能不能用电';C.spin={S:'周末露营',P:'没电不方便',I:'影响体验',N:'6.6kW 外放电,电磁炉电水壶都能带'};C.cover='x.png';render();
CK('内容编辑页出现 AI 建议',/AI 建议/.test(tx()));
const ck=document.querySelector('#main [data-act=cAiKp]');CK('推荐知识点有采纳入口',!!ck);
const ckTag=document.querySelector('#main [data-act=cAiTag]');CK('推荐标签有采纳入口',!!ckTag);
if(ck){const id=ck.dataset.v;A.cAiKp({dataset:{v:id}});CK('内容采纳知识点后设为主讲解',C.kps.includes(id)&&C.mainKp===id,C.kps.join(',')+' / '+C.mainKp)}
CK('内容 AI 检查没有自动保存到内容库',!S.contents.some(c=>c.title===C.title));
/* 知识点详情标签建议（若可命中） */
A.kfCancel();const kk=S.kps.find(k=>k.name.includes('外放电'));if(kk){UI.page='kp';UI.kid=kk.id;render();const html=aiKpDetailAdvice(kk);CK('知识点详情能给标签建议或明确无建议',typeof html==='string');}
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
