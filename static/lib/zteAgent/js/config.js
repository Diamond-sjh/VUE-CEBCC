/**
 * 各话务功能对应的按钮配置
 * 每一个按钮都对应下面6个属性
 * btnType =  
 * {
 *      enable : {String}   必须，话务按钮可用时，显示的html字符串
 *      enable: {String}    必须，话务按钮禁用时，显示的html字符串
 *      click: {function}   必须，按钮被点击后的行为， 可通过agt-click进行覆盖
 *      hide : {function}   可缺省，返回true隐藏，按钮切换时用比如：签入/迁出，示忙/示闲
 *      init : {function}   可缺省，按钮初始化调用方法，缺省配置ZteAgent.CallBtnManager._defBtnCfg
 *      getState : {function} 可缺省，获取按钮状态（0禁用，1启用，2隐藏），缺省配置ZteAgent.CallBtnManager._defBtnCfg
 * }
 * 注： 上述按钮属性参数{function}的定义为function(btn) , 其btn参数为按钮对象， btn={id,type,state,_el}，
 *     id表示按钮唯一标识$("*[agt-id='id']")得到相关元素
 *     type 按钮类型
 *     state 按钮状态 0禁用，1启用，2隐藏
 *     _el 按钮html元素
 */
var AGT_CONFIG = {}; // 按钮配置
AGT_CONFIG.btns =
{
    // 签入
    SIGNIN : 
    {
        enable : '<span class="AT_item"><div><i class="AT_icon_signIn"></i><p>签入</p></div></span>',
        disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_signIn"></i><p>签入</p></div></span>',
        hide : function(btn){ return ZteAgent.getState() > 10 ;}, // 座席已登录则隐藏按钮
		click: function(btn)  // 按钮点击事件，需要通过agt-click 替换本方法，不能直接使用.
        { 
			ZteAgtUI.getSigninParams(
					function(type, cfgUrl,agtId,pwd,vcid, phoneNo, phoneType, paramObj,cbFun)
					{
			       	   var cfg =
				      {
					    type : type,
					    cfgUrl : cfgUrl,
					    agtId : agtId,
					    vcid :  vcid,
					   pwd :  pwd,
					   phoneNo: phoneNo,
					   phoneType : phoneType,
					   extendParam:paramObj
				      };
				     ZteAgent.signIn(cfg, cbFun);
			      });
        }
    },
    
    // 签出
    SIGNOUT : 
    {
        enable : '<span class="AT_item"><div><i class="AT_icon_signOff"></i><p>签出</p></div></span>',
        disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_signOff"></i><p>签出</p></div></span>',
        hide : function(btn){ return ZteAgent.getState() <=10 ;}, //  座席未登录则隐藏
        click: function(btn){
        	ZteAgtUI.getSignOutParams(function(cbFun){
        		ZteAgent.signOut(cbFun);
        	});
        	
        	} // 按钮点击事件，可通过agt-click 替换本方法,btn={id,type}
    },
    
    // 服务
    SERVICE : {
        enable : '<span class="AT_item"><div><i class="AT_icon_inIdle"></i><p>服务</p></div></span>',
        disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_inIdle"></i><p>服务</p></div></span>',
        click: function(btn)
		{ 
        	ZteAgtUI.getServiceParams(function(cbFun)
        	{
        		ZteAgent.idle(cbFun);  
        	});
			
	    }
    },                  
    
    // 示忙
    BUSY : {
        enable : '<span class="AT_item"><div><i class="AT_icon_inBusy"></i><p>示忙</p></div></span>',
        disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_inBusy"></i><p>示忙</p></div></span>',
        hide : function(btn)  
		{
			var state = ZteAgent.getState();
			return !(state>=200 && state <=203); //非空闲状态下隐藏，（示忙/示闲切换）
		}, 
        click: function(btn)
        { 
        	ZteAgtUI.getBusyParams(function(cbFun)
        	{
        		ZteAgent.busy(cbFun);
        	});
        	
       } 
    },
    
    // 示闲
    IDLE : {
        enable : '<span class="AT_item"><div><i class="AT_icon_inIdle"></i><p>示闲</p></div></span>',
        disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_inIdle"></i><p>示闲</p></div></span>',
        hide : function(btn)
		{ 
			var state = ZteAgent.getState();
			return state>=200 && state <=203;  //空闲状态下隐藏【示闲按钮】，（示忙/示闲切换）
		}, 
        click: function(btn)
        {  
        	ZteAgtUI.getIdleParams(function(cbFun)
        	{
        		ZteAgent.idle(cbFun);
        	});
        } 
    },
    //媒体示闲
    MEDIA_IDLE:{
    	  enable : '<span class="AT_item"><div><i class="AT_icon_mediaIdle"></i><p>媒体示闲</p></div></span>',
          disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_mediaIdle"></i><p>媒体示闲</p></div></span>',
          hide : function(btn)
  		{ 
  			var state = ZteAgent.getMediaState();
  			return state>=1001&& state <=1999;  //空闲状态下隐藏【示闲按钮】，（示忙/示闲切换）
  		}, 
          click: function(btn)
          {  
          	ZteAgtUI.getMediaIdleParams(function(cbFun)
          	{
          		ZteAgent.setMediaIdle(cbFun);
          	});
          } 	
    },
    //媒体示忙
    MEDIA_BUSY:{
    	 enable : '<span class="AT_item"><div><i class="AT_icon_mediaBusy"></i><p>媒体示忙</p></div></span>',
         disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_mediaBusy"></i><p>媒体示忙</p></div></span>',
         hide : function(btn)  
 		{
        	 var state = ZteAgent.getMediaState();
   			return state>=1&& state <=999; 
 		}, 
         click: function(btn)
         { 
         	ZteAgtUI.getMediaBusyParams(function(cbFun)
         	{
         		ZteAgent.setMediaBusy(cbFun);
         	});
        } 
    },
    // 应答
    ANSWER : {
        enable : '<span class="AT_item"><div><i class="AT_icon_reply"></i><p>应答</p></div></span>',
        disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_reply"></i><p>应答</p></div></span>',
        hide : function(btn){ return false; }, 
        click: function(btn)
        {
        	ZteAgtUI.getAnswerParams(function(cbFun)
                	{
                		ZteAgent.answer(cbFun);
                	});
        }  
    },
    
    // 挂机，只挂自己
    HANGUP : {
        enable : '<span class="AT_item"><div><i class="AT_icon_hangUp"></i><p>挂机</p></div></span>',
        disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_hangUp"></i><p>挂机</p></div></span>',
        hide : function(btn){return false; }, 
        click: function(btn)
        { 
        	ZteAgtUI.getHangUpParams(function(userData, cbFun)
                	{
                		ZteAgent.hangUp(userData, cbFun);
                	});
        }
    },
    
    // 保持
    HOLD : {
        enable : '<span class="AT_item"><div><i class="AT_icon_hold"></i><p>保持</p></div></span>',
        disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_hold"></i><p>保持</p></div></span>',
        hide : function(btn)
		{
			return ZteAgent.getState() == 304; //保持状态下隐藏,（保持/取消保持切换）
		}, 
        click: function(btn)
        { 
        	ZteAgtUI.getHoldParams(function(cbFun)
        	{
        		ZteAgent.hold(cbFun);
        	});
        	
        } // 可通过agt-click 替换本方法
    },
    
    // 取消保持
    REHOLD : {
        enable : '<span class="AT_item"><div><i class="AT_icon_reCover"></i><p>取消保持</p></div></span>',
        disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_reCover"></i><p>取消保持</p></div></span>',
        hide : function(btn){return !(ZteAgent.getState() == 304); }, //非保持状态下隐藏,（保持/取消保持切换）
        click: function(btn)
        { 
        	ZteAgtUI.getCancelHoldParams(function(cbFun)
        	{
        		ZteAgent.cancelHold(cbFun);
        	});
        } 
    },
	
	// 整理
    ADJUST : {
        enable : '<span class="AT_item"><div><i class="AT_icon_clearUp"></i><p>整理</p></div></span>',
        disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_clearUp"></i><p>整理</p></div></span>',
        hide : function(btn) // 整理态下隐藏按钮（整理/取消整理切换）
		{
        	//A接口启用自动示闲，就不不显示整理按钮
        	if(ZteAgent.initialReady ==true)
        	{
        		return true;
        	}
			var state = ZteAgent.getState();
			return  state==400 || state==401;   
		}, 
        click: function(btn)
		{
        	ZteAgtUI.getAdjustParams(function(num,cbFun)
        	{
        		ZteAgent.adjust(num,cbFun);
        	});
			
		} 
    },
	
    // 取消整理
    CHANCEL_ADJUST : {
        enable : '<span class="AT_item"><div><i class="AT_icon_clearUp"></i><p>取消整理</p></div></span>',
        disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_clearUp"></i><p>取消整理</p></div></span>',
        hide : function(btn) // 整理态下(400,401)隐藏按钮（整理/取消整理切换）
		{
        	//A接口启用自动示闲，就不不显示整理按钮
        	if(ZteAgent.initialReady ==true)
        	{
        		return true;
        	}
			var state = ZteAgent.getState();
			return !(state==400 || state==401); 
			
		},
        click: function(btn)
        {
        	ZteAgtUI.getCancelAdjustParams(function(cbFun)
        	{
        		ZteAgent.cancelAdjust(cbFun);
        	});
        } 
    },
    
    // 呼出
    CALLOUT : {
        enable : '<span class="AT_item"><div><i class="AT_icon_callOut"></i><p>呼出</p></div></span>',
        disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_callOut"></i><p>呼出</p></div></span>',
		hide : function(btn){return false; }, 
        click: function(btn) // 按钮点击事件，需要通过agt-click 替换本方法，不能直接使用.
        {
    		//calledType, callType, calledNo, callingNo, userData
        	ZteAgtUI.getCallOutParams(function(callType,calledType, calledNo, callingNo, userData,  paramObj, cbFun)
			{
        		//ZteAgent.makeCall(callType, objType, obj, callingNo,userData, extendParams, cbFun);
        		ZteAgent.makeCall(callType, calledType, calledNo, callingNo,userData, paramObj, cbFun);
				/*if(calledType*1==1) //呼叫用户
				{
				   ZteAgent.callUser(calledNo, callType, callingNo, paramObj, cbFun); 
				}else
				{ //呼叫坐席
				   ZteAgent.callAgt(calledNo, callType, userData, paramObj, cbFun);
				}*/
			 });
        }
    },
    
    // 转接
    TRANSFER : {
        enable : '<span class="AT_item"><div><i class="AT_icon_transfer"></i><p>转接</p></div></span>',
        disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_transfer"></i><p>转接</p></div></span>',
        hide : function(btn){return false; }, 
        click: function(btn)
        { 
        	var state = ZteAgent.getState();
        	//306, 307, 308 //咨询转
        	if(state>=306 && state<=308)
        	{
        	       ZteAgtUI.getConsultTransferParams(function(cbFun)
        			{
        		       ZteAgent.consultTransfer(cbFun);
        			});
        	}else if(state>=300 && state<=303) //300, 301, 302, 303单步转
        	{
        		ZteAgtUI.getSingleStepTransferParams(
            			function(transferType,dstobj,callingNo,userData,paramObj,cbFun){
            		ZteAgent.singleStepTransfer(transferType,dstobj,callingNo,userData,null, cbFun);
            	});
        	}
        }
    },
      
    
    // 咨询
    CONSULT : {
        enable : '<span class="AT_item"><div><i class="AT_icon_consult"></i><p>咨询</p></div></span>',
        disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_consult"></i><p>咨询</p></div></span>',
        hide : function(btn){return false; }, 
        click: function(btn)// 按钮点击事件，需要通过agt-click 替换本方法，不能直接使用.
        {
        	ZteAgtUI.getConsultParams(function(consultType,dstObj,callingNo,userData,paramObj,cbFun){
        		ZteAgent.consult(consultType,dstObj,callingNo,userData,paramObj, cbFun);
        	});
          /*  var num=prompt("请输:  座席0/电话1/技能2/IVR3  | 电话/工号/技能/接入码 | 主叫号 | 业务数据 ", "0|100|123|xxx"); 
			var arr=num.split("|");
			if(arr.length!=4) return;
            ZteAgent.consult(arr[0],arr[1],arr[2],arr[3],null);*/
        } 
    },
    	
	//会议功能
     CONFERENCE : {
        enable : '<span class="AT_item"><div><i class="AT_icon_meeting"></i><p>会议</p></div></span>',
        disable : '<span class="AT_item"><div class="disabled"><i class="AT_icon_meeting"></i><p>会议</p></div></span>',
        hide : function(btn){return false; },
        click: function(btn)// 按钮点击事件，需要通过agt-click 替换本方法，不能直接使用.
		{
        	ZteAgtUI.openConferenceUI(function(cbFun)
        	{
        		cbFun();
        	});
        }
    },
  //chat功能
    WEBCHAT : {
       enable : '<span class="AT_item"><div><i class="AT-multimedia-webChat"></i><p>webChat</p><em style="display:none;">0</em></div></span>',
       disable : '<span class="AT_item"><div class="disabled"><i class="AT-multimedia-webChat"></i><p>webChat</p><em style="display:none;">0</em></div></span>',
       hide : function(btn){return false; },
       click: function(btn)// 按钮点击事件，打开多媒体客服界面
		{
    	   var ww=document.documentElement.clientWidth,wh=document.documentElement.clientHeight,m_dialog=$('.multimediaService_dialog'),th=$('.multimediaService_dialog .title').outerHeight();
			m_dialog.find('iframe').height(wh*0.9-th);
			m_dialog.show().css({'left':ww+'px','height':wh*0.9+'px'}).animate({'left':(ww-1000)/2+'px'});
			multimediaServDlg.window.accessService.view.openSession(15);
		}
   },
 //微信
   WECHAT : {
      enable : '<span class="AT_item"><div><i class="AT-multimedia-wechat"></i><p>微信</p><em style="display:none;">0</em></div></span>',
      disable : '<span class="AT_item"><div class="disabled"><i class="AT-multimedia-wechat"></i><p>微信</p><em style="display:none;">0</em></div></span>',
      hide : function(btn){return false; },
      click: function(btn)// 按钮点击事件，打开多媒体客服界面
		{
    	  var ww=document.documentElement.clientWidth,wh=document.documentElement.clientHeight,m_dialog=$('.multimediaService_dialog'),th=$('.multimediaService_dialog .title').outerHeight();
			m_dialog.find('iframe').height(wh*0.9-th);
			m_dialog.show().css({'left':ww+'px','height':wh*0.9+'px'}).animate({'left':(ww-1000)/2+'px'});
			multimediaServDlg.window.accessService.view.openSession(14);
		}
  },
   OUTBOUND : {//自定义打开外呼按钮界面
      enable : '<span class="AT_item"><div><p>打开外呼</p><em style="display:none;">0</em></div></span>',
      disable : '<span class="AT_item"><div class="disabled"><p>打开外呼</p><em style="display:none;">0</em></div></span>',
      hide : function(btn){return false; },
	  init:function(btn){btn.state=1;},
	  getState:function(btn){return 1;},
      click: function(btn)// 按钮点击事件，打开多媒体客服界面
				{
					var agtInfo = ZteAgent.getAgtInfo();
					obwin = window
							.open(
									"http://10.116.32.29:8082/webagent/mainframe/hidelogin.jsp?vcid="
											+ agtInfo.vcid + "&operid="
											+ agtInfo.agtId,
									"outbound",
									'height=800,width=1000,top=0,left=0,toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
				 eh =	ZteAgent.RegAINFEvent("OnSignOutSuccess", function(){
						obwin.close();
						ZteAgent.unRegAINFEvent(eh);
					});
				}
  }
 };
 
// 工具条配置，可以以agt:btnbar方式直接嵌入到应用中
AGT_CONFIG.btnBar =[
        "<div class='AT_handle'><ul>",
            "<li agt-btn='SIGNIN' title='签入'></li>",
            "<li agt-btn='SIGNOUT' title='签出'></li>",
			"<li agt-btn='SERVICE' title='服务'></li>",
            "<li agt-btn='BUSY' title='示忙'></li>",
            "<li agt-btn='IDLE' title='示闲'></li>",
            "<li agt-btn='ANSWER' title='应答'></li>",
			"<li agt-btn='HANGUP' title='挂机'></li>",
            "<li agt-btn='CALLOUT' title='呼出'></li>",
            "<li agt-btn='HOLD' title='保持'></li>",
            "<li agt-btn='REHOLD' title='恢复'></li>",
            "<li agt-btn='TRANSFER' title='转接'></li>",
            "<li agt-btn='ADJUST' title='整理'></li>",
			"<li agt-btn='CHANCEL_ADJUST' title='取消整理'></li>",
            "<li agt-btn='CONSULT' title='咨询'></li>",
            "<li agt-btn='CONFERENCE' title='会议'></li>",
            "<li agt-btn='MEDIA_IDLE' title='媒体示闲'></li>",
            "<li agt-btn='MEDIA_BUSY' title='媒体示忙'></li>",
			"<li agt-btn='OUTBOUND' title='打开外呼'></li>",
        "</ul></div>",
        "<div class='AT_handle multimediaService_message'><ul>",
        "<li agt-btn='WEBCHAT' title='webChat'></li>",
        "<li agt-btn='WECHAT' title='微信'></li>",
        "</ul></div>",
        ""].join("");
 