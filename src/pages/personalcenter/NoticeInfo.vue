<template>
    <el-row class="noticeinfo text-left">
        <div class="seemore">
            <h4>公告信息</h4>
            <span >查看更多</span>
        </div>
        <ul >
            <li v-for="item in info" :key="item.id"><i></i>{{item.name}}</li>
        </ul>
    </el-row>
</template>
<script>
export default {
    data(){
        return{
            info:[
                {name:"第一条公告信息很重要"},
                {name:"第二条公告信息很重要"},
                {name:"第三条公告信息很重要"},
                {name:"第四条公告信息很重要"},
                {name:"第五条公告信息很重要"},

            ]
        }
    }
    
}
</script>
<style scoped>

    .text-left{
        text-align: left;
        padding-left: 15px;
    }
    .noticeinfo ul{
        margin: 5px 0px;
    }
    .noticeinfo ul li{
        font-size: 14px;
        list-style:none;  
        height: 35px; 
        line-height: 35px;
        border-bottom:1px dashed rgb(165, 161, 161);
        
    }.noticeinfo ul li:last-child{
        border-bottom:none;
    }
    .noticeinfo li i{
        display:inline-block;
        width: 10px;
        height: 10px;
        background: rgb(94, 211, 240);
        border-radius: 10px;
        margin-right: 10px;
    }
    .seemore{
        width: 100%;
        padding-top: 5px;
    }
    .seemore span{
        display: block;
        margin-top: -23px;
        margin-right: 5px;
        font-size: 14px;
        text-align: right;
        color:cornflowerblue;
    }
    
</style>