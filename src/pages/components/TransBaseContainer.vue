<script>
import TransBaseView from '@/pages/components/TransBaseView'
export default {
    components:{TransBaseView},
    props:{
        customer:{type:Object,default:()=>{}},
        menu:{type:Object,default:()=>{}},
        keepAlive:{type:Boolean,default:false,}
    },
    data(){
        return{
            curMenu:null,//当前开启的菜单页面，初始为传入值，后期页面不同可变化
        }
    },
    methods:{
        beforeClose(index){
            console.log('transbaseview.beforeClose()')
            if(this.$refs.transBaseView && this.$refs.transBaseView.beforeClose){
                this.$refs.transBaseView.beforeClose(index);
            }else{
                this.closeTrans(index);
            }
        },
        closeTrans(index){
            console.log('TransBaseContainer.closeTrans(index):'+index);
            this.$emit('close',index);
        },
    },
    mounted(){
    },
    created(){
        this.curMenu = this.menu;
    },
    render(h){
        return(
            <div class="trans-base-container">
                {!this.keepAlive &&  <TransBaseView customer={this.customer} menu={this.curMenu}  ref="transBaseView"></TransBaseView>}
                <keep-alive>
                    {this.keepAlive && <TransBaseView customer={this.customer} menu={this.curMenu} ref="transBaseView"></TransBaseView>}
                </keep-alive>
            </div>        
        );
    }
}
</script>
