<template>
    <!--老交易系统的小橘灯组件，坐席提示内容 -->
    <el-row class="trans-agent-tips" style="width:100%;">
        <div class="trans-agent-titles-wrapper">
            <span><i class="el-icon-s-opportunity title-icon"></i></span>
            <!-- <span class="title"> 密码剩余次数需（刷新）</span> -->
            <ul class="title-contents">
                <li class="title" v-for="it in infos">
                    {{it.title}}
                </li>
            </ul>
        </div>
        <div class="trans-agent-tips-bg ">
            <div class="text-item txtcolor-666666 text-left" v-for="(it,index) in 1" :key="it">
                {{index+1}}.组件的url: ------{{url}}
            </div>
        </div>
    </el-row>
</template>
<script>
export default {
    props:{
        menuId:{type:String,default:''},
        url:{type:String,default:''},
    },
    data(){
        return{
            infos:[
                {
                    title:"密码剩余次数需（刷新）",
                    content:"1、发送到手机成功：是指定运营商系统发送到客户手机成功2、积分在记账日的3个工作日内生效3、消费：人民币1元累计1积分/1美元（元）累计小积分，不积分分类交易：4、发送到手机成功：是指定运营商系统发送到客户手机成功",
                },
                {
                    title:"开通专业版网银内对外转账限额度为5000元",
                    conetnt:"开通专业版网银内对外转账限额度为5000元开通专业版网银内对外转账限额度为5000元开通专业版网银内对外转账限额度为5000元开通专业版网银内对外转账限额度为5000元"
                },
                {
                    title:"开通专业版网银内对外转账限额度为5000元",
                    conetnt:"开通专业版网银内对外转账限额度为5000元开通专业版网银内对外转账限额度为5000元开通专业版网银内对外转账限额度为5000元开通专业版网银内对外转账限额度为5000元"
                },
                {
                    title:"开通专业版网银内对外转账限额度为5000元",
                    conetnt:"开通专业版网银内对外转账限额度为5000元开通专业版网银内对外转账限额度为5000元开通专业版网银内对外转账限额度为5000元开通专业版网银内对外转账限额度为5000元"
                },
                {
                    title:"开通专业版网银内对外转账限额度为5000元",
                    conetnt:"开通专业版网银内对外转账限额度为5000元开通专业版网银内对外转账限额度为5000元开通专业版网银内对外转账限额度为5000元开通专业版网银内对外转账限额度为5000元"
                },
            ],
            curInfo:null,
        }
    },
    watch:{
        menuId:{
            handler(oval,nval){
                this.fetchTips();
                console.log("update TransAgentTIps fecthTips--------------------");
            }
        }
    },
    methods:{
        // 获取信息提示
        fetchTips(){

        },
    },
}
</script>
<style>
    .trans-agent-tips .trans-agent-titles-wrapper{
        display: flex;
        flex-flow: row nowrap;
        padding-bottom:5px;
    }
    .trans-agent-tips .title-contents{
        list-style: none;
        display: flex;
        flex-flow: row wrap;
    }
    .trans-agent-tips .title-icon{
        color:rgb(221,127,25);
        font-size: 14px;
    }
    .trans-agent-tips .title{
        color:rgb(221,127,25);
        font-size: 12px;
        font-weight: 700;
        padding: 0px 10px 8px 10px;
    }
    .trans-agent-tips .trans-agent-tips-bg{
        background-color: rgb(254,243,227);
        padding: 10px;
        font-size:12px;
        border-radius: 5px;
        /* ,'text-align':'left' */
    }
</style>
