<template>
<!-- 借记卡vip -->
 <div>
      <el-row class="custquery">
        <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
          <el-col :span="11">
            <el-form-item label="客户证件号">
              <el-input v-model="form.certId" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="签约手机号">
              <el-input v-model="form.signMobio" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="状态">
              <el-select v-model="form.status" style="width:100%" placeholder="请选择类型">
                <el-option label="有效" value="1"></el-option>
                <el-option label="无效" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="数据类型">
              <el-select v-model="form.dataType" style="width:100%" placeholder="请选择类型">
                <el-option label="手工维护" value="1"></el-option>
                <el-option label="自动导入" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
        <el-col :span="24">
          <el-button type="primary" plain size="small" @click="adminlistquery()">查询</el-button>
        </el-col>
      </el-row>
    <!-- 查询列表开始 -->
    <el-row>
      <el-col :span="24" class="text_right">
        <el-button type="primary" plain size="small" @click="addAdminPara('form_add')">新增</el-button>
        <el-button type="primary" plain size="small" @click="changeAdminPara('form_add')">修改</el-button>
        <el-button type="primary" plain size="small" @click="delAdminiPara()">删除</el-button>
        <el-button type="primary" plain size="small" @click="importData('form_add')">批量导入</el-button>
      </el-col>
    </el-row>
    <h2 class="querylist_style border">查询结果</h2>
    <queryResTable :pageSize="20" pagePosition="right" :url="postUrl" :params="params" :pageSizes="[20]" @dataChanged="dataChangedCallback" height="300" ref="tableBox" :reloadData.sync="reloadData">
      <template v-slot:paginationContainer>
        <el-table ref="multipleTable" :data="paramTableData" tooltip-effect="dark" stripe max-height="500" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column label="账号" prop="cardNo"></el-table-column>
          <el-table-column label="账号类型" prop="accountsType"></el-table-column>
          <el-table-column label="客户证件号" prop="certId"></el-table-column>
          <el-table-column label="客户姓名" prop="custName"></el-table-column>
          <el-table-column label="客户类型" prop="custType"></el-table-column>
          <el-table-column label="客户贡献度" prop="custType"></el-table-column>
          <el-table-column label="客户层额度" prop="crdtAmt"></el-table-column>
          <el-table-column label="状态" prop="status"></el-table-column>
          <el-table-column label="更新时间" prop="updateDate"></el-table-column>
          <el-table-column label="维护人" prop="vindicator"></el-table-column>
        </el-table>
      </template>
    </queryResTable>
    <!-- 查询列表结束 -->
    <dialogpage :title="title" :showDialog.sync="dialogVisible" :formData="form_add" :formBack="form_add1" @open="openDialog">
    <template v-slot:dialogName>
      <el-row>
        <el-form :model="form_add" :rules="rules" ref="form_add" label-width="120px" class="demo-ruleForm">
          <el-col :span="11">
            <el-form-item label="账号" prop="cardNo">
              <el-input v-model="form_add.cardNo" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="账号类型" prop="accountsType">
              <el-input v-model="form_add.accountsType" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="11">
            <el-form-item label="客户号" prop="custNo">
              <el-input v-model="form_add.custNo" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
            <el-col :span="11">
            <el-form-item label="客户偏好" prop="custLike">
              <el-input v-model="form_add.custLike" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="证件类型" prop="certType">
              <el-select v-model="form_add.certType" style="width:100%" placeholder="请选择类型">
                <el-option label="身份证" value="1"></el-option>
                <el-option label="护照" value="2"></el-option>
                <el-option label="军人证" value="3"></el-option>
                <el-option label="武警证" value="4"></el-option>
                <el-option label="港澳台通行证" value="5"></el-option>
                <el-option label="户口簿" value="6"></el-option>
                <el-option label="台湾居民来往大陆通行证" value="9"></el-option>
                <el-option label="外国人永久居留证" value="a"></el-option>
                <el-option label="港澳居民居住证" value="b"></el-option>
                <el-option label="台湾居民居住证" value="c"></el-option>
                <el-option label="其他" value="8"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户证件号" prop="certId">
              <el-input v-model="form_add.certId" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
            <el-col :span="11">
            <el-form-item label="客户姓名" prop="custName">
              <el-input v-model="form_add.custName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="生日" prop="birteday">
              <el-date-picker
                v-model="form_add.birteday"
                type="date"
                style="width:100%"
                value-format="yyyy/MM/dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
           <el-col :span="11">
            <el-form-item label="客户类型" prop="custType">
              <el-select v-model="form_add.custType" style="width:100%" placeholder="请选择类型">
                <el-option label="高端客户" value="vip"></el-option>
                <el-option label="行内员工" value="employee"></el-option>
                <el-option label="营销奖励客户" value="marking"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="11">
            <el-form-item label="业务类型" prop="businessType">
              <el-select v-model="form_add.businessType" style="width:100%" placeholder="请选择类型">
                <el-option label="信用卡业务" value="1"></el-option>
                <el-option label="综合业务" value="0"></el-option>
                <el-option label="存贷合一卡" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="信用卡客户等级" prop="creditLeveo">
              <el-input v-model="form_add.creditLeveo" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="11">
            <el-form-item label="借记卡客户等级" prop="debitLeveo">
              <el-input v-model="form_add.debitLeveo" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户特点" prop="contentment">
              <el-input v-model="form_add.contentment" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="11">
            <el-form-item label="专职指定座席" prop="specifyAgent">
              <el-input v-model="form_add.specifyAgent" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="11">
            <el-form-item label="客户贡献度" prop="custOfferdegree">
              <el-input v-model="form_add.custOfferdegree" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户层额度" prop="crdtAmt">
              <el-input v-model="form_add.crdtAmt" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="11">
            <el-form-item label="利润贡献度" prop="gainOfferdegree">
              <el-input v-model="form_add.gainOfferdegree" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="11">
            <el-form-item label="签约手机号" prop="signMobio">
              <el-input v-model="form_add.signMobio" maxlength="100"></el-input>
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
          <el-col :span="11">
            <el-form-item label="备注1" prop="remark1">
              <el-input v-model="form_add.remark1" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注2" prop="remark2">
              <el-input v-model="form_add.remark2" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注3" prop="remark3">
              <el-input v-model="form_add.remark3" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注4" prop="remark4">
              <el-input v-model="form_add.remark4" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注5" prop="remark5">
              <el-input v-model="form_add.remark5" maxlength="100"></el-input>
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
import dialogpage from "@/pages/components/dialog";
import { mapActions } from "vuex";
export default {
  name: "regulatoryBlackList",
  components: { queryResTable, dialogpage },
  data() {
     var validatecustNo = (rule, value, callback) => {
       var pattern = /^\d+$/;
      if (value === "") {
        callback(new Error("请输入数字"));
      } else {
        if (pattern.test(value)) {
          callback();
        } else {
          callback(new Error("最大只可以输入20位数字"));
        }
      }
    };
    return {
      //列表model
      reloadData: 0,
      pageSize: 10,
      pagePosition: "",
      postUrl: urlConfig.admin.queryCreditVipList,
      params: "",
      form: {
        certId: "",
        status: "",
        dataType: "1",
        signMobio: ""
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
        custNo: "",
        custLike: "",
        custName: "",
        birteday: "",
        certId: "",
        certType: "",
        custType: "",
        businessType: "",
        creditLeveo: "",
        debitLeveo: "",
        contentment: "",
        specifyAgent: "",
        custOfferdegree: "",
        gainOfferdegree: "",
        signMobio: "",
        cardNo: "",
        accountsType: "",
        vindicator: "",
        crdtAmt:'',
        remark1: "",
        status: "",
        remark2: "",
        remark3: "",
        remark4: "",
        remark5: "",
      },
      form_add1: {
        //新增修改model
         custNo: "",
        custLike: "",
        custName: "",
        birteday: "",
        certId: "",
        certType: "",
        custType: "",
        businessType: "",
        creditLeveo: "",
        debitLeveo: "",
        contentment: "",
        specifyAgent: "",
        custOfferdegree: "",
        gainOfferdegree: "",
        signMobio: "",
        cardNo: "",
        accountsType: "",
        vindicator: "111",
        crdtAmt:'',
        remark1: "",
        status: "",
        remark2: "",
        remark3: "",
        remark4: "",
        remark5: "",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },

      rules: {
       custNo: [
          { validator: validatecustNo, trigger: "blur" }
        ],
         dicValue: [
          { required: true, message: "请输入参数值", trigger: "blur" },
          { min: 1, max: 500, message: "最多输入500个字符", trigger: "blur" }
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
        response ? response.creditVipList : [];
        console.log(response)
      //console.log(response);
    },
    formstatus(row, column) {
      var states = row[column.property];
      return states == true ? "有效" : "无效";
    },
    //查询列表
    adminlistquery() {
      let params = {
        dataType: this.form.dataType,
      };
      this.params = params;
      this.reloadData = 1;
    },
    //新增页面
    addAdminPara() {
      this.addorchange = "add";
      this.title = "借记卡VIP名单维护";
      this.dialogVisible = true;
    },
    //新增保存按钮
    adminaddSub(formdata) {
      this.$refs[formdata].validate(val => {
        if (val) {
          let param = {
            custNo: this.form_add.custNo,
            custLike: this.form_add.custLike,
            custName: this.form_add.custName,
            birteday: this.form_add.birteday,
            certId: this.form_add.certId,
            certType: this.form_add.certType,
            custType: this.form_add.custType,
            businessType: this.form_add.businessType,
            creditLeveo: this.form_add.creditLeveo,
            debitLeveo: this.form_add.debitLeveo,
            contentment: this.form_add.contentment,
            specifyAgent: this.form_add.specifyAgent,
            custOfferdegree: this.form_add.custOfferdegree,
            gainOfferdegree: this.form_add.gainOfferdegree,
            signMobio: this.form_add.signMobio,
            cardNo: this.form_add.cardNo,
            accountsType: this.form_add.accountsType,
            vindicator: this.form_add.vindicator,
            remark1: this.form_add.remark1,
            remark2: this.form_add.remark2,
            remark3: this.form_add.remark3,
            remark4: this.form_add.remark4,
            remark5: this.form_add.remark5,
            status: this.form_add.status,
            crdtAmt:this.form_add.crdtAmt
          };
          this.$MainAjax
            .doPost(urlConfig.admin.saveCreditVipList, param)
            .then(res => {
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
                message: `新增成功${this.form_add.custNo}`,
                type: "success"
              });
              this.adminlistquery();
              //this.form_add = {};
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
        custNo: "",
        custLike: "",
        custName: "",
        birteday: "",
        certId: "",
        certType: "",
        custType: "",
        businessType: "",
        creditLeveo: "",
        debitLeveo: "",
        contentment: "",
        specifyAgent: "",
        custOfferdegree: "",
        gainOfferdegree: "",
        signMobio: "",
        cardNo: "",
        accountsType: "",
        vindicator: "111",
        remark1: "",
        status: "",
        remark2: "",
        remark3: "",
        remark4: "",
        remark5: "",
        crdtAmt: ""
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
      this.form_add.creditVipId = this.multipleSelection[0].creditVipId
      this.form_add.custNo = this.multipleSelection[0].custNo;
      this.form_add.custLike = this.multipleSelection[0].custLike;
      this.form_add.custName = this.multipleSelection[0].custName; //参数名称
      this.form_add.birteday = this.multipleSelection[0].birteday; //参数等级
      this.form_add.certId = this.multipleSelection[0].certId; //状态
      this.form_add.certType = this.multipleSelection[0].certType;
      this.form_add.custType = this.multipleSelection[0].custType;
      this.form_add.businessType = this.multipleSelection[0].businessType;
      this.form_add.creditLeveo = this.multipleSelection[0].creditLeveo;
      this.form_add.debitLeveo = this.multipleSelection[0].debitLeveo;
      this.form_add.contentment = this.multipleSelection[0].contentment;
      this.form_add.specifyAgent = this.multipleSelection[0].specifyAgent;
      this.form_add.custOfferdegree = this.multipleSelection[0].custOfferdegree;
      this.form_add.gainOfferdegree = this.multipleSelection[0].gainOfferdegree;
      this.form_add.signMobio = this.multipleSelection[0].signMobio;
      this.form_add.cardNo = this.multipleSelection[0].cardNo;
      this.form_add.accountsType = this.multipleSelection[0].accountsType;
      this.form_add.vindicator = this.multipleSelection[0].vindicator;
      this.form_add.status = this.multipleSelection[0].status;
      this.form_add.remark1= this.multipleSelection[0].remark1
      this.form_add.remark2= this.multipleSelection[0].remark2//参数备注
      this.form_add.remark3= this.multipleSelection[0].remark3 //参数备注
      this.form_add.remark4= this.multipleSelection[0].remark4//参数备注
      this.form_add.remark5= this.multipleSelection[0].remark5
      this.form_add.crdtAmt= this.multipleSelection[0].crdtAmt//参数备注
      //console.log(this.form_add[0].cardDate);
    },
    //修改保存按钮
    adminchangeSub(formdata) {
      this.$refs[formdata].validate(val => {
        if (val) {
          let param = {
            creditVipId: this.form_add.creditVipId,
            custNo: this.form_add.custNo,
            custLike: this.form_add.custLike,
            custName: this.form_add.custName,
            birteday: this.form_add.birteday,
            certId: this.form_add.certId,
            certType: this.form_add.certType,
            custType: this.form_add.custType,
            businessType: this.form_add.businessType,
            creditLeveo: this.form_add.creditLeveo,
            debitLeveo: this.form_add.debitLeveo,
            contentment: this.form_add.contentment,
            specifyAgent: this.form_add.specifyAgent,
            custOfferdegree: this.form_add.custOfferdegree,
            gainOfferdegree: this.form_add.gainOfferdegree,
            signMobio: this.form_add.signMobio,
            cardNo: this.form_add.cardNo,
            accountsType: this.form_add.accountsType,
            vindicator: this.form_add.vindicator,
            remark1: this.form_add.remark1,
            remark2: this.form_add.remark2,
            remark3: this.form_add.remark3,
            remark4: this.form_add.remark4,
            remark5: this.form_add.remark5,
            status: this.form_add.status,
            crdtAmt:this.form_add.crdtAmt
          };

          this.$MainAjax
            .doPost(urlConfig.admin.updateCreditVip, param)
            .then(res => {
              console.log(res);

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
              this.adminlistquery();
            });
        } else {
          return false;
        }
      });
    },
    //删除数据
    delAdminiPara() {
      //console.log("删除");
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
          var creditVipId = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            //console.log(this.multipleSelection[i].superviseBlackId);
            // ids += this.multipleSelection[i].dutyInfoId + ','
            creditVipId.push(this.multipleSelection[i].creditVipId);
          }
          let params = { creditVipId: creditVipId.join(",") };

          this.$MainAjax
            .doPost(urlConfig.admin.delCreditVip, params)
            .then(res => {
              //if (req.retCode != constants.returnCode.success) {
              //console.log(res);
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

</style>