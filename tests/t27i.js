const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
A.kpNew();render();
const tx=()=>document.querySelector('#main').innerText;
CK('新增知识点默认展开标签/同义词/负责人',/同义词/.test(tx())&&/负责人/.test(tx())&&!/展开：标签/.test(tx()),'');
CK('不再有“展开修改”折叠入口',!/展开修改|展开：标签/.test(tx()));
KF.name='外放电露营场景';KF.syn='露营用电、电磁炉';render();
const tagSlot=document.querySelector('[data-field=kfTag]')||document.querySelector('.tag-picker');
const ab=document.querySelector('#main .ai-inline#kfAbAdv');
CK('标签推荐内联在标签字段内（不在页面顶部）',!!document.querySelector('#main .tag-ai-slot .ai-inline'),'');
CK('能力推荐内联在能力字段内',!!ab,'');
A.kfAdvice&&A.kfAdvice();render();
const tags=(UI.sel.kfAdvice||{}).tags||[];
if(tags.length){const tid=tags[0].tag.id;A.kfAiTag({dataset:{v:tid}});render();CK('采纳标签后出现在已选标签行',KF.tags.includes(tid)&&/已选|×/.test(tx()),'');}
else CK('推荐标签为空时有明确提示',/没有匹配到合适标签|暂无推荐/.test(tx()),'');
const before=(UI.sel.kfAdvice||{}).text;KF.name='价格异议应对';render();const after=(UI.sel.kfAdvice||{}).text;CK('名称变化后推荐文本已重算',!!after&&after!==before,(after||'').slice(0,20));CK('名称变化后能力推荐随之改变',(UI.sel.kfAdvice||{}).ab==='顾虑解除','ab='+(UI.sel.kfAdvice||{}).ab);
KF=null;
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
