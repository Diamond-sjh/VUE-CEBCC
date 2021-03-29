<!-- 方案列表 -->
<template>
    <div>
        <el-row class="text_right">
            <!-- 查询条件 -->
            <el-col>
                <el-row class="custquery">
                    <el-form :model="form" label-width="100px" class="demo-ruleForm" size="small">
                        <el-col :span="8">
                            <el-form-item label="方案名称">
                                <el-input v-model="form.schemeName" clearable placeholder="请输入方案名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="方案类型">
                                <el-select v-model="form.businessType" style="width:100%" clearable placeholder="请选择方案类型">
                                    <el-option label="信用卡业务" value="0"></el-option>
                                    <el-option label="综合业务" value="1"></el-option>
                                    <el-option label="存贷合一" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="方案级别">
                                <el-select v-model="form.verifyLevel" style="width:100%" clearable placeholder="请选择方案级别">
                                    <el-option label="一级" value="1"></el-option>
                                    <el-option label="二级" value="2"></el-option>
                                    <el-option label="三级" value="3"></el-option>
                                    <el-option label="四级" value="4"></el-option>
                                </el-select>
                            </el-form-item> 
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-form-item label="方案名称">
                                <el-input v-model="form.progname" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8"> 
                            <el-form-item label="方案状态">
                                <el-input v-model="form.progecode" clearable></el-input>
                            </el-form-item>
                        </el-col> -->
                    </el-form>
                    <el-col :span="24" style="text-align:center;">
                        <el-button type="primary" plain size="small" @click="programmeListData">查询</el-button>
                    </el-col>
                </el-row>
            </el-col>
            <!-- 查询列表 -->
            <el-col>
                <el-row>
                    <el-col :span="24" class="text_right">
                        <el-button type="primary" plain size="small" @click="addOrg('1','新增')">新增</el-button>
                        <el-button type="primary" plain size="small" @click="addOrg('2','修改')">修改</el-button>
                        <el-button type="primary" plain size="small" @click="delOrg">删除</el-button>
                    </el-col>
                </el-row>
                <h2 class="querylist_style border">查询结果</h2>
                <CsrTableBox :pageSize='20' pagePosition="right" :url ='postUrl' :params="params" :pageSizes="[20]"  
                    @dataChanged="dataChangedCallback"  :reloadData.sync="reloadData">
                    <template v-slot:paginationContainer>
                        <el-table  :data="tableData" tooltip-effect="dark" border  max-height="500px" stripe @current-change="handleSelectionChange" highlight-current-row>
                            <el-table-column prop="schemeName" label="方案名称" width="200"></el-table-column>
                            <el-table-column prop="businessType" label="方案类型" width=""></el-table-column>
                            <el-table-column prop="verifyLevel" label="方案级别" width=""></el-table-column>
                        </el-table>
                    </template>
                </CsrTableBox>
                
            </el-col>
        </el-row>
        <!-- 新增修改弹框 -->
        <el-dialog :title="title" :visible.sync="dialogVisible" @close="closeFun" @open="openFun" width="900px">
            <el-row>
                <el-col :span="23" class="leftmar">
                    <el-form :model="formadd" label-width="180px" :rules="rules"  ref="formadd" class="demo-ruleForm" size="small">
                        <el-col :span="12">
                            <el-form-item label="方案名称" prop="schemeName">
                                <el-input v-model="formadd.schemeName" placeholder="请输入方案名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="业务类型" prop="businessType">
                                <el-select v-model="formadd.businessType" style="width:100%" placeholder="请选择业务类型">
                                    <el-option label="信用卡业务" value="1"></el-option>
                                    <el-option label="综合业务" value="0"></el-option>
                                    <el-option label="存贷合一" value="2"></el-option>
                                    <el-option label="存贷合一与信用业务" value="21"></el-option>
                                    <el-option label="存贷合一与综合业务" value="20"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="业务级别" prop="verifyLevel">
                                <el-select v-model="formadd.verifyLevel" style="width:100%" placeholder="请选择业务级别">
                                    <el-option label="未验证" value="0"></el-option>
                                    <el-option label="一级" value="1"></el-option>
                                    <el-option label="二级" value="2"></el-option>
                                    <el-option label="三级" value="3"></el-option>
                                    <el-option label="四级" value="4"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="24" class="text_left">
                            <el-form-item label="认证方式" prop="orgtype">
                                <el-checkbox-group v-model="formadd.orgtype">
                                    <el-checkbox label="eee" name="orgtype">展示答题选项</el-checkbox>
                                    <el-checkbox label="fdgd" name="orgtype">交易密码后三位</el-checkbox>
                                    <el-checkbox label="fdgfgbf" name="orgtype">交易密码</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12">
                            <el-form-item label="选答题(道)" prop="multipleChoice">
                                <el-input v-model="formadd.multipleChoice" maxlength="30" placeholder="请输入数字 列如：5"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="必选题" prop="anserQuestions" class="text_left">
                                <el-checkbox-group v-model="formadd.anserQuestions"  style="max-height:200px;overflow:auto;">
                                    <el-checkbox  class="lulili"  v-for="item in questionList" :key="item.questionId" :label="item.questionId" name="orgtype">
                                        {{item.question}}
                                    </el-checkbox>    
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="签约电话" prop="signMobile" class="text_left">
                                <el-checkbox-group v-model="formadd.signMobile">
                                    <el-checkbox  :label="0" name="orgtype1"></el-checkbox>    
                                </el-checkbox-group>
                                <!-- <el-radio v-model="formadd.signMobile" label="0">是</el-radio>
                                <el-radio v-model="formadd.signMobile" label="1">否</el-radio> -->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="交易密码后三位" prop="tranPassLast3" class="text_left">
                                <el-checkbox-group v-model="formadd.tranPassLast3">
                                    <el-checkbox  :label="0" name="orgtype"></el-checkbox>    
                                </el-checkbox-group>
                                <!-- <el-radio v-model="formadd.tranPassLast3" label="0">是</el-radio>
                                <el-radio v-model="formadd.tranPassLast3" label="1">否</el-radio> -->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="TOKEN+签约电话" prop="tokenMobile" class="text_left">
                                <el-checkbox-group v-model="formadd.tokenMobile">
                                    <el-checkbox  :label="0" name="orgtype"></el-checkbox>    
                                </el-checkbox-group>
                                <!-- <el-radio v-model="formadd.tokenMobile" label="0">是</el-radio>
                                <el-radio v-model="formadd.tokenMobile" label="1">否</el-radio> -->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="交易密码" prop="tranPassword" class="text_left">
                                <el-checkbox-group v-model="formadd.tranPassword">
                                    <el-checkbox  :label="0" name="orgtype"></el-checkbox>    
                                </el-checkbox-group>
                                <!-- <el-radio v-model="formadd.tranPassword" label="0">是</el-radio>
                                <el-radio v-model="formadd.tranPassword" label="1">否</el-radio> -->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="查询密码" prop="queryPassword" class="text_left">
                                <el-checkbox-group v-model="formadd.queryPassword">
                                    <el-checkbox  :label="0" name="orgtype"></el-checkbox>    
                                </el-checkbox-group>
                                <!-- <el-radio v-model="formadd.queryPassword" label="0">是</el-radio>
                                <el-radio v-model="formadd.queryPassword" label="1">否</el-radio> -->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机动态密码" prop="dynamicPassword" class="text_left">
                                <el-checkbox-group v-model="formadd.dynamicPassword">
                                    <el-checkbox  :label="0" name="orgtype"></el-checkbox>    
                                </el-checkbox-group>
                                <!-- <el-radio v-model="formadd.dynamicPassword" label="0">是</el-radio>
                                <el-radio v-model="formadd.dynamicPassword" label="1">否</el-radio> -->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="交易密码(换卡不重新验证)" prop="passwordRe" class="text_left">
                                <el-checkbox-group v-model="formadd.passwordRe">
                                    <el-checkbox  :label="0" name="orgtype"></el-checkbox>    
                                </el-checkbox-group>
                                <!-- <el-radio v-model="formadd.passwordRe" label="0">是</el-radio>
                                <el-radio v-model="formadd.passwordRe" label="1">否</el-radio> -->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="交易密码(换卡需重新验证)" prop="passwordNoRe" class="text_left">
                                <el-checkbox-group v-model="formadd.passwordNoRe">
                                    <el-checkbox  :label="0" name="orgtype"></el-checkbox>    
                                </el-checkbox-group>
                                <!-- <el-radio v-model="formadd.passwordNoRe" label="0">是</el-radio>
                                <el-radio v-model="formadd.passwordNoRe" label="1">否</el-radio> -->
                            </el-form-item>
                        </el-col>
                        
                        <!-- <el-col :span="24">
                            <el-form-item label="连续录入" class="text_left" v-show="addorchange=='1'">
                                <el-radio v-model="formadd.continue" label="1">是</el-radio>
                                <el-radio v-model="formadd.continue" label="2">否</el-radio>
                            </el-form-item>
                        </el-col> -->
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-button size="small" v-show="this.addorchange=='1'" type="primary" plain  @click="addSure('formadd')">确定</el-button>
                <el-button size="small" v-show="this.addorchange=='2'" type="primary" plain  @click="changeSure('formadd')">确定</el-button>
                <el-button size="small" type="primary" plain @click="closeFun">关闭</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
import MainAjax from "@/core/utils/MainAjax";
import CsrTableBox from '@/core/components/PaginationContainer'

export default {
    components:{CsrTableBox,},
    data(){
        return{
            form:{
                schemeName:"",
                businessType:"",
                verifyLevel:"",
            },
            postUrl:urlConfig.admin.schemeQueryData,
            params:{},
            reloadData:0,
            tableData:[],
            checkTableData:[],
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
                schemeName:"",
                businessType:"",
                verifyLevel:"",
                anserQuestions:[],
                multipleChoice:"",
                signMobile:[],
                tranPassLast3:[],
                tokenMobile:[],
                tranPassword:[],
                queryPassword:[],
                dynamicPassword:[],
                passwordRe:[],
                passwordNoRe:[],
            },
            questionList:[],//必答题
            rules:{
                orgname:[{required:true,message:'请输入方案名称',trigger:'blur'},{max:20,message:'最多20个字符',trigger:'blur'}],
                //orgtype:[{required:true,message:'请选择机构类型',trigger:'change'}]
            },
        }
    },
    methods:{
        //获取选中的信息
        handleSelectionChange(val){
            console.log(val)
            this.checkTableData=val;
        },
        //方案列表
        programmeListData(){
           let data={
                schemeName:this.form.schemeName,
                businessType:this.form.businessType,
                verifyLevel:this.form.verifyLevel,
            }
            this.params=data;
            this.reloadData =1;
        },
        dataChangedCallback(response){
            console.log(response)
            this.tableData = response&&response? response.schemeList:[];
        },
        //新增修改方案
        addOrg(val,title){
            this.addorchange=val;
            this.title=title;
            if(val=='2'){
                if(this.checkTableData.length<1){
                    this.$message({
                        showClose: true,
                        message:"请选择一条记录",
                        type: 'warning'
                    });
                    return;
                }
                console.log(parseInt(this.checkTableData.passwordNoRe))
                this.dialogVisible=true;
                this.questionQueryfun();
                //console.log(this.checkTableData.anserQuestions)
                this.formadd.schemeName = this.checkTableData.schemeName;
                this.formadd.businessType = this.checkTableData.businessType;
                this.formadd.verifyLevel = this.checkTableData.verifyLevel;
                this.formadd.anserQuestions= this.checkTableData.anserQuestions.split(",");
                this.formadd.multipleChoice = this.checkTableData.multipleChoice;
                this.checkTableData.signMobile? this.formadd.signMobile.push(parseInt(this.checkTableData.signMobile)) : this.formadd.signMobile=[];
                this.checkTableData.tranPassLast3 ? this.formadd.tranPassLast3.push(parseInt(this.checkTableData.tranPassLast3)) : this.formadd.tranPassLast3=[];
                this.checkTableData.tokenMobile ? this.formadd.tokenMobile.push(parseInt(this.checkTableData.tokenMobile)) : this.formadd.tokenMobile=[];
                this.checkTableData.tranPassword ? this.formadd.tranPassword.push(parseInt(this.checkTableData.tranPassword)) : this.formadd.tranPassword=[];
                this.checkTableData.queryPassword ? this.formadd.queryPassword.push(parseInt(this.checkTableData.queryPassword)) : this.formadd.queryPassword=[];
                this.checkTableData.dynamicPassword ? this.formadd.dynamicPassword.push(parseInt(this.checkTableData.dynamicPassword)) : this.formadd.dynamicPassword=[];
                this.checkTableData.passwordRe ? this.formadd.passwordRe.push(parseInt(this.checkTableData.passwordRe)) : this.formadd.passwordRe=[];
                this.checkTableData.passwordNoRe ? this.formadd.passwordNoRe.push(parseInt(this.checkTableData.passwordNoRe)) : this.formadd.passwordNoRe=[];
                //var arr = new Array(this.formadd.verifyLevel);
            }else{
                this.dialogVisible=true;
                this.questionQueryfun();
                
            }
        },
        //删除
        delOrg(){
            if(this.checkTableData.length<1){
                this.$message({
                    showClose: true,
                    message:"请选择一条记录",
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
                        schemeId:this.checkTableData.schemeId,
                    }
                    MainAjax.doPost(urlConfig.admin.schemeModifyDelete,data).then(req =>{
                        if(req.retCode==this.$constants.returnCode.success){
                            this.$emit('resultChange',{info:{
                                type: this.$constants.optionResultType.error,
                                content:"删除成功！",
                            },flush:true});
                            this.programmeListData();
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
            this.dialogVisible=false;
            this.$nextTick(()=>{
                this.$refs.formadd.resetFields();
            })
        },
        //打开弹框时清空数据
        openFun(){
              
        },
        //新增保存
        addSure(formadd){
            this.$refs[formadd].validate((val)=>{
                    if(val){
                        let data={
                            schemeName:this.formadd.schemeName,
                            businessType:this.formadd.businessType,
                            verifyLevel:this.formadd.verifyLevel,
                            anserQuestions:this.formadd.anserQuestions.toString(),
                            multipleChoice:this.formadd.multipleChoice,
                            signMobile:this.formadd.signMobile.toString(),
                            tranPassLast3:this.formadd.tranPassLast3.toString(),
                            tokenMobile:this.formadd.tokenMobile.toString(),
                            tranPassword:this.formadd.tranPassword.toString(),
                            queryPassword:this.formadd.queryPassword.toString(),
                            dynamicPassword:this.formadd.dynamicPassword.toString(),
                            passwordRe:this.formadd.passwordRe.toString(),
                            passwordNoRe:this.formadd.passwordNoRe.toString(),
                        }
                        MainAjax.doPost(urlConfig.admin.schemeQueryAdd,data).then(req =>{
                            if(req.retCode==this.$constants.returnCode.success){
                                if(req.count=='1'){
                                    this.$alert('机构名称已存在','提示',{
                                        confirmButtonText:'确定',
                                        callback:action =>{

                                        }
                                    })
                                } else{
                                    if(this.formadd.continue=='1'){//如果连续录入
                                        this.$alert("新增成功！",'提示',{
                                            confirmButtonText:'确定',
                                            callback:action =>{
                                                 this.programmeListData();
                                            }
                                        }) 
                                    }else{
                                        this.dialogVisible=false;
                                        this.programmeListData();
                                        this.$emit('resultChange',{info:{
                                            type: this.$constants.optionResultType.success,
                                            content:"新增成功！",
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
        //查询必答题
        questionQueryfun(){
            MainAjax.doPost(urlConfig.admin.questionQuery).then(req =>{
                if(req.retCode==this.$constants.returnCode.success){
                    this.questionList=req.questionList;
                    
                }else{
                    this.$message({
                        showClose: true,
                        message:req.retMsg,
                        type: 'warning'
                    });
                }
            });
        },
        //修改保存
        changeSure(formadd){
            this.$refs[formadd].validate((val)=>{
                    if(val){
                        let data={
                            schemeId:this.checkTableData.schemeId,
                            schemeName:this.formadd.schemeName,
                            businessType:this.formadd.businessType,
                            verifyLevel:this.formadd.verifyLevel,
                            anserQuestions:this.formadd.anserQuestions.toString(),
                            multipleChoice:this.formadd.multipleChoice,
                            signMobile:this.formadd.signMobile.toString(),
                            tranPassLast3:this.formadd.tranPassLast3.toString(),
                            tokenMobile:this.formadd.tokenMobile.toString(),
                            tranPassword:this.formadd.tranPassword.toString(),
                            queryPassword:this.formadd.queryPassword.toString(),
                            dynamicPassword:this.formadd.dynamicPassword.toString(),
                            passwordRe:this.formadd.passwordRe.toString(),
                            passwordNoRe:this.formadd.passwordNoRe.toString(),
                        }
                        MainAjax.doPost(urlConfig.admin.schemeModifyChange,data).then(req =>{
                            if(req.retCode==this.$constants.returnCode.success){
                                if(req.count=='1'){
                                    this.$alert('机构名称已存在','提示',{
                                        confirmButtonText:'确定',
                                        callback:action =>{

                                        }
                                    })
                                } else{
                                    if(this.formadd.continue=='1'){//如果连续录入
                                        this.$alert("修改成功！",'提示',{
                                            confirmButtonText:'确定',
                                            callback:action =>{
                                                 this.programmeListData();
                                            }
                                        }) 
                                    }else{
                                        this.dialogVisible=false;
                                        this.programmeListData();
                                        this.$emit('resultChange',{info:{
                                            type: this.$constants.optionResultType.success,
                                            content:"修改成功！",
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
    },
    mounted() {
        this.programmeListData();
    },
}
</script>
<style>
</style>

