<template>
  <div class="O" @click="ck">□</div>
  <a
    class="FEEDBACK"
    href="javascript:;"
    @click="FEEDBACK_Ck"
    v-show="Gabinit ? Gabinit.playInit : false"
    >FEEDBACK : {{ FEEDBACK ? 'ON' : 'OFF' }}</a
  >
  <a class="BGM" href="javascript:;" @click="BGM_Ck" v-show="Gabinit ? Gabinit.playInit : false"
    >BGM : {{ BGM ? 'ON' : 'OFF' }}</a
  >

  <Home @init="init"></Home>

  <GabTap ref="Gabinit" :FEEDBACK="FEEDBACK" :BGM="BGM"></GabTap>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import GabTap from './views/GabTap.vue'
import Home from './views/Home.vue'
import { PlayBgm } from './hooks/playBgm'
export default defineComponent({
  name: 'App',
  components: {
    GabTap,
    Home
  },
  setup() {
    let flag = false
    const Gabinit = ref<any>()
    const FEEDBACK = ref(true)
    const BGM = ref(true)
    const ck = () => {
      if (!flag) {
        document.body.requestFullscreen()
        flag = true
      } else {
        document.exitFullscreen()
        flag = false
      }
    }
    const init = () => {
      Gabinit.value.playInit = true
      Gabinit.value.PlayBgm()
    }
    const FEEDBACK_Ck = () => {
      FEEDBACK.value = !FEEDBACK.value
    }
    const BGM_Ck = () => {
      BGM.value = !BGM.value
    }
    return { ck, init, Gabinit, FEEDBACK, FEEDBACK_Ck, BGM_Ck, BGM }
  }
})
</script>
<style lang="less">
body {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  padding: 0;
  margin: 0;
  background-color: rgb(245, 161, 202);
  overflow: hidden;
  pointer-events: all;
  // cursor: pointer;
}
@font-face {
  font-family: 'fontFamilyName';
  src: url('./assets/font/ZCOOLKuaiLe-Regular.ttf');
}

* {
  user-select: none;
}
img {
  pointer-events: none;
}
canvas {
  position: absolute;
  top: 0;
  z-index: 9;
  align-items: center;
  // background-color: rgb(245, 161, 202);
  background-color: rgb(0, 180, 163);
}
.FEEDBACK {
  font-family: fontFamilyName;
  z-index: 1000;
  position: absolute;
  color: rgb(249, 242, 135);
  text-decoration: none;
  border-bottom: 2px rgb(249, 242, 135) dashed;
  top: 2vh;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  padding-bottom: 2px;
}
.BGM {
  font-family: fontFamilyName;
  z-index: 1000;
  position: absolute;
  color: rgb(249, 242, 135);
  text-decoration: none;
  border-bottom: 2px rgb(249, 242, 135) dashed;
  top: 2vh;
  left: 60%;
  transform: translateX(-50%);
  font-size: 18px;
  padding-bottom: 2px;
}
.O {
  width: 6vh;
  height: 6vh;
  position: absolute;
  z-index: 1000;
  font-size: 6vh;
  color: rgb(249, 242, 135);
  right: 0;
  top: 0;
  transition: all 0.1s;
  &:hover {
    color: rgb(255, 255, 255);
    transform: scale(1.1);
  }
}
</style>
