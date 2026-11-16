#!/usr/bin/env python3
"""Screenshot / probe an HTML page with headless Chrome. Injects JS after load, optional CSS.
Screenshot:  shot.py shot  src/index.html out.png --js "go('p1')" [--css ".bar{display:none!important}"] [--width 1280] [--height 900] [--fit SELECTOR]
Probe:       shot.py probe src/index.html --js "out.push(document.title)"   # JS pushes strings into the array `out`; they are printed
--fit SELECTOR : window height = bottom of the first visible SELECTOR (+14px); open dialogs: use --height instead.
Chrome path: env CHROME or the macOS default. Extra flags: env CHROME_FLAGS (space-separated).
The input is copied to a temp file with the probe injected, so relative CSS/JS keep working."""
import sys, os, re, json, subprocess, argparse, tempfile, shutil

CHROME = os.environ.get('CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
CHROME_FLAGS = os.environ.get('CHROME_FLAGS', '').split()

def build(src, js, css, fit):
    src = os.path.abspath(src)
    s = open(src, encoding='utf-8').read()
    fitjs = ('(document.querySelector(%s)||document.body).getBoundingClientRect().bottom' % json.dumps(fit)) if fit else '0'
    inj = ('<style>%s #__H{display:none!important}</style><script>window.addEventListener("load",function(){setTimeout(function(){'
           'var out=[];window.onerror=function(m){out.push("JSERR "+m)};try{%s}catch(e){out.push("ERR "+e.message)};'
           'setTimeout(function(){var p=document.createElement("pre");p.id="__H";'
           'p.textContent=JSON.stringify({h:%s,out:out});document.body.appendChild(p)},150)},200)})</script>') % (css or '', js or '', fitjs)
    i = s.rindex('</body>')
    has_ext = bool(re.search(r'<(?:script[^>]+src|link[^>]+href)=', s))
    if has_ext:
        site = os.path.join(tempfile.mkdtemp(prefix='_demo_site_'), 'site')
        shutil.copytree(os.path.dirname(src), site)
        f = os.path.join(site, os.path.basename(src))
        open(f, 'w', encoding='utf-8').write(s[:i] + inj + s[i:])
    else:
        f = os.path.join(tempfile.gettempdir(), '_demo_shot.html')
        open(f, 'w', encoding='utf-8').write(s[:i] + inj + s[i:])
    return f

def chrome(args):
    cp = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars',
                         '--allow-file-access-from-files', '--force-device-scale-factor=1'] + CHROME_FLAGS + args,
                        capture_output=True, text=True)
    if cp.returncode != 0:
        err = (cp.stderr or '').strip().splitlines()
        print('CHROME_EXIT %d%s' % (cp.returncode, (' | ' + err[-1]) if err else ''), file=sys.stderr)
    return cp.stdout

def dump(f, w, h=2000):
    d = chrome(['--window-size=%d,%d' % (w, h), '--virtual-time-budget=4000', '--dump-dom', 'file://' + f])
    m = re.search(r'<pre id="__H">(.*?)</pre>', d, re.S)
    return json.loads(m.group(1).replace('&quot;', '"').replace('&lt;', '<').replace('&gt;', '>')) if m else {'h': 0, 'out': ['NO RESULT']}

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('mode', choices=['shot', 'probe'])
    ap.add_argument('html'); ap.add_argument('out', nargs='?')
    ap.add_argument('--js', default=''); ap.add_argument('--css', default='')
    ap.add_argument('--width', type=int, default=1280); ap.add_argument('--height', type=int)
    ap.add_argument('--fit', default='')
    a = ap.parse_args()
    f = build(a.html, a.js, a.css, a.fit)
    if a.mode == 'probe':
        print('\n'.join(dump(f, a.width)['out']))
    else:
        h = a.height
        if not h:
            info = dump(f, a.width)
            for l in info['out']:
                if l.startswith(('ERR', 'JSERR')): print(l)
            h = int(info['h']) + 14 if info['h'] else 900
        chrome(['--window-size=%d,%d' % (a.width, h), '--virtual-time-budget=4000', '--screenshot=' + a.out, 'file://' + f])
        print(a.out, os.path.getsize(a.out), 'h=%d' % h)
