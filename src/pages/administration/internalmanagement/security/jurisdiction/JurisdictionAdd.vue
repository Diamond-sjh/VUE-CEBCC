<template>
    <div >
        <el-form class="form" ref="form" :model="form" label-width="200px">
            <el-row>
                <el-col :span="11">
                    <el-form-item label="权限路径">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="权限编号">
                        <el-input v-model="form.code"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="权限名称">
                        <el-input v-model="form.permName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="页面提示">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="target">
                        <el-input v-model="form.target"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="状态">
                        <el-select v-model="form.status" placeholder="请选择活动区域" style="width:100%;">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="序号">
                        <el-input v-model="form.orderNo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="类型">
                        <el-select v-model="form.permType" placeholder="请选择活动区域" style="width:100%;">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="样式">
                        <el-select v-model="form.style" placeholder="请选择活动区域" style="width:100%;">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="自动显示">
                        <el-select v-model="form.autoDisplaySign" placeholder="请选择活动区域" style="width:100%;">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="按钮类型">
                        <el-select v-model="form.buttonType" placeholder="请选择活动区域" style="width:100%;">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="宽度">
                        <el-input v-model="form.width"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="高度">
                        <el-input v-model="form.height"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="有效性">
                        <el-select v-model="form.doCommand" placeholder="请选择活动区域" style="width:100%;">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="重复提交">
                        <el-select v-model="form.tokenValid" placeholder="请选择活动区域" style="width:100%;">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="onmouseover">
                        <el-input v-model="form.onmouseover"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="onmouseout">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="操作帮助">
                        <el-input v-model="form.operationMotion"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="url">
                        <el-input v-model="form.url"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="onclick">
                        <el-input v-model="form.onclick"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!--<el-row v-show="isform=='1'" style="margin-top:15px;">
                <el-col :span="11">
                    <el-form-item label="业务类型">
                        <el-input v-model="form.operationType"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="客户是否存在标志">
                        <el-input v-model="form.extCustomerSign"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="账户/卡片是否存在标志">
                        <el-input v-model="form.extCardSign"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="副卡不允许操作标志">
                        <el-input v-model="form.extCardPermission"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="是否允许离线操作">
                        <el-input v-model="form.offlineSign"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="需要身份验证标志">
                        <el-input v-model="form.verify"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="信用业务身份验证等级">
                        <el-input v-model="form.creditLevel"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="认证方式">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="综合业务身份验证等级">
                        <el-input v-model="form.debitLevel"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="认证方式">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="存贷合一身份验证等级">
                        <el-input v-model="form.dangerLevel"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="认证方式">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="副卡操作需主卡验证">
                        <el-input v-model="form.masterVerify"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片不可操作状态">
                        <el-input v-model="form.cardStatus"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片不可操作锁定码">
                        <el-input v-model="form.cardForbidBlockCode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片提示操作锁定码">
                        <el-input v-model="form.cardClewBlockCode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="人民币账户不可操作锁定码1">
                        <el-input v-model="form.rmbAccForbidBlockCode1"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="人民币账户不可操作锁定码2">
                        <el-input v-model="form.rmbAccForbidBlockCode2"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="外币账户不可操作锁定码1">
                        <el-input v-model="form.dollarAccForbidBlockCode1"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="外币币账户不可操作锁定码2">
                        <el-input v-model="form.dollarAccForbidBlockCode2"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="客户层信用额度">
                        <el-input v-model="form.customerCreditLimit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="人民币层信用额度">
                        <el-input v-model="form.rmbAccCreditLimit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="外币账户层信用额度">
                        <el-input v-model="form.dollarAccCreditLimit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="机构编号">
                        <el-input v-model="form.org"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="保证金卡片禁用标志">
                        <el-input v-model="form.depositSign"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片性质">
                        <el-input v-model="form.cardSpec"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片类型">
                        <el-input v-model="form.cardType"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片过期预警期限(月)">
                        <el-input v-model="form.cardExpireDate"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="凭证类型">
                        <el-input v-model="form.warrantType"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="签约理财标志">
                        <el-input v-model="form.appointFinanceSign"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="签约电话标志">
                        <el-input v-model="form.appointPhoneSign"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="需要安全黑名单验证标志">
                        <el-input v-model="form.blackCustSign"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡bin限制">
                        <el-input v-model="form.cardBinLimit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="外围业务限制">
                        <el-input v-model="form.outBusiLimit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡类型编号">
                        <el-input v-model="form.cardTypeId"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="loge与企业loge">
                        <el-input v-model="form.cardLogo"></el-input>
                    </el-form-item>
                    
                </el-col>
                <el-col :span="11">
                    <el-form-item label="币种">
                        <el-input v-model="form.operationCardType"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="无卡进线是否升二级">
                        <el-input v-model="form.cardIsUpTwo"></el-input>
                    </el-form-item>
                </el-col>
                
            </el-row>-->
        </el-form>
        <el-button @click="butadd">保存</el-button>
        <el-button @click="retrunbut">返回</el-button>
    </div>
</template>
<script>
export default {
    data(){
        return{
            isform:"0",
            value: [1, 4],
            form:{
                name:"",
                code:"",
                permName:"",
                title:"",
                target:"",
                status:"",
                orderNo:"",
                permType:"",
                style:"",
                autoDisplaySign:"",
                buttonType:"",
                width:"",
                height:"",
                doCommand:"",
                tokenValid:"",
                onmouseover:"",
                operationMotion:"",
                url:"",
                onclick:"",
                //////
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
            }

        }
    },
    methods:{
        retrunbut(){
            this.$router.push({path:'jurisdictionquery'});
        },
        butadd(){
            console.log(this.form)
        },
        showmoreform(){
            this.isform="1";
        },
        closmoreform(){
            this.isform="0";
        },
    },
    mounted(){
        //console.log(this.$route.query);
    },
}
</script>
<style scoped>
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