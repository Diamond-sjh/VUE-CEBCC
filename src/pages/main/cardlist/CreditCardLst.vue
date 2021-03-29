<template>
    <!-- 贷记卡，信用卡 -->
    <CardLstTemplate :tableData="tableData" @cardChange="cardChangeHandler" >
        <template v-slot:item>
            <el-table-column prop="AcctNo" label="账/卡号" width="130"></el-table-column>
            <el-table-column prop="state1" label="主/副卡" width="80"></el-table-column>
            <el-table-column prop="state2" label="机构" width="70"></el-table-column>
            <el-table-column prop="UnitName" label="卡种" width="80"></el-table-column>
            <el-table-column prop="UnitName" label="锁定码" width="80"></el-table-column>
            <el-table-column prop="InstName" label="可用额度" min-width="100"></el-table-column>
            <el-table-column prop="state0" label="账单日期" width="130"></el-table-column>
            <el-table-column prop="CertSeq" label="应还款" width="110"></el-table-column>
            <el-table-column prop="Date1" label="剩余应还款" width="80"></el-table-column>
            <el-table-column prop="Date1" label="积分" width="80"></el-table-column>
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

        },
        cardChangeHandler(){
            this.$emit('cardChange',this.tabType);
        },
        resetData(){
            this.tableData = [];
        },
        updateView(data){
            this.tableData = data?data:[];
        },
    },
}
</script>