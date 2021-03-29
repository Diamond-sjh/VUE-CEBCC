<template>
  <div class="cashSweepTermination">
    <el-button @click="CashSweepTermination_termination">解约</el-button>
    <div class="top">资金归集签约信息</div>
    <pagination :pageSize="1" :layout="'total,prev,pager,next,jumper'" :reloadData.sync="reloadData">
      <template v-slot:paginationContainer>
        <el-table
          @header-click="cancelHighlight"
          @row-dblclick="cancelHighlight "
          :cell-style="rowClass"
          :header-cell-style="headClass"
          ref="singleTable"
          :data="msgData"
          style="width: 100%"
          highlight-current-row
          @current-change="currentChange"
        >
          <el-table-column align="center" prop="deduct" label="被扣款卡号"></el-table-column>
          <el-table-column align="center" prop="payeeCard" label="收款行卡号"></el-table-column>
          <el-table-column align="center" prop="payeeName" label="收款人姓名"></el-table-column>
          <el-table-column align="center" prop="payeeBank" label="收款银行名称"></el-table-column>
          <el-table-column align="center" prop="signDate" label="签约日期"></el-table-column>
        </el-table>
      </template>
    </pagination>
  </div>
</template>

<script>
import pagination from "@/core/components/PaginationContainer";
export default {
  name: "CashSweepTermination",
  components: { pagination },
  data() {
    return {
      msgData: [
        {
          deduct: 12345678810,
          payeeCard: 10987654321,
          payeeName: "张三",
          payeeBank: "北京支行",
          signDate: 20191205
        },
        {
          deduct: 12345678910,
          payeeCard: 10987654321,
          payeeName: "张三1",
          payeeBank: "北京支行1",
          signDate: 20191205
        },
        {
          deduct: 123456781010,
          payeeCard: 10987654321,
          payeeName: "张三2",
          payeeBank: "北京支行2",
          signDate: 20191205
        }
      ],
      currentRow: null,
      reloadData: 0
    };
  },
  methods: {
    currentChange(val, oldVal) {
      console.log(val, oldVal);
      this.currentRow = val;
      this.$refs.singleTable.setCurrentRow(this.currentRow);
    },
    cancelHighlight() {
      this.$refs.singleTable.setCurrentRow();
    },
    rowClass() {
      // return 'background: #eee;'
    },
    headClass() {
      return "background: #BADDF7;";
    },
    // beforeClose(index) {
    //   console.log("关闭交易页面2");
    //   this.csrAlert
    //     .confirm({
    //       title: "确定要关闭交易么？",
    //       icon: "warning"
    //     })
    //     .then(res => {
    //       if (res) {
    //         this.$emit("close", index);
    //       } else {
    //       }
    //     });
    // },
    CashSweepTermination_termination() {
      console.log("解约");
      if (!this.currentRow) {
        // this.csrAlert.warning("请选择一条记录！");
        this.$message.warning("请选择一条记录！");
      } else {
        // this.csrAlert.info(this.currentRow.payeeName);
        this.$message.info(this.currentRow.payeeName);
        this.msgData.findIndex((val, index) => {
          if (val === this.currentRow) {
            console.log(index);
            this.msgData.splice(index, 1);
          }
        });
      }
    }
  }
};
</script>

<style>
.top {
  height: 30px;
  /* background: rgb(57, 118, 168); */
  background: rgb(71, 109, 190);
  margin-bottom: 2px;
  text-align: center;
  line-height: 30px;
  color: #fff;
}
.el-pagination {
  margin: 10px auto;
  text-align: center;
}
.cashSweepTermination .el-table__body tr.el-table__row--striped.current-row td,
.el-table__body tr.current-row > td {
  background-color: #ffec8b;
}

.cashSweepTermination .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #ffec8b;
}
</style>
