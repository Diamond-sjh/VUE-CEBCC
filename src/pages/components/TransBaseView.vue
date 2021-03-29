<template>
    <!-- 交易的基本模块封装，
        包含小桔灯坐席提示信息，
        核身模块，
        按钮组（等待需求）等内容 -->
    <div class="trans-base-view" >
        <div class="content" v-if="!tipShow">
            <div class="top-bar menu-top-bar">
                <span class="menu-top-bar title">{{menuObj.menu.cname || menuObj.menu.label}}</span>
                <div class="menu-buttons">
                    <el-button type="primary" plain  v-for='it in buttons' :key="it.id" size="small"  @click="menuButtonClickHandler(it)" v-show="it.AUTO_DISPLAY_SIGN==1">{{it.PERM_NAME}}</el-button>
                </div>
            </div>
            <div class="query_style">
                <div class="query_style_backg background"></div>
            </div>
            <!-- <el-divider></el-divider> -->
            <TransAgentTips :url="menuObj.menu.url" :menuId="menuObj.menu.code" class="pb10"></TransAgentTips>
            <OptionResultTipBar ref="resLstBar" class="mb20"></OptionResultTipBar>
            <component :is="cmp" ref="transComponent" 
                :custToken="custToken"   
                @close="closeTrans" 
                @transOptionTip="openOptionTip" 
                @resultChange="resultChange" 
                @initButtons="initButtons" 
                @changeUrl="changeUrl" 
                :contentObj="contentObj"
                :menuInfo="menuObj.menu"></component>
        </div>
        <slot name="tip" v-if="tipShow">
            <div class="option-tip">
                <div class="icon">
                    <i  :class="[tip.icon,tip.success?'tip-success':'tip-error']"></i>
                </div>
                <p class="title">{{tip.title}}</p>
                <p class="tip-content">{{tip.text}}</p>
            </div>
        </slot>
    </div>
</template>
<script>
import TransAgentTips from '@/pages/components/TransAgentTips';
import OptionResultTipBar from '@/pages/components/OptionResultTipBar';
export default {
    components:{TransAgentTips,OptionResultTipBar},
    props:{
        customer:{type:Object,default:()=>{}},
        system:{type:String,default:"trans"},//系统模块 trans交易，administration :后台管理
        custToken:"",//用户token,可以用于获取用户
        menuObj:{type:Object,default:()=>{}},//新的菜单内容，以后按照这个来
    },
    data(){
        return{
            cmp:'',//当前引入的组件内容,
            tip:null,
            tipShow:false,
            buttons:[],//交易中的按钮配置，
            contentObj:null,//每次打开url或者跳转url时候给页面传递的参数内容
        } 
    },
    beforeDestroy(){
        this.contentObj = null;
    },
    watch:{
        //监听菜单变化，更新内容信息
        menuObj:{
            handler(nval,oval){
                console.log("-----------");
                if(!nval){return;}
                this.loadCmp();
                //更新获取按钮信息，
                this.setMenuButtons(nval.buttons);
            },
        }
    },
    methods:{
        loadCmp(){
            this.clearResTip();
            if(!this.menuObj.menu || !this.menuObj.menu.url){
                return;
            }
            this.cmp = ()=>import('@/pages/'+this.system+'/'+this.menuObj.menu.url);
        },
        loadCmpByUrl(url){
            this.clearResTip();
            if(!url){
                return;
            }
            let cmpUrls = url.split('|');
            if(!cmpUrls || !cmpUrls[0]){
                return;
            }
            
            this.contentObj = {};
            if(cmpUrls[1]){
                let params = cmpUrls[1].split(',');
                if(params.length>0){
                    for(let idx = 0;idx<params.length;idx++){
                        let key  = params[idx] ;
                        this.contentObj[key] = this.$refs.transComponent.$data[key];
                    }
                }
                console.log(this.contentObj);
            }
           
            this.cmp = ()=>import('@/pages/'+this.system+'/'+cmpUrls[0]);
        },
        beforeClose(index){
            console.log('transbaseview.beforeClose()')
            if(this.$refs.transComponent && this.$refs.transComponent.beforeClose){
                this.$refs.transComponent.beforeClose(index);
            }else{
                this.closeTrans(index);
            }
        },
        closeTrans(index){
            console.log('transbaseview.closeTrans()',index);
            this.$emit('close',index);
        },
        //点击操作后返回了提示，无法返回到页面继续操作
        /**
         * @param {boolean} 提示类型，true正确提示，false错误提示
         * @param {object} 参数内容
         * 
         */
        openOptionTip(type,params){
            if(type){
                this.optionSuccessTip(params?params:{});
            }else{
                this.optionErrorTip(params?params:{});
            }
            this.tipShow = true;
        },
        optionSuccessTip(params){
            this.tip = {
                title:params.title||'操作成功',
                text:params.text ||'',
                icon:params.icon||'el-icon-success',
                success:true,
            }
        },
        optionErrorTip(params){
            this.tip = {
                title:params.title ||'操作失败',
                text:params.text || '未知原因',
                icon:params.icon || 'el-icon-error',
                success:false,
            }
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
            this.$refs.resLstBar.reset();
        },
        //按钮组，通过交易规则的返回内容获取，交易规则通过后，即可获取到具体按钮列表
       
        setMenuButtons(buttonLst){
           this.buttons = buttonLst?buttonLst:[];
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
        },

        menuButtonClickHandler(item){
            let clickStr = item.ONCLICK;   
            if(!clickStr){
                return;
            }
            let items = clickStr.split('|');
            if(!items.length){
                return;
            }
            window.$permissionCode = item.CODE;
            if(this.$refs.transComponent[items[0]]){
                if(items.length >1){
                    let _this = this.$refs.transComponent[items[0]];
                    _this.call(this,item,items[1]);
                }else{
                    this.$refs.transComponent[items[0]](item); 
                }
                
                // this.$refs.transComponent[clickStr](item);
            }
        },
        changeUrl(url){
            console.log("跳转到指定页面-----"+url);
            if(url){
                this.loadCmpByUrl(url);
            }
        },
         /**
         * 子类传入按钮lst由父类初始化按钮内容，用于测试
         * @param {Array} 
         */
        initButtons(buttonlst){
            if(this.$constants.debug != true){
                return;
            }
            this.setMenuButtons(buttonlst);
        }
        
    },
    mounted(){
        this.loadCmp();//引入交易组件
        this.setMenuButtons(this.menuObj.buttons);
        console.log("TransBaseView   mounted()",this.menuObj);
    }
}
</script>

