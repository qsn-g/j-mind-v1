<template>
  <div class="mapTable">
    <el-row>
      <el-button
      circle
      type="primary"
      @click="clickMap(-1, {mapUid: null, mapName: '新建思维导图'})"
      icon="el-icon-plus">
      </el-button>
    </el-row>
    <el-table
    :data="tableData"
    >
      <el-table-column
      type="index">
      </el-table-column>
      <el-table-column
      label="更新日期">
      </el-table-column>
      <el-table-column
      label="导图名称"
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
import {getIndexfromList} from '@/util/common.js'
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
    }
  }
}
</script>

<style scoped>
  .mapTable {
    flex: 1;
  }
  .el-row .el-button {
     margin-left: 15px;
   }
</style>
