
/**
 * @type AgentClientImpl
 */
var AgentClient = null;

(function()
{
    var _AgentClientWin_ = window, tempWin = null, agentClientInst = null, isTop = false;
    
    function getParentWindow(currentWin)
    {
        try
        {
            if (!currentWin.closed)
            {
                if (currentWin.parent != null && currentWin.parent != currentWin && !currentWin.parent.closed)
                {
                    return currentWin.parent;
                }
                else if (currentWin.opener != null && currentWin.opener != currentWin && !currentWin.opener.closed)
                {
                    return currentWin.opener;
                }
                else
                {
                    return null;
                }
            }
        }
        catch(e)
        {
            // 防止窗口已关闭且资源已释放报错
        }
        
        return null;
    }
    
    // 查找同域上级已存在的AgentClient对象
    while(!AgentClient)
    {
        tempWin = getParentWindow(_AgentClientWin_);
        
        if (tempWin == null)
        {
            break;
        }
        else
        {
            _AgentClientWin_ = tempWin;
        }
        
        try
        {
            if (_AgentClientWin_.AgentClient)
            {
                AgentClient = _AgentClientWin_.AgentClient;
            }
        }
        catch (e)
        {
            // 防止探测到跨域窗口
        }
    }
    
    isTop = (window === _AgentClientWin_);
    
    // 清理被引用的窗口
    _AgentClientWin_ = window;
    tempWin = null;
    
    // 已找到则直接返回
    if (AgentClient)
    {
        _AgentClientWin_ = null;
        return;
    }
    
    /**
     * 包装回调函数
     * 
     * @param {Function} callback 回调函数
     * @param {Object} thisObj this指针
     * @param {Boolean} recRet 回调函数是否接受返回值,如接受则回调时的第一个参数会被当成返回值传入.
     * @param {Object} param 要传递给回调函数的参数,其后的参数也依次传递
     * @returns {Function} 包装后的回调函数对象
     */
    function wrapCallback(callback, thisObj, recRet, param)
    {
        var inputs = new Array();
        
        if (arguments.length > 3)
        {
            for (var i = 3; i < arguments.length; ++i)
            {
                inputs.push(arguments[i]);
            }
        }
        
        return function(ret){
            if (callback)
            {
                var args = new Array();
                if (recRet)
                {
                    args.push(ret);
                }
                    
                if (inputs.length > 0)
                {
                    args = args.concat(inputs);
                }
                    
                return callback.apply(thisObj, args);
            }
        };
    }
    
    /**
     * 包装回调函数
     * 
     * @param {Function} callback 回调函数
     * @param {Object} thisObj this指针
     * @param {Boolean} recRet 回调函数是否接受返回值,如接受则回调时的第一个参数会被当成返回值传入.
     * @param {Array} paramArray 要传递给回调函数的参数列表
     * @returns {Function} 包装后的回调函数对象
     */
    function wrapCallback2(callback, thisObj, recRet, paramArray)
    {        
        return function(ret){
            if (callback)
            {
                if (recRet || paramArray)
                {
                    var args = new Array();
                    if (recRet)
                    {
                        args.push(ret);
                    }
                    
                    if (paramArray && paramArray.length > 0)
                    {
                        args = args.concat(paramArray);
                    }
                    
                    return callback.apply(thisObj, args);
                }
                else
                {
                    return callback.call(thisObj);
                }
            }
        };
    }
    
    /**
     * 调用回调函数,参数传递与Function.call的方式相同
     * 
     * @param {Function} callback 回调函数
     * @param {Object} ctx 上下文
     * @param {Object} args 参数
     */
    function callCallback(callback, ctx, args)
    {
        if (callback)
        {
            if (arguments.length > 2)
            {
                var inputs = new Array();
                for (var i = 2; i < arguments.length; ++i)
                {
                    inputs.push(arguments[i]);
                }
                callback.apply(ctx, inputs);
            }
            else
            {
                callback.call(ctx);
            }
        }
    }
    
    /**
     * 调用回调函数,参数传递与Function.apply的方式相同
     * 
     * @param {Function} callback 回调函数
     * @param {Object} ctx 上下文
     * @param {Array} argArray 参数
     */
    function applyCallback(callback, ctx, argArray)
    {
        if (callback)
        {
            if (argArray)
            {
                callback.apply(ctx, argArray);
            }
            else
            {
                callback.call(ctx);
            }
        }
    }
    
    /**
     * 将对象的属性名转换为小写
     * 
     * @param {Object} obj 转换的对象
     */
    function attributesToLowerCase(obj)
    {
        var ret = {};
        
        if (!obj)
        {
            return ret;
        }
        
        for (var attr in obj)
        {
            ret[attr.toLowerCase()] = obj[attr];
        }
        
        return ret;
    }
    
    /**
     * AgentClient错误码起始索引
     */
    var AGENTCLIENT_ERROR_STARTIDX = 54996;
    
    /**
     * 客户端使用的错误码
     */
    var ErrorCode = {
        SUCCEEDED : 0, // 成功
        GETINITINFO_STARTIDX : 8200, // 零配置服务器返回的错误码起始索引
        NULL_URL : AGENTCLIENT_ERROR_STARTIDX + 0, // URL为空
        REQUEST_TIMEOUT : AGENTCLIENT_ERROR_STARTIDX + 1, // 请求超时
        REQUEST_FAILED : AGENTCLIENT_ERROR_STARTIDX + 2, // 请求服务失败HTTP返回码不为200
        DECODE_RESP_FAILED : AGENTCLIENT_ERROR_STARTIDX + 3, // 解析服务器响应报文失败
        ALREADY_GETINITINFO : AGENTCLIENT_ERROR_STARTIDX + 4, // 已获取零配置
        DOING_GETINITINFO : AGENTCLIENT_ERROR_STARTIDX + 5, // 正在获取零配置
        PARAM_REQUIRED : AGENTCLIENT_ERROR_STARTIDX + 6, // 需要输入参数
        PHONENO_USED : AGENTCLIENT_ERROR_STARTIDX + 7, // 分机号已被占用
        AGENT_ID_LOGINED : AGENTCLIENT_ERROR_STARTIDX + 8, // 工号已登录
        NOT_INITED : AGENTCLIENT_ERROR_STARTIDX + 9, // 未初始化
        ILLEGAL_OP : AGENTCLIENT_ERROR_STARTIDX + 10, // 非法操作
        ILLEGAL_ARGUMENTS : AGENTCLIENT_ERROR_STARTIDX + 11, // 非法参数
        NO_AGENTSVR_URL : AGENTCLIENT_ERROR_STARTIDX + 12, // 无AgentServer URL
        INIT_SIPPHONE_FAILED : AGENTCLIENT_ERROR_STARTIDX + 18, // 初始化SIPPhone失败
        GETMAC_FAILED : AGENTCLIENT_ERROR_STARTIDX + 22, // 获取MAC失败
        REQ_ABORT : AGENTCLIENT_ERROR_STARTIDX + 23 // 请求取消
    };
    
    /**
     * 话机类型
     */
    var PhoneType = {
        SIP_PHONE : 0, // SIPPhone
        PC_MODEM : 1, // PC+Modem
        PC_PHONE : 2, // PC+Phone
        VOIP : 3 // VOIP
    };
    
    var SIP_PHONE_URL = ["http://localhost:80", "http://localhost:11111", "http://localhost:22222", "http://localhost:33333", "http://localhost:44444"];
    
    /**
     * 状态范围
     * 
     * @constructor
     * @param {Number} state 状态码
     */
    function IndependentState(state)
    {
        this.state = state;
    };
    
    /**
     * 是否为指定的状态
     * 
     * @param {Number} state 状态码
     * @returns {Boolean} 相同时返回true
     */
    IndependentState.prototype.isInclude = function(state)
    {
        return this.state == state;
    };
    
    function ContinuousStateRange(lower, higher)
    {
        this.lower = Math.min(lower, higher);
        this.higer = Math.max(lower, higher);
    }
    
    ContinuousStateRange.prototype.isInclude = function(state)
    {
        return this.lower <= state && state <= this.higer;
    };
    
    function CompositeStateRange(states)
    {
        this.states = states;
    }
    
    CompositeStateRange.prototype.isInclude = function(state)
    {
        for (var i = 0; i < this.states.length; ++i)
        {
            if (this.states[i].isInclude(state))
            {
                return true;
            }
        }
        
        return false;
    };
    
    /**
     * 状态列表
     */
    var States = {
        LOGOUT : new ContinuousStateRange(1, 4), // 注销
        LOGON : new ContinuousStateRange(100, 101), // 登录
        REST : new IndependentState(102), // 离席
        LOCK : new ContinuousStateRange(103, 104), // 锁定
        BUSY : new ContinuousStateRange(105, 106), // 示忙
        PRE_CALL : new IndependentState(107), // 预呼
        MEDIA_WORK : new IndependentState(108), // 媒体处理
        CHECK_WORK : new IndependentState(109), // 质检
        WEB_CALL : new CompositeStateRange([new IndependentState(110), new IndependentState(311)]), // Web Call
        STUDY : new IndependentState(111), // 学习
        IDLE : new ContinuousStateRange(200, 204), // 示闲
        OUTER_CALLIN_TALK : new IndependentState(300), // 外部呼入通话
        INNER_CALLIN_TALK : new IndependentState(301), // 内部呼入通话
        OUTER_CALLOUT_TALK : new IndependentState(302), // 外部呼出通话
        INNER_CALLOUT_TALK : new IndependentState(303), // 内部呼出通话
        SINGLE_TALK : new CompositeStateRange([this.OUTER_CALLIN_TALK, this.INNER_CALLIN_TALK, this.OUTER_CALLOUT_TALK, this.INNER_CALLOUT_TALK]), // 和单一方通话的状态
        HOLD : new IndependentState(304), // 保持
        CONFERENCE : new IndependentState(305), // 会议
        OUTER_CONSULT : new IndependentState(306), // 外部咨询
        INNER_CONSULT : new IndependentState(307), // 内部咨询
        MANUAL_CONSULT : new CompositeStateRange([this.CONSULT, this.INNER_CONSULT]), // 人工咨询
        REMOTE_CONSULT : new IndependentState(308), // 远端咨询
        INSERT : new IndependentState(309), // 插话
        LISTEN : new IndependentState(310), // 监听
        CALLIN_RING : new IndependentState(312), // 呼入振铃
        CALLOUT_RING : new IndependentState(313),  // 呼出振铃
        CALLIN_QUEUE : new IndependentState(314), // 排队选中
        CTI_QUEUE : new IndependentState(315), // CTI选中
        CALLOUT_QUEUE : new IndependentState(316), // 外呼排队
        COACH : new IndependentState(317), // 教练
        ADJUST_AFTERTALK : new IndependentState(400), // 话后整理
        ADJUST_MANUALLY : new IndependentState(401), // 主动整理
        ADJUST : new CompositeStateRange([this.ADJUST_AFTERTALK, this.ADJUST_MANUALLY]) // 整理态
    };
    
    /**
     * 事件名称列表
     */
    var Events = {
         ON_CTIAGENTSTATUS_CHANGED : "OnCTIAgentStateChanged", // 状态改变
         ON_RINGING : "OnRinging", // 振铃事件
         ON_REQSIPANSWER : "OnRequestSipAnswer", // SIPPhone请求应答
         ON_RELEASE : "OnRelease", // 挂机事件
         ON_MEDIAABILITY_EVENT:"OnMediaAbilityEvent", //多媒体状态变化通知事件
             
         // 自定义事件
         START_GETINITINFO : "StartGetInitInfo", // 开始进行初始化
         GET_INITINFO_SUCCEEDED : "GetInitInfoSucceeded", // 获取初始化信息成功
         GET_INITINFO_FAILED : "GetInitInfoFailed", // 获取初始化信息失败
         START_SIGNIN : "StartSignIn", // 开始进行签入
         SIGNIN_SUCCEEDED : "SignInSucceeded", // 签入成功
         SIGNIN_FAILED : "SignInFailed", // 签入失败
         SERVER_DISCONNECTED : "ServerDisconnected", // 连接断开
         START_INIT_SIPPHONE : "StartInitSipPhone", // 初始化SIPPhone
         INIT_SIPPHONE_SUCCEEDED : "InitSipPhoneSucceeded", // 初始化SIPPhone成功
         INIT_SIPPHONE_FAILED : "InitSipPhoneFailed", // 初始化SIPPhone失败
         
         // SIPPhone广播事件
         SIP_SIGNOFF_SUCC : "SipSignOffSucceeded"// SIPPhone注销成功
    };
    
    function EventBus()
    {
        this.eventListeners = {};
        this.commonListeners = new Array();
    }
    
    EventBus.prototype.publish = function(event)
    {
        var entry, e = {};
        
        e.eventName = event.eventName;
        e.args = event.args ? event.args : {};
        
        for (var i = 0; i < this.commonListeners.length; ++i)
        {
            entry = this.commonListeners[i];
            
            try
            {
                entry.listener.call(entry.context, e, entry.param);
            }
            catch(ex)
            {
                
            }
        }
        
        var listeners = this.eventListeners[e.eventName];
        if (listeners)
        {
            for (var i = 0; i < listeners.length; ++i)
            {
                entry = listeners[i];
                
                try
                {
                    entry.listener.call(entry.context, e, entry.param);
                }
                catch(ex)
                {
                    
                }
            }
        }
    };
    
    /**
     * 添加监听函数
     * 
     * @param {String} eventName 事件名称 
     * @param {Function} l 监听函数
     * @param {Object} ctx this指针
     * @param {Object} param 监听函数的参数
     */
    EventBus.prototype.subscribe = function(eventName, l, ctx, param)
    {
        var toAdd = {
                listener : l,
                context : ctx,
                param : param
            };
        
        var listenerList;
        
        if (eventName)
        {
            listenerList = this.eventListeners[eventName];
            
            if (!listenerList)
            {
                listenerList = new Array();
                this.eventListeners[eventName] =  listenerList;
            }
        }
        else
        {
            listenerList = this.commonListeners;
        }
        
        listenerList.push(toAdd);
    };
    
    /**
     * 移除监听函数
     * 
     * @param {Function} callback 监听函数
     */
    EventBus.prototype.unSubscribe = function(callback)
    {
        for (var i = 0; i < this.commonListeners.length; ++i)
        {
            if (this.commonListeners[i] === callback)
            {
                this.commonListeners.splice(i, 1);
                --i;
            }
        }
        
        for (var eventName in this.eventListeners)
        {
            var listeners = this.eventListeners[eventName];
            for (var i = 0; i < listeners.length; ++i)
            {
                if (listeners[i].listener === callback)
                {
                    listeners.splice(i, 1);
                    --i;
                }
            }
        }
    };
    
    /**
     * 坐席信息
     */
    function AgentInfo(){}
    
    AgentInfo.prototype = new Object();
    
    /**
     * VCID
     * 
     * @type Number
     */
    AgentInfo.prototype.vcid = null;
    
    /**
     * 组ID
     * 
     * @type Number
     */
    AgentInfo.prototype.groupId = null;
    
    /**
     * 工号
     * 
     * @type Number
     */
    AgentInfo.prototype.agentId = null;
    
    /**
     * 密码
     * 
     * @type String
     */
    AgentInfo.prototype.password = null;
    
    /**
     * 电话号码
     * 
     * @type String
     */
    AgentInfo.prototype.bindPhone = null;
    
    /**
     * 话机类型
     * 
     * @type Number
     */
    AgentInfo.prototype.phoneType = null;
    
    /**
     * Mac地址
     * 
     * @type String
     */
    AgentInfo.prototype.mac = null;
    
    /**
     * 坐席状态信息
     */
    function StateInfo(){}
    
    StateInfo.prototype = new Object();
    
    /**
     * 服务端返回的会话id
     * 
     * @type String
     */
    StateInfo.prototype.sessionId = null;
    
    /**
     * 拼装工号和VC后的会话id
     * 
     * @type String
     */
    StateInfo.prototype.agentSessionId = null;
    
    /**
     * 状态码
     * 
     * @type Number
     */
    StateInfo.prototype.state = 1;
    
    /**
     * 前一状态的状态码
     * 
     * @type Number
     */
    StateInfo.prototype.previousState = null;
    
    /**
     * 呼叫ID
     * 
     * @type String
     */
    StateInfo.prototype.callId = null;
    
    /**
     * 主叫方号码
     * 
     * @type String
     */
    StateInfo.prototype.calling = null;
    
    /**
     * 被叫方号码
     * 
     * @type String
     */
    StateInfo.prototype.called = null;
    
    /**
     * 呼叫流水号
     * 
     * @type String
     */
    StateInfo.prototype.callFlowNO = null;
    
    /**
     * 用户数据
     * 
     * @type String
     */
    StateInfo.prototype.userData = null;
    
    /**
     * 完整随路数据
     * 
     * @type Object
     */
    StateInfo.prototype.callData = null;
    
    /**
     * 零配置服务器的URL
     * 
     * @type String
     */
    StateInfo.prototype.zeroCfgURL = null;
    
    /**
     * AgentServer的URL
     * 
     * @type String
     */
    StateInfo.prototype.agentServerURL = null;
    
    /**
     * 是否自动应答
     * 
     * @type Boolean
     */
    StateInfo.prototype.isAutoAnswer = null;
    
    /**
     * 是否自动示闲
     * 
     * @type Boolean
     */
    StateInfo.prototype.isAutoIdle = null;
    
    /**
     * 标识Sipphone是否已注销
     * 
     * @type Boolean
     */
    StateInfo.prototype.sipLogout = true;
    
    /**
     * 座席拥有的多媒体能力值
     */
    StateInfo.prototype.mediaState = 0;
    
    /**
     * 媒体能力改变事件的操作类型
     * 0：设置实时媒体(聊天等)
        1：设置非实时媒体(传真等)
        2：设置实时媒体+非实时媒体
     */
    StateInfo.prototype.mediaType = -1;
    
    /**
     * CTI事件
     * 
     * @param {String} eventName 事件名称
     * @param {Object} args 事件参数 
     */
    function CTIEvent(eventName, args)
    {
        this.eventName = eventName;
        this.args = args;
    }
    
    CTIEvent.prototype = new Object();
    
    /**
     * 事件名称
     * 
     * @type String
     */
    CTIEvent.prototype.eventName = null;
    
    /**
     * 事件参数
     * 
     * @type Object
     */
    CTIEvent.prototype.args = null;
    
    /**
     * AgentClient的实现
     * 
     * @param isTop 是否顶层窗口
     */
    function AgentClientImpl(isTop)
    {
        this.workMode = isTop ? AgentClientImpl.WorkMode.HostMode : null;
        this.isInited = false;
        this.isIniting = false;
        this.isLogining = false;
        this.isLogined = false;
        this.isAttaching = false;
        this.isAttached = false;
        this.stateInfo = new StateInfo();
        this.agentInfo = new AgentInfo();
        this.eventHandlers = {};
        this.invokeInterceptors = {};
        this.msgId = 0;
        this.zeroCfgExecutor = null;
        this.cmdExecutor = null;
        this.eventExecutor = null;
        this.sipPhoneExecutor = null;
        this.getInitInfoResp = null;
        this.initCallbacks = new Array();
        this.clientMessageChannel = new ClientMessageChannel(this);
        
        this.eventBus = new EventBus();
        this.eventBus.subscribe(null, this.eventOccurred, this);
        this.eventBus.subscribe(null, this.clientMessageChannel.eventOccurred, this.clientMessageChannel);
        
      this.eventInterceptor = new EventInterceptor(this);
        
        this.initEventHandlers();
        this.initInvokeInterceptors();
        this.restoreWorkStatus();
        
        if (!this.workMode)
        {
            this.clientMessageChannel.findHost();
        }
        
        this.lastErrorCode = 0;
    }
    
    AgentClientImpl.VERSION = "AgentClientJS_V0.0.1";
    
    AgentClientImpl.prototype.ErrorCode = ErrorCode;
    
    /**
     * 工作模式
     */
    AgentClientImpl.WorkMode = {
        HostMode : "HostMode",
        ClientMode : "ClientMode"
    };
    
    /**
     * 本地存储信息的键值
     */
    AgentClientImpl.WebStorageKeys = {
        AGENTCLIENT_INFO : "AgentClient_Info",
        AGENT_INFO : "AgentClient_AgentInfo",
        STATE_INFO : "AgentCilent_StateInfo",
        MESSAGE_ID : "AgentClient_MSGID",
        ZEROCFG_URL : "AgentClient_ZeroCfgURL",
        AGENTSERVER_URL : "AgentClient_AgentServerURL"
    };
    
    /**
     * 初始化事件处理器
     */
    AgentClientImpl.prototype.initEventHandlers = function()
    {
        this.eventHandlers[Events.START_GETINITINFO] = this.startGetInitInfoHandler;
        this.eventHandlers[Events.GET_INITINFO_SUCCEEDED] = this.getInitInfoSucceededHandler;
        this.eventHandlers[Events.GET_INITINFO_FAILED] = this.getInitInfoFailedHandler;
        this.eventHandlers[Events.START_SIGNIN] = this.startSignInHandler;
        this.eventHandlers[Events.SIGNIN_SUCCEEDED] = this.signInSucceededHandler;
        this.eventHandlers[Events.SIGNIN_FAILED] = this.signInFailedHandler;
        this.eventHandlers[Events.SIP_SIGNOFF_SUCC] = this.sipSignOffSuccHandler;
        this.eventHandlers[Events.ON_CTIAGENTSTATUS_CHANGED] = this.onCTIAgentStateChangedHandler;
        this.eventHandlers[Events.SERVER_DISCONNECTED] = this.serverDisconnectedHandler;
        this.eventHandlers[Events.ON_REQSIPANSWER] = this.onReqSipAnswerHandler;
        this.eventHandlers[Events.ON_RELEASE] = this.onReleaseHandler;
        this.eventHandlers[Events.ON_MEDIAABILITY_EVENT] = this.onMediaAbilityEventHandler;
    };
    
    /**
     * 初始化调用拦截器
     */
    AgentClientImpl.prototype.initInvokeInterceptors = function()
    {
        this.invokeInterceptors["Answer"] = this.answerInterceptor;
        this.invokeInterceptors["ReleaseCall"] = this.releaseCallInterceptor;
        this.invokeInterceptors["SendDTMF"] = this.sendDTMFInterceptor;
        this.invokeInterceptors["SetProperties"] = this.setPropertiesInterceptor;
    };
    
    /**
     * @returns {Number} 发送的消息ID
     */
    AgentClientImpl.prototype.getMsgId = function()
    {
        ++this.msgId;
        if (this.msgId > 65535)
        {
            this.msgId = 0;
        }
        sessionStorage.setItem(AgentClientImpl.WebStorageKeys.MESSAGE_ID, JSON.stringify(this.msgId));
        return this.msgId;
    };
    
    /**
     *  获取最近一次错误
     * @returns {Number}
     */
    AgentClientImpl.prototype.getLastErrorCode = function()
    {
        return this.lastErrorCode;
    };
    
    /**
     * 恢复工作状态
     */
    AgentClientImpl.prototype.restoreWorkStatus = function()
    {
        var str, obj, infoFound = false;
        
        str = sessionStorage.getItem(AgentClientImpl.WebStorageKeys.AGENTCLIENT_INFO);
        if (str)
        {
            infoFound = true;
            obj = JSON.parse(str);
            this.workMode = obj.workMode;
            this.isIniting = obj.isIniting;
            this.isInited = obj.isInited;
            this.isLogining = obj.isLogining;
            this.isLogined = obj.isLogined;
            this.isAttaching = obj.isAttaching;
            this.isAttached = obj.isAttached;
        }
        
        str = sessionStorage.getItem(AgentClientImpl.WebStorageKeys.AGENT_INFO);
        if (str)
        {
            this.agentInfo = JSON.parse(str);
        }
        
        str = sessionStorage.getItem(AgentClientImpl.WebStorageKeys.STATE_INFO);
        if (str)
        {
            this.stateInfo = JSON.parse(str);
        }
        
        str = sessionStorage.getItem(AgentClientImpl.WebStorageKeys.MESSAGE_ID);
        if (str)
        {
            this.msgId = JSON.parse(str);
        }
        
        if (infoFound)
        {
            if (this.workMode == AgentClientImpl.WorkMode.ClientMode)
            {
                this.clientMessageChannel.findHost();
            }
            else
            {
                if (this.isInited)
                {
                    this.zeroCfgExecutor = new CommandRequestExecutor([localStorage.getItem(AgentClientImpl.WebStorageKeys.ZEROCFG_URL)], this);
                }
                
                if (this.isLogined)
                {
                   this.cmdExecutor = new CommandRequestExecutor([localStorage.getItem(AgentClientImpl.WebStorageKeys.AGENTSERVER_URL)], this);
                  //  this.cmdExecutor = getRequestExecutor(urls, this, RequestExecutor.DEFAULT_TIMEOUT, this.stateInfo.agentSessionId, true);
                    this.eventExecutor = new CommandRequestExecutor([localStorage.getItem(AgentClientImpl.WebStorageKeys.AGENTSERVER_URL)], this, 60000);
//                    this.eventExecutor = getRequestExecutor([this.cmdExecutor.availableUrl], this, 60000, this.stateInfo.agentSessionId, true);
                    this.eventExecutor.startGetEvent();
                    
                    if (this.agentInfo && this.stateInfo && this.agentInfo.phoneType == PhoneType.SIP_PHONE)
                    {
                        this.sipPhoneExecutor = new SipPhoneRequestExecutor(SIP_PHONE_URL, this, 60000, this.stateInfo.agentSessionId);
                        this.sipPhoneExecutor.startGetEvent();
                    }
                }
            }
        }
    };
    
    /**
     * 保存工作信息至本地
     */
    AgentClientImpl.prototype.storeWorkStatus = function()
    {
        sessionStorage.setItem(AgentClientImpl.WebStorageKeys.AGENTCLIENT_INFO, JSON.stringify({
            workMode : this.workMode,
            isIniting : this.isIniting,
            isInited : this.isInited,
            isLogining : this.isLogining,
            isLogined : this.isLogined,
            isAttaching : this.isAttaching,
            isAttached : this.isAttached
        }));
        sessionStorage.setItem(AgentClientImpl.WebStorageKeys.AGENT_INFO, JSON.stringify(this.agentInfo));
        sessionStorage.setItem(AgentClientImpl.WebStorageKeys.STATE_INFO, JSON.stringify(this.stateInfo));
    };
    
    /**
     * 混合URL列表.如果list汇总存在usedURL,则将usedURL放在最前,否则丢弃usedURL.
     * 
     * @param {String} usedURL 成功使用过的URL
     * @param {Array} list URL列表
     * @returns {Array} 混合后的URL列表
     */
    AgentClientImpl.prototype.fuseURLList = function(usedURL, list)
    {
        if (usedURL)
        {
            var newList = new Array(), containUsed = false;
            newList.push(usedURL);
            
            for (var i = 0; i < list.length; ++i)
            {
                if (usedURL == list[i])
                {
                    containUsed = true;
                    continue;
                }
                else
                {
                    newList.push(list[i]);
                }
            }
            
            if (!containUsed)
            {
                newList.shift();
            }
            
            return newList;
        }
        else
        {
            return list;
        }
    };
    
    /**
     * 执行初始化的回调处理函数
     * 
     * @param {Object} ret 结果
     * @param {Function} callback 回调函数
     * @param {Object} ctx 上下文
     * @param {Object} callbackParam 回调参数
     */
    AgentClientImpl.prototype.getInitInfoCallback = function(ret, callback, ctx, callbackParam)
    {        
        if (ret.result == ErrorCode.SUCCEEDED)
        {
            this.stateInfo.zeroCfgURL = this.zeroCfgExecutor.availableUrl;
            
            if (ret.args.usingagttel && this.agentInfo.bindPhone && ret.args.usingagttel != this.agentInfo.bindPhone)
            {
                ret.result = ErrorCode.AGENT_ID_LOGINED;
                this.agentInfo = new AgentInfo();
            }
            else if (ret.args.usingagtid && ret.args.usingagtid != this.agentInfo.agentId)
            {
                ret.result = ErrorCode.PHONENO_USED;
                this.agentInfo = new AgentInfo();
            }
            else
            {
                if (ret.args.vcid)
                {
                    this.agentInfo.vcid = ret.args.vcid;
                }
                
                if (PhoneType.SIP_PHONE == this.agentInfo.phoneType || PhoneType.PC_MODEM == this.agentInfo.phoneType)
                {
                    this.agentInfo.bindPhone = ret.args.agttel;
                }
                
                this.stateInfo.sessionId = ret.args.sessionid;
                this.stateInfo.agentSessionId = this.agentInfo.vcid + "-" + this.agentInfo.agentId + "-" + ret.args.sessionid;

                var urlsList = ret.args.agtsvrurl.split("|"), urls = new Array();
                for (var i = 0; i < urlsList.length; ++i)
                {
                    if (urlsList[i])
                    {
                        urls.push(urlsList[i]);
                    }
                }
                urls = this.fuseURLList(localStorage.getItem(AgentClientImpl.WebStorageKeys.AGENTSERVER_URL), urls);
                
                if (urls.length > 0)
                {
//                    this.cmdExecutor = new CommandRequestExecutor(urls, this);
                    this.cmdExecutor = getRequestExecutor(urls, this, RequestExecutor.DEFAULT_TIMEOUT, this.stateInfo.agentSessionId, true);
                }
                else
                {
                    ret.result = ErrorCode.NO_AGENTSVR_URL;
                }
            }
        }
        else
        {
            this.agentInfo = new AgentInfo();
        }
        
        if (ret.result == ErrorCode.SUCCEEDED)
        {
            this.getInitInfoResp = ret;
            this.eventBus.publish({eventName : Events.GET_INITINFO_SUCCEEDED});
        }
        else
        {
            this.eventBus.publish({eventName : Events.GET_INITINFO_FAILED});
        }

        callCallback(callback, ctx, ret, callbackParam);
    };
    
    /**
     * 初始化过程中获取MAC地址的回调函数
     * 
     * @param {Object} ret 获取MAC地址的结果
     * @param {Object} param 初始化的参数
     * @param {Function} callback 回调函数
     * @param {Object} ctx 上下文
     * @param {Object} callbackParam 回调参数
     */
    AgentClientImpl.prototype.initGetMACCallback = function(ret, param, callback, ctx, callbackParam)
    {
        if (ret.result == ErrorCode.SUCCEEDED)
        {
            param.mac = ret.args.mac;
            this.agentInfo.mac = ret.args.mac;
            this.zeroCfgExecutor.doRequest("GetInitInfo", param, wrapCallback(this.getInitInfoCallback, this, true, callback, ctx, callbackParam));
        }
        else
        {
            this.eventBus.publish({eventName : Events.GET_INITINFO_FAILED});
            this.sipPhoneExecutor.dispose();
            this.sipPhoneExecutor = null;
            callCallback(callback, ctx, {result:ErrorCode.GETMAC_FAILED, args:{cause:ret.result}}, callbackParam);
        }
    };
    
    /**
     * 获取MAC地址
     * 
     * @param {Function} callback 回调函数
     * @param {Object} ctx 上下文
     * @param {Object} callbackParam 回调参数
     */
    AgentClientImpl.prototype.getMAC = function(callback, ctx, callbackParam)
    {
        if (!this.sipPhoneExecutor)
        {
            this.sipPhoneExecutor = new SipPhoneRequestExecutor(SIP_PHONE_URL, this, 60000, this.stateInfo.agentSessionId);
        }
        
        if (this.sipPhoneExecutor)
        {
            this.sipPhoneExecutor.doRequest("JS_GetMacAddress", null, wrapCallback(callback, ctx, true, callbackParam));
        }
    };
    
    /**
     * 获取零配置
     * 
     * @param {String, Array} urls URL列表,为String时则为单个URL,为Array时则为多个URL
     * @param {Object} param 参数,以属性名称的键值对来作为参数 
     * @param {Function} callback 回调函数
     * @param {Object} callbackParam 要传递给回调函数的参数
     * @param {Object} ctx 回调函数的this指针 
     */
    AgentClientImpl.prototype.getInitInfo = function(urls, param, callback, ctx, callbackParam)
    {
        if (this.isInited)
        {
            callCallback(callback, ctx, {result: ErrorCode.ALREADY_GETINITINFO}, callbackParam);
            return;
        }
        
        if (this.isIniting)
        {
            callCallback(callback, ctx, {result: ErrorCode.DOING_GETINITINFO}, callbackParam);
            return;
        }
        
        if (urls == null)
        {
            callCallback(callback, ctx, {result: ErrorCode.NULL_URL}, callbackParam);
            return;
        }
        
        var requetUrls = new Array();
        
        if (urls instanceof Array)
        {
            for (var i = 0; i < urls.length; ++i)
            {
                if (urls[i])
                {
                    requetUrls.push(urls[i]);
                }
            }
        }
        else
        {
            var strUrl = String(urls);
            if (strUrl.length > 0)
            {
                requetUrls.push(strUrl);
            }
        }
        
        if (requetUrls.length == 0)
        {
            callCallback(callback, ctx, {result: ErrorCode.NULL_URL}, callbackParam);
            return;
        }
        
        if (!param)
        {
            callCallback(callback, ctx, {result: ErrorCode.PARAM_REQUIRED}, callbackParam);
            return;
        }
        
        var lowerCaseParam = attributesToLowerCase(param);
        lowerCaseParam.clientflag = 2;
        
        this.agentInfo.agentId = lowerCaseParam.agtid;
        this.agentInfo.vcid = lowerCaseParam.vcid;
        this.agentInfo.password = lowerCaseParam.pwd;
        this.agentInfo.phoneType = lowerCaseParam.phonetype;
        this.agentInfo.bindPhone = lowerCaseParam.agttel;
        this.agentInfo.mac = lowerCaseParam.mac;
        
        this.workMode = AgentClientImpl.WorkMode.HostMode;
        
        this.zeroCfgExecutor = new CommandRequestExecutor(this.fuseURLList(localStorage.getItem(AgentClientImpl.WebStorageKeys.ZEROCFG_URL), requetUrls), this);
        
        this.eventBus.publish({eventName : Events.START_GETINITINFO});
        
        if (this.agentInfo.phoneType == PhoneType.SIP_PHONE)
        {
            this.getMAC(wrapCallback(this.initGetMACCallback, this, true, lowerCaseParam, callback, ctx, callbackParam));
        }
        else
        {
            this.zeroCfgExecutor.doRequest("GetInitInfo", lowerCaseParam, wrapCallback(this.getInitInfoCallback, this, true, callback, ctx, callbackParam));
        }
    };
    
    /**
     * 丢弃已初始化的信息
     */
    AgentClientImpl.prototype.disposeInitInfo = function()
    {
        if (!this.isIniting && this.isInited && !this.isLogined && !this.logging)
        {
            this.agentInfo = new AgentInfo();
            this.stateInfo = new StateInfo();
            this.isInited = false;
            this.workMode = null;
            this.clientsInit(false);
        }
    };
    
    /**
     * CTI的参数字符串转换为对象,属性名称小写
     * 
     * @param {String} callData 数据字符串
     * @returns {Object}
     */
    AgentClientImpl.prototype.ctiParamStrToObj = function(callData)
    {
        var key, value, callDataObj = {};
        
        for (var startIndex = 0, eqIdx = callData.indexOf('=', startIndex), semiIdx; eqIdx > -1;)
        {
            key = callData.substring(startIndex, eqIdx).toLowerCase();
            
            // 随路数据中us是最后一个关键且其内容也可能会带=和;所以做特殊处理
            if (key === "us")
            {
                value = callData.substring(eqIdx + 1);
                callDataObj[key] = value;
                break;
            }
            
            semiIdx = callData.indexOf(';', eqIdx);
            
            if (semiIdx > -1)
            {
                startIndex = semiIdx + 1;
                value = callData.substring(eqIdx + 1, semiIdx);
            }
            else
            {
                startIndex = callData.length;
                value = callData.substring(eqIdx + 1);
            }
            
            callDataObj[key] = value;
            
            eqIdx = callData.indexOf('=', startIndex);
        }
        
        return callDataObj;
    };
    
    /**
     * 刷新随路数据
     * 
     * @param {String} callData
     */
    AgentClientImpl.prototype.refreshCallData = function(callData)
    {
        var callDataObj = this.ctiParamStrToObj(callData);
        this.stateInfo.callData = callDataObj;
        this.stateInfo.userData = callDataObj["us"];
        this.stateInfo.callFlowNO = callDataObj["idno"];
    };
    
    AgentClientImpl.prototype.restoreStatusCallback = function(ret)
    {
        this.stateInfo.previousState = this.stateInfo.state;
        this.stateInfo.state = parseInt(ret.args.substatus, 10);
        this.refreshCallData(ret.args.calldata);
        this.eventBus.publish({
            eventName: Events.ON_CTIAGENTSTATUS_CHANGED,
            args : {
                state : ret.args.substatus,
                prevstate : String(this.stateInfo.previousState),
                cause : "0"
            }
        });
    };
    
    AgentClientImpl.prototype.initSipPhoneCallback = function(ret, signRet, callback, ctx, callbackParam)
    {
        if (ret.result == ErrorCode.SUCCEEDED)
        {
            this.sipPhoneExecutor.startGetEvent();
            this.stateInfo.agentServerURL = this.cmdExecutor.availableUrl;
//            this.eventExecutor = new CommandRequestExecutor([this.cmdExecutor.availableUrl], this, 60000);
            this.eventExecutor = getRequestExecutor([this.cmdExecutor.availableUrl], this, 60000, this.stateInfo.agentSessionId, true);
            this.eventExecutor.startGetEvent();
            
            this.stateInfo.sipLogout = false;
            this.eventBus.publish({eventName : Events.INIT_SIPPHONE_SUCCEEDED});
            this.eventBus.publish({eventName : Events.SIGNIN_SUCCEEDED});
            callCallback(callback, ctx, signRet, callbackParam);
        }
        else
        {
            this.eventBus.publish({eventName : Events.INIT_SIPPHONE_FAILED});
            this.eventBus.publish({eventName : Events.SIGNIN_FAILED});
            this.sipPhoneExecutor.dispose();
            this.sipPhoneExecutor = null;
            this.signOut();
            callCallback(callback, ctx, {result:ErrorCode.INIT_SIPPHONE_FAILED,args:{cause:ret.result}}, callbackParam);
        }
    };
    
    AgentClientImpl.prototype.initSipPhone = function(signRet, callback, ctx, callbackParam)
    {
        this.eventBus.publish({eventName : Events.START_INIT_SIPPHONE});
        
        if (!this.sipPhoneExecutor)
        {
            this.sipPhoneExecutor = new SipPhoneRequestExecutor(SIP_PHONE_URL, this, 60000, this.stateInfo.agentSessionId);
        }
        
        this.sipPhoneExecutor.doRequest("JS_ConfigInfo", this.getInitInfoResp.args["ngccclient"]);
        this.sipPhoneExecutor.doRequest("JS_SipLogIn", null, wrapCallback(this.initSipPhoneCallback, this, true, signRet, callback, ctx, callbackParam));
    };
    
    AgentClientImpl.prototype.signInCallback = function(ret, callback, ctx, callbackParam)
    {
        var succeeded = ret.result == ErrorCode.SUCCEEDED;
        
        if (succeeded)
        {
            this.agentInfo.groupId = ret.args.grpid;
                        
            if (ret.args.online == "1")
            {
                this.cmdExecutor.doRequest("GetAgtCallInfo", null, wrapCallback(this.restoreStatusCallback, this, true));
                this.stateInfo.agentServerURL = this.cmdExecutor.availableUrl;
//                this.eventExecutor = new CommandRequestExecutor([this.cmdExecutor.availableUrl], this, 60000);
                this.eventExecutor = getRequestExecutor([this.cmdExecutor.availableUrl], this, 60000, this.stateInfo.agentSessionId, true);
                this.eventExecutor.startGetEvent();
                
                this.eventBus.publish({eventName : Events.SIGNIN_SUCCEEDED});
                callCallback(callback, ctx, ret, callbackParam);
            }
            else if (PhoneType.SIP_PHONE == this.agentInfo.phoneType)
            {
                this.initSipPhone(ret, callback, ctx, callbackParam);
            }
            else
            {
                this.stateInfo.agentServerURL = this.cmdExecutor.availableUrl;
//                this.eventExecutor = new CommandRequestExecutor([this.cmdExecutor.availableUrl], this, 60000);
                this.eventExecutor = getRequestExecutor([this.cmdExecutor.availableUrl], this, 60000, this.stateInfo.agentSessionId, true);
                this.eventExecutor.startGetEvent();
                
                this.eventBus.publish({eventName : Events.SIGNIN_SUCCEEDED});
                callCallback(callback, ctx, ret, callbackParam);
            }
        }
        else
        {
            this.eventBus.publish({eventName : Events.SIGNIN_FAILED});
            callCallback(callback, ctx, ret, callbackParam);
        }
    };
    
    AgentClientImpl.prototype.signIn = function(param, callback, ctx, callbackParam)
    {
        if (!this.isInited)
        {
            callCallback(callback, ctx, {result : ErrorCode.NOT_INITED}, callbackParam);
            return;
        }
        
        if (!param && callback)
        {
            callCallback(callback, ctx, {result : ErrorCode.PARAM_REQUIRED}, callbackParam);
            return;
        }
        
        var lowerCaseParam = attributesToLowerCase(param);
        
        lowerCaseParam.phonetype = this.agentInfo.phoneType;
        lowerCaseParam.agttel = this.agentInfo.bindPhone;
        lowerCaseParam.pwd = this.agentInfo.password;
        lowerCaseParam.mac = this.agentInfo.mac;
        lowerCaseParam.agtver = AgentClientImpl.VERSION;
        lowerCaseParam.clientflag = 2; // 2-js
        
        this.msgId = 0;
        
        this.eventBus.publish({eventName : Events.START_SIGNIN});
        
        this.cmdExecutor.doRequest("SignIn", lowerCaseParam, wrapCallback(this.signInCallback, this, true, callback, ctx, callbackParam));
    };
    
    /**
     * 事件发生
     * 
     * @param {CTIEvent} event CTI事件
     */
    AgentClientImpl.prototype.eventOccurred = function(event)
    {        
        var refreshWorkStatus = false;
        
        if (event.args)
        {
            if (event.args.calldata)
            {
                this.refreshCallData(event.args.calldata);
                refreshWorkStatus = true;
            }
            
            if (event.args.callid)
            {
                this.stateInfo.callId = event.args.callid;
                refreshWorkStatus = true;
            }
            
            if (event.args.calling)
            {
                this.stateInfo.calling = event.args.calling;
                refreshWorkStatus = true;
            }
            
            if (event.args.called)
            {
                this.stateInfo.called = event.args.called;
                refreshWorkStatus = true;
            }
        }
        
        if (refreshWorkStatus)
        {
            this.storeWorkStatus();
        }
        
        if (this.eventHandlers[event.eventName])
        {
            this.eventHandlers[event.eventName].call(this, event);
        }
    };
    
    AgentClientImpl.prototype.clientsInit = function(isOk)
    {
        var entry;
        
        while (this.initCallbacks.length> 0)
        {
            entry = this.initCallbacks.shift();
            
            if (entry[0])
            {
                try
                {
                    entry[0].call(entry[1], isOk, entry[2]);
                }
                catch (e)
                {
                    // 防止回调函数出错
                }
            }
        }
    };
    
    AgentClientImpl.prototype.init = function(callback, ctx, callbackParam)
    {
        if (this.isLogined)
        {
            if (callback)
            {
                callback.call(ctx, true, callbackParam);
            }
        }
        else if (this.isIniting || this.isInited || this.isLogining)
        {
            this.initCallbacks.push([callback, ctx, callbackParam]);
        }
        else if (this.workMode == AgentClientImpl.WorkMode.HostMode)
        {
            if (callback)
            {
                callback.call(ctx, false, callbackParam);
            }
        }
        else if (this.isAttaching || this.isAttached)
        {
            this.initCallbacks.push([callback, ctx, callbackParam]);
        }
        else
        {
            this.initCallbacks.push([callback, ctx, callbackParam]);
            this.workMode = AgentClientImpl.WorkMode.ClientMode;
            this.isAttaching = true;
            this.storeWorkStatus();
            this.clientMessageChannel.findHost();
        }
    };
    
    /**
     * 挂自己后的回调函数
     * 
     * @param {Object} ret 返回的结果 
     * @param {Function} callback 回调函数
     * @param {Object} ctx 上下文
     * @param {Object} callbackParam 回调参数
     */
    AgentClientImpl.prototype.releaseSelfCallback = function(ret, callback, ctx, callbackParam)
    {
        if (this.agentInfo.phoneType == PhoneType.SIP_PHONE)
        {
            if (ret.result == ErrorCode.SUCCEEDED)
            {
                this.sipPhoneExecutor.doRequest("JS_SipHungup", null, function(){
                    callCallback(callback, ctx, ret, callbackParam);
                });
            }
            else
            {
                this.sipPhoneExecutor.doRequest("JS_SipHungupAndBye", null, function(sipRet){
                    callCallback(callback, ctx, sipRet, callbackParam);
                });
            }
        }
        else
        {
            callCallback(callback, ctx, ret, callbackParam);
        }
    };
    
    /**
     * 挂机拦截器
     * 
     * @param {String} method 方法名
     * @param {Object} param 参数
     * @param {Function} callback 回调函数
     * @param {Object} ctx 上下文
     * @param {Object} callbackParam 回调参数
     */
    AgentClientImpl.prototype.releaseCallInterceptor = function(method, param, callback, ctx, callbackParam)
    {
        if (States.LOGOUT.isInclude(this.stateInfo.state))
        {
            callCallback(callback, ctx, {result:ErrorCode.ILLEGAL_OP}, callbackParam);
        }
        else if (this.agentInfo.phoneType == PhoneType.SIP_PHONE)
        {
            var isReleaseSelf = attributesToLowerCase(param)["dstobj"] == this.agentInfo.bindPhone;
            
            if (this.isLogined)
            {  
                if (isReleaseSelf)
                {
                    this.cmdExecutor.doRequest(method, param, wrapCallback2(this.releaseSelfCallback, this, true, [callback, ctx, callbackParam]));
                }
                else
                {
                    this.cmdExecutor.doRequest(method, param, wrapCallback(callback, ctx, true, callbackParam));
                }
            }
            else if (isReleaseSelf)
            {
                this.sipPhoneExecutor.doRequest("JS_SipHungup", null, wrapCallback(callback, ctx, true, callbackParam));
            }
            else
            {
                callCallback(callback, ctx, {result:ErrorCode.ILLEGAL_OP}, callbackParam);
            }
        }
        else
        {
            this.cmdExecutor.doRequest(method, param, wrapCallback(callback, ctx, true, callbackParam));
        }
    };
    
    /**
     * 应答拦截器
     * 
     * @param {String} method 方法名
     * @param {Object} param 参数
     * @param {Function} callback 回调函数
     * @param {Object} ctx 上下文
     * @param {Object} callbackParam 回调参数
     */
    AgentClientImpl.prototype.answerInterceptor = function(method, param, callback, ctx, callbackParam)
    {
        if (this.agentInfo.phoneType == PhoneType.SIP_PHONE)
        {
            this.sipPhoneExecutor.doRequest("JS_SipAnswer", null, wrapCallback(callback, ctx, true, callbackParam));
        }
        else
        {
            this.cmdExecutor.doRequest(method, param, wrapCallback(callback, ctx, true, callbackParam));
        }
    };
    
    /**
     * 发送DTMF的拦截器
     * 
     * @param {String} method 方法名
     * @param {Object} param 参数
     * @param {Function} callback 回调函数
     * @param {Object} ctx 上下文
     * @param {Object} callbackParam 回调参数
     */
    AgentClientImpl.prototype.sendDTMFInterceptor = function(method, param, callback, ctx, callbackParam)
    {
        if (!param)
        {
            callCallback(callback, ctx, {result:ErrorCode.ILLEGAL_ARGUMENTS}, callbackParam);
            return;
        }
        
        var obj = attributesToLowerCase(param);
        if (!obj.dtmf)
        {
            callCallback(callback, ctx, {result:ErrorCode.ILLEGAL_ARGUMENTS}, callbackParam);
            return;
        }
        
        if (this.agentInfo.phoneType == PhoneType.SIP_PHONE)
        {
            this.sipPhoneExecutor.doRequest("JS_SendDTMF", {dtmfinfo:obj.dtmf}, wrapCallback(callback, ctx, true, callbackParam));
        }
        else
        {
            this.cmdExecutor.doRequest(method, param, wrapCallback(callback, ctx, true, callbackParam));
        }
    };
    
    /**
     * 设置属性的回调函数
     * 
     * @param {Object} ret 操作结果
     * @param {Object} prop 属性对象
     * @param {Function} callback 回调函数
     * @param {Object} ctx 上下文
     * @param {Object} callbackParam 回调函数参数
     */
    AgentClientImpl.prototype.setPropertiesCallback = function(ret, prop, callback, ctx, callbackParam)
    {
        if (prop.idleflag != null)
        {
            this.stateInfo.isAutoIdle = ("1" == prop.idleflag);
        }
            
        if (prop.autoanswer != null)
        {
            this.stateInfo.isAutoAnswer = ("1" == prop.autoanswer);
        }
        
        if (callback)
        {
            callback.call(ctx, ret, callbackParam);
        }
    };
    
    /**
     * 设置属性的拦截器
     * 
     * @param {String} method 方法名
     * @param {Object} param 参数
     * @param {Function} callback 回调函数
     * @param {Object} ctx 上下文
     * @param {Object} callbackParam 回调参数
     */
    AgentClientImpl.prototype.setPropertiesInterceptor = function(method, param, callback, ctx, callbackParam)
    {
        if (!param)
        {
            if (callback)
            {
                callback.call(ctx, {result : ErrorCode.ILLEGAL_ARGUMENTS}, callbackParam);
            }
            return;
        }
        
        var paramObj = attributesToLowerCase(param);
        if (!paramObj.properties)
        {
            if (callback)
            {
                callback.call(ctx, {result : ErrorCode.ILLEGAL_ARGUMENTS}, callbackParam);
            }
            return;
        }
        
        var srcPropObj = this.ctiParamStrToObj(paramObj.properties);
        var propObj = this.ctiParamStrToObj(paramObj.properties);
        
        if (this.agentInfo.phoneType == PhoneType.SIP_PHONE)
        {
            delete propObj["idleflag"];
            delete propObj["autoanswer"];
        }
        
        var buffer = new Array();
        
        for (var attr in propObj)
        {
            buffer.push(attr);
            buffer.push("=");
            buffer.push(propObj[attr]);
            buffer.push(";");
        }
        
        if (buffer.length > 0)
        {
            buffer.pop();
            this.cmdExecutor.doRequest(method, {properties:buffer.join("")}, wrapCallback2(this.setPropertiesCallback, this, true, [srcPropObj, callback, ctx, callbackParam]));
        }
        else if (this.agentInfo.phoneType == PhoneType.SIP_PHONE)
        {
            if (srcPropObj.idleflag != null)
            {
                this.stateInfo.isAutoIdle = ("1" == srcPropObj.idleflag);
            }
            
            if (srcPropObj.autoanswer != null)
            {
                this.stateInfo.isAutoAnswer = ("1" == srcPropObj.autoanswer);
            }
            
            if (callback)
            {
                callback.call(ctx, {result: ErrorCode.SUCCEEDED}, callbackParam);
            }
        }
        else if (callback)
        {
            callback.call(ctx, {result: ErrorCode.ILLEGAL_ARGUMENTS}, callbackParam);
        }
    };
    
    /**
     * 内部调用方法
     * 
     * @param {String} method 方法名
     * @param {Object} param 参数
     * @param {Function} callback 回调函数
     * @param {Object} ctx 上下文
     * @param {Object} callbackParam 回调参数
     */
    AgentClientImpl.prototype.internalInvoke = function(method, param, callback, ctx, callbackParam)
    {
        if (this.invokeInterceptors[method])
        {
            this.invokeInterceptors[method].call(this, method, param, callback, ctx, callbackParam);
        }
        else
        {
            this.cmdExecutor.doRequest(method, param, wrapCallback(callback, ctx, true, callbackParam));
        }
    };
    
    /**
     * 调用方法
     * 
     * @param {String} method 方法名
     * @param {Object} param 参数
     * @param {Function} callback 回调函数
     * @param {Object} ctx 上下文
     * @param {Object} callbackParam 回调参数
     */
    AgentClientImpl.prototype.invoke = function(method, param, callback, ctx, callbackParam)
    {
        if (!method)
        {
            if (callback)
            {
                callback.call(ctx, {result:ErrorCode.PARAM_REQUIRED}, callbackParam);
            }
            return;
        }
        
        if (this.workMode == AgentClientImpl.WorkMode.HostMode)
        {
            this.internalInvoke(method, param, callback, ctx, callbackParam);
        }
        else
        {
            this.clientMessageChannel.clientInvoke(method, param, wrapCallback(callback, ctx, true, callbackParam));
        }
    };
    
    /**
     * 设置属性
     * 
     * @param {Object} prop 属性对象
     * @param {Function} callback 回调函数
     * @param {Object} ctx 上下文
     * @param {Object} callbackParam 回调参数
     */
    AgentClientImpl.prototype.setProperties = function(prop, callback, ctx, callbackParam)
    {
        if (!prop)
        {
            if (callback)
            {
                callback.call(ctx, {result:ErrorCode.ILLEGAL_ARGUMENTS}, callbackParam);
            }
            return;
        }
        
        var buffer = new Array();
        
        for (var attr in prop)
        {
            buffer.push(attr);
            buffer.push("=");
            buffer.push(prop[attr]);
            buffer.push(";");
        }
        
        if (buffer.length > 0)
        {
            buffer.pop();
            this.internalInvoke("SetProperties", {properties : buffer.join("")}, callback, ctx, callbackParam);
        }
        else
        {
            if (callback)
            {
                callback.call(ctx, {result:ErrorCode.ILLEGAL_ARGUMENTS}, callbackParam);
            }
            return;
        }
    };
    
    AgentClientImpl.prototype.doSignOutCallback = function(ret, callback, ctx, callbackParam, async)
    {
        if (ret.result == ErrorCode.SUCCEEDED && this.agentInfo.phoneType == PhoneType.SIP_PHONE && async != null && !async)
        {
            this.sipPhoneExecutor.doRequest("JS_SipLogOff", null, function(sipRet){
                callCallback(callback, ctx, ret, callbackParam);
            }, async);
        }
        else
        {
            callCallback(callback, ctx, ret, callbackParam);
        }
    };
    
    AgentClientImpl.prototype.doSignOut = function(callback, ctx, callbackParam, async)
    {
        if (this.agentInfo.phoneType == PhoneType.SIP_PHONE && !this.stateInfo.sipLogout)
        {            
            this.cmdExecutor.doRequest("SignOut", null, wrapCallback(this.doSignOutCallback, this, true, callback, ctx, callbackParam, async), async);
        }
        else
        {
            this.cmdExecutor.doRequest("SignOut", null, wrapCallback(callback, ctx, true, callbackParam), async);
        }
    };
    
    AgentClientImpl.prototype.signOut = function(inAsync, inCallback, inCtx, inCallbackParam)
    {
        var async, callback, ctx, callbackParam;
        
        if (typeof(inAsync) == "boolean")
        {
            async = inAsync;
            callback = inCallback;
            ctx = inCtx;
            callbackParam = inCallbackParam;
        }
        else
        {
            async = true;
            callback = inAsync;
            ctx = inCallback;
            callbackParam = inCtx;
        }
        
        if (this.workMode == null || this.workMode == AgentClientImpl.WorkMode.ClientMode || !this.isLogined)
        {
            callCallback(callback, ctx, {result : ErrorCode.ILLEGAL_OP}, callbackParam);
            return;
        }
        
//        this.cmdExecutor.doRequest("SignOut", null, wrapCallback(callback, ctx, true, callbackParam), async);
        this.doSignOut(callback, ctx, callbackParam, async);
    };
    
    AgentClientImpl.prototype.startGetInitInfoHandler = function(e)
    {
        this.isIniting = true;  
    };
    
    AgentClientImpl.prototype.getInitInfoSucceededHandler = function(e)
    {
        this.isIniting = false;
        this.isInited = true;
        
        if (this.workMode == AgentClientImpl.WorkMode.HostMode)
        {
            localStorage.setItem(AgentClientImpl.WebStorageKeys.ZEROCFG_URL, this.zeroCfgExecutor.availableUrl);
        }
    };
    
    AgentClientImpl.prototype.getInitInfoFailedHandler = function(e)
    {
        this.isIniting = false;
        this.isInited = false;
        this.clientsInit(false);
    };
    
    AgentClientImpl.prototype.startSignInHandler = function(e)
    {
        this.isLogining = true;
    };
    
    AgentClientImpl.prototype.signInSucceededHandler = function(e)
    {
        this.isLogining = false;
        this.isLogined = true;
        
        if (this.workMode == AgentClientImpl.WorkMode.HostMode)
        {
            localStorage.setItem(AgentClientImpl.WebStorageKeys.AGENTSERVER_URL, this.cmdExecutor.availableUrl);
        }
        
        this.clientsInit(true);
    };
    
    AgentClientImpl.prototype.signInFailedHandler = function(e)
    {
        this.isLogining = false;
        this.isLogined = false;
        this.clientsInit(false);
    };
    
    AgentClientImpl.prototype.sipSignOffSuccHandler = function(e)
    {
        this.sipPhoneExecutor.dispose();
        this.sipPhoneExecutor = null;
    };
    
    /**
     * 状态改变事件
     * 
     * @param {CTIEvent} e CTI事件
     */
    AgentClientImpl.prototype.onCTIAgentStateChangedHandler = function(e)
    {
        this.stateInfo.state = parseInt(e.args.state, 10);
        this.stateInfo.previousState = parseInt(e.args.prevstate, 10);
        
        if (States.LOGOUT.isInclude(this.stateInfo.state))
        {
            this.isInited = false;
            this.isLogined = false;            
            
            if (this.workMode == AgentClientImpl.WorkMode.HostMode && this.agentInfo.phoneType == PhoneType.SIP_PHONE && !this.stateInfo.sipLogout)
            {
                this.sipPhoneExecutor.doRequest("JS_SipLogOff");
            }
        }
        else if (this.workMode == AgentClientImpl.WorkMode.HostMode && States.ADJUST_AFTERTALK.isInclude(this.stateInfo.state)
                && this.agentInfo.phoneType == PhoneType.SIP_PHONE && this.stateInfo.isAutoIdle)
        {
            this.cmdExecutor.doRequest("SetIdle");
        }
        
        this.storeWorkStatus();
    };
    
    /**
     * 服务器断开事件
     * 
     * @param {CTIEvent} e CTI事件
     */
    AgentClientImpl.prototype.serverDisconnectedHandler = function(e)
    {
        this.stateInfo.state = this.stateInfo.previousState;
        this.stateInfo.state = 1;
        this.isInited = false;
        this.isLogined = false;
        this.storeWorkStatus();
        
        if (this.workMode == AgentClientImpl.WorkMode.HostMode)
        {
            // 模拟状态改变事件
            this.eventBus.publish({
                eventName: Events.ON_CTIAGENTSTATUS_CHANGED,
                args : {
                    state : 1,
                    prevstate : this.stateInfo.previousState,
                    cause : 0
                }
            });
        }
    };
    
    /**
     * 请求Sip应答事件
     * 
     * @param {CTIEvent} e CTI事件
     */
    AgentClientImpl.prototype.onReqSipAnswerHandler = function(e)
    {
        if (this.agentInfo.phoneType == PhoneType.SIP_PHONE && this.workMode == AgentClientImpl.WorkMode.HostMode)
        {
            this.sipPhoneExecutor.doRequest("JS_SipAnswer");
        }
    };
    
    /**
     * 振铃事件
     * 
     * @param {CTIEvent} e CTI事件
     */
    AgentClientImpl.prototype.onRingingHandler = function(e)
    {
        if (this.agentInfo.phoneType == PhoneType.SIP_PHONE && this.workMode == AgentClientImpl.WorkMode.HostMode
                && e.args.called == this.agentInfo.bindPhone && this.stateInfo.isAutoAnswer)
        {
            this.sipPhoneExecutor.doRequest("JS_SipAnswer");
        }
    };
    
    /**
     * 挂机事件
     * 
     * @param {CTIEvent} e CTI事件
     */
    AgentClientImpl.prototype.onReleaseHandler = function(e)
    {
        if (this.agentInfo.phoneType == PhoneType.SIP_PHONE && this.workMode == AgentClientImpl.WorkMode.HostMode
                && e.args.dropee == this.agentInfo.bindPhone)
        {
            this.sipPhoneExecutor.doRequest("JS_SipHungup");
        }
    };
    
    /**
     * 多媒体能力改变事件
     * @param {CTIEvent} e CTI事件
     */
    AgentClientImpl.prototype.onMediaAbilityEventHandler = function(e)
    {
        this.stateInfo.mediaState = parseInt(e.args.value, 10);
        this.stateInfo.mediaType = parseInt(e.args.type, 10);
    };
    
    
    AgentClientImpl.prototype.addEventListener = function(eventNames, listener, inCtx, inCallbackParam)
    {
        var events = null, l, ctx, callbackParam;
        
        if (eventNames instanceof Array)
        {
            events = eventNames;
            l = listener;
            ctx = inCtx;
            callbackParam = inCallbackParam;
        }
        else if (typeof(eventNames) == 'string')
        {
            events = [eventNames];
            l = listener;
            ctx = inCtx;
            callbackParam = inCallbackParam;
        }
        else
        {
            l = eventNames;
            ctx = listener;
            callbackParam = inCtx;
        }
        
        if (events)
        {
            for (var i = 0; i < events.length; ++i)
            {
                this.eventBus.subscribe(events[i], l, ctx, callbackParam);
            }
        }
        else
        {
            this.eventBus.subscribe(null, l, ctx, callbackParam);
        }
    };
    
    AgentClientImpl.prototype.removeEventListener = function(listener)
    {
        this.eventBus.unSubscribe(listener);
    };
    
    AgentClientImpl.prototype.getAgentPhoneNO = function()
    {
        return this.agentInfo.bindPhone;
    };
    
    AgentClientImpl.prototype.getCallFlowNO = function()
    {
        return this.stateInfo.callFlowNO;
    };
    
    AgentClientImpl.prototype.getCaller = function()
    {
        return this.stateInfo.calling;
    };
    
    AgentClientImpl.prototype.getCallee = function()
    {
        return this.stateInfo.called;
    };
    
    AgentClientImpl.prototype.getState = function()
    {
        return {
            stateCode : this.stateInfo.state,
            previousStateCode : this.stateInfo.previousState
        };
    };
    
    AgentClientImpl.prototype.getCallId = function()
    {
        return this.stateInfo.callId;
    };
    
    AgentClientImpl.prototype.getUserData = function()
    {
        return this.stateInfo.userData;
    };
    
    AgentClientImpl.prototype.getAllUserData = function()
    {
        return this.stateInfo.callData;
    };
    
    AgentClientImpl.prototype.getMediaState = function()
    {
        return this.stateInfo.mediaState;
    };
    
    EventListenerHolder = function()
    {
        this.agentClient = agentClientInst;
        this.listeners = new Array();
    };
    
    EventListenerHolder.prototype.pushListener = function(origin, wrapped)
    {
        this.listeners.push({
            origin : origin,
            wrapped : wrapped
        });
    };
    
    EventListenerHolder.prototype.add = function(eventNames, listener, inCtx, inCallbackParam)
    {
        this.pushListener(listener);
        this.agentClient.addEventListener(eventNames, listener, inCtx, inCallbackParam);
    };
    
    EventListenerHolder.prototype.remove = function(listener)
    {
        var toRemove;
        for (var i = 0; i < this.listeners.length; ++i)
        {
            if (this.listeners[i].origin === listener)
            {
                toRemove = this.listeners[i].wrapped ? this.listeners[i].wrapped : listener;
                this.agentClient.removeEventListener(toRemove);
                
                this.listeners.splice(i, 1);
                --i;
            }
        }
    };
    
    EventListenerHolder.prototype.one = function(eventNames, listener, inCtx, inCallbackParam)
    {
        var l, ctx, callbackParam, wrapped;
        
        if (eventNames instanceof Array || eventNames instanceof String)
        {
            l = listener;
            ctx = inCtx;
            callbackParam = inCallbackParam;
        }
        else
        {
            l = eventNames;
            ctx = listener;
            callbackParam = inCtx;
        }
        
        wrapped = function(e) {
            this.agentClient.removeEventListener(arguments.callee);
            l.call(ctx, e, callbackParam);
        };
        
        this.pushListener(l, wrapped);        
        this.agentClient.addEventListener(eventNames, wrapped, this);
    };
    
    EventListenerHolder.prototype.clear = function()
    {
        var listener, toRemove;
        while (this.listeners.length > 0)
        {
            listener = this.listeners.shift();
            toRemove = listener.wrapped ? listener.wrapped : listener.origin;
            this.agentClient.removeEventListener(toRemove);
        }
    };
    
    AgentClientImpl.prototype.EventListenerHolder = EventListenerHolder;
    
    
    /**
     * 实现事件拦截器
     * @returns {EventInterceptor}
     */
    EventInterceptor = function(agentClientInst)
    {
        this.agentClient = agentClientInst;
        this._publishEvent = null;
        this.interceptMap = {};
    };
    
    /**
     * /**
     * 拦截指定事件,当回调函数interceptFun被触发时，会收到一个拦截器对象(Interceptor) 支持拦截链，可对同一事件进行多次拦截
     * 
     * <pre>
     *     拦截器定义：
     *     Interceptor = 
     *     {
     *         eventName : {String}  // 被拦截的事件名称
     *         eventArgs : {Array}   // 被拦截的事件附带参数
     *         abort : function()    // 终止事件广播，取消后续拦截器
     *         notify : function() // 广播事件，取消后续拦截器
     *         next : function() // 继续下一个拦截器，如果没有则广播事件
     *     }
     * </pre>
     * 
     * @param eventName {String}被拦截的事件名称
     * @param interceptFun {Function} 截获到事件后的处理函数,接收一个Interceptor对象
     * @return {Object} interceptPoint
     */
    EventInterceptor.prototype.intercept = function(eventName, interceptFun)
    { 

        var EventBus = this.agentClient.eventBus;

        // 拦截EventBus.publish方法
        if (!this._publishEvent)
        {
            var fn = this.bind(EventBus.publish, EventBus);
            this._publishEvent = fn;
            //将事件总线中的发布事件方法修改为拦截器中修改过的方法
            EventBus.publish = this.bind(this.publishEvent, this);
        }

        var interceptorChain = this.interceptMap[eventName];
        interceptorChain = (!interceptorChain) ? [] : interceptorChain;
        interceptorChain.push(interceptFun);
        this.interceptMap[eventName] = interceptorChain;
        
        return {"eventName" :eventName ,"interceptFun" : interceptFun };
    };
    
    /**
     * 移除拦截器
     * @param interceptPoint
     */
    EventInterceptor.prototype.rmvIntercept = function(interceptPoint)
    {
        var interceptorChain = this.interceptMap[interceptPoint.eventName];
        interceptorChain = (!interceptorChain) ? [] : interceptorChain;
        for(var i=0 ; i<interceptorChain.length;i++)
        {
            if(interceptPoint.interceptFun == interceptorChain[i])
            {
                interceptorChain.splice(i,1);
            }
        }
        this.interceptMap[interceptPoint.eventName] = interceptorChain;
    
    };
    
    /**
     * 替换EventBus.publishEvent方法
     */
    EventInterceptor.prototype.publishEvent=function(e)
    {
        var thisobj = this;
        var eventName = e.eventName;
        if (!this.interceptMap[eventName])
        {
            this._publishEvent(e);
            return;
        }

        // 创建Interceptor对象
        var interceptor =
        {
            eventName : e.eventName,
            eventArgs : e.args,

            // @private
            isAbort : false,
            fnList : [],

            // 终止拦截链，取消事件广播
            abort : function()
            {
                this.isAbort = true;
                this.fnList = [];
                return;
            },

            // 广播事件，终止拦截链
            notify : function()
            {
                this.isAbort = true;
                this.fnList = [];
                thisobj._publishEvent(e);
            },

            // 继续下一个拦截链
            next : function()
            {
                if (this.isAbort) return;

                if (this.fnList.length > 0)
                {
                    var fun = this.fnList.shift();
                    fun(this);
                }
                else
                {
                    this.notify();
                }
            }
        };

        var interceptorChain = [].concat(this.interceptMap[eventName]);
        if (interceptorChain)
        {
            interceptor.fnList = interceptorChain;
            interceptor.next();
        }
    };
    
    EventInterceptor.prototype.bind=function(fn, ctx)
    {
        return function()
        {
            return fn.apply(ctx, arguments);
        };
    };
    
    /**
     * 客户端的消息通道
     * 
     * @param {AgentClientImpl} agentClient AgentClient实例
     */
    function ClientMessageChannel(agentClient)
    {
        this.agentClient = agentClient;
        this.messageHandlers = {};
        this.hostWin = null;
        this.clientWins = new Array();
        this.clientInvocations = new Array();
        this.findingHost = false;
        
        this.initMessageHandlers();
        
        if (window.addEventListener)
        {
            window.addEventListener('message', wrapCallback(this.onMessageListener, this, true), false);
        }
        else
        {
            window.attachEvent("onmessage", wrapCallback(this.onMessageListener, this, true));
        }
    }
    
    /**
     * 消息通道名称 
     */
    ClientMessageChannel.MESSAGE_CHANNEL_NAME = "AgentClient";
    
    /**
     * 消息类型
     */
    ClientMessageChannel.MessageTypes = {
        ATTACH_CLIENT : "attachClient", // 挂接客户端
        ATTACH_RESPONSE : "attachResponse", // 挂接客户端的响应
        EVENT_TRANSIMISSION : "eventTransimission", // 传递事件
        CLIENT_INVOKE : "clientInvoke", // 客户机模式组件调用命令
        CLIENT_INVOKE_RESPONSE : "clientInvokeResponse", // 客户机模式组件调用命令的响应
        SYNC_AGENTINFO : "syncAgentInfo" // 同步用户信息
    };
    
    /**
     * ClientMessageChannel对象产生的事件
     */
    ClientMessageChannel.Events = {
        START_FIND_HOST : "StartFindHostAgentClient", // 查找宿主
        ATTACH_REQ_RECEIVED : "AttachRequstReceived", // 接收到挂接请求
        SEND_ATTACH_RESP : "SendAttachResponse", // 响应挂接请求
        HOST_FOUNDED : "HostFounded" // 查找到宿主
    };
    
    ClientMessageChannel.prototype.initMessageHandlers = function()
    {
        this.messageHandlers[ClientMessageChannel.MessageTypes.ATTACH_CLIENT] = this.attachClientHandler;
        this.messageHandlers[ClientMessageChannel.MessageTypes.ATTACH_RESPONSE] = this.attachResponseHandler;
        this.messageHandlers[ClientMessageChannel.MessageTypes.EVENT_TRANSIMISSION] = this.eventTransimissionHandler;
        this.messageHandlers[ClientMessageChannel.MessageTypes.CLIENT_INVOKE] = this.clientInvokeHandler;
        this.messageHandlers[ClientMessageChannel.MessageTypes.CLIENT_INVOKE_RESPONSE] = this.clientInvokeRespHandler;
        this.messageHandlers[ClientMessageChannel.MessageTypes.SYNC_AGENTINFO] = this.syncAgentInfoHandler;
    };
    
    /**
     * message事件监听函数
     * 
     * @param e 事件对象
     */
    ClientMessageChannel.prototype.onMessageListener = function(e)
    {
        if (e.data)
        {
            var parsed = JSON.parse(e.data);
            if (parsed && parsed.channel == ClientMessageChannel.MESSAGE_CHANNEL_NAME)
            {
                this.messageHandlers[parsed.data.msgType].call(this, parsed, e);
            }
        }
    };
    
    /**
     * 向上寻找处于宿主模式的AgentClient
     */
    ClientMessageChannel.prototype.findHost = function()
    {
        if (this.findingHost || this.hostWin)
        {
            return;
        }
        
        this.findingHost = true;
        this.agentClient.eventBus.publish({eventName: ClientMessageChannel.Events.START_FIND_HOST});
        
        var sendData = JSON.stringify({
            channel : ClientMessageChannel.MESSAGE_CHANNEL_NAME,
            data : {
                msgType : ClientMessageChannel.MessageTypes.ATTACH_CLIENT,
                url : _AgentClientWin_.location.href
            }
        });
        var currentWin = window;
        while (currentWin = getParentWindow(currentWin))
        {
            currentWin.postMessage(sendData, "*");
        }
    };
    
    /**
     * 处理挂接客户模式AgentClient消息的函数
     * 
     * @param sendData 发送的数据
     * @param e 事件对象
     */
    ClientMessageChannel.prototype.attachClientHandler = function(sendData, e)
    {
        this.agentClient.eventBus.publish({eventName: ClientMessageChannel.Events.ATTACH_REQ_RECEIVED, args: {url: sendData.data.url}});
        
        if (this.agentClient.workMode == AgentClientImpl.WorkMode.HostMode)
        {
            this.clientWins.push(e.source);
            
            this.agentClient.eventBus.publish({eventName: ClientMessageChannel.Events.SEND_ATTACH_RESP});
            
            e.source.postMessage(JSON.stringify({
                channel : ClientMessageChannel.MESSAGE_CHANNEL_NAME,
                data : {
                    msgType : ClientMessageChannel.MessageTypes.ATTACH_RESPONSE,
                    isIniting :  this.agentClient.isIniting,
                    isInited : this.agentClient.isInited,
                    isLogining : this.agentClient.isLogining,
                    isLogined : this.agentClient.isLogined,
                    stateInfo : this.agentClient.stateInfo,
                    agentInfo : this.agentClient.agentInfo,
                    url : _AgentClientWin_.location.href
                }
            }), "*");
        }
    };
    
    /**
     * 处理宿主AgentClient响应挂接消息的函数
     * 
     * @param sendData 返回的数据
     * @param e 事件对象
     */
    ClientMessageChannel.prototype.attachResponseHandler = function(sendData, e)
    {
        this.agentClient.eventBus.publish({eventName: ClientMessageChannel.Events.HOST_FOUNDED, args:{url: sendData.data.url}});
        
        this.findingHost = false;
        this.hostWin = e.source;
        this.agentClient.workMode = AgentClientImpl.WorkMode.ClientMode;
        
        this.agentClient.isAttaching = false;
        this.agentClient.isAttached = true;
        this.agentClient.isIniting = sendData.data.isIniting;
        this.agentClient.isInited = sendData.data.isInited;
        this.agentClient.isLogining = sendData.data.isLogining;
        this.agentClient.isLogined = sendData.data.isLogined;
        this.agentClient.stateInfo = sendData.data.stateInfo;
        this.agentClient.agentInfo = sendData.data.agentInfo;
        
        this.agentClient.storeWorkStatus();
        
        if (this.agentClient.isLogined)
        {
            this.agentClient.clientsInit(true);
        }
    };
    
    ClientMessageChannel.prototype.eventTransimissionHandler = function(sendData, e)
    {
        this.agentClient.eventBus.publish(sendData.data.event);
    };
    
    ClientMessageChannel.prototype.syncAgentInfoHandler = function(sendData, e)
    {
        this.agentClient.agentInfo = sendData.data.agentInfo;
    };
    
    ClientMessageChannel.prototype.clientInvokeHandler = function(sendData, e)
    {
        this.agentClient.internalInvoke(sendData.data.method, sendData.data.param, this.clientInvokeCallback, this, e.source);
    };
    
    ClientMessageChannel.prototype.clientInvokeRespHandler = function(sendData, e)
    {
        if (this.clientInvocations.length > 0)
        {
            var callback = this.clientInvocations.shift();
            if (callback)
            {
                callback(sendData.data.retVal);
            }
        }
    };
    
    ClientMessageChannel.prototype.clientInvokeCallback = function(ret, clientWin)
    {
        if (!clientWin.closed)
        {
            clientWin.postMessage(JSON.stringify({
                channel : ClientMessageChannel.MESSAGE_CHANNEL_NAME,
                data : {
                    msgType : ClientMessageChannel.MessageTypes.CLIENT_INVOKE_RESPONSE,
                    retVal : ret
                }
            }), "*");
        }
    };
    
    ClientMessageChannel.prototype.sendMsgToClients = function(data)
    {
        if (this.clientWins.length > 0)
        {
            var msg = JSON.stringify({
                channel : ClientMessageChannel.MESSAGE_CHANNEL_NAME,
                data : data
            });
            for (var i = 0; i < this.clientWins.length; ++i)
            {
                try
                {
                    if (this.clientWins[i].closed)
                    {
                        this.clientWins.splice(i, 1);
                        --i;
                    }
                    else
                    {
                        this.clientWins[i].postMessage(msg, "*");
                    }
                }
                catch (e)
                {
                    // 防止发生错误
                    this.clientWins.splice(i, 1);
                    --i;
                }
            }
        }
    };
    
    ClientMessageChannel.prototype.sendMsgToHost = function(data)
    {
        this.hostWin.postMessage(JSON.stringify({
            channel : ClientMessageChannel.MESSAGE_CHANNEL_NAME,
            data : data
        }), "*");
    };
    
    ClientMessageChannel.prototype.eventOccurred = function(e)
    {
        if (this.agentClient.workMode == AgentClientImpl.WorkMode.HostMode)
        {
            for (var attr in ClientMessageChannel.Events)
            {
                if (ClientMessageChannel.Events[attr] === e.eventName)
                {
                    return;
                }
            }
            
            this.sendMsgToClients({
                msgType : ClientMessageChannel.MessageTypes.EVENT_TRANSIMISSION,
                event : e
            });
            
            if (Events.START_GETINITINFO == e.eventName || Events.GET_INITINFO_SUCCEEDED == e.eventName)
            {
                this.sendMsgToClients({
                    msgType : ClientMessageChannel.MessageTypes.SYNC_AGENTINFO,
                    agentInfo : this.agentClient.agentInfo
                });
            }
        }
    };
    
    ClientMessageChannel.prototype.clientInvoke = function(method, param, callback)
    {
        this.clientInvocations.push(callback);
        this.sendMsgToHost({
            msgType : ClientMessageChannel.MessageTypes.CLIENT_INVOKE,
            method : method,
            param : param
        });
    };
    
    /**
     * 请求执行器
     * 
     * @param {String} urls 请求的URL列表
     * @param {AgentClientImpl} agentClient 关联的AgentClient对象
     * @param {Number} timeout 超时时间
     */
    function RequestExecutor(urls, agentClient, timeout)
    {
        this.request = new XMLHttpRequest();
        this.agentClient = agentClient;
        this.urls = urls;
        this.urlIdx = 0;
        this.availableUrl = null;
        this.timeout = timeout ? timeout : RequestExecutor.DEFAULT_TIMEOUT;
        this.invokeList = new Array();
        this.requesting = false;
        this.waitingCallback = null;
        this.isAbort = false;
    }
    
    /**
     * 默认超时时间
     */
    RequestExecutor.DEFAULT_TIMEOUT = 2000;
    
    /**
     * 
     * 
     * @type Number
     */
    RequestExecutor.failedTimeStamp = null;
    
    /**
     * 将普通对象按照HTTP的FORM参数形式进行编码
     * 
     * @param plainObject 编码的对象
     * @returns 编码后的字符串内容
     */
    RequestExecutor.prototype.plainObjectToQueryConetent = function(plainObject)
    {
        var buffer = new Array();
        
        for (var attr in plainObject)
        {
            buffer.push(attr);
            buffer.push("=");
            buffer.push(encodeURIComponent(plainObject[attr]));
            buffer.push("&");
        }
        
        if (buffer.length > 0)
        {
            buffer.pop();
        }
        
        return buffer.join("");
    };
    
    RequestExecutor.prototype.requestFailed = function()
    {
        if (RequestExecutor.failedTimeStamp)
        {
            var newTimeStamp = new Date().getTime();
            if ((newTimeStamp - RequestExecutor.failedTimeStamp) >= 60000)
            {
                this.agentClient.eventBus.publish({eventName: Events.SERVER_DISCONNECTED});
            }
        }
        else
        {
            RequestExecutor.failedTimeStamp = new Date().getTime();
        }
    };
    
    RequestExecutor.prototype.onReadyStateChange = function(url, queryContent, contentType, async)
    {
        if (this.request.readyState == 4)
        {
            if (this.request.status == 200)
            {
                RequestExecutor.failedTimeStamp = null;
                var respObj = this.decodeResponse(this.request.responseText);
                if (respObj.result == ErrorCode.SUCCEEDED)
                {
                    if (!this.availableUrl)
                    {
                        this.availableUrl = url;
                    }
                    //成功 执行返回结果处理
                    this.returnResult(respObj);
                }
                else if (this.availableUrl)
                {
                    this.returnResult(respObj);
                }
                else
                {
                	//同步请求时，需要新创建一个xmlhttpreq对象
                    if (async != null && !async)
                    {
                        this.request = new XMLHttpRequest();
                    }
                    //请求不成功，重试当前请求
                    setTimeout(function(){this.postRequest(queryContent, contentType, respObj.result, async);},1);
                }
            }
            else if (this.isAbort)
            {
                this.isAbort = false;
                this.returnResult({result : ErrorCode.REQ_ABORT});
            }
            else if (this.availableUrl)
            {
                this.requestFailed();
                this.returnResult({result : ErrorCode.REQUEST_FAILED});
            }
            else
            {
                this.requestFailed();
                
                if (async != null && !async)
                {
                    this.request = new XMLHttpRequest();
                }
                setTimeout(function(){ this.postRequest(queryContent, contentType, ErrorCode.REQUEST_FAILED, async);},1);
            }
        }
    };
    
    RequestExecutor.prototype.doNextInvoke = function()
    {
        if (this.invokeList.length > 0)
        {
            this.requesting = true;
            this.executeRequest.apply(this, this.invokeList.shift());
        }
    };
    
    /**
     * 执行请求
     * 
     * @param {String} method 方法名 
     * @param {Object} param 调用参数
     * @param {Function} callback 回调函数
     * @param {Boolean} async 异步请求,默认为true.
     */
    RequestExecutor.prototype.doRequest = function(method, param, callback, async)
    {
        if (!method)
        {
            callCallback(callback, null, {result:ErrorCode.PARAM_REQUIRED});
            return;
        }
        
        if (async == null || async)
        {
            var invokeEntity = new Array();
            for (var i = 0; i < arguments.length; ++i)
            {
                invokeEntity.push(arguments[i]);
            }
            this.invokeList.push(invokeEntity);
            
            if (!this.requesting)
            {
                this.doNextInvoke();
            }
        }
        else
        {
            this.syncRequest(method, param, callback, async);
        }
    };
    
    RequestExecutor.prototype.getNextURL = function()
    {
        if (this.urlIdx < this.urls.length)
        {
            return this.urls[this.urlIdx++];
        }
        else
        {
            this.urlIdx = 0;
            return null;
        }
    };
    
    RequestExecutor.prototype.postRequest = function(queryContent, contentType, lastError, async)
    {
        var url = this.availableUrl ? this.availableUrl : this.getNextURL();
        if (url)
        {
            this.request.open("POST", url, async == null ? true : async);
            
            if (async == null || async)
            {
                this.request.withCredentials = true;
                this.request.timeout = this.timeout;
            }
            
            this.request.setRequestHeader("Content-Type", contentType);
            this.request.onreadystatechange = wrapCallback(this.onReadyStateChange, this, false, url, queryContent, contentType, async);
            this.request.send(queryContent ? queryContent : "");
        }
        else
        {
            this.returnResult({result : lastError});
        }
    };
    
    RequestExecutor.prototype.returnResult = function(ret)
    {
        try{this.agentClient.lastErrorCode = ret.result;}catch(ex){}
        if (this.waitingCallback)
        {
            try
            {
                this.waitingCallback(ret);
            }
            catch(e)
            {
                // 防止回调函数中出错
            }
        }
     
        this.requesting = false;
        this.doNextInvoke();
    };
    
    RequestExecutor.prototype.dispose = function()
    {
        
    };
    
    /**
     * 执行命令的执行器
     * 
     * @param urls 请求的URL列表
     * @param agentClient 关联的AgentClient对象
     * @param timeout 超时时间
     */
    function CommandRequestExecutor(urls, agentClient, timeout)
    {
        RequestExecutor.call(this, urls, agentClient, timeout);
        this.invokingMethod = null;
        this.isGetEvent = false;
    }
    
    CommandRequestExecutor.prototype = new RequestExecutor();
    
    CommandRequestExecutor.prototype.executeRequest = function(method, param, callback, async)
    {
        this.waitingCallback = callback;
        this.invokingMethod = method;
        
        var buffer = new Array();
        buffer.push("reqname=");
        buffer.push(method);
        
        if (this.agentClient.stateInfo && this.agentClient.stateInfo.agentSessionId)
        {
            buffer.push("&session=");
            buffer.push(encodeURIComponent(this.agentClient.stateInfo.agentSessionId));
        }
        
        if ("GetInitInfo" != method)
        {
            buffer.push("&msgid=");
            buffer.push(this.agentClient.getMsgId());
        }
        
        if (param)
        {
            var paramSeg = this.plainObjectToQueryConetent(param);
            if (paramSeg)
            {
                buffer.push("&");
                buffer.push(paramSeg);
            }
        }
        
        this.postRequest(buffer.join(""), "application/x-www-form-urlencoded", null, async);
    };
    
    /**
     * Element元素转换为对象
     * 
     * @param {Element} ele 元素
     */
    CommandRequestExecutor.prototype.xmlEleToObject = function(ele)
    {
        var ret = {}, node, childNode;
        
        for (var i = 0; i < ele.childNodes.length; ++i)
        {
            node = ele.childNodes.item(i);
            
            if (node.nodeType != 1)
            {
                return null;
            }
            
            switch (node.childNodes.length)
            {
                case 0:
                    ret[node.nodeName.toLocaleLowerCase()] = "";
                    break;
                    
                case 1:
                    childNode = node.childNodes.item(0);
                    if (childNode.nodeType == 3 || childNode.nodeType == 4)
                    {
                        ret[node.nodeName.toLocaleLowerCase()] = childNode.nodeValue;
                    }
                    else
                    {
                        ret[node.nodeName.toLocaleLowerCase()] = this.xmlEleToObject(node);
                    }
                    break;
                    
                default:
                    ret[node.nodeName.toLocaleLowerCase()] = this.xmlEleToObject(node);
            }
        }
        
        return ret;
    };
    
    CommandRequestExecutor.prototype.decodeResponse = function(resp)
    {
        if (!resp)
        {
            return {result: ErrorCode.DECODE_RESP_FAILED};
        }
        
        var xmlDoc;
        
        try
        {
            if (window.DOMParser)
            {
                xmlDoc = new DOMParser().parseFromString(resp, "text/xml");
            }
            else
            {
                xmlDoc = new ActiveXObject( "Microsoft.XMLDOM" );
                xmlDoc.async = "false";
                xmlDoc.loadXML(resp);
            }
            
            var ret = {};
            
            if ("GetEvt" == this.invokingMethod)
            {
                if (xmlDoc.getElementsByTagName("eventname")[0].childNodes.length == 0)
                {
                    ret.eventName = "";
                }
                else
                {
                    ret.eventName = xmlDoc.getElementsByTagName("eventname")[0].childNodes[0].nodeValue;
                }
            }
            
            var bodyNode = xmlDoc.getElementsByTagName("body")[0];
            var retArgs = this.xmlEleToObject(bodyNode);
            
            var resultCode = parseInt(retArgs.result, 10);
            if (resultCode != ErrorCode.SUCCEEDED && "GetInitInfo" == this.invokingMethod)
            {
                resultCode += ErrorCode.GETINITINFO_STARTIDX;
            }
            else if (resultCode == ErrorCode.SUCCEEDED && "JS_SipLogOff" == this.invokingMethod)
            {
                this.agentClient.stateInfo.sipLogout = true;
                this.agentClient.eventBus.publish({eventName: Events.SIP_SIGNOFF_SUCC});
            }
            ret.result = resultCode;
            
            ret.args = retArgs;
                
            return ret;
        }
        catch(e)
        {
            return {result: ErrorCode.DECODE_RESP_FAILED};
        }
    };
    
    /**
     * 执行同步请求
     * 
     * @param {String} method 方法名
     * @param {Object} param 参数
     * @param {Function} callback 回调函数
     * @param {Boolean} async 是否异步
     */
    CommandRequestExecutor.prototype.syncRequest = function(method, param, callback, async)
    {
        var executor;
        
        if (this.availableUrl)
        {
            executor = new CommandRequestExecutor([this.availableUrl], this.agentClient, this.timeout);
        }
        else
        {
            executor = new CommandRequestExecutor(this.urls, this.agentClient, this.timeout);
        }
        
        executor.invokeList.push([method, param, callback, async]);
        executor.doNextInvoke();
    };
    
    CommandRequestExecutor.prototype.getEventCallback = function(ret)
    {
        if (this.agentClient.isLogined && ret.result != ErrorCode.REQ_ABORT
                && (ret.eventName != Events.ON_CTIAGENTSTATUS_CHANGED || !States.LOGOUT.isInclude(parseInt(ret.args.state, 10))))
        {
            this.startGetEvent();
        }
        
        if (ret.eventName)
        {
            this.agentClient.eventBus.publish(ret);
        }
    };
    
    CommandRequestExecutor.prototype.startGetEvent = function()
    {   
        if (!this.isGetEvent)
        {
            this.isGetEvent = true;
            
            if (window.addEventListener)
            {
                window.addEventListener('unload', wrapCallback(this.dispose, this, false), false);
            }
            else
            {
                window.attachEvent("onunload", wrapCallback(this.dispose, this, false));
            }
        }
        
        this.doRequest("GetEvt", null, wrapCallback(this.getEventCallback, this, true));
    };
    
    CommandRequestExecutor.prototype.dispose = function()
    {
        if (this.request)
        {
            this.isAbort = true;
            this.request.abort();
        }
        
        this.request = null;
    };
    
    function WebWorkerRequestExecutor(urls, agentClient, timeout, sessionId, isUseMsgId)
    {
        RequestExecutor.call(this, urls, agentClient, timeout);
        this.request = null;
        this.invocationSeq = 0;
        this.workerEventHandlers = {};
        this.initHandler();
        this.worker = new Worker(this.getScriptURL());
        this.worker.addEventListener("message", wrapCallback(this.workerEventListener, this, true));
        this.worker.postMessage({
            method : WebWorkerRequestExecutor.METHODS.INIT,
            param : {
                urls : urls,
                timeout : timeout,
                sessionId : sessionId,
                isUseMsgId : isUseMsgId,
                ErrorCode : ErrorCode,
                Events : Events
            }
        });
    }
    
    WebWorkerRequestExecutor.prototype = new RequestExecutor();
    
    WebWorkerRequestExecutor.DEFAULT_TIMEOUT = 5000;
    
    WebWorkerRequestExecutor.SCRIPTREGX = /^(.*\/)?AgentClient\.js$/;
    
    WebWorkerRequestExecutor.SCRIPTNAME = "WebWorkerRequestExecutor.js";
    
    WebWorkerRequestExecutor.METHODS = {
            INIT : "init", // 初始化
            DOREQUEST : "doRequest", // 请求
            POST_REQUEST : "postRequest", // 发送请求
            RETURN_RESULT : "returnResult", // 返回结果
            PUBLISH_EVENT : "publishEvent", // 发布事件
            START_GETEVENT : "startGetEvent", // 启动获取事件
            REFRESH_AVAILABLE_URL : "refreshAvailableURL" // 刷新可用URL
        };
    
    WebWorkerRequestExecutor.prototype.getScriptURL = function()
    {
        var nodes = document.head.childNodes, matcher, ret = null;
        
        for (var i = 0; i < nodes.length; ++i)
        {
            if (nodes[i].nodeType == 1 && nodes[i].nodeName.toLowerCase() == "script")
            {
                matcher = WebWorkerRequestExecutor.SCRIPTREGX.exec(nodes[i].src);
                if (matcher)
                {
                    if (matcher[1])
                    {
                        ret = matcher[1] + WebWorkerRequestExecutor.SCRIPTNAME;
                    }
                    else
                    {
                        ret = WebWorkerRequestExecutor.SCRIPTNAME;
                    }
                    break;
                }
            }
        }
        
        return ret;
    };
    
    WebWorkerRequestExecutor.prototype.initHandler = function()
    {
        this.workerEventHandlers[WebWorkerRequestExecutor.METHODS.RETURN_RESULT] = this.returnResultHandler;
        this.workerEventHandlers[WebWorkerRequestExecutor.METHODS.PUBLISH_EVENT] = this.publishEventHandler;
        this.workerEventHandlers[WebWorkerRequestExecutor.METHODS.REFRESH_AVAILABLE_URL] = this.refreshAvailableURLListener;
    };
    
    WebWorkerRequestExecutor.prototype.returnResultHandler = function(data)
    {
        try{this.agentClient.lastErrorCode = data.param.retVal.result;}catch(ex){};
        var reqInfo = this.invokeList[data.param.requestId];
        
        if (reqInfo.method == "JS_SipLogOff" && data.param.retVal.result == ErrorCode.SUCCEEDED)
        {
            this.agentClient.stateInfo.sipLogout = true;
            this.agentClient.eventBus.publish({eventName: Events.SIP_SIGNOFF_SUCC});
        }
        
        if (reqInfo.callback)
        {
            if (reqInfo.method == "GetInitInfo" && data.param.retVal.result != ErrorCode.SUCCEEDED)
            {
                data.param.retVal.result = data.param.retVal.result + ErrorCode.GETINITINFO_STARTIDX;
            }
            
            try
            {
                reqInfo.callback(data.param.retVal);
            }
            catch (e)
            {
                // 防止回调函数出错
            }
        }
        
        delete this.invokeList[data.param.requestId];
    };
    
    WebWorkerRequestExecutor.prototype.publishEventHandler = function(data)
    {
        this.agentClient.eventBus.publish(data.param);
    };
    
    WebWorkerRequestExecutor.prototype.workerEventListener = function(e)
    {
        this.workerEventHandlers[e.data.method].call(this, e.data, e);
    };
    
    WebWorkerRequestExecutor.prototype.refreshAvailableURLListener = function(data)
    {
        this.availableUrl = data.param;
    };
    
    WebWorkerRequestExecutor.prototype.getInvocationSeq = function()
    {
        ++this.invocationSeq;
        if (this.invocationSeq > 65535)
        {
            this.invocationSeq = 0;
        }
        
        return this.invocationSeq;
    };
    
    /**
     * 执行同步请求
     * 
     * @param {String} method 方法名
     * @param {Object} param 参数
     * @param {Function} callback 回调函数
     * @param {Boolean} async 是否异步
     */
    WebWorkerRequestExecutor.prototype.syncRequest = function(method, param, callback, async)
    {
        var executor;
        
        if (this.availableUrl)
        {
            executor = new CommandRequestExecutor([this.availableUrl], this.agentClient, this.timeout);
        }
        else
        {
            executor = new CommandRequestExecutor(this.urls, this.agentClient, this.timeout);
        }
        
        executor.invokeList.push([method, param, callback, async]);
        executor.doNextInvoke();
    };
    
    /**
     * 
     * @param {String} method
     * @param {Object} param
     * @param {Function} callback
     * @param {Boolean} async
     */
    WebWorkerRequestExecutor.prototype.doRequest = function(method, param, callback, async)
    {
        if (async == null || async)
        {
            var buffer = new Array();
            buffer.push("reqname=");
            buffer.push(encodeURIComponent(method));
            
            if (this.agentClient.stateInfo && this.agentClient.stateInfo.agentSessionId)
            {
                buffer.push("&session=");
                buffer.push(encodeURIComponent(this.agentClient.stateInfo.agentSessionId));
            }
            
            buffer.push("&msgid=");
            buffer.push(this.agentClient.getMsgId());
            
            if (param)
            {
                var paramSeg = this.plainObjectToQueryConetent(param);
                if (paramSeg)
                {
                    buffer.push("&");
                    buffer.push(paramSeg);
                }
            }
            
            var requestId = this.getInvocationSeq() + "_" + new Date().getTime();
            
            this.invokeList[requestId] = {
                requestId : requestId,
                method : method,
                param : param,
                callback : callback
            };
            
            this.worker.postMessage({
                method : WebWorkerRequestExecutor.METHODS.DOREQUEST,
                param : {
                    requestId : requestId,
                    content : buffer.join("")
                }
            });
        }
        else
        {
            this.syncRequest(method, param, callback, async);
        }
    };
    
    WebWorkerRequestExecutor.prototype.startGetEvent = function()
    {
        this.worker.postMessage({
            method : WebWorkerRequestExecutor.METHODS.START_GETEVENT
        });
    };
    
    WebWorkerRequestExecutor.prototype.dispose = function()
    {
        if (this.worker)
        {
            this.worker.terminate();
            this.worker = null;
        }
    };
    
    /**
     * @returns RequestExecutor
     */
    function getRequestExecutor(urls, agentClient, timeout, sessionId, isUseMsgId)
    {
        if (window.Worker)
        {
            return new WebWorkerRequestExecutor(urls, agentClient, timeout, sessionId, isUseMsgId);
        }
        else
        {
            return new CommandRequestExecutor(urls, agentClient, timeout);
        }
    }
    
    function SipPhoneRequestExecutor(urls, agentClient, timeout, sessionId)
    {
        this.cmdExecutor = getRequestExecutor(urls, agentClient, WebWorkerRequestExecutor.DEFAULT_TIMEOUT, sessionId, true);
        this.eventExecutor = getRequestExecutor(urls, agentClient, timeout, sessionId, true);
//        this.cmdExecutor = new CommandRequestExecutor(urls, agentClient, WebWorkerRequestExecutor.DEFAULT_TIMEOUT);
//        this.eventExecutor = new CommandRequestExecutor(urls, agentClient, timeout);
    }
    
    SipPhoneRequestExecutor.prototype = new RequestExecutor();
    
    SipPhoneRequestExecutor.prototype.doRequest = function(method, param, callback, async)
    {
        this.cmdExecutor.doRequest(method, param, callback, async);
    };
    
    SipPhoneRequestExecutor.prototype.startGetEvent = function()
    {
        this.eventExecutor.startGetEvent();
    };
    
    SipPhoneRequestExecutor.prototype.dispose = function()
    {
        if (this.cmdExecutor)
        {
            this.cmdExecutor.dispose();
            this.cmdExecutor = null;
        }
        
        if (this.eventExecutor)
        {
            this.eventExecutor.dispose();
            this.eventExecutor = null;
        }
    };
    
    // 构造AgentClient对象
    AgentClient = agentClientInst = new AgentClientImpl(isTop);
})();