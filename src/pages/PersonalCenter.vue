<template>
    <!-- 个人中心 -->
    <!-- 布局方式一 -->
    
    <div class="personal-center p20 bg-white">
        <el-row class="mb10 bgcolor">
            <el-col :span="24"><div class="p10"><UserInfo></UserInfo></div></el-col>
        </el-row>
        <el-row :gutter="10" class="mb10 ">
            <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18"><div class="bgcolor p10"><DataStatistics></DataStatistics></div></el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6"><div class="bgcolor p10"><noticeinfo></noticeinfo></div></el-col>
        </el-row>
        <el-row :gutter="10" class="mb10">
            <el-col :xs="24" :sm="12" :md="12" :lg="9" :xl="9"><div class="bgcolor heig">营销成绩</div></el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="9" :xl="9"><div class="bgcolor heig"><Inspect></Inspect></div></el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6"><div class="bgcolor heig"><date></date></div></el-col>
        </el-row>
        <el-row class="mb10">
            <el-col :span="24" class="bgcolor p10"><TimeAxis></TimeAxis></el-col>
        </el-row>       
    </div>
    
    <!-- 布局方式二 -->
    <!-- <div class="personal-center">
        <el-row style="background:pink;margin-bottom:10px;">
            <el-col :span="24"><div class="grid-content">用户信息</div></el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :xs="8" :sm="6" :md="4" :lg="24" :xl="18">
                <div class="grid-content">
                    <el-col :lg="24" :xl="24"><div class="grid-content" style="background:pink;margin-bottom:10px;">数据统计</div></el-col>
                    <el-col :lg="12" :xl="12"><div class="grid-content" style="background:pink;margin-bottom:10px;">营销成绩</div></el-col>
                    <el-col :lg="12" :xl="12"><div class="grid-content" style="background:pink;margin-bottom:10px;">质检成绩</div></el-col>
                </div>
            </el-col>
            <el-col :xs="8" :sm="6" :md="4" :lg="24" :xl="6">
                <div class="grid-content bg-purple">
                    <el-col :lg="12" :xl="24"><div class="grid-content"  style="background:pink;margin-bottom:10px;">公告信息</div></el-col>
                    <el-col :lg="12" :xl="24"><div class="grid-content"  style="background:pink;margin-bottom:10px;">日历</div></el-col>
                </div></el-col>

        </el-row>
        <el-row style="background:pink;margin-bottom:10px;">
            <el-col :span="24"><div class="grid-content">成长历程</div></el-col>
        </el-row>
    </div> -->
</template>
<script>
import UserInfo from '@/pages/personalcenter/UserInfo';//用户信息
import DataStatistics from '@/pages/personalcenter/DataStatistics';//数据统计
import noticeinfo from '@/pages/personalcenter/NoticeInfo';//公告信息
import Inspect from '@/pages/personalcenter/Inspect';//质检成绩
import date from '@/pages/personalcenter/Date';//日历
import TimeAxis from '@/pages/personalcenter/TimeAxis';//成长立场
// import {getMenuInfoByMenuId} from '@/utils/CommonAjaxMethods';
export default {
    components:{UserInfo,DataStatistics,noticeinfo,Inspect,date,TimeAxis},
    methods:{

    },
    mounted(){
    }
}
</script>
<style scoped>
    .person-center{
        width:100%;
        height:100%;
        overflow-y:auto;
        overflow-x: hidden;
        background:whitesmoke;
    }
    .heig{
        height: 310px;
    }
    .bgcolor{
        background-color: aliceblue;
    }
</style>
