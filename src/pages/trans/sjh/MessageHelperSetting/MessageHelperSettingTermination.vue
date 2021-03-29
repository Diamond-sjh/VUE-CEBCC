<template>
  <!-- duan xin tong she zhi -->
  <div>
    <div class="btn">
      <el-button class="terminationBtn" @click="termination('signedMsg')">签约</el-button>
    </div>
    <el-form
      :model="signedMsg"
      status-icon
      size="mini"
      :rules="rules"
      hide-required-asterisk
      ref="signedMsg"
      label-width="120px"
      label-position="right"
      class="signedMsg"
    >
      <!-- disabled="true" -->
      <p class="title">当前账号未开通短信通！继续操作开通短信通</p>
      <el-form-item label="账号：">{{signedMsg.acctNo}}</el-form-item>
      <el-form-item label="绑定手机号：">{{signedMsg.mobileBankPhone}}</el-form-item>
      <el-form-item label="最低通知金额：" prop="tranAmt">
        <el-input v-model="signedMsg.tranAmt" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="是否通知余额：" prop="flag">
        <el-radio-group v-model="signedMsg.flag">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否60岁以上：">{{signedMsg.isAgeFree?'是':'否'}}</el-form-item>
      <el-form-item label="员工客户：">{{signedMsg.employee===1?'是':'否'}}</el-form-item>
      <el-form-item label="客户综合评级：">{{signedMsg.lcnCfrmDpt}}</el-form-item>
      <el-form-item label="工资代发客户：">
        <template>
          <div v-if="signedMsg.isPayCustomer === 0">是</div>
          <div v-if="signedMsg.isPayCustomer === 1">否</div>
          <div v-if="signedMsg.isPayCustomer === 2">无记录</div>
          <div v-if="signedMsg.isPayCustomer === 3">获取记录失败</div>
        </template>
      </el-form-item>
      <el-form-item label="首次签约日期：">
        <div
          :class="{txt_red:!signedMsg.firstSignDate}"
        >{{signedMsg.firstSignDate?signedMsg.firstSignDate:'该客户为首次签约客户'}}</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var validatetranAmt = (rule, value, callback) => {
      if (rule.required == true && !value) {
        callback(new Error("最低通知金额不能为空"));
      } 
      const tranAmtReg = /^[1-9]\d*$/
      if (tranAmtReg.test(value)) {
        return callback()
      } else {
        return callback(new Error('请输入不小于1的正整数'))
      }
    };
    return {
      signedMsg: {
        acctNo: 111,
        mobileBankPhone: 1234,
        tranAmt: 300,
        flag: "",
        isAgeFree: true,
        employee: 0,
        lcnCfrmDpt: "优质客户",
        isPayCustomer: 0,
        firstSignDate: ""
      },
      rules: {
        tranAmt: [
          { required: true, validator: validatetranAmt }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        flag: [{ required: true, message: "请选择是否通知余额", trigger: "change" }]
      }
    };
  },
  methods: {
    sign(signedMsg) {
        this.$refs[signedMsg].validate((valid) => {
          if (valid) {
            this.csrAlert.info('签约')
          } else {
            if(!this.tranAmt){
              this.$message.error('最低通知金额最小为正整数1')
            }
            return false;
          }
        });
    }
  }
};
</script>

<style scoped>
.signedMsg {
  width: 480px;
  /* height: 400px; */
  margin: 0 auto;
  padding: 15px 35px;
  background: #e6f1fb;
  /* background: pink; */
}
.title {
  text-align: center;
  line-height: 40px;
  /* border-top: 1px solid #000; */
}
.el-form-item {
  padding-left: 65px;
}
.el-input {
  width: 160px;
}
.txt_red {
  color: red;
}
</style>
