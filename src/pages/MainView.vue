<template>
    <!-- 联络中心 -->
    <!-- <saction class="main-view-container"> -->
        <!-- 当前的页面 因为有可能是语音客服 或者是文字客服根据登录时候的角色来选择，之后可能会拆开 -->
        <div style="width:100%;height:100%;" >
            <component :is="curCmp" ></component>
            <QuickNavBar></QuickNavBar>
        </div>
    <!-- </saction> -->
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import QuickNavBar from '@/core/frame/QuickNavBar';//右侧工具栏位
export default {
    name:'mainCenter',
    components:{QuickNavBar},
    data(){
        return{
            curCmp:'',
            curChannel:'',//当前的渠道信息
        }
    },
    computed:{
        ...mapGetters(['getAgentRole']),
    },
    methods:{
        ...mapActions(['actionSetCurChannel']),

    },
    mounted(){
        let role = this.getAgentRole;
        if(role == this.$constants.role.text){
            this.curCmp = ()=>import('@/pages/onlinechat/OnlineChatCenter');
            // this.actionSetCurChannel(this.$constants.channel.ONLINE);
        }else if(role == this.$constants.role.phone || role == this.$constants.role.outbound){
            this.curCmp = ()=>import('@/pages/telephone/PhoneCenter');
            // this.actionSetCurChannel(this.$constants.channel.PHONE);
        }
        //TO FIXED 默认先选择语音客服，之后按照所选择渠道修改
    },
    activated(){

    }    
}
</script>


