<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="org.slf4j.LoggerFactory" %>
<%@ page import="org.slf4j.Logger" %>
<%@ page import="org.slf4j.MDC" %>
<%!
/**
*
>>>logsplit0.16374113131314516
[level]debug
[fileName]test
[time]2013-10-10 15:56:32:25
[msg]test！！
<<<logsplit0.16374113131314516 
*
*/
void parseLog(String logs)
{
    int startPos=0;
    int endPos = 0;
    String splitStr="";
    String logStr="";
    String level="";
    String file="";
    String time="";
    String msg="";
    while(startPos>=0)
    {
        startPos = logs.indexOf(">>>logsplit",endPos);
        if(startPos==-1){break;}
        
        splitStr = logs.substring(startPos+3, logs.indexOf("\n", startPos));
        endPos = logs.indexOf("<<<"+splitStr);
        
        if(endPos==-1){continue;}
        
        logStr = logs.substring(startPos+3+splitStr.length(), endPos);
        
        int pos = logStr.indexOf("[level]");
        level = logStr.substring(pos+"[level]".length(),logStr.indexOf("\n", pos));
        level = level.trim().replaceAll("\\r", "");
        
        pos = logStr.indexOf("[fileName]");
        file = logStr.substring(pos+"[fileName]".length(),logStr.indexOf("\n", pos));
        file = file.trim().replaceAll("\\r", "");
        
        pos = logStr.indexOf("[time]");
        time = logStr.substring(pos+"[time]".length(),logStr.indexOf("\n", pos));
        time = time.trim().replaceAll("\\r", "");
        
        pos = logStr.indexOf("[msg]");
        msg = logStr.substring(pos+"[msg]".length());
        
        log(level,file, time, msg);
    }
}

void log(String lever,String filename,String time,String msg)
{
	if (filename == null || filename.length() == 0)
	{
	    return;
	}
	if (msg == null)
	{
	    msg = "";
	}
	Logger logger = LoggerFactory.getLogger("JSLOG");
	MDC.put("userid", filename);
	if ("info".equalsIgnoreCase(lever))
	{
	    logger.info("\r\n[INFO] [clientTime]:{}  [log]:{}", new String[]{time, msg});
	}
	else if ("error".equalsIgnoreCase(lever))
	{
	    logger.error("\r\n[ERROR] [clientTime]:{}  [log]:{}", new String[]{time, msg});
	}
	else if ("warn".equalsIgnoreCase(lever))
	{
	    logger.warn("\r\n[WARN] [clientTime]:{}  [log]:{}", new String[]{time, msg});
	}
	else if ("debug".equalsIgnoreCase(lever))
	{
	    logger.debug("\r\n[DEBUG] [clientTime]:{}  [log]:{}", new String[]{time, msg});
	}
	else
	{
	    logger.info("\r\n[NOT ASSIGN] [clientTime]:{}  [log]:{}", new String[]{time, msg});
	}
}
%>
<%
request.setCharacterEncoding("UTF-8");
response.setHeader("Cache-Control", "no-cache");
response.setHeader("Access-Control-Allow-Origin", "*");
response.setContentType("text/html;charset=utf-8"); 
String method = request.getParameter("method");
if("log".equals(method))
{
    String logTxt = request.getParameter("logs");
    parseLog(logTxt);
}
else
{
%>

<%
	int port = request.getServerPort();
	String portStr = (port==80)?"":":"+port;
	String currentUrl = request.getScheme()+"://"+request.getServerName()+portStr+request.getRequestURI();
	
	String url=request.getParameter("url");
	String urlStr=(url==null || "".equals(url.trim()))?currentUrl:url.trim();
%>
var url="<%=urlStr %>?method=log";
if (!window.jQuery)
{
    alert("必须依赖jquery！ 请把将该js的引用放在jquery之后！");
}
        
var zte=(!zte)?{}:zte;

/**
 * 构造函数
 * @param postUrl  post提交url地址
 * @returns {zte.HttpLogger}
 */
zte.HttpLogger = function(postUrl)
{
    this.url = postUrl;
};

zte.HttpLogger.prototype =
{
    // 接口参数
    logsId :"logs",
    
    //缓存相关
    cacheOpt : 
    {
        cacheEnable : (window.localStorage)?true:false, //是否启用本地缓存？
        maxNum : 20, //最大缓存数量
        autoSubmitTime : 10*1000, //自动提交间隔(ms)
        timerid:0
    },
    
    // 创建表单所需参数
    ifmID : "webAgentHttpLogHidForm",
    ifmDoc : null,
    ifm : null,
    frmID : "logFrom",
    parentDoc : document,
    logTmp : "",

    /**
     * log4js
     */
    layout : null,
    logger : null,

    /**
     * 
     * 创建隐藏表单
     * 
     * @param obj
     * @private 
     */
    createForm : function()
    {
        if (this.ifm)
        {
            this.parentDoc.body.removeChild(this.ifm);
            this.ifmDoc = null;
            this.ifm = null;
        }

        var iframe = this.parentDoc.createElement("iframe");
        this.ifm = iframe;
        iframe.id = this.ifmID;
        iframe.name = this.ifmID;
        iframe.width = 0;
        iframe.height = 0;
        iframe.style.display = "none";
        this.parentDoc.body.appendChild(iframe);
        var doc = iframe.contentWindow.document;
        this.ifmDoc = doc;
        doc.write("<head><meta http-equiv='content-type' content='text/html; charset=UTF-8'></head><body>" +
        		"<form " 
                +" id='"+ this.frmID + "'" 
                +" name='" + this.frmID + "' " 
                +" method='post'" 
                +" action='" + this.url+ "'" 
                +" enctype='application/x-www-form-urlencoded' " 
                +" target='_self' " 
                +" accept-charset='utf-8' " 
                +" onsubmit=\"document.charset='utf-8';\" >" 
                + "<input type='hidden' id='" + this.logsId + "' name='"+ this.logsId + "'></input>" 
                + "</form> </body>");
    },
    
    log : function(msg,level,fileName)
    {
        if(!msg)return;
        level = (!level)?"debug":level;
        fileName = (!fileName)?"default":fileName;
        
        if(this.cacheOpt.cacheEnable) //如果启用缓存？
        {
            this.saveToCache(msg,level,fileName);
        }
        else
        {
            var logStr = this.buildLogStr(msg, level, fileName);
            this.submitToServer([logStr]);
        }
    },
   
    
    /**
     * 
     * @param msg
     * @param level
     * @param fileName
     */
    saveToCache : function(msg,level,fileName)
    {
        var logStr = this.buildLogStr(msg, level, fileName);
        var logNum = window.localStorage["jslogNum"]?window.localStorage["jslogNum"]*1:0;
        var logtxt = window.localStorage["jslogs"]?window.localStorage["jslogs"]:"";
        logtxt +=logStr;
        
        if(logNum>this.cacheOpt.maxNum)
        {
            this.submitToServer(logtxt);
            window.localStorage["jslogs"]="";
            window.localStorage["jslogNum"]=0;
        }else
        {
            window.localStorage["jslogs"] = logtxt;
            logNum++;
            window.localStorage["jslogNum"]=logNum;
        }
        
        this.setAutoSubmit();
    },
    
    setAutoSubmit : function()
    {
    	if(!this.cacheOpt.cacheEnable)return;
         //设置自动提交
         clearTimeout(this.cacheOpt.timerid);
         var thisobj = this;
         this.cacheOpt.timerid =  setTimeout(function()
         {
             var logtxt = window.localStorage["jslogs"]?window.localStorage["jslogs"]:"";
             thisobj.submitToServer(logtxt);
             window.localStorage["jslogs"]="";
             window.localStorage["jslogNum"]=0;
         }, this.cacheOpt.autoSubmitTime);
    },
    
    /**
     * 
     * @param logs <Array<{level,fileName,time,fileName}>>
     */
    submitToServer : function(logs)
    {
        if(this.isCrossDomain())
        {
            this.submitByAjax(logs);
        }else
        {
            this.submitByAjax(logs);
        }
    },
    
    /**
     * ajax提交
     * @param msg
     * @param level
     * @param fileName
     */
    submitByAjax : function(logs)
    {
        var url = this.url;
        $.ajax(
        {
            type : "POST",
            url : url,
            data :
            {
                logs : logs
            },
            success : function(msg)
            {
            }
        }); 
    },

    /**
     *  跨域表单提交
     * @public 
     */
    submitByForm : function(logs)
    {
        var thisobj = this;
        thisobj.createForm();
        setTimeout(function()
        {
            thisobj.ifmDoc.getElementById(thisobj.logsId).value = logs;
            thisobj.ifmDoc.getElementById(thisobj.frmID).submit();
        }, 10);
    },
    
    /**
     * 
     * @param msg
     * @param level
     * @param fileName
     * @returns {String}
     */
    buildLogStr : function(msg,level,fileName)
    {
        var time = this.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss:S");
        var random = Math.random();
        var logStr =">>>logsplit"+random+"\n";
        logStr += "[level]"+level+"\n[fileName]"+fileName+"\n[time]"+time+"\n[msg]"+msg;
        logStr +="\n<<<logsplit"+random+"\n";
        return logStr;
    },
    
    
    /**
     * 是否跨域？
     * 
     * @param {String}
     * @return {boolean} true 安全，false 不安全
     */
    isCrossDomain : function()
    {
        var url = this.url;
        // 相对路径？
        if(!/[a-zA-Z]+:\/\//gi.test(url))
        {
            return false;
        }
        
        // 如果绝对路径，检查是否同域？
        var isCross = false;
        var reg=window.location.hostname;
        reg = reg.replace(/\*/g,"[a-z0-9]+");
        reg = reg.replace(/\./g,"\\.");
        reg = "\/\/"+reg+"($|\/|:)";
        return !new RegExp(reg).test(url); 
    },
    
    /**
     * 格式化日期 var time = format(new Date(), "yyyy-MM-dd hh:mm:ss:S");
     * @private
     */
    formatDate : function(date, format)
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
};

/**
 * 对外暴露接口debug、info、error、warn
 * 调用说明：
 * <script type="text/javascript" src="jquery.js"></script>
 * <script type="text/javascript" src="logger.jsp"></script>
 * <script>
 *  logger.debug(msg,fileName);
 *  logger.info(msg,fileName);
 *  logger.warn(msg,fileName);
 *  logger.error(msg,fileName);
 * </script>
 */
var logger = 
{
   logger : new zte.HttpLogger(url),
   
   debug : function(msg,fileName)
   {
       this.logger.log(msg, "debug", fileName);
   },
   
   trace : function(msg,fileName)
   {
       this.logger.log(msg, "info", fileName);
   },
   
   info : function(msg,fileName)
   {
       this.logger.log(msg, "info", fileName);
   },
   
   warn : function(msg,fileName)
   {
       this.logger.log(msg, "warn", fileName);
   },
   
   error : function(msg,fileName)
   {
       this.logger.log(msg, "error", fileName);
   }
};


<%} %>
