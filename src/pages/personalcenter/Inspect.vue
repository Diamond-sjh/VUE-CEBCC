<template>
    <el-row class="main">
        <div>
            <h4 class="title">质检成绩</h4>
            <span class="detail">
                <i>录音详情</i>
                <i>质检详情</i>
            </span>
        </div>
        <el-col :span="12" class="acol">
            <h1>98</h1>
            <p>质检成绩</p>
        </el-col>
        <el-col :span="12" class="acol">
            <h1>6</h1>
            <p>质检成绩排名</p>
        </el-col>
        <el-col :span="12" class="acol">
            <h1>2</h1>
            <p>质检成绩</p>
        </el-col>
        <el-col :span="12" class="acol">
            <h1>2</h1>
            <p>表扬录音</p>
        </el-col>
    </el-row>
</template>
<style scoped>
    .main{
        padding: 10px;
    }
    .main .title{
        font-size: 18px;
        text-align: left;
        margin-bottom: 10px;
    }
    .main .detail{
        display: block;
        margin-top: -25px;
        margin-right: 5px;
        font-size: 14px;
        text-align: right;
        color:cornflowerblue;
    }
    .main h1{
        font-size: 35px;
    }
    .main p{
        font-size: 14px;
        font-weight: 500;
    }
    .acol{
        margin: 30px 0px;
    }
</style>