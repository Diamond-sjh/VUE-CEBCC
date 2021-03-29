<template>
    <!--用户的具体业务内容区域，多页签显示， -->
    <div class="customer-bussiness-list">
        <el-tabs v-model ='curTab' addable @tab-remove="tabRemoveHandle">
            <el-tab-pane label="客户资料" :name="defaultTabName">
                <!-- <CustomerBaseDetailInfo ref="customerCaseInfo" :customer="customer" :isCustomerQuerySearch="isCustomerQuerySearch"></CustomerBaseDetailInfo> -->
                <!-- buttons:[{
                        'cname':'查询',
                    },{ 'cname':'视频手工进线'}] -->
                <TransBaseView :customer="customer" 
                    :menuObj="{
                        menu:{ 
                            url:'CustomerQuerySearch',
                            'cname':'手工进线',},
                            buttons:[
                                {PERM_NAME:'查询','ONCLICK':'submitBtnClickHandler',url:'CustomerBaseDetailInfo|customer',AUTO_DISPLAY_SIGN:1},
                                { PERM_NAME:'视频手工进线','ONCLICK':'videoSubmitBtnClickHandler',AUTO_DISPLAY_SIGN:1}
                            ]
                        }" 
                    ref="customerCaseInfo" 
                    @close="closeTrans" 
                    system="trans" 
                    :custToken="customer?customer.cust_token:''">
                </TransBaseView>
            </el-tab-pane>
            <el-tab-pane v-for="(tab) in dynamicTagLst" :key="tab.menu.url" :label="tab.menu.cname" :name="tab.menu.url" closable>
                <TransBaseView :customer="customer" :menuObj="tab" :ref="tab.menu.url" @close="closeTrans" system="trans" :custToken="customer?customer.cust_token:''" ></TransBaseView>
            </el-tab-pane> 
        </el-tabs>
    </div>
</template>
<script>
import Personas from '@/pages/main/Personas';
// import CustomerBaseDetailInfo  from '@/pages/trans/CustomerBaseDetailInfo';
import TransBaseView from '@/pages/components/TransBaseView';
import {transRule} from '@/utils/CommonAjaxMethods'
export default {
    components:{
        // CustomerBaseDetailInfo,
        TransBaseView,
        },
    props:{
        isCustomerQuerySearch:[Boolean],
    },
    data(){
        return{
            dynamicTagLst:[],//动态加载的页签显示
            customer:{},
            curTab:'',
            defaultTabName:"CustomerBaseDetailInfo",
        }
    },
   
    methods: {
        /**
         * 开启一个标签页
         * @param {string} url 页面路径
         * @param {boolean} isOpened 是否打开过，默认是否
         */
        openTrans(menuInfo){
            if(!menuInfo.url){
                this.csrAlert.error(`未找配置交易页面  [${menuInfo.cname}]`);
                return;
            }
            let isOpened = false;
            let len = this.dynamicTagLst.length;
            for(let idx=0;idx<len;idx++){
                if(this.dynamicTagLst[idx].menu == menuInfo){
                    isOpened = true;//已经打开过了
                    break;
                }
            }
            this.curTab = menuInfo.url; 
            if(isOpened){
                //打开过了无需交易规则,直接跳转tab
            }else{
                //获取交易规则
                transRule(menuInfo.code).then(req=>{
                    this.dynamicTagLst.push({menu:menuInfo,buttons:req.permList});
                    console.log(this.dynamicTagLst)
                }).catch(e=>{
                    console.log('CustomerBussinessListNew.openTrans()--[error]');
                });
            }
        },
        updateView(customer){
            this.customer = customer;
            // this.$refs.customerCaseInfo.$refs.transComponent.updateView(customer);
            console.log("RightCustomerMenuList.updateView()",this.customer);
        },
        closeTabHandler(){
            console.log("doubleclick close");
        },
        tabRemoveHandle(tabName,action){
            console.log(tabName,action);
            //页签是否需要二次弹出窗确认
            let tabs = this.dynamicTagLst;
            let idx = 0;
            let actTabName = this.defaultTabName;
            tabs.forEach((tab,index)=>{
                if(tab.menu.url == tabName){ 
                    idx =index;
                    let nextTab = this.dynamicTagLst[index+1]||this.dynamicTagLst[index-1];
                    if(nextTab){
                        actTabName = nextTab.menu.url;
                    }
                }
            });
            let refName = this.dynamicTagLst[idx].menu.url;
            let ref = this.$refs[refName];
            if(ref[0] && ref[0].beforeClose){
                ref[0].beforeClose(idx);
            }else{
                this.closeTrans(idx);
            }
        },
        //关闭页签
        closeTrans(idx){
            let actTabName = this.defaultTabName;
            this.curTab = actTabName;
            this.dynamicTagLst.splice(idx,1);
        },
        //重置页面，关闭所有动态交易tab页面,打开客户资料页面
        resetData(){
            this.dynamicTagLst = [];
            this.curTab = this.defaultTabName;
        },
    },
    mounted(){
        this.resetData();
    }
    
}
</script>

<style scoped>
    .customer-bussiness-list{
        background:white;
        /* padding:10px 0px 0px 10px; */
        width: 100%;
        height:100%;
        display: flex;
        flex-flow: column nowrap;
        overflow: hidden;
    }
    .customer-bussiness-list .el-tabs__nav .el-tabs__item:nth-child(1) span{
        display:none;
    }
    .customer-bussiness-list .panel-container{
        margin:10px;
        overflow-x: hidden;
        overflow-y:auto;
    }
    .customer-bussiness-list .el-tabs__new-tab{
        display:none !important;
        width: 0!important;
    }
</style>