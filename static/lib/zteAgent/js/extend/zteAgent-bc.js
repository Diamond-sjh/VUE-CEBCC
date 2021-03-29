/**
 * 中行演示扩展接口
 */
(function(ZteAgent)
{
	/**
	 * 中行测试配置项
	 */
	var cbTestCfg = {
			fakeCallingNo:"95566",//中行测试呼出伪主叫
			sysaccount:"liubo@a10117097.com", //发送邮件的系统账号
			priority:1 //发送邮件的优先级
	};
	
	var callingNo=""; //来电主叫号码
	var callflowNo = ""; //来电电话ID
	var callingDate = null; //来电时间
	//登录后注册监听器
	ZteAgent.onLogined(function()
	{
		ZteAgent.regEvent("onRinging", function(calling, callee, callid, calldata)
		{
			callingNo = calling;
			callingDate = new Date();
			ZteAgent.invokeINF("GetFlowNo", function(ret)
			{
				callflowNo = flowNo;
			});
			//来话时清空缓存数据
			ZteAgent.buffer.delAllValues();
		});
	});
	
	
	ZteAgent.extend(
		{
			 
			/**
			 * 返回座席分机号码
			 */
			getExtNum : function()
			{
				return ZteAgent.getAgtInfo().phoneNo;
			},
			/**
			 * 返回来电号码
			 */
			getCallNum : function()
			{
				return callingNo;
			},
			/**
			 * 返回本通电话ID
			 */
			getCallId : function()
			{
				return callflowNo;
			},
			/**
			 * 返回本通电话的来电时间
			 * 时间格式：xxx
			 */
			getCallTime : function()
			{
				return callingDate;
			},
			/**
			 * 设置taskId
			 * @param taskId
			 */
			setTaskID:function(taskId)
			{
				ZteAgent.buffer.saveValue("taskId", taskId);
			},
			/**
			 * 返回随路数据中的任务编号
			 */
			getTaskID : function()
			{
				return ZteAgent.buffer.getValue("taskId");
			},
			/**
			 * 写客户姓名到缓存
			 * @param custName
			 */
			setCustName:function(custName)
			{
				ZteAgent.buffer.saveValue("custName", custName);
			},
			/**
			 * 返回随路数据中的客户姓名
			 */
			getCustName : function()
			{
				return ZteAgent.buffer.getValue("custName");
			},
			/**
			 * 设置性别到缓存
			 * @param gender
			 */
			setGender:function(gender)
			{
				ZteAgent.buffer.saveValue("gender", gender);
			},
			/**
			 * 返回随路数据中的客户性别
			 */
			getGender : function()
			{
				return ZteAgent.buffer.getValue("gender");
			},
			/**
			 * 返回登录座席的编号
			 */
			getUserID : function()
			{
				return ZteAgent.getAgtInfo().agtId;
			},
			/**
			 * 返回登录座席所在的机构
			 */
			getOrgNo : function()
			{
				return ZteAgent.getAgtInfo().groupId;
			},
			/**
			 * 按给出的电话号码拨号,参数：电话号码
			 * @param phoneNum
			 */
			dailPhone : function(phoneNum)
			{
				ZteAgent.callUser(phoneNum,1, cbTestCfg.fakeCallingNo, null);
			},
			/**
			 * 发送邮件,参数：邮箱地址、邮件内容
			 * @param mailBox
			 * @param letter
			 */
			sendMail : function(mailBox, letter)
			{
				//接口名称，业务开发人员直接拷贝使用即可
	            var ifName = "bcTestsendEmail";
	            var agtInfo = ZteAgent.getAgtInfo();
	            //请求参数
	            var reqParams = new Object(); 
	            reqParams.vcid=agtInfo.vcid;
	            reqParams.flowno="";
	            reqParams.operid=agtInfo.agtId;
	            reqParams.priority=cbTestCfg.priority;
	            reqParams.sysaccount=cbTestCfg.sysaccount;
	            reqParams.useraccount=mailBox;
	            reqParams.recvaddr=mailBox;
	            reqParams.ccaddr="";
	            reqParams.bccaddr="";
	            reqParams.mailtitle=letter;
	            reqParams.basepath="";
	            reqParams.contenttype=0;
	            reqParams.mailbody=letter;
	            reqParams.attach=""; 
	            
	            //可选参数，方便业务记录日志信息，不需要不传即可		
	            var logParams = new Object();
	            ZteAgent.log("sendEmail req:"+JSON.stringify(reqParams), "info");
	            $.mr().callhttp(ifName,reqParams,logParams).onSucc(
	            function(res){
	            	//{result:xxx, description:xxx, mediaid:xxx},result:1 magw发送邮件成功，其他值异常
	             ZteAgent.log("sendEmail result:"+JSON.stringify(res), "info");
	            }).onErr(
	            function(res){
	            	ZteAgent.log("sendEmail error:"+JSON.stringify(res), "info");
	               // 此处的 res结构为：{errCode: 整型错误码, errMsg: "错误信息"}，错误码定义如下：
	               // 5001——当前的并行处理数超过设置的最大并行处理数, 5002——接口调用失败次数超过设置的最大失败次数
	               // 5003——连接第三方接口异常, 5004——第三方接口响应超时异常, 5000——其他错误
	            });

			},
			/**
			 * 转IVR节点，参数：node，节点ID；para，业务参数，由平台通过随路数据传输给IVR
			 * TODO 节点ID放到哪里？
			 * @param node
			 * @param para
			 */
			callTransIVR : function(node, para)
			{
				ZteAgent.invokeAINF("GetCallMediaType", "", function(medType)
				{
					ZteAgent.invokeAINF("SetCallData", [ medType, para ],
							function(result)
							{
								ZteAgent.invokeAINF("ReleaseCall", [ medType ]);
							});
				});
			}
		});
})(ZteAgent);