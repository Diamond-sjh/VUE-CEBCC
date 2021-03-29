/**
 * 维护“会议主持人”标记 ,WebAgent.isConfMaster()
 * 实现原理： 在调用A接口方法SingleStepConfCall、Conference时，设置主持人标记，离开会议态时清除标记
 */
(function(WebAgent)
{
    // 是否会议主持人标记
    var isMaster = false;

    // 会议态状态码
    var CONF_STATE_CODE = 305;
    
    var succEventFlag = false;

    var eh = null;

    // 重载WebAgent.invoker()
    WebAgent.confMasterInvoker = WebAgent.invoker;
    WebAgent.invoker = function(method, args, fn)
    {
        var isConfMethod = method.indexOf("SingleStepConfCall") >= 0;
        isConfMethod |= method.indexOf("Conference") >= 0;

        // 如果调用了进入会议的相关方法，且当前状态为“咨询态”或“通话态”时，设置isMaster=true
        if (isConfMethod)
        {
            var stateCode = WebAgent.getState().stateCode * 1;
            var isConsState = (stateCode >= 306) && (stateCode <= 308); // 咨询
            var isCallState = (stateCode >= 300) && (stateCode <= 303); // 通话

            if (isConsState || isCallState)
            {
                isMaster = true;
                
				// 离开会议时重置标记
                var eh = WebAgent.regEvent("OnCTIAgentStateChanged", function(curState, pevState, pameEx)
                {
                	var isConsState = (pevState >= 306) && (pevState <= 308); // 咨询
            		var isCallState = (pevState >= 300) && (pevState <= 303); // 通话
                    if ((pevState == CONF_STATE_CODE) && (curState != CONF_STATE_CODE))
                    {
                    	succEventFlag = false;
                        isMaster = false;
                        eh.dispose();
                        WebAgent.saveConfMasterFlag(false);
                        // alert("离开会议态！isMaster="+isMaster);
                    }else if( (curState == CONF_STATE_CODE) && (isConsState || isCallState))
                    {
                    	isMaster = true;
                		WebAgent.saveConfMasterFlag(true);
                    }else
                    {
                    	isMaster = false;
                        WebAgent.saveConfMasterFlag(false);
                        eh.dispose();
                    }
                }, eh);
                
                var eh2 = WebAgent.regEvent("OnConferenceFailure",function()
                {
                	if(!succEventFlag)
                	{
                		isMaster = false;
                    	WebAgent.saveConfMasterFlag(false);
                	}
                	eh2.dispose();
                });
                
                eh2.regEvent("OnConferenceSuccess",function()
                {
                	succEventFlag = true;
                	isMaster = true;
                    WebAgent.saveConfMasterFlag(true);
                    eh2.dispose();
                });
            }
        }
        WebAgent.confMasterInvoker(method, args, fn);
    };

    WebAgent.extend(
    {
        isConfMaster : function()
        {
            var stateCode = WebAgent.getState().stateCode * 1;
            return (stateCode == CONF_STATE_CODE) && isMaster;
        },
        
        /**
         * 从内存中查询标记
         * @return flag {boolean} 
         */
        queryConfMasterFlag : function(fn)
        {
        	WebAgent.buffer.getValue("webagentCore_confMasterFlag",function(val)
        	{
        		var flag = (val=="1")?true:false;
        		if(fn) fn(flag);
        	});
        },
        
        /**
         * 保存标记到内存中
         * @param  flag {boolean}
         */
        saveConfMasterFlag : function(flag,fn)
        {
        	WebAgent.buffer.saveValue("webagentCore_confMasterFlag",(flag)?"1":"0");
        }
    });

    WebAgent.onInit(function()
    {
        // 设置会议态可用的命令
        WebAgent.EventHelper.intercept("OnStateChanged", function(interceptor)
        {
            var state = interceptor.eventArgs[0];
            if ((state.stateCode * 1) == CONF_STATE_CODE)
            {
                // alert("进入会议态！isMaster="+isMaster);
                state.enableCmds_ = (!state.enableCmds_) ? state.enableCmds : state.enableCmds_;
                if (WebAgent.isConfMaster())
                {
                    state.enableCmds = new Array().concat(state.enableCmds_);
                }
                else
                {
                    var Cmd = WebAgent.Cmd;
                    var enableCmds = new Array().concat(state.enableCmds_);
                    var disableCmds = [ Cmd.HOLD, Cmd.CONS, Cmd.RECEIVE_PHONE_NO, Cmd.SECOND_DIAL, Cmd.CONF,
                            Cmd.SSCONF, Cmd.TRANSFER, Cmd.SSTRANSFER ];
                    state.enableCmds = WebAgent.utils.arrSub(enableCmds, disableCmds);
                }
            }
            interceptor.next();
        });
        
        // 重新登录后从内存中恢复标记
        WebAgent.queryConfMasterFlag(function(masterFlag)
        {
        	isMaster = masterFlag;
        });
    });
})(WebAgent);
