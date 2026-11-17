const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
const ts=S.topics;
CK('课题全部关联到知识点',ts.every(t=>!!t.kpId),ts.filter(t=>!t.kpId).map(t=>t.id).join(','));
CK('关联的知识点都存在',ts.every(t=>!!kp(t.kpId)));
CK('按内容反推与词面匹配都生效',ts.filter(t=>!((t.cids||[]).length)).some(t=>!!t.kpId));
UI.tid='T9';UI.page='topic';render();
CK('课题详情有“关联知识点”选择器',!!document.querySelector('[data-wc=topicKp]'));
const sel=document.querySelector('[data-wc=topicKp]');
CK('选择器预选当前关联',S.topics.find(t=>t.id==='T9').kpId?sel.value===S.topics.find(t=>t.id==='T9').kpId:true);
A.topicKp({dataset:{id:'T9'},value:''});
CK('可取消关联',!S.topics.find(t=>t.id==='T9').kpId);
A.topicKp({dataset:{id:'T9'},value:kp('K3')?('K3'):(S.kps[0]||{}).id});
CK('可改关联并留痕',(()=>{const t=S.topics.find(x=>x.id==='T9');return !!t.kpId&&(t.hist||[]).some(h=>/关联知识点/.test(h.act))})());
UI.page='catalog';UI.tab.catalog='总览';render();
CK('治理面板显示课题来源缺口',/没有课题来源/.test(document.querySelector('#main').innerText));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
