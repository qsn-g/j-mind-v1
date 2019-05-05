<template>
  <div class="drawSpace" id="pir-board">
  </div>
</template>

<script>
import Mindmap from '@/mapObj/Mindmap.js'
import '../css/obj.css'
import {EventBus} from '@/util/eventBus.js'
import {jDecode} from '@/util/common.js'
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
    this.removeEventBus()
    this.mindMap && this.mindMap.clearStage()
  },
  mounted () {
    this.reDrawMap()
    this.addEventBus()
  },
  methods: {
    removeEventBus () {
      EventBus.$off('mapChange', this.reDrawMap)
      EventBus.$off('saveMap', this.saveMap)
    },
    addEventBus () {
      EventBus.$on('mapChange', this.reDrawMap)
      EventBus.$on('saveMap', this.saveMap)
    },
    async reDrawMap () {
      try {
        this.mindMap && this.mindMap.clearStage()
        this.mapInfo = this.$store.state.isUsing
        if (!this.mapInfo) return
        this.mindMap = new Mindmap({mapUid: this.mapInfo.mapUid, mapName: this.mapInfo.mapName})
        const sessionJson = sessionStorage.getItem(this.mapInfo.mapUid)
        if (sessionJson) {
          this.mindMap.reDrawMindmap(jDecode(sessionJson))
        } else {
          const isOld = await this.mindMap.reDrawMapbyUid({mapUid: this.mapInfo.mapUid})
          if (!isOld && this.mindMap && this.mindMap.mapUid) this.mindMap.addObj()
        }
      } catch (err) {
        console.error(err)
      }
    },
    async saveMap () {
      if (!this.mindMap) {
        this.$message({
          message: `联系阿星`,
          type: 'warning',
          showClose: true
        })
      }
      const saveResult = await this.mindMap.saveMindmap()
      this.$message({
        message: `"${this.mindMap.mapName}" => ${saveResult.data.res}`,
        type: 'success',
        duration: 1500,
        showClose: true
      })
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
