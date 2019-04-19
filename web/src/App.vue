<template>
  <div id="app">
    <warm></warm>
    <face></face>
  </div>
</template>

<script>
import face from './components/Interface'
import warm from './components/warm'
export default {
  name: 'App',
  components: {
    face: face,
    warm: warm
  }
}
</script>
