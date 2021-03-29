/**
 * 
 */
WebAgent =
{
    // 版本号
    version : "1.02.02",

    // 版本修改时间
    verDate : "2011/08/19",

    // 默认语言
    defaultLan : "zh_CN",

    // 已经支持的国际化
    languageCode : "en,zh_CN".split(","),

    // 语言
    language : "",

    // 是否登录成功
    isReady : false,
	
	isLazySignout: false,

    // 是否初始化成功（事件长连接注册成功）
    isInit : false,

    // 是否重复初始化（反复掉用initOCX,释放资源时可能会用到）
    isReInit : false,

    // 是否异常退出（业务模块中加载座席时，该值同样为true）
    isAbnormalExit : false,

    // 是否登录模块（调用Signin方法）
    isLoginModule : false,
    
    // 长连接模块是否已经加载
    isLiveConnectionModuleLoaded : false,
    
    // 长连接模块
    liveConnectionComponent : null,

    // 签入后的回调函数列表
    readyList : [],

    // 初始成功后的回调函数列表
    onInitFnList : [],

    // Web座席js基本路径
    base : "",

    // 已经加载过的js
    loadjsMap : {},

    // 操作员基本信息 {oid,pwd,vcid,type}
    operator : null,

    // 登录选项{heartbeatLiveConnection,oid,pwd,vcid,type,cfgUrl,lang,webchat,video,onSucc,onError}
    sgininOption : {},

    // 状态管理器
    stateMan : null,

    // 心跳请求间隔时间(s)
    heartbeatTime : 0,

    // 心跳默认时间
    heartbeatDefaultTime : 30,

    // 心跳timeoutID
    heartbeatTimeoutID : null,
    
    // 心跳开始时间,用于计算js阻塞时长
    heartbeatStartTime : 0,

    // 方法调用列表队列，保证方法调用先后顺序Array<{method,args,fun,isDoing,queueTime,startTime,endTime}>
    invokerList : [],

    ocx : null,
    
    // 日志模块号id
    logNameID_ : "",
    
    // 当前页面所在的Window对象
    $window : window,

    /**
     * 初始化（供业务模块初始化时调用）
     * 
     * @param op {Object}
     * 
     * <pre>
     *      参数op项说明: 
     *      lang(String) 语言en=英文，zh-CN=中文 
     *      onSucc(Function) 签入成功回调函数 function(isLogged) 
     *      onError(Function) 签入失败回调函数 function(errcode,errMsg)
     * </pre>
     * 
     * @public
     */
    init : function(op)
    {
    	if(this.isInit)
    	{
    		WebAgent.warn("WebAgent has been initialized, no need to initialize");
    		if (op.onSucc) op.onSucc(this.isLogged());
    		return;
    	}
    	
        var thisobj = this;
        this.isLoginModule = false;
        this.isReady = false;
        this.initOCX(function(isSucc)
        {
            if (isSucc)
            {
            	thisobj.initLog(thisobj.isLoginModule);
            	thisobj.setFixedUrlParam(thisobj.isLoginModule);
                thisobj.getAgtInfoFromAinf(function(agt)
                {
                    // 如果已经登录？
                    if (agt)
                    {
                        WebAgent.info("Operator has logged in!" + [ agt.oid, agt.vcid ]);
                        thisobj.isReady = true;
                        thisobj.syncCurState(function(state_)
                        {
                            thisobj.notifyReady();
                            if (op.onSucc) op.onSucc(true);
                        });
                    }
                    // 如果尚未登录？
                    else
                    {
                        setTimeout(function()
                        {
                            thisobj.stateMan = (!thisobj.stateMan) ? new WebAgent.StateManager() : thisobj.stateMan;
                            thisobj.stateMan.changedState(WebAgent.State.notLogin);
                            if (op.onSucc) op.onSucc(false);
                        }, 0);

                        // 当签入成功后, 进行初始化操作
                        var initOnSigninSucc = function()
                        {
                            WebAgent.debug("Operator login successfully!");
                            thisobj.getAgtInfoFromAinf(function(agt)
                            {
                            	thisobj.isReady = true;
                                thisobj.notifyReady();
                                WebAgent.EventHelper.notify("OnSignInSuccess", [ state_ ]);
                            });
                        };

                        // 1.监听登录成功事件 、状态切换事件
                        // 2.拦截OnSignInSuccess事件，保证核心库初始化完成后再对外广播
                        WebAgent.info(" WebAgent.init() , Operator does not log in!");
                        var aop = WebAgent.EventHelper.intercept("OnSignInSuccess", function(interceptor)
                        {
                            WebAgent.debug("[webagent.js] Intercept Event：" + interceptor.eventName + ", args="
                                    + interceptor.eventArgs);
                            interceptor.abort();
                            WebAgent.EventHelper.rmvIntercept(aop);
                            initOnSigninSucc();
                        });

                        var eh = new WebAgent.EventHelper();
                        eh.regOneTimeEvent("OnCTIAgentStateChanged", function()
                        {
                            initOnSigninSucc();
                        });
                    }
                });
            }
            else
            {
                // 初始化失败
                if (op.onError) op.onError("01", WebAgent.getMsg("ainf.errCode.01"));
            }
        }, op.lang);
    },

    /**
     * 座席签入
     * 
     * @param op {Object}
     * 
     * <pre>
     *     参数op项说明，*号表示必须参数，+表示可选
     *     + heartbeatLiveConnection {boolean} 是否使用长连接代替心跳,默认为false
     *     * oid(String) 操作员id
     *     * pwd(String) 加密后的密码
     *     * vcid (int) 虚拟中心id
     *     * cfgUrl(String) 零配置服务器地址
     *     + zeroCfgLoaded {boolean} 零配置是否已经加载，如果为true，登录时不再调用loadconfig，此时oid、pwd、cfgUrl都可以省略
     *     + onSucc(Function) 签入成功回调函数 
     *     + onError(Function) 签入失败回调函数 function(errcode,errMsg)
     *     + onInitialBeforeInvoke(Function) 嵌入调用Initial之前的回调函数
     *     + onInitialAfterInvoke(Function) 签入调用Initial之后的回调函数
     * 	   + type(String) 第一位是否开启视频，第二位是否开启webchat(缺省则根据webChat、video属性动态生成)--该参数已停用，
     *     + phoneType (Number) 话机类型
     *     + bindPhone (String) 绑定电话号码
     *     + sipip (String) sipphone地址，如果0.0.0.0则由sip自己获取ip地址。
     * 	   + lang(String) 语言en=英文，zh-CN=中文(缺省zh-CN)
     *     + heartRate (int) 心跳频率（单位秒),缺省10s
     * 	   + webChat(Object) webchat配置，参数定义如下：
     *       {
     *          IMServerAddr {String}
     * 			IMVersion {String}
     * 			IMLocalPort {String}
     * 			IMServerPort {String}
     * 			IMPassword {String}
     * 			bgwAddr {String}
     * 			softDALogonType {String} 
     *       }
     *     + video (Object) 视频配置，定义：
     *       {
     *          localVideoHwnd {int} 本地视频控件窗口句柄
     *          rmtVideoHwnd {int} 远端视频控件窗口句柄
     *       }
     * </pre>
     * 
     * @public
     */
    signin : function(op)
    {
    	if(this.isReady && this.isInit)
    	{
    		ZteAgent.log("WebAgent has been logged, Do not need to log in!", "warn");
    		if (op.onSucc) op.onSucc();
    		return;
    	}
    	
        this.sgininOption = op;
        this.isLoginModule = true;
		
        var thisobj = this;
        clearTimeout(WebAgent.heartbeatTimeoutID);
        
		
		thisobj.initLog(thisobj.isLoginModule);
		thisobj.setFixedUrlParam(thisobj.isLoginModule);
		var succFun = thisobj.utils.bind(thisobj.onSigninSucc, thisobj);
		var errFun = thisobj.utils.bind(thisobj.onSigninErr, thisobj);
		WebAgent.Signin.trySignin(succFun, errFun);
    },
	
	
	_lazyLoading : function(op)
    {
        this.sgininOption = op;
        this.isLoginModule = true;
		
        var thisobj = this;
        clearTimeout(WebAgent.heartbeatTimeoutID);
        this.initOCX(function(isSucc)
        {
            if (!isSucc)
            {
                // 初始化失败
                if (op.onError) op.onError("01", WebAgent.getMsg("ainf.errCode.01"));
            }
            else
            {
            	thisobj.initLog(thisobj.isLoginModule);
            	thisobj.setFixedUrlParam(thisobj.isLoginModule);
				var succFun = thisobj.utils.bind(thisobj.onLazySucc, thisobj);
				var errFun = thisobj.utils.bind(thisobj.onSigninErr, thisobj);
                WebAgent.lazyLoading.trylazyLoading(succFun,errFun,op.onInitialBeforeInvoke, op.onInitialAfterInvoke);
            }
        }, op.lang);
    },
    	
    
    		
    	
    	
    
    /**
     * 加载零配置项，可以在WebAgent.signin()之前调用，并设置zeroCfgLoaded属性为ture
     * 
     * @param cfg {Object} 参数列表
     * <pre>
     *     参数cfg项说明，*号表示必须参数，+表示可选
     *     * oid(String) 操作员id
     *     * pwd(String) 加密后的密码
     *     * vcid (int) 虚拟中心id
     *     * cfgUrl(String) 零配置服务器地址
     *     * type(String) 第一位是否开启视频，第二位是否开启webchat(缺省00)
     *     + phoneType (Number) 话机类型
     *     + bindPhone (String) 绑定电话号码
     *     + sipip (String) sipphone地址，如果0.0.0.0则由sip自己获取ip地址。
     *     + lang(String) 语言en=英文，zh-CN=中文(缺省en)
     *     + onSucc(Function) 加载成功回调函数 function(code)
     *     + onError(Function) 加载失败回调函数 function(errcode,errMsg)
     * </pre>
     * @public
     */
    loadZeroConfig : function(cfg)
    {
        var thisobj = this;
        if( (!WebAgent.Signin) || (!WebAgent.i18nMap))
        {
            this.loadRequireJs(cfg.lang, function()
            {
                thisobj.loadZeroConfig(cfg);
            });
            return;
        }
        
        WebAgent.debug("WebAgent.loadZeroConfig()");
        var vcid = cfg.vcid;
        var pwd = cfg.pwd;
        var oid = cfg.oid;      
        var cfgUrl = cfg.cfgUrl ? cfg.cfgUrl.split("|") : "";
        var urlCount = 0;       
        var type = (!cfg.type)?"00":cfg.type;
        var phoneType = (cfg.phoneType)?"&phonetype="+cfg.phoneType:"";
        var bindPhone = (cfg.phoneType && cfg.bindPhone)?"&bindphone="+cfg.bindPhone:";";
        var sipip =(cfg.sipip)?"sipip="+cfg.sipip+";":";";
        //去掉AgentType参数，A接口不再使用该参数
        var param = encodeURIComponent( sipip +"urlparam=agent="+oid+phoneType+bindPhone);
        var args = [ cfgUrl.length > 0 ? cfgUrl[urlCount++] : "", vcid == null ? -1 : vcid, oid, pwd,param ]; 
        var loadCfg = function(callUninitial)
        {
           
        	if (callUninitial == null)
            {
                callUninitial = true;
            }
            
            if (callUninitial)
            {
                WebAgent.invoker("Uninitial", "");
            }
            WebAgent.invoker("LoadConfig", args, function(result)
            {
                // 0成功,1失败但从本机加载成功,其他值失败 ,-1失败
                if (!result || result == "" || result == "-1" )
                {
                    thisobj.invoker("GetLastErrorCode", "", function(errCode)
                    {
                    	 //if (errCode == "-8240" && urlCount < cfgUrl.length)
                    	 if (urlCount < cfgUrl.length)
                         {
                             args[0] = cfgUrl[urlCount++];
                             loadCfg(false);
                         } 
                    	 else if (cfg.onError) cfg.onError(errCode, thisobj.getMsgByErrCode(errCode));
                    });
                }
                else
                {
                	cfg.achievedZeroConfigURL = args[0];
                    if(cfg.onSucc) cfg.onSucc(result);
                }
            });
        };

        // 如果已经签入，则先注销
       /* this.getAgtInfoFromAinf(function(agt)
        {
        	if(agt)
        	{
        		if(cfg.onError) cfg.onError("04", thisobj.getMsgByErrCode("04"));
        	}else
        	{
        		loadCfg();
        	}
        });*/
        loadCfg();
    },
    
    /**
     * 签出
     * @public
     */
    logout : function(fn)
    {
		if(!WebAgent.isLazySignout)
		{
			//WebAgent.invoker("SignOut", [], function(re)
			WebAgent.AinfOCX.Invoker("StatusMonitor", "0,0,0,SignOut", function(result)
			{
				if (result == "0")
				{
					WebAgent.isLoginModule = false;
					WebAgent.isReady = false;
					WebAgent.isInit = false;
					WebAgent.onInitFnList = [];//清空onInitFun
					WebAgent.setState(WebAgent.State.logout);
					WebAgent.stateMan = null;
					//WebAgent.AinfOCX.Invoker("Uninitial", "", null, true);
					if (fn) fn(true);
				}
				else
				{
					if (fn) fn(false);
				}

			}, true);
		}else
		{
			if (fn) fn(true);
		}
	},
    	
	/**
	*假签出
	*/
     lazySignOut : function(fn)
    {
    	WebAgent.invoker("SignOut", [], function(result)
		{
    	    if (result == "0")
            { 
				WebAgent.isLazySignout = true;
                WebAgent.isLoginModule = false;
                WebAgent.isReady = false;
		        WebAgent.isInit = true;
		        WebAgent.onInitFnList = [];//清空onInitFun
                WebAgent.setState(WebAgent.State.logout);
				WebAgent.stateMan = null;
				WebAgent.EventBus.removeAllEventListener();
				if (fn) fn(true);
			}else
            {
                if (fn) fn(false);
            }	
		      
    	});
    },	

    /**
     * 调用A接口方法（采用队列方式保证调用顺序）该方法名是为了兼容A接口的invoker方法 可以用invok方法替他
     * 
     * @param method {String}
     * @param args {Array,String}
     * @returns
     * @public
     */
    invoker : function(method, args, cbFun)
    {
        if (!method)
        {
            WebAgent.warn("WebAgent.invoker(" + [ method, args, cbFun ]
                    + ") error, Missing parameter: \"method\"  is Null! ");
            return;
        }
        var method_ =
        {
            "method" : method,
            "args" : args,
            "cbFun" : cbFun,
            "isDoing" : false,
            "queueTime" : new Date().getTime(),
            "startTime" : 0,
            "endTime" : 0
        };

        this.invokerList.push(method_);
        var thisobj = this;

        // 由于该方法可能在未初始化之前也需要调用，因此提前加载相关js文件
        if (!WebAgent.AinfOCX)
        {
            var sTime = new Date().getTime();
            WebAgent.loadBasicJs(function(timeCons)
            {
                  
                WebAgent.warn("Not initialized before calling Ainf's method, pre-loading the core JS file, Time-consuming:"
                                        + timeCons + "(ms)");
                thisobj.doInvoke(thisobj.invokerList);
            });
            return;
        }
        this.doInvoke(this.invokerList);
    },

    /**
     * 顺序调用方法队列里面的方法。
     * 
     * @private
     */
    doInvoke : function(methodList)
    {
        if ((!methodList) || (methodList.length < 1))
        {
            return;
        }
        var m_ = methodList[0];
        if (m_.isDoing)
        {
            return;
        }

        var method = m_.method;
        var args = m_.args;
        var fn = m_.cbFun;

        // 参数
        var ocx = WebAgent.AinfOCX;
        var str = "";
        var split = "";
        if (this.utils.isArray(args))
        {
            for ( var i = 0; i < args.length; i++)
            {
                str += split + args[i];
                split = ",";
            }
        }
        else
        {
            str = this.utils.trim(args + "");
        }

        var thisobj = this;
        m_.isDoing = true;
        m_.startTime = new Date().getTime();
        return ocx.Invoker(method, str, function(result)
        {
            methodList.shift();
            
            // log
            m_.endTime = new Date().getTime();
            var runTime = m_.endTime - m_.startTime;
            var queueTime = m_.startTime - m_.queueTime;
			var queueTimeStr = WebAgent.utils.formatDate(new Date(m_.queueTime),"hh:mm:ss:S");
			var curTimeStr = WebAgent.utils.formatDate(new Date(m_.endTime),"hh:mm:ss:S");
            var timeInfo = queueTimeStr + "-->"+curTimeStr;
            var logInfo = "GUI >>> Ainf." + method + "(\"" + str + "\")";
            logInfo += "\r        Result   = " + result;
            logInfo += "\r        ExecTime = " + runTime + "(ms) " + timeInfo +" QueueWaitTime="+queueTime+"(ms) ";
            logInfo += "\r";
            WebAgent.info(logInfo);
			
            if (fn) try
            {
                fn(result);
            }
            catch (e)
            {
				alert("exception:"+e)
            }
			
            // Call the next method
            setTimeout(function()
            {
                thisobj.doInvoke(methodList);
            }, 1);
            
            //对外广播
            setTimeout(function()
            {
                WebAgent.EventHelper.notify("OnInvokerResult", [ method, args, result ]);
            }, 2);
            
        }, true);
    },

    /**
     * invoker的替代方法（invoker由于兼容性原因，命名不规范）
     * @public
     */
    invoke : function(method, args, cbFun)
    {
        return WebAgent.invoker(method, args, cbFun);
    },

    /**
     * 注册事件
     * 
     * @param eventName {String} 事件名
     * @param fun {function} 处理函数
     * @returns
     * @public
     */
    regEvent : function(eventName, fun, ctx)
    {
        var eh = new WebAgent.EventHelper();
        eh.regEvent(eventName, fun, (!ctx) ? eh : ctx);
        return eh;
    },

    /**
     * 反注册事件
     * 
     * @param eventHelper
     * @param eventHelper {EventHelper} 通过regEvent得到的对象
     * @public
     */
    unRegEvent : function(eventHelper)
    {
        if (eventHelper && (eventHelper instanceof WebAgent.EventHelper))
        {
            eventHelper.dispose();
        }
    },

    /**
     * 是否已经登录？
     * 
     * @returns
     * @public
     */
    isLogged : function()
    {
        return this.isReady;
    },

    /**
     * 同步座席状态,未初始化、未登录则返回null
     * @public
     */
    syncCurState : function(cbFun)
    {
        if (!this.isInit)
        {
            if (cbFun) cbFun(null);
            return;
        }

        if (!this.stateMan)
        {
            this.stateMan = new WebAgent.StateManager();
        }

        this.stateMan.syncCurState(cbFun);
    },
    
    
    /**
     * 同步座席状态,未初始化、未登录则返回null
     * @public
     */
    syncCurStateByStateCode : function(stateCode,cbFun)
    {
        if (!this.isInit)
        {
            if (cbFun) cbFun(null);
            return;
        }

        if (!this.stateMan)
        {
            this.stateMan = new WebAgent.StateManager();
        }

        this.stateMan.syncCurStateByStateCode(stateCode,cbFun);
    },
    
    
    /**
     * 长连接建立
     */
    liveConnectionConnected : function()
    {
        this.isLiveConnectionModuleLoaded = true;
        WebAgent.info("~~~~~~~LiveConnection connected!~~~~~~~");
    },
    
    /**
     * 重新连接
     */
    liveConnectionReconnect: function()
    {
        WebAgent.info("~~~~~~~LiveConnection try to reconnect!~~~~~~~");
        
        try
        {
            var triedCount = WebAgent.AinfOCX.liveSocketTriedCount;
            WebAgent.liveConnectionComponent.reConnect();
            
            // 连接成功后重试次数置0
            setTimeout(function(){
                if (triedCount == WebAgent.AinfOCX.liveSocketTriedCount)
                {
                    WebAgent.AinfOCX.liveSocketTriedCount = 0;
                }
            }, 100);
        }
        catch (e)  
        {
            WebAgent.error("~~~~~~~Call LiveConnection component reConnect() failed!~~~~~~~");
        }
    },
    
    /**
     * 长连接断开
     */
    liveConnectionClosed : function()
    {
        this.isLiveConnectionModuleLoaded = false;
        WebAgent.info("~~~~~~~LiveConnection closed!~~~~~~~");
        
        // 重新发送心跳
        if (this.heartbeatTimeoutID)
        {
            clearTimeout(this.heartbeatTimeoutID);
        }
        this.heartbeatTimeoutID = setTimeout(this.utils.bind(this.sendHeartbeat, this), 0);
        
        // 重新建立长连接
        if (this.AinfOCX.liveSocketTriedCount++ < this.AinfOCX.liveSocketReConnectCount)
        {
            setTimeout(WebAgent.liveConnectionReconnect, 0);
        }
    },
    
    /**
     * 建立长连接
     * 
     * @param port 服务程序长连接端口号
     */
    establishLiveConnection : function(port)
    {
        var wrapper = document.getElementById("liveConWrapper");
        if (!wrapper)
        {
            wrapper = document.createElement("div");
            wrapper.style.width = "1px";
            wrapper.style.height = "1px";
            wrapper.style.position = "absolute";
            wrapper.style.top = "0px";
            wrapper.style.left = "0px";
            
            document.body.appendChild(wrapper);
        }
        
        try
        {
            this.liveConnectionComponent = this.embedSWF(this.getJsURL("LiveConnection.swf"), "LiveConnection", wrapper, 1, 1,
                    {align: "middle"},
                    {quality:"high", bgcolor:"#ffffff", allowscriptaccess:"sameDomain", allowfullscreen:"true",
                    flashvars:"remotePort=" + port + "&connectEventHandler=WebAgent.liveConnectionConnected&closeEventHandler=WebAgent.liveConnectionClosed"});
        }
        catch(e)
        {
            WebAgent.error("~~~~~~~Create LiveConnection component failed!~~~~~~~");
        }
    },

    /**
     * 签入成功
     * 
     * @param isAbnormalExit
     * @private
     */
    onSigninSucc : function(isAbnormalExit)
    {
        var thisobj = this;
        var op = this.sgininOption;
        this.isAbnormalExit = isAbnormalExit;

        // 如果不是恢复登录，则清空所有的缓存
        if (!isAbnormalExit)
        {
            WebAgent.buffer.delAllValues();
            WebAgent.invoker("StatusMonitor", [ 0, -2, 0, 0 ]);
        }

        // 获取已登录用户，供其他地方同步返回
        this.getAgtInfoFromAinf(function(agt)
        {
        	// 同步状态信息
            thisobj.syncCurStateByStateCode(agt.stateCode,function(state_)
            {
                thisobj.isReady = true;
                
                // 启动心跳
                var num = parseInt(op.heartRate);
                num = (isNaN(num) || (num < 1)) ? thisobj.heartbeatDefaultTime : num;

                thisobj.heartbeatTime = num;
                thisobj.heartbeatTimeoutID = setTimeout(thisobj.utils.bind(thisobj.sendHeartbeat, thisobj), 0);

                // 判断是否使用长连接,判断Flash插件是否存在
                if (op.heartbeatLiveConnection && thisobj.getFlashPlayerVersion().major >= 10)
                {
                    thisobj.establishLiveConnection(thisobj.AinfOCX.liveSocketPort);
                }

                // 调用：【签入成功】的函数列表
                thisobj.notifyReady();

                // 回调onSucc
                if (op.onSucc) op.onSucc();
                WebAgent.EventHelper.notify("OnSigninResult", [ true, "0" ]);
            });
        });
    },
	
	onLazySucc:function(isAbnormalExit){
		var thisobj = this;
        var op = this.sgininOption;
		if (op.onSucc) op.onSucc();
	},
	

    /**
     * 签入失败
     * 
     * @param errCode
     * @private
     */
    onSigninErr : function(errCode)
    {
        var errMsg = this.getMsgByErrCode(errCode);
        var op = this.sgininOption;
        if (op.onError) op.onError(errCode, errMsg);

        // log
        var agtInfo = [];
        for ( var o in this.sgininOption)
        {
            if (o == "onError" || o == "onSucc" || o == "webChat") continue;
            agtInfo.push("\r               " + o + "=" + this.sgininOption[o]);
        }
        WebAgent.error("Signin Error : errCode=" + errCode + " , errMsg=" + errMsg + "\r               agentInfo={\r"
                + agtInfo + "\r}");
        WebAgent.EventHelper.notify("OnSigninResult", [ false, errCode ]);
    },
    
    /**
     *  获取错误提示信息
     * @public
     */
    getMsgByErrCode : function(errCode)
    {
    	var key = "ainf.errCode." + errCode;
        var defaultErrMsg = "Error(" + errCode + ")";
        var errMsg =WebAgent.utils.trim(WebAgent.getMsg(key));
        errMsg = (errMsg == key || errMsg == "") ? defaultErrMsg : errMsg;
        return errMsg;
    },

    /**
     * 发送心跳请求
     * @private
     */
    sendHeartbeat : function()
    {
        if (!WebAgent.isLoginModule) return; // 只有签入模块才能发起心跳
        if (!WebAgent.isReady) return; // 登录成功后才能发起心跳请求
        if (WebAgent.isLiveConnectionModuleLoaded) return; // 如果长连接模块已加载则不再发送心跳
        var ocx = WebAgent.AinfOCX;
        var thisobj = this;
        
        ocx.Heartbeat(this.heartbeatTime + 2, function(result)
        {
            WebAgent.debug("~~~~~~~OnHeartbeat~~~~~~~" + ((result == "err") ? "err" : "succ"));
            WebAgent.heartbeatTimeoutID = setTimeout(WebAgent.utils.bind(WebAgent.sendHeartbeat, thisobj),
                    WebAgent.heartbeatTime * 1000);
        });
    },

    /**
     * 从A接口处获取座席信息{oid,vcid,pwd,type,stateCode}
     * 
     * @param {function({oid,vcid,pwd,type,stateCode})}
     * @private
     */
    getAgtInfoFromAinf : function(fn)
    {
        var thisobj = this;

        // 该方法需对外开发，因此需预加载js
        if (!WebAgent.Signin)
        {
            this.loadRequireJs("en", function()
            {
                thisobj.getAgtInfoFromAinf(fn);
            });
            return;
        }

        WebAgent.Signin.getCurAgtInfo(function(agt)
        {
            if (agt && agt.AGTID)
            {
                thisobj.isReady = true;

                // 保存当前登录用户信息
                var op = (thisobj.operator) ? thisobj.operator : {};
                op.oid = agt.AGTID, op.pwd = agt.PWD;
                op.vcid = agt.VCID, op.type = agt.AGTTYPE;
                op.gid = agt.GRPID;

                thisobj.operator = op;

                // 获取状态
                WebAgent.invoker("GetAgentInfo", [ op.oid ], function(curStatus)
                {
                    var agtStatus = 0;
                    if (curStatus.length > 1)
                    {
                        var arr = curStatus.split("|");
                        agtStatus = (arr.length > 5) ? arr[5] : 0;
                    }
                    op.stateCode = agtStatus * 1;
                    
                    // 2016-12-20 将webagent-com2.js中状态变化时获取信息的代码移植到这里
                    
                    WebAgent.com2_agtType = (arr.length > 8) ? arr[8] : null;
                    WebAgent.com2_currentAgtInfo = curStatus;
                    
                    if (op.stateCode == 0)
                    {
                        if (fn) fn(null);
                    }
                    else
                    {
                        if (fn) fn(op);
                    }
                });
            }
            else
            {
                if (fn) fn(null);
            }
        });
    },

    /**
     * 加载js、初始化ocx控件
     * 
     * @param fn {function(boolean)}
     * @param lan {String} 语言类型
     * @returns
     * @private
     */
    initOCX : function(fn, lang)
    {
        // 语言
        lang = (!lang) ? this.defaultLan : lang;
        this.isReInit = this.isInit;
        this.isInit = false;
        var thisobj = this;

        this.loadRequireJs(lang,
                function()
                {
                    var ocx = WebAgent.AinfOCX;
                    ocx.init(function(succ)
                    {
                        if (succ)
                        {
                            // 移除所有注册的事件
                            WebAgent.EventBus.removeAllEventListener();
                            WebAgent.EventHelper.rmvAllIntercept();

                            WebAgent.isInit = true;

                            // 回调“初始化成功函数”
                            WebAgent.notifyOnInit();
                        }
                        if (fn) fn(succ);
                    }, lang);
                });
    },

    /**
     * 注册登录成功后回调函数
     * 
     * @private
     */
    ready : function(fn)
    {
    	if(this.isReady && fn) fn();
        this.readyList.push(fn);
    },

    /**
     * 回调通过ready()方法注册的函数
     * 
     * @private
     */
    notifyReady : function()
    {
        for ( var i = 0; i < this.readyList.length; i++)
        {
            this.readyList[i]();
        }
    },

    /**
     * 注册初始成功后回调函数
     * 
     * @param fn
     * @private
     */
    onInit : function(fn)
    {
    	if(this.isInit && fn) fn();
        this.onInitFnList.push(fn);
    },

    /**
     * 回调通过onInit方法注册的函数
     * 
     * @private
     */
    notifyOnInit : function()
    {
        for ( var i = 0; i < this.onInitFnList.length; i++)
        {
            this.onInitFnList[i]();
        }
    },
    
    /**
     *  生成日志模块ID标识。
     *  @private
     */
    getLogNameID : function()
    {
    	if(this.logNameID_ && this.logNameID_!="")
    	{
    		return this.logNameID_;
    	}
    	
    	var logID="";
		var d = new Date();
		logID += d.getHours();
		logID += d.getMinutes();
		logID += d.getSeconds();
		this.logNameID_ = logID;
		return this.logNameID_;
    },
    
    
    /**
     * 设置http请求固定参数，供agentservice判断是否主模块
     * @param isLoginModule {boolean} 是否登录模块
     * @private
     */
    setFixedUrlParam : function(isLoginModule)
    {
    	var moduleName = (isLoginModule)?"zte":this.getLogNameID();
    	WebAgent.AinfOCX.setFixedUrlParam({module:moduleName});
    },
    
	/**
	 * 初始化日志
	 * @param {boolean} 是否签入模块
	 */
	initLog : function(isLoginModule)
	{
		if(!WebAgent.setLoggerModuleName) return;
		var logName = (isLoginModule)?"main"+this.getLogNameID() : "serv"+this.getLogNameID();
		WebAgent.setLoggerModuleName(logName);
	},

    /**
     * 获取js基本路径
     * 
     * @private
     */
    getBase : function()
    {
        if (this.base && (this.base != ""))
        {
            return this.base;
        }
        var scripts = document.getElementsByTagName('script');
        for ( var i = 0; i < scripts.length; i++)
        {
            var src = scripts[i].src;
            if (!src) continue;
            var m = src.match(/webagent\.js(\W|$)/i);// 判断文件是否含有webagent.js
            if (m)
            {
                this.base = src.substring(0, m.index);
            }
        }
        return this.base;
    },

    /**
     * 获取js地址
     * 
     * @private
     */
    getJsURL : function(url)
    {
        return (/^http/i.test(url)) ? url : this.getBase() + url;
    },

    /**
     * 加载js（异步）
     * 
     * @param url
     * @param callback
     * @returns
     * @private
     */
    loadjs : function(url, callback)
    {
        url = this.getJsURL(url);
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
    sequenceLoadJs : function(urlArr, fn)
    {
        if (urlArr.length < 1)
        {
            if (fn) fn();
            return;
        }
        var obj = this;
        var url = urlArr.shift();
        this.loadjs(url, function()
        {
            obj.sequenceLoadJs(urlArr, fn);
        });
    },

    /**
     * 加载座席必须的js文件
     * 
     * @param fn
     * @private
     */
    loadRequireJs : function(lang_, fn)
    {
        var sTime = new Date().getTime();
        
        // 按先后顺序，加载必需的js文件
        var jsArr = [];
        if (!window.jQuery) jsArr.push("util/jquery-1.8.3.min.js");
        if (!window.jQuery || !window.jQuery.jsonp) jsArr.push("util/jquery.jsonp-2.4.0.js");

        // 资源文件
        var lang = this.defaultLan;
        lang_ = (lang_ + "").toLowerCase();
        for ( var i = 0; i < this.languageCode.length; i++)
        {
           // if (lang_ == (this.languageCode[i] + "").toLowerCase())
        	if(lang_.indexOf((this.languageCode[i] + "").toLowerCase()) == 0)
            {
                lang = this.languageCode[i];
                break;
            }
        }  
        var i18nUrl = "i18n/webagent_" + lang + ".js";
        this.loadjsMap[this.getJsURL(i18nUrl)] = false;
        jsArr.push(i18nUrl);

        jsArr.push("util/common.js");
        jsArr.push("util/i18n.js");
        jsArr.push("util/log4js.js");
        jsArr.push("util/json2.js");
        jsArr.push("util/httpLogger.js");
        jsArr.push("EventBus.js");
        jsArr.push("EventHelper.js");
        jsArr.push("AinfOCX.js");
        jsArr.push("Signin.js");
		jsArr.push("LazyLoading.js");
        jsArr.push("Cmd.js");
        jsArr.push("State.js");
        jsArr.push("StateManager.js");

        // WebAgent扩展功能
        jsArr.push("extend/webagent-stateMethodMap.js");
        jsArr.push("extend/webagent-logger.js");
        jsArr.push("extend/webagent-helper.js");
        jsArr.push("extend/webagent-exception.js");
        jsArr.push("extend/webagent-btnManag.js");
        jsArr.push("extend/webagent-btnSwitch.js");
        jsArr.push("extend/webagent-com2.js");
        jsArr.push("extend/webagent-flashLoader.js");
        // jsArr.push("extend/webagent-reportState.js");
        jsArr.push("extend/webagent-confMaster.js");
        jsArr.push("extend/webagent-webChat.js");
        jsArr.push("extend/webagent-insideCall.js");
		jsArr.push("extend/webagent-im.js");
        this.sequenceLoadJs(jsArr, function()
        {
            WebAgent.debug("WebAgent.loadRequireJs() Load all the JS files, Time-consuming:"
                    + (new Date().getTime() - sTime));
            
            if (fn) fn();
        });
    },

    /**
     * 加载最基本的js文件，保证invoker可以调用
     * 
     * @param cbFun {function} 回调函数
     * @return {Long} 耗时(ms)
     * @private
     */
    loadBasicJs : function(cbFun)
    {
        var sTime = new Date().getTime();
        var jsArr = [];
        if (!window.jQuery) jsArr.push("util/jquery-1.8.3.min.js");
        if (!window.jQuery || !window.jQuery.jsonp) jsArr.push("util/jquery.jsonp-2.4.0.js");
        jsArr.push("AinfOCX.js");
        jsArr.push("EventBus.js");
        jsArr.push("EventHelper.js");
        jsArr.push("util/log4js.js");
        jsArr.push("util/json2.js");
        jsArr.push("util/httpLogger.js");
        jsArr.push("extend/webagent-logger.js");
        this.sequenceLoadJs(jsArr, function()
        {
            if (cbFun) cbFun(new Date().getTime() - sTime);
        });
    },

    /**
     * 检查控件是否存在
     * 
     * @param fn sdfds
     * @public
     */
    checkAInfExist : function(fn)
    {
        this.loadRequireJs("en", function()
        {
            var ocx = WebAgent.AinfOCX;
            ocx.checkAInfExist(fn);
        });
    },

    /**
     * 设置语言（可以登录后调用）
     * 
     * @param langStr {String} 语言类型
     * @param {boolean} 指定语言不存在返回false
     */
    setLang : function(langStr, cbFun)
    {
        var lang = "";
        langStr = (langStr + "").toLowerCase();
        for ( var i = 0; i < this.languageCode.length; i++)
        {
            if (langStr == (this.languageCode[i] + "").toLowerCase())
            {
                lang = this.languageCode[i];
                break;
            }
        }
        if (lang == "")
        {
            if (cbFun) cbFun(false);
            return;
        }

        var i18nJs = "i18n/webagent_" + lang + ".js";
        this.loadjsMap[this.getJsURL(i18nJs)] = false; // 取消已加载标记

        var jsArr = [];
        jsArr.push(i18nJs);
        jsArr.push("AinfOCX.js");

        // 资源文件加载成功后，设置agentservice语言
        this.sequenceLoadJs(jsArr, function()
        {
            WebAgent.AinfOCX.getAinfServerURL(function(ainfSevURL)
            {
                var url = ainfSevURL + "RegEvent?lang=" + lang;
                WebAgent.loadjs(url, function()
                {
                    if (cbFun) cbFun(true);
                });
            });
        });
    },

    /**
     * 扩展WebAgent方法,为了安全起见，不允许覆盖原有的方法、属性. 如果实在需要覆盖，请直接用WebAgent.xxx方式。
     * 
     * @param obj
     * @returns
     * @protected
     */
    extend : function(obj)
    {
        for ( var i in obj)
        {
            if (!(WebAgent[i] === undefined))
            {
                var errMsg = "扩展失败！不允许覆盖WebAgent的方法或属性: WebAgent." + i;
                alert(errMsg);
                throw errMsg;
                return;
            }
            WebAgent[i] = obj[i];
        }
    },

    /**
     * 工具类,(本js中很多方法都应该移进来，但是没时间重构～～～～)
     */
    utils :
    {
        // 数组相减arr1 - arr2
        arrSub : function(arr1, arr2)
        {
            var item1, item2;
            while (arr2.length > 0)
            {
                item1 = arr2.pop();
                for ( var k = 0; k < arr1.length; k++)
                {
                    item2 = arr1[k];
                    if (item2 === item1)
                    {
                        arr1.splice(k, 1);
                    }
                }
            }
            return arr1;
        },

        /**
         * 格式化时间 WebAgent.utils.formatDate(new Date(),"yyyy-MM-dd hh:mm:ss:S");
         */
        formatDate : function(date, format)
        {
            var ms = "000" + date.getMilliseconds();
            ms = ms.substr(ms.length - 3);
            var o =
            {
                "M+" : date.getMonth() + 1, // month
                "d+" : date.getDate(), // day
                "h+" : date.getHours(), // hour
                "m+" : date.getMinutes(), // minute
                "s+" : date.getSeconds(), // second
                "q+" : Math.floor((date.getMonth() + 3) / 3)
            // quarter
            };
            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for ( var k in o)
                if (new RegExp("(" + k + ")").test(format))
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k])
                            .substr(("" + o[k]).length));
            if (/(S)/.test(format)) format = format.replace(RegExp.$1, ms);

            return format;
        },

        /**
         * 绑定方法上下文
         * 
         * @param fn
         * @param ctx
         */
        bind : function(fn, ctx)
        {
            return function()
            {
                return fn.apply(ctx, arguments);
            };
        },

        /**
         * 对象是否为数组
         * 
         * @param obj
         * @returns {Boolean}
         */
        isArray : function(obj)
        {
            return Object.prototype.toString.call(obj) === "[object Array]";
        },

        /**
         * 对象是否为数组
         * 
         * @param obj
         * @returns {Boolean}
         */
        isFun : function(obj)
        {
            return Object.prototype.toString.call(obj) === "[object Function]";
        },

        /**
         * 去空格
         * 
         * @param str
         * @returns
         */
        trim : function(str)
        {
            return str.replace(/^\s+|\s+$/g, '');
        }
    },

    /**
     * 查找对象,从同域最顶层窗口开始查找
     * 
     * @param objName {String} 如：zte.webagent.RingView
     * @return
     * @private
     */
    findObj : function(objName)
    {
        /* 获取同域最顶层窗口 */
        var topWin = window;
        while (true)
        {
            try
            {
                var win = topWin.parent;
                var doc = win.document; // 抛异常测试
            }
            catch (e)
            {
				alert("exception2:"+e)
                break;
            }

            if (win == topWin)
            {
                break;
            }
            else
            {
                topWin = win;
            }
        }

        var list = [];
        list.push(topWin);

        var findNum = 0;
        while (list.length > 0 && findNum < 200)
        {
            win = list.pop();
            var ns = objName.split(".");
            var obj = win;
            for ( var i = 0; i < ns.length; i++)
            {
                var on = ns[i];
                try
                {
                    obj = obj[on];
                }
                catch (e)
                {
					alert("exception1:"+e)
                    /* 防止跨域访问异常 */
                    break;
                }
                if (obj)
                {
                    if (i == (ns.length - 1))
                    {
                        return obj;
                    }
                    continue;
                }
                break;
            }
            if (win.frames)
            {
                var fs = win.frames;
                for (i = 0; i < fs.length; i++)
                {
                    list.push(win.frames[i]);
                }
            }
            win = null;
        }
        return null;
    }
};

// 同域名下面不同iframe之间共享同一个WebAgent对象
var globalWebAgent = WebAgent.findObj("WebAgent.global._WebAgent");
var curPageWebAgent = WebAgent;
if (globalWebAgent)
{
    // alert("WebAgent已经存在！")
    WebAgent = globalWebAgent;
}
else
{
    // alert("WebAgent不存在！")
    WebAgent.global = {};
    WebAgent.global._WebAgent = WebAgent;
}
