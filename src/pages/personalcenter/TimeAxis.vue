<template>
    <div>
         <el-col :span="19">
            成长历程
            <ul class="datainfo">
                <li><span class="info">您入职了</span><span class="data">2017-01-01</span><span class="dian"></span></li>
                <li><span class="info">成为双技能坐席</span><span class="data">2018-02-01</span><span class="dian"></span></li>
                <li><span class="info">成为4星座坐席</span><span class="data">2019-05-01</span><span class="dian"></span></li>
            </ul>
        </el-col>
        <!-- <el-col :span="19">
            <el-timeline :reverse="reverse">
                <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp">
                {{activity.content}}
                </el-timeline-item>
            </el-timeline>
        </el-col> -->
        <el-col :span="5">
                <h4>个人信息 导出</h4>
                <h2>1048天</h2>
                <p>累计工作</p>
        </el-col>
    </div>
</template>
<script>
export default {
    data(){
        return{
            reverse: true,
            activities: [{
            content: '活动按期开始',
            timestamp: '2018-04-15'
            }, {
            content: '通过审核',
            timestamp: '2018-04-13'
            }, {
            content: '创建成功',
            timestamp: '2018-04-11'
            }]
        }
    }
}
</script>
<style scoped>
    .datainfo{
        text-align: left;
        left: 30px;;
        font-size: 14px;
        position: relative;
        height: 70px;
        
    }
    .datainfo li{
        list-style: none;
        border-bottom: 1px solid rgb(119, 119, 114);
        width: 30%;
        height: 40px;
        position: relative;
        display:inline-block;
        margin: 0px;
        padding: 0px;
        margin-left: -5px;
        
    }
    .datainfo .dian{
        display: block;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background: rgb(233, 207, 61);
        position: relative;;
        top:-4px;
        left: 30%;
        z-index: 200;

    }
    .datainfo .info{
        display: block;
        position: relative;
        top: 10px;
        left: 15%;
       
    }
    .datainfo .data{
        display: block;
        position: relative;
        top: 30px;
        left: 7%;
       
    }
</style>