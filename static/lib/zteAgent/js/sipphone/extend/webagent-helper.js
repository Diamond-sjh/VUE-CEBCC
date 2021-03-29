/**
 * WebAgent辅助方法
 */

WebAgent.extend(
{
    isMute : false, // 当前是否静音？

    holdCallID : null, // 保持的callID

    /**
     * 获取操作员id
     */
    getOid : function()
    {
        return (this.operator) ? this.operator.oid : null;
    },

    /**
     * 获取操作员密码
     */
    getPwd : function()
    {
        return (this.operator) ? this.operator.pwd : null;
    },

    /**
     * 获取操作员类型
     */
    getType : function()
    {
        return (this.operator) ? this.operator.type : null;
    },

    /**
     * 获取虚拟中心
     */
    getVcid : function()
    {
        return (this.operator) ? this.operator.vcid : null;
    },

    /**
     * 获取座席电话号码
     */
    getAgtPhoneNo : function()
    {
        if (!this.com2_agtPhoneNo)
        {
            var arr = (this.com2_currentAgtInfo + "").split("|");
            if (arr.length > 5)
            {
                this.com2_agtPhoneNo = arr[4];
            }
        }
        return this.com2_agtPhoneNo;
    },

    /**
     * 获取当前状态
     * 
     * @returns
     */
    getState : function()
    {
        return (this.stateMan) ? this.stateMan.curState : null;
    },

    /**
     * 获取之前状态
     * 
     * @returns
     */
    getPevState : function()
    {
        if(!this.stateMan) return null;
        return this.stateMan.pevState;
    },

    /**
     * 获取A接口当前错误码
     * 
     * @param fn
     * @returns
     */
    getErrCode : function(fn)
    {
        return this.invoker("GetLastErrorCode", "", fn);
    },

    /**
     * 获取错误码含义,如果未定义返回空
     */
    getCauseByErrCode : function(errCode)
    {
        var key = "ainf.errCode." + errCode;
        var errMsg = $.trim(this.getMsg(key));
        errMsg = (errMsg == key || errMsg == "") ? "" : errMsg;
        return errMsg;
    },

    /**
     * 获取最近一次错误,异步返回
     * 
     * @return function(errCode,cause)
     */
    getLastError : function(fn)
    {
        var thisobj = this;
        this.getErrCode(function(errCode)
        {
            if (fn) fn(errCode, thisobj.getCauseByErrCode(errCode));
        });
    },

    /**
     * 获取A接口属性
     * 
     * @param key
     * @param fn
     * @returns
     */
    getProperty : function(key, fn)
    {
        var ocx = WebAgent.AinfOCX;
        return this.invoker("GetAinfProperty", [ key ], fn);
    },

    /**
     * 获取当前状态码
     * 
     * @return {String}
     */
    getCurStatusCode : function(fun)
    {
        this.invoker("GetAgentInfo", [ this.getOid() ], function(curStatus)
        {
            // 虚中心号|座席工号|座席名称|座席台号|座席电话|座席状态|组号|组名|座席类型|区号|区域编码
            if (curStatus.length > 1)
            {
                var arr = curStatus.split("|");
                var agtStatus = (arr.length > 5) ? arr[5] : null;
                fun(agtStatus);
                return;
            }
            fun(null);
        });
    },

    /**
     * 根据状态码获取状态码名称
     * 
     * @param stateCode
     */
    getStateNameByCode : function(stateCode)
    {
        var state = this.stateMan.stateMap[stateCode + ""];
        return (state && state.name) ? state.name : "";
    },

    /**
     * 根据状态码获取状态对象{stateCode,name}
     * 
     * @param stateCode
     * @return stateObj {stateCode,name}
     */
    getStateByCode : function(stateCode)
    {
        return this.stateMan.stateMap[stateCode + ""];
    },

    /**
     * 获取资源文件
     * 
     * @param key
     * @param args
     * @returns
     */
    getMsg : function(key, args)
    {
        return WebAgent.I18n.getMsg(key, args);
    },

    /**
     * 获取版本号
     * 
     * @returns
     */
    getVersion : function()
    {
        return WebAgent.version;
    },

    /**
     * 获取所有控件的版本
     * 
     * @param fn {function}
     * @return 回调函数返回 ainf=xxx;sip=xxx;tsapi=xxx;ainfser=xxx;jscore=xxx;
     */
    getAllVersions : function(fn)
    {
        WebAgent.invoker("GetVersion", [], function(ver)
        {
            if (fn) fn(ver + ";jscore=" + WebAgent.getVersion());
        });
    },

    /**
     * 获取模块号
     * 
     * @param fn {function} 回调
     * @return 回调函数返回{String}
     */
    getModuleNo : function(fn)
    {
        WebAgent.invoker("GetModuleNo", [], fn);
    },

    /**
     * 获取座席电话号
     * 
     * @param fn {function}
     * @return 回调函数返回{String}
     */
    getAgentPhone : function(fn)
    {
        if (fn) fn(this.getAgtPhoneNo());
        // WebAgent.invoker("GetAgtPhone", [], fn);
    },

    /**
     * 获取座席MAC地址
     * 
     * @param fn {function}
     * @return 回调函数返回{String}
     */
    getMacAddr : function(fn)
    {
        WebAgent.invoker("GetMacAddr", [], fn);
    },

    /**
     * 设置静音开关
     * 
     * @param isMute {boolean} true静音，false取消静音
     */
    setMute : function(isMute)
    {
        this.isMute = isMute;
        WebAgent.invoker("SetPhoneMute", (isMute) ? "1" : "0");
        setTimeout(function()
        {
            WebAgent.EventHelper.notify("OnSetMuteSucc", [ isMute ]);
        }, 0);

        // 呼叫结束后取消静音
        if (isMute)
        {
            var eh = WebAgent.mute_eh;
            eh = WebAgent.mute_eh = (!eh) ? new WebAgent.EventHelper() : eh;
            WebAgent.mute_eh.dispose();
            eh.regEvent("OnStateChanged", function(state)
            {
                var code = state.stateCode * 1;
                WebAgent.setMute(false);
                eh.dispose();
            }, this);
        }
    },

    /**
     * 设置座席状态
     * 
     * @param _state
     * @returns
     */
    setState : function(_state)
    {
        this.stateMan.changedState(_state);
    },

    /**
     * 是否恢复登录
     * 
     * @returns
     */
    isRecoveryLogin : function()
    {
        return this.isAbnormalExit;
    },

    /**
     * 当前座席是否通话中？(异步回调)
     * 
     * @return {boolean} true 通话中，false没有通话
     * @public
     */
    isCalling : function(fun)
    {
        /*
         * return this.invoker("getAllParts", "", function(callList) { if (fun)
         * fun((callList.length > 1) ? true : false); });
         */
        var state = this.getState();
        var isCall = false;
        if (state && state.stateCode)
        {
            var code = state.stateCode * 1;
            var isCall = (code >= 300) && (code <= 311);
        }

        if (fun) fun(isCall);
        return isCall;
    },

    /**
     * 检查可以升级的版本
     * @param url {String} 安装包下载地址
     * @param newVersion {String} 升级到的版本号
     * @param fn {function} 结果回调函数
     * @return {String} 0不升级，1正在升级
     */
    checkAInfUpdate : function(url,newVersion,fn)
    {
        WebAgent.invoker("CheckUpdate", [ url, newVersion ], fn);
    },

    /**
     * 调用示闲
     * 
     * @returns
     */
    setBusy : function()
    {
        this.invoker("SetBusy", " ");
    },

    /**
     * 调用示闲
     * 
     * @returns
     */
    idle : function()
    {
        this.invoker("SetIdle", " ");
    },

    /**
     * 预示忙(按钮切换用)
     */
    setPreBusy : function(fn)
    {
        var thisobj = this;
        var isCalling = WebAgent.isCalling();
        WebAgent.invoker("SetBusy", "", function(re)
        {
            if (re == "0" && isCalling)
            {
                WebAgent.EventHelper.notify("OnSetPreBusySuccess", [ true ]);
            }
            if (fn) fn(re);
        });
    },

    /**
     * 预示闲(按钮切换用)
     */
    setPreIdle : function(fn)
    {
        var thisobj = this;
        var isCalling = WebAgent.isCalling();
        WebAgent.invoker("SetIdle", "", function(re)
        {
            if (re == "0" && isCalling)
            {
                WebAgent.EventHelper.notify("OnSetPreIdleSuccess", [ true ]);
            }
            if (fn) fn(re);
        });
    },

    /**
     * 三方通话
     */
    conf : function()
    {
        if (!this.holdCallID)
        {
            WebAgent.invoker("QueryCallIDOnAgent", WebAgent.getOid(), function(callID)
            {
                WebAgent.holdCallID = callID;
                WebAgent.invoker("Conference", [ callID ]);
            });
        }
        else
        {
            this.invoker("Conference", [ this.holdCallID ]);
        }
    },

    /**
     * 内存缓冲区，用于保存数据
     */
    buffer :
    {
        /**
         * 保存变量
         * 
         * @param key {String}
         * @param value {String}
         * @param cbFun {function}
         */
        saveValue : function(key, value, cbFun)
        {
            var str = "set:" + key + "." + encodeURIComponent(value);
            WebAgent.invoker("BufferAccess", [ str ], cbFun);
        },

        /**
         * 获取指定变量
         * 
         * @param key {String}
         * @param cbFun {function}
         */
        getValue : function(key, cbFun)
        {
            var str = "get:" + key;
            // str = encodeURIComponent(str);
            WebAgent.invoker("BufferAccess", [ str ], function(json)
            {
                if (cbFun) cbFun(json[key]);
            });
        },

        /**
         * 获取所有变量,返回json对象
         * 
         * @param cbFun {function}
         */
        getAllValues : function(cbFun)
        {
            WebAgent.invoker("BufferAccess", "getall", cbFun);
        },

        /**
         * 删除变量
         * 
         * @param key {String}
         * @param cbFun {function}
         */
        delValue : function(key, cbFun)
        {
            var str = "del:" + key;
            str = encodeURIComponent(str);
            WebAgent.invoker("BufferAccess", [ str ], cbFun);
        },

        /**
         * 删除内存中全部数据
         * 
         * @param cbFun {function}
         */
        delAllValues : function(cbFun)
        {
            WebAgent.invoker("BufferAccess", "clear", cbFun);
        }
    },

    /**
     * 文件操作
     */
    file :
    {
        /**
         * 获取文件目录，如果不存在则创建
         */
        getFolder : function(folderName, cbFun)
        {
            var str = "GetFolder:" + folderName;
            str = encodeURIComponent(str);
            WebAgent.invoker("FileOper", [ str ], cbFun);
        },

        /**
         * 获取文件大小，如果不存在则返回-1：
         */
        getFileSize : function(filePath, cbFun)
        {
            var str = "GetFileSize:" + filePath;
            str = encodeURIComponent(str);
            WebAgent.invoker("FileOper", [ str ], cbFun);
        },

        /**
         * 打开文件夹并选择文件 (调用命令：explorer /select,c:\1.bmp)
         */
        explorer : function(filePath, cbFun)
        {
            var str = "Explorer:" + filePath;
            str = encodeURIComponent(str);
            WebAgent.invoker("FileOper", [ str ], cbFun);
        }
    },
    
    /**
     * 读取ini配置文件
     * 
     * @param iniFile {String}
     * @param cbFun {Function}
     * @return {json}
     */
    readConfig : function(iniFile,cbFun)
    {
        WebAgent.invoker("ReadFile",[iniFile,""],function(txt)
        {
            var lines = txt.split("\r");
            if(cbFun) cbFun(lines);
        });
    },
        
    /**
     * 座席之间的私有消息解析、发送（监听OnMessageReceiveEx事件接收消息）
     */
    privateMsg : 
    {
        // 解析私有消息，返回{msg,mainMsgType,subMsgType,recverID,senderID,sendTime,validTime}
        parse : function(strMsg)
        {
            var perMsgInfo = strMsg.split("MSG=");
            if(perMsgInfo.length!=2) return null;
            
            var msgInfo = perMsgInfo[1].split("^");
            if(msgInfo.length!=2) return null;
            
            var msgParams = msgInfo[0].split("&");
            var msgContent = msgInfo[1];
            
            if(msgParams.length!=6) return null;
            
            var pMsg = 
            {
                // 消息
                msg : msgContent,
                
                // 主消息类型
                mainMsgType : msgParams[0],
                
                // 子消息类型
                subMsgType  : msgParams[1],
                
                // 接收者id
                recverID    : msgParams[2],
                
                // 发送者id
                senderID    : msgParams[3],
                
                // 发送时间
                sendTime    : msgParams[4],
                
                // 有效时间
                validTime   : msgParams[5]
            };
            
            return pMsg; 
        },
        
        // 发送
        send : function(mainMsgType, subMsgType, recverID, msgContent, cbFun)
        {
            var kind = 1; //1：座席,2：全组
            var senderID = WebAgent.getOid(); 
            var sendTime =WebAgent.utils.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
            var validTime = "9999-12-31 23:59:59";
            var msg = mainMsgType +"&"+ subMsgType +"&"+ recverID +"&"+ senderID
                + "&" + sendTime + "&" + validTime + "^" ;
            msg = encodeURIComponent(msg)+ msgContent;
            
            WebAgent.invoker("SendMessageToAgent", [msg,recverID,kind],function(result)
            {
                if(cbFun) cbFun(result=="0");// 0成功，其他失败
            });
        }
    }
});

WebAgent.ready(function()
{
    var eh = WebAgent.regEvent("OnHoldSuccess", function()
    {
        WebAgent.invoker("QueryCallIDOnAgent", WebAgent.getOid(), function(callID)
        {
            WebAgent.holdCallID = callID;
        });
    });
});