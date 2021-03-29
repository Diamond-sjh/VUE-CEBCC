/**
 * 特殊状态处理"座席报工号"（State.reportWorkNum）<br>
 * 在收到OnStartReportWorkNum事件的时候将状态栏的显示更改为“等待应答”。<br>
 * 座席预先保存eventOnCTIAgentStateChanged事件中的通话状态，在接收到OnAnswerSuccess事件之后，
 * 才根据保存的通话状态改变状态栏的显示。 <br>
 * (com2.js里面有rmvAllIntercept操作，因此需要把该js放在其后面）
 */
;
(function()
{
    var State = WebAgent.State;
    var eh = new WebAgent.EventHelper();
    WebAgent.onInit(function()
    {
        WebAgent.EventHelper.intercept("OnCTIAgentStateChanged", function(interceptor)
        {
            WebAgent.debug("[webagent_reportState.js]Intercept Event ：" + interceptor.eventName + ", args=" + interceptor.eventArgs);
            
            var ANSWER_REQ = "312"; // 来话请求
            var INNER_CALL = "301"; // 内部通话
            var OUT_CALL = "300"; // 外部通话
            var args = interceptor.eventArgs;
            var oldState = args[1];
            var newState = args[0];
            if ((oldState == ANSWER_REQ) && (newState == INNER_CALL || newState == OUT_CALL))
            {
                eh.dispose();
                var ctx =
                {
                    "inter" : interceptor,
                    "eh" : eh
                };

                // 收到正在报工号事件，状态设为“等待应答”
                eh.regEvent("OnStartReportWorkNum", function()
                {
                    State.reportWorkNum.stateCode = newState;
                    WebAgent.setState(State.reportWorkNum);
                }, ctx);

                // 应答成功广播cti事件，使状态正常变为“通话”，
                // 如果先收到此事件，就不处理“OnStartReportWorkNum”
                eh.regEvent("OnAnswerSuccess", function()
                {
                    this.inter.next();
                    this.eh.rmvEvent("OnStartReportWorkNum");
                }, ctx);
            }
            else
            {
                // 移除之前的事件
                eh.dispose();
                interceptor.next();
            }
        });

    });

})();