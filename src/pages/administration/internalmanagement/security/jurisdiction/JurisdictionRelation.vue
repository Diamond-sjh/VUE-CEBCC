<template>
<div>
    <!-- <el-row>
        <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
            <el-col :span="12">
                <span>权限路径:</span><span>权限路径</span>
            </el-col>
            <el-col :span="12">
                <span>权限路径:</span><span>权限路径</span>
            </el-col>
            <el-col :span="12">
                <span>权限路径:</span><span>权限路径</span>
            </el-col>
        </el-form>
    </el-row> -->
    <el-row>
        <el-transfer v-model="hasassociatedButtonList" :data="alllist" :props="{key:'permissionInfoId',label:'permName'}" :titles="['未选中','以选中']" @change="handleChange">
        </el-transfer>
    </el-row>
    <el-button @click="preservation">保存</el-button>
</div>
</template>
<script>
    import MainAjax from "@/core/utils/MainAjax";
    export default{
        data(){
            return{
                form:{},
                hasassociatedButtonList:[],//已关联的数据
                associateButtonList:[],//未关联的数据
                alllist:[],//全部的数据
            }
        },
        methods:{
            //获取已关联数据
            relation(){
                let param = {
                    "permissionInfoId": "18430"
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
            //保存
            preservation(){
                let data=[];//获取已勾选的数据转换数据格式
                for(var i=0;i<this.hasassociatedButtonList.length;i++){
                    data.push({
                        "relationId":this.hasassociatedButtonList[i]
                    })
                    console.log(this.hasassociatedButtonList[i]);
                }
                let param={
                    permissionInfoId: "18430",
                    relationIds:data, 
                    
                }
                MainAjax.doPost(urlConfig.admin.permissionButtonAssociate,param).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        this.$router.push({
                            path:"jurisdictionquery"
                        })
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
            this.relation();
        },
    }
</script>
<style scoped>
    
</style>