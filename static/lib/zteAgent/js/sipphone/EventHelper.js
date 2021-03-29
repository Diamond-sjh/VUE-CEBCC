/**
 * 事件辅助类，方便事件统一注册、销毁、拦截。避免js可能存在一些上下文冲突
 * 
 * @requires EventBus.js
 */
WebAgent.EventHelper = function()
{
    this.eventMap = {};
    this._dispatchEvent = null; // 备份EventBus.dispatchEvent的方法
};

WebAgent.EventHelper.prototype =
{
    /**
     * 监听事件,同一个事件只能注册一个处理函数，如果需要注册多个处理器请实例化多个EventHelper对象
     * 
     * @param {String} 事件名称 ;
     * @param {Function} 事件处理函数 ;
     * @param {Object} 函数所属的上下文环境，可以为空。
     */
    regEvent : function(eventName, handler, ctx)
    {
        var handlerPoxy = function()
        {
            var args = new Array();
            for ( var i = 0; i < arguments.length; i++)
            {
                args[i] = arguments[i];
            }
            return handler.apply(ctx, args);
        };

        // 同一事件只能注册一个监听函数
        if (this.eventMap[eventName] != null)
        {
            WebAgent.EventBus.removeEventListener(eventName, this.eventMap[eventName].handler);
        }

        this.eventMap[eventName] =
        {
            ctx : ctx,
            handler : handlerPoxy
        };
        WebAgent.EventBus.addEventListener(eventName, handlerPoxy);
    },

    /**
     * 监听多个事件（用同一个处理器）
     * 
     * @param eventArr
     * @param handler
     * @param ctx
     */
    regEvents : function(eventArr, handler, ctx)
    {
        for ( var i = 0; i < eventArr.length; i++)
        {
            this.regEvent(eventArr[i], handler, ctx);
        }
    },

    /**
     * 注册一次性事件处理器，handler被调用一次后移除对事件的监听。
     * 
     * @param eventName
     * @param handler
     * @param ctx
     * @return
     */
    regOneTimeEvent : function(eventName, handler, ctx)
    {
        var thisObj = this;
        var handlerPoxy = function()
        {
            var args = new Array();
            for ( var i = 0; i < arguments.length; i++)
            {
                args[i] = arguments[i];
            }
            WebAgent.EventBus.removeEventListener(eventName, thisObj.eventMap[eventName].handler);
            return handler.apply(ctx, args);
        };

        if (this.eventMap[eventName]) // 同一事件只能注册一个监听函数
        {
            WebAgent.EventBus.removeEventListener(eventName, this.eventMap[eventName].handler);
            this.eventMap[eventName] = null;
        }

        this.eventMap[eventName] =
        {
            ctx : ctx,
            handler : handlerPoxy
        };
        WebAgent.EventBus.addEventListener(eventName, handlerPoxy);
    },

    /**
     * 监听多个一次性处理事件（用同一个处理器）
     * 
     * @param eventArr
     * @param handler
     * @param ctx
     */
    regOneTimeEvents : function(eventArr, handler, ctx)
    {
        for ( var i = 0; i < eventArr.length; i++)
        {
            this.regOneTimeEvent(eventArr[i], handler, ctx);
        }
    },

    /**
     * 移除指定的事件
     */
    rmvEvent : function(eventName)
    {
        if (this.eventMap[eventName])
        {
            var fun = this.eventMap[eventName];
            if (!fun) return;
            WebAgent.EventBus.removeEventListener(eventName, this.eventMap[eventName].handler);
            this.eventMap[eventName] = null;
        }
    },
    
    
    unRegEvent : function(eventName)
    {
       this.rmvEvent(eventName);
    },

    /**
     * 移除自身所有的注册事件
     */
    dispose : function()
    {
        for (i in this.eventMap)
        {
            var fun = this.eventMap[i];
            if (!fun) continue;
            WebAgent.EventBus.removeEventListener(i, this.eventMap[i].handler);
        }
    },

    /**
     * 广播事件
     */
    notify : function(eventName, args)
    {
        WebAgent.EventHelper.notify(eventName, args);
    }
};

/**
 * 静态方法，广播事件
 * 
 * @param eventName 事件名
 * @param args 参数
 * @static
 */
WebAgent.EventHelper.notify = function(eventName, args)
{
    WebAgent.EventBus.dispatchEvent(eventName, args);
};

/**
 * 拦截事件,该方法比较危险，只能在核心模块内部使用，不对外开放
 * 
 * @see EventHelper.js#EventInterceptor.intercept();
 * @param eventName {String}被拦截的事件名称
 * @param interceptFun {Function} 截获到事件后的处理函数,接收一个Interceptor对象
 * @static
 */
WebAgent.EventHelper.intercept = function(eventName, interceptFun)
{
    return WebAgent.EventInterceptor.intercept(eventName, interceptFun);
};

/**
 * 移除所有拦截器
 */
WebAgent.EventHelper.rmvAllIntercept = function()
{
    return WebAgent.EventInterceptor.interceptMap = {};
};

/**
 * 删除指定拦截器
 */
WebAgent.EventHelper.rmvIntercept = function(interceptPoint)
{
    return WebAgent.EventInterceptor.rmvIntercept(interceptPoint);
};

/**
 * <pre>
 * 事件拦截器，在EventBus对外广播消息时拦截该事件。 
 * 比如com2控件，在收到振铃事件后，通过异步获取必要的信息后，再对外广播振铃事件。
 * 
 * @example 
 * EventInterceptor.intecept(‘OnAnswerRequest’,function(inter)
 * {
 *      // 继续下一个拦截器，如果没有则广播消息
 *      inter.next()
 * })
 * </pre>
 */
WebAgent.EventInterceptor =
{
    // EventBus.dispatchEvent的方法备份
    _dispatchEvent : null,

    // 拦截表，反复登录的情况下，在座席登录前应清空该对象
    interceptMap : {},

    /**
     * 拦截指定事件,当回调函数interceptFun被触发时，会收到一个拦截器对象(Interceptor) 支持拦截链，可对同一事件进行多次拦截
     * 
     * <pre>
     *     拦截器定义：
     *     Interceptor = 
     *     {
     *         eventName : {String}  // 被拦截的事件名称
     *         eventArgs : {Array}   // 被拦截的事件附带参数
     *         abort : function()    // 终止事件广播，取消后续拦截器
     *         notify : function() // 广播事件，取消后续拦截器
     *         next : function() // 继续下一个拦截器，如果没有则广播事件
     *     }
     * </pre>
     * 
     * @param eventName {String}被拦截的事件名称
     * @param interceptFun {Function} 截获到事件后的处理函数,接收一个Interceptor对象
     * @return {Object} interceptPoint
     */
    intercept : function(eventName, interceptFun)
    {
        var EventBus = WebAgent.EventBus;

        // 拦截EventBus.dispatchEvent方法
        if (!this._dispatchEvent)
        {
            var fn = this.bind(EventBus.dispatchEvent, EventBus);
            this._dispatchEvent = fn;
            EventBus.dispatchEvent = this.bind(this.dispatchEvent, this);
        }

        var interceptorChain = this.interceptMap[eventName];
        interceptorChain = (!interceptorChain) ? [] : interceptorChain;
        interceptorChain.push(interceptFun);
        this.interceptMap[eventName] = interceptorChain;
        
        return {"eventName" :eventName ,"interceptFun" : interceptFun };
    },
    
    /**
     * 删除拦截器
     * @param {Object} intercept方法返回的对象
     * @return {void}
     */
    rmvIntercept : function(interceptPoint)
    {
        var interceptorChain = this.interceptMap[interceptPoint.eventName];
        interceptorChain = (!interceptorChain) ? [] : interceptorChain;
        for(var i=0 ; i<interceptorChain.length;i++)
        {
            if(interceptPoint.interceptFun == interceptorChain[i])
            {
                interceptorChain.splice(i,1);
            }
        }
        this.interceptMap[interceptPoint.eventName] = interceptorChain;
    },
    
    /**
     * 替换EventBus.dispatchEvent方法
     */
    dispatchEvent : function(eventName, args)
    {
        var thisobj = this;

        if (!this.interceptMap[eventName])
        {
            this._dispatchEvent(eventName, args);
            return;
        }

        // 创建Interceptor对象
        var interceptor =
        {
            eventName : eventName,
            eventArgs : args,

            // @private
            isAbort : false,
            fnList : [],

            // 终止拦截链，取消事件广播
            abort : function()
            {
                this.isAbort = true;
                this.fnList = [];
                return;
            },

            // 广播事件，终止拦截链
            notify : function()
            {
                this.isAbort = true;
                this.fnList = [];
                thisobj._dispatchEvent(eventName, args);
            },

            // 继续下一个拦截链
            next : function()
            {
                if (this.isAbort) return;

                if (this.fnList.length > 0)
                {
                    var fun = this.fnList.shift();
                    fun(this);
                }
                else
                {
                    this.notify();
                }
            }
        };

        var interceptorChain = [].concat(this.interceptMap[eventName]);
        if (interceptorChain)
        {
            interceptor.fnList = interceptorChain;
            interceptor.next();
        }
    },
    
    bind : function(fn, ctx)
    {
        return function()
        {
            return fn.apply(ctx, arguments);
        };
    }
};
