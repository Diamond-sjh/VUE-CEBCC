const constants = {
    localData:true,//是否使用本地假数据
    // production:false,//是否生产包
    debug:true,
    returnCode:{
        success:"AAAAAAA",// "AAAAAA",
        timeout:''
    },
    btnPermParamName:'perm_code',//按钮权限参数名称
    role:{ 
        /*R1  CSR系统
        R2  CSR在线客服
        R3  后台管理系统
        R4  零售外呼
        R5  视频座席(新角色)
        R6  CSR视频系统*/
        //坐席的角色 与登陆时候的后台返回的应该角色id一致roleId,等后台有了格式之后统一改
        phone:'R1',//语音客服
        text:'R2',//文字客服
        admin:'R3',//后台管理系统
        outbound:'R4',//零售外呼  ，//
        video:'R5',//视频客服 
    },
    //系统定义块
    channel:{//当前进线的用户渠道
        PHONE:"PHONE",
        ONLINE: "ONLINE",
        OUT_BOUND: "OUT_BOUND",
    },
    //电话呼入呼出方向
    voiceDirection:{
        default:0,//默认无方向
        callin:1,//呼入方向
        callout:2,//呼出方向
    },
    //电话状态
    voiceState:{
        offline:0, // 离线
        online:1,//在线
    },
    //用户内容类别
    customer:{
        //进线类型定义
        TRANS_WARRANT_TYPE_CUSTNO:'0',//客户号进线
        TRANS_WARRANT_TYPE_IDCARD:'1',//身份证进线
        TRANS_WARRANT_TYPE_WARRANT:'2',//凭证，卡号进线

        //办理的业务类型，及卡片列表tab选项 ，多卡种列表用
        CREDIT_DEBIT_BUSSINESS_TYPE:'2',//业务类型 ，存贷合一业务
        CREDIT_BUSSINESS_TYPE:'1',//信用卡业务
        DEBIT_BUSSINESS_TYPE:'0',//借记卡业务,即综合业务
        COMPANY_BUSSINESS_TYPE:'3',//对公业务 ，等待后台给定数值，目前不确定码值
    },
    //所有的事件定义块
    event:{
        EVENT_PHONE_CUSTOMER_ENTER:'EVENT_CUSTOMER_ENTER',//ivr客户进线事件
        EVENT_ONLINE_CUSTOMER_ENTER:'EVENT_ONLINE_CUSTOMER_ENTER',//在线客户进线事件
        EVENT_OPEN_NEW_TRANS:'EVENT_OPEN_NEW_TRANS',//打开新的tab菜单,
        EVENT_LOGIN_START:'EVENT_LOGIN_START',//打开登录页面,
        EVENT_BOLT_TO_CALL: 'EVENT_BOLT_TO_CALL', // 断线外呼事件，
        EVENT_CHANGE_SRC_SATTE: 'EVENT_CHANGE_SRC_SATTE', // 改变坐席状态事件
    },
    //uipopup开启事件--统一的eventbus，由manager管理开启与关闭
    uiEvent:{
        EVENT_OPEN_UI:'EVENT_OPEN_UI',//测试开启ui
    },
    uiPanel:{
        TEST_PANEL:"TestPanel",//测试弹窗
        CUSTOMER_IMPORTANT_INFO_PANEL:"CustomerImportantInfoPanel",//重要信息弹窗
        SIMULATE_CUSTOMER_ENTER_PANEL:"SimulateCustomerEnterPanel",//模拟进线弹出窗
        PHONE_CALL_SUMMARY_PANEL:"PhoneCallSummaryPanel",//小结弹出窗
        PUBLIC_DEMO_PANEL:"PublicDemoPanel",
        INTELLIGENT_ASSISTANCE_PANEL:'IntelligentAssistancePanel',
        PERSON_SETTING_PANEL:'PersonSettingPanel',//个人设置弹出框
        IVR_HISTORY_INFO_PANEL:'IvrHistoryInfoPanel',//进线轨迹历史
        CUSTOMER_ORDER_HISTORY_INFO_PANEL:'CustomerOrderHistoryInfoPanel',//工单历史
        CUSTOMER_PHONECALL_HSITORY_INFO:'CustomerPhoneCallHistoryInfo',//来电历史
        NOTICE_INFO_PANEL:'NoticeInfoPanel', //公告信息
        WORKD_ORDER_PANEL:'WorkorderPanel', //工单模块
    },
    emitEvent:{
        TRANS_OPTION_TIPS_EVENT:'transOptionTip',//交易操作后显示的提示内容,
        
    },
    maxPanelNum:5,//最大弹出框数量
    //操作结果类型
    optionResultType:{
        success:0,
        error:1,
        warning:2,
    },
    sysUrl:{
        //工单地址，假数据，等着后台给配置吧
        workformaddr: "/VME/Main.html?locale=zh_CN&username=" + "currentAccount"
		+ "&external=webservice&domain=VEGA&be=CEB&ws=CEB_O1_APP_OMG&functions=CEB_O1_APP_OMG_WO&cid=WO_HANDLING&DACTION=Create Init Form&showTree=false&did=",
				               
    }
}
window.constants = constants;
export default {
    install:function(Vue){
        window.constants = constants;
        Vue.prototype.$constants = constants;
    }
}
