<template>
  <div>
    <el-menu
      default-active="0"
      class="menuBar"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="isCollapse">
      <el-menu-item
        v-for="menu in menuList"
        :key="menu.index"
        :index="menu.index"
        @click="toggle">
        <i :class="menu.class"></i>
        <span slot="title">{{ menu.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { EventBus } from '@/util/eventBus'
export default {
  data () {
    return {
      menuList: [
        {title: 'JMind', index: '0', class: 'el-icon-reading'},
        {title: '查看导图', index: '1', class: 'el-icon-search'},
        {title: '保存导图', index: '2', class: 'el-icon-upload'},
        {title: '上传文件', index: '5', class: 'el-icon-upload2'},
        {title: '下载文件', index: '6', class: 'el-icon-download'},
        {title: '分屏(计划中)', index: '7', class: 'el-icon-menu'}
      ],
      isCollapse: true
    }
  },
  methods: {
    toggle (e) {
      const index = e.index
      switch (index) {
        case ('0'): {
          this.isCollapse = !this.isCollapse
          break
        }
        case ('1'): {
          this.$router.push({
            name: 'allMap',
            path: '/allMap'
          })
          break
        }
        case ('2'): {
          EventBus.$emit('saveMap')
          break
        }
      }
    }
  }
}
</script>
<style scoped>
  .menuBar {
    height: 100%
  }
  .JMind-icon {
    background: url('data:image/png;base64,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') no-repeat;
    background-size: cover;
    display: inline-block;
    width: 25px;
    height: 25px;
  }
</style>
