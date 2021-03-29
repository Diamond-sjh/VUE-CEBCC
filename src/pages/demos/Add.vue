<template>
    <div class="add">
            <el-row>
                <el-form :model="form_add" label-width="120px" class="demo-ruleForm">
                    <el-col :span="11">
                        <el-form-item label="用户名">
                            <el-input v-model="form_add.username"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="姓名">
                            <el-input v-model="form_add.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="证件号">
                            <el-input v-model="form_add.certificates"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="性别">
                            <el-select v-model="form_add.gender" style="width:100%" placeholder="请选择性别">
                                <el-option label="男" value="shanghai"></el-option>
                                <el-option label="女" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        
                        <el-form-item label="入行日期">
                            <el-date-picker v-model="form_add.data" type="date" placeholder="选择日期" style="width:100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="所属机构">
                            <el-input v-model="form_add.mechanism" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="行政级别">
                            <el-input v-model="form_add.administrative_Level"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="技能组">
                            <el-select v-model="form_add.skills_group" style="width:100%" placeholder="请选择技能组">
                                <el-option label="双技能" value="shanghai"></el-option>
                                <el-option label="信用卡" value="beijing"></el-option>
                                <el-option label="综合座席组" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="星级">
                            <el-select v-model="form_add.level" style="width:100%" placeholder="请选择星级">
                                <el-option label="一级" value="shanghai"></el-option>
                                <el-option label="二级" value="beijing"></el-option>
                                <el-option label="三级" value="beijing"></el-option>
                                <el-option label="四级" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="归属地">
                            <el-select v-model="form_add.address" style="width:100%" placeholder="请选择星级">
                                <el-option label="一级" value="shanghai"></el-option>
                                <el-option label="二级" value="beijing"></el-option>
                                <el-option label="三级" value="beijing"></el-option>
                                <el-option label="四级" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="花名">
                            <el-input v-model="form_add.flowername"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="满意度">
                            <el-input v-model="form_add.satisfaction"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="标签">
                            <el-input v-model="form_add.autograph"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="个性签名">
                            <el-input v-model="form_add.mechanism"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="是否专家">
                            <el-select v-model="form_add.expert" style="width:100%" placeholder="请选择活动区域">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="连续录入">
                            <el-select v-model="form_add.input" style="width:100%" placeholder="请选择状态">
                                <el-option label="有效" value="shanghai"></el-option>
                                <el-option label="无效" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    
                </el-form>
            </el-row>
            <el-row>
                <el-col :span="24" style="text-align:center;">
                    <el-button @click="adminchangeSub()">取 消</el-button>
                    <el-button  type="success" @click="adminaddSub()">确 定</el-button> 
                </el-col>
            </el-row>
    </div>
</template>
<script>
export default {
    data(){
        return{
            form_add:{//新增修改model
                    username:"",
                    name:"",
                    certificates:"",
                    gender:"",
                    data:"",
                    mechanism:"",
                    administrative_Level:"",
                    skills_group:"",
                    level:"",
                    address:"",
                    flowername:"",
                    satisfaction:"",
                    autograph:"",
                    mechanism:"",
                    expert:"",
                    input:"",
                    addorchange:""
                    
                },
        }
    },
    methods:{
        adminaddSub(){
            this.$router.push({
                path:'userlist'
            })
        },
        adminchangeSub(){
            this.$router.push({
                path:'userlist'
            })
        }
    }


}
</script>
<style scoped>
    .add{
        padding-top: 10px;
        background: white;
        height: 100%;
    }
</style>

