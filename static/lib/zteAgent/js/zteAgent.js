/*******************************************************************************
 * 座席对外暴露的接口, 注：下划线开头的方法为private
 * ZteAgent.regEvent(eventName,handler) 
 * ZteAgent.unregEvent(id)
 * ZteAgent.getState()
 * ZteAgent.isCalling()
 * ZteAgent.log(msg,level)
 * ZteAgent.xxx() // 话务相关方法，请参考ZteAgent.methods
 ******************************************************************************/
var ZteAgent =
{
    DEF_CFG_NAME  : "AGT_CONFIG", // 默认配置名称
    currState : 0, // 当前状态
    currMediaState:999, //当前媒体状态 默认示忙
    agtAdapter : null , // 适配器
    agtType:null, //坐席类型 sipphone，pcphone
    baseUrl : "", // 应用路径
	agtInfo : null, // 座席信息
	isFirstLogin : true, // 是否首次登录？
	isLogined:false,
	initialReady:false, //是否自动示闲
	autoAnswer:false, //默认非自动应答
	confManager:null, //会议管理器
	isShowLocalVideoWindow:false,
	callInStartTime:null, //座席接入通话或者振铃开始时间
	currentCallId:null,  //当前呼叫ID
	 // 登录成功后的回调函数列表
    onLoginedFnList : [],
    onInitedFnList:[],
	  /**
     * 注册初始成功后回调函数
     * 
     * @param fn
     * @private
     */
    onLogined : function(fn)
    {
    	if(this.isLogined && fn) fn();
        this.onLoginedFnList.push(fn);
    },
    /**
     * 注册inited成功回调函数
     * 指ZteAgent js资源加载初始化完成
     * @param fn
     */
    onInit:function(fn)
    {
    	if(this.isLogined && fn) fn();
        this.onInitedFnList.push(fn);
    },
    /**
     * 初始化方法
     * 资源加载及与本地已签入的坐席同步连接和状态，如果没有登录的坐席，回调函数返回false
     * @param op{type:xxxx,lang:xxx}
     * @param cbFun(isSucc, desc){}
     */
    init : function(op, cbFun)
		{
			var thisObj = this;
			ZteAgent.onInit(function()
			{
				var type = op.type;
				if (!ZteAgent[type])
					throw "座席类型“" + op.type + "”不支持!";
				thisObj.agtType = type;
				thisObj.agtAdapter = new ZteAgent[type]();
				thisObj._adapterMthods(); // 适配方法

				thisObj.agtAdapter.init(op.lang, function(isSucc, err)
				{
					if (!isSucc)
					{
						if (cbFun)
							cbFun(isSucc, err);
						return;
					}
					// 调用适配器会议管理器初始化方法初始化会议管理器
					ZteAgent.confManager = ZteAgent._invokeAdapter(
							"_initConferenceManager", []);

					ZteAgent._adapterEvents(); // 适配事件
					ZteAgent.syncCurState();
					ZteAgent.isFirstLogin = false;
					ZteAgent.isLogined = true;
					ZteAgent.notifyOnLogined();

					ZteAgent._invokeAdapter("getAgtInfo", [ op.agtId ],
							function(agt) // 获取登录用户信息
							{
								ZteAgent.agtInfo = agt;
								if (cbFun)
									cbFun(isSucc, err);
							});
				});
			});
		},
    /**
	 * ZteAgent通知登录成功函数
	 * 
	 * @private
	 */
    notifyOnLogined : function()
    {
    	try{
        for ( var i = 0; i < this.onLoginedFnList.length; i++)
        {
            this.onLoginedFnList[i]();
        }
    	}catch(e){
    		ZteAgent.log("notifyOnlogined error."+ JSON.stringify(e), "error");
    	}
    },
    
    /**
     * ZteAgent 初始化完成通知函数
     */
    notifyOnInited:function()
    {
    	try{
            for ( var i = 0; i < this.onInitedFnList.length; i++)
            {
                this.onInitedFnList[i]();
            }
        	}catch(e){
        		ZteAgent.log("notifyOnInited error."+ JSON.stringify(e), "error");
        	}
    },
	/**
	* 对外暴露的接口，由适配器进行实现。
	* ZteAgent.xxx()进行调用， 参数直接透传给适配器
	*/
	methods : [  
				"idle",
				"busy",
				"answer",
				"hangUp",
			    "releaseCall",
				"hold",
				"cancelHold",
				"callAgt",
				"callUser",
				"makeCall",
				"sendMsg",
				"adjust",
				"cancelAdjust",
				"conference",
				"singleStepConf",
				"consultTransfer",
				"singleStepTransfer",
				"succTransfer",
				"setAnswerType",
				"consult",
				"startShareServer", 
		        "stopShareServer", 
		        "changeRemoteShareType", 
				"setMediaIdle",
				"setMediaBusy",
				"imSendMsg",
				"imTransfer",
				"imCancelTransfer",
				"imOutSide",
				"imSnapShot",
			    "imEnd",
				"setIsShowLocalVideoWindow",
				"createConference",
				"addMemberInConference",
				"releaseMemberInConference",
				"endConference",
				"regConferenceEventHandler",
                "reconnect",
                "alternate",
                "getStateNameByCode",
                "setVideoWindow",
				"invokeAINF",
				"invokeHINF",
				"regAINFEvent",
				"unRegAINFEvent",
				"clearCallToAutoService",
				"syncCurState",
				"getCallID",
				"getAllPartsPhoneNo",
				"getCurrentAllParts",
                "getCallMediaType",
				"getAgentPhoneNO",
				"getCallFlowNO",
				"getUserData",
				"getCallData",
				"getCallingNO",
				"getCalledNO",
				"getLastErrorCode",
				"getVersion",
				"resetSkill",
				"sendDTMF",
				"setPhoneMute",
				"setSvcData",
				"getSvcData",
				"getAgtIdByAcnt",
				"setVideoWindowEx",
				"getRecordRelatedInfo",
				"playMsWave",
				"ctrlMsWave",
				"stopMsWave",
			    "getImSvcData",
				"setImSvcData",
				"beginCoach",
				"endCoach"
				], 	
	/**
	* 对外广播的事件，由适配器进行适配.  
	* 适配器实现onXxxx方法，并且在该方法中调用ZteAgent.publishEvent("onxxx",[arg1,arg...])发布事件。
	*/
	events : [  
				"onStateChanged",
                "onCTIAgentStateChanged",                
				"onRinging",
			    "onTalking",
				"onRelease",
				"onFailCause18X",				
                "onSetPreIdleSuccess",
                "onSetPreBusySuccess",				
			    "onReturnFromIVR", 
			    "onConsultBack",			    
				"onConference",
				"onSnapShotCall",				
				"onMessage",				
				"onTransfered",
				"onSingleTransfered",				
				"onShareStart",
				"onShareStop",
				"onShareTypeChange",								
				"onImBeginReqReceived",
				"onImMsgSendFail",
				"onImMsgReceived",
				"onImTransfered",
				"onImConfMember",
				"onImEnd",
				"onMediaAbilityEvent",								
				"onFullListenNotify",
				"onInsert",
				"onBeIntercepted",
				"onForceLock",
				"onForceBusy",
				"onForceIdle",
				"onForceOut",				
				"onRecord",
				"onPlayEnd",				
				"onQueueWarning",
				"onTerminalFail",
				"onCtiReport",
				"onDataBaseModeChanged",
				"onBeginRecordSuccess",
				"onNetworkException",
				"onMasterChanged"
	         ],
    /**
     * 初始化
     * 
     * @param baseUrl 应用路径
     * @private
     */
    _init : function(baseUrl)
    {
		this.baseUrl = baseUrl;
		var arr=[
             baseUrl+"js/adapter/sipphone.js",
			 baseUrl+"js/utils/json2.js",
			 baseUrl+"js/utils/zteUtils.js",
			 baseUrl+"js/utils/hashMapUtil.js",
			 baseUrl+"js/extend/zteAgent-ScreenRec.js"
			 ];	
        ZteAgent.script.loadJs(arr,function()
        {
            ZteAgent.notifyOnInited();
        });
    },
    
	
	/**
	* 调用适配器方法
	*/
	_invokeAdapter : function(methodName, argArr,cbfun)
	{
		var adapter = this.agtAdapter;
		if(!adapter[methodName])
		{
			ZteAgent.log("适配器未实现'"+methodName+"()'方法","warn");
			return;
		}
		var arg = Object.prototype.toString.call(argArr) == "[object Array]"?argArr:[argArr];
		arg.push(cbfun);
		var ret =  adapter[methodName].apply(adapter, arg);
		ZteAgent.log(">>> ZteAgent."+methodName+"(), args="+JSON.stringify(arg),"info");
		return ret;
	},
    
	/**
	* 适配接口(对外暴露的话务方法)
	*/
	_adapterMthods : function()
	{
		var adapter = this.agtAdapter;
		var methods=this.methods;
		var createFun = function(adapter,m)
		{
			if(!adapter[m])
			{
				ZteAgent.log("适配器未实现'"+m+"()'方法","warn");
			}
			return function()
			{
				if(!adapter[m])
				{
					ZteAgent.log("适配器未实现'"+m+"()'方法","warn");
					return;
				}
				var ret =  adapter[m].apply(adapter, arguments);
				var arr=[];
				for(var i=0;i<arguments.length;i++){arr.push(arguments[i]);}
				ZteAgent.log(">>> ZteAgent."+m+"(), args="+JSON.stringify(arr),"info");
				return ret;
			};
		};
		for(var i=0;i<methods.length;i++)
		{
			var m = $.trim(methods[i]);
			if(this[m]===undefined)
			{
				ZteAgent.log("create method : ZteAgent."+ m+"()","debug");
				ZteAgent[m] = createFun(adapter, m);
			}else
			{
				this.log("Method['"+m+"'] already exist","warn");
			}
		}
	},

    /**
     * 适配事件
     * 
     * @private
     */
	_isAdapterEvent : false, 
    _adapterEvents : function(isForce)
    {
		if( (!isForce) && this._isAdapterEvent)
		{
			return;
		}
		
		this._isAdapterEvent=true;
		var adapter = this.agtAdapter;
		var events=this.events;
		for(var i=0;i<events.length;i++)
		{
			var e = $.trim(events[i]);
			if(adapter[e]===undefined)
			{
				ZteAgent.log("适配器未对事件'"+e+"()'进行适配！","warn");
				continue;
			}
			
			ZteAgent.log("adapter Event : "+ e,"debug");
			this.agtAdapter[e]();
		}
    },
	
	/**
	*初始化组件
	*/
	lazyLoading:function(op,cbFun){
		
        var type = op.type;
        if(!ZteAgent[type]) throw "座席类型“"+op.type+"”不支持!";
		
        this.agtAdapter =  new ZteAgent[type]();
		this._adapterMthods(); // 适配方法
		
        this.agtAdapter._lazyLoading(op,function(isSucc,err)
		{
			if(cbFun) cbFun(isSucc,err); 
		});
	},
    	
    /**
     * 签入
     */
    signIn : function(cbFun)
    {
		var op = ZteAgent.signInCfgObj;
        var type = op.type;
        if(!ZteAgent[type]) throw "座席类型“"+op.type+"”不支持!";
		
        this.agtAdapter =  new ZteAgent[type]();
		//this._adapterMthods(); // 适配方法
		
        this.agtAdapter.signIn(op,function(isSucc,err)
		{
			if(!isSucc)
			{
				if(cbFun) cbFun(isSucc,err); 
				return;
			}
			
			 //调用适配器会议管理器初始化方法初始化会议管理器
	        ZteAgent.confManager = ZteAgent._invokeAdapter("_initConferenceManager",[]);
	        
			ZteAgent._adapterEvents(); // 适配事件
			ZteAgent.syncCurState();
			ZteAgent.isFirstLogin = false;
			ZteAgent.isLogined = true;
			ZteAgent.notifyOnLogined();

			ZteAgent._invokeAdapter("getAgtInfo",[op.agtId],function(agt) // 获取登录用户信息
			{
				ZteAgent.agtInfo = agt;
				if(cbFun) cbFun(isSucc,err); 
			})
		});
		
    },
	
    	

    /**
     * 签出系统
     */
    signOut : function(cbFun)
    {
    	 this._isAdapterEvent = false;
    	 this.agtAdapter.signOut(function(isSucc, desc)
    	{
    		 if(isSucc)
    		 {
    				ZteAgent.onLoginedFnList = []; 
    		 }else
    		 {
    			 ZteAgent.log("signOut failed.[" + desc+"]", "error");
    		 }
    		if(cbFun) cbFun(isSucc,desc); 
    	 });
    //  this.agtAdapter.signOut.apply(this.agtAdapter, arguments);
    },
	
	/**
	*注销系统
	*/
	lazySignOut : function(cbFun)
    {
    	this._isAdapterEvent = false;
    	 this.agtAdapter.lazySignOut(function(isSucc, desc)
    	{
    		 if(isSucc)
    		 {
    				ZteAgent.onLoginedFnList = []; 
    		 }else
    		 {
    			 ZteAgent.log("lazySignOut failed.[" + desc+"]", "error");
    		 }
    		if(cbFun) cbFun(isSucc,desc); 
    	 });
    },
    
    /**
     * 获取状态
     */
    getState : function()
    {
        return ZteAgent.currState;
    },
    /**
     * 获取坐席当前实时媒体状态
     */
    getMediaState:function()
    {
    	return ZteAgent.currMediaState;
    },
    /**
     * 获取座席当前通话媒体类型
     * @returns
     */
    getMediaType:function()
    {
        return ZteAgent.currMediaType;
    },
	
	 /**
     * 发布事件
     * @param eventName
     * @param args
     */
    publishEvent : function(eventName, args)
    {
        ZteAgent.log("<<< "+eventName+" , args=["+JSON.stringify(args)+"]", "info");
        if(eventName=="onStateChanged")
        {
            ZteAgent.currState = args[0];      
        }
        if(eventName=="onMediaAbilityEvent")
        {
        	ZteAgent.currMediaState = args[1];
        }
        //记录接入坐席通话振铃或接入通话开始时间
        if ( args[0] == 300 ||  args[0] == 312)
        {
        	ZteAgent.callInStartTime = new Date().getTime();
        }
        //通话状态下记录当前通话的的callid
        if (args[0] >= 300 && args[0] < 400)
        {
            ZteAgent.getCallID(0, function(callid)
             {
                  ZteAgent.currentCallId = callid; 
             }); 
        }
        
    	// 被转接时重新查询一次callid，解决状态变化时查询的callid没有更新的问题
        if(eventName == "onTransferred")
        {
            if(ZteAgent.agtType == 'sipphone')
            {
                ZteAgent.invokeAINF("QueryCallIDOnAgent", [ZteAgent.getAgtInfo().agtId], function(callid)
                        {
                            ZteAgent.currentCallId = callid;
                        });
            }else if(ZteAgent.agtType == 'pcphone')
            {
                ZteAgent.invokeAgentClientINF("getCallId",{}, function(callid)
                       {
                         ZteAgent.currentCallId = callid; 
                      }); 
            }
        }
        
        ZteAgent.EventBus.dispatchEvent(eventName, args);
		setTimeout(function()
		{
			ZteAgent.EventBus.dispatchEvent("onEvent", [eventName,args]);
		},0);
    },
    
    /**
     * 注册事件处理函数
     * 
     * @param {String} 事件名称
     * @param {function} 事件回调函数
     * @public
     */
    regEvent : function(eventName, eventHandler)
    {
        return this.EventBus.addEventListener(eventName, eventHandler);
    },

    /**
     * 取消由regEvent注册的事件
     * 
     * @param eh {int} regEvent返回的句柄
     * @public
     */
    unregEvent : function(id)
    {
        this.EventBus.removeEventListener(id);
    },

    /**
     * 获取座席信息
     * 
     * @return {agtid, phone,vcid}
     * @public
     */
    getAgtInfo : function()
    {
		ZteAgent.agtInfo =(!ZteAgent.agtInfo)?{}:ZteAgent.agtInfo;
/*		ZteAgent.agtInfo["agtStatus"] = ZteAgent.getState();
*/		ZteAgent.agtInfo["agtState"] = ZteAgent.getState();
        return ZteAgent.agtInfo;
    },

	/**
	* 是否通话中？
	*/
	isCalling : function()
	{
		var state = ZteAgent.getState();
		return (state>=300 && state<=310) || state==317; // 317教练状态
	},
    
    /**
     * 注册适配器
     * 
     * @param name {String}
     * @param adapter {class}
     * @public
     */
    regAdapter : function(name, adapter)
    {
        var obj = {};
        obj[name] = adapter;
        ZteAgent.extend(obj);
    },
    
    /**
     * 
     * 
     * @param fn
     * @param ctx
     * @public
     */
    bind : function(fn, ctx)
    {
        return function()
        {
            return fn.apply(ctx, arguments);
        };
    },

    /**
     * 记录日志,日志内容将保存到服务器，并以登录账号为文件名
     * 
     * @param msg {String}日志内容
     * @param level {String}日志级别("debug, info,warn,error")
     * @public
     */
    log : function(msg, level)
    {
         ZteAgent.logger.console_log(level, msg);
    },
	
	/**
	* 获取工具条js目录http://ip:port/js/zteAgent
	*/
	getBaseUrl : function()
	{
		return ZteAgent.baseUrl;
	},
    
    /**
     * 扩展ZteAgent方法,为了安全起见，不允许覆盖原有的方法、属性. 如果实在需要覆盖，请直接用ZteAgent.xxx方式。
     * 
     * @param obj
     * @returns
     * @public
     */
    extend : function(obj)
    {
        for ( var i in obj)
        {
            if (!(ZteAgent[i] === undefined))
            {
                var errMsg = "扩展失败！不允许覆盖ZteAgent的方法或属性: ZteAgent." + i;
                alert(errMsg);
                throw errMsg;
                return;
            }
            ZteAgent[i] = obj[i];
        }
    },
	  /**
     * TODO 使用localstoreage实现数据缓存
     */
    buffer :
    {
    	calldataKeyPrefix:"callDataKey_",
        /**
         * 保存变量
         * 
         * @param key {String}
         * @param value {String}
         * @param cbFun {function}
         */
        saveValue : function(key, value)
        {
            var inkey = this.calldataKeyPrefix+key;
       	    localStorage.setItem(inkey,JSON.stringify(value));
        },

        /**
         * 获取指定变量
         * 
         * @param key {String}
         * @param cbFun {function}
         */
        getValue : function(key)
        { 
        	var inkey = this.calldataKeyPrefix+key;
        	return JSON.parse(localStorage.getItem(inkey));
   	    },

        /**
         * 获取所有变量,返回json对象
         * 
         * @param cbFun {function}
         */
        getAllValues : function()
        {
        	var resultArray = new Array();
        	var storage = window.localStorage; 
        	for (var i=0, len = storage.length; i < len; i++)
        	{
        	 var key = storage.key(i); 
        	 var value = JSON.parse(storage.getItem(key)); 
        	 resultArray.push({key:value});
        	}
        	return resultArray;
        },

        /**
         * 删除变量
         * 
         * @param key {String}
         * @param cbFun {function}
         */
        delValue : function(key)
        {
        	localStorage.removeItem(key);
        },

        /**
         * 删除内存中全部数据
         * 
         * @param cbFun {function}
         */
        delAllValues : function()
        {
        	localStorage.clear();
        }
    }
};

 /*******************************************************************************
 * 缺省按钮配置, 其他配置放在config.js中供用户修改 
 * btn = 
 * { 
 *     
 *     init     :   {function} 按钮初始化函数
 *     disable  :   {String}   按钮可用时，显示的html字符串 
 *     enable   :   {String}   按钮禁用时，显示的html字符串 
 *     hide     :   {function} 函数返回true时隐藏按钮， false显示 
 *     click    :   {function} 按钮被点击后的行为 
 *     getState :   {function} 获取按钮状态，返回0~2数字。(0禁用，1启用，2隐藏) 
 * }
 * 上述{function}参数定义为： void function(btn)
 *  其btn参数为按钮对象由ZteAgent.CallBtnManager._createBtn()方法返回的对象，
 *   btn={id,type,state,_el,update,refresh}，
 ******************************************************************************/
ZteAgent._defBtnCfg = {         
	// 签入
	SIGNIN : 
	{
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState : function(btn){return (ZteAgent.getState() <10)?1:0; }  // [未登录0,1,2,3]状态下可用
	},
	
	// 签出
	SIGNOUT : 
	{
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState :  _createGetBtnStateFun([100,101,103,104,105,108,111,200, 317, 400]) // 
	},
	
	// 服务
	SERVICE : {
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState : function(btn) // 状态码100~199时，按钮可用
		{
			var state = ZteAgent.getState();
			return (state >=100 && state<105)? 1 : 0 ; 
		 } 
	},
	/**
	 * 媒体示闲
	 */
	MEDIA_IDLE:
	{
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState : function(btn)
				{
					var mediaState = ZteAgent.getMediaState();
					var state = _createGetBtnStateFun([
					       							200, 100, 103, 104, 105, 107, 108, 109, 110, 111,
					    							300, 301, 302, 303, 304, 305, 306, 309, 310, 311,
					    							312, 313, 317, 400 ])();
					return (mediaState >= 1 && mediaState <= 999 && state) ? 1 : 0;
				} 
	},
	/**
	 * 媒体示忙
	 */
	MEDIA_BUSY:
	{
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState : function(btn)
				{
					var mediaState = ZteAgent.getMediaState();
					var state = _createGetBtnStateFun([
					       							200, 100, 103, 104, 105, 107, 108, 109, 110, 111,
					    							300, 301, 302, 303, 304, 305, 306, 309, 310, 311,
					    							312, 313, 317, 400 ])();
					return (mediaState >= 1001 && mediaState <= 1999 && state) ? 1 : 0;
				} 
	},
	// 示忙
	BUSY : {
		init : function(btn){btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState : _createGetBtnStateFun([200, 108, 109, 300, 302, 303, 304,  309, 310, 317, 400]) // 示闲状态下按钮可用，其他状态不可用
	},
	
	// 示闲
	IDLE : {
		init : function(btn)
		{ 
			ZteAgent.regEvent("onSetPreBusySuccess",function()
			{
				// btn.update();
			});
			ZteAgent.regEvent("onSetPreIdleSuccess",function()
			{
				// btn.state = 2; //
				// btn.refresh();
			});
			btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; 
		},
		hide : function(btn){ return false; },
		getState : _createGetBtnStateFun([105, 107, 108, 111, 317, 400,401]) // 示忙状态下按钮可用，其他状态不可用
	},
	
	// 应答
	ANSWER : {
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState : _createGetBtnStateFun([312 ]) //
	},
	
	// 呼出
	CALLOUT : {
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; }, 
		getState : _createGetBtnStateFun([ 201,200,202,203, 105, 304, 310, 400]) // 通话态，空闲态、整理态下按钮可用，其他状态不可用
	},
	
	// 保持
	HOLD : {
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState : _createGetBtnStateFun([300,302 ]) //通话态下按钮可用,其他状态不可用
	},
	
	// 恢复
	REHOLD : {
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState : _createGetBtnStateFun([304 ]) // 保持态下按钮可用，其他状态不可用
	},
	//转接
	TRANSFER : {
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState : _createGetBtnStateFun([300,  302, 303, 306, 307]) //咨询态下按钮可用，其他状态下不可用
	},
	
	// 整理
	ADJUST : {
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState : _createGetBtnStateFun([200, 107, 300, 301, 302, 303, 304, 304, 305, 306, 307, 308, 309, 310, 313,  317 ]) 
	},
	
	// 取消整理
	CHANCEL_ADJUST : {
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState : _createGetBtnStateFun([304, 304, 305, 306, 307, 308, 309, 317, 400,401]) //
	},
	
	// 咨询
	CONSULT : {
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState : _createGetBtnStateFun([300, 302]) // 通话状态可用，其他状态不可用
	},
	
	// 挂机
	HANGUP : {
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState : _createGetBtnStateFun([107,300, 301, 302, 303, 304, 304, 305, 306, 307, 308, 309, 310, 312, 313, 314, 316, 315, 317])
	},
	
	// 会议功能
	CONFERENCE : {
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState: function(btn){
			//会议主持人会议按钮可用
			if(ZteAgent.confManager!=null && ZteAgent.confManager.isConfMaster!=null && ZteAgent.confManager.isConfMaster==true)
			{
				 //105,200,201,202,203,标准版中屏蔽法援演示的非通话状态下会议功能可用
				var state = _createGetBtnStateFun([300, 302, 303,305,306, 307, 308])();
				return (state) ? 1 : 0;
			}else
			{
				 //105,200,201,202,203,标准版中屏蔽法援演示的非通话状态下会议功能可用
				var state = _createGetBtnStateFun([300, 302, 303,306, 307, 308])();
				return (state) ? 1 : 0;
			}
		}
	},
	//webchat
	WEBCHAT:{
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState : function(btn){
			var state = _createGetBtnStateFun([
			       							200, 100, 103, 104, 105, 107, 108, 109, 110, 111,
			    							300, 301, 302, 303, 304, 305, 306, 309, 310, 311,
			    							312, 313, 317, 400 ])();
			return (state) ? 1 : 0;
		}
	},//wechat
	WECHAT:{
		init : function(btn){ btn.state =  ZteAgent.CallBtnManager.STATE_DISABLE; },
		hide : function(btn){ return false; },
		getState : function(btn){
			var state = _createGetBtnStateFun([
			       							200, 100, 103, 104, 105, 107, 108, 109, 110, 111,
			    							300, 301, 302, 303, 304, 305, 306, 309, 310, 311,
			    							312, 313, 317, 400 ])();
			return (state) ? 1 : 0;
		}
	}
};

/*******************************************************************************
 * 按钮管理
 * ZteAgent.CallBtnManager.initUI()  创建并显示按钮
 * ZteAgent.CallBtnManager._createBtn()  创建按钮对象
 * ZteAgent.CallBtnManager.update(type)  更新“指定类型按钮"或"全部按钮"的状态
 * ZteAgent.CallBtnManager.getBtns(type)  获取指定类型按钮列表
 * ZteAgent.CallBtnManager.getBtn(id) 获取指定按钮  
 * ZteAgent.CallBtnManager.regBtn(type,btn)  注册按钮到类型
 ******************************************************************************/
//  创建获取当前按钮状态的方法， 该方法根据座席状态获取按钮状态。
function _createGetBtnStateFun(enableStates)
{
    var fun = function(btn) // btn对象是createBtn返回的对象{id,type}
    {           
        var curState = ZteAgent.getState();
        for(var i=0;i<enableStates.length;i++)
        {
            if(enableStates[i]+"" == curState)
            {
                return  ZteAgent.CallBtnManager.STATE_ENABLE;;
            }
        }
        return ZteAgent.CallBtnManager.STATE_DISABLE;
    };
    return fun;
}
ZteAgent.CallBtnManager =
{
    STATE_DISABLE : 0, // 按钮状态：停用
    STATE_ENABLE  : 1, // 按钮状态：启用
    STATE_HIDE    : 2, // 按钮状态：隐藏
    _typeBtnMap : {},  // {map<String,List>} 类型按钮映射列表
    _idBtnMap : {}, // id，按钮映射
    
    // 初始化界面
    initUI : function(baseUrl)
    {
        ZteAgent.log("ZteAgent.CallBtnManager.initUI()","info");
        var this_ = this;
        var getCfg = function(el)
        {
            var defOpt = ZteAgent.DEF_CFG_NAME;
            var opt = $(el).attr("agt-cfg");
            opt = !opt? defOpt : opt;
            var cfg = window[opt];
            if(!cfg)
            {
                ZteAgent.log("Configuration does not exist. el="+$(this).get(0).outerHTML, "error");
                return null;
            }
            return cfg;
        };
              
        // 预处理agt-btnBar
        $("*[agt-btnBar]").each(function()
        {
            var cfg =getCfg(this);
			var $bar = $(cfg.btnBar);
			var defOpt = ZteAgent.DEF_CFG_NAME;
            var opt = $(this).attr("agt-cfg");
            opt = !opt? defOpt : opt;
			$bar.find("*[agt-btn]").each(function()
			{
				if(!$(this).attr("agt-cfg"))
				{
					$(this).attr("agt-cfg",opt);
				}
			});
			
            $(this).html($bar);

        });      
        
        // 创建按钮
        var id = 100; 
        $("*[agt-btn]").each(function()
        {
            var cfg = getCfg(this);
            var type = $.trim($(this).attr("agt-btn"));
			var btnOpt = cfg.btns[type] || window[ZteAgent.DEF_CFG_NAME].btns[type] ; // 如果自定义配置文件中没有此按钮类型，则从config.js中取。
            if (!btnOpt)
            {
				ZteAgent.log("Unknown button type. " + $(this).get(0).outerHTML, "error");
				return;
            }
            id++;
            $(this).attr("agt-id", id);
			var agtClick = $(this).attr("agt-click");
			var agtClickFun = null;
			if(agtClick)
			{
				agtClickFun = ZteAgent.bind(new Function(agtClick), $(this).get(0));
			}
            this_._createBtn(type, btnOpt, id, agtClickFun, this);
        });
        
        // 监听状态切换事件，刷新按钮状态
        ZteAgent.regEvent("onStateChanged", function()
        {
        	//会议态自动隐藏本地视频窗口，其他状态恢复
        	 if(ZteAgent.currState*1 == 305*1)
             {
             	ZteAgent.setIsShowLocalVideoWindow(false,false);
             	localStorage.setItem("modifyisShowLocalVideoWin","true");
             }else
             {
            	 var v = JSON.parse(localStorage.getItem("isShowLocalVideoWin"));
            	 var isModify = JSON.parse(localStorage.getItem("modifyisShowLocalVideoWin"));
            	 if(isModify != null && isModify==true)
            	 {
            		 ZteAgent.log("reset isShowLocalVideo window property:" + v , "info");
                 	ZteAgent.setIsShowLocalVideoWindow(v,true);
            	 }
             }
            ZteAgent.bind(ZteAgent.CallBtnManager.update, ZteAgent.CallBtnManager)(); 
        });
        
        ZteAgent.regEvent("onMediaAbilityEvent", function()
        {
        	ZteAgent.bind(ZteAgent.CallBtnManager.update, ZteAgent.CallBtnManager)(); 
        });
    },
	
    
        
    /**
     * 创建话务按钮
     * 
     * @param type {String} 按钮类型，见TYPE_XXX定义
     * @param cfg {init,disable,enable,hide,click,getState} 按钮配置，config.js中定义, 
     * @param id {int} 按钮唯一标识 
	 * @param clickFun {function} 通过agt-click自定义的点击事件
     * @param parentEl {HTMLElement}
     * @return {update,onclick,state,refresh,_getState,type,_enable,_disable,_hide,_el,_cfg,_init}
     */
    _createBtn : function(type,cfg,id, clickFun, parentEl)
    {
        if(!cfg)
        {
            ZteAgent.log("Call button configuration errors！ type="+type,"error");
            return null;
        }
		
		// 自定义的配置和config.js进行合并（click,hide属性）（config.js#AGT_CONFIG.btns[btnType]）
		var cfgName = $(parentEl).attr("agt-cfg");
        if(cfgName != ZteAgent.DEF_CFG_NAME)
		{
			var defCfg = window[ZteAgent.DEF_CFG_NAME].btns[type];
			if(!defCfg)
            {
               ZteAgent.log("按钮类型["+type+"]在config.js中未定义!", "warn");
            }else
			{
				var attrs = "hide,click".split(",");
				for(var i=0;i<attrs.length;i++)
				{
				   var attr = attrs[i];
				   if(defCfg[attr]===undefined)
				   {
					   continue;
				   }
				   cfg[attr] = (cfg[attr]===undefined)?defCfg[attr]:cfg[attr];
				}
			}
		}
		
        // 合并用户配置和系统配置
        var defCfg = ZteAgent._defBtnCfg[type];
        defCfg = (!defCfg)?{}:defCfg;
        var opt ={};
        var attrs = "init,enable,disable,hide,click,getState".split(",");
        for(var i=0;i<attrs.length;i++)
        {
           var attr = attrs[i];
           if(cfg[attr]===undefined && defCfg[attr]===undefined)
           {
               ZteAgent.log("按钮类型["+type+"]，缺少配置项'"+attr+"'", "error");
               continue;
           }
           opt[attr] = (cfg[attr]===undefined)?defCfg[attr]:cfg[attr];
        }
		
		// 用agt-click自定义点击事件替代配置文件中的click文件。
		if(clickFun)
		{
			opt.click = clickFun;
		}
        
        var btn=
        {
            id : id,
            type : type,
            state : 0,
            _el : parentEl,
            _isEnable : false,
            _cfg : opt, 
            _init : function()
            {
                this._cfg.init(this);
                this.refresh();
            },
            _hide : function()
            {
                $(this._el).hide();
                this._isEnable = false;
            },
            _enable : function()
            {
                $(this._el).show();
                $(this._el).html(this._cfg.enable);
                this._isEnable = true;
            },
            _disable : function()
            {
                $(this._el).show();
                $(this._el).html(this._cfg.disable);
                this._isEnable = false;
            },
            onclick : function()
            {
                if(this._isEnable)
                {
                    // 按钮点击后，禁用0.5秒钟，然后恢复状态。
                    this._disable();
                    var this_ = this;
                    setTimeout(function()
                    {
                        this_.refresh();
                    }, 500);
					
					this._cfg.click(this);
                }else
                {
                    ZteAgent.log("The button is not available.", "debug");
                }
            },
            refresh : function()
            {
                switch(this.state)
                {
                    case ZteAgent.CallBtnManager.STATE_DISABLE:
                        this._disable();
                        break;
                        
                    case ZteAgent.CallBtnManager.STATE_ENABLE:
                        this._enable();
                        break;
                        
                    case ZteAgent.CallBtnManager.STATE_HIDE :
                        this._hide();
                        break;
                        
                    default:
                        this._disable();
                }
            },
            update : function()
            {
                var state = ZteAgent.CallBtnManager.STATE_DISABLE;
                if(this._cfg.hide(this)) // 是否隐藏？
                {
                    state = ZteAgent.CallBtnManager.STATE_HIDE;
                }else
                {
                   state = this._cfg.getState(this); //  调用配置中的getState方法到按钮状态
                }
                
                this.state = state;
                this.refresh();
            }
        };
        var fun = ZteAgent.bind(btn.onclick, btn);
        $(parentEl).unbind( "click" );
        $(parentEl).bind("click", fun);   
        
        this._idBtnMap[id] = btn;
        this.regBtn(type, btn);
        btn._init();
        btn.update();
        
        return btn;
    },
    
    update : function(type)
    {
        var list=[];
        if(type)
        {
            list = [].concat(this._typeBtnMap[type]);
        }else
        {
            for(var i in this._typeBtnMap)
            {
                list = list.concat(this._typeBtnMap[i]);
            }
        }
        if(!list) return;
        for(var i=0;i<list.length;i++)
        {
            list[i].update();
        }
    },
	
	getBtns : function(type)
	{
		return [].concat(this._typeBtnMap[type]);
	},
	
	getBtn : function(id)
	{
		for(var i in this._typeBtnMap)
		{
			for(var k=0;k<this._typeBtnMap[i].length;k++)
			{
				if(this._typeBtnMap[i][k].id==id)
				{
					return this._typeBtnMap[i][k];
				}
			}
		}
		return null;
	},
    
    regBtn :function(type,btn)
    {
        var list = this._typeBtnMap[type];
        list = (!list)?[]:list;
        list.push(btn);
        this._typeBtnMap[type] = list;
    }	
};

/*******************************************************************************
 * 事件管理
 * ZteAgent.EventBus.dispatchEvent(eventName, args)  分发事件
 * ZteAgent.EventBus.addEventListener(eventName, eventHandler)    监听
 * ZteAgent.EventBus.removeEventListener(id) 移除监听
 * ZteAgent.EventBus.removeAllEventListener() 移除全部监听
 ******************************************************************************/
ZteAgent.EventBus =
{
    eventHanderMap : {},
    interceptMap : {}, 
    idHandlerMap : {},
    index : 2000, 
    
    /**
     * 广播事件
     */
    dispatchEvent : function(eventName, args)
    {
        var funList_ = this.eventHanderMap[eventName];
        if (funList_ == null) return;
        var funList = funList_.concat(new Array());
        for ( var f = 0; f < funList.length; f++)
        {
            var _fun = funList[f];
            // IE跨页面调用时，传过来的function类型变成了object类型
            if (!(typeof _fun == "function" || typeof _fun == "object"))
            {
                continue;
            }
            // 处理js或vbs传过来的arguments
            var jsArgs = null;
            try
            {
                if (args != null && typeof args == 'object' && typeof args.length == 'number')
                {
                    jsArgs = args;
                }
                else
                {
                    jsArgs = args.toArray();
                }
            }
            catch (e)
            {
                jsArgs = null;
            }
            try
            {
                if (jsArgs == null)
                {
                    _fun.apply(_fun.prototype);
                }
                else
                {
                    // 强制转换参数为数组，（IE跨页面调用方法时，参数全部变成object类型）
                    jsArgs_ = new Array();
                    for ( var i = 0; i < jsArgs.length; i++)
                    {
                        jsArgs_[i] = jsArgs[i];
                    }

                    if (typeof _fun == "function")
                    {
                        _fun.apply(window, jsArgs_);
                    }
                    else
                    {
                        _fun.call(window, jsArgs_);
                    }
                }
            }
            catch (e)
            {
                ZteAgent.log("publish event[e=" + eventName + ",args=" + args + "] error!" + e);
            }
        }
    },

    /**
     * 注册监听事件
     * 
     * @param {String} 事件名
     * @param {Function} 事件处理函数
     * @public
     */
    addEventListener : function(eventName, eventHandler)
    {
        var funList = this.eventHanderMap[eventName];
        if (funList == null)
        {
            funList = new Array();
        }
        funList.push(eventHandler);
        this.eventHanderMap[eventName] = funList;
        this.index ++;
        this.idHandlerMap[this.index] = [eventName, eventHandler];
        return this.index;
    },

    /**
     * 移除注册监听
     * 
     * @param {String} 事件名
     * @param {Function}事件处理函数，这里需要同传入handler的引用保持一致
     * @public
     */
    removeEventListener : function(id)
    {
		if(!this.idHandlerMap[id]) return;
        var eventName = this.idHandlerMap[id][0];
        var eventHandler = this.idHandlerMap[id][1];
        this.idHandlerMap[id]=null;
        
        var funList = this.eventHanderMap[eventName];
        if (!funList) return;
        for (var i = 0; i < funList.length; i++)
        {
            if (funList[i] == eventHandler)
            {
                this.eventHanderMap[eventName].splice(i, 1);
            }
        }
    },

    /**
     * 移除所有注册监听
     * 
     * @public
     */
    removeAllEventListener : function()
    {
        this.eventHanderMap = {};
    }

};

/*******************************************************************************
 * 日志
 ******************************************************************************/
ZteAgent.logger =
{
    trace : true,
    level : 'info', // debug:1,
    httpLogger : null, // jslog.jsp
    _levelMap :
    {
        'debug' : 1,
        'info' : 2,
        'warn' : 4,
        'error' : 5
    },
    _checkLevel : function(methodName)
    {
        var curLevel = this._levelMap[this.level];
        return this._levelMap[methodName] >= curLevel;
    },
    
    log : function(level, msg)
    {
        this.console_log(level, msg);
        this.http_log(level, msg);
    },
    
    http_log : function(level,msg)
    {
        if(window["zte"] && window["zte"]["HttpLogger"]) // jslog
        {
            this.httpLogger = (!this.httpLogger)?new zte.HttpLogger():this.httpLogger;
            var agt = ZteAgent.getAgtInfo();
            var logFileName = !agt?"zteAgent":"zteAgent_"+agt.agtid; 
            this.httpLogger.log(args.join(","),methodName, logFileName);
        }
    },
    
    console_log : function(level, args)
    {
        if (!window.console) return;
        var method = console[level];
        if (!method) return;
        if (typeof method === 'function')
        {
            console[level](args);
        }
        else
        { // 兼容ie8的console
            method([args]);
        }
    }
};

/*******************************************************************************
 * 脚本加载
 ******************************************************************************/
ZteAgent.script=
{        
    loadjsMap : {},
    /**
     * 加载js（异步）
     * 
     * @param url
     * @param callback
     * @returns
     * @private
     */
    load : function(url, callback)
    {
        if (this.loadjsMap[url])
        {
            if (callback) callback();
            return;
        }
        var done = false;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.language = 'javascript';
        script.src = url;
        var thisobj = this;
        thisobj.loadjsMap[url] = true;
        script.onload = script.onreadystatechange = function()
        {
            if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete'))
            {
                done = true;
                thisobj.loadjsMap[url] = true;
                script.onload = script.onreadystatechange = null;
                if (callback)
                {
                    callback.call(script);
                }
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    },

    /**
     * 按顺序加载js文件
     * 
     * @param urlArr
     * @returns
     * @private
     */
    loadJs : function(urlArr, fn)
    {
        if (urlArr.length < 1)
        {
            if (fn) fn();
            return;
        }
        var obj = this;
        var url = urlArr.shift();
        this.load(url, function()
        {
            obj.loadJs(urlArr, fn);
        });
    }
};

/*******************************************************************************
 * 脚本加载
 ******************************************************************************/
ZteAgent.css=
{     
		addCSS: function (url) {
		    var link = document.createElement('link');
		    link.type = 'text/css';
		    link.rel = 'stylesheet';
		    link.href = url;
		    document.getElementsByTagName("head")[0].appendChild(link);
		},
    loadCssMap : {},
    /**
     * 加载js（异步）
     * 
     * @param url
     * @param callback
     * @returns
     * @private
     */
    load : function(url, callback)
    {
        if (this.loadCssMap[url])
        {
            if (callback) callback();
            return;
        }
        
        var link = document.createElement('link');
        link.rel="stylesheet";
        link.type = 'text/css" ';
        link.href = url;
        var thisobj = this;
        thisobj.loadCssMap[url] = true;
        link.onload = link.onreadystatechange = function()
        {
            if (!done && (!link.readyState || link.readyState == 'loaded' || link.readyState == 'complete'))
            {
                done = true;
                thisobj.loadCssMap[url] = true;
                link.onload = link.onreadystatechange = null;
                if (callback)
                {
                    callback.call(link);
                }
            }
        };
     /*   link.onload = function()
        {
            if (!done)
            {
                done = true;
                thisobj.loadjsMap[url] = true;
                link.onload  = null;
                if (callback)
                {
                    callback.call(link);
                }
            }
        };*/
        document.getElementsByTagName("head")[0].appendChild(link);
    },

    /**
     * 按顺序加载Css文件
     * 
     * @param urlArr
     * @returns
     * @private
     */
    loadCss : function(urlArr, fn)
    {
        if (urlArr.length < 1)
        {
            if (fn) fn();
            return;
        }
        var obj = this;
        var url = urlArr.shift();
        this.load(url, function()
        {
            obj.loadCss(urlArr, fn);
        });
    }
};
/*******************************************************************************
 * 页面加载完成后，初始化座席工具条
 ******************************************************************************/
(function()
{
    var scripts = document.getElementsByTagName('script');
    var url = "";
    for ( var i = 0; i < scripts.length; i++)
    {
        var src = scripts[i].src;
        if (!src) continue;
        var m = src.match(/js\/zteAgent\.js(\W|$)/i);// 判断文件是否含有zteAgent.js
        if (m)
        {
            url = src.substring(0, m.index);
        }
    }
	
	if (!window.jQuery) // 如果没有jquery则自动加载
	{
		ZteAgent.script.load(url+"/js/utils/jquery.min.js", function()
		{
			$(function(){ ZteAgent._init(url); });
		});
	}
	else
	{
		$(function(){ ZteAgent._init(url); });
	}
    
})();

/**
 * 解码CTI参数格式
 * 
 * @param {String} param 参数字符串
 * @returns {Object} 解析出的参数对象
 */
function decodeCTIParam(param)
{    
    var key, value, callDataObj = {};
    
    if (!param)
    {
        return callDataObj;
    }

    for (var startIndex = 0, eqIdx = param.indexOf('=', startIndex), semiIdx; eqIdx > -1; eqIdx = param
            .indexOf('=', startIndex))
    {
        key = param.substring(startIndex, eqIdx).toLowerCase();

        // 随路数据中us是最后一个关键且其内容也可能会带=和;所以做特殊处理
        if (key === "us")
        {
            value = param.substring(eqIdx + 1);
            callDataObj[key] = value;
            break;
        }

        semiIdx = param.indexOf(';', eqIdx);

        if (semiIdx > -1)
        {
            startIndex = semiIdx + 1;
            value = param.substring(eqIdx + 1, semiIdx);
        }
        else
        {
            startIndex = param.length;
            value = param.substring(eqIdx + 1);
        }

        callDataObj[key] = value;
    }

    return callDataObj;
}


/**
 * 判断一个字符串中是否以target字符串结尾
 * @param src
 * @param target
 * @returns {Boolean}
 */
function endWith(src, target)
{
    var pos = src.lastIndexOf(target);
    if(pos === -1){
        return false;
    }else{
        return pos + 3 === src.length;
    }
}