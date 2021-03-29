<template>
    <!-- 当前聊天记录内容框 -->
    <div class="chat-record-container infinite-list-wrapper" style="overflow-y:auto;padding:10px 5px;" >
        <ul class="list" v-infinite-scroll="loadingMore">
            <ChatRecordItem v-for="(record,index) in recordLst" :key="index" :contentObj="record"></ChatRecordItem>
        </ul>
        <p v-if="loading">加载中</p>
        <p v-if="noMore">没有更多了</p>
    </div>
</template>
<script>
import ChatRecordItem from '@/pages/onlinechat/chatwindow/ChatRecordItem'
export default {
    components:{ChatRecordItem},
    props:{
        //用户信息
        customer:{type:Object,default:()=>{}}
    },
    data(){
        return{
            count:10,
            recordLst:[
                {content:"您好我想查一下账单",id:"1111111"},
                {content:"有人么？",id:"111111"},//客户的
                {content:"您好，请问有什么可以帮到您的！",id:""},//坐席的
                {content:"----------系统分期查询中，请稍后------------",id:null},//系统的
            ],//聊天记录
            loading:false,
        }
    },
    computed:{
        noMore(){
            return this.count>=this.recordLst.length;
        }
    },
    methods:{
        loadingMore(){

        },
    },
    mounted(){

    },
}
</script>