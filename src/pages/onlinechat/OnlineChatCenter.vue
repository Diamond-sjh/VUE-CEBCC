<template>
    <!-- 文字客服的外框 -->
    <div class="online-chat-center">
        <div class="chat-top-nav-bar">
            <div class="customer-tag-lst">
                <CustomerTabItem 
                    v-for="(it,index) in chatList" 
                    :key="index" 
                    @tabClick="customerClickHandler" :customer="it" :class="[curCustomerId==it.id?'active':'']">
                </CustomerTabItem>
            </div>
            <div class="phone-container">
                <!-- 接听与挂断 -->
                <div class="phone-item" @click="testCustomer">
                    <div><i class="el-icon-phone"></i></div>
                    <span>接入</span>
                </div>
                <div class="phone-item">
                    <div><i class="el-icon-phone"></i></div>
                    <span>呼叫</span>
                </div>
                <div class="phone-item">
                    <div><i class="el-icon-phone-outline"></i></div>
                    <span>转接</span>
                </div>
                <div class="phone-item">
                    <div><i class="el-icon-phone"></i></div>
                    <span>暂停</span>
                </div>
                <div class="phone-item">
                    <div><i class="el-icon-phone"></i></div>
                    <span>签入</span>
                </div>
            </div>
        </div>
        <component v-for="(item,idx) in chatList" 
            :is="item.cmp" 
            :key="idx" 
            v-show="curCustomerId==item.id" 
            @endChat="closeCustomer" :customer="item">
        </component>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import CustomerTabItem from '@/pages/onlinechat/CustomerTabItem';
export default {
    components:{CustomerTabItem},
    data(){
        return{
            curCustomerId:0,//当前的开启窗口的用户id
            channel:constants.channel.ONLINE,
            cmpObjs:[],
            customerTabLst:[],//进来的用户列表，tab
            freeCmps:[],
            maxOnlineNum:6,//最大在线人数，目前是8个；
            chatList: [], // 当前进来的用户列表
        }
    },
    methods:{
        //todo 缓存的设置，
        getFreeCmp(){
            // if(this.freeCmps.length)
        },
        testCustomer(){
            let idx = this.chatList.length;
            //测试用用户从聊天服务器分发到前端，不是进线流程
            if(idx>=this.maxOnlineNum){
                this.csrAlert.warning(`超过进线数量上限数${this.maxOnlineNum}个,无法进线`);
                return;
            }
            let chatObj = {
                id: '100'+idx,
                name: '张晓红-'+idx,
                level: '白金客户',
                channel: 'app',
                cmp: ()=>import('@/pages/onlinechat/OnlineCustomerIndex'),               
            }
            this.curCustomerId = chatObj.id
            this.chatList.push(chatObj)
        },
        customerClickHandler(customer){
            console.log(customer)
            this.curCustomerId = customer.id;
        },
        closeCustomer(customer){
            // 关闭聊天用户
            this.chatList.forEach((item, index) => {
                if (item.id == customer.id) {
                    this.chatList.splice(index, 1)
                    this.curCustomerId = this.chatList[0]?this.chatList[0].id: 0
                }
            });
        },
    },
    mounted(){

    },
}
</script>
<style scoped>
    .online-chat-center{
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;   
        height: 100%;
        overflow: hidden;
    }
    .online-chat-center .chat-top-nav-bar{
        padding-top: 5px;
        display: flex;
        flex-flow: row nowrap;
        /* background-color: #303131; */
        justify-content: flex-start;
        width: 100%;
    }
    .online-chat-center .chat-top-nav-bar .customer-tag-lst{
        display: flex;
        flex-flow: row nowrap;
        flex: 1;
        overflow: hidden;
    }
    .online-chat-center .chat-top-nav-bar .phone-container{
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        padding-right: 20px;
    }
    .online-chat-center .chat-top-nav-bar .phone-container .phone-item{
        width: 40px;
        height: 65px;
        margin: 0 5px;
        border-radius: 5px;
        color: white;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
    }
    .online-chat-center .chat-top-nav-bar .phone-container .phone-item:hover{
    }

    .online-chat-center .chat-top-nav-bar .phone-container .phone-item i{
        font-size: 30px;
    }
    
</style>

