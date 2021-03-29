
var test = function(){};
ZteAgent.regAdapter("test",test); // 注册为ZteAgent.test

// 实现接口相关方法。
test.prototype =
{

    /**
     * 
     */
    signIn : function(op,cbFun)
    {
        if(cbFun) cbFun(true);
        ZteAgent.publishEvent("onStateChanged",[100]);
    },

    /**
     * 
     */
    signOut : function(cbFun)
    {
        ZteAgent.publishEvent("onStateChanged",[1])
    },

    /**
     * 
     */
    getAgtInfo : function()
    {
        return {agtid:100,vcid:1};
    },

    /**
     * 
     */
    idle : function()
    {
        ZteAgent.publishEvent("onStateChanged",[200])
    },

    /**
     * 
     */
    busy : function()
    {
        ZteAgent.publishEvent("onStateChanged",[105])
    },

    /**
     * 
     */
    hangUp : function()
    {
        ZteAgent.publishEvent("onStateChanged",[400])
    },

    /**
     * 
     */
    answer : function()
    {
        ZteAgent.publishEvent("onStateChanged",[300])
    },

    /**
     * 
     */
    hold : function()
    {
        ZteAgent.publishEvent("onStateChanged",[304])
    },
    
    cancelHold : function()
    {
        ZteAgent.publishEvent("onStateChanged",[300])
    },

    /**
     * 
     */
    callAgt : function()
    {
        ZteAgent.publishEvent("onStateChanged",[313])
        setTimeout(function(){ZteAgent.publishEvent("onStateChanged",[303])}, 2000);
    },
    
    /**
     * 
     */
    sendMsg : function(msg)
    {
        setTimeout(function()
        {
            ZteAgent.publishEvent("onMessage",["100",msg.split("").reverse().join("")])
         }, 2000);
    },
    
    /**
     * 整理
     */
    adjust : function()
    {
        ZteAgent.publishEvent("onStateChanged",[400]);
    },
	
	/**
	* 取消整理
	*/
	cancelAdjust   : function()
	{
		ZteAgent.publishEvent("onStateChanged",[203])
	},
	
	
	/**
	* 会议
	*/
	conference  : function()
	{
		ZteAgent.publishEvent("onStateChanged",[305])
	},
	
    /**
     * 预呼
     */
    perCall : function()
    {
        ZteAgent.publishEvent("onStateChanged",[107]);
    },
	
	

    /**
     * 呼用户
     */
    callUser : function()
    {
        ZteAgent.publishEvent("onStateChanged",[313])
        setTimeout(function(){ZteAgent.publishEvent("onStateChanged",[302])}, 2000);
    },

    /**
     * 咨询转，
     */
    consultTransfer : function()
    {
        ZteAgent.publishEvent("onStateChanged",[400]);
    },

    /**
     * 通话转(单步转)
     */
    singleStepTransfer : function()
    {
        ZteAgent.publishEvent("onStateChanged",[400]);
    },

    /**
     * 咨询
     */
    consult : function()
    {
        ZteAgent.publishEvent("onStateChanged",[307]);
    },
    
    /**
     * 事件适配， 使用ZteAgent.publishEvent(name,[arg1,argn])发布
     */
	onStateChanged : function(){}, 
	onRinging : function(){}, 
	onRelease : function(){}, 
	onConference : function(){}, 
	onMessage : function(){}, 
	onSetPreIdleSuccess : function(){}, 
	onSetPreBusySuccess : function(){} 
	
	
};