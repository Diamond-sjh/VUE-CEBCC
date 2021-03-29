<template>
  <div class="messageHelperInquireOffLine">
    <!-- <el-button @click="MessageHelperInquireOffLine_customerID">按客户号查询</el-button> -->
    <el-button @click="MessageHelperInquireOffLine_mobile('param')" v-if="isShow">按手机号查询</el-button>
    <el-button @click="MessageHelperInquireOffLine_comeBack" v-else>返回</el-button>
    <div v-if="isShow">
      <el-form
        label-position="left"
        ref="param"
        :model="param"
        :rules="rules"
        size="small"
        label-width="95px"
      >
        <el-form-item label="手机号码：" prop="mobile">
          <el-input class="mobil" v-model="param.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div v-else>
      <el-table :data="infoList" border style="width: 100%" height="420px" max-height="548px">
        <el-table-column align="center" prop="id" label="序号" width="40px"></el-table-column>
        <el-table-column align="center" prop="account" label="账号"></el-table-column>
        <el-table-column align="center" prop="name" label="客户姓名"></el-table-column>
        <el-table-column align="center" prop="mobile" label="绑定手机号"></el-table-column>
        <el-table-column align="center" prop="sign" label="签约标志"></el-table-column>
        <el-table-column align="center" prop="balance" label="余额通知标志"></el-table-column>
        <el-table-column align="center" prop="origin" label="起点通知金额"></el-table-column>
        <el-table-column align="center" prop="charge" label="收费方式"></el-table-column>
        <el-table-column align="center" prop="first" label="首次签约时间"></el-table-column>
        <el-table-column align="center" prop="lately" label="最近签约时间"></el-table-column>
        <el-table-column align="center" prop="current_period" label="当期应扣金额"></el-table-column>
        <el-table-column align="center" prop="current_period_shi" label="当期实扣金额"></el-table-column>
        <el-table-column align="center" prop="Arrearage_data" label="产生欠费日期"></el-table-column>
        <el-table-column align="center" prop="Arrearage_money" label="欠费金额"></el-table-column>
        <el-table-column align="center" prop="last_deduction" label="上一次扣费日期"></el-table-column>
        <el-table-column align="center" prop="next_deduction" label="下次扣费日期"></el-table-column>
        <el-table-column align="center" prop="discounts_stop_data" label="优惠截至日期"></el-table-column>
        <el-table-column align="center" prop="first_sign_path" label="首次签约渠道"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "MessageHelperInquireOffLine",
  data() {
    return {
      param: {
        mobile: ""
      },
      isShow: true,
      infoList: [],
      rules: {
        mobile: [
          { required:true,validator: csrValidate.mobile }
        ]
      }
    };
  },
  methods: {
    MessageHelperInquireOffLine_kehuhao() {
      console.log("MessageHelperInquireOffLine_customerID");
    },
    MessageHelperInquireOffLine_mobile(formName) {
      console.log(this.$refs[formName])
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.infoList = [
            {
              id: 0,
              account: 1111111111111111,
              name: "王小虎",
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
              name: "张三",
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
              name: "李四",
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
              name: "wan",
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
        } else {
          return false;
        }
      });
    },
    MessageHelperInquireOffLine_comeBack() {
      this.isShow = true;
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
