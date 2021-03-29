<!-- 权限管理 -->
<template>
    <div class="main">
        <el-row>
            <el-col>
            <el-tree :data="data4"  node-key="id" :expand-on-click-node="false" :props="defaultProps" :default-expanded-keys="[0]">
                <span class="custom-tree-node" slot-scope="{ node, data }" style="flex: 1; display: flex; align-items: center; justify-content: space-between;font-size: 14px; padding-right: 8px;">
                    <span><a :title="node.title">{{ node.label }}</a></span>
                    <span>
                        <el-button v-show="data.id!=0" style="font-size: 12px;font-weight:400;" class="dataTableStyle" type="text" size="mini" @click="() => jurisdiction(node, data,'change')">编辑权限</el-button>
                        <el-button v-show="data.id!=0" type="text" style="font-size: 12px;font-weight:400;" class="dataTableStyle" size="mini" @click="() => jurisdictionDelete(node,data)">删除权限</el-button>
                        <el-button v-show="data.permType=='M'" type="text" style="font-size: 12px;font-weight:400;" class="dataTableStyle" size="mini" @click="() => jurisdiction(node,data,'add')">增加子权限</el-button>
                        <el-button v-show="data.permType=='B'" type="text" style="font-size: 12px;font-weight:400;" class="dataTableStyle" size="mini" @click="() => jurisdictionRelation(node,data)">关联权限</el-button> 
                    </span>
                </span>
            </el-tree>
            <el-dialog :title="title" :visible.sync="dialogVisible" @opened="openfun" @close="closedialog" width="1200px">
                <Jurisdictiondialog ref="child" :permissionInfoId="permissionInfoId" :parenturlarr="parenturlarr" :andorchange="andorchange" @closeform="closeform">
                </Jurisdictiondialog>
            </el-dialog>
            <!-- 权限关联 -->
            <el-dialog title="关联权限" :visible.sync="dialogjurisdiction" @opened="openfun">
                <div>
                    <el-row>
                        <el-transfer v-model="hasassociatedButtonList" :data="alllist" :props="{key:'permissionInfoId',label:'permName'}" :titles="['未关联','已关联']" @change="handleChange">
                        </el-transfer>
                    </el-row>
                    <el-button type="primary" plain size="small" @click="preservation">确定</el-button>
                </div>
            </el-dialog>
        </el-col>
        </el-row>
    </div>
</template>
<script>

    import MainAjax from "@/core/utils/MainAjax";
    import Jurisdictiondialog from '@/pages/administration/internalmanagement/security/jurisdiction/Jurisdictiondialog'
    export default {
        name:"jurisdictionquery",
        components:{Jurisdictiondialog},
        data(){
            return{
                //树结构
                data4:[],//权限树
                defaultProps: {
                    children: 'children',
                    label: 'cname',
                    title:'title',
                }, 
                dialogVisible:false,//新增、修改弹框是否展开
                title:"",//弹框title
                andorchange:"",//新增修改标示
                permissionInfoId:"",//树当前节点id
                parenturlarr:[],//树当前节点url
                //关联
                dialogjurisdiction:false,
                form:{},
                hasassociatedButtonList:[],//已关联的数据
                associateButtonList:[],//未关联的数据
                alllist:[],//全部的数据
            }
        },
        methods:{
            //获取当前点击树节点的信息
            handleNodeClick(data){
                console.log(data)    
            }, 
            //权限树加载
            jurisdictionList(){
                MainAjax.doPost(urlConfig.admin.permissionTreeLoad).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        if(req.permissionTreeData){
                            let data =[];
                            data.push(JSON.parse(req.permissionTreeData));  
                            data[0].cname="中国光大银行";
                            data[0].id=0;
                            data[0].title="中国光大银行";
                            this.data4=data;
                            console.log(this.data4)
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
            //删除权限
            jurisdictionDelete(node,data){
                let permid=data.id;
                this.$confirm('是否确认删除','确认框',{
                    confirmButtonText:'确认',
                    cancelButtonText:"取消",
                    type:"warrning",
                }).then(()=>{
                    let param = {
                        permissionInfoId: permid.toString()
                    }
                    MainAjax.doPost(urlConfig.admin.permissionDelete,param).then(req =>{
                        if(req.retCode==this.$constants.returnCode.success){
                            this.jurisdictionList();
                            this.$message({
                                showClose: true,
                                message: '删除成功',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                showClose: true,
                                message: req.retMsg,
                                type: 'success'
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
            //获取树当前节点url路径
            parenturl(node){
                if(node.parent==null){
                    return;
                }
                this.parenturlarr.push(node.data.cname);
                this.parenturl(node.parent);
            },
            //新增、修改弹框
            jurisdiction(node,data,andorchange){
                this.dialogVisible=true; 
                this.andorchange = andorchange;
                this.parenturlarr=[];
                this.parenturl(node);
                this.permissionInfoId=data.id;      
            },
            //打开弹框
            openfun(){
                this.$nextTick(() => {
                    if(this.andorchange=="add"){
                        this.title="新增";
                        
                        this.$refs.child.ztreeurlfun();//获取路径
                    }else if(this.andorchange=="change"){
                        this.title="修改";
                        this.$refs.child.jurisdictiondtetail();//查看详情
                        this.$refs.child.ztreeurlfun();//获取路径
                    }
                })  
            },
            //关闭弹框
            closedialog(data,change){
                this.$refs.child.cleanForminput();//清楚数据
            },
            closeform(data,change){
                if(change=="change"){//如果新增成功或者修改成功，刷新树结构
                    this.jurisdictionList();
                }
                this.dialogVisible=data;
                this.$refs.child.cleanForminput();//清楚数据
            },
            //关联权限
            jurisdictionRelation(node,data){
                console.log(data.id)
                let permid=data.id;
                this.relation(permid);
                this.dialogjurisdiction=true;
            },  
            //获取已关联数据
            relation(id){
                let param = {
                    permissionInfoId: id
                }
                MainAjax.doPost(urlConfig.admin.permissionButtonLst,param).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        this.associateButtonList=req.associateButtonList;//获取未选中的数据
                        this.alllist= this.associateButtonList.concat(req.hasassociatedButtonList)//获取全部的数据
                        for(var i=0;i<req.hasassociatedButtonList.length;i++){ //获取选中的数据转换成数组
                            this.hasassociatedButtonList.push(
                                req.hasassociatedButtonList[i].permissionInfoId,
                            )
                        }  
                    }
                });
            },
            //关联保存
            preservation(){
                let data=[];//获取已勾选的数据转换数据格式
                for(var i=0;i<this.hasassociatedButtonList.length;i++){
                    data.push({
                        "relationId":this.hasassociatedButtonList[i]
                    })
                }
                let param={
                    permissionInfoId: "18430",
                    relationIds:data,   
                }
                MainAjax.doPost(urlConfig.admin.permissionButtonAssociate,param).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        this.dialogjurisdiction=false;
                        this.jurisdictionList();
                        this.alllist=[];//清空数据
                        this.$message({
                            showClose: true,
                            message: '关联成功',
                            type: 'success'
                        });
                        
                    }else{
                        this.$message({
                            showClose: true,
                            message: req.retMsg,
                            type: 'warning'
                        });
                    }
                });
            },
           

            //已关联的数据
            handleChange(right){
                this.hasassociatedButtonList=right;
            },
        },
        mounted(){
            this.jurisdictionList();
        },
    }
</script>
<style scoped>
    .main{
        margin-left: 20%;
        width: 50%;    
    }
    .tree{
        background: rgb(255, 255, 255);
        height: 500px;
        overflow-y: auto;
    }
</style>

