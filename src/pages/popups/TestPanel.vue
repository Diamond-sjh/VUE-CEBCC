<template>
    <div class="test-panel">
        <p>這是一個測試的彈窗ui</p>
    </div>
</template>
<script>
export default {
    mounted(){
        this.$emit('childInit',{
            width:800,
            height:400,
            label:"测试弹窗",
        });
    }
}
</script>
