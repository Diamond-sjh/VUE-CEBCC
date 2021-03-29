<template>
    <el-form  class="form-demo-container" :model="datas" :rules="rules" ref="ruleForm" label-position="right" label-width="100px">
        <el-row :gutter="30" >
            <!-- 
                xs: <=768px屏幕 
                sm ：768-992px屏幕分辨率
                md ： 992-1200px 
                lg ：1200 - 1920px
                xl ：>=1920px
            -->
            <el-col :xs="12" :sm="9" :md="8" :lg="8" :xl="10" class="csr-form-item-md">
                <el-form-item  prop="email" label="邮箱">
                    <el-input type="text" v-model="datas.email" auto-complete="off" placeholder="请输入邮箱号" clearable></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="9" :md="8" :lg="8" :xl="10">
                <el-form-item prop="mobile" label="手机号">
                    <el-input type="text" v-model="datas.mobile" auto-complete="off" placeholder="请输入手机号" clearable></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="9" :md="8" :lg="8" :xl="10">
                <el-form-item prop="cardNo" label="银行卡号">
                    <el-input type="text" v-model="datas.cardNo" auto-complete="off" placeholder="请输入卡号"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <!-- <el-row type="flex" justify="start" class="csr-form-item-row">
            <el-form-item   label="数量" class="csr-form-item-xs">
                <el-input v-model="datas.num" type="number" placeholder=""></el-input>
            </el-form-item>
            <el-form-item prop="mobile" label="手机号" class="csr-form-item-sm">
                <el-input type="text" v-model="datas.mobile" auto-complete="off" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item prop="cardNo" label="银行卡号" class="csr-form-item-lg">
                <el-input type="text" v-model="datas.cardNo" auto-complete="off" placeholder="请输入卡号"></el-input>
            </el-form-item>
            <el-form-item label="住址反显" >
                <div class="csr-form-item csr-form-plain-input">{{datas.address}} </div>
            </el-form-item>
        </el-row> -->
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    data(){
        return{
            
            datas:{
                email:'',
                mobile:'',
                cardNo:'',
                address:'北京市朝阳区太阳宫中路12号凯德MALLB1层',
            },
            // rules里面的属性值必须与model中的属性code一样才可以验证正确，否则无法生效
            rules:{
                email:[
                    { validator:csrValidate.email,trigger:'blur'},
                ],
                mobile:[
                    {validator:csrValidate.mobile},
                ],
                cardNo:[
                    {validator:csrValidate.cardNo,trigger:'blur',required:true},
                ]
            },
        }
    },
    methods:{
        submitForm(){
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(){
            this.$refs['ruleForm'].resetFields();
        }
    }
}
</script>

