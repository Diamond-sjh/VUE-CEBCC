<!-- created by liuhui on 2019.09.20 -->
<!-- 权限管理 -->
<template>
    <div class="main">
        <el-row>
            <el-col>
            <el-tree :data="data4"  node-key="id" :expand-on-click-node="false" :props="defaultProps" :default-expanded-keys="[0]">
                <span class="custom-tree-node" slot-scope="{ node, data }" style="flex: 1; display: flex; align-items: center; justify-content: space-between;font-size: 14px; padding-right: 8px;">
                    <span>{{ node.label }}</span>
                     <span>
                        <el-button v-show="data.id!=0" style="font-size: 12px;font-weight:400;" type="text" class="dataTableStyle" size="mini" @click="() => jurisdiction(node, data,'change')">鉴权url</el-button>
                    </span>
                </span>
            </el-tree>
            <!-- 新增修改删除弹窗 -->
            <el-dialog :title="'鉴权url列表'" :visible.sync="dialogVisible" @opened="openfun" @close="closedialog">
                <el-row>
                    <el-form :model="form" label-width="100px" class="demo-ruleForm" ref="form">
                        <el-row v-for="(item,i) in form_add" :key="i">
                            <el-col :span="20">
                                <el-form-item label="鉴权" :prop="url" :rules="{required:true,message:'请输入URL',trigger:'blur'}">
                                    <el-input v-model="item.authUrl" clearable @blur="modifiedUrl(item.id,item.authUrl)"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2"><el-button type="primary" plain size="small" @click="reduceUrl(item.id,item.authUrl,i)">-</el-button></el-col>
                        </el-row>
                    </el-form>
                    <el-col :span="24" style="text-align:center;"><el-button type="primary" plain size="small" @click="addUrl">+</el-button></el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" style="text-align:center;margin-top:20px;">
                    <el-button type="primary" plain size="small" @click="urlSub()">确认</el-button>
                    <el-button type="primary" plain size="small" @click="dialogClose()">返回</el-button> 
                    </el-col>
                </el-row>
            </el-dialog>
            <!-- 新增修改删除弹窗 -->
        </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        name:"jurisdictionquery",
        data(){
            return{
                //树结构
                data4:[],//权限树
                defaultProps: {
                    children: 'children',
                    label: 'cname',
                }, 
                dialogVisible:false,//新增、修改弹框是否展开
                title:"",//弹框title
                andorchange:"",//新增修改标示
                permissionInfoId:"",//树当前节点id
                parenturlarr:[],//树当前节点url
                //关联
                dialogjurisdiction:false,
                hasassociatedButtonList:[],//已关联的数据
                associateButtonList:[],//未关联的数据
                alllist:[],//全部的数据
                form_add:[],
                url:"",
                form:{},
                permissionCode:"",
                operateUrlList:[]
            }
        },
        methods:{
            //获取当前点击树节点的信息
            handleNodeClick(data){
                console.log(data)    
            }, 
            //权限树加载
            jurisdictionList(){
                this.$MainAjax.doPost(urlConfig.admin.permissionTreeLoad).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        if(req.permissionTreeData){
                            let data =[];
                            data.push(JSON.parse(req.permissionTreeData));  
                            data[0].cname="中国光大银行";
                            data[0].id=0;
                            this.data4=data;
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
                let param = {permissionCode:data.code}; 
                this.$MainAjax.doPost(urlConfig.admin.authUrlQuery,param).then(res => {
                    this.form_add = res.authUrlList;
                    this.permissionCode = data.code;   //将code存储
                    //this.operateUrlList = this.operateUrlList.concat(res.data.authUrlList)  //将初始的url表存储
                })
            },
            //打开弹框
            openfun(){
                // this.$nextTick(() => {
                //     if(this.andorchange=="add"){
                //         this.title="新增";
                        
                //         //this.$refs.child.ztreeurlfun();//获取路径
                //     }else if(this.andorchange=="change"){
                //         this.title="修改";
                //         // this.$refs.child.jurisdictiondtetail();//查看详情
                //         // this.$refs.child.ztreeurlfun();//获取路径
                //     }
                // })  
            },
            //关闭弹框
            closedialog(data,change){
                //this.$refs.child.cleanForminput();//清楚数据
            },
            closeform(data,change){
                alert('8')
                if(change=="change"){//如果新增成功或者修改成功，刷新树结构
                    this.jurisdictionList();
                }
                this.dialogVisible=data;
                //this.$refs.child.cleanForminput();//清楚数据
            },
            //关联权限
            // jurisdictionRelation(data){
            //     this.relation();
            //     this.dialogjurisdiction=true;
            // },  
            //获取已关联数据
            // relation(){
            //     let param = {
            //         "permissionInfoId": "18430"
            //     }
            //     MainAjax.doPost(urlConfig.admin.permissionButtonLst,param).then(req =>{
            //         if(req.retCode==this.$constants.returnCode.success){
            //             this.associateButtonList=req.associateButtonList;//获取未选中的数据
            //             this.alllist= this.associateButtonList.concat(req.hasassociatedButtonList)//获取全部的数据
            //             for(var i=0;i<req.hasassociatedButtonList.length;i++){ //获取选中的数据转换成数组
            //                 this.hasassociatedButtonList.push(
            //                     req.hasassociatedButtonList[i].permissionInfoId,
            //                 )
            //             }  
            //         }
            //     });
            // },
            //关联保存
            // preservation(){
            //     let data=[];//获取已勾选的数据转换数据格式
            //     for(var i=0;i<this.hasassociatedButtonList.length;i++){
            //         data.push({
            //             "relationId":this.hasassociatedButtonList[i]
            //         })
            //         console.log(this.hasassociatedButtonList[i]);
            //     }
            //     let param={
            //         permissionInfoId: "18430",
            //         relationIds:data, 
                    
            //     }
            //     MainAjax.doPost(urlConfig.admin.permissionButtonAssociate,param).then(req =>{
            //         if(req.retCode==this.$constants.returnCode.success){
            //             this.$router.push({
            //                 path:"jurisdictionquery"
            //             })
            //             this.$message({
            //                 showClose: true,
            //                 message: '关联成功',
            //                 type: 'success'
            //             });
            //         }else{
            //             this.$message({
            //                 showClose: true,
            //                 message: req.retMsg,
            //                 type: 'warning'
            //             });
            //         }
            //     });
            // },
            //已关联的数据
            // handleChange(right){
            //     this.hasassociatedButtonList=right;
            // },
            //增加url
            addUrl(){
                console.log("这是增加url的操作");
                this.form_add.push({add:new Date().getTime()})
            },
            //删除url
            reduceUrl(id,authUrl,index){
                console.log("这是删除URL的操作");
                var detItem = this.form_add[index];
                console.log(detItem)
                this.form_add.splice(index,1);
                if(id != undefined){
                    console.log(id);
                    this.operateUrlList.push({
                        id:id,
                        authUrl:authUrl,
                        operateFlag:3
                    })
                }
            },
            //修改url
            modifiedUrl(urlId,urlContent){
                // console.log(add)
                if(urlId != undefined){
                    console.log(urlId)
                    this.operateUrlList.push({
                        id:urlId,
                        authUrl:urlContent,
                        operateFlag:2
                    })
                }
            },
            //提交
            urlSub(){
                console.log("提交url")
                //将新增加的url加入到操作数组
                this.form_add.forEach((item,index) => {
                    if(item.add){
                        this.operateUrlList.push(
                            {
                                authUrl:item.authUrl,
                                operateFlag:1
                            }
                        )
                    }
                })
                //数组去重，去掉多次修改进入到列表的数据
                // this.operateUrlList.forEach((item,i)=>{
                    
                // })
                console.log(this.operateUrlList);
                let param = {
                    permissionCode:this.permissionCode,
                    operateUrlList:this.operateUrlList
                }
                this.$MainAjax.doPost(urlConfig.admin.authUrlOperate, param).then(res => {
                    //console.log(res);
                })
                this.operateUrlList = [];
                this.dialogVisible = false;
            },
            //关闭弹窗
            dialogClose(){
                this.dialogVisible = false;
            }
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

