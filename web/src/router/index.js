import Vue from 'vue'
import Router from 'vue-router'
import drawSpace from '@/components/Interface.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/drawSpace',
      name: 'drawSpace',
      component: drawSpace
    }
  ]
})
