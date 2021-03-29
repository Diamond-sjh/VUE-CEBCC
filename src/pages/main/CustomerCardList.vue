<template>
    <div class="customer-card-list" :class="getHeight()">
        <el-collapse-transition>
            <el-tabs class="tab-container" v-model="curTab" type="card" tab-position="left" @tab-click="handleClick" v-show="isShow">
                <el-tab-pane v-for="it in tabType" :key="it.name"  :label="it.label" :name="it.bussType">
                    <component :is="cmpMap[it.name]" @cardChange="cardChangeHandler" :ref="it.refName"></component>
                </el-tab-pane>
            </el-tabs>
        </el-collapse-transition>
        <!-- 上下箭头区域 -->
        <div class="option-btn-bar">
            <!-- 局部显隐箭头 -->
            <span class="option-btn" v-show="!isScreenShow" @click="animationHandle"><i class="text-theme-color" :class="isShow?'el-icon-caret-top':'el-icon-caret-bottom'"></i></span>
            <!-- 全局显隐箭头 -->
            <span class="option-btn" v-show="isShow" @click="screenShowHandler"><i class="text-theme-color" :class="!isScreenShow?'el-icon-caret-bottom':'el-icon-caret-top'"></i></span>
        </div>
    </div>
</template>
<script>
import CreditCardLst from '@/pages/main/cardlist/CreditCardLst';
import CreditAndDebitCardLst from '@/pages/main/cardlist/CreditAndDebitCardLst';
import DebitCardLst from '@/pages/main/cardlist/DebitCardLst';
export default {
    data(){
        return{
            curTab: '',//切换标签
            tabType:[
                {label:"贷",name:"first",refName:'creditCardLst',url:'CreditCardLst',bussType:constants.customer.CREDIT_BUSSINESS_TYPE},
                {label:"合",name:"second",refName:'creditDebitCardLst',url:'CreditAndDebitCardLst',bussType:constants.customer.CREDIT_DEBIT_BUSSINESS_TYPE},
                {label:"借",name:"third",refName:'debitCardLst',url:'DebitCardLst',bussType:constants.customer.DEBIT_BUSSINESS_TYPE},
                {label:"公",name:"fourth",refName:'busyCardLst',url:''},
                // other:{label:"公",name:"fourth",refName:'otherCardLst'},
            ],
            cmpMap:{
                first:CreditCardLst,
                second:CreditAndDebitCardLst,
                third:DebitCardLst
            },
            isShow:true,//局部显示
            isScreenShow:false,//全屏显示
        }
    },
    methods: {
        //借记卡切卡
        deditCardChangeHandler(curCard){
            console.log("deditCardChangeHandler");
        },
        creditCardChangeHandler(curCard){
            console.log("creditCardChangeHandler");
        },
        cardChangeHandler(val){
            //切卡操作
            console.log(val,"这是一个切卡操作！")
            
        },
        handleClick(tab, event) {
            console.log(tab);
            //------------------------------------测试代码------------------------------
            // if(tab.name == "second"){
            //     this.$refs.crebitCardLst.setCurrentCard(this.tableCredit[0]);
            // }
            //-------------------------------------------------------------------------
            let tabItem = this.getTabItemByBussType(tab.name);
            if(!tabItem){
                return;
            }

        },
        updateView(customer){

            if(!customer || !customer.cardListIColl){
                return;
            }
            //卡的业务类型不知道，直接返回
            if(!customer.warrantType){
                return;
            }
            // this.customer.cardListIColl //卡列表集合
            // customer.bussType = constants.customer.DEBIT_BUSSINESS_TYPE; //测试代码，综合业务类型
            //根据后台返回来的信息中的业务类型判定当前是什么业务
            //自动切换到指定业务并且更新帐卡列表
            // let tabItem = this.getTabItemByBussType(customer.bussType);
            for(let idx=0;idx<this.tabType.length;idx++){
                const item = this.tabType[idx];
                if(item.bussType == customer.warrantType){
                    this.$refs[item.refName][0].updateView(customer.cardListIColl);
                    //同时切换帐卡列表的tab
                    this.curTab = item.bussType;
                    break;
                }
            }
        },
        resetView(){
            for(let idx=0;idx<this.tabType.length;idx++){
                const item = this.tabType[idx];
                let obj = this.$refs[item.refName];
                if(obj &&obj[0] && obj[0].resetData ){
                    this.$refs[item.refName][0].resetData();
                }else{
                    console.log('[error]: '+item.refName +" is not exist or the function is not exist");
                }
            }
            //默认设置打开第一个tab标签
            this.curTab = this.tabType[0].bussType;
            console.log("CustomerCardList.resetview()");
        },
        animationHandle(){
            this.isShow = !this.isShow;
        },
        screenShowHandler(){
            this.isScreenShow = !this.isScreenShow;
            this.$emit('cardScreenChange',this.isScreenShow);
        },
        getTabItemByBussType(bussType){
             for(let idx=0;idx<this.tabType.length;idx++){
                if(this.tabType[idx].bussType == bussType){
                    return this.tabType[idx];
                }
            }
            return null;
        },
        getHeight(){
            if(this.isScreenShow == true){
                //全屏显示
                return 'height-screen';
            }else{
                //判断是否隐藏
                if(this.isShow){
                    return 'height140';
                }else{
                    return 'hidden';
                }
            }
        }
    },
    mounted(){
        this.curTab = this.tabType[0].bussType;
    }
}
</script>
<style scoped>
  .customer-card-list{
    background:white;
    /* padding:10px 0px 0px 10px; */
    overflow: hidden;
    position: relative;
  }
  .customer-card-list.hidden{
      height: 15px;
  }
  .customer-card-list.height140{
    max-height: 150px;
    min-height: 150px;
  }
  .customer-card-list.height-screen{
      height:100%;
  }

  .customer-card-list .tab-container{
    width:100%;
    overflow: hidden;
    height: calc( 100% - 15px );
    /* height:100%; */
  }
  .customer-card-list .tab-container /deep/ .el-tabs__header.is-left{
      margin-right: 0;
  }
  .customer-card-list .tab-container /deep/ .el-tabs__item{
      padding: 0 10px;
      height:32px;
      line-height: 32px;
      /* color: black; */
      /* background: red; */
  }
  /* .customer-card-list .tab-container /deep/ .el-table__header th,
  .customer-card-list .tab-container /deep/ .el-table__header tr{
      background-color: rgb(225,240,251);   
  }
   */
  .customer-card-list .tab-container /deep/ .el-table th,.customer-card-list .tab-container /deep/ .el-table th>.cell,
    .customer-card-list .tab-container /deep/ .el-table td,.customer-card-list .tab-container /deep/ .el-table td>.cell{
        padding:2px 2px;
    }
  .customer-card-list .tab-container .tab-panel-inner{
    width: 100%;
    overflow: hidden;
  }
  .customer-card-list .option-btn-bar{
      position: absolute;
      bottom: 0px;
      width:100%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
  }
  .customer-card-list .option-btn-bar .option-btn{
      cursor: pointer;
      font-size: 12px;
      line-height:12px;
      padding:2px 30px;
      margin: 0 5px;
      border: 1px #e6e6e6 solid;
      border-radius: 0 0 5px 5px;
      background-color: white;
  }
</style>