 
<template>
    <div>
        <el-row class="text_right">
            <el-button type="primary" plain size="small" @click="redisLoadfun">重载</el-button>
        </el-row>
        <h2 class="querylist_style border">查询结果</h2>
        <queryResTable  pagePosition="right" :url ='postUrl' :params="params" ref="tableBox" :reloadData.sync="reloadData"
        :pageSize="20"  @dataChanged="dataChangedCallback">
          <template v-slot:paginationContainer>
            <el-table :data="tableData"  tooltip-effect="dark" max-height="500" border highlight-current-row stripe @current-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="40"></el-table-column> -->
                <el-table-column  prop="Code" label="账号"></el-table-column>
                <el-table-column prop="Name" label="账号类型"></el-table-column>
                <el-table-column prop="Number" label="客户证件号"></el-table-column>
            </el-table>
          </template>
        </queryResTable>
    </div>
</template>
<script>
import queryResTable from '@/core/components/PaginationContainer';
//import MainAjax from "@/core/utils/MainAjax";
export default {
    components:{queryResTable},
    data(){
        return{
            postUrl:"",
            tableData:[
                {"Code":"1245515","Name":"张三","Number":"2","id":"5"},  
                {"Code":"1245515","Name":"张三","Number":"2","id":"5"},
                {"Code":"1245515","Name":"张三","Number":"2","id":"5"},
                {"Code":"1245515","Name":"张三","Number":"2","id":"5"},
                {"Code":"1245515","Name":"张三","Number":"2","id":"5"},
            ],
            params:{},
            reloadData:0,
            checkedData:[],
        }
    },
    methods:{
        //列表返回list
        dataChangedCallback(response){
            this.tableData = response&&response? response.skillTeamList:this.tableData;
        },
        //获取选中条数的数据
        handleSelectionChange(data){
            this.checkedData.push(data);
            console.log(this.checkedData)
            //console.log(this.tableData)
        },
        redisLoadfun(){
            console.log(this.checkedData.length)
            // if(this.checkedData.length!='1'){
            //     alert("请选择一条数据")
            //     return;
            // }
            let data={
                isdelete_oninit:"1",
                isinit_redis_sysinfo:"1"

            }
            this.$MainAjax.doPost(urlConfig.admin.initRedisSysInfo,data).then(req =>{
                if(req.retCode==this.$constants.returnCode.success){
                    this.$emit('resultChange',{info:[
                    {
                        type: this.$constants.optionResultType.success,
                        content:"重载成功!",
                    }
                    ],flush:true});
                }else{
                    this.$emit('resultChange',{info:[
                    {
                        type: this.$constants.optionResultType.error,
                        content:req.retMsg,
                    }
                    ],flush:true});
                }
            })
        },
    },
    mounted(){},
}
</script>

