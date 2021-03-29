<template>
    <!-- 智能辅助 通话中的用户只能有一个，信息为电话通话的用户信息内容，文字客服可以多开，但只显示通话客户的信息-->
    <div class="intelligent-assistance">
        智能辅助 ~~||
        <el-row type="flex" justify="center">
            <el-button size="mini" @click="$emit('close')">关闭</el-button>
        </el-row>
        <el-tabs>
            <el-tab-pane label="流程监控">
            </el-tab-pane>            
            <el-tab-pane label="历史记录查询">
                <div class="history-container">
                    <div class="history-conversation">
                        <div class="title">语音转文字</div>
                        <div class="content-wrapper">
                            <div><span>座席：</span><span>请问您的身份证号码多少？</span></div>
                            <div><span>座席：</span><span>请问您的身份证号码多少？</span></div>
                            <div><span>座席：</span><span>请问您的身份证号码多少？</span></div>
                            <div><span>座席：</span><span>请问您的身份证号码多少？</span></div>
                        </div>
                    </div>
                    <div class="sensitive-info">
                        <!-- 坐席的敏感信息 -->
                        <div class="title">敏感信息</div>
                        <div class="sensitive-info-item" v-for="it in sensiveInfoLst">
                            <span>{{it.label}}: </span><span>{{it.val}}</span>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import  '@/utils/PalIntelligentInterFace.js'
export default {
    data(){
        return{
            sensiveInfoLst:[
                {label:"客户情绪",val:"中性",key:""},
                {label:"用户情绪",val:"紧张"},
                {label:"语速",val:"340字/分",key:'speed'},
                {label:"座席强化",val:"发现"},
            ],
            
        }
    },
    beforeDestroy(){
        window.palIntelligentSys.realTimeCheckerStop();
    },
    mounted(){
        //初始化实时质检系统
        window.palIntelligentSys.sysInit();
        window.palIntelligentSys.signin({
            username: 'paladmin@zhxyk.com',
            password: 'paladmin777'
        })
        .then(req=>{
            window.palIntelligentSys.realTimeCheckerStart();
        });
    }
}
</script>
<style scoped>
.intelligent-assistance{
    background-color: white;
    height: 100%;
    width: 100%;
    overflow: hidden;
    padding: 10px;
}
.intelligent-assistance .history-container{
    display: flex;
    flex-flow: row nowrap;
}
.intelligent-assistance .history-container .title{
    font: 700;
    font-size: 16px;
    padding: 5px 10px;
    background-color: bisque;
}
.intelligent-assistance .history-conversation, .intelligent-assistance .sensitive-info{
    width: 50%;
    font-size: 12px;
    
}
.intelligent-assistance .sensitive-info .sensitive-info-item{
   margin: 5px ;
}
</style>
