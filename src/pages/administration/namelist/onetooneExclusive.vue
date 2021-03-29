<template>
    <!-- 一对一专属坐席 -->
    <div>
      <!-- 查询条件开始 -->
      <el-row class="custquery">
        <el-form :model="form" label-width="160px" class="demo-ruleForm" size="small">
          <el-col :span="8">
            <el-form-item label="客户号">
              <el-input v-model="form.custId" clearable maxlength="20" placeholder="请输入客户号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号">
              <el-input v-model="form.phone" clearable maxlength="11" placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
            <el-col :span="8">
              <el-form-item label="专属座席操作员号">
                <el-input v-model="form.agentId1" clearable maxlength="10" placeholder="请输入专属座席操作员号"></el-input>
              </el-form-item>
          </el-col>
        </el-form>
        <el-col :span="24" class="but">
          <el-button type="primary" plain size="small" @click="adminlistquery()">查询</el-button>
        </el-col>
      </el-row>
      <!-- 查询条件结束 -->
      <!-- 查询列表开始 -->
      <el-row>
        <el-col :span="24" class="text_right">
          <el-button size="small" type="primary" plain  @click="addAdminPara('form_add')">新增</el-button>
          <el-button size="small" type="primary" plain @click="changeAdminPara('form_add')">修改</el-button>
          <el-button size="small" type="primary" plain @click="delAdminiPara()">删除</el-button>
          <el-button size="small" type="primary" plain @click="delAdminiPara()">批量导入</el-button>
        </el-col>
      </el-row>
      <h2 class="querylist_style border">查询结果</h2>
      <queryResTable :pageSize="20" pagePosition="right" :url="postUrl" :params="dataparams" :pageSizes="[20]" @dataChanged="dataChangedCallback" ref="tableBox" :reloadData.sync="reloadData">
        <template v-slot:paginationContainer>
          <el-table ref="multipleTable" :data="paramTableData" tooltip-effect="dark" max-height="500" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column prop="custName" label="客户姓名" ></el-table-column>
            <el-table-column prop="sex"  width="60" label="性别" ></el-table-column>
            <el-table-column prop="custId" width="110" label="客户号"></el-table-column>
            <el-table-column prop="custNId" width="180" label="证件号"></el-table-column>
            <el-table-column prop="cardNo" width="180" label="卡号"></el-table-column>
            <el-table-column prop="phone" width="120" label="手机号" ></el-table-column>
            <el-table-column prop="org" width="150" label="所属机构" ></el-table-column>
            <el-table-column prop="custLevel" width="120" label="客户评级" ></el-table-column>
            <el-table-column prop="agentId1" width="100" label="操作员号" ></el-table-column>
            <el-table-column prop="fieldBak" width="120" label="专属客服姓名" ></el-table-column>
            <el-table-column prop="agentId2" width="110" label="SPA号" ></el-table-column>
            <el-table-column prop="updateDate" width="110" label="维护日期" ></el-table-column>
            <el-table-column prop="state" width="" label="状态" ></el-table-column>
            <el-table-column prop="remark" width="220" label="备注" ></el-table-column>
          </el-table>
        </template>
      </queryResTable>
      <dialogpage :title="title" :formData="form_add" :formBack="form_add1" :showDialog.sync="dialogVisible" @close="closedialog" @open="opendialog">
        <template v-slot:dialogName>
          <el-row>
            <el-form :model="form_add" :rules="rules" ref="form_add" label-width="120px" class="demo-ruleForm">
              <el-col :span="11">
                <el-form-item label="客户姓名" prop="custName">
                  <el-input v-model="form_add.custName"  placeholder="请输入客户姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="客户号" prop="custId">
                  <el-input v-model="form_add.custId" clearable placeholder="请输入客户号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="性别" prop="sex">
                  <el-select v-model="form_add.sex" style="width:100%" clearable placeholder="请选择性别">
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="证件号" prop="custNId">
                  <el-input v-model="form_add.custNId" clearable placeholder="请输入证件号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="form_add.phone" clearable placeholder="请输入手机号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="客户评级" prop="custLevel">
                  <el-input v-model="form_add.custLevel" clearable placeholder="请输入客户评级"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="卡号" prop="cardNo">
                  <el-input v-model="form_add.cardNo" clearable placeholder="请输入卡号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="机构" prop="org">
                  <el-input v-model="form_add.org" maxlength="40" clearable placeholder="请输入机构"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="操作员号" prop="agentId1">
                  <el-input v-model="form_add.agentId1" clearable placeholder="请输入操作员号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="专属客服姓名" prop="fieldBak">
                  <el-input v-model="form_add.fieldBak" clearable placeholder="请输入专属客服姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="SAP号" prop="agentId2">
                  <el-input v-model="form_add.agentId2" clearable placeholder="请输入SAP号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="状态" prop="state">
                  <el-select v-model="form_add.state" style="width:100%" clearable placeholder="请选择状态">
                    <el-option label="有效" value="1"></el-option>
                    <el-option label="无效" value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="form_add.remark" clearable placeholder="请输入备注"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" v-show="addorchange==='add'">
                <el-checkbox v-model="checked">连续录入</el-checkbox>
              </el-col>
            </el-form>
          </el-row>
          <el-row>
            <el-col :span="24" style="text-align:center;">
              <el-button size="small" type="primary" plain @click="dialogVisible=false">取 消</el-button>
              <el-button size="small" v-show="addorchange==='add'" type="primary" plain @click="adminaddSub('form_add')">保存</el-button>
              <el-button size="small" v-show="addorchange==='change'" type="primary" plain @click="adminchangeSub('form_add')">保存</el-button>
            </el-col>
          </el-row>
        </template>
      </dialogpage>
  </div>
</template>
<script>
import queryResTable from "@/core/components/PaginationContainer";
import dialogpage from "@/pages/components/dialog";
import { mapActions } from "vuex";
export default {
    name: "onetooneExcluse",
    components: { queryResTable,dialogpage},
    data() {
    return {
      //列表model
      reloadData: 0,
      postUrl: urlConfig.admin.queryPrivateAgentList,
      dataparams: {},
      form: {
        custId: "",
        phone: "",
        agentId1: "",
      },
      paramTableData: [], //列表数据
      multipleSelection: [], //列表选中的数据
      //新增修改弹框
      addorchange: "", //新增或修改标示
      title: "", //弹框title
      dialogVisible: false, //是否显示弹框
      form_add: {
        //新增修改model
        custName:"",
        custId:"",
        sex:"1",
        custNId:"",
        phone:"",
        custLevel:"",
        cardNo:"",
        org:"",
        agentId1:"",
        fieldBak:"",
        agentId2:"",
        state:"",
        remark:""
      },
      form_add1: {
        //新增修改model
        custName:"",
        custId:"",
        sex:"1",
        custNId:"",
        phone:"",
        custLevel:"",
        cardNo:"",
        org:"",
        agentId1:"",
        fieldBak:"",
        agentId2:"",
        state:"",
        remark:""
      },
      rules: {
        custName: [{ required: true, message: "请输入客户姓名", trigger: "blur" },{max:20,message:"最大输入20个字符"}],
        custId: [{ required: true, message: "请输入客户号", trigger: "blur" },{max:20,message:"最大输入20个字符"}],
        custNId: [{ required: true, message: "请输入证件号", trigger: "blur" },{max:30,message:"最大输入30个字符"}],
        phone: [{ required: true, message: "请输入手机号码", trigger: "blur" },{max:20,message:"最大输入11个字符"}],
        custLevel: [{ required: true, message: "请输入客户评级", trigger: "blur" },{max:20,message:"最大输入20个字符"}],
        cardNo: [{ required: true, message: "请输入卡号", trigger: "blur" },{max:20,message:"最大输入20个字符"}],
        agentId1: [{ required: true, message: "请输入操作员号", trigger: "blur" },{max:20,message:"最大输入10个字符"}],
        fieldBak: [{ required: true, message: "请输入专属客服姓名", trigger: "blur" },{max:20,message:"最大输入10个字符"}],
        agentId2: [{ required: true, message: "请输入SAP号", trigger: "blur" },{max:20,message:"最大输入10个字符"}],
      },
      checked: false,
    };
  },
   methods: {
    //获取列表选中的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val)
    },
    //获取用户列表接口返回的数据
    dataChangedCallback(response) {
      this.paramTableData = response ? response.privateAgentList : [];
    },
    //查询列表
    adminlistquery() {
      let params = {
        custId: this.form.custId,
        phone:this.form.phone,
        agentId1:this.form.agentId1,
      };
      this.dataparams = params;
      this.reloadData = 1;
    },
    //新增页面
    addAdminPara() {
      this.addorchange = "add";
      this.title = "新增";
      this.dialogVisible = true;
    },
    //新增保存按钮
    adminaddSub(formdata) {
      this.$refs[formdata].validate(val => {
         if (val) {
          let param = {
            custName:this.form_add.custName,
            custId:this.form_add.custId,
            sex:this.form_add.sex,
            custNId:this.form_add.custNId,
            phone:this.form_add.phone,
            custLevel:this.form_add.custLevel,
            cardNo:this.form_add.cardNo,
            org:this.form_add.org,
            agentId1:this.form_add.agentId1,
            fieldBak:this.form_add.fieldBak,
            agentId2:this.form_add.agentId2,
            state:this.form_add.state,
            remark:this.form_add.remark,
            method:"insert"
          };
          this.$MainAjax.doPost(urlConfig.admin.saveOrUpdatePrivateAgent, param).then(req => {
            if(req.retCode==this.$constants.returnCode.success){
              this.$emit('resultChange',{info:[
                {
                    type: this.$constants.optionResultType.success,
                    content:"新增成功!",
                }
                ],flush:true});
              this.adminlistquery();
              this.dialogVisible=false;
            }else{
              this.$message({
                showClose: true,
                message: req.retMsg,
                type: "waring"
              });
            }  
          });
         }
      });
    },
    //修改弹框
    changeAdminPara() {
      if (this.multipleSelection.length != "1") {
        this.$message({
          showClose: true,
          message: "请选择一条数据！",
          type: "warning"
        });
        return;
      }
      this.addorchange = "change";
      this.dialogVisible = true;
      this.title = "修改";
      this.form_add.custName=this.multipleSelection[0].custName;
      this.form_add.custId=this.multipleSelection[0].custId;
      this.form_add.sex=this.multipleSelection[0].sex;
      this.form_add.custNId=this.multipleSelection[0].custNId;
      this.form_add.phone=this.multipleSelection[0].phone;
      this.form_add.custLevel=this.multipleSelection[0].custLevel;
      this.form_add.cardNo=this.multipleSelection[0].cardNo;
      this.form_add.org=this.multipleSelection[0].org;
      this.form_add.agentId1=this.multipleSelection[0].agentId1;
      this.form_add.fieldBak=this.multipleSelection[0].fieldBak;
      this.form_add.agentId2=this.multipleSelection[0].agentId2;
      this.form_add.state=this.multipleSelection[0].state;
      this.form_add.remark=this.multipleSelection[0].remark;
     
      
      
    },
    //修改保存按钮
    adminchangeSub(formdata) {
      this.$refs[formdata].validate(val => {
        if (val) {
          let param = {
            custName:this.form_add.custName,
            custId:this.form_add.custId,
            sex:this.form_add.sex,
            custNId:this.form_add.custNId,
            phone:this.form_add.phone,
            custLevel:this.form_add.custLevel,
            cardNo:this.form_add.cardNo,
            org:this.form_add.org,
            agentId1:this.form_add.agentId1,
            fieldBak:this.form_add.fieldBak,
            agentId2:this.form_add.agentId2,
            state:this.form_add.state,
            remark:this.form_add.remark,
            method:"update",
          };
          this.$MainAjax.doPost(urlConfig.admin.saveOrUpdatePrivateAgent, param).then(req => {
            if(req.retCode==this.$constants.returnCode.success){
              this.$emit('resultChange',{info:[
                {
                    type: this.$constants.optionResultType.success,
                    content:"修改成功!",
                }
                ],flush:true});
                this.adminlistquery();
                this.dialogVisible=false;
            }else{
              this.$message({
                showClose: true,
                message: req.retMsg,
                type: "waring"
              });
            }
          });
        }
      });
    },
    //删除数据
    delAdminiPara() {
      if (this.multipleSelection.length != "1") {
        this.$message({
          showClose: true,
          message: "请选择一条数据！",
          type: "warning"
        });
        return;
      }
      this.$confirm("是否确认删除", "确认框", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warrning"
      }).then(() => {
        let params={
          deleteCustIds:[{custId:this.multipleSelection[0].custId}]
        }
        this.$MainAjax.doPost(urlConfig.admin.deletePrivateAgent,params).then(req => {
          if(req.retCode==this.$constants.returnCode.success){
            this.$emit("resultChange", {
              info: {
                type: constants.optionResultType.success,
                content: "用户删除成功"
              },
              flush: true
            });
            this.adminlistquery();
          }else{
            this.$message({
                showClose: true,
                message: req.retMsg,
                type: "waring"
              });
          } 
        });
      }).catch(() => {
        this.$message({
          showClose: true,
          message: "已取消删除",
          type: "info"
        });
      });
    },
    closedialog(){
      //console.log(val)
      //this.dialogVisible=val;
    },
    opendialog(){
    },
  },
   mounted: function() {
    this.adminlistquery();
  }
}
</script>
<style scoped>



    
</style>
