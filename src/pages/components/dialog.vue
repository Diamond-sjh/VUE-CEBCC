<template>
    <div>
        <el-dialog :title="title"  :visible.sync="dialogVisible" :showDialog='showDialog' width="60%"  @close="closedialog" @open="openDialog">
            <slot name="dialogName"></slot>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props:{
        showDialog:{type:Boolean,default:false},
        title:{type:String,required:true},
        formData:{type:Object,required:true},
        formBack:{type:Object,required:true}  
    },
    data(){
        return{
            dialogVisible:false,
        }
    },
    watch:{
        showDialog(){
            if(this.showDialog ==true){
                this.dialogVisible=true; 
            }else{
                this.dialogVisible=false;
            }
        },
    },
    methods:{
        //重置内容
        cleraForm(form1,form2) {
            let form_value=form1
            let form_value1=form2;
            for(var item in form_value){
                form_value[item]=form_value1[item];
            }  
        },
        openDialog() {
            this.$emit('open');
        },
        closedialog(){
            this.cleraForm(this.formData,this.formBack);
            this.$emit('close');
            this.$emit('update:showDialog',false);
        },
    },
    mounted(){
       console.log()
    }
}
</script>

