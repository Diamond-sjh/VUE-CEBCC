<template>
    <!-- 用户的导航栏，多页签的显示位置 -->
    <el-row class="admin-nav-bar">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item class="nav-bar-item"  :index="it.id" v-for="(it,index) in navList" :key="it.id">
                <span class="nav-bar-title" @click="openNavClickHandler(index)">{{it.label}}</span><i class="nav-bar-close el-icon-close" @click="closeNavClickHandler(index)"></i>
            </el-menu-item>
        </el-menu>
    </el-row>
</template>
<script>
export default {
    data(){
        return{
            activeIndex:'',//当前选中的页签
            /**
             * {
                    id:'1',
                    name:"administration",//vue文件里面的name属性名字，用于keepalive的include添加与删除
                    label:'',//nav显示的名字，与左侧菜单显示名字相同即可
                }*/
            navList:[],//打开过的页签列表
            rootUrl:'/admin/',
        }
    },
    methods:{
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        /**
         * 点击标navitem打开已有的页面
         */
        openNavClickHandler(idx){
            this.activeIndex =this.navList[idx].id;
            let info = this.navList[idx];
            this.$router.push({
                path:this.rootUrl+info.url
            });
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
            console.log("AdminNavBar-----closeNavClickHandler()",idx);
            let newIdx = -1;
            if(idx>=this.navList.length){
                //最后一页
                newIdx = this.navList.length-1>=0?this.navList.length-1:-1;
            }else{
                newIdx = idx;
            }
            this.$emit('closeAdminMenu',name);
            this.$nextTick(()=>{
                if(newIdx<0){
                    //没有页面了
                    this.$router.push({path:this.rootUrl});
                }else{
                    this.$router.push({
                        path:this.rootUrl+this.navList[newIdx].url
                    })
                    this.activeIndex =this.navList[newIdx].id;
                }
            })
        },
        /**
         * 左侧点击页面菜单后添加或者选中指定导航栏
         */
        openAdminMenu(info){
            let idx = this.getNavItemIndexById(info.id);
            if(idx<0){
                //菜单没有打开过，新开菜单
                this.navList.push(info);
                this.activeIndex = info.id;
            }else{
                //开启过菜单，进入菜单内容
                this.activeIndex = this.navList[idx].id;
            }
           
            let name = info.name;
            console.log("openAdminMenu---component name:",name);
            return name;
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
       
    }
}
</script>
<style scoped>
   
    .nav-bar-title{
        font-size: 14px;
    }
    .nav-bar-close{
        font-size: 12px;
        margin-top: -15px;
        padding-left: 5px;
    }
</style>
