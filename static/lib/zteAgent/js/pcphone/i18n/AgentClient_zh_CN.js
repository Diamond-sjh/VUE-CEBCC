/* 资源文件：座席状态名称 */
AgentClient.i18nMap = null;
AgentClient.i18nMap =
{
    // 状态名称
    // Customize
    "state.null.masterChanged" : "平台切换",
    "state.busy.reportWorkNum":"等待应答",
    "state.null.noLogin" : "未登录",
    
	// AgentNull
	"stateCode.1" :  "注销",
	"stateCode.2" :  "下班",
	"stateCode.3" :  "自动退出",
	

	// AgentNotReady
	"stateCode.100" :  "登录",
	"stateCode.101" :  "上班",
	"stateCode.102" :  "离席",
	"stateCode.103" :  "锁定",
	"stateCode.104" :  "强锁",
	"stateCode.105" :  "示忙",
	"stateCode.106" :  "强制示忙",
	"stateCode.107" :  "预呼",
	"stateCode.108" :  "媒体处理",
	"stateCode.109" :  "质检",
	"stateCode.110" :  "WEBCALL",
	"stateCode.111" :  "学习",
	
	// AgentReady
	"stateCode.200" :  "示闲",
	"stateCode.201" :  "强制示闲",
	"stateCode.202" :  "主动示闲",
	"stateCode.203" :  "自动示闲",
	"stateCode.204" :  "强拆",
	
	// AgentBusy
	"stateCode.300" :  "接入用户通话",
	"stateCode.301" :  "内部通话",
	"stateCode.302" :  "外呼通话",
	"stateCode.303" :  "内呼通话",
	"stateCode.304" :  "保持",
	"stateCode.305" :  "会议",
	"stateCode.306" :  "外部咨询",
	"stateCode.307" :  "内部咨询",
	"stateCode.308" :  "远端咨询",
	"stateCode.309" :  "插话",
	"stateCode.310" :  "监听",
	"stateCode.311" :  "WEBCALL通话",
	"stateCode.312" :  "呼入振铃",
	"stateCode.313" :  "呼出振铃",
	"stateCode.314" :  "排队选中",
	"stateCode.315" :  "CTI选中",
	"stateCode.316" :  "外呼排队占用",
	"stateCode.317" :  "教练",
	
	// AgentWorkAfter
	"stateCode.400" :  "整理态",
	"stateCode.401" :  "整理态",
	"stateCode.402" :  "调整态",
	"stateCode.null" : null,
	/********************** StateCode End ****************************/

	/********************** Ainf ErrCode Begin *********************/
    // 错误信息相关
    "ainf.errCode.00" : "未知错误",
    "ainf.errCode.01" : "初始化控件失败,服务程序未启动或未安装！",
    "ainf.errCode.02" : "加载零配置信息失败",
    "ainf.errCode.03" : "缺少参数",
    "ainf.errCode.04" : "加载零配置失败，座席已经签入！",
    "ainf.errCode.05" : "平台切换，重登录失败！",

    "ainf.errCode.-8210" : "虚中心id输入非法字符或者id不在[1-255]之间",    
    "ainf.errCode.-8211" : "操作员id输入非法字符或者id不在[0-65535]之间",
    "ainf.errCode.-8212" : "操作员未输入密码(未传递pwd字段) ",  
    "ainf.errCode.-8213" : "未输入座席mac地址",    
    "ainf.errCode.-8220" : "虚中心不存在",    
    "ainf.errCode.-8221" : "操作员不存在",    
    "ainf.errCode.-8222" : "操作员密码错误",   
    "ainf.errCode.-8223" : "虚中心未被分配给平台",    
    "ainf.errCode.-8230" : "座席号码耗尽",    
    "ainf.errCode.-8240" : "URL错误", 
    "ainf.errCode.-1000" : "呼叫已结束", 
    "ainf.errCode.-1003" : ":被叫忙",  
    "ainf.errCode.-1008" : "无应答",   
    "ainf.errCode.-1013" : "用户不可达", 
    "ainf.errCode.-1015" : "用户不存在", 

    "ainf.errCode.-50" : "媒体类型不支持", 
    "ainf.errCode.-51" : "ACS流失效",  
    "ainf.errCode.-52" : "当前CallID 无效",    
    "ainf.errCode.-101" : "与CTI的网络连接失败",    
    "ainf.errCode.-102" : "认证类型错误", 
    "ainf.errCode.-103" : "取TSAPI接口返回失败",   
    "ainf.errCode.-104" : "打开流失败",  
    "ainf.errCode.-105" : "重新启动WINNTCP.EXE失败",  
    "ainf.errCode.-106" : "创建TSAP线程失败", 
    "ainf.errCode.-107" : "TSAPI接口调用失败",    
    "ainf.errCode.-108" : "设置TSAPI通知窗口句柄失败",    
    "ainf.errCode.-109" : "TSAPI接口初始化失败",   
    "ainf.errCode.-110" : "TSAPI接口反初始化失败",  
    "ainf.errCode.-111" : "登录失败",   
    "ainf.errCode.-112" : "注销失败",   
    "ainf.errCode.-113" : "连接cti失败",    
    "ainf.errCode.-114" : "UAC认证失败",    
    "ainf.errCode.-204" : "应答失败",   
    "ainf.errCode.-205" : "挂机失败",   
    "ainf.errCode.-206" : "根据呼叫标识挂机失败", 
    "ainf.errCode.-207" : "示忙失败",   
    "ainf.errCode.-208" : "示闲失败",   
    "ainf.errCode.-209" : "发送DTMF信号失败", 
    "ainf.errCode.-210" : "呼出失败",   
    "ainf.errCode.-211" : "咨询失败",   
    "ainf.errCode.-212" : "单步转移失败", 
    "ainf.errCode.-213" : "转移失败",   
    "ainf.errCode.-214" : "保持呼叫失败", 
    "ainf.errCode.-215" : "取保持失败",  
    "ainf.errCode.-216" : "三方会议失败", 
    "ainf.errCode.-217" : "切换失败",   
    "ainf.errCode.-218" : "监听失败",   
    "ainf.errCode.-219" : "偏移失败",   
    "ainf.errCode.-220" : "错误的呼叫标识",    
    "ainf.errCode.-221" : "重设技能失败", 
    "ainf.errCode.-222" : "座席销假失败", 
    "ainf.errCode.-223" : "座席请假失败", 
    "ainf.errCode.-224" : "座席锁定失败", 
    "ainf.errCode.-225" : "发送私有消息失败",   
    "ainf.errCode.-226" : "转接语音失败", 
    "ainf.errCode.-227" : "发送消息到节点失败",  
    "ainf.errCode.-228" : "收号失败",   
    "ainf.errCode.-229" : "发送BCSM信号失败", 
    "ainf.errCode.-230" : "座席解锁失败", 
    "ainf.errCode.-231" : "放模版音失败", 
    "ainf.errCode.-232" : "放TTS音失败",    
    "ainf.errCode.-233" : "查询呼叫总数失败",   
    "ainf.errCode.-234" : "挂机到自动业务失败",  
    "ainf.errCode.-235" : "请求二次排队失败",   
    "ainf.errCode.-236" : "停止二次排队失败",   
    "ainf.errCode.-237" : "发送传真失败", 
    "ainf.errCode.-239" : "二次排队不成功，转接录音失败", 
    "ainf.errCode.-241" : "设置前转/忙转失败",  
    "ainf.errCode.-243" : "同步CTI时间失败",  
    "ainf.errCode.-245" : "重连失败",   
    "ainf.errCode.-246" : "挂机到自动业务失败",  
            
    "ainf.errCode.-249" : "设置休息失败", 
    "ainf.errCode.-250" : "状态错误，座席未初始化或未签入",    
    "ainf.errCode.-251" : "状态错误，座席未初始化",    
    "ainf.errCode.-252" : "状态错误，座席在签入状态，不允许反未初始化",  
    "ainf.errCode.-253" : "保持的cllid无效", 
    "ainf.errCode.-254" : "无效的呼叫标识",    
    "ainf.errCode.-255" : "呼叫数错误",  
    "ainf.errCode.-256" : "座席组号必须是数字字符串",   
    "ainf.errCode.-257" : "查询全组请假信息时，查询类型错误",   
    "ainf.errCode.-258" : "批示请假时，批示类型必须为1(批准)或2(拒绝)",   
    "ainf.errCode.-259" : "发送座席间消息时，消息长度必须为[1,1024]",   
    "ainf.errCode.-260" : "发送座席间消息时，目标类型必须为1(指定座席)或2(全组)",  
    "ainf.errCode.-261" : "未登录或者不是IM座席",    
            
    "ainf.errCode.-300" : "状态错误",   
    "ainf.errCode.-301" : "参数错误",   
    "ainf.errCode.-302" : "无效的媒体类型",    
    "ainf.errCode.-303" : "无效的话务员工号",   
    "ainf.errCode.-304" : "无效的技能号", 
    "ainf.errCode.-305" : "随路数据溢出", 
    "ainf.errCode.-306" : "修改密码失败", 
    "ainf.errCode.-307" : "无效的业务键", 
    "ainf.errCode.-308" : "无效的电话号", 
    "ainf.errCode.-309" : "无效的节点",  
    "ainf.errCode.-310" : "两方通话才能保持",   
    "ainf.errCode.-311" : "无效的语音资源",    
    "ainf.errCode.-312" : "队列查询失败", 
    "ainf.errCode.-313" : "转接录音失败", 
    "ainf.errCode.-314" : "内部呼叫失败", 
    "ainf.errCode.-315" : "外部呼叫失败", 
    "ainf.errCode.-316" : "Work After失败",   
    "ainf.errCode.-317" : "Work After Call失败 ",
    "ainf.errCode.-318" : "强制示忙失败", 
    "ainf.errCode.-319" : "强制示闲失败", 
    "ainf.errCode.-320" : "强制签出失败", 
    "ainf.errCode.-321" : "保持失败",   
    "ainf.errCode.-322" : "插话失败",   
    "ainf.errCode.-323" : "拦截失败",   
    "ainf.errCode.-324" : "监听失败",   
    "ainf.errCode.-325" : "取保持失败",  
    "ainf.errCode.-326" : "取消插话失败", 
    "ainf.errCode.-327" : "偏转失败",   
            
    "ainf.errCode.-328" : "录音失败",   
    "ainf.errCode.-329" : "停止录音失败", 
    "ainf.errCode.-330" : "没有找到指定座席的信息",    
    "ainf.errCode.-331" : "请假时长太长或为0",  
    "ainf.errCode.-332" : "请假原因太长或为NULL",   
    "ainf.errCode.-333" : "消息队列中无消息",   
    "ainf.errCode.-334" : "被教练方返回失败",   
    "ainf.errCode.-335" : "正在进行资源操作",   
            
    "ainf.errCode.-351" : "老密码不对",  
    "ainf.errCode.-352" : "密码长度不合要求",   
    "ainf.errCode.-353" : "密码组成不合要求",   
    "ainf.errCode.-354" : "新密码在最近5次使用过",    
    "ainf.errCode.-356" : "数据库操作失败",    
    "ainf.errCode.-357" : "操作员不存在", 
    "ainf.errCode.-358" : "新密码不允许为空",   
            
    "ainf.errCode.-600" : "软电话登录失败",    
    "ainf.errCode.-601" : "软电话注销失败",    
    "ainf.errCode.-602" : "软电话释放失败",    
    "ainf.errCode.-603" : "软电话初始化失败",   
    "ainf.errCode.-604" : "SIPPHONE API 调用失败  ",
            
    "ainf.errCode.-10222" : "密码错误", 
    "ainf.errCode.-10223" : "初始密码必须修改", 
    "ainf.errCode.-10224" : "密码过期", 
    "ainf.errCode.-10225" : "工号被锁定",    
    "ainf.errCode.-10026" : "密码为空，必须修改",    
    "ainf.errCode.-10227" : "数据库访问失败",  
    "ainf.errCode.-10228" : "座席工号不存在",  
    "ainf.errCode.-10229" : "座席电话不存在",  
    "ainf.errCode.-10230" : "该工号在其他机器已经登录", 
    "ainf.errCode.-10231" : "该座席电话正在被其他人使用",    
    "ainf.errCode.-10232" : "座席电话错误",   
    "ainf.errCode.-10233" : "新密码在最近5次使用过",  
    "ainf.errCode.-10234" : "新密码长度不合要求（最少为6位）", 
    "ainf.errCode.-10235" : "新密码组成不合要求（必须为大小写和数字组合）",   
    "ainf.errCode.-10236" : "厂商代码验证错误", 
    "ainf.errCode.-10237" : "厂商密码验证错误", 
    "ainf.errCode.-10238" : "数据库端厂商代码配置不一致",    
    "ainf.errCode.-10239" : "该工号的座席组号为0，为无效",   
    
    //Cs座席新合入
    "ainf.errCode.-10220" : "数据库返回数据错误",
	"ainf.errCode.-10082" : "无效的目标号码标识",
	"ainf.errCode.-10534" : "对方状态不对，可能正在通话或者未示闲",
	"ainf.errCode.-11053" : "CSTA协议标准错误",
	"ainf.errCode.-11285" : "没有权限外呼",
	"ainf.errCode.-1100" : "原因未知",
	"ainf.errCode.-1104" : "取值错误",
	"ainf.errCode.-1127" : "媒体错误",
	"ainf.errCode.-1102" : "状态不正确",
	"ainf.errCode.-1111" : "类型错误",
	"ainf.errCode.-1101" : "一般错误",
	"ainf.errCode.-10226" : "匹配成功并且密码为NULL或空串，需要提示修改密码",
	"ainf.errCode.-10240" : "ACD应答超时",
	"ainf.errCode.-10540" : "虚中心未激活",
	"ainf.errCode.-10542" : "座席不在线",
	"ainf.errCode.15" : "目标不可达, 可能被叫电话不存在",
	"ainf.errCode.3" : "对方正忙, 请稍候再拨",
	"ainf.errCode.13" : "对方无应答",
	"ainf.errCode.56" : "呼叫超时",
	"ainf.errCode.5" : "呼叫取消",
	"ainf.errCode.8" : "对方无应答",
	"ainf.errCode.-8001" : "登录IM服务器失败",
	"ainf.errCode.-8002" : "登录IM服务器超时",
	"ainf.errCode.-8003" : "设置CTI IM状态失败",
	"ainf.errCode.-8004" : "登录IM服务器错误",
	"ainf.errCode.-8005" : "登录IM服务器错误",
	"ainf.errCode.-8006" : "登录IM服务器错误",
	"ainf.errCode.-8007" : "登录IM服务器错误",
	"ainf.errCode.-8008" : "登录IM服务器错误",
	"ainf.errCode.-8009" : "登录IM服务器错误",
	"ainf.errCode.-8406" : "登录IM服务器错误",
	"ainf.errCode.-8407" : "登录IM服务器错误",
	"ainf.errCode.-8013" : "登录IM服务器错误",
	"ainf.errCode.-8014" : "登录IM服务器错误",
	"ainf.errCode.-10241" : "CTI内部错误",
	"ainf.errCode.-10543" : "座席设置前转，不支持内呼",
	"ainf.errCode.-10544" : "座席设置忙转，不支持内呼",
	"ainf.errCode.-10176" : "路径超时",
	"ainf.errCode.-11054" : "示忙人数超过限制",
	"ainf.errCode.-11055" : "License在线人数超过限制",
	"ainf.errCode.-11056" : "A接口版本与CTI版本不匹配",
	"ainf.errCode.-11057" : "TSAPI版本与CTI版本不匹配",
	"ainf.errCode.-12000" : "路由模块内部错误",
	"ainf.errCode.-12001" : "座席不存在",
	"ainf.errCode.-12002" : "达到最大分配数",
	"ainf.errCode.-12003" : "资源不足",
	"ainf.errCode.-12004" : "数据库访问失败",
	"ainf.errCode.-12005" : "目标座席不在线",
	"ainf.errCode.-12006" : "委托与处理操作数据库失败",
	"ainf.errCode.-11660" : "外呼错误",
	"ainf.errCode.-11661" : "座席在线",
	"ainf.errCode.-11662" : "座席不在线",
	"ainf.errCode.-11663" : "两个座席不在同一个虚中心上",
	"ainf.errCode.-11664" : "组或者操作员限制外呼",
	"ainf.errCode.-11665" : "不匹配的号码类型",
	"ainf.errCode.-11666" : "电话号码在黑名单里面",
	"ainf.errCode.-11667" : "电话号码的号码段错误",
	"ainf.errCode.-11668" : "电话号码的区域码限制",
	"ainf.errCode.-11669" : "受黑名单限制外呼",
	"ainf.errCode.-11670" : "受白名单限制外呼",
	"ainf.errCode.-11671" : "外呼过程中的异常导致的错误",
	"ainf.errCode.-2069" : "登录到UAC失败，用户帐号不存在",
	"ainf.errCode.-2070" : "登录到UAC失败，用户帐号被停用",
	"ainf.errCode.-2072" : "登录到UAC失败，用户密码错误",
	"ainf.errCode.-2071" : "登录到UAC失败，UAC的LDAP异常",
	"ainf.errCode.-2073" : "登录到UAC失败，用户帐号被冻结",
	"ainf.errCode.-2049" : "登录到UAC失败",
	"ainf.errCode.-2050" : "UAC请求失败，用户ID无效",
	"ainf.errCode.-2051" : "UAC请求失败，用户密码无效",
	"ainf.errCode.-2052" : "UAC请求失败，系统ID非法",
	"ainf.errCode.-2053" : "UAC请求失败，帐号已存在",
	"ainf.errCode.-2054" : "UAC请求失败，原密码校验失败",
	"ainf.errCode.-2055" : "UAC请求失败，解密失败",
	"ainf.errCode.-2056" : "UAC请求失败，状态字段异常",
	"ainf.errCode.-2057" : "UAC请求失败，类型字段异常",
	"ainf.errCode.-2058" : "UAC请求失败，新密码为空",
	"ainf.errCode.-2059" : "UAC请求失败，状态字段为空",
	"ainf.errCode.-2074" : "UAC请求失败，未知错误",
	"ainf.errCode.-2075" : "UAC请求失败",
	
	"ainf.errCode.18440" : "AgentService版本与CTI版本不匹配",
	/********************** Ainf ErrCode End *********************/

    // 业务相关
    "service.qcnotify.forcedbusy" : "你已被班长强制示忙！",
    "service.qcnotify.forcedidle" : "你已被班长强制示闲！",
    "service.qcnotify.forcedout" : "你已经被班长强制迁出！",
    "service.qcnotify.forcerelease" : "您已经被班长强拆...",
    "service.qcnotify.intercepted" : "你的通话已经被班长拦截！",
    "service.ainfAbnormalExit" : "服务程序异常退出！"
};
