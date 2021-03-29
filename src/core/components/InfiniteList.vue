a<template>
    <!-- 滚动数据加载 -->
    <div class="csr-infinite-lst">
        <p>已展示{{total}}条数据</p>
        <div :style="wrapperStyle" class="csr-infinite-lst-container" id="InfiniteList">
            <slot name="scrollLst">
            </slot>
            <p v-if="nomore">没有更多了</p>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        //总数据内容
        total:{type:Number,default:0},
        nomore:{type:Boolean,default:false},
        wrapperStyle:{
            type:String,
            default:"height:300px;"
        }
    },
    data(){
        return{
        }
    },
    methods:{
        scrollHandler(){
            if(this.nomore==true){
                return;
            }
            let dom =document.getElementById("InfiniteList");
            const scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight;
            // console.log("infinitelist------scroll",scrollDistance,dom.scrollHeight,dom.scrollTop);
            if(scrollDistance<=0){
                // console.log(this.$parent);
                if(this.$parent.loadingMore){
                    this.$parent.loadingMore();
                    dom.scrollTop=dom.scrollTop-5;
                }else if(this.$parent.$parent.loadingMore){
                    this.$parent.$parent.loadingMore();
                    dom.scrollTop=dom.scrollTop-5;
                }
                
            }
        }
    },
    mounted(){
        //每页展示5条，
        // let $this=this;
        let dom =document.getElementById("InfiniteList");
        
        dom.addEventListener("scroll",this.scrollHandler)
    },
    beforeDestroy(){
        let elm =document.getElementById('InfiniteList');
        if(elm){
            elm.removeEventListener("scroll",this.scrollHandler);
        }
        
    }
}
</script>
<style>
.csr-infinite-lst-container{
    overflow:auto;
}
</style>


