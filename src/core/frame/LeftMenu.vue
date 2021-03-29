<template>
<!-- 菜单栏位 -->
    <el-aside width="60px" class="left-menu-container">
        <img class="logo" src="/static/img/logo.png">
        <ul class="menu-ul">
            <li class="meun-item-container" 
                :class=" idx == index?'active':''" 
                @click="gotoUrl(it,index)"  
                v-for="(it,index) in navLst" 
                :key="index"  
                :index="it.url" 
                v-show="it.code!=SETTING_CODE">
                <div class="item-inner">
                    <i class="iconfont menu-item-icon" :class="it.image"></i>
                    <div>{{it.title}}</div>
                </div>
            </li>
        </ul>
         <ul class="menu-ul personal-setting-btn" v-if="settingMenu">
            <li class="item-inner" @click="personalSettingBtnClickHandler">
                <i class="iconfont menu-item-icon icon-shezhi" ></i>
                <div>设置</div>
            </li>
         </ul>
    </el-aside>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    data(){
        return{
            SETTING_CODE:'P_3_M',
            navLst:[],
            curUrl:"",
            idx:0,
            settingMenu:null,
        }
    },
    computed:{
        ...mapGetters(['getUserRoleLst','getAgentNavLst','getAgentInfo']),
    },
    methods:{
        gotoUrl(item,index){
            //写死跳转后台管理
            // if(item.url == '/admin'){
                // var iWidth = 880,iHeight = 630,iTop = (window.screen.availHeight-30-iHeight)/2,iLeft = (window.screen.availWidth-10-iWidth)/2
                // window.open("bgSystem.html","_blank","toolbar=no,height="+iHeight+",innerHeight="+iHeight+",width="+iWidth+",innerWidth="+iWidth+",top="+iTop+",left="+iLeft+",location=no,dorectories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no")
                // window.open("admin.html","_blank");
                // return;
            // }
            let url = item.url;
            this.$router.push({path:item.url});
            this.idx = index;
        },
        //点击个人设置，弹出个人设置框
        personalSettingBtnClickHandler(){
            this.$popUpManager.openUI(this.$constants.uiPanel.PERSON_SETTING_PANEL,{});
        }
    },
    mounted(){
        
        //获取用户的左侧菜单信息，赋值
        
        this.navLst= this.getAgentNavLst;
        // this.curUrl = this.config.center.url;
        // let agent = this.getAgentInfo;
        // if(agent.roleCodeParam == this.$constants.role.phone || agent.roleCodeParam == this.$constants.role.text)
        // {
        //     this.$router.push({path:'mainCenter'});
        // }
        //默认进入页面后跳到第1个导航的内容页面
        if(!this.navLst || this.navLst.length<=0 )
        {
            return;
        }
        this.navLst.forEach(it=>{
            if(it.code == this.SETTING_CODE){
                this.settingMenu = it;
            }
        });
        // console.log(this.$route); 
        let url = this.navLst[0].url;
        // console.log(url);
        // if(this.$route.path && this.$route.path !=url){
        //     url = this.$route.path;
        // }
        this.$router.push({path:url});
        //  "code": "P_3_M", 设置项目
    },
}
</script>
<style  scoped>
    .left-menu-container{
        width:45px;
        color: white;
        /* background-color: rgb(31,41,50) ; */
        background-color: rgb(14,24,44);
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }
    .left-menu-container .logo{
        margin: 30px 0 20px 10px ;
        width: 43px;
        height:50px;
    }
    .left-menu-container .menu-ul{
        width: 100%;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        list-style: none;
    }
    .left-menu-container .menu-ul li{
        padding: 20px 0;
        width: 100%;
        cursor: pointer;
    }
    .left-menu-container .menu-ul .item-inner{
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }
    .left-menu-container .menu-ul .item-inner div{
        margin-top:10px;
        width: 30px;
        font-size: 12px;
    }
    .left-menu-container .menu-ul li.active{
        /* background-color: rgb(14,24,44); */
        background-color: rgb(31,41,50) ;
    }
    .left-menu-container .menu-ul li:hover{
        /* background-color: rgb(14,24,44); */
        background-color: rgb(31,41,50) ;
    }
    .left-menu-container .item-inner .menu-item-icon{
        font-size: 30px;
    }
    .left-menu-container .personal-setting-btn{
        position:fixed; 
        bottom: 0;
        width: 60px;
        left: 0px;
    }
</style>

