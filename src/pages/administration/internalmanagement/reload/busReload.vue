<template>
<!-- 重载 -->
  <div>
    <el-row class="title">
      <el-col :span="24">
        <el-button type="primary" size="small" plain @click="reloadParam()">重载</el-button>
      </el-col>
    </el-row>
    <el-row class="reloadTable">
      <template>
        <div>
          <el-table stripe border ref="multipleTable" :data="paramTableData" tooltip-effect="dark" max-height="500" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column prop="dicValue" label="重载项"></el-table-column>
          </el-table>
        </div>
      </template>
    </el-row>
    <!-- 结果显示页面 -->
    <queryResTable :pageSize="20" pagePosition="right" :url="resultUrl" :param="param" :pageSizes="[20]" 
    @dataResult="dataResultCallback" height="300" ref="tableBox" :reloadData.sync="reloadData">
      <template v-slot:paginationContainer>
        <el-table ref="resultTable" :data="resultTableData" tooltip-effect="dark" stripe  max-height="500" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="dicValues" label="重载项" :span="8"></el-table-column>
          <el-table-column prop="status" label="重载结果" :span="8" :formatter="formstatus"></el-table-column>
        </el-table>
      </template>
    </queryResTable>
  </div>
</template>
<script>
import queryResTable from "@/core/components/PaginationContainer";
import { mapActions } from "vuex";
export default {
  name: "busReload",
  components: { queryResTable },
  data() {
    return {
      reloadData: 0,
      pageSize: 10,
      pagePosition: "",
      postUrl: urlConfig.admin.overloadQuery,
      resultUrl: urlConfig.admin.overloadResult,
      params: {},
      param: [],
      codePath: "",
      dicValues: "",
      paramTableData: [],
      resultTableData: [],
      multipleSelection: []
    };
  },

  methods: {
    formstatus(row,column) {
      var states = row[column.property]
      return states == true? "重载成功":"重载失败"
          
    },
    dataResultCallback() {
      this.resulTableData =
        response ? response.resultList : [];
    },
    //获取列表选中的数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //重载功能
    reloadParam() {
      if (this.multipleSelection.length == "0") {
        this.$message({
          showClose: true,
          message: "请选择一条数据！",
          type: "warning"
        });
        return;
      }
      this.$confirm("确认重载", "确认框", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warrning"
      })
        .then(() => {
          var overList = [];
          var param;
          for (let i = 0; i < this.multipleSelection.length; i++) {
            param = this.multipleSelection[i];
            overList.push(param);
          }
          let params = { overList: overList };
          this.$MainAjax
            .doPost(urlConfig.admin.overloadResult, params)
            .then(res => {
              if(res.retCode != constants.returnCode.success){
                this.$emit('resultChange',{
                  flush:true,//是否清空
                  info:{
                    type: constants.optionResultType.error, 
                    content:"重载失败："+res.retMsg,  
                  }
                });
              }else{
                this.resultTableData.push(res.data);
              }
            });
        })
        .catch((e) => {
            this.$emit('resultChange',{
              flush:true,
              info:{
                type: constants.optionResultType.error, 
                content:"重载失败："+e,  
              }
            });
        });
    },
    //查询重载项
    reloadquery() {
      let params = { dicCode: "item_overload" };
      this.$MainAjax.doPost(urlConfig.admin.overloadQuery, params).then(res => {
          //this.paramTableData = res.data.overList || [];
          console.log(res)
      });
    }
  },
  mounted: function() {
    this.reloadquery();
  }
};
</script>
<style scoped>
.title {
  text-align: right;
}
.reloadTable {
  margin: 20px 0;
}
.reloadTable .el-table {
  margin: 0 auto;
}
</style>
