<template>
    <!--用户的具体业务内容区域，多页签显示， -->
    <div class="customer-bussiness-list">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" >
            <!-- 默认 -->
            <el-menu-item :index="it.url" v-for="it in defaultTagLst" :key="it.id" @click ="defaultTabClickHandler(it)">
                <span>{{it.name}}</span>
            </el-menu-item>
            <!-- 可关闭的页签内容 -->
            <el-menu-item :index="it.url" v-for="(it,index) in dynamicTagLst" :key="it.id" @click ="openTrans(it)">
                <span>{{it.cname}}</span><i class="nav-bar-close el-icon-close" @click="closeTabClickHandler(index)"></i>
            </el-menu-item>
        </el-menu>
        <div class="panel-container">
            <keep-alive :include="includeCmps">
                <component  :is="curCmp" :customer="customer"></component>
            </keep-alive>
        </div>
    </div>
</template>
<script>
import Personas from '@/pages/main/Personas';
export default {
    data(){
        return{
            activeIndex:'',
            defaultTagLst:[
                {name:'客户资料',url:"CustomerBaseDetailInfo"},
                // {name:'用户画像',url:"Personas"},
            ],//默认行为页面
            dynamicTagLst:[],//动态加载的页签显示
            curAction:'',
            customerCmp:()=>import('@/pages/trans/CustomerBaseDetailInfo'),
            includeCmps:['customerbaseinfo'],
            customer:{},
        }
    },
    computed:{
        curCmp:function(){
            if(!this.curAction || this.curAction.length==0||this.curAction=="CustomerBaseDetailInfo"){
                return this.customerCmp;
            }else{
                return ()=>import('@/pages/trans/'+this.curAction);
            }
        }
    },
    methods: {
        //点击tab事件
        defaultTabClickHandler(item){
            this.curAction =item.url;
            this.activeIndex = item.url;
        },
        
        /**
         * 关闭交易页面
         */
        closeTabClickHandler(index){
            let url = this.dynamicTagLst[index].url.toLowerCase();
            //清理includecmps
            this.deleteIncludeCmps(url);

            //删减标签项
            this.dynamicTagLst.splice(index,1);
            let newIdx = index;
            //打开最后一个关闭页签的前一个页面
            if(newIdx >=this.dynamicTagLst.length){
                newIdx = this.dynamicTagLst.length-1;
            }
            
            if(newIdx>=0){
                this.openTrans(this.dynamicTagLst[newIdx]);
            }else{
                //显示客户信息界面
                this.defaultTabClickHandler(this.defaultTagLst[0]);
            }
        },
        /**
         * 开启一个标签页
         * @param {string} url 页面路径
         * @param {boolean} isOpened 是否打开过，默认是否
         */
        openTrans(menuInfo){
            console.log(menuInfo);
            let isOpened = false;
            let len = this.dynamicTagLst.length;
            for(let idx=0;idx<len;idx++){
                if(this.dynamicTagLst[idx] == menuInfo){
                    isOpened = true;//已经打开过了
                    break;
                }
            }

            //没有打开过，添加到标签列表中，同时添加includecmps
            if(!isOpened){
                this.addIncludeCmps(menuInfo.url.toLowerCase());
                this.dynamicTagLst.push(menuInfo);
            }
            this.curAction = menuInfo.url;
            this.activeIndex = menuInfo.url;
        },
        addIncludeCmps(cmpName){
            if(!cmpName) return;
            this.includeCmps.push(cmpName);
        },
        deleteIncludeCmps(cmpName){
            let len = this.includeCmps.length;
            for(let idx=0;idx < len;idx++){
                if(this.includeCmps[idx] == cmpName){
                    this.includeCmps.splice(idx,1);
                    return;
                }
            }
        },
        updateView(customer){
            this.customer = customer;
            console.log("RightCustomerMenuList.updateView()",this.customer);
        },
        
    },
    mounted(){
        this.activeIndex = this.defaultTagLst[0].url;
    }
    
}
</script>

<style scoped>
    .customer-bussiness-list{
        /* padding:10px 0px; */
        width: 100%;
        height:100%;
        display: flex;
        flex-flow: column nowrap;
        overflow: hidden;
    }
    .customer-bussiness-list .panel-container{
        margin:10px;
        overflow-x: hidden;
        overflow-y:auto;
    }
</style>