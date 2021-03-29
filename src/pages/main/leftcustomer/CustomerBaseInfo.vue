<template>
    <!-- 用户基本信息数据 头像、姓名、地区、出生年月、来电号码、验证等级、失败次数、客户类型、来电类型。-->
    <div class="customer-base-info">
        <div class="customer-top-wrapper">
            <img class="customer-header-avatar" :src="'/static/img/'+imgUrl">
            <div class="customer-info-inner">
                <div class="flex-container center name-and-level">
                    <span class="customer-name fz14">{{customer.nameCh}}</span>
                    <span class="customer-level-label">{{checkCustomerType()}}</span>
                </div>
                <div class="age-province fz12 txtcolor-b0b0b0"><span>{{sex}} | 北京 |</span><span :class="isBirthDay?'redcolor':''"> {{birth}}</span></div>
                <div class="flex-container fz11">
                    <div class="w100">来电号码: <span :class="isReservedNum?'redcolor':''">1234554609</span></div>
                    <div >来电类型: 手机</div>
                </div>
                <div class="flex-container fz11 pt5">
                    <span class="w100">验证等级: {{checkIdentifyLevel()}}</span><span>失败次数: 1</span>
                </div>
            </div>
        </div>
        <div class="busy-label-container flex-container pt10">
            <div class="busy-label txtcolor-666666 fz12 pl10" >可能办理的业务：</div> 
            <div class="flex-container-wrap">
                <span class="busy-label-item">销户</span>
                <span class="busy-label-item">销户</span>
                <span class="busy-label-item">销户</span>
                <span class="busy-label-item">销户</span>
                <span class="busy-label-item">销户</span>
            </div>
        </div>
    </div>
</template>
<script>
import {getSexByCrtNo,getBirthByCrtNo,getDateTime} from '@/core/utils/GlobalMethods';
export default {
    data(){
        return{
            customer:{nameCh:'斯单蔓簇斯单蔓簇斯单蔓簇斯单蔓簇',crtNo:'130105198608292124'},
            optionBussList:[],//可能办理的业务
        }
    },
    computed:{
        imgUrl(){
            let imgStr = 0;
            let sex = this.sex;
            let age = new Date().getFullYear() - getBirthByCrtNo(this.customer.crtNo,true,false,false);
            if(age <50){
                //青年
                //todo ：给了图片之后根据图片url 加载对应内容，目前是问题提示
                if(sex == '女'){
                    imgStr =2;
                }else if(sex=='男'){
                    imgStr =1;
                }
                
            }else{
                //中年
                if(sex == '女'){
                    imgStr = 4;
                }else if(sex=='男'){
                    imgStr = 3;
                }
            }
            imgStr = 'userHead0'+imgStr+'.jpg';
            return imgStr;
           
        },
        //获取性别
        sex(){
            return getSexByCrtNo(this.customer?this.customer.crtNo:'');
        },
        //获取生日
        birth(){
            return getBirthByCrtNo(this.customer?this.customer.crtNo:'');
        },
        //是否生日当天
        isBirthDay(){
            let birthday = getBirthByCrtNo(this.customer?this.customer.crtNo:'',false,true);
            let dd = new Date();
            let strM = dd.getMonth()+1;
            strM = strM>10 ?strM: '0'+strM;
            let strD = dd.getDate() 
            strD = strD>10?strD:'0'+strD;
            strD = strM +'-'+strD;
            // console.log(birthday,strD)
            return birthday == strD;
        },
        //判断来电号码
        isReservedNum(){
            /**
             *  若选中卡片为贷记卡及存贷合一卡时，判断来电号码是否为预留手机或预留家庭电话，并用红字显示。
                来电号码与ECIF贷记卡电话匹配。
                视频进线显示客户登陆前端渠道的手机号码。
             */
            return true;
        },
    },
    methods:{
        setView(customer){
            if(!customer)return;
            this.customer = customer;
        },
        resetView(){
            this.customer ={};
            // console.log('CustomerBaseInfo.resetView()');

            //可能办理的业务清理
            this.optionBussList = [];
        },
        //用户类型判定<!-- 客户类型：要客、私行、VIP、普通客户 -->
        checkCustomerType(){
            return "普通";
        },
        //验证核身等级
        checkIdentifyLevel(){
            /*
                若为IVR进线自动带入验证等级。
                若未进行身份验证，展示:未验证。
            */
           return "未验证";
        }
    },
    mounted(){
    }
}
</script>
<style>
.customer-base-info{
    /* padding-top: 15px; */
    padding-bottom: 10px;
    color:white;
}
.customer-base-info .customer-top-wrapper{
    padding-top: 10px;
    height:107px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    
}

.customer-base-info .flex-container{
   
    display: flex;
    flex-flow: row nowrap;
}
.customer-base-info .flex-container.center{
   
    align-items: center;
}
.customer-base-info .flex-container-wrap{
    display: flex;
    flex-flow: row wrap;
    align-items: center;

}
.customer-base-info .customer-info-inner .name-and-level{
    line-height: 14px;
}
.customer-base-info .customer-info-inner .customer-name{
    max-width: 90px;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 12px;
}
.customer-base-info .customer-info-inner .age-province{
    padding: 8px 0;
    line-height: 12px;

}
.customer-base-info .customer-info-inner .customer-level-label{
    background-color:rgb(255,180,61);
    font-size: 11px;
    line-height: 11px;
    margin-left: 10px;
    color: white;
    min-width: 30px;
    border-radius: 10px;
    padding: 2px 4px;
    text-align: center;

}
.customer-base-info .redcolor{
    color: red;
}
.customer-base-info img{
    width: 52px;
    height: 52px;
    border-radius: 26px;
    /* border:1px solid white; */
    margin: 10px 8px;
}
.customer-base-info .busy-label{
    width:155px;
}
.customer-base-info .busy-label-item{
    color: rgb(82,173,76);
    font-size: 12px;
    line-height: 12px;
    padding:2px 4px;
    border-radius: 10px;
    border: 1px solid rgb(82,173,76);
    margin-right: 10px;
    margin-bottom: 5px;
}
.customer-base-info .w100{
    width:125px;
}
</style>
