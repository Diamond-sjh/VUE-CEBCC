/**
 * 状态接口定义：
 * 
 * <pre>
 * IState =
 * {
 * 	  name :String,    // 状态名称
 * 	  enableCmd :Array,// 可用命令数组
 *    enableAinfMethod : Array, // 可用的A接口方法 
 *    stateCode : {Integer}, // CTI返回的状态码，由StateManager自动注入
 *    pevStateCode :{Istate} //上一个状态，StateManager自动注入
 * 	  begin :Function(curStateCode,pevStateCode){}, // 可以省略，进入状态时被调用
 * 	  end :Function(curStateCode,nextStateCode){},   // 可以省略，离开状态时被调用
 * }
 * </pre>
 */
WebAgent.State =
{
    /**
     * 未签入
     */
    notLogin :
    {
        stateCode : "0",
        name : WebAgent.I18n.getMsg("state.null.noLogin"),
        enableCmds : [],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("state.null.noLogin");
        }
    },

    /**
     * 签出 001,002,003
     */
    logout :
    {
        stateCode : "1",
        name : WebAgent.I18n.getMsg("stateCode.1"),
        enableCmds : [],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.1");
        }
    },

    /**
     * 空闲状态 200~204
     */
    free :
    {
        stateCode : "200",
        name : WebAgent.I18n.getMsg("stateCode.200"),
        enableCmds : [ Cmd.SHOW_BUSY, Cmd.MAKE_CALL, Cmd.LOGOUT, Cmd.EXIT, Cmd.MODIFY_PWD, Cmd.MANUAL_ADJUST,
                Cmd.SETTING, Cmd.PLAY_REC, Cmd.QC, Cmd.MEDIA, Cmd.WEB_CHAT_OFF, Cmd.WEB_CHAT_ON, Cmd.CALL_HELP,
                Cmd.LEAVE, Cmd.HANDLE_UNLOCK, Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.SET_NIGHT_RING,
                Cmd.VIEW_QUEUE, Cmd.INTERCEPT, Cmd.LISTEN, Cmd.CHIP_IN, Cmd.FORCE_HANGUP, Cmd.COACH, Cmd.HANDLE_LEAVE,
                Cmd.FORCE_LOCK, Cmd.FORCE_HANGUP, Cmd.FAST_CALL, Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC,
                Cmd.SEND_NOTICE, Cmd.READ_NOTICE, Cmd.REQ_HELP, Cmd.QUERY_HELP, Cmd.CALL_HISTORY, Cmd.RECENT_HISTORY,
                Cmd.CHAT_HISTORY, Cmd.VIDEO_MSG, Cmd.PERSONAL_REPORT, Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE,
                Cmd.SET_NIGHT_SERVICE, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR, Cmd.SKILL_MONITOR, Cmd.SCREEN_MONITOR,
                Cmd.RECORD_SCREEN, Cmd.CANCEL_FULL_LISTEN, Cmd.FULL_LISTEN, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.200");
        }
    },

    /* =============== NotReady 100 ================ */
    /**
     * 登录 100,101
     */
    logon :
    {
        stateCode : "100",
        name : WebAgent.I18n.getMsg("stateCode.100"),
        enableCmds : [ Cmd.MODIFY_PWD, Cmd.LOGOUT, Cmd.EXIT, Cmd.SERVICE, Cmd.WEB_CHAT_ON, Cmd.WEB_CHAT_OFF,
                Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC, Cmd.SEND_NOTICE, Cmd.READ_NOTICE, Cmd.REQ_HELP,
                Cmd.QUERY_HELP, Cmd.LEAVE, Cmd.HANDLE_UNLOCK, Cmd.CALL_HISTORY, Cmd.RECENT_HISTORY, Cmd.CHAT_HISTORY,
                Cmd.VIDEO_MSG, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.FORCE_BUSY, Cmd.PERSONAL_REPORT,
                Cmd.APPROVE_PERSONAL_REPORT, Cmd.SET_NIGHT_RING, Cmd.PLAY_REC, Cmd.NOTICE, Cmd.SET_NIGHT_SERVICE,
                Cmd.VIEW_QUEUE, Cmd.LISTEN, Cmd.INTERCEPT, Cmd.CHIP_IN, Cmd.COACH, Cmd.FORCE_LOCK, Cmd.FORCE_HANGUP,
                Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN, Cmd.HANDLE_LEAVE, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR,
                Cmd.SKILL_MONITOR, Cmd.CANCEL_FULL_LISTEN, Cmd.FULL_LISTEN, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.100");
        }
    },

    /**
     * 离席 102
     */
    leave :
    {
        stateCode : "102",
        name : WebAgent.I18n.getMsg("stateCode.102"),
        enableCmds : [ Cmd.LEAVE_BACK ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.102");
        }
    },

    /**
     * 锁定 103
     */
    lock :
    {
        stateCode : "103",
        name : WebAgent.I18n.getMsg("stateCode.103"),
        enableCmds : [ Cmd.EXIT, Cmd.LOGOUT, Cmd.SETTING, Cmd.REQ_UNLOCK, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.103");
        }
    },

    /**
     * 强锁 104
     */
    forceLock :
    {
        stateCode : "104",
        name : WebAgent.I18n.getMsg("stateCode.104"),
        enableCmds : [ Cmd.EXIT, Cmd.LOGOUT, Cmd.SETTING, Cmd.REQ_UNLOCK, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.104");
        }
    },

    /**
     * 示忙 105,106
     */
    showBusy :
    {
        stateCode : "105",
        name : WebAgent.I18n.getMsg("stateCode.105"),
        enableCmds : [ Cmd.IDLE, Cmd.LOGOUT, Cmd.MAKE_CALL, Cmd.EXIT, Cmd.MODIFY_PWD, Cmd.PLAY_REC, Cmd.SETTING,
                Cmd.SET_RIGHT_CMD_MAP, Cmd.FORCE_SIGNOUT, Cmd.WEB_CHAT_OFF, Cmd.WEB_CHAT_ON, Cmd.FORCE_IDLE,
                Cmd.FORCE_SIGNOUT, Cmd.FORCE_BUSY, Cmd.SET_NIGHT_RING, Cmd.LEAVE, Cmd.VIEW_QUEUE, Cmd.LISTEN,
                Cmd.INTERCEPT, Cmd.CHIP_IN, Cmd.COACH, Cmd.FAST_CALL, Cmd.QC, Cmd.MEDIA, Cmd.APPOINT_AGT_PROC,
                Cmd.APPOINT_MEDIA_PROC, Cmd.CALL_HELP, Cmd.SEND_NOTICE, Cmd.READ_NOTICE, Cmd.REQ_HELP, Cmd.QUERY_HELP,
                Cmd.HANDLE_UNLOCK, Cmd.LEARN, Cmd.CALL_HISTORY, Cmd.RECENT_HISTORY, Cmd.CHAT_HISTORY, Cmd.VIDEO_MSG,
                Cmd.PERSONAL_REPORT, Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE, Cmd.SET_NIGHT_SERVICE, Cmd.FORCE_LOCK,
                Cmd.FORCE_HANGUP, Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR,
                Cmd.SKILL_MONITOR, Cmd.CANCEL_FULL_LISTEN, Cmd.FULL_LISTEN, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.105");
        }
    },

    /**
     * 预呼 107
     */
    preCall :
    {
        stateCode : "107",
        name : WebAgent.I18n.getMsg("stateCode.107"),
        enableCmds : [ Cmd.IDLE, Cmd.MANUAL_ADJUST, Cmd.SETTING, Cmd.WEB_CHAT_OFF, Cmd.WEB_CHAT_ON,
                Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC, Cmd.SEND_NOTICE, Cmd.READ_NOTICE, Cmd.REQ_HELP,
                Cmd.QUERY_HELP, Cmd.HANDLE_UNLOCK, Cmd.CALL_HISTORY, Cmd.RECENT_HISTORY, Cmd.CHAT_HISTORY,
                Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.SET_NIGHT_RING, Cmd.PERSONAL_REPORT,
                Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE, Cmd.SET_NIGHT_SERVICE, Cmd.VIEW_QUEUE, Cmd.FORCE_LOCK,
                Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR, Cmd.SKILL_MONITOR,
                Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE],
        begin : function(curStateCode, pevStateCode)
        {
            var pevState = WebAgent.getPevState();
            if (pevState)
            {
                var disabledCmds = [ Cmd.HANG_UP, Cmd.MAKE_CALL ];
                var cmds = [].concat(pevState.enableCmds);
                cmds.push(Cmd.IDLE);
                this.enableCmds = WebAgent.utils.arrSub(cmds, disabledCmds);
            }
            this.name = WebAgent.I18n.getMsg("stateCode.107");
        }
    },

    /**
     * 媒体 108
     */
    media :
    {
        stateCode : "108",
        name : WebAgent.I18n.getMsg("stateCode.108"),
        enableCmds : [ Cmd.SHOW_BUSY, Cmd.IDLE, Cmd.LOGOUT, Cmd.EXIT, Cmd.MODIFY_PWD, Cmd.SETTING, Cmd.CANCEL_MEDIA,
                Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC, Cmd.SEND_NOTICE, Cmd.READ_NOTICE, Cmd.REQ_HELP,
                Cmd.QUERY_HELP, Cmd.HANDLE_UNLOCK, Cmd.LEARN, Cmd.CALL_HISTORY, Cmd.RECENT_HISTORY, Cmd.CHAT_HISTORY,
                Cmd.VIDEO_MSG, Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.PLAY_REC, Cmd.SET_NIGHT_RING,
                Cmd.PERSONAL_REPORT, Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE, Cmd.SET_NIGHT_SERVICE, Cmd.VIEW_QUEUE,
                Cmd.INTERCEPT, Cmd.LISTEN, Cmd.CHIP_IN, Cmd.COACH, Cmd.FORCE_LOCK, Cmd.FORCE_HANGUP,
                Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR, Cmd.SKILL_MONITOR,
                Cmd.PLAY_RECENT_REC, Cmd.CANCEL_FULL_LISTEN, Cmd.FULL_LISTEN, Cmd.SERVICE, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.108");
        }
    },

    /**
     * 质检 109
     */
    quality :
    {
        stateCode : "109",
        name : WebAgent.I18n.getMsg("stateCode.109"),
        enableCmds : [ Cmd.SETTING, Cmd.WEB_CHAT_OFF, Cmd.WEB_CHAT_ON, Cmd.CANCEL_QC, Cmd.SHOW_BUSY,
                Cmd.PLAY_RECENT_REC, Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC, Cmd.SEND_NOTICE, Cmd.READ_NOTICE,
                Cmd.REQ_HELP, Cmd.QUERY_HELP, Cmd.HANDLE_UNLOCK, Cmd.LEARN, Cmd.CALL_HISTORY, Cmd.RECENT_HISTORY,
                Cmd.CHAT_HISTORY, Cmd.VIDEO_MSG, Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.PLAY_REC,
                Cmd.SET_NIGHT_RING, Cmd.PERSONAL_REPORT, Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE,
                Cmd.SET_NIGHT_SERVICE, Cmd.VIEW_QUEUE, Cmd.INTERCEPT, Cmd.LISTEN, Cmd.CHIP_IN, Cmd.COACH,
                Cmd.FORCE_LOCK, Cmd.FORCE_HANGUP, Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN, Cmd.PLACE_MONITOR,
                Cmd.SYSTEM_MONITOR, Cmd.SKILL_MONITOR, Cmd.CANCEL_FULL_LISTEN, Cmd.FULL_LISTEN, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.109");
        }
    },

    /**
     * WebCall 110
     */
    webCall :
    {
        stateCode : "110",
        name : WebAgent.I18n.getMsg("stateCode.110"),
        enableCmds : [ Cmd.SETTING, Cmd.WEB_CHAT_OFF, Cmd.WEB_CHAT_ON, Cmd.CANCEL_FULL_LISTEN, Cmd.FULL_LISTEN, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.110");
        }
    },

    /**
     * 学习111
     */
    learning :
    {
        stateCode : "111",
        name : WebAgent.I18n.getMsg("stateCode.111"),
        enableCmds : [ Cmd.CANCEL_LEARN, Cmd.IDLE, Cmd.MODIFY_PWD, Cmd.LOGOUT, Cmd.EXIT, Cmd.CANCEL_FULL_LISTEN,
                Cmd.FULL_LISTEN, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.111");
        }
    },

    /* =============== AgentBusy 300 ================ */
    /**
     * 接入用户通话300
     */
    userCallInTalk :
    {
        stateCode : "300",
        name : WebAgent.I18n.getMsg("stateCode.300"),
        enableCmds : [ Cmd.MODIFY_PWD, Cmd.HANG_UP, Cmd.HOLD, Cmd.SHOW_BUSY, Cmd.MANUAL_ADJUST, Cmd.CONS, Cmd.MUTE,
                       Cmd.UNMUTE, Cmd.TRANSFER_VOICE, Cmd.RECEIVE_PHONE_NO, Cmd.SECOND_DIAL, Cmd.SSTRANSFER,Cmd.CONF, Cmd.SSCONF,
                       Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC, Cmd.SEND_NOTICE, Cmd.READ_NOTICE, Cmd.REQ_HELP,
                       Cmd.QUERY_HELP, Cmd.HANDLE_UNLOCK, Cmd.CALL_HISTORY, Cmd.RECENT_HISTORY, Cmd.CHAT_HISTORY,
                       Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.PLAY_TTS, Cmd.SET_NIGHT_RING,
                       Cmd.PERSONAL_REPORT, Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE, Cmd.SET_NIGHT_SERVICE, Cmd.VIEW_QUEUE,
                       Cmd.FORCE_LOCK, Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR,
                       Cmd.LEAVE, Cmd.SKILL_MONITOR, Cmd.PARK, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.300");
        }
    },

    /**
     * 内部通话301
     */
    inTalk :
    {
        stateCode : "301",
        name : WebAgent.I18n.getMsg("stateCode.301"),
        enableCmds : [ Cmd.MODIFY_PWD, Cmd.HANG_UP, Cmd.HOLD, Cmd.SHOW_BUSY, Cmd.MANUAL_ADJUST, Cmd.CONS, Cmd.MUTE,
                       Cmd.UNMUTE, Cmd.TRANSFER_VOICE, Cmd.RECEIVE_PHONE_NO, Cmd.SECOND_DIAL, Cmd.SSTRANSFER,Cmd.CONF, Cmd.SSCONF,
                       Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC, Cmd.SEND_NOTICE, Cmd.READ_NOTICE, Cmd.REQ_HELP,
                       Cmd.QUERY_HELP, Cmd.HANDLE_UNLOCK, Cmd.CALL_HISTORY, Cmd.RECENT_HISTORY, Cmd.CHAT_HISTORY,
                       Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.PLAY_TTS, Cmd.SET_NIGHT_RING,
                       Cmd.PERSONAL_REPORT, Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE, Cmd.SET_NIGHT_SERVICE, Cmd.VIEW_QUEUE,
                       Cmd.FORCE_LOCK, Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR,
                       Cmd.LEAVE, Cmd.SKILL_MONITOR, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.301");
        }
    },

    /**
     * 外部呼出通话302
     */
    callOutTalk :
    {
        stateCode : "302",
        name : WebAgent.I18n.getMsg("stateCode.302"),
        enableCmds : [ Cmd.MODIFY_PWD, Cmd.HANG_UP, Cmd.HOLD, Cmd.SHOW_BUSY, Cmd.MANUAL_ADJUST, Cmd.CONS, Cmd.MUTE,
                       Cmd.UNMUTE, Cmd.TRANSFER_VOICE, Cmd.RECEIVE_PHONE_NO, Cmd.SECOND_DIAL, Cmd.SSTRANSFER, Cmd.CONF,Cmd.SSCONF,
                       Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC, Cmd.SEND_NOTICE, Cmd.READ_NOTICE, Cmd.REQ_HELP,
                       Cmd.QUERY_HELP, Cmd.HANDLE_UNLOCK, Cmd.CALL_HISTORY, Cmd.RECENT_HISTORY, Cmd.CHAT_HISTORY,
                       Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.PLAY_TTS, Cmd.SET_NIGHT_RING,
                       Cmd.PERSONAL_REPORT, Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE, Cmd.SET_NIGHT_SERVICE, Cmd.VIEW_QUEUE,
                       Cmd.FORCE_LOCK, Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR,
                       Cmd.LEAVE, Cmd.SKILL_MONITOR, Cmd.PARK, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.302");
        }
    },

    /**
     * 内部呼出通话303
     */
    callInTalk :
    {
        stateCode : "303",
        name : WebAgent.I18n.getMsg("stateCode.303"),
        enableCmds : [ Cmd.MODIFY_PWD, Cmd.HANG_UP, Cmd.HOLD, Cmd.SHOW_BUSY, Cmd.MANUAL_ADJUST, Cmd.CONS, Cmd.MUTE,
                       Cmd.UNMUTE, Cmd.TRANSFER_VOICE, Cmd.RECEIVE_PHONE_NO, Cmd.SECOND_DIAL, Cmd.SSTRANSFER, Cmd.CONF,Cmd.SSCONF,
                       Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC, Cmd.SEND_NOTICE, Cmd.READ_NOTICE, Cmd.REQ_HELP,
                       Cmd.QUERY_HELP, Cmd.HANDLE_UNLOCK, Cmd.CALL_HISTORY, Cmd.RECENT_HISTORY, Cmd.CHAT_HISTORY,
                       Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.PLAY_TTS, Cmd.SET_NIGHT_RING,
                       Cmd.PERSONAL_REPORT, Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE, Cmd.SET_NIGHT_SERVICE, Cmd.VIEW_QUEUE,
                       Cmd.FORCE_LOCK, Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR,
                       Cmd.LEAVE, Cmd.SKILL_MONITOR, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.303");
        }
    },

    /**
     * 保持(304)
     */
    hold :
    {
        stateCode : "304",
        name : WebAgent.I18n.getMsg("stateCode.304"),
        enableCmds : [ Cmd.MODIFY_PWD, Cmd.SHOW_BUSY, Cmd.CANCEL_ADJUST, Cmd.RE_HOLD, Cmd.MAKE_CALL, Cmd.FAST_CALL,
                Cmd.HANG_UP, Cmd.MANUAL_ADJUST, Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC, Cmd.CALL_HELP,
                Cmd.SEND_NOTICE, Cmd.READ_NOTICE, Cmd.REQ_HELP, Cmd.QUERY_HELP, Cmd.HANDLE_UNLOCK, Cmd.CALL_HISTORY,
                Cmd.RECENT_HISTORY, Cmd.CHAT_HISTORY, Cmd.PERSONAL_REPORT, Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE,
                Cmd.SET_NIGHT_SERVICE, Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.SET_NIGHT_RING,
                Cmd.VIEW_QUEUE, Cmd.FORCE_LOCK, Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN, Cmd.PLACE_MONITOR, Cmd.LEAVE,
                Cmd.SYSTEM_MONITOR, Cmd.SKILL_MONITOR, Cmd.CANCEL_FULL_LISTEN, Cmd.FULL_LISTEN, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.304");
        }
    },

    /**
     * 保持并呼出(咨询)
     */
    holdAndPhone :
    {
        stateCode : "304",
        name : WebAgent.I18n.getMsg("stateCode.304"),
        enableCmds : [ Cmd.MODIFY_PWD, Cmd.HANG_UP, Cmd.TRANSFER, Cmd.SWITCH, Cmd.RECONNECT, Cmd.CANCEL_ADJUST,
                Cmd.MANUAL_ADJUST, Cmd.MUTE, Cmd.UNMUTE, Cmd.TRANSFER_VOICE, Cmd.RECEIVE_PHONE_NO, Cmd.SECOND_DIAL,
                Cmd.CONF, Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC, Cmd.SEND_NOTICE, Cmd.READ_NOTICE, Cmd.REQ_HELP,
                Cmd.QUERY_HELP, Cmd.HANDLE_UNLOCK, Cmd.CALL_HISTORY, Cmd.RECENT_HISTORY, Cmd.CHAT_HISTORY,
                Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.PLAY_TTS, Cmd.SET_NIGHT_RING,
                Cmd.PERSONAL_REPORT, Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE, Cmd.SET_NIGHT_SERVICE, Cmd.VIEW_QUEUE,
                Cmd.FORCE_LOCK, Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR,
                Cmd.LEAVE, Cmd.SKILL_MONITOR, Cmd.CANCEL_FULL_LISTEN, Cmd.FULL_LISTEN, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.304");
        }
    },

    /**
     * 会议(305)
     */
    conference :
    {
        stateCode : "305",
        name : WebAgent.I18n.getMsg("stateCode.305"),
        enableCmds : [ Cmd.MODIFY_PWD, Cmd.HANG_UP, Cmd.SHOW_BUSY, Cmd.CANCEL_ADJUST, Cmd.MANUAL_ADJUST, Cmd.MUTE,
                Cmd.UNMUTE, Cmd.CONF,Cmd.SSCONF, Cmd.SET_ALLOW_SPEAK, Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC,
                Cmd.SEND_NOTICE, Cmd.READ_NOTICE, Cmd.REQ_HELP, Cmd.QUERY_HELP, Cmd.HANDLE_UNLOCK, Cmd.CALL_HISTORY,
                Cmd.RECENT_HISTORY, Cmd.CHAT_HISTORY, Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT,
                Cmd.SET_NIGHT_RING, Cmd.PERSONAL_REPORT, Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE,
                Cmd.SET_NIGHT_SERVICE, Cmd.VIEW_QUEUE, Cmd.FORCE_LOCK, Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN,
                Cmd.LEAVE, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR, Cmd.SKILL_MONITOR, Cmd.CANCEL_FULL_LISTEN,
                Cmd.FULL_LISTEN, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.305");
        }
    },

    /**
     * 咨询306,307,308
     */
    consult :
    {
        stateCode : "306",
        name : WebAgent.I18n.getMsg("stateCode.306"),
        enableCmds : [ Cmd.MODIFY_PWD, Cmd.HANG_UP, Cmd.TRANSFER, Cmd.SWITCH, Cmd.RECONNECT, Cmd.CANCEL_ADJUST,
                Cmd.MANUAL_ADJUST, Cmd.MUTE, Cmd.UNMUTE, Cmd.TRANSFER_VOICE, Cmd.RECEIVE_PHONE_NO, Cmd.SECOND_DIAL,
                Cmd.CONF, Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC, Cmd.SEND_NOTICE, Cmd.READ_NOTICE, Cmd.REQ_HELP,
                Cmd.QUERY_HELP, Cmd.HANDLE_UNLOCK, Cmd.CALL_HISTORY, Cmd.RECENT_HISTORY, Cmd.CHAT_HISTORY,
                Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.PLAY_TTS, Cmd.SET_NIGHT_RING,
                Cmd.PERSONAL_REPORT, Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE, Cmd.SET_NIGHT_SERVICE, Cmd.VIEW_QUEUE,
                Cmd.FORCE_LOCK, Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR,
                Cmd.LEAVE, Cmd.SKILL_MONITOR, Cmd.CANCEL_FULL_LISTEN, Cmd.FULL_LISTEN, Cmd.ALTERNATE, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.306");
        }
    },

    /**
     * 内部咨询307
     */
    inConsult :
    {
        stateCode : "307",
        name : WebAgent.I18n.getMsg("stateCode.307"),
        enableCmds : [],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.307");
        }
    },

    /**
     * 外部咨询308
     */
    rmtConsult :
    {
        stateCode : "308",
        name : WebAgent.I18n.getMsg("stateCode.308"),
        enableCmds : [],
        begin : function(stateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.308");
        }
    },

    /**
     * 插话309
     */
    chimeIn :
    {
        stateCode : "309",
        name : WebAgent.I18n.getMsg("stateCode.309"),
        enableCmds : [ Cmd.MODIFY_PWD, Cmd.SETTING, Cmd.HANG_UP, Cmd.SHOW_BUSY, Cmd.CANCEL_ADJUST, Cmd.MANUAL_ADJUST,
                Cmd.MUTE, Cmd.UNMUTE, Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC, Cmd.SEND_NOTICE, Cmd.READ_NOTICE,
                Cmd.REQ_HELP, Cmd.QUERY_HELP, Cmd.HANDLE_UNLOCK, Cmd.CALL_HISTORY, Cmd.RECENT_HISTORY,
                Cmd.CHAT_HISTORY, Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.SET_NIGHT_RING,
                Cmd.PERSONAL_REPORT, Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE, Cmd.SET_NIGHT_SERVICE, Cmd.VIEW_QUEUE,
                Cmd.COACH, Cmd.FORCE_LOCK, Cmd.SET_KEY_RECORD, Cmd.REAL_TIME_QC, Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN,
                Cmd.LEAVE, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR, Cmd.SKILL_MONITOR, Cmd.CANCEL_FULL_LISTEN,
                Cmd.FULL_LISTEN, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.309");
        }
    },

    /**
     * 监听310
     */
    listen :
    {
        stateCode : "310",
        name : WebAgent.I18n.getMsg("stateCode.310"),
        enableCmds : [ Cmd.MODIFY_PWD, Cmd.HANG_UP, Cmd.SHOW_BUSY, Cmd.MANUAL_ADJUST, Cmd.MUTE, Cmd.UNMUTE,
                Cmd.MAKE_CALL, Cmd.FAST_CALL, Cmd.MEDIA, Cmd.QC, Cmd.COACH, Cmd.FORCE_LOCK, Cmd.FORCE_HANGUP,
                Cmd.SET_KEY_RECORD, Cmd.LISTEN_TO_CHIPIN, Cmd.REAL_TIME_QC, Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN,
                Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR, Cmd.SKILL_MONITOR, Cmd.WEB_CHAT_ON, Cmd.WEB_CHAT_OFF, Cmd.LEAVE,
                Cmd.CANCEL_FULL_LISTEN, Cmd.FULL_LISTEN, Cmd.SEND_NOTICE, Cmd.READ_NOTICE, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.310");
        }
    },

    /**
     * webcall 311
     */
    webCall :
    {
        stateCode : "311",
        name : WebAgent.I18n.getMsg("stateCode.311"),
        enableCmds : [ Cmd.SETTING, Cmd.WEB_CHAT_OFF, Cmd.WEB_CHAT_ON, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.311");
        }
    },

    /**
     * 呼入振铃312
     */
    ring :
    {
        stateCode : "312",
        name : WebAgent.I18n.getMsg("stateCode.312"),
        enableCmds : [ Cmd.HANG_UP, Cmd.WEB_CHAT_OFF, Cmd.WEB_CHAT_ON, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.312");
        }
    },

    /**
     * 呼出振铃313
     */
    callWait :
    {
        stateCode : "313",
        name : WebAgent.I18n.getMsg("stateCode.313"),
        enableCmds : [ Cmd.HANG_UP, Cmd.MANUAL_ADJUST, Cmd.SETTING, Cmd.WEB_CHAT_OFF, Cmd.WEB_CHAT_ON,
                Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC, Cmd.SEND_NOTICE, Cmd.READ_NOTICE, Cmd.REQ_HELP,
                Cmd.QUERY_HELP, Cmd.HANDLE_UNLOCK, Cmd.CALL_HISTORY, Cmd.RECENT_HISTORY, Cmd.CHAT_HISTORY,
                Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.SET_NIGHT_RING, Cmd.PERSONAL_REPORT,
                Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE, Cmd.SET_NIGHT_SERVICE, Cmd.VIEW_QUEUE, Cmd.FORCE_LOCK,
                Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR, Cmd.SKILL_MONITOR,
                Cmd.CANCEL_FULL_LISTEN, Cmd.FULL_LISTEN, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.313");
        }
    },

    /**
     * 排队选中 314
     */
    queueLock :
    {
        stateCode : "314",
        name : WebAgent.I18n.getMsg("stateCode.314"),
        enableCmds : [],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.314");
        }
    // this.ring.enableCmds
    },

    /**
     * 排队占用 316
     */
    queue :
    {
        stateCode : "316",
        name : WebAgent.I18n.getMsg("stateCode.316"),
        enableCmds : [],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.316");
        }
    // this.ring.enableCmds
    },

    /**
     * CTI选中 315
     */
    ctiSelected :
    {
        stateCode : "315",
        name : WebAgent.I18n.getMsg("stateCode.315"),
        enableCmds : [],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.315");
        }
    // this.ring.enableCmds
    },

    /**
     * 正在报工号(等待应答)
     */
    reportWorkNum :
    {
        name : WebAgent.I18n.getMsg("state.busy.reportWorkNum"),
        enableCmds : [ Cmd.HANG_UP, Cmd.MANUAL_ADJUST, Cmd.SETTING, Cmd.WEB_CHAT_OFF, Cmd.WEB_CHAT_ON,
                Cmd.CANCEL_FULL_LISTEN, Cmd.FULL_LISTEN, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("state.busy.reportWorkNum");
        }
    },

    /**
     * 教练317
     */
    coach :
    {
        stateCode : "317",
        name : WebAgent.I18n.getMsg("stateCode.317"),
        enableCmds : [ Cmd.MODIFY_PWD, Cmd.LOGOUT, Cmd.EXIT, Cmd.HANG_UP, Cmd.SHOW_BUSY, Cmd.IDLE, Cmd.CANCEL_ADJUST,
                Cmd.MANUAL_ADJUST, Cmd.APPOINT_AGT_PROC, Cmd.APPOINT_MEDIA_PROC, Cmd.SEND_NOTICE, Cmd.READ_NOTICE,
                Cmd.REQ_HELP, Cmd.QUERY_HELP, Cmd.HANDLE_UNLOCK, Cmd.CALL_HISTORY, Cmd.RECENT_HISTORY,
                Cmd.CHAT_HISTORY, Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.SET_NIGHT_RING,
                Cmd.PERSONAL_REPORT, Cmd.APPROVE_PERSONAL_REPORT, Cmd.NOTICE, Cmd.SET_NIGHT_SERVICE, Cmd.VIEW_QUEUE,
                Cmd.FORCE_LOCK, Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR,
                Cmd.LEAVE, Cmd.SKILL_MONITOR, Cmd.CANCEL_FULL_LISTEN, Cmd.FULL_LISTEN, Cmd.STOP_COACH, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.317");
        }
    },

    /**
     * 整理态400,401,402
     */
    adjust :
    {
        stateCode : "400",
        name : WebAgent.I18n.getMsg("stateCode.400"),
        enableCmds : [ Cmd.SHOW_BUSY, Cmd.IDLE, Cmd.LOGOUT, Cmd.MAKE_CALL, Cmd.EXIT, Cmd.MODIFY_PWD, Cmd.CANCEL_ADJUST,
                Cmd.SETTING, Cmd.PLAY_REC, Cmd.WEB_CHAT_OFF, Cmd.WEB_CHAT_ON, Cmd.FAST_CALL, Cmd.FORCE_HANGUP,
                Cmd.COACH, Cmd.SERVICE, Cmd.MEDIA, Cmd.HANDLE_LEAVE, Cmd.QC, Cmd.CALL_HELP, Cmd.LEAVE,
                Cmd.HANDLE_UNLOCK, Cmd.FORCE_BUSY, Cmd.FORCE_IDLE, Cmd.FORCE_SIGNOUT, Cmd.SET_NIGHT_RING,
                Cmd.VIEW_QUEUE, Cmd.SCREEN_MONITOR, Cmd.RECORD_SCREEN, Cmd.PLACE_MONITOR, Cmd.SYSTEM_MONITOR,
                Cmd.SKILL_MONITOR, Cmd.INTERCEPT, Cmd.LISTEN, Cmd.CHIP_IN, Cmd.FORCE_LOCK, Cmd.SEND_NOTICE,
                Cmd.READ_NOTICE, Cmd.CANCEL_FULL_LISTEN, Cmd.FULL_LISTEN, Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE ],
        begin : function(curStateCode, pevStateCode)
        {
            this.name = WebAgent.I18n.getMsg("stateCode.400");
        }
    },

    /**
     * 平台切换(自定义-100)
     */
    masterChanged :
    {
        stateCode : -100,
        name : WebAgent.I18n.getMsg("state.null.masterChanged"),
        enableCmds : [],
        begin : function()
        {
            this.name = WebAgent.I18n.getMsg("state.null.masterChanged");
        }
    }
};

WebAgent.State.inConsult.enableCmds = WebAgent.State.consult.enableCmds;
WebAgent.State.rmtConsult.enableCmds = WebAgent.State.consult.enableCmds;

WebAgent.State.queueLock.enableCmds = WebAgent.State.ring.enableCmds;
WebAgent.State.queue.enableCmds = WebAgent.State.ring.enableCmds;
WebAgent.State.ctiSelected.enableCmds = WebAgent.State.ring.enableCmds;
