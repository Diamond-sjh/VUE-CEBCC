<template>
  <div class="net-loan-application">
    <div class="net-loan-application-content">
      <el-form :model="form" label-width="100px">
        <el-form-item label="卡号：">
          <el-input v-model="form.cardNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="贷款类型：">
          <el-select v-model="form.type">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
    data(){
        return{
            form:{
                cardNo:'',
                type:'100'
            },
            types:[
                {label:"请选择",value:'100'},
                {label:"有借有还",value:'101'}
            ]
        };
    },
    mounted(){
        this.form.cardNo = "3222233";
    },
    methods:{
        applicationBtnHandler(){
            if(this.form.type ==="100"){
                this.csrAlert.warning('请选择类型');
                return;
            }else{
                this.applicationTrans()
            }
        },
        applicationTrans(){
            let parma = {
               cardNo:this.form.cardNo,
                type:this.form.type,
                TranCode:""
            }
               console.log(parma)
              this.$MainAjax.doPost(urlConfig.trans.SendSMS,parma).then(res =>{
          //  if(res && res.code ===1){
                console.log(res)
            }
            )
        }
    
    }
}
</script>
<style scope>
    .net-loan-application{
        width:100%
    }
    .net-loan-application-content{
        width: 50%;
        margin:12px auto;
        font-weight: bold;
        display:flex;
        justify-content: center;
        background-color:gainsboro; 
        padding-top:20px;
        box-shadow: 4px 4px 4px gainsboro;
        border-radius:6px;
    }
</style>