<template>
  <div class="infinite-scroll-table">
    <p class ='infinite-scroll-table-title'>已经展示了{{tableData.length}}条数据</p>
    <el-table
      :data="tableData"   
      :highlight-current-row='hightlight'
       v-loadmore="loadMore"
       border
      :height="tableHeight"
      style="width:100%"
      @selection-change="handleSelectionChange"
    >
      <slot name="tableList"></slot>
      <div slot="append" v-show ="tableData.length >= totalsizes ">
       <!--  <p v-show ="tableData.length" class ="infinite-scroll-table-title">{{tableData.length < totalsizes ? '' : '已经没有更多数据了'}}</p> -->
       <p class ="infinite-scroll-table-title">没有更多数据了~~</p> 
      </div>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
  tableData:{type:Array,default: () =>[] },
  tableHeight: { type: String },
  hightlight:{type:Boolean,default:true},
  totalsizes: {type:Number}
  },
  data() {
    return {
      multipleSelection: []
    };
  },
  mounted() {},

   methods: {
    loadMore() {
       if(this.tableData.length < this.totalsizes){
        this.$emit("loadingMore",{});
      }
    },
    handleSelectionChange(val) {
	  this.multipleSelection = val;
      this.$emit("handleSelectionChange",this.multipleSelection);
    }
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        const selectWrap = el.querySelector(".el-table__body-wrapper");
        selectWrap.addEventListener("scroll", function() {
          let sign = 0;
          const scrollDistance =
            this.scrollHeight - this.scrollTop - this.clientHeight;
          if (scrollDistance <= sign) {
            binding.value();
          }
        });
      }
    }
  },
};
</script>
<style scope>
  .infinite-scroll-table .infinite-scroll-table-title{
    text-align: center;
    padding:12px;
    font-size: 14px;
  }
  .infinite-scroll-table .el-table th,
  .infinite-scroll-table .el-table td{
    text-align: center;

    
  }
</style>