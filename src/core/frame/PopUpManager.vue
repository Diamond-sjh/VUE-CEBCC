<template>
    <!-- 弹出窗内容，相当于ui层，支持多开，有一个ui管理系统 -->
    <div class="popup-manager-container">
        <component v-for="it in popLst" :is="it.curCmp" :key="it.panelId" :contentObj="it" v-show="it.minimize==false"></component>
        <div class="popup-minimize-container">
            <div v-for="it in popLst" :key="it.panelId" v-if="it.minimize==true" class="minimize-popup-item">
                <span>{{it.panelId}}</span>
                <span><i class="el-icon-plus" @click="maxmizeUI(it.panelId)"></i></span>
            </div>
        </div>
    </div>
</template>
<script>
// import PopUpItem from '@/core/PopUpItem'
export default {
    // components:{PopUpItem},
    data(){
        return{
            popLst:[],//打开的窗口
        }
    },
    methods:{
        //注册ui弹屏事件
        registerEvents(){
            this.$bus.$on(constants.uiEvent.EVENT_OPEN_UI,this.openUI);
        },
        //取消注册事件
        unRegisterEvents(){
            this.$bus.$off(constants.uiEvent.EVENT_OPEN_UI,this.openUI);
        },
        openUI(panelId,params){
            //判定是否超过最大上限
            if(this.popLst.length >= this.$constants.maxPanelNum){
                this.csrAlert.warning("弹窗开启过多，请关闭其他无用页面后在开启");
                return;
            }
            
            let panel = this.getPanelById(panelId);
            if(panel){
                this.csrAlert.warning("页面已打开");
                return;
            }
            let info = {panelId,minimize:false};
            Object.assign(info,params);
            info.curCmp = ()=>import('@/core/frame/PopUpItem');
            this.popLst.push(info);
        },
        maxmizeUI(panelId){
            let panel = this.getPanelById(panelId);
            if(!panel){return;}
            panel.minimize = false;
        },
        minimizeUI(panelId){
            let panel = this.getPanelById(panelId);
            if(!panel){ return; }
            panel.minimize = true;
        },
        closeUI(panelId){
            for (let idx = 0; idx < this.popLst.length; idx++) {
                const item = this.popLst[idx];
                if(item.panelId == panelId){
                    this.popLst.splice(idx,1);
                    return;
                }
            }
            console.log("无法找到对应需要关闭的ui",panelId);
        },
        getPanelById(panelId){
            for (let idx = 0; idx < this.popLst.length; idx++) {
                const item = this.popLst[idx];
                if(item.panelId == panelId){
                    return item;
                }
            }
            return null;
        }
    },
    beforeDestroy(){
        this.unRegisterEvents();
    },
    mounted(){
        //初始化manager
        this.registerEvents();
    }
}
</script>
<style scoped>
    .popup-manager-container{
        z-index: 1000;
        position: relative;
    }
    .popup-manager-container .popup-minimize-container{
        position:fixed;
        left: 20px;
        bottom: 20px;
    }
    .popup-manager-container .minimize-popup-item{
        height: 24px;
        background: antiquewhite;
        font-size: 12px;
        margin: 0 5px;
        padding: 2px 4px;
        line-height: 24px;
        display: flex;
        flex-flow: row nowrap;
    }
    .popup-manager-container .minimize-popup-item span:nth-child(1){
        width: 50px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>


