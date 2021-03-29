import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const _import = require('@/_import_' + process.env.NODE_ENV)
//const add =require('@/pages/administration/add')
export default new Router({
  routes: [
    // {
    //   path: '/admin.html',
    //   name: 'admin',
    //   component:_import("AdminCenter"),
    //   meta: { title: '后台管理系统' }
    // },
    {
      path: '/',
      name: 'administration',
      component:_import("administration/Administration"),
      meta: { title: '后台管理系统' }
    },
  ]
})
