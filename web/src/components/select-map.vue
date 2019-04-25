<template>
  <div class="select-map">
    <div class="box-title"  @focus="show" @blur="hide" tabindex = 2>
      <span>{{ selectMap.mapName }}</span>
    </div>
    <ul v-if="isonfocus">
      <li v-for="map in allMap" :key="map.id"  @mousedown="hide($event, map)">{{ map.mapName }}</li>
    </ul>
  </div>
</template>

<script>
import {emitErrMess} from '../util/errResolve.js'
import {EventBus} from '../util/eventBus.js'
import ajax from '../util/ajax'
export default {
  data () {
    return {
      allMap: [],
      selectMap: { mapName: '选择思维导图', mapUid: '' },
      isonfocus: false
    }
  },
  mounted () {
    EventBus.$on('mapName-change', (message) => {
      this.selectMap.mapName = message.mapName
      this.selectMap.mapUid = message.mapUid
    })
  },
  methods: {
    reDraw (mapInfo) {
      EventBus.$emit('select-map', mapInfo)
    },
    hide (event, map = {}) {
      if (this.isonfocus === false) return
      this.isonfocus = false
      if (map.mapUid === this.selectMap.mapUid && map.mapName !== this.selectMap.mapName) this.selectMap.mapName = map.mapName
      if (!map.mapUid || map.mapUid === this.selectMap.mapUid) return
      this.selectMap = map
      this.reDraw(map)
    },
    async show () {
      try {
        this.allMap = []
        this.isonfocus = true
        const result = await ajax.getmindMapList()
        result.data.forEach((elem) => {
          this.allMap.push(elem)
        })
      } catch (error) {
        emitErrMess({delay: 1, code: error.response.status})
      }
    }
  }
}
</script>

<style scoped>
*{
  margin: 0px;
  padding: 0px;
}
.select-map {
  position: absolute;
  left: 3px;
  top: 6px;
  width: 150px;
  z-index: 3;
  min-width: 160px;
  white-space:nowrap;
  font-size: 15px;
}
.select-map .box-title {
  border: 1px solid #cccccc;
  background-color: white;
  padding: 1px 5px 1px 5px;
  border-radius: 5px;
  outline: none;
  white-space:nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}
.select-map span {
  color: #707070;
  margin: 0 25px 0 5px;
}
.select-map span::after {
  content: '';
  background : url('https://i.loli.net/2019/03/22/5c94981dc5fe6.png');
  height: 20px;
  width: 20px;
  position: absolute;
  right: 1px;
  margin-top: 1px;
}
.select-map ul{
  border: 1px solid #cccccc;
}
.select-map ul li {
  background-color: white;
  color: #707070;
  list-style: none;
  padding: 0 5px 0 5px;
  white-space:nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}
.select-map ul li:hover {
  background: #cbebf6
}
</style>
