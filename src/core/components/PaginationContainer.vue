<template>
    <div class="csr-pagination-container" style="width:100%;">
        <slot name="paginationContainer"></slot>
        <el-row class="csr-pagination"  :class="[pagePosition]">
            <el-pagination 
                ref="csrPagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="curPage"
                :page-sizes="pageSizes"
                :page-size="curPageSize"
                :total="totalRows" 
                :layout="curlayOut" 
                :reloadData='reloadData'
                :multiOption='multiOption'>
            </el-pagination>
            <el-button type="primary" @click="btnOptClearClick" v-if="multiOption">清空选项</el-button>
        </el-row>
    </div>
</template>

<script>
export default {
    props:{
        //每页条数
        pageSize:{type:Number,default:5,},
        layout:{type:String,default:"total,sizes,prev,pager,next,jumper"},
        pagePosition:{type:String,default:'center'},//底部分页栏的位置  left|right|center
        url:'',//请求地址
        params:{},//请求参数
        height:[Number,String],
        //条数选择器
        pageSizes:{type:Array,default:()=>{return [5,10,20,30,50]}},
        //是否从新刷新页面
        reloadData:{type:Number,default:0},
        multiOption:[Boolean],
    },
    watch:{
        reloadData(){
            if(this.reloadData ==1){
                this.curPage = 1;
                this.totalRows = 0;
                this.curPageSize =  this.pageSize;  
                this.fetchData();
            }else if(this.reloadData ==2){
                this.fetchData();
            }
        },
    },
    data(){
        return{
            curPage:1,
            totalRows:0,
            curPageSize:5,
            recordDatas:{},//记录选中过的所有内容
            curlayOut:'',
        }
    },
    methods:{
        //更新缓存选中的信息内容
        updateRecords(records){
            let startIdx = (this.curPage-1) * this.curPageSize;
            this.recordDatas[this.curPage] = records;
            //console.log("paginationContainer-----updateRecords",this.recordDatas);
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条当前页: ${this.curPage}`);
            this.curPageSize = val;
            // this.$emit('pageChanged',this.curPage);
            this.fetchData();
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.curPage = val;
            let startIdx = (this.curPage - 1)*this.curPageSize;
            this.recordDatas
            // this.$emit('pageChanged',this.curPage);
            this.fetchData();
        },
        fetchData(){
            //分页参数，应该统一携带才对
            if(!this.url){
                return;
            }
            let param = {
                turnPageBeginPos:(this.curPage-1)*this.curPageSize + 1,//开始条数
                turnPageShowNum:this.curPageSize,//每页条数
            }
            Object.assign(param,this.params);
            // console.log('PaginationContainer-----fetchData',param);
            // return;
            this.$MainAjax.doPost(this.url,param).then((req)=>{
                //console.log(req);
                this.totalRows = req?parseInt(req.turnPageTotalNum):0;
                //console.log(this.totalRows);
                this.$emit('dataChanged',req);
            });
            this.$emit('update:reloadData',0);
        },
        //清空选项
        btnOptClearClick(){
            this.recordDatas = {};
            this.$emit('clearMultiOptions');
        },
    },
    mounted(){
        this.curPageSize = this.pageSize;
        console.log(this.$el.offsetHeight,this.height);
        this.$el.style.height = (parseInt(this.height) + parseInt(this.$el.offsetHeight)+50)+'px';
        //console.log(this.$el.style.height);
        if(this.pageSizes.length<2){
            this.curlayOut = "total,prev,pager,next,jumper";
        }else{
            this.curlayOut = this.layout;
        }  
    },
    // render(h){
    //     let {
    //         pagePosition,
    //         handleSizeChange,
    //         handleCurrentChange,
    //         curPage,pageSize,pageSizes,curPageSize,totalRows,
    //         curlayOut,reloadData,multiOption,
    //         btnOptClearClick
    //     } = this;
    //     let positions = pagePosition.split(',');
    //     let rlPosition = positions &&positions[0]? positions[0]:'';
    //     let tbPosition = positions && positions[1]? positions[1]:'';

    //     const header = (<section>{this.$slots.paginationContainer}</section>);
    //     const btnClear = multiOption ? <el-button type="primary" click={btnOptClearClick} >清空选项</el-button>:null;
    //     const content = (
    //         <el-row class={['csr-pagination',rlPosition]}>
    //             <el-pagination 
    //                 ref="csrPagination"
    //                 size-change={handleSizeChange}
    //                 current-change={this.handleCurrentChange}
    //                 current-page={curPage}
    //                 page-sizes={pageSizes}
    //                 page-size={curPageSize}
    //                 total={totalRows} 
    //                 layout={curlayOut} 
    //                 reloadData={reloadData}
    //                 multiOption={multiOption}>
    //             </el-pagination>
    //         </el-row>
    //     );
    //     return (
    //         <div class="csr-pagination-container" style="width:100%;">
    //             { tbPosition !=='top' ? [header,content] :[content,header] }
    //         </div>
    //     );
    // }
}
</script>
