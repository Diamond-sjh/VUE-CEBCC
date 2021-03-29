export default{
    getCustomerInfo:'/n/comein/comebus.do',//用户进线,获取客户信息
    addtelectricPaymentQuery:'/q/electricPaymentQuery/addtelectricPaymentQuery.do',//电子支付查询
    addNetUnionPaymentQuery:'/q/electricPaymentQuery/addNetUnionPaymentQuery.do',//网联支付查询
    callInSmallResultSave: '/q/callInSmallResult/save.do', // 来电小结

    //综合业务查询
    queryPersonalLoan:'/q/financeDemand/queryPersonalLoan.do',//个人贷款查询
   // queryDetailedInformation:'/q/financeDemand/QueryDetailedInformation.do', //个人贷款详细信息查询
    queryRepaymentPian:'/q/financeDemand/queryRepaymentPian.do' ,             //个人贷款还款计划查询 
    queryDetailsRepayment:'/q/financeDemand/queryDetailsRepayment.do',       //个人贷款明细查询  
    //网银查询列表
    internetBankingAction:'/q/channelSignDataQuery/internetBankingAction.do', //网银查询列表   
    
    //综合业务操作
    loanApply:'/q/loan/loanApply.do',                       //贷款申请
    SendSMS:'/q/loan/SendSMS.do',                           //发送营销短信
}