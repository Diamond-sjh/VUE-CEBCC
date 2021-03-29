<template>
  <!-- 个人贷款查询 -->
  <div class="repayment-plan-query">
    <div class ="backbutton">
        <el-button  @click ="backToPersonalLoanQuery">返回</el-button>
    </div>
    <div class ="repayment-plan-query-container">
    <p class = "repayment-plan-query-title"><span>贷款借据号：{{filName}}</span><span>还款方式：{{acctKind}}</span></p>
    <TableLazyLoad
      :tableData="tableData"
      :tableHeight="tableHeight"
      :pagesize="pagesize"
      :totalsizes="totalsizes"
      :hightlight="hightlight"
      @loadingMore="loadingMore"
      @handleSelectionChange="handleSelectionChange"
    >
      <template v-slot:tableList>
        <el-table-column prop="certnum" label="还款期次"></el-table-column>
        <el-table-column prop="billdate" label="应还款日期"></el-table-column>
        <el-table-column prop="amt3" label="还款本金"></el-table-column>
        <el-table-column prop="intamt" label="还款利息"></el-table-column>
        <el-table-column prop="tranamt" label="本息合计"></el-table-column>
      </template>
    </TableLazyLoad>
  </div>
  </div>
</template>
<script>
import TableLazyLoad from "@/pages/demos/TableLazyLoad";
export default {
  name: "repaymentplanquery",
  components: {
    TableLazyLoad
  },
  data() {
    return {
      tableData: [],
      tableHeight: "200",
      pagesize: 20,
      totalsizes: 70,
      hightlight: true,
      filName:'',
      acctKind:''

    };
  },
  props:{
    contentObj:{
    multipleSelection:Array, 
  }
  },
  created() {
    this.filName = this.contentObj.multipleSelection[0].filName;
    this.acctKind = this.contentObj.multipleSelection[0].acctKind;
    this.fetchPersonalLoandata();
  },
  methods: {
    fetchPersonalLoandata() {
      let param = {
                    billNo: this.filName,
                }
   this.$MainAjax.doPost(urlConfig.trans.queryRepaymentPian, param).then(res => {
              this.tableData = res?res.dataList1:[]
          });

    },
    loadingMore() {
      console.log("====loadingMore====");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    backToPersonalLoanQuery(){
       let url = 'debit/query/personalloanquery/PersonalLoanQuery'
      
      this.$emit("changeUrl",url);
    }
  }
};
</script>
<style scope>

.repayment-plan-query .backbutton{
  text-align: right;
   margin-bottom:15px;
}

.repayment-plan-query-container .el-table th,
.repayment-plan-query-container .el-table td{
  text-align: center;
}
.repayment-plan-query-container .repayment-plan-query-title span:last-child{
 margin-left:120px
}
</style>