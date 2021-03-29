<template>
    <div class="customer-tab-item" @click="customerClickHandler">
        <div class="customer-info">
            <div class="detail-container">
                <div class="customer-name"><span>{{customer.name}}</span><i class="new-msg">6</i></div>
                <span>阳光惠生活</span>
            </div>
            <div class="timer-container">
                <span>00:00:19</span>
                <div class="timer-container-bottom">
                    <div v-if="inline" class="inline-label"><span >进线</span></div>
                    <span v-else>钻石</span>
                </div>
            </div>
        </div>
        
        <!-- <div class="trangle"></div> -->
    </div>
</template>
<script>
export default {
    props:{
        customer:{
            type:Object,
            default:()=>{}
        },
        inline: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return{

        }
    },
    methods:{
        //更新显示的信息
        updateData(){

        },
        customerClickHandler(){
            this.$emit("tabClick",this.customer);
        }

    }
}
</script>
<style scoped>
    .customer-tab-item{
        display: flex;
        flex-flow: row nowrap;
        font-size: 12px;
        cursor: pointer;
        position: relative;
        color: white;
        height: 65px;
        width: 135px;
        border-radius: 6px 6px 0 0;
        background-image: linear-gradient(180deg,#044e90, #167dd9);
        border: 1px solid #27b9fc;
        margin-right: 6px;
    }
    .customer-tab-item .customer-info{
        display: flex;
        flex-flow: row nowrap;
        padding-left: 10px;
    }
    .customer-tab-item .customer-info .detail-container,.customer-tab-item .customer-info .timer-container{
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-start;
        justify-content: space-around;
    }
    .customer-tab-item .customer-info span{
        display: block;
        max-width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .customer-tab-item .customer-info .detail-container{
        position: relative;
        width: 65px;
    }
    .customer-tab-item .new-msg{
        background-color: red;
        width: 16px;
        height: 16px;
        color: white;
        font-size: 12px;
        border-radius: 50%;
        line-height: 16px;
        position: absolute;
        right: -12px;
        top:-7px;
        font-style: normal;
    }
    .customer-tab-item.active{
        background-color: white;
        color: #303133;
        border: none;
        background-image:linear-gradient(#fff, #fff);
    }
    /* .customer-tab-item .customer-info:hover{
        background-color: #909399;
        border-left: 4px solid #909399;
    } */
    .customer-tab-item .trangle{
        width: 0;
        height: 0;
        border-width: 0 15px 40px;
        border-style: none solid solid;
        border-color: transparent transparent #606266 #606266;
    }
    .customer-tab-item.active .trangle{
        border-color: transparent transparent white white;
    }
    .timer-container .inline-label{
        width: 40px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        background-image: linear-gradient(180deg, rgb(86,83,245), rgb(157,106,252));
        border-radius: 9px;
        
    }
    .timer-container .inline-label span{
        transform: scale(0.8)
    }
    .timer-container{
        padding-top: 3px;
        text-align: right;
    }
    .timer-container-bottom{
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
    }
    .customer-name{
        position: relative;
    }
    /* .customer-tab-item .trangle:hover{
        border-color: transparent transparent white white;
    } */
</style>
