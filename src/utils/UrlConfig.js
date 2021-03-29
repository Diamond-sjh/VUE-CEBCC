//应用于所有的关于接口的数据类型，通过此处进行统一的添加与维护，
import trans from '@/utils/urls/UrlTrans';
import security from '@/utils/urls/UrlSecurity';
import admin from '@/utils/urls/UrlAdmin';
const urlConfig = 
{
    initUrl(){
       this.updateUrl(this.app,'/security');
       this.updateUrl(this.admin,'/manager');
       this.updateUrl(this.trans,'/trans');
    },
    updateUrl(urlObject,serverStr){
        if(!urlObject || !serverStr){
            return;
        }
        for(let key in urlObject){
            urlObject[key]= '/cebcc'+serverStr+ urlObject[key];
            // console.log(urlObject[key]);
        }
    },
    //后管服务器manager
}
urlConfig.trans = trans;
urlConfig.app = security;
urlConfig.admin = admin;
const urlConfigUtil = {
    install:function(Vue){
        window.urlConfig = urlConfig;
        Vue.prototype.$urlConfig = urlConfig;
    }
}

export default urlConfigUtil;  