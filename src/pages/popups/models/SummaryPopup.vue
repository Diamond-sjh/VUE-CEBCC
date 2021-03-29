<template>
    <div class="phone-call-summary">
     <el-scrollbar style="height: 540px;">
        <div class="top-info">
             <div class="customer-info">
                <div> <span>来电客户：</span> 理解</div>
                <div>
                    <span>接待时间：</span>13分19秒
                </div>
                <div>
                     <span>保持时间：</span>3分00秒
                </div>
            </div>
            <div class="bussiness-info">
                <div class="summary-nav">
                    <span class="title"> <i class="el-icon-s-order"></i> 已办业务</span>
                </div>
                <el-scrollbar style="height:90px;">
                    <div class="tag-lst-container pt10">
                        <el-tag v-for="(it,index) in bussinessLst" 
                            class="bussiness-tag-item" 
                            :key="index" 
                            effect="plain" 
                            type="">
                            {{it.name}}
                        </el-tag>
                        <div v-show="bussinessLst.length == 0">
                            暂无已办业务
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <!-- <el-form label-width="100px" class="pt10 main-form">
            <el-form-item label="备注：">
               
            </el-form-item>
            <el-form-item label="特殊来电：">
                <el-checkbox-group v-model="callCheckList" @change="checkCallCause">
                    <el-checkbox :label="item.id" v-for="(item,index) in callList" :key="index">{{item.label}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
             <el-form-item label="细分类：" v-show="detailCauseList.length > 0">
                <el-checkbox-group v-model="detailCheckList" @change="checkDetailCause">
                    <el-checkbox :label="item.id" v-for="(item,index) in detailCauseList" :key="index">{{item.label}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form> -->
        <div class="main-content">
            <section class="content-item">
                <div class="title">备注：</div>
                <div class="content-item-main">
                    <el-input type="textarea" maxlength="500" :disabled="!changeRemark" class="remark-input mb10" v-model="remark"></el-input>
                    <el-button class="remark-button" @click="changeRemark = true" type="" size="small">修改</el-button>
                </div>
            </section>
            <section class="content-item">
                <div class="title">特殊来电：</div>
                <div class="content-item-main">
                    <el-checkbox-group v-model="callCheckList" @change="checkCallCause">
                     <el-checkbox class="mb10" :label="item.id" v-for="(item,index) in callList" :key="index">{{item.cname}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </section>
            <section class="content-item" v-for="(item, index) in callList" :key="index" v-show="item.active && item.children.length > 0">
                <div class="title">{{'细分类_' + item.cname + ':'}}</div>
                <div class="content-item-main">
                    <el-checkbox-group v-model="item.detailCauseCheck" @change="changeDetailCause">
                     <el-checkbox class="mb10" :label="item.id" v-for="(item,index) in item.children" :key="index">{{item.cname}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </section>
        </div>
        <div class="main-footer" v-show="endOfCall">
            <div class="main-footer-item">
               <div class="break-link-cause">断线原因：<span style="color: rgb(222,31,31)">系统挂断</span></div>
                    <!-- <el-checkbox v-model="outbound" label="1"></el-checkbox>   -->
                    <div class="break-link-outbound">
                     断线外呼：
                    <el-select
                    size="small"
                    v-model="outboundType">
                        <el-option
                        v-for="(item,index) in outboundTypeList" 
                        :key="index"
                        :label="item.label"
                        :value="item.id"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="main-footer-item pt10">
                <div class="" style="width:275px">来电地区：北京</div>
                <div>
                    归属地：
                     <el-radio-group v-model="homeLocation" @change="changeLatterState">
                        <el-radio  label="1">本地</el-radio>
                        <el-radio label="2">未知</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="main-footer-item pt10">
                <div style="width: 240px">
                    后续状态：
                    <el-radio-group v-model="state" @change="changeLatterState">
                        <el-radio  label="1">示闲</el-radio>
                        <el-radio label="2">示忙</el-radio>
                    </el-radio-group>
                </div>
                <div class="busy-cause">
                        <span>示忙原因：</span>
                        <el-select
                        size="small"
                        :disabled="state == 1"
                        v-model="busyCauseId">
                            <el-option
                            v-for="(item,index) in busyCauseList" 
                            :key="index"
                            :label="item.label"
                            :value="item.id"></el-option>
                        </el-select>
                </div>
            </div>
        </div>
        </el-scrollbar>
        <div class="footer-btn">
            <el-button size="small" @click="closeBtnClickHandler" v-if="!endOfCall">取消</el-button>
            <el-button size="small" @click="saveSummary" v-if="!endOfCall" type="primary">保存</el-button>
            <el-button size="small" v-if="endOfCall" @click="outCall" class="outbound-btn" type="">断线外呼</el-button>
            <el-button size="small" v-if="endOfCall" @click="onSubmit" class="phone-submit-btn" type="primary">提交</el-button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            changeRemark: false,
            bussinessLst:[],
            callList: [],
            callCheckList: [],
            remark:'',
            outbound: '',
            outboundType: '',
            outboundTypeList: [
                {label: '高风险外呼1',id: 1},
                {label: '高风险外呼2',id: 2},
                {label: '高风险外呼3',id: 3}
            ],
            state: '1',
            busyCauseList: [
                {label: '休息',id: 1},
                {label: '领导谈话',id: 2},
                {label: '下班',id: 3}
            ],
            busyCauseId: '',
            formData:{
                breakReason:'',//断线外呼原因
                state:'',//忙碌状态
                busyReason:'',//忙碌原因
            },
            homeLocation: '1'
        }
    },
    props: {
        contentObj: {
            type: Object,
            default: {}
        }
    },
    computed: {
      endOfCall () {
          return this.contentObj.endOfCall
      }  
    },
    methods:{
        checkCallCause (value) {
            this.callList.forEach((item, index) => {
                if (value.indexOf(item.id) > -1) {
                    item.active = true
                } else {
                    item.active = false
                    item.detailCauseCheck = []
                }
            })
            this.callList = Object.assign([], this.callList)
        },
        changeDetailCause () {
            this.callList = Object.assign([], this.callList)
        },
        saveSummary () {
            let DetailSortId = ''
            this.callList.forEach((item) => {
               DetailSortId += item.detailCauseCheck.join(',')
            })
            console.log(DetailSortId)
            // this.closeBtnClickHandler()
        },
        checkDetailCause (value) {
            if (value.length >= 1) {
                this.detailCheckList = value.splice(value.length-1, 1)
            }
        },
        closeBtnClickHandler(){
            this.$emit('close');
        },
        onSubmit(){
            this.$emit('close');
            console.log("PhoneCallSummaryPanel----saveBtnClick------");
        },
        outCall () {},
        changeLatterState (value) {
            if (value == 1) {
                this.busyCauseId = ''
            }
        },
        handleEvent (event) {
            console.log(event)
            if (event.keyCode == 83 && event.ctrlKey) {
                this.saveSummary()
                event.preventDefault();
                event.returnValue = false
                return false
            }
            if ((event.keyCode == 13 || event.keyCode == 32) && this.endOfCall) {
                this.onSubmit()
                event.preventDefault();
                event.returnValue = false
                return false
            }
        }
    },
    mounted(){
        document.addEventListener('keydown', this.handleEvent)
        console.log(this.contentObj)
    },
    created () {
        this.$MainAjax.doPost(urlConfig.trans.callInSmallResultSave, {}).then((req) => {
            if (!req.data.smallResultTree) {
                return
            }
            this.callList = JSON.parse(req.data.smallResultTree).children
            this.callCheckList = req.data.SpecialCallInId?req.data.SpecialCallInId.split(','):[] // 获取选中的特殊来电id
            let DetailSortIdList = req.data.DetailSortId?req.data.DetailSortId.split(','):[]  // 获取选中的细分类id
            this.callList.forEach((item) => {
              if (this.callCheckList.indexOf(item.id) > -1) {
                  item.active = true
              }
              item.detailCauseCheck = []
              DetailSortIdList.forEach((detailId) => {
                  item.children.forEach((detailSort) => {
                      if (detailId == detailSort.id) {
                          item.detailCauseCheck.push(detailId)
                      }
                  })
              })
            })
            this.callList = Object.assign([], this.callList)
        })
    },
    beforeDestroy () {
        document.removeEventListener('keydown', this.handleEvent)
    }
}
</script>
<style scoped>
.phone-call-summary{
    display:flex;
    flex-flow:column nowrap;
}

.phone-call-summary .top-info{
    display: flex;
    flex-flow: row nowrap;
}
.phone-call-summary .top-info .customer-info{
    display:flex;
    flex-flow: column nowrap;
    text-align: left;
    width: 240px;
    background-color: rgb(242, 245, 255);
    padding: 5px 10px;
    height: 110px;
    font-size: 14px;
    justify-content: space-around;
    color:rgb(35, 35, 35)
}
.customer-info span{
    color: rgb(102, 102, 102)
}
.phone-call-summary .top-info .bussiness-info{
    padding: 0px 15px;
}
.phone-call-summary .top-info .bussiness-info .tag-lst-container{
    display:flex;
    flex-flow: row wrap;
}
.phone-call-summary .top-info .bussiness-info .bussiness-tag-item{
    margin-right: 10px;
    margin-bottom:5px;
    color: rgb(102, 102, 102);
}

.content-item{
    text-align: left;
}
.content-item .content-item-main{
    padding: 0px 10px;
}
.main-content .title{
    padding: 10px 0px;
    color: #000000;
    font-weight: 600;
}

.phone-call-summary .main-form{
    text-align: left;
}
.main-footer{
    background-color: rgb(242, 245, 255);
    padding: 15px 20px;
}
.main-footer-item{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-align: left;
}
.break-link-cause{
    min-width: 255px;
    text-align: left;
}
.busy-cause{
    margin-left: 20px;
}
.phone-call-summary .summary-nav{
    width: 100%;
    /* border-bottom: 1px solid #DCDFE6; */
    display: flex;
}
.phone-call-summary .summary-nav .title{
    height: 20px;
    /* border-bottom: 2px solid; */
    font-weight: 600;
    line-height: 20px;
}
.remark-box{
    display: flex;
}
.remark-input{
    margin-right: 10px;
}
.summary-nav .title .el-icon-s-order{
    color: rgb(249,128,48);
    font-size: 20px;
    vertical-align: bottom;
}
.footer-btn{
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translate(-50%, 0);
}
.outbound-btn{
    border-color: rgb(54,115,228);
    color: rgb(54,115,228);
}
.phone-submit-btn{
    background-color: rgb(54,115,228);
    padding: 9px 20px;
}
.break-link-outbound{
    margin-left: 5px;
}


</style>
<style>
.phone-call-summary .el-form-item{
    margin-bottom: 10px;
}
.phone-call-summary .el-form-item__label{
    line-height: 32px;
}
.phone-call-summary .el-form-item__content{
    line-height: 32px;
}
.main-footer .el-checkbox__label{
    display: none;
}
.phone-call-summary .el-scrollbar__wrap{
    overflow-x: hidden;
}
</style>

