<template>
    <!-- ivr历史详情列表 时间，节点名称，办理结果-->
    <div class="ivr-history-info-panel">
        <table class="table-public table-public-border ">
            <thead>
                <tr>
                    <th>时间</th><th>节点名称</th><th>办理结果</th>
                </tr>
            </thead> 
            <tbody>
                <tr v-for="it in ivrLst">
                    <td>{{it.date}}</td>
                    <td>{{it.name}}</td>
                    <td>{{it.state}}</td>
                </tr>
            </tbody>  
        </table>
    </div>
</template>
<script>
export default {
    data(){
        return{
            ivrLst:[
                {date:"2019-09-09 10:10:10",name:"账单查询",state:1},
                {date:"2019-09-09 10:10:10",name:"业务说明",state:1},
                {date:"2019-09-09 10:10:10",name:"人工客服",state:1},
            ],
        }
    },
    mounted(){
         this.$emit('childInit',{
            width:300,//宽度
            height:400,//高度
            label:"进线轨迹",//title
            position:{x:"350px",y:"100px"},//位置
            mask:false,//蒙层
            
        });
    }
}
</script>
