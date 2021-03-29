<template>
  <el-container id="adminApp">
    <el-aside width="240px" class="aside-bar">
      <AsideMenu @openAdminTab='openAdminMenu'></AsideMenu>
    </el-aside>
    <!-- <el-main> -->
      <!-- <el-menu :default-active="activeIndex" mode="horizontal" v-show="curMenu">
        <el-menu-item class="nav-bar-item"  index="0" >
          <span>{{tabName}}</span>
        </el-menu-item>
      </el-menu> -->
      <el-container  style="background-color:#f1f8fe;">
        <el-main  class="bg-white">
          <OptionResultTipBar ref="resLstBar" class="mb20"></OptionResultTipBar>
          <!-- <component :is="currentCmp" ></component> -->
          <TransBaseView class="pt20" :menuObj="curMenu"  system="administration" v-show="curMenu.menu && curMenu.menu.url!=null" ></TransBaseView>
        </el-main>
      </el-container>
    <!-- </el-main> -->
  </el-container>
</template>
<script>
import AsideMenu from '@/pages/administration/AsideMenu';
import OptionResultTipBar from '@/pages/components/OptionResultTipBar'; 
import TransBaseView from  '@/pages/components/TransBaseView';
import {transRule} from '@/utils/CommonAjaxMethods'
export default {
  components:{AsideMenu,OptionResultTipBar,TransBaseView},
  name:'adminCenter',
  data(){
    return{
      curAction:'Welcome',
      activeIndex:'0',//当前选中的页签
      tabName:'欢迎',
      curMenu:{
        menu:{},//菜单内容，
        buttons:[],//权限内容
      },
      /**
       * {
          id:'1',
          label:'',//nav显示的名字，与左侧菜单显示名字相同即可
          url:'',文件路径
      }*/
    }
  },
  // computed:{
  //   currentCmp:function(){
  //     let currentCmp = this.curAction;
  //     this.clearResTip();
  //     return ()=>import('@/pages/administration/'+currentCmp);
  //   }
  // },
  methods:{

    /**
     * 点击左侧树打开菜单
     */
    openAdminMenu(info){
      console.log(info);
      //获取交易规则
      transRule(info.code).then(req=>{
        //添加权限判定，是否能够打开页面
        this.curAction = info.url;
        this.tabName = info.cname;
        this.curMenu = { menu:info,buttons:req.permList};
      }).catch(e=>{
        console.log('CustomerBussinessListNew.openTrans()--[error]');
      });
      
    },
    //添加操作结果提示，小绿点
    addResTipItem(item){
      this.$refs.resLstBar.addItem(item);
    },
    //批量添加
    addResTipItems(items){
      this.$refs.resLstBar.addItems(items);
    },
    clearResTip(){
      if(this.$refs.resLstBar){
        this.$refs.resLstBar.reset();
      }
    },
    /**
     * @param {object} 
     * {
     *  flush:true,//是否清空
     *  info：[] | object 小绿点内容 
     * }
     *  info参数的例子：{
          //信息类型： success成功  error失败  warning 提醒
          type: constants.optionResultType.xxxx, 
          //信息内容 ，根据需求分析自己编写成srting字符串即可
          content:"xxxxxxxxxxx",    
        }
        或者 ：[{....}]
     * 
     */
    resultChange({info,flush}){
      if(flush==true){
        this.clearResTip();
      }
      if(!info || info.length <=0){
        this.clearResTip();
      }else {
        if(Array.isArray(info)){
          this.addResTipItems(info);
        }else{
          this.addResTipItem(info);
        }
      }
    }
  }
}
</script>
<style >
  #adminApp{
    height: 100%;
  }
  .main_count{
    height: 600px;
    overflow-y: auto;
    padding: 0px;
    background: rgb(224, 222, 222);
  }
  #adminApp .el-main{
    padding: 0;
    margin: 10px 20px;
  }
</style>
