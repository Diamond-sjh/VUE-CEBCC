<!-- 组织机构 -->
<template>
    <div>
        <el-row class="text_right">
            <el-col style="margin-bottom:15px;">
                <el-button type="primary" plain size="small" @click="addOrg('1','新增')">新增</el-button>
                <el-button type="primary" plain size="small" @click="addOrg('2','修改')">修改</el-button>
                <el-button type="primary" plain size="small" @click="delOrg">删除</el-button>
            </el-col>
        </el-row>
        <el-tree :data="data4"  node-key="id" :default-expanded-keys="[0]" :props="defaultProps" @node-click='clickNodeList' :highlight-current='true'>
        </el-tree>
        <!-- 新增修改弹框 -->
        <el-dialog :title="title" :visible.sync="dialogVisible" @close="closeFun" @open="openFun" width="600px">
            <el-row>
                <el-col :span="23" class="leftmar">
                    <el-form :model="formadd" label-width="100px" :rules="rules"  ref="formadd" class="demo-ruleForm" size="small">
                        <el-col :span="24"  v-show="addorchange=='2'">
                            <el-form-item label="机构编码"  prop="orgcode"  class="text_left">
                                <span>{{formadd.orgcode}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="机构名称" prop="orgname">
                                <el-input v-model="formadd.orgname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24"  v-show="addorchange=='1'">
                            <el-form-item label="机构类型" prop="orgtype">
                                <el-select v-model="formadd.orgtype" style="width:100%" placeholder="请选择类型">
                                    <div v-show="orgtype==''">
                                        <el-option label="业务部" value="D"></el-option>
                                        <el-option label="科室" value="S"></el-option>
                                        <el-option label="小组" value="T"></el-option>
                                        <el-option label="岗位" value="P"></el-option>
                                    </div>
                                    <div v-show="orgtype=='D'">
                                        <el-option label="科室" value="S"></el-option>
                                        <el-option label="小组" value="T"></el-option>
                                        <el-option label="岗位" value="P"></el-option>
                                    </div>
                                    <div v-show="orgtype=='S'">
                                        <el-option label="小组" value="T"></el-option>
                                        <el-option label="岗位" value="P"></el-option>
                                    </div>
                                    <div v-show="orgtype=='T'">
                                        <el-option label="岗位" value="P"></el-option>
                                    </div>
                                    
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" v-show="addorchange=='2'">
                            <el-form-item label="上级机构" prop="orgparentname"  class="text_left">
                                <span>{{formadd.orgparentname}}</span>
                                <!-- <el-input v-model="formadd.orgparentname" disabled="disabled"></el-input> -->
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="备注" prop="orgremark">
                                <el-input v-model="formadd.orgremark" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="连续录入" class="text_left" v-show="addorchange=='1'">
                                <el-radio v-model="formadd.continue" label="1">是</el-radio>
                                <el-radio v-model="formadd.continue" label="2">否</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-button v-show="this.addorchange=='1'" size="small" type="primary" plain  @click="addSure('formadd')">确定</el-button>
                <el-button v-show="this.addorchange=='2'" size="small" type="primary" plain  @click="changeSure('formadd')">确定</el-button>
                <el-button size="small" type="primary" plain @click="closeFun">关闭</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
import MainAjax from "@/core/utils/MainAjax";
export default {
    data(){
        return{
            data4:[],
            defaultProps:{
                children:'children',
                label:'cname'
            },
            checkedList:[],
            title:"",
            dialogVisible:false,
            addorchange:'',//1新增 2修改
            formadd:{
                orgcode:"",
                orgname:"",
                orgtype:"",
                orgremark:"",
                orgparentname:"",
            },
            orgtype:"",
            rules:{
                orgname:[{required:true,message:'请输入机构名称',trigger:'blur'},{max:20,message:'最多20个字符',trigger:'blur'}],
                orgtype:[{required:true,message:'请选择机构类型',trigger:'change'}]
            }
        }
    },
    methods:{
        orgList(){
            MainAjax.doPost(urlConfig.admin.orgTree).then(req =>{
                if(req.retCode==this.$constants.returnCode.success){
                    if(req.orgparentId){
                        let data =[];
                        data.push(JSON.parse(req.orgparentId));  
                        this.data4=data[0].children;
                        this.data4[0].cname="中国光大银行";
                        this.data4[0].id=0;
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
        //获取选中节点的信息
        clickNodeList(node){
            this.checkedList=[];
            this.checkedList.push(node);
            console.log(this.checkedList[0].orgtype)
        },
        //新增修改机构
        addOrg(val,title){
            this.addorchange=val;
            this.title=title;
            if(this.checkedList.length<1){
                this.$message({
                    showClose: true,
                    message:"请选择一条记录",
                    type: 'warning'
                });
                return;
            }
            if(val=='1'){
                this.orgtype = this.checkedList[0].orgtype;
                if(this.checkedList[0].orgtype=='P'){
                    this.$message({
                        showClose: true,
                        message:"岗位下面无法增加新的子节点",
                        type: 'warning'
                    });
                    return;
                }
                this.dialogVisible=true;
            }else{
                this.detailOrgn();
                this.dialogVisible=true;
            }
        },
        //删除机构
        delOrg(){
            if(this.checkedList.length<1){
                this.$message({
                    showClose: true,
                    message:"请选择一条记录",
                    type: 'warning'
                });
                return;
            }
            if(this.checkedList[0].children){
                this.$message({
                    showClose: true,
                    message:"该机构下存在子机构，请先删除子机构！",
                    type: 'warning'
                });
                return;
            }

            this.$confirm('确定本次删除操作吗?','确认框',{
                    confirmButtonText:'确认',
                    cancelButtonText:"取消",
                    type:"warrning",
                }).then(()=>{
                    let data={
                        orginfoId:this.checkedList[0].id,
                    }
                    MainAjax.doPost(urlConfig.admin.delorg,data).then(req =>{
                        if(req.retCode==this.$constants.returnCode.success){
                            if(req.count=='1'){
                                this.$emit('resultChange',{info:{
                                    type: this.$constants.optionResultType.error,
                                    content:this.checkedList[0].cname+"机构下已关联用户，请先移除用户再删除该机构！",
                                },flush:true});
                            }else{
                                this.orgList();
                                this.$emit('resultChange',{info:{
                                    type: this.$constants.optionResultType.success,
                                    content:this.checkedList[0].cname+"删除成功！",
                                },flush:true});
                            }
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
        //关闭弹框
        closeFun(){
            this.formadd.orgtype='';
            this.dialogVisible=false;
        },
        //打开弹框时清空数据
        openFun(){
            this.$nextTick(()=>{
                this.$refs.formadd.resetFields();
            })   
        },
        //新增保存
        addSure(formadd){
            this.$refs[formadd].validate((val)=>{
                    if(val){
                        let data={
                            orginfoId:this.checkedList[0].id,
                            orgname:this.formadd.orgname,
                            orgtype:this.formadd.orgtype,
                            orgremark:this.formadd.orgremark,
                        }
                        MainAjax.doPost(urlConfig.admin.addorg,data).then(req =>{
                            if(req.retCode==this.$constants.returnCode.success){
                                if(req.count=='1'){
                                    this.$alert('机构名称已存在','提示',{
                                        confirmButtonText:'确定',
                                        callback:action =>{

                                        }
                                    })
                                } else{
                                    if(this.formadd.continue=='1'){//如果连续录入
                                        this.$alert("机构："+this.checkedList[0].cname+"新增成功！",'提示',{
                                            confirmButtonText:'确定',
                                            callback:action =>{
                                                this.openFun();
                                            }
                                        })
                                    }else{
                                        this.dialogVisible=false;
                                        this.orgList();
                                        this.$emit('resultChange',{info:{
                                            type: this.$constants.optionResultType.success,
                                            content:"机构："+this.checkedList[0].cname+"新增成功！",
                                        },flush:true});
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
                    }
            })   
        },
        //修改保存
        changeSure(formadd){
            this.formadd.orgtype='000';
            this.$refs[formadd].validate((val)=>{
                    if(val){
                        let data={
                            orginfoId:this.checkedList[0].id,
                            orgname:this.formadd.orgname,
                            orgremark:this.formadd.orgremark,
                        }
                        MainAjax.doPost(urlConfig.admin.saveorg,data).then(req =>{
                            if(req.retCode==this.$constants.returnCode.success){
                                if(req.count=='1'){
                                    this.$alert('本次修改的机构名称已存在','提示',{
                                        confirmButtonText:'确定',
                                        callback:action =>{

                                        }
                                    })
                                } else{
                                    this.dialogVisible=false;
                                    this.orgList();
                                    this.$emit('resultChange',{info:{
                                        type: this.$constants.optionResultType.success,
                                        content:"机构："+this.checkedList[0].cname+"修改成功！",
                                    },flush:true});
                                }
                            }else{
                                this.$message({
                                    showClose: true,
                                    message:req.retMsg,
                                    type: 'warning'
                                });
                            }
                        });
                    }
            })
            
        },
        //机构详情        
        detailOrgn(){
            let data={
                orginfoId:this.checkedList[0].id,
            }
            MainAjax.doPost(urlConfig.admin.editorg,data).then(req =>{
                if(req.retCode==this.$constants.returnCode.success){
                    this.formadd.orgcode=req.orgcode;
                    this.formadd.orgname=req.orgname;
                    this.formadd.orgremark=req.orgremark;
                    if(req.orgparentname=="root"){
                        this.formadd.orgparentname="中国光大银行";
                    }else{
                        this.formadd.orgparentname=req.orgparentname;
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
    },
    mounted() {
        this.orgList();
    },
}
</script>
<style>
</style>

