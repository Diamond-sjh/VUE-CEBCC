<template>
    <div class="online-content-container">
        <ChatWindowContainer class="left-part" @endChatClick="endChatClick"></ChatWindowContainer>
        <div class="right-part">
            <el-tabs v-model="activeTab" type="card" @tab-click="tabClickHandler">  
                <el-tab-pane label="常用话术" name="1">
                </el-tab-pane>
                <el-tab-pane label="知识检索" name="2">
                </el-tab-pane>
                <el-tab-pane label="业务办理" name="3">
                </el-tab-pane>
            </el-tabs>
            <!-- <el-menu :default-active="activeTab" class="el-menu-demo" mode="horizontal" @select="tabClickHandler">
                <el-menu-item index="1" >
                    <span>常用话术</span>
                </el-menu-item>
                 <el-menu-item index="2" >
                    <span>知识检索</span>
                </el-menu-item>
                <el-menu-item index="3" >
                    <span>业务办理</span>
                </el-menu-item>
            </el-menu> -->
            <keep-alive>
                <component :is="curCmps[activeTab]" :customer="customer"></component>
            </keep-alive>
        </div>
    </div>
</template>
<script>
import ChatWindowContainer from '@/pages/onlinechat/chatwindow/ChatWindowContainerView';
export default {
    name:"onlineCustomerIndex",
    components:{ChatWindowContainer},
    props:{
        customer:{
            type:Object,
            default:()=>{}
        }
    },
    data(){
        return {
            activeTab:"1",
            curCmps:{},
        }
    },
    methods:{
         tabClickHandler(tab,event){
        //  tabClickHandler(key,keyPath){
            this.activeTab = tab.name;
            console.log(this.activeTab);
            let cmp = this.curCmps[this.activeTab];
            if(!cmp){
                let url = '';
                if(this.activeTab == 1){
                    url ='OnlineCommonSpeech';
                }else if(this.activeTab == 2){
                    url ='KnowledgeSearch';
                }else if(this.activeTab ==3){
                    url ='BussinessContainer';
                }
                this.loadCmp(url);
            }
        },
        endChatClick(){
            this.$emit("endChat",this.customer);
        },
        loadCmp(url){
            this.curCmps[this.activeTab]=()=>import('@/pages/onlinechat/'+url);
        }
    },
    mounted(){
        this.activeTab = '1';
        this.loadCmp('OnlineCommonSpeech');
    }
}
</script>
