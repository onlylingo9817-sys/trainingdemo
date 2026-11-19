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
  scripts/            31 个脚本，按 index.html 顺序执行
tests/                交互回归探针（按 tools/run-tests.js 的清单执行）
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

`npm test` 会按 `tools/run-tests.js` 里的清单依次运行全部探针，输出保存到 `test-results/`。需要本机 Chrome；若 Chrome 不在默认路径：

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

构建命令会自动做一次完整性校验（`npm run verify:single`）：确认 CSS/JS 已全部内联、无外部资源引用。单文件约 1.1 MB，纯离线可运行，双击即可体验，不需要启动服务。

## 数据与边界

- 真实作答会写入证据流；掌握度、就绪度、错题与调优页面共用同一套派生数据。
- 所有个人级行为、语料与业务结果均为模拟值，界面有「模拟数据」标识。
- 演练评分仍是关键词规则，尚不是真实 AI；外部系统接口均未对接。
- 更完整的产品决策、验证范围与未完成项见 `docs/HANDOFF-v23.md`。


## 本地开发与测试

```bash
npm run dev        # 启动 http://127.0.0.1:4173/
npm run check      # 语法 / 脚本顺序 / 启动链
npm test           # 全量页面探针测试（当前 67 组）
```

- 源码入口：`src/index.html`。不要重新合并回单文件；`npm run build` 只用于对外分享。
- 当前知识点页签为 3 个：总览 / 知识点库 / 候选；题目与演练统一在「内容中心」维护，批量导入与新车克隆在页头抽屉，清河迁移在「配置中心 → 数据源」。
- 当前效果追踪页签：总部 5 个（效果总览 / 人员就绪度 / 错题集 / 效果报告 / 调优与结项）、区域老师 4 个、老板 4 个；旧页签名（含「效果看板」）做了兼容映射。项目级效果在「学习项目详情 → 效果」页签内，结项决策也在那里。
- 交互与业务决策：`docs/HANDOFF-v23.md`。改业务规则前先读第 17 节与第 22–23 节。
- 功能清单（按端拆分、带编号，用于对外说明能力范围）：`docs/FEATURE-LIST.md`；飞书版 https://www.feishu.cn/docx/OkYcdmcVdo8GRXx4eKicobQ2nkf 。
- 课程样例：`assets/cemn_course.md`（CEMN 讲师手册清洗稿），可直接在「内容中心 → 导入」上传/粘贴正文。
- AI 建议是规则模拟，不是真实模型；只建议、不自动写入，采纳/忽略有留痕。替换推荐函数即可接真实模型。
- 评审灰度在 `src/scripts/review_gray.js`，有两种方式：**先评审后定稿 / 入库**（gate）和**异步评审**（async，不阻塞定稿 / 上架 / 入库，结论事后回流为待办）。规则命中默认只「建议」评审，可在「配置中心 → 业务规则」改成「强制」。评审团成员没法登录时，发起人可「代录意见」（注明渠道）；销冠在零售通手机端投票。它与学习项目里「定稿后给学员分批下发」的学员灰度（`l_gray.js`）是两件事。
- 「区域老师能否结项 / 回炉是否需总部确认 / 对照批能否干预」三项业务尚未拍板，做成「配置中心 → 业务规则」的可选项，默认取最保守档，改配置即生效。
- 配置中心 12 个页签按职责分 4 组（培训项目 / 能力与评价 / 内容与知识点 / 系统），页签值不变。
