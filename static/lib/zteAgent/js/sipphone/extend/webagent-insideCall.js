/**
 * 内呼通话时屏蔽 【咨询】、【保持】、【会议】、【单步转】、【释放转】功能
 * (内部呼入301,内部呼出303)
 */
;
(function(WebAgent)
{
    WebAgent.onInit(function()
    {
        WebAgent.EventHelper.intercept("OnStateChanged", function(interceptor)
        {
            var args = interceptor.eventArgs;
            WebAgent.debug("[webagent-insideCall.js] Intercept Event ：" + interceptor.eventName + ",args=" + args);
            var state = args[0];
            var stateCode = state.stateCode*1;
            var isInsideCall = (stateCode == 301) ||(stateCode == 303);
            if (isInsideCall)
            {
                state.enableCmds_insideCall = (!state.enableCmds_) ? state.enableCmds : state.enableCmds_;
                var Cmd = WebAgent.Cmd;
                var enableCmds = [].concat(state.enableCmds_insideCall);
                //
                var disableCmds = [Cmd.CONS,Cmd.HOLD,Cmd.SSCONF,Cmd.TRANSFER,Cmd.SSTRANSFER];
                state.enableCmds = WebAgent.utils.arrSub(enableCmds, disableCmds);
                WebAgent.warn(state.enableCmds);
            }
            interceptor.next();
        });
    });
})(WebAgent);