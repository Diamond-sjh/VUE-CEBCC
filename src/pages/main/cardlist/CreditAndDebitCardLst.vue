<template>
    <!-- 存贷合一卡 -->
    <CardLstTemplate :tableData="tableData">
        <template v-slot:item>
            <el-table-column prop="cardNum" label="账/卡号" width="150"></el-table-column>
            <el-table-column prop="cardType_desc" label="卡种" width="100"></el-table-column>
            <el-table-column prop="credit" label="贷记卡片锁定" width="80"></el-table-column>
            <el-table-column prop="" label="贷记账户锁定" width="80"></el-table-column>
            <el-table-column prop="" label="借记状态" width="80"></el-table-column>
            <el-table-column prop="" label="储蓄余额" width="80"></el-table-column>
            <el-table-column prop="" label="消费余额" min-width="80"></el-table-column>
            <el-table-column prop="state0" label="可用总额" width="100"></el-table-column>
            <el-table-column prop="org" label="开户行" min-width="100"></el-table-column>
            <el-table-column prop="" label="签约基金" min-width="100"></el-table-column>
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
            tableData:[],
        }
    },
    methods:{
        fetchData(){
            console.log("CreditAndDebitCardLst fetchData0-0-----")
        },
        cardChangeHandler(){
            this.$emit('cardChange',this.tabType);
        },
        resetData(){
            this.tableData = [];
        },
        updateView(data){
            console.log("CreditAndDebitCardLst.updateView()",data);
            this.tableData = data;
            for(let idx=0;idx<this.tableData.length;idx++){
                let item = this.tableData[idx];
                if(item.cardNum && item.cardNum.length>0){
                    //是卡号
                    item.isAccount = false;
                }else{
                    //是账号 ，账号的条目是不可以选中的，所以要区分出来，样式里面添加
                    item.cardNum = item.account + "(帐)";
                    item.isAccount = true; 
                }
            }
        }
    },
}
</script>