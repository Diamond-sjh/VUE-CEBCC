<template>
    <!-- 模块内容处 -->
    <!-- <el-main>Main</el-main> -->
    <el-main class="contents-inner" :include="includeCmps">
        <keep-alive :include="includeCmps">
            <router-view/>
        </keep-alive>
    </el-main>
</template>
<script>
export default {
    data(){
        return{
            includeCmps:['mainCenter','adminCenter',],
        }
    },
    mounted(){
        
    }
}
</script>
<style scoped>
        
.contents-inner{
    overflow: hidden;
    display: flex;
    /* height: 100%; */
    width: 100%;
    /* width: calc(100% - 80px); */
    padding:0;
    margin: 0;
    flex-flow: column nowrap;
}
.contents-inner .contents-inner-row{
    margin:0;
}
.contents-inner .contents-inner-row .contents-inner-col{
    padding:0;
}
</style>


