<!--created by liuhui on 2019.08.30-->
<template>
  <div id="operaterInfoMaintain">
    <el-row>
      <!-- 查询条件开始 -->
      <el-col  class="custlist">
        <el-row class="custquery">
          <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
            <el-col :span="8">
                <el-form-item label="操作员号">
                    <el-input v-model="form.agentId" clearable  maxlength="10"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="绑定用户">
                    <el-input v-model="form.accCode" clearable maxlength="20"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="所属机构">
                    <el-input style="width:95%;" v-model="form.orgName" id="mechanismQuery" :data-value="form.orgIdValue" disabled></el-input>
                    <i style="width:3%;" class="el-icon-edit-outline" @click="mechanismQuery()"></i>
                </el-form-item>
            </el-col>
          </el-form>
          <el-col :span="24" class="but">
              <el-button type="primary" size="medium" plain @click="operatorListquery(1)">查询</el-button>
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
              <el-button type="primary" plain @click="relevantSkills">关联技能组合</el-button>
              <el-button type="primary" plain @click="MultRelevantSkills">批量关联技能组合</el-button>
          </el-col>
        </el-row>
        <TableLazyLoad :tableData='operatorList' :tableHeight="tableHeight" :pagesize ="pagesize"  :totalsizes="turnPageTotalNum" :hightlight ="true" @loadingMore="loadingMore" @handleSelectionChange="handleSelectionChange">
          <template v-slot:tableList>
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column  prop="agentId" label="操作员号"></el-table-column>
              <el-table-column prop="classsift" label="组别"></el-table-column>
              <el-table-column prop="accCode" label="绑定用户"></el-table-column>
              <el-table-column prop="accName" label="用户名"></el-table-column>
              <el-table-column prop="orgName" label="组织机构"></el-table-column>
              <el-table-column prop="status" label="状态" :formatter="formatStatus"></el-table-column>
          </template>
        </TableLazyLoad>
      </el-col>
      <!-- 查询列表结束 -->
      <!-- 机构弹窗开始 -->
      <Mechanism ref="mechanismChild" title="机构选择" :state.sync="state" @closedialog="closeMechanism" @checkedNodes="checkedNodes"></Mechanism>
      <!-- 机构弹窗结束 -->
    </el-row>
  </div>
</template>
<script>
  import Mechanism from '@/pages/components/Mechanism';
  import TableLazyLoad from "@/pages/demos/TableLazyLoad";
  import { mapActions } from 'vuex';
  export default {
    name:"operaterinfomaintain",
    components:{Mechanism,TableLazyLoad},
    data() {
      return {
        //列表model
        postUrl:urlConfig.admin.operatorInfo,
        params:{},
        reloadData:0,
        dialogShow:false,
        state:false,//机构树
        form:{
          agentId:"",
          accCode:"",
          orgName:"",
        },
        turnPageBeginPos:1,  //起始数
        operatorList: [],//列表数据      
        multipleSelection: [],//列表选中的数据
        turnPageTotalNum:0, //列表数据数量
        tableHeight:'500',  //表格高度
        pagesize:100,   //每页展示20条  
      }
    },
    methods: {
      //操作员状态格式化
      formatStatus(row){
        return Number(row.status) ? "有效" : "无效";;
      },
      //获取列表选中的数据
      handleSelectionChange(val) {
          this.multipleSelection = val;
      },
      //查询操作员列表
      operatorListquery(queryStart){
        this.turnPageBeginPos = queryStart==1 ? 1 : this.turnPageBeginPos+=100;
        let params = {
          agentId:this.form.agentId,
          accCode:this.form.accCode,
          orgName:this.form.orgName,
          turnPageBeginPos:this.turnPageBeginPos,
          turnPageShowNum:100
          }
        this.params = params;
        this.$MainAjax.doPost(this.postUrl,this.params).then(res=>{
          if(queryStart==2){  //点击查询按钮          
            this.operatorList = res&&res.agentList.length ? this.operatorList.concat(res.agentList):[];
          }else{
            document.querySelector('.infinite-scroll-table').querySelector('.el-table__body-wrapper').scrollTop = 0;
            this.operatorList = res&&res.agentList.length ? res.agentList:[];
          }
          this.turnPageTotalNum = Number(res.turnPageTotalNum);
        });
      }, 
      clearMultiOptions(){
        this.$refs.multipleTable.clearSelection();
      },
      pageChangedCallback(curPage){
        console.log(this.curPage,this.pageSize);     
      },
      sortChangeHandler(obj){
        console.log('sortChangeHandler',obj);
        if(obj.column.sortable!='custom'){return;}
        obj.prop;//属性名称
        obj.order;//排序内容 descending accending null
        this.csrAlert.warning("向服务器发送参数"+obj.prop+",排序方式："+obj.order);
      },
      //滚动加载更多数据
      loadingMore(){
        console.log("demo loading more....."); 
        if(this.operatorList.length < this.turnPageTotalNum){
          this.operatorListquery(2);
        }
      },
      orgModal(){
        this.dialogShow = true;
      },
      //关联技能组合
      relevantSkills(){
        //验证是否选择了一条数据
        if(this.multipleSelection.length!="1"){
          this.$message({
              showClose: true,
              message: '请选择一条数据！',
              type: 'warning'
          });
          return
        }
        //验证选中的操作员是否绑定用户
        if(!this.multipleSelection[0].accCode){
          this.$message({
              showClose: true,
              message: '请先绑定用户信息，再进行技能组合关联！',
              type: 'warning'
          });
          return
        }
        //跳转到关联技能组合页面  
          this.$router.push({
            path:'RelSkillGroup',
            query:{agentId:this.multipleSelection[0].agentId}
          })
      },
      //点击批量关联技能组合按钮
      MultRelevantSkills(){
        //验证是否选择多条数据
        if(this.multipleSelection.length<=1){
          this.$message({
              showClose: true,
              message: '请选择多条操作员数据！',
              type: 'warning'
          });
          return
        }
        //验证选中的操作员是否绑定用户
        let operatorList = [];
        this.multipleSelection.forEach(item=>{
          if(!item.accCode){
            operatorList.push(item.agentId)
          }
        })
        if(operatorList.length){
          this.$message({
              showClose: true,
              message: `操作员号${operatorList.join(",")}请先绑定用户信息，再进行技能组合关联`,
              type: 'warning'
          });
          return
        }
        let operatorNum = [];
        this.multipleSelection.forEach(item=>{
          operatorNum.push(item.agentId)
        })
        this.$router.push({
          path:'SkillGroup',
          query:[{btnIsShow:0},operatorNum]
        })
      },
      closeDialog(){
        this.dialogShow = false;
      },
      //打开机构树弹窗
      mechanismQuery(){
        this.state = true;
      },
      //获取选中的机构
      checkedNodes(data){
          console.log(data)
          if(this.dialogVisible==true){
              this.form_add.accorgId=data[0].cname;
              this.form_add.accorgIdValue=data[0].id;
          }else{
              this.mechanismList=data;
              this.form.accorgId=data[0].cname;
              this.form.accorgIdValue=data[0].id;
          }
      },
      //关闭机构弹框
      closeMechanism(data){
          this.state=data;
      },
    },
    created(){
      this.operatorListquery(1);
    },
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