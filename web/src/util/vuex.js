import Vuex from 'vuex'
import Vue from 'vue'
import {EventBus} from './eventBus'
import { getIndexfromList } from './common'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mapList: [],
    isUsing: {
      mapUid: '',
      mapName: ''
    },
    isUsingIndex: '0'
  },
  mutations: {
    addMap (state, map) {
      state.mapList.push(map)
    },
    setUsing (state, map) {
      state.isUsing = map
    },
    deleteUseMap (state, mapUid) {
      const index = getIndexfromList(mapUid, state.mapList)
      state.mapList.splice(index, 1)
    }
  },
  actions: {
    addMap ({commit}, map) {
      commit('addMap', map)
    },
    setUsing ({commit}, map) {
      commit('setUsing', map)
      EventBus.$emit('mapChange', map) // drawSpace 里 监听mapChange
    },
    deleteUseMap ({commit}, mapUid) {
      commit('deleteUseMap', mapUid)
    }
  }
})
