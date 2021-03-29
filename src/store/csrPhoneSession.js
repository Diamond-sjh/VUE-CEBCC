/**
 * 电话条的事件内容store,动态通知座席当前电话的状态以及电话事件
 */
import {mathTime} from '@/core/utils/GlobalMethods';
let phoneTick = function(state){
    state.timerHandler = setTimeout(() => {
        //通话中 进行计时
        if(state.curStatus == csrPhone.status.talking){
            state.timerStr = mathTime(state.timer);
        }                
        phoneTick(state);
    }, 1000);
}
export default{
    state:{
        curStatus:0,//软电话条上面的状态
        callState:0, //0 无状态 1离线 2在线
        direction:0, // 0无 1呼入 2呼出
        callData:null,//电话的随路数据
        timer:null,//通话计时
        timerHandler:null,
        timerStr:'00:00:00',
        lastStatus:0,//上次的状态
    },
    
    mutations:{

    },
    actions:{
        setPhoneStatus({commit,state},status){
            state.lastStatus = state.curStatus;
            state.curStatus = status;
            console.log("store 的status变化，",state.lastStatus,state.curStatus);
            if(state.curStatus == csrPhone.status.talking){
                //开始计时
                phoneTick(state);
            }else{
                //停止计时
                if(state.timerHandler){
                    clearTimeout(state.timerHandler);
                    state.timerStr = '00:00:00';
                    state.timerHandler = null;
                }
            }
        },
        /**
         * 设置软电话状态
         * @param {*} _state  0默认 
         */
        setCallState({commit,state},callState){
            state.callState = callState?callState:0;
        },
        /**
         * 设置软电话通话方向
         * @param {*} _direction 
         */
        setVoiceDirection({commit,state},_direction){
            state.direction=_direction?_direction:0;
        },
    },
    getters:{
        getPhoneStatus:state=>state.curStatus,
        getCallState:state=>state.callState,
        getVoiceDirection:state=>state.direction,
        getCallData:state=>state.callData,
        getPhoneStatusStr:state=>{
            return csrPhone.getStatusStr(state.curStatus);
        },
        getPhoneTimerStr:state=>state.timerStr,
        getPhoneLastStatus:state=>state.lastStatus,
    },
}