/**
 * 同步获WebChat的取随路数据
 */
;
(function(WebAgent)
{
    /**
     * 随路数据、uri映射表{Map<key=uri,value=chatData>}
     */
    var ChatDataURIMap = {};

    WebAgent.extend(
    {
    	 /**
	     * 扩展座席getChatData()同步方法
	     * @param URI {String} 会话标识URI 或 JID
	     */
        getChatData : function(URI)
        {
        	URI = URI.toLowerCase();
        	//var peerJID = URI.replace(/sip:/, "");
        	var peerJID = URI;
            var chatData = ChatDataURIMap[peerJID];
            return (!chatData) ? "" : chatData;
        }
    });

	var log = function(interceptor)
	{
		try
		{
		 WebAgent.debug("[webagent-webChat.js] intercept Event :"+interceptor.eventName+", args=["+interceptor.eventArgs+"]");
		}catch(e){}
	};
	
	/**
	 * 递归方式获取随路数据，并保存在缓存中
	 */
	var queryChatData = function(uriArr,cbFun)
	{
		if(uriArr.length<1)
		{
			//避免递归造成循环引用
			if(cbFun) setTimeout(function()
			{
				cbFun();
			},0); 
			return;
		}
		
		var uri = uriArr.pop().toLowerCase();
		//var peerJID = uri.replace(/sip:/, "");
		var peerJID = uri;
		if(peerJID=="") return;
		WebAgent.invoker("QueryAllChatData", [ peerJID ], function(chatData)
		{
			ChatDataURIMap[peerJID]=chatData;
			queryChatData(uriArr,cbFun);
		});
	};
	
	/**
	 * 清除
	 */
	var clearChatData = function(uri)
	{
		
	}
	
    /**
     * 座席初始化成功后，开始拦截事件、GetChatAllURI方法
     */
    WebAgent.onInit(function()
    {
    	// 如果没有开启WebChat功能，则退出
	    var cfg = WebAgent.sgininOption;
	    var agtType = "00";
	    if (cfg.type)
	    {
	        agtType = cfg.type;
	    }
	    else
	    {
	        agtType = (cfg.video) ? "1" : "0";
	        agtType += (cfg.webChat) ? "1" : "0";
	    }
	    var isWebChat = agtType.substring(1, 2) == "1";
	    if(!isWebChat)
	    {
	    	//return;
	    }
    
        // 拦截“chat结束”，清除随路数据
        WebAgent.EventHelper.intercept("OnChatEnd", function(interceptor)
        {
        	log(interceptor);
        	// args = [peerURI, chatType, param]
        	var args = interceptor.eventArgs; 
        	var URI = args[0];
        	//var peerJID = URI.replace(/sip:/, "");
        	var peerJID = URI;
        	ChatDataURIMap[peerJID]=null;
        	interceptor.next();
        });
        
        // 拦截“chat断开”，清除随路数据
        WebAgent.EventHelper.intercept("OnLinkEnd", function(interceptor)
        {
        	log(interceptor);
        	// args = [peerURI, param]
        	var args = interceptor.eventArgs; 
        	var URI = args[0];
        	//var peerJID = URI.replace(/sip:/, "");
        	var peerJID = URI;
        	ChatDataURIMap[peerJID]=null;
        	interceptor.next();
        });
        
    	
        // 拦截“聊天请求”，获取随路数据
        WebAgent.EventHelper.intercept("OnBeginChatReqReceived", function(interceptor)
        {
        	log(interceptor);
        	//args = [peerURI]
        	var args = interceptor.eventArgs; 
        	var URI = args[0];
        	if(WebAgent.getChatData(URI)=="")
        	{
		        queryChatData( [ URI ], function()
		        {
		        	interceptor.next();
		        });
        	}else
        	{
        		interceptor.next();
        	}
        });
        
        // 拦截收到Chat消息，获取随路数据
        WebAgent.EventHelper.intercept("OnChatMsgReceived", function(interceptor)
        {
        	log(interceptor);
        	//args = [msgType, URI, senderURI, msgContent, time, param]
        	var args = interceptor.eventArgs; 
        	var chatRoomURI = args[1];
        	var senderURI = args[2];
        	
        	// strChatRoomURI不是本人，则为 群聊 模式(服务端需求规定的)
        	var URI = senderURI;
	    	
            if(WebAgent.getChatData(URI)=="")
        	{
		        queryChatData( [ URI ], function()
		        {
		        	interceptor.next();
		        });
        	}else
        	{
        		interceptor.next();
        	}
        });
        
        // 拦截“邀请加入聊天室”
        WebAgent.EventHelper.intercept("OnInvitedToChatRoom", function(interceptor)
        {
        	log(interceptor);
        	//args = [masterURI,roomURI,subject, param]
        	var args = interceptor.eventArgs; 
        	var URI = args[1];
        	if(WebAgent.getChatData(URI)=="")
        	{
		        queryChatData( [ URI ], function()
		        {
		        	interceptor.next();
		        });
        	}else
        	{
        		interceptor.next();
        	}
        });
        
        var webChatInvoker = WebAgent.invoker;
        WebAgent.invoker = function(method, args, fn)
        {
            if (method != "GetChatAllURI")
            {
                return webChatInvoker(method, args, fn);
            }
            else
            {
				 return webChatInvoker(method, args, function(result)
				 {
				    WebAgent.debug("[webagent-webChat.js] intercept method ["+method+"], return="+result); 
				    
				    var uriInfoArr = result.split("|"); //Array<uri^type> 
				    var uriArr = [];
				    for(var i = 0; i < uriInfoArr.length; i++)
				    {
				    	 uriInfo = uriInfoArr[i].split("^");
		                 if (uriInfo.length != 2) continue;
		                 if(WebAgent.getChatData(uriInfo[0])=="")
		                 {
		                 	uriArr.push(uriInfo[0]);
		                 }
				    }
				    
				    queryChatData( uriArr, function()
			        {
			        	// 返回结果
			        	if(fn) fn(result);
			        });
				 });
            }
        }
    });
})(WebAgent);