/**
 * @author Administrator
 * 
 * 功能:座席预加载
 */
WebAgent.lazyLoading =
{
    isAbnormalExit : false, // 是否是异常退出
    timeoutID : 0,
    timeout : 0, // 超时时间(s)
    errMsg : null,
    errCode : null,
    eh : new WebAgent.EventHelper(),
    agtType : "00", //座席类型
	onSuccHandler : null, // {function} 登录成功处理函数
    onFailHandler : null, // {function} 登录失败处理函数

    /**
     * 尝试签入服务器
     * 
     * @param onSuccHandler {function} 签入成功处理函数
     * @param onFailHandler {function} 签入失败处理函数
     */
    trylazyLoading : function( onSuccHandler, onFailHandler,onInitialBeforeInvoke, onInitialAfterInvoke)
    {
        this.onSuccHandler = onSuccHandler;
        this.onFailHandler = onFailHandler;
        var thisobj = this;
		
		// 生成座席类型
		var cfg = WebAgent.sgininOption;
        this.agtType ="00";
        if(cfg.type)
        {
        	this.agtType = cfg.type;
        }else
        {
        	this.agtType = (cfg.video)?"1":"0";
        	this.agtType +=(cfg.webChat)?"1" : "0";
        }
      
        /* 检查是否已经登录 */
        this.checkIsLogged(function(isSignin)
        {
            if (isSignin)
            {
                thisobj.isAbnormalExit = true;
                thisobj.onSucc();
            }
            else
            {
                thisobj.loadAndTryLoading(onInitialBeforeInvoke, onInitialAfterInvoke);
            }
        });
    },

    /**
     * 加载配置并签入
     * 
     * @return
     */
    loadAndTryLoading : function( onInitialBeforeInvoke, onInitialAfterInvoke)
    {
        var thisobj = this;
        var re = this.loadConfig(function(re)
		{
		if (!re)
		{
			//thisobj.errCode ="02";// 加载配置失败，自定义错误码02
			 thisobj.onFail();
			 return;
		}
	  
	  if(onInitialBeforeInvoke)
		{
			onInitialBeforeInvoke();
		}
		WebAgent.invoker("Initial", "", function(result)
		{
			if(!result)
			{
				thisobj.onFail();
				return;
			}
			
			if(onInitialAfterInvoke){
				onInitialAfterInvoke()
			}
			
			thisobj.onSucc();	 

		});

	});
    },


    /**
     * 超时处理
     * 
     * @return
     */
    waitTimeOut : function()
    {
        this.timeoutID = setTimeout(this.rootCtx.bind(this.onFail, this),
                this.timeout * 1000);
    },

    /**
     * 取消等待
     * 
     * @return
     */
    cancelWait : function()
    {
        clearTimeout(this.timeoutID);
    },

  

    /**
     * 是否已经登录
     */
    checkIsLogged : function(fun)
    {
        var thisobj = this;
        var cfg = WebAgent.sgininOption;
        this.getCurAgtInfo(function(curAgt)
        {
            if (!curAgt)
            {
                fun(false);
                return;
            }

            /* 是否是当前用户？ */
            if ((curAgt.VCID == cfg.vcid) && (curAgt.AGTID == cfg.oid)
            // && (curAgt.AGTTYPE == agent.agt.AGENTTYPE)
            && (curAgt.PWD == cfg.pwd))
            {
                fun(true);
                return;
            }
            else
            {
                // 注销当前用户
                WebAgent.invoker("SignOut", "", function(str)
                {
                    fun(false);
                    return;
                });
            }
        });
    },
	
	  /**
     * 登录成功
     * 
     * @return
     */
    onSucc : function()
    {
        this.cancelWait();
        this.onSuccHandler(this.isAbnormalExit);
    },
   

    /**
     * 登录失败
     * 
     * @return
     */
    onFail : function()
    {
        this.cancelWait();
        this.onFailHandler((this.errCode) ? this.errCode : "00");
    },

    /**
     * 获取当前已经登录的用户信息
     * VcId=1;GrpId=2;AgtId=101;AgtType=0;PWD=C4CA4238A0B923820DCC509A6F75849B
     * 返回一个hash对象key ={vcid,grpid,agtid,agttype,pwd}
     */
    getCurAgtInfo : function(onResultFun)
    {
        WebAgent.invoker("GetCurAgtInfo", "", function(str)
        {
            if (str == null || str == "")
            {
                onResultFun(null);
                return;
            }
            var arr = str.split(";");
            var obj = {};
            for ( var i = 0; i < arr.length; i++)
            {
                var param = arr[i].split("=");
                obj[param[0].toUpperCase()] = param[1] + "";
            }
            
            if(obj.AGTID=="0" || obj.AGTID=="")
            {
                onResultFun(null);
            }
            else
            {
                onResultFun(obj);
            }
        });
    },
    

    /**
     * 加载配置文件
     */
    loadConfig : function(fun)
    {
        var thisobj = this;
        var cfg = WebAgent.sgininOption;
        
        var vcid = cfg.vcid;
        var pwd = cfg.pwd;
        var oid = cfg.oid;
		var cfgUrl = cfg.cfgUrl ? cfg.cfgUrl.split("|") : "";
        var urlCount = 0;   
		//var type = this.agtType;
		var phoneType = (cfg.phoneType)?"&phonetype="+cfg.phoneType:"";
        var bindPhone = (cfg.phoneType && cfg.bindPhone)?"&bindphone="+cfg.bindPhone:";";		
		var sipip =(cfg.sipip)?"sipip="+cfg.sipip+";":";";
		var phoneaddr = (cfg.phoneaddr)?"&phoneaddr=" + cfg.phoneaddr + ";" : ";";
		
		// //去掉AgentType参数，A接口不再使用该参数
		var param = encodeURIComponent(sipip +"urlparam=agent=" + oid + phoneType + bindPhone + phoneaddr);
	    var args = [ cfgUrl.length > 0 ? cfgUrl[0] : "", vcid == null ? -1 : vcid, oid, pwd,param ]; 
		
        var loadCfg = function()
        {
            
            WebAgent.invoker("LoadConfig", args, function(result)
            {
			    result = "" + result;
                // 0成功,1失败但从本机加载成功,其他值失败 || result == "1"
                if (result!= "0" )
                {
                    WebAgent.getErrCode(function(errCode)
                    {
					   // 循环调用loadconfig
					   if (urlCount < cfgUrl.length)
                       {
                             args[0] = cfgUrl[urlCount++];
                             loadCfg();
                       }
					   else
					   {
					        thisobj.errCode = errCode;						
                            fun(false);
					   }
					
 					 
                    });
                }
                else
                {
                    fun(true);
                }
            });
        };

        // 如果已经初始化
        WebAgent.getProperty("isinitial", function(isInit)
        {
            if (isInit != "0")
            {
                WebAgent.invoker("Uninitial", "", function(data)
                {
                    loadCfg();
                });
            }
            else
            {
                loadCfg();
            }
        });
    }
};
