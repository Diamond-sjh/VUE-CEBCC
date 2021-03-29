/**
 * ZteAgent扩展功能之接口服务
 * 提供标准API访问后台数据服务
 */
(function(ZteAgent)
{
	var isInit = false;

	function init(url)
	{
		ZteAgent.script.loadJs([ url ], function()
		{
			isInit = true;
		});
	}
	ZteAgent.extend(
		{
			infServInit:init,
			/**
			 * 查询在线坐席列表
			 * 
			 * @param params
			 * @param pageIndex
			 * @param pageSize
			 * @param cbFun
			 */
			getOnlineAgentPageList : function(params, pageIndex, pageSize, cbFun)
             {
                        if (!isInit)
                        {
                            init();
                            return;
                        }
                        params.pageSize = pageSize;
                        params.pageIndex = pageIndex;
                        try
                        {
                            $.mr().handleData(
                                    "zteAgentEbase.queryOnlineAgentPageList",
                                    params).onSucc(function(pageDataSet)
                            {
                                cbFun(pageDataSet);
                            }).onErr(
                                    function(XMLHttpRequest, textStatus,
                                            errorThrown)
                                    {
                                        cbFun(null);
                                    });
                        } catch (e)
                        {
                            cbFun(null)
                        }
             },
			/**
			 * 查询技能分页列表
			 * @param params
			 * @param pageIndex
			 * @param pageSize
			 * @param cbFun
			 */
			getSkillPageList:function(params, pageIndex, pageSize, cbFun)
			{
				if (!isInit)
				{
					init();
					return;
				}
				params.pageSize = pageSize;
				params.pageIndex = pageIndex;
				try{
				$.mr().handleData("zteAgentOra.querySkillPageList", params)
						.onSucc(function(pageDataSet)
						{
							cbFun(pageDataSet);
						}).onErr(
								function(XMLHttpRequest, textStatus,
										errorThrown)
								{
									cbFun(null);
								});
				}catch(e){cbFun(null);}
			},
			/**
			 * 查询在线网户列表
			 * @param params
			 * @param pageIndex
			 * @param pageSize
			 * @param cbFun
			 */
			getOnlineUwcPageList:function(params, pageIndex, pageSize, cbFun)
			{

				if (!isInit)
				{
					init();
					return;
				}
				params.pageSize = pageSize;
				params.pageIndex = pageIndex;
				try{
				$.mr().handleData("zteAgentEbase.queryOnlineUwcPageList", params)
						.onSucc(function(pageDataSet)
						{
							cbFun(pageDataSet);
						}).onErr(
								function(XMLHttpRequest, textStatus,
										errorThrown)
								{
									cbFun(null);
								});
				}catch(e){cbFun(null);}
			
			},
			/**
			 * 根据号码获取对应的ID和类型
			 * TODO 具体实现待测试
			 * @param telPhone
			 * @param cbFun
			 */
			getIdTypeByTel:function(telPhone,cbFun)
			{
				var id= "zteAgentEbase.getIdTypeBytel";  
			    var variables = new Object(); 
			    variables.telphone=telPhone; 
			      try{
			    $.mr().handleData(id,variables).onSucc(
			    function(res){
			    	cbFun(res);
			    }).onErr(
			    function(res){
			    	cbFun(null);
			    });
			      }catch(e){cbFun(null);}
			},
			/**
			 * 查询webchat聊天历史消息
			 * @param flowno
			 * @param cbFun
			 */
			getWebChatMessageList:function(flowno, cbFun){
				var id= "zteAgentMagwOra.getWebChatMessageList";  
	            var variables = new Object(); 
	            variables.flowNo=flowno; 
	              
	            $.mr().handleData(id,variables).onSucc(
	            function(res){
	            	cbFun(res);
	            }).onErr(
	            function(res){
	            	cbFun(null);
	            });

			},
			/**
			 * 获取webchat聊天消息
			 * @param flowno
			 * @param msgid
			 * @param cbFun
			 */
			getWebChatMessage:function(flowno, msgid, cbFun)
			{
				var id= "zteAgentMagwOra.getWebChatMessage";  
	            var variables = new Object(); 
	            variables.msgId=msgid; 
	            variables.flowNO=flowno; 
	            $.mr().handleData(id,variables).onSucc(
	    	            function(res){
	    	            	cbFun(res[0]);
	    	            }).onErr(
	    	            function(res){
	    	            	cbFun(null);
	    	            });
			},
			/**
			 * 获取weixin消息
			 * @param flowno
			 * @param weixinId
			 * @param cbFun
			 */
			getWeChatMessage:function(flowno,weixinId, cbFun){
				var id= "zteAgentMagwOra.getWeChatMsg";  
	            var variables = new Object(); 
	            variables.weixinId= weixinId; 
	            variables.flowNO=flowno; 
	              
	            $.mr().handleData(id,variables).onSucc(
	    	            function(res){
	    	            	cbFun(res[0]);
	    	            }).onErr(
	    	            function(res){
	    	            	cbFun(null);
	    	            });
			},
			/**
			 * 获取微信历史消息列表
			 * @param flowno
			 * @param cbFun
			 */
			getWeChatMessageList:function(flowno, cbFun){
				var id= "zteAgentMagwOra.getWeChatMessageList";  
	            var variables = new Object(); 
	            variables.flowNo=flowno; 
	            $.mr().handleData(id,variables).onSucc(
	    	            function(res){
	    	            	cbFun(res);
	    	            }).onErr(
	    	            function(res){
	    	            	cbFun(null);
	    	            });
			},
			/**
			 * 回复微信消息
			 * @param params{
			 *  flowNo:xxx, 
			 *  wechatId : sessionEntry.replyWeChatId,
			 *  sysAccount : sessionEntry.sysAccount,
			 *  userAccount : sessionEntry.userAccount,
			 *   msgType : 1,
			 *   content : val,
			 *   agtId:xxx,
			 *   vcid:xxx
			 *   }
			 * @param cbFun
			 */
			replayWeChatMsg:function(params, cbFun){
				 ZteAgent.log("replayWeChatMsg>>>>>>>params:["+JSON.stringify(params)+"]", "info");
				ZteAgent.getWeChatMessage(params.flowNo, params.wechatId,function(oldMsg){
					if(!oldMsg)
					{
						 ZteAgent.log("replayWeChatMsg>>>>>>>getWeChatMessage result:["+JSON.stringify(oldMsg)+"]", "error");
						cbFun(null);
						return;
					}
					ZteAgent.log("replayWeChatMsg>>>>>>>getWeChatMessage result:["+JSON.stringify(oldMsg)+"]", "info");
					//接口名称，业务开发人员直接拷贝使用即可
		            var ifName = "bcTestReplyWexin";
		            //请求参数
		            var reqParams = new Object(); 
		            reqParams.vcid=params.vcid;
		            reqParams.flowno=params.flowNo;
		            reqParams.operid=params.agtId;
		            reqParams.priority=1;
		            reqParams.sysaccount=params.sysAccount;
		            reqParams.sysacttype="";
		            reqParams.useraccount=params.userAccount;
		            reqParams.origmsgid=oldMsg.msgid +"";
		            reqParams.createtime=zteUtils.dateFormatStr(new Date(), 'yyyy-MM-dd hh:mm:ss');
		            reqParams.msgtype= params.msgType + "";
		            reqParams.content=params.content;
		            reqParams.news="{}";
					if(params.image){
						reqParams.image=params.image;
					}else{
		            reqParams.image="{}";
					}
					if(params.voice){
						reqParams.voice=params.voice;
					}else{
		            reqParams.voice="{}";
					}
					if(params.video){
						reqParams.video=params.video;
					}else{
		            reqParams.video="{}";
					}
		            
		            //可选参数，方便业务记录日志信息，不需要不传即可		
		            var logParams = new Object();
		            //logParams.callno="13655558888";
		            ZteAgent.log("replayWeChatMsg>>>>>>>reqParams:["+JSON.stringify(reqParams)+"]", "info");
		            $.mr().callhttp(ifName,reqParams,logParams).onSucc(
		            function(res){
		            	 ZteAgent.log("replayWeChatMsg<<<<<<<<<<<result:["+JSON.stringify(res)+"]", "info");
		              if(res.result == "1"){
		            	  cbFun(res.mediaid);
		              }else{
		            	  cbFun(null);
		              }
		            }).onErr(
		            function(res){
		               // 此处的 res结构为：{errCode: 整型错误码, errMsg: "错误信息"}，错误码定义如下：
		               // 5001——当前的并行处理数超过设置的最大并行处理数, 5002——接口调用失败次数超过设置的最大失败次数
		               // 5003——连接第三方接口异常, 5004——第三方接口响应超时异常, 5000——其他错误
			             cbFun(null);
			             ZteAgent.log("replayWeChatMsg<<<<<<<<<<<error result:["+JSON.stringify(res)+"]", "error");
		            });

				});
			},
			/**
			 * 获取微信用户信息
			 * @param sysaccount
			 * @param useraccount
			 * @param lang
			 * @param cbFun
			 */
			getWeChatUserInfo:function(sysaccount,useraccount,cbFun){
				
				var ifName = "bcTestGetWeChatUserInfo";
	            //请求参数
	            var reqParams = new Object(); 
	            reqParams.sysaccount=sysaccount;
	            reqParams.useraccount=useraccount;
	            
	            //可选参数，方便业务记录日志信息，不需要不传即可		
	            var logParams = new Object();
	            ZteAgent.log("getWeChatUserInfo>>>>>>>params:["+JSON.stringify(reqParams)+"]", "info");
	            $.mr().callhttp(ifName,reqParams,logParams).onSucc(
	            function(res){
	            	
	             if(res && res.result == '1'){
	            	 cbFun(res);
	            	 ZteAgent.log("getWeChatUserInfo<<<<<<<onSucc:["+JSON.stringify(res)+"]", "info");
	             }else{
	            	 ZteAgent.log("getWeChatUserInfo<<<<<<<onErr:["+JSON.stringify(res)+"]", "error");
	            	 cbFun(null);
	             }
	            }).onErr(
	            function(res){
	               // 此处的 res结构为：{errCode: 整型错误码, errMsg: "错误信息"}，错误码定义如下：
	               // 5001——当前的并行处理数超过设置的最大并行处理数, 5002——接口调用失败次数超过设置的最大失败次数
	               // 5003——连接第三方接口异常, 5004——第三方接口响应超时异常, 5000——其他错误
	            	 cbFun(null);
	            	 ZteAgent.log("getWeChatUserInfo>>>>onErr:["+JSON.stringify(res)+"]", "error");
	            });

			}
		});

})(ZteAgent);