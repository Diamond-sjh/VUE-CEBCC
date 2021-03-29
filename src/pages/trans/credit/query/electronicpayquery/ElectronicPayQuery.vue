<!-- created by Liuhui on 2019/10/17 -->
<template>
    <!-- 电子支付查询 -->
    <div class="electronic-payQuery p20">
      <el-row :span="24" class="titleMsg" v-text="title"></el-row>
      <el-row>
          <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
            <el-col :span="8">
                <el-form-item label="卡号">
                    <el-input v-model="form.AcctNo" clearable></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="起始日期">
                    <el-date-picker v-model="form.TimeBgn" type="date" placeholder="选择起始日期"></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="结束日期">
                    <el-date-picker v-model="form.TimeEnd" type="date" placeholder="选择结束日期"></el-date-picker>
                </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row :span="24" class="remindMsg">温馨提示：1.支持一年以内【电子支付交易】的查询，且查询区间不得超过30天；2.支持一年以内【网联交易支付】的查询，且查询区间不得超过7天</el-row>
      <!-- 电子支付查询界面开始 -->
      <el-row v-if="eleOrNet">  
        <TableLazyLoad :tableData='electronicPayList' :pagesize ="pagesize" :tableHeight="'190'" :totalsizes="turnPageTotalNum" :hightlight ="true" @loadingMore="loadingMoreEPay" @handleSelectionChange="handleSelectionChange">
          <template v-slot:tableList>
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column  prop="CustNo" label="交易日期" align="center"></el-table-column>
            <el-table-column prop="NameCh" label="商户名称" align="center"></el-table-column>
            <el-table-column prop="MerNo" label="商户号" align="center"></el-table-column>
            <el-table-column prop="CorpCode" label="订单产生时间" align="center" width="100"></el-table-column>
            <el-table-column prop="CtryCode" label="支付类型" align="center"></el-table-column>
            <el-table-column prop="StrgPrd" label="分期期数" align="center"></el-table-column>
            <el-table-column prop="SndCrdChnl" label="支付渠道" align="center"></el-table-column>
            <el-table-column prop="TlrSeq" label="验证方式" align="center"></el-table-column>
            <el-table-column prop="AcctNo1" label="付款账号" align="center"></el-table-column>
            <el-table-column prop="ThdUsrNum" label="订单号" align="center"></el-table-column>
            <el-table-column prop="Type" label="交易类型" align="center"></el-table-column>
            <el-table-column prop="Amt3" label="交易金额" align="center"></el-table-column>
            <el-table-column prop="BalAmt" label="分期手续费" align="center"></el-table-column>
            <el-table-column prop="ChnlJourNo1" label="流水号" align="center"></el-table-column>
            <el-table-column prop="State" label="交易结果" align="center"></el-table-column>
            <el-table-column prop="Time2" label="原交易日期" align="center"></el-table-column>
            <el-table-column prop="UpCredNo" label="原订单号" align="center"></el-table-column>
            <el-table-column prop="Code" label="失败成功标志" align="center" width="100"></el-table-column>
          </template>
        </TableLazyLoad>
      </el-row>
      <!-- 电子支付查询界面结束 -->
      <!-- 网联支付查询界面开始 -->
      <el-row v-else>
        <TableLazyLoad :tableData='netPayList' :tableHeight="'190'" :pagesize ="pagesize"  :totalsizes="turnPageTotalNum" :hightlight ="true" @loadingMore="loadingMoreNet" @handleSelectionChange="handleSelectionChange">
            <template v-slot:tableList>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column  prop="qrValidTime" label="交易日期" align="center"></el-table-column>
                <el-table-column prop="DAILMC" label="交易摘要" align="center"></el-table-column>
                <el-table-column prop="CtryName" label="付款方账号" align="center"></el-table-column>
                <el-table-column prop="AcctNo" label="交易流水号" align="center"></el-table-column>
                <el-table-column prop="ObjName1" label="交易金额" align="center"></el-table-column>
                <el-table-column prop="BusiType" label="交易状态" align="center"></el-table-column>
                <el-table-column prop="AcctNo1" label="原交易流水号" align="center" width="100"></el-table-column>
                <el-table-column prop="ObjName2" label="退款累计金额" align="center" width="100"></el-table-column>
                <el-table-column prop="BusiKind" label="交易类型" align="center"></el-table-column>
                <el-table-column prop="UnitNo" label="业务类型" align="center"></el-table-column>
                <el-table-column prop="" label="商户号" align="center"></el-table-column>
            </template>
        </TableLazyLoad>
      </el-row>
      <!-- 网联支付查询界面结束 -->
      <!-- 短信发送弹窗开始 -->
      <el-dialog :title="'选择号码'" :visible.sync="dialogShow" width="60%" @open="openDialog">
        <el-row>
          <el-form :model="form_msg" label-width="140px" class="demo-ruleForm" ref="form_msg" :rules="rules">
            <el-col :span="20">
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="form_msg.phone" clearable maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-button type="primary" plain>获取来电</el-button>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:center;margin-top:10px;">
            <el-button type="primary" plain @click="sendMsg">确认</el-button> 
            <el-button type="primary" plain @click="dialogClose">返回</el-button> 
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 短信发送弹窗结束 -->
    </div>
</template>
<script>
import TableLazyLoad from "@/pages/demos/TableLazyLoad";
import { mapGetters } from 'vuex';
export default {
    name:"electronicpayquery",
    components:{TableLazyLoad},
    props:{
      //当前用户token
      custToken:{type:String,default:""},
    },
    computed:{
      ...mapGetters(['getCustomer']),
      
    },
    data(){
      return{
        //电子支付和网联支付输入框
        form:{
          AccNo:6228010000000119,
          TimeBgn:new Date(new Date().getTime()-144*60*60*1000),
          TimeEnd:new Date()
        },
        title:"",
        eleOrNet:true,  //电子支付面板或者网联支付面板
        electronicPayList:[],//电子支付查询列表
        pagesize:20,//每页显示条数
        turnPageTotalNum:0,//数据总条数
        turnPageBeginPos: 1, //请求第几条开始的数据 
        netPayList:[],//网联支付查询列表
        dialogShow:false,  //短信发送弹窗
        form_msg:{      //弹窗数据
          phone:"",
        },
        multipleSelection:[],//列表选中的数据
        // rules:{phone:[{required:true,message:'请输入电话号码',trigger:'blur'},{min:1,max:20,message:'最多输入20个字符',trigger:'blur'}],}, 
        rules:{
                phone:[
                  {validator:csrValidate.mobile,trigger:'blur',required:true},
                ]
              },
        }
    },
    methods:{
      //获取列表选中的数据
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //点击电子支付查询
      ePayQueryBtnClickHandler(){
        //this.csrAlert.success("ePayQueryBtnClickHandler");  //弹窗
        // let customer = this.getCustomer(this.custToken);  //用户信息
        // console.log(this.form.TimeBgn,customer);
        this.title = "电子支付查询";
        this.eleOrNet = true;  
        let st = new Date(this.form.TimeBgn);
        let et = new Date(this.form.TimeEnd);
        //起止时间超出近1年查询范围,弹框提示：“仅支持查询近一年内的电子支付交易明细”,一年以内概念：当前日期向前推12个月
        let prevDate = new Date(new Date().getFullYear()-1,new Date().getMonth(),new Date().getDate()+1);
        if(st.getTime()<prevDate.getTime()||et.getTime()>new Date().getTime()){
          // this.$message({
          //     showClose: true,
          //     message: '仅支持查询近一年内的电子支付交易明细！',
          //     type: 'warning'
          // });
          this.csrAlert.warning("仅支持查询近一年内的电子支付交易明细！")
          return
        }
        //起始日期大于终止日期，弹框提示：“起止日期不能大于终止日期”
        if(st.getTime()>et.getTime()){
          this.$message({
              showClose: true,
              message: '起止日期不能大于终止日期！',
              type: 'warning'
          });
          return
        }
        //起止时间区间大于30天,起止日期查询区间不得大于30天
        let time = et.getTime()-st.getTime();
        let days = parseFloat(time/(24*60*60*1000));
        if(days>30){
          this.$message({
              showClose: true,
              message: '起止日期查询区间不得大于30天！',
              type: 'warning'
          });
          return
        }
        // let params = {
        //   AccNo:this.form.AccNo,
        //   TimeBgn:this.form.TimeBgn.toLocaleDateString().replace(/\//g,""),
        //   TimeEnd:this.form.TimeEnd.toLocaleDateString().replace(/\//g,""),
        //   turnPageBeginPos: this.isClickOrLoadingMore ? 1 : this.turnPageBeginPos+=20, 
        //   turnPageShowNum: 20
        // }
        // console.log(params);
        let params = {
          AcctNo:"6228010000000119",
          TimeBgn:"20191010",
          TimeEnd:"20191016",
          turnPageBeginPos: 1, 
	        turnPageShowNum: 20 
        };
        this.$MainAjax.doPost(urlConfig.trans.addtelectricPaymentQuery,params).then(res=>{
          console.log(res)
          this.$parent.clearResTip();
          if(res.data && res.data.ZF12Detail.length){
            document.querySelector('.infinite-scroll-table').querySelector('.el-table__body-wrapper').scrollTop = 0;
            this.electronicPayList = res.data.ZF12Detail;
          }else{
            //若选择的起止日期范围有效，但没有电子交易数据，点击【电子支付查询】，当前页左上角小红点提示：“未查询到数据”
            this.$parent.addResTipItem(
                {type:this.$constants.optionResultType.error,content:"未查询到数据"},
            )
          }         
          this.turnPageTotalNum = Number(res.data.turnPageTotalNum);
        });
      },
      //网联支付查询按钮
      onlinePayBtnClickHandler(){
        this.title = "网联支付查询";
        this.eleOrNet = false;
        let st = new Date(this.form.TimeBgn);
        let et = new Date(this.form.TimeEnd);
        //起止时间超出近1年查询范围,弹框提示：“仅支持查询近一年内的网联支付交易明细”,一年以内概念：当前日期向前推12个月
        let prevDate = new Date(new Date().getFullYear()-1,new Date().getMonth(),new Date().getDate()+1);
        if(st.getTime()<prevDate.getTime()||et.getTime()>new Date().getTime()){
          this.$message({
              showClose: true,
              message: '仅支持查询近一年内的网联支付交易明细！',
              type: 'warning'
          });
          return
        }
        //起始日期大于终止日期，弹框提示：“起止日期不能大于终止日期”
        if(st.getTime()>et.getTime()){
          this.$message({
              showClose: true,
              message: '起止日期不能大于终止日期！',
              type: 'warning'
          });
          return
        }
        //起止时间区间大于30天,起止日期查询区间不得大于7天
        let time = et.getTime()-st.getTime();
        let days = parseFloat(time/(24*60*60*1000));
        if(days>7){
          this.$message({
              showClose: true,
              message: '起止日期查询区间不得大于7天！',
              type: 'warning'
          });
          return
        }      
        let params = {
          SKRZH2:"6228010000000119",
          Date1:"20191010",
          Date2:"20191016",
          turnPageBeginPos: 1, 
	        turnPageShowNum: 20 
        };
        this.$MainAjax.doPost(urlConfig.trans.addNetUnionPaymentQuery,params).then(res=>{
          console.log(res)
          this.$parent.clearResTip();
          if(res.data && res.data.NP38Detail.length){
            document.querySelector('.infinite-scroll-table').querySelector('.el-table__body-wrapper').scrollTop = 0;
            this.netPayList = res.data.NP38Detail;
          }else{
            //若选择的起止日期范围有效，但没有电子交易数据，点击【电子支付查询】，当前页左上角小红点提示：“未查询到数据”
            this.$parent.addResTipItem(
                {type:this.$constants.optionResultType.error,content:"未查询到数据"},
            )
          } 
          this.turnPageTotalNum = Number(res.data.turnPageTotalNum);
        });
      },
      //短信按钮
      messageBtnClickHandler(){
        //this.$popUpManager.openUI(panelId,{});
        //未选中交易明细
        if(this.multipleSelection.length!=1){
          this.$message({
            showClose:true,
            message:'请选择一条记录！',
            type:'warning'
          });
          return 
        }
        //选中的交易明细中，交易结果不可以有非成功的记录
        if(!this.multipleSelection.State){
          this.$message({
            showClose:true,
            message:'请选择交易结果为成功的明细！',
            type:'warning'
          })
          return
        }
        this.dialogShow = true;
      },
      //弹窗打开
      openDialog(){
        this.$nextTick(()=>{
          this.$refs.form_msg.resetFields(); 
        })
      },
      //确定发送短信
      sendMsg(){
        console.log("the message is send success");
        if(!this.form_msg.phone)  return 

      },
      //返回
      dialogClose(){
        this.dialogShow = false;
      },
      //工单按钮
      orderBtnClickHandler(){
        this.$popUpManager.openUI(this.$constants.uiPanel.WORKD_ORDER_PANEL,{});
      },
      //电子支付查询，滚动加载
      loadingMoreEPay(){
        console.log("loading...more...电子支付查询")
        if(this.turnPageTotalNum==this.electronicPayList.length)  return  //判断数据是否加载完毕
        let params = {
          AcctNo:"6228010000000119",
          TimeBgn:"20191010",
          TimeEnd:"20191016",
          turnPageBeginPos: this.turnPageBeginPos+=20, 
	        turnPageShowNum: 20 
        };
        this.$MainAjax.doPost(urlConfig.trans.addtelectricPaymentQuery,params).then(res=>{
          console.log(res)
          if(res.data && res.data.ZF12Detail.length){
            this.electronicPayList = this.electronicPayList.concat(res.data.ZF12Detail);
          }        
          this.turnPageTotalNum = Number(res.data.turnPageTotalNum);
        });
        
      },
      //网联支付查询，滚动加载
      loadingMoreNet(){
        console.log("loading...more...网联支付查询")
        if(this.turnPageTotalNum==this.netPayList.length)  return  //判断数据是否加载完毕
        let params = {
          AcctNo:"6228010000000119",
          TimeBgn:"20191010",
          TimeEnd:"20191016",
          turnPageBeginPos: this.turnPageBeginPos+=20, 
	        turnPageShowNum: 20 
        };
        this.$MainAjax.doPost(urlConfig.trans.addNetUnionPaymentQuery,params).then(res=>{
          console.log(res)
          if(res.data && res.data.NP38Detail.length){
            this.netPayList = this.netPayList.concat(res.data.NP38Detail);
          }
          this.turnPageTotalNum = Number(res.data.turnPageTotalNum);
        });
      }
    }
}
</script>
<style scoped>
  .remindMsg{
    color: #f00;
    margin: 0 0 30px 60px;
  }
  .titleMsg{
    font-size: 10px;
    background: #ccc;
    margin: 0 0 10px 0;
    padding: 5px 0 5px 0;
  }
</style>
