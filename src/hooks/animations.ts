// import * as PIXI from 'pixi.js'
import * as PIXI from 'pixi.js-legacy'
import '@pixi/graphics-extras'
import 'gsap'
import { maskParams } from './animationType'
import { random } from './random'
import { getRandom } from './color'
import anime from 'animejs/lib/anime.es.js'
// 多边形
export const Rectangle = (app: PIXI.Application) => {
  // 图形
  let pane: PIXI.Graphics = new PIXI.Graphics()
  // 精灵组
  let container: PIXI.Container = new PIXI.Container()
  container.zIndex=2
  pane.beginFill(0, 0)
  pane.drawRect(0, 0, window.innerWidth, window.innerHeight)
  // 旋转角度
  let rotation = random(0, 6.28)
  // 圆弧角度
  let startAngle = random(0, Math.PI)
  // 半径
  let radius = random(window.innerHeight / 8, window.innerHeight / 4)
  // 遮罩层
  let mask: PIXI.Graphics = new PIXI.Graphics()
  // 多边形
  let polygon: PIXI.Graphics = new PIXI.Graphics()
  // 遮罩层方向
  let direction = random(0, 1) > 0.5 ? true : false
  // 缩放
  let myObject = {
    scale: random(50, 200)
  }
  // 几边形
  let num = Math.floor(random(3, 10))
  // 线宽
  let lineWidth = random(4, 10)
  // 颜色
  let color = getRandom()
  // 多边形路径
  let points = generatePolygonPoints(radius, num)
  // 绘制
  polygon.lineStyle(lineWidth, color)
  polygon.drawPolygon(points)
  polygon.closePath()
  // 坐标
  polygon.position.x = window.innerWidth / 2
  polygon.position.y = window.innerHeight / 2
  // 变形
  polygon.pivot.x = window.innerWidth / 2
  polygon.pivot.y = window.innerHeight / 2
  // 遮罩层
  polygon.mask = mask
  polygon.rotation = rotation

  let TimelineAnime = new TimelineMax()
  // 遮罩层半径
  let maskParams: maskParams = {
    _radius: radius * 1.2,
    startAngle: startAngle,
    endAngle: startAngle
  }

  // 更新
  container.addChild(pane)
  pane.addChild(polygon)
  pane.addChild(mask)
  app.stage.addChild(container)
  // 旋转动画
  TimelineAnime.add(
    TweenMax.to(maskParams, 0.8, {
      endAngle: startAngle + (direction ? -2 : 2) * Math.PI,
      onUpdate: upDateMask,
      onUpdateParams: [mask, direction]
    })
  ).add(
    TweenMax.to(maskParams, 0.8, {
      startAngle: startAngle + (direction ? -2 : 2) * Math.PI,
      onUpdate: upDateMask,
      onUpdateParams: [mask, direction],
      onComplete: function () {
        container.removeChild(mask)
        container.removeChild(polygon)
        container.removeChild(pane)
        app.stage.removeChild(container)
      }
    })
  )
  // 缩放动画
  anime({
    targets: myObject,
    scale:  random(75, 200),
    duration: 800
  })
  // 更新/重绘
  function upDateMask(mask: PIXI.Graphics, direction: boolean) {
    mask.scale.set(myObject.scale / 100, myObject.scale / 100)
    polygon.scale.set(myObject.scale / 100, myObject.scale / 100)
    mask.clear()
    mask.beginFill(0x00ffff)
    mask.moveTo(0, 0)
    mask.arc(0, 0, maskParams._radius, maskParams.startAngle, maskParams.endAngle, direction)
    mask.position.x = window.innerWidth / 2
    mask.position.y = window.innerHeight / 2
  }
}

// 生成随机多边形 3~9
export function generatePolygonPoints(radius: number, num: number): PIXI.Point[] {
  let deltaRad = (Math.PI * 2) / num,
    points: PIXI.Point[] = []
  for (let index = 0; index < num; index++) {
    let x = Math.sin(index * deltaRad) * radius + window.innerWidth / 2,
      y = Math.cos(index * deltaRad) * radius + window.innerHeight / 2
    points.push(new PIXI.Point(x, y))

  }
  return points
}
