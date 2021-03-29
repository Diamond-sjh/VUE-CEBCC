/**
 * 跨域post提交日志内容到服务器
 * 
 * @param writeTime {Integer} 每隔多少秒post一次日志
 */
WebAgent.HttpLogger = function(writeTime)
{
    this.writeTime = (!writeTime) ? 5 : writeTime;
    this.saveLog();
    
    var thisobj = this;
    $(window).bind("beforeunload", function(e)
    {
        if (e)
        {
        	try
        	{	        	
	        	thisobj.saveLog(true);
        	}catch(e){}
        }
    });
};

WebAgent.HttpLogger.prototype =
{
    method : "POST",
    txtID : "log",
    logArray : new Array(),

    /**
     * log4js
     */
    layout : null,
    logger : null,
    
    /**
     * 获取URL
     * 
     * @returns String
     */
    getUrl : function()
    {
    	if (WebAgent.AinfOCX.ainfSevURL)
        {
    		return WebAgent.AinfOCX.ainfSevURL + "WriteLog";
        }
    	else
        {
    		return null;
        }
    },

    /**
     * 写日志
     * 
     * @param msg
     */
    writeLog : function(msg)
    {
        this.logArray.push(encodeURIComponent(msg));
        this.logArray.push("%0A");
    },
    
    /**
     * 通过Ajax方式提交日志
     * 
     * @param {Boolean} sync 同步请求
     */
    saveLog : function(sync)
    {
    	if (this.logArray.length > 0)
        {
		  try
		  {
            var request = new XMLHttpRequest();
            
            if (request.withCredentials == null)
            {
                request = new XDomainRequest();
                request.open(this.method, this.getUrl());
            }
            else
            {
                request.open(this.method, this.getUrl(), !sync);
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            }
            
            this.logArray.unshift(this.txtID, "=");
            var body = this.logArray.join("");
            this.logArray.splice(0, this.logArray.length);
            
            request.send(body);
		  }catch(e){}
        }
        
        var thisObj = this;
        setTimeout(function(){thisObj.saveLog();}, this.writeTime * 1000);
    }
};

/**
 * 实现log4js的Appender接口，实现用HttpLogger写日志
 * 
 * <pre>
 * 使用方法：
 * var log = new Log4js.getLogger('webAgent');
 * app = new Log4js.HttpAppender(3);
 * log.addAppender(app);
 * </pre>
 */
Log4js.HttpAppender = function()
{

    this.layout = new Log4js.PatternLayout(Log4js.PatternLayout.TTCC_CONVERSION_PATTERN);
    this.httpLogger = new WebAgent.HttpLogger(5);
    var fmt = new Log4js.DateFormatter();
};

Log4js.HttpAppender.prototype = Log4js.extend(new Log4js.Appender(),
{
    /**
     * @see Log4js.Appender#doAppend
     */
    doAppend : function(loggingEvent)
    {
        var time = this.format(new Date(), "yyyy-MM-dd hh:mm:ss:S");
        var blandArr=[""," ","  ","   ","    "];
        var level = " [" + loggingEvent.level.toString();
       
        // 这里和webagent-logger.js强耦合了，以后有时间再重构！！！！！
        var moduleName = (WebAgent && WebAgent.logModuleName)? "["+WebAgent.logModuleName+"]":"";
        level += blandArr["[Error]".length-level.length]+"]";
        var log = time +  " [" + loggingEvent.categoryName + "] " + moduleName + level  ;
        
        // 换行对齐
        var msgs = loggingEvent.message.split("\r");
        for(var i=0;i<msgs.length;i++)
        {
        	if(i==0)
        	{
        		this.httpLogger.writeLog(log+msgs[i]);
        	}
        	else
        	{
        		var blankStr = log.replace(/./gi," ");
        		this.httpLogger.writeLog(blankStr+msgs[i]);
        	}
        }
    },

    /**
     * toString
     */
    toString : function()
    {
        return "HttpAppender";
    },

    /**
     * 格式化日期
     */
    format : function(date, format)
    {
        var ms = "000" + date.getMilliseconds();
        ms = ms.substr(ms.length - 3);
        var o =
        {
            "M+" : date.getMonth() + 1, // month
            "d+" : date.getDate(), // day
            "h+" : date.getHours(), // hour
            "m+" : date.getMinutes(), // minute
            "s+" : date.getSeconds(), // second
            "q+" : Math.floor((date.getMonth() + 3) / 3)
        // quarter
        };
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for ( var k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k])
                        .substr(("" + o[k]).length));
        if (/(S)/.test(format)) format = format.replace(RegExp.$1, ms);

        return format;
    }
});

/**
 * 实现log4js的Appender接口，实现写空日志的接口（方便调试时关闭写日志方法）
 */
Log4js.EmptyAppender = function()
{
};

Log4js.EmptyAppender.prototype = Log4js.extend(new Log4js.Appender(),
{
    /**
     * @see Log4js.Appender#doAppend
     */
    doAppend : function(loggingEvent)
    {
    },

    /**
     * toString
     */
    toString : function()
    {
    }
});
