<template>
    <!-- 弹出框类型的交易功能页面组件 -->
    <div class="trans-base-popup">
        <TransBaseContainer :customer="customer" :menu="menu" :ref="menu.url" @close="closeTrans"></TransBaseContainer>
    </div>
</template>
<script>
import TransBaseContainer from '@/pages/components/TransBaseContainer';
export default {
    component:{TransBaseContainer,},
    
    data(){
        return{
            menu:{},
        }
    },
    mounted(){
        
    },
}
</script>

