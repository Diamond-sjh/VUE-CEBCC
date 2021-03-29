<template>
<!-- 业务参数管理页面 -->
  <div>
      <!-- 查询条件开始 -->
        <el-row class="custquery">
          <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
            <el-col :span="8">
              <el-form-item label="参数编码">
                <el-input v-model="form.paramCode" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="参数描述">
                <el-input v-model="form.paramShowmsg" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="参数状态">
                <el-select v-model="form.status" style="width:100%" placeholder="请选择参数状态" clearable>
                  <el-option label="有效" value="1"></el-option>
                  <el-option label="无效" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="参数值">
                <el-input v-model="form.paramValue" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-form>
          <el-col :span="24" >
            <el-button type="primary" plain size="small" @click="busilistquerys()">查询</el-button>
          </el-col>
        </el-row>
      <!-- 查询条件结束 -->
      <!-- 查询列表开始 -->
      <h4 style="text-align:left;">
        <span class="dataTableStyle" v-for="(item,index) in listur" :key="index" @click="clickurl(item.dicCode,index)">{{item.dicname}}\</span>
      </h4>
        <el-row>
          <el-col :span="24" class="text_right">
            <el-button type="primary" plain size="small" @click="addBusinessPara()">新增</el-button>
            <el-button type="primary" plain size="small" @click="changeBusinessPara()">修改</el-button>
            <!-- <el-button type="primary" plain size="small" @click="changeStatus()">修改状态</el-button>
            <el-button type="primary" plain size="small" @click="exam()">审核</el-button> -->
          </el-col>
        </el-row>
         <h2 class="querylist_style border">查询结果</h2>
        <queryResTable :pageSize="20" pagePosition="right" :url="postUrl" :params="params" ref="tableBox" :reloadData.sync="reloadData" @dataChanged="dataChangedCallback">
          <template v-slot:paginationContainer>
            <el-table ref="multipleTable" :data="paramTableData" tooltip-effect="dark" stripe max-height="500" border @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column label="参数编码">
                <template slot-scope="scope">
                  <a class="dataTableStyle">
                    <span @click="dicCodeClick(scope.row)">{{scope.row.paramCode}}</span>
                  </a>
                </template>
              </el-table-column>
              <el-table-column prop="paramValue" label="参数值"></el-table-column>
              <el-table-column prop="paramShowmsg" label="参数描述"></el-table-column>
              <el-table-column prop="status" label="参数状态" width="200"></el-table-column>
            </el-table>
          </template>
        </queryResTable>
      <!-- 查询列表结束 -->
      <!-- 审核弹窗开始 -->
      <el-dialog :title="'审核'" :visible.sync="dialogShow" width="60%">
        <el-row>
          <el-table :data="examData">
            <el-table-column fixed label="参数"></el-table-column>
            <el-table-column label="修改前"></el-table-column>
            <el-table-column label="修改后"></el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:center;">
            <el-button size="small" type="primary" plain @click="examAdopt()">审核通过</el-button>
            <el-button size="small" type="primary" plain @click="examNotAdopt()">审核不通过</el-button>
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 审核弹窗结束 -->
    <!-- 新增修改弹框 -->
    <dialogpage :title="title" :showDialog.sync="dialogVisible" :formData="form_add" :formBack="form_add1" width="60%" >
      <template v-slot:dialogName>
      <el-row>
        <el-form :model="form_add" :rules="rules" ref="form_add" label-width="120px">
          <el-row>
            <el-col :span="11" class="text_left">
              <el-form-item label="根目录">
                <span>{{form_add.codePath}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11" class="text_left">
              <el-form-item label="参数编码" prop="paramCode">
                <el-input v-if="addorchange=='add'" v-model="form_add.paramCode" maxlength="100"></el-input>
                <span v-else >{{form_add.paramCode}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="参数值" prop="paramValue">
                <el-input v-model="form_add.paramValue" maxlength="500"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="参数说明" prop="paramShowmsg">
                <el-input v-model="form_add.paramShowmsg" maxlength="500"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="参数状态" prop="status">
                <el-select v-model="form_add.status" style="width:100%">
                  <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="序号" prop="orderNo">
                <el-input v-model="form_add.orderNo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="备注" prop="paramRemark">
                <el-input v-model="form_add.paramRemark" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="11" v-show="addorchange==='add'" class="text_left">
            <el-form-item label="连续录入">
                <el-checkbox v-model="form_add.checked"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align:center;">
          <el-button @click="dialogVisible = false" size="small" type="primary" plain>关闭</el-button>
          <el-button v-show="addorchange==='add'" size="small" type="primary" plain @click="adminaddSub('form_add')">确定</el-button>
          <el-button v-show="addorchange==='change'" size="small" type="primary" plain @click="adminchangeSub('form_add')">确定</el-button>
        </el-col>
      </el-row>
      </template>
    </dialogpage>
  </div>
</template>
<script>
// import MainAjax from "@/core/utils/MainAjax";
import queryResTable from "@/core/components/PaginationContainer";
import dialogpage from "@/pages/components/dialog";
import { mapActions } from "vuex";
export default {
  name: "technicallist",
  components: { queryResTable,dialogpage},
  data() {
    //参数编码验证
    var validatedicCode = (rule, value, callback) => {
      var pattern = /^[0-9a-zA-Z]+$/;
      if (value === "") {
        callback(new Error("请输入参数编码"));
      } else {
        if (pattern.test(value)) {
          let listlegth = this.listur.length-1;
          let paramId="";
          if(this.multipleSelection[0]){
            paramId=this.multipleSelection[0].paramId;
          }else{
            paramId="";
          }
          let param = {
            paramId:paramId,
            paramParentId:this.listur[listlegth].dicCode,
            paramCode: this.form_add.paramCode,
          };
          this.$MainAjax.doPost(urlConfig.admin.checkParamCode, param).then(res => {
            if (res.retCode == this.$constants.returnCode.success) {
              callback();
            }else{
              callback(new Error(res.retMsg));
            }
          })

        } else {
          callback(new Error("数字+字母的组合(区分大小写)"));
        }
        
      }
    };
    //参数编码验证
    var orderNoCode = (rule, value, callback) => {
      var pattern = /^[0-9]*$/;
      if (value === "") {
        callback(new Error("请输入参数序号"));
      } else {
        if (pattern.test(value)) {
          callback();
        } else {
          callback(new Error("参数序号必须是数字"));
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
      dialogShow: false,
      addorchange: "",
      title: "", //弹框title
      params: {},
      form: {
        paramCode: "",
        paramShowmsg: "",
        status: "",
        paramValue: "",
      },
      listur: [{ dicCode: "1", dicname: "根目录" }],
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
      examData: [],
      tableData: [], //列表数据
      //新增修改弹框
      //checked: [],
      dialogVisible: false, //是否显示弹框
      form_add: {
        checked:false,
        codePath:"",
        //新增修改model
        paramCode: "",
        paramValue: "",
        paramShowmsg: "",
        status: "1",
        orderNo: "",
        paramRemark: "",
        
      },
      form_add1: {
        checked:false,
        codePath:"",
        //新增修改model
        paramCode: "",
        paramValue: "",
        paramShowmsg: "",
        status: "1",
        orderNo: "",
        paramRemark: "",
        
      },
      rules: {
        paramCode: [
          { required: true,validator: validatedicCode, trigger: "blur" },
          { min: 1, max: 100, message: "最多输入100个字符", trigger: "blur" }
        ],
        paramValue: [
          { required: true, message: "请输入参数值", trigger: "blur" },
          { min: 1, max: 500, message: "最多输入500个字符", trigger: "blur" }
        ],
        paramShowmsg: [
          { required: true, message: "请输入参数说明", trigger: "blur" },
          { min: 1, max: 500, message: "最多输入500个字符", trigger: "blur" }
        ],
        orderNo: [
          { required: true, validator:orderNoCode, trigger: "blur" },
        ]
      },
      paramTableData: [], //查询到的技能列表数据
      multipleSelection: [] //列表选中的数据
    };
  },
  methods: {
    //获取列表选中的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //查询列表
    busilistquerys() {
      let listleg =this.listur.length-1;
      this.busilistquery(this.listur[listleg].dicCode);
    },
    busilistquery(dicCode) {
      let params = {
        paramCode: this.form.paramCode,
        paramShowmsg: this.form.paramShowmsg,
        paramValue: this.form.paramValue,
        status: this.form.status,
        paramType:"2",
        paramParentId:dicCode,
      };
      this.params = params;
      this.reloadData = 1;
    },
    //查询子列表
    dicCodeClick(row) {
      if (this.listur.length >= 4) {
        return;
      }
      this.busilistquery(row.paramId);
      this.listur.push({ dicname: row.paramCode, dicCode: row.paramId });
      console.log(this.listur);
    },
    //点击根目录
    clickurl(val, index) {
      this.busilistquery(val);
      this.listur.splice(index + 1, this.listur.length - index + 1);
    },
    //获取用户列表接口返回的数据
    dataChangedCallback(response) {
      this.paramTableData = response && response ? response.paramList : [];
      console.log(response);
    },
    //新增页面
    addBusinessPara() {
      this.addorchange = "add";
      this.title = "新增";
      this.dialogVisible = true;
      let page=[];
      for(var i=0;i<this.listur.length;i++){
        page.push(this.listur[i].dicname)
      }
      this.form_add.codePath=page.toString();
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
      this.$refs[formdata].validate(val => {
        if (val) {
          let idx = this.listur.length - 1;
          let param = {
            paramCode: this.form_add.paramCode,
            paramValue: this.form_add.paramValue,
            paramShowmsg: this.form_add.paramShowmsg,
            status: this.form_add.status,
            orderNo: this.form_add.orderNo.toString(),
            paramRemark:this.form_add.paramRemark,
            updateBy:"updateBy",
            paramType:"2",
            paramParentId:this.listur[idx].dicCode
          };
          this.$MainAjax.doPost(urlConfig.admin.paramAdd, param).then(res => {
            if (res.retCode == this.$constants.returnCode.success) {
              if (res.reminder == "0") {
                this.$message({
                  showClose: true,
                  message: "新增的在系统中已存在，不能重复添加",
                  type: "warning"
                });
              } else {
                this.$emit("resultChange", {
                  info: {
                    type: constants.optionResultType.success,
                    content: '系统参数'+this.form_add.paramCode+'新增成功'
                  },
                  flush: true
                });
                this.busilistquery(this.listur[idx].dicCode);
                if(this.form_add.checked==true){
                  return
                }
                //关闭弹窗
                this.dialogVisible = false; 
              }
            }else{
              this.$message({
                showClose:res.retMsg,
                type: "warning"
              });
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
          orderNo: '',
          dicKind: "1"
        };
        // });
      }
    },
    //修改弹框
    changeBusinessPara() {
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
      let page=[];
      for(var i=0;i<this.listur.length;i++){
        page.push(this.listur[i].dicname)
      }
      this.form_add.codePath=page.toString();
      this.form_add.paramCode = this.multipleSelection[0].paramCode,
      this.form_add.paramValue = this.multipleSelection[0].paramValue; //参数编码
      this.form_add.paramShowmsg = this.multipleSelection[0].paramShowmsg; //参数值
      this.form_add.status = this.multipleSelection[0].status; //状态
      this.form_add.orderNo = Number(this.multipleSelection[0].orderNo) ; //序号
      this.form_add.paramRemark = this.multipleSelection[0].paramRemark; //参数说明
    },
    //修改保存按钮
    adminchangeSub(formdata) {
      this.$refs[formdata].validate(val => {
        if (val) {
          let idx = this.listur.length - 1;
          let param = {
            paramCode: this.form_add.paramCode,
            paramValue: this.form_add.paramValue,
            paramShowmsg: this.form_add.paramShowmsg,
            status: this.form_add.status,
            orderNo: this.form_add.orderNo.toString(),
            paramRemark:this.form_add.paramRemark,
            paramId:this.multipleSelection[0].paramId,
            updateBy:"updateBy",
            paramType:"2",
            paramParentId:this.listur[idx].dicCode
          };
          this.$MainAjax.doPost(urlConfig.admin.paramUpdate, param).then(res => {
              if (res.retCode == this.$constants.returnCode.success) {
                if (res.reminder == "0") {
                  this.$message({
                    showClose: true,
                    message: "新增的角色在系统中已存在，不能重复添加",
                    type: "warning"
                  });
                } else {
                  this.$emit("resultChange", {
                    info: {
                      type: constants.optionResultType.success,
                      content: '系统参数'+this.form_add.paramCode+'修改成功'
                    },
                    flush: true
                  });
                  this.dialogVisible = false;
                  this.busilistquery(this.listur[idx].dicCode);
                }
              } 
            });
        } else {
          return false;
        }
      });
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
      for (let i = 0; i < this.multipleSelection.length; i++) {
        param = this.multipleSelection[i].dicInfoId;
        ids.push(param);
      }
      //  this.$MainAjax.doPost(urlConfig.admin.paramAdd,param) .then{

      //  }
    },
    exam() {
      this.dialogShow = true;
    },
    examAdopt() {
      console.log("审核通过");
    },
    examNotAdopt() {
      console.log("审核不通过");
    }
  },
  mounted(){
    this.busilistquerys();
  },
};
</script>
<style scoped>
</style>