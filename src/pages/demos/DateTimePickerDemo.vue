<template>
    <div class="block">
        <span class="demonstration">默认</span>
        <el-date-picker
        v-model="value1"
        type="month"
        placeholder="选择日期">
        </el-date-picker>
         <span class="demonstration">带快捷选项</span>
        <el-date-picker
            v-model="value2"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
        </el-date-picker>
        <span>直接显示日历</span>
        <date-table
            :date="date"
            :selected-day="realSelectedDay"
            :first-day-of-week="realFirstDayOfWeek"
        @pick="pickDay" />
    </div>
    <!-- <div class="block">
       
    </div> -->
</template>

<script>
import DateTable from 'element-ui/packages/calendar/src/date-table';
    export default {
        components:{DateTable},
        methods:{
            pickDay(){

            }
        },
        data() {
            return {
                pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
                },
                value1: '',
                value2: '',
                date:new Date(),
                realSelectedDay:"",
                realFirstDayOfWeek:0,
            };
        },
        mounted(){
            //带初始时间的
            this.value1 = new Date();
        }
    };
</script>