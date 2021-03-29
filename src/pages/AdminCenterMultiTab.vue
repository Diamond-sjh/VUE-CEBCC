<template>
  <el-container id="adminApp">
    <el-aside width="200px" class="aside-bar">
      <AsideMenu @openAdminTab='openAdminMenu'></AsideMenu>
    </el-aside>
    <el-main>
       <!-- 用户的导航栏，多页签的显示位置 -->
      <el-row class="admin-nav-bar">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item class="nav-bar-item"  :index="it.id+''" v-for="(it,index) in navList" :key="it.id">
            <span class="nav-bar-title" >{{it.label}}</span> 
            <!-- @click="navItemClickHandler(index)" -->
            <i class="nav-bar-close el-icon-close" @click="closeNavClickHandler(index)"></i>
          </el-menu-item>
        </el-menu>
      </el-row>
      <div>
        <keep-alive :include="includeCmpNames">
          <!-- <router-view ></router-view> -->
          <component :is="currentCmp"></component>
        </keep-alive>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import AsideMenu from '@/pages/administration/AsideMenu';
export default {
  components:{AsideMenu,},
  name:'adminCenter',
  data(){
    return{
      includeCmpNames:[],//需要缓存的页面名称，
      curAction:'Welcome',
      activeIndex:'',//当前选中的页签
      /**
       * {
          id:'1',
          label:'',//nav显示的名字，与左侧菜单显示名字相同即可
          url:'',文件路径
      }*/
      navList:[],//打开过的页签列表
    }
  },
  computed:{
    currentCmp:function(){
      let currentCmp = this.curAction;
      return ()=>import('@/pages/administration/'+currentCmp);
    }
  },
  methods:{
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      let index = this.getNavItemIndexById(key);
      index = index>=0?index:0;
      let info = this.navList[index];
      if(info){
        this.openAdminMenu(info);
      }
    },
    setActiveIndex(idx){
      this.activeIndex = idx+'';
    },
    /**
     * 点击标navitem打开已有的页面
     */
    navItemClickHandler(idx){
      // this.setActiveIndex(this.navList[idx].id);
      // let info = this.navList[idx];
      // this.openAdminMenu(info);
    },
    /**
     * 点击左侧树打开菜单
     */
    openAdminMenu(info){
      let idx = this.getNavItemIndexById(info.id);
      if(idx<0){
        //菜单没有打开过，新开菜单
        this.navList.push(info);
        this.setActiveIndex(info.id)
      }else{
        //开启过菜单，进入菜单内容
        this.setActiveIndex(this.navList[idx].id);
      }
      let name = this.getComponentName(info.url);
      this.includeCmpNamesFunc(name);
      this.curAction = info.url;
    },
    closeNavClickHandler(idx){
      //关闭页签 
      if(idx == null || idx<0 || idx>=this.navList.length){
          console.log('关闭页签报错');
          return;
      }
      let name = this.navList[idx].name;
      //去掉页签信息
      this.navList.splice(idx,1);
      let newIdx = -1;
      if(idx>=this.navList.length){
          //最后一页
          newIdx = this.navList.length-1>=0?this.navList.length-1:-1;
      }else{
          newIdx = idx;
      }
      this.excludeCmpNameFunc(name);
      this.$nextTick(()=>{
          if(newIdx<0){
            this.curAction = 'Welcome';
          }else{
            let info = this.navList[newIdx];
            this.openAdminMenu(info);;
          }
      });
    },
    /**
     * 点击顶部导航栏打开菜单
     */
    includeCmpNamesFunc(cmpName){
      if(!cmpName){
        return;
      }
      for(let idx=0;idx<this.includeCmpNames.length;idx++){
        if(cmpName == this.includeCmpNames[idx]){
          return;
        }
      }
      this.includeCmpNames.push(cmpName);
    },
    excludeCmpNameFunc(cmpName){
      if(!cmpName){
        return;
      }
      for (let idx = 0;idx < this.includeCmpNames.length;idx++){
        if(this.includeCmpNames[idx] == cmpName){
          this.includeCmpNames.splice(idx,1);
          return;
        }
      }
    },
    /**
     * 根据菜单id获取当前navlst中打开过的对应菜单的index下标
     */
    getNavItemIndexById(id){
      for( let idx=0;idx<this.navList.length;idx++){
        const it = this.navList[idx];
        if(it.id == id){
          return idx;
        }
      }
      return -1;
    },
    //获取组件的名称name属性
    getComponentName(url){
      if(!url)return '';
      let idx = url.lastIndexOf('\/');
      let name = url;
      if(idx<0){

      }else{
        name = url.substring(idx+1);
      }
      name = name?name.toLowerCase():'';
      return name;
    },
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

</style>
