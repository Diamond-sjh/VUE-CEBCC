<!-- 新员工专属客户-->
<template>
     <div>
      <!-- 查询条件开始 -->
        <el-row class="custquery">
          <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
            <el-col :span="8">
              <el-form-item label="证件号">
                <el-input v-model="form.dicCode" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="卡号">
                <el-input v-model="form.dicValue" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户号">
                <el-input v-model="form.dicValue" clearable></el-input>
              </el-form-item>
              </el-col>
               <el-col :span="8">
               <el-form-item label="手机号">
                <el-input v-model="form.dicValue" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据类型">
                <el-select v-model="form.status" style="width:100%" placeholder="请选择状态" clearable>
                  <el-option label="手工维护" value="0"></el-option>
                  <el-option label="自动导入" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
          <el-col :span="24">
            <el-button type="primary" size="small" plain @click="adminlistquery()">查询</el-button>
          </el-col>
        </el-row>
      <!-- 查询条件结束 -->
      <!-- 查询列表开始 -->
        <el-row>
          <el-col :span="24" class="text_right">
            <el-button type="primary" size="small" plain @click="addAdminPara('form_add')">新增</el-button>
            <el-button type="primary" size="small" plain @click="changeAdminPara('form_add')">修改</el-button>
            <el-button type="primary" size="small" plain @click="delAdminiPara()">删除</el-button>
            <el-button type="primary" size="small" plain @click="importData('form_add')">导入</el-button>
            <el-button type="primary" size="small" plain @click="changeAdminPara('form_add')">查看</el-button>
          </el-col>
        </el-row>
        <h2 class="querylist_style border">查询结果</h2>
        <queryResTable :pageSize="20" pagePosition="right" :url="postUrl" :params="params" :pageSizes="[20]" @dataChanged="dataChangedCallback" height="300" ref="tableBox" :reloadData.sync="reloadData">
          <template v-slot:paginationContainer>
            <el-table ref="multipleTable" :data="paramTableData" tooltip-effect="dark" stripe max-height="500" border @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column label="账号" width="200">
                <template slot-scope="scope">
                  <a class="dataTableStyle">
                    <span @click="dutyNameClick(scope.row)">{{scope.row.dutyName}}</span>
                  </a>
                </template>
              </el-table-column>
              <el-table-column prop="dutyCode" label="账号类型"></el-table-column>
              <el-table-column prop="dutyKindName" label="客户证件号" width></el-table-column>
              <el-table-column prop="statusName" label="客户姓名" width></el-table-column>
              <el-table-column prop label="客户类型" width></el-table-column>
              <el-table-column prop label="等级" width></el-table-column>
              <el-table-column prop label="行业" width></el-table-column>
              <el-table-column prop label="状态" width></el-table-column>
              <el-table-column prop label="更新日期" width></el-table-column>
              <el-table-column prop label="维护人" width></el-table-column>
            </el-table>
          </template>
        </queryResTable>
      <!-- 查询列表结束 -->
     <dialogpage :title="title" :showDialog.sync="dialogVisible" :formData="form_add" :formBack="form_add1" @open="openDialog">
    <template v-slot:dialogName>
      <el-row>
        <el-form
          :model="form_add"
          :rules="rules"
          ref="form_add"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-col :span="11">
            <el-form-item label="客户姓名" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="11">
              <el-form-item label="性别" :span="11">
                <el-select v-model="form.status" style="width:100%" placeholder="请选择性别" clearable>
                  <el-option label="男" value="0"></el-option>
                  <el-option label="女" value="1"></el-option>
                  <el-option label="其他" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          <el-col :span="11">
            <el-form-item label="证件号" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="卡号" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="11">
            <el-form-item label="手机号" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
              <el-form-item label="状态" :span="11">
                <el-select v-model="form.status" style="width:100%" placeholder="请选择状态" clearable>
                  <el-option label="有效" value="0"></el-option>
                  <el-option label="无效" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
            <el-form-item label="开户行" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户号" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="签约客服" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="签约SPA号" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
            <el-col :span="11">
            <el-form-item label="agentID" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户评级" prop="dutyKind">
              <el-select v-model="form_add.dutyKind" style="width:100%" placeholder="请选择类型">
                <el-option label="睡眠客户" value="1"></el-option>
                <el-option label="普通客户" value="2"></el-option>
                <el-option label="潜力客户" value="2"></el-option>
                <el-option label="优质客户" value="2"></el-option>
                <el-option label="财富客户" value="2"></el-option>
                <el-option label="准私人客户" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="11">
            <el-form-item label="分行客户经理号" prop="dutyName" >
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="500" style=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-show="addorchange==='add'">
            <el-checkbox v-model="checked">连续录入</el-checkbox>
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align:center;">
          <el-button @click="dialogVisible = false" type="primary" size="small" plain>取 消</el-button>
          <el-button v-show="addorchange==='add'" type="primary" size="small" plain @click="adminaddSub('form_add')">保存</el-button>
          <el-button v-show="addorchange==='change'" type="primary" size="small" plain @click="adminchangeSub('form_add')">保存</el-button>
        </el-col>
      </el-row>
    </template>
    </dialogpage>
  </div>
</template>
<script>
import queryResTable from "@/core/components/PaginationContainer";
import { mapActions } from "vuex";
import dialogpage from "@/pages/components/dialog";
export default {
  name: "regionDebitcardCust",
  components: { queryResTable ,dialogpage},
  data() {
    //参数编码验证
    var validatedicCode = (rule, value, callback) => {
      var pattern = /^[0-9a-zA-Z]+$/;
      if (value === "") {
        callback(new Error("请输入参数编码"));
      } else {
        if (pattern.test(value)) {
          callback();
        } else {
          callback(new Error("数字+字母的组合(区分大小写)"));
        }
      }
    };
    return {
      //列表model
      reloadData: 0,
      pageSize: 10,
      pagePosition: "",
      postUrl: urlConfig.admin.paramQuery,
      params: "",
      form: {
        dicCode: "",
        dicValue: "",
        status: "",
        dicKind: "1",
        turnPageBeginPos: "1",
        turnPageShowNum: "10"
      },
      listur: [{ dicCode: "", dicname: "gml" }],
      statusList: [
        {
          value: "1",
          label: "有效"
        },
        {
          value: "0",
          label: "无效"
        }
      ],
      //新增修改弹框
      addorchange: "", //新增或修改标示
      title: "", //弹框title
      params: {},
      tableData: [], //列表数据
      //新增修改弹框
      checked: false,
      dialogVisible: false, //是否显示弹框
      form_add: {
        //新增修改model
        codePath: "",
        dicCode: "",
        dicValue: "",
        status: "1",
        remark: "",
        orderNo: "",
        dicKind: "1"
      },
      form_add1: {
         //新增修改model
        codePath: "",
        dicCode: "",
        dicValue: "",
        status: "1",
        remark: "",
        orderNo: "",
        dicKind: "1"
      },
      rules: {
        codePath:[{required:false}],
        dicCode: [
          // { required: true, message: "请输入参数编码", trigger: "blur" },
          // { min: 1, max: 20, message: "最多输入100个字符", trigger: "blur" },
          { validator: validatedicCode, trigger: "blur" }
        ],
        dicValue: [
          { required: true, message: "请输入参数值", trigger: "blur" },
          { min: 1, max: 500, message: "最多输入500个字符", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请输入参数说明", trigger: "blur" },
          { min: 1, max: 500, message: "最多输入500个字符", trigger: "blur" }
        ],
        // status: [{ required: true, message: "请选择状态", trigger: "change" }],
        orderNo: [
          { required: true, message: "请输入参数序号", trigger: "blur" }
        ]
      },
      paramTableData: [], //查询到的技能列表数据
      multipleSelection: [] //列表选中的数据
    };
  },
  methods: {
    //获取列表选中的数据
    handleSelectionChange(val) {
      //console.log(val)
      this.multipleSelection = val;
    },
    //查询列表
    techlistquery(dicCode) {
      let params = {
        
        dicParantId: dicCode,
        dicCode: this.form.dicCode,
        dicValue: this.form.dicValue,
        status: this.form.status,
        dicKind: this.form.dicKind
      };
      // console.log('-------'+dicCode);
      this.params = params;
      this.reloadData = 1;
      // }
    },
    //查询子列表
    dicCodeClick(row) {
      console.log(row.dicInfoId)
      if (this.listur.length >= 4) {
        return;
      }
      this.techlistquery(row.dicInfoId);
      this.listur.push(
        {"dicname":row.dicCode,"dicCode":row.dicInfoId},
      )
      console.log(this.listur);
    },
    //点击根目录
    clickurl(val, index) {
      this.techlistquery(val);
      this.listur.splice(index + 1, this.listur.length - index + 1);
    },
    //获取用户列表接口返回的数据
    dataChangedCallback(response) {
      this.paramTableData =
        response ? response.paramList : [];
      console.log(response);
    },
    //新增页面
    addAdminPara() {
      this.addorchange = "add";
      this.title = "新增";
      this.dialogVisible = true;
      //  this.form_add.dicCode = ''
    },

    //整数验证
    BlurText(e) {
      let boolean = new RegExp("^[1-9][0-9]*$").test(e.target.value);
      if (!boolean) {
        this.$message.warning("请输入整数");
        e.target.value = "";
      }
    },
    //新增保存按钮
    adminaddSub(formdata) {
      
      console.log(this.listur);
      this.$refs[formdata].validate(val => {
        if (val) {
          let dicParantId = '';
          let idx = (this.listur.length-1);
          if(idx>=0){
            dicParantId = this.listur[idx].dicCode;
          }
          let param = {
            codePath: this.form_add.codePath+`${this.form_add.dicCode}`,
            dicCode: this.form_add.dicCode,
            dicValue: this.form_add.dicValue,
            remark: this.form_add.remark,
            orderNo: this.form_add.orderNo,
            status: this.form_add.status ? this.form_add.status : "1",
            dicKind: "1",
            dicParantId:dicParantId,
          };
          // console.log(param);
          // return ;
          this.$MainAjax.doPost(urlConfig.admin.paramAdd, param).then(res => {
            // console.log(this.param.dicCode);
            if (res.retCode == this.$constants.returnCode.success) {
              if (res.reminder == "0") {
                this.$message({
                  showClose: true,
                  message: "新增的在系统中已存在，不能重复添加",
                  type: "warning"
                });
              } else {
                console.log(this.form_add.dicCode)
                this.$message({
                  showClose: true,
                  message: `新增成功${this.form_add.dicCode}`,
                  type: "success"
                });
                this.techlistquery(this.listur[this.listur.length-1].dicCode);
                this.form_add = {};
                if( this.checked === true) {

                }else{
                  //关闭弹窗
                  this.dialogVisible=false;
                }

              }
            }
          });
        } else {
          return false;
        }
      });
      
    
    },
    //修改保存按钮
    adminchangeSub(formdata) {
      this.$refs[formdata].validate(val => {
        if (val) {
          let param = {
            dicInfoId: this.multipleSelection[0].dicInfoId,
            dicCode: this.form_add.dicCode,
            dicValue: this.form_add.dicValue,
            remark: this.form_add.remark,
            status: this.form_add.status,
            dicKind: "1"
          };

          this.$MainAjax.doPost(urlConfig.admin.paramUpdate, param).then(res => {
            console.log(res);

            //    this.$message({
            // showClose: true,
            // message: "修改成功！",
            // type: "sucess"
            // });
            if (res.retCode == this.$constants.returnCode.success) {
              if (res.reminder == "0") {
                this.$message({
                  showClose: true,
                  message: "新增的角色在系统中已存在，不能重复添加",
                  type: "warning"
                });
              } else {
                this.$message({
                  showClose: true,
                  dangerouslyUseHTMLString: true,
                  message: '<i></i>',
                  type: "success"
                });
              }
            }
            this.techlistquery();
          });
        } else {
          return false;
        }
      });
    },
    //修改弹框
    changeAdminPara() {
      //console.log(this.multipleSelection)
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
      //console.log(this.multipleSelection[0])
      this.form_add.codePath = this.multipleSelection[0].dicCode,
      this.form_add.dicCode = this.multipleSelection[0].dicCode; //参数编码
      this.form_add.dicValue = this.multipleSelection[0].dicValue; //参数值
      this.form_add.status = this.multipleSelection[0].status; //状态
      this.form_add.remark = this.multipleSelection[0].remark; //参数说明
      //console.log(this.form_add.dicCode);
    },
    //新增修改弹框打开
    openDialog() {
      console.log(this.addorchange == "add");
      if (this.addorchange == "add") {
        // this.$nextTick(() => {
          // this.$refs.form_add.resetFields();
          let pathName ="";
          for( let idx=0; idx<this.listur.length; idx++){
            pathName += this.listur[idx].dicname+'/';
          } 
          this.form_add = {
            //新增修改model
            codePath: pathName,
            dicCode: "",
            dicValue: "",
            status: "1",
            remark: "",
            orderNo: "",
            dicKind: "1"
          }
        // });
      }
    },

    changeStatus() {
      if (this.multipleSelection.length == "0") {
        this.$message({
          showClose: true,
          message: "请至少选择一条数据！",
          type: "warning"
        });
        return;
      }

      var ids = [];
      var param; 
      for(let i=0;i<this.multipleSelection.length;i++){
        param = this.multipleSelection[i].dicInfoId;
        ids.push(param)
      }
    //  this.$MainAjax.doPost(urlConfig.admin.paramAdd,param) .then{

    //  }

      
    }
  },
  mounted: function() {
    this.techlistquery();
  }
}
</script>
<style scoped>
</style>