<!--坐席分类信息-->
<template>
  <div>
    <el-row>
      <!-- 查询条件开始 -->
      <el-col>
        <el-row class="custquery">
          <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
            <el-col :span="8">
                <el-form-item label="座席分类名称">
                    <el-input v-model="form.skillTeamName" clearable></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="座席分类编码">
                    <el-input v-model="form.skillTeamCode" clearable></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="座席分类号">
                <el-input v-model="form.skillTeamNumber" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="座席分类状态">
                <el-select v-model="form.status" style="width:100%" placeholder="请选择座席分类状态" clearable>
                    <el-option label="有效" value="1"></el-option>
                    <el-option label="无效" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
          <el-col :span="24">
              <el-button type="primary" plain size="small"  @click="seatClassQuery()">查询</el-button>
          </el-col>
        </el-row>
      </el-col>
      <!-- 查询条件结束 -->
      <!-- 查询列表开始 -->
      <el-col>
        <el-row class="text-right">
          <el-col :span="24">
              <el-button type="primary" plain size="small" @click="addSeatClass()">增加</el-button>
              <el-button type="primary" plain size="small" @click="changeSeatClass()">修改</el-button>
              <el-button type="primary" plain size="small" @click="deleteSeatClass()">删除</el-button>
              <el-button type="primary" plain size="small" @click="back()">返回</el-button>
          </el-col>
        </el-row>
        <h2 class="querylist_style border">查询结果</h2>
        <queryResTable  pagePosition="right" :url ='postUrl' :params="params" ref="tableBox" :reloadData.sync="reloadData"
        :pageSize="20"  @dataChanged="dataChangedCallback">
          <template v-slot:paginationContainer>
            <el-table ref="multipleTable" :data="tableData"  tooltip-effect="dark" max-height="500" border :highlight-current-row="true"
            stripe @current-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="40"></el-table-column> -->
                <el-table-column  prop="skillTeamCode" label="座席分类编码"></el-table-column>
                <el-table-column prop="skillTeamName" label="座席分类名称"></el-table-column>
                <el-table-column prop="skillTeamNumber" label="座席分类号"></el-table-column>
                <el-table-column prop="status" label="座席分类状态" width="200" clearable></el-table-column>
            </el-table>
          </template>
        </queryResTable>
      </el-col>
      <!-- 查询列表结束 -->
      <!-- 新增弹窗开始 -->
      <el-dialog :title="title" :visible.sync="dialogShow" width="60%" @open='openfun' @close='dialogClose' >
        <el-row>
          <el-form :model="form_add" label-width="140px" ref="form_add" :rules="rules" class="demo-ruleForm">
            <el-col :span="11">
                <el-form-item label="座席分类编码" prop="skillTeamCode">
                    <el-input v-model="form_add.skillTeamCode" clearable placeholder="请输入座席分类编码"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="11">
                <el-form-item label="座席分类号" prop="skillTeamNumber">
                    <el-input v-model="form_add.skillTeamNumber" clearable  placeholder="请输入座席分类号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="11">
                <el-form-item label="座席分类名称" prop="skillTeamName">
                    <el-input v-model="form_add.skillTeamName" clearable placeholder="请输入座席分类名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="是否同步零售外呼" class="text_left">
                  <el-checkbox  v-model='form_add.checkedSkill' :label="1"></el-checkbox> 
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="座席分类状态">
                <el-select v-model="form_add.status" style="width:100%" placeholder="请选择座席分类状态" clearable>
                    <el-option label="有效" value="1"></el-option>
                    <el-option label="无效" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:center;">
            <el-button size="small" type="primary" plain v-show="add_change=='1'"  @click="submitNewSeatClass('form_add')">确认</el-button>
            <el-button size="small" type="primary" plain v-show="add_change=='0'"  @click="changeSeat('form_add')">确认</el-button> 
            <el-button size="small" type="primary" plain  @click="dialogClose()">返回</el-button> 
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
      form:{
        skillTeamName:"",
        skillTeamCode:"",
        skillTeamNumber:"",
        status:"",
      },
      postUrl:urlConfig.admin.querySkillTeamList,
      params:{},
      reloadData:0,
      tableData: [],//列表数据  
      checkTableData:[],//获取选中的数据 
      //新增和修改
      dialogShow:false,
      title:"",
      add_change:"1",//1新增 0修改
      form_add:{
        skillTeamCode:"",
        skillTeamNumber:"",
        skillTeamName:"",
        checkedSkill:[],
        status:"",
      },
      rules:{
        skillTeamCode:[{required:true,message:'请输入座席分类编码',trigger:'blur'},{min:1,max:10,message:'最多输入10个字符',trigger:'blur'}],
        skillTeamNumber:[{required:true,message:'请输入座席分类号',trigger:'blur'},{min:1,max:10,message:'最多输入10个字符',trigger:'blur'}],
        skillTeamName:[{required:true,message:'请输入座席分类名称',trigger:'blur'},{min:1,max:10,message:'最多输入20个字符',trigger:'blur'}],
      },
         
    }
  },
  methods:{
    //列表查询
    seatClassQuery(){
      this.params={
        skillTeamName:this.form.skillTeamName,
        skillTeamCode:this.form.skillTeamCode,
        skillTeamNumber:this.form.skillTeamNumber,
        status:this.form.status,
      } 
      this.reloadData =1; 
    },
    //获取用户列表接口返回的数据 
    dataChangedCallback(response){
        this.tableData = response&&response? response.skillTeamList:[];
    },
    handleSelectionChange(data){
      console.log(data)
      this.checkTableData=data;
    },
    //新增坐席
    addSeatClass(){
      this.dialogShow = true;
      this.add_change="1";
      this.title = "新增座席分类";
      this.$nextTick(()=>{
          this.$refs.form_add.resetFields(); 
      })
      
    },
    //修改坐席
    changeSeatClass(){
      if(this.checkTableData.length<=0){
        this.$message({ 
            //showClose: true,
            message: '请选择一条数据',
            type: 'warning'
        });
        return false;
      }
      
      this.add_change="0";
      this.title = "修改座席分类";
      this.dialogShow = true;
      
      this.form_add.skillTeamCode=this.checkTableData.skillTeamCode;
      this.form_add.skillTeamNumber=this.checkTableData.skillTeamNumber;
      console.log(this.form_add.skillTeamNumber)
      
      this.form_add.skillTeamName=this.checkTableData.skillTeamName;
      //this.form_add.checkedSkill=this.checkTableData.checkedSkill;
      this.form_add.status=this.checkTableData.status;
      
      
      
    },
    //删除坐席
    deleteSeatClass(){
      if(this.checkTableData.length<=0){
        this.$message({ 
            //showClose: true,
            message: '请选择一条数据',
            type: 'warning'
        });
        return false;
      }
      this.$confirm('是否确认删除','确认框',{
        confirmButtonText:'确认',
        cancelButtonText:"取消",
        type:"warrning",
      }).then(()=>{
        let param={
          id:this.checkTableData.id,
        }
        MainAjax.doPost(urlConfig.admin.delSkillTeam,param).then(req =>{
          if(req.retCode==this.$constants.returnCode.success){
            this.seatClassQuery();
            this.$emit('resultChange',{info:[
              {
                  type: this.$constants.optionResultType.success,
                  content:"删除成功!",
              }
              ],flush:true});
          }
        })
      }).catch(()=>{
        this.$message({
            showClose: true,
            message: '已取消删除',
            type: 'info'
        });
      })
    },
    //新增保存
    submitNewSeatClass(formdata){
      this.$refs[formdata].validate((val)=>{
        if(val){
          let param={
            skillTeamCode:this.form_add.skillTeamCode,
            skillTeamNumber:this.form_add.skillTeamNumber,
            skillTeamName:this.form_add.skillTeamName,
            checkedSkill:this.form_add.checkedSkill.length.toString(),
            status:this.form_add.status,
          }
          MainAjax.doPost(urlConfig.admin.saveOrUpdateSkillTeam,param).then(req =>{
            if(req.retCode==this.$constants.returnCode.success){
              if(req.reminder == '0'){
                  this.$message({ 
                      showClose: true,
                      message: '用户名已存在',
                      type: 'waring'
                  });  
              }else if(req.reminder == '1'){
                  this.$message({
                      showClose: true,
                      message: '证件号已存在',
                      type: 'waring'
                  });
              }else if(req.reminder == '2'){
                  this.$message({
                      showClose: true,
                      message: '已绑定操作员',
                      type: 'waring'
                  });
              }else{
                this.dialogShow = false;
                this.seatClassQuery();
                this.$emit('resultChange',{info:[
                  {
                      type: this.$constants.optionResultType.success,
                      content:"新增成功!",
                  }
                  ],flush:true});
              }       
            }else{
                this.$message({
                    showClose: true,
                    message: req.retMsg,
                    type: 'waring'
                }); 
            }
          });
        }
      })

      // this.dialogShow = false;
      // this.$message({
      //   showClose: true,
      //   message: '保存成功',
      //   type: 'success'
      // });
    },
     //修改保存
    changeSeat(formdata){
      console.log(this.checkTableData.id) 
      this.$refs[formdata].validate((val)=>{
        if(val){
          let param={
            id:this.checkTableData.id,
            skillTeamCode:this.form_add.skillTeamCode,
            skillTeamNumber:this.form_add.skillTeamNumber,
            skillTeamName:this.form_add.skillTeamName,
            checkedSkill:this.form_add.checkedSkill.length.toString(),
            status:this.form_add.status,
          }
          MainAjax.doPost(urlConfig.admin.saveOrUpdateSkillTeam,param).then(req =>{
            if(req.retCode==this.$constants.returnCode.success){
              if(req.reminder == '0'){
                  this.$message({ 
                      showClose: true,
                      message: '用户名已存在',
                      type: 'waring'
                  });  
              }else if(req.reminder == '1'){
                  this.$message({
                      showClose: true,
                      message: '证件号已存在',
                      type: 'waring'
                  });
              }else if(req.reminder == '2'){
                  this.$message({
                      showClose: true,
                      message: '已绑定操作员',
                      type: 'waring'
                  });
              }else{
                this.dialogShow = false;
                this.seatClassQuery();
                this.$emit('resultChange',{info:[
                  {
                      type: this.$constants.optionResultType.success,
                      content:"新修改成功!",
                  }
                  ],flush:true});
              }       
            }else{
                this.$message({
                    showClose: true,
                    message: req.retMsg,
                    type: 'waring'
                }); 
            }
          });
        }
      })

      // 
      // this.$message({
      //   showClose: true,
      //   message: '保存成功',
      //   type: 'success'
      // });
    },
    openfun(){
     // alert(1)
      
    },
    //关闭弹框
    dialogClose(){
      
      this.dialogShow = false;
    },
  },
  mounted(){
    this.seatClassQuery();
  },
}
</script>
<style scoped>

</style>
