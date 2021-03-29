<!-- 北京号段维护 -->
<template>
  <div>
    <!-- 查询条件开始 -->
    <el-row>
      <el-col>
        <el-row class="custquery">
          <el-form :model="form"  label-width="100px" class="demo-ruleForm" size="small">
            <el-col :span="8">
              <el-form-item label="北京号段">
                <el-input v-model="form.phone" clearable maxlength="7"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
          <el-col :span="24">
            <el-button type="primary" plain size="small"  @click="phoneListQuery()">查询</el-button>
          </el-col>
        </el-row>
      </el-col>
      </el-row>
      <!-- 查询条件结束 -->
      <!-- 查询列表开始 -->
      <el-row>
        <el-col :span="24" class="text_right">
          <el-button type="primary" plain size="small" @click="phoneNumAdd('form_add')">新增</el-button>
          <el-button type="primary" plain size="small" @click="phoneNumChange('form_add')">修改</el-button>
          <el-button type="primary" plain size="small" @click="delPhoneNum()">删除</el-button>
        </el-col>
      </el-row>
      <h2 class="querylist_style border">查询结果</h2>
      <queryResTable :pageSize="20" pagePosition="right" :url="postUrl" :params="params" :pageSizes="[20]"
        @dataChanged="dataChangedCallback" ref="tableBox" :reloadData.sync="reloadData">
        <template v-slot:paginationContainer>
          <el-table ref="multipleTable" :data="paramTableData" tooltip-effect="dark" stripe  max-height="500" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column label="手机号段" prop="phone"></el-table-column>
            <el-table-column label="维护时间" prop="updateTime"></el-table-column>
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
              <el-form-item label="北京号段" prop="phone">
                <el-input v-model="form_add.phone" maxlength="100"></el-input>
                 <el-col :span="11" v-show="addorchange==='add'">
            <el-checkbox v-model="checked">连续录入</el-checkbox>
          </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align:center;">
          <el-button @click="dialogVisible = false" size="small" type="primary" plain>关 闭</el-button>
          <el-button v-show="addorchange==='add'" type="primary"  plain size="small" @click="phoneNumSub('form_add')">确定</el-button>
          <el-button
            v-show="addorchange==='change'" type="primary" @click="phoneChangeSub('form_add')">保存</el-button>
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
    name: "bjThemRouly",
  components: { queryResTable ,dialogpage},
   data() {
      var validatephone = (rule, value, callback) => {
       var pattern = /^1\d{6}$/;
      if (value === "") {
        callback(new Error("请输入号段"));
      } else {
        if (pattern.test(value)) {
          callback();
        } else {
          callback(new Error("手机号段须为1开头的7位数字"));
        }
      }
    };
    return {
      //列表model
      reloadData: 0,
      pageSize: 10,
      pagePosition: "",
      postUrl: urlConfig.admin.phoneNumQuery,
      params: "",
      form: {
        phone: "",
        turnPageBeginPos: "1",
        turnPageShowNum: "20"
      },
      paramTableData: [], //查询到的技能列表数据
      multipleSelection: [], //列表选中的数据
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
        phone: "",
      },
       form_add1: {
        //新增修改model
        phone: "",
      },
      rules: {
         phone: [
          { validator: validatephone, trigger: "blur" }
        ],
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
        response ? response.data.phoneList : [];
      console.log(response);
    },
    //查询列表
    phoneListQuery() {
      let params = {
        phone: this.form.phone,
      };
      this.params = params;
      this.reloadData = 1;
      // }
    },
    //新增页面
    phoneNumAdd() {
      this.addorchange = "add";
      this.title = "新增";
      this.dialogVisible = true;
    },
    //新增保存按钮
    phoneNumSub(formdata) {
          let param = {
            phone: this.form_add.phone
          };
          console.log(param);
          this.$MainAjax.doPost(urlConfig.admin.phoneNumAdd, param).then(res => {
            console.log(res)
              // if (res.data.reminder == "0") {
              //   this.$message({
              //     showClose: true,
              //     message: "新增的在系统中已存在，不能重复添加",
              //     type: "warning"
              //   });
              // } 
             // else {
                this.$message({
                  showClose: true,
                  message: `新增成功${this.form_add.phone}`,
                  type: "success"
                });
                   this.phoneListQuery();
                    this.form_add = {};
                if (this.checked === true) {
                } else {
                  //关闭弹窗
                  this.dialogVisible = false; 
                }
                   
             // }
            
          });
    },
    //新增修改弹框打开
    openDialog() {
      //console.log(this.addorchange == "add");
      if (this.addorchange == "add") {
        this.form_add = {
          //新增修改model
          phone: "",
        };
        // });
      }
    },
    //修改弹框
    phoneNumChange() {
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
      this.form_add.phone = this.multipleSelection[0].phone
    },
    //修改保存按钮
    phoneChangeSub(formdata) {
      this.$refs[formdata].validate(val => {
        if (val) {
          let param = {
            phoneId: this.multipleSelection[0].phoneId,
            phone: this.form_add.phone,
          };

          this.$MainAjax.doPost(urlConfig.admin.phoneNumUpdate, param).then(res => {
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
                    message: `修改成功${this.form_add.phone}`,
                    type: "success"
                  });
                }
              }
               this.dialogVisible = false; 
              this.phoneListQuery();
            });
        } else {
          return false;
        }
      });
    },
    //删除数据
    delPhoneNum() {
      //console.log("删除");
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
       console.log(this.multipleSelection[i].phone)
       // ids += this.multipleSelection[i].dutyInfoId + ','
        ids.push(this.multipleSelection[i].phone)
      }
      let params = {phone: ids.join(',')};
      
          this.$MainAjax.doPost(urlConfig.admin.phoneNumDel,params).then(res => {
            //if (req.retCode != constants.returnCode.success) {
              console.log(res)
                this.$emit("resultChange", {
                  info: {
                    type: constants.optionResultType.success,
                    content: "用户删除成功"
                  },
                  flush: true
                });
                this.phoneListQuery();
              
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
    this.phoneListQuery();
  }
};
</script>
<style scope>
</style>