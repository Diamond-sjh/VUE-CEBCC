<template>
    <div class="pop-up-item" :id='contentObj.panelId' 
        :class="[mask==true?'mask':'']" 
        :style="'margin-left:'+(position&&position.x?position.x:'0px')+';margin-top:'+(position&&position.y?position.y:'0')+';'">
        <div class="pop-up-item-mask" v-if="mask==true"></div>
        <div class="pop-up-item-container" :style="'width:'+width+'px;height:'+height+'px;'">
            <div class="pop-up-item-top-bar">
                <!--  @mousemove="dragMove"  @mousedown="dragStart" @mouseup="dragEnd" -->
                <div class="pop-up-item-title">{{label}}</div>
                <div class="pop-up-item-buttons">
                    <!-- <span class="pop-up-item-btn" @click.stop="minimizePanel"><i class="el-icon-minus"></i></span> -->
                    <span class="pop-up-item-btn" @click.stop="closePanel"><i class="el-icon-close"></i></span>
                </div>
            </div>
            <div class="pop-up-item-inner">
                <div class="pop-up-item-wrapper">
                    <component :is="popupCmp" :contentObj="contentObj" @childInit="childInit" ref="childInner" @close="closePanel"></component>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        title:{
            type:String,
            default:"BootstrapVue"
        },
        contentObj:{
            type:Object,
            default:()=>{}
        }
    },
    data(){
        return{
            popupCmp:'',
            width:500,
            height:300,
            positionX:'50%',
            positionY:0,
            isDraging:false,
            label:"",
            mask:true,//默认显示遮罩层
            position:{},
        }
    },
    methods:{
        closePanel(){
            console.log("PopUpItem.closePanel");
            this.$popUpManager.closeUI(this.contentObj.panelId);
        },
        dragStart(e){
            this.isDraging=true;
        },
        dragMove(e){
            if(!this.isDraging){
                return;
            }
            let odiv = e.target.parentNode.parentNode;        //获取目标元素
            //算出鼠标相对元素的位置
            let disX = e.clientX - odiv.offsetLeft;
            let disY = e.clientY - odiv.offsetTop;
            let left = e.clientX - disX;    
            let top = e.clientY - disY;
            
            //绑定元素位置到positionX和positionY上面
            this.positionX = e.clientX+'px';
            // this.positionY = e.clientX+'px';
            console.log(this.positionX,e.clientX,odiv.offsetLeft);
            //移动当前元素
            odiv.style.left = left + 'px';
        },
        dragEnd(e){
            this.isDraging=false;
        },
        childInit(obj){
            if(!obj){
                return;
            }
            this.width = obj.width?obj.width:this.width;
            this.height = obj.height?obj.height:this.height;
            this.label = obj.label?obj.label:this.contentObj.panelId;
            this.mask = obj.mask==null? true:obj.mask;
            this.position=obj.position;
        },
        minimizePanel(){
            this.$popUpManager.minimizeUI(this.contentObj.panelId);
        }
    },
    mounted(){
        // this. = resovle => require.ensure([],()=>resovle(require('@/pages/popups/'+this.contentObj.panelId)));
        this.popupCmp = ()=>import('@/pages/popups/'+this.contentObj.panelId);
        this.width = this.contentObj.width?this.contentObj.width:this.width;
        this.height = this.contentObj.height?this.contentObj.height:this.height;
        this.label =this.contentObj.panelId;
    },
}
</script>
<style>
    .pop-up-item {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        align-content: center;
    }
    .pop-up-item.mask{
        width: 100%;
        height: 100%;
    }
    .pop-up-item .pop-up-item-mask{
       
        width:100%;
        height: 100%;
        position: absolute;
        top:0;
        left: 0;
        opacity: 0.5;
        background-color: black;
    }
    .pop-up-item .pop-up-item-container{
        position: relative;
        /* margin: auto; */
        min-height:300px;
        min-width: 500px;
        background-color: white;
        max-width: 1000px;
        max-height: 800px;
        overflow: hidden;
        border-radius: 5px;
        display: flex;
        flex-flow: column nowrap;
    }
    .pop-up-item .pop-up-item-container .pop-up-item-top-bar{
        position:relative;
        height:35px;
        /* background-color: #303131; */
        width: 100%;
        font-size: 16px;
        text-align: left;
        color: white;
    }
    .pop-up-item .pop-up-item-container .pop-up-item-top-bar .pop-up-item-title{
        padding-left: 15px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        height:100%;
    }
    .pop-up-item .pop-up-item-container .pop-up-item-top-bar .pop-up-item-buttons{
        position: absolute;
        top: 0px;
        right: 0px;
        padding:8px 8px;
        font-size: 14px;
        height: 100%;
        display:flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
    }
    .pop-up-item .pop-up-item-container .pop-up-item-top-bar .pop-up-item-buttons .pop-up-item-btn{
        cursor: pointer;
        margin: 0px 2px;
        width: 19px;
        font-size: 19px;
    }
    /* .pop-up-item .pop-up-item-container .pop-up-item-top-bar .pop-up-item-buttons .pop-up-item-btn:hover{
        background-color: darkgray;
    } */
    .pop-up-item .pop-up-item-container .pop-up-item-inner{
        padding: 20px;
        overflow-y: auto;
        flex: 1;
    }
</style>
