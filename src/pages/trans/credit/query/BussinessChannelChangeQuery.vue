<template>
    <div class="bussiness-channel">
        <div class="bussiness-channel-header">
            <el-row type="flex" justify="center">
                <el-col :span="7">
                    <span>卡号/账号：</span>
                    <el-select v-model="card">
                        <el-option
                        v-for="item in cardList"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="7">
                    <span>查询时间：</span>
                    <el-date-picker
                    v-model="year"
                    type="year">
                    </el-date-picker>
                </el-col>
                <el-col :span="10">
                    <span>业务功能：</span>
                    <el-select
                    style="width:300px"
                    v-model="bussinessId"
                    filterable
                    remote
                    reserv-keyword
                    :remote-method="remoteMethod"
                    @focus="getAllBussiness"
                    placeholder="请输入关键字"
                    :loading="loading">
                    <el-option
                    v-for="(item,index) in bussinessList"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </div>
        <div class="bussiness-channel-content"  v-show="showList">
            <csr-table-box
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
                   border
                  :data="busData">
                  <el-table-column align="center" type="index" label="序号" width="100"></el-table-column>
                  <el-table-column align="center" label="客户号" prop="title"></el-table-column>
                  <el-table-column align="center" label="卡号/账号" prop="author" ></el-table-column>
                  <el-table-column align="center" label="机构号" prop="author" ></el-table-column>
                  <el-table-column align="center" label="原值" prop="author" ></el-table-column>
                  <el-table-column align="center" label="修改值" prop="author" ></el-table-column>
                  <el-table-column align="center" label="修改日期" prop="author" >
                      <template slot-scope="scope">
                            <div>
                                {{scope.row.time}}
                            </div>
                        </template>  
                  </el-table-column>
                  <el-table-column align="center" label="修改时间" prop="author" >
                      <template slot-scope="scope">
                            <div>
                                {{scope.row.time}}
                            </div>
                        </template>
                  </el-table-column>
                  <el-table-column align="center" label="渠道" prop="author" ></el-table-column>
               </el-table>
             </template>
            </csr-table-box> 
        </div>
    </div>
</template>
<script>
import CsrTableBox from '@/core/components/PaginationContainer'
export default {
    data () {
        return {
            card: '1112',
            cardList: [1112, 2222, 3333],
            loading: false,
            bussinessList: [],
            bussinessId: '',
            year: new Date(),
            postUrl: '',
            params: {},
            reloadData: 0,
            busData: [],
            showList: false
        }
    },
    components: {CsrTableBox},
    methods: {
        remoteMethod (val) {
            console.log(val)
            console.log(22)
            this.bussinessList = [{label: '功能1', value: 1}, {label: '功能2', value: 2}, {label: '功能3', value: 3}]
        },
        getAllBussiness () {
            if (this.bussinessId) {
                return
            }
            console.log('获取焦点')
            // 获取全部业务功能
        },
        dataChangedCallback () {

        },
        queryBtnClickHandler () {
            if (!this.year) {
                this.$message.warning('请选择时间')
                return
            }
            if (!this.bussinessId) {
                this.$message.warning('请选择业务功能')
                return
            }
            if (!this.card) {
                this.$message.warning('请选择卡号')
                return
            }
            this.reloadData = 1
            this.showList = true
        }
    }
}
</script>

<style scoped>
.bussiness-channel-header{
    padding: 15px 0px;
}
</style>


