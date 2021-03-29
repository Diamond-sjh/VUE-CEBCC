/**
 * 坐席的相关信息缓存内容，包含坐席的基本信息，菜单相关，权限相关等等，
 * 坐席自己的系统配置设定信息，一般在登录时候返回
 */
import * as types from './mutation-types' 
import MainAjax from "../core/utils/MainAjax";
// import '@/assets/lib/base64.min.js';
export default{
    state:{
        agent:null,
        agent_token:null,
        userID:'',
        userTopInfo:{
            loginTime: new Date(),
            satisfied:90.5,
            num:50,
            phoneTime: 180,//通话时长，秒数
        },//坐席头部的基本信息
        roleLst:[],//坐席权限列表
        navLst:{},//坐席的左侧菜单权限列表
        transMenu:[],//菜单列表
        transMenuDic:new Map(),//维护一个菜单的键值对列表，用于查找指定menu信息
        crtTypeLst:[
            {label:"身份证", value:"1"},
            {label:"护照", value:"2"},
            {label:"军人证", value:"3"},
            {label:"武警证" ,value:"4"},
            {label:"港澳台通行证" ,value:"5"},
            {label:"户口簿", value:"6"},
            {label:"台湾居民来往大陆通行证", value:"9"},
            {label:"外国人永久居留证", value:"a"},
            {label:"港澳居民居住证", value:"b"},
            {label:"台湾居民居住证", value:"c"},
            {label:"其他", value:"8"},
        ],//证件类型dic
        quickTransMenu:[],//常用菜单表
        adminMenu:[],//后台管理菜单列表
    },
    mutations:{
        [types.AGENT_LOGIN] (state, info) {
            state.agent = info;
            //设置缓存的token;
            state.agent_token = info.agent_token;
            sessionStorage.setItem('agent_token',state.agent_token);
            sessionStorage.setItem('agent',JSON.stringify(state.agent));
        },
        [types.AGENT_LOGOUT](state,param){
            state.agent = null;
            state.agent_token = null;
            sessionStorage.removeItem('agent');
            sessionStorage.removeItem('agent_token');
        },
        //座席登录时的权限列表
        [types.SET_AGENT_ROLELST](state,lst){
            state.roleLst = lst?lst:[];
        },
        //座席的左侧系统菜单列表
        [types.SET_AGENT_NAVLST](state,lst){
            state.navLst = lst?lst:[];
            console.log("state.navLst",state.navLst);
            sessionStorage.setItem('navLst',JSON.stringify(state.navLst));
        },
        //座席的业务菜单列表
        [types.SET_AGENT_TRANSMENU](state,lst){
            state.transMenu = lst && lst.menus?lst.menus:[];
            sessionStorage.setItem('transMenu',JSON.stringify(state.transMenu));

            //循环transmenu列表，放入dic中，方便查找三级菜单
            state.transMenu.forEach(element => {
                if(element.menus){
                    state.transMenuDic.set(element.id,element);
                    element.menus.forEach(menu=>{
                        state.transMenuDic.set(menu.id,menu);
                    });
                }
            });
            console.log(state.transMenuDic);
        },
        //座席常用菜单列表设置
        [types.SET_AGENT_QUICK_TRANSMENU_LST](state,lst){
            state.quickTransMenu =lst?lst:[];
            sessionStorage.setItem('quickTransMenu',JSON.stringify(state.quickTransMenu));
        },
        [types.SET_AGENT_ADMIN_MENU_LST](state,lst){
            state.adminMenu = lst?lst:[];
            console.log(state.adminMenu);
            sessionStorage.setItem('adminMenu',JSON.stringify(state.adminMenu));
        }
    },
    actions:{
        //用户登录
        actionAgentLogin:({commit,state},{agent,callback})=>{
            MainAjax.post(urlConfig.app.loginStart,agent).then(req =>{
                console.log(req);
                let success = false;
                if(req.retCode == constants.returnCode.success){
                    success = true;
                    commit(types.AGENT_LOGIN,req);
                    //csr菜单
                    // let transMenu=req.roleResourceMenuJson?Base64.decode(req.roleResourceMenuJson):[];
                    let transMenu;
                    let adminMenu;
                    if(constants.localData ){
                        transMenu=req.roleResourceMenuJson;    
                        adminMenu = req.roleResourceMenuBackJson;
                    }else{
                        let menus = JSON.parse(req.roleResourceMenuJson).menus;
                        for(let idx = 0 ;idx < menus.length;idx++){
                            if(menus[idx].code == "P_2_M"){
                                //联络中心菜单
                                transMenu = menus[idx];
                                break;
                            }
                        }
                        // transMenu = JSON.parse(req.roleResourceMenuJson);
                        adminMenu = JSON.parse(req.roleResourceMenuBackJson);
                    }
                    // transMenu = JSON.parse(transMenu);
                    commit(types.SET_AGENT_TRANSMENU,transMenu);
                    
                    commit(types.SET_AGENT_ADMIN_MENU_LST,adminMenu);
                    //后台管理系统菜单，目前没什么用
                    // let roleMenu = req.roleResourceMenuBackJson?Base64.decode(req.roleResourceMenuBackJson):[];
                    commit(types.SET_AGENT_NAVLST,req.roleResourceZero?req.roleResourceZero:[]);
                    //设置座席的常用菜单
                    //todo:待定： 等待后台返回字段功能
                    commit(types.SET_AGENT_QUICK_TRANSMENU_LST,req.personalTransMenu ? req.personalTransMenu:[]);
                }else{
                    
                }
                if(callback){
                    callback(success,req.retMsg);
                }
             });
             return;/**/
        },
        //用户登出
        actionAgentLogOut:({commit,state},callback)=>{
            //坐席登出
            //发送后台坐席登出
            MainAjax.doPost(urlConfig.app.loginOut,{accCode:state.agent.accCodeParam}).then(req=>{
                commit(types.AGENT_LOGOUT,{});
                if(callback){//坐席登出后关闭系统或者返回登录，看具体逻辑callback中
                    callback();
                }
            }).catch(e=>{
                commit(types.AGENT_LOGOUT,{});
                if(callback){//坐席登出后关闭系统或者返回登录，看具体逻辑callback中
                    callback();
                }
            });
            
        },
        //根据用户sap获取用户角色列表
        actionGetAgentRole:({commit,state},{name,callback})=>{
            // return;
            //获取座席的角色列表
            /**
             * roleList:[
             *  {roleCode:'R0',roleName:"csr系统"},
             * ]http://10.200.26.125:8090
             */
            // MainAjax.doPost("http://10.200.26.125:8090/queryRolesByAccCode.do",{accCode:name})
            MainAjax.doPost(urlConfig.app.queryRolesByAccCode,{accCode:name})
            .then(req =>{
                let lst = req.roleList?req.roleList:[];
                commit(types.SET_AGENT_ROLELST,lst);
                if(callback){
                    callback(state.roleLst);
                }
            });
        },
        // 设置座席的常用菜单列表
        actionSetAgentQuickTransMenuLst:({commit,state},{menus,callback})=>{
            // MainAjax.doPost(urlConfig.app.xxxx,{})
            // .then(req=>{
            //     commit(types.SET_AGENT_QUICK_TRANSMENU_LST,{});
            // });
            let arr = [];
            if(!menus){
                return;
            }
            menus.forEach(it=>{
                let menu = state.transMenuDic.get(it);
                if(menu){
                    arr.push(menu);
                }
            });
            // console.log("send to server actionSetAgentQuickTransMenuLst----------",arr);
            commit(types.SET_AGENT_QUICK_TRANSMENU_LST,arr);
            if(callback){
                callback(arr);
            }
        }
    },
    getters:{
        getToken:state => {
            if(!state.agent_token){
                //获取sessionStore中的值，是否有数据缓存，存在直接获取内容，不需要登录
                if(sessionStorage.getItem('agent_token') && sessionStorage.getItem('agent_token')!='null' ){
                    state.agent_token= sessionStorage.getItem('agent_token');
                    let u = sessionStorage.getItem('agent');
                    state.agent = u && u!='null'?JSON.parse(u):null;
                    let lst = sessionStorage.getItem('navLst');
                    state.navLst = lst&&lst!='null'?JSON.parse(lst):[];
                    // console.log(state.navLst);
                    lst = sessionStorage.getItem('transMenu');
                    lst = lst && lst!='null'?JSON.parse(lst):[];
                    state.transMenu = lst;
                    if(!state.agent){
                        state.agent_token=null;
                    }
                    //常用菜单
                    lst = sessionStorage.getItem('quickTransMenu');
                    lst = lst && lst!='null'?JSON.parse(lst):[];
                    state.quickTransMenu = lst;

                    //后管菜单
                    lst= sessionStorage.getItem('adminMenu');
                    lst = lst && lst !='null'? JSON.parse(lst):[];
                    state.adminMenu = lst;
                }
            }
            return state.agent_token;
        },
        //获取座席token值
        getAgentToken:state=>state.agent_token,
        getAgentInfo:state=>state.agent?state.agent:{},
        getAgentRole:state=>state.agent?state.agent.roleCodeParam:'',
        getUserTopInfo:state=>state.userTopInfo,
        getUserRoleLst:state=>state.roleLst,
        getAgentNavLst:state=>state.navLst,
        getTransMenu:state=>state.transMenu,
        //根据menuId 获取menu的内容信息 ，子业务菜单的跳转
        getTransMenuItemById:(state,getters)=>(id)=>{
            return state.transMenuDic.get(id);
        },
        getCrtType:state=>state.crtTypeLst,
        //常用菜单选择state.agent.personalTransMenu.menus
        getAgentQuickTransMenu:state=>state.quickTransMenu ?state.quickTransMenu:[],
        getAgentAdminMenu:state=>state.adminMenu?state.adminMenu:[],

        
    }
}