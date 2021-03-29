<template>
  <div class="channelSignContract">
    <!-- 解约按钮-->
    <el-button type="primary"
               plain
               :disabled="flag ==4? !isDisabled : isDisabled"
               @click="cancelContract()">解约</el-button>
    <!-- 五个按钮区域 -->
    <el-row>
      <el-button type="primary"
                 plain
                 @click="handleClick('1')">网银</el-button>
      <el-button type="primary"
                 plain
                 @click="handleClick('2')">手机银行</el-button>
      <el-button type="primary"
                 plain
                 @click="handleClick('3')">电话银行</el-button>
      <el-button type="primary"
                 plain
                 @click="handleClick('4')">电子支付</el-button>
      <el-button type="primary"
                 plain
                 @click="handleClick('5')">网联支付渠道</el-button>
    </el-row>
    <!-- 网银结果开始 -->
    <div class="internetListShow"
         v-if="flag==1&&this.results.internet === 1 ">
      <el-row class="header">网银渠道明细</el-row>
      <table class="table-public table-public-left">
        <thead>
          <tr>
            <th width="10%">转帐开通标识：</th>
            <td width="25%">{{internetList[0].aa}}</td>
            <th width="10%">签约手机号：</th>
            <td width="55%">{{internetList[0].bb}}</td>

          </tr>
          <tr>
            <th>证件类型：</th>
            <td>{{internetList[0].cc}}</td>
            <th>证件号码：</th>
            <td>{{internetList[0].dd}}</td>

          </tr>
          <tr>
            <th>客户号：</th>
            <td>{{internetList[0].ee}}</td>
            <th>网银开户日期：</th>
            <td>{{internetList[0].ff}}</td>

          </tr>
          <tr>
            <th>上次登录时间：</th>
            <td>{{internetList[0].hh}}</td>
            <th>版本开通状态：</th>
            <td>{{internetList[0].gg}}</td>

          </tr>
          <tr>
            <th>证书存储介质：</th>
            <td>{{internetList[0].kk}}</td>
            <th></th>
            <td></td>
          </tr>
        </thead>
      </table>
      <el-row>卡列表</el-row>
      <TableLazyLoad :tableHeight="tableHeight"
                     :hightlight='true'
                     :tableData="internetList"
                     :pagesize="pagesize"
                     :totalsizes="totalsizes"
                     @loadingMore="loadingMore"
                     @handleSelectionChange="handleSelectionChange">
        <template v-slot:tableList>

          <el-table-column type="index"
                           label="序号"
                           width="10%">
          </el-table-column>
          <el-table-column label="账户"
                           width="60%"
                           prop="account">
          </el-table-column>
          <el-table-column label="卡种类型"
                           width="30%"
                           prop="cardType">
          </el-table-column>

        </template>
      </TableLazyLoad>
    </div>
    <!-- 手机银行开始 -->
    <div class="mobileBank"
         v-if="flag==2&&this.results.mobileBank != 0">
      <el-row class="header">手机银行签约明细</el-row>
      <table class="table-public table-public-left">
        <thead>
          <tr>
            <th width="10%">客户号：</th>
            <td width="25%">{{mobileBankList[0].aa}}</td>
            <th width="10%">上次登录时间：</th>
            <td width="55%">{{mobileBankList[0].bb}}</td>

          </tr>
          <tr>
            <th>客户中文名：</th>
            <td>{{mobileBankList[0].cc}}</td>
            <th>证件种类：</th>
            <td>{{mobileBankList[0].dd}}</td>

          </tr>
          <tr>
            <th>证件号：</th>
            <td>{{mobileBankList[0].ee}}</td>
            <th>签约类型：</th>
            <td>{{mobileBankList[0].ff}}</td>

          </tr>
          <tr>
            <th>绑定手机号：</th>
            <td>{{mobileBankList[0].hh}}</td>
            <th>客户状态：</th>
            <!-- 若网银开通、手机未开通 -->
            <td>{{  results.internet == 1 && results.mobileBank == 0 ? "【注销】" : "" }}</td>

          </tr>
          <tr>

            <!-- 若开通手机银行未注销，手机银行渠道详细页面中签约日期字段有值，注销日期字段为空 -->
            <th>签约日期：</th>
            <td>{{ results.mobileBank == "close"? "" : "results.signDate"}}</td>
            <!--  //若手机银行开通后关闭，客户状态为注销，签约日期与注销日期正常回显 -->
            <th>注销日期：</th>
            <td>{{results.mobileBank== "close" ? "" : "results.offDate" }}</td>

          </tr>

        </thead>
      </table>
    </div>
    <!-- 电话银行开始 -->
    <div class="telBank"
         v-if="flag==3 && results.telBank === 1">
      <el-row class="header">电话银行</el-row>
      <table class="table-public table-public-left">
        <thead>
          <tr>
            <th width="10%">开通标识：</th>
            <td width="25%">{{sdd}}</td>
            <th width="10%">客户号：</th>
            <td width="55%">{{fff}}</td>

          </tr>
          <tr>
            <th>是否绑定账户：</th>
            <td>{{sdd}}</td>
            <th>客户中文名：</th>
            <td>{{fff}}</td>

          </tr>
          <tr>
            <th>电话1：</th>
            <td>{{sdd}}</td>
            <th>电话3：</th>
            <td>{{fff}}</td>

          </tr>
          <tr>
            <th>电话2：</th>
            <td>{{sdd}}</td>
            <th>电话4：</th>
            <td>{{fff}}</td>

          </tr>
          <tr>
            <th>日交易限额：</th>
            <td>{{sdd}}</td>
            <th>是否限额：</th>
            <td>{{fff}}</td>
          </tr>

        </thead>
      </table>
      <el-row class="header">绑定列表</el-row>
      <!-- //展示的账号需屏蔽电子账户。 -->
      <TableLazyLoad :tableHeight="tableHeight"
                     :hightlight='true'
                     :tableData="telBankList"
                     :pagesize="pagesize"
                     :totalsizes="totalsizes"
                     @loadingMore="loadingMore"
                     @handleSelectionChange="handleSelectionChange">
        <template v-slot:tableList>
          <el-table-column type="index"
                           prop="num"
                           label="序号"
                           width="10%">
          </el-table-column>
          <el-table-column prop="account"
                           label="账户"
                           width="60%">
          </el-table-column>
          <el-table-column prop="cardType"
                           label="卡种类型"
                           width="30%">
          </el-table-column>
        </template>
      </TableLazyLoad>

    </div>
    <!-- 电子支付 开始-->
    <div v-if="flag==4&&this.results.ePayment === 1">
      <el-row class="header">电子支付渠道明细</el-row>
      <TableLazyLoad :tableHeight="tableHeight"
                     :hightlight='true'
                     :tableData="ePaymentList"
                     :pagesize="pagesize"
                     :totalsizes="totalsizes"
                     @loadingMore="loadingMore"
                     @handleSelectionChange="handleSelectionChange">
        <template v-slot:tableList>
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column type="index"
                           label="序号">
          </el-table-column>
          <el-table-column prop="customerId"
                           label="客户号">
          </el-table-column>
          <el-table-column prop="customerNum"
                           label="客户账号">
          </el-table-column>
          <el-table-column prop="customerNumType"
                           label="客户账号类型">
          </el-table-column>

          <el-table-column label="支付类型">
            <template slot-scope="scope">
              {{scope.row.payType ==="A"? "协议支付" : "网上支付"}}
            </template>
          </el-table-column>
          <el-table-column prop="signChannel"
                           label="签约渠道">
          </el-table-column>
          <el-table-column prop="phoneNum"
                           label="手机号">
          </el-table-column>
          <el-table-column prop="customerResMessage"
                           label="客户预留信息">
          </el-table-column>
          <el-table-column prop="singleDayLimit"
                           label="单日限额">
          </el-table-column>
          <el-table-column prop="customerState"
                           label="客户状态">
          </el-table-column>
          <el-table-column prop="relevanceNum"
                           label="关联账号">
          </el-table-column>
          <el-table-column prop="payAlias"
                           label="协议支付商户别名">
          </el-table-column>
        </template>

      </TableLazyLoad>
    </div>
    <!-- 网联支付渠道开始 -->
    <div v-if="flag==5&&this.results.internetPayChannel === 1">
      <el-row class="header">网联支付渠道明细</el-row>
      <TableLazyLoad :tableHeight="tableHeight"
                     :hightlight='true'
                     :tableData="internetPayChannelList"
                     :pagesize="pagesize"
                     :totalsizes="totalsizes"
                     @loadingMore="loadingMore"
                     @handleSelectionChange="handleSelectionChange">
        <template v-slot:tableList>
          <el-table-column label="客户号"
                           prop="customerId">
          </el-table-column>
          <el-table-column label="账号"
                           prop="account">
          </el-table-column>
          <el-table-column label="账户名称"
                           prop="accountName">
          </el-table-column>
          <el-table-column label="开户机构"
                           prop="AA">
          </el-table-column>
          <el-table-column label="网联支付机构标识"
                           prop="BB">
          </el-table-column>
          <el-table-column label="网联支付机构名称"
                           prop="CC">
          </el-table-column>
          <el-table-column label="银联支付机构标识"
                           prop="DD">
          </el-table-column>
          <el-table-column label="银联支付机构名称"
                           prop="EE">
          </el-table-column>
          <el-table-column label="协议号"
                           prop="FF">
          </el-table-column>
          <el-table-column label="协议状态"
                           prop="GG">
          </el-table-column>
          <el-table-column label="签约日期"
                           prop="HH">
          </el-table-column>
          <el-table-column label="最后一次更新日期"
                           prop="JJ">
          </el-table-column>
          <el-table-column label="渠道标识"
                           prop="KK">
          </el-table-column>
        </template>
      </TableLazyLoad>

    </div>
    <!-- 解约按钮弹窗 -->
    <el-dialog title="提示"
               :visible.sync="dialogVisible"
               width="40%">
      <span>是否确认解约网上支付</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- //点击【确定】按钮，当前页跳转到“三级身份验证”页 -->
        <el-button type="primary"
                   @click="goSure()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import TableLazyLoad from "@/pages/demos/TableLazyLoad"
export default {
  name: "channelSignContract",
  components: {
    TableLazyLoad
  },
  data () {
    return {
      reqParams: {
        //选中的卡号
        card: null,
        internet: null,
        mobileBank: null,
        telBank: null,
        ePayment: null,
        internetPayChannel: null,

      },
      //请求地址
      postUrl1: urlConfig.trans.internetBankingAction,
      // postUrl2: urlConfig.trans.getMobileBankList,
      // postUrl3: urlConfig.trans.getTelBankList,
      // postUrl4: urlConfig.trans.getEPaymentList,
      // postUrl5: urlConfig.trans.getInternetPayChannelList,

      tableHeight: "200",//表格高度
      pagesize: 2,//每页显示条数
      totalsizes: 18,//数据总条数
      noMore: false,//是否加载完全部数据
      //解约按钮是否禁用
      isDisabled: true,
      //列表是否展示
      show: false,
      //获取的网银表格数据列表
      internetList: [],
      //获取手机银行的 数据列表
      mobileBankList: [],
      //获取电话银行的数据列表
      telBankList: [],

      //获取的电子支付的数据列表
      ePaymentList: [],
      //获取网联支付查询数据列表
      internetPayChannelList: [],
      //是否开通的结果
      results: {},
      //弹窗
      dialogVisible: false,
      //每个按钮的选中标志
      flag: null,
      //列表选中的数据
      multipleSelection: [],

    }
  },

  methods: {

    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    //加载更多
    loadingMore () {
      console.log("demo loading more.....");
      this.ePaymentList.push(this.getEPaymentList());
      this.internetPayChannelList.push(this.getInternetPayChannelList());
      this.telBankList.push(this.getTelBankList());
    },

    //解约按钮
    cancelContract () {
      if (this.multipleSelection.length != "1") {
        this.$message.warning('请选择一条数据！')
      } else {
        this.dialogVisible = true
      }
    },
    //解约的确认按钮
    goSure () {
      if (this.results.isSuccess === "success") {
        this.$parent.addResTipItem({
          type: this.$constans.optionResultType.warning, content: "XXXXX账号解约网上支付成功。"
        })
        console.log(this.$constans)
      } else {
        this.$parent.addResTipItem({
          type: this.$constans.optionResultType.warning, content: "身份验证失败"
        })
      }
    },
    handleClick (flag) {
      this.flag = flag

      //网银
      if (flag === "1") {

        this.$MainAjax.doPost(this.postUrl1).then(res => {
          console.log(res)
          this.results = res.data.isOpen
       
          if (this.results.internet == 0) {
            console.log(this.$parent)
            this.$parent.addResTipItem({
              type: this.$constans.optionResultType.warning, content: "该客户未开通网银"
            })
          } else {
            this.internetList = res.data.results
          }
          console.log(res.data.results)
        })
        //手机银行
      } else if (flag === "2") {
        console.log(22222)
        this.$MainAjax.doPost(this.postUrl2).then(res => {
          this.results = res.data.isOpen
          if (this.results.mobileBank === 0 && this.results.internet != 1) {
            console.log(ddddddd)
            this.$parent.addResTipItem({
              type: this.$constans.optionResultType.warning, content: "证件类型/号码不符或该卡/折未在网银/手机银行签约"
            })
          } else {
            this.mobileBankList = res.data.results
          }
        })
        //电话银行
      } else if (flag === "3") {
        this.$MainAjax.doPost(this.postUrl3).then(res => {
          console.log('3333')
          this.results = res.data.isOpen
          if (this.results.telBank != 1) {
            console.log(9999)
            this.$parent.addResTipItem({

              type: this.$constans.optionResultType.warning, content: "该客户未开通电话银行"
            })
            console.log(this.$constans)
          } else {
            this.telBankList = res.data.results
          }
        })
        //电子支付
      } else if (flag === "4") {
        console.log('444')
        this.$MainAjax.doPost(this.postUrl4).then(res => {
          this.results = res.data.isOpen
          if (this.results.ePayment != 1) {
            console.log(3333)
            console.log(this.$parent)
            this.$parent.addResTipItem({
              type: this.$constans.optionResultType.warning, content: "该客户未开通电子支付"
            })
          } else {
            this.ePaymentList = res.data.results
          }
        })
        //网联支付渠道
      } else if (flag === "5") {
        this.$MainAjax.doPost(this.postUrl5).then(res => {
          console.log("55555")
          this.results = res.data.isOpen
          console.log(res.data)
          if (this.results.internetPayChannel != 1) {
            this.$parent.addResTipItem({
              type: this.$constans.optionResultType.warning, content: "该客户未开通网联支付渠道"
            })
          } else {

            this.internetPayChannelList = res.data.results
            console.log(8888)
          }

        })
      }
    }
  }
}
</script> 
<style scoped>
.bgc {
  background-color: rgb(75, 180, 241);
}
.box-card {
  height: 30px;
  background-color: red;
}
.header {
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: rgb(60, 208, 228);
}
</style>