<template>
    <!-- 电话条相关信息,语音联络中心，语音座席角色登录时候显示电话条 -->
    <div class="base-phone-view-container">
        <div class="phone-item-container">
            <div class="phone-bar-btn default" @click ="answerBtnClickHandler">
                <i class="el-icon-info"></i>
                <span>接听</span>
            </div>
            <div class="phone-bar-btn default" @click ="hangUpBtnClickHandler" >
                <i class="el-icon-info"></i>
                <span>挂断</span>
            </div>
            <div class="phone-bar-btn default" @click="holdBtnClickHandler" v-show="!isHolding">
                <i class="el-icon-info"></i>
                <span>保持</span>
            </div>
            <div class="phone-bar-btn default" @click="cancelHoldBtnClickHandler" v-show="isHolding">
                <i class="el-icon-info"></i>
                <span>取回</span>
            </div>
            <div class="phone-bar-btn default" @click="makeCallAgtClickHandler">
                <i class="el-icon-info"></i>
                <span>呼叫</span>
            </div>
            <div class="phone-bar-btn default" @click="transferBtnClickHandler">
                <i class="el-icon-info"></i>
                <span>转接</span>
            </div>
            <div class="phone-bar-btn default" @click="transferCompleteBtnHandler">
                <i class="el-icon-info"></i>
                <span>完成</span>
            </div>
            <div class="phone-bar-btn default" v-show="getPhoneStatus != 3" @click="busyBtnClickHandler">
                <i class="el-icon-info"></i>
                <span>暂停</span>
            </div>
            <div class="phone-bar-btn default" v-show="getPhoneStatus == 3" @click="idleBtnClickHandler">
                <i class="el-icon-info"></i>
                <span>就绪</span>
            </div>
            <div class="phone-bar-btn default" @click="loginOutBtnClickHandler">
                <i class="el-icon-info"></i>
                <span> {{loginBtnStr}}</span>
            </div>
            <div class="phone-bar-btn disable" @click="callExpertBtnClickHandler">
                <i class="el-icon-info"></i>
                <span>呼叫专家</span>
            </div>
            <!-- 呼叫专家取消保持 -->
            <div class="phone-bar-btn disable" @click="cancelHoldBtnClickHandler">
                <i class="el-icon-info"></i>
                <span>取回电话</span>
            </div>
            <div class="status">
                <span class="fz14">状态：{{getPhoneStatusStr}}</span>
            </div>
        </div>
        <div class="right-part">
            <span class=" timer text-right">{{getPhoneTimerStr}}</span>
            <div class="satify-btn fz14">满意度调查</div>
        </div>
        
    </div>
</template>
<script>
import {loadJs,mathTime} from '@/core/utils/GlobalMethods';
import bus from '@/core/utils/BusEvent';
import  '@/utils/phoneevents/ZtePhoneEvent.js';
import { mapGetters, mapActions } from 'vuex';
export default {
    data(){
        return{
            isCalling:false,
            loadingInstance:null,
            isInit:false,
            loginBtnStr:'',//签入与签出状态按钮
            timerHandler:'',//计时器句柄
            timerString:"00:00:00",
            timer:new Date(),//计时器
            isHolding:false,
        }
    },
    computed:{
        ...mapGetters(['getPhoneStatus','getPhoneStatusStr','getPhoneTimerStr']),
    },
    watch:{
        getPhoneStatus:{
            handler(nval,oval){
                this.loginBtnStr ='签出';
                if(this.getPhoneStatus == csrPhone.status.default){
                    this.loginBtnStr = '签入';
                }else if(this.getPhoneStatus == csrPhone.status.idle){

                }else if(this.getPhoneStatus == csrPhone.status.busy){

                }
            },
            immediate:true,
        },
    },
    //需要后台接口： 签入、签出
    methods:{
        ...mapActions(['setPhoneStatus']),
        loginOutBtnClickHandler(){
            //签入中兴
            if(this.getPhoneStatus == csrPhone.status.default){
                this.login();
            }else{
                this.logout();
            }
        },
        login(){
            csrPhone.showLoading("电话签入中，请稍后...");
            ZteAgent.signIn((isSucc,error)=>{
                let msg = isSucc ? '成功' :'失败';
                let icon = isSucc? 'success':"error";
                if(isSucc){
                    //中兴签入之后直接变为就空闲绪状态
                    this.setPhoneStatus(csrPhone.status.idle);
                }
                this.$message({
                    showClose: false,
                    duration:1000,
                    message: '签入'+msg,
                    type: icon,
                });
                csrPhone.hideLoading();
            });
        },
        logout(){
            ZteAgent.lazySignOut((isSucc)=>{
                let msg = isSucc ? '成功' :'失败';
                let icon = isSucc ?'success':'error';
                this.$message({
                    showClose: false,
                    duration:1000,
                    message: '签出'+msg,
                    type: icon,
                });
                if(isSucc){
                    this.setPhoneStatus(csrPhone.status.default);
                }
            });
        },
        //打开页面就要初始化整个逻辑
        init(callback){
            let zeroCfgURL = "http://10.200.190.208:17201/was";//零售我外呼服务器地址
            let vcid = 1;//int
            let operatorId = 105;//int
            let password = "Ceb@95595";

            let type = "sipphone";
            //根据角色来判断当前需要初始化哪种电话，如果是视频坐席还需要初始化菊风电话部分
            let phoneType = "0"; // 0sipphone   2 pc+phone 先做sipphone的  ，视频是pc+phone
            let phoneNo = ""; // siphone 不需要分机号  
            let ccb = '0';
            let phoneaddr = '127.0.0.1:5060';//SIP地址
            if(phoneType == '2' && phoneNo == ""){
                this.csrAlert.error("未查到分机号!");
                return;
            }
            let md5Util = new MD5();
            let signInParams ={
                type : type,
                cfgUrl : zeroCfgURL,
                agtId : operatorId,
                vcid : vcid,
                pwd:md5Util.hex_md5(password).toUpperCase(),
                extendParam:{
                    autoAnswer :false,
                    initialReady : true,
                    useVideo:false,
                    //videoResolution:videoResolution,
                    // fullRecord:true,     // 全程录音
                    recordMode:1,       // 录音/录像模式0-本地录（默认），1-媒体服务器录
                    isShowLocalVideoWindow:true,
                    isUseAnswerDlg: 0,
                    msRecChannelMode : 1,    // 0 - 非双声道  1-双声道
                //	fakeAgtCalling:fakeAgtCalling,
                    idleStatus: 1,     //1表示通话结束后示闲，0（默认值）表示一直处于整理态。    
                    imcallmutex: 1,    // 0: 聊天和呼叫可以同时进行   1：聊天和呼叫不可以同时进行
                    screenRec:true
                },
                phoneType:phoneType,
                bindPhone : phoneNo,
                ccb:ccb,
                phoneaddr:phoneaddr,
            };
            csrPhone.showLoading("电话初始化中，请稍后...");
            ZteAgent.lazyLoading(signInParams, (isSucc, errorCode)=>{
                if (!isSucc){
                    this.$message({
                        showClose: true,
                        message: "初始化失败,错误码[" + errorCode + "],请联系系统管理员！",
                        type: 'error',
                    });
                    this.isInit=true;
                    if(callback){
                        callback(true);
                    }
                } else{
                  if(callback){
                      callback(false);
                  }
                }
                md5Util = null;
                csrPhone.hideLoading();
            });
           
        },
        /**
         * 点击示忙
         */
        busyBtnClickHandler(){
            ZteAgent.busy((isSucc, errCode)=>{
                if(!isSucc){
                    // promptLastError();
                    console.log("示忙切换失败");
                }else{
                    //切换至忙碌busy状态
                    this.setPhoneStatus(csrPhone.status.busy);
                    console.log("切换示忙成功");
                }
            });
        },
        /**
         * 点击示闲
         */
        idleBtnClickHandler(){
            ZteAgent.idle((isSucc, errCode)=>{
                if(!isSucc){
                    // promptLastError();
                    console.log("示闲切换失败");
                }else{
                    //切换至就绪idle状态
                    this.setPhoneStatus(csrPhone.status.idle);
                    console.log("切换示闲成功");
                }
            });
        },
        /**
         * 点击挂机
         */
        hangUpBtnClickHandler(){
            let userData = '';
            ZteAgent.hangUp(userData, (isSucc, errCode)=>{
                if(!isSucc){
                    //挂机报错
                    this.showError("挂机",errorCode);
                }else{
                    this.setPhoneStatus(this.getPhoneLastStatus);
                }
            });    
        },
        /**
         * 点击保持按钮
         */
        holdBtnClickHandler(){
            ZteAgent.hold((isSucc, errCode)=>{
                if(!isSucc){
                     this.showError('保持',errorCode);
                }
                this.isHolding = true;
            });
        },
        /**
         * 点击取消保持按钮
         */
        cancelHoldBtnClickHandler(){
            ZteAgent.cancelHold((isSucc, errCode)=>{
                if(!isSucc){
                    this.showError('取消保持',errorCode);
                }
                this.isHolding = false;
            });
        },
            /**
         * 外呼接口
         * @param {*} callNo    外呼号码
         * @param {*} callType  呼叫类型：1:音频 2:视频
         * @param {*} userData  随路数据
         * @param {*} objType   //呼叫类型 0:坐席工号 1:网户UID 2:用户号码
         */
        makeCallAgtClickHandler(){
            var callee = '13520040163';
            
            var callType = 1, outCode='', callingNo='', userData='tttuserdata', extendParams=null;
            var objType = 2; //呼叫目标：<option value="0">坐席工号</option><option value="1">网户UID</option><option value="2">用户号码</option>

            callType = 1; //呼叫类型 1音频  2视频
            outCode = ""; //分行出局编码
            
            ZteAgent.makeCall(callType, objType, callee, outCode, callingNo, userData, (isSucc, errCode)=>{
                if(!isSucc){
                    // promptLastError();
                    // clickSetIdle();
                    this.showError("呼叫",errCode);
                    return;	
                }
            });
           
        },
        /**
         * 接听按钮点击事件
         */
        answerBtnClickHandler(){
            ZteAgent.answer(function(ret,data){
                if(ret){
                    ZtePhoneEvent.addMessages("通话建立:" + JSON.stringify([callid, calling, param]));
                }
            });
        },
        /**
         * 呼叫专家按钮
         */
        callExpertBtnClickHandler(){

        },
        /**
         * 转接按钮
         */
        transferBtnClickHandler(){

        },
        /**
         * 转接完成按钮
         */
        transferCompleteBtnHandler(){

        },
        showError(title,errCode){
            this.$message({showClose: false,duration:1000,message: title+"失败，失败原因：["+errCode+"]",type: "warning"});
        },
        //振铃回调事件
        onRingingHandler(param){
            //切换电话状态位可接听状态
            console.log('BasePhoneView.onRingingHandler----');
            ZtePhoneEvent.getCallData();
        },
        //建立通话连接，通话中,计时器开始计时
        onTalkingHandler(param){
            console.log("BasePhoneView.onTalkingHandler");
            this.timer = new Date().getTime();
        },
        //电话挂断事件回调
        onReleaseHandler(){
            this.timerString = "00:00:00";
        },
        tick(){
            this.timerHandler = setTimeout(() => {
                //通话中 进行计时
                if(this.getPhoneStatus == csrPhone.status.talking){
                    this.timerString = mathTime(this.timer);
                }                
                this.tick();
        }, 200);
        },
    },
    beforeDestroy(){
        clearTimeout(this.timerHandler);
    },
    mounted() {
        loadJs('static/lib/zteAgent/js/zteAgent.js',()=>{
            console.log("zteAgent load complete");
            ZtePhoneEvent.registerAgentEvents();
            //中兴的初始化需要其所有内容全部加载完才能调用，之家在玩zteAgent.js时候调用不会成功，所以加上了定时5秒钟。
            let th = setTimeout(()=>{
                this.init();
                clearTimeout(th);
            },5000);
        });
        csrPhone.addEvent(csrPhone.event.onRinging,this.onRingingHandler);
        csrPhone.addEvent(csrPhone.event.onTalking,this.onTalkingHandler);
        csrPhone.addEvent(csrPhone.event.onRelease,this.onReleaseHandler);
        // this.tick();
    },
}
</script>
<style scoped>
    .base-phone-view-container{
        display:flex;
        flex-flow:row nowrap;
        padding-left: 20px;
        min-height:20px;
        justify-content: flex-start;
        height:65px;
        align-items: center;
        position: relative;
        color: white;
        
    }
    .base-phone-view-container .phone-item-container{
        display:flex;
        flex-flow:row nowrap;
        flex:1;
        align-items: center;
    }
    .base-phone-view-container .right-part .timer{
        font-size: 22px;
      margin-right: 40px; 
    }
    .base-phone-view-container .right-part{
        /* position: absolute; */
       margin-right: 20px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
    }
    .base-phone-view-container .right-part .satify-btn{
        padding: 8px 10px;
        cursor: pointer;
        border-radius: 4px;
        color:white;
    }
</style>

