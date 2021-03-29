<template>
  <div class="work-order">
    <el-form  :model="formdata" ref="form" label-position="right" label-width="80">
      <el-form-item  prop="formTypeLst" label="工单类型">
          <el-select v-model="formdata.type" >
            <el-option v-for="(item,index) in formTypeLst" :key="index" >
                {{item.name}}
            </el-option>
          </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props:{
    contentObj:{
      type:Object,
      default:()=>{}
    }
  },
  data(){
    return{
      formdata:{
        type:"",
      },
      formTypeLst:[
        {name:"电子渠道问题",url:""}
      ],//工单类型
    }
  },
  methods:{
    //初始化要选中的内容信息
    initData(){
      this.formdata.formTypeLst = this.contentObj.formTypeLst?this.contentObj.formTypeLst:[];
    },
    //工单提交时候发送
    onFormSumit(){

    }
  },
  mounted(){
    this.$emit("childInit",{
      width:800,
      height:400,
      label:"生成工单",
    });
    this.initData();
  }
}
</script>