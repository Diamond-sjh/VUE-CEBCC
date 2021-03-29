/**
 * 按钮状态管理器，提供WebAgent.regBtn()、WebAgent.unRegBtn()方法
 */
(function(WebAgent)
{
    // 定义按钮管理器
    var BtnManager = function()
    {
        var thisobj = this;
        // 如果座席已经初始化成功，则直接初始化按钮管理器，否则等待座席初始化成功后再初始化
        if (WebAgent.isInit)
        {
            this.init();
        }
        else
        {
            WebAgent.onInit(function(isReady)
            {
                if (!thisobj.isInit) thisobj.init();
                while(thisobj.waitForRegBtns.length>0)
                {
                	var arg = thisobj.waitForRegBtns.shift();
                	thisobj.regBtn(arg.cmd,arg.btn);
                }
            });
        }
    };

    BtnManager.prototype =
    {
        eh : null,
        btnCmdMap : null,
        agent : null,
        isInit : false,
        waitForRegBtns : [], // 如果未初始化，则先暂时保持参数，待签入成功后调用regbtn()
        init : function()
        {
            if ((!WebAgent.isReInit) && (this.isInit)) return;
            this.isInit = true;

            this.btnCmdMap = {};
            this.disableAllBtn();
            this.eh = new WebAgent.EventHelper();
            this.eh.regEvent("OnStateChanged", function(state)
            {
                this.disableAllBtn();
                var cmds = state.enableCmds;
                var count = cmds.length * 1;
                for ( var i = 0; i < count; i++) // 这里的cmds的数组属性丢失，直接i<cmds.length出现异常，原因未知。
                {
                    var btns = this.btnCmdMap[cmds[i]];
                    if (btns)
                    {
                        for ( var k = 0; k < btns.length; k++)
                        {
                            try
                            {
                                btns[k].enable();
                            }
                            catch (e)
                            {
                                // alert(e);
                            }
                        }
                    }
                }
            }, this);
        },

        /**
         * 禁用所有按钮
         */
        disableAllBtn : function()
        {
            for ( var m in this.btnCmdMap)
            {
                var btns = this.btnCmdMap[m];
                if (!btns) continue;
                for ( var i = 0; i < btns.length; i++)
                {
                    try
                    {
                        btns[i].disable();
                    }
                    catch (e)
                    {
                    }
                }
            }
        },

        /**
         * 禁用按钮
         * 
         * @param cmd
         * @returns
         */
        disableBtn : function(cmd)
        {
            var btns = this.btnCmdMap[cmd];
            if (!btns) return;
            for ( var i = 0; i < btns.length; i++)
            {
                btns[i].disable();
            }
        },

        /**
         * 启用按钮
         * 
         * @param cmd
         * @returns
         */
        enableBtn : function(cmd)
        {
            var btns = this.btnCmdMap[cmd];
            if (!btns) return;
            for ( var i = 0; i < btns.length; i++)
            {
                btns[i].enable();
            }
        },

        /**
         * 根据命令，刷新按钮状态显示
         * 
         * @param cmd {String}
         * @return {boolean}
         */
        refBtn : function(cmd)
        {
            var state = WebAgent.getState();
            var cmds = (state) ? state.enableCmds : [];
            for ( var i = 0; i < cmds.length; i++)
            {
                if (cmds[i] == cmd)
                {
                    this.enableBtn(cmd);
                    return true;
                }
            }

            this.disableBtn(cmd);
            return false;
        },

        /**
         * 按钮切换
         * 
         * @param cmd1
         * @param cmd2
         * @returns
         */
        switchTo : function(cmd1, cmd2)
        {
            var arr = this.btnCmdMap[cmd1];
            arr = (!arr) ? [] : arr;
            for ( var i = 0; i < arr.length; i++)
            {
                try
                {
                    var newBtn = arr[i].switchTo(cmd2);
                    newBtn = (!newBtn) ? arr[i] : newBtn;
                    this.regBtn(cmd2, newBtn);
                }
                catch (e)
                {
                }
            }
        },

        /**
         * 注册按钮
         * 
         * @param cmd {String}
         * @param btn
         * @returns
         */
        regBtn : function(cmd, btn)
        {
            var isCmdExist = false;
            for ( var c in WebAgent.Cmd)
            {
                if (WebAgent.Cmd[c] == cmd)
                {
                    isCmdExist = true;
                    break;
                }
            }
            if (!isCmdExist) return false;
			
            if (!this.isInit)
            {
                this.waitForRegBtns.push(
                {
                    "cmd" : cmd,
                    "btn" : btn
                });
                return;
            }

            var arr = this.btnCmdMap[cmd];
            arr = (!arr) ? [] : arr;

            /* switchTo方法可能导致重复注册 */
            for ( var i = 0; i < arr.length; i++)
            {
                if (arr[i] == btn)
                {
                    return;
                }
            }
            arr.push(btn);
            this.btnCmdMap[cmd] = arr;
            this.refBtn(cmd);
            return true;
        },

        /**
         * 移除注册的按钮
         */
        unRegBtn : function(btn_)
        {
            for ( var m in this.btnCmdMap)
            {
                var btns = this.btnCmdMap[m];
                if (!btns) continue;
                for ( var i = 0; i < btns.length; i++)
                {
                    try
                    {
                        if (btn_ == btns[i])
                        {
                            btns.splice(i, 1);
                        }
                    }
                    catch (e)
                    {
                    }
                }
            }
        },

        /**
         * 释放资源
         */
        dispose : function()
        {
            if (this.eh)
            {
                this.eh.dispose();
            }
        }
    };

    // 扩展WebAgent按钮管理的相关方法。
    WebAgent.extend(
    {
        btnMan : new BtnManager(),
        
        regBtn : function(cmd, btn)
        {
            return this.btnMan.regBtn(cmd, btn);
        },

        unRegBtn : function(btn)
        {
            this.btnMan.unRegBtn(btn);
        },

        refBtn : function(cmd)
        {
            this.btnMan.refBtn(cmd);
        },

        enableBtn : function(cmd)
        {
            this.btnMan.enableBtn(cmd);
        },

        disableBtn : function(cmd)
        {
            this.btnMan.disableBtn(cmd);
        },

        disableAllBtn : function()
        {
            this.btnMan.disableAllBtn();
        },

        switchTo : function(cmd1, cmd2)
        {
            this.btnMan.switchTo(cmd1, cmd2);
        },

        // 获取一个新的按钮管理器
        getNewBtnManager : function()
        {
            return new BtnManager();
        }
    });

})(WebAgent);
