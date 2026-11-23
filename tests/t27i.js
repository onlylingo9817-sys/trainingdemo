const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
A.kpNew();render();
const tx=()=>document.querySelector('#main').innerText;
CK('新增知识点默认展开同义词/负责人',/同义词/.test(tx())&&/负责人/.test(tx())&&!/展开：标签/.test(tx()),'');
CK('不再有“展开修改”折叠入口',!/展开修改|展开：标签/.test(tx()));
CK('v1.2 表单不再恢复旧标签字段与标签推荐',!document.querySelector('#main .tag-picker')&&!document.querySelector('#main .tag-ai-slot'));
CK('产品知识显示卖点分类且不占能力项',/卖点分类/.test(tx())&&!document.querySelector('#main .ai-inline#kfAbAdv'));
KF.name='外放电露营场景';KF.syn='露营用电、电磁炉';A.kfDomain({value:'销售技能'});
const ab=document.querySelector('#main .ai-inline#kfAbAdv');
CK('非产品知识的能力推荐内联在能力字段内',!!ab,'');
A.kfAdvice&&A.kfAdvice();render();
const before=(UI.sel.kfAdvice||{}).text;KF.name='价格异议应对';render();const after=(UI.sel.kfAdvice||{}).text;
CK('名称变化后推荐文本已重算',!!after&&after!==before,(after||'').slice(0,20));
CK('名称变化后能力推荐随之改变',(UI.sel.kfAdvice||{}).ab==='顾虑解除','ab='+(UI.sel.kfAdvice||{}).ab);
A.kfAiAb({dataset:{v:'顾虑解除'}});
CK('采纳能力建议后同步表单选择',KF.abId===dimIdByName('Dab','顾虑解除'));
KF=null;
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
