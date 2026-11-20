#!/usr/bin/env node
'use strict';
/* 从 src/scripts/x_taxonomy.js 导出 v1 标准库：docs/TAXONOMY-v1.md / docs/taxonomy_v1.csv / docs/taxonomy_v1.json
   单一数据源：以后改知识点只改 x_taxonomy.js，再跑本脚本。 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'src', 'scripts', 'x_taxonomy.js'), 'utf8');
const dataSrc = fs.readFileSync(path.join(root, 'src', 'scripts', 'v23_data.js'), 'utf8');
const carBlock = dataSrc.slice(dataSrc.indexOf('const V23_CAR_TREE='), dataSrc.indexOf('/* ---------- 1.'));
const ctx = { A: {}, UI: { sel: {} }, S: {}, PTAGS: [] };
vm.runInNewContext(carBlock, ctx);
const OUT = vm.runInNewContext(src + '\n;({meta:V23_TAX_META,items:V23_TAX})', ctx);
const TAX = OUT.items, META = OUT.meta;
const p0 = TAX.filter(t => t.pri === 'P0').length;
const byDomain = {};
TAX.forEach(t => (byDomain[t.domain] = byDomain[t.domain] || []).push(t));

function csvCell(v) {
  const s = String(v == null ? '' : v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
const head = ['编号', '名称', '类型', '知识域', '能力项', '销售阶段', '车型', '客户场景', '客户类型', '竞品', '优先级', '来源', '文档id', '旧编号', '备注'];
const rows = TAX.map(t => [
  t.code, t.name, t.type, t.domain, t.ab, t.stages.join('/'), t.cars.join('/'),
  (t.scenes || []).join('/'), (t.custs || []).join('/'), (t.comps || []).join('/'),
  t.pri, t.src, t.doc, (t.legacy || []).join('/'), t.note || ''
]);
const csv = [head, ...rows].map(r => r.map(csvCell).join(',')).join('\n') + '\n';
fs.writeFileSync(path.join(root, 'docs', 'taxonomy_v1.csv'), csv, 'utf8');
fs.writeFileSync(path.join(root, 'docs', 'taxonomy_v1.json'), JSON.stringify({ meta: META, items: TAX }, null, 2) + '\n', 'utf8');

const seriesLines = Object.keys(META.series).map(sr => `${sr}：${META.series[sr].join('、')}`).join('<br>');
const dimTable = `| 维度 | 角色 | 基数 | 取值 |
|---|---|---|---|
| 车型 | 归属 | 多值 | 通用车型；<br>${seriesLines} |
| 知识域 | 归属 | **单值** | ${META.domains.join('、')} |
| 能力项 | 能力 | **单值** | ${META.abilities.join('、')} |
| 销售阶段 | 上下文 | 多值 | ${META.stages.join('、')} |
| 客户场景 | 上下文 | 多值 | ${META.scenes.join('、')} |
| 客户类型 | 上下文 | 多值 | ${META.custs.join('、')} |
| 竞品 | 上下文 | 多值 | ${META.comps.join('、')} |`;

const domains = META.domains.filter(d => byDomain[d] && byDomain[d].length);
const sections = domains.map(d => {
  const items = byDomain[d];
  return `### ${d}（${items.length}）\n\n| 编号 | 知识点 | 类型 | 能力项 | 阶段 | 车型 | 优先级 | 来源（document_id） |\n|---|---|---|---|---|---|---|---|\n` +
    items.map(t => `| ${t.code} | ${t.name}${t.note ? '<br><small>' + t.note + '</small>' : ''} | ${t.type} | ${t.ab} | ${t.stages.join('、')} | ${t.cars.join('、')} | **${t.pri}** | ${t.src}<br><code>${t.doc}</code> |`).join('\n') + '\n';
}).join('\n');

const md = `# 培训知识点库 v1（标准库草案）

> 版本：v1.0 · 2026-11-19 · 依据汽车学堂知识库（\`car-cli knowledge +retrieval\`）整理。
> 这是一份**业务标准库**，不是学员数据；学员薄弱在工作台 / 效果追踪。
> 生成方式：\`node tools/export-taxonomy.js\`（单一数据源 \`src/scripts/x_taxonomy.js\`）。

## 0. 三条口径

1. **标签是维度值，不是文件夹。** 一个知识点可以同时挂车型、场景、客户、竞品；归属维度和能力项必须单值。
2. **知识点是能被讲、能被练、能被考、能被实战验证的最小单元。** 不是课程章节。
3. **完备率 = 某车型应覆盖的 P0 知识点中，已具备“主讲解 + 3 题 + 1 练习”的比例。** 不是“标签下有多少条”。

## 1. 维度字典（7 个）

${dimTable}

**约束：**
- 车型是「车系 → 版本」两层树，外加通用车型。知识点可以挂**版本**（如 SU7 Pro）、**车系**（如 SU7，自动覆盖全部版本）或**通用车型**。
- 能力项只允许这 7 项，岗位画像只能引用这 7 项，不允许另起名字。
- 知识域单值；否则“本品 / 竞品 / 销售”会重复计数。
- 车型多值 + 车系继承；SU7 Ultra 是 SU7 车系下的版本值。
- 竞品只做上下文，不做完备率分母（竞品周更，会漂）。
- 行业洞察 v1 预留，不铺知识点，不进分母。

## 2. 知识点清单（${TAX.length} 条：P0 ${p0} / P1 ${TAX.length - p0}）

${sections}

## 3. 完备率基线

> 车型按“可下单版本”建模，车系只用于看板分组。应覆盖 = 优先级 P0 且（车型 = 该版本或通用车型）；**带人辅导单列店长，不进零售顾问车型分母**。
> 可用 = ≥1 条主讲解（已上架未过期）+ ≥3 道题 + 技能型 ≥1 个演练；事实型不强制演练。

| 车型版本 | 品牌 | 本品 | 平台 | 竞品 | 销售 | 政策 | 交付 | 客户经营 | P0 合计 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| SU7 标准版 | 2 | 7 | 4 | 2 | 14 | 5 | 2 | 1 | **37** |
| SU7 Pro | 2 | 7 | 4 | 2 | 14 | 5 | 2 | 1 | **37** |
| SU7 Max | 2 | 7 | 4 | 2 | 14 | 5 | 2 | 1 | **37** |
| SU7 Ultra | 2 | 7 | 4 | 2 | 14 | 5 | 2 | 1 | **37** |
| YU7 标准版 | 2 | 6 | 4 | 3 | 14 | 5 | 2 | 1 | **37** |
| YU7 长续航版 | 2 | 6 | 4 | 3 | 14 | 5 | 2 | 1 | **37** |
| YU7 Pro | 2 | 6 | 4 | 3 | 14 | 5 | 2 | 1 | **37** |
| YU7 Max | 2 | 6 | 4 | 3 | 14 | 5 | 2 | 1 | **37** |
| YU7 GT | 2 | 6 | 4 | 3 | 14 | 5 | 2 | 1 | **37** |
| 澎程 N70 Pro | 2 | 7 | 4 | 2 | 14 | 5 | 2 | 1 | **37** |
| 澎程 N70 Max | 2 | 7 | 4 | 2 | 14 | 5 | 2 | 1 | **37** |
| 澎程 N90 Max | 2 | 8 | 4 | 2 | 14 | 5 | 2 | 1 | **38** |
| 澎程 N90 Max 探索版 | 2 | 8 | 4 | 2 | 14 | 5 | 2 | 1 | **38** |
| 店长（带人辅导） | — | — | — | — | — | — | — | — | **2** |

> 注：“平台”是本品知识下的一个展示分组（通用技术），不是独立知识域；本表按业务看板拆开，合计仍按 8 个知识域计算。

## 4. 这次核对后改掉的 6 处

1. **能力项单值**：73 条全部落在 7 项内；\`KP-SALE-02\` 从“探需/客户经营”改为单值“客户经营”；不再出现“—”。
2. **基线与公式对齐**：带人辅导单列店长，不进车型分母；SU7 各版本 37 / YU7 各版本 37 / 澎程 N70 各版本 37 / N90 各版本 38，公式和表一致。
3. **澎程拆版本**：N70 / N90 拆成两个车型值；续航 505/464km、油耗 5.7/6.1/6.26L 按版本写，不再把 N70 Pro 的 5.7L 讲成 N90。
4. **取值清零字典外**：“全阶段”入阶段字典；“交付前”并入“交付及交付后”；知识域收敛为 8 个；行业洞察标二期预留。
5. **SU7 Ultra 处理**：Ultra 作为 SU7 车系的一个可下单版本；专属卖点 1 条为 P1，不产生空分母。
6. **首触与来源**：首触改为知识库口径“5 分钟”；每条来源补 \`document_id\`，可直接回查原文。

## 5. 来源与局限

- **来源**：汽车学堂知识库（\`car-cli knowledge +retrieval\`）命中的原始文档，逐条 \`document_id\` 见上表。
- **产品数字**（902km、505/464km、5.7/6.1/6.26L、价格等）是当前文档口径的快照；入库前以最新产品 / 权益文档为准。
- **画像权重**（新人 / 进阶 / 销冠 / 店长）是**业务待确认草案**，没有原文依据，不与知识点一起定稿。
- **没验证**：竞品具体型号只确认库里有这些词，没有逐条核对每个配置；价格 / 权益没有全量核。
- **行业洞察** v1 无知识点，标二期预留；不参与完备率分母。

## 6. 待确认

1. 能力项是否就定 7 项，且岗位画像只引用这 7 项？
2. 知识域是否按“品牌 / 本品 / 竞品 / 销售 / 政策 / 交付 / 客户经营 / 行业”8 个走？
3. 车型是否按可下单版本建模（SU7 4 个 / YU7 5 个 / 澎程 4 个）？
4. 竞品清单以哪一期周报为准？是否需要固定“竞品版本号”？
5. 完备率“可用”标准（1 主讲解 + 3 题 + 1 练习）是否合适？P0 是否要更严？
6. 交付 / 售后是否算零售顾问知识点，还是单独给交付顾问建画像？
7. 首发 P0 范围：是否先做 4 个车型 × 37/38 条，竞品和政策留第二批？
`;

fs.writeFileSync(path.join(root, 'docs', 'TAXONOMY-v1.md'), md, 'utf8');
console.log(`导出完成：${TAX.length} 条（P0 ${p0} / P1 ${TAX.length - p0}）`);
console.log('docs/TAXONOMY-v1.md');
console.log('docs/taxonomy_v1.csv');
console.log('docs/taxonomy_v1.json');