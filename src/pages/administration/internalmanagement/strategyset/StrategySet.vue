<!-- 策略配置 -->
<template>
    <div>
        <div>
            <el-row style="text-align:right;">
                <el-button size="small" type="primary" plain @click="strategySetting">策略配置</el-button>
                <el-button size="small" type="primary" plain @click="strategyDelete">删除策略</el-button>
            </el-row>
            
            <el-tree :data="data4"  node-key="id" :expand-on-click-node="false" :props="defaultProps" :default-expanded-keys="[0]" @node-click='clickNodeList' :highlight-current='true'>
            </el-tree>
        </div>
        <el-dialog title="策略应用" :visible.sync="dialogVisible" width="60%" @close="closeDialog">
            <el-container>
        <el-form class="form" ref="form" :model="form" :rules="rules" label-width="200px" style="height:550px;overflow:auto;">
            <el-row style="margin-top:15px;">
                <el-col :span="11">
                    <el-form-item label="业务类型" prop="operationtype">
                        <el-select v-model="form.operationtype" style="width:100%" placeholder="请选择业务类型">
                            <el-option label="信用卡业务" value="1"></el-option>
                            <el-option label="综合业务" value="0"></el-option>
                            <el-option label="存贷合一" value="2"></el-option>
                            <el-option label="存贷合一与信用业务" value="21"></el-option>
                            <el-option label="存贷合一与综合业务" value="20"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="客户是否存在标志"  prop="extcustomersign">
                        <el-select v-model="form.extcustomersign" style="width:100%" placeholder="请选择客户是否存在标志">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="账户/卡片是否存在标志" prop="extcardsign">
                        <el-select v-model="form.extcardsign" style="width:100%" placeholder="请选择账户/卡片是否存在标志">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="副卡不允许操作标志" prop="extcardpermission">
                        <el-select v-model="form.extcardpermission" style="width:100%" placeholder="请选择副卡不允许操作标志">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="是否允许离线操作" prop="offlinesign">
                        <el-select v-model="form.offlinesign" style="width:100%" placeholder="请选择是否允许离线操作">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="需要身份验证标志" prop="verify">
                        <el-select v-model="form.verify" style="width:100%" placeholder="请选择需要身份验证标志">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="信用业务身份验证等级" prop="creditlevel">
                        <el-select v-model="form.creditlevel" style="width:100%" placeholder="请选择信用业务身份验证等级" @change="creditlevelfun">
                            <el-option label="未验证" value="0"></el-option>
                            <el-option label="一级" value="1"></el-option>
                            <el-option label="二级" value="2"></el-option>
                            <el-option label="三级" value="3"></el-option>
                            <el-option label="四级" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="认证方案" prop="creditmode">
                        <el-checkbox-group v-model="form.creditmode" class="text_left"  >
                            <el-checkbox  @change="creditmodefun(item)" v-model="item.checked" v-for="item in creditlevelList" :label="item.schemeId" name="creditmode" :key="item.schemeId">{{item.schemeName}}
                                <span v-if="item.checked" style="margin-left：15px;">验证方式：</span>
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="综合业务身份验证等级" prop="debitlevel">
                        <el-select v-model="form.debitlevel" style="width:100%" placeholder="请选择综合业务身份验证等级" @change="debitlevelfun">
                            <el-option label="未验证" value="0"></el-option>
                            <el-option label="一级" value="1"></el-option>
                            <el-option label="二级" value="2"></el-option>
                            <el-option label="三级" value="3"></el-option>
                            <el-option label="四级" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="认证方案" prop="debitmode">
                        <el-checkbox-group v-model="form.debitmode" class="text_left">
                            <el-checkbox @change="debitmodefun(item)"  v-for="item in debitlevelList" :label="item.schemeId" name="debitmode" :key="item.id">{{item.schemeName}}
                                <span v-if="item.checked" style="margin-left：15px;">验证方式：</span>
                            </el-checkbox>    
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="存贷合一身份验证等级" prop="dangerlevel">
                        <el-select v-model="form.dangerlevel" style="width:100%" placeholder="请选择存贷合一身份验证等级" @change="dangerlevelfun">
                            <el-option label="未验证" value="0"></el-option>
                            <el-option label="一级" value="1"></el-option>
                            <el-option label="二级" value="2"></el-option>
                            <el-option label="三级" value="3"></el-option>
                            <el-option label="四级" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="认证方案" prop="creditdebitmode">
                        <el-checkbox-group v-model="form.creditdebitmode" class="text_left">
                            <el-checkbox @change="creditdebitmodefun(item)"  v-for="item in dangerlevelList" :label="item.schemeId" name="creditdebitmode" :key="item.id">{{item.schemeName}}
                                <span v-if="item.checked" style="margin-left：15px;">验证方式：</span>
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="副卡操作需主卡验证" prop="masterverify">
                        <el-select v-model="form.masterverify" style="width:100%" placeholder="请选择副卡操作需主卡验证">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片不可操作状态" prop="cardstatus">
                        <el-input v-model="form.cardstatus" placeholder="请输入卡片不可操作状态"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片不可操作锁定码" prop="cardforbidblockcode">
                        <el-input v-model="form.cardforbidblockcode" placeholder="请输入卡片不可操作锁定码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片提示操作锁定码" prop="cardclewblockcode">
                        <el-input v-model="form.cardclewblockcode" placeholder="请输入卡片提示操作锁定码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="人民币账户不可操作锁定码1" prop="rmbaccforbidblockcode1">
                        <el-input v-model="form.rmbaccforbidblockcode1" placeholder="请输入人民币账户不可操作锁定码1"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="人民币账户不可操作锁定码2" prop="rmbaccforbidblockcode2">
                        <el-input v-model="form.rmbaccforbidblockcode2" placeholder="请输入人民币账户不可操作锁定码2"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="外币账户不可操作锁定码1" prop="dollaraccforbidblockcode1">
                        <el-input v-model="form.dollaraccforbidblockcode1" placeholder="请输入外币账户不可操作锁定码1"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="外币币账户不可操作锁定码2" prop="dollaraccforbidblockcode2">
                        <el-input v-model="form.dollaraccforbidblockcode2" placeholder="请输入外币币账户不可操作锁定码2"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="客户层信用额度" prop="customercreditlimit">
                        <el-input v-model="form.customercreditlimit" placeholder="请输入客户层信用额度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="人民币层信用额度" prop="rmbacccreditlimit">
                        <el-input v-model="form.rmbacccreditlimit" placeholder="请输入人民币层信用额度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="外币账户层信用额度" prop="dollaracccreditlimit">
                        <el-input v-model="form.dollaracccreditlimit" placeholder="请输入外币账户层信用额度"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="机构编号" prop="org">
                        <el-input v-model="form.org" placeholder="请输入机构编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="保证金卡片禁用标志" prop="secursign">
                        <el-select v-model="form.secursign" style="width:100%" placeholder="请选择保证金卡片禁用标志">
                            <el-option label="不允许" value="1"></el-option>
                            <el-option label="允许" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片性质" prop="cardspec">
                        <el-input v-model="form.cardspec" placeholder="请输入卡片性质"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片类型" prop="cardtype">
                        <el-input v-model="form.cardtype" placeholder="请输入卡片类型"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡片过期预警期限(月)" prop="cardexpiredate">
                        <el-input v-model="form.cardexpiredate" placeholder="请输入卡片过期预警期限"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="凭证类型" prop="warranttype">
                        <el-input v-model="form.warranttype" placeholder="请输入凭证类型"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="签约理财标志" prop="appointfinancesign">
                        <el-select v-model="form.appointfinancesign" style="width:100%" placeholder="请选择签约理财标志">
                            <el-option label="无需签约" value="0"></el-option>
                            <el-option label="需签约电话银行代客理财" value="1"></el-option>
                            <el-option label="需签约电话银行代客理财或令牌" value="2"></el-option>
                            <el-option label="令牌及签约手机号" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="签约电话标志" prop="appointphonesing">
                        <el-select v-model="form.appointphonesing" style="width:100%" placeholder="请选择签约电话标志">
                            <el-option label="无需签约" value="0"></el-option>
                            <el-option label="需签约" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="需要安全黑名单验证标志" prop="blackcustsign">
                        <el-select v-model="form.blackcustsign" style="width:100%" placeholder="请选择需要安全黑名单验证标志">
                            <el-option label="否" value="0"></el-option>
                            <el-option label="是" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡bin限制" prop="cardbinlimit">
                        <el-input v-model="form.cardbinlimit" placeholder="请输入卡bin限制"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="外围业务限制" prop="outbusilimit">
                        <el-select v-model="form.outbusilimit" style="width:100%" placeholder="请选择外围业务限制">
                            <el-option label="基金开通" value="0"></el-option>
                            <el-option label="外汇宝开通" value="2"></el-option>
                            <el-option label="第三方存管开通" value="12"></el-option>
                            <el-option label="贵金属开通" value="14"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="卡类型编号" prop="cardtypeid">
                        <el-input v-model="form.cardtypeid" placeholder="请输入卡类型编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="loge与企业loge" prop="cardlogo">
                        <el-input v-model="form.cardlogo" placeholder="请输入loge与企业loge"></el-input>
                    </el-form-item>
                    
                </el-col>
                <el-col :span="11">
                    <el-form-item label="币种" prop="operationcardtype">
                        <el-input v-model="form.operationcardtype" placeholder="请输入币种"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="无卡进线是否升二级" prop="inherentstate">
                        <el-select v-model="form.inherentstate" style="width:100%" placeholder="请输入无卡进线是否升二级">
                            <el-option label="自动升为2级" value="A"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        </el-container>
        <el-row>
            <el-col :span="24" style="text-align:center;">
                <el-button size="small" type="primary" plain @click="dialogVisible = false">关闭</el-button>
                <el-button size="small" type="primary" plain @click="adminaddSub('form')">确定</el-button> 
            </el-col>
        </el-row>
        </el-dialog>
    </div>
</template>
<script>
import MainAjax from "@/core/utils/MainAjax";
export default {
    data(){
        return{
            aaa:'',
            data4:[],
            defaultProps: {
                children: 'children',
                label: 'cname',
            },
            NodeList:[],
            dialogVisible:false,
            form:{
                operationtype:"",
                extcustomersign:"",
                extcardsign:"",
                extcardpermission:"",
                offlinesign:"",
                verify:"",
                creditlevel:"",
                creditmode:[],//信用业务身份验证等级fangan
                debitlevel:"",
                debitmode:[],//综合
                dangerlevel:"",
                creditdebitmode:[],//存贷合一
                masterverify:"",
                cardstatus:"",
                cardforbidblockcode:"",
                cardclewblockcode:"",
                rmbaccforbidblockcode1:"",
                rmbaccforbidblockcode2:"",
                dollaraccforbidblockcode1:"",
                dollaraccforbidblockcode2:"",
                customercreditlimit:"",
                rmbacccreditlimit:"",
                dollaracccreditlimit:"",
                org:"",
                secursign:"",
                cardspec:"",
                cardtype:"",
                cardexpiredate:"",
                warranttype:"",
                appointfinancesign:"",
                appointphonesing:"",
                blackcustsign:"",
                cardbinlimit:"",
                outbusilimit:"",
                cardtypeid:"",
                cardlogo:"",
                operationcardtype:"",
                inherentstate:"",
            },
            rules:{
                permName:[{required:true,message:'请输入权限名称',trigger:'blur'},{min:1,max:50,message:'最多输入50个字符',trigger:'blur'}],
                orderNo:[{required:true,message:'请输入序号',trigger:'blur'},{type:'number',message:'序号必须为数字'}],
            },
            creditlevelList:[],//信用业务身份验证等级fangan
            debitlevelList:[],//综合业务登记方案
            dangerlevelList:[],//存贷合一方案
            

        }
    },
    methods:{
        //权限树加载
        jurisdictionList(){
            MainAjax.doPost(urlConfig.admin.Strategy_permissionTreeList).then(req =>{
                if(req.retCode==this.$constants.returnCode.success){
                    if(req.permissionTreeData){
                        let data =[];
                        data.push(JSON.parse(req.permissionTreeData));  
                        data[0].cname="中国光大银行";
                        data[0].id=0;
                        this.data4=data;
                    }
                }else{
                    this.$message({
                        showClose: true,
                        message:req.retMsg,
                        type: 'warning'
                    });
                }
            });
        }, 
        //点击的数据
        clickNodeList(data){
            this.NodeList= data;
            console.log(data)   
        },
        //信用业务身份验证等级复选框的点击时
        creditmodefun(val){
            val.checked = !val.checked;
        },
        debitmodefun(val){
            val.checked = !val.checked;
            console.log(val)
        },
        creditdebitmodefun(val){
            val.checked = !val.checked;
        },

        //点击策略配置按钮（判断是新增还是修改；0新增 1修改）
        strategySetting(){
            if(this.NodeList.length==0){
                this.$message({
                    showClose: true,
                    message:"请选择一条数据",
                    type: 'warning'
                });
                return;
            }
            if(this.NodeList.flag=='0'){//新增
               this.dialogVisible=true; 
            }else{
                this.dialogVisible=true;
                this.strategySettingDetail();
            }   
        },
        //点击保存（判断是新增还是修改）
        adminaddSub(form){
            if(this.NodeList.flag=='0'){//新增
                this.strategyAdd(form);
            }else{
                this.strategyChange(form);
            }
        },
        closeDialog(){
            this.$nextTick(()=>{
                this.$refs.form.resetFields(); 
            }),
            this.creditlevelList=[];
            this.debitlevelList=[];
            this.dangerlevelList=[];
        },
        //新增保存
        strategyAdd(form){
            let data ={
                permissioninfoId:this.NodeList.id,
                operationtype:this.form.operationtype,
                extcustomersign:this.form.extcustomersign,
                extcardsign:this.form.extcardsign,
                extcardpermission:this.form.extcardpermission,
                offlinesign:this.form.offlinesign,
                verify:this.form.verify,
                creditlevel:this.form.creditlevel,
                creditmode:this.form.creditmode.toString(),
                debitlevel:this.form.debitlevel,
                debitmode:this.form.debitmode.toString(),
                dangerlevel:this.form.dangerlevel,
                creditdebitmode:this.form.creditdebitmode.toString(),
                masterverify:this.form.masterverify,
                cardstatus:this.form.cardstatus,
                cardforbidblockcode:this.form.cardforbidblockcode,
                cardclewblockcode:this.form.cardclewblockcode,
                rmbaccforbidblockcode1:this.form.rmbaccforbidblockcode1,
                rmbaccforbidblockcode2:this.form.rmbaccforbidblockcode2,
                dollaraccforbidblockcode1:this.form.dollaraccforbidblockcode1,
                dollaraccforbidblockcode2:this.form.dollaraccforbidblockcode2,
                customercreditlimit:this.form.customercreditlimit,
                rmbacccreditlimit:this.form.rmbacccreditlimit,
                dollaracccreditlimit:this.form.dollaracccreditlimit,
                org:this.form.org,
                secursign:this.form.secursign,
                cardspec:this.form.cardspec,
                cardtype:this.form.cardtype,
                cardexpiredate:this.form.cardexpiredate,
                warranttype:this.form.warranttype,
                appointfinancesign:this.form.appointfinancesign,
                appointphonesing:this.form.appointphonesing,
                blackcustsign:this.form.blackcustsign,
                cardbinlimit:this.form.cardbinlimit,
                outbusilimit:this.form.outbusilimit,
                cardtypeid:this.form.cardtypeid,
                cardlogo:this.form.cardlogo,
                operationcardtype:this.form.operationcardtype,
                inherentstate:this.form.inherentstate
            }
            MainAjax.doPost(urlConfig.admin.addStrategy,data).then(req=>{
                if(req.retCode==this.$constants.returnCode.success){
                    this.$emit('resultChange',{info:{
                        type: this.$constants.optionResultType.success,
                        content:this.NodeList.cname+"配置新增成功",
                    },flush:true});
                    this.dialogVisible=false;
                    this.jurisdictionList();
                }else{
                    this.$message({
                        showClose: true,
                        message:req.retMsg,
                        type: 'warning'
                    });
                }
            });
        },
        //修改保存
        strategyChange(form){
            let data ={
                permissioninfoId:this.NodeList.id,
                operationtype:this.form.operationtype,
                extcustomersign:this.form.extcustomersign,
                extcardsign:this.form.extcardsign,
                extcardpermission:this.form.extcardpermission,
                offlinesign:this.form.offlinesign,
                verify:this.form.verify,
                creditlevel:this.form.creditlevel,
                creditmode:this.form.creditmode.toString(),
                debitlevel:this.form.debitlevel,
                debitmode:this.form.debitmode.toString(),
                dangerlevel:this.form.dangerlevel,
                creditdebitmode:this.form.creditdebitmode.toString(),
                masterverify:this.form.masterverify,
                cardstatus:this.form.cardstatus,
                cardforbidblockcode:this.form.cardforbidblockcode,
                cardclewblockcode:this.form.cardclewblockcode,
                rmbaccforbidblockcode1:this.form.rmbaccforbidblockcode1,
                rmbaccforbidblockcode2:this.form.rmbaccforbidblockcode2,
                dollaraccforbidblockcode1:this.form.dollaraccforbidblockcode1,
                dollaraccforbidblockcode2:this.form.dollaraccforbidblockcode2,
                customercreditlimit:this.form.customercreditlimit,
                rmbacccreditlimit:this.form.rmbacccreditlimit,
                dollaracccreditlimit:this.form.dollaracccreditlimit,
                org:this.form.org,
                secursign:this.form.secursign,
                cardspec:this.form.cardspec,
                cardtype:this.form.cardtype,
                cardexpiredate:this.form.cardexpiredate,
                warranttype:this.form.warranttype,
                appointfinancesign:this.form.appointfinancesign,
                appointphonesing:this.form.appointphonesing,
                blackcustsign:this.form.blackcustsign,
                cardbinlimit:this.form.cardbinlimit,
                outbusilimit:this.form.outbusilimit,
                cardtypeid:this.form.cardtypeid,
                cardlogo:this.form.cardlogo,
                operationcardtype:this.form.operationcardtype,
                inherentstate:this.form.inherentstate
            }
            MainAjax.doPost(urlConfig.admin.saveStrategy,data).then(req=>{
                if(req.retCode==this.$constants.returnCode.success){
                    this.$emit('resultChange',{info:{
                        type: this.$constants.optionResultType.success,
                        content:this.NodeList.cname+"配置修改成功",
                    },flush:true});
                    this.dialogVisible=false;
                    this.jurisdictionList();
                }else{
                    this.$message({
                        showClose: true,
                        message:req.retMsg,
                        type: 'warning'
                    });
                }
            });
        },
        //删除配置
        strategyDelete(){
            if(this.NodeList.length==0){
                this.$message({
                    showClose: true,
                    message:"请选择一条记录",
                    type: 'warning'
                });  
                return;
            }
            let data={
               permissioninfoId:this.NodeList.id,
            }
            MainAjax.doPost(urlConfig.admin.delStrategy,data).then(req =>{
                if(req.retCode==this.$constants.returnCode.success){
                    this.$emit('resultChange',{info:{
                        type: this.$constants.optionResultType.success,
                        content:this.NodeList.cname+"配置删除成功",
                    },flush:true});

                    this.jurisdictionList();
                }else{
                    this.$message({
                        showClose: true,
                        message:req.retMsg,
                        type: 'warning'
                    });
                }
            });
        },
        //详情
        strategySettingDetail(){
            let data={
               permissioninfoId:this.NodeList.id,
            }
            MainAjax.doPost(urlConfig.admin.editStrategy,data).then(req =>{
                if(req.retCode==this.$constants.returnCode.success){
                   
                    //permissioninfoId:this.NodeList.id,
                    this.form.operationtype = req.operationtype;
                    this.form.extcustomersign = req.extcustomersign;
                    this.form.extcardsign = req.extcardsign;
                    this.form.extcardpermission = req.extcardpermission;
                    this.form.offlinesign = req.offlinesign;
                    this.form.verify = req.verify;
                    this.form.creditlevel = req.creditlevel;
                    this.form.creditmode = req.creditmode?req.creditmode.split(",") : [];
                    if(req.creditlevel){ this.creditlevelfun(this.form.creditmode); };
                    this.form.debitlevel = req.debitlevel;
                    this.form.debitmode = req.debitmode ? req.debitmode.split(",") : [];
                    if(req.debitlevel){ this.debitlevelfun(this.form.debitmode); };
                    this.form.dangerlevel = req.dangerlevel;
                    this.form.creditdebitmode = req.creditdebitmode?req.creditdebitmode.split(",") : [];
                    if(req.dangerlevel){ this.dangerlevelfun(this.form.creditdebitmode); };
                    this.form.masterverify = req.masterverify;
                    this.form.cardstatus = req.cardstatus;
                    this.form.cardforbidblockcode = req.cardforbidblockcode;
                    this.form.cardclewblockcode = req.cardclewblockcode;
                    this.form.rmbaccforbidblockcode1 = req.rmbaccforbidblockcode1;
                    this.form.rmbaccforbidblockcode2 = req.rmbaccforbidblockcode2;
                    this.form.dollaraccforbidblockcode1 = req.dollaraccforbidblockcode1;
                    this.form.dollaraccforbidblockcode2 = req.dollaraccforbidblockcode2;
                    this.form.customercreditlimit = req.customercreditlimit;
                    this.form.rmbacccreditlimit = req.rmbacccreditlimit;
                    this.form.dollaracccreditlimit = req.dollaracccreditlimit;
                    this.form.org = req.org;
                    this.form.secursign = req.secursign;
                    this.form.cardspec = req.cardspec;
                    this.form.cardtype = req.cardtype;
                    this.form.cardexpiredate = req.cardexpiredate;
                    this.form.warranttype = req.warranttype;
                    this.form.appointfinancesign = req.appointfinancesign;
                    this.form.appointphonesing = req.appointphonesing;
                    this.form.blackcustsign = req.blackcustsign;
                    this.form.cardbinlimit = req.cardbinlimit;
                    this.form.outbusilimit = req.outbusilimit;
                    this.form.cardtypeid = req.cardtypeid;
                    this.form.cardlogo = req.cardlogo;
                    this.form.operationcardtype = req.operationcardtype;
                    this.form.inherentstate = req.inherentstate;
                    
                }else{
                    this.$message({
                        showClose: true,
                        message:req.retMsg,
                        type: 'warning'
                    });
                }
            });
        },
        //信用业务身份验证等级
        creditlevelfun(val){
            let data={
                schemeName:"",
                businessType:'0',
                verifyLevel:this.form.creditlevel,
                turnPageBeginPos: 1,
                turnPageShowNum: 100
            }
            MainAjax.doPost(urlConfig.admin.schemeQueryData,data).then(req =>{
                if(req.retCode==this.$constants.returnCode.success){
                    this.creditlevelList = req.schemeList;
                    this.creditlevelList.forEach(it=>{
                        for(var i=0;i<val.length;i++){
                            if(it.schemeId==val[i]){
                                it.checked = true;
                                return;
                            }else{
                                it.checked = false;
                            }
                        }   
                    });
                }else{
                    this.$message({
                        showClose: true,
                        message:req.retMsg,
                        type: 'warning'
                    });
                }
            });
        },
        //综合业务身份验证等级
        debitlevelfun(val){
            let data={
                schemeName:"",
                businessType:'1',
                verifyLevel:this.form.debitlevel,
                turnPageBeginPos: 1,
                turnPageShowNum: 100
            }
            MainAjax.doPost(urlConfig.admin.schemeQueryData,data).then(req =>{
                if(req.retCode==this.$constants.returnCode.success){
                    this.debitlevelList = req.schemeList;
                    this.debitlevelList.forEach(it=>{
                        for(var i=0;i<val.length;i++){
                            if(it.schemeId==val[i]){
                                it.checked = true;
                                return;
                            }else{
                                it.checked = false;
                            }
                        }
                    });
                }else{
                    this.$message({
                        showClose: true,
                        message:req.retMsg,
                        type: 'warning'
                    });
                }
            });
        },
        //存贷合一身份验证等级
        dangerlevelfun(val){
            let data={
                schemeName:"",
                businessType:'2',
                verifyLevel:this.form.dangerlevel,
                turnPageBeginPos: 1,
                turnPageShowNum: 100
            }
            MainAjax.doPost(urlConfig.admin.schemeQueryData,data).then(req =>{
                if(req.retCode==this.$constants.returnCode.success){
                    this.dangerlevelList = req.schemeList;
                    this.dangerlevelList.forEach(it=>{
                        for(var i=0;i<val.length;i++){
                            if(it.schemeId==val[i]){
                                it.checked = true;
                                return;
                            }else{
                                it.checked = false;
                            }
                        }
                    });
                }else{
                    this.$message({
                        showClose: true,
                        message:req.retMsg,
                        type: 'warning'
                    });
                }
            });
        },

    },
    mounted(){
        this.jurisdictionList();
        
    },
}
</script>
<style scoped>

</style>