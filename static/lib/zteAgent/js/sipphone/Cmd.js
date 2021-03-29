/**
 * 命令列表 作用：统一定义各命令的名称 每个命令对应传统座席的某个菜单项
 */
Cmd = WebAgent.Cmd =
{
    /**
     * 话务
     */
    HANG_UP : "hangUp",// 挂机
    HOLD : "hold", // 保持
    RE_HOLD : "retrieveHold",// 取消保持
    TRANSFER : "transfer",// 转接
    SSTRANSFER : "singleStepTranCall", // 单步转移
    MAKE_CALL : "makeCall",// 呼叫
    FAST_CALL : "fastCall", // 快速呼出
    SWITCH : "switch", // 交换
    RECONNECT : "reconnect", // 重连
    RE_CALL : "reCall", // 重拨
    SHOW_BUSY : "showBusy",// 示忙
    IDLE : "idle",// 示闲
    SERVICE : "service", // 服务
    CANCEL_ADJUST : "cancelAdjust", // 取消整理
    MANUAL_ADJUST : "manualAdjust",// 整理
    MEDIA : "media", // 媒体
    CANCEL_MEDIA : "cancelMedia", // 取消媒体
    CONS : "consultation", // 咨询
    ALTERNATE : "alternate", // 切换
    QC : "qc", // 质检
    CANCEL_QC :"cancelQC", //停止质检
    WEB_CHAT_ON : "webChatOn", // 聊天上线
    WEB_CHAT_OFF : "webChatOff", // 聊天下线
    MUTE : "mute", // 静音
    UNMUTE : "unmute", // 取消静音
    RECORD : "beginRecord", // 开始录音
    STOP_RECORD : "stopRecord", // 停止录音
    TRANSFER_VOICE : "transferVoice", // 转接语音
    RECEIVE_PHONE_NO : "receivePhoneNo", // 收集号码
    SECOND_DIAL : "secondDial",// 二次拨号
    PARK : "park",// 停泊
    MEDIA_BUSY : "mediaBusy", // 媒体示忙
    MEDIA_IDLE : "mediaIdle", // 媒体示闲

    /**
     * 高级话务功能
     */
    PLAY_RECENT_REC : "playRecentRec",// 播放最近录音
    CONF : "conference", // 三方通话
    SSCONF : "SSConference", // 单步会议
    SET_ALLOW_SPEAK : "setAllowSpeak", // 设置禁言
    APPOINT_AGT_PROC : "appointAgtProcess",// 指定座席处理
    APPOINT_MEDIA_PROC : "appointMediaProcess",// 指定媒体处理
    CALL_HELP : "callHelp", // 呼叫求助
    SEND_NOTICE : "sendNotice", // 发送通知
    READ_NOTICE : "readNotice", // 阅读通知
    REQ_HELP : "reqHelp", // 请求帮助
    QUERY_HELP : "queryHelp", // 查看帮助
    LEAVE : "leaveApply",// 离席
    LEAVE_BACK : "leaveBack",// 返席
    
    REQ_UNLOCK : "requestUnlock", // 请求解锁
    HANDLE_UNLOCK : "handleUnlock", // 解锁审批
    LEARN : "learn", // 学习
    CANCEL_LEARN : "cancelLearn", // 取消学习
    CALL_HISTORY : "callHistory", // 呼叫历史
    RECENT_HISTORY : "RecentHistory",// 最近操作历史
    CHAT_HISTORY : "chatHistory", // 聊天历史
    VIDEO_MSG : "videoMessage", // 视频留言
    FORCE_BUSY : "forceBusy", // 强制示忙
    FORCE_IDLE : "forceIdle", // 强制示闲
    FORCE_SIGNOUT : "forceSignout", // 强制退出
    PLAY_VIDEO : "playVideo", // 播放视频
    PLAY_REC : "playRec", // 播放录音
    PLAY_TTS : "playTTS", // 播放TTS
    SET_NIGHT_RING : "nightRing", // 设置夜铃
    PERSONAL_REPORT : "personalReport", // 个性化报工号
    APPROVE_PERSONAL_REPORT : "approvePersonalReport",// 审批个性化报工号
    NOTICE : "notice", // 定时提醒
    SET_NIGHT_SERVICE : "setNightService", // 设置夜服
    VIEW_QUEUE : "viewQueue", // 排队查看

    /**
     * 视频
     */
    STOP_SEND_CAP_SCR : "stopSendCapSrc", // 停止发送截屏
    CAPTURE_SCREEN : "captureScreen", // 截屏
    SEND_CAP_SCR : "sendCapSrc", // 发送截屏

    /**
     * 监控
     */
    INTERCEPT : "intercept", // 拦截
    LISTEN : "listen", // 监听
    CHIP_IN : "chipIn", // 插话
    COACH : "coach", // 教练
    STOP_COACH : "stopCoach", //停止教练
    FORCE_LOCK : "forceLock", // 强锁
    FORCE_HANGUP : "forceHangUp", // 强拆
    SET_KEY_RECORD : "setKeyRecord", // 设置关键录音
    LISTEN_TO_CHIPIN : "listenToChipIn", // 监听转插话
    REAL_TIME_QC : "RealTimeQC", // 实时质检
    FULL_LISTEN : "fullListen", //全程监听
    CANCEL_FULL_LISTEN : "cancelFullListen",// 取消全程监听
    SCREEN_MONITOR : "screenMonitor",// 同屏监控
    RECORD_SCREEN : "recordScreen",  // 录制屏幕
    STOP_RECORD_SCREEN : "stopRecordScreen", // 停止录制屏幕
    HANDLE_LEAVE : "handleLeave",    // 离席审批
    PLACE_MONITOR : "placeMonitor",  // 参所监控
    SYSTEM_MONITOR : "systemMonitor",// 系统监控
    SKILL_MONITOR : "skillMonitor",  // 技能监控

    /**
     * 系统、其他
     */
    SIGNIN : "signin", // 签入
    MODIFY_PWD : "modifyPwd", // 修改密码
    LOGOUT : "logout", // 注销
    EXIT : "exit",// 退出
    SETTING : "setting", // 设置,
    SET_RIGHT_CMD_MAP : "setRightCmdMap"
};
