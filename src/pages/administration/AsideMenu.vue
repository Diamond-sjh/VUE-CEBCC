<template>
  <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" class="tree_height"></el-tree>
</template>
<script>
import { mapGetters } from 'vuex';
  export default {
    computed:{
      ...mapGetters(['getAgentAdminMenu']),
    },
    methods: {
      //点击菜单路由跳转
      handleNodeClick(data,node) {
        // console.log(data,node);
        if(node.data.menus && node.data.menus.length>0){
          return;
        }
        if(node.data.url==null || "" || undefined) return;
        let url = node.data.url;
        if(node.parent.data.url){
          url = node.parent.data.url +'/'+url;
        }else{
          
        }
        this.$emit("openAdminTab",{
          cname:data.cname,
          id:data.id,
          url:url,
          name:data.name,
          code:data.code,
          // buttons:node.data.buttons,
        });
      },
      getCheckedNodes() {
        console.log(this.$refs.tree.getCheckedNodes());
      },
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
      },
      setCheckedNodes() {
        this.$refs.tree.setCheckedNodes([{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 9,
          label: '三级 1-1-1'
        }]);
      },
      setCheckedKeys() {
        this.$refs.tree.setCheckedKeys([3]);
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    data() {
      return {
        data: [],
        defaultProps:{
          children:'menus',
          label:'cname',
        }
      };
    },
    mounted(){
      this.data = this.getAgentAdminMenu.menus;
      // console.log(this.getAgentAdminMenu.menus);
    }
  };
</script>
<style scoped>
  .tree_height{
    height: 100%;
  }
</style>

