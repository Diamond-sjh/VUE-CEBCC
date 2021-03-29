<template>
    <!-- 业务办理模块 -->
    <div class="bussiness-container">
        <CustomerCardList></CustomerCardList>
        <TransMenu ref="transMenu" @openTrans="openTrans"></TransMenu>
        <CustomerBussinessList ref="menuList"></CustomerBussinessList>
    </div>
</template>

<script>
import CustomerCardList from '@/pages/main/CustomerCardList'
import TransMenu from '@/pages/components/TransMenu'
import CustomerBussinessList from '@/pages/main/CustomerBussinessListNew'
export default {
    components:{CustomerBussinessList,CustomerCardList,TransMenu},
    data(){
        return{

        }
    },
    methods:{
        openTrans(menuItem){
            this.$refs.menuList.openTrans(menuItem);
        },
    },
    beforeDestroy(){

    },
}
</script>
<style scoped>
.bussiness-container{
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-flow: column;
}
</style>

