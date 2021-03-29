<template>
    <!--用户服务历史 -->
    <div class="customer-order-history work-order">
        <table class="table-public mini text-center">
            <thead>
                <tr>
                    <th class="date-time-width-f12">生成时间</th>
                    <th>名称</th>
                    <th class="width1">处理状态</th>
                    <th class="width-mini">催办次数</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in workOrderLst">
                    <td class="txtcolor-999999">{{item.data}}</td>
                    <td class="txtcolor-666666">{{item.info}}</td>
                    <td><span :class="item.state==1?'complete_yes':'complete_no'" >{{item.state==1?'已完成':'未完成'}}</span></td>
                    <td>{{item.num}}</td>
                </tr>   
            </tbody>
            <!-- <li v-for="item in tempRemarks" class="fz12"><span >{{item.data}}</span><span>{{item.name}}</span><span>{{item.info}}</span></li> -->
        </table>
        <!-- <ul>
            <li v-for="item in tempWorkOrderLst">
                <span class="txtcolor-999999">{{item.data}}</span>
                <span class="txtcolor-666666">{{item.info}}</span>
                <span :class="item.state==1?'complete_yes':'complete_no'" >{{item.state==1?'已完成':'未完成'}}</span>
            </li>
        </ul> -->
    </div>
</template>
<script>
export default {
    data(){
        return{
            //工单生成时间，工单名称，处理状态，催办次数
            workOrderLst:[],
        }
    },
    methods:{
        resetView(){
            this.workOrderLst = [];
            // console.log('CustomerOrderHistory.resetView()');
        },
        setView(){
            this.workOrderLst = [
                {info:"电子渠道",data:"2019-04-14 00:00:00",state:"1",num:"10"},
                {info:"营销助手",data:"2019-04-14 00:00:00",state:"2",num:"14"},
            ]
        }
    },
    mounted(){
       
    }
}
</script>
<style scoped>
    .work-order{
        /* margin-top: 15px; */
    }
    .work-order ul li{
        font-size: 14px;
        list-style:none;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;        
    }
    .work-order ul li span{
        margin: 0px 10px;
        max-width: 100px;
    }
    .work-order ul li .complete_yes{
        color: pink;
    }
    .work-order ul li .complete_no{
        color:green;
    }
</style>

