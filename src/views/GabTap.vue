<template>
  <div class="GabTap" @click="childClick"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, nextTick, computed } from 'vue'
// import * as PIXI from 'pixi.js'
import * as PIXI from 'pixi.js-legacy'
import '@pixi/graphics-extras'
import 'gsap'
import 'pixi-sound'
import {
  Rectangle,
  Rearrow,
  Rcircle,
  Rfeather,
  RsStars,
  RsDomStars,
  Rhalo,
  anm,
  Rline
} from '../hooks/animations'
import anime from 'animejs/lib/anime.es.js'
import { getRandom } from '../hooks/color'
import axios from 'axios'
import { audioList } from '../assets/audio'
import { random } from '../hooks/random'
import { generatePolygonPoints, bezierStars, radVNums } from '../hooks/animations'
import Gbm from '../assets/audio/audios/Gbm3.mp3'
import testPng from '../assets/images/test.png'
import { easing } from '../hooks/easing'
export default defineComponent({
  name: 'GabTap',
  props: {
    FEEDBACK: {
      type: Boolean,
      required: true
    },
    BGM: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    // canvas 舞台
    let app: PIXI.Application
    const childClick = () => {
      if (!ClickFlag) return
      throttle(50)
      // Rectangle(app)
      // Rearrow(app)
    }
    let playInit = ref(false)
    // 简易点击限制
    // 简易节流
    let ClickFlag = true,
      Ctime: any
    function throttle(time: number) {
      ClickFlag = false
      clearInterval(Ctime)
      Ctime = setTimeout(() => {
        ClickFlag = true
        return ClickFlag
      }, time)
    }
    window.onresize = function () {
      // 视口变化 更新数据
      initGabTap()
      setBackgroundColor()
      app.renderer.resize(document.body.offsetWidth, document.body.offsetHeight)
      sprite.x = window.innerWidth - 250 * radNums()
      sprite.y = window.innerHeight
      sprite.scale.set(radNums())
    }
    onMounted(() => {
      initApp()
    })
    // 初始化
    let sprite: PIXI.Sprite

    const initApp = () => {
      app = new PIXI.Application({
        width: document.body.offsetWidth,
        height: document.body.offsetHeight,
        antialias: true,
        transparent: true,
        resolution: 1,
        autoDensity: true
      })
      app.stage.interactive = true
      app.stage.sortableChildren = true
      document.body.appendChild(app.view)
      sprite = PIXI.Sprite.from(testPng)

      initGabTap()
    }

    const initGabTap = () => {
      // 横屏8
      // 竖屏4
      let row = 8,
        col = 4
      if (document.body.offsetWidth < document.body.offsetHeight) {
        row = 4
        col = 8
      }
      const GabKeys: PIXI.Graphics[] = []
      let litWidth = document.body.offsetWidth / row
      let litHeight = document.body.offsetHeight / col
      let container = new PIXI.Container()
      container.zIndex = 9
      let GabKeyPane = new PIXI.Graphics()
      GabKeyPane.beginFill(0, 0)
      GabKeyPane.drawRect(0, 0, window.innerWidth, window.innerHeight)
      GabKeyPane.interactive = true

      let reMove = -1
      let tesFlag = false
      // 点击事件
      GabKeyPane.on('pointerdown', (e: PIXI.InteractionEvent) => {
        if (document.readyState !== 'complete') return
        tesFlag = true
        SetDraw(e, true, 185)
      }) //移动事件 tesFlag 只有在点击时可以触发移动事件
        .on('pointermove', (e: PIXI.InteractionEvent) => {
          if (document.readyState !== 'complete') return
          if (!tesFlag) return
          SetDraw(e, false, 160)
        }) //离开事件
        .on('pointerup', () => {
          if (document.readyState !== 'complete') return
          tesFlag = false
          setTimeout(() => {
            emit('listisshow', true)
          }, 20)
        })
      // 循环生成方块
      for (let r = 0; r < col; r++) {
        for (let c = 0; c < row; c++) {
          let GabKey = new PIXI.Graphics()
          // 透明度初始化为1
          GabKey.beginFill(0xffffff, 1).drawRect(litWidth * c, litHeight * r, litWidth, litHeight)
          TweenMax.to(GabKey, 0, {
            alpha: 0
          })
          GabKeys.push(GabKey)
          GabKeyPane.addChild(GabKey)
        }
      }
      // 闪烁动画
      function flashDraw(gab: PIXI.Graphics) {
        if (!props.FEEDBACK) return
        TweenMax.to(gab, 0.05, {
          alpha: 0.7
        })
        TweenMax.to(gab, 0.5, {
          delay: 0.05,
          alpha: 0
        })
      }
      // 位置判定
      function SetDraw(e: PIXI.InteractionEvent, flag: boolean, time: number) {
        emit('listisshow', false)
        let position = e.data.global,
          x = Math.floor(position.x / (window.innerWidth / row)),
          y = Math.floor(position.y / (window.innerHeight / col)),
          index = x + y * row
        // 超出屏幕 条件不满 rerurn
        if (position.x > document.body.offsetWidth || position.x < 0) return
        if (position.y > document.body.offsetHeight || position.y < 0) return
        if (reMove === index && !flag) return
        // 动画
        flashDraw(GabKeys[index])
        // 动画
        // 背景动画播放
        backgroundNumber()
        // backgroundAnime2()

        // 动画组
        const funArr = [
          Rearrow,
          Rectangle,
          RsDomStars,
          Rcircle,
          Rfeather,
          RsStars,
          Rhalo,
          anm,
          Rline
        ]
        // 动画播放
        funArr[index % funArr.length](app)
        // Rhalo(app)
        // 音频播放
        ThrottleSound(index, time)

        // 避免移动事件重复判定
        reMove = index
      }
      container.addChild(GabKeyPane)
      app.stage.addChild(container)
      if (playInit.value) return
    }

    let date = 0
    // 简易节流 音频
    function ThrottleSound(index: number, setTime: number) {
      let timer = new Date().getTime()
      let retime = setTime - (timer - date)
      if (timer - date > setTime) {
        date = timer
        retime = setTime - (timer - date)
        GabSound(index)
      } else {
        reSound(index, retime)
      }
    }
    let reSoundFlag = true
    function reSound(index: number, setTime: number) {
      if (!reSoundFlag) return
      reSoundFlag = false
      setTimeout(() => {
        ThrottleSound(index, setTime)
        reSoundFlag = true
      }, setTime)
    }

    // 背景计数器
    let BaNumber = 0
    let BaNumberMax = Math.trunc(random(14, 22))
    let backgroundNumber = () => {
      BaNumber++
      if (BaNumber >= BaNumberMax) {
        ;(function setColor() {
          color = getRandom()
          if (color == reColor) {
            setColor()
          }
        })()
        // setColor()
        random(0, 1) < 0.5 ? backgroundAnime2() : backgroundAnime()

        BaNumber = 0
        BaNumberMax = Math.trunc(random(14, 22))
      }
    }
    // 背景颜色切换
    const setBackgroundColor = () => {
      app.renderer.backgroundColor = color ?? 961175
    }

    // 背景动画
    let color: number = 0x0eaa97
    let reColor = -1
    const backgroundAnimeArr: PIXI.Container[] = []
    // 背景动画1
    const backgroundAnime = () => {
      // 精灵组
      const container: PIXI.Container = new PIXI.Container()
      let pane: PIXI.Graphics = new PIXI.Graphics()
      pane.beginFill(0, 0)
      pane.drawRect(0, 0, window.innerWidth, window.innerHeight)
      // 遮罩层
      let mask: PIXI.Graphics = new PIXI.Graphics()

      reColor = color
      // 多边形
      let polygon: PIXI.Graphics = new PIXI.Graphics()
      polygon.beginFill(color, 1)
      polygon.drawRect(0, 0, window.innerWidth, window.innerHeight)
      // 给多边形设置遮罩
      polygon.mask = mask
      pane.addChild(mask)
      pane.addChild(polygon)
      container.addChild(pane)
      backgroundAnimeArr.push(container)
      app.stage.addChild(container)
      // 储存多边形的各个点位置
      let Bpoints: PIXI.Point[] = [],
        BNum = Math.round(random(2, 6)),
        direction = Math.round(random(1, 4)),
        xMin = direction === 2 ? window.innerWidth : 0,
        xMax = direction === 4 ? 0 : window.innerWidth,
        yMin = direction === 3 ? window.innerWidth : 0,
        yMax = direction === 1 ? 0 : window.innerWidth,
        target = 0
      // 设置不同方向的目标值
      switch (direction) {
        case 1:
          target = window.innerHeight
          break
        case 2:
          target = 0
          break
        case 3:
          target = 0
          break
        case 4:
          target = window.innerWidth
          break
      }
      Bpoints.push(new PIXI.Point(xMin, yMin))
      for (let index = 0; index < BNum; index++) {
        let x = direction % 2 ? (xMax / BNum) * index : xMax
        let y = direction % 2 ? yMax : (yMax / BNum) * index
        if (index == BNum - 1) {
          direction % 2 ? (x = xMax) : (y = yMax)
        }
        Bpoints.push(new PIXI.Point(x, y))
      }
      Bpoints.push(new PIXI.Point(xMax, yMax))
      // 动画时间
      let tinum = Math.round(random(750, 500))
      // 设置不同方向要修改的属性 x|y
      let ouo = direction % 2 ? 'y' : 'x'
      for (let i = 1; i < BNum + 1; i++) {
        anime({
          targets: Bpoints[i],
          [ouo]: target,
          duration: tinum,
          easing: easing(),
          update: function () {
            if (i == 1) upDateMask(mask)
          },
          complete: function () {
            upDateMask(mask)
            nextTick(() => {
              if (backgroundAnimeArr.length > 1) {
                backgroundAnimeArr[0].removeAllListeners()
                app.stage.removeChild(backgroundAnimeArr[0])
                backgroundAnimeArr.shift()
              }
            })
            if (i == 1) setBackgroundColor()
          }
        })
      }

      // 更新/重绘
      function upDateMask(mask: PIXI.Graphics) {
        mask.clear()
        mask.beginFill(0x66ff33)
        mask.drawPolygon(Bpoints)
        mask.endFill()
      }
    }
    // 背景动画2
    const backgroundAnime2 = () => {
      const { stage } = app
      reColor = color
      const Bpoints = generatePolygonPoints(400 * radVNums(), 5, 0, 0)
      const myObject = {
        LR: 350
      }
      let brush = new PIXI.Graphics()
      brush.x = window.innerWidth / 2
      brush.y = window.innerHeight / 2
      brush.scale.set(3)
      stage.addChild(brush)
      backgroundAnimeArr.push(brush)
      anime({
        targets: myObject,
        LR: 0,
        duration: 800,
        easing: 'linear',
        update: () => {
          brush.beginFill(color)
          brush.moveTo(Bpoints[0].x, Bpoints[0].y)
          bezierStars(brush, Bpoints, generatePolygonPoints(myObject.LR * radVNums(), 5, 0, 0))
          brush.endFill()
        },
        complete: () => {
          nextTick(() => {
            if (backgroundAnimeArr.length > 1) {
              backgroundAnimeArr[0].removeAllListeners()
              stage.removeChild(backgroundAnimeArr[0])
              backgroundAnimeArr.shift()
            }
          })
          setBackgroundColor()
        }
      })
    }

    const backgroundAnime3 = () => {}

    // 音频部分
    const GabSound = (index: number) => {
      // 创建音频源头节点
      var ctx = new AudioContext()
      let source = ctx.createBufferSource()
      let analyser = ctx.createAnalyser()
      let gain = ctx.createGain() //音量节点
      gain.gain.value = 1
      // 播放
      async function playAudio() {
        const audioBuffer = await loadAudio()
        playSound(audioBuffer)
      }
      playAudio()
      // 加载
      async function loadAudio() {
        // 设置url
        const audioUrl = audioList[index]
        // AudioContext 发请求获取数据 数据类型为arraybuffer
        const res = await axios({ method: 'get', url: audioUrl, responseType: 'arraybuffer' })
        const audioBuffer = await ctx.decodeAudioData(res.data, function (decodeData) {
          return decodeData
        })
        return audioBuffer
      }
      async function playSound(audioBuffer: AudioBuffer) {
        // 设置数据
        source.buffer = audioBuffer
        //循环播放
        source.loop = false
        // 音频连接到ctx
        source.connect(gain)
        gain.connect(analyser)

        analyser.connect(ctx.destination)
        // 可以对音频做任何控制 接收一个 n 从 n 开始播放 默认0
        source.start(0) //播放
        // 清除
        source.onended = (e) => {
          ctx.close()
        }
        let dataArray = new Uint8Array(analyser.frequencyBinCount)
        initHeader(dataArray, analyser)
      }
    }
    // 跟随点击音效音频跳动 ...
    const initHeader = (dataArray: Uint8Array, analyser: AnalyserNode) => {
      let myObject = {
        scale: 0
      }
      sprite.on('pointerdown', (e: PIXI.InteractionEvent) => {})
      anime({
        targets: myObject,
        scale: 100,
        duration: 2000,
        update: function () {
          upRener()
        }
      })
      let averageFrequencyData = 0
      let sum = 0
      function upRener() {
        analyser.getByteFrequencyData(dataArray)

        sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i]
        }
        averageFrequencyData = sum / dataArray.length
        sprite.height = (500 + averageFrequencyData) * radNums()
      }
    }

    // ??? 背景音乐
    let flag = true
    function radNums() {
      return Math.sqrt(Math.pow(window.innerHeight, 2) + Math.pow(window.innerWidth, 2)) / 2136
    }
    const PlayBgm = () => {
      if (!flag) return
      flag = false
      let ctx = new AudioContext()
      let source = ctx.createBufferSource() // 创建音频源头节点
      let gain = ctx.createGain() //音量节点
      gain.gain.value = 0.5
      let analyser = ctx.createAnalyser()
      // 播放
      async function playAudio() {
        const audioBuffer = await loadAudio()
        playSound(audioBuffer)
      }
      playAudio()
      // 加载
      async function loadAudio() {
        let num = Math.round(random(0, 10))
        const audioUrl = Gbm
        const res = await axios({ method: 'get', url: audioUrl, responseType: 'arraybuffer' })
        const audioBuffer = await ctx.decodeAudioData(res.data, function (decodeData) {
          return decodeData
        })
        return audioBuffer
      }
      // 连接节点
      async function playSound(audioBuffer: AudioBuffer) {
        watch(
          () => props.BGM,
          (nv) => {
            gain.gain.value = nv ? 0.5 : 0
            source.connect(gain)
            gain.connect(analyser)
            analyser.connect(ctx.destination)
          }
        )
        source.buffer = audioBuffer
        source.loop = true
        source.connect(gain)
        gain.connect(analyser)
        analyser.connect(ctx.destination)
        source.start(0)
        let dataArray = new Uint8Array(analyser.frequencyBinCount)
        // 跟随背景音乐音频跳动 ...
        const initHeader = () => {
          let myObject = {
            scale: 0
          }
          sprite.x = window.innerWidth - 235 * radNums()
          sprite.y = window.innerHeight
          sprite.scale.set(0, 0)
          sprite.anchor.x = 0.5
          sprite.zIndex = 8
          sprite.interactive = true
          sprite.rotation = 3.14
          app.stage.addChild(sprite)
          sprite.on('pointerdown', (e: PIXI.InteractionEvent) => {
            console.log('...')
          })
          anime({
            targets: myObject,
            scale: radNums(),
            duration: 1000,
            update: function () {
              upDateMask()
            },
            complete: () => {
              app.ticker.add(() => {
                upRener()
              })
            }
          })
          function upDateMask() {
            sprite.scale.set(myObject.scale, myObject.scale)
          }
          let averageFrequencyData = 0
          let sum = 0
          function upRener() {
            analyser.getByteFrequencyData(dataArray)
            sum = 0
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i]
            }
            averageFrequencyData = sum / dataArray.length
            sprite.skew.x = (averageFrequencyData / 539) * radNums()
          }
        }
        initHeader()
      }
    }

    return {
      childClick,
      initApp,
      playInit,
      PlayBgm
    }
  }
})
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
.GabTap {
  position: absolute;
  top: 0;
  left: 0;
  // z-index: 199;
  // pointer-events: all;
  width: 100%;
  height: 100%;
}
</style>
