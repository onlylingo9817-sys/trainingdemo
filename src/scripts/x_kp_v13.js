/* 知识点 v13：49 点、领域分组、旧 68 迁移、演示年款。数据来自初始化方案，不是新的车型事实。 */
const KP_V13_DATA={"kps":[{"id":"XM-B01","name":"品牌承诺与可信服务表达","group":"基础","out":"能用对应品牌的可靠产品与服务事实回应信任问题。","inc":"品牌定位；承诺证据；不知道时查证","exc":"品牌口号背诵；未经证实的行业第一","role":"零售顾问","stage":"入门","verify":"情景演练＋事实辨析","pri":"P1","src":"A/B为行业设计依据；C/D/E/G仅支持小米；澎程品牌事实待核实","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-B02","name":"产品与政策资料查证","group":"基础","out":"能找到匹配品牌、车型、年款、配置和日期的依据，分清已上线与待实现。","inc":"官网、配置表、手册、App条款；测试条件；同年多配置","exc":"背下所有参数；新闻预测当正式配置；旧款资料默认覆盖新款","role":"零售顾问／交付顾问","stage":"上岗前","verify":"资料检索操作＋事实题","pri":"P0","src":"C/D/E/G/H；澎程对应资料待核实","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-B03","name":"客户信息与演示授权","group":"基础","out":"能在留资、连手机与展示账号前说明用途，选择必要信息并退出演示授权。","inc":"必要信息；同意与退出；演示账号；第三方边界","exc":"要求提供真实密码作训练；把某品牌隐私条款当所有品牌合同","role":"零售顾问／交付顾问","stage":"上岗前","verify":"操作任务＋情景演练","pri":"P0","src":"H支持小米具体条件；A/B支持行业场景；澎程具体条款待核实","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-P01","name":"电驱系统与能量流","group":"产品共性","out":"能解释电池、电驱、回收与低压电源在日常用车中的作用。","inc":"电能储存与驱动；回收；功率和电量；纯电与增程电驱共性","exc":"维修诊断；逐个电机型号背诵；增程用油用电决策归P18","role":"零售顾问","stage":"上岗前","verify":"事实题＋简短解释","pri":"P0","src":"C/D/E支持小米纯电资料；澎程电驱具体结构待核实","level":"多车型","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-P02","name":"续航口径与实际能耗","group":"产品共性","out":"能区分标称工况与真实出行，依据具体车款和路线作有条件的续航解释。","inc":"温度、速度、载荷、空调、轮胎影响；电量余量；工况口径","exc":"保证实跑固定里程；混用车型年款最大值；增程亏电工况的专门判断归P18","role":"零售顾问","stage":"上岗前","verify":"事实题＋场景解释","pri":"P0","src":"C/D/E；澎程纯电续航、工况和参数待核实","level":"多车型","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-P03","name":"家庭与公共补能方案","group":"产品共性","out":"能按家充条件、日常路线和长途频率匹配补能方式并说明限制。","inc":"家充勘测前置；桩兼容与功率条件；路线与备选；增程车型也可有充电需求","exc":"保证家充可装；施工；未经证实站点覆盖；增程能源模式取舍归P18","role":"零售顾问","stage":"上岗前","verify":"情景演练＋资料检索","pri":"P0","src":"C/D/E支持小米补能；澎程接口与桩条件待核实","level":"多车型","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-P04","name":"充电操作与异常求助","group":"产品共性","out":"能按本车资料完成充电准备、开始和结束，并把异常转交正确渠道。","inc":"接口检查；状态识别；按手册结束与求助","exc":"带电维修；私自拆卸；跨年款照搬应急解锁","role":"零售顾问／交付顾问","stage":"上岗前","verify":"操作任务＋异常情景","pri":"P0","src":"C/D/G；具体操作须相应手册，澎程待核实","level":"多车型","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-P05","name":"动力电池防护与用车边界","group":"产品共性","out":"能把电池防护设计、验证条件与用户注意事项分开说明。","inc":"电池包防护；热安全概念；涉水、托底问题转介","exc":"保证不起火；维修鉴定；把材料名当整体安全保证","role":"零售顾问","stage":"上岗前","verify":"事实题＋顾虑回应","pri":"P0","src":"C/D/E/G；澎程电池及“龙甲”名称适用性待核实","level":"多车型","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-P06","name":"被动安全与应急逃生认知","group":"产品共性","out":"能说明车身、约束系统和应急开门的作用，定位本车使用说明。","inc":"安全带与气囊；车身结构；门锁冗余；儿童乘坐提醒","exc":"材料强度等同整车安全；跨车型年款照搬逃生步骤","role":"零售顾问／交付顾问","stage":"上岗前","verify":"事实题＋静态操作定位","pri":"P0","src":"C/D/E；澎程结构、气囊与开门操作待核实","level":"多车型","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-P07","name":"主动安全功能与限制","group":"产品共性","out":"能区分预警、干预和辅助驾驶，解释主动安全不能保证避免事故。","inc":"功能类别；触发条件；环境限制","exc":"危险实车触发测试；把AEB说成自动驾驶","role":"零售顾问","stage":"上岗前","verify":"事实题＋情景辨析","pri":"P0","src":"F/C/D/E；澎程具体功能和软件状态待核实","level":"多车型","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-P08","name":"辅助驾驶能力边界与驾驶责任","group":"产品共性","out":"能明确辅助驾驶不替代驾驶员，并纠正可脱管、可分心等误解。","inc":"持续观察与控制；运行条件；接管；用户角色","exc":"承诺自动驾驶；用算力和传感器数量证明安全等级","role":"零售顾问／交付顾问","stage":"上岗前","verify":"情景演练＋事实题","pri":"P0","src":"F为组合驾驶辅助通用边界；C/D/E为小米警示；澎程功能级别及适用条件待核实","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":"通用的是辅助驾驶边界认知，不据此断言每辆车配备同类系统或获得自动驾驶准入。"},{"id":"XM-P09","name":"辅助驾驶与泊车功能识别及演示","group":"产品共性","out":"能依据本车型年款和软件辨认功能状态、启停条件与退出路径，再选择合适演示。","inc":"道路与泊车类别差异；可用状态；退出；用户教育入口","exc":"演示未交付功能；道路上挑战极限；把不同功能开关位置当新知识点","role":"零售顾问／交付顾问","stage":"车型上岗前","verify":"静态操作＋安全情景演练","pri":"P0","src":"C/D/E/F；澎程配备及操作待核实","level":"多车型","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-P10","name":"座舱信息与语音交互","group":"产品共性","out":"能完成客户需要的车机任务，并说明交互限制与替代操作。","inc":"导航、显示、语音；联网和权限条件；失败回退","exc":"芯片参数代替体验；假定所有车有同一屏幕","role":"零售顾问","stage":"车型上岗前","verify":"操作任务＋简短解释","pri":"P0","src":"C/D/E；澎程界面、语音和具体配置待核实","level":"多车型","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-P11","name":"手车家互联与跨手机生态","group":"产品共性","out":"能按客户设备条件选择可行的手车/车家连接方式，展示适用的连续场景。","inc":"手机钥匙、信息流转、车家联动；手机兼容；账号、设备、软件和配件条件","exc":"承诺所有手机同功能；把配件当标配；把小米生态照搬澎程","role":"零售顾问／交付顾问","stage":"车型上岗前","verify":"操作任务＋场景解释","pri":"P0","src":"C/D/E/H支持小米；澎程生态能力及本点适用性待核实","level":"多车型","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":"澎程先保留候选适用关系以承接旧PC-07；若不支持某类互联，则资源明确不适用，不虚构功能。"},{"id":"XM-P12","name":"OTA与功能状态解释","group":"产品共性","out":"能区分硬件配置、已上线软件与待OTA功能，定位相应车辆更新说明。","inc":"适用版本；更新条件按手册；升级后变化","exc":"承诺未公布日期；OTA等于无限硬件升级","role":"零售顾问／交付顾问","stage":"上岗前","verify":"事实题＋资料检索","pri":"P0","src":"C/D/E；澎程升级能力与说明待核实","level":"多车型","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-P13","name":"车型定位与配置取舍","group":"产品共性","out":"能按客户需求推荐合适车型与配置，说明依据和取舍。","inc":"车型定位；年款配置差异；选装互斥；预算与用途匹配","exc":"一律推荐顶配；把不同车型名称当独立销售能力","role":"零售顾问","stage":"车型上岗前","verify":"情景演练＋配置检索","pri":"P0","src":"C/D/E支持小米；澎程N70/N90定位与配置待核实","level":"多车型","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-P14","name":"空间舒适与乘坐适配","group":"产品共性","out":"能用乘坐和装载任务验证是否适合，正确选择并演示座椅空间功能。","inc":"上下车、座椅布局与调整、储物装载、静谧、热舒适；操作前提","exc":"一个容积数保证任何行李都能装；未经证实医学功效；想当然演示旋转座椅","role":"零售顾问","stage":"车型上岗前","verify":"静态操作＋场景演练","pri":"P0","src":"C/D/E；澎程七座、滑轨、零重力、旋转座椅与安全条件待核实","level":"多车型","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-P15","name":"底盘驾控与舒适性取舍","group":"产品共性","out":"能解释悬架、制动、轮胎与驾驶设置的体验差异并安排安全感知。","inc":"本版本硬件；舒适和支撑；回收与驾驶感受","exc":"硬件名代替效果；危险驾驶；维修参数","role":"零售顾问","stage":"试驾上岗前","verify":"事实题＋试驾讲解演练","pri":"P0","src":"C/D/E；澎程底盘与驾驶设置待核实","level":"多车型","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-P16","name":"设计与个性化配置取舍","group":"产品共性","out":"能结合审美、使用与维护需求说明颜色、内外饰、轮毂和选装取舍。","inc":"实车色差；标配选装；轮胎轮毂使用影响","exc":"每种颜色建点；未经核实改装承诺","role":"零售顾问","stage":"进阶","verify":"配置操作＋情景演练","pri":"P1","src":"C/D/E；澎程可选配置待核实","level":"多车型","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-P17","name":"高性能车型使用与赛道边界","group":"产品专项","out":"能解释高性能配置的用途与限制，明确赛道成绩不能成为公共道路承诺。","inc":"测试条件；选装互斥；轮胎制动与专门服务条件","exc":"赛道驾驶执照教学；公路竞速；无依据保修承诺","role":"Ultra专项顾问","stage":"专项上岗","verify":"事实题＋情景演练","pri":"P1","src":"E；仅支持所列车型资料","level":"车型专属","models":["SU7 Ultra"],"note":"专项顾问上岗包设必修；新性能车型只有同目标同证据时才扩适用范围，不自动另建同名点。"},{"id":"XM-P18","name":"增程使用与油电取舍","group":"产品专项","out":"能在已核实的增程规则下，区分纯电续航、燃油补能与低电量工况，按路线选择能源方案。","inc":"增程与电驱关系；纯电/综合续航口径区别；有无充电条件的取舍；亏电油耗及成本的条件；NVH与热管理相关使用边界","exc":"编造实际油耗、续航和模式名称；仅凭亏电数字保证成本；维修结构原理；通用成本计算重复建点","role":"澎程相关零售顾问","stage":"澎程车型上岗前","verify":"带资料能源方案任务＋事实辨析","pri":"P0","src":"K仅证明旧Demo有该训练需求；澎程真实动力系统、参数、模式与年款全部待核实。此定义是设计建议，不是官方产品事实。","level":"多车型","models":["澎程N70","澎程N90"],"note":"新增原因是增程能源决策与纯电车型的验证证据不同，不是因为品牌不同。若核实只有部分车型/年款为增程，收窄本点适用范围；无依据不生成事实答案。"},{"id":"XM-S01","name":"线索判断与首次联系","group":"销售旅程","out":"能辨别线索意向和下一步，在同意渠道完成有效首触。","inc":"来源、时效、意向、联系目的和记录","exc":"把5分钟当行业统一规定；无授权反复联系","role":"零售顾问","stage":"上岗前","verify":"情景演练＋记录任务","pri":"P0","src":"A/B；H仅支持小米具体隐私条件","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-S02","name":"邀约到店与再次邀约","group":"销售旅程","out":"能围绕客户目的约定时间、参与人和体验事项，未到店时重建计划。","inc":"价值理由；到店安排；改期二邀；参与人邀请","exc":"固定八步必须背诵；虚构权益逼迫到店","role":"零售顾问","stage":"上岗前","verify":"电话/消息情景演练","pri":"P0","src":"A/B；各品牌门店SOP另接","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-S03","name":"到店接待与体验衔接","group":"销售旅程","out":"能从来意确认进入合适体验，不让客户重复解释或被晾置。","inc":"迎接；时间与来意；已有信息衔接；转交说明","exc":"礼仪动作逐条建点；强制留资才体验","role":"零售顾问","stage":"上岗前","verify":"现场情景演练","pri":"P0","src":"B；门店流程为建议默认","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-S04","name":"用车需求与优先级识别","group":"销售旅程","out":"能形成经客户确认的需求摘要，识别限制和最重要取舍。","inc":"人、路线、补能、预算时间；追问与确认；开放/封闭问法","exc":"背五问或SPIN等于学会；凭人群标签猜需求","role":"零售顾问","stage":"上岗前","verify":"情景演练＋需求摘要","pri":"P0","src":"B；结果与边界为本项目设计","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-S05","name":"购车参与人与决策协同","group":"销售旅程","out":"能区分使用、参与、付款和决策角色，安排共同体验。","inc":"角色关系；意见差异；征得同意再邀请","exc":"强索家庭财务；付款人必是决策人","role":"零售顾问","stage":"进阶","verify":"多角色演练","pri":"P1","src":"B；具体话术为建议","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-S06","name":"基于需求的产品价值讲解","group":"销售旅程","out":"能把准确事实连到客户场景、可感收益和验证方式。","inc":"需求→事实→利益→体验；保留条件；配置取舍","exc":"背所有卖点；技术名词当利益；每车型复制销售能力","role":"零售顾问","stage":"上岗前","verify":"情景讲车＋事实核对","pri":"P0","src":"B支持共性；小米事实C/D/E；澎程具体事实待核实","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-S07","name":"同条件竞品比较","group":"销售旅程","out":"能围绕优先项作有来源、同口径且尊重竞品的比较。","inc":"同配置、日期和工况；证据不足则说明；需求取舍","exc":"贬低竞品；虚构保值；每个对比话题独立建点","role":"零售顾问","stage":"进阶","verify":"情景演练＋资料比较","pri":"P1","src":"B；双方事实须各自来源，澎程数据待核实","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-S08","name":"试驾目标确认与安全准备","group":"销售旅程","out":"能确认体验目标、必要条件与路线，使试驾有针对性。","inc":"需求转体验点；资格按门店规则；车辆路线；风险提示","exc":"PDC是唯一标准；编造品牌资格SOP","role":"零售顾问","stage":"试驾上岗前","verify":"操作任务＋试驾前演练","pri":"P0","src":"B/F；内部SOP未取得，使用建议默认","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-S09","name":"安全组织试乘试驾","group":"销售旅程","out":"能在合法安全路线组织体验、适时讲解、照顾乘员并结束交接。","inc":"讲解与驾驶分工；安全换手；设置；不适与异常停止","exc":"急加速急刹表演；客户测试系统极限","role":"零售顾问","stage":"试驾上岗前","verify":"观察式任务＋异常演练","pri":"P0","src":"B/F；车型操作按对应手册，澎程待核实","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-S10","name":"试驾复盘与后续推进","group":"销售旅程","out":"能收集体验证据、辨明未解决问题并约定下一步。","inc":"体验前后对比；顾虑；责任和约定时间","exc":"固定T+1适合所有人；只问满意否","role":"零售顾问","stage":"上岗前","verify":"情景演练＋记录任务","pri":"P0","src":"A/B","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-S11","name":"顾虑澄清与异议回应","group":"销售旅程","out":"能先定位顾虑，再用相关证据和选择回应并确认是否解决。","inc":"价格、续航、安全、品牌情境；承认不足；专业转介","exc":"万能话术；保证保值；催单掩盖事实问题","role":"零售顾问","stage":"上岗前","verify":"情景演练","pri":"P0","src":"B；具体产品/服务证据按品牌车型取得","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-S12","name":"购买意向确认与自主决策支持","group":"销售旅程","out":"能识别准备程度、提供下一步选择，未准备好时保留计划。","inc":"意向确认；下订或继续体验；拒绝与延后；衔接订单","exc":"逼单；把演练变成真实支付","role":"零售顾问","stage":"上岗前","verify":"情景演练","pri":"P0","src":"B；流程为建议默认","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-O01","name":"配置确认与订购状态解释","group":"成交交接","out":"能区分选配、下订、锁单等适用状态，带客户核对当前协议后果。","inc":"主体；车型年款配置；选装互斥；实际支付名目及协议后果查证；锁单前后改配、取消、退款申请与进度；不确定项转订单支持","exc":"历史7天规则或固定交期硬编码；代替用户同意协议","role":"零售顾问","stage":"成交上岗前","verify":"模拟订单操作＋状态情景","pri":"P0","src":"I仅小米历史场景；所有品牌现行协议另核；澎程待核实","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-O02","name":"购车报价与使用成本说明","group":"成交交接","out":"能分项表达车辆、选装、服务、金融与使用成本，说明估算前提。","inc":"总支出；一次与持续费用；电价油价、里程和充电比例等假设","exc":"月供当总价；固定成本保证；增程能源规则辨析归P18","role":"零售顾问","stage":"成交上岗前","verify":"报价任务＋异议演练","pri":"P0","src":"B为设计支持；G仅小米服务；具体金额及澎程数据待核实","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-O03","name":"政策权益适用性核对","group":"成交交接","out":"能按时间、地区、主体、车辆和材料核对适用政策及办理入口。","inc":"补贴、置换、品牌权益；叠加条款依据；材料；政策变化按地域主体有效期重新核对；旧车评估处置归O07","exc":"固定额度；保证审批；包办所有城市细则","role":"零售顾问","stage":"成交上岗前","verify":"条款检索＋案例判断","pri":"P0","src":"B为设计依据；金额条件须当期政策原文，未在本页填入","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-O04","name":"金融方案比较与转介","group":"成交交接","out":"能比较首付、期限、费用和总支出，将审批合同问题转专业方。","inc":"月供和总成本；贴息条件；提前还款查阅","exc":"保证审批；代作资质审核；只背利率","role":"零售顾问","stage":"成交上岗前","verify":"比较任务＋解释演练","pri":"P0","src":"B为设计支持；具体费率另接当期合同","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-O05","name":"保险与服务权益选择说明","group":"成交交接","out":"能区分保险、质保和增值服务，解释相关选项与限制。","inc":"险种概念；城市/服务前置条件；事故、损坏、质量问题区别","exc":"一切都赔；付费说成全系免费；专业定损","role":"零售顾问","stage":"进阶","verify":"条款案例＋情景演练","pri":"P1","src":"G/E仅支持小米；澎程质保、保险合作和权益待核实","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-O06","name":"订单进度沟通与销售交付交接","group":"成交交接","out":"能把配置、承诺、待办和关切完整交接，说明进度查询方式。","inc":"岗位分工；确认配置；材料待办；延期与承诺变化；异常受理转交、责任人和回告；置换交接引用O07","exc":"排产插队承诺；客户重复解释","role":"零售顾问／交付顾问","stage":"交接上岗前","verify":"交接单任务＋等待期演练","pri":"P0","src":"A/B支持协同；I/G仅小米场景；澎程入口待核实","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-O07","name":"置换评估协同与旧车处置交接","group":"成交交接","out":"能收集经客户同意的必要旧车资料，转交专业评估，解释报价边界，并把待核权属贷款、旧车处置与新车交付事项接续清楚。","inc":"旧车身份与车况自述；专业评估预约与资料转交；估价条件、有效期和复核；区分旧车价、新车价、置换补贴；未结清贷款及权属由专业方核实；处置和交车时间依赖；责任人与待办回执","exc":"顾问独立专业鉴定或估价；保证贷款解押、过户或补贴成功；未经授权处置旧车；拿预估价承诺最终抵扣；真实资金和证件操作","role":"零售顾问／交付顾问；评估及金融人员作为协作角色","stage":"承接置换业务前","verify":"置换案例演练＋评估转介与处置交接摘要","pri":"P0","src":"B支持汽车销售协同任务视角；独立成点及流程为本项目设计。各品牌评估合作、金融、处置流程、地方补贴均需当期依据；澎程相关资料待核实。","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":"沿用多年款适用原则；旧车本身另记其车辆信息，新车资料按所选车型年款。政策地域/时效不充当新年款。不培训独立二手车鉴定。"},{"id":"XM-C01","name":"客户档案与下一步管理","group":"客户经营","out":"能用必要标签与真实进展生成下一步，其他同事可接续。","inc":"需求、顾虑、授权、阶段、责任和约定时间；企微为可选工具","exc":"标签数当能力；每个工具按钮建点","role":"零售顾问","stage":"上岗前","verify":"模拟CRM操作","pri":"P0","src":"A/B；品牌具体隐私条款另核","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-C02","name":"有价值触达与沉睡线索再激活","group":"客户经营","out":"能按未解决问题选择内容渠道时机，尊重不再联系的选择。","inc":"信息匹配；变化通知；低频唤醒；回应记录","exc":"全员直播；群发轰炸；发帖数量当目标","role":"零售顾问","stage":"进阶","verify":"触达任务＋演练","pri":"P1","src":"A/B；具体渠道规则另核","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-C03","name":"交付后关怀与转介绍","group":"客户经营","out":"能确认用车问题已有人承接，适时提出自愿推荐或复购服务。","inc":"使用关怀；服务转接；推荐同意；需求变化","exc":"未公布积分；强索朋友信息","role":"零售顾问","stage":"进阶","verify":"回访演练＋记录","pri":"P1","src":"A/B；G为小米服务，澎程权益待核实","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-D01","name":"到店验车与交付手续","group":"交付服务","out":"能按清单共同检查车辆资料，记录疑问后完成手续衔接。","inc":"车况、配置、物品、文件与待办；验车异议记录与证据；未解决项转交；不逼签或擅定维修赔偿结果","exc":"维修鉴定；强迫签字；建议清单冒充品牌官方SOP","role":"交付顾问","stage":"交付上岗前","verify":"模拟交付操作","pri":"P0","src":"B为任务设计；G/I为小米场景；澎程清单待核实","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-D02","name":"首次用车教育与复述确认","group":"交付服务","out":"能完成必要首次设置，确认用户能独立找到关键操作和求助。","inc":"开门启停、充电、钥匙授权、手册、辅助驾驶边界；先必需后进阶","exc":"九大功能一次讲完；保管密码；讲过等于学会","role":"交付顾问","stage":"交付上岗前","verify":"用户反向演示＋情景任务","pri":"P0","src":"C/D/E/G/H支持小米具体场景；澎程操作待核实","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-D03","name":"用车问题受理与服务升级","group":"交付服务","out":"能区分疑问、服务请求、投诉和紧急风险，转接并确认承接。","inc":"手册检索；预约；救援投诉；异常升级与承接回执；回告已核事实和待办；不越权承诺责任赔付","exc":"维修诊断；保证责任与赔付","role":"交付／服务顾问；零售学习转接部分","stage":"服务上岗前","verify":"情景演练＋入口操作","pri":"P0","src":"G仅支持小米服务；澎程服务网络、权益和入口待核实","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-M01","name":"基于表现的带教与补学","group":"带教管理","out":"能从表现定位薄弱目标，选择对应范围资源并安排再验证。","inc":"观察证据；反馈；目标知识点；换情境复测","exc":"模拟成绩当真；课程完成数代替能力","role":"店长／带教主管","stage":"带教上岗前","verify":"带教案例任务","pri":"P0","src":"B；项目补学闭环为建议设计","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-M02","name":"接待与试驾观察反馈","group":"带教管理","out":"能观察关键行为、给出可执行反馈并复看改进。","inc":"探需、事实准确、安全和交接；具体例子","exc":"印象评分；成交率证明单次能力","role":"店长／带教主管","stage":"带教上岗前","verify":"观察评分＋反馈演练","pri":"P0","src":"B/F；门店规则另接","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""},{"id":"XM-M03","name":"门店训练重点与节奏安排","group":"带教管理","out":"能结合资料变化与人员薄弱点排训练，区分新口径补学与仅补练习。","inc":"新人路径；车型年款差异；短训；学习包差异；复测","exc":"完整门店经营；所有业绩问题都靠培训","role":"店长／销售主管","stage":"进阶","verify":"训练计划任务","pri":"P1","src":"A/B；应用方案为项目建议","level":"通用","models":["SU7","YU7","SU7 Ultra","澎程N70","澎程N90"],"note":""}],"mig":[{"code":"KP-BR-01","name":"小米品牌与“真诚热爱”价值观","action":"改名并入","to":"XM-B01；资源范围＝小米","why":"品牌事实各自维护，可信表达可共用，不要求背口号。","ids":["XM-B01"]},{"code":"KP-BR-06","name":"人车家全生态战略","action":"并入共通点","to":"XM-P11；XM-B01背景资源","why":"小米战略和产品资料保留小米适用范围；不声称澎程也有同样生态。","ids":["XM-P11","XM-B01"]},{"code":"KP-PROD-01","name":"小米汽车产品线全景与纯电/增程路线","action":"拆分","to":"XM-P13/P01/P18","why":"定位、电驱共性、增程决策各有结果；按实际车型年款收范围，不混品牌参数。","ids":["XM-P13"]},{"code":"KP-PROD-PC-01","name":"澎程产品线定位与 N70/N90 选择","action":"并入共通点＋待核实","to":"XM-P13；澎程N70/N90","why":"保留定位选择训练需求和原引用；具体定位配置待核实，不因非小米移除。","ids":["XM-P13"]},{"code":"KP-PROD-PC-02","name":"澎程增程动力与纯电续航怎么讲","action":"拆分＋待核实","to":"XM-P18/P01/P02；澎程N70/N90","why":"增程油电取舍为少量专项目标；电驱和续航共性复用；动力类型、年款和参数待核实。","ids":["XM-P18"]},{"code":"KP-PROD-PC-03","name":"澎程亏电油耗与用车成本","action":"拆分＋待核实","to":"XM-P18＋XM-O02；澎程N70/N90","why":"亏电条件辨析归P18，成本计算归O02；不编油耗，不整块归档。","ids":["XM-P18","XM-O02"]},{"code":"KP-PROD-PC-04","name":"澎程大七座空间与座椅布局","action":"并入共通点＋待核实","to":"XM-P14；澎程N70/N90","why":"空间任务共用；七座事实、年款和布局待核实，原记录留映射。","ids":["XM-P14"]},{"code":"KP-PROD-PC-05","name":"澎程智能可变大空间 / 纯平地板 / 滑轨","action":"并入共通点＋待核实","to":"XM-P14；澎程N70/N90","why":"可变空间作为装载/乘坐任务资料；滑轨与地板配置及安全条件待核实。","ids":["XM-P14"]},{"code":"KP-PROD-PC-06","name":"澎程二排零重力 / 旋转座椅","action":"并入共通点＋待核实","to":"XM-P14；澎程N70/N90","why":"保留舒适与座椅操作场景；具体功能及允许操作条件待核实，不由名称推断存在。","ids":["XM-P14"]},{"code":"KP-PROD-PC-07","name":"澎程智能座舱与生态","action":"拆分＋待核实","to":"XM-P10/P11；澎程N70/N90","why":"座舱任务和连接任务分开；生态功能未证实，保留候选关系与待核记录，不套小米功能。","ids":["XM-P10"]},{"code":"KP-PROD-PC-08","name":"澎程辅助驾驶与安全","action":"拆分＋待核实","to":"XM-P05/P06/P07/P08/P09；澎程N70/N90","why":"安全类别与辅助驾驶结果独立；实际配置和适用性待核实，目录与引用不消失。","ids":["XM-P05"]},{"code":"KP-PROD-SU7-01","name":"SU7 车系定位与版本选择","action":"并入共通点","to":"XM-P13；SU7指定年款配置","why":"推荐目标相同不复制点，资源保留SU7差异。","ids":["XM-P13"]},{"code":"KP-PROD-SU7-02","name":"SU7 外观与个性化卖点","action":"并入共通点","to":"XM-P16；SU7指定年款配置","why":"颜色轮毂是资源子项，按使用取舍验证。","ids":["XM-P16"]},{"code":"KP-PROD-SU7-03","name":"SU7 内饰质感与豪华配置","action":"拆分并入","to":"XM-P14/P16；SU7指定年款配置","why":"乘坐舒适与审美配置按真实内容分挂。","ids":["XM-P14"]},{"code":"KP-PROD-SU7-04","name":"SU7 续航与补能怎么讲","action":"拆分","to":"XM-P02/P03；讲法关联XM-S06","why":"数据在SU7各年款资源内维护，不另设车型事实目录。","ids":["XM-P02","XM-S06"]},{"code":"KP-PROD-SU7-05","name":"SU7 底盘与驾控","action":"并入共通点","to":"XM-P15；SU7指定年款配置","why":"保留本车体验差异，共用学习目标。","ids":["XM-P15"]},{"code":"KP-PROD-SU7-06","name":"SU7 智能座舱：天际屏 / 超级小爱","action":"拆分改名","to":"XM-P10/P11；SU7指定年款软件","why":"天际屏归属在已有SU7资料未核实，标待核而非照搬YU7；语音与互联按各自资源。","ids":["XM-P10"]},{"code":"KP-PROD-SU7-07","name":"SU7 辅助驾驶 HAD/XLA 与能力边界","action":"拆分","to":"XM-P08/P09；SU7指定年款软件","why":"责任认知与具体操作可分别失败；名称升级先改资源，不加知识点。","ids":["XM-P08"]},{"code":"KP-PROD-SU7-08","name":"SU7 安全：主动 / 被动 / 冗余","action":"拆分","to":"XM-P05/P06/P07；SU7指定年款","why":"各类安全分别验证；冗余是相应主题子项。","ids":["XM-P05"]},{"code":"KP-PROD-SU7-09","name":"SU7 Ultra 性能与赛道卖点","action":"保留改名","to":"XM-P17；SU7 Ultra指定年款配置","why":"专项使用边界不同，有独立目标；普通SU7不因此必修。","ids":["XM-P17"]},{"code":"KP-PROD-TECH-01","name":"龙甲电池与电池安全","action":"改名并入＋待核实","to":"XM-P05；具体车型年款待核","why":"保留旧名与记录；未核实名称不当产品事实，安全目标仍在。","ids":["XM-P05"]},{"code":"KP-PROD-TECH-02","name":"充电补能体系：家充 / 超充 / 三方桩","action":"拆分","to":"XM-P03/P04","why":"选方案与实际充电操作是不同结果，资源各标车型年款。","ids":["XM-P03"]},{"code":"KP-PROD-TECH-03","name":"辅助驾驶能力边界与法规责任","action":"保留改名","to":"XM-P08","why":"共通边界，不再按每个车型复制。","ids":["XM-P08"]},{"code":"KP-PROD-TECH-04","name":"OTA 升级机制","action":"保留改名","to":"XM-P12","why":"硬件、已上线和待OTA状态辨析；每车软件更新放资源。","ids":["XM-P12"]},{"code":"KP-PROD-TECH-05","name":"超级小爱与四域合一","action":"拆分","to":"XM-P10；架构资料关联XM-P01/P12","why":"语音任务与架构事实不同；小米资料范围不外推澎程。","ids":["XM-P10","XM-P01"]},{"code":"KP-PROD-TECH-06","name":"车身结构与被动安全","action":"保留改名","to":"XM-P06","why":"具体材料与结构随车型年款资源维护。","ids":["XM-P06"]},{"code":"KP-PROD-TECH-07","name":"增程器 NVH / 热管理 / 冬季续航","action":"拆分＋待核实","to":"XM-P18/P14/P02","why":"增程能源边界、舒适和冬季能耗分别归位；澎程增程器等具体资料待核，不转归档消失。","ids":["XM-P18"]},{"code":"KP-PROD-YU7-01","name":"YU7 车系定位与版本选择","action":"并入共通点","to":"XM-P13；YU7指定年款配置","why":"同一推荐目标，资源保留YU7用途与取舍。","ids":["XM-P13"]},{"code":"KP-PROD-YU7-02","name":"YU7 外观设计与颜色","action":"并入共通点","to":"XM-P16；YU7指定年款配置","why":"颜色不是独立过关点。","ids":["XM-P16"]},{"code":"KP-PROD-YU7-03","name":"YU7 续航与 800V 补能","action":"拆分","to":"XM-P02/P03；YU7指定年款配置","why":"充电条件与口径留在对应资源，不用800V标签包办结论。","ids":["XM-P02"]},{"code":"KP-PROD-YU7-04","name":"YU7 驾控与底盘","action":"并入共通点","to":"XM-P15；YU7指定年款配置","why":"同目标不抹去实际体验与硬件差异。","ids":["XM-P15"]},{"code":"KP-PROD-YU7-05","name":"YU7 座舱与天际屏","action":"拆分并入","to":"XM-P10/P11；YU7指定年款软件","why":"显示和互联任务分别挂；具体屏幕资料仍保留。","ids":["XM-P10"]},{"code":"KP-PROD-YU7-06","name":"YU7 空间与家庭场景","action":"并入共通点","to":"XM-P14；YU7指定年款配置","why":"空间事实放资源，家庭使用放演练。","ids":["XM-P14"]},{"code":"KP-PROD-YU7-07","name":"YU7 安全卖点","action":"拆分","to":"XM-P05/P06/P07；YU7指定年款","why":"避免一个大安全点覆盖所有薄弱结果。","ids":["XM-P05"]},{"code":"KP-CMP-01","name":"竞品对比方法论：先认同、讲差异、回到需求","action":"改名","to":"XM-S07","why":"保留证据与同条件比较，三步法为可选方法。","ids":["XM-S07"]},{"code":"KP-CMP-02","name":"价格与权益对比","action":"转资源场景","to":"XM-S07；引用XM-O02/O03","why":"比较情境不是新的通用能力；金额权益按日期和范围。","ids":["XM-S07","XM-O02"]},{"code":"KP-CMP-03","name":"空间与舒适对比","action":"转资源场景","to":"XM-S07；引用XM-P14","why":"同一比较目标，双方车型年款资料分别引用。","ids":["XM-S07","XM-P14"]},{"code":"KP-CMP-04","name":"续航与补能对比","action":"转资源场景","to":"XM-S07；引用XM-P02/P03/P18（适用时）","why":"增程和纯电口径不得混比；换对比对象不新建点。","ids":["XM-S07","XM-P02"]},{"code":"KP-CMP-05","name":"智能座舱与生态对比","action":"转资源场景","to":"XM-S07；引用XM-P10/P11","why":"兼容和软件条件必须对齐。","ids":["XM-S07","XM-P10"]},{"code":"KP-CMP-06","name":"辅助驾驶与安全对比","action":"转资源场景","to":"XM-S07；引用XM-P05至P09","why":"硬件数量不能直接排安全名次；边界单独学。","ids":["XM-S07","XM-P05"]},{"code":"KP-CMP-07","name":"品牌、服务与保值对比","action":"转资源场景","to":"XM-S07；引用XM-B01/O05/D03","why":"无依据保值资料标待核，不创造承诺。","ids":["XM-S07","XM-B01"]},{"code":"KP-MGR-01","name":"新人带教与陪访","action":"保留改名","to":"XM-M01","why":"从陪访次数转为证据和对应补学。","ids":["XM-M01"]},{"code":"KP-MGR-02","name":"门店例会与目标拆解","action":"缩小范围","to":"XM-M03；经营内容保留扩展资源","why":"聚焦训练重点，不承担完整经营系统。","ids":["XM-M03"]},{"code":"KP-MGR-03","name":"试驾 / 接待质量点检与辅导工单","action":"保留改名","to":"XM-M02","why":"观察反馈为能力，工单是工具。","ids":["XM-M02"]},{"code":"KP-SALE-01","name":"线索分级与 5 分钟首触","action":"改名","to":"XM-S01","why":"时限可作门店节奏，不冒充统一行业事实。","ids":["XM-S01"]},{"code":"KP-SALE-02","name":"电话邀约八步法","action":"改名","to":"XM-S02","why":"按邀约结果定义，八步是话术资源。","ids":["XM-S02"]},{"code":"KP-SALE-03","name":"二次邀约与决策人邀约","action":"拆分并入","to":"XM-S02/S05","why":"二邀为情境，参与人协同有独立结果。","ids":["XM-S02"]},{"code":"KP-SALE-04","name":"到店接待标准流程","action":"保留改名","to":"XM-S03","why":"关注体验连续性，门店动作放清单。","ids":["XM-S03"]},{"code":"KP-SALE-05","name":"需求挖掘必问 5 问","action":"改名","to":"XM-S04","why":"看需求摘要而不是提问数。","ids":["XM-S04"]},{"code":"KP-SALE-06","name":"开放式 + 封闭式提问组合","action":"转方法资源","to":"XM-S04","why":"问法服务需求识别，不单独过关。","ids":["XM-S04"]},{"code":"KP-SALE-07","name":"决策人 / 用车人 / 付款人识别","action":"保留改名","to":"XM-S05","why":"角色意见可独立失败，值得单独练。","ids":["XM-S05"]},{"code":"KP-SALE-08","name":"场景化讲车 SPIN 四步","action":"转方法资源","to":"XM-S04/S06","why":"不是唯一行业事实；素材按探需或讲解分配。","ids":["XM-S04"]},{"code":"KP-SALE-09","name":"卖点转译：参数 → 场景利益","action":"保留改名","to":"XM-S06","why":"事实到需求的连接仍独立，不按车型复制。","ids":["XM-S06"]},{"code":"KP-SALE-10","name":"PDC 试驾确认","action":"合并","to":"XM-S08","why":"PDC作提示卡，目标是准备完整。","ids":["XM-S08"]},{"code":"KP-SALE-11","name":"试乘试驾标准流程与路线设计","action":"拆分","to":"XM-S08/S09","why":"准备与执行分开；本地路线是资源。","ids":["XM-S08"]},{"code":"KP-SALE-12","name":"试驾回访 T+1","action":"改名","to":"XM-S10","why":"T+1可配节奏，不是所有客户唯一标准。","ids":["XM-S10"]},{"code":"KP-SALE-13","name":"价格异议处理：价值锚点 / 总拥有成本","action":"拆分","to":"XM-S11＋XM-O02","why":"沟通不当与算错成本分别补学。","ids":["XM-S11","XM-O02"]},{"code":"KP-SALE-14","name":"促单三步与下订 / 改配","action":"拆分","to":"XM-S12＋XM-O01","why":"自主决策支持与订单状态操作分开。","ids":["XM-S12","XM-O01"]},{"code":"KP-SALE-15","name":"新零售模式与门店岗位分工","action":"转流程资源","to":"XM-O06；背景关联XM-B01","why":"岗位说明为交接服务，不背组织图。","ids":["XM-O06","XM-B01"]},{"code":"KP-PLC-01","name":"政策口径讲解与核验：国补 / 地补 / 置换 / 限时","action":"保留改名＋关联扩展","to":"XM-O03；置换办理场景支持关联XM-O07","why":"原政策讲解仍主归O03；只有涉及旧车资料、评估协同和处置交接的扩展资源才关联O07，不将补贴题直接算置换办理已会。","ids":["XM-O03","XM-O07"]},{"code":"KP-PLC-02","name":"金融方案讲解：首付 / 月供 / 贴息 / 保险","action":"拆分","to":"XM-O04/O05","why":"金融总成本与保险服务边界不同。","ids":["XM-O04"]},{"code":"KP-DLV-01","name":"交付前准备与建群交接","action":"合并","to":"XM-O06","why":"建群是工具，配置承诺待办必须交接。","ids":["XM-O06"]},{"code":"KP-DLV-02","name":"到店交付 / 验车 / 签约 / 手续","action":"保留改名","to":"XM-D01","why":"交付岗位独立任务，不当销售全员完整必修。","ids":["XM-D01"]},{"code":"KP-DLV-03","name":"交付时车辆功能讲解方法","action":"改名","to":"XM-D02；引用XM-P04/P06/P08/P11","why":"以用户首次会用为目标，不机械九大功能。","ids":["XM-D02","XM-P04"]},{"code":"KP-DLV-04","name":"交付后回访与投诉应对","action":"拆分","to":"XM-C03＋XM-D03","why":"关怀经营与服务受理分开。","ids":["XM-C03","XM-D03"]},{"code":"KP-CUST-01","name":"企微客户标签与分层","action":"改名","to":"XM-C01","why":"工具中立，以能接续下一步为结果。","ids":["XM-C01"]},{"code":"KP-CUST-02","name":"朋友圈 / 内容运营与沉睡唤醒","action":"保留改名","to":"XM-C02","why":"内容服务未解决问题，不逼全员做新媒体全岗。","ids":["XM-C02"]},{"code":"KP-CUST-03","name":"转介绍与复购","action":"保留扩展","to":"XM-C03","why":"先有使用关怀，再做自愿推荐。","ids":["XM-C03"]}]};

const KP_V13_THEME=[
 ['XM-P06',['超强钢','车身结构','被动安全','气囊','应急开门']],
 ['XM-P14',['后备箱','座椅','七座','婴儿','宠物','冰箱','装载','零重力','滑轨','空间','纯平']],
 ['XM-P05',['电池','龙甲','热安全']],
 ['XM-P08',['辅助驾驶','HAD','XLA','自动驾驶','看手机','脱管']],
 ['XM-P09',['泊车','启停']],
 ['XM-P07',['主动安全','AEB','26 项','26项']],
 ['XM-P18',['增程','亏电','油耗','NVH','热管理']],
 ['XM-P02',['续航','工况','公里']],
 ['XM-P03',['家充','超充','三方桩','补能桩','充电桩']],
 ['XM-P04',['充电枪','开始充电','结束充电']],
 ['XM-P10',['天际屏','座舱','小爱','车机','语音']],
 ['XM-P11',['生态','互联','手机钥匙','人车家']],
 ['XM-P12',['OTA','升级']],
 ['XM-P13',['版本','适合谁','定位','选配']],
 ['XM-P15',['底盘','驾控','悬架']],
 ['XM-P16',['颜色','轮毂','外观','个性化']],
 ['XM-P17',['Ultra','赛道']],
 ['XM-P01',['电驱','能量']],
 ['XM-S11',['太贵','价格异议','价值锚点','贵一截']],
 ['XM-O02',['总拥有成本','报价','月供','使用成本']],
 ['XM-O03',['国补','地补','补贴','置换补贴','权益']],
 ['XM-O07',['旧车','评估','贷款未结','处置']],
 ['XM-S07',['竞品','对比','GLC','问界','极氪']],
 ['XM-S04',['需求','五问','SPIN','探需']],
 ['XM-S05',['决策人','用车人','付款人']],
 ['XM-S02',['邀约','没空']],
 ['XM-S03',['接待','进店','问候']],
 ['XM-S01',['首触','线索']],
 ['XM-S08',['PDC','试驾确认']],
 ['XM-S09',['试驾路线','试乘']],
 ['XM-S10',['回访','T+1']],
 ['XM-S12',['促单','下订意向']],
 ['XM-O01',['改配','锁单','退款','下订']],
 ['XM-O04',['金融','贴息','首付']],
 ['XM-O05',['保险','质保']],
 ['XM-O06',['交接','建群','交付前']],
 ['XM-D01',['验车','签约']],
 ['XM-D02',['交付讲解','首次用车','九大功能']],
 ['XM-D03',['投诉','回访']],
 ['XM-C01',['企微','标签']],
 ['XM-C02',['朋友圈','沉睡']],
 ['XM-C03',['转介绍','复购']],
 ['XM-M01',['带教','陪访']],
 ['XM-M02',['点检','辅导工单']],
 ['XM-M03',['例会','目标拆解']],
 ['XM-B01',['品牌','价值观','真诚']],
 ['XM-B02',['查证','资料']]
];
const KP_YEARS=['演示年款A','演示年款B'];
function kpV13Ids(m){
  if(!m)return [];
  const ids=[];
  const add=x=>{if(x&&ids.indexOf(x)<0&&KP_V13_DATA.kps.some(k=>k.id===x))ids.push(x)};
  String(m.to||'').split(/[/＋;；]/).forEach(part=>{
    const t=part.trim();
    const full=/XM-([A-Z]\d+)/.exec(t);if(full)add('XM-'+full[1]);
    const tail=/^([A-Z])(\d+)/.exec(t);if(tail)add('XM-'+tail[1]+tail[2]);
    const p=/^P(\d+)/.exec(t);if(p)add('XM-P'+p[1]);
  });
  (m.ids||[]).forEach(add);
  return ids;
}
function kpV13Roles(s){
  const t=String(s||'').split('；')[0];
  if(/专项/.test(t)&&!/零售顾问/.test(t))return ['零售顾问'];
  const out=[];
  if(/零售顾问/.test(t))out.push('零售顾问');
  if(/交付/.test(t))out.push('交付顾问');
  if(/服务/.test(t))out.push('服务顾问');
  if(/店长/.test(t))out.push('店长');
  if(/主管/.test(t))out.push('销售主管');
  return out.length?[...new Set(out)]:['零售顾问'];
}
function kpV13Cars(k){
  if(k.level==='通用')return ['通用车型'];
  return (k.models||[]).map(m=>String(m).replace('澎程N','澎程 N'));
}
function kpV13Domain(group){
  return {基础:'品牌文化','产品共性':'产品知识','产品专项':'产品知识',销售旅程:'销售技能',成交交接:'政策权益',客户经营:'客户运营',交付服务:'交付服务',带教管理:'销售技能'}[group]||'销售技能';
}
function kpV13Ability(raw){
  const g=raw.group;
  if(g==='产品共性'||g==='产品专项')return '';
  if(g==='带教管理')return '带人辅导';
  if(g==='成交交接')return '促单成交';
  if(raw.id==='XM-S04'||raw.id==='XM-S05'||raw.id==='XM-S03')return '探需';
  if(raw.id==='XM-S06'||raw.id==='XM-S07')return '场景化讲车';
  if(raw.id==='XM-S11')return '顾虑解除';
  if(raw.id==='XM-S08'||raw.id==='XM-S09')return '试驾引导';
  return '客户经营';
}
function kpV13Sell(raw){
  const m={P01:'产品线路线',P02:'续航补能',P03:'充电补能',P04:'充电补能',P05:'安全',P06:'安全',P07:'安全',P08:'辅助驾驶',P09:'辅助驾驶',P10:'智能座舱',P11:'智能座舱',P12:'智能座舱',P13:'车型定位',P14:'空间舒适',P15:'驾控',P16:'外观设计',P17:'性能赛道',P18:'动力技术'};
  const hit=/XM-P(\d+)/.exec(raw.id||'');
  return hit?m['P'+hit[1]]||'产品讲解':'';
}
function kpV13Stage(raw){
  const g=raw.group;
  if(g==='销售旅程')return /试驾/.test(raw.stage)?'试驾→报价':/邀约|线索|到店/.test(raw.name)?'邀约→到店':'到店→试驾';
  if(g==='成交交接')return '报价→锁单';
  if(g==='交付服务')return '锁单→交付';
  if(g==='产品共性'||g==='产品专项')return '到店→试驾';
  return '不直接对应';
}
function kpV13Build(raw, aliases){
  const verify=raw.verify||'';
  const drill=/演练|操作|观察/.test(verify);
  const cars=kpV13Cars(raw);
  const domain=kpV13Domain(raw.group);
  return {id:raw.id,code:raw.id,name:raw.name,one:raw.out,out:raw.out,inc:raw.inc,exc:raw.exc,group:raw.group,domain:domain,
    roleText:raw.role,stageText:raw.stage,stage:kpV13Stage(raw),level:raw.level,models:(raw.models||[]).slice(),verify,pri:raw.pri,srcNote:raw.src,note:raw.note||'',
    line:raw.group==='交付服务'?'交付':'销售',roles:kpV13Roles(raw.role),also:[],cars,scopeLevel:raw.level,
    ability:kpV13Ability(raw),sellpoint:domain==='产品知识'?kpV13Sell(raw):'',typeV12:drill?'技能':'概念',type:drill?'技能型':'事实型',batch:raw.pri==='P0'?'B1-30天':'B3-后续',
    assess:{methods:verify,anchorQ:2,practiceQ:2,anchorDrill:drill?1:0,pass:70,validityDays:180},
    behavior:'按证据类型分别记录，不把一种证据当成全部学会',ownerRole:'培训负责人',owner:raw.group==='交付服务'?'陈刚':raw.group==='带教管理'?'周丽':'李娜',
    status:'结构已核',statusV12:'结构已核',specVer:1,reviewDue:'',srcDoc:'',legacy:'',legacyV11:'',demo:'gap',demoSeed:'gap',simulated:true,
    st:'启用',tags:[],dim:'',syn:[raw.name],ext:[],created:typeof today!=='undefined'?today:'',hist:[],pre:[],rel:[],aliasIds:aliases||[],
    car:cars[0]||'通用车型'};
}
function kpV13Score(text){
  const s=String(text||'');
  return KP_V13_THEME.map(t=>({id:t[0],n:t[1].reduce((a,w)=>a+(s.indexOf(w)>=0?1:0),0)})).filter(x=>x.n).sort((a,b)=>b.n-a.n);
}
function kpV13Route(mig, text){
  const ids=kpV13Ids(mig);
  const s=String(text||'');
  const code=mig&&mig.code||'';
  const pend=(why)=>({id:'',status:'待整理',how:'待整理',why:why,candidates:ids.slice()});
  const done=(id,why)=>({id:id,status:'已迁移',how:'按正文',why:why,candidates:[]});
  if(/外放电/.test(s))return pend('写的是外放电功率和设备，不是选补能方案，也不是充电开始结束');
  if(/哨兵/.test(s))return pend('哨兵耗电不落在电池防护、被动安全或辅助驾驶边界里');
  if(/低速照明/.test(s))return pend('低速照明的开启车速，对不上现有安全类学习结果');
  if(/私人影院|户外电影|大屏/.test(s))return done('XM-P10','正文是座舱大屏显示，不是手机或车家互联');
  if(/省钱经济账|经济账/.test(s))return done('XM-O02','标题是用车成本，不是亏电工况判断');
  if(/各自适合谁/.test(s))return done('XM-P13','正文写的是哪款车适合谁');
  if(/三代同堂|电动侧踏|上车得扶/.test(s))return done('XM-S06','客户已经说出上下车限制，这一场是在讲适配，不是再做需求摘要');
  if(mig&&/转资源场景/.test(mig.action)&&/对比/.test(s+' '+(mig.name||'')))return done('XM-S07','对比场景归比较方法；金额、空间、续航只是这次引用的资料');
  if(code==='KP-DLV-03')return done('XM-D02','交付时怎么教会用户是这一题的结果，充电和开门只是可引用的操作');
  if(/主动\s*[\/、]\s*被动|主动、被动/.test(s))return pend('同一条把主动、被动和冗余放在一起，没有拆开的题目');
  if(/增程动力与纯电续航/.test(s))return pend('模板只重复旧标题，分不清是增程取舍、电驱还是续航口径');
  if(/智能座舱与生态/.test(s)&&!/大屏|语音|手机|互联/.test(s))return pend('模板同时写座舱和生态，没有具体任务');
  if(/安全卖点/.test(s)&&!/电池|气囊|车身|主动安全|AEB/.test(s))return pend('只写了安全卖点，分不清电池、车身还是主动安全');
  const scored=kpV13Score(s);
  const best=scored[0], second=scored[1];
  if(best&&(!second||best.n>second.n))return {id:best.id,status:'已迁移',how:'按主题',why:'',candidates:[]};
  if(ids.length===1)return {id:ids[0],status:'已迁移',how:'一对一',why:'',candidates:[]};
  return pend('题干没有分出迁移表里的哪一个学习结果');
}
function kpV13Apply(obj, kind, route){
  obj.kpMap=route.status;obj.kpHow=route.how||'';obj.kpWhy=route.why||'';obj.kpCandidates=route.candidates||[];
  if(route.status!=='已迁移'||!route.id){
    if(kind==='c'){obj.kps=[];obj.mainKp='';obj.kpRole={}}
    else obj.kp='';
    return;
  }
  if(kind==='c'){obj.kps=[route.id];obj.mainKp=route.id;obj.kpRole={[route.id]:'主讲解'}}
  else obj.kp=route.id;
}
function kpResText(obj, kind){
  if(kind==='q')return [obj.stem,obj.why,obj.id].join(' ');
  if(kind==='d')return [obj.name,obj.scene,obj.persona,(obj.turns||[]).map(t=>[t.say,t.ref].join(' ')).join(' ')].join(' ');
  const b=obj.body||{};
  return [obj.title,obj.intro,obj.goal,obj.desc,b.outline,b.lines,b.scene].join(' ');
}
function kpYearFits(item, year){
  if(!year)return true;
  if(!item||item.yearPending||!item.yearScope||!item.yearScope.length)return false;
  return item.yearScope.indexOf(year)>=0;
}
function kpMigrateOne(obj, kind, oldById){
  const oldId=kind==='c'?(obj.mainKp||((obj.kps||[])[0])):obj.kp;
  const old=oldById[oldId];
  if(!old||String(old.code||'').indexOf('KP-')!==0)return;
  const mig=KP_V13_DATA.mig.find(m=>m.code===old.code);
  const route=kpV13Route(mig, kpResText(obj, kind));
  obj.kpWas=oldId;obj.kpCodeWas=old.code;
  if(!obj.yearScope)obj.yearPending=true;
  kpV13Apply(obj, kind, route);
}
function kpV13RefinePending(){
  function redo(obj, kind){
    if(!obj||obj.kpMap!=='待整理'||obj.kpHow==='人工确认'||!obj.kpCodeWas)return;
    const mig=KP_V13_DATA.mig.find(m=>m.code===obj.kpCodeWas);
    kpV13Apply(obj, kind, kpV13Route(mig, kpResText(obj, kind)));
  }
  (S.contents||[]).forEach(c=>redo(c,'c'));
  (S.qs||[]).forEach(q=>redo(q,'q'));
  (S.drills||[]).forEach(d=>redo(d,'d'));
}
function kpV13MapId(oldId, oldById){
  const old=oldById[oldId];if(!old)return oldId;
  const mig=KP_V13_DATA.mig.find(m=>m.code===old.code);const ids=kpV13Ids(mig);
  return ids[0]||oldId;
}
function kpV13RemapRows(map, oldById){
  Object.keys(map||{}).forEach(mid=>{
    const row=map[mid];if(!row||typeof row!=='object'||Array.isArray(row))return;
    const next={};
    Object.keys(row).forEach(id=>{const nid=kpV13MapId(id, oldById);if(next[nid]==null)next[nid]=row[id]});
    map[mid]=next;
  });
}
function kpV13HoldMastery(oldById){
  kpV13RemapRows(S.mastery, oldById);
  if(S.ev){kpV13RemapRows(S.ev.q, oldById);kpV13RemapRows(S.ev.dr, oldById);kpV13RemapRows(S.ev.co, oldById);kpV13RemapRows(S.ev.se, oldById)}
  kpV13RemapRows(S.beh, oldById);
  S.cfg=S.cfg||{};S.cfg.kpMasteryHold=S.cfg.kpMasteryHold||{};
}
function kpV13Train(){
  const mark=(obj,models,years)=>{obj.yearScope=years;obj.yearPending=false;obj.carScope=models.slice();obj.demoFact=true;obj.scopeNote='演示年款，不是真实在售参数';};
  const putC=(id,title,kid,models,years,outline)=>{
    if((S.contents||[]).some(c=>c.id===id))return;
    const base={id,title,kind:'课程',type:'图文',lecturer:'李娜',st:'已定稿',pubSt:'已上架',pubVer:1,kps:[kid],mainKp:kid,kpRole:{[kid]:'主讲解'},
      intro:'演示训练资料，不是厂家参数。',body:{mins:8,outline},simulated:true,origin:'演示年款',placeholder:false,created:typeof today!=='undefined'?today:''};
    const c=typeof C0==='function'?C0(base):base;
    c.kps=[kid];c.mainKp='';c.kpRole={[kid]:'补充材料'};c.vers=c.vers||[];c.ver=c.ver||1;c.up=c.up||0;c.down=c.down||0;c.views=c.views||0;c.chan=c.chan||['汽车销售'];c.vis=c.vis||'全国';c.publishType=c.publishType||'立即发布';c.cat=c.cat||'销售技巧';
    mark(c,models,years);S.contents.unshift(c);
  };
  const putQ=(id,kid,stem,models,years)=>{
    if((S.qs||[]).some(q=>q.id===id))return;
    const q={id,kp:kid,type:'单选',stem,opts:['按该年款演示口径','把另一年款的口径拿来用','保证实跑固定里程','没有资料也给确定数字'],ans:[0],
      why:'演示题：只适用于所标年款。这不是真实参数。',lv:1,src:'',st:'已定稿',role:'锚题',owner:'李娜',created:typeof today!=='undefined'?today:'',stat:{n:0,ok:0},simulated:true};
    mark(q,models,years);S.qs.push(q);
  };
  putC('C_YEAR_A','【演示】SU7 演示年款A 续航口径','XM-P02',['SU7'],['演示年款A'],'1. 训练用年款A，不是真实在售参数\n2. 演示工况记为甲\n3. 不能拿去覆盖年款B');
  putC('C_YEAR_B','【演示】SU7 演示年款B 续航口径','XM-P02',['SU7'],['演示年款B'],'1. 训练用年款B，不是真实在售参数\n2. 演示工况记为乙\n3. 旧年款有课不等于新年款有课');
  putQ('Q_YEAR_A','XM-P02','【演示年款A】SU7 训练续航口径应引用哪一条？',['SU7'],['演示年款A']);
  putQ('Q_YEAR_B','XM-P02','【演示年款B】SU7 训练续航口径应引用哪一条？',['SU7'],['演示年款B']);
  if(!(S.drills||[]).some(d=>d.id==='D_R01'))S.drills.push({id:'D_R01',kp:'XM-S04',alsoKps:['XM-S06','XM-P13','XM-O02','XM-S12'],name:'TRAIN-R01 家庭咨询到下一步（可不下订）',scene:'到店',persona:'林女士，想看家庭用车，不承诺下订',turns:[{say:'就想看看适合家里用的，今天不一定订。',emo:['理解'],must:[['确认需求而不是逼单',['几个人','通勤','补能','不订','下次']]],idea:[['允许结束',['可以','下次','再看']]],ref:'我们先确认谁坐、怎么充电、什么时候用。今天不下订也可以，把下一步约清楚。'}],st:'已定稿',role:'锚定演练',owner:'李娜',created:typeof today!=='undefined'?today:'',stat:{n:0,sum:0,pass:0},simulated:true,demoFact:true,train:'R01',carScope:[],yearScope:KP_YEARS.slice(),yearPending:false});
  if(!(S.drills||[]).some(d=>d.id==='D_E01'))S.drills.push({id:'D_E01',kp:'XM-O01',alsoKps:['XM-B02','XM-O06'],name:'TRAIN-E01 改配或退款只查证不编时限',scene:'电话',persona:'客户认为没交车就一定能退',turns:[{say:'车还没到，我要退，你们不是七天随便退吗？',emo:['理解'],must:[['先查当时协议',['协议','条款','查']]],idea:[['不编退款天数',['不承诺','待核','原文']]],ref:'我先按您的订单状态和当时协议查。没有原文之前，我不能答应几天一定退成。'}],st:'已定稿',role:'锚定演练',owner:'李娜',created:typeof today!=='undefined'?today:'',stat:{n:0,sum:0,pass:0},carScope:[],yearScope:KP_YEARS.slice(),yearPending:false,simulated:true,demoFact:true,train:'E01'});
  if(!(S.drills||[]).some(d=>d.id==='D_T01'))S.drills.push({id:'D_T01',kp:'XM-O07',alsoKps:['XM-O03','XM-O02'],name:'TRAIN-T01 置换只转评估，不自己估价',scene:'展厅',persona:'旧车贷款未结清，希望抵新车',turns:[{say:'旧车还贷着，你直接估个价抵掉吧。',emo:['理解'],must:[['转专业评估',['评估','专业']],['分开旧车价和新车价',['旧车','新车','补贴','分开']]],idea:[['不保证处置',['不保证','待核']]],ref:'旧车价、新车价和补贴要分开。我帮您约评估，不在这里直接定价，也不保证贷款一定解掉。'}],st:'已定稿',role:'锚定演练',owner:'李娜',created:typeof today!=='undefined'?today:'',stat:{n:0,sum:0,pass:0},carScope:[],yearScope:KP_YEARS.slice(),yearPending:false,simulated:true,demoFact:true,train:'T01'});
  if(!(S.contents||[]).some(c=>c.id==='C_R01')){
    const base={id:'C_R01',title:'TRAIN-R01 接待任务说明',kind:'课程',type:'图文',lecturer:'李娜',st:'已定稿',pubSt:'已上架',pubVer:1,kps:['XM-S04','XM-S06','XM-P13'],mainKp:'XM-S04',kpRole:{'XM-S04':'主讲解','XM-S06':'补充材料','XM-P13':'补充材料'},body:{outline:'1. 这是跨多个知识点的接待任务，不是新的万能知识点\n2. 不下订也可以结束\n3. 实操观察和做题分开记'},simulated:true,placeholder:false,created:typeof today!=='undefined'?today:''};
    const c=typeof C0==='function'?C0(base):base;
    c.kps=['XM-S04','XM-S06','XM-P13'];c.mainKp='';c.kpRole={'XM-S04':'补充材料','XM-S06':'补充材料','XM-P13':'补充材料'};c.vers=c.vers||[];c.ver=c.ver||1;c.up=c.up||0;c.down=c.down||0;c.views=c.views||0;c.chan=c.chan||['汽车销售'];c.vis=c.vis||'全国';c.publishType=c.publishType||'立即发布';c.cat=c.cat||'销售技巧';
    c.yearScope=KP_YEARS.slice();c.yearPending=false;c.carScope=[];c.demoFact=true;S.contents.unshift(c);
  }
  if(!(S.packs||[]).some(p=>p.id==='PK_R01')){
    S.packs.unshift({id:'PK_R01',tpl:'train',mid:(S.lrn&&S.lrn[0]&&S.lrn[0].mid)||'',mids:[],kp:'XM-S04',name:'本次接待 · 演示年款A',arranged:true,planCopied:true,fromCourse:'C_R01',train:'R01',year:'演示年款A',car:'SU7',status:'进行中',due:typeof addDays==='function'?addDays(today,7):'',ts:typeof today!=='undefined'?today:'',audience:1,
      steps:[{id:'learn',t:'学',req:true,contentId:'C_R01',done:false},{id:'in',t:'课中',req:true,mode:'fixed',qIds:['Q_YEAR_A'],n:1,done:false},{id:'drill',t:'演练',req:true,drillIds:['D_R01'],done:false},{id:'side',t:'课中',req:false,mode:'fixed',qIds:['Q_YEAR_A'],n:1,done:false}],
      bank:{qs:['Q_YEAR_A'],drills:['D_R01'],contentId:'C_R01'},pick:{contentId:'C_R01',qIds:['Q_YEAR_A'],drillIds:['D_R01']},observe:[]});
  }
}
function kpMigrateV13(force){
  if(!force&&S.cfg&&S.cfg.kpInit==='v13'&&(S.kps||[]).some(k=>k.code==='XM-B01')){kpV13RefinePending();kpV13Train();return}
  const old=(S.kps||[]).slice();const oldById={};old.forEach(k=>{oldById[k.id]=k});
  const alias={};
  KP_V13_DATA.mig.forEach(m=>{const prev=old.find(k=>k.code===m.code);const ids=kpV13Ids(m);if(prev&&ids[0]){(alias[ids[0]]||(alias[ids[0]]=[])).push(prev.id)}});
  const fresh=KP_V13_DATA.kps.map(raw=>kpV13Build(raw, alias[raw.id]||[]));
  fresh.forEach(k=>{const migs=KP_V13_DATA.mig.filter(m=>kpV13Ids(m).indexOf(k.id)>=0);k.legacy=migs.map(m=>m.code).join('、');const extraSyn={'XM-S02':['邀约试驾'],'XM-S07':['GLC','竞品对比'],'XM-O03':['以旧换新','国补'],'XM-S11':['价格','价值锚点'],'XM-P03':['充电','补能']};
k.syn=[k.name].concat(migs.map(m=>m.name)).concat(extraSyn[k.id]||[]);if(typeof v23TaxDims==='function'){try{k.dims=v23TaxDims(k)}catch(e){k.dims=k.dims||{}}}else k.dims=k.dims||{}});
  const byG={};
  fresh.forEach(k=>{
    if(String(k.code||'').indexOf('XM-')!==0)return;
    const prev=byG[k.group];
    if(prev){k.pre=[prev.id];prev.rel=(prev.rel||[]).concat([k.id])}
    byG[k.group]=k;
  });
  old.forEach(k=>{if(k.code&&(KP_V13_DATA.mig.some(m=>m.code===k.code)||String(k.code).indexOf('XM-')===0))return;k.group=k.group||'自建';k.domain=k.domain||k.group;k.aliasIds=k.aliasIds||[];fresh.push(k)});
  kpV13HoldMastery(oldById);
  (S.contents||[]).forEach(c=>kpMigrateOne(c,'c',oldById));
  (S.qs||[]).forEach(q=>kpMigrateOne(q,'q',oldById));
  (S.drills||[]).forEach(d=>kpMigrateOne(d,'d',oldById));
  (S.packs||[]).forEach(p=>{const o=oldById[p.kp];if(!o)return;const mig=KP_V13_DATA.mig.find(m=>m.code===o.code);const ids=kpV13Ids(mig);if(ids[0])p.kp=ids[0]});
  (S.topics||[]).forEach(t=>{const o=oldById[t.kpId];if(!o)return;const mig=KP_V13_DATA.mig.find(m=>m.code===o.code);const ids=kpV13Ids(mig);if(ids[0])t.kpId=ids[0]});
  S.kps=fresh;
  S.tax=fresh.filter(k=>String(k.code||'').indexOf('XM-')===0).map(k=>Object.assign({},k,{kpId:k.id,legacy:String(k.legacy||'').split('、').filter(Boolean)}));
  S.cfg=S.cfg||{};S.cfg.kpInit='v13';S.cfg.kpYears=KP_YEARS.slice();
  /* 知识域字典仍给就绪度用；列表分组看 k.group，不另维护一套领域。 */
  const ordered=(S.contents||[]).slice().sort((a,b)=>((typeof kpIsPlaceholder==='function'&&kpIsPlaceholder(a))?1:0)-((typeof kpIsPlaceholder==='function'&&kpIsPlaceholder(b))?1:0));
  const seen={};
  ordered.forEach(c=>{
    if(c.kpMap==='待整理')return;
    const id=c.mainKp;if(!id)return;
    c.kpRole=c.kpRole||{};
    if(seen[id]){c.kpRole[id]='补充材料';if(c.mainKp===id)c.mainKp=(c.kps||[]).find(x=>x!==id)||''}
    else{c.kpRole[id]='主讲解';seen[id]=c.id}
  });
  kpV13Train();
}
const __v23TaxSeedV13=v23TaxSeed;
v23TaxSeed=function(){const r=__v23TaxSeedV13();kpMigrateV13(true);return r};
const __loadNowV13=loadNow;
loadNow=function(){const ok=__loadNowV13();if(ok)kpMigrateV13(false);return ok};
const __kpValidateV13=kpV12ValidateKp;
kpV12ValidateKp=function(k){return __kpValidateV13(k)};
const __hasLectureV13=kpV12HasLecture;
kpV12HasLecture=function(k, includePlaceholder){
  const year=(typeof UI!=='undefined'&&UI&&UI.sel&&UI.sel.kpOv&&UI.sel.kpOv.year)||'';
  return (S.contents||[]).some(c=>{
    if(c.kpMap==='待整理')return false;
    if(!(c.kps||[]).includes(k.id))return false;
    if(!year&&((c.kpRole&&c.kpRole[k.id])||'主讲解')!=='主讲解')return false;
    if(typeof isPub==='function'&&!isPub(c))return false;
    if(typeof expState==='function'&&expState(c)==='已过期')return false;
    if(!includePlaceholder&&typeof kpIsPlaceholder==='function'&&kpIsPlaceholder(c))return false;
    return kpYearFits(c, year);
  });
};
const __kpMatchV13=kpV12ListMatch;
kpV12ListMatch=function(k,f){if(f&&f.grp&&(k.group||'其他')!==f.grp)return false;return __kpMatchV13(k,f)};
const __qPickV13=qPick;
qPick=function(mid,kid,n,mode,car){let list=(__qPickV13(mid,kid,n,mode,car)||[]).filter(q=>q.kpMap!=='待整理');const year=(typeof R!=='undefined'&&R&&R.diagYear)||'';return year?list.filter(q=>kpYearFits(q,year)):list};
const __anchorQnV13=kpV12AnchorQn;
kpV12AnchorQn=function(k){return (S.qs||[]).filter(q=>q.kp===k.id&&q.st==='已定稿'&&q.role==='锚题'&&q.kpMap!=='待整理').length};
const __anchorDrV13=kpV12AnchorDrillN;
kpV12AnchorDrillN=function(k){return (S.drills||[]).filter(d=>d.kp===k.id&&d.st==='已定稿'&&d.role==='锚定演练'&&d.kpMap!=='待整理').length};
const __kpLibraryV13=kpLibrary;
kpLibrary=function(){
  const f=kpLibFilter();
  const base=__kpLibraryV13();
  if(f.flat)return base;
  const rows=(S.kps||[]).filter(k=>kpV12ListMatch(k,f));
  const order=[...new Set((S.kps||[]).map(k=>k.group||'其他'))];
  UI.sel.kpFold=UI.sel.kpFold||{};
  const pending=(S.qs||[]).filter(x=>x.kpMap==='待整理').length+(S.drills||[]).filter(x=>x.kpMap==='待整理').length+(S.contents||[]).filter(x=>x.kpMap==='待整理').length;
  const groups=order.map(g=>({g,list:rows.filter(k=>(k.group||'其他')===g)})).filter(x=>x.list.length);
  const bar='<div class="card kp-filter-card"><div class="filg kp-filter-primary">'
    +'<div class="fi2"><label>搜索</label><input data-wc="kpq" value="'+esc(f.q||'')+'" placeholder="编号 / 名称 / 学习结果 / 旧编号"></div>'
    +'<div class="fi2"><label>领域</label><select data-wc="kpset" data-k="grp"><option value="">全部领域</option>'+order.map(g=>'<option value="'+esc(g)+'" '+(f.grp===g?'selected':'')+'>'+esc(g)+'</option>').join('')+'</select></div>'
    +'<div class="fi2"><label>优先级</label><select data-wc="kpset" data-k="pri"><option value="">全部</option>'+['P0','P1'].map(x=>'<option value="'+x+'" '+(f.pri===x?'selected':'')+'>'+x+'</option>').join('')+'</select></div>'
    +'<div class="fi2"><label>覆盖年款</label><select data-wc="kpOv" data-k="year"><option value="">不按年款收紧</option>'+KP_YEARS.map(y=>'<option value="'+y+'" '+((UI.sel.kpOv||{}).year===y?'selected':'')+'>'+y+'</option>').join('')+'</select></div>'
    +'</div><div class="kp-filter-actions"><button class="btn sm" data-act="kpFlat">全部列表</button><button class="btn sm" data-act="kpFclr">清除筛选</button><span class="hint">筛选后 '+rows.length+' / '+(S.kps||[]).length+' 条 · 分组就是知识域，空组不占屏</span></div>'
    +(pending?'<button type="button" class="tag warn" data-act="kpPendOpen" style="display:block;margin-top:8px;white-space:normal;text-align:left;width:100%;cursor:pointer">待整理 '+pending+' 条，点开逐条看原因并改归属。未确认的不计入核心讲解和核心考核。</button>':'')
    +'</div>';
  const body=groups.map(gr=>{
    const open=UI.sel.kpFold[gr.g]!==false;
    const items=gr.list.map(k=>'<div class="kp-grow"><div class="t"><a class="link" data-act="kpOpen" data-id="'+k.id+'"><b>'+esc(k.name)+'</b></a><div class="hint">'+esc(k.code)+' · '+esc(k.pri)+' · '+esc(k.one||'')+'</div></div><a class="link" data-act="kpOpen" data-id="'+k.id+'">查看</a></div>').join('');
    return '<div class="kp-group"><button type="button" data-act="kpFold" data-g="'+esc(gr.g)+'">'+(open?'▾':'▸')+' '+esc(gr.g)+' · '+gr.list.length+'</button>'+(open?items:'')+'</div>';
  }).join('');
  return bar+kpPendingHtml()+'<div class="kp-groups">'+body+'</div><div class="kp-wide-list">'+base+'</div>';
};
function kpPendingRows(){
  const rows=[];
  (S.contents||[]).forEach(x=>{if(x.kpMap==='待整理')rows.push({kind:'c',obj:x,title:x.title||x.id})});
  (S.qs||[]).forEach(x=>{if(x.kpMap==='待整理')rows.push({kind:'q',obj:x,title:x.stem||x.id})});
  (S.drills||[]).forEach(x=>{if(x.kpMap==='待整理')rows.push({kind:'d',obj:x,title:x.name||x.id})});
  return rows;
}
function kpPendingHtml(){
  if(!UI.sel||!UI.sel.kpPend)return '';
  const rows=kpPendingRows();
  const oldName=code=>{const m=KP_V13_DATA.mig.find(x=>x.code===code);return m?m.name:''};
  const openAct=r=>r.kind==='q'?'qOpen':r.kind==='d'?'drOpen':'cView';
  const kindName=r=>r.kind==='q'?'题':r.kind==='d'?'演练':'内容';
  const opts=(S.kps||[]).filter(k=>String(k.code||'').indexOf('XM-')===0).map(k=>'<option value="'+k.id+'">'+esc(k.code+' '+k.name)+'</option>').join('');
  const body=rows.map(r=>{
    const o=r.obj;const cands=o.kpCandidates||[];
    const picks=cands.map(id=>{const k=kp(id);return '<button type="button" class="btn sm" data-act="kpPendTo" data-kind="'+r.kind+'" data-id="'+esc(o.id)+'" data-to="'+id+'">归到 '+(k?esc(k.code):id)+'</button>'}).join(' ');
    return '<div class="kp-pend" style="padding:10px 0;border-top:1px solid #f0f1f4"><b>'+kindName(r)+'</b> <a class="link" data-act="'+openAct(r)+'" data-id="'+esc(o.id)+'">'+esc(r.title)+'</a>'
      +'<div class="hint">旧点 '+esc(o.kpCodeWas||'')+' '+esc(oldName(o.kpCodeWas))+'</div>'
      +'<div class="hint">'+esc(o.kpWhy||'题干没有分出学习结果')+'</div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">'+picks
      +'<select data-wc="kpPendSet" data-kind="'+r.kind+'" data-id="'+esc(o.id)+'"><option value="">改挂到其他知识点</option>'+opts+'</select></div></div>';
  }).join('');
  return '<div class="card"><h3>待整理 '+rows.length+' 条 <button type="button" class="btn sm" data-act="kpPendOpen">收起</button></h3><div class="hint">这些还没有确认归属，不算核心讲解，也不进学员默认核心考核。能看清主题的再点归属。</div>'+body+'</div>';
}
function kpPendObj(kind,id){
  const list=kind==='q'?S.qs:kind==='d'?S.drills:S.contents;
  return (list||[]).find(x=>x.id===id);
}
function kpPendAssign(kind,id,to){
  const obj=kpPendObj(kind,id);const k=kp(to);
  if(!obj||!k)return toast('没有这个知识点','err');
  obj.kpMap='已迁移';obj.kpHow='人工确认';obj.kpWhy='';obj.kpCandidates=[];
  if(kind==='c'){
    const taken=(S.contents||[]).some(c=>c.id!==obj.id&&(c.kps||[]).includes(k.id)&&((c.kpRole||{})[k.id]==='主讲解')&&c.kpMap!=='待整理');
    obj.kps=[k.id];obj.kpRole={[k.id]:taken?'补充材料':'主讲解'};obj.mainKp=taken?'':k.id;
  }else obj.kp=k.id;
  toast('已归到「'+k.name+'」','ok');render();
}
A.kpPendOpen=()=>{UI.sel.kpPend=!UI.sel.kpPend;render()};
A.kpPendTo=el=>kpPendAssign(el.dataset.kind,el.dataset.id,el.dataset.to);
A.kpPendSet=el=>{if(el.value)kpPendAssign(el.dataset.kind,el.dataset.id,el.value)};
A.kpFold=el=>{const g=el.dataset.g;UI.sel.kpFold=UI.sel.kpFold||{};UI.sel.kpFold[g]=UI.sel.kpFold[g]===false;render()};
A.kpFlat=()=>{kpLibFilter().flat=1;render()};
A.kpOv=el=>{UI.sel.kpOv=UI.sel.kpOv||{};UI.sel.kpOv[el.dataset.k]=el.value;render()};
const __pgKpV13=pgKp;
pgKp=function(){
  const html=__pgKpV13();const k=kp(UI.kid);if(!k||!k.out)return html;
  const card='<div class="card"><h3>这个点要学会什么</h3><dl class="kv"><dt>学习结果</dt><dd>'+esc(k.out)+'</dd><dt>包括</dt><dd>'+esc(k.inc||'')+'</dd><dt>不包括</dt><dd>'+esc(k.exc||'')+'</dd><dt>岗位 / 阶段</dt><dd>'+esc((k.roleText||(k.roles||[]).join('、'))+' / '+(k.stage||''))+'</dd><dt>适用范围</dt><dd>'+esc((k.level||'')+' · '+((k.models&&k.models.length?k.models:k.cars)||[]).join('、'))+'</dd><dt>年款</dt><dd>演示年款 A/B 可同时在售。资源自己标年款；没标年款的，不算新年款已经有课。</dd><dt>怎么证明</dt><dd>'+esc(k.verify||'')+'</dd>'+(k.srcNote?'<dt>依据</dt><dd>'+esc(k.srcNote)+'</dd>':'')+(k.note?'<dt>说明</dt><dd>'+esc(k.note)+'</dd>':'')+(k.legacy?'<dt>旧编号</dt><dd>'+esc(k.legacy)+'</dd>':'')+'</dl></div>';
  return html.indexOf('<div class="dgrid">')>=0?html.replace('<div class="dgrid">',card+'<div class="dgrid">'):html+card;
};
if(typeof rxPackHtml==='function'){
  const __rxV13=rxPackHtml;
  rxPackHtml=function(){
    const html=__rxV13();const p=(S.packs||[]).find(x=>x.id===R.packId);if(!p||!p.train)return html;
    const rows=(p.observe||[]).map(o=>'<div class="hint">'+esc(o.dim)+' · '+esc(o.grade)+' · '+esc(o.note||'')+'</div>').join('');
    const box='<div class="rx-note">实操观察和做题分开记。主管记录不能由对话冒充。不下订也可以完成这次接待。<div style="margin-top:6px"><select id="ob_dim"><option>探需有效</option><option>事实准确与范围</option><option>安全有效演示</option><option>下一步与记录</option></select> <select id="ob_grade"><option>独立完成</option><option>提示后完成</option><option>未完成</option><option>未观察</option></select></div><input id="ob_note" placeholder="看到的具体动作" style="width:100%;margin:6px 0"><button class="rb" data-act="trainObs" data-id="'+p.id+'">记下这次实操</button>'+rows+'</div>';
    return html.indexOf('<div style="height:30px"></div>')>=0?html.replace('<div style="height:30px"></div>',box+'<div style="height:30px"></div>'):html+box;
  };
}
A.trainObs=el=>{const p=(S.packs||[]).find(x=>x.id===el.dataset.id);if(!p)return;p.observe=p.observe||[];p.observe.push({dim:($('#ob_dim')||{}).value||'',grade:($('#ob_grade')||{}).value||'未观察',note:($('#ob_note')||{}).value||'',kp:p.kp,at:typeof today!=='undefined'?today:'',sim:true});toast('已记下实操观察，没有改题目成绩','ok');if(typeof renderRN==='function')renderRN()};
A.navToggle=()=>{document.body.classList.toggle('nav-open')};
document.addEventListener('click',function(e){
  const t=e.target;
  if(!t||!t.closest)return;
  if(t.closest('.menu-toggle'))return;
  if(!document.body.classList.contains('nav-open'))return;
  document.body.classList.remove('nav-open');
});
function kpCanon(id){const k=typeof kp==='function'?kp(id):null;return k?k.id:id}
const __kpOpenV13=A.kpOpen;
A.kpOpen=function(el){const id=kpCanon((el&&el.dataset&&el.dataset.id)||UI.kid);if(el&&el.dataset){el.dataset.id=id;return __kpOpenV13(el)}return __kpOpenV13({dataset:{id}})};
['kpQRole','kpDRole','kpQUnlink','kpDUnlink','kpLecRole'].forEach(name=>{
  const prev=A[name];if(typeof prev!=='function')return;
  A[name]=function(el){const cur=kp(UI.kid);if(cur)UI.kid=cur.id;return prev(el)};
});
const __cfgTaxV13=cfgTaxLib;
cfgTaxLib=function(){const html=__cfgTaxV13();return html.replace('68 条','当前目录').replace('v1.2 标准库：68 条','当前标准库')};
