(function(WebAgent)
{
    /**
     * com2功能
     */
    WebAgent.extend(
    {
        com2_flowNo : null, // 流水号。需预先获取，同步返回
        com2_callingNO : null, // 主叫号。需预先获取，同步返回
        com2_calledNO : null, //被叫号码，需预先获取，同步返回
        com2_currentAgtInfo : null, // 当前座席信息，需预先获取，格式：虚中心号|座席工号|座席名称|座席台号|座席电话|座席状态|组号|组名|座席类型|区号|区域编码

        // GetStatus()
        com2_statusStr : null, // OPR_READY OPR_WORKAFTER ...
        com2_agtType : null,

        com2_MsgHandleFunList : [], // MsgHandle事件处理器列表
        com2_MsgInvokerFunList : [], // MsgInvoker事件处理器列表
        com2_agtPhoneNo : null, // 座席电话号码
        com2_callData  : null, //当前呼叫的callData
        com2_isMediaBusy : false, //媒体示忙
		
		com2_extinfo:null,//呼叫扩展信息
		com2_charset:null,//OnRingEvent中携带的字符集信息
        
        /**
         * 获取流水号
         * 
         * @return {String}
         */
        GetFlowNo : function()
        {
            if (!WebAgent.isReady) return "";
            return this.com2_flowNo;
        },
        
        /**
         * 获取流水号(注意字母大小写)
         */
        GetFlowNO : function()
        {
        	return WebAgent.GetFlowNo();
        },
		
		/**
		*获取Charset信息
		*/
		GetCharsetInfo:function ()
		{
			return WebAgent.com2_charset;
		},
		
		/**
		* 获取扩展信息
		*/
		GetExtInfo:function()
		{
			if (!WebAgent.isReady) return "";
            return this.com2_extinfo;
		},

        /**
         * 获取座席状态。共四位 如果第一位是1 后3位：1100未登录 1101 空闲，1010 忙/通话中 1211保持 1110非服务
         * 1000其他
         * 
         * @return 成功时返回0，失败时返回-1
         */
        GetAgentStatus : function()
        {
        	if(!this.com2_statusStr)
        	{
        		return this.GetAgentStatus2();
        	}
        	
            var statusStr = this.com2_statusStr.split(",")[0];        
            var agtType = this.com2_agtType;

            if ((!agtType) || (!statusStr))
            {
                return this.GetAgentStatus2();
            }

            var map =
            {
                "OPR_IDLE" : "100",
                "OPR_READY" : "101",
                "OPR_BUSY" : "010",
                "OPR_LOCK" : "010",
                "OPR_HOLD" : "211",
                "OPR_LOGON" : "110",
                "OPR_LOCKBYMONITOR" : "110",
                "OPR_WORKAFTER" : "110"
            };
            var status = (map[statusStr]) ? map[statusStr] : "000";

            return agtType + status;
        },

        /**
         * 获取座席状态。共四位 如果第一位是1 后3位：1100未登录 1101 空闲，1010 忙/通话中 1211保持 1110非服务
         * 1000其他
         * 
         * @return 成功时返回0，失败时返回-1
         */
        GetAgentStatus2 : function()
        {
            var State = WebAgent.State;
            var state = WebAgent.getState();
            var stateStr = "1000";
            switch (state)
            {
            	case State.userCallInTalk:
                case State.inTalk:
                case State.callOutTalk:
                case State.callInTalk:
                case State.coach:
                case State.callWait:
                    stateStr = "010";
                    break;

                case State.hold:       
                case State.consult:
                case State.inConsult:
                case State.rmtConsult:
                    stateStr = "211";
                    break;

                case State.logon:
                case State.adjust:
                    stateStr = "110";
                    break;

                case State.free:
                    stateStr = "101";
                    break;

                default:
                    stateStr = "000";
            }

            var agtType = ((!this.com2_agtType) || (this.com2_agtType == "")) ? "1" : this.com2_agtType;
            return agtType + stateStr;
        },

        /**
         * 获取主叫
         * 
         * @return {String}
         */
        GetCallingNO : function()
        {
            if (!WebAgent.isReady) return "";
            WebAgent.debug("[webagent-com2.js] WebAgent.GetCallingNO() =  "+this.com2_callingNO);
            return this.com2_callingNO;
        },
        /**
         * 获取被叫
         * @returns
         */
        GetCalledNO : function()
        {
            if (!WebAgent.isReady) return "";
            WebAgent.debug("[webagent-com2.js] WebAgent.GetCalledNO() =  "+this.com2_calledNO);
            return this.com2_calledNO;
              
        },

        /**
         * 获取随路数据
         * 
         * @return {String}
         */
        GetUserData : function()
        {
            if (!WebAgent.isReady) return "";
             WebAgent.debug("[webagent-com2.js] WebAgent.GetUserData() =  "+this.com2_callData);
            return this.com2_callData;
        },
        
        /**
         * 获取呼叫随路数据
         * @returns
         */
        GetCallData : function()
        {
            if (!WebAgent.isReady) return "";
            WebAgent.debug("[webagent-com2.js] WebAgent.GetCallData() =  "+this.com2_callData);
          return this.com2_callData;  
        },

        /**
         * 外呼
         * 
         * @param phoneNo {String}
         * @param fn {function} 结果回调函数，可省略
         * @return 成功时返回0，失败时返回-1
         */
        CallUser : function(phoneNo, fn)
        {
            if (!WebAgent.isReady) return -1;

            if (!this.com2_agtPhoneNo)
            {
                var arr = (this.com2_currentAgtInfo + "").split("|");
                if (arr.length > 5)
                {
                    this.com2_agtPhoneNo = arr[4];
                }
            }
            WebAgent.invoker("CallOutside", [ 0, this.com2_agtPhoneNo, phoneNo, "", 0, 0 ], fn);
            return 0;
        },

        /**
         * 外呼并设置主叫号码
         * 
         * @param phoneNumber {String}被叫
         * @param callingNumber {String}主叫
         * @param infoExOrFn {String,Function} A接口CallOutSide的infoEX参数或回调函数,当该参数为Function时则当成回调函数使用并不会传送infoEx参数.可选参数.
         * @param fn {function} 结果回调函数，可省略。返回值大于0, 表示增强呼出函数成功,否则增强呼出函数失败.当infoExOrFn为Function时忽略该参数.
         * @return 成功时返回0，失败时返回-1
         */
        ExCallUser : function(phoneNumber, callingNumber, infoExOrFn, fn)
        {
            if (!WebAgent.isReady) return -1;

            if ((fn && $.isFunction(fn)) || (infoExOrFn && !$.isFunction(infoExOrFn)))
            {
                WebAgent.invoker("CallOutsideEx", [ 0, callingNumber, phoneNumber, "", 0, 0, infoExOrFn ], fn);
                return 0;
            }
            else if (infoExOrFn == null || $.isFunction(infoExOrFn))
            {
                WebAgent.invoker("CallOutside", [ 0, callingNumber, phoneNumber, "", 0, 0 ], fn);
                return 0;
            }
            else
            {
                return -1;
            }
        },

        /**
         * 保持呼叫
         */
        HoldCall : function(fn)
        {
            if (!WebAgent.isReady) return -1;
            WebAgent.invoker("Hold", [], fn);
            return 0;
        },

        /**
         * 取消保持呼叫
         */
        ReHoldCall : function(fn)
        {
            if (!WebAgent.isReady) return -1;
            var oid = WebAgent.getOid();
            WebAgent.invoker("QueryCallIDOnAgent", oid, function(callid)
            {
                WebAgent.invoker("RetrieveHold", [ callid ], fn);
            });
            return 0;
        },

        /**
         * 挂机，相关事件OnReleaseSuccess、OnReleaseFailure
         * 
         * @param fn {function} 回调函数，可以省略
         * @return 成功时返回0，失败时返回-1
         */
        HangUP : function(fn)
        {
            if (!WebAgent.isReady) return -1;

            WebAgent.invoker("GetCallMediaType", "", function(mediaType)
            {
                WebAgent.invoker("ReleaseCall", mediaType, fn);
            });

            return 0;
        },

        /**
         * 指定号码挂机
         * 
         * @param telNum {String} 被挂机号码, 一般要求填写对方号码来挂机
         * @param isClearAll {Integer} 是否挂机掉全部电话, 1表示挂全部, 0只挂指定号码
         * @param fn {function} 用于接收调用结果的回调函数，可以省略
         * @return 成功时返回0，失败时返回-1
         */
        HangUpEx : function(telNum, isClearAll, fn)
        {
            if (!WebAgent.isReady) return -1;

            if (isClearAll && isClearAll == 1)
            {
                this.HangUP(fn);
            }
            else
            {
                WebAgent.invoker("ReleaseCallByTel", telNum, fn);
            }
            return 0;
        },

        /**
         * 挂机到自动业务
         * 
         * @param callData {String} 挂机时传递给自动业务的消息内容
         * @param fn {function} 接收调用结果的回调函数，可省略
         * @return 成功时返回0，失败时返回-1
         */
        ClearCallToAutoServiceEx : function(callData, fn)
        {
            if (!WebAgent.isReady) return -1;

            WebAgent.invoker("GetCallMediaType", "", function(medType)
            {
				ZteAgent.setSvcData(encodeURIComponent(callData),function(isSucc, errCode)
				{
					//why not pay attention to the return value
					WebAgent.invoker("ReleaseCall", [ medType ], fn);
				});
            });

            return 0;
        },

        /**
         * 咨询到自动业务
         * 
         * @param timeout {Integer} 超时时间
         * @param accessCode {String} 业务接入码
         * @param data {String} 发送到业务的数据
         * @param fn {function} 结果回调函数，可以省略
         * @return 成功时返回0，失败时返回-1
         */
        Consult2Auto : function(timeout, accessCode, data, fn)
        {
            if (!WebAgent.isReady) return -1;

            var medType = 0;		
			ZteAgent.setSvcData(encodeURIComponent(callData),function(isSucc, errCode)
			{
				//why not pay attention to the return value
				var mediaType = 0;
                var consulttype = 3; // 咨询到ivr
                var consulttag = 1; // 远端咨询
                var fakeCalling = "";
                WebAgent.invoker("Consultation", [ mediaType, accessCode, consulttype, consulttag, fakeCalling ], fn);
			});

            return 0;
        },
        
        /**
         * @return 是否媒体示忙
         */
        isMediaBusy : function()
        {
            return this.com2_isMediaBusy;
        },

        /**
         * 调用A接口方法
         * 
         * @param method {String} A接口方法
         * @param args {Array} 参数数组
         * @parem fn {function} 结果回调函数，可以省略
         * @return 成功时返回0，失败时返回-1
         */
        CommInvoker : function(method, args, fn)
        {
            if (!WebAgent.isInit) return -1;
            WebAgent.invoker(method, args, fn);
            return 0;
        },

        /**
         * 模拟Com2的MsgHandle事件
         * 
         * @param {function} fn = function(eventCode,userDate){}
         * @return
         */
        MsgHandle : function(fn)
        {
            if (!fn) return;
            if (!this.com2_MsgHandleFunList) this.com2_MsgHandleFunList = [];
            this.com2_MsgHandleFunList.push(fn);

            // 如果首次调用该方法，则初始化事件监听。
            if (this.com2_MsgHandleFunList.length > 1) return;

            var handleFun = function(msgType, userData)
            {
                WebAgent.debug("[webagent-com2.js] MsgHandle notify msgType=" + msgType + ", userData=" + userData);
                
                var len = WebAgent.com2_MsgHandleFunList.length;
                for ( var i = 0; i < len; i++)
                {
                    try
                    {
                        WebAgent.com2_MsgHandleFunList[i](msgType, userData);
                    }
                    catch(e)
                    {
                        WebAgent.error("[webagent-com2.js] MsgHandle notify error!");
                    }
                }
            };

            var eh = new WebAgent.EventHelper();
            eh.regEvent("OnHoldSuccess", function()
            {
                handleFun("33", WebAgent.GetUserData());
            }, null);

            eh.regEvent("OnHoldFailure", function()
            {
                handleFun("32", null);
            }, null);

            eh.regEvent("OnAnswerRequest", function()
            {
                handleFun("80", WebAgent.GetUserData());
            }, null);

            eh.regEvent("OnAnswerSuccess", function()
            {
                handleFun("11", WebAgent.GetUserData());
            }, null);

            eh.regEvents([ "OnCallInsideSuccess", "OnCallOutsideSuccess" ], function()
            {
                handleFun("81", WebAgent.GetUserData());
            }, null);

            eh.regEvents([ "OnCallInsideSuccTalk", "OnCallOutsideSuccTalk" ], function()
            {
                handleFun("5", WebAgent.GetUserData());
            }, null);

            eh.regEvent("OnReleaseSuccess", function()
            {
                handleFun("6", "1");
            }, null);

            eh.regEvent("OnReleaseFailure", function()
            {
                handleFun("6", "0");
            }, null);

            eh.regEvent("OnTransSuccess", function()
            {
                handleFun("34", "1");
            }, null);

            eh.regEvent("OnTransFailure", function()
            {
                handleFun("34", "0");
            }, null);

            // 座席收号
            eh.regEvent("OnDTMFDigitsDected", function()
            {
                handleFun("3", WebAgent.GetUserData());
            }, null);

            eh.regEvents([ "OnCallOutsideFailure", "OnCallInsideFailure" ], function()
            {
                handleFun("7", WebAgent.GetUserData());
            }, null);

            // 收到转移
            eh.regEvent("OnTransferred", function()
            {
                handleFun("4", WebAgent.GetUserData());
            }, null);

            // 远端咨询返回
            eh.regEvent("OnReturnFromIVR", function()
            {
                handleFun("35", WebAgent.GetUserData());
            }, null);
            
            return eh;
        },

        /**
         * 模拟MsgInvoker方法,透传所有A接口事件
         * 
         * @private
         */
        MsgInvoker : function(fn)
        {
            if (!fn) return;
            var eh = new WebAgent.EventHelper();

            /*
             * 不采用OnAinfEvent的原因是该全局事件没有实现拦截，后续采用拦截预获取的同步方法不生效。
             * eh.regEvent("OnAinfEvent", function(e) { //e={code,name,args}
             * fn(e.code, e.args); });
             */
            var handleFun = function(eventType, eventName)
            {
                return function()
                {
                    var argum = arguments;
                    var args = [];
                    for ( var n = 0; n < arguments.length; n++)
                    {
                        args[n] = arguments[n];
                    }
                    fn(eventType, args);
                };
            };

            var eventMap = WebAgent.AinfOCX.ainfEventMap; // A接口事件
            for ( var eventType in eventMap)
            {
                var eventName = eventMap[eventType];
                eh.regEvent(eventName, handleFun(eventType, eventName));
            }
            return eh;
        }
    });

    // 座席初始化成功后,初始化com2控件
    WebAgent.onInit(function(isReady)
    {
        WebAgent.com2_MsgHandleFunList = []; // MsgHandle事件处理器列表
        WebAgent.com2_MsgInvokerFunList = []; // MsgInvoker事件处理器列表

        //WebAgent.EventHelper.rmvAllIntercept();        
        
        // 拦截【内呼成功】事件，查询流水号
        WebAgent.EventHelper.intercept("OnCallInsideSuccTalk", function(interceptor)
        {
            WebAgent.debug("[webagent-com2.js] Intercept Event：" + interceptor.eventName + ", args=" + interceptor.eventArgs);
            WebAgent.invoker("GetFlowNo", [], function(result)
            {
                WebAgent.com2_flowNo = result;
                
                WebAgent.invoker("GetCallingNo", [], function(result)
	            {
	                WebAgent.com2_callingNO = result;
	                interceptor.next();
	            });
                WebAgent.invoker("GetCalledNo", [], function(result)
                {
                     WebAgent.com2_calledNO = result;
                     interceptor.next();
                });
            });
        });
        
        // 拦截【内呼失败】事件，清空流水号
        WebAgent.EventHelper.intercept("OnCallInsideFailure", function(interceptor)
        {
            WebAgent.com2_flowNo = null;
			interceptor.next();
        });
        
        
        // 拦截【外呼成功】事件，查询流水号
        WebAgent.EventHelper.intercept("OnCallOutsideSuccTalk", function(interceptor)
        {
            WebAgent.debug("[webagent-com2.js] Intercept Event：" + interceptor.eventName + ", args=" + interceptor.eventArgs);
            WebAgent.invoker("GetFlowNo", [], function(result)
            {
                WebAgent.com2_flowNo = result;
                
                WebAgent.invoker("GetCallingNo", [], function(result)
	            {
	                WebAgent.com2_callingNO = result;
	                interceptor.next();
	            });
                
                WebAgent.invoker("GetCalledNo", [], function(result)
                {
                    WebAgent.com2_calledNO = result;
                    interceptor.next();
                });
            });
        });
        
        // 拦截【外呼失败】事件，清空流水号
        WebAgent.EventHelper.intercept("OnCallOutsideFailure", function(interceptor)
        {
            WebAgent.com2_flowNo = null;
			//清空extinfo
			WebAgent.com2_extinfo = null;
			interceptor.next();
        });
        
        var isGetCallingNoSucc = false;
        
        // 确保在获取完主叫号码后才对外广播OnAnswerSuccess
        WebAgent.EventHelper.intercept("OnAnswerSuccess", function(interceptor)
        {
        	if(isGetCallingNoSucc)
        	{
        		isGetCallingNoSucc = false;
        		interceptor.next();
        	}else
        	{
        		var eh = new WebAgent.EventHelper();
        		eh.regOneTimeEvent("OnGetCallingNoSuccess",function()
        		{
        			eh = null;
        			isGetCallingNoSucc = false;
        			interceptor.next();
        		});
        	}
        });

        // 拦截【OnAnswerRequest】事件，查询随路数据、呼叫流水号、主叫号码
        WebAgent.EventHelper.intercept("OnAnswerRequest", function(interceptor)
        {
        	WebAgent.com2_callingNO = null;
        	WebAgent.com2_calledNO = null;
            WebAgent.com2_flowNo = null;
            WebAgent.com2_callData = null;
            //WebAgent.webCallUid = null;
        	isGetCallingNoSucc = false;
            WebAgent.debug("[webagent-com2.js] Intercept Event：" + interceptor.eventName + ", args=" + interceptor.eventArgs);
            
            // 流水号
            WebAgent.invoker("GetFlowNo", [], function(result)
            {
                WebAgent.com2_flowNo = result;
            });
            
            // 随路数据
            WebAgent.invoker("GetCallMediaType", "", function(mediaType)
            {
                WebAgent.invoker("QueryCallData", [ mediaType ], function(result)
                {
                    WebAgent.com2_callData = result;
                });
               //add callcomming get srcuid
               /* WebAgent.invoker("QueryAllCallDataByKey", [ 'srcuid' ], function(result)
                {
                	if(result != null && result != ''){
                     WebAgent.webCallUid = result;
                	}else{
                		 WebAgent.webCallUid = null;
                	}
                });
                */
                
                 // 主叫号码
	            WebAgent.invoker("GetCallingNo", [], function(result)
	            {
	                WebAgent.com2_callingNO = result;
	                interceptor.next();
	                isGetCallingNoSucc = true;
	                WebAgent.EventHelper.notify("OnGetCallingNoSuccess",[result]);
	            });
	            
	            WebAgent.invoker("GetCalledNo", [], function(result)
	                    {
	                         WebAgent.com2_calledNO = result;
	                         interceptor.next();
	                    });
            });
        });

        // 拦截【转接成功】事件，从随路数据中查询原始主叫号
        WebAgent.EventHelper.intercept("OnTransferred", function(interceptor)
        {
            WebAgent.debug("[webagent-com2.js] Intercept Event：" + interceptor.eventName + ", args=" + interceptor.eventArgs);
            //WebAgent.com2_callingNO = interceptor.eventArgs[0];
            interceptor.next();
            /*
            WebAgent.invoker("GetAgtMsg", [], function(callData)
            {
                alert(callData);
                WebAgent.com2_callingNO = interceptor.eventArgs[0];
                interceptor.next();
            });
            */
        });

        // 拦截【远端质询数据返回事件】，取业务数据
        WebAgent.EventHelper.intercept("OnReturnFromIVR", function(interceptor)
        {
            WebAgent.debug("[webagent-com2.js] Intercept Event：" + interceptor.eventName + ", args=" + interceptor.eventArgs);
            WebAgent.invoker("GetCallMediaType", "", function(mediaType)
            {
                WebAgent.invoker("QueryCallData", [ mediaType ], function(result)
                {
                    WebAgent.com2_callData = result;
                    interceptor.next();
                });
            });
        });

             
        
        // 拦截【媒体处理能力改变】,记录当前媒体能力是打开还是关闭
        WebAgent.EventHelper.intercept("OnMediaAbilityEvent", function(interceptor)
        {
            WebAgent.debug("[webagent-com2.js] Intercept Event：" + interceptor.eventName + ",args=" + interceptor.eventArgs);
            var intVal = parseInt(interceptor.eventArgs[1], 10);
            if (1 <= intVal &&  intVal <= 999)
            {
                WebAgent.com2_isMediaBusy = true;
            }
            else if (1001 <= intVal && intVal <= 1999)
            {
                WebAgent.com2_isMediaBusy = false;
            }
            interceptor.next();
        });
        
        // 拦截OnRingingEvent事件
        WebAgent.EventHelper.intercept("OnRingingEvent", function(interceptor)
        {
            WebAgent.debug("[webagent-com2.js] Intercept Event：" + interceptor.eventName + ",args=" + interceptor.eventArgs);
         
            WebAgent.webCallUid = null;
            WebAgent.com2_callData = interceptor.eventArgs[3];
            WebAgent.debug("eventArgs[4]=" + interceptor.eventArgs[4] );
			
            // DSTAGTID=100;CALLINGOBJ=2/77770019777/1000107;
            var arr = interceptor.eventArgs[4].split("CALLINGOBJ=");
            if(arr && arr.length > 1)
            {
            	 WebAgent.debug("arr.length > 1" );
            	 
            	 var arr2 = arr[1].split(";")[0].split("/");
            	
            	 if(arr2 && arr2.length > 2 && arr2[0] == 2)
            	 {
            	 	   WebAgent.debug("arr2.length > 2 " );
            	 	 
            		   WebAgent.webCallUid = arr2[2];
            	 }
            
            }   

		   var _userdata = interceptor.eventArgs[3];
		   if(_userdata)
		   {
			  var  _param =  zteUtils._decodeParam(_userdata);
			  //携带随路数据信息
			  if(_param && _param.svcinfo)
			  {
				 WebAgent.com2_extinfo = "SVCINFO=" + _param.svcinfo;
			  }
			  //字符集
			  if(_param && _param.charset)
			  {
				 WebAgent.com2_charset = "CHARSET=" + _param.charset; 
			  }
		   }  
		     // 流水号
            WebAgent.invoker("GetFlowNo", [], function(result)
            {
                WebAgent.com2_flowNo = result;
				interceptor.next();
            });  
        });
        
        
        var eh = new WebAgent.EventHelper();
        eh.regEvent("OnAgentStatusChanged", function(statusStr)
        {
            WebAgent.com2_statusStr = statusStr;
        }, eh);
    });
})(WebAgent);