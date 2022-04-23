import { random } from './random'
const easingArr = [
  'easeOutSine',
  'easeOutQuad',
]
export const easing = () => {
  return easingArr[Math.round(random(0, easingArr.length - 1))]
}
