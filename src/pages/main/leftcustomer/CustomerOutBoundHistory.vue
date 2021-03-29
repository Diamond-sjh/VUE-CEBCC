<template>
    <!-- 外乎历史 生成时间，活动类型，任务状态-->
    <div class="customer-outbound-history">
        <table class="table-public mini text-center">
            <thead>
                <tr>
                    <th class="date-time-width-f12">生成时间</th>
                    <th class="width3">活动类型</th>
                    <th class="width3">任务状态</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in tempLst">
                    <td class="txtcolor-999999">{{item.data}}</td>
                    <td class="txtcolor-666666">{{item.type}}</td>
                    <td><span>{{item.state==1?'已完成':'未完成'}}</span></td>
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
            // console.log('CustomerOutBoundHistory.resetView()');
        },
        setView(data){
            this.tempLst = [
                {data:"2019-09-27 10:10:10",type:"中秋赏月",state:0},
                {data:"2019-09-27 10:10:10",type:"中秋赏月",state:1},
                {data:"2019-09-27 10:10:10",type:"中秋赏月",state:1},
                {data:"2019-09-27 10:10:10",type:"中秋赏月",state:1},
            ];
        }
    },
}
</script>