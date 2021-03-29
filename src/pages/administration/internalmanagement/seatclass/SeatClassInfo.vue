<!--created by liuhui on 2019.09.02-->
<template>
  <div id="seatClass">
    <el-row>
      <!-- 查询条件开始 -->
      <el-col  class="custlist">
        <el-row class="query_results">
          <el-col :span="3">
            <div>
              <p>查询条件</p>
            </div>
          </el-col>
        </el-row>
        <el-row class="custquery">
          <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
            <el-col :span="8">
                <el-form-item label="座席分类名称">
                    <el-input v-model="form.seatClassName" clearable maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="座席分类编码">
                    <el-input v-model="form.seatClassCode" clearable maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="座席分类号">
                <el-input v-model="form.seatClassNum" clearable maxlength="10" @keyup.native="seatNumLimit(form.seatClassNum)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="座席分类状态">
                <el-select v-model="form.seatClassStatus" style="width:100%" placeholder="请选择座席分类状态" clearable>
                    <el-option label="有效" value="1"></el-option>
                    <el-option label="无效" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
          <el-col :span="24" class="but">
              <el-button type="success" size="medium" plain @click="seatClassQuery()">查询</el-button>
          </el-col>
        </el-row>
      </el-col>
      <!-- 查询条件结束 -->
      <!-- 查询列表开始 -->
      <el-col  class="custlist">
        <el-row class="query_results">
          <el-col :span="3">
              <div >
                  <p>查询结果</p>
              </div>
          </el-col>
          <el-col :span="21" class="query_results_but">
              <el-button type="success" plain @click="addSeatClass()">增加</el-button>
              <el-button type="success" plain @click="changeSeatClass()">修改</el-button>
              <el-button type="success" plain @click="deleteSeatClass()">删除</el-button>
              <el-button type="success" plain @click="back()">返回</el-button>
          </el-col>
        </el-row>
        <queryResTable :pageSize="pageSize" :pagePosition="pagePosition" :url ='postUrl' :params="params" height="300" ref="tableBox">
          <template v-slot:paginationContainer>
            <el-table ref="multipleTable" :data="tableData"  tooltip-effect="dark" height="300" :header-cell-style="{background:'#f0f9eb',border:'2px solid inherit'}" border>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column  prop="seatClassCode" label="座席分类编码"></el-table-column>
                <el-table-column prop="seatClassName" label="座席分类名称"></el-table-column>
                <el-table-column prop="seatClassNum" label="座席分类号"></el-table-column>
                <el-table-column prop="seatClassStatus" label="座席分类状态" width="200" clearable></el-table-column>
            </el-table>
          </template>
        </queryResTable>
      </el-col>
      <!-- 查询列表结束 -->
      <!-- 新增弹窗开始 -->
      <el-dialog :title="title" :visible.sync="dialogShow" width="60%">
        <el-row>
          <el-form :model="form_add" label-width="140px" class="demo-ruleForm" ref="form">
            <el-col :span="11">
                <el-form-item label="座席分类编码" prop="seatClassCode">
                    <el-input v-model="form_add.seatClassCode" clearable maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="11">
                <el-form-item label="座席分类号" prop="seatClassNum">
                    <el-input v-model="form_add.seatClassNum" clearable maxlength="10" @keyup.native="seatNumDialog(form_add.seatClassNum)"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="11">
                <el-form-item label="座席分类名称" prop="seatClassName">
                    <el-input v-model="form_add.seatClassName" clearable maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="是否同步零售外呼">
                <el-checkbox style="margin-left:-350px;"></el-checkbox>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:center;">
            <el-button type="success" @click="submitNewSeatClass()">确认</el-button> 
            <el-button type="success" @click="dialogClose()">返回</el-button> 
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 新增弹窗结束 -->
    </el-row>
  </div>
</template>
<script>
import MainAjax from "@/core/utils/MainAjax";
import queryResTable from '@/core/components/PaginationContainer';
import { mapActions } from 'vuex';
export default {
  name:"seatClass",
  components:{queryResTable},
  data() {
    return {
      //列表model
      pageSize:10,
      pagePosition:"",
      postUrl:urlConfig.admin.queryUser,
      params:"",
      dialogShow:false,
      title:"",
      form:{
        seatClassName:"",
        seatClassCode:"",
        seatClassNum:"",
        seatClassStatus:"",
        turnPageBeginPos:"1",
        turnPageShowNum:"10"
      },
      form_add:{
        seatClassCode:"",
        seatClassNum:"",
        seatClassName:""
      },
      tableData: [
        {seatClassCode:100,seatClassNum:15223,seatClassName:"This is a test data.",seatClassStatus:"有效"},
        {seatClassCode:101,seatClassNum:15241,seatClassName:"This is a test data.hello world",seatClassStatus:"无效"}
      ],//列表数据      
      multipleSelection: [],//列表选中的数据
    }
  },
  methods:{
    seatClassQuery(){
      //检索条件至少输入一项，若均为空，点击查询，提示：请输入查询条件
      if(this.form){
        this.$message({
        showClose: true,
        message: '保存成功',
        type: 'success'
      });
      }
    },
    addSeatClass(){
      this.title = "增加技能组信息";
      this.dialogShow = true;
    },
    changeSeatClass(){
      this.title = "修改技能组信息";
      this.dialogShow = true;
    },
    deleteSeatClass(){
      this.$message({
        showClose: true,
        message: '删除成功',
        type: 'success'
      });
    },
    submitNewSeatClass(){
      this.form_add = {};
      this.dialogShow = false;
      this.$message({
        showClose: true,
        message: '保存成功',
        type: 'success'
      });
    },
    back(){
      this.dialogShow = false;
    },
    dialogClose(){
      //this.form_add = {};
      this.$refs['form'].resetFields();
      this.dialogShow = false;
    },
    seatNumLimit(){
      if(isNaN(parseInt(this.form.seatClassNum))){
        this.form.seatClassNum = "";
      }else{
        this.form.seatClassNum = parseInt(this.form.seatClassNum);
      }
    },
     seatNumDialog(){
      if(isNaN(parseInt(this.form_add.seatClassNum))){
        this.form_add.seatClassNum = "";
      }else{
        this.form_add.seatClassNum = parseInt(this.form_add.seatClassNum);
      }
     }
  }
}
</script>
<style scoped>
  .custlist{
    background: white;
    padding: 0px 10px 30px 10px;
    margin-bottom: 15px;
  }
  .but{
    margin: 10px 0px -10px 0px;
    text-align: center;
  }
  .custquery{
    margin: 20px 60px 0px 40px;
  }
  .custquery .el-form-item{
    margin-bottom: 10px;
  }
  .query_results{
    height: 50px;
    border-bottom: 4px solid rgb(224, 230, 224);
    margin: 15px 0px 15px 0px;   
  }
  .query_results p{
    line-height: 50px;
    font-size: 18px;
    text-align: left;
    padding-left: 15px;
    border-bottom: 4px solid rgb(120, 190, 85);;
    height: 50px;
    font-weight: 500;
    color: rgb(95, 97, 92);
  }
  .query_results .query_results_but{
    text-align: right;    
  }
  .page{
    margin: 10px 10px 0px 0px;
    text-align: right;
  }
</style>
