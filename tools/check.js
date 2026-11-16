#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const index = path.join(src, 'index.html');
const failures = [];
const seenScripts = [];

function fail(message) {
  failures.push(message);
}

const html = fs.readFileSync(index, 'utf8');

if (!/<!DOCTYPE html>/i.test(html)) fail('index.html 缺少 DOCTYPE');
for (const match of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) {
  seenScripts.push(match[1]);
  if (!fs.existsSync(path.join(src, match[1]))) fail(`缺少脚本: ${match[1]}`);
}
for (const match of html.matchAll(/<link\b[^>]*\bhref="([^"]+)"/g)) {
  if (!fs.existsSync(path.join(src, match[1]))) fail(`缺少样式: ${match[1]}`);
}
if (!seenScripts.length) fail('index.html 没有加载任何脚本');

const scriptsDir = path.join(src, 'scripts');
const allScripts = fs.readdirSync(scriptsDir).filter(name => name.endsWith('.js')).sort();
const unloaded = allScripts.filter(name => !seenScripts.includes(`scripts/${name}`));
if (unloaded.length) fail(`scripts/ 下未加载的脚本: ${unloaded.join(', ')}`);

for (const name of seenScripts.filter(name => name.endsWith('.js'))) {
  const file = path.join(src, name);
  if (!fs.existsSync(file)) continue;
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (err) {
    fail(`语法错误 ${name}: ${String(err.stderr || err.message).trim().split('\n')[0]}`);
  }
}

const combined = seenScripts.map(name => fs.readFileSync(path.join(src, name), 'utf8')).join('\n');
if (!/reset\(\);seedDemo\(\);renderBell\(\);render\(\);/.test(combined)) {
  fail('脚本中没有找到启动链 reset();seedDemo();renderBell();render();');
}

if (failures.length) {
  console.error(`检查失败 (${failures.length})`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`检查通过: ${seenScripts.length} 个脚本已按顺序加载，语法与启动链正常。`);
