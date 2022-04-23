import { bgmList } from '../assets/audio'
import axios from 'axios'
import { random } from './random'
import Gbm from '../assets/audio/audios/Gbm2.mp3'
// ??? 背景音乐
let flag = true
export const PlayBgm = () => {
  if (!flag) return
  flag = false
  let ctx = new AudioContext()
  let source = ctx.createBufferSource() // 创建音频源头节点
  let gain = ctx.createGain() //音量节点
  gain.gain.value = 0.5
  let analyser = ctx.createAnalyser()
  // analyser.fftSize = 256;
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
    source.buffer = audioBuffer
    source.loop = true
    // source.connect(gain)
    source.connect(analyser)
    analyser.connect(ctx.destination)
    // gain.connect(ctx.destination)
    source.start(0)
    let dataArray = new Uint8Array(analyser.frequencyBinCount)


  }
}
