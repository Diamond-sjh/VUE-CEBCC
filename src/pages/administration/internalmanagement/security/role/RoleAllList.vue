<template>
    <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" :header-cell-style="{background:'#f0f9eb',border:'2px solid inherit'}" border  @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="角色编号" width="">
            <template slot-scope="scope">
                <span >{{scope.row.rolecode}}</span>
            </template>
        </el-table-column>
        <el-table-column label="角色名称" >
            <template slot-scope="scope">
                <span >{{scope.row.rolename}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="remark" label="父角色" width="200"></el-table-column>
        <el-table-column prop="rolestatus" label="角色状态" width=""></el-table-column>
    </el-table>
</template>
<script>
export default {
    data(){
        return{
            tableData3:[],
            turnPageTotalNum:0,
        }
    },
    methods:{
        handleSelectionChange(){},
        listall(){
            

        }
    },
    mounted(){
        console.log(this.$route.query)
        //this.$route.query;
        this.tableData3 = this.$route.query.roleMList;
    },
}
</script>

