<template>
    <!-- 聊天内容item -->
    <li class="chat-record-item" :class="contentClass">
        <div class="chat-record-item-inner">
            <!-- 用户头像 -->
            <el-avatar :size="35" class="img-avatar" v-if="contentClass=='position-left'" src="../../../assets/logo.png">C</el-avatar>
            <!-- 内容区 -->
            <span class="chat-record-item-content">{{contentObj.content}}</span>
            <!-- 坐席头像 -->
            <el-avatar :size="35" class="img-avatar" v-if="contentClass=='position-right'" src="../../../assets/logo.png">A</el-avatar>
        </div>
    </li>
</template>
<script>
export default {
    props:{
        contentObj:{type:Object,default:()=>{}}
    },
    data(){
        return{
            contentClass:"",
        }
    },
    methods:{

    },
    mounted(){
        this.contentClass = 'position-';
        if(this.contentObj.id ==null){
            this.contentClass += 'center'
        }else if(this.contentObj.id.length==0){
            this.contentClass += 'right'
        }else{
            this.contentClass += 'left'
        }

    }
}
</script>




