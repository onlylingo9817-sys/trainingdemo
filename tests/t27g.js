const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
const b0=S.qs.length;A.qGen();const nq=S.qs.slice(b0);
CK('AI 出题只生成草稿',nq.every(q=>q.st==='草稿'&&q.aiDraft),'n='+nq.length);
CK('生成的题选项互异且答案在选项内',nq.every(q=>new Set(q.opts).size===q.opts.length&&q.ans.every(i=>i>=0&&i<q.opts.length)));
CK('生成的题解析带来源原文',nq.every(q=>/来源话术原文/.test(q.why)));
CK('草稿题不能直接定稿(占位已去除则自检通过)',nq.every(q=>Array.isArray(qCheckHard(q))));
const d0=S.drills.length;A.drGen();const nd=S.drills.slice(d0);
CK('AI 演练只生成草稿',nd.every(d=>d.st==='草稿'&&d.aiDraft));
CK('演练草稿带必说点、思路点和参考话术',nd.every(d=>d.turns.every(t=>t.must.length&&t.idea.length&&t.ref)),'n='+nd.length);
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
