import axios from 'axios'
import qs from 'qs'
import { Loading } from 'element-ui';
import csrAlert from '@/core/utils/SwalAlert'
import store  from '@/store'
const csrAjax ={
    maxRequests:10,//同时队列中可以缓存的最大链接数量
    queue:[],
    timeout:60000,//超时时长
}

axios.defaults.withCredentials = true;
axios.interceptors.request.use(
    config=>{
        if(!config.data){
            config.data={}
        }
        //// 允许携带token ,这个是解决跨域产生的相关问题
        
        config.timeout = csrAjax.timeout;
        // config.data.systype = constants.system.systype;  
       
        // if (config.method === 'post') {
        //     config.data = qs.stringify(config.data);
        // }
        if (config.data.contentType == 'application/x-www-form-urlencoded') {
            config.data = qs.stringify(config.data);
            config.headers = {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        } else if (config.data.contentType == 'multipart/form-data') {
            config.headers = {
                'Content-Type': 'multipart/form-data'
            }
        } else {
            config.headers = {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }
        Object.assign(config.headers,{
            agent_token:store.getters.getAgentToken,
            cust_token:store.getters.getCurCustomerToken,
            channelId:"",//进线渠道 随路数据中获取？？？
            perm_code:window.$permissionCode,
        });
        // console.log("MainAjax---config",config);
        /***
         * 默认的三个内容token和channelId 在报文头信息中添加每次发送
         * headers: {}//设置header信息
         *  config.agent_token = "";//坐席的token
            config.cust_token="";//用户的token
            config.channelId="";//
        */
        
        return config;  //添加这一行
    },
    error=>{
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response=>{
        if( response.errCode==2){

        }
        return response;
    },
    error=>{
        if( error && error.response){
            switch( error.response.status){
                case 400:
                    error.message ="错误请求"
                break;
                case 401:
                    error.message = "未授权，请重新登录";
                break;
                case 403:
                    error.message = "拒绝访问";
                break;
                case 405:
                    error.message = '请求超时';
                break;
                case 500:
                    error.message = "服务端出错";
                break;
                case 501:
                    error.message = "网络未实现";
                break;
                case 404:
                    error.message = "错误请求，未找到该资源！"
                break;
                case 12029:
                    error.message = "您的网络已中断或系统服务器已停止";
                break;
                default:
                    error.message = `连接错误${error.response.status}`
            }
        }
        return Promise.reject(error);
    }
);

let loadingInstance =null;

export default{
   
    checkQueue(){
        if(csrAjax.queue.length >=csrAjax.maxRequests){
            csrAlert.warning('请求的内容过多，请稍后再试！');
            return false;
        }
        return true;
    },
    /**
     * 
     * @param {*} url 
     * @param {*} param 
     * @param {*} cancel 退出的回调函数 
     */
    get(url,param,cancel){
        // if(!this.checkQueue()){
        //     return;
        // }
        return new Promise((resolve,reject)=>{
            axios({
                methods:'get',
                url,
                params:param,
                cancelToken:axios.CancelToken(c=>{
                    if(cancel){
                        cancel(c);
                    }
                })
            }).then(res=>{
                resolve(res);
            },error=>{
                reject(error);
            });
        });
    },
    /**
     * 
     * @param {string} url 
     * @param {object} param 发送给服务器的参数 
     * @param {number} bAlert 是否需要返回弹窗提示，0不需要，1需要
     */
    doPost(url,param,bAlert){
        if(!bAlert){
            bAlert=0;
        }
        
        loadingInstance =  Loading.service({
            lock: true,
            text: '拼命加载中...',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.7)'
        });

        return new Promise((resolve,reject)=>{
            // this.post(url,param);
            this.post(url,param)
            .then((data)=>{
                if(loadingInstance){
                    loadingInstance.close();
                    loadingInstance=null;
                }
                if(bAlert>0){
                    //存在错误，直接弹窗提示
                    // && data.data.errorMsg != "Success" 
                    let message = data.data.errorMsg ?data.data.errorMsg:'操作成功！';
                    csrAlert.error(message);
                }
                resolve(data);
            },error=>{
                if(loadingInstance){
                    loadingInstance.close();
                    loadingInstance=null;
                }
                csrAlert.error(error.message);
                reject(error);
            })
        });
    },
    //post请求
    post(url, param) {
        
        
        // console.log(url);
        return new Promise((resolve, reject) => {
            
            if(!url){
                reject({message:"url  is null"});
            }

            let method = 'post';
            if(constants.localData){
                let idx0 = url.lastIndexOf('.');
                let idx1 = url.lastIndexOf('/');
                url = url.substr(idx1+1,idx0-idx1-1);
                url = "/static/json/"+url+'.json';
                method = 'get';
            }
            
            axios({
                method: method,
                url: url,
                data: param,
                cancelToken: axios.CancelToken(c => {
                    //cancel = c
                })
            }).then((response) => {
                // console.log("res",response);
                resolve(response.data);
            }, err => {
                reject(err);
            })
        });
    }

}