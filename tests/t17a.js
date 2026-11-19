const L=m=>out.push(m);const tx=()=>document.querySelector('#main').innerText;
try{
L('contents '+S.contents.length+' states '+[...new Set(S.contents.map(c=>c.st))].join('/')+' pub '+[...new Set(S.contents.map(c=>pubOf(c)))].join('/'));
['hq','r1','boss'].forEach(role=>{A.roleSwitch({value:role});const pg=PAGES_OK[UI.role.type];
 if(pg.includes('content')){CTABS.forEach(t=>{UI.page='content';UI.tab.content=t;try{render();L(role+' content '+t+' '+tx().length)}catch(e){L('ERR '+role+' '+t+' '+e.message+' @'+(e.stack||'').split('\n')[1])}})}
 if(pg.includes('publish')){PTABS.forEach(t=>{UI.page='publish';UI.tab.publish=t;try{render();L(role+' publish '+t+' '+tx().length)}catch(e){L('ERR '+role+' pub '+t+' '+e.message+' @'+(e.stack||'').split('\n')[1])}})}
 ['overview','topics','projects','effect','config'].forEach(p=>{if(!pg.includes(p))return;UI.page=p;const tabs={overview:['闭环总览','老板视图','流程与规则'],config:['指标库','阈值与口径','内容管理','数据源'],effect:['效果总览','效果报告','调优与结项'],topics:['发现的问题'],projects:['学习项目配置']}[p];tabs.forEach(t=>{UI.tab[p]=t;try{render();L(role+' '+p+' '+t+' '+tx().length)}catch(e){L('ERR '+role+' '+p+' '+t+' '+e.message+' @'+(e.stack||'').split('\n')[1])}})})});
A.roleSwitch({value:'hq'});
S.contents.forEach(c=>{UI.page='cdetail';UI.cid=c.id;DTABS.forEach(t=>{UI.ctab=t;try{render()}catch(e){L('ERR detail '+c.id+' '+t+' '+e.message+' @'+(e.stack||'').split('\n')[1])}});try{A.cEdit({dataset:{id:c.id}});render()}catch(e){L('ERR edit '+c.id+' '+e.message+' @'+(e.stack||'').split('\n')[1])}});L('all details/edit ok');
S.topics.forEach(t=>{UI.page='topic';UI.tid=t.id;try{render()}catch(e){L('ERR topic '+t.id+' '+e.message)}});L('topics ok');
}catch(e){L('TOP '+e.message+' @'+(e.stack||'').split('\n')[1])}
