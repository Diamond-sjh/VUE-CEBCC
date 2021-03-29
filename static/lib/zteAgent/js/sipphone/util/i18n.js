WebAgent.I18n =
{
    /**
     * 获取资源
     */
    getMsg : function(key, args)
    {
        if(!WebAgent.i18nMap) return key;
        var msg = WebAgent.i18nMap[key];
        if (msg)
        {
            if (args != null && typeof args == 'object'
                    && typeof args.length == 'number')
            {
                for ( var i = 0; i < args.length; i++)
                {
                    msg = msg.replace("\{" + i + "\}", args[i]);
                }
            }
            return msg;
        }
        else
        {
            return key;
        }
    }
};
