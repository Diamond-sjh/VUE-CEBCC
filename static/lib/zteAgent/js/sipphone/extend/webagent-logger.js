/**
 * 日志功能,需要定期执行clear(),否则内存一直快速增长
 */
WebAgent.extend(
{
    clearIntervalID : 0,
    clearTime : 60, // 每隔n秒清理一次内存
    logMap :{},
    logName : "JSCore",
    logModuleName : "", 
    
    /**
     * 设置日志模块名称
     */
    setLoggerModuleName : function(moduleName)
    {
        this.logModuleName = moduleName;  
        var log = this.getLogger();
        if(log)
        {
            log.debug("["+window.location+"]  Log module name:"+moduleName);
        }
    },
    
	/**
	 * logName {String} 
	 * @return {Logger}
	 */
    getLogger : function()
    {
        var logger = this.logMap[this.logName];
        if (!logger)
        {
            logger = new Log4js.getLogger(this.logName);
            logger.setLevel(Log4js.Level.ALL);
            
            // empty
            var app = new Log4js.EmptyAppender();
            logger.addAppender(app);
            
            //jsConsole
            //app = new Log4js.ConsoleAppender(false);
            //app.setLayout(new Log4js.PatternLayout());
            //logger.addAppender(app);
            
            //post
            logger.addAppender(new Log4js.HttpAppender(false));
            
            this.clearIntervalID = setInterval(function()
            {
                //logger.clear();
            }, this.clearTime * 1000);
           
            this.logMap[this.logName] = logger;
            
            var jsCoreinfo_ = "================WebAgent " + WebAgent.version + "_" + WebAgent.verDate
            + " ================";
            jsCoreinfo_ += "\rJsCore URL    = "+ WebAgent.getBase()+"webagent.js";
            jsCoreinfo_ += "\rContext Page  = "+ window.location;
            jsCoreinfo_ += "\rLog ModuleID  = "+ WebAgent.getLogNameID();
            logger.info(jsCoreinfo_);
            this.logModuleName = WebAgent.getLogNameID();
            return logger;
        }
        else
        {
            return logger;
        }
    },
    
    /**
     * 显示日志控制台（方便调试用）
     */
    showLoggerConsole : function()
    {
    	var logger = this.getLogger();
        app = new Log4js.ConsoleAppender(false);
        app.setLayout(new Log4js.PatternLayout());
        logger.addAppender(app);
        logger.info("~~~~~JSCore~~~~~");
    },
    
    /**
     * 隐藏日志控制台（方便调试用）
     */
    hidLoggerConsole : function()
    {
 		var logger = this.getLogger();
 		/*
 		var arr=[];
 		for(var i=0;i<logger.appenders.length;i++)
 		{
 		    if( typeof logger.appenders[i] == Log4js.ConsoleAppender) continue;
 		    arr.push(logger.appenders[i]);	
 		}
 		logger.setAppenders(arr);
 		*/ 
 		logger.setAppenders([]);
    	this.logMap[this.logName]=null;
    	Log4js.loggers[this.logName]=null; // 比较暴力的用法，但懒得改了
    	
    },
    
    /**
     * 获取浏览器控制台日志系统
     * @param logName {String}
     */
    getBrowserConsoleLogger : function()
    {
    	var logger = new Log4js.getLogger();
    	logger.setLevel(Log4js.Level.ALL);
    	var app = new Log4js.BrowserConsoleAppender();
        logger.addAppender(app);
        return app;
    },
    
    fmtLogMsg : function(msg)
    {
         //return " [module="+ this.logModuleName +"] " + msg;
        return msg;
    },

    debug : function(msg)
    {
        var logger = this.getLogger();
        logger.debug(this.fmtLogMsg(msg));
    },

    info : function(msg)
    {
        var logger = this.getLogger();
        logger.info(this.fmtLogMsg(msg));
    },

    trace : function(msg)
    {
        this.info(this.fmtLogMsg(msg));
    },

    warn : function(msg)
    {
        var logger = this.getLogger();
        logger.warn(this.fmtLogMsg(msg));
    },

    error : function(msg)
    {
        var logger = this.getLogger();
        logger.error(this.fmtLogMsg(msg));
    },

    fatal : function(msg)
    {
        var logger = this.getLogger();
        logger.fatal(this.fmtLogMsg(msg));
    }
});