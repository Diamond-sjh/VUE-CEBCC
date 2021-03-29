<template>
    <!--知识检索模块 -->
    <div class="knowledge-search-container">
        <!-- 左侧的检索内容与常用话术 -->
        <div class="left-part">左侧的检索内容与常用话术</div>
        <!-- 右侧的用户信息栏位 -->
        <OnlineRightCustomerInfo class="right-customer-info"></OnlineRightCustomerInfo>
    </div>
</template>
<script>
import OnlineRightCustomerInfo from '@/pages/onlinechat/OnlineInnerCustomerInfo';
export default {
    name:"knowledageSearch",
    components:{OnlineRightCustomerInfo},
    data(){
        return{

        }
    },
    methods:{

    }
}
</script>
<style scoped>
    .knowledge-search-container{
        display: flex;
        flex-flow: row nowrap;
        height: 100%;
    }
    .knowledge-search-container .left-part{
        flex:1;
    }
    .knowledge-search-container .right-customer-info{
        width: 250px;
    }

</style>
