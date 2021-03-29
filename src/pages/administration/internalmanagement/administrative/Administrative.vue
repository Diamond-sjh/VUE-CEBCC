<template>
<!-- 行政管理页面 -->
  <div>
      <!-- 查询条件开始 -->
        <el-row class="custquery">
          <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
            <el-col :span="8">
              <el-form-item label="名称">
                <el-input v-model="form.dicCode" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编码">
                <el-input v-model="form.dicValue" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="级别">
                <el-select v-model="form.dutyLevel" style="width:100%" placeholder="请选择级别" clearable>
                  <el-option label="一级" value="0"></el-option>
                  <el-option label="二级" value="1"></el-option>
                  <el-option label="三级" value="2"></el-option>
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
            <el-col :span="8">
              <el-form-item label="类别">
                <el-select v-model="form.dutyKind" style="width:100%" placeholder="请选择类别" clearable>
                  <el-option label="普通" value="1"></el-option>
                  <el-option label="特殊" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
          <el-col :span="24">
            <el-button type="primary" plain size="small" @click="adminlistquerys()">查询</el-button>
          </el-col>
        </el-row>
    
      <!-- 查询条件结束 -->
      <!-- 查询列表开始 -->
       <h4 style="text-align:left;">
        <span class="dataTableStyle" v-for="(item,index) in listur" :key="index" @click="clickurl(item.dicCode,index)">{{item.dicname}}\</span>
      </h4>
        <el-row>
          <el-col :span="24" class="text_right">
            <el-button type="primary" plain size="small" @click="addAdminPara('form_add')">新增</el-button>
            <el-button type="primary" plain size="small" @click="changeAdminPara('form_add')">修改</el-button>
            <el-button type="primary" plain size="small" @click="delAdminiPara()">删除</el-button>
          </el-col>
        </el-row>
        <h2 class="querylist_style border">查询结果</h2>
        <queryResTable
          :pageSize="20"
          pagePosition="right"
          :url="postUrl"
          :params="params"
          :pageSizes="[20]"
          @dataChanged="dataChangedCallback"
          height="300"
          ref="tableBox"
          :reloadData.sync="reloadData"
        >
          <template v-slot:paginationContainer>
            <el-table
              ref="multipleTable"
              :data="paramTableData"
              tooltip-effect="dark"
               border 
               stripe 
               max-height="500"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column label="名称" width="200">
                <template slot-scope="scope">
                  <a class="dataTableStyle">
                    <span @click="dutyNameClick(scope.row)">{{scope.row.dutyName}}</span>
                  </a>
                </template>
              </el-table-column>
              <el-table-column prop="dutyLevel" label="级别" width="200"></el-table-column>
              <el-table-column prop="dutyCode" label="编码"></el-table-column>
              <el-table-column prop="dutyKind" label="类型" width="200" :formatter="formKind"></el-table-column>
              <el-table-column prop="status" label="状态" width="200" :formatter="formstatus"></el-table-column>
              <el-table-column prop="dutyRemark" label="备注" width="200"></el-table-column>
            </el-table>
          </template>
        </queryResTable>
      <!-- 查询列表结束 -->
    
   <dialogpage :title="title" :showDialog.sync="dialogVisible" :formData="form_add" :formBack="form_add1" @open="openDialog">
      <template v-slot:dialogName>
      <el-row>
        <el-form :model="form_add" :rules="rules" ref="form_add" label-width="120px" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item label="名称" prop="dutyName">
                <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="类型" prop="dutyKind">
                <el-select v-model="form_add.dutyKind" style="width:100%" placeholder="请选择类型">
                  <el-option label="普通" value="1"></el-option>
                  <el-option label="特殊" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="级别" prop="dutyLevel" placeholder="请选择级别">
                <el-select v-model="form_add.dutyLevel" style="width:100%">
                  <el-option label="一级" value="1"></el-option>
                  <el-option label="二级" value="2"></el-option>
                  <el-option label="三级" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="备注" prop="dutyRemark">
                <el-input v-model="form_add.dutyRemark" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align:center;">
          <el-button @click="dialogVisible = false" plain size="small" type="primary">取 消</el-button>
          <el-button v-show="addorchange==='add'" type="primary" plain size="small" @click="adminaddSub('form_add')">保存</el-button>
          <el-button v-show="addorchange==='change'" type="primary" @click="adminchangeSub('form_add')" plain size="small">保存</el-button>
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
  name: "administrative",
   components: { queryResTable, dialogpage},
  data() {
    return {
      //列表model
      reloadData: 0,
      pageSize: 10,
      pagePosition: "",
      postUrl: urlConfig.admin.dutyQuery,
      params: "",
      form: {
        dutyLevel: "",
        dutyName: "",
        dutyCode: "",
        dutyKind: "",
        status: "1",
        dutyRemark: "",
        turnPageBeginPos: "1",
        turnPageShowNum: "10"
      },
      paramTableData: [], //查询到的技能列表数据
      multipleSelection: [], //列表选中的数据
      listur: [{ dicCode: "", dicname: "根目录" }],
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
        dutyName: "",
        dutyLevel: "",
        dutyKind: "",
        dutyCode: "",
        status: "1",
        dutyRemark: ""
      },
      form_add1: {
        //新增修改model
        dutyName: "",
        dutyLevel: "",
        dutyKind: "",
        dutyCode: "",
        status: "1",
        dutyRemark: ""
      },
      rules: {
        dutyName: [{ required: true, message: "请输入名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    //获取列表选中的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //获取用户列表接口返回的数据
    dataChangedCallback(response) {
      this.paramTableData =
        response ? response.dutyList : [];
      console.log(response);
    },
    formstatus(row,column) {
      var states = row[column.property]
      return states == true? "有效":"无效"
          
    },
    formKind(row,column) {
      var states = row[column.property]
      return states == true? "普通":"特殊"
          
    },
    adminlistquerys(){
        let dutyParentId = "";
        let idx = this.listur.length - 1;
        dutyParentId = this.listur[idx].dicCode;
      this.adminlistquery(dutyParentId);
    },
    //查询列表
    adminlistquery(dutyInfoId) {
       
          
      let params = {
        dutyParentId: dutyInfoId,
        dutyName: this.form.dutyName,
        dutyLevel: this.form.dutyLevel,
        dutyCode: this.form.dutyCode,
        dutyKind: this.form.dutyKind,
        status: this.form.status
      };
      this.params = params;
      this.reloadData = 1;
       
    },
    //查询子列表
    dutyNameClick(row) {
      if (this.listur.length >= 4) {
        return;
      }
      this.adminlistquery(row.dutyInfoId);
      this.listur.push({ dicname: row.dutyName, dicCode: row.dutyInfoId });
    },
    //点击根目录
     clickurl(val, index) {
       console.log(val)
      this.adminlistquery(val);
      this.listur.splice(index + 1, this.listur.length - index + 1);
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
           let dutyParentId = "";
           let idx = this.listur.length - 1;
           if (idx >= 0) {
             dutyParentId = this.listur[idx].dicCode;
           }
          let param = {
            dutyName: this.form_add.dutyName,
            dutyLevel: this.form_add.dutyLevel,
            dutyRemark: this.form_add.dutyRemark,
            dutyKind: this.form_add.dutyKind,
            dutyParentId: dutyParentId
          };
          console.log(param);
          this.$MainAjax.doPost(urlConfig.admin.addDuty, param).then(res => {
                this.$message({
                  showClose: true,
                  message: `新增成功${this.form_add.dutyName}`,
                  type: "success"
                });
                //关闭弹窗
                  this.dialogVisible=false;
                   this.adminlistquery(this.listur[this.listur.length - 1].dicCode);
                   
             // }
            
          });
         } else {
           return false;
        }
      });
    },
    //新增修改弹框打开
    openDialog() {
      if (this.addorchange == "add") {
        let pathName = "";
        for (let idx = 0; idx < this.listur.length; idx++) {
          pathName += this.listur[idx].dicname + "/";
        }
        this.form_add = {
          //新增修改model
          dutyName: "",
          dutyLevel: "",
          status: "1",
          dutyRemark: "",
          dutyKind: ""
        };
        // });
      }
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
      this.form_add.dutyKind = this.multipleSelection[0].dutyKind,
      this.form_add.dutyName = this.multipleSelection[0].dutyName; //参数名称
      this.form_add.dutyLevel = this.multipleSelection[0].dutyLevel; //参数等级
      this.form_add.status = this.multipleSelection[0].status; //状态
      this.form_add.dutyRemark = this.multipleSelection[0].dutyRemark; //参数备注
    },
    //修改保存按钮
    adminchangeSub(formdata) {
      this.$refs[formdata].validate(val => {
        if (val) {
          let param = {
            dutyInfoId: this.multipleSelection[0].dutyInfoId,
            dutyName: this.form_add.dutyName,
            dutyKind: this.form_add.dutyKind,
            dutyLevel: this.form_add.dutyLevel,
            dutyRemark: this.form_add.dutyRemark,
            status: this.form_add.status
          };

          this.$MainAjax
            .doPost(urlConfig.admin.updateDuty, param)
            .then(res => {
                  this.$message({
                    showClose: true,
                    dangerouslyUseHTMLString: true,
                    message: "<i>修改成功</i>",
                    type: "success"
                  });
              this.adminlistquery();
            });
        } else {
          return false;
        }
      });
    },
    //删除数据
    delAdminiPara() {
      if (!this.multipleSelection.length ) {
        this.$message({
          showClose: true,
          message: "请选择一条数据",
          type: "warning"
        });
        return;
      }
      this.$confirm("是否确认删除", "确认框", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warrning"
      })
        .then(() => {
              var ids = [] 
      for(let i=0;i<this.multipleSelection.length;i++){
       console.log(this.multipleSelection[i].dutyInfoId)
        ids.push(this.multipleSelection[i].dutyInfoId)
      }
      let params = {ids: ids.join(',')};
      
          this.$MainAjax.doPost(urlConfig.admin.delDuty,params).then(res => {
            //if (req.retCode != constants.returnCode.success) {
              console.log(res)
                this.$emit("resultChange", {
                  info: {
                    type: constants.optionResultType.success,
                    content: "用户删除成功"
                  },
                  flush: true
                });
                this.adminlistquery();
              
           // }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "已取消删除",
            type: "info"
          });
        });
    }
  },
   mounted: function() {
    this.adminlistquery();
  }
};
</script>
<style scoped>
.demo-ruleForm .el-row {
  display: flex;
  justify-content: center;
}
</style>