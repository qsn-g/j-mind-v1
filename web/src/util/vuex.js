import Vuex from 'vuex'
import Vue from 'vue'
import { getIndexfromList } from './common'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mapList: [],
    isUsing: {},
    isUsingIndex: '0'
  },
  mutations: {
    addMap (state, map) {
      state.mapList.push(map)
    },
    setUsing (state, map) {
      state.isUsing = map
    },
    deleteMap (state, mapUid) {
      const index = getIndexfromList(mapUid, state.mapList)
      state.mapList.splice(index, 1)
    }
  },
  actions: {
    addMap ({commit}, map) {
      commit('addMap', map)
      commit('setUsing', map)
    },
    setUsing ({commit}, map) {
      commit('setUsing', map)
    },
    deleteMap ({commit}, mapUid) {
      commit('deleteMap', mapUid)
    }
  }
})
