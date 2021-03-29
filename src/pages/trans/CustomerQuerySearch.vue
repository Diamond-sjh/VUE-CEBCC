<template>
    <!--语音座席进线查询内容框  -->
    <div class="customer-query-search pt20">
        <!-- <el-row type="flex" justify="end" class="pb20">
                <el-button type="primary" @click="submitBtnClickHandler">查询</el-button>
                <el-button type="primary" >视频手工进线</el-button>
        </el-row> -->
        <el-form :inline="true" :model="queryInfo">
            <el-form-item >
                <el-select v-model="queryInfo.warrantType" placeholder="请选择进线类型">
                    <el-option label="账号/卡号" :value="$constants.customer.TRANS_WARRANT_TYPE_WARRANT"></el-option>
                    <el-option label="证件号" :value="$constants.customer.TRANS_WARRANT_TYPE_IDCARD"></el-option>
                    <el-option label="客户号" :value="$constants.customer.TRANS_WARRANT_TYPE_CUSTNO"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item  v-show="queryInfo.warrantType == $constants.customer.TRANS_WARRANT_TYPE_IDCARD">
                <el-select v-model="queryInfo.operationType" placeholder="请选择业务类型">
                    <el-option label="信用卡业务" :value="$constants.customer.CREDIT_BUSSINESS_TYPE"></el-option>
                    <el-option label="综合业务" :value="$constants.customer.DEBIT_BUSSINESS_TYPE"></el-option>
                    <el-option label="存贷合一" :value="$constants.customer.CREDIT_DEBIT_BUSSINESS_TYPE"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-show="queryInfo.operationType == $constants.customer.DEBIT_BUSSINESS_TYPE">
                <el-select v-model="queryInfo.crtType" placeholder="请选择证件类型">
                    <el-option v-for="it in crtTypeLst" :key="it.value"  :label="it.label" :value="it.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input  v-model="queryInfo.cardNo"></el-input>
            </el-form-item>
            
        </el-form>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    data(){
        return{
            queryInfo:{
                warrantType:constants.customer.TRANS_WARRANT_TYPE_WARRANT,//进线类型
                cardNo:'6226500501000222',//输入框，卡号 | 证件号 | 客户号
                crtType:'',//证件类型
                operationType:constants.customer.CREDIT_BUSSINESS_TYPE,//业务类型
            },
            crtTypeLst:[],
            curButton:null,
            customer:null,
        }
    },
    computed:{
        ...mapGetters(['getCrtType','getAgentRole']),
    },
    methods:{
        ...mapActions(['actionCustomerEnter']),
        // 进线查询
        /**
         * {
                "custNoFrom": "C",
                "permissionCode":"",
                "operationType": "string",
                "idCard": "6226500501000222",
                "warrantType": "2"
            }
         */
        submitBtnClickHandler(button){
            let customer = {
                custNoFrom:"C",
                idCard:this.queryInfo.cardNo,
                warrantType:this.queryInfo.warrantType,
                channel:this.$constants.channel.PHONE,
                crtType:this.queryInfo.crtType,
                operationType:this.queryInfo.operationType,
                role:this.getAgentRole,
            };
            this.curButton = button;
            this.actionCustomerEnter({customer,callback:this.customerComeInCallBack});  
         
        },
        customerComeInCallBack(customer){
            //进线返回信息
            if(customer.retCode !=constants.returnCode.success){
                let error = '进线失败：失败原因['+customer.retMsg+']';
                this.$emit('resultChange',{info:[
                    {
                        type: this.$constants.optionResultType.error,
                        content:error,
                    }
                ],flush:true});
                return;
            }
            this.customer = customer;
            let eventName = constants.event.EVENT_PHONE_CUSTOMER_ENTER;
            this.$bus.$emit(eventName,customer);
            this.$emit('changeUrl',this.curButton.url);
            
        },
        //视频进线按钮
        videoSubmitBtnClickHandler(button){
            console.log("视频进线");
        }
    },
    mounted(){
        this.crtTypeLst = this.getCrtType;
    }
}
</script>
