<template>
    <!-- 服务历史 服务时间，服务名称，sap号 -->
    <div class="customer-service-history">
        <table class="table-public mini text-center">
            <thead>
                <tr>
                    <th class="date-time-width-f12">服务时间</th>
                    <th class="width4">服务名称</th>
                    <th class="width3">sap号</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in tempLst">
                    <td >{{item.data}}</td>
                    <td >{{item.name}}</td>
                    <td>{{item.sap}}</td>
                </tr>   
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    data(){
        return{
            tempLst:[],
        }
    },
    methods:{
        resetView(){
            this.tempLst = [];
            // console.log('CustomerServiceHistory.resetView()');
        },
        setView(data){
            this.tempLst = [{data:"2019-09-30",name:"xxxxxx",sap:"000012"},
                {data:"2019-09-30",name:"xxxxxx",sap:"000012"},
            ];
        }
    }
}
</script>