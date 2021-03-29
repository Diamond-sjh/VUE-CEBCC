<template>
  <div>
    <el-row>
      <!-- 查询条件开始 -->
        <el-row class="custquery">
          <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
            <el-col :span="8">
              <el-form-item label="流水号">
                <el-input
                  v-model="form.dicCode"
                  @blur="strLength(form.dicCode,100,'blur')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发起人">
                <el-input
                  v-model="form.dicValue"
                  @blur="strLength(form.dicValue,500,'blur')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="height:43px">
               <el-form-item label="发起时间">
                   <el-date-picker v-model="value1" type="daterange" range-separator="至" 
                   start-placeholder="开始日期" end-placeholder ="结束日期" style="width:100%"
              ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布状态">
                <el-select v-model="form.status" style="width:100%" placeholder="请选择状态" clearable>
                  <el-option label="发布中" value="1"></el-option>
                  <el-option label="已撤销" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="标题文字">
                 <el-input
                  v-model="form.dicCode"
                  @blur="strLength(form.dicCode,100,'blur')"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属机构">
                <el-input
                  style="width:95%;"
                  v-model="form.accorgId"
                  id="mechanismquery"
                  :data-value="form.accorgIdValue"
                  disabled="disabled"
                ></el-input>
                <i style="width:3%;" class="el-icon-edit-outline" @click="mechanismquery()"></i>
              </el-form-item>
            </el-col>
          </el-form>
          <el-col :span="24" class="but">
            <el-button type="primary" plain size="small" @click="techlistquery()">查询</el-button>
          </el-col>
        </el-row>
    <h4 style="text-align:left;">
        <span class="dataTableStyle" v-for="(item,index) in listur" :key="index" @click="clickurl(item.dutyName,index)">{{item.dicname}}\</span>
      </h4>
      <!-- 查询条件结束 -->
      <!-- 查询列表开始 -->
      <el-col class="custlist">
        <el-row>
          <el-col :span="24" class="text_right">
            <el-button type="primary" plain size="small" @click="changeStatus()">查看</el-button>
            <el-button type="primary" plain size="small" @click="addTechnicPara('form_add')">新建</el-button>
            <el-button type="primary" plain size="small" @click="changeTechnicPara('form_add')">修改</el-button>
            <el-button type="primary" plain size="small" @click="delAdminiPara()">删除</el-button>
          </el-col>
        </el-row>
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
             stripe max-height="500" border
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column label="参数编码" width="200">
                <template slot-scope="scope">
                  <a class="dataTableStyle">
                    <span @click="dicCodeClick(scope.row)">{{scope.row.dicCode}}</span>
                  </a>
                </template>
              </el-table-column>
              <el-table-column prop="dicValue" label="流水号" width="200"></el-table-column>
              <el-table-column prop="remark" label="发起人"></el-table-column>
              <el-table-column prop="status" label="参数状态" width="200"></el-table-column>
              <el-table-column prop="status" label="重载状态" width="200"></el-table-column>
            </el-table>
          </template>
        </queryResTable>
      </el-col>
      <!-- 查询列表结束 -->
    </el-row>
     <!-- 新增修改弹框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" @open="openDialog">
      <el-row>
        <el-form
          :model="form_add"
          :rules="rules"
          ref="form_add"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-row>
            <el-col :span="11">
              <el-form-item label="标题" prop="name">
                <el-input v-model="form_add.name" maxlength="100"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="参数值" prop="dicValue">
                <el-input v-model="form_add.dicValue" maxlength="500"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="参数说明" prop="remark">
                <el-input v-model="form_add.remark" maxlength="500"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="参数状态" prop="status">
                <el-select v-model="form_add.status" style="width:100%">
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="序号" prop="orderNo">
                <el-input v-model="form_add.orderNo" type="number" @blur="BlurText($event)" min="1"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="11" v-show="addorchange==='add'">
            <el-checkbox v-model="checked">连续录入</el-checkbox>
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align:center;">
          <el-button @click="dialogVisible = false" type="primary" size="small" plain>取 消</el-button>
          <el-button v-show="addorchange==='add'" type="primary" plain size="small" @click="adminaddSub('form_add')">保存</el-button>
          <el-button
            v-show="addorchange==='change'"
            type="success" size="medium" plain
            @click="adminchangeSub('form_add')"
          >保存</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import queryResTable from "@/core/components/PaginationContainer";
export default {
  name: "marquee",
  components: { queryResTable },
  data() {
    return {
      //列表model
      reloadData: 0,
      pageSize: 10,
      pagePosition: "",
      postUrl: urlConfig.admin.paramQuery,
      params: "",
      value1:"",
      form: {
        name: "",
        dicValue: "",
        status: "",
        dicKind: "1",
        turnPageBeginPos: "1",
        turnPageShowNum: "10"
      },
      paramTableData: [], //查询到的技能列表数据
      multipleSelection: [], //列表选中的数据
      listur: [{ dicCode: "", dicname: "根目录" }],
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
        name: "",
        dicCode: "",
        dicValue: "",
        status: "1",
        remark: "",
        orderNo: "",
        dicKind: "1"
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" },
         { min: 1, max: 20, message: "最多输入20个字符", trigger: "blur" }]
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
        response ? response.paramList : [];
      console.log(response);
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
      console.log(row.dicInfoId);
      if (this.listur.length >= 4) {
        return;
      }
      this.busilistquery(row.dicInfoId);
      this.listur.push({ dicname: row.dicCode, dicCode: row.dicInfoId });
      console.log(this.listur);
    },
    //点击根目录
    clickurl(val, index) {
      this.busilistquery(val);
      this.listur.splice(index + 1, this.listur.length - index + 1);
    },
    //新增页面
    addTechnicPara() {
      this.addorchange = "add";
      this.title = "新增";
      this.dialogVisible = true;
      //  this.form_add.dicCode = ''
    },
    //新增保存按钮
    adminaddSub(formdata) {
      console.log(this.listur);
      this.$refs[formdata].validate(val => {
        if (val) {
          let dicParantId = "";
          let idx = this.listur.length - 1;
          if (idx >= 0) {
            dicParantId = this.listur[idx].dicCode;
          }
          let param = {
            codePath: this.form_add.codePath + `${this.form_add.dicCode}`,
            dicCode: this.form_add.dicCode,
            dicValue: this.form_add.dicValue,
            remark: this.form_add.remark,
            orderNo: this.form_add.orderNo,
            status: this.form_add.status ? this.form_add.status : "1",
            dicKind: "2",
            dicParantId: dicParantId
          };
          console.log(param);
          // return ;
          this.$MainAjax.doPost(urlConfig.admin.paramAdd, param).then(res => {
            console.log(res.data.dicCode);
            if (res.retCode == this.$constants.returnCode.success) {
              if (res.data.reminder == "0") {
                this.$message({
                  showClose: true,
                  message: "新增的在系统中已存在，不能重复添加",
                  type: "warning"
                });
              } else {
                this.$message({
                  showClose: true,
                  message: `新增成功${this.form_add.dicCode}`,
                  type: "success"
                });
                this.busilistquery(this.listur[this.listur.length - 1].dicCode);
                this.form_add = {};
                if (this.checked === true) {
                } else {
                  //关闭弹窗
                  this.dialogVisible = false;
                }
              }
            }
          });
        } else {
          return false;
        }
      });
    },
    //新增修改弹框打开
    openDialog() {
      console.log(this.addorchange == "add");
      if (this.addorchange == "add") {
        // this.$nextTick(() => {
        // this.$refs.form_add.resetFields();
        let pathName = "";
        for (let idx = 0; idx < this.listur.length; idx++) {
          pathName += this.listur[idx].dicname + "/";
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
        };
        // });
      }
    },
    //修改弹框
    changeTechnicPara() {
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
      (this.form_add.codePath = this.multipleSelection[0].dicCode),
        (this.form_add.dicCode = this.multipleSelection[0].dicCode); //参数编码
      this.form_add.dicValue = this.multipleSelection[0].dicValue; //参数值
      this.form_add.status = this.multipleSelection[0].status; //状态
      this.form_add.remark = this.multipleSelection[0].remark; //参数说明
      //console.log(this.form_add.dicCode);
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
            dicKind: "2"
          };

          this.$MainAjax
            .doPost(urlConfig.admin.paramUpdate, param)
            .then(res => {
              console.log(res);

              //    this.$message({
              // showClose: true,
              // message: "修改成功！",
              // type: "sucess"
              // });
              if (res.retCode == this.$constants.returnCode.success) {
                if (res.data.reminder == "0") {
                  this.$message({
                    showClose: true,
                    message: "新增的角色在系统中已存在，不能重复添加",
                    type: "warning"
                  });
                } else {
                  this.$message({
                    showClose: true,
                    dangerouslyUseHTMLString: true,
                    message: "<i></i>",
                    type: "success"
                  });
                }
              }
              this.busilistquery();
            });
        } else {
          return false;
        }
      });
    },
    //删除数据
    delAdminiPara() {
      console.log("删除");
    },
    //获取用户列表接口返回的数据
    dataChangedCallback(response) {
      this.paramTableData =
        response ? response.paramList : [];
      console.log(response);
    }
  }
};
</script>
<style scoped>
.custlist {
  background: white;
  padding: 0px 10px 30px 10px;
  margin-bottom: 15px;
}
.but {
  margin: 10px 0px -10px 0px;
  text-align: center;
}
.custquery {
  margin: 20px 60px 0px 40px;
}
.custquery .el-form-item {
  margin-bottom: 10px;
}
.query_results {
  height: 50px;
  border-bottom: 4px solid rgb(224, 230, 224);
  margin: 15px 0px 15px 0px;
}
.query_results p {
  line-height: 50px;
  font-size: 18px;
  text-align: left;
  padding-left: 15px;
  border-bottom: 4px solid rgb(120, 190, 85);
  height: 50px;
  font-weight: 500;
  color: rgb(95, 97, 92);
}
.query_results .query_results_but {
  text-align: right;
}
.page {
  margin: 10px 10px 0px 0px;
  text-align: right;
}
.demo-ruleForm .el-row {
  display: flex;
  justify-content: center;
}
.dataTableStyle {
  color: #67c23a;
}
.dataTableStyle:hover {
  text-decoration: underline;
  color: rgb(44, 95, 19);
}
.path {
  text-align: left;
  font-size: 18px;
  font-weight: 500;
}
</style>