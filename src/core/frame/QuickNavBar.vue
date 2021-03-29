<template>
<!-- 右侧的快捷工具栏位 -->
    <div class="quick-nav-bar">
        <ul class="quick-nav-container">
            <li v-for="it in navLst" :key="it.id" class="quick-nav-item" @click="itemClickHandler(it.panelId)">
                <i :class="it.icon" ></i>
            </li>
        </ul> 
    </div>
</template>
<script>
export default {
    data(){
        return{
            navLst:[
                {icon:'el-icon-edit',title:"模拟进线",panelId:window.constants.uiPanel.SIMULATE_CUSTOMER_ENTER_PANEL,id:"001"},
                {icon:'el-icon-share',title:"分期试算",panelId:constants.uiPanel.PHONE_CALL_SUMMARY_PANEL,id:"002"},
                {icon:'el-icon-delete',title:"多媒体",panelId:constants.uiPanel.PUBLIC_DEMO_PANEL,id:"003"},
            ]
        }
    },
    methods:{
        itemClickHandler(panelId){
            this.$popUpManager.openUI(panelId,{});
        }
    },
}
</script>
<style scoped>
    .quick-nav-bar{
        position: fixed;
        right: 0;
        top: 50%;
        transform:translate(0,-50%);
        width: 35px;
        padding: 10px;
        background-color: blanchedalmond;
        border-radius: 10px 0 0 10px;
        z-index: 10;
    }
    .quick-nav-bar .quick-nav-container{
        display: flex;
        flex-flow:column nowrap;
        justify-content: center;
        align-items: center;
        list-style: none;
    }
    .quick-nav-bar .quick-nav-container .quick-nav-item{
        padding:5px 5px;
        cursor: pointer;
        font-size: 18px;
    }
</style>
