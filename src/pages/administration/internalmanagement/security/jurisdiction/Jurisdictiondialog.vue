<template>
    <div>
        <el-form class="form" ref="form" :model="form" :rules="rules" label-width="110px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="权限路径" prop="ztreeurl" class="text_left">
                        <span>{{form.ztreeurl}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="权限编号" prop="code" class="text_left">
                        <span>{{form.code}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="权限名称" prop="permName">
                        <el-input v-model="form.permName" placeholder="请输入权限名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="页面提示" prop="title">
                        <el-input v-model="form.title" maxlength="100" placeholder="请输入页面提示"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="target" prop="target">
                        <el-input v-model="form.target" placeholder="请输入target"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="form.status" placeholder="请选择状态" style="width:100%;">
                            <el-option label="无效" value="0"></el-option>
                            <el-option label="有效" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="序号" prop="orderNo">
                        <el-input v-model.number="form.orderNo" placeholder="请输入序号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="类型" prop="permType">
                        <el-select v-model="form.permType" placeholder="请选择类型" style="width:100%;">
                            <el-option label="菜单" value="M"></el-option>
                            <el-option label="按钮" value="B"></el-option>
                            <el-option label="超链接" value="A"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="技术菜单类型" prop="menuType">
                        <el-select v-model="form.menuType" placeholder="请选择类型" style="width:100%;">
                            <el-option label="前台菜单" value="1"></el-option>
                            <el-option label="后台菜单" value="2"></el-option>
                            <el-option label="系统菜单" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-show="form.permType=='B'">
                    <el-form-item label="样式" prop="style">
                        <el-select v-model="form.style" placeholder="请选择样式" style="width:100%;">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-show="form.permType=='B'">
                    <el-form-item label="自动显示" prop="autoDisplaySign">
                        <el-select v-model="form.autoDisplaySign" placeholder="请选择自动显示" style="width:100%;">
                            <el-option label="无效" value="0"></el-option>
                            <el-option label="有效" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-show="form.permType=='B'">
                    <el-form-item label="按钮类型" prop="buttonType">
                        <el-select v-model="form.buttonType" placeholder="请选择按钮类型" style="width:100%;">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-show="form.permType=='B'">
                    <el-form-item label="宽度" prop="width">
                        <el-input v-model="form.width" placeholder="请输入宽度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-show="form.permType=='B'">
                    <el-form-item label="高度" prop="height">
                        <el-input v-model="form.height" placeholder="请输入高度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-show="form.permType=='B'">
                    <el-form-item label="有效性" prop="doCommand">
                        <el-select v-model="form.doCommand" placeholder="请选择有效性" style="width:100%;">
                            <el-option label="more" value="2"></el-option>
                            <el-option label="confirm" value="3"></el-option>
                            <el-option label="noConfirm" value="9"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-show="form.permType=='B'">
                    <el-form-item label="重复提交" prop="tokenValid">
                        <el-select v-model="form.tokenValid" placeholder="请选择重复提交" style="width:100%;">
                            <el-option label="不检查" value="0"></el-option>
                            <el-option label="检查" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-show="form.permType=='B'">
                    <el-form-item label="onmouseover" prop="onmouseover">
                        <el-input v-model="form.onmouseover" placeholder="请输入onmouseover"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-show="form.permType=='B'">
                    <el-form-item label="onmouseout" prop="name">
                        <el-input v-model="form.name" placeholder="请输入onmouseout"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="操作帮助" prop="operationMotion">
                        <el-input v-model="form.operationMotion" maxlength="1000" placeholder="请输入操作帮助"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="url" prop="url">
                        <el-input v-model="form.url" max="255" placeholder="请输入url"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-show="form.permType=='B'">
                    <el-form-item label="onclick" prop="onclick">
                        <el-input v-model="form.onclick" placeholder="请输入onclick"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-button type="primary" plain size="small" @click="preservationbtu('form')">确定</el-button>
        <el-button type="primary" plain size="small" @click="retrunbut">关闭</el-button>
    </div>
</template>
<script>
import MainAjax from "@/core/utils/MainAjax";
export default {
    props:['permissionInfoId','parenturlarr','andorchange'],
    data(){
        return{
            isform:"0",
            value: [1, 4],
            form:{
                ztreeurl:"",
                name:"",
                code:"",
                permName:"",
                title:"",
                target:"",
                status:"1",
                orderNo:'',
                permType:"M",
                style:"",
                autoDisplaySign:"1",
                buttonType:"",
                width:"",
                height:"",
                doCommand:"",
                tokenValid:"0",
                onmouseover:"",
                operationMotion:"",
                url:"",
                onclick:"",
                menuType:"",
            },
            rules:{
                permName:[{required:true,message:'请输入权限名称',trigger:'blur'},{min:1,max:50,message:'最多输入50个字符',trigger:'blur'}],
                orderNo:[{required:true,message:'请输入序号',trigger:'blur'},{type:'number',message:'序号必须为数字'}],
                menuType:[{required:true,message:'请输选择技术菜单类型',trigger:'change'}],
            },
            dialogVisible:false,
            parenturl:"",
            

        }
    },
    methods:{
        retrunbut(){
            this.$emit('closeform' ,this.dialogVisible,);
        },
        //保存按钮
        preservationbtu(form){
            if(this.andorchange=="add"){
                this.addbtn(form);
            }else if(this.andorchange=="change"){
                this.changebtn(form);
            }
        },
        //修改保存
        changebtn(form){
           this.$refs[form].validate((val)=>{
                    if(val){
                        let param={
                            permissionInfoId:this.permissionInfoId,
                            //ztreeurl:this.form.ztreeurl,
                            name:this.form.name,
                            //code:this.form.code,
                            permName:this.form.permName,
                            title:this.form.title,
                            target:this.form.target,
                            status:this.form.status,
                            orderNo:this.form.orderNo.toString(),
                            permType:this.form.permType,
                            style:this.form.style,
                            autoDisplaySign:this.form.autoDisplaySign,
                            buttonType:this.form.buttonType,
                            width:this.form.width,
                            height:this.form.height,
                            doCommand:this.form.doCommand,
                            tokenValid:this.form.tokenValid,
                            onmouseover:this.form.onmouseover,
                            operationMotion:this.form.operationMotion,
                            url:this.form.url,
                            onclick:this.form.onclick,
                            menuType:this.form.menuType
                        }
                        MainAjax.doPost(urlConfig.admin.permissionMenuUpdate,param).then(req =>{
                            if(req.retCode==this.$constants.returnCode.success){
                                this.$message({
                                    showClose: true,
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.$emit('closeform' ,this.dialogVisible,'change');
                            }else{
                                this.$message({
                                    showClose: true,
                                    message: '修改失败',
                                    type: 'waring'
                                });
                            }
                        });
                    }
           })
            
        },
        //新增保存
        addbtn(form){
            this.$refs[form].validate((val)=>{
                    if(val){
                        let param={
                            permParentId:this.permissionInfoId,
                            //ztreeurl:this.form.ztreeurl,
                            name:this.form.name,
                            //code:this.form.code,
                            permName:this.form.permName,
                            title:this.form.title,
                            target:this.form.target,
                            status:this.form.status,
                            orderNo:this.form.orderNo.toString(),
                            permType:this.form.permType,
                            style:this.form.style,
                            autoDisplaySign:this.form.autoDisplaySign,
                            buttonType:this.form.buttonType,
                            width:this.form.width,
                            height:this.form.height,
                            doCommand:this.form.doCommand,
                            tokenValid:this.form.tokenValid,
                            onmouseover:this.form.onmouseover,
                            operationMotion:this.form.operationMotion,
                            url:this.form.url,
                            onclick:this.form.onclick,
                            menuType:this.form.menuType
                        }
                        MainAjax.doPost(urlConfig.admin.permissionMenuAddsub,param).then(req =>{
                            if(req.retCode==this.$constants.returnCode.success){
                                this.$message({
                                    showClose: true,
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.$emit('closeform' ,this.dialogVisible,'change');
                            }else{
                                this.$message({
                                    showClose: true,
                                    message: '新增失败',
                                    type: 'waring'
                                });
                            }
                        });
                    }
            })
            
        },
        //权限详情
        jurisdictiondtetail(){
            let param = {
                "permissionInfoId": this.permissionInfoId
            }
            MainAjax.doPost(urlConfig.admin.permissionQuery,param).then(req =>{
                if(req.retCode==this.$constants.returnCode.success){
                    //this.form.ztreeurl=req.ztreeurl;
                    this.form.name=req.name;
                    this.form.code=req.code;
                    this.form.permName=req.permName;
                    this.form.title=req.title;
                    this.form.target=req.target;
                    this.form.status=req.status;
                    this.form.orderNo=Number(req.orderNo);
                    this.form.permType=req.permType;
                    this.form.style=req.style;
                    this.form.autoDisplaySign=req.autoDisplaySign;
                    this.form.buttonType=req.buttonType;
                    this.form.width=req.width;
                    this.form.height=req.height;
                    this.form.doCommand=req.doCommand;
                    this.form.tokenValid=req.tokenValid;
                    this.form.onmouseover=req.onmouseover;
                    this.form.operationMotion=req.operationMotion;
                    this.form.url=req.url;
                    this.form.onclick=req.onclick;
                    this.form.menuType=req.menuType;
                }
            });
        },
        //获取路径
        ztreeurlfun(){
            console.log("aaaa"+this.parenturlarr.reverse())
            //this.parenturl = this.parenturlarr.reverse().toString();//权限url倒叙后转为字符串；
            this.parenturl = this.parenturlarr.toString();//权限url倒叙后转为字符串；
            this.parenturl = this.parenturl.replace(/,/g,'/');//字符串，换成/；
            this.parenturl=this.parenturl.concat('/')//字符串末尾添加/；
            this.form.ztreeurl=this.parenturl;
        },
        //清楚表单数据
        cleanForminput(){
            this.$nextTick(()=>{
                this.$refs.form.resetFields(); 
            })
        }

    },
    mounted(){
        
        
    },
}
</script>
<style scoped>
    .text_left{
        text-align: left;
    }
    .form{
        margin:20px 0px 20px 10px;
    }
    .el-form-item{
        margin-bottom: 15px;
    }
    .el-transfer-panel_list{
        text-align: left;
    }
</style>