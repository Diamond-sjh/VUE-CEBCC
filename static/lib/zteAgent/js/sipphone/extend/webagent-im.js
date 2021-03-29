(function(WebAgent)
{
    /**
     * Im功能
     */
    WebAgent.extend(
    {
		//记录当前坐席流水号以及携带的业务信息
		im_Data: new HashMap(),
		
        /**
         * 通过流水号获取IM扩展参数
         * @param _flowNo:流水号
         * @return {String}
         */
        GetImExinfo : function(_flowNo)
        {
			var _selfData =  this.im_Data;
            if (!WebAgent.isReady) return "";      
            return _selfData.get(_flowNo);
        }
    });

    // 座席初始化成功后,初始化
    WebAgent.onInit(function(isReady)
    { 
	    var  self = this;
        // 拦截OnImBeginReqReceived
        WebAgent.EventHelper.intercept("OnImBeginReqReceived", function(interceptor)
        {
		   var _flowNo = interceptor.eventArgs[0];
           var _userdata =  interceptor.eventArgs[5];
           if(_userdata)
           {
              var  _param =  zteUtils._decodeParam(_userdata);
			  if( _param && _param.svcinfo)
			  {
				 WebAgent.im_Data.put(_flowNo,"SVCINFO=" + _param.svcinfo);
			  }				   
           }
           interceptor.next();
        });

        // 拦截【OnImEnd】事件，清空流水号
        WebAgent.EventHelper.intercept("OnImEnd", function(interceptor)
        {
			var _flowNo = interceptor.eventArgs[0];
			//从缓存数据中删除流水号相关的信息
			var _selfData =  WebAgent.im_Data;
			_selfData.remove(_flowNo);
			
            interceptor.next();
        });
    });
})(WebAgent);