/**
 * 在线客服聊天的处理内容，客户的进线以及聊天记录等等
 * 
 */
import MainAjax from "@/core/utils/MainAjax";
export default {
    state:{
        
    },
    actions:{
         /**
         * 用户进线
         * @param {*} param0 
         * @param {*} customer 
         */
        actionOnlineCustomerEnter({ commit, state }, customer) {
            //mainajax请求数据，等待数据返回后在对用户进行操作
           
            MainAjax.doPost(urlConfig.app.getCustomerInfo,customer)
            .then(req=>{
                let eventName = constants.event.EVENT_ONLINE_CUSTOMER_ENTER;
                commit(types.SET_CUSTOMER_INFO,{response:req,param:customer});
                $busEvent.$emit(eventName,req);
            });
        }
    },
    mutations:{

    }
}