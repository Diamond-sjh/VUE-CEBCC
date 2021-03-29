var /**
 * @author 10129700
 *
 */
/**
 * @author 10129700
 *
 */
/**
 * @author 10129700
 *
 */
pcphone = function(){};
ZteAgent.regAdapter("pcphone",pcphone); // 注册为ZteAgent.pcphone

/**
 * 会议管理器
 */
var ConfManager=function()
{
	this.eh=null;
	this.isConfMaster=false; //是否会议主持人
	this.isInConference = false; //是否在会议中
	//member={memberType:xxx,memberId:xxx,memberPhoneNo:xxx, membserCallSpeak:xxx,memberState:xxx}
	//0坐席，1网户，2外部用户，
	this.memberList = null;
	this.mediaType = null; //1音频，2视频
	this.CONF_STATE_CODE = 305; //会议状态码
	this.eventHandler = null; //会议事件处理函数
	this.webStorageKeys={
			CONF_MASTER:"confMasterFlag",
			IS_IN_CONFERENCE:"isInConerenceFlag",
			MEMBER_LIST:"memberListInfo",
			MEDIATYPE:"mediaType"
		};
};
// 实现接口相关方法。
pcphone.prototype =
{
        /**
         * 初始化
         * 
         * @param lang语言en”英文，“zh-CN”中文
         * @param cbFun回调函数
         */
        init : function(lang, cbFun)
        {
            var self =  this;
            this.loadJs(function()
            {
                self.loadi18nJs(lang, function()
                {
                    AgentClient.init(function(ret)
                    {
                       if(cbFun)cbFun(ret, ret == true?"init succ.": "init failed.");
                    }, self);
                });
            });
        },
        /**
         * AgentClient.inovker调用回调函数通用处理函数
         * @param ret
         * @param cbFun
         */
        _invokerCallBack : function(methodName, ret, cbFun){
            var isSucc = false;
            var resultCode = "Succ";
            ZteAgent.log("AgentClient." + methodName+ ", result:" + JSON.stringify(ret), "debug");
            if(ret.result ==AgentClient.ErrorCode.SUCCEEDED)
            {
                isSucc = true;
            }else
            {
                resultCode = ret.result;
            }
            ZteAgent.log("ZteAgent." + methodName+ ", result:" +[isSucc, resultCode].join(","), "debug");     
            if(cbFun)
            {

                if(isSucc)
                {
                       cbFun(isSucc,  resultCode); 
                }else
                {
                      cbFun(isSucc, resultCode);
                }
            }
        },  
		/**
		 * 加载所需js文件,路径位于{agtBar}/sipphone/webagent.js
		 * 
		 * @Return {List<Url>}
		 */
		loadJs : function(cbFun)
		{
			var jsArr = [ ZteAgent.getBaseUrl() + "js/pcphone/AgentClient.js"];
			ZteAgent.script.loadJs(jsArr, cbFun);
		},
		/**
		 * 加载国际化资源文件JS
		 * @param cbFun
		 */
		loadi18nJs : function(lang, cbFun)
		{
		    if(lang == "zh")
		     {
		        lang = "zh_CN";
		     }
		    var jsArr = [ ZteAgent.getBaseUrl() + "js/pcphone/i18n/AgentClient_"+lang+".js",
		                  ZteAgent.getBaseUrl() + "js/pcphone/util/i18n.js" ];
            ZteAgent.script.loadJs(jsArr, cbFun);
		},

		/**
		 * 嵌入
		 * 
		 * @param op Object
		 * @param cbFun
		 */
		signIn : function(op, cbFun)
        {
            // 执行签入
            var self = this;
            self.loadJs(function()
              {
                      var lang = op.lang;
                       if(!lang)
                       {
                           lang = "zh";
                       }
                       self.loadi18nJs(lang, function (){
                           ZteAgent.log("ZteAgent.signIn Params:" + JSON.stringify(op), "info");
                           ZteAgent.signInCfgObj = op;
                           var getInitInfoParam =
                               {
                                   Vcid : op.vcid,
                                   agtid : op.agtId,
                                   pwd : op.pwd,
                                   Mac : op.phoneNo,
                                   Phonetype : op.phoneType,
                                   Agttel : op.phoneNo,
                                   SessionIdFlag : 0,
                                   clientflag : 2
                               };
                           var zeroCfgUrl = op.cfgUrl;
                           if(zeroCfgUrl.indexOf("agentproxy")== -1)
                           {
                               zeroCfgUrl += "/agentproxy";
                           }
                           AgentClient.getInitInfo(
                                           zeroCfgUrl,
                                           getInitInfoParam,
                                           function(ret)
                                           {
                                               ZteAgent.log( "AgentClient.signIn before getInit Result:" + JSON.stringify(ret), "debug");
                                               if (ret.result == AgentClient.ErrorCode.SUCCEEDED || ret.result == AgentClient.ErrorCode.ALREADY_GETINITINFO)
                                               {
                                                   //ZteAgent.log("get infServ url:["+ url+"]", "info");
                                                   ZteAgent.infServInit("http://10.116.34.6:8030/mr/js/jquery.callouter.min.js");
                                                // TODO 获取零配置中接口服务的地址
                                                   var signInParam =
                                                       {
                                                           agttel : op.phoneNo,
                                                           pwd : op.pwd,
                                                           phonetype : op.phoneType,
                                                           mac : op.bindPhone
                                                       };
                                                   if(op.siteid)
                                                   {
                                                       signInParam.siteid = op.siteid;
                                                   }
                                                   if(op.fakeAgtCalling)
                                                   {
                                                       signInParam.fakeAgtCalling = op.fakeAgtCalling;
                                                   }
                                                   
                                                   if(op.longcnct)
                                                   {
                                                       signInParam.longcnct = op.longcnct;
                                                   }
                                                   AgentClient.signIn(signInParam, function(signInRet)
                                                                   {
                                                                       ZteAgent.log( "AgentClient.signIn Result:"+ JSON.stringify(signInRet), "debug");
                                                                       if (signInRet.result == AgentClient.ErrorCode.SUCCEEDED)
                                                                       {
                                                                          
                                                                           //TODO for test通话后自动示闲
                                                                           AgentClient.setProperties([" Idleflag=1;"]);
                                                                           //enable or disenable autoAnswer,
                                                                           if (op.extendParam && op.extendParam.idleFlag)
                                                                           {
                                                                               AgentClient.setProperties(["Idleflag=1;"]);
                                                                           }
                                                                           //enable or disenable autoAnswer,
                                                                           if (op.extendParam && op.extendParam.autoAnswer)
                                                                           {
                                                                               AgentClient.setProperties(["autoAnswer=1;"]);
                                                                               ZteAgent.autoAnswer = true;
                                                                           } else
                                                                           {
                                                                              AgentClient.setProperties("autoAnswer=0;");
                                                                              ZteAgent.autoAnswer = false;
                                                                           }
                                                                           //enable or disable initialReady
                                                                           if(op.extendParam && op.extendParam.initialReady)
                                                                           {
                                                                             self.idle();
                                                                           }
                                                                           //enable or disenable fullRecord
                                                                           if (op.extendParam && op.extendParam.fullRecord)
                                                                           {
                                                                               AgentClient.setProperties("fullRecord_audio=1;");
                                                                               AgentClient.setProperties("fullRecord_video=1;");
                                                                           } else
                                                                           {
                                                                               AgentClient.setProperties("fullRecord_audio=0;");
                                                                               AgentClient.setProperties("fullRecord_video=0;");
                                                                           }
                                                                           
                                                                           if (cbFun)
                                                                           {
                                                                               cbFun(true, "signIn Succ.");
                                                                           }
                                                                           ZteAgent.log("ZteAgent.signIn, result: {true}", "debug");
                                                                       } else
                                                                       {
                                                                           AgentClient.disposeInitInfo();
                                                                           ZteAgent.log("ZteAgent.signIn, result: {false}", "debug");
                                                                           if (cbFun)
                                                                           {
                                                                               cbFun(false, "signIn Failed.");
                                                                           }
                                                                       }
                                                                   }, self);
                                               }
                                           }, this);
                      });
                        
            });
        },

		/**
		 * 签出
		 * 
		 * @param cbFun
		 *            回调函数
		 */
		signOut : function(cbFun)
		{
		    var self = this;
		    AgentClient.signOut(false, function(ret)
		     {
		        self. _invokerCallBack("signOut",ret,cbFun);
		    }, this);
		},

		/**
		 * 设置自动应答或非自动应答
		 * 
		 * @param isAutoAnswer false非自动应答，true自动应答
		 *          
		 */
		setAnswerType : function(isAutoAnswer)
		{
			if(isAutoAnswer) //自动应答
			{
			    AgentClient.setProperties("autoAnswer=1;");
                ZteAgent.autoAnswer = true;
			}else
			{ //非自动应答
			    AgentClient.setProperties("autoAnswer=0;");
                ZteAgent.autoAnswer = false;
			}
		},

		/**
		 * @param agtId
		 * @param cbFun(result);
		 */
		getAgtInfo : function(agtId, cbFun)
		{
			// 获取坐席状态信息
		    AgentClient.invoke("GetAgtInfo", {kind:1,dstobj:agtId}, function(resultObj)
			{
                ZteAgent.log( "AgentClient.getAgtInfo, result:" + JSON.stringify(resultObj), "info");

				var ret =
					{
						vcid : AgentClient.agentInfo.vcid,
						agtId : agtId,
						phoneNo : AgentClient.agentInfo.bindPhone,
						agtState : AgentClient.getState().stateCode,
						groupId: AgentClient.agentInfo.groupId
					};
				if(cbFun)
				{cbFun(ret);}
				  ZteAgent.log("ZteAgent.getAgtInfo, result: "+ JSON.stringify(ret), "debug");
			}, this);
		},

		/**
		 * 是否在通话中
		 * 
		 */
		isCalling : function()
		{
		    var state= AgentClient.getState();
	        var isCall = false;
	        if (state && state.stateCode)
	        {
	            var code = state.stateCode * 1;
	             isCall = (code >= 300) && (code <= 311);
	        }
            ZteAgent.log("ZteAgent.isCalling, result: "+ isCall, "debug");

	        return isCall;
		},

		/**
		 * 示闲
		 * 
		 * @param cbFun
		 */
		idle : function(cbFun)
		{
		    var self = this;
		    AgentClient.invoke("SetIdle", {},function(ret)
		    {
		      self. _invokerCallBack("idle", ret, cbFun);
		    }, this);
		},

		/**
		 * 示忙
		 * 
		 * @param cbFun
		 */
		busy : function(cbFun)
		{
		    var self = this;
            AgentClient.invoke("SetBusy", {},function(ret)
             {
               self. _invokerCallBack("busy", ret, cbFun);
             }, this);
		},

		/**
		 * 坐席挂机（挂断当前与坐席通话的电话）
		 * @param userData坐席挂机时传递的随路数据
		 * @param cbFun
		 */
		hangUp : function(userData, cbFun)
		{
			if (userData == null || userData == undefined)
			{
				userData = "";
			}
			
			// 对接入用户通话进行特殊保护，防止挂掉第二个呼入的电话
			var stateCode = AgentClient.getState().stateCode * 1;
			if ((stateCode == 312 || stateCode == 300)
					&& ZteAgent.callInStartTime > 0)
			{
				var time = new Date().getTime() - ZteAgent.callInStartTime;
				if (time < 6000)
				{
					return;
				}
			}

			//不区分通过callid挂断自己或者通过坐席电话挂断自己，只使用根据坐席电话挂断自己
				var phoneNo = ZteAgent.getAgtInfo().phoneNo;
				this.releaseCall(phoneNo, userData, "", function(isSucc, desc)
				 {
				        if (cbFun)
                            cbFun(isSucc, desc);
			            ZteAgent.log("ZteAgent.hangUp, result: "+ [isSucc, desc].join(","), "debug");
				});
		},
		/**
		 * 释放掉连接到当前坐席的指定号码的呼叫
		 * 
		 * @param phoneNo
		 * @param userdata
		 * @param extendParams
		 * @param cbFun
		 */
		releaseCall:function(phoneNo, userdata,extendParams, cbFun)
		{
		    var self = this;
		    if(!userdata)
		    {
		        userdata = "";
		    }
		    var paramObj = {dstobj:phoneNo,userdata:userdata};
	          ZteAgent.log("AgentClient.releaseCall, params: "+ JSON.stringify(paramObj), "debug");

			AgentClient.invoke("ReleaseCall", paramObj, function(ret)
			{
			    self._invokerCallBack("releaseCall", ret, cbFun);
			}, this);
		},

		/**
		 * 应答
		 * 
		 * @param cbFun
		 */
		answer : function(cbFun)
		{
		    var self = this;
            AgentClient.invoke("Answer",{},function(ret)
            {
                self._invokerCallBack("answer", ret, cbFun);
            }, this);
		},

		/**
		 * 保持
		 * 
		 * @param cbFun
		 */
		hold : function(cbFun)
		{
		    var self = this;
            AgentClient.invoke("Hold",{},function(ret)
            {
                self._invokerCallBack("hold", ret, cbFun);
            }, this);
		},
		/**
		 * 取消保持
		 * 
		 * @param cbFun
		 */
		cancelHold : function(cbFun)
		{
		    var self = this;
            AgentClient.invoke("Retrieve",{},function(ret)
            {
                self._invokerCallBack("cancelHold", ret, cbFun);
            }, this);
		},
		/**
		 * 整理
		 * 
		 * @param cbFun
		 */
		adjust : function(adjustTime, cbFun)
		{
		    //TODO  整理功能如何实现？
		//	var isCalling = WebAgent.isCalling();
			// 设置整理时长，达到整理时长后自动进入示闲
		//	WebAgent.invoker("StatusMonitor", [ 4, adjustTime, 0, "SetIdle" ]);

			// 未在通话状态下，进入整理状态
			//if (!isCalling)
		//	{
			//	WebAgent.invoker("StatusMonitor",
				//		[ 0, 0, 0, "AgentEnterWrapUp" ]);
		//	}
		},

		/**
		 * 取消整理
		 * 
		 * @param cbFun
		 */
		cancelAdjust : function(cbFun)
		{
		    //TODO  整理功能如何实现？
		//	var isCalling = WebAgent.isCalling();
		/*	if (isCalling)
			{
				// 通话状态下，取消进入示闲操作
				WebAgent.invoker("StatusMonitor", [ 4, -1, 0, "SetIdle" ]);
			} else
			{
				// 非通话状态下，取消整理，立即进入示闲状态
				WebAgent.invoker("StatusMonitor", [ 0, 0, 0, "SetIdle" ]);
			}*/
		},

		/**
		 * 呼叫座席
		 * @param dstAgetId  呼叫目标工号
		 * @param calltype 1音频（默认）2视频
		 * @param userData 用户业务数据 最大长度516字节
		 * @param extendParams  扩展参数对象
		 * @param cbFun
		 */
		callAgt : function(dstAgtId, callType, userData, extendParams, cbFun)
		{
		    var self = this;
		    var callData = "CT=" + callType;
		    var callInSideParam = {
		            agtid:dstAgtId,
		            objtype:0, //0agentid, 1 webuserid
		            userdata:userData,
		            calldata:callData
		    };
		    
            AgentClient.invoke("SetPreCall",{},function(ret)
                    {
                            self._invokerCallBack("setPreCall", ret, function(isSucc, desc)
                            {
                               if(isSucc)
                               {
                                   AgentClient.invoke("CallInSide",callInSideParam,function(ret)
                                           {
                                               self._invokerCallBack("callAgt", ret, cbFun);
                                           }, self);
                               }
                            });
                    }, this);
		},
		/**
		 * 呼叫用户
		 * 
		 * @param called  被叫号码
		 * @param calling 主叫号码
		 * @param calltype  1音频（默认）2视频
		 * @param extendParams 扩展参数对象
		 * @param cbFun  回调函数
		 */
		callUser : function(calledNo,callType, callingNo, extendParams, cbFun)
		{
		    
		    var self = this;
            var callData = "CT=" + callType;
            if(!callingNo)
            {
                callingNo = "";
            }
            var callOutSideParam = {
                    mode:0,
                    dstobj:calledNo,
                    callingnum:callingNo,
                    userdata:userData,
                    calldata:callData
            };
 
            AgentClient.invoke("SetPreCall",{},function(ret)
            {
                    self._invokerCallBack("setPreCall", ret, function(isSucc, desc)
                    {
                       if(isSucc)
                            {
                                AgentClient.invoke("CallOutSide",callOutSideParam,function(ret)
                                        {
                                            self._invokerCallBack("callUser", ret, cbFun);
                                        }, self);
                            }
                    });
            }, this);
		},
		/**
		 * 坐席发起呼叫接口
		 * @param callType 1音频 2视频
		 * @param objType 目标类型。0-座席；1-网络用户；2-用户
		 * @param obj  目标号码 0-座席工号；1-网户uid；2-用户号码
		 * @param callingNo 呼出时的主叫号码,最大长度24字节（不包含字符串结束符）。该输入参数为空时呼出的主叫号码为缺省的系统主叫号码
		 * @param userData 用户随路数据 当objType=0和objType=1有效
		 * @param extendParams 扩展参数
		 * @param cbFun
		 */
		makeCall:function(callType, objType, obj, callingNo, userData, extendParams, cbFun)
		{
		    var self = this;
            var callData = "CT=" + callType;
            if(!userData)
            {
                userData = "";
            }
            if(!callingNo)
            {
                callingNo = "";
            }
            switch(objType)
            {
            case "0":
            case "1":
                var callParam =
                    {
                        agtid : obj,
                        objtype : objType, // 0agentid, 1 webuserid
                        userdata : userData,
                        calldata : callData
                    };

                AgentClient.invoke("SetPreCall",{},function(ret)
                {
                    self._invokerCallBack("setPreCall", ret, function(isSucc, desc){
                        if(isSucc)
                        {
                            AgentClient.invoke("CallInSide", callParam, function(result)
                                    {
                                        self._invokerCallBack("makeCall", result, cbFun);
                                    }, self);
                        }
                        });
                }, self);
             
                break;
            case "2":
                var callOutSideParam =
                    {
                        mode : 0, //0普通呼出、1网户呼叫IVR，2 网户呼叫IVVR
                        dstobj : obj,
                        callingnum : callingNo,
                        userdata : userData,
                        calldata : callData
                    };

                AgentClient.invoke("SetPreCall",{},function(ret)
                        {
                            self._invokerCallBack("setPreCall", ret, function(isSucc, desc){
                                if(isSucc)
                                {
                                    AgentClient.invoke("CallOutSide", callOutSideParam, function(result)
                                            {
                                                self._invokerCallBack("makeCall", result, cbFun);
                                            }, self);
                                }
                                });
                        }, self);
            
                break;
            }
		},

		/**
		 * 发送消息
		 * @param kind    目标类型 1：指定座席，2：指定组
		 * @param dstObj   目标座席工号或者组号
		 * @param msgType  0文本，1指令
		 * @param msg  消息内容
		 * @param extendParams 扩展参数对象 object
		 * @param cbFun
		 */
		sendMsg : function(kind, dstObj, msgType, msg, extendParams, cbFun)
		{
			var internalMsgType = 10000;
			if (msgType == 1)
			{
				internalMsgType = 10001;
			}
			var param = {
			        kind:kind,
			        obj : dstObj,
			        msgtype: internalMsgType,
			        msg:msg,
			        param:"",
			        exinfo:""
			  };
			var self = this;
			AgentClient.invoke("SendMessageToAgent", param, function(ret)
			{
			    self._invokerCallBack("sendMsg", ret, cbFun);
			}, this);
		},

		/**
		 * 咨询转
		 * 
		 * @param cbFun
		 */
		consultTransfer : function(cbFun)
		{
		    var self = this;
		    AgentClient.invoke("Transfer", {}, function(ret)
            {
                self._invokerCallBack("consultTransfer", ret, cbFun);
            },this);
		},

		/**
		 * 单步转(释放转),直接转接并挂机交给平台处理，不保证转接成功
		 * TODO 暂不支持4
		 * @param transferType
		 *            转接类型 0:座席工号，1：外部号码，2：技能组标识，3：IVR/MS，4：其他平台的呼叫中心技能
		 * @param dstObj
		 *            目标号码 目标号码,根据transferType填写：<br>
		 *            0-座席工号 <br>
		 *            1-用户号码 <br>
		 *            2-技能号 <br>
		 *            3-业务接入码
		 * @param callingNo
		 *            选填 主叫号码，最大19个字符
		 * @param userData
		 *            可选 业务数据
		 * @param paramObj
		 *            扩展参数对象
		 * @param cbFun
		 *            异步回到函数
		 */
		singleStepTransfer : function(transferType, dstObj, callingNo,
				userData, paramObj, cbFun)
		{
		    var self = this;
		    if(!callingNo)
		    {
		        callingNo = "";
		    }
		    if(!userData)
		    {
		      userData = "";    
		    }
		    var params =
            {
                transfertype : transferType, //0普通呼出、1网户呼叫IVR，2 网户呼叫IVVR
                dstobj : dstObj,
                callingnum : callingNo,
                userdata : userData,
                exinfo:""
            };
		    
		    AgentClient.invoke("SingleTrans", params, function(ret)
		            {
		                self._invokerCallBack("singleStepTransfer", ret, cbFun);
		            },this);
		},
		
		/**
		 * 成功转,保持当前通话并呼叫目标坐席或工号成功后转接，保证转接成功
		 * 
		 * @param transferType  转接类型 0:座席工号，1：外部号码，2：技能组标识
		 * @param dstObj  目标号码 目标号码,根据transferType填写：<br>  0-座席工号 <br>  1-用户号码 <br>   2-技能号 <br>
		 * @param callingNo  选填 主叫号码，最大19个字符
		 * @param userData  可选 业务数据
		 * @param paramObj  扩展参数对象
		 * @param cbFun  异步回到函数
		 */
		succTransfer:function(transferType, dstObj, callingNo, userData, paramObj, cbFun)
		{
		    var self = this;
		    if(!callingNo)
            {
		        callingNo = "";
            }
		    if(!userData)
            {
               userData = "";
            }
			var transferFun = function(result, desc)
			{
	            var evtHolder =  new AgentClient.EventListenerHolder();
				//咨询成功后调用咨询转完成转接
				if(result==true)
				{
				    var listener = function(ret)
	                  {
                        self.consultTransfer(cbFun);
                        evtHolder.clear();
                        evtHolder = null;
                     };
				  evtHolder.one(["OnTalking"], listener, self );
				}else
				{
				    evtHolder = null;
					if(cbFun)
						cbFun(result, desc);
				}
			};
			this.consult(transferType, dstObj, callingNo, userData, null, transferFun);
		},
		
		/**
         * 会议
         * 
         * @param cbFun
         */
        conference : function(cbFun)
        {
            var self = this;
            AgentClient.invoke("Conference", {}, function(ret)
             {
                   self._invokerCallBack("conference", ret, cbFun);
             }, this);
        },

		/**
		 * 单步会议
		 * 
		 * @param callType 呼叫类型 1音频，2视频
		 * @param dstobj 目标号码或者工号
		 * @param objType 目标类型 0-座席工号 1-外部用户号码 2-网户
		 * @param canspeak  0-只听不说 1-可听可说
		 * @param userData 业务数据
		 * @param extendParams 扩展数据对象
		 * @param cbFun  异步回到函数 定义为function(isSucc,errCode)
		 */
		singleStepConf : function(callType, dstObj, objType, canSpeak,
				userData, extendParams, cbFun)
		{
			var self = this;
			var callData = "CT=" + callType + ";";
			if(!userData)
			 {
			    userData = "";
			 }
	            if(objType == 1)
	            {
	                objType =2;
	            }else if(objType == 2)
	            {
	                objType = 1;
	            }
			var params = {
			        canspeak:canSpeak,
			        objtype:objType,
			        dstobj:dstObj,
			        userdata:userData,
			        calldata:callData
			};
			 
			AgentClient.invoke("SingleConf", params, function(ret)
	         {
	               self._invokerCallBack("singleStepConf", ret, cbFun);
	         },this);
		},

		/**
		 * 咨询
		 * 
		 * @param consultType 咨询类型:<br> 0:座席工号，1：外部用户号码，2：技能，3：IVR，  4：远端咨询dao用户
		 * @param dstObj
		 * @param callingNo  选填 主叫号码 最大10个字符
		 * @param userData  选填 用户业务数据
		 * @param extendParams  扩展数据对象
		 * @param cbFun   异步回调函数
		 */
		consult : function(consultType, dstObj, callingNo, userData, extendParams, cbFun)
		{
		    if(!callingNo)
            {
                callingNo = "";
            }
            if(!userData)
            {
               userData = "";
            }
		    var params =
            {
                consulttype : consultType, //0普通呼出、1网户呼叫IVR，2 网户呼叫IVVR
                dstobj : dstObj,
                callingnum : callingNo,
                userdata : userData,
                exinfo:""
            };
            var self = this;
            AgentClient.invoke("Consult", params, function(ret)
             {
                     self._invokerCallBack("consult", ret, cbFun);
             }, this);
		},
		
		/**
		 * 座席在发起咨询操作后，通过该reconnect操作来结束和被咨询方的通话，同时恢复之前通话。
		 * @param cbFun
		 */
		reconnect : function(cbFun)
		{
		    AgentClient.invoke("Reconnect", {}, function(ret)
		             {
		                   self._invokerCallBack("reconnect", ret, cbFun);
		             }, this); 
		},
		
		/**
		 * 座席把一个被保持呼叫的设备恢复通话，把一个正在通话的设备变为保持
		 * @param cbFun
		 */
		alternate : function(cbFun)
		{
		    AgentClient.invoke("Alternate", {}, function(ret)
                    {
                          self._invokerCallBack("alternate", ret, cbFun);
                    }, this); 
		},
		
		/**
		 * 设置全程监听 班长座席同一时刻只能针对一个目标座席设置全程监听。
		 */
		setFullListen : function(flag, agtId, rejectincoming, extendParams, cbFun)
		{
		    var paramObj = {
		            flag: flag,
		            agtid: agtId,
		             rejectincoming:rejectincoming
		    };
            AgentClient.invoke("SetFullListen", paramObj, function(ret)
                    {
                          self._invokerCallBack("setFullListen", ret, cbFun);
                    }, this); 
		},
		/**
         * 强制示忙
         */
        forceBusy : function(agtId, cbFun)
        {
            var paramObj = {
                    agtid: agtId
            };
            AgentClient.invoke("ForceBusy", paramObj, function(ret)
                    {
                          self._invokerCallBack("forceBusy", ret, cbFun);
                    }, this); 
        },
        
        /**
         * 强制示闲
         */
        forceIdle : function(agtId, cbFun)
        {
            var paramObj = {
                    agtid: agtId
            };
            AgentClient.invoke("ForceIdle", paramObj, function(ret)
                    {
                          self._invokerCallBack("forceIdle", ret, cbFun);
                    }, this); 
        },
        /**
         * 强制签出
         */
        forceOut : function(agtId, cbFun)
        {
            var paramObj = {
                    agtid: agtId
            };
            AgentClient.invoke("ForceOut", paramObj, function(ret)
                    {
                          self._invokerCallBack("forceOut", ret, cbFun);
                    }, this); 
        },
        /**
         * 强制锁定
         */
        forceLock : function(agtId, cbFun)
        {
            var paramObj = {
                    agtid: agtId
            };
            AgentClient.invoke("ForceLock", paramObj, function(ret)
                    {
                          self._invokerCallBack("forceLock", ret, cbFun);
                    }, this); 
        },
        /**
         * 对指定座席的所有呼叫进行强拆，结束该座席参与的所有呼叫，该座席进入话后整理态。
         */
        forceClear : function(agtId, cbFun)
        {
            var paramObj = {
                    agtid: agtId
            };
            AgentClient.invoke("ForceClear", paramObj, function(ret)
                    {
                          self._invokerCallBack("forceClear", ret, cbFun);
                    }, this); 
        },
        
        /**
         * 监听/插话
         * @param agtId  被监听/插话的座席的工号  
         * @param mediaType 0：audio 1：vedio
         * @param type 0：监听 1：插话
         * @param cbFun
         */
        insert : function(agtId, mediaType, type, extendParams,  cbFun)
        {
            var paramObj = {
                    agtid: agtId,
                    mediatype : mediaType,
                    type: type
            };
            AgentClient.invoke("Insert", paramObj, function(ret)
                    {
                          self._invokerCallBack("insert", ret, cbFun);
                    }, this); 
        },
        
        /**
         * 拦截指定座席处于通话的呼叫
         * @param agtId
         * @param mediaType
         * @param extendParam
         * @param cbFun
         */
        intercept : function(agtId, mediaType, extendParams,  cbFun)
        {
            var paramObj = {
                    agtid: agtId,
                    mediatype : mediaType,
                    type: type
            };
            AgentClient.invoke("Intercept", paramObj, function(ret)
                    {
                          self._invokerCallBack("intercept", ret, cbFun);
                    }, this); 
        },
        /**
         * 主动发起远程共享（本机作为服务端）
         * @param shareType 共享类型： 0：只看，不操作  1：可看，可操作
         * @param content 0：桌面 1：应用
         * @param remoteType 端终端的类型： 0：坐席 1：用户
         * @param vcId 座席虚中心号（用户填0），目前只支持向本VC的agent共享
         * @param remoteId remoteType=0时，座席工号；remoteType=1时，用户UID
         * @param exInfo 扩展参数
         * @param cbFun
         */
        startShareServer : function( shareType,  content,  remoteType,  vcId,  remoteId,  exInfo, cbFun)
        {
        //TODO
        },
        /**
         * 停止远程共享服务
         * @param remoteType  端终端的类型： 0：坐席 1：用户
         * @param vcId 座席虚中心号（用户填0），目前只支持向本VC的agent共享
         * @param remoteId  remoteType=0时，座席工号；remoteType=1时，用户UID
         * @param exinfo 扩展参数
         */
        stopShareServer : function(remoteType,  vcId,  remoteId,  exinfo)
        {
        	//TODO
        },
        /**
         * 服务端修改客户端的共享模式（仅服务端可调用此方法）
         * @param shareType  共享类型： 0：只看，不操作  1：可看，可操作
         * @param remoteType 端终端的类型： 0：坐席 1：用户
         * @param vcId  vcId 座席虚中心号（用户填0），目前只支持向本VC的agent共享
         * @param remoteId remoteType=0时，座席工号；remoteType=1时，用户UID
         * @param exInfo 扩展参数
         */
        changeRemoteShareType : function(shareType,  remoteType,  vcId,  remoteId,  exInfo)
        {
        	//TODO
        },

		/**
		 * 设置实时媒体处理能力 
		 * @param type 0：设置实时媒体(聊天等)
		 * 1：设置非实时媒体(传真等)
		 * 2：设置实时媒体+非实时媒体 
		 * @param value Value： 1-999：能力关闭 1001-1999：能力启动 （0与1000保留内部使用） 
		 * @param cause 原因码
		 * @param param
		 */
		setMediaIdle:function(cbFun)
		{
		    var self = this;
		    var params = {
		            type:2,
		            value:1001,
		            cause:0,
		            param:""
		    };
            AgentClient.invoke("SetMediaStatus", params, function(ret)
                {
                      self._invokerCallBack("setMediaIdle", ret, cbFun);
                });
		},
		/**
		 * 设置媒体示忙
		 */
		setMediaBusy:function(cbFun)
		{
            var self = this;
            var params = {
                    type: 2,
                    value:999,
                    cause:0,
                    param:""
            };
            
            AgentClient.invoke("SetMediaStatus", params, function(ret)
                {
                      self._invokerCallBack("setMediaIdle", ret, cbFun);
                });
		},
		/**
		 * 获取当前媒体处理能力状态
		 * @return true媒体示忙，false媒体示闲
		 */
		getMediaState:function()
		{
		    var state = AgentClient.getMediaState();
		    if(1 <= state &&  state <= 999)
		    {
		        return true;
		    }else if(1001 <= state && state <= 1999)
		    {
		        return false;
		    }
		},

		/**
		 * 结束即时消息会话
		 * @param flowNo 流水号
		 * @param peerKind 对端类型
		 * @param peerId  Kind=1: peerId为“座席工号” Kind=2: peerId为用户JID
		 * @param mediaType 媒体类型 (只针对kind=2有效) 
		 * @param subType 媒体子类型 (只针对kind=2有效) 
		 * @param cause 结束原因 座席结束(0~499)
         * @param imLinkId 本次连接Id
		 * @param param
		 * @param cbFun(isSucc, err) 0为成功，其他失败（负数为A接口错误码，正数为CTI返回错误码），
		 * 详细定义如下：0：成功-1：坐席未登录-2：参数错误-3：超时-4：发送CTI失败-5：CTI响应消息错误-6：目的坐席不存在
		 */
		imEnd:function(flowNo, peerKind, peerId, mediaType,subType, cause, imLinkId, param, cbFun){
		    var paramObj = {
		      idno:flowNo,
		      kind:peerKind,
		      peerid:peerId,
		      mediatype:mediaType,
		      subtype:subType,
		      cause:cause,
		      imlinkid:imLinkId,
		      param : param
		    };
		    var self = this;
		    AgentClient.invoke("ImEnd", paramObj, function(ret)
		           {
		                self._invokerCallBack("imEnd", ret, cbFun);
		           }, this);
		},
		/**
		 * 坐席发送即时消息
		 * @param flowNo
		 * @param peerKind
		 * @param peerId
		 * @param mediaType
		 * @param subType
		 * @param msgid 消息标识
		 * @param content 消息内容，最大1000个英文字符
		 * @param imLinkId 本次连接Id
		 * @param param
		 * @param cbFun(isSucc, err) 0为成功，其他失败（负数为A接口错误码，正数为CTI返回错误码），
		 * 详细定义如下：0：成功-1：坐席未登录-2：参数错误-3：超时-4：发送CTI失败-5：CTI响应消息错误-6：目的坐席不存在
		 */
		imSendMsg : function(flowNo, peerKind, peerId, mediaType, subType,
				msgId, content, imLinkId, param, cbFun)
		{
		    var paramObj = {
		              idno:flowNo,
		              kind:peerKind,
		              peerid:peerId,
		              mediatype:mediaType,
		              subtype:subType,
		              msgid:msgId,
		              content:content,
		              imlinkid: imLinkId,
		              param : param
		            };
		            var self = this;
		            AgentClient.invoke("ImSendMsg", paramObj, function(ret)
		                   {
		                        self._invokerCallBack("imSendMsg", ret, cbFun);
		                   }, this);
		},

		/**
		 * IM转移
		 * @param flowNo
		 * @param peerKind Kind=1座席工号（目前不支持）； Kind =2用户 ； Kind =3 会议（目前不支持）
		 * @param peerId Kind=1时 peerId为“座席工号” Kind=2时peerId为用户JID或者网户UID
		 * @param mediaType
		 * @param subType
		 * @param dstType dstType =1:dstObj为指定座席工号  dstType =2:dstObj为指定用户Jid dstType =3dstobj为的指定技能(咨询转) dstType =4:dstObj为指定网户uid
		 * @param dstObj
		 * @param userdata
		 * @param imLinkId 本次连接Id
		 * @param param
		 * @param cbFun
		 */
		imTransfer : function(flowNo, peerKind, peerId, mediaType, subType,
                dstType, dstObj, userData, imLinkId, param, cbFun)
        {
		    
		    var paramObj = {
                    idno:flowNo,
                    kind:peerKind,
                    peerid:peerId,
                    mediatype:mediaType,
                    subtype:subType,
                    dsttype:dstType,
                    dstobj:dstObj,
                    userdata : userData,
                    imlinkid: imLinkId,
                    param : param
                  };
                  var self = this;
                  AgentClient.invoke("ImTransfer", paramObj, function(ret)
                         {
                              self._invokerCallBack("ImTransfer", ret, cbFun);
                         }, this);    
		},

		/**
		 * Im取消转移，如果调用imTransfer转移到技能，在收到onImTransfered事件之前，可以调用该方法
		 * @param flowNo
		 * @param peerKind Kind=1座席工号（目前不支持）； Kind =2用户 ； Kind =3 会议（目前不支持）
		 * @param peerId
		 * @param mediaType
		 * @param subType
		 * @param imLinkId
		 * @param params
		 * @param cbFun
		 */
		imCancelTransfer : function(flowNo, peerKind, peerId, mediaType, subType,
		        imLinkId, param, cbFun)
        {
		    var paramObj = {
                    idno:flowNo,
                    kind:peerKind,
                    peerid:peerId,
                    mediatype:mediaType,
                    subtype:subType,
                    imlinkid: imLinkId,
                    param : param
                  };
                  var self = this;
                  AgentClient.invoke("ImCancelTransfer", paramObj, function(ret)
                         {
                              self._invokerCallBack("ImCancelTransfer", ret, cbFun);
                         }, this);    
            
        },
        
        /**
         * Im呼叫
         * @param flowNo
         * @param peerKind
         * @param peerId
         * @param mediaType
         * @param subType
         * @param userData 外呼数据：格式为键值对，如：CLD=xxx;US=xxx 必须含有CLD=(接入码)
         * @param imlinkid
         * @param params 当呼叫网户时，带上isuid=1；
         * @param cbFun
         */
        imOutSide : function(flowNo, peerKind, peerId, mediaType, subType,
                userData, imLinkId, param, cbFun)
         {
             
            var paramObj = {
                    idno:flowNo,
                    kind:peerKind,
                    peerid:peerId,
                    mediatype:mediaType,
                    subtype:subType,
                    userdata : userData,
                    imlinkid: imLinkId,
                    param : param
                  };
                  AgentClient.invoke("ImOutside", paramObj, function(ret)
                   {
                      ZteAgent.log("AgentClient.ImOutside: result="+ ret, "debug");
                      if(cbFun) cbFun(ret);
                   }, this);  
         },

         /**
          * 查询IM会议成员
         * @param imlinkid
         * @param params
         * @param cbFun
         */
          imSnapShot : function( imLinkId, param, cbFun)
          {
              var paramObj = {
                      imlinkid: imLinkId,
                      param: param
              };
              AgentClient.invoke("ImSnapShot", paramObj, function(ret)
              {
                  ZteAgent.log("AgentClient.ImSnapShot: result="+ ret, "debug");
                   if(cbFun) cbFun(ret);
              }, this);   
              
          },
		
		/**
		 * 获取状态名称描述
		 * @param code
		 * @returns
		 */
		getStateNameByCode:function(code)
		{
			 return AgentClient.I18n.getMsg("stateCode." + code);
		},

		/**
		 * pc+phone不支持改接口
		 * 设置视频通话窗口属性
		 * @param x
		 * @param y
		 * @param height
		 * @param width
		 * @param isShowLocalWindow
		 * @Deprecated
		 */
		setVideoWindow:function(x,y,height,width,isShowLocalWindow)
		{
			throw  "座席类型“" + ZteAgent.agtType + "”不支持该接口!";
		},
		/**
		 * 设置是否显示本地视频窗口
		 * @param isShowLocalWindow
		 */
		setIsShowLocalVideoWindow:function(isShowLocalWindow, isBuffer)
		{
		    throw  "座席类型“" + ZteAgent.agtType + "”不支持该接口!";
		},
		/**
		 * 获取呼叫ID
		 * @param type 0：获取正在通话的callid，1：获取正在保持的callid
		 * @param cbFun
		 */
		getCallID:function(type,cbFun)
		{
		    AgentClient.invoke("GetAllParts", {}, function(ret)
            {
		        ZteAgent.log("AgentClient.GetAllParts:" +JSON.stringify(ret), "debug");
		        if(ret)
		        {
		            var callid = null;
		            if(type == 0)
		             {
		                callid = ret.args.cnctid;
		             }else if(type == 1)
		             {
		                 callid = ret.args.heldid;
		             }
                    ZteAgent.log("ZteAgent.getCallID, result" +callid, "debug");
		            if(cbFun)
		                cbFun(callid);
		        }
            }, this);
		},
		/**
		 * 查询当前与坐席通话的所有电话号码
		 * @param cbFun
		 */
		getAllPartsPhoneNo:function(cbFun)
		{
		    //cnctinfo=类型/号码/id^类型/号码/id^类型/号码/id;heldinfo=类型|号码|id;exinfo=;
		    AgentClient.invoke("GetAllParts", {}, function(ret)
		            {
                ZteAgent.log("AgentClient.GetAllParts:" +JSON.stringify(ret), "debug");
		                if(ret)
		                {
		                   var cnctinfo = ret.args.cnctinfo;
		                   if(cnctinfo == null || cnctinfo =="")
		                   {
	                            ZteAgent.log("getAllPartsPhoneNo, result" + JSON.stringify(null), "error");
		                       if(cbFun)cbFun(null);
		                   }
		                   var resultArray = [];
		                   if(cnctinfo.indexOf("^")>-1)
		                   {
		                         var arry = cnctinfo.split("^");
		                         for(var idx in arry)
		                         {
		                             var t = arry[idx];
		                             var tarry = t.split("/");
		                             resultArray.push(tarry[1]);
		                         }   
		                   }else
		                   {
		                       if(cnctinfo.indexOf("/")>-1)
		                       {
		                           var tarry = cnctinfo.split("/");
		                           resultArray.push(tarry[1]);
		                       }
		                   }
		                   ZteAgent.log("getAllPartsPhoneNo, result" + JSON.stringify(resultArray), "debug");
                           if(cbFun)cbFun(resultArray);
		                }
		            }, this);
		},
		/**
		 * （会议界面使用）查询当前与坐席通话的所有号码、用户类型及通话媒体类型
		 * @param cbFun
		 */
		getCurrentAllParts:function(cbFun)
		{
			var resultObj={mediaType:1,members:[]};
			 //cnctinfo=类型|号码|id^类型|号码|id^类型|号码|id;heldinfo=类型|号码|id;exinfo=;
		    //获取通话中的媒体类型
			var self = this;
            resultObj.mediaType = this.getCallMediaType();
            AgentClient.invoke("GetAllParts", {}, function(ret)
                    {
                        ZteAgent.log("GetAllParts:" + JSON.stringify(ret), "info");
                        if(ret && ret.result == AgentClient.ErrorCode.SUCCEEDED)
                        {
                          try
                          {
                           var cnctinfo = ret.args.cnctinfo;
                           resultObj.members = resultObj.members.concat(self._parseAllPartsInfo(cnctinfo));
                           var heldinfo = ret.args.heldinfo;
                            resultObj.members = resultObj.members.concat(self._parseAllPartsInfo(heldinfo));
                            ZteAgent.log("getCurrentAllParts, result" + JSON.stringify(resultObj), "debug");
                           if(cbFun)cbFun(resultObj);
                        }catch(e)
                        {
                            ZteAgent.log("getCurrentAllParts failed. parse result error.", "error");
                            ZteAgent.log("getCurrentAllParts, result" + JSON.stringify(resultObj), "debug");
                            if(cbFun)cbFun(null);
                        }
                     }
                  }, this);	
        
		},
		/**
		 * 解析返回的所有通话信息
		 * @param info
		 * @returns {Array}
		 */
		_parseAllPartsInfo:function(info)
		{
	        var result = new Array();
		    if(info == null || info =="")
            {
                return result;
            }
            if(info.indexOf("^")>-1)
            {    
                  var arry = info.split("^");
                  for(var idx in arry)
                  {
                      var t = arry[idx];
                    
                      var tarry = t.split("/");
                      var mbrId = tarry[2];
                      if(mbrId == null || mbrId == "")
                      {
                          mbrId = tarry[1];
                      }   
                      var memberType = tarry[0];
                      if(memberType == 1)
                      {
                          memberType =2;
                      }else if(memberType == 2)
                      {
                          memberType = 1;
                      }
                      var callPhoneObj = {
                              memberId: mbrId,
                              memberPhone:tarry[1],
                              memberType:memberType
                      };

                      result.push(callPhoneObj);
                  }   
            }else
            {
                if(info.indexOf("/")>-1)
                {
                    var tarry = info.split("/");
                    var mbrId = tarry[2];
                    if(mbrId == null || mbrId == "")
                    {
                        mbrId = tarry[1];
                    }    
                    var memberType = tarry[0];
                    if(memberType == 1)
                    {
                        memberType =2;
                    }else if(memberType == 2)
                    {
                        memberType = 1;
                    }
                    var callPhoneObj = {
                            memberId: mbrId,
                            memberPhone:tarry[1],
                            memberType:memberType
                    };
                  result.push(callPhoneObj);
                }
            }
            return result;
		},
		/**
		 * 获取当前通话媒体类型
		 * @param cbFun function(mediaType){}; mediaType == 1 音频，mediaType==2视频
		 */
		getCallMediaType:function(cbFun)
		{
		    var callData = AgentClient.getAllUserData();
		    var mediaType = null;
		    if(callData && callData.ct)
		    {
		        mediaType = callData.ct;
		    }
	        
		    ZteAgent.log("ZteAgent.getCallMediaType, result:" + mediaType, "debug");
		    if(cbFun)
		    {
		        cbFun(mediaType);
		    }
		    return mediaType;
		},
		/**
         * 获取坐席电话号码
         */
        getAgentPhoneNO:function(cbFun)
        {
          var ret =  AgentClient.getAgentPhoneNO();
          ZteAgent.log("ZteAgent.getAgentPhoneNO, result:" + ret, "debug");
          if(cbFun) cbFun(ret);
          return ret;
        },
        
        /**
         * 获取当前通话的呼叫流水号
         * @param cbFun
         */
        getCallFlowNO:function(cbFun)
        {
            var ret =  AgentClient.getCallFlowNO();
            ZteAgent.log("ZteAgent.getCallFlowNO, result:" + ret, "debug");
            if(cbFun) cbFun(ret);
            return ret;
        },
        /**
         * 获取US部分的随路数据
         * @param cbFun
         */
        getUserData:function(cbFun)
        { 
            var ret =  AgentClient.getUserData();
            ZteAgent.log("ZteAgent.getUserData, result:" + ret, "debug");
            if(cbFun) cbFun(ret);
            return ret;
        },
        /**
         * 获取随路数据
         * @param cbFun
         */
        getCallData:function(cbFun)
        {
            var ret =  AgentClient.getAllUserData();
            ZteAgent.log("ZteAgent.getCallData, result:" + ret, "debug");
            if(cbFun) cbFun(ret);
            return ret;
        },
        /**
         * 获取主叫号码
         * @param cbFun
         */
        getCallingNO:function(cbFun)
        {
            var ret =  AgentClient.getCaller();
            ZteAgent.log("ZteAgent.getCallingNO, result:" + ret, "debug");
            if(cbFun) cbFun(ret);  
            return ret;
        },
        /**
         *  获取最近一次错误,异步返回
         * 
         * @return function(errCode,cause)
         */
        getLastErrorCode: function(cbFun)
        {
            var ret =  AgentClient.getLastErrorCode();
            ZteAgent.log("ZteAgent.getLastErrorCode, result:" + ret, "debug");
            if(cbFun) cbFun(ret);
            return ret;
        },
        /**
         * 获取座席版本
         * @param cbFun
         */
        getVersion : function(cbFun)
        {
           //TODO 
        },
        /**
         * 设置日志级别
         * @param level
         * @param cbFun
         */
        setLogLevel : function(level, cbFun)
        {
          //TODO 设置日志级别  
        },
        /**
         * 设置用户业务随路数据
         * @param svcData
         * @param extendParam
         * @param cbFun
         */
        setSvcData : function(svcData, extendParam, cbFun)
        {
            //TODO 

        },
        /**
         * 获取用户业务随路数据
         * @param cbFun
         */
        getSvcData : function(cbFun)
        {

            //TODO
        },
        /**
         * 根据座席账号获取座席标识ID
         * @param account
         * @param cbFun
         */
        getAgtIdByAcnt:function(account, extendParam, cbFun)
        {
            //TODO 
        },
        /**
         * 重设技能
         * @param agtId
         * @param skills
         * @param exetendParam
         * @param cbFun
         */
        resetSkill : function(agtId, skills, exetendParam, cbFun)
        {
            var paramObj = {
                    agtid : agtId, 
                    skills: skills        
            };
            AgentClient.invoke("ResetSkill", paramObj, function(ret)
            {
                 self._invokerCallBack("resetSkill", ret, cbFun);
            }, this);    
        
        },
        /**
         * 二次拨号
         * @param dtmf
         * @param cbFun
         */
        sendDTMF : function(dtmf, cbFun)
        {
            var paramObj = {dtmf : dtmf};
            AgentClient.invoke("SendDTMF", paramObj, function(ret)
            {
                 self._invokerCallBack("sendDTMF", ret, cbFun);
            }, this);    
        },
        /**
         * 对座席终端进行设置静音或者取消静音, 主要用于座席的监听插话互转
         * @param flag
         * @param cbFun
         */
        setPhoneMute:function(flag, cbFun)
        {
            var paramObj = {flag : flag};
            AgentClient.invoke("SetPhoneMute", paramObj, function(ret)
            {
                self._invokerCallBack("setPhoneMute", ret, cbFun);
            }, this);    
        },
		/**
		 * 同步坐席状态
		 */
		syncCurState:function()
		{
		   var state = AgentClient.getState().stateCode;
		   ZteAgent.publishEvent("onStateChanged", [ state]);
		},
		/**
		 * 直接调用A接口方法接口适配
		 */
		invokeAINF:function(methodName, args, cbFun)
		{
		    throw  "座席类型“" + ZteAgent.agtType + "”不支持该接口!";
		},
		/**
		 * 直接调用H接口适配
		 * @param methodName
		 * @param args
		 * @param cbFun
		 */
		invokeHINF:function(methodName, args, cbFun)
		{
		   AgentClient.invoke(methodName, args, cbFun, this);
		},
		/**
		 * 注册A接口事件
		 * @param eventName 事件名称
		 * @param eventHandler 事件处理器函数
		 * @returns eventHelper对象
		 */
		regAINFEvent:function(eventName, eventHandler)
		{
		    throw  "座席类型“" + ZteAgent.agtType + "”不支持该接口!";
		},
		/**
		 * 注册H接口事件
		 * @param eventNames事件名称
		 * @param eventHandler事件处理器函数
		 */
		regHINFEvent : function(eventNames, eventHandler)
		{
	          AgentClient.addEventListener(eventName, eventHandler, this);
		},
		/**
		 * 反注册A接口事件
		 * @param eventHelper 对象
		 * @returns 
		 */
		unRegAINFEvent:function(eventHelper)
		{
		    throw  "座席类型“" + ZteAgent.agtType + "”不支持该接口!";
		},
		/**
		 * 反注册H接口事件
		 * @param eventHandler  事件处理器函数
		 */
		unRegHINFEvent:function(eventHandler)
		{
		    AgentClient.removeEventListener(eventHandler);
		},
		  /**
         * 挂机到自动业务
         * 
         * @param callData {String} 挂机时传递给自动业务的消息内容
         * @param fn {function} 接收调用结果的回调函数，可省略
         * @return 成功时返回0，失败时返回-1
         */
        clearCallToAutoService : function(callData, fn)
        {
            return 0;
        },

		/**
		 * 状态切换事件适配
		 */
		onStateChanged : function()
		{
		    AgentClient.addEventListener("OnCTIAgentStateChanged", function(e)
		     {
                var paramArray = [e.args.state];
                 ZteAgent.log("AgentClient Event:OnCTIAgentStateChanged:"+ JSON.stringify(e), 'debug');
                ZteAgent.publishEvent("onStateChanged", paramArray);
		    },this);
		},
		
		/**
		 * CTI坐席状态事件
		 * @param stateCode
		 * @param laststateCode
		 * @param cause
		 * @param Param
		 */
		 onCTIAgentStateChanged : function()
		 {
		     AgentClient.addEventListener("OnCTIAgentStateChanged", function(e)
		     {
		         var paramArray = [ e.args.state, e.args.prevstate, e.args.cause, ""];
		         ZteAgent.log("AgentClient Event:OnCTIAgentStateChanged:"+ JSON.stringify(e), 'debug');
                ZteAgent.publishEvent("onCTIAgentStateChanged", paramArray);
	         },this);
		  },
		/**
		 * 媒体事件适配
		 */
		onMediaAbilityEvent:function()
		{
		    AgentClient.addEventListener("OnMediaAbilityEvent", function(e)
		    {
		        ZteAgent.log("AgentClient Event:OnMediaAbilityEvent:"+ JSON.stringify(e), 'debug');
                var extendParam = {};
                ZteAgent.publishEvent("onMediaAbilityEvent", [ e.args.type, e.args.value,  e.args.cause, e.args.param, extendParam]);
            }, this);
		},
		/**
		 * 报工号结束事件
		 */
		 onPlayEnd:function()
		 {
		     AgentClient.addEventListener("OnPlayEnd", function(e)
		     {
		         ZteAgent.log("AgentClient Event:OnPlayEnd:"+ JSON.stringify(e), 'debug');
		         var extendParam = {};
		         ZteAgent.publishEvent("onPlayEnd", [extendParam]);
		     }, this);
		 },

		/**
		 * 振铃事件适配
		 */
		onRinging : function()
		{
		    AgentClient.addEventListener("OnRinging", function(e)
		     {
		         ZteAgent.log("AgentClient Event:OnRinging:"+ JSON.stringify(e), 'debug');
		         ZteAgent.publishEvent("onRinging", [e.args.calling, e.args.called, e.args.callid, e.args.calldata, e.args.correlate, e.args.param]);
		     },this);		    
		},
		/**
		 * 通话建立事件适配
		 */
		onTalking : function()
		{
		    AgentClient.addEventListener("OnTalking", function(e)
		    {
		         ZteAgent.log("AgentClient Event:OnTalking:"+ JSON.stringify(e), 'debug');
		          var extendParam = {};
		          ZteAgent.publishEvent("onTalking", [e.args.callid, e.args.calling, e.args.called, extendParam]);
		    },this);           
		},
		/**
		 * 挂机事件适配
		 * 
		 * @TODO 挂机事件待完成
		 */
		onRelease : function()
		{
            AgentClient.addEventListener("OnRelease", function(e)
                    {
                        ZteAgent.log("AgentClient Event:OnRelease:"+ JSON.stringify(e), 'debug');
                        var extendParam = {};
                        ZteAgent.publishEvent("onRelease", [ e.args.droper, e.args.dropee,  e.args.callid, e.args.cause, e.args.lcstate, e.args.reason, extendParam]);
                    }, this);    
		},
		/**
		 * 会议事件适配
		 * 
		 * @TODO 会议事件待完成
		 */
		onConference : function()
		{
            AgentClient.addEventListener("OnConference", function(e)
                    {
                        ZteAgent.log("AgentClient Event:OnConference:"+ JSON.stringify(e), 'debug');
                        var extendParam = {};
                        ZteAgent.publishEvent("onConference", [ e.args.d1, e.args.d1,  e.args.d3, e.args.callid, e.args.cause, e.args.calldata, extendParam]);
                    }, this);    
		},
		/**
		 * 会议成员发生变化事件
		 */
		onSnapShotCall:function()
		{
		    AgentClient.addEventListener("OnSnapShotCall", function(e)
                    {
		                ZteAgent.log("AgentClient Event:OnSnapShotCall:"+ JSON.stringify(e), 'debug');
                        //deviceList 会议成员D1|D2|D3|。。。。
                        var extendParam = {};
                        ZteAgent.publishEvent("onSnapShotCall", [ e.args.callid, e.args.devicelist, extendParam]);
                    }, this);    
		},
		/**
		 * 收到座席或网户发的消息事件
		 */
		onMessage : function()
		{
		    AgentClient.addEventListener("OnMessageReceive", function(e)
                    {
		               ZteAgent.log("AgentClient Event:OnMessageReceive:"+ JSON.stringify(e), 'debug');
                        var msgtype = 0;
                        if (e.args.msgtype == 10001)
                        {
                            msgtype = 1;
                        }
                        ZteAgent.publishEvent("onMessage", [ e.args.srcagtid, e.args.objtype,  msgtype, e.args.msg, e.args.param, e.args.exinfo]);
                    }, this);    
		},
		
		/**
		 * 强锁事件适配
		 */
		onForceLock : function()
		{
            AgentClient.addEventListener("OnForceLock", function(e)
                    {
                       ZteAgent.log("AgentClient Event:OnForceLock:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onForceLock", [ e.args.srcagtid]);
                    }, this);    
        },
        
        /**
         * 强制示忙事件适配
         */
        onForceBusy : function()
        {
            AgentClient.addEventListener("OnForceBusy", function(e)
                    {
                       ZteAgent.log("AgentClient Event:OnForceBusy:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onForceBusy", [ e.args.srcagtid]);
                    }, this);    
        },
        
        /**
         * 强制示闲事件适配
         */
        onForceIdle : function()
        {
            AgentClient.addEventListener("OnForceIdle", function(e)
                    {
                       ZteAgent.log("AgentClient Event:OnForceIdle:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onForceIdle", [ e.args.srcagtid]);
                    }, this);    
        },
        
        /**
         * 强制示闲事件适配
         */
        onForceOut : function()
        {
            AgentClient.addEventListener("OnForceOut", function(e)
                    {
                       ZteAgent.log("AgentClient Event:OnForceOut:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onForceOut", [ e.args.srcagtid]);
                    }, this);    
        },
        
        /**
         * 全程录音事件
         */
        onRecord: function()
        {
            AgentClient.addEventListener("OnRecord", function(e)
                    {
                       ZteAgent.log("AgentClient Event:OnRecord:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onRecord", [ e.args.type, e.args.errcode, e.args.filename]);
                    }, this);    
        },
        
        /**
         * 报工号结束事件
         */
        onPlayEnd: function()
        {
            AgentClient.addEventListener("OnPlayEnd", function(e)
                    {
                       ZteAgent.log("AgentClient Event:OnPlayEnd:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onPlayEnd", []);
                    }, this);    
        },
		
		/**
		 * 咨询转移事件适配
		 */
        onTransfered:function()
		{
		    AgentClient.addEventListener("OnTransfer", function(e)
                    {
                        ZteAgent.log("AgentClient Event:OnTransfer:"+ JSON.stringify(e), 'debug');
                        var transtel = e.args.transtel;
                        var calling = e.args.calling;
                        var called = e.args.called;
                        var callid = e.args.callid;
                        var calldata = e.args.calldata;
                        var extendParam = {};
                        ZteAgent.publishEvent("onTransfered", [transtel, calling, called, callid, calldata,  extendParam]);
                    }, this);    
		},
		/**
		 * 单步转移事件适配
		 */
		onSingleTransfered:function()
		{
		    AgentClient.addEventListener("OnSingleTrans", function(e)
                    {
		               ZteAgent.log("AgentClient Event:OnSingleTrans:"+ JSON.stringify(e), 'debug');
                        var transtel = e.args.transtel;
                        var calling = e.args.calling;
                        var called = e.args.called;
                        var callid = e.args.callid;
                        var extendParam = {};
                        ZteAgent.publishEvent("onSingleTransfered", [transtel, calling, called, callid, extendParam]);
                    }, this);  
		},

		  /**
         * 预示闲成功事件（供zteAgent使用）
         */
        onSetPreIdleSuccess : function()
        {
            //TODO 预示闲成功暂不提供
          
        },
        /**
         * 预示忙成功事件（供zteAgent使用）
         */
        onSetPreBusySuccess : function()
        {

           //TODO 预示忙成功暂不提供
        },
        /**
         *  远端咨询返回事件
         */
        onReturnFromIVR:function()
        {

            AgentClient.addEventListener("OnReturnFromIVR", function(e)
                    {
                       ZteAgent.log("AgentClient Event:OnReturnFromIVR:"+ JSON.stringify(e), 'debug');
                        var ivrdata = e.args.ivrdata;
                        var extendParam = {};
                        ZteAgent.publishEvent("onReturnFromIVR", [ivrdata, extendParam]);
                    }, this);  
        },
        /**
         * 咨询方挂机事件
         */
        onConsultBack:function()
        { 
            AgentClient.addEventListener("OnConsultBack", function(e)
            {
                ZteAgent.log("AgentClient Event:OnConsultBack:"+ JSON.stringify(e), 'debug');
                var calling = e.args.calling;
                var called = e.args.called;
                var callid = e.args.callid;
                var extendParam = {};
                ZteAgent.publishEvent("onConsultBack", [calling, called, callid, extendParam]);
             }, this); 
        },
        /**
         * 共享连接事件
         */
        onShareStart : function()
        {
        	//TODO 
        },
        /**
         * 共享结束事件
         */
        onShareStop : function()
        {
           //TODO
        },
        /**
         * 共享模式改变通知事件。
         */
        onShareTypeChange : function()
        {
        	//TODO
        },
		/**
		 *坐席的收到聊天开始请求事件适配
		 */
		onImBeginReqReceived:function()
		{
		    AgentClient.addEventListener("OnImBeginReqReceived", function(e)
                    {
		                 ZteAgent.log("AgentClient Event:OnImBeginReqReceived:"+ JSON.stringify(e), 'debug');
                        //流水号，对方类型（kind=1坐席工号，kingd=2用户），对端ID（kind=1，peerid为坐席工号，kind=2:peerid为用户ID，媒体类型（只针对kind=2有效），媒体子类型（只针对kind=2有效），用户随路数据，扩展参数）
                        ZteAgent.publishEvent("onImBeginReqReceived", [e.args.idno,  e.args.kind,  e.args.peerid,  e.args.mediatype, e.args.subtype, e.args.userdata,e.args.imlinkid, e.args.exinfo]);
                    }, this);    
		},
		/**
		 * 坐席聊天收到消息事件适配
		 */
		onImMsgReceived:function()
		{
	          AgentClient.addEventListener("OnImMsgReceived", function(e)
	                    {
	                        ZteAgent.log("AgentClient Event:OnImMsgReceived:"+ JSON.stringify(e), 'debug');
	                        //流水号，对方类型（kind=1坐席工号，kingd=2用户），对端ID（kind=1，peerid为坐席工号，kind=2:peerid为用户ID，媒体类型（只针对kind=2有效），媒体子类型（只针对kind=2有效），用户随路数据，扩展参数）
	                        ZteAgent.publishEvent("onImMsgReceived", [e.args.idno,  e.args.kind,  e.args.peerid,  e.args.mediatype, e.args.subtype, e.args.userdata, e.args.imlinkid, e.args.exinfo]);
	                    }, this);    
		},
		
		  /**
         * IM消息发送失败通知事件
         */
        onImMsgSendFail : function()
       {
            AgentClient.addEventListener("OnImMsgSendFail", function(e)
            {
                ZteAgent.log("AgentClient Event:OnImMsgSendFail:"+ JSON.stringify(e), 'debug');
                var paramArray = [ e.args.idno, e.args.kind, e.args.peerId, e.args.mediaType, e.args.subType, e.args.msgId, e.args.msgTime, e.args.content, e.args.cause, e.args.imlinkid, e.args.exinfo];
                ZteAgent.publishEvent("onImMsgSendFail",  paramArray);
            }, this);  
       },
		/**
		 * chat转移操作结果事件通知
		 */
		onImTransfered:function()
		{
		    AgentClient.addEventListener("OnImTransfered", function(e)
                    {
		                 ZteAgent.log("AgentClient Event:OnImTransfered:"+ JSON.stringify(e), 'debug');
                        //流水号，对方类型（kind=1坐席工号，kingd=2用户），对端ID（kind=1，peerid为坐席工号，kind=2:peerid为用户ID，媒体类型（只针对kind=2有效），媒体子类型（只针对kind=2有效），用户随路数据，扩展参数）
                        ZteAgent.publishEvent("onImTransfered", [e.args.idno,  e.args.kind,  e.args.peerid,  e.args.mediatype, e.args.subtype, e.args.dstkind, e.args.dstpeerid, e.args.imlinkid, e.args, e.args.exinfo]);
                    }, this);    
		},
		/**
         * chat会议成员变更通知事件
         */
		onImConfMember:function()
        {
            AgentClient.addEventListener("OnImConfMember", function(e)
                    {
                         ZteAgent.log("AgentClient Event:OnImConfMember:"+ JSON.stringify(e), 'debug');
                        //流水号，对方类型（kind=1坐席工号，kingd=2用户），对端ID（kind=1，peerid为坐席工号，kind=2:peerid为用户ID，媒体类型（只针对kind=2有效），媒体子类型（只针对kind=2有效），用户随路数据，扩展参数）
                        ZteAgent.publishEvent("onImConfMember", [e.args.flag,  e.args.idno,  e.args.kind,  e.args.id, e.args.mediatype,e.args.subtype, e.args.userdata,  e.args.imlinkid, e.args, e.args.exinfo]);
                    }, this);    
        },
		/**
		 * 坐席聊天会话结束事件适配
		 */
		onImEnd:function()
		{
            AgentClient.addEventListener("OnImEnd", function(e)
                    {
                        ZteAgent.log("AgentClient Event:OnImEnd:"+ JSON.stringify(e), 'debug');
                        //流水号，对方类型（kind=1坐席工号，kingd=2用户），对端ID（kind=1，peerid为坐席工号，kind=2:peerid为用户ID，媒体类型（只针对kind=2有效），媒体子类型（只针对kind=2有效），用户随路数据，扩展参数）
                        ZteAgent.publishEvent("onImEnd", [e.args.idno,  e.args.kind,  e.args.peerid,  e.args.mediatype, e.args.subtype, e.args.cause, e.args.imlinkid, e.args.exinfo]);
                    }, this);    
		},
		
		/**
		 * 全程监听事件适配
		 */
		onFullListenNotify : function()
		{
            AgentClient.addEventListener("OnFullListenNotify", function(e)
                    {
                        ZteAgent.log("AgentClient Event:OnFullListenNotify:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onFullListenNotify", [e.args.agtid]);
                    }, this);    
        },
        
        /**
         * 监听/插话成功事件适配
         */
        onInsert : function()
        {
            AgentClient.addEventListener("OnInsert", function(e)
                    {
                        ZteAgent.log("AgentClient Event:OnInsert:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onInsert", [e.args.cause, e.args.result]);
                    }, this);    
        },
        
        /**
         * 呼叫被拦截事件适配
         */
        onBeIntercepted : function()
        {
            AgentClient.addEventListener("OnBeIntercept", function(e)
                    {
                        ZteAgent.log("AgentClient Event:OnBeIntercept:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onBeIntercepted", []);
                    }, this);    
        },
        /**
         * 座席发起呼叫过程中失败原因通知事件适配
         */
        onFailCause18X:function()
        {
            AgentClient.addEventListener("OnFailCause18X", function(e)
                    {
                        ZteAgent.log("AgentClient Event:OnFailCause18X:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onFailCause18X", [e.args.cause, e.args, param]);
                    }, this);   
        },
        /**
         * 向座席发送某个技能的队列告警事件。
         */
        onQueueWarning:function()
        {
            AgentClient.addEventListener("OnQueWarning", function(e)
                    {
                        ZteAgent.log("AgentClient Event:OnQueWarning:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onQueueWarning", [e.args.kind, e.data]);
                    }, this);   
        },
        /**
         * 呼叫座席终端电话失败事件
         */
        onTerminalFail:function()
        {
            AgentClient.addEventListener("OnTerminalFail", function(e)
                    {
                        ZteAgent.log("AgentClient Event:OnTerminalFail:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onTerminalFail", []);
                    }, this);   
        },
        
        /**
         * CTI通知事件
         */
        onCtiReport : function()
        {
            AgentClient.addEventListener("OnCtiReport", function(e)
                    {
                        ZteAgent.log("AgentClient Event:OnCtiReport:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onCtiReport", [e.args.eventtype, e.args.param]);
                    }, this);
        },
        
        /**
         * 数据库模式切换事件
         */
        onDataBaseModeChanged:function()
        {
            AgentClient.addEventListener("OnDataBaseModeChanged", function(e)
                    {
                        ZteAgent.log("AgentClient Event:OnDataBaseModeChanged:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onDataBaseModeChanged", [e.args.mode]);
                    }, this);
        },
        
		/**
		 * 会议管理器初始化接口（供内部使用）
		 */
		_initConferenceManager:function()
		{
			var cfm = new ConfManager();
			var isConfMaster = JSON.parse(localStorage.getItem(cfm.webStorageKeys.CONF_MASTER));
			var isInConference =  JSON.parse(localStorage.getItem(cfm.webStorageKeys.IS_IN_CONFERENCE));
			var memberList = JSON.parse(localStorage.getItem(cfm.webStorageKeys.MEMBER_LIST));
		
			cfm.isConfMaster =  isConfMaster == null ? false:isConfMaster;
			cfm.isInConference = isInConference == null ? false : isInConference;
			cfm.memberList =  memberList;
			
			cfm.mediaType =  JSON.parse(localStorage.getItem(cfm.webStorageKeys.MEDIATYPE));
			// 初始化会议管理器，拦截OnStateChanged事件，处理异常情况下，与缓存中的会议参数标志不一致的异常
			var interceptPoint = null;
			 interceptPoint = AgentClient.eventInterceptor.intercept("OnCTIAgentStateChanged", function(interceptor)
	        {
	        	ZteAgent.log("intercept event [OnCTIAgentStateChanged], args:[" + JSON.stringify(interceptor.eventArgs) + "]" , "debug");
	            var stateCode = interceptor.eventArgs.state;
	            try
            	{
	            	if ((stateCode * 1) != 305)
	                {
	    				isInConference = false;
	    				isConfMaster = false;
	    				localStorage.setItem(cfm.webStorageKeys.CONF_MASTER, JSON.stringify(false));
	            		localStorage.setItem(cfm.webStorageKeys.IS_IN_CONFERENCE, JSON.stringify(false));
	            		cfm.isConfMaster =  false;
	            		cfm.isInConference =false;
	                }
	                interceptor.next();
	                //删除拦截器，不在拦截
	                AgentClient.eventInterceptor.rmvIntercept(interceptPoint);
            	}catch(e)
    			{
    				ZteAgent.log("init ConferenceManager error."+JSON.stringify(e),"error");
    			}
	        });
			ZteAgent.log("Conference Manager init succ.", 'info');
			return cfm;
		},
		/**
		 * 注册会议事件处理器
		 * @param eventHandler
		 */
		regConferenceEventHandler:function(eventHandler)
		{
			//如果已经做了事件处理器监听，就不在重复监听
			if(ZteAgent.confManager.eventHandler != null)
			{
				return;
			}
			ZteAgent.confManager.eventHandler = eventHandler;
			 ZteAgent.confManager.eh = new AgentClient.EventListenerHolder();
			 
			// 记录主持人坐席状态
			ZteAgent.confManager.eh.add("OnCTIAgentStateChanged", function(e)
            {
			    var curState = e.args.state;
			    var pevState = e.args.prevstate;
			    
            	var isConsState = (pevState >= 306) && (pevState <= 308); // 咨询
        		var isCallState = (pevState >= 300) && (pevState <= 303); // 通话
        		//105,200,201,202,203,
        		//预约会议
        		var isReservedConfState = (pevState==105)|| (pevState==107) || (pevState>=200 && pevState<=203); //预约会议发起状态
        		//会议创建成功
        		if( (curState == ZteAgent.confManager.CONF_STATE_CODE) && (isConsState || isCallState || isReservedConfState))
                {
        			ZteAgent.confManager.isInConference = true;
        			ZteAgent.confManager.isConfMaster = true;
            		localStorage.setItem(ZteAgent.confManager.webStorageKeys.CONF_MASTER,JSON.stringify(true));
            		localStorage.setItem(ZteAgent.confManager.webStorageKeys.IS_IN_CONFERENCE,JSON.stringify(true));
            	    ZteAgent.log("<<<ZteAgent Conference Event:  onCreateConfSucc , args=[null]", "debug");
            		ZteAgent.confManager.eventHandler("onCreateConfSucc", null);
                }
                //会议结束成功
                if(ZteAgent.confManager.isInConference == false && (curState>=200 &&curState<=203) || (curState>=400 && curState<=401) && pevState == 305)
        		{
                	ZteAgent.confManager.isConfMaster = false;
                	ZteAgent.confManager.isInConference =false;
                	localStorage.setItem(ZteAgent.confManager.webStorageKeys.CONF_MASTER,JSON.stringify(false));
            		localStorage.setItem(ZteAgent.confManager.webStorageKeys.IS_IN_CONFERENCE,JSON.stringify(false));
            		ZteAgent.confManager.eh.clear(); //释放事件注册处理器
            		ZteAgent.confManager.eventHandler("onEndConfSucc", null);
            		ZteAgent.confManager.eventHandler = null;
          		  ZteAgent.log("<<<ZteAgent Conference Event:  onEndConfSucc , args=[null]", "debug");
        		}
                //平台异常结束会议
                if(ZteAgent.confManager.isInConference == true && (curState>=200 &&curState<=203) || (curState>=400 && curState<=401) && (pevState == 305 || isCallState))
        		{
                	ZteAgent.confManager.isConfMaster = false;
                	ZteAgent.confManager.isInConference =false;
                	localStorage.setItem(ZteAgent.confManager.webStorageKeys.CONF_MASTER,JSON.stringify(false));
            		localStorage.setItem(ZteAgent.confManager.webStorageKeys.IS_IN_CONFERENCE,JSON.stringify(false));
            		ZteAgent.confManager.eh.clear(); //释放事件注册处理器
            		ZteAgent.confManager.eventHandler("onEndConfSucc", null);
            		ZteAgent.confManager.eventHandler = null;
           	  	   ZteAgent.log("<<<ZteAgent Conference Event:  onEndConfSucc , args=[null]", "debug");
        		}
  
            }, this);
            
			ZteAgent.confManager.eh.add("OnConference", function(e)
			{
			    var d2 = e.args.d2;
				for(var inx=0; inx<ZteAgent.confManager.memberList.length; inx++)
				{
					if(ZteAgent.confManager.memberList[inx].memberPhone == d2)
					{
						ZteAgent.confManager.memberList[inx].isSucc = true;
						ZteAgent.confManager.memberList[inx].memberState = 2;
						//缓存当前会议成员信息
						localStorage.setItem(ZteAgent.confManager.webStorageKeys.MEMBER_LIST,JSON.stringify(ZteAgent.confManager.memberList));

						//completeObj.succList.push(ZteAgent.confManager.memberList[inx]);
						if(ZteAgent.confManager.eventHandler)
						{
							 ZteAgent.log("<<<ZteAgent Conference Event:  onJoinSucc , args=["+JSON.stringify(ZteAgent.confManager.memberList[inx])+"]", "debug");
							ZteAgent.confManager.eventHandler("onJoinSucc", ZteAgent.confManager.memberList[inx]);
						}
						break;
					}
				}
			}, this);
			//注册挂机事件
			ZteAgent.confManager.eh.add("OnRelease",function(e)
			{
				var dropee = e.args.dropee;				
				for(var inx=0; inx<ZteAgent.confManager.memberList.length; inx++)
				{
					if(ZteAgent.confManager.memberList[inx].memberPhone==dropee)
					{
						if(ZteAgent.confManager.eventHandler)
						{
							ZteAgent.log("<<<ZteAgent Conference Event:  onRelease , args=["+JSON.stringify(ZteAgent.confManager.memberList[inx])+"]", "debug");
							ZteAgent.confManager.eventHandler("onRelease", ZteAgent.confManager.memberList[inx]);
							ZteAgent.confManager.memberList.splice(inx,1);
							localStorage.setItem(ZteAgent.confManager.webStorageKeys.MEMBER_LIST,JSON.stringify(ZteAgent.confManager.memberList ));
						}
						break;
					}
				}
				if(ZteAgent.confManager.memberList.length<=1)
				{
					ZteAgent.confManager.isInConference = false;
				}
			},this);
		},
		/**
		 * 依次呼叫所有的会议成员
		 * @param members
		 */
		_callAllConfMembers:function(callMediaType, members)
		{
            var calldata = "CT=";
            var mediaType = ZteAgent.getCallMediaType();
            if(callMediaType != null)
            {
                mediaType = callMediaType;
            }
           
            calldata +=mediaType;
            calldata +=";";
                //待加入的成员，继续加入
                if(members.length>1)
                {
                    for(var idx=0; idx<ZteAgent.confManager.memberList.length; idx++)
                    {
                      //通话中不在呼叫
                        if(ZteAgent.confManager.memberList[idx].memberState == 2)
                        {
                            continue;
                        }
                      //跳过呼叫自己
                        if(ZteAgent.confManager.memberList[idx].memberId ==ZteAgent.getAgtInfo().agtId)
                        {
                            continue;
                        }
                        ZteAgent.confManager.memberList[idx].isSucc = false;
                        var callBackFun = function(member)
                        {
                              return function(result)
                              { 
                                  var ret = result.args.result;
                                  this.member =     member;
                                if(ret*1!=0)
                                {
                                    this.member.isSucc =false;
                                    //completeObj.errList.push(this.member);
                                    if(ZteAgent.confManager.eventHandler)
                                    {
                                        ZteAgent.log("<<<ZteAgent Conference Event:  onJoinError , args=["+JSON.stringify(this.member)+"]", "error");
                                        ZteAgent.confManager.eventHandler("onJoinError", this.member);
                                    }
                                }
                            };                          
                        };
                        //callType, dstObj, objType, canSpeak, userData, paramObj, cbFun
                        var objType = ZteAgent.confManager.memberList[idx].memberType;
                        //H接口和A接口定义不统一，要做参数转换
                        if(objType == 1){
                            objType =2;
                        }else if(objType == 2){
                            objType = 1;
                        }
                        var confParams = {
                                canspeak: ZteAgent.confManager.memberList[idx].memberCanSpeak,
                                objtype:objType,
                                dstobj:ZteAgent.confManager.memberList[idx].memberId,
                                userdata:"",
                                calldata:calldata
                           };
                        AgentClient.invoke('SingleConf', confParams, callBackFun(ZteAgent.confManager.memberList[idx]));
                    }
                }  
		},
		/**
		 * 创建会议
		 * @param mediaType
		 * @param members
		 * @param extendParams
		 * @param cbFun
		 */
		createConference:function(mediaType,members, extendParams, cbFun)
		{
		    var self = this;
			if(ZteAgent.confManager.eventHandler == null)
			{
				cbFun(false, "eventHandler is null");
				return;
			}
			try
			{
			    ZteAgent.confManager.mediaType = mediaType;
	            localStorage.setItem(ZteAgent.confManager.webStorageKeys.MEDIATYPE, JSON.stringify(mediaType));

	            ZteAgent.confManager.isConfMaster = true;
	            //判断当前坐席状态，是否通话状态，咨询状态
	            var agtState = ZteAgent.getState()*1;
	            ZteAgent.confManager.memberList = members;
	            //缓存当前会议成员信息
	            localStorage.setItem(ZteAgent.confManager.webStorageKeys.MEMBER_LIST,JSON.stringify(ZteAgent.confManager.memberList));
	            
	            //两方通话状态下形成会议
	            if(agtState>=300 && agtState<=303)
	            {
	                //通话状态创建会议，不需要读入参的媒体类型
	                self._callAllConfMembers(null, members);
	            }
	            
	            //咨询台下三方通话
	            if(agtState>=306 && agtState<=307)
	            {
	                //调用三方会议进入会议态
	                ZteAgent.conference(function(isSucc, errCode)
	                {
	                    if(!isSucc)
	                    {
	                        if(ZteAgent.confManager.eventHandler)
	                        {
	                            ZteAgent.log("<<<ZteAgent Conference Event:  onCreateConfError , args=["+JSON.stringify(errCode)+"]", "error");
	                            ZteAgent.confManager.eventHandler("onCreateConfError", errCode);
	                        }
	                    }
	                    //通过三方会议创建会议成功后逐个加入待入会的成员
	                    if(isSucc)
	                    {
	                        self._callAllConfMembers(null, members);
	                    }
	                });
	            }
	            
	            //TODO 预约会议(暂不提供支持)
	            if((agtState>=200 && agtState<=203) || (agtState >=105 && agtState<=106))
	            {
	                ZteAgent.confManager.eh.add("OnCreateConference", function(e)
	            {
	                    var result = e.args.result;
	                if(result*1 !=0)
	                {
	                    if(ZteAgent.confManager.eventHandler)
	                    {
	                        ZteAgent.log("<<<ZteAgent Conference Event:  onCreateConfError , args=["+JSON.stringify(result)+"]", "error");
	                        ZteAgent.confManager.eventHandler("onCreateConfError", result);
	                    }
	                    return;
	                }
	                self._callAllConfMembers(mediaType, members);
	            });
	            
	            AgentClient.invoke("SetPreCall",{},function(ret)
	            {
	                var result = ret.result;
	                if(result*1!=0)
	                {
	                    if(ZteAgent.confManager.eventHandler)
	                    {
	                        ZteAgent.log("<<<ZteAgent Conference Event:  onCreateConfError , args=["+JSON.stringify(result)+"]", "error");
	                        ZteAgent.confManager.eventHandler("onCreateConfError", result);
	                    }
	                    return;
	                }   
	                //CreateConference(long mediatype, LPCTSTR param, LPCTSTR exInfo)
	                AgentClient.invoke("CreateConference",{},function(result)
	                        {
	                         var  ret = result.result;
	                            if(ret*1!=0)
	                            {
	                                if(ZteAgent.confManager.eventHandler)
	                                {
	                                    ZteAgent.log("<<<ZteAgent Conference Event: onCreateConfError , args=["+JSON.stringify(ret)+"]", "error");
	                                    ZteAgent.confManager.eventHandler("onCreateConfError", ret);
	                                }
	                            }   
	                        });
	              });
	            }
	            if(cbFun)cbFun(true, "succ");
			}catch(e)
			{
			  ZteAgent.log("ZteAgent.createConference failed. exception:"  + JSON.stringify(e) , "error");
			  if(cbFun)cbFun(false, "exception");
			  return;
			}
		},

		/**
		 * 向会议中增加成员
		 * @param member={memberType:xx,memberId, memberPhone:xxx,memberCanSpeak:xxx}
		 * @param extendParams
		 * @param cbFun
		 */
		addMemberInConference : function(member,extendParams, cbFun)
		{				
			//var calldata = "CT=";
		    var calldata = "CT=";
            var mediaType = this.getCallMediaType();
           
            calldata +=mediaType;
            calldata +=";";
            //callType, dstObj, objType, canSpeak, userData, paramObj, cbFun
            //H接口和A接口定义不统一，要做参数转换
            var objType = member.memberType;
            if(objType == 1)
            {
                objType =2;
            }else if(objType == 2)
            {
                objType = 1;
            }
            var confParams = {
                    canspeak : member.memberCanSpeak,
                    objtype : objType,
                    dstobj : member.memberId,
                    userdata : "",
                    calldata:calldata
              };
            
            AgentClient.invoke('SingleConf', confParams, function(result){
                var ret = result.result;

                if(ret*1!=0)
                {
                    if(cbFun)
                    {
                        cbFun(false,  result.result);
                    }
                }else
                {
                    var isExist  = false;
                    for(var idx=0; idx<ZteAgent.confManager.memberList.length; idx++)
                    {
                        var tmpMember = ZteAgent.confManager.memberList[idx];
                        if(member.memberId == tmpMember.memberId)
                        {
                            isExist = true;
                            break;
                        }
                    }
                    if(!isExist)
                    {
                        ZteAgent.confManager.memberList.push(member);
                    }
                    
                    //缓存会议成员信息更新
                    localStorage.setItem(ZteAgent.confManager.webStorageKeys.MEMBER_LIST,JSON.stringify(ZteAgent.confManager.memberList ));
                    if(cbFun)
                    {
                        cbFun(true, "addMemberInConference succ.");
                    }
                }
            });
		},
		/**
		 * 从会议中剔除成员
		 * @param member
		 * @param userData
		 * @param extendParams
		 * @param cbFun
		 */
		releaseMemberInConference : function(member, extendParams, cbFun)
		{
		    this.releaseCall(member.memberPhone, "", extendParams, function(isSucc, desc)
		     {
                    if(cbFun)
                     {
                        cbFun(isSucc,  desc);
                     }
		    });
		},
		/**
		 * 结束会议
		 */
		endConference : function(userData, extendParams, cbFun)
		{
		    if(ZteAgent.confManager.isConfMaster)
            {
                if(extendParams == null)
                {
                    extendParams = "";
                }
                
              this.releaseCall("", userData, extendParams, function(isSucc, desc)
              {
                if(!isSucc)
                {
                    if(cbFun)
                     {
                        cbFun(false,  desc);
                     }
                }else
                {          
                    ZteAgent.confManager.memberList = null;
                    ZteAgent.confManager.isInConference = false;
                    ZteAgent.confManager.isConfMaster = false;
                    localStorage.setItem(ZteAgent.confManager.webStorageKeys.CONF_MASTER,JSON.stringify(false));
                    localStorage.setItem(ZteAgent.confManager.webStorageKeys.IS_IN_CONFERENCE,JSON.stringify(false));
                    localStorage.setItem(ZteAgent.confManager.webStorageKeys.MEMBER_LIST,JSON.stringify(null));
                        if(cbFun)
                         cbFun(true, "endConferecne succ.");
                }      
             });     
           }else
           {
               if(cbFun)
                  cbFun(false, "endConferecne fail, only conference master can end conference.");
           }
		},
		
		/**
		 *设置视频窗口句柄
		 * 
		 */
		setVideoWindowEx : function(selfVideoHwnd,destVideoHwnd,cbFun){
			WebAgent.invoker("SetVideoWindowEx", [selfVideoHwnd,destVideoHwnd],function(res){
				if(res){
					cbFun(true,  "setVideoWindowEx success.");
				}else {
					cbFun(false,  "setVideoWindowEx failed.");
				}
				
			}); 
		}
	};