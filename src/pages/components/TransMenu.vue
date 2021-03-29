<template>
    <!-- 业务菜单 ,悬浮在某个菜单项目上时候需要显示下面的子菜单了类型-->
    <div class="trans-menu trans-menu-bg">
        <ul class="trans-menu-container">
            <!-- @mouseleave="menuItemLeaveHandler" -->
            <li v-for="(it,index) in menuLst" :key="it.id" @click="menuItemClickHandler(it,index)" :class="[currentMenuItem==it.menus?'active-item':'']">{{it.cname}}</li>
        </ul>
        <ul class="menu-detail-container" 
            :style='"left:"+(130*currentIdx)+"px;"' 
            v-show="currentMenuItem" >
            <!-- @mouseleave="childItemLeaveHandler" -->
            <li class="menu-detail-item" v-for="item in (currentMenuItem?currentMenuItem:[])" :key="item.id" @click="clickMenuChildItemHandler(item)">{{item.cname}}</li>
        </ul>
        <!--菜单悬浮后的内容显示区域  -->
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    data(){
        return{
            menuLst:[],
            currentIdx:0,
            currentMenuItem:null,//当前选中的menuItem引用，
            isVisible:false,
        }
    },
    computed: {
        ...mapGetters(['getTransMenu']),
    },
    methods:{
        menuItemClickHandler(menuItem,index){
            if(this.currentMenuItem == null || this.currentMenuItem!=menuItem.menus){
                this.currentMenuItem = menuItem.menus;
                this.currentIdx = index;
            }else{
                this.currentMenuItem = null;
                this.currentIdx = -1;
            }
            
            // console.log("menuItemClickHandler-------",item)
        },
        clickMenuChildItemHandler(menuItem){
            this.currentMenuItem = null;
            console.log("点击开启了业务菜单-----",menuItem.cname,menuItem);
            this.$emit('openTrans',menuItem);
        },
        menuItemLeaveHandler(e){
            // console.log(e);
            if(!e)return;
            if(e.offsetY<0){
                this.currentIdx=0;
                this.currentMenuItem=null;
            }
        },
        childItemLeaveHandler(e){
            if(!e)return;
            // console.log(e.target.offsetHeight,e.offsetY);
            if(e.offsetY<=0 || (e.offsetX>0 &&e.offsetX<e.target.offsetWidth && e.offsetY < (e.target.offsetHeight-5)))return;
            this.currentIdx =0;
            this.currentMenuItem=null;
        },
        updateView(data){
            console.log("TransMenu.updateView()");
        }
    },
    mounted(){
        this.menuLst = this.getTransMenu;
        this.$bus.$on(constants.uiEvent.EVENT_OPEN_UI,this.openUI);
        // console.log(this.menuLst);
    }
}
</script>
<style scoped>
    .trans-menu{
        position: relative;
        z-index: 10;
        width: 100%;
        border-radius: 4px;
        /* background: linear-gradient(rgba(228,242,252,1),rgba(243,250,255,1),rgba(218,233,244,1)); */
    }
    .trans-menu ul{
        list-style: none;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: center;
        
    }
    .trans-menu ul.trans-menu-container li{
        padding:0px 12px;
        margin: 10px 0px;
        border-right: 1px solid rgb(194,207,254);
        cursor: pointer;
        font-size: 14px;
        line-height: 14px;
        width: 130px;
        text-align: center;
    }
      /* 选中的二级菜单 */
    .trans-menu ul.trans-menu-container li.active-item{
        color: gray;
    }
    .trans-menu ul.menu-detail-container{
        background-color: white;
        border: 1px solid #e6e6e6;
        padding: 10px;
        border-radius: 5px;
        color: black;
        position: absolute;
        display: flex;
        flex-flow: row wrap;
        max-width: 660px;
       
    }
  

    .trans-menu ul.menu-detail-container li.menu-detail-item{
        font-size: 12px;
        width: 150px;
        box-sizing: border-box;
        padding: 4px 5px;
        cursor: pointer;
    }
    .trans-menu ul.menu-detail-container li.menu-detail-item:hover{
        font-size: 12px;
        width: 150px;
        color:#909399;
        box-sizing: border-box;
        padding: 4px 5px;
        cursor: pointer;
        font-weight: bold;
    }
</style>
