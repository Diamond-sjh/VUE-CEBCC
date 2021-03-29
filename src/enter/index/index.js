// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './AppIndex.vue'
import router from './router'


import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './element-variables.scss'
Vue.use(Element)

import '@/core/assets/components.style.css'
//项目
import '@/assets/styles/theme.style.css'

import csrAlert from '@/core/utils/SwalAlert'
// 弹出框的封装调用
// import csrMessageAlert from '@/core/utils/MessageAlert' 
//所有的基本数据定义格式，包含了channel，面板弹出窗口的定义，
import constants from '@/utils/Constants'
//后台接口定义类
import urlConfigUtil from '@/utils/UrlConfig'
//图标库
import '../../assets/iconfont/iconfont.css'
//请求的封装
import MainAjax from '@/core/utils/MainAjax'
import '@/utils/Validate.js'
import store from '@/store';
import bus from  '@/core/utils/BusEvent.js';
import '@/utils/DebugConsole.js';

import csrSimplePhone from '@/core/phoneEvents/softPhoneEventsInterface';

Vue.config.productionTip = false;
Vue.prototype.csrAlert = csrAlert;
window.csrAlert = csrAlert;
// Vue.prototype.csrMessageAlert = csrMessageAlert;
// Vue.prototype.urlConfig = urlConfig;
Vue.prototype.$bus = bus;//事件总线
window.$busEvent = bus;
Vue.prototype.$MainAjax=MainAjax;
Vue.use(constants);
Vue.use(urlConfigUtil);
urlConfig.initUrl();
window.csrPhone = csrSimplePhone;
window.$permissionCode = '';//发送请求时候的接口code鉴权id
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
