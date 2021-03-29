<!-- 行政级别选择弹框-->
<template>
    <div>
        <el-dialog  :title="this.title" :visible.sync="dialogname" width="450px" @close="closedialog">
            <el-tree class="heig" :data="AdministrativeLevelTree" ref="tree" node-key="id"  show-checkbox :default-checked-keys="checkeddata"
                :expand-on-click-node="false" :props="defaultProps" @check-change="treeCheckedNodes" accordion :default-expanded-keys="[0]">                   
            </el-tree>
            <el-row><el-button type="primary" plain size="small"  @click="checkAdminTree">确定</el-button></el-row>
        </el-dialog> 
    </div>
</template>
<script>
import MainAjax from "@/core/utils/MainAjax";
export default {
    props:['title','AdminiLevelState','checkeddata'],
    watch:{
        AdminiLevelState(){
            if(this.AdminiLevelState==true){
                this.administrativeLevelQuery();    
            }   
        }
    },
    data(){
        return{
            defaultProps: {
                children: 'children',
                label: 'cname',
            },
            AdministrativeLevelTree:[],//行政级别树的数据
            dialogname:false,//是否展开弹框
            checkedkey:[],//获取选中的key
            checkedlist:[],//获取选中的数据
        }
    },
    methods:{
        //行政级别
        administrativeLevelQuery(){
            MainAjax.doPost(urlConfig.admin.dutyTree).then(req =>{
                if(req.retCode==this.$constants.returnCode.success){
                    this.dialogname=true;
                    let data =[];
                    if(req.parentId){
                        data.push(JSON.parse(req.parentId));  
                        data[0].cname="行政级别";
                        data[0].id=0;
                        this.AdministrativeLevelTree=data;
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
        //单选
        treeCheckedNodes(data,checked){
            if(checked){
                this.$refs.tree.setCheckedNodes([data]);
            }
        },
        //关闭弹框
        closedialog(){
            this.$emit('update:AdminiLevelState',false);
            this.dialogname=false;
        },
        //选择行政级别确认按钮
        checkAdminTree(){
            this.checkedlist=[];
            this.checkedkey=[];
            let alist =this.$refs.tree.getCheckedNodes();
            this.checkedlist=alist;
            this.checkedkey.push(this.checkedlist[0].id)
            this.$emit('adminiLevelcheckedNodes',this.checkedlist);
            this.closedialog();
            //this.$emit('adminiLevelclosedialog',false)
        },
    },   
}
</script>
<style scoped>
    .heig{
        max-height: 300px;
        overflow: auto;
        margin-bottom:15px;
    }
</style>




