<template>
    <el-table 
        ref="cardLst" 
        class="credit-card-lst card-table" 
        :data="tableData" 
        :height="tableHeight" 
        tooltip-effect="dark" 
        style="width: 100%" 
        highlight-current-row 
        :cell-style="rowClass"   
        :header-cell-style="headClass" 
        header-align="center">
        <el-table-column label="选中"  width="40" v-show="tableData&&tableData.length>0">
            <template slot-scope="scope">
                <el-radio class="radio" v-model="curCard" :label="scope.row" >{{tempStr}}</el-radio>
            </template>
        </el-table-column>
        <slot name="item"></slot>
    </el-table>
</template>
<script>
export default {
    props:{
        tableData:{type:Array,default:[]}
    },
    data(){
        return{
            curCard:null,//当前选中的卡片
            tempStr:"",
            tableHeight:140,
        }
    },
    watch:{
        curCard:{
            handler(nVal,oVal){
                if(!this.curCard){
                    return;
                }
                console.log("切换卡片了",this.curCard);
                this.$refs.cardLst.setCurrentRow(this.curCard);
                //切换卡片了
                this.$emit('cardChange',this.curCard);
            }
        },
    },
    methods: {
        //设置当前选中卡
        setCurrentCard(curCard){
            this.curCard =curCard;
            this.$refs.cardLst.setCurrentRow(this.curCard);
            console.log("设置当前选中卡片-00-----");
        },
        headClass(){
            return 'text-align:center;'
        },
        rowClass(){
            return 'text-align:center;'
        },
        updateView(){

        },
    }
}
</script>
<style scoped>
.card-table{
    font-size: 12px!important;
}
</style>
