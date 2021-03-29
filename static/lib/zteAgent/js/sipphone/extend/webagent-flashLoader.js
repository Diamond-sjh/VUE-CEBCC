/**
 * 处理加载Flash的工具
 */
WebAgent.extend(function()
{
    
    /**
     * 客户端环境
     * 
     * @private
     */
    var ua = function()
    {
        var userAgent = navigator.userAgent.toLowerCase(),
            platform = navigator.platform.toLowerCase(),
            windows = platform ? /win/.test(platform) : /win/.test(userAgent),
            mac = platform ? /mac/.test(platform) : /mac/.test(userAgent),
            webkit = /webkit/.test(userAgent) ? parseFloat(userAgent.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false,
            ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
            playerVersion = [0,0,0],
            d = null;
        
        if (navigator.plugins && navigator.plugins["Shockwave Flash"])
        {
            d = navigator.plugins["Shockwave Flash"].description;
            if (d && navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]
                && navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin)
            {
                plugin = true;
                ie = false;
                d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
                playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
            }
        }
        else if (window.ActiveXObject)
        {
            try
            {
                var a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                if (a)
                {
                    d = a.GetVariable("$version");
                    if (d)
                    {
                        ie = true;
                        d = d.split(" ")[1].split(",");
                        playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                    }
                }
            }
            catch (e)
            {
                // do nothing
            }
        }
        
        return {
                playerVersion: {
                    major: playerVersion[0],
                    minor: playerVersion[1],
                    release: playerVersion[2]},
                webkit: webkit,
                ie: ie,
                window: windows,
                mac: mac};
    }();
    
    /**
     * 创建一个param标签并添加到父节点下
     * @param {Object} elem 父节点
     * @param {String} name param标签的name属性
     * @param {String} value param标签的value属性
     */
    function createParam(elem, name, value)
    {
        var p = document.createElement("param");
        p.setAttribute("name", name);
        p.setAttribute("value", value);
        elem.appendChild(p);
    }
    
    /**
     * 构造并添加运行Flash的object标签
     * 
     * @param {String} url SWF文件的路径
     * @param {String} id 标签的ID
     * @param {Object} container 标签的父对象
     * @param {Numer} width 宽度
     * @param {Numer} height 高度
     * @param {Object} attrs object标签需要添加的属性
     * @param {Object} params object标签下的param标签需要添加的键值对
     * @return 载入Flash的object标签的元素对象
     * @private
     */
    function createW3CElem(url, id, container, width, height, attrs, params)
    {
        var ret = document.createElement("object");
        ret.setAttribute("id", id);
        ret.setAttribute("name", id);
        ret.setAttribute("width", width);
        ret.setAttribute("height", height);
        
        if (attrs)
        {
            for (var attr in attrs)
            {
                ret.setAttribute(attr, attrs[attr]);
            }
        }
        
        ret.setAttribute("type", "application/x-shockwave-flash");
        ret.setAttribute("data", url);
        
        if (params)
        {
            for (var param in params)
            {
                createParam(ret, param, params[param]);
            }
        }
        
        container.appendChild(ret);
        
        return ret;
    }
    
    /**
     * 在Buffer添加一个标签的属性字符串
     * @param {Object} buffer Buffer
     * @param {Object} name 属性的名称
     * @param {Object} value 属性的值
     * @private
     */
    function appendAttrToBuffer(buffer, name, value)
    {
        buffer.push(" ");
        buffer.push(name);
        buffer.push("=\"");
        buffer.push(value);
        buffer.push("\"");
    }
    
    /**
     * 在Buffer中添加一个完整的param标签的字符串
     * 
     * @param {Array} buffer Buffer
     * @param {String} name param标签的name属性
     * @param {String} value param标签的value属性
     * @private
     */
    function appendParamToBuffer(buffer, name, value)
    {
        buffer.push("<param name=\"");
        buffer.push(name);
        buffer.push("\" value=\"");
        buffer.push(value);
        buffer.push("\" />");
    }
    
    /**
     * 为IE构造并添加运行Flash的object标签的处理函数.在IE中只能用改变HTML代码的方式操作才能让插件成功加载.
     * 
     * @param {String} url SWF文件的路径
     * @param {String} id 标签的ID
     * @param {Object} container 标签的父对象
     * @param {Numer} width 宽度
     * @param {Numer} height 高度
     * @param {Object} attrs object标签需要添加的属性
     * @param {Object} params object标签下的param标签需要添加的键值对
     * @return 载入Flash的object标签的元素对象
     * @private
     */
    function createIEElem(url, id, container, width, height, attrs, params)
    {
        var buffer = ["<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\""];
        
        appendAttrToBuffer(buffer, "id", id);
        appendAttrToBuffer(buffer, "name", id);
        appendAttrToBuffer(buffer, "width", width);
        appendAttrToBuffer(buffer, "height", height);
        
        if (attrs)
        {
            for (var attr in attrs)
            {
                appendAttrToBuffer(buffer, attr, attrs[attr]);
            }
        }
        
        buffer.push(">")
        
        appendParamToBuffer(buffer, "movie", url);
        if (params)
        {
            for (var param in params)
            {
                appendParamToBuffer(buffer, param, params[param]);
            }
        }
        
        buffer.push("</object>");
        
        container.innerHTML = buffer.join("");
        
        return document.getElementById(id);
    }
    
    return{
        
        /**
         * 获取Flash Player的版本
         * 
         * @return {
         *     major {Number} 主版本号
         *     minor {Number} 次要版本号
         *     release {Number} 发行版本号
         * }.如果没有检测到Flash插件则返回的三个属性都为0.
         */
        getFlashPlayerVersion : function()
        {
            return {major: ua.playerVersion.major, minor: ua.playerVersion.minor, release: ua.playerVersion.release};
        },
        
        /**
         * 构造并添加运行Flash的object标签
         * 
         * @param {String} url SWF文件的路径
         * @param {String} id 标签的ID
         * @param {Object} container 标签的父对象
         * @param {Numer} width 宽度
         * @param {Numer} height 高度
         * @param {Object} attrs object标签需要添加的属性
         * @param {Object} params object标签下的param标签需要添加的键值对
         * @return 载入Flash的object标签的元素对象
         */
        embedSWF : function(url, id, container, width, height, attrs, params)
        {
            var ret = null;
            
            if (ua.ie && ua.window)
            {
                ret = createIEElem(url, id, container, width, height, attrs, params);
            }
            else
            {
                ret = createW3CElem(url, id, container, width, height, attrs, params);
            }
            
            return ret;
        }
    };
}());
