<template>
    <div class="csr-pagination-container-demo">
        <code >
            <p style="text-align:left;"><b>props:</b></p>
            <p class="p10" style="text-align:left;line-height: 22px;">
                pageSize:{type:Number,default:5,},//每页条数<br>
                layout:{type:String,default:"total,sizes,prev,pager,next,jumper"},<br>
                pagePosition:{type:String,default:'center'} //底部分页栏的位置  left|right|center<br> 
                url:'',//请求地址<br>
                params:{},//请求参数<br>
                height:0,<br>
                pageSizes:{type:Array,default:()=>{return [5,10,20,30,50]}},//条数选择器<br>
                reloadData:{type:Number,default:0},//是否从新刷新页面 1从第一页刷新 2刷新当前数据<br>
                multiOption:{boolean } //是否显示清空按钮
                使用的函数：<br>
                  ******  多选翻页缓存选项：methods:updateRecords(_records),传入当页选中的信息即可<span style="color:red;"> （仅限带多选钮使用） </span>********
            </p>
        </code>
        <CsrTableBox 
            :pageSize="5" 
            :pageSizes ="[5]"  
            :pagePosition="pagePosition" 
            :url ='postUrl' 
            :params="params" 
            @pageChanged="pageChangedCallback" 
            @dataChanged="dataChangedCallback" 
            @clearMultiOptions="clearMultiOptions"  
            :multiOption="true" 
            ref="tableDemo" 
            :height="300">
            <template v-slot:paginationContainer>
                <el-table 
                    :data="tableData" 
                    :min-height="200" 
                    :max-height="300" 
                    stripe 
                    @selection-change="handleSelectionChange" 
                    ref="multipleTable" 
                    @sort-change="sortChangeHandler">
                    <el-table-column type="selection" align="center" width="40"></el-table-column>
                    <el-table-column prop="roleinfoId" align="center" label="id(本页排序)" min-width="120" :sortable='true'></el-table-column>
                    <el-table-column prop="rolecode" align="center" label="rolecode(全排)" min-width="140" sortable="custom"></el-table-column>
                     
                    <el-table-column  align="center" label="rolename" max-width="180">
                        <template slot-scope='scope'>
                            <div class="text-ellipsis" >{{scope.row.rolename}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" align="center" label="remark" width="100"></el-table-column>
                    <el-table-column prop="rolestatus" align="center" label="rolestatus" width="150"></el-table-column>
                    <el-table-column  label="options" align="center" min-width="200">
                        <template slot-scope="scope">
                            <el-button>
                                详情
                            </el-button>
                            <el-button>
                                编辑
                            </el-button>
                        </template> 
                    </el-table-column>
                </el-table>
            </template>
        </CsrTableBox>
        
        <el-row type="flex" justify="center" class="pt20" style="align-items: center;">
                <div>页签对其方式：</div>
                <el-button @click.native.prevent="pagePosition='left,top'">左上</el-button>
                <el-button @click.native.prevent="pagePosition='center,top'">中上</el-button>
                <el-button @click.native.prevent="pagePosition='right,top'">右上</el-button>
                <el-button @click.native.prevent="pagePosition='left,bottom'">左下</el-button>
                <el-button @click.native.prevent="pagePosition='center,bottom'">中下</el-button>
                <el-button @click.native.prevent="pagePosition='right,bottom'">右下</el-button>
        </el-row>

        <el-row>
            <InfiniteList :nomore ="scrollnomore" :total ="scrollTableData.length">
                <template v-slot:scrollLst>
                    <el-table ref="InfiniteListData" :data="scrollTableData" tooltip-effect="dark" :nomore="scrollnomore" :header-cell-style="{background:'#f0f9eb',border:'2px solid inherit'}" border >
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column  prop="acccode" label="用户名" width=""></el-table-column>
                    </el-table>
                </template>
            </InfiniteList>
        </el-row>
    </div>
</template>
<script>
import CsrTableBox from '@/core/components/PaginationContainer'
import InfiniteList from '@/core/components/InfiniteList'
export default {
    components:{CsrTableBox,InfiniteList},
    data(){
        return{
            tableData:[
                {roleinfoId:'1',rolecode:'001',rolename:"市长市长市长市长市长市",remark:"xxxxxxx",rolestatus:"正常"},
                {roleinfoId:'3',rolecode:'001',rolename:"市长市长市长市长市长市",remark:"xxxxxxx",rolestatus:"正常"},
                {roleinfoId:'2',rolecode:'001',rolename:"市长",remark:"xxxxxxx",rolestatus:"正常"},
                {roleinfoId:'6',rolecode:'001',rolename:"市长",remark:"xxxxxxx",rolestatus:"正常"},
                {roleinfoId:'5',rolecode:'001',rolename:"市长",remark:"xxxxxxx",rolestatus:"正常"},
                {roleinfoId:'4',rolecode:'001',rolename:"市长",remark:"xxxxxxx",rolestatus:"正常"},
            ],
            postUrl:'',
            params:{
                rolecode: "",
                rolename: "",
                rolestatus: "",
            },
            multiOptions:[],
            pagePosition:'center,top',
            scrollTableData:[
                {acccode:"黎明"},
                {acccode:"黎明"},
                {acccode:"黎明"},
                {acccode:"黎明"},
                {acccode:"黎明"},
                {acccode:"黎明"},
                {acccode:"黎明"},
                {acccode:"黎明"},
                {acccode:"黎明"},
                {acccode:"黎明"},
            ],
            scrollnomore:false,
        }
    },
    methods:{
        pageChangedCallback(curPage){
            console.log(this.curPage,this.pageSize);
            
        },
        dataChangedCallback(data){
            console.log("PaginationContainerDemo---dataChangedCallback",data)
            // this.tableData = data.data.roleMList;
        },
        clearMultiOptions(){
            console.log('clearMultiOptions');
            this.$refs.multipleTable.clearSelection();
        },
        handleSelectionChange(val){
            this.multiOptions = val;
            this.$refs.tableDemo.updateRecords(val);
        },
        // return
        // {
        //     column,
        //     prop,
        //     order
        // }
        sortChangeHandler(obj){
            console.log('sortChangeHandler',obj);
            if(obj.column.sortable!='custom'){return;}
            obj.prop;//属性名称
            obj.order;//排序内容 descending accending null
            this.csrAlert.warning("向服务器发送参数"+obj.prop+",排序方式："+obj.order);
        },
        loadingMore(){
            console.log("demo loading more.....");
            this.scrollTableData.push({acccode:"xiao明"},{acccode:"xiao明"},{acccode:"xiao明"},{acccode:"xiao明"},{acccode:"xiao明"});
            this.countlist=this.scrollTableData.length;
            if(this.scrollTableData.length>50){
                this.scrollnomore = true;
            }
        }
    },
    mounted(){
        // this.postUrl = urlConfig.admin.permissionButtonLst;
        let url = '/loginStart.do';
        let idx0 = url.lastIndexOf('.');
        let idx1 = url.lastIndexOf('/');
        console.log(idx0,idx1);
        url = url.substr(idx1+1,idx0-idx1-1);
        console.log(url);
    }
}
</script>