<template>
    <div>
        <div>
            <el-row style="text-align:right;">
                <el-button type="success" plain @click="strategySetting">策略配置</el-button>
            </el-row>
            
            <el-tree :data="data4"  node-key="id" :expand-on-click-node="false" :props="defaultProps" :default-expanded-keys="[0]">
            </el-tree>
        </div>
        <el-dialog title="策略应用" :visible.sync="dialogVisible" width="60%" @open="openFun" @close="closeDialog">
            <el-container>
        <el-form class="form" ref="form" :model="form" :rules="rules" label-width="200px" style="height:550px;overflow:auto;">
            <el-row style="margin-top:15px;">
                <el-col :span="11">
                    <el-form-item label="业务类型" prop="operationType">
                        <el-select v-model="form.operationType" style="width:100%" placeholder="请选择业务类型">
                            <el-option label="信用卡业务" value="1"></el-option>
                            <el-option label="综合业务" value="0"></el-option>
                            <el-option label="存贷合一" value="2"></el-option>
                            <el-option label="存贷合一与信用业务" value="21"></el-option>
                            <el-option label="存贷合一与综合业务" value="20"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="客户是否存在标志"  prop="extCustomerSign">
                        <el-select v-model="form.extCustomerSign" style="width:100%" placeholder="请选择客户是否存在标志">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="账户/卡片是否存在标志" prop="extCardSign">
                        <el-select v-model="form.extCardSign" style="width:100%" placeholder="请选择账户/卡片是否存在标志">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="副卡不允许操作标志" prop="extCardPermission">
                        <el-select v-model="form.extCardPermission" style="width:100%" placeholder="请选择副卡不允许操作标志">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="是否允许离线操作" prop="extCardSign">
                        <el-select v-model="form.offlineSign" style="width:100%" placeholder="请选择是否允许离线操作">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="需要身份验证标志" prop="extCardSign">
                        <el-select v-model="form.verify" style="width:100%" placeholder="请选择需要身份验证标志">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="信用业务身份验证等级" prop="extCardSign">
                        <el-select v-model="form.creditLevel" style="width:100%" placeholder="请选择信用业务身份验证等级">
                            <el-option label="未验证" value="0"></el-option>
                            <el-option label="一级" value="1"></el-option>
                            <el-option label="二级" value="2"></el-option>
                            <el-option label="三级" value="3"></el-option>
                            <el-option label="四级" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="认证方案" prop="extCardSign">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="综合业务身份验证等级" prop="extCardSign">
                        <el-select v-model="form.debitLevel" style="width:100%" placeholder="请选择综合业务身份验证等级">
                            <el-option label="未验证" value="0"></el-option>
                            <el-option label="一级" value="1"></el-option>
                            <el-option label="二级" value="2"></el-option>
                            <el-option label="三级" value="3"></el-option>
                            <el-option label="四级" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="认证方案" prop="extCardSign">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="存贷合一身份验证等级" prop="extCardSign">
                        <el-select v-model="form.dangerLevel" style="width:100%" placeholder="请选择存贷合一身份验证等级">
                            <el-option label="未验证" value="0"></el-option>
                            <el-option label="一级" value="1"></el-option>
                            <el-option label="二级" value="2"></el-option>
                            <el-option label="三级" value="3"></el-option>
                            <el-option label="四级" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="认证方案" prop="extCardSign">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="副卡操作需主卡验证" prop="extCardSign">
                        <el-select v-model="form.masterVerify" style="width:100%" placeholder="请选择副卡操作需主卡验证">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片不可操作状态" prop="extCardSign">
                        <el-input v-model="form.cardStatus" placeholder="请输入卡片不可操作状态"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片不可操作锁定码" prop="extCardSign">
                        <el-input v-model="form.cardForbidBlockCode" placeholder="请输入卡片不可操作锁定码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片提示操作锁定码" prop="extCardSign">
                        <el-input v-model="form.cardClewBlockCode" placeholder="请输入卡片提示操作锁定码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="人民币账户不可操作锁定码1" prop="extCardSign">
                        <el-input v-model="form.rmbAccForbidBlockCode1" placeholder="请输入人民币账户不可操作锁定码1"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="人民币账户不可操作锁定码2" prop="extCardSign">
                        <el-input v-model="form.rmbAccForbidBlockCode2" placeholder="请输入人民币账户不可操作锁定码2"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="外币账户不可操作锁定码1" prop="extCardSign">
                        <el-input v-model="form.dollarAccForbidBlockCode1" placeholder="请输入外币账户不可操作锁定码1"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="外币币账户不可操作锁定码2" prop="extCardSign">
                        <el-input v-model="form.dollarAccForbidBlockCode2" placeholder="请输入外币币账户不可操作锁定码2"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="客户层信用额度" prop="extCardSign">
                        <el-input v-model="form.customerCreditLimit" placeholder="请输入客户层信用额度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="人民币层信用额度" prop="extCardSign">
                        <el-input v-model="form.rmbAccCreditLimit" placeholder="请输入人民币层信用额度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="外币账户层信用额度" prop="extCardSign">
                        <el-input v-model="form.dollarAccCreditLimit" placeholder="请输入外币账户层信用额度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="机构编号" prop="extCardSign">
                        <el-input v-model="form.org" placeholder="请输入机构编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="保证金卡片禁用标志" prop="extCardSign">
                        <el-select v-model="form.depositSign" style="width:100%" placeholder="请选择保证金卡片禁用标志">
                            <el-option label="不允许" value="1"></el-option>
                            <el-option label="允许" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片性质" prop="extCardSign">
                        <el-input v-model="form.cardSpec" placeholder="请输入卡片性质"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片类型" prop="extCardSign">
                        <el-input v-model="form.cardType" placeholder="请输入卡片类型"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片过期预警期限(月)" prop="extCardSign">
                        <el-input v-model="form.cardExpireDate" placeholder="请输入卡片过期预警期限"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="凭证类型" prop="extCardSign">
                        <el-input v-model="form.warrantType" placeholder="请输入凭证类型"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="签约理财标志" prop="extCardSign">
                        <el-select v-model="form.appointFinanceSign" style="width:100%" placeholder="请选择签约理财标志">
                            <el-option label="无需签约" value="0"></el-option>
                            <el-option label="需签约电话银行代客理财" value="1"></el-option>
                            <el-option label="需签约电话银行代客理财或令牌" value="2"></el-option>
                            <el-option label="令牌及签约手机号" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="签约电话标志" prop="extCardSign">
                        <el-select v-model="form.appointPhoneSign" style="width:100%" placeholder="请选择签约电话标志">
                            <el-option label="无需签约" value="0"></el-option>
                            <el-option label="需签约" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="需要安全黑名单验证标志" prop="extCardSign">
                        <el-select v-model="form.blackCustSign" style="width:100%" placeholder="请选择需要安全黑名单验证标志">
                            <el-option label="否" value="0"></el-option>
                            <el-option label="是" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡bin限制" prop="extCardSign">
                        <el-input v-model="form.cardBinLimit" placeholder="请输入卡bin限制"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="外围业务限制" prop="extCardSign">
                        <el-select v-model="form.outBusiLimit" style="width:100%" placeholder="请选择外围业务限制">
                            <el-option label="基金开通" value="0"></el-option>
                            <el-option label="外汇宝开通" value="2"></el-option>
                            <el-option label="第三方存管开通" value="12"></el-option>
                            <el-option label="贵金属开通" value="14"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡类型编号" prop="extCardSign">
                        <el-input v-model="form.cardTypeId" placeholder="请输入卡类型编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="loge与企业loge" prop="extCardSign">
                        <el-input v-model="form.cardLogo" placeholder="请输入loge与企业loge"></el-input>
                    </el-form-item>
                    
                </el-col>
                <el-col :span="11">
                    <el-form-item label="币种" prop="extCardSign">
                        <el-input v-model="form.operationCardType" placeholder="请输入币种"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="无卡进线是否升二级" prop="extCardSign">
                        <el-select v-model="form.cardIsUpTwo" style="width:100%" placeholder="请输入无卡进线是否升二级">
                            <el-option label="自动升为2级" value="A"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        </el-container>
        <el-row>
            <el-col :span="24" style="text-align:center;">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button  type="success" @click="adminaddSub('form')">确定</el-button> 
            </el-col>
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
            defaultProps: {
                children: 'children',
                label: 'cname',
            },
            dialogVisible:false,
            form:{
                operationType:"",
                extCustomerSign:"",
                extCardSign:"",
                extCardPermission:"",
                offlineSign:"",
                verify:"",
                creditLevel:"",
                debitLevel:"",
                dangerLevel:"",
                masterVerify:"",
                cardStatus:"",
                cardForbidBlockCode:"",
                cardClewBlockCode:"",
                rmbAccForbidBlockCode1:"",
                rmbAccForbidBlockCode2:"",
                dollarAccForbidBlockCode1:"",
                dollarAccForbidBlockCode2:"",
                customerCreditLimit:"",
                rmbAccCreditLimit:"",
                dollarAccCreditLimit:"",
                org:"",
                depositSign:"",
                cardSpec:"",
                cardType:"",
                cardExpireDate:"",
                warrantType:"",
                appointFinanceSign:"",
                appointPhoneSign:"",
                blackCustSign:"",
                cardBinLimit:"",
                outBusiLimit:"",
                cardTypeId:"",
                cardLogo:"",
                operationCardType:"",
                cardIsUpTwo:"",
            },
            rules:{
                permName:[{required:true,message:'请输入权限名称',trigger:'blur'},{min:1,max:50,message:'最多输入50个字符',trigger:'blur'}],
                orderNo:[{required:true,message:'请输入序号',trigger:'blur'},{type:'number',message:'序号必须为数字'}],
            },
            

        }
    },
    methods:{
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
        strategySetting(){
            this.dialogVisible=true;
        },
        adminaddSub(){},
        openFun(){},
        closeDialog(){
            this.$nextTick(()=>{
                this.$refs.form.resetFields(); 
            })
        },
        //清楚表单数据
        cleanForminput(){
            this.$nextTick(()=>{
                this.$refs.form.resetFields(); 
            })
        }

    },
    mounted(){
        this.jurisdictionList();
        
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