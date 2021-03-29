    <template>
    <!-- 重点客户关注 -->
        <div>
      <el-row class="custquery">
        <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
          <el-col :span="12">
            <el-form-item label="客户证件号">
              <el-input v-model="form.certId" clearable maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签约手机号">
              <el-input v-model="form.signPhone" maxlength="11" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-form>
        <el-col :span="24">
          <el-button type="primary" plain size="small" @click="exclCstQuery()">查询</el-button>
        </el-col>
      </el-row>
    <!-- 查询列表开始 -->
    <el-row>
      <el-col :span="24" class="text_right">
        <el-button type="primary" plain size="small" @click="addExclCst('form_add')">新增</el-button>
        <el-button type="primary" plain size="small" @click="changeExclCst('form_add')">修改</el-button>
        <el-button type="primary" plain size="small" @click="delExclCst()">删除</el-button>
        <el-button type="primary" plain size="small" @click="importData('form_add')">批量导入</el-button>
      </el-col>
    </el-row>
    <h2 class="querylist_style border">查询结果</h2>
    <queryResTable :pageSize="20" pagePosition="right" :url="postUrl" :params="params" :pageSizes="[20]" @dataChanged="dataChangedCallback" height="300" ref="tableBox" :reloadData.sync="reloadData">
      <template v-slot:paginationContainer>
        <el-table ref="multipleTable" :data="paramTableData" tooltip-effect="dark" stripe max-height="500" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column label="客户姓名" prop="custName"></el-table-column>
          <el-table-column label="性别" prop="sex"></el-table-column>
          <el-table-column label="证件号" prop="certId"></el-table-column>
          <el-table-column label="卡号" prop="cardNum"></el-table-column>
          <el-table-column label="签约手机号" prop="signPhone"></el-table-column>
          <el-table-column label="状态" prop="status"></el-table-column>
          <el-table-column label="描述" prop="postscript"></el-table-column>
          <el-table-column label="维护时间" prop="updateTime"></el-table-column>
        </el-table>
      </template>
    </queryResTable>
    <!-- 查询列表结束 -->
    <dialogpage :title="title" :showDialog.sync="dialogVisible" width="60%" :formData="form_add" :formBack="form_add1" @open="openDialog">
      <template v-slot:dialogName>
        <el-row>
          <el-form :model="form_add" :rules="rules" ref="form_add" label-width="120px" class="demo-ruleForm">
            <el-col :span="11">
              <el-form-item label="客户姓名" prop="custName">
                <el-input v-model="form_add.custName" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="性别" prop="sex">
                <el-select v-model="form_add.sex" style="width:100%" placeholder="请选择类型">
                  <el-option label="男性" value="1"></el-option>
                  <el-option label="女性" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="证件号" prop="certId">
                <el-input v-model="form_add.certId" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="卡号" prop="cardNum">
                <el-input v-model="form_add.cardNum" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="签约手机号" prop="signPhone">
                <el-input v-model="form_add.signPhone" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="描述" prop="postscript">
                <el-input v-model="form_add.postscript" maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="状态" prop="status">
                <el-select v-model="form_add.status" style="width:100%" placeholder="请选择类型">
                  <el-option label="有效" value="1"></el-option>
                  <el-option label="无效" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" v-show="addorchange==='add'">
              <el-checkbox v-model="checked">连续录入</el-checkbox>
            </el-col>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:center;">
            <el-button @click="dialogVisible = false" plain size="small" type="primary">取 消</el-button>
            <el-button v-show="addorchange==='add'" type="primary" plain size="small" @click="excladdSub('form_add')">保存</el-button>
            <el-button v-show="addorchange==='change'" type="primary" @click="exclchangeSub('form_add')" plain size="small">保存</el-button>
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
  name: "newExcluseCustom",
  components: { queryResTable, dialogpage },
  data() {
     var validatesignPhone = (rule, value, callback) => {
       var pattern = /^1\d{10}$/;
      if (value === "") {
        callback(new Error("请输入号段"));
      } else {
        if (pattern.test(value)) {
          callback();
        } else {
          callback(new Error("手机号段须为1开头的11位数字"));
        }
      }
    };
     var validatecardNum = (rule, value, callback) => {
       var pattern = /^\d+$/;
      if (value === "") {
        callback();
      } else {
        if (pattern.test(value)) {
          callback();
        } else {
          callback(new Error("最大输入20个数字"));
        }
      }
    };

    return {
      //列表model
      reloadData: 0,
      pageSize: 10,
      pagePosition: "",
      postUrl: urlConfig.admin.exclCstQuery,
      params: "",
      form: {
        certId: "",
        signPhone: ""
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
        custId: "",
        custName: "",
        sex: "",
        cardNum: "",
        signPhone: "",
        status: "1",
        postscript: "",
        certId: ""
      },
      form_add1: {
        //新增修改model
        custId: "",
        custName: "",
        sex: "",
        cardNum: "",
        signPhone: "",
        status: "1",
        postscript: "",
        certId: ""
      },
      form_add: {
        //新增修改model
        custId: "",
        custName: "",
        sex: "",
        cardNum: "",
        signPhone: "",
        status: "1",
        postscript: "",
        certId: ""
      },
      rules: {
        signPhone: [
          { validator: validatesignPhone, trigger: "blur" },
          { required: true, message: "请输入手机号", trigger: "blur" }
        ],
        cardNum: [
           { validator: validatecardNum, required: false}
        ]
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
        response ? response.customorList : [];
      console.log(response);
    },
    formstatus(row, column) {
      var states = row[column.property];
      return states == true ? "有效" : "无效";
    },
    formKind(row, column) {
      var states = row[column.property];
      return states == true ? "普通" : "特殊";
    },
    //查询列表
    exclCstQuery() {
      let params = {
        certId: this.form.certId,
        signPhone: this.form.signPhone
      };
      this.params = params;
      this.reloadData = 1;
    },
    //新增页面
    addExclCst() {
      this.addorchange = "add";
      this.title = "新增";
      this.dialogVisible = true;
    },
    //新增保存按钮
    excladdSub(formdata) {
      //console.log(this.listur);
      this.$refs[formdata].validate(val => {
        if (val) {
          let param = {
            custName: this.form_add.custName,
            sex: this.form_add.sex,
            cardNum: this.form_add.cardNum,
            signPhone: this.form_add.signPhone,
            status: this.form_add.status,
            postscript: this.form_add.postscript,
            certId: this.form_add.certId
          };
          console.log(param);
          this.$MainAjax.doPost(urlConfig.admin.exclCstAdd, param).then(res => {
            console.log(res);
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
              message: `新增成功${this.form_add.custName}`,
              type: "success"
            });
            this.exclCstQuery();
            this.form_add = {};
            if (this.checked === true) {
            } else {
              //关闭弹窗
              this.dialogVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    //新增修改弹框打开
    openDialog() {
      if (this.addorchange == "add") {
        this.form_add = {
          //新增修改model
          custName: "",
          sex: "",
          status: "1",
          cardNum: "",
          signPhone: "",
          postscript: "",
          certId: "",
          custId: ""
        };
      }
      // });
    },
    //修改弹框
    changeExclCst() {
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
      (this.form_add.custName = this.multipleSelection[0].custName),
        (this.form_add.sex = this.multipleSelection[0].sex); //参数名称
      this.form_add.cardNum = this.multipleSelection[0].cardNum; //参数等级
      this.form_add.status = this.multipleSelection[0].status; //状态
      this.form_add.signPhone = this.multipleSelection[0].signPhone;
      this.form_add.postscript = this.multipleSelection[0].postscript;
      this.form_add.certId = this.multipleSelection[0].certId; //参数备注
    },
    //修改保存按钮
    exclchangeSub(formdata) {
      this.$refs[formdata].validate(val => {
        if (val) {
          let param = {
            custId: this.multipleSelection[0].custId,
            custName: this.form_add.custName,
            sex: this.form_add.sex,
            certId: this.form_add.certId,
            cardNum: this.form_add.cardNum,
            status: this.form_add.status,
            signPhone: this.form_add.signPhone,
            postscript: this.form_add.postscript
          };

          this.$MainAjax
            .doPost(urlConfig.admin.exclCstUpdate, param)
            .then(res => {
              //console.log(res);

              //    this.$message({
              // showClose: true,
              // message: "修改成功！",
              // type: "sucess"
              // });
              // if (res.retCode == this.$constants.returnCode.success) {
              //   if (res.data.reminder == "0") {
              //     this.$message({
              //       showClose: true,
              //       message: "新增的角色在系统中已存在，不能重复添加",
              //       type: "warning"
              //     });
              //   } else {
              this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: "<i>修改成功</i>",
                type: "success"
              });
              //}
              //}
              this.dialogVisible = false;
              this.exclCstQuery();
            });
        } else {
          return false;
        }
      });
    },
    //删除数据
    delExclCst() {
      if (!this.multipleSelection.length) {
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
          var custId = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            console.log(this.multipleSelection[i].custId);
            custId.push(this.multipleSelection[i].custId);
          }
          let params = { custId: custId.join(",") };

          this.$MainAjax
            .doPost(urlConfig.admin.exclCstDel, params)
            .then(res => {
              if (res.retCode == constants.returnCode.success) {
                this.$emit("resultChange", {
                  info: {
                    type: constants.optionResultType.success,
                    content: "用户删除成功"
                  },
                  flush: true
                });
                this.exclCstQuery();
              }
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
    this.exclCstQuery();
  }
};
    </script>
    
    <style scoped>
    
    </style>