<template>
  <div class="apply-fail-message">
    <div class="backbutton">
      <el-button @click="btnQueryClickHandler">贷款营销短信</el-button>
      <el-button @click="backToNetLoanApply">返回</el-button>
    </div>
   <!--  <div class ="apply-fail-message-title">
      <span>手机号：</span><el-input v-model="poneNumber"></el-input><el-button size="mini" @click ="fetchIncomingCall">获取来电</el-button>
    </div> -->
    <el-row type ="flex" justify = "center" class ="apply-fail-message-title" >
      <el-col :span ="8" class="text"> <span >手机号:</span></el-col>
      <el-col :span ='8' class="phoneno"><el-input v-model="poneNumber" ></el-input></el-col>
      <el-col :span ='8'><el-button size="small" @click ="fetchIncomingCall">获取来电</el-button></el-col>
    </el-row>
    <div class="option-tip">
      <div class="icon">
        <i :class="[tip.icon,'tip-error']"></i>
      </div>
      <p class="title">{{tip.title}}</p>
      <p class="tip-content">{{tip.text}}</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      poneNumber:11111111,
      failMessage:"解析遇到错误，错误码FFFFFFF",
      tip: {
        title: "申请失败",
        text: "111112222222222222222222222222222",
        icon: "el-icon-error",
        success: false
      }
    };
  },
  mounted() {
    this.$parent.addResTipItem({
       type:this.$constants.optionResultType.error,
       content:this.failMessage
    })
    
    
  },
  methods: {
    btnQueryClickHandler() {

       setTimeout(()=>this.csrAlert.success('发送短信成功'),2000)
      // let parma = {
      //   TranCode: ""
      // };
      // this.$MainAjax.doPost(urlConfig.trans.SendSMS, parma).then(res => {

      //   if (res && res.retCode === "AAAAAAA") {
      //     this.csrAlert.success("发送短信成功");
      //   }
      // });
    },
    backToNetLoanApply() {
      let url = "debit/operation/netloanapplication/NetLoanApplication";
      this.$emit("changeUrl", url);
    },
    fetchIncomingCall(){
      console.log("获取来电")
    }
  }
};
</script>
<style scope>
.apply-fail-message .backbutton {
  text-align: right;
  padding-bottom: 15px;
}
.apply-fail-message .option-tip{
  margin:12px auto;
}
.apply-fail-message .apply-fail-message-title{
  display: flex;
  align-items: center;
}
.apply-fail-message .apply-fail-message-title .el-col.text{
  padding-right: 6px;
  text-align:right;
}
.apply-fail-message .apply-fail-message-title .el-col.phoneno{
  margin: 6px 12px;
}
</style>