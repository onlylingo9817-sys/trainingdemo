const L=m=>out.push(m);const tx=()=>document.querySelector('#main').innerText;
try{
A.roleSwitch({value:'hq'});
// A. content -> 定稿 -> task (no publish) -> RN not visible
A.cNew({dataset:{}});C.kind='话术';C.type='图文';C.title='未上架话术';C.items=['先问需求,再给方案'];C.kw='需求, 场景';C.cover='a.png';C.lecturer='王磊';C.chan=['汽车销售'];C.subject='探需';C.expire='';C.source='';C.cat='销售技巧';C.kps=['K57'];C.kpRole={K57:'主讲解'};C.mainKp='K57';render();
A.cSave({dataset:{s:'1'}});let c=S.contents[0];L('submit->'+c.st);
A.cReview({dataset:{id:c.id}});A.cPass({dataset:{id:c.id}});L('pass->'+c.st+' pub '+pubOf(c));
document.body.dataset.end='rn';ME=PEOPLE[0];R.page='school';R.cat=0;renderRN();L('RN sees unpublished '+document.querySelector('#rscr').innerText.includes('未上架话术'));document.body.dataset.end='pc';
// task
A.cToProject({dataset:{id:c.id}});L('toProject ok ref '+F.stages[0].modules.flatMap(m=>m.nodes).some(n=>n.cfg&&n.cfg.ref===c.id));
F.goal.target=String(+(baseNow()+8).toFixed(1));F.overReason='x';A.fsubmit();A.fsubmitOk();const p=S.projects[0];L('proj '+p.id+' node ver '+(p.nodes.find(n=>n.contentId===c.id)||{}).contentVer);
// B. publish immediate
UI.page='content';UI.cid=c.id;A.cPub({dataset:{id:c.id}});A.cPubOk({dataset:{id:c.id}});L('pub->'+pubOf(c)+' v'+c.pubVer);
document.body.dataset.end='rn';renderRN();L('RN sees published '+document.querySelector('#rscr').innerText.includes('未上架话术'));document.body.dataset.end='pc';
// C. revised v2, publish stays v1
A.cRevise({dataset:{id:c.id}});C.items[0]='改版后的第一句';A.cSave({dataset:{s:'1'}});A.cReview({dataset:{id:c.id}});A.cPass({dataset:{id:c.id}});
L('revised st '+c.st+' ver '+c.ver+' pub '+pubOf(c)+' pubVer '+c.pubVer+' newer '+(c.ver>c.pubVer));
UI.page='publish';UI.tab.publish='已上架';render();L('publish list shows 有新版本 '+tx().includes('有新版本'));
// D. unpublish
A.cUnpub({dataset:{id:c.id}});$('#ubk').value='口径过期';A.cUnpubOk({dataset:{id:c.id}});L('unpub '+pubOf(c)+' st '+c.st);
document.body.dataset.end='rn';R.page='school';R.cat=0;renderRN();L('RN after unpub '+document.querySelector('#rscr').innerText.includes('未上架话术'));document.body.dataset.end='pc';
// E. timed publish
A.cPub({dataset:{id:c.id}});$('#pu_pt').value='定时发布';A.puPt({value:'定时发布'});$('#pu_ptime').value=addDays(today,3)+'T09:00';A.cPubOk({dataset:{id:c.id}});L('timed '+pubOf(c)+' '+c.publishTime);
c.publishTime=addDays(today,-1)+'T09:00';cSweep();L('after sweep '+pubOf(c));
// F. archive
A.cUnpub({dataset:{id:c.id}});$('#ubk').value='x';A.cUnpubOk({dataset:{id:c.id}});A.cArchive({dataset:{id:c.id}});L('archive '+c.st+' usable '+usableC(c));
A.cRestore({dataset:{id:c.id}});L('restore '+c.st);
// G. topic progress
const t=S.topics.find(x=>(x.cids||[]).length);L('topic '+t.id+' state '+topicContentState(t).k);
const t2=S.topics.find(x=>!((x.cids||[]).length));L('topic w/o content '+t2.id+' '+topicContentState(t2).k);
UI.page='workbench';render();L('work has 课题待生产 '+tx().includes('课题待生产'));
UI.page='topic';UI.tid=t.id;render();L('topic detail has 内容生产 '+tx().includes('内容生产'));
A.tGenContent({dataset:{id:t2.id}});L('gen from topic '+UI.page+' kind '+C.kind);
// H. import -> 定稿
UI.page='content';UI.tab.content='导入内容';A.ciSample();A.ciRun();const b=S.cimps[0];b.direct=true;A.ciConfirm({dataset:{id:b.id}});L('import draft '+b.nDraft+' final '+b.nStored+' states '+b.cids.map(id=>content(id).st).join());
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
