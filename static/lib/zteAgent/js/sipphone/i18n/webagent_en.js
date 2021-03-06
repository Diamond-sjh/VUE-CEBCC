WebAgent.i18nMap = null;
WebAgent.i18nMap =
{
    // Customize
	"state.null.masterChanged" : "Master-Slave Exchange",
	"state.busy.reportWorkNum" : "Connecting",
	"state.null.noLogin" : "Not logged In",
	// AgentNull
	

	"stateCode.1" : "Logout",
	"stateCode.2" : "Off Work",
	"stateCode.3" : "System Logout",
	"stateCode.100" : "Login",
	"stateCode.101" : "On Duty",
	"stateCode.102" : "Leave",
	"stateCode.103" : "Locked",
	"stateCode.104" : "Force Locked",
	"stateCode.105" : "Busy",
	"stateCode.106" : "Force Busy",
	"stateCode.107" : "Pre_Call",
	"stateCode.108" : "Media Process",
	"stateCode.109" : "Quality Check",
	"stateCode.110" : "Web Call",
	"stateCode.111" : "Learning",
	// AgentReady
	"stateCode.200" : "Idle",
	"stateCode.201" : "Idle",
	"stateCode.202" : "Idle",
	"stateCode.203" : "Idle",
	"stateCode.204" : "Idle",
	// AgentBusy
	"stateCode.300" : "Talk",
	"stateCode.301" : "Inside Talk",
	"stateCode.302" : "Call User",
	"stateCode.303" : "Call Agent",
	"stateCode.304" : "Hold",
	"stateCode.305" : "Conference",
	"stateCode.306" : "Consult User",
	"stateCode.307" : "Consult Agent",
	"stateCode.308" : "Remote Consult",
	"stateCode.309" : "Chime In",
	"stateCode.310" : "Listen",
	"stateCode.311" : "WebCall Talking",
	"stateCode.312" : "Delivered",
	"stateCode.313" : "Alerting",
	"stateCode.314" : "Queued",
	"stateCode.315" : "CTI Occupied",
	"stateCode.316" : "Queued",
	"stateCode.317" : "Coach",
	"stateCode.400" : "Collate",
	"stateCode.401" : "Collate",
	"stateCode.402" : "Collate",
	"stateCode.null" : "null",
	/********************** StateCode End **************************/
	
	/********************** Ainf ErrCode Begin *********************/
	"ainf.errCode.00" : "Unknown error.",
	"ainf.errCode.01" : "Initialization failed,AgentService does not exist!",
	"ainf.errCode.02" : "Load configuration failed",
	"ainf.errCode.03" : "Parameter error{0}",
	"ainf.errCode.04" : "Load configuration failed, the operator is logged in",
	"ainf.errCode.05" : "Master-Slave Exchange,Try to Re-login Failed.",
	
	"ainf.errCode.-8210" : "Error(-8210)", //?????????id????????????????????????id??????[1-255]??????
	"ainf.errCode.-8211" : "Error(-8211)", //?????????id????????????????????????id??????[0-65535]??????
	"ainf.errCode.-8212" : "Error(-8212)", //????????????????????????(?????????pwd??????) 
	"ainf.errCode.-8213" : "Error(-8213)", //???????????????mac??????
	"ainf.errCode.-8220" : "Virtual Center does not exist",
	"ainf.errCode.-8221" : "Agent does not exist",
	"ainf.errCode.-8222" : "Password error",
	"ainf.errCode.-8223" : "Error(-8223)", //??????????????????????????????
	"ainf.errCode.-8230" : "Phone Number depleted.", 
	"ainf.errCode.-8240" : "URL Error", 
	
	"ainf.errCode.-1000" : " Unkonwn reason",
	"ainf.errCode.-1003" : "Called user busy",
	"ainf.errCode.-1008" : "No answer",
	"ainf.errCode.-1013" : "Can't reach target user, maybe the telephone number not exist",
	"ainf.errCode.-1015" : "User not exist",
	
	"ainf.errCode.-50" : "Media Type Not Supported",
	"ainf.errCode.-51" : "ACS Flow Invalid",
	"ainf.errCode.-52" : "Current Call ID Invalid",
	"ainf.errCode.-101" : "Fail to get the switch's authentication information",
	"ainf.errCode.-102" : "Validation type error",
	"ainf.errCode.-103" : "Operation failed, please try again",
	"ainf.errCode.-104" : "Fail to open flow",
	"ainf.errCode.-105" : "Fail to restart WINNTCP.EXE",
	"ainf.errCode.-106" : "Fail to create TSAP thread",
	"ainf.errCode.-107" : "Fail to call TSAPI interface",
	"ainf.errCode.-108" : "Fail to set TSAPI notice window handle",
	"ainf.errCode.-109" : "Fail to initialize TSAPI interface",
	"ainf.errCode.-110" : "Fail to reverse initializing TSAPI interface",
	
	"ainf.errCode.-111" : "Login failed", 
	"ainf.errCode.-112" : "Logout failed",
	"ainf.errCode.-113" : "Failed to connect CTI", 
	"ainf.errCode.-114" : "UAC authentication failure", 
	"ainf.errCode.-204" : "Error(-204)", //????????????
	"ainf.errCode.-205" : "Error(-205)", //????????????
	"ainf.errCode.-206" : "Error(-206)", //??????????????????????????????
	"ainf.errCode.-207" : "Error(-207)", //????????????
	"ainf.errCode.-208" : "Error(-208)", //????????????
	"ainf.errCode.-209" : "Send DTMF signal failure", 
	"ainf.errCode.-210" : "Error(-210)", //????????????
	"ainf.errCode.-211" : "Error(-211)", //????????????
	"ainf.errCode.-212" : "Error(-212)", //??????????????????
	"ainf.errCode.-213" : "Error(-213)", //????????????
	"ainf.errCode.-214" : "Error(-214)", //??????????????????
	"ainf.errCode.-215" : "Error(-215)", //???????????????
	"ainf.errCode.-216" : "Error(-216)", //??????????????????
	"ainf.errCode.-217" : "Error(-217)", //????????????
	"ainf.errCode.-218" : "Error(-218)", //????????????
	"ainf.errCode.-219" : "Error(-219)", //????????????
	"ainf.errCode.-220" : "Error(-220)", //?????????????????????
	"ainf.errCode.-221" : "Error(-221)", //??????????????????
	"ainf.errCode.-222" : "Error(-222)", //??????????????????
	"ainf.errCode.-223" : "Error(-223)", //??????????????????
	"ainf.errCode.-224" : "Error(-224)", //??????????????????
	"ainf.errCode.-225" : "Error(-225)", //????????????????????????
	"ainf.errCode.-226" : "Error(-226)", //??????????????????
	"ainf.errCode.-227" : "Error(-227)", //???????????????????????????
	"ainf.errCode.-228" : "Error(-228)", //????????????
	"ainf.errCode.-229" : "Send BCSM signal failure", 
	"ainf.errCode.-230" : "Error(-230)", //??????????????????
	"ainf.errCode.-231" : "Error(-231)", //??????????????????
	"ainf.errCode.-232" : "Error(-232)", //???TTS?????????
	"ainf.errCode.-233" : "Error(-233)", //????????????????????????
	"ainf.errCode.-234" : "Error(-234)", //???????????????????????????
	"ainf.errCode.-235" : "Error(-235)", //????????????????????????
	"ainf.errCode.-236" : "Error(-236)", //????????????????????????
	"ainf.errCode.-237" : "Error(-237)", //??????????????????
	"ainf.errCode.-239" : "Error(-239)", //??????????????????????????????????????????
	"ainf.errCode.-241" : "Error(-241)", //????????????/????????????
	"ainf.errCode.-243" : "CTI time synchronization failure", 
	"ainf.errCode.-245" : "Error(-245)", //????????????
	"ainf.errCode.-246" : "Error(-246)", //???????????????????????????
	"ainf.errCode.-249" : "Error(-249)", //??????????????????
	
	"ainf.errCode.-250" : "Status error, Agent not initialized or signed in",
	"ainf.errCode.-251" : "Status error, Agent not initialized",
	"ainf.errCode.-252" : "Status error, Agent is in signed in status and can't be initialized",
	"ainf.errCode.-253" : "Invalid holding cllid",
	"ainf.errCode.-254" : "Invalid call identifier",
	"ainf.errCode.-255" : "Total call number error",
	"ainf.errCode.-256" : "Agent group id must be numerical string",
	"ainf.errCode.-257" : "Query type error when query group apply leave information",
	"ainf.errCode.-258" : "Authorization type for apply leave must be 1(approve) or 2(refuse)",
	"ainf.errCode.-259" : "Length of message sent between agents must be in [1,1024]",
	"ainf.errCode.-260" : "Aim type must be 1(appointed agent) or 2(entire group) when sending message between agents",
	"ainf.errCode.-261" : "Not logged in. Error(-261)", //?????????????????????IM??????
	"ainf.errCode.-300" : "Status error",
	"ainf.errCode.-301" : "Parameter error",
	"ainf.errCode.-302" : "Invalid media type", 
	"ainf.errCode.-303" : "Invalid Agent number", 
	"ainf.errCode.-304" : "Invalid number of skills",
	"ainf.errCode.-305" : "Error(-305)", //??????????????????
	"ainf.errCode.-306" : "Error(-306)", //??????????????????
	"ainf.errCode.-307" : "Error(-307)", //??????????????????
	"ainf.errCode.-308" : "Invalid telephone number",
	"ainf.errCode.-309" : "Error(-309)", //???????????????
	"ainf.errCode.-310" : "Error(-310)", //????????????????????????
	"ainf.errCode.-311" : "Error(-311)", //?????????????????????
	"ainf.errCode.-312" : "Error(-312)", //??????????????????
	"ainf.errCode.-313" : "Error(-313)", //??????????????????
	"ainf.errCode.-314" : "Error(-314)", //??????????????????
	"ainf.errCode.-315" : "Error(-315)", //??????????????????
	"ainf.errCode.-316" : "Error(-316)", //Work After??????
	"ainf.errCode.-317" : "Error(-317)", //Work After Call?????? 
	"ainf.errCode.-318" : "Error(-318)", //??????????????????
	"ainf.errCode.-319" : "Error(-319)", //??????????????????
	"ainf.errCode.-320" : "Error(-320)", //??????????????????
	"ainf.errCode.-321" : "Error(-321)", //????????????
	"ainf.errCode.-322" : "Error(-322)", //????????????
	"ainf.errCode.-323" : "Error(-323)", //????????????
	"ainf.errCode.-324" : "Error(-324)", //????????????
	"ainf.errCode.-325" : "Error(-325)", //???????????????
	"ainf.errCode.-326" : "Error(-326)", //??????????????????
	"ainf.errCode.-327" : "Error(-327)", //????????????
	"ainf.errCode.-328" : "Error(-328)", //????????????
	"ainf.errCode.-329" : "Error(-329)", //??????????????????
	"ainf.errCode.-330" : "Error(-330)", //?????????????????????????????????
	"ainf.errCode.-331" : "Error(-331)", //????????????????????????0
	"ainf.errCode.-332" : "Error(-332)", //????????????????????????NULL
	"ainf.errCode.-333" : "Error(-333)", //????????????????????????
	"ainf.errCode.-334" : "The student agent return failure message.",
	"ainf.errCode.-335" : "Error(-335)", //????????????????????????
	
	"ainf.errCode.-351" : "Old password incorrect",
	"ainf.errCode.-352" : "Password should be 6 to 16 characters",
	"ainf.errCode.-353" : "The new password or confirm password is invalid. ",
	"ainf.errCode.-354" : "The password has been used too many times, please redesign a new password",
	"ainf.errCode.-356" : "Database operation fail",
	"ainf.errCode.-357" : "Opeator not exist",
	"ainf.errCode.-358" : "New password is null",
	"ainf.errCode.-600" : "Soft telephone logon fail",
	"ainf.errCode.-601" : "Soft telephone logout fail",
	"ainf.errCode.-602" : "Soft telephone release fail",
	"ainf.errCode.-603" : "Soft telephone initialize fail",
	"ainf.errCode.-604" : "Fail to invoke the SIPPHONE API",
	"ainf.errCode.-10222" : "Agent ID or password error",
	"ainf.errCode.-10223" : "Current original password  must be modified to logon",
	"ainf.errCode.-10224" : "Password overtime",
	"ainf.errCode.-10225" : "Max error times and the ID is locked",
	"ainf.errCode.-10026" : "Password is empty, try changing it.", //???????????????????????????
	"ainf.errCode.-10227" : "Database operate fail",
	"ainf.errCode.-10228" : "Agent's VCID cannot be zero",
	"ainf.errCode.-10229" : "Desk num not found by the telephone number",
	"ainf.errCode.-10230" : "Opertor already logon on other agent",
	"ainf.errCode.-10231" : "Other operator already logon the agent desk",
	"ainf.errCode.-10232" : "The telephone number didn't  corresponding to the VCID of the login agent.",
	"ainf.errCode.-10233" : "The new password has been used recently",
	"ainf.errCode.-10234" : "Length of the password does not meet the requirements",
	"ainf.errCode.-10235" : "The new composition of the password does not meet the requirements",
	"ainf.errCode.-10236" : "The Factory Code is invalid.",
	"ainf.errCode.-10237" : "The Factory Password is invalid.",
	"ainf.errCode.-10238" : "Factory code configuration data inconsistent.",
	"ainf.errCode.-10239" : "Agent's group id can not be zero",

	// CSAgent Error
	"ainf.errCode.-10220" : "Data return from database error",
	"ainf.errCode.-10082" : "Invaid destination id",
	"ainf.errCode.-10534" : "Called side status incorrect,maybe in calling or not show idle",
	"ainf.errCode.-11053" : "CSTA protocol standard error",
	"ainf.errCode.-11285" : "No calling out privilege",
	"ainf.errCode.-1100" : "Unknown reason",
	"ainf.errCode.-1104" : "Value error",
	"ainf.errCode.-1127" : "Media error",
	"ainf.errCode.-1102" : "Status incorrect",
	"ainf.errCode.-1111" : "Type error",
	"ainf.errCode.-1101" : "Common error",
	"ainf.errCode.-10226" : "Need prompt modify password which is NULL or empty string and is matched",
	"ainf.errCode.-10240" : "ACD answer timeout",
	"ainf.errCode.-10540" : "Virtual center not activated",
	"ainf.errCode.-10542" : "Agent not online",
	"ainf.errCode.15" : "Destination not reachable, maybe called telephone number not exist",
	"ainf.errCode.3" : "Called number is busy now, please redial later",
	"ainf.errCode.13" : "No answer from called side",
	"ainf.errCode.56" : "Calling timeout",
	"ainf.errCode.5" : "Calling canceled",
	"ainf.errCode.8" : "No answer from called side",
	"ainf.errCode.-8001" : "Fail to logon the IM Server.",
	"ainf.errCode.-8002" : "Logon the IM Server overtime.",
	"ainf.errCode.-8003" : "Fail to set the state of the IM on CTI Server.",
	"ainf.errCode.-8004" : "Logon IM Server error",
	"ainf.errCode.-8005" : "Logon IM Server error",
	"ainf.errCode.-8006" : "Logon IM Server error",
	"ainf.errCode.-8007" : "Logon IM Server error",
	"ainf.errCode.-8008" : "Logon IM Server error",
	"ainf.errCode.-8009" : "Logon IM Server error",
	"ainf.errCode.-8406" : "Logon IM Server error",
	"ainf.errCode.-8407" : "Logon IM Server error",
	"ainf.errCode.-8013" : "IM login server error",
	"ainf.errCode.-8014" : "IM login server error",
	"ainf.errCode.-10241" : "Invalid VCID",
	"ainf.errCode.-10543" : "The agent in call forwarding state, not support call inside.",
	"ainf.errCode.-10544" : "The agent in busy transfer state, not support call inside.",
	"ainf.errCode.-10176" : "Routing overtime",
	"ainf.errCode.-11054" : "The number of busy over the prescribed limit.",
	"ainf.errCode.-11055" : "Online user exceed license.",
	"ainf.errCode.-11056" : "AInf version dismatch with CTI version",
	"ainf.errCode.-11057" : "TSAPI version dismatch with CTI version",
	"ainf.errCode.-12000" : "Routing module internal error",
	"ainf.errCode.-12001" : "The Agent is not exists.",
	"ainf.errCode.-12002" : "To reach the largest number of distribution",
	"ainf.errCode.-12003" : "Lack of resources",
	"ainf.errCode.-12004" : "Failed to access the database.",
	"ainf.errCode.-12005" : "The des agent is not on line.",
	"ainf.errCode.-12006" : "Entrusted with handling the failure of database.",
	"ainf.errCode.-11660" : "Call outside failed",
	"ainf.errCode.-11661" : "Agent is online ",
	"ainf.errCode.-11662" : " Agent is not online",
	"ainf.errCode.-11663" : "Two agents belong to different virtual Call-Center",
	"ainf.errCode.-11664" : "Out-call denied according to group or operator configuration",
	"ainf.errCode.-11665" : "Incompatible telephone",
	"ainf.errCode.-11666" : "The called number is banned by blacklist ",
	"ainf.errCode.-11667" : "Invalid telephone number segment",
	"ainf.errCode.-11668" : "Invalide telephone Area-Code ",
	"ainf.errCode.-11669" : "Outside call be restricted by the black-list.",
	"ainf.errCode.-11670" : "Outside call be restricted by the white-list.",
	"ainf.errCode.-11671" : "Outside call exception.",
	"ainf.errCode.-2069" : "Fail to logon on UAC, user account is not exist",
	"ainf.errCode.-2070" : "Fail to logon on UAC, user account is stopped",
	"ainf.errCode.-2072" : "Fail to logon on UAC, password error",
	"ainf.errCode.-2071" : "Fail to logon on UAC, LDAP exception",
	"ainf.errCode.-2073" : "Fail to logon on UAC, user account not in use",
	"ainf.errCode.-2049" : "Fail to logon on UAC",
	"ainf.errCode.-2050" : "UAC request error, user ID invalid",
	"ainf.errCode.-2051" : "UAC request error, user password invalid",
	"ainf.errCode.-2052" : "UAC request error, system ID invalid",
	"ainf.errCode.-2053" : "UAC request error, account already exists",
	"ainf.errCode.-2054" : "UAC request error, verify old password failed",
	"ainf.errCode.-2055" : "UAC request error, decode failed",
	"ainf.errCode.-2056" : "UAC request error, status invalid",
	"ainf.errCode.-2057" : "UAC request error, type invalid",
	"ainf.errCode.-2058" : "UAC request error, new password is empty",
	"ainf.errCode.-2059" : "UAC request error, status is empty",
	"ainf.errCode.-2074" : "UAC request error, unknown error",
	"ainf.errCode.-2075" : "UAC request error",
	
	"ainf.errCode.18440" : "AgentService version dismatch with CTI version",
	/********************** Ainf ErrCode End *********************/
	
	// service Error
	"service.qcnotify.forcedbusy" : "You have been forced busy!",
	"service.qcnotify.forcedidle" : "You have been forced idle!",
	"service.qcnotify.forcedout" : "You have been forced sign-out!",
	"service.qcnotify.forcerelease" : "You have been interrupted!",
	"service.qcnotify.intercepted" : "Your talking has been intercepted by monitor!",
	"service.ainfAbnormalExit" : "Disconnected with the AinfOcx server!"
};
