/* 标签树:可自主维护。分类不限于车上部位,也可以政策、卖点、场景等。
   数据结构沿用 PTAGS: {id,name,pid,lv,path,status,order}
   兼容既有 k.tags / c.car / c.cat 等引用。标签可以是任何业务分类，不限于车上部位。 */
const TAG_ROOT='T1';
const tagActive=()=>PTAGS.filter(t=>t.status!=='off');
const tagPool=()=>S.tagPool||S.kps||[];
function tagPath(id){const t=ptagOf(id);return t?(t.path||t.name):''}
function tagShort(id){const t=ptagOf(id);return t?t.path.replace(/^[^_]+_/,'').replace(/_/g,' / '):''}
function tagBreadth(id){const t=ptagOf(id);return t?t.lv:0}
function tagSiblings(id){const t=ptagOf(id);return tagActive().filter(x=>x.pid===(t?t.pid:null))}
function tagChildrenSorted(id){return tagActive().filter(t=>t.pid===id).sort((a,b)=>(a.order||0)-(b.order||0)||a.name.localeCompare(b.name,'zh'))}
function tagRoots(){return tagActive().filter(t=>!t.pid).sort((a,b)=>(a.order||0)-(b.order||0))}
function tagStats(id){
  if(!id)return {kp:S.kps.length,content:S.contents.length};
  const ids=new Set(ptagDesc(id));
  const kpN=S.kps.filter(k=>(k.tags||[]).some(t=>ids.has(t))).length;
  const cN=S.contents.filter(c=>(c.tags||[]).some(t=>ids.has(t))||((c.kps||[]).some(kid=>{const k=kp(kid);return k&&(k.tags||[]).some(t=>ids.has(t))}))).length;
  return {kp:kpN,content:cN};
}
function tagFilterKp(list,tagId,opt){
  opt=opt||{};const ids=tagId&&tagId!=='__none'?new Set(ptagDesc(tagId)):null;
  return list.filter(k=>{if(!tagId)return true;if(tagId==='__none')return !(k.tags||[]).length;return (k.tags||[]).some(t=>ids.has(t))});
}
function tagFilterContent(list,tagId){
  if(!tagId)return list;if(tagId==='__none')return list.filter(c=>!(c.tags||[]).length&&!(c.kps||[]).some(kid=>{const k=kp(kid);return k&&(k.tags||[]).length}));
  const ids=new Set(ptagDesc(tagId));return list.filter(c=>(c.tags||[]).some(t=>ids.has(t))||((c.kps||[]).some(kid=>{const k=kp(kid);return k&&(k.tags||[]).some(t=>ids.has(t))})));
}
function tagOptions(opt){
  opt=opt||{};const rows=tagActive().slice().sort((a,b)=>a.path.localeCompare(b.path,'zh'));
  return rows.map(t=>({id:t.id,name:t.name,path:t.path,lv:t.lv})).filter(t=>!opt.leafOnly||!tagChildrenSorted(t.id).length);
}
function tagPickerHtml(field,current,opt){
  opt=opt||{};const vals=(current||[]).map(ptagOf).filter(Boolean);
  return '<div class="tag-picker">'
   +(vals.length?vals.map(t=>'<span class="tag pri" style="margin:0 6px 6px 0;padding:3px 8px">'+esc(tagShort(t.id))+' <a class="link" data-act="tagPickDel" data-field="'+field+'" data-v="'+t.id+'">×</a></span>').join(''):'<span class="hint">未选标签</span>')
   +'<div style="display:flex;gap:8px;margin-top:6px"><select class="tag-pick-sel" data-field="'+field+'"><option value="">选择标签…</option>'+tagOptions({leafOnly:opt.leafOnly}).map(t=>'<option value="'+t.id+'">'+'　'.repeat(t.lv-1)+esc(t.name)+'</option>').join('')+'</select><button class="btn sm" data-act="tagPickAdd" data-field="'+field+'">加上</button><button class="btn sm" data-act="tagOpenManage">管理标签</button></div></div>';
}
function tagTreeHtml(selected,opt){
  opt=opt||{};const expanded=UI.sel.tagOpen||(UI.sel.tagOpen={});
  const row=(t,lv)=>{
    const kids=tagChildrenSorted(t.id);const st=tagStats(t.id);const on=selected===t.id;
    const open=expanded[t.id]===true;
    return '<div class="tag-row '+(on?'on':'')+'" style="padding-left:'+(8+(lv-1)*15)+'px" data-act="tagSelect" data-id="'+t.id+'">'
      +(kids.length?'<span class="tag-tw" data-act="tagToggle" data-id="'+t.id+'">'+(open?'▾':'▸')+'</span>':'<span class="tag-tw" style="visibility:hidden">·</span>')
      +'<span class="tag-dot"></span><span class="tag-name">'+esc(t.name)+'</span><span class="tag-n">'+(st.kp||st.content||'')+'</span></div>'
      +(kids.length&&open?kids.map(k=>row(k,lv+1)).join(''):'');
  };
  return '<div class="tag-tree">'
   +'<div class="tag-row tag-all '+(selected?'':'on')+'" data-act="tagSelect" data-id=""><span class="tag-tw" style="visibility:hidden">·</span><span class="tag-name">全部标签</span><span class="tag-n">'+(S.kps.length)+'</span></div>'
   +tagRoots().map(t=>row(t,1)).join('')
   +'<div class="tag-tree-foot"><button class="link" data-act="tagOpenManage">管理标签</button><button class="link" data-act="tagNewRoot">+ 新建</button></div></div>';
}
function pgTagManage(){
  const sel=UI.sel.tagMgr||'';
  const rows=tagActive().slice().sort((a,b)=>a.path.localeCompare(b.path,'zh'));
  const t=sel?ptagOf(sel):null;
  const off=PTAGS.filter(x=>x.status==='off');
  return '<div class="ph"><h2>标签管理 <span class="hint" style="font-weight:400">标签可以自由建：车上部位、政策口径、卖点、场景都行。知识点和内容共用这套标签。</span></h2><button class="btn" data-act="tagBack">返回</button></div>'
   +srcBar('标签是知识点和内容共用的分类方式。<b>改名</b>不会影响已挂的对象；<b>停用</b>后历史保留，但新筛选不再出现；<b>移动</b>会调整层级。标签树最多 4 级，够覆盖"部位 → 系统 → 卖点 / 政策 → 具体口径"。')
   +'<div class="tag-manage">'
   +'<div class="tag-mgr-tree"><div class="card"><h3>标签树</h3>'+tagTreeHtml(sel,{manage:1})+'<div class="tag-tree-foot"><button class="link" data-act="tagNewRoot">+ 新建根标签</button><button class="link" data-act="tagOpenManage">刷新</button></div></div></div>'
   +'<div class="tag-mgr-main">'
   +(t?'<div class="card"><div class="kp-ph"><h3>「'+esc(t.name)+'」</h3><span class="hint">'+esc(t.path)+'</span></div><dl class="kv sm"><dt>层级</dt><dd>第 '+t.lv+' 级</dd><dt>知识点</dt><dd>'+tagStats(t.id).kp+' 个 · <a class="link" data-act="tagViewKp" data-id="'+t.id+'">去看</a></dd><dt>内容</dt><dd>'+tagStats(t.id).content+' 条 · <a class="link" data-act="tagViewContent" data-id="'+t.id+'">去看</a></dd><dt>状态</dt><dd>'+(t.status==='off'?'<span class="tag">已停用</span>':'<span class="tag ok">启用</span>')+'</dd></dl>'
     +'<div class="tag-ops"><button class="btn sm" data-act="tagRename" data-id="'+t.id+'">改名</button>'
     +'<button class="btn sm" data-act="tagMove" data-id="'+t.id+'">移动</button>'
     +'<button class="btn sm" data-act="tagNewChild" data-id="'+t.id+'">加子标签</button>'
     +(t.status==='off'?'<button class="btn sm" data-act="tagOn" data-id="'+t.id+'">恢复启用</button>':'<button class="btn sm" data-act="tagOff" data-id="'+t.id+'">停用</button>')+'</div></div>':'<div class="card"><h3>先选一个标签</h3><div class="hint">左侧选标签后可以改名、加子标签、移动层级或停用。</div></div>')
   +(typeof aiTagAuditHtml==='function'?aiTagAuditHtml():'')
   +'<div class="card"><h3>新建标签</h3><div class="fgrid"><div class="fld"><label>名称</label><input id="tag_new_name" placeholder="如：政策口径 / 车内冰箱 / 露营"></div><div class="fld"><label>上级标签</label><select id="tag_new_parent"><option value="">无（作为根标签）</option>'+rows.map(x=>'<option value="'+x.id+'">'+'　'.repeat(x.lv-1)+esc(x.name)+'</option>').join('')+'</select></div></div><div style="margin-top:10px"><button class="btn pri" data-act="tagAdd">新建</button> <span class="hint">同一个标签可以同时用于知识点和内容；不需要重复建两套。</span></div></div>'
   +(off.length?'<div class="card"><h3>已停用 <span class="hint">'+off.length+' 个</span></h3>'+off.map(x=>'<div style="padding:5px 0;border-top:1px solid #f2f3f5;display:flex;gap:10px;align-items:center"><span style="flex:1">'+esc(x.path)+'</span><button class="link" data-act="tagOn" data-id="'+x.id+'">恢复</button></div>').join('')+'</div>':'')
   +'</div></div>';
}
A.tagViewKp=el=>{UI.page='catalog';UI.tab.catalog=KP_TAB_LIB;UI.sel.kpf={tag:el.dataset.id};render()};
A.tagViewContent=el=>{UI.page='content';UI.tab.content='全部内容';UI.sel.cadle=true;UI.sel.caf={tag:el.dataset.id};render()};
A.tagOn=el=>{const t=ptagOf(el.dataset.id);t.status='on';toast('已恢复「'+t.name+'」','ok');render()};
function refreshTagPaths(){
  const walk=(t,parentPath)=>{t.path=parentPath?parentPath+'_'+t.name:t.name;tagActive().filter(k=>k.pid===t.id).forEach(k=>walk(k,t.path))};
  tagRoots().forEach(t=>walk(t,''));
}
A.tagSelect=el=>{const id=el.dataset.id||'';if(UI.page==='tagmanage'){UI.sel.tagMgr=id;return render()}if(UI.page==='content'){UI.sel.caf=(UI.sel.caf||{});if(id)UI.sel.caf.tag=id;else delete UI.sel.caf.tag;return render()}UI.sel.kpf=(UI.sel.kpf||{});if(id)UI.sel.kpf.tag=id;else delete UI.sel.kpf.tag;render()};
A.tagToggle=el=>{el.stopPropagation&&el.stopPropagation();const o=UI.sel.tagOpen||(UI.sel.tagOpen={});o[el.dataset.id]=o[el.dataset.id]===false;render()};
A.tagOpenManage=()=>{UI.page='tagmanage';UI.sel.tagMgr='';render()};
A.tagBack=()=>{UI.page=UI.sel.tagBackPage||'catalog';render()};
A.tagNewRoot=()=>{UI.page='tagmanage';UI.sel.tagMgr='';render()};
A.tagAdd=()=>{const n=($('#tag_new_name').value||'').trim();const p=$('#tag_new_parent').value;if(!n)return toast('请填写标签名','err');if(tagActive().some(t=>t.name===n&&t.pid===(p||null)))return toast('同级已有同名标签','err');const id='T'+Math.max(0,...PTAGS.map(t=>+String(t.id).replace(/\D/g,'')||0))+'';const parent=p?ptagOf(p):null;PTAGS.push({id:'T'+(Math.max(0,...PTAGS.map(t=>+String(t.id).replace(/\D/g,'')||0))+1),name:n,pid:p||null,lv:parent?parent.lv+1:1,path:(parent?parent.path+'_':'')+n,status:'on',order:tagSiblings('').length});refreshTagPaths();toast('已新建标签「'+n+'」','ok');render()};
A.tagNewChild=el=>{const p=ptagOf(el.dataset.id);const n=prompt('子标签名称');if(!n)return;if(tagActive().some(t=>t.name===n.trim()&&t.pid===p.id))return toast('同级已有同名标签','err');PTAGS.push({id:'T'+(Math.max(0,...PTAGS.map(t=>+String(t.id).replace(/\D/g,'')||0))+1),name:n.trim(),pid:p.id,lv:p.lv+1,path:p.path+'_'+n.trim(),status:'on',order:tagSiblings(p.id).length});refreshTagPaths();toast('已加子标签','ok');render()};
A.tagRename=el=>{const t=ptagOf(el.dataset.id);const n=prompt('标签新名称',t.name);if(!n||!n.trim())return;t.name=n.trim();refreshTagPaths();toast('已改名','ok');render()};
A.tagOff=el=>{const t=ptagOf(el.dataset.id);const n=S.kps.filter(k=>(k.tags||[]).includes(t.id)).length;if(!confirm('停用「'+t.name+'」？已挂的 '+n+' 个知识点保留历史，但新筛选里不再出现。'))return;t.status='off';toast('已停用','ok');render()};
A.tagMove=el=>{const t=ptagOf(el.dataset.id);const opts=tagActive().filter(x=>x.id!==t.id&&!ptagDesc(t.id).includes(x.id));const pid=prompt('移动到哪个上级标签ID？（留空=根标签）\n'+opts.map(x=>x.id+' '+x.path).join('\n'),t.pid||'');if(pid===null)return;const p=pid?ptagOf(pid):null;if(pid&&!p)return toast('找不到上级标签','err');t.pid=p?p.id:null;t.lv=p?p.lv+1:1;refreshTagPaths();toast('已移动','ok');render()};
A.tagPickAdd=el=>{const field=el.dataset.field;const sel=el.parentNode.querySelector('.tag-pick-sel');const id=sel&&sel.value;if(!id)return;if(field==='kfTag'){if(!KF.tags.includes(id))KF.tags.push(id);render()}if(field==='ctag'){if(!C.tags.includes(id))C.tags.push(id);render()}};
A.tagPickDel=el=>{const field=el.dataset.field;if(field==='kfTag'){KF.tags=KF.tags.filter(x=>x!==el.dataset.v);render()}if(field==='ctag'){C.tags=C.tags.filter(x=>x!==el.dataset.v);render()}};
