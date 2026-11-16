#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const outDir = path.join(root, 'dist');
const html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');

const escape = value => value.replace(/<\/script/gi, '<\\/script');
const js = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"><\/script>/g)]
  .map(match => `<script>\n${escape(fs.readFileSync(path.join(src, match[1]), 'utf8')).trim()}\n</script>`);
const css = [...html.matchAll(/<link\b[^>]*\bhref="([^"]+)"><\/link>/g)]
  .map(match => `<style>\n${fs.readFileSync(path.join(src, match[1]), 'utf8').trim()}\n</style>`);

let output = html.replace(/<script\b[^>]*\bsrc="[^"]+"><\/script>\n?/g, '');
output = output.replace(/<link\b[^>]*\bhref="[^"]+"><\/link>\n?/g, '');
output = output.replace('</head>', css.join('\n') + '\n</head>');
output = output.replace('</body>', js.join('\n') + '\n</body>');

fs.mkdirSync(outDir, { recursive: true });
const target = path.join(outDir, '培训全链路闭环_Demo.html');
fs.writeFileSync(target, output, 'utf8');
console.log(`${target}  ${(fs.statSync(target).size / 1024).toFixed(0)} KB`);
