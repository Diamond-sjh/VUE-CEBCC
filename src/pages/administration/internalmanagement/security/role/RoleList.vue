<!-- 角色管理 -->
<template>
    <el-row>
        <!-- 查询条件 -->
        <el-col>
            <el-row class="custquery">
                <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
                    <el-col :span="8"> 
                        <el-form-item label="角色编号">
                            <el-input v-model="form.rolecode" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="角色名称">
                            <el-input v-model="form.rolename" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                         <el-form-item label="角色状态">
                            <el-select v-model="form.rolestatus" style="width:100%" clearable placeholder="请选择性别">
                                <el-option label="无效" value="0"></el-option>
                                <el-option label="有效" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form>
                <!-- <el-col :span="24">
                    <el-button type="primary" plain size="small" @click="roleListQuery()">查询</el-button>
                </el-col> -->
            </el-row>
        </el-col>
        <!-- 查询列表 -->
        <el-col>
            <h4 style="text-align:left;">
                <span class="dataTableStyle" v-for="(item,index) in laberurl" :key="item.index"  @click="labeUrlQuery(index,item)">{{item.label}}</span>
            </h4>
            <el-row>
                <el-col :span="24" class="text_right">
                    <!-- <el-button type="success" plain @click="adminstrationadd1()">新增跳转页面</el-button> -->
                    <!-- <el-button type="primary" plain size="small" @click="rolAllList()">角色列表</el-button> -->
                    <el-button v-show="laberurl.length!='1'" size="small" type="primary" plain @click="rolePage('1')">新增</el-button>
                    <!-- <el-button type="primary" plain size="small" @click="rolePage('2')">修改</el-button> -->
                    <!-- <el-button type="primary" plain size="small" @click="roleRemove()">删除</el-button> -->
                    <!-- <el-button type="primary" plain size="small" @click="rolePage('3')">查看</el-button> -->
                </el-col>
            </el-row>
            <h2 class="querylist_style border">查询结果</h2>
            <CsrTableBox :pageSize='20' pagePosition="right" :url ='postUrl' :params="params" :pageSizes="[20]"  
                 @dataChanged="dataChangedCallback"  :reloadData.sync="reloadData">
                <template v-slot:paginationContainer>
                    <el-table  :data="tableData" tooltip-effect="dark" max-height="500px" border stripe  @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column label="角色编号" width="">
                            <template slot-scope="scope">
                               <a class="dataTableStyle" @click="laberurlRoleCodeQuery(scope.row)">{{scope.row.rolecode}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="角色名称" >
                            <template slot-scope="scope">
                                <a class="dataTableStyle" @click="laberurlRoleCodeQuery(scope.row)">{{scope.row.rolename}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="角色描述" width="200"></el-table-column>
                        <el-table-column prop="rolestatus" label="角色状态" width=""></el-table-column>
                    </el-table>
                </template>
            </CsrTableBox>
        </el-col>
        <!-- 新增修改弹框 -->
        <el-dialog :title="title" :visible.sync="dialogVisible" @close="closeFun" @open="openFun"  v-loading="loading" element-loading-text="拼命加载中">
            <el-row>
                <el-col :span="14" class="leftmar">
                    <el-form :model="formadd" label-width="100px" :rules="rules" ref="formadd" class="demo-ruleForm" size="small">
                        <el-col :span="24">
                            <el-form-item label="角色编号" v-show="addorchange!='1'" class="text_left">
                                <span>{{formadd.rolecode}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="角色名称" prop="rolename"  class="text_left">
                                <span v-if="addorchange>=3">{{formadd.rolename}}</span>
                                <el-input v-else v-model="formadd.rolename" placeholder="请输入角色名称"></el-input>
                                
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="角色描述" prop="remark"  class="text_left">
                                <span v-if="addorchange>=3">{{formadd.remark}}</span>
                                <el-input  v-else v-model="formadd.remark"  placeholder="请输入角色描述"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="角色状态"  class="text_left">
                                <span v-if="addorchange>=3">{{formadd.rolestatus}}</span>
                                <el-select  v-else v-model="formadd.rolestatus" style="width:100%" placeholder="请选择角色状态">
                                    <el-option label="有效" value="1"></el-option>
                                    <el-option label="无效" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="连续录入" class="text_left" v-show="this.addorchange=='1'">
                                <el-radio v-model="formadd.continue" label="1">是</el-radio>
                                <el-radio v-model="formadd.continue" label="2">否</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-col>
                <el-col :span="8" style="height:500px;overflow:auto;">
                    <el-tree :data="treeDataList" ref="tree" disabled='true'  node-key="id" :default-expanded-keys="[0]" :default-checked-keys="checked_kys" :expand-on-click-node="false" :props="defaultProps" show-checkbox @check-change="getCheckedNodes">
                    </el-tree>
                </el-col>
            </el-row>
            <el-row>
                <el-button type="primary" plain size="small" v-if="this.addorchange=='1' || this.addorchange=='2'"  @click="preservAtionBtu">确定</el-button>
                <el-button type="primary" plain size="small" @click="closeFun">关闭</el-button>
            </el-row>
        </el-dialog>
        <!-- 全部角色弹框 -->
        <el-dialog title="全部角色列表" :visible.sync="dialogAllrole" height="600px" >
            <el-row class="custquery">
                <el-form :model="allroleform" label-width="100px" class="demo-ruleForm" size="small">
                    <el-col :span="8"> 
                        <el-form-item label="角色编号">
                            <el-input v-model="allroleform.rolecode" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="角色名称">
                            <el-input v-model="allroleform.rolename" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                         <el-form-item label="角色状态">
                            <el-select v-model="allroleform.rolestatus" style="width:100%" clearable placeholder="请选择性别">
                                <el-option label="无效" value="0"></el-option>
                                <el-option label="有效" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form>
                <el-col :span="24" class="but">
                    <el-button type="primary" plain size="small" @click="rolAllList">查询</el-button>
                </el-col>
            </el-row>
            <el-row class="custquery">
            <el-table  :data="allRoleData" tooltip-effect="dark" height="500px" stripe="" border  @selection-change="handleSelectionChange">
                <el-table-column label="角色编号" width="">
                    <template slot-scope="scope">
                        <a class="dataTableStyle" @click="rolePage('4',scope.row)">{{scope.row.rolecode}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="角色名称" >
                    <template slot-scope="scope">
                        <span >{{scope.row.rolename}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="父角色" width="200"></el-table-column>
                <el-table-column prop="rolestatus" label="角色状态" width=""></el-table-column>
            </el-table>
            </el-row>
        </el-dialog>   
  </el-row>
</template>
<script>
    import MainAjax from "@/core/utils/MainAjax";
    import CsrTableBox from '@/core/components/PaginationContainer'
    import { mapActions } from 'vuex';
    export default {
        name:"rolelist",
        components:{CsrTableBox},
        data() {
            return {
                //列表model
                form:{
                    rolecode:"",
                    rolename:"",
                    rolestatus:"1",
                },
                laberurl:[{label:"根目录/",roleinfoId:"1"}],//存储ur路径列表数据
                tableData: [],//列表数据
                multipleSelection: [],//列表选中的数据
                rolechildrenlist:[],//保存子列表选中条数的数据
                reloadData:0,
                postUrl:"",

                //新增修改弹框
                loading:false,
                addorchange:"",//新增或修改标示
                title:"",//弹框title
                params:{},
                formadd:{
                    rolecode:"",
                    rolename:"",
                    rolestatus:"",
                    remark:"",
                    continue:'2'
                },
                rules:{
                    rolename:[{required:true,message:'请输入角色名称',trigger:'blur'},{min:1,max:50,message:'最多输入50个字符',trigger:'blur'}],
                    remark:[{required:true,message:'请输入角色描述',trigger:'blur'},{max:200,message:'最多输入200个字符',trigger:'blur'}],
                },
                dialogVisible: false,//是否显示弹框
                isdisabled:false,//是否disabled
                treeDataList:[],//权限树list
                checked_kys:[],//选中的树节点[2，2，3]
                checked_all:[],//选中的树节点[id:2，id:2，id:3]
                defaultProps: {
                    children: 'children',
                    label: 'cname',
                },
                isdisabled:false,//是否disabled

                //全部角色
                allRoleData:[],//全部角色list
                dialogAllrole:false,//弹框是否显示
                allroleform:{//全部角色查询条件
                    rolecode:"",
                    rolename:"",
                    rolestatus:"",
                },   
            }
        },
        methods: {
            //获取列表选中的数据
            handleSelectionChange(val) {
                //console.log(val)
                this.multipleSelection = val;
            },
            //点击目录
            labeUrlQuery(index,item){
                if(item.roleinfoId=="1"){
                    this.roleParentQuery();
                    this.laberurl.splice(index+1,this.laberurl.length-index+1);
                }else{
                    this.roleCodeQuery(this.laberurl[index]);
                    this.laberurl.splice(index+1,this.laberurl.length-index+1);
                }   
            },
            //列表查询按钮
            roleListQuery(){
                if(this.laberurl.length==1){
                    console.log(this.laberurl.length)
                    this.roleParentQuery();//查询跟目录
                }else if(this.laberurl.length>1){
                    this.roleCodeQuery(this.rolechildrenlist);
                }
            },
            //全部角色按钮
            rolAllList(){
                this.dialogAllrole=true;
                this.rolAllList();
            },
            //查询全部角色列表
            rolAllList(){
                this.dialogAllrole=true;
                let param = {
                    rolecode:this.allroleform.rolecode,
                    rolename:this.allroleform.rolename,
                    rolestatus:this.allroleform.rolestatus,
                }
                MainAjax.doPost(urlConfig.admin.roleQueryRoleLst,param).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        //登录返回信息
                        this.allRoleData=req.roleMList;
                    }else{
                        this.$message({
                            showClose: true,
                            message: req.retMsg,
                            type: 'warning'
                        });
                    }
                });
            },
            //查询根角色列表
            roleParentQuery(){
                this.postUrl=urlConfig.admin.roleFirstRoleQueryLst;
                let param={
                    "rolecode": this.form.rolecode,
                    "rolename": this.form.rolename,
                    "rolestatus": this.form.rolestatus,
                }
                this.params=param;
                this.reloadData =1;
            },
            //根据角色编号查询二级列表
            roleCodeQuery(scope){
                if(scope.roleflag=="0"){
                    return;
                }
                this.rolechildrenlist = scope;
                this.postUrl=urlConfig.admin.roleMultiRoleQueryLst;
                let param={
                    "roleinfoId":scope.roleinfoId,
                    "rolecode": this.form.rolecode,
                    "rolename": this.form.rolename,
                    "rolestatus": this.form.rolestatus,
                }
                this.params=param;
                //this.laberurl.push({"label":scope.rolename+"/","roleinfoId":scope.roleinfoId})    
                this.reloadData =1;
            },
            //点击列表查询子目录时push根目录的数据
            laberurlRoleCodeQuery(scope){
                this.roleCodeQuery(scope);
                this.laberurl.push({"label":scope.rolename+"/","roleinfoId":scope.roleinfoId,rolecode:scope.rolecode})    

            },
            //获取table列表返回的数据
            dataChangedCallback(response){
                this.tableData=response&&response? response.roleMList:[];
            },
            //新增修改详情弹框（1新增、2修改、3详情、4全部角色详情）
            rolePage(button,ispage,data){
                this.addorchange=ispage;
                this.loading=true;
                if(ispage=="1"){
                    this.jurisdictionList();//加载权限树
                    this.dialogVisible=true;
                    this.title="新增"; 
                }else if(ispage=="2"){
                    if(this.multipleSelection.length!='1'){
                        this.$message({
                            showClose: true,
                            message: '请选择一条数据',
                            type: 'warning'
                        });
                    }else{
                        this.detail(this.multipleSelection[0].roleinfoId);
                        this.dialogVisible=true;
                        this.title="修改";
                        
                        //this.detail(this.multipleSelection[0].roleinfoId);
                        
                    }   
                }else if(ispage=="3"){
                    if(this.multipleSelection.length!='1'){
                        this.$message({
                            showClose: true,
                            message: '请选择一条数据',
                            type: 'warning'
                        });
                    }else{
                        this.isdisabled=true;
                        this.dialogVisible=true;
                        this.title="详情";
                        this.detail(this.multipleSelection[0].roleinfoId);
                        //this.jurisdictionList();
                    } 
                } else if(ispage=="4"){
                    this.isdisabled=true;
                    this.dialogVisible=true;
                    this.title="详情";
                    this.detail(data.roleinfoId);
                    //this.jurisdictionList();
                }
            },
            //新增修改保存按钮点击
            preservAtionBtu(){
                if(this.addorchange=='1'){
                    this.add();
                }else if(this.addorchange=='2'){
                    this.change();  
                }
            },
            //删除
            roleRemove(){
                if(this.multipleSelection.length!=1){
                    this.$message({
                        showClose: true,
                        message: '请选择一条数据',
                        type: 'warning'
                    });
                    return;
                }
                if(this.multipleSelection[0].rolestatus=="0"){
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
                        roleinfoId:this.multipleSelection[0].roleinfoId
                    }
                    MainAjax.doPost(urlConfig.admin.roleDelete,param).then(req =>{
                        if(req.retCode==this.$constants.returnCode.success){
                            let mess="";
                            let typestat="";
                            if(req.reminder=="0"){
                                mess="角色状态已经无效，无需删除 ";
                                typestat="warning";
                            }else if(req.reminder=="1"){
                                this.$emit('resultChange',{info:{
                                    type: this.$constants.optionResultType.error,
                                    content:"此角色已绑定用户，请解除授权后删除此角色",
                                },flush:true});
                            }else if(req.reminder=="2"){
                                this.$emit('resultChange',{info:{
                                    type: this.$constants.optionResultType.error,
                                    content:"此角色有下级且有效角色，如果要删除，请先删除下级后在删除此角色此角色已绑定用户，请解除授权后删除此角色",
                                },flush:true});
                            }else if(req.reminder=="3"){
                                this.$emit('resultChange',{info:{
                                    type: this.$constants.optionResultType.success,
                                    content:"删除成功",
                                },flush:true});
                                this.roleListQuery();
                            }
                        }else{
                            this.$message({
                                showClose: true,
                                message: req,
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
            //详情
            detail(roleinfoId){
                let param={
                    roleinfoId:roleinfoId
                }
                MainAjax.doPost(urlConfig.admin.roleEditRole,param).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        this.formadd.rolecode=req.rolecode;
                        this.formadd.rolename=req.rolename;
                        this.formadd.remark=req.remark;
                        this.formadd.rolestatus=req.rolestatus;
                        for(var i=0;i<req.permissionList.length;i++){
                            this.checked_kys.push(
                                req.permissionList[i].permissionInfoId
                            ) 
                        }
                        console.log(this.checked_kys)
                        this.jurisdictionList();
                    }else{
                        this.$message({
                            showClose: true,
                            message:req.retMsg,
                            type: 'warning'
                        });
                    }
                });
            },
            //权限树加载
            jurisdictionList(){
                MainAjax.doPost(urlConfig.admin.permissionTreeLoad).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        let data =[];
                        data.push(JSON.parse(req.permissionTreeData));  
                        data[0].cname="根目录";
                        data[0].id=0;
                        this.treeDataList=data;
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
            //获取选中的树节点
            getCheckedNodes(){
                this.checked_all = this.$refs.tree.getCheckedKeys();
            },
            //修改保存
            change(){
                this.getCheckedNodes()
                let perRoleList=[];
                for(var i=0;i<this.checked_all.length;i++){
                    perRoleList.push({ 
                        permissionInfoId:this.checked_all[i]
                    })
                }
                if(perRoleList.length<1){
                    this.$message({
                        showClose: true,
                        message:"请选择权限",
                        type: 'warning'
                    });
                    return;
                }
                let param={
                    //rolecode:this.formadd.rolecode,
                    rolename:this.formadd.rolename,
                    remark:this.formadd.remark,
                    rolestatus:this.formadd.rolestatus,
                    roleinfoId:this.multipleSelection[0].roleinfoId,
                    permissionList:perRoleList,
                }
                MainAjax.doPost(urlConfig.admin.roleUpdateRole,param).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        this.$message({
                            showClose: true,
                            message:"修改成功",
                            type: 'success'
                        });
                        if(this.formadd.continue=='2'){
                            this.dialogVisible=false;
                            //let laberurllegtn=this.laberurl.length-1;
                            //this.roleCodeQuery(this.laberurl[laberurllegtn]);
                            this.roleListQuery();
                        }
                    }else{
                        this.$message({
                            showClose: true,
                            message:req.retMsg,
                            type: 'warning'
                        });
                    }
                });
            },
            //新增保存
            add(){
                this.getCheckedNodes();
                if(this.checked_all.length<1){
                    this.$message({
                        showClose: true,
                        message:"请选择勾选的权限",
                        type: 'warning'
                    });
                    return;
                }
                let perRoleList=[];
                for(var i=0;i<this.checked_all.length;i++){
                    perRoleList.push({ 
                        permissionInfoId:this.checked_all[i]
                    })
                }
                if(perRoleList.length<1){
                    this.$message({
                        showClose: true,
                        message:"请选择权限",
                        type: 'warning'
                    });
                    return;
                }
                let laberurllegtn=this.laberurl.length-1;
                let param={
                    rolecode:this.laberurl[laberurllegtn].rolecode,
                    rolename:this.formadd.rolename,
                    remark:this.formadd.remark,
                    rolestatus:this.formadd.rolestatus,
                    roleinfoId:this.laberurl[laberurllegtn].roleinfoId,
                    permissionList:perRoleList,
                }
                MainAjax.doPost(urlConfig.admin.roleSaveRole,param).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        if(req.reminder=='0'){
                            this.$message({
                                showClose: true,
                                message:"新增的角色在系统中已存在，不能重复添加",
                                type: 'warning'
                            });
                        }else{
                            this.$message({
                                showClose: true,
                                message:"新增成功",
                                type: 'success'
                            });
                            if(this.formadd.continue=='2'){
                                this.dialogVisible=false;
                                this.roleListQuery();
                            }
                        }   
                    }else{
                        this.$message({
                            showClose: true,
                            message:req.retMsg,
                            type: 'warning'
                        });
                    }
                });
            },
            //关闭弹框
            closeFun(){
                this.dialogVisible=false;
                this.$refs.tree.setCheckedKeys([]);
            },
            //新增弹框
            openFun(){
                this.formadd.rolecode="";
                this.formadd.rolename="";
                this.formadd.rolestatus="1";
                this.formadd.remark="";
                this.formadd.continue="2";
            },
        },
        mounted:function(){
            this.roleParentQuery();
        }
    }
</script>
<style scoped>
    .but{
        margin-bottom: 10px;
    }
</style>