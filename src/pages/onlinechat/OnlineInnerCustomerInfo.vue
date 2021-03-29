<template>
    <!-- 右侧的用户信息，类似于语音客服的左侧样式 -->
    <div class="right-customer-info">
        <el-scrollbar :native="false" wrapStyle="width:280px;" viewStyle="width:280px;overflow-x:hidden;height:100%;" wrapClass="" viewClass="" :noresize="false" tag="div">
            <CustomerBaseInfo ref="customerBaseInfo"></CustomerBaseInfo>
            <CustomerRemarkHistory></CustomerRemarkHistory>
            <CustomerOrderHistory></CustomerOrderHistory>
            <div class="behavior">
                <h5><a></a>猜你想问</h5>
                <span>客户可能想办的业务</span>
                <el-button type="primary" plain size="mini">资产查询</el-button>
                <el-button type="primary" plain size="mini">转账</el-button>
            </div>
        </el-scrollbar>
    </div>
</template>
<script>
import CustomerBaseInfo from '@/pages/main/leftcustomer/CustomerBaseInfo';
import CustomerOrderHistory from '@/pages/main/leftcustomer/CustomerOrderHistory';
import CustomerRemarkHistory from '@/pages/main/leftcustomer/CustomerRemarkHistory';
export default {
    components:{CustomerBaseInfo,
    CustomerOrderHistory,CustomerRemarkHistory},
    data(){
        return{
        }
    },
    methods:{

        updateView(data){
            console.log("LeftCustomerInfo.updateView()");
            this.$refs.customerBaseInfo.setData();
        }
    },
    beforeDestroy(){
        
    }
    
}
</script>