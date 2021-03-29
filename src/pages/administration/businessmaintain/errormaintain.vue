<template>
    <!-- 错误码维护 -->
    <div>
        <!-- 查询条件开始 -->
        <el-row class="custquery">
            <el-form :model="form" label-width="160px" class="demo-ruleForm" size="small">
                <el-col :span="8">
                <el-form-item label="系统">
                    <el-select v-model="form.errorSource" style="width:100%" placeholder="请选择系统" clearable>
                        <el-option label="内管系统" value="MG"></el-option>
                        <el-option label="交易系统 " value="TX"></el-option>
                        <el-option label="安全中心 " value="SA"></el-option>
                        <el-option label="网关系统 " value="WG"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                <el-form-item label="错误类型">
                    <el-select v-model="form.errorType" style="width:100%" placeholder="请选择错误类型" clearable>
                        <el-option label="技术类错误" value="T"></el-option>
                        <el-option label="业务类型错误" value="B"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                <el-form-item label="错误码值">
                    <el-input v-model="form.errCode" clearable placeholder="错误码值"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                <el-form-item label="模块">
                    <el-select v-model="form.errorModule" style="width:100%" placeholder="请选择模块" clearable>
                        <el-option label="技术类错误" value="T"></el-option>
                        <el-option label="业务类型错误" value="B"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                <el-form-item label="状态">
                    <el-select v-model="form.status" style="width:100%" placeholder="请选择状态" clearable>
                        <el-option label="有效" value="1"></el-option>
                                <el-option label="无效" value="0"></el-option>
                    </el-select>
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
            <el-button type="primary" plain size="small"  @click="addAdminPara('form_add')">新增</el-button>
            <el-button type="primary" plain size="small" @click="changeAdminPara('form_add')">修改</el-button>
            <el-button type="primary" plain size="small" @click="delAdminiPara()">删除</el-button>
          </el-col>
        </el-row>
        <h2 class="querylist_style border">查询结果</h2>
        <queryResTable :pageSize="20" pagePosition="right" :url="postUrl" :params="dataparams" :pageSizes="[20]" @dataChanged="dataChangedCallback" ref="tableBox" :reloadData.sync="reloadData">
            <template v-slot:paginationContainer>
                <el-table ref="multipleTable" :data="paramTableData" tooltip-effect="dark" max-height="500" border @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column prop="systemFlag" width="110" label="系统" ></el-table-column>
                <el-table-column prop="errorType"  width="110" label="错误类型" ></el-table-column>
                <el-table-column prop="errCode"  width="110" label="错误码值" ></el-table-column>
                <el-table-column prop="errorModule" width="110" label="模块"></el-table-column>
                <el-table-column prop="createDate" width="180" label="创建日期"></el-table-column>
                <el-table-column prop="updateDate" width="180" label="修改日期"></el-table-column>
                <el-table-column prop="errorMessage" width="280" label="描述"></el-table-column>
                <el-table-column prop="errorMessageEn" width="280" label="描述（英文）" ></el-table-column>
                <el-table-column prop="status" width="100" label="状态" ></el-table-column>
                <el-table-column prop="remark" width="" label="备注" ></el-table-column>
                </el-table>
            </template>
        </queryResTable>
        <!-- 查询列表结束 -->
    
        <dialogpage :title="title" :formData="form_add" :formBack="form_add1" :showDialog.sync="dialogVisible" @close="closedialog" @open="opendialog">
            <template v-slot:dialogName>
                <el-form :model="form_add" :rules="rules" ref="form_add" label-width="120px" class="demo-ruleForm">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="错误码来源系统" prop="errorSource">
                                <el-select v-model="form_add.errorSource" style="width:100%" placeholder="请选择错误码来源系统" clearable>
                                    <el-option label="内管系统" value="MG"></el-option>
                                    <el-option label="交易系统 " value="TX"></el-option>
                                    <el-option label="安全中心 " value="SA"></el-option>
                                    <el-option label="网关系统 " value="WG"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="系统来源" prop="systemFlag">
                                <el-select v-model="form_add.systemFlag" style="width:100%" placeholder="请选择系统来源" clearable>
                                    <el-option label="内部系统" value="0"></el-option>
                                    <el-option label="第三方系统" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="错误类型" prop="errorType">
                                <el-select v-model="form_add.errorType" style="width:100%" placeholder="请选择错误类型" clearable>
                                <el-option label="技术类错误" value="T"></el-option>
                                <el-option label="业务类型错误" value="B"></el-option>
                            </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="模块" prop="errorModule">
                            <el-select v-model="form_add.errorModule" style="width:100%" placeholder="请选择模块" clearable>
                                <el-option label="用户" value="1"></el-option>
                                <el-option label="角色" value="2"></el-option>
                            </el-select>
                            </el-form-item>
                        </el-col>
                            <el-col :span="11">
                            <el-form-item label="错误描述" placeholder="请输入错误描述" prop="errorMessage" clearable>
                            <el-input v-model="form_add.errorMessage"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="错误描述(英文)" placeholder="请输入错误描述(英文)" prop="errorMessageEn" clearable>
                            <el-input v-model="form_add.errorMessageEn"></el-input>
                            </el-form-item>
                        </el-col>
                            <el-col :span="11">
                            <el-form-item label="备注" prop="remark" placeholder="请输入备注" clearable>
                            <el-input v-model="form_add.remark"></el-input>
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
                        <el-col :span="11" v-show="addorchange==='add'">
                            <el-checkbox v-model="checked">连续录入</el-checkbox>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                <el-col :span="24" style="text-align:center;">
                    <el-button size="small"  type="primary" plain @click="dialogVisible=false">取 消</el-button>
                    <el-button size="small" v-show="addorchange==='add'" type="primary" plain @click="adminaddSub('form_add')">保存</el-button>
                    <el-button size="small"  v-show="addorchange==='change'" type="primary" plain @click="adminchangeSub('form_add')">保存</el-button>
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
    name: "errormaintain",
    components: { queryResTable,dialogpage},
    data() {
    return {
      //列表model
      reloadData: 0,
      postUrl: urlConfig.admin.queryErrorInfoList,
      dataparams: {},
      form: {
        errorSource: "",
        errorType: "",
        errCode: "",
        errorModule:"",
        status:"",
      },
      paramTableData: [], //列表数据
      multipleSelection: [], //列表选中的数据
      //新增修改弹框
      addorchange: "", //新增或修改标示
      title: "", //弹框title
      dialogVisible: false, //是否显示弹框
      form_add: {
        //新增修改model
        errorSource:"",
        systemFlag:"",
        errorType:"",
        errorModule:"",
        errorMessage:"",
        errorMessageEn:"",
        remark:"",
        status:""
      },
      form_add1: {
        //新增修改model
        errorSource:"",
        systemFlag:"",
        errorType:"",
        errorModule:"",
        errorMessage:"",
        errorMessageEn:"",
        remark:"",
        status:""
      },
      rules: {
        //custName: [{ required: true, message: "请输入客户姓名", trigger: "blur" },{max:20,message:"最大输入20个字符"}],
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
      this.paramTableData = response ? response.errorInfoList : [];
    },
    //查询列表
    adminlistquery() {
      let params = {
        errorSource:this.form.errorSource,
        errorType: this.form.errorType,
        errCode:this.form.errCode,
        errorModule:this.form.errorModule,
        status:this.form.status,
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
            errorSource:this.form_add.errorSource,
            systemFlag:this.form_add.systemFlag,
            errorType:this.form_add.errorType,
            errorModule:this.form_add.errorModule,
            errorMessage:this.form_add.errorMessage,
            errorMessageEn:this.form_add.errorMessageEn,
            remark:this.form_add.remark,
            status:this.form_add.status,
          };
          this.$MainAjax.doPost(urlConfig.admin.saveErrorInfo, param).then(req => {
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
      this.form_add.errorSource=this.multipleSelection[0].errorSource;
      this.form_add.systemFlag=this.multipleSelection[0].systemFlag;
      this.form_add.errorType=this.multipleSelection[0].errorType;
      this.form_add.errorModule=this.multipleSelection[0].errorModule;
      this.form_add.errorMessage=this.multipleSelection[0].errorMessage;
      this.form_add.errorMessageEn=this.multipleSelection[0].errorMessageEn;
      this.form_add.remark=this.multipleSelection[0].remark;
      this.form_add.status=this.multipleSelection[0].status;  
    },
    //修改保存按钮
    adminchangeSub(formdata) {
      this.$refs[formdata].validate(val => {
        if (val) {
          let param = {
            errorInfoId:this.multipleSelection[0].errorInfoId,
            errorSource:this.form_add.errorSource,
            systemFlag:this.form_add.systemFlag,
            errorType:this.form_add.errorType,
            errorModule:this.form_add.errorModule,
            errorMessage:this.form_add.errorMessage,
            errorMessageEn:this.form_add.errorMessageEn,
            remark:this.form_add.remark,
            status:this.form_add.status,
          };
          this.$MainAjax.doPost(urlConfig.admin.updateErrorInfo, param).then(req => {
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
          errorInfoId:this.multipleSelection[0].errorInfoId
        }
        this.$MainAjax.doPost(urlConfig.admin.delErrorInfo,params).then(req => {
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
