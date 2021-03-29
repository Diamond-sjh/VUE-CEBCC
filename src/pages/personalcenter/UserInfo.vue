<template>
    <el-row :span="24" class="main">
    <el-col :span="8" class="border-right">
        <el-col :span="4">
            <el-col :span="20" style="height:60px;background:pink;border-radius:40px;"></el-col>
        </el-col>
        <el-col :span="18" class="text-left">
            <h4>周慧玲女士，欢迎您 !</h4>
            <p>生命不息，奋斗不止，开始迎接新的一天吧</p>
            <p>登录时间：  2018-02-12  12:00:00</p>
        </el-col>
    </el-col>
    <el-col :span="8" class="border-right text-left">
        <el-col :span="12">
            <p>室别：客户服务</p>
            <p>组别：高端技能组</p>
            <p>级别：三星级坐席</p>
        </el-col>
        <el-col :span="12">
            <p>所属区域：北部大区</p>
            <p>账号：1234567890</p>
        </el-col>  
    </el-col>
    <el-col :span="8" >
        <h1>13</h1>
        <span>待阅读知识数</span>
    </el-col>
    </el-row>
</template>
<script>
export default {
    
}
</script>
<style scoped>
    .main{
        font-size: 14px;
        line-height: 25px;
    }
    .main h1{
        margin-top: 15px;
        font-size: 35px;
    }
    .main h4{
        font-size: 16px;
    }
    .text-left{
        text-align: left;
        padding-left: 15px;
    }
    .border-right{
        border-right:1px solid rgb(184, 181, 181);
    }
</style>