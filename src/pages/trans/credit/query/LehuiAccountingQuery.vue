<template>
    <div class="lehui-accounting-query">
        <div class="lehui-account">
            账号：1234556611223
            <el-button @click="totalBtnCLickHandler">合计</el-button>
        </div>
        <table class="table-public">
            <thead>
                <tr>
                    <th>总欠款（元）</th>
                    <th>本金合计（元）</th>
                    <th>利息合计（元）</th>
                    <th>费用合计（元）</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>5360.00</td>
                    <td>5360.00</td>
                    <td>5360.00</td>
                    <td>5360.00</td>
                </tr>
            </tbody>
        </table>
        <section>
            <div class="block-title">
                未逾期部分
            </div>
            <table class="table-public">
                <thead>
                    <tr style="border-bottom: none;">
                        <th width='10%'>
                            <el-checkbox :indeterminate="indeterminate" v-model="allCheck" @change="changeAllCheck"></el-checkbox>
                        </th>
                        <th width="15%">交易日期</th>
                        <th width="10%">总欠款（元）</th>
                        <th width="10%">本金合计（元）</th>
                        <th width="10%">利息合计（元）</th>
                        <th width="10%">费用合计（元）</th>
                        <th width="15%">最后还款日</th>
                        <th width="10%">当前状态</th>
                        <th width="10%">交易明细</th>
                    </tr>
                </thead>
                </table>
                <div class="deal-detail-box">
                    <table class="table-public">
                        <tbody v-for="(item, index) in notOverData" :key="index" >
                    <!-- <el-checkbox-group v-model="dealCheckList"> -->
                            <tr @click="chooseData(item)">
                            <td width='10%'><el-checkbox v-model="dealChecklist" :label="item.id" @change="chooseDeal"></el-checkbox></td>
                            <td width="15%">{{item.id}}</td>
                            <td width="10%">{{item.id}}</td>
                            <td width="10%">{{item.id}}</td>
                            <td width="10%">{{item.id}}</td>
                            <td width="10%">{{item.id}}</td>
                            <td width="15%">{{item.id}}</td>
                            <td width="10%">{{item.id}}</td>
                            <td width="10%" @click.stop="openDealDetail(item)" class="deal-detail">
                                <i class="el-icon-minus" v-if="openDetailId == item.id"></i>
                                <i class="el-icon-plus" v-else></i>
                            </td>
                            </tr>
                            <tr v-show="openDetailId == item.id">
                                <td colspan="9">
                                    <div class="deal-detail-content">
                                        <div class="deal-detail-content-item"><div>收支分类：</div>消费</div>
                                        <div class="deal-detail-content-item"><div>本金合计(元)：</div>111.22</div>
                                        <div class="deal-detail-content-item"><div>利息合计(元)：</div>111.22</div>
                                        <div class="deal-detail-content-item"><div>费用合计(元)：</div>111.22</div>
                                    </div>                          
                                </td>
                            </tr>
                    <!-- </el-checkbox-group> -->
                       </tbody>
                        </table>
                </div>
               
                        <table class="table-public">
                        <thead>
                            <tr style="border-top: none;">
                                <th width='10%'></th>
                                <th width="15%">累计</th>
                                <th width="10%">1100.00</th>
                                <th width="10%">1000.00</th>
                                <th width="10%">1000.00</th>
                                <th width="10%">1000.00</th>
                                <th width="15%">--</th>
                                <th width="10%">--</th>
                                <th width="10%">--</th>
                            </tr>
                        </thead>
                </table>
        </section>
        <section>
            <div class="block-title">
                已逾期部分（交易在60天以上仍未还清）
            </div>
            <table class="table-public">
                <thead>
                    <tr>
                        <th>总欠款（元）</th>
                        <th>本金合计（元）</th>
                        <th>利息合计（元）</th>
                        <th>费用合计（元）</th>
                        <th>当前状态</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>5230.00</td>
                        <td>5230.00</td>
                        <td>5230.00</td>
                        <td>5230.00</td>
                        <td>已到期</td>
                    </tr>
                </tbody>
            </table>
        </section>
        <el-dialog title="合计" :visible.sync="dialogVisible" top="300px" width="600px">
            <ul class="total-dialog">
                <li>共{{totalForm.total}}笔交易</li>
                <li>本金合计110.00（元）</li>
                <li>利息合计110.00（元）</li>
                <li>费用合计110.00（元）</li>
            </ul>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data () {
        return {
            allCheck: false,
            dealCheckList: [],
            notOverData: [{id: 1}, {id: 2}, {id: 3}], //未逾期部分
            indeterminate: true,
            dealChecklist: [],
            totalDealList: [], // 要合计的交易列表
            openDetailId: '',
            dialogVisible: false,
            totalForm: {
                total: 0,
                principal: 0, // 本金
                interest: 0, // 利息
                cost: 0 // 费用
            }
        }
    },
    methods: {
        changeAllCheck (val) {
            this.dealChecklist = []
            this.totalDealList = []
            if (val) {
                this.notOverData.forEach((item) => {
                    this.dealChecklist.push(item.id)
                    this.totalDealList.push(item)
                })
            }        
            this.indeterminate = false
        },
        chooseData (item) {
        },
        chooseDeal () {
            this.allCheck = this.dealChecklist.length === this.notOverData.length
            this.indeterminate = this.dealChecklist.length > 0 && this.dealChecklist.length < this.notOverData.length
            this.totalDealList = []
            this.dealChecklist.forEach((id) => {
                this.notOverData.forEach((item) => {
                    if (id == item.id) {
                        this.totalDealList.push(item)
                    }
                })
            })
        },
        openDealDetail (item) {
            if (this.openDetailId == item.id) {
                this.openDetailId = ''
                return
            }
            this.openDetailId = item.id
        },
        totalBtnCLickHandler () {
            if (this.totalDealList.length == 0) {
                this.$message.warning('请选择明细后操作合计')
                return
            }
            this.totalForm.total = 0
            this.totalForm.principal = 0
            this.totalForm.interest = 0
            this.totalDealList.forEach((item) => {
                this.totalForm.total++
            })
            this.dialogVisible = true
        }
    }
}
</script>

<style scoped>
.lehui-accounting-query td, .lehui-accounting-query th{
    text-align: center;
    border-bottom: none !important;
}
.lehui-accounting-query tr{
    border: 1px solid #bbd5fb;
}
.lehui-account{
    text-align: center;
    padding: 10px;
    font-weight: 800;
}
.block-title{
    font-weight: 800;
    padding: 10px 0;
    text-align: left;
}
.deal-detail-box{
    max-height: 300px;
    overflow-y: auto;
}
.deal-detail{
    cursor: pointer;
}
.deal-detail-content-item{
    width: 200px;
    margin: auto;
    text-align: left;
    padding: 5px 0;
}
.deal-detail-content-item div{
    display: inline-block;
    width: 100px;
    text-align: right;
}
.total-dialog{
    font-size: 16px;
    padding-left: 200px;
}
.total-dialog li{
    padding: 5px 0;
}
</style>
<style>
.lehui-accounting-query .el-checkbox__label{
    display: none;
}
.lehui-accounting-query .el-scrollbar__wrap{
    overflow-x: hidden;
}
</style>

