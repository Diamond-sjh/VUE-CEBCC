<template>
    <div class="notice-info-panel">
        <header>
            <el-row type="flex" align="middle" :gutter="30">
                <el-col :span="8">
                    <el-row type="flex" align="middle">
                        <el-col :span="6"><div class="label">公告标题：</div></el-col>
                        <el-col :span="18">
                            <el-input type="text" v-model="params.title" maxlength="20" placeholder="请输入公告标题" size="small"></el-input>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="12">
                    <el-row type="flex" align="middle">
                        <el-col :span="3">
                            <div class="label">有效期：</div>
                        </el-col>
                        <el-col :span="10">
                            <el-date-picker
                              size="small"
                              style="width:100%"
                              v-model="params.starTime"
                              type="datetime"
                              placeholder="开始时间">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="1">—</el-col>
                        <el-col :span="10">
                            <el-date-picker
                              size="small"
                              style="width:100%"
                              v-model="params.endTime"
                              type="datetime"
                              placeholder="结束时间"
                              default-time="23:59:59">
                            </el-date-picker>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" size="small" @click="noticeQuery">查询</el-button>
                </el-col>
            </el-row>
        </header>

        <main class="notice-list">
            <CsrTableBox
              :pageSize="20" 
            :pageSizes ="[20]"  
            :url ='postUrl' 
            :params="params"
            pagePosition="center"
            :reloadData.sync="reloadData"
            @dataChanged="dataChangedCallback" 
            ref="tableDemo">
             <template v-slot:paginationContainer>
                 <el-table
                  :data="noticeData"
                  :row-style="isInvalid">
                  <el-table-column align="center" type="index" label="序号" width="100"></el-table-column>
                  <el-table-column align="center" label="公告标题" prop="title">
                        <template slot-scope="scope">
                            <div class="notice-title">
                                {{scope.row.title}}
                            </div>
                        </template>
                  </el-table-column>
                  <el-table-column align="center" prop="author" label="创建人"></el-table-column>
                  <el-table-column align="center" label="更新时间">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.time}}
                            </div>
                        </template>
                  </el-table-column>
               </el-table>
             </template>
            </CsrTableBox> 
        </main>
    </div>
</template>

<script>
import CsrTableBox from '@/core/components/PaginationContainer'
export default {
    data () {
        return {
            noticeData: [{
                title: '这是一个公告标题这是一个公告标题这是一个公告标题这是一个公告标题',
                author: '创建人',
                time: '2019-10-10 22:11:10',
                type: 1
            },
            {
                title: '这是一个公告标题这是一个公告标题',
                author: '创建人',
                time: '2019-10-10 22:11:10',
                type: 2
            }],
            postUrl: '',
            params: {
                title: '',
                startTime: '',
                endTime: ''
            },
            reloadData: 0
        }
    },
    components: { CsrTableBox },
    methods: {
        dataChangedCallback (req) {
            console.log(req)
            // 拿到公告数据
        },
        isInvalid (row) {
            if (row.row.type == 2) {
                return {color: '#999'}
            }
        },
        noticeQuery () {
            if (this.params.startTime && this.params.endTime) {
                let starTime = new Date(this.params.startTime).getTime()
                let endTime = new Date(this.params.endTime).getTime()
                if (starTime > endTime) {
                    this.csrAlert.warning('结束时间不能小于开始时间')
                    return
                }
            }

            this.reloadData = 1
        }
    },
    mounted () {
        this.$emit('childInit', {
            width: 1000,
            height: 700,
            label: '公告信息'
        })
    }
}
</script>

<style scoped>
.notice-title{
    width: 250px;
    margin: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

}
.notice-info-panel{
    font-size: 14px;
}
.label{
    text-align: right
}
.notice-list{
    padding-top: 20px;
}
</style>
