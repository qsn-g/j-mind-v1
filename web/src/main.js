// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './util/vuex'

Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
Vue.config.productionTip = false
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
