import bus from '@/core/utils/BusEvent';
import store from '@/store/index.js';
window.ZtePhoneEvent = {
    stateMap:{
        "0" :"未登录",
        "1"  :  "注销" , 
        "2"  :  "下班" , 
        "3"  :  "系统自动签出" , 
        "4"  :  "强制注销" , 
        "100"  :  "登录" , 
        "101"  :  "上班" , 
        "102"  :  "离席" , 
        "103"  :  "自锁" , 
        "104"  :  "被强制锁定" , 
        "105"  :  "示忙" , 
        "106"  :  "被强制示忙" , 
        "107"  :  "预呼" , 
        "108"  :  "媒体处理" , 
        "109"  :  "质检" , 
        "111"  :  "学习态" , 
        "强制示闲"  :  "空闲态(2)" , 
        "200"  : "示闲",
        "202"  :  "主动示闲" , 
        "203"  :  "系统自动示闲" , 
        "300"  :  "接入用户通话" , 
        "301"  :  "内部呼入通话" , 
        "302"  :  "外呼呼出通话" , 
        "303"  :  "内部呼出通话" , 
        "304"  :  "保持" , 
        "305"  :  "会议" , 
        "306"  :  "外部咨询" , 
        "307"  :  "内部咨询" , 
        "308"  :  "远端咨询" , 
        "309"  :  "监听" , 
        "310"  :  "插话" , 
        "312"  :  "呼入振铃" , 
        "313"  :  "呼出振铃" , 
        "314"  :  "排队选中，等待呼入" , 
        "315"  :  "CTI选中，等待呼入" , 
        "316"  :  "业务占用,等待座席呼出" , 
        "317"  :  "教练状态(发起者)" , 
        "400"  :  "自动进入话后整理态" , 
        "401"  :  "手工进入话后整理态"   
    },
    /**
     * 注册座席事件
     */
    registerAgentEvents(){
        ZteAgent.regEvent("onCTIAgentStateChanged", this.onCTIAgentStateChanged);
        ZteAgent.regEvent("onRinging", this.onRinging);
        ZteAgent.regEvent("onTalking", this.onTalking);
        ZteAgent.regEvent("onFailCause18X", this.onFailCause18X);
        ZteAgent.regEvent("onRecord", this.onRecord);
        ZteAgent.regEvent("onPlayEnd", this.onPlayEnd);
        ZteAgent.regEvent("onRelease", this.onRelease);
        ZteAgent.regEvent("onTransfered", this.onTransfered);
        ZteAgent.regEvent("onSingleTransfered", this.onSingleTransfered);
        ZteAgent.regEvent("onSnapShotCall", this.onSnapShotCall);
        ZteAgent.regEvent("onReturnFromIVR", this.onReturnFromIVR);
        // ZteAgent.regEvent("onConsultBack", onConsultBack);
        // ZteAgent.regEvent("onShareStart", onShareStart);
        // ZteAgent.regEvent("onShareStop", onShareStop);
        // ZteAgent.regEvent("onShareTypeChange", onShareTypeChange);
        // // 增加网络异常和平台主备切换事件
        ZteAgent.regEvent("onNetworkException", this.onNetworkException);
        ZteAgent.regEvent("onMasterChanged", this.onMasterChanged);
    },
    //注册聊天事件
    registerAgentChatEvents(){
        ZteAgent.regEvent("onImBeginReqReceived",onImBeginReqReceived);
        ZteAgent.regEvent("onImEnd",onImEnd);
    },
    //注册视频事件
    registerAgentVideoEvents(){
        // ZteAgent.regEvent("OnBeginCoachSuccess",onBeginCoachSuccess);
        // ZteAgent.regEvent("OnBeginCoachFailure",onBeginCoachFailure);
        // ZteAgent.regEvent("OnEndCoachSuccess",onEndCoachSuccess);
        // ZteAgent.regEvent("OnEndCoachFailure",onEndCoachFailure);
    },
    /**
     * 状态改变事件
     * 
     * @param state 当前状态
     * @param lastState  上一状态
     * @param cause 改变原因
     * @param param  扩展参数
     */
    onCTIAgentStateChanged(state, lastState, cause, param){
        //$("#state").val(state);
        ZtePhoneEvent.addMessages("状态切换至[" + state + "]");
        // 进入话后整理态后示闲
        if (state == 400){
            //clickSetIdle();
        }
    },
    /**
     * 通话呼入振铃事件
     * @param calling 本次振铃的主叫号码
     * @param callee  本振铃的被叫号码
     * @param callid  本次振铃的呼叫ID
     * @param calldata 随路数据
     * @param correlatedata 扩展随路数据，字符串类型，键值对方式
     * @param param 扩展参数
     */
    onRinging(calling, callee, callid, calldata, correlatedata, param){
        ZtePhoneEvent.addMessages("呼叫振铃:" + JSON.stringify([calling, callee, callid, calldata, correlatedata, param]));
        // ZtePhoneEvent.getCallData();
        let correlatedataArray = correlatedata.split(";");
        let destAgentid = "";
        let callingNumber = "";
        for(let index in correlatedataArray){
            let typeArray = correlatedataArray[index].split("=");
            if("DSTAGTID" == typeArray[0]){
                destAgentid = typeArray[1];
            }
            if("CALLINGOBJ" == typeArray[0]){
                callingNumber = typeArray[1].split("/")[2];   // 获取主叫号码
            }
        }
        
        ZtePhoneEvent.setStatus(csrPhone.status.calling);
        //通知电话事件
        csrPhone.dispatchEvent(csrPhone.event.onRinging);     
        // 当坐席号码和呼叫的目标号码相同的时候才会振铃
        // if(ZteAgent.getAgtInfo().agtId == destAgentid){
        //     // let ret = window.confirm("主叫号码为:" + callingNumber + "\n" + "接听还是残忍拒绝");
        // }		  
        // $("#btnGetCallData").removeAttr("disabled");
    },
    /**
     * 通话建立事件
     */
    onTalking(callid, calling, called, extendParam){
        console.log("通话建立[onTalking]:" + JSON.stringify([callid, calling, called, extendParam]));
        ZtePhoneEvent.setStatus(csrPhone.status.talking);
        // csrPhone.dispatchEvent(csrPhone.event.onTalking);    
    },

    /**
     * 呼叫失败原因事件
     * @param cause
     * @param param
     */
    onFailCause18X(cause, param){
        ZtePhoneEvent.addMessages("呼叫失败原因事件:" + JSON.stringify([cause, param]));
    },
    /**
     * 录音事件
     * @param type
     * @param errcode
     * @param filename
     * @param extendParam
     */
    onRecord(type, errcode, filename, extendParam){
        ZtePhoneEvent.addMessages("录音事件:" + JSON.stringify([type, errcode, filename, extendParams]));
    },
    /**
     * 报工号结束事件
     */
    onPlayEnd(){
        ZtePhoneEvent.addMessages("报工号结束事件");
    },
    /**
     * 挂机事件
     */
    onRelease(droper, dropee, callid, cause, lcstate, reason, extendParam){
        console.log("挂机成功，参数："+JSON.stringify([droper, dropee, callid, cause, lcstate, reason, extendParam]));
        csrPhone.dispatchEvent(csrPhone.event.onRelease);    
    },

    /**
     * 咨询转事件
     */
    onTransfered(transtel, calling, called, callid, calldata, extendParam){
        console.log("咨询转接成功，参数："+JSON.stringify([transtel, calling, called, callid, calldata, extendParam]));
        csrPhone.dispatchEvent(csrPhone.event.onTransfered);    
    },
    /**
     * 单步转事件
     */
    onSingleTransfered(transtel, calling, called, callid, extendParam){
        console.log("单步转接成功，参数："+JSON.stringify([transtel, calling, called, callid, extendParam]));
        window.$busEvent.$emit(ZtePhoneEvent.event.onSingleTransfered,{});
    },

    /**
     * 加入会议成功事件
     * @param d1
     * @param d2
     * @param d3
     * @param callid
     * @param cause
     * @param calldata
     * @param extendParam
     */
    onConference(d1, d2, d3, callid, cause, calldata, extendParam){
        ZtePhoneEvent.addMessages("加入会议成功事件，参数："+JSON.stringify([d1, d2, d3, callid, cause, calldata, extendParam]));
    },
    /**
     * 会议成员变化事件
     * @param callid
     * @param devicelist
     * @param extendParam
     */
    onSnapShotCall(callid, devicelist, extendParam){
        ZtePhoneEvent.addMessages("会议成员变化事件，参数："+JSON.stringify([callid, devicelist, extendParam]));
    },
    /**
     * 远端咨询返回事件
     * @param ivrdata
     * @param extendParam
     */
    onReturnFromIVR(ivrdata, extendParam){
        ZtePhoneEvent.addMessages("远端咨询返回事件，参数："+JSON.stringify([ivrdata, extendParam]));
    },
    /**
     * 咨询方挂机事件
     * @param calling
     * @param called
     * @param callid
     * @param extendParam
     */
    onConsultBack(calling, called, callid, extendParam) {
        ZtePhoneEvent.addMessages("咨询方挂机事件，参数："+JSON.stringify([calling, called, callid, extendParam]));
    },
    onMasterChanged(){
        ZtePhoneEvent.addMessages("平台正在进行主备模块切换!");
        // disableBtn($("input[id^='btn']"),$("#btnHangup"));
    },
    onNetworkException(){
        ZtePhoneEvent.addMessages("坐席与平台的通信发生网络异常！");
        // disableBtn($("input[id^='btn']"),$("#btnHangup"));
    },
    /**
     * 获取随路数据
     */
    getCallData(){
        ZteAgent.getSvcData(function(isSucc,message){
           console.log("获取到的通话随路数据是:" + JSON.stringify(message));
        });
    },
    /**
     * 设置随路数据按钮
     */
    setCallData(calldata){
        if(!calldata || calldata== ""){
            console.log("随路数据为空");
            return;
        }
        ZteAgent.setSvcData(encodeURIComponent(calldata),function(isSucc, errCode){
            if(!isSucc){
                console.log("设置通话随路数据失败");
            }else{}
        });
    },
    addMessages(msg){
        console.log(msg);
    },
    setStatus(status){
        store.dispatch('setPhoneStatus',status);
    },
}