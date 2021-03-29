<template>
<!-- 用戶画像 -->
    <div class="personas pb20">
        <el-row :gutter="20">
            <el-col class="pt20">
                <el-form :model="datas"  label-position="left" label-width="100px">
                    <el-row>
                        <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6" class="csr-form-item-sm">
                            <el-form-item label="年龄:" >
                                <div>{{datas.age}} </div>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6" class="csr-form-item-sm">
                            <el-form-item label="婚姻状况:" >
                                <div>{{datas.marital}} </div>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6" class="csr-form-item-sm">
                            <el-form-item label="学历:" >
                                <div>{{datas.education}} </div>
                            </el-form-item>    
                        </el-col>
                    </el-row>
                </el-form>   
            </el-col>
            <el-col :span="12">
                <table class="table-public table-public-border ">
                    <caption>资产信息</caption>
                    <tbody>
                        <tr>
                            <th class="widthper25">储蓄</th>
                            <th class="widthper25"></th>
                            <th class="widthper25">资产类别</th>
                            <th class="widthper25">偏好</th>
                        </tr>
                        <tr>
                            <td>九资时点余额</td><td></td><td>存款</td><td></td>
                        </tr>
                        <tr>
                            <td>九资日均余额</td><td></td><td>理财</td><td></td>
                        </tr>
                        <tr>
                            <td>--</td><td>--</td><td>基金</td><td></td>
                        </tr>
                        <tr>
                            <td>现有次产</td><td></td><td>国债</td><td></td>
                        </tr>
                        <tr>
                            <td>--</td><td>--</td><td>第三方托管</td><td></td>
                        </tr>
                        <tr>
                            <td>--</td><td>--</td><td>券商</td><td></td>
                        </tr>
                        <tr>
                            <th colspan="2">信用卡</th><td>保险</td><td></td>
                        </tr>
                        <tr>
                            <td>近一年分期</td><td></td><td>代理信托</td><td></td>
                        </tr>
                        <tr>
                            <td>--</td><td>--</td><td>黄金</td><td></td>
                        </tr>
                    </tbody>
                </table>
            </el-col>
            <el-col :span="12">
                <table class="table-public table-public-border pb20">
                    <caption>客户价值</caption>
                    <tbody>
                        <tr>
                            <th>有理财即将到期</th>
                            <td>否</td>
                            <th>消费偏好</th>
                            <td>否</td>
                        </tr>
                        <tr>
                            <th>网贷意愿客户(儲蓄)</th>
                            <td>否</td>
                            <th>产品推荐</th>
                            <td>否</td>
                        </tr>
                        <tr>
                            <th>客户评级</th>
                            <td></td>
                            <th>管户经理</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th>风险评级</th>
                            <td>否</td>
                            <th>首次风评渠道</th>
                            <td>否</td>
                        </tr>
                        <tr>
                            <th>不可营销客户</th>
                            <td>否</td>
                            <th>工资代发客户</th>
                            <td>否</td>
                        </tr>
                        <tr>
                            <th>信用卡低价值客户</th>
                            <td>否</td>
                            <th>他行VIP</th>
                            <td>否</td>
                        </tr>

                    </tbody>
                </table>
                <table class="table-public table-public-border">
                    <caption>用户偏好</caption>
                    <tbody>
                        <tr>
                            <th>电子渠道</th>
                            <th>状态</th>
                            <th>近一年使用次数</th>
                        </tr>
                        <tr><td></td><td></td><td></td></tr>
                    </tbody>
                </table>
                
                <table class="table-public table-public-border pb20">
                    <caption>服务质量</caption>
                    <tbody>
                        <tr>
                            <th class="widthper25">性格</th>
                            <td class="widthper25">温文尔雅</td>
                            <th class="widthper25">视频白名单</th>
                            <td class="widthper25">否</td>
                        </tr>
                    </tbody>
                </table>
            </el-col>
        </el-row> 
    </div>
</template>
<script>
export default {
    name:"personas",
    data(){
        return{
            datas:{
                age:25,
                marital:'未婚',
                education:'本科',
            },
        }
    }
}
</script>