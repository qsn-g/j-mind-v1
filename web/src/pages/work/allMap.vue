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
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ajax from '@/util/ajax.js'
import {mapActions} from 'vuex'
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
      this.addMap(obj)
      this.$router.push({
        name: 'drawSpace',
        path: '/drawSpace',
        params: {
          mapName: obj.mapName,
          mapUid: obj.mapUid
        }
      })
    }
  }
}
</script>

<style scoped>
  .mapTable {
    flex: 1;
  }
</style>
