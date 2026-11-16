const L=m=>out.push(m);const _st=window.setTimeout;window.setTimeout=(f,t)=>_st(f,t>1000?5:t);
try{
A.roleSwitch({value:'hq'});
A.cNew({dataset:{ai:'1'}});C.kind='话术';C.goal='让顾问能接住客户「你们更贵」';C.desc='客户拿奔驰 GLC 对比，说你们更贵。顾问常直接讲参数。';C.req='口语化';
A.cGen();
_st(()=>{try{L('gen state='+C.gen+' title='+C.title+' S?'+(C.spin.S.length>0)+' N?'+(C.spin.N.length>0)+' aiSpin='+!!C.aiSpin+' hl='+/\*\*/.test(C.spin.I)+' theme='+C.theme);
 render();L('badge AI='+/\bAI\b/.test($('#main').innerText));
 const ta=document.getElementById('sp_S');ta.focus();ta.setSelectionRange(0,2);A.spinHl({dataset:{k:'S'}});L('hl S='+C.spin.S.slice(0,8));A.spinUn({dataset:{k:'S'}});L('unhl S='+C.spin.S.slice(0,8));
 A.cPreview();L('preview 情境='+/情境/.test(document.body.innerText));closeDlg();
 C.cover='x.png';const q=qcheck(cAsObj());L('qc hard='+q.hard.join('|')+' soft='+q.soft.length);
 A.cSave({dataset:{s:'1'}});const n=S.contents[0];L('submitted '+n.id+' st='+n.st+' adopt='+aiAdopt(n)+' car='+n.car+' bodySpin='+!!n.body.spin);
 // review pass + rn
 A.cReview({dataset:{id:n.id}});A.cPass({dataset:{id:n.id}});L('pass st='+n.st+' ver snap spin='+!!n.vers[0].snap.body.spin);
 A.cPub({dataset:{id:n.id}});A.cPubOk({dataset:{id:n.id}});L('pub='+pubOf(n));
 A.cView({dataset:{id:n.id,tab:'版本'}});render();L('version tab ok '+$('#main').innerText.length);
 A.cVerView({dataset:{id:n.id,v:1}});L('verview dlg has 情境='+/情境/.test(document.body.innerText));closeDlg();
 A.cView({dataset:{id:'N102'}});A.cNav({dataset:{d:'1'}});L('nav -> '+UI.cid);
}catch(e){L('ERR '+e.message+' '+(e.stack||'').split('\n')[1])}},60);
}catch(e){L('TOP '+e.message)}
