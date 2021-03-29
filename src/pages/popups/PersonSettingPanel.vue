<template>
    <!--个人设置popup  常用菜单，主题设置，基本信息 功能 -->
    <div class="personal-setting">
        <el-tabs type="card" v-model="activeTab">
            <!-- <el-tab-pane label="基本信息" name="0">
                <div class="base-info-setting">
                    <el-form  label-width="80px" style="width:400px;">
                        <el-form-item label="姓名"><el-input v-model="baseInfo.name" :disabled="true"></el-input></el-form-item>
                        <el-form-item label="头像">
                            <el-avatar icon="el-iconuser-solid">user</el-avatar>
                        </el-form-item>
                        <el-form-item label="个性签名">
                            <el-input type="textarea" 
                                :rows="5" 
                                placeholder="请输入签名" 
                                maxlength="200" 
                                show-word-limit 
                                resize="none"
                                v-model="baseInfo.signature">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane> -->
            <el-tab-pane label="常用菜单" name="1">
                <div class="menu-setting">
                    <el-tree 
                        :data="menuLst" 
                        show-checkbox 
                        node-key="id" 
                        :default-expanded-keys="[1,2]" 
                        :default-checked-keys="selectedMenuLst" 
                        @check-change="treeCheckChangeHandler" 
                        :props="{
                            children:'menus',
                            label:'cname',
                        }">
                    </el-tree>
                    <el-button type="primary" class="submit-btn"  @click="quickMenuSaveBtnClickHandler">修改</el-button>
                </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="主题" name="2">
                <div class="theme-setting">
                    <div class="theme-class-item" v-for="it in themeLst" :key="it.id">
                        <div class="theme-color" :style="'background:'+it.theme+';'"></div>
                        <el-radio v-model="selectedTheme" :label="it.id" class="pt20">{{it.name}}</el-radio>
                    </div>
                </div>
            </el-tab-pane> -->
        </el-tabs>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data(){
        return {
            activeTab:'1',
            selectedTheme:'001',
            baseInfo:{
                name:"用户姓名",
                signature:"我的签名",
            },
            themeLst:[
                {theme:"pink",name:"可爱粉",id:"001"},
                {theme:"blue",name:"集团蓝",id:"002"},
                {theme:"orchid",name:"光大紫",id:"003"},
            ],
            //全部菜单列表，后台获取
            menuLst:[],
            //选择的常用菜单项
            selectedMenuLst:[],
        }
    },
    computed:{
        ...mapGetters(['getTransMenu','getAgentQuickTransMenu']),
    },
    methods:{
        ...mapActions(['actionSetAgentQuickTransMenuLst']),
        //todo： 获取已经选择过的菜单列表，对应到普通列表中，并且选中
        initMenuLst(){
            this.menuLst = this.getTransMenu;
            this.updateSelectLst(this.getAgentQuickTransMenu);
        },
        updateSelectLst(lst){
            this.selectedMenuLst = [];
            // console.log(lst);
            //遍历查找对应的菜单选项id，
            //目前来说，直接获取quicktransmenu中的第二层的id即可，因为quick中有的一定在menulist中存在
            let len = lst.length;
            for( let idx = 0; idx < len ; idx++ ){
                let menu = lst[idx];
                let count = menu.menus?menu.menus.length:0;
                if( count == 0 ){ 
                    this.selectedMenuLst.push(menu.id);
                    continue; 
                }else{
                    while( count > 0 ){
                        let child = menu.menus[count-1];
                        this.selectedMenuLst.push(child.id) ;
                        count--;
                    }
                }
                
            }
            // console.log(this.selectedMenuLst);
        },
        quickMenuSaveBtnClickHandler(){
            //todo 发送多选的变量，给后台
            console.log("PsersonSettingPanel.quickMenuSaveBtnClickHandler（）",this.selectedMenuLst);
            this.actionSetAgentQuickTransMenuLst({menus:this.selectedMenuLst,callback:this.saveClickCallback});
        },
        //设置常用菜单action的回调函数
        saveClickCallback(data){
            // console.log("PersonSettingPanel----saveClickCallBack()",data);
            this.updateSelectLst(data);
        },
        treeCheckChangeHandler(data,checked,indeterminate){
            // console.log(data,checked,indeterminate);
            if(checked){
                // if(data.menus &&data.menus.length>0){
                //     //选中的是父节点，下面所有的子节点都应该添加到选中里
                //     data.menus.forEach(element => {
                //         this.addSelectItem(element);
                //     });
                // }else{
                    //选中状态 
                    this.addSelectItem(data);
                // }
            }else{
                let len = this.selectedMenuLst.length;
                let index = -1;
                for(let idx = 0; idx< len;idx++){
                    let it = this.selectedMenuLst[idx];
                    if(it == data.id){
                        index = idx;
                        break;
                    }
                }
                if(index>=0){
                    this.selectedMenuLst.splice(index,1);
                }
            }
            // console.log(this.selectedMenuLst);
        },
        addSelectItem(data){
            //选中状态 
            let res = this.selectedMenuLst.includes(data.id);
            // console.log("find includes----",res);
            let isLeaf =  (!data.menus || data.menus.length<=0);
            if(res == false && isLeaf){
                this.selectedMenuLst.push(data.id);
            }
        }
    },
    mounted(){
        this.$emit('childInit',{
            width:1200,//宽度
            height:800,//高度
            label:"个人设置",//title
            // position:{x:"40px",y:"40px"},//位置
            // mask:false,//蒙层
        });
        this.initMenuLst();
    }
}
</script>
<style scoped>

    .menu-setting{
        position: relative;
    }
    .menu-setting .submit-btn{
        position: fixed;
        bottom:100px;
    }

    .theme-setting{
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: flex-start;
    }
    .theme-setting .theme-class-item{
        margin: 20px 0;
        width:50%;
    }
    .theme-setting .theme-class-item .theme-color{
        margin: auto;
        width: 300px;
        height: 200px;
        border-radius: 15px;
        /* background: red; */
    }
    .theme-setting .theme-class-item .theme-name{
        
    }

</style>

