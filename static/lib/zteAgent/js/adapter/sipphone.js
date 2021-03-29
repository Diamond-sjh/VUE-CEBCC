var sipphone = function()
{

};

ZteAgent.regAdapter("sipphone", sipphone); // 注册为ZteAgent.sipphone

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
sipphone.prototype =
	{

		/**
		 * 加载所需js文件,路径位于{agtBar}/sipphone/webagent.js
		 * 
		 * @Return {List<Url>}
		 */
		loadJs : function(cbFun)
		{
			var jsArr = [ ZteAgent.getBaseUrl() + "js/sipphone/webagent.js" ];
			ZteAgent.script.loadJs(jsArr, cbFun);
		},

		/**
		 * 初始化
		 * 
		 * @param lang语言en”英文，“zh-CN”中文
		 * @param cbFun回调函数
		 */
		init : function(lang, cbFun)
		{
			var param =
				{
					lang : lang,
					onSucc : function(isReady)
					{
						cbFun(isReady, "isready");
					},
					onError : function(errCode, errMsg)
					{
						cbFun(false, errCode);
					}
				};

			this.loadJs(function()
			{
				WebAgent.init(param);
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
            ZteAgent.log("WebAgent." + methodName+ ", result:" + JSON.stringify(ret), "debug");
            if(ret =='0')
            {
                isSucc = true;
            }else
            {
                resultCode = ret;
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
		 * 嵌入
		 * 
		 * @param op Object
		 * @param cbFun
		 */
		signIn : function(op, cbFun)
		{
			var self = this;
			ZteAgent.log("signIn Params:" + JSON.stringify(op), "info");
			ZteAgent.signInCfgObj = op;
			var paramObj =
			{			
				onSucc : function()
				{
					    var thisobj = this;
						// 解决二次登录状态不对的bug（核心库问题导致）。
						// 核心库注销会销毁之前全部监听事件， 二次登录后需要重新注册状态管理器(stateManager)。
						if (!ZteAgent.isFirstLogin)
						{
							WebAgent.stateMan = null;
							WebAgent.EventBus.removeAllEventListener();
							ZteAgent._adapterEvents(true); // 让ZteAgent重新注册事件，不清楚其他适配器是否需要这样处理，因此放到这里单独通知.
							WebAgent.syncCurState();
							//ZteAgent.signOut(function(a,b){alert(a)});
							ZteAgent.log("sync state succ", "info");
						}
					if (cbFun)
					{
						cbFun(true, "signIn Succ.");
					}

				},
				onError : function(errCode, errMsg)
				{
					ZteAgent.log(errCode + "," + errMsg, "warn");
					if (cbFun)
					{
						cbFun(false, errCode);
					}
				}
				};

			WebAgent.signin(paramObj);
			
		
		},	
		
		
		_lazyLoading : function(op, cbFun)
		{
			var self = this;
			ZteAgent.log("lazyLoading Params:" + JSON.stringify(op), "info");
			ZteAgent.signInCfgObj = op;
			var paramObj =
				{
					oid : op.agtId,
					pwd : op.pwd,
					vcid : op.vcid,
					cfgUrl : op.cfgUrl,
					lang : op.lang,
					phoneType : op.phoneType?op.phoneType:0, //0：siphone(默认),1：瘦客户端,2：核心网电话,3：voip电话
					bindPhone : op.bindPhone?op.bindPhone:"",  // pc+phone时的座席绑定号码 改参数放到后面去修改
					ccb : op.ccb?op.ccb:"",
					phoneaddr : op.phoneaddr ? op.phoneaddr : "", //话机ip地址和端口
					extendParam:op.extendParam,
					onInitialBeforeInvoke:function()
					{
					  try
					 {
						//注册在调用inital接口之前loadconfig之后需要执行的操作
						if(op.extendParam && op.extendParam.useVideo==true)
						{
							WebAgent.invoker("UseVideo", [ "1" ]);
						}else
						{
							WebAgent.invoker("UseVideo", [ "0" ]);
						}
						if(op.extendParam && op.extendParam.autoAnswer)
						{
							WebAgent.invoker("AutoAnswer", [ "1" ]);
							ZteAgent.autoAnswer = true;
						}else
						{
							WebAgent.invoker("AutoAnswer", [ "0" ]);
							ZteAgent.autoAnswer = false;
						}
						if(op.extendParam && op.extendParam.initialReady)
						{
							WebAgent.invoker("InitialReady", [ "1" ],function(ret)
							{
								ZteAgent.initialReady = true;
							});
						}else
						{
							WebAgent.invoker("InitialReady", [ "0" ],function(ret)
							{
								ZteAgent.initialReady = false;
							});
						}
						if(op.extendParam && op.extendParam.fullRecord)
						{
							WebAgent.invoker("FullRecord", [ "1" ]);
						}else
						{
							WebAgent.invoker("FullRecord", [ "0" ]);
						}
						if(op.extendParam && op.extendParam.recordMode)
						{
							WebAgent.invoker("RecordMode", [ op.extendParam.recordMode ]);
						}
						
						if(op.extendParam && op.extendParam.isUseAnswerDlg)
						{
							WebAgent.invoker("IsUseAnswerDlg", [ 1 ]);
						}else
						{
							WebAgent.invoker("IsUseAnswerDlg", [ 0 ]);	
						}
					 }catch(e)
					 {
						ZteAgent.log("SignIn onInitialBeforeInvoke error.["+JSON.stringify(e)+"]", "error");
					 }
					},
					onInitialAfterInvoke:function()
					{
					    //  注册在调用inital接口之后SignIn之前需要执行的操作
					   try
					   {
					     
					       //  A接口方式下默认设置为1，A接口在录音结束时自动写录音日志。
	                        WebAgent.invoker("SetAinfProperty", [ 'updaterecord', 1]);
							
							// 不使用密码验证
						    WebAgent.invoker("SetAinfProperty", [ 'not_check_password', "1"]);
	                        
						// 如果设置有的分辨率就设置选中的分辨率
						if(op.extendParam && op.extendParam.useVideo==true && op.extendParam.videoResolution)
						{
							var v = op.extendParam.videoResolution;
							//1:QCIF 2:CIF; 3:SQCIF; 4:CIF4; 5:720P;6:VGA;7:1080P
							if(v ==1 || v==2 || v ==3 || v==4 || v== 5 || v == 6 || v == 7 )
							{
								WebAgent.invoker("SetAinfProperty", [ 'videopixel', v]);
							}else
							{
								ZteAgent.log("video resolution parameter is invalid.["+v+"]", "error");
							}
						}
						// 设置坐席呼叫坐席伪主叫号码
						if(op.extendParam && op.extendParam.fakeAgtCalling && op.extendParam.fakeAgtCalling !="")
						{
							WebAgent.invoker("SetAinfProperty", ['fakeAgtCalling', op.extendParam.fakeAgtCalling]);
						}
						
						//1表示通话结束后示闲，0（默认值）表示一直处于整理态。
                        if (op.extendParam && op.extendParam.idleStatus)
                        {
                            WebAgent.invoker("IdleStatus", [op.extendParam.idleStatus]);
                        }
						// 设置操作员的所在场所
                        if(op.extendParam && op.extendParam.siteid && op.extendParam.siteid !=null)
                        {
                            WebAgent.invoker("SetAinfProperty", ['siteid', op.extendParam.siteid]);
                        }
                        
                        // 设置长连接，短连接，座席终端类型为2或者3时，该longcnct参数生效
                        if(op.extendParam && op.extendParam.longcnct && op.extendParam.longcnct !=null)
                        {
                            WebAgent.invoker("SetAinfProperty", ['longcnct', op.extendParam.longcnct]);
                        }
                 
                        // 0-座席应答呼叫后播放工号，默认为0
                        //1-用户呼入/用户转接到话务员之后播放工号，座席之间通话不播放工号。
                      //  2-只在用户被转接（transfercall）到座席后播放工号
                        if(op.extendParam && op.extendParam.repworknum && op.extendParam.repworknum !=null)
                        {
                            WebAgent.invoker("SetAinfProperty", ['repworknum', op.extendParam.repworknum]);
                        }
						
						//设置是否显示视频呼叫本地视频窗口
						if(op.extendParam && (op.extendParam.isShowLocalVideoWindow==true ||op.extendParam.isShowLocalVideoWindow==false))
						{
							ZteAgent.setIsShowLocalVideoWindow(op.extendParam.isShowLocalVideoWindow,true);
						}
						
						//设置自动重签属性
						if(op.extendParam && op.extendParam.autoReSignIn==false)
						{
							WebAgent.invoker("SetAinfProperty", ["autoResignIn", 0]);
						}else if(op.extendParam && op.extendParam.autoReSignIn==true)
						{
							WebAgent.invoker("SetAinfProperty", ["autoResignIn", 1]);
						}

						// 设置双声道
						if(op.extendParam && op.extendParam.msRecChannelMode == 0)
						{
							WebAgent.invoker("SetAinfProperty", ["msRecChannelMode", 0]);
						}else if(op.extendParam && op.extendParam.msRecChannelMode == 1)
						{
							WebAgent.invoker("SetAinfProperty", ["msRecChannelMode", 1]);
						}
						
						// 读取零配置，设置IM会话控制数
						WebAgent.invoker("GetConfigFileString",["general", "imdistrnum","",".\\conf\\zxcc.ini", 2],function(ret)
						{
							WebAgent.invoker("SetImDistrNum", ["type:" + ret, "", ""]);
						});
						
						
						//设置聊天呼叫可以同时进行
						if(op.extendParam && op.extendParam.imcallmutex == 1)
						{
							WebAgent.invoker("SetAinfProperty", ["imcallmutex", 1]);
						}else
						{
							WebAgent.invoker("SetAinfProperty", ["imcallmutex", 0]);
						}
						
						//设置录屏
						if(op.extendParam && op.extendParam.screenRec)
						{
							ZteAgent.initScreenRec();
						}
						
					   }catch(e)
					   {
						  ZteAgent.log("SignIn onInitialAfterInvoke error.["+JSON.stringify(e.message)+"]", "error");
					   }
					},
					onSucc:function(){
						if (cbFun)
						{
							cbFun(true);
						}
					},
					onError : function(errCode, errMsg)
					{
							ZteAgent.log(errCode + "," + errMsg, "warn");
							if (cbFun)
							{
								cbFun(false, errCode);
							}
				    }
				};

			self.loadJs(function()
			{
				WebAgent._lazyLoading(paramObj);
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
			WebAgent.logout(function(isSucc)
			{
				ZteAgent.log("signOut " + isSucc ? true : false, "info");
				if (!cbFun)
				{
					return;
				}
				if (isSucc)
				{
					cbFun(true, "signOut Succ.");
				} else
				{
					cbFun(false, "signOut Failed.");
				}
			});
		},
		
		lazySignOut : function(cbFun)
		{
			WebAgent.lazySignOut(function(isSucc)
			{
				ZteAgent.log("lazySignOut " + isSucc ? true : false, "info");
				if (!cbFun)
				{
					return;
				}
				if (isSucc)
				{
					cbFun(true, "lazySignOut Succ.");
				} else
				{
					cbFun(false, "lazySignOut Failed.");
				}
			});
		},

		/**
		 * 设置自动应答或非自动应答
		 * 
		 * @param isAutoAnswer false非自动应答，true自动应答
		 *          
		 */
		setAnswerType : function(isAutoAnswer)
		{
			var intIsAutoAnswer = 0;
			if(isAutoAnswer) //自定应答
			{
				intIsAutoAnswer = 1;
				WebAgent.invoker("AutoAnswer", intIsAutoAnswer);
				WebAgent.invoker("IsUseAnswerDlg", [ 0 ]);
			}else
			{ //非自定应答
				intIsAutoAnswer = 0;
				//  0-不使用agentservice接听对话框 1-使用agentservice接听对话框
				WebAgent.invoker("AutoAnswer", intIsAutoAnswer);
			//	WebAgent.invoker("IsUseAnswerDlg", [ 1 ]);
			}
		},

		/**
		 * @param agtId
		 * @param cbFun(result);
		 */
		getAgtInfo : function(agtId, cbFun)
		{
			// 获取状态
			WebAgent.invoker("GetAgentInfo", [ agtId ], function(resultObj)
			{
				var ret =
					{
						vcid : "",
						agtId : agtId,
						phoneNo : "",
						agtState : "",
						groupId:""
					};
				
				if (resultObj.length > 1)
				{
					var arr = resultObj.split("|");
					ret.vcid = (arr.length > 0) ? arr[0] : "";
					ret.phoneNo = (arr.length > 4) ? arr[4] : "";
					ret.agtState = ((arr.length > 5) ? arr[5] : 0) * 1;
					ret.groupId = (arr.length > 6) ? arr[6] : "";
				}
				cbFun(ret);
			});
		},

		/**
		 * 是否在通话中
		 * 
		 */
		isCalling : function()
		{
			return WebAgent.isCalling();
		},

		/**
		 * 示闲
		 * 
		 * @param cbFun
		 */
		idle : function(cbFun)
		{
			var eh = new WebAgent.EventHelper();
			eh.regEvent("OnSetIdleSuccess", function()
			{
				ZteAgent.log("idle  Succ.", "info");
				if (cbFun)
				{
					cbFun(true, "Set idle succ.");
				}
				eh.dispose();
			}, this);

			eh.regEvent("OnSetIdleFailure", function()
			{
				ZteAgent.log("idle  Failure.", "warn");

				if (cbFun)
				{
					cbFun(false, "Set Idle Failure.");
				}
				eh.dispose();
			}, this);

			if (WebAgent.isCalling())
			{
				WebAgent.setPreIdle();
			} else
			{
				WebAgent.invoker("StatusMonitor", [ 0, 0, 0, "SetIdle" ]);
			}
		},

		/**
		 * 示忙
		 * 
		 * @param cbFun
		 */
		busy : function(cbFun)
		{
			var eh = new WebAgent.EventHelper();
			if (cbFun)
			{
				eh.regEvent("OnSetBusySuccess", function()
				{
					ZteAgent.log("busy  Succ.", "info");
					if (cbFun)
					{
						cbFun(true, "Set Busy Succ.");
					}
					eh.dispose();
				}, this);

				eh.regEvent("OnSetBusyFailure", function()
				{
					ZteAgent.log("busy  Failure.", "warn");
					if (cbFun)
					{
						cbFun(false, "Set Busy Failure.");
					}
					eh.dispose();
				}, this);
			}

			if (WebAgent.isCalling())
			{
				WebAgent.setPreBusy(function(result)
				{
					ZteAgent.log("PreBusy  result:" + result, "info");
					if (!cbFun)
					{
						return;
					}
					if (result * 1 == 0)
					{
						cbFun(true, "Set PreBusy Succ.");
					} else
					{
						cbFun(true, result);
					}
				});
			} else
			{
				WebAgent.invoker("StatusMonitor", [ 0, 0, 0, "SetBusy" ]);
				ZteAgent.log("Busy  Succ.", "info");
				if (cbFun)
					cbFun(true, "Set Busy Succ.");
			}
		},

		/**
		 * 坐席挂机（挂断当前与坐席通话的电话）
		 * @param userData坐席挂机时传递的随路数据
		 * @param cbFun
		 */
		hangUp : function(userData, cbFun)
		{
			var eh = new WebAgent.EventHelper();
			eh.regEvent("OnReleaseSuccess", function()
			{
				ZteAgent.log("hangUp  Succ.", "info");
				if (cbFun)
				{
					cbFun(true, "Hang Up Succ.");
				}
				eh.dispose();
			}, this);

			eh.regEvent("OnReleaseFailure", function()
			{
				ZteAgent.log("hangUp  Fail.", "warn");
				if (cbFun)
					cbFun(false, "Hang Up Failure.");
				eh.dispose();
			}, this);

			if (userData == null || userData == undefined)
			{
				userData = "";
			}

			// 对接入用户通话进行特殊保护，防止挂掉第二个呼入的电话
			if ((WebAgent.getState().stateCode * 1 == 312 || WebAgent.getState().stateCode * 1 == 300) && ZteAgent.callInStartTime > 0)
			{
				var time = new Date().getTime() - ZteAgent.callInStartTime;
				if (time < 6000)
				{
					return;
				}
			}

			if (!ZteAgent.currentCallId)
			{
				var phoneNo = ZteAgent.getAgtInfo().phoneNo;
				WebAgent.invoker("ReleaseCall2", [ phoneNo, userData, "" ],
						function(result)
						{
							if (result * 1 != 0)
							{
								if (cbFun)
									cbFun(false, result);
								eh.dispose();
							}
						});
			} else if (ZteAgent.currentCallId != "0")
			{
				WebAgent.invoker("ReleaseCallByCallID", ZteAgent.currentCallId,
						function(result)
						{
							if (result * 1 != 0)
							{
								if (cbFun)
									cbFun(false, result);
								eh.dispose();
							}
						});
			}
		},
		/**
		 * 释放掉连接到当前坐席的指定号码的呼叫
		 * 
		 * @param phoneNo
		 * @param userdata
		 * @param extendParams
		 * @param cbFun
		 */
		releaseCall:function(phoneNo, userData,extendParams, cbFun)
		{
			var eh = new WebAgent.EventHelper();
			eh.regEvent("OnReleaseSuccess", function()
			{
				ZteAgent.log("ReleaseCall  Succ.", "info");
				if (cbFun)
				{
					cbFun(true, "ReleaseCall Succ.");
				}
				eh.dispose();
			}, this);

			eh.regEvent("OnReleaseFailure", function()
			{
				ZteAgent.log("ReleaseCall  Fail.", "warn");
				if (cbFun)
					cbFun(false, "ReleaseCall Failure.");
				eh.dispose();
			}, this);

			if (userData == null || userData == undefined)
			{
				userData = "";
			}
			WebAgent.invoker("ReleaseCall2", [ phoneNo, userData, "" ],
					function(result)
					{
						if (result * 1 != 0)
						{
							if (cbFun)
								cbFun(false, result);
							eh.dispose();
						}
					});
		},

		/**
		 * 应答
		 * 
		 * @param cbFun
		 */
		answer : function(cbFun)
		{
			var eh = new WebAgent.EventHelper();
			eh.regEvent("OnAnswerSuccess", function()
			{
				if (cbFun)
					cbFun(true, "Answer Succ.");
				eh.dispose();
			}, this);

			eh.regEvent("OnAnswerFailure", function()
			{
				if (cbFun)
					cbFun(false, "Answer Failure.");
				eh.dispose();
			}, this);
			WebAgent.invoker("GetCallMediaType", "", function(mediaType)
			{
				WebAgent.invoker("Answer", mediaType, function(result)
				{
					if (!cbFun)
						return;
					if (result * 1 != 0)
					{
						cbFun(false, result);
						eh.dispose();
					}
				});
			});
		},

		/**
		 * 保持
		 * 
		 * @param cbFun
		 */
		hold : function(cbFun)
		{

			var eh = new WebAgent.EventHelper();
			eh.regEvent("OnHoldSuccess", function()
			{
				if (cbFun)
					cbFun(true, "Hold Succ.");
				eh.dispose();
			}, this);

			eh.regEvent("OnHoldFailure", function()
			{
				if (cbFun)
					cbFun(false, "Hold Failure.");
				eh.dispose();
			}, this);

			WebAgent.invoker("Hold", "", function(result)
			{
				if (!cbFun)
					return;
				if (result * 1 != 0)
				{
					cbFun(false, result);
					eh.dispose();
				}
			});

		},
		/**
		 * 取消保持
		 * 
		 * @param cbFun
		 */
		cancelHold : function(cbFun)
		{
			var eh = new WebAgent.EventHelper();
			eh.regEvent("OnRetrieveHoldSuccess", function()
			{
				if (cbFun)
					cbFun(true, "reHold Succ.");
				eh.dispose();
			}, this);

			eh.regEvent("OnRetrieveHoldFailure", function()
			{
				if (cbFun)
					cbFun(false, "reHold Failure.");
				eh.dispose();
			}, this);

			var oid = WebAgent.getOid();
			WebAgent.invoker("QueryCallIDOnAgent", oid, function(callid)
			{
				WebAgent.invoker("RetrieveHold", [ callid ], function(result)
				{
					if (result * 1 != 0)
					{
						if (cbFun)
							cbFun(false, result);
						eh.dispose();
					} else
					{
						if (cbFun)
							cbFun(true, 'cancel hold succ.');
						eh.dispose();
					}
				});
			});
		},
		/**
		 * 整理
		 * 
		 * @param cbFun
		 */
		adjust : function(adjustTime, cbFun)
		{
			var isCalling = WebAgent.isCalling();
			// 设置整理时长，达到整理时长后自动进入示闲
			WebAgent.invoker("StatusMonitor", [ 4, adjustTime, 0, "SetIdle" ]);

			// 未在通话状态下，进入整理状态
			if (!isCalling)
			{
				WebAgent.invoker("StatusMonitor",[ 0, 0, 0, "AgentEnterWrapUp" ]);
			}
		},

		/**
		 * 取消整理
		 * 
		 * @param cbFun
		 */
		cancelAdjust : function(cbFun)
		{
			var isCalling = WebAgent.isCalling();
			if (isCalling)
			{
				// 通话状态下，取消进入示闲操作
				WebAgent.invoker("StatusMonitor", [ 4, -1, 0, "SetIdle" ]);
			} else
			{
				// 非通话状态下，取消整理，立即进入示闲状态
				WebAgent.invoker("StatusMonitor", [ 0, 0, 0, "SetIdle" ]);
			}
		},

		/**
		 * 呼叫座席
		 * 
		 * @param dstAgetId  呼叫目标工号
		 * @param calltype 1音频（默认）2视频
		 * @param userData 用户业务数据 最大长度516字节
		 * @param paramObj
		 *            扩展参数对象
		 * @param cbFun
		 */
		callAgt : function(dstAgtId, callType, userData, paramObj, cbFun)
		{
			var mediaType = 0;

			if (callType == 2)
			{
				mediaType = 6;
			}
			var eh = new WebAgent.EventHelper();
			eh.regEvents([ "OnCallInsideSuccess", "OnCallInsideSuccTalk" ],
			function()
			{
				if (cbFun)
					cbFun(true, "callAgt Succ.");
				eh.dispose();
			}, this);

			eh.regEvent("OnCallInsideFailure", function()
			{
				if (cbFun)
					cbFun(false, "callAgt Failure.");
				eh.dispose();
			}, this);

			var callFun = function()
			{
				WebAgent.invoker("CallInside", [ dstAgtId, mediaType ],function(result)
				{
					if (result * 1 != 0)
					{
						if (cbFun)
							cbFun(false, result);
					} 
				});
			};

			if (userData && userData.length > 0)
			{			
				ZteAgent.setSvcData(encodeURIComponent(userData),function(isSucc, errCode){
					if(isSucc)
					{
						callFun();
					}
					else
					{  
					   if (cbFun)
						 cbFun(false, errCode);
					}
				});		
			} else
			{
				callFun();
			}

		},
		/**
		 * 呼叫用户
		 * 
		 * @param called
		 *            被叫号码
		 * @param calling
		 *            主叫号码
		 * @param calltype
		 *            1音频（默认）2视频
		 * @param paramObj
		 *            扩展参数对象
		 * @param cbFun
		 *            回调函数
		 */
		callUser : function(calledNo,callType, callingNo, paramObj, cbFun)
		{
			var mediaType = 0;

			if (callType == 2)
			{
				meidaType = 6;
			}

			var eh = new WebAgent.EventHelper();
			eh.regEvents([ "OnCallOutsideSucc", "OnCallOutsideSuccTalk" ],
					function()
					{
						if (cbFun)
							cbFun(true, "Call Uesr Succ.");
						eh.dispose();
					}, this);

			eh.regEvent("OnCallOutsideFailure", function()
			{
				if (cbFun)
					cbFun(false, "Call Uesr Failure.");
				eh.dispose();
			}, this);

			WebAgent.invoker("CallOutside", [ mediaType, callingNo, calledNo,
					"", 0, "" ], function(result)
			{
				if (result * 1 != 0)
				{
					if (cbFun)
						cbFun(false, result);
				} 
			});
		},
		/**
		 * 坐席发起呼叫接口
		 * @param callType 1音频 2视频
		 * @param objType 目标类型。0-座席；1-网络用户；2-用户
		 * @param obj  目标号码 0-座席工号；1-网户uid；2-用户号码
		 * @param outCode  分行出局编码，如果没有填，则需要调用A接口获取。
		 * @param callingNo 呼出时的主叫号码,最大长度24字节（不包含字符串结束符）。该输入参数为空时呼出的主叫号码为缺省的系统主叫号码
		 * @param svcdata 随路数据,最大6K
		 * @param cbFun
		 */
		makeCall:function(callType, objType, obj, outCode, callingNo, svcdata, cbFun)
		{
			var outCodeCallingNo = callingNo;
			var func = function()
			{
				var mediaType = 0;
				if(callType == 2)
				{
					mediaType = 6;
				}
				var eh = new WebAgent.EventHelper();
				eh.regEvents([ "OnRingingEvent"],function()
				{
					if (cbFun)
						cbFun(true, "callAgt Succ.");
					eh.dispose();
				}, this);
				
				
				//var callFun = function()
				//{
				   //将座席状态设置为预呼状态若设置成功，NGCC平台将不再给此座席分配来话，等待座席发起呼叫。。
				  WebAgent.invoker("SetPreCall",[""],function(result)
	              {
	                if(result*1==0)
	                {
					  WebAgent.invoker("MakeCall", [objType, obj, mediaType, outCodeCallingNo,zteUtils.isEmpty(svcdata)?'charset=1;':'charset=1;svcflag=1',zteUtils.isEmpty(svcdata)?'': svcdata],function(result){
						if (result * 1 != 0)
						{
							if (cbFun)
								cbFun(false, result);
						}
					 });
					}else
					{
						if (cbFun)
						cbFun(false, result);
					}
				  });
				//};
			}
			if(outCode)
			{
				outCodeCallingNo = outCode + "" + callingNo;
				func();
			} else
			{
				WebAgent.invoker("GetConfigFileString",["general", "branchcode","",".\\conf\\zxcc.ini",2], function(ret){
					outCode = ret;
					if(callingNo)
					{
						outCodeCallingNo = outCode + "" + callingNo;
						func();
					}else{
						WebAgent.invoker("GetConfigFileString",["general", "branchcalling","",".\\conf\\zxcc.ini",2], function(result){
							callingNo = result;
							outCodeCallingNo = outCode + "" + callingNo;
							func();
						});
					}
				});
			}
		},

		/**
		 * 发送消息
		 * @param kind    目标类型 1：指定座席，2：指定组
		 * @param dstObj   目标座席工号或者组号
		 * @param msgType  0文本，1指令
		 * @param msg  消息内容
		 * @param cbFun
		 */
		sendMsg : function(kind, dstObj, msgType, msg, extendParams, cbFun)
		{
			var internalMsgType = 10000;
			if (msgType == 1)
			{
				internalMsgType = 10001;
			}

			WebAgent.invoker("SendMessageToAgent_V2", [ internalMsgType, msg,
					dstObj, kind ], function(result)
			{
				if (result != 0)
				{
					WebAgent.invoker("SendMessageToAgent",
							[ msg, dstObj, kind ], function(result)
							{
								if (!cbFun)
									return;
								if (result * 1 == 0)
								{
									cbFun(true, "sendMsg Succ.");
								} else
								{
									cbFun(false, result);
								}
							});

				} else
				{
					if (cbFun)
						cbFun(true, "sendMsg Succ.");
				}
			});
		},

		/**
		 * 咨询转
		 * 
		 * @param cbFun
		 */
		consultTransfer : function(cbFun)
		{
			var eh = new WebAgent.EventHelper();
			eh.regEvent("OnTransSuccess", function()
			{
				if (cbFun)
					cbFun(true, "Consult Transfer Succ.");
				eh.dispose();
			}, this);

			eh.regEvent("OnTransFailure", function()
			{
				cbFun(false, "Consult Transfer Failure.");
				eh.dispose();
			}, this);
			WebAgent.invoker("GetCallMediaType", "", function(mediaType)
			{
				WebAgent.invoker("Transfer", mediaType, function(result)
				{
					if (result * 1 != 0)
					{
						cbFun(false, result);
						eh.dispose();
					}
				});
			});
		},

		/**
		 * 单步转(释放转),直接转接并挂机交给平台处理，不保证转接成功
		 * 
		 * @param transferType
		 *            转接类型 0:座席工号，1：外部号码，2：技能组标识，3：IVR/MS，4：其他平台的呼叫中心技能
		 * @param dstObj
		 *            目标号码 目标号码,根据transferType填写：<br>
		 *            0-座席工号 <br>
		 *            1-用户号码 <br>
		 *            2-技能号 <br>
		 *            3-业务接入码
		 * @param outCode 
		 * 			  分行出局编码，如果没有填，则需要调用A接口获取。
		 * @param callingNo
		 *            选填 主叫号码，最大19个字符
		 * @param userData
		 *            可选 业务数据
		 * @param paramObj
		 *            扩展参数对象
		 * @param cbFun
		 *            异步回到函数
		 */
		singleStepTransfer : function(transferType, dstObj, outCode, callingNo,userData, paramObj, cbFun)
		{
			var outCodeCallingNo = callingNo;
			var func = function()
			{
				var eh = new WebAgent.EventHelper();
				if (cbFun)
				{
					eh.regEvent("OnSingleStepTransSuccess", function()
					{
						cbFun(true, "SingleStepTrans Succ.");
						eh.dispose();
					}, this);

					eh.regEvent("OnSingleStepTransFailure", function()
					{
						cbFun(false, "SingleStepTrans Failure.");
						eh.dispose();
					}, this);
				}

				var transFun = function(mediaType)
				{
					WebAgent.invoker("SingleStepTransfer", [ mediaType, dstObj,transferType, outCodeCallingNo ], function(result)
					{
						if (!cbFun)
							return;
						if (result * 1 != 0)
						{
							cbFun(false, result);
							eh.dispose();
						} else
						{
							cbFun(true, "singleStepTransfer succ.");
							eh.dispose();
						}
					});
				};

				WebAgent.invoker("GetCallMediaType", "", function(mediaType)
				{
					if (userData && userData.length > 0)
					{			
						ZteAgent.setSvcData(encodeURIComponent(userData),function(isSucc, errCode)
						{
							if(isSucc)
							{
								transFun(mediaType);
							}
							else
							{  
							   if (cbFun)
								 cbFun(false, errCode);
							}
						});		
					} else
					{
						transFun(mediaType);
					}
				});
			}
			if(outCode)
			{
				outCodeCallingNo = outCode + "" + callingNo;
				func();
			} else
			{
				WebAgent.invoker("GetConfigFileString",["general", "branchcode","",".\\conf\\zxcc.ini",2], function(ret){
					outCode = ret;
					if(callingNo)
					{
						outCodeCallingNo = outCode + "" + callingNo;
						func();
					}else{
						WebAgent.invoker("GetConfigFileString",["general", "branchcalling","",".\\conf\\zxcc.ini",2], function(result){
							callingNo = result;
							outCodeCallingNo = outCode + "" + callingNo;
							func();
						});
					}
				});
			}
			

		},
		
		/**
		 * 成功转,保持当前通话并呼叫目标坐席或工号成功后转接，保证转接成功
		 * 
		 * @param transferType  转接类型 0:座席工号，1：外部号码，2：技能组标识
		 * @param dstObj  目标号码 目标号码,根据transferType填写：<br>  0-座席工号 <br>  1-用户号码 <br>   2-技能号 <br>
		 * @param outCode 分行出局编码，如果没有填，则需要调用A接口获取。
		 * @param callingNo  选填 主叫号码，最大19个字符
		 * @param userData  可选 业务数据
		 * @param paramObj  扩展参数对象
		 * @param cbFun  异步回到函数
		 */
		succTransfer:function(transferType, dstObj, outCode, callingNo, userData, paramObj, cbFun)
		{
			var transferFun = function(result, desc)
			{
				//咨询成功后调用咨询转完成转接
				if(result==true)
				{
					ZteAgent.consultTransfer(cbFun);
				}else
				{
					if(cbFun)
						cbFun(result, desc);
				}
			};
			ZteAgent.consult(transferType, dstObj, outCode, callingNo, userData, null, transferFun);
		},
		
		/**
         * 会议
         * 
         * @param cbFun
         */
        conference : function(cbFun)
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvent("OnConferenceSuccess", function()
            {
                if (cbFun)
                    cbFun(true, "Conference Succ.");
                eh.dispose();
            }, this);

            eh.regEvent("OnConferenceFailure", function()
            {
                if (cbFun)
                    cbFun(false, "Conference Failure.");
                eh.dispose();
            }, this);

            // 获取正在保持的callid
            WebAgent.invoker("GetCallID", [ 1 ], function(callid)
            {
                WebAgent.invoker("Conference", [ callid ], function(result)
                {
                    if (!cbFun)
                        return;
                    if (result * 1 != 0)
                    {
                        cbFun(false, result);
                        eh.dispose();
                    }
                });
            });
        },
        
		/**
		 * 单步会议
		 * 
		 * @param callType 呼叫类型 1音频，2视频
		 * @param dstobj  目标号码或者工号
		 * @param objType  目标类型 0-座席工号 1-外部用户号码
		 * @param canspeak  0-只听不说 1-可听可说
		 * @param userData  业务数据
		 * @param paramObj  扩展数据对象
		 * @param cbFun 异步回到函数 定义为function(isSucc,errCode)
		 */
		singleStepConf : function(callType, dstobj, objType, canSpeak,
				userData, paramObj, cbFun)
		{
			var self = this;
			var param = "CT=0";
			if (callType == 2)
			{
				param = "CT=6";
			}

			var eh = new WebAgent.EventHelper();
			if (cbFun)
			{
				eh.regEvent("OnConferenceSuccess", function()
				{
					cbFun(true, "singleStepConf Succ.");
					eh.dispose();
				}, this);

				eh.regEvent("OnConferenceFailure", function()
				{
					cbFun(false, "singleStepConf Failure.");
					eh.dispose();
				}, this);
			}

			var singleStepConfFun = function()
			{
				if (objType == 0)
				{
					self.getAgtInfo(dstobj, function(agtInfo)
					{
						WebAgent.invoker("SingleStepConfCallEx", [
								agtInfo.phoneNo, canSpeak, '', param ],
								function(result)
								{

									if (!cbFun)
										return;
									if (result * 1 != 0)
									{
										cbFun(false, result);
										eh.dispose();
									} else
									{
										cbFun(true, "singleStepConf succ.");
										eh.dispose();
									}

								});
					});
				} else
				{
					WebAgent.invoker("SingleStepConfCallEx", [ dstobj,
							canSpeak, '', param ], function(result)
					{

						if (!cbFun)
							return;
						if (result * 1 != 0)
						{
							cbFun(false, result);
							eh.dispose();
						} else
						{
							cbFun(true, "singleStepConf succ.");
							eh.dispose();
						}

					});
				}

			};

			if (userData && userData.length > 0)
			{
				WebAgent.invoker("GetCallMediaType", "", function(mediaType)
				{		
					ZteAgent.setSvcData(encodeURIComponent(userData),function(isSucc, errCode)
					{
						if(isSucc)
						{
							singleStepConfFun();
						}
						else
						{  
						   if (cbFun)
							 cbFun(false, errCode);
						}
					});	

				});
			} else
			{
				singleStepConfFun();
			}
		},

		/**
		 * 咨询
		 * 
		 * @param consultType 咨询类型:<br>  0:座席工号，1：外部用户号码，2：技能，3：IVR
		 * @param dstObj  目标号码,根据transferType填写：<br>
		 *            0-座席工号 <br>
		 *            1-用户号码 <br>
		 *            2-技能号 <br>
		 *            3-业务接入码
		 * @param outCode 分行出局编码，如果没有填，则需要调用A接口获取。
		 * @param callingNo 选填 主叫号码 最大10个字符
		 * @param userData 选填 用户业务数据
		 * @param extendParams  扩展数据对象
		 * @param cbFun 异步回调函数
		 */
		consult : function(consultType, dstObj, outCode, callingNo, userData, extendParams, cbFun)
		{
			var outCodeCallingNo = callingNo;
			var func = function()
			{
				var eh = new WebAgent.EventHelper();
				eh.regEvent("OnConsultationSuccess", function()
				{
					eh.dispose();
					if(cbFun) cbFun(true,"consult succ");
				}, this);
				eh.regEvent("OnConsultationFailure ", function()
				{
					eh.dispose();
					if(cbFun) cbFun(false,"consult failure");
				}, this);
			
				var consultTag = 0; //0本地咨询(consultType为0,1,2)，1远端咨询（consultType为3）
				if (consultType == 3)
				{
					consultTag = 1;
				}

				var curMediaType = 0;

				var consultFun = function()
				{
					WebAgent.invoker("ConsultationEx", [ curMediaType, dstObj,consultType, consultTag, outCodeCallingNo ], function(result)
					{
						ZteAgent.log("consultation result:" + result);
						if(result*1 !=0)
						{
							if (cbFun)
							cbFun(false, result);
						}
					});
				};

				WebAgent.invoker("GetCallMediaType", [ "" ], function(mediaType)
				{
					curMediaType = mediaType;
					if (userData && userData.length > 0)
					{
						ZteAgent.setSvcData(encodeURIComponent(userData),function(isSucc, errCode)
						{
							if(isSucc)
							{
								consultFun();
							}
							else
							{  
							   if (cbFun)
								 cbFun(false, errCode);
							}
						});									
					} else
					{
						consultFun();
					}
				});
			}
			if(outCode)
			{
				outCodeCallingNo = outCode + "" + callingNo;
				func();
			} else
			{
				WebAgent.invoker("GetConfigFileString",["general", "branchcode","",".\\conf\\zxcc.ini",2], function(ret){
					outCode = ret;
					if(callingNo)
					{
						outCodeCallingNo = outCode + "" + callingNo;
						func();
					}else{
						WebAgent.invoker("GetConfigFileString",["general", "branchcalling","",".\\conf\\zxcc.ini",2], function(result){
							callingNo = result;
							outCodeCallingNo = outCode + "" + callingNo;
							func();
						});
					}
				});
			}
		},
		
	  /**
         * 座席在发起咨询操作后，通过该reconnect操作来结束和被咨询方的通话，同时恢复之前通话。
         * @param cbFun
         */
        reconnect : function(cbFun)
        {
            WebAgent.invoker("GetCallID", [1], function(callid)
             {
                if(callid)
                {
                    WebAgent.invoker("ReConnect", [callid], function(ret)
                            {
                                  self._invokerCallBack("reconnect", ret, cbFun);
                            });  
                }else
                {
                    ZteAgent.log("ZteAgent.reconnect failed. get hold callid failed.", "error");
                }
            });  
        },
        
        /**
         * 座席把一个被保持呼叫的设备恢复通话，把一个正在通话的设备变为保持
         * @param cbFun
         */
        alternate : function(cbFun)
        {
            WebAgent.invoker("GetCallID"[0], function(callid)
             {
                if(callid)
                {
                    WebAgent.invoker("Alternate", [callid], function(ret)
                            {
                                  self._invokerCallBack("alternate", ret, cbFun);
                            });  
                }else
                {
                    ZteAgent.log("ZteAgent.alternate failed. get calling callid failed.", "error");
                }
            });
        },
        /**
         * 设置全程监听 班长座席同一时刻只能针对一个目标座席设置全程监听。
         * @param flag 0：取消全程监听 1：设置全程监听
         * @param agtId 针对指定座席的设置或者取消全程监听
         * @param rejectincoming 1：座席进行全程监听操作后，系统不能将呼入电话分配给该座席，(在每次通话完毕,agtsvr需要自动进入质检状态，确保该座席不会被排队选中)。0：可以进电话
         * @param extendParam
         * @param cbFun
         */
        setFullListen : function(flag, agtId, rejectincoming, extendParam, cbFun)
        {
            var self = this;
            WebAgent.invoker("SetAinfProperty", ['NoIncomingCall_WhenFullListen', rejectincoming]);
           if(flag == 1)
           {
               WebAgent.invoker("StartFullListen", [agtId], function(ret)
              {
                   self._invokerCallBack("forceBusy", ret, cbFun);
               });
           }else if(flag == 0)
           {
               WebAgent.invoker("StopFullListen", [agtId], function(ret)
              {
                   self._invokerCallBack("forceBusy", ret, cbFun);
               });
           }
        },
        /**
         * 强制示忙
         */
        forceBusy : function(agtId, cbFun)
        {
            WebAgent.invoker("ForceBusy", [agtId], function(ret)
                    {
                          self._invokerCallBack("forceBusy", ret, cbFun);
                    });
        },
        
        /**
         * 强制示闲
         */
        forceIdle : function(agtId, cbFun)
        {
            WebAgent.invoker("ForceIdle", [agtId], function(ret)
                    {
                          self._invokerCallBack("forceIdle", ret, cbFun);
                    });
        },
        /**
         * 强制签出
         */
        forceOut : function(agtId, cbFun)
        {
            WebAgent.invoker("ForceOut", [agtId], function(ret)
                    {
                          self._invokerCallBack("forceOut", ret, cbFun);
                    });
        },
        /**
         *  强制锁定
         */
        forceLock : function(agtId, cbFun)
        {
            WebAgent.invoker("SetLock", [agtId], function(ret)
                    {
                          self._invokerCallBack("forceLock", ret, cbFun);
                    });
        },
        /**
         * 对指定座席的所有呼叫进行强拆，结束该座席参与的所有呼叫，该座席进入话后整理态。
         */
        forceClear : function(agtId, cbFun)
        {
            WebAgent.invoker("ForceClear", [agtId,""], function(ret)
                    {
                          self._invokerCallBack("forceClear", ret, cbFun);
                    });
        },
        
        /**
         * 监听/插话
         * @param agtId  被监听/插话的座席的工号  
         * @param mediaType 0：audio 1：vedio
         * @param type 0：监听 1：插话
         * @param extendParam 扩展参数对象，如果没有，填null.
         * @param cbFun
         */
        insert : function(agtId, mediaType, type, extendParam,  cbFun)
        {
            var ainfMediaType = 0;
            if (mediaType == 1)
            {
                ainfMediaType = 6;
            }
            switch (type)
            {
            case 0:
                WebAgent.invoker("ListenEx", [ agtId, ainfMediaType, "" ],
                function(ret)
                {
                     self._invokerCallBack("insert", ret, cbFun);
                });
                break;
            case 1:
                WebAgent.invoker("Insert", [ agtId, ainfMediaType ],
                function(ret)
                {
                    self._invokerCallBack("insert", ret, cbFun);
                });
                break;
            }
        },
        
        /**
         * 拦截指定座席处于通话的呼叫
         * @param agtId 被强制拦截的座席的工号
         * @param mediaType 0：audio 1：vedio
         * @param extendParam 扩展参数对象，如果没有，填null.
         * @param cbFun
         */
        intercept : function(agtId, mediaType, extendParam,  cbFun)
        {
            var ainfMediaType = 0;
            if (mediaType == 1)
            {
                ainfMediaType = 6;
            }
            WebAgent.invoker("InterceptEx", [ agtId, ainfMediaType ],
                    function(ret)
                    {
                        self._invokerCallBack("intercept", ret, cbFun);
                    });
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
        	WebAgent.invoker("StartShareServer", [ shareType,  content,  remoteType,  vcId,  remoteId,  exInfo],
                    function(ret)
                    {
                        self._invokerCallBack("startShareServer", ret, cbFun);
                    });
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
        	WebAgent.invoker("StopShare", [ remoteType,  vcId,  remoteId,  exinfo],
                    function(ret)
                    {
                        self._invokerCallBack("stopShareServer", ret, cbFun);
                    });
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
        	WebAgent.invoker("ChangeRemoteShareType", [ shareType,  remoteType,  vcId,  remoteId,  exInfo],
                    function(ret)
                    {
                        self._invokerCallBack("changeRemoteShareType", ret, cbFun);
                    });
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
			 WebAgent.invoker("SetMediaStatus", [2, 1001, 0, ""], function(ret)
			 {
				 if(ret*1==0)
				 {
					 if(cbFun)cbFun(true,"setMediaIdle succ.");
				 }else
				{
					 if(cbFun)cbFun(false,"setMediaIdle fail."); 
				}
			 });
		},
		/**
		 * 设置媒体示忙
		 */
		setMediaBusy:function(cbFun)
		{
			WebAgent.invoker("SetMediaStatus", [2, 999, 0, ""],function(ret)
			{
				 if(ret*1==0)
				 {
					 if(cbFun)cbFun(true,"setMediaBusy succ.");
				 }else
				{
					 if(cbFun)cbFun(false,"setMediaBusy fail."); 
				}
			});
		},
		  /**
         * 获取当前媒体处理能力状态 true:媒体示忙，false：媒体示闲
         */
        getMediaState:function()
        {
            WebAgent.isMediaBusy();
        },

		/**
		 * 结束即时消息会话
		 * @param flowNo 流水号
		 * @param peerKind 对端类型
		 * @param peerId  Kind=1: peerId为“座席工号” Kind=2: peerId为用户JID
		 * @param mediaType 媒体类型 (只针对kind=2有效) 
		 * @param subType 媒体子类型 (只针对kind=2有效) 
		 * @param cause 结束原因 座席结束(0~499)
		 * @param imlinkid 本次连接ID
		 * @param param
		 * @param cbFun(isSucc, err) 0为成功，其他失败（负数为A接口错误码，正数为CTI返回错误码），
		 * 详细定义如下：0：成功-1：坐席未登录-2：参数错误-3：超时-4：发送CTI失败-5：CTI响应消息错误-6：目的坐席不存在
		 */
		imEnd:function(flowNo, peerKind, peerId, mediaType,subType, cause, imlinkid, param, cbFun){
		    if(!param) param = "";
		    param+='imlinkid=' + imlinkid+";";
		    var self = this;
			WebAgent.invoke("ImEnd", [flowNo, peerKind, peerId, mediaType, subType, cause, param], function(ret)
			{
			    self._invokerCallBack("imEnd", ret, cbFun);
			});
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
		 * @param param
		 * @param cbFun(isSucc, err) 0为成功，其他失败（负数为A接口错误码，正数为CTI返回错误码），
		 * 详细定义如下：0：成功-1：坐席未登录-2：参数错误-3：超时-4：发送CTI失败-5：CTI响应消息错误-6：目的坐席不存在
		 */
		imSendMsg : function(flowNo, peerKind, peerId, mediaType, subType,msgid, content, imlinkid, param, cbFun)
		{
		    var self = this;
		    if(!param) param = "";
		    if(!(param.indexOf("imlinkid")  > -1|| param.indexOf("IMLINKID") > -1 )){
		        param+='imlinkid=' + imlinkid+";"; 				
		    }
            //调用A接口post方法
			self._postAinf("ImSendMsg",[ flowNo, peerKind, peerId, mediaType,subType, msgid, content, param ],cbFun);
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
		 * @param dstVcid:目标所属虚拟中心id
         * @param userdata
         * @param imlinkid
         * @param param
         * @param cbFun
         */
        imTransfer : function(flowNo, peerKind, peerId, mediaType, subType, dstType, dstObj, dstVcid,userdata, imlinkid, param, cbFun)
        {
            var self = this;
            if(!param) param = "";
            if(!(param.indexOf("imlinkid")  > -1|| param.indexOf("IMLINKID") > -1 ))
			{
                param+='imlinkid=' + imlinkid+";"; 
            }
			//当dstType = 1或等于3时,可以跨中心转接，指定目的虚拟中心
			if(dstType == 1  || dstType == 3)
			{
				param+='dstvcid=' + dstVcid +";"; 
			}
			
            WebAgent.invoke("ImTransfer", [ flowNo, peerKind, peerId, mediaType, subType, dstType, dstObj, userdata, param ], function(ret)
             {
                self._invokerCallBack("imTransfer", ret, cbFun);
            });
        },

        /**
         * Im取消转移，如果调用imTransfer转移到技能，在收到onImTransfered事件之前，可以调用该方法
         * @param flowNo
         * @param peerKind Kind=1座席工号（目前不支持）； Kind =2用户 ； Kind =3 会议（目前不支持）
         * @param peerId
         * @param mediaType
         * @param subType
         * @param imlinkid
         * @param params
         * @param cbFun
         */
        imCancelTransfer : function(flowNo, peerKind, peerId, mediaType, subType,
               imlinkid, params, cbFun)
        {
            var self = this;
            if(!param) param = "";
            if(!(param.indexOf("imlinkid")  > -1|| param.indexOf("IMLINKID") > -1 )){
                param+='imlinkid=' + imlinkid+";"; 
            }
            WebAgent.invoke("ImCancelTransfer", [ flowNo, peerKind, peerId, mediaType, subType,
                                            params ], function(ret)
             {
                self._invokerCallBack("imCancelTransfer", ret, cbFun);
             });
            
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
                userData, imlinkid, param, cbFun)
         {
            if(!param) param = "";
            var self = this;
            if(!(param.indexOf("imlinkid")  > -1|| param.indexOf("IMLINKID") > -1 )){
                param+='imlinkid=' + imlinkid+";"; 
            }
            WebAgent.invoke("ImOutside", [flowNo, peerKind, peerId, mediaType, subType,
                                           userData, param ], function(ret)
             {
                // self._invokerCallBack("imOutSide", ret, cbFun);
                var resultArr = ret.split(";");    // result =xx;idno=xx;imlinkid=xx;
                var isSucc = false,errCode = -1, flowNo = "", imlinkid = "";
                errcode = resultArr[0].split("=")[1];
                isSucc = (errcode==0?true:false);
                if(isSucc)
                {
                	flowNo = resultArr[1].split("=")[1];
               		imlinkid = resultArr[2].split("=")[1];
                }
                cbFun(isSucc, errcode, flowNo, imlinkid);
             }); 
             
         },

         /**
          * 查询IM会议成员
         * @param imlinkid
         * @param params
         * @param cbFun
         */
        imSnapShot : function( imlinkid, params, cbFun)
        {
            WebAgent.invoke("ImSnapShot", [imlinkid, params ], function(ret)
             {
                if(cbFun) cbFun(ret);
             });   
         },
		
		/**
		 * 同步坐席状态
		 */
		syncCurState:function()
		{
		  WebAgent.syncCurState();  
		},
		
		getStateNameByCode:function(code)
		{
			 return WebAgent.getStateNameByCode(code);
		},

		/**
		 * 设置视频通话窗口属性
		 * @param x
		 * @param y
		 * @param height
		 * @param width
		 * @param isShowLocalWindow
		 */
		setVideoWindow:function(x,y,height,width,isShowLocalWindow)
		{
			WebAgent.invoker("SetVideoWindow",['SetPos:' + x,y,height,width]);	
			if(isShowLocalWindow == null || isShowLocalWindow== undefined)
			{
				isShowLocalWindow = 0;
			}
			
			ZteAgent.setIsShowLocalVideoWindow(isShowLocalWindow,true);
		},
		/**
		 * 设置是否显示本地视频窗口
		 * @param isShowLocalWindow
		 */
		setIsShowLocalVideoWindow:function(isShowLocalWindow, isBuffer)
		{
			var t = 0;
			if(isShowLocalWindow)
			{
				t = 1;
			}
			ZteAgent.isShowLocalVideoWindow = isShowLocalWindow;
			if(isBuffer)
			{
			   localStorage.setItem("isShowLocalVideoWin",JSON.stringify(isShowLocalWindow));
			}
			
			WebAgent.invoker("SetVideoWindow",['ShowlocalWnd:' + t]);	
			ZteAgent.log("set isShowLocalVideoWindow property:" + isShowLocalWindow +", isBuffer:" + isBuffer , "info");
		},
		/**
		 * 获取呼叫ID
		 * @param type 0：获取正在通话的callid，1：获取正在保持的callid
		 * @param cbFun
		 */
		getCallID:function(type,cbFun)
		{
			WebAgent.invoker("GetCallID", [ type ], function(callid)
			{
				if(cbFun)cbFun(parseInt(callid));
			});
		},
		/**
		 * 查询当前与坐席通话的所有电话号码
		 * @param cbFun
		 */
		getAllPartsPhoneNo:function(cbFun)
		{
			WebAgent.invoker("getAllParts", "", function(calllist)
			{
				var resultArray = [];
				var arr = calllist;// "13996464978|123456789|99999999|8888888";
				var list = arr.split("\|");
				for ( var i = 0; i < list.length; i++)
				{
					if (list[i] == "")
					{
						continue;
					}
					resultArray.push(list[i]);
				}
				if (cbFun)
					cbFun(resultArray);
			});
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
           WebAgent.invoker("GetCallMediaType",[],function(ainfMediaType)
            {
                   if(ainfMediaType == 0)
                   {
                      resultObj.mediaType = 1;
                   }else if(ainfMediaType == 6)
                   {
                      resultObj.mediaType = 2;
                   }
                 WebAgent.invoker("GetAllParts2",[""],function(ret)
                 {
                     ZteAgent.log("GetAllParts2:" + JSON.stringify(ret), "info");
                     try
                     {
                        var retObj = self._decodeParam(ret);
                      var cnctinfo = retObj.cnctinfo;
                      resultObj.members = resultObj.members.concat(self._parseAllPartsInfo(cnctinfo));
                      var heldinfo = retObj.heldinfo;
                       resultObj.members = resultObj.members.concat(self._parseAllPartsInfo(heldinfo));
                       ZteAgent.log("getCurrentAllParts, result" + JSON.stringify(resultObj), "debug");
                      if(cbFun)cbFun(resultObj);
                   }catch(e)
                   {
                       ZteAgent.log("getCurrentAllParts failed. parse result error.", "error");
                       ZteAgent.log("getCurrentAllParts, result" + JSON.stringify(resultObj), "debug");
                       if(cbFun)cbFun(null);
                   }
               });  
          });
        
            /*ZteAgent.getCallMediaType(function(mediaType)
           {
                resultObj.mediaType =mediaType;
                WebAgent.invoker("GetAllParts2",[""],function(ret)
                        {
                            ZteAgent.log("GetAllParts2:" + JSON.stringify(ret), "info");
                             
                      });    
           });*/
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
			WebAgent.invoker("GetCallMediaType",[],function(ret)
			{
			    ZteAgent.log("ZteAgent.getCallMediaType, result:" + ret, "debug");
	            if(cbFun) cbFun(ret);
				if(cbFun)
				{
					if(ret == 0)
					{
						cbFun(1);
					}else if(ret == 6)
					{
						cbFun(2);
					}
				}
			});
		},
		/**
		 * 获取坐席电话号码
		 */
		getAgentPhoneNO:function(cbFun)
		{
		    var ret = WebAgent.getAgtPhoneNo();
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
            var ret = WebAgent.getCallFlowNO();
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
            var ret = WebAgent.GetUserData();
            ZteAgent.log("ZteAgent.getUserData, result:" + ret, "debug");
            if(cbFun) cbFun(ret);
            return ret;
        },
        /**
         * 获取呼叫随路数据
         * @param cbFun
         */
        getCallData:function(cbFun)
        {
           var ret = WebAgent.GetCallData();
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
            var ret = WebAgent.GetCallingNO();
            ZteAgent.log("ZteAgent.getCallingNO, result:" + ret, "debug");
            if(cbFun) cbFun(ret);
            return ret;
        },
        /**
         * 获取被叫号码
         * @param cbFun
         */
        getCalledNO: function(cbFun)
        {
            var ret = WebAgent.GetCalledNO();
            ZteAgent.log("ZteAgent.getCalledNO, result:" + ret, "debug");
            if(cbFun) cbFun(ret);
            return ret;
        },
        /**
         *获取最近一次错误,异步返回
         * 
         * @return function(errCode,cause)
         */
        getLastErrorCode: function(cbFun)
        {
            WebAgent.getErrCode(function(errCode)
            {
                ZteAgent.log("ZteAgent.getLastErrorCode, result:" + errCode, "debug");
                if(cbFun) cbFun(errCode);
            });
        },
        /**
         * 获取座席版本
         * @param cbFun
         */
        getVersion : function(cbFun)
        {
            WebAgent.getAllVersions(cbFun);
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
        setSvcData : function(svcData,cbFun)
        {
             var self = this;
			 var _flowno = WebAgent.GetFlowNo(),extinfo = WebAgent.GetExtInfo();
			 if(_flowno && extinfo)
			 {
				 var _charset = WebAgent.GetCharsetInfo();
				 if(_charset){extinfo += ";" + _charset}
				 self._postAinf("SetSvcData",[_flowno,encodeURIComponent(svcData),extinfo],cbFun);
			 }else
			 {
				 cbFun(false,"setSvcData  param  is valida.");
			 }		 	 	
        },
        /**
         * 获取用户业务随路数据
         * @param cbFun
         */
        getSvcData : function(cbFun)
        {
			var _flowno = WebAgent.GetFlowNo(),extinfo = WebAgent.GetExtInfo();
		    if(_flowno && extinfo)
			{
				var _charset = WebAgent.GetCharsetInfo();
				if(_charset){extinfo += ";" + _charset}
				WebAgent.invoker("GetSvcData",[ _flowno,extinfo ], function(result)
				{
					if(cbFun)
					{	
					    cbFun(true, decodeURIComponent(result));
					}	
				}); 
			}else
			{
				WebAgent.error("getSvcData param is invalid !");
				cbFun(false, null);
			}				
        },
        /**
         * 根据座席账号获取座席标识ID
         * @param account
         * @param cbFun
         */
        getAgtIdByAcnt:function(account, extendParam, cbFun)
        {
            //TODO 
            WebAgent.invoker("getAgtIdByAcnt",[account, param],function(ret)
			{
				  self._invokerCallBack("getAgtIdByAcnt", ret, cbFun);
			});
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
            WebAgent.invoker("ResetSkill",[agtId, skills],function(ret)
             {
                   self._invokerCallBack("resetSkill", ret, cbFun);
             });
        },
		/**
		 * 二次拨号
		 * @param dtmf
		 * @param cbFun
		 */
		sendDTMF : function(dtmf, cbFun)
		{
            WebAgent.invoker("SendDTMF",[dtmf],function(ret)
            {
                self._invokerCallBack("sendDTMF", ret, cbFun);
            });
		},
		/**
		 * 对座席终端进行设置静音或者取消静音, 主要用于座席的监听插话互转
		 * @param flag
		 * @param cbFun
		 */
		setPhoneMute:function(flag, cbFun)
		{
            WebAgent.invoker("SetPhoneMute",[flag],function(ret)
            {
                self._invokerCallBack("setPhoneMute", ret, cbFun);
            });
		},
		/**
		 * 直接调用A接口方法接口适配
		 */
		invokeAINF:function(methodName, args, cbFun)
		{
			WebAgent.invoker(methodName, args, cbFun);
		},
		/**
		 * 直接调用H接口方法接口
		 * @param methodName
		 * @param args
		 * @param cbFun
		 */
		invokeHINF: function(methodName, args, cbFun)
		{
		    throw  "座席类型“" + ZteAgent.agtType + "”不支持该接口!"; 
		},
		/**
		 * 注册A接口事件
		 * @param eventName 事件名称
		 * @param eventHandler 事件处理函数
		 * @returns eventHelper对象
		 */
		regAINFEvent:function(eventName, eventHandler)
		{
			return WebAgent.regEvent(eventName, eventHandler);
		},
		
		  /**
         * 注册H接口事件
         * @param eventName 事件名称
         * @param eventHandler 事件处理器函数
         */
        regHINFEvent:function(eventName, eventHandler)
        {
            throw  "座席类型“" + ZteAgent.agtType + "”不支持该接口!";
        },
		/**
		 * 反注册A接口事件
		 * @param eventHelper 对象
		 * @returns 
		 */
		unRegAINFEvent:function(eventHelper)
		{
			 WebAgent.unRegEvent(eventHelper);
		},
	    /**
         * 反注册H接口事件
         * @param function eventHelper 对象
         * @returns 
         */
        unRegHINFEvent:function(eventHandler)
        {
            throw  "座席类型“" + ZteAgent.agtType + "”不支持该接口!";
        },
		  /**
         * 挂机到自动业务
         * 
         * @param callData {String} 挂机时传递给自动业务的消息内容
         * @param fn {function} 接收调用结果的回调函数，可省略
         * @return 成功时返回0，失败时返回-1
         */
        clearCallToAutoService : function(callData,cbFun)
        {
            if (!WebAgent.isReady) return -1;
			var self = this;
            WebAgent.invoker("GetCallMediaType", "", function(medType)
            {  
			    if(callData && callData.length>0)
				{ 
				   ZteAgent.setSvcData(encodeURIComponent(callData),function(isSucc, errCode)
				   {
					 if(!isSucc)
					 {
						 self._invokerCallBack("clearCallToAutoService", '-1', cbFun);
						 return;
					 }		
				   });	   
 				   WebAgent.invoker("ReleaseCall", [ medType ], function(ret)
				   {
					     self._invokerCallBack("clearCallToAutoService", ret, cbFun);
				   });				
				 }
				else
				{
				     WebAgent.invoker("ReleaseCall", [ medType ], function(ret)
					 {
					    self._invokerCallBack("clearCallToAutoService", ret, cbFun);
					 });
				} 
            });

            return 0;
        },

		/**
		 * 状态切换事件适配
		 */
		onStateChanged : function()
		{
		    var eh = new WebAgent.EventHelper();
			eh.regEvent("OnStateChanged", function(state)
			{
                ZteAgent.log("WebAgent Event:OnStateChanged:"+ JSON.stringify([state]), 'debug');
				ZteAgent.publishEvent("onStateChanged", [ state.stateCode ]);
			}, this);
		},
		
		 onCTIAgentStateChanged : function(stateCode, laststateCode, cause, Param)
		 {
		     var eh = new WebAgent.EventHelper();
			 eh.regEvent("OnCTIAgentStateChanged", function(stateCode, laststateCode, cause, param)
			{
			     ZteAgent.log("WebAgent Event:OnCTIAgentStateChanged:"+ JSON.stringify([stateCode, laststateCode, cause, param]), 'debug');
				 ZteAgent.publishEvent("onCTIAgentStateChanged", [ stateCode, laststateCode, cause, param]);
			}, this);
				
		 },
		/**
		 * 媒体事件适配
		 */
		onMediaAbilityEvent:function()
		{  
		    var eh = new WebAgent.EventHelper();
			eh.regEvent("OnMediaAbilityEvent", function(type, value, cause, param)
		    {
			    ZteAgent.log("WebAgent Event:OnMediaAbilityEvent:"+ JSON.stringify([type, value, cause, param]), 'debug');
			    var extendParam = null;
			    var paramArry = [type, value, cause, param, extendParam];
						ZteAgent.publishEvent("onMediaAbilityEvent", paramArry);
			}, this);
		},
		
		  /**
         * 报工号结束事件
         */
         onPlayEnd:function()
         {
             var eh = new WebAgent.EventHelper();
             eh.regEvent("OnPlayEnd", function()
             {
                 ZteAgent.log("WebAgent Event:OnPlayEnd:"+ JSON.stringify(null), 'debug');
                 var extendParam = null;
                 var paramArray = [extendParam];
                 ZteAgent.publishEvent("onPlayEnd", paramArray);
             }, this);
         },

		/**
		 * 振铃事件适配
		 */
		onRinging : function()
		{
		    var eh = new WebAgent.EventHelper();
			eh.regEvent("OnRingingEvent", function(calling, callee,callid, calldata, correlatedata, param )
			{
			    ZteAgent.log("WebAgent Event:OnRingingEvent:"+ JSON.stringify([calling, callee, callid, calldata, correlatedata, param]), 'debug');
			    var paramArray = [calling, callee, callid, calldata, correlatedata, param];
				ZteAgent.publishEvent("onRinging", paramArray);
			}, this);
		},
		/**
         * 通话建立事件适配
         */
        onTalking : function()
        {
            var self = this;
            var eh = new WebAgent.EventHelper();
            eh.regEvent("OnTalking", function(mediatype, callid, calling, called, exinfo)
            {
                ZteAgent.log("WebAgent Event:OnTalking:"+ JSON.stringify([mediatype, callid, calling, called, exinfo]), 'debug');
                var extendParam =  self._decodeParam(exinfo);
                var paramArray = [callid, calling, called, extendParam];
                 ZteAgent.publishEvent("onTalking", paramArray);
            }, this);           
        },
        
		/**
		 * 挂机事件适配
		 * 
		 */
		onRelease : function()
		{
			// 从AgentService哪里监听来话事件，然后发布到ZteAgent
			var self = this;
			var eh = new WebAgent.EventHelper();
			eh.regEvents([ "210", "OnRelease" ], function(droper, dropee,
					callid, cause, lcstate, reason, exinfo)
			{
			    ZteAgent.log("WebAgent Event:OnRelease:"+ JSON.stringify([droper, dropee, callid, cause, lcstate, reason, exinfo]), 'debug');
			    var extendParam =  self._decodeParam(exinfo);
                var paramArray = [droper, dropee, callid, cause, lcstate, reason, extendParam];			    
				ZteAgent.publishEvent("onRelease", paramArray);
			}, this);
		},
		/**
		 * 会议事件适配
		 * 
		 * @TODO 会议事件待完成
		 */
		onConference : function()
		{
			// 从AgentService哪里监听来话事件，然后发布到ZteAgent
			var eh = new WebAgent.EventHelper();
			eh.regEvents([ "211", "OnConference" ], function(d1, d2, d3,
					callid, cause, calldata)
			{
			    ZteAgent.log("WebAgent Event:OnConference:"+ JSON.stringify([d1, d2, d3, callid, cause, calldata]), 'debug');
			    var extendParam = null;
                var paramArray = [d1, d2, d3, callid, cause, calldata, extendParam];
                ZteAgent.publishEvent("onConference", paramArray);
			}, this);
		},
		
		/**
         * 会议成员发生变化事件
         */
        onSnapShotCall:function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnSnapShotCall" ], function(callid, devicelist)
            {
                ZteAgent.log("WebAgent Event:OnSnapShotCall:"+ JSON.stringify([callid, devicelist]), 'debug');
                var extendParam = null;
                var paramArray = [callid, devicelist, extendParam];                
                ZteAgent.publishEvent("onSnapShotCall", paramArray);
            }, this);
        
        },
		/**
		 * 收到座席或网户发的消息事件
		 */
		onMessage : function()
		{
			var eh = new WebAgent.EventHelper();
			eh.regEvents([ "212", "OnRecvMessage" ], function(msgType,
					pMsg, srcAgtId, objtype, param, extInfo)
			{
			    ZteAgent.log("WebAgent Event:OnRecvMessage:"+ JSON.stringify([msgType,pMsg, srcAgtId, objtype, param, extInfo]), 'debug');
				var srcagtid = srcAgtId;
				var msgtype = 0;
				if (msgType == 10001)
				{
					msgtype = 1;
				}
				var msg = pMsg;			
				var paramArray = [srcagtid, objtype, msgtype, msg, param, extInfo];
				ZteAgent.publishEvent("onMessage", paramArray);
			}, this);
		},
		/**
         * 强锁事件适配
         * TODO A接口强锁事件没有工号
         */
        onForceLock : function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnForceLock"], function(srcagtid)
                    {
                       ZteAgent.log("WebAgent Event:OnForceLock:"+ JSON.stringify(srcagtid), 'debug');
                        ZteAgent.publishEvent("onForceLock", [srcagtid]);
                    }, this);    
        },
        
        /**
         * 强制示忙事件适配
         * TODO A接口事件没有工号
         */
        onForceBusy : function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnForceBusy2"], function(srcagtid)
            {
                  ZteAgent.log("WebAgent Event:OnForceBusy:"+ JSON.stringify(srcagtid), 'debug');
                  ZteAgent.publishEvent("onForceBusy", [srcagtid]);
            }, this);    
        },
        
        /**
         * 强制示闲事件适配
         * TODO A接口强锁事件没有工号
         */
        onForceIdle : function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnForceIdle2"], function(srcagtid)
            {
                  ZteAgent.log("WebAgent Event:OnForceIdle:"+ JSON.stringify(srcagtid), 'debug');
                  ZteAgent.publishEvent("onForceIdle", [srcagtid]);
            }, this);
        },
        
        /**
         * 强制示闲事件适配
         * TODO A接口强锁事件没有工号
         */
        onForceOut : function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnForceOutEx"], function(srcagtid)
            {
                  ZteAgent.log("WebAgent Event:OnForceOut:"+ JSON.stringify(srcagtid), 'debug');
                  ZteAgent.publishEvent("onForceOut", [srcagtid]);
            }, this);
        },
        
        /**
         * 全程录音事件
         * TODO A接口的录音事件太多，无法适配 OnBeginRecordSuccess OnBeginRecordFailure OnRecordFailure，OnRecordEvent
         */
        onRecord: function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnRecord"], function(type, errcode, filename, param1,param2)
            {
            	  var extendParam = {};
  			    extendParam.param1 = param1;
  			    extendParam.param2 = param2;
                       ZteAgent.log("WebAgent Event:OnRecord:"+ [type, errcode, filename, param1, param2].join(","), 'debug');
                        ZteAgent.publishEvent("onRecord", [type, errcode, filename, extendParam]);
            }, this);    
        },
        
        /**
         * 报工号结束事件
         */
        onPlayEnd: function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnPlayEndEvent"], function(e)
                    {
                       ZteAgent.log("WebAgent Event:OnPlayEndEvent:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onPlayEnd", []);
                    }, this);    
        },
		
		/**
		 * 转移事件适配
		 */
        onTransfered:function()
		{
		//TODO 和H接口不匹配	
		    var eh = new WebAgent.EventHelper();
			eh.regEvents(["OnTransfer"], function(transtel, calling, called, callid, calldata,param1, param2)
		    {
			    var extendParam = {};
			    extendParam.param1 = param1;
			    extendParam.param2 = param2;
			     ZteAgent.log("WebAgent Event:OnTransfer:"+ JSON.stringify([transtel, calling, called, callid, calldata]), 'debug');
			     ZteAgent.publishEvent("onTransfered", [transtel, calling, called, callid, calldata, extendParam]);
			}, this);
		},
		/**
		 * TODO A接口没有提供此事件
         * 单步转移事件适配
         */
        onSingleTransfered:function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnSingleTrans"], function(transtel, calling, called, callid, param1, param2)
             {
                ZteAgent.log("WebAgent Event:OnSingleTrans:"+ JSON.stringify([transtel, calling, called, callid, param1, param2]), 'debug');
                var extendParam = {};
			    extendParam.param1 = param1;
			    extendParam.param2 = param2;
                        ZteAgent.publishEvent("onSingleTransfered", [transtel, calling, called, callid, extendParam]);
             }, this);  
        },

		/**
		 * 预示闲成功事件（供zteAgent使用）
		 */
		onSetPreIdleSuccess : function()
		{

			WebAgent.regEvent("OnSetPreIdleSuccess", function()
			{
				ZteAgent.publishEvent("onSetPreIdleSuccess", []);
			});
		},
		/**
		 * 预示忙成功事件（供zteAgent使用）
		 */
		onSetPreBusySuccess : function()
		{

			WebAgent.regEvent("OnSetPreBusySuccess", function()
			{
				ZteAgent.publishEvent("onSetPreBusySuccess", []);
			});
		},
		  /**
         *  远端咨询返回事件
         */
        onReturnFromIVR:function()
        {
            //TODO 
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnReturnFromIVR2"], function(ivrdata, param1, param2)
             {
                ZteAgent.log("WebAgent Event:OnReturnFromIVR2:"+ JSON.stringify([ivrdata, param1, param2]), 'debug');
				var extendParam = {};
				extendParam.param1 = param1;
				extendParam.param2 = param2;
				if(param2)
				{
				   var obj = zteUtils._decodeParam(param2);
				   if(obj && obj.charset ==2)
				   {
						ivrdata = decodeURIComponent(ivrdata);
				   }
				}
				ZteAgent.publishEvent("onReturnFromIVR", [ivrdata, extendParam]);
             }, this);  
        
        },
        /**
         * 咨询方挂机事件
         */
        onConsultBack:function()
        { 
            //TODO 
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnConsultBack"], function(calling, called, callid, param1, param2)
             {
                ZteAgent.log("WebAgent Event:OnConsultBack:"+ JSON.stringify([calling, called, callid, param1, param2]), 'debug');
                        var extendParam = {};
                        extendParam.param1 = param1;
                        extendParam.param2 = param2;
                        ZteAgent.publishEvent("onConsultBack", [calling, called, callid, extendParam]);
             }, this);  
        },
		
		
        /**
         * 网络异常事件
         */
		onNetworkException : function()
		{
		 
            var eh = new WebAgent.EventHelper();
			eh.regEvents(["OnACDDisconnected","OnCTIDisconnected"], function()
			{
				ZteAgent.publishEvent("onNetworkException", []);
			}, this);
		},
		
				
        /**
         * 平台切换事件
         */
		onMasterChanged : function()
		{
			WebAgent.regEvent("onMasterChanged", function()
			{
				ZteAgent.publishEvent("onMasterChanged", []);
			});
		},
		
		
        /**
         * 共享连接事件
         */
        onShareStart : function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnShareStart"], function(result, content, remoteType, vcId, remoteId, exInfo)
             {
                ZteAgent.log("WebAgent Event:OnShareStart:"+ JSON.stringify([result, content, remoteType, vcId, remoteId, exInfo]), 'debug');
                        ZteAgent.publishEvent("onShareStart", [result, content, remoteType, vcId, remoteId, exInfo]);
             }, this);  
        },
        /**
         * 共享结束事件
         */
        onShareStop : function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnShareStop"], function (remoteType, vcId, remoteId, exInfo)
             {
                ZteAgent.log("WebAgent Event:OnShareStop:"+ JSON.stringify([remoteType, vcId, remoteId, exInfo]), 'debug');    
                        ZteAgent.publishEvent("onShareStop", [remoteType, vcId, remoteId, exInfo]);
             }, this);  
        },
        /**
         * 共享模式改变通知事件。
         */
        onShareTypeChange : function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnShareTypeChange"], function (result, shareType, remoteType, vcId, remoteId,  exInfo)
             {
                ZteAgent.log("WebAgent Event:OnShareTypeChange:"+ JSON.stringify([result, shareType, remoteType, vcId, remoteId,  exInfo]), 'debug');    
                        ZteAgent.publishEvent("onShareTypeChange", [result, shareType, remoteType, vcId, remoteId,  exInfo]);
             }, this);  
        },
		/**
		 *坐席的收到聊天开始请求事件适配
		 */
		onImBeginReqReceived:function()
		{
		    var self = this;
		    var eh = new WebAgent.EventHelper();
			eh.regEvent("OnImBeginReqReceived", function( idno,  kind,  peerId,  mediaType, subType, userdata, param)
			{
	             ZteAgent.log("WebAgent Event:OnImBeginReqReceived:"+ JSON.stringify([idno,  kind,  peerId,  mediaType, subType, userdata, param]), 'debug');
			    var paramObj = self._decodeParam(param);
			    var paramArray = [ idno,  kind,  peerId,  mediaType, subType, userdata, paramObj.imlinkid,  param];
			    ZteAgent.publishEvent("onImBeginReqReceived",  paramArray);
			}, this);
		},
		/**
		 * 坐席聊天收到消息事件适配
		 */
		onImMsgReceived:function()
		{
		    var self = this;
		    var eh = new WebAgent.EventHelper();
			eh.regEvent("OnImMsgReceived", function(idno, kind, peerId, mediaType, subType, msgId, msgTime, content, param)
			{
	            ZteAgent.log("WebAgent Event:OnImMsgReceived:"+ JSON.stringify([idno, kind, peerId, mediaType, subType, msgId, msgTime, content, param]), 'debug');
			    var paramObj = self._decodeParam(param);
			    var paramArray = [ idno, kind, peerId, mediaType, subType, msgId, msgTime, content, paramObj.imlinkid, param];
               ZteAgent.publishEvent("onImMsgReceived",  paramArray);
			}, this);
		},
	
		/**
		 * IM消息发送失败通知事件
		 */
		onImMsgSendFail : function()
	   {
		    var self = this;
		    var eh = new WebAgent.EventHelper();
		    eh.regEvent("OnImMsgSendFail", function(idno, kind, peerId, mediaType, subType, msgId, msgTime, content, param)
		    {
	            ZteAgent.log("WebAgent Event:OnImMsgSendFail:"+ JSON.stringify([idno, kind, peerId, mediaType, subType, msgId, msgTime, content, param]), 'debug');
		        var paramObj = self._decodeParam(param);
		        var paramArray = [ idno, kind, peerId, mediaType, subType, msgId, msgTime, content, cause, paramObj.imlinkid, param];
		        ZteAgent.publishEvent("onImMsgSendFail",  paramArray);
		    }, this);  
	   },
		/**
         * chat转移操作结果事件通知
         */
        onImTransfered:function()
        {
            var self = this;
            var eh = new WebAgent.EventHelper();
            eh.regEvent("OnImTransfered", function(idno,  result, kind,  peerid,  mediatype, subtype, dstkind, dstpeerid, param)
            {
                ZteAgent.log("WebAgent Event:OnImTransfered:"+ JSON.stringify([idno,  result, kind,  peerid,  mediatype, subtype, dstkind, dstpeerid, param]), 'debug');
                var paramObj = self._decodeParam(param);
                var paramArray = [ idno,  result, kind,  peerid,  mediatype, subtype, dstkind, dstpeerid, paramObj.imlinkid, param];
                ZteAgent.publishEvent("onImTransfered",  paramArray);
            }, this);    
        },
        /**
         * chat会议成员变更通知事件
         */
        onImConfMember:function()
        {
            var self = this;
            var eh = new WebAgent.EventHelper();
            eh.regEvent("OnImConfMember", function(flag,  idno,  peerKind,  id, mediaType,subType, userData, param)
            {
                ZteAgent.log("WebAgent Event:OnImConfMember:"+ JSON.stringify([flag,  idno,  peerKind,  id, mediaType,subType, userData, param]), 'debug');
                var paramObj = self._decodeParam(param);
                var paramArray = [flag,  idno,  peerKind,  id, mediaType,subType, userData,  paramObj.imlinkid, param];
                ZteAgent.publishEvent("onImConfMember",  paramArray);
             }, this);    
        },
		/**
		 * 坐席聊天会话结束事件适配
		 */
		onImEnd:function()
		{
		    var self = this;
		    var eh = new WebAgent.EventHelper();
			eh.regEvent("OnImEnd", function(idno, kind, peerId, mediaType, subType, cause, param)
		    {
			    ZteAgent.log("WebAgent Event:OnImEnd:"+ JSON.stringify([idno, kind, peerId, mediaType, subType, cause, param]), 'debug');
			    var paramObj = self._decodeParam(param);
                var paramArray = [idno, kind, peerId, mediaType, subType, cause, paramObj.imlinkid, param];
                ZteAgent.publishEvent("onImEnd",  paramArray);
         	}, this);
		},
		
	      /**
         * 全程监听通知事件适配
         * TODO A接口的事件里面的参数是被全程监听的座席电话，而H接口是被监听的座席工号
         */
        onFullListenNotify : function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnFullListenNotify"], function(agtid)
                    {
                        ZteAgent.log("WebAgent Event:OnFullListenNotify:"+ JSON.stringify(agtid), 'debug');
                        ZteAgent.publishEvent("onFullListenNotify", [agtid]);
                    }, this);    
        },
        
        /**
         * 监听/插话成功事件适配
         * TODO 
         */
        onInsert : function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnListenSuccess"], function()
                    {
            	         var cause = 0;
            	         var result = 0;
                        ZteAgent.log("WebAgent Event:OnListenSuccess:"+ JSON.stringify([cause, result]), 'debug');
                        ZteAgent.publishEvent("onInsert", [cause, result]);
                    }, this);   
            eh.regEvents(["OnListenFailure"], function()
                    {
            	         var cause = 0;
            	         var result = 1;
                        ZteAgent.log("WebAgent Event:OnListenFailure:"+ JSON.stringify([cause, result]), 'debug');
                        ZteAgent.publishEvent("onInsert", [cause, result]);
                    }, this); 
            eh.regEvents(["OnInsertSuccess"], function()
                    {
            	         var cause = 1;
            	         var result = 0;
                        ZteAgent.log("WebAgent Event:OnListenSuccess:"+ JSON.stringify([cause, result]), 'debug');
                        ZteAgent.publishEvent("onInsert", [cause, result]);
                    }, this); 
            
            eh.regEvents(["OnInsertFailure"], function()
                    {
            	         var cause = 1;
            	         var result = 1;
                        ZteAgent.log("WebAgent Event:OnInsertFailure:"+ JSON.stringify([cause, result]), 'debug');
                        ZteAgent.publishEvent("onInsert", [cause, result]);
                    }, this); 
        },
        
        /**
         * 呼叫被拦截事件适配
         * TODO 
         */
        onBeIntercepted : function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvents(["OnBeIntercept"], function(e)
                    {
                        ZteAgent.log("WebAgent Event:OnBeIntercept:"+ JSON.stringify(e), 'debug');
                        ZteAgent.publishEvent("onBeIntercepted", []);
                    }, this);    
        },
		
		/**
		 * 解析userdata数据键值对格式的数据
		 * @param userdata
		 * @returns {}
		 */
		_decodeParam: function (param)
		{
	        var key, value, paramObj = {};
	        
	        if(!param)
	        {
	            return paramObj;
	        }
	        
	        for (var startIndex = 0, eqIdx = param.indexOf('=', startIndex), semiIdx; eqIdx > -1;)
	        {
	            key = param.substring(startIndex, eqIdx).toLowerCase();
	            
	            // 随路数据中us是最后一个关键且其内容也可能会带=和;所以做特殊处理
	            if (key === "us")
	            {
	                value = param.substring(eqIdx + 1);
	                paramObj[key] = value;
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
	            
	            paramObj[key] = value;
	            
	            eqIdx = param.indexOf('=', startIndex);
	        }
	        
	        return paramObj;
		}, /**
         * 座席发起呼叫过程中失败原因通知事件适配
         */
        onFailCause18X:function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvent("OnFailCause18X", function(cause, param)
                    {
                        ZteAgent.log("WebAgent Event:OnFailCause18X:"+ JSON.stringify([cause, param]), 'debug');
                        ZteAgent.publishEvent("onFailCause18X", [cause, param]);
                    }, this);    
        },
        /**
         * 向座席发送某个技能的队列告警事件。
         */
        onQueueWarning:function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvent("OnQueWarningEvent", function(kind, data)
                    {
                        ZteAgent.log("WebAgent Event:OnQueWarningEvent:"+ JSON.stringify([kind, data]), 'debug');
                        ZteAgent.publishEvent("onQueueWarning", [kind, data]);
                    }, this);    
        },
        /**
         * 呼叫座席终端电话失败事件
         */
        onTerminalFail:function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvent("OnSipCallInTimeOut", function()
                    {
                        ZteAgent.log("WebAgent Event:OnSipCallInTimeOut: null", 'debug');
                        ZteAgent.publishEvent("onQueueWarning", []);
                    }, this);    
        },
        
        /**
         * CTI通知事件
         */
        onCtiReport : function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvent("OnCtiReport", function(eventType, param)
             {
                 ZteAgent.log("WebAgent Event:OnCtiReport: " + JSON.stringify([eventType, param]), 'debug');
                 ZteAgent.publishEvent("onCtiReport", [eventType, param]);
             }, this); 
        },
        
        /**
         * 数据库模式切换事件
         */
        onDataBaseModeChanged:function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvent("OnDataBaseModeChanged", function(mode)
             {
                 ZteAgent.log("WebAgent Event:OnDataBaseModeChanged: " + mode, 'debug');
                 ZteAgent.publishEvent("onDataBaseModeChanged", [mode]);
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
			 interceptPoint = WebAgent.EventHelper.intercept("OnStateChanged", function(interceptor)
	        {
	        	ZteAgent.log("intercept event [OnStateChanged], args:[" + JSON.stringify(interceptor.eventArgs) + "]" , "debug");
	            var state = interceptor.eventArgs[0];
	            try
            	{
	            	if ((state.stateCode * 1) != 305)
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
	                WebAgent.EventHelper.rmvIntercept(interceptPoint);
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
			ZteAgent.confManager.eh = new WebAgent.EventHelper();
			// 记录主持人坐席状态
			ZteAgent.confManager.eh.regEvent("OnCTIAgentStateChanged", function(curState, pevState, pameEx)
            {
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
            	    ZteAgent.log("<<<ZteAgent Conference Event:  onCreateConfSucc , args=[null]", "info");
            		ZteAgent.confManager.eventHandler("onCreateConfSucc", null);
                }
                //会议结束成功
                if(ZteAgent.confManager.isInConference == false && (curState>=200 &&curState<=203) || (curState>=400 && curState<=401) && pevState == 305)
        		{
                	ZteAgent.confManager.isConfMaster = false;
                	ZteAgent.confManager.isInConference =false;
                	localStorage.setItem(ZteAgent.confManager.webStorageKeys.CONF_MASTER,JSON.stringify(false));
            		localStorage.setItem(ZteAgent.confManager.webStorageKeys.IS_IN_CONFERENCE,JSON.stringify(false));
            		ZteAgent.confManager.eh.dispose(); //释放事件注册处理器
            		ZteAgent.confManager.eventHandler("onEndConfSucc", null);
            		ZteAgent.confManager.eventHandler = null;
          		  ZteAgent.log("<<<ZteAgent Conference Event:  onEndConfSucc , args=[null]", "info");
        		}
                //平台异常结束会议
                if(ZteAgent.confManager.isInConference == true && (curState>=200 &&curState<=203) || (curState>=400 && curState<=401) && (pevState == 305 || isCallState))
        		{
                	ZteAgent.confManager.isConfMaster = false;
                	ZteAgent.confManager.isInConference =false;
                	localStorage.setItem(ZteAgent.confManager.webStorageKeys.CONF_MASTER,JSON.stringify(false));
            		localStorage.setItem(ZteAgent.confManager.webStorageKeys.IS_IN_CONFERENCE,JSON.stringify(false));
            		ZteAgent.confManager.eh.dispose(); //释放事件注册处理器
            		ZteAgent.confManager.eventHandler("onEndConfSucc", null);
            		ZteAgent.confManager.eventHandler = null;
           	  	   ZteAgent.log("<<<ZteAgent Conference Event:  onEndConfSucc , args=[null]", "info");
        		}
  
            }, this);
            
			ZteAgent.confManager.eh.regEvents(["OnConference","211"], function(d1,d2,d3,callid,cause,calldata,exInfo)
			{
				for(var inx=0; inx<ZteAgent.confManager.memberList.length; inx++)
				{
					if(ZteAgent.confManager.memberList[inx].memberPhone == d2)
					{
						ZteAgent.confManager.memberList[inx].isSucc = true;
						ZteAgent.confManager.memberList[inx].memberState = 2;
						//缓存当前会议成员信息
						localStorage.setItem(ZteAgent.confManager.webStorageKeys.MEMBER_LIST,JSON.stringify(ZteAgent.confManager.memberList));

						if(ZteAgent.confManager.eventHandler)
						{
							 ZteAgent.log("<<<ZteAgent Conference Event:  onJoinSucc , args=["+JSON.stringify(ZteAgent.confManager.memberList[inx])+"]", "info");
							ZteAgent.confManager.eventHandler("onJoinSucc", ZteAgent.confManager.memberList[inx]);
						}
						break;
					}
				}
			}, this);
			//注册挂机事件
			ZteAgent.confManager.eh.regEvents(["OnRelease","210"],function(droper, dropee, callid, cause, lcstate, exinfo)
			{
				
				for(var inx=0; inx<ZteAgent.confManager.memberList.length; inx++)
				{
					if(ZteAgent.confManager.memberList[inx].memberPhone==dropee)
					{
						if(ZteAgent.confManager.eventHandler)
						{
							ZteAgent.log("<<<ZteAgent Conference Event:  onRelease , args=["+JSON.stringify(ZteAgent.confManager.memberList[inx])+"]", "info");
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
            //  待加入的成员，继续加入
            if(members == null || members.length<=0)
            {
                return;
            }
            
            var calldata = "CT=";
            WebAgent.invoker("GetCallMediaType", "", function(ainfMediaType)
            {
                var mediaType = 1;
                if(ainfMediaType == 6)
                {
                    mediaType = 2;
                }
                calldata +=mediaType;
                calldata +=";";
                
               for(var idx=0; idx<ZteAgent.confManager.memberList.length; idx++)
               {
                      if(ZteAgent.confManager.memberList[idx].memberState == 2)//  通话中不在呼叫
                      {
                           continue;
                      }
                          //  跳过呼叫自己
                     if(ZteAgent.confManager.memberList[idx].memberId ==ZteAgent.getAgtInfo().agtId)
                     {
                           continue;
                     }
                    ZteAgent.confManager.memberList[idx].isSucc = false;
                    var callBackFun = function(member)
                     {
                          return function(ret)
                          { 
                              this.member =     member;
                              if(ret*1!=0)
                              {
                                   this.member.isSucc =false;
                                   if(ZteAgent.confManager.eventHandler)
                                   {
                                       ZteAgent.log("<<<ZteAgent Conference Event:  onJoinError , args=["+JSON.stringify(this.member)+"]", "error");
                                       ZteAgent.confManager.eventHandler("onJoinError", this.member);
                                   }
                              }
                       };                          
                  };
                            //ZteAgent.bind(callBackFun, result[tmpMember[idx]]);
                  WebAgent.invoker('SingleStepConfCall2',[ZteAgent.confManager.memberList[idx].memberType,
                                                                    ZteAgent.confManager.memberList[idx].memberId,ainfMediaType,
                                                                    ZteAgent.confManager.memberList[idx].memberCanSpeak,
                                                                    "", "", ""], callBackFun(ZteAgent.confManager.memberList[idx]));
            }
		 });
	    },
		/**
		 * 创建会议
		 * @param mediaType
		 * @param param
		 * @param exInfo
		 * @param eventHandler
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
	            var ainfMediaType = 0;
	            if(mediaType == 2)
	            {
	                ainfMediaType = 6;
	            }
	            ZteAgent.confManager.isConfMaster = true;
	            //判断当前坐席状态，是否通话状态，咨询状态
	            var agtState = ZteAgent.getState()*1;
	            ZteAgent.confManager.memberList = members;
	            //缓存当前会议成员信息
	            localStorage.setItem(ZteAgent.confManager.webStorageKeys.MEMBER_LIST,JSON.stringify(ZteAgent.confManager.memberList));
	            
	            //两方通话状态下形成会议
	            if(agtState>=300 && agtState<=303)
	            {
	                self._callAllConfMembers(mediaType, members);
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
	                    //成功后逐个加入待入会的成员
	                    if(isSucc)
	                    {
	                        self._callAllConfMembers(mediaType, members);
	                    }
	                });
	            }
	            
	            //TODO 预约会议暂不支持
	            if((agtState>=200 && agtState<=203) || (agtState >=105 && agtState<=106))
	            {
	                ZteAgent.confManager.eh.regEvents(["OnCreateConference","214"],function(result, callid, mediatype, exinfo)
	                {
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
	            
	            WebAgent.invoker("SetPreCall",[""],function(result)
	            {
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
	                WebAgent.invoker("CreateConference",[ainfMediaType, "",""],function(ret)
	                        {
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
		 * @param extendParam
		 * @param cbFun
		 */
		addMemberInConference : function(member,extendParams, cbFun)
		{				
			WebAgent.invoker("GetCallMediaType", "", function(ainfMediaType)
			{
				WebAgent.invoker('SingleStepConfCall2',[member.memberType, member.memberId,ainfMediaType, member.memberCanSpeak,'',"",""], function(ret)
						{
							if(ret*1!=0)
							{
								if(cbFun)
								{
									cbFun(false, "addMemberInConference failed.");
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
			});
			
		},
		/**
		 * 从会议中剔除成员
		 * @param dstobj
		 * @param userData
		 * @param extendParam
		 * @param cbFun
		 */
		releaseMemberInConference:function(member, extendParams, cbFun)
		{
		    this.releaseCall(member.memberPhone, "", extendParams, function(isSucc, desc)
		     {
		          if(cbFun)
		          {
		                cbFun(isSucc,  (isSucc == true ? "releaseMemberInConference succ.":"releaseMemberInConference fail."));
		          }
		     });
		},
		/**
		 * 结束会议
		 */
		endConference:function(userData, extendParams, cbFun)
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
		 * 设置视频窗口句柄
		 */
		setVideoWindowEx:function(selfVideoHwnd,destVideoHwnd,cbFun)
		{
			WebAgent.invoker("SetVideoWindowEx", [selfVideoHwnd,destVideoHwnd],function(result)
			{
				if(result)
				{
					if(cbFun)
						cbFun(true,  "setVideoWindowEx success.");
				}else
				{
					if(cbFun)
						cbFun(false,  "setVideoWindowEx failed.");
				}
				
			}); 
		},

		/**
		 * 获取录音信息
		 * @Return 录音记录标识|呼叫流水号|呼叫ID
		 */ 
		getRecordRelatedInfo : function(cbFun)
		{
			WebAgent.invoker("GetRecordRelatedInfo","", function(result)
			{
				if(result)
				{
					if(cbFun)
						cbFun(true, result);
				}else 
				{
					if(cbFun)
						cbFun(false, result);
				}
			}); 
		},

		/**
		 * 播放语音
		 * @param wavefile 媒体服务器上存放的语音文件路径+文件名
		 * @param param
		 * @param cbFun(vuIndex, isSucc, errCode)
		 */
		playMsWave : function(wavefile, param, cbFun)
		{
			WebAgent.invoker("PlayMsWave",[ wavefile ], function(result)
			{
				var resultArr = result.split(";"); 
				var resultCode = resultArr[0].split("=")[1];
				var vuIndexArr = resultArr[1].split('=');
				if(resultCode*1 == 0)   // 表示成功
				{
					if(cbFun)
						cbFun(vuIndexArr[1], true, resultCode);
				}else 
				{
					if(cbFun)
						cbFun("", false, resultCode);
				}
			}); 
		},
		/**
		 * 停止语音
		 * @param vuIndex 放音资源索引
		 * @param param
		 * @param cbFun(isSucc, errCode)
		 */
		stopMsWave : function(vuIndex, param,cbFun)
		{
			WebAgent.invoker("StopMsWave",[ vuIndex ], function(result)
			{
				if(cbFun)
				{
					result = 1*result;
					cbFun(!result ? true : false, errCode);
				}	
			}); 
		},
		/**
		 * 语言播放控制
		 * @param kind 1-暂停，2-从上次暂停的位置恢复播放
		 * @param vuIndex  放音资源索引
		 * @param param  
		 * @param cbFun(isSucc, errCode)
		 */
		ctrlMsWave : function(kind, vuIndex, param,cbFun)
		{
			WebAgent.invoker("CtrlMsWave", [ kind , vuIndex ], function(result)
			{
				if(cbFun)
				{
					result = 1*result;
					cbFun(!result ? true : false, errCode);
				}	
			}); 
		},
		/*
		 * 获取Im随路数据
		 */
		getImSvcData:function(_flowno,cbFun)
		{
			if(!_flowno)
			{
				WebAgent.error("getImSvcData _flowno is invalid !");
				cbFun(false, null);
			}else
			{
				var  extinfo = WebAgent.GetImExinfo(_flowno);
				if(extinfo && extinfo.length != 0)
				{
					WebAgent.invoker("GetSvcData",[ _flowno,extinfo ], function(result)
					{
						if(cbFun)
						{					
							cbFun(true,decodeURIComponent(result));
						}	
					});
				}
			}				
		},
		
	   /**
		*post消息to Ainf
		*aInfSvrName:A接口服务名称
		*paramArr：参数数组  如果没有参数就传空字符串
		*cbFun:回调函数
		*/
		_postAinf:function(aInfSvrName,paramArr,cbFun)
		{
			 var self = this;
			 if(!aInfSvrName)
			 {
				 cbFun(false,"_postAinf failed,aInfSvrName is require!");
				 return;
			 }
			 if(paramArr && paramArr.length!= 0)
			 {
				paramArr = paramArr.join(",");
			 }
			 
			 var  param =  "params="+  paramArr + "&callback=_jqjsp";
			 var  request = new XMLHttpRequest();   
             if(request.withCredentials != null)
			 {	 				
				 var url = WebAgent.AinfOCX.ainfSevURL + aInfSvrName;
				 request.open("POST", url, true);
				 request.withCredentials = true;
				 request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");                                  
				 request.send(encodeURIComponent(param));
				 request.onreadystatechange = function()
				 {
					if (request.readyState==4)
					{
						 if(request.status == 200)
						 {
							// 返回的数据是"_jqjsp(\"xxxx\")"形式
							var retData = request.responseText;
							retData = retData.replace("_jqjsp(\"","");
							retData = retData.substr(0,retData.lastIndexOf("\")"));
							console.log("xxxxx==");
							self._invokerCallBack("_postAinf", retData, cbFun);										   
						 }
						 else
						 {
							cbFun(false,"_postAinf failed.");
						 }
					}
				 }  	 			 	 
           }
		},
		/**
		 * 设置Im随路数据
		 * @param _flowNo:流水号 坐席能同时支持多路及时聊天，固需要传入
		 * @param svcData : 业务数据
		 */
		setImSvcData:function(_flowno,svcData,cbFun)
		{	
			 var self = this;	
			 if(!_flowno)
			 {
				 WebAgent.error(">> setImSvcData _flowno is invalid !");
				 cbFun(false, null); 
			 }else
			 {
				 var  extinfo  =  WebAgent.GetImExinfo(_flowno);
				 if(extinfo && extinfo.length != 0)
				 {
					 self. _postAinf("SetSvcData",[_flowno,svcData,extinfo],cbFun);
				 }else
				 {
					 WebAgent.error(">>> setImSvcData exinfo is invalid !");
					 cbFun(false, null);
				 }	 
			 }
		},
		/**
		*对指定坐席进行教练模式
		* @param _destAgentID:目标坐席
		*/
		beginCoach:function(_destAgentID,cbFun)
		{
			WebAgent.invoker("BeginCoach",[ _destAgentID ], function(result)
			{
				if(cbFun)
				{	
					if(resultCode *1 == 0)   // 表示成功
					{
						cbFun(true, "succ");
					}else 
					{
						cbFun(false, "fail");
					}
				}	
			});
		},
		/**
		*结束教练者
		*/
		endCoach:function(){
			WebAgent.invoker("EndCoach",[], function(result)
			{
				if(cbFun)
				{	
					if(resultCode * 1 == 0)   // 表示成功
					{
						cbFun(true, "succ");
					}else 
					{
						cbFun(false, "fail");
					}
				}	
			});
		},
		/**
		 * 初始录屏事件
		 */
		_initScreenRecHandleEvent : function(){
			ZteAgent.startScreenRecEventNo = ZteAgent.regEvent("onTalking",function(){
				if(ZteAgent.isScreenRec){//启动录屏
					//ZteAgent.sreenRec.config
					
					var uploadInfo = "isupload=1|<";
					WebAgent.invoker("GetConfigFileString",["uploadrec", "httpurl","",".\\conf\\zxcc.ini",2], function(httpurl){
						
						uploadInfo = uploadInfo + httpurl + "#"

						WebAgent.invoker("GetConfigFileString",["uploadrec", "recinitpath","",".\\conf\\zxcc.ini",2], function(recinitpath){

							uploadInfo = uploadInfo + recinitpath + "#"

							WebAgent.invoker("GetConfigFileString",["uploadrec", "recdevid","",".\\conf\\zxcc.ini",2], function(recdevid){
								
								WebAgent.invoker("GetConfigFileString",["uploadrec", "UploadRecPath","",".\\conf\\zxcc.ini",2], function(uploadrecpath){

									WebAgent.invoker("GetConfigFileString",["sipphone", "recpath","",".\\conf\\zxcc.ini",2], function(recpath){
										var tmptime = zteUtils.dateFormatStr(new Date(),"yyyyMMddhhmmss");
										var tmpdate = zteUtils.dateFormatStr(new Date(),"yyyyMMdd");
										var filename = tmptime+".wmv";

										var vcid = ZteAgent.getAgtInfo().vcid;
										var agtId = ZteAgent.getAgtInfo().agtId;

										var filepath = recpath+"/"+vcid+"/screencap/"+tmpdate+"/700/"+agtId+"/"+filename;
										ZteAgent.sreenRec.config.recordFileName = filepath;
										

										
										var recordpath = vcid+"/screencap/"+tmpdate+"/"+agtId+"/"+filename;
										uploadInfo = uploadInfo + recordpath + ">";
										uploadInfo = uploadInfo + "|starttime="+tmptime+"|compressmode=wav|enhanced=0";
										ZteAgent.sreenRec.config.recordPath = recordpath;

										ZteAgent.sreenRec.config.uploadInfo = uploadInfo;
										console.log("startScreenRec")
										ZteAgent.startScreenRec(1,1);

									});
								});

							});
						});

					});
				}
			});

			ZteAgent.regEvent("onTalking", function(){
				WebAgent.invoker("GetFlowNo", [], function(result)
	            {
	            	console.log("flowNo:"+result);
	            	ZteAgent.flowNO = result;
	            });
			});

			ZteAgent.stopScreenRecEventNo = ZteAgent.regEvent("onRelease",function(){
				if(ZteAgent.isScreenRec){//启动录屏
					ZteAgent.stopScreenRec();
				}
			});
			
		}
	};