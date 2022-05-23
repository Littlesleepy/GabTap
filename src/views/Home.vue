<template>
  <div>
    <div class="Home" v-if="Flag" @click.stop="clickFlag = true">
      <div class="header">
        <span><span class="G">G</span>abTap</span>
      </div>
      <div class="center" >
        <div ref="Play" :class="PlayActive" @click.stop="clk" v-show="load">
          <div ref="logo" class="logo">
            <img class="logo" src="../assets/images/GT1.png" alt="" />
          </div>
          <div ref="aboutText" class="aboutText">
            <ul>
              <li>关于</li>
              <li>参考 : <a href="https://aidn.jp/mikutap/">Mikutap</a></li>
              <li>占位文本</li>
              <li>占位文本</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="text">
          <span>* 警惕 Bgm !</span>
          <a href="javascript:;" @click.stop="about">关 于</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { PlayBgm } from '../hooks/playBgm'
import anime from 'animejs/lib/anime.es.js'
export default defineComponent({
  name: 'Home',
  emits: ['init'],
  setup(props, { emit }) {
    let Flag = ref(true)
    let Play = ref()
    let logo = ref()
    let aboutText = ref()
    let clickFlag = ref(true)
    const load = ref(false)
    window.onload = function () {
      load.value = true
    }
    const clk = () => {
      if (!clickFlag.value) return
      if (document.readyState == 'complete') {
        anime({
          targets: Play.value,
          scale: 0,
          duration: 300,
          easing: 'linear',
          complete: () => {
            setTimeout(() => {
              Flag.value = false
              emit('init')
            }, 200)
          }
        })
      }
    }
    let PlayActive = ref<string>('Play PlayActive')
    watch(clickFlag, (newValue) => {
      logo.value.style.cursor = newValue ? 'pointer' : 'auto'
      logo.value.style.zIndex = newValue ? 1 : -1
      PlayActive.value = newValue ? 'Play PlayActive' : 'Play'
      anime({
        targets: Play.value,
        scale: clickFlag.value ? 1 : 1.4,
        cursor: 'pointer',
        rotateY: clickFlag.value ? 0 : 180,
        duration: 200,
        easing: 'linear'
      })
      anime({
        targets: logo.value,
        opacity: clickFlag.value ? 1 : 0,
        duration: 200,
        delay: clickFlag.value ? 200 : 100,
        easing: 'linear',
        complete: () => {}
      })
      anime({
        targets: aboutText.value,
        opacity: clickFlag.value ? 0 : 1,
        duration: 200,
        delay: clickFlag.value ? 100 : 200,
        easing: 'linear',
        complete: () => {}
      })
    })
    const about = () => {
      clickFlag.value = !clickFlag.value
    }
    return { clk, Flag, about, logo, aboutText, Play, clickFlag, PlayActive, load }
  }
})
</script>
<style lang="less" scoped>
@font-face {
  font-family: 'fontFamilyName';
  src: url('../assets/font/ZCOOLKuaiLe-Regular.ttf');
}
* {
  font-family: fontFamilyName;
}
.Home {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 999;
  flex-direction: column;
  pointer-events: all;

  .header {
    box-sizing: border-box;
    padding: 5px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    font-size: 30px;
    color: rgb(249, 242, 135);
    .G {
      font-size: 60px;
      padding-left: 10px;
    }
  }
  .center {
    position: absolute;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: space-around;
    align-items: center;
    pointer-events: all;
    .PlayActive:hover {
      width: 45vh;
      height: 45vh;
    }
    .Play {
      position: relative;
      cursor: pointer;
      width: 40vh;
      height: 40vh;
      max-width: 70vw;
      max-height: 70vw;
      box-sizing: border-box;
      border: 2vh solid rgb(249, 242, 135);
      border-radius: 50%;
      transition: all 0.3s;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-around;
      color: rgb(249, 242, 135);
      font-size: 15vh;
      font-weight: bold;
      pointer-events: all;

      span,
      div {
        position: absolute;
      }
      .logo {
        width: 100%;
        height: 100%;
        z-index: 99;
        color: rgb(249, 242, 135);
      }
      .aboutText {
        transform: rotateY(180deg);
        opacity: 0;
        width: 100%;
        height: 100%;
        font-size: 16%;
        font-weight: 100;
        cursor: auto;
        ul {
          box-sizing: border-box;
          padding-top: 20px;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          li {
            padding-bottom: 16%;
            a {
              color: rgb(rgb(249, 242, 135));
              text-decoration: none;
              border-bottom: 1px rgb(249, 242, 135) dashed;
            }
          }
        }
      }
    }
  }
  .bottom {
    width: 100%;
    height: 20vh;
    min-height: 60px;
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 20px;
    .text {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    a,
    span {
      color: rgb(249, 242, 135);
      text-decoration: none;
      margin-bottom: 7vh;
    }
    a {
      border-bottom: 1px rgb(249, 242, 135) dashed;
    }
  }
}
</style>
