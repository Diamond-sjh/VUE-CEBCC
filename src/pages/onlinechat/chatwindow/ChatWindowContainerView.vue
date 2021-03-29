<template>
    <!-- 在线座席左侧的聊天框界面 -->
    <div class="chat-window-container">
        <ChatRecordContainer class="chat-record-container"></ChatRecordContainer>
        <div class="chat-editor-container">
            <div class="left-side">
                <ChatToolsContainer class="chat-tools-container"></ChatToolsContainer>
                <el-input type="textarea" 
                    :maxlength="120" 
                    show-word-limit 
                    resize="none" 
                    v-model="agentContent" 
                    :rows="7" @select="agentCotentChangeHandler">
                </el-input>
            </div>
            <div class="right-side">
                <el-button size="mini" @click="btnMessageSendClickHandler">发送</el-button>
                <el-button size="mini" @click="btnSatisfyClickHandler">满意度</el-button>
                <el-button size="mini" @click="btnInvalidSessionClickHandler">无效回话</el-button>
                <el-button size="mini" @click="btnSmsMessageClickHandler">短信发送</el-button>
                <el-button size="mini" @click="btnEmailClickHandler">邮件发送</el-button>
                <el-button size="mini" @click="btnMediaClickHandler">语音发送</el-button>
            </div>
        </div>
        
       
        <el-row class="chat-ends pt10" type="flex" justify="start">
            <el-button type="danger" @click="closeCustomerChatHandler">结束</el-button>
            <el-button>小结</el-button>
        </el-row>
        <el-row class="chat-buttons pt10 pb10">
            <el-button type="primary">智能业务提示</el-button>
            <el-button type="primary">智能话术提示</el-button>
        </el-row>
    </div>
</template>
<script>
import ChatRecordContainer from '@/pages/onlinechat/chatwindow/ChatRecordContainer';
import ChatToolsContainer from '@/pages/onlinechat/chatwindow/ChatToolsContainer';
export default {
    components:{ChatRecordContainer,ChatToolsContainer},
    props:{
        customer:{
            type:Object,
            default:()=>{}
        },
    },
    data(){
        return{
            agentContent:""
        }
    },
    methods:{
        //结束聊天，关闭整个页面
        closeCustomerChatHandler(){
            console.log("close CustomerChatHandler---");
            this.$emit('endChatClick',null);
        },
        agentCotentChangeHandler(param){
            console.log(param)
        },
        //发送
        btnMessageSendClickHandler(){

        },
        //满意度
        btnSatisfyClickHandler(){

        },
        //无效会话
        btnInvalidSessionClickHandler(){

        },
        //短信发送
        btnSmsMessageClickHandler(){

        },
        btnEmailClickHandler(){

        },
        //语音发送
        btnMediaClickHandler(){

        }
    },
}
</script>
