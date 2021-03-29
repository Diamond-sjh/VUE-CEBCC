<template>
    <!-- 首页坐席的头部信息 登录时间 登陆时长  平均通话时长 当前接待客户量 个人满意度-->
    <div class="custom-carousel" ref="carousel" @mouseenter="stopCarousel" @mouseleave="startCarousel">
        <div class="carousel-item" :style="showCarouselItem == 1 ? carouselStyle1: carouselStyle2">
            <div class="user-base-info-container">
                <span class="item-info">登录时间:{{loginTime}}</span>
                <span class="item-info duration">登录时长: {{loginDuration}}</span>
                <span class="item-info">平均通话时长:{{phoneTime}}</span>
                <span class="item-info">当前接待客户量: {{customerNum}}</span>
                <span class="item-info">个人满意度: {{satisfied}}%</span>
                <i class="iconfont icon-gonggao" @click="onNoticeClick"></i>
            </div>
        </div>
        <div class="carousel-item" :style="showCarouselItem == 2 ? carouselStyle1: carouselStyle2">
            <ul class="notice-container" :style="{width: noticeItemWidth+'px'}" ref="notice" @mouseenter="stopNotice" @mouseleave="startNotice">
                <li class="notice-item"
                    v-for="(item, index) in noticeData" :key="index"
                    @click="openNoticeInfoPanel"
                    :style="{left: ((index - showNoticeIndex) * noticeItemWidth - left) + 'px'}">
                    {{item}}
                </li>
            </ul>
        </div>
    </div>
    
</template>
<script>
import { mapGetters } from 'vuex';
import {getDateTime,mathTime} from '@/core/utils/GlobalMethods'
export default {
    data(){
        return{
            loginTimeStamp:null,
            loginTime:'',
            phoneTime:'',
            customerNum:'',
            satisfied:'',
            loginDuration:"",
            top: 0,
            height: 0,
            timer: [],
            showCarouselItem: 1, // 当前显示的item
            noticeData: ['第一条公告', '第二条公告', '第三条公告', '第一条公告'],
            showNoticeIndex: 0, //当前显示公告索引
            noticeItemWidth: 500,
            left: 0
        }
    },
    computed:{
        ...mapGetters(['getUserTopInfo']),
        carouselStyle1 () {
            return {
                top: (this.top-this.height) + 'px'
            }
        },
        carouselStyle2 () {
            return {
                top: this.top + 'px'
            }
        }
    },
    watch:{
        getUserTopInfo:{
            handler(nval,oval){
                this.phoneTime = nval.phoneTime;
                this.customerNum = nval.num;
                this.satisfied = nval.satisfied;
            },
            deep:true,
            immediate:true,
        }
    },
    methods:{
        onNoticeClick(){
            //公告列表打開
            this.csrAlert.warning("打开公告列表");
        },
        tick(time){
            // console.log("头部计时器计时",time);
            this.loginDuration = mathTime(this.loginTimeStamp,true);
        },
        startCarousel () {
            this.timer[0] = setTimeout(() => {
                clearInterval(this.timer[1])
                this.timer[1] = setInterval(() => {
                    if (this.top <= 0) {
                        this.top = this.height
                        this.showCarouselItem = this.showCarouselItem == 1? 2: 1
                        clearInterval(this.timer[1])
                        return
                    }
                    this.top--
                }, 20)
                this.startCarousel()
            }, 10000)
        },
        stopCarousel () {
            clearTimeout(this.timer[0])
        },
        startNotice () {
            this.stopNotice()
            this.timer[2] = setTimeout(() => {
                clearInterval(this.timer[3])
                this.timer[3] = setInterval(() => {
                    if (this.left >= this.noticeItemWidth) {
                        this.left = 0
                        this.showNoticeIndex++
                        if (this.showNoticeIndex == (this.noticeData.length - 1)) {
                            this.showNoticeIndex = 0
                        }
                        clearInterval(this.timer[3])
                        return
                    }
                    this.left+=2
                }, 10)
                this.startNotice()
            }, this.noticeItemWidth*5)
        },
        stopNotice () {
            clearTimeout(this.timer[2])
        },
        openNoticeInfoPanel () {
            this.$popUpManager.openUI(constants.uiPanel.NOTICE_INFO_PANEL, {})
        }
    },
    mounted(){
        this.loginTimeStamp = new Date();
        this.loginTime = getDateTime(this.loginTimeStamp,true,true);
        this.top = this.height = this.$refs.carousel.offsetHeight;
        this.startCarousel()
        this.startNotice()
    },
}
</script>
<style scoped>
  .custom-carousel{
      position: relative;
      overflow: hidden;
      flex: 1;
  }
  .carousel-item{
      position: absolute;
      font-size: 12px;
      left: 0px;
      right: 0px;
      overflow: hidden;
      height: 100%;
  }
 .user-base-info-container{
    display: flex;
    flex: 1;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;
    font-size: 12px;
   
}
.user-base-info-container .item-info{
    padding: 0px 10px;
}
.notice-container{
    position: relative;
    height: 100%;
    width: 500px;
    overflow: hidden;
}
.notice-item{
    position: absolute;
    white-space: nowrap;
    width: 100%;
    height: 100%;
    list-style: none;
}
</style>

