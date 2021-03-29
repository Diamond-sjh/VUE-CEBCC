export default{
    queryRolesByAccCode:"/q/csrLogin/queryRolesByAccCode.do",
    //登录功能
    loginStart:'/q/csrLogin/loginStart.do',//登陆接口
    loginAgentPassEdit:'/q/csrLogin/loginAgentPassEdit.do',//坐席修改登录密码
    loginIsValidUser:"/q/csrLogin/loginIsValidUser.do",//根据用户编号判断用户是否存在
    // transRule:'/transRuleTest.do'//测试用交易规则
    loginOut:"/q/csrLogin/loginOut.do",//登出接口
    queryBusinessRule:'/q/business/queryBusinessRule.do',//菜单的交易规则查询，返回菜单规则结果以及菜单的按钮权限列表
}