<template>
    <!-- 语音客服的container外框 -->
    <el-row class="phone-view">
        <!-- 电话条 -->
        <component :is="phoneComponent"></component>  
        <!-- 左侧用户基本信息 -->
        <div class="amain-container bg-white">
            <LeftCustomerInfo ref="customerInfo" @openQuerySearch="openQuerySearch"></LeftCustomerInfo>
            <div class="right-side">
                <!-- 右测卡列表 -->
                <RightCustomerCardList ref="cardList" @cardScreenChange="screenChange"></RightCustomerCardList>
                <div class="trans-and-check pt10" v-show="!isCardScreen">
                    <TransMenu ref="transMenu" @openTrans="openTrans"></TransMenu>
                    <el-button class="id-check-btn identify-btn" type="primary" size="medium" @click="checkIdentifyBtnClickHandler">身份验证</el-button>
                </div>
                <CustomerBussinessList ref="menuList" :isCustomerQuerySearch="isCustomerQuerySearch" v-show="!isCardScreen"></CustomerBussinessList>
            </div>
        </div>
    </el-row>
</template>
<script>
import LeftCustomerInfo from '@/pages/telephone/LeftCustomerInfo'
import RightCustomerCardList from '@/pages/main/CustomerCardList'
import CustomerBussinessList from '@/pages/main/CustomerBussinessListNew'
import TransMenu from '@/pages/components/TransMenu'

import { mapGetters } from 'vuex';
export default {
    components:{
        LeftCustomerInfo,
        RightCustomerCardList,
        CustomerBussinessList,
        TransMenu, 
    },
    data(){
        return{
            curCustomer:null,//当前用户
            channel:constants.channel.PHONE,
            isCustomerQuerySearch:true,
            isCardScreen:false,
            phoneComponent:"",
        }
    },
    computed:{
        ...mapGetters(['getCustomer','getAgentRole']),
    },
    methods:{
        //用户进线,根据返回的数据更新所有页面的内容与逻辑   
        customerEnterHandler(customer){
            console.log(customer);
            // if(customer.retCode !=constants.returnCode.success){
            //     let error = '进线失败：失败原因['+customer.retMsg+']';
            //      this.$message({
            //         showClose: true,
            //         message:error,
            //         type: 'error'
            //     });
            //     // this.$refs.menuList.updateView(customer);
            //     return;
            // }
            this.curCustomer = customer;
            if(this.$refs.customerInfo){
                this.$refs.customerInfo.updateView(customer);
            }
            // this.$refs.transMenu.updateView(customer);
            this.$refs.cardList.updateView(customer);
            // this.$refs.menuList.updateView(customer);
            // console.log("客户进线：",this.curCustomer);  
            this.isCustomerQuerySearch = false;
        },
        //切换用户时候刷新页面的内容（点击新用户时候清空所有数据）
        customerLeaveHandler(customer){
            this.$refs.customerInfo.resetView();
            this.$refs.cardList.resetView();
            this.$refs.menuList.resetView();
        },
        openTrans(menuItem){
            this.$refs.menuList.openTrans(menuItem);
        },
        
        openQuerySearch(){
            this.isCustomerQuerySearch = true;
            //关闭所有页签,
            this.$refs.menuList.resetData();
            //重置卡列表
            this.$refs.cardList.resetView();

        },
        //核身功能
        checkIdentifyBtnClickHandler(){

        },
        //卡列表全屏显隐控制
        screenChange(isScreen){
            this.isCardScreen = isScreen;
        }
    },
    mounted(){
        this.$bus.$on(constants.event.EVENT_PHONE_CUSTOMER_ENTER,this.customerEnterHandler);
        let role = this.getAgentRole;
        if(role == constants.role.phone){
            //语音坐席
            this.phoneComponent = ()=>import('@/pages/components/phone/BasePhoneView');
        }else if(role == constants.role.outbound){
            //零售外乎坐席
            this.phoneComponent = ()=>import('@/pages/components/phone/IntelligentOutboundPhoneView');
        }else{
            this.csrAlert.error("未选择对应角色");
        }
    },
    activated(){

    }
    
}
</script>
<style scoped>
    .phone-view{
        height:100%;
        overflow:hidden;
        display: flex;
        flex-flow: column nowrap;
    }
    .phone-view .amain-container{
        text-align: left;
        overflow: hidden;
        display:flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        flex:1;
    }
    .phone-view .amain-container .right-side{
        display: flex;
        flex-flow: column nowrap;
        margin: 10px 20px 0 10px;
        /* width: 100%; */
        flex:1;
        overflow: hidden;
    }  
    .phone-view .right-side .trans-and-check{
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
    }
    .phone-view .right-side .trans-and-check .id-check-btn{
        color: white;
        margin: 0 0px 0px 20px;
    }
</style>


