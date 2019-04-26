<template>
  <div>
    <div id="pir-board">
    </div>
    <div class="menu">
      <div class="title">
        <input type="text" v-model="mapName">
      </div>
      <div class="buttons">
        <selectMap></selectMap>
        <div class="buttonList">
          <div @click="addObj">新建导图</div>
          <div @click="saveInfo">线上保存</div>
          <div @click="deleteMap">删除导图</div>
          <div><a :download="mapName+ '.jzx'"  id="dl_Button" @mouseover="downLoad">下载文件</a></div>
          <div class="fileButton">
            <span>上传文件 </span>
            <input type="file" @change="onLoad">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Mindmap from '../mapObj/Mindmap.js'
import './obj.css'
import './menu.css'
import {emitErrMess} from '../util/errResolve.js'
import {EventBus} from '../util/eventBus.js'
import ajax from '../util/ajax.js'
import selectMap from './select-map'
import cal from '../mapObj/methods.js'

export default {
  data () {
    return {
      mindMap: null,
      allMap: [],
      mapName: '选择思维导图'
    }
  },
  components: {
    selectMap
  },
  created () {
  },
  mounted () {
    EventBus.$on('select-map', (selectMap) => {
      if (this.mindMap) this.mindMap.clearStage()
      this.mindMap = new Mindmap({ mapName: selectMap.mapName, mapUid: selectMap.mapUid })
      this.mapName = this.mindMap.mapName
      this.reDrawbyUid(selectMap.mapUid)
    })
  },
  watch: {
    mapName (curVal, oldVal) {
      this.mapName = curVal
      if (this.mindMap) this.mindMap.mapName = curVal
      EventBus.$emit('mapName-change', {mapUid: '', mapName: curVal})
    }
  },
  methods: {
    addObj () {
      if (this.mindMap && this.mindMap.getStartArr().length > 0) {
        if (!window.confirm('未保存的思维导图将会消失')) return
        this.mindMap.clearStage()
        this.mapName = '新建思维导图'
      }
      this.mindMap = new Mindmap({ mapName: this.mapName })
      this.mindMap.addObj()
    },
    async deleteMap () {
      if (!this.mindMap || !this.mindMap.mapUid) {
        emitErrMess({delay: 1, message: '无思维导图'})
        return
      }
      emitErrMess({message: '正在删除'})
      try {
        const result = await ajax.deleteMindMapbyUid({mapUid: this.mindMap.mapUid})
        this.mindMap.clearStage()
        this.mindMap = null
        this.mapName = '选择思维导图'
        emitErrMess({message: result.data.res, delay: 1, code: result.data.errno})
      } catch (error) {
        emitErrMess({delay: 1, code: error.response.status})
      }
    },
    async saveInfo () {
      if (!this.mindMap) {
        emitErrMess({delay: 1, message: '无思维导图'})
        return
      }
      emitErrMess({message: '正在保存'})
      const result = await this.mindMap.saveMindmap()
      emitErrMess({delay: 1, message: result.data.res, code: result.data.errno})
    },
    reDrawbyUid (mapUid) {
      this.mindMap.reDrawMapbyUid({ mapUid })
    },
    downLoad () {
      if (!this.mindMap) {
        return
      }
      try {
        this.mindMap.downLoadMap()
      } catch (error) {
        return false
      }
    },
    async onLoad (event) {
      const file = event.target.files[0]
      if (!file || file.name.substr(-4, 4) !== '.jzx') {
        emitErrMess({delay: 1, message: '请上传正确文件'})
        return
      }
      const mapName = file.name.replace('.jzx', '')
      const result = await this.getFileData(file)
      if (this.mindMap) this.mindMap.clearStage()
      this.mindMap = new Mindmap({ mapName: mapName })
      this.mapName = mapName
      this.mindMap.reDrawMindmap(cal.jdecode(result))
      event.target.value = ''
    },
    getFileData (file) {
      return new Promise((resolve) => {
        const fr = new FileReader()
        fr.readAsText(file, 'UTF-8')
        fr.onload = (event) => {
          resolve(event.target.result)
        }
      })
    }
  }
}
</script>
