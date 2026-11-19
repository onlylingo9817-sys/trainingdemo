#!/bin/bash
# 双击启动培训 Demo，并自动打开浏览器。关闭此窗口即停止服务。
cd "$(dirname "$0")" || exit 1
PORT="${PORT:-4173}"
export PORT
(sleep 1.5 && open "http://127.0.0.1:${PORT}/") &
npm run dev
