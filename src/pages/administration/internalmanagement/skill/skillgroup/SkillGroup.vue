<!--created by liuhui on 2019.08.30-->
<template>
  <div id="skillGroup">
    <el-row>
      <!-- 查询条件开始 -->
      <el-col  class="custlist">
        <el-row class="custquery">
          <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
            <el-col :span="12">
                <el-form-item label="技能组合名称">
                    <el-input v-model="form.skillName" clearable maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="技能编码">
                    <el-input v-model="form.skillCode" clearable maxlength="20"></el-input>
                </el-form-item>
            </el-col>
          </el-form>
          <el-col :span="24" class="but">
              <el-button type="primary" size="medium" plain @click="skillGroupQuery()">查询</el-button>
          </el-col>
        </el-row>
      </el-col>
      <!-- 查询条件结束 -->
      <!-- 查询列表开始 -->
      <el-col  class="custlist">
        <el-row class="query_results">
          <el-col :span="3">
              <div >
                  <h2 class="querylist_style border">查询结果</h2>
              </div>
          </el-col>
          <el-col :span="21" class="query_results_but">
            <el-button type="primary" plain @click="multiAdd" v-show="!btnIsShow">批量增加</el-button>
            <el-button type="primary" plain @click="multiDel" v-show="!btnIsShow">批量删除</el-button>
            <el-button type="primary" plain @click="addSkillGroup()" v-show="btnIsShow">新增</el-button>
            <el-button type="primary" plain @click="changeSkillGroup()" v-show="btnIsShow">修改</el-button>
            <el-button type="primary" plain @click="deleteSkillGroup()" v-show="btnIsShow">删除</el-button>
            <el-button type="primary" plain @click="backSkillInfo()">返回</el-button>
          </el-col>
        </el-row>
        <queryResTable :pageSize="20" pagePosition="right" :url ='postUrl' :params="params" :pageSizes="[20]" @dataChanged="dataChangedCallback" height="300" ref="tableBox" :reloadData.sync="reloadData">
          <template v-slot:paginationContainer>
            <el-table ref="multipleTable" :data="skillTableData" tooltip-effect="dark" border stripe max-height="500"  @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column  prop="skillName" label="技能组合名称"></el-table-column>
                <el-table-column  prop="skillCode" label="技能编码"></el-table-column>
                <el-table-column prop="skillRemark" label="技能描述"></el-table-column>
                <el-table-column  prop="skillInfoId" label="技能号"></el-table-column>
                <el-table-column prop="skillStatus" label="状态" :formatter="formatStatus"></el-table-column>
            </el-table>
          </template>
        </queryResTable>
      </el-col>
      <!-- 查询列表结束 -->
      <!-- 新增修改弹窗开始 -->
      <el-dialog :title="title" :visible.sync="dialogShow" width="60%" @open="openDialog">
        <el-row>
          <el-form :model="form_add" label-width="140px" class="demo-ruleForm" ref="form_add" :rules="rules">
            <el-col :span="24">
                <el-form-item label="技能组合名称" prop="skillName">
                    <el-input v-model="form_add.skillName" clearable maxlength="20"></el-input>
                </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-table ref="staffTable" :data="staffList" tooltip-effect="dark"  border stripe max-height="500"  @selection-change="handleStaffChange" :row-key="getRowKey">
              <el-table-column type="selection" :reserve-selection="true" width="40"></el-table-column>
              <el-table-column show-overflow-tooltip prop="skillCode" label="技能编码"></el-table-column>
              <el-table-column show-overflow-tooltip prop="skillRemark" label="技能描述"></el-table-column>
              <el-table-column show-overflow-tooltip prop="skillStatus" label="技能状态"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="2" style="text-align:center">
            <el-button type="primary" @click="selectItems()" icon="icon el-icon-d-arrow-right" :disabled="!staffData.length" style="margin:80px 0 20px 0;"></el-button>
            <el-button type="primary" @click="cutItems()" icon="icon el-icon-d-arrow-left" :disabled="!selectedStaffData.length" style="margin-left:0;"></el-button>
          </el-col>
          <el-col :span="11">
            <el-table ref="selectedStaffTable" :data="selectedStaffList" tooltip-effect="dark"  border stripe max-height="500" @selection-change="handleSelectedStaffChange" :row-key="getRowKey">
              <el-table-column type="selection" :reserve-selection="true" width="40"></el-table-column>
              <el-table-column show-overflow-tooltip prop="skillCode" label="技能编码"></el-table-column>
              <el-table-column show-overflow-tooltip prop="skillRemark" label="技能描述"></el-table-column>
              <el-table-column show-overflow-tooltip prop="skillStatus" label="技能状态"></el-table-column>
              <el-table-column show-overflow-tooltip prop="skillInfoId" label="技能号"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:center;margin-top:20px;">
            <el-button type="primary" v-show="add" @click="newSkillGroupSub('form_add')">确认</el-button> 
            <el-button type="primary" v-show="change" @click="changeSkillGroupSub('form_add')">确认</el-button>
            <el-button type="primary" @click="dialogClose()">返回</el-button> 
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 新增修改弹窗结束 -->
    </el-row>
  </div>
</template>
<script>
  import queryResTable from '@/core/components/PaginationContainer'
  import { mapActions } from 'vuex';
  export default {
    name:"skillgroup",
    components:{queryResTable},
    data() {
      return {
        //列表model
        reloadData:0,
        pageSize:10,
        pagePosition:"",
        postUrl:urlConfig.admin.skillGroupQuery,
        params:{},
        title:"",
        add:false,   //增加弹窗确定按钮
        change:false, //修改弹窗确定按钮
        btnIsShow:false,//按钮显示
        dialogShow:false,
        staffList:[],   //左面的列表
        selectedStaffList:[],  //右面的列表
        staffData:[],    //左面选中的数据
        selectedStaffData:[],   //右面选中的数据
        form:{
          skillCode:"",
          skillRemark:""
        },
        form_add:{
          skillName:""
        },
        rules:{
          skillName:[{required:true,message:'请输入技能组名称',trigger:'blur'},{min:1,max:20,message:'最多输入20个字符',trigger:'blur'}],
        },
        skillTableData: [],//查询到的技能列表数据
        multipleSelection: [],//列表选中的数据
        operatorList:[]  //批量操作员号
      }
    },
    methods: {
      //获取列表选中的数据
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //新增修改弹框打开
      openDialog(){
          if(this.add){
          this.$nextTick(()=>{
            this.$refs.form_add.resetFields(); 
          })
        } 
      },
      //点击查询按钮
      skillGroupQuery(){
          let params = {
            skillCode:this.form.skillCode,
            skillName:this.form.skillName
          }
          //this.postUrl = urlConfig.admin.skillQuery;
          this.params = params;
          this.reloadData = 1;
      },
      //技能状态格式化
      formatStatus(row){
        return Number(row.skillStatus) ? "无效" : "有效";;
      },
      //将查询到数据写入到列表中
      dataChangedCallback(response){
        this.skillTableData = response&&response? response.skillSetsList:[];
        console.log(response);
      },
      //点击新增技能按钮
      addSkillGroup(){
        this.title = "新增技能组合信息";
        this.add = true;
        this.change =false;
        this.form_add.skillName = "";
        this.selectedStaffList = [];
        this.$MainAjax.doPost(urlConfig.admin.skillListQuery).then(res =>{
          this.staffList = res.data.skillList;
        })
        this.dialogShow = true;
      },
      //删除技能组
      deleteSkillGroup(){
        console.log("这是删除操作");
        if(!this.multipleSelection.length){
          this.$message({
              showClose: true,
              message: '请选择至少一条数据',
              type: 'warning'
          });
          return
        }
        let params=[];
        this.multipleSelection.forEach(item=>{
          params.push({skillBagId:item.skillBagId})
        })
        this.params = {bagIds:params};
        console.log(this.params);
        this.$MainAjax.doPost(urlConfig.admin.skillGroupDelete,this.params).then(res=>{
          console.log(res)
        });
      },
      //点击修改按钮
      changeSkillGroup(){
        if(this.multipleSelection.length!="1"){
          this.$message({
              showClose: true,
              message: '请选择一条数据',
              type: 'warning'
          });
          return
        }
        this.title = "修改技能组合信息";
        this.add = false;
        this.change = true;
        this.dialogShow = true;
        this.form_add.skillName = this.multipleSelection[0].skillName;
        //获取待关联技能和已关联的技能组
        let params = {
          skillBagId:this.multipleSelection[0].skillBagId,
          skillName:this.multipleSelection[0].skillName
        };
        this.params = params;
        this.$MainAjax.doPost(urlConfig.admin.skillGroupChange,this.params).then(res =>{
          console.log(res);
          this.staffList = res.data.skillList;  //左边的，待关联
          this.selectedStaffList = res.data.skillSetsList;  //右边的，已关联
        })
      },
      //获取row-key
      getRowKey(row){
        return row.skillInfoId;
      },
      renderFunc(){},
      handleChange(value,direction,movedKeys){
        if(direction === "right"){

        }if(direction === "left"){

        }
      },
      //修改技能组合信息后提交
      changeSkillGroupSub(){
        console.log("提交修改后的技能组合信息");
        let skillIds = [];
        this.selectedStaffList.forEach(item=>{
          skillIds.push({skillInfoId:item.skillInfoId})
        })
        let params = {
          skillName:this.form_add.skillName,
          skillBagId:this.multipleSelection[0].skillBagId,
          skillIds:skillIds
        }
        this.params = params;
        console.log(this.params);
        this.$MainAjax.doPost(urlConfig.admin.skillGroupUpdate,this.params).then(res=>{
          console.log(res)
        });
      },
      //新增技能组弹窗，点击确定
      newSkillGroupSub(){
        if(!this.form_add.skillName){
          this.$message({
          showClose: true,
          message: '技能组名称不能为空！',
          type: 'warning'
          });
          return;
        }
        if(this.selectedStaffList.length){
          var skillList = [];
          var param = {};
          for(let i=0;i<this.selectedStaffList.length;i++){
            param = {skillInfoId:this.selectedStaffList[i].skillInfoId};
            skillList.push(param);
          }
          let params = {
            skillName:this.form_add.skillName,
            skillIds:skillList
          }
          this.params = params;
          //console.log(params);
          this.$MainAjax.doPost(urlConfig.admin.skillGroupAdd,params).then(res =>{
            if(res.data.reminder=="1"){
              this.$message({
              showClose: true,
              message: '该技能组合名称已存在！',
              type: 'warning'
              });
            }else{
              let skillCodeGroup = [];
              this.params.skillIds.forEach(item=>{
                skillCodeGroup.push(item.skillInfoId)
              })
              this.$message({
              showClose: true,
              message: `新增技能组合：${skillCodeGroup.join(",")}（技能编码）成功`,
              type: 'success'
              });
            }
            this.dialogShow = false;
        })
        }else{
          this.$message({
            showClose: true,
            message: '请添加技能！',
            type: 'warning'
            });
        }
      },
      //将左边表格选择项存入staffData中
      handleStaffChange(rows){
        this.staffData = [];
        if(rows){
          // console.log(rows)
          rows.forEach((row,i) => {
            if(row){
              this.staffData.push(row);
            }
          })
        }
      },
      //将左边的数据加到右边
      selectItems(){
        console.log("左到右");
        setTimeout(()=>{
          this.$refs["staffTable"].clearSelection();
          this.$refs["selectedStaffTable"].clearSelection();
        },0)
        let repeat = false;
        this.selectedStaffList.forEach(item =>{
          if(this.staffData[0] && item.skillCode == this.staffData[0].skillCode){
            repeat = true;
            return;
          }
        })
        if(!repeat){
          this.staffData.forEach(item =>{
            this.selectedStaffList.push(item);
          })
          for(let i=0;i<this.staffList.length;i++){
            for(let j=0;j<this.staffData.length;j++){
              if(this.staffList[i]&&this.staffData[j]&&this.staffList[i].skillCode == this.staffData[j].skillCode){
                this.staffList.splice(i,1);
              }
            }
          }
        }
      },
      //将右边的数据存入selectedStaffData
      handleSelectedStaffChange(rows){
        this.selectedStaffData = [];
        if(rows){
          //console.log(rows)
          rows.forEach(row=>{
            if(row){
              this.selectedStaffData.push(row);
            }
          })
          console.log(this.selectedStaffData)
        }
      },
      //将右边的数据加到左边
      cutItems(){
        console.log("右到左");
        setTimeout(() => {
          this.$refs["staffTable"].clearSelection();
          this.$refs["selectedStaffTable"].clearSelection();
        }, 0);
          this.selectedStaffData.forEach(item => {
            this.staffList.push(item);
          });
          for (let i = 0; i < this.selectedStaffList.length; i++) {
            for (let j = 0; j < this.selectedStaffData.length; j++) {
              if (
                this.selectedStaffList[i] &&
                this.selectedStaffData[j] &&
                this.selectedStaffList[i].skillCode === this.selectedStaffData[j].skillCode
              ) {
                this.selectedStaffList.splice(i, 1);
              }
            }
          }
      },
      dialogClose(){
        this.dialogShow = false;
      },
      SkillGroupUpdate(){
        // console.log("技能组合信息维护");
        // this.$router.push({
        //   path:'Add'
        // })
      },
      backSkillInfo(){
        this.$router.go(-1);
      },
      //批量增加
      multiAdd(){
        if(!this.multipleSelection.length){
          this.$message({
              showClose: true,
              message: '请选择一条记录！',
              type: 'warning'
          });
          return
        }
        this.$confirm(`本次添加的技能组合涉及到${this.operatorList.length}个操作员，确认执行本次操作吗？`,'确认框',{
                    confirmButtonText:'确认',
                    cancelButtonText:"取消",
                    type:"warning",
                }).then(()=>{
                    let agentRelList = [];//操作员ID集合
                    this.operatorList.forEach(item=>{
                      agentRelList.push({agentId:item});
                    })
                    let skillSets = [];//技能组合ID集合
                    this.multipleSelection.forEach(item=>{
                      skillSets.push({skillSetsId:item.skillBagId})
                    });
                    let param={ agentRelList,skillSets };
                    console.log(param);
                    this.$MainAjax.doPost(urlConfig.admin.multiOperatorRelSkill,param).then(res =>{
                        // if(req.retCode==this.$constants.returnCode.success){    
                             
                        // }
                        console.log(res);
                    });
                })

      },
      //批量删除
      multiDel(){
        if(!this.multipleSelection.length){
          this.$message({
              showClose: true,
              message: '请选择一条记录！',
              type: 'warning'
          });
          return
        }
        let agentRelList = [];//操作员ID集合
        this.operatorList.forEach(item=>{
          agentRelList.push({agentId:item});
        })
        let skillSets = [];//技能组合ID集合
        this.multipleSelection.forEach(item=>{
          skillSets.push({skillSetsId:item.skillBagId})
        });
        let skillGroupList = [];
        skillSets.forEach(item=>{
          skillGroupList.push(item.skillSetsId)
        });
        this.$confirm(`已勾选技能组合信息：${skillGroupList.join(",")}，本次添加的技能组合涉及到${this.operatorList.length}个操作员，确认执行本次操作吗？`,'确认框',{
                    confirmButtonText:'确认',
                    cancelButtonText:"取消",
                    type:"warning",
                }).then(()=>{
                    let param={ agentRelList,skillSets };
                    this.$MainAjax.doPost(urlConfig.admin.multiCancelRelSkill,param).then(res =>{
                        // if(req.retCode==this.$constants.returnCode.success){    
                             
                        // }
                        console.log(res)
                    });
                })
      },
    },
    created(){
      this.btnIsShow = this.$route.query[0].btnIsShow;
      this.operatorList = this.$route.query[1];
    },
    mounted(){
      this.skillGroupQuery();
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