window.csrValidate = {
    // 年龄校验
    checkAge:function(rule, value, callback){
        if (rule.required == true && !value) {
          return callback(new Error('年龄不能为空'));
        }
        if(value.length<=0){
            return callback();
        }
        if (!Number.isInteger(value)) {
           return callback(new Error('请输入数字值'));
        } else {
            if (value < 18) {
                return callback(new Error('必须年满18岁'));
            } else {
                return callback();
            }
        }
    },
    email:function(rule, value, callback){
       
        if (rule.required == true && !value) {
          return callback(new Error('邮箱不能为空'))
        }

        if(value.length<=0){
           return callback();
        }
        const mailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

        if (mailReg.test(value)) {
           return callback()
        } else {
           return callback(new Error('请输入正确的邮箱格式'))
        }
    },
    /**
     * 判断手机格式是否正确
     * @param mobiles
     * @return
     * 移动：134、135、136、137、138、139、147（无线上网卡）、150、151、152、157、158、159、182、183、187、188、178
     * 联通：130、131、132、145（无线上网卡）、155、156、185（iPhone5上市后开放）、186、176（4G号段）、
     * 175（2015年9月10日正式启用，暂只对北京、上海和广东投放办理）
     * 电信：133、153、180、181、189、177、173、149
     * 总结起来就是第一位必定为1，第二位必定为3或4或5或7或8，其他位置的可以为0-9
     */
    mobile:function(rule, value, callback){
    //        String telRegex = "[1][34578]\\d{9}";
        if(rule.required == true && !value) {
            return callback(new Error('手机号不能为空'));
        }
        if(value.length>0){
            if(value.length !=11 ){
                return callback(new Error('手机号长度不正确'));
            }
            var telRegex =  /^[1][3,4,5,7,8][0-9]{9}$/;
            if (telRegex.test(value)) {
               return callback()
            } else {
               return callback(new Error('请输入正确的手机号'))
            }
        }else{
            return callback();
        }
        
    },
    /**
     * 银行行卡号基本验证，以后可能有各种卡号的规范。。。慢慢加吧，例如卡号开头规则，长度等等
     * @param {*} rule 
     * @param {*} value 
     * @param {*} callback 
     */
    cardNo:function(rule,value,callback){
        if(rule.required == true && !value) {
            return callback(new Error('卡号不能为空'));
        }
        if(value.length<=0){
            return callback();
        }
        var pattern = /^([1-9]{1})(\d{14}|\d{18})$/;
        if (pattern.test(value)) {
            return callback()
         } else {
            return callback(new Error('请输入正确的卡号'))
         }
    },

}