<template>
  <div v-if="show" >
    <div class="background"></div>
    <div class="warm" >
      <div class="wordspace">
        <img v-if='src' :src="src">
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from '../util/eventBus.js'
export default {
  data () {
    return {
      src: '',
      message: '',
      show: false,
      delayFun: null
    }
  },
  mounted () {
    EventBus.$on('warm', async (warm) => {
      this.src = warm.src
      this.message = warm.message
      this.show = true
      if (warm.delay) {
        await this.sleep(warm.delay)
        this.show = false
      }
    })
  },
  methods: {
    sleep (time) {
      return new Promise((resolve) => {
        clearTimeout(this.delayFun)
        this.delayFun = null
        this.delayFun = setTimeout(() => {
          clearTimeout(this.delayFun)
          resolve()
        }, time * 1000)
      })
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
}
.background {
  background-color: #aaa;
  opacity: 0.2;
  z-index: 3;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.warm {
  position: absolute;
  z-index: 5;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.warm .wordspace {
  border: 1px solid black;
  background-color: white;
  border-radius: 5px;
  width: 330px;
  height: 180px;
  display: flex;
  font-size: 20px;
  justify-content: center;
  align-items: center;
}
.warm img {
  max-height: 32px;
  max-width: 32px;
}
</style>
