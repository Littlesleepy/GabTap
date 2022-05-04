import { random } from './random'
const easingArr = [
  'easeOutSine',
  'easeOutQuad',
]
export const easing = () => {
  return easingArr[Math.round(random(0, easingArr.length - 1))]
}
const easingArrPlus = [
  'easeOutSine',
  'easeOutQuad',
  'easeInSine',
  'easeInOutQuart',
  'easeInCirc',
  'easeInQuint',
  'easeInOutSine',
  'easeInOutBounce',
  'easeOutBounce',
  'easeOutCirc',
  'easeInOutExpo',
]
export const easingPlus = () => {
  return easingArrPlus[Math.round(random(0, easingArr.length - 1))]
}
