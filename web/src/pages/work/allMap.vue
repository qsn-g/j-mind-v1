<template>
  <div class="mapTable">
    <el-row>
      <el-button
      circle
      type="primary"
      class="button"
      @click="clickMap(-1, {mapUid: null, mapName: '新建思维导图'})"
      icon="el-icon-plus">
      </el-button>
      <div class="button upload">
        <el-button
        circle
        type="primary"
        icon="el-icon-upload2"
        @click="clickUpload">
        </el-button>
        <input type="file" id="uploadButton" @change="uploadFile">
      </div>
    </el-row>
    <el-table
    :data="tableData"
    :default-sort = "{prop: 'mTime', order: 'descending'}">
      <el-table-column
      type="index">
      </el-table-column>
      <el-table-column
      sortable
      label="更新日期"
      prop="mTime">
      </el-table-column>
      <el-table-column
      label="导图名称"
      sortable
      prop="mapName">
      </el-table-column>
      <el-table-column
      label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="clickMap(scope.$index, scope.row)"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="deleteMap(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ajax from '@/util/ajax.js'
import {mapActions} from 'vuex'
import {getIndexfromList, isUseFile, readTextData, getFileName, getTimeFromStamp} from '@/util/common.js'
export default {
  data () {
    return {
      tableData: []
    }
  },
  beforeMount () {
    this.getMapList()
  },
  methods: {
    ...mapActions([
      'addMap'
    ]),
    async getMapList () {
      const result = await ajax.getmindMapList()
      result.data.forEach((elem) => {
        elem.mTime = getTimeFromStamp(elem.mTime)
        this.tableData.push(elem)
      })
    },
    async clickMap (index, obj) {
      const resultIndex = getIndexfromList(obj.mapUid, this.$store.state.mapList)
      if (!obj.mapUid) {
        const newUid = await ajax.getRandomUid()
        obj.mapUid = newUid.data
      }
      if (resultIndex < 0) this.addMap(obj)
      this.$emit('isUsing', obj.mapUid)
    },
    clickUpload () {
      document.getElementById('uploadButton').click()
    },
    async uploadFile (evt) {
      const file = evt.target.files[0]
      const suffix = 'jzx'
      if (!file || !isUseFile(file.name, suffix)) {
        this.$message({
          message: `请上传 "${suffix}" 文件`,
          type: 'error',
          duration: 1500,
          showClose: true
        })
        return
      }
      const newUid = await ajax.getRandomUid()
      const map = {
        mapName: getFileName(file.name),
        mapUid: newUid.data
      }
      const fileRes = await readTextData(file)
      this.addMap(map)
      sessionStorage.setItem(map.mapUid, fileRes)
      this.$emit('isUsing', map.mapUid)
    },
    async deleteMap (index, obj) {
      try {
        const deleteResult = await ajax.deleteMindMapbyUid({mapUid: obj.mapUid})
        this.$emit('removeMap', obj.mapUid)
        const index = getIndexfromList(obj.mapUid, this.tableData)
        this.tableData.splice(index, 1)
        this.$message({
          message: `"${obj.mapName}" ${deleteResult.data.res}`,
          type: 'success',
          duration: 1500,
          showClose: true
        })
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style scoped>
  .mapTable {
    flex: 1;
  }
  .el-row {
    display: flex;
  }
  .el-row .button {
     margin-left: 15px;
   }
   .upload input[type = 'file']{
     position: absolute;
     opacity: 0;
   }
</style>
