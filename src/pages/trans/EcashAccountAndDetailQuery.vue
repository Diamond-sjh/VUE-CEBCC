<template>
    <!-- 电子现金账户及明细查询 -->
    <div class="ecash-account-and-detail-query p20" >
        <el-row :gutter="10">
            <el-form label-width="130px" :inline="true">
                <el-col :span="8">
                    <el-form-item label="电子现金账户状态">
                        <span>正常</span>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="电子现金账户余额">
                        <span>1750.00元</span>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <el-row :gutter="10">
            <el-form label-width="130px" :model="queryForm">
                <el-col :span="8">
                    <el-form-item label="交易类别">
                        <el-select v-model="queryForm.optionType" placeholder="请选择交易类别" style="width:100%;">
                            <el-option label="请选择" value="0"></el-option>
                            <el-option label="联机交易查询" value="1"></el-option>
                            <el-option label="脱机交易查询" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="开始日期">
                        <el-date-picker v-model="queryForm.startDate" placeholder="开始日期" type="date" style="width:100%;" value-format="yyyy-MM-dd" clearable></el-date-picker>
                    </el-form-item>
                   
                </el-col>
                <el-col :span="8">
                    <el-form-item label="结束日期">
                        <el-date-picker v-model="queryForm.endDate" placeholder="开始日期" type="date" style="width:100%;" value-format="yyyy-MM-dd" clearable></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <el-row type="flex" justify="center">
            <el-button type="primary" @click="btnSubmitClickHandler">查询</el-button>
        </el-row>
        <!-- <el-table :data="queryLst" style="width:100%;">
            <el-table-column prop="date" label="交易日期" min-width="120"></el-table-column>
            <el-table-column prop="date" label="交易类别" min-width="100"></el-table-column>
            <el-table-column prop="date" label="交易金额" min-width="100"></el-table-column>
            <el-table-column prop="date" label="交易渠道"></el-table-column>
            <el-table-column prop="date" label="交易状态" min-width="100"></el-table-column>
        </el-table> -->
    </div>
</template>
<script>
export default {
    name:'ecashaccountanddetailquery',
    data(){
        return{
            queryForm:{
                startDate:'',
                endDate:'',
                optionType:'0',
            },
            queryLst:[]
        }
    },
    methods:{
        // 查询操作
        btnSubmitClickHandler(){
            console.log(this.queryForm);
        }
    },
}
</script>