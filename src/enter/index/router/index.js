import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const _import = require('@/_import_' + process.env.NODE_ENV)
export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'Login',
    //   component: _import('Login'),
    // },
    {
      path: '/Login',
      name: 'Login',
      component: _import('Login')
    },
    {
      path:'/mainCenter',
      name:'mainCenter',
      meta:{keepAlive:true,title:"联络中心"},
      component: _import('MainView')
    },
    {
      path:'/personalcenter',
      name:'personalcenter',
      meta:{keepAlive:false,title:"个人中心"},
      component: _import('PersonalCenter')
    },
    {
      path:'/admin/',
      name:'adminCenter',
      meta:{keepAlive:true,title:"管理中心"},
      // component:_import('AdminCenterMultiTab'),//多页签
      component:_import('AdminCenter'),//单页签
     },
    //  {
    //   path:'/skillgroup/',
    //   name:'skillGroup',
    //   component:_import('SkillGroup'),
    // },
    // {
    //   path:'/relSkillGroup/',
    //   name:'relSkillGroup',
    //   component:_import('RelSkillGroup'),
    // }
  ]
})
