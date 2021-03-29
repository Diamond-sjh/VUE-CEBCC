<template>
    <!-- 工单历史详情列表-->
    <div class="customer-order-history-info-panel">
    </div>
</template>
<script>
export default {
    data(){
        return{
          
        }
    },
    mounted(){
         this.$emit('childInit',{
            width:300,//宽度
            height:400,//高度
            label:"工单历史",//title
            position:{x:"350px",y:"100px"},//位置
            mask:false,//蒙层
            
        });
    }
}
</script>
