<template>
    <div class="data-statistics">
        <el-row>
            <el-col class="main">
                <h3 class="title">数据统计</h3>
                <span class="detail" ><a @click="datastatdetail()">查看详情</a></span>
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="当日" name="first">
                        <el-col :span="8" class="tady_one">
                            <el-col :span="16"><el-progress type="circle" :percentage="25"></el-progress></el-col>
                            <el-col :span="8">
                                <h2>3通</h2>
                                <p>不满意录音</p>
                            </el-col>
                        </el-col>
                        <el-col :span="8" class="tady_two">
                            <el-row>
                                <el-col :span="7" class="label">登陆时常：</el-col>
                                <el-col :span="17"><el-progress :percentage="70"></el-progress>
                                    <el-col class="date">1小时13分10秒</el-col>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="7" class="label">平均时常：</el-col>
                                <el-col :span="17"><el-progress :percentage="90" color="red"></el-progress>
                                    <el-col class="date">1小时13分10秒</el-col>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="7" class="label">示忙时常：</el-col>
                                <el-col :span="17"><el-progress :percentage="40" color="#e6a23c"></el-progress>
                                    <el-col class="date">1小时13分10秒</el-col>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="7" class="label">登陆时常：</el-col>
                                <el-col :span="17"><el-progress :percentage="80" color="red"></el-progress>
                                    <el-col class="date">1小时13分10秒</el-col>
                                </el-col>
                            </el-row>
                            
                            
                        
                            
                        </el-col>
                        <el-col :span="8" class="tady_seconed">
                            <el-col :span="24">
                                <h1>236<p>接待总量</p></h1>
                                
                            </el-col>
                            <el-col :span="12">
                                <h2>123</h2>
                                <p>接入</p>
                            </el-col>
                            <el-col :span="12">
                                <h2>123</h2>
                                <p>呼出</p>
                            </el-col>
                        </el-col>
                        

                    </el-tab-pane>
                    <el-tab-pane label="本周" name="second">用户管理</el-tab-pane>
                    <el-tab-pane label="本月" name="third">配置管理</el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
        
    </div>  
    
</template>
<script>
export default {
    data(){
        return{
            activeName:"first",
        }
    },
    methods:{
        handleClick(){},
        //查看详情
        datastatdetail(){
            this.$popUpManager.openUI(this.$constants.uiPanel.CUSTOMER_IMPORTANT_INFO_PANEL,{});
        },
    },
}
</script>
<style scoped>
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
    .tady_one{
        text-align: left;
        border-right:1px solid rgb(184, 181, 181);
    }
    .tady_one h2{
        margin-top: 20px;
        font-size: 30px;
        color: red;
    }
    .tady_two{
        text-align: left;
        border-right:1px solid rgb(184, 181, 181);
    }
    .tady_two .label{
        font-size: 14px;
        padding-left: 10px;
    }
    .tady_two .date{
        font-size: 12px;
        padding-left: 10px;
    }
    .tady_seconed h1{
        margin-left: 10%;
        margin-top:-10px;
        margin-bottom: 5px;
        font-size: 38px;
        height: 80px;
        width: 80%;
        border-bottom: 1px solid rgb(184, 181, 181);
    }
    .tady_seconed p{
        font-size: 14px;
        font-weight: 500;
    }
</style>