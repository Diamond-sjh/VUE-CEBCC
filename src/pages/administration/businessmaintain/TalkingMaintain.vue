<!-- 话术维护 -->
<template>
    <div class="main">
        <el-row>
            <el-col>
                <el-tree :data="data4"  node-key="id" :expand-on-click-node="false" :props="defaultProps" :default-expanded-keys="[0]" show-checkbox @check-change="handlecheckbox" >
                    <span class="custom-tree-node" slot-scope="{ node, data }" style="flex: 1; display: flex; align-items: center; justify-content: space-between;font-size: 14px; padding-right: 8px;">
                        <span>{{ node.label }}</span>
                        <span><!--v-show="data.permType=='B'" -->
                            <el-button v-show="data.id!=0" style="font-size: 12px;font-weight:400;" class="dataTableStyle" type="text" size="mini" @click="() => changeTalking(node, data,'change')">编辑</el-button>
                        </span>
                    </span>
                </el-tree>
            </el-col>
        </el-row>
        <!-- 新增弹窗开始 -->
        <el-dialog title="编辑话术" :visible.sync="dialogShow" width="60%">
        <el-row>
          <el-form :model="form_add" label-width="140px" ref="form_add"  class="demo-ruleForm">
            <el-col :span="11">
                <el-form-item label="权限名称" prop="permName">
                    <el-input v-model="form_add.permName" clearable placeholder="请输入座席分类编码" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="11">
                <el-form-item label="页面提示" prop="title">
                    <el-input v-model="form_add.title" clearable  placeholder="请输入座席分类号" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="11">
                <el-form-item label="类型" prop="permType">
                    <el-select v-model="form_add.permType" placeholder="请选择类型" style="width:100%;" disabled>
                            <el-option label="菜单" value="M"></el-option>
                            <el-option label="按钮" value="B"></el-option>
                            <el-option label="超链接" value="A"></el-option>
                        </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="状态" class="text_left">
                  <el-select v-model="form_add.status" placeholder="请选择状态" style="width:100%;" disabled>
                            <el-option label="无效" value="0"></el-option>
                            <el-option label="有效" value="1"></el-option>
                        </el-select> 
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="序号">
                <el-select v-model="form_add.orderNo" style="width:100%" placeholder="请选择座席分类状态" disabled>
                    <el-option label="有效" value="1"></el-option>
                    <el-option label="无效" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="小桔灯" class="text_left">
                <el-button  type="primary" plain size="small" @click="apendinput">添加</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-row v-for="(item , index) in inputlist" :key="index">
                    <el-col :span="1" class="text_right" style="margin-top:40px;" ><span @click="deleteinput(index)">删除</span></el-col>
                    <el-col :span="22"  class="text_left">
                        <el-form-item :label="'主题'+index" class="text_left" >
                            <el-input  v-model="item.theme"  ref="theme_value" :data-themePointId="ppp" clearable placeholder="请输入主题"></el-input>
                        </el-form-item>
                        <el-form-item label="提示" class="text_left">
                            <el-input type="textarea" v-model="item.pointout" ref="pointout_value" clearable placeholder="请输入提示"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-col>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:center;">
            <el-button type="primary" plain size="small" @click="addTalking">确认</el-button>
            <el-button type="primary" plain size="small" >返回</el-button> 
          </el-col>
        </el-row>
        </el-dialog>
    </div>
</template>
<script>

    import MainAjax from "@/core/utils/MainAjax";
    export default {
        name:"talkingmaintain",
        data(){
            return{
                //树结构
                data4:[],//权限树
                defaultProps: {
                    children: 'children',
                    label: 'cname',
                }, 
                andorchange:"",//新增修改标示
                parenturlarr:[],//树当前节点url
                form:{},
                //编辑
                dialogShow:false,
                form_add:{
                    permName:"",
                    title:"",
                    permType:"",
                    status:"",
                    orderNo:"",
                },
                inputlist:[
                    {theme:"",pointout:""}
                ],
                id:"",
                ppp:'llll'
            }
        },
        methods:{
            //获取当前点击树节点的信息
            handlecheckbox(data){
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
            changeTalking(node,data){
                this.dialogShow=true;
                this.detailTalking(data.id);
                this.jurisdictiondtetail(data.id);
                this.id=data.id;
            },
            //添加input
            apendinput(){
                this.inputlist.push({theme:"",pointout:""})
            },
            //删除input
            deleteinput(index){
                alert(index)
                this.inputlist.splice(index,1)

            },
            //保存
            addTalking(){
                console.log(this.$refs.theme_value)
                console.log(this.$refs.pointout_value)
                console.log(this.$refs.theme_value['data-themePointId'])
                
                let theme=this.$refs.theme_value;
                let pointout=this.$refs.pointout_value;
                let themePointList=[];
                for(var i=0;i<theme.length;i++){
                    for(var j=0;j<pointout.length;j++){
                        if(i==j){
                            themePointList.push(
                                {
                                    themePointId:"",
                                    themeCode:this.id,
                                    theme:theme[i].nativeInputValue,
                                    pointout:pointout[i].nativeInputValue,
                                    orderNo:i.toString(),
                                }
                            )
                        }    
                    }
                }
                let data={
                    themePointList:themePointList,
                    delThemePlintList:[]
                }
                console.log(data)
                return;
                MainAjax.doPost(urlConfig.admin.updateThemePointList,data).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        if(req.permissionTreeData){
                            this.$emit('resultChange',{info:[
                            {
                                type: this.$constants.optionResultType.success,
                                content:"新增成功!",
                            }
                            ],flush:true});
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
            //权限详情
            jurisdictiondtetail(id){
                let param = {
                    "permissionInfoId": id
                }
                MainAjax.doPost(urlConfig.admin.permissionQuery,param).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                        this.form_add.permName=req.permName;
                        this.form_add.title=req.title;
                        this.form_add.permType=req.permType; 
                        this.form_add.status=req.status;
                        this.form_add.orderNo=req.orderNo;
                    }
                });
            },
            //详情
            detailTalking(id){
                let data={
                    themeCode:id
                }
                MainAjax.doPost(urlConfig.admin.getThemePointList,data).then(req =>{
                    if(req.retCode==this.$constants.returnCode.success){
                       
                            this.inputlist=[];
                            this.inputlist=req.themePointList;
                            console.log(req);
                        
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
            closedialog(data,change){
                this.$refs.child.cleanForminput();//清楚数据
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

