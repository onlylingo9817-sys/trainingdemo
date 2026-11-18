#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const file=path.join(root,'dist','培训全链路闭环_Demo.html');
if(!fs.existsSync(file)){console.error('缺少 dist 产物，请先 npm run build');process.exit(1)}
const html=fs.readFileSync(file,'utf8');
const errs=[];
const styles=(html.match(/<style>/g)||[]).length;
const scripts=(html.match(/<script>/g)||[]).length;
if(styles<2)errs.push('CSS 未内联（style 标签数 '+styles+'）');
if(scripts<25)errs.push('JS 未完整内联（script 标签数 '+scripts+'）');
if(/<link[^>]+stylesheet/.test(html))errs.push('仍存在外部样式表引用');
if(/<script[^>]+src="scripts\//.test(html))errs.push('仍存在外部脚本引用');
if(errs.length){console.error('单文件校验失败：\n- '+errs.join('\n- '));process.exit(1)}
console.log('单文件校验通过：'+styles+' 个内联样式块、'+scripts+' 个内联脚本、'+(fs.statSync(file).size/1024).toFixed(0)+' KB');
