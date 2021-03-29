<template>
    <div class="width:100%;">
        <IntelligentAssistance></IntelligentAssistance>
    </div>
</template>
<script>
import IntelligentAssistance from './models/IntelligentAssistance';
export default {
    components:{IntelligentAssistance},
    mounted(){
        this.$emit('childInit',{
            width:380,//宽度
            height:350,//高度
            label:"智能辅助",//title
            position:{x:"40px",y:"340px"},//位置
            mask:false,//蒙层
        });
    },
}
</script>

