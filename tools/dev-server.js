#!/usr/bin/env node
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const root = path.resolve(__dirname, '..', 'src');
const args = process.argv.slice(2);
function cliArg(name) {
  const index = args.indexOf(name);
  if (index >= 0) {
    const value = args[index + 1];
    return value && !value.startsWith('--') ? value : '';
  }
  const pair = args.find(arg => arg.startsWith(name + '='));
  return pair ? pair.slice(name.length + 1) : undefined;
}
const hostArg = cliArg('--host');
const portArg = cliArg('--port');
const host = hostArg === '' ? '0.0.0.0' : (hostArg || process.env.HOST || '127.0.0.1');
const port = Number(portArg || process.env.PORT || 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`无效端口: ${portArg || process.env.PORT}`);
  process.exit(1);
}
const open = process.env.OPEN !== '0' && !args.includes('--no-open');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headers
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return send(res, 400, 'Bad Request');
  }

  const target = path.resolve(root, '.' + pathname);
  if (target !== root && !target.startsWith(root + path.sep)) {
    return send(res, 403, 'Forbidden');
  }

  let file = target;
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  } catch {
    return send(res, 404, 'Not Found');
  }

  let stat;
  try {
    stat = fs.statSync(file);
  } catch {
    return send(res, 404, 'Not Found');
  }

  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Content-Length': stat.size,
    'Cache-Control': 'no-store'
  });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).pipe(res);
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${port} 已被占用，请用 PORT=4174 npm run dev 换一个端口。`);
  } else {
    console.error(err.message);
  }
  process.exit(1);
});

server.listen(port, host, () => {
  const url = `http://${host}:${port}/`;
  console.log(`培训 Demo 已启动: ${url}`);
  console.log('修改 src/ 下文件后刷新浏览器即可，无需打包。');
  if (open) {
    const command = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    const child = spawn(command, [url], { stdio: 'ignore', detached: true, shell: process.platform === 'win32' });
    child.on('error', () => {});
    child.unref();
  }
});
