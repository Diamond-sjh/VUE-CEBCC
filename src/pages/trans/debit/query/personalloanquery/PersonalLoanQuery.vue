<template>
  <!-- 个人贷款查询 -->
  <div class="personal-loan-query">
    <TableLazyLoad
      :tableData="tableData"
      :tableHeight="tableHeight"
      :totalsizes="totalsizes"
      :hightlight="hightlight"
      @loadingMore="loadingMore"
      @handleSelectionChange="handleSelectionChange"
    >
      <template v-slot:tableList>
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="channelSource" label="贷款平台" width =100></el-table-column>
        <el-table-column label="授信方式">
          <template slot-scope="scope">
            <div>
              <span>{{scope.row.email ? scope.row.email:"--"}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="filName" label="贷款借据号"></el-table-column>
        <el-table-column prop="status" label="自动还款查询"></el-table-column>
        <el-table-column prop="ctryCode" label="贷款类别"></el-table-column>
        <el-table-column prop="balAmt" label="贷款金额"></el-table-column>
        <el-table-column prop="date1" label="放款日期"></el-table-column>
        <el-table-column prop="intAmt" label="贷款余额"></el-table-column>
        <el-table-column prop="upCredNo" label="经办支行"></el-table-column>
        <el-table-column prop="state" label="贷款状态"></el-table-column>
      </template>
    </TableLazyLoad>
  </div>
</template>
<script>
import TableLazyLoad from "@/pages/demos/TableLazyLoad";
export default {
  name: "personalloanquery",
  components: {
    TableLazyLoad
  },
  data() {
    return {
      tableData: [],
      tableHeight: "200",
      totalsizes: 0,
      hightlight: true,
      multipleSelection: [],
      Count1 :1,
      Count2:5,
      CustNo: "6226500501000222"
    };
  },
  created() {
  // this.tableData.push({filName:1111,channelSource:"450"})
    this.fetchPersonalLoandata();
  },
  methods: {
    fetchPersonalLoandata() {
      let param = {
        CustNo: this.CustNo,
        Count2: this.Count2,
        Count1:this.Count1,
      };
       this.Count1 +=5;
     // console.log(param)
      this.$MainAjax.doPost(urlConfig.trans.queryPersonalLoan, param).then(res => {
        console.log(res.dataList)
        if(res.retCode ==="AAAAAAA"){
          this.tableData = res.dataList ? res.dataList : [];
          this.totalsizes = res.TtlCount ;  
        }
          
        });
    },

    loadingMore() {
      console.log("====loadingMore====");
      this.fetchPersonalLoandata();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    detailMessageQuery(button) {
      if (this.multipleSelection.length !== 1) {
        this.$message({
          showClose: true,
          message: "请选择一条数据！",
          type: "warning"
        });
        return;
      }
      this.$emit("changeUrl", button.url);
    },
    repayPlanQuery(button) {
      if (this.multipleSelection.length !== 1) {
        this.$message({
          showClose: true,
          message: "请选择一条数据！",
          type: "warning"
        });
        return;
      }
      this.$emit("changeUrl", button.url);
    },
    detailRepayQuery(button) {
      if (this.multipleSelection.length !== 1) {
        this.$message({
          showClose: true,
          message: "请选择一条数据！",
          type: "warning"
        });
        return;
      }
      this.$emit("changeUrl", button.url);
    }
  }
};
</script>
<style scope>
.personal-loan-query .el-table th,
.personal-loan-query .el-table td {
  text-align: center;
}
</style>