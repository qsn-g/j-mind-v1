<template>
  <div id="app">
    <menuBar></menuBar>
    <div class="rightBar">
      <el-tabs
      closable
      v-model="editorMap"
      type="card"
      @tab-remove="removeTab">
        <el-tab-pane
        v-for="tab in tabList"
        :key="tab.mapUid"
        :label="tab.mapName"
        :name="tab.mapUid">
        </el-tab-pane>
      </el-tabs>
      <router-view v-on:isUsing="getUsingMap"></router-view>
    </div>
    <!-- <warm></warm>
    <face></face> -->
  </div>
</template>

<script>
import drawSpace from './pages/work/drawSpace'
import menuBar from './pages/menu/menuBar'
import {mapActions} from 'vuex'
import {getIndexfromList} from '@/util/common.js'
export default {
  name: 'App',
  data () {
    return {
      tabList: this.$store.state.mapList,
      editorMap: ''
    }
  },
  provide () {
    return {
      reload: () => {

      }
    }
  },
  watch: {
    editorMap (val) {
      const store = this.$store
      const index = getIndexfromList(val, store.state.mapList)
      const isUsing = store.state.mapList[index]
      store.dispatch('setUsing', isUsing)
      if (isUsing && isUsing.mapUid !== '' && isUsing.mapName !== '' && isUsing !== {}) {
        this.$router.push({
          name: 'drawSpace',
          path: '/drawSpace',
          params: {
            mapName: isUsing.mapName,
            mapUid: isUsing.mapUid
          }
        })
      }
    },
    $route (to, from) {
      if (to.path !== '/drawSpace') {
        this.editorMap = ''
      }
    }
  },
  beforeMout () {},
  mounted () {},
  components: {
    menuBar,
    drawSpace
  },
  methods: {
    ...mapActions([
      'setUsingIndex',
      'deleteMap'
    ]),
    removeTab (targetName) {
      const store = this.$store
      const index = getIndexfromList(targetName, store.state.mapList)
      this.deleteMap(targetName)
      if (!store.state.isUsing) return
      if (targetName === store.state.isUsing.mapUid) {
        const nextTab = store.state.mapList[index] || store.state.mapList[index - 1]
        if (nextTab) this.editorMap = nextTab.mapUid
      }
    },
    getUsingMap (val) {
      this.editorMap = val
    }
  }
}
</script>
<style scoped>
  #app {
    display: flex;
    flex-direction: row;
    align-items: stretch
  }
  .rightBar {
    flex: 1;
    height: 100%;
  }
</style>
