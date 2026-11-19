#!/usr/bin/env python3
"""按功能编号批量导出原型截图。

用法: npm run screens    (等价于 python3 tools/export-screens.py)

清单在 SHOTS 里: 每条含功能编号 id、进入该页面的 js、可选 height。
PC 按 1280 宽整页导出,移动端按 460 宽(手机框 375)导出。
输出到 docs/screens/<编号>.png。
"""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'docs', 'screens')

PC_CSS = ".topbar,.menu,#dock-root,.gd{display:none!important}#pc{height:auto!important;min-height:0!important;display:block!important}.content{height:auto!important;overflow:visible!important;padding:20px 28px 40px!important}.content>*{max-width:none!important}"
RN_CSS = ".topbar,.menu,.gd,#pc{display:none!important}#rn{height:auto!important;overflow:visible!important;padding:12px!important;display:flex!important;justify-content:center!important;box-sizing:border-box!important;width:100%!important}body{overflow:visible!important;width:auto!important}html{width:auto!important}.phone{height:auto!important;max-height:none!important;width:375px!important;max-width:100%!important;margin:0 auto!important;border-width:0!important;border-radius:0!important;box-shadow:none!important}.sb,.scr{position:static!important;height:auto!important;overflow:visible!important;top:auto!important;bottom:auto!important}.rn-side{display:none!important}"

def pc(fid, js, extra=None, fit="#main .content, #main"):
    o={"id":fid,"html":"src/index.html","profile":"pc","js":"A.reset();A.roleSwitch({value:'hq'});closeDlg();"+js,"css":PC_CSS,"fit":".content"}
    if extra: o["height"]=extra
    return o

shots = []
# 工作台 / 发现问题
shots.append(pc("P-01","UI.page='workbench';render()"))
shots.append(pc("P-02","UI.page='workbench';render();A.aiOpen&&A.aiOpen({dataset:{}})"))
shots.append(pc("P-03","UI.page='workbench';UI.gdOpen=true;render();gdRender()"))
shots.append(pc("P-04","UI.page='topics';render()"))
shots.append(pc("P-05","UI.tid=S.topics[0].id;UI.page='topic';render()"))
# 内容
shots.append(pc("P-06","UI.page='content';UI.tab.content='全部内容';render()"))
shots.append(pc("P-07","UI.page='content';UI.tab.content='全部内容';UI.sel.cadv=true;render()"))
shots.append(pc("P-08","UI.cid='N10';UI.ctab='内容';UI.page='cdetail';render()"))
shots.append(pc("P-09","UI.cid='N10';UI.ctab='内容';UI.page='cdetail';render();A.cEdit({dataset:{id:'N10'}})"))
shots.append(pc("P-10","UI.page='content';UI.tab.content='全部内容';render();A.cReview({dataset:{id:'N7'}})","#dlg",900))
shots.append(pc("P-11","UI.page='content';UI.tab.content='导入';render()"))
shots.append(pc("P-12","UI.cid='N10';UI.ctab='版本';UI.page='cdetail';render()"))
shots.append(pc("P-13","UI.cid='N10';UI.ctab='使用与反馈';UI.page='cdetail';render()"))
shots.append(pc("P-14","UI.cid='N10';UI.ctab='内容';UI.page='cdetail';render();A.cCopy({dataset:{id:'N10'}})"))
shots.append(pc("P-15","UI.page='publish';render()"))
# 知识点
shots.append(pc("P-16","UI.page='catalog';UI.tab.catalog='总览';render()"))
shots.append(pc("P-17","UI.page='catalog';UI.tab.catalog='知识点库';render()"))
shots.append(pc("P-18","UI.kid='K3';UI.page='kp';render()"))
shots.append(pc("P-19","UI.page='catalog';UI.tab.catalog='知识点库';render();A.kpNew()"))
shots.append(pc("P-20","UI.page='catalog';UI.tab.catalog='候选';render()"))
shots.append(pc("P-21","UI.page='catalog';UI.tab.catalog='总览';UI.sel.kgView='focus';UI.sel.kgSkill='K3';render()"))
shots.append(pc("P-22","UI.page='config';UI.tab.config='标签管理';render()"))
# 组织培训
shots.append(pc("P-23","UI.page='projects';render()"))
shots.append(pc("P-24","UI.projId='P9';UI.ptab='概览';UI.page='detail';render()"))
shots.append(pc("P-25","UI.page='form';render()"))
shots.append(pc("P-26","UI.page='approvals';render()"))
shots.append(pc("P-27","UI.page='coach';render()"))
shots.append(pc("P-28","UI.page='people';render()"))
# 看效果
shots.append(pc("P-29","UI.page='effect';UI.tab.effect='效果总览';render()"))
shots.append(pc("P-30","UI.page='effect';UI.tab.effect='人员就绪度';render()"))
shots.append(pc("P-31","UI.page='effect';UI.tab.effect='错题集';render()"))
shots.append(pc("P-32","UI.page='effect';UI.tab.effect='效果报告';render()"))
shots.append(pc("P-33","UI.page='effect';UI.tab.effect='调优与结项';render()"))
shots.append(pc("P-34","UI.projId='P5';UI.ptab='效果';UI.page='detail';render()"))
# 配置
shots.append(pc("P-35","UI.page='config';UI.tab.config='指标库';render()"))
shots.append(pc("P-36","UI.page='config';UI.tab.config='培训类型默认值';render()"))
shots.append(pc("P-37","UI.page='config';UI.tab.config='阈值与口径';render()"))
shots.append(pc("P-38","UI.page='config';UI.tab.config='业务规则';render()"))
shots.append(pc("P-39","UI.page='config';UI.tab.config='维度体系';render()"))
shots.append(pc("P-40","UI.page='config';UI.tab.config='评审灰度';render()"))
shots.append(pc("P-41","UI.page='config';UI.tab.config='数据源';render()"))
shots.append(pc("P-42","UI.page='workbench';render();A.bell&&A.bell({dataset:{}})","#dlg",800))
shots.append(pc("P-43","UI.page='projects';render();document.querySelector('#howto').click()"))
# 评审
shots.append(pc("P-44","UI.cid='N10';UI.ctab='内容';UI.page='cdetail';render();rvStartDlg('content','N10','async')","#dlg",900))
shots.append(pc("P-45","UI.cid='N10';UI.ctab='内容';UI.page='cdetail';render();rvStartDlg('content','N10','async');A.rvStartOk({dataset:{k:'content',id:'N10'}})"))
shots.append(pc("P-46","UI.cid='N10';UI.ctab='内容';UI.page='cdetail';render();rvStartDlg('content','N10','async');A.rvStartOk({dataset:{k:'content',id:'N10'}});A.rvWithdraw({dataset:{id:rvActive('content','N10').id}});rvStartDlg('content','N10','async');A.rvStartOk({dataset:{k:'content',id:'N10'}})"))
shots.append(pc("P-47","UI.cid='N10';UI.ctab='内容';UI.page='cdetail';render();rvStartDlg('content','N10','async');A.rvStartOk({dataset:{k:'content',id:'N10'}});UI.cid='N10';UI.ctab='内容';UI.page='cdetail';render();rvProxyDlg(rvActive('content','N10').id)"))
shots.append(pc("P-48","UI.page='catalog';UI.tab.catalog='知识点库';render();rvStartDlg('kpx','K3','async');A.rvStartOk({dataset:{k:'kpx',id:'K3'}});UI.page='catalog';UI.tab.catalog='知识点库';render()"))
shots.append(pc("P-49","UI.cid='N10';UI.ctab='内容';UI.page='cdetail';render();rvStartDlg('content','N10','async');A.rvStartOk({dataset:{k:'content',id:'N10'}});rvFinishAsync(rvActive('content','N10'),false,'系统','测试');UI.page='cdetail';UI.ctab='内容';render()"))

# 移动端
def rn(fid, js, extra=None, crop=None):
    o={"id":fid,"html":"src/index.html","profile":"mobile","js":"A.reset();A.roleSwitch({value:'hq'});closeDlg();document.querySelector('#bRn').click();"+js,"css":RN_CSS,"fit":".phone"}
    if extra: o["height"]=extra
    if crop: o["crop"]=crop
    return o
shots += [
 rn("A-01","ME=PEOPLE.find(x=>x.name.includes('钱多多'));R.stack=[];R.page='school';renderRN()"),
 rn("A-02","ME=PEOPLE.find(x=>x.name.includes('钱多多'));R.page='trainDetail';R.pid='P2';renderRN()"),
 rn("A-03","ME=PEOPLE.find(x=>x.name.includes('钱多多'));R.page='learn';renderRN()"),
 rn("A-04","ME=PEOPLE.find(x=>x.name.includes('钱多多'));R.page='quiz';qzStart('practice',kp('K3'),qsOf('K3','已定稿').slice(0,3).map(q=>q.id));renderRN()"),
 rn("A-05","ME=PEOPLE.find(x=>x.name.includes('钱多多'));R.page='drill';dzStart((S.drills.find(d=>drUsable(d))||{}).id);renderRN()"),
 rn("A-06","ME=PEOPLE.find(x=>x.name.includes('钱多多'));R.page='adapt';renderRN()"),
 rn("A-07","ME=PEOPLE.find(x=>x.mid==='2024118');R.page='pack';R.pid='PK1';renderRN()"),
 rn("A-08","ME=PEOPLE.find(x=>x.name.includes('钱多多'));R.page='mis';renderRN()"),
 rn("A-09","ME=PEOPLE.find(x=>x.name.includes('钱多多'));rvStartDlg('content','N10','async');document.querySelectorAll('.rvj').forEach(x=>x.checked=true);const m=[...document.querySelectorAll('.rvj')].find(x=>x.value===ME.mid)||document.querySelector('.rvj');if(m)m.checked=true;A.rvStartOk({dataset:{k:'content',id:'N10'}});R.stack=[];R.page='rv';R.rvId=rvMine()[0].id;renderRN()"),
 rn("A-10","ME=PEOPLE.find(x=>x.name.includes('钱多多'));R.page='school';renderRN()", crop=620),
]

def main():
    os.makedirs(OUT, exist_ok=True)
    fails = []
    for s in shots:
        width = '1280' if s['profile'] == 'pc' else '460'
        out = os.path.join(OUT, s['id'] + '.png')
        cmd = [sys.executable, os.path.join(ROOT, 'tests', 'shot.py'), 'shot',
               os.path.join(ROOT, 'src', 'index.html'), out,
               '--js', s['js'], '--css', s['css'], '--width', width, '--fit', s['fit']]
        if s.get('height'):
            cmd += ['--height', str(s['height'])]
        r = subprocess.run(cmd, capture_output=True, text=True, cwd=ROOT)
        text = (r.stdout or '').strip()
        ok = 'ERR' not in text and os.path.exists(out) and os.path.getsize(out) > 20000
        print(('FAIL' if ok is False else 'ok  '), s['id'], text.splitlines()[-1][-60:] if text else '')
        if s.get('crop'):
            from PIL import Image
            im = Image.open(out); w, h = im.size
            im.crop((0, 0, w, min(h, s['crop']))).save(out)
        if not ok:
            fails.append(s['id'])
    print('FAILED:', fails or '无')
    return 1 if fails else 0

if __name__ == '__main__':
    sys.exit(main())
