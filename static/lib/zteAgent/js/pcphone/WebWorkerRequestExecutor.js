
/**
 * 请求对象
 * 
 * @type XMLHttpRequest
 */
var xmlRequest = new XMLHttpRequest();

/**
 * 错误码对象
 * @type Object
 */
var ErrorCode;

/**
 * 事件对象
 * @type Object
 */
var Events;

/**
 * 传入的候选URL列表
 * 
 * @type Array
 */
var urls;

/**
 * 当前尝试请求的URL
 * 
 * @type String
 */
var currentUrl;

/**
 * 使用的请求URL
 * 
 * @type String
 */
var availableUrl;

/**
 * 会话ID
 * 
 * @type String
 */
var sessionId;

/**
 * 当前尝试的URL索引
 * 
 * @type Number
 */
var urlIdx = 0;

/**
 * 等待请求的列表
 * 
 * @type Array
 */
var requests = new Array();

/**
 * 是否处于请求状态
 * 
 * @type Boolean
 */
var isRequesting = false;

/**
 * 是否使用消息ID
 * 
 * @type Boolean
 */
var isUseMsgId = false;

/**
 * 超时时长
 * 
 * @type Number
 */
var timeout;

/**
 * 当前尝试请求的参数
 * 
 * @type DoRequestParam
 */
var currentParam;

/**
 * 上次请求失败的时间戳
 * 
 * @type Number
 */
var failedTimeStamp;

/**
 * 当前线程使用的消息ID
 * 
 * @type Number
 */
var threadMsgId = 0;

/**
 * 是否开启获取事件
 * 
 * @type Boolean
 */
var isGetEvtStarted = false;

/**
 * 调用方法
 */
var METHODS = {
    INIT : "init", // 初始化
    DOREQUEST : "doRequest", // 请求
    POST_REQUEST : "postRequest", // 发送请求
    RETURN_RESULT : "returnResult", // 返回结果
    PUBLISH_EVENT : "publishEvent", // 发布事件
    START_GETEVENT : "startGetEvent", // 启动获取事件
    REFRESH_AVAILABLE_URL : "refreshAvailableURL" // 刷新可用URL
};

/**
 * 初始化的参数定义
 */
function InitParam()
{
}

InitParam.prototype = new Object();

/**
 * 传入的候选URL列表
 * 
 * @type Array
 */
InitParam.prototype.urls = null;

/**
 * 超时时长
 * 
 * @type Number
 */
InitParam.prototype.timeout = null;

/**
 * @type String
 */
InitParam.prototype.sessionId = null;

/**
 * @type Boolean
 */
InitParam.prototype.isUseMsgId = null;

/**
 * @type Object
 */
InitParam.prototype.ErrorCode = null;

/**
 * @type Object
 */
InitParam.prototype.Events = null;

/**
 * @type Object
 */
InitParam.prototype.States = null;

/**
 * 初始化
 * 
 * @param {InitParam} param 初始化参数
 */
function init(param)
{
    urls = param.urls;
    timeout = param.timeout;
    sessionId = param.sessionId;
    isUseMsgId = param.isUseMsgId;
    ErrorCode = param.ErrorCode;
    Events = param.Events;
}

/**
 * @returns {String}
 */
function getNextURL()
{
    if (urlIdx < urls.length)
    {
        return urls[urlIdx++];
    }
    else
    {
        urlIdx = 0;
        return null;
    }
}

/**
 * 请求失败
 */
function requestFailed()
{
    if (failedTimeStamp)
    {
        var newTimeStamp = new Date().getTime();
        if ((newTimeStamp - failedTimeStamp) >= 60000)
        {
            postMessage({
                method : METHODS.PUBLISH_EVENT,
                param : {eventName: Events.SERVER_DISCONNECTED}
            });
            
            isGetEvtStarted = false;
        }
    }
    else
    {
        failedTimeStamp = new Date().getTime();
    }
}

/**
 * 返回结果
 * @param result 调用结果
 */
function returnResult(result)
{
    var returnParam = currentParam;
    
    isRequesting = false;
    doNextRequst();
    
    if (returnParam.callback)
    {
        try
        {
            returnParam.callback(result);
        }
        catch(e)
        {
            // 防止回调函数中出错
        }
    }
    else
    {
        postMessage({
            method : METHODS.RETURN_RESULT,
            param : {
                requestId : returnParam.requestId,
                retVal : result
            }
        });
    }
}

/**
 * 将对象的属性转换为小写
 * 
 * @param obj 对象
 * @returns {Object} 转换后的对象
 */
function objAttrToLowerCase(obj)
{    
    var ret = {};
    
    for (var attr in obj)
    {
        if (typeof(obj[attr]))
        {
            if (typeof(obj[attr]) == "object")
            {
                ret[attr.toLowerCase()] = objAttrToLowerCase(obj[attr]);
            }
            else
            {
                ret[attr.toLowerCase()] = obj[attr];
            }
        }
        else
        {
            ret[attr.toLowerCase()] = "";
        }
    }
    
    return ret;
}

/**
 * 解码响应报文
 * 
 * @param {String} resp 响应报文
 */
function decodeResponse(resp)
{
    if (!resp)
    {
        return {result: ErrorCode.DECODE_RESP_FAILED};
    }
    
    try
    {
        var respObj = JSON.parse(xmlRequest.responseText);
        var ret = {};
        
        ret.eventName = respObj.head.eventname;
        ret.args = objAttrToLowerCase(respObj.body);        
        ret.result = parseInt(ret.args.result, 10);
        
        return ret;
    }
    catch (ex)
    {
        return {result: ErrorCode.DECODE_RESP_FAILED};
    }
}

/**
 * 请求状态变化事件
 */
function requestOnReadyStateChange()
{
    try
    {
        if (xmlRequest.readyState == 4)
        {
            if (xmlRequest.status == 200)
            {
                failedTimeStamp = null;

                var respObj = decodeResponse(xmlRequest.responseText);

                if (respObj.result == ErrorCode.SUCCEEDED)
                {
                    if (!availableUrl)
                    {
                        availableUrl = currentUrl;
                        postMessage(
                            {
                                method : METHODS.REFRESH_AVAILABLE_URL,
                                param : availableUrl
                            });
                    }

                    returnResult(respObj);
                } else if (availableUrl)
                {
                    returnResult(respObj);
                } else
                {
                    setTimeout(function(){postRequest(currentParam, respObj.result);},1);
                }
            } else if (availableUrl)
            {
                requestFailed();
                returnResult(
                    {
                        result : ErrorCode.REQUEST_FAILED
                    });
            } else
            {
                requestFailed();
                setTimeout(function(){postRequest(currentParam, ErrorCode.REQUEST_FAILED);}, 1);
            }
        }
    } catch (e)
    {
        if (console && console.error)
            console.error("error:" + e);
    }
}

/**
 * 发送请求
 * 
 * @param {DoRequestParam} param 请求参数
 * @param {Number} lastErrCode 上次失败的错误码
 */
function postRequest(param, lastErrCode)
{
    var url = availableUrl ? availableUrl : getNextURL();
    
    if (url)
    {
        xmlRequest.open("POST", url, true);
        xmlRequest.withCredentials = true;
        xmlRequest.timeout = timeout;
        xmlRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlRequest.setRequestHeader("Accept", "application/json, text/json");
        xmlRequest.onreadystatechange = requestOnReadyStateChange;
        
        currentParam = param;
        currentUrl = url;
        
        xmlRequest.send(param.content ? param.content : "");
    }
    else
    {
        returnResult({result : lastErrCode});
    }
}

/**
 * 执行下一个请求
 */
function doNextRequst()
{
    if (requests.length > 0)
    {
        isRequesting = true;
        var requestParam = requests.shift();
        postRequest(requestParam);
    }
}

/**
 * 执行请求的参数定义
 */
function DoRequestParam()
{
}

DoRequestParam.prototype = new Object();

/**
 * 
 * @type String
 */
DoRequestParam.prototype.content = null;

/**
 * 请求Id,用来区分一次请求
 * 
 * @type String
 */
DoRequestParam.prototype.requestId = null;

/**
 * @type Function
 */
DoRequestParam.prototype.callback = null;

/**
 * 执行请求
 * 
 * @param {DoRequestParam} param 参数
 */
function doRequest(param)
{
    requests.push(param);
    
    if (!isRequesting)
    {
        doNextRequst();
    }
}

/**
 * @returns {Number} 消息ID
 */
function getMsgId()
{
    ++threadMsgId;
    
    if (threadMsgId > 65535)
    {
        threadMsgId = 0;
    }
    
    return threadMsgId;
}

/**
 * 获取事件的回调函数
 * 
 * @param ret 返回结果
 */
function getEventCallback(ret)
{
    if (isGetEvtStarted)
    {
        if (ret.eventName == Events.ON_CTIAGENTSTATUS_CHANGED)
        {
            var stateCode = parseInt(ret.args.state, 10);
            if (stateCode > 4)
            {
                doGetEvent();
            }
        }
        else
        {
            doGetEvent();
        }
    }
    
    if (ret.eventName)
    {
        postMessage({
            method : METHODS.PUBLISH_EVENT,
            param : ret
        });
    }
}

/**
 * 执行获取事件
 */
function doGetEvent()
{
    var contentArray = new Array();
    contentArray.push("reqname=GetEvt");
    
    if (sessionId)
    {
       contentArray.push("&session=");
       contentArray.push(encodeURIComponent(sessionId));
    }
    
    if (isUseMsgId)
    {
        contentArray.push("&msgid=");
        contentArray.push(getMsgId());
    }
    
    doRequest({
        content : contentArray.join(""),
        callback : getEventCallback
    });
}

/**
 * 开始获取事件
 */
function startGetEvent()
{
    if (!isGetEvtStarted)
    {
        isGetEvtStarted = true;
        doGetEvent();
    }
}

/**
 * 接收事件
 * 
 * @param e 事件对象
 */
function receiveEvent(e)
{
    switch(e.data.method)
    {
        case METHODS.INIT:
            init(e.data.param);
            break;
            
        case METHODS.DOREQUEST:
            doRequest(e.data.param);
            break;
            
        case METHODS.START_GETEVENT:
            startGetEvent(e.data.param);
            break;
    }
}

// 注册消息监听器
addEventListener("message", receiveEvent);