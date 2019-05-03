<template>
  <div class="mapTable">
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
            size="mini"
            @click="clickMap(scope.$index, scope.row)">查看</el-button>
          <el-button
            size="mini"
            @click="editorName(scope.$index, scope.row)">改名</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteMap(scope.$index, scope.row)">删除</el-button>
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
    clickMap (index, obj) {
      const resultIndex = getIndexfromList(obj.mapUid, this.$store.state.mapList)
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
</style>
