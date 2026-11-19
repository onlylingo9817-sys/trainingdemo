# 交接说明 · 给下一个接手的 Agent

> 最后核对时间：2026-11-19
> 仓库：`/Users/mi/Documents/ChatGPT/traningdemo`
> 远端：`https://github.com/onlylingo9817-sys/trainingdemo`（分支 `main`）

---

## 1. 三十秒上手

```bash
cd /Users/mi/Documents/ChatGPT/traningdemo
npm run dev      # http://127.0.0.1:4173/
```

纯前端 Demo，**无构建、无第三方依赖**，`src/index.html` 直接加载 `src/scripts/*.js` 和 `src/styles/*.css`。改了源码刷新浏览器即可，不需要重启服务。

也可以双击仓库根目录的 `启动Demo.command`。

---

## 2. 常用命令

| 命令 | 作用 | 备注 |
|---|---|---|
| `npm run dev` | 起本地服务，端口 4173 | 端口占用用 `PORT=4174 npm run dev` |
| `npm run check` | 语法 + 脚本顺序 + 启动链 | 约 2 秒，改完必跑 |
| `npm test` | 全量回归 76 组（无头 Chrome 跑真实页面） | 约 2 分钟；需要本机 Chrome |
| `npm test -- t39a` | 只跑某一组 | 结果写到 `test-results/<组名>.txt` |
| `npm run screens` | 按功能编号导出 59 张原型截图 | 输出到 `docs/screens/`，已 gitignore |
| `npm run build` | 打成单文件 HTML 分享用 | 输出 `dist/`，已 gitignore，不提交 |

跑测试时如报 Chrome 权限问题，用：
`CHROME_FLAGS='--no-sandbox --disable-dev-shm-usage' npm test`

---

## 3. 当前 git 状态（重要）

- 已提交并推送：`main` = `6d0c51e`，和 `origin/main` 一致。
- **工作区有未提交改动**（2026-11-19 13:50–16:16 产生，不是上个 agent 做的）：
  - 修改 19 个文件，新增 `tests/t36b/t36c/t36d/t37b/t39b/t39c/t40a.js`。
  - 主题看起来是「学习包模板」相关（`t40a` 测的是 `S.packTpl`、`pkTplNew`、`pkTplEdit`）。
  - `a_core.js` 里把 `const today='2026-11-09'` 改成了 `let today=(window.__DEMO_TODAY||'2026-11-09')`，即可注入演示日期。
  - `kp-hub/` 是个无关产物（`.kanva.pptd` + 一页 `.page`），看起来是别的工具生成的，**建议不要入库**。
- `tools/run-tests.js` 的默认清单已含 76 组（含新增的 7 个），这批改动看起来是配套的，但还没跑过全量。
- 工作区改动尚未验证是否全绿，**不要默认它们是好的**，先跑一遍再说。

---

## 4. 代码结构

31 个脚本按固定顺序加载，顺序有意义（后面的会覆盖前面的同名定义）。

| 文件 | 职责 |
|---|---|
| `a_core.js` | 全局状态 `S` / `UI`、`render()`、弹窗、存档、角色权限表 |
| `b_pc1.js` | 左侧菜单、顶栏、页面路由 |
| `k_content.js` | 内容列表 / 详情 / 审核流转 |
| `k2_edit.js`、`k3_import.js` | 内容编辑、导入 |
| `o_catalog.js`、`u_product.js` | 知识点（后者覆盖前者的部分函数，见第 5 节） |
| `review_gray.js` | 评审引擎 + 卡片 + 配置页（本轮新增） |
| `s_workbench.js` | 工作台、内容中心的实际列表渲染 |
| `v23_pages.js` | v23 数据说明、部分知识点展示函数 |
| `f_rn.js`、`w_rn_extra.js` | 零售通（移动端） |
| `e_pc4.js`、`d_pc3.js` | 配置中心、学习项目 |

数据全在内存 + `localStorage`，存档字段见 `a_core.js` 的 `LS_FIELDS`，带 schema 版本号。

---

## 5. 必须知道的坑（都是真踩过的）

### 5.1 后加载脚本覆盖先加载脚本
改一个函数没生效，八成是它被后面的脚本覆盖了。本轮清掉了 9 个重复定义，**还剩 1 个**：`A.tRetry`（`g_topic2.js:64` 与 `g_topic3.js:62`）。

判断方法：在 `src/index.html` 里看两个文件的先后，靠后的生效。

`npm run check` **不检测重复定义**，所以它通过不代表没覆盖问题。

### 5.2 CSS 类名冲突
`app.css:383` 有 SPIN 评分用的 `.rv{display:flex}`、`.rv span{width:84px}`、`.st{font-size:22px}`。

评审相关样式**一律用 `rvx` 前缀**（`.rvx`、`.rvx-hd`、`.rvx-bar`…）。本轮第一版用了 `.rv`，评审卡直接被压成一行，测试全绿也发现不了。

### 5.3 测试看不到布局
`npm test` 断言的是 DOM 文本和结构，**看不出排版塌陷、元素被裁、弹窗没弹出来**。

改完 UI 一定要截图看一眼：
```bash
python3 tests/shot.py shot src/index.html /tmp/x.png --js "A.reset();A.roleSwitch({value:'hq'});UI.page='content';render()" --width 1280 --fit ".content"
```

截图前注意：
- `.content` 是滚动容器，要加 `--css "#pc{height:auto!important;display:block!important}.content{height:auto!important;overflow:visible!important}"` 才能整页出图。
- 弹窗有 0.15s 淡入动画，截图容易抢跑；需要 `--height` 固定视口，并给 `.mask` 加 `.show`。
- 零售通模式要 `document.querySelector('#bRn').click()`，且 `#pc` 会自动隐藏。

### 5.4 页签旧值兼容
改页签数组时要同时改：`tabs` 数组、`UI.tab[...]` 赋值点、测试里的字符串，并保留旧值别名，否则旧链接会落到空白页。

血泪案例：内容详情提交审核后跳到已并入工作台的「待我处理」页签，导致主体空白。

### 5.5 脚本顶层不能访问 `S` / `UI`
它们还没初始化。权限判断 `UI.role.type` 只能写在函数体内。

### 5.6 模板字符串里的引号
用 `sed` 改 JS 容易把引号搞坏。优先用 `apply_patch` 或 Python 精确字符串替换，改完跑 `node --check`。

---

## 6. 评审功能（本轮重点，最容易改坏）

- 入口：内容详情 / 知识点详情 / 导入 / 候选批量。
- 两种模式：`gate`（先评审后定稿，阻塞）和 `async`（异步，不阻塞）。
- 统一入口在 `review_gray.js`：
  - `rvChip(kind,oid)` 进度标签
  - `rvStartBtn` / `rvPanel` 发起按钮与详情评审区
  - `rvHistory` 评审记录列表
- 评审单 kind 只有 `content` / `kp`；UI 层多一个 `kpx` 表示「已入库知识点」，转换用 `rvRk`。
- 评审结果只对**发起时那一版**有效（记 `ver` + 内容指纹 `fp`）。

改这块之前，先读 `docs/HANDOFF-v23.md` 第 32、33、34、35、36 节。

---

## 7. 验证的边界（别过度承诺）

- 这是一个**演示 Demo**，数据全为模拟值，界面有「示意数据」标识，不要移除。
- 没有后端：审核、评审、留痕都在浏览器里，不具备审计效力。
- 效果数据只说明相关性，不构成因果。
- 单位是「能演示一条完整链路」，不是「能上线」。

---

## 8. 建议的下一步

1. 先把工作区那批未提交改动跑一遍测试，确认是否全绿，再决定提交还是回退。
2. 顺手清掉最后一个重复定义 `A.tRetry`。
3. 给 `npm run check` 加重复定义检测，永久堵住 5.1 那个坑。
4. 评审界面还有产品层面的优化空间（信息密度、默认评审团），目前只做了样式重构。

---

## 9. 相关文档

| 文件 | 内容 |
|---|---|
| `AGENTS.md` | 项目约定，先读 |
| `docs/HANDOFF-v23.md` | 全部历史决策与踩坑，第 17 节是产品模型，第 32–36 节是本轮 |
| `docs/FEATURE-LIST.md` | 59 条功能清单（P-01..P-49 / A-01..A-10） |
| `docs/功能清单原型截图.zip` | 按编号对应的原型截图 |
| `README.md` | 快速开始与命令说明 |
