<template>
    <div class="test-trans-02">
        测试交易页面002
    </div>
</template>
<script>
export default {
    name:"testtrans2",
    methods:{
        beforeClose(index){
            console.log("关闭交易页面2");
            this.csrAlert.confirm({
                title:"确定要关闭交易么？",
                icon:'warning',
            }).then(res=>{
                if(res){
                    this.$emit('close',index);
                }else{

                }
            })
            
        },
    },
}
</script>
