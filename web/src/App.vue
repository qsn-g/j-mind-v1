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
      <router-view></router-view>
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
  watch: {
    editorMap (val) {
      const store = this.$store
      const index = getIndexfromList(val, store.state.mapList)
      store.dispatch('setUsing', store.state.mapList[index])
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
      this.deleteMap(targetName)
      if (targetName === this.$store.state.isUsing.mapUid) {
      } else {
        console.log('notUsing')
      }
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
