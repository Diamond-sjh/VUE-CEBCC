<template>
    <!-- 来电历史  表格：来电时间，卡号-->
    <div class="customer-phone-call-history">
        <table class="table-public mini text-center">
            <thead>
                <tr>
                    <th class="date-time-width-f12">来电时间</th>
                    <th>卡号</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in tempLst">
                    <td >{{item.data}}</td>
                    <td >{{item.cardNo}}</td>
                </tr>   
            </tbody>
        </table>    
    </div>
</template>
<script>
export default {
    data(){
        return {
            tempLst:[],
        }
    },
    methods:{
        resetView(){
            this.tempLst = [];
            // console.log('CustomerPhoneCallHistory.resetView()');
        },
        setView(data){
            this.tempLst = [
                {data:"2019-10-10 12:01:05",cardNo:"62010059291711092"},
                {data:"2019-10-10 12:01:05",cardNo:"62010059291711092"},
            ];
        }
    }
}
</script>