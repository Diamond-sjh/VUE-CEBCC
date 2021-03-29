/**
 * 消息总线，类似Observer模式，通过注册事件实现消息转发
 * 
 * <pre>
 * @example
 *        var handler1 = function(arg1,arg2){ alert(arg1 +"," arg2); }
 *        var handler2 = function(){...}
 *        
 *        // 注册事件
 *        EventBus.addEventListener("myEventName",handler1);
 *        EventBus.addEventListener("myEventName",handler2);
 *        
 *        // 广播消息
 *        var args =[1,2]
 *        EventBus.dispatchEvent("myEventName",args);
 *        
 *        // 移除handler1
 *        EventBus.removeEventListener("myEventName",handler1);
 *        
 * @note
 *       1，IE在跨页面注册事件时，处理函数只能接收一个参数，而且必须是Array类型的参数      
 *       2，如果涉及到handler函数上下文时，推荐使用EventHelper进行安全调用.
 * </pre>
 */
WebAgent.EventBus = {
        
        /**
         * 记录事件和处理器的map
         * @private 
         */
        eventHanderMap : {},
        
        /**
         * 注册监听事件
         * 
         * @param  {String}    事件名
         * @param  {Function}  事件处理函数
         * @public
         */
        addEventListener : function(eventName,eventHandler)
        {
            var funList = this.eventHanderMap[eventName];
            if(funList==null)
            {
                funList = new Array();
            }
            funList.push(eventHandler);
            this.eventHanderMap[eventName] = funList;
        } ,
        
        /**
         * 移除注册监听
         * 
         * @param {String}  事件名
         * @param {Function}事件处理函数，这里需要同传入handler的引用保持一致
         * @public
         */
        removeEventListener : function(eventName,eventHandler)
        {
            var funList = this.eventHanderMap[eventName];
            if(!funList) return;
            for(i=0;i<funList.length;i++)
            {
                if(funList[i]==eventHandler)
                {
                    this.eventHanderMap[eventName].splice(i,1)
                }
            }
        },
        
        /**
         * 移除所有注册监听
         * 
         * @public
         */
        removeAllEventListener : function()
        {
        	this.eventHanderMap ={};
        },
        
        
        /**
         * 对外广播消息
         * 
         * @param {String} 事件名
         * @param {Array<Object>}  vbs或js格式的参数数组
         * @public 
         * @Synch
         */
        dispatchEvent : function(eventName,args)
        {
            var funList_ = this.eventHanderMap[eventName];
            if(funList_ == null) return;
            var funList = funList_.concat(new Array()); // 防止运行过程中被removeEventListener掉
                                                        // 导致长度发送改变，所以需要拷贝一份来进行循环
            for(var f=0;f<funList.length;f++)
            {
                 var _fun = funList[f];
                 //IE跨页面调用时，传过来的function类型变成了object类型
                 if(!(typeof _fun=="function" || typeof _fun=="object"))
                 {
                    continue;
                 }          
                 
                 //处理js或vbs传过来的arguments
                 var jsArgs = null;
                 try
                 {
                    if(args!=null && typeof args == 'object' &&  typeof args.length == 'number') 
                    {
                        jsArgs = args;
                        
                    }
                    else
                    {
                        jsArgs = args.toArray();
                    }
                 } catch(e)
                 {
                    jsArgs = null;
                 }
                 
                try
                {
                     if(jsArgs==null)
                     {
                        _fun.apply(_fun.prototype);
                     }
                     else
                     {
                        //强制转换参数为数组，（IE跨页面调用方法时，参数全部变成object类型）
                         jsArgs_ = new Array();
                         for(var i =0;i<jsArgs.length;i++)
                         {
                             jsArgs_[i] = jsArgs[i];
                         }

                         if(typeof _fun =="function")
                         {
                             _fun.apply(window,jsArgs_);
                         }
                         else 
                         {
                             _fun.call(window,jsArgs_);
                         }
                     }
                }catch(e)
                {
                   WebAgent.warn("[EventBus.js] EventBus.dispatchEvent() Error! cause:"+ e);
                }
            }
        }
};

//alert("eventBus");