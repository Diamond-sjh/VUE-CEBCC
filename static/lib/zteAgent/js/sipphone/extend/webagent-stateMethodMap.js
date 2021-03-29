/**
 * 状态、A接口方法映射关系，状态切换时，用于获取当前状态下可用的A接口方法。
 * 扩展WebAgent对象，提供getAinfMethodBySate(),getAinfMethodByCmd()方法。
 */
(function(WebAgent)
{
    /**
     * 状态、A接口方法映射
     */
    var State = WebAgent.State;

    // 未登录
    State.notLogin.enableAinfMethod = [];

    // 迁出态
    State.logout.enableAinfMethod = [];

    // 空闲态
    State.free.enableAinfMethod = [ "method1,method2,method3".split(",") ];
    
    // 示忙态
    State.showBusy.enableAinfMethod = ["m1,m2,m3,m4".split(",")];

    // 签入，服务态
    State.logon.enableAinfMethod = [];

    // 离开态
    State.leave.enableAinfMethod = [];

    // 锁定态
    State.lock.enableAinfMethod = [];

    // 预呼态
    State.preCall.enableAinfMethod = [];

    // 媒体态
    State.media.enableAinfMethod = [];

    // 质检
    State.quality.enableAinfMethod = [];

    // webCall
    State.webCall.enableAinfMethod = [];

    // 学习
    State.learning.enableAinfMethod = [];

    // 保持
    State.hold.enableAinfMethod = [];

    // 保持并呼出(咨询)
    State.holdAndPhone.enableAinfMethod = [];

    // 会议
    State.conference.enableAinfMethod = [];

    // 咨询
    State.consult.enableAinfMethod = [];

    // 插话
    State.chimeIn.enableAinfMethod = [];

    // 监听
    State.listen.enableAinfMethod = [];

    // 呼入振铃
    State.ring.enableAinfMethod = [];

    // 呼出振铃
    State.callWait.enableAinfMethod = [];

    // 教练
    State.coach.enableAinfMethod = [];

    // 整理态
    State.adjust.enableAinfMethod = [];

    // 平台切换
    State.masterChanged.enableAinfMethod = [];

    /**
     * Cmd命令、A接口方法映射关系。
     */
    var cmdMethodMap = {};

    // 服务
    cmdMethodMap[Cmd.SERVICE] = [];

    // 示忙
    cmdMethodMap[Cmd.SHOW_BUSY] = [];

    // 示闲
    cmdMethodMap[Cmd.IDLE] = [ "qrh1,qrh2,qrh3".split(",") ];

    // 呼出
    cmdMethodMap[Cmd.MAKE_CALL] = [ "call1,call2".split(",") ];

    // 挂机
    cmdMethodMap[Cmd.HANG_UP] = [];

    // 保持
    cmdMethodMap[Cmd.HOLD] = [];

    // 取保持
    cmdMethodMap[Cmd.RE_HOLD] = [];

    // 整理
    cmdMethodMap[Cmd.MANUAL_ADJUEST] = [];

    // 取消整理
    cmdMethodMap[Cmd.CANCEL_ADJUST] = [];

    // 静音
    cmdMethodMap[Cmd.MUTE] = [];

    // 取消静音
    cmdMethodMap[Cmd.UNMUTE] = [];

    // 录音
    cmdMethodMap[Cmd.RECORD] = [];

    // 停止录音
    cmdMethodMap[Cmd.STOP_RECORD] = [];

    // 转移
    cmdMethodMap[Cmd.TRANSFER] = [];

    // 单步转移
    cmdMethodMap[Cmd.SSTRANSFER] = [];

    // 会议
    cmdMethodMap[Cmd.CONF] = [];

    // 单步会议
    cmdMethodMap[Cmd.SSCONF] = [];

    // 登出
    cmdMethodMap[Cmd.LOGOUT] = [];

    // 签入
    cmdMethodMap[Cmd.SIGNIN] = [];

    // 咨询
    cmdMethodMap[Cmd.CONS] = [];

    // 申请解锁
    cmdMethodMap[Cmd.REQ_UNLOCK] = [];

    // 拦截
    cmdMethodMap[Cmd.INTERCEPT] = [];

    // 监听
    cmdMethodMap[Cmd.LISTEN] = [];

    // 退出
    cmdMethodMap[Cmd.EXIT] = [];

    // 修改密码
    cmdMethodMap[Cmd.MODIFY_PWD] = [];

    // 强制示忙
    cmdMethodMap[Cmd.FORCE_BUSY] = [];

    // 强制示闲
    cmdMethodMap[Cmd.FORCE_IDLE] = [];

    // 强制迁出
    cmdMethodMap[Cmd.FORCE_SIGNOUT] = [];
    cmdMethodMap[Cmd.SILENT] = [];
    cmdMethodMap[Cmd.WEB_CHAT_ON] = [];
    cmdMethodMap[Cmd.WEB_CHAT_OFF] = [];
    cmdMethodMap[Cmd.PLAY_VIDEO] = [];
    cmdMethodMap[Cmd.PLAY_REC] = [];
    cmdMethodMap[Cmd.PLAY_RECENT_REC] = [];
    cmdMethodMap[Cmd.CAPTURE_SCREEN] = [];
    cmdMethodMap[Cmd.SEND_CAP_SCR] = [];
    cmdMethodMap[Cmd.STOP_SEND_CAP_SCR] = [];
    cmdMethodMap[Cmd.SETTING] = [];
    cmdMethodMap[Cmd.MEDIA] = [];
    cmdMethodMap[Cmd.FAST_CALL] = [];
    cmdMethodMap[Cmd.PLAY_TTS] = [];
    cmdMethodMap[Cmd.NIGHT_RING] = [];
    cmdMethodMap[Cmd.RE_CALL] = [];
    cmdMethodMap[Cmd.QC] = [];
    cmdMethodMap[Cmd.SET_RIGHT_CMD_MAP] = [];

    /**
     * WebAgent扩展
     */
    WebAgent.extend(
    {
        cmdMethodMap_ : cmdMethodMap,

        /**
         * 获取指定状态下，可用的A接口方法。
         * 
         * @param {WebAgent.State.XXX}
         * @return {Array<String>}
         */
        getAinfMethodBySate : function(state)
        {
            return (!state.enableAinfMethod) ? [] : state.enableAinfMethod;
        },

        /**
         * 获取座席命令对应的A接口方法。
         * 
         * @param {Array}
         * @return {Array<String>}
         */
        getAinfMethodByCmd : function(cmds)
        {
            if (WebAgent.isArray(cmds))
            {
                var mtd = [];
                for ( var i = 0; i < cmds.length; i++)
                {
                    mtd = mtd.concat(this.cmdMethodMap_[cmds[i]]);
                }
                return mtd;
            }
            else
            {
                return this.cmdMethodMap_[cmds];
            }
        }
    });

})(WebAgent);