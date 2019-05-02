import Vue from 'vue'
import Router from 'vue-router'
import drawSpace from '../pages/work/drawSpace.vue'
import allMap from '../pages/work/allMap.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/allMap',
      name: 'allMap',
      component: allMap
    },
    {
      path: '/drawSpace',
      name: 'drawSpace',
      component: drawSpace
    }
  ]
})
