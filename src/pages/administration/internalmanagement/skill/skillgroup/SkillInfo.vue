<!--created by liuhui on 2019.08.30-->
<template>
  <div id="skill">
    <el-row>
      <!-- 查询条件开始 -->
      <el-col>
        <el-row class="custquery">
          <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small" align="left">
            <el-col :span="12">
                <el-form-item label="技能编码">
                    <el-input v-model="form.skillCode" clearable maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="技能描述">
                    <el-input v-model="form.skillRemark" clearable maxlength="20"></el-input>
                </el-form-item>
            </el-col>
          </el-form>
          <!-- <el-col :span="24" class="but">
              <el-button type="primary" size="medium" plain @click="skillListquery()">查询</el-button>
          </el-col> -->
        </el-row>
      </el-col>
      <!-- 查询条件结束 -->
      <!-- 查询列表开始 -->
      <el-col>
        <!-- <el-row class="query_results">
          <el-col :span="3">
              <div >
                  <h2 class="querylist_style border">查询结果</h2>
              </div>
          </el-col>
          <el-col :span="21" class="query_results_but">
              <el-button type="primary" plain @click="addSkill()">增加</el-button>
              <el-button type="success" plain @click="deleteSkill()">删除</el-button>
              <el-button type="primary" plain @click="changeSkill()">修改</el-button>
              <el-button type="primary" plain @click="SkillUpdate()">技能组合信息维护</el-button>
          </el-col>
        </el-row> -->
        <h2 class="querylist_style border">查询结果</h2>
        <queryResTable :pageSize="20" pagePosition="right" :url ='postUrl' :params="params" :pageSizes="[20]" @dataChanged="dataChangedCallback" height="300" ref="tableBox" :reloadData.sync="reloadData">
          <template v-slot:paginationContainer>
            <el-table ref="multipleTable" :data="skillTableData" tooltip-effect="dark"  border stripe max- height="500" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column  prop="skillCode" label="技能编码"></el-table-column>
                <el-table-column prop="skillRemark" label="技能描述"></el-table-column>
                <el-table-column prop="skillStatus" label="技能状态" :formatter="formatStatus"></el-table-column>
            </el-table>
          </template>
        </queryResTable>
      </el-col>
      <!-- 查询列表结束 -->
      <!-- 新增弹窗开始 -->
      <el-dialog :title="title" :visible.sync="dialogShow" width="60%" @open="openDialog">
        <el-row>
          <el-form :model="form_add" label-width="140px" class="demo-ruleForm" ref="form_add" :rules="rules">
            <el-col :span="11">
                <el-form-item label="技能编码" prop="skillCode">
                    <el-input v-model="form_add.skillCode" clearable :disabled='isDisable'></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="11">
                <el-form-item label="技能描述" prop="skillRemark">
                    <el-input v-model="form_add.skillRemark" clearable maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="11">
                <el-form-item label="技能状态" prop="skillStatus">
                  <el-select v-model="form_add.skillStatus" style="width:100%" clearable>
                    <el-option label="有效" value="0"></el-option>
                    <el-option label="无效" value="1"></el-option>
                  </el-select>
                </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:center;">
            <el-button type="primary" v-show="addBtn" @click="newSkillSub('form_add')">确认</el-button> 
            <el-button type="primary" v-show="changeBtn" @click="changeSkillSub('form_add')">确认</el-button>
            <el-button type="primary" @click="dialogClose()">返回</el-button> 
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 新增弹窗结束 -->
    </el-row>
  </div>
</template>
<script>
  import MainAjax from "@/core/utils/MainAjax";
  import queryResTable from '@/core/components/PaginationContainer'
  import { mapActions } from 'vuex';
  export default {
    name:"skillinfo",
    components:{queryResTable},
    data() {
      return {
        //列表model
        reloadData:0,
        pageSize:10,
        pagePosition:"",
        postUrl:urlConfig.admin.skillQuery,
        params:{},
        title:"",
        addBtn:false,
        changeBtn:false,
        dialogShow:false,
        isDisable:false,
        form:{
          skillCode:"",
          skillRemark:""
        },
        form_add:{
          skillCode:"",
          skillRemark:"",
          skillStatus:""
        },
        rules:{
          skillCode:[{required:true,message:'请输入技能编码',trigger:'blur'},{min:1,max:20,message:'最多输入20个字符',trigger:'blur'}],
        },
        skillTableData: [],//查询到的技能列表数据
        multipleSelection: [] //列表选中的数据
      }
    },
    methods: {
      //获取列表选中的数据
      handleSelectionChange(val) {
        //console.log(val)
        this.multipleSelection = val;
      },
      //点击查询按钮
      skillListquery(){
          let params = {
            skillCode:this.form.skillCode,
            skillRemark:this.form.skillRemark
          }
          //this.postUrl = urlConfig.admin.skillQuery;
          this.params = params;
          this.reloadData = 1;
      },
      //将查询到的数据写入列表
      dataChangedCallback(response){
        this.skillTableData = response? response.skillList:[];
      },
      //技能状态格式化
      formatStatus(row){
        return Number(row.skillStatus) ? "无效" : "有效";;
      },
      //点击新增技能按钮
      addSkill(){
        this.title = "增加技能信息";
        this.addBtn = true;
        this.changeBtn = false;
        this.dialogShow = true;
        this.isDisable = false;
      },
      //新增修改弹框打开
      openDialog(){
        if(this.addBtn){
          this.$nextTick(()=>{
            this.$refs.form_add.resetFields(); 
          })
        }        
      },
      //新增技能弹窗，点击确定
      newSkillSub(formdata){
        console.log("这是增加操作")
        this.$refs[formdata].validate((val)=>{
          if(val){
            let param={
              skillCode:this.form_add.skillCode,
              skillRemark:this.form_add.skillRemark,
              skillStatus:this.form_add.skillStatus ? this.form_add.skillStatus:"1"
            }
            this.$confirm(`确认新增${this.form_add.skillCode}（技能编码）技能？`,'确认框',{
              confirmButtonText:'确认',
              cancelButtonText:"取消",
              type:"warning",
            }).then(()=>{
              MainAjax.doPost(urlConfig.admin.skillAdd,param).then(res =>{
                console.log(res);
                if(res.data.reminder == "1"){
                  this.$message({ 
                    showClose: true,
                    message: `${this.form_add.skillCode}（技能编码）已存在`,
                    type: 'warning'
                  });
                }else{
                  this.$message({ 
                    showClose: true,
                    message: `新增${this.form_add.skillCode}（技能编码）技能信息成功`,
                    type: 'success'
                  });
                  // this.$emit('resultChange',{
                  //   type: this.$constants.optionResultType.success,
                  //   content: `新增${this.form_add.skillCode}（技能编码）技能信息成功`,
                  // });
                }
            })
            });
          }else{
            return false;
          }
      })
      },
      //点击修改按钮
      changeSkill(){
        if(this.multipleSelection.length!="1"){
          this.$message({
              showClose: true,
              message: '请选择一条数据',
              type: 'warning'
          });
          return
        }
        this.title = "修改技能信息";
        this.addBtn = false;
        this.changeBtn = true;
        this.dialogShow = true;
        this.isDisable = true;
        console.log(this.multipleSelection[0])
        this.form_add.skillCode = this.multipleSelection[0].skillCode;
        this.form_add.skillRemark = this.multipleSelection[0].skillRemark;
        this.form_add.skillStatus = this.multipleSelection[0].skillStatus;
      },
      //修改技能
      changeSkillSub(){
        console.log("这是修改操作");
        let param = {
          skillCode:this.form_add.skillCode,
          skillRemark:this.form_add.skillRemark,
          skillStatus:this.form_add.skillStatus
        }
        this.$confirm(`确认修改${this.form_add.skillCode}（技能编码）技能？`,'确认框',{
          confirmButtonText:'确认',
          cancelButtonText:"取消",
          type:"warning",
          }).then(()=>{
            MainAjax.doPost(urlConfig.admin.skillUpdate,param).then(res =>{
              if(res.data.errorMsg==null){
                this.$message({
                showClose: true,
                message: '修改技能信息成功',
                type: 'success'
                });
                this.skillListquery();
              }
        })
          })
      },
      //删除技能
      // deleteSkill(){
      //   console.log("这是删除操作")
      //   if(!this.multipleSelection.length){
      //     this.$message({
      //         showClose: true,
      //         message: '请选择一条数据',
      //         type: 'warning'
      //     });
      //     return
      //   }
      //   this.$confirm('是否确认删除','确认框',{
      //       confirmButtonText:'确认',
      //       cancelButtonText:"取消",
      //       type:"warning",
      //   }).then(()=>{
      //       let param={
      //         // accinfoId:this.multipleSelection[0].accinfoId
      //       }
      //       MainAjax.doPost(urlConfig.admin.skillDel,param).then(req =>{
              
      //       });
      //   }).catch(()=>{
      //       this.$message({
      //           showClose: true,
      //           message: '已取消删除',
      //           type: 'info'
      //       });

      //   })
      // },
      //技能组合信息维护，点击跳转
      SkillUpdate(){
        console.log("技能组合信息维护");
        this.$router.push({
          path:'SkillGroup',
          query:[{btnIsShow:1}]
        })
      },
      //关闭增加或修改弹窗
      dialogClose(){
        this.dialogShow = false;
      }
    },
    mounted(){
      this.$emit('initButtons',[
        { "id": "3750","cname": "查询","isMenuOrButton": "B",onClick:"skillListquery"},
        { "id": "3755","cname": "增加","isMenuOrButton": "B",onClick:"addSkill"},
        {"id": "3752","cname": "修改","isMenuOrButton": "B",onClick: "changeSkill"},
        {"id": "3753","cname": "技能组合信息维护","isMenuOrButton": "B",onClick: "SkillUpdate"},
    ]);
      this.skillListquery();
    }
  }
</script>
<style scoped>
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