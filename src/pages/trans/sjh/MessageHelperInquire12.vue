<template>
  <div class="messageHelperInquire">
    <div v-if="isShow">
      <el-button @click="MessageHelperInquire_customerID">按客户号查询</el-button>
      <el-button @click="MessageHelperInquire_mobile">按手机号查询</el-button>
      <el-form label-position="left" size="small" label-width="85px">
        <el-form-item label="手机号码：">
          <el-input class="mobil" disabled v-model="mobile"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div v-else>
      <el-button @click="MessageHelperInquire_comeBack">返回</el-button>
      <el-table :data="infoList" fit border style="width: 100%" height="420px" max-height="548px">
        <el-table-column prop="id" label="序号" width="40px"></el-table-column>
        <el-table-column prop="account" label="账号"></el-table-column>
        <el-table-column prop="customerName" label="客户姓名" v-if="isCustomerName"></el-table-column>
        <el-table-column prop="mobile" label="绑定手机号"></el-table-column>
        <el-table-column prop="sign" label="签约标志"></el-table-column>
        <el-table-column prop="balance" label="余额通知标志"></el-table-column>
        <el-table-column prop="origin" label="起点通知金额"></el-table-column>
        <el-table-column prop="charge" label="收费方式"></el-table-column>
        <el-table-column prop="first" label="首次签约时间"></el-table-column>
        <el-table-column prop="lately" label="最近签约时间"></el-table-column>
        <el-table-column prop="current_period" label="当期应扣金额"></el-table-column>
        <el-table-column prop="current_period_shi" label="当期实扣金额"></el-table-column>
        <el-table-column prop="Arrearage_data" label="产生欠费日期"></el-table-column>
        <el-table-column prop="Arrearage_money" label="欠费金额"></el-table-column>
        <el-table-column prop="last_deduction" label="上一次扣费日期"></el-table-column>
        <el-table-column prop="next_deduction" label="下一次扣费日期"></el-table-column>
        <el-table-column prop="discounts_stop_data" label="优惠截至日期"></el-table-column>
        <el-table-column prop="first_sign_path" label="首次签约渠道" width="120px"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "MessageHelperInquire",
  data() {
    return {
      mobile: null,
      customerID: null,
      isShow: true,
      infoList: [],
      isCustomerName: true
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    MessageHelperInquire_customerID() {
      console.log("MessageHelperInquire_customerID");
      this.infoList = [
          {
            id: 0,
            account: 1111111111111111,
            customerName: "王小虎",
            mobile: 18311111111,
            sign: "签约",
            balance: "是",
            origin: 300,
            charge: "非授权免费，不需要主管授权",
            first: 20191015,
            lately: 20191015,
            current_period: 1000,
            current_period_shi: 1000,
            Arrearage_data: 20191115,
            Arrearage_money: 10,
            last_deduction: 20191015,
            next_deduction: 20191115,
            discounts_stop_data: 20191025,
            first_sign_path: ""
          },
          {
            id: 1,
            account: 2222222222222222,
            customerName: "张三",
            mobile: 18322222222,
            sign: "签约",
            balance: "是",
            origin: 300,
            charge: "非授权免费，不需要主管授权",
            first: 20191015,
            lately: 20191015,
            current_period: 1000,
            current_period_shi: 1000,
            Arrearage_data: 20191115,
            Arrearage_money: 10,
            last_deduction: 20191015,
            next_deduction: 20191115,
            discounts_stop_data: 20191025,
            first_sign_path: ""
          },
          {
            id: 2,
            account: 3333333333333333,
            customerName: "李四",
            mobile: 18322222222,
            sign: "签约",
            balance: "是",
            origin: 300,
            charge: "非授权免费，不需要主管授权",
            first: 20191015,
            lately: 20191015,
            current_period: 1000,
            current_period_shi: 1000,
            Arrearage_data: 20191115,
            Arrearage_money: 10,
            last_deduction: 20191015,
            next_deduction: 20191115,
            discounts_stop_data: 20191025,
            first_sign_path: ""
          },
          {
            id: 3,
            account: 3333333333333333,
            customerName: "wan",
            mobile: 18322222222,
            sign: "签约",
            balance: "是",
            origin: 300,
            charge: "非授权免费，不需要主管授权",
            first: 20191015,
            lately: 20191015,
            current_period: 1000,
            current_period_shi: 1000,
            Arrearage_data: 20191115,
            Arrearage_money: 10,
            last_deduction: 20191015,
            next_deduction: 20191115,
            discounts_stop_data: 20191025,
            first_sign_path: ""
          }
        ];
      this.isShow = false;
      this.isCustomerName = false
    },
    MessageHelperInquire_mobile() {
      console.log("MessageHelperInquire_phone");
      let yanzheng = /^1\d{10}$/;
      if (yanzheng.test(this.mobile)) {
        this.infoList = [
          {
            id: 0,
            account: 1111111111111111,
            customerName: "王小虎",
            mobile: 18311111111,
            sign: "签约",
            balance: "是",
            origin: 300,
            charge: "非授权免费，不需要主管授权",
            first: 20191015,
            lately: 20191015,
            current_period: 1000,
            current_period_shi: 1000,
            Arrearage_data: 20191115,
            Arrearage_money: 10,
            last_deduction: 20191015,
            next_deduction: 20191115,
            discounts_stop_data: 20191025,
            first_sign_path: ""
          },
          {
            id: 1,
            account: 2222222222222222,
            customerName: "张三",
            mobile: 18322222222,
            sign: "签约",
            balance: "是",
            origin: 300,
            charge: "非授权免费，不需要主管授权",
            first: 20191015,
            lately: 20191015,
            current_period: 1000,
            current_period_shi: 1000,
            Arrearage_data: 20191115,
            Arrearage_money: 10,
            last_deduction: 20191015,
            next_deduction: 20191115,
            discounts_stop_data: 20191025,
            first_sign_path: ""
          },
          {
            id: 2,
            account: 3333333333333333,
            customerName: "李四",
            mobile: 18322222222,
            sign: "签约",
            balance: "是",
            origin: 300,
            charge: "非授权免费，不需要主管授权",
            first: 20191015,
            lately: 20191015,
            current_period: 1000,
            current_period_shi: 1000,
            Arrearage_data: 20191115,
            Arrearage_money: 10,
            last_deduction: 20191015,
            next_deduction: 20191115,
            discounts_stop_data: 20191025,
            first_sign_path: ""
          },
          {
            id: 3,
            account: 3333333333333333,
            customerName: "wan",
            mobile: 18322222222,
            sign: "签约",
            balance: "是",
            origin: 300,
            charge: "非授权免费，不需要主管授权",
            first: 20191015,
            lately: 20191015,
            current_period: 1000,
            current_period_shi: 1000,
            Arrearage_data: 20191115,
            Arrearage_money: 10,
            last_deduction: 20191015,
            next_deduction: 20191115,
            discounts_stop_data: 20191025,
            first_sign_path: ""
          }
        ];
        this.isShow = false;
        this.isCustomerName = true
      } else {
        // this.csrAlert.info('提示','请使用签约短信通手机号致电')
        this.$message.info("请使用签约短信通手机号致电");
        console.log("请使用签约短信通手机号致电");
      }
    },
    MessageHelperInquire_comeBack(){
      this.isShow = true
    },
    getUserInfo() {
      let userinfo = {
        mobile: 18311111111,
        customerID: 1111112222
      };
      this.mobile = userinfo.mobile;
      this.customerID = userinfo.customerID;
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
<style>
.messageHelperInquire .mobil {
  width: 200px;
}
.messageHelperInquire .el-table .el-table__body-wrapper .el-table__row td,
.messageHelperInquire .el-table .el-table__header-wrapper .has-gutter th
 {
  text-align: center;
}
</style>
