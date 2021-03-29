<template>
<!-- backgroundSize:'contain' -->
  <div class="login-view" :style ="{backgroundImage:'url('+(coverImgUrl?coverImgUrl:baseImg)+')',backgroundSize:'auto 100%',backgroundPosition:'center',backgroundRepeat:'no-repeat'}">
    <!-- 登录界面 -->
    <div class="login-container">
      <el-form :model="agent" :rules="rules2" ref="loginForm" class="login-form">
        <h3 class="title">
          <img src="../../static/img/login/logintop.png"  />
        </h3>
        <el-form-item prop="accCode">
          <span v-if="userStyleActive">
            <img src="../../static/img/login/sap.png"  />
          </span>
          <span v-if="!userStyleActive">
            <img src="../../static/img/login/password.png"  />
          </span>
          <el-input
            type="text" :class="userStyleActive ? 'active':'' "  :max="10"  v-model="agent.accCode" auto-complete="off"  @blur="sendRoleAction"  @focus="userStyleActive = true" placeholder="请输入SAP号"  clearable
           ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <span v-if="passwordStyleActive">
            <img src="../../static/img/login/sap.png"  />
          </span>
          <span v-if="!passwordStyleActive">
            <img src="../../static/img/login/password.png"  />
          </span>
          <el-input
            type="password"  :class="passwordStyleActive ? 'active':'' "  v-model="agent.password"  auto-complete="off" @blur="passwordStyleActive = false"  @focus="passwordStyleActive = true" placeholder="请输入6-10位数字组合" show-password  clearable
          ></el-input>
        </el-form-item>
        <!-- label="用户角色" -->
         <el-form-item >
            <span v-if="!seatStyleActive">
              <img src="../../static/img/login/seat.png"  />
            </span>
            <span v-if="seatStyleActive">
              <img src="../../static/img/login/sap.png"  />
            </span>
             <el-select v-model="agent.roleCode" placeholder="请选择角色" style="width:100%;" :class="seatStyleActive ? 'active':'' "  @blur="seatStyleActive = false"  @focus="seatStyleActive = true" >
                <el-option label="请选择角色" value=""></el-option>
                <el-option v-for="(it,index) in roleLst" :key="it.roleCode" :value="it.roleCode" :label="it.roleName"></el-option>
            </el-select>
        </el-form-item>
          <!-- 修改密码 -->
          <el-row type="flex" justify="end" class="pwd-editor">
                <el-button type="text" @click="dialogVisible=true">修改密码</el-button>
            </el-row>
        <el-form-item>
          <el-button type="primary"  class="login-button" @click.native.prevent="loginBtnClick" :loading="logining">登录</el-button>
        </el-form-item>
      </el-form>
      <!-- 关联系统 -->
      <div>
        <el-scrollbar class = "footer-scroll">
      <div class="login-footer">
        <ul class="login-footer-container">
          <li v-for="(item,index) in systemUrlLst" :key="index" @click="btnSystemClickHandler(item)">  
            <el-link  type="info" :underline ="false">
              <img :src="item.url" alt />
              <p>{{item.name}}</p>
            </el-link>
          </li>
        </ul>
      </div>
      </el-scrollbar>
      <el-dialog title="密码修改" :visible.sync="dialogVisible" width="400px" center>
            <el-form :model="pwdChangeForm" :rules="pwdChangeRules" label-width="100px" ref="dialogForm">
                <el-form-item label="用户编号" prop="accCode">
                    <el-input v-model="pwdChangeForm.accCode" @blur="getUserValid"></el-input>
                </el-form-item>
                <el-form-item label="旧密码" prop="old">
                    <el-input v-model="pwdChangeForm.old" show-password></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="new">
                    <el-input v-model="pwdChangeForm.new" show-password></el-input>
                </el-form-item>
                <el-form-item label="重复新密码" prop="newSec">
                    <el-input v-model="pwdChangeForm.newSec" show-password></el-input>
                </el-form-item>
            </el-form>
            <el-row type="flex" justify="center">
                <el-button type="warning" @click="btnChangePwdClickHandler" >确定</el-button>
                <el-button type="danger" @click="dialogVisible=false">返回</el-button>
            </el-row>
        </el-dialog>
    </div>
  </div>
</div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import '../assets/styles/login.css';
export default {
  data() {
    //用户登陆密码规则 必须是数字+字母的组合（区分大小写） 6-10位字符
    var password = (rule, value, callback) => {
      var pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/;
      if (value === "") {
        callback("请输入密码");
      } else {
        if (pattern.test(value)) {
          callback();
        } else {
          callback(new Error("6-10位数字+字母的组合(区分大小写)"));
        }
      }
    };
var checkPassword =(rule,value,callback)=>{
            if(value===''){
                callback(new Error('请输入密码'));
            }else{
                if(this.pwdChangeForm.newSec && this.pwdChangeForm.newSec!==''){
                    this.$refs.dialogForm.validateField('newSec');
                }
                callback();
            }
        };

        //修改密码的重复密码验证规则
        var checkPassword2 = (rule,value,callback)=>{
            if(value==='' ||!value){
                callback(new Error('请输入密码'));
            }else{
                // console.log("密码校验",this.pwdChangeForm.new,this.pwdChangeForm.newSec,value);
                if(this.pwdChangeForm.new!==value){
                    callback(new Error('两次输入的密码不一致'));
                }else{
                    callback();
                }
            }
        };
    return {
      coverImgUrl:null,
      baseImg:'/static/img/login/bgimg.jpg',
      userStyleActive: false,
      passwordStyleActive: false,
      seatStyleActive: false,
      dialogVisible: false,
      agent: {
        accCode: "", //用户名
        password: "", //登录密码
        seatName: "" //语音座席
      },
      accCodeValid: false,
      logining: false,
       roleLst:[],
      rules2: {
        accCode: [
          { required: true, message: "请输入SAP号", trigger: "blur" },
          { validator: csrValidate.agentName }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: csrValidate.agentPassword }
        ],
        seatName: [
          { required: true, message: "请输入座席信息", trigger: "blur" }
        ]
      },
       validateRes:{
                accCode:false,
                old:false,
                new:false,
                newSec:false,
            },
            pwdChangeRules:{
                accCode: [
                    { required:true,validator: csrValidate.agentName,trigger:"blur"}
                ],
                old: [
                    { required:true,validator: csrValidate.agentPassword,trigger:'blur' }
                ],
                new:[
                    { validator: password ,trigger:'blur'},
                    { validator: checkPassword ,trigger:'blur'},
                ],
                newSec:[
                    {required:true,validator:checkPassword2,trigger:'blur'},
                ]
            },

      systemUrlLst: [
        { name: "知识库", url: "../../static/img/login/knowledge.png", path: "admin"},
        { name: "排班系统", url: "../../static/img/login/schedual.png", path: "personalcenter"},
        { name: "质检", url: "../../static/img/login/qa.png", path: "admin" },
        { name: "光大银行", url: "../../static/img/login/website.png", path: "admin"},
        { name:"信用卡地带",url:"../../static/img/login/creditcard.png",path:"admin"}, 
        { name:"报表系统",url:"../../static/img/login/order.png",path:"admin"},
        { name:"工作流",url:"../../static/img/login/workflow.png",path:"admin"}, 
      ],
      pwdChangeForm:{
        old:'',
        new:'',
        newSec:'',
        accCode:"",
      },
      roleLst:[],
    };
  },
  computed: {
    ...mapGetters(["getUserRoleLst"])
  },
  watch: {
    getUserRoleLst: {
      handler(nval, oval) {
        this.roleLst = nval;
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(["actionAgentLogin", "actionGetAgentRole"]),
    loginBtnClick() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.logining = true;
          this.actionAgentLogin({
            agent: {
              accCodeParam: this.agent.accCode,
              accPwordParam: this.agent.password,
              roleCodeParam: this.agent.roleCode
            },
            callback: this.loginCallback
          });
        } else {
          console.log("error");
        }
      });
    },
    loginCallback(success = false, msg) {
      this.logining = false;
      if (success) {
        //登陆成功
        this.$emit("showIndex");
      } else {
        this.csrAlert.error(msg);
      }
    },
    btnSystemClickHandler(item) {
      console.log("开启系统----" + item.name);
      window.open(item.path, "_blank");
    },
    sendRoleAction() {
      this.actionGetAgentRole({ name: this.agent.accCode });
      this.userStyleActive = false;
    },
 //密码修改提交
 btnChangePwdClickHandler(){
            this.$refs.dialogForm.validate((valid)=>{
                
                if(valid){ 
                    if(!this.accCodeValid){
                        this.csrAlert.error("用户编码错误");
                        return;
                    }
                    let param = {
                        accCodeParam: this.pwdChangeForm.accCode,
                        accPwordParam: this.pwdChangeForm.old,
                        accPwordParamNew: this.pwdChangeForm.new, 
                    }
                    this.$MainAjax.post(urlConfig.app.loginAgentPassEdit,param).then(req =>{
                        console.log(req);
                        if(req.retCode !=this.$constants.returnCode.success){
                            this.csrAlert.error(req.retMsg);
                        }else{
                            this.csrAlert.success('修改成功');
                            this.dialogVisible = false;
                            //清理form表单内容
                            this.$refs.dialogForm.resetFields();
                        }
                    });
                }else{
                    console.log('error');
                }
            });
        },



    getUserValid() {
      this.accCodeValid = false;
      this.$MainAjax
        .post(urlConfig.app.loginIsValidUser, {
          accCodeParam: this.pwdChangeForm.accCode
        })
        .then(
          req => {
            if (req.retCode != this.$constants.returnCode.success) {
              //用户编码不存在
              this.csrAlert.error(req.retMsg);
              this.accCodeValid = false;
            } else {
              this.accCodeValid = true;
            }
          },
          error => {
            this.accCodeValid = false;
          }
        );
    }
  }
};
</script>
<style scoped>

.login-view {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
.login-container {
  position: absolute;
  top: 50%;
  right: 5.1rem;
  width: 22.84rem;
  height:27.2rem;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 0.4rem #cac6c6;
  padding: 0 3.16rem;
  margin-top:-13.6rem;
}
.login-container .login-form {
  margin: 1.68rem auto 0px;
}

.login-container .title {
  margin: 0px auto 1.72rem auto;
  text-align: center;
  color: #505458;
}

.login-container /deep/ .login-form .el-form-item .el-form-item__content {
  position: relative;
  margin-bottom: 0.6rem;
 
}
.login-container /deep/ .login-form .el-form-item .el-form-item__content .el-form-item__error{
 font-size:0.5rem;
 
}
.login-container /deep/ .login-form .el-form-item .el-form-item__content>span {
  position: absolute;
  left: 0.6rem;
  top: 0.24rem;
  z-index: 100;
}

.login-container /deep/ .login-form .el-form-item .el-form-item__content .el-input {
  box-sizing: border-box;
  height: 1.68rem;
}
.login-container /deep/ .login-form .el-form-item .el-form-item__content .el-select{
  box-sizing: border-box;
  height: 1.76rem;
}
.login-container /deep/ .login-form .el-form-item .el-form-item__content .el-input input {
  border-radius: 0;
  border-top: 0 none;
  border-right: 0 none;
  border-left: 0 none;
  border-bottom: 1px solid rgb(238, 238, 238);
  font-size: 0.64rem;
  padding-left: 2.4rem;
  width:100%;
}
.login-container /deep/ .login-form .el-form-item .el-form-item__content .el-select.active input,
.login-container /deep/ .login-form .el-form-item .el-form-item__content .el-input.active input{
  border-bottom: 2px solid rgb(76, 132, 255);
}

.login-container /deep/ .pwd-editor span{
color:rgb(19, 118, 218);
font-size:0.56rem;
}

.login-container /deep/ .login-button {
  width: 100%; 
  background-color: rgb(19, 118, 218);
  height: 2rem;
  padding: 0;
  border-radius: 1rem;
  font-size: 0.84rem;
  line-height: 2rem;
}
.login-container .footer-scroll{
margin-bottom:1rem;
opacity: 1;
}
.login-container .footer-scroll /deep/ .el-scrollbar__thumb{
  background-color: rgb(19, 118, 218);
}
.login-container .login-footer {
  width: 100%;
  padding-bottom:1rem;
}

.login-container .login-footer .login-footer-container {
  width: 200%;
  height: 4rem;
  white-space: nowrap;
}
.login-container .login-footer .login-footer-container > li {
  list-style: none;
  float:left;
  width:12.5%;
}
.login-container .login-footer .login-footer-container > li a {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
;
}
.login-container .login-footer .login-footer-container > li img {
  width: 2.08rem;
  height: 2.08rem;
}
.login-container .login-footer .login-footer-container > li p {
  font-size: 0.56rem;
  font-family: "MicrosoftYaHei";
  line-height: 2rem;
  color: rgb(153, 153, 153);
}
</style>
