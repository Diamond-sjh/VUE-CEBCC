<template>  
    <el-calendar v-model="value" id="date"></el-calendar>
</template>
<script>
  export default {
    data() {
      return {
        value: new Date(),
      }
    },
    methods:{},
    mounted(){},
  }
</script>
<style scoped>
  #date{
    background: whitesmoke; 
  }
</style>

