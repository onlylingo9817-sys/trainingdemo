const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
try{
A.roleSwitch({value:'hq'});closeDlg();
const menu=document.querySelector('#menu').innerText;
CK('左侧菜单不再单列标签管理',!/标签管理/.test(menu));
UI.page='config';UI.tab.config='标签管理';render();
CK('配置中心有标签管理页签',/标签管理/.test(document.querySelector('#main .tabs').innerText));
CK('标签管理页可渲染标签树',/标签树/.test(document.querySelector('#main').innerText));
UI.page='tagmanage';render();
CK('旧 tagmanage 路由重定向到配置中心',UI.page==='config'&&UI.tab.config==='标签管理');
UI.page='effect';UI.tab.effect='人员';render();
CK('效果追踪含人员就绪度页签',/人员就绪度/.test(document.querySelector('#main .tabs').innerText)&&/就绪度/.test(document.querySelector('#main').innerText));
const menu2=document.querySelector('#menu').innerText;
CK('左侧菜单不再单列人员',!/看效果\n人员/.test(menu2));
A.roleSwitch({value:'boss'});UI.page='effect';UI.tab.effect='人员';render();
CK('老板身份的人员页签只给群体视图',/只看群体结果/.test(document.querySelector('#main').innerText));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
