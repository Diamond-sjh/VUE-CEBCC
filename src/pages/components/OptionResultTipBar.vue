<template>
    <!-- 页面内的结果提示栏 所谓的老系统的小绿点。。。 -->
    <div class="option-result-tip-bar" v-show="resLst.length>0">
        <ul>
            <li v-for="(item,index) in resLst" :key="index">
                <span :class="getTypeClass(item.type)"><i class="el-icon-info"></i>{{item.content}}</span>
            </li>
        </ul>        
    </div>
</template>
<script>
export default {
    data(){
        return{
            resLst:[],//结果列表
        }
    },
    methods:{
        getTypeClass(type){
            if(type==this.$constants.optionResultType.success){
                return 'tip-success';
            }else if(type == this.$constants.optionResultType.error){
                return 'tip-error';
            }else{
                return 'tip-warning';
            }
        },
        /**
            {
                //信息类型： success成功  error失败  warning 提醒
                type: constants.optionResultType.xxxx, 
                //信息内容 ，根据需求分析自己编写成srting字符串即可
                content:"xxxxxxxxxxx",    
                
            }
         */
        //添加单条
        addItem(param){
            if(!param){
                return;
            }
            this.resLst.push(param);
        },
        reset(){
            this.resLst=[];
        },
        //一次性添加多个
        addItems(params){
            if(!params || !Array.isArray(params)){
                return;
            }
            let count = 0,len=params.length;
            while(count<len){
                this.addItem(params[count]);
                count +=1;
            }
        },
    },
    mounted(){

    },
    beforeDestroy(){

    }
}
</script>
<style scoped>

</style>
