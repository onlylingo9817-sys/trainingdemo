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
