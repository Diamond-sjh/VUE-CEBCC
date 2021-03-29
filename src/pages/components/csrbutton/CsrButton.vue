<template>
    <!-- 按钮样式 -->
    <span class="csr-button" >
        <i :class="icon"></i>
        <span ><slot>button</slot></span>
    </span>
</template>

<script>
export default {
    name:'csrButton',
    props:{
        icon:{type:String,default:""}     
    },
    methods:{
    }
}
</script>
