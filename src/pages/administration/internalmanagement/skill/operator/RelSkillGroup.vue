<!--created by liuhui on 2019.10.10-->
<template>
  <div id="relSkillGroup">
    <el-row>
      <!-- 查询列表开始 -->
      <el-col class="custlist">
        <el-row class="custquery">
          <el-form :model="form" label-width="150px" class="demo-ruleForm" size="small" align="left">
            <el-col :span="7">
                <el-form-item label="技能组合生效时间">
                  <el-radio-group v-model="effectTime" @change="getEffectTime">
                    <el-radio :label="1">实时生效</el-radio>
                    <el-radio :label="2">预约生效时间</el-radio>
                  </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="7" v-show="effectTimeShow">
                <el-form-item label="选择生效时间">
                    <el-date-picker v-model="orderEffectTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-row class="query_results">
          <el-col :span="3">
              <div >
                  <h2 class="querylist_style border">查询结果</h2>
              </div>
          </el-col>
          <el-col :span="21" class="query_results_but">
              <el-button type="primary" plain @click="addSkillGroup()">增加技能组合</el-button>
              <el-button type="primary" plain @click="skillGroupSub()">保存</el-button>
              <el-button type="primary" plain @click="backSkillInfo()">返回</el-button>
          </el-col>
        </el-row>
        <queryResTable :pageSize="20" pagePosition="right" :url ='postUrl' :params="params" :pageSizes="[20]" @dataChanged="dataChangedCallback" height="300" ref="tableBox" :reloadData.sync="reloadData">
          <template v-slot:paginationContainer>
            <el-table ref="multipleTable" :data="skillTableData"  tooltip-effect="dark" height="300" :header-cell-style="{background:'#f0f9eb',border:'2px solid inherit'}" border @selection-change="handleSelectionChange">
                <el-table-column :label="'操作员号'+operatorId.agentId+'已关联技能组合列表'" align="center">
                  <el-table-column type="selection" width="40"></el-table-column>
                  <el-table-column  prop="skillSetsName" label="技能组合名称"></el-table-column>
                  <el-table-column  prop="skillCode" label="技能编码"></el-table-column>
                  <el-table-column prop="skillRemark" label="技能描述"></el-table-column>
                  <el-table-column  prop="skillId" label="技能号"></el-table-column>
                  <el-table-column prop="skillStatus" label="状态" :formatter="formatStatus"></el-table-column>
                </el-table-column>
            </el-table>
          </template>
        </queryResTable>
      </el-col>
      <!-- 查询列表结束 -->
      <!-- 新增修改弹窗开始 -->
      <el-dialog :title="'技能组合信息列表'" :visible.sync="dialogShow" width="60%" @open="openDialog">
        <el-row class="query_results">
          <el-col :span="3">
              <div >
                  <h2 class="querylist_style border">查询结果</h2>
              </div>
          </el-col>
          <el-col :span="21" class="query_results_but">
              <el-button type="primary" plain @click="operatorAddSkill()">确定</el-button>
              <el-button type="primary" plain @click="closeDialog()">返回</el-button>
          </el-col>
        </el-row>
        <queryResTable :pageSize="20" pagePosition="right">
          <template v-slot:paginationContainer>
            <el-table ref="multipleTable" :data="newSkillTableData"  tooltip-effect="dark" height="300" :header-cell-style="{background:'#f0f9eb',border:'2px solid inherit'}" border @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column  prop="skillSetsName" label="技能组合名称"></el-table-column>
                <el-table-column  prop="skillCode" label="技能编码"></el-table-column>
                <el-table-column prop="skillRemark" label="技能描述"></el-table-column>
                <el-table-column  prop="skillId" label="技能号"></el-table-column>
                <el-table-column prop="skillStatus" label="状态" :formatter="formatStatus"></el-table-column>
            </el-table>
          </template>
        </queryResTable>
      </el-dialog>
      <!-- 新增修改弹窗结束 -->
    </el-row>
  </div>
</template>
<script>
  import queryResTable from '@/core/components/PaginationContainer'
  import { mapActions } from 'vuex';
  export default {
    name:"relSkillGroup",
    components:{queryResTable},
    data() {
      return {
        //列表model
        reloadData:0,
        pageSize:10,
        pagePosition:"",
        postUrl:urlConfig.admin.operatorRelSkill,
        postUrlUnrelSkill:urlConfig.admin.unrelSkill,
        params:{},
        dialogShow:false,
        form:{
          skillCode:"",
          skillRemark:""
        },
        rules:{
          skillName:[{required:true,message:'请输入技能组名称',trigger:'blur'},{min:1,max:20,message:'最多输入20个字符',trigger:'blur'}],
        },
        newSkillTableData: [], //添加新技能组合弹窗绑定的数据
        skillTableData: [],//查询到的技能列表数据
        multipleSelection: [],//列表选中的数据
        resultData:[],
        operatorId:{},
        effectTime:1,   //生效时间
        orderEffectTime:"",  //预约生效时间
        effectTimeShow:false  //预约生效时间的日期控件
      }
    },
    methods: {
      //获取列表选中的数据
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //技能组合生效时间
      getEffectTime(){
        this.effectTimeShow = this.effectTime==1 ? false : true;
      },
      //新增修改弹框打开
      openDialog(){
          
      },
      //技能状态格式化
      formatStatus(row){
        let skillStatus = Number(row.skillStatus) ? "无效" : "有效";
        return skillStatus;
      },
      //查询数据
      operatorQuery(){
        this.params = this.operatorId;
        this.reloadData = 1;
      },
      //将查询到数据写入到列表中,操作员已关联技能组合列表
      dataChangedCallback(response){
        this.skillTableData = response&&response? response.relSkillList:[];
        //console.log(response)
        if(this.skillTableData.length){
          this.$nextTick(()=>{
          for(let i=0;i<this.skillTableData.length;i++){
            this.$refs.multipleTable.toggleRowSelection(this.skillTableData[i]);
            }
          })
        }
      },
      //点击新增技能按钮
      addSkillGroup(){
        this.dialogShow = true;
        this.params = {agentId:this.operatorId.agentId,turnPageBeginPos:1,turnPageShowNum:20};
        this.reloadData = 1;
        this.$MainAjax.doPost(this.postUrlUnrelSkill,this.params).then(res=>{
          console.log(res);
          this.newSkillTableData = res&&res.data? res.data.skillList:[];
        });
      },
      //操作员新增加技能组合,点击保存
      operatorAddSkill(){
        let skillList = [];
        this.multipleSelection.forEach(item=>{
          skillList.push({skillSetsId:item.skillSetsId});
        });
        let params = { agentId:this.operatorId.agentId,skillSets:skillList}
        //console.log(params);
        this.$MainAjax.doPost(urlConfig.admin.relSkillGroup,params).then(res=>{
          console.log(res);
        });
      },
      //点击保存按钮
      skillGroupSub(){
        let unbundList = [];
        this.skillTableData.filter( i => !this.multipleSelection.includes(i)).forEach(item=>{
          unbundList.push({skillRelId:item.skillRelId})
        })
        let params = {
          agentId:this.operatorId.agentId,
          unbundList
        }
        this.params = params;
        console.log(params);
        this.$MainAjax.doPost(urlConfig.admin.cancelRelSkill,this.params).then(res=>{
          console.log(res)
        }
        );
        this.operatorQuery();
      },
      backSkillInfo(){
        this.$router.go(-1);
      },
      //弹窗，点击返回，关闭弹窗
      closeDialog(){
        this.dialogShow = false;
      },
    },
    created(){
      this.operatorId = this.$route.query;
    },
    mounted() {
      this.operatorQuery();
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