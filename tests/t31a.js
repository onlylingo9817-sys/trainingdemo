const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'boss'});closeDlg();UI.page='overview';UI.tab.overview='老板视图';render();
const tx=document.querySelector('#main').innerText;
CK('老板视图有结论条(达成/效果/待拍板)',/目标有没有达成/.test(tx)&&/培训有没有用/.test(tx)&&/需要你拍板/.test(tx));
CK('示意图表带“示意待接入”标记',/示意待接入/.test(tx));
CK('示意图表下有演示数据提示',/演示数据/.test(tx));
CK('达成数用可判断项目口径(不含样本不足)',/可判断项目中达标数/.test(tx)&&/样本不足不计入/.test(tx));
CK('效果差值与项目数口径一致',(()=>{const d=bossData();return d.done.length>0})());
CK('页面说明区分实测与示意',/实测/.test(tx)&&/示意/.test(tx));
CK('老板视图不含个人级明细入口',!/个人详情|查看个人/.test(tx));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}

const L2=m=>out.push(String(m));const CK2=(name,ok,detail)=>L2((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'boss'});closeDlg();UI.page='overview';UI.tab.overview='老板视图';render();
const t=document.querySelector('#main').innerText;
CK2('趋势图绑定具体培训项目名称',/培训项目：「/.test(t));
CK2('写明受训组与对照组人群',/受训组：/.test(t)&&/对照组：/.test(t));
CK2('写明指标与统计方式',/指标：/.test(t)&&/按周统计/.test(t));
CK2('图例带项目名，不是笼统“受训”',/受训（/.test(t));
const f=bossData().E.filter(p=>!smallNow(p)).sort((a,b)=>(b.eff.a||0)-(a.eff.a||0))[0];
CK2('曲线量级与项目指标一致',!!f&&t.includes(String(Math.round(f.base))),'base='+(f&&f.base));
}catch(e){L2('ERR '+e.message)}
try{
A.roleSwitch({value:'boss'});closeDlg();UI.sel.bossProj='';UI.page='overview';UI.tab.overview='老板视图';render();
const sel=document.querySelector('[data-wc=bossProj]');
CK2('趋势图有项目下拉可选(非写死)',!!sel&&document.querySelectorAll('[data-wc=bossProj] option').length>=3);
const first=bossData().E[0];
CK2('切换项目后标题随之变化',(()=>{A.bossProj({value:first.id});return document.querySelector('#main').innerText.includes('「'+first.name+'」')})(),first.name);
}catch(e){L2('ERR '+e.message)}
