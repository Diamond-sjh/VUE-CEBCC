<template>
  <!-- 公共规范样式表格 -->
  <div class="public-demo-panel">
    <el-tabs type="card" v-model="activeTab">
      <el-tab-pane label="样式" name="1">
        <PublicCssDemo></PublicCssDemo>
      </el-tab-pane>
      <el-tab-pane label="按钮" name="5">
        <ButtonDemo></ButtonDemo>
      </el-tab-pane>
      <el-tab-pane label="组件" name="2">
        <!--    <PaginationContainerDemo></PaginationContainerDemo> -->
        <TableLazyLoad 
        :tableData ='tableData'
        :tableHeight="tableHeight"
        :pagesize ="pagesize"
        :totalsizes="totalsizes"
        :hightlight ="hightlight"
        @loadingMore ="loadingMore"
        @handleSelectionChange="handleSelectionChange"
         >
          <template v-slot:tableList>
              <el-table-column type="selection" width="120"></el-table-column>
              <el-table-column type="index" label="序号" width="120"></el-table-column>
              <el-table-column prop="date" label="日期" width="180"></el-table-column>
              <el-table-column prop="name" label="姓名" width="180"></el-table-column>
              <el-table-column prop="address" label="地址"></el-table-column>
          </template>
        </TableLazyLoad>
      </el-tab-pane>
      <el-tab-pane label="表单" name="3">
        <FormDemo></FormDemo>
      </el-tab-pane>
      <el-tab-pane label="公共函数" name="4">
        <GlobalMethodsDemo></GlobalMethodsDemo>
      </el-tab-pane>
      <el-tab-pane label="交易" name="6">
        <TransDemo></TransDemo>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PaginationContainerDemo from "@/pages/demos/PaginationContainerDemo";
import TableLazyLoad from "@/pages/demos/TableLazyLoad";
import PublicCssDemo from "@/pages/demos/PublicCssDemo";
import FormDemo from "@/pages/demos/FormDemo";
import ButtonDemo from "@/pages/demos/ButtonsDemo";
import GlobalMethodsDemo from "@/pages/demos/GlobalMethodDemo";
import TransDemo from "@/pages/demos/TransDemo";
export default {
  components: {
    PaginationContainerDemo,
    PublicCssDemo,
    FormDemo,
    ButtonDemo,
    TransDemo,
    GlobalMethodsDemo,
    TableLazyLoad
  },
  data() {
    return {
      activeTab: "1",
      dateTime: null,
      tableData: [],
      tableHeight:'200',
      pagesize: 5, // 每页的数据
      totalsizes: 40, //数据的总量
      multipleSelection: [],
      hightlight:true

    };
  },
  mounted() {
    this.$emit("childInit", {
      width: 1000,
      height: 700,
      label: "公共组件与样式"
    });
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      console.log("获取数据...");
      /* 
    let param = {
        pagaIndex = this.currentPage;
    }
    this.$MainAjax.doPost(this.url.param).then(req =>{
        this.totalsizes = req.totalsizes;
        this.tableData = req.data
    })
*/
      this.tableData.push(
        { data: "11", name: "张三" },
        { data: "22", name: "李四" },
        { data: "33", name: "王五" },
        { data: "44", name: "赵六" },
        { data: "55", name: "小黑" }
      );
    },
    loadingMore() {
   
        this.tableData = this.tableData.concat([
          { data: "", name: "小明" },
          { data: "", name: "小明" },
          { data: "", name: "小明" },
          { data: "", name: "小明" },
          { data: "", name: "小明" }
        ]);
      
    },
    handleSelectionChange(val) {
        // val 传递过来的值
     this.multipleSelection = val;
       console.log(this.multipleSelection,'传递过来的值保存在一个数组中')
    }
  },
};
</script>
<style scoped>
.width100 {
  width: 100px;
}
.permin30 {
  min-width: 250px;
}
</style>

