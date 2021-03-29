<template>
  <!--详细信息查询 -->
  <div class="detail-message-query">
    <div class = "backbutton">
     <el-button  @click ="backToPersonalLoanQuery">返回</el-button>
    </div>
    <table class="table-public table-public-border">
      <tbody>
        <tr>
          <th class="label16">产品名称</th><td class="label16">{{detaildata.productName | formatName}}</td>
          <th class="label16">贷款借据号</th><td class="label16">{{detaildata.filName | formatName}}</td>
          <th class="label16">贷款类别</th><td class="label16">{{detaildata.ctryCode | formatName }}</td>
        </tr>
         <tr>
          <th>贷款渠道</th><td>{{detaildata.channelSource | formatName }}</td>
          <th>贷款金额</th><td>{{detaildata.intAmt | formatName }}</td>
          <th>贷款币种</th><td>{{detaildata.acctKnd1 | formatName }}</td>
         </tr>
          <tr>
          <th>贷款实际年利率</th><td>{{detaildata.corpCode | formatName }}</td>
          <th>贷款状态</th><td>{{detaildata.state | formatName }}</td>
          <th>放款日期</th><td>{{detaildata.date1 | formatName }}</td>
         </tr>
          <tr>
          <th>到期日期</th><td>{{detaildata.date2 | formatName }}</td>
          <th>还款账户</th><td>{{detaildata.taxCertNo | formatName }}</td>
          <th>还款方式</th><td>{{detaildata.acctKind | formatName }}</td>
         </tr>
          <tr>
          <th>还款周期</th><td>{{detaildata.areaCode | formatName }}</td>
          <th>还款日期</th><td>{{detaildata.date3 | formatName }}</td>
          <th>扣款账号</th><td>{{detaildata.cardNo | formatName }}</td>
         </tr>
          <tr>
          <th>扣款日期</th><td>{{detaildata.date3 | formatName }}</td>
          <th>累计逾期期数</th><td>{{detaildata.induTyp | formatName }}</td>
          <th>逾期本息</th><td>{{detaildata.amt1 | formatName }}</td>
         </tr>
          <tr>
          <th>联系地址</th><td>{{detaildata.remark | formatName }}</td>
          <th>经办支行</th><td>{{detaildata.upCredNo | formatName }}</td>
          <th>手机号</th><td>{{detaildata.postCode | formatName }}</td>
         </tr>
          <tr>
          <th>邮编</th><td>{{detaildata.corpOutCode | formatName }}</td>
         </tr> 
         
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: "detailmessagequery",
  data() {
    return {
      detaildata: {},
    };
  },
  props:{
    
  contentObj:{
    multipleSelection:Array,
    CustNo:String,  
  }
  },
  created() {

  },
  mounted(){
    if(this.contentObj.multipleSelection){
      this.detaildata = this.contentObj.multipleSelection[0] 
    }
  },
  methods: {
    backToPersonalLoanQuery(){
     let url = 'debit/query/personalloanquery/PersonalLoanQuery'
      
      this.$emit("changeUrl",url);
    }
  },
  filters:{
    formatName:function(value){
           if(!value) value = "--" 
           return value
    }
  }
};
</script>
<style scope>

.detail-message-query .backbutton{
 text-align: right;
 margin-bottom:15px;
}


.detail-message-query .table-public .label16{
  width: 16%;
}
</style>
