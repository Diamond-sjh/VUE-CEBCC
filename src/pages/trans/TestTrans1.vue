<template>
    <div class="test-trans-1">
        <p class="p20">测试交易页面的公共功能</p>
        <el-row class="pt20">
            <el-button type="primary" @click="btnGotResultClickHandler">跳转结果显示</el-button>
            <el-button type="primary" @click="btnAddResSingleTipClickHandler">插入小绿点(单条)</el-button>
            <el-button type="primary" @click="btnAddResMutlTipClickHandler">插入小绿点（批量）</el-button>
            <el-button type="primary" @click="btnClearResTipClickHandler">清除小绿点</el-button> 
        </el-row>
    </div>
</template>
<script>
export default {
    name:"testtrans1",
   
    data(){
        return{
            width:400,
            height:200,
        }
    },
    methods:{
        btnGotResultClickHandler(){
            console.log("------------",this.functionName);
            this.$emit(this.$constants.emitEvent.TRANS_OPTION_TIPS_EVENT,false,{
                title:'操作错误后的返回提示',
                text:"这里是提示的内容"});
        },
        btnAddResSingleTipClickHandler(){
            this.$parent.addResTipItem(
                {type:this.$constants.optionResultType.success,content:"单条插入成功显示"},
            )
        },
        btnAddResMutlTipClickHandler(){
            this.$parent.addResTipItems([
                {type:this.$constants.optionResultType.success,content:"001多条操作成功"},
                {type:this.$constants.optionResultType.error,content:"002xxxx交易错误1089"},
                {type:this.$constants.optionResultType.warning,content:"003xxxx交易错误1089"}
            ])
        },
        btnClearResTipClickHandler(){
            this.$parent.clearResTip();
        }
    }
}
</script>
