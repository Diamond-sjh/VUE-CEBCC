<template>
    <!-- 用户模拟进线的ui,卡号进线 -->
    <div class="simulate-customer-enter">
        <el-form :model="datas" :rules="rules" ref="ruleForm" label-position="left" label-width="100px">
            <el-form-item   label="卡号" >
                <el-input v-model="datas.cardNo" type="text" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="进线渠道" prop="channel">
                <el-select class="channel-select" v-model="datas.channel" placeholder="请选择渠道" >
                    <el-option v-for="(item,index) in channelLst" :key="index" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-row class="test-card-no pt20 pb20">测试卡号：{{testCards}}</el-row>
        <el-button  type="primary" @click="enterClickHandler">进线</el-button>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    data(){
        return {
            channelLst:[
                {name:"在线客服",id:constants.channel.ONLINE},
                {name:"语音客服",id:constants.channel.PHONE},
            ],
            testCards:"9003050200471830,9003010200021282",
            datas:{
                cardNo:"",
                channel:constants.channel.PHONE,
            },
            rules:{
                cardNo:[
                    {validator:csrValidate.cardNo,trigger:'blur',required:true},
                ],
                channel:[
                    {required:false,}
                ],
            }
        }
    },
    methods:{
        ...mapActions(['actionCustomerEnter']),
        enterClickHandler(){
            let customer = {
                cardNo:this.datas.cardNo,
                warrantType:this.$constants.customer.TRANS_WARRANT_TYPE_WARRANT,
                channel:this.datas.channel,
            };
            this.actionCustomerEnter(customer);
        }
    },
    mounted(){
        this.$emit('childInit',{
            width:400,
            height:200,
            label:"模拟进线",
        });
    },
}
</script>
<style scoped>
    .simulate-customer-enter .test-card-no{
        text-align: left;
    }
    .simulate-customer-enter .channel-select{
        width:100%;
    }
</style>
