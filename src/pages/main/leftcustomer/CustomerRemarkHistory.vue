<template>
    <!-- 客户备注历史信息 -->
    <div class="customer-remark-history">
        <table class="table-public mini text-center">
            <thead>
                <tr>
                    <th class="date-time-width-f12">备注时间</th>
                    <th class="width3">sap号</th>
                     <!-- class="mark-content" -->
                    <th>内容</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in remarks">
                    <td>{{item.data}}</td>
                    <td>{{item.name}}</td>
                    <td><span class="mark-content">{{item.info}}</span></td>
                </tr>   
            </tbody>
            <!-- <li v-for="item in tempRemarks" class="fz12"><span >{{item.data}}</span><span>{{item.name}}</span><span>{{item.info}}</span></li> -->
        </table>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //备注历史 备注时间 ，备注人sap号 ，备注内容
            remarks:[],
        }
    },
    methods:{
        resetView(){
            this.remarks =[];
            // console.log('CustomerRemarkHistory.resetView()');
        },
        setView(data){
            this.remarks=[ {data:"2019-04-14 10:00:00",name:"123456",info:"客户注册账户未成功"},
                {data:"2019-04-14 10:00:00",name:"654321",info:"客户注册账户未成功"},
                {data:"2019-04-14 10:00:00",name:"112121",info:"客户注册账户未成功"},
                {data:"2019-04-14 10:00:00",name:"039348",info:"客户注册账户未成功"},];
        }
    },
    mounted(){
    }
}
</script>
<style scoped>
.customer-remark-history .mark-content{
    display:block;
    width:60px;
    line-height: 12px;
    height:12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>
