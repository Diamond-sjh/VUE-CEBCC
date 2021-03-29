/**
 * 按钮切换管理（静音<=>取消静音、示忙<=>示闲、保持<=>取保持、
 * 应答<=>挂机、录音<=>停止录音、整理<=>取消整理、
 * 学习/取消学习，媒体/取消媒体）
 */
(function()
{
    var State = WebAgent.State;
    var EventHelper = WebAgent.EventHelper;
    var preIdleFlag = false; //预示闲标记
    var preBusyFlag = false; //预示忙标记

    // 定义按钮切换管理器
    BtnSwitchManager =
    {
        isRec : false,/* 是否正在录音 */

        init : function()
        {
            this.initHoldBtnSwitch();
            this.initBusyBtnSwitch();
            this.initMute();
            this.initAdjuest();
            this.initMedia();
            this.initLearning();
            // this.initAnwserBtnSwitch();
            // this.initRec();
            this.initMediaBusyAndIdleBtnSwitch();
        },

        /**
         * 静音<=>取消静音
         * 
         * @return
         */
        initMute : function()
        {
            var eh = new WebAgent.EventHelper();

            /* Command[Cmd.MUNT]自定义事件 */
            eh.regEvent("OnSetMuteSucc", function(isMute)
            {
                if (isMute)// boolean true=当前静音，
                {
                    WebAgent.switchTo(Cmd.MUTE, Cmd.UNMUTE);
                    WebAgent.refBtn(Cmd.UNMUTE);
                }
                else
                {
                    WebAgent.switchTo(Cmd.UNMUTE, Cmd.MUTE);
                    WebAgent.refBtn(Cmd.MUTE);
                }
            }, this);
        },

        /**
         * 整理<=>取消整理
         * 
         * @return
         */
        initAdjuest : function()
        {
            var eh = new WebAgent.EventHelper();

            /* 状态切换，OnStateChanged是自定义事件在StateManager中触发 */
            eh.regEvent("OnStateChanged", function(state)
            {
                if (state == State.adjust)
                {
                    WebAgent.switchTo(Cmd.MANUAL_ADJUST, Cmd.CANCEL_ADJUST);
                    WebAgent.refBtn(Cmd.CANCEL_ADJUST);
                }
                else
                {
                    WebAgent.switchTo(Cmd.CANCEL_ADJUST, Cmd.MANUAL_ADJUST);
                    WebAgent.refBtn(Cmd.MANUAL_ADJUST);
                }
            }, this);
        },
        
        /**
         * 媒体<=>取消媒体
         * 
         * @return
         */
        initMedia : function()
        {
            var eh = new WebAgent.EventHelper();

            /* 状态切换，OnStateChanged是自定义事件在StateManager中触发 */
            eh.regEvent("OnStateChanged", function(state)
            {
                if (state == State.media)
                {
                    WebAgent.switchTo(Cmd.MEDIA, Cmd.CANCEL_MEDIA);
                    WebAgent.refBtn(Cmd.CANCEL_MEDIA);
                }
                else
                {
                    WebAgent.switchTo(Cmd.CANCEL_MEDIA, Cmd.MEDIA);
                    WebAgent.refBtn(Cmd.MEDIA);
                }
            }, this);
        },
        
        /**
         * 学习/取消学习
         */
        initLearning : function()
        {
            var eh = new WebAgent.EventHelper();

            /* 状态切换，OnStateChanged是自定义事件在StateManager中触发 */
            eh.regEvent("OnStateChanged", function(state)
            {
                if (state == State.learning)
                {
                    WebAgent.switchTo(Cmd.LEARN, Cmd.CANCEL_LEARN);
                    WebAgent.refBtn(Cmd.CANCEL_LEARN);
                }
                else
                {
                    WebAgent.switchTo(Cmd.CANCEL_LEARN, Cmd.LEARN);
                    WebAgent.refBtn(Cmd.LEARN);
                }
            }, this);
        },

        /**
         * 录音<=>停止录音
         * 
         * @return
         */
        initRec : function()
        {
            var eh = new WebAgent.EventHelper();

            eh.regEvent("OnBeginRecordSuccess", function()
            {
                this.isRec = true;
                WebAgent.switchTo(Cmd.RECORD, Cmd.STOP_RECORD);
                WebAgent.refBtn(Cmd.STOP_RECORD);
                if (this.agent.isWholeRecord())
                {
                    var obj = this;
                    setTimeout(function()
                    {
                        obj.UI.disableBtnByCmds([ Cmd.STOP_RECORD, Cmd.RECORD ]);
                    }, 100);
                }
            }, this);

            eh.regEvent("OnRecordEvent", function()
            {
                this.isRec = false;
                WebAgent.switchTo(Cmd.STOP_RECORD, Cmd.RECORD);
                WebAgent.refBtn(Cmd.RECORD);
                if (this.agent.isWholeRecord())
                {
                    var obj = this;
                    setTimeout(function()
                    {
                        obj.UI.disableBtnByCmds([ Cmd.STOP_RECORD, Cmd.RECORD ]);
                    }, 100);
                }
            }, this);

            /* 状态切换，OnStateChanged是自定义事件在StateManager中触发 */
            eh.regEvent("OnStateChanged", function(state)
            {
                if (this.isRec && this.agent.isCalling())
                {
                    WebAgent.switchTo(Cmd.RECORD, Cmd.STOP_RECORD);
                    WebAgent.refBtn(Cmd.STOP_RECORD);
                }
                else
                {
                    this.isRec = false;
                    WebAgent.switchTo(Cmd.STOP_RECORD, Cmd.RECORD);
                    WebAgent.refBtn(Cmd.RECORD);
                }

                if (this.agent.isWholeRecord())
                {
                    var obj = this;
                    setTimeout(function()
                    {
                        obj.UI.disableBtnByCmds([ Cmd.STOP_RECORD, Cmd.RECORD ]);
                    }, 100);
                }
            }, this);
        },

        /**
         * 保持<=>取消保持
         */
        initHoldBtnSwitch : function()
        {
            var eh = new WebAgent.EventHelper();

            /* 保持成功 */
            eh.regEvent("OnHoldSuccess", function()
            {
                WebAgent.switchTo(Cmd.HOLD, Cmd.RE_HOLD);
                WebAgent.refBtn(Cmd.RE_HOLD);
            }, this);

            /* 取消保持成功 */
            eh.regEvent("OnRetrieveHoldSuccess", function()
            {
                WebAgent.switchTo(Cmd.RE_HOLD, Cmd.HOLD);
                WebAgent.refBtn(Cmd.HOLD);
            }, this);

            /* 被保持用户挂机 */
            eh.regEvent("OnHoldCallRelease", function()
            {
                WebAgent.switchTo(Cmd.RE_HOLD, Cmd.HOLD);
                WebAgent.refBtn(Cmd.HOLD);
            }, this);

            /* 会议中有人主持人挂机 */
            eh.regEvent("OnHangupCallInConf", function()
            {
                /* if(isConfMaster){ } */
            }, this);

            /* 状态切换，OnStateChanged是自定义事件在StateManager中触发 */
            eh.regEvent("OnStateChanged", function(state)
            {
                if (state == State.hold)
                {
                    WebAgent.switchTo(Cmd.HOLD, Cmd.RE_HOLD);
                    WebAgent.refBtn(Cmd.RE_HOLD);
                }
                else
                {
                    WebAgent.switchTo(Cmd.RE_HOLD, Cmd.HOLD);
                    WebAgent.refBtn(Cmd.HOLD);
                }
            }, this);
        },

        /**
         * 示忙<=>示闲
         */
        initBusyBtnSwitch : function()
        {
            var thisobj = this;
            var eh = new WebAgent.EventHelper();

			// [预示闲] 自定义消息
			eh.regEvent("OnSetPreIdleSuccess", function()
            {
            	preIdleFlag = true;
                WebAgent.switchTo(Cmd.IDLE, Cmd.SHOW_BUSY);
                WebAgent.refBtn(Cmd.SHOW_BUSY);
            }, this);
            
            // [预示忙] 自定义消息
			eh.regEvent("OnSetPreBusySuccess", function()
            {
            	preBusyFlag = true;
                WebAgent.switchTo(Cmd.SHOW_BUSY, Cmd.IDLE);
                WebAgent.refBtn(Cmd.IDLE);
            }, this);
            
            eh.regEvent("OnSetBusySuccess", function()
            {
                WebAgent.switchTo(Cmd.SHOW_BUSY, Cmd.IDLE);
                WebAgent.refBtn(Cmd.IDLE);
            }, this);

            eh.regEvent("OnForceBusy", function()
            {
                WebAgent.switchTo(Cmd.SHOW_BUSY, Cmd.IDLE);
                WebAgent.refBtn(Cmd.IDLE);
            }, this);

            eh.regEvent("OnForceIdle", function()
            {
                WebAgent.switchTo(Cmd.IDLE, Cmd.SHOW_BUSY);
                WebAgent.refBtn(Cmd.SHOW_BUSY);
            }, this);

            /* 状态切换，OnStateChanged是自定义事件在StateManager中触发 */
            eh.regEvent("OnStateChanged", function(state)
            {
                var ps = WebAgent.getPevState();
                if((state==State.showBusy) || (state==State.free))
                {
                    preIdleFlag = false ; 
    				preBusyFlag = false ; 
                }
                
                if(preIdleFlag || preBusyFlag)
                {
                	WebAgent.refBtn((preBusyFlag)?Cmd.IDLE : Cmd.SHOW_BUSY);
                	return;
                }
                
                if ((state == State.showBusy) || (state == State.adjust) || (state == State.media))
                {
                    WebAgent.switchTo(Cmd.SHOW_BUSY, Cmd.IDLE);
                    WebAgent.refBtn(Cmd.IDLE);
                }
                else if ((ps == State.showBusy) && (state == State.preCall))
                {
                    return;
                }
                else
                {
                	WebAgent.switchTo(Cmd.IDLE, Cmd.SHOW_BUSY);
                    WebAgent.refBtn(Cmd.SHOW_BUSY);
                }
            }, this);
        },
        
        /**
         * 媒体示忙<=>媒体示闲
         */
        initMediaBusyAndIdleBtnSwitch : function()
        {
            var eh = new WebAgent.EventHelper();
            
            // 切换
            eh.regEvent("OnMediaAbilityEvent", function(type, value, cause, param)
            {
                var intVal = parseInt(value, 10);
                if (1 <= intVal &&  intVal <= 999) // 关闭
                {
                    WebAgent.switchTo(Cmd.MEDIA_BUSY, Cmd.MEDIA_IDLE);
                    WebAgent.refBtn(Cmd.MEDIA_IDLE);
                }
                else if (1001 <= intVal && intVal <= 1999)// 打开
                {
                    WebAgent.switchTo(Cmd.MEDIA_IDLE, Cmd.MEDIA_BUSY);
                    WebAgent.refBtn(Cmd.MEDIA_BUSY);
                }
            });
            //WebAgent.invoker("SetMediaStatus", [2, 999, 0, ""]);
        },

        /**
         * 应答<=>挂机
         */
        initAnwserBtnSwitch : function()
        {
            var eh = new WebAgent.EventHelper();

        },

        /**
         * 聊天上线 <=> 聊天离线
         * 
         * @return
         */
        initWebChat : function()
        {
            var eh = new WebAgent.EventHelper();
            eh.regEvent("OnSetChatStatus", function(status)
            {
                if (status == "on")
                {
                    WebAgent.switchTo(Cmd.WEB_CHAT_ON, Cmd.WEB_CHAT_OFF);
                    WebAgent.refBtn(Cmd.WEB_CHAT_OFF);
                }
                else
                {
                    WebAgent.switchTo(Cmd.WEB_CHAT_OFF, Cmd.WEB_CHAT_ON);
                    WebAgent.refBtn(Cmd.WEB_CHAT_ON);
                }
            }, this);
            //this.agent.invoker("SetChatStatus", "status=1");
        },

        /**
         * 根据命令，刷新按钮状态显示
         * 
         * @param cmd {String}
         * @return {boolean}
         */
        refBtnStateByCmd : function(cmd)
        {
            var cmds = this.agent.getCurEnableCmds();
            for ( var i = 0; i < cmds.length; i++)
            {
                if (cmds[i] == cmd)
                {
                    this.UI.enableBtnByCmds([ cmd ]);
                    return true;
                }
            }

            this.UI.disableBtnByCmds([ cmd ]);
            return false;
        }
    };

    // 登录成功后，初始化按钮管理器
    WebAgent.ready(function()
    {
        WebAgent.btnSwitch = BtnSwitchManager;
        WebAgent.btnSwitch.init(WebAgent);
    });

})(WebAgent);