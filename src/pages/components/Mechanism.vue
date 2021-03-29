<!-- 机构选择弹框-->
<template>
    <div>
        <el-dialog  :title="this.title" :visible.sync="dialogname" width="450px">
            <el-tree class="heig" :data="mechanismTree" ref="tree" node-key="id"  show-checkbox :default-expanded-keys="[0]" @close="closedialog"
                :expand-on-click-node="false" :props="defaultProps" @check-change="treeCheckedNodes" accordion :default-checked-keys="checkeddata">                   
            </el-tree>
            <el-row><el-button type="primary" plain size="small"  @click="subMechanism">确定</el-button></el-row>
        </el-dialog> 
    </div>
</template>
<script>
import MainAjax from "@/core/utils/MainAjax";
export default {
    props:['title','state','checkeddata'],
    watch:{
        state(){
            if(this.state==true){
                this.mechanismquery();    
            }   
        }
    },
    data(){
        return{
            defaultProps: {
                children: 'children',
                label: 'cname',
            },
            mechanismTree:[],//机构树的数据
            dialogname:false,//是否展开弹框
            checkedkey:[],//获取选中的key
            checkedlist:[],//获取选中的数据
        }
    },
    methods:{
        //查询机构
        mechanismquery(){
            MainAjax.doPost(urlConfig.admin.orgTree).then(req =>{
                if(req.retCode==this.$constants.returnCode.success){
                    this.dialogname=true;
                    let data =[];
                    if(req.orgparentId){
                        data.push(JSON.parse(req.orgparentId));  
                        this.mechanismTree=data[0].children;
                        this.mechanismTree[0].cname="所属机构";
                        this.mechanismTree[0].id=0;
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
            this.$emit('update:state',false)
            this.dialogname=false;
        },
        //选择机构确认按钮
        subMechanism(){
            this.checkedlist=[];
            this.checkedkey=[];
            let alist =this.$refs.tree.getCheckedNodes();
            this.checkedlist=alist;
            //this.checkedkey.push(this.checkedlist[0].id)
            this.$emit('checkedNodes',this.checkedlist);
            this.closedialog();
            //this.$emit('closedialog',false)
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




