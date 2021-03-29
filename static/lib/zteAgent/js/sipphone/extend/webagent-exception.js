/**
 * 异常处理（session丢失、座席被签出、agentservice异常退出、平台切换）
 */
WebAgent.ready(function()
{
    //agentservice生成core文件需要的信息vcid  operid
    WebAgent.invoker("RecoveryInfoAccess",["set", "vcid="+WebAgent.getVcid()+"|operid="+WebAgent.getOid()]);
    
    //js阻塞检测
    var sTime_ = new Date().getTime();
    var interTime = 2*1000;
    var jsBlockedCheckFun = function()
    {
        var cTime_ = new Date().getTime();
        var time_ = cTime_ - sTime_ - interTime ;
        sTime_ = cTime_;
        if(time_ >=1000)
        {
            WebAgent.warn(" javascript  blocked : "+(time_)+" (ms) ");
        }
    };
    var interId_ = setInterval(jsBlockedCheckFun,interTime);
    WebAgent.debug("[webagent-exception.js]  start js_block check ! ");
    
    //页面刷新检测,立即在Agentservice中打印日志作为记录
    if(jQuery)
    {
        jQuery(window).bind("beforeunload", function(e)
        {
            if(WebAgent.isReady)
            {
                var id=Math.floor(Math.random()*1000);
                
                WebAgent.AinfOCX.getAinfServerURL(function(ainfServerURL)
                {
                    WebAgent.loadjs(ainfServerURL+"["+id+"]The.page.will.be.closed.or.refresh! page="+window.location);
                    setTimeout(function()
                    {
                        WebAgent.loadjs(ainfServerURL+"["+id+"].Cancel.to.close.the.page.operation! page="+window.location);
                    },500); 
                });
            }
        });
    }
    
    //sessione丢失时,如果座席没有退出则重新注册事件，该事件从AinfOCX.js里面广播出来
    WebAgent.regEvent("OnSessionLost",function(lostTime)
    {
        WebAgent.getAgtInfoFromAinf(function(agt)
        {
            if(!agt)
            {
                WebAgent.warn("(Session Lost) Users have to logout!");
                WebAgent.EventHelper.notify("OnLogout", [""]);
                setLogout();
                return;    
            }
            // 恢复会话
            WebAgent.AinfOCX.restoreSession(function(isSucc)
            {
                 if(isSucc)
                 {
                      WebAgent.EventHelper.notify("OnRestoreSessionSuccess",[]);
                      WebAgent.warn("(Session Lost) Restore sessions successfully!");
                 }
                 else
                 {
                      WebAgent.EventHelper.notify("OnRestoreSessionFailure",[]);
                      WebAgent.error("(Session Lost) Restore sessions failure!");
                 }
            });
        });
    });
    
    var setLogout = function()
    {
        if (WebAgent.isReady)
        {
            WebAgent.setState(WebAgent.State.logout);
        }
        WebAgent.isReady = false;
        WebAgent.isInit = false;
        WebAgent.isLoginModule = false;
		WebAgent.invoker("UnRegEvent",[]); //通知服务端进行资源释放
		WebAgent.onInitFnList = [];//清空onInitFun
        WebAgent.setState(WebAgent.State.logout);
		WebAgent.stateMan = null;
        WebAgent.AinfOCX.dispose();
    };

    var eh = WebAgent.exceptEh = new WebAgent.EventHelper();

    // 控件异常退出
    eh.regEvent("OnAinfOcxAbnormalExit", function()
    {
        setLogout();
        eh.notify("OnLogout", [WebAgent.I18n.getMsg("service.ainfAbnormalExit")]);
    }, eh);

    // 被班长强制退出
    eh.regEvent("OnForceOut", function()
    {
        setLogout();
        eh.notify("OnLogout", [WebAgent.I18n.getMsg("service.qcnotify.forcedout")]);
    }, eh);
    
    // 正常退出
    eh.regEvent("OnSignOutSuccess", function()
    {
        setLogout();
        eh.notify("OnLogout", [""]);
    }, eh);
    
    // 平台切换后,如果A接口自动登录失败则注销
    eh.regEvent("OnMasterChanged", function()
    {
    	var eh_ = WebAgent.regEvent("OnSignInFailure",function()
    	{
		WebAgent.invoker("SignOut",[]);
	        WebAgent.invoker("Uninitial",[],function()
	        {
	        	setLogout();
	        	eh.notify("OnLogout", [WebAgent.I18n.getMsg("ainf.errCode.05")]);
	        });
    	});
    }, eh);
    
    // 捕获window异常
    /*
    try
    {
        window.onerror = function(msg, url, line)
        {
            var message = "Error in (" + (url || window.location) + ") on line " + line + " with message (" + msg + ")";
            WebAgent.fatal(message);
        };
    }
    catch (e)
    {
    }
    */
});
