<!--欺诈黑名单-->
<template>
  <div>
    <el-row>
      <!-- 查询条件开始 -->
      <el-col>
        <el-row class="custquery">
          <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
            <el-col :span="8">
                <el-form-item label="主叫号码">
                    <el-input v-model="form.callNo" clearable maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="客户证件号">
                    <el-input v-model="form.certId" clearable maxlength="30"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="卡号">
                <el-input v-model="form.cardNo" clearable  @keyup.native="seatNumLimit(form.seatClassNum)" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态">
                <el-select v-model="form.status" style="width:100%" placeholder="请选择座席分类状态" clearable>
                    <el-option label="请选择" value=""></el-option>
                    <el-option label="有效" value="1"></el-option>
                    <el-option label="无效" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生效时长">
                <el-select v-model="form.availTime" style="width:100%" placeholder="请选择座席分类状态" clearable>
                    <el-option label="请选择" value=""></el-option>
                    <el-option label="7天" value="1"></el-option>
                    <el-option label="1个月" value="0"></el-option>
                    <el-option label="3个月" value="0"></el-option>
                    <el-option label="6个月" value="0"></el-option>
                    <el-option label="永久" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发起人">
                <el-input v-model="form.userId" clearable  @keyup.native="seatNumLimit(form.seatClassNum)" maxlength="10"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户姓名">
                <el-input v-model="form.custName" clearable  @keyup.native="seatNumLimit(form.seatClassNum)" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注">
                <el-input v-model="form.skillTeamNumber" clearable  @keyup.native="seatNumLimit(form.seatClassNum)" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
          <el-col :span="24">
              <el-button type="primary" plain size="small" @click="seatClassQuery()">查询</el-button>
          </el-col>
        </el-row>
      </el-col>
      <!-- 查询条件结束 -->
      <!-- 查询列表开始 -->
      <el-col>
        <el-row class="text-right">
          <el-col :span="24">
              <el-button size="small" type="primary" plain @click="addSeatClass()">增加</el-button>
              <el-button size="small" type="primary" plain @click="changeSeatClass()">修改</el-button>
              <el-button size="small" type="primary" plain @click="deleteSeatClass()">删除</el-button>
              <el-button size="small" type="primary" plain >批量导入</el-button>
              <el-button size="small" type="primary" plain @click="back()">返回</el-button>
          </el-col>
        </el-row>
        <h2 class="querylist_style border">查询结果</h2>
        <queryResTable  pagePosition="right" :url ='postUrl' :params="params" ref="tableBox" :reloadData.sync="reloadData"
        :pageSize="20"  @dataChanged="dataChangedCallback">
          <template v-slot:paginationContainer>
            <el-table ref="multipleTable" :data="tableData"  tooltip-effect="dark" max-height="500" border :highlight-current-row="true"
            stripe @current-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="40"></el-table-column> -->
                <el-table-column  prop="callNo" label="主叫号码"></el-table-column>
                <el-table-column prop="certId" label="客户证件号"></el-table-column>
                <el-table-column prop="cardNo" label="卡号"></el-table-column>
                <el-table-column prop="userId" label="发起人"></el-table-column>
                <el-table-column prop="skillTeamNumber" label="创建时间"></el-table-column>
                <el-table-column prop="lapseDate" label="失效时间" width="200"></el-table-column>
                <el-table-column prop="availTime" label="生效时长"></el-table-column>
                <el-table-column prop="custName" label="客户姓名"></el-table-column>
                <el-table-column prop="banksName" label="开户行"></el-table-column>
                <el-table-column prop="skillTeamNumber" label="备注"></el-table-column>
            </el-table>
          </template>
        </queryResTable>
      </el-col>
      <!-- 查询列表结束 -->
    </el-row>
    <!-- 新增弹窗开始 -->
    <dialogpage :title="title" :formData="form_add" :formBack="form_add1" :showDialog.sync="dialogShow"  @close='dialogClose'>
      <template v-slot:dialogName>
          <el-row>
            <el-form :model="form_add" label-width="140px" ref="form_add" :rules="rules" class="demo-ruleForm">
              <el-col :span="11">
                  <el-form-item label="主叫号码" prop="callNo">
                      <el-input v-model="form_add.callNo" clearable  placeholder="请输入账号" maxlength="20"></el-input>
                  </el-form-item>
              </el-col>
               <el-col :span="11">
                  <el-form-item label="证件类型" prop="certType">
                      <el-select v-model="form_add.certType" style="width:100%" placeholder="请选择状态" clearable>
                        <el-option label="请选择" value=""></el-option>
                          <el-option label="身份证" value="1"></el-option>
                          <el-option label="护照" value="0"></el-option>
                          <el-option label="军人证" value="0"></el-option>
                          <el-option label="武警证" value="0"></el-option>
                          <el-option label="港澳台通行证" value="0"></el-option>
                          <el-option label="户口簿" value="0"></el-option>
                          <el-option label="台湾居民来往大陆通行证" value="0"></el-option>
                          <el-option label="外国人永久居留证" value="0"></el-option>
                          <el-option label="港澳居民居住证" value="0"></el-option>
                          <el-option label="台湾居民居住证" value="0"></el-option> 
                      </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="11">
                  <el-form-item label="客户证件号" prop="certId">
                      <el-input v-model="form_add.certId" clearable  placeholder="请输入客户职务" maxlength="30"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="11">
                  <el-form-item label="卡号" prop="cardNo">
                      <el-input v-model="form_add.cardNo" clearable placeholder="请输入行业" maxlength="20"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="11">
                  <el-form-item label="状态" prop="status">
                      <el-select v-model="form_add.status" style="width:100%" placeholder="请选择状态" clearable>
                          <el-option label="有效" value="1"></el-option>
                          <el-option label="无效" value="0"></el-option>
                      </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="11">
                  <el-form-item label="生效时长" prop="availTime">
                    <el-select v-model="form_add.availTime" style="width:100%" placeholder="请选择生效时长" clearable>
                      <el-option label="请选择" value=""></el-option>
                      <el-option label="7天" value="1"></el-option>
                      <el-option label="1个月" value="0"></el-option>
                      <el-option label="3个月" value="0"></el-option>
                      <el-option label="6个月" value="0"></el-option>
                      <el-option label="永久" value="0"></el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="11">
                  <el-form-item label="开户行" prop="banksName">
                      <el-input v-model="form_add.banksName" clearable placeholder="请输入客户号" maxlength="50"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="11">
                  <el-form-item label="客户名称" prop="custName">
                      <el-input v-model="form_add.custName" clearable placeholder="请输入客户偏好" maxlength="20"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="11">
                  <el-form-item label="备注" prop="remark">
                      <el-input v-model="form_add.remark" clearable placeholder="请输入客户证件号" maxlength="50"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="11">
                  <el-form-item label="连续录入" prop="skillTeamName">
                      <el-input v-model="form_add.skillTeamName" clearable></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="24" style="text-align:center;">
              <el-button size="small" type="primary" plain v-show="add_change=='1'" @click="submitNewSeatClass('form_add')">确认</el-button>
              <el-button size="small" type="primary" plain v-show="add_change=='0'" @click="changeSeat('form_add')">确认</el-button> 
              <el-button size="small" type="primary" plain  @click="dialogClose()">返回</el-button> 
            </el-col>
            </el-form>
          </el-row>
        </template>
    </dialogpage>      
      <!-- 新增弹窗结束 -->
  </div>
</template>  
<script>
import MainAjax from "@/core/utils/MainAjax";
import queryResTable from '@/core/components/PaginationContainer';
import dialogpage from "@/pages/components/dialog";
import { mapActions } from 'vuex';
export default {
  name:"seatClass",
  components:{queryResTable,dialogpage},
  data() {
    return {
      //列表model
      form:{
        callNo:"",
        certId:"",
        cardNo:"",
        status:"",
        availTime:"",
        userId:"",
        custName:"",
      },
      postUrl:urlConfig.admin.queryFraudBlackList,
      params:{},
      reloadData:0,
      tableData: [],//列表数据  
      checkTableData:[],//获取选中的数据 
      //新增和修改
      dialogShow:false,
      title:"",
      add_change:"1",//1新增 0修改
      form_add:{
        callNo:"",
        certType:"",
        certId:"",
        cardNo:"",
        status:"",
        availTime:"",
        banksName:"",
        custName:"",
        remark:"",
      },
      rules:{
        skillTeamCode:[{required:true,message:'请输入座席分类编码',trigger:'blur'},{min:1,max:10,message:'最多输入10个字符',trigger:'blur'}],
        skillTeamNumber:[{required:true,message:'请输入座席分类号',trigger:'blur'},{min:1,max:10,message:'最多输入10个字符',trigger:'blur'}],
        skillTeamName:[{required:true,message:'请输入座席分类名称',trigger:'blur'},{min:1,max:10,message:'最多输入20个字符',trigger:'blur'}],
      },
      form_add1:{
        callNo:"",
        certType:"",
        certId:"",
        cardNo:"",
        status:"",
        availTime:"",
        banksName:"",
        custName:"",
        remark:"",
      }
         
    }
  },
  methods:{
    //列表查询
    seatClassQuery(){
      this.params={
        callNo:this.form.callNo,
        certId:this.form.certId,
        cardNo:this.form.cardNo,
        status:this.form.status,
        availTime:this.form.availTime,
        userId:this.form.userId,
        custName:this.form.custName,
      } 
      this.reloadData =1; 
    },
    //获取用户列表接口返回的数据
    dataChangedCallback(response){
        this.tableData = response&&response? response.skillTeamList:[];
    },
    handleSelectionChange(data){
      console.log(data)
      this.checkTableData=data;
    },
    //新增坐席
    addSeatClass(){
      this.add_change="1";
      this.title = "增加欺诈黑名单";
      this.dialogShow = true;
    },
    //修改坐席
    changeSeatClass(){
      if(this.checkTableData.length<=0){
        this.$message({ 
            //showClose: true,
            message: '请选择一条数据',
            type: 'warning'
        });
        return false;
      }
      this.add_change="0";
      this.title = "修改欺诈黑名单";
      this.dialogShow = true;
    },
    //删除坐席
    deleteSeatClass(){
      this.$message({
        showClose: true,
        message: '删除成功',
        type: 'success'
      });
    },
    //新增保存
    submitNewSeatClass(formdata){
      this.$refs[formdata].validate((val)=>{
        if(val){
          let param={
            skillTeamCode:this.form_add.skillTeamCode,
            skillTeamNumber:this.form_add.skillTeamNumber,
            skillTeamName:this.form_add.skillTeamName,
            checkedSkill:this.form_add.checkedSkill.length.toString(),
            status:this.form_add.status,
          }
          MainAjax.doPost(urlConfig.admin.saveOrUpdateSkillTeam,param).then(req =>{
            if(req.retCode==this.$constants.returnCode.success){
              if(req.reminder == '0'){
                  this.$message({ 
                      showClose: true,
                      message: '用户名已存在',
                      type: 'waring'
                  });  
              }else if(req.reminder == '1'){
                  this.$message({
                      showClose: true,
                      message: '证件号已存在',
                      type: 'waring'
                  });
              }else if(req.reminder == '2'){
                  this.$message({
                      showClose: true,
                      message: '已绑定操作员',
                      type: 'waring'
                  });
              }else{
                this.dialogShow = false;
                this.$emit('resultChange',{info:[
                  {
                      type: this.$constants.optionResultType.success,
                      content:"新增成功!",
                  }
                  ],flush:true});
              }       
            }else{
                this.$message({
                    showClose: true,
                    message: req.retMsg,
                    type: 'waring'
                }); 
            }
          });
        }
      })

      // this.dialogShow = false;
      // this.$message({
      //   showClose: true,
      //   message: '保存成功',
      //   type: 'success'
      // });
    },
     //修改保存
    changeSeat(formdata){
      console.log(this.checkTableData.id)
      return;
      this.$refs[formdata].validate((val)=>{
        if(val){
          let param={
            id:this.checkTableData.id,
            skillTeamCode:this.form_add.skillTeamCode,
            skillTeamNumber:this.form_add.skillTeamNumber,
            skillTeamName:this.form_add.skillTeamName,
            checkedSkill:this.form_add.checkedSkill.length.toString(),
            status:this.form_add.status,
          }
          MainAjax.doPost(urlConfig.admin.saveOrUpdateSkillTeam,param).then(req =>{
            if(req.retCode==this.$constants.returnCode.success){
              if(req.reminder == '0'){
                  this.$message({ 
                      showClose: true,
                      message: '用户名已存在',
                      type: 'waring'
                  });  
              }else if(req.reminder == '1'){
                  this.$message({
                      showClose: true,
                      message: '证件号已存在',
                      type: 'waring'
                  });
              }else if(req.reminder == '2'){
                  this.$message({
                      showClose: true,
                      message: '已绑定操作员',
                      type: 'waring'
                  });
              }else{
                this.dialogShow = false;
                  this.$emit('resultChange',{info:[
                    {
                        type: this.$constants.optionResultType.success,
                        content:"新修改成功!",
                    }
                    ],flush:true});
              }       
            }else{
                this.$message({
                    showClose: true,
                    message: req.retMsg,
                    type: 'waring'
                }); 
            }
          });
        }
      })

      // 
      // this.$message({
      //   showClose: true,
      //   message: '保存成功',
      //   type: 'success'
      // });
    },
    //关闭弹框
    dialogClose(){
      this.dialogShow = false;
    },
    seatNumLimit(){
      if(isNaN(parseInt(this.form.seatClassNum))){
        this.form.seatClassNum = "";
      }else{
        this.form.seatClassNum = parseInt(this.form.seatClassNum);
      }
    },
     seatNumDialog(){
      if(isNaN(parseInt(this.form_add.seatClassNum))){
        this.form_add.seatClassNum = "";
      }else{
        this.form_add.seatClassNum = parseInt(this.form_add.seatClassNum);
      }
     }
  },
  mounted(){
    this.seatClassQuery();
  },
}
</script>
<style scoped>

</style>
