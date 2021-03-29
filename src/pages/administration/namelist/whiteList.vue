<template>
  <div>
      <!-- 查询条件开始 -->
        <el-row class="custquery">
          <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
            <el-col :span="8">
              <el-form-item label="客户证件号">
                <el-input v-model="form.dicCode" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="签约手机号">
                <el-input v-model="form.dicValue" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电话号码">
                <el-input v-model="form.dicValue" clearable></el-input>
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
          <el-col :span="24">
            <el-button size="small" type="primary" plain @click="adminlistquery()">查询</el-button>
          </el-col>
        </el-row>
    
      <!-- 查询条件结束 -->
      <!-- 查询列表开始 -->
        <el-row>
          <el-col :span="24" class="text_right">
            <el-button size="small" type="primary" plain @click="addAdminPara('form_add')">新增</el-button>
            <el-button size="small" type="primary" plain @click="changeAdminPara('form_add')">修改</el-button>
            <el-button size="small" type="primary" plain @click="delAdminiPara()">删除</el-button>
            <el-button size="small" type="primary" plain @click="importData('form_add')">导入</el-button>
            <el-button size="small" type="primary" plain @click="changeAdminPara('form_add')">查看</el-button>
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
              stripe max-height="500" border
              @selection-change="handleSelectionChange"
            >
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
    <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" @open="openDialog">
      <el-row>
        <el-form
          :model="form_add"
          :rules="rules"
          ref="form_add"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-col :span="11">
            <el-form-item label="账号" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="账号类型" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户职务" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="行业" prop="dutyKind">
              <el-select v-model="form_add.dutyKind" style="width:100%" placeholder="请选择类型">
                <el-option label="农、林、牧、渔业" value="1"></el-option>
                <el-option label="采矿业" value="2"></el-option>
                <el-option label="制造业" value="2"></el-option>
                <el-option label="电力、热力、燃气及水生产及供应业" value="2"></el-option>
                <el-option label="建筑业" value="2"></el-option>
                <el-option label="批发和零售业" value="2"></el-option>
                <el-option label="交通运输、仓储和邮政业" value="2"></el-option>
                <el-option label="住宿和餐饮业" value="2"></el-option>
                <el-option label="信息传输、软件和信息技术服务业" value="2"></el-option>
                <el-option label="金融业" value="2"></el-option>
                <el-option label="房地产业" value="2"></el-option>
                <el-option label="租赁和商务服务业" value="2"></el-option>
                <el-option label="水利、环境和公共设施管理业" value="2"></el-option>
                <el-option label="居民服务、修理和其他服务业" value="2"></el-option>
                <el-option label="教育" value="2"></el-option>
                <el-option label="卫生和社会工作" value="2"></el-option>
                <el-option label="文化、体育和娱乐业" value="2"></el-option>
                <el-option label="公共管理、社会保障和社会组织" value="2"></el-option>
                <el-option label="国际组织" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="称谓" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="级别" prop="dutyLevel" placeholder="请选择级别">
              <el-select v-model="form_add.dutyLevel" style="width:100%">
                <el-option label="一级" value="1"></el-option>
                <el-option label="二级" value="2"></el-option>
                <el-option label="三级" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户号" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户偏好" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="证件类型" prop="dutyKind">
              <el-select v-model="form_add.dutyKind" style="width:100%" placeholder="请选择类型">
                <el-option label="身份证" value="1"></el-option>
                <el-option label="护照" value="2"></el-option>
                <el-option label="军人证" value="2"></el-option>
                <el-option label="武警证" value="2"></el-option>
                <el-option label="港澳台通行证" value="2"></el-option>
                <el-option label="户口簿" value="2"></el-option>
                <el-option label="台湾居民来往大陆通行证" value="2"></el-option>
                <el-option label="外国人永久居留证" value="2"></el-option>
                <el-option label="港澳居民居住证" value="2"></el-option>
                <el-option label="台湾居民居住证" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户证件号" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户姓名" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="生日" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户类型" prop="dutyLevel" placeholder="请选择级别">
              <el-select v-model="form_add.dutyLevel" style="width:100%">
                <el-option label="高端客户" value="1"></el-option>
                <el-option label="行内员工" value="2"></el-option>
                <el-option label="营销奖励客户" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="业务类型" prop="dutyLevel" placeholder="请选择级别">
              <el-select v-model="form_add.dutyLevel" style="width:100%">
                <el-option label="信用卡业务" value="1"></el-option>
                <el-option label="综合业务" value="2"></el-option>
                <el-option label="存贷合一卡" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="信用卡客户等级" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户特点" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="专职指定座席" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户贡献度" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="利润贡献度" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="宅电号码" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="宅电号码" prop="dutyName">
              <el-input v-model="form_add.dutyName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="签约手机号" prop="dutyRemark">
              <el-input v-model="form_add.dutyRemark" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注" prop="dutyRemark">
              <el-input v-model="form_add.dutyRemark" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="状态" prop="dutyLevel" placeholder="请选择级别">
              <el-select v-model="form_add.dutyLevel" style="width:100%">
                <el-option label="有效" value="1"></el-option>
                <el-option label="无效" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align:center;">
          <el-button @click="dialogVisible = false" size="small" type="primary" plain>取 消</el-button>
          <el-button v-show="addorchange==='add'" size="small" type="primary" plain @click="adminaddSub('form_add')">保存</el-button>
          <el-button  v-show="addorchange==='change'" size="small" type="primary" plain @click="adminchangeSub('form_add')">保存</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="60%">
      <el-row>
        <el-upload
          class="upload-demo"
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-upload="handleBeforeUpload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align:center;">
          <el-button @click="dialogVisible = false">返回</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import queryResTable from "@/core/components/PaginationContainer";
import { mapActions } from "vuex";
export default {
  name: "whiteList",
  components: { queryResTable },
  data() {
    return {
      //列表model
      reloadData: 0,
      pageSize: 10,
      pagePosition: "",
      postUrl: urlConfig.admin.dutyQuery,
      params: "",
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ],
      form: {
        dutyLevel: "",
        dutyName: "",
        dutyCode: "",
        dutyKind: "",
        status: "",
        remark: "",
        turnPageBeginPos: "1",
        //fileList:[{name:'food.jpeg',url:''}],
        turnPageShowNum: "10"
      },
      paramTableData: [], //查询到的技能列表数据
      multipleSelection: [], //列表选中的数据
      // listur: [{ dicCode: "", dicname: "根目录" }],
      //新增修改弹框
      addorchange: "", //新增或修改标示
      title: "", //弹框title
      params: {},
      tableData: [], //列表数据
      //新增修改弹框
      checked: false,
      dialogVisible: false, //是否显示弹框
      dialogFormVisible: false,
      form_add: {
        //新增修改model
        dutyName: "",
        dutyLevel: "",
        dutyKind: "",
        dutyCode: "",
        status: "1",
        dutyRemark: ""
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file,fileList);
    },
    handleBeforeUpload(file) {
      console.log("------")
                           

    },
    // handleExceed(files, fileList) {
    //   this.$message.warning(
    //     `当前限制选择 3 个文件，本次选择了 ${
    //       files.length
    //     } 个文件，共选择了 ${files.length + fileList.length} 个文件`
    //   );
    // },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
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
    //查询列表
    adminlistquery(dicCode) {
      let params = {
        dutyParantId: dicCode,
        dutyName: this.form.dutyName,
        dutyLevel: this.form.dutyLevel,
        dutyCode: this.form.dutyCode,
        dutyKind: this.form.dutyCode,
        status: this.form.status
      };
      // console.log('-------'+dicCode);
      this.params = params;
      this.reloadData = 1;
      // }
    },
    importData() {
      console.log("导入");
      this.dialogFormVisible = true;
    },
    //查询子列表
    // dutyNameClick(row) {
    //   console.log(row.dutyInfoId);
    //   if (this.listur.length >= 4) {
    //     return;
    //   }
    //   this.adminlistquery(row.dutyInfoId);
    //   this.listur.push({ dicname: row.dutyName, dicCode: row.dutyInfoId });
    //   console.log(this.listur);
    // },
    //点击根目录
    // clickurl(val, index) {
    //   this.adminlistquery(val);
    //   this.listur.splice(index + 1, this.listur.length - index + 1);
    // },
    //新增页面
    addAdminPara() {
      this.addorchange = "add";
      this.title = "新增";
      this.dialogVisible = true;
      //  this.form_add.dicCode = ''
    },
    //新增保存按钮
    adminaddSub(formdata) {
      console.log(this.listur);
      this.$refs[formdata].validate(val => {
        // if (val) {
        //   let dutyParantId = "";
        //   let idx = this.listur.length - 1;
        // if (idx >= 0) {
        //   dutyParantId = this.listur[idx].dicCode;
        // }
        let param = {
          dutyName: this.form_add.dutyName,
          dutyLevel: this.form_add.dutyLevel,
          dutyRemark: this.form_add.dutyRemark,
          dutyKind: this.form_add.dutyKind,
          dutyParantId: dutyParantId
        };
        console.log(param);
        // return ;
        this.$MainAjax.doPost(urlConfig.admin.addDuty, param).then(res => {
          console.log(res.data.dutyName);
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
                message: `新增成功${this.form_add.dutyName}`,
                type: "success"
              });
              this.adminlistquery();
              this.dialogVisible = false;
            }
          }
        });
        //} else {
        // return false;
        // }
      });
    },
    //新增修改弹框打开
    openDialog() {
      console.log(this.addorchange == "add");
      if (this.addorchange == "add") {
        // this.$nextTick(() => {
        // this.$refs.form_add.resetFields();
        // let pathName = "";
        // for (let idx = 0; idx < this.listur.length; idx++) {
        //   pathName += this.listur[idx].dicname + "/";
        // }
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
      (this.form_add.dutyKind = this.multipleSelection[0].dutyKind),
        (this.form_add.dutyName = this.multipleSelection[0].dutyName); //参数编码
      this.form_add.dutyLevel = this.multipleSelection[0].dutyLevel; //参数值
      this.form_add.status = this.multipleSelection[0].status; //状态
      this.form_add.dutyRemark = this.multipleSelection[0].dutyRemark; //参数说明
      //console.log(this.form_add.dicCode);
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

          this.$MainAjax.doPost(urlConfig.admin.updateDuty, param).then(res => {
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
            this.adminlistquery();
          });
        } else {
          return false;
        }
      });
    },
    //删除数据
    delAdminiPara() {
      console.log("删除");
      if (this.multipleSelection.length != 1) {
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
          let param = {
            dutyInfoId: this.multipleSelection[0].dutyInfoId
          };
          MainAjax.doPost(urlConfig.admin.delDuty, param).then(req => {
            if (req.retCode != constants.returnCode.success) {
              this.$emit("resultChange", {
                info: {
                  type: constants.optionResultType.success,
                  content: "用户删除成功"
                },
                flush: true
              });
              this.adminlistquery();
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
  }
};
</script>
<style scoped>
</style>
