<template>
    <!--用户进线的左侧信息显示区  -->
    <div class="left-cust-info">
        <CustomerBaseInfo ref="customerBaseInfo"></CustomerBaseInfo>
        <div class="history-lst-wrapper">
        <!-- <el-scrollbar :native="false" wrapStyle="overflow-x:hidden;position:relative;" viewStyle="height: 100%;overflow-x: hidden;overflow-y:auto;" wrapClass="" viewClass="" :noresize="false" tag="div"> -->
            <el-collapse  v-model="curItem" @change="collapseChangeHandler">
                <el-collapse-item v-for="(it,index) in items" :key="it.title"  :name="index">
                    <template slot="title">
                        <el-row type="flex" justify="left" class="title-container">
                            <span class="collapse-item-title">{{it.title}}</span>
                            <span class="more-btn text-theme-color" v-if="it.isMore" @click.stop="moreBtnClickHandler(it.panel)">more</span>
                        </el-row>
                    </template>
                    <component :is="it.component" :ref="it.ref"></component>
                </el-collapse-item>
            </el-collapse>
        <!-- </el-scrollbar> -->
        </div>
        <div class="footer">
            <el-row type="flex" justify="center" class="pt20">
                <!-- <img src="../assets/img/Robot.jpg"> -->
                <el-button size="mini"  @click="openPopUpCmp($constants.uiPanel.INTELLIGENT_ASSISTANCE_PANEL)" icon="el-icon-s-help">智能辅助</el-button>
                <el-button size="mini" >服务轨迹</el-button>
                <el-button size="mini" type="primary" @click="openPopUpCmp($constants.uiPanel.PHONE_CALL_SUMMARY_PANEL)">来电小结</el-button>
            </el-row>
        </div>
        <span class="new-customer-btn btn" @click="newCustomerBtnClickHandler">新用户</span>
    </div>
</template>
<script>
import CustomerBaseInfo from '@/pages/main/leftcustomer/CustomerBaseInfo';
export default {
    components:{CustomerBaseInfo},
    data(){
        return{
            customer:{},//用户信息
            curItem:0,
            //显示的内容配置项目
            items:[
                // {title:"客户基本信息",component:()=>import('@/pages/main/CustomerBaseInfo'),ref:"customerBaseInfo",icon:'el-icon-info',isMore:false},
                {title:"进线轨迹",component:()=>import('@/pages/main/leftcustomer/CustomerIvrTrace'),ref:'ivrTrace',isMore:true,panel:constants.uiPanel.IVR_HISTORY_INFO_PANEL},
                {title:"渠道信息",component:()=>import('@/pages/main/leftcustomer/CustomerChannelInfo'),ref:'channelInfo',isMore:false},
                {title:"工单历史",component:()=>import('@/pages/main/leftcustomer/CustomerOrderHistory'),ref:"orderHistory",isMore:true,type:'link',panel:constants.uiPanel.CUSTOMER_ORDER_HISTORY_INFO_PANEL},
                {title:"外乎历史",component:()=>import('@/pages/main/leftcustomer/CustomerOutBoundHistory'),ref:"outBoundHistory",isMore:true},
                {title:"服务历史",component:()=>import('@/pages/main/leftcustomer/CustomerServiceHistory'),ref:"serviceHistory",isMore:true},
                {title:"来电历史",component:()=>import('@/pages/main/leftcustomer/CustomerPhoneCallHistory'),ref:"phoneCallHistory",isMore:true},
                {title:"备注历史",component:()=>import('@/pages/main/leftcustomer/CustomerRemarkHistory'),ref:'remarkHistory',isMore:true},
            ],
            testBool:false,
            // popupCmp:'',
        }
    },
    methods:{
        updateView(customer){
            // console.log("LeftCustomerInfo.updateView()");
            this.customer=customer;
            this.$refs.customerBaseInfo.setView(customer);
            this.items.forEach(it=>{
                if(this.$refs[it.ref][0] && this.$refs[it.ref][0].setView){
                    this.$refs[it.ref][0].setView(customer);
                }
            });
        },
        //清理显示内容
        resetView(){
            this.$refs.customerBaseInfo.resetView();
            this.items.forEach(it=>{
                if(this.$refs[it.ref][0] && this.$refs[it.ref][0].resetView){
                    this.$refs[it.ref][0].resetView();
                }
            });
        },
        //显示查询内容
        newCustomerBtnClickHandler(){
            this.$emit('openQuerySearch',{});
            // this.resetView();
            this.testBool = !this.testBool;
            if(this.testBool){
                this.resetView();
            }else{
                this.updateView();
            }
            
        },
        collapseChangeHandler(val){
           console.log(val)
        },
        openPopUpCmp(_url){
            // if(!_url){return;}
            // this.popupCmp = ()=>import('@/pages/popups/models/'+_url);
            this.$popUpManager.openUI(_url,{});
        },
        moreBtnClickHandler(panelId){
            if(!panelId){
                return;
            }
            console.log("LeftCustomerInfo.moreBtnClickHandler",panelId);
            this.$popUpManager.openUI(panelId);
        }
    }
    
}
</script>

<style>
    .left-cust-info{
        /* margin-left: 10px;
        margin-top: 10px; */
        margin:10px  0 0px 10px;
        width:280px;
        overflow:hidden;
        height:100%;
        position: relative;
        background-color: rgb(241,248,254);
        border-radius: 12px 12px 0 0;
        display: flex;
        flex-flow: column nowrap;
    }
    .left-cust-info .history-lst-wrapper{
        /* flex:1; */
        height: calc( 100% - 240px );
        overflow-x: hidden;
        overflow-y:auto;
    }
    .left-cust-info .el-collapse-item__header{
        height: 25px;
        line-height: 25px;
        font-size: 14px;
        color: rgb(35,35,35);
        background-color: #baddf7;
    }
    .left-cust-info .el-collapse-item__wrap{
        background-color:rgb(241,248,254);
    }
    .left-cust-info .el-collapse-item__header .collapse-item-title{
        padding-left: 10px;
    }
    .left-cust-info .el-collapse-item__content{
        padding-bottom:0;
    }
    .left-cust-info .title-container{
        align-items:center;
        width:100%;
        position: relative;
    }
    .left-cust-info .title-container .more-btn{
        position: absolute;
        right: 0;
        font-size: 8px;
        top:0px;
    }
    .left-cust-info .title-icon{
        font-size: 20px;
        color:gray;
        margin-right: 5px;
    }
    .left-cust-info .new-customer-btn{
        position: absolute;
        top:9px;
        right:10px;
        padding: 2px 4px;
        font-size: 12px;
        line-height: 12px;
        color:white;
        border: 1px solid white;
        border-radius: 10px;
    }
    .left-cust-info .footer{
        position: fixed;
        bottom: 20px;
    }
    .left-cust-info .footer img{
        width: 35px;
    }
    .left-cust-info .customer-popup-wrapper{
        z-index: 10;
        position:absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        top:0;
        left:0;
        background: white;
        font-size: 14px;
    }
    .left-cust-info .customer-popup-wrapper .close-btn{
        position: absolute;
        right:0;
        top:10px;        
    }
    .left-cust-info .customer-popup-wrapper .customer-popup-inner{
        overflow-y: auto;
        width: 100%;
        height: 100%;
        padding: 10px;
    }
</style>