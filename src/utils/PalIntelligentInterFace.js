import '@/assets/plugins/palSDK/index.js'
import { reject } from 'q';
/**
 * 智能质检系统接口，
 * 
 * 
 */
window.palIntelligentSys = {
    baseURL:'http://127.0.0.1:8348' ,//追一服务器地址信息
    userInstance : null,
    requestSingleton:null,
    socketChecker:null,//电话实时质检模块内容
    isInit:false,
    authInfo:null,
    /**
     * 初始化智能辅助系统
     * @param {*} baseURL 
     */
    sysInit:function(baseURL,user){
        if(!this.isInit){
            this.baseURL = baseURL?baseURL:this.baseURL;
            this.requestSingleton = window.RequestSingleton.getInstance({baseURL});
            this.isInit = true;
        }
        
    },
    /**
     * 座席登录的信息
     * {
            username: 'paladmin@zhxyk.com',
            password: 'paladmin777'
        }
     * @param {*} user 
     */
    signin:function(user){
        if(!this.userInstance){
            this.userInstance = new window.User({
                $http: this.requestSingleton,
                signinUrl: '/api/v1/user/auth',
                signinMethod: 'post'
            });
        }
        return new Promise((resolve,reject)=>{
            if(!this.userInstance)
            {
                console.log("[error] palIntelligentSys.userInstance init failed");
                reject("[error] palIntelligentSys.userInstance init failed");
            }else{
                //todo如果座席已登录 （localStorage获取），直接返回，未登录需要登录授权
                this.userInstance.signin(user).then((result) => {
                    console.log('palIntelligentSys----登录成功');
                    console.log(result);
                    resolve(res);
                },error=>{
                    reject(error);
                });
            }
            
        });
    },
    signOut:function(){
        if(!this.userInstance) return;
        this.userInstance.signout();
    },
    //开启实时质检系统
    realTimeCheckerStart:function(){
        if(!this.socketChecker){
            this.socketChecker = window.SocketChecker;
            this.socketChecker.init({
            debug: window.constants.debug,
            });
        }
        // 开始与中控 websocket 连接的方法函数，执行后会开始触发各种事件连接。
        this.socketChecker.start();
        this.realTimeChecker();
    },
    /**
     * 实时质检系统用
     */
    realTimeChecker:function(){
        this.socketChecker.on('connectSuccess', () => {
            console.log('[info] PalIntelligentInterFace realTimeChecker connect sucessfully');
        });
        this.socketChecker.on('connectError', () => {
          console.log('[error] PalIntelligentInterFace realTimeChecker connect failed');
        });
        this.socketChecker.on('sessionStart', (event, data) => {
            //有电话接入后的响应时间，取回坐席的信息以及用的信息，对话内容等
          console.log('[info] PalIntelligentInterFace realTimeChecker sessionStart', data);
        });


        /*
            sessionChatting 的返回结果内容结构体
            var data  = {
                sessionId: '123456789', 
                checkResult: { 
                    checkData: { conversationLen: 1 }, 
                    knowledgeCheckResult: [],
                    knowledgeResult: [{ 
                        chatId: 0, 
                        faqId: 32, 
                        question: "客户期望办理信用卡", 
                        startTime: "2019-08-28 16:53:32", 
                        answer: [ {content: "由于您是我行的贵宾客户，在此给您推荐我行的贵宾白金卡，一年可免费尊享5次机场候机服务", title: "推荐白金卡", } ] 
                    } ], //「业务知识点」 faq结构体
                    noticeResult: [ 
                        { chatId: 0, checkStage: 0 ,matchKeyWordArr: [], remainderClassify: 2 ,remainderType: 2 ,ruleDescription: "这是业务提醒", 
                        ruleId: 30 ,ruleName: "业务提醒--信用卡" ,startTime: "2019-08-28 01:09:18",violationStatus: 0 } 
                    ], 
                    conversations: [ 
                        { 
                            content: "您好，这里是招商银行信用卡中心，很高兴为您服务", 
                            endTimestamp: "3.500" ,
                            identity: 2, 
                            interrupt: 0 ,
                            isChatFinish: true,
                            messageType: 2, sentenceId: "1566915465670", sentiment: 1, speed: 900 ,startTime: "2019-08-28 01:09:18", startTimestamp: "1.700" ,
                            tagId: { info: { owner: "2", question: "您好，这里是招商银行信用卡中心，很高兴为您服务" },}
                        }
                    ]
                }
            };
        */

        this.socketChecker.on('sessionChatting', (event, data) => {
          console.log('----> 会话进行中', data);
          
        });
        this.socketChecker.on('updateSmartForm', (event, data) => {
          console.log('----> 智能表单字段更新', data);
          
        });
        this.socketChecker.on('sessionEnd', (event, data) => {
          console.log('----> 会话结束了', data);
        });
    },
    //关闭实时质检系统
    realTimeCheckerStop:function(){
        console.log("[info] PalIntelligentInterFace.realTimeCheckerStop()");
        if(this.socketChecker){
            this.socketChecker.close();
        }
    },
    //业务场景模块初始化，知识库搜索用
    scenceInit:function(){
        window.ProcessScene.init();
    },                  
    /**
     * 
     * @param {*} info 搜索条件
     * info：{
     * query: string,
     * pageSize:int,
     * currentPage:int,
     * } 
     * @param {*} cb 
     */
    //根据场景中的文字模糊搜索内容                                    
    scenceQuery:function(info,cb){
        window.ProcessScene.getProcessScene({
            query:info.query,
            pageSize:info.pageSize,
            currentPage:info.currentPage,
        }).then(req=>{
            if(cb){
                cb(req);
            }
        //    let qq =  { 
        //        "code":200, 
        //        "data":{ 
        //            "currentPage":1, "pageSize":1, "totalNums":2, 
        //            "scene":[ { "categoryId":1127, "name":"办理挂失信用卡场景", "desc":"当客户提及需要办理挂失信用卡时，进入该场景" } ] 
        //         }, 
        //         "msg":"success" 
        //     }
        })
    }
}




