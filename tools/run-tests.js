#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const entry = Object.prototype.hasOwnProperty.call(process.env, 'SHOT') ? process.env.SHOT : path.join(root, 'tests', 'shot.py');
const testsDir = path.join(root, 'tests');
const desired = process.argv.slice(2);
const DEFAULT_ORDER = [
  't17a', 't17b', 't18a', 't18b', 't192', 't193',
  't19a', 't19b', 't20a', 't20b', 't20c', 't21a',
  't22a', 't23a', 't23b', 't23c', 't24a', 't24b', 't24c', 't24d', 't25a', 't25b', 't25c', 't25d', 't26a', 't27a', 't27b', 't27c', 't27d', 't27e', 't27f', 't27g', 't27h', 't27i', 't27j', 't27k', 't27l', 't27m', 't27n', 't27o', 't27p', 't27q', 't27r', 't28a', 't28b', 't28c', 't28d', 't28e', 't29a', 't29b', 't29c', 't29e', 't30a', 't30b', 't31a', 't31b', 't32a', 't33a', 't33b', 't34a', 't34b', 't34c', 't34d', 't34e', 't35a', 't36a', 't36b', 't36c', 't36d', 't37a', 't37b', 't38a', 't39a', 't39b', 't39c', 't40a', 't41a', 't42a'
];
const available = new Set(fs.readdirSync(testsDir)
  .filter(name => /^t\d+[a-z]?\.js$/.test(name))
  .map(name => name.replace(/\.js$/, '')));
const tests = desired.length ? desired : DEFAULT_ORDER.filter(name => available.has(name));
if (!fs.existsSync(entry)) {
  console.error(`找不到测试入口 ${entry}。可设置 SHOT=/path/to/shot.py python3 或直接 npm test。`);
  process.exit(1);
}

const python = process.env.PYTHON || 'python3';
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const isRoot = typeof process.getuid === 'function' && process.getuid() === 0;
const extraFlags = (process.env.CHROME_FLAGS || (isRoot ? '--no-sandbox' : '')).trim();
const outDir = path.join(root, 'test-results');
fs.mkdirSync(outDir, { recursive: true });

let failed = 0;
console.log(`运行 ${tests.length} 组测试，页面: src/index.html\n`);

for (const name of tests) {
  const script = path.join(testsDir, `${name}.js`);
  if (!fs.existsSync(script)) {
    console.error(`SKIP ${name}: 缺少 ${script}`);
    failed++;
    continue;
  }
  const started = Date.now();
  const run = spawnSync(python, [entry, 'probe', path.join(root, 'src', 'index.html'), '--js', fs.readFileSync(script, 'utf8')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, CHROME: chrome, CHROME_FLAGS: extraFlags }
  });
  const output = (run.stdout || '').trim();
  fs.writeFileSync(path.join(outDir, `${name}.txt`), output + '\n', 'utf8');
  if (run.stderr) fs.writeFileSync(path.join(outDir, `${name}.stderr.txt`), run.stderr, 'utf8');

  const bad = output.split('\n').filter(line => /FAIL|ERR|NO RESULT|CHROME_EXIT/.test(line));
  const count = output ? output.split('\n').length : 0;
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  if (run.status !== 0 || bad.length || !output) {
    failed++;
    console.error(`FAIL ${name} (${count} 行, ${seconds}s)`);
    bad.slice(0, 12).forEach(line => console.error(`  ${line}`));
    if (run.stderr.trim()) console.error(`  ${run.stderr.trim().split('\n').slice(-1)[0]}`);
  } else {
    console.log(`PASS ${name} (${count} 行, ${seconds}s)`);
  }
}

console.log(`\n结果: ${tests.length - failed}/${tests.length} 通过，明细在 test-results/。`);
process.exit(failed ? 1 : 0);
