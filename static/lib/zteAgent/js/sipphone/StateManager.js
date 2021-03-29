/**
 * 状态管理器
 * 
 * @requires State(js\agent\State.js)
 */
WebAgent.StateManager = function(agent)
{
    this.agent = WebAgent;
    this.curState = null; // 当前状态
    this.pevState = null; // 上次状态
    this.eh = new WebAgent.EventHelper();
    var thisobj = this;

    this.eh.regEvent("OnCTIAgentStateChanged", this.OnCTIAgentStateChanged, this);
    this.eh.regEvent("OnMasterChanged", this.OnMasterChanged, this);
    this.eh.regEvent("OnCtiReport", this.OnCtiReport, this);
};

var State = WebAgent.State;
WebAgent.StateManager.prototype =
{
    stateMap :
    {
        /**
         * AgentNull
         */
        "1" : State.logout, // 注销
        "2" : State.logout,// 下班
        "3" : State.logout,// 自动退出

        /**
         * AgentNotReady
         */
        "100" : State.logon, // 登录后的状态（登录）
        "101" : State.logon, // 登录后的状态（上班）
        "102" : State.leave, // 请假， SetRest话务员主动申请离席、休息、请假并得到批准
        "103" : State.lock, // 锁定，SetLock话务员由于就叫不应等原因造成的系统自动将该座席锁定
        "104" : State.lock, // 强锁，ForceLock班长强制将该座席锁定
        "105" : State.showBusy, // 示忙,SetBusy 正常的呼叫结束后、或者事后处理后
        "106" : State.showBusy, // 强制示忙 ForceBusy
        "107" : State.preCall, // 预呼 setPreCall
        "108" : State.media,// 媒体处理,SetMediaWork
        "109" : State.quality,// 质检状态 SetCheckWork
        "110" : State.webCall,// WEBCALL状态
        "111" : State.learning,// 学习状态，不能进行除签出和停止学习外的其它操作

        /**
         * AgentReady
         */
        "200" : State.free,
        "201" : State.free, // 强制示闲
        "202" : State.free, // 主动示闲
        "203" : State.free, // 自动示闲
        "204" : State.free, // 强拆

        /**
         * AgentBusy
         */
        "300" : State.userCallInTalk, // 接入用户通话
        "301" : State.inTalk,// 内部通话
        "302" : State.callOutTalk, // 外部呼出
        "303" : State.callInTalk,// 内部呼出
        "304" : State.hold,// 保持
        "305" : State.conference,// 会议（三方通话、单步会议）
        "306" : State.consult,// 咨询
        "307" : State.inConsult,// 内部咨询
        "308" : State.rmtConsult,// 远端咨询
        "309" : State.chimeIn,// 插话
        "310" : State.listen,// 监听
        "311" : State.webCall,// WEBCALL通话
        "312" : State.ring,// 呼入振铃
        "313" : State.callWait, // 呼出振铃
        "314" : State.queueLock, // 排队选中，等待呼入
        "315" : State.ctiSelected,// CTI选中，等待座席呼入
        "316" : State.queue,// 外呼排队占用
        "317" : State.coach,// 教练

        /**
         * AgentWorkAfter
         */
        "400" : State.adjust, // 整理态
        "401" : State.adjust,// 整理态
        "402" : State.adjust, // 调整态
        "null" : null
    },

    /**
     * 状态改变事件
     * 
     * @param stateCode {Integer} 当前状态
     * @param laststateCode {Integer} 上一次状态
     * @param cause {Integer} 原因
     * @param Param {String} 保留字
     */
    OnCTIAgentStateChanged : function(stateCode, laststateCode, cause, Param)
    {
        var _state = this.stateMap[stateCode];
        if (_state)
        {
            _state.stateCode = stateCode;
            _state.pevStateCode = laststateCode;
            this.changedState(_state);
        }
        else
        {
            WebAgent.error(stateCode + " 对应的状态未定义！");
        }
    },

    /**
     * 平台被切换
     */
    OnMasterChanged : function()
    {
        var thisobj = this;
        WebAgent.isCalling(function(isCall)
        {
            var state = WebAgent.State.masterChanged;
            state.enableCmds = (isCall) ? [ Cmd.HANG_UP ] : [];
            thisobj.changedState(state);
        });
    },

    /**
     * cti事件，当type=1时表示座席被CTI强制迁出
     */
    OnCtiReport : function(type, param)
    {
        if ((type + "") == "1")
        {
            var state = WebAgent.State.logout;
            this.changedState(state);
        }
    },

    /**
     * 改变状态
     * 
     * @return
     */
    changedState : function(_state)
    {
        this.pevState = this.curState;
        this.curState = _state;
        if (this.pevState && this.pevState.end) this.pevState.end(this.agent);
        if (_state && _state.begin) _state.begin(this.agent);

        /* 获取可用的A接口方法(该需求已经取消) */
        // _state.enableAinfMethod =
        // WebAgent.getAinfMethodByCmd(_state.enableCmds);
        _state.enableAinfMethod = WebAgent.getAinfMethodBySate(_state);

        /* 自定义事件，广播事件改变的消息 */
        WebAgent.EventHelper.notify("OnStateChanged", [ this.curState ]);
    },

    /**
     * 同步当前状态
     * 
     * @return
     */
    syncCurState : function(fun)
    {
        var thisobj = this;
        WebAgent.getCurStatusCode(function(stateCode)
        {
            var _state = thisobj.stateMap[stateCode];
            if (_state)
            {
                _state.stateCode = stateCode;
                thisobj.changedState(_state);
                WebAgent.info("Successful synchronization status,statusCode = " + stateCode);
            }
            else
            {
                WebAgent.error("Synchronization status failed,statusCode =" + stateCode);
            }

            if (fun) fun(_state);
        });

    },
    /**
     * 同步当前状态
     * 
     * @return
     */
    syncCurStateByStateCode : function(stateCode,fun)
    {
        var thisobj = this;
        var _state = thisobj.stateMap[stateCode];
        if (_state)
        {
             _state.stateCode = stateCode;
             thisobj.changedState(_state);
             WebAgent.info("syncCurStateByStateCode:Successful synchronization status,statusCode = " + stateCode);
        }
        else
        {
            WebAgent.error("syncCurStateByStateCode:Synchronization status failed,statusCode =" + stateCode);
        }

        if (fun) fun(_state);
    }
    
    
};
