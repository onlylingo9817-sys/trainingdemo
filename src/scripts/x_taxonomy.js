/* ================= 知识点库 v1(标准库 / 业务蓝图) =================
   这一层不是学员数据,而是「公司认为应该覆盖哪些知识点」的标准清单。
   知识点是能被讲、能被练、能被考、能被实战验证的最小单元;标签是维度值,不是文件夹。
   数据来源:汽车学堂知识库(car-cli knowledge +retrieval)命中的原始文档,source 字段带 document_id。
   ========================================================================== */

/* 车型维度是「车系 → 可下单版本」两层树;知识点可以挂版本、挂车系、或挂通用车型。
   挂车系 = 自动覆盖该车系所有版本;挂通用 = 所有车型都算。 */
const V23_CAR_EXPAND={
  '新一代 SU7':['SU7'],'SU7':['SU7'],
  'YU7':['YU7'],
  'N70系列':['澎程 N70'],'澎程 N70':['澎程 N70'],
  'N90 Max':['澎程 N90 Max'],'N90 Max 探索版':['澎程 N90 Max 探索版'],'澎程 N90':['澎程 N90'],
  '澎程 N70/N90':['澎程 N70','澎程 N90'],
  '通用车型':['通用车型']
};
const V23_ALL_CARS=V23_CAR_ALL;

const V23_TAX_META={
  domains:['品牌文化','本品知识','竞品对比','销售技能','政策权益','交付服务','客户经营','行业洞察'],
  abilities:['探需','产品讲解','试乘试驾','顾虑解除','促单成交','客户经营','带人辅导'],
  stages:['全阶段','线索与邀约','排程与 PDC','到店接待','试乘试驾','试驾回访','跟进促单','下订与改配','交付及交付后'],
  cars:V23_ALL_CARS,
  series:V23_CAR_TREE,
  scenes:['通勤','家庭出行','长途自驾','露营户外','商务接待','接送孩子','宠物出行','移动办公'],
  custs:['首购','增换购','家庭用户','企业客户','米粉生态','年轻个人'],
  comps:['特斯拉 Model 3','特斯拉 Model Y','理想 L6','理想 L7','理想 L8','理想 L9','问界 M7','问界 M8','问界 M9','极氪 001','极氪 007','极氪 7X','小鹏 G7','小鹏 P7+','蔚来 ES6','乐道 L60','奔驰 GLC'],
  /* 8 个知识域;行业洞察 v1 不铺知识点,标「二期预留」,不参与完备率分母 */
  notes:{'行业洞察':'二期预留:v1 不铺知识点,不进入完备率分母'}
};

function TX(code,name,type,domain,ab,stages,cars,pri,src,doc,opt){
  return Object.assign({code,name,type,domain,ab,stages:stages.slice(),cars:[...new Set((cars||[]).flatMap(c=>V23_CAR_EXPAND[c]||[c]))],pri,src,doc:doc||'',scenes:[],custs:[],comps:[],legacy:[],note:'',kpId:''},opt||{});
}

const V23_TAX=[
  /* ---- A 品牌文化(5) ---- */
  TX('KP-BR-01','小米品牌与“真诚热爱”价值观','事实','品牌文化','产品讲解',['全阶段'],['通用车型'],'P1','汽车学堂功能简介','cee60cfad6b511f1bef9ae4d84b55faa'),
  TX('KP-BR-02','小米汽车产品线全景:SU7 / YU7 / 澎程','事实','品牌文化','产品讲解',['全阶段'],['通用车型'],'P0','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771'),
  TX('KP-BR-03','新零售模式与门店岗位分工','事实','品牌文化','客户经营',['全阶段'],['通用车型'],'P1','汽车学堂功能简介','cee60cfad6b511f1bef9ae4d84b55faa'),
  TX('KP-BR-04','人车家全生态战略','事实','品牌文化','产品讲解',['到店接待','试乘试驾'],['通用车型'],'P0','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771'),
  TX('KP-BR-05','纯电 vs 增程技术路线','事实','品牌文化','产品讲解',['到店接待'],['通用车型'],'P1','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771'),

  /* ---- B 新一代 SU7(9) ---- */
  TX('KP-SU7-01','车型定位与四个版本差异','事实','本品知识','产品讲解',['到店接待'],['新一代 SU7'],'P0','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771'),
  TX('KP-SU7-02','外观、颜色、轮毂卖点','事实','本品知识','产品讲解',['到店接待'],['新一代 SU7'],'P0','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771',{scenes:['家庭出行','商务接待'],custs:['首购','家庭用户']}),
  TX('KP-SU7-03','内饰质感与豪华配置','事实','本品知识','产品讲解',['到店接待'],['新一代 SU7'],'P1','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771'),
  TX('KP-SU7-04','续航与补能:Pro 版 902km / 800V','事实','本品知识','产品讲解',['到店接待','试乘试驾','跟进促单'],['新一代 SU7'],'P0','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771',{scenes:['通勤','长途自驾'],custs:['首购','增换购'],note:'电池容量按版本参数表:Pro 94.3kWh、Max 101kWh;不再用“100 度电”一刀切'}),
  TX('KP-SU7-05','底盘与驾控:运动和舒适两种性格','事实','本品知识','试乘试驾',['试乘试驾'],['新一代 SU7'],'P0','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771',{scenes:['通勤','长途自驾']}),
  TX('KP-SU7-06','智能座舱:天际屏 / 超级小爱','事实','本品知识','产品讲解',['到店接待'],['新一代 SU7'],'P0','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771'),
  TX('KP-SU7-07','辅助驾驶 HAD/XLA 与能力边界','事实','本品知识','产品讲解',['试乘试驾'],['新一代 SU7'],'P0','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771'),
  TX('KP-SU7-08','安全:主动 / 被动 / 极端冗余','事实','本品知识','产品讲解',['到店接待'],['新一代 SU7'],'P0','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771',{scenes:['家庭出行','接送孩子'],legacy:['K7','K16']}),
  TX('KP-SU7-09','SU7 Ultra 性能与赛道卖点','事实','本品知识','产品讲解',['到店接待'],['SU7 Ultra'],'P1','SU7 Ultra 试乘试驾体验点及话术','e455e5d0841f11f19d3cba7e9068ae7b',{note:'Ultra 是 SU7 车系下的版本值;讲车时按 Ultra 版本口径'}),

  /* ---- C YU7(7) ---- */
  TX('KP-YU7-01','车型定位与版本差异','事实','本品知识','产品讲解',['到店接待'],['YU7'],'P0','YU7产品亮点强化','1535470ed6b911f1b444ae4d84b55faa'),
  TX('KP-YU7-02','外观设计与颜色','事实','本品知识','产品讲解',['到店接待'],['YU7'],'P0','YU7产品亮点强化','1535470ed6b911f1b444ae4d84b55faa'),
  TX('KP-YU7-03','续航与 800V 补能','事实','本品知识','产品讲解',['试乘试驾','跟进促单'],['YU7'],'P0','YU7产品亮点强化','1535470ed6b911f1b444ae4d84b55faa',{scenes:['通勤','长途自驾']}),
  TX('KP-YU7-04','驾控与底盘','事实','本品知识','试乘试驾',['试乘试驾'],['YU7'],'P0','YU7产品亮点强化','1535470ed6b911f1b444ae4d84b55faa'),
  TX('KP-YU7-05','座舱与天际屏','事实','本品知识','产品讲解',['到店接待'],['YU7'],'P1','YU7车辆讲解话术V1.5','45402f40d6b911f1a2fb52c1dfea1be6',{legacy:['K10']}),
  TX('KP-YU7-06','空间与家庭场景','事实','本品知识','产品讲解',['到店接待','试乘试驾'],['YU7'],'P0','YU7产品亮点强化','1535470ed6b911f1b444ae4d84b55faa',{scenes:['家庭出行','接送孩子','宠物出行'],custs:['首购','家庭用户'],legacy:['K9','K13']}),
  TX('KP-YU7-07','安全卖点','事实','本品知识','产品讲解',['到店接待'],['YU7'],'P0','YU7产品亮点强化','1535470ed6b911f1b444ae4d84b55faa'),

  /* ---- D 澎程 N70 / N90(9) ---- */
  TX('KP-PC-01','品牌与车型定位(N70 大五座 / N90 大七座)','事实','本品知识','产品讲解',['到店接待'],['澎程 N70','澎程 N90'],'P0','小米澎程上市发布会内容介绍','2132371cab2911f1b09f2eac02de4cd3',{scenes:['家庭出行','商务接待'],custs:['家庭用户','企业客户']}),
  TX('KP-PC-02','价格与版本差异(Pro/Max/探索版)','事实','本品知识','产品讲解',['到店接待','跟进促单'],['澎程 N70','澎程 N90'],'P0','小米澎程上市发布会内容介绍','2132371cab2911f1b09f2eac02de4cd3'),
  TX('KP-PC-03','增程动力与纯电续航(N70 Max 505km / N90 Max 464km)','事实','本品知识','产品讲解',['试乘试驾'],['澎程 N70','澎程 N90'],'P0','小米澎程N70参数配置表','c59d5670d6bb11f1ac873627d1e928e5',{legacy:['K5'],note:'按版本分开:N70 Max 505km、N90 Max 464km;N70 Pro 纯电续航空缺,以配置表为准'}),
  TX('KP-PC-04','亏电油耗与用车成本(N70 Pro 5.7L / N70 Max 6.1L / N90 Max 6.26L)','事实','本品知识','产品讲解',['跟进促单'],['澎程 N70','澎程 N90'],'P0','小米澎程N70参数配置表','c59d5670d6bb11f1ac873627d1e928e5',{legacy:['K15'],note:'按版本分开,不能把 N70 Pro 的 5.7L 讲成 N90 的油耗'}),
  TX('KP-PC-05','大七座空间与座椅布局(N90)','事实','本品知识','产品讲解',['到店接待','试乘试驾'],['澎程 N90'],'P0','小米澎程N90产品知识730(下)','6a1efcbed6ba11f18a3ea21bf54387f8',{scenes:['家庭出行','商务接待'],legacy:['K3']}),
  TX('KP-PC-06','智能可变大空间 / 纯平地板 / 滑轨','事实','本品知识','产品讲解',['到店接待','试乘试驾'],['澎程 N70','澎程 N90'],'P0','小米澎程上市发布会内容介绍','2132371cab2911f1b09f2eac02de4cd3',{scenes:['露营户外','移动办公','家庭出行'],legacy:['K1','K8','K11','K14']}),
  TX('KP-PC-07','二排零重力 / 旋转座椅','事实','本品知识','产品讲解',['到店接待'],['澎程 N90'],'P1','小米澎程N90产品知识730(下)','6a1efcbed6ba11f18a3ea21bf54387f8',{legacy:['K2']}),
  TX('KP-PC-08','智能座舱与生态','事实','本品知识','产品讲解',['到店接待'],['澎程 N70','澎程 N90'],'P0','小米澎程N90产品知识730(下)','6a1efcbed6ba11f18a3ea21bf54387f8',{legacy:['K12']}),
  TX('KP-PC-09','辅助驾驶与安全','事实','本品知识','产品讲解',['试乘试驾'],['澎程 N70','澎程 N90'],'P0','小米澎程N90产品知识730(下)','6a1efcbed6ba11f18a3ea21bf54387f8',{legacy:['K6']}),

  /* ---- E 平台与通用技术(7) ---- */
  TX('KP-TECH-01','小米龙甲电池与电池安全','事实','本品知识','产品讲解',['到店接待'],['通用车型'],'P0','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771'),
  TX('KP-TECH-02','充电补能体系(家充/超充/三方桩)','事实','本品知识','产品讲解',['试乘试驾','交付及交付后'],['通用车型'],'P0','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771',{legacy:['K4'],scenes:['通勤','长途自驾','露营户外']}),
  TX('KP-TECH-03','辅助驾驶能力边界与法规责任','事实','本品知识','产品讲解',['试乘试驾'],['通用车型'],'P0','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771'),
  TX('KP-TECH-04','OTA 升级机制','事实','本品知识','产品讲解',['到店接待'],['通用车型'],'P1','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771'),
  TX('KP-TECH-05','超级小爱与四域合一','事实','本品知识','产品讲解',['到店接待'],['通用车型'],'P1','YU7产品亮点强化','1535470ed6b911f1b444ae4d84b55faa'),
  TX('KP-TECH-06','车身结构与被动安全','事实','本品知识','产品讲解',['到店接待'],['通用车型'],'P0','新一代SU7 产品知识(完整版)','707d1b36e3c111f1968ce6b9d9292771'),
  TX('KP-TECH-07','增程器 NVH / 热管理 / 冬季续航','事实','本品知识','产品讲解',['试乘试驾'],['澎程 N70','澎程 N90'],'P1','小米澎程N90产品知识730(下)','6a1efcbed6ba11f18a3ea21bf54387f8'),

  /* ---- F 竞品对比(6) ---- */
  TX('KP-COMP-01','竞品对比方法论:先认同、讲差异、回到需求','技能','竞品对比','顾虑解除',['跟进促单'],['通用车型'],'P0','新一代SU7 竞品对比话术','64154b5ad6b711f1b0b2a21bf54387f8',{legacy:['K19']}),
  TX('KP-COMP-02','SU7 vs 特斯拉 Model 3 / 极氪 001/007','事实','竞品对比','顾虑解除',['跟进促单'],['新一代 SU7'],'P0','新一代SU7 竞品对比话术','64154b5ad6b711f1b0b2a21bf54387f8',{comps:['特斯拉 Model 3','极氪 001','极氪 007']}),
  TX('KP-COMP-03','YU7 vs 特斯拉 Model Y / Model Y L','事实','竞品对比','顾虑解除',['跟进促单'],['YU7'],'P0','特斯拉ModelYL-上市速递与竞对培训(资料合集)','1304495ed69511f19846a21bf54387f8',{comps:['特斯拉 Model Y']}),
  TX('KP-COMP-04','YU7 vs 理想 L6/L7 / 问界 M7/M8','事实','竞品对比','顾虑解除',['跟进促单'],['YU7'],'P0','YU7-分品牌/维度友商应对话术','085bdd32d69511f1883d4ed4269eba83',{comps:['理想 L6','理想 L7','问界 M7','问界 M8']}),
  TX('KP-COMP-05','澎程 vs 理想 L8/L9 / 问界 M8/M9','事实','竞品对比','顾虑解除',['跟进促单'],['澎程 N70','澎程 N90'],'P0','每周竞品资讯(河南分公司分享)','371b5586d69911f1ad574ed4269eba83',{comps:['理想 L8','理想 L9','问界 M8','问界 M9']}),
  TX('KP-COMP-06','竞品政策与权益周更','事实','竞品对比','顾虑解除',['跟进促单'],['通用车型'],'P1','每周竞品资讯(河南分公司分享)','371b5586d69911f1ad574ed4269eba83'),

  /* ---- G 销售技能(14) ---- */
  TX('KP-SALE-01','线索分级与 5 分钟首触','流程','销售技能','客户经营',['线索与邀约'],['通用车型'],'P0','小米汽车销售阶段指标字典','c1c01020d69211f1aaa652c1dfea1be6',{note:'知识库口径是 5 分钟内首次触达;2 小时是零售通倒计时高亮规则,不是首触要求,已纠正'}),
  TX('KP-SALE-02','电话邀约八步法','技能','销售技能','客户经营',['线索与邀约'],['通用车型'],'P0','「助销工具」初阶-多场景邀约速查手册','ba75a714d6b811f1a61cfe68a8d05fe7',{legacy:['K21']}),
  TX('KP-SALE-03','二次邀约与决策人邀约','技能','销售技能','探需',['线索与邀约'],['通用车型'],'P0','首触挖需&线下排程邀约 强化培训','f83dd462d69611f1b2cb3627d1e928e5'),
  TX('KP-SALE-04','到店接待标准流程(10 秒迎宾/破冰/留资)','流程','销售技能','客户经营',['到店接待'],['通用车型'],'P0','零售门店销售SOP流程-门店接待篇(宣贯版)','d556fd48d69611f19d9a3627d1e928e5',{legacy:['K23']}),
  TX('KP-SALE-05','需求挖掘必问 5 问','技能','销售技能','探需',['到店接待'],['通用车型'],'P0','需求分析-提问的方法','e55b3b02d69411f1a173e6b9d9292771',{legacy:['K20']}),
  TX('KP-SALE-06','开放式 + 封闭式提问组合','技能','销售技能','探需',['到店接待','试乘试驾'],['通用车型'],'P0','需求分析-提问的方法','e55b3b02d69411f1a173e6b9d9292771'),
  TX('KP-SALE-07','决策人 / 用车人 / 付款人识别','技能','销售技能','探需',['到店接待'],['通用车型'],'P0','需求分析-挖需销冠案例','ece8585ad69411f1b9814ed4269eba83'),
  TX('KP-SALE-08','场景化讲车 SPIN 四步','技能','销售技能','产品讲解',['到店接待'],['通用车型'],'P0','现车销售实战技巧&话术(江苏分公司分享)','9bd54346d69f11f1965ae6b9d9292771',{legacy:['K17']}),
  TX('KP-SALE-09','卖点转译:参数 → 场景利益','技能','销售技能','产品讲解',['到店接待','试乘试驾'],['通用车型'],'P0','现车销售实战技巧&话术(江苏分公司分享)','9bd54346d69f11f1965ae6b9d9292771'),
  TX('KP-SALE-10','PDC 试驾确认','流程','销售技能','试乘试驾',['排程与 PDC'],['通用车型'],'P0','零售门店销售SOP流程-试乘试驾篇(宣贯版)','d650fa0ad69611f18652ae4d84b55faa'),
  TX('KP-SALE-11','试乘试驾标准流程与路线设计','技能','销售技能','试乘试驾',['试乘试驾'],['通用车型'],'P0','零售门店销售SOP流程-试乘试驾篇(宣贯版)','d650fa0ad69611f18652ae4d84b55faa'),
  TX('KP-SALE-12','试驾回访 T+1','流程','销售技能','客户经营',['试驾回访'],['通用车型'],'P0','零售门店销售SOP流程-试乘试驾篇(宣贯版)','d650fa0ad69611f18652ae4d84b55faa'),
  TX('KP-SALE-13','价格异议处理:价值锚点 / 总拥有成本','技能','销售技能','顾虑解除',['跟进促单'],['通用车型'],'P0','现车销售实战技巧&话术(江苏分公司分享)','9bd54346d69f11f1965ae6b9d9292771',{legacy:['K18']}),
  TX('KP-SALE-14','促单三步与下订 / 改配','技能','销售技能','促单成交',['跟进促单','下订与改配'],['通用车型'],'P0','「销冠说」金句合集(持续更新)','912deb74d69e11f1a8d74ed4269eba83'),

  /* ---- H 政策权益与金融(6) ---- */
  TX('KP-POL-01','国补 / 地补口径','政策','政策权益','顾虑解除',['跟进促单'],['通用车型'],'P0','【活动通知】2026年11月销售权益','d1cd9130d99511f1a763ca291fe033b5',{legacy:['K22']}),
  TX('KP-POL-02','以旧换新 / 置换补贴','政策','政策权益','促单成交',['跟进促单'],['通用车型'],'P0','【活动通知】2026年11月销售权益','d1cd9130d99511f1a763ca291fe033b5'),
  TX('KP-POL-03','首销权益与限时权益','政策','政策权益','促单成交',['跟进促单'],['通用车型'],'P0','【活动通知】小米澎程上市发布会相关信息及热点问题-20260907','ab909b04cdf911f1b9dca21bf54387f8'),
  TX('KP-POL-04','复购权益','政策','政策权益','促单成交',['交付及交付后'],['通用车型'],'P1','【活动通知】2026年11月销售权益','d1cd9130d99511f1a763ca291fe033b5'),
  TX('KP-POL-05','金融方案:首付 / 月供 / 贴息','政策','政策权益','促单成交',['跟进促单'],['通用车型'],'P0','【活动通知】2026年11月销售权益','d1cd9130d99511f1a763ca291fe033b5'),
  TX('KP-POL-06','保险 / 上牌 / 质保政策','政策','政策权益','客户经营',['交付及交付后'],['通用车型'],'P0','【全流程】小米交付业务手册','0e2c8a44842011f1a5a4b6c66b9e6803'),

  /* ---- I 交付服务(4) ---- */
  TX('KP-DLV-01','交付前准备与建群交接','流程','交付服务','客户经营',['交付及交付后'],['通用车型'],'P1','【全流程】小米交付业务手册','0e2c8a44842011f1a5a4b6c66b9e6803'),
  TX('KP-DLV-02','到店交付 / 验车 / 签约 / 手续','流程','交付服务','客户经营',['交付及交付后'],['通用车型'],'P0','【全流程】小米交付业务手册','0e2c8a44842011f1a5a4b6c66b9e6803'),
  TX('KP-DLV-03','车辆功能讲解 9 大模块','技能','交付服务','产品讲解',['交付及交付后'],['通用车型'],'P0','【全流程】小米交付业务手册','0e2c8a44842011f1a5a4b6c66b9e6803'),
  TX('KP-DLV-04','交付后回访与投诉应对','技能','交付服务','客户经营',['交付及交付后'],['通用车型'],'P1','【全流程】小米交付业务手册','0e2c8a44842011f1a5a4b6c66b9e6803'),

  /* ---- J 客户经营(3) ---- */
  TX('KP-CUST-01','企微客户标签与分层','技能','客户经营','客户经营',['全阶段'],['通用车型'],'P0','零售通APP使用手册1030','d73ecc80d69611f1b9783627d1e928e5'),
  TX('KP-CUST-02','朋友圈 / 内容运营与沉睡唤醒','技能','客户经营','客户经营',['交付及交付后'],['通用车型'],'P1','【综合运营】零售门店运营白皮书','c4468a2ad6b711f18d74ae4d84b55faa'),
  TX('KP-CUST-03','转介绍与复购','技能','客户经营','客户经营',['交付及交付后'],['通用车型'],'P1','【综合运营】零售门店运营白皮书','c4468a2ad6b711f18d74ae4d84b55faa'),

  /* ---- K 带人辅导(3,管理类,不进零售顾问车型分母) ---- */
  TX('KP-MGR-01','新人带教与陪访','技能','销售技能','带人辅导',['全阶段'],['通用车型'],'P0','2026年服务中心人员及培训运营指导手册','c5d867acd6a111f18f7452c1dfea1be6',{legacy:['K24'],note:'管理类,不进零售顾问车型分母'}),
  TX('KP-MGR-02','门店例会与目标拆解','技能','销售技能','带人辅导',['全阶段'],['通用车型'],'P1','2026年服务中心人员及培训运营指导手册','c5d867acd6a111f18f7452c1dfea1be6',{legacy:['K25'],note:'管理类,不进零售顾问车型分母'}),
  TX('KP-MGR-03','试驾 / 接待质量点检与辅导工单','技能','销售技能','带人辅导',['全阶段'],['通用车型'],'P0','2026年服务中心人员及培训运营指导手册','c5d867acd6a111f18f7452c1dfea1be6',{note:'管理类,不进零售顾问车型分母'})
];

/* ---------- 数据修复:旧知识点 → v1 编号;缺失的 P0 建骨架 ---------- */
const V23_TAX_OWNER={'产品讲解':'王磊','探需':'李娜','试乘试驾':'陈刚','顾虑解除':'李娜','促单成交':'陈刚','客户经营':'周丽','带人辅导':'陈磊'};
function v23TaxByCode(code){return (typeof S!=='undefined'&&S.tax?S.tax:V23_TAX).find(t=>t.code===code)}
function v23TaxTags(t){
  const root=(name)=>PTAGS.find(x=>x.name===name&&x.lv===1);
  const map={'本品知识':'车型卖点','销售技能':'销售场景','政策权益':'政策口径','交付服务':'销售场景','客户经营':'销售场景','竞品对比':'销售场景','品牌文化':'销售场景'};
  const r=root(map[t.domain]||'');return r?[r.id]:[];
}
function v23TaxDims(t){
  const d={};
  const cars=dimIdsByNames('Dcar',t.cars);if(cars.length)d.Dcar=cars;
  const dom=dimIdByName('Ddomain',t.domain);if(dom)d.Ddomain=[dom];
  const ab=dimIdByName('Dab',t.ab);if(ab)d.Dab=[ab];
  const st=dimIdsByNames('Dstage',t.stages);if(st.length)d.Dstage=st;
  const sc=dimIdsByNames('Dscene',t.scenes);if(sc.length)d.Dscene=sc;
  const cu=dimIdsByNames('Dcust',t.custs);if(cu.length)d.Dcust=cu;
  const co=dimIdsByNames('Dcomp',t.comps);if(co.length)d.Dcomp=co;
  return d;
}
function v23TaxKp(id,t){
  const k={id,code:t.code,name:t.name,type:(t.type==='技能'?'技能型':'事实型'),tags:v23TaxTags(t),dim:t.ab,
    car:t.cars[0],cars:t.cars.slice(),syn:[t.name],owner:V23_TAX_OWNER[t.ab]||'王磊',st:'启用',ext:[],
    created:addDays(today,-15),hist:[{t:today,who:'总部培训部 刘翔',act:'由知识点库 v1 建骨架',note:t.pri+' · '+t.domain+' · '+t.ab}],
    pre:[],rel:[],dims:v23TaxDims(t),taxCode:t.code,taxDomain:t.domain,taxAbility:t.ab};
  return k;
}
function v23TaxSeed(){
  if(typeof V23_TAX==='undefined')return;
  S.tax=JSON.parse(JSON.stringify(V23_TAX));
  /* 旧知识点打上 v1 编号:一个编号可以覆盖多条旧知识点(例如储物/办公/露营都归到智能大空间) */
  const byLegacy={};
  S.tax.forEach(t=>(t.legacy||[]).forEach(id=>{byLegacy[id]=t}));
  S.kps.forEach(k=>{
    const t=byLegacy[k.id];if(!t)return;
    k.code=t.code;k.taxCode=t.code;k.taxDomain=t.domain;k.taxAbility=t.ab;
    const dom=dimIdByName('Ddomain',t.domain);if(dom)k.dims.Ddomain=[dom];
    const ab=dimIdByName('Dab',t.ab);if(ab){k.dims.Dab=[ab];k.dim=t.ab}
    t.kpId=t.kpId||k.id;
  });
  /* 缺失的 P0 先建骨架(启用但缺讲解/题,正好暴露缺口);P1 保留为蓝图,由页面「补齐」再入库 */
  let n=Math.max(0,...S.kps.map(k=>+String(k.id).replace(/\D/g,'')||0));
  S.tax.forEach(t=>{
    if(t.kpId)return;
    if(t.pri!=='P0')return;
    const id='K'+(++n);S.kps.push(v23TaxKp(id,t));t.kpId=id;
  });
  /* 同一知识域内建立先学/相关链,避免新知识点全是孤岛 */
  const last={};
  S.tax.forEach(t=>{
    const k=S.kps.find(x=>x.id===t.kpId||x.code===t.code);if(!k)return;
    const prev=last[t.domain];
    if(prev){k.pre=[...new Set((k.pre||[]).concat(prev.id))];prev.rel=[...new Set((prev.rel||[]).concat(k.id))]}
    last[t.domain]=k;
  });
  return S.tax;
}

/* ---------- 完备率:车型 × 知识域 ---------- */
function v23TaxLegacy(t){return S.kps.filter(k=>k.code===t.code||(k.taxCode&&k.taxCode===t.code))}
function v23TaxUsable(t){
  const ks=v23TaxLegacy(t);if(!ks.length)return false;
  return ks.some(k=>{
    if(k.st!=='启用')return false;
    const h=kpHealth(k);
    const q=(typeof kpQn==='function'?kpQn(k):0);
    const dr=(typeof drsOf==='function'?drsOf(k.id,'已定稿').length:0)+((k.ext||[]).filter(e=>['话术演练','角色演练'].includes(e.t)).length);
    const expOk=h.cells.exp.s==='ok';
    return expOk&&q>=3&&(t.type!=='技能'||dr>0);
  });
}
function v23CarTagLabel(c){
  if(c==='通用车型')return '通用车型';
  if(V23_CAR_TREE[c])return c+'（车系）';
  if(V23_CAR_SERIES_OF[c])return c+'（版本）';
  return c;
}
function v23TaxCarMatch(t,car){
  if(car==='通用车型')return t.cars.includes('通用车型');
  if(t.cars.includes('通用车型')||t.cars.includes(car))return true;
  const sr=V23_CAR_SERIES_OF[car];
  return !!sr&&t.cars.includes(sr);
}
function v23TaxDenom(car,onlyMg){
  return S.tax.filter(t=>t.pri==='P0'&&(onlyMg?t.ab==='带人辅导':t.ab!=='带人辅导')&&v23TaxCarMatch(t,car));
}
function v23TaxCovered(car,onlyMg){const d=v23TaxDenom(car,onlyMg);return {denom:d.length,ok:d.filter(v23TaxUsable).length}}
function v23TaxMatrixHtml(){
  const doms=V23_TAX_META.domains.filter(d=>d!=='行业洞察');
  const cell=(car,onlyMg,dom)=>{const d=v23TaxDenom(car,onlyMg).filter(t=>t.domain===dom);if(!d.length)return '<span class="hint">—</span>';const ok=d.filter(v23TaxUsable).length;const p=Math.round(ok/d.length*100);return '<span class="tag '+(p>=80?'ok':p>0?'warn':'err')+'" title="'+ok+' / '+d.length+'">'+ok+'/'+d.length+'</span>'};
  const total=(car,onlyMg)=>{const c=v23TaxCovered(car,onlyMg);const p=c.denom?Math.round(c.ok/c.denom*100):0;return '<b style="color:'+(p>=80?'#0b7a50':p?'#a15c00':'#c8323a')+'">'+c.ok+'/'+c.denom+'</b> <span class="hint">'+p+'%</span>'};
  const groupRows=Object.keys(V23_TAX_META.series).map(series=>{
    const cars=V23_TAX_META.series[series];
    return '<tr style="background:#fafbfc"><td colspan="'+(doms.length+2)+'"><b>'+series+' 车系</b> <span class="hint">'+cars.length+' 个可下单版本</span></td></tr>'
      +cars.map(car=>'<tr><td style="padding-left:26px"><b>'+car+'</b></td>'+doms.map(d=>'<td>'+cell(car,false,d)+'</td>').join('')+'<td>'+total(car,false)+'</td></tr>').join('');
  }).join('');
  return '<div class="card"><h3>车型 × 知识域:完备率 <span class="hint">格子 = 可用 P0 / 应覆盖 P0;按可下单版本算,通用车型计入每个版本;带人辅导单列店长</span></h3>'
   +'<div class="tw"><table class="t nw"><tr><th>车系 / 版本</th>'+doms.map(d=>'<th>'+d+'</th>').join('')+'<th>合计</th></tr>'
   +groupRows
   +'<tr style="background:#fafbfc"><td colspan="'+(doms.length+2)+'"><b>管理类</b> <span class="hint">店长画像,不进顾问车型分母</span></td></tr>'
   +'<tr><td style="padding-left:26px"><b>店长</b></td>'+doms.map(d=>'<td>'+cell('通用车型',true,d)+'</td>').join('')+'<td>'+total('通用车型',true)+'</td></tr>'
   +'</table></div><div class="hint" style="margin-top:6px">口径:≥1 条主讲解(已上架未过期)+ ≥3 道题 + 技能型 ≥1 个演练;事实型不强制演练。行业洞察 v1 不铺知识点,不进分母。</div></div>';
}

/* ---------- 页面:知识点库 v1 ---------- */
function v23TaxStatus(t){
  if(!t.kpId)return ['未入库',''];
  return v23TaxUsable(t)?['可用','ok']:['已入库·待补','warn'];
}
function v23TaxGaps(){
  const out=[];
  S.tax.filter(t=>t.pri==='P0'&&!v23TaxUsable(t)).forEach(t=>out.push(t));
  return out;
}
function v23TaxDimTable(){
  const dims=S.dims||[];
  return '<div class="card"><h3>7 个维度 <span class="hint">归属维度单值,上下文维度多值;标签是维度值,不是文件夹</span></h3>'
   +'<div class="tw"><table class="t nw"><tr><th>维度</th><th>角色</th><th>基数</th><th>值</th></tr>'
   +dims.map(d=>'<tr><td><b>'+esc(d.name)+'</b><div class="hint">'+d.id+'</div></td><td>'+(d.role==='belong'?'归属':d.role==='ability'?'能力项':'上下文')+'</td><td>'+(d.multi?'多值':'<b>单值</b>')+'</td><td style="white-space:normal;min-width:320px">'+d.values.filter(v=>v.status!=='off').map(v=>'<span class="tag" style="margin:0 4px 4px 0;padding:2px 7px;'+(v.lv>1?'margin-left:14px':'')+'">'+esc(d.id==='Dcar'?v23CarTagLabel(v.name):v.name)+'</span>').join('')+'</td></tr>').join('')
   +'</table></div><div class="hint" style="margin-top:6px">车型是「车系 → 版本」两层树：挂车系自动覆盖全系，挂版本只覆盖该版本，通用车型全系适用。</div></div>';
}
function v23TaxFixCard(){
  const items=[
    ['能力项单值','73 条全部落在 7 项内;KP-SALE-02 从“探需/客户经营”改为单值“客户经营”;不再出现“—”。'],
    ['基线与公式对齐','带人辅导单列店长,不进球型分母;SU7 各版本 37 / YU7 各版本 37 / 澎程 N70 各版本 37 / N90 各版本 38,公式和表一致。'],
    ['澎程拆版本','N70 / N90 拆成两个车型值;续航 505/464km、油耗 5.7/6.1/6.26L 按版本写,不再把 N70 Pro 的 5.7L 讲成 N90。'],
    ['取值清零字典外','“全阶段”入阶段字典;“交付前”并入“交付及交付后”;知识域收敛为 8 个;行业洞察标二期预留。'],
    ['SU7 Ultra 处理','Ultra 作为 SU7 车系的一个可下单版本;专属卖点 1 条为 P1,不产生空分母。'],
    ['首触与来源','首触改为知识库口径“5 分钟”;每条来源补 document_id,可直接回查原文。']
  ];
  return '<div class="card" style="border-color:#cfe8dc;background:#f7fcfa"><h3>这次核对后改掉的 6 处 <span class="hint">对应尼嘎儿的检查意见</span></h3>'
   +items.map((x,i)=>'<div style="display:flex;gap:10px;padding:7px 0;border-top:1px solid #e8f2ec"><b style="color:#0b7a50;min-width:22px">'+(i+1)+'</b><div><b>'+x[0]+'</b><div class="hint" style="line-height:1.7">'+x[1]+'</div></div></div>').join('')
   +'</div>';
}
function v23TaxCsvText(){
  return ['知识点编号,名称,类型,知识域,能力项,销售阶段,车型,客户场景,客户类型,竞品,优先级,来源',
    'KP-CUS-01,示例·门店试驾路线复盘,技能,销售技能,试乘试驾,试乘试驾,通用车型,,,,P0,示例文档',
    'KP-CUS-02,示例·家庭日六座上下车动线,事实,本品知识,产品讲解,到店接待,澎程 N90 Max,家庭出行,家庭用户,,P1,示例文档'].join('\n');
}
function v23TaxTable(){
  const f=UI.sel.taxf||(UI.sel.taxf={});
  const q=(f.q||'').trim();
  let rows=S.tax.filter(t=>(!f.domain||t.domain===f.domain)&&(!f.ab||t.ab===f.ab)&&(!f.car||v23TaxCarMatch(t,f.car))&&(!f.pri||t.pri===f.pri)&&(!f.status||(f.status==='未入库'?!t.kpId:f.kpId))&&(!q||t.code.includes(q)||t.name.includes(q)||(t.legacy||[]).some(x=>x.includes(q))));
  const so=(k,label,arr)=>'<div class="fi2"><label>'+label+'</label><select data-wc="taxSet" data-k="'+k+'"><option value="">全部</option>'+arr.map(x=>'<option value="'+esc(x)+'" '+(f[k]===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></div>';
  return '<div class="card"><h3>知识点清单 <span class="hint">共 '+S.tax.length+' 条;筛选后 '+rows.length+' 条</span></h3>'
   +'<div class="filg"><div class="fi2"><label>搜索</label><input data-wc="taxSet" data-k="q" value="'+esc(f.q||'')+'" placeholder="编号 / 名称 / 旧编号"></div>'
   +so('domain','知识域',V23_TAX_META.domains)+so('ab','能力项',V23_TAX_META.abilities)
   +'<div class="fi2"><label>车型 / 车系</label><select data-wc="taxSet" data-k="car"><option value="">全部</option><option value="通用车型" '+(f.car==='通用车型'?'selected':'')+'>通用车型</option>'+Object.keys(V23_TAX_META.series).map(sr=>'<optgroup label="'+sr+'"><option value="'+sr+'" '+(f.car===sr?'selected':'')+'>'+sr+'（车系）</option>'+V23_TAX_META.series[sr].map(v=>'<option value="'+v+'" '+(f.car===v?'selected':'')+'>'+v+'</option>').join('')+'</optgroup>').join('')+'</select></div>'
   +so('pri','优先级',['P0','P1'])
   +'<div class="fi2"><label>状态</label><select data-wc="taxSet" data-k="status"><option value="">全部</option><option '+(f.status==='已入库'?'selected':'')+'>已入库</option><option '+(f.status==='未入库'?'selected':'')+'>未入库</option></select></div>'
   +'<div class="fi2" style="align-self:end"><button class="btn" data-act="taxClear">清除</button></div></div>'
   +'<div class="tw"><table class="t nw"><tr><th>编号</th><th>知识点</th><th>知识域</th><th>能力项</th><th>阶段</th><th>车型</th><th>优先级</th><th>状态</th><th>来源</th></tr>'
   +rows.map(t=>{const st=v23TaxStatus(t);const k=t.kpId?S.kps.find(x=>x.id===t.kpId):null;
     return '<tr><td><b>'+t.code+'</b>'+((t.legacy||[]).length?'<div class="hint">旧 '+t.legacy.join('/')+'</div>':'')+'</td>'
      +'<td style="white-space:normal;min-width:220px">'+(k?'<a class="link" data-act="kpOpen" data-id="'+k.id+'">'+esc(t.name)+'</a>':esc(t.name))+(t.note?'<div class="hint" style="line-height:1.6">'+esc(t.note)+'</div>':'')+'</td>'
      +'<td>'+t.domain+'</td><td>'+t.ab+'</td><td style="white-space:normal;min-width:130px">'+t.stages.join('、')+'</td><td style="white-space:normal;min-width:150px">'+t.cars.map(v23CarTagLabel).join('、')+'</td><td><span class="tag '+(t.pri==='P0'?'pri':'')+'">'+t.pri+'</span></td>'
      +'<td><span class="tag '+st[1]+'">'+st[0]+'</span></td>'
      +'<td style="white-space:normal;min-width:180px"><span title="document_id: '+esc(t.doc)+'">'+esc(t.src)+'</span><div class="hint">'+esc((t.doc||'').slice(0,8))+'…</div></td></tr>'}).join('')
   +'</table></div></div>';
}
function v23TaxGapCard(){
  const gaps=v23TaxGaps();
  const byDom={};gaps.forEach(t=>{(byDom[t.domain]=byDom[t.domain]||[]).push(t)});
  return '<div class="card"><h3>P0 缺口 <span class="hint">共 '+gaps.length+' 条;这些是「应覆盖但还没做到可用」的点</span></h3>'
   +(gaps.length?Object.keys(byDom).map(d=>'<div style="padding:7px 0;border-top:1px solid #f2f3f5"><b>'+d+' · '+byDom[d].length+' 条</b><div style="margin-top:4px;line-height:2">'+byDom[d].map(t=>'<span class="tag warn" style="margin:0 5px 5px 0;padding:2px 8px">'+t.code+' '+esc(t.name)+'</span>').join('')+'</div></div>').join('')
    :'<div class="chk ok"><b>✓</b><span>P0 全部可用</span></div>')+'</div>';
}
function v23TaxImportCard(){
  return '<div class="card"><h3>批量导入 / 新车克隆 <span class="hint">新车上市不再一条条录</span></h3>'
   +'<div class="hint" style="line-height:1.7;margin-bottom:8px">① 按车系模板克隆 P0 骨架 → ② 只改价格/版本/配置/权益/竞品 → ③ CSV 批量补齐差异点。CSV 列固定,车型/知识域/能力项/阶段不认识的会报错并跳过。</div>'
   +'<textarea id="tax_csv" style="width:100%;min-height:110px;font:12px/1.6 Menlo,monospace">'+esc(UI.sel.taxCsv||v23TaxCsvText())+'</textarea>'
   +'<div style="margin-top:8px"><button class="btn" data-act="taxCsvSample">载入示例</button> <button class="btn pri" data-act="taxCsvImport">校验并导入</button> <button class="btn" data-act="taxImportRest">补齐未入库 P1</button></div>'
   +'<div id="tax_import_msg" class="hint" style="margin-top:6px"></div>'
   +'<div style="display:flex;gap:8px;align-items:center;margin-top:12px;padding-top:10px;border-top:1px solid #f2f3f5"><b>新车型克隆</b><select id="tax_clone_src" style="height:32px;border:1px solid var(--bd2);border-radius:8px">'+V23_TAX_META.cars.filter(c=>c!=='通用车型').map(c=>'<option>'+c+'</option>').join('')+'</select><span>→</span><input id="tax_clone_name" placeholder="新车型,如 YU7 Max" style="width:180px;height:32px;border:1px solid var(--bd2);border-radius:8px;padding:0 8px"><button class="btn pri" data-act="taxClone">克隆 P0 骨架</button></div>'
   +'</div>';
}
function cfgTaxLib(){
  if(typeof S==='undefined'||!S||!S.tax)return srcBar('知识点库 v1 是「公司应该覆盖哪些知识点」的标准清单。')+v23EmptyCta('知识点库 v1');
  const p0=S.tax.filter(t=>t.pri==='P0').length;
  const inLib=S.tax.filter(t=>t.kpId).length;
  const usable=S.tax.filter(t=>t.pri==='P0'&&v23TaxUsable(t)).length;
  const gaps=v23TaxGaps().length;
  const stat=(l,n,h)=>'<div class="stat"><div class="l">'+l+'</div><div class="n">'+n+'</div><div class="hint">'+h+'</div></div>';
  return srcBar('这一页是 <b>v1 标准库</b>:回答「应该覆盖哪些知识点、每款车还缺什么」。它不是学员数据;学员薄弱在工作台和效果追踪。标签是维度值,一个知识点可同时挂车型/场景/客户/竞品。')
   +'<div class="grid g4" style="margin-bottom:16px">'+stat('知识点',S.tax.length,'P0 '+p0+' / P1 '+(S.tax.length-p0))+stat('已入库',inLib,'没入库的保留为蓝图,可批量补齐')+stat('P0 可用',usable+' / '+p0,'可用 = 讲解+3 题+练习')+stat('P0 缺口',gaps,'按知识域看下面')+'</div>'
   +v23TaxFixCard()+v23TaxDimTable()+v23TaxMatrixHtml()+v23TaxGapCard()+v23TaxTable()+v23TaxImportCard();
}
A.taxSet=el=>{const f=UI.sel.taxf||(UI.sel.taxf={});const k=el.dataset.k;if(el.value)f[k]=el.value;else delete f[k];render()};
A.taxClear=()=>{UI.sel.taxf={};render()};
A.taxCsvSample=()=>{UI.sel.taxCsv=v23TaxCsvText();render()};
function v23TaxParseCsv(txt){
  const lines=String(txt||'').split(/\r?\n/).filter(l=>l.trim());if(!lines.length)return {head:[],rows:[]};
  const split=line=>{const out=[];let cur='',q=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'){if(q&&line[i+1]==='"'){cur+='"';i++}else q=!q}else if(ch===','&&!q){out.push(cur);cur=''}else cur+=ch}out.push(cur);return out.map(x=>x.trim())};
  const head=split(lines[0]);return {head,rows:lines.slice(1).map(l=>{const c=split(l);const o={};head.forEach((h,i)=>o[h]=c[i]||'');return o})};
}
A.taxCsvImport=()=>{
  const txt=($('#tax_csv')||{}).value||'';UI.sel.taxCsv=txt;
  const {rows}=v23TaxParseCsv(txt);let ok=0;const errs=[];
  rows.forEach((r,i)=>{
    const name=r['名称']||r['知识点'];if(!name){errs.push('第 '+(i+2)+' 行缺名称');return}
    const domain=r['知识域']||'销售技能';const ab=r['能力项']||'客户经营';const pri=r['优先级']||'P1';
    if(!V23_TAX_META.domains.includes(domain)){errs.push('第 '+(i+2)+' 行知识域「'+domain+'」不在字典');return}
    if(!V23_TAX_META.abilities.includes(ab)){errs.push('第 '+(i+2)+' 行能力项「'+ab+'」不在字典');return}
    if(!['P0','P1'].includes(pri)){errs.push('第 '+(i+2)+' 行优先级「'+pri+'」只能是 P0/P1');return}
    const cars=(r['车型']||'通用车型').split(/[、,，/]/).filter(Boolean);
    if(cars.some(c=>!V23_TAX_META.cars.includes(c))){errs.push('第 '+(i+2)+' 行车型不在字典');return}
    const stages=(r['销售阶段']||'全阶段').split(/[、,，/]/).filter(Boolean);
    if(stages.some(s=>!V23_TAX_META.stages.includes(s))){errs.push('第 '+(i+2)+' 行阶段不在字典');return}
    const code=r['知识点编号']||('KP-CUS-'+(S.tax.filter(t=>t.code.startsWith('KP-CUS-')).length+1));
    const t=TX(code,name,r['类型']||'事实',domain,ab,stages,cars,pri,r['来源']||'手工导入','',{scenes:(r['客户场景']||'').split(/[、,，/]/).filter(Boolean),custs:(r['客户类型']||'').split(/[、,，/]/).filter(Boolean),comps:(r['竞品']||'').split(/[、,，/]/).filter(Boolean)});
    S.tax.push(t);
    if(pri==='P0'){let n=Math.max(0,...S.kps.map(k=>+String(k.id).replace(/\D/g,'')||0));const id='K'+(++n);S.kps.push(v23TaxKp(id,t));t.kpId=id}
    ok++;
  });
  const m=$('#tax_import_msg');if(m)m.innerHTML='<b style="color:'+(errs.length?'#a15c00':'#0b7a50')+'">导入 '+ok+' 条'+(errs.length?',跳过 '+errs.length+' 条':'')+'</b>'+(errs.length?'<div>'+errs.slice(0,6).map(esc).join('<br>')+'</div>':'');
  if(ok)render();
};
A.taxImportRest=()=>{
  const rest=S.tax.filter(t=>!t.kpId);let n=0;
  let seq=Math.max(0,...S.kps.map(k=>+String(k.id).replace(/\D/g,'')||0));
  rest.forEach(t=>{const id='K'+(++seq);S.kps.push(v23TaxKp(id,t));t.kpId=id;n++});
  toast(n?'已把 '+n+' 条蓝图补成知识点骨架(启用,待补讲解/题)':'没有待入库的知识点','ok');render();
};
A.taxClone=()=>{
  const src=($('#tax_clone_src')||{}).value;const name=(($('#tax_clone_name')||{}).value||'').trim();
  if(!name)return toast('请填写新车型名称','err');
  if(V23_TAX_META.cars.includes(name)||S.tax.some(t=>t.cars.includes(name)))return toast('这个车型已经有知识点','err');
  if(typeof kpEnsureCar==='function')kpEnsureCar(name);
  if(!V23_TAX_META.cars.includes(name))V23_TAX_META.cars.push(name);
  const srcItems=S.tax.filter(t=>t.pri==='P0'&&v23TaxCarMatch(t,src)&&!t.cars.includes('通用车型'));
  if(!srcItems.length)return toast('源车型没有可克隆的专属 P0 知识点','err');
  let seq=Math.max(0,...S.kps.map(k=>+String(k.id).replace(/\D/g,'')||0));
  const made=[];
  srcItems.forEach((t,i)=>{
    const code='KP-CL-'+String(++seq).padStart(2,'0');
    const nt=JSON.parse(JSON.stringify(t));nt.code=code;nt.cars=[name];nt.legacy=[];nt.kpId='';nt.note='克隆自 '+t.code+' · 待差异化';
    S.tax.push(nt);const id='K'+(++seq);S.kps.push(v23TaxKp(id,nt));nt.kpId=id;made.push(code);
  });
  toast('已从「'+src+'」克隆 '+made.length+' 条 P0 骨架到「'+name+'」,全部启用待补讲解/题','ok');render();
};