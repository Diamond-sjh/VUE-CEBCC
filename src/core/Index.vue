<template>
    <el-container class="container index-container " :class="'csr-theme-'+themeColor">
        <!-- <el-header>Header</el-header>
        <el-container>
            <el-aside width="200px">Aside</el-aside>
            <el-main>Main</el-main>
        </el-container> -->
        <img class="header-bg" :src="'/static/img/theme/header-bg-'+themeColor+'.png'">
        <el-container :span="24" class="main main-container">
            <LeftMenu ref="csrNav"></LeftMenu>
            <el-container  direction="vertical" style="width:100%;">
                <Header ref="csrHeader"></Header>
                <Content ref="csrContent"></Content>
            </el-container>
        </el-container>
        
        <PopUpManager ref="popupManager"></PopUpManager>
        <BoardCast ref="csrBoardCast"></BoardCast>
    </el-container>
</template>
<script>
import Header from '@/core/frame/headers/Header';
import Content from '@/core/frame/Contents';
import LeftMenu from '@/core/frame/LeftMenu';
import PopUpManager from '@/core/frame/PopUpManager';//弹出窗管理窗口
import BoardCast from  '@/core/frame/BoardCast';//所有的通告，通知弹屏块
import Vue from 'vue';
export default {
    components:{Header,Content,LeftMenu,PopUpManager,BoardCast},
    data(){
        return{
            timeTickHandler:0,
            themeColor:'blue',
        }
    },
    beforeDestroy(){
        window.clearTimeout(this.timeTickHandler);
        this.timeTickHandler = null;
    },
    methods:{
        tick(){
            this.timeTickHandler=setTimeout(() => {
                let dd = new Date().getTime();
                if(this.$refs.csrHeader && this.$refs.csrHeader.tick){
                    this.$refs.csrHeader.tick(dd);
                }
                if(this.$refs.csrContent && this.$refs.csrContent.tick){
                    this.$refs.csrContent.tick(dd);
                }
                if(this.$refs.csrBoardCast && this.$refs.csrBoardCast.tick){
                    this.$refs.csrBoardCast.tick(dd);
                }
                this.tick();
            }, 1000);
        }
    },
    mounted(){
        Vue.prototype.$popUpManager = this.$refs['popupManager'];
        this.tick();
        
    }
}
</script>
<style scoped>
.index-container{
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: column nowrap;
    position: relative;
}
.index-container .main-container{
    height:100%;
    overflow: hidden;
}
.index-container .header-bg{
    position:fixed;
    width: 100%;
    z-index: -1;
    height: 100px;
}
</style>

