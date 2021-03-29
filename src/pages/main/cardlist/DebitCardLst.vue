<template>
    <!-- 借记卡 -->
    <CardLstTemplate :tableData="tableData" @cardChange="cardChangeHandler">
        <template v-slot:item>
            <!-- 账/卡号 acctNo、凭证种类 depositType 、状态 state|useState、可用余额 avilBalance、卡种 cardType、开户行 org、
            最近一次交易时间lastTranDate、开户日期、签约基金。其中签约基金：若签约显示“是”，未签约显示“否” -->
            <el-table-column prop="acctNo" label="账/卡号" width="130"></el-table-column>
            <el-table-column prop="depositType" label="凭证种类" width="80"></el-table-column>
            <el-table-column prop="useState" label="凭证状态" width="70"></el-table-column>
            <el-table-column prop="avilBalance" label="可用余额" width="80"></el-table-column>
            <el-table-column prop="cardType" label="卡种" min-width="120"></el-table-column>
            <el-table-column prop="org" label="开户行" min-width="100"></el-table-column>
            <el-table-column prop="currCode" label="凭证币种" width="80"></el-table-column>
            <el-table-column prop="lastTranDate" label="最后一次交易时间" width="110"></el-table-column>
            <el-table-column prop="" label="开户日期" width="80"></el-table-column>
            <el-table-column prop="jijin" label="签约基金" width="80"></el-table-column>
        </template>
    </CardLstTemplate> 
</template>
<script>
import CardLstTemplate from '@/pages/main/CardLstTemplate'
export default {
    components:{CardLstTemplate},
    props:{
        tabType:{type:String,default:''}
    },
    data(){
        return{
            tableData:[ ],
        }
    },
    methods:{
        fetchData(){

        },
        cardChangeHandler(){
            this.$emit('cardChange',this.tabType);
        },
        resetData(){
            this.tableData = [];
        },
        updateView(data){
            
        }
    },
}
</script>