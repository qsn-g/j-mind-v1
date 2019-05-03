<template>
  <div class="drawSpace" id="pir-board">
  </div>
</template>

<script>
import Mindmap from '@/mapObj/Mindmap.js'
import '../css/obj.css'
import {EventBus} from '@/util/eventBus.js'
export default {
  data () {
    return {
      mindMap: null,
      mapName: '选择思维导图',
      mapInfo: null
    }
  },
  beforeMount () {
  },
  beforeDestroy () {
    EventBus.$off('mapChange', this.reDrawMap)
    this.mindMap && this.mindMap.clearStage()
  },
  mounted () {
    this.reDrawMap()
    EventBus.$on('mapChange', this.reDrawMap)
  },
  methods: {
    test (map) {
      console.log(map)
    },
    reDrawMap () {
      this.mindMap && this.mindMap.clearStage()
      this.mapInfo = this.$store.state.isUsing
      if (!this.mapInfo) return
      this.mindMap = new Mindmap({mapUid: this.mapInfo.mapUid, mapName: this.mapInfo.mapName})
      this.mindMap.reDrawMapbyUid({mapUid: this.mapInfo.mapUid})
    }
  }
}
</script>

<style scoped>
  .drawSpace {
    height: 100%;
    width: 100%;
    position: absolute;
    flex: 1;
  }
</style>
