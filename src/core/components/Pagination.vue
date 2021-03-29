<template>
    <div class="overflow-auto csr-pagination">
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="curPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="perPageRecords"
                :layout="layout"
                :total="totalRows">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            totalRows:{
                type:Number,
                default:1,
            },
            //每页条数
            perPageRecords:{
                type:Number,
                default:5,
            },
            //初始页数
            initPage:{
                type:Number,
                default:1,
            },
            layout:'total, sizes, prev, next, pager, jumper'
        },
        data() {
            return {
                curPage:1,
            }
        },
        methods:{
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条当前页: ${this.curPage}`);
                this.$emit('pageChanged',{curPage:this.curPage});
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.curPage = val;
                this.$emit('pageChanged',{curPage:this.curPage});
            }
        },
        mounted(){
           
        }
    }
</script>