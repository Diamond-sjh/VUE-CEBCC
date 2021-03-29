//基本校验规则加载
import '@/core/utils/ValidateConfig.js'

//单个项目当中需要用到的其他特殊校验规则
const validate = {
    cradicardNo:function(rule, value, callback){
        console.log("信用卡卡號規則");
        callback();
    },
    /**
     * 坐席操作员号校验
     * @param {*} rule 
     * @param {*} value 
     * @param {*} callback 
     */
    agentOptionNo:function(rule,value,callback){
        callback();
    },
    /**
     * 员工号校验，定长6位字母+数字 (另一种是首位为大写字母或数字+5位数字)
     * @param {*} rule 
     * @param {*} value 
     * @param {*} callback 
     */
    agentCode:function(rule,value,callback){
        var pattern = /[0-9A-Za-z]{6}$/;
        // var pattern = /^[0-9A-Z][0-9]{5}$/;(另一种是首位为大写字母或数字+5位数字)

        if(rule.required == true && !value){
            callback(new Error('员工号不能为空'));
        }else{
            if(pattern.test(value)){
                callback();
            }else{
                callback(new Error('员工号必须为6位的字母+数字'));
            }
        }
    },

    /**
     * 用户姓名，最大10位，没有其他限制
     * @param {*} rule 
     * @param {*} value 
     * @param {*} callback 
     */
    agentName:function(rule,value,callback){
        if(rule.required == true && !value){
            callback(new Error('用户姓名不能为空'));
        }else{
            if(value && value.length > 10){
                callback(new Error('用户姓名最大不能超过10个字符或汉字'))
            }else{
                callback();
            }
        }
    },
    /**
     * 坐席的密码规则 必须是数字+字母的组合（区分大小写） 6-10位字符
     * @param {*} rule 
     * @param {*} value 
     * @param {*} callback 
     */
    agentPassword:function(rule,value,callback){
        let pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/;
        if(value.required == true && (!value || value=='')){
            callback('请输入密码');
        }else{
            if(pattern.test(value)){
                callback();
            }else{
                callback(new Error('6-10位数字+字母的组合(区分大小写)'));
            }
        }
    },
}

Object.assign( window.csrValidate,validate);