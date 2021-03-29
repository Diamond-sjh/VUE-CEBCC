/**
 * 全局的项目配置内容，使用配置项目中的需求，
 * 统一平台需求订制内容配置
 */

window.projectConfig = {
    admin:{
        multiTab:false,//是否多页签展示后台管理页面
        multiTabCache:false,//是否缓存多页面
    },
    csr:{
        chat:true,//是否存在聊天功能（后期应该把聊天以及store拆出来用）
    },
    base:{
        phoneLibarary:"",//软电话平台
        chatLibarary:"",//聊天平台
        lang:"zh-CN",
    },
}