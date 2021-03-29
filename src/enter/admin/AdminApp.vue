<template>
  <component :is="currentCmp"></component>
</template>
<script>
import {mapActions,mapGetters} from 'vuex';
export default {
  name: 'administration',
  // components:{AsideMenu},
  data(){
    return{
      currentCmp:'',
      curAction:'',
    }
  },
  computed:{
    ...mapGetters(['getToken']),
  },
  methods:{
    showIndex(){
      //判断是否登录
      if(this.getToken){
        this.currentCmp = ()=>import('@/pages/AdminCenter');
        console.log("登陆成功");
      }
    }
  },
  mounted(){
    console.log("welcome to background system manager");
    this.showIndex();
    }
}
</script>

<style  scoped>
  #adminApp {
    width: 100%;
    height:100%;
    background: #eaebec;
    
  }
  #adminApp .aside-bar{
    padding: 30px 0px;
    background: #303131;
  }
</style>