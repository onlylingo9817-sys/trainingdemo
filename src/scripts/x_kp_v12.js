/* ================= 知识点体系 v1.2 覆盖层 =================
   加载顺序：x_taxonomy.js 之后、f_rn.js 之前。
   作用：把 68 条 v1.2 标准库、四指标、锚/练分流、补学任务接进现有 Demo。
   原则：不改旧页面的业务逻辑，用覆盖函数 + 数据迁移让 v1.2 生效。
   ========================================================================== */
const KP_DICT_V12={
  businessLines:['销售','交付','服务'],
  roles:['零售顾问','销售主管','店长','交付顾问','服务顾问'],
  domains:['品牌文化','产品知识','销售技能','政策权益','交付服务','客户运营','行业洞察'],
  abilities:['探需','场景化讲车','试驾引导','顾虑解除','促单成交','客户经营','带人辅导'],
  types:['概念','卖点','技能','流程','政策'],
  batches:['B1-30天','B2-90天','B3-后续'],
  stages:['邀约→到店','到店→试驾','试驾→报价','报价→锁单','锁单→交付','不直接对应'],
  statuses:['草案','结构已核','内容待核','内容已核','已发布','过期','停用'],
  contentRoles:['主讲解','补充材料','提及','归档'],
  questionRoles:['锚题','练习题'],
  drillRoles:['锚定演练','练习演练'],
  changeLevels:['L0-微调','L1-补充','L2-口径变更','L3-作废/重大'],
  taskStates:['未读','已读','已确认','已复测','逾期','挂起','已关闭']
};
const KP_SELLPOINT_LEAVES_V12=['外观设计','内饰质感','空间舒适','续航补能','充电补能','动力技术','智能座舱','辅助驾驶','安全','驾控','性能赛道','车型定位','产品线路线','用车成本','产品讲解'];
if(typeof KP_CELLS!=='undefined'){KP_CELLS.length=0;KP_CELLS.push(['owner','负责人'],['exp','核心讲解'],['spec','考核规格'],['fresh','时效']);}
if(typeof KP_TABS!=='undefined'){
  if(!KP_TABS.includes('知识图谱'))KP_TABS.splice(Math.max(1,KP_TABS.indexOf(KP_TAB_LIB)),0,'知识图谱');
  if(!KP_TABS.includes('补学进度'))KP_TABS.push('补学进度');
}
const KP_LIB_V12=[
{"id": "K1", "code": "KP-BR-01", "name": "小米品牌与“真诚热爱”价值观", "one": "用品牌故事和价值观建立信任，不喊口号。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "品牌文化", "ability": "场景化讲车", "sellpoint": "", "type": "概念", "typeLegacy": "事实型", "batch": "B3-后续", "stage": "不直接对应", "assess": {"methods": "客观题（单选/判断）；口头复述可选", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 0, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "品牌培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-BR-01", "legacyV11": "KP-BR-01", "demo": "gap", "note": ""},
{"id": "K2", "code": "KP-BR-06", "name": "人车家全生态战略", "one": "讲清手机、车、家如何连成一个生态。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "品牌文化", "ability": "场景化讲车", "sellpoint": "", "type": "概念", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "不直接对应", "assess": {"methods": "客观题（单选/判断）；口头复述可选", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 0, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "品牌培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-BR-04", "legacyV11": "KP-BR-06", "demo": "lecture_only", "note": ""},
{"id": "K3", "code": "KP-PROD-01", "name": "小米汽车产品线全景与纯电/增程路线", "one": "讲清 SU7、YU7、澎程各自适合谁。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "产品知识", "ability": "", "sellpoint": "产品线路线", "type": "概念", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "到店→试驾", "assess": {"methods": "客观题（单选/判断）；口头复述可选", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 0, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-BR-02、KP-BR-05", "legacyV11": "KP-PROD-01", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K4", "code": "KP-PROD-PC-01", "name": "澎程产品线定位与 N70/N90 选择", "one": "讲清澎程 N70/N90 分别适合谁。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-LINE-PC"], "scopeLevel": "产品线", "cars": ["澎程 N70", "澎程 N90"], "domain": "产品知识", "ability": "", "sellpoint": "车型定位", "type": "概念", "typeLegacy": "事实型", "batch": "B1-30天", "stage": "到店→试驾", "assess": {"methods": "客观题（单选/判断）；口头复述可选", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 0, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-PC-01、KP-PC-02（合并）", "legacyV11": "KP-PROD-PC-01", "demo": "ready", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K5", "code": "KP-PROD-PC-02", "name": "澎程增程动力与纯电续航怎么讲", "one": "讲增程怎么用、纯电续航怎么选。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-LINE-PC"], "scopeLevel": "产品线", "cars": ["澎程 N70", "澎程 N90"], "domain": "产品知识", "ability": "", "sellpoint": "续航补能", "type": "卖点", "typeLegacy": "事实型", "batch": "B1-30天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-PC-03 + 续航卡", "legacyV11": "KP-PROD-PC-02", "demo": "ready", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K6", "code": "KP-PROD-PC-03", "name": "澎程亏电油耗与用车成本", "one": "把亏电油耗讲成真实用车成本。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-LINE-PC"], "scopeLevel": "产品线", "cars": ["澎程 N70", "澎程 N90"], "domain": "产品知识", "ability": "", "sellpoint": "用车成本", "type": "卖点", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-PC-04 + 油耗卡", "legacyV11": "KP-PROD-PC-03", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K7", "code": "KP-PROD-PC-04", "name": "澎程大七座空间与座椅布局", "one": "用七座和座椅布局讲多人出行。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-LINE-PC"], "scopeLevel": "产品线", "cars": ["澎程 N70", "澎程 N90"], "domain": "产品知识", "ability": "", "sellpoint": "空间舒适", "type": "卖点", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-PC-05", "legacyV11": "KP-PROD-PC-04", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K8", "code": "KP-PROD-PC-05", "name": "澎程智能可变大空间 / 纯平地板 / 滑轨", "one": "用可变空间、纯平地板讲装载能力。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-LINE-PC"], "scopeLevel": "产品线", "cars": ["澎程 N70", "澎程 N90"], "domain": "产品知识", "ability": "", "sellpoint": "空间舒适", "type": "卖点", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-PC-06", "legacyV11": "KP-PROD-PC-05", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K9", "code": "KP-PROD-PC-06", "name": "澎程二排零重力 / 旋转座椅", "one": "用零重力和旋转座椅讲二排舒适。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-N90-MAX"], "scopeLevel": "车型", "cars": ["澎程 N90 Max"], "domain": "产品知识", "ability": "", "sellpoint": "空间舒适", "type": "卖点", "typeLegacy": "事实型", "batch": "B3-后续", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "内容待核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "6a1efcbed6ba11f18a3ea21bf54387f8", "legacy": "KP-PC-07（改挂 N90 Max）", "legacyV11": "KP-PROD-PC-06", "demo": "content_pending", "note": "能力项留空：产品知识用“卖点分类”度量；document_id 来自旧 Demo 知识库映射，上线前复核"},
{"id": "K10", "code": "KP-PROD-PC-07", "name": "澎程智能座舱与生态", "one": "用座舱和生态讲澎程的智能体验。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-LINE-PC"], "scopeLevel": "产品线", "cars": ["澎程 N70", "澎程 N90"], "domain": "产品知识", "ability": "", "sellpoint": "智能座舱", "type": "卖点", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-PC-08", "legacyV11": "KP-PROD-PC-07", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K11", "code": "KP-PROD-PC-08", "name": "澎程辅助驾驶与安全", "one": "讲澎程的辅助驾驶能力和安全边界。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-LINE-PC"], "scopeLevel": "产品线", "cars": ["澎程 N70", "澎程 N90"], "domain": "产品知识", "ability": "", "sellpoint": "辅助驾驶", "type": "卖点", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "试驾→报价", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-PC-09", "legacyV11": "KP-PROD-PC-08", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K12", "code": "KP-PROD-SU7-01", "name": "SU7 车系定位与版本选择", "one": "按预算和用车需求带客户选对版本。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-SU7"], "scopeLevel": "车系", "cars": ["SU7"], "domain": "产品知识", "ability": "", "sellpoint": "车型定位", "type": "概念", "typeLegacy": "事实型", "batch": "B1-30天", "stage": "到店→试驾", "assess": {"methods": "客观题（单选/判断）；口头复述可选", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 0, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SU7-01 + 配置卡", "legacyV11": "KP-PROD-SU7-01", "demo": "ready", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K13", "code": "KP-PROD-SU7-02", "name": "SU7 外观与个性化卖点", "one": "用颜色、轮毂和外观细节建立第一眼好感。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-SU7"], "scopeLevel": "车系", "cars": ["SU7"], "domain": "产品知识", "ability": "", "sellpoint": "外观设计", "type": "卖点", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SU7-02 + 颜色/轮毂卡", "legacyV11": "KP-PROD-SU7-02", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K14", "code": "KP-PROD-SU7-03", "name": "SU7 内饰质感与豪华配置", "one": "讲材质、做工和舒适配置带来的质感。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-SU7"], "scopeLevel": "车系", "cars": ["SU7"], "domain": "产品知识", "ability": "", "sellpoint": "内饰质感", "type": "卖点", "typeLegacy": "事实型", "batch": "B3-后续", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SU7-03", "legacyV11": "KP-PROD-SU7-03", "demo": "gap", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K15", "code": "KP-PROD-SU7-04", "name": "SU7 续航与补能怎么讲", "one": "把续航数字转成通勤和长途场景。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-SU7"], "scopeLevel": "车系", "cars": ["SU7"], "domain": "产品知识", "ability": "", "sellpoint": "续航补能", "type": "卖点", "typeLegacy": "事实型", "batch": "B1-30天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SU7-04 + 续航/电池卡", "legacyV11": "KP-PROD-SU7-04", "demo": "ready", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K16", "code": "KP-PROD-SU7-05", "name": "SU7 底盘与驾控", "one": "在试驾中让客户感受运动与舒适两种底盘性格。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-SU7"], "scopeLevel": "车系", "cars": ["SU7"], "domain": "产品知识", "ability": "", "sellpoint": "驾控", "type": "卖点", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "试驾→报价", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "试驾质检·驾控体验讲解", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SU7-05", "legacyV11": "KP-PROD-SU7-05", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K17", "code": "KP-PROD-SU7-06", "name": "SU7 智能座舱：天际屏 / 超级小爱", "one": "用天际屏、小爱和生态演示座舱便利。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-SU7"], "scopeLevel": "车系", "cars": ["SU7"], "domain": "产品知识", "ability": "", "sellpoint": "智能座舱", "type": "卖点", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SU7-06", "legacyV11": "KP-PROD-SU7-06", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K18", "code": "KP-PROD-SU7-07", "name": "SU7 辅助驾驶 HAD/XLA 与能力边界", "one": "讲清 HAD/XLA 能做什么、不能做什么。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-SU7"], "scopeLevel": "车系", "cars": ["SU7"], "domain": "产品知识", "ability": "", "sellpoint": "辅助驾驶", "type": "卖点", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "试驾→报价", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SU7-07", "legacyV11": "KP-PROD-SU7-07", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K19", "code": "KP-PROD-SU7-08", "name": "SU7 安全：主动 / 被动 / 冗余", "one": "用主动、被动和冗余讲清安全底线。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-SU7"], "scopeLevel": "车系", "cars": ["SU7"], "domain": "产品知识", "ability": "", "sellpoint": "安全", "type": "卖点", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SU7-08", "legacyV11": "KP-PROD-SU7-08", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K20", "code": "KP-PROD-SU7-09", "name": "SU7 Ultra 性能与赛道卖点", "one": "用赛道性能和操控讲 Ultra 的专属价值。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SU7-ULTRA"], "scopeLevel": "车型", "cars": ["SU7 Ultra"], "domain": "产品知识", "ability": "", "sellpoint": "性能赛道", "type": "卖点", "typeLegacy": "事实型", "batch": "B3-后续", "stage": "试驾→报价", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SU7-09（改挂 SU7 Ultra）", "legacyV11": "KP-PROD-SU7-09", "demo": "gap", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K21", "code": "KP-PROD-TECH-01", "name": "龙甲电池与电池安全", "one": "讲龙甲电池的安全设计和验证。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-SU7", "CAR-SERIES-YU7"], "scopeLevel": "多车系", "cars": ["SU7", "YU7"], "domain": "产品知识", "ability": "", "sellpoint": "安全", "type": "概念", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "到店→试驾", "assess": {"methods": "客观题（单选/判断）；口头复述可选", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 0, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "内容待核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "707d1b36e3c111f1968ce6b9d9292771", "legacy": "KP-TECH-01（改挂 SU7+YU7）", "legacyV11": "KP-PROD-TECH-01", "demo": "content_pending", "note": "能力项留空：产品知识用“卖点分类”度量；document_id 来自旧 Demo 知识库映射，上线前复核"},
{"id": "K22", "code": "KP-PROD-TECH-02", "name": "充电补能体系：家充 / 超充 / 三方桩", "one": "讲家充、超充、三方桩怎么用。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "产品知识", "ability": "", "sellpoint": "充电补能", "type": "概念", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "到店→试驾", "assess": {"methods": "客观题（单选/判断）；口头复述可选", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 0, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-TECH-02", "legacyV11": "KP-PROD-TECH-02", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K23", "code": "KP-PROD-TECH-03", "name": "辅助驾驶能力边界与法规责任", "one": "讲辅助驾驶的法规责任和能力边界。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "产品知识", "ability": "", "sellpoint": "辅助驾驶", "type": "概念", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "试驾→报价", "assess": {"methods": "客观题（单选/判断）；口头复述可选", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 0, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-TECH-03", "legacyV11": "KP-PROD-TECH-03", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K24", "code": "KP-PROD-TECH-04", "name": "OTA 升级机制", "one": "讲 OTA 如何让车常用常新。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "产品知识", "ability": "", "sellpoint": "智能座舱", "type": "概念", "typeLegacy": "事实型", "batch": "B3-后续", "stage": "到店→试驾", "assess": {"methods": "客观题（单选/判断）；口头复述可选", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 0, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-TECH-04", "legacyV11": "KP-PROD-TECH-04", "demo": "gap", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K25", "code": "KP-PROD-TECH-05", "name": "超级小爱与四域合一", "one": "讲超级小爱和四域合一带来的体验。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "产品知识", "ability": "", "sellpoint": "智能座舱", "type": "概念", "typeLegacy": "事实型", "batch": "B3-后续", "stage": "到店→试驾", "assess": {"methods": "客观题（单选/判断）；口头复述可选", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 0, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-TECH-05", "legacyV11": "KP-PROD-TECH-05", "demo": "gap", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K26", "code": "KP-PROD-TECH-06", "name": "车身结构与被动安全", "one": "讲车身结构和被动安全。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "产品知识", "ability": "", "sellpoint": "安全", "type": "概念", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "到店→试驾", "assess": {"methods": "客观题（单选/判断）；口头复述可选", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 0, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-TECH-06", "legacyV11": "KP-PROD-TECH-06", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K27", "code": "KP-PROD-TECH-07", "name": "增程器 NVH / 热管理 / 冬季续航", "one": "讲增程器 NVH、热管理和冬季续航。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-LINE-PC"], "scopeLevel": "产品线", "cars": ["澎程 N70", "澎程 N90"], "domain": "产品知识", "ability": "", "sellpoint": "动力技术", "type": "概念", "typeLegacy": "事实型", "batch": "B3-后续", "stage": "试驾→报价", "assess": {"methods": "客观题（单选/判断）；口头复述可选", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 0, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-TECH-07（改挂澎程）", "legacyV11": "KP-PROD-TECH-07", "demo": "gap", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K28", "code": "KP-PROD-YU7-01", "name": "YU7 车系定位与版本选择", "one": "按家庭需求和预算带客户选 YU7 版本。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-YU7"], "scopeLevel": "车系", "cars": ["YU7"], "domain": "产品知识", "ability": "", "sellpoint": "车型定位", "type": "概念", "typeLegacy": "事实型", "batch": "B1-30天", "stage": "到店→试驾", "assess": {"methods": "客观题（单选/判断）；口头复述可选", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 0, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-YU7-01 + 配置卡", "legacyV11": "KP-PROD-YU7-01", "demo": "ready", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K29", "code": "KP-PROD-YU7-02", "name": "YU7 外观设计与颜色", "one": "用设计和颜色讲出 YU7 的辨识度。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-YU7"], "scopeLevel": "车系", "cars": ["YU7"], "domain": "产品知识", "ability": "", "sellpoint": "外观设计", "type": "卖点", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-YU7-02 + 颜色卡", "legacyV11": "KP-PROD-YU7-02", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K30", "code": "KP-PROD-YU7-03", "name": "YU7 续航与 800V 补能", "one": "把 800V 和续航讲成补能效率。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-YU7"], "scopeLevel": "车系", "cars": ["YU7"], "domain": "产品知识", "ability": "", "sellpoint": "续航补能", "type": "卖点", "typeLegacy": "事实型", "batch": "B1-30天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-YU7-03 + 续航卡", "legacyV11": "KP-PROD-YU7-03", "demo": "ready", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K31", "code": "KP-PROD-YU7-04", "name": "YU7 驾控与底盘", "one": "在试驾中讲清 YU7 的底盘和驾控。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-YU7"], "scopeLevel": "车系", "cars": ["YU7"], "domain": "产品知识", "ability": "", "sellpoint": "驾控", "type": "卖点", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "试驾→报价", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "试驾质检·驾控体验讲解", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-YU7-04", "legacyV11": "KP-PROD-YU7-04", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K32", "code": "KP-PROD-YU7-05", "name": "YU7 座舱与天际屏", "one": "用天际屏和座舱生态讲家庭出行体验。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-YU7"], "scopeLevel": "车系", "cars": ["YU7"], "domain": "产品知识", "ability": "", "sellpoint": "智能座舱", "type": "卖点", "typeLegacy": "事实型", "batch": "B3-后续", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-YU7-05", "legacyV11": "KP-PROD-YU7-05", "demo": "gap", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K33", "code": "KP-PROD-YU7-06", "name": "YU7 空间与家庭场景", "one": "用空间和座椅布局讲家庭场景。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-YU7"], "scopeLevel": "车系", "cars": ["YU7"], "domain": "产品知识", "ability": "", "sellpoint": "空间舒适", "type": "卖点", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-YU7-06", "legacyV11": "KP-PROD-YU7-06", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K34", "code": "KP-PROD-YU7-07", "name": "YU7 安全卖点", "one": "用车身和主动安全讲家庭用车安心。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-SERIES-YU7"], "scopeLevel": "车系", "cars": ["YU7"], "domain": "产品知识", "ability": "", "sellpoint": "安全", "type": "卖点", "typeLegacy": "事实型", "batch": "B2-90天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 讲车演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 180}, "behavior": "暂无（仅知识测评）", "ownerRole": "产品培训负责人", "owner": "王磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-YU7-07", "legacyV11": "KP-PROD-YU7-07", "demo": "lecture_only", "note": "能力项留空：产品知识用“卖点分类”度量"},
{"id": "K35", "code": "KP-CMP-01", "name": "竞品对比方法论：先认同、讲差异、回到需求", "one": "先认同、讲差异、再回到客户需求。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "顾虑解除", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B2-90天", "stage": "报价→锁单", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-COMP-01（改命名空间）", "legacyV11": "KP-CMP-01", "demo": "lecture_only", "note": ""},
{"id": "K36", "code": "KP-CMP-02", "name": "价格与权益对比", "one": "用总拥有成本和权益有效期回应“更便宜”。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "顾虑解除", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B2-90天", "stage": "报价→锁单", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "报价/锁单录音（待接入）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-COMP-02/03/04/05（维度拆分）", "legacyV11": "KP-CMP-02", "demo": "lecture_only", "note": ""},
{"id": "K37", "code": "KP-CMP-03", "name": "空间与舒适对比", "one": "用乘坐、储物和上下车回应空间异议。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "顾虑解除", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B2-90天", "stage": "报价→锁单", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "报价/锁单录音（待接入）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-COMP-02/03/04/05（维度拆分）", "legacyV11": "KP-CMP-03", "demo": "lecture_only", "note": ""},
{"id": "K38", "code": "KP-CMP-04", "name": "续航与补能对比", "one": "用续航口径、补能和冬季场景回应续航异议。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "顾虑解除", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B2-90天", "stage": "报价→锁单", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "报价/锁单录音（待接入）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-COMP-02/03/04/05（维度拆分）", "legacyV11": "KP-CMP-04", "demo": "lecture_only", "note": ""},
{"id": "K39", "code": "KP-CMP-05", "name": "智能座舱与生态对比", "one": "用流畅度、生态和语音回应车机异议。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "顾虑解除", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B3-后续", "stage": "报价→锁单", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-COMP-02/03/04/05（维度拆分）", "legacyV11": "KP-CMP-05", "demo": "gap", "note": ""},
{"id": "K40", "code": "KP-CMP-06", "name": "辅助驾驶与安全对比", "one": "用能力边界、法规和硬件回应智驾异议。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "顾虑解除", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B2-90天", "stage": "报价→锁单", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "报价/锁单录音（待接入）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "内容待核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "371b5586d69911f1ad574ed4269eba83", "legacy": "KP-COMP-02/03/04/05（维度拆分）", "legacyV11": "KP-CMP-06", "demo": "content_pending", "note": "document_id 来自旧 Demo 知识库映射，上线前复核"},
{"id": "K41", "code": "KP-CMP-07", "name": "品牌、服务与保值对比", "one": "用品牌、门店、服务和保值回应品牌异议。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "顾虑解除", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B3-后续", "stage": "报价→锁单", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "内容待核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "371b5586d69911f1ad574ed4269eba83", "legacy": "KP-COMP-02/03/04/05（维度拆分）", "legacyV11": "KP-CMP-07", "demo": "content_pending", "note": "document_id 来自旧 Demo 知识库映射，上线前复核"},
{"id": "K42", "code": "KP-MGR-01", "name": "新人带教与陪访", "one": "用陪访和复盘带新人。", "line": "销售", "roles": ["店长"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "带人辅导", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B1-30天", "stage": "不直接对应", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "店长发展负责人", "owner": "陈磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-MGR-01", "legacyV11": "KP-MGR-01", "demo": "ready", "note": ""},
{"id": "K43", "code": "KP-MGR-02", "name": "门店例会与目标拆解", "one": "用例会拆解门店目标。", "line": "销售", "roles": ["店长"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "带人辅导", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B3-后续", "stage": "不直接对应", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "店长发展负责人", "owner": "陈磊", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-MGR-02", "legacyV11": "KP-MGR-02", "demo": "gap", "note": ""},
{"id": "K44", "code": "KP-MGR-03", "name": "试驾 / 接待质量点检与辅导工单", "one": "用点检和辅导工单管接待与试驾质量。", "line": "销售", "roles": ["店长"], "also": ["销售主管"], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "带人辅导", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B1-30天", "stage": "不直接对应", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "店长发展负责人", "owner": "陈磊", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-MGR-03", "legacyV11": "KP-MGR-03", "demo": "ready", "note": ""},
{"id": "K45", "code": "KP-SALE-01", "name": "线索分级与 5 分钟首触", "one": "按线索质量分级，5 分钟内完成首触。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "客户经营", "sellpoint": "", "type": "流程", "typeLegacy": "技能型", "batch": "B2-90天", "stage": "邀约→到店", "assess": {"methods": "客观题 + 流程演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SALE-01", "legacyV11": "KP-SALE-01", "demo": "lecture_only", "note": ""},
{"id": "K46", "code": "KP-SALE-02", "name": "电话邀约八步法", "one": "按八步法把电话邀约打完整。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "客户经营", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B2-90天", "stage": "邀约→到店", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SALE-02", "legacyV11": "KP-SALE-02", "demo": "lecture_only", "note": ""},
{"id": "K47", "code": "KP-SALE-03", "name": "二次邀约与决策人邀约", "one": "用二次邀约把决策人请到店。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "探需", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B3-后续", "stage": "邀约→到店", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SALE-03", "legacyV11": "KP-SALE-03", "demo": "gap", "note": ""},
{"id": "K48", "code": "KP-SALE-04", "name": "到店接待标准流程", "one": "按标准流程完成迎宾、破冰和留资。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "探需", "sellpoint": "", "type": "流程", "typeLegacy": "技能型", "batch": "B1-30天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 流程演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SALE-04", "legacyV11": "KP-SALE-04", "demo": "ready", "note": ""},
{"id": "K49", "code": "KP-SALE-05", "name": "需求挖掘必问 5 问", "one": "用必问 5 问挖出真实需求。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "探需", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B1-30天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SALE-05", "legacyV11": "KP-SALE-05", "demo": "ready", "note": ""},
{"id": "K50", "code": "KP-SALE-06", "name": "开放式 + 封闭式提问组合", "one": "用开放式和封闭式提问组合推进需求。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "探需", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B3-后续", "stage": "到店→试驾", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SALE-06", "legacyV11": "KP-SALE-06", "demo": "gap", "note": ""},
{"id": "K51", "code": "KP-SALE-07", "name": "决策人 / 用车人 / 付款人识别", "one": "分清决策人、用车人和付款人。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "探需", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B2-90天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SALE-07", "legacyV11": "KP-SALE-07", "demo": "lecture_only", "note": ""},
{"id": "K52", "code": "KP-SALE-08", "name": "场景化讲车 SPIN 四步", "one": "用 SPIN 四步把卖点讲成场景。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "场景化讲车", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B1-30天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "试驾质检·场景讲解率", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SALE-08", "legacyV11": "KP-SALE-08", "demo": "ready", "note": ""},
{"id": "K53", "code": "KP-SALE-09", "name": "卖点转译：参数 → 场景利益", "one": "把参数翻译成客户能感知的利益。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "场景化讲车", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B1-30天", "stage": "到店→试驾", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "试驾质检·场景讲解率", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SALE-09", "legacyV11": "KP-SALE-09", "demo": "ready", "note": ""},
{"id": "K54", "code": "KP-SALE-10", "name": "PDC 试驾确认", "one": "用 PDC 确认试驾目标和路线。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "试驾引导", "sellpoint": "", "type": "流程", "typeLegacy": "技能型", "batch": "B1-30天", "stage": "试驾→报价", "assess": {"methods": "客观题 + 流程演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "试驾质检·流程完整率", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SALE-10", "legacyV11": "KP-SALE-10", "demo": "ready", "note": ""},
{"id": "K55", "code": "KP-SALE-11", "name": "试乘试驾标准流程与路线设计", "one": "按标准流程设计试驾体验点。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "试驾引导", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B1-30天", "stage": "试驾→报价", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "试驾质检·流程完整率", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SALE-11", "legacyV11": "KP-SALE-11", "demo": "ready", "note": ""},
{"id": "K56", "code": "KP-SALE-12", "name": "试驾回访 T+1", "one": "试驾后 T+1 完成回访和推进。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "客户经营", "sellpoint": "", "type": "流程", "typeLegacy": "技能型", "batch": "B2-90天", "stage": "试驾→报价", "assess": {"methods": "客观题 + 流程演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SALE-12", "legacyV11": "KP-SALE-12", "demo": "lecture_only", "note": ""},
{"id": "K57", "code": "KP-SALE-13", "name": "价格异议处理：价值锚点 / 总拥有成本", "one": "用价值锚点和总拥有成本处理价格异议。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "顾虑解除", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B1-30天", "stage": "报价→锁单", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "报价/锁单录音（待接入）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SALE-13", "legacyV11": "KP-SALE-13", "demo": "ready", "note": ""},
{"id": "K58", "code": "KP-SALE-14", "name": "促单三步与下订 / 改配", "one": "识别信号，推进下订和改配。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "促单成交", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B1-30天", "stage": "报价→锁单", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "报价/锁单录音（待接入）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-SALE-14", "legacyV11": "KP-SALE-14", "demo": "ready", "note": ""},
{"id": "K59", "code": "KP-SALE-15", "name": "新零售模式与门店岗位分工", "one": "讲清新零售模式和门店岗位分工。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "销售技能", "ability": "客户经营", "sellpoint": "", "type": "流程", "typeLegacy": "技能型", "batch": "B3-后续", "stage": "不直接对应", "assess": {"methods": "客观题 + 流程演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "销售培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-BR-03", "legacyV11": "KP-SALE-15", "demo": "gap", "note": ""},
{"id": "K60", "code": "KP-PLC-01", "name": "政策口径讲解与核验：国补 / 地补 / 置换 / 限时", "one": "讲政策口径、适用条件和核验方式。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "政策权益", "ability": "顾虑解除", "sellpoint": "", "type": "政策", "typeLegacy": "技能型", "batch": "B1-30天", "stage": "报价→锁单", "assess": {"methods": "客观题（版本化）+ 情景问答可选", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 0, "pass": 70, "validityDays": 30}, "behavior": "报价/锁单录音（待接入）", "ownerRole": "政策培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "2026-12-31", "srcDoc": "d1cd9130d99511f1a763ca291fe033b5", "legacy": "KP-POL-01/02/03/04", "legacyV11": "KP-PLC-01", "demo": "ready", "note": "v1.1 类型为“技能”，v1.2 改为“政策”以启用 30 天有效期；document_id 来自旧 Demo 知识库映射，上线前复核；政策类 30 天有效期，复核日 2026-12-31（示例，待业务确认）"},
{"id": "K61", "code": "KP-PLC-02", "name": "金融方案讲解：首付 / 月供 / 贴息 / 保险", "one": "讲首付、月供、贴息和保险方案。", "line": "销售", "roles": ["零售顾问"], "also": ["交付顾问"], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "政策权益", "ability": "促单成交", "sellpoint": "", "type": "政策", "typeLegacy": "技能型", "batch": "B1-30天", "stage": "报价→锁单", "assess": {"methods": "客观题（版本化）+ 情景问答可选", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 0, "pass": 70, "validityDays": 30}, "behavior": "报价/锁单录音（待接入）", "ownerRole": "政策培训负责人", "owner": "李娜", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "2026-12-31", "srcDoc": "d1cd9130d99511f1a763ca291fe033b5", "legacy": "KP-POL-05/06", "legacyV11": "KP-PLC-02", "demo": "ready", "note": "v1.1 类型为“技能”，v1.2 改为“政策”以启用 30 天有效期；document_id 来自旧 Demo 知识库映射，上线前复核；政策类 30 天有效期，复核日 2026-12-31（示例，待业务确认）"},
{"id": "K62", "code": "KP-DLV-01", "name": "交付前准备与建群交接", "one": "交付前建群、交接和准备。", "line": "交付", "roles": ["交付顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "交付服务", "ability": "客户经营", "sellpoint": "", "type": "流程", "typeLegacy": "技能型", "batch": "B3-后续", "stage": "锁单→交付", "assess": {"methods": "客观题 + 流程演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "交付培训负责人", "owner": "陈刚", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-DLV-01", "legacyV11": "KP-DLV-01", "demo": "gap", "note": ""},
{"id": "K63", "code": "KP-DLV-02", "name": "到店交付 / 验车 / 签约 / 手续", "one": "按标准完成验车、签约和手续。", "line": "交付", "roles": ["交付顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "交付服务", "ability": "客户经营", "sellpoint": "", "type": "流程", "typeLegacy": "技能型", "batch": "B1-30天", "stage": "锁单→交付", "assess": {"methods": "客观题 + 流程演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "交付质检·流程完整率", "ownerRole": "交付培训负责人", "owner": "陈刚", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-DLV-02", "legacyV11": "KP-DLV-02", "demo": "ready", "note": ""},
{"id": "K64", "code": "KP-DLV-03", "name": "交付时车辆功能讲解方法", "one": "用 9 大功能方法把交付讲解讲清楚。", "line": "交付", "roles": ["交付顾问"], "also": ["零售顾问"], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "交付服务", "ability": "场景化讲车", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B1-30天", "stage": "锁单→交付", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "交付质检·功能讲解覆盖率", "ownerRole": "交付培训负责人", "owner": "陈刚", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-DLV-03 + 9 功能卡/内容包", "legacyV11": "KP-DLV-03", "demo": "ready", "note": ""},
{"id": "K65", "code": "KP-DLV-04", "name": "交付后回访与投诉应对", "one": "交付后回访并处理投诉。", "line": "交付", "roles": ["交付顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "交付服务", "ability": "客户经营", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B3-后续", "stage": "锁单→交付", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "交付后回访质检", "ownerRole": "交付培训负责人", "owner": "陈刚", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-DLV-04", "legacyV11": "KP-DLV-04", "demo": "gap", "note": ""},
{"id": "K66", "code": "KP-CUST-01", "name": "企微客户标签与分层", "one": "用企微标签给客户分层。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "客户运营", "ability": "客户经营", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B2-90天", "stage": "不直接对应", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "客户运营培训负责人", "owner": "周丽", "status": "结构已核", "pri": "P0", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-CUST-01", "legacyV11": "KP-CUST-01", "demo": "lecture_only", "note": ""},
{"id": "K67", "code": "KP-CUST-02", "name": "朋友圈 / 内容运营与沉睡唤醒", "one": "用朋友圈和内容唤醒沉睡客户。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "客户运营", "ability": "客户经营", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B3-后续", "stage": "不直接对应", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "客户运营培训负责人", "owner": "周丽", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-CUST-02", "legacyV11": "KP-CUST-02", "demo": "gap", "note": ""},
{"id": "K68", "code": "KP-CUST-03", "name": "转介绍与复购", "one": "用转介绍和复购做长期经营。", "line": "销售", "roles": ["零售顾问"], "also": [], "scope": ["CAR-GEN"], "scopeLevel": "通用", "cars": ["通用车型"], "domain": "客户运营", "ability": "客户经营", "sellpoint": "", "type": "技能", "typeLegacy": "技能型", "batch": "B3-后续", "stage": "不直接对应", "assess": {"methods": "客观题 + 情景演练（锚定）", "anchorQ": 3, "practiceQ": 5, "anchorDrill": 1, "pass": 70, "validityDays": 90}, "behavior": "暂无（仅知识测评）", "ownerRole": "客户运营培训负责人", "owner": "周丽", "status": "结构已核", "pri": "P1", "specVer": 1, "reviewDue": "", "srcDoc": "", "legacy": "KP-CUST-03", "legacyV11": "KP-CUST-03", "demo": "gap", "note": ""}
];

/* ---------- 索引 / 旧 ID 迁移 ---------- */
const KP_ID_BY_CODE_V12={}; KP_LIB_V12.forEach(t=>{KP_ID_BY_CODE_V12[t.code]=t.id});
const KP_BY_CODE_V12={}; KP_LIB_V12.forEach(t=>{KP_BY_CODE_V12[t.code]=t});
const KP_BY_ID_V12={}; KP_LIB_V12.forEach(t=>{KP_BY_ID_V12[t.id]=t});
const KP_CAR_CODES_V12=new Set(['CAR-GEN','CAR-LINE-PC','CAR-SERIES-N70','CAR-N70-PRO','CAR-N70-MAX','CAR-SERIES-N90','CAR-N90-PRO','CAR-N90-MAX','CAR-N90-EXPLORE','CAR-SERIES-SU7','CAR-SU7-STD','CAR-SU7-PRO','CAR-SU7-MAX','CAR-SU7-ULTRA','CAR-SERIES-YU7','CAR-YU7-STD','CAR-YU7-PRO','CAR-YU7-MAX']);
function kpV12Id(code){return KP_ID_BY_CODE_V12[code]||null}
const KP_LEGACY_MAP_V12={
  K1:kpV12Id('KP-PROD-PC-05'),K3:kpV12Id('KP-PROD-PC-05'),K8:kpV12Id('KP-PROD-PC-05'),
  K11:kpV12Id('KP-PROD-PC-05'),K12:kpV12Id('KP-PROD-PC-05'),K13:kpV12Id('KP-PROD-PC-05'),
  K14:kpV12Id('KP-PROD-PC-05'),K2:kpV12Id('KP-PROD-PC-06'),K4:kpV12Id('KP-PROD-TECH-02'),
  K5:kpV12Id('KP-PROD-PC-02'),K6:kpV12Id('KP-PROD-PC-08'),K16:kpV12Id('KP-PROD-PC-08'),
  K7:kpV12Id('KP-PROD-TECH-06'),K9:kpV12Id('KP-PROD-PC-04'),K10:kpV12Id('KP-PROD-PC-07'),
  K15:kpV12Id('KP-PROD-PC-03'),K17:kpV12Id('KP-SALE-08'),K18:kpV12Id('KP-SALE-13'),
  K19:kpV12Id('KP-CMP-01'),K20:kpV12Id('KP-SALE-05'),K21:kpV12Id('KP-SALE-02'),
  K22:kpV12Id('KP-PLC-01'),K23:kpV12Id('KP-SALE-04'),K24:kpV12Id('KP-MGR-01'),K25:kpV12Id('KP-MGR-02'),
  K_CEMN0:kpV12Id('KP-SALE-05'),K_CEMN1:kpV12Id('KP-SALE-05'),K_CEMN2:kpV12Id('KP-SALE-05'),
  K_CEMN3:kpV12Id('KP-SALE-13'),K_CEMN4:kpV12Id('KP-SALE-13'),K_CEMN5:kpV12Id('KP-SALE-14'),
  K_CEMN6:kpV12Id('KP-SALE-14'),K_SPIN0:kpV12Id('KP-SALE-08'),K_SPIN1:kpV12Id('KP-SALE-08'),
  K_SPIN2:kpV12Id('KP-SALE-08'),K_SPIN3:kpV12Id('KP-SALE-08'),K_SPIN4:kpV12Id('KP-SALE-08'),
  K_RECV1:kpV12Id('KP-SALE-04')
};
const KP_CAR_TREE_V12={
  'SU7':['SU7 标准版','SU7 Pro','SU7 Max','SU7 Ultra'],
  'YU7':['YU7 标准版','YU7 Pro','YU7 Max'],
  '澎程 N70':['澎程 N70 Pro','澎程 N70 Max'],
  '澎程 N90':['澎程 N90 Pro','澎程 N90 Max','澎程 N90 Max 探索版']
};

/* ---------- 改现有全局：车型树 / 维度 / 能力 / 画像 ---------- */
Object.keys(V23_CAR_TREE).forEach(k=>delete V23_CAR_TREE[k]);
Object.assign(V23_CAR_TREE,KP_CAR_TREE_V12);
Object.keys(V23_CAR_SERIES_OF).forEach(k=>delete V23_CAR_SERIES_OF[k]);
V23_CAR_LEAVES.length=0;
Object.keys(V23_CAR_TREE).forEach(sr=>V23_CAR_TREE[sr].forEach(v=>{V23_CAR_SERIES_OF[v]=sr;V23_CAR_LEAVES.push(v)}));
V23_CAR_ALL.length=0; V23_CAR_ALL.push('通用车型'); Object.keys(V23_CAR_TREE).forEach(sr=>V23_CAR_ALL.push(sr)); V23_CAR_LEAVES.forEach(v=>V23_CAR_ALL.push(v));

V23_TAX_META.domains=KP_DICT_V12.domains.slice();
V23_TAX_META.abilities=KP_DICT_V12.abilities.slice();
V23_TAX_META.stages=KP_DICT_V12.stages.slice();
V23_TAX_META.scenes=[]; V23_TAX_META.custs=[]; V23_TAX_META.comps=[];
V23_TAX_META.notes={'行业洞察':'二期预留：v1.2 不铺知识点，不进完备率分母'};

V23_AB_RAW.length=0; KP_DICT_V12.abilities.forEach(a=>V23_AB_RAW.push([a,[]]));

V23_DIM_SEED.length=0;
V23_DIM_SEED.push(
  {id:'Dcar',name:'车型',shape:'tree',role:'belong',multi:1,requiredFor:['kp'],source:'manual',values:null,note:'通用→产品线→车系→车型；知识点只挂最高适用层'},
  {id:'Ddomain',name:'知识域',shape:'flat',role:'belong',multi:0,requiredFor:['kp'],source:'manual',values:KP_DICT_V12.domains.slice(),note:'单值'},
  {id:'Dab',name:'能力项',shape:'flat',role:'ability',multi:0,requiredFor:['kp'],source:'manual',values:KP_DICT_V12.abilities.slice(),note:'产品知识留空，用卖点分类'},
  {id:'Dsell',name:'卖点分类',shape:'flat',role:'belong',multi:0,requiredFor:['kp'],source:'manual',values:KP_SELLPOINT_LEAVES_V12.slice(),note:'仅产品知识'},
  {id:'Dflow',name:'业务环节',shape:'flat',role:'belong',multi:0,requiredFor:['kp'],source:'manual',values:KP_DICT_V12.stages.slice(),note:'销售漏斗：邀约→…→交付'},
  {id:'Dscene',name:'客户场景（已停用）',shape:'flat',role:'context',multi:1,requiredFor:[],source:'manual',values:[],status:'off',note:'v1.2 删除，仅兼容旧数据'},
  {id:'Dcust',name:'客户类型（已停用）',shape:'flat',role:'context',multi:1,requiredFor:[],source:'manual',values:[],status:'off',note:'v1.2 删除，仅兼容旧数据'},
  {id:'Dcomp',name:'竞品（已停用）',shape:'flat',role:'context',multi:1,requiredFor:[],source:'manual',values:[],status:'off',note:'v1.2 删除，竞品进数据卡'},
  {id:'Dstage',name:'销售阶段（已停用）',shape:'flat',role:'context',multi:1,requiredFor:[],source:'manual',values:[],status:'off',note:'v1.2 并入 Dflow'}
);

/* 岗位画像：由 v23_data.js 的 3 档种子提供（产品知识按 Ddomain 计入；能力项仍 7 项） */

/* ---------- 工具 ---------- */
function kpV12BatchRank(b){return {'B1-30天':1,'B2-90天':2,'B3-后续':3}[b]||3}
function kpV12Type(k){return k.typeV12||(k.type==='技能型'?'技能':'概念')}
function kpV12Batch(k){return k.batch||'B2-90天'}
function kpV12Status(k){return k.statusV12||'结构已核'}
function kpV12Assess(k){return k.assess||{methods:'',anchorQ:0,practiceQ:0,anchorDrill:0,pass:70,validityDays:180}}
function kpV12CoversCar(k,car){
  if(!car||car==='全部车型')return true;
  const names=k.cars||[]; if(names.includes('通用车型')||names.includes(car))return true;
  const sr=V23_CAR_SERIES_OF[car]; if(sr&&names.includes(sr))return true;
  if(car==='澎程'&&(names.includes('澎程 N70')||names.includes('澎程 N90')))return true;
  if((car==='澎程 N70'||car==='澎程 N90')&&(names.includes('澎程 N70')||names.includes('澎程 N90')))return true;
  return false;
}
function kpV12MainLecture(k){
  return (S.contents||[]).find(c=>(c.kps||[]).includes(k.id)&&((c.kpRole&&c.kpRole[k.id])||'主讲解')==='主讲解'&&isPub(c)&&expState(c)!=='已过期');
}
function kpV12AnyMain(k){return (S.contents||[]).filter(c=>(c.kps||[]).includes(k.id)&&((c.kpRole&&c.kpRole[k.id])||'主讲解')==='主讲解')}
function kpV12AnchorQn(k){return (S.qs||[]).filter(q=>q.kp===k.id&&q.st==='已定稿'&&q.role==='锚题').length}
function kpV12PracticeQn(k){return (S.qs||[]).filter(q=>q.kp===k.id&&q.st==='已定稿'&&q.role!=='锚题').length}
function kpV12AnchorDrillN(k){return (S.drills||[]).filter(d=>d.kp===k.id&&d.st==='已定稿'&&d.role==='锚定演练').length}
function kpV12ReviewOk(k){return !k.reviewDue||k.reviewDue>=today}
function kpV12Health(k){
  const main=kpV12MainLecture(k);const owner=!!k.owner;
  const aq=kpV12AnchorQn(k),ad=kpV12AnchorDrillN(k);
  const needDrill=['卖点','技能','流程'].includes(kpV12Type(k));
  const spec=aq>=3&&(!needDrill||ad>=1);
  const fresh=!!main&&kpV12ReviewOk(k);
  const pending=kpV12Status(k)==='内容待核';
  const cells={
    owner:owner?{s:'ok',t:'负责人：'+k.owner}:{s:'err',t:'没有负责人（不能启用）'},
    exp:main?{s:'ok',t:(kpIsPlaceholder(main)?'合成占位讲解：'+main.title+'（默认不计入覆盖度）':'核心讲解：'+main.title)}:{s:'err',t:'没有核心讲解'},
    spec:spec?{s:'ok',t:'核心测评题 '+aq+' / 过关演练 '+ad}:{s:'warn',t:'核心测评题 '+aq+' / 过关演练 '+ad+'，未达考核规格'},
    fresh:fresh?{s:'ok',t:'在有效期/复核期内'}:{s:'warn',t:'过期/待复核/无主讲解'}
  };
  const vals=Object.values(cells).map(x=>x.s);
  let level=vals.includes('err')?'err':vals.includes('warn')?'warn':'ok';
  if(pending)level='warn';
  return {cells,level,pending,aq,ad,spec,fresh};
}
function kpV12Metrics(k,ctx){
  ctx=ctx||{};
  const role=ctx.role||'零售顾问',car=ctx.car||'SU7 Pro',batch=ctx.batch||'B3-后续',pri=ctx.pri||'P0';
  const st=kpV12Status(k);
  const inDenom=st!=='停用'&&st!=='草案'&&(k.roles||[]).includes(role)&&kpV12BatchRank(kpV12Batch(k))<=kpV12BatchRank(batch)&&kpV12CoversCar(k,car)&&(pri==='全部'||k.pri===pri);
  if(!inDenom)return null;
  const h=kpV12Health(k);
  const pending=h.pending;
  const includePh=ctx.placeholder==='include';
  const lecture=kpV12HasLecture(k,includePh);
  return {inDenom:true,coverage:lecture,teachable:lecture&&!pending,assessable:h.spec&&!pending,fresh:lecture&&kpV12ReviewOk(k)&&!pending,pending,placeholder:includePh?'include':'exclude'};
}
function kpV12Summary(ctx){
  let n=0,c=0,t=0,a=0,f=0,p=0;
  (S.kps||[]).forEach(k=>{const m=kpV12Metrics(k,ctx);if(!m)return;n++;if(m.coverage)c++;if(m.teachable)t++;if(m.assessable)a++;if(m.fresh)f++;if(m.pending)p++;});
  const pct=(x)=>n?Math.round(x/n*100):0;
  return {n,c,t,a,f,p,cov:pct(c),teach:pct(t),assess:pct(a),fresh:n?Math.round(f/Math.max(1,c)*100):0};
}
function kpV12PickLabel(k){return k.code+' · '+k.name+(k.batch?' · '+k.batch:'')}

/* ---------- 数据迁移：旧 K1–K25 / K_CEMN / K_SPIN → v1.2 ---------- */
function kpV12RemapContent(c,mainSeen){
  const old=c.kps||[];const oldMain=c.mainKp;
  const nk=[];
  old.forEach(id=>{const n=KP_LEGACY_MAP_V12[id];if(n&&!nk.includes(n))nk.push(n)});
  const nm=oldMain?KP_LEGACY_MAP_V12[oldMain]:null;
  if(nm&&!nk.includes(nm))nk.push(nm);
  const nr={};nk.forEach(n=>{nr[n]='补充材料'});
  let main='';
  if(nm&&!mainSeen.has(nm)){mainSeen.add(nm);main=nm;nr[nm]='主讲解'}
  c.kps=nk;c.kpRole=nr;c.mainKp=main||'';
}
function kpV12RemapAll(){
  const mainSeen=new Set();
  (S.contents||[]).forEach(c=>kpV12RemapContent(c,mainSeen));
  (S.qs||[]).forEach(q=>{const n=KP_LEGACY_MAP_V12[q.kp];if(n)q.kp=n;q.role=q.role||'练习题';q.point=q.point||1;q.version=q.version||1;q.anchorSetVersion=q.anchorSetVersion||1;});
  (S.drills||[]).forEach(d=>{const n=KP_LEGACY_MAP_V12[d.kp];if(n)d.kp=n;d.role=d.role||'练习演练';d.scoringVersion=d.scoringVersion||1;});
  (S.ansLog||[]).forEach(a=>{const n=KP_LEGACY_MAP_V12[a.kp];if(n)a.kp=n;});
  (S.topics||[]).forEach(t=>{if(t.kpId&&KP_LEGACY_MAP_V12[t.kpId])t.kpId=KP_LEGACY_MAP_V12[t.kpId]});
  S.mastery={};
}

/* ---------- 覆盖：tax 构造 / 种子 ---------- */
v23TaxDenom=function(car,onlyMg){
  return (S.tax||[]).filter(t=>t.pri==='P0'&&((onlyMg?(t.roles||[]).includes('店长'):(t.roles||[]).includes('零售顾问')))&&v23TaxCarMatch(t,car));
};
v23TaxDims=function(t){
  const d={};
  const carIds=dimIdsByNames('Dcar',t.cars||[]);if(carIds.length)d.Dcar=carIds;
  const dom=dimIdByName('Ddomain',t.domain);if(dom)d.Ddomain=[dom];
  const ab=t.ability?dimIdByName('Dab',t.ability):null;if(ab)d.Dab=[ab];
  const sp=t.sellpoint?dimIdByName('Dsell',t.sellpoint):null;if(sp)d.Dsell=[sp];
  const fl=t.stage?dimIdByName('Dflow',t.stage):null;if(fl)d.Dflow=[fl];
  return d;
};
v23TaxKp=function(id,t){
  return {id,code:t.code,name:t.name,one:t.one||'',type:t.typeLegacy,tags:[],dim:t.ability||'',
    car:(t.cars||['通用车型'])[0],cars:(t.cars||['通用车型']).slice(),syn:[t.name],owner:t.owner,st:'启用',ext:[],
    created:addDays(today,-15),hist:[{t:today,who:'总部培训部 刘翔',act:'v1.2 建库',note:t.code}],pre:[],rel:[],
    dims:v23TaxDims(t),taxCode:t.code,taxDomain:t.domain,taxAbility:t.ability,
    line:t.line,roles:(t.roles||[]).slice(),alsoRoles:(t.also||[]).slice(),carScope:(t.scope||[]).slice(),scopeLevel:t.scopeLevel,
    domain:t.domain,ability:t.ability||'',sellpoint:t.sellpoint||'',typeV12:t.type,batch:t.batch,stage:t.stage,pri:t.pri,
    assess:t.assess,behavior:t.behavior,ownerRole:t.ownerRole,statusV12:t.status,specVer:t.specVer||1,
    reviewDue:t.reviewDue||'',srcDoc:t.srcDoc||'',legacy:t.legacy||'',legacyV11:t.legacyV11||'',demoSeed:t.demo||'gap',note:t.note||'',simulated:true};
};
v23TaxSeed=function(){
  kpV12RemapAll();
  S.kps=KP_LIB_V12.map(t=>v23TaxKp(t.id,t));
  S.tax=KP_LIB_V12.map(t=>Object.assign({},t,{kpId:t.id,ab:t.ability,stages:[t.stage],pri:t.pri,legacy:t.legacy?[t.legacy]:[],src:t.ownerRole,doc:t.srcDoc}));
  const last={};S.kps.forEach(k=>{const prev=last[k.domain];if(prev){k.pre=[prev.id];prev.rel=(prev.rel||[]).concat(k.id)}last[k.domain]=k;});
  seedV12Demo();
  return S.tax;
};

/* ---------- 合成 Demo 资源（只补 20 ready + 28 lecture_only） ---------- */
function kpV12Content(k){
  if(kpV12AnyMain(k).length)return;
  if(!['ready','lecture_only'].includes(k.demoSeed))return;
  const id='N_V12_'+k.id;
  if((S.contents||[]).some(c=>c.id===id))return;
  const lect=(typeof LECTURERS!=='undefined'&&LECTURERS.includes(k.owner))?k.owner:(LECTURERS[0]||'王磊');
  const c=C0({id,title:'【主讲解】'+k.name,kind:'课程',type:'图文',lecturer:lect,cover:'默认封面.png',chan:['汽车销售'],vis:'全国',tags:[],intro:k.one,
    body:{mins:10,outline:'1. '+k.one+'\n2. 关键讲法\n3. 常见错误\n4. 练习'},kps:[k.id],kpRole:{[k.id]:'主讲解'},mainKp:k.id,
    st:'已定稿',pubSt:'已上架',pubVer:1,ver:1,vers:[],up:0,down:0,views:0,created:today,expire:'',
    source:'知识点库 v1.2 种子',creator:'总部培训部 刘翔',cK:'hq',rK:'hq',rName:'总部培训部 刘翔',simulated:true,origin:'v1.2 种子',placeholder:true});
  S.contents.unshift(c);
}
function kpV12Question(k,role,idx){
  const id='Q_V12_'+k.id+'_'+(role==='锚题'?'A':'P')+idx;
  if((S.qs||[]).some(q=>q.id===id))return;
  S.qs.push({id,kp:k.id,type:'单选',stem:'【'+role+'】'+k.name+'：以下哪项最符合要求？',opts:['按标准讲法','凭感觉讲','只报参数','回避问题'],ans:[0],
    why:'演示题：答案按标准讲法；真实上线前需业务出题与审题。',lv:1,src:'',st:'已定稿',owner:k.owner,created:today,
    stat:{n:0,ok:0},role,point:idx,difficulty:1,version:1,anchorSetVersion:1,effectiveFrom:today,simulated:true});
}
function kpV12Drill(k){
  if(!['卖点','技能','流程'].includes(kpV12Type(k)))return;
  if(kpV12AnchorDrillN(k)>=1)return;
  const id='D_V12_'+k.id;
  if((S.drills||[]).some(d=>d.id===id))return;
  S.drills.push({id,kp:k.id,name:'【锚定演练】'+k.name,scene:'展厅',persona:'客户提出与「'+k.name+'」相关的问题',src:'',
    turns:[{say:'你能具体讲讲「'+k.name+'」吗？',emo:['理解','明白'],must:[['关键点',[k.name.slice(0,4)]]],idea:[['先认同',['理解']]],ref:k.one}],
    st:'已定稿',role:'锚定演练',scoringVersion:1,owner:k.owner,created:today,stat:{n:0,sum:0,pass:0},simulated:true});
}
function seedV12Demo(){
  let nC=0,nQ=0,nD=0;
  S.kps.forEach(k=>{
    if(k.demoSeed==='ready'){
      kpV12Content(k);for(let i=1;i<=3;i++)kpV12Question(k,'锚题',i);kpV12Question(k,'练习题',1);kpV12Drill(k);
    }else if(k.demoSeed==='lecture_only'){
      kpV12Content(k);kpV12Question(k,'练习题',1);
    }
  });
  S.contents.forEach(c=>{if(c.simulated&&c.id.indexOf('N_V12_')===0)nC++});
  S.qs.forEach(q=>{if(q.simulated&&String(q.id).indexOf('Q_V12_')===0)nQ++});
  S.drills.forEach(d=>{if(d.simulated&&String(d.id).indexOf('D_V12_')===0)nD++});
  kpBackfillScopes(true);
  window.__KP_SEED_INFO={contents:nC,questions:nQ,drills:nD,ready:20,lecture_only:28,gap:16,pending:4};
}

/* ---------- 补学任务 / 人员（演示后台） ---------- */
function seedV12Tasks(){
  S.people=(S.lrn||[]).map(l=>({mid:l.mid,name:l.name,line:'销售',roles:[l.tier==='店长'?'店长':'零售顾问'],store:l.store,region:l.region,status:'在岗',hireDate:addDays(today,-l.hire),transferDate:'',updatedAt:today}));
  S.tasks=[];
  const kps=S.kps.filter(k=>k.batch!=='B3-后续').slice(0,10);
  (S.lrn||[]).slice(0,28).forEach((l,i)=>{
    const k=kps[i%kps.length];if(!k)return;
    const level=i%5===0?'L3-作废/重大':'L2-口径变更';
    const states=['已关闭','已复测','已确认','已读','未读','逾期','挂起'];
    const state=states[i%states.length];
    const dueOff=({'逾期':-(1+i%3),'未读':1+i%6,'已读':1+i%6,'已确认':1+i%6,'挂起':2+i%5})[state];/* 截止日与状态一致:逾期=已过截止,进行中=未到截止 */
    S.tasks.push({id:'T'+(i+1),mid:l.mid,name:l.name,kpId:k.id,kpCode:k.code,kpName:k.name,specVer:k.specVer,level,
      reason:'演示：'+k.name+' 口径变更',due:addDays(today,dueOff==null?-(1+i%4):dueOff),state,store:l.store,role:l.tier==='店长'?'店长':'零售顾问',line:'销售',
      sourceContentId:'',mergedFrom:[],ts:addDays(today,-4),readAt:state!=='未读'?addDays(today,-3):'',
      confirmedAt:['已确认','已复测','已关闭'].includes(state)?addDays(today,-2):'',retestedAt:['已复测','已关闭'].includes(state)?addDays(today,-1):''});
  });
  window.__KP_TASKS={total:S.tasks.length,done:S.tasks.filter(t=>['已复测','已关闭'].includes(t.state)).length,overdue:S.tasks.filter(t=>t.state==='逾期').length,people:S.people.length};
}

/* ---------- 数据校验：标准库与手工新增 / 编辑共用同一套规则 ---------- */
function kpV12ValidateKp(k){
  const errors=[];const add=m=>errors.push(m);
  const label=k.code||k.id||'未编号知识点';const type=kpV12Type(k);
  if(!k.id)add('缺少知识点 ID');if(!k.code)add(label+' 缺少标准编号');
  if(!String(k.name||'').trim())add(label+' 缺少名称');
  if(!KP_DICT_V12.domains.includes(k.domain))add(label+' 知识域不在字典：'+(k.domain||'空'));
  if(!KP_DICT_V12.types.includes(type))add(label+' 类型不在字典：'+type);
  if(!KP_DICT_V12.batches.includes(k.batch))add(label+' 批次不在字典：'+(k.batch||'空'));
  if(!KP_DICT_V12.stages.includes(k.stage))add(label+' 主要环节不在字典：'+(k.stage||'空'));
  const cars=kpCars(k);if(!cars.length)add(label+' 至少选择一个适用车型');
  const validCars=new Set((typeof V23_CAR_ALL!=='undefined'?V23_CAR_ALL:[]).concat((S.cfg&&S.cfg.tax&&S.cfg.tax.car)||[]));
  cars.forEach(c=>{if(!validCars.has(c))add(label+' 车型不在车型树：'+c)});
  if(cars.includes('通用车型')&&cars.length>1)add(label+' 通用车型不能与具体车型同时选择');
  const roles=k.roles||[];if(!roles.length)add(label+' 至少选择一个适用岗位');
  roles.forEach(r=>{if(!KP_DICT_V12.roles.includes(r))add(label+' 岗位不在字典：'+r)});
  if(k.domain==='产品知识'){
    if(k.ability)add(label+' 产品知识能力项应为空');
    if(!KP_SELLPOINT_LEAVES_V12.includes(k.sellpoint))add(label+' 产品知识请选择有效卖点分类');
  }else{
    if(!KP_DICT_V12.abilities.includes(k.ability))add(label+' 非产品知识请选择有效能力项');
    if(k.sellpoint)add(label+' 非产品知识不应填卖点分类');
  }
  if(type==='政策'&&kpV12Assess(k).validityDays!==30)add(label+' 政策类成绩有效期应为 30 天');
  return errors;
}
function kpV12ValidateAll(){
  const errors=[],warns=[],byField={};
  const addE=(f,m)=>{errors.push(m);byField[f]=(byField[f]||0)+1};
  const ids=new Set(),codes=new Set();
  (S.kps||[]).forEach(k=>{
    if(ids.has(k.id))addE('kp_id','重复 ID '+k.id);ids.add(k.id);
    if(codes.has(k.code))addE('kp_code','重复编号 '+k.code);codes.add(k.code);
    kpV12ValidateKp(k).forEach(m=>{const field=/知识域/.test(m)?'domain':/类型/.test(m)?'type':/批次/.test(m)?'batch':/环节/.test(m)?'stage':/能力项/.test(m)?'ability':/卖点/.test(m)?'sellpoint':/车型/.test(m)?'car':/岗位/.test(m)?'role':/有效期/.test(m)?'validity':'kp';addE(field,m)});
  });
  const mainCount={};(S.contents||[]).forEach(c=>{(c.kps||[]).forEach(id=>{if(((c.kpRole&&c.kpRole[id])||'主讲解')==='主讲解')mainCount[id]=(mainCount[id]||0)+1})});
  Object.keys(mainCount).forEach(id=>{if(mainCount[id]>1)addE('main_lecture','知识点 '+id+' 有 '+mainCount[id]+' 条主讲解')});
  (S.kps||[]).forEach(k=>{const h=kpV12Health(k);if(h.level!=='ok')warns.push(k.code+'：'+[h.cells.owner.s!=='ok'?'缺负责人':'',h.cells.exp.s!=='ok'?'缺主讲解':'',h.cells.spec.s!=='ok'?'缺考核规格':'',h.cells.fresh.s!=='ok'?'时效待处理':''].filter(Boolean).join(' / '))});
  const out={total:(S.kps||[]).length,errors:errors.length,warns:warns.length,errorList:errors,warnList:warns,byField};
  window.__KP_VALIDATION=out;return out;
}

/* ---------- 覆盖：健康 / 目标 / 详情 ---------- */
kpHealth=function(k){return kpV12Health(k)};
kpDimsHtml=function(k){
  const rows=[['业务线',k.line],['岗位',(k.roles||[]).join('、')],['适用车型',kpCarText(k)],['知识域',k.domain],
    ['能力项',k.ability||'—（产品知识用卖点分类）'],['卖点分类',k.sellpoint||'—'],['类型',kpV12Type(k)],['批次',kpV12Batch(k)],
    ['主要环节',k.stage],['考核方式',(kpV12Assess(k).methods||'—')],['有效期',(kpV12Assess(k).validityDays||'—')+' 天'],['负责人角色',k.ownerRole||'—']];
  return rows.filter(x=>x[1]).map(x=>'<div class="kv-line"><span>'+x[0]+'</span><b>'+esc(x[1])+'</b></div>').join('')+'<div class="hint" style="margin-top:6px">产品知识不占能力项；过关与复测只看核心测评题 / 过关情景演练，巩固练习不计入。</div>';
};

/* ---------- 覆盖：总览 ---------- */
A.kpV12OvSet=el=>{UI.sel.kpOv=Object.assign(UI.sel.kpOv||{},{[el.dataset.k]:el.value});render()};
function kpV12Heat(kind,ctx){
  const cols=kind==='sell'?KP_SELLPOINT_LEAVES_V12:KP_DICT_V12.abilities;
  const rows=V23_CAR_LEAVES.slice();
  const cell=(car,col)=>{
    let n=0,t=0,a=0;
    (S.kps||[]).forEach(k=>{
      if(kind==='sell'){if(k.domain!=='产品知识'||k.sellpoint!==col)return}else{if(k.ability!==col)return}
      const m=kpV12Metrics(k,Object.assign({},ctx,{car}));if(!m)return;n++;if(m.teachable)t++;if(m.assessable)a++;
    });
    if(!n)return '<span class="hint">—</span>';
    const p=Math.round(t/n*100);const cls=p>=80?'ok':p>0?'warn':'err';
    return '<span class="tag '+cls+'" title="可授课 '+t+' / '+n+'；可考核 '+a+'">'+t+'/'+n+'</span>';
  };
  return '<div class="tw"><table class="t nw"><tr><th>车型</th>'+cols.map(c=>'<th>'+esc(c)+'</th>').join('')+'</tr>'
    +rows.map(car=>'<tr><td><b>'+esc(car)+'</b></td>'+cols.map(c=>'<td>'+cell(car,c)+'</td>').join('')+'</tr>').join('')
    +'</table></div><div class="hint" style="margin-top:6px">格子 = 可授课知识点 / 应有知识点；鼠标悬停看可考核数。当前口径：'+esc(ctx.pri==='P0'?'P0（兼容基线）':ctx.pri)+'。</div>';
}
kpOverviewNew=function(){
  const ctx=UI.sel.kpOv||(UI.sel.kpOv={role:'零售顾问',car:'SU7 Pro',batch:'B3-后续',pri:'P0'});
  const s=kpV12Summary(ctx);
  const val=window.__KP_VALIDATION||kpV12ValidateAll();
  const t=window.__KP_TASKS||{total:0,done:0,overdue:0,people:0};
  const card=(l,v,h)=>'<div class="stat"><div class="l">'+l+'</div><div class="n">'+v+'</div><div class="hint">'+h+'</div></div>';
  const sel=(k,label,arr)=>'<div class="fi2"><label>'+label+'</label><select data-act="kpV12OvSet" data-k="'+k+'">'+arr.map(x=>'<option value="'+esc(x)+'" '+(ctx[k]===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></div>';
  const gaps=(S.kps||[]).filter(k=>kpV12Health(k).level==='err');
  const gapBy={};gaps.forEach(k=>{gapBy[k.domain]=(gapBy[k.domain]||[]).concat(k)});
  const taskRows=(S.tasks||[]).slice(0,8).map(x=>'<tr><td>'+esc(x.name||x.mid)+'</td><td>'+esc(x.kpCode)+'</td><td>'+esc(x.store)+'</td><td>'+esc(x.level)+'</td><td><span class="tag '+(x.state==='逾期'?'err':['已复测','已关闭'].includes(x.state)?'ok':'warn')+'">'+esc(x.state)+'</span></td><td>'+esc(x.due)+'</td></tr>').join('');
  return srcBar('v1.2 总览：按「岗位 × 车型 × 批次 × P0/P1」算四指标。内容待核进分母、不进分子；产品知识用卖点分类，不占能力项。')
   +'<div class="grid g4" style="margin-bottom:12px">'+card('应覆盖',s.n,'岗位×车型×批次×口径')+card('覆盖度',s.cov+'%',s.c+' / '+s.n+' 有主讲解')+card('可授课率',s.teach+'%',s.t+' / '+s.n+' 已上架未过期')+card('可考核率',s.assess+'%',s.a+' / '+s.n+' 有锚题+锚定演练')+'</div>'
   +'<div class="grid g4" style="margin-bottom:12px">'+card('时效健康度',s.fresh+'%',s.f+' / '+Math.max(1,s.c)+' 未过期/未超复核')+card('内容待核',s.p,'进分母、不进分子')+card('补学任务',t.done+' / '+t.total,'逾期 '+t.overdue+' · 人员 '+t.people)+card('数据校验',val.errors+' error',val.warns+' warn（缺口提示）')+'</div>'
   +'<div class="card"><h3>口径</h3><div class="filg">'+sel('role','岗位',KP_DICT_V12.roles)+sel('car','车型',['全部车型'].concat(V23_CAR_LEAVES))+sel('batch','批次',KP_DICT_V12.batches)+sel('pri','口径',['P0','P1','全部'])+'</div><div class="hint">默认 SU7 Pro / P0 / 全部批次，分母应为 33；切到 B1 看新人 12 个点。</div></div>'
   +'<div class="card"><h3>车型 × 卖点分类（产品知识）</h3>'+kpV12Heat('sell',ctx)+'</div>'
   +'<div class="card"><h3>车型 × 能力项（销售动作）</h3>'+kpV12Heat('ability',ctx)+'</div>'
   +'<div class="card"><h3>P0 缺口 <span class="hint">共 '+gaps.length+' 条；按知识域分组</span></h3>'+(gaps.length?Object.keys(gapBy).map(d=>'<div style="padding:6px 0;border-top:1px solid #f2f3f5"><b>'+esc(d)+' · '+gapBy[d].length+'</b><div style="margin-top:4px;line-height:2">'+gapBy[d].slice(0,12).map(k=>'<span class="tag warn" style="margin:0 5px 5px 0;padding:2px 8px" data-act="kpOpen" data-id="'+k.id+'">'+esc(k.code+' '+k.name)+'</span>').join('')+'</div></div>').join(''):'<div class="chk ok"><b>✓</b><span>没有缺口</span></div>')+'</div>'
   +(function(){
     const by={};(S.kps||[]).forEach(k=>{if(k.stage==='不直接对应')return;const w=kpWeak(k),t=kpTested(k);const x=by[k.stage]=by[k.stage]||{n:0,w:0,t:0};x.n++;x.w+=w;x.t+=t});
     const rows=Object.keys(by).sort((a,b)=>(by[b].t?by[b].w/by[b].t:0)-(by[a].t?by[a].w/by[a].t:0));
     return '<div class="card"><h3>业务环节对照 <span class="hint">事先声明：知识点→环节；只做可定位/可对照/可复测，不作因果结论</span></h3>'+(rows.length?'<div class="tw"><table class="t"><tr><th>业务环节</th><th>知识点数</th><th>已测人次</th><th>未过关人次</th><th>未过关占比</th></tr>'+rows.map(st=>{const x=by[st];const p=x.t?Math.round(x.w/x.t*100):0;return '<tr><td><b>'+esc(st)+'</b></td><td>'+x.n+'</td><td>'+x.t+'</td><td>'+x.w+'</td><td><span class="tag '+(p>=50?'err':p?'warn':'ok')+'">'+p+'%</span></td></tr>'}).join('')+'</table></div>':'<div class="hint">还没有可对照的知识点</div>')+'<div class="hint" style="margin-top:6px">样本量/对照批在真实接入后由效果页给出；Demo 只演示映射关系。</div></div>';
   })()
   +'<div class="card"><h3>补学进度 <span class="hint">一期不做用户端推送；后台可看/可导出</span></h3>'+(taskRows?'<div class="tw"><table class="t"><tr><th>人</th><th>知识点</th><th>门店</th><th>级别</th><th>状态</th><th>截止</th></tr>'+taskRows+'</table></div>':'<div class="hint">没有任务</div>')+'<div class="hint" style="margin-top:6px">完成 '+t.done+' / '+t.total+'；逾期 '+t.overdue+'；人员主数据 '+t.people+' 人（只读，来源人员发展平台）</div></div>'
   +'<div class="card"><h3>数据校验 <span class="hint">error 必须为 0；warn 是缺口提示</span></h3><div class="hint">error '+val.errors+' · warn '+val.warns+' · total '+val.total+'</div>'+(val.errorList.length?'<div class="tag err" style="display:block;margin-top:6px;white-space:normal">'+val.errorList.slice(0,8).map(esc).join('<br>')+'</div>':'<div class="chk ok" style="margin-top:6px"><b>✓</b><span>无结构错误</span></div>')+'</div>';
};

/* ---------- 覆盖：知识点库列表（默认精简，按需展开完整字段） ---------- */
function kpV12ListMatch(k,f){
  const h=kpV12Health(k);
  if(f.line&&k.line!==f.line)return false;
  if(f.role&&!(k.roles||[]).includes(f.role))return false;
  if(f.car==='通用车型'&&!kpCars(k).includes('通用车型'))return false;
  if(f.car&&f.car!=='通用车型'&&!(V23_CAR_TREE[f.car]?kpCarOverlap(kpCars(k),[f.car]):kpV12CoversCar(k,f.car)))return false;
  if(f.domain&&k.domain!==f.domain)return false;
  if(f.ability&&k.ability!==f.ability)return false;
  if(f.sellpoint&&k.sellpoint!==f.sellpoint)return false;
  if(f.batch&&kpV12Batch(k)!==f.batch)return false;
  if(f.status&&kpV12Status(k)!==f.status)return false;
  if(f.pri&&f.pri!=='全部'&&k.pri!==f.pri)return false;
  if(f.owner&&(f.owner==='(无)'?!k.owner:k.owner!==f.owner))return false;
  if(f.lv==='只看有缺口'&&h.level!=='err')return false;
  if(f.lv==='只看待补'&&h.level!=='warn')return false;
  if(f.lv==='只看完备'&&h.level!=='ok')return false;
  if(f.lv==='未完备'&&kpGapList(k,h).length===0&&!h.pending)return false;
  if(f.view==='mine'&&k.owner!==meShort())return false;
  if(f.view==='p0gap'&&!(k.pri==='P0'&&h.cells.exp.s!=='ok'))return false;
  if(f.view==='assess'&&h.cells.spec.s==='ok')return false;
  if(f.view==='review'&&!(kpV12Type(k)==='政策'||!kpV12ReviewOk(k)||h.pending))return false;
  if(f.q){const q=f.q.trim();if(q&&!(k.name.includes(q)||String(k.code||'').includes(q)||k.id===q||(k.legacy&&k.legacy.includes(q))||(k.syn||[]).some(w=>w.includes(q))))return false}
  return true;
}
A.kpView=el=>{const f=kpLibFilter();f.view=f.view===el.dataset.v?'':el.dataset.v;UI.sel.kpPage={page:1,size:20};render()};
A.kpFull=()=>{const f=kpLibFilter();f.full=!f.full;render()};
A.kpMore=()=>{const f=kpLibFilter();f.more=!f.more;render()};
A.kpEditRow=el=>{UI.kid=el.dataset.id;A.kpEdit()};
kpLibrary=function(){
  const f=kpLibFilter();const full=!!f.full;
  const rows=(S.kps||[]).filter(k=>kpV12ListMatch(k,f));
  const sort=f.sort||'gap';
  const MORE=['line','role','ability','sellpoint','batch','status','pri','owner'];const nMore=MORE.filter(x=>f[x]).length;const nAct=Object.keys(f).filter(x=>f[x]&&!['more','full','sort'].includes(x)).length;
  if(sort==='name')rows.sort((a,b)=>a.name.localeCompare(b.name,'zh'));
  if(sort==='gap')rows.sort((a,b)=>{const r=x=>(x.pri==='P0'?0:3)+(kpV12Health(x).level==='err'?0:kpV12Health(x).level==='warn'?1:2);return r(a)-r(b)||a.name.localeCompare(b.name,'zh')});
  if(sort==='pri')rows.sort((a,b)=>String(a.pri).localeCompare(String(b.pri))||a.name.localeCompare(b.name,'zh'));
  UI.kpOrder=rows.map(k=>k.id);
  const pg=lstPage('kpPage',rows);
  const sel=(key,label,arr)=>'<div class="fi2"><label>'+label+'</label><select data-wc="kpset" data-k="'+key+'"><option value="">全部</option>'+arr.map(x=>'<option value="'+esc(x)+'" '+(f[key]===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></div>';
  const carOpts='<option value="">全部车型</option><option value="通用车型" '+(f.car==='通用车型'?'selected':'')+'>通用车型</option>'+Object.keys(V23_CAR_TREE).map(sr=>'<optgroup label="'+esc(sr)+'"><option value="'+esc(sr)+'" '+(f.car===sr?'selected':'')+'>'+esc(sr)+' 全系</option>'+V23_CAR_TREE[sr].map(v=>'<option value="'+esc(v)+'" '+(f.car===v?'selected':'')+'>'+esc(v)+'</option>').join('')+'</optgroup>').join('');
  const views=[['mine','我负责的'],['p0gap','P0 缺讲解'],['assess','考核不全'],['review','政策 / 待复核']];
  const viewBar='<div class="kp-view-bar"><span>常用视图</span>'+views.map(v=>'<button type="button" class="kp-view '+(f.view===v[0]?'on':'')+'" data-act="kpView" data-v="'+v[0]+'">'+v[1]+'</button>').join('')+(f.view?'<button type="button" class="link" data-act="kpView" data-v="'+f.view+'">取消视图</button>':'')+'</div>';
  const primary='<div class="filg kp-filter-primary">'
    +'<div class="fi2"><label>搜索</label><input data-wc="kpq" value="'+esc(f.q||'')+'" placeholder="编号 / 名称 / 旧编号"></div>'
    +'<div class="fi2"><label>适用车型</label><select data-wc="kpset" data-k="car">'+carOpts+'</select></div>'
    +sel('domain','知识域',KP_DICT_V12.domains)
    +'<div class="fi2"><label>完备度</label><select data-wc="kpset" data-k="lv"><option value="">全部</option>'+['未完备','只看有缺口','只看待补','只看完备'].map(x=>'<option '+(f.lv===x?'selected':'')+'>'+x+'</option>').join('')+'</select></div></div>';
  const more='<div class="filg kp-more-filters" '+(f.more?'':'hidden')+'>'
    +sel('line','业务线',KP_DICT_V12.businessLines)+sel('role','岗位',KP_DICT_V12.roles)
    +sel('ability','能力项',KP_DICT_V12.abilities)+sel('sellpoint','卖点分类',KP_SELLPOINT_LEAVES_V12)
    +sel('batch','批次',KP_DICT_V12.batches)+sel('status','内容状态',KP_DICT_V12.statuses)+sel('pri','优先级',['P0','P1','全部'])
    +sel('owner','负责人',kpOwners().concat(['(无)']))
    +'</div>';
  const filter='<div class="card kp-filter-card">'+viewBar+primary+more+'<div class="kp-filter-actions"><button class="btn sm" data-act="kpMore">'+(f.more?'收起筛选':'更多筛选'+(nMore?'（已选 '+nMore+'）':''))+'</button><button class="btn sm" data-act="kpFclr" '+(nAct?'':'disabled')+'>清除筛选</button><span class="sp"></span><button class="btn sm" data-act="kpFull">'+(full?'返回精简视图':'完整字段')+'</button>'
    +lstCsvBtn(['编号','名称','业务线','岗位','车型','知识域','能力/卖点','类型','批次','主要环节','完备度'],[['编号','名称','业务线','岗位','车型','知识域','能力/卖点','类型','批次','主要环节','完备度']].concat(rows.map(k=>[k.code,k.name,k.line,(k.roles||[]).join('、'),kpCarText(k),k.domain,k.ability||k.sellpoint,kpV12Type(k),kpV12Batch(k),k.stage,kpV12Health(k).level])),'知识点库')+'</div></div>';
  const nameCell=k=>'<td class="kp-name-cell"><a class="link" data-act="kpOpen" data-id="'+k.id+'">'+esc(k.name)+'</a>'+(typeof rvChip==='function'?' '+rvChip('kp',k.id):'')+'<div class="hint">'+esc(k.code)+' · '+esc(k.one||'暂未填写一句话定义')+'</div></td>';
  const healthCell=(k,h)=>'<td><span class="kp-dots" title="负责人 / 主讲解 / 考核规格 / 时效">'+kpDots(h)+'</span> <span class="tag '+(h.level==='ok'?'ok':h.level==='warn'?'warn':'err')+'">'+(h.level==='ok'?'完备':h.level==='warn'?'待补':'缺口')+'</span>'+(h.pending?' <span class="tag warn">待核</span>':'')+'</td>';
  const gapCell=(k,h)=>'<td class="kp-gap-cell">'+(h.level==='ok'?'<span class="tag ok">完备</span>':kpGapChips(k,h))+(h.pending?' <span class="tag warn">内容待核</span>':'')+'</td>';
  const actionCell=k=>'<td class="kp-row-actions"><a class="link" data-act="kpOpen" data-id="'+k.id+'">查看</a> <a class="link" data-act="kpEditRow" data-id="'+k.id+'">编辑</a></td>';
  const compactHead='<tr><th>知识点</th><th>适用车型</th><th>分类</th><th>负责人</th><th>状态 / 缺什么</th><th>操作</th></tr>';
  const compactRow=k=>{const h=kpV12Health(k);return '<tr class="kp-click" data-act="kpOpen" data-id="'+k.id+'">'+nameCell(k)+'<td class="kp-car-cell">'+esc(kpCarText(k))+'</td><td><b>'+esc(k.domain)+'</b><div class="hint">'+esc(k.ability||('卖点 · '+(k.sellpoint||'—')))+' · '+esc(kpV12Type(k))+'</div></td><td>'+(k.owner?esc(k.owner):'<span class="tag err">未指定</span>')+'</td>'+gapCell(k,h)+actionCell(k)+'</tr>'};
  const fullHead='<tr><th>知识点</th><th>编号</th><th>业务线/岗位</th><th>适用车型</th><th>知识域</th><th>能力 / 卖点</th><th>类型/批次</th><th>主要环节</th><th>完备度</th><th>考核规格</th><th>弱点</th><th>操作</th></tr>';
  const fullRow=k=>{const h=kpV12Health(k);return '<tr class="kp-click" data-act="kpOpen" data-id="'+k.id+'">'+nameCell(k)+'<td><b>'+esc(k.code)+'</b><div class="hint">'+(k.legacy?'旧 '+esc(k.legacy):'')+'</div></td><td>'+esc(k.line)+'<div class="hint">'+esc((k.roles||[]).join('、'))+'</div></td><td class="kp-car-cell">'+esc(kpCarText(k))+'</td><td>'+esc(k.domain)+'</td><td>'+esc(k.ability||('卖点 · '+(k.sellpoint||'—')))+'</td><td>'+esc(kpV12Type(k))+'<div class="hint">'+esc(kpV12Batch(k))+'</div></td><td>'+esc(k.stage)+'</td>'+healthCell(k,h)+'<td>'+h.aq+' 锚 / '+h.ad+' 演练</td><td>'+kpWeakTxt(k)+'</td>'+actionCell(k)+'</tr>'};
  return ''
    +filter+'<div class="card"><div class="kp-list-head"><h3>知识点清单 <span class="hint">'+(nAct?'筛选后 '+rows.length+' / '+S.kps.length+' 条':'共 '+S.kps.length+' 条')+'</span></h3><div class="kp-list-tools"><label class="hint">排序 <select data-wc="kpset" data-k="sort"><option value="gap" '+(sort==='gap'?'selected':'')+'>缺口优先（P0 在前）</option><option value="pri" '+(sort==='pri'?'selected':'')+'>优先级</option><option value="name" '+(sort==='name'?'selected':'')+'>名称</option></select></label><span class="hint">'+(full?'完整字段':'精简视图')+'</span></div></div><div class="tw"><table class="t nw stk kp-list '+(full?'full':'compact')+'">'+(full?fullHead:compactHead)
    +pg.rows.map(full?fullRow:compactRow).join('')+'</table></div>'+lstPager('kpPage',pg)+(rows.length?'':(S.kps.length?uxEmpty({title:'没有符合条件的知识点',desc:'换个关键词，或清除筛选后再看。',act:'kpFclr',label:'清除筛选'}):uxEmpty({title:'知识点库还是空的',desc:'先新增一个知识点，或批量导入标准清单。',act:'kpNew',label:'新增知识点',act2:'kpOpenBatch',label2:'批量导入'})))+'</div>';
};

/* ---------- 覆盖：配置中心知识点库 v1.2 ---------- */
cfgTaxLib=function(){
  if(typeof S==='undefined'||!S||!S.tax)return srcBar('知识点库 v1.2 是「公司应该覆盖哪些知识点」的标准清单。')+v23EmptyCta('知识点库 v1.2');
  const val=window.__KP_VALIDATION||kpV12ValidateAll();
  const cnt=(b)=>S.tax.filter(t=>t.batch===b).length;
  const stat=(l,n,h)=>'<div class="stat"><div class="l">'+l+'</div><div class="n">'+n+'</div><div class="hint">'+h+'</div></div>';
  return srcBar('v1.2 标准库：68 条，按业务线/岗位/车型/知识域/卖点分类/类型/批次/主要环节结构化。标签已取消；产品知识用卖点分类，不占能力项。')
    +'<div class="grid g4" style="margin-bottom:12px">'+stat('知识点',S.tax.length,'B1 '+cnt('B1-30天')+' / B2 '+cnt('B2-90天')+' / B3 '+cnt('B3-后续'))+stat('内容待核',S.tax.filter(t=>t.status==='内容待核').length,'进分母、不进分子')+stat('校验 error',val.errors,'必须为 0')+stat('校验 warn',val.warns,'缺口提示，不是失败')+'</div>'
    +'<div class="card"><h3>68 条清单</h3><div class="tw"><table class="t nw stk"><tr><th>编号</th><th>知识点</th><th>业务线</th><th>岗位</th><th>车型</th><th>知识域</th><th>能力/卖点</th><th>类型</th><th>批次</th><th>主要环节</th><th>状态</th><th>完备度</th></tr>'
    +S.tax.map(t=>{const k=kp(t.kpId);const h=k?kpV12Health(k):null;return '<tr><td><b>'+esc(t.code)+'</b><div class="hint">'+(t.legacy&&t.legacy.length?'旧 '+esc(t.legacy.join('/')):'')+'</div></td><td style="white-space:normal;min-width:200px">'+esc(t.name)+'</td><td>'+esc(t.line||'')+'</td><td>'+esc((t.roles||[]).join('、'))+'</td><td style="white-space:normal;min-width:130px">'+esc((t.cars||[]).join('、'))+'</td><td>'+esc(t.domain)+'</td><td>'+esc(t.ability||('卖点 · '+(t.sellpoint||'—')))+'</td><td>'+esc(t.type)+'</td><td>'+esc(t.batch)+'</td><td>'+esc(t.stage)+'</td><td>'+esc(t.status)+'</td><td>'+(h?'<span class="tag '+(h.level==='ok'?'ok':h.level==='warn'?'warn':'err')+'">'+(h.level==='ok'?'完备':h.level==='warn'?'待补':'缺口')+'</span>':'—')+'</td></tr>'}).join('')
    +'</table></div></div>'
    +'<div class="card"><h3>校验明细</h3><div class="hint">error '+val.errors+' · warn '+val.warns+'</div>'+(val.errorList.length?'<div class="tag err" style="display:block;margin-top:6px;white-space:normal">'+val.errorList.slice(0,12).map(esc).join('<br>')+'</div>':'<div class="chk ok" style="margin-top:6px"><b>✓</b><span>无结构错误</span></div>')+(val.warnList.length?'<details style="margin-top:8px"><summary class="link">查看 warn（前 20 条）</summary><div class="hint" style="line-height:1.9;margin-top:6px">'+val.warnList.slice(0,20).map(esc).join('<br>')+'</div></details>':'')+'</div>';
};

/* ---------- 覆盖：内容选择器（主讲解 / 补充 / 提及） ---------- */
kpPicker=function(){
  const has=C.kps||[];const sel=has.map(kp).filter(Boolean);
  const role=kid=>(C.kpRole&&C.kpRole[kid])||(C.mainKp===kid?'主讲解':'补充材料');
  const opts=(S.kps||[]).filter(k=>k.st==='启用'&&!has.includes(k.id)&&kpCarOk(k,C.kind==='话术'?C.car:''));
  return (sel.length?'<div style="margin-bottom:8px">'+sel.map(k=>{const r=role(k.id);return '<span class="tag '+(r==='主讲解'?'pri':'')+'" style="margin:0 6px 6px 0;padding:3px 8px">'+(r==='主讲解'?'核心讲解 · ':r==='补充材料'?'补充 · ':'提及 · ')+esc(k.name)+' <a class="link" data-act="cKpRole" data-v="'+k.id+'">'+(r==='主讲解'?'改为补充':'设为核心讲解')+'</a> <a class="link" data-act="cKpDel" data-v="'+k.id+'">×</a></span>'}).join('')+'</div>':'<div class="hint" style="margin-bottom:6px">还没有挂知识点。上架前必须挂至少 1 个；草稿可以暂不挂。</div>')
    +(sel.length>1?'<div class="hint" style="margin-bottom:6px;line-height:1.7">一个知识点只能有 1 条核心讲解；补充材料不影响新人必学路径。</div>':'')
    +(function(){const rec=(typeof recKpsFor==='function'?recKpsFor({title:C.title||'',kw:C.kw||'',car:C.car||'',text:(C.kind==='话术'?Object.values(C.spin||{}).join(' '):(C.intro||''))+' '+(C.bscene||'')},3):[]).filter(k=>!has.includes(k.id));return rec.length?'<div style="margin:6px 0"><span class="hint">系统推荐：</span>'+rec.map(k=>'<span class="tag blue" style="cursor:pointer;margin:0 6px 4px 0;padding:3px 8px" data-act="cKpRec" data-v="'+k.id+'">+ '+esc(k.name)+'</span>').join('')+'</div>':''})()
    +'<input list="cp_kl" data-wc="cKpAdd" placeholder="输入编号/名称搜索知识点，如 KP-SALE-13" style="width:100%;max-width:460px"><datalist id="cp_kl">'+opts.map(k=>'<option value="'+esc(kpV12PickLabel(k))+'"></option>').join('')+'</datalist>'
    +'<div class="hint" style="margin-top:4px">'+(C.kind==='话术'&&C.car&&C.car!=='通用车型'?'已按车型「'+esc(C.car)+'」预过滤：可选 '+opts.length+' 个':'可选 '+opts.length+' 个')+'</div>'
    +'<div id="cKpAdv">'+(typeof aiContentKpAdviceHtml==='function'?aiContentKpAdviceHtml():'')+'<div class="hint"><a class="link" data-act="aiWhy">为什么这样建议</a> · 可解释规则：知识点名称/同义词/车型匹配</div></div>';
};
A.cKpAdd=function(el){
  const v=(el.value||'').trim();if(!v)return;
  const k=(S.kps||[]).find(x=>x.id===v)||(S.kps||[]).find(x=>kpV12PickLabel(x)===v||x.name===v||x.code===v);
  if(!k)return toast('没有这个知识点，请从提示列表里选','err');
  C.kps=C.kps||[];C.kpRole=C.kpRole||{};
  if(!C.kps.includes(k.id)){C.kps.push(k.id);C.kpRole[k.id]=C.mainKp?'补充材料':'主讲解';if(!C.mainKp)C.mainKp=k.id}
  render();
};
A.cKpRec=function(el){
  C.kps=C.kps||[];C.kpRole=C.kpRole||{};
  if(!C.kps.includes(el.dataset.v)){C.kps.push(el.dataset.v);C.kpRole[el.dataset.v]=C.mainKp?'补充材料':'主讲解';if(!C.mainKp)C.mainKp=el.dataset.v}
  render();
};
A.cKpRole=function(el){
  C.kpRole=C.kpRole||{};const id=el.dataset.v;
  if(C.mainKp===id)C.mainKp='';else C.mainKp=id;
  (C.kps||[]).forEach(kid=>{C.kpRole[kid]=kid===C.mainKp?'主讲解':'补充材料'});
  render();
};

/* ---------- 车系范围 / 合成占位（业务规则） ----------
   题、演练的 carScope 只到车系（SU7 / YU7 / 澎程 N70 / 澎程 N90），空数组 = 通用。
   组卷按目标车系过滤：专属题不能进其他车系的卷。合成占位主讲解打 placeholder，默认不进覆盖度 / 可授课率。 */
const KP_SERIES_V12=['SU7','YU7','澎程 N70','澎程 N90'];
function kpNormalizeScope(list){
  const out=[];(list||[]).forEach(x=>{if(KP_SERIES_V12.includes(x)&&!out.includes(x))out.push(x)});
  return out;
}
function kpInferSeries(text){
  const s=String(text||'');const hit=[];
  if(/SU7/.test(s))hit.push('SU7');
  if(/YU7/.test(s))hit.push('YU7');
  if(/N70(?!\d)/.test(s))hit.push('澎程 N70');
  if(/N90(?!\d)/.test(s))hit.push('澎程 N90');
  if(/澎程/.test(s)&&!hit.some(x=>x.indexOf('澎程')===0)){hit.push('澎程 N70','澎程 N90')}
  return hit;
}
function kpDrillText(d){
  if(!d)return '';
  const turns=(d.turns||[]).map(t=>[t.say,t.ref,t.mustT,t.ideaT,(t.must||[]).map(m=>(m[0]||'')+' '+((m[1]||[]).join(' '))).join(' '),(t.idea||[]).map(m=>(m[0]||'')+' '+((m[1]||[]).join(' '))).join(' ')].join(' ')).join('\n');
  return [d.name,d.persona,d.scene,turns].join('\n');
}
function kpDrillFormText(d){return kpDrillText(d)}
function kpSeriesOfCar(car){
  if(!car||car==='全部车型'||car==='通用车型')return '';
  if(KP_SERIES_V12.includes(car))return car;
  if(typeof V23_CAR_SERIES_OF!=='undefined'&&V23_CAR_SERIES_OF[car])return V23_CAR_SERIES_OF[car];
  if(car==='澎程')return '澎程';
  return '';
}
function kpAssetScope(item){return kpNormalizeScope(item&&item.carScope)}
function kpAssetFitsCar(item, car){
  const scope=kpAssetScope(item);
  if(!scope.length)return true;
  const sr=kpSeriesOfCar(car);
  if(!sr)return true;
  if(sr==='澎程')return scope.some(x=>x.indexOf('澎程')===0);
  return scope.includes(sr);
}
function kpKpSeries(k){
  const out=[];((k&&k.cars)||[]).forEach(n=>{
    if(!n||n==='通用车型')return;
    const sr=kpSeriesOfCar(n);
    if(sr==='澎程'){['澎程 N70','澎程 N90'].forEach(x=>{if(!out.includes(x))out.push(x)});return}
    if(sr&&!out.includes(sr))out.push(sr);
  });
  return out;
}
function kpCoversSeries(k, car){
  const sr=kpSeriesOfCar(car)||'';
  if(!sr)return true;
  if(kpV12CoversCar(k, car)||kpV12CoversCar(k, sr))return true;
  const leaves=(typeof V23_CAR_TREE!=='undefined'&&V23_CAR_TREE[sr])||[];
  return leaves.some(v=>kpV12CoversCar(k, v));
}
function kpPaperCar(kid, explicit){
  if(explicit)return explicit;
  const k=kid&&typeof kp==='function'?kp(kid):null;
  const series=k?kpKpSeries(k):[];
  const sess=(typeof R!=='undefined'&&R&&R.diagCar)||'';
  const sessSr=kpSeriesOfCar(sess);
  if(series.length===1)return series[0];
  if(series.length>1)return (sessSr&&series.includes(sessSr))?sessSr:series[0];
  if(sess)return sess;
  return 'SU7';
}
function kpDiagTarget(car){
  const v=car||((typeof R!=='undefined'&&R&&R.diagCar)||'SU7');
  if(typeof R!=='undefined'&&R)R.diagCar=v;
  return v;
}
function kpScopeShown(item, text){
  if(item&&(item._scopeTouched||item.carScopeManual))return kpNormalizeScope(item.carScope);
  return kpInferSeries(text);
}
function kpScopeFieldHtml(item, text, act){
  const on=kpScopeShown(item, text);
  return KP_SERIES_V12.map(s=>'<label style="margin-right:12px;font-size:13px"><input type="checkbox" data-wc="'+act+'" data-v="'+esc(s)+'" '+(on.includes(s)?'checked':'')+'> '+esc(s)+'</label>').join('')
    +'<div class="fh">不勾选 = 通用，各车系都能抽到。题面写明车系时归到对应车系，避免串进其他车系的卷。</div>';
}
function kpCommitScope(item, text){
  if(!item)return;
  if(item._scopeTouched||item.carScopeManual){item.carScope=kpNormalizeScope(item.carScope);item.carScopeManual=true}
  else{item.carScope=kpInferSeries(text);item.carScopeManual=false}
  delete item._scopeTouched;
}
A.qScope=el=>{
  if(typeof QF==='undefined'||!QF)return;
  const base=kpScopeShown(QF, QF.stem);
  const v=el.dataset.v;
  QF.carScope=el.checked?base.concat(v).filter((x,i,a)=>a.indexOf(x)===i):base.filter(x=>x!==v);
  QF._scopeTouched=true;render();
};
A.drScope=el=>{
  if(typeof DF==='undefined'||!DF)return;
  const base=kpScopeShown(DF, kpDrillFormText(DF));
  const v=el.dataset.v;
  DF.carScope=el.checked?base.concat(v).filter((x,i,a)=>a.indexOf(x)===i):base.filter(x=>x!==v);
  DF._scopeTouched=true;render();
};
function kpLooksPlaceholder(c){
  if(!c||String(c.id||'').indexOf('N_V12_')!==0)return false;
  const o=(c.body&&(c.body.outline||c.body.lines))||'';
  return /关键讲法/.test(o)&&/常见错误/.test(o);
}
function kpIsPlaceholder(c){return !!(c&&(c.placeholder===true||kpLooksPlaceholder(c)))}
function kpPlaceholderTag(c){return kpIsPlaceholder(c)?'<span class="tag warn">合成占位</span>':''}
function kpV12HasLecture(k, includePlaceholder){
  return (S.contents||[]).some(c=>{
    if(!(c.kps||[]).includes(k.id))return false;
    if(((c.kpRole&&c.kpRole[k.id])||'主讲解')!=='主讲解')return false;
    if(typeof isPub==='function'&&!isPub(c))return false;
    if(typeof expState==='function'&&expState(c)==='已过期')return false;
    if(!includePlaceholder&&kpIsPlaceholder(c))return false;
    return true;
  });
}
function kpBackfillScopes(force){
  (S.qs||[]).forEach(q=>{
    if(force||!Array.isArray(q.carScope)){q.carScope=kpInferSeries(q.stem||'');q.carScopeManual=false}
    else q.carScope=kpNormalizeScope(q.carScope);
  });
  (S.drills||[]).forEach(d=>{
    if(force||!Array.isArray(d.carScope)){d.carScope=kpInferSeries(kpDrillText(d));d.carScopeManual=false}
    else d.carScope=kpNormalizeScope(d.carScope);
  });
  (S.contents||[]).forEach(c=>{if(c.placeholder!==true&&kpLooksPlaceholder(c))c.placeholder=true});
}
const __qSaveScope=A.qSave;
A.qSave=function(el){
  if(typeof QF!=='undefined'&&QF){
    const fin=el&&el.dataset&&el.dataset.s==='1';
    const blocked=!String(QF.stem||'').trim()||(fin&&typeof qCheckHard==='function'&&qCheckHard(QF).length);
    if(!blocked)kpCommitScope(QF, QF.stem);
  }
  return __qSaveScope(el);
};
const __drSaveScope=A.drSave;
A.drSave=function(el){
  if(typeof DF!=='undefined'&&DF){
    const fin=el&&el.dataset&&el.dataset.s==='1';
    const draft=DF.turns.map(t=>({say:t.say,ref:t.ref,must:typeof drParse==='function'?drParse(t.mustT):[],idea:typeof drParse==='function'?drParse(t.ideaT):[],emo:[]}));
    const blocked=!String(DF.name||'').trim()||(fin&&typeof drHard==='function'&&drHard(Object.assign({},DF,{turns:draft})).length);
    if(!blocked)kpCommitScope(DF, kpDrillFormText(DF));
  }
  return __drSaveScope(el);
};
const __loadNowScope=loadNow;
loadNow=function(){const ok=__loadNowScope();if(ok)kpBackfillScopes(false);return ok};

/* ---------- 覆盖：抽题 / 演练 / 证据 ---------- */
qPick=function(mid,kid,n,mode,car){
  const target=car||kpPaperCar(kid);
  const pool=qsOf(kid,'已定稿').filter(q=>kpAssetFitsCar(q,target));
  const anchors=pool.filter(q=>q.role==='锚题');
  const practices=pool.filter(q=>q.role!=='锚题');
  const src=mode==='retest'?anchors:(mode==='practice'?practices:anchors.concat(practices.length?practices:anchors));
  const seen={};(S.ansLog||[]).filter(a=>a.mid===mid&&a.kp===kid).forEach(a=>{seen[a.q]=a});
  const sc=q=>{const a=seen[q.id];if(mode==='diag')return (a?5:0)+(q.role==='锚题'?0:1)+(q.lv||1);return a?(a.ok?3:0):1.5};
  return src.slice().sort((a,b)=>sc(a)-sc(b)).slice(0,n);
};
function kpDiagSet(mid,car){
  const target=kpDiagTarget(car);
  const ks=kpPool().filter(k=>kpCoversSeries(k,target)&&qPick(mid,k.id,1,'diag',target).length).sort((a,b)=>hsh(mid+a.id)-hsh(mid+b.id)).slice(0,8);
  const L=[];ks.forEach(k=>qPick(mid,k.id,2,'diag',target).forEach(q=>L.push(q.id)));
  return L;
}
drPick=function(mid,kid,car){
  const target=car||kpPaperCar(kid);
  const L=drsOf(kid,'已定稿').filter(drUsable).filter(d=>kpAssetFitsCar(d,target));if(!L.length)return null;
  const anchors=L.filter(d=>d.role==='锚定演练');const pool=anchors.length?anchors:L;
  const done={};(S.ansLog||[]).filter(a=>a.mid===mid&&a.mode==='drill').forEach(a=>{done[a.q]=a.ok});
  return pool.slice().sort((a,b)=>((a.id in done)?(done[a.id]?3:1):0)-((b.id in done)?(done[b.id]?3:1):0))[0];
};
qzStartPack=function(p){
  const need=(p.steps||[]).find(s=>!s.done);const n=need?packStepNeed(need):3;
  const target=kpPaperCar(p.kp);
  const all=qsOf(p.kp,'已定稿').filter(q=>kpAssetFitsCar(q,target));
  const ids=all.slice(0,Math.max(1,Math.min(n,all.length))).map(q=>q.id);
  return qzStart(R.quizCtx&&R.quizCtx.learn?'pack':(need&&need.t==='复测'?'retest':'pack'),p.kp,ids);
};
const __mClassicV12=mClassic;
mClassic=function(mid,kid){
  const L=((S.ansLog||[]).filter(a=>a.mid===mid&&a.kp===kid)).filter(a=>{const q=typeof qById==='function'?qById(a.q):(S.qs||[]).find(x=>x.id===a.q);return !q||q.role==='锚题'}).slice(-KP_WIN).reverse();
  if(!L.length)return null;let w=1,sw=0,so=0;L.forEach(a=>{sw+=w;so+=w*(a.ok?1:0);w*=KP_DECAY});let v=so/sw*100;if(L.length<2)v=v*0.6+50*0.4;return Math.round(v);
};
v23Sync=function(mid,kid,mode){
  const src=mode==='drill'?'dr':'q';
  const L=(S.ansLog||[]).filter(a=>a.mid===mid&&a.kp===kid&&(mode==='drill'?a.mode==='drill':a.mode!=='drill'));
  const latest=L[L.length-1];
  if(latest){
    const role=mode==='drill'?((S.drills||[]).find(x=>x.id===latest.q)||{}).role:((typeof qById==='function'?qById(latest.q):(S.qs||[]).find(x=>x.id===latest.q))||{}).role;
    if(role!=='锚题'&&role!=='锚定演练')return;
  }
  const anchor=L.filter(a=>{
    if(mode==='drill'){const d=(S.drills||[]).find(x=>x.id===a.q);return d&&d.role==='锚定演练'}
    const q=typeof qById==='function'?qById(a.q):(S.qs||[]).find(x=>x.id===a.q);return q&&q.role==='锚题';
  });
  if(!anchor.length)return;
  const W=S.cfg.win,dec=S.cfg.decay;
  const rec=anchor.slice(-W).reverse();let w=1,sw=0,so=0;
  rec.forEach(a=>{const sc=(mode==='drill'&&a.score!=null)?a.score:(a.ok?100:0);sw+=w;so+=w*sc;w*=dec});
  const score=Math.round(so/sw);
  S.ev[src][mid]=S.ev[src][mid]||{};
  const old=S.ev[src][mid][kid];
  const nOld=old?Math.min(3,old.n):0;
  const blended=old?Math.round((old.score*nOld+score*rec.length)/(nOld+rec.length)):score;
  S.ev[src][mid][kid]={score:blended,n:(old?old.n:0)+1,ts:today,live:true};
};

/* ---------- 成绩有效期 / 有效掌握率 ---------- */
function v23MasteryStatus(mid,kid){
  const o=(S.mastery[mid]||{})[kid];if(!o||o.v==null)return null;
  const k=kp(kid)||KP_BY_ID_V12[kid]||{};
  const last=(S.ev.q[mid]||{})[kid]||(S.ev.dr[mid]||{})[kid];
  const days=(kpV12Assess(k).validityDays||180);
  const validUntil=addDays((last&&last.ts)||o.at||today,days);
  const status=o.v<70?'未过关':(today<=validUntil?'有效':'待确认');
  return {v:o.v,status,validUntil};
}
kpMasteryCard=function(k){
  const rs=Object.keys(S.mastery||{}).map(mid=>({mid,m:(S.mastery[mid]||{})[k.id],st:v23MasteryStatus(mid,k.id)})).filter(x=>x.m&&x.m.v!=null);
  if(!rs.length)return '';
  const avg=Math.round(rs.reduce((a,x)=>a+x.m.v,0)/rs.length);
  const valid=rs.filter(x=>x.st&&x.st.status==='有效').length;
  const pending=rs.filter(x=>x.st&&x.st.status==='待确认').length;
  const weak=rs.filter(x=>x.m.v<70).length;
  return '<div class="card"><h3>学员掌握度 <span class="hint">只算核心测评题 / 过关演练；巩固练习不计入</span></h3>'+(kpV12AnchorQn(k)||kpV12AnchorDrillN(k)?'':'<div class="ux-inline warn">这个知识点还没有已定稿的核心测评题和过关演练，下面是演示种子数据，不是真实作答结果。</div>')+'<div class="grid g4"><div class="stat"><div class="l">已测人数</div><div class="n">'+rs.length+'</div></div><div class="stat"><div class="l">平均掌握度</div><div class="n">'+avg+'</div></div><div class="stat"><div class="l">未过关</div><div class="n" style="color:'+(weak?'#e5484d':'#12a36b')+'">'+weak+'</div></div><div class="stat"><div class="l">有效 / 待确认</div><div class="n">'+valid+' / '+pending+'</div></div></div><div class="hint" style="margin-top:8px">有效掌握率 = '+valid+' / '+rs.length+'（'+(rs.length?Math.round(valid/rs.length*100):0)+'%）；过期成绩降为“待确认”，不计入有效。</div></div>';
};

/* ---------- 后台：补学进度 ---------- */
function kpTasksPage(){
  const T=S.tasks||[];
  const done=T.filter(t=>['已复测','已关闭'].includes(t.state)).length;
  const overdue=T.filter(t=>t.state==='逾期').length;
  const suspend=T.filter(t=>t.state==='挂起').length;
  const rate=T.length?Math.round(done/T.length*100):0;
  const card=(l,v,h)=>'<div class="stat"><div class="l">'+l+'</div><div class="n">'+v+'</div><div class="hint">'+h+'</div></div>';
  return srcBar('一期不做用户端推送；后台看补学进度：人 × 知识点 × 版本，带截止日/状态/逾期。')
    +'<div class="grid g4" style="margin-bottom:12px">'+card('应完成',T.length,'L2/L3 变更任务')+card('已完成',done,rate+'% 按期完成')+card('逾期',overdue,'升级店长；不挂钩学分/资质')+card('挂起',suspend,'请假/离岗/调店')+'</div>'
    +'<div class="card"><h3>任务明细 <span class="hint">演示数据；真实接人员发展平台</span></h3><div class="tw"><table class="t nw stk"><tr><th>人</th><th>门店</th><th>岗位</th><th>知识点</th><th>版本</th><th>级别</th><th>状态</th><th>截止</th><th>最后动作</th></tr>'
    +T.map(t=>'<tr><td>'+esc(t.name||t.mid)+'</td><td>'+esc(t.store||'')+'</td><td>'+esc(t.role||'')+'</td><td style="white-space:normal;min-width:180px"><b>'+esc(t.kpCode||'')+'</b><div class="hint">'+esc(t.kpName||'')+'</div></td><td>v'+esc(t.specVer||1)+'</td><td>'+esc(t.level)+'</td><td><span class="tag '+(t.state==='逾期'?'err':['已复测','已关闭'].includes(t.state)?'ok':'warn')+'">'+esc(t.state)+'</span></td><td>'+esc(t.due||'')+'</td><td class="hint">'+esc(t.retestedAt||t.confirmedAt||t.readAt||'—')+'</td></tr>').join('')
    +'</table></div></div>';
}

/* ---------- 覆盖：v23Seed 收尾（68 条 / 人员 / 任务 / 校验） ---------- */
const __v23SeedOrigV12=v23Seed;
v23Seed=function(){
  const r=__v23SeedOrigV12();
  S.cfg.tax.ability=KP_DICT_V12.abilities.concat(['未指定']);
  S.cfg.tax.car=V23_CAR_LEAVES.slice();
  seedV12Tasks();
  const val=kpV12ValidateAll();
  try{console.log('[KP v1.2]',{kps:S.kps.length,validation:val,seed:window.__KP_SEED_INFO,tasks:window.__KP_TASKS});}catch(e){}
  return r;
};
/* 旧种子会额外加一个 K_RECV1；v1.2 用 KP-SALE-04 覆盖，不再新增 */
kpGapSeed=function(){};
