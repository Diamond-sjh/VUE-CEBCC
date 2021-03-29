//软电话相关功能，主要是接入软电话的内容后返回了数据，调用方法对软电话进行相关操作
import { Loading } from 'element-ui';
import bus from '@/core/utils/BusEvent';
const simplePhone={
    loading:null,
    event:{
        onRinging:"CSR_PHONE_EVENT_ON_RINGING",//振铃事件
        onRelease:"CSR_PHONE_EVENT_ON_RELEASE",//挂断事件
        onTalking:"CSR_PHONE_EVENT_ON_TALKING",//建立通话事件
        onTransfered:"CSR_PHONE_EVENT_ON_TRANSFERED",//转接完成
        onSingleTransfered:"CSR_PHONE_EVENT_ON_SINGLE_TRANSFERED",//单步转接
    },
    status:{
        default:0,//默认状态
        login:1,//登录成功
        idle:2,//空闲 (就绪)
        busy:3,//忙碌
        callIn:4,//呼入
        callOut:5,//呼出
        talking:6,//通话中，建立了连接状态
        calling:7,//振铃中
    },
    statusMap:{
        '0':"未登录",
        '1':"登录成功",
        '2':"空闲",
        '3':"忙碌",
        '4':"呼入",
        '5':"呼出",
        '6':'通过中',
        '7':'振铃中',
    },
    getStatusStr(status){
      if(this.statusMap[status]){
          return this.statusMap[status];
      }  
      return "未知";
    },
    showLoading(title="软电话事件中"){
        if(this.loadingInstance){
            return;
        }
        this.loadingInstance =  Loading.service({
            lock: true,
            text: title,
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.7)'
        });
    },
    hideLoading(){
        if(this.loadingInstance){
            this.loadingInstance.close();
            this.loadingInstance=null;
        }
    },
    dispatchEvent(name,param){
        console.log("派发事件",name);
        bus.$emit(name,param);
    },
    addEvent(name,handler){
        bus.$on(name,handler);
    }
}

export default simplePhone;
