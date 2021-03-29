<template>
    <div class="test-bootstrap-alert-container">
        <div>
            <p class="form-title">form表单验证</p>
            <FormDemo></FormDemo>
        </div>
        <div>
            <p class="form-title">buttons</p>
            <ButtonsDemo></ButtonsDemo>
        </div>
        <div>
            <p class="form-title">分页容器</p>
             <TableBoxDemo></TableBoxDemo>
        </div>
        <div>
            <p class="form-title">csr分页组件</p>
            <CsrPagination 
            @pageChanged="csrPageChanged" 
            :totalRows='50' 
            :initPage="3" 
            :perPageRecords="5">
            </CsrPagination>
        </div>
        <div class="sweet-alert-container">
            <p class="form-title">sweet弹出框</p>
            <el-button @click="testUrlConfig" type="primary">urlConfig</el-button>
            <el-button @click="showSwalAlert" type="warning">Show success alert</el-button>
            <el-button @click="showErrorAlert" type="info">Show error alert</el-button>
            <el-button @click="showConfirmAlert" type="danger" plain>Show confirm alert</el-button>
        </div>
        <div>
            <p class="form-title">panel功能弹出框</p>
            <el-button @click="openPopup1" plain>重要信息弹出窗</el-button>
            <el-button @click="openPopup" round>测试弹出窗</el-button>
        </div>
    </div>
</template>

<script>
import CsrPagination from '@/core/components/Pagination'
import TableBoxDemo from '@/pages/demos/PaginationContainerDemo'
import FormDemo from  '@/pages/demos/FormDemo'
import ButtonsDemo from  '@/pages/demos/ButtonsDemo'
import DateTimePickerDemo from '@/pages/demos/DateTimePickerDemo'
    export default {
        components:{
            CsrPagination,
            FormDemo,
            DateTimePickerDemo,
            ButtonsDemo,
            TableBoxDemo,
        },
        data() {
            return {
                dismissSecs: 10,
                dismissCountDown: 0,
                showDismissibleAlert: false,
                status: 'not_accepted',
               
            }
        },
        methods: {
            showSwalAlert(){
                // swal("hello world");
                this.csrAlert.success("hello world");
            },
           
            showErrorAlert(){
                this.csrAlert.error("this is an error",'sss');
            },
            testUrlConfig(){
                let url = this.urlConfig.test.testhttp;
                // this.csrAlert.success(url);
                this.$MainAjax.doPost(this.urlConfig.test.testhttp,{},1).then((data)=>{

                });
            },
            showConfirmAlert(){
                this.csrAlert.confirm({
                    showCancelButton:true,
                    title:"确定要取消么？",
                    text:"请确认"
                }).then(res=>{
                    if(res){
                        console.log(" click sure btn")
                    }else{
                        console.log('click cancel btn')
                    }
                });
            },
            openPopup(){
                this.$popUpManager.openUI(this.$constants.uiPanel.TEST_PANEL,{});
            },
            openPopup1(){
                this.$popUpManager.openUI(this.$constants.uiPanel.CUSTOMER_IMPORTANT_INFO_PANEL,{});
            },
            csrPageChanged(_curPage){
                console.log("csr pagination curPage",_curPage);
            }
        }
    }
</script>

<style  scoped>
    .test-bootstrap-alert-container{
        padding:10px;
        text-align:left;
        padding: 15px;
    }
    .test-bootstrap-alert-container .form-title{
        margin: 0;
        margin-top: 15px;
        padding: 5px 0;
        color: black;
        font-weight: 700;
        font-size: 25px;
    }
</style>
