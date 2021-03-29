<template>
    <div >
        <el-row class="formadd">
            <el-col :span="6" class="leftmar">
                <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small" :disabled="isdisabled">
                    <el-col :span="24">
                        <el-form-item label="角色编号">
                            <el-input v-model="form.rolecode" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="角色名称">
                            <el-input v-model="form.rolename"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="角色描述">
                            <el-input v-model="form.remark"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                         <el-form-item label="角色状态">
                            <el-select v-model="form.rolestatus" style="width:100%" placeholder="请选择性别">
                                <el-option label="" value=""></el-option>
                                <el-option label="无效" value="0"></el-option>
                                <el-option label="有效" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="序号">
                            <el-input v-model="form.rolename"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="连续录入">
                            <el-input v-model="form.rolename"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <el-col :span="8">
                <el-tree :data="data4" ref="tree" disabled='true'  node-key="id" :default-checked-keys="checked_kys" :expand-on-click-node="false" :props="defaultProps" show-checkbox @check-change="getCheckedNodes">
            </el-tree>
            </el-col>
        </el-row>
        <el-row>
            <el-button  @click="preservationbtu" v-if="this.page!='3'">保存</el-button>
            <el-button>返回</el-button>
        </el-row>
    </div>
</template>
<script>
    import MainAjax from "@/core/utils/MainAjax";
    export default {
        data(){
            return{
                form:{
                    rolecode:"",
                    rolename:"",
                    rolestatus:"",
                    remark:"",
                },
                isdisabled:false,
                false:"",
                data4:[],
                checked_kys:[],//选中的树节点[2，2，3]
                checked_all:[],//选中的树节点[id:2，id:2，id:3]
                defaultProps: {
                    children: 'children',
                    label: 'cname',
                },
                page:"",//新增修改详情标示
                roleinfoId:"",
            }
        },
        methods:{
            //权限树加载
            jurisdictionlist(){
                MainAjax.doPost(urlConfig.admin.permissionTreeLoad).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        let data =[];
                        data.push(JSON.parse(req.permissionTreeData));  
                        data[0].cname="根目录";
                        this.data4=data;
                        console.log(this.data4)
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
                //.concat(this.$refs.tree.getHalfCheckedKeys());
                console.log(this.checked_all)
            },
            //详情
            detail(){
                let param={
                    roleinfoId:this.roleinfoId
                }
                MainAjax.doPost(urlConfig.admin.roleEditRole,param).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        this.form.rolecode=req.rolecode;
                        this.form.rolename=req.rolename;
                        this.form.remark=req.remark;
                        this.form.rolestatus=req.rolestatus;
                        alert(req.permissionList.length)
                        for(var i=0;i<req.permissionList.length;i++){
                            this.checked_kys.push(
                                req.permissionList[i].permissionInfoId
                            )
                            
                        }
                        alert(this.checked_kys.length)
                        console.log(this.checked_kys)
                        
                        //this.checked_kys=req.permissionList[0]

                    }else{
                        this.$message({
                            showClose: true,
                            message:req.retMsg,
                            type: 'warning'
                        });
                    }
                });
            },
            //保存
            preservationbtu(){
                if(this.page =="3"){//详情
                    this.isdisabled=true;
                    this.detail();
                }else if(this.page =="2"){//修改
                    this.change();
                }else if(this.page =="1"){//新增
                    this.add();
                }
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
                let param={
                    rolecode:this.form.rolecode,
                    rolename:this.form.rolename,
                    remark:this.form.remark,
                    rolestatus:this.form.rolestatus,
                    roleinfoId:this.roleinfoId,
                    perRoleList:perRoleList,
                }
                MainAjax.doPost(urlConfig.admin.roleUpdateRole,param).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        this.$message({
                            showClose: true,
                            message:"修改成功",
                            type: 'success'
                        });
                        this.$router.push({
                            path:'roleList',
                        })

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
                let perRoleList=[];
                for(var i=0;i<this.checked_all.length;i++){
                    perRoleList.push({ 
                        permissionInfoId:this.checked_all[i]
                    })
                }
                let param={
                    rolecode:this.form.rolecode,
                    rolename:this.form.rolename,
                    remark:this.form.remark,
                    rolestatus:this.form.rolestatus,
                    roleinfoId:this.roleinfoId,
                    perRoleList:perRoleList,
                }
                MainAjax.doPost(urlConfig.admin.roleSaveRole,param).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        this.$message({
                            showClose: true,
                            message:"新增成功",
                            type: 'success'
                        });
                        this.$router.push({
                            path:'roleList',
                        })
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
        mounted(){
            this.page = this.$route.query.ispage;
            this.roleinfoId=this.$route.query.id;
            alert(this.roleinfoId)
            this.jurisdictionlist();
            if(this.page =="3"){//详情
                this.isdisabled=true;
                this.detail();
            }else if(this.page =="2"){//修改
                this.detail();
            }else if(this.page =="1"){//新增

            }
        
        },
    }
</script>
<style scope="scoped">
    .formadd{
        margin-top:40px;
    }
    .leftmar{
        margin-left: 20%;
    }
</style>

