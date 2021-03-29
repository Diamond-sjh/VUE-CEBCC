<template>
  <!-- 监管黑名单 -->
  <div>
      <el-row class="custquery">
        <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
          <el-col :span="8">
            <el-form-item label="客户号">
              <el-input v-model="form.custNo" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名">
              <el-input v-model="form.custName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码">
              <el-select v-model="form.certType" style="width:100%" placeholder="请选择类型">
                <el-option label="身份证" value="1"></el-option>
                <el-option label="护照" value="0"></el-option>
                <el-option label="军人证" value="1"></el-option>
                <el-option label="武警证" value="0"></el-option>
                <el-option label="港澳台通行证" value="1"></el-option>
                <el-option label="户口簿" value="0"></el-option>
                <el-option label="台湾居民来往大陆通行证" value="1"></el-option>
                <el-option label="外国人永久居留证" value="0"></el-option>
                <el-option label="港澳居民居住证" value="1"></el-option>
                <el-option label="台湾居民居住证" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="风险事件类型">
              <el-select v-model="form.riskType" style="width:100%" placeholder="请选择类型">
                <el-option label="提示类" value="1"></el-option>
                <el-option label="禁止类" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="信息来源">
              <el-select v-model="form.dataSource" style="width:100%" placeholder="请选择类型">
                <el-option label="我行发现" value="1"></el-option>
                <el-option label="有权机构提供" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名单类型">
              <el-select v-model="form.listType" style="width:100%" placeholder="请选择类型">
                <el-option label="003-电信网络犯罪涉案客户黑名单" value="0"></el-option>
                <el-option label="004-电信网络犯罪涉案账户关联客户黑名" value="0"></el-option>
                <el-option label="005-电信网络犯罪涉案可疑客户黑名单" value="0"></el-option>
                <el-option label="006-电信网络犯罪涉案可疑账户关联客户黑名单" value="0"></el-option>
                <el-option label="007-人行发布买卖账户或假冒他人开户客户黑名单" value="0"></el-option>
                <el-option label="009-证件到期日1-90天客户" value="0"></el-option>
                <el-option label="010-证件到期日90天以上客户" value="0"></el-option>
                <el-option label="011-反洗钱可疑交易人黑名单" value="0"></el-option>
                <el-option label="012-限制类交易名单" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数据类型">
              <el-select v-model="form.dataType" style="width:100%" placeholder="请选择类型">
                <el-option label="手工维护" value="1"></el-option>
                <el-option label="系统导入" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="form.status" style="width:100%" placeholder="请选择类型">
                <el-option label="有效" value="1"></el-option>
                <el-option label="无效" value="0"></el-option>
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
          <el-table-column label="客户号" prop="custNo"></el-table-column>
          <el-table-column label="客户姓名" prop="custName"></el-table-column>
          <el-table-column label="证件类型" prop="certType"></el-table-column>
          <el-table-column label="证件号码" prop="certId"></el-table-column>
          <el-table-column label="风险事件类型" prop="riskType"></el-table-column>
          <el-table-column label="信息来源" prop="dataSource"></el-table-column>
          <el-table-column label="发现渠道" prop="channelSource"></el-table-column>
          <el-table-column label="名单类型" prop="listType"></el-table-column>
          <el-table-column label="名单种类" prop="listKind"></el-table-column>
          <el-table-column label="名单级别" prop="listLevel"></el-table-column>
          <el-table-column label="生效日期" prop="listCreatedDate"></el-table-column>
          <el-table-column label="失效日期" prop="listLapseDate"></el-table-column>
          <el-table-column label="状态" prop="status"></el-table-column>
          <el-table-column label="更新时间" prop="updateDate"></el-table-column>
          <el-table-column label="维护人姓名" prop="maintainerName"></el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
        </el-table>
      </template>
    </queryResTable>
    <!-- 查询列表结束 -->
    <dialogpage :title="title" :showDialog.sync="dialogVisible" :formData="form_add" :formBack="form_add1" @open="openDialog">
    <template v-slot:dialogName>
      <el-row>
        <el-form :model="form_add" :rules="rules" ref="form_add" label-width="120px" class="demo-ruleForm">
          <el-col :span="11">
            <el-form-item label="客户号" prop="custNo">
              <el-input v-model="form_add.custNo" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="姓名" prop="custName">
              <el-input v-model="form_add.custName" maxlength="20"></el-input>
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
                <el-option label="台湾居民来往大陆通行证" value="7"></el-option>
                <el-option label="外国人永久居留证" value="8"></el-option>
                <el-option label="港澳居民居住证" value="9"></el-option>
                <el-option label="台湾居民居住证" value="c"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="证件号码" prop="certId">
              <el-input v-model="form_add.certId" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="发证日期" prop="certIssueDate">
              <el-date-picker
                v-model="form_add.certIssueDate"
                type="date"
                style="width:100%"
                value-format="yyyy/MM/dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="发证机关" prop="issueBranch">
              <el-input v-model="form_add.issueBranch" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="证件到期日" prop="certMaturityDate">
              <el-date-picker
                v-model="form_add.certMaturityDate"
                type="date"
                style="width:100%"
                value-format="yyyy/MM/dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="风险事件类型" prop="riskType">
              <el-select v-model="form_add.riskType" style="width:100%" placeholder="请选择类型">
                <el-option label="提示类" value="1"></el-option>
                <el-option label="禁止类" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="发现渠道" prop="channelSource">
              <el-input v-model="form_add.channelSource" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="信息来源" prop="dataSource">
              <el-select v-model="form_add.dataSource" style="width:100%" placeholder="请选择类型">
                <el-option label="我行发现" value="1"></el-option>
                <el-option label="有权机构提供" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="维护人员姓名" prop="maintainerName">
              <el-input v-model="form_add.maintainerName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="授权人工号" prop="cetigierNo">
              <el-input v-model="form_add.cetigierNo" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="授权人姓名" prop="cetigierName">
              <el-input v-model="form_add.cetigierName" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="名单类型" prop="listType">
              <el-select v-model="form_add.listType" style="width:100%" placeholder="请选择类型">
                <el-option label="003-电信网络犯罪涉案客户黑名单" value="003"></el-option>
                <el-option label="004-电信网络犯罪涉案账户关联客户黑名" value="004"></el-option>
                <el-option label="005-电信网络犯罪涉案可疑客户黑名单" value="005"></el-option>
                <el-option label="006-电信网络犯罪涉案可疑账户关联客户黑名单" value="006"></el-option>
                <el-option label="007-人行发布买卖账户或假冒他人开户客户黑名单" value="007"></el-option>
                <el-option label="009-证件到期日1-90天客户" value="009"></el-option>
                <el-option label="010-证件到期日90天以上客户" value="010"></el-option>
                <el-option label="011-反洗钱可疑交易人黑名单" value="011"></el-option>
                <el-option label="012-限制类交易名单" value="012"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="名单生效日期" prop="listCreatedDate">
              <el-date-picker v-model="form_add.listCreatedDate" type="date" style="width:100%" value-format="yyyy/MM/dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="名单失效日期" prop="listLapseDate">
              <el-date-picker v-model="form_add.listLapseDate" type="date" style="width:100%" value-format="yyyy/MM/dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="发送机构" prop="sendOrg">
              <el-input v-model="form_add.sendOrg" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="开卡时间" prop="cardDate">
              <el-date-picker v-model="form_add.cardDate" type="date" style="width:100%" value-format="yyyy/MM/dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="更新柜员" prop="updateAccAgent">
              <el-input v-model="form_add.updateAccAgent" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="更新机构号" prop="updateOrgCode">
              <el-input v-model="form_add.updateOrgCode" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="创建渠道" prop="createChannel">
              <el-input v-model="form_add.createChannel" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="最新更新渠道" prop="updateChannel">
              <el-input v-model="form_add.updateChannel" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="名单种类" prop="listKind">
              <el-select v-model="form_add.listKind" style="width:100%" placeholder="请选择类型">
                <el-option label="黑名单" value="1"></el-option>
                <el-option label="可疑名单" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="名单级别" prop="listLevel">
              <el-select v-model="form_add.listLevel" style="width:100%" placeholder="请选择类型">
                <el-option label="客户级" value="1"></el-option>
                <el-option label="账户级" value="2"></el-option>
              </el-select>
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
            <el-form-item label="数据类型" prop="dataType">
              <el-select v-model="form_add.dataType" style="width:100%" placeholder="请选择类型">
                <el-option label="手工维护" value="1"></el-option>
                <el-option label="系统导入" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form_add.remark" maxlength="100"></el-input>
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
       var pattern = /^1\d+$/;
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
      postUrl: urlConfig.admin.querySuperviseBlackList,
      params: "",
      form: {
        custNo: "",
        custName: "",
        certId: "",
        riskType: "",
        dataType: "",
        dataSource: "",
        listType: "",
        status: "",
        superviseBlackId: ""
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
        cardDate: "",
        certId: "",
        certIssueDate: "",
        certMaturityDate: "",
        certType: "",
        cetigierName: "",
        cetigierNo: "",
        channelSource: "",
        createChannel: "",
        custName: "",
        custNo: "",
        dataSource: "",
        dataType: "",
        issueBranch: "",
        listCreatedDate: "",
        listKind: "",
        listLapseDate: "",
        listLevel: "",
        listType: "",
        maintainerName: "",
        remark: "",
        riskType: "",
        sendOrg: "",
        updateAccAgent: "",
        updateChannel: "",
        updateOrgCode: ""
      },
      form_add1: {
        //新增修改model
        cardDate: "",
        certId: "",
        certIssueDate: "",
        certMaturityDate: "",
        certType: "",
        cetigierName: "",
        cetigierNo: "",
        channelSource: "",
        createChannel: "",
        custName: "",
        custNo: "",
        dataSource: "",
        dataType: "",
        issueBranch: "",
        listCreatedDate: "",
        listKind: "",
        listLapseDate: "",
        listLevel: "",
        listType: "",
        maintainerName: "",
        remark: "",
        riskType: "",
        sendOrg: "",
        updateAccAgent: "",
        updateChannel: "",
        updateOrgCode: "",
        status:""
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
        response && response.data ? response.data.superviseBlackList : [];
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
        certId: this.form.certId,
        signPhone: this.form.signPhone
      };
      this.params = params;
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
            cardDate: this.form_add.cardDate,
            certId: this.form_add.certId,
            certIssueDate: this.form_add.certIssueDate,
            certMaturityDate: this.form_add.certMaturityDate,
            certType: this.form_add.certType,
            cetigierName: this.form_add.cetigierName,
            cetigierNo: this.form_add.cetigierNo,
            channelSource: this.form_add.channelSource,
            createChannel: this.form_add.createChannel,
            custName: this.form_add.custName,
            custNo: this.form_add.custNo,
            dataSource: this.form_add.dataSource,
            dataType: this.form_add.dataType,
            issueBranch: this.form_add.issueBranch,
            listCreatedDate: this.form_add.listCreatedDate,
            listKind: this.form_add.listKind,
            listLapseDate: this.form_add.listLapseDate,
            listLevel: this.form_add.listLevel,
            listType: this.form_add.listType,
            maintainerName: this.form_add.maintainerName,
            remark: this.form_add.remark,
            riskType: this.form_add.riskType,
            sendOrg: this.form_add.sendOrg,
            updateAccAgent: this.form_add.updateAccAgent,
            updateChannel: this.form_add.updateChannel,
            updateOrgCode: this.form_add.updateOrgCode
          };
          this.$MainAjax
            .doPost(urlConfig.admin.saveSuperviseBlack, param)
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
          custNo: "",
          custName: "",
          certType: "",
          certId: "",
          certIssueDate: "",
          status: "1",
          issueBranch: "",
          riskType: "",
          channelSource: "",
          dataSource: "",
          maintainerName: "",
          cetigierNo: "",
          cetigierName: "",
          listType: "",
          sendOrg: "",
          cardDate: "",
          updateAccAgent: "",
          updateOrgCode: "",
          createChannel: "",
          updateChannel: "",
          listKind: "",
          listLevel: "",
          remark: "",
          status:"",
          dataType: ""
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
      this.form_add.cardDate = this.multipleSelection[0].cardDate;
      this.form_add.certId = this.multipleSelection[0].certId;
      this.form_add.certType = this.multipleSelection[0].certType; //参数名称
      this.form_add.certIssueDate = this.multipleSelection[0].certIssueDate; //参数等级
      this.form_add.certMaturityDate = this.multipleSelection[0].certMaturityDate; //状态
      this.form_add.cetigierName = this.multipleSelection[0].cetigierName;
      this.form_add.cetigierNo = this.multipleSelection[0].cetigierNo;
      this.form_add.channelSource = this.multipleSelection[0].channelSource;
      this.form_add.createChannel = this.multipleSelection[0].createChannel;
      this.form_add.custName = this.multipleSelection[0].custName;
      this.form_add.custNo = this.multipleSelection[0].custNo;
      this.form_add.dataSource = this.multipleSelection[0].dataSource;
      this.form_add.dataType = this.multipleSelection[0].dataType;
      this.form_add.issueBranch = this.multipleSelection[0].issueBranch;
      this.form_add.listCreatedDate = this.multipleSelection[0].listCreatedDate;
      this.form_add.listKind = this.multipleSelection[0].listKind;
      this.form_add.listLapseDate = this.multipleSelection[0].listLapseDate;
      this.form_add.listLevel = this.multipleSelection[0].listLevel;
      this.form_add.listType = this.multipleSelection[0].listType;
      this.form_add.maintainerName = this.multipleSelection[0].maintainerName;
      this.form_add.remark = this.multipleSelection[0].remark;
      this.form_add.riskType = this.multipleSelection[0].riskType;
      this.form_add.sendOrg = this.multipleSelection[0].sendOrg; //参数备注
      this.form_add.updateAccAgent = this.multipleSelection[0].updateAccAgent; //参数备注
      this.form_add.updateChannel = this.multipleSelection[0].updateChannel; //参数备注
      this.form_add.updateOrgCode = this.multipleSelection[0].updateOrgCode; //参数备注
      //console.log(this.form_add[0].cardDate);
    },
    //修改保存按钮
    adminchangeSub(formdata) {
      this.$refs[formdata].validate(val => {
        if (val) {
          let param = {
            cardDate: this.form_add.cardDate,
            certId: this.form_add.certId,
            certIssueDate: this.form_add.certIssueDate,
            certMaturityDate: this.form_add.certMaturityDate,
            certType: this.form_add.certType,
            cetigierName: this.form_add.cetigierName,
            cetigierNo: this.form_add.cetigierNo,
            channelSource: this.form_add.channelSource,
            createChannel: this.form_add.createChannel,
            custName: this.form_add.custName,
            custNo: this.form_add.custNo,
            dataSource: this.form_add.dataSource,
            dataType: this.form_add.dataType,
            issueBranch: this.form_add.issueBranch,
            listCreatedDate: this.form_add.listCreatedDate,
            listKind: this.form_add.listKind,
            listLapseDate: this.form_add.listLapseDate,
            listLevel: this.form_add.listLevel,
            listType: this.form_add.listType,
            maintainerName: this.form_add.maintainerName,
            remark: this.form_add.remark,
            riskType: this.form_add.riskType,
            sendOrg: this.form_add.sendOrg,
            status: this.form_add.status,
            superviseBlackId: this.multipleSelection[0].superviseBlackId,
            updateAccAgent: this.form_add.updateAccAgent,
            updateChannel: this.form_add.updateChannel,
            updateOrgCode: this.form_add.updateOrgCode
          };

          this.$MainAjax
            .doPost(urlConfig.admin.updateSuperviseBlack, param)
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
          var superviseBlackId = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            //console.log(this.multipleSelection[i].superviseBlackId);
            // ids += this.multipleSelection[i].dutyInfoId + ','
            superviseBlackId.push(this.multipleSelection[i].superviseBlackId);
          }
          let params = { superviseBlackId: superviseBlackId.join(",") };

          this.$MainAjax
            .doPost(urlConfig.admin.delSuperviseBlackId, params)
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
<style>
</style>



