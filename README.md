# 培训全链路闭环 Demo

PC「学堂后台」+ 零售通手机端的交互 Demo，演示 **课题 → 内容 → 学习项目 → 效果追踪** 全链路。

当前页面基于 v23 理想态模型，数据为确定性模拟数据，仅供交互演示，不代表真实业务效果。

## 本地开发

需要 Node.js 18+。项目没有第三方依赖，不需要 `npm install`。

```bash
npm run dev
```

默认打开 `http://127.0.0.1:4173/`。修改 `src/` 下的 CSS / JS 后刷新浏览器即可，不再需要拼接单文件。端口被占用时：

```bash
PORT=4174 npm run dev
```

## 目录

```text
src/
  index.html          页面骨架，按顺序加载脚本
  styles/app.css      v23 既有样式
  styles/v23.css      v23 新增页面样式
  scripts/            26 个脚本，按 index.html 顺序执行
tests/                原有 16 组交互探针
tools/dev-server.js   零依赖开发服务器
tools/build-single-file.js  可选单文件导出
tools/run-tests.js    批量回归测试
docs/HANDOFF-v23.md   产品决策、历史改造与踩坑记录
assets/spin_raw.txt   SPIN 话术清洗稿
```

脚本顺序在 `src/index.html` 中显式声明，顺序有意义：后面的文件依赖前面建立的全局变量。新增模块时把文件放进 `src/scripts/`，并在启动脚本之前插入加载标签。

## 检查与测试

```bash
npm run check
npm test
```

`npm test` 会依次运行 `tests/t23a.js` 及其余 15 组探针，输出保存到 `test-results/`。需要本机 Chrome；若 Chrome 不在默认路径：

```bash
CHROME=/path/to/chrome npm test
```

在 root / 容器环境中通常还需要：

```bash
CHROME_FLAGS='--no-sandbox --disable-dev-shm-usage' npm test
```

## 导出单文件（可选）

给不方便启动服务的人体验时：

```bash
npm run build
```

生成 `dist/培训全链路闭环_Demo.html`，可以直接双击打开。日常开发不需要这一步。

## 数据与边界

- 真实作答会写入证据流；掌握度、就绪度、错题与调优页面共用同一套派生数据。
- 所有个人级行为、语料与业务结果均为模拟值，界面有「模拟数据」标识。
- 演练评分仍是关键词规则，尚不是真实 AI；外部系统接口均未对接。
- 更完整的产品决策、验证范围与未完成项见 `docs/HANDOFF-v23.md`。
