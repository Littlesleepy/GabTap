// import * as PIXI from 'pixi.js'
import * as PIXI from 'pixi.js-legacy'
import '@pixi/graphics-extras'
import 'gsap'
import { maskParams } from './animationType'
import { random } from './random'
import { getRandom } from './color'
import GM1PNG from '../assets/images/GM02.png'
import anime from 'animejs/lib/anime.es.js'
// 多边形
export const Rectangle = (app: PIXI.Application) => {
  // 图形
  let pane: PIXI.Graphics = new PIXI.Graphics()
  // 精灵组
  let container: PIXI.Container = new PIXI.Container()

  container.zIndex = 2
  pane.beginFill(0, 0)
  pane.drawRect(0, 0, window.innerWidth, window.innerHeight)
  // 旋转角度
  let rotation = random(0, 6.28)
  // 圆弧角度
  let startAngle = random(0, Math.PI)
  // 半径
  let radNums = Math.sqrt(Math.pow(window.innerHeight, 2) + Math.pow(window.innerWidth, 2))
  let radius = random(radNums / 20, radNums / 12)

  // 遮罩层
  let mask: PIXI.Graphics = new PIXI.Graphics()
  pane.mask = mask

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
  let X = random(radius, window.innerWidth - radius)
  let Y = random(radius, window.innerHeight - radius)
  mask.position.x = X
  mask.position.y = Y
  // 多边形路径
  let points = generatePolygonPoints(radius, num, X, Y)
  // 绘制
  // 多边形
  let polygon: PIXI.Graphics = new PIXI.Graphics()
  let pol = new PIXI.Graphics()
  polygon.lineStyle(lineWidth, color)
  polygon.drawPolygon(points)
  polygon.closePath()

  // 坐标
  polygon.position.x = X
  polygon.position.y = Y
  pol.position.x = X
  pol.position.y = Y

  let sprite: PIXI.Sprite = PIXI.Sprite.from(GM1PNG)
  sprite.anchor.set(0.5, 0.5)
  sprite.position.x = X
  sprite.position.y = Y
  // 变形
  polygon.pivot.x = X
  polygon.pivot.y = Y
  pol.pivot.x = X
  pol.pivot.y = Y
  // 遮罩层
  pol.lineStyle(lineWidth, color)
  pol.beginFill(color)
  pol.drawPolygon(points)
  pol.closePath()
  setTimeout(() => {
    pol.mask = sprite
  }, 10)
  // 旋转
  polygon.rotation = rotation
  pol.rotation = rotation

  let TimelineAnime = new TimelineMax()
  // 遮罩层半径
  let maskParams: maskParams = {
    _radius: radius * 1.2,
    startAngle: startAngle,
    endAngle: startAngle
  }

  // 更新
  container.addChild(pane)
  pane.addChild(pol)
  pane.addChild(sprite)
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
        container.removeChild(sprite)
        container.removeChild(polygon)
        container.removeChild(pane)
        app.stage.removeChild(container)
      }
    })
  )
  // 缩放动画
  anime({
    targets: myObject,
    scale: random(75, 200),
    duration: 800
  })
  // 更新/重绘
  function upDateMask(mask: PIXI.Graphics, direction: boolean) {
    mask.scale.set(myObject.scale / 100, myObject.scale / 100)
    pol.scale.set(myObject.scale / 100, myObject.scale / 100)
    polygon.scale.set(myObject.scale / 100, myObject.scale / 100)
    sprite.scale.set(myObject.scale / 250, myObject.scale / 250)
    mask.clear()
    mask.beginFill(0x00ffff)
    mask.moveTo(0, 0)
    mask.arc(0, 0, maskParams._radius, maskParams.startAngle, maskParams.endAngle, direction)
  }
}
// 箭头
let RearrowNum = random(1, 1)
let ThisRearrowNum = 0
export const Rearrow = (app: PIXI.Application) => {
  ThisRearrowNum++
  let triangleNum = random(100, 400)
  let triangleNumMax = triangleNum * 1.5
  let color = 0xffffff
  let reY = random(0, window.innerHeight)
  // 精灵组
  let container: PIXI.Container = new PIXI.Container()
  let containers: PIXI.Container = new PIXI.Container()
  // 箭头遮罩
  let arrow = new PIXI.Graphics()
  arrow.beginFill(getRandom(), 0)
  arrow.drawRect(0, 0, triangleNumMax, triangleNumMax)
  arrow.pivot.set(triangleNumMax / 2)
  arrow.rotation = 4.71
  arrow.endFill()
  arrow.y = reY
  // 三角形
  let triangle = new PIXI.Graphics()
  triangle.beginFill(color)
  triangle.drawPolygon([0, 0, triangleNum, 0, triangleNum / 2, triangleNum / 2])
  triangle.pivot.set(triangleNum / 2, 0)
  triangle.endFill()
  triangle.x = triangleNumMax / 2
  triangle.y = triangleNum
  container.addChild(triangle)
  // 矩形
  let tHNum = random(0.9, 2)
  console.log(tHNum);

  let rectangle = new PIXI.Graphics()
  rectangle.beginFill(color)
  rectangle.drawRect(0, 0, triangleNum / 2, triangleNum * tHNum)
  rectangle.pivot.set(triangleNum / 4, triangleNum * tHNum)
  rectangle.endFill()
  rectangle.x = triangleNumMax / 2
  rectangle.y = triangleNum
  container.addChild(rectangle)
  arrow.addChild(container)
  let pColor = getRandom()
  // 被遮罩的图形
  let panel = new PIXI.Graphics()
  panel.beginFill(pColor, 1)
  panel.drawRect(0, 0, triangleNumMax, triangleNumMax * (1 + tHNum))
  panel.pivot.set(triangleNumMax / 2, triangleNumMax * (1 + tHNum)/2)
  panel.endFill()
  panel.x = 0
  panel.y = reY
  panel.rotation = 4.71
  panel.mask = arrow

  containers.addChild(arrow)
  containers.addChild(panel)
  // containers.rotation = 0.3925
  app.stage.addChild(containers)

  let containerCircle: PIXI.Container
  // let CircleRandom= random(3.2, 4)
  const circles: PIXI.Graphics[] = []
  function setcircles() {
    let spacing = Math.sqrt(Math.pow(triangleNumMax / 2 / 7, 2) * 2)
    for (let c = 0; c < 7; c++) {
      containerCircle = new PIXI.Container()
      containerCircle.y = spacing * random(3.2, 4) * c
      for (let i = 1; i <= 6; i++) {
        let circle = new PIXI.Graphics()
        circle.beginFill(0xffffff, 1)
        circle.drawCircle(0, 0, random(10, spacing * 0.75))
        circle.endFill()
        circle.pivot.x = spacing * 0.75
        circle.pivot.y = spacing * 0.75
        circle.x = spacing * 2.5 * i
        circle.y = triangleNum - spacing
        containerCircle.addChild(circle)
        circles.push(circle)
      }
      containerCircle.pivot.set((spacing * 2 * 6) / 2,spacing * 0.75)
      containerCircle.x = triangleNumMax / 2 + (c * spacing) / 2
      containerCircle.rotation = 0.785
      panel.addChild(containerCircle)
    }
  }
  setcircles()

  anime({
    targets: panel,
    x: window.innerWidth * 1.5,
    duration: 10000,
    easing: 'easeOutSine',
    update: function () {
      upDateMask()
    },
    complete: function () {
      container.removeChild(triangle)
      container.removeChild(rectangle)
      container.removeChild(rectangle)
      arrow.removeChild(container)
      arrow.clear()
      panel.removeChild(containerCircle)
      panel.clear()
      circles.forEach((circle) => {
        circle.clear()
        containerCircle.removeChild(circle)
        circles.pop()
      })
      containers.removeChild(panel)
      containers.removeChild(arrow)
      app.stage.removeChild(containers)
    }
  })
  // 更新/重绘
  function upDateMask() {
    arrow.x = panel.x
  }
  if (ThisRearrowNum < RearrowNum) {
    setTimeout(() => {
      Rearrow(app)
    }, 39)
  } else {
    ThisRearrowNum = 0
    RearrowNum = random(1, 1)
  }
}

// 生成随机多边形 3~9
export function generatePolygonPoints(
  radius: number,
  num: number,
  X: number,
  Y: number
): PIXI.Point[] {
  let deltaRad = (Math.PI * 2) / num,
    points: PIXI.Point[] = []
  for (let index = 0; index < num; index++) {
    let x = Math.sin(index * deltaRad) * radius + X,
      y = Math.cos(index * deltaRad) * radius + Y
    points.push(new PIXI.Point(x, y))
  }
  return points
}
