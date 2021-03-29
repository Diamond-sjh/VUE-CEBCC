<template>
    <!-- 零售外乎电话条 沃风 -->
    <div class="intelligent-outbound-phone-view">
         <div class="phone-item-container">
            <div class="phone-bar-btn default">
                <i class="el-icon-info"></i>
                <span>挂断</span>
            </div>
             <div class="phone-bar-btn default">
                <i class="el-icon-info"></i>
                <span>保持</span>
            </div>         
            <div class="phone-bar-btn default">
                <i class="el-icon-info"></i>
                <span>暂停</span>
            </div>
            <div class="phone-bar-btn default">
                <i class="el-icon-info"></i>
                <span>签入</span>
            </div>
            <div class="status">
                <span class="fz14">状态：</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        //需要后端接口签入，签出
        // 签入
        login(){

        },
        //签出
        logout(){

        },
    }
}
</script>
<style scoped>
 .intelligent-outbound-phone-view{
    display:flex;
    flex-flow:row nowrap;
    padding-left: 20px;
    min-height:20px;
    justify-content: flex-start;
    height:65px;
    align-items: center;
    position: relative;
    color: white;
    
}
.intelligent-outbound-phone-view .phone-item-container{
    display:flex;
    flex-flow:row nowrap;
    flex:1;
    align-items: center;
}
</style>
