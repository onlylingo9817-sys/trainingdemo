const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
/* t33b:v1.2 课题 → 知识点关联（只校验有效引用） */
try{
A.roleSwitch({value:'hq'});closeDlg();
const ts=S.topics;
CK('有关联的课题都指向有效知识点',ts.filter(t=>t.kpId).every(t=>!!kp(t.kpId)),ts.filter(t=>t.kpId&&!kp(t.kpId)).map(t=>t.id+'→'+t.kpId).join(','));
CK('不存在悬空的 kpId',ts.every(t=>!t.kpId||!!kp(t.kpId)));
UI.tid='T9';UI.page='topic';render();
CK('课题详情有“关联知识点”选择器',!!document.querySelector('[data-wc=topicKp]'));
const sel=document.querySelector('[data-wc=topicKp]');
CK('选择器预选当前关联',S.topics.find(t=>t.id==='T9').kpId?sel.value===S.topics.find(t=>t.id==='T9').kpId:true);
const kid=S.kps[0].id;
A.topicKp({dataset:{id:'T9'},value:kid});
CK('可改关联并留痕',(()=>{const t=S.topics.find(x=>x.id==='T9');return t.kpId===kid&&(t.hist||[]).some(h=>/关联知识点/.test(h.act))})());
A.topicKp({dataset:{id:'T9'},value:''});
CK('可取消关联',!S.topics.find(t=>t.id==='T9').kpId);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
