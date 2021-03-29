<template>
<!--用户卡列表右侧信息显示区  -->
  <div class="customer-card-list">
    <el-tabs class="tab-container" v-model="activeName2" type="card" tab-position="left" @tab-click="handleClick">
      <el-tab-pane class="tab-panel-inner" label="借" name="first">
        <el-table 
          ref="multipleTable" 
          class="card-table" 
          :data="tableData" 
          height="170" 
          tooltip-effect="dark" 
          style="max-width: 100%" 
          align="center" 
          header-align="center" 
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="30"></el-table-column>
          <el-table-column prop="custNo" label="客户号" width="90"></el-table-column>
          <el-table-column prop="AcctNo" label="账/卡号" width="130"></el-table-column>
          <el-table-column prop="state1" label="凭证种类" width="80"></el-table-column>
          <el-table-column prop="state2" label="凭证状态" width="70"></el-table-column>
          <el-table-column prop="BalAmt" label="可用余额" width="80"></el-table-column>
          <el-table-column prop="UnitName" label="卡种" min-width="120"></el-table-column>
          <el-table-column prop="InstName" label="开户行" min-width="100"></el-table-column>
          <el-table-column prop="state0" label="凭证币种" width="80"></el-table-column>
          <el-table-column prop="CertSeq" label="最后一次交易时间" width="110"></el-table-column>
          <el-table-column prop="Date1" label="开户日期" width="80"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="贷" name="second">
        <!-- 信用卡列表 卡号 -->
        <el-table-column prop="AcctNo" label="账/卡号" width="130"></el-table-column>
        <el-table-column prop="state1" label="主/副卡" width="80"></el-table-column>
        <el-table-column prop="state2" label="机构" width="70"></el-table-column>
        <el-table-column prop="UnitName" label="卡种" width="80"></el-table-column>
        <el-table-column prop="UnitName" label="锁定码" width="80"></el-table-column>
        <el-table-column prop="InstName" label="可用额度" min-width="100"></el-table-column>
        <el-table-column prop="state0" label="账单日期" width="130"></el-table-column>
        <el-table-column prop="CertSeq" label="应还款" width="110"></el-table-column>
        <el-table-column prop="Date1" label="剩余应还款" width="80"></el-table-column>
        <el-table-column prop="Date1" label="积分" width="80"></el-table-column>
      </el-tab-pane>
      <el-tab-pane label="合" name="third">
        <CreditAndDebitCardLst></CreditAndDebitCardLst>
      </el-tab-pane>
      <el-tab-pane label="公" name="fourth">公</el-tab-pane>
    </el-tabs>
  </div>
    
</template>
<script>
import CardLstTemplate from '@/pages/main/CardLstTemplate'
export default {
  components:{CreditAndDebitCardLst},
  data(){
    return{
      activeName2: 'first',//切换标签
      //卡列表
      tableData: [],
      tableDebit:[],//综合业务 借记卡
      tableCredit:[],//信用卡，贷记卡
      tableCreditAndDebit:[],//借贷合一
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    updateView(customer){
      console.log("RightCustomerCardList.updateView()");
      this.tableData = customer.AccountCardList;
    }
  }
}
</script>

<style scoped>
  .customer-card-list{
    background:white;
    padding:10px 0px 0px 10px;
    height: 200px;
   
  }
  .customer-card-list .tab-container{
    width:100%;
    overflow: hidden;
  }
  .customer-card-list .tab-container .tab-panel-inner{
    width: 100%;
    overflow: hidden;
  }
  .customer-card-list .card-table{
    font-size: 12px!important;
  }
  .customer-card-list .card-table .pd0{
    padding:0px !important;
  } 
</style>