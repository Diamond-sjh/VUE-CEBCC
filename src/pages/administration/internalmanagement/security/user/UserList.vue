<!-- 用户管理 -->
<template>
    <div class="admin-user-lst">
        <el-row>
            <!-- 查询条件 -->
            <el-col>
                <el-row class="custquery">
                    <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
                        <el-col :span="8">
                            <el-form-item label="用户名">
                                <el-input v-model="form.acccode" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="姓名">
                                <el-input v-model="form.accname" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="操作员号">
                                <el-input v-model="form.accagentId" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="证件号">
                                <el-input v-model="form.accIdcardno" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="性别">
                                <el-select v-model="form.accsex" style="width:100%" placeholder="请选择性别" clearable>
                                    <el-option label="男" value="1"></el-option>
                                    <el-option label="女" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="角色名称">
                                <el-input v-model="form.rolename" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所属机构">
                                <el-input style="width:95%;" v-model="form.accorgId" id="mechanismquery" :data-value="form.accorgIdValue" disabled="disabled"></el-input>
                                <i style="width:3%;" class="el-icon-edit-outline" @click="mechanismqueryForm()"></i>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="行政级别">
                                <el-input style="width:95%;" v-model="form.dutyinfoId" :data-value="form.dutyinfoIdValue" disabled="disabled"></el-input>
                                <i style="width:3%;" @click="adminiZtreeForm()" class="el-icon-edit-outline"></i>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="技能组">
                                <el-select v-model="form.accskillTeam" style="width:100%" @click.native="skillsGroup()" placeholder="请选择技能组" clearable>
                                    <el-option :label="item.skillteamname" :value="item.skillteaminfoId" v-for="item in dialogSkillsGroup" :key='item.skillteaminfoId'></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="星级">
                                <el-select v-model="form.agentstarlevel" style="width:100%" placeholder="请选择星级" clearable>
                                    <el-option label="一级" value="shanghai"></el-option>
                                    <el-option label="二级" value="beijing"></el-option>
                                    <el-option label="三级" value="beijing"></el-option>
                                    <el-option label="四级" value="beijing"></el-option>
                                </el-select>
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
                    <!-- <el-col :span="24" class="but">
                        <el-button type="success" size="medium" plain @click="userListQuery()">查询</el-button>
                    </el-col> -->
                </el-row>
            </el-col>
            <!-- 查询列表 -->
            <el-col>
                <h2 class="querylist_style border">查询结果</h2>
                <!-- <el-row class="query_results">
                    <el-col :span="21" class="query_results_but"> -->
                        <!-- <el-button type="success" plain size="small" @click="adminstrationadd1()">新增跳转页面</el-button> -->
                        <!-- <el-button type="success" plain size="small" @click="userAdd()">新增</el-button>
                        <el-button type="success" plain size="small" @click="userChange()">修改</el-button>
                        <el-button type="success" plain size="small" @click="userMove()">删除</el-button>
                        <el-button type="success" plain size="small" @click="passwordremove()">密码重置</el-button>
                        <el-button type="success" plain size="small" @click="accagent()">绑定操作员</el-button>
                        <el-button type="success" plain size="small" @click="accagentRemove()">取消绑定</el-button> -->
                        <!-- <el-button type="success" plain size="small" >授权</el-button>
                        <el-button type="success" plain size="small" >批量修改</el-button>
                        <el-button type="success" plai
                        n size="small" >导入用户</el-button>  -->
                    <!-- </el-col>
                </el-row> -->
                <CsrTableBox :pageSize="20" pagePosition="right" :url ='postUrl' :params="params" :pageSizes="[20]"  
                    @dataChanged="dataChangedCallback" :reloadData.sync="reloadData">
                    <template v-slot:paginationContainer>
                        <el-table ref="multipleTable" :data="userTableData"  tooltip-effect="dark"  border stripe max-height="500"  @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="40"></el-table-column>
                            <el-table-column  prop="acccode" label="用户名" width=""></el-table-column>
                            <el-table-column prop="accname" label="姓名" width="120"></el-table-column>
                            <el-table-column prop="accagentId" label="操作员" ></el-table-column>
                            <el-table-column prop="accIdcardno" label="证件号" width="200"></el-table-column>
                            <el-table-column prop="accsex" label="性别" width="70"></el-table-column>
                            <el-table-column prop="accorgId" label="所属机构" width="160"></el-table-column>
                            <el-table-column prop="dutyinfoId" label="行政级别" width="150"></el-table-column>
                            <el-table-column prop="accskillTeam" label="技能组" width=""></el-table-column>
                            <el-table-column prop="rolename" label="角色" width="100">
                                <template slot-scope="scope">
                                    <span  class="text-ellipsis">{{scope.row.rolename}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="agentstarlevel" label="星级" width=""></el-table-column>
                            <el-table-column prop="status" label="状态" width="70"></el-table-column>
                            <el-table-column prop="accregdate" label="入行日期" width=""></el-table-column>
                        </el-table>
                    </template>
                </CsrTableBox>
            </el-col>
            
            <!-- 新增修改弹框 -->
            <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" @open="openFun" @close="addcloseDialog">
                <el-row>
                    <el-form :model="form_add" :rules="rules" ref="form_add" label-width="120px" class="demo-ruleForm">
                        <el-col :span="11">
                            <el-form-item label="用户名" prop="acccode">
                                <el-input v-model="form_add.acccode" placeholder="请输入用户名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="姓名" prop="accname">
                                <el-input v-model="form_add.accname" placeholder="请输入姓名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="证件号" prop="accIdcardno">
                                <el-input v-model="form_add.accIdcardno" @change="accIdcardnofun" placeholder="请输入证件号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" v-show="addorchange==='add'">
                            <el-form-item label="是否绑定操作员" prop="agent">
                                <el-radio v-model="form_add.agent" label="1">是</el-radio>
                                <el-radio v-model="form_add.agent" label="0">否</el-radio>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="状态"  prop="status">
                                <el-select v-model="form_add.status" style="width:100%" placeholder="请选择状态">
                                    <el-option label="有效" value="1"></el-option>
                                    <el-option label="无效" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="性别" prop="accsex">
                                <el-select v-model="form_add.accsex" style="width:100%" placeholder="请选择性别" disabled="disabled">
                                    <el-option label="男" value="1"></el-option>
                                    <el-option label="女" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="入行日期" prop="accregdate">
                                <el-date-picker v-model="form_add.accregdate" type="date" placeholder="选择日期" value-format="yyyy/MM/dd" style="width:100%">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="所属机构" prop="accorgId">
                                <el-input  style="width:95%;" v-model="form_add.accorgId" :data-value="form_add.accorgIdValue" disabled="disabled" placeholder="请选择所属机构"></el-input>
                                <i style="width:3%;" @click="mechanismqueryAdd()" class="el-icon-edit-outline"></i>
                            </el-form-item>
                            
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="行政级别" prop="dutyinfoId">
                                <el-input style="width:95%;" v-model="form_add.dutyinfoId" :data-value="form_add.dutyinfoIdValue" disabled="disabled" placeholder="请选择行政级别"></el-input>
                                <i style="width:3%;" @click="adminiZtreeFormAdd()" class="el-icon-edit-outline"></i>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="座席分类" prop="accskillTeam">
                                <el-select v-model="form_add.accskillTeam" style="width:100%" placeholder="请选择座席分类">
                                    <el-option label="双技能" value="01"></el-option>
                                    <el-option label="信用卡" value="02"></el-option>
                                    <el-option label="综合座席组" value="03"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="星级" prop="agentstarlevel">
                                <el-select v-model="form_add.agentstarlevel" style="width:100%" placeholder="请选择星级">
                                    <el-option label="一级" value="1"></el-option>
                                    <el-option label="二级" value="2"></el-option>
                                    <el-option label="三级" value="3"></el-option>
                                    <el-option label="四级" value="4"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="归属地" prop="accattribution">
                                <el-select v-model="form_add.accattribution" style="width:100%" placeholder="请选择归属地">
                                    <el-option label="上海" value="shanghai"></el-option>
                                    <el-option label="北京" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="花名" maxlength="8" prop="accrosename">
                                <el-input v-model="form_add.accrosename" placeholder="请输入花名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="满意度" prop="accsatisfaction">
                                <el-input v-model="form_add.accsatisfaction" maxlength="40" placeholder="请输入满意度"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="标签" maxlength="16" prop="acclabel">
                                <el-input v-model="form_add.acclabel" placeholder="请输入标签"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="个性签名" prop="accsign">
                                <el-input v-model="form_add.accsign" maxlength="20" placeholder="请输入个性签名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" v-show="addorchange==='add'">  
                            <el-form-item label="连续录入" class="text-left" prop="continue">
                                <el-radio v-model="form_add.continue" label="1">是</el-radio>
                                <el-radio v-model="form_add.continue" label="2">否</el-radio>
                            </el-form-item>
                        </el-col>   
                    </el-form>
                </el-row>
                <el-row>
                    <el-col :span="24" style="text-align:center;">
                        <el-button @click="dialogVisible = false">关闭</el-button>
                        <el-button v-show="addorchange==='add'" type="success" @click="adminaddSub('form_add')">确定</el-button> 
                        <el-button v-show="addorchange==='change'" type="success" @click="adminchangeSub('form_add')">确定</el-button> 
                    </el-col>
                </el-row>
            </el-dialog>
            <!-- 机构弹框 -->
            <Mechanism ref="mechanismChild" title="机构选择" :checkeddata="checkeddata" :state.sync="state" @checkedNodes="checkedNodes"></Mechanism>
            <!-- 行政级别弹框 -->
            <AdministrativeLevel  title="选择行政级别" :checkeddata="checkeddata" :AdminiLevelState.sync="AdminiLevelState" @adminiLevelcheckedNodes="adminiLevelcheckedNodes"></AdministrativeLevel>
            <!-- 授权弹框 -->
            <el-dialog title="授权" :visible.sync="dialogEmpower" width="500px" >
                <el-row>
                    <el-col :span="8" style="height:500px;overflow:auto;">
                        <el-tree :data="roleTree" ref="tree" disabled='true'  node-key="id" :default-expanded-keys="[0]" :default-checked-keys="checked_kys" :expand-on-click-node="false" :props="defaultProps" show-checkbox @check-change="getCheckedNodes">
                        </el-tree>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" style="text-align:center;">
                        <el-button type="primary" plain size="small" @click="EmpowerSub()">确定</el-button> 
                    </el-col>
                </el-row>
            </el-dialog>
        </el-row>
    </div>
</template>
<script>
    import MainAjax from "@/core/utils/MainAjax";
    import CsrTableBox from '@/core/components/PaginationContainer'
    import Mechanism from '@/pages/components/Mechanism'
    import AdministrativeLevel from '@/pages/components/AdministrativeLevelTree'
    import InfiniteList from '@/core/components/InfiniteList'
    import {getSexByCrtNo} from '@/core/utils/GlobalMethods'
    import { mapActions } from 'vuex';
    import { nextTick } from 'q';
    export default {
        name:"userlist",
        components:{CsrTableBox,Mechanism,AdministrativeLevel,InfiniteList},
        data() {
            return {
                checkeddata:[],
                //新增修改弹框
                reloadData:0,
                addorchange:"",//新增或修改标示
                title:"",//弹框title
                dialogVisible: false,//是否显示弹框
                form_add:{//新增修改model
                    acccode:"",//用户名
                    accname:"",//姓名
                    accIdcardno:"",//证件号
                    agent:"1",//是否绑定操作员
                    status:"1",//状态
                    accsex:"",//性别
                    accregdate:"",//入行日期
                    accorgId:"",//机构name
                    accorgIdValue:"",//机构id
                    dutyinfoId:"",//行政级别name
                    dutyinfoIdValue:"",//行政级别id
                    accskillTeam:"",//座席分类
                    agentstarlevel:"",//星级
                    accattribution:"",//归属地
                    accrosename:"",//花名
                    accsatisfaction:"",//满意度
                    acclabel:"",//标签
                    accsign:"",//个性签名
                    continue:"2" //  连续录入 
                },
                rules:{
                    acccode:[{required:true,message:'请输入角色名称',trigger:'blur'},{min:1,max:20,message:'最多输入20个字符',trigger:'blur'}],
                    accname:[{required:true,message:'请输入姓名',trigger:'blur'},{min:1,max:20,message:'最多输入20个字符',trigger:'blur'}],
                    accIdcardno:[{required:true,message:'请输入证件号',trigger:'blur'},{min:18,max:18,message:'最多输入18个字符',trigger:'blur'}],
                    status:[{required:true,message:'请输入状态',trigger:'change'},],
                    accsex:[{required:true,message:'请输入性别',trigger:'change'},],
                    accorgId:[{required:true,message:'请输入所属机构',trigger:'change'},],
                    dutyinfoId:[{required:true,message:'请输入行政级别',trigger:'change'},],
                    accskillTeam:[{required:true,message:'请输入坐席分类',trigger:'change'},],
                },
                //列表数据
                postUrl:urlConfig.admin.queryUser,//table列表ur
                params:{},
                form:{//列表model
                    acccode:"",
                    accname:"",
                    accagentId:"",
                    accIdcardno:"",
                    rolename:"",
                    accsex:"",
                    accorgId:"",
                    accorgIdValue:"",//机构id
                    dutyinfoId:"",
                    dutyinfoIdValue:"",//行政级别id
                    accskillTeam:"",
                    agentstarlevel:"",
                    status:"1",
                },
                form_admin:"",
                dialogSkillsGroup:[],//技能组
                userTableData: [],//用户列表数据
                multipleSelection: [],//列表选中的数据

                //所属机构
                state:false,
                mechanismList:[],
                //行政级别
                AdminiLevelState:false,
                AdministrativeLevelList:[],   
                //授权
                dialogEmpower:false,
                roleTree:[],
                checked_kys:[],//
                roleChecked_all:[],//获取选中的数据
                defaultProps:{
                    children: 'children',
                    label: 'cname',
                },
                
            }
        },
        methods: {
            //获取列表选中的数据
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //查询列表
            userListQuery(){
                let params={
                    acccode:this.form.acccode,
                    accname:this.form.accname,
                    accagentId:this.form.accagentId,
                    accIdcardno:this.form.accIdcardno,
                    rolename:this.form.rolename,
                    accsex:this.form.accsex,
                    accorgId:this.form.accorgIdValue,
                    dutyinfoId:this.form.dutyinfoIdValue,
                    accskillTeam:this.form.accskillTeam,
                    agentstarlevel:this.form.agentstarlevel,
                    status:this.form.status,
                }
                this.params=params;
                this.reloadData =1;
            },
            //获取用户列表接口返回的数据
            dataChangedCallback(response){
                this.userTableData = response&&response? response.accquerylist:[];
            },
            //新增跳转页面
            adminstrationadd1(){
                this.$router.push({
                    path:'Add' 
                })
            },
            //新增弹框
            userAdd(){
                this.addorchange="add";
                this.title="新增";
                this.dialogVisible = true;  
                //this.form_add.accname="";         
            },
            //很据身份证验证男女
            accIdcardnofun(){
                let sex = getSexByCrtNo(this.form_add.accIdcardno);
                if(sex=="男"){
                    this.form_add.accsex ='1'
                }else if(sex=="女"){
                    this.form_add.accsex ='0'
                }    
            },
            
            //新增保存按钮
            adminaddSub(formdata){
                this.$refs[formdata].validate((val)=>{
                    if(val){
                        let param={
                            acccode:this.form_add.acccode,
                            accname:this.form_add.accname,
                            accIdcardno:this.form_add.accIdcardno,
                            agent:this.form_add.agent,//是否绑定操作员
                            status:this.form_add.status,
                            accsex:this.form_add.accsex,
                            accregdate:this.form_add.accregdate,
                            accorgId:this.form_add.accorgIdValue,
                            dutyinfoId:this.form_add.dutyinfoIdValue,
                            accskillTeam:this.form_add.accskillTeam,
                            agentstarlevel:this.form_add.agentstarlevel,
                            accattribution:this.form_add.accattribution,
                            accrosename:this.form_add.accrosename,
                            accsatisfaction:this.form_add.accsatisfaction,
                            acclabel:this.form_add.acclabel,
                            accsign:this.form_add.accsign,
                        }
                        MainAjax.doPost(urlConfig.admin.addUser,param).then(req =>{
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
                                    if(this.form_add.continue!='1'){
                                        this.$emit('resultChange',{info:[
                                        {
                                            type: this.$constants.optionResultType.success,
                                            content:"新增成功!",
                                        }
                                        ],flush:true});
                                        this.dialogVisible = false;
                                    }else{
                                        this.$message({
                                            showClose: true,
                                            message: '新增成功',
                                            type: 'success'
                                        });
                                    }   
                                    this.userListQuery(); 
                                }       
                            }else{
                                this.$message({
                                    showClose: true,
                                    message: req.retMsg,
                                    type: 'waring'
                                }); 
                            }
                        });
                    }else{
                        return false;
                    }
                    
                })
            },
            //修改弹框
            userChange(){
                if(this.multipleSelection.length!="1"){
                    this.$message({
                        showClose: true,
                        message: '请选择一条数据',
                        type: 'warning'
                    });
                    return
                }
                if(this.multipleSelection[0].status=='0'){//status=="0"
                    this.$confirm('该用户状态为无效，是否继续修改？','确认框',{
                        confirmButtonText:'确认',
                        cancelButtonText:"取消",
                        type:"warrning",
                    }).then(()=>{
                        this.addorchange="change";
                        this.title="修改";
                        this.userDetail();
                        this.dialogVisible = true; 
                    }).catch(()=>{
                        this.$message({
                            showClose: true,
                            message: '已取消修改',
                            type: 'info'
                        });
                    }) 
                }else{
                    this.addorchange="change";
                    this.title="修改";
                    this.userDetail();
                    this.dialogVisible = true; 
                }     
            },
            //详情
            userDetail(){
                let param={
                    accinfoId:this.multipleSelection[0].accinfoId
                }
                MainAjax.doPost(urlConfig.admin.userSaveUser,param).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        this.form_add.acccode=req.acccode,//用户名
                        this.form_add.accname=req.accname,//姓名
                        this.form_add.accIdcardno=req.accIdcardno,//证件号
                        this.form_add.agent=req.agent,//是否绑定操作员
                        this.form_add.status=req.status,//状态
                        this.form_add.accsex=req.accsex,//性别
                        this.form_add.accregdate=req.accregdate,//入行日期
                        this.form_add.accorgId=req.orgname,//机构name
                        this.form_add.accorgIdValue=req.accorgId,//机构id
                        this.form_add.dutyinfoId=req.dutyname,//行政级别name
                        this.form_add.dutyinfoIdValue=req.dutyinfoId,//行政级别id
                        this.form_add.accskillTeam=req.accskillTeam,//座席分类
                        this.form_add.agentstarlevel=req.agentstarlevel,//星级
                        this.form_add.accattribution=req.accattribution,//归属地
                        this.form_add.accrosename=req.accrosename,//花名
                        this.form_add.accsatisfaction=req.accsatisfaction,//满意度
                        this.form_add.acclabel=req.acclabel,//标签
                        this.form_add.accsign=req.accsign//个性签名   
                    }else{
                        this.$message({
                            showClose: true,
                            message: req.retMsg,
                            type: 'waring'
                        }); 
                    }
                });
            },
            //修改保存按钮
            adminchangeSub(formdata){
                this.$refs[formdata].validate((val)=>{
                    if(val){
                        let param={
                            accinfoId:this.multipleSelection[0].accinfoId,
                            acccode:this.form_add.acccode,
                            accname:this.form_add.accname,
                            accIdcardno:this.form_add.accIdcardno,
                            agent:this.form_add.agent,
                            status:this.form_add.status,
                            accsex:this.form_add.accsex,
                            accregdate:this.form_add.accregdate,
                            accorgId:this.form_add.accorgIdValue,
                            dutyinfoId:this.form_add.dutyinfoIdValue,
                            accskillTeam:this.form_add.accskillTeam,
                            agentstarlevel:this.form_add.agentstarlevel,
                            accattribution:this.form_add.accattribution,
                            accrosename:this.form_add.accrosename,
                            accsatisfaction:this.form_add.accsatisfaction,
                            acclabel:this.form_add.acclabel,
                            accsign:this.form_add.accsign,
                        }
                        MainAjax.doPost(urlConfig.admin.updateUser,param).then(req =>{
                            if(req.retCode==this.$constants.returnCode.success){
                                if(req.reminder=='0'){
                                    this.$message({
                                        showClose: true,
                                        message: '用户名已存在',
                                        type: 'waring'
                                    });
                                }else if(req.reminder=='1'){
                                    this.$message({
                                        showClose: true,
                                        message: '证件号已存在',
                                        type: 'waring'
                                    });
                                }else{
                                    this.$emit('resultChange',{info:[
                                        {
                                            type: this.$constants.optionResultType.success,
                                            content:"修改成功!",
                                        }
                                    ],flush:true});
                                    this.dialogVisible = false;
                                    this.userListQuery();
                                }    
                            }else{
                            this.$message({
                                    showClose: true,
                                    message: req.retMsg,
                                    type: 'waring'
                                }); 
                            }
                        });
                    }else{
                        return false;
                    }
                })
                
            },
            //新增修改弹框关闭
            addcloseDialog(){
                // this.$nextTick(()=>{
                //     this.$refs.form_add.resetFields(); 
                // })
                
            },
            openFun(){
                this.$nextTick(()=>{
                    this.$refs.form_add.resetFields(); 
                    this.form_add.accorgIdValue="";
                    this.form_add.dutyinfoIdValue="";
                })
            },
            //删除
            userMove(){
                if(this.multipleSelection.length!="1"){
                    this.$message({
                        showClose: true,
                        message: '请选择一条数据',
                        type: 'warning'
                    });
                    return
                }
                if(this.multipleSelection[0].status=="0"){
                    this.$message({
                        showClose: true,
                        message: '角色状态已经为无效，无需删除',
                        type: 'warning'
                    });
                    return;
                }
                this.$confirm('是否确认删除','确认框',{
                    confirmButtonText:'确认',
                    cancelButtonText:"取消",
                    type:"warrning",
                }).then(()=>{
                    let param={
                        accinfoId:this.multipleSelection[0].accinfoId
                    }
                    MainAjax.doPost(urlConfig.admin.deleteUser,param).then(req =>{
                        if(req.retCode==this.$constants.returnCode.success){    
                            if(req.reminder=="0"){
                                this.$emit('resultChange',{info:[
                                    {
                                        type: this.$constants.optionResultType.error,
                                        content:"请先取消绑定操作员再继续操作!",
                                    }
                                ],flush:true});
                            }else{
                                this.$emit('resultChange',{info:{
                                    type: this.$constants.optionResultType.success,
                                    content:"用户删除成功",
                                },flush:true});
                                this.userListQuery();
                            }    
                        }
                    });
                }).catch(()=>{
                    this.$message({
                        showClose: true,
                        message: '已取消删除',
                        type: 'info'
                    });

                })        
            },
            //密码重置
            passwordremove(){
                if(this.multipleSelection.length!="1"){
                    this.$message({
                        showClose: true,
                        message: '请选择一条数据',
                        type: 'warning'
                    });
                    return
                }
                this.$confirm('是否确认密码重置','确认框',{
                    confirmButtonText:'确认',
                    cancelButtonText:"取消",
                    type:"warrning",
                }).then(()=>{
                    let param={
                        accinfoId:this.multipleSelection[0].accinfoId
                    }
                    MainAjax.doPost(urlConfig.admin.resetUserPwd,param).then(req =>{
                        if(req.retCode==this.$constants.returnCode.success){
                            this.$message({
                                showClose: true,
                                message: '密码重置成功',
                                type: 'success'
                            });
                            this.userListQuery();
                        }else{
                            this.$message({
                                showClose: true,
                                message:req.retMsg,
                                type: 'warning'
                            });
                        }

                    });
                }).catch(()=>{
                    this.$message({
                        showClose: true,
                        message: '已取消重置',
                        type: 'info'
                    });
                })
                
            },
            //绑定操作员弹框
            accagent(){
                if(this.multipleSelection.length!='1'){
                    this.$message({
                        showClose: true,
                        message: '请选择一条数据',
                        type: 'warning'
                    });
                    return
                }
                let param={
                    accinfoId:this.multipleSelection[0].accinfoId,
                }
                MainAjax.doPost(urlConfig.admin.userSavebingAgent,param).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        this.$message({
                            showClose: true,
                            message: '绑定成功',
                            type: 'success'
                        });
                        this.userListQuery();
                    }else{
                        this.$message({
                            showClose: true,
                            message:req.retMsg,
                            type: 'warning'
                        });
                    }
                });
            },
            //取消绑定
            accagentRemove(){
                if(this.multipleSelection.length!='1'){
                    this.$message({
                        showClose: true,
                        message: '请选择一条数据',
                        type: 'warning'
                    });
                    return
                }
                this.$confirm('是否取消绑定','确认框',{
                    confirmButtonText:'确认',
                    cancelButtonText:"取消",
                    type:"warrning",
                }).then(()=>{
                    let param={
                        accinfoId:this.multipleSelection[0].accinfoId,
                    }
                    MainAjax.doPost(urlConfig.admin.userCencelBingAgent,param).then(req =>{
                        if(req.retCode==this.$constants.returnCode.success){
                            this.$message({
                                showClose: true,
                                message: '取消绑定成功',
                                type: 'success'
                            });
                            this.userListQuery();
                        }else{
                            this.$message({
                                showClose: true,
                                message:req.retMsg,
                                type: 'warning'
                            });
                        }
                    });
                }).catch(()=>{
                    this.$message({
                        showClose: true,
                        message: '已取消删除',
                        type: 'info'
                    });
                })
            },
            //机构树弹框
            mechanismqueryForm(){
                this.checkeddata=[];
                this.checkeddata.push(this.form.accorgIdValue)
                this.state=true;
                
            },
            mechanismqueryAdd(){
                this.checkeddata=[];
                this.checkeddata.push(this.form_add.accorgIdValue)
                this.state=true;
                
            },
            //获取选中的机构
            checkedNodes(data){
                if(this.dialogVisible==true){
                    this.form_add.accorgId=data[0].cname;
                    this.form_add.accorgIdValue=data[0].id;
                }else{
                    this.mechanismList=data;
                    this.form.accorgId=data[0].cname;
                    this.form.accorgIdValue=data[0].id;
                }
                this.state=data;
            },
            //行政级别弹框
            adminiZtreeForm(){
                this.checkeddata=[];
                this.checkeddata.push(this.form.dutyinfoIdValue);
                this.AdminiLevelState=true;
                
            },
            adminiZtreeFormAdd(){
                this.checkeddata=[];
                this.checkeddata.push(this.form_add.dutyinfoIdValue);
                this.AdminiLevelState=true;
                
                console.log(this.checkeddata)
            },
            //获取行政级别选中的数据
            adminiLevelcheckedNodes(data){
                if(this.dialogVisible==true){
                    this.form_add.dutyinfoId=data[0].cname;
                    this.form_add.dutyinfoIdValue=data[0].id;
                }else{
                    this.AdministrativeLevelList=data;
                    this.form.dutyinfoId=data[0].cname;
                    this.form.dutyinfoIdValue=data[0].id;
                }
                this.AdminiLevelState=data;
            },
            //选择技能组
            skillsGroup(){
                MainAjax.doPost(urlConfig.admin.skillTeamList).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){  
                        this.dialogSkillsGroup = req.skillteaminList;    
                    }else{
                        this.$message({
                            showClose: true,
                            message:req.retMsg,
                            type: 'warning'
                        });
                    }
                });
            },
            //授权
            userEmpower(){
                if(this.multipleSelection.length!="1"){
                    this.$message({
                        showClose: true,
                        message: '请选择一条数据',
                        type: 'warning'
                    });
                    return
                }
                let data={
                    accinfoId:this.multipleSelection[0].accinfoId,
                }
                MainAjax.doPost(urlConfig.admin.role_update,data).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        let rolekeys=[];
                        for(var i=0;i<req.associateRoleTreeList.length;i++){
                            rolekeys.push(req.associateRoleTreeList[i].roleinfoId)
                        }
                        this.checked_kys=rolekeys;
                        this.isrole();
                        this.dialogEmpower=true;
                    }else{
                        this.$message({
                            showClose: true,
                            message:req.retMsg,
                            type: 'warning'
                        });
                    }
                });


                
                
                
                
            },
            //获取角色树选择的数据
            getCheckedNodes(){
                this.roleChecked_all = this.$refs.tree.getCheckedKeys();
                console.log(this.roleChecked_all)
            },
            //授权保存
            EmpowerSub(){
                let associateRoleTreeList=[];
                for(var i=0;i<this.roleChecked_all.length;i++){
                    associateRoleTreeList.push({roleinfoId:this.roleChecked_all[i]})
                }
                let data={
                    accinfoId:this.multipleSelection[0].accinfoId,
                    associateRoleTreeList:associateRoleTreeList,
                }
                MainAjax.doPost(urlConfig.admin.accredit,data).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        this.$emit('resultChange',{info:{
                            type: this.$constants.optionResultType.success,
                            content:"用户授权成功",
                        },flush:true});
                        this.dialogEmpower=false;
                    }else{
                        this.$message({
                            showClose: true,
                            message:req.retMsg,
                            type: 'warning'
                        });
                    }
                });
            },
            //查询已授权的角色
            isrole(){
                MainAjax.doPost(urlConfig.admin.roleTreeList).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        let data =[];
                        data.push(JSON.parse(req.roleinfoId));  
                        data[0].cname="根目录";
                        data[0].id=0;
                        this.roleTree=data;
                        this.loading=false;
                        
                    }else{
                        this.$message({
                            showClose: true,
                            message:req.retMsg,
                            type: 'warning'
                        });
                    }
                });
            },
        },
        mounted:function(){
            // this.$emit('initButtons',[
            //     { "id": "3750","cname": "查询","isMenuOrButton": "B",onClick:"userListQuery"},
            //     { "id": "3755","cname": "新增","isMenuOrButton": "B",onClick:"userAdd"},
            //     {"id": "3752","cname": "修改","isMenuOrButton": "B",onClick: "userChange"},
            //     {"id": "3753","cname": "删除","isMenuOrButton": "B",onClick: "userMove"},
            //     {"id": "3754","cname": "密码重置","isMenuOrButton": "B",onClick: "passwordremove"},
            //     {"id": "3758","cname": "绑定操作员","isMenuOrButton": "B",onClick: "accagent" },
            //     {"id": "3757","cname": "取消绑定","isMenuOrButton": "B",onClick: "accagentRemove" },
            //     {"id": "3759","cname": "授权","isMenuOrButton": "B",onClick: "userEmpower" }
            // ]);
            this.userListQuery();
        }
    }
</script>
<style scope>
</style>