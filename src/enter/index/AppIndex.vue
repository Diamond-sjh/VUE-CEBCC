<template>
  <div id="app" class="csr-app">
    <component :is="currentCmp" @showIndex='showIndex'></component>
  </div>
</template>
<script>
import {mapActions,mapGetters} from 'vuex';
export default {
  name: 'AppIndex',
  data(){
    return{
      currentCmp:'',
      curAction:'',
    }
  },
  computed:{
    ...mapGetters(['getToken']),
    // currentCmp(){
    //   if(!this.curAction){
    //     return '';
    //   }else{
    //      return ()=>import(this.curAction);
    //   }
     
    // },
  },
  methods:{
    showIndex(){
      this.$router.push({path:""});
      // console.log("apindex");
      //判断是否登录
      if(this.getToken){
        if(this.curAction!='@/core/Index'){
          this.curAction='@/core/Index';
          this.currentCmp = ()=>import('@/core/Index');
          console.log("登陆成功");
        }
        
      }else{
        //没登录，加载登陆页面
        this.curAction= '@/pages/Login';
        this.currentCmp = ()=>import('@/pages/Login');
      }
    }
  },
  mounted(){
    this.$bus.$on(constants.event.EVENT_LOGIN_START,this.showIndex);
    this.showIndex();
  }
}
</script>

<style>
html {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #eaebec;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height:100%;

}

</style>
