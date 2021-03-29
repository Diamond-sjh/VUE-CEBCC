<template>
    <div class="lehui-account-info">
            <table class="table-public table-public-border">
      <tbody>
        <tr>
          <th style="width:13%">账号</th><td style="width:20%"></td>
          <th style="width:13%">币种</th><td style="width:20%"></td>
          <th style="width:13%">卡片种类</th><td style="width:20%"></td>
        </tr>
         <tr>
            <th>锁定码1</th><td>15118670924</td>
            <th>锁定码1维护日期</th><td>15118670924</td>
            <th>锁定码2</th><td>15118670924</td>
         </tr>
          <tr>
            <th>锁定码2维护日期</th><td>15118670924</td>
            <th>信用额度</th><td>15118670924</td>
            <th>可用额度</th><td>15118670924</td>
         </tr>
          <tr>
            <th>未入账支出</th><td>15118670924</td>
            <th>未入账存款</th><td>15118670924</td>
            <th>已取现金额</th><td>15118670924</td>
         </tr>
          <tr>
            <th>可用取现额度</th><td>15118670924</td>
            <th>账户CD值</th><td>15118670924</td>
            <th>居住地标识</th><td>15118670924</td>
         </tr>
          <tr>
            <th>发卡地ID</th><td>15118670924</td>
            <th>账户状态</th><td>15118670924</td>
            <th>开户日期</th><td>15118670924</td>
         </tr>
          <tr>
            <th>存档号</th><td>15118670924</td>
            <th>申请号</th><td>15118670924</td>
            <th>当月消费总次数</th><td></td>
         </tr>
          <tr>
            <th>当月消费总金额</th><td>15118670924</td>
            <th>当年消费总次数</th><td>15118670924</td>
            <th>当年消费总金额</th><td>15118670924</td>
         </tr>
         <tr>
            <th>当月取现总次数</th><td>15118670924</td>
            <th>当月取现总金额</th><td>15118670924</td>
            <th>当年取现总次数</th><td>15118670924</td>
         </tr>
         <tr>
            <th>当年取现总金额</th><td>15118670924</td>
            <th>开卡至今取现总次数</th><td>15118670924</td>
            <th>开卡至今取现总金额</th><td>15118670924</td>
         </tr>
         <tr>
            <th>开卡至今消费总次数</th><td>15118670924</td>
            <th>开卡至今消费总金额</th><td>15118670924</td>
            <th>当月消费退单总次数</th><td>15118670924</td>
         </tr>
         <tr>
            <th>当月消费退单总金额</th><td>15118670924</td>
            <th>当年消费退单总次数</th><td>15118670924</td>
            <th>当年消费退单总金额</th><td>15118670924</td>
         </tr>
           <tr>
            <th>开户日期</th><td>15118670924</td>
            <th>关闭日期</th><td>15118670924</td>
            <th>开卡至今消费退单总次数</th><td>15118670924</td>
         </tr>
           <tr>
            <th>开卡至今消费退单总金额</th><td>15118670924</td>
            <th>最后付款额</th><td>15118670924</td>
            <th>最后付款额日期</th><td>15118670924</td>
         </tr>
         <tr>
            <th>最后消费额</th><td>15118670924</td>
            <th>最后消费额日期</th><td>15118670924</td>
            <th>首消费</th><td>15118670924</td>
         </tr>
         <tr>
            <th>首消费日期</th><td>15118670924</td>
            <th>最后取现额</th><td>15118670924</td>
            <th>最后取现额日期</th><td>15118670924</td>
         </tr>
         <tr>
            <th>本期已还款</th><td>15118670924</td>
            <th>自动还款方式</th><td>15118670924</td>
            <th>自动还款类型</th><td>15118670924</td>
         </tr>
          <tr>
            <th>自动还款账号</th><td>15118670924</td>
            <th>扣款账户开户行</th><td>15118670924</td>
            <th>
                <el-checkbox v-model="check" label="1"></el-checkbox> 贷方余额自动转出标识</th>
            <td style="padding:2px 10px;">
                <el-select v-model="autoOut" size="small" :disabled="check != 1">
                    <el-option
                    v-for="(item, index) in autoOutList"
                    :key="index"
                    :label="item.label"
                    :value="item.value">

                    </el-option>
                </el-select>
            </td>
         </tr>
          <tr>
            <th>保证金授信标识</th><td>15118670924</td>
            <th>保证金授信账号</th><td style="padding:2px 10px;">
                <el-select v-model="accountId" @change="changeAccount" size="small">
                    <el-option
                    v-for="(item, index) in accountList"
                    :key="index"
                    :label="item.label"
                    :value="item.value">

                    </el-option>
                </el-select>
            </td>
            <th>保证金授信账号类型</th><td>15118670924</td>
         </tr>
      </tbody>
    </table>
    <table class="table-public custom-border">
         <thead>
           <tr>
            <th>保证金授信开户行</th>
            <th>保证金授信金额</th>
            <th>保证金授信冻结时间</th>
            <th>保证金授信有效期</th>
         </tr>
        </thead>
        <tbody>
            <tr>
                <td>北京银行</td>
                <td>10000</td>
                <td>2019-10-10</td>
                <td>2019-10-10</td>
            </tr>
             <tr>
                <td>北京银行</td>
                <td>10000</td>
                <td>2019-10-10</td>
                <td>2019-10-10</td>
            </tr>
        </tbody>
    </table>
    </div>
</template>
<script>
export default {
    data () {
        return {
            accountId: '',
            accountList: [
                {label: 11111, value: 1},
                {label: 22222, value: 2},
                {label: 33333, value: 3},
            ],
            check: '',
            autoOut: 1,
            autoOutList: [{label: '开通', value: 1}, {label: '关闭', value: 2}]
        }
    },
    methods: {
        changeAccount () {
            console.log(this.accountId)
        },
        modifyBtnClickHandler () {}
    }
}
</script>

<style scoped>
.lehui-account-info .custom-border{
    border-left: 1px solid #bbd5fb;
    border-right: 1px solid #bbd5fb; 
}
.lehui-account-info .custom-border td{
    border-bottom: 1px solid #bbd5fb;
}
</style>
<style>
.lehui-account-info .el-input--small .el-input__inner {
    height: 26px;
    line-height: 26px;
}
.lehui-account-info .el-input--small .el-input__icon{
    line-height: 26px;
}
.lehui-account-info .el-checkbox__label{
    display: none;
}
</style>



