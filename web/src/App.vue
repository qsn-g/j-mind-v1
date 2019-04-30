<template>
  <div id="app">
    <menuBar></menuBar>
    <drawSpace></drawSpace>
    <!-- <warm></warm>
    <face></face> -->
  </div>
</template>

<script>
import drawSpace from './pages/work/drawSpace'
import menuBar from './pages/menu/menuBar'
import face from './components/Interface'
import warm from './components/warm'
export default {
  name: 'App',
  components: {
    face: face,
    warm: warm,
    menuBar,
    drawSpace
  }
}
</script>
<style scoped>
  #app {
    display: flex;
    flex-direction: row;
    align-items: stretch
  }
</style>

