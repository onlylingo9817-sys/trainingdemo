const L=m=>out.push(m);
try{
A.roleSwitch({value:'hq'});
// 1 save round trip on SPIN content
A.cEdit({dataset:{id:'N101'}});C.spin.I=C.spin.I+' 补一句';render();
const q=qcheck(cAsObj());L('qc N101 hard='+q.hard.length+' soft='+q.soft.length);
A.cSave({dataset:{s:'0'}});const c=content('N101');L('save N101 st='+c.st+' spinI='+(c.body.spin.I.endsWith('补一句')));
// 2 legacy migration
A.cEdit({dataset:{id:'N1'}});L('legacy flag='+C.legacy+' N='+C.spin.N.length);render();
L('legacy form has banner='+/旧格式/.test($('#main').innerText));
C.spin={S:'s',P:'p',I:'i',N:'n'};C=null;
// 3 AI generation for 话术
A.cNew({dataset:{ai:'1'}});C.kind='话术';C.goal='让顾问能接住客户「你们更贵」';C.desc='客户拿奔驰 GLC 对比,说你们更贵。顾问常直接讲参数。';C.req='口语化';
A.cGen();
setTimeout(()=>{try{L('gen state='+C.gen+' title='+C.title+' spinSN='+(C.spin.S.length>0)+'/'+(C.spin.N.length>0)+' aiSpin='+!!C.aiSpin+' hl='+/\*\*/.test(C.spin.I));
 render();L('edit page text has 人改/AI badges='+/AI/.test($('#main').innerText));
 // hl toggle
 const ta=document.getElementById('sp_S');ta.focus();ta.setSelectionRange(0,2);A.spinHl({dataset:{k:'S'}});L('after hl S='+C.spin.S.slice(0,8));A.spinUn({dataset:{k:'S'}});L('after unhl S='+C.spin.S.slice(0,8));
 A.cPreview();L('preview has S='+/情境/.test(document.body.innerText));closeDlg();
}catch(e){L('ERR gen '+e.message+' '+(e.stack||'').split('\n')[1])}},2200);
// 4 import feishu spin doc via link
C=null;UI.page='content';UI.tab.content='导入内容';const st=ciState();st.files=[{name:SPIN_URL,size:'-',link:1}];A.ciRun();
const b=S.cimps[0];L('import batch items='+b.items.length+' first='+b.items[0].title+' kind='+b.items[0].kind+' hasSpin='+!!b.items[0].body.spin+' dup='+b.items.filter(x=>x.dup).length);
b.direct=true;A.ciConfirm({dataset:{id:b.id}});L('confirm: stored='+b.nStored+' draft='+b.nDraft+' skip='+b.nSkip);
// 5 CSV with S:/P: lines
const csv=CI_HEAD.join(',')+'\n'+['话术','CSV SPIN 测试','通用','展厅','不限','全员','全国','','','测试词',['S：哥，来看车啊','P：怕买贵','I：错过**优惠**','N：我们给你算账'].join(CI_SEP),''].join(',');
UI.sel.ci={files:[],text:csv,link:'',dept:'',direct:false};A.ciRun();L('csv spin parsed='+!!S.cimps[0].items[0].body.spin+' S='+S.cimps[0].items[0].body.spin.S);
// 6 RN
A.roleSwitch({value:'hq'});
}catch(e){L('TOP '+e.message+' @'+(e.stack||'').split('\n')[1])}
