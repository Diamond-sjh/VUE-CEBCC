<template>
    <!-- 语音客服客户ivr轨迹 -->
    <div class="customer-ivr-trace pt10 pb10 fz12">
        <!-- <h5>IVR轨迹<a></a></h5> -->
        <el-steps :active="7" align-center>
            <el-step v-for="it in steps" :key="it.title" :title="it.title">
            
            </el-step>    
        <!-- <el-step title="信用卡" ></el-step>
        <el-step title="账单查询" ></el-step>
        <el-step title="状态查询" ></el-step>
        <el-step title="还款查询" ></el-step> -->
        <!-- <el-step title="账单查询" ></el-step>
        <el-step title="状态查询" ></el-step>
        <el-step title="还款查询" ></el-step>
        <el-step title="人工服务" ></el-step> -->
        <!-- <el-step title="步骤4" description="4"></el-step> -->
        </el-steps>
    </div>
</template>
<script>
export default {
    data(){
        return{
            steps:[ ],
        }
    },
    methods:{
        resetView(){
            this.steps = [];
            // console.log('CustomerIvrTrace.resetView()');
        },
        setView(data){
            // console.log('CustomerIvrTrace.setView()');
            this.steps = [{title:'信用卡',},{title:"账单查询"},{title:'还款查询'},{title:'状态查询'}];
        }
    }
}
</script>

<style>
    .customer-ivr-trace /deep/ .el-step__title{
        line-height: 14px;
        font-size: 12px;
        padding-top: 2px;
    }
    .customer-ivr-trace  /deep/ .el-step__icon{
        font-size: 12px;
        width: 18px;
        height: 18px;
    }
</style>
