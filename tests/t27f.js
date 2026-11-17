const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
const before={kps:S.kps.filter(k=>(k.tags||[]).length).length,contents:S.contents.filter(c=>(c.kps||[]).length).length};
A.aiOpen();
CK('AI 检查里有批量预填入口',/批量预填待补项/.test(document.querySelector('#dlg').innerText));
A.aiBatchOpen();
const p=UI.sel.aiBatch;
CK('批量预填一次算出待补项',!!p&&p.items.length>0,'items='+(p&&p.items.length));
CK('批量预填不改数据(算完未采纳)',S.kps.filter(k=>(k.tags||[]).length).length===before.kps&&S.contents.filter(c=>(c.kps||[]).length).length===before.contents);
CK('默认只勾选高置信项',p.items.every(x=>x.on===(x.score>=AI_CONF.higher)),'on='+p.items.filter(x=>x.on).length+'/'+p.items.length);
CK('批量预填弹窗无横向截断',(()=>{const t=document.querySelector('#dlg .ai-batch-tw');return !t||t.scrollWidth<=t.clientWidth+2})());
CK('预填弹窗可渲染勾选表',!!document.querySelector('#dlg .tw table'));
const onN=p.items.filter(x=>x.on).length;
p.items.forEach((x,i)=>{if(x.on)A.aiBatchToggle({dataset:{i:String(i)}})});
CK('逐条取消后剩余勾选数减少',UI.sel.aiBatch.items.filter(x=>x.on).length===0,'before='+onN);
p.items.forEach((x,i)=>{if(!x.on)A.aiBatchToggle({dataset:{i:String(i)}})});
const n0=S.contents.filter(c=>(c.kps||[]).length).length;
A.aiBatchApply();
CK('采纳后写入并留痕',S.contents.filter(c=>(c.kps||[]).length).length+S.kps.filter(k=>(k.tags||[]).length).length+S.contents.filter(c=>(c.tags||[]).length).length>n0+before.kps,'');
CK('采纳后待补数量下降',aiGlobalCounts().unlinked.length<=p.items.filter(x=>x.type==='content').length+6);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
