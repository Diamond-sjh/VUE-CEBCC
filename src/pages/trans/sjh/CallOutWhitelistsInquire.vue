<template>
  <div class="callOutWhitelistsInquire">
    <el-button @click="CallOutWhitelistsInquire_pause">暂停外呼</el-button>
    <el-button @click="CallOutWhitelistsInquire_recove">恢复外呼</el-button>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column align="center" prop="date" label="客户号" width="120"></el-table-column>
      <el-table-column align="center" prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column align="center" prop="pauseDate" label="暂停外呼日期" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="pauseIndate" label="暂停外呼有效期" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" prop="address" label="渠道" show-overflow-tooltip></el-table-column>
    </el-table>
    <el-dialog title="请选择暂停风险外呼渠道" :visible.sync="centerDialogVisible" width="30%" center>
      <el-radio
        v-model="radio"
        :label="channel"
        v-for="channel in Channels"
        :key="channel"
      >{{channel}}</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible(0)">取 消</el-button>
        <el-button type="primary" @click="dialogVisible(1)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "CallOutWhitelistsInquire",
  data() {
    return {
      tableData: [
        {
          date: 123456,
          name: "李白",
          pauseDate: "2019-09-15 10:54:26",
          pauseIndate: "2019-11-15 10:54:26",
          address: "网上银行"
        },
        {
          date: 123456,
          name: "李白",
          pauseDate: "2019-09-15 10:54:26",
          pauseIndate: "2019-11-15 10:54:26",
          address: "手机银行"
        }
      ],
      checkoutList: [],
      centerDialogVisible: false,
      radio: "",
      Channels: ["网上银行", "手机银行"]
    };
  },
  methods: {
    handleSelectionChange(a) {
      this.checkoutList = a;
    },
    CallOutWhitelistsInquire_pause() {
      if (this.tableData.length && this.checkoutList.length) {
        this.$alert("请选择【恢复外呼】", "提示", {
          confirmButtonText: "确定"
        });
      } else {
        this.centerDialogVisible = true;
      }
    },
    CallOutWhitelistsInquire_recove() {
      if (!this.tableData.length) {
        this.$alert("请选择【暂停外呼】", "提示", {
          confirmButtonText: "确定"
        });
      } else if (!this.checkoutList.length) {
        this.$alert("请选中一条记录", "提示", {
          confirmButtonText: "确定"
        });
      } else {
        this.$alert("是否恢复风险外呼服务", "提示", {
          confirmButtonText: "确定"
        });
      }
    },
    dialogVisible(val) {
      if (val === 0) {
        this.centerDialogVisible = false;
        this.radio = "";
      } else {
        if (!this.radio) {
          this.$message.warning("请选择暂停风险外呼渠道！");
        } else {
          this.$message.info("向反洗钱系统发送请求");
          this.centerDialogVisible = false;
          this.radio = "";
        }
      }
    }
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
    // }
  }
};
</script>
<style scope>
.mobil {
  width: 200px;
}
</style>
