<template>
    <!-- 常用话术模块 -->
    <div class="online-common-speech ">
        <el-row :gutter="20" class="mb10">
            <el-col :span="10">
                <el-input v-model="searchKey" placeholder="请输入内容"></el-input>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
            </el-col>
        </el-row>
        <el-scrollbar :native="false" tag="div" wrapStyle="overflow-x:hidden;">
            <div class="question-answer-item">
                <div class="item-marker question">Q</div>
                <span class="content">银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程<i class="el-icon-document-copy"></i></span>
            </div>
            <div class="question-answer-item">
                <div class="item-marker answer">A</div>
                <span class="content">
                    1.携带本人身份证有效证件<br/>
                    2.在大堂挂号预约办理业务并排队等候办理业务<br/>
                    3.如果不是你本人办理业务：青携带您的身份证件（一般为身份证）到开户行（当时办卡的那个网点）办理<br/>
                    4.在大堂挂号预约办理业务并排队等候办理业务<br/>
                    5.在大堂挂号预约办理业务并排队等候办理业务<br/>
                    6.在大堂挂号预约办理业务并排队等候办理业务<br/>
                </span>
            </div>
            <div class="question-answer-item">
                <div class="item-marker question">Q</div>
                <span class="content">银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程<i class="el-icon-document-copy"></i></span>
            </div>
            <div class="question-answer-item">
                <div class="item-marker answer">A</div>
                <span class="content">
                    1.携带本人身份证有效证件<br/>
                    2.在大堂挂号预约办理业务并排队等候办理业务<br/>
                    3.如果不是你本人办理业务：青携带您的身份证件（一般为身份证）到开户行（当时办卡的那个网点）办理<br/>
                    4.在大堂挂号预约办理业务并排队等候办理业务<br/>
                    5.在大堂挂号预约办理业务并排队等候办理业务<br/>
                    6.在大堂挂号预约办理业务并排队等候办理业务<br/>
                </span>
            </div>
            <div class="question-answer-item">
                <div class="item-marker question">Q</div>
                <span class="content">银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程银行卡办理流程<i class="el-icon-document-copy"></i></span>
            </div>
            <div class="question-answer-item">
                <div class="item-marker answer">A</div>
                <span class="content">
                    1.携带本人身份证有效证件<br/>
                    2.在大堂挂号预约办理业务并排队等候办理业务<br/>
                    3.如果不是你本人办理业务：青携带您的身份证件（一般为身份证）到开户行（当时办卡的那个网点）办理<br/>
                    4.在大堂挂号预约办理业务并排队等候办理业务<br/>
                    5.在大堂挂号预约办理业务并排队等候办理业务<br/>
                    6.在大堂挂号预约办理业务并排队等候办理业务<br/>
                </span>
            </div>
        </el-scrollbar>
        <el-divider></el-divider>
        <el-pagination class="pb20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="curPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="5"
            layout='total, sizes, prev, next, pager, jumper'
            :total="totalRows">
        </el-pagination>
    </div>
</template>
<script>
export default {
    data(){
        return{
            searchKey:'',
            curPage:1,
            totalRows:0,
        }
    },
    methods:{
        handleSizeChange () {},
        handleCurrentChange () {}
    }
}
</script>
<style scoped>
    .online-common-speech{
        padding:10px;
        display:flex;
        flex-flow: column nowrap;
        overflow: hidden;
    }
    .online-common-speech .speech-content-inner{
        flex: 1;
        overflow: hidden;
        overflow-y: auto;
    }
    .online-common-speech .question-answer-item{
        display: flex;
        flex-flow: row nowrap; 
        margin: 5px 0;   
        font-size: 14px;
        /* align-items: center; */
    }
    .online-common-speech .question-answer-item .content{
        line-height: 25px;
        text-align: left;
    }
    .online-common-speech .question-answer-item i{
        margin-left:15px;
    }
    .online-common-speech .item-marker{
        line-height: 25px;
        height: 25px;
        width: 25px;
        border-radius: 50%;
        color:white;
        margin-right: 10px;
        text-align: center;
    }
    .online-common-speech .item-marker.question{
        background-color: #409eff; 
    }
    .online-common-speech .item-marker.answer{
        background-color:#67c23A;
    }
</style>
