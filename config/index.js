'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const glob = require('glob')
var build = {
  env: require('./prod.env'),
  // Template for index.html
  // index: path.resolve(__dirname, '../../dist/index.html'),
  // impage: path.resolve(__dirname, '../../dist/impage.html'),
  // Paths
  assetsRoot: path.resolve(__dirname, '../../dist'),
  assetsSubDirectory: 'static',
  assetsPublicPath: './',

  /**
   * Source Maps  去掉打包后端map文件  李安东修改
   */

  productionSourceMap: false,
  // https://webpack.js.org/configuration/devtool/#production
  devtool: '#source-map',

  // Gzip off by default as many popular static hosts such as
  // Surge or Netlify already gzip all static assets for you.
  // Before setting to `true`, make sure to:
  // npm install --save-dev compression-webpack-plugin
  productionGzip: false,
  productionGzipExtensions: ['js', 'css'],

  // Run the build command with an extra argument to
  // View the bundle analyzer report after build finishes:
  // `npm run build --report`
  // Set to `true` or `false` to always turn it on or off
  bundleAnalyzerReport: process.env.npm_config_report
}
var pages = getEntry('src/pages/enter/**/*.html');
for (var pathname in pages){
  build[pathname] = path.resolve(__dirname, '../../dist/' + pathname + '.html')
}
function getEntry(globPath){
  var entries = {},basename;
  glob.sync(globPath).forEach(function(entry){
    basename = path.basename(entry, path.extname(entry));
    entries[basename] = entry;
  });
  return entries;
}
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/':{
      //   target: 'http://10.1.118.107:8086',//http://cebcc.security:8090 陈杰星
      //   //target: 'http://10.1.118.125:8086',//http://cebcc.security:8090 卢帅印
      //    //target:   'http://10.1.118.139:8086', //'http://10.1.118.115:8086',//'http://10.1.118.115:8086/swagger-ui.html' 张雨
      //   //  target: 'http://10.1.118.135:8086',//http://cebcc.security:8090 安梦倩
      //   target: 'http://127.0.0.1:81',
      //   changeOrigin:true,
      //   pathRewrite:{
      //     '^/':'/'
      //   }
      // },

      '/cebcc/security':{//测试服务器用 安全管理器
        target: 'http://10.200.180.47:8011',
        changeOrigin:true,
        pathRewrite:{
          '^/cebcc/security':'/cebcc/security'
        }
      },
       '/cebcc/manager':{//测试服务器：后台管理请求地址配置
         target: 'http://10.200.180.47:8011',
         changeOrigin:true,
         pathRewrite:{
         '^/cebcc/manager':'/cebcc/manager'
         }
       },
      '/cebcc/trans':{//后台管理请求地址配置
        target: 'http://10.200.180.47:8011',
        changeOrigin:true,
        pathRewrite:{
          '^/cebcc/trans':'/cebcc/trans'
        }
      },


    //  '/cebcc/security':{//
    //    target: 'http://10.1.118.139:8090',//'http://cebcc.manager:8085',//http://10.1.118.106:8085
    //    changeOrigin:true,
    //    pathRewrite:{
    //     '^/cebcc/security':'/'
    //    }
    //  },
    //   '/cebcc/manager':{//后台管理请求地址配置
    //     target: 'http://10.1.118.139:8086',//'http://cebcc.manager:8085',//http://10.1.118.106:8085
    //     changeOrigin:true,
    //     pathRewrite:{
    //       '^/cebcc/manager':'/'
    //     }
    //   },
      '/cebcc/trans':{//交易请求地址配置
        target: 'http://10.1.118.137:8086',//'http://cebcc.manager:8085',//http://10.1.118.106:8085
        changeOrigin:true,
        pathRewrite:{
          '^/cebcc/trans':'/'
        }
      },
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 81, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },
  build: build
}
