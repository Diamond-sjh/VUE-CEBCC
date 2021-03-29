<template>
<!-- 呼叫中心的头部内容，包含了电话条，通知内容（用户进线通知，等等，以及坐席的当前工作内容等） -->
	<div class="header header-container">
        <AgentBaseInfo ref="csrAgentBaseInfo"></AgentBaseInfo>
        <div class="right-part">
            <div>{{accCode}}</div>
            <el-link type="info" class="log-out-btn" @click="onBtnLogOutClick"> <i class='el-icon-exit'></i>退出</el-link>
        </div>
    </div>
</template>
<script>
import AgentBaseInfo from '@/core/frame/headers/UserBaseInfo';
import { mapGetters, mapActions } from 'vuex';
export default {
    components:{AgentBaseInfo},
    data(){
        return{
            agent:null,
            collapsed:true,
            accCode:'',
        }
    },

    methods:{
        ...mapActions(['actionAgentLogOut']),
        onBtnLogOutClick(){
            this.csrAlert.confirm({
                showCancelButton:true,
                title:"确定退出么系统么？",
            }).then(res=>{
                if(res){
                    //调用agentSession.logout
                    this.actionAgentLogOut(()=>{
                        console.log("退出成功");
                        // window.location.href="http://localhost:81/";
                        // window.close();
                        this.$bus.$emit(constants.event.EVENT_LOGIN_START,{});
                    });
                }
            });
        },
        gotoUserDetail(){
            this.csrAlert.warning("打开用户统计详情页面")
        },
        //计时器，通过index.vue里面传过来的统一计时
        tick(time){
            if(this.$refs.csrAgentBaseInfo.tick){
                this.$refs.csrAgentBaseInfo.tick(time);
            }
        }
    },
    computed:{
        ...mapGetters(['getAgentInfo'])
    },
    mounted(){
        this.agent = this.getAgentInfo;
        this.accCode = this.agent.accCodeParam;
    },
}
</script>

<style scoped>
.header-container{
    height: 30px;
    line-height: 30px;
    color:#fff;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    width: 100%;
}
.header-container .right-part{
    vertical-align: center;
    text-align: center;
    padding:0 10px;
    font-size: 12px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    
}
.header-container .right-part .log-out-btn{
    cursor: pointer;
    font-size: 14px;
    padding-left: 10px;
    color: white;
}
</style>



