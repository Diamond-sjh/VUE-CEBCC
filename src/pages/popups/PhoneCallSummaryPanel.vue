<template>
    <!-- 来电小结 -->
    <div class="width:100%;">
       <SummaryPopup @close="closeBtnClickHandler" :contentObj="contentObj"></SummaryPopup>
    </div>
</template>
<script>
import SummaryPopup from '@/pages/popups/models/SummaryPopup'
export default {
    components:{SummaryPopup},
    props: {
        contentObj:{
            type: Object,
            default: {}
        }
    },
    methods:{
        closeBtnClickHandler(){
            this.$emit('close');
        },
    },
    mounted(){
         this.$emit('childInit',{
            width:700,//宽度
            height:650,//高度
            label:"来电小结",//title
        });
    }
}
</script>