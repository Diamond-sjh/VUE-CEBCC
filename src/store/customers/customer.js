/**
 * 语音联络中心用户的信息数据存储
 * 
 */

import * as types from '../mutation-types' 
import MainAjax from "@/core/utils/MainAjax";
//语音用户进线后的数据内容
export default{
    state:{
        //取回过信息的用户
        curChannel:0,//不同渠道用户的id前端唯一标识索引
        textTabIndex:1,//文字客户索引下标 
        /**
         * 用户的存户信息map，map中obj的结构
         * "key":"cust_token",
         * "val":"customer"
         * {
         *      cust_token:"String",
         *      curCardInfo:"Object",//当前卡的内容
         *      cardLst:"Array",//帐卡列表
         *      
         * }
         */
        customerMap:new Map(),
        curCustToken:"",//当前用户的token值，用以获取当前的用户
    },
    mutations:{
        //存储当前用户信息包含帐卡列表，
        [types.SET_CUSTOMER_INFO] (state, info) {
            if(!info || !info.param){
                return;
            }
            let channel = info.param.channel;
            if(!channel){
                console.log('[Error] enter channel is null');
                return;
            }
            //根据座席的角色分配map的key
            state.customerMap.set(info.response.cust_token,info.response);
        },
        //删除对应渠道的用户
        [types.DELETE_CUSTOMER](state,{tabIdx}){
            let role = state.agentSession.roleCodeParam;
            if(role == constants.role.phone ||role == constants.role.video ){
                //语音视频客服
                state.phoneCustomer = null;
            }else if(role == constants.role.text){
                //文字客服
                state.textCustomer.delete(tabIdx);
            }
        },
        //设置当前用户索引
        [types.SET_CUR_CHANNEL](state,channel){
        },
        //设置当前的用户
        [types.SET_CUR_CUSTOMER](state,token){
            state.curCustToken = token;
        },
        //切卡后缓存存入
        [types.UPDATE_CUSTOMER_CUR_CARD](state,info){
            let customer = state.customerMap.get(info.tab);
            if(customer){
                customer.curCardInfo = info.data;
            }
        }
    },
    actions:{
        /**
         * 用户进线
         * @param {*} param0 
         * @param {*} customer 
         * { 
         *           cardNo:'卡号',
         *           warrantType:'进线类型' , 0客户号 1身份证 2卡号,
         *           channel:'',//进线的渠道，前端用，
         * }
         */
        actionCustomerEnter({ commit, state }, {customer,callback}) {
            //mainajax请求数据，等待数据返回后在对用户进行操作
            MainAjax.doPost(urlConfig.trans.getCustomerInfo,customer)
            .then(req=>{
                if(!req){
                    console.log("error actionCustomerEnter failed ,req is null");
                    return;
                }
                // let eventName = constants.event.EVENT_PHONE_CUSTOMER_ENTER;
                commit(types.SET_CUSTOMER_INFO,{response:req,param:customer});
                console.log(req);
                // $busEvent.$emit(eventName,req);
                if(callback){
                    callback(req);
                }

            });
        },
        /**
         * 用户离线
         * @param {*} param0 
         * @param {*} id 
         */
        actionCustomerLeave({commit ,state },{channel,acctNo}){
            commit(types.DELETE_CUSTOMER,{channel,acctNo});
        },
        actionSetCurChannel({commit,state},channel){
            commit(types.SET_CUR_CHANNEL,channel);
        },
        /**
         *用户切换卡片操作 
         * @param {string} cardNo 
         * @param {string} org 
         * @param {int} tabIdx  如果是文字客服，需要上送文字客服的tabindex，查找对应的customer
         */
        actionSwitchCustomerCard({commit,state},{cardNo,org,tabIdx}){
            //发送切卡action请求；
            let req = null;
            if(req){
                //如果有请求回来了则设置卡片内容
                commit(types.UPDATE_CUSTOMER_CUR_CARD,{data:req,tabIdx:tabIdx});
            }
        },
        actionSetCurCustomer({commit,state},custToken){
            commit(types.SET_CUR_CUSTOMER,custToken);
        }
    },
    getters:{
        //根据获取客户token获取客户信息,
        /**
         * @param {String} token 用户进线时候的cust_token值
         */
        getCustomer:(state,getters)=>(token)=>{
            return state.customerMap.get(token)?state.customerMap.get(token):{};
        },
        //获取当前用户的token值，
        getCurCustomerToken:state=>state.curCustToken,
    }
}