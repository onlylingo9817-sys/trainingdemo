const L=m=>out.push(String(m));const CK=(name,ok,detail)=>L((ok?'PASS ':'FAIL ')+name+(detail?' — '+detail:''));
const tabTexts=()=>[...document.querySelectorAll('#main .tab')].map(e=>e.innerText.trim().replace(/\s+\d+$/,''));
const tx=()=>document.querySelector('#main').innerText;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
try{
A.roleSwitch({value:'hq'});closeDlg();
UI.page='catalog';UI.tab.catalog='总览';render();
const tabs=tabTexts();
CK('知识点页签收敛为 4 个',tabs.length===4&&tabs.includes('补学进度'),tabs.join(' / '));
CK('页签不再包含批量新建/清河迁移',!tabs.includes('批量新建')&&!tabs.includes('清河迁移'),tabs.join(' / '));
UI.tab.catalog='知识点库';render();
A.kpOpenBatch();
CK('批量导入打开右侧抽屉',!!UI.drw&&/批量导入/.test(UI.drw.title),UI.drw&&UI.drw.title);
CK('抽屉内保留原页签位置',UI.tab.catalog==='知识点库',UI.tab.catalog);
CK('抽屉含 CSV 导入与新车克隆',/下载 CSV 模板/.test(document.querySelector('#drw-root').innerText)&&/新车型一键克隆/.test(document.querySelector('#drw-root').innerText));
A.drwClose();
UI.tab.catalog='批量新建';render();
wait(40).then(()=>{
  CK('旧「批量新建」落到知识点库并开抽屉',UI.tab.catalog==='知识点库'&&!!UI.drw,UI.tab.catalog);
  A.drwClose();
  UI.page='config';UI.tab.config='数据源';render();
  CK('配置中心数据源可见清河迁移清单',/清河迁移清单/.test(tx()));
  UI.page='catalog';UI.tab.catalog='清河迁移';render();
  CK('旧「清河迁移」自动落到配置中心数据源',UI.page==='config'&&UI.tab.config==='数据源',UI.page+'/'+UI.tab.config);
  CK('配置中心页不含知识点页签栏',!tabTexts().includes('候选'),tabTexts().join('/'));
  UI.page='catalog';UI.tab.catalog='知识点库';render();A.kpOpenBatch();
  A.kpSample();
  CK('载入示例后 CSV 文本被保留',(UI.sel.kpCsvText||'').length>10,(UI.sel.kpCsvText||'').slice(0,20));
  if(A.kpAiAudit)A.kpAiAudit();
  CK('AI 预检后抽屉仍在',!!UI.drw&&/批量导入/.test(UI.drw.title),UI.drw&&UI.drw.title);
  A.drwClose();
}).catch(e=>L('ERR '+e.message));
}catch(e){L('ERR '+e.message+' @'+(e.stack||'').split('\n')[1])}
