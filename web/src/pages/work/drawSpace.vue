<template>
  <div class="drawSpace" id="pir-board">
  </div>
</template>

<script>
import Mindmap from '@/mapObj/Mindmap.js'
import '../css/obj.css'
export default {
  data () {
    return {
      mindMap: null,
      mapName: '选择思维导图',
      mapInfo: null
    }
  },
  beforeMount () {
    this.mapInfo = this.$store.state.isUsing
  },
  mounted () {
    this.mindMap = new Mindmap({mapUid: this.mapInfo.mapUid, mapName: this.mapInfo.mapUid})
    this.mindMap.reDrawMapbyUid({mapUid: this.mapInfo.mapUid})
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
