<template>
    <!-- 用户的基本信息详情，区别于左侧 -->
    <div class="customer-base-detail-info">
        <div class="customer-detail-inner" >
            <div class="left-part">
                <!-- vip专属服务客户 -->
                <div class="vip-service-customer-info">
                    <caption class="table-title">专属服务客户</caption>
                    <div class="info-inner bg-color">
                        <div class="vip-label-img"></div>
                        <div class="vip-info-wrapper">
                            <div class="info-item">
                                <span class="info-label">姓名：</span><span class="info-val">{{customer?customer.nameCh:''}}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">性别：</span><span class="info-val">{{sex}}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">客户评级：</span><span class="info-val">未知</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">专属客服：</span><span class="info-val">xxxxxx</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">所属机构：</span><span class="info-val">xxxxxx</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <table class="table-public  table-public-border text-left">
                    <caption class="table-title">客户类型信息</caption>
                    <tbody>
                        <tr>
                            <th class="label25">姓名</th><td class="label25">{{customer.nameCh}}</td>
                            <th class="label25">手机号</th><td class="label25">{{customer.type1}}</td>
                        </tr>
                        <tr>
                            <th>证件类型</th><td>身份证</td>
                            <th>证件号码</th>
                            <!-- <td>{{customer.CrtNo}}</td> -->
                            <td>220203456789001023</td>
                        </tr>
                        <tr>
                            <th>ECIFID</th><td>123456790</td>
                            <th>货记卡客户号</th><td></td>
                        </tr>
                    </tbody>
                </table>
                <!-- 卡片信息 -->
                <table class="table-public  table-public-border">
                    <caption class="table-title">卡片信息</caption>
                    <tbody>
                        <tr>
                            <th class="label25">卡号</th><td class="label25">402569906580999</td>
                            <th class="label25">交易密码剩余次数</th><td class="label25">3</td>
                        </tr>
                        <tr>
                            <th>外围业务签约信息</th><td>15118670924</td>
                            <th>密码后三位剩余次数</th><td>3</td>
                        </tr>
                        <tr>
                             <th>电子渠道签约信息</th><td>15118670924</td>
                            <th></th><td></td>
                        </tr>
                    </tbody>
                </table>
                <!-- 副卡信息 -->
                <table class="table-public table-public-border">
                    <caption class="table-title">副卡信息</caption>
                    <tr>

                    </tr>
                </table>
            </div>
            <div class="right-part">
                <!-- 营销类 -->
                <table class="table-public table-public-border">
                    <caption class="table-title">营销类</caption>
                    <tbody>
                        <tr><th class="label50">营销方向</th><td class="label50">未知</td></tr>
                        <tr><th>网贷意愿客户（储蓄）</th><td>否</td></tr>
                    </tbody>
                </table>
                <!-- 性格特征 -->
                <table class="table-public table-public-border">
                    <caption class="table-title">性格特征</caption>
                    <tbody>
                        <tr><th class="label50">性格特征</th><td class="label50">反复确认+唠叨 、同业</td></tr>
                    </tbody>
                </table>
                <!-- 风险逾期类 -->
                <table class="table-public table-public-border">
                    <caption class="table-title">风险逾期类</caption>
                    <tbody>
                        <tr><th class="label50">电话银行身份验证失败次数</th><td class="label50">1</td></tr>
                        <tr>
                            <th>身份核实结果</th><td></td>
                        </tr>
                    </tbody>
                </table>
                <table class="table-public table-public-border">
                    <caption class="table-title">交互行为类</caption>
                    <tbody>
                        <tr>
                            <th class="label50">用户使用偏好</th><td >手机</td>
                        </tr>
                    </tbody>
                </table>
                <table class="table-public table-public-border">
                    <caption class="table-title">产品关注偏好</caption>
                    <tbody>
                        <tr>
                             <th class="label50">用户使用偏好</th><td >手机</td>
                        </tr>
                    </tbody>
                </table>
                <table class="table-public table-public-border">
                    <caption class="table-title">关怀类</caption>
                    <tbody>
                        <tr>
                            <th class="label50">用户使用偏好</th><td >手机</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import {getSexByCrtNo} from '@/core/utils/GlobalMethods';
export default {
    name:'customerbaseinfo',
    props:{
        isCustomerQuerySearch:{
            type:Boolean,
            default:true,
        },
        contentObj:{
            type:Object,
            default:()=>{}
        }
    },
    data(){
        return{
            crtTypeLst:[],
            value: '',
            customer:{},
        }
    },
    computed:{
        ...mapGetters(['getCrtType']),
         //获取性别
        sex(){
            return getSexByCrtNo(this.customer?this.customer.crtNo:'');
        },
    },
    methods:{
        customerPersonasHandler(){
            console.log("开启用户画像");
        },
    },
    mounted(){
        this.crtTypeLst = this.getCrtType;
        this.customer = this.contentObj.customer?this.contentObj.customer:{};
    }
}
</script>
<style scoped>
.customer-base-detail-info{
    width:100%;
}
.customer-base-detail-info .customer-detail-inner{
    display: flex;
    flex-flow: row nowrap;
}
.customer-base-detail-info .customer-detail-inner .left-part{
    flex:1;
    padding:0 10px 0 0;
}
.customer-base-detail-info .customer-detail-inner .right-part{
    width:350px;
    padding:0 1px 0 10px;
}
.customer-base-detail-info .customer-detail-inner table .label50{
    width:50%;
}
.customer-base-detail-info .customer-detail-inner table .label25{
    width:25%;
}
.customer-base-detail-info .left-part .vip-service-customer-info .info-inner{
    padding:12px 10px;
    text-align:left;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-top: -5px;
}
.customer-base-detail-info .vip-service-customer-info .vip-label-img{
    width:185px;
    height: 140px;
    margin-right: 25px;
    background: red;
}
.customer-base-detail-info .vip-service-customer-info .vip-info-wrapper{
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
}
.customer-base-detail-info .left-part .vip-service-customer-info .info-inner .info-item{
    padding:6px 10px 6px 0px;
}
.customer-base-detail-info .vip-service-customer-info .info-item .info-label{
    width:80px;
    font-size:12px;
   
    display: inline-block;
}
.customer-base-detail-info .vip-service-customer-info .info-item .info-val{
    display: inline-block;
    font-size: 14px;
    
    background-color: white;
    border-radius: 5px;
    width: 120px;
    border:rgb(230,230,230) 1px solid;
    padding: 8px 0 8px 20px;
}



</style>

