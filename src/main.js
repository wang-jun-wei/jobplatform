// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 全量引入 bk-magic-vue
import bkMagic from 'bk-magic-vue'
// 全量引入 bk-magic-vue 样式
import 'bk-magic-vue/dist/bk-magic-vue.min.css'

import * as echarts from "echarts";
Vue.prototype.$echarts = echarts

Vue.use(bkMagic)

Vue.config.productionTip = false
Vue.prototype.$axios = Axios
Vue.prototype.HOST = "/api"
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
  let user = JSON.parse(localStorage.getItem("user"));

  // to.meta.title && (document.title = to.meta.title)

  if(to.path == "/login") {
    next();
  }else if (user !== null) {
      next();
  } else {
    next("/login");
  }
})

// 添加请求拦截器
Axios.interceptors.request.use(function(config) {
  let user = JSON.parse(localStorage.getItem("user"));
  // 在发送请求之前做些什么
  if (config.url !== "/api/doLogin") {
    if (user == null) {
      router.push("/login");
    }
  }

  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
  }
  return config;
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
Axios.interceptors.response.use(function (response) {
  // 如果返回401，则说明未登录
  if (response.data.code === "401") {
    localStorage.removeItem("user");
    router.push("/login");
  }
  // 对响应数据做点什么
  if(!response.data){
    return {
      msg:"数据返回不合理"
    }
  }
  return response;
}, function (error) {
  console.log(error);
  // 对响应错误做点什么
  return Promise.reject(error);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
