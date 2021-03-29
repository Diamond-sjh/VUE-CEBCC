/**
 * 通过http方式和A接口后台服务进行通信
 */
WebAgent.AinfOCX =
{
	// http连续请求失败重试次数
    tryTime : 1000,

	// jsonp连续失败次数
    errTime : 0,
    
    // 会话丢失连续次数
    sessionLostTime : 0,
    
    // 会话丢失重试次数
    sessionLostTryTime :1 ,
    
    // 传递给agentservice的语言编码
    lang : "",
    
    // jsonp超时时间
    reqTimeout : 0,

	// 当前是否连接
    isConnection : false,

    eventRegName : null,

    // 本地http请求地址
    //ainfSevURL : "http://10.130.81.95:8082/httpSev/ainf/",
	ainfSevURL : null,
	
	// HTTP请求服务器的地址
	ainfServer : "127.0.0.1",
	
	// 访问服务器的端口
	ainfServerPort : null,
	
	// 潜在可访问端口列表
	potentialAinfServPort : [80,11111, 22222, 33333, 44444],
	
	// 服务器的请求路径
	ainfServAccessPath : "/",
	
	// 代替心跳维持状态的Socket端口
	liveSocketPort : 1899,
	
	// 允许重连次数
	liveSocketReConnectCount: 3,
	
	// 尝试次数
	liveSocketTriedCount : 0,
	
	// url每次请求的固定扩展参数
	fixedUrlParam : {}, 
	
	stopGetEventFlag : false, //停止获取事件

    eventHttpReq : null,

    /**
     * 事件码、事件名称 映射关系
     */
    ainfEventMap :
    {
        "0" : "OnSignInSuccess", // (00)签入成功
        "1" : "OnSignInFailure", // 签入失败
        "2" : "OnSignOutSuccess", // 签出成功
        "3" : "OnSignOutFailure", // 签出失败
        "4" : "OnAnswerRequest", // 应答请求
        "5" : "OnAnswerSuccess", // 应答成功
        "6" : "OnAnswerFailure", // 应答失败
        "7" : "OnUserHangupBeforeResponse", // 座席应答前用户挂机
        "8" : "OnRequestRelease", // 释放请求
        "9" : "OnReleaseSuccess", // 释放成功
        "10" : "OnReleaseFailure", // 释放失败
        "11" : "OnLongNoAnswer", // 久叫不应: 
        "12" : "OnSetBusySuccess", // 示忙成功: 
        "13" : "OnStartBusy", // 开始示忙: 废弃
        "14" : "OnSetBusyFailure", // 示忙失败: 
        "15" : "OnSetIdleSuccess", // 示闲成功: 
        "16" : "OnSetIdleFailure", // 示闲失败: 
        "17" : "OnConsultationSuccess", // 咨询成功: 
        "18" : "OnConsultationFailure", // 咨询失败: 
        "19" : "OnConsultationBack", // 咨询返回: 
        "20" : "OnTransSuccess", // 转移成功
        "21" : "OnTransFailure", // 转移失败
        "22" : "OnRecieveTransfer", // 收到转移: 废弃
        "23" : "OnDivertSuccess", // 偏转成功
        "24" : "OnDivertFailure", // 偏转失败
        "25" : "OnDTMFDigitsDected", // 座席收号
        "26" : "OnReturnFromIVR", // 从IVR返回，业务测试密码认证专用
        "27" : "OnRequestQueueResult", // 二次排队返回结果: 废弃
        "28" : "OnSingleStepTransSuccess", // 单步转移成功
        "29" : "OnSingleStepTransFailure", // 单步转移失败
        "30" : "OnCallInsideSuccess", // 内呼成功
        "31" : "OnCallInsideSuccTalk", // 内呼成功通话
        "32" : "OnCallInsideFailure", // 内呼失败 
        "33" : "OnCallOutsideSuccess", // 外呼成功 
        "34" : "OnCallOutsideSuccTalk", // 外呼成功通话 
        "35" : "OnCallOutsideFailure", // 外呼失败 
        "36" : "OnHoldSuccess", // 保持成功 
        "37" : "OnHoldFailure", // 保持失败 
        "38" : "OnRetrieveHoldSuccess", // 取保持成功 
        "39" : "OnRetrieveHoldFailure", // 取保持失败 
        "40" : "OnHoldCallRelease", // 当前保持呼叫挂断 
        "41" : "OnConferenceSuccess", // 三方会议成功 
        "42" : "OnConferenceFailure", // 三方会议失败 
        "43" : "OnHangupCallInConf", // 会议中有人挂断，会议发起方触发:callPair
        "44" : "OnAlternateSuccess", // 切换成功 
        "45" : "OnAlternateFailture", // 切换失败 
        "46" : "OnListenSuccess", // 监听成功 
        "47" : "OnListenFailure", // 监听失败 
        "48" : "OnInsertSuccess", // 插入成功 
        "49" : "OnInsertFailure", // 插入失败 
        "50" : "OnInterceptSuccess", // 拦截成功 
        "51" : "OnInterceptFailure", // 拦截失败 
        "52" : "OnForceIdleSuccess", // 强制示闲成功 
        "53" : "OnForceIdleFailure", // 强制示闲失败 
        "54" : "OnForceBusySuccess", // 强制示忙成功 
        "55" : "OnForceBusyFailure", // 强制示忙失败 
        "56" : "OnAgentForceOutSuccess", // 强制迁出成功 
        "57" : "OnAgentForceOutFailure", // 强制迁出失败 
        "58" : "OnBeginRecordSuccess", // 开始录音成功
        "59" : "OnBeginRecordFailure", // 开始录音失败 
        "60" : "OnStopRecordSuccess", // 停止录音成功 
        "61" : "OnStopRecordFailure", // 停止录音失败 
        "62" : "OnTransferRecordSuccess", // 转接录音成功 
        "63" : "OnTransferRecordFailure", // 转接录音失败 
        "64" : "OnForceIdle", // 强制示闲，发起方触发 
        "65" : "OnForceBusy", // 强制示忙，发起方触发 
        "66" : "OnForceOut", // 强制迁出，发起方触发 
        "67" : "OnAgentAllBusy", // 座席全忙 
        "68" : "OnError", // 错误事件: 废弃
        "69" : "OnCTIDisconnected", // CTI断链 
        "70" : "OnMasterChanged", // 主被倒换 
        "71" : "OnStopInsertSuccess", // 停止插入成功 
        "72" : "OnStopInsertFailure", // 停止插入失败 
        "73" : "OnAgentEnterIdleSuccess", // 退出后续处理态成功 
        "74" : "OnAgentEnterIdleFailure", // 退出后续处理态失败 
        "75" : "OnAgentEnterWrapUpSuccess", // 进入后续处理态成功 
        "76" : "OnAgentEnterWrapUpFailure", // 进入后续处理态失败 
        "77" : "OnAgentStatusChanged", // 座席状态变换: 不需要模拟
        "78" : "OnCompleteTape", // 完成录音事件:废弃
        "79" : "OnMonitorEvent", // 班长事件:废弃
        "80" : "OnForceRelease", // 被强拆 
        "81" : "OnQueWarningEvent", // 队列告警: 不需要模拟
        "82" : "OnRecordEvent", // 录音事件: recordEvent
        "83" : "OnReleaseconn", // 挂机事件: releaseConn
        "84" : "OnRetrieved", // 切换 
        "85" : "OnHeld", // 保持 
        "86" : "OnTransferred", // 转移: callPair
        "87" : "OnBeIntercept", // 被拦截 
        "88" : "OnApplyRestSuccess", // 请假成功:applyRestSuccess
        "89" : "OnApplyRestFailure", // 请假失败:applyRestFailure
        "90" : "OnApplyRestQueue", // 请假在排队中:ApplyRestQueue
        "91" : "OnMessageApplyRestReceive", // 通知班长有新的请假请求:applyRestReceive
        "92" : "OnSetRestSuccess", // SetRest请假成功,SetRest成功后座席方可走人 
        "93" : "OnSetRestFailure", // SetRest请假失败,SetRest不会失败，除非时平台内部错误或模式错误 
        "94" : "OnCancelApplyRestSuccess", // 取消请假申请 成功 
        "95" : "OnCancelApplyRestFailure", // 取消请假申请 失败 
        "96" : "OnMessageReceive", // 有新的座席间消息:不需要模拟

        "97" : "OnSetLockSuccess", // 置锁成功 
        "98" : "OnSetLockFailure", // 置锁失败 
        "99" : "OnForceLockSuccess", // 强锁成功 
        "100" : "OnForceLockFailure", // 强锁失败 
        "101" : "OnUnlockSuccess", // 解锁成功 
        "102" : "OnUnlockFailure", // 解锁失败 
        "103" : "OnSetPreCallSuccess", // 设置预呼成功 
        "104" : "OnSetPreCallFailure", // 设置预呼失败 
        "105" : "OnSetMediaWorkSuccess", // 设置媒体处理状态成功 
        "106" : "OnSetMediaWorkFailure", // 设置媒体处理状态失败 
        "107" : "OnSetCheckWorkSuccess", // 设置质检状态成功 
        "108" : "OnSetCheckWorkFailure", // 设置质检状态失败 

        // NGCC 0302
        "109" : "OnMediaTransferSuccess", // 媒体转移成功
        "110" : "OnMediaTransferFailure", // 媒体转移失败
        "111" : "OnMediaNotify", // 媒体待处理通知事件
        "112" : "OnMediaDistributed", // 媒体主动推送事件
        "113" : "OnTransferQueuedToAgentSuccess", // 排队用户转移成功事件
        "114" : "OnTransferQueuedToAgentFailure", // 排队用户转移失败事件
        "115" : "OnLockedWarning", // 座席加锁事件
        "116" : "OnSkillModified", // 技能被调整通知事件
        "117" : "OnWarningEvent", // 告警事件(包含所有告警)
        "118" : "OnMonitorStatEvent", // 监控事件
        "119" : "OnFailedEvent", // FAILED EVENT
        "120" : "OnFullListenNotify", // 全程监听通知事件
        "121" : "OnChatMsgReceived", // IM聊天信息事件
        "122" : "OnIMLinkDisconnected", // IM连接断开事件
        "123" : "OnRosterStatusArrived", // 好友状态信息
        "124" : "OnBeginChatReqReceived", // 收到开始聊天请求事件
        "125" : "OnChatEnd", // 收到结束聊天事件
        "126" : "OnLinkEnd", // 收到结束link事件
        "127" : "OnInvitedToDataConf", // 邀请进行数据会议
        "128" : "OnJoinDataConfSuccess", // 加入数据会议成功
        "129" : "OnJoinDataConfFailure", // 加入数据会议失败
        "130" : "OnDataConfEnd", // 数据会议结束
        "131" : "OnIMCallReceived", // 废弃
        "132" : "OnIMPhoneIdle", // 废弃
        "133" : "OnIMPhoneConnected", // 废弃
        "134" : "OnCreateChatRoomResult", // 收到创建聊天室消息
        "135" : "OnLoopMsgEnabled", // 测试事件
        "136" : "OnBeginCoachSuccess", // 开始教练成功
        "137" : "OnBeginCoachFailure", // 开始教练失败
        "138" : "OnEndCoachSuccess", // 结束教练成功
        "139" : "OnEndCoachFailure", // 结束教练失败
        "140" : "OnStudExitCoach", // 学生挂机结束事件

        "141" : "OnApplyRestDiscarded", // 已批准的请假超时废弃事件
        "142" : "OnSipCallInTimeOut", // Sip断链事件
        "143" : "OnChatMsgReceivedNew", // 新格式的IM聊天信息事件
        "144" : "OnVersionCompareResult", // 版本比较事件
        "145" : "OnCtiReport", // CTI主动通知座席
        "146" : "OnPlayEndEvent", // 放音结束事件
        "147" : "OnSnapShotCall", // SnapShot事件
        "148" : "OnQueueReqResult", // 排队结果通知
        "149" : "OnInvitedToChatRoom", // 被邀请加入聊天室
        "150" : "OnInviteToChatRoomResult", // 被邀请加入聊天室结果消息
        "151" : "OnChatRoomUserInfo", // 聊天室成员变更消息

        "152" : "OnImRecvFileTransReq", // 收到给本人传送文件请求
        "153" : "OnImFileTransRate", // 收到文件传送进度
        "154" : "OnImSenderCancelSend", // 得知对方取消文件传送
        "155" : "OnImReceiverCancelReceive", // 得知对方取消文件接收
        "156" : "OnImSendFileReqResult", // 收到对方确认接收文件
        "157" : "OnImSignInResult", // 登录IM服务器结果通知
        "158" : "OnImSendFileMsg", // 收到文件请求事件
        "159" : "OnImCancelSendFileMsg", // 收到取消文件请求事件
        "160" : "OnImSendFileAckMsg", // 收到文件请求应答事件
        "161" : "OnReleaseActiveCallSuccess", // 只发给ZTE方座席的扩展呼叫中(一个保持呼叫一个当前呼叫)当前呼叫释放成功
        "162" : "OnIMSAttachMessageArrived", // 对端发送附件事件
        "163" : "OnMessageReceiveEx", // 有消息到达【扩展】
        "164" : "OnRecordFailure", // 录音过程中出现异常
        "165" : "OnCTIAgentStateChanged", // CTI的座席状态通知事件
        "166" : "OnStartReportWorkNum",// 开始报工号事件
        
        // 0418新增
        "167" : "OnPacketLoss" ,         //网络丢包事件上报
		"168" : "OnForceOutEx",          //强制迁出，发起方触发
		"169" : "OnHardwareException",  //  硬件检测出现异常 
		"170" : "OnCallOutsideSuccessEx", // 呼出成功
		"171" : "OnCallOutsideSuccTalkEx", // 呼出通话
		"172" : "OnFailedEventEx", // 呼出失败事件
		"173" : "OnApplyAgtStatusReceive", //收到座席状态改变申请事件
		"174" : "OnApplyAgtStatusResult", // 座席状态改变申请结果事件
		
		// 0419
		"175" : "OnAllCallCleared", // 所有呼叫结束
		"176" : "OnDataBaseModeChanged", // 数据库模式发生切换
		
		// 0421
		"177" : "OnRecordUserEvent", // 音片段事件
		
		// 0423
		"178" : "OnVCSwitched", // 虚中心切换
		"179" : "OnACDDisconnected", // ACD断链
		"180" : "OnScpBcsmEvent", //自动业务向座席发送消息
		
		// 0424
		"181" : "OnAppointCallResultEvent", // 座席指定排队呼叫的结果通知
		"182" : "OnParkEnd", // park结束
		
		"188" : "OnRingingEvent", //振铃
		
		// 0426
        "189" : "OnAgentAppointBusy",  //当前座席忙时排队了呼叫
		
		"191" : "OnImBeginReqReceived",
		"192" : "OnImEnd",
		"193" : "OnImMsgReceived",
		"194" : "OnImMsgSendFail",
		"195" : "OnImTransfered",
		
		"196" : "OnMediaAbilityEvent",// IM能力改变
		
		"201" : "OnImConfMember", // IM会议成员变化
		"207" : "OnShareStart",
		"208" : "OnShareDisconnect",
		"209" : "OnShareStop",
		"212" : "OnRecvMessage", //recevie message
		"211" : "OnConference", //会议事件
		"210" : "OnRelease", //新挂机事件
		"214" : "OnCreateConference", //预约会议创建事件
		"215" : "OnTalking", //通话建立事件
		"217" : "OnShareTypeChange",
		"218" : "OnTransfer",
		"219" : "OnSingleTrans",
		"220" : "OnRecord",
		"221" : "OnConsultBack",
		"222" : "OnReturnFromIVR2",
		"223" : "OnForceLock",
		"224" : "OnForceBusy2",
		"225" : "OnForceIdle2",
        // AgentService事件
        "OnBeginScreenRecSuccess" : "OnBeginScreenRecSuccess",
        "OnBeginScreenRecFailure" : "OnBeginScreenRecFailure",
        "OnStopScreenRecSuccess" : "OnStopScreenRecSuccess",
        "OnStopScreenRecFailure" : "OnStopScreenRecFailure",
        "OnEndCapture" : "OnEndCapture",
        "OnScreenLock" : "OnScreenLock",
        "OnHotKeyPressed" : "OnHotKeyPressed",
        "OnEndRemoteDeskMntr":"OnEndRemoteDeskMntr"
    },

    /**
     * 初始化ainf控件，注册事件。
     */
    init : function(fun,lang)
    {
        // 取消当前ajax请求（反复执行登录操作时可能会出现多个事件同时请求）
        if (this.eventHttpReq) this.eventHttpReq.abort();
        this.lang = lang;
        this.stopGetEventFlag = false;
        
        var thisObj = this;
        
        this.getAinfServerURL(function(ainfSevURL)
        {
            var url = ainfSevURL + "RegEvent?lang="+lang;
            url = thisObj.getJsopURL(url);

            window.jQuery.jsonp(
            {
                url : url,
                async : false,
                dataType : "jsonp",
                success : function(sid)
                {
                    thisObj.eventRegName = sid;
                    fun(true);
                    thisObj.isConnection = true;
                    thisObj.regEvent();
                    WebAgent.info("Initialization AinfOCX success!");
                },
                error : function(err)
                {
                    WebAgent.error("Initialization Failure; AgentService Not Exist!");
                    fun(false);
                }
            });
        });
    },
    
    // 恢复会话
    restoreSession : function(fn)
    {
    	var thisobj = this;
    	this.init(function(isSucc)
    	{
    		if(isSucc)
    		{
    			thisobj.sessionLostTime = 0;
    			thisobj.stopGetEventFlag = false;
    			setTimeout(thisobj.bind(thisobj.regEvent, thisobj), 1);	
    		}else
    		{
    			thisobj.onAinfOcxAbnormalExit();
    		}
    		
    		if(fn) fn(isSucc);
    	},this.lang);
    },

    dispose : function()
    {
        if (this.eventHttpReq) this.eventHttpReq.abort();
        this.stopGetEventFlag = true;
    },
    
    getAinfServerURL : function(fn)
    {
        if (this.ainfSevURL)
        {
            fn(this.ainfSevURL);
        }
        else
        {
            var i = 0, thisObj = this;
            
            var checkAinfExistCallBack = function(ret)
            {
                if (ret)
                {
                    fn(thisObj.ainfSevURL);
                }
                else if (i < thisObj.potentialAinfServPort.length)
                {
                    setTimeout(checkAinfPort, 0);
                }
                else
                {
                    fn(null);
                }
            };
            
            var checkAinfPort = function()
            {
                thisObj.ainfServerPort = thisObj.potentialAinfServPort[i++];
                thisObj.ainfSevURL = "http://" + thisObj.ainfServer + ":" + thisObj.ainfServerPort + thisObj.ainfServAccessPath;
                thisObj._checkAInfExist(thisObj.ainfSevURL, checkAinfExistCallBack);
            };
                
            setTimeout(checkAinfPort, 0);
        }
    },
    
    _checkAInfExist: function(ainfServURL, fn)
    {
        var url = ainfServURL + "GetVersion";
        url = this.getJsopURL(url);
        window.jQuery.jsonp(
        {
            url : url,
            async : false,
            dataType : "jsonp",
            success : function(sid)
            {
                fn(true);
            },
            error : function(err)
            {
                fn(false);
            }
        });
    },
    
    checkAInfExist : function(fn)
    {
        var thisobj = this;
        
        this.getAinfServerURL(function(ainfSevURL)
        {
            if (ainfSevURL)
            {
                thisobj._checkAInfExist(ainfSevURL, fn);
            }
            else
            {
                fn(false);
            }
        });
    },

    Invoker : function(method, args, fun, isHandleErr)
    {
        if (isHandleErr)
        {
            return this.asynReqHttp2(method, args, fun);
        }
        else
        {
            return this.asynReqHttp(method, args, fun);
        }
    },

    Heartbeat : function(rate,fun)
    {
        return this.asynReqHttp2("Heartbeat", rate, fun);
    },

    GetAinfProperty : function(key, fun)
    {
        return this.asynReqHttp("GetAinfProperty", key, fun);
    },

    /**
     * jquery自带的jsonp请求,不能捕获error事件
     * 
     * @param method
     * @param args
     * @param fun
     * @returns
     */
    asynReqHttp : function(method, args, fun)
    {
        var invoker =
        {
            callBackFun : null,

            onResult : function(fun_)
            {
                this.callBackFun = fun_;
            },

            onAjaxResult : function(data)
            {
                if (this.callBackFun)
                {
                    this.callBackFun(data);
                }
            }
        };
        
        var thisObj = this;
        
        this.getAinfServerURL(function(ainfSevURL)
        {
            var url = ainfSevURL + method + "?" + args;
            url = thisObj.getJsopURL(url);
            
            setTimeout(function()
            {
                window.jQuery.getJSON(url, "", function(jsonData)
                {
                    try
                    {
                        // 回调形式1， 匿名回调
                        if (fun) setTimeout(function()
                        {
                            fun(jsonData);
                        }, 1);

                        // 回调形式2，通过放回的invoker对象回调
                        setTimeout(function()
                        {
                            invoker.onAjaxResult(jsonData);
                        }, 1);
                    }
                    catch (e)
                    {
                        // 代码已被释放
                    }
                });
            }, 1);
        });
        
        return invoker;
    },

    /**
     * 带错误事件的jsonp请求，在模态窗口中调用该方法时，不会立即触发回调函数，除非窗口关闭。
     * 
     * @param method
     * @param args
     * @param fun
     * @returns
     */
    asynReqHttp2 : function(method, args, fun)
    {
        var invoker =
        {
            callBackFun : null,

            onResult : function(fun_)
            {
                this.callBackFun = fun_;
            },

            onAjaxResult : function(data)
            {
                if (this.callBackFun)
                {
                    this.callBackFun(data);
                }
            }
        };

        var thisobj = this;
        // 保证invoker返回后才开始调用ajax
        this.getAinfServerURL(function(ainfSevURL)
        {
            var url = ainfSevURL + method + "?" + args;
            url = thisobj.getJsopURL(url);
            var result = null;

            window.jQuery.jsonp(
            {
                url : url,

                async : false,

                timeout : thisobj.reqTimeout,

                dataType : "jsonp",

                success : function(result)
                {
                    thisobj.errTime = 0;

                    // 直接回调
                    if (fun) fun(result);

                    // invoker对象回调
                    invoker.onAjaxResult(result);

                    // 事件触发
                    WebAgent.EventBus.dispatchEvent("OnInvokeResult_" + method, [ result ]);
                },

                error : function(err)
                {
                    if (fun) fun("err");
                    WebAgent.EventBus.dispatchEvent("OnInvokeError", []);
                }
            });
        });

        return invoker;
    },

    /**
     * 请求事件,jsonp插件，带error事件
     * 
     * @returns
     * @private
     */
    regEvent : function()
    {
        if( this.stopGetEventFlag ) return;
        WebAgent.debug("GUI >>> GetEvent() ");
        var bgTimer = new Date().getTime();
        var thisobj = this;
        
        this.getAinfServerURL(function(ainfSevURL)
        {
            var url = ainfSevURL + "GetEvent?sessionid=" + thisobj.eventRegName;
            url = thisobj.getJsopURL(url);
            
            if (this.eventHttpReq) this.eventHttpReq.abort();
            this.eventHttpReq = window.jQuery.jsonp(
            {
                url : url,
                async : false,
                dataType : "jsonp",
                timeout : thisobj.reqTimeout,
                success : function(events)
                {
                    thisobj.eventHttpReq = null;
                    
                    //session丢失
                    if(events ==-1) 
                    {
                         WebAgent.error(" GUI <<< GetEvent(err). Get Event error! (Session is lost) ");
                         thisobj.onSessionLost();
                         return;
                    }
                    // 超时返回
                    else if( (!events) || (events==""))
                    {
                        thisobj.errTime = 0;
                        setTimeout(thisobj.bind(thisobj.regEvent, thisobj), 1);
                        WebAgent.info(" GUI <<< GetEvent(). Get Event successful! (Timeout return)");
                        return;
                    }
                    // 获取事件成功
                    else
                    {
                         thisobj.errTime = 0;
                         setTimeout(thisobj.bind(thisobj.regEvent, thisobj), 1);
                    }
                   
                    // 分发事件
                    if ((events) && (events!=""))
                    {
                        //setTimeout(function() //会导致事件延迟30几毫秒
                        //{
                        try{
                            WebAgent.info(" GUI <<< GetEvent(events). Get Event successful!  ");
                            var e;
                            var eventName;
                            var args;
                            var event_;
                            
                            // 广播全局事件，优先级较低
                            var fun = function(event_)
                            {
                                return function()
                                {
                                    try
                                    {
                                        WebAgent.EventBus.dispatchEvent("OnAinfEvent", [event_]);
                                    }catch(e){WebAgent.warn("fireEvent OnAinfEvent event=["+event_.name+"] , err:"+e);}           
                                };
                            };
                            
                            var jsonArgs = null;
                            
                            for ( var i = 0; i < events.length; i++)
                            {
                                e = events[i];
                                eventName = thisobj.ainfEventMap[e.eventName];
                                eventName = (!eventName) ? e.eventName : eventName;
                                // 先尝试对字符串进行JSON解析，如果是JSON对象，则判断是非含有list属性，改属性就是参数数组，否则就是|连接的字符串
                                try
                                {
                                	jsonArgs = JSON.parse(e.args);                                	
                                }
                                catch(e1)
                                {
                                	WebAgent.error("JSON.parse args error");
                                	jsonArgs = null;
                                }
                                if(jsonArgs && jsonArgs.list)
                                {
                                	args = jsonArgs.list;
                                }
                                else
                                {
                                	args = e.args.split("|");
                                }                               
                                
                                WebAgent.info("         Event = " + eventName + ";  EventCode="+e.eventName+";  args=" + e.args);
                                WebAgent.EventBus.dispatchEvent(eventName, args);
                                event_ ={"name":eventName,"code":e.eventName,"args":args};
                                //fun(event_);
                                setTimeout(fun(event_),1);//会导致事件延迟30几毫秒
                            }
                        }catch(e2)
                        {
                            WebAgent.warn("fireEvent OnAinfEvent [for..in] err:"+e2);
                        }   
                        //}, 1);
                    }
                },

                error : function()
                {
                    WebAgent.error(" GUI <<< GetEvent(err). Get Event error! ");
                    if ((++thisobj.errTime) >= thisobj.tryTime)
                    {
                        thisobj.onAinfOcxAbnormalExit();
                    }else
                    {
                         setTimeout(thisobj.bind(thisobj.regEvent, thisobj), 5000);
                    }
                }
            });
        });
    },
    
    /**
     * 会话丢失
     */
    onSessionLost : function()
    {
		if((++this.sessionLostTime) >= this.sessionLostTryTime)
		{
			this.stopGetEventFlag = false;
			WebAgent.EventHelper.notify("OnSessionLost",[this.sessionLostTime]);
		}
		else
		{
		    setTimeout(this.bind(this.regEvent, this), 1);
		}
    },
    
    /**
     * 控件异常退出
     */
    onAinfOcxAbnormalExit : function()
    {
    	// 广播“控件异常退出”事件
        WebAgent.EventBus.dispatchEvent("OnAinfOcxAbnormalExit", []);
        WebAgent.error("Disconnected with the AinfOcx server!(RetryCount="+this.tryTime+", errCount="+this.errTime+")");
    },

    /**
     * 把url地址转换为jsonp格式的地址
     */
    getJsopURL : function(url)
    {
        if (url.lastIndexOf("?") == -1)
        {
            url = url + "?callback=?";
        }
        else
        {
            url = url + "&callback=?";
        }
        
        //设置扩展参数
        for(var i in this.fixedUrlParam)
        {
        	url +="&"+i+"="+this.fixedUrlParam[i];
        }
        return url;
    },

    setJsonpTimeout : function(fun_)
    {
		
    },
    
    /**
     * 设置每次请求的url地址固定参数
     */
    setFixedUrlParam : function(map)
    {
    	this.fixedUrlParam = map;
    },

    bind : function(fun, ctx)
    {
        var tempFun = function()
        {
            return fun.apply(ctx, arguments);
        };
        return tempFun;
    }
};