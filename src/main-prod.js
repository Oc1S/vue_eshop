import Vue from 'vue'
import App from './App.vue'
import router from './router'

// cdn加载element-ui，不引用
// import './plugins/element.js'

import TreeTable from 'vue-table-with-tree-grid'
//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import './assets/css/global.css'
import axios from 'axios'
import NProgress from 'nprogress'

Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

//时间戳过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.prototype.$http = axios
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'

// 在request拦截器中，展示进度条NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = localStorage.getItem('token')
  // 最后必须return config
  return config
})
// 在response拦截器中，隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  // 最后必须return config
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
