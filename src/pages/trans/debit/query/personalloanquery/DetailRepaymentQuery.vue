<template>
  <!-- 贷款详细查询 -->
  <div class="detail-repayment-query">
  <div class ="repayment-repayment-query-container">
   <div class= "backbutton">
   <el-button @click="btnQueryClickHandler">查询</el-button><el-button @click ="backToPersonalLoanQuery">返回</el-button>
   </div>
    <el-row :gutter = "10">
      <el-form label-width="130px" :model="queryForm">
      <el-col :span="8">
        <el-form-item label="贷款借据号:">
            <span>{{filName}}</span> 
        </el-form-item>
      </el-col>
       <el-col :span="8">
        <el-form-item label="开始日期">
            <el-date-picker v-model ="queryForm.startTime" type="date" format="yyyyMMdd" ></el-date-picker>
        </el-form-item>
      </el-col>
        <el-col :span="8">
        <el-form-item label="结束日期">
            <el-date-picker v-model ="queryForm.endTime" type="date" format="yyyyMMdd" ></el-date-picker>
        </el-form-item>
      </el-col>
      </el-form>
    </el-row>
   <el-table
   :data ="tableData"
   :height ="tableHeight"
   :highlight-current-row ="highlight"
   border
   style ="width:100%"
   >
   <el-table-column type ="index" label ="序号" width ="120"></el-table-column>
   <el-table-column prop = "clearCode" label ="还款期次"></el-table-column>
   <el-table-column prop = "Date3" label ="应还款日期"></el-table-column>
   <el-table-column  label ="实际还款金额">
        <template slot-scope="scope">
            <div>
              <span>{{scope.row.timeBgn ? scope.row.timeBgn:"--"}}</span>
            </div>
          </template>
   </el-table-column>
   <el-table-column  label ="还款金额">
        <template slot-scope="scope">
            <div>
              <span>{{scope.row.areaAmt ? scope.row.areaAmt:"--"}}</span>
            </div>
          </template>
   </el-table-column>
   <el-table-column prop = "TranAmt" label ="实还本金"></el-table-column>
   <el-table-column prop = "buyPrice" label ="总利息"></el-table-column>
   <el-table-column prop = "areaCode" label ="还款类型"></el-table-column>
   </el-table>
  </div>
  </div>
</template>
<script>
import {getDateTime} from '@/core/utils/GlobalMethods';
export default {
  name: "detailrepaymentquery",
  
  data() {
    return {
      tableData: [],
      tableHeight: "240",
      highlight: true,
      filName:"",
      channelSource1:"",

      queryForm:{
          startTime:new Date(new Date().getFullYear(),new Date().getMonth()-12,new Date().getDate()+1),
          endTime:new Date()
      }

    };
  },
  props:{
    contentObj:{
    multipleSelection:Array, 
  }
  },
  created() {
    this.filName = this.contentObj.multipleSelection[0].filName;
    this.channelSource1 = this.contentObj.multipleSelection[0].channelSource;
    console.log( this.contentObj.multipleSelection[0],'这是接收的数据')
    this.fetchPersonalLoandata();
  },
  methods: {
    fetchPersonalLoandata() {
      // this.tableData.push(
      //   { Date3: "20190504" },
      //   { Date3: "20190504" },
      //   { Date3: "20190504" },
      //   { Date3: "20190504" },
      //   { Date3: "20190504" }
      // );
    let startTimes =new Date(this.queryForm.startTime).getTime()/1000;
    let endTimes =  new Date(this.queryForm.endTime).getTime()/1000;
    let times = endTimes-startTimes;
   if(times<0){
      this.csrAlert.warning("开始日期需小于结束日期！")
      return;
   }
    if(times >365*3600*24){
      this.csrAlert.warning("起始年月与终止年月跨度需小于等于一年！")
        return;
    }
     ;
    
    let param ={
      channelSource1:this.channelSource1,
      DueBillNo : this.filName,
      Date1:getDateTime(this.queryForm.startTime,true,false,''),
      Date2:getDateTime(this.queryForm.endTime,true,false,'')
    }
    console.log( param )
    this.$MainAjax.doPost(urlConfig.trans.queryDetailsRepayment, param).then(res => {
      
      this.tableData = res?res.gd03List:[];
       
    })
    },
  btnQueryClickHandler(){
    this.fetchPersonalLoandata()
  },
    backToPersonalLoanQuery(){
     let url = 'debit/query/personalloanquery/PersonalLoanQuery'
      
      this.$emit("changeUrl",url);
    }
  
  }
};
</script>
<style scope>
.detail-repayment-query .repayment-repayment-query-container .backbutton{
  text-align: right;
  margin-bottom: 15px;
}
.detail-repayment-query .repayment-repayment-query-container .el-row{
  margin-top:12px;
}
.detail-repayment-query .repayment-repayment-query-container .el-table{
  margin:0 auto;

}
.detail-repayment-query .repayment-repayment-query-container .el-table tr th,
.detail-repayment-query .repayment-repayment-query-container .el-table tr td{
  text-align: center;
 
}
</style>